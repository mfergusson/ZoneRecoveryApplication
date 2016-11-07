(function (ZoneRecovery) {

  'use strict';

  function MarketTransactions(authManager){
    this.authManager = authManger;
    this.cst = this.authManager.getCST();
    this.apiKey = this.authManager.getApiKey();
    this.securityToken = this.authManager.getXST();
    this.markets = [];
    this.init();
  }

  MarketTransactions.prototype.init = function() {
    this.lsServerConnect();
    this.getAllPositions();
    this.populateMarketBox();
  };


  MarketTransactions.prototype.populateMarketBox = function() {

      var getMarkets = new XMLHttpRequest();

      getMarkets.onreadystatechange = marketBox;
      getMarkets.onload = isValidUser;

      getMarkets.open('GET', 'https://web-api.ig.com/gateway/deal/markets?searchTerm=ftse', true);

      ZoneRecovery.setRequestHeader(getMarkets);

      getMarkets.send('');

      function marketBox() {
          if (getMarkets.readyState < 4) {
              return;
          }

          if (getMarkets.status === 200) {

               var response = JSON.parse(getMarkets.responseText);
               markets = response.markets;

               for (var i = 0; i < response.markets.length; i++) {
                   var add = response.markets[i].instrumentName,
                       epic = response.markets[i].epic;
                   document.getElementById('markets').options.add(new Option(add, epic));
               }
            getBalance();
      }
  };

  MarketTransactions.prototype.getBalance = function() {

      var balance = new XMLHttpRequest();

      balance.open('GET', 'https://web-api.ig.com/gateway/deal/accounts', true);

      ZoneRecovery.setRequestHeader();

      balance.send('');

      }

      function isValidUser(){
          if (!localStorage.getItem('CST')) {
              alert('Please login!');
              window.location='Login.html';
          }
      }
  };

  MarketTransactions.prototype.submitTicket = function() {
      var currencyOption = document.getElementById('currency-option').value;
      var epic = document.getElementById('markets').value;
      var betSizeValue = document.getElementById('Bet-Size-Amount').value;
      var stopPointValue = document.getElementById('Stop-Point-Amount').value;
      var recoveryValue = document.getElementById('Recovery-Amount').value;
      var direction = document.getElementById('directions').value;

      var dealRefer = new DealReferenceGenerator(localStorage.getItem('currentAccountId'));
      var submittedTimestamp = (new Date()).getTime();
      var dealReference = dealRefer.generateDealReference(submittedTimestamp);

      var submitDeal = new XMLHttpRequest();

      submitDeal.onreadystatechange = handleDeal;

      submitDeal.open('POST', 'https://web-api.ig.com/gateway/deal/positions/otc', true);

      ZoneRecovery.setRequestHeader();
      submitDeal.setRequestHeader("Version", "2");

      var market = findMarket(epic);

      submitDeal.send(JSON.stringify(
          {
              currencyCode: currencyOption,
              direction: direction,
              epic: market.epic,
              expiry: market.expiry,
              forceOpen: false,
              guaranteedStop: false,
              orderType: 'MARKET',
              size: betSizeValue,
              stopDistance: null,
              trailingStop: false,
          }
      ));

      MarketTransactions.prototype.handleDeal = function() {
        if (submitDeal.readyState < 4) {
          return;
        }

        if (submitDeal.status === 200) {
          var dealResponse = JSON.parse(submitDeal.response);
          confirm(dealResponse);
        } else {
          console.log('broken');
        }
     };
  };

    MarketTransactions.prototype.confirm = function(dealResponse) {

      var getDealResponse = new XMLHttpRequest();

      getDealResponse.onreadystatechange = setConfirms;

      var dealReferenceSend = dealResponse.dealReference;

      getDealResponse.open('GET', `https://web-api.ig.com/gateway/deal/confirms/${dealReferenceSend}`, true);

      ZoneRecovery.setRequestHeader();

      getDealResponse.send('');

      MarketTransactions.prototype.setConfirms = function() {
        if (getDealResponse.readyState < 4) {
          //show spinner
          document.getElementById('sk-circle').className = "";
          return;
        }

        if (getDealResponse.status === 200) {
          var dealStatusResponse = JSON.parse(getDealResponse.response);
          document.getElementById('sk-circle').className = 'hidden';

          if (dealStatusResponse.dealStatus === 'ACCEPTED'){
            document.getElementById('success').className = 'success';

            setTimeout(function(){
            document.getElementById('success').className = 'hidden';
          }, 5000);
          }

          else if (dealStatusResponse.dealStatus === 'REJECTED') {
            document.getElementById('error').className = 'error';
            document.getElementById('errorMessage').innerHTML = dealStatusResponse.reason;

            setTimeout(function() {
            document.getElementById('error').className = 'hidden';
          }, 5000);
          }
        } else {
          console.log('broken');
        }
      };
   };

  MarketTransactions.prototype.findMarket = function(epic) {
      for (var i = 0, marketLength = markets.length; i < marketLength; i++) {
          if (markets[i].epic === epic) {
              return markets[i];
          }
      }
  };
})(ZoneRecovery || {})
