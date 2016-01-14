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
        var em;
        this.$get = function(entityManager){
            em = entityManager;
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
            return angular.extend(buildedClass, em.getClass(id));
        }

        function set(newAttrs) {
            attrs = newAttrs;
            attrs.templateProvider = ['entityManager', '$stateParams', getTemplate];
            return attrs;
        }

        function validateId(id){
            return !id;
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
            var po = cachedObjects[data.id] = new pageObject(data);
            
            //Create and redering the templates
            var template = '';
            var props = data.properties;
            if(!props.length) props = util.bubbleSort(props, 'propertyOrder');

            angular.forEach(props, function(value, key) {
                var prop = props[key];
                var id = util.random();
                storedAttrs[id] = prop;
                storedAttrs[id]['parent'] = po;
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
            },
            'getClass' : function(id){
                return storedAttrs[id];
            }
        }
    }
})();
(function() {
  'use strict';

  angular
    .module('angular-rest')
    .factory('pageObject', ['util', pageObjectFactory]);

    function pageObjectFactory(util) {
        return function(attrs){
            var vm = this;
            angular.extend(vm, attrs);
            
            for (var i = 0; i < vm.links.length; i++) create(vm.links[i]);
            
            // Create the abstract methods for the links actions
            function create(link){
                if(!link.rel){
                  return;  
                }
                vm[link.rel] = function(callback, beforeAction){
                    if(beforeAction) beforeAction();

                    var requiredError = false;

                    if(link.schema && link.schema.required){
                        //TO-DO check all the field if its Ok
                        for (var i = 0; i < link.schema.required.length; i++) {
                            var label = link.schema.required[i];
                            if(!vm[label]){
                                console.error('The ' + label + ' attribute is required.');
                                requiredError = true;
                                // return;
                            }
                        }
                        console.log('Required infos', link.schema.required);
                    }

                    if(!requiredError) makeRequest(link);

                    if(callback) callback();
                }
            }

            function makeRequest(link){
                if(!link.href) return;
                var requestURL = link.href;

                if(!link.method) link.method = 'GET';
                var params = util.parseURL(link.href);
                for (var i = 0; i < params.length; i++) {
                    var param = params[i];
                    console.log(requestURL.replace(param[0], vm[param[1]]));

                }
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
            },
            'parseURL' : function(url){
                var matchs = [];
                var re = /{([\s\S]*?)}/gm;
                while (match = re.exec(url)) {
                  matchs.push(match);
                }

                return matchs;
            }
        }
    }
})();
