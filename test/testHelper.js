"use strict";

var fs = require("fs");

module.exports = {
    getDecodedCrx: function() {
        var name = this.getCrxName();
        return fs.readFileSync("dist/" + name + ".crx").toString("base64");
    },
    getCrxName: function() {
        var manifest = fs.readFileSync("src/manifest.json");
        return JSON.parse(manifest.toString().replace(/^\ufeff/g, "")).name;
    }
};