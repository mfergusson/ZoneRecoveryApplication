(function(ZoneRecovery) {

  function OpenPositions(authManager) {
    this.authManager = authManager;
    this.openPositions = [];
    this.getPositions();
  }

  OpenPositions.prototype.getPositions = function() {
    var CST = localStorage.getItem('CST'),
      API = localStorage.getItem('APIkey'),
      securityToken = localStorage.getItem('securityToken');

    this.getOpenPositions = new XMLHttpRequest();

    this.getOpenPositions.onload = this.displayOpenPositions.bind(this);

    this.getOpenPositions.open('GET', 'https://web-api.ig.com/gateway/deal/positions', true);

    this.getOpenPositions.setRequestHeader("X-IG-API-KEY", API);
    this.getOpenPositions.setRequestHeader("X-SECURITY-TOKEN", securityToken);
    this.getOpenPositions.setRequestHeader("CST", CST);
    this.getOpenPositions.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    this.getOpenPositions.setRequestHeader("Accept", "application/json; charset=UTF-8");

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
      position;

    if (openPosition) {
      position = openPosition.position;

      var closeCurrentPosition = new XMLHttpRequest();

      closeCurrentPosition.open('DELETE', 'https://web-api.ig.com/gateway/deal/positions/otc', true);

      closeCurrentPosition.setRequestHeader("X-IG-API-KEY", localStorage.getItem('APIkey'));
      closeCurrentPosition.setRequestHeader("X-SECURITY-TOKEN", localStorage.getItem('securityToken'));
      closeCurrentPosition.setRequestHeader("CST", localStorage.getItem('CST'));
      closeCurrentPosition.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
      closeCurrentPosition.setRequestHeader("Accept", "application/json; charset=UTF-8");

      closeCurrentPosition.send(JSON.stringify({
        dealId: position.dealId,
        epic: null,
        expiry: null,
        direction: position.direction,
        size: position.dealSize,
        level: null,
        orderType: "MARKET",
        timeInForce: null,
        quoteId: null
      }));
    }
  };

  ZoneRecovery.OpenPositions = OpenPositions;

})(ZoneRecovery || {})