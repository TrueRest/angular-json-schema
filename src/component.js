(function() {
  'use strict';

  angular
    .module('angular-rest')
    .factory('Component', [ComponentFactory]);

    function ComponentFactory() {
        return function(){
            var self = this;
        }
    }
})();