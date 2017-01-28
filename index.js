










var util = require("util");

var MapRed = function () {

    this.keys = [];
    this.data = {};
    this.results = [];

    return this;
}

MapRed.prototype.exec = function (arr) {
    if(!util.isArray(arr)){
        throw new Error("Only Array inputs are allowed");
    }
    var self = this;

    self.info = arr;

    return {
        map: self.map.bind(self)
    };
}

MapRed.prototype.emit = function (key, value) {
    if (this.keys.indexOf(key) == -1) {
        this.keys.push(key);
        this.data[key] = [value];
    } else {
        this.data[key].push(value);
    }
}

MapRed.prototype.map = function (cb) {
    var self = this;
    self.info.forEach(doc => {
        if(!util.isObject(doc)) {
            throw new Error("Only Array of Objects are allowed");
        }
        cb.bind(doc)()
    });

    return {
        reduce: self.reduce.bind(self)
    }
}

MapRed.prototype.reduce = function (cb) {
    var self = this;
    for (var key in self.data) {
        var res = {
            _id: key,
            value: cb(key, self.data[key])
        }
        self.results.push(res);
    }

    return {
        result: self.result.bind(self),
    }
}

MapRed.prototype.result = function (cb) {
    var self = this;
    cb(self.results);
}


module.exports = MapRed;