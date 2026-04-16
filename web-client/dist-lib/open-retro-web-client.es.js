import { ref as h, defineComponent as R, openBlock as p, createBlock as G, Teleport as _e, createElementVNode as e, createVNode as H, TransitionGroup as Xe, withCtx as je, createElementBlock as f, Fragment as z, renderList as de, unref as u, createTextVNode as Y, toDisplayString as _, onMounted as ce, withModifiers as A, normalizeClass as D, createCommentVNode as V, withDirectives as te, vModelText as oe, onUnmounted as we, Transition as Fe, withKeys as ye, resolveComponent as qe, normalizeStyle as W, watch as X, computed as ee, nextTick as ke, createStaticVNode as Ze } from "vue";
import { useRouter as be, useRoute as Ke, createRouter as Qe, createWebHistory as We } from "vue-router";
import { useI18n as F, createI18n as et } from "vue-i18n";
function ve() {
  return crypto.randomUUID();
}
function $e(i) {
  return i.join("/").replace(/([^:])\/+/g, "$1/");
}
const O = {
  serverUrl: "serverUrl",
  boardPassword: "boardPassword",
  username: "username",
  clientId: "clientId",
  lang: "lang"
}, j = {
  getServerUrl() {
    return localStorage.getItem(O.serverUrl);
  },
  setServerUrl(i) {
    localStorage.setItem(O.serverUrl, i);
  },
  getBoardPassword() {
    return localStorage.getItem(O.boardPassword);
  },
  setBoardPassword(i) {
    localStorage.setItem(O.boardPassword, i);
  },
  getUsername() {
    return localStorage.getItem(O.username);
  },
  setUsername(i) {
    localStorage.setItem(O.username, i);
  },
  getClientId() {
    let i = localStorage.getItem(O.clientId);
    return i || (i = ve(), localStorage.setItem(O.clientId, i)), i;
  },
  getLanguage() {
    return localStorage.getItem(O.lang);
  },
  setLanguage(i) {
    localStorage.setItem(O.lang, i);
  }
}, ge = h([]);
let tt = 0;
function Se() {
  function i(r, t = 4e3) {
    const n = tt++;
    ge.value.push({ id: n, message: r }), setTimeout(() => {
      ge.value = ge.value.filter((a) => a.id !== n);
    }, t);
  }
  return { toasts: ge, show: i };
}
const { show: Ee } = Se();
class Ce {
  httpUrl;
  TIMEOUT_MS = 5e3;
  constructor(r) {
    this.httpUrl = r.replace(/^ws(s?):\/\//, "http$1://");
  }
  async get(r) {
    try {
      const t = localStorage.getItem("lang") || "en", n = await fetch($e([this.httpUrl, r.path]), {
        headers: { "Accept-Language": t },
        signal: AbortSignal.timeout(this.TIMEOUT_MS)
      });
      return this.handleResponse(n, r);
    } catch {
      return this.handleNetworkError(r);
    }
  }
  async post(r) {
    try {
      const t = localStorage.getItem("lang") || "en", n = await fetch($e([this.httpUrl, r.path]), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": t
        },
        body: JSON.stringify(r.body),
        signal: AbortSignal.timeout(this.TIMEOUT_MS)
      });
      return this.handleResponse(n, r);
    } catch {
      return this.handleNetworkError(r);
    }
  }
  handleNetworkError(r) {
    const t = "Could not connect to the server";
    return r.hideToast || Ee(t), r.onError?.(t), { success: !1, error: t };
  }
  async handleResponse(r, t) {
    const n = await r.json().catch(() => ({}));
    if (!r.ok || n.success === !1) {
      const a = n.error ?? "Unknown error";
      t.hideToast || Ee(a), t.onError?.(a);
    } else
      t.onSuccess?.(n);
    return n;
  }
}
class ot extends Ce {
  async generateName(r, t) {
    await this.get({
      path: "/users/generate-name",
      onSuccess: (n) => {
        n.data && r?.(n.data);
      },
      onError: t,
      hideToast: !0
    });
  }
}
class nt {
  defaultServerUrl;
  constructor() {
    this.defaultServerUrl = null;
  }
}
let fe = null;
function st() {
  fe === null && (fe = new nt());
}
function he() {
  return fe === null && st(), fe;
}
const xe = h(j.getUsername() ?? "");
function me() {
  const i = j.getServerUrl() ?? he().defaultServerUrl ?? "", r = new ot(i), t = (a) => {
    const c = a.trim();
    c.length >= 3 && c.length <= 20 && (xe.value = c, j.setUsername(c));
  };
  return {
    username: xe,
    setUsername: t,
    initializeUser: async () => {
      xe.value || await r.generateName((a) => {
        t(a.username);
      });
    }
  };
}
const rt = { class: "toast-container" }, at = /* @__PURE__ */ R({
  __name: "ToastContainer",
  setup(i) {
    const { toasts: r } = Se();
    return (t, n) => (p(), G(_e, { to: "body" }, [
      e("div", rt, [
        H(Xe, { name: "toast" }, {
          default: je(() => [
            (p(!0), f(z, null, de(u(r), (a) => (p(), f("div", {
              key: a.id,
              class: "toast"
            }, [
              n[0] || (n[0] = e("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 20 20",
                fill: "currentColor",
                class: "toast-icon"
              }, [
                e("path", {
                  "fill-rule": "evenodd",
                  d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z",
                  "clip-rule": "evenodd"
                })
              ], -1)),
              Y(" " + _(a.message), 1)
            ]))), 128))
          ]),
          _: 1
        })
      ])
    ]));
  }
}), P = (i, r) => {
  const t = i.__vccOpts || i;
  for (const [n, a] of r)
    t[n] = a;
  return t;
}, it = /* @__PURE__ */ P(at, [["__scopeId", "data-v-261812ab"]]), lt = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <rect width="40" height="40" rx="10" fill="#3eaf7c" />
  <rect x="8" y="12" width="10" height="10" rx="2" fill="white" opacity="0.9" />
  <rect x="22" y="12" width="10" height="10" rx="2" fill="white" opacity="0.6" />
  <rect x="8" y="25" width="10" height="6" rx="2" fill="white" opacity="0.6" />
  <rect x="22" y="25" width="10" height="6" rx="2" fill="white" opacity="0.9" />
