# Lightweight Injection Provider Pattern (Injector.js)
Allows dependencies to be injected where one particular use case might be the injecting of an already instantiated XHR object. The code that handles the XHR instantiation would also deal with cross-browser workarounds and so would come in as a dependency to the function that required it independent of all the other code. I probably don't need to say this, but using dependencies in this way is helpful for testing as they can be easily mocked.
## Usage and Walkthrough
Consider our function below that just console.log out's the arguments available to it:
```javascript
function resurrectCat(arg1, arg2, arg3, arg4) {
    console.log("'this' binding");
    console.dir(this);
    console.log("\'this.abc\' = %s", this.abc);
    console.log("'arg1' = '%s'    'arg2' = '%s'", arg1, arg2);
    if (arguments.length > 2) { console.log(arg3); }
    if (arguments.length > 3) { console.log(arg4); }
}
```
1. Then to inject a value into our function
```javascript
var livesRemaining = 9;
function resurrectCat(lives, arg2, arg3, arg4) {
    console.log("'this' binding");
    console.dir(this);
    console.log("\'this.abc\' = %s", this.abc);
    console.log("'lives' = '%s'    'arg2' = '%s'",  lives, arg2);
    if (arguments.length > 2) { console.log("'arg3' = %s", arg3); }
    if (arguments.length > 3) { console.log("'arg4' = %s", arg4); }
}
```
**`resurrectCat.inject(livesRemaining).andExecuteWith('bears', 'woods');`**
### Expect
```
    > 'this' binding (see below)
    > Object
    > 'this.abc' = undefined
    > 'lives' = '9'    'arg2' = 'bears'
    > 'arg3' = 'woods'
```
2. To inject a value into a method but loose the implicit bind that gave it a meaningful 'this' context
```javascript
obj = { abc: "alphabet", myImplicitFn: resurrectCat };
obj.myImplicitFn.inject(livesRemaining).andExecuteWith('bears', 'woods');
```
**`obj.myImplicitFn.inject(livesRemaining).andExecuteWith('bears', 'woods');`**
### Expect
```
    > 'this' binding (see below)
    > Object
    > 'this.abc' = undefined
    > 'lives' = '9'    'arg2' = 'bears'
    > 'arg3' = woods
```
3. To inject a value into a method but this time honouring the implicit bind to 'obj' as 'this'
**`obj.myImplicitFn.inject(obj, livesRemaining).andExecuteWith('bears', 'woods');`**
### Expect
```
    > 'this' binding (see below)
    > Object
    > 'this.abc' = alphabet
    > 'lives' = '9'    'arg2' = 'bears'
    > 'arg3' = woods
```
