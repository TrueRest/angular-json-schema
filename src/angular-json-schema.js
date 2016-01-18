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
