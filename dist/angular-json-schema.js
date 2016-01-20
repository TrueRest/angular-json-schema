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

;(function () {
  'use strict';
  function ngComponentFactory () {
    return function () {};
  }

  angular
    .module('angular-json-schema')
    .factory('ngComponent', [ngComponentFactory]);
})();

;(function () {
  'use strict';

  function ngEntityManagerFactory ($http, ngUtil, ngEntityObject) {
    var attrs = {};
    // TO-DO store the objects to make the lib faster
    var storedAttrs = {};

    function getInvalidMessage (attr, response) {
      return 'Please check the json response of (<b>' + response.config.method + '</b>) <b>' + response.config.url + '</b> has no <b>' + attr + '</b> attribute. <a href="http://json-schema.org/"" target="_blank">More info</a>';
    }

    function buildUrl (params) {
      var url = '/schema' + attrs.url;
      angular.forEach(params, function (value, key) {
        url = url.replace(':' + key, value);
      });
      // return url
      return '/data/pageSchema.json';
    }

    function entitysCreation (data) {
      // Create the page Object
      var po = storedAttrs[data.id] = data = new ngEntityObject(data);

      // Create and redering the templates
      var template = '';
      var props = data.properties;
      if (props && !props.length) {
        props = ngUtil.bubbleSort(props, 'propertyOrder');
      }

      angular.forEach(props, function (value, key) {
        var id = ngUtil.random();
        template += '<' + value.type + ' ng-schema-id="\'' + id + '\'">';
        value['parent'] = po;
        if (!value['id']) {
          value['id'] = id;
        }
        template += entitysCreation(value);
        template += '</' + value.type + '>';

      });

      return template;
    }

    return {
      'getLayout': function (attrsNew, $stateParams) {
        attrs = attrsNew;
        return $http.get(buildUrl($stateParams), {'headers': {'Accept': 'application/json'}}).then(function (response) {
          if (!response.data.properties){
            return getInvalidMessage('properties', response);
          }
          return entitysCreation(response.data);
        }, function () {
          console.error('error');
        });
      },
      'getClass': function (id) {
        return storedAttrs[id];
      },
      'entitysCreation': entitysCreation,
      'storedAttrs': storedAttrs
    };
  }
  /**
  * Manage all the entitys for the template creation, etc...
  *
  * @class ngEntityManager
  */

  angular
    .module('angular-json-schema')
    .factory('ngEntityManager', ['$http', 'ngUtil', 'ngEntityObject', ngEntityManagerFactory]);
})();

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
      function validateSchema(schema, validationError){
        var requiredError = false;
        if (schema && schema.required) {
          // TODO check all the field if its Ok
          for (var i = 0; i < schema.required.length; i++) {
            var label = schema.required[i];
            if (!vm[label]) {
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
          // callback, beforeAction
          if (object.beforeAction){
            object.beforeAction();
          }

          var requiredError = validateSchema(link.schema, object.validationError);

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

;(function () {
  'use strict';

  angular
    .module('angular-json-schema')
    .factory('ngUtil', [ngUtilFactory])

  function ngUtilFactory () {
    return {
      'bubbleSort': function (object, property) {
        var array = [];
        angular.forEach(object, function (value, key) {
          this.push(value);
        }, array);

        // Bubble sort
        var aux;
        for (var i = array.length - 1; i >= 1; i--) {
          for (var y = 0; y < i; y++) {
            if (array[y][property] && isNaN(array[y][property])){
              array[y][property] = Infinity;
            }
            if (array[y + 1][property] && isNaN(array[y + 1][property])){
              array[y + 1][property] = Infinity;
            }
            if (array[y][property] > array[y + 1][property]) {
              aux = array[y];
              array[y] = array[y + 1];
              array[y + 1] = aux;
            }
          }
        }
        return array;
      },
      'random': function () {
        return btoa(Math.random());
      },
      'parseURL': function (url) {
        var matchs = [];
        var re = /{([\s\S]*?)}/gm;
        var match;

        while (match = re.exec(url)){
          matchs.push(match);
        }

        return matchs;
      },
      'mergeUrl' : function(params, requestURL, vm){
        for (var i = 0; i < params.length; i++) {
          var param = params[i];
          requestURL = requestURL.replace(param[0], vm[param[1]]);
        }
        return requestURL;
      }
    };
  }
})();
