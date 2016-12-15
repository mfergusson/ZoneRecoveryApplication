var ZoneRecovery = {};
//var login = require('../../app/js/APILogin');

describe("User login", function() {
  it('has APILogin class', function() {
    expect(ZoneRecovery.APILogin).not.toBeUndefined();
  });
  it("Logs the user in", function() {
    expect(handleLoginSuccess().request.status).toEqual(200);
  });
});
