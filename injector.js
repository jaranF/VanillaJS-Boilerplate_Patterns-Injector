if (!Function.prototype.inject) {
  Function.prototype.inject = function(bindToObj, argsToInjectOriginal) {
    var argsToInject = [], fnToInjectInto =  this, toString = Object.prototype.toString, slice = Array.prototype.slice;
    bindToObj = typeof bindToObj === "undefined" ? {} : bindToObj;
    if (typeof argsToInjectOriginal === "undefined") {
      argsToInjectOriginal = bindToObj;
      bindToObj = {};
    }
    if (toString.call(argsToInjectOriginal) === "[object Array]") {
      argsToInject = argsToInject.concat(argsToInjectOriginal);
    } else {
      argsToInject[0] = argsToInjectOriginal;
    }
    return {
      andExecuteWith: function() {
        //inline direct params are received as args as per usual. i.e. the arguments object.
        return fnToInjectInto.apply(bindToObj, argsToInject.concat(slice.call(arguments, 0)));
      }
    };
  };
}