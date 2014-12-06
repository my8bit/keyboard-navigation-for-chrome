var baseMethod = {
    click: function(target, ctrlKey, altKey, shiftKey, metaKey) {
        var objects = ["INPUT", "TEXTAREA", "SELECT"],
            $ = require("./jquery-1.11.1.min/index.js");
        if (~$.inArray(target.tagName, objects)) {
            target.focus();
        } else {
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", true, true, window,
                0, 0, 0, 0, 0,
                ctrlKey, altKey, shiftKey, metaKey, 0, null);
            target.dispatchEvent(evt);
        }
    },
    isInArea: function(innerCR, outer) {
        var inWindow = true,
            outerCR = {
                width: window.innerWidth,
                height: window.innerHeight
            };
        if (outer) {
            outerCR = outer.getBoundingClientRect();
            var newInnerCR = {
                left: outerCR.left + innerCR.left,
                top: outerCR.top + innerCR.top,
                width: innerCR.width,
                height: innerCR.height
            };
            inWindow = this.isInArea(newInnerCR);
        }
        var inFrame = (0 <= innerCR.left && innerCR.left <= outerCR.width &&
            0 <= innerCR.top && innerCR.top <= outerCR.height);
        return inWindow && inFrame;
    },
    _currentMode: null,
    setMode: function(mode) {
        this._currentMode = mode;
    },
    getMode: function() {
        return this._currentMode;
    },
    panelShow: function() {
        this.panel.css("display", "block");
        this.panel.css("opacity", "0.9");
    },
    panelHide: function() {
        this.panel.css("opacity", "0");
        this.panel.css("display", "none");
    },
    finish: function() {
        this.input.val("");
        this.input.blur();
        this.panelHide();
        this.hide();
    }
};

module.exports = baseMethod;