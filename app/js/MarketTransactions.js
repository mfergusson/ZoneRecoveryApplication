(function (ZoneRecovery) {

  'use strict';

  function MarketTransactions(authManager, lightstreamerSubscriptions){
    this.authManager = authManager;
    this.lightstreamerSubscriptions = lightstreamerSubscriptions;
    this.cst = this.authManager.getCST();
    this.apiKey = this.authManager.getApiKey();
    this.securityToken = this.authManager.getXST();
    this.markets = [];
    this.init();
  }

  MarketTransactions.prototype.init = function() {
    this.authManager.isValidUser();
    this.populateMarketBox();
    this.setupEventListeners();
  };

  MarketTransactions.prototype.setupEventListeners = function() {
      document.getElementById("logoutBtn").addEventListener('click', this.authManager.invalidateSession.bind(this));
      document.getElementById("submitButton").addEventListener('click', this.submitTicket.bind(this));
  };

  MarketTransactions.prototype.populateMarketBox = function() {

      var getMarkets = new XMLHttpRequest();

      getMarkets.onreadystatechange = this.setupMarkets.bind(this, getMarkets);

      getMarkets.open('GET', 'https://demo-api.ig.com/gateway/deal/markets?searchTerm=ftse', true);

      this.authManager.setRequestHeaders(getMarkets);

      getMarkets.send('');
  };

  MarketTransactions.prototype.setupMarkets = function(getMarkets) {
      if (getMarkets.readyState < 4) {
          return;
      }

      if (getMarkets.status === 200) {
           var response = JSON.parse(getMarkets.responseText);
              this.markets = response.markets;

           for (var i = 0; i < response.markets.length; i++) {
               var add = response.markets[i].instrumentName,
                   epic = response.markets[i].epic,
                   expiry = response.markets[i].expiry;
               document.getElementById('markets').options.add(new Option(add, epic));
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

      submitDeal.onreadystatechange = this.handleDeal.bind(this, submitDeal);

      submitDeal.open('POST', 'https://demo-api.ig.com/gateway/deal/positions/otc', true);

      this.authManager.setRequestHeaders(submitDeal);

      var market = this.findMarket(epic);

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
          }
      ));
  };

  MarketTransactions.prototype.handleDeal = function(request) {
    if (request.readyState < 4) {
      return;
    }

    if (request.status === 200) {
      var dealResponse = JSON.parse(request.response);
      this.confirm(dealResponse.dealReference);
    } else {
      console.log('broken');
    }
 };

 MarketTransactions.prototype.confirm = function(dealReference) {

    var getDealResponse = new XMLHttpRequest();

    getDealResponse.onreadystatechange = this.setConfirms.bind(this, getDealResponse);

    getDealResponse.open('GET', 'https://demo-api.ig.com/gateway/deal/confirms/' + dealReference, true);

    this.authManager.setRequestHeaders(getDealResponse);

    getDealResponse.send('');
 };

 MarketTransactions.prototype.setConfirms = function(request) {
   if (request.readyState < 4) {
     //show spinner
     document.getElementById('sk-circle').className = "";
     return;
   }

   if (request.status === 200) {
     var dealStatusResponse = JSON.parse(request.response);
     document.getElementById('sk-circle').className = 'hidden';

     if (dealStatusResponse.dealStatus === 'ACCEPTED') {
       document.getElementById('success').className = 'success';

       setTimeout(function(){
         document.getElementById('success').className = 'hidden';
       }, 5000);
     } else if (dealStatusResponse.dealStatus === 'REJECTED') {
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

  MarketTransactions.prototype.findMarket = function(epic) {
      for (var i = 0, marketLength = this.markets.length; i < marketLength; i++) {
          if (this.markets[i].epic === epic) {
              return this.markets[i];
          }
      }
  };

  ZoneRecovery.MarketTransactions = MarketTransactions;

})(ZoneRecovery || {})
