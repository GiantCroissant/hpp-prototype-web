function Item(data) {
    var self = this

    if (data !== undefined && data !== null) {
        self.id = ko.observable(data.id)
        self.linkedAddress = ko.observable("/items/" + data.id)
        self.gameTitle = ko.observable(data.gameTitle)
        self.companyName = ko.observable(data.companyName)
        self.platform = ko.observable(data.platform)
        self.itemName = ko.observable(data.itemName)
        self.itemTotalCount = ko.observable(data.itemTotalCount)
        self.jackpotItemName = ko.observable(data.jackpotItemName)
    }
}

function ItemDetail(data) {
    var self = this

    if (data !== undefined && data !== null) {
        self.id = ko.observable(data.id)
        self.linkedAddress = ko.observable("/items/" + data.id)
        self.gameTitle = ko.observable(data.gameTitle)
        self.gameDescription = ko.observable(data.gameDescription)
        self.companyName = ko.observable(data.companyName)
        self.platform = ko.observable(data.platform)
        self.itemName = ko.observable(data.itemName)
        self.itemDescription = ko.observable(data.itemDescription)
        self.itemTotalCount = ko.observable(data.itemTotalCount)
        self.jackpotItemName = ko.observable(data.jackpotItemName)
        self.linkedAddress = ko.observable(data.linkedAddress)
        self.dueDate = ko.observable(data.dueDate)
        self.instruction = ko.observable(data.instruction)
        self.serialNumber = ko.observable(data.serialNumber)
        self.password = ko.observable(data.password)

    }
}

function SerialPassword(serial, password) {
    var self = this

    self.serial = ko.observable(serial)
    self.password = ko.observable(password)
}

// Overall viewmodel for this screen, along with initial state
function ItemExchangeViewModel() {
    var self = this
    var baseUrl = "http://private-eb34c-hppprototype.apiary-mock.com"

    self.items = ko.observableArray([])

    $.ajax({
        type: "GET",
        url: baseUrl + "/items",
        contentType: "application/json",
        success: function(msg) {
            var mappedItems = $.map(msg.results, function(item) { return new Item(item); })
            self.items(mappedItems)

            var pjaxTarget = (bootcards.isXS() ? '#list' : '#listDetails')
            bootcards.addPJaxHandlers(pjaxTarget)

        },
        error: function(msg) {
            alert("error")
        }//,
        // complete: function(msg) {
        //     alert("complete")
        // }
    })

    self.itemDetail = ko.observable(new ItemDetail())
    self.serialPassword = ko.observable()

    self.showSerial = function() {
        var mappedSerialPassword = new SerialPassword(self.itemDetail.serialNumber, self.itemDetail.password)
        self.serialPassword(mappedSerialPassword)
    }

    bootcards.addPJaxHandlers = function(pjaxTarget) {
        console.log("in addpjaxhandlers function")

        //add pjax click handler to links
        $('a.pjax').off().on('click', function(e) {
            var $this = $(this)
            var tgtUrl = $this.attr('href')

            $.ajax({
                type: "GET",
                url: baseUrl + tgtUrl,
                contentType: "application/json",
                success: function(msg) {

                    if ($this.hasClass('list-group-item')) {
                        $this.addClass('active')
                            .siblings()
                            .removeClass('active')
                    }

                    var mappedItemDeatail = new ItemDetail(msg)
                    self.itemDetail(mappedItemDeatail)
                },
                error: function(msg) {
                    alert("error")
                }//,
                // complete: function(msg) {
                //     alert("complete")
                // }
            })

            e.preventDefault()
        })
    }
}

$(document).ready(function() {
    ko.applyBindings(new ItemExchangeViewModel())
})