'use strict';

var camelCase;
// Deep clone arbitrary objects with arrays. Can't handle cyclic structures (results in a range error)
// Any attribute with a non primitive value besides object and array will be passed by reference (e.g. Buffers, Maps, Functions)
// All capital letters are going to be replaced with a lower case letter and a underscore infront of it
function clone (obj) {
    var copy;
    if (Array.isArray(obj)) {
        copy = new Array(obj.length);
        for (var i = 0; i < obj.length; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    if (Object.prototype.toString.call(obj) === '[object Object]') {
        copy = {};
        var elems = Object.keys(obj);
        var elem;
        while (elem = elems.pop()) {
            if (elem === 'tls') { // special handle tls
                copy[elem] = obj[elem];
                continue;
            }
            // Accept camelCase options and convert them to snake_case
            var snake_case = elem.replace(/[A-Z][^A-Z]/g, '_$&').toLowerCase();
            // If camelCase is detected, pass it to the client, so all variables are going to be camelCased
            // There are no deep nested options objects yet, but let's handle this future proof
            if (snake_case !== elem.toLowerCase()) {
                camelCase = true;
            }
            copy[snake_case] = clone(obj[elem]);
        }
        return copy;
    }
    return obj;
}

function convenienceClone (obj) {
    camelCase = false;
    obj = clone(obj) || {};
    if (camelCase) {
        obj.camel_case = true;
    }
    return obj;
}


module.exports = {
    err_code: /^([A-Z]+)\s+(.+)$/,
    monitor_regex: /^[0-9]{10,11}\.[0-9]+ \[[0-9]+ .+\]( ".+?")+$/,
    clone: convenienceClone,
};