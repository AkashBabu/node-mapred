
var MapRed = require("./index")

var mapred = new MapRed();



var info = [{
    name: "apples",
    age: 21
}, {
        name: "mangoes",
        age: 23
    }, {
        name: "apples",
        age: 2
    }, {
        name: "mangoes",
        age: 3
    }]

mapred.exec(info)
    .map(function () {
        mapred.emit(this.name, this.age)
    })
    .reduce(function (key, values) {
        return values.reduce((t, v) => t + v);
    })
    .result(function (result) {
        console.log(result);
    })