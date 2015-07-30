"use strict";

var fs = require("fs"),
	path = require("path");

module.exports = {
    getDecodedCrx: function() {
        var name = this.getCrxName();
        return fs.readFileSync(path.resolve(__dirname, "../dist/" + name + ".crx")).toString("base64");
    },
    getCrxName: function() {
    	var file = fs.readFileSync(path.resolve(__dirname, "../src/manifest.json")),
    		manifest = JSON.parse(file.toString().replace(/^\ufeff/g, ""));
        return manifest.name + "-" + manifest.version;
    }
};