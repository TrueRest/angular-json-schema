(function() {
  'use strict';
    function ngComponentFactory() {
        return function(){
        };
    }

angular
    .module('angular-json-schema')
    .factory('ngComponent', [ngComponentFactory]);
})();
