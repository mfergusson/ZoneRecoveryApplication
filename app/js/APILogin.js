/*
web.ig.com
username = therealmatt
password = Welcome1
api = a57cfa42db36dcb9fbc22584782bcbab7e8c5de5
*/

(function(ZoneRecovery) {

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
            password = document.getElementById("password").value || null;

        request.onload = this.handleLoginSuccess.bind(this);
        request.onerror = this.handleLoginError.bind(this);

        request.open('POST', 'https://web-api.ig.com/gateway/deal/session', true);

        authManager.setRequestHeaders(request);
        request.setRequestHeader("Version", "2");

        request.send( JSON.stringify (
            {
                "identifier": username,
                "password": password
            }
        ));
    };

    APILogin.prototype.lsServerConnect = function() {

        var lsEndPoint = localStorage.getItem('lightstreamerEndpoint');

        if (lsEndPoint) {
            lsClient = new LightstreamerClient(lsEndPoint);

            lsClient.connectionDetails.setUser(localStorage.getItem('currentAccountId'));
            lsClient.connectionDetails.setPassword("CST-" + localStorage.getItem('CST') + "|XST-" + localStorage.getItem('securityToken'));

            lsClient.addListener({
                onListenStart: function () {
                    console.log('ListenStart');
                },
                onStatusChange: function (status) {
                    console.log('Lightstreamer connection status:' + status);
                }
            });

            lsClient.connect();

            this.connectToLightstreamer(lsClient);
        }
    };


    APILogin.prototype.connectToLightstreamer = function(lsClient){

        var accountSubscription = new Subscription(
            'MERGE',
            ['ACCOUNT:'+ localStorage.getItem('currentAccountId')], 
            ['FUNDS', 'PNL']);

        accountSubscription.addListener({
            onSubscription: function () {
                console.log('subscribed');
            },
            onUnsubscription: function () {
                console.log('unsubscribed');
            },
            onSubscriptionError: function (code, message) {
                console.log('subscription failure: ' + code + " message: " + message);
            },
            onItemUpdate: function (updateInfo) {
                updateInfo.forEachField(function (fieldName, fieldPos, value) {
                    switch(fieldName) {
                        case 'FUNDS':
                            document.getElementById('balanceStream').innerText = value;
                            break;
                        case 'PNL':
                            document.getElementById('profitLossStream').innerText = value;
                            break;
                    }
                });
            }
        });

        // Subscribe to Lightstreamer
        this.lsClient.subscribe(accountSubscription);
    };

    APILogin.prototype.handleLoginSuccess = function(data, request) {
        if (request.readyState < 4) {
            return;
        }

        if (request.status === 200 && data.target.response) {
            this.data = JSON.parse(data.target.response);

            CST = request.getResponseHeader("CST");
            SecurityToken = request.getResponseHeader("X-SECURITY-TOKEN");

            if (typeof(Storage) !== "undefined") {
                this.authManager.setLocalStorage();
            } else {
                console.log("Sorry, your browser does not support Web Storage.");
            }
            window.location = "MarketTransactions.html";
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

    APILogin.prototype.logout = function() {
        localStorage.clear();
        window.location='index.html';
        sessionStorage.clear();

        request.close('DELETE', 'https://web-api.ig.com/gateway/deal/session', true);

        this.lsClient.closeConnection();
    };

    APILogin.prototype.fillForm = function() {
        document.getElementById('username').value = 'therealmatt';
        document.getElementById('password').value = 'Welcome1';
        document.getElementById('APIkey').value = 'a57cfa42db36dcb9fbc22584782bcbab7e8c5de5';
    };

    ZoneRecovery.APILogin = APILogin;

})(ZoneRecovery || {})