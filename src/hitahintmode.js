var HitAHintMode = function() {
    var self = this,
        panel = $("<div id='chrome_hitahintpanel' style='opacity:0'></div>"),
        input = $("<input id='chrome_hitahintinput' type='text'></input>"),
        div = $("<div></div>").attr("id", "chrome_hintswindow");

    this.panel = panel;
    this.input = input;

    $("body").append(div);
    $("body").append(panel);

    panel.css("display", "none");
    panel.append(input);

    this.candidateNodes = {};

    input.keyup(function(e) {
        e.preventDefault();
        if (e.keyCode == window.KEY.ESC) {
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
    });

    input.keydown(function(e) {
        if (e.keyCode == window.KEY.COMMA) {
            e.preventDefault();
            e.stopPropagation();
            self.finish();
            return;
        }
        var target;
        if (e.keyCode == window.KEY.SEMICOLON && self.candidateNodes[this.value]) {
            target = self.candidateNodes[this.value].node;
            self.finish();
            target.focus();
            e.preventDefault();
            return;
        }
        if (e.keyCode == window.KEY.ENTER && self.candidateNodes[this.value]) {
            target = self.candidateNodes[this.value].node;
            self.finish();
            click(target, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey);
            e.preventDefault();
        }
    });

    this.showHint = function() {
        const targetSelector = ["a[href]:visible",
            "input[type!=hidden]:visible",
            "textarea:visible",
            "select:visible",
            "img[onclick]:visible",
            "button:visible"
        ].join();

        var frames = $("body").find("iframe, frame").map(function(idx, el) {
                try {
                    return $(el).contents();
                } catch (error) {
                    console.warn(error);
                }
            }),
            docs = [document].concat(frames),
            self = this;

        var idx,
            frameOffset,
            df,
            counter = 0;

        docs.forEach(function(docEl, idxDoc) {
            idx = idxDoc;
            //Get all elements for selector and convert them to Array
            var allNodes = $(docEl).find(targetSelector).get();
            frameOffset = (idx !== 0 && frames[idx - 1] &&
                frames[idx - 1][0].body) ?
                frames[idx - 1][0].body.getBoundingClientRect() : {
                    top: 0,
                    left: 0
            };
            df = document.createDocumentFragment();
            allNodes.forEach(createHints);
            div.append(df);
        });

        function createHints(hintedElement) {
            var node = hintedElement,
                cr = node.getBoundingClientRect();
            if (node.id.indexOf("chrome_") !== 0 && isInArea(cr, frames[idx - 1])) {
                var tag = self.num2string(counter++),
                    span = docs[idx].createElement("span");
                span.innerText = tag;

                var left = (window.pageXOffset + cr.left +
                        (idx ? frameOffset.left - docs[idx].body.scrollLeft : 0)),
                    top = (window.pageYOffset + cr.top +
                        (idx ? frameOffset.top - docs[idx].body.scrollTop : 0));

                span.style.left = "" + (left - 8) + "px";
                span.style.top = "" + (top - 8) + "px";
                span.className = "chrome_hint chrome_not_candidate";
                df.appendChild(span);
                self.candidateNodes[tag] = {
                    "hint": span,
                    "node": node
                };
            }
        }
        //setTimeout(function() {
        $("#chrome_hintswindow > *").removeClass("chrome_not_candidate");
        //}, 0);
    };

    this.hideHint = function() {
        $("#chrome_hintswindow > *").css("opacity", "0");
        //setTimeout(function() {
        $("#chrome_hintswindow").empty();
        //}, 200);
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
        this.panel.css("display", "block");
        this.panel.css("opacity", "0.9");
        this.input.focus();
        this.showHint();
    };

    this.finish = function() {
        mode = undefined;
        input[0].value = "";
        input[0].blur();
        document.body.focus();
        panel.css("opacity", "0");
        var tmp = panel;
        //setTimeout(function() {
        tmp.css("display", "none");
        //}, 100);
        this.hideHint();
    };
};

if (typeof module != "undefined" &&
    module.exports) module.exports = HitAHintMode;