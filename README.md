# node-mapred
Map Reduce implementation of mongodb for nodejs

### Description

This lib would help you to apply mongodb mapReduce operation on array of objects

### Usecases
1. For Example if you want to apply mapReduce operation on documents after aggregation
pipeline then you may  pass the result to this lib and perform Map Reduce operation
2. If you have a list of data that you want to combine by some department or etc criteria

### Installation

> npm i node-mapred --save

### Usage

```javascript
var MapRed = require("node-mapred");

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
        mapred.emit(this.name, this.age)
    })
    .reduce(function (key, values) {
        return values.reduce((sum, val) => sum + val);
    })
    .result(function (result) {
        console.log(result); 
        // Output [ { _id: 'apples', value: 23 }, { _id: 'mangoes', value: 26 } ]
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
        // Output
        // [ { _id: { type: 'fruit', name: 'apples' }, value: 23 },
        // { _id: { type: 'fruit', name: 'mangoes' }, value: 26 },
        // { _id: { type: 'animal', name: 'dogs' }, value: 10 },
        // { _id: { type: 'animal', name: 'cats' }, value: 3 } ]
    })

```

### Test

> npm install  
> npm test

### License

MIT