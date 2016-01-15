(function() {
  'use strict';

  angular
    .module('angular-rest')
    .factory('ngUtil', [ngUtilFactory]);

    function ngUtilFactory() {
        return {
            'bubbleSort' : function(object, property){
                var array = [];
                angular.forEach(object, function(value, key) {
                    this.push(value);
                }, array);

                //Bubble sort
                var aux;
                for (var i = array.length - 1; i >= 1 ; i--) {
                    for (var y = 0; y < i; y++) {
                        if(array[y][property] && isNaN(array[y][property])) array[y][property] = Infinity;
                        if(array[y + 1][property] && isNaN(array[y + 1][property])) array[y + 1][property] = Infinity;
                        if(array[y][property] > array[y + 1][property]){
                            aux = array[y];
                            array[y] = array[y + 1];
                            array[y + 1] = aux;
                        }
                    };
                };
                return array;
            },
            'random' : function(){
                return btoa(Math.random());
            },
            'parseURL' : function(url){
                var matchs = [];
                var re = /{([\s\S]*?)}/gm;
                var match;
                
                while (match = re.exec(url)) {
                  matchs.push(match);
                }

                return matchs;
            }
        }
    }
})();
