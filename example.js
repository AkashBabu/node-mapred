
var MapRed = require("./index")

var mapred = new MapRed();



var info = [{
    type: "fruit",
    name: "apples",
    qty: 21
}, {
    type: "fruit",
    name: "mangoes",
    qty: 23
}, {
    type: "fruit",
    name: "apples",
    qty: 2
}, {
    type: "fruit",
    name: "mangoes",
    qty: 3
}, {
    type: "animal",
    name: "dogs",
    qty: 3
}, {
    type: "animal",
    name: "cats",
    qty: 3
}, {
    type: "animal",
    name: "dogs",
    qty: 7
}]

mapred.exec(info)
    .map(function () {
        mapred.emit(this.name, this.qty)
    })
    .reduce(function (key, values) {
        return values.reduce((sum, val) => sum + val);
    })
    .result(function (result) {
        console.log(result); 
    })

mapred.exec(info)
    .map(function () {
        var self = this
        var key = {
            type: self.type,
            name: self.name
        }
        mapred.emit(key, this.qty)
    })
    .reduce(function (key, values) {
        return values.reduce((sum, val) => sum + val);
    })
    .result(function (result) {
        console.log(result); 
    })