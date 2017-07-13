/*global angular: false, jstestdriver: false, beforeEach: false, afterEach: false, inject: false, spyOn: false, describe: false, beforeEach: false, inject: false, it: false, expect: false, module: false, : false */
/*jslint newcap: true, white: true, sloppy: true, vars: true, unparam: true */

/**
 * @author Christan Johansen
 * @description C.J.'s xUnit assert framework style unit tests re-authored by me, JaranF on 12/07/17 for BDD Jasmine
 */

describe("Pollyfill...tddjs.isOwnProperty", function () {
  it("should only perform as expected even if there is an overwriting hash on the object with the name 'hasOwnProperty'.", function () {
    var person = {
      name: "Christian",
      profession: "Programmer",
      location: "Norway"
    };
    person["hasOwnProperty"] = function() {
      throw Error("We've shadowed the native \'hasOwnProperty\' method [usually available in the prototype chain] with our own code");
    };
    var result = [];
    for (var prop in person) {
      if (tddjs.isOwnProperty(person, prop)) {
        result.push(prop);
      }
    }
    var expected = ["hasOwnProperty", "location", "name", "profession"];
    expect(result.sort()).toEqual(expected);
  });

});

describe("Pollyfill...tddjs.each", function () {
  it("should only iterate over own properies when tested in a loop", function () {
    var person = {
      name: "Christian",
      profession: "Programmer",
      location: "Norway"
    };
    var resultKeys = [];
    var resultValues = [];
    var expectedKeys = ["location", "name", "profession"];;
    var expectedValues = ["Christian", "Norway", "Programmer"];
    tddjs.each(person, function(key, value) {
      resultKeys.push(key);
      resultValues.push(value);
    });
    expect(resultKeys.sort()).toEqual(expectedKeys);
    expect(resultValues.sort()).toEqual(expectedValues);
  });
  it("should circumvent (<= IE8 AFAIK) IE's bug where dontEnum gets errantly taints identically named properties shadowing in-built inherited in-built properties", function () {
    var object = {
      // Properties with DontEnum on Object.prototype (if you have your own property with the same name on your own object IE errantly ignores it)
      toString: "toString",
      toLocaleString: "toLocaleString",
      valueOf: "valueOf",
      hasOwnProperty: "hasOwnProperty",
      isPrototypeOf: "isPrototypeOf",
      propertyIsEnumerable: "propertyIsEnumerable",
      constructor: "constructor"
    };
    var resultKeys = [];
    var resultValues = [];
    var expectedKeys = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
    var expectedValues = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
    tddjs.each(object, function(key, value) {
      resultKeys.push(key);
      resultValues.push(value);
    });
    expect(resultKeys.sort()).toEqual(expectedKeys);
    expect(resultValues.sort()).toEqual(expectedValues);
  });

});
