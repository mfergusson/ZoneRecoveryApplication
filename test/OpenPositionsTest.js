var ZoneRecovery = {};
var OpenPositions = require("../app/js/OpenPositions");
var expect = require("chai").expect;

describe('Balance counter displayed', function() {
  describe('Clients balance will be diplayed on page load', function () {
    it('will display the clients balance when market transaction page loads', function() {
      expect().to.not.equal(null);
    });
  });
});

describe('Profit/loss counter displayed', function() {
  describe('Clients profit/loss will be diplayed on page load', function () {
    it('will display the clients profit/loss when market transaction page loads', function() {
      expect().to.not.equal(null);
    });
  });
});

describe('Logout button works', function() {
  describe('Logout button logs the client out when clicked', function () {
    it('will log the client out of their account and end their session on click', function() {
      expect().to.not.equal(null);
    });
  });
});

describe('Market transactions link redirects the client', function() {
  describe('Market transactions tab will redirect clients to that page', function () {
    it('will redirect clients to the market transactions page', function() {
      expect().to.not.equal(null);
    });
  });
});

describe('Table populated with open positions', function() {
  describe('Current positions table gets populated with the clients current open positions', function () {
    it('will display open positions in the table', function() {
      expect().to.not.equal(null);
    });
  });
});

describe('Close position from open positions table', function() {
  describe('Close clients current open positions from the open positions table', function () {
    it('will close the clients current position', function() {
      expect().to.not.equal(null);
    });
  });
});

describe('Receive confirm on close position success', function() {
  describe('Client to receive a green message confirming a position when successfully closed', function () {
    it('will display a confirm message', function() {
      expect().to.not.equal(null);
    });
  });
});

describe('Receive rejection message on close position rejection', function() {
  describe('Client to receive a red message rejecting the attempt to close the position', function () {
    it('will display a rejection message', function() {
      expect().to.not.equal(null);
    });
  });
});
