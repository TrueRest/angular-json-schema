(function() {
  'use strict';

  angular
    .module('angular-rest')
    .factory('entityManager', ['$http', 'util', 'pageObject', entityManagerFactory]);

    function entityManagerFactory($http, util, pageObject) {
        var attrs = {};
        // TO-DO store the objects to make the lib faster
        var cachedObjects = {};
        var storedAttrs = {};

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

        function pageEntityManager(data){
            //Create the page Object
            cachedObjects[data.id] = new pageObject(data);
            
            //Create and redering the templates
            var template = '';
            var props = data.properties;
            if(!props.length) props = util.bubbleSort(props, 'propertyOrder');

            angular.forEach(props, function(value, key) {
                var prop = props[key];
                var id = util.random();
                storedAttrs[id] = prop;
                storedAttrs[id]['parent'] = pageObject;
                template += '<' + prop.type + ' ng-rest-id="\''+ id +'\'"></'+ prop.type + '>';
            });

            return template;
        }

        return {
            'getLayout' : function(attrsNew, $stateParams){
                attrs = attrsNew;
                return $http.get(buildUrl($stateParams), {'headers': {'Accept': 'application/json'}}).then (function (response) {
                    if(!response.data.properties) return getInvalidMessage('properties', response);
                    return pageEntityManager(response.data);
                }, function(){
                  console.error('error');
                });
            }
        }
    }
})();