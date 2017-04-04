/*global angular: false, jstestdriver: false, beforeEach: false, afterEach: false, inject: false, spyOn: false, describe: false, beforeEach: false, inject: false, it: false, expect: false, module: false, : false */
/*jslint newcap: true, white: true, sloppy: true, vars: true, unparam: true */

var xhr;
try {
    xhr = new ActiveXObject("Msxml2.XMLHTTP");
} catch (e) {
    try {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
        xhr = false;
    }
}

if (!xhr && typeof XMLHttpRequest != 'undefined') {
    xhr = new XMLHttpRequest();
}