# Lightweight Injection Provider Pattern (Injector.js)-
Allows dependencies to be injected where one particular use case might be the injecting of an already instantiated XHR object. Why have I felt the need to create this injector? Well it's mainly to do with my time at the Lawn Tennis Association...namely:
1. A previous JavaScript coder(s) had left behind some nastily coded solutions. One particular function (`LTA.AgeGroupCalculator`) has c. 250 lines of code; no fewer than five inner helper functions and all the jQuery event bindings / GUI updates in there as well. Bascially it is untestable. This despite the core concern &ndash;  date mathematics calculating a tennis player's age on the day the end of Summer / Winter season falls &ndash; being something naturally lends itself to unit testing.
2. Edge cases and the desire to keep functions/methods small, clean and modular. In creating my CSVexporter code I was faced with the problem of having to use a cumbersome workaround (requiring AJAX) for just one browser (Safari with it's `window.URL.createObjectURL(blob)` ideosyncrasy. Sure I could use `$.http()` or `$http.get()` (jQuery and AngularJS respectively) by making that assumption I am forcing my assumption on other users. Not what what I want to do. Neither do I want to have to clutter up my 'CSVexporter' code with  XMLHTTPRequest boilerplate so injection seems ideal
3. I am aiming for 'single responsibility' modularity as much as possible to ensure the testability of my code and injection really helps with that. In fact, if you get it right you can use injection to further a SOLID methodology (a lesson the Lawn Tennis Association solely needs to learn)

## Versions
Version | Description
------- | -------------
1.0.0   | Fully working and tested apart from one feature 'errorIfOverwrite' unimplemented and one TODO improvement.
1.0.1   | 'errorIfOverwrite' and tests demonstrating unobtrusiveness.(was a TODO [see above] but no extra code was reqd.

## Usage and Walkthrough
I've got a function called `stPetersReckoner` and I want to inject some stuff into it.
```javascript
  function stPetersReckoner(animal, sLivesMsg) {
    if («SOMEHOW_INJECTEDX» lives <= 0) {
      if («SOMEHOW_INJECTEDX» lifeLivedWell) {
        return "In passing from life to the Afterlife, Saint Peter welcomes you through these pearly gates"
      }
      return "You have expired you now are an \'ex-" + animal + "\'";
    }
    return "The " + animal + " has " + this.__lives + sLivesMsg;
  } //end fn 'stPetersReckoner()'
```
* I want to be able to allow `stPetersReckoner()` to return a value (in this case a string) without injection interfering.
* I want to NOT pollute the global window.
* I do NOT want `stPetersReckoner()` to have extra arguments passed into it at runtime that aren't visible in the function definition (i.e. `animal` and `sLivesMsg` is what it is and what it should stay)
* In use, I want the API to look like <code>«FUNCTION».<strong>inject(</strong>[{lives: 9}]<strong>)</strong>.<strong>andExecuteWith(</strong>"cat", " lives remaining"<strong>)</strong></code>

With consideration to the above, I elected to put the things I inject onto the 'this' object which every function's execution context gets for free. The extra concern that raises is that you may be injecting something into an instance reference whereby  your function was used as a constructor and so already uses "`<strong>this</strong>`" in a meaningful way. To circumvent this I decided to allow he user to specify a custom prefix; i.e whatever is injected is prepended with the suffix as it is defined on the object that gets bound to "`<strong>this</strong>`". Secondly, if there is going to be a name clash then the injector can throw an error as otherwise you may waste a lot of time chasing hard to to find bugs.

### Usage Example 1 (Simple Scenario: One thing being injected)
Try it on [jsFiddle](https://jsfiddle.net/jaranF/vt58y0b9/1/)
```javascript
function stPetersReckoner(animal, sLivesMsg) {
  if (this.__lives <= 0) {
    if (this.__lifeLivedWell) {
      return "In passing from life to the Afterlife, Saint Peter welcomes you through these pearly gates"
    }
    return "You have expired you now are an \'ex-" + animal + "\'";
  }
  return "The " + animal + " has " + this.__lives + sLivesMsg;
}
```
**The call to make the injection happen:**
```javascript
stPetersReckoner.inject([{lives: 9}]).andExecuteWith("cat", " lives remaining");
```

### Usage Example 2 (Multiple things being injected)
```javascript
stPetersReckoner.inject([{lives: 0}, {lifeLivedWell: true}]).andExecuteWith("cat", " lives remaining");
```

### Usage Example 3 (Multiple things being injected - alternative technique)
```javascript
stPetersReckoner.inject({lives: 0, lifeLivedWell: true}).andExecuteWith("cat", " lives remaining");
```
The above culminates in the exactly same result as Example 2

### Usage Example 4 (Customising the suffix to avoid a name clash)
```javascript
var dog = {
  description: "German Shepherd",
  __lives: "In Kennel",
  __awards: "Best In Show"
}
var stPeterSays = stPetersReckoner.inject({bindToObject: dog, bindingSuffix: "$$"}, {lives: 1}).andExecuteWith("dog", " lives remaining");
console.log(stPeterSays === "The dog has 1 lives remaining"); //Expect true
console.log(dog.__lives === "In Kennel"); //Expect true...proving no name clash
console.log(dog.__awards === "Best In Show"); //Expect true
```

### Usage Example 4 (Deliberately generating an error when there is a clash)
```javascript
var dog = {
  description: "German Shepherd",
  __lives: "In Kennel",
  __awards: "Best In Show"
}
var stPeterSays = stPetersReckoner.inject({bindToObject: dog, errorIfOverwrite: true}, {lives: 1}).andExecuteWith("dog", " lives remaining");
```

### TODO
Although the ability to customise a suffix goes someway to making the injection unobtrusive it would be better if the binds only stay 'alive' for the duration of the execution of function they are tied to. It would be better still if they were perhaps non-enumerable from the function i.e. <code><strong>Object.create()</strong></code> could help here.

# XMLHttpRequest Class Wrapper For Cross-Browser Compatibility
## Usage
**`xhr.ajax({ url:"http://localhost/1.php", success: function(s) { alert(s); }, type: "GET"});`**