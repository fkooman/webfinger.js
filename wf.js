/* jshint browser:true, jquery:true */
var WebFinger = function() {
  'use strict';

  return { 
    _extractDomain: function(resource) {
      var parsedResource = resource.match(/(\S+)@(\S+)/);
      if (null === parsedResource) {
        // did not match regexp
        throw {
          name: 'WebFingerError',
          message: 'resource not valid'
        };
      }
      return parsedResource[2];
    },
    finger: function(resource, callback, errorCallback) {
      var domain = this._extractDomain(resource),
        webFingerUri = 'https://' + 
          domain + 
          '/.well-known/webfinger?resource=acct:' + 
          resource,
        httpRequest = new XMLHttpRequest();

      httpRequest.onreadystatechange = function() {
        try { 
          if (4 === httpRequest.readyState) {
            if (200 === httpRequest.status) {
              callback(httpRequest.responseText);
            } else if (404 === httpRequest.status) {
              throw {
                name: 'WebFingerError',
                message: 'resource not found'
              };
            } else {
              throw {
                name: 'WebFingerError',
                message: 'there was a problem with the request'
              };
            }
          }
        } catch (e) {
          errorCallback(e);
        }
      };

      httpRequest.open('GET', webFingerUri, true);
      //httpRequest.responseType = 'json';
      httpRequest.setRequestHeader('Accept', 'application/jrd+json');
      httpRequest.send();
    }
  };
}();
