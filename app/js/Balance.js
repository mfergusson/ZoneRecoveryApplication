(function(ZoneRecovery) {

  'use strict';

    function Balance(authManager) {
        this.authManager = authManager;
        this.lsClient;
        this.getBalance();
    }

    Balance.prototype.getBalance = function() {

        var accBalance = new XMLHttpRequest();

        accBalance.onload = this.insertBalance.bind(this, accBalance);

        accBalance.open('GET', 'https://web-api.ig.com/gateway/deal/accounts', true);

        accBalance.setRequestHeader("Version", "1");

        this.authManager.setRequestHeaders(accBalance);

        accBalance.send('');
    };

    Balance.prototype.insertBalance = function(accBalance) {
        if (accBalance.readyState < 4) {
            return;
        }

        if (accBalance.status === 200) {
            //JSON.parse(accBalance.response);
        } else {
            return;
        }
    };

    ZoneRecovery.Balance = Balance;

})(ZoneRecovery || {})
