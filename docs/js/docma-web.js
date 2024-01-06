/*! dustjs-linkedin - v2.7.5
 * https://dustjs.com/
 * Copyright (c) 2016 Aleksander Williams; Released under the MIT License */
!(function (a, b) {
    "function" == typeof define && define.amd && define.amd.dust === !0
        ? define("dust.core", [], b)
        : "object" == typeof exports
        ? (module.exports = b())
        : (a.dust = b());
})(this, function () {
    function getTemplate(a, b) {
        return a
            ? "function" == typeof a && a.template
                ? a.template
                : dust.isTemplateFn(a)
                ? a
                : b !== !1
                ? dust.cache[a]
                : void 0
            : void 0;
    }
    function load(a, b, c) {
        if (!a)
            return b.setError(
                new Error("No template or template name provided to render"),
            );
        var d = getTemplate(a, dust.config.cache);
        return d
            ? d(b, Context.wrap(c, d.templateName))
            : dust.onLoad
            ? b.map(function (b) {
                  function d(a, d) {
                      var f;
                      if (a) return b.setError(a);
                      if (
                          ((f =
                              getTemplate(d, !1) ||
                              getTemplate(e, dust.config.cache)),
                          !f)
                      ) {
                          if (!dust.compile)
                              return b.setError(
                                  new Error("Dust compiler not available"),
                              );
                          f = dust.loadSource(dust.compile(d, e));
                      }
                      f(b, Context.wrap(c, f.templateName)).end();
                  }
                  var e = a;
                  3 === dust.onLoad.length
                      ? dust.onLoad(e, c.options, d)
                      : dust.onLoad(e, d);
              })
            : b.setError(new Error("Template Not Found: " + a));
    }
    function Context(a, b, c, d, e) {
        void 0 === a || a instanceof Stack || (a = new Stack(a)),
            (this.stack = a),
            (this.global = b),
            (this.options = c),
            (this.blocks = d),
            (this.templateName = e),
            (this._isContext = !0);
    }
    function getWithResolvedData(a, b, c) {
        return function (d) {
            return a.push(d)._get(b, c);
        };
    }
    function Stack(a, b, c, d) {
        (this.tail = b),
            (this.isObject = a && "object" == typeof a),
            (this.head = a),
            (this.index = c),
            (this.of = d);
    }
    function Stub(a) {
        (this.head = new Chunk(this)), (this.callback = a), (this.out = "");
    }
    function Stream() {
        this.head = new Chunk(this);
    }
    function Chunk(a, b, c) {
        (this.root = a),
            (this.next = b),
            (this.data = []),
            (this.flushable = !1),
            (this.taps = c);
    }
    function Tap(a, b) {
        (this.head = a), (this.tail = b);
    }
    var dust = { version: "2.7.5" },
        NONE = "NONE",
        ERROR = "ERROR",
        WARN = "WARN",
        INFO = "INFO",
        DEBUG = "DEBUG",
        EMPTY_FUNC = function () {};
    (dust.config = { whitespace: !1, amd: !1, cjs: !1, cache: !0 }),
        (dust._aliases = {
            write: "w",
            end: "e",
            map: "m",
            render: "r",
            reference: "f",
            section: "s",
            exists: "x",
            notexists: "nx",
            block: "b",
            partial: "p",
            helper: "h",
        }),
        (function () {
            var a,
                b,
                c = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, NONE: 4 };
            "undefined" != typeof console && console.log
                ? ((a = console.log),
                  (b =
                      "function" == typeof a
                          ? function () {
                                a.apply(console, arguments);
                            }
                          : function () {
                                a(
                                    Array.prototype.slice
                                        .apply(arguments)
                                        .join(" "),
                                );
                            }))
                : (b = EMPTY_FUNC),
                (dust.log = function (a, d) {
                    (d = d || INFO),
                        c[d] >= c[dust.debugLevel] && b("[DUST:" + d + "]", a);
                }),
                (dust.debugLevel = NONE),
                "undefined" != typeof process &&
                    process.env &&
                    /\bdust\b/.test(process.env.DEBUG) &&
                    (dust.debugLevel = DEBUG);
        })(),
        (dust.helpers = {}),
        (dust.cache = {}),
        (dust.register = function (a, b) {
            a &&
                ((b.templateName = a),
                dust.config.cache !== !1 && (dust.cache[a] = b));
        }),
        (dust.render = function (a, b, c) {
            var d = new Stub(c).head;
            try {
                load(a, d, b).end();
            } catch (e) {
                d.setError(e);
            }
        }),
        (dust.stream = function (a, b) {
            var c = new Stream(),
                d = c.head;
            return (
                dust.nextTick(function () {
                    try {
                        load(a, d, b).end();
                    } catch (c) {
                        d.setError(c);
                    }
                }),
                c
            );
        }),
        (dust.loadSource = function (source) {
            return eval(source);
        }),
        (dust.isArray = Array.isArray
            ? Array.isArray
            : function (a) {
                  return "[object Array]" === Object.prototype.toString.call(a);
              }),
        (dust.nextTick = (function () {
            return function (a) {
                setTimeout(a, 0);
            };
        })()),
        (dust.isEmpty = function (a) {
            return 0 === a ? !1 : dust.isArray(a) && !a.length ? !0 : !a;
        }),
        (dust.isEmptyObject = function (a) {
            var b;
            if (null === a) return !1;
            if (void 0 === a) return !1;
            if (a.length > 0) return !1;
            for (b in a)
                if (Object.prototype.hasOwnProperty.call(a, b)) return !1;
            return !0;
        }),
        (dust.isTemplateFn = function (a) {
            return "function" == typeof a && a.__dustBody;
        }),
        (dust.isThenable = function (a) {
            return a && "object" == typeof a && "function" == typeof a.then;
        }),
        (dust.isStreamable = function (a) {
            return (
                a && "function" == typeof a.on && "function" == typeof a.pipe
            );
        }),
        (dust.filter = function (a, b, c, d) {
            var e, f, g, h;
            if (c)
                for (e = 0, f = c.length; f > e; e++)
                    (g = c[e]),
                        g.length &&
                            ((h = dust.filters[g]),
                            "s" === g
                                ? (b = null)
                                : "function" == typeof h
                                ? (a = h(a, d))
                                : dust.log("Invalid filter `" + g + "`", WARN));
            return b && (a = dust.filters[b](a, d)), a;
        }),
        (dust.filters = {
            h: function (a) {
                return dust.escapeHtml(a);
            },
            j: function (a) {
                return dust.escapeJs(a);
            },
            u: encodeURI,
            uc: encodeURIComponent,
            js: function (a) {
                return dust.escapeJSON(a);
            },
            jp: function (a) {
                return JSON
                    ? JSON.parse(a)
                    : (dust.log(
                          "JSON is undefined; could not parse `" + a + "`",
                          WARN,
                      ),
                      a);
            },
        }),
        (dust.makeBase = dust.context =
            function (a, b) {
                return new Context(void 0, a, b);
            }),
        (dust.isContext = function (a) {
            return "object" == typeof a && a._isContext === !0;
        }),
        (Context.wrap = function (a, b) {
            return dust.isContext(a) ? a : new Context(a, {}, {}, null, b);
        }),
        (Context.prototype.get = function (a, b) {
            return (
                "string" == typeof a &&
                    ("." === a[0] && ((b = !0), (a = a.substr(1))),
                    (a = a.split("."))),
                this._get(b, a)
            );
        }),
        (Context.prototype._get = function (a, b) {
            var c,
                d,
                e,
                f,
                g,
                h = this.stack || {},
                i = 1;
            if (((d = b[0]), (e = b.length), a && 0 === e))
                (f = h), (h = h.head);
            else {
                if (a) h && (h = h.head ? h.head[d] : void 0);
                else {
                    for (
                        ;
                        h &&
                        (!h.isObject ||
                            ((f = h.head), (c = h.head[d]), void 0 === c));

                    )
                        h = h.tail;
                    h = void 0 !== c ? c : this.global && this.global[d];
                }
                for (; h && e > i; ) {
                    if (dust.isThenable(h))
                        return h.then(getWithResolvedData(this, a, b.slice(i)));
                    (f = h), (h = h[b[i]]), i++;
                }
            }
            return "function" == typeof h
                ? ((g = function () {
                      try {
                          return h.apply(f, arguments);
                      } catch (a) {
                          throw (dust.log(a, ERROR), a);
                      }
                  }),
                  (g.__dustBody = !!h.__dustBody),
                  g)
                : (void 0 === h &&
                      dust.log(
                          "Cannot find reference `{" +
                              b.join(".") +
                              "}` in template `" +
                              this.getTemplateName() +
                              "`",
                          INFO,
                      ),
                  h);
        }),
        (Context.prototype.getPath = function (a, b) {
            return this._get(a, b);
        }),
        (Context.prototype.push = function (a, b, c) {
            return void 0 === a
                ? (dust.log(
                      "Not pushing an undefined variable onto the context",
                      INFO,
                  ),
                  this)
                : this.rebase(new Stack(a, this.stack, b, c));
        }),
        (Context.prototype.pop = function () {
            var a = this.current();
            return (this.stack = this.stack && this.stack.tail), a;
        }),
        (Context.prototype.rebase = function (a) {
            return new Context(
                a,
                this.global,
                this.options,
                this.blocks,
                this.getTemplateName(),
            );
        }),
        (Context.prototype.clone = function () {
            var a = this.rebase();
            return (a.stack = this.stack), a;
        }),
        (Context.prototype.current = function () {
            return this.stack && this.stack.head;
        }),
        (Context.prototype.getBlock = function (a) {
            var b, c, d;
            if (
                ("function" == typeof a &&
                    (a = a(new Chunk(), this).data.join("")),
                (b = this.blocks),
                !b)
            )
                return (
                    dust.log(
                        "No blocks for context `" +
                            a +
                            "` in template `" +
                            this.getTemplateName() +
                            "`",
                        DEBUG,
                    ),
                    !1
                );
            for (c = b.length; c--; ) if ((d = b[c][a])) return d;
            return (
                dust.log(
                    "Malformed template `" +
                        this.getTemplateName() +
                        "` was missing one or more blocks.",
                ),
                !1
            );
        }),
        (Context.prototype.shiftBlocks = function (a) {
            var b,
                c = this.blocks;
            return a
                ? ((b = c ? c.concat([a]) : [a]),
                  new Context(
                      this.stack,
                      this.global,
                      this.options,
                      b,
                      this.getTemplateName(),
                  ))
                : this;
        }),
        (Context.prototype.resolve = function (a) {
            var b;
            return "function" != typeof a
                ? a
                : ((b = new Chunk().render(a, this)),
                  b instanceof Chunk ? b.data.join("") : b);
        }),
        (Context.prototype.getTemplateName = function () {
            return this.templateName;
        }),
        (Stub.prototype.flush = function () {
            for (var a = this.head; a; ) {
                if (!a.flushable)
                    return a.error
                        ? (this.callback(a.error),
                          dust.log(
                              "Rendering failed with error `" + a.error + "`",
                              ERROR,
                          ),
                          void (this.flush = EMPTY_FUNC))
                        : void 0;
                (this.out += a.data.join("")), (a = a.next), (this.head = a);
            }
            this.callback(null, this.out);
        }),
        (Stream.prototype.flush = function () {
            for (var a = this.head; a; ) {
                if (!a.flushable)
                    return a.error
                        ? (this.emit("error", a.error),
                          this.emit("end"),
                          dust.log(
                              "Streaming failed with error `" + a.error + "`",
                              ERROR,
                          ),
                          void (this.flush = EMPTY_FUNC))
                        : void 0;
                this.emit("data", a.data.join("")),
                    (a = a.next),
                    (this.head = a);
            }
            this.emit("end");
        }),
        (Stream.prototype.emit = function (a, b) {
            var c,
                d,
                e = this.events || {},
                f = e[a] || [];
            if (!f.length)
                return (
                    dust.log(
                        "Stream broadcasting, but no listeners for `" + a + "`",
                        DEBUG,
                    ),
                    !1
                );
            for (f = f.slice(0), c = 0, d = f.length; d > c; c++) f[c](b);
            return !0;
        }),
        (Stream.prototype.on = function (a, b) {
            var c = (this.events = this.events || {}),
                d = (c[a] = c[a] || []);
            return (
                "function" != typeof b
                    ? dust.log(
                          "No callback function provided for `" +
                              a +
                              "` event listener",
                          WARN,
                      )
                    : d.push(b),
                this
            );
        }),
        (Stream.prototype.pipe = function (a) {
            if ("function" != typeof a.write || "function" != typeof a.end)
                return (
                    dust.log("Incompatible stream passed to `pipe`", WARN), this
                );
            var b = !1;
            return (
                "function" == typeof a.emit && a.emit("pipe", this),
                "function" == typeof a.on &&
                    a.on("error", function () {
                        b = !0;
                    }),
                this.on("data", function (c) {
                    if (!b)
                        try {
                            a.write(c, "utf8");
                        } catch (d) {
                            dust.log(d, ERROR);
                        }
                }).on("end", function () {
                    if (!b)
                        try {
                            a.end(), (b = !0);
                        } catch (c) {
                            dust.log(c, ERROR);
                        }
                })
            );
        }),
        (Chunk.prototype.write = function (a) {
            var b = this.taps;
            return b && (a = b.go(a)), this.data.push(a), this;
        }),
        (Chunk.prototype.end = function (a) {
            return (
                a && this.write(a),
                (this.flushable = !0),
                this.root.flush(),
                this
            );
        }),
        (Chunk.prototype.map = function (a) {
            var b = new Chunk(this.root, this.next, this.taps),
                c = new Chunk(this.root, b, this.taps);
            (this.next = c), (this.flushable = !0);
            try {
                a(c);
            } catch (d) {
                dust.log(d, ERROR), c.setError(d);
            }
            return b;
        }),
        (Chunk.prototype.tap = function (a) {
            var b = this.taps;
            return (this.taps = b ? b.push(a) : new Tap(a)), this;
        }),
        (Chunk.prototype.untap = function () {
            return (this.taps = this.taps.tail), this;
        }),
        (Chunk.prototype.render = function (a, b) {
            return a(this, b);
        }),
        (Chunk.prototype.reference = function (a, b, c, d) {
            return "function" == typeof a
                ? ((a = a.apply(b.current(), [
                      this,
                      b,
                      null,
                      { auto: c, filters: d },
                  ])),
                  a instanceof Chunk ? a : this.reference(a, b, c, d))
                : dust.isThenable(a)
                ? this.await(a, b, null, c, d)
                : dust.isStreamable(a)
                ? this.stream(a, b, null, c, d)
                : dust.isEmpty(a)
                ? this
                : this.write(dust.filter(a, c, d, b));
        }),
        (Chunk.prototype.section = function (a, b, c, d) {
            var e,
                f,
                g,
                h = c.block,
                i = c["else"],
                j = this;
            if ("function" == typeof a && !dust.isTemplateFn(a)) {
                try {
                    a = a.apply(b.current(), [this, b, c, d]);
                } catch (k) {
                    return dust.log(k, ERROR), this.setError(k);
                }
                if (a instanceof Chunk) return a;
            }
            if (dust.isEmptyObject(c)) return j;
            if ((dust.isEmptyObject(d) || (b = b.push(d)), dust.isArray(a))) {
                if (h) {
                    if (((f = a.length), f > 0)) {
                        for (
                            g = (b.stack && b.stack.head) || {},
                                g.$len = f,
                                e = 0;
                            f > e;
                            e++
                        )
                            (g.$idx = e), (j = h(j, b.push(a[e], e, f)));
                        return (g.$idx = void 0), (g.$len = void 0), j;
                    }
                    if (i) return i(this, b);
                }
            } else {
                if (dust.isThenable(a)) return this.await(a, b, c);
                if (dust.isStreamable(a)) return this.stream(a, b, c);
                if (a === !0) {
                    if (h) return h(this, b);
                } else if (a || 0 === a) {
                    if (h) return h(this, b.push(a));
                } else if (i) return i(this, b);
            }
            return (
                dust.log(
                    "Section without corresponding key in template `" +
                        b.getTemplateName() +
                        "`",
                    DEBUG,
                ),
                this
            );
        }),
        (Chunk.prototype.exists = function (a, b, c) {
            var d = c.block,
                e = c["else"];
            if (dust.isEmpty(a)) {
                if (e) return e(this, b);
            } else {
                if (d) return d(this, b);
                dust.log(
                    "No block for exists check in template `" +
                        b.getTemplateName() +
                        "`",
                    DEBUG,
                );
            }
            return this;
        }),
        (Chunk.prototype.notexists = function (a, b, c) {
            var d = c.block,
                e = c["else"];
            if (dust.isEmpty(a)) {
                if (d) return d(this, b);
                dust.log(
                    "No block for not-exists check in template `" +
                        b.getTemplateName() +
                        "`",
                    DEBUG,
                );
            } else if (e) return e(this, b);
            return this;
        }),
        (Chunk.prototype.block = function (a, b, c) {
            var d = a || c.block;
            return d ? d(this, b) : this;
        }),
        (Chunk.prototype.partial = function (a, b, c, d) {
            var e;
            return (
                void 0 === d && ((d = c), (c = b)),
                dust.isEmptyObject(d) ||
                    ((c = c.clone()), (e = c.pop()), (c = c.push(d).push(e))),
                dust.isTemplateFn(a)
                    ? this.capture(a, b, function (a, b) {
                          (c.templateName = a), load(a, b, c).end();
                      })
                    : ((c.templateName = a), load(a, this, c))
            );
        }),
        (Chunk.prototype.helper = function (a, b, c, d, e) {
            var f,
                g = this,
                h = d.filters;
            if ((void 0 === e && (e = "h"), !dust.helpers[a]))
                return dust.log("Helper `" + a + "` does not exist", WARN), g;
            try {
                return (
                    (f = dust.helpers[a](g, b, c, d)),
                    f instanceof Chunk
                        ? f
                        : ("string" == typeof h && (h = h.split("|")),
                          dust.isEmptyObject(c)
                              ? g.reference(f, b, e, h)
                              : g.section(f, b, c, d))
                );
            } catch (i) {
                return (
                    dust.log(
                        "Error in helper `" + a + "`: " + i.message,
                        ERROR,
                    ),
                    g.setError(i)
                );
            }
        }),
        (Chunk.prototype.await = function (a, b, c, d, e) {
            return this.map(function (f) {
                a.then(
                    function (a) {
                        (f = c ? f.section(a, b, c) : f.reference(a, b, d, e)),
                            f.end();
                    },
                    function (a) {
                        var d = c && c.error;
                        d
                            ? f.render(d, b.push(a)).end()
                            : (dust.log(
                                  "Unhandled promise rejection in `" +
                                      b.getTemplateName() +
                                      "`",
                                  INFO,
                              ),
                              f.end());
                    },
                );
            });
        }),
        (Chunk.prototype.stream = function (a, b, c, d, e) {
            var f = c && c.block,
                g = c && c.error;
            return this.map(function (h) {
                var i = !1;
                a.on("data", function (a) {
                    i ||
                        (f
                            ? (h = h.map(function (c) {
                                  c.render(f, b.push(a)).end();
                              }))
                            : c || (h = h.reference(a, b, d, e)));
                })
                    .on("error", function (a) {
                        i ||
                            (g
                                ? h.render(g, b.push(a))
                                : dust.log(
                                      "Unhandled stream error in `" +
                                          b.getTemplateName() +
                                          "`",
                                      INFO,
                                  ),
                            i || ((i = !0), h.end()));
                    })
                    .on("end", function () {
                        i || ((i = !0), h.end());
                    });
            });
        }),
        (Chunk.prototype.capture = function (a, b, c) {
            return this.map(function (d) {
                var e = new Stub(function (a, b) {
                    a ? d.setError(a) : c(b, d);
                });
                a(e.head, b).end();
            });
        }),
        (Chunk.prototype.setError = function (a) {
            return (this.error = a), this.root.flush(), this;
        });
    for (var f in Chunk.prototype)
        dust._aliases[f] &&
            (Chunk.prototype[dust._aliases[f]] = Chunk.prototype[f]);
    (Tap.prototype.push = function (a) {
        return new Tap(a, this);
    }),
        (Tap.prototype.go = function (a) {
            for (var b = this; b; ) (a = b.head(a)), (b = b.tail);
            return a;
        });
    var HCHARS = /[&<>"']/,
        AMP = /&/g,
        LT = /</g,
        GT = />/g,
        QUOT = /\"/g,
        SQUOT = /\'/g;
    dust.escapeHtml = function (a) {
        return "string" == typeof a || (a && "function" == typeof a.toString)
            ? ("string" != typeof a && (a = a.toString()),
              HCHARS.test(a)
                  ? a
                        .replace(AMP, "&amp;")
                        .replace(LT, "&lt;")
                        .replace(GT, "&gt;")
                        .replace(QUOT, "&quot;")
                        .replace(SQUOT, "&#39;")
                  : a)
            : a;
    };
    var BS = /\\/g,
        FS = /\//g,
        CR = /\r/g,
        LS = /\u2028/g,
        PS = /\u2029/g,
        NL = /\n/g,
        LF = /\f/g,
        SQ = /'/g,
        DQ = /"/g,
        TB = /\t/g;
    return (
        (dust.escapeJs = function (a) {
            return "string" == typeof a
                ? a
                      .replace(BS, "\\\\")
                      .replace(FS, "\\/")
                      .replace(DQ, '\\"')
                      .replace(SQ, "\\'")
                      .replace(CR, "\\r")
                      .replace(LS, "\\u2028")
                      .replace(PS, "\\u2029")
                      .replace(NL, "\\n")
                      .replace(LF, "\\f")
                      .replace(TB, "\\t")
                : a;
        }),
        (dust.escapeJSON = function (a) {
            return JSON
                ? JSON.stringify(a)
                      .replace(LS, "\\u2028")
                      .replace(PS, "\\u2029")
                      .replace(LT, "\\u003c")
                : (dust.log(
                      "JSON is undefined; could not escape `" + a + "`",
                      WARN,
                  ),
                  a);
        }),
        dust
    );
}),
    "function" == typeof define &&
        define.amd &&
        define.amd.dust === !0 &&
        define(["require", "dust.core"], function (require, dust) {
            return (
                (dust.onLoad = function (a, b) {
                    require([a], function () {
                        b();
                    });
                }),
                dust
            );
        });

/*! dustjs-helpers - v1.7.4
 * https://dustjs.com/
 * Copyright (c) 2017 Aleksander Williams; Released under the MIT License */
!(function (a, b) {
    "function" == typeof define && define.amd && define.amd.dust === !0
        ? define(["dust.core"], b)
        : "object" == typeof exports
        ? ((module.exports = b(require("dustjs-linkedin"))),
          (module.exports.registerWith = b))
        : b(a.dust);
})(this, function (dust) {
    function a(a, b, c) {
        (c = c || "INFO"), (a = a ? "{@" + a + "}: " : ""), dust.log(a + b, c);
    }
    function b(b) {
        k[b] ||
            (a(
                b,
                "Deprecation warning: " +
                    b +
                    " is deprecated and will be removed in a future version of dustjs-helpers",
                "WARN",
            ),
            a(
                null,
                "For help and a deprecation timeline, see https://github.com/linkedin/dustjs-helpers/wiki/Deprecated-Features#" +
                    b.replace(/\W+/g, ""),
                "WARN",
            ),
            (k[b] = !0));
    }
    function c(a) {
        return (
            a.stack.tail &&
            a.stack.tail.head &&
            "undefined" != typeof a.stack.tail.head.__select__
        );
    }
    function d(a) {
        return c(a) && a.get("__select__");
    }
    function e(a, b) {
        var c,
            d = a.stack.head,
            e = a.rebase();
        a.stack && a.stack.tail && (e.stack = a.stack.tail);
        var f = {
            isPending: !1,
            isResolved: !1,
            isDeferredComplete: !1,
            deferreds: [],
        };
        for (c in b) f[c] = b[c];
        return e.push({ __select__: f }).push(d, a.stack.index, a.stack.of);
    }
    function f(a) {
        var b, c;
        if (((a.isDeferredPending = !0), a.deferreds.length))
            for (
                a.isDeferredComplete = !0, b = 0, c = a.deferreds.length;
                c > b;
                b++
            )
                a.deferreds[b]();
        a.isDeferredPending = !1;
    }
    function g(a, b) {
        return "function" == typeof b
            ? b
                  .toString()
                  .replace(/(^\s+|\s+$)/gm, "")
                  .replace(/\n/gm, "")
                  .replace(/,\s*/gm, ", ")
                  .replace(/\)\{/gm, ") {")
            : b;
    }
    function h(a, b) {
        return function (c, d, e, f) {
            return i(c, d, e, f, a, b);
        };
    }
    function i(b, c, e, f, g, h) {
        var i,
            k,
            l,
            m,
            n = e.block,
            o = e["else"],
            p = d(c) || {};
        if (p.isResolved && !p.isDeferredPending) return b;
        if (f.hasOwnProperty("key")) k = f.key;
        else {
            if (!p.hasOwnProperty("key"))
                return a(g, "No key specified", "WARN"), b;
            k = p.key;
        }
        return (
            (m = f.type || p.type),
            (k = j(c.resolve(k), m)),
            (l = j(c.resolve(f.value), m)),
            h(k, l)
                ? (p.isPending || ((i = !0), (p.isPending = !0)),
                  n && (b = b.render(n, c)),
                  i && (p.isResolved = !0))
                : o && (b = b.render(o, c)),
            b
        );
    }
    function j(a, b) {
        switch ((b && (b = b.toLowerCase()), b)) {
            case "number":
                return +a;
            case "string":
                return String(a);
            case "boolean":
                return (a = "false" === a ? !1 : a), Boolean(a);
            case "date":
                return new Date(a);
        }
        return a;
    }
    var k = {},
        l = {
            tap: function (a, c, d) {
                return b("tap"), d.resolve(a);
            },
            sep: function (a, b, c) {
                var d = c.block;
                return b.stack.index === b.stack.of - 1 ? a : d ? d(a, b) : a;
            },
            first: function (a, b, c) {
                return 0 === b.stack.index ? c.block(a, b) : a;
            },
            last: function (a, b, c) {
                return b.stack.index === b.stack.of - 1 ? c.block(a, b) : a;
            },
            contextDump: function (b, c, d, e) {
                var f,
                    h,
                    i = c.resolve(e.to),
                    j = c.resolve(e.key);
                switch (j) {
                    case "full":
                        f = c.stack;
                        break;
                    default:
                        f = c.stack.head;
                }
                switch (((h = JSON.stringify(f, g, 2)), i)) {
                    case "console":
                        a("contextDump", h);
                        break;
                    default:
                        (h = h.replace(/</g, "\\u003c")), (b = b.write(h));
                }
                return b;
            },
            math: function (b, c, g, h) {
                var i,
                    j = h.key,
                    k = h.method,
                    l = h.operand,
                    m = h.round;
                if (!h.hasOwnProperty("key") || !h.method)
                    return (
                        a(
                            "math",
                            "`key` or `method` was not provided",
                            "ERROR",
                        ),
                        b
                    );
                switch (
                    ((j = parseFloat(c.resolve(j))),
                    (l = parseFloat(c.resolve(l))),
                    k)
                ) {
                    case "mod":
                        0 === l && a("math", "Division by 0", "ERROR"),
                            (i = j % l);
                        break;
                    case "add":
                        i = j + l;
                        break;
                    case "subtract":
                        i = j - l;
                        break;
                    case "multiply":
                        i = j * l;
                        break;
                    case "divide":
                        0 === l && a("math", "Division by 0", "ERROR"),
                            (i = j / l);
                        break;
                    case "ceil":
                    case "floor":
                    case "round":
                    case "abs":
                        i = Math[k](j);
                        break;
                    case "toint":
                        i = parseInt(j, 10);
                        break;
                    default:
                        a(
                            "math",
                            "Method `" + k + "` is not supported",
                            "ERROR",
                        );
                }
                return (
                    "undefined" != typeof i &&
                        (m && (i = Math.round(i)),
                        g && g.block
                            ? ((c = e(c, { key: i })),
                              (b = b.render(g.block, c)),
                              f(d(c)))
                            : (b = b.write(i))),
                    b
                );
            },
            select: function (b, c, g, h) {
                var i = g.block,
                    j = {};
                return (
                    h.hasOwnProperty("key") && (j.key = c.resolve(h.key)),
                    h.hasOwnProperty("type") && (j.type = h.type),
                    i
                        ? ((c = e(c, j)), (b = b.render(i, c)), f(d(c)))
                        : a("select", "Missing body block", "WARN"),
                    b
                );
            },
            eq: h("eq", function (a, b) {
                return a === b;
            }),
            ne: h("ne", function (a, b) {
                return a !== b;
            }),
            lt: h("lt", function (a, b) {
                return b > a;
            }),
            lte: h("lte", function (a, b) {
                return b >= a;
            }),
            gt: h("gt", function (a, b) {
                return a > b;
            }),
            gte: h("gte", function (a, b) {
                return a >= b;
            }),
            any: function (b, c, e) {
                var f = d(c);
                return (
                    f
                        ? f.isDeferredComplete
                            ? a(
                                  "any",
                                  "Must not be nested inside {@any} or {@none} block",
                                  "ERROR",
                              )
                            : (b = b.map(function (a) {
                                  f.deferreds.push(function () {
                                      f.isResolved &&
                                          (a = a.render(e.block, c)),
                                          a.end();
                                  });
                              }))
                        : a(
                              "any",
                              "Must be used inside a {@select} block",
                              "ERROR",
                          ),
                    b
                );
            },
            none: function (b, c, e) {
                var f = d(c);
                return (
                    f
                        ? f.isDeferredComplete
                            ? a(
                                  "none",
                                  "Must not be nested inside {@any} or {@none} block",
                                  "ERROR",
                              )
                            : (b = b.map(function (a) {
                                  f.deferreds.push(function () {
                                      f.isResolved ||
                                          (a = a.render(e.block, c)),
                                          a.end();
                                  });
                              }))
                        : a(
                              "none",
                              "Must be used inside a {@select} block",
                              "ERROR",
                          ),
                    b
                );
            },
            size: function (a, b, c, d) {
                var e,
                    f,
                    g = d.key;
                if (((g = b.resolve(d.key)), g && g !== !0))
                    if (dust.isArray(g)) e = g.length;
                    else if (!isNaN(parseFloat(g)) && isFinite(g)) e = g;
                    else if ("object" == typeof g) {
                        e = 0;
                        for (f in g) g.hasOwnProperty(f) && e++;
                    } else e = (g + "").length;
                else e = 0;
                return a.write(e);
            },
        };
    for (var m in l) dust.helpers[m] = l[m];
    return dust;
});

!(function (t, e) {
    "object" == typeof exports && "undefined" != typeof module
        ? (module.exports = e())
        : "function" == typeof define && define.amd
        ? define(e)
        : (t.page = e());
})(this, function () {
    "use strict";
    function t(t) {
        return r(m(t));
    }
    var g =
            Array.isArray ||
            function (t) {
                return "[object Array]" == Object.prototype.toString.call(t);
            },
        i = _,
        e = m,
        n = r,
        o = y,
        d = new RegExp(
            [
                "(\\\\.)",
                "([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))",
            ].join("|"),
            "g",
        );
    function m(t) {
        for (var e = [], n = 0, i = 0, o = ""; null != (a = d.exec(t)); ) {
            var r,
                s,
                a,
                h = a[0],
                c = a[1],
                p = a.index;
            (o += t.slice(i, p)),
                (i = p + h.length),
                c
                    ? (o += c[1])
                    : (o && (e.push(o), (o = "")),
                      (p = a[2]),
                      (h = a[3]),
                      (c = a[4]),
                      (r = a[5]),
                      (s = a[6]),
                      (a = a[7]),
                      e.push({
                          name: h || n++,
                          prefix: p || "",
                          delimiter: (h = p || "/"),
                          optional: "?" === s || "*" === s,
                          repeat: "+" === s || "*" === s,
                          pattern: (
                              c ||
                              r ||
                              (a ? ".*" : "[^" + h + "]+?")
                          ).replace(/([=!:$\/()])/g, "\\$1"),
                      }));
        }
        return i < t.length && (o += t.substr(i)), o && e.push(o), e;
    }
    function r(h) {
        for (var c = new Array(h.length), t = 0; t < h.length; t++)
            "object" == typeof h[t] &&
                (c[t] = new RegExp("^" + h[t].pattern + "$"));
        return function (t) {
            for (var e = "", n = t || {}, i = 0; i < h.length; i++) {
                var o = h[i];
                if ("string" == typeof o) e += o;
                else {
                    var r,
                        s = n[o.name];
                    if (null == s) {
                        if (o.optional) continue;
                        throw new TypeError(
                            'Expected "' + o.name + '" to be defined',
                        );
                    }
                    if (g(s)) {
                        if (!o.repeat)
                            throw new TypeError(
                                'Expected "' +
                                    o.name +
                                    '" to not repeat, but received "' +
                                    s +
                                    '"',
                            );
                        if (0 === s.length) {
                            if (o.optional) continue;
                            throw new TypeError(
                                'Expected "' + o.name + '" to not be empty',
                            );
                        }
                        for (var a = 0; a < s.length; a++) {
                            if (((r = encodeURIComponent(s[a])), !c[i].test(r)))
                                throw new TypeError(
                                    'Expected all "' +
                                        o.name +
                                        '" to match "' +
                                        o.pattern +
                                        '", but received "' +
                                        r +
                                        '"',
                                );
                            e += (0 === a ? o.prefix : o.delimiter) + r;
                        }
                    } else {
                        if (((r = encodeURIComponent(s)), !c[i].test(r)))
                            throw new TypeError(
                                'Expected "' +
                                    o.name +
                                    '" to match "' +
                                    o.pattern +
                                    '", but received "' +
                                    r +
                                    '"',
                            );
                        e += o.prefix + r;
                    }
                }
            }
            return e;
        };
    }
    function p(t) {
        return t.replace(/([.+*?=^!:${}()[\]|\/])/g, "\\$1");
    }
    function w(t, e) {
        return (t.keys = e), t;
    }
    function v(t) {
        return t.sensitive ? "" : "i";
    }
    function y(t, e) {
        for (
            var n = (e = e || {}).strict,
                i = !1 !== e.end,
                o = "",
                r = t[t.length - 1],
                r = "string" == typeof r && /\/$/.test(r),
                s = 0;
            s < t.length;
            s++
        ) {
            var a,
                h,
                c = t[s];
            "string" == typeof c
                ? (o += p(c))
                : ((a = p(c.prefix)),
                  (h = c.pattern),
                  c.repeat && (h += "(?:" + a + h + ")*"),
                  (o += h =
                      c.optional
                          ? a
                              ? "(?:" + a + "(" + h + "))?"
                              : "(" + h + ")?"
                          : a + "(" + h + ")"));
        }
        return (
            n || (o = (r ? o.slice(0, -2) : o) + "(?:\\/(?=$))?"),
            (o += i ? "$" : n && r ? "" : "(?=\\/|$)"),
            new RegExp("^" + o, v(e))
        );
    }
    function _(t, e, n) {
        if (
            (g((e = e || [])) ? (n = n || {}) : ((n = e), (e = [])),
            t instanceof RegExp)
        ) {
            var i = t,
                o = e,
                r = i.source.match(/\((?!\?)/g);
            if (r)
                for (var s = 0; s < r.length; s++)
                    o.push({
                        name: s,
                        prefix: null,
                        delimiter: null,
                        optional: !1,
                        repeat: !1,
                        pattern: null,
                    });
            return w(i, o);
        }
        if (g(t)) {
            for (var a = t, h = e, c = n, p = [], d = 0; d < a.length; d++)
                p.push(_(a[d], h, c).source);
            return w(new RegExp("(?:" + p.join("|") + ")", v(c)), h);
        }
        for (
            var l = e, i = n, u = m((e = t)), e = y(u, i), f = 0;
            f < u.length;
            f++
        )
            "string" != typeof u[f] && l.push(u[f]);
        return w(e, l);
    }
    (i.parse = e),
        (i.compile = t),
        (i.tokensToFunction = n),
        (i.tokensToRegExp = o);
    var s,
        h = "undefined" != typeof document,
        a = "undefined" != typeof window,
        c = "undefined" != typeof history,
        l = "undefined" != typeof process,
        u = h && document.ontouchstart ? "touchstart" : "click",
        f = a && !(!window.history.location && !window.location);
    function b() {
        (this.callbacks = []),
            (this.exits = []),
            (this.current = ""),
            (this.len = 0),
            (this._decodeURLComponents = !0),
            (this._base = ""),
            (this._strict = !1),
            (this._running = !1),
            (this._hashbang = !1),
            (this.clickHandler = this.clickHandler.bind(this)),
            (this._onpopstate = this._onpopstate.bind(this));
    }
    function x(t, e) {
        if ("function" == typeof t) return x.call(this, "*", t);
        if ("function" == typeof e)
            for (var n = new R(t, null, this), i = 1; i < arguments.length; ++i)
                this.callbacks.push(n.middleware(arguments[i]));
        else
            "string" == typeof t
                ? this["string" == typeof e ? "redirect" : "show"](t, e)
                : this.start(t);
    }
    function E(t, e, n) {
        var n = (this.page = n || x),
            i = n._window,
            o = n._hashbang,
            r = t.replace(
                document.baseURI
                    .split("/")
                    .filter((t) => t.length)
                    .pop() + "/",
                "",
            ),
            s = n._getBase(),
            a = (r =
                "/" === r[0] && 0 !== r.indexOf(s)
                    ? s + (o ? "#!" : "") + r
                    : r).indexOf("?"),
            t =
                ((this.canonicalPath = t),
                new RegExp(
                    "^" + s.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1"),
                ));
        (this.path = r.replace(t, "") || "/"),
            o && (this.path = this.path.replace("#!", "") || "/"),
            (this.title = h && i.document.title),
            (this.state = e || {}),
            (this.state.path = r),
            (this.querystring = ~a
                ? n._decodeURLEncodedURIComponent(r.slice(a + 1))
                : ""),
            (this.pathname = n._decodeURLEncodedURIComponent(
                ~a ? r.slice(0, a) : r,
            )),
            (this.params = {}),
            (this.hash = ""),
            o ||
                (~this.path.indexOf("#") &&
                    ((s = this.path.split("#")),
                    (this.path = this.pathname = s[0]),
                    (this.hash = n._decodeURLEncodedURIComponent(s[1]) || ""),
                    (this.querystring = this.querystring.split("#")[0])));
    }
    function R(t, e, n) {
        this.page = n || k;
        e = e || {};
        (e.strict = e.strict || n._strict),
            (this.path = "*" === t ? "(.*)" : t),
            (this.method = "GET"),
            (this.regexp = i(this.path, (this.keys = []), e));
    }
    (b.prototype.configure = function (t) {
        (t = t || {}),
            (this._window = t.window || (a && window)),
            (this._decodeURLComponents = !1 !== t.decodeURLComponents),
            (this._popstate = !1 !== t.popstate && a),
            (this._click = !1 !== t.click && h),
            (this._hashbang = !!t.hashbang),
            (t = this._window);
        this._popstate
            ? t.addEventListener("popstate", this._onpopstate, !1)
            : a && t.removeEventListener("popstate", this._onpopstate, !1),
            this._click
                ? t.document.addEventListener(u, this.clickHandler, !1)
                : h && t.document.removeEventListener(u, this.clickHandler, !1),
            this._hashbang && a && !c
                ? t.addEventListener("hashchange", this._onpopstate, !1)
                : a &&
                  t.removeEventListener("hashchange", this._onpopstate, !1);
    }),
        (b.prototype.base = function (t) {
            if (0 === arguments.length) return this._base;
            this._base = t;
        }),
        (b.prototype._getBase = function () {
            var t,
                e = this._base;
            return (
                e ||
                    ((t = a && this._window && this._window.location),
                    a &&
                        this._hashbang &&
                        t &&
                        "file:" === t.protocol &&
                        (e = t.pathname)),
                e
            );
        }),
        (b.prototype.strict = function (t) {
            if (0 === arguments.length) return this._strict;
            this._strict = t;
        }),
        (b.prototype.start = function (t) {
            var e,
                t = t || {};
            this.configure(t),
                !1 !== t.dispatch &&
                    ((this._running = !0),
                    f &&
                        ((e = this._window.location),
                        (e =
                            this._hashbang && ~e.hash.indexOf("#!")
                                ? e.hash.substr(2) + e.search
                                : this._hashbang
                                ? e.search + e.hash
                                : e.pathname + e.search + e.hash)),
                    this.replace(e, null, !0, t.dispatch));
        }),
        (b.prototype.stop = function () {
            var t;
            this._running &&
                ((this.current = ""),
                (this.len = 0),
                (this._running = !1),
                (t = this._window),
                this._click &&
                    t.document.removeEventListener(u, this.clickHandler, !1),
                a && t.removeEventListener("popstate", this._onpopstate, !1),
                a) &&
                t.removeEventListener("hashchange", this._onpopstate, !1);
        }),
        (b.prototype.show = function (t, e, n, i) {
            (t = new E(t, e, this)), (e = this.prevContext);
            return (
                (this.prevContext = t),
                (this.current = t.path),
                !1 !== n && this.dispatch(t, e),
                !1 !== t.handled && !1 !== i && t.pushState(),
                t
            );
        }),
        (b.prototype.back = function (t, e) {
            var n,
                i = this;
            0 < this.len
                ? ((n = this._window), c && n.history.back(), this.len--)
                : t
                ? setTimeout(function () {
                      i.show(t, e);
                  })
                : setTimeout(function () {
                      i.show(i._getBase(), e);
                  });
        }),
        (b.prototype.redirect = function (t, e) {
            var n = this;
            "string" == typeof t &&
                "string" == typeof e &&
                x.call(this, t, function (t) {
                    setTimeout(function () {
                        n.replace(e);
                    }, 0);
                }),
                "string" == typeof t &&
                    void 0 === e &&
                    setTimeout(function () {
                        n.replace(t);
                    }, 0);
        }),
        (b.prototype.replace = function (t, e, n, i) {
            (t = new E(t, e, this)), (e = this.prevContext);
            return (
                (this.prevContext = t),
                (this.current = t.path),
                (t.init = n),
                t.save(),
                !1 !== i && this.dispatch(t, e),
                t
            );
        }),
        (b.prototype.dispatch = function (e, n) {
            var i = 0,
                o = 0,
                r = this;
            function s() {
                var t = r.callbacks[i++];
                if (e.path === r.current)
                    return t
                        ? void t(e, s)
                        : function (t) {
                              var e;
                              t.handled ||
                                  ((e = this._window),
                                  (this._hashbang
                                      ? f &&
                                        this._getBase() +
                                            e.location.hash.replace("#!", "")
                                      : f &&
                                        e.location.pathname +
                                            e.location.search) !==
                                      t.canonicalPath &&
                                      (this.stop(), (t.handled = !1), f) &&
                                      (e.location.href = t.canonicalPath));
                          }.call(r, e);
                e.handled = !1;
            }
            (n
                ? function t() {
                      var e = r.exits[o++];
                      if (!e) return s();
                      e(n, t);
                  }
                : s)();
        }),
        (b.prototype.exit = function (t, e) {
            if ("function" == typeof t) return this.exit("*", t);
            for (var n = new R(t, null, this), i = 1; i < arguments.length; ++i)
                this.exits.push(n.middleware(arguments[i]));
        }),
        (b.prototype.clickHandler = function (t) {
            if (
                1 === this._which(t) &&
                !(t.metaKey || t.ctrlKey || t.shiftKey || t.defaultPrevented)
            ) {
                var e,
                    n,
                    i,
                    o = t.target,
                    r = t.path || (t.composedPath ? t.composedPath() : null);
                if (r)
                    for (var s = 0; s < r.length; s++)
                        if (
                            r[s].nodeName &&
                            "A" === r[s].nodeName.toUpperCase() &&
                            r[s].href
                        ) {
                            o = r[s];
                            break;
                        }
                for (; o && "A" !== o.nodeName.toUpperCase(); )
                    o = o.parentNode;
                o &&
                    "A" === o.nodeName.toUpperCase() &&
                    ((n =
                        "object" == typeof o.href &&
                        "SVGAnimatedString" === o.href.constructor.name),
                    o.hasAttribute("download") ||
                        "external" === o.getAttribute("rel") ||
                        ((e = o.getAttribute("href")),
                        !this._hashbang &&
                            this._samePath(o) &&
                            (o.hash || "#" === e)) ||
                        (e && -1 < e.indexOf("mailto:")) ||
                        (n ? o.target.baseVal : o.target) ||
                        ((n || this.sameOrigin(o.href)) &&
                            ((e =
                                "/" !==
                                (e = n
                                    ? o.href.baseVal
                                    : o.pathname + o.search + (o.hash || ""))[0]
                                    ? "/" + e
                                    : e),
                            (n = e =
                                l && e.match(/^\/[a-zA-Z]:\//)
                                    ? e.replace(/^\/[a-zA-Z]:\//, "/")
                                    : e),
                            (i = this._getBase()),
                            0 === e.indexOf(i) && (e = e.substr(i.length)),
                            this._hashbang && (e = e.replace("#!", "")),
                            !i ||
                                n !== e ||
                                (f &&
                                    "file:" ===
                                        this._window.location.protocol)) &&
                            (t.preventDefault(), this.show(n))));
            }
        }),
        (b.prototype._onpopstate =
            ((s = !1),
            a
                ? (h && "complete" === document.readyState
                      ? (s = !0)
                      : window.addEventListener("load", function () {
                            setTimeout(function () {
                                s = !0;
                            }, 0);
                        }),
                  function (t) {
                      var e;
                      s &&
                          (t.state
                              ? ((e = t.state.path), this.replace(e, t.state))
                              : f &&
                                ((e = this._window.location),
                                this.show(
                                    e.pathname + e.search + e.hash,
                                    void 0,
                                    void 0,
                                    !1,
                                )));
                  })
                : function () {})),
        (b.prototype._which = function (t) {
            return null == (t = t || (a && this._window.event)).which
                ? t.button
                : t.which;
        }),
        (b.prototype._toURL = function (t) {
            var e = this._window;
            return "function" == typeof URL && f
                ? new URL(t, e.location.toString())
                : h
                ? (((e = e.document.createElement("a")).href = t), e)
                : void 0;
        }),
        (b.prototype.sameOrigin = function (t) {
            var e;
            return (
                !(!t || !f) &&
                ((t = this._toURL(t)),
                (e = this._window.location).protocol === t.protocol) &&
                e.hostname === t.hostname &&
                e.port === t.port
            );
        }),
        (b.prototype._samePath = function (t) {
            var e;
            return (
                !!f &&
                ((e = this._window.location), t.pathname === e.pathname) &&
                t.search === e.search
            );
        }),
        (b.prototype._decodeURLEncodedURIComponent = function (t) {
            return "string" == typeof t && this._decodeURLComponents
                ? decodeURIComponent(t.replace(/\+/g, " "))
                : t;
        }),
        (E.prototype.pushState = function () {
            var t = this.page,
                e = t._window,
                n = t._hashbang;
            t.len++,
                c &&
                    e.history.pushState(
                        this.state,
                        this.title,
                        n && "/" !== this.path
                            ? "#!" + this.path
                            : this.canonicalPath,
                    );
        }),
        (E.prototype.save = function () {
            var t = this.page;
            c &&
                "file:" !== t._window.location.protocol &&
                t._window.history.replaceState(
                    this.state,
                    this.title,
                    t._hashbang && "/" !== this.path
                        ? "#!" + this.path
                        : this.canonicalPath,
                );
        }),
        (R.prototype.middleware = function (n) {
            var i = this;
            return function (t, e) {
                if (i.match(t.path, t.params)) return n(t, e);
                e();
            };
        }),
        (R.prototype.match = function (t, e) {
            var n = this.keys,
                i = t.indexOf("?"),
                i = ~i ? t.slice(0, i) : t,
                o = this.regexp.exec(decodeURIComponent(i));
            if (!o) return !1;
            for (var r = 1, s = o.length; r < s; ++r) {
                var a = n[r - 1],
                    h = this.page._decodeURLEncodedURIComponent(o[r]);
                (void 0 === h && hasOwnProperty.call(e, a.name)) ||
                    (e[a.name] = h);
            }
            return !0;
        });
    var k = (function t() {
            var e = new b();
            function n() {
                return x.apply(e, arguments);
            }
            return (
                (n.callbacks = e.callbacks),
                (n.exits = e.exits),
                (n.base = e.base.bind(e)),
                (n.strict = e.strict.bind(e)),
                (n.start = e.start.bind(e)),
                (n.stop = e.stop.bind(e)),
                (n.show = e.show.bind(e)),
                (n.back = e.back.bind(e)),
                (n.redirect = e.redirect.bind(e)),
                (n.replace = e.replace.bind(e)),
                (n.dispatch = e.dispatch.bind(e)),
                (n.exit = e.exit.bind(e)),
                (n.configure = e.configure.bind(e)),
                (n.sameOrigin = e.sameOrigin.bind(e)),
                (n.clickHandler = e.clickHandler.bind(e)),
                (n.create = t),
                Object.defineProperty(n, "len", {
                    get: function () {
                        return e.len;
                    },
                    set: function (t) {
                        e.len = t;
                    },
                }),
                Object.defineProperty(n, "current", {
                    get: function () {
                        return e.current;
                    },
                    set: function (t) {
                        e.current = t;
                    },
                }),
                (n.Context = E),
                (n.Route = R),
                n
            );
        })(),
        e = k;
    return (e.default = k), e;
});
/*!
 * EventEmitter v5.2.4 - git.io/ee
 * Unlicense - https://unlicense.org/
 * Oliver Caldwell - https://oli.me.uk/
 * @preserve
 */
!(function (e) {
    "use strict";
    function t() {}
    function n(e, t) {
        for (var n = e.length; n--; ) if (e[n].listener === t) return n;
        return -1;
    }
    function r(e) {
        return function () {
            return this[e].apply(this, arguments);
        };
    }
    function i(e) {
        return (
            "function" == typeof e ||
            e instanceof RegExp ||
            (!(!e || "object" != typeof e) && i(e.listener))
        );
    }
    var s = t.prototype,
        o = e.EventEmitter;
    (s.getListeners = function (e) {
        var t,
            n,
            r = this._getEvents();
        if (e instanceof RegExp) {
            t = {};
            for (n in r) r.hasOwnProperty(n) && e.test(n) && (t[n] = r[n]);
        } else t = r[e] || (r[e] = []);
        return t;
    }),
        (s.flattenListeners = function (e) {
            var t,
                n = [];
            for (t = 0; t < e.length; t += 1) n.push(e[t].listener);
            return n;
        }),
        (s.getListenersAsObject = function (e) {
            var t,
                n = this.getListeners(e);
            return n instanceof Array && ((t = {}), (t[e] = n)), t || n;
        }),
        (s.addListener = function (e, t) {
            if (!i(t)) throw new TypeError("listener must be a function");
            var r,
                s = this.getListenersAsObject(e),
                o = "object" == typeof t;
            for (r in s)
                s.hasOwnProperty(r) &&
                    n(s[r], t) === -1 &&
                    s[r].push(o ? t : { listener: t, once: !1 });
            return this;
        }),
        (s.on = r("addListener")),
        (s.addOnceListener = function (e, t) {
            return this.addListener(e, { listener: t, once: !0 });
        }),
        (s.once = r("addOnceListener")),
        (s.defineEvent = function (e) {
            return this.getListeners(e), this;
        }),
        (s.defineEvents = function (e) {
            for (var t = 0; t < e.length; t += 1) this.defineEvent(e[t]);
            return this;
        }),
        (s.removeListener = function (e, t) {
            var r,
                i,
                s = this.getListenersAsObject(e);
            for (i in s)
                s.hasOwnProperty(i) &&
                    ((r = n(s[i], t)), r !== -1 && s[i].splice(r, 1));
            return this;
        }),
        (s.off = r("removeListener")),
        (s.addListeners = function (e, t) {
            return this.manipulateListeners(!1, e, t);
        }),
        (s.removeListeners = function (e, t) {
            return this.manipulateListeners(!0, e, t);
        }),
        (s.manipulateListeners = function (e, t, n) {
            var r,
                i,
                s = e ? this.removeListener : this.addListener,
                o = e ? this.removeListeners : this.addListeners;
            if ("object" != typeof t || t instanceof RegExp)
                for (r = n.length; r--; ) s.call(this, t, n[r]);
            else
                for (r in t)
                    t.hasOwnProperty(r) &&
                        (i = t[r]) &&
                        ("function" == typeof i
                            ? s.call(this, r, i)
                            : o.call(this, r, i));
            return this;
        }),
        (s.removeEvent = function (e) {
            var t,
                n = typeof e,
                r = this._getEvents();
            if ("string" === n) delete r[e];
            else if (e instanceof RegExp)
                for (t in r) r.hasOwnProperty(t) && e.test(t) && delete r[t];
            else delete this._events;
            return this;
        }),
        (s.removeAllListeners = r("removeEvent")),
        (s.emitEvent = function (e, t) {
            var n,
                r,
                i,
                s,
                o,
                u = this.getListenersAsObject(e);
            for (s in u)
                if (u.hasOwnProperty(s))
                    for (n = u[s].slice(0), i = 0; i < n.length; i++)
                        (r = n[i]),
                            r.once === !0 && this.removeListener(e, r.listener),
                            (o = r.listener.apply(this, t || [])),
                            o === this._getOnceReturnValue() &&
                                this.removeListener(e, r.listener);
            return this;
        }),
        (s.trigger = r("emitEvent")),
        (s.emit = function (e) {
            var t = Array.prototype.slice.call(arguments, 1);
            return this.emitEvent(e, t);
        }),
        (s.setOnceReturnValue = function (e) {
            return (this._onceReturnValue = e), this;
        }),
        (s._getOnceReturnValue = function () {
            return (
                !this.hasOwnProperty("_onceReturnValue") ||
                this._onceReturnValue
            );
        }),
        (s._getEvents = function () {
            return this._events || (this._events = {});
        }),
        (t.noConflict = function () {
            return (e.EventEmitter = o), t;
        }),
        "function" == typeof define && define.amd
            ? define(function () {
                  return t;
              })
            : "object" == typeof module && module.exports
            ? (module.exports = t)
            : (e.EventEmitter = t);
})(this || {});

/* docma (dust) compiled templates */
(function (dust) {
    dust.register("docma-content", body_0);
    function body_0(chk, ctx) {
        return chk
            .p("navbar", ctx, ctx, { boxed: "true" })
            .w('<div id="page-content-wrapper"><div class=\'')
            .h(
                "eq",
                ctx,
                { block: body_1 },
                {
                    key: ctx.getPath(false, ["currentRoute", "sourceType"]),
                    value: "md",
                },
                "h",
            )
            .w('\'><div id="docma-content"></div>')
            .h(
                "eq",
                ctx,
                { block: body_2 },
                {
                    key: ctx.getPath(false, ["currentRoute", "sourceType"]),
                    value: "md",
                },
                "h",
            )
            .w("</div></div>");
    }
    body_0.__dustBody = !0;
    function body_1(chk, ctx) {
        return chk.w("container container-boxed");
    }
    body_1.__dustBody = !0;
    function body_2(chk, ctx) {
        return chk.w(
            '<br /><hr /><span class="docma-info">Documentation built with <b><a target="_blank" rel="noopener noreferrer" href="https://onury.io/docma">Docma</a></b>.</span>',
        );
    }
    body_2.__dustBody = !0;
    return body_0;
})(dust);
(function (dust) {
    dust.register("docma-api", body_0);
    function body_0(chk, ctx) {
        return chk
            .p("navbar", ctx, ctx, {})
            .w('<div id="wrapper">')
            .x(
                ctx.getPath(false, [
                    "template",
                    "options",
                    "sidebar",
                    "enabled",
                ]),
                ctx,
                { block: body_1 },
                {},
            )
            .w('<div id="page-content-wrapper"><div class="container"><br />')
            .s(ctx.get(["documentation"], false), ctx, { block: body_2 }, {})
            .w(
                '<br /><span class="docma-info">Documentation built with <b><a target="_blank" rel="noopener noreferrer" href="https://onury.io/docma">Docma</a></b>.</span></div></div></div>',
            );
    }
    body_0.__dustBody = !0;
    function body_1(chk, ctx) {
        return chk
            .w('<div id="sidebar-wrapper">')
            .p("sidebar", ctx, ctx, {})
            .w("</div>");
    }
    body_1.__dustBody = !0;
    function body_2(chk, ctx) {
        return chk.p("symbol", ctx, ctx, {
            symbol: ctx.getPath(true, []),
            template: ctx.get(["template"], false),
        });
    }
    body_2.__dustBody = !0;
    return body_0;
})(dust);
(function (dust) {
    dust.register("docma-404", body_0);
    function body_0(chk, ctx) {
        return chk
            .p("navbar", ctx, ctx, { boxed: "true" })
            .w(
                '<div id="page-content-wrapper"><div class="container container-boxed"><br /><br /><h1>404</h1><hr /><h3>Page Not Found</h3><br />The file or page you have requested is not found. &nbsp;&nbsp;<br />Please make sure page address is entered correctly.<br /><br /><br /></div></div>',
            );
    }
    body_0.__dustBody = !0;
    return body_0;
})(dust);
(function (dust) {
    dust.register("symbol", body_0);
    function body_0(chk, ctx) {
        return chk.nx(
            ctx.getPath(false, ["symbol", "$hide"]),
            ctx,
            { block: body_1 },
            {},
        );
    }
    body_0.__dustBody = !0;
    function body_1(chk, ctx) {
        return chk
            .w('<div id="')
            .f(ctx.get(["symbol"], false), ctx, "h", ["$id"])
            .w(
                '" class="symbol-container"><div class="symbol-heading"><div class="symbol"><a href="#',
            )
            .f(ctx.get(["symbol"], false), ctx, "h", ["$id"])
            .w(
                '"><i class="fas fa-link color-gray-light" aria-hidden="true"></i></a><code class="symbol-name">',
            )
            .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$longname_params"])
            .w('</code><span class="symbol-sep">')
            .f(ctx.get(["symbol"], false), ctx, "h", ["$type_sep"])
            .w('</span><code class="symbol-type">')
            .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$type"])
            .w("</code>")
            .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$tags"])
            .w(
                '</div></div><div class="symbol-definition"><div class="symbol-info">',
            )
            .x(
                ctx.getPath(false, ["symbol", "alias"]),
                ctx,
                { block: body_2 },
                {},
            )
            .x(
                ctx.getPath(false, ["symbol", "augments"]),
                ctx,
                { block: body_4 },
                {},
            )
            .x(
                ctx.getPath(false, ["symbol", "version"]),
                ctx,
                { block: body_5 },
                {},
            )
            .x(
                ctx.getPath(false, ["symbol", "since"]),
                ctx,
                { block: body_6 },
                {},
            )
            .x(
                ctx.getPath(false, ["symbol", "copyright"]),
                ctx,
                { block: body_7 },
                {},
            )
            .x(
                ctx.getPath(false, ["symbol", "author"]),
                ctx,
                { block: body_8 },
                {},
            )
            .x(
                ctx.getPath(false, ["symbol", "license"]),
                ctx,
                { block: body_9 },
                {},
            )
            .w("</div>")
            .x(
                ctx.getPath(false, ["symbol", "defaultvalue"]),
                ctx,
                { block: body_10 },
                {},
            )
            .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$desc"])
            .x(
                ctx.getPath(false, ["symbol", "see"]),
                ctx,
                { block: body_11 },
                {},
            )
            .h(
                "ne",
                ctx,
                { block: body_16 },
                {
                    key: ctx.getPath(false, ["symbol", "meta", "code", "type"]),
                    value: "ClassDeclaration",
                },
                "h",
            )
            .x(
                ctx.getPath(false, ["symbol", "fires"]),
                ctx,
                { block: body_19 },
                {},
            )
            .x(
                ctx.getPath(false, ["symbol", "returns"]),
                ctx,
                { block: body_21 },
                {},
            )
            .x(
                ctx.getPath(false, ["symbol", "generator"]),
                ctx,
                { block: body_24 },
                {},
            )
            .x(
                ctx.getPath(false, ["symbol", "exceptions"]),
                ctx,
                { block: body_28 },
                {},
            )
            .x(
                ctx.getPath(false, ["symbol", "isEnum"]),
                ctx,
                { block: body_31 },
                {},
            )
            .x(
                ctx.getPath(false, ["symbol", "examples"]),
                ctx,
                { block: body_32 },
                {},
            )
            .x(
                ctx.getPath(false, ["template", "options", "symbols", "meta"]),
                ctx,
                { block: body_35 },
                {},
            )
            .w("</div></div><hr />")
            .x(
                ctx.getPath(false, ["symbol", "$constructor"]),
                ctx,
                { block: body_39 },
                {},
            )
            .nx(
                ctx.getPath(false, ["symbol", "isEnum"]),
                ctx,
                { block: body_41 },
                {},
            );
    }
    body_1.__dustBody = !0;
    function body_2(chk, ctx) {
        return chk.nx(
            ctx.get(["$constructor"], false),
            ctx,
            { block: body_3 },
            {},
        );
    }
    body_2.__dustBody = !0;
    function body_3(chk, ctx) {
        return chk
            .w('<p><b class="caption">Alias:</b> <code>')
            .f(ctx.getPath(false, ["symbol", "alias"]), ctx, "h", [
                "s",
                "$dot_prop",
            ])
            .w("</code></p>");
    }
    body_3.__dustBody = !0;
    function body_4(chk, ctx) {
        return chk
            .w('<p><b class="caption">Extends:</b> ')
            .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$extends"])
            .w("</p>");
    }
    body_4.__dustBody = !0;
    function body_5(chk, ctx) {
        return chk
            .w('<p><b class="caption">Version:</b>&nbsp;')
            .f(ctx.getPath(false, ["symbol", "version"]), ctx, "h", ["s"])
            .w("</p>");
    }
    body_5.__dustBody = !0;
    function body_6(chk, ctx) {
        return chk
            .w('<p><b class="caption">Since:</b>&nbsp;')
            .f(ctx.getPath(false, ["symbol", "since"]), ctx, "h", ["s"])
            .w("</p>");
    }
    body_6.__dustBody = !0;
    function body_7(chk, ctx) {
        return chk
            .w('<p><b class="caption">Copyright:</b>&nbsp;')
            .f(ctx.getPath(false, ["symbol", "copyright"]), ctx, "h", ["s"])
            .w("</p>");
    }
    body_7.__dustBody = !0;
    function body_8(chk, ctx) {
        return chk
            .w('<p><b class="caption">Author:</b>&nbsp;')
            .f(ctx.getPath(false, ["symbol", "author"]), ctx, "h", [
                "s",
                "$author",
            ])
            .w("</p>");
    }
    body_8.__dustBody = !0;
    function body_9(chk, ctx) {
        return chk
            .w('<p><b class="caption">License:</b>&nbsp;')
            .f(ctx.getPath(false, ["symbol", "license"]), ctx, "h", ["s"])
            .w("</p>");
    }
    body_9.__dustBody = !0;
    function body_10(chk, ctx) {
        return chk
            .w(
                '<p class="symbol-def-val"><b class="caption"><i>Value:</i></b>&nbsp;<code>',
            )
            .f(ctx.get(["symbol"], false), ctx, "h", ["$def"])
            .w("</code></p>");
    }
    body_10.__dustBody = !0;
    function body_11(chk, ctx) {
        return chk
            .w('<p class="no-margin"><b>See</b>')
            .h(
                "gt",
                ctx,
                { else: body_12, block: body_14 },
                {
                    key: ctx.getPath(false, ["symbol", "see", "length"]),
                    value: 1,
                },
                "h",
            )
            .w("</p>");
    }
    body_11.__dustBody = !0;
    function body_12(chk, ctx) {
        return chk.s(
            ctx.getPath(false, ["symbol", "see"]),
            ctx,
            { block: body_13 },
            {},
        );
    }
    body_12.__dustBody = !0;
    function body_13(chk, ctx) {
        return chk.w("&nbsp;").f(ctx.getPath(true, []), ctx, "h", ["s", "$pl"]);
    }
    body_13.__dustBody = !0;
    function body_14(chk, ctx) {
        return chk
            .w("<ul>")
            .s(
                ctx.getPath(false, ["symbol", "see"]),
                ctx,
                { block: body_15 },
                {},
            )
            .w("</ul>");
    }
    body_14.__dustBody = !0;
    function body_15(chk, ctx) {
        return chk
            .w("<li>")
            .f(ctx.getPath(true, []), ctx, "h", ["s", "$pl"])
            .w("</li>");
    }
    body_15.__dustBody = !0;
    function body_16(chk, ctx) {
        return chk
            .p("params", ctx, ctx.rebase(ctx.get(["symbol"], false)), {
                template: ctx.get(["template"], false),
            })
            .w(" ")
            .x(
                ctx.getPath(false, ["symbol", "isEnum"]),
                ctx,
                { else: body_17, block: body_18 },
                {},
            );
    }
    body_16.__dustBody = !0;
    function body_17(chk, ctx) {
        return chk
            .p("properties", ctx, ctx.rebase(ctx.get(["symbol"], false)), {
                template: ctx.get(["template"], false),
            })
            .w(" ");
    }
    body_17.__dustBody = !0;
    function body_18(chk, ctx) {
        return chk;
    }
    body_18.__dustBody = !0;
    function body_19(chk, ctx) {
        return chk.h(
            "gt",
            ctx,
            { block: body_20 },
            {
                key: ctx.getPath(false, ["symbol", "fires", "length"]),
                value: "0",
                type: "number",
            },
            "h",
        );
    }
    body_19.__dustBody = !0;
    function body_20(chk, ctx) {
        return chk
            .w('<p><b class="caption">Emits:</b>&nbsp;&nbsp;')
            .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$emits"])
            .w("</p>");
    }
    body_20.__dustBody = !0;
    function body_21(chk, ctx) {
        return chk.h(
            "gt",
            ctx,
            { else: body_22, block: body_23 },
            {
                key: ctx.getPath(false, ["symbol", "returns", "length"]),
                value: "1",
                type: "number",
            },
            "h",
        );
    }
    body_21.__dustBody = !0;
    function body_22(chk, ctx) {
        return chk
            .w('<p><b class="caption">Returns:</b>&nbsp;&nbsp;')
            .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$returns"])
            .w("</p>");
    }
    body_22.__dustBody = !0;
    function body_23(chk, ctx) {
        return chk
            .w('<b class="caption">Returns:</b><p class="pad-left">')
            .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$returns"])
            .w("</p>");
    }
    body_23.__dustBody = !0;
    function body_24(chk, ctx) {
        return chk.x(
            ctx.getPath(false, ["symbol", "yields"]),
            ctx,
            { block: body_25 },
            {},
        );
    }
    body_24.__dustBody = !0;
    function body_25(chk, ctx) {
        return chk.h(
            "gt",
            ctx,
            { else: body_26, block: body_27 },
            {
                key: ctx.getPath(false, ["symbol", "yields", "length"]),
                value: "1",
                type: "number",
            },
            "h",
        );
    }
    body_25.__dustBody = !0;
    function body_26(chk, ctx) {
        return chk
            .w('<p><b class="caption">Yields:</b>&nbsp;&nbsp;')
            .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$yields"])
            .w("</p>");
    }
    body_26.__dustBody = !0;
    function body_27(chk, ctx) {
        return chk
            .w('<b class="caption">Yields:</b><p class="pad-left">')
            .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$yields"])
            .w("</p>");
    }
    body_27.__dustBody = !0;
    function body_28(chk, ctx) {
        return chk.h(
            "gt",
            ctx,
            { else: body_29, block: body_30 },
            {
                key: ctx.getPath(false, ["symbol", "exceptions", "length"]),
                value: "1",
                type: "number",
            },
            "h",
        );
    }
    body_28.__dustBody = !0;
    function body_29(chk, ctx) {
        return chk
            .w('<p><b class="caption">Throws:</b>&nbsp;&nbsp;')
            .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$exceptions"])
            .w("</p>");
    }
    body_29.__dustBody = !0;
    function body_30(chk, ctx) {
        return chk
            .w('<b class="caption">Throws:</b><p class="pad-left">')
            .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$exceptions"])
            .w("</p>");
    }
    body_30.__dustBody = !0;
    function body_31(chk, ctx) {
        return chk
            .p("enums", ctx, ctx.rebase(ctx.get(["symbol"], false)), {
                template: ctx.get(["template"], false),
            })
            .w(" ");
    }
    body_31.__dustBody = !0;
    function body_32(chk, ctx) {
        return chk.s(
            ctx.getPath(false, ["symbol", "examples"]),
            ctx,
            { block: body_33 },
            {},
        );
    }
    body_32.__dustBody = !0;
    function body_33(chk, ctx) {
        return chk
            .w("<p><b>Example")
            .h(
                "gt",
                ctx,
                { block: body_34 },
                {
                    key: ctx.getPath(false, ["symbol", "examples", "length"]),
                    value: 1,
                },
                "h",
            )
            .w("</b>")
            .f(ctx.getPath(true, []), ctx, "h", ["$get_caption", "s"])
            .w("</p><pre><code>")
            .f(ctx.getPath(true, []), ctx, "h", [
                "$nt",
                "$tnl",
                "$remove_caption",
            ])
            .w("</code></pre>");
    }
    body_33.__dustBody = !0;
    function body_34(chk, ctx) {
        return chk
            .w("&nbsp;#")
            .h(
                "math",
                ctx,
                {},
                { key: ctx.get(["$idx"], false), method: "add", operand: "1" },
                "h",
            );
    }
    body_34.__dustBody = !0;
    function body_35(chk, ctx) {
        return chk.x(
            ctx.getPath(false, ["symbol", "meta", "lineno"]),
            ctx,
            { block: body_36 },
            {},
        );
    }
    body_35.__dustBody = !0;
    function body_36(chk, ctx) {
        return chk
            .w('<p class="symbol-meta">')
            .x(
                ctx.getPath(false, ["symbol", "meta", "filename"]),
                ctx,
                { block: body_37 },
                {},
            )
            .x(
                ctx.getPath(false, ["symbol", "meta", "lineno"]),
                ctx,
                { block: body_38 },
                {},
            )
            .w("</p>");
    }
    body_36.__dustBody = !0;
    function body_37(chk, ctx) {
        return chk
            .w("<b>File:</b> ")
            .f(ctx.getPath(false, ["symbol", "meta", "filename"]), ctx, "h")
            .w("&nbsp;&nbsp;");
    }
    body_37.__dustBody = !0;
    function body_38(chk, ctx) {
        return chk
            .w("<b>Line:</b> ")
            .f(ctx.getPath(false, ["symbol", "meta", "lineno"]), ctx, "h")
            .w("&nbsp;&nbsp;");
    }
    body_38.__dustBody = !0;
    function body_39(chk, ctx) {
        return chk.h(
            "ne",
            ctx,
            { block: body_40 },
            {
                key: ctx.getPath(false, ["symbol", "hideconstructor"]),
                type: "boolean",
                value: "true",
            },
            "h",
        );
    }
    body_39.__dustBody = !0;
    function body_40(chk, ctx) {
        return chk.p("symbol", ctx, ctx, {
            symbol: ctx.getPath(false, ["symbol", "$constructor"]),
            template: ctx.get(["template"], false),
        });
    }
    body_40.__dustBody = !0;
    function body_41(chk, ctx) {
        return chk.s(
            ctx.getPath(false, ["symbol", "$members"]),
            ctx,
            { block: body_42 },
            {},
        );
    }
    body_41.__dustBody = !0;
    function body_42(chk, ctx) {
        return chk.p("symbol", ctx, ctx, {
            symbol: ctx.getPath(true, []),
            template: ctx.get(["template"], false),
        });
    }
    body_42.__dustBody = !0;
    return body_0;
})(dust);
(function (dust) {
    dust.register("sidebar", body_0);
    function body_0(chk, ctx) {
        return chk
            .w(
                '<div class="sidebar-header"><div id="sidebar-toggle"><i class="fas fa-lg fa-bars trans-all-ease"></i></div><div class="sidebar-brand">',
            )
            .x(
                ctx.getPath(false, ["template", "options", "logo", "light"]),
                ctx,
                { block: body_1 },
                {},
            )
            .w('<span class="sidebar-title"><a href="')
            .f(
                ctx.getPath(false, ["template", "options", "title", "href"]),
                ctx,
                "h",
            )
            .w('">')
            .f(
                ctx.getPath(false, ["template", "options", "title", "label"]),
                ctx,
                "h",
            )
            .w("</a></span></div>")
            .x(
                ctx.getPath(false, [
                    "template",
                    "options",
                    "sidebar",
                    "search",
                ]),
                ctx,
                { block: body_2 },
                {},
            )
            .x(
                ctx.getPath(false, [
                    "template",
                    "options",
                    "sidebar",
                    "toolbar",
                ]),
                ctx,
                { block: body_3 },
                {},
            )
            .w(
                '</div><div class="sidebar-nav-container"><ul class="sidebar-nav">',
            )
            .f(ctx.get(["symbols"], false), ctx, "h", ["s", "$navnodes"])
            .w("</ul></div>");
    }
    body_0.__dustBody = !0;
    function body_1(chk, ctx) {
        return chk
            .w('<img src="')
            .f(
                ctx.getPath(false, ["template", "options", "logo", "light"]),
                ctx,
                "h",
            )
            .w('" alt="logo" class="sidebar-logo" />');
    }
    body_1.__dustBody = !0;
    function body_2(chk, ctx) {
        return chk.w(
            '<div class="sidebar-search"><div class="sidebar-search-icon"><i class="fas fa-md fa-search"></i></div><input id="txt-search" type="search" placeholder="Search..." autocorrect="off" autocapitalize="off" spellcheck="false" /><div class="sidebar-search-clean"><i class="fas fa-lg fa-times-circle"></i></div></div>',
        );
    }
    body_2.__dustBody = !0;
    function body_3(chk, ctx) {
        return chk
            .w(
                '<div class="sidebar-toolbar"><div class="toolbar-scope-filters"></div><div class="toolbar-kind-filters"></div><div class="toolbar-buttons"><span class="btn-switch-fold inline-block" title="Fold Symbols">',
            )
            .h(
                "eq",
                ctx,
                { else: body_4, block: body_5 },
                {
                    key: ctx.getPath(false, [
                        "template",
                        "options",
                        "sidebar",
                        "itemsFolded",
                    ]),
                    type: "boolean",
                    value: "true",
                },
                "h",
            )
            .w(
                '</span><span class="btn-switch-outline inline-block space-left-xs" title="Toggle Outline">',
            )
            .h(
                "eq",
                ctx,
                { else: body_6, block: body_7 },
                {
                    key: ctx.getPath(false, [
                        "template",
                        "options",
                        "sidebar",
                        "outline",
                    ]),
                    type: "string",
                    value: "tree",
                },
                "h",
            )
            .w("</span></div></div>");
    }
    body_3.__dustBody = !0;
    function body_4(chk, ctx) {
        return chk.w('<i class="far fa-lg fa-caret-square-down"></i>');
    }
    body_4.__dustBody = !0;
    function body_5(chk, ctx) {
        return chk.w('<i class="far fa-lg fa-caret-square-right"></i>');
    }
    body_5.__dustBody = !0;
    function body_6(chk, ctx) {
        return chk.w('<i class="fas fa-lg fa-outdent"></i>');
    }
    body_6.__dustBody = !0;
    function body_7(chk, ctx) {
        return chk.w('<i class="fas fa-lg fa-indent"></i>');
    }
    body_7.__dustBody = !0;
    return body_0;
})(dust);
(function (dust) {
    dust.register("properties", body_0);
    function body_0(chk, ctx) {
        return chk.x(
            ctx.get(["properties"], false),
            ctx,
            { block: body_1 },
            {},
        );
    }
    body_0.__dustBody = !0;
    function body_1(chk, ctx) {
        return chk.h(
            "eq",
            ctx,
            { else: body_2, block: body_4 },
            {
                key: ctx.getPath(false, [
                    "template",
                    "options",
                    "symbols",
                    "props",
                ]),
                value: "table",
            },
            "h",
        );
    }
    body_1.__dustBody = !0;
    function body_2(chk, ctx) {
        return chk
            .w(
                '<div class="space-top-sm space-bottom-xs fw-bold">Properties</div><ul class="param-list">',
            )
            .s(ctx.get(["properties"], false), ctx, { block: body_3 }, {})
            .w("</ul>");
    }
    body_2.__dustBody = !0;
    function body_3(chk, ctx) {
        return chk
            .w(
                '<li><div class="param-meta clearfix"><span class="inline-block space-right-sm"><code>',
            )
            .f(ctx.get(["name"], false), ctx, "h", ["s", "$dot_prop"])
            .w("</code>&nbsp;:&nbsp;<code>")
            .f(ctx.getPath(true, []), ctx, "h", ["s", "$type"])
            .w('</code></span></div><div class="param-desc">')
            .f(ctx.get(["description"], false), ctx, "h", ["s", "$p"])
            .w("</div></li>");
    }
    body_3.__dustBody = !0;
    function body_4(chk, ctx) {
        return chk
            .w(
                '<table class="table table-striped table-bordered"><thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead><tbody>',
            )
            .s(ctx.get(["properties"], false), ctx, { block: body_5 }, {})
            .w("</tbody></table>");
    }
    body_4.__dustBody = !0;
    function body_5(chk, ctx) {
        return chk
            .w("<tr><td><code>")
            .f(ctx.get(["name"], false), ctx, "h", ["s", "$dot_prop"])
            .w("</code></td><td><code>")
            .f(ctx.getPath(true, []), ctx, "h", ["s", "$type"])
            .w("</code></td><td>")
            .f(ctx.get(["description"], false), ctx, "h", ["s", "$p"])
            .w("</td></tr>");
    }
    body_5.__dustBody = !0;
    return body_0;
})(dust);
(function (dust) {
    dust.register("params", body_0);
    function body_0(chk, ctx) {
        return chk.x(ctx.get(["params"], false), ctx, { block: body_1 }, {});
    }
    body_0.__dustBody = !0;
    function body_1(chk, ctx) {
        return chk.h(
            "eq",
            ctx,
            { else: body_2, block: body_8 },
            {
                key: ctx.getPath(false, [
                    "template",
                    "options",
                    "symbols",
                    "params",
                ]),
                value: "table",
            },
            "h",
        );
    }
    body_1.__dustBody = !0;
    function body_2(chk, ctx) {
        return chk
            .w(
                '<div class="space-top-sm space-bottom-xs fw-bold">Parameters</div><ul class="param-list">',
            )
            .s(ctx.get(["params"], false), ctx, { block: body_3 }, {})
            .w("</ul>");
    }
    body_2.__dustBody = !0;
    function body_3(chk, ctx) {
        return chk
            .w(
                '<li><div class="param-meta clearfix"><span class="inline-block space-right-sm"><code>',
            )
            .x(ctx.get(["variable"], false), ctx, { block: body_4 }, {})
            .f(ctx.get(["name"], false), ctx, "h", ["s", "$dot_prop"])
            .w("</code>&nbsp;:&nbsp;<code>")
            .x(ctx.get(["variable"], false), ctx, { block: body_5 }, {})
            .f(ctx.getPath(true, []), ctx, "h", ["s", "$type"])
            .w('</code></span><span class="param-info-box">')
            .x(
                ctx.get(["optional"], false),
                ctx,
                { else: body_6, block: body_7 },
                {},
            )
            .w('</span></div><div class="param-desc">')
            .f(ctx.getPath(true, []), ctx, "h", ["s", "$param_desc"])
            .w("</div></li>");
    }
    body_3.__dustBody = !0;
    function body_4(chk, ctx) {
        return chk.w("...");
    }
    body_4.__dustBody = !0;
    function body_5(chk, ctx) {
        return chk.w("...");
    }
    body_5.__dustBody = !0;
    function body_6(chk, ctx) {
        return chk.w('<span class="param-info required boxed">Required</span>');
    }
    body_6.__dustBody = !0;
    function body_7(chk, ctx) {
        return chk
            .w('<span class="param-info default">Default:&nbsp;</span><code>')
            .f(ctx.getPath(true, []), ctx, "h", ["$def"])
            .w("</code>");
    }
    body_7.__dustBody = !0;
    function body_8(chk, ctx) {
        return chk
            .w(
                '<table class="table table-striped table-bordered"><thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead><tbody>',
            )
            .s(ctx.get(["params"], false), ctx, { block: body_9 }, {})
            .w("</tbody></table>");
    }
    body_8.__dustBody = !0;
    function body_9(chk, ctx) {
        return chk
            .w("<tr><td><code>")
            .x(ctx.get(["variable"], false), ctx, { block: body_10 }, {})
            .f(ctx.get(["name"], false), ctx, "h", ["s", "$dot_prop"])
            .w("</code></td><td><code>")
            .x(ctx.get(["variable"], false), ctx, { block: body_11 }, {})
            .f(ctx.getPath(true, []), ctx, "h", ["s", "$type"])
            .w("</code></td><td>")
            .x(
                ctx.get(["optional"], false),
                ctx,
                { else: body_12, block: body_13 },
                {},
            )
            .f(ctx.getPath(true, []), ctx, "h", ["s", "$param_desc"])
            .w("</td></tr>");
    }
    body_9.__dustBody = !0;
    function body_10(chk, ctx) {
        return chk.w("...");
    }
    body_10.__dustBody = !0;
    function body_11(chk, ctx) {
        return chk.w("...");
    }
    body_11.__dustBody = !0;
    function body_12(chk, ctx) {
        return chk.w('<span class="param-info required boxed">Required</span>');
    }
    body_12.__dustBody = !0;
    function body_13(chk, ctx) {
        return chk
            .w(
                '<span class="param-info default boxed">Default</span><span class="color-gray">:</span><code>',
            )
            .f(ctx.getPath(true, []), ctx, "h", ["$def"])
            .w("</code>");
    }
    body_13.__dustBody = !0;
    return body_0;
})(dust);
(function (dust) {
    dust.register("navitem", body_0);
    function body_0(chk, ctx) {
        return chk.x(
            ctx.get(["separator"], false),
            ctx,
            { else: body_1, block: body_6 },
            {},
        );
    }
    body_0.__dustBody = !0;
    function body_1(chk, ctx) {
        return chk
            .w('<li><a href="')
            .x(
                ctx.get(["href"], false),
                ctx,
                { else: body_2, block: body_3 },
                {},
            )
            .w('" target="')
            .f(ctx.get(["target"], false), ctx, "h")
            .w('">')
            .x(ctx.get(["iconClass"], false), ctx, { block: body_4 }, {})
            .x(ctx.get(["label"], false), ctx, { block: body_5 }, {})
            .w("</a></li>");
    }
    body_1.__dustBody = !0;
    function body_2(chk, ctx) {
        return chk.w("#");
    }
    body_2.__dustBody = !0;
    function body_3(chk, ctx) {
        return chk.f(ctx.get(["href"], false), ctx, "h");
    }
    body_3.__dustBody = !0;
    function body_4(chk, ctx) {
        return chk
            .w('<i class="nav-icon ')
            .f(ctx.get(["iconClass"], false), ctx, "h")
            .w('" aria-hidden="true"></i>');
    }
    body_4.__dustBody = !0;
    function body_5(chk, ctx) {
        return chk
            .w('<span class="nav-label">')
            .f(ctx.get(["label"], false), ctx, "h", ["s"])
            .w("</span>");
    }
    body_5.__dustBody = !0;
    function body_6(chk, ctx) {
        return chk.w('<li role="separator" class="divider"></li>');
    }
    body_6.__dustBody = !0;
    return body_0;
})(dust);
(function (dust) {
    dust.register("navbar", body_0);
    function body_0(chk, ctx) {
        return chk.x(
            ctx.getPath(false, ["template", "options", "navbar", "enabled"]),
            ctx,
            { block: body_1 },
            {},
        );
    }
    body_0.__dustBody = !0;
    function body_1(chk, ctx) {
        return chk
            .w('<nav class="navbar ')
            .x(
                ctx.getPath(false, ["template", "options", "navbar", "dark"]),
                ctx,
                { block: body_2 },
                {},
            )
            .w('"><div class="navbar-inner ')
            .x(ctx.get(["boxed"], false), ctx, { block: body_3 }, {})
            .w('"><div class="navbar-brand">')
            .x(
                ctx.getPath(false, ["template", "options", "logo", "dark"]),
                ctx,
                { block: body_4 },
                {},
            )
            .w('<span class="navbar-title"><a href="')
            .f(
                ctx.getPath(false, ["template", "options", "title", "href"]),
                ctx,
                "h",
            )
            .w('">')
            .f(
                ctx.getPath(false, ["template", "options", "title", "label"]),
                ctx,
                "h",
            )
            .w("</a></span></div>")
            .h(
                "gt",
                ctx,
                { block: body_7 },
                {
                    key: ctx.getPath(false, [
                        "template",
                        "options",
                        "navbar",
                        "menu",
                        "length",
                    ]),
                    value: 0,
                },
                "h",
            )
            .w("</div></nav>")
            .x(
                ctx.getPath(false, ["template", "options", "navbar", "fixed"]),
                ctx,
                { block: body_16 },
                {},
            )
            .w('<div class="nav-overlay"></div>');
    }
    body_1.__dustBody = !0;
    function body_2(chk, ctx) {
        return chk.w("dark");
    }
    body_2.__dustBody = !0;
    function body_3(chk, ctx) {
        return chk.w("container container-boxed");
    }
    body_3.__dustBody = !0;
    function body_4(chk, ctx) {
        return chk.x(
            ctx.getPath(false, ["template", "options", "navbar", "dark"]),
            ctx,
            { else: body_5, block: body_6 },
            {},
        );
    }
    body_4.__dustBody = !0;
    function body_5(chk, ctx) {
        return chk
            .w('<img src="')
            .f(
                ctx.getPath(false, ["template", "options", "logo", "dark"]),
                ctx,
                "h",
            )
            .w('" alt="logo" class="navbar-logo" />');
    }
    body_5.__dustBody = !0;
    function body_6(chk, ctx) {
        return chk
            .w('<img src="')
            .f(
                ctx.getPath(false, ["template", "options", "logo", "light"]),
                ctx,
                "h",
            )
            .w('" alt="logo" class="navbar-logo" />');
    }
    body_6.__dustBody = !0;
    function body_7(chk, ctx) {
        return chk
            .w(
                '<div class="navbar-menu-btn" tabindex="0"><i class="fas fa-lg fa-bars trans-all-ease"></i><i class="fas fa-md fa-times trans-all-ease"></i></div><div class="navbar-menu"><ul class="navbar-list">',
            )
            .s(
                ctx.getPath(false, ["template", "options", "navbar", "menu"]),
                ctx,
                { block: body_8 },
                {},
            )
            .w("</ul></div>");
    }
    body_7.__dustBody = !0;
    function body_8(chk, ctx) {
        return chk.x(
            ctx.get(["items"], false),
            ctx,
            { else: body_9, block: body_10 },
            {},
        );
    }
    body_8.__dustBody = !0;
    function body_9(chk, ctx) {
        return chk.p("navitem", ctx, ctx.rebase(ctx.getPath(true, [])), {});
    }
    body_9.__dustBody = !0;
    function body_10(chk, ctx) {
        return chk
            .w('<li class="dropdown"><a href="')
            .x(
                ctx.get(["href"], false),
                ctx,
                { else: body_11, block: body_12 },
                {},
            )
            .w(
                '" role="button" aria-haspopup="true" aria-expanded="false"><i class="nav-icon ',
            )
            .f(ctx.get(["iconClass"], false), ctx, "h")
            .w('" aria-hidden="true"></i>')
            .x(ctx.get(["label"], false), ctx, { block: body_13 }, {})
            .x(ctx.get(["chevron"], false), ctx, { block: body_14 }, {})
            .w("</a><ul>")
            .s(ctx.get(["items"], false), ctx, { block: body_15 }, {})
            .w("</ul></li>");
    }
    body_10.__dustBody = !0;
    function body_11(chk, ctx) {
        return chk.w("#");
    }
    body_11.__dustBody = !0;
    function body_12(chk, ctx) {
        return chk.f(ctx.get(["href"], false), ctx, "h");
    }
    body_12.__dustBody = !0;
    function body_13(chk, ctx) {
        return chk
            .w('<span class="nav-label">')
            .f(ctx.get(["label"], false), ctx, "h")
            .w("</span>");
    }
    body_13.__dustBody = !0;
    function body_14(chk, ctx) {
        return chk.w('<i class="nav-arrow fas fa-sm fa-angle-down"></i>');
    }
    body_14.__dustBody = !0;
    function body_15(chk, ctx) {
        return chk
            .w(" ")
            .p("navitem", ctx, ctx.rebase(ctx.getPath(true, [])), {})
            .w(" ");
    }
    body_15.__dustBody = !0;
    function body_16(chk, ctx) {
        return chk.w('<div class="nav-spacer"></div>');
    }
    body_16.__dustBody = !0;
    return body_0;
})(dust);
(function (dust) {
    dust.register("enums", body_0);
    function body_0(chk, ctx) {
        return chk.x(ctx.get(["$members"], false), ctx, { block: body_1 }, {});
    }
    body_0.__dustBody = !0;
    function body_1(chk, ctx) {
        return chk.h(
            "eq",
            ctx,
            { else: body_2, block: body_4 },
            {
                key: ctx.getPath(false, [
                    "template",
                    "options",
                    "symbols",
                    "enums",
                ]),
                value: "table",
            },
            "h",
        );
    }
    body_1.__dustBody = !0;
    function body_2(chk, ctx) {
        return chk
            .w(
                '<div class="space-top-sm space-bottom-xs fw-bold">Enumeration</div><ul class="param-list">',
            )
            .s(ctx.get(["$members"], false), ctx, { block: body_3 }, {})
            .w("</ul>");
    }
    body_2.__dustBody = !0;
    function body_3(chk, ctx) {
        return chk
            .w(
                '<li><div class="param-meta clearfix"><span class="inline-block space-right-sm"><code>',
            )
            .f(ctx.getPath(true, []), ctx, "h", ["$longname", "s", "$dot_prop"])
            .w("</code>&nbsp;:&nbsp;<code>")
            .f(ctx.getPath(true, []), ctx, "h", ["s", "$type"])
            .w(
                '</code></span><span class="param-info-box"><span class="param-info value">Value:&nbsp;</span><code>',
            )
            .f(ctx.getPath(true, []), ctx, "h", ["$val"])
            .w('</code></span></div><div class="param-desc">')
            .f(ctx.getPath(true, []), ctx, "h", ["s", "$desc"])
            .w("</div></li>");
    }
    body_3.__dustBody = !0;
    function body_4(chk, ctx) {
        return chk
            .w(
                '<table class="table table-striped table-bordered"><thead><tr><th>Enumeration</th><th>Type</th><th>Value</th><th>Description</th></tr></thead><tbody>',
            )
            .s(ctx.get(["$members"], false), ctx, { block: body_5 }, {})
            .w("</tbody></table>");
    }
    body_4.__dustBody = !0;
    function body_5(chk, ctx) {
        return chk
            .w("<tr><td><code>")
            .f(ctx.getPath(true, []), ctx, "h", ["$longname", "s", "$dot_prop"])
            .w("</code></td><td><code>")
            .f(ctx.getPath(true, []), ctx, "h", ["s", "$type"])
            .w("</code></td><td><code>")
            .f(ctx.getPath(true, []), ctx, "h", ["$val"])
            .w("</code></td><td>")
            .f(ctx.getPath(true, []), ctx, "h", ["s", "$desc"])
            .w("</td></tr>");
    }
    body_5.__dustBody = !0;
    return body_0;
})(dust);
/*!
 * Docma (Web) Core
 * https://github.com/Prozi/docma
 * @license MIT
 */
var DocmaWeb = (function () {
    "use strict";

    var Utils = {};
    function getStr(e) {
        return "string" == typeof e ? e.trim() : "";
    }
    function bracket(e) {
        return /^[a-z$_][a-z\d$_]*$/i.test(e) ? "." + e : '["' + e + '"]';
    }
    function fixBracket(r) {
        return r.replace(/(.*?)\."([^"]+)"\]?$/, function (e, t, n) {
            return n ? t + bracket(n) : r;
        });
    }
    function cleanName(e) {
        return fixBracket(
            (e = getStr(e)
                .replace(/([^>]+>)?~?(.*)/, "$2")
                .replace(/^"[^"]+"\.?~?([^"]+)$/, "$1")
                .replace(/^(module\.)?exports\./, "")
                .replace(/^module:/, "")),
        );
    }
    function getMetaCodeName(e) {
        return cleanName(Utils.notate(e, "meta.code.name") || "");
    }
    function identity(e) {
        return e;
    }
    function hasConstructorTag(e) {
        return /\*\s+@construct(s|or)\b/.test(e.comment);
    }
    (Utils.type = function (e) {
        return Object.prototype.toString
            .call(e)
            .match(/\s(\w+)/i)[1]
            .toLowerCase();
    }),
        (Utils.notate = function (e, t) {
            if ("object" == typeof e) {
                var t = Array.isArray(t) ? t : t.split("."),
                    n = t[0];
                if (n)
                    return (
                        (e = e[n]),
                        1 < t.length ? (t.shift(), Utils.notate(e, t)) : e
                    );
            }
        }),
        (Utils.getName = function (e) {
            if (e.alias) {
                var t = getMetaCodeName(e);
                if (t) return t.replace(/.*?[#.~:](\w+)$/i, "$1");
            }
            return e.name;
        }),
        (Utils.getLongName = function (e) {
            var t = cleanName(e.longname),
                n = getMetaCodeName(e) || t,
                r = e.memberof || "",
                r = /^".*"$/.test(r) ? "" : cleanName(r);
            return (e.name === r && Utils.isConstructor(e)) ||
                ((n = e.alias ? n : t), !r) ||
                ((t = new RegExp("^" + r + "[#.~:]")),
                (e = "instance" === e.scope ? "#" : "."),
                t.test(n))
                ? n
                : r + e + n;
        }),
        (Utils.getFullName = Utils.getLongName),
        (Utils.getCodeName = function (e) {
            return getMetaCodeName(e) || Utils.getLongName(e);
        }),
        (Utils.getSymbolByName = function (e, t) {
            var n, r, i;
            if ("object" === Utils.type(e)) {
                for (var l = Object.keys(e), o = 0; o < l.length; o++)
                    if (
                        ((r = e[l[o]].documentation),
                        (i = Utils.getSymbolByName(r, t)))
                    )
                        return i;
            } else
                for (r = e, o = 0; o < r.length; o++) {
                    if (
                        (n = r[o]).name === t ||
                        n.longname === t ||
                        Utils.getFullName(n) === t
                    )
                        return n;
                    if (
                        n.$members &&
                        (i = Utils.getSymbolByName(n.$members, t))
                    )
                        return i;
                }
            return null;
        }),
        (Utils.getLevels = function (e) {
            e = ("string" == typeof e ? e : e.$longname) || "";
            return (e = cleanName(e))
                ? ((e || "").split(/[.#~]/) || []).length
                : 0;
        }),
        (Utils.getParentName = function (e) {
            var t;
            if ("string" != typeof e) {
                if (e.memberof && !1 === /^".*"$/.test(e.memberof))
                    return cleanName(e.memberof);
                t = cleanName(e.$longname);
            } else t = cleanName(e);
            return t && /[.#~]/g.test(t) ? t.replace(/[.#~][^.#~]*$/, "") : "";
        }),
        (Utils.getParent = function (e, t) {
            var t = "string" == typeof t ? Utils.getSymbolByName(e, t) : t;
            return (t = t && Utils.getParentName(t))
                ? Utils.getSymbolByName(e, t)
                : null;
        }),
        (Utils.isDeprecated = function (e) {
            return e.deprecated;
        }),
        (Utils.isGlobal = function (e) {
            return "global" === e.scope;
        }),
        (Utils.isNamespace = function (e) {
            return "namespace" === e.kind;
        }),
        (Utils.isModule = function (e) {
            return "module" === e.kind;
        }),
        (Utils.isMixin = function (e) {
            return "mixin" === e.kind;
        }),
        (Utils.isClass = function (e) {
            return (
                "class" === e.kind &&
                "MethodDefinition" !== Utils.notate(e, "meta.code.type") &&
                !hasConstructorTag(e)
            );
        }),
        (Utils.isConstant = function (e) {
            return "constant" === e.kind;
        }),
        (Utils.isConstructor = function (e) {
            return (
                "class" === e.kind &&
                ("MethodDefinition" === Utils.notate(e, "meta.code.type") ||
                    hasConstructorTag(e))
            );
        }),
        (Utils.isStaticMember = function (e) {
            return "static" === e.scope;
        }),
        (Utils.isStatic = Utils.isStaticMember),
        (Utils.isInner = function (e) {
            return "inner" === e.scope;
        }),
        (Utils.isInstanceMember = function (e) {
            return "instance" === e.scope;
        }),
        (Utils.isInterface = function (e) {
            return "interface" === e.scope;
        }),
        (Utils.isMethod = function (e) {
            var t = Utils.notate(e, "meta.code.type");
            return (
                "function" === e.kind ||
                "FunctionExpression" === t ||
                "FunctionDeclaration" === t
            );
        }),
        (Utils.isFunction = Utils.isMethod),
        (Utils.isInstanceMethod = function (e) {
            return Utils.isInstanceMember(e) && Utils.isMethod(e);
        }),
        (Utils.isStaticMethod = function (e) {
            return Utils.isStaticMember(e) && Utils.isMethod(e);
        }),
        (Utils.isProperty = function (e) {
            return "member" === e.kind && !Utils.isMethod(e);
        }),
        (Utils.isInstanceProperty = function (e) {
            return Utils.isInstanceMember(e) && Utils.isProperty(e);
        }),
        (Utils.isStaticProperty = function (e) {
            return Utils.isStaticMember(e) && Utils.isProperty(e);
        }),
        (Utils.isTypeDef = function (e) {
            return "typedef" === e.kind;
        }),
        (Utils.isCustomType = Utils.isTypeDef),
        (Utils.isCallback = function (e) {
            var t = (e.type || {}).names || [];
            return (
                "typedef" === e.kind &&
                0 <= (e.comment || "").indexOf("@callback " + e.longname) &&
                1 === t.length &&
                "function" === t[0]
            );
        }),
        (Utils.isEnum = function (e) {
            return Boolean(e.isEnum);
        }),
        (Utils.isEvent = function (e) {
            return "event" === e.kind;
        }),
        (Utils.isExternal = function (e) {
            return "external" === e.kind;
        }),
        (Utils.isGenerator = function (e) {
            return e.generator && "function" === e.kind;
        }),
        (Utils.isReadOnly = function (e) {
            return e.readonly;
        }),
        (Utils.isPublic = function (e) {
            return "string" != typeof e.access || "public" === e.access;
        }),
        (Utils.isPrivate = function (e) {
            return "private" === e.access;
        }),
        (Utils.isPackagePrivate = function (e) {
            return "package" === e.access;
        }),
        (Utils.isProtected = function (e) {
            return "protected" === e.access;
        }),
        (Utils.isUndocumented = function (e) {
            return !e.comments;
        }),
        (Utils.hasDescription = function (e) {
            return Boolean(getStr(e.classdesc) || getStr(e.description));
        }),
        (Utils.trimLeft = function (e) {
            return e.replace(/^[\s\n\r\-—]*/, "");
        }),
        (Utils.trimNewLines = function (e) {
            return e.replace(/^[\r\n]+|[\r\n]+$/, "");
        }),
        (Utils.parseTicks = function (e) {
            return "string" != typeof e
                ? ""
                : e
                      .replace(
                          /(```\s*)([\s\S]*?)(\s*```)/g,
                          function (e, t, n) {
                              return Utils.normalizeTabs(
                                  Utils._wrapCode(n, !0, !0).replace(
                                      /`/g,
                                      "&#x60;",
                                  ),
                              );
                          },
                      )
                      .replace(/(`)(.*?)(`)/g, function (e, t, n) {
                          return Utils._wrapCode(n, !0);
                      });
        }),
        (Utils.parseNewLines = function (e, n) {
            return (
                (n = n || {}),
                Utils._tokenize(e, function (e, t) {
                    return t ||
                        ((t = e.split(/[\r\n]{2,}/)).length <= 1 &&
                            n.keepIfSingle)
                        ? e
                        : t
                              .map(function (e) {
                                  return "<p>" + e + "</p>";
                              })
                              .join("");
                }).join("")
            );
        }),
        (Utils.parseLinks = function (e, i) {
            if ("string" != typeof e) return "";
            i = i || {};
            e = e.replace(/\{@link +([^}]*?)\}/g, function (e, t) {
                var n,
                    r,
                    t = t.split("|"),
                    t =
                        (1 === t.length
                            ? (n = r = t[0].trim())
                            : ((n = t[0].trim()), (r = t[1].trim())),
                        !1 === /[/?&=]/.test(n) &&
                            "#" !== n[0] &&
                            (n = "#" + n),
                        i.target
                            ? ' target="' +
                              i.target +
                              '" rel="noopener noreferrer"'
                            : "");
                return '<a href="' + n + '"' + t + ">" + r + "</a>";
            });
            return Utils.parseTicks(e);
        }),
        (Utils.parse = function (e, t) {
            return (
                (t = t || {}),
                (e = Utils.trimLeft(e)),
                (e = Utils.parseNewLines(e, t)),
                (e = Utils.parseTicks(e)),
                Utils.parseLinks(e, t)
            );
        }),
        (Utils.normalizeTabs = function (e) {
            var n, t, r;
            return "string" != typeof e
                ? ""
                : ((t = e.match(/^\s*/gm)),
                  (n = 1 / 0),
                  t.forEach(function (e, t) {
                      (e = e.replace(/\t/g, "  ")),
                          0 < t && (n = Math.min(e.length, n));
                  }),
                  n !== 1 / 0 &&
                      ((t = new RegExp("^\\s{" + n + "}", "g")),
                      (e = e.replace(t, ""))),
                  (e = e.replace(/^\s*/, "")).replace(
                      /([\r\n]+)(\s+)/gm,
                      function (e, t, n) {
                          return (
                              (r = n.replace(/\t/g, "  ")),
                              t +
                                  new Array(r.length - (r.length % 2) + 1).join(
                                      " ",
                                  )
                          );
                      },
                  ));
        }),
        (Utils.getKeywords = function (e) {
            var t;
            return (
                "string" == typeof e
                    ? e
                    : ((t =
                          Utils.getFullName(e) +
                          " " +
                          e.longname +
                          " " +
                          e.name +
                          " " +
                          (e.alias || "") +
                          " " +
                          (e.memberOf || "") +
                          " " +
                          (e.$kind || "") +
                          " " +
                          (e.scope || "") +
                          " " +
                          (e.classdesc || "") +
                          " " +
                          (e.description || "") +
                          " " +
                          (e.filename || "") +
                          " " +
                          (e.readonly ? "readonly" : "") +
                          (e.isEnum ? "enum" : "")),
                      Utils.isConstructor(e) && (t += " constructor"),
                      Utils.isMethod(e) && (t += " method"),
                      Utils.isProperty(e) && (t += " property"),
                      t.replace(/[><"'`\n\r]/g, ""))
            ).toLowerCase();
        }),
        (Utils.getCodeFileInfo = function (e) {
            return {
                filename: Utils.notate(e, "meta.filename"),
                lineno: Utils.notate(e, "meta.lineno"),
                path: Utils.notate(e, "meta.path"),
            };
        }),
        (Utils.getSymbolLink = function (e, t) {
            return "string" != typeof t
                ? t.$docmaLink
                : (e = Utils.getSymbolByName(e, t))
                ? e.$docmaLink
                : "";
        });
    var reEndBrackets = /\[\]$/,
        reTypeParts =
            /^([^<]+?)(?:\.)?(?:<\(([^>)]+)\)>)?(?:<([^>]+)>)?(\[\])?$/;
    function _link(e, t, n) {
        var r,
            i = reEndBrackets.test(t) ? "[]" : "",
            l = (t || "").replace(reEndBrackets, ""),
            n = n || {},
            o = "";
        return (
            "internal" !== n.linkType &&
                (r = Utils._getTypeExternalLink(l)) &&
                (o = ' target="_blank" rel="noopener noreferrer"'),
            (t = (r =
                r || "external" === n.linkType ? r : Utils.getSymbolLink(e, l))
                ? '<a href="' +
                  r +
                  '"' +
                  o +
                  ">" +
                  (n.displayText || l) +
                  i +
                  "</a>"
                : t)
        );
    }
    function serializer(r) {
        var i = [],
            l = [];
        return function (e, t) {
            var n;
            return 2e3 < i.length
                ? "[Too Big Object]"
                : (0 < i.length
                      ? (~(n = i.indexOf(this))
                            ? (i.splice(n + 1), l.splice(n, 1 / 0, e))
                            : (i.push(this), l.push(e)),
                        0 <= i.indexOf(t) &&
                            (t =
                                i[0] === t
                                    ? "[Circular ~]"
                                    : "[Circular ~." +
                                      l.slice(0, i.indexOf(t)).join(".") +
                                      "]"))
                      : i.push(t),
                  r ? r.call(this, e, t) : t);
        };
    }
    function decodeHash(e) {
        return decodeURIComponent(e).replace(/^#/, "");
    }
    (Utils._parseAnchorLinks = function (t, e, n) {
        var r,
            i,
            e = e.match(reTypeParts);
        return e && e[1]
            ? ((r = e[4] || ""),
              (i =
                  (i =
                      (i = e[2] || e[3] || "") &&
                      i
                          .split(",")
                          .map(function (e) {
                              return e
                                  .trim()
                                  .split("|")
                                  .map(function (e) {
                                      return _link(t, e, n);
                                  })
                                  .join('<span class="code-delim">|</span>');
                          })
                          .join('<span class="code-delim">, </span>')) &&
                  "&lt;" + i + "&gt;"),
              _link(t, e[1], n) + i + r)
            : "";
    }),
        (Utils.getTypes = function (t, e, n) {
            var r = n || {},
                n = (n =
                    "class" === e.kind
                        ? ["class"]
                        : Utils.notate(e, "type.names") || [])
                    .map(function (e) {
                        return (e = r.links
                            ? Utils._parseAnchorLinks(t, e, {
                                  linkType: r.links,
                              })
                            : e);
                    })
                    .join('<span class="code-delim">|</span>');
            return e.isEnum ? "enum&lt;" + n + "&gt;" : n;
        }),
        (Utils.getReturnTypes = function (n, e, t) {
            var r,
                e = e.returns;
            return Array.isArray(e) &&
                ((r = t || {}),
                0 <
                    (t = e.reduce(function (e, t) {
                        t = Utils.notate(t, "type.names") || [];
                        return (
                            r.links &&
                                (t = t.map(function (e) {
                                    return Utils._parseAnchorLinks(n, e, {
                                        linkType: r.links,
                                    });
                                })),
                            e.concat(t)
                        );
                    }, [])).length)
                ? t.join('<span class="code-delim">|</span>')
                : "void";
        }),
        (Utils.getCodeTags = function (n, e, t) {
            var r = t || {};
            return e
                .map(function (e) {
                    var t;
                    return r.links
                        ? ((t = Utils._parseAnchorLinks(n, e, {
                              linkType: r.links,
                          })),
                          Utils._wrapCode(t, !1))
                        : Utils._wrapCode(e, !0);
                })
                .join(r.demileter || ",");
        }),
        (Utils.getFormattedTypeList = function (n, e, t) {
            var r, i, l, o, a;
            return Array.isArray(e) && 0 !== e.length
                ? ((i =
                      '<span class="code-delim">' +
                      ((r = t || {}).delimeter || "|") +
                      "</span>"),
                  (l = "boolean" != typeof r.descriptions || r.descriptions),
                  (o = r.descDelimeter || "&nbsp;&nbsp;—&nbsp;&nbsp;"),
                  (a = ""),
                  1 <
                  (t = e.map(function (e) {
                      return (
                          l &&
                              (a =
                                  (a = Utils.parse(e.description || "", {
                                      keepIfSingle: !0,
                                  })) && o + a),
                          e.type
                              ? (e.type.names || [])
                                    .map(function (e) {
                                        var t;
                                        return r.links
                                            ? ((t = Utils._parseAnchorLinks(
                                                  n,
                                                  e,
                                                  { linkType: r.links },
                                              )),
                                              Utils._wrapCode(t, !1))
                                            : Utils._wrapCode(e, !0);
                                    })
                                    .join(i) + a
                              : a
                              ? "— " + a
                              : ""
                      );
                  })).length
                      ? "<ul><li>" + t.join("</li><li>") + "</li></ul>"
                      : t)
                : "";
        }),
        (Utils.getEmittedEvents = function (t, e, n) {
            var r, i;
            return e && 0 !== e.length
                ? ((n = (r = n || {}).delimeter || ", "),
                  (e || [])
                      .map(function (e) {
                          return (
                              (i = e.split(/\s*[\s-—]\s*/g)),
                              (i = (i[0] || "").trim()),
                              r.links
                                  ? ((e = Utils._parseAnchorLinks(t, i, {
                                        linkType: r.links,
                                    })),
                                    Utils._wrapCode(e, !1))
                                  : Utils._wrapCode(i, !0)
                          );
                      })
                      .join(n))
                : "";
        }),
        (Utils._find = function (e, t) {
            if (!e || !t) return null;
            for (var n, r = null, i = 0; i < e.length; i++)
                if ((n = e[i]) && "object" == typeof n) {
                    for (var l in t)
                        if (void 0 !== t[l] && t.hasOwnProperty(l)) {
                            if (t[l] !== n[l]) {
                                r = null;
                                break;
                            }
                            r = n;
                        }
                    if (r) break;
                }
            return r;
        }),
        (Utils._assign = function (e, t, n) {
            for (var r in ((e = e || {}), t))
                t.hasOwnProperty(r) &&
                    (n
                        ? Object.defineProperty(e, r, {
                              enumerable: !0,
                              value: t[r],
                          })
                        : (e[r] = t[r]));
            return e;
        }),
        (Utils._values = function (e) {
            if (Array.isArray(e)) return e;
            var t,
                n = [];
            for (t in e) e.hasOwnProperty(t) && n.push(e[t]);
            return n;
        }),
        (Utils._wrapCode = function (e, t, n) {
            return "string" != typeof e
                ? ""
                : ((e =
                      "<code>" +
                      (e =
                          void 0 !== t && !0 !== t
                              ? e
                              : e.replace(/</g, "&lt;").replace(/>/g, "&gt;")) +
                      "</code>"),
                  n ? "<pre>" + e + "</pre>" : e);
        }),
        (Utils._tokenize = function (e, t) {
            "function" != typeof t && (t = identity);
            if (e.indexOf("```") < 0) return [t(e, !1)];
            for (
                var n = "```".length, r = "", i = "", l = [], o = !1, a = 0;
                a < e.length;
                a++
            )
                (r += e[a]),
                    (i += e[a]),
                    "```" === (r = r.length > n ? r.slice(-n) : r) &&
                        (i = (o = !o)
                            ? (l.push(t(i.slice(0, -n), !1)), r)
                            : (l.push(t(i, !0)), ""));
            return l;
        }),
        (Utils._ensureSlash = function (e, t, n) {
            return t
                ? (e && "/" !== t.slice(0, 1) && (t = "/" + t),
                  n && "/" !== t.slice(-1) && (t += "/"),
                  t)
                : e || n
                ? "/"
                : "";
        }),
        (Utils._safeStringify = function (t, e, n) {
            try {
                return JSON.stringify(t, serializer(e), n);
            } catch (e) {
                return String(t);
            }
        }),
        (Utils.DOM = {});
    var ATTR_BODY_STYLE = "data-body-style",
        _builtinURLs =
            ((Utils.DOM.getOffset = function (e) {
                var t,
                    e = "object" == typeof e ? e : document.getElementById(e);
                return e &&
                    ((t = e.getBoundingClientRect()).width ||
                        t.height ||
                        e.getClientRects().length)
                    ? ((e = document.documentElement),
                      {
                          top: t.top + window.pageYOffset - e.clientTop,
                          left: t.left + window.pageXOffset - e.clientLeft,
                      })
                    : void 0;
            }),
            (Utils.DOM.scrollTo = function (e) {
                var t = document.documentElement || document.body;
                (e = decodeHash(e || window.location.hash || ""))
                    ? (e = document.getElementById(e)) &&
                      (e = Utils.DOM.getOffset(e)) &&
                      (t.scrollTop = e.top)
                    : (t.scrollTop = 0);
            }),
            (Utils.DOM._createChild = function (e, t, n) {
                n = n || {};
                var r = document.createElement(t || "div");
                return (
                    Object.keys(n).forEach(function (e) {
                        r[e] = n[e];
                    }),
                    e.appendChild(r),
                    r
                );
            }),
            (Utils.DOM._removePrevBodyStyles = function () {
                for (
                    var e = document
                        .getElementsByTagName("head")[0]
                        .querySelectorAll("[" + ATTR_BODY_STYLE + "]");
                    0 < e.length;

                )
                    e[0].parentNode.removeChild(e[0]);
            }),
            (Utils.DOM._moveBodyStylesToHead = function () {
                for (
                    var e,
                        t = document.getElementsByTagName("head")[0],
                        n = document.body.getElementsByTagName("style"),
                        r = 0;
                    r < n.length;
                    r++
                )
                    (e = n[r]).parentNode.removeChild(e),
                        e.setAttribute(ATTR_BODY_STYLE, ""),
                        t.appendChild(e);
            }),
            {
                globals:
                    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/",
                statements:
                    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/",
                operators:
                    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/",
                functions:
                    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/",
                web: "https://developer.mozilla.org/en-US/docs/Web/API/",
            }),
        _builtins = {
            globals: [
                "Infinity",
                "NaN",
                "undefined",
                "null",
                "Object",
                "Function",
                "function",
                "Boolean",
                "boolean",
                "Symbol",
                "Error",
                "EvalError",
                "InternalError",
                "RangeError",
                "ReferenceError",
                "SyntaxError",
                "TypeError",
                "URIError",
                "Number",
                "number",
                "Math",
                "Date",
                "String",
                "string",
                "RegExp",
                "Array",
                "Int8Array",
                "Uint8Array",
                "Uint8ClampedArray",
                "Int16Array",
                "Uint16Array",
                "Int32Array",
                "Uint32Array",
                "Float32Array",
                "Float64Array",
                "Map",
                "Set",
                "WeakMap",
                "WeakSet",
                "ArrayBuffer",
                "DataView",
                "JSON",
                "Promise",
                "Generator",
                "GeneratorFunction",
                "Reflect",
                "Proxy",
                "TypedArray",
                "Intl",
                "Intl.Collator",
                "Intl.DateTimeFormat",
                "Intl.NumberFormat",
                "WebAssembly",
                "WebAssembly.Module",
                "WebAssembly.Instance",
                "WebAssembly.Memory",
                "WebAssembly.Table",
                "WebAssembly.CompileError",
                "WebAssembly.LinkError",
                "WebAssembly.RuntimeError",
            ],
            statements: [
                "function",
                "function*",
                "async function",
                "class",
                "debugger",
            ],
            operators: ["void", "super", "this"],
            functions: ["arguments"],
            web: [
                "AbstractWorker",
                "AnalyserNode",
                "AudioBuffer",
                "AudioContext",
                "AudioListener",
                "AudioNode",
                "BaseAudioContext",
                "BeforeUnloadEvent",
                "Blob",
                "BlobEvent",
                "BufferSource",
                "ByteString",
                "CSSMediaRule",
                "CSSPageRule",
                "CSSPrimitiveValue",
                "CSSRule",
                "CSSRuleList",
                "CSSStyleDeclaration",
                "CSSStyleRule",
                "CSSStyleSheet",
                "CSSSupportsRule",
                "CSSValue",
                "CSSValueList",
                "CloseEvent",
                "CompositionEvent",
                "Console",
                "Coordinates",
                "Crypto",
                "CryptoKey",
                "CustomEvent",
                "DOMException",
                "DOMImplementation",
                "Document",
                "DocumentFragment",
                "DocumentType",
                "DoubleRange",
                "DragEvent",
                "Element",
                "ErrorEvent",
                "Event",
                "EventListener",
                "EventSource",
                "EventTarget",
                "File",
                "FileList",
                "FileReader",
                "FileReaderSync",
                "FormData",
                "Geolocation",
                "HTMLAnchorElement",
                "HTMLAreaElement",
                "HTMLAudioElement",
                "HTMLBRElement",
                "HTMLBaseElement",
                "HTMLBodyElement",
                "HTMLButtonElement",
                "HTMLCanvasElement",
                "HTMLCollection",
                "HTMLDListElement",
                "HTMLDataElement",
                "HTMLDataListElement",
                "HTMLDetailsElement",
                "HTMLDivElement",
                "HTMLDocument",
                "HTMLElement",
                "HTMLEmbedElement",
                "HTMLFieldSetElement",
                "HTMLFormControlsCollection",
                "HTMLFormElement",
                "HTMLHRElement",
                "HTMLHeadElement",
                "HTMLHeadingElement",
                "HTMLHtmlElement",
                "HTMLIFrameElement",
                "HTMLImageElement",
                "HTMLInputElement",
                "HTMLKeygenElement",
                "HTMLLIElement",
                "HTMLLabelElement",
                "HTMLLegendElement",
                "HTMLLinkElement",
                "HTMLMapElement",
                "HTMLMediaElement",
                "HTMLMetaElement",
                "HTMLMeterElement",
                "HTMLModElement",
                "HTMLOListElement",
                "HTMLObjectElement",
                "HTMLOptGroupElement",
                "HTMLOptionElement",
                "HTMLOptionsCollection",
                "HTMLOutputElement",
                "HTMLParagraphElement",
                "HTMLParamElement",
                "HTMLPreElement",
                "HTMLProgressElement",
                "HTMLQuoteElement",
                "HTMLScriptElement",
                "HTMLSelectElement",
                "HTMLSlotElement",
                "HTMLSourceElement",
                "HTMLSpanElement",
                "HTMLStyleElement",
                "HTMLTableCaptionElement",
                "HTMLTableCellElement",
                "HTMLTableColElement",
                "HTMLTableDataCellElement",
                "HTMLTableElement",
                "HTMLTableHeaderCellElement",
                "HTMLTableRowElement",
                "HTMLTableSectionElement",
                "HTMLTemplateElement",
                "HTMLTextAreaElement",
                "HTMLTimeElement",
                "HTMLTitleElement",
                "HTMLTrackElement",
                "HTMLUListElement",
                "HTMLUnknownElement",
                "HTMLVideoElement",
                "HashChangeEvent",
                "History",
                "ImageData",
                "InputEvent",
                "KeyboardEvent",
                "LinkStyle",
                "Location",
                "LongRange",
                "MediaDevices",
                "MediaDeviceInfo",
                "MediaError",
                "MediaRecorder",
                "MediaStream",
                "MessageChannel",
                "MessageEvent",
                "MessagePort",
                "MouseEvent",
                "MutationObserver",
                "MutationRecord",
                "NamedNodeMap",
                "Navigator",
                "NavigatorGeolocation",
                "Node",
                "NodeIterator",
                "NodeList",
                "NonDocumentTypeChildNode",
                "Notification",
                "PageTransitionEvent",
                "PointerEvent",
                "PopStateEvent",
                "Position",
                "PositionError",
                "PositionOptions",
                "ProgressEvent",
                "PromiseRejectionEvent",
                "RTCCertificate",
                "RTCConfiguration",
                "RTCDTMFSender",
                "RTCDTMFToneChangeEvent",
                "RTCDataChannel",
                "RTCPeerConnection",
                "RTCPeerConnection",
                "RTCRtpCodecParameters",
                "RTCRtpContributingSource",
                "RTCRtpReceiver",
                "RTCRtpSender",
                "RTCRtpSynchronizationSource",
                "RTCRtpTransceiver",
                "RTCRtpTransceiverDirection",
                "RTCRtpTransceiverInit",
                "RTCStatsReport",
                "RadioNodeList",
                "RandomSource",
                "Range",
                "RenderingContext",
                "SVGAnimateElement",
                "SVGAnimateMotionElement",
                "SVGAnimateTransformElement",
                "SVGAnimationElement",
                "SVGCircleElement",
                "SVGClipPathElement",
                "SVGCursorElement",
                "SVGElement",
                "SVGEllipseElement",
                "SVGEvent",
                "SVGFilterElement",
                "SVGGeometryElement",
                "SVGGradientElement",
                "SVGGraphicsElement",
                "SVGImageElement",
                "SVGLineElement",
                "SVGLinearGradientElement",
                "SVGMPathElement",
                "SVGMaskElement",
                "SVGMetadataElement",
                "SVGPathElement",
                "SVGPatternElement",
                "SVGPolygonElement",
                "SVGPolylineElement",
                "SVGRadialGradientElement",
                "SVGRect",
                "SVGRectElement",
                "SVGSVGElement",
                "SVGScriptElement",
                "SVGSetElement",
                "SVGStopElement",
                "SVGStyleElement",
                "SVGSwitchElement",
                "SVGSymbolElement",
                "SVGTSpanElement",
                "SVGTextContentElement",
                "SVGTextElement",
                "SVGTextPathElement",
                "SVGTextPositioningElement",
                "SVGTitleElement",
                "SVGTransform",
                "SVGTransformList",
                "SVGTransformable",
                "SVGUseElement",
                "SVGViewElement",
                "ShadowRoot",
                "SharedWorker",
                "Storage",
                "StorageEvent",
                "StyleSheet",
                "StyleSheetList",
                "Text",
                "TextMetrics",
                "TimeEvent",
                "TimeRanges",
                "Touch",
                "TouchEvent",
                "TouchList",
                "Transferable",
                "TreeWalker",
                "UIEvent",
                "URL",
                "WebGLActiveInfo",
                "WebGLBuffer",
                "WebGLContextEvent",
                "WebGLFramebuffer",
                "WebGLProgram",
                "WebGLRenderbuffer",
                "WebGLRenderingContext",
                "WebGLShader",
                "WebGLTexture",
                "WebGLUniformLocation",
                "WebGLVertexArrayObject",
                "WebSocket",
                "WheelEvent",
                "Window",
                "Worker",
                "WorkerGlobalScope",
                "WorkerLocation",
                "WorkerNavigator",
                "XMLHttpRequest",
                "XMLHttpRequestEventTarget",
                "XMLSerializer",
                "XPathExpression",
                "XPathResult",
                "XSLTProcessor",
            ],
        },
        _cats = Object.keys(_builtins);
    Utils._getTypeExternalLink = function (e) {
        for (var t, n = 0; n < _cats.length; n++)
            if (((t = _cats[n]), 0 <= _builtins[t].indexOf(e)))
                return _builtinURLs[t] + (e || "").replace(/^([^.]*\.)/, "");
        return "";
    };

    function DocmaWeb(t) {
        (this._ = t || {}),
            (this._.initialLoad = !1),
            (this._.appEntranceRI = null),
            (this._.emitter = new EventEmitter()),
            Object.defineProperty(this, "app", {
                configurable: !1,
                get: function () {
                    return this._.app || null;
                },
            }),
            Object.defineProperty(this, "apis", {
                configurable: !1,
                get: function () {
                    return this._.apis || {};
                },
            }),
            Object.defineProperty(this, "routes", {
                configurable: !1,
                get: function () {
                    return this._.routes || {};
                },
            }),
            Object.defineProperty(this, "template", {
                configurable: !1,
                get: function () {
                    return this._.template || {};
                },
            }),
            Object.defineProperty(this, "location", {
                configurable: !1,
                get: function () {
                    var t = Utils._ensureSlash(
                            !0,
                            window.location.pathname,
                            !0,
                        ),
                        e = Utils._ensureSlash(!0, docma.app.base, !0),
                        o = t;
                    return (
                        t.slice(0, e.length) === e &&
                            (o = t.slice(e.length - 1, t.length)),
                        {
                            host: window.location.host,
                            hostname: window.location.hostname,
                            origin: window.location.origin,
                            port: window.location.port,
                            protocol: (window.location.protocol || "").replace(
                                /:$/,
                                "",
                            ),
                            entrance: Utils._ensureSlash(
                                !0,
                                docma.app.entrance,
                                !1,
                            ),
                            base: e,
                            hash: (window.location.hash || "").replace(
                                /^#/,
                                "",
                            ),
                            query: (window.location.search || "").replace(
                                /^\?/,
                                "",
                            ),
                            href: window.location.href,
                            fullpath: t,
                            pathname: o,
                            path: o + (window.location.search || ""),
                            getQuery: function (t, e) {
                                "?" ===
                                    (e =
                                        void 0 === e
                                            ? window.location.search || ""
                                            : e).slice(0, 1) &&
                                    (e = e.slice(1)),
                                    (t = (t || "").replace(/[[\]]/g, "\\$&"));
                                t = new RegExp(
                                    "&?" + t + "(=([^&#]*)|&|#|$)",
                                ).exec(e);
                                return t && t[2]
                                    ? decodeURIComponent(
                                          t[2].replace(/\+/g, " "),
                                      )
                                    : "";
                            },
                        }
                    );
                },
            }),
            Object.defineProperty(this, "currentRoute", {
                configurable: !1,
                get: function () {
                    return this._.currentRoute || null;
                },
            }),
            Object.defineProperty(this, "documentation", {
                configurable: !1,
                get: function () {
                    return this._.documentation || [];
                },
            }),
            Object.defineProperty(this, "symbols", {
                configurable: !1,
                get: function () {
                    return this._.symbols || [];
                },
            });
    }
    (DocmaWeb.prototype._trigger = function (t, e) {
        this.info("Event:", t, e ? e[0] : ""), this._.emitter.trigger(t, e);
    }),
        (DocmaWeb.Event = {
            Ready: "ready",
            Render: "render",
            Route: "route",
            Navigate: "navigate",
        }),
        (DocmaWeb.prototype.on = function (t, e) {
            return this._.emitter.on.apply(this._.emitter, arguments), docma;
        }),
        (DocmaWeb.prototype.once = function () {
            return this._.emitter.once.apply(this._.emitter, arguments), this;
        }),
        (DocmaWeb.prototype.off = function () {
            return this._.emitter.off.apply(this._.emitter, arguments), this;
        }),
        (DocmaWeb.prototype.addListener = DocmaWeb.prototype.on),
        (DocmaWeb.prototype.addListenerOnce = DocmaWeb.prototype.once),
        (DocmaWeb.prototype.removeListener = DocmaWeb.prototype.off),
        (DocmaWeb.prototype.log = function () {
            docma._.logsEnabled && console.log.apply(console, arguments);
        }),
        (DocmaWeb.prototype.info = function () {
            docma._.logsEnabled && console.info.apply(console, arguments);
        }),
        (DocmaWeb.prototype.warn = function () {
            docma._.logsEnabled && console.warn.apply(console, arguments);
        }),
        (DocmaWeb.prototype.error = function () {
            docma._.logsEnabled && console.error.apply(console, arguments);
        }),
        (DocmaWeb.prototype.getDocmaElem = function () {
            return (
                document.getElementById(this._.elementID) ||
                Utils.DOM.createChild(document.body, "div", {
                    id: this._.elementID,
                })
            );
        }),
        (DocmaWeb.prototype.getContentElem = function () {
            var t = document.getElementById(this._.contentElementID);
            if (t) return t;
            throw new Error(
                "Partial " +
                    this._.partials.content +
                    ' should have an element with id="' +
                    this._.contentElementID +
                    '".',
            );
        }),
        (DocmaWeb.prototype.loadContent = function (t) {
            (this.getContentElem().innerHTML = t),
                Utils.DOM._removePrevBodyStyles(),
                Utils.DOM._moveBodyStylesToHead(),
                Utils.DOM.scrollTo();
        }),
        (DocmaWeb.prototype._loadCompiledContent = function (t) {
            this.getDocmaElem().innerHTML = t;
        }),
        (DocmaWeb.prototype._fixAnchors = function (r) {
            this.app.base &&
                setTimeout(function () {
                    for (
                        var t = document.querySelectorAll('a[href^="#"]'),
                            e = 0;
                        e < t.length;
                        e++
                    ) {
                        var o,
                            n = (o = t[e]).getAttribute("href");
                        "#" === n.slice(0, 1) &&
                            1 < n.length &&
                            ((n =
                                window.location.pathname +
                                (window.location.search || "") +
                                n),
                            o.setAttribute("href", n));
                    }
                    "function" == typeof r && r();
                }, 50);
        }),
        (DocmaWeb.prototype.addFilter = function (t, e) {
            if (this.filterExists(t))
                throw new Error('Filter "' + t + '" already exists.');
            return (dust.filters[t] = e), this;
        }),
        (DocmaWeb.prototype.removeFilter = function (t) {
            return delete dust.filters[t], this;
        }),
        (DocmaWeb.prototype.filterExists = function (t) {
            return "function" == typeof dust.filters[t];
        }),
        (DocmaWeb.prototype.createRoute = function (t, e) {
            return new DocmaWeb.Route(this, t, e);
        }),
        (DocmaWeb.prototype.createRouteFromID = function (t) {
            return "string" != typeof t
                ? (this.warn("Route ID is not a string: " + t),
                  new DocmaWeb.Route(this, null))
                : ((t = t.split(":")), new DocmaWeb.Route(this, t[1], t[0]));
        }),
        (DocmaWeb.prototype.createRouteFromQuery = function (t) {
            var e;
            return t
                ? ((e = (t = t.split("&")[0].split("="))[0].toLowerCase()),
                  (t = t[1]),
                  new DocmaWeb.Route(this, t, e))
                : new DocmaWeb.Route(null);
        }),
        (DocmaWeb.prototype._render = function (o, n) {
            var r = this;
            dust.render(o, this, function (t, e) {
                if (t)
                    throw (
                        (r.warn("Could not load Docma partial:", o),
                        r.log("Compiled HTML: ", e),
                        t)
                    );
                r._loadCompiledContent(e), "function" == typeof n && n();
            });
        }),
        (DocmaWeb.prototype._triggerAfterRender = function () {
            this._trigger(DocmaWeb.Event.Render, [docma.currentRoute]),
                this._.initialLoad &&
                    (this._trigger(DocmaWeb.Event.Ready),
                    (this._.initialLoad = !1));
        }),
        (DocmaWeb.prototype._render404 = function (t, e) {
            this._.currentRoute = this.createRoute(null);
            var o = this;
            this._render(this._.partials.notFound, function () {
                if (
                    (o._trigger(DocmaWeb.Event.Render, [null]),
                    Utils.DOM.scrollTo(),
                    "function" == typeof e)
                )
                    return e(404);
                throw new Error(
                    "Page or content not found for route: " +
                        Utils._safeStringify(t),
                );
            });
        }),
        (DocmaWeb.prototype.fetch = function (e, o) {
            var n = new XMLHttpRequest(),
                r = this;
            (n.onreadystatechange = function () {
                var t;
                if (4 === n.readyState)
                    return (
                        (t = 200 === n.status ? n.responseText : ""),
                        r.log("XHR GET:", n.status, e),
                        o(n.status, t)
                    );
            }),
                n.open("GET", e, !0),
                n.send();
        }),
        (DocmaWeb.prototype.render = function (o, n) {
            if (!o || !o.exists()) return this._render404(o, n);
            var r, i;
            o.isEqualTo(this.currentRoute) ||
                ((this._.currentRoute = o),
                (r = "function" == typeof n),
                (i = this),
                o.type === DocmaWeb.Route.Type.API
                    ? this._render(this._.partials.api, function () {
                          i._triggerAfterRender(),
                              r && n(200),
                              i._fixAnchors(function () {
                                  Utils.DOM.scrollTo();
                              });
                      })
                    : docma.fetch(o.contentPath, function (t, e) {
                          if (404 === t) return i._render404(o, n);
                          i._render(i._.partials.content, function () {
                              i.loadContent(e),
                                  i._triggerAfterRender(),
                                  r && n(t),
                                  i._fixAnchors(function () {
                                      Utils.DOM.scrollTo();
                                  });
                          });
                      }));
        }),
        (DocmaWeb.Utils = Utils);

    var _arrRouteTypes;
    (DocmaWeb.Route = function (t, e, o) {
        if (((this._docma = t), o && !(_arrRouteTypes.indexOf(o) < 0))) {
            if (e) t.app.routing.caseSensitive || (e = e.toLowerCase());
            else {
                if (o !== DocmaWeb.Route.Type.API) return;
                e = t._.defaultApiName;
            }
            t = Utils._find(t.routes, { type: o, name: e });
            t && Utils._assign(this, t);
        }
    }),
        (DocmaWeb.Route.Type = { API: "api", CONTENT: "content" }),
        (_arrRouteTypes = Utils._values(DocmaWeb.Route.Type)),
        (DocmaWeb.Route.SourceType = { JS: "js", MD: "md", HTML: "html" }),
        (DocmaWeb.Route.prototype.exists = function () {
            return Boolean(this.id);
        }),
        (DocmaWeb.Route.prototype.isEqualTo = function (t) {
            return !!(t && t.exists() && this.exists()) && t.path === this.path;
        }),
        (DocmaWeb.Route.prototype.isCurrent = function () {
            return this.isEqualTo(this._docma.currentRoute);
        }),
        (DocmaWeb.Route.prototype.apply = function (t) {
            return (
                this.type === DocmaWeb.Route.Type.API
                    ? ((this._docma._.documentation =
                          this._docma.apis[this.name].documentation),
                      (this._docma._.symbols =
                          this._docma.apis[this.name].symbols))
                    : ((this._docma._.documentation = null),
                      (this._docma._.symbols = null)),
                this._docma._trigger(DocmaWeb.Event.Route, [
                    this.exists() ? this : null,
                ]),
                this._docma.render(this, t),
                this
            );
        }),
        (DocmaWeb.Route.prototype.toString = function () {
            var e = this.toJSON();
            return Object.keys(e)
                .map(function (t) {
                    return t + ": " + e[t];
                })
                .join(", ");
        }),
        (DocmaWeb.Route.prototype.toJSON = function () {
            return {
                id: this.id,
                contentPath: this.contentPath,
                path: this.path,
                type: this.type,
                sourceType: this.sourceType,
                name: this.name,
            };
        });

    (dust.filters = dust.filters || {}),
        (dust.filters.$pt = function (e) {
            return DocmaWeb.Utils.parseTicks(e);
        }),
        (dust.filters.$pnl = function (e) {
            return DocmaWeb.Utils.parseNewLines(e, { keepIfSingle: !0 });
        }),
        (dust.filters.$pl = function (e) {
            return DocmaWeb.Utils.parseLinks(e);
        }),
        (dust.filters.$tl = function (e) {
            return DocmaWeb.Utils.trimLeft(e);
        }),
        (dust.filters.$tnl = function (e) {
            return DocmaWeb.Utils.trimNewLines(e);
        }),
        (dust.filters.$p = function (e) {
            return DocmaWeb.Utils.parse(e, { keepIfSingle: !0 });
        }),
        (dust.filters.$nt = function (e) {
            return DocmaWeb.Utils.normalizeTabs(e);
        }),
        (dust.filters.$desc = function (e) {
            return DocmaWeb.Utils.parse(e.classdesc || e.description || "");
        });
    var reJSValues =
        /true|false|null|undefined|Infinity|NaN|\d+|Number\.\w+|Math\.(PI|E|LN(2|10)|LOG(2|10)E|SQRT(1_)?2)|\[.*?]|\{.*?}|new [a-zA-Z]+.*|\/.+\/[gmiu]*|Date\.(now\(\)|UTC\(.*)|window|document/;
    function getFormatValue(e, t) {
        var n;
        return "string" ==
            typeof (t =
                arguments.length < 2
                    ? DocmaWeb.Utils.notate(e, "meta.code.value") ||
                      e.defaultvalue
                    : t) &&
            ((n = DocmaWeb.Utils.notate(e, "type.names") || []),
            !/['"`]/.test(t.slice(0, 1))) &&
            0 <= n.indexOf("String") &&
            (1 === n.length || -1 === reJSValues.indexOf(t))
            ? '"' + t + '"'
            : String(t);
    }
    (dust.filters.$def = function (e) {
        return e.hasOwnProperty("defaultvalue")
            ? getFormatValue(e, e.defaultvalue)
            : "undefined";
    }),
        (dust.filters.$val = function (e) {
            return getFormatValue(e);
        }),
        (dust.filters.$id = function (e) {
            return (
                "string" == typeof e
                    ? e
                    : (DocmaWeb.Utils.isConstructor(e) ? "new-" : "") +
                      e.$longname
            ).replace(/ /g, "-");
        });

    DocmaWeb.version = "3.3.6";
    return DocmaWeb;
})();
var docma = Object.freeze(
    new DocmaWeb({
        version: "3.3.6",
        routes: [
            {
                id: "api:",
                type: "api",
                name: "_def_",
                path: "api/",
                contentPath: null,
                sourceType: "js",
            },
            {
                id: "api:web",
                type: "api",
                name: "web",
                path: "api/web/",
                contentPath: null,
                sourceType: "js",
            },
            {
                id: "api:web/utils",
                type: "api",
                name: "web/utils",
                path: "api/web/utils/",
                contentPath: null,
                sourceType: "js",
            },
            {
                id: "content:changelog",
                type: "content",
                name: "changelog",
                path: "changelog/",
                contentPath: "content/changelog.html",
                sourceType: "md",
            },
            {
                id: "content:readme",
                type: "content",
                name: "readme",
                path: "readme/",
                contentPath: "content/readme.html",
                sourceType: "md",
            },
            {
                id: "content:license",
                type: "content",
                name: "license",
                path: "license/",
                contentPath: "content/license.html",
                sourceType: "md",
            },
            {
                id: "content:home",
                type: "content",
                name: "home",
                path: "home/",
                contentPath: "content/home.html",
                sourceType: "md",
            },
            {
                id: "content:templates/zebra",
                type: "content",
                name: "templates/zebra",
                path: "templates/zebra/",
                contentPath: "content/templates/zebra.html",
                sourceType: "md",
            },
        ],
        apis: {
            _def_: {
                documentation: [
                    {
                        comment:
                            "/**\n *  Docma (builder) class for generating HTML documentation from the given\n *  Javascript and/or markdown source files. This is the default object exported\n *  from the `docma` Node module.\n *\n *  <blockquote>This documentation you're reading is built with Docma.</blockquote>\n *  @class\n *\n *  @example\n *  const Docma = require('docma');\n */",
                        meta: {
                            range: [1333, 42229],
                            filename: "Docma.js",
                            lineno: 48,
                            columnno: 0,
                            path: "/Users/JPI/projects/prozi/docma/lib",
                            code: {
                                id: "astnode100000108",
                                name: "Docma",
                                type: "ClassDeclaration",
                                paramnames: [],
                            },
                        },
                        name: "Docma",
                        longname: "Docma",
                        kind: "class",
                        classdesc:
                            "Docma (builder) class for generating HTML documentation from the given\n Javascript and/or markdown source files. This is the default object exported\n from the `docma` Node module.\n\n <blockquote>This documentation you're reading is built with Docma.</blockquote>",
                        examples: ["const Docma = require('docma');"],
                        scope: "global",
                        description: "Initializes a new instance of `Docma`.",
                        $longname: "Docma",
                        $kind: "class",
                        $docmaLink: "api/#Docma",
                        $constructor: {
                            comment:
                                "/**\n     *  Initializes a new instance of `Docma`.\n     *  @example\n     *  const docma = new Docma();\n     */",
                            meta: {
                                range: [1466, 1482],
                                filename: "Docma.js",
                                lineno: 54,
                                columnno: 4,
                                path: "/Users/JPI/projects/prozi/docma/lib",
                                code: {
                                    id: "astnode100000111",
                                    name: "Docma",
                                    type: "MethodDefinition",
                                    paramnames: [],
                                },
                                vars: { "": null },
                            },
                            description:
                                "Initializes a new instance of `Docma`.",
                            examples: ["const docma = new Docma();"],
                            name: "Docma",
                            longname: "Docma",
                            kind: "class",
                            scope: "global",
                            params: [],
                            undocumented: true,
                            $longname: "Docma",
                            $kind: "constructor",
                            $docmaLink: "api/#Docma",
                        },
                        $members: [
                            {
                                comment:
                                    '/**\n *  Docma build configuration object that defines parse options for the given\n *  source files; and templating options for the Single Page Application to be\n *  generated.\n *\n *  This is very configurable but, you\'re only required to define very few\n *  options such as the source files (`src`) and the destination directory\n *  (`dest`) for a simple build.\n *\n *  <blockquote>See the example at the bottom or for a real example; check out Docma\'s own\n *  build configuration file, that generates this documentation you\'re reading\n *  {@link https://github.com/Prozi/docma/blob/master/docma.json|here}.</blockquote>\n *\n *  @typedef Docma~BuildConfiguration\n *  @type Object\n *\n *  @param {String|Array|Object} src One or more source file/directory paths to\n *         be processed. This also accepts\n *         {@link https://github.com/isaacs/node-glob|Glob} strings or array of\n *         globs. e.g. `./src/&#x2A;&#x2A;/&#x2A;.js` will produce an array of\n *         all `.js` files under `./src` directory and sub-directories.\n *\n *         JavaScript files will be parsed with JSDoc and files with `.md`, `.htm`\n *         and `.html` extensions will be automatically parsed to proper formats.\n *         But if you need; you can force a specific parser on defined files.\n *         e.g. `./LICENSE:md` will be force-parsed to markdown.\n *\n *         See examples at the bottom for a better understanding.\n *  @param {Object} [assets] Non-source, static asset files/directories to be\n *         copied over to build directory; so you can use/link to files such as\n *         images, ZIPs, PDFs, etc... Keys of this object define the target\n *         directory, relative to the build destination directory. Value of each\n *         key can either be a single file path string or an array. This also\n *         accepts {@link https://github.com/isaacs/node-glob|Glob} strings or\n *         array of globs. e.g. `{ "/": ["./&#x2A;.png"] }` will copy all PNG\n *         files of the current relative directory to the root of destination\n *         directory. <b>CAUTION:</b> Each copy operation will overwrite the\n *         file if it already exists.\n *  @param {String} dest Destination output directory path. <b>CAUTION:</b>\n *         Files in this directory will be overwritten. If `clean` option is\n *         enabled, all contents will be removed. Make sure you set this to\n *         a correct path.\n *  @param {Boolean} [clean=false] Whether the destination directory should be\n *         emptied before the build.\n *  @param {Boolean|Number} [debug=false] Specifies debug settings for build\n *         operation and generated SPA. This takes a bitwise numeric value so\n *         you can combine flags to your liking. If a `Boolean` value set,\n *         `false` means `Docma.Debug.DISABLED` and `true` means\n *         `Docma.Debug.ALL` which enables all debugging options. See\n *         {@link #Docma.Debug|`Debug` flags enumeration} for all possible\n *         values.\n *  @param {Object} [jsdoc] - JSDoc parse options.\n *  @param {String} [jsdoc.encoding="utf8"] Encoding to be used when reading JS\n *         source files.\n *  @param {Boolean} [jsdoc.recurse=false] Specifies whether to recurse into\n *         sub-directories when scanning for source files.\n *  @param {Boolean} [jsdoc.pedantic=false] Specifies whether to treat errors as\n *         fatal errors, and treat warnings as errors.\n *  @param {String|Array} [jsdoc.access] Specifies which symbols to be processed\n *         with the given access property. Possible values: `"private"`,\n *         `"protected"`, `"public"` or `"all"` (for all access levels). By\n *         default, all except private symbols are processed. Note that, if\n *         access is not set for a documented symbol, it will still be included,\n *         regardless of this option.\n *  @param {Boolean} [jsdoc.private=false] -\n *  @param {String} [jsdoc.package] The path to the `package.json` file that\n *         contains the project name, version, and other details. If set to\n *         `true` instead of a path string, the first `package.json` file found\n *         in the source paths.\n *  @param {Boolean} [jsdoc.module=true] Specifies whether to include\n *         `module.exports` symbols.\n *  @param {Boolean} [jsdoc.undocumented=false] Specifies whether to include\n *         undocumented symbols.\n *  @param {Boolean} [jsdoc.undescribed=false] Specifies whether to include\n *         symbols without a description.\n *  @param {Boolean} [jsdoc.ignored=false] Specifies whether to include symbols\n *         marked with `ignore` tag.\n *  @param {String} [jsdoc.relativePath] When set, all `symbol.meta.path` values\n *         will be relative to this path.\n *  @param {Function} [jsdoc.predicate] This is used to filter the parsed\n *         documentation output array. If a `Function` is passed; it\'s invoked\n *         for each included `symbol`. e.g. `function (symbol) { return symbol;\n *         }` Returning a falsy value will remove the symbol from the output.\n *         Returning `true` will keep the original symbol. To keep the symbol\n *         and alter its contents, simply return an altered symbol object.\n *  @param {Boolean} [jsdoc.hierarchy=false] Specifies whether to arrange\n *         symbols by their hierarchy. This will find and move symbols that have\n *         a `memberof` property to a `$members` property of their corresponding\n *         owners. Also the constructor symbol will be moved to a `$constructor`\n *         property of the `ClassDeclaration` symbol; if any.\n *  @param {Boolean|String} [jsdoc.sort="alphabetic"] Specifies whether to sort\n *         the documentation symbols. For alphabetic sort, set to `true` or\n *         `"alphabetic"`. To group-sort set to `"grouped"`. <i>(Group sorting\n *         is done in the following order: by memberof, by scope, by access\n *         type, by kind, alphabetic.)</i> To sort by only `"scope"` or\n *         `"access"` or `"kind"`, set to corresponding string. <i>(Sorting by\n *         kind is done in the following order: constant, package/module,\n *         namespace, class, constructor, method, property, enum, typedef,\n *         event, interface, mixin, external, other members.)</i> Set to `false`\n *         to disable. <i>Note that this sorts the documentation symbols data,\n *         how it\'s displayed might be altered by the Docma template you\'re\n *         using.</i>\n *  @param {Boolean} [jsdoc.allowUnknownTags=true] Specifies whether to allow\n *         unrecognized tags. If set to `false` parsing will fail on unknown\n *         tags.\n *  @param {Array} [jsdoc.dictionaries=["jsdoc", "closure"]] Indicates the\n *         dictionaries to be used. By default, both standard JSDoc tags and\n *         Closure Compiler tags are enabled.\n *  @param {String} [jsdoc.includePattern=".+\\\\.js(doc|x)?$"] String pattern for\n *         defining sources to be included. By default, only files ending in\n *         `".js"`, "`.jsdoc"`, and `".jsx"` will be processed.\n *  @param {String} [jsdoc.excludePattern="(^|\\\\/|\\\\\\\\)_"] String pattern for\n *         defining sources to be ignored. By default, any file starting with an\n *         underscore or in a directory starting with an underscore will be\n *         ignored.\n *  @param {Array} [jsdoc.plugins=[]] Defines the JSDoc plugins to be used. See\n *         {@link https://usejsdoc.org/about-plugins.html|this guide} on JSDoc\n *         plugins.\n *  @param {Object} [markdown] - Markdown parse options.\n *  @param {Boolean} [markdown.gfm=true] Whether to enable\n *         {@link https://help.github.com/categories/writing-on-github|GitHub flavored markdown}.\n *  @param {Boolean} [markdown.tables=true] Whether to enable enable GFM\n *         {@link https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#tables|tables}.\n *         This option requires the `gfm` option to be `true`.\n *  @param {Boolean} [markdown.breaks=false] Whether to enable enable GFM\n *         {@link https://help.github.com/articles/basic-writing-and-formatting-syntax/#paragraphs-and-line-breaks|line breaks}.\n *         This option requires the `gfm` option to be `true`.\n *  @param {Boolean} [markdown.pedantic=false] Whether to conform with obscure\n *         parts of `markdown.pl` as much as possible. Don\'t fix any of the\n *         original markdown bugs or poor behavior.\n *  @param {Boolean} [markdown.sanitize=false] Whether to use smarter list\n *         behavior than the original markdown. May eventually be default with\n *         the old behavior moved into `pedantic`.\n *  @param {Boolean} [markdown.smartypants=false] Whether to use "smart"\n *         typographic punctuation for things like quotes and dashes.\n *  @param {Boolean} [markdown.xhtml=false] Self-close the tags for void\n *         elements (`<br/>`, `<img/>`, etc.) with a `"/"` as required by XHTML.\n *  @param {Boolean} [markdown.tasks=true] Whether to parse GitHub style task\n *         markdown (e.g. `- [x] task`) into checkbox elements.\n *  @param {Boolean} [markdown.emoji=true] If set to `true`, emoji shortcuts\n *         (e.g. `&#x3A;smiley&#x3A;`) are parsed into `&lt;img /&gt;` elements\n *         with {@link https://twitter.github.io/twemoji|twemoji} SVG URLs.\n *  @param {Object} [app] Configuration for the generated SPA (Single Page\n *         Application).\n *  @param {String} [app.title=""] Title of the main HTML document of the\n *         generated web app. (Sets the value of the `&lt;title&gt;` element.)\n *  @param {Array|Object} [app.meta] One or more meta elements to be set for the\n *         main HTML document of the generated web app. Set arbitrary object(s)\n *         for each meta element to be added. e.g. `[{ charset: "utf-8"}, {\n *         name: "robots", "content": "index, follow" }]`.\n *  @param {String} [app.base="/"] Sets the base path of the generated web app.\n *         For example if the app will operate within `/doc/*` set the base path\n *         to `"/doc"`.\n *  @param {String} [app.favicon] Local path to a `favicon.ico` file to be used\n *          with the web app.\n *  @param {String} [app.entrance="api"] Defines the home content to be\n *         displayed for the application root (when you enter the base path i.e.\n *         `"/"`). Pass the type and name of the route in `{type}:{name}`\n *         format. There are 2 types of routes: `api` for JS source\n *         documentation and `content` for other HTML content such as parsed\n *         markdown files. For example, if you have a grouped JS files\n *         documented with a name `mylib`; to define this as the entrance of the\n *         app, set this to `"api:mylib"`. If you have `"README.md"` in your\n *         source files; to define this as the entrance, set this to\n *         `"content:readme"`.\n *  @param {String|Object} [app.routing] Either a `String` defining the route\n *         method or an `Object` defining both the method and whether the routes\n *         should be case-sensitive.\n *         @param {String} [app.routing.method="query"]\n *                Indicates the routing method for the generated SPA (Single\n *                Page Application).\n *                See {@link #Docma.RoutingMethod|`RoutingMethod` enumeration}.\n *         @param {Boolean} [app.routing.caseSensitive=true]\n *                Indicates whether the routes should be case-sensitive.\n *                Note that if this is set to `false`, same route names will\n *                overwrite the previous, even if they have different case.\n *  @param {String} [app.server="static"] Server or host type for the SPA. This\n *         information helps Docma determine how to configure the generated SPA,\n *         especially if `routing.method` is set to `"path"`. See\n *         {@link #Docma.ServerType|`ServerType` enumeration} for details.\n *  @param {Object} [template] - SPA template configuration.\n *  @param {String} [template.path="default"] Either the path of a custom Docma\n *         template or the name of a built-in template. Omit to use the default\n *         built-in template.\n *  @param {Object} [template.options] SPA template options. This is defined by\n *         the template itself. Refer to the template\'s documentation for\n *         options to be set at build-time. See\n *         {@link templates/zebra/#template-options|Default Template options}.\n *\n *  @example\n *  const buildConfig = {\n *      src: [\n *          // using an object to define (group) names for JS files.\n *          {\n *              // grouping JS files under the name "my-lib".\n *              // This name also defines the api route name: e.g. ?api=my-lib or api/my-lib/\n *              \'my-lib\': [\n *                  \'./src/** /*.js\',           // recurse all JS files under /src\n *                  \'./lib/some-other.js\',\n *                  \'!./lib/ignored.js\'         // notice the bang! prefix to exclude this file\n *              ],\n *              // naming another api route\n *              \'other-lib\': \'./other/*.js\',    // ?api=other-lib\n *          },\n *\n *          // ungrouped js files will be merged under default route\n *          \'./src/main.js\',                    // ?api or ?api=_def_\n *          \'./src/main.utils.js\',              // merged into same ?api or ?api=_def_\n *\n *          // including markdown ("content") files\n *          \'./CHANGELOG.md\',                   // this will have \'changelog\' as route name.\n *                                              // i.e. ?content=changelog\n *          // forcing specific parser on files:\n *          \'./LICENSE:md\',                     // LICENSE file with no-extension is forced\n *                                              // to markdown via :md suffix.\n *                                              // route will be ?content=license or license/\n *          // using an object to rename the route for the given markdown files\n *          {\n *              guide: \'./README.md\'            // this will have \'guide\' as content route name\n *          }                                   // i.e. ?content=guide or guide/\n *      ],\n *      dest: \'./output/docs\',                  // output directory for the generated docs\n *      app: {\n *          title: \'My Documentation\',          // title of the app\n *          routing: \'query\',                   // routing method "query" or "path"\n *          entrance: \'content:guide\',          // initial route to load on entrance\n *          base: \'/\'                           // base path of the SPA\n *      },\n *\n *      // template-specific configuration.\n *      // for Zebra template, see https://onury.io/docma/templates/zebra\n *      template: {\n *          path: \'zebra\',\n *          options: {\n *              title: {\n *                  label: \'My Docs\',\n *                  href: \'/docs/?\'\n *              },\n *              navbar: true,\n *              sidebar: {\n *                  enabled: true,\n *                  outline: \'tree\'\n *              }\n *          }\n *      }\n *  };\n *  // See Docma\'s own configuration @\n *  // https://github.com/Prozi/docma/blob/master/docma.json\n */',
                                meta: {
                                    filename: "Docma.js",
                                    lineno: 1233,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Docma build configuration object that defines parse options for the given\n source files; and templating options for the Single Page Application to be\n generated.\n\n This is very configurable but, you're only required to define very few\n options such as the source files (`src`) and the destination directory\n (`dest`) for a simple build.\n\n <blockquote>See the example at the bottom or for a real example; check out Docma's own\n build configuration file, that generates this documentation you're reading\n {@link https://github.com/Prozi/docma/blob/master/docma.json|here}.</blockquote>",
                                kind: "typedef",
                                name: "BuildConfiguration",
                                type: { names: ["Object"] },
                                params: [
                                    {
                                        type: {
                                            names: [
                                                "String",
                                                "Array",
                                                "Object",
                                            ],
                                        },
                                        description:
                                            "One or more source file/directory paths to\n        be processed. This also accepts\n        {@link https://github.com/isaacs/node-glob|Glob} strings or array of\n        globs. e.g. `./src/&#x2A;&#x2A;/&#x2A;.js` will produce an array of\n        all `.js` files under `./src` directory and sub-directories.\n\n        JavaScript files will be parsed with JSDoc and files with `.md`, `.htm`\n        and `.html` extensions will be automatically parsed to proper formats.\n        But if you need; you can force a specific parser on defined files.\n        e.g. `./LICENSE:md` will be force-parsed to markdown.\n\n        See examples at the bottom for a better understanding.",
                                        name: "src",
                                    },
                                    {
                                        type: { names: ["Object"] },
                                        optional: true,
                                        description:
                                            'Non-source, static asset files/directories to be\n        copied over to build directory; so you can use/link to files such as\n        images, ZIPs, PDFs, etc... Keys of this object define the target\n        directory, relative to the build destination directory. Value of each\n        key can either be a single file path string or an array. This also\n        accepts {@link https://github.com/isaacs/node-glob|Glob} strings or\n        array of globs. e.g. `{ "/": ["./&#x2A;.png"] }` will copy all PNG\n        files of the current relative directory to the root of destination\n        directory. <b>CAUTION:</b> Each copy operation will overwrite the\n        file if it already exists.',
                                        name: "assets",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Destination output directory path. <b>CAUTION:</b>\n        Files in this directory will be overwritten. If `clean` option is\n        enabled, all contents will be removed. Make sure you set this to\n        a correct path.",
                                        name: "dest",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: false,
                                        description:
                                            "Whether the destination directory should be\n        emptied before the build.",
                                        name: "clean",
                                    },
                                    {
                                        type: { names: ["Boolean", "Number"] },
                                        optional: true,
                                        defaultvalue: false,
                                        description:
                                            "Specifies debug settings for build\n        operation and generated SPA. This takes a bitwise numeric value so\n        you can combine flags to your liking. If a `Boolean` value set,\n        `false` means `Docma.Debug.DISABLED` and `true` means\n        `Docma.Debug.ALL` which enables all debugging options. See\n        {@link #Docma.Debug|`Debug` flags enumeration} for all possible\n        values.",
                                        name: "debug",
                                    },
                                    {
                                        type: { names: ["Object"] },
                                        optional: true,
                                        description: "JSDoc parse options.",
                                        name: "jsdoc",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        optional: true,
                                        defaultvalue: '"utf8"',
                                        description:
                                            "Encoding to be used when reading JS\n        source files.",
                                        name: "jsdoc.encoding",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: false,
                                        description:
                                            "Specifies whether to recurse into\n        sub-directories when scanning for source files.",
                                        name: "jsdoc.recurse",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: false,
                                        description:
                                            "Specifies whether to treat errors as\n        fatal errors, and treat warnings as errors.",
                                        name: "jsdoc.pedantic",
                                    },
                                    {
                                        type: { names: ["String", "Array"] },
                                        optional: true,
                                        description:
                                            'Specifies which symbols to be processed\n        with the given access property. Possible values: `"private"`,\n        `"protected"`, `"public"` or `"all"` (for all access levels). By\n        default, all except private symbols are processed. Note that, if\n        access is not set for a documented symbol, it will still be included,\n        regardless of this option.',
                                        name: "jsdoc.access",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: false,
                                        description: "-",
                                        name: "jsdoc.private",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        optional: true,
                                        description:
                                            "The path to the `package.json` file that\n        contains the project name, version, and other details. If set to\n        `true` instead of a path string, the first `package.json` file found\n        in the source paths.",
                                        name: "jsdoc.package",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: true,
                                        description:
                                            "Specifies whether to include\n        `module.exports` symbols.",
                                        name: "jsdoc.module",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: false,
                                        description:
                                            "Specifies whether to include\n        undocumented symbols.",
                                        name: "jsdoc.undocumented",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: false,
                                        description:
                                            "Specifies whether to include\n        symbols without a description.",
                                        name: "jsdoc.undescribed",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: false,
                                        description:
                                            "Specifies whether to include symbols\n        marked with `ignore` tag.",
                                        name: "jsdoc.ignored",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        optional: true,
                                        description:
                                            "When set, all `symbol.meta.path` values\n        will be relative to this path.",
                                        name: "jsdoc.relativePath",
                                    },
                                    {
                                        type: { names: ["function"] },
                                        optional: true,
                                        description:
                                            "This is used to filter the parsed\n        documentation output array. If a `Function` is passed; it's invoked\n        for each included `symbol`. e.g. `function (symbol) { return symbol;\n        }` Returning a falsy value will remove the symbol from the output.\n        Returning `true` will keep the original symbol. To keep the symbol\n        and alter its contents, simply return an altered symbol object.",
                                        name: "jsdoc.predicate",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: false,
                                        description:
                                            "Specifies whether to arrange\n        symbols by their hierarchy. This will find and move symbols that have\n        a `memberof` property to a `$members` property of their corresponding\n        owners. Also the constructor symbol will be moved to a `$constructor`\n        property of the `ClassDeclaration` symbol; if any.",
                                        name: "jsdoc.hierarchy",
                                    },
                                    {
                                        type: { names: ["Boolean", "String"] },
                                        optional: true,
                                        defaultvalue: '"alphabetic"',
                                        description:
                                            'Specifies whether to sort\n        the documentation symbols. For alphabetic sort, set to `true` or\n        `"alphabetic"`. To group-sort set to `"grouped"`. <i>(Group sorting\n        is done in the following order: by memberof, by scope, by access\n        type, by kind, alphabetic.)</i> To sort by only `"scope"` or\n        `"access"` or `"kind"`, set to corresponding string. <i>(Sorting by\n        kind is done in the following order: constant, package/module,\n        namespace, class, constructor, method, property, enum, typedef,\n        event, interface, mixin, external, other members.)</i> Set to `false`\n        to disable. <i>Note that this sorts the documentation symbols data,\n        how it\'s displayed might be altered by the Docma template you\'re\n        using.</i>',
                                        name: "jsdoc.sort",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: true,
                                        description:
                                            "Specifies whether to allow\n        unrecognized tags. If set to `false` parsing will fail on unknown\n        tags.",
                                        name: "jsdoc.allowUnknownTags",
                                    },
                                    {
                                        type: { names: ["Array"] },
                                        optional: true,
                                        defaultvalue: '["jsdoc", "closure"]',
                                        description:
                                            "Indicates the\n        dictionaries to be used. By default, both standard JSDoc tags and\n        Closure Compiler tags are enabled.",
                                        name: "jsdoc.dictionaries",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        optional: true,
                                        defaultvalue: '".+\\\\.js(doc|x)?$"',
                                        description:
                                            'String pattern for\n        defining sources to be included. By default, only files ending in\n        `".js"`, "`.jsdoc"`, and `".jsx"` will be processed.',
                                        name: "jsdoc.includePattern",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        optional: true,
                                        defaultvalue: '"(^|\\\\/|\\\\\\\\)_"',
                                        description:
                                            "String pattern for\n        defining sources to be ignored. By default, any file starting with an\n        underscore or in a directory starting with an underscore will be\n        ignored.",
                                        name: "jsdoc.excludePattern",
                                    },
                                    {
                                        type: { names: ["Array"] },
                                        optional: true,
                                        defaultvalue: "[]",
                                        description:
                                            "Defines the JSDoc plugins to be used. See\n        {@link https://usejsdoc.org/about-plugins.html|this guide} on JSDoc\n        plugins.",
                                        name: "jsdoc.plugins",
                                    },
                                    {
                                        type: { names: ["Object"] },
                                        optional: true,
                                        description: "Markdown parse options.",
                                        name: "markdown",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: true,
                                        description:
                                            "Whether to enable\n        {@link https://help.github.com/categories/writing-on-github|GitHub flavored markdown}.",
                                        name: "markdown.gfm",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: true,
                                        description:
                                            "Whether to enable enable GFM\n        {@link https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#tables|tables}.\n        This option requires the `gfm` option to be `true`.",
                                        name: "markdown.tables",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: false,
                                        description:
                                            "Whether to enable enable GFM\n        {@link https://help.github.com/articles/basic-writing-and-formatting-syntax/#paragraphs-and-line-breaks|line breaks}.\n        This option requires the `gfm` option to be `true`.",
                                        name: "markdown.breaks",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: false,
                                        description:
                                            "Whether to conform with obscure\n        parts of `markdown.pl` as much as possible. Don't fix any of the\n        original markdown bugs or poor behavior.",
                                        name: "markdown.pedantic",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: false,
                                        description:
                                            "Whether to use smarter list\n        behavior than the original markdown. May eventually be default with\n        the old behavior moved into `pedantic`.",
                                        name: "markdown.sanitize",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: false,
                                        description:
                                            'Whether to use "smart"\n        typographic punctuation for things like quotes and dashes.',
                                        name: "markdown.smartypants",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: false,
                                        description:
                                            'Self-close the tags for void\n        elements (`<br/>`, `<img/>`, etc.) with a `"/"` as required by XHTML.',
                                        name: "markdown.xhtml",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: true,
                                        description:
                                            "Whether to parse GitHub style task\n        markdown (e.g. `- [x] task`) into checkbox elements.",
                                        name: "markdown.tasks",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: true,
                                        description:
                                            "If set to `true`, emoji shortcuts\n        (e.g. `&#x3A;smiley&#x3A;`) are parsed into `&lt;img /&gt;` elements\n        with {@link https://twitter.github.io/twemoji|twemoji} SVG URLs.",
                                        name: "markdown.emoji",
                                    },
                                    {
                                        type: { names: ["Object"] },
                                        optional: true,
                                        description:
                                            "Configuration for the generated SPA (Single Page\n        Application).",
                                        name: "app",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        optional: true,
                                        defaultvalue: '""',
                                        description:
                                            "Title of the main HTML document of the\n        generated web app. (Sets the value of the `&lt;title&gt;` element.)",
                                        name: "app.title",
                                    },
                                    {
                                        type: { names: ["Array", "Object"] },
                                        optional: true,
                                        description:
                                            'One or more meta elements to be set for the\n        main HTML document of the generated web app. Set arbitrary object(s)\n        for each meta element to be added. e.g. `[{ charset: "utf-8"}, {\n        name: "robots", "content": "index, follow" }]`.',
                                        name: "app.meta",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        optional: true,
                                        defaultvalue: '"/"',
                                        description:
                                            'Sets the base path of the generated web app.\n        For example if the app will operate within `/doc/*` set the base path\n        to `"/doc"`.',
                                        name: "app.base",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        optional: true,
                                        description:
                                            "Local path to a `favicon.ico` file to be used\n         with the web app.",
                                        name: "app.favicon",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        optional: true,
                                        defaultvalue: '"api"',
                                        description:
                                            'Defines the home content to be\n        displayed for the application root (when you enter the base path i.e.\n        `"/"`). Pass the type and name of the route in `{type}:{name}`\n        format. There are 2 types of routes: `api` for JS source\n        documentation and `content` for other HTML content such as parsed\n        markdown files. For example, if you have a grouped JS files\n        documented with a name `mylib`; to define this as the entrance of the\n        app, set this to `"api:mylib"`. If you have `"README.md"` in your\n        source files; to define this as the entrance, set this to\n        `"content:readme"`.',
                                        name: "app.entrance",
                                    },
                                    {
                                        type: { names: ["String", "Object"] },
                                        optional: true,
                                        description:
                                            "Either a `String` defining the route\n        method or an `Object` defining both the method and whether the routes\n        should be case-sensitive.",
                                        name: "app.routing",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        optional: true,
                                        defaultvalue: '"query"',
                                        description:
                                            "Indicates the routing method for the generated SPA (Single\n               Page Application).\n               See {@link #Docma.RoutingMethod|`RoutingMethod` enumeration}.",
                                        name: "app.routing.method",
                                    },
                                    {
                                        type: { names: ["Boolean"] },
                                        optional: true,
                                        defaultvalue: true,
                                        description:
                                            "Indicates whether the routes should be case-sensitive.\n               Note that if this is set to `false`, same route names will\n               overwrite the previous, even if they have different case.",
                                        name: "app.routing.caseSensitive",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        optional: true,
                                        defaultvalue: '"static"',
                                        description:
                                            'Server or host type for the SPA. This\n        information helps Docma determine how to configure the generated SPA,\n        especially if `routing.method` is set to `"path"`. See\n        {@link #Docma.ServerType|`ServerType` enumeration} for details.',
                                        name: "app.server",
                                    },
                                    {
                                        type: { names: ["Object"] },
                                        optional: true,
                                        description:
                                            "SPA template configuration.",
                                        name: "template",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        optional: true,
                                        defaultvalue: '"default"',
                                        description:
                                            "Either the path of a custom Docma\n        template or the name of a built-in template. Omit to use the default\n        built-in template.",
                                        name: "template.path",
                                    },
                                    {
                                        type: { names: ["Object"] },
                                        optional: true,
                                        description:
                                            "SPA template options. This is defined by\n        the template itself. Refer to the template's documentation for\n        options to be set at build-time. See\n        {@link templates/zebra/#template-options|Default Template options}.",
                                        name: "template.options",
                                    },
                                ],
                                examples: [
                                    "const buildConfig = {\n     src: [\n         // using an object to define (group) names for JS files.\n         {\n             // grouping JS files under the name \"my-lib\".\n             // This name also defines the api route name: e.g. ?api=my-lib or api/my-lib/\n             'my-lib': [\n                 './src/** /*.js',           // recurse all JS files under /src\n                 './lib/some-other.js',\n                 '!./lib/ignored.js'         // notice the bang! prefix to exclude this file\n             ],\n             // naming another api route\n             'other-lib': './other/*.js',    // ?api=other-lib\n         },\n\n         // ungrouped js files will be merged under default route\n         './src/main.js',                    // ?api or ?api=_def_\n         './src/main.utils.js',              // merged into same ?api or ?api=_def_\n\n         // including markdown (\"content\") files\n         './CHANGELOG.md',                   // this will have 'changelog' as route name.\n                                             // i.e. ?content=changelog\n         // forcing specific parser on files:\n         './LICENSE:md',                     // LICENSE file with no-extension is forced\n                                             // to markdown via :md suffix.\n                                             // route will be ?content=license or license/\n         // using an object to rename the route for the given markdown files\n         {\n             guide: './README.md'            // this will have 'guide' as content route name\n         }                                   // i.e. ?content=guide or guide/\n     ],\n     dest: './output/docs',                  // output directory for the generated docs\n     app: {\n         title: 'My Documentation',          // title of the app\n         routing: 'query',                   // routing method \"query\" or \"path\"\n         entrance: 'content:guide',          // initial route to load on entrance\n         base: '/'                           // base path of the SPA\n     },\n\n     // template-specific configuration.\n     // for Zebra template, see https://onury.io/docma/templates/zebra\n     template: {\n         path: 'zebra',\n         options: {\n             title: {\n                 label: 'My Docs',\n                 href: '/docs/?'\n             },\n             navbar: true,\n             sidebar: {\n                 enabled: true,\n                 outline: 'tree'\n             }\n         }\n     }\n };\n // See Docma's own configuration @\n // https://github.com/Prozi/docma/blob/master/docma.json",
                                ],
                                memberof: "Docma",
                                longname: "Docma~BuildConfiguration",
                                scope: "inner",
                                $longname: "Docma~BuildConfiguration",
                                $kind: "typedef",
                                $docmaLink: "api/#Docma~BuildConfiguration",
                            },
                        ],
                    },
                    {
                        comment:
                            "/**\n     *  Parses the given source files and builds a Single Page Application (SPA)\n     *  with the given Docma template.\n     *\n     *  For a verbose build, `debug` option should be {@link #Docma.Debug|enabled}.\n     *\n     *  @param {Object|String} config\n     *         Either a build configuration object or the file path of a\n     *         configuration JSON file.\n     *         See {@link #Docma~BuildConfiguration|`BuildConfiguration`} for details.\n     *\n     *  @returns {Promise<Boolean>}\n     *           Promise that resolves to a `Boolean` value for whether the build\n     *           operation is successful. This will always return `true` if\n     *           no errors occur. You should `.catch()` the errors of the\n     *           promise chain.\n     *\n     *  @example\n     *  const docma = new Docma();\n     *  docma.build(config)\n     *  \t.then(success => {\n     *  \t\tconsole.log('Documentation is built successfully.');\n     *  \t})\n     *  \t.catch(error => {\n     *  \t\tconsole.log(error.stack);\n     *  \t});\n     */",
                        meta: {
                            range: [34541, 41913],
                            filename: "Docma.js",
                            lineno: 893,
                            columnno: 4,
                            path: "/Users/JPI/projects/prozi/docma/lib",
                            code: {
                                id: "astnode100002720",
                                name: "Docma#build",
                                type: "MethodDefinition",
                                paramnames: ["config"],
                            },
                            vars: { "": null },
                        },
                        description:
                            "Parses the given source files and builds a Single Page Application (SPA)\n with the given Docma template.\n\n For a verbose build, `debug` option should be {@link #Docma.Debug|enabled}.",
                        params: [
                            {
                                type: { names: ["Object", "String"] },
                                description:
                                    "Either a build configuration object or the file path of a\n        configuration JSON file.\n        See {@link #Docma~BuildConfiguration|`BuildConfiguration`} for details.",
                                name: "config",
                            },
                        ],
                        returns: [
                            {
                                type: { names: ["Promise.<Boolean>"] },
                                description:
                                    "Promise that resolves to a `Boolean` value for whether the build\n          operation is successful. This will always return `true` if\n          no errors occur. You should `.catch()` the errors of the\n          promise chain.",
                            },
                        ],
                        examples: [
                            "const docma = new Docma();\n docma.build(config)\n \t.then(success => {\n \t\tconsole.log('Documentation is built successfully.');\n \t})\n \t.catch(error => {\n \t\tconsole.log(error.stack);\n \t});",
                        ],
                        name: "build",
                        longname: "Docma#build",
                        kind: "function",
                        memberof: "Docma",
                        scope: "instance",
                        $longname: "Docma#build",
                        $kind: "method",
                        $docmaLink: "api/#Docma#build",
                    },
                    {
                        comment:
                            "/**\n     *  Creates a new instance of `Docma`.\n     *  This is equivalent to `new Docma()`.\n     *\n     *  @returns {Docma} - Docma instance.\n     */",
                        meta: {
                            range: [42176, 42227],
                            filename: "Docma.js",
                            lineno: 1061,
                            columnno: 4,
                            path: "/Users/JPI/projects/prozi/docma/lib",
                            code: {
                                id: "astnode100003398",
                                name: "Docma.create",
                                type: "MethodDefinition",
                                paramnames: [],
                            },
                            vars: { "": null },
                        },
                        description:
                            "Creates a new instance of `Docma`.\n This is equivalent to `new Docma()`.",
                        returns: [
                            {
                                type: { names: ["Docma"] },
                                description: "- Docma instance.",
                            },
                        ],
                        name: "create",
                        longname: "Docma.create",
                        kind: "function",
                        memberof: "Docma",
                        scope: "static",
                        params: [],
                        $longname: "Docma.create",
                        $kind: "method",
                        $docmaLink: "api/#Docma.create",
                    },
                    {
                        comment:
                            "/**\n *  Enumerates bitwise debug flags.\n *  @enum {Number}\n */",
                        meta: {
                            range: [45751, 46799],
                            filename: "Docma.js",
                            lineno: 1175,
                            columnno: 0,
                            path: "/Users/JPI/projects/prozi/docma/lib",
                            code: {
                                id: "astnode100003440",
                                name: "Docma.Debug",
                                type: "ObjectExpression",
                                value: '{"DISABLED":0,"BUILD_LOGS":1,"WEB_LOGS":2,"VERBOSE":4,"NO_MINIFY":8,"JSDOC_OUTPUT":16,"ALL":31}',
                                paramnames: [],
                            },
                        },
                        description: "Enumerates bitwise debug flags.",
                        kind: "member",
                        isEnum: true,
                        type: { names: ["Number"] },
                        name: "Debug",
                        longname: "Docma.Debug",
                        memberof: "Docma",
                        scope: "static",
                        properties: [
                            {
                                comment:
                                    "/**\n     *  Enables all debug flags.\n     *  @type {Number}\n     */",
                                meta: {
                                    range: [46789, 46796],
                                    filename: "Docma.js",
                                    lineno: 1215,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003457",
                                        name: "ALL",
                                        type: "Literal",
                                        value: 31,
                                    },
                                },
                                description: "Enables all debug flags.",
                                type: { names: ["Number"] },
                                name: "ALL",
                                longname: "Docma.Debug.ALL",
                                kind: "member",
                                memberof: "Docma.Debug",
                                scope: "static",
                                defaultvalue: 31,
                            },
                            {
                                comment:
                                    "/**\n     *  Outputs build logs to the Node console.\n     *  @type {Number}\n     */",
                                meta: {
                                    range: [45942, 45955],
                                    filename: "Docma.js",
                                    lineno: 1185,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003447",
                                        name: "BUILD_LOGS",
                                        type: "Literal",
                                        value: 1,
                                    },
                                },
                                description:
                                    "Outputs build logs to the Node console.",
                                type: { names: ["Number"] },
                                name: "BUILD_LOGS",
                                longname: "Docma.Debug.BUILD_LOGS",
                                kind: "member",
                                memberof: "Docma.Debug",
                                scope: "static",
                                defaultvalue: 1,
                            },
                            {
                                comment:
                                    "/**\n     *  Disables debugging.\n     *  @type {Number}\n     */",
                                meta: {
                                    range: [45838, 45849],
                                    filename: "Docma.js",
                                    lineno: 1180,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003445",
                                        name: "DISABLED",
                                        type: "Literal",
                                        value: 0,
                                    },
                                },
                                description: "Disables debugging.",
                                type: { names: ["Number"] },
                                name: "DISABLED",
                                longname: "Docma.Debug.DISABLED",
                                kind: "member",
                                memberof: "Docma.Debug",
                                scope: "static",
                                defaultvalue: 0,
                            },
                            {
                                comment:
                                    "/**\n     *  Outputs one or more `[name.]jsdoc.json` files that include\n     *  documentation data for each (grouped) javascript source.\n     *  `name` is the group name you give when you define the source\n     *  files. This is useful for investigating the raw JSDoc output.\n     *  @type {Number}\n     */",
                                meta: {
                                    range: [46695, 46711],
                                    filename: "Docma.js",
                                    lineno: 1210,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003455",
                                        name: "JSDOC_OUTPUT",
                                        type: "Literal",
                                        value: 16,
                                    },
                                },
                                description:
                                    "Outputs one or more `[name.]jsdoc.json` files that include\n documentation data for each (grouped) javascript source.\n `name` is the group name you give when you define the source\n files. This is useful for investigating the raw JSDoc output.",
                                type: { names: ["Number"] },
                                name: "JSDOC_OUTPUT",
                                longname: "Docma.Debug.JSDOC_OUTPUT",
                                kind: "member",
                                memberof: "Docma.Debug",
                                scope: "static",
                                defaultvalue: 16,
                            },
                            {
                                comment:
                                    "/**\n     *  Disables minification for the generated web app assets such as\n     *  Javascript files. This is useful if you're debugging a custom\n     *  Docma template.\n     *  @type {Number}\n     */",
                                meta: {
                                    range: [46367, 46379],
                                    filename: "Docma.js",
                                    lineno: 1202,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003453",
                                        name: "NO_MINIFY",
                                        type: "Literal",
                                        value: 8,
                                    },
                                },
                                description:
                                    "Disables minification for the generated web app assets such as\n Javascript files. This is useful if you're debugging a custom\n Docma template.",
                                type: { names: ["Number"] },
                                name: "NO_MINIFY",
                                longname: "Docma.Debug.NO_MINIFY",
                                kind: "member",
                                memberof: "Docma.Debug",
                                scope: "static",
                                defaultvalue: 8,
                            },
                            {
                                comment:
                                    "/**\n     *  Outputs verbose logs to consoles.\n     *  @type {Number}\n     */",
                                meta: {
                                    range: [46147, 46157],
                                    filename: "Docma.js",
                                    lineno: 1195,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003451",
                                        name: "VERBOSE",
                                        type: "Literal",
                                        value: 4,
                                    },
                                },
                                description:
                                    "Outputs verbose logs to consoles.",
                                type: { names: ["Number"] },
                                name: "VERBOSE",
                                longname: "Docma.Debug.VERBOSE",
                                kind: "member",
                                memberof: "Docma.Debug",
                                scope: "static",
                                defaultvalue: 4,
                            },
                            {
                                comment:
                                    "/**\n     *  Outputs app logs to the browser console.\n     *  @type {Number}\n     */",
                                meta: {
                                    range: [46049, 46060],
                                    filename: "Docma.js",
                                    lineno: 1190,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003449",
                                        name: "WEB_LOGS",
                                        type: "Literal",
                                        value: 2,
                                    },
                                },
                                description:
                                    "Outputs app logs to the browser console.",
                                type: { names: ["Number"] },
                                name: "WEB_LOGS",
                                longname: "Docma.Debug.WEB_LOGS",
                                kind: "member",
                                memberof: "Docma.Debug",
                                scope: "static",
                                defaultvalue: 2,
                            },
                        ],
                        $longname: "Docma.Debug",
                        $kind: "enum",
                        $docmaLink: "api/#Docma.Debug",
                        $members: [
                            {
                                comment:
                                    "/**\n     *  Enables all debug flags.\n     *  @type {Number}\n     */",
                                meta: {
                                    range: [46789, 46796],
                                    filename: "Docma.js",
                                    lineno: 1215,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003457",
                                        name: "ALL",
                                        type: "Literal",
                                        value: 31,
                                    },
                                },
                                description: "Enables all debug flags.",
                                type: { names: ["Number"] },
                                name: "ALL",
                                longname: "Docma.Debug.ALL",
                                kind: "member",
                                memberof: "Docma.Debug",
                                scope: "static",
                                defaultvalue: 31,
                                $longname: "Docma.Debug.ALL",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Debug.ALL",
                            },
                            {
                                comment:
                                    "/**\n     *  Outputs build logs to the Node console.\n     *  @type {Number}\n     */",
                                meta: {
                                    range: [45942, 45955],
                                    filename: "Docma.js",
                                    lineno: 1185,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003447",
                                        name: "BUILD_LOGS",
                                        type: "Literal",
                                        value: 1,
                                    },
                                },
                                description:
                                    "Outputs build logs to the Node console.",
                                type: { names: ["Number"] },
                                name: "BUILD_LOGS",
                                longname: "Docma.Debug.BUILD_LOGS",
                                kind: "member",
                                memberof: "Docma.Debug",
                                scope: "static",
                                defaultvalue: 1,
                                $longname: "Docma.Debug.BUILD_LOGS",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Debug.BUILD_LOGS",
                            },
                            {
                                comment:
                                    "/**\n     *  Disables debugging.\n     *  @type {Number}\n     */",
                                meta: {
                                    range: [45838, 45849],
                                    filename: "Docma.js",
                                    lineno: 1180,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003445",
                                        name: "DISABLED",
                                        type: "Literal",
                                        value: 0,
                                    },
                                },
                                description: "Disables debugging.",
                                type: { names: ["Number"] },
                                name: "DISABLED",
                                longname: "Docma.Debug.DISABLED",
                                kind: "member",
                                memberof: "Docma.Debug",
                                scope: "static",
                                defaultvalue: 0,
                                $longname: "Docma.Debug.DISABLED",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Debug.DISABLED",
                            },
                            {
                                comment:
                                    "/**\n     *  Outputs one or more `[name.]jsdoc.json` files that include\n     *  documentation data for each (grouped) javascript source.\n     *  `name` is the group name you give when you define the source\n     *  files. This is useful for investigating the raw JSDoc output.\n     *  @type {Number}\n     */",
                                meta: {
                                    range: [46695, 46711],
                                    filename: "Docma.js",
                                    lineno: 1210,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003455",
                                        name: "JSDOC_OUTPUT",
                                        type: "Literal",
                                        value: 16,
                                    },
                                },
                                description:
                                    "Outputs one or more `[name.]jsdoc.json` files that include\n documentation data for each (grouped) javascript source.\n `name` is the group name you give when you define the source\n files. This is useful for investigating the raw JSDoc output.",
                                type: { names: ["Number"] },
                                name: "JSDOC_OUTPUT",
                                longname: "Docma.Debug.JSDOC_OUTPUT",
                                kind: "member",
                                memberof: "Docma.Debug",
                                scope: "static",
                                defaultvalue: 16,
                                $longname: "Docma.Debug.JSDOC_OUTPUT",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Debug.JSDOC_OUTPUT",
                            },
                            {
                                comment:
                                    "/**\n     *  Disables minification for the generated web app assets such as\n     *  Javascript files. This is useful if you're debugging a custom\n     *  Docma template.\n     *  @type {Number}\n     */",
                                meta: {
                                    range: [46367, 46379],
                                    filename: "Docma.js",
                                    lineno: 1202,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003453",
                                        name: "NO_MINIFY",
                                        type: "Literal",
                                        value: 8,
                                    },
                                },
                                description:
                                    "Disables minification for the generated web app assets such as\n Javascript files. This is useful if you're debugging a custom\n Docma template.",
                                type: { names: ["Number"] },
                                name: "NO_MINIFY",
                                longname: "Docma.Debug.NO_MINIFY",
                                kind: "member",
                                memberof: "Docma.Debug",
                                scope: "static",
                                defaultvalue: 8,
                                $longname: "Docma.Debug.NO_MINIFY",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Debug.NO_MINIFY",
                            },
                            {
                                comment:
                                    "/**\n     *  Outputs verbose logs to consoles.\n     *  @type {Number}\n     */",
                                meta: {
                                    range: [46147, 46157],
                                    filename: "Docma.js",
                                    lineno: 1195,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003451",
                                        name: "VERBOSE",
                                        type: "Literal",
                                        value: 4,
                                    },
                                },
                                description:
                                    "Outputs verbose logs to consoles.",
                                type: { names: ["Number"] },
                                name: "VERBOSE",
                                longname: "Docma.Debug.VERBOSE",
                                kind: "member",
                                memberof: "Docma.Debug",
                                scope: "static",
                                defaultvalue: 4,
                                $longname: "Docma.Debug.VERBOSE",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Debug.VERBOSE",
                            },
                            {
                                comment:
                                    "/**\n     *  Outputs app logs to the browser console.\n     *  @type {Number}\n     */",
                                meta: {
                                    range: [46049, 46060],
                                    filename: "Docma.js",
                                    lineno: 1190,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003449",
                                        name: "WEB_LOGS",
                                        type: "Literal",
                                        value: 2,
                                    },
                                },
                                description:
                                    "Outputs app logs to the browser console.",
                                type: { names: ["Number"] },
                                name: "WEB_LOGS",
                                longname: "Docma.Debug.WEB_LOGS",
                                kind: "member",
                                memberof: "Docma.Debug",
                                scope: "static",
                                defaultvalue: 2,
                                $longname: "Docma.Debug.WEB_LOGS",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Debug.WEB_LOGS",
                            },
                        ],
                    },
                    {
                        comment:
                            '/**\n *  Enumerates Docma SPA route types.\n *  @enum {String}\n *  @readonly\n *\n *  @example <caption>Routing Method: <code>"query"</code></caption>\n *  type     name              path\n *  -------  ----------------  --------------------------\n *  api      _def_             ?api\n *  api      web               ?api=web\n *  content  templates         ?content=templates\n *  content  guide             ?content=guide\n *\n *  @example <caption>Routing Method: <code>"path"</code></caption>\n *  type     name              path\n *  -------  ----------------  --------------------------\n *  api      _def_             api/\n *  api      web               api/web/\n *  content  templates         templates/\n *  content  guide             guide/\n */',
                        meta: {
                            range: [44183, 44534],
                            filename: "Docma.js",
                            lineno: 1119,
                            columnno: 0,
                            path: "/Users/JPI/projects/prozi/docma/lib",
                            code: {
                                id: "astnode100003416",
                                name: "Docma.RouteType",
                                type: "ObjectExpression",
                                value: '{"API":"api","CONTENT":"content"}',
                                paramnames: [],
                            },
                        },
                        description: "Enumerates Docma SPA route types.",
                        kind: "member",
                        isEnum: true,
                        type: { names: ["String"] },
                        readonly: true,
                        examples: [
                            '<caption>Routing Method: <code>"query"</code></caption>\n type     name              path\n -------  ----------------  --------------------------\n api      _def_             ?api\n api      web               ?api=web\n content  templates         ?content=templates\n content  guide             ?content=guide\n\n ',
                            '<caption>Routing Method: <code>"path"</code></caption>\n type     name              path\n -------  ----------------  --------------------------\n api      _def_             api/\n api      web               api/web/\n content  templates         templates/\n content  guide             guide/',
                        ],
                        name: "RouteType",
                        longname: "Docma.RouteType",
                        memberof: "Docma",
                        scope: "static",
                        properties: [
                            {
                                comment:
                                    "/**\n     *  Indicates a route for API documentation content, generated from\n     *  Javascript source files via JSDoc.\n     *  @type {String}\n     */",
                                meta: {
                                    range: [44361, 44371],
                                    filename: "Docma.js",
                                    lineno: 1125,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003421",
                                        name: "API",
                                        type: "Literal",
                                        value: "api",
                                    },
                                },
                                description:
                                    "Indicates a route for API documentation content, generated from\n Javascript source files via JSDoc.",
                                type: { names: ["String"] },
                                name: "API",
                                longname: "Docma.RouteType.API",
                                kind: "member",
                                memberof: "Docma.RouteType",
                                scope: "static",
                                defaultvalue: "api",
                            },
                            {
                                comment:
                                    "/**\n     *  Indicates a route for other content, such as HTML files generated\n     *  from markdown.\n     *  @type {String}\n     */",
                                meta: {
                                    range: [44513, 44531],
                                    filename: "Docma.js",
                                    lineno: 1131,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003423",
                                        name: "CONTENT",
                                        type: "Literal",
                                        value: "content",
                                    },
                                },
                                description:
                                    "Indicates a route for other content, such as HTML files generated\n from markdown.",
                                type: { names: ["String"] },
                                name: "CONTENT",
                                longname: "Docma.RouteType.CONTENT",
                                kind: "member",
                                memberof: "Docma.RouteType",
                                scope: "static",
                                defaultvalue: "content",
                            },
                        ],
                        $longname: "Docma.RouteType",
                        $kind: "enum",
                        $docmaLink: "api/#Docma.RouteType",
                        $members: [
                            {
                                comment:
                                    "/**\n     *  Indicates a route for API documentation content, generated from\n     *  Javascript source files via JSDoc.\n     *  @type {String}\n     */",
                                meta: {
                                    range: [44361, 44371],
                                    filename: "Docma.js",
                                    lineno: 1125,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003421",
                                        name: "API",
                                        type: "Literal",
                                        value: "api",
                                    },
                                },
                                description:
                                    "Indicates a route for API documentation content, generated from\n Javascript source files via JSDoc.",
                                type: { names: ["String"] },
                                name: "API",
                                longname: "Docma.RouteType.API",
                                kind: "member",
                                memberof: "Docma.RouteType",
                                scope: "static",
                                defaultvalue: "api",
                                $longname: "Docma.RouteType.API",
                                $kind: "property",
                                $docmaLink: "api/#Docma.RouteType.API",
                            },
                            {
                                comment:
                                    "/**\n     *  Indicates a route for other content, such as HTML files generated\n     *  from markdown.\n     *  @type {String}\n     */",
                                meta: {
                                    range: [44513, 44531],
                                    filename: "Docma.js",
                                    lineno: 1131,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003423",
                                        name: "CONTENT",
                                        type: "Literal",
                                        value: "content",
                                    },
                                },
                                description:
                                    "Indicates a route for other content, such as HTML files generated\n from markdown.",
                                type: { names: ["String"] },
                                name: "CONTENT",
                                longname: "Docma.RouteType.CONTENT",
                                kind: "member",
                                memberof: "Docma.RouteType",
                                scope: "static",
                                defaultvalue: "content",
                                $longname: "Docma.RouteType.CONTENT",
                                $kind: "property",
                                $docmaLink: "api/#Docma.RouteType.CONTENT",
                            },
                        ],
                    },
                    {
                        comment:
                            "/**\n *  Enumerates the routing methods for a Docma generated web application.\n *  @enum {String}\n *  @readonly\n */",
                        meta: {
                            range: [42437, 43442],
                            filename: "Docma.js",
                            lineno: 1075,
                            columnno: 0,
                            path: "/Users/JPI/projects/prozi/docma/lib",
                            code: {
                                id: "astnode100003406",
                                name: "Docma.RoutingMethod",
                                type: "ObjectExpression",
                                value: '{"QUERY":"query","PATH":"path"}',
                                paramnames: [],
                            },
                        },
                        description:
                            "Enumerates the routing methods for a Docma generated web application.",
                        kind: "member",
                        isEnum: true,
                        type: { names: ["String"] },
                        readonly: true,
                        name: "RoutingMethod",
                        longname: "Docma.RoutingMethod",
                        memberof: "Docma",
                        scope: "static",
                        properties: [
                            {
                                comment:
                                    '/**\n     *  Indicates that the SPA routes are based on path params rather than\n     *  query-strings. For example, for a named group of JS source files\n     *  (e.g. `"mylib"`), the generated documentation will be accessible at\n     *  `api/mylib/`. Ungrouped JS documentation will be accessible at `api/`.\n     *  And for other HTML content such as files generated from markdown\n     *  files (e.g. README.md) will be accessible at `readme/`.\n     *  @type {String}\n     */',
                                meta: {
                                    range: [43427, 43439],
                                    filename: "Docma.js",
                                    lineno: 1095,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003413",
                                        name: "PATH",
                                        type: "Literal",
                                        value: "path",
                                    },
                                },
                                description:
                                    'Indicates that the SPA routes are based on path params rather than\n query-strings. For example, for a named group of JS source files\n (e.g. `"mylib"`), the generated documentation will be accessible at\n `api/mylib/`. Ungrouped JS documentation will be accessible at `api/`.\n And for other HTML content such as files generated from markdown\n files (e.g. README.md) will be accessible at `readme/`.',
                                type: { names: ["String"] },
                                name: "PATH",
                                longname: "Docma.RoutingMethod.PATH",
                                kind: "member",
                                memberof: "Docma.RoutingMethod",
                                scope: "static",
                                defaultvalue: "path",
                            },
                            {
                                comment:
                                    '/**\n     *  Indicates that the SPA routes are based on query-strings.\n     *  For example, for a named group of JS source files (e.g. `"mylib"`),\n     *  the generated documentation will be accessible at `?api=mylib`.\n     *  Ungrouped JS documentation will be accessible at `?api`.\n     *  And for other HTML content such as files generated from markdown\n     *  files (e.g. README.md) will be accessible at `?content=readme`.\n     *  @type {String}\n     */',
                                meta: {
                                    range: [42928, 42942],
                                    filename: "Docma.js",
                                    lineno: 1085,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003411",
                                        name: "QUERY",
                                        type: "Literal",
                                        value: "query",
                                    },
                                },
                                description:
                                    'Indicates that the SPA routes are based on query-strings.\n For example, for a named group of JS source files (e.g. `"mylib"`),\n the generated documentation will be accessible at `?api=mylib`.\n Ungrouped JS documentation will be accessible at `?api`.\n And for other HTML content such as files generated from markdown\n files (e.g. README.md) will be accessible at `?content=readme`.',
                                type: { names: ["String"] },
                                name: "QUERY",
                                longname: "Docma.RoutingMethod.QUERY",
                                kind: "member",
                                memberof: "Docma.RoutingMethod",
                                scope: "static",
                                defaultvalue: "query",
                            },
                        ],
                        $longname: "Docma.RoutingMethod",
                        $kind: "enum",
                        $docmaLink: "api/#Docma.RoutingMethod",
                        $members: [
                            {
                                comment:
                                    '/**\n     *  Indicates that the SPA routes are based on path params rather than\n     *  query-strings. For example, for a named group of JS source files\n     *  (e.g. `"mylib"`), the generated documentation will be accessible at\n     *  `api/mylib/`. Ungrouped JS documentation will be accessible at `api/`.\n     *  And for other HTML content such as files generated from markdown\n     *  files (e.g. README.md) will be accessible at `readme/`.\n     *  @type {String}\n     */',
                                meta: {
                                    range: [43427, 43439],
                                    filename: "Docma.js",
                                    lineno: 1095,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003413",
                                        name: "PATH",
                                        type: "Literal",
                                        value: "path",
                                    },
                                },
                                description:
                                    'Indicates that the SPA routes are based on path params rather than\n query-strings. For example, for a named group of JS source files\n (e.g. `"mylib"`), the generated documentation will be accessible at\n `api/mylib/`. Ungrouped JS documentation will be accessible at `api/`.\n And for other HTML content such as files generated from markdown\n files (e.g. README.md) will be accessible at `readme/`.',
                                type: { names: ["String"] },
                                name: "PATH",
                                longname: "Docma.RoutingMethod.PATH",
                                kind: "member",
                                memberof: "Docma.RoutingMethod",
                                scope: "static",
                                defaultvalue: "path",
                                $longname: "Docma.RoutingMethod.PATH",
                                $kind: "property",
                                $docmaLink: "api/#Docma.RoutingMethod.PATH",
                            },
                            {
                                comment:
                                    '/**\n     *  Indicates that the SPA routes are based on query-strings.\n     *  For example, for a named group of JS source files (e.g. `"mylib"`),\n     *  the generated documentation will be accessible at `?api=mylib`.\n     *  Ungrouped JS documentation will be accessible at `?api`.\n     *  And for other HTML content such as files generated from markdown\n     *  files (e.g. README.md) will be accessible at `?content=readme`.\n     *  @type {String}\n     */',
                                meta: {
                                    range: [42928, 42942],
                                    filename: "Docma.js",
                                    lineno: 1085,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003411",
                                        name: "QUERY",
                                        type: "Literal",
                                        value: "query",
                                    },
                                },
                                description:
                                    'Indicates that the SPA routes are based on query-strings.\n For example, for a named group of JS source files (e.g. `"mylib"`),\n the generated documentation will be accessible at `?api=mylib`.\n Ungrouped JS documentation will be accessible at `?api`.\n And for other HTML content such as files generated from markdown\n files (e.g. README.md) will be accessible at `?content=readme`.',
                                type: { names: ["String"] },
                                name: "QUERY",
                                longname: "Docma.RoutingMethod.QUERY",
                                kind: "member",
                                memberof: "Docma.RoutingMethod",
                                scope: "static",
                                defaultvalue: "query",
                                $longname: "Docma.RoutingMethod.QUERY",
                                $kind: "property",
                                $docmaLink: "api/#Docma.RoutingMethod.QUERY",
                            },
                        ],
                    },
                    {
                        comment:
                            '/**\n *  Enumerates the server/host types for Docma generated SPA.\n *  The generated SPA is not limited to these hosts but Docma will generate\n *  additional server config files for these hosts; especially if the\n *  routing method is set to `"path"`. For example, for Apache;\n *  an `.htaccess` file will be auto-generated with redirect rules for\n *  (sub) routes. For GitHub, sub-directories will be generated\n *  (just like Jekyll) with index files for redirecting via http-meta\n *  refresh.\n *  @enum {String}\n *  @readonly\n */',
                        meta: {
                            range: [45068, 45685],
                            filename: "Docma.js",
                            lineno: 1146,
                            columnno: 0,
                            path: "/Users/JPI/projects/prozi/docma/lib",
                            code: {
                                id: "astnode100003426",
                                name: "Docma.ServerType",
                                type: "ObjectExpression",
                                value: '{"APACHE":"apache","GITHUB":"github","STATIC":"static","WINDOWS":"windows"}',
                                paramnames: [],
                            },
                        },
                        description:
                            'Enumerates the server/host types for Docma generated SPA.\n The generated SPA is not limited to these hosts but Docma will generate\n additional server config files for these hosts; especially if the\n routing method is set to `"path"`. For example, for Apache;\n an `.htaccess` file will be auto-generated with redirect rules for\n (sub) routes. For GitHub, sub-directories will be generated\n (just like Jekyll) with index files for redirecting via http-meta\n refresh.',
                        kind: "member",
                        isEnum: true,
                        type: { names: ["String"] },
                        readonly: true,
                        name: "ServerType",
                        longname: "Docma.ServerType",
                        memberof: "Docma",
                        scope: "static",
                        properties: [
                            {
                                comment:
                                    "/**\n     *  Indicates that an Apache server will be hosting the generated SPA.\n     *  @type {String}\n     */",
                                meta: {
                                    range: [45207, 45223],
                                    filename: "Docma.js",
                                    lineno: 1151,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003431",
                                        name: "APACHE",
                                        type: "Literal",
                                        value: "apache",
                                    },
                                },
                                description:
                                    "Indicates that an Apache server will be hosting the generated SPA.",
                                type: { names: ["String"] },
                                name: "APACHE",
                                longname: "Docma.ServerType.APACHE",
                                kind: "member",
                                memberof: "Docma.ServerType",
                                scope: "static",
                                defaultvalue: "apache",
                            },
                            {
                                comment:
                                    "/**\n     *  Indicates that SPA will be hosted via\n     *  {@link https://pages.github.com|GitHub Pages}.\n     *  @type {String}\n     */",
                                meta: {
                                    range: [45369, 45385],
                                    filename: "Docma.js",
                                    lineno: 1157,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003433",
                                        name: "GITHUB",
                                        type: "Literal",
                                        value: "github",
                                    },
                                },
                                description:
                                    "Indicates that SPA will be hosted via\n {@link https://pages.github.com|GitHub Pages}.",
                                type: { names: ["String"] },
                                name: "GITHUB",
                                longname: "Docma.ServerType.GITHUB",
                                kind: "member",
                                memberof: "Docma.ServerType",
                                scope: "static",
                                defaultvalue: "github",
                            },
                            {
                                comment:
                                    "/**\n     *  Indicates that SPA will be hosted as static HTML files.\n     *  Similar to `Docma.ServerType.GITHUB`.\n     *  @type {String}\n     */",
                                meta: {
                                    range: [45540, 45556],
                                    filename: "Docma.js",
                                    lineno: 1163,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003435",
                                        name: "STATIC",
                                        type: "Literal",
                                        value: "static",
                                    },
                                },
                                description:
                                    "Indicates that SPA will be hosted as static HTML files.\n Similar to `Docma.ServerType.GITHUB`.",
                                type: { names: ["String"] },
                                name: "STATIC",
                                longname: "Docma.ServerType.STATIC",
                                kind: "member",
                                memberof: "Docma.ServerType",
                                scope: "static",
                                defaultvalue: "static",
                            },
                            {
                                comment:
                                    "/**\n     *  Indicates that SPA will be hosted on a Windows server.\n     *  @type {String}\n     */",
                                meta: {
                                    range: [45664, 45682],
                                    filename: "Docma.js",
                                    lineno: 1168,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003437",
                                        name: "WINDOWS",
                                        type: "Literal",
                                        value: "windows",
                                    },
                                },
                                description:
                                    "Indicates that SPA will be hosted on a Windows server.",
                                type: { names: ["String"] },
                                name: "WINDOWS",
                                longname: "Docma.ServerType.WINDOWS",
                                kind: "member",
                                memberof: "Docma.ServerType",
                                scope: "static",
                                defaultvalue: "windows",
                            },
                        ],
                        $longname: "Docma.ServerType",
                        $kind: "enum",
                        $docmaLink: "api/#Docma.ServerType",
                        $members: [
                            {
                                comment:
                                    "/**\n     *  Indicates that an Apache server will be hosting the generated SPA.\n     *  @type {String}\n     */",
                                meta: {
                                    range: [45207, 45223],
                                    filename: "Docma.js",
                                    lineno: 1151,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003431",
                                        name: "APACHE",
                                        type: "Literal",
                                        value: "apache",
                                    },
                                },
                                description:
                                    "Indicates that an Apache server will be hosting the generated SPA.",
                                type: { names: ["String"] },
                                name: "APACHE",
                                longname: "Docma.ServerType.APACHE",
                                kind: "member",
                                memberof: "Docma.ServerType",
                                scope: "static",
                                defaultvalue: "apache",
                                $longname: "Docma.ServerType.APACHE",
                                $kind: "property",
                                $docmaLink: "api/#Docma.ServerType.APACHE",
                            },
                            {
                                comment:
                                    "/**\n     *  Indicates that SPA will be hosted via\n     *  {@link https://pages.github.com|GitHub Pages}.\n     *  @type {String}\n     */",
                                meta: {
                                    range: [45369, 45385],
                                    filename: "Docma.js",
                                    lineno: 1157,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003433",
                                        name: "GITHUB",
                                        type: "Literal",
                                        value: "github",
                                    },
                                },
                                description:
                                    "Indicates that SPA will be hosted via\n {@link https://pages.github.com|GitHub Pages}.",
                                type: { names: ["String"] },
                                name: "GITHUB",
                                longname: "Docma.ServerType.GITHUB",
                                kind: "member",
                                memberof: "Docma.ServerType",
                                scope: "static",
                                defaultvalue: "github",
                                $longname: "Docma.ServerType.GITHUB",
                                $kind: "property",
                                $docmaLink: "api/#Docma.ServerType.GITHUB",
                            },
                            {
                                comment:
                                    "/**\n     *  Indicates that SPA will be hosted as static HTML files.\n     *  Similar to `Docma.ServerType.GITHUB`.\n     *  @type {String}\n     */",
                                meta: {
                                    range: [45540, 45556],
                                    filename: "Docma.js",
                                    lineno: 1163,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003435",
                                        name: "STATIC",
                                        type: "Literal",
                                        value: "static",
                                    },
                                },
                                description:
                                    "Indicates that SPA will be hosted as static HTML files.\n Similar to `Docma.ServerType.GITHUB`.",
                                type: { names: ["String"] },
                                name: "STATIC",
                                longname: "Docma.ServerType.STATIC",
                                kind: "member",
                                memberof: "Docma.ServerType",
                                scope: "static",
                                defaultvalue: "static",
                                $longname: "Docma.ServerType.STATIC",
                                $kind: "property",
                                $docmaLink: "api/#Docma.ServerType.STATIC",
                            },
                            {
                                comment:
                                    "/**\n     *  Indicates that SPA will be hosted on a Windows server.\n     *  @type {String}\n     */",
                                meta: {
                                    range: [45664, 45682],
                                    filename: "Docma.js",
                                    lineno: 1168,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {
                                        id: "astnode100003437",
                                        name: "WINDOWS",
                                        type: "Literal",
                                        value: "windows",
                                    },
                                },
                                description:
                                    "Indicates that SPA will be hosted on a Windows server.",
                                type: { names: ["String"] },
                                name: "WINDOWS",
                                longname: "Docma.ServerType.WINDOWS",
                                kind: "member",
                                memberof: "Docma.ServerType",
                                scope: "static",
                                defaultvalue: "windows",
                                $longname: "Docma.ServerType.WINDOWS",
                                $kind: "property",
                                $docmaLink: "api/#Docma.ServerType.WINDOWS",
                            },
                        ],
                    },
                    {
                        comment:
                            "/**\n *  <blockquote>This class is useful for template authors only.</blockquote>\n *\n *  Class that provides template information and methods for supporting the\n *  documentation build process.\n *\n *  You should not instantiate this class directly with a `new` operator. Docma\n *  passes an instance of this class to your template module as the first\n *  argument; when the end-user builds their documentation.\n *\n *  See {@link templates/guide/|Creating Docma Templates}.\n *  You can also use {@link cli/#docma-template-init--path-|Docma CLI}\n *  to initialize a new Docma template project. i.e. `docma template init`. This will\n *  generate most files required to author a template; including a main JS file for\n *  your module; as shown below in the example.\n *\n *  @class\n *  @name Docma.Template\n *  @since 2.0.0\n *\n *  @example <caption>Custom template module implementation</caption>\n *  module.exports = (template, modules) => {\n *\n *     // Docma also passes some useful modules (which it already uses internally);\n *     // so you don't have to add them to your template module as dependencies.\n *     // modules: _ (Lodash), Promise (Bluebird), fs (fs-extra), dust, HtmlParser, utils\n *     const { Promise } = modules;\n *\n *     template.mainHTML = 'index.html';\n *\n *     template.defaultOptions = {\n *         // whatever options your template has...\n *         title: 'Docs',\n *         searchEnabled: true\n *     };\n *\n *     template.preBuild(() => {\n *         // Do some stuff —before— Docma builds documentation for the end-user...\n *         return Promise.resolve();\n *     });\n *\n *     template.postBuild(() => {\n *         // Do some stuff —after— the build completes...\n *         return Promise.resolve();\n *     });\n *  };\n */",
                        meta: {
                            filename: "Template.js",
                            lineno: 18,
                            columnno: 0,
                            path: "/Users/JPI/projects/prozi/docma/lib",
                            code: {},
                        },
                        description:
                            "<blockquote>This class is useful for template authors only.</blockquote>\n\n Class that provides template information and methods for supporting the\n documentation build process.\n\n You should not instantiate this class directly with a `new` operator. Docma\n passes an instance of this class to your template module as the first\n argument; when the end-user builds their documentation.\n\n See {@link templates/guide/|Creating Docma Templates}.\n You can also use {@link cli/#docma-template-init--path-|Docma CLI}\n to initialize a new Docma template project. i.e. `docma template init`. This will\n generate most files required to author a template; including a main JS file for\n your module; as shown below in the example.",
                        kind: "class",
                        name: "Template",
                        since: "2.0.0",
                        examples: [
                            "<caption>Custom template module implementation</caption>\n module.exports = (template, modules) => {\n\n    // Docma also passes some useful modules (which it already uses internally);\n    // so you don't have to add them to your template module as dependencies.\n    // modules: _ (Lodash), Promise (Bluebird), fs (fs-extra), dust, HtmlParser, utils\n    const { Promise } = modules;\n\n    template.mainHTML = 'index.html';\n\n    template.defaultOptions = {\n        // whatever options your template has...\n        title: 'Docs',\n        searchEnabled: true\n    };\n\n    template.preBuild(() => {\n        // Do some stuff —before— Docma builds documentation for the end-user...\n        return Promise.resolve();\n    });\n\n    template.postBuild(() => {\n        // Do some stuff —after— the build completes...\n        return Promise.resolve();\n    });\n };",
                        ],
                        memberof: "Docma",
                        longname: "Docma.Template",
                        scope: "static",
                        $longname: "Docma.Template",
                        $kind: "class",
                        $docmaLink: "api/#Docma.Template",
                        $members: [
                            {
                                comment:
                                    "/**\n     *  Gets the author of the template.\n     *  @type {String}\n     *  @name Docma.Template#author\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 176,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description: "Gets the author of the template.",
                                type: { names: ["String"] },
                                name: "author",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#author",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#author",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Template#author",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets the build configuration used when building documentation with this\n     *  template.\n     *  @type {Docma~BuildConfiguration}\n     *  @name Docma.Template#buildConfig\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 221,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets the build configuration used when building documentation with this\n template.",
                                type: { names: ["Docma~BuildConfiguration"] },
                                name: "buildConfig",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#buildConfig",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#buildConfig",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Template#buildConfig",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets the simple debugger/logger used by Dogma.\n     *  @type {Docma~Debug}\n     *  @name Docma.Template#debug\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 231,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets the simple debugger/logger used by Dogma.",
                                type: { names: ["Docma~Debug"] },
                                name: "debug",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#debug",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#debug",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Template#debug",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets or sets the default options of the template.\n     *  Default options can be set within the module main JS file or via\n     *  `docmaTemplate.defaultOptions` within template's package.json.\n     *  @type {Object}\n     *  @name Docma.Template#defaultOptions\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 240,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets or sets the default options of the template.\n Default options can be set within the module main JS file or via\n `docmaTemplate.defaultOptions` within template's package.json.",
                                type: { names: ["Object"] },
                                name: "defaultOptions",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#defaultOptions",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#defaultOptions",
                                $kind: "property",
                                $docmaLink:
                                    "api/#Docma.Template#defaultOptions",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets the description of the template.\n     *  @type {String}\n     *  @name Docma.Template#description\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 138,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets the description of the template.",
                                type: { names: ["String"] },
                                name: "description",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#description",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#description",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Template#description",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets the dirname of the template.\n     *  @type {String}\n     *  @name Docma.Template#dirname\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 203,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets the dirname of the template.",
                                type: { names: ["String"] },
                                name: "dirname",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#dirname",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#dirname",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Template#dirname",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets Docma version, template is built with.\n     *  @type {String}\n     *  @name Docma.Template#docmaVersion\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 156,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets Docma version, template is built with.",
                                type: { names: ["String"] },
                                name: "docmaVersion",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#docmaVersion",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#docmaVersion",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Template#docmaVersion",
                            },
                            {
                                comment:
                                    '/**\n     *  Convenience method for joining and getting the destination path within\n     *  build (output) directory for the given string(s).\n     *  @name Docma.Template#getDestPath\n     *  @function\n     *  @param {...String} [args=""] - String arguments of path sections.\n     *  @returns {String} -\n     */',
                                meta: {
                                    filename: "Template.js",
                                    lineno: 328,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Convenience method for joining and getting the destination path within\n build (output) directory for the given string(s).",
                                name: "getDestPath",
                                kind: "function",
                                params: [
                                    {
                                        type: { names: ["String"] },
                                        optional: true,
                                        variable: true,
                                        defaultvalue: '""',
                                        description:
                                            "String arguments of path sections.",
                                        name: "args",
                                    },
                                ],
                                returns: [
                                    {
                                        type: { names: ["String"] },
                                        description: "-",
                                    },
                                ],
                                memberof: "Docma.Template",
                                longname: "Docma.Template#getDestPath",
                                scope: "instance",
                                $longname: "Docma.Template#getDestPath",
                                $kind: "method",
                                $docmaLink: "api/#Docma.Template#getDestPath",
                            },
                            {
                                comment:
                                    '/**\n     *  Convenience method for joining and getting the source path within\n     *  `<root>/template` directory for the given string(s).\n     *  @name Docma.Template#getSrcPath\n     *  @function\n     *  @param {...String} [args=""] - String arguments of path sections.\n     *  @returns {String} -\n     */',
                                meta: {
                                    filename: "Template.js",
                                    lineno: 316,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Convenience method for joining and getting the source path within\n `<root>/template` directory for the given string(s).",
                                name: "getSrcPath",
                                kind: "function",
                                params: [
                                    {
                                        type: { names: ["String"] },
                                        optional: true,
                                        variable: true,
                                        defaultvalue: '""',
                                        description:
                                            "String arguments of path sections.",
                                        name: "args",
                                    },
                                ],
                                returns: [
                                    {
                                        type: { names: ["String"] },
                                        description: "-",
                                    },
                                ],
                                memberof: "Docma.Template",
                                longname: "Docma.Template#getSrcPath",
                                scope: "instance",
                                $longname: "Docma.Template#getSrcPath",
                                $kind: "method",
                                $docmaLink: "api/#Docma.Template#getSrcPath",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets or sets array of ignored files when building documentation with\n     *  this template. Ignored files can be set within the module main JS file\n     *  or via `docmaTemplate.ignore` within template's package.json.\n     *  @type {Array}\n     *  @name Docma.Template#ignore\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 291,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets or sets array of ignored files when building documentation with\n this template. Ignored files can be set within the module main JS file\n or via `docmaTemplate.ignore` within template's package.json.",
                                type: { names: ["Array"] },
                                name: "ignore",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#ignore",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#ignore",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Template#ignore",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets the license of the template.\n     *  @type {String}\n     *  @name Docma.Template#license\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 185,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets the license of the template.",
                                type: { names: ["String"] },
                                name: "license",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#license",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#license",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Template#license",
                            },
                            {
                                comment:
                                    '/**\n     *  Outputs a data log to the console. For more logger/debugger methods, use\n     *  {@link api/#Docma.Template#debug|`#debug`} object.\n     *  @name Docma.Template#log\n     *  @function\n     *  @param {...String} [args=""] - String arguments to be logged.\n     */',
                                meta: {
                                    filename: "Template.js",
                                    lineno: 305,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Outputs a data log to the console. For more logger/debugger methods, use\n {@link api/#Docma.Template#debug|`#debug`} object.",
                                name: "log",
                                kind: "function",
                                params: [
                                    {
                                        type: { names: ["String"] },
                                        optional: true,
                                        variable: true,
                                        defaultvalue: '""',
                                        description:
                                            "String arguments to be logged.",
                                        name: "args",
                                    },
                                ],
                                memberof: "Docma.Template",
                                longname: "Docma.Template#log",
                                scope: "instance",
                                $longname: "Docma.Template#log",
                                $kind: "method",
                                $docmaLink: "api/#Docma.Template#log",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets or sets the main HTML file (name) of the template.\n     *  Main HTML file can be set within the module main JS file or via\n     *  `docmaTemplate.mainHTML` within template's package.json.\n     *  @type {String}\n     *  @name Docma.Template#mainHTML\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 275,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets or sets the main HTML file (name) of the template.\n Main HTML file can be set within the module main JS file or via\n `docmaTemplate.mainHTML` within template's package.json.",
                                type: { names: ["String"] },
                                name: "mainHTML",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#mainHTML",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#mainHTML",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Template#mainHTML",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets the name of the template.\n     *  @type {String}\n     *  @name Docma.Template#name\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 129,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description: "Gets the name of the template.",
                                type: { names: ["String"] },
                                name: "name",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#name",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#name",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Template#name",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets or sets the template options set by the user when building\n     *  documentation with this template.\n     *  @type {Object}\n     *  @name Docma.Template#options\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 262,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets or sets the template options set by the user when building\n documentation with this template.",
                                type: { names: ["Object"] },
                                name: "options",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#options",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#options",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Template#options",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets the path of the template.\n     *  @type {String}\n     *  @name Docma.Template#path\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 194,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description: "Gets the path of the template.",
                                type: { names: ["String"] },
                                name: "path",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#path",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#path",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Template#path",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets the package.json contents of the template.\n     *  @type {Object}\n     *  @name Docma.Template#pkg\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 120,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets the package.json contents of the template.",
                                type: { names: ["Object"] },
                                name: "pkg",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#pkg",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#pkg",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Template#pkg",
                            },
                            {
                                comment:
                                    "/**\n     *  Sets a post-build processor function that is ran right after Docma build\n     *  completes.\n     *  @name Docma.Template#postBuild\n     *  @function\n     *  @param {Function} fn - Processor function. You can return a `Promise` if\n     *  this is an async operation.\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 352,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Sets a post-build processor function that is ran right after Docma build\n completes.",
                                name: "postBuild",
                                kind: "function",
                                params: [
                                    {
                                        type: { names: ["function"] },
                                        description:
                                            "Processor function. You can return a `Promise` if\n this is an async operation.",
                                        name: "fn",
                                    },
                                ],
                                memberof: "Docma.Template",
                                longname: "Docma.Template#postBuild",
                                scope: "instance",
                                $longname: "Docma.Template#postBuild",
                                $kind: "method",
                                $docmaLink: "api/#Docma.Template#postBuild",
                            },
                            {
                                comment:
                                    "/**\n     *  Sets a pre-build processor function that is ran right before Docma build\n     *  starts.\n     *  @name Docma.Template#preBuild\n     *  @function\n     *  @param {Function} fn - Processor function. You can return a `Promise` if\n     *  this is an async operation.\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 340,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Sets a pre-build processor function that is ran right before Docma build\n starts.",
                                name: "preBuild",
                                kind: "function",
                                params: [
                                    {
                                        type: { names: ["function"] },
                                        description:
                                            "Processor function. You can return a `Promise` if\n this is an async operation.",
                                        name: "fn",
                                    },
                                ],
                                memberof: "Docma.Template",
                                longname: "Docma.Template#preBuild",
                                scope: "instance",
                                $longname: "Docma.Template#preBuild",
                                $kind: "method",
                                $docmaLink: "api/#Docma.Template#preBuild",
                            },
                            {
                                comment:
                                    '/**\n     *  Gets Docma version (range) supported by this template.\n     *  This is set via `peerDependencies` in package.json.\n     *  If omitted, returns `">=2.0.0"`.\n     *  @type {String}\n     *  @name Docma.Template#supportedDocmaVersion\n     */',
                                meta: {
                                    filename: "Template.js",
                                    lineno: 165,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    'Gets Docma version (range) supported by this template.\n This is set via `peerDependencies` in package.json.\n If omitted, returns `">=2.0.0"`.',
                                type: { names: ["String"] },
                                name: "supportedDocmaVersion",
                                memberof: "Docma.Template",
                                longname:
                                    "Docma.Template#supportedDocmaVersion",
                                scope: "instance",
                                kind: "member",
                                $longname:
                                    "Docma.Template#supportedDocmaVersion",
                                $kind: "property",
                                $docmaLink:
                                    "api/#Docma.Template#supportedDocmaVersion",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets the path of the template directory within the template.\n     *  @type {String}\n     *  @name Docma.Template#templateDir\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 212,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets the path of the template directory within the template.",
                                type: { names: ["String"] },
                                name: "templateDir",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#templateDir",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#templateDir",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Template#templateDir",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets the version of the template.\n     *  @type {String}\n     *  @name Docma.Template#version\n     */",
                                meta: {
                                    filename: "Template.js",
                                    lineno: 147,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets the version of the template.",
                                type: { names: ["String"] },
                                name: "version",
                                memberof: "Docma.Template",
                                longname: "Docma.Template#version",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.Template#version",
                                $kind: "property",
                                $docmaLink: "api/#Docma.Template#version",
                            },
                        ],
                    },
                    {
                        comment:
                            "/**\n *  <blockquote>This class is useful for template authors only.</blockquote>\n *\n *  Class that runs diagnostics on a target Docma template by analyzing\n *  the file structure, validating package metadata and testing with the\n *  template builder.\n *\n *  @class\n *  @name TemplateDoctor\n *  @memberof Docma\n *  @since 2.0.0\n */",
                        meta: {
                            filename: "TemplateDoctor.js",
                            lineno: 70,
                            columnno: 0,
                            path: "/Users/JPI/projects/prozi/docma/lib",
                            code: {},
                        },
                        description:
                            "<blockquote>This class is useful for template authors only.</blockquote>\n\n Class that runs diagnostics on a target Docma template by analyzing\n the file structure, validating package metadata and testing with the\n template builder.",
                        kind: "class",
                        name: "TemplateDoctor",
                        memberof: "Docma",
                        since: "2.0.0",
                        scope: "static",
                        longname: "Docma.TemplateDoctor",
                        $longname: "Docma.TemplateDoctor",
                        $kind: "class",
                        $docmaLink: "api/#Docma.TemplateDoctor",
                        $members: [
                            {
                                comment:
                                    "/**\n     *  Analyzes the Docma template and collects diagnostics information on the\n     *  template structure, package health and builder initialization.\n     *  @name Docma.TemplateDoctor#diagnose\n     *  @method\n     *\n     *  @returns {Object} - Diagnostics data.\n     */",
                                meta: {
                                    filename: "TemplateDoctor.js",
                                    lineno: 327,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Analyzes the Docma template and collects diagnostics information on the\n template structure, package health and builder initialization.",
                                name: "diagnose",
                                kind: "function",
                                returns: [
                                    {
                                        type: { names: ["Object"] },
                                        description: "- Diagnostics data.",
                                    },
                                ],
                                memberof: "Docma.TemplateDoctor",
                                longname: "Docma.TemplateDoctor#diagnose",
                                scope: "instance",
                                $longname: "Docma.TemplateDoctor#diagnose",
                                $kind: "method",
                                $docmaLink:
                                    "api/#Docma.TemplateDoctor#diagnose",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets the diagnostics data object that contains the results.\n     *  @type {Object}\n     *  @name Docma.TemplateDoctor#diagnostics\n     */",
                                meta: {
                                    filename: "TemplateDoctor.js",
                                    lineno: 145,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets the diagnostics data object that contains the results.",
                                type: { names: ["Object"] },
                                name: "diagnostics",
                                memberof: "Docma.TemplateDoctor",
                                longname: "Docma.TemplateDoctor#diagnostics",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.TemplateDoctor#diagnostics",
                                $kind: "property",
                                $docmaLink:
                                    "api/#Docma.TemplateDoctor#diagnostics",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets the package.json contents of the Docma template anayzed.\n     *  @type {Object}\n     *  @name Docma.TemplateDoctor#pkg\n     */",
                                meta: {
                                    filename: "TemplateDoctor.js",
                                    lineno: 117,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets the package.json contents of the Docma template anayzed.",
                                type: { names: ["Object"] },
                                name: "pkg",
                                memberof: "Docma.TemplateDoctor",
                                longname: "Docma.TemplateDoctor#pkg",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.TemplateDoctor#pkg",
                                $kind: "property",
                                $docmaLink: "api/#Docma.TemplateDoctor#pkg",
                            },
                            {
                                comment:
                                    "/**\n     *  Resets the state of the TemplateDoctor instance, cleaning up\n     *  previous diagnosis information and data. (Note that settings are not\n     *  reset.)\n     *  @name Docma.TemplateDoctor#reset\n     *  @method\n     */",
                                meta: {
                                    filename: "TemplateDoctor.js",
                                    lineno: 382,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Resets the state of the TemplateDoctor instance, cleaning up\n previous diagnosis information and data. (Note that settings are not\n reset.)",
                                name: "reset",
                                kind: "function",
                                memberof: "Docma.TemplateDoctor",
                                longname: "Docma.TemplateDoctor#reset",
                                scope: "instance",
                                $longname: "Docma.TemplateDoctor#reset",
                                $kind: "method",
                                $docmaLink: "api/#Docma.TemplateDoctor#reset",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets or sets the diagnostics settings.\n     *  @type {Object}\n     *  @name Docma.TemplateDoctor#settings\n     */",
                                meta: {
                                    filename: "TemplateDoctor.js",
                                    lineno: 154,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets or sets the diagnostics settings.",
                                type: { names: ["Object"] },
                                name: "settings",
                                memberof: "Docma.TemplateDoctor",
                                longname: "Docma.TemplateDoctor#settings",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.TemplateDoctor#settings",
                                $kind: "property",
                                $docmaLink:
                                    "api/#Docma.TemplateDoctor#settings",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets the template instance created while diagnosing. In other words,\n     *  template instance is only available after `.diagnose()` is called.\n     *  @type {Docma.Template}\n     *  @name Docma.TemplateDoctor#template\n     */",
                                meta: {
                                    filename: "TemplateDoctor.js",
                                    lineno: 135,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets the template instance created while diagnosing. In other words,\n template instance is only available after `.diagnose()` is called.",
                                type: { names: ["Docma.Template"] },
                                name: "template",
                                memberof: "Docma.TemplateDoctor",
                                longname: "Docma.TemplateDoctor#template",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.TemplateDoctor#template",
                                $kind: "property",
                                $docmaLink:
                                    "api/#Docma.TemplateDoctor#template",
                            },
                            {
                                comment:
                                    "/**\n     *  Gets the name of the Docma template.\n     *  @type {String}\n     *  @name Docma.TemplateDoctor#templateName\n     */",
                                meta: {
                                    filename: "TemplateDoctor.js",
                                    lineno: 126,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib",
                                    code: {},
                                },
                                description:
                                    "Gets the name of the Docma template.",
                                type: { names: ["String"] },
                                name: "templateName",
                                memberof: "Docma.TemplateDoctor",
                                longname: "Docma.TemplateDoctor#templateName",
                                scope: "instance",
                                kind: "member",
                                $longname: "Docma.TemplateDoctor#templateName",
                                $kind: "property",
                                $docmaLink:
                                    "api/#Docma.TemplateDoctor#templateName",
                            },
                        ],
                        $constructor: {
                            comment:
                                "/**\n     *  Initializes a new instance of `Docma.TemplateDoctor`.\n     *  @constructs Docma.TemplateDoctor\n     *\n     *  @param {String} templatePath - Path of the template to be diagnosed.\n     *  @param {Object} [settings={}] - Diagnose settings.\n     *      @param {Boolean} [settings.quiet=true] - Whether not to log\n     *      diagnostics information to console.\n     *      @param {Boolean} [settings.stopOnFirstFailure=false] - Whether\n     *      to stop on first failure.\n     */",
                            meta: {
                                range: [2756, 3391],
                                filename: "TemplateDoctor.js",
                                lineno: 94,
                                columnno: 4,
                                path: "/Users/JPI/projects/prozi/docma/lib",
                                code: {
                                    id: "astnode100004291",
                                    name: "TemplateDoctor",
                                    type: "MethodDefinition",
                                    paramnames: ["templatePath", "settings"],
                                },
                                vars: { "": null },
                            },
                            description:
                                "Initializes a new instance of `Docma.TemplateDoctor`.",
                            alias: "Docma.TemplateDoctor",
                            kind: "class",
                            params: [
                                {
                                    type: { names: ["String"] },
                                    description:
                                        "Path of the template to be diagnosed.",
                                    name: "templatePath",
                                },
                                {
                                    type: { names: ["Object"] },
                                    optional: true,
                                    defaultvalue: "{}",
                                    description: "Diagnose settings.",
                                    name: "settings",
                                },
                                {
                                    type: { names: ["Boolean"] },
                                    optional: true,
                                    defaultvalue: true,
                                    description:
                                        "Whether not to log\n     diagnostics information to console.",
                                    name: "settings.quiet",
                                },
                                {
                                    type: { names: ["Boolean"] },
                                    optional: true,
                                    defaultvalue: false,
                                    description:
                                        "Whether\n     to stop on first failure.",
                                    name: "settings.stopOnFirstFailure",
                                },
                            ],
                            name: "TemplateDoctor",
                            longname: "Docma.TemplateDoctor",
                            memberof: "Docma",
                            scope: "static",
                            $longname: "Docma.TemplateDoctor",
                            $kind: "constructor",
                            $docmaLink: "api/#Docma.TemplateDoctor",
                        },
                    },
                    {
                        comment:
                            "/**\n     *  Initializes a new instance of `Docma.Template`.\n     *  @hideconstructor\n     *\n     *  @param {Object} params - Template parameters.\n     *      @param {Object} params.modulePath - Resolved path of the template\n     *      module.\n     *      @param {Object} params.buildConfig - Docma build configuration (that\n     *      also includes template configuration).\n     *      @param {String} params.docmaVersion - Current Docma version.\n     *      @param {Function} params.fnLog - Log function to be used within the\n     *      template module.\n     */",
                        meta: {
                            range: [2614, 3982],
                            filename: "Template.js",
                            lineno: 79,
                            columnno: 4,
                            path: "/Users/JPI/projects/prozi/docma/lib",
                            code: {
                                id: "astnode100003496",
                                name: "Template",
                                type: "MethodDefinition",
                                paramnames: ["params"],
                            },
                            vars: { "": null },
                        },
                        description:
                            "Initializes a new instance of `Docma.Template`.",
                        hideconstructor: true,
                        params: [
                            {
                                type: { names: ["Object"] },
                                description: "Template parameters.",
                                name: "params",
                            },
                            {
                                type: { names: ["Object"] },
                                description:
                                    "Resolved path of the template\n     module.",
                                name: "params.modulePath",
                            },
                            {
                                type: { names: ["Object"] },
                                description:
                                    "Docma build configuration (that\n     also includes template configuration).",
                                name: "params.buildConfig",
                            },
                            {
                                type: { names: ["String"] },
                                description: "Current Docma version.",
                                name: "params.docmaVersion",
                            },
                            {
                                type: { names: ["function"] },
                                description:
                                    "Log function to be used within the\n     template module.",
                                name: "params.fnLog",
                            },
                        ],
                        name: "Template",
                        longname: "Template",
                        kind: "class",
                        scope: "global",
                        $longname: "Template",
                        $kind: "constructor",
                        $docmaLink: "api/#Template",
                        $hide: true,
                    },
                ],
                symbols: [
                    "Docma",
                    "Docma#build",
                    "Docma~BuildConfiguration",
                    "Docma.create",
                    "Docma.Debug",
                    "Docma.RouteType",
                    "Docma.RoutingMethod",
                    "Docma.ServerType",
                    "Docma.Template",
                    "Docma.Template#author",
                    "Docma.Template#buildConfig",
                    "Docma.Template#debug",
                    "Docma.Template#defaultOptions",
                    "Docma.Template#description",
                    "Docma.Template#dirname",
                    "Docma.Template#docmaVersion",
                    "Docma.Template#getDestPath",
                    "Docma.Template#getSrcPath",
                    "Docma.Template#ignore",
                    "Docma.Template#license",
                    "Docma.Template#log",
                    "Docma.Template#mainHTML",
                    "Docma.Template#name",
                    "Docma.Template#options",
                    "Docma.Template#path",
                    "Docma.Template#pkg",
                    "Docma.Template#postBuild",
                    "Docma.Template#preBuild",
                    "Docma.Template#supportedDocmaVersion",
                    "Docma.Template#templateDir",
                    "Docma.Template#version",
                    "Docma.TemplateDoctor",
                    "Docma.TemplateDoctor#diagnose",
                    "Docma.TemplateDoctor#diagnostics",
                    "Docma.TemplateDoctor#pkg",
                    "Docma.TemplateDoctor#reset",
                    "Docma.TemplateDoctor#settings",
                    "Docma.TemplateDoctor#template",
                    "Docma.TemplateDoctor#templateName",
                    "Template",
                ],
            },
            web: {
                documentation: [
                    {
                        comment:
                            "/**\n *  Docma (web) core.\n *\n *  When you build the documentation with a template, `docma-web.js` will be\n *  generated (and linked in the main HTML); which is the core engine for the\n *  documentation web app. This will include everything the app needs such as\n *  the documentation data, compiled partials, dustjs engine, etc...\n *\n *  <blockquote>An instance of this object is globally accessible within the generated SPA\n *  as <code>docma</code>. Note that the size of the `docma-web.js` script depends primarily\n *  on the generated documentation data.</blockquote>\n *\n *  @class\n *  @name DocmaWeb\n *  @hideconstructor\n *  @emits DocmaWeb~event:ready\n *  @emits DocmaWeb~event:render\n *  @emits DocmaWeb~event:route\n *  @emits DocmaWeb~event:navigate\n */",
                        meta: {
                            filename: "DocmaWeb.js",
                            lineno: 17,
                            columnno: 0,
                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                            code: {},
                        },
                        description:
                            "Docma (web) core.\n\n When you build the documentation with a template, `docma-web.js` will be\n generated (and linked in the main HTML); which is the core engine for the\n documentation web app. This will include everything the app needs such as\n the documentation data, compiled partials, dustjs engine, etc...\n\n <blockquote>An instance of this object is globally accessible within the generated SPA\n as <code>docma</code>. Note that the size of the `docma-web.js` script depends primarily\n on the generated documentation data.</blockquote>",
                        kind: "class",
                        name: "DocmaWeb",
                        hideconstructor: true,
                        fires: [
                            "DocmaWeb~event:ready",
                            "DocmaWeb~event:render",
                            "DocmaWeb~event:route",
                            "DocmaWeb~event:navigate",
                        ],
                        longname: "DocmaWeb",
                        scope: "global",
                        $longname: "DocmaWeb",
                        $kind: "class",
                        $docmaLink: "api/web/#DocmaWeb",
                        $members: [
                            {
                                comment:
                                    "/**\n *  Adds a new Dust filter.\n *  @chainable\n *  @see {@link templates/filters/|Existing Docma (Dust) filters}\n *  @see {@link https://www.dustjs.com/docs/filter-api|Dust Filter API}\n *\n *  @param {String} name - Name of the filter to be added.\n *  @param {Function} fn - Filter function.\n *\n *  @returns {DocmaWeb} - `DocmaWeb` instance for chaining.\n *  @throws {Error} - If a filter with the given name already exists.\n */",
                                meta: {
                                    range: [23763, 23970],
                                    filename: "DocmaWeb.js",
                                    lineno: 711,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100000990",
                                        name: "DocmaWeb.prototype.addFilter",
                                        type: "FunctionExpression",
                                        paramnames: ["name", "fn"],
                                    },
                                    vars: {
                                        "dust.filters[undefined]":
                                            "dust.filters[undefined]",
                                    },
                                },
                                description: "Adds a new Dust filter.",
                                tags: [
                                    {
                                        originalTitle: "chainable",
                                        title: "chainable",
                                        text: "",
                                    },
                                ],
                                see: [
                                    "{@link templates/filters/|Existing Docma (Dust) filters}",
                                    "{@link https://www.dustjs.com/docs/filter-api|Dust Filter API}",
                                ],
                                params: [
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Name of the filter to be added.",
                                        name: "name",
                                    },
                                    {
                                        type: { names: ["function"] },
                                        description: "Filter function.",
                                        name: "fn",
                                    },
                                ],
                                returns: [
                                    {
                                        type: { names: ["DocmaWeb"] },
                                        description:
                                            "- `DocmaWeb` instance for chaining.",
                                    },
                                ],
                                exceptions: [
                                    {
                                        type: { names: ["Error"] },
                                        description:
                                            "- If a filter with the given name already exists.",
                                    },
                                ],
                                name: "addFilter",
                                longname: "DocmaWeb#addFilter",
                                kind: "function",
                                memberof: "DocmaWeb",
                                scope: "instance",
                                $longname: "DocmaWeb#addFilter",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#addFilter",
                            },
                            {
                                comment:
                                    "/**\n     *\tHash-map of JSDoc documentation outputs.\n     *\tEach key is the name of an API (formed by grouped Javascript files).\n     *\te.g. `docma.apis[\"some-api\"]`\n     *\n     *  Unnamed documentation data (consisting of ungrouped Javascript files) can be\n     *  accessed via `docma.apis._def_`.\n     *\n     *\tEach value is an `Object` with the following signature:\n     *\t`{ documentation:Array, symbols:Array }`. `documentation` is the actual\n     *\tJSDoc data, and `symbols` is a flat array of symbol names.\n     *\n     *  <blockquote>See {@link api/#Docma~BuildConfiguration|build configuration} for more\n     *  details on how Javascript files can be grouped (and named) to form separate\n     *  API documentations and SPA routes.</blockquote>\n     *\n     *  @name DocmaWeb#apis\n     *  @type {Object}\n     *\n     *  @example <caption>Programmatic access to documentation data</caption>\n     *  // output ungrouped (unnamed) API documentation data\n     *  console.log(docma.apis._def_.documentation);\n     *  console.log(docma.apis._def_.symbols); // flat list of symbol names\n     *  // output one of the grouped (named) API documentation data\n     *  console.log(docma.apis['my-scondary-api'].documentation);\n     *\n     *  @example <caption>Usage in a Dust partial</caption>\n     *  <!--\n     *  \tEach API data is passed to the partial, according to the route.\n     *  \tSo you'll always use `documentation` within the partials.\n     *  -->\n     *  {#documentation}\n     *      <h4>{longname}</h4>\n     *      <p>{description}</p>\n     *      <hr />\n     *  {/documentation}\n     */",
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 79,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    'Hash-map of JSDoc documentation outputs.\n\tEach key is the name of an API (formed by grouped Javascript files).\n\te.g. `docma.apis["some-api"]`\n\n Unnamed documentation data (consisting of ungrouped Javascript files) can be\n accessed via `docma.apis._def_`.\n\n\tEach value is an `Object` with the following signature:\n\t`{ documentation:Array, symbols:Array }`. `documentation` is the actual\n\tJSDoc data, and `symbols` is a flat array of symbol names.\n\n <blockquote>See {@link api/#Docma~BuildConfiguration|build configuration} for more\n details on how Javascript files can be grouped (and named) to form separate\n API documentations and SPA routes.</blockquote>',
                                name: "apis",
                                type: { names: ["Object"] },
                                examples: [
                                    "<caption>Programmatic access to documentation data</caption>\n // output ungrouped (unnamed) API documentation data\n console.log(docma.apis._def_.documentation);\n console.log(docma.apis._def_.symbols); // flat list of symbol names\n // output one of the grouped (named) API documentation data\n console.log(docma.apis['my-scondary-api'].documentation);\n\n ",
                                    "<caption>Usage in a Dust partial</caption>\n <!--\n \tEach API data is passed to the partial, according to the route.\n \tSo you'll always use `documentation` within the partials.\n -->\n {#documentation}\n     <h4>{longname}</h4>\n     <p>{description}</p>\n     <hr />\n {/documentation}",
                                ],
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb#apis",
                                scope: "instance",
                                kind: "member",
                                $longname: "DocmaWeb#apis",
                                $kind: "property",
                                $docmaLink: "api/web/#DocmaWeb#apis",
                            },
                            {
                                comment:
                                    "/**\n     *  Provides configuration data of the generated SPA, which is originally set\n     *  at build-time, by the user.\n     *  See {@link api/#Docma~BuildConfiguration|build configuration} for more\n     *  details on how these settings take affect.\n     *  @name DocmaWeb#app\n     *  @type {Object}\n     *\n     *  @property {String} title\n     *            Document title for the main file of the generated app.\n     *            (Value of the `&lt;title/>` tag.)\n     *  @property {Array} meta\n     *            Array of arbitrary objects set for main document meta (tags).\n     *  @property {String} base\n     *            Base path of the generated web app.\n     *  @property {String} entrance\n     *            Name of the initial content displayed, when the web app is first\n     *            loaded.\n     *  @property {String|Object} routing\n     *            Routing settings for the generated SPA.\n     *  @property {String} server\n     *            Server/host type of the generated SPA.\n     */",
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 49,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "Provides configuration data of the generated SPA, which is originally set\n at build-time, by the user.\n See {@link api/#Docma~BuildConfiguration|build configuration} for more\n details on how these settings take affect.",
                                name: "app",
                                type: { names: ["Object"] },
                                properties: [
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Base path of the generated web app.",
                                        name: "base",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Name of the initial content displayed, when the web app is first\n           loaded.",
                                        name: "entrance",
                                    },
                                    {
                                        type: { names: ["Array"] },
                                        description:
                                            "Array of arbitrary objects set for main document meta (tags).",
                                        name: "meta",
                                    },
                                    {
                                        type: { names: ["String", "Object"] },
                                        description:
                                            "Routing settings for the generated SPA.",
                                        name: "routing",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Server/host type of the generated SPA.",
                                        name: "server",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Document title for the main file of the generated app.\n           (Value of the `&lt;title/>` tag.)",
                                        name: "title",
                                    },
                                ],
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb#app",
                                scope: "instance",
                                kind: "member",
                                $longname: "DocmaWeb#app",
                                $kind: "property",
                                $docmaLink: "api/web/#DocmaWeb#app",
                            },
                            {
                                comment:
                                    "/**\n *  Creates a SPA route information object for the given route name and type.\n *\n *  @param {String} name\n *         Name of the route.\n *  @param {String} type\n *         Type of the SPA route. See {@link #DocmaWeb.Route.Type|`DocmaWeb.Route.Type`}\n *         enumeration for possible values.\n *\n *  @returns {DocmaWeb.Route} - Route instance.\n */",
                                meta: {
                                    range: [24966, 25073],
                                    filename: "DocmaWeb.js",
                                    lineno: 754,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100001064",
                                        name: "DocmaWeb.prototype.createRoute",
                                        type: "FunctionExpression",
                                        paramnames: ["name", "type"],
                                    },
                                },
                                description:
                                    "Creates a SPA route information object for the given route name and type.",
                                params: [
                                    {
                                        type: { names: ["String"] },
                                        description: "Name of the route.",
                                        name: "name",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Type of the SPA route. See {@link #DocmaWeb.Route.Type|`DocmaWeb.Route.Type`}\n        enumeration for possible values.",
                                        name: "type",
                                    },
                                ],
                                returns: [
                                    {
                                        type: { names: ["DocmaWeb.Route"] },
                                        description: "- Route instance.",
                                    },
                                ],
                                name: "createRoute",
                                longname: "DocmaWeb#createRoute",
                                kind: "function",
                                memberof: "DocmaWeb",
                                scope: "instance",
                                $longname: "DocmaWeb#createRoute",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#createRoute",
                            },
                            {
                                comment:
                                    '/**\n     *  Gets the route information for the current rendered content being\n     *  displayed.\n     *\n     *  @name DocmaWeb#currentRoute\n     *  @type {DocmaWeb.Route}\n     *  @readonly\n     *\n     *  @property {String} type\n     *            Type of the current route. If a generated JSDoc API\n     *            documentation is being displayed, this is set to `"api"`.\n     *            If any other HTML content (such as a converted markdown) is\n     *            being displayed; this is set to `"content"`.\n     *  @property {String} name\n     *            Name of the current route. For `api` routes, this is the name\n     *            of the grouped JS files parsed. If no name is given, this is\n     *            set to `"_def_"` by default. For `content` routes, this is\n     *            either the custom name given at build-time or, by default; the\n     *            name of the generated HTML file; lower-cased, without the\n     *            extension. e.g. `"README.md"` will have the route name\n     *            `"readme"` after the build.\n     *  @property {String} path\n     *            Path of the current route.\n     */',
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 257,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "Gets the route information for the current rendered content being\n displayed.",
                                name: "currentRoute",
                                type: { names: ["DocmaWeb.Route"] },
                                readonly: true,
                                properties: [
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            'Name of the current route. For `api` routes, this is the name\n           of the grouped JS files parsed. If no name is given, this is\n           set to `"_def_"` by default. For `content` routes, this is\n           either the custom name given at build-time or, by default; the\n           name of the generated HTML file; lower-cased, without the\n           extension. e.g. `"README.md"` will have the route name\n           `"readme"` after the build.',
                                        name: "name",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Path of the current route.",
                                        name: "path",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            'Type of the current route. If a generated JSDoc API\n           documentation is being displayed, this is set to `"api"`.\n           If any other HTML content (such as a converted markdown) is\n           being displayed; this is set to `"content"`.',
                                        name: "type",
                                    },
                                ],
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb#currentRoute",
                                scope: "instance",
                                kind: "member",
                                $longname: "DocmaWeb#currentRoute",
                                $kind: "property",
                                $docmaLink: "api/web/#DocmaWeb#currentRoute",
                            },
                            {
                                comment:
                                    "/**\n     *\tJSDoc documentation data for the current API route.\n     *\tIf current route is not an API route, this will be `null`.\n     *\n     *  <blockquote>See {@link api/#Docma~BuildConfiguration|build configuration} for more\n     *  details on how Javascript files can be grouped (and named) to form\n     *  separate API documentations and SPA routes.</blockquote>\n     *\n     *  @name DocmaWeb#documentation\n     *  @type {Array}\n     *\n     *  @example <caption>Output current API documentation data</caption>\n     *  if (docma.currentRoute.type === 'api') {\n     *  \tconsole.log(docma.documentation);\n     *  }\n     *\n     *  @example <caption>Usage in (Dust) partial</caption>\n     *  {#documentation}\n     *      <h4>{longname}</h4>\n     *      <p>{description}</p>\n     *      <hr />\n     *  {/documentation}\n     */",
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 288,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "JSDoc documentation data for the current API route.\n\tIf current route is not an API route, this will be `null`.\n\n <blockquote>See {@link api/#Docma~BuildConfiguration|build configuration} for more\n details on how Javascript files can be grouped (and named) to form\n separate API documentations and SPA routes.</blockquote>",
                                name: "documentation",
                                type: { names: ["Array"] },
                                examples: [
                                    "<caption>Output current API documentation data</caption>\n if (docma.currentRoute.type === 'api') {\n \tconsole.log(docma.documentation);\n }\n\n ",
                                    "<caption>Usage in (Dust) partial</caption>\n {#documentation}\n     <h4>{longname}</h4>\n     <p>{description}</p>\n     <hr />\n {/documentation}",
                                ],
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb#documentation",
                                scope: "instance",
                                kind: "member",
                                $longname: "DocmaWeb#documentation",
                                $kind: "property",
                                $docmaLink: "api/web/#DocmaWeb#documentation",
                            },
                            {
                                comment:
                                    '/**\n *  Outputs an error log to the browser console. (Unlike `console.error()`) this\n *  method respects `debug` option of Docma build configuration.\n *  @param {...*} [args=""] - Arguments to be logged.\n */',
                                meta: {
                                    range: [19634, 19759],
                                    filename: "DocmaWeb.js",
                                    lineno: 580,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100000691",
                                        name: "DocmaWeb.prototype.error",
                                        type: "FunctionExpression",
                                        paramnames: [],
                                    },
                                },
                                description:
                                    "Outputs an error log to the browser console. (Unlike `console.error()`) this\n method respects `debug` option of Docma build configuration.",
                                params: [
                                    {
                                        type: { names: ["*"] },
                                        optional: true,
                                        variable: true,
                                        defaultvalue: '""',
                                        description: "Arguments to be logged.",
                                        name: "args",
                                    },
                                ],
                                name: "error",
                                longname: "DocmaWeb#error",
                                kind: "function",
                                memberof: "DocmaWeb",
                                scope: "instance",
                                $longname: "DocmaWeb#error",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#error",
                            },
                            {
                                comment:
                                    "/**\n *  Docma SPA events enumeration.\n *  @enum {String}\n */",
                                meta: {
                                    range: [15063, 15610],
                                    filename: "DocmaWeb.js",
                                    lineno: 419,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100000477",
                                        name: "DocmaWeb.Event",
                                        type: "ObjectExpression",
                                        value: '{"Ready":"ready","Render":"render","Route":"route","Navigate":"navigate"}',
                                        paramnames: [],
                                    },
                                },
                                description: "Docma SPA events enumeration.",
                                kind: "member",
                                isEnum: true,
                                type: { names: ["String"] },
                                name: "Event",
                                longname: "DocmaWeb.Event",
                                memberof: "DocmaWeb",
                                scope: "static",
                                properties: [
                                    {
                                        comment:
                                            "/**\n     *  Emitted either when the route is changed or navigated to a\n     *  bookmark (i.e. hashchange).\n     *  @type {String}\n     */",
                                        meta: {
                                            range: [15587, 15607],
                                            filename: "DocmaWeb.js",
                                            lineno: 440,
                                            columnno: 4,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {
                                                id: "astnode100000488",
                                                name: "Navigate",
                                                type: "Literal",
                                                value: "navigate",
                                            },
                                        },
                                        description:
                                            "Emitted either when the route is changed or navigated to a\n bookmark (i.e. hashchange).",
                                        type: { names: ["String"] },
                                        name: "Navigate",
                                        longname: "DocmaWeb.Event.Navigate",
                                        kind: "member",
                                        memberof: "DocmaWeb.Event",
                                        scope: "static",
                                        defaultvalue: "navigate",
                                    },
                                    {
                                        comment:
                                            "/**\n     *  Emitted when Docma is ready and the initial content is rendered.\n     *  @type {String}\n     */",
                                        meta: {
                                            range: [15198, 15212],
                                            filename: "DocmaWeb.js",
                                            lineno: 424,
                                            columnno: 4,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {
                                                id: "astnode100000482",
                                                name: "Ready",
                                                type: "Literal",
                                                value: "ready",
                                            },
                                        },
                                        description:
                                            "Emitted when Docma is ready and the initial content is rendered.",
                                        type: { names: ["String"] },
                                        name: "Ready",
                                        longname: "DocmaWeb.Event.Ready",
                                        kind: "member",
                                        memberof: "DocmaWeb.Event",
                                        scope: "static",
                                        defaultvalue: "ready",
                                    },
                                    {
                                        comment:
                                            "/**\n     *  Emitted when page content (a Dust partial) is rendered.\n     *  @type {String}\n     */",
                                        meta: {
                                            range: [15321, 15337],
                                            filename: "DocmaWeb.js",
                                            lineno: 429,
                                            columnno: 4,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {
                                                id: "astnode100000484",
                                                name: "Render",
                                                type: "Literal",
                                                value: "render",
                                            },
                                        },
                                        description:
                                            "Emitted when page content (a Dust partial) is rendered.",
                                        type: { names: ["String"] },
                                        name: "Render",
                                        longname: "DocmaWeb.Event.Render",
                                        kind: "member",
                                        memberof: "DocmaWeb.Event",
                                        scope: "static",
                                        defaultvalue: "render",
                                    },
                                    {
                                        comment:
                                            "/**\n     *  Emitted when SPA route is changed.\n     *  @type {String}\n     */",
                                        meta: {
                                            range: [15425, 15439],
                                            filename: "DocmaWeb.js",
                                            lineno: 434,
                                            columnno: 4,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {
                                                id: "astnode100000486",
                                                name: "Route",
                                                type: "Literal",
                                                value: "route",
                                            },
                                        },
                                        description:
                                            "Emitted when SPA route is changed.",
                                        type: { names: ["String"] },
                                        name: "Route",
                                        longname: "DocmaWeb.Event.Route",
                                        kind: "member",
                                        memberof: "DocmaWeb.Event",
                                        scope: "static",
                                        defaultvalue: "route",
                                    },
                                ],
                                $longname: "DocmaWeb.Event",
                                $kind: "enum",
                                $docmaLink: "api/web/#DocmaWeb.Event",
                                $members: [
                                    {
                                        comment:
                                            "/**\n     *  Emitted either when the route is changed or navigated to a\n     *  bookmark (i.e. hashchange).\n     *  @type {String}\n     */",
                                        meta: {
                                            range: [15587, 15607],
                                            filename: "DocmaWeb.js",
                                            lineno: 440,
                                            columnno: 4,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {
                                                id: "astnode100000488",
                                                name: "Navigate",
                                                type: "Literal",
                                                value: "navigate",
                                            },
                                        },
                                        description:
                                            "Emitted either when the route is changed or navigated to a\n bookmark (i.e. hashchange).",
                                        type: { names: ["String"] },
                                        name: "Navigate",
                                        longname: "DocmaWeb.Event.Navigate",
                                        kind: "member",
                                        memberof: "DocmaWeb.Event",
                                        scope: "static",
                                        defaultvalue: "navigate",
                                        $longname: "DocmaWeb.Event.Navigate",
                                        $kind: "property",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Event.Navigate",
                                    },
                                    {
                                        comment:
                                            "/**\n     *  Emitted when Docma is ready and the initial content is rendered.\n     *  @type {String}\n     */",
                                        meta: {
                                            range: [15198, 15212],
                                            filename: "DocmaWeb.js",
                                            lineno: 424,
                                            columnno: 4,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {
                                                id: "astnode100000482",
                                                name: "Ready",
                                                type: "Literal",
                                                value: "ready",
                                            },
                                        },
                                        description:
                                            "Emitted when Docma is ready and the initial content is rendered.",
                                        type: { names: ["String"] },
                                        name: "Ready",
                                        longname: "DocmaWeb.Event.Ready",
                                        kind: "member",
                                        memberof: "DocmaWeb.Event",
                                        scope: "static",
                                        defaultvalue: "ready",
                                        $longname: "DocmaWeb.Event.Ready",
                                        $kind: "property",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Event.Ready",
                                    },
                                    {
                                        comment:
                                            "/**\n     *  Emitted when page content (a Dust partial) is rendered.\n     *  @type {String}\n     */",
                                        meta: {
                                            range: [15321, 15337],
                                            filename: "DocmaWeb.js",
                                            lineno: 429,
                                            columnno: 4,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {
                                                id: "astnode100000484",
                                                name: "Render",
                                                type: "Literal",
                                                value: "render",
                                            },
                                        },
                                        description:
                                            "Emitted when page content (a Dust partial) is rendered.",
                                        type: { names: ["String"] },
                                        name: "Render",
                                        longname: "DocmaWeb.Event.Render",
                                        kind: "member",
                                        memberof: "DocmaWeb.Event",
                                        scope: "static",
                                        defaultvalue: "render",
                                        $longname: "DocmaWeb.Event.Render",
                                        $kind: "property",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Event.Render",
                                    },
                                    {
                                        comment:
                                            "/**\n     *  Emitted when SPA route is changed.\n     *  @type {String}\n     */",
                                        meta: {
                                            range: [15425, 15439],
                                            filename: "DocmaWeb.js",
                                            lineno: 434,
                                            columnno: 4,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {
                                                id: "astnode100000486",
                                                name: "Route",
                                                type: "Literal",
                                                value: "route",
                                            },
                                        },
                                        description:
                                            "Emitted when SPA route is changed.",
                                        type: { names: ["String"] },
                                        name: "Route",
                                        longname: "DocmaWeb.Event.Route",
                                        kind: "member",
                                        memberof: "DocmaWeb.Event",
                                        scope: "static",
                                        defaultvalue: "route",
                                        $longname: "DocmaWeb.Event.Route",
                                        $kind: "property",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Event.Route",
                                    },
                                ],
                            },
                            {
                                comment:
                                    "/**\n *  Fired either when the route is changed or navigated to a bookmark\n *  (i.e. on hash-change). If the route does not exist (404), `currentRoute`\n *  will be `null`.\n *\n *  @event DocmaWeb~event:navigate\n *  @type {DocmaWeb.Route}\n *\n *  @example\n *  docma.on('navigate', function (currentRoute) {\n *      if (currentRoute) {\n *          // do stuff...\n *      }\n *  });\n */",
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 399,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "Fired either when the route is changed or navigated to a bookmark\n (i.e. on hash-change). If the route does not exist (404), `currentRoute`\n will be `null`.",
                                kind: "event",
                                name: "event:navigate",
                                type: { names: ["DocmaWeb.Route"] },
                                examples: [
                                    "docma.on('navigate', function (currentRoute) {\n     if (currentRoute) {\n         // do stuff...\n     }\n });",
                                ],
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb~event:navigate",
                                scope: "inner",
                                $longname: "DocmaWeb~event:navigate",
                                $kind: "event",
                                $docmaLink: "api/web/#DocmaWeb~event:navigate",
                            },
                            {
                                comment:
                                    "/**\n *  Fired when Docma is ready and the initial content is rendered.\n *  This is only fired once.\n *\n *  @event DocmaWeb~event:ready\n *\n *  @example\n *  docma.once('ready', function () {\n *      // do stuff...\n *  });\n */",
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 355,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "Fired when Docma is ready and the initial content is rendered.\n This is only fired once.",
                                kind: "event",
                                name: "event:ready",
                                examples: [
                                    "docma.once('ready', function () {\n     // do stuff...\n });",
                                ],
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb~event:ready",
                                scope: "inner",
                                $longname: "DocmaWeb~event:ready",
                                $kind: "event",
                                $docmaLink: "api/web/#DocmaWeb~event:ready",
                            },
                            {
                                comment:
                                    "/**\n *  Fired when page content (a Dust partial) is rendered. The emitted obeject is\n *  `currentRoute`. If the route does not exist (404), `currentRoute` will be\n *  `null`. This is fired after the `route` event.\n *\n *  @event DocmaWeb~event:render\n *  @type {DocmaWeb.Route}\n *\n *  @example\n *  docma.on('render', function (currentRoute) {\n *      if (currentRoute && currentRoute.type === docma.Route.Type.API) {\n *          // do stuff...\n *      }\n *  });\n */",
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 367,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "Fired when page content (a Dust partial) is rendered. The emitted obeject is\n `currentRoute`. If the route does not exist (404), `currentRoute` will be\n `null`. This is fired after the `route` event.",
                                kind: "event",
                                name: "event:render",
                                type: { names: ["DocmaWeb.Route"] },
                                examples: [
                                    "docma.on('render', function (currentRoute) {\n     if (currentRoute && currentRoute.type === docma.Route.Type.API) {\n         // do stuff...\n     }\n });",
                                ],
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb~event:render",
                                scope: "inner",
                                $longname: "DocmaWeb~event:render",
                                $kind: "event",
                                $docmaLink: "api/web/#DocmaWeb~event:render",
                            },
                            {
                                comment:
                                    "/**\n *  Fired when SPA route is changed. The emitted obeject is `currentRoute`. If\n *  the route does not exist (404), `currentRoute` will be `null`. This is fired\n *  before the `render` event.\n *\n *  @event DocmaWeb~event:route\n *  @type {DocmaWeb.Route}\n *\n *  @example\n *  docma.on('route', function (currentRoute) {\n *      if (currentRoute && currentRoute.type === docma.Route.Type.API) {\n *          // do stuff...\n *      }\n *  });\n */",
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 383,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "Fired when SPA route is changed. The emitted obeject is `currentRoute`. If\n the route does not exist (404), `currentRoute` will be `null`. This is fired\n before the `render` event.",
                                kind: "event",
                                name: "event:route",
                                type: { names: ["DocmaWeb.Route"] },
                                examples: [
                                    "docma.on('route', function (currentRoute) {\n     if (currentRoute && currentRoute.type === docma.Route.Type.API) {\n         // do stuff...\n     }\n });",
                                ],
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb~event:route",
                                scope: "inner",
                                $longname: "DocmaWeb~event:route",
                                $kind: "event",
                                $docmaLink: "api/web/#DocmaWeb~event:route",
                            },
                            {
                                comment:
                                    "/**\n *  Asynchronously fetches (text) content from the given URL via an\n *  `XmlHttpRequest`. Note that the URL has to be in the same-origin, for\n *  this to work.\n *\n *  @param {String} url\n *         URL to be fetched.\n *  @param {Function} callback\n *         Function to be executed when the content is fetched; with the\n *         following signature: `function (status, responseText) { .. }`\n */",
                                meta: {
                                    range: [28420, 28850],
                                    filename: "DocmaWeb.js",
                                    lineno: 865,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100001374",
                                        name: "DocmaWeb.prototype.fetch",
                                        type: "FunctionExpression",
                                        paramnames: ["url", "callback"],
                                    },
                                    vars: {
                                        xhr: "DocmaWeb#fetch~xhr",
                                        self: "DocmaWeb#fetch~self",
                                        "xhr.onreadystatechange":
                                            "DocmaWeb#fetch~xhr.onreadystatechange",
                                        "": null,
                                    },
                                },
                                description:
                                    "Asynchronously fetches (text) content from the given URL via an\n `XmlHttpRequest`. Note that the URL has to be in the same-origin, for\n this to work.",
                                params: [
                                    {
                                        type: { names: ["String"] },
                                        description: "URL to be fetched.",
                                        name: "url",
                                    },
                                    {
                                        type: { names: ["function"] },
                                        description:
                                            "Function to be executed when the content is fetched; with the\n        following signature: `function (status, responseText) { .. }`",
                                        name: "callback",
                                    },
                                ],
                                name: "fetch",
                                longname: "DocmaWeb#fetch",
                                kind: "function",
                                memberof: "DocmaWeb",
                                scope: "instance",
                                $longname: "DocmaWeb#fetch",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#fetch",
                            },
                            {
                                comment:
                                    "/**\n *  Checks whether a Dust filter with the given name already exists.\n *  @param {String} name - Name of the filter to be checked.\n *  @returns {Boolean} -\n */",
                                meta: {
                                    range: [24421, 24527],
                                    filename: "DocmaWeb.js",
                                    lineno: 735,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100001045",
                                        name: "DocmaWeb.prototype.filterExists",
                                        type: "FunctionExpression",
                                        paramnames: ["name"],
                                    },
                                },
                                description:
                                    "Checks whether a Dust filter with the given name already exists.",
                                params: [
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Name of the filter to be checked.",
                                        name: "name",
                                    },
                                ],
                                returns: [
                                    {
                                        type: { names: ["Boolean"] },
                                        description: "-",
                                    },
                                ],
                                name: "filterExists",
                                longname: "DocmaWeb#filterExists",
                                kind: "function",
                                memberof: "DocmaWeb",
                                scope: "instance",
                                $longname: "DocmaWeb#filterExists",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#filterExists",
                            },
                            {
                                comment:
                                    "/**\n *  Gets Docma content DOM element that the HTML content will be loaded\n *  into. This should be called for `docma-content` partial.\n *\n *  @returns {HTMLElement} - Docma content DOM element.\n */",
                                meta: {
                                    range: [20467, 21090],
                                    filename: "DocmaWeb.js",
                                    lineno: 611,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100000764",
                                        name: "DocmaWeb.prototype.getContentElem",
                                        type: "FunctionExpression",
                                        paramnames: [],
                                    },
                                    vars: {
                                        dContent:
                                            "DocmaWeb#getContentElem~dContent",
                                    },
                                },
                                description:
                                    "Gets Docma content DOM element that the HTML content will be loaded\n into. This should be called for `docma-content` partial.",
                                returns: [
                                    {
                                        type: { names: ["HTMLElement"] },
                                        description:
                                            "- Docma content DOM element.",
                                    },
                                ],
                                name: "getContentElem",
                                longname: "DocmaWeb#getContentElem",
                                kind: "function",
                                memberof: "DocmaWeb",
                                scope: "instance",
                                $longname: "DocmaWeb#getContentElem",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#getContentElem",
                            },
                            {
                                comment:
                                    "/**\n *  Gets Docma main DOM element which the Dust templates will be rendered\n *  into.\n *\n *  @returns {HTMLElement} - Docma main DOM element.\n */",
                                meta: {
                                    range: [19990, 20264],
                                    filename: "DocmaWeb.js",
                                    lineno: 595,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100000717",
                                        name: "DocmaWeb.prototype.getDocmaElem",
                                        type: "FunctionExpression",
                                        paramnames: [],
                                    },
                                    vars: {
                                        docmaElem:
                                            "DocmaWeb#getDocmaElem~docmaElem",
                                    },
                                },
                                description:
                                    "Gets Docma main DOM element which the Dust templates will be rendered\n into.",
                                returns: [
                                    {
                                        type: { names: ["HTMLElement"] },
                                        description:
                                            "- Docma main DOM element.",
                                    },
                                ],
                                name: "getDocmaElem",
                                longname: "DocmaWeb#getDocmaElem",
                                kind: "function",
                                memberof: "DocmaWeb",
                                scope: "instance",
                                $longname: "DocmaWeb#getDocmaElem",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#getDocmaElem",
                            },
                            {
                                comment:
                                    '/**\n *  Outputs an informational log to the browser console. (Unlike\n *  `console.info()`) this method respects `debug` option of Docma build\n *  configuration.\n *  @param {...*} [args=""] - Arguments to be logged.\n */',
                                meta: {
                                    range: [18966, 19089],
                                    filename: "DocmaWeb.js",
                                    lineno: 560,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100000639",
                                        name: "DocmaWeb.prototype.info",
                                        type: "FunctionExpression",
                                        paramnames: [],
                                    },
                                },
                                description:
                                    "Outputs an informational log to the browser console. (Unlike\n `console.info()`) this method respects `debug` option of Docma build\n configuration.",
                                params: [
                                    {
                                        type: { names: ["*"] },
                                        optional: true,
                                        variable: true,
                                        defaultvalue: '""',
                                        description: "Arguments to be logged.",
                                        name: "args",
                                    },
                                ],
                                name: "info",
                                longname: "DocmaWeb#info",
                                kind: "function",
                                memberof: "DocmaWeb",
                                scope: "instance",
                                $longname: "DocmaWeb#info",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#info",
                            },
                            {
                                comment:
                                    "/**\n *  Loads the given HTML content into `docma-content` element. This is a\n *  low-level method. Typically you would not need to use this.\n *\n *  @param {String} html - Content to be loaded.\n */",
                                meta: {
                                    range: [21290, 21837],
                                    filename: "DocmaWeb.js",
                                    lineno: 635,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100000813",
                                        name: "DocmaWeb.prototype.loadContent",
                                        type: "FunctionExpression",
                                        paramnames: ["html"],
                                    },
                                    vars: {
                                        dContent:
                                            "DocmaWeb#loadContent~dContent",
                                        "dContent.innerHTML":
                                            "DocmaWeb#loadContent~dContent.innerHTML",
                                    },
                                },
                                description:
                                    "Loads the given HTML content into `docma-content` element. This is a\n low-level method. Typically you would not need to use this.",
                                params: [
                                    {
                                        type: { names: ["String"] },
                                        description: "Content to be loaded.",
                                        name: "html",
                                    },
                                ],
                                name: "loadContent",
                                longname: "DocmaWeb#loadContent",
                                kind: "function",
                                memberof: "DocmaWeb",
                                scope: "instance",
                                $longname: "DocmaWeb#loadContent",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#loadContent",
                            },
                            {
                                comment:
                                    "/**\n     *  Similar to `window.location` but with differences and additional\n     *  information.\n     *\n     *  @name DocmaWeb#location\n     *  @type {Object}\n     *  @readonly\n     *\n     *  @property {String} origin\n     *            Gets the protocol, hostname and port number of the current URL.\n     *  @property {String} host\n     *            Gets the hostname and port number of the current URL.\n     *  @property {String} hostname\n     *            Gets the domain name of the web host.\n     *  @property {String} protocol\n     *            Gets the web protocol used, without `:` suffix.\n     *  @property {String} href\n     *            Gets the href (URL) of the current location.\n     *  @property {String} entrance\n     *            Gets the application entrance route, which is set at Docma build-time.\n     *  @property {String} base\n     *            Gets the base path of the application URL, which is set at Docma build-time.\n     *  @property {String} fullpath\n     *            Gets the path and filename of the current URL.\n     *  @property {String} pathname\n     *            Gets the path and filename of the current URL, without the base.\n     *  @property {String} path\n     *            Gets the path, filename and query-string of the current URL, without the base.\n     *  @property {String} hash\n     *            Gets the anchor `#` of the current URL, without `#` prefix.\n     *  @property {String} query\n     *            Gets the querystring part of the current URL, without `?` prefix.\n     *  @property {Function} getQuery()\n     *            Gets the value of the given querystring parameter.\n     */",
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 178,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "Similar to `window.location` but with differences and additional\n information.",
                                name: "location",
                                type: { names: ["Object"] },
                                readonly: true,
                                properties: [
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Gets the base path of the application URL, which is set at Docma build-time.",
                                        name: "base",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Gets the application entrance route, which is set at Docma build-time.",
                                        name: "entrance",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Gets the path and filename of the current URL.",
                                        name: "fullpath",
                                    },
                                    {
                                        type: { names: ["function"] },
                                        description:
                                            "Gets the value of the given querystring parameter.",
                                        name: "getQuery()",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Gets the anchor `#` of the current URL, without `#` prefix.",
                                        name: "hash",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Gets the hostname and port number of the current URL.",
                                        name: "host",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Gets the domain name of the web host.",
                                        name: "hostname",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Gets the href (URL) of the current location.",
                                        name: "href",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Gets the protocol, hostname and port number of the current URL.",
                                        name: "origin",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Gets the path, filename and query-string of the current URL, without the base.",
                                        name: "path",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Gets the path and filename of the current URL, without the base.",
                                        name: "pathname",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Gets the web protocol used, without `:` suffix.",
                                        name: "protocol",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Gets the querystring part of the current URL, without `?` prefix.",
                                        name: "query",
                                    },
                                ],
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb#location",
                                scope: "instance",
                                kind: "member",
                                $longname: "DocmaWeb#location",
                                $kind: "property",
                                $docmaLink: "api/web/#DocmaWeb#location",
                            },
                            {
                                comment:
                                    '/**\n *  Outputs a general log to the browser console. (Unlike `console.log()`) this\n *  method respects `debug` option of Docma build configuration.\n *  @param {...*} [args=""] - Arguments to be logged.\n */',
                                meta: {
                                    range: [18623, 18744],
                                    filename: "DocmaWeb.js",
                                    lineno: 549,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100000613",
                                        name: "DocmaWeb.prototype.log",
                                        type: "FunctionExpression",
                                        paramnames: [],
                                    },
                                },
                                description:
                                    "Outputs a general log to the browser console. (Unlike `console.log()`) this\n method respects `debug` option of Docma build configuration.",
                                params: [
                                    {
                                        type: { names: ["*"] },
                                        optional: true,
                                        variable: true,
                                        defaultvalue: '""',
                                        description: "Arguments to be logged.",
                                        name: "args",
                                    },
                                ],
                                name: "log",
                                longname: "DocmaWeb#log",
                                kind: "function",
                                memberof: "DocmaWeb",
                                scope: "instance",
                                $longname: "DocmaWeb#log",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#log",
                            },
                            {
                                comment:
                                    "/**\n *  Removes the given listener from the specified event.\n *  @name DocmaWeb#off\n *  @function\n *  @alias DocmaWeb#removeListener\n *  @chainable\n *\n *  @param {String} eventName\n *         Name of the event to remove the listener from.\n *         See {@link #DocmaWeb.Event|`DocmaWeb.Event`} enumeration.\n *  @param {Function} listener\n *         Function to be removed from the event.\n *\n *  @returns {DocmaWeb} - `DocmaWeb` instance for chaining.\n */",
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 504,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "Removes the given listener from the specified event.",
                                name: "off",
                                kind: "function",
                                alias: "DocmaWeb#removeListener",
                                tags: [
                                    {
                                        originalTitle: "chainable",
                                        title: "chainable",
                                        text: "",
                                    },
                                ],
                                params: [
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Name of the event to remove the listener from.\n        See {@link #DocmaWeb.Event|`DocmaWeb.Event`} enumeration.",
                                        name: "eventName",
                                    },
                                    {
                                        type: { names: ["function"] },
                                        description:
                                            "Function to be removed from the event.",
                                        name: "listener",
                                    },
                                ],
                                returns: [
                                    {
                                        type: { names: ["DocmaWeb"] },
                                        description:
                                            "- `DocmaWeb` instance for chaining.",
                                    },
                                ],
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb#off",
                                scope: "instance",
                                $longname: "DocmaWeb#off",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#off",
                            },
                            {
                                comment:
                                    "/**\n *  Adds a listener function to the specified event.\n *  Note that the listener will not be added if it is a duplicate.\n *  If the listener returns true then it will be removed after it is called.\n *  @name DocmaWeb#on\n *  @function\n *  @alias DocmaWeb#addListener\n *  @chainable\n *\n *  @param {String} eventName\n *         Name of the event to attach the listener to.\n *         See {@link #DocmaWeb.Event|`DocmaWeb.Event`} enumeration.\n *  @param {Function} listener\n *         Function to be called when the event is emitted. If the function\n *         returns true then it will be removed after calling.\n *\n *  @returns {DocmaWeb} - `DocmaWeb` instance for chaining.\n *\n *  @example\n *  docma.on('render', function (currentRoute) {\n *  \tif (!currentRoute) {\n *  \t\tconsole.log('Not found!');\n *  \t\treturn;\n *  \t}\n *  \tif (currentRoute.type === docma.Route.Type.API) {\n *  \t\tconsole.log('This is an API route.')\n *  \t}\n *  });\n */",
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 443,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "Adds a listener function to the specified event.\n Note that the listener will not be added if it is a duplicate.\n If the listener returns true then it will be removed after it is called.",
                                name: "on",
                                kind: "function",
                                alias: "DocmaWeb#addListener",
                                tags: [
                                    {
                                        originalTitle: "chainable",
                                        title: "chainable",
                                        text: "",
                                    },
                                ],
                                params: [
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Name of the event to attach the listener to.\n        See {@link #DocmaWeb.Event|`DocmaWeb.Event`} enumeration.",
                                        name: "eventName",
                                    },
                                    {
                                        type: { names: ["function"] },
                                        description:
                                            "Function to be called when the event is emitted. If the function\n        returns true then it will be removed after calling.",
                                        name: "listener",
                                    },
                                ],
                                returns: [
                                    {
                                        type: { names: ["DocmaWeb"] },
                                        description:
                                            "- `DocmaWeb` instance for chaining.",
                                    },
                                ],
                                examples: [
                                    "docma.on('render', function (currentRoute) {\n \tif (!currentRoute) {\n \t\tconsole.log('Not found!');\n \t\treturn;\n \t}\n \tif (currentRoute.type === docma.Route.Type.API) {\n \t\tconsole.log('This is an API route.')\n \t}\n });",
                                ],
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb#on",
                                scope: "instance",
                                $longname: "DocmaWeb#on",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#on",
                            },
                            {
                                comment:
                                    "/**\n *  Adds a listener that will be automatically removed after its first\n *  execution.\n *  @name DocmaWeb#once\n *  @function\n *  @alias DocmaWeb#addOnceListener\n *  @chainable\n *\n *  @param {String} eventName\n *         Name of the event to attach the listener to.\n *         See {@link #DocmaWeb.Event|`DocmaWeb.Event`} enumeration.\n *  @param {Function} listener\n *         Function to be called when the event is emitted.\n *\n *  @returns {DocmaWeb} - `DocmaWeb` instance for chaining.\n *\n *  @example\n *  docma.once('ready', function () {\n *  \tconsole.log('Docma is ready!');\n *  });\n */",
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 478,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "Adds a listener that will be automatically removed after its first\n execution.",
                                name: "once",
                                kind: "function",
                                alias: "DocmaWeb#addOnceListener",
                                tags: [
                                    {
                                        originalTitle: "chainable",
                                        title: "chainable",
                                        text: "",
                                    },
                                ],
                                params: [
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Name of the event to attach the listener to.\n        See {@link #DocmaWeb.Event|`DocmaWeb.Event`} enumeration.",
                                        name: "eventName",
                                    },
                                    {
                                        type: { names: ["function"] },
                                        description:
                                            "Function to be called when the event is emitted.",
                                        name: "listener",
                                    },
                                ],
                                returns: [
                                    {
                                        type: { names: ["DocmaWeb"] },
                                        description:
                                            "- `DocmaWeb` instance for chaining.",
                                    },
                                ],
                                examples: [
                                    "docma.once('ready', function () {\n \tconsole.log('Docma is ready!');\n });",
                                ],
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb#once",
                                scope: "instance",
                                $longname: "DocmaWeb#once",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#once",
                            },
                            {
                                comment:
                                    "/**\n *  Removes an existing Dust filter.\n *  @chainable\n *  @param {String} name - Name of the filter to be removed.\n *  @returns {DocmaWeb} - `DocmaWeb` instance for chaining.\n */",
                                meta: {
                                    range: [24154, 24255],
                                    filename: "DocmaWeb.js",
                                    lineno: 725,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100001026",
                                        name: "DocmaWeb.prototype.removeFilter",
                                        type: "FunctionExpression",
                                        paramnames: ["name"],
                                    },
                                },
                                description: "Removes an existing Dust filter.",
                                tags: [
                                    {
                                        originalTitle: "chainable",
                                        title: "chainable",
                                        text: "",
                                    },
                                ],
                                params: [
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Name of the filter to be removed.",
                                        name: "name",
                                    },
                                ],
                                returns: [
                                    {
                                        type: { names: ["DocmaWeb"] },
                                        description:
                                            "- `DocmaWeb` instance for chaining.",
                                    },
                                ],
                                name: "removeFilter",
                                longname: "DocmaWeb#removeFilter",
                                kind: "function",
                                memberof: "DocmaWeb",
                                scope: "instance",
                                $longname: "DocmaWeb#removeFilter",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#removeFilter",
                            },
                            {
                                comment:
                                    '/**\n *  Renders content into docma-main element, by the given route information.\n *\n *  If the content is empty or `"api"`, we\'ll render the `docma-api` Dust\n *  template. Otherwise, (e.g. `"readme"`) we\'ll render `docma-content` Dust\n *  template, then  fetch `content/readme.html` and load it in the `docma-main`\n *  element.\n *\n *  <blockquote>Note that rendering and the callback will be cancelled if the given\n *  content is the latest content rendered.</blockquote>\n *\n *  @param {DocmaWeb.Route} routeInfo - Route information of the page to be\n *  rendered.\n *  @param {Function} [callback] - Function to be executed when the rendering is\n *  complete. `function (httpStatus:Number) { .. }`\n *  @returns {void}\n *  @emits DocmaWeb~event:render\n */',
                                meta: {
                                    range: [29608, 30949],
                                    filename: "DocmaWeb.js",
                                    lineno: 897,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100001451",
                                        name: "DocmaWeb.prototype.render",
                                        type: "FunctionExpression",
                                        paramnames: ["routeInfo", "callback"],
                                    },
                                    vars: {
                                        "this._.currentRoute":
                                            "DocmaWeb#render#_.currentRoute",
                                        isCbFn: "DocmaWeb#render~isCbFn",
                                        self: "DocmaWeb#render~self",
                                        "": null,
                                    },
                                },
                                description:
                                    'Renders content into docma-main element, by the given route information.\n\n If the content is empty or `"api"`, we\'ll render the `docma-api` Dust\n template. Otherwise, (e.g. `"readme"`) we\'ll render `docma-content` Dust\n template, then  fetch `content/readme.html` and load it in the `docma-main`\n element.\n\n <blockquote>Note that rendering and the callback will be cancelled if the given\n content is the latest content rendered.</blockquote>',
                                params: [
                                    {
                                        type: { names: ["DocmaWeb.Route"] },
                                        description:
                                            "Route information of the page to be\n rendered.",
                                        name: "routeInfo",
                                    },
                                    {
                                        type: { names: ["function"] },
                                        optional: true,
                                        description:
                                            "Function to be executed when the rendering is\n complete. `function (httpStatus:Number) { .. }`",
                                        name: "callback",
                                    },
                                ],
                                returns: [{ type: { names: ["void"] } }],
                                fires: ["DocmaWeb~event:render"],
                                name: "render",
                                longname: "DocmaWeb#render",
                                kind: "function",
                                memberof: "DocmaWeb",
                                scope: "instance",
                                $longname: "DocmaWeb#render",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#render",
                            },
                            {
                                comment:
                                    "/**\n *  @classdesc Creates SPA route information object for the given route name\n *  and type. You cannot directly construct an instance of this class via\n *  `new` operator. Use {@link #DocmaWeb#createRoute|`DocmaWeb#createRoute`}\n *  method instead.\n *  @class\n *  @hideconstructor\n *\n *  @param {DocmaWeb} docma `DocmaWeb` instance.\n *  @param {String} name Name of the route.\n *  @param {String} type Type of the SPA route. See\n *         {@link #DocmaWeb.Route.Type|`DocmaWeb.Route.Type`} enumeration\n *         for possible values.\n */",
                                meta: {
                                    range: [957, 1763],
                                    filename: "DocmaWeb.Route.js",
                                    lineno: 28,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100001638",
                                        name: "DocmaWeb.Route",
                                        type: "FunctionExpression",
                                        paramnames: ["docma", "name", "type"],
                                    },
                                    vars: {
                                        "this._docma": "DocmaWeb.Route#_docma",
                                        name: "DocmaWeb.Route~name",
                                        info: "DocmaWeb.Route~info",
                                    },
                                },
                                classdesc:
                                    "Creates SPA route information object for the given route name\n and type. You cannot directly construct an instance of this class via\n `new` operator. Use {@link #DocmaWeb#createRoute|`DocmaWeb#createRoute`}\n method instead.",
                                kind: "class",
                                hideconstructor: true,
                                params: [
                                    {
                                        type: { names: ["DocmaWeb"] },
                                        description: "`DocmaWeb` instance.",
                                        name: "docma",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description: "Name of the route.",
                                        name: "name",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Type of the SPA route. See\n        {@link #DocmaWeb.Route.Type|`DocmaWeb.Route.Type`} enumeration\n        for possible values.",
                                        name: "type",
                                    },
                                ],
                                name: "Route",
                                longname: "DocmaWeb.Route",
                                memberof: "DocmaWeb",
                                scope: "static",
                                $longname: "DocmaWeb.Route",
                                $kind: "class",
                                $docmaLink: "api/web/#DocmaWeb.Route",
                                $members: [
                                    {
                                        comment:
                                            "/**\n *  Applies the route to the application.\n *  @emits DocmaWeb~event:route\n *  @param {Function} [cb] - Callback function to be executed after route is\n *  rendered.\n *  @returns {DocmaWeb.Route} - The route instance for chaining.\n */",
                                        meta: {
                                            range: [5988, 6596],
                                            filename: "DocmaWeb.Route.js",
                                            lineno: 205,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {
                                                id: "astnode100001843",
                                                name: "DocmaWeb.Route.prototype.apply",
                                                type: "FunctionExpression",
                                                paramnames: ["cb"],
                                            },
                                            vars: {
                                                "this._docma._.documentation":
                                                    "DocmaWeb.Route#_docma._.documentation",
                                                "this._docma._.symbols":
                                                    "DocmaWeb.Route#_docma._.symbols",
                                            },
                                        },
                                        description:
                                            "Applies the route to the application.",
                                        fires: ["DocmaWeb~event:route"],
                                        params: [
                                            {
                                                type: { names: ["function"] },
                                                optional: true,
                                                description:
                                                    "Callback function to be executed after route is\n rendered.",
                                                name: "cb",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: {
                                                    names: ["DocmaWeb.Route"],
                                                },
                                                description:
                                                    "- The route instance for chaining.",
                                            },
                                        ],
                                        name: "apply",
                                        longname: "DocmaWeb.Route#apply",
                                        kind: "function",
                                        memberof: "DocmaWeb.Route",
                                        scope: "instance",
                                        $longname: "DocmaWeb.Route#apply",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Route#apply",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets the path of the generated content (HTML) file.\n *  If this is an API route, `contentPath` is `null`.\n *  @name DocmaWeb.Route#contentPath\n *  @type {String}\n *  @instance\n */",
                                        meta: {
                                            filename: "DocmaWeb.Route.js",
                                            lineno: 128,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the path of the generated content (HTML) file.\n If this is an API route, `contentPath` is `null`.",
                                        name: "contentPath",
                                        type: { names: ["String"] },
                                        scope: "instance",
                                        memberof: "DocmaWeb.Route",
                                        longname: "DocmaWeb.Route#contentPath",
                                        kind: "member",
                                        $longname: "DocmaWeb.Route#contentPath",
                                        $kind: "property",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Route#contentPath",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the route actually exists.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            range: [5070, 5148],
                                            filename: "DocmaWeb.Route.js",
                                            lineno: 175,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {
                                                id: "astnode100001768",
                                                name: "DocmaWeb.Route.prototype.exists",
                                                type: "FunctionExpression",
                                                paramnames: [],
                                            },
                                        },
                                        description:
                                            "Checks whether the route actually exists.",
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        name: "exists",
                                        longname: "DocmaWeb.Route#exists",
                                        kind: "function",
                                        memberof: "DocmaWeb.Route",
                                        scope: "instance",
                                        $longname: "DocmaWeb.Route#exists",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Route#exists",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets the ID of the route. A route ID consists of the route type and the\n *  name; delimited via a colon. e.g. `api:web`.\n *  @name DocmaWeb.Route#id\n *  @type {String}\n *  @instance\n */",
                                        meta: {
                                            filename: "DocmaWeb.Route.js",
                                            lineno: 120,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the ID of the route. A route ID consists of the route type and the\n name; delimited via a colon. e.g. `api:web`.",
                                        name: "id",
                                        type: { names: ["String"] },
                                        scope: "instance",
                                        memberof: "DocmaWeb.Route",
                                        longname: "DocmaWeb.Route#id",
                                        kind: "member",
                                        $longname: "DocmaWeb.Route#id",
                                        $kind: "property",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Route#id",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the route is currently being viewed.\n *  @param {DocmaWeb.Route} routeInfo - Object to be checked.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            range: [5642, 5747],
                                            filename: "DocmaWeb.Route.js",
                                            lineno: 194,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {
                                                id: "astnode100001822",
                                                name: "DocmaWeb.Route.prototype.isCurrent",
                                                type: "FunctionExpression",
                                                paramnames: [],
                                            },
                                        },
                                        description:
                                            "Checks whether the route is currently being viewed.",
                                        params: [
                                            {
                                                type: {
                                                    names: ["DocmaWeb.Route"],
                                                },
                                                description:
                                                    "Object to be checked.",
                                                name: "routeInfo",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        name: "isCurrent",
                                        longname: "DocmaWeb.Route#isCurrent",
                                        kind: "function",
                                        memberof: "DocmaWeb.Route",
                                        scope: "instance",
                                        $longname: "DocmaWeb.Route#isCurrent",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Route#isCurrent",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the route is equal to the given route.\n *  @param {DocmaWeb.Route} routeInfo - Route to be checked against.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            range: [5311, 5488],
                                            filename: "DocmaWeb.Route.js",
                                            lineno: 184,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {
                                                id: "astnode100001785",
                                                name: "DocmaWeb.Route.prototype.isEqualTo",
                                                type: "FunctionExpression",
                                                paramnames: ["routeInfo"],
                                            },
                                        },
                                        description:
                                            "Checks whether the route is equal to the given route.",
                                        params: [
                                            {
                                                type: {
                                                    names: ["DocmaWeb.Route"],
                                                },
                                                description:
                                                    "Route to be checked against.",
                                                name: "routeInfo",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        name: "isEqualTo",
                                        longname: "DocmaWeb.Route#isEqualTo",
                                        kind: "function",
                                        memberof: "DocmaWeb.Route",
                                        scope: "instance",
                                        $longname: "DocmaWeb.Route#isEqualTo",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Route#isEqualTo",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets the name of the SPA route, which is either set by the user when\n *  building the documentation; or auto-generated from the source file name.\n *  @name DocmaWeb.Route#name\n *  @type {String}\n *  @instance\n */",
                                        meta: {
                                            filename: "DocmaWeb.Route.js",
                                            lineno: 163,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the name of the SPA route, which is either set by the user when\n building the documentation; or auto-generated from the source file name.",
                                        name: "name",
                                        type: { names: ["String"] },
                                        scope: "instance",
                                        memberof: "DocmaWeb.Route",
                                        longname: "DocmaWeb.Route#name",
                                        kind: "member",
                                        $longname: "DocmaWeb.Route#name",
                                        $kind: "property",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Route#name",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets the URL path of the SPA route. For example, if SPA route method is\n *  `query`, the URL path for a route named `guide` will be `?content=guide`.\n *  If routing method is `path` it will be `guide/`.\n *  @name DocmaWeb.Route#path\n *  @type {String}\n *  @instance\n */",
                                        meta: {
                                            filename: "DocmaWeb.Route.js",
                                            lineno: 136,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the URL path of the SPA route. For example, if SPA route method is\n `query`, the URL path for a route named `guide` will be `?content=guide`.\n If routing method is `path` it will be `guide/`.",
                                        name: "path",
                                        type: { names: ["String"] },
                                        scope: "instance",
                                        memberof: "DocmaWeb.Route",
                                        longname: "DocmaWeb.Route#path",
                                        kind: "member",
                                        $longname: "DocmaWeb.Route#path",
                                        $kind: "property",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Route#path",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets the type of the source which this route is generated from. See\n *  {@link #DocmaWeb.Route.SourceType|`DocmaWeb.Route.SourceType`} enumeration\n *  for possible values.\n *  @name DocmaWeb.Route#sourceType\n *  @type {String}\n *  @instance\n */",
                                        meta: {
                                            filename: "DocmaWeb.Route.js",
                                            lineno: 154,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the type of the source which this route is generated from. See\n {@link #DocmaWeb.Route.SourceType|`DocmaWeb.Route.SourceType`} enumeration\n for possible values.",
                                        name: "sourceType",
                                        type: { names: ["String"] },
                                        scope: "instance",
                                        memberof: "DocmaWeb.Route",
                                        longname: "DocmaWeb.Route#sourceType",
                                        kind: "member",
                                        $longname: "DocmaWeb.Route#sourceType",
                                        $kind: "property",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Route#sourceType",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Enumerates the source types that a SPA route is generated from.\n *  @name DocmaWeb.Route.SourceType\n *  @enum {String}\n *  @static\n *  @readonly\n */",
                                        meta: {
                                            filename: "DocmaWeb.Route.js",
                                            lineno: 92,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Enumerates the source types that a SPA route is generated from.",
                                        name: "SourceType",
                                        kind: "member",
                                        isEnum: true,
                                        type: { names: ["String"] },
                                        scope: "static",
                                        readonly: true,
                                        memberof: "DocmaWeb.Route",
                                        longname: "DocmaWeb.Route.SourceType",
                                        $longname: "DocmaWeb.Route.SourceType",
                                        $kind: "enum",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Route.SourceType",
                                        $members: [
                                            {
                                                comment:
                                                    "/**\n     *  Indicates that the documentation route is generated from HTML\n     *  source.\n     *  @type {String}\n     */",
                                                meta: {
                                                    range: [3620, 3632],
                                                    filename:
                                                        "DocmaWeb.Route.js",
                                                    lineno: 117,
                                                    columnno: 4,
                                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                                    code: {
                                                        id: "astnode100001765",
                                                        name: "HTML",
                                                        type: "Literal",
                                                        value: "html",
                                                    },
                                                },
                                                description:
                                                    "Indicates that the documentation route is generated from HTML\n source.",
                                                type: { names: ["String"] },
                                                name: "HTML",
                                                longname:
                                                    "DocmaWeb.Route.SourceType.HTML",
                                                kind: "member",
                                                memberof:
                                                    "DocmaWeb.Route.SourceType",
                                                scope: "static",
                                                $longname:
                                                    "DocmaWeb.Route.SourceType.HTML",
                                                $kind: "property",
                                                $docmaLink:
                                                    "api/web/#DocmaWeb.Route.SourceType.HTML",
                                            },
                                            {
                                                comment:
                                                    "/**\n     *  Indicates that the documentation route is generated from Javascript\n     *  source.\n     *  @type {String}\n     */",
                                                meta: {
                                                    range: [3338, 3346],
                                                    filename:
                                                        "DocmaWeb.Route.js",
                                                    lineno: 105,
                                                    columnno: 4,
                                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                                    code: {
                                                        id: "astnode100001761",
                                                        name: "JS",
                                                        type: "Literal",
                                                        value: "js",
                                                    },
                                                },
                                                description:
                                                    "Indicates that the documentation route is generated from Javascript\n source.",
                                                type: { names: ["String"] },
                                                name: "JS",
                                                longname:
                                                    "DocmaWeb.Route.SourceType.JS",
                                                kind: "member",
                                                memberof:
                                                    "DocmaWeb.Route.SourceType",
                                                scope: "static",
                                                $longname:
                                                    "DocmaWeb.Route.SourceType.JS",
                                                $kind: "property",
                                                $docmaLink:
                                                    "api/web/#DocmaWeb.Route.SourceType.JS",
                                            },
                                            {
                                                comment:
                                                    "/**\n     *  Indicates that the documentation route is generated from markdown\n     *  source.\n     *  @type {String}\n     */",
                                                meta: {
                                                    range: [3481, 3489],
                                                    filename:
                                                        "DocmaWeb.Route.js",
                                                    lineno: 111,
                                                    columnno: 4,
                                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                                    code: {
                                                        id: "astnode100001763",
                                                        name: "MD",
                                                        type: "Literal",
                                                        value: "md",
                                                    },
                                                },
                                                description:
                                                    "Indicates that the documentation route is generated from markdown\n source.",
                                                type: { names: ["String"] },
                                                name: "MD",
                                                longname:
                                                    "DocmaWeb.Route.SourceType.MD",
                                                kind: "member",
                                                memberof:
                                                    "DocmaWeb.Route.SourceType",
                                                scope: "static",
                                                $longname:
                                                    "DocmaWeb.Route.SourceType.MD",
                                                $kind: "property",
                                                $docmaLink:
                                                    "api/web/#DocmaWeb.Route.SourceType.MD",
                                            },
                                        ],
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets the string representation of the route.\n *  @returns {String} -\n */",
                                        meta: {
                                            range: [6680, 6886],
                                            filename: "DocmaWeb.Route.js",
                                            lineno: 224,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {
                                                id: "astnode100001960",
                                                name: "DocmaWeb.Route.prototype.toString",
                                                type: "FunctionExpression",
                                                paramnames: [],
                                            },
                                            vars: {
                                                o: "DocmaWeb.Route#toString~o",
                                                "": null,
                                            },
                                        },
                                        description:
                                            "Gets the string representation of the route.",
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        name: "toString",
                                        longname: "DocmaWeb.Route#toString",
                                        kind: "function",
                                        memberof: "DocmaWeb.Route",
                                        scope: "instance",
                                        $longname: "DocmaWeb.Route#toString",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Route#toString",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets the type of the generated SPA route. See\n *  {@link #DocmaWeb.Route.Type|`DocmaWeb.Route.Type`} enumeration\n *  for possible values.\n *  @name DocmaWeb.Route#type\n *  @type {String}\n *  @instance\n */",
                                        meta: {
                                            filename: "DocmaWeb.Route.js",
                                            lineno: 145,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the type of the generated SPA route. See\n {@link #DocmaWeb.Route.Type|`DocmaWeb.Route.Type`} enumeration\n for possible values.",
                                        name: "type",
                                        type: { names: ["String"] },
                                        scope: "instance",
                                        memberof: "DocmaWeb.Route",
                                        longname: "DocmaWeb.Route#type",
                                        kind: "member",
                                        $longname: "DocmaWeb.Route#type",
                                        $kind: "property",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Route#type",
                                    },
                                    {
                                        comment:
                                            '/**\n *  Enumerates the Docma SPA route types.\n *  @name DocmaWeb.Route.Type\n *  @enum {String}\n *  @static\n *  @readonly\n *\n *  @example <caption>When `docma.app.routing.method` is `"query"`</caption>\n *  type     name              path\n *  -------  ----------------  --------------------------\n *  api      _def_             ?api\n *  api      web               ?api=web\n *  content  templates         ?content=templates\n *  content  guide             ?content=guide\n *\n *  @example <caption>When `docma.app.routing.method` is `"path"`</caption>\n *  type     name              path\n *  -------  ----------------  --------------------------\n *  api      _def_             api/\n *  api      web               api/web/\n *  content  templates         templates/\n *  content  guide             guide/\n *\n */',
                                        meta: {
                                            filename: "DocmaWeb.Route.js",
                                            lineno: 52,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Enumerates the Docma SPA route types.",
                                        name: "Type",
                                        kind: "member",
                                        isEnum: true,
                                        type: { names: ["String"] },
                                        scope: "static",
                                        readonly: true,
                                        examples: [
                                            '<caption>When `docma.app.routing.method` is `"query"`</caption>\n type     name              path\n -------  ----------------  --------------------------\n api      _def_             ?api\n api      web               ?api=web\n content  templates         ?content=templates\n content  guide             ?content=guide\n\n ',
                                            '<caption>When `docma.app.routing.method` is `"path"`</caption>\n type     name              path\n -------  ----------------  --------------------------\n api      _def_             api/\n api      web               api/web/\n content  templates         templates/\n content  guide             guide/',
                                        ],
                                        memberof: "DocmaWeb.Route",
                                        longname: "DocmaWeb.Route.Type",
                                        $longname: "DocmaWeb.Route.Type",
                                        $kind: "enum",
                                        $docmaLink:
                                            "api/web/#DocmaWeb.Route.Type",
                                        $members: [
                                            {
                                                comment:
                                                    "/**\n     *  Indicates that the route is for API documentation content, generated\n     *  from one or more Javascript files.\n     *  @type {String}\n     */",
                                                meta: {
                                                    range: [2756, 2766],
                                                    filename:
                                                        "DocmaWeb.Route.js",
                                                    lineno: 82,
                                                    columnno: 4,
                                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                                    code: {
                                                        id: "astnode100001737",
                                                        name: "API",
                                                        type: "Literal",
                                                        value: "api",
                                                    },
                                                },
                                                description:
                                                    "Indicates that the route is for API documentation content, generated\n from one or more Javascript files.",
                                                type: { names: ["String"] },
                                                name: "API",
                                                longname:
                                                    "DocmaWeb.Route.Type.API",
                                                kind: "member",
                                                memberof: "DocmaWeb.Route.Type",
                                                scope: "static",
                                                $longname:
                                                    "DocmaWeb.Route.Type.API",
                                                $kind: "property",
                                                $docmaLink:
                                                    "api/web/#DocmaWeb.Route.Type.API",
                                            },
                                            {
                                                comment:
                                                    "/**\n     *  Indicates that the route is for other content, such as parsed HTML\n     *  files or HTML files generated from markdown.\n     *  @type {String}\n     */",
                                                meta: {
                                                    range: [2939, 2957],
                                                    filename:
                                                        "DocmaWeb.Route.js",
                                                    lineno: 88,
                                                    columnno: 4,
                                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                                    code: {
                                                        id: "astnode100001739",
                                                        name: "CONTENT",
                                                        type: "Literal",
                                                        value: "content",
                                                    },
                                                },
                                                description:
                                                    "Indicates that the route is for other content, such as parsed HTML\n files or HTML files generated from markdown.",
                                                type: { names: ["String"] },
                                                name: "CONTENT",
                                                longname:
                                                    "DocmaWeb.Route.Type.CONTENT",
                                                kind: "member",
                                                memberof: "DocmaWeb.Route.Type",
                                                scope: "static",
                                                $longname:
                                                    "DocmaWeb.Route.Type.CONTENT",
                                                $kind: "property",
                                                $docmaLink:
                                                    "api/web/#DocmaWeb.Route.Type.CONTENT",
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                comment:
                                    "/**\n     *  Array of available SPA routes of the documentation.\n     *  This is created at build-time and defined via the `src` param of the\n     *  {@link api/#Docma~BuildConfiguration|build configuration}.\n     *\n     *  @name DocmaWeb#routes\n     *  @type {Array}\n     *\n     *  @see {@link #DocmaWeb.Route|`DocmaWeb.Route`}\n     */",
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 123,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "Array of available SPA routes of the documentation.\n This is created at build-time and defined via the `src` param of the\n {@link api/#Docma~BuildConfiguration|build configuration}.",
                                name: "routes",
                                type: { names: ["Array"] },
                                see: [
                                    "{@link #DocmaWeb.Route|`DocmaWeb.Route`}",
                                ],
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb#routes",
                                scope: "instance",
                                kind: "member",
                                $longname: "DocmaWeb#routes",
                                $kind: "property",
                                $docmaLink: "api/web/#DocmaWeb#routes",
                            },
                            {
                                comment:
                                    '/**\n     *\tA flat array of JSDoc documentation symbol names. This is useful for\n     *\tbuilding menus, etc... If current route is not an API route, this will\n     *\tbe `null`.\n     *\n     *  <blockquote>See {@link api/docma#Docma~BuildConfiguration|build configuration} for more\n     *  details on how Javascript files can be grouped (and named) to form\n     *  separate API documentations and SPA routes.</blockquote>\n     *\n     *  @name DocmaWeb#symbols\n     *  @type {Array}\n     *\n     *  @example <caption>Usage in (Dust) partial</caption>\n     *  <ul class="menu">\n     *      {#symbols}\n     *          <li><a href="#{.}">{.}</a></li>\n     *      {/symbols}\n     *  </ul>\n     */',
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 318,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "A flat array of JSDoc documentation symbol names. This is useful for\n\tbuilding menus, etc... If current route is not an API route, this will\n\tbe `null`.\n\n <blockquote>See {@link api/docma#Docma~BuildConfiguration|build configuration} for more\n details on how Javascript files can be grouped (and named) to form\n separate API documentations and SPA routes.</blockquote>",
                                name: "symbols",
                                type: { names: ["Array"] },
                                examples: [
                                    '<caption>Usage in (Dust) partial</caption>\n <ul class="menu">\n     {#symbols}\n         <li><a href="#{.}">{.}</a></li>\n     {/symbols}\n </ul>',
                                ],
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb#symbols",
                                scope: "instance",
                                kind: "member",
                                $longname: "DocmaWeb#symbols",
                                $kind: "property",
                                $docmaLink: "api/web/#DocmaWeb#symbols",
                            },
                            {
                                comment:
                                    '/**\n     *  Provides template specific configuration data.\n     *  This is also useful within the Dust partials of the Docma template.\n     *  @name DocmaWeb#template\n     *  @type {Object}\n     *\n     *  @property {Object} options - Docma template options. Defined at build-time,\n     *  by the user.\n     *  @property {String} name\n     *            Name of the Docma template.\n     *  @property {String} version\n     *            Version of the Docma template.\n     *  @property {String} author\n     *            Author information for the Docma template.\n     *  @property {String} license\n     *            License information for the Docma template.\n     *  @property {String} mainHTML\n     *            Name of the main file of the template. i.e. `index.html`\n     *\n     *  @example <caption>Usage in a Dust partial</caption>\n     *  <div>\n     *      {?template.options.someOption}\n     *      <span>Displayed if someOption is true.</span>\n     *      {/template.options.someOption}\n     *  </div>\n     *  <div class="footer">{template.name} by {template.author}</div>\n     */',
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 140,
                                    columnno: 4,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "Provides template specific configuration data.\n This is also useful within the Dust partials of the Docma template.",
                                name: "template",
                                type: { names: ["Object"] },
                                properties: [
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Author information for the Docma template.",
                                        name: "author",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "License information for the Docma template.",
                                        name: "license",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Name of the main file of the template. i.e. `index.html`",
                                        name: "mainHTML",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Name of the Docma template.",
                                        name: "name",
                                    },
                                    {
                                        type: { names: ["Object"] },
                                        description:
                                            "Docma template options. Defined at build-time,\n by the user.",
                                        name: "options",
                                    },
                                    {
                                        type: { names: ["String"] },
                                        description:
                                            "Version of the Docma template.",
                                        name: "version",
                                    },
                                ],
                                examples: [
                                    '<caption>Usage in a Dust partial</caption>\n <div>\n     {?template.options.someOption}\n     <span>Displayed if someOption is true.</span>\n     {/template.options.someOption}\n </div>\n <div class="footer">{template.name} by {template.author}</div>',
                                ],
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb#template",
                                scope: "instance",
                                kind: "member",
                                $longname: "DocmaWeb#template",
                                $kind: "property",
                                $docmaLink: "api/web/#DocmaWeb#template",
                            },
                            {
                                comment:
                                    "/**\n *  Utilities for inspecting JSDoc documentation and symbols; and parsing\n *  documentation data into proper HTML.\n *  See {@link api/web/utils|`DocmaWeb.Utils` documentation}.\n *  @type {Object}\n *  @namespace\n */",
                                meta: {
                                    range: [31253, 31275],
                                    filename: "DocmaWeb.js",
                                    lineno: 945,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100001627",
                                        name: "DocmaWeb.Utils",
                                        type: "Identifier",
                                        value: "Utils",
                                        paramnames: [],
                                    },
                                },
                                description:
                                    "Utilities for inspecting JSDoc documentation and symbols; and parsing\n documentation data into proper HTML.\n See {@link api/web/utils|`DocmaWeb.Utils` documentation}.",
                                type: { names: ["Object"] },
                                kind: "namespace",
                                name: "Utils",
                                longname: "DocmaWeb.Utils",
                                memberof: "DocmaWeb",
                                scope: "static",
                                $longname: "DocmaWeb.Utils",
                                $kind: "namespace",
                                $docmaLink: "api/web/#DocmaWeb.Utils",
                            },
                            {
                                comment:
                                    "/**\n *  Gets Docma version which the documentation is built with.\n *  @name DocmaWeb#version\n *  @type {String}\n */",
                                meta: {
                                    filename: "DocmaWeb.js",
                                    lineno: 11,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "Gets Docma version which the documentation is built with.",
                                name: "version",
                                type: { names: ["String"] },
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb#version",
                                scope: "instance",
                                kind: "member",
                                $longname: "DocmaWeb#version",
                                $kind: "property",
                                $docmaLink: "api/web/#DocmaWeb#version",
                            },
                            {
                                comment:
                                    '/**\n *  Outputs a warning log to the browser console. (Unlike `console.warn()`) this\n *  method respects `debug` option of Docma build configuration.\n *  @param {...*} [args=""] - Arguments to be logged.\n */',
                                meta: {
                                    range: [19300, 19423],
                                    filename: "DocmaWeb.js",
                                    lineno: 570,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {
                                        id: "astnode100000665",
                                        name: "DocmaWeb.prototype.warn",
                                        type: "FunctionExpression",
                                        paramnames: [],
                                    },
                                },
                                description:
                                    "Outputs a warning log to the browser console. (Unlike `console.warn()`) this\n method respects `debug` option of Docma build configuration.",
                                params: [
                                    {
                                        type: { names: ["*"] },
                                        optional: true,
                                        variable: true,
                                        defaultvalue: '""',
                                        description: "Arguments to be logged.",
                                        name: "args",
                                    },
                                ],
                                name: "warn",
                                longname: "DocmaWeb#warn",
                                kind: "function",
                                memberof: "DocmaWeb",
                                scope: "instance",
                                $longname: "DocmaWeb#warn",
                                $kind: "method",
                                $docmaLink: "api/web/#DocmaWeb#warn",
                            },
                        ],
                    },
                ],
                symbols: [
                    "DocmaWeb",
                    "DocmaWeb#addFilter",
                    "DocmaWeb#apis",
                    "DocmaWeb#app",
                    "DocmaWeb#createRoute",
                    "DocmaWeb#currentRoute",
                    "DocmaWeb#documentation",
                    "DocmaWeb#error",
                    "DocmaWeb.Event",
                    "DocmaWeb~event:navigate",
                    "DocmaWeb~event:ready",
                    "DocmaWeb~event:render",
                    "DocmaWeb~event:route",
                    "DocmaWeb#fetch",
                    "DocmaWeb#filterExists",
                    "DocmaWeb#getContentElem",
                    "DocmaWeb#getDocmaElem",
                    "DocmaWeb#info",
                    "DocmaWeb#loadContent",
                    "DocmaWeb#location",
                    "DocmaWeb#log",
                    "DocmaWeb#off",
                    "DocmaWeb#on",
                    "DocmaWeb#once",
                    "DocmaWeb#removeFilter",
                    "DocmaWeb#render",
                    "DocmaWeb.Route",
                    "DocmaWeb.Route#apply",
                    "DocmaWeb.Route#contentPath",
                    "DocmaWeb.Route#exists",
                    "DocmaWeb.Route#id",
                    "DocmaWeb.Route#isCurrent",
                    "DocmaWeb.Route#isEqualTo",
                    "DocmaWeb.Route#name",
                    "DocmaWeb.Route#path",
                    "DocmaWeb.Route#sourceType",
                    "DocmaWeb.Route.SourceType",
                    "DocmaWeb.Route#toString",
                    "DocmaWeb.Route#type",
                    "DocmaWeb.Route.Type",
                    "DocmaWeb#routes",
                    "DocmaWeb#symbols",
                    "DocmaWeb#template",
                    "DocmaWeb.Utils",
                    "DocmaWeb#version",
                    "DocmaWeb#warn",
                ],
            },
            "web/utils": {
                documentation: [
                    {
                        comment:
                            "/**\n *  Docma (web) core class.\n *  See {@link api/web|documentation}.\n *  @name DocmaWeb\n *  @class\n */",
                        meta: {
                            filename: "DocmaWeb.Utils.js",
                            lineno: 6,
                            columnno: 0,
                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                            code: {},
                        },
                        description:
                            "Docma (web) core class.\n See {@link api/web|documentation}.",
                        name: "DocmaWeb",
                        kind: "class",
                        longname: "DocmaWeb",
                        scope: "global",
                        $longname: "DocmaWeb",
                        $kind: "class",
                        $docmaLink: "api/web/utils/#DocmaWeb",
                        $members: [
                            {
                                comment:
                                    "/**\n *  Utilities for inspecting JSDoc documentation and symbols; and parsing\n *  documentation data into proper HTML.\n *  @name DocmaWeb.Utils\n *  @type {Object}\n *  @namespace\n */",
                                meta: {
                                    filename: "DocmaWeb.Utils.js",
                                    lineno: 18,
                                    columnno: 0,
                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                    code: {},
                                },
                                description:
                                    "Utilities for inspecting JSDoc documentation and symbols; and parsing\n documentation data into proper HTML.",
                                name: "Utils",
                                type: { names: ["Object"] },
                                kind: "namespace",
                                memberof: "DocmaWeb",
                                longname: "DocmaWeb.Utils",
                                scope: "static",
                                $longname: "DocmaWeb.Utils",
                                $kind: "namespace",
                                $docmaLink: "api/web/utils/#DocmaWeb.Utils",
                                $members: [
                                    {
                                        comment:
                                            "/**\n *  DOM utilities.\n *  @name DocmaWeb.Utils.DOM\n *  @namespace\n *  @type {Object}\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 1563,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description: "DOM utilities.",
                                        name: "DOM",
                                        kind: "namespace",
                                        type: { names: ["Object"] },
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.DOM",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.DOM",
                                        $kind: "namespace",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.DOM",
                                        $members: [
                                            {
                                                comment:
                                                    "/**\n *  Gets the offset coordinates of the given element, relative to document\n *  body.\n *  @name DocmaWeb.Utils.DOM.getOffset\n *  @function\n *  @static\n *\n *  @param {HTMLElement} e - Target element.\n *  @returns {Object|null} -\n */",
                                                meta: {
                                                    filename:
                                                        "DocmaWeb.Utils.js",
                                                    lineno: 1575,
                                                    columnno: 0,
                                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                                    code: {},
                                                },
                                                description:
                                                    "Gets the offset coordinates of the given element, relative to document\n body.",
                                                name: "getOffset",
                                                kind: "function",
                                                scope: "static",
                                                params: [
                                                    {
                                                        type: {
                                                            names: [
                                                                "HTMLElement",
                                                            ],
                                                        },
                                                        description:
                                                            "Target element.",
                                                        name: "e",
                                                    },
                                                ],
                                                returns: [
                                                    {
                                                        type: {
                                                            names: [
                                                                "Object",
                                                                "null",
                                                            ],
                                                        },
                                                        description: "-",
                                                    },
                                                ],
                                                memberof: "DocmaWeb.Utils.DOM",
                                                longname:
                                                    "DocmaWeb.Utils.DOM.getOffset",
                                                $longname:
                                                    "DocmaWeb.Utils.DOM.getOffset",
                                                $kind: "method",
                                                $docmaLink:
                                                    "api/web/utils/#DocmaWeb.Utils.DOM.getOffset",
                                            },
                                            {
                                                comment:
                                                    "/**\n *  Scrolls the document to the given hash target.\n *  @name DocmaWeb.Utils.DOM.scrollTo\n *  @function\n *  @static\n *\n *  @param {String} [hash] - Bookmark target. If omitted, document is\n *  scrolled to the top.\n */",
                                                meta: {
                                                    filename:
                                                        "DocmaWeb.Utils.js",
                                                    lineno: 1599,
                                                    columnno: 0,
                                                    path: "/Users/JPI/projects/prozi/docma/lib/web",
                                                    code: {},
                                                },
                                                description:
                                                    "Scrolls the document to the given hash target.",
                                                name: "scrollTo",
                                                kind: "function",
                                                scope: "static",
                                                params: [
                                                    {
                                                        type: {
                                                            names: ["String"],
                                                        },
                                                        optional: true,
                                                        description:
                                                            "Bookmark target. If omitted, document is\n scrolled to the top.",
                                                        name: "hash",
                                                    },
                                                ],
                                                memberof: "DocmaWeb.Utils.DOM",
                                                longname:
                                                    "DocmaWeb.Utils.DOM.scrollTo",
                                                $longname:
                                                    "DocmaWeb.Utils.DOM.scrollTo",
                                                $kind: "method",
                                                $docmaLink:
                                                    "api/web/utils/#DocmaWeb.Utils.DOM.scrollTo",
                                            },
                                        ],
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets code file information from the given symbol.\n *  @name DocmaWeb.Utils.getCodeFileInfo\n *  @function\n *\n *  @param {Object} symbol - Target documentation symbol.\n *  @returns {Object} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 946,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets code file information from the given symbol.",
                                        name: "getCodeFileInfo",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Target documentation symbol.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Object"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.getCodeFileInfo",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.getCodeFileInfo",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.getCodeFileInfo",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets the code name of the given symbol.\n *  @name DocmaWeb.Utils.getCodeName\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {String} - If no code name, falls back to long name.\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 176,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the code name of the given symbol.",
                                        name: "getCodeName",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description:
                                                    "- If no code name, falls back to long name.",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.getCodeName",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.getCodeName",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.getCodeName",
                                    },
                                    {
                                        comment:
                                            '/**\n *  Gets HTML formatted, delimeted code tags.\n *  @name DocmaWeb.Utils.getCodeTags\n *  @function\n *\n *  @param {Array|Object} docsOrApis - Documentation array or APIs object\n *  with signature `{ documentation:Array, symbols:Array }`.\n *  @param {Array} list - String list of values to be placed within code\n *  tags.\n *  @param {Object} [options] - Options.\n *      @param {String} [options.delimeter=","] - String delimeter.\n *      @param {Boolean|String} [options.links=false] - Whether to add\n *      HTML anchor links to output. Set to `"internal"` to link\n *      internally (to Docma route with symbol hash, if found) or\n *      `"external"` to link externally (to MDN URL if this is a\n *      JS/Web-API built-in type/object) or `true` to try linking either\n *      to an internal or external target, which ever is found.\n *\n *  @returns {String} -\n */',
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 1146,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets HTML formatted, delimeted code tags.",
                                        name: "getCodeTags",
                                        kind: "function",
                                        params: [
                                            {
                                                type: {
                                                    names: ["Array", "Object"],
                                                },
                                                description:
                                                    "Documentation array or APIs object\n with signature `{ documentation:Array, symbols:Array }`.",
                                                name: "docsOrApis",
                                            },
                                            {
                                                type: { names: ["Array"] },
                                                description:
                                                    "String list of values to be placed within code\n tags.",
                                                name: "list",
                                            },
                                            {
                                                type: { names: ["Object"] },
                                                optional: true,
                                                description: "Options.",
                                                name: "options",
                                            },
                                            {
                                                type: { names: ["String"] },
                                                optional: true,
                                                defaultvalue: '","',
                                                description:
                                                    "String delimeter.",
                                                name: "options.delimeter",
                                            },
                                            {
                                                type: {
                                                    names: [
                                                        "Boolean",
                                                        "String",
                                                    ],
                                                },
                                                optional: true,
                                                defaultvalue: false,
                                                description:
                                                    'Whether to add\n     HTML anchor links to output. Set to `"internal"` to link\n     internally (to Docma route with symbol hash, if found) or\n     `"external"` to link externally (to MDN URL if this is a\n     JS/Web-API built-in type/object) or `true` to try linking either\n     to an internal or external target, which ever is found.',
                                                name: "options.links",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.getCodeTags",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.getCodeTags",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.getCodeTags",
                                    },
                                    {
                                        comment:
                                            '/**\n *  Gets HTML formatted list of emitted events from the given list. Event\n *  names items are wrapped with code tags. If multiple, formatted as an\n *  HTML unordered list.\n *  @name DocmaWeb.Utils.getEmittedEvents\n *  @function\n *\n *  @param {Array|Object} docsOrApis - Documentation array or APIs object\n *  with signature `{ documentation:Array, symbols:Array }`.\n *  @param {Array} list - List of emitted (fired) events.\n *  @param {Object} [options] - Options.\n *  @param {String} [options.delimeter=", "] - Events delimeter.\n *  @param {Boolean|String} [options.links=false] - Whether to add\n *      HTML anchor links to output. Set to `"internal"` to link\n *      internally (to Docma route with symbol hash, if found) or\n *      `"external"` to link externally (to MDN URL if this is a\n *      JS/Web-API built-in type/object) or `true` to try linking either\n *      to an internal or external target, which ever is found.\n *\n *  @returns {String} -\n */',
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 1243,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets HTML formatted list of emitted events from the given list. Event\n names items are wrapped with code tags. If multiple, formatted as an\n HTML unordered list.",
                                        name: "getEmittedEvents",
                                        kind: "function",
                                        params: [
                                            {
                                                type: {
                                                    names: ["Array", "Object"],
                                                },
                                                description:
                                                    "Documentation array or APIs object\n with signature `{ documentation:Array, symbols:Array }`.",
                                                name: "docsOrApis",
                                            },
                                            {
                                                type: { names: ["Array"] },
                                                description:
                                                    "List of emitted (fired) events.",
                                                name: "list",
                                            },
                                            {
                                                type: { names: ["Object"] },
                                                optional: true,
                                                description: "Options.",
                                                name: "options",
                                            },
                                            {
                                                type: { names: ["String"] },
                                                optional: true,
                                                defaultvalue: '", "',
                                                description:
                                                    "Events delimeter.",
                                                name: "options.delimeter",
                                            },
                                            {
                                                type: {
                                                    names: [
                                                        "Boolean",
                                                        "String",
                                                    ],
                                                },
                                                optional: true,
                                                defaultvalue: false,
                                                description:
                                                    'Whether to add\n     HTML anchor links to output. Set to `"internal"` to link\n     internally (to Docma route with symbol hash, if found) or\n     `"external"` to link externally (to MDN URL if this is a\n     JS/Web-API built-in type/object) or `true` to try linking either\n     to an internal or external target, which ever is found.',
                                                name: "options.links",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.getEmittedEvents",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.getEmittedEvents",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.getEmittedEvents",
                                    },
                                    {
                                        comment:
                                            '/**\n *  Gets HTML formatted list of types from the given symbols list. Type\n *  items are wrapped with code tags. If multiple, formatted as an HTML\n *  unordered list.\n *  @name DocmaWeb.Utils.getFormattedTypeList\n *  @function\n *\n *  @param {Array|Object} docsOrApis - Documentation array or APIs object\n *  with signature `{ documentation:Array, symbols:Array }`.\n *  @param {Array} list - List of symbols to be converted to formatted\n *  string.\n *  @param {Object} [options] - Format options.\n *      @param {String} [options.delimeter="|"] - Types delimeter.\n *      @param {Boolean|String} [options.links=false] - Whether to add\n *      HTML anchor links to output. Set to `"internal"` to link\n *      internally (to Docma route with symbol hash, if found) or\n *      `"external"` to link externally (to MDN URL if this is a\n *      JS/Web-API built-in type/object) or `true` to try linking either\n *      to an internal or external target, which ever is found.\n *      @param {Boolean} [options.descriptions=true] - Whether to include descriptions.\n *      @param {String} [options.descDelimeter="  —  "] - Description delimiter.\n *\n *  @returns {String} -\n */',
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 1181,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets HTML formatted list of types from the given symbols list. Type\n items are wrapped with code tags. If multiple, formatted as an HTML\n unordered list.",
                                        name: "getFormattedTypeList",
                                        kind: "function",
                                        params: [
                                            {
                                                type: {
                                                    names: ["Array", "Object"],
                                                },
                                                description:
                                                    "Documentation array or APIs object\n with signature `{ documentation:Array, symbols:Array }`.",
                                                name: "docsOrApis",
                                            },
                                            {
                                                type: { names: ["Array"] },
                                                description:
                                                    "List of symbols to be converted to formatted\n string.",
                                                name: "list",
                                            },
                                            {
                                                type: { names: ["Object"] },
                                                optional: true,
                                                description: "Format options.",
                                                name: "options",
                                            },
                                            {
                                                type: { names: ["String"] },
                                                optional: true,
                                                defaultvalue: '"|"',
                                                description: "Types delimeter.",
                                                name: "options.delimeter",
                                            },
                                            {
                                                type: {
                                                    names: [
                                                        "Boolean",
                                                        "String",
                                                    ],
                                                },
                                                optional: true,
                                                defaultvalue: false,
                                                description:
                                                    'Whether to add\n     HTML anchor links to output. Set to `"internal"` to link\n     internally (to Docma route with symbol hash, if found) or\n     `"external"` to link externally (to MDN URL if this is a\n     JS/Web-API built-in type/object) or `true` to try linking either\n     to an internal or external target, which ever is found.',
                                                name: "options.links",
                                            },
                                            {
                                                type: { names: ["Boolean"] },
                                                optional: true,
                                                defaultvalue: true,
                                                description:
                                                    "Whether to include descriptions.",
                                                name: "options.descriptions",
                                            },
                                            {
                                                type: { names: ["String"] },
                                                optional: true,
                                                defaultvalue: '"  —  "',
                                                description:
                                                    "Description delimiter.",
                                                name: "options.descDelimeter",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.getFormattedTypeList",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.getFormattedTypeList",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.getFormattedTypeList",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Builds a string of keywords from the given symbol.\n *  This is useful for filter/search features of a template.\n *  @name DocmaWeb.Utils.getKeywords\n *  @function\n *\n *  @param {Object} symbol - Target documentation symbol.\n *  @returns {String} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 906,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Builds a string of keywords from the given symbol.\n This is useful for filter/search features of a template.",
                                        name: "getKeywords",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Target documentation symbol.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.getKeywords",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.getKeywords",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.getKeywords",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets the number of levels for the given symbol or name. e.g.\n *  `mylib.prop` has 2 levels.\n *  @name DocmaWeb.Utils.getLevels\n *  @function\n *\n *  @param {Object|String} symbol - Documented symbol object or long name.\n *  @returns {Number} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 232,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the number of levels for the given symbol or name. e.g.\n `mylib.prop` has 2 levels.",
                                        name: "getLevels",
                                        kind: "function",
                                        params: [
                                            {
                                                type: {
                                                    names: ["Object", "String"],
                                                },
                                                description:
                                                    "Documented symbol object or long name.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Number"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.getLevels",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.getLevels",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.getLevels",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets the original long name of the given symbol.\n *  JSDoc overwrites the `longname` and `name` of the symbol, if it has an\n *  alias. This returns the correct long name.\n *  @name DocmaWeb.Utils.getLongName\n *  @function\n *  @alias getFullName\n *  @static\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {String} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 138,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the original long name of the given symbol.\n JSDoc overwrites the `longname` and `name` of the symbol, if it has an\n alias. This returns the correct long name.",
                                        name: "getLongName",
                                        kind: "function",
                                        alias: "getFullName",
                                        scope: "static",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.getLongName",
                                        $longname: "DocmaWeb.Utils.getLongName",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.getLongName",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets the short name of the given symbol.\n *  JSDoc overwrites the `longname` and `name` of the symbol, if it has an\n *  alias. This returns the correct short name.\n *  @name DocmaWeb.Utils.getName\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {String} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 119,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the short name of the given symbol.\n JSDoc overwrites the `longname` and `name` of the symbol, if it has an\n alias. This returns the correct short name.",
                                        name: "getName",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.getName",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.getName",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.getName",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets the parent symbol object from the given symbol object or symbol's\n *  name.\n *  @name DocmaWeb.Utils.getParent\n *  @function\n *\n *  @param {Array|Object} docs - Documentation array or APIs object\n *  with signature `{ documentation:Array, symbols:Array }`.\n *  @param {Object|String} symbol - Documented symbol object or long name.\n *  @returns {String} - `null` if symbol has no parent.\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 281,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the parent symbol object from the given symbol object or symbol's\n name.",
                                        name: "getParent",
                                        kind: "function",
                                        params: [
                                            {
                                                type: {
                                                    names: ["Array", "Object"],
                                                },
                                                description:
                                                    "Documentation array or APIs object\n with signature `{ documentation:Array, symbols:Array }`.",
                                                name: "docs",
                                            },
                                            {
                                                type: {
                                                    names: ["Object", "String"],
                                                },
                                                description:
                                                    "Documented symbol object or long name.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description:
                                                    "- `null` if symbol has no parent.",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.getParent",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.getParent",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.getParent",
                                    },
                                    {
                                        comment:
                                            '/**\n *  Gets the parent symbol name from the given symbol object or symbol\'s name\n *  (notation). Note that, this will return the parent name even if the parent\n *  symbol does not exist in the documentation. If there is no parent, returns\n *  `""` (empty string).\n *  @name DocmaWeb.Utils.getParentName\n *  @function\n *\n *  @param {Object|String} symbol - Documented symbol object or long name.\n *  @returns {Number} -\n */',
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 250,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            'Gets the parent symbol name from the given symbol object or symbol\'s name\n (notation). Note that, this will return the parent name even if the parent\n symbol does not exist in the documentation. If there is no parent, returns\n `""` (empty string).',
                                        name: "getParentName",
                                        kind: "function",
                                        params: [
                                            {
                                                type: {
                                                    names: ["Object", "String"],
                                                },
                                                description:
                                                    "Documented symbol object or long name.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Number"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.getParentName",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.getParentName",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.getParentName",
                                    },
                                    {
                                        comment:
                                            '/**\n *  Gets the return types of the symbol as a string (joined with pipes `|`).\n *  @name DocmaWeb.Utils.getReturnTypes\n *  @function\n *\n *  @param {Array|Object} docsOrApis - Documentation array or APIs object\n *  with signature `{ documentation:Array, symbols:Array }`.\n *  @param {Object} symbol - Target documentation symbol.\n *  @param {Object} [options] - Options.\n *      @param {Boolean|String} [options.links=false] - Whether to add\n *      HTML anchor links to output. Set to `"internal"` to link\n *      internally (to Docma route with symbol hash, if found) or\n *      `"external"` to link externally (to MDN URL if this is a\n *      JS/Web-API built-in type/object) or `true` to try linking either\n *      to an internal or external target, which ever is found.\n *\n *  @returns {String} -\n */',
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 1107,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the return types of the symbol as a string (joined with pipes `|`).",
                                        name: "getReturnTypes",
                                        kind: "function",
                                        params: [
                                            {
                                                type: {
                                                    names: ["Array", "Object"],
                                                },
                                                description:
                                                    "Documentation array or APIs object\n with signature `{ documentation:Array, symbols:Array }`.",
                                                name: "docsOrApis",
                                            },
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Target documentation symbol.",
                                                name: "symbol",
                                            },
                                            {
                                                type: { names: ["Object"] },
                                                optional: true,
                                                description: "Options.",
                                                name: "options",
                                            },
                                            {
                                                type: {
                                                    names: [
                                                        "Boolean",
                                                        "String",
                                                    ],
                                                },
                                                optional: true,
                                                defaultvalue: false,
                                                description:
                                                    'Whether to add\n     HTML anchor links to output. Set to `"internal"` to link\n     internally (to Docma route with symbol hash, if found) or\n     `"external"` to link externally (to MDN URL if this is a\n     JS/Web-API built-in type/object) or `true` to try linking either\n     to an internal or external target, which ever is found.',
                                                name: "options.links",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.getReturnTypes",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.getReturnTypes",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.getReturnTypes",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets the first matching symbol by the given name.\n *  @name DocmaWeb.Utils.getSymbolByName\n *  @function\n *\n *  @param {Array|Object} docsOrApis - Documentation array or APIs object\n *  with signature `{ documentation:Array, symbols:Array }`.\n *  @param {String} name - Symbol name to be checked. Better, pass the\n *  `longname` (or `$longname`). It will still find a short name but it'll\n *  return the first occurence if there are multiple symbols with the same\n *  short name. e.g. `create` is ambiguous but `Docma.create` is unique.\n *\n *  @returns {Object} - Symbol object if found. Otherwise, returns `null`.\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 188,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the first matching symbol by the given name.",
                                        name: "getSymbolByName",
                                        kind: "function",
                                        params: [
                                            {
                                                type: {
                                                    names: ["Array", "Object"],
                                                },
                                                description:
                                                    "Documentation array or APIs object\n with signature `{ documentation:Array, symbols:Array }`.",
                                                name: "docsOrApis",
                                            },
                                            {
                                                type: { names: ["String"] },
                                                description:
                                                    "Symbol name to be checked. Better, pass the\n `longname` (or `$longname`). It will still find a short name but it'll\n return the first occurence if there are multiple symbols with the same\n short name. e.g. `create` is ambiguous but `Docma.create` is unique.",
                                                name: "name",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "- Symbol object if found. Otherwise, returns `null`.",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.getSymbolByName",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.getSymbolByName",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.getSymbolByName",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets Docma route link for the given symbol or symbol name.\n *  @name DocmaWeb.Utils.getSymbolLink\n *  @function\n *  @static\n *\n *  @param {Array|Object} docsOrApis - Documentation array or APIs object\n *  with signature `{ documentation:Array, symbols:Array }`.\n *  @param {Object|String} symbolOrName - Either the symbol itself or the\n *  name of the symbol.\n *\n *  @returns {String} - Empty string if symbol is not found.\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 962,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets Docma route link for the given symbol or symbol name.",
                                        name: "getSymbolLink",
                                        kind: "function",
                                        scope: "static",
                                        params: [
                                            {
                                                type: {
                                                    names: ["Array", "Object"],
                                                },
                                                description:
                                                    "Documentation array or APIs object\n with signature `{ documentation:Array, symbols:Array }`.",
                                                name: "docsOrApis",
                                            },
                                            {
                                                type: {
                                                    names: ["Object", "String"],
                                                },
                                                description:
                                                    "Either the symbol itself or the\n name of the symbol.",
                                                name: "symbolOrName",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description:
                                                    "- Empty string if symbol is not found.",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.getSymbolLink",
                                        $longname:
                                            "DocmaWeb.Utils.getSymbolLink",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.getSymbolLink",
                                    },
                                    {
                                        comment:
                                            '/**\n *  Gets the types of the symbol as a string (joined with pipes `|`).\n *  @name DocmaWeb.Utils.getTypes\n *  @function\n *\n *  @param {Array|Object} docsOrApis - Documentation array or APIs object\n *  with signature `{ documentation:Array, symbols:Array }`.\n *  @param {Object} symbol - Target documentation symbol.\n *  @param {Object} [options] - Options.\n *      @param {Boolean|String} [options.links=false] - Whether to add\n *      HTML anchor links to output. Set to `"internal"` to link\n *      internally (to Docma route with symbol hash, if found) or\n *      `"external"` to link externally (to MDN URL if this is a\n *      JS/Web-API built-in type/object) or `true` to try linking either\n *      to an internal or external target, which ever is found.\n *\n *  @returns {String} -\n *\n *  @example\n *  var symbol = { "type": { "names": ["Number", "String"] } };\n *  DocmaWeb.Utils.getTypes(docs, symbol); // "Number|String"\n */',
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 1059,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the types of the symbol as a string (joined with pipes `|`).",
                                        name: "getTypes",
                                        kind: "function",
                                        params: [
                                            {
                                                type: {
                                                    names: ["Array", "Object"],
                                                },
                                                description:
                                                    "Documentation array or APIs object\n with signature `{ documentation:Array, symbols:Array }`.",
                                                name: "docsOrApis",
                                            },
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Target documentation symbol.",
                                                name: "symbol",
                                            },
                                            {
                                                type: { names: ["Object"] },
                                                optional: true,
                                                description: "Options.",
                                                name: "options",
                                            },
                                            {
                                                type: {
                                                    names: [
                                                        "Boolean",
                                                        "String",
                                                    ],
                                                },
                                                optional: true,
                                                defaultvalue: false,
                                                description:
                                                    'Whether to add\n     HTML anchor links to output. Set to `"internal"` to link\n     internally (to Docma route with symbol hash, if found) or\n     `"external"` to link externally (to MDN URL if this is a\n     JS/Web-API built-in type/object) or `true` to try linking either\n     to an internal or external target, which ever is found.',
                                                name: "options.links",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        examples: [
                                            'var symbol = { "type": { "names": ["Number", "String"] } };\n DocmaWeb.Utils.getTypes(docs, symbol); // "Number|String"',
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.getTypes",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.getTypes",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.getTypes",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol has description.\n *  @name DocmaWeb.Utils.hasDescription\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 711,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol has description.",
                                        name: "hasDescription",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.hasDescription",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.hasDescription",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.hasDescription",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is a callback definition.\n *  @name DocmaWeb.Utils.isCallback\n *  @function\n *  @static\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 565,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is a callback definition.",
                                        name: "isCallback",
                                        kind: "function",
                                        scope: "static",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isCallback",
                                        $longname: "DocmaWeb.Utils.isCallback",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isCallback",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is a class.\n *  @name DocmaWeb.Utils.isClass\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 365,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is a class.",
                                        name: "isClass",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isClass",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isClass",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isClass",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is marked as a constant.\n *  @name DocmaWeb.Utils.isConstant\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 382,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is marked as a constant.",
                                        name: "isConstant",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isConstant",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isConstant",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isConstant",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is a constructor.\n *  @name DocmaWeb.Utils.isConstructor\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 394,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is a constructor.",
                                        name: "isConstructor",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.isConstructor",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.isConstructor",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isConstructor",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is deprecated.\n *  @name DocmaWeb.Utils.isDeprecated\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 304,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is deprecated.",
                                        name: "isDeprecated",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isDeprecated",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.isDeprecated",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isDeprecated",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is an enumeration.\n *  @name DocmaWeb.Utils.isEnum\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 584,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is an enumeration.",
                                        name: "isEnum",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isEnum",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isEnum",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isEnum",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is an event.\n *  @name DocmaWeb.Utils.isEvent\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 596,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is an event.",
                                        name: "isEvent",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isEvent",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isEvent",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isEvent",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is defined outside of the current package.\n *  @name DocmaWeb.Utils.isExternal\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 608,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is defined outside of the current package.",
                                        name: "isExternal",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isExternal",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isExternal",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isExternal",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is a generator function.\n *  @name DocmaWeb.Utils.isGenerator\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 620,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is a generator function.",
                                        name: "isGenerator",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isGenerator",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isGenerator",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isGenerator",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol has global scope.\n *  @name DocmaWeb.Utils.isGlobal\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 316,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol has global scope.",
                                        name: "isGlobal",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isGlobal",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isGlobal",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isGlobal",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol has an inner scope.\n *  @name DocmaWeb.Utils.isInner\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 429,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol has an inner scope.",
                                        name: "isInner",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isInner",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isInner",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isInner",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is an instance member.\n *  @name DocmaWeb.Utils.isInstanceMember\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 441,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is an instance member.",
                                        name: "isInstanceMember",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.isInstanceMember",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.isInstanceMember",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isInstanceMember",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is an instance method.\n *  @name DocmaWeb.Utils.isInstanceMethod\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 486,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is an instance method.",
                                        name: "isInstanceMethod",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.isInstanceMethod",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.isInstanceMethod",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isInstanceMethod",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is an instance property.\n *  @name DocmaWeb.Utils.isInstanceProperty\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 522,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is an instance property.",
                                        name: "isInstanceProperty",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.isInstanceProperty",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.isInstanceProperty",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isInstanceProperty",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is marked as an interface that other symbols\n *  can implement.\n *  @name DocmaWeb.Utils.isInterface\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 453,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is marked as an interface that other symbols\n can implement.",
                                        name: "isInterface",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isInterface",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isInterface",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isInterface",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is a method (function).\n *  @name DocmaWeb.Utils.isMethod\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 466,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is a method (function).",
                                        name: "isMethod",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isMethod",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isMethod",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isMethod",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is marked as a mixin (is intended to be\n *  added to other objects).\n *  @name DocmaWeb.Utils.isMixin\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 352,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is marked as a mixin (is intended to be\n added to other objects).",
                                        name: "isMixin",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isMixin",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isMixin",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isMixin",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is a module.\n *  @name DocmaWeb.Utils.isModule\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 340,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is a module.",
                                        name: "isModule",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isModule",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isModule",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isModule",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is a namespace.\n *  @name DocmaWeb.Utils.isNamespace\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 328,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is a namespace.",
                                        name: "isNamespace",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isNamespace",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isNamespace",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isNamespace",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol has `package` private access; indicating\n *  that the symbol is available only to code in the same directory as the\n *  source file for this symbol.\n *  @name DocmaWeb.Utils.isPackagePrivate\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 668,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol has `package` private access; indicating\n that the symbol is available only to code in the same directory as the\n source file for this symbol.",
                                        name: "isPackagePrivate",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.isPackagePrivate",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.isPackagePrivate",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isPackagePrivate",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol has `private` access.\n *  @name DocmaWeb.Utils.isPrivate\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 656,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol has `private` access.",
                                        name: "isPrivate",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isPrivate",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isPrivate",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isPrivate",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is a property (and not a method/function).\n *  @name DocmaWeb.Utils.isProperty\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 510,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is a property (and not a method/function).",
                                        name: "isProperty",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isProperty",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isProperty",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isProperty",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol has `protected` access.\n *  @name DocmaWeb.Utils.isProtected\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 682,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol has `protected` access.",
                                        name: "isProtected",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isProtected",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isProtected",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isProtected",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol has `public` access.\n *  @name DocmaWeb.Utils.isPublic\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 644,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol has `public` access.",
                                        name: "isPublic",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isPublic",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isPublic",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isPublic",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is read-only.\n *  @name DocmaWeb.Utils.isReadOnly\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 632,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is read-only.",
                                        name: "isReadOnly",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isReadOnly",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.isReadOnly",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isReadOnly",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is a static member.\n *  @name DocmaWeb.Utils.isStaticMember\n *  @function\n *  @alias isStatic\n *  @static\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 410,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is a static member.",
                                        name: "isStaticMember",
                                        kind: "function",
                                        alias: "isStatic",
                                        scope: "static",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.isStaticMember",
                                        $longname:
                                            "DocmaWeb.Utils.isStaticMember",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isStaticMember",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is a static method.\n *  @name DocmaWeb.Utils.isStaticMethod\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 498,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is a static method.",
                                        name: "isStaticMethod",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.isStaticMethod",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.isStaticMethod",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isStaticMethod",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is a static property.\n *  @name DocmaWeb.Utils.isStaticProperty\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 534,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is a static property.",
                                        name: "isStaticProperty",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.isStaticProperty",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.isStaticProperty",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isStaticProperty",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is a custom type definition.\n *  @name DocmaWeb.Utils.isTypeDef\n *  @function\n *  @alias isCustomType\n *  @static\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 546,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is a custom type definition.",
                                        name: "isTypeDef",
                                        kind: "function",
                                        alias: "isCustomType",
                                        scope: "static",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.isTypeDef",
                                        $longname: "DocmaWeb.Utils.isTypeDef",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isTypeDef",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Checks whether the given symbol is undocumented.\n *  This checks if the symbol has any comments.\n *  @name DocmaWeb.Utils.isUndocumented\n *  @function\n *\n *  @param {Object} symbol - Documented symbol object.\n *  @returns {Boolean} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 694,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Checks whether the given symbol is undocumented.\n This checks if the symbol has any comments.",
                                        name: "isUndocumented",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description:
                                                    "Documented symbol object.",
                                                name: "symbol",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["Boolean"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.isUndocumented",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.isUndocumented",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.isUndocumented",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Normalizes the number of spaces/tabs to multiples of 2 spaces, in the\n *  beginning of each line. Useful for fixing mixed indets of a description\n *  or example.\n *  @name DocmaWeb.Utils.normalizeTabs\n *  @function\n *\n *  @param {String} string - String to process.\n *\n *  @returns {String} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 864,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Normalizes the number of spaces/tabs to multiples of 2 spaces, in the\n beginning of each line. Useful for fixing mixed indets of a description\n or example.",
                                        name: "normalizeTabs",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["String"] },
                                                description:
                                                    "String to process.",
                                                name: "string",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.normalizeTabs",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.normalizeTabs",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.normalizeTabs",
                                    },
                                    {
                                        comment:
                                            '/**\n *  Gets the value of the target property by the given dot\n *  {@link https://github.com/onury/notation|notation}.\n *  @name DocmaWeb.Utils.notate\n *  @function\n *  @static\n *\n *  @param {Object} obj - Source object.\n *  @param {String} notation - Path of the property in dot-notation.\n *\n *  @returns {*} - The value of the notation. If the given notation does\n *  not exist, safely returns `undefined`.\n *\n *  @example\n *  var symbol = { code: { meta: { type: "MethodDefinition" } } };\n *  DocmaWeb.Utils.notate(symbol, "code.meta.type"); // returns "MethodDefinition"\n */',
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 88,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the value of the target property by the given dot\n {@link https://github.com/onury/notation|notation}.",
                                        name: "notate",
                                        kind: "function",
                                        scope: "static",
                                        params: [
                                            {
                                                type: { names: ["Object"] },
                                                description: "Source object.",
                                                name: "obj",
                                            },
                                            {
                                                type: { names: ["String"] },
                                                description:
                                                    "Path of the property in dot-notation.",
                                                name: "notation",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["*"] },
                                                description:
                                                    "- The value of the notation. If the given notation does\n not exist, safely returns `undefined`.",
                                            },
                                        ],
                                        examples: [
                                            'var symbol = { code: { meta: { type: "MethodDefinition" } } };\n DocmaWeb.Utils.notate(symbol, "code.meta.type"); // returns "MethodDefinition"',
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.notate",
                                        $longname: "DocmaWeb.Utils.notate",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.notate",
                                    },
                                    {
                                        comment:
                                            '/**\n *  Parses the given string into proper HTML. Removes leading whitespace,\n *  converts new lines to paragraphs, ticks to code tags and JSDoc links to\n *  anchors.\n *  @name DocmaWeb.Utils.parse\n *  @function\n *\n *  @param {String} string - String to be parsed.\n *  @param {Object} [options] - Parse options.\n *         @param {Object} [options.keepIfSingle=false]\n *         If enabled, single lines will not be converted to paragraphs.\n *         @param {String} [options.target]\n *         Href target for links. e.g. `"_blank"`\n *\n *  @returns {String} -\n */',
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 840,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Parses the given string into proper HTML. Removes leading whitespace,\n converts new lines to paragraphs, ticks to code tags and JSDoc links to\n anchors.",
                                        name: "parse",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["String"] },
                                                description:
                                                    "String to be parsed.",
                                                name: "string",
                                            },
                                            {
                                                type: { names: ["Object"] },
                                                optional: true,
                                                description: "Parse options.",
                                                name: "options",
                                            },
                                            {
                                                type: { names: ["Object"] },
                                                optional: true,
                                                defaultvalue: false,
                                                description:
                                                    "If enabled, single lines will not be converted to paragraphs.",
                                                name: "options.keepIfSingle",
                                            },
                                            {
                                                type: { names: ["String"] },
                                                optional: true,
                                                description:
                                                    'Href target for links. e.g. `"_blank"`',
                                                name: "options.target",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.parse",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.parse",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.parse",
                                    },
                                    {
                                        comment:
                                            '/**\n *  Converts JSDoc `@link` directives to HTML anchor tags.\n *  @name DocmaWeb.Utils.parseLinks\n *  @function\n *\n *  @param {String} string - String to be parsed.\n *  @param {Object} [options] - Parse options.\n *  @param {String} [options.target] - Href target. e.g. `"_blank"`\n *\n *  @returns {String} -\n */',
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 800,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Converts JSDoc `@link` directives to HTML anchor tags.",
                                        name: "parseLinks",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["String"] },
                                                description:
                                                    "String to be parsed.",
                                                name: "string",
                                            },
                                            {
                                                type: { names: ["Object"] },
                                                optional: true,
                                                description: "Parse options.",
                                                name: "options",
                                            },
                                            {
                                                type: { names: ["String"] },
                                                optional: true,
                                                description:
                                                    'Href target. e.g. `"_blank"`',
                                                name: "options.target",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.parseLinks",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.parseLinks",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.parseLinks",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Converts new lines to HTML paragraphs.\n *  @name DocmaWeb.Utils.parseNewLines\n *  @function\n *\n *  @param {String} string - String to be parsed.\n *  @param {Object} [options] - Parse options.\n *         @param {Boolean} [options.keepIfSingle=false]\n *         If `true`, lines will not be converted to paragraphs.\n *\n *  @returns {String} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 774,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Converts new lines to HTML paragraphs.",
                                        name: "parseNewLines",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["String"] },
                                                description:
                                                    "String to be parsed.",
                                                name: "string",
                                            },
                                            {
                                                type: { names: ["Object"] },
                                                optional: true,
                                                description: "Parse options.",
                                                name: "options",
                                            },
                                            {
                                                type: { names: ["Boolean"] },
                                                optional: true,
                                                defaultvalue: false,
                                                description:
                                                    "If `true`, lines will not be converted to paragraphs.",
                                                name: "options.keepIfSingle",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname:
                                            "DocmaWeb.Utils.parseNewLines",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.parseNewLines",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.parseNewLines",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Converts back-ticks to HTML code tags.\n *  @name DocmaWeb.Utils.parseTicks\n *  @function\n *\n *  @param {String} string\n *         String to be parsed.\n *\n *  @returns {String} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 749,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Converts back-ticks to HTML code tags.",
                                        name: "parseTicks",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["String"] },
                                                description:
                                                    "String to be parsed.",
                                                name: "string",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.parseTicks",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.parseTicks",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.parseTicks",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Removes leading spaces and dashes. Useful when displaying symbol\n *  descriptions.\n *  @name DocmaWeb.Utils.trimLeft\n *  @function\n *\n *  @param {String} string - String to be trimmed.\n *  @returns {String} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 723,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Removes leading spaces and dashes. Useful when displaying symbol\n descriptions.",
                                        name: "trimLeft",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["String"] },
                                                description:
                                                    "String to be trimmed.",
                                                name: "string",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.trimLeft",
                                        scope: "static",
                                        $longname: "DocmaWeb.Utils.trimLeft",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.trimLeft",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Removes leading and trailing new lines.\n *  @name DocmaWeb.Utils.trimNewLines\n *  @function\n *\n *  @param {String} string - String to be trimmed.\n *  @returns {String} -\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 737,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Removes leading and trailing new lines.",
                                        name: "trimNewLines",
                                        kind: "function",
                                        params: [
                                            {
                                                type: { names: ["String"] },
                                                description:
                                                    "String to be trimmed.",
                                                name: "string",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description: "-",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.trimNewLines",
                                        scope: "static",
                                        $longname:
                                            "DocmaWeb.Utils.trimNewLines",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.trimNewLines",
                                    },
                                    {
                                        comment:
                                            "/**\n *  Gets the type of the given object.\n *  @name DocmaWeb.Utils.type\n *  @function\n *  @static\n *\n *  @param {*} obj - Object to be inspected.\n *  @returns {String} - Lower-case name of the type.\n */",
                                        meta: {
                                            filename: "DocmaWeb.Utils.js",
                                            lineno: 72,
                                            columnno: 0,
                                            path: "/Users/JPI/projects/prozi/docma/lib/web",
                                            code: {},
                                        },
                                        description:
                                            "Gets the type of the given object.",
                                        name: "type",
                                        kind: "function",
                                        scope: "static",
                                        params: [
                                            {
                                                type: { names: ["*"] },
                                                description:
                                                    "Object to be inspected.",
                                                name: "obj",
                                            },
                                        ],
                                        returns: [
                                            {
                                                type: { names: ["String"] },
                                                description:
                                                    "- Lower-case name of the type.",
                                            },
                                        ],
                                        memberof: "DocmaWeb.Utils",
                                        longname: "DocmaWeb.Utils.type",
                                        $longname: "DocmaWeb.Utils.type",
                                        $kind: "method",
                                        $docmaLink:
                                            "api/web/utils/#DocmaWeb.Utils.type",
                                    },
                                ],
                            },
                        ],
                    },
                ],
                symbols: [
                    "DocmaWeb",
                    "DocmaWeb.Utils",
                    "DocmaWeb.Utils.DOM",
                    "DocmaWeb.Utils.DOM.getOffset",
                    "DocmaWeb.Utils.DOM.scrollTo",
                    "DocmaWeb.Utils.getCodeFileInfo",
                    "DocmaWeb.Utils.getCodeName",
                    "DocmaWeb.Utils.getCodeTags",
                    "DocmaWeb.Utils.getEmittedEvents",
                    "DocmaWeb.Utils.getFormattedTypeList",
                    "DocmaWeb.Utils.getKeywords",
                    "DocmaWeb.Utils.getLevels",
                    "DocmaWeb.Utils.getLongName",
                    "DocmaWeb.Utils.getName",
                    "DocmaWeb.Utils.getParent",
                    "DocmaWeb.Utils.getParentName",
                    "DocmaWeb.Utils.getReturnTypes",
                    "DocmaWeb.Utils.getSymbolByName",
                    "DocmaWeb.Utils.getSymbolLink",
                    "DocmaWeb.Utils.getTypes",
                    "DocmaWeb.Utils.hasDescription",
                    "DocmaWeb.Utils.isCallback",
                    "DocmaWeb.Utils.isClass",
                    "DocmaWeb.Utils.isConstant",
                    "DocmaWeb.Utils.isConstructor",
                    "DocmaWeb.Utils.isDeprecated",
                    "DocmaWeb.Utils.isEnum",
                    "DocmaWeb.Utils.isEvent",
                    "DocmaWeb.Utils.isExternal",
                    "DocmaWeb.Utils.isGenerator",
                    "DocmaWeb.Utils.isGlobal",
                    "DocmaWeb.Utils.isInner",
                    "DocmaWeb.Utils.isInstanceMember",
                    "DocmaWeb.Utils.isInstanceMethod",
                    "DocmaWeb.Utils.isInstanceProperty",
                    "DocmaWeb.Utils.isInterface",
                    "DocmaWeb.Utils.isMethod",
                    "DocmaWeb.Utils.isMixin",
                    "DocmaWeb.Utils.isModule",
                    "DocmaWeb.Utils.isNamespace",
                    "DocmaWeb.Utils.isPackagePrivate",
                    "DocmaWeb.Utils.isPrivate",
                    "DocmaWeb.Utils.isProperty",
                    "DocmaWeb.Utils.isProtected",
                    "DocmaWeb.Utils.isPublic",
                    "DocmaWeb.Utils.isReadOnly",
                    "DocmaWeb.Utils.isStaticMember",
                    "DocmaWeb.Utils.isStaticMethod",
                    "DocmaWeb.Utils.isStaticProperty",
                    "DocmaWeb.Utils.isTypeDef",
                    "DocmaWeb.Utils.isUndocumented",
                    "DocmaWeb.Utils.normalizeTabs",
                    "DocmaWeb.Utils.notate",
                    "DocmaWeb.Utils.parse",
                    "DocmaWeb.Utils.parseLinks",
                    "DocmaWeb.Utils.parseNewLines",
                    "DocmaWeb.Utils.parseTicks",
                    "DocmaWeb.Utils.trimLeft",
                    "DocmaWeb.Utils.trimNewLines",
                    "DocmaWeb.Utils.type",
                ],
            },
        },
        app: {
            title: "Docma Documentation",
            meta: null,
            base: "./",
            entrance: "content:home",
            routing: { method: "path", caseSensitive: true },
            server: "github",
            favicon: "./favicon.ico",
        },
        template: {
            name: "docma-template-zebra",
            description:
                "Zebra - Default template for Docma. https://github.com/onury/docma",
            version: "2.3.1",
            supportedDocmaVersion: ">=2.0.0",
            author: "Onur Yıldırım",
            license: "MIT",
            mainHTML: "index.html",
            options: {
                title: { label: "Docma", href: "." },
                logo: {
                    dark: "img/docma-logo.png",
                    light: "img/docma-logo.png",
                },
                sidebar: {
                    enabled: true,
                    outline: "tree",
                    collapsed: false,
                    toolbar: true,
                    itemsFolded: false,
                    itemsOverflow: "crop",
                    badges: true,
                    search: true,
                    animations: true,
                },
                symbols: {
                    autoLink: true,
                    params: "list",
                    enums: "list",
                    props: "list",
                    meta: false,
                },
                contentView: {
                    bookmarks: "h1,h2,h3",
                    faLibs: "all",
                    faVersion: "5.5.0",
                },
                navbar: {
                    enabled: true,
                    fixed: true,
                    dark: false,
                    animations: true,
                    menu: [
                        {
                            iconClass: "fas fa-book",
                            label: "Building Docs",
                            items: [
                                { label: "Guide", href: "." },
                                { separator: true },
                                { label: "Docma (Builder) API", href: "api" },
                                {
                                    label: "Build Configuration",
                                    href: "api/#Docma~BuildConfiguration",
                                },
                            ],
                            chevron: true,
                        },
                        {
                            iconClass: "fas fa-puzzle-piece",
                            label: "Templates",
                            items: [
                                {
                                    label: "Default Template - Zebra",
                                    href: "templates/zebra",
                                },
                                { separator: true },
                                {
                                    label: "Docma Template API",
                                    href: "api/#Docma.Template",
                                },
                                { label: "Docma Web API", href: "api/web" },
                            ],
                            chevron: true,
                        },
                        {
                            iconClass: "fas fa-cloud-download-alt",
                            label: "Download",
                            items: [
                                {
                                    label: "<code>npm i @jacekpietal/docma -D</code>",
                                    href: "https://www.npmjs.com/package/@jacekpietal/docma",
                                    target: "_blank",
                                },
                                {
                                    label: "Docma Releases",
                                    href: "https://github.com/Prozi/docma/releases",
                                    target: "_blank",
                                },
                                { separator: true },
                                { label: "Change Log", href: "changelog" },
                            ],
                            chevron: true,
                        },
                        {
                            iconClass: "fab fa-lg fa-github",
                            label: "",
                            href: "https://github.com/Prozi/docma",
                            target: "_blank",
                        },
                    ],
                },
            },
        },
        partials: {
            api: "docma-api",
            content: "docma-content",
            notFound: "docma-404",
        },
        elementID: "docma-main",
        contentElementID: "docma-content",
        defaultApiName: "_def_",
        logsEnabled: true,
    }),
);

!(function () {
    "use strict";
    var c = "path" === docma.app.routing.method;
    function o(a) {
        return (a.params[1] || "").replace(/\/$/, "");
    }
    function a(a, e) {
        (a = o(a) || docma._.defaultApiName),
            (a = docma.createRoute(a, DocmaWeb.Route.Type.API));
        if (!a || !a.exists()) return e();
        a.apply();
    }
    docma.app.base && page.base(docma.app.base),
        page.redirect("(/)?" + docma.template.main, ""),
        c &&
            (page("(/)?api/(.+)", a),
            page("(/)?api(/)?", a),
            page("(/)?(.*)", function (a, e) {
                (a = o(a)),
                    (a = docma.createRoute(a, DocmaWeb.Route.Type.CONTENT));
                if (!a || !a.exists()) return e();
                a.apply();
            })),
        page("(/)?", function (t, n) {
            !(function () {
                if (c) {
                    var a = sessionStorage.getItem("redirectPath") || null;
                    if (a)
                        return (
                            sessionStorage.removeItem("redirectPath"),
                            docma.info("Redirecting to:", a),
                            page.redirect(a),
                            1
                        );
                }
            })() &&
                setTimeout(function () {
                    e = (e = t.querystring) || window.location.search;
                    var a,
                        e = (e = /^[?&]/.test(e) ? e.slice(1) : e) || null;
                    if (c) {
                        if (e) return n();
                        a = docma._.appEntranceRI;
                    } else docma.log("Query-string:", e), (a = e ? docma.createRouteFromQuery(e) : docma._.appEntranceRI);
                    if (!a || !a.exists()) return n();
                    function o() {
                        docma._trigger(DocmaWeb.Event.Navigate, [a]);
                    }
                    a.isCurrent()
                        ? o()
                        : a.apply(function (a) {
                              200 === a && o();
                          });
                }, 100);
        }),
        page("*", function (a) {
            docma.warn("Unknown Route:", a.path),
                docma.log("context:", a),
                docma.createRoute(null).apply();
        }),
        docma.info("Docma SPA Configuration:"),
        docma.info("App Title:          ", docma.app.title),
        docma.info("Routing Method:     ", docma.app.routing.method),
        docma.info("App Server:         ", docma.app.server),
        docma.info("Base Path:          ", docma.app.base),
        docma.info("Entrance Route ID:  ", docma.app.entrance),
        (window.onload = function () {
            (docma._.initialLoad = !0),
                (docma._.appEntranceRI = docma.createRouteFromID(
                    docma.app.entrance,
                )),
                page.start({
                    click: !0,
                    popstate: !0,
                    dispatch: !0,
                    hashbang: !1,
                    decodeURLComponents: !0,
                }),
                docma.info("Docma SPA loaded!");
        });
})();
