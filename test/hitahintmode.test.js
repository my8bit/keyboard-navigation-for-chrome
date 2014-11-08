/*
var assert = require("assert");
describe("HitAHintMode module testing", function() {
    var HitAHintMode = require("../hitahintmode.js"),
        hint,
        jqueryMock = {
            attr: function() {
                return {
                    append: function() {}
                };
            },
            removeClass: function() {},
            append: function() {},
            css: function() {},
            keyup: function() {},
            keydown: function() {},
            focus: function() {},
            find: function() {
                return {
                    map: function() {
                        return [];
                    },
                    get: function() {
                        return [];
                    }
                };
            }
        };

    beforeEach(function() {
        GLOBAL.$ = function() {
            return jqueryMock;
        };
        //Use predefined value
        GLOBAL.usechars = "asdfjkl";
        GLOBAL.document = {
            createDocumentFragment: function() {}
        };
        hint = new HitAHintMode();
    });
    afterEach(function() {
        delete GLOBAL.$;
        delete GLOBAL.usechars;
        delete GLOBAL.document;
        hint = undefined;
    });
    describe("Method .num2string", function() {
        it("Should return ''", function() {
            assert.strictEqual(hint.num2string("a"), "");
        });
        it("Should return 'a'", function() {
            assert.strictEqual(hint.num2string(0), "a");
        });
        it("Should return 'f'", function() {
            assert.strictEqual(hint.num2string(3), "f");
        });
        it("Should return 'j'", function() {
            assert.strictEqual(hint.num2string(4), "j");
        });
        it("Should return 'l'", function() {
            assert.strictEqual(hint.num2string(6), "l");
        });
        it("Should return 'dl'", function() {
            assert.strictEqual(hint.num2string(20), "dl");
        });
        it("Should return 'dad'", function() {
            assert.strictEqual(hint.num2string(100), "dad");
        });
    });

    describe("Method .init", function() {
        it("Should return 'a'", function() {
            console.log(hint.init());
            //assert.strictEqual(hint.num2string(0), "a");
        });
    });
});
*/