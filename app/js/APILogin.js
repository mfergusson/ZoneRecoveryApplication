/*
demo.ig.com
username = mattsupport
password = Welcome1
api = b1cf33b976cef6c5b3c80ab7c95d4fb8fa6c7739
*/

(function(ZoneRecovery) {

    'use strict';

    /**
     * @constructor
     */
    function APILogin(authManager) {
        this.authManager = authManager;
        this.setupEventListeners();
        this.init();
    }

    /**
     * Set up event listeners that get triggered on change
     */
    APILogin.prototype.setupEventListeners = function() {
        document.getElementById("Submit-Button").addEventListener('click', this.login.bind(this));
        document.getElementById("fillForm").addEventListener('click', this.fillForm.bind(this));
    };

    /**
     * Clear the session on load
     */
    APILogin.prototype.init = function() {
        this.authManager.clearSession();
    }

    /**
     * Set up AJAX request that sends the users credentials including the API key
     */
    APILogin.prototype.login = function() {
        var request = new XMLHttpRequest(),
            username = document.getElementById("username").value || null,
            password = document.getElementById("password").value || null,
            apiKey = document.getElementById("APIkey").value || null;

        request.onload = this.handleLoginSuccess.bind(this, request, apiKey);
        request.onerror = this.handleLoginError.bind(this, request);

        request.open('POST', 'https://demo-api.ig.com/gateway/deal/session', true);

        authManager.setRequestHeaders(request, apiKey);
        request.setRequestHeader("Version", "2");

        request.send(JSON.stringify({
            "identifier": "DEMO-" + username.toUpperCase() + "-LIVE",
            "password": password,
        }));
    };

    /**
     * Handle whether the credentials were correct or incorrect
     * @param {Object} request
     * @param {String} apiKey
     * @param {Object} data
     */
    APILogin.prototype.handleLoginSuccess = function(request, apiKey, data) {
        if (request.readyState < 4) {
            return;
        }

        if (request.status === 200 && data.target.response) {
            this.data = JSON.parse(data.target.response);

            if (typeof(Storage) !== "undefined") {
                var CST = request.getResponseHeader("CST"),
                    XST = request.getResponseHeader("X-SECURITY-TOKEN"),
                    currentAccountId = this.data.currentAccountId,
                    lightstreamerEndpoint = this.data.lightstreamerEndpoint;

                this.authManager.setSession(CST, XST, apiKey, currentAccountId, lightstreamerEndpoint);

                window.location = "MarketTransactions.html";
            } else {
                console.log("Sorry, your browser does not support Web Storage.");
            }
        } else {
            this.invalidLogin();
        }
    };

    /**
    * Handle when the users credentials are wrong
    @param {Object} request
    */
    APILogin.prototype.handleLoginError = function(request) {
        if (request.status == 403) {
            alert("Invalid username, password or API key!");
        } else {
            console.log("you have an error");
        }
    };

    /**
     * Fill the form with correct login credentials
     */
    APILogin.prototype.fillForm = function() {
        document.getElementById('username').value = 'mattsupport';
        document.getElementById('password').value = 'Welcome1';
        document.getElementById('APIkey').value = 'b1cf33b976cef6c5b3c80ab7c95d4fb8fa6c7739';
    };

    ZoneRecovery.APILogin = APILogin;

})(ZoneRecovery || {})
