/*global angular: false, jstestdriver: false, beforeEach: false, afterEach: false, inject: false, spyOn: false, describe: false, beforeEach: false, inject: false, it: false, expect: false, module: false, : false */
/*jslint newcap: true, white: true, sloppy: true, vars: true, unparam: true */
/*global angular: false, jstestdriver: false, beforeEach: false, afterEach: false, inject: false, spyOn: false, describe: false, beforeEach: false, inject: false, it: false, expect: false, module: false, : false */
/*jslint newcap: true, white: true, sloppy: true, vars: true, unparam: true */
var http = http ||
    (function(ns) {
      function _http() {
        var provide = {};
        (function() {
          var isIE7toIE9;
          /*@cc_on
           isIE7toIE9 = !!(/^7/.test(@_jscript_version) + /^8/.test(@_jscript_version) + /^9/.test(@_jscript_version));
           @*/
          if (window.XMLHttpRequest && !isIE7toIE9) {
            this.xhr = function() {
              return new window.XMLHttpRequest();
            }
          }
          else {
            try {
              var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
              for (var i = 0; i < 3; i++) {
                try {
                  if (new window.ActiveXObject(progIds[i])) {
                    break;
                  }
                }
                catch (e) {
                }
              }
              this.xhr = function() {
                return new window.ActiveXObject(progIds[i]);
              }
            }
            catch (e) {
              throw new Error('XMLHttpRequest is not supported by your browser');
            }
          }
        }).call(provide);


        function get(xhrConfig) {
          if (!xhrConfig || !xhrConfig.url || !xhrConfig.success || typeof xhrConfig.success !== "function") {
            return;
          }
          xhrConfig.type = xhrConfig.type || "GET";
          var xhrobj = provide.xhr();
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
          } //end fn onReadyStateChangeHandler()
          return xhrobj;
        } //end fn get()
        return {
          get: get
        };
      } //end fn _http()
      return _http();
    })(http);

//USAGE
//http.get({url: 'http://172.16.1.8:8000/api/note/3', success: function(){ console.dir(arguments); } });

