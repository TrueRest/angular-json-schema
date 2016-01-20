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
       *
       *"links" : [
       *
       *  {
       *
       *    "rel" : "", //Could be anything, its the relative action of this link
       *
       *    "href" : "", // Its the url of the action
       *
       *    "mediaType" : "external",
       *
       *    "stateGo" : "home", // A state to go, if its no setted, the link will open in new window
       *
       *    "method" : "PUT",
       *
       *    "schema" : {
       *
       *      "required": [ ] //Array of the requireds elements of the schema object
       *
       *    }
       *
       *  }
       *
       *]
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
        var requestURL = link.href;
        var mediaType = link.mediaType;

        // If its a external link
        if(mediaType && mediaType == 'external'){
          if(link.stateGo){
            $state.go(link.stateGo);
          }else{
            $window.open(requestURL);
          }
          return;
        }

        if (!link.method){
          link.method = 'GET';
        }

        requestURL = ngUtil.mergeUrl(ngUtil.parseURL(requestURL), requestURL, vm);


        if(callback){
          callback();
        }

        return $http({
          method: link.method,
          url: requestURL
        });
      }

      /**
       * Make the validation of the schema attributes according http://tools.ietf.org/html/draft-fge-json-schema-validation-00.
       *
       * TODO Make the validations of all the schema
       * @method validateSchema
       * @param {Object} Schema A schema valid object.
       * @param {Function} validationError A callback function if has same error.
       * @return {Boolean} Return if its all on or has same error.
       */
      function validateSchema(schema, validationError, self){
        var requiredError = false;
        if (schema && schema.required) {
          // TODO check all the field if its Ok
          for (var i = 0; i < schema.required.length; i++) {
            var label = schema.required[i];
            if (!self[label]) {
              requiredError = true;
              if (validationError){
                validationError(label);
              }
            }
          }
          console.log('Required infos', schema.required);
        }
        return requiredError;
      }

      // Create the abstract methods for the links actions
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

          var requiredError = validateSchema(link.schema, object.validationError, self);

          if (!requiredError){
            return makeRequest(link, object.callback);
          }
        };
      }

      // Create methods
      if (vm.links){
        for (var i = 0; i < vm.links.length; i++) {
          // ngEntityObject.entitysCreation(link)
          create(vm.links[i]);
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
