(function(ZoneRecovery) {

    'use strict';

    /**
     * @constructor
     */
    function Balance(authManager, lsClient) {
        this.authManager = authManager;
        this.lsClient = lsClient;
        this.init();
    }

    /**
     * Initialising function that runs on load
     */
    Balance.prototype.init = function() {
        this.setupLSBalanceConnection();
    }

    /**
     * Set up lightstreamer balance connection
     */
    Balance.prototype.setupLSBalanceConnection = function() {
        var currentAccountId = this.authManager.getCurrentAccountId(),
            accountSubscription = new Subscription(
                'MERGE', ['ACCOUNT:' + currentAccountId], ['FUNDS', 'PNL']);

        accountSubscription.addListener({
            onSubscription: function() {
                console.log('subscribed');
            },
            onUnsubscription: function() {
                console.log('unsubscribed');
            },
            onSubscriptionError: function(code, message) {
                console.log('subscription failure: ' + code + " message: " + message);
            },
            onItemUpdate: function(updateInfo) {
                updateInfo.forEachField(function(fieldName, fieldPos, value) {
                    switch (fieldName) {
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

        this.lsClient.subscribe(accountSubscription);
    };

    ZoneRecovery.Balance = Balance;

})(ZoneRecovery || {})
