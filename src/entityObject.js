(function() {
  'use strict';


    function ngEntityObjectFactory(ngUtil) {
        return function(attrs){
            var vm = this;
            angular.extend(vm, attrs);

            if(vm.links)
                for (var i = 0; i < vm.links.length; i++){
                    // ngEntityObject.entitysCreation(link);
                    create(vm.links[i]);
                }


            // Create the abstract methods for the links actions
            function create(link){
                if(!link.rel){
                  return;
                }
                vm[link.rel] = function(object){
                    // callback, beforeAction
                    if(object.beforeAction) object.beforeAction();

                    var requiredError = false;

                    if(link.schema && link.schema.required){
                        //TO-DO check all the field if its Ok
                        for (var i = 0; i < link.schema.required.length; i++) {
                            var label = link.schema.required[i];
                            if(!vm[label]){
                                console.error('The ' + label + ' attribute is required.');
                                if(object.validationError) object.validationError(label);
                                requiredError = true;
                                // return;
                            }
                        }
                        console.log('Required infos', link.schema.required);
                    }

                    if(!requiredError) makeRequest(link);

                    if(object.callback) object.callback();
                }
            }

            function makeRequest(link){
                if(!link.href) return;
                var requestURL = link.href;

                if(!link.method) link.method = 'GET';
                var params = ngUtil.parseURL(link.href);
                for (var i = 0; i < params.length; i++) {
                    var param = params[i];
                    requestURL = requestURL.replace(param[0], vm[param[1]]);
                }
                console.log('final url', requestURL);
            }
        }
    }
    
  angular
    .module('angular-json-schema')
    .factory('ngEntityObject', ['ngUtil', ngEntityObjectFactory]);
})();
