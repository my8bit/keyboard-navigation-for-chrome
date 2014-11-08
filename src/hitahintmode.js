var HitAHintMode = function() {
    var self = this,
        body, div, panel, input;

    this.candidateNodes = {};

    this.render = function function_name() {
        body = $("body");
        div = $("<div id='chrome_hintswindow'></div>");
        panel = $("<div id='chrome_hitahintpanel' " +
            "style='opacity: 0; display: none;'></div>");
        input = $("<input id='chrome_hitahintinput' " +
            "type='text'></input>");
        panel.append(input);
        body.append(div);
        body.append(panel);
    };

    this.addKeyIvents = function() {
        input.keydown(this.keydown);
        input.keyup(this.keyup);
    };

    this.keyup = function(e) {
        e.preventDefault();
        if (e.keyCode == KEY.ESC) {
            self.finish();
            return;
        }

        for (var hintkey in self.candidateNodes) {
            var hint = $(self.candidateNodes[hintkey].hint);
            if (this.value === "" || hintkey.indexOf(this.value) === 0) {
                hint.removeClass("chrome_not_candidate");
            } else {
                hint.addClass("chrome_not_candidate");
            }
        }
        if (this.value === "" || self.candidateNodes[this.value]) {
            input.css("backgroundColor", "white");
        } else {
            input.css("backgroundColor", "red");
        }
    };

    this.keydown = function(e) {
        var target;
        if (e.keyCode === KEY.COMMA) {
            e.preventDefault();
            e.stopPropagation();
            self.finish();
            return;
        }
        if (e.keyCode === KEY.SEMICOLON && self.candidateNodes[this.value]) {
            target = self.candidateNodes[this.value].node;
            self.finish();
            target.focus();
            e.preventDefault();
            return;
        }
        if (e.keyCode === KEY.ENTER && self.candidateNodes[this.value]) {
            target = self.candidateNodes[this.value].node;
            self.finish();
            self.click(target, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey);
            e.preventDefault();
        }
    };

    this.showHint = function() {
        const targetSelector = ["a[href]:visible",
            "input[type!=hidden]:visible",
            "textarea:visible",
            "select:visible",
            "img[onclick]:visible",
            "button:visible"
        ].join();

        var frames = body.find("iframe, frame").map(function(idx, el) {
                try {
                    //?? idx
                    return $(el).contents();
                } catch (error) {
                    console.warn(error);
                }
            }),
            docs = [document].concat(frames),
            frameOffset,
            df,
            counter = 0;

        docs.forEach(function(docEl, idx) {
            frameOffset = (idx !== 0 && frames[idx - 1] &&
                frames[idx - 1][0].body) ?
                frames[idx - 1][0].body.getBoundingClientRect() : {
                    top: 0,
                    left: 0
            };
            df = document.createDocumentFragment();
            //Get all elements for selector covert to array and iterate
            $(docEl)
                .find(targetSelector)
                .get()
                .forEach(function(el) {
                    self.createHints(el, counter, idx, frameOffset, df, docEl);
                });
            div.append(df);
        });
        $("#chrome_hintswindow > *").removeClass("chrome_not_candidate");
    };

    this.createHints = function(hintedElement, counter, idx, frameOffset, df, docEl) {
        var node = hintedElement,
            cr = node.getBoundingClientRect();
        if (node.id.indexOf("chrome_") !== 0 && self.isInArea(cr, frames[idx - 1])) {
            var tag = self.num2string(counter++),
                span = docEl.createElement("span");
            span.innerText = tag;

            var left = (window.pageXOffset + cr.left +
                    (idx ? frameOffset.left - docEl.body.scrollLeft : 0)),
                top = (window.pageYOffset + cr.top +
                    (idx ? frameOffset.top - docEl.body.scrollTop : 0));

            span.style.left = "" + (left - 8) + "px";
            span.style.top = "" + (top - 8) + "px";
            span.className = "chrome_hint chrome_not_candidate";
            df.appendChild(span);
            self.candidateNodes[tag] = {
                "hint": span,
                "node": node
            };
        }
    };

    this.hideHint = function() {
        $("#chrome_hintswindow > *").css("opacity", "0");
        $("#chrome_hintswindow").empty();
    };

    this.num2string = function(num) {
        var n = usechars.length,
            table = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, n),
            tmp = (typeof num == "number") ? num.toString(n) : [],
            result = "";
        for (var i = 0; i < tmp.length; i++) {
            result += usechars[table.indexOf(tmp[i])];
        }
        return result;
    };

    this.init = function() {
        this.addKeyIvents();
        this.panelShow();
        input.focus();
        this.showHint();
    };

    this.panelShow = function() {
        panel.css("display", "block");
        panel.css("opacity", "0.9");
    };

    this.panelHide = function() {
        panel.css("opacity", "0");
        panel.css("display", "none");
    };

    this.finish = function() {
        mode = undefined;
        input.val("");
        input.blur();
        body.focus();
        this.panelHide();
        this.hideHint();
    };
};

if (typeof module != "undefined" &&
    module.exports) module.exports = HitAHintMode;