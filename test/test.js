var assert = require("assert");
var fs = require("fs");
var asap = require("pdenodeify");
var rmdir = asap(require("rimraf"));
var pilfer = require("../lib/main");

var helpers = require("./helpers");
var open = helpers.open;
var find = helpers.find;

describe("--out", function(){
  before(function(done){
    rmdir(__dirname+"/tests/basics/out.js").then(function(){
      var stream = pilfer({
        root: __dirname + "/tests/basics",
        out: "out.js"
      });
      stream.on("end", function(){
        done();
      });
    });
  });

  it("JavaScript output was written out", function(done){
    fs.exists(__dirname+"/tests/basics/out.js", function(exists){
      assert(exists, "file written out");
      done();
    });
  });

  it("Source maps were written out", function(done){
    fs.exists(__dirname+"/tests/basics/out.js.map", function(exists){
      assert(exists, "file written out");
      done();
    });
  });

  it("Can be loaded in a browser", function(done){
    open("test/tests/basics/prod.html", function(browser, close){
      find(browser,"moduleValue", function(moduleValue){
        var msg = moduleValue.other();
        var glbl = moduleValue.global;
        assert.equal(msg, "i am other and i have dep", "it worked");
        assert.equal(glbl, "global", "got a global");
        close();
      }, close);
    }, done);
  });
});
