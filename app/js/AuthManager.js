(function(ZoneRecovery) {

    'use strict';

    /**
     * @constructor
     */
    function AuthManager() {}

    /**
     * getCST from localStorage
     * @return CST
     */
    AuthManager.prototype.getCST = function() {
        return localStorage.getItem('CST');
    };

    /**
     * getXST from localStorage
     * @return XST
     */
    AuthManager.prototype.getXST = function() {
        return localStorage.getItem('XST');
    };

    /**
     * getApiKey from localStorage
     * @return APIKey
     */
    AuthManager.prototype.getApiKey = function() {
        return localStorage.getItem('APIkey');
    };

    /**
     * getCurrentAccountId from localStorage
     * @return currentAccountId
     */
    AuthManager.prototype.getCurrentAccountId = function() {
        return localStorage.getItem('currentAccountId');
    };

    /**
     * setRequestHeaders when sending off AJAX requests
     * @param {Object} request
     * @param {String} apiKey
     */
    AuthManager.prototype.setRequestHeaders = function(request, apiKey) {
        var CST = this.getCST(),
            XST = this.getXST();

        request.setRequestHeader("X-IG-API-KEY", apiKey || this.getApiKey());
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        request.setRequestHeader("Accept", "application/json; charset=UTF-8");

        if (CST && XST) {
            request.setRequestHeader("CST", CST);
            request.setRequestHeader("X-SECURITY-TOKEN", XST);
        }
    };

    /**
     * setSession when logging in
     * @param {String} CST
     * @param {String} XST
     * @param {String} apiKey
     * @param {String} currentAccountId
     * @param {String} lightstreamerEndpoint
     */
    AuthManager.prototype.setSession = function(CST, XST, apiKey, currentAccountId, lightstreamerEndpoint) {
        localStorage.setItem("XST", XST);
        localStorage.setItem("CST", CST);
        localStorage.setItem("APIkey", apiKey);
        localStorage.setItem("currentAccountId", currentAccountId);
        localStorage.setItem("lightstreamerEndpoint", lightstreamerEndpoint);
    };

    /**
     * remove session i.e. clear local storage and return user back to login page
     */
    AuthManager.prototype.invalidateSession = function() {
        localStorage.clear();
        sessionStorage.clear();
        window.location = 'index.html';

        request.close('DELETE', 'https://demo-api.ig.com/gateway/deal/session', true);

        this.lsClient.closeConnection();
    };

    /**
     * Checks if the users credentials are correct
     */
    AuthManager.prototype.isValidUser = function() {
        if (!this.getCST() || !this.getXST()) {
            alert('Please login!');
            window.location = 'Login.html';
        }
    };

    /**
     * Clears local storage
     */
    AuthManager.prototype.clearSession = function() {
        localStorage.clear();
    };

    ZoneRecovery.AuthManager = AuthManager;

})(ZoneRecovery || {})
