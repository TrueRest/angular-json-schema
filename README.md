#Angular Rest

#### Created pages using json schema and AngularJS!
---

Angular Rest is a framework created in [AngularJS](http://angularjs.org) based on Rest by [Roy T. Fielding](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm) for eneble the templates creation using [Json Schema](json-schema.org) and [Json Linking Data](http://json-ld.org/) and works with [ui-router](https://github.com/angular-ui/ui-router).

**Note:** *Angular Rest is under active development.

## Get Started

1. Install with bower:
```
bower install angular-rest-schema
```
2. Include `angular-rest.js` in your `index.html`
3. Add `'angular-rest'` to your main module's list of dependencies
```
angular.module('myApp', ['ui.router', 'angular-rest']);
```
3. Create the components (directives), the component tag NEED to have the same name of the `'type'` attribute from back-end. The component will recive a id (base64) in `'ngRestId'` atribute. The following example we create the component field.
```
(function() {
  'use strict';

  angular
    .module('angular')
    .directive('field', fieldDirective)
    .factory('fieldObj', fieldFact);

  /** @ngInject */
  function fieldDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'urlToTemplate',
      scope: {
          ngRestId: '='
      },
      controller: field,
      controllerAs: 'field',
      bindToController: true
    };

    return directive;
  }
  
  /** @ngInject */
  function field() {
  }

  function fieldFact(){
    return function(){
    }
  }
})();
```
4. Include `'ngRestProvider'` on the config with `'$stateProvider'`.
5. Use `'ngRestProvider.set()'` instead of [ui-router](https://github.com/angular-ui/ui-router) object. The only mandatory field is `'url'` but you can pass all the attributes from [ui-router](https://github.com/angular-ui/ui-router), they will keep work, the only exception is the `'template*'` (you dont need to pass this one).
```
$stateProvider.state('example', ngRestProvider.set({
  url: '/example/:id',
  parent: 'master'
}))
```
6. When the url is called will make a back-end's request of the page schema. The following schema will create a page with 3 fields and the `'lastName'` will be the first field.
```
{
	"title": "Example Schema",
	"type": "object",
	"properties": {
		"firstName": {
			"type": "field"
		},
		"lastName": {
			"type": "field",
			"propertyOrder" : 1
		},
		"age": {
			"description": "Age in years",
			"type": "field",
			"minimum": 0
		}
	},
	"required": ["firstName", "lastName"]
}
```
7. On the component you can acess the schema attributes like `'description'` instantiating a Object using the `'ngRest'` factory. Like the following example.
```
function field(ngRest, fieldObj) {
  var vm = this;
  vm.field = ngRest.instance(fieldObj, vm.ngRestId);
}
```
**Note:** The instance method will instance the fieldObj, put all the attributes and the object will be returned instanced. If the object is already instanced, you can use extend(instancedObject, ngRestId) method.
