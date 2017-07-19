/*global angular: false, jstestdriver: false, beforeEach: false, afterEach: false, inject: false, spyOn: false, describe: false, beforeEach: false, inject: false, it: false, expect: false, module: false, result: false,  __xhr: false, __lifeLivedWell: false, __lives: false, __demonstrateSpecialSkill: false, $$lives: false */
/*jslint newcap: true, white: true, sloppy: true, vars: true, unparam: true */

/**
 * @author jaranf
 * @description Authored on 13/07/17
 */
describe("InjectorJs", function () {

  function stPetersReckoner(animal, sLivesMsg) {
    if (this.__lives <= 0) {
      if (this.__lifeLivedWell) {
        return "In passing from life to the Afterlife, Saint Peter welcomes you through these pearly gates"
      }
      return "You have expired you now are an \'ex-" + animal + "\'";
    }
    return "The " + animal + " has " + this.__lives + sLivesMsg;
  } //end fn 'stPetersReckoner()'

  function Person(name, gender) {
    this.name =  name;
    this.gender = gender;
  }
  (function(_p) {
    _p.getName = function() {
      return this.name;
    };
    _p.getGender = function() {
      return this.gender;
    };
    _p.setSpecialSkill = function(skill) {
      this.specialSkill = skill;
    };
    _p.brag = function() {
      var sMsg = "The thing I am best at is " +  this.specialSkill;
      if (this.__demonstrateSpecialSkill) {
        return this.__demonstrateSpecialSkill();
      }
      return sMsg;
    };
  })(Person.prototype);

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
  it("should allow multiple things to be injected (format of injection = one single object, multiple properties)", function () {
    var apiAfterInjection = stPetersReckoner.inject({lives: 0, lifeLivedWell: true});
    var result = apiAfterInjection.andExecuteWith("cat", " lives remaining");
    expect(result).toEqual("In passing from life to the Afterlife, Saint Peter welcomes you through these pearly gates");
  });
  it("should allow multiple things to be injected (format of injection MANY objects in an array)", function () {
    var apiAfterInjection = stPetersReckoner.inject([{lives: 0}, {lifeLivedWell: true}]);
    var result = apiAfterInjection.andExecuteWith("cat", " lives remaining");
    expect(result).toEqual("In passing from life to the Afterlife, Saint Peter welcomes you through these pearly gates");
  });
  it("should make allow custom object to be supplied which injected stuff is bound to (rather than a new empty proxy object each time)", function () {
    var person = {
      description: "female"
    };
    var resultThis = returnThis.inject({bindToObject: person}, {lives: 1}).andExecuteWith();
    expect(person.__lives).toBeUndefined();
    expect(resultThis.__lives).toEqual(1);
    expect(person.description).toEqual("female");
  });
  it("should make allow custom object AND binding suffix customisation to be supplied which injected stuff is bound to (i.e. this.«MY_SUFFIX»lives", function () {
    var person = {
      description: "female"
    };
    var resultThis = returnThis.inject({bindToObject: person, bindingSuffix: "$$"}, {lives: 1}).andExecuteWith();
    expect(person.$$lives).toBeUndefined();
    expect(resultThis.$$lives).toBeDefined();
    expect(resultThis.$$lives).toEqual(1);
    expect(person.description).toEqual("female");
  });
  it("should allow customisation of bind-object provided for injection and still work with multiple things being bound in", function () {
    var cat = {
      description: "tabby"
    };
    var apiAfterInjection = stPetersReckoner.inject({bindToObject: cat}, {lives: 0, lifeLivedWell: true});
    var result = apiAfterInjection.andExecuteWith("cat", " lives remaining");
    expect(result).toEqual("In passing from life to the Afterlife, Saint Peter welcomes you through these pearly gates");
  });
  it("should allow customisation of bind-object provided for injection and still work with multiple things being bound in (multipes via array)", function () {
    var cat = {
      description: "ginge"
    };
    var apiAfterInjection = stPetersReckoner.inject({bindToObject: cat}, [{lives: 0}, {lifeLivedWell: true}]);
    expect(cat.description).toEqual("ginge");
    var result = apiAfterInjection.andExecuteWith("cat", " lives remaining");
    expect(result).toEqual("In passing from life to the Afterlife, Saint Peter welcomes you through these pearly gates");
  });
  it("should NOT allow the injected thing to be altered after insertion", function () {
    var cat = {
      description: "tabby"
    };
    var apiAfterInjection = stPetersReckoner.inject({bindToObject: cat}, {lives: 0, lifeLivedWell: true});
    var result = apiAfterInjection.andExecuteWith("cat", " lives remaining");
    expect(result).toEqual("In passing from life to the Afterlife, Saint Peter welcomes you through these pearly gates");
    cat.__lives = 5; //No, where it seems like this may be a resurrection it isn't. After the thing has been injected it cannot be altered
    result = apiAfterInjection.andExecuteWith("cat", " lives remaining");
    expect(result).toEqual("In passing from life to the Afterlife, Saint Peter welcomes you through these pearly gates");
    //Note how the above result is not "The cat has 5 lives remaining"
  });
  it("should be unobtrusive in making the bind object the injected stuff goes in on un-enumerable", function () {
    var person = new Person("Rachel", "female");

    var arrAllEnumerables = [];
    var arrEnumerableAsHasOwns = [];
    for (var iO in person) {
      if (person.hasOwnProperty(iO)) {
        arrEnumerableAsHasOwns.push(iO);
      } else {
        arrAllEnumerables.push(iO);
      }
    } //next iO
    arrAllEnumerables = arrAllEnumerables.concat(arrEnumerableAsHasOwns);
    var expected = ['gender', 'name'];
    expect(arrEnumerableAsHasOwns.sort()).toEqual(expected);
    expected = ['brag', 'gender', 'getGender', 'getName', 'name', 'setSpecialSkill'];
    expect(arrAllEnumerables.sort()).toEqual(expected);
    expect(person.getName()).toEqual("Rachel");
    expect(person.getGender()).toEqual("female");

    person.setSpecialSkill("languages");
    arrAllEnumerables = [];
    arrEnumerableAsHasOwns = [];
    for (iO in person) {
      if (person.hasOwnProperty(iO)) {
        arrEnumerableAsHasOwns.push(iO);
      } else {
        arrAllEnumerables.push(iO);
      }
    } //next iO
    arrAllEnumerables = arrAllEnumerables.concat(arrEnumerableAsHasOwns);
    expected = ['gender', 'name', 'specialSkill'];
    expect(arrEnumerableAsHasOwns.sort()).toEqual(expected);
    expected = ['brag', 'gender', 'getGender', 'getName', 'name', 'setSpecialSkill', 'specialSkill'];
    expect(arrAllEnumerables.sort()).toEqual(expected);

    var result = person.brag.inject({bindToObject: person},
        {demonstrateSpecialSkill: function() {
          return "Sprachenzie Deutsch"
        }}).andExecuteWith();
    arrAllEnumerables = [];
    arrEnumerableAsHasOwns = [];
    for (iO in person) {
      if (person.hasOwnProperty(iO)) {
        arrEnumerableAsHasOwns.push(iO);
      } else {
        arrAllEnumerables.push(iO);
      }
    } //next iO
    arrAllEnumerables = arrAllEnumerables.concat(arrEnumerableAsHasOwns);
    expected = ['gender', 'name', 'specialSkill'];
    expect(arrEnumerableAsHasOwns.sort()).toEqual(expected);
    expected = ['brag', 'gender', 'getGender', 'getName', 'name', 'setSpecialSkill', 'specialSkill'];
    expect(arrAllEnumerables.sort()).toEqual(expected);
    expect(person.getName()).toEqual("Rachel");
    expect(person.getGender()).toEqual("female");
    expect(result).toEqual("Sprachenzie Deutsch");
  });
  it("should NOT allow the thing injected to overwrite an already existing property on the \'this\' object that the method is associated with.", function () {
    var cat = {
      description: "tabby"
    };

    expect(function() {     var apiAfterInjection = stPetersReckoner.inject({
      bindToObject: cat,
      bindingSuffix: "",
      errorIfOverwrite:true}, {description: null}); }).toThrow();
  });
  it("should allow for injected objects nested within objects and retain the nestedness", function () {
    var mock = {
                ENVINFO:  {
                            browser:  {
                                       isIE: false,
                                       isSafari: false,
                                        version: 52
                                      }
                          }
    };
    var environment = { "OS": "Windows 10"  };

    var apiAfterInjection = returnThis.inject({
      bindToObject: environment,
      bindingSuffix: "__"}, mock);
    var result = apiAfterInjection.andExecuteWith();
    expect(result["OS"]).toEqual("Windows 10");
    expect(result["__ENVINFO"]).toBeDefined();
    expect(result["__ENVINFO"]).toEqual(mock.ENVINFO);
    expect(result["__ENVINFO"]["browser"]["version"]).toEqual(52);
  });
});
 
