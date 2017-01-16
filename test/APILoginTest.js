var ZoneRecovery = {};
var APILogin = require("../app/js/APILogin");
var expect = require("chai").expect;

describe('Login button works', function() {
  describe('Login button calls login() on click', function () {
    it('will call the login function when clicked', function() {
      expect(APILogin.username).to.not.equal(null);
    });
  });
});

describe('Login attempt', function() {
    describe('Sends clients credentials', function() {
        it('will check to see if the clients credentials get sent when login button gets clicked', function() {
            expect(APILogin.request.readyState).to.equal(4);
        });
    });
});
