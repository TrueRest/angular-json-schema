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

      angular.forEach(props, function (value) {
        var id = ngUtil.random();
        template += '<' + value.type + ' ng-schema-id="\'' + id + '\'">';
        value.parent = po;
        if (!value.id) {
          value.id = id;
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
          // TODO change the rest-json-schema to me dynamic
          return entitysCreation(rest.convertResource('rest-json-schema', response.data));
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
