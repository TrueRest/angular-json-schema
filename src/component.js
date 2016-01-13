(function() {
  'use strict';

  angular
    .module('angular-rest')
    .factory('Component', [ComponentFactory]);

    function ComponentFactory() {
        return function(){
            var self = this;
            self.setup = function(links){
                console.log(links);
                for (var i = 0; i < links.length; i++) {
                    var link = create(links[i]);
                }
            }

            function create(link){
                if(!link.rel){
                  return;  
                }
                self[link.rel] = function(){
                    if(link.schema && link.schema.required){
                        console.log(link.schema.required);
                    }
                }
            }
        }
    }
})();
