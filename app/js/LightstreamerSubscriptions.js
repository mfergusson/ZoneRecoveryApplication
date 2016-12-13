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
                },
                onServerError: function(err) {
                  console.log('ERROR');
                }
            });

            this.lsClient.connect();
        }
    };

    LightstreamerSubscriptions.prototype.subscribeToOPUandConfirms = function(handleOPU) {
          var deletePositionsSubscription = new Subscription (
            'DISTINCT',
            'TRADE:' + this.authManager.getCurrentAccountId(),
            [
              // "CONFIRMS",
              "OPU",
            ]
          );

      deletePositionsSubscription.setRequestedMaxFrequency("unfiltered");

      // Set up the Lightstreamer event listeners
      deletePositionsSubscription.addListener({
         onSubscription: function () {
            console.log('trade updates subscription succeeded');
         },
         onSubscriptionError: function (code, message) {
            console.log('trade updates subscription failure: ' + code + " message: " + message);
         },

         onItemUpdate: handleOPU,

         onItemLostUpdates: function () {
            console.log("trade updates subscription - item lost");
         }

      });

      // Subscribe to Lightstreamer
      this.lsClient.subscribe(deletePositionsSubscription);
    };

    ZoneRecovery.LightstreamerSubscriptions = LightstreamerSubscriptions;

})(ZoneRecovery || {})
