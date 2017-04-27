var chai = require('chai')

var should = chai.should()
var Mapred = require("./index")

describe("Node-MapReduce for JSON", () => {

    it("should throw error if the input is not Array", () => {
        var input = 123
        var mapred = new Mapred()

        mapred.exec.bind({}, input).should.throw("Only Array inputs are allowed")
        mapred = null
    })
    it("should throw error if the input is not Array of Objects", () => {
        var mapred = new Mapred()
        var input = [
            123, "a"
        ]

        mapred
            .exec(input)
            .map.bind(this, function(){})
            .should.throw("Only Array of Objects are allowed")
        mapred = null
    })
    it("should apply reduce operation on Each Group", () => {
        var mapred = new Mapred()
        var input = [
            {
                fruit: "orange",
                qty: 3
            }, {
                fruit: "apple",
                qty: 5
            }, {
                fruit: "orange",
                qty: 7
            }, {
                fruit: "apple",
                qty: 9
            }
        ]

        mapred  
            .exec(input)
            .map(function() {
                mapred.emit(this.fruit, this.qty)
            })
            .reduce(function(key, values) {
                return values.reduce((t, v) => t + v)
            })
            .result(function(result) {
                // console.log("result:", result);
                result.should.be.an('array')
                result.length.should.be.eql(2)
                result.filter(r => r._id == "orange")[0].value.should.be.eql(10)
                result.filter(r => r._id == "apple")[0].value.should.be.eql(14)
            })

    })
    it("should apply even if the even is undefined in map stage", () => {
        var mapred = new Mapred()
        var input = [
            {
                fruit: "orange",
                qty: 3
            }, {
                fruit: "apple",
                qty: 5
            }, {
                fruit: "orange",
                qty: 7
            }, {
                fruit: "apple",
                qty: 9
            }, {
                qty: 10
            }, {
                qty: 10
            }
        ]

        mapred  
            .exec(input)
            .map(function() {
                mapred.emit(this.fruit, this.qty)
            })
            .reduce(function(key, values) {
                return values.reduce((t, v) => t + v)
            })
            .result(function(result) {
                // console.log("result:", result);
                result.should.be.an('array')
                result.length.should.be.eql(3)
                result.filter(r => r._id == "orange")[0].value.should.be.eql(10)
                result.filter(r => r._id == "apple")[0].value.should.be.eql(14)
                result.filter(r => r._id == 'undefined')[0].value.should.be.eql(20)
            })
    })
    it("Mapping should be possible even for key of type Object", () => {
        var mapred = new Mapred()
        var input = [{
            type: "fruit",
            name: "orange",
            qty: 10
        }, {
            type: "animal",
            name: "orange",
            qty: 2
        }, {
            type: "fruit",
            name: "apple",
            qty: 30
        }, {
            type: "fruit",
            name: "orange",
            qty: 10
        }, {
            type: "animal",
            name: "orange",
            qty: 2
        }, {
            type: "fruit",
            name: "apple",
            qty: 30
        }]

        mapred  
            .exec(input)
            .map(function() {
                var self = this
                var key = {
                    type: self.type,
                    name: self.name
                }
                mapred.emit(key, this.qty)
            })
            .reduce(function(key, values) {
                return values.reduce((t, v) => t + v)
            })
            .result(function(result) {
                // console.log("result:", result);
                result.should.be.an('array')
                result.length.should.be.eql(3)
                result.forEach(function(r) {
                    if(r.type == "animal"){
                        if(r.name == "orange") {
                            r.value.should.be.eql(4)
                        }
                    } else if(r.type == "fruit"){
                        if(r.name == "orange") {
                            r.value.should.be.eql(20)
                        }
                    } else if(r.type == "fruit"){
                        if(r.name == "apple") {
                            r.value.should.be.eql(60)
                        }
                    }
                })
            })

    })

})

