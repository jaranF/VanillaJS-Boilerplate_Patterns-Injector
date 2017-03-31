if (!Function.prototype.inject) {
  Function.prototype.inject = function() { 
    var argumentsToInject = arguments;
    var fnToInjectInto =  this;
    var slice = Array.prototype.slice;
  
    return function() {
     //receives inline direct args as well
     fnToInjectInto.apply(this, slice.call(argumentsToInject).concat(slice.call(arguments, 0)));
    }
  }; 
}
