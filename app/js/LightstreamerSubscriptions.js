(function(ZoneRecovery) {

  'use strict';

    function LightstreamerSubscriptions(authManager, balance) {
        this.authManager = authManager;
        this.lsServerConnect();
    }

    LightstreamerSubscriptions.prototype.lsServerConnect = function() {

        var lsEndPoint = localStorage.getItem('lightstreamerEndpoint');

        if (lsEndPoint) {
            this.lsClient = new LightstreamerClient(lsEndPoint);

            this.lsClient.connectionDetails.setUser(localStorage.getItem('currentAccountId'));
            this.lsClient.connectionDetails.setPassword("CST-" + localStorage.getItem('CST') + "|XST-" + localStorage.getItem('securityToken'));

            this.lsClient.addListener({
                onListenStart: function () {
                    console.log('ListenStart');
                },
                onStatusChange: function (status) {
                    console.log('Lightstreamer connection status:' + status);
                }
            });
        }
    };

    ZoneRecovery.LightstreamerSubscriptions = LightstreamerSubscriptions;

})(ZoneRecovery || {})
