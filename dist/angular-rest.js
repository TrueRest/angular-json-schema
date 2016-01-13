/*
 * Angular Rest Route
 * Work with Angular UI Router (https://github.com/angular-ui/ui-router)
 * Created by: Fábio Picheli (github.com/picheli20)
 */
(function() {
  'use strict';

  angular
    .module('angular-rest', ['ui.router'])
    .provider('ngRest', [ngRestProvider]);

    function ngRestProvider() {
        this.$get = function(){
            return {
                'extend' : extend,
                'instance' : instance
            };
        };

        this.set = set;
        var attrs = {};

        function instance (object, id) {
            if(validateId(id)) return {};
            var instance = new object();
            return extend(instance, id);
        }

        function extend (buildedClass, id) {
            if(validateId(id)) return {};
            
            return angular.extend(buildedClass, storedAttrs[id].prop);
        }

        function set(newAttrs) {
            attrs = newAttrs;
            attrs.templateProvider = ['entityManager', '$stateParams', getTemplate];
            return attrs;
        }

        function validateId(id){
            if(!id) console.error('The object id is required.');
            if(!storedAttrs[id].prop) console.error('Object not fount.');

            return !storedAttrs[id].prop && !id;
        }

        function getTemplate(entityManager, $stateParams){
            return entityManager.getLayout(attrs, $stateParams);
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
        }
    }
})();
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
            var pageObj = cachedObjects[data.id] = new pageObject(data);
            setupPageObject(pageObj);

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

        function setupPageObject(PageObj){
            console.log('setupPageObject', PageObj);
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
(function() {
  'use strict';

  angular
    .module('angular-rest')
    .factory('util', [utilFactory]);

    function utilFactory() {
        return {
            'bubbleSort' : function(object, property){
                var array = [];
                angular.forEach(object, function(value, key) {
                    this.push(value);
                }, array);

                //Bubble sort
                var aux;
                for (var i = array.length - 1; i >= 1 ; i--) {
                    for (var y = 0; y < i; y++) {
                        if(array[y][property] && isNaN(array[y][property])) array[y][property] = Infinity;
                        if(array[y + 1][property] && isNaN(array[y + 1][property])) array[y + 1][property] = Infinity;
                        if(array[y][property] > array[y + 1][property]){
                            aux = array[y];
                            array[y] = array[y + 1];
                            array[y + 1] = aux;
                        }
                    };
                };
                return array;
            },
            'random' : function(){
                return btoa(Math.random());
            }
        }
    }
})();