</svg>
`, dt = ["innerHTML"], ct = /* @__PURE__ */ R({
  __name: "AppLogo",
  setup(i) {
    const r = be();
    return (t, n) => (p(), f("div", {
      class: "logo",
      onClick: n[0] || (n[0] = (a) => u(r).push("/"))
    }, [
      e("div", {
        innerHTML: u(lt),
        class: "logo-icon"
      }, null, 8, dt),
      n[1] || (n[1] = e("span", { class: "logo-text" }, "Open Retro", -1))
    ]));
  }
}), ut = /* @__PURE__ */ P(ct, [["__scopeId", "data-v-da50886e"]]);
class Ve extends Ce {
  async ping({ onSuccess: r, onError: t }) {
    await this.get({ path: "/ping", hideToast: !0, onSuccess: r, onError: t });
  }
  async getLanguages() {
    return await this.get({ path: "/languages", hideToast: !0 });
  }
}
const vt = { class: "settings-card" }, pt = { class: "sidebar" }, gt = { class: "sidebar-header" }, ft = { class: "nav" }, ht = { class: "content" }, _t = { class: "content-header" }, wt = { class: "scroll-area" }, bt = {
  key: 0,
  class: "section fade-in"
}, mt = { class: "field" }, xt = { class: "lang-grid" }, yt = ["onClick"], kt = { class: "lang-name" }, $t = {
  key: 0,
  class: "check"
}, St = {
  key: 1,
  class: "section fade-in"
}, Ct = { class: "desc" }, Bt = { class: "field" }, It = { for: "server-url" }, Ut = { class: "input-group" }, Et = ["disabled"], Vt = {
  key: 0,
  class: "spinner-small"
}, Nt = {
  key: 0,
  class: "error-text"
}, Lt = {
  key: 1,
  class: "success-text"
}, Mt = /* @__PURE__ */ R({
  __name: "SettingsModal",
  emits: ["close"],
  setup(i, { emit: r }) {
    const { t, locale: n } = F(), a = r, c = h("preferences"), v = h([]), g = h(j.getServerUrl() ?? he().defaultServerUrl ?? ""), d = h(""), x = h(!1), B = h(!1);
    ce(async () => {
      await k();
    });
    async function k() {
      try {
        const S = j.getServerUrl() ?? he().defaultServerUrl;
        if (!S) return;
        const w = await new Ve(S).getLanguages();
        w.success && w.data && (v.value = w.data);
      } catch (S) {
        console.error("Failed to fetch languages", S);
      }
    }
    function $(S) {
      n.value = S, j.setLanguage(S);
    }
    async function y() {
      d.value = "", B.value = !1, x.value = !0, await new Ve(g.value).ping({
        onSuccess: () => {
          j.setServerUrl(g.value), B.value = !0, k();
        },
        onError: (S) => {
          d.value = S;
        }
      }), x.value = !1;
    }
    return (S, w) => (p(), G(_e, { to: "body" }, [
      e("div", {
        class: "modal-backdrop",
        onClick: w[5] || (w[5] = A((U) => a("close"), ["self"]))
      }, [
        e("div", vt, [
          e("aside", pt, [
            e("div", gt, [
              e("h3", null, _(u(t)("common.settings")), 1)
            ]),
            e("nav", ft, [
              e("button", {
                class: D(["nav-item", { active: c.value === "preferences" }]),
                onClick: w[0] || (w[0] = (U) => c.value = "preferences")
              }, [
                w[6] || (w[6] = e("svg", {
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  e("circle", {
                    cx: "12",
                    cy: "12",
                    r: "10"
                  }),
                  e("line", {
                    x1: "2",
                    y1: "12",
                    x2: "22",
                    y2: "12"
                  }),
                  e("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })
                ], -1)),
                Y(" " + _(u(t)("setup.preferences_tab") || "Preferences"), 1)
              ], 2),
              e("button", {
                class: D(["nav-item", { active: c.value === "server" }]),
                onClick: w[1] || (w[1] = (U) => c.value = "server")
              }, [
                w[7] || (w[7] = e("svg", {
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  e("rect", {
                    x: "2",
                    y: "2",
                    width: "20",
                    height: "8",
                    rx: "2",
                    ry: "2"
                  }),
                  e("rect", {
                    x: "2",
                    y: "14",
                    width: "20",
                    height: "8",
                    rx: "2",
                    ry: "2"
                  }),
                  e("line", {
                    x1: "6",
                    y1: "6",
                    x2: "6.01",
                    y2: "6"
                  }),
                  e("line", {
                    x1: "6",
                    y1: "18",
                    x2: "6.01",
                    y2: "18"
                  })
                ], -1)),
                Y(" " + _(u(t)("setup.server_tab") || "Server"), 1)
              ], 2)
            ]),
            e("button", {
              class: "close-mobile",
              onClick: w[2] || (w[2] = (U) => a("close"))
            }, _(u(t)("common.close")), 1)
          ]),
          e("main", ht, [
            e("header", _t, [
              e("h2", null, _(c.value === "preferences" ? u(t)("setup.preferences_title") || "Preferences" : u(t)("setup.server_config_title")), 1),
              e("button", {
                class: "close-btn",
                onClick: w[3] || (w[3] = (U) => a("close"))
              }, "✕")
            ]),
            e("div", wt, [
              c.value === "preferences" ? (p(), f("div", bt, [
                e("div", mt, [
                  e("label", null, _(u(t)("setup.language_label") || "Language"), 1),
                  e("div", xt, [
                    (p(!0), f(z, null, de(v.value, (U) => (p(), f("button", {
                      key: U.code,
                      class: D(["lang-card", { active: u(n) === U.code }]),
                      onClick: (E) => $(U.code)
                    }, [
                      e("span", kt, _(U.name), 1),
                      u(n) === U.code ? (p(), f("span", $t, "✓")) : V("", !0)
                    ], 10, yt))), 128))
                  ])
                ])
              ])) : V("", !0),
              c.value === "server" ? (p(), f("div", St, [
                e("p", Ct, _(u(t)("setup.server_config_desc")), 1),
                e("div", Bt, [
                  e("label", It, _(u(t)("setup.server_url_label")), 1),
                  e("div", Ut, [
                    te(e("input", {
                      id: "server-url",
                      "onUpdate:modelValue": w[4] || (w[4] = (U) => g.value = U),
                      type: "text",
                      placeholder: "https://api.example.com",
                      spellcheck: "false"
                    }, null, 512), [
                      [oe, g.value]
                    ]),
                    e("button", {
                      class: "btn-test",
                      disabled: x.value || !g.value,
                      onClick: y
                    }, [
                      x.value ? (p(), f("span", Vt)) : V("", !0),
                      Y(" " + _(x.value ? u(t)("setup.connecting") : u(t)("setup.test_connection") || "Test"), 1)
                    ], 8, Et)
                  ]),
                  d.value ? (p(), f("p", Nt, _(d.value), 1)) : V("", !0),
                  B.value ? (p(), f("p", Lt, " ✓ " + _(u(t)("setup.connection_success") || "Connection successful"), 1)) : V("", !0)
                ])
              ])) : V("", !0)
            ])
          ])
        ])
      ])
    ]));
  }
}), jt = /* @__PURE__ */ P(Mt, [["__scopeId", "data-v-a2ef8c1c"]]), Rt = ["title"], zt = { class: "avatar" }, Dt = { class: "user-info" }, Pt = {
  key: 0,
  class: "username-row"
}, At = { class: "username" }, Gt = {
  key: 1,
  class: "edit-row"
}, Ot = { class: "actions" }, Tt = /* @__PURE__ */ R({
  __name: "UserMenu",
  setup(i) {
    const { username: r, setUsername: t } = me(), n = h(!1), a = h(!1), c = h(!1), v = h(r.value), g = h(null);
    function d() {
      n.value = !n.value, n.value || (a.value = !1);
    }
    function x() {
      c.value = !0, n.value = !1;
    }
    function B() {
      a.value = !0, v.value = r.value;
    }
    function k() {
      t(v.value), a.value = !1;
    }
    function $() {
      a.value = !1;
    }
    function y(S) {
      g.value && !g.value.contains(S.target) && (n.value = !1, a.value = !1);
    }
    return ce(() => {
      window.addEventListener("click", y);
    }), we(() => {
      window.removeEventListener("click", y);
    }), (S, w) => (p(), f("div", {
      class: "user-menu",
      ref_key: "menuRef",
      ref: g
    }, [
      e("button", {
        class: "avatar-btn",
        onClick: A(d, ["stop"]),
        title: u(r)
      }, [
        e("div", zt, _(u(r).charAt(0).toUpperCase()), 1)
      ], 8, Rt),
      H(Fe, { name: "fade-slide" }, {
        default: je(() => [
          n.value ? (p(), f("div", {
            key: 0,
            class: "dropdown",
            onClick: w[1] || (w[1] = A(() => {
            }, ["stop"]))
          }, [
            e("div", Dt, [
              a.value ? (p(), f("div", Gt, [
                te(e("input", {
                  "onUpdate:modelValue": w[0] || (w[0] = (U) => v.value = U),
                  class: "edit-input",
                  onKeyup: [
                    ye(k, ["enter"]),
                    ye($, ["esc"])
                  ],
                  autoFocus: ""
                }, null, 544), [
                  [oe, v.value]
                ]),
                e("div", Ot, [
                  e("button", {
                    class: "icon-btn save",
                    onClick: A(k, ["stop"])
                  }, "✓"),
                  e("button", {
                    class: "icon-btn cancel",
                    onClick: A($, ["stop"])
                  }, "✕")
                ])
              ])) : (p(), f("div", Pt, [
                e("span", At, _(u(r)), 1),
                e("button", {
                  class: "edit-btn",
                  onClick: A(B, ["stop"])
                }, [...w[3] || (w[3] = [
                  e("svg", {
                    width: "14",
                    height: "14",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2"
                  }, [
                    e("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                    e("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z" })
                  ], -1)
                ])])
              ]))
            ]),
            e("div", { class: "menu-items" }, [
              e("button", {
                class: "menu-item",
                onClick: x
              }, [...w[4] || (w[4] = [
                e("svg", {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  e("circle", {
                    cx: "12",
                    cy: "12",
                    r: "3"
                  }),
                  e("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })
                ], -1),
                Y(" Settings ", -1)
              ])])
            ])
          ])) : V("", !0)
        ]),
        _: 1
      }),
      c.value ? (p(), G(jt, {
        key: 0,
        onClose: w[2] || (w[2] = (U) => c.value = !1)
      })) : V("", !0)
    ], 512));
  }
}), Ht = /* @__PURE__ */ P(Tt, [["__scopeId", "data-v-18914525"]]), Yt = { class: "main-header" }, Jt = { class: "header-content" }, Xt = /* @__PURE__ */ R({
  __name: "AppHeader",
  setup(i) {
    return (r, t) => (p(), f("header", Yt, [
      e("div", Jt, [
        H(ut),
        t[0] || (t[0] = e("div", { class: "spacer" }, null, -1)),
        H(Ht)
      ])
    ]));
  }
}), Ft = /* @__PURE__ */ P(Xt, [["__scopeId", "data-v-e20c5770"]]), qt = { class: "main-content" }, Fn = /* @__PURE__ */ R({
  __name: "App",
  setup(i) {
    const { initializeUser: r } = me();
    return ce(() => {
      r();
    }), (t, n) => {
      const a = qe("RouterView");
      return p(), f(z, null, [
        H(Ft),
        e("main", qt, [
          H(a)
        ]),
        H(it)
      ], 64);
    };
  }
});
class Be {
  constructor(r) {
    this.router = r;
  }
  router;
  toHome() {
    return this.router.replace("/");
  }
  toBoardSetup() {
    return this.router.push("/connect");
  }
  toBoard(r) {
    return this.router.push(`/board/${r}`);
  }
  backToBoardSetup() {
    return this.router.replace("/connect");
  }
}
class Ie extends Ce {
  async create({
    boardId: r,
    password: t,
    clientId: n,
    onSuccess: a,
    onError: c
  }) {
    await this.post({ path: "/board", body: { boardId: r, password: t, clientId: n }, onSuccess: a, onError: c });
  }
  async join({
    boardId: r,
    password: t,
    clientId: n,
    onSuccess: a,
    onError: c
  }) {
    await this.post({
      path: "/board/join",
      body: { boardId: r, password: t, clientId: n },
      hideToast: !0,
      onSuccess: a,
      onError: c
    });
  }
  async getBoard({ boardId: r, onSuccess: t, onError: n }) {
    await this.get({ path: `/board/exists/${r}`, onSuccess: t, onError: n });
  }
  async exportBoard({
    boardId: r,
    onSuccess: t,
    onError: n
  }) {
    await this.get({
      path: `/board/${r}/export?format=json`,
      onSuccess: (a) => t?.(a.data),
      onError: n
    });
  }
  async importBoard({
    boardId: r,
    password: t,
    clientId: n,
    data: a,
    onSuccess: c,
    onError: v
  }) {
    await this.post({
      path: "/board/import",
      body: { boardId: r, password: t, clientId: n, data: a },
      onSuccess: c,
      onError: v
    });
  }
}
const Zt = { class: "setup-layout" }, Kt = { class: "setup-card" }, Qt = { class: "subtitle" }, Wt = { class: "tab-group" }, eo = { class: "field" }, to = { class: "label-row" }, oo = { for: "board-id" }, no = ["title"], so = ["placeholder", "disabled"], ro = { class: "field" }, ao = { for: "password" }, io = ["placeholder", "disabled"], lo = {
  key: 0,
  class: "error-banner"
}, co = ["disabled"], uo = {
  key: 0,
  class: "spinner"
}, vo = /* @__PURE__ */ R({
  __name: "BoardSetup",
  setup(i) {
    const { t: r } = F();
    me();
    const t = new Be(be()), n = h(ve()), a = h(""), c = h(""), v = h(!1), g = h("create");
    function d() {
      j.setBoardPassword(a.value), t.toBoard(n.value);
    }
    function x($) {
      c.value = $;
    }
    async function B() {
      c.value = "";
      const $ = j.getServerUrl() ?? he().defaultServerUrl;
      if (!$) {
        c.value = "Server URL not configured. Use settings to set it.";
        return;
      }
      j.getServerUrl() || j.setServerUrl($), v.value = !0;
      const y = new Ie($), S = {
        boardId: n.value,
        password: a.value,
        clientId: j.getClientId(),
        onSuccess: d,
        onError: x
      };
      switch (g.value) {
        case "create":
          await y.create(S);
          break;
        case "join":
          await y.join(S);
          break;
      }
      v.value = !1;
    }
    function k($) {
      g.value = $, c.value = "";
    }
    return ($, y) => (p(), f("div", Zt, [
      e("div", Kt, [
        e("h1", null, _(g.value === "create" ? u(r)("setup.create_board") : u(r)("setup.join_board")), 1),
        e("p", Qt, _(g.value === "create" ? u(r)("setup.create_desc") : u(r)("setup.join_desc")), 1),
        e("div", Wt, [
          e("button", {
            class: D(["tab", { active: g.value === "create" }]),
            onClick: y[0] || (y[0] = (S) => k("create"))
          }, _(u(r)("setup.create_tab")), 3),
          e("button", {
            class: D(["tab", { active: g.value === "join" }]),
            onClick: y[1] || (y[1] = (S) => k("join"))
          }, _(u(r)("setup.join_tab")), 3)
        ]),
        e("form", {
          onSubmit: A(B, ["prevent"]),
          class: "form"
        }, [
          e("div", eo, [
            e("div", to, [
              e("label", oo, _(u(r)("setup.board_id_label")), 1),
              g.value === "create" ? (p(), f("button", {
                key: 0,
                type: "button",
                class: "regenerate-btn",
                onClick: y[2] || (y[2] = (S) => n.value = u(ve)()),
                title: u(r)("setup.generate_id_title")
              }, _(u(r)("setup.regenerate")), 9, no)) : V("", !0)
            ]),
            te(e("input", {
              id: "board-id",
              "onUpdate:modelValue": y[3] || (y[3] = (S) => n.value = S),
              type: "text",
              placeholder: u(r)("setup.board_id_placeholder"),
              autocomplete: "off",
              spellcheck: "false",
              disabled: v.value
            }, null, 8, so), [
              [oe, n.value]
            ])
          ]),
          e("div", ro, [
            e("label", ao, _(u(r)("setup.password_label")), 1),
            te(e("input", {
              id: "password",
              "onUpdate:modelValue": y[4] || (y[4] = (S) => a.value = S),
              type: "password",
              placeholder: u(r)("setup.password_placeholder"),
              disabled: v.value
            }, null, 8, io), [
              [oe, a.value]
            ])
          ]),
          c.value ? (p(), f("div", lo, [
            y[5] || (y[5] = e("svg", {
              width: "16",
              height: "16",
              viewBox: "0 0 20 20",
              fill: "currentColor"
            }, [
              e("path", {
                "fill-rule": "evenodd",
                d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z",
                "clip-rule": "evenodd"
              })
            ], -1)),
            Y(" " + _(c.value), 1)
          ])) : V("", !0),
          e("button", {
            type: "submit",
            class: "btn-primary",
            disabled: v.value || !n.value || !a.value
          }, [
            v.value ? (p(), f("span", uo)) : V("", !0),
            Y(" " + _(v.value ? u(r)("common.loading") : g.value === "create" ? u(r)("setup.submit_create") : u(r)("setup.submit_join")), 1)
          ], 8, co)
        ], 32)
      ])
    ]));
  }
}), po = /* @__PURE__ */ P(vo, [["__scopeId", "data-v-b617f2a6"]]), go = ["onMousedown"], fo = ["innerHTML"], ho = { class: "item-label" }, _o = /* @__PURE__ */ R({
  __name: "ContextMenu",
  props: {
    items: {},
    x: {},
    y: {}
  },
  emits: ["close"],
  setup(i, { emit: r }) {
    const t = r, n = h(null);
    function a(d) {
      n.value && !n.value.contains(d.target) && t("close");
    }
    function c() {
      t("close");
    }
    function v(d) {
      d.key === "Escape" && t("close");
    }
    function g(d) {
      d.action(), t("close");
    }
    return ce(() => {
      setTimeout(() => {
        window.addEventListener("pointerdown", a, { capture: !0 }), window.addEventListener("contextmenu", c), window.addEventListener("keydown", v);
      }, 0);
    }), we(() => {
      window.removeEventListener("pointerdown", a, { capture: !0 }), window.removeEventListener("contextmenu", c), window.removeEventListener("keydown", v);
    }), (d, x) => (p(), G(_e, { to: "body" }, [
      e("div", {
        ref_key: "menu",
        ref: n,
        class: "context-menu",
        style: W({ top: `${i.y}px`, left: `${i.x}px` }),
        onContextmenu: x[0] || (x[0] = A(() => {
        }, ["prevent"]))
      }, [
        (p(!0), f(z, null, de(i.items, (B) => (p(), f("button", {
          key: B.label,
          class: D(["context-menu-item", { danger: B.danger }]),
          onMousedown: A((k) => g(B), ["stop"])
        }, [
          B.icon ? (p(), f("span", {
            key: 0,
            class: "item-icon",
            innerHTML: B.icon
          }, null, 8, fo)) : V("", !0),
          e("span", ho, _(B.label), 1)
        ], 42, go))), 128))
      ], 36)
    ]));
  }
}), Re = /* @__PURE__ */ P(_o, [["__scopeId", "data-v-28b38b2a"]]), wo = {
  key: 0,
  class: "hidden-overlay"
}, bo = {
  key: 1,
  class: "note-text placeholder"
}, mo = {
  key: 2,
  class: "note-text"
}, xo = { class: "vote-count" }, Ne = 120, yo = /* @__PURE__ */ R({
  __name: "StickyNote",
  props: {
    x: {},
    y: {},
    width: {},
    height: {},
    text: {},
    isOwner: { type: Boolean },
    isHidden: { type: Boolean },
    votedBy: {},
    voting: {},
    myId: {},
    canVoteMore: { type: Boolean }
  },
  emits: ["dragStart", "bringToFront", "delete", "resize", "edit", "vote", "unvote"],
  setup(i, { emit: r }) {
    const t = i, n = r, { t: a } = F(), c = h(t.width), v = h(t.height), g = h(t.text), d = h(!1), x = h(null);
    let B = !1;
    X(
      () => t.width,
      (I) => {
        B || (c.value = I);
      }
    ), X(
      () => t.height,
      (I) => {
        B || (v.value = I);
      }
    ), X(
      () => t.text,
      (I) => {
        d.value || (g.value = I);
      }
    );
    const k = h(!1), $ = h(0), y = h(0), S = [
      {
        label: a("board.delete_note"),
        danger: !0,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
        action: () => n("delete")
      }
    ];
    function w(I) {
      t.isOwner && (I.preventDefault(), I.stopPropagation(), $.value = I.clientX, y.value = I.clientY, k.value = !0);
    }
    let U = 0, E = 0, ne = 0, se = 0;
    async function re() {
      t.isOwner && (d.value = !0, await ke(), x.value?.focus());
    }
    function ae() {
      d.value = !1, g.value !== t.text && n("edit", g.value);
    }
    function N(I) {
      d.value || (I.stopPropagation(), n("bringToFront"), n("dragStart", I));
    }
    function q(I) {
      t.isOwner && (I.preventDefault(), I.stopPropagation(), n("bringToFront"), B = !0, U = I.clientX, E = I.clientY, ne = c.value, se = v.value, window.addEventListener("mousemove", Z), window.addEventListener("mouseup", K));
    }
    function Z(I) {
      B && (c.value = Math.max(Ne, ne + (I.clientX - U)), v.value = Math.max(Ne, se + (I.clientY - E)));
    }
    function K() {
      B = !1, window.removeEventListener("mousemove", Z), window.removeEventListener("mouseup", K), n("resize", { width: c.value, height: v.value });
    }
    const T = ee(() => !t.votedBy || !t.myId ? 0 : t.votedBy.filter((I) => I === t.myId).length), Q = ee(() => !t.voting?.active || T.value > 0 ? !1 : t.canVoteMore);
    function ue(I) {
      I.stopPropagation(), t.voting?.active && (T.value > 0 ? n("unvote") : Q.value && n("vote"));
    }
    return (I, L) => (p(), f(z, null, [
      e("div", {
        class: D(["sticky-note", { "is-hidden": i.isHidden }]),
        style: W({
          width: `${c.value}px`,
          height: `${v.value}px`,
          left: `${i.x}px`,
          top: `${i.y}px`
        }),
        onDblclick: re,
        onMousedown: N,
        onContextmenu: w
      }, [
        i.isHidden ? (p(), f("div", wo, [
          L[4] || (L[4] = e("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            class: "hidden-icon"
          }, [
            e("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }),
            e("line", {
              x1: "1",
              y1: "1",
              x2: "23",
              y2: "23"
            })
          ], -1)),
          e("span", null, _(u(a)("board.hidden_note")), 1)
        ])) : (p(), f(z, { key: 1 }, [
          d.value ? te((p(), f("textarea", {
            key: 0,
            ref_key: "textarea",
            ref: x,
            "onUpdate:modelValue": L[0] || (L[0] = (C) => g.value = C),
            class: "note-textarea",
            onBlur: ae
          }, null, 544)), [
            [oe, g.value]
          ]) : !g.value && i.isOwner ? (p(), f("p", bo, _(u(a)("board.note_placeholder")), 1)) : (p(), f("p", mo, _(g.value), 1))
        ], 64)),
        i.isHidden ? V("", !0) : (p(), f("div", {
          key: 2,
          class: "resize-handle",
          onMousedown: L[1] || (L[1] = (C) => q(C))
        }, null, 32)),
        i.voting?.active || i.votedBy && i.votedBy.length > 0 ? (p(), f("div", {
          key: 3,
          class: D(["vote-badge", {
            "can-vote": Q.value,
            "has-voted": T.value > 0,
            "voting-active": i.voting?.active
          }]),
          onClick: ue,
          onMousedown: L[2] || (L[2] = A(() => {
          }, ["stop"]))
        }, [
          L[5] || (L[5] = e("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            class: "vote-icon"
          }, [
            e("path", { d: "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" })
          ], -1)),
          e("span", xo, _(i.votedBy?.length || 0), 1)
        ], 34)) : V("", !0)
      ], 38),
      k.value ? (p(), G(Re, {
        key: 0,
        items: S,
        x: $.value,
        y: y.value,
        onClose: L[3] || (L[3] = (C) => k.value = !1)
      }, null, 8, ["x", "y"])) : V("", !0)
    ], 64));
  }
}), ko = /* @__PURE__ */ P(yo, [["__scopeId", "data-v-7481c435"]]), $o = { class: "group-header" }, So = ["placeholder"], Le = 160, Co = /* @__PURE__ */ R({
  __name: "NoteGroup",
  props: {
    x: {},
    y: {},
    width: {},
    height: {},
    title: {},
    description: {},
    pinned: { type: Boolean }
  },
  emits: ["dragStart", "delete", "resize", "edit", "toggle-pin"],
  setup(i, { emit: r }) {
    const t = i, { t: n } = F(), a = r, c = h(t.width), v = h(t.height), g = h(t.title), d = h(t.description), x = h(!1), B = h(!1), k = h(null), $ = h(null);
    let y = !1;
    X(
      () => t.width,
      (C) => {
        y || (c.value = C);
      }
    ), X(
      () => t.height,
      (C) => {
        y || (v.value = C);
      }
    ), X(
      () => t.title,
      (C) => {
        x.value || (g.value = C);
      }
    ), X(
      () => t.description,
      (C) => {
        B.value || (d.value = C);
      }
    );
    const S = h(!1), w = h(0), U = h(0), E = ee(() => [
      {
        label: t.pinned ? n("board.unpin_group") : n("board.pin_group"),
        icon: t.pinned ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="2" x2="22" y2="22"/><path d="M13 13.5V19l-1 2-1-2v-5.5"/><path d="M8.5 8.5A5 5 0 0 0 12 19"/><path d="M17.5 8.5A5 5 0 0 0 12 5V3"/><path d="M12 3h.01"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l-1 2-1-2v-5.5A5 5 0 0 1 7 9V3h10v6a5 5 0 0 1-3 4.5V19"/><path d="M7 3h10"/></svg>',
        action: () => a("toggle-pin", !t.pinned)
      },
      {
        label: n("board.delete_group"),
        danger: !0,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
        action: () => a("delete")
      }
    ]);
    function ne(C) {
      C.preventDefault(), C.stopPropagation(), w.value = C.clientX, U.value = C.clientY, S.value = !0;
    }
    function se(C) {
      C.stopPropagation(), !t.pinned && a("dragStart", C);
    }
    async function re(C) {
      t.pinned || (C.stopPropagation(), x.value = !0, await ke(), k.value?.select());
    }
    function ae() {
      x.value = !1, g.value !== t.title && a("edit", { title: g.value, description: d.value });
    }
    async function N(C) {
      t.pinned || (C.stopPropagation(), B.value = !0, await ke(), $.value?.focus());
    }
    function q() {
      B.value = !1, d.value !== t.description && a("edit", { title: g.value, description: d.value });
    }
    let Z = 0, K = 0, T = 0, Q = 0;
    function ue(C) {
      C.preventDefault(), C.stopPropagation(), y = !0, Z = C.clientX, K = C.clientY, T = c.value, Q = v.value, window.addEventListener("mousemove", I), window.addEventListener("mouseup", L);
    }
    function I(C) {
      y && (c.value = Math.max(Le, T + (C.clientX - Z)), v.value = Math.max(Le, Q + (C.clientY - K)));
    }
    function L() {
      y = !1, window.removeEventListener("mousemove", I), window.removeEventListener("mouseup", L), a("resize", { width: c.value, height: v.value });
    }
    return (C, M) => (p(), f(z, null, [
      e("div", {
        class: D(["note-group", { pinned: i.pinned }]),
        style: W({
          width: `${c.value}px`,
          height: `${v.value}px`,
          left: `${i.x}px`,
          top: `${i.y}px`
        }),
        onMousedown: se,
        onContextmenu: ne
      }, [
        e("div", $o, [
          x.value ? te((p(), f("input", {
            key: 0,
            ref_key: "titleInput",
            ref: k,
            "onUpdate:modelValue": M[0] || (M[0] = (J) => g.value = J),
            class: "title-input",
            onBlur: ae,
            onKeydown: ye(ae, ["enter"]),
            onMousedown: M[1] || (M[1] = A(() => {
            }, ["stop"]))
          }, null, 544)), [
            [oe, g.value]
          ]) : (p(), f("h3", {
            key: 1,
            class: "group-title",
            onDblclick: re
          }, _(g.value), 33)),
          B.value ? te((p(), f("textarea", {
            key: 2,
            ref_key: "descInput",
            ref: $,
            "onUpdate:modelValue": M[2] || (M[2] = (J) => d.value = J),
            class: "desc-input",
            rows: "2",
            placeholder: u(n)("board.group_desc_placeholder"),
            onBlur: q,
            onMousedown: M[3] || (M[3] = A(() => {
            }, ["stop"]))
          }, null, 40, So)), [
            [oe, d.value]
          ]) : (p(), f("p", {
            key: 3,
            class: D(["group-description", { empty: !d.value }]),
            onDblclick: N
          }, _(d.value || u(n)("board.group_desc_empty")), 35))
        ]),
        e("div", {
          class: "resize-handle",
          onMousedown: M[4] || (M[4] = (J) => ue(J))
        }, null, 32)
      ], 38),
      S.value ? (p(), G(Re, {
        key: 0,
        items: E.value,
        x: w.value,
        y: U.value,
        onClose: M[5] || (M[5] = (J) => S.value = !1)
      }, null, 8, ["items", "x", "y"])) : V("", !0)
    ], 64));
  }
}), Bo = /* @__PURE__ */ P(Co, [["__scopeId", "data-v-4a07d2dd"]]), Io = { class: "toolbar" }, Uo = ["title"], Eo = { class: "tool-label" }, Vo = ["title"], No = { class: "tool-label" }, Lo = ["title"], Mo = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, jo = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Ro = { class: "tool-label" }, zo = ["title"], Do = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Po = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Ao = { class: "tool-label" }, Go = ["title"], Oo = { class: "tool-label" }, To = ["title"], Ho = { class: "tool-label" }, Yo = ["title"], Jo = { class: "tool-label" }, Xo = ["title"], Fo = { class: "tool-label" }, qo = /* @__PURE__ */ R({
  __name: "ToolBar",
  props: {
    isNotesHidden: { type: Boolean },
    isOwner: { type: Boolean },
    voting: {}
  },
  emits: ["addNote", "addGroup", "toggleVisibility", "exportBoard", "importBoard", "startVoting", "pauseVoting", "resetVoting", "leave"],
  setup(i, { emit: r }) {
    const t = i, n = r, { t: a } = F();
    function c() {
      if (t.voting?.active)
        n("pauseVoting");
      else {
        const g = window.prompt(
          a("board.votes_per_user_prompt"),
          t.voting?.maxVotesPerUser ? String(t.voting?.maxVotesPerUser) : "3"
        );
        if (g === null) return;
        const d = parseInt(g, 10);
        !isNaN(d) && d > 0 && n("startVoting", d);
      }
    }
    function v() {
      confirm(a("board.confirm_reset_voting")) && n("resetVoting");
    }
    return (g, d) => (p(), f("aside", Io, [
      e("button", {
        class: "tool-btn",
        title: u(a)("board.create_note"),
        onClick: d[0] || (d[0] = (x) => n("addNote"))
      }, [
        d[6] || (d[6] = e("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }, [
          e("rect", {
            x: "3",
            y: "3",
            width: "18",
            height: "18",
            rx: "2"
          }),
          e("line", {
            x1: "12",
            y1: "8",
            x2: "12",
            y2: "16"
          }),
          e("line", {
            x1: "8",
            y1: "12",
            x2: "16",
            y2: "12"
          })
        ], -1)),
        e("span", Eo, _(u(a)("board.note")), 1)
      ], 8, Uo),
      d[18] || (d[18] = e("div", { class: "divider" }, null, -1)),
      e("button", {
        class: "tool-btn",
        title: u(a)("board.create_group"),
        onClick: d[1] || (d[1] = (x) => n("addGroup"))
      }, [
        d[7] || (d[7] = Ze('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-5b4687cc><rect x="2" y="2" width="20" height="20" rx="4" data-v-5b4687cc></rect><rect x="6" y="6" width="5" height="5" rx="1" data-v-5b4687cc></rect><rect x="13" y="6" width="5" height="5" rx="1" data-v-5b4687cc></rect><rect x="6" y="13" width="5" height="5" rx="1" data-v-5b4687cc></rect></svg>', 1)),
        e("span", No, _(u(a)("board.group")), 1)
      ], 8, Vo),
      t.isOwner ? (p(), f(z, { key: 0 }, [
        d[13] || (d[13] = e("div", { class: "divider" }, null, -1)),
        e("button", {
          class: D(["tool-btn", { active: t.isNotesHidden }]),
          title: t.isNotesHidden ? u(a)("board.show_notes") : u(a)("board.hide_notes"),
          onClick: d[2] || (d[2] = (x) => n("toggleVisibility"))
        }, [
          t.isNotesHidden ? (p(), f("svg", Mo, [...d[8] || (d[8] = [
            e("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }, null, -1),
            e("line", {
              x1: "1",
              y1: "1",
              x2: "23",
              y2: "23"
            }, null, -1)
          ])])) : (p(), f("svg", jo, [...d[9] || (d[9] = [
            e("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }, null, -1),
            e("circle", {
              cx: "12",
              cy: "12",
              r: "3"
            }, null, -1)
          ])])),
          e("span", Ro, _(u(a)("board.note")), 1)
        ], 10, Lo),
        e("button", {
          class: D(["tool-btn", { active: t.voting?.active }]),
          title: t.voting?.active ? u(a)("board.pause_voting") : u(a)("board.start_voting"),
          onClick: c
        }, [
          t.voting?.active ? (p(), f("svg", Do, [...d[10] || (d[10] = [
            e("rect", {
              x: "6",
              y: "4",
              width: "4",
              height: "16"
            }, null, -1),
            e("rect", {
              x: "14",
              y: "4",
              width: "4",
              height: "16"
            }, null, -1)
          ])])) : (p(), f("svg", Po, [...d[11] || (d[11] = [
            e("polygon", { points: "5 3 19 12 5 21 5 3" }, null, -1)
          ])])),
          e("span", Ao, _(u(a)("board.vote")), 1)
        ], 10, zo),
        e("button", {
          class: "tool-btn danger",
          title: u(a)("board.reset_voting"),
          onClick: v
        }, [
          d[12] || (d[12] = e("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [
            e("circle", {
              cx: "12",
              cy: "12",
              r: "10"
            }),
            e("line", {
              x1: "15",
              y1: "9",
              x2: "9",
              y2: "15"
            }),
            e("line", {
              x1: "9",
              y1: "9",
              x2: "15",
              y2: "15"
            })
          ], -1)),
          e("span", Oo, _(u(a)("board.clear")), 1)
        ], 8, Go)
      ], 64)) : V("", !0),
      d[19] || (d[19] = e("div", { class: "spacer" }, null, -1)),
      t.isOwner ? (p(), f(z, { key: 1 }, [
        d[16] || (d[16] = e("div", { class: "divider" }, null, -1)),
        e("button", {
          class: "tool-btn",
          title: u(a)("board.export_json"),
          onClick: d[3] || (d[3] = (x) => n("exportBoard"))
        }, [
          d[14] || (d[14] = e("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [
            e("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
            e("polyline", { points: "7 10 12 15 17 10" }),
            e("line", {
              x1: "12",
              y1: "15",
              x2: "12",
              y2: "3"
            })
          ], -1)),
          e("span", Ho, _(u(a)("board.export")), 1)
        ], 8, To),
        e("button", {
          class: "tool-btn",
          title: u(a)("board.import_json"),
          onClick: d[4] || (d[4] = (x) => n("importBoard"))
        }, [
          d[15] || (d[15] = e("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [
            e("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
            e("polyline", { points: "17 8 12 3 7 8" }),
            e("line", {
              x1: "12",
              y1: "3",
              x2: "12",
              y2: "15"
            })
          ], -1)),
          e("span", Jo, _(u(a)("board.import")), 1)
        ], 8, Yo)
      ], 64)) : V("", !0),
      d[20] || (d[20] = e("div", { class: "divider" }, null, -1)),
      e("button", {
        class: "tool-btn leave-btn",
        title: u(a)("board.leave_board"),
        onClick: d[5] || (d[5] = (x) => n("leave"))
      }, [
        d[17] || (d[17] = e("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }, [
          e("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
          e("polyline", { points: "16 17 21 12 16 7" }),
          e("line", {
            x1: "21",
            y1: "12",
            x2: "9",
            y2: "12"
          })
        ], -1)),
        e("span", Fo, _(u(a)("board.leave")), 1)
      ], 8, Xo)
    ]));
  }
}), Zo = /* @__PURE__ */ P(qo, [["__scopeId", "data-v-5b4687cc"]]), Ko = { class: "users-sidebar" }, Qo = ["title"], Wo = /* @__PURE__ */ R({
  __name: "UsersSidebar",
  props: {
    users: {},
    myId: {}
  },
  setup(i) {
    const { t: r } = F();
    function t(a) {
      return a.split(" ").map((c) => c.charAt(0)).join("").toUpperCase().slice(0, 2);
    }
    function n(a) {
      const c = [
        "#3eaf7c",
        // Primary Green
        "#ef9f27",
        // Amber
        "#378add",
        // Blue
        "#e5484d",
        // Red
        "#8b5cf6",
        // Indigo
        "#ec4899",
        // Pink
        "#f97316",
        // Orange
        "#14b8a6",
        // Teal
        "#06b6d4",
        // Cyan
        "#3b82f6"
        // Bright Blue
      ];
      let v = 0;
      for (let g = 0; g < a.length; g++)
        v = v * 31 + a.charCodeAt(g) & 4294967295;
      return c[Math.abs(v) % c.length] ?? "#3b82f6";
    }
    return (a, c) => (p(), f("div", Ko, [
      (p(!0), f(z, null, de(i.users, (v) => (p(), f("div", {
        key: v.id,
        class: D(["user-avatar", { "is-me": v.id === i.myId }]),
        style: W({ backgroundColor: n(v.id) }),
        title: v.id === i.myId ? `${v.username} ${u(r)("user.me_suffix")}` : v.username
      }, _(t(v.username)), 15, Qo))), 128))
    ]));
  }
}), en = /* @__PURE__ */ P(Wo, [["__scopeId", "data-v-700afe09"]]), tn = { class: "expired-backdrop" }, on = { class: "expired-card" }, nn = { class: "title" }, sn = { class: "description" }, rn = {
  key: 0,
  class: "admin-section"
}, an = {
  key: 0,
  class: "admin-warning"
}, ln = { class: "countdown-badge" }, dn = { class: "warning-text" }, cn = {
  key: 1,
  class: "erased-text"
}, un = { class: "actions" }, vn = 60, pn = /* @__PURE__ */ R({
  __name: "SessionExpiredModal",
  props: {
    isAdmin: { type: Boolean },
    serverUrl: {},
    boardId: {}
  },
  emits: ["go-back"],
  setup(i, { emit: r }) {
    const t = i, n = r, { t: a } = F(), c = h(vn), v = h(!1);
    let g = null;
    const d = ee(
      () => a("session_expired.admin_warning", { seconds: c.value })
    );
    ce(() => {
      t.isAdmin && (g = setInterval(() => {
        c.value -= 1, c.value <= 0 && (v.value = !0, x());
      }, 1e3));
    }), we(x);
    function x() {
      g !== null && (clearInterval(g), g = null);
    }
    function B() {
      new Ie(t.serverUrl).exportBoard({
        boardId: t.boardId,
        onSuccess: ($) => {
          x();
          const y = new Blob([JSON.stringify($, null, 2)], { type: "application/json" }), S = URL.createObjectURL(y), w = document.createElement("a");
          w.href = S, w.download = `${t.boardId}.json`, w.click(), URL.revokeObjectURL(S);
        }
      });
    }
    return (k, $) => (p(), G(_e, { to: "body" }, [
      e("div", tn, [
        e("div", on, [
          $[3] || ($[3] = e("div", { class: "icon-wrap" }, [
            e("svg", {
              class: "clock-icon",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "1.5"
            }, [
              e("circle", {
                cx: "12",
                cy: "12",
                r: "10"
              }),
              e("polyline", { points: "12 6 12 12 16 14" })
            ])
          ], -1)),
          e("h2", nn, _(u(a)("session_expired.title")), 1),
          e("p", sn, _(u(a)("session_expired.description")), 1),
          i.isAdmin ? (p(), f("div", rn, [
            v.value ? (p(), f("p", cn, _(u(a)("session_expired.data_erased")), 1)) : (p(), f("div", an, [
              e("span", ln, _(c.value) + "s", 1),
              e("p", dn, _(d.value), 1)
            ]))
          ])) : V("", !0),
          e("div", un, [
            i.isAdmin && !v.value ? (p(), f("button", {
              key: 0,
              class: "btn btn-export",
              onClick: B
            }, [
              $[1] || ($[1] = e("svg", {
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                e("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                e("polyline", { points: "7 10 12 15 17 10" }),
                e("line", {
                  x1: "12",
                  y1: "15",
                  x2: "12",
                  y2: "3"
                })
              ], -1)),
              Y(" " + _(u(a)("session_expired.export_board")), 1)
            ])) : V("", !0),
            e("button", {
              class: "btn btn-back",
              onClick: $[0] || ($[0] = (y) => n("go-back"))
            }, [
              $[2] || ($[2] = e("svg", {
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                e("line", {
                  x1: "19",
                  y1: "12",
                  x2: "5",
                  y2: "12"
                }),
                e("polyline", { points: "12 19 5 12 12 5" })
              ], -1)),
              Y(" " + _(u(a)("session_expired.go_back")), 1)
            ])
          ])
        ])
      ])
    ]));
  }
}), gn = /* @__PURE__ */ P(pn, [["__scopeId", "data-v-8f6d7c10"]]);
function fn(i) {
  const r = h(!1), t = h(null);
  let n = null, a = null, c = null, v = !0;
  function g() {
    n = new WebSocket(i), n.onopen = () => {
      r.value = !0, t.value = null, console.log("[WS] Connected");
    }, n.onmessage = (k) => {
      const $ = JSON.parse(k.data);
      a?.($);
    }, n.onclose = (k) => {
      if (r.value = !1, k.code === 4001) {
        t.value = "auth", v = !1, console.log("[WS] Authentication failed");
        return;
      }
      v && (t.value = "connection", console.log("[WS] Disconnected, reconnecting in 2s..."), c = setTimeout(g, 2e3));
    }, n.onerror = () => {
      n?.close();
    };
  }
  function d(k) {
    n?.readyState === WebSocket.OPEN && n.send(JSON.stringify(k));
  }
  function x(k) {
    a = k;
  }
  function B() {
    v = !1, c && clearTimeout(c), c = null, n?.close(), n = null;
  }
  return g(), we(B), { isConnected: r, wsError: t, send: d, onMessage: x, disconnect: B };
}
var b = /* @__PURE__ */ ((i) => (i.BoardSync = "board:sync", i.BoardToggleNotes = "board:toggle_notes", i.BoardNotesVisibility = "board:notes_visibility", i.BoardVotingStart = "board:voting_start", i.BoardVotingPause = "board:voting_pause", i.BoardVotingReset = "board:voting_reset", i.NoteAdd = "note:add", i.NoteMove = "note:move", i.NoteResize = "note:resize", i.NoteEdit = "note:edit", i.NoteDelete = "note:delete", i.NoteZ = "note:z", i.NoteVote = "note:vote", i.NoteUnvote = "note:unvote", i.GroupAdd = "group:add", i.GroupMove = "group:move", i.GroupResize = "group:resize", i.GroupEdit = "group:edit", i.GroupDelete = "group:delete", i.GroupPin = "group:pin", i.UsersSync = "users:sync", i.UserJoin = "user:join", i.UserLeave = "user:leave", i.SessionExpired = "session:expired", i))(b || {});
const hn = { class: "footer-overlay" }, _n = {
  key: 0,
  class: "connection-status error"
}, wn = {
  key: 1,
  class: "connection-status"
}, bn = /* @__PURE__ */ R({
  __name: "BoardCanvas",
  props: {
    serverUrl: {},
    boardId: {},
    password: {},
    username: {}
  },
  setup(i) {
    const r = i, t = j.getClientId(), n = $e([
      r.serverUrl,
      `board/ws?board=${r.boardId}&password=${encodeURIComponent(r.password)}&username=${encodeURIComponent(r.username)}&clientId=${t}`
    ]), a = new Ie(r.serverUrl), c = h([]), v = h([]), g = h([]), d = h(!1), x = h(null), B = h(!1), k = h({ active: !1, maxVotesPerUser: 1 }), $ = h(null);
    let y = 1;
    const S = new Be(be()), { t: w } = F(), { show: U } = Se(), { send: E, onMessage: ne, isConnected: se, wsError: re, disconnect: ae } = fn(n);
    X(re, (s) => {
      s === "auth" && (U(w("connection.wrong_password")), S.backToBoardSetup());
    }), ne((s) => {
      switch (s.type) {
        case b.BoardSync:
          c.value = s.state.notes, v.value = s.state.groups, y = s.state.nextZIndex, d.value = s.state.isNotesHidden, x.value = s.state.createdBy, k.value = s.state.voting;
          break;
        case b.BoardNotesVisibility:
          d.value = s.isHidden;
          break;
        case b.NoteAdd:
          c.value.push(s.note), y = Math.max(y, s.note.zIndex + 1);
          break;
        case b.NoteMove: {
          const o = c.value.find((l) => l.id === s.id);
          o && (o.x = s.x, o.y = s.y);
          break;
        }
        case b.NoteResize: {
          const o = c.value.find((l) => l.id === s.id);
          o && (o.width = s.width, o.height = s.height);
          break;
        }
        case b.NoteEdit: {
          const o = c.value.find((l) => l.id === s.id);
          o && (o.text = s.text);
          break;
        }
        case b.NoteDelete:
          c.value = c.value.filter((o) => o.id !== s.id);
          break;
        case b.NoteZ: {
          const o = c.value.find((l) => l.id === s.id);
          o && (o.zIndex = s.zIndex), y = Math.max(y, s.zIndex + 1);
          break;
        }
        case b.BoardVotingStart:
          k.value = { active: !0, maxVotesPerUser: s.maxVotesPerUser };
          break;
        case b.BoardVotingPause:
          k.value.active = !1;
          break;
        case b.BoardVotingReset:
          k.value = { active: !1, maxVotesPerUser: 1 }, c.value.forEach((o) => {
            o.votedBy = [];
          });
          break;
        case b.NoteVote: {
          const o = c.value.find((l) => l.id === s.id);
          o && s.userId && (o.votedBy || (o.votedBy = []), o.votedBy.push(s.userId));
          break;
        }
        case b.NoteUnvote: {
          const o = c.value.find((l) => l.id === s.id);
          o && s.userId && o.votedBy && (o.votedBy = o.votedBy.filter((l) => l !== s.userId));
          break;
        }
        case b.GroupAdd:
          v.value.push(s.group);
          break;
        case b.GroupMove: {
          const o = v.value.find((l) => l.id === s.id);
          o && (o.x = s.x, o.y = s.y);
          break;
        }
        case b.GroupResize: {
          const o = v.value.find((l) => l.id === s.id);
          o && (o.width = s.width, o.height = s.height);
          break;
        }
        case b.GroupEdit: {
          const o = v.value.find((l) => l.id === s.id);
          o && (o.title = s.title, o.description = s.description);
          break;
        }
        case b.GroupDelete:
          v.value = v.value.filter((o) => o.id !== s.id);
          break;
        case b.GroupPin: {
          const o = v.value.find((l) => l.id === s.id);
          o && (o.pinned = s.pinned);
          break;
        }
        case b.UsersSync:
          g.value = s.users;
          break;
        case b.UserJoin:
          g.value.find((o) => o.id === s.user.id) || g.value.push(s.user);
          break;
        case b.UserLeave:
          g.value = g.value.filter((o) => o.id !== s.userId);
          break;
        case b.SessionExpired:
          B.value = !0, ae();
          break;
      }
    });
    const N = h({ x: 0, y: 0 }), q = h(!1), Z = ee(() => ({
      transform: `translate(${N.value.x}px, ${N.value.y}px)`
    })), K = ee(() => ({
      cursor: q.value ? "grabbing" : "grab",
      backgroundPosition: `${N.value.x}px ${N.value.y}px`
    })), T = ee(() => t ? c.value.reduce((s, o) => s + (o.votedBy?.includes(t) ? 1 : 0), 0) : 0);
    function Q() {
      const s = c.value.length % 6 * 24, o = {
        id: ve(),
        x: 100 + s - N.value.x,
        y: 100 + s - N.value.y,
        zIndex: y++,
        width: 200,
        height: 200,
        text: "",
        createdBy: t
      };
      c.value.push(o), E({ type: b.NoteAdd, note: o });
    }
    function ue() {
      const s = v.value.length % 6 * 32, o = {
        id: ve(),
        x: 80 + s - N.value.x,
        y: 80 + s - N.value.y,
        width: 320,
        height: 240,
        title: "Grupo",
        description: "",
        pinned: !1
      };
      v.value.push(o), E({ type: b.GroupAdd, group: o });
    }
    function I(s) {
      s.zIndex = y++, E({ type: b.NoteZ, id: s.id, zIndex: s.zIndex });
    }
    function L(s) {
      c.value = c.value.filter((o) => o.id !== s), E({ type: b.NoteDelete, id: s });
    }
    function C(s) {
      v.value = v.value.filter((o) => o.id !== s), E({ type: b.GroupDelete, id: s });
    }
    function M(s, o, l) {
      const m = o.clientX - N.value.x - s.x, ie = o.clientY - N.value.y - s.y;
      function le(pe) {
        s.x = pe.clientX - N.value.x - m, s.y = pe.clientY - N.value.y - ie;
      }
      function Ue() {
        window.removeEventListener("mousemove", le), window.removeEventListener("mouseup", Ue);
        const pe = l === "note" ? b.NoteMove : b.GroupMove;
        E({ type: pe, id: s.id, x: s.x, y: s.y });
      }
      window.addEventListener("mousemove", le), window.addEventListener("mouseup", Ue);
    }
    function J(s, o) {
      const l = c.value.find((m) => m.id === s);
      l && (l.width = o.width, l.height = o.height), E({ type: b.NoteResize, id: s, ...o });
    }
    function ze(s, o) {
      const l = c.value.find((m) => m.id === s);
      l && (l.text = o), E({ type: b.NoteEdit, id: s, text: o });
    }
    function De(s, o) {
      const l = v.value.find((m) => m.id === s);
      l && (l.width = o.width, l.height = o.height), E({ type: b.GroupResize, id: s, ...o });
    }
    function Pe(s, o) {
      const l = v.value.find((m) => m.id === s);
      l && (l.title = o.title, l.description = o.description), E({ type: b.GroupEdit, id: s, ...o });
    }
    function Ae(s, o) {
      const l = v.value.find((m) => m.id === s);
      l && (l.pinned = o), E({ type: b.GroupPin, id: s, pinned: o });
    }
    function Ge(s) {
      const o = c.value.find((l) => l.id === s);
      if (o && k.value.active) {
        const l = o.votedBy?.includes(t), m = T.value < k.value.maxVotesPerUser;
        !l && m && (o.votedBy || (o.votedBy = []), t && (o.votedBy.push(t), E({ type: b.NoteVote, id: s })));
      }
    }
    function Oe(s) {
      const o = c.value.find((l) => l.id === s);
      o && k.value.active && o.votedBy && t && (o.votedBy = o.votedBy.filter((l) => l !== t)), E({ type: b.NoteUnvote, id: s });
    }
    function Te() {
      a.exportBoard({
        boardId: r.boardId,
        onSuccess: (s) => {
          const o = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" }), l = URL.createObjectURL(o), m = document.createElement("a");
          m.href = l, m.download = `${r.boardId}.json`, m.click(), URL.revokeObjectURL(l);
        }
      });
    }
    function He() {
      $.value?.click();
    }
    function Ye(s) {
      const o = s.target.files?.[0];
      if (!o) return;
      const l = new FileReader();
      l.onload = (m) => {
        try {
          const ie = JSON.parse(m.target?.result);
          a.importBoard({
            boardId: r.boardId,
            password: r.password,
            clientId: t,
            data: ie,
            onSuccess: () => U(w("notifications.import_success"))
          });
        } catch {
          U(w("notifications.invalid_json"));
        }
        $.value && ($.value.value = "");
      }, l.readAsText(o);
    }
    function Je(s) {
      q.value = !0;
      const o = s.clientX - N.value.x, l = s.clientY - N.value.y;
      function m(le) {
        le.preventDefault(), N.value.x = le.clientX - o, N.value.y = le.clientY - l;
      }
      function ie() {
        q.value = !1, window.removeEventListener("mousemove", m), window.removeEventListener("mouseup", ie);
      }
      window.addEventListener("mousemove", m), window.addEventListener("mouseup", ie);
    }
    return (s, o) => (p(), f(z, null, [
      e("div", {
        class: "board",
        style: W(K.value),
        onMousedown: Je
      }, [
        e("div", {
          class: "canvas",
          style: W(Z.value)
        }, [
          (p(!0), f(z, null, de(v.value, (l) => (p(), G(Bo, {
            key: l.id,
            x: l.x,
            y: l.y,
            width: l.width,
            height: l.height,
            title: l.title,
            description: l.description,
            pinned: l.pinned,
            onDragStart: (m) => M(l, m, "group"),
            onDelete: (m) => C(l.id),
            onResize: (m) => De(l.id, m),
            onEdit: (m) => Pe(l.id, m),
            onTogglePin: (m) => Ae(l.id, m)
          }, null, 8, ["x", "y", "width", "height", "title", "description", "pinned", "onDragStart", "onDelete", "onResize", "onEdit", "onTogglePin"]))), 128)),
          (p(!0), f(z, null, de(c.value, (l) => (p(), G(ko, {
            key: l.id,
            x: l.x,
            y: l.y,
            width: l.width,
            height: l.height,
            text: l.text,
            "is-owner": l.createdBy === u(t),
            "voted-by": l.votedBy,
            voting: k.value,
            "my-id": u(t),
            "can-vote-more": T.value < k.value.maxVotesPerUser,
            style: W({ zIndex: l.zIndex }),
            onBringToFront: (m) => I(l),
            onDragStart: (m) => M(l, m, "note"),
            onDelete: (m) => L(l.id),
            onResize: (m) => J(l.id, m),
            onEdit: (m) => ze(l.id, m),
            onVote: (m) => Ge(l.id),
            onUnvote: (m) => Oe(l.id),
            "is-hidden": d.value && l.createdBy !== u(t) && !l.text
          }, null, 8, ["x", "y", "width", "height", "text", "is-owner", "voted-by", "voting", "my-id", "can-vote-more", "style", "onBringToFront", "onDragStart", "onDelete", "onResize", "onEdit", "onVote", "onUnvote", "is-hidden"]))), 128))
        ], 4),
        H(Zo, {
          onAddNote: Q,
          onAddGroup: ue,
          "is-notes-hidden": d.value,
          "is-owner": x.value === u(t),
          voting: k.value,
          onToggleVisibility: o[0] || (o[0] = () => u(E)({ type: u(b).BoardToggleNotes, isHidden: !d.value })),
          onExportBoard: Te,
          onImportBoard: He,
          onStartVoting: o[1] || (o[1] = (l) => u(E)({ type: u(b).BoardVotingStart, maxVotesPerUser: l })),
          onPauseVoting: o[2] || (o[2] = () => u(E)({ type: u(b).BoardVotingPause })),
          onResetVoting: o[3] || (o[3] = () => u(E)({ type: u(b).BoardVotingReset })),
          onLeave: o[4] || (o[4] = (l) => u(S).backToBoardSetup())
        }, null, 8, ["is-notes-hidden", "is-owner", "voting"]),
        e("input", {
          ref_key: "fileInput",
          ref: $,
          type: "file",
          accept: ".json",
          style: { display: "none" },
          onChange: Ye
        }, null, 544),
        H(en, {
          users: g.value,
          "my-id": u(t)
        }, null, 8, ["users", "my-id"]),
        e("div", hn, [
          u(re) === "auth" ? (p(), f("div", _n, _(u(w)("connection.access_denied")), 1)) : u(se) ? V("", !0) : (p(), f("div", wn, _(u(w)("connection.reconnecting")), 1))
        ])
      ], 36),
      B.value ? (p(), G(gn, {
        key: 0,
        "is-admin": x.value === u(t),
        "server-url": r.serverUrl,
        "board-id": r.boardId,
        onGoBack: o[5] || (o[5] = (l) => u(S).backToBoardSetup())
      }, null, 8, ["is-admin", "server-url", "board-id"])) : V("", !0)
    ], 64));
  }
}), mn = /* @__PURE__ */ P(bn, [["__scopeId", "data-v-1539ecb6"]]), xn = /* @__PURE__ */ R({
  __name: "BoardView",
  setup(i) {
    const r = Ke(), t = new Be(be()), { username: n } = me(), a = h(""), c = h(""), v = h(!1);
    ce(() => {
      const d = j.getServerUrl(), x = j.getBoardPassword();
      if (!d || !x || !n.value) {
        t.toHome();
        return;
      }
      a.value = d, c.value = x, v.value = !0;
    });
    const g = r.params.id;
    return (d, x) => v.value ? (p(), G(mn, {
      key: 0,
      "server-url": a.value,
      "board-id": u(g),
      password: c.value,
      username: u(n)
    }, null, 8, ["server-url", "board-id", "password", "username"])) : V("", !0);
  }
}), qn = Qe({
  history: We(),
  routes: [
    { path: "/", redirect: "/connect" },
    { path: "/connect", component: po },
    { path: "/board/:id", component: xn }
  ]
}), yn = { ok: "OK", cancel: "Cancel", save: "Save", delete: "Delete", loading: "Loading...", error: "Error", settings: "Settings", close: "Close" }, kn = { not_found: "Resource not found", already_exists: "Resource already exists", invalid_arg: "Invalid argument provided", internal_server_error: "An unexpected error occurred", validation_error: "Validation failed" }, $n = { note: "Note", group: "Group", show_notes: "Show notes", hide_notes: "Hide notes", export: "Export", import: "Import", leave: "Leave", export_json: "Export board (JSON)", import_json: "Import board (JSON)", leave_board: "Leave board", delete_note: "Delete Note", hidden_note: "Hidden Note", note_placeholder: "Double click to write...", pin_group: "Pin Group", unpin_group: "Unpin Group", delete_group: "Delete Group", group_desc_placeholder: "Add description...", group_desc_empty: "Double click to add description...", confirm_reset_voting: "Are you sure you want to reset voting? This will clear all current votes.", votes_per_user_prompt: "Enter max votes per user:", pause_voting: "Pause Voting", reset_voting: "Clear Votes", start_voting: "Start Voting", vote: "Vote", clear: "Clear", create_note: "Create Note", create_group: "Create Group" }, Sn = { title: "Open Retro", create_board: "Create a Board", join_board: "Join a Board", create_desc: "Create a new empty board and protect it with a password.", join_desc: "Enter the ID and password of the board you want to join.", create_tab: "Create", join_tab: "Join", username_label: "Your Name", username_placeholder: "e.g. Jane_Doe", board_id_label: "Board ID", board_id_placeholder: "Board ID", password_label: "Password", password_placeholder: "Board password", regenerate: "Regenerate", generate_id_title: "Generate new ID", submit_create: "Create Board", submit_join: "Join Board", username_error: "Only letters, numbers, dashes (-) and underscores (_) are allowed.", server_config_title: "Configure Server", server_config_desc: "Enter the URL of the WebSocket server you want to connect to.", server_url_label: "Server URL", server_url_placeholder: "ws://my-server:3001", connect: "Connect", connecting: "Connecting...", preferences_tab: "Preferences", server_tab: "Server", preferences_title: "App Preferences", language_label: "Global Language", test_connection: "Test Connection", connection_success: "Connection successful" }, Cn = { me_suffix: "(you)" }, Bn = { en: "English", es: "Spanish", select: "Select language" }, In = { wrong_password: "Wrong password", access_denied: "Wrong password — access denied", reconnecting: "Reconnecting..." }, Un = { import_success: "Board imported successfully", invalid_json: "File is not a valid JSON" }, En = { title: "Session time limit reached", description: "This board has reached its maximum session time and is now locked.", go_back: "Go Back", export_board: "Export Board", admin_warning: "You have {seconds}s to export the board before all data is permanently erased.", data_erased: "Board data has been permanently erased." }, Vn = { invalid_password: "Invalid password", session_expired: "Session expired" }, Nn = {
  common: yn,
  errors: kn,
  board: $n,
  setup: Sn,
  user: Cn,
  languages: Bn,
  connection: In,
  notifications: Un,
  session_expired: En,
  ws_close: Vn
}, Ln = { ok: "Aceptar", cancel: "Cancelar", save: "Guardar", delete: "Eliminar", loading: "Cargando...", error: "Error", settings: "Ajustes", close: "Cerrar" }, Mn = { not_found: "Recurso no encontrado", already_exists: "El recurso ya existe", invalid_arg: "Argumento inválido", internal_server_error: "Ocurrió un error inesperado", validation_error: "Error de validación" }, jn = { note: "Nota", group: "Grupo", show_notes: "Mostrar notas", hide_notes: "Ocultar notas", export: "Exportar", import: "Importar", leave: "Salir", export_json: "Exportar board (JSON)", import_json: "Importar board (JSON)", leave_board: "Abandonar board", delete_note: "Eliminar nota", hidden_note: "Nota Oculta", note_placeholder: "Doble click para escribir...", pin_group: "Fijar grupo", unpin_group: "Desfijar grupo", delete_group: "Eliminar grupo", group_desc_placeholder: "Añadir descripción...", group_desc_empty: "Doble click para añadir descripción...", confirm_reset_voting: "¿Estás seguro de que deseas reiniciar la votación? Esto borrará todos los votos actuales.", votes_per_user_prompt: "Límite de votos por usuario:", pause_voting: "Pausar Votación", reset_voting: "Limpiar Votos", start_voting: "Iniciar Votación", vote: "Votar", clear: "Limpiar", create_note: "Crear Nota", create_group: "Crear Grupo" }, Rn = { title: "Open Retro", create_board: "Crear un board", join_board: "Unirse a un board", create_desc: "Creá un nuevo board vacío y protegelo con una contraseña.", join_desc: "Ingresá el ID y la contraseña del board al que querés unirte.", create_tab: "Crear", join_tab: "Unirse", username_label: "Tu nombre", username_placeholder: "Ej: Ana_Garcia", board_id_label: "ID del board", board_id_placeholder: "ID del board", password_label: "Contraseña", password_placeholder: "Contraseña del board", regenerate: "Regenerar", generate_id_title: "Generar nuevo ID", submit_create: "Crear board", submit_join: "Unirse al board", username_error: "Solo se permiten letras, números, guiones (-) y guiones bajos (_).", server_config_title: "Configurar servidor", server_config_desc: "Ingresá la URL del servidor WebSocket al que querés conectarte.", server_url_label: "URL del servidor", server_url_placeholder: "ws://mi-servidor:3001", connect: "Conectar", connecting: "Conectando...", preferences_tab: "Preferencias", server_tab: "Servidor", preferences_title: "Preferencias de la App", language_label: "Idioma Global", test_connection: "Probar Conexión", connection_success: "Conexión exitosa" }, zn = { me_suffix: "(vos)" }, Dn = { en: "Inglés", es: "Español", select: "Seleccionar idioma" }, Pn = { wrong_password: "Contraseña incorrecta", access_denied: "Contraseña incorrecta — acceso denegado", reconnecting: "Reconectando..." }, An = { import_success: "Tablero importado correctamente", invalid_json: "El archivo no es un JSON válido" }, Gn = { title: "Tiempo límite de sesión alcanzado", description: "Este tablero alcanzó su tiempo máximo de sesión y ahora está bloqueado.", go_back: "Volver", export_board: "Exportar tablero", admin_warning: "Tenés {seconds}s para exportar el tablero antes de que todos los datos sean eliminados permanentemente.", data_erased: "Los datos del tablero fueron eliminados permanentemente." }, On = { invalid_password: "Contraseña incorrecta", session_expired: "Sesión expirada" }, Tn = {
  common: Ln,
  errors: Mn,
  board: jn,
  setup: Rn,
  user: zn,
  languages: Dn,
  connection: Pn,
  notifications: An,
  session_expired: Gn,
  ws_close: On
}, Hn = {
  en: Nn,
  es: Tn
}, Me = "en", Zn = et({
  legacy: !1,
  locale: localStorage.getItem("lang") || Me,
  fallbackLocale: Me,
  messages: Hn
});
export {
  Fn as App,
  mn as BoardCanvas,
  nt as Config,
  Ve as ServerService,
  gn as SessionExpiredModal,
  Zo as ToolBar,
  ot as UserService,
  en as UsersSidebar,
  he as getConfig,
  Zn as i18n,
  st as initConfig,
  qn as router,
  fn as useWebSocket
};
