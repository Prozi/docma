/**
 *  @license
 *  Zebra Template for Docma - app.js
 *  Copyright © 2019, Onur Yıldırım
 *  SVG shapes: CC-BY 4.0
 */
var app = window.app || {};
var templateOpts = {
    sidebar: {},
    navbar: {},
    contentView: { bookmarks: {} },
    symbols: {},
};
(function () {
    "use strict";
    app.svg = {};
    /**
     *  @license
     *  CC-BY 4.0, © Onur Yıldırım
     */ var shapes = {
        square: '<path d="M45.9 52.7H14.1c-3.9 0-7-3.1-7-7V13.8c0-3.9 3.1-7 7-7h31.8c3.9 0 7 3.1 7 7v31.8C52.9 49.5 49.8 52.7 45.9 52.7z"/>',
        circle: '<circle cx="30" cy="30.1" r="24.8"/>',
        diamond:
            '<path d="M55.6 34.7L34.9 55.4c-2.7 2.7-7.2 2.7-9.9 0L4.4 34.7c-2.7-2.7-2.7-7.2 0-9.9L25.1 4.1c2.7-2.7 7.2-2.7 9.9 0l20.7 20.7C58.4 27.5 58.4 32 55.6 34.7z"/>',
        pentagonUp:
            '<path d="M10.9 49.9L3.4 26.6c-1-3 0.1-6.2 2.6-8L25.8 4.2c2.5-1.8 5.9-1.8 8.4 0L54 18.6c2.5 1.8 3.6 5.1 2.6 8l-7.6 23.3c-1 3-3.7 5-6.8 5H17.8C14.7 54.8 11.9 52.8 10.9 49.9z"/>',
        pentagonDown:
            '<path d="M49.1 10.8L56.6 34c1 3-0.1 6.2-2.6 8L34.2 56.5c-2.5 1.8-5.9 1.8-8.4 0L6 42.1c-2.5-1.8-3.6-5.1-2.6-8l7.6-23.3c1-3 3.7-5 6.8-5h24.5C45.3 5.8 48.1 7.8 49.1 10.8z"/>',
        octagon:
            '<path d="M17.4 53.5L6.5 42.6c-1.3-1.3-2.1-3.1-2.1-5V22.3c0-1.9 0.7-3.6 2.1-5L17.4 6.5c1.3-1.3 3.1-2.1 5-2.1h15.4c1.9 0 3.6 0.7 5 2.1l10.9 10.9c1.3 1.3 2.1 3.1 2.1 5v15.4c0 1.9-0.7 3.6-2.1 5L42.6 53.5c-1.3 1.3-3.1 2.1-5 2.1H22.3C20.4 55.6 18.7 54.8 17.4 53.5z"/>',
        hexagonH:
            '<path d="M13.7 51.3L3.4 33.5c-1.3-2.2-1.3-4.8 0-7L13.7 8.7c1.3-2.2 3.6-3.5 6.1-3.5h20.5c2.5 0 4.8 1.3 6.1 3.5l10.3 17.8c1.3 2.2 1.3 4.8 0 7L46.3 51.3c-1.3 2.2-3.6 3.5-6.1 3.5H19.7C17.2 54.8 14.9 53.4 13.7 51.3z"/>',
        hexagonV:
            '<path d="M51.3 46.3L33.5 56.6c-2.2 1.3-4.8 1.3-7 0L8.7 46.3c-2.2-1.3-3.5-3.6-3.5-6.1V19.7c0-2.5 1.3-4.8 3.5-6.1L26.5 3.4c2.2-1.3 4.8-1.3 7 0l17.8 10.3c2.2 1.3 3.5 3.6 3.5 6.1v20.5C54.8 42.8 53.4 45.1 51.3 46.3z"/>',
    };
    shapes.pentagon = shapes.pentagonUp;
    shapes.hexagon = shapes.hexagonV;
    app.svg.shape = function (options) {
        var opts = options || {};
        var shape = opts.shape || "square";
        var svg = shapes[shape];
        var cls = "badge-" + shape;
        cls += " svg-fill-" + (opts.color || "black");
        if (opts.addClass) cls += " " + opts.addClass;
        svg =
            '<svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 60 60">' +
            svg +
            "</svg>";
        var scopeCircle = opts.circleColor
            ? '<div class="badge-scope-circle bg-' +
              opts.circleColor +
              '"></div>'
            : "";
        var dataKind = !opts.circleColor
            ? ' data-kind="' + opts.kind + '"'
            : "";
        var title = (opts.title || "").toLowerCase();
        return (
            '<div class="symbol-badge ' +
            cls +
            '" title="' +
            title +
            '"' +
            dataKind +
            ">" +
            scopeCircle +
            "<span>" +
            (opts.char || "-") +
            "</span>" +
            svg +
            "</div>"
        );
    };
    function getFaHtml(title, color) {
        return (
            '<div class="symbol-badge svg-fill-' +
            color +
            '" title="' +
            title +
            '"><span></span>' +
            '<i class="fas fa-exclamation-circle color-' +
            color +
            '"></i>' +
            "</div>"
        );
    }
    app.svg.warn = function (title) {
        title = title || "Warning: Check your JSDoc comments.";
        return getFaHtml(title, "yellow");
    };
    app.svg.error = function (title) {
        title = title || "Error: Check your JSDoc comments.";
        return getFaHtml(title, "red");
    };
})();
/**
 *  @license
 *  Zebra Template for Docma - app.js
 *  Copyright © 2019, Onur Yıldırım
 */
