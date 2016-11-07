(function(ZoneRecovery) {

  'use strict';

  function AuthManager() { }

  //getCST from localStorage
  AuthManager.prototype.getCST = function() {
    return localStorage.getItem('CST');
  };

  //getXST from localStorage
  AuthManager.prototype.getXST = function() {
    return localStorage.getItem('securityToken');
  };

  //getApiKey from localStorage
  AuthManager.prototype.getApiKey = function() {
    return localStorage.getItem('APIkey');
  };

  //setRequestHeaders when sending off AJAX requests
  AuthManager.prototype.setRequestHeaders = function(request) {
    //getCST and XST
    var CST = this.getCST(),
      XST = this.getXST();

    //setRequestHeaders
    request.setRequestHeader("X-IG-API-KEY", this.getApiKey());
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.setRequestHeader("Accept", "application/json; charset=UTF-8");

    if (CST && XST) {
      request.setRequestHeader("CST", CST);
      request.setRequestHeader("X-SECURITY-TOKEN", XST);
    }
  };

  //send items to localStorage
  AuthManager.prototype.setLocalStorage = function() {
    localStorage.setItem("securityToken", SecurityToken);
    localStorage.setItem("CST", CST);
    localStorage.setItem("APIkey", APIkey);
    localStorage.setItem("currentAccountId", data.currentAccountId);
    localStorage.setItem("lightstreamerEndpoint", data.lightstreamerEndpoint);
  };

  ZoneRecovery.AuthManager = AuthManager;

})(ZoneRecovery || {})
