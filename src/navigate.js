// linksearch in frames
// start link searching within visible area

const scrollValue = 30;

var KEY = require("./key.js");

var search_enable,
    hitahint_enable,
    other_enable,
    sites,
    usechars;

// load connection
var connection = chrome.extension.connect();
connection.onMessage.addListener(function(info) {
    search_enable = info.search == "false" ? false : true;
    hitahint_enable = info.hitahint == "false" ? false : true;
    other_enable = info.other == "false" ? false : true;
    //usechars = info.hitahintkeys || "asdfjkl"; //Fix: hardcoded on hitahint mode
    sites = (info.sites || "").split(",").slice(0, -1);
});
connection.postMessage();

var navigate = {
    start: function(e, hitahint, linksearch) {
        var active = document.activeElement,
            baseMethod = require("./basemethod.js");
        if (e.keyCode === KEY.ESC) {
            e.preventDefault();
            active.blur();
            if (baseMethod.getMode()) {
                baseMethod.getMode().finish();
                baseMethod.setMode(null);
            }
            return;
        }
        if (["INPUT", "TEXTAREA"].indexOf(active.tagName) != -1 ||
            baseMethod.getMode() || e.metaKey || e.ctrlKey)
            return;

        switch (e.keyCode) {
            case KEY.SLASH:
            case KEY.PERIOD:
                if (!search_enable || navigate.isDisabledSite())
                    return;
                e.preventDefault();
                baseMethod.setMode(linksearch);
                linksearch.init();
                break;
            case KEY.COMMA:
                if (!hitahint_enable || navigate.isDisabledSite())
                    return;
                e.preventDefault();
                baseMethod.setMode(hitahint);
                hitahint.init();
                break;
                /*
                 * Disable due settings refactoring
                 *
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
                */
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
var $ = require("./jquery-1.11.1.min/index.js");
$(function() {
    var HitAHintMode = require("./hitahintmode.js").HitAHintMode,
        LinkSearchMode = require("./linksearchmode.js").LinkSearchMode,
        baseMethod = require("./basemethod.js"),
        hitahint,
        linksearch;
    HitAHintMode.prototype = Object.create(baseMethod);
    LinkSearchMode.prototype = Object.create(baseMethod);
    HitAHintMode.prototype.constructor = baseMethod;
    LinkSearchMode.prototype.constructor = baseMethod;
    hitahint = new HitAHintMode();
    linksearch = new LinkSearchMode();
    hitahint.render();
    linksearch.render();
    $(this).keydown(function(e) {
        navigate.start(e, hitahint, linksearch);
    });
});