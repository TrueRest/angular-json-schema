/*
 * Angular Rest Route
 * Work with Angular UI Router (https://github.com/angular-ui/ui-router)
 * Created by: Fábio Picheli (github.com/picheli20)
 */
(function() {
  'use strict';

  angular
    .module('angular-json-schema', ['ui.router'])
    .provider('ngSchema', [ngSchemaProvider]);

    function ngSchemaProvider() {
        var em;
        this.$get = function(ngEntityManager){
            em = ngEntityManager;
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
            attrs.templateProvider = ['ngEntityManager', '$stateParams', getTemplate];
            return attrs;
        }

        function validateId(id){
            return !id;
        }

        function getTemplate(ngEntityManager, $stateParams){
            return ngEntityManager.getLayout(attrs, $stateParams);
        }
    }
})();

(function() {
  'use strict';

  angular
    .module('angular-json-schema')
    .factory('ngComponent', [ngComponentFactory]);

    function ngComponentFactory() {
        return function(){
            var self = this;
        }
    }
})();
(function() {
  'use strict';

  angular
    .module('angular-json-schema')
    .factory('ngEntityManager', ['$http', 'ngUtil', 'ngEntityObject', ngEntityManagerFactory]);

    function ngEntityManagerFactory($http, ngUtil, ngEntityObject) {
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
            if(props && !props.length) props = ngUtil.bubbleSort(props, 'propertyOrder');


            angular.forEach(props, function(value, key){
                var id = ngUtil.random();
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
                return storedAttrs[id];
            },
            'entitysCreation' : entitysCreation,
            'storedAttrs' : storedAttrs
        }
    }
})();

(function() {
  'use strict';

  angular
    .module('angular-json-schema')
    .factory('ngEntityObject', ['ngUtil', ngEntityObjectFactory]);

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
})();

(function() {
  'use strict';

  angular
    .module('angular-json-schema')
    .factory('ngUtil', [ngUtilFactory]);

    function ngUtilFactory() {
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
                var match;

                while (match = re.exec(url)) {
                  matchs.push(match);
                }

                return matchs;
            }
        }
    }
})();
