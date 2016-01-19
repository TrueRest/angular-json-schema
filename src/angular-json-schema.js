;/*
 * Angular Rest Route
 * Work with Angular UI Router (https://github.com/angular-ui/ui-router)
 * Created by: Fábio Picheli (github.com/picheli20)
 */
(function() {
  'use strict';

  function ngSchemaProvider() {
    var em;
    var vm = this;
    var attrs = {};

    function getTemplate(ngEntityManager, $stateParams) {
      return ngEntityManager.getLayout(attrs, $stateParams);
    }

    function validateId(id) {
      return !id;
    }

    /**
     * Instanciate a object and put all the methods
     *
     * @method extend
     * @param {Object} buildedClass A instanced object.
     * @param {id} id The ng-schema-id value of the component
     * @return {Object} Return a extended obejct
     */

    function extend(buildedClass, id) {
      if (validateId(id)) {
        return {};
      }
      return angular.extend(buildedClass, em.getClass(id));
    }

    /**
     * Instanciate a object and put all the methods
     *
     * @method instance
     * @param {Object} object A object to be instanced
     * @param {id} id The ng-schema-id value of the component
     * @return {Object} Return a instanced class with all the methods
     */
    function instance(Object, id) {
      if (validateId(id)) {
        return {};
      }
      var instance = {};
      return extend(instance, id);
    }

    function set(newAttrs) {
      attrs = newAttrs;
      attrs.templateProvider = ['ngEntityManager', '$stateParams', getTemplate];
      return attrs;
    }

    vm.$get = function(ngEntityManager) {
      em = ngEntityManager;
      return {
        'extend': extend,
        'instance': instance
      };
    };
    vm.set = set;
  }
  /**
   * Main provider.
   *
   * @class ngSchema
   */
  angular
    .module('angular-json-schema', ['ui.router'])
    .provider('ngSchema', [ngSchemaProvider]);
})();
