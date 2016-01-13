(function() {
  'use strict';

  angular
    .module('angular-rest')
    .factory('pageObject', [pageObjectFactory]);

    function pageObjectFactory() {
        return function(attrs){
            angular.extend(this, attrs);
            
            self.setup = function(links){
                for (var i = 0; i < links.length; i++) {
                    var link = create(links[i]);
                }
            }

            function create(link){
                if(!link.rel){
                  return;  
                }
                self[link.rel] = function(callback, beforeAction){
                    if(beforeAction) beforeAction();

                    if(link.schema && link.schema.required){
                        //TO-DO check all the field if its Ok
                        for (var i = 0; i < link.schema.required.length; i++) {
                            var label = link.schema.required[i];
                            if(!self[label]){
                                console.error("The " + label + " attribute is required.");
                                // return;
                            }
                        };
                        console.log(link.schema.required);
                    }

                    makeRequest(link);

                    if(callback) callback();
                }
            }

            function makeRequest(link){
                if(!link.href) return;

                console.log("URL2 -> ", link);
            }
        }
    }
})();