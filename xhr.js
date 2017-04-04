/*global angular: false, jstestdriver: false, beforeEach: false, afterEach: false, inject: false, spyOn: false, describe: false, beforeEach: false, inject: false, it: false, expect: false, module: false, : false */
/*jslint newcap: true, white: true, sloppy: true, vars: true, unparam: true */

function XHRclass() {
  var xhr;
  var isIE7toIE9 = false;
  /*@cc_on
   isIE7toIE9 = !!(/^7/.test(@_jscript_version) + /^8/.test(@_jscript_version) + /^9/.test(@_jscript_version));
   @*/
  if (typeof XMLHttpRequest != 'undefined' && !isIE7toIE9) {
    xhr = new XMLHttpRequest();
  }
  else {
    try {
      xhr = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        xhr = false;
      }
    }
  }
  return xhr;
}



var xhr = xhr || {};
(function(ns) {
  ns.ajax = ajax;

  function ajax(xhrConfig) {
    if (!xhrConfig || !xhrConfig.url || !xhrConfig.success || typeof xhrConfig.success !== "function") {
      return;
    }
    xhrConfig.type = xhrConfig.type || "GET";
    xhrConfig.ContentType = xhrConfig.ContentType || "application/x-www-form-urlencoded";

    var xhrobj = new XHRclass();
    xhrobj.open(xhrConfig.type, xhrConfig.url);
    xhrobj.onreadystatechange = onReadyStateChangeHandler;
    if (xhrConfig.data) {
      xhrobj.setRequestHeader("Content-Type", xhrConfig.ContentType);
      xhrobj.send("data=" + xhrConfig.data);
    } else {
      xhrobj.send(null);
    }

    function onReadyStateChangeHandler() {
      if (xhrobj.readyState == 4) {
        if (xhrobj.status == 200 || xhrobj.status == 304) {
          xhrConfig.success(xhrobj.responseText, xhrobj);
        } else {
          //Error handling
        }
      }
    }

  } //end fn ajax()

})(xhr);


