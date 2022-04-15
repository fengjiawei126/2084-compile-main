/* eslint-disable */
!(function(t) {
  var n = {};
  function e(r) {
    if (n[r]) return n[r].exports;
    var o = (n[r] = { i: r, l: !1, exports: {} });
    return t[r].call(o.exports, o, o.exports, e), (o.l = !0), o.exports;
  }
  (e.m = t),
    (e.c = n),
    (e.d = function(t, n, r) {
      e.o(t, n) || Object.defineProperty(t, n, { enumerable: !0, get: r });
    }),
    (e.r = function(t) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    (e.t = function(t, n) {
      if ((1 & n && (t = e(t)), 8 & n)) return t;
      if (4 & n && "object" == typeof t && t && t.__esModule) return t;
      var r = Object.create(null);
      if (
        (e.r(r),
        Object.defineProperty(r, "default", { enumerable: !0, value: t }),
        2 & n && "string" != typeof t)
      )
        for (var o in t)
          e.d(
            r,
            o,
            function(n) {
              return t[n];
            }.bind(null, o)
          );
      return r;
    }),
    (e.n = function(t) {
      var n =
        t && t.__esModule
          ? function() {
              return t.default;
            }
          : function() {
              return t;
            };
      return e.d(n, "a", n), n;
    }),
    (e.o = function(t, n) {
      return Object.prototype.hasOwnProperty.call(t, n);
    }),
    (e.p = ""),
    e((e.s = 5));
})([
  function(t) {
    const e = { "*": 4, "?": 4, "+": 4, ".": 3, "|": 2, "(": 1 };
    t.exports = function(t) {
      const n = [],
        r = [];
      for (let e, i = 0, s = !1, a = t.length; i < a; i++)
        if ("*" !== (e = t[i]) && "?" !== e && "+" !== e)
          if ("|" !== e)
            if ("(" !== e)
              if (")" !== e) s && o("."), n.push(e), (s = !0);
              else {
                let e;
                for (; (e = r.pop()) && "(" !== e; ) n.push(e);
                if ("(" !== e)
                  throw new Error(`no "(" match ")" at [${i}] of "${t}"`);
                s = !0;
              }
            else s && o("."), r.push(e), (s = !1);
          else o(e), (s = !1);
        else o(e), (s = !0);
      function o(t) {
        let o;
        const i = e[t];
        for (; (o = r.pop()); ) {
          if (!(e[o] >= i)) {
            r.push(o);
            break;
          }
          n.push(o);
        }
        r.push(t);
      }
      let i;
      for (; (i = r.pop()); ) {
        if ("(" === i) throw new Error(`not matched "(" of "${t}"`);
        n.push(i);
      }
      return n.join("");
    };
  },
  function(t, n, e) {
    const r = e(2),
      o = e(3),
      i = e(0),
      s = e(4);
    t.exports = { NFA: r, DFA: o, regex2post: i, simulator: s };
  },
  function(t, n, e) {
    const r = e(0);
    class o {
      constructor(t) {
        (this.id = t), (this.transitions = []);
      }
    }
    class i {
      constructor(t, n, e, r) {
        (this.id = t), (this.from = n), (this.to = e), (this.input = r);
      }
    }
    class s {
      constructor(t, n) {
        (this.start = t), (this.end = n);
      }
    }
    class a {
      constructor() {
        (this.start = -1),
          (this.end = -1),
          (this.state_map = new Map()),
          (this.transition_map = new Map());
      }
      toJSON() {
        const { start: t, end: n, state_map: e, transition_map: r } = this;
        function o(t) {
          const n = [];
          for (let e of t) n.push(e);
          return n;
        }
        return { start: t, end: n, state_map: o(e), transition_map: o(r) };
      }
      travel(t) {
        const n = new Map(),
          { state_map: e, transition_map: r } = this;
        !(function o(i) {
          if (n[i]) return;
          let s = e.get(i);
          if (!s) return;
          n[i] = !0;
          t(s);
          const a = s.transitions;
          if (!a) return;
          let u = r.get(a[0]);
          if (!u) return;
          o(u.to);
          u = r.get(a[1]);
          if (!u) return;
          o(u.to);
        })(this.start);
      }
      static createFromRegexp(t) {
        return t ? a.createFromPostfixExpression(r(t)) : null;
      }
      static createFromPostfixExpression(t) {
        if ("string" != typeof t) return null;
        let n = 0,
          e = 0;
        const r = new a(),
          { state_map: u, transition_map: f } = r;
        function c() {
          const t = new o(n++);
          return u.set(t.id, t), t;
        }
        function l(t, n, r = "") {
          const o = new i(e++, t.id, n.id, r);
          return t.transitions.push(o.id), f.set(o.id, o), o;
        }
        const p = [];
        for (let n, e = 0, r = t.length; e < r; e++)
          switch ((n = t[e])) {
            case "|":
              {
                const t = p.pop(),
                  n = p.pop(),
                  e = c(),
                  r = c();
                l(e, n.start),
                  l(e, t.start),
                  l(n.end, r),
                  l(t.end, r),
                  p.push(new s(e, r));
              }
              break;
            case ".":
              {
                const t = p.pop(),
                  n = p.pop();
                t.start.transitions.forEach((t) => {
                  (f.get(t).from = n.end.id), n.end.transitions.push(t);
                }),
                  u.delete(t.start.id),
                  p.push(new s(n.start, t.end));
              }
              break;
            case "*":
              {
                const t = p.pop(),
                  n = c(),
                  e = c();
                l(n, t.start),
                  l(n, e),
                  l(t.end, t.start),
                  l(t.end, e),
                  p.push(new s(n, e));
              }
              break;
            case "?":
              {
                const t = p.pop(),
                  n = c(),
                  e = c();
                l(n, t.start), l(n, e), l(t.end, e), p.push(new s(n, e));
              }
              break;
            case "+":
              {
                const t = p.pop(),
                  n = c(),
                  e = c();
                l(n, t.start),
                  l(t.end, t.start),
                  l(t.end, e),
                  p.push(new s(n, e));
              }
              break;
            default: {
              const t = c(),
                e = c();
              l(t, e, n), p.push(new s(t, e));
            }
          }
        const d = p.pop();
        return (r.start = d.start.id), (r.end = d.end.id), r;
      }
    }
    t.exports = a;
  },
  function(t) {
    t.exports = class {
      static createFromNFA(t) {
        const { start: n, end: e, state_map: r, transition_map: o } = t,
          i = (function() {
            const t = new Set();
            for (let n of o.values()) n.input && t.add(n.input);
            return t;
          })(),
          s = new Set(),
          a = new Set(),
          u = [];
        let f,
          c = g([n]);
        for (a.add(c); (f = h()); ) {
          s.add(f);
          for (let t of i) {
            let n = g(m(f, t));
            n && (s.has(n) || a.add(n), u.push({ from: f, to: n, input: t }));
          }
        }
        let { end: l, all: p } = (function(t, n) {
          let e = new Set();
          return (
            t.forEach((t) => {
              const { from: n, to: r } = t;
              e.add(n), e.add(r);
            }),
            {
              all: (e = Array.from(e)),
              end: e.filter((t) => t.split("-").indexOf("" + n) > -1),
            }
          );
        })(u, e);
        return {
          start: c,
          end: Array.from(l),
          inputs: Array.from(i),
          states: p,
          transitions: u,
        };
        function d(t, n) {
          ("string" == typeof t ? t.split("-") : t).forEach((t) => {
            const e = r.get(+t);
            e.transitions.length
              ? e.transitions.forEach((t) => {
                  n(e, o.get(t));
                })
              : n(e, null);
          });
        }
        function h() {
          for (let t of a) if (!s.has(t)) return t;
          return null;
        }
        function g(t, n) {
          return t
            ? ((n = n || new Set()),
              d(t, (t, e) => {
                n.add(t.id),
                  !e || e.input || n.has(e.to) || (n.add(e.to), g([e.to], n));
              }),
              Array.from(n)
                .sort()
                .join("-"))
            : "";
        }
        function m(t, n) {
          const e = new Set();
          return (
            d(t, (t, r) => {
              r && r.input === n && e.add(r.to);
            }),
            Array.from(e)
              .sort()
              .join("-")
          );
        }
      }
      static createFromNFA_step(t, n) {
        const { start: e, end: r, state_map: o, transition_map: i } = t,
          s = (function() {
            const t = new Set();
            for (let n of i.values()) n.input && t.add(n.input);
            return t;
          })(),
          a = new Set(),
          u = new Set(),
          f = [];
        let c = d([e]);
        if ((u.add(c), "function" != typeof n)) {
          let t;
          return (
            (n = function({ finished: n, data: e, next: r }) {
              n ? (t = e) : r();
            }),
            t
          );
        }
        function l() {
          return { inputs: s, visited: a, set: u, transitions: f };
        }
        function p(t, n) {
          ("string" == typeof t ? t.split("-") : t).forEach((t) => {
            const e = o.get(+t);
            e.transitions.length
              ? e.transitions.forEach((t) => {
                  n(e, i.get(t));
                })
              : n(e, null);
          });
        }
        function d(t, n) {
          return t
            ? ((n = n || new Set()),
              p(t, (t, e) => {
                n.add(t.id),
                  !e || e.input || n.has(e.to) || (n.add(e.to), d([e.to], n));
              }),
              Array.from(n)
                .sort()
                .join("-"))
            : "";
        }
        function h(t, n) {
          const e = new Set();
          return (
            p(t, (t, r) => {
              r && r.input === n && e.add(r.to);
            }),
            Array.from(e)
              .sort()
              .join("-")
          );
        }
        n({
          finished: !1,
          data: l(),
          next: function t() {
            let e = (function() {
              for (let t of u) if (!a.has(t)) return t;
              return null;
            })();
            if (e) {
              a.add(e);
              for (let t of s) {
                let n = d(h(e, t));
                n &&
                  (a.has(n) || u.add(n), f.push({ from: e, to: n, input: t }));
              }
              n({ finished: !1, data: l(), next: t });
            } else
              !(function() {
                let { end: t, all: e } = (function(t, n) {
                  let e = new Set();
                  return (
                    t.forEach((t) => {
                      const { from: n, to: r } = t;
                      e.add(n), e.add(r);
                    }),
                    {
                      all: (e = Array.from(e)),
                      end: e.filter((t) => t.split("-").indexOf("" + n) > -1),
                    }
                  );
                })(f, r);
                n({
                  finished: !0,
                  data: {
                    start: c,
                    end: Array.from(t),
                    inputs: Array.from(s),
                    states: e,
                    transitions: f,
                  },
                  next: null,
                });
              })();
          },
        });
      }
    };
  },
  function(t, n) {
    (n.run = function(t, n) {
      const { state_map: e, transition_map: r } = t;
      let o = new Set(),
        i = new Set();
      a(o, e.get(t.start));
      for (let t, e = 0, r = n.length; e < r; e++) {
        s((t = n[e]));
        let r = o;
        (o = i), (i = r);
      }
      function s(t) {
        i.clear(),
          o.forEach((n) => {
            if (1 !== n.transitions.length) return;
            let o = r.get(n.transitions[0]);
            o.input === t && a(i, e.get(o.to));
          });
      }
      function a(t, n) {
        n &&
          !t.has(n) &&
          (!(function(t) {
            return !!t && !t.input;
          })(r.get(n.transitions[0]))
            ? t.add(n)
            : (a(t, u(n.transitions[0])), a(t, u(n.transitions[1]))));
      }
      function u(t) {
        return void 0 === t ? null : e.get(r.get(t).to);
      }
      for (let t of o) if (0 === t.transitions.length) return !0;
      return !1;
    }),
      (n.runWithBacktrack = function(t, n) {
        const { state_map: e, transition_map: r } = t,
          o = [];
        let i = 0,
          s = e.get(t.start),
          a = r.get(s.transitions[0]);
        const u = 1,
          f = -1,
          c = 0;
        for (;;) {
          let t = l();
          if (t === f) {
            if (p() === c) break;
          } else if (t === c) break;
        }
        function l() {
          return a
            ? a.input
              ? a.input === n[i]
                ? (i++,
                  o.push(a),
                  (s = e.get(a.to)),
                  i === n.length ? c : ((a = r.get(s.transitions[0])), u))
                : f
              : (o.push(a), (s = e.get(a.to)), (a = r.get(s.transitions[0])), u)
            : f;
        }
        function p() {
          if (!s) return c;
          const t = s.transitions[1];
          return void 0 === t || t === a.id
            ? (a = o.pop())
              ? (a.input && i--, (s = e.get(a.from)), p())
              : ((s = null), c)
            : ((a = r.get(t)), u);
        }
        const d = new Set();
        !(function t(n) {
          if (!n) return;
          if (d.has(n)) return;
          d.add(n);
          n.transitions.forEach((n) => {
            let o = r.get(n);
            "" === o.input && t(e.get(o.to));
          });
        })(s);
        let h = !1;
        return (
          d.forEach((t) => {
            0 === t.transitions.length && (h = !0);
          }),
          h
        );
      });
  },
  function(t, n, e) {
    (window.lib = e(1)), (window.simulator_step = e(6));
  },
  function(t, n) {
    (n.run = function(t, n, e) {
      const { state_map: r, transition_map: o } = t;
      let i = new Set(),
        s = new Set();
      p(i, r.get(t.start));
      let a,
        u = 0,
        f = n.length;
      function c() {
        const t = u >= f || 0 === i.size;
        e(
          {
            step: u,
            char: n[u],
            states: i,
            result: t
              ? (function() {
                  for (let t of i) if (0 === t.transitions.length) return !0;
                  return !1;
                })()
              : void 0,
          },
          t ? null : l
        );
      }
      function l() {
        !(function(t) {
          s.clear(),
            i.forEach((n) => {
              if (1 !== n.transitions.length) return;
              let e = o.get(n.transitions[0]);
              e.input === t && p(s, r.get(e.to));
            });
        })((a = n[u]));
        let t = i;
        (i = s), (s = t), u++, c();
      }
      function p(t, n) {
        n &&
          !t.has(n) &&
          (!(function(t) {
            return !!t && !t.input;
          })(o.get(n.transitions[0]))
            ? t.add(n)
            : (p(t, d(n.transitions[0])), p(t, d(n.transitions[1]))));
      }
      function d(t) {
        return void 0 === t ? null : r.get(o.get(t).to);
      }
      c();
    }),
      (n.runWithBacktrack = function(t, n, e) {
        const { state_map: r, transition_map: o } = t,
          i = [];
        let s = 0,
          a = r.get(t.start),
          u = o.get(a.transitions[0]);
        const f = 1,
          c = -1,
          l = 0;
        let p = 0;
        function d(t) {
          e(
            {
              step: p++,
              char: n[s],
              states: [a],
              result: t
                ? (function() {
                    const t = new Set();
                    !(function n(e) {
                      if (!e) return;
                      if (t.has(e)) return;
                      t.add(e);
                      e.transitions.forEach((t) => {
                        let e = o.get(t);
                        "" === e.input && n(r.get(e.to));
                      });
                    })(a);
                    let n = !1;
                    return (
                      t.forEach((t) => {
                        0 === t.transitions.length && (n = !0);
                      }),
                      n
                    );
                  })()
                : void 0,
            },
            t ? null : h
          );
        }
        function h() {
          let t = (function() {
            if (!u) return c;
            if (!u.input)
              return (
                i.push(u), (a = r.get(u.to)), (u = o.get(a.transitions[0])), f
              );
            return u.input === n[s]
              ? (s++,
                i.push(u),
                (a = r.get(u.to)),
                s === n.length ? l : ((u = o.get(a.transitions[0])), f))
              : c;
          })();
          if (t === c) {
            if (
              (function t() {
                if (!a) return l;
                const n = a.transitions[1];
                if (void 0 === n || n === u.id)
                  return (u = i.pop())
                    ? (u.input && s--, (a = r.get(u.from)), t())
                    : ((a = null), l);
                u = o.get(n);
                return f;
              })() === l
            )
              return void d(!0);
          } else if (t === l) return void d(!0);
          d();
        }
        d();
      });
  },
]);
