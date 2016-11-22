(function(ZoneRecovery) {

  'use strict';

  function AuthManager() { }

  //getCST from localStorage
  AuthManager.prototype.getCST = function() {
    return localStorage.getItem('CST');
  };

  //getXST from localStorage
  AuthManager.prototype.getXST = function() {
    return localStorage.getItem('XST');
  };

  //getApiKey from localStorage
  AuthManager.prototype.getApiKey = function() {
    return localStorage.getItem('APIkey');
  };

  AuthManager.prototype.getCurrentAccountId = function() {
    return localStorage.getItem('currentAccountId');
  };

  /**
   * setRequestHeaders when sending off AJAX requests
   * @param {Object} request
   * @param {String} [apiKey]
   */
  AuthManager.prototype.setRequestHeaders = function(request, apiKey) {
    //getCST and XST
    var CST = this.getCST(),
      XST = this.getXST();

    //setRequestHeaders
    request.setRequestHeader("X-IG-API-KEY", apiKey || this.getApiKey());
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.setRequestHeader("Accept", "application/json; charset=UTF-8");

    if (CST && XST) {
      request.setRequestHeader("CST", CST);
      request.setRequestHeader("X-SECURITY-TOKEN", XST);
    }
  };

  //send items to localStorage
  AuthManager.prototype.setSession = function(CST, XST, apiKey, currentAccountId, lightstreamerEndpoint) {
    localStorage.setItem("XST", XST);
    localStorage.setItem("CST", CST);
    localStorage.setItem("APIkey", apiKey);
    localStorage.setItem("currentAccountId", currentAccountId);
    localStorage.setItem("lightstreamerEndpoint", lightstreamerEndpoint);
  };

  AuthManager.prototype.invalidateSession = function() {
      localStorage.clear();
      sessionStorage.clear();
      window.location='index.html';

      request.close('DELETE', 'https://web-api.ig.com/gateway/deal/session', true);

      this.lsClient.closeConnection();
  };

  AuthManager.prototype.isValidUser = function() {
      if (!this.getCST() || !this.getXST()) {
          alert('Please login!');
          window.location='Login.html';
      }
  };

  ZoneRecovery.AuthManager = AuthManager;

})(ZoneRecovery || {})
