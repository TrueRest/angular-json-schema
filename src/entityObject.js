;(function () {
  'use strict';

  function ngEntityObjectFactory (ngUtil, $state, $window, $http) {
    return function (attrs) {
      var vm = this;
      angular.extend(vm, attrs);

      /**
       * Make the interpretation of the LINK of a object.
       *
       * Link example:
       * @example
       * <pre>
       *"actions" : [
       *  {
       *
       *    "rel" : "", //Could be anything, its the relative action of this link
       *    "href" : "", // Its the url of the action
       *    "mediaType" : "external",
       *    "stateGo" : "home", // A state to go, if its no setted, the link will open in new window
       *    "method" : "PUT",
       *    "schema" : {
       *      "required": [ ] //Array of the requireds elements of the schema object
       *    }
       *  }
       *]
       *</pre>
       *
       * @method makeRequest
       * @param {Object} Link A link valid object.
       * @param {Function} Callback A callback to be called.
       * @return {Object} Return a http request promise obejct or a url to go.
       */

      function makeRequest (link, callback) {
        if (!link.href){
          return;
        }

        var mediaType = link.mediaType;

        // If its a external link
        if(mediaType && mediaType === 'external'){
          if(link.stateGo){
            $state.go(link.stateGo);
          }else{
            $window.open(link.href);
          }
          return;
        }

        // Create the request
        var request = {
          headers : {}
        };
        request.url = link.href;
        request.method = link.method;
        request.headers['Content-Type'] = link.encType;

        request.url = ngUtil.mergeUrl(ngUtil.parseURL(request.url), request.url, vm);

        if(callback){
          callback();
        }
        // TODO check if has no params and put the params
        return $http(request);
      }

      /**
       * Make the validation the field according http://tools.ietf.org/html/draft-fge-json-schema-validation-00.
       *
       * TODO Make the validations of all the schema
       * @method validateField
       * @param {Object} scope A scope with the attributes.
       * @param {field} Schema The field to be validate.
       * @param {Function} validationError A callback function if has same error.
       * @return {Boolean} Return false if its all ok or true if has same error.
       */

      // TODO check all the field if its Ok according http://tools.ietf.org/html/draft-fge-json-schema-validation-00.
      function validateField(scope, field, validationError){
        var hasError = false;
        if(!scope[field]){
          hasError = true;
        }
        if (validationError && hasError){
          validationError(field);
        }
        return hasError;
      }

      /**
       * Check and call validateField for each field.
       *
       * TODO Make the validations of all the schema
       * @method validateSchema
       * @param {Object} Schema A schema valid object.
       * @param {Function} validationError A callback function if has same error.
       * @param {Object} self A scope with the attributes.
       * @return {Boolean} Return false if its all ok or true if has same error.
       */
      function validateSchema(schema, validationError, self){
        var hasError = false;
        if (schema && schema.required) {
          for (var i = 0; i < schema.required.length; i++) {
            hasError = validateField(self, schema.required[i], validationError);
            if(hasError){
              break;
            }
          }
        }
        return hasError;
      }

      // Create the abstract methods for the actions actions
      function create (link) {
        if (!link.rel) {
          return;
        }
        vm[link.rel] = function (object) {
          var self = this;
          // callback, beforeAction
          if (object.beforeAction){
            object.beforeAction();
          }

          if (!validateSchema(link.schema, object.validationError, self)){
            return makeRequest(link, object.callback);
          }
        };
      }

      // Create methods
      if (vm.actions){
        for (var i = 0; i < vm.actions.length; i++) {
          // ngEntityObject.entitysCreation(link)
          create(vm.actions[i]);
        }
      }
    };
  }

  /**
   * All the object creation and manipulation.
   *
   * @class ngEntityObject
   */
  angular
    .module('angular-json-schema')
    .factory('ngEntityObject', ['ngUtil', '$state', '$window', '$http', ngEntityObjectFactory]);
})();