var app = window.app || {};
(function () {
    "use strict";
    app.NODE_MIN_FONT_SIZE = 9;
    app.NODE_MAX_FONT_SIZE = 13;
    app.NODE_LABEL_MAX_WIDTH = 210;
    app.RE_EXAMPLE_CAPTION = /^\s*<caption>(.*?)<\/caption>\s*/gi;
    app.NAVBAR_HEIGHT = 50;
    app.SIDEBAR_WIDTH = 300;
    app.SIDEBAR_NODE_HEIGHT = 36;
    app.TOOLBAR_HEIGHT = 30;
    app.TREE_NODE_WIDTH = 25;
    var helper = {};
    helper.toggleBodyScroll = function (enable) {
        var overflow = enable ? "auto" : "hidden";
        $("body").css({ overflow: overflow });
    };
    helper.capitalize = function (str) {
        return str
            .split(/[ \t]+/g)
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    };
    helper.removeFromArray = function (arr, value) {
        var index = arr.indexOf(value);
        if (index !== -1) arr.splice(index, 1);
    };
    helper.addToArray = function (arr, value) {
        var index = arr.indexOf(value);
        if (index === -1) arr.push(value);
    };
    helper.debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this;
            var args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    helper.getCssNumVal = function ($elem, styleName) {
        return parseInt($elem.css(styleName), 10) || 0;
    };
    helper.getScrollWidth = function ($elem) {
        return $elem.get(0).scrollWidth || $elem.outerWidth() || 0;
    };
    helper.fitSidebarNavItems = function ($el, outline) {
        outline = outline || templateOpts.sidebar.outline;
        var cropToFit = templateOpts.sidebar.itemsOverflow === "crop";
        if (cropToFit) {
            var dMarginLeft = "data-margin-" + outline;
            var $inner = $el.find(".inner");
            var savedMargin = $inner.attr(dMarginLeft);
            if (!savedMargin) {
                var marginLeft = Math.round(
                    app.NODE_LABEL_MAX_WIDTH - helper.getScrollWidth($inner),
                );
                if (marginLeft >= 0) marginLeft = 0;
                $inner.attr(dMarginLeft, marginLeft + "px");
            }
            return;
        }
        var dFontSize = "data-font-" + outline;
        var savedSize = $el.attr(dFontSize);
        if (savedSize) {
            $el.css("font-size", savedSize);
            return;
        }
        var delay = templateOpts.sidebar.animations ? 210 : 0;
        setTimeout(function () {
            var spans = $el.find("span").addClass("no-trans");
            var f = app.NODE_MAX_FONT_SIZE;
            while (
                $el.width() > app.NODE_LABEL_MAX_WIDTH &&
                f >= app.NODE_MIN_FONT_SIZE
            ) {
                $el.css("font-size", f + "px");
                f -= 0.2;
            }
            $el.attr(dFontSize, f + "px");
            spans.removeClass("no-trans");
        }, delay);
    };
    helper.colorOperators = function (str) {
        return str
            .replace(/[.#~]/g, '<span class="color-blue">$&</span>')
            .replace(/:/g, '<span class="color-gray-dark">$&</span>');
    };
    helper.hasChildren = function (symbol) {
        return symbol.$members && !symbol.isEnum;
    };
    helper.getScopeInfo = function (scope) {
        var o = {};
        var top = 0;
        var left = 0;
        var m = 12;
        switch (scope) {
            case "global":
                o.color = "purple";
                break;
            case "static":
                o.color = "accent";
                top = m;
                break;
            case "instance":
                o.color = "green";
                left = m;
                break;
            case "inner":
                o.color = "gray-light";
                top = m;
                left = m;
                break;
            default:
                o.color = null;
        }
        var margin = top + "px 0 0 " + left + "px";
        o.title = scope || "";
        o.badge =
            '<div class="badge-scope-btn bg-' +
            o.color +
            '" style="margin:' +
            margin +
            '" title="' +
            scope +
            '" data-scope="' +
            scope +
            '"></div>';
        return o;
    };
    helper.getSymbolInfo = function (kind, scope, asButton) {
        var title = scope || "";
        title += " " + String(kind || "").replace("typedef", "type");
        title = DocmaWeb.Utils.trimLeft(helper.capitalize(title));
        var svgOpts = {
            title: title,
            addClass: asButton ? "badge-btn" : "",
            circleColor: helper.getScopeInfo(scope).color,
            kind: kind,
            scope: scope,
        };
        switch (kind) {
            case "class":
                svgOpts.char = "C";
                svgOpts.color = "green";
                svgOpts.shape = "diamond";
                break;
            case "constructor":
                svgOpts.char = "c";
                svgOpts.color = "green-pale";
                svgOpts.shape = "circle";
                break;
            case "namespace":
                svgOpts.char = "N";
                svgOpts.color = "pink";
                svgOpts.shape = "pentagonDown";
                break;
            case "module":
                svgOpts.char = "M";
                svgOpts.color = "red";
                svgOpts.shape = "hexagonH";
                break;
            case "constant":
                svgOpts.char = "c";
                svgOpts.color = "brown";
                svgOpts.shape = "hexagonV";
                break;
            case "typedef":
                svgOpts.char = "T";
                svgOpts.color = "purple-dark";
                svgOpts.shape = "hexagonV";
                break;
            case "global":
                svgOpts.char = "G";
                svgOpts.color = "purple-dark";
                svgOpts.shape = "hexagonV";
                break;
            case "global-object":
                svgOpts.char = "G";
                svgOpts.color = "purple-dark";
                svgOpts.shape = "hexagonV";
                break;
            case "global-function":
                svgOpts.char = "F";
                svgOpts.color = "accent";
                svgOpts.shape = "circle";
                break;
            case "function":
                svgOpts.char = "F";
                svgOpts.color = "accent";
                svgOpts.shape = "circle";
                break;
            case "method":
                svgOpts.char = "M";
                svgOpts.color = "cyan";
                svgOpts.shape = "circle";
                break;
            case "property":
                svgOpts.char = "P";
                svgOpts.color = "yellow";
                svgOpts.shape = "square";
                break;
            case "enum":
                svgOpts.char = "e";
                svgOpts.color = "orange";
                svgOpts.shape = "pentagonUp";
                break;
            case "event":
                svgOpts.char = "E";
                svgOpts.color = "blue-pale";
                svgOpts.shape = "octagon";
                break;
            case "member":
                svgOpts.char = "m";
                svgOpts.color = "ice-blue";
                svgOpts.shape = "square";
                break;
            default:
                svgOpts.title = "";
                svgOpts.char = "•";
                svgOpts.color = "black";
                svgOpts.shape = "square";
        }
        return {
            kind: kind,
            scope: scope || "",
            char: svgOpts.char,
            badge: app.svg.shape(svgOpts),
        };
    };
    function getSymbolData(symbol) {
        if (!symbol) {
            return { kind: "Unknown", char: "", badge: app.svg.error() };
        }
        if (DocmaWeb.Utils.isClass(symbol))
            return helper.getSymbolInfo("class", symbol.scope);
        if (DocmaWeb.Utils.isConstant(symbol))
            return helper.getSymbolInfo("constant", symbol.scope);
        if (DocmaWeb.Utils.isTypeDef(symbol))
            return helper.getSymbolInfo("typedef", symbol.scope);
        if (DocmaWeb.Utils.isConstructor(symbol))
            return helper.getSymbolInfo("constructor", symbol.scope);
        if (DocmaWeb.Utils.isNamespace(symbol))
            return helper.getSymbolInfo("namespace", symbol.scope);
        if (DocmaWeb.Utils.isModule(symbol))
            return helper.getSymbolInfo("module", symbol.scope);
        if (DocmaWeb.Utils.isEnum(symbol))
            return helper.getSymbolInfo("enum", symbol.scope);
        if (DocmaWeb.Utils.isEvent(symbol))
            return helper.getSymbolInfo("event", symbol.scope);
        if (DocmaWeb.Utils.isProperty(symbol))
            return helper.getSymbolInfo("property", symbol.scope);
        if (DocmaWeb.Utils.isMethod(symbol))
            return helper.getSymbolInfo("method", symbol.scope);
        if (symbol.kind === "member")
            return helper.getSymbolInfo("member", symbol.scope);
        return helper.getSymbolInfo();
    }
    function getTreeLine(treeNode, addClass) {
        var cls = "item-tree-line";
        if (addClass) cls += " " + addClass;
        if (treeNode === "parent") cls += " item-tree-parent";
        return (
            '<img class="' +
            cls +
            '" src="img/tree-' +
            treeNode +
            '.png" width="' +
            app.TREE_NODE_WIDTH +
            '" height="' +
            app.SIDEBAR_NODE_HEIGHT +
            '" />'
        );
    }
    function getTreeLineImgs(levels, treeNode, hasChildren, lastNodeLevels) {
        var imgs = [];
        if (hasChildren) imgs = [getTreeLine("parent", "absolute")];
        if (treeNode === "first") {
            if (levels > 1) return getTreeLineImgs(levels, "node", hasChildren);
        } else {
            imgs.unshift(getTreeLine(treeNode));
        }
        var deeps = [];
        if (levels > 2) {
            var i;
            for (i = 2; i < levels; i++) {
                if (i <= lastNodeLevels) {
                    deeps.unshift(getTreeLine("space"));
                } else {
                    deeps.push(getTreeLine("deep"));
                }
            }
        }
        imgs = deeps.concat(imgs);
        return imgs.join("");
    }
    function getSidebarNavItemInner(
        badge,
        symbolName,
        treeNode,
        hasChildren,
        lastNodeLevels,
    ) {
        var levels = DocmaWeb.Utils.getLevels(symbolName);
        var badgeIsStr = typeof templateOpts.sidebar.badges === "string";
        var noBadge = Boolean(templateOpts.sidebar.badges) === false;
        var name = dust.filters.$dot_prop_sb(symbolName);
        var treeImages = "";
        var labelMargin;
        var errMessage = "";
        treeImages = getTreeLineImgs(
            levels,
            treeNode,
            hasChildren,
            lastNodeLevels,
        );
        if (noBadge) {
            badge = "";
            labelMargin = 7;
        } else if (badgeIsStr) {
            badge =
                '<div class="symbol-badge badge-str"><span>' +
                badge +
                "</span></div>";
            labelMargin = 25;
        } else {
            labelMargin = 31;
        }
        var labelStyle =
            ' style="margin-left: ' + labelMargin + 'px !important; "';
        var itemTitle = errMessage ? ' title="' + errMessage + '"' : "";
        return (
            '<div class="item-inner" data-levels="' +
            levels +
            '" data-tree="' +
            treeNode +
            '" style="margin-left:0px">' +
            treeImages +
            badge +
            '<div class="item-label"' +
            itemTitle +
            labelStyle +
            ">" +
            '<div class="edge-shadow"></div>' +
            '<div class="inner">' +
            name +
            "</div>" +
            "</div>" +
            "</div>"
        );
    }
    function getSidebarNavItem(symbol, parentSymbol, isLast, lastNodeLevels) {
        var treeNode = parentSymbol ? (isLast ? "last" : "node") : "first";
        var id = dust.filters.$id(symbol);
        var keywords = DocmaWeb.Utils.getKeywords(symbol);
        var symbolData = getSymbolData(symbol);
        var badge =
            templateOpts.sidebar.badges === true
                ? symbolData.badge || ""
                : typeof templateOpts.sidebar.badges === "string"
                  ? templateOpts.sidebar.badges
                  : "&nbsp;•&nbsp;";
        var hasChildren = helper.hasChildren(symbol);
        var innerHTML = getSidebarNavItemInner(
            badge,
            symbol.$longname,
            treeNode,
            hasChildren,
            lastNodeLevels,
        );
        var chevron = "";
        if (hasChildren) {
            chevron =
                '<div class="chevron"><i class="fas fa-lg fa-angle-right"></i></div>';
        }
        return (
            chevron +
            '<a href="#' +
            id +
            '" class="sidebar-item" data-keywords="' +
            keywords +
            '" data-kind="' +
            symbolData.kind +
            '" data-scope="' +
            symbolData.scope +
            '">' +
            innerHTML +
            "</a>"
        );
    }
    helper.buildSidebarNodes = function (
        symbolNames,
        symbols,
        parentSymbol,
        lastNodeLevels,
    ) {
        lastNodeLevels = lastNodeLevels || 0;
        symbols = symbols || docma.documentation;
        var items = [];
        symbols.forEach(function (symbol, index) {
            if (symbolNames.indexOf(symbol.$longname) === -1) return;
            if (
                DocmaWeb.Utils.isConstructor(symbol) &&
                symbol.hideconstructor === true
            ) {
                return;
            }
            var isLast = index === symbols.length - 1;
            var navItem = getSidebarNavItem(
                symbol,
                parentSymbol,
                isLast,
                lastNodeLevels,
            );
            var currentLastLevel = isLast
                ? DocmaWeb.Utils.getLevels(symbol)
                : lastNodeLevels;
            var members = "";
            if (helper.hasChildren(symbol)) {
                members =
                    '<ul class="item-members trans-all-ease">' +
                    helper
                        .buildSidebarNodes(
                            symbolNames,
                            symbol.$members,
                            symbol,
                            currentLastLevel,
                        )
                        .join("") +
                    "</ul>";
            }
            items.push("<li>" + navItem + members + "</li>");
        });
        return items;
    };
    var RE_KIND = /(?:\bkind:\s*)([^, ]+(?:\s*,\s*[^, ]+)*)?/gi;
    var RE_SCOPE = /(?:\bscope:\s*)([^, ]+(?:\s*,\s*[^, ]+)*)?/gi;
    function SidebarSearch() {
        this.reset();
    }
    SidebarSearch.prototype.reset = function () {
        this.scope = [];
        this.kind = [];
        this.keywords = [];
    };
    SidebarSearch.prototype.parseKeywords = function (string) {
        var kw = (string || "")
            .replace(RE_KIND, "")
            .replace(RE_SCOPE, "")
            .trim()
            .replace(/\s+/, " ");
        this.keywords = kw ? kw.split(" ") : [];
        return this;
    };
    SidebarSearch.prototype.parse = function (string) {
        if (!string) {
            this.kind = [];
            this.scope = [];
            this.keywords = [];
            return this;
        }
        var m = RE_KIND.exec(string);
        if (!m || m.length < 2 || !m[1] || m.indexOf("*") >= 0) {
            this.kind = [];
        } else {
            this.kind = m[1].split(",").map(function (k) {
                return k.toLocaleLowerCase().trim();
            });
        }
        m = RE_SCOPE.exec(string);
        if (!m || m.length < 2 || !m[1] || m.indexOf("*") >= 0) {
            this.scope = [];
        } else {
            this.scope = m[1].split(",").map(function (s) {
                return s.toLocaleLowerCase().trim();
            });
        }
        RE_KIND.lastIndex = 0;
        RE_SCOPE.lastIndex = 0;
        this.parseKeywords(string);
        return this;
    };
    SidebarSearch.prototype.hasScope = function (scope) {
        return this.scope.indexOf(scope) >= 0;
    };
    SidebarSearch.prototype.removeScope = function (scope) {
        helper.removeFromArray(this.scope, scope);
    };
    SidebarSearch.prototype.addScope = function (scope) {
        helper.addToArray(this.scope, scope);
    };
    SidebarSearch.prototype.hasKind = function (kind) {
        return this.kind.indexOf(kind) >= 0;
    };
    SidebarSearch.prototype.removeKind = function (kind) {
        helper.removeFromArray(this.kind, kind);
    };
    SidebarSearch.prototype.addKind = function (kind) {
        helper.addToArray(this.kind, kind);
    };
    SidebarSearch.prototype.matchesAnyKeyword = function (keywords) {
        return this.keywords.some(function (kw) {
            return keywords.indexOf(kw.toLocaleLowerCase()) >= 0;
        });
    };
    SidebarSearch.prototype.toObject = function () {
        return { scope: this.scope, kind: this.kind, keywords: this.keywords };
    };
    SidebarSearch.prototype.toString = function () {
        var s = "";
        if (Array.isArray(this.keywords) && this.keywords.length > 0) {
            s = this.keywords.join(" ") + " ";
        }
        if (Array.isArray(this.scope) && this.scope.length > 0) {
            s += "scope:" + this.scope.join(",") + " ";
        }
        if (Array.isArray(this.kind) && this.kind.length > 0) {
            s += "kind:" + this.kind.join(",");
        }
        return s.trim();
    };
    app.SidebarSearch = SidebarSearch;
    app.helper = helper;
})();
(function () {
    "use strict";
    function dotProp(name, forSidebar) {
        var re = /(.*)([.#~][\w:]+)/g,
            match = re.exec(name);
        if (!match) return '<span class="fw-bold">' + name + "</span>";
        if (forSidebar) {
            var cls = templateOpts.sidebar.animations
                ? " trans-all-ease-fast"
                : "";
            return (
                '<span class="color-gray symbol-memberof' +
                cls +
                '">' +
                app.helper.colorOperators(match[1]) +
                "</span><span>" +
                app.helper.colorOperators(match[2]) +
                "</span>"
            );
        }
        return (
            '<span class="color-gray">' +
            app.helper.colorOperators(match[1]) +
            '</span><span class="fw-bold">' +
            app.helper.colorOperators(match[2]) +
            "</span>"
        );
    }
    docma
        .addFilter("$color_ops", function (name) {
            return app.helper.colorOperators(name);
        })
        .addFilter("$dot_prop_sb", function (name) {
            return dotProp(name, true);
        })
        .addFilter("$dot_prop", function (name) {
            return dotProp(name, false);
        })
        .addFilter("$author", function (symbol) {
            var authors = Array.isArray(symbol) ? symbol : symbol.author || [];
            return authors.join(", ");
        })
        .addFilter("$type", function (symbol) {
            if (DocmaWeb.Utils.isConstructor(symbol)) return "";
            var opts = { links: templateOpts.symbols.autoLink };
            if (symbol.kind === "function") {
                var returnTypes = DocmaWeb.Utils.getReturnTypes(
                    docma.apis,
                    symbol,
                    opts,
                );
                return returnTypes ? returnTypes : "";
            }
            var types = DocmaWeb.Utils.getTypes(docma.apis, symbol, opts);
            return types ? types : "";
        })
        .addFilter("$type_sep", function (symbol) {
            if (DocmaWeb.Utils.isConstructor(symbol)) return "";
            if (symbol.kind === "function") return "⇒";
            if (symbol.kind === "event" && symbol.type) return "⇢";
            if (symbol.kind === "class") return ":";
            if (!symbol.type && !symbol.returns) return "";
            return ":";
        })
        .addFilter("$param_desc", function (param) {
            return DocmaWeb.Utils.parse(param.description || "");
        })
        .addFilter("$longname", function (symbol) {
            if (typeof symbol === "string") return symbol;
            var nw = DocmaWeb.Utils.isConstructor(symbol) ? "new " : "";
            return nw + symbol.$longname;
        })
        .addFilter("$longname_params", function (symbol) {
            var isCon = DocmaWeb.Utils.isConstructor(symbol),
                longName = app.helper.colorOperators(symbol.$longname);
            if (symbol.kind === "function" || isCon) {
                var defVal,
                    defValHtml = "",
                    nw = isCon ? "new " : "",
                    name = nw + longName + "(";
                if (Array.isArray(symbol.params)) {
                    var params = symbol.params
                        .reduce(function (memo, param) {
                            if (param && param.name.indexOf(".") === -1) {
                                defVal = param.hasOwnProperty("defaultvalue")
                                    ? String(param.defaultvalue)
                                    : "undefined";
                                defValHtml = param.optional
                                    ? '<span class="def-val">=' +
                                      defVal +
                                      "</span>"
                                    : "";
                                var rest = param.variable ? "..." : "";
                                memo.push(rest + param.name + defValHtml);
                            }
                            return memo;
                        }, [])
                        .join(", ");
                    name += params;
                }
                return name + ")";
            }
            return longName;
        })
        .addFilter("$extends", function (symbol) {
            var ext = Array.isArray(symbol) ? symbol : symbol.augments;
            return DocmaWeb.Utils.getCodeTags(docma.apis, ext, {
                delimeter: ", ",
                links: templateOpts.symbols.autoLink,
            });
        })
        .addFilter("$returns", function (symbol) {
            var returns = Array.isArray(symbol) ? symbol : symbol.returns;
            return DocmaWeb.Utils.getFormattedTypeList(docma.apis, returns, {
                delimeter: "|",
                descriptions: true,
                links: templateOpts.symbols.autoLink,
            });
        })
        .addFilter("$yields", function (symbol) {
            var yields = Array.isArray(symbol) ? symbol : symbol.yields;
            return DocmaWeb.Utils.getFormattedTypeList(docma.apis, yields, {
                delimeter: "|",
                descriptions: true,
                links: templateOpts.symbols.autoLink,
            });
        })
        .addFilter("$emits", function (symbol) {
            var emits = Array.isArray(symbol) ? symbol : symbol.fires;
            return DocmaWeb.Utils.getEmittedEvents(docma.apis, emits, {
                delimeter: ", ",
                links: templateOpts.symbols.autoLink,
            });
        })
        .addFilter("$exceptions", function (symbol) {
            var exceptions = Array.isArray(symbol) ? symbol : symbol.exceptions;
            return DocmaWeb.Utils.getFormattedTypeList(docma.apis, exceptions, {
                delimeter: "|",
                descriptions: true,
                links: templateOpts.symbols.autoLink,
            });
        })
        .addFilter("$tags", function (symbol) {
            var openIce =
                    '<span class="boxed vertical-middle bg-ice opacity-full">',
                openIceDark =
                    '<span class="boxed vertical-middle bg-ice-dark opacity-full">',
                openBlue =
                    '<span class="boxed vertical-middle bg-blue opacity-full">',
                openGreenPale =
                    '<span class="boxed vertical-middle bg-green-pale color-white opacity-full">',
                openYellow =
                    '<span class="boxed vertical-middle bg-yellow color-brown opacity-full">',
                openPurple =
                    '<span class="boxed vertical-middle bg-purple color-white opacity-full">',
                openRed =
                    '<span class="boxed vertical-middle bg-red color-white opacity-full">',
                openPink =
                    '<span class="boxed vertical-middle bg-pink color-white opacity-full">',
                openBrown =
                    '<span class="boxed vertical-middle bg-brown color-white opacity-full">',
                close = "</span>",
                tagBoxes = [];
            if (DocmaWeb.Utils.isDeprecated(symbol)) {
                tagBoxes.push(openYellow + "deprecated" + close);
            }
            if (
                DocmaWeb.Utils.isGlobal(symbol) &&
                !DocmaWeb.Utils.isConstructor(symbol)
            ) {
                tagBoxes.push(openPurple + "global" + close);
            }
            if (DocmaWeb.Utils.isStatic(symbol)) {
                tagBoxes.push(openBlue + "static" + close);
            }
            if (DocmaWeb.Utils.isInner(symbol)) {
                tagBoxes.push(openIceDark + "inner" + close);
            }
            if (DocmaWeb.Utils.isModule(symbol)) {
                tagBoxes.push(openRed + "module" + close);
            }
            if (DocmaWeb.Utils.isConstructor(symbol)) {
                tagBoxes.push(openGreenPale + "constructor" + close);
            }
            if (DocmaWeb.Utils.isNamespace(symbol)) {
                tagBoxes.push(openPink + "namespace" + close);
            }
            if (DocmaWeb.Utils.isGenerator(symbol)) {
                tagBoxes.push(openBlue + "generator" + close);
            }
            if (DocmaWeb.Utils.isPublic(symbol) === false) {
                tagBoxes.push(openIceDark + symbol.access + close);
            }
            if (DocmaWeb.Utils.isReadOnly(symbol)) {
                tagBoxes.push(openIceDark + "readonly" + close);
            }
            if (DocmaWeb.Utils.isConstant(symbol)) {
                tagBoxes.push(openBrown + "constant" + close);
            }
            var tags = Array.isArray(symbol) ? symbol : symbol.tags || [];
            var tagTitles = tags.map(function (tag) {
                return openIce + tag.originalTitle + close;
            });
            tagBoxes = tagBoxes.concat(tagTitles);
            if (tagBoxes.length)
                return "&nbsp;&nbsp;" + tagBoxes.join("&nbsp;");
            return "";
        })
        .addFilter("$navnodes", function (symbolNames) {
            return app.helper.buildSidebarNodes(symbolNames).join("");
        })
        .addFilter("$get_caption", function (example) {
            var m = app.RE_EXAMPLE_CAPTION.exec(example || "");
            return m && m[1]
                ? " — <i>" + DocmaWeb.Utils.parseTicks(m[1]) + "</i>"
                : "";
        })
        .addFilter("$remove_caption", function (example) {
            return (example || "").replace(app.RE_EXAMPLE_CAPTION, "");
        });
})();
var app = window.app || {};
(function () {
    "use strict";
    var helper = app.helper;
    var $sidebarNodes, $btnClean, $txtSearch;
    var $wrapper, $sidebarWrapper, $sidebarToggle;
    var $nbmBtn,
        $navOverlay,
        $navbarMenu,
        $navbarBrand,
        $navbarInner,
        $navbarList;
    var $btnSwitchFold, $btnSwitchOutline;
    var $scopeFilters, $scopeFilterBtns, $kindFilters, $kindFilterBtns;
    var navbarMenuActuallWidth;
    var isFilterActive = false;
    var isItemsFolded = templateOpts.sidebar.itemsFolded;
    var isApiRoute = false;
    var SidebarSearch = app.SidebarSearch;
    var sbSearch = new SidebarSearch();
    function setTitleSize() {
        var sb = templateOpts.sidebar.enabled;
        var nb = templateOpts.navbar.enabled;
        if (!sb && !nb) return;
        var $a = sb ? $(".sidebar-title a") : $(".navbar-title a");
        if ($a.height() > 18) {
            var css = { "font-size": "16px" };
            $a.parent().css(css);
            if (nb) {
                $(".navbar-title").css(css);
            }
        }
    }
    function getCurrentOutline() {
        return isFilterActive ? "flat" : templateOpts.sidebar.outline;
    }
    function setSidebarNodesOutline(outline) {
        outline = outline || templateOpts.sidebar.outline;
        var isTree = outline === "tree";
        var $labels = $sidebarNodes.find(".item-label");
        if (isTree) {
            $sidebarNodes.find(".item-tree-line").show();
            $labels.find(".symbol-memberof").addClass("no-width");
        } else {
            $sidebarNodes.find(".item-tree-line").hide();
            $labels.find(".symbol-memberof").removeClass("no-width");
        }
        $labels.removeClass("crop-to-fit");
        var delay = templateOpts.sidebar.animations
            ? templateOpts.sidebar.itemsOverflow === "shrink"
                ? 0
                : 240
            : 0;
        setTimeout(function () {
            $labels.each(function () {
                helper.fitSidebarNavItems($(this), outline);
            });
        }, delay);
        if (templateOpts.sidebar.itemsOverflow === "crop") {
            $labels.addClass("crop-to-fit");
            var $inners = $labels.find(".inner");
            $inners.css("text-overflow", "clip");
        }
    }
    function cleanFilter() {
        sbSearch.reset();
        if (!templateOpts.sidebar.enabled || !$sidebarNodes) return;
        setFilterBtnStates();
        if ($txtSearch) $txtSearch.val("");
        $sidebarNodes.removeClass("hidden");
        if ($btnClean) $btnClean.hide();
        $(".toolbar-buttons > span").css("color", "#fff");
        $(".chevron").show();
        setTimeout(function () {
            setSidebarNodesOutline(templateOpts.sidebar.outline);
            if ($txtSearch) $txtSearch.focus();
        }, 100);
        isFilterActive = false;
    }
    function setFilterBtnStates() {
        if (!$scopeFilterBtns || !$kindFilterBtns) return;
        $scopeFilterBtns.removeClass("active");
        sbSearch.scope.forEach(function (s) {
            $scopeFilters.find('[data-scope="' + s + '"]').addClass("active");
        });
        $kindFilterBtns.removeClass("active");
        sbSearch.kind.forEach(function (s) {
            $kindFilters.find('[data-kind="' + s + '"]').addClass("active");
        });
    }
    function applySearch(strSearch) {
        sbSearch.parse(strSearch);
        setFilterBtnStates();
        $sidebarNodes.each(function () {
            var node = $(this);
            var show = true;
            if (sbSearch.scope.length > 0) {
                show = sbSearch.hasScope(node.attr("data-scope"));
            }
            if (show && sbSearch.kind.length > 0) {
                show = sbSearch.hasKind(node.attr("data-kind"));
            }
            if (show && sbSearch.keywords.length > 0) {
                show = sbSearch.matchesAnyKeyword(node.attr("data-keywords"));
            }
            if (show) {
                node.removeClass("hidden");
            } else {
                node.addClass("hidden");
            }
        });
    }
    var debounceApplySearch = helper.debounce(applySearch, 100, false);
    function filterSidebarNodes(strSearch) {
        if (!templateOpts.sidebar.enabled) return;
        strSearch = (strSearch || "").trim().toLowerCase();
        if (!strSearch) {
            cleanFilter();
            return;
        }
        if ($btnClean) $btnClean.show();
        toggleAllSubTrees(false);
        $(".chevron").hide();
        setFoldState(false);
        isFilterActive = true;
        setSidebarNodesOutline("flat");
        debounceApplySearch(strSearch);
        $(".toolbar-buttons > span").css("color", "#3f4450");
    }
    function toggleSubTree(elem, fold) {
        fold =
            typeof fold !== "boolean" ? !elem.hasClass("members-folded") : fold;
        var parent;
        if (fold) {
            parent = elem.addClass("members-folded").parent();
            parent.find(".item-members:first").addClass("no-height");
            parent
                .find(".item-inner > img.item-tree-parent")
                .attr("src", "img/tree-folded.png");
            setFoldState(true);
        } else {
            parent = elem.removeClass("members-folded").parent();
            parent.find(".item-members:first").removeClass("no-height");
            parent
                .find(".item-inner > img.item-tree-parent")
                .attr("src", "img/tree-parent.png");
        }
    }
    function toggleAllSubTrees(fold) {
        $(".chevron").each(function () {
            toggleSubTree($(this), fold);
        });
    }
    function setFoldState(folded) {
        var $btni = $btnSwitchFold
            .find("[data-fa-i2svg]")
            .removeClass("fa-caret-square-right fa-caret-square-down");
        var newCls = !folded ? "fa-caret-square-down" : "fa-caret-square-right";
        isItemsFolded = folded;
        $btni.addClass(newCls);
    }
    function toggleHamMenu(show) {
        if (!$nbmBtn) return;
        var fn = show ? "addClass" : "removeClass";
        $nbmBtn[fn]("toggled");
        $navOverlay[fn]("toggled");
        $navbarMenu[fn]("toggled");
        helper.toggleBodyScroll(!show);
        if (show) {
            $navbarMenu.scrollTop(0);
            if ($sidebarWrapper && $sidebarWrapper.length) {
                $wrapper.removeClass("toggled");
                $sidebarToggle.removeClass("toggled");
                $sidebarToggle.css("opacity", 0);
            }
        } else {
            $sidebarToggle.css("opacity", 1);
        }
    }
    function breakNavbarMenu() {
        if (!navbarMenuActuallWidth) {
            navbarMenuActuallWidth = $navbarMenu.width() || 500;
        }
        var diff =
            $sidebarWrapper && $sidebarWrapper.length
                ? app.SIDEBAR_WIDTH
                : $navbarBrand.width();
        var breakMenu =
            ($navbarInner.width() || 0) - diff <= navbarMenuActuallWidth + 50;
        if (breakMenu) {
            if ($nbmBtn.hasClass("break")) return;
            $nbmBtn.addClass("break");
            $navbarMenu.addClass("break");
            $navbarList.addClass("break");
        } else {
            toggleHamMenu(false);
            if (!$nbmBtn.hasClass("break")) return;
            $nbmBtn.removeClass("break");
            $navbarMenu.removeClass("break");
            $navbarList.removeClass("break");
        }
    }
    function checkOpenDetails() {
        if (docma.location.hash) {
            var elem = $("details#" + $.escapeSelector(docma.location.hash));
            if (elem && elem[0]) elem.attr("open", "");
        }
    }
    hljs.configure({ tabReplace: "    ", useBR: false });
    if (!templateOpts.title) {
        templateOpts.title = docma.app.title || "Documentation";
    }
    docma.once("ready", function () {
        setTitleSize();
    });
    docma.on("render", function (currentRoute) {
        isApiRoute = currentRoute && currentRoute.type === "api";
        $("table").each(function () {
            $(this).html($.trim($(this).html()));
        });
        $("table:empty").remove();
        $wrapper = $("#wrapper");
        $sidebarWrapper = $("#sidebar-wrapper");
        $sidebarToggle = $("#sidebar-toggle");
        if (templateOpts.sidebar.animations) {
            $wrapper.addClass("trans-all-ease");
            $sidebarWrapper.addClass("trans-all-ease");
        } else {
            $wrapper.removeClass("trans-all-ease");
            $sidebarWrapper.removeClass("trans-all-ease");
        }
        if (!templateOpts.navbar.enabled) {
            $("body, html").css("padding-top", 0);
            $sidebarWrapper.css("margin-top", 0);
            $(".symbol-container").css({ "padding-top": 0, "margin-top": 0 });
        } else {
            $navbarInner = $(".navbar-inner");
            $navbarList = $(".navbar-list");
            $navbarBrand = $(".navbar-brand");
            $nbmBtn = $(".navbar-menu-btn");
            $navOverlay = $(".nav-overlay");
            $navbarMenu = $(".navbar-menu");
            if (!templateOpts.navbar.animations) {
                $navOverlay.addClass("no-trans-force");
                $navbarMenu.addClass("no-trans-force");
                $navbarList
                    .addClass("no-trans-force")
                    .find("ul")
                    .addClass("no-trans-force");
            }
            var navMargin = isApiRoute ? 55 : 0;
            $(".navbar-brand").css({ "margin-left": navMargin + "px" });
            $(".navbar-menu").css({ "margin-right": navMargin + "px" });
            $nbmBtn.on("click", function () {
                toggleHamMenu(!$navbarMenu.hasClass("toggled"));
            });
            var deBreakNavbarMenu = helper.debounce(breakNavbarMenu, 50, false);
            setTimeout(function () {
                breakNavbarMenu();
                $(window).on("resize", deBreakNavbarMenu);
            }, 300);
            $navbarList.find('a[href="#"]').on("click", function (event) {
                event.preventDefault();
            });
        }
        var examples = $("#docma-main pre > code");
        examples.each(function (i, block) {
            hljs.highlightBlock(block);
        });
        checkOpenDetails();
        if (isApiRoute === false) {
            $("table").addClass("table table-striped table-bordered");
            if (templateOpts.contentView.bookmarks) {
                var bmSelector =
                    typeof templateOpts.contentView.bookmarks === "string"
                        ? templateOpts.contentView.bookmarks
                        : ":header";
                $(bmSelector).each(function () {
                    var bmHeading = $(this);
                    var bmId = bmHeading.attr("id");
                    if (bmId) {
                        bmHeading
                            .addClass("zebra-bookmark")
                            .prepend(
                                '<a href="#' +
                                    bmId +
                                    '"><i class="fas fa-link color-gray-light" aria-hidden="true"></i></a>',
                            );
                    }
                });
            }
            return;
        }
        function searchHandler() {
            if (!$txtSearch) return;
            filterSidebarNodes($txtSearch.val());
        }
        var debounceSearchHandler = helper.debounce(searchHandler, 200);
        function getFilterClickHandler(filter) {
            var isKind = filter === "kind";
            var has = isKind ? sbSearch.hasKind : sbSearch.hasScope;
            var add = isKind ? sbSearch.addKind : sbSearch.addScope;
            var remove = isKind ? sbSearch.removeKind : sbSearch.removeScope;
            return function (event) {
                var btn = $(this);
                var value = (btn.attr("data-" + filter) || "*").toLowerCase();
                if (has.call(sbSearch, value)) {
                    remove.call(sbSearch, value);
                } else if (event.shiftKey) {
                    add.call(sbSearch, value);
                } else {
                    sbSearch[filter] = [value];
                }
                var strSearch;
                if ($txtSearch) {
                    sbSearch.parseKeywords($txtSearch.val());
                    strSearch = sbSearch.toString();
                    $txtSearch.val(strSearch).focus();
                    if ($btnClean) $btnClean.show();
                } else {
                    sbSearch.keywords = [];
                    strSearch = sbSearch.toString();
                }
                filterSidebarNodes(strSearch);
            };
        }
        if (templateOpts.sidebar.enabled) {
            var sidebarHeaderHeight;
            if (templateOpts.sidebar.search) {
                sidebarHeaderHeight = 130;
                if (templateOpts.sidebar.toolbar)
                    sidebarHeaderHeight += app.TOOLBAR_HEIGHT;
            } else {
                sidebarHeaderHeight = app.NAVBAR_HEIGHT;
                if (templateOpts.sidebar.toolbar)
                    sidebarHeaderHeight += app.TOOLBAR_HEIGHT + 10;
            }
            $(".sidebar-nav-container").css("top", sidebarHeaderHeight);
            $(".sidebar-header").css("height", sidebarHeaderHeight);
            if (templateOpts.sidebar.search) {
                $btnClean = $(".sidebar-search-clean");
                $txtSearch = $("#txt-search");
                if ($btnClean) {
                    $btnClean.hide();
                    $btnClean.on("mousedown", cleanFilter);
                }
                if ($txtSearch) {
                    $txtSearch.on("keyup", debounceSearchHandler);
                    $txtSearch.on("change", searchHandler);
                    $(".sidebar-search-icon").on("click", function () {
                        $txtSearch.focus();
                    });
                    if (templateOpts.sidebar.animations) {
                        $txtSearch.addClass("trans-all-ease");
                    }
                }
            } else {
                $(".sidebar-nav").css("top", "0px");
            }
            $sidebarNodes = $("ul.sidebar-nav .sidebar-item");
            if (templateOpts.sidebar.animations) {
                $sidebarNodes.addClass("trans-height-ease");
            }
            setSidebarNodesOutline();
            $btnSwitchOutline = $(".toolbar-buttons .btn-switch-outline");
            $btnSwitchFold = $(".toolbar-buttons .btn-switch-fold");
            toggleAllSubTrees(isItemsFolded);
            if (!templateOpts.sidebar.collapsed) {
                $wrapper.addClass("toggled");
                $sidebarToggle.addClass("toggled");
            }
            $sidebarToggle.on("click", function (event) {
                event.preventDefault();
                $wrapper.toggleClass("toggled");
                $sidebarToggle.toggleClass("toggled");
            });
            $(".chevron").on("click", function () {
                toggleSubTree($(this));
            });
            if (templateOpts.sidebar.toolbar) {
                var kindButtons =
                    helper.getSymbolInfo("namespace", null, true).badge +
                    helper.getSymbolInfo("module", null, true).badge +
                    helper.getSymbolInfo("typedef", null, true).badge +
                    helper.getSymbolInfo("class", null, true).badge +
                    helper.getSymbolInfo("method", null, true).badge +
                    helper.getSymbolInfo("property", null, true).badge +
                    helper.getSymbolInfo("enum", null, true).badge +
                    helper.getSymbolInfo("event", null, true).badge;
                $kindFilters = $(".toolbar-kind-filters").html(kindButtons);
                $kindFilterBtns = $kindFilters
                    .find(".badge-btn")
                    .on("click", getFilterClickHandler("kind"));
                var scopeButtons =
                    helper.getScopeInfo("global").badge +
                    helper.getScopeInfo("static").badge +
                    helper.getScopeInfo("instance").badge +
                    helper.getScopeInfo("inner").badge;
                $scopeFilters = $(".toolbar-scope-filters").html(scopeButtons);
                $scopeFilterBtns = $scopeFilters
                    .find(".badge-scope-btn")
                    .on("click", getFilterClickHandler("scope"));
                $btnSwitchFold.on("click", function () {
                    if (isFilterActive) return;
                    setFoldState(!isItemsFolded);
                    toggleAllSubTrees(isItemsFolded);
                });
                $btnSwitchOutline.on("click", function () {
                    if (isFilterActive) return;
                    var $btn = $(this);
                    var $btni = $btn
                        .find("[data-fa-i2svg]")
                        .removeClass("fa-outdent fa-indent");
                    var newOutline, newCls;
                    if (templateOpts.sidebar.outline === "flat") {
                        newOutline = "tree";
                        newCls = "fa-indent";
                    } else {
                        newOutline = "flat";
                        newCls = "fa-outdent";
                    }
                    templateOpts.sidebar.outline = newOutline;
                    $btni.addClass(newCls);
                    setSidebarNodesOutline(newOutline);
                });
            }
            if (templateOpts.sidebar.itemsOverflow === "crop") {
                $sidebarNodes.hover(
                    function () {
                        setInnerMarginLeft($(this));
                    },
                    function () {
                        setInnerMarginLeft($(this), true);
                    },
                );
            }
        } else {
            $wrapper.removeClass("toggled");
            $sidebarToggle.removeClass("toggled");
        }
        tippy("[title]", {
            placement: "bottom",
            animation: "scale",
            duration: 200,
            arrow: true,
            appendTo: document.body,
            zIndex: 9999999,
            theme: "zebra",
        });
    });
    function setInnerMarginLeft($elem, reset) {
        var $inner = $elem.find(".crop-to-fit > .inner");
        var dMarginLeft = "data-margin-" + getCurrentOutline();
        var m = parseInt($inner.attr(dMarginLeft), 0) || 0;
        $inner.css("margin-left", reset ? 0 : m);
    }
})();
