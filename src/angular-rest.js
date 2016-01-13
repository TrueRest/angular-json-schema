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