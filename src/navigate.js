// linksearch in frames
// start link searching within visible area

const scrollValue = 30;
const KEY = {
    NUM1: 49,
    NUM2: 50,
    NUM3: 51,
    NUM4: 52,
    NUM5: 53,
    NUM6: 54,
    NUM7: 55,
    NUM8: 56,
    NUM9: 57,
    ENTER: 13,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    CONTROL: 17,
    G: 71,
    J: 74,
    K: 75,
    H: 72,
    L: 76,
    ESC: 27,
    Z: 90,
    X: 88,
    SEMICOLON: 186,
    COMMA: 119, //F8
    PERIOD: 120, //F9
    SLASH: 121, //F10
};

var search_enable,
    hitahint_enable,
    other_enable,
    sites,
    usechars,
    mode;

// load connection
var connection = chrome.extension.connect();
connection.onMessage.addListener(function(info) {
    search_enable = info.search == "false" ? false : true;
    hitahint_enable = info.hitahint == "false" ? false : true;
    other_enable = info.other == "false" ? false : true;
    usechars = info.hitahintkeys || "asdfjkl";
    sites = (info.sites || "").split(",").slice(0, -1);
});
connection.postMessage();

var navigate = {
    start: function(e, hitahint, linksearch) {
        var active = document.activeElement;
        if (e.keyCode == KEY.ESC) {
            e.preventDefault();
            active.blur();
            if (mode)
                mode.finish();
            return;
        }
        if (["INPUT", "TEXTAREA"].indexOf(active.tagName) != -1 ||
            mode || e.metaKey || e.ctrlKey)
            return;

        switch (e.keyCode) {
            case KEY.SLASH:
            case KEY.PERIOD:
                if (!search_enable || navigate.isDisabledSite())
                    return;
                e.preventDefault();
                mode = linksearch;
                linksearch.init();
                break;
            case KEY.COMMA:
                if (!hitahint_enable || navigate.isDisabledSite())
                    return;
                e.preventDefault();
                mode = hitahint;
                hitahint.init();
                break;

            case KEY.J:
                if (!other_enable || navigate.isDisabledSite())
                    return;
                window.scrollBy(0, scrollValue);
                break;
            case KEY.K:
                if (!other_enable || navigate.isDisabledSite())
                    return;
                window.scrollBy(0, -scrollValue);
                break;
            case KEY.Z:
                if (!other_enable || navigate.isDisabledSite())
                    return;
                history.back();
                break;
            case KEY.X:
                if (!other_enable || navigate.isDisabledSite())
                    return;
                history.forward();
                break;
            default:
                //      console.log(e.keyCode);
                break;
        }
    },
    isDisabledSite: function() {
        for (var i = 0; i < sites.length; i++)
            if (location.href.search(new RegExp(sites[i])) >= 0)
                return true;
        return false;
    }
};
var baseMethod = {
    click: function(target, ctrlKey, altKey, shiftKey, metaKey) {
        var objects = ["INPUT", "TEXTAREA", "SELECT"];
        if ($.inArray(target.tagName, objects) != -1) {
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
    }
};

$(function() {
    HitAHintMode.prototype = Object.create(baseMethod);
    LinkSearchMode.prototype = Object.create(baseMethod);
    var hitahint = new HitAHintMode(),
        linksearch = new LinkSearchMode();
    hitahint.render();
    linksearch.render();
    $(this).keydown(function(e) {
        navigate.start(e, hitahint, linksearch);
    });
});