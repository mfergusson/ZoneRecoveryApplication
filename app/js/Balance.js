(function(ZoneRecovery) {

  'use strict';

    function Balance(authManager, LightstreamerSubscriptions) {
        this.authManager = authManager;
        this.lightstreamerSubscriptions = lightstreamerSubscriptions;
        this.setupLSBalanceConnection();
    }

    Balance.prototype.setupLSBalanceConnection = function(lsClient) {
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
    };

    ZoneRecovery.Balance = Balance;

})(ZoneRecovery || {})
