//"use strict";

var crx = require("./testHelper.js").getDecodedCrx(),
    webdriverjs = require("webdriverio"),
    //etalonCrx = require("fs").readFileSync("dist/keyboard-navigation-for-chrome-master.crx").toString("base64"),
    assert = require("chai").assert;


describe("Hit a hint mode and link search mode", function() {

    this.timeout(99999999);
    var client = {};
    var KEYS = {
        "F8": "\uE038",
        "F9": "\uE039",
        "F10": "\uE03A",
        "a": "\u0061",
        "Enter": "\uE007",
        "ESC": "\uE00C"
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

    it("Should get exist of hit input on page but invisible", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .isExisting("#chrome_hitahintinput", function(err, isExisting) {
                assert(isExisting === true, "There are no hintinput in page");
            })
            .isVisible("#chrome_hitahintinput", function(err, isVisible) {
                assert(isVisible === false, "There are visible");
            })
            .call(done);
    });

    it("Should get hintswindow", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .isExisting("#chrome_hintswindow", function(err, isExisting) {
                assert(isExisting === true, "There are one chrome_hintswindow");
            })
            .isVisible("#chrome_hintswindow", function(err, isVisible) {
                assert(isVisible === false);
            })
            .call(done);
    });

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
    });

    it("Should get 3 hints and 1 input and then hide it and show ot again", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .keys(KEYS.F8, function() {})
            .elements(".chrome_hint", function(err, res) {
                assert(res.value.length === 3, "There are three hints on link");
            })
            .isExisting("#chrome_hitahintinput", function(err, isExisting) {
                assert(isExisting === true, "There are one hintinput");
            })
            .keys(KEYS.F8, function() {})
            .isExisting(".chrome_hint", function(err, isExisting) {
                assert(isExisting === false);
            })
            .isExisting("#chrome_hitahintinput", function(err, isExisting) {
                assert(isExisting === true);
            })
            .isVisible("#chrome_hitahintinput", function(err, isVisible) {
                assert(isVisible === false);
            })
            .keys(KEYS.F8, function() {})
            .elements(".chrome_hint", function(err, res) {
                assert(res.value.length === 3, "There are three hints on link");
            })
            .isExisting("#chrome_hitahintinput", function(err, isExisting) {
                assert(isExisting === true, "There are one hintinput");
            })
            .call(done);
    });

    it("Should get 1 hint and 1 input and then hide it and swow it again. Press HintAHint button", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .scroll("#doge2")
            .keys(KEYS.F8, function() {})
            .elements(".chrome_hint", function(err, res) {
                assert(res.value.length === 1, "There are three hints on link");
            })
            .isExisting("#chrome_hitahintinput", function(err, isExisting) {
                assert(isExisting === true, "There are one hintinput");
            })
            .keys(KEYS.F8, function() {})
            .isExisting(".chrome_hint", function(err, isExisting) {
                assert(isExisting === false);
            })
            .isExisting("#chrome_hitahintinput", function(err, isExisting) {
                assert(isExisting === true);
            })
            .isVisible("#chrome_hitahintinput", function(err, isVisible) {
                assert(isVisible === false);
            })
            .keys(KEYS.F8, function() {})
            .elements(".chrome_hint", function(err, res) {
                assert(res.value.length === 1, "There are three hints on link");
            })
            .isExisting("#chrome_hitahintinput", function(err, isExisting) {
                assert(isExisting === true, "There are one hintinput");
            })
            .call(done);
    });
    it("Should get 1 hint and 1 input and then hide it and swow it again. Press ESC button", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .scroll("#doge2")
            .keys(KEYS.F8, function() {})
            .elements(".chrome_hint", function(err, res) {
                assert(res.value.length === 1, "There are three hints on link");
            })
            .isExisting("#chrome_hitahintinput", function(err, isExisting) {
                assert(isExisting === true, "There are one hintinput");
            })
            .keys(KEYS.ESC, function() {})
            .isExisting(".chrome_hint", function(err, isExisting) {
                assert(isExisting === false);
            })
            .isExisting("#chrome_hitahintinput", function(err, isExisting) {
                assert(isExisting === true);
            })
            .isVisible("#chrome_hitahintinput", function(err, isVisible) {
                assert(isVisible === false);
            })
            .keys(KEYS.F8, function() {})
            .elements(".chrome_hint", function(err, res) {
                assert(res.value.length === 1, "There are three hints on link");
            })
            .isExisting("#chrome_hitahintinput", function(err, isExisting) {
                assert(isExisting === true, "There are one hintinput");
            })
            .call(done);
    });


    it("Should get 1 link search input and then hide it and swow it again. Press ESC button", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .scroll("#doge2")
            .keys(KEYS.F10, function() {})
            .isExisting("#chrome_linksearchinput", function(err, isExisting) {
                assert(isExisting === true, "There are one link search input");
            })
            .keys(KEYS.ESC, function() {})
            .isExisting("#chrome_linksearchinput", function(err, isExisting) {
                assert(isExisting === true);
            })
            .isVisible("#chrome_linksearchinput", function(err, isVisible) {
                assert(isVisible === false);
            })
            .keys(KEYS.F10, function() {})
            .isExisting("#chrome_linksearchinput", function(err, isExisting) {
                assert(isExisting === true, "There are one hintinput");
            })
            .isVisible("#chrome_linksearchinput", function(err, isVisible) {
                assert(isVisible === true);
            })
            .call(done);
    });
    /*
        it("Should get 1 link search input and then hide it and swow it again. LinkSearch button", function(done) {
            client
                .url("http://localhost:8765/index.html")
                .scroll("#doge2")
                .keys(KEYS.F10, function() {})
                .isExisting("#chrome_linksearchinput", function(err, isExisting) {
                    assert(isExisting === true, "There are one hintinput");
                })
                .keys(KEYS.F10, function() {})
                .isExisting("#chrome_linksearchinput", function(err, isExisting) {
                    assert(isExisting === true);
                })
                .isVisible("#chrome_linksearchinput", function(err, isVisible) {
                    assert(isVisible === false, "Linksearch is visible");
                })
                .keys(KEYS.F10, function() {})
                .isExisting("#chrome_linksearchinput", function(err, isExisting) {
                    assert(isExisting === true, "There are one hintinput");
                })
                .isVisible("#chrome_linksearchinput", function(err, isVisible) {
                    assert(isVisible === true);
                })
                .call(done);
        });

    */
    it("Should follow the scroll hit link", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .scroll("#doge2")
            .keys(KEYS.F8, function() {})
            .elements(".chrome_hint", function(err, res) {
                assert(res.value.length === 1, "There are three hints on link");
            })
            .keys(KEYS.a, function() {})
            .keys(KEYS.Enter, function() {})
            .getText("h1", function(err, text) {
                assert(text === "Doge2");
            })
            .call(done);
    });

    it("Should follow the hit link", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .keys(KEYS.F8, function() {})
            .keys(KEYS.a, function() {})
            .keys(KEYS.Enter, function() {})
            .getText("h1", function(err, text) {
                assert(text === "Doge");
            })
            .call(done);
    });

    it("Should find and follow the hit link", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .keys(KEYS.F9, function() {})
            .keys("link to", function() {})
            .keys(KEYS.Enter, function() {})
            .getText("h1", function(err, text) {
                assert(text === "Doge");
            })
            .call(done);
    });

    it("Should be white. Hitahint", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .keys(KEYS.F8, function() {})
            .keys("a", function() {})
            .getCssProperty("#chrome_hitahintinput", "backgroundColor", function(err, res) {
                assert(res.parsed.hex === "#ffffff", "The color isn\'t white");
            })
            .call(done);
    });

    it("Should be red. Hitahint", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .keys(KEYS.F8, function() {})
            .keys("ab", function() {})
            .getCssProperty("#chrome_hitahintinput", "backgroundColor", function(err, res) {
                assert(res.parsed.hex === "#ff0000", "The color isn\'t red");
            })
            .call(done);
    });

    it("Should be white. Linksearch", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .keys(KEYS.F9, function() {})
            .keys("link to", function() {})
            .getCssProperty("#chrome_linksearchinput", "backgroundColor", function(err, res) {
                assert(res.parsed.hex === "#ffffff", "The color isn\'t white");
            })
            .call(done);
    });

    it("Should be red. Linksearch", function(done) {
        client
            .url("http://localhost:8765/index.html")
            .keys(KEYS.F9, function() {})
            .keys("abrvalg", function() {})
            .getCssProperty("#chrome_linksearchinput", "backgroundColor", function(err, res) {
                assert(res.parsed.hex === "#ff0000", "The color isn\'t red");
            })
            .call(done);
    });

    afterEach(function(done) {
        var log = function(err, res) {
            assert(err === null, "Something wrong in console");
            if (res.value.length) console.log(res.value);
        };
        client.log("browser", log);
        client.end(done);
    });
});