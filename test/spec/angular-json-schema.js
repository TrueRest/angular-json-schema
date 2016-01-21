'use strict';

describe('Provider: angular-json-schema', function () {

  // load the controller's module
  beforeEach(module('angular-json-schema'));

  var schemaProvider;

  // Initialize the controller and a mock scope
  beforeEach(module(function (ngSchemaProvider) {
    schemaProvider = ngSchemaProvider;
  }));

  it('should be true', function () {
    expect(3).toBe(3);
  });
});
