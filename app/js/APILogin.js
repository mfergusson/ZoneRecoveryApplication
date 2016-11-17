/*
web.ig.com
username = therealmatt
password = Welcome1
api = a57cfa42db36dcb9fbc22584782bcbab7e8c5de5
*/

(function(ZoneRecovery) {

  'use strict';

    function APILogin(authManager) {
        this.authManager = authManager;
        this.setupEventListeners();
    }

    APILogin.prototype.setupEventListeners = function() {
        document.getElementById("Submit-Button").addEventListener('click', this.login.bind(this));
        document.getElementById("fillForm").addEventListener('click', this.fillForm.bind(this));
    };

    APILogin.prototype.login = function() {
        var request = new XMLHttpRequest(),
            username = document.getElementById("username").value || null,
            password = document.getElementById("password").value || null,
            apiKey = document.getElementById("APIkey").value || null;

        request.onload = this.handleLoginSuccess.bind(this, request, apiKey);
        request.onerror = this.handleLoginError.bind(this);

        request.open('POST', 'https://web-api.ig.com/gateway/deal/session', true);

        authManager.setRequestHeaders(request, apiKey);
        request.setRequestHeader("Version", "2");

        request.send( JSON.stringify (
            {
                "identifier": username,
                "password": password
            }
        ));
    };

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

    APILogin.prototype.handleLoginError = function() {
        if (request.status == 403) {
            this.invalidLogin();
        } else {
            console.log("you have an error")
        }
    };

    APILogin.prototype.invalidLogin = function() {
        alert("Invalid username, password or API key!");
    };

    APILogin.prototype.fillForm = function() {
        document.getElementById('username').value = 'therealmatt';
        document.getElementById('password').value = 'Welcome1';
        document.getElementById('APIkey').value = 'a57cfa42db36dcb9fbc22584782bcbab7e8c5de5';
    };

    ZoneRecovery.APILogin = APILogin;

})(ZoneRecovery || {})
