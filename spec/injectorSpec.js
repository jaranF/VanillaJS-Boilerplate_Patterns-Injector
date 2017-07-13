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
    return "The " + animal + " has " + this.__lives + sLivesMsg;
  } //end fn 'stPetersReckoner()'

  function returnThis() {
    return this;
  } //end fn

  it("should return an object type", function () {
    var result = stPetersReckoner.inject({lives: 9});
    expect(Object.prototype.toString.call(result)).toEqual("[object Object]");
  });
  it("should feature a \'andExecuteWith()\' on returned API", function () {
    var result = stPetersReckoner.inject({lives: 9});
    expect(result.andExecuteWith).toBeDefined();
    expect(typeof result.andExecuteWith).toEqual("function");
  });
  it("should inject params that get seen as \'__\' suffixed properties on the \'this\' object", function () {
    var result = returnThis.inject({xhr: "xhr"}).andExecuteWith();
    expect(result.__xhr).toBeDefined();
  });
  it("should make injected params available without interfering with function/method's signature", function () {
    expect(stPetersReckoner.length).toEqual(2); //Two params define the functions signature (i.e. named arguments 'animal' and 'sLivesMsg'
    var apiAfterInjection = stPetersReckoner.inject({lives: 0});
    expect(stPetersReckoner.length).toEqual(2); //Still the same, all good.
    var result = apiAfterInjection.andExecuteWith("cat", " lives remaining");
    expect(result).toEqual("You have expired you now are an \'ex-cat\'");
  });
  it("should make injected params available without interfering with function/method's params", function () {
    var apiAfterInjection = stPetersReckoner.inject({lives: 9});
    var result = apiAfterInjection.andExecuteWith("cat", " lives remaining");
    expect(result).toEqual("The cat has 9 lives remaining");
  });
});
 
