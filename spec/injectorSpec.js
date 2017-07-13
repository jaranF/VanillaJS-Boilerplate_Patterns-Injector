/*global angular: false, jstestdriver: false, beforeEach: false, afterEach: false, inject: false, spyOn: false, describe: false, beforeEach: false, inject: false, it: false, expect: false, module: false, : false */
/*jslint newcap: true, white: true, sloppy: true, vars: true, unparam: true */

/**
 * @author jaranf
 * @description Authored on 13/07/17
 */
describe("InjectorJs", function () {

  function stPetersReckoner(animal, sLivesMsg) {
    if (this.__lives <= 0) {
      return "You have expired you now are an \'ex-" + animal + "\'";
    }
    return "The " + animal + " " + this.__lives + sLivesMsg;
  } //end fn 'stPetersReckoner()'

  it("should return an object type", function () {
    var result = stPetersReckoner.inject({lives: 9});
    expect(Object.prototype.toString.call(result)).toEqual("[object Object]");
  });
});
 
