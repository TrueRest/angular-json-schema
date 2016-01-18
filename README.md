#Angular JSON Schema

[![Join the chat at https://gitter.im/picheli20/angular-json-schema](https://badges.gitter.im/picheli20/angular-json-schema.svg)](https://gitter.im/picheli20/angular-json-schema?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

#### Create pages and components using JSON Schema and AngularJS!
---

You can check a **demo project** [here](https://github.com/picheli20/example-json-schema) as example.

Angular JSON Schema is a framework created in [AngularJS](http://angularjs.org) based on Rest by [Roy T. Fielding](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm) for eneble the templates creation using [Json Schema](http://json-schema.org) and [Json Linking Data](http://json-ld.org/) and works with [ui-router](https://github.com/angular-ui/ui-router).

**Note:** *Angular Rest is under active development.

## Get Started

**(1)** Install with bower:
```
bower install angular-json-schema
```
**(2)** Include `angular-json-schema.js` in your `index.html`

**(3)** Add `'angular-json-schema'` to your main module's list of dependencies
```javascript
angular.module('myApp', ['ui.router', 'angular-json-schema']);
```
**(4)** Create the components (directives), the component tag NEED to have the same name of the `'type'` attribute from back-end. The component will recive a id (base64) in `'ngSchemaId'` atribute. The following example we create the component field.
```javascript
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
          ngSchemaId: '='
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
**(5)** Include `'ngSchemaProvider'` on the config with `'$stateProvider'`.
**(6)** Use `'ngSchemaProvider.set()'` instead of [ui-router](https://github.com/angular-ui/ui-router) object. The only mandatory field is `'url'` but you can pass all the attributes from [ui-router](https://github.com/angular-ui/ui-router), they will keep work, the only exception is the `'template*'` (you dont need to pass this one).
```javascript
$stateProvider.state('example', ngSchemaProvider.set({
  url: '/example/:id',
  parent: 'master'
}))
```
**(7)** When the url is called will make a back-end's request of the page schema (the same URL with "/schema" on start, the example will be `'/schema/example/:id'`. The following schema will create a page with 3 fields and the `'lastName'` will be the first field. If the `'properties'` is a object the lib will look for the propertyOrder, if its a array the order will be the array order
```javascript
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
**TO-DO:** Make the url more flexible.

**(8)** On the component you can acess the schema attributes like `'description'` instantiating a Object using the `'ngSchema'` factory. Like the following example.
```javascript
function field(ngSchema, fieldObj) {
  var vm = this;
  vm.field = ngSchema.instance(fieldObj, vm.ngSchemaId);
}
```
**Note:** The instance method will instance the fieldObj, put all the attributes and the object will be returned instanced. If the object is already instanced, you can use extend(instancedObject, ngRestId) method.

#Creating a component

All the components controllers need to use `'ngSchema'` factory to instance a class or extend using the methods `'ngSchema.instance(Obj, ngSchemaId)'` | `'ngSchema.extend(new Obj(), ngSchemaId)'`. Now the object has all the json attributes and the reference of the `Page Object` on `'parent'` attribute.

```javascript
function balance($scope, balanceObj, ngSchema) {
  var vm = this;
  vm.balance = ngSchema.instance(balanceObj, vm.ngRestId);
} 
```

Once you have your component class, you can make the requisition (create, search), on you json you need to have the JSON Hyper-Schema. Like the example:

```json
{
    "id": "http://some.site.somewhere/entry-schema#",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "schema for an fstab entry",
    "type": "object",
    "required": [ "storage" ],
    "properties": {...},
    "links": [
        {
            "rel": "comments",
            "href": "/{name}/comments"
        },
        {
            "rel": "search",
            "href": "/{name}/comments",
            "schema": {
                "type": "object",
                "properties": {
                    "searchTerm": {
                        "type": "string"
                    },
                    "itemsPerPage": {
                        "type": "integer",
                        "minimum": 10,
                        "multipleOf": 10,
                        "default": 20
                    }
                },
                "required": ["name"]
            }
        },
        {
            "title": "Post a comment",
            "rel": "create",
            "href": "/{name}/comments",
            "method": "POST",
            "schema": {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string"
                    }
                },
                "required": ["message"]
            }
        }
    ]
}
```
#This feature is under contruction, and can be changed.
