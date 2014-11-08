var LinkSearchMode = function() {
    var self = this,
        body, panel, input;
    this.allNodes = [];
    this.candidateNodes = [];
    this.selectedNodeIdx = undefined;
    this.previousString = "";

    this.render = function() {
        body = $("body");
        panel = $("<div id='chrome_linksearchpanel' " +
            "style='opacity:0; display: none;'></div>");
        input = $("<input id='chrome_linksearchinput' type='text'></input>");
        panel.append(input);
        body.append(panel);
    };

    this.addKeyIvents = function() {

        input.keydown(this.keydown);
        input.keyup(this.keyup);
    };

    this.keyup = function(e) {
        e.preventDefault();
        if (e.keyCode === KEY.ESC) {
            self.finish();
            return;
        }
        if (self.previousString === this.value) {
            return;
        }
        self.previousString = this.value;
        self.hideLinks();
        self.candidateNodes = [];

        var regexp = new RegExp(window.migemo.query(this.value), "i");
        for (var i = 0; i < self.allNodes.length; i++) {
            var node = self.allNodes[i];
            if (node.innerText.search(regexp) != -1) {
                self.candidateNodes.push(node);
            }
        }
        if (self.candidateNodes.length > 0) {
            input.css("backgroundColor", "white");

            self.selectedNodeIdx = 0;
            $(self.candidateNodes[0]).addClass("chrome_search_selected");
            for (var j = 1; j < self.candidateNodes.length; j++) {
                $(self.candidateNodes[j]).addClass("chrome_search_selected");
            }
        } else {
            input.css("backgroundColor", "red");
            self.selectedNodeIdx = undefined;
        }
    }

    this.keydown = function(e) {
        switch (e.keyCode) {
            case KEY.SEMICOLON:
                if (self.selectedNodeIdx === undefined) {
                    return;
                }
                self.candidateNodes[self.selectedNodeIdx].focus();
                self.finish();
                e.preventDefault();
                break;
            case KEY.ENTER:
                if (self.selectedNodeIdx === undefined) {
                    return;
                }
                self.click(self.candidateNodes[self.selectedNodeIdx],
                    e.ctrlKey, e.altKey, e.shiftKey, e.metaKey);
                self.finish();
                e.preventDefault();
                break;
            case KEY.G:
                if (e.ctrlKey) {
                    e.preventDefault();
                    if (typeof self.selectedNodeIdx == "undefined") {
                        return;
                    }
                    $(self.candidateNodes[self.selectedNodeIdx]).removeClass("chrome_search_selected");
                    if (!e.shiftKey) {
                        self.selectedNodeIdx += 1;
                        self.selectedNodeIdx %= self.candidateNodes.length;
                    } else {
                        self.selectedNodeIdx -= 1;
                        self.selectedNodeIdx += self.candidateNodes.length;
                        self.selectedNodeIdx %= self.candidateNodes.length;
                    }
                    var new_target = self.candidateNodes[self.selectedNodeIdx];
                    $(new_target).addClass("chrome_search_selected");
                    if (!self.isInArea(new_target.getBoundingClientRect())) {
                        self.makeCenter(new_target);
                    }
                }
                break;
        }
    };

    this.makeCenter = function(node) {
        var cr = node.getBoundingClientRect();
        window.scrollBy(cr.left - window.innerWidth / 2,
            cr.top - window.innerHeight / 2);
    };

    this.hideLinks = function() {
        self.selectedNodeIdx = undefined;
        input.css("backgroundColor", "white");
        $(".chrome_search_candidate").removeClass("chrome_search_candidate");
        $(".chrome_search_selected").removeClass("chrome_search_selected");
    };

    this.panelShow = function() {
        panel.css("display", "block");
        panel.css("opacity", "0.9");
    };

    this.panelHide = function() {
        panel.css("opacity", "0");
        panel.css("display", "none");
    };

    this.init = function() {
        this.addKeyIvents();
        this.panelShow();
        input[0].focus();
        const targetSelector = "a[href]:visible";
        this.allNodes = $.makeArray($(targetSelector));
        for (var i = 0, frames = document.querySelectorAll("iframe"), len = frames.length; i < len; i++) {
            this.allNodes = this.allNodes.concat($.makeArray($(targetSelector,
                frames[i].contentDocument)));
        }
    };

    this.finish = function() {
        mode = undefined;
        input[0].value = "";
        input[0].blur();
        this.panelHide();
        this.hideLinks();
    };
};