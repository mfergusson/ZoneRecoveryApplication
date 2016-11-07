/**
 * The 32 character alpha-numeric alphabet.
 * @see http://www.crockford.com/wrmg/base32.html
 * @type {String}
 */
var ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';


/**
 * Algorithm used to generate unique deal references.
 * This is a modified version of DealReferenceGenerator from DealingRest.
 * @see http://sourcecode/xref/WebTrading/DealingRest/server/trunk/service-impl/src/main/java/com/iggroup/wt/dealingrest/service/orders/v3/core/DealReferenceGenerator.java
 *
 * @param {String} accountId The Account Id to use with the reference.
 */
function DealReferenceGenerator(accountId) {
    this._accountId = accountId;
}

/**
 * This generates and sets the String that is the Deal Reference.
 *
 * A basic heuristic is used to generate the reference. Every character of the Account ID (a letter) is
 * converted to it's numerical equivalent (i.e A = '01', B = '02' etc.) and the remaining characters are
 * appended. The resulting number and the specified timestamp are then both Base32 encoded and concatenated
 * to give a shorter, more human readable deal reference.
 *
 * E.g. 'T2367' (converted to 192367) and 1392043103423 (a timestamp), will give 65KZ, 18GE3R55Z
 * and the resulting deal reference: 65KZ18GE3R55Z
 * @param {Number} [timestamp] A timestamp to generate the deal ref for, if not provided `Date.now()` will be used.
 * @return {String}
 */
DealReferenceGenerator.prototype.generateDealReference = function(timestamp) {
    var encodedAccountId = this._toAlphaNumeric(this._convertAccountIdToNumber(this._accountId));
    var encodedTimestamp = this._toAlphaNumeric(timestamp || Date.now());

    return encodedAccountId + encodedTimestamp;
}

/**
 * @param {String} accountId
 * @return {Number}
 */
DealReferenceGenerator.prototype._convertAccountIdToNumber = function (accountId) {
    return parseInt(accountId.toUpperCase().replace(/[A-Z]/g, function (letter) {
        var code = letter.charCodeAt(0) - 64;
        return (code < 10 ? '0' : '') + code;
    }), 10);
};

/**
 * This takes a number and "base32" encodes it according to the alphabet char defined as alphabet.
 * @param {Number} id
 * @return {String}
 */
DealReferenceGenerator.prototype._toAlphaNumeric = function (id) {
    var alphabetSize = ALPHABET.length;
    var encrypted = [];
    var idx = 15; // max length of the encoded string (including padding)
    var tempId = id;
    var index;

    while (--idx >= 0) {
        index = tempId & (alphabetSize - 1);
        encrypted[idx] = ALPHABET[index];
        tempId = Math.floor(tempId / alphabetSize);
    }

    return this._removePadding(encrypted.join(''));
};

/**
 * Utility method to remove excess padding on the encrypted string. These are in the form of leading '0' characters.
 * @param {String} padded
 * @return {String}
 */
DealReferenceGenerator.prototype._removePadding = function (padded) {
    return padded.replace(/^0+/, '');
};