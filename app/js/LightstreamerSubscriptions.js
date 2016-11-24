(function(ZoneRecovery) {

  'use strict';

    function LightstreamerSubscriptions(authManager) {
        this.authManager = authManager;
        this.lsClient = null;
        this.lsServerConnect();
    }

    LightstreamerSubscriptions.prototype.lsServerConnect = function() {

        var lsEndPoint = localStorage.getItem('lightstreamerEndpoint');

        if (lsEndPoint) {
            this.lsClient = new LightstreamerClient(lsEndPoint);

            this.lsClient.connectionDetails.setUser(this.authManager.getCurrentAccountId());
            this.lsClient.connectionDetails.setPassword("CST-" + this.authManager.getCST() + "|XST-" + this.authManager.getXST());

            this.lsClient.addListener({
                onListenStart: function () {
                    console.log('ListenStart');
                },
                onStatusChange: function (status) {
                    console.log('Lightstreamer connection status:' + status);
                }
            });

            this.lsClient.connect();
        }
    };

    LightstreamerSubscriptions.prototype.subscribeToOPU = function() {
      var currentAccountId = this.authManager.getCurrentAccountId(),
          deletePositionsSubscription = new Subscription(
            'DISTINCT'
            [
              'TRDAE': currentAccountId,
              'Constant status': 'DELETED';
            ]
          )
    };

    ZoneRecovery.LightstreamerSubscriptions = LightstreamerSubscriptions;

})(ZoneRecovery || {})
