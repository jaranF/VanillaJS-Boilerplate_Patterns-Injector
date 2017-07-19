if (!Function.prototype.inject) {
  Function.prototype.inject = function(injectionDefinition) {
    var arrArgsToInject, fnToInjectInto =  this, objInjectedOnto;
    var bindingSuffix = "__", errorIfOverwrite =false;
    var toString = Object.prototype.toString, slice = Array.prototype.slice;

    function iterateBindItems(colThingsToInject, objAttachTo) {
      tddjs.each(colThingsToInject, function(itemKeyName, itemValue) {
        if (toString.call(colThingsToInject) === "[object Array]") {
          iterateBindItems(itemValue, objAttachTo);
        } else {
          var sInjectedItemName = bindingSuffix + itemKeyName;
          if (errorIfOverwrite && typeof objAttachTo[sInjectedItemName] !== "undefined") { //tddjs.isOwnProperty(objAttachTo, bindingSuffix + itemKeyName)
            throw new Error("Injected item would overwrite an existing property");
          } else {
            objAttachTo[sInjectedItemName] = itemValue;
          }
        }
      });
    }

    if (toString.call(injectionDefinition) === "[object Object]" && injectionDefinition.bindToObject) {
      objInjectedOnto = Object.create(injectionDefinition.bindToObject);
      errorIfOverwrite = !!injectionDefinition.errorIfOverwrite;
      bindingSuffix = typeof injectionDefinition.bindingSuffix !== "undefined" ? injectionDefinition.bindingSuffix : bindingSuffix;
      arrArgsToInject = slice.call(arguments, 1);
    }
    else {
      objInjectedOnto = {};
      arrArgsToInject = slice.call(arguments, 0);
    }
    iterateBindItems(arrArgsToInject, objInjectedOnto);
    return {
      andExecuteWith: function() {
        //inline direct params are received as args as per usual. i.e. the arguments object.
        return fnToInjectInto.apply(objInjectedOnto, slice.call(arguments, 0));
      }
    };
  };
}
//var myObj.func.inject({lives: 9}).andExecuteWith("cats", "lives remaining:");
/*function stPetersReckoner(animal, sLivesMsg) {
 }
 stPetersReckoner.inject([{lives: 9}, {lifeLivedWell: true}]).andExecuteWith("cats", "lives remaining:");
 //injects 9 and {lifeLivedWell: true} onto the this object that the stPetersReckoner sees
 stPetersReckoner.inject({bindToObj: {}, bindingSuffix: "__", errorIfOverwrite: false}, {lives: 9}, {lifeLivedWell: true}).andExecuteWith("cats", "lives remaining:");
 //injects 9 and {lifeLivedWell: true} onto the this object that the stPetersReckoner sees
 stPetersReckoner.inject([{lives: 9}, {lifeLivedWell: true}]).andExecuteWith("cats", "lives remaining:");
 //injects 9 and {lifeLivedWell: true} onto the this object that the stPetersReckoner sees#
 stPetersReckoner.inject({bindToObj: {}, bindingSuffix: "__", errorIfOverwrite: false}, [ {lives: 9}, {lifeLivedWell: true} ]).andExecuteWith("cats", "lives remaining:");
 //injects 9 and {lifeLivedWell: true} onto the this object that the stPetersReckoner sees
 */