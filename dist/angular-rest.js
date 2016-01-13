/*
 * Angular Rest Route
 * Work with Angular UI Router (https://github.com/angular-ui/ui-router)
 * Created by: Fábio Picheli (github.com/picheli20)
 */
(function() {
  'use strict';

  angular
    .module('angular-rest', ['ui.router'])
    .provider('ngRest', [ngRestProvider])
    .factory('object', [objectFactory]);

    function ngRestProvider() {
        this.$get = function(){
            return {
                'extend' : extend,
                'instance' : instance
            };
        };

        this.set = set;

        var attrs = {};
        // TO-DO store the objects to make the lib faster
        var cachedObjects = {};
        var storedAttrs = {};
        var prefix = '';

        function set (newAttrs) {
            attrs = newAttrs;
            attrs.templateProvider = getTemplate;
            return attrs;
        }

        function instance (object, id) {
            if(validateId(id)) return {};
            var instance = new object();
            return extend(instance, id);
        }

        function extend (buildedClass, id) {
            if(validateId(id)) return {};
            if(buildedClass.setup) buildedClass.setup(storedAttrs[id].link);
            
            return angular.extend(buildedClass, storedAttrs[id].prop);
        }

        function validateId(id){
            if(!id) console.error('The object id is required.');
            if(!storedAttrs[id].prop) console.error('Object not fount.');

            return !storedAttrs[id].prop && !id;
        }

        function getTemplate($http, $stateParams){
            return  $http.get(buildUrl($stateParams), {'headers': {'Accept': 'application/json'}})
                        .then (function (response) {
                            var data = response.data;
                            if(!data.properties) return getInvalidMessage('properties', response);
                            return templateManager(data);;
                        }, function(){
                          console.error('error');
                        });
        }

        function getInvalidMessage (attr, response) {
            return 'Please check the json response of (<b>'+ response.config.method +'</b>) <b>' + response.config.url + '</b> has no <b>' + attr + '</b> attribute. <a href="http://json-schema.org/" target="_blank">More info</a>';
        }

        function buildUrl(params){
            var url = "/schema" + attrs.url;
            angular.forEach(params, function(value, key) {
                url = url.replace(':' + key, value)
            });


            return url;
            //return prefix + '/data/pageSchema.json';
        }

        function templateManager(data){
            var template = '';
            var props = data;
            if(!props.length) props = orderArr(props);
            angular.forEach(props, function(value, key) {
                var prop = props[key];
                // TO-DO create a class dynamically and attribute to the directive (temporary solution)
                var id = btoa(Math.random());
                storedAttrs[id] = {
                    'prop' : prop,
                    'link' : data.link
                };
                template += '<' + prop.type + ' ng-rest-id="\''+ id +'\'"></'+ prop.type + '>';

            });

            return template;
        }

        //Order by propertyOrder
        function orderArr (object) {
            var array = [];
            angular.forEach(object, function(value, key) {
                this.push(value);
            }, array);

            //Bubble sort
            var aux;
            for (var i = array.length - 1; i >= 1 ; i--) {
                for (var y = 0; y < i; y++) {
                    if(isNaN(array[y].propertyOrder)) array[y].propertyOrder = Infinity;
                    if(isNaN(array[y + 1].propertyOrder)) array[y + 1].propertyOrder = Infinity;
                    if(array[y].propertyOrder > array[y + 1].propertyOrder){
                        aux = array[y];
                        array[y] = array[y + 1];
                        array[y + 1] = aux;
                    }
                };
            };
            return array;
        }
    }
})();

(function() {
  'use strict';

  angular
    .module('angular-rest')
    .factory('Component', [ComponentFactory]);

    function ComponentFactory() {
        return function(){
            var self = this;
            this.setup = function(links){
                for (var i = 0; i < links.length; i++) {
                    var link = links[i];
                }
            }

            function create(link){
                if(!link.rel){
                  return;  
                }
                self[link.rel] = function(){
                    var a = this;
                    console.log(a);
                }//same function to be decided
            }
        }
    }
})();
