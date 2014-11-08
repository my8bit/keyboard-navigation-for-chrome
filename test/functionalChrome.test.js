//"use strict";

var crx = require("./testHelper.js").getDecodedCrx(),
    webdriverjs = require("webdriverio"),
    //etalonCrx = require("fs").readFileSync("dist/keyboard-navigation-for-chrome-master.crx").toString("base64"),
    assert = require("chai").assert;


describe("My webdriverjs tests", function() {

    this.timeout(99999999);
    var client = {};
    var KEYS = {
        "F8": "\uE038",
        "a": "\u0061",
        "Enter": "\u000D"
    };

    beforeEach(function(done) {
        var options = {
            desiredCapabilities: {
                browserName: "chrome",
                chromeOptions: {
                    //should test the frame option n visible area
                    args: ["window-size=683,768", "window-position=683,0"],
                    extensions: [crx]
                }
            }
        };
        client = webdriverjs.remote(options);
        client.init(done);
    });
    /*    it('Click DOGE image test', function(done) {
        client
            .url('http://localhost:8765/index.html')
            .on("load", function(e, r) {
                console.log(e);
                console.log(r);
            })
            .click("#doge", function(err, res) {
                assert(err === undefined);
            })
            .getText("h1", function(err, text) {
                assert(text === "Doge");
            })
            .call(done);
    });
*/
    /*
    it("Should get 3 hints (2 links, 1 hintinput) on page", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .keys("\uE038", function() {
                //.pause(2000) //TODO: Odd behaviour.
            })
            .elements(".chrome_hint", function(err, res) {
                assert(res.value.length == 3, "There are three hints on link");
            })
            .element("#chrome_hitahintinput", function(err, res) {
                assert(res.state === "success", "There are one hintinput");
            })
            .call(done);
    });*/
    it("Should get 3 hints and then hide it", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .keys(KEYS.F8, function() {})
            .elements(".chrome_hint", function(err, res) {
                //console.log(res);
                assert(res.value.length === 3, "There are three hints on link");
            })
            .element("#chrome_hitahintinput", function(err, res) {
                assert(res.state === "success", "There are one hintinput");
            })
            .keys(KEYS.F8, function() {})
            .elements(".chrome_hint", function(err, res) {
                assert(res.value.length === 0, "Hints hides");
            })
            .element("#chrome_hitahintinput", function(err, res) {
                console.log(res);
                //assert(res.value.length === 0, "Hintinput hides");
            })
            .call(done);
    });

    it("Should follow the hit link", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .keys(KEYS.F8, function() {})
            .keys(KEYS.a, function() {})
        //.pause(2000)
        .keys(KEYS.Enter, function() {})
        //.pause(2000)
        .getText("h1", function(err, text) {
            assert(text === "Doge");
        })
            .call(done);
    });

    afterEach(function(done) {
        client.end(done);
    });
});