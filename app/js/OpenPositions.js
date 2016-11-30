(function(ZoneRecovery) {

  'use strict';

  function OpenPositions(authManager) {
    this.authManager = authManager;
    this.openPositions = [];
    this.lightstreamerSubscriptions = lightstreamerSubscriptions;
    this.getPositions();
    this.init();
  }

  OpenPositions.prototype.init = function() {
    this.setupEventListeners();
    this.lightstreamerSubscriptions.subscribeToOPUandConfirms(this.handleOPU.bind(this));
  };

  OpenPositions.prototype.setupEventListeners = function() {
      document.getElementById("logoutBtn").addEventListener('click', this.authManager.invalidateSession.bind(this));
  };

  OpenPositions.prototype.getPositions = function() {
    var CST = this.authManager.getCST(),
      API = this.authManager.getApiKey(),
      XST = this.authManager.getXST();

    this.getOpenPositions = new XMLHttpRequest();

    this.getOpenPositions.onload = this.displayOpenPositions.bind(this);

    this.getOpenPositions.open('GET', 'https://demo-api.ig.com/gateway/deal/positions', true);

    this.authManager.setRequestHeaders(this.getOpenPositions);

    this.getOpenPositions.send('');
  };

  OpenPositions.prototype.displayOpenPositions = function() {
    if (this.getOpenPositions.readyState < 4) {
      return;
    }

    if (this.getOpenPositions.status === 200) {
      this.openPositions = JSON.parse(this.getOpenPositions.response).positions;

      for (var i = 0; i < this.openPositions.length; i++) {
        var table = document.getElementById('Table'),
          row = table.insertRow((table).getElementsByTagName("tr").length),
          market = row.insertCell(0),
          direction = row.insertCell(1),
          dealSize = row.insertCell(2),
          openLevel = row.insertCell(3),
          percentageChange = row.insertCell(4),
          closeButton = row.insertCell(5);

        market.innerHTML = this.openPositions[i].market.instrumentName;
        direction.innerHTML = this.openPositions[i].position.direction;
        dealSize.innerHTML = this.openPositions[i].position.dealSize;
        openLevel.innerHTML = this.openPositions[i].position.openLevel;
        percentageChange.innerHTML = this.openPositions[i].market.percentageChange;
        closeButton.innerHTML = '<button class="close" data-dealid="' + this.openPositions[i].position.dealId + '">Close</button>';
      }

      this.setupClosePositionHandler();
    };
  };

  OpenPositions.prototype.setupClosePositionHandler = function() {
    var closeButtons = document.querySelectorAll('#positions .close');

    closeButtons.forEach(function(closeButton) {
      closeButton.addEventListener('click', this.handleClosePosition.bind(this), false);
    }.bind(this));
  }

  OpenPositions.prototype.findPosition = function(dealId) {
    if (this.openPositions && this.openPositions.length) {
      return this.openPositions.find(function(openPosition) {
        return openPosition.position.dealId === dealId;
      });
    }
  }

  OpenPositions.prototype.handleClosePosition = function(element) {
    var dealId = element.target.getAttribute('data-dealId'),
      openPosition = this.findPosition(dealId),
      position,
      market;

    if (openPosition) {
      position = openPosition.position;
      market = openPosition.market;

      var closeCurrentPosition = new XMLHttpRequest();

      closeCurrentPosition.open('POST', 'https://demo-api.ig.com/gateway/deal/positions/otc', true);

      this.authManager.setRequestHeaders(closeCurrentPosition);
      closeCurrentPosition.setRequestHeader("_method", "DELETE");

      closeCurrentPosition.send(JSON.stringify({
        dealId: position.dealId,
        epic: null,
        expiry: null,
        direction: this.swapPositionDirection(position.direction),
        size: position.dealSize,
        level: null,
        orderType: "MARKET",
        timeInForce: null,
        quoteId: null,
      }));
    }
  };

  /**
   * Flips direction for position close rest request
   * @param {String} direction
   */
  OpenPositions.prototype.swapPositionDirection = function(direction) {
    return direction === 'BUY' ? 'SELL' : 'BUY';
  };

  OpenPositions.prototype.handleOPU = function(updateInfo) {

       console.log("received trade update message: " + updateInfo.getItemName());

       updateInfo.forEachField(function (fieldName, fieldPos, value) {
         var response = JSON.parse(value);
          if (value != 'INV') {
            if (response === null) {
              return;
            } else {
             console.log("field: " + fieldName + " - value: " + value);

             document.getElementById('success').className = 'hidden';
             document.getElementById('error').className = 'hidden';

              if (response.status == "DELETED") {
                document.getElementById('success').className = 'success';
                setTimeout(function(){
                  document.getElementById('success').className = 'hidden';
                }, 5000);
              } else {
                document.getElementById('error').className = 'error';
              };
          };
       };
     });
  };

  ZoneRecovery.OpenPositions = OpenPositions;

})(ZoneRecovery || {})
