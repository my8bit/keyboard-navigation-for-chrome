var assert = require("assert");

describe("HitAHintMode module testing", function() {
    var HitAHintMode = require("../src/hitahintmode.js").HitAHintMode,
        hint;

    beforeEach(function() {
        hint = new HitAHintMode();
    });
    afterEach(function() {
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
});