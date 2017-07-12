/*global angular: false, jstestdriver: false, beforeEach: false, afterEach: false, inject: false, spyOn: false, describe: false, beforeEach: false, inject: false, it: false, expect: false, module: false, : false */
/*jslint newcap: true, white: true, sloppy: true, vars: true, unparam: true */

/**
 * @author Christian Johansen
 * @description Taken from his book "Test Driven JavaScript Development" and some functionality refactored by me, JaranF
 */
var tddjs = window.tddjs || {};

tddjs.isOwnProperty = (function () {
  var hasOwn = Object.prototype.hasOwnProperty;
  if (typeof hasOwn == "function") {
    return function (object, property) {
      return hasOwn.call(object, property);
    };
  } else {
    // Provide an emulation if you can live with possibly
    // inaccurate results
  } }());

tddjs.each = (function () {
  // Returns an array of properties that are not exposed
  // in a for-in loop on the provided object
  function unEnumerated(object, properties) {
    var length = properties.length;
    for (var i = 0; i < length; i++) {
      object[properties[i]] = true;
    }
    var enumerated = length;
    for (var prop in object) {
      if (tddjs.isOwnProperty(object, prop)) {
        enumerated -= 1;
        object[prop] = false;
      }
    }
    if (!enumerated) {
      return;
    }
    var needsFix = [];
    for (i = 0; i < length; i++) {
      if (object[properties[i]]) {
        needsFix.push(properties[i]);
      }
    }
    return needsFix;
  }
  var oFixes = unEnumerated({},
      ["toString", "toLocaleString", "valueOf",
        "hasOwnProperty", "isPrototypeOf",
        "constructor", "propertyIsEnumerable"]);
  var fFixes = unEnumerated(
      function () {}, ["call", "apply", "prototype"]);
  if (fFixes && oFixes) {
    fFixes = oFixes.concat(fFixes);
  }
  var needsFix = { "object": oFixes, "function": fFixes };
  return function (object, callback) {
    if (typeof callback != "function") {
      throw new TypeError("callback is not a function");
    }
    // Normal loop, should expose all enumerable properties
    // in conforming browsers
    for (var prop in object) {
      if (tddjs.isOwnProperty(object, prop)) {
        callback(prop, object[prop]);
      } }
    // Loop additional properties in non-conforming browsers
    var fixes = needsFix[typeof object];
    if (fixes) {
      var property;
      for (var i = 0, l = fixes.length; i < l; i++) {
        property = fixes[i];
        if (tddjs.isOwnProperty(object, property)) {
          callback(property, object[property]);
        } }
    } };
}());
