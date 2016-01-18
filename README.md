#Angular JSON Schema
**This is a experimental (alpha) package, do not use it for production, api is expected to change**

[![Join the chat at https://gitter.im/TrueRest/angular-json-schema](https://badges.gitter.im/TrueRest/angular-json-schema.svg)](https://gitter.im/TrueRest/angular-json-schema?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

#### Create pages and components using JSON Schema and AngularJS!
---

You can check a **demo project** [here](https://github.com/TrueRest/example-json-schema) as example.

Angular JSON Schema is a framework created in [AngularJS](http://angularjs.org) based on Rest by [Roy T. Fielding](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm) for eneble the templates creation using [Json Schema](http://json-schema.org) and [Json Linking Data](http://json-ld.org/) and works with [ui-router](https://github.com/angular-ui/ui-router).

**Note:** *Angular Rest is under active development.

## Get Started

You can find the instalation documentation [here](https://angular-json-schema.readme.io/docs/getting-started).

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
