(function() {
  'use strict';

  angular
    .module('angular-rest')
    .factory('ngEntityManager', ['$http', 'util', 'ngEntityObject', ngEntityManagerFactory]);

    function ngEntityManagerFactory($http, util, ngEntityObject) {
        var attrs = {};
        // TO-DO store the objects to make the lib faster
        var storedAttrs = {};
        var objectRepres = 'properties';

        function getInvalidMessage(attr, response) {
            return 'Please check the json response of (<b>'+ response.config.method +'</b>) <b>' + response.config.url + '</b> has no <b>' + attr + '</b> attribute. <a href="http://json-schema.org/" target="_blank">More info</a>';
        }

        function buildUrl(params){
            var url = "/schema" + attrs.url;
            angular.forEach(params, function(value, key) {
                url = url.replace(':' + key, value)
            });
            // return url;
            return '/data/pageSchema.json';
        }

        function entitysCreation(data){
            //Create the page Object
            var po = storedAttrs[data.id] = data = new ngEntityObject(data);

            //Create and redering the templates
            var template = '';
            var props = data.properties;
            if(props && !props.length) props = util.bubbleSort(props, 'propertyOrder');
            
            
            angular.forEach(props, function(value, key){
                var id = util.random();
                template += '<' + value.type + ' ng-schema-id="\''+ id +'\'">';
                    value['parent'] = po;
                    if(!value['id']) value['id'] = id;
                    template += entitysCreation(value);
                template += '</'+ value.type + '>';
                
            });

            return template;
        }

        return {
            'getLayout' : function(attrsNew, $stateParams){
                attrs = attrsNew;
                return $http.get(buildUrl($stateParams), {'headers': {'Accept': 'application/json'}}).then (function (response) {
                    if(!response.data.properties) return getInvalidMessage('properties', response);
                    return entitysCreation(response.data);
                }, function(){
                  console.error('error');
                });
            },
            'getClass' : function(id){
                console.log(id);
                return storedAttrs[id];
            },
            'entitysCreation' : entitysCreation,
            'storedAttrs' : storedAttrs
        }
    }
})();