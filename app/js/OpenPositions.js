(function(ZoneRecovery) {

    'use strict';

    /**
     * @constructor
     */
    function OpenPositions(authManager) {
        this.authManager = authManager;
        this.openPositions = [];
        this.lightstreamerSubscriptions = lightstreamerSubscriptions;
        this.init();
    }

    /**
     * Initialising function that runs on load
     */
    OpenPositions.prototype.init = function() {
        this.getPositions();
        this.setupEventListeners();
        this.lightstreamerSubscriptions.subscribeToOPUandConfirms(this.handleOPU.bind(this));
    };

    /**
     * Set up event listeners that get triggered on change
     */
    OpenPositions.prototype.setupEventListeners = function() {
        document.getElementById("logoutBtn").addEventListener('click', this.authManager.invalidateSession.bind(this));
    };

    /**
     * AJAX request to get all of the users open positions
     */
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

    /**
     * Display all of the users open positions in a table
     */
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
                closeButton.innerHTML = `<button class="close" id= ${this.openPositions[i].position.dealId}>Close</button>`;

                document.getElementById(this.openPositions[i].position.dealId).addEventListener('click', this.handleClosePosition.bind(this));
            }

            this.setupClosePositionHandler();
        };
    };

    /**
     * Handle closing positions
     */
    OpenPositions.prototype.setupClosePositionHandler = function() {
        var closeButtons = document.querySelectorAll('#positions .close');

        closeButtons.forEach(function(closeButton) {
            closeButton.addEventListener('click', this.handleClosePosition.bind(this), false);
        }.bind(this));
    };

    /**
     * Find the unique position in the table
     * @param {String} dealId
     */
    OpenPositions.prototype.findPosition = function(dealId) {
        if (this.openPositions && this.openPositions.length) {
            return this.openPositions.find(function(openPosition) {
                return openPosition.position.dealId === dealId;
            });
        };
    };

    /**
     * Close the clients current position
     * @param {Object} element
     */
    OpenPositions.prototype.handleClosePosition = function(element) {
        var dealId = element.currentTarget.id,
            openPosition = this.findPosition(dealId),
            position,
            market;

        if (openPosition) {
            position = openPosition.position;
            market = openPosition.market;

            var closeCurrentPosition = new XMLHttpRequest();

            closeCurrentPosition.onreadystatechange = this.handleError.bind(this, closeCurrentPosition);

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
        };
    };

    /**
     * Handle errors involving closing positions
     * @param {Object} request
     */
    OpenPositions.prototype.handleError = function(request) {
        if (request.readyState !== 4) {
            return;
        };

        if (request.status !== 200) {
            document.getElementById('error').className = 'error';
            document.getElementById('errorMessage').innerHTML = request.statusText;

            setTimeout(function() {
                document.getElementById('error').className = 'hidden';
            }, 3000);
        };
    };

    /**
     * Flips direction for position close rest request
     * @param {String} direction
     */
    OpenPositions.prototype.swapPositionDirection = function(direction) {
        return direction === 'BUY' ? 'SELL' : 'BUY';
    };

    /**
     * Handle position updates
     * @param {Object} updateInfo
     */
    OpenPositions.prototype.handleOPU = function(updateInfo) {

        // console.log("received trade update message: " + updateInfo.getItemName());

        updateInfo.forEachField((fieldName, fieldPos, value) => {
            var response = JSON.parse(value);
            if (value != 'INV') {
                if (response === null) {
                    return;
                } else {
                    // console.log("field: " + fieldName + " - value: " + value);

                    document.getElementById('success').className = 'hidden';
                    document.getElementById('error').className = 'hidden';

                    if (response.status == "DELETED") {
                        document.getElementById('success').className = 'success';

                        setTimeout(function() {
                            document.getElementById('success').className = 'hidden';
                        }, 3000);

                        var table = document.getElementById('Table');
                        var position = this.findPosition(response.dealId);
                        var index = this.openPositions.indexOf(position) + 1;
                        table.deleteRow(index);

                    };
                };
            };
        });
    };

    ZoneRecovery.OpenPositions = OpenPositions;

})(ZoneRecovery || {})
