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
    // TO-DO store the objects to make the lib faster
    var cachedObjects = {};
    var storedAttrs = {};
    var prefix = '';

    function set (newAttrs) {
        attrs = newAttrs;
        attrs.templateProvider = getTemplate;
        return attrs;
    }

    function extend (buildedClass, id) {
        // TO-DO validators
        return angular.extend(buildedClass, storedAttrs[id]);
    }

    function instance (object, id) {
        // TO-DO validators
        var instance = new object();
        return angular.extend(instance, storedAttrs[id]);
    }

    function getTemplate($http, $stateParams){
        return  $http.get(buildUrl($stateParams), {'headers': {'Accept': 'application/json'}})
                    .then (function (response) {
                        var data = response.data;
                        if(!data.properties) return getInvalidMessage('properties', response);
                        return templateManager(data.properties);;
                    }, function(){
                      console.error('error');
                    });
    }

    function getInvalidMessage (attr, response) {
        return 'Please check the json response of (<b>'+ response.config.method +'</b>) <b>' + response.config.url + '</b> has no <b>' + attr + '</b> attribute. <a href="http://json-schema.org/" target="_blank">More info</a>';
    }

    function buildUrl(params){
        var url = attrs.url;
        angular.forEach(params, function(value, key) {
            url = url.replace(':' + key, value)
        });
        // return url;

        // TO-DO temporary fix schema
        return prefix + '/data/pageSchema.json';
    }

    function templateManager(props){
        var template = '';
        if(!props.length) props = orderArr(props);
        angular.forEach(props, function(value, key) {
            var prop = props[key];
            // TO-DO create a class dynamically and attribute to the directive (temporary solution)
            var id = btoa(Math.random());
            storedAttrs[id] = prop;
            template += '<' + prop.type + ' ng-rest-id="\''+ id +'\'"></'+ prop.type + '>';
        
        });

        return template;
    }

    // TO-DO order data by propertyOrder and transform to array
    function orderArr (arr) {
        return arr;
    }
  }
})();
