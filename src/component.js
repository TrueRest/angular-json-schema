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