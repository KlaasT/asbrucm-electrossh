import Cu, { BrowserWindow as xo, Menu as Du, ipcMain as Pe, dialog as Mu, app as Tr, safeStorage as Mn } from "electron";
import Ke from "path";
import { fileURLToPath as Lu } from "url";
import _c from "util";
import Br from "fs";
import Is from "crypto";
import Fu from "assert";
import Vu from "events";
import Uu from "os";
import { NodeSSH as zu } from "node-ssh";
import qu from "node-pty";
var sn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ku(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var js = { exports: {} }, Gu = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
};
const Ut = Gu, Hu = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), Ju = (e) => !e.some((t) => Hu.has(t));
function an(e) {
  const t = e.split("."), r = [];
  for (let n = 0; n < t.length; n++) {
    let s = t[n];
    for (; s[s.length - 1] === "\\" && t[n + 1] !== void 0; )
      s = s.slice(0, -1) + ".", s += t[++n];
    r.push(s);
  }
  return Ju(r) ? r : [];
}
var Wu = {
  get(e, t, r) {
    if (!Ut(e) || typeof t != "string")
      return r === void 0 ? e : r;
    const n = an(t);
    if (n.length !== 0) {
      for (let s = 0; s < n.length; s++)
        if (e = e[n[s]], e == null) {
          if (s !== n.length - 1)
            return r;
          break;
        }
      return e === void 0 ? r : e;
    }
  },
  set(e, t, r) {
    if (!Ut(e) || typeof t != "string")
      return e;
    const n = e, s = an(t);
    for (let a = 0; a < s.length; a++) {
      const i = s[a];
      Ut(e[i]) || (e[i] = {}), a === s.length - 1 && (e[i] = r), e = e[i];
    }
    return n;
  },
  delete(e, t) {
    if (!Ut(e) || typeof t != "string")
      return !1;
    const r = an(t);
    for (let n = 0; n < r.length; n++) {
      const s = r[n];
      if (n === r.length - 1)
        return delete e[s], !0;
      if (e = e[s], !Ut(e))
        return !1;
    }
  },
  has(e, t) {
    if (!Ut(e) || typeof t != "string")
      return !1;
    const r = an(t);
    if (r.length === 0)
      return !1;
    for (let n = 0; n < r.length; n++)
      if (Ut(e)) {
        if (!(r[n] in e))
          return !1;
        e = e[r[n]];
      } else
        return !1;
    return !0;
  }
}, Zs = { exports: {} }, xs = { exports: {} }, ea = { exports: {} }, ta = { exports: {} };
const gc = Br;
ta.exports = (e) => new Promise((t) => {
  gc.access(e, (r) => {
    t(!r);
  });
});
ta.exports.sync = (e) => {
  try {
    return gc.accessSync(e), !0;
  } catch {
    return !1;
  }
};
var Bu = ta.exports, ra = { exports: {} }, na = { exports: {} };
const vc = (e, ...t) => new Promise((r) => {
  r(e(...t));
});
na.exports = vc;
na.exports.default = vc;
var Xu = na.exports;
const Yu = Xu, wc = (e) => {
  if (!((Number.isInteger(e) || e === 1 / 0) && e > 0))
    return Promise.reject(new TypeError("Expected `concurrency` to be a number from 1 and up"));
  const t = [];
  let r = 0;
  const n = () => {
    r--, t.length > 0 && t.shift()();
  }, s = (u, c, ...d) => {
    r++;
    const l = Yu(u, ...d);
    c(l), l.then(n, n);
  }, a = (u, c, ...d) => {
    r < e ? s(u, c, ...d) : t.push(s.bind(null, u, c, ...d));
  }, i = (u, ...c) => new Promise((d) => a(u, d, ...c));
  return Object.defineProperties(i, {
    activeCount: {
      get: () => r
    },
    pendingCount: {
      get: () => t.length
    },
    clearQueue: {
      value: () => {
        t.length = 0;
      }
    }
  }), i;
};
ra.exports = wc;
ra.exports.default = wc;
var Qu = ra.exports;
const ei = Qu;
class Ec extends Error {
  constructor(t) {
    super(), this.value = t;
  }
}
const Zu = (e, t) => Promise.resolve(e).then(t), xu = (e) => Promise.all(e).then((t) => t[1] === !0 && Promise.reject(new Ec(t[0])));
var ed = (e, t, r) => {
  r = Object.assign({
    concurrency: 1 / 0,
    preserveOrder: !0
  }, r);
  const n = ei(r.concurrency), s = [...e].map((i) => [i, n(Zu, i, t)]), a = ei(r.preserveOrder ? 1 : 1 / 0);
  return Promise.all(s.map((i) => a(xu, i))).then(() => {
  }).catch((i) => i instanceof Ec ? i.value : Promise.reject(i));
};
const Sc = Ke, bc = Bu, td = ed;
ea.exports = (e, t) => (t = Object.assign({
  cwd: process.cwd()
}, t), td(e, (r) => bc(Sc.resolve(t.cwd, r)), t));
ea.exports.sync = (e, t) => {
  t = Object.assign({
    cwd: process.cwd()
  }, t);
  for (const r of e)
    if (bc.sync(Sc.resolve(t.cwd, r)))
      return r;
};
var rd = ea.exports;
const vt = Ke, Pc = rd;
xs.exports = (e, t = {}) => {
  const r = vt.resolve(t.cwd || ""), { root: n } = vt.parse(r), s = [].concat(e);
  return new Promise((a) => {
    (function i(u) {
      Pc(s, { cwd: u }).then((c) => {
        c ? a(vt.join(u, c)) : u === n ? a(null) : i(vt.dirname(u));
      });
    })(r);
  });
};
xs.exports.sync = (e, t = {}) => {
  let r = vt.resolve(t.cwd || "");
  const { root: n } = vt.parse(r), s = [].concat(e);
  for (; ; ) {
    const a = Pc.sync(s, { cwd: r });
    if (a)
      return vt.join(r, a);
    if (r === n)
      return null;
    r = vt.dirname(r);
  }
};
var nd = xs.exports;
const Nc = nd;
Zs.exports = async ({ cwd: e } = {}) => Nc("package.json", { cwd: e });
Zs.exports.sync = ({ cwd: e } = {}) => Nc.sync("package.json", { cwd: e });
var sd = Zs.exports, sa = { exports: {} };
const pe = Ke, Oc = Uu, gt = Oc.homedir(), aa = Oc.tmpdir(), { env: or } = process, ad = (e) => {
  const t = pe.join(gt, "Library");
  return {
    data: pe.join(t, "Application Support", e),
    config: pe.join(t, "Preferences", e),
    cache: pe.join(t, "Caches", e),
    log: pe.join(t, "Logs", e),
    temp: pe.join(aa, e)
  };
}, od = (e) => {
  const t = or.APPDATA || pe.join(gt, "AppData", "Roaming"), r = or.LOCALAPPDATA || pe.join(gt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: pe.join(r, e, "Data"),
    config: pe.join(t, e, "Config"),
    cache: pe.join(r, e, "Cache"),
    log: pe.join(r, e, "Log"),
    temp: pe.join(aa, e)
  };
}, id = (e) => {
  const t = pe.basename(gt);
  return {
    data: pe.join(or.XDG_DATA_HOME || pe.join(gt, ".local", "share"), e),
    config: pe.join(or.XDG_CONFIG_HOME || pe.join(gt, ".config"), e),
    cache: pe.join(or.XDG_CACHE_HOME || pe.join(gt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: pe.join(or.XDG_STATE_HOME || pe.join(gt, ".local", "state"), e),
    temp: pe.join(aa, t, e)
  };
}, Rc = (e, t) => {
  if (typeof e != "string")
    throw new TypeError(`Expected string, got ${typeof e}`);
  return t = Object.assign({ suffix: "nodejs" }, t), t.suffix && (e += `-${t.suffix}`), process.platform === "darwin" ? ad(e) : process.platform === "win32" ? od(e) : id(e);
};
sa.exports = Rc;
sa.exports.default = Rc;
var cd = sa.exports, st = {}, ae = {};
Object.defineProperty(ae, "__esModule", { value: !0 });
ae.NOOP = ae.LIMIT_FILES_DESCRIPTORS = ae.LIMIT_BASENAME_LENGTH = ae.IS_USER_ROOT = ae.IS_POSIX = ae.DEFAULT_TIMEOUT_SYNC = ae.DEFAULT_TIMEOUT_ASYNC = ae.DEFAULT_WRITE_OPTIONS = ae.DEFAULT_READ_OPTIONS = ae.DEFAULT_FOLDER_MODE = ae.DEFAULT_FILE_MODE = ae.DEFAULT_ENCODING = void 0;
const ld = "utf8";
ae.DEFAULT_ENCODING = ld;
const ud = 438;
ae.DEFAULT_FILE_MODE = ud;
const dd = 511;
ae.DEFAULT_FOLDER_MODE = dd;
const fd = {};
ae.DEFAULT_READ_OPTIONS = fd;
const hd = {};
ae.DEFAULT_WRITE_OPTIONS = hd;
const pd = 5e3;
ae.DEFAULT_TIMEOUT_ASYNC = pd;
const md = 100;
ae.DEFAULT_TIMEOUT_SYNC = md;
const yd = !!process.getuid;
ae.IS_POSIX = yd;
const $d = process.getuid ? !process.getuid() : !1;
ae.IS_USER_ROOT = $d;
const _d = 128;
ae.LIMIT_BASENAME_LENGTH = _d;
const gd = 1e4;
ae.LIMIT_FILES_DESCRIPTORS = gd;
const vd = () => {
};
ae.NOOP = vd;
var Wn = {}, pr = {};
Object.defineProperty(pr, "__esModule", { value: !0 });
pr.attemptifySync = pr.attemptifyAsync = void 0;
const Tc = ae, wd = (e, t = Tc.NOOP) => function() {
  return e.apply(void 0, arguments).catch(t);
};
pr.attemptifyAsync = wd;
const Ed = (e, t = Tc.NOOP) => function() {
  try {
    return e.apply(void 0, arguments);
  } catch (r) {
    return t(r);
  }
};
pr.attemptifySync = Ed;
var oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
const Sd = ae, Ic = {
  isChangeErrorOk: (e) => {
    const { code: t } = e;
    return t === "ENOSYS" || !Sd.IS_USER_ROOT && (t === "EINVAL" || t === "EPERM");
  },
  isRetriableError: (e) => {
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!Ic.isChangeErrorOk(e))
      throw e;
  }
};
oa.default = Ic;
var mr = {}, ia = {};
Object.defineProperty(ia, "__esModule", { value: !0 });
const bd = ae, le = {
  interval: 25,
  intervalId: void 0,
  limit: bd.LIMIT_FILES_DESCRIPTORS,
  queueActive: /* @__PURE__ */ new Set(),
  queueWaiting: /* @__PURE__ */ new Set(),
  init: () => {
    le.intervalId || (le.intervalId = setInterval(le.tick, le.interval));
  },
  reset: () => {
    le.intervalId && (clearInterval(le.intervalId), delete le.intervalId);
  },
  add: (e) => {
    le.queueWaiting.add(e), le.queueActive.size < le.limit / 2 ? le.tick() : le.init();
  },
  remove: (e) => {
    le.queueWaiting.delete(e), le.queueActive.delete(e);
  },
  schedule: () => new Promise((e) => {
    const t = () => le.remove(r), r = () => e(t);
    le.add(r);
  }),
  tick: () => {
    if (!(le.queueActive.size >= le.limit)) {
      if (!le.queueWaiting.size)
        return le.reset();
      for (const e of le.queueWaiting) {
        if (le.queueActive.size >= le.limit)
          break;
        le.queueWaiting.delete(e), le.queueActive.add(e), e();
      }
    }
  }
};
ia.default = le;
Object.defineProperty(mr, "__esModule", { value: !0 });
mr.retryifySync = mr.retryifyAsync = void 0;
const Pd = ia, Nd = (e, t) => function(r) {
  return function n() {
    return Pd.default.schedule().then((s) => e.apply(void 0, arguments).then((a) => (s(), a), (a) => {
      if (s(), Date.now() >= r)
        throw a;
      if (t(a)) {
        const i = Math.round(100 + 400 * Math.random());
        return new Promise((c) => setTimeout(c, i)).then(() => n.apply(void 0, arguments));
      }
      throw a;
    }));
  };
};
mr.retryifyAsync = Nd;
const Od = (e, t) => function(r) {
  return function n() {
    try {
      return e.apply(void 0, arguments);
    } catch (s) {
      if (Date.now() > r)
        throw s;
      if (t(s))
        return n.apply(void 0, arguments);
      throw s;
    }
  };
};
mr.retryifySync = Od;
Object.defineProperty(Wn, "__esModule", { value: !0 });
const oe = Br, Re = _c, Te = pr, ge = oa, ke = mr, Rd = {
  chmodAttempt: Te.attemptifyAsync(Re.promisify(oe.chmod), ge.default.onChangeError),
  chownAttempt: Te.attemptifyAsync(Re.promisify(oe.chown), ge.default.onChangeError),
  closeAttempt: Te.attemptifyAsync(Re.promisify(oe.close)),
  fsyncAttempt: Te.attemptifyAsync(Re.promisify(oe.fsync)),
  mkdirAttempt: Te.attemptifyAsync(Re.promisify(oe.mkdir)),
  realpathAttempt: Te.attemptifyAsync(Re.promisify(oe.realpath)),
  statAttempt: Te.attemptifyAsync(Re.promisify(oe.stat)),
  unlinkAttempt: Te.attemptifyAsync(Re.promisify(oe.unlink)),
  closeRetry: ke.retryifyAsync(Re.promisify(oe.close), ge.default.isRetriableError),
  fsyncRetry: ke.retryifyAsync(Re.promisify(oe.fsync), ge.default.isRetriableError),
  openRetry: ke.retryifyAsync(Re.promisify(oe.open), ge.default.isRetriableError),
  readFileRetry: ke.retryifyAsync(Re.promisify(oe.readFile), ge.default.isRetriableError),
  renameRetry: ke.retryifyAsync(Re.promisify(oe.rename), ge.default.isRetriableError),
  statRetry: ke.retryifyAsync(Re.promisify(oe.stat), ge.default.isRetriableError),
  writeRetry: ke.retryifyAsync(Re.promisify(oe.write), ge.default.isRetriableError),
  chmodSyncAttempt: Te.attemptifySync(oe.chmodSync, ge.default.onChangeError),
  chownSyncAttempt: Te.attemptifySync(oe.chownSync, ge.default.onChangeError),
  closeSyncAttempt: Te.attemptifySync(oe.closeSync),
  mkdirSyncAttempt: Te.attemptifySync(oe.mkdirSync),
  realpathSyncAttempt: Te.attemptifySync(oe.realpathSync),
  statSyncAttempt: Te.attemptifySync(oe.statSync),
  unlinkSyncAttempt: Te.attemptifySync(oe.unlinkSync),
  closeSyncRetry: ke.retryifySync(oe.closeSync, ge.default.isRetriableError),
  fsyncSyncRetry: ke.retryifySync(oe.fsyncSync, ge.default.isRetriableError),
  openSyncRetry: ke.retryifySync(oe.openSync, ge.default.isRetriableError),
  readFileSyncRetry: ke.retryifySync(oe.readFileSync, ge.default.isRetriableError),
  renameSyncRetry: ke.retryifySync(oe.renameSync, ge.default.isRetriableError),
  statSyncRetry: ke.retryifySync(oe.statSync, ge.default.isRetriableError),
  writeSyncRetry: ke.retryifySync(oe.writeSync, ge.default.isRetriableError)
};
Wn.default = Rd;
var ca = {};
Object.defineProperty(ca, "__esModule", { value: !0 });
const Td = {
  isFunction: (e) => typeof e == "function",
  isString: (e) => typeof e == "string",
  isUndefined: (e) => typeof e > "u"
};
ca.default = Td;
var la = {};
Object.defineProperty(la, "__esModule", { value: !0 });
const on = {}, As = {
  next: (e) => {
    const t = on[e];
    if (!t)
      return;
    t.shift();
    const r = t[0];
    r ? r(() => As.next(e)) : delete on[e];
  },
  schedule: (e) => new Promise((t) => {
    let r = on[e];
    r || (r = on[e] = []), r.push(t), !(r.length > 1) && t(() => As.next(e));
  })
};
la.default = As;
var ua = {};
Object.defineProperty(ua, "__esModule", { value: !0 });
const Id = Ke, ti = ae, ri = Wn, Ve = {
  store: {},
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), r = Date.now().toString().slice(-10), n = "tmp-", s = `.${n}${r}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = Ve.truncate(t(e));
    return n in Ve.store ? Ve.get(e, t, r) : (Ve.store[n] = r, [n, () => delete Ve.store[n]]);
  },
  purge: (e) => {
    Ve.store[e] && (delete Ve.store[e], ri.default.unlinkAttempt(e));
  },
  purgeSync: (e) => {
    Ve.store[e] && (delete Ve.store[e], ri.default.unlinkSyncAttempt(e));
  },
  purgeSyncAll: () => {
    for (const e in Ve.store)
      Ve.purgeSync(e);
  },
  truncate: (e) => {
    const t = Id.basename(e);
    if (t.length <= ti.LIMIT_BASENAME_LENGTH)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - ti.LIMIT_BASENAME_LENGTH;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
process.on("exit", Ve.purgeSyncAll);
ua.default = Ve;
Object.defineProperty(st, "__esModule", { value: !0 });
st.writeFileSync = st.writeFile = st.readFileSync = st.readFile = void 0;
const jc = Ke, Ee = ae, se = Wn, Ue = ca, jd = la, wt = ua;
function Ac(e, t = Ee.DEFAULT_READ_OPTIONS) {
  var r;
  if (Ue.default.isString(t))
    return Ac(e, { encoding: t });
  const n = Date.now() + ((r = t.timeout) !== null && r !== void 0 ? r : Ee.DEFAULT_TIMEOUT_ASYNC);
  return se.default.readFileRetry(n)(e, t);
}
st.readFile = Ac;
function kc(e, t = Ee.DEFAULT_READ_OPTIONS) {
  var r;
  if (Ue.default.isString(t))
    return kc(e, { encoding: t });
  const n = Date.now() + ((r = t.timeout) !== null && r !== void 0 ? r : Ee.DEFAULT_TIMEOUT_SYNC);
  return se.default.readFileSyncRetry(n)(e, t);
}
st.readFileSync = kc;
const Cc = (e, t, r, n) => {
  if (Ue.default.isFunction(r))
    return Cc(e, t, Ee.DEFAULT_WRITE_OPTIONS, r);
  const s = Dc(e, t, r);
  return n && s.then(n, n), s;
};
st.writeFile = Cc;
const Dc = async (e, t, r = Ee.DEFAULT_WRITE_OPTIONS) => {
  var n;
  if (Ue.default.isString(r))
    return Dc(e, t, { encoding: r });
  const s = Date.now() + ((n = r.timeout) !== null && n !== void 0 ? n : Ee.DEFAULT_TIMEOUT_ASYNC);
  let a = null, i = null, u = null, c = null, d = null;
  try {
    r.schedule && (a = await r.schedule(e)), i = await jd.default.schedule(e), e = await se.default.realpathAttempt(e) || e, [c, u] = wt.default.get(e, r.tmpCreate || wt.default.create, r.tmpPurge !== !1);
    const l = Ee.IS_POSIX && Ue.default.isUndefined(r.chown), h = Ue.default.isUndefined(r.mode);
    if (l || h) {
      const _ = await se.default.statAttempt(e);
      _ && (r = { ...r }, l && (r.chown = { uid: _.uid, gid: _.gid }), h && (r.mode = _.mode));
    }
    const P = jc.dirname(e);
    await se.default.mkdirAttempt(P, {
      mode: Ee.DEFAULT_FOLDER_MODE,
      recursive: !0
    }), d = await se.default.openRetry(s)(c, "w", r.mode || Ee.DEFAULT_FILE_MODE), r.tmpCreated && r.tmpCreated(c), Ue.default.isString(t) ? await se.default.writeRetry(s)(d, t, 0, r.encoding || Ee.DEFAULT_ENCODING) : Ue.default.isUndefined(t) || await se.default.writeRetry(s)(d, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? await se.default.fsyncRetry(s)(d) : se.default.fsyncAttempt(d)), await se.default.closeRetry(s)(d), d = null, r.chown && await se.default.chownAttempt(c, r.chown.uid, r.chown.gid), r.mode && await se.default.chmodAttempt(c, r.mode);
    try {
      await se.default.renameRetry(s)(c, e);
    } catch (_) {
      if (_.code !== "ENAMETOOLONG")
        throw _;
      await se.default.renameRetry(s)(c, wt.default.truncate(e));
    }
    u(), c = null;
  } finally {
    d && await se.default.closeAttempt(d), c && wt.default.purge(c), a && a(), i && i();
  }
}, Mc = (e, t, r = Ee.DEFAULT_WRITE_OPTIONS) => {
  var n;
  if (Ue.default.isString(r))
    return Mc(e, t, { encoding: r });
  const s = Date.now() + ((n = r.timeout) !== null && n !== void 0 ? n : Ee.DEFAULT_TIMEOUT_SYNC);
  let a = null, i = null, u = null;
  try {
    e = se.default.realpathSyncAttempt(e) || e, [i, a] = wt.default.get(e, r.tmpCreate || wt.default.create, r.tmpPurge !== !1);
    const c = Ee.IS_POSIX && Ue.default.isUndefined(r.chown), d = Ue.default.isUndefined(r.mode);
    if (c || d) {
      const h = se.default.statSyncAttempt(e);
      h && (r = { ...r }, c && (r.chown = { uid: h.uid, gid: h.gid }), d && (r.mode = h.mode));
    }
    const l = jc.dirname(e);
    se.default.mkdirSyncAttempt(l, {
      mode: Ee.DEFAULT_FOLDER_MODE,
      recursive: !0
    }), u = se.default.openSyncRetry(s)(i, "w", r.mode || Ee.DEFAULT_FILE_MODE), r.tmpCreated && r.tmpCreated(i), Ue.default.isString(t) ? se.default.writeSyncRetry(s)(u, t, 0, r.encoding || Ee.DEFAULT_ENCODING) : Ue.default.isUndefined(t) || se.default.writeSyncRetry(s)(u, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? se.default.fsyncSyncRetry(s)(u) : se.default.fsyncAttempt(u)), se.default.closeSyncRetry(s)(u), u = null, r.chown && se.default.chownSyncAttempt(i, r.chown.uid, r.chown.gid), r.mode && se.default.chmodSyncAttempt(i, r.mode);
    try {
      se.default.renameSyncRetry(s)(i, e);
    } catch (h) {
      if (h.code !== "ENAMETOOLONG")
        throw h;
      se.default.renameSyncRetry(s)(i, wt.default.truncate(e));
    }
    a(), i = null;
  } finally {
    u && se.default.closeSyncAttempt(u), i && wt.default.purge(i);
  }
};
st.writeFileSync = Mc;
var ks = { exports: {} }, Lc = {}, Qe = {}, yr = {}, Qr = {}, te = {}, Xr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(v) {
      if (super(), !e.IDENTIFIER.test(v))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(v) {
      super(), this._items = typeof v == "string" ? [v] : v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const v = this._items[0];
      return v === "" || v === '""';
    }
    get str() {
      var v;
      return (v = this._str) !== null && v !== void 0 ? v : this._str = this._items.reduce((N, R) => `${N}${R}`, "");
    }
    get names() {
      var v;
      return (v = this._names) !== null && v !== void 0 ? v : this._names = this._items.reduce((N, R) => (R instanceof r && (N[R.str] = (N[R.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(p, ...v) {
    const N = [p[0]];
    let R = 0;
    for (; R < v.length; )
      u(N, v[R]), N.push(p[++R]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function i(p, ...v) {
    const N = [_(p[0])];
    let R = 0;
    for (; R < v.length; )
      N.push(a), u(N, v[R]), N.push(a, _(p[++R]));
    return c(N), new n(N);
  }
  e.str = i;
  function u(p, v) {
    v instanceof n ? p.push(...v._items) : v instanceof r ? p.push(v) : p.push(h(v));
  }
  e.addCodeArg = u;
  function c(p) {
    let v = 1;
    for (; v < p.length - 1; ) {
      if (p[v] === a) {
        const N = d(p[v - 1], p[v + 1]);
        if (N !== void 0) {
          p.splice(v - 1, 3, N);
          continue;
        }
        p[v++] = "+";
      }
      v++;
    }
  }
  function d(p, v) {
    if (v === '""')
      return p;
    if (p === '""')
      return v;
    if (typeof p == "string")
      return v instanceof r || p[p.length - 1] !== '"' ? void 0 : typeof v != "string" ? `${p.slice(0, -1)}${v}"` : v[0] === '"' ? p.slice(0, -1) + v.slice(1) : void 0;
    if (typeof v == "string" && v[0] === '"' && !(p instanceof r))
      return `"${p}${v.slice(1)}`;
  }
  function l(p, v) {
    return v.emptyStr() ? p : p.emptyStr() ? v : i`${p}${v}`;
  }
  e.strConcat = l;
  function h(p) {
    return typeof p == "number" || typeof p == "boolean" || p === null ? p : _(Array.isArray(p) ? p.join(",") : p);
  }
  function P(p) {
    return new n(_(p));
  }
  e.stringify = P;
  function _(p) {
    return JSON.stringify(p).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = _;
  function E(p) {
    return typeof p == "string" && e.IDENTIFIER.test(p) ? new n(`.${p}`) : s`[${p}]`;
  }
  e.getProperty = E;
  function g(p) {
    if (typeof p == "string" && e.IDENTIFIER.test(p))
      return new n(`${p}`);
    throw new Error(`CodeGen: invalid export name: ${p}, use explicit $id name mapping`);
  }
  e.getEsmExportName = g;
  function $(p) {
    return new n(p.toString());
  }
  e.regexpCode = $;
})(Xr);
var Cs = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Xr;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: l } = {}) {
      this._names = {}, this._prefixes = d, this._parent = l;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const l = this._names[d] || this._nameGroup(d);
      return `${d}${l.index++}`;
    }
    _nameGroup(d) {
      var l, h;
      if (!((h = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(d, l) {
      super(l), this.prefix = d;
    }
    setValue(d, { property: l, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(l)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const i = (0, t._)`\n`;
  class u extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? i : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, l) {
      var h;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const P = this.toName(d), { prefix: _ } = P, E = (h = l.key) !== null && h !== void 0 ? h : l.ref;
      let g = this._values[_];
      if (g) {
        const v = g.get(E);
        if (v)
          return v;
      } else
        g = this._values[_] = /* @__PURE__ */ new Map();
      g.set(E, P);
      const $ = this._scope[_] || (this._scope[_] = []), p = $.length;
      return $[p] = l.ref, P.setValue(l, { property: _, itemIndex: p }), P;
    }
    getValue(d, l) {
      const h = this._values[d];
      if (h)
        return h.get(l);
    }
    scopeRefs(d, l = this._values) {
      return this._reduceValues(l, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, l, h) {
      return this._reduceValues(d, (P) => {
        if (P.value === void 0)
          throw new Error(`CodeGen: name "${P}" has no value`);
        return P.value.code;
      }, l, h);
    }
    _reduceValues(d, l, h = {}, P) {
      let _ = t.nil;
      for (const E in d) {
        const g = d[E];
        if (!g)
          continue;
        const $ = h[E] = h[E] || /* @__PURE__ */ new Map();
        g.forEach((p) => {
          if ($.has(p))
            return;
          $.set(p, n.Started);
          let v = l(p);
          if (v) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            _ = (0, t._)`${_}${N} ${p} = ${v};${this.opts._n}`;
          } else if (v = P == null ? void 0 : P(p))
            _ = (0, t._)`${_}${v}${this.opts._n}`;
          else
            throw new r(p);
          $.set(p, n.Completed);
        });
      }
      return _;
    }
  }
  e.ValueScope = u;
})(Cs);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Xr, r = Cs;
  var n = Xr;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = Cs;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(o, f) {
      return this;
    }
  }
  class i extends a {
    constructor(o, f, b) {
      super(), this.varKind = o, this.name = f, this.rhs = b;
    }
    render({ es5: o, _n: f }) {
      const b = o ? r.varKinds.var : this.varKind, j = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${j};` + f;
    }
    optimizeNames(o, f) {
      if (o[this.name.str])
        return this.rhs && (this.rhs = C(this.rhs, o, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class u extends a {
    constructor(o, f, b) {
      super(), this.lhs = o, this.rhs = f, this.sideEffects = b;
    }
    render({ _n: o }) {
      return `${this.lhs} = ${this.rhs};` + o;
    }
    optimizeNames(o, f) {
      if (!(this.lhs instanceof t.Name && !o[this.lhs.str] && !this.sideEffects))
        return this.rhs = C(this.rhs, o, f), this;
    }
    get names() {
      const o = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return de(o, this.rhs);
    }
  }
  class c extends u {
    constructor(o, f, b, j) {
      super(o, b, j), this.op = f;
    }
    render({ _n: o }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + o;
    }
  }
  class d extends a {
    constructor(o) {
      super(), this.label = o, this.names = {};
    }
    render({ _n: o }) {
      return `${this.label}:` + o;
    }
  }
  class l extends a {
    constructor(o) {
      super(), this.label = o, this.names = {};
    }
    render({ _n: o }) {
      return `break${this.label ? ` ${this.label}` : ""};` + o;
    }
  }
  class h extends a {
    constructor(o) {
      super(), this.error = o;
    }
    render({ _n: o }) {
      return `throw ${this.error};` + o;
    }
    get names() {
      return this.error.names;
    }
  }
  class P extends a {
    constructor(o) {
      super(), this.code = o;
    }
    render({ _n: o }) {
      return `${this.code};` + o;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(o, f) {
      return this.code = C(this.code, o, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class _ extends a {
    constructor(o = []) {
      super(), this.nodes = o;
    }
    render(o) {
      return this.nodes.reduce((f, b) => f + b.render(o), "");
    }
    optimizeNodes() {
      const { nodes: o } = this;
      let f = o.length;
      for (; f--; ) {
        const b = o[f].optimizeNodes();
        Array.isArray(b) ? o.splice(f, 1, ...b) : b ? o[f] = b : o.splice(f, 1);
      }
      return o.length > 0 ? this : void 0;
    }
    optimizeNames(o, f) {
      const { nodes: b } = this;
      let j = b.length;
      for (; j--; ) {
        const A = b[j];
        A.optimizeNames(o, f) || (k(o, A.names), b.splice(j, 1));
      }
      return b.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((o, f) => Q(o, f.names), {});
    }
  }
  class E extends _ {
    render(o) {
      return "{" + o._n + super.render(o) + "}" + o._n;
    }
  }
  class g extends _ {
  }
  class $ extends E {
  }
  $.kind = "else";
  class p extends E {
    constructor(o, f) {
      super(f), this.condition = o;
    }
    render(o) {
      let f = `if(${this.condition})` + super.render(o);
      return this.else && (f += "else " + this.else.render(o)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const o = this.condition;
      if (o === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const b = f.optimizeNodes();
        f = this.else = Array.isArray(b) ? new $(b) : b;
      }
      if (f)
        return o === !1 ? f instanceof p ? f : f.nodes : this.nodes.length ? this : new p(U(o), f instanceof p ? [f] : f.nodes);
      if (!(o === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(o, f) {
      var b;
      if (this.else = (b = this.else) === null || b === void 0 ? void 0 : b.optimizeNames(o, f), !!(super.optimizeNames(o, f) || this.else))
        return this.condition = C(this.condition, o, f), this;
    }
    get names() {
      const o = super.names;
      return de(o, this.condition), this.else && Q(o, this.else.names), o;
    }
  }
  p.kind = "if";
  class v extends E {
  }
  v.kind = "for";
  class N extends v {
    constructor(o) {
      super(), this.iteration = o;
    }
    render(o) {
      return `for(${this.iteration})` + super.render(o);
    }
    optimizeNames(o, f) {
      if (super.optimizeNames(o, f))
        return this.iteration = C(this.iteration, o, f), this;
    }
    get names() {
      return Q(super.names, this.iteration.names);
    }
  }
  class R extends v {
    constructor(o, f, b, j) {
      super(), this.varKind = o, this.name = f, this.from = b, this.to = j;
    }
    render(o) {
      const f = o.es5 ? r.varKinds.var : this.varKind, { name: b, from: j, to: A } = this;
      return `for(${f} ${b}=${j}; ${b}<${A}; ${b}++)` + super.render(o);
    }
    get names() {
      const o = de(super.names, this.from);
      return de(o, this.to);
    }
  }
  class I extends v {
    constructor(o, f, b, j) {
      super(), this.loop = o, this.varKind = f, this.name = b, this.iterable = j;
    }
    render(o) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(o);
    }
    optimizeNames(o, f) {
      if (super.optimizeNames(o, f))
        return this.iterable = C(this.iterable, o, f), this;
    }
    get names() {
      return Q(super.names, this.iterable.names);
    }
  }
  class z extends E {
    constructor(o, f, b) {
      super(), this.name = o, this.args = f, this.async = b;
    }
    render(o) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(o);
    }
  }
  z.kind = "func";
  class J extends _ {
    render(o) {
      return "return " + super.render(o);
    }
  }
  J.kind = "return";
  class ue extends E {
    render(o) {
      let f = "try" + super.render(o);
      return this.catch && (f += this.catch.render(o)), this.finally && (f += this.finally.render(o)), f;
    }
    optimizeNodes() {
      var o, f;
      return super.optimizeNodes(), (o = this.catch) === null || o === void 0 || o.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(o, f) {
      var b, j;
      return super.optimizeNames(o, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(o, f), (j = this.finally) === null || j === void 0 || j.optimizeNames(o, f), this;
    }
    get names() {
      const o = super.names;
      return this.catch && Q(o, this.catch.names), this.finally && Q(o, this.finally.names), o;
    }
  }
  class V extends E {
    constructor(o) {
      super(), this.error = o;
    }
    render(o) {
      return `catch(${this.error})` + super.render(o);
    }
  }
  V.kind = "catch";
  class H extends E {
    render(o) {
      return "finally" + super.render(o);
    }
  }
  H.kind = "finally";
  class ne {
    constructor(o, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = o, this._scope = new r.Scope({ parent: o }), this._nodes = [new g()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(o) {
      return this._scope.name(o);
    }
    // reserves unique name in the external scope
    scopeName(o) {
      return this._extScope.name(o);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(o, f) {
      const b = this._extScope.value(o, f);
      return (this._values[b.prefix] || (this._values[b.prefix] = /* @__PURE__ */ new Set())).add(b), b;
    }
    getScopeValue(o, f) {
      return this._extScope.getValue(o, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(o) {
      return this._extScope.scopeRefs(o, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(o, f, b, j) {
      const A = this._scope.toName(f);
      return b !== void 0 && j && (this._constants[A.str] = b), this._leafNode(new i(o, A, b)), A;
    }
    // `const` declaration (`var` in es5 mode)
    const(o, f, b) {
      return this._def(r.varKinds.const, o, f, b);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(o, f, b) {
      return this._def(r.varKinds.let, o, f, b);
    }
    // `var` declaration with optional assignment
    var(o, f, b) {
      return this._def(r.varKinds.var, o, f, b);
    }
    // assignment code
    assign(o, f, b) {
      return this._leafNode(new u(o, f, b));
    }
    // `+=` code
    add(o, f) {
      return this._leafNode(new c(o, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(o) {
      return typeof o == "function" ? o() : o !== t.nil && this._leafNode(new P(o)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...o) {
      const f = ["{"];
      for (const [b, j] of o)
        f.length > 1 && f.push(","), f.push(b), (b !== j || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, j));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(o, f, b) {
      if (this._blockNode(new p(o)), f && b)
        this.code(f).else().code(b).endIf();
      else if (f)
        this.code(f).endIf();
      else if (b)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(o) {
      return this._elseNode(new p(o));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new $());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(p, $);
    }
    _for(o, f) {
      return this._blockNode(o), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(o, f) {
      return this._for(new N(o), f);
    }
    // `for` statement for a range of values
    forRange(o, f, b, j, A = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const q = this._scope.toName(o);
      return this._for(new R(A, q, f, b), () => j(q));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(o, f, b, j = r.varKinds.const) {
      const A = this._scope.toName(o);
      if (this.opts.es5) {
        const q = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${q}.length`, (F) => {
          this.var(A, (0, t._)`${q}[${F}]`), b(A);
        });
      }
      return this._for(new I("of", j, A, f), () => b(A));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(o, f, b, j = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(o, (0, t._)`Object.keys(${f})`, b);
      const A = this._scope.toName(o);
      return this._for(new I("in", j, A, f), () => b(A));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(v);
    }
    // `label` statement
    label(o) {
      return this._leafNode(new d(o));
    }
    // `break` statement
    break(o) {
      return this._leafNode(new l(o));
    }
    // `return` statement
    return(o) {
      const f = new J();
      if (this._blockNode(f), this.code(o), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(J);
    }
    // `try` statement
    try(o, f, b) {
      if (!f && !b)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const j = new ue();
      if (this._blockNode(j), this.code(o), f) {
        const A = this.name("e");
        this._currNode = j.catch = new V(A), f(A);
      }
      return b && (this._currNode = j.finally = new H(), this.code(b)), this._endBlockNode(V, H);
    }
    // `throw` statement
    throw(o) {
      return this._leafNode(new h(o));
    }
    // start self-balancing block
    block(o, f) {
      return this._blockStarts.push(this._nodes.length), o && this.code(o).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(o) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const b = this._nodes.length - f;
      if (b < 0 || o !== void 0 && b !== o)
        throw new Error(`CodeGen: wrong number of nodes: ${b} vs ${o} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(o, f = t.nil, b, j) {
      return this._blockNode(new z(o, f, b)), j && this.code(j).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(z);
    }
    optimize(o = 1) {
      for (; o-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(o) {
      return this._currNode.nodes.push(o), this;
    }
    _blockNode(o) {
      this._currNode.nodes.push(o), this._nodes.push(o);
    }
    _endBlockNode(o, f) {
      const b = this._currNode;
      if (b instanceof o || f && b instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${o.kind}/${f.kind}` : o.kind}"`);
    }
    _elseNode(o) {
      const f = this._currNode;
      if (!(f instanceof p))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = o, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const o = this._nodes;
      return o[o.length - 1];
    }
    set _currNode(o) {
      const f = this._nodes;
      f[f.length - 1] = o;
    }
  }
  e.CodeGen = ne;
  function Q(y, o) {
    for (const f in o)
      y[f] = (y[f] || 0) + (o[f] || 0);
    return y;
  }
  function de(y, o) {
    return o instanceof t._CodeOrName ? Q(y, o.names) : y;
  }
  function C(y, o, f) {
    if (y instanceof t.Name)
      return b(y);
    if (!j(y))
      return y;
    return new t._Code(y._items.reduce((A, q) => (q instanceof t.Name && (q = b(q)), q instanceof t._Code ? A.push(...q._items) : A.push(q), A), []));
    function b(A) {
      const q = f[A.str];
      return q === void 0 || o[A.str] !== 1 ? A : (delete o[A.str], q);
    }
    function j(A) {
      return A instanceof t._Code && A._items.some((q) => q instanceof t.Name && o[q.str] === 1 && f[q.str] !== void 0);
    }
  }
  function k(y, o) {
    for (const f in o)
      y[f] = (y[f] || 0) - (o[f] || 0);
  }
  function U(y) {
    return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, t._)`!${S(y)}`;
  }
  e.not = U;
  const D = m(e.operators.AND);
  function O(...y) {
    return y.reduce(D);
  }
  e.and = O;
  const T = m(e.operators.OR);
  function w(...y) {
    return y.reduce(T);
  }
  e.or = w;
  function m(y) {
    return (o, f) => o === t.nil ? f : f === t.nil ? o : (0, t._)`${S(o)} ${y} ${S(f)}`;
  }
  function S(y) {
    return y instanceof t.Name ? y : (0, t._)`(${y})`;
  }
})(te);
var M = {};
Object.defineProperty(M, "__esModule", { value: !0 });
M.checkStrictMode = M.getErrorPath = M.Type = M.useFunc = M.setEvaluated = M.evaluatedPropsToName = M.mergeEvaluated = M.eachItem = M.unescapeJsonPointer = M.escapeJsonPointer = M.escapeFragment = M.unescapeFragment = M.schemaRefOrVal = M.schemaHasRulesButRef = M.schemaHasRules = M.checkUnknownRules = M.alwaysValidSchema = M.toHash = void 0;
const ie = te, Ad = Xr;
function kd(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
M.toHash = kd;
function Cd(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Fc(e, t), !Vc(t, e.self.RULES.all));
}
M.alwaysValidSchema = Cd;
function Fc(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || qc(e, `unknown keyword: "${a}"`);
}
M.checkUnknownRules = Fc;
function Vc(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
M.schemaHasRules = Vc;
function Dd(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
M.schemaHasRulesButRef = Dd;
function Md({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ie._)`${r}`;
  }
  return (0, ie._)`${e}${t}${(0, ie.getProperty)(n)}`;
}
M.schemaRefOrVal = Md;
function Ld(e) {
  return Uc(decodeURIComponent(e));
}
M.unescapeFragment = Ld;
function Fd(e) {
  return encodeURIComponent(da(e));
}
M.escapeFragment = Fd;
function da(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
M.escapeJsonPointer = da;
function Uc(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
M.unescapeJsonPointer = Uc;
function Vd(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
M.eachItem = Vd;
function ni({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, i, u) => {
    const c = i === void 0 ? a : i instanceof ie.Name ? (a instanceof ie.Name ? e(s, a, i) : t(s, a, i), i) : a instanceof ie.Name ? (t(s, i, a), a) : r(a, i);
    return u === ie.Name && !(c instanceof ie.Name) ? n(s, c) : c;
  };
}
M.mergeEvaluated = {
  props: ni({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ie._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ie._)`${r} || {}`).code((0, ie._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ie._)`${r} || {}`), fa(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: zc
  }),
  items: ni({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ie._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ie._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function zc(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ie._)`{}`);
  return t !== void 0 && fa(e, r, t), r;
}
M.evaluatedPropsToName = zc;
function fa(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ie._)`${t}${(0, ie.getProperty)(n)}`, !0));
}
M.setEvaluated = fa;
const si = {};
function Ud(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: si[t.code] || (si[t.code] = new Ad._Code(t.code))
  });
}
M.useFunc = Ud;
var Ds;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Ds || (M.Type = Ds = {}));
function zd(e, t, r) {
  if (e instanceof ie.Name) {
    const n = t === Ds.Num;
    return r ? n ? (0, ie._)`"[" + ${e} + "]"` : (0, ie._)`"['" + ${e} + "']"` : n ? (0, ie._)`"/" + ${e}` : (0, ie._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ie.getProperty)(e).toString() : "/" + da(e);
}
M.getErrorPath = zd;
function qc(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
M.checkStrictMode = qc;
var ct = {};
Object.defineProperty(ct, "__esModule", { value: !0 });
const Ne = te, qd = {
  // validation function arguments
  data: new Ne.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Ne.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Ne.Name("instancePath"),
  parentData: new Ne.Name("parentData"),
  parentDataProperty: new Ne.Name("parentDataProperty"),
  rootData: new Ne.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Ne.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Ne.Name("vErrors"),
  // null or array of validation errors
  errors: new Ne.Name("errors"),
  // counter of validation errors
  this: new Ne.Name("this"),
  // "globals"
  self: new Ne.Name("self"),
  scope: new Ne.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Ne.Name("json"),
  jsonPos: new Ne.Name("jsonPos"),
  jsonLen: new Ne.Name("jsonLen"),
  jsonPart: new Ne.Name("jsonPart")
};
ct.default = qd;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = te, r = M, n = ct;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: p }) => p ? (0, t.str)`"${$}" keyword must be ${p} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, p = e.keywordError, v, N) {
    const { it: R } = $, { gen: I, compositeRule: z, allErrors: J } = R, ue = h($, p, v);
    N ?? (z || J) ? c(I, ue) : d(R, (0, t._)`[${ue}]`);
  }
  e.reportError = s;
  function a($, p = e.keywordError, v) {
    const { it: N } = $, { gen: R, compositeRule: I, allErrors: z } = N, J = h($, p, v);
    c(R, J), I || z || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function i($, p) {
    $.assign(n.default.errors, p), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(p, () => $.assign((0, t._)`${n.default.vErrors}.length`, p), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = i;
  function u({ gen: $, keyword: p, schemaValue: v, data: N, errsCount: R, it: I }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const z = $.name("err");
    $.forRange("i", R, n.default.errors, (J) => {
      $.const(z, (0, t._)`${n.default.vErrors}[${J}]`), $.if((0, t._)`${z}.instancePath === undefined`, () => $.assign((0, t._)`${z}.instancePath`, (0, t.strConcat)(n.default.instancePath, I.errorPath))), $.assign((0, t._)`${z}.schemaPath`, (0, t.str)`${I.errSchemaPath}/${p}`), I.opts.verbose && ($.assign((0, t._)`${z}.schema`, v), $.assign((0, t._)`${z}.data`, N));
    });
  }
  e.extendErrors = u;
  function c($, p) {
    const v = $.const("err", p);
    $.if((0, t._)`${n.default.vErrors} === null`, () => $.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), $.code((0, t._)`${n.default.errors}++`);
  }
  function d($, p) {
    const { gen: v, validateName: N, schemaEnv: R } = $;
    R.$async ? v.throw((0, t._)`new ${$.ValidationError}(${p})`) : (v.assign((0, t._)`${N}.errors`, p), v.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h($, p, v) {
    const { createErrors: N } = $.it;
    return N === !1 ? (0, t._)`{}` : P($, p, v);
  }
  function P($, p, v = {}) {
    const { gen: N, it: R } = $, I = [
      _(R, v),
      E($, v)
    ];
    return g($, p, I), N.object(...I);
  }
  function _({ errorPath: $ }, { instancePath: p }) {
    const v = p ? (0, t.str)`${$}${(0, r.getErrorPath)(p, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function E({ keyword: $, it: { errSchemaPath: p } }, { schemaPath: v, parentSchema: N }) {
    let R = N ? p : (0, t.str)`${p}/${$}`;
    return v && (R = (0, t.str)`${R}${(0, r.getErrorPath)(v, r.Type.Str)}`), [l.schemaPath, R];
  }
  function g($, { params: p, message: v }, N) {
    const { keyword: R, data: I, schemaValue: z, it: J } = $, { opts: ue, propertyName: V, topSchemaRef: H, schemaPath: ne } = J;
    N.push([l.keyword, R], [l.params, typeof p == "function" ? p($) : p || (0, t._)`{}`]), ue.messages && N.push([l.message, typeof v == "function" ? v($) : v]), ue.verbose && N.push([l.schema, z], [l.parentSchema, (0, t._)`${H}${ne}`], [n.default.data, I]), V && N.push([l.propertyName, V]);
  }
})(Qr);
Object.defineProperty(yr, "__esModule", { value: !0 });
yr.boolOrEmptySchema = yr.topBoolOrEmptySchema = void 0;
const Kd = Qr, Gd = te, Hd = ct, Jd = {
  message: "boolean schema is false"
};
function Wd(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Kc(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Hd.default.data) : (t.assign((0, Gd._)`${n}.errors`, null), t.return(!0));
}
yr.topBoolOrEmptySchema = Wd;
function Bd(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Kc(e)) : r.var(t, !0);
}
yr.boolOrEmptySchema = Bd;
function Kc(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, Kd.reportError)(s, Jd, void 0, t);
}
var $e = {}, Yt = {};
Object.defineProperty(Yt, "__esModule", { value: !0 });
Yt.getRules = Yt.isJSONType = void 0;
const Xd = ["string", "number", "integer", "boolean", "null", "object", "array"], Yd = new Set(Xd);
function Qd(e) {
  return typeof e == "string" && Yd.has(e);
}
Yt.isJSONType = Qd;
function Zd() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
Yt.getRules = Zd;
var ut = {};
Object.defineProperty(ut, "__esModule", { value: !0 });
ut.shouldUseRule = ut.shouldUseGroup = ut.schemaHasRulesForType = void 0;
function xd({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Gc(e, n);
}
ut.schemaHasRulesForType = xd;
function Gc(e, t) {
  return t.rules.some((r) => Hc(e, r));
}
ut.shouldUseGroup = Gc;
function Hc(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
ut.shouldUseRule = Hc;
Object.defineProperty($e, "__esModule", { value: !0 });
$e.reportTypeError = $e.checkDataTypes = $e.checkDataType = $e.coerceAndCheckDataType = $e.getJSONTypes = $e.getSchemaTypes = $e.DataType = void 0;
const ef = Yt, tf = ut, rf = Qr, X = te, Jc = M;
var ur;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(ur || ($e.DataType = ur = {}));
function nf(e) {
  const t = Wc(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
$e.getSchemaTypes = nf;
function Wc(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(ef.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
$e.getJSONTypes = Wc;
function sf(e, t) {
  const { gen: r, data: n, opts: s } = e, a = af(t, s.coerceTypes), i = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, tf.schemaHasRulesForType)(e, t[0]));
  if (i) {
    const u = ha(t, n, s.strictNumbers, ur.Wrong);
    r.if(u, () => {
      a.length ? of(e, t, a) : pa(e);
    });
  }
  return i;
}
$e.coerceAndCheckDataType = sf;
const Bc = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function af(e, t) {
  return t ? e.filter((r) => Bc.has(r) || t === "array" && r === "array") : [];
}
function of(e, t, r) {
  const { gen: n, data: s, opts: a } = e, i = n.let("dataType", (0, X._)`typeof ${s}`), u = n.let("coerced", (0, X._)`undefined`);
  a.coerceTypes === "array" && n.if((0, X._)`${i} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, X._)`${s}[0]`).assign(i, (0, X._)`typeof ${s}`).if(ha(t, s, a.strictNumbers), () => n.assign(u, s))), n.if((0, X._)`${u} !== undefined`);
  for (const d of r)
    (Bc.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), pa(e), n.endIf(), n.if((0, X._)`${u} !== undefined`, () => {
    n.assign(s, u), cf(e, u);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, X._)`${i} == "number" || ${i} == "boolean"`).assign(u, (0, X._)`"" + ${s}`).elseIf((0, X._)`${s} === null`).assign(u, (0, X._)`""`);
        return;
      case "number":
        n.elseIf((0, X._)`${i} == "boolean" || ${s} === null
              || (${i} == "string" && ${s} && ${s} == +${s})`).assign(u, (0, X._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, X._)`${i} === "boolean" || ${s} === null
              || (${i} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(u, (0, X._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, X._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(u, !1).elseIf((0, X._)`${s} === "true" || ${s} === 1`).assign(u, !0);
        return;
      case "null":
        n.elseIf((0, X._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(u, null);
        return;
      case "array":
        n.elseIf((0, X._)`${i} === "string" || ${i} === "number"
              || ${i} === "boolean" || ${s} === null`).assign(u, (0, X._)`[${s}]`);
    }
  }
}
function cf({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, X._)`${t} !== undefined`, () => e.assign((0, X._)`${t}[${r}]`, n));
}
function Ms(e, t, r, n = ur.Correct) {
  const s = n === ur.Correct ? X.operators.EQ : X.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, X._)`${t} ${s} null`;
    case "array":
      a = (0, X._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, X._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = i((0, X._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = i();
      break;
    default:
      return (0, X._)`typeof ${t} ${s} ${e}`;
  }
  return n === ur.Correct ? a : (0, X.not)(a);
  function i(u = X.nil) {
    return (0, X.and)((0, X._)`typeof ${t} == "number"`, u, r ? (0, X._)`isFinite(${t})` : X.nil);
  }
}
$e.checkDataType = Ms;
function ha(e, t, r, n) {
  if (e.length === 1)
    return Ms(e[0], t, r, n);
  let s;
  const a = (0, Jc.toHash)(e);
  if (a.array && a.object) {
    const i = (0, X._)`typeof ${t} != "object"`;
    s = a.null ? i : (0, X._)`!${t} || ${i}`, delete a.null, delete a.array, delete a.object;
  } else
    s = X.nil;
  a.number && delete a.integer;
  for (const i in a)
    s = (0, X.and)(s, Ms(i, t, r, n));
  return s;
}
$e.checkDataTypes = ha;
const lf = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, X._)`{type: ${e}}` : (0, X._)`{type: ${t}}`
};
function pa(e) {
  const t = uf(e);
  (0, rf.reportError)(t, lf);
}
$e.reportTypeError = pa;
function uf(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Jc.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var Bn = {};
Object.defineProperty(Bn, "__esModule", { value: !0 });
Bn.assignDefaults = void 0;
const er = te, df = M;
function ff(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      ai(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => ai(e, a, s.default));
}
Bn.assignDefaults = ff;
function ai(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: i } = e;
  if (r === void 0)
    return;
  const u = (0, er._)`${a}${(0, er.getProperty)(t)}`;
  if (s) {
    (0, df.checkStrictMode)(e, `default is ignored for: ${u}`);
    return;
  }
  let c = (0, er._)`${u} === undefined`;
  i.useDefaults === "empty" && (c = (0, er._)`${c} || ${u} === null || ${u} === ""`), n.if(c, (0, er._)`${u} = ${(0, er.stringify)(r)}`);
}
var at = {}, x = {};
Object.defineProperty(x, "__esModule", { value: !0 });
x.validateUnion = x.validateArray = x.usePattern = x.callValidateCode = x.schemaProperties = x.allSchemaProperties = x.noPropertyInData = x.propertyInData = x.isOwnProperty = x.hasPropFunc = x.reportMissingProp = x.checkMissingProp = x.checkReportMissingProp = void 0;
const fe = te, ma = M, mt = ct, hf = M;
function pf(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if($a(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, fe._)`${t}` }, !0), e.error();
  });
}
x.checkReportMissingProp = pf;
function mf({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, fe.or)(...n.map((a) => (0, fe.and)($a(e, t, a, r.ownProperties), (0, fe._)`${s} = ${a}`)));
}
x.checkMissingProp = mf;
function yf(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
x.reportMissingProp = yf;
function Xc(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, fe._)`Object.prototype.hasOwnProperty`
  });
}
x.hasPropFunc = Xc;
function ya(e, t, r) {
  return (0, fe._)`${Xc(e)}.call(${t}, ${r})`;
}
x.isOwnProperty = ya;
function $f(e, t, r, n) {
  const s = (0, fe._)`${t}${(0, fe.getProperty)(r)} !== undefined`;
  return n ? (0, fe._)`${s} && ${ya(e, t, r)}` : s;
}
x.propertyInData = $f;
function $a(e, t, r, n) {
  const s = (0, fe._)`${t}${(0, fe.getProperty)(r)} === undefined`;
  return n ? (0, fe.or)(s, (0, fe.not)(ya(e, t, r))) : s;
}
x.noPropertyInData = $a;
function Yc(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
x.allSchemaProperties = Yc;
function _f(e, t) {
  return Yc(t).filter((r) => !(0, ma.alwaysValidSchema)(e, t[r]));
}
x.schemaProperties = _f;
function gf({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: i }, u, c, d) {
  const l = d ? (0, fe._)`${e}, ${t}, ${n}${s}` : t, h = [
    [mt.default.instancePath, (0, fe.strConcat)(mt.default.instancePath, a)],
    [mt.default.parentData, i.parentData],
    [mt.default.parentDataProperty, i.parentDataProperty],
    [mt.default.rootData, mt.default.rootData]
  ];
  i.opts.dynamicRef && h.push([mt.default.dynamicAnchors, mt.default.dynamicAnchors]);
  const P = (0, fe._)`${l}, ${r.object(...h)}`;
  return c !== fe.nil ? (0, fe._)`${u}.call(${c}, ${P})` : (0, fe._)`${u}(${P})`;
}
x.callValidateCode = gf;
const vf = (0, fe._)`new RegExp`;
function wf({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, fe._)`${s.code === "new RegExp" ? vf : (0, hf.useFunc)(e, s)}(${r}, ${n})`
  });
}
x.usePattern = wf;
function Ef(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const u = t.let("valid", !0);
    return i(() => t.assign(u, !1)), u;
  }
  return t.var(a, !0), i(() => t.break()), a;
  function i(u) {
    const c = t.const("len", (0, fe._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: ma.Type.Num
      }, a), t.if((0, fe.not)(a), u);
    });
  }
}
x.validateArray = Ef;
function Sf(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, ma.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const i = t.let("valid", !1), u = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, u);
    t.assign(i, (0, fe._)`${i} || ${u}`), e.mergeValidEvaluated(l, u) || t.if((0, fe.not)(i));
  })), e.result(i, () => e.reset(), () => e.error(!0));
}
x.validateUnion = Sf;
Object.defineProperty(at, "__esModule", { value: !0 });
at.validateKeywordUsage = at.validSchemaType = at.funcKeywordCode = at.macroKeywordCode = void 0;
const Ie = te, Gt = ct, bf = x, Pf = Qr;
function Nf(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: i } = e, u = t.macro.call(i.self, s, a, i), c = Qc(r, n, u);
  i.opts.validateSchema !== !1 && i.self.validateSchema(u, !0);
  const d = r.name("valid");
  e.subschema({
    schema: u,
    schemaPath: Ie.nil,
    errSchemaPath: `${i.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
at.macroKeywordCode = Nf;
function Of(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: i, $data: u, it: c } = e;
  Tf(c, t);
  const d = !u && t.compile ? t.compile.call(c.self, a, i, c) : t.validate, l = Qc(n, s, d), h = n.let("valid");
  e.block$data(h, P), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function P() {
    if (t.errors === !1)
      g(), t.modifying && oi(e), $(() => e.error());
    else {
      const p = t.async ? _() : E();
      t.modifying && oi(e), $(() => Rf(e, p));
    }
  }
  function _() {
    const p = n.let("ruleErrs", null);
    return n.try(() => g((0, Ie._)`await `), (v) => n.assign(h, !1).if((0, Ie._)`${v} instanceof ${c.ValidationError}`, () => n.assign(p, (0, Ie._)`${v}.errors`), () => n.throw(v))), p;
  }
  function E() {
    const p = (0, Ie._)`${l}.errors`;
    return n.assign(p, null), g(Ie.nil), p;
  }
  function g(p = t.async ? (0, Ie._)`await ` : Ie.nil) {
    const v = c.opts.passContext ? Gt.default.this : Gt.default.self, N = !("compile" in t && !u || t.schema === !1);
    n.assign(h, (0, Ie._)`${p}${(0, bf.callValidateCode)(e, l, v, N)}`, t.modifying);
  }
  function $(p) {
    var v;
    n.if((0, Ie.not)((v = t.valid) !== null && v !== void 0 ? v : h), p);
  }
}
at.funcKeywordCode = Of;
function oi(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Ie._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Rf(e, t) {
  const { gen: r } = e;
  r.if((0, Ie._)`Array.isArray(${t})`, () => {
    r.assign(Gt.default.vErrors, (0, Ie._)`${Gt.default.vErrors} === null ? ${t} : ${Gt.default.vErrors}.concat(${t})`).assign(Gt.default.errors, (0, Ie._)`${Gt.default.vErrors}.length`), (0, Pf.extendErrors)(e);
  }, () => e.error());
}
function Tf({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Qc(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ie.stringify)(r) });
}
function If(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
at.validSchemaType = If;
function jf({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const i = s.dependencies;
  if (i != null && i.some((u) => !Object.prototype.hasOwnProperty.call(e, u)))
    throw new Error(`parent schema must have dependencies of ${a}: ${i.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
at.validateKeywordUsage = jf;
var bt = {};
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.extendSubschemaMode = bt.extendSubschemaData = bt.getSubschema = void 0;
const rt = te, Zc = M;
function Af(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: i }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const u = e.schema[t];
    return r === void 0 ? {
      schema: u,
      schemaPath: (0, rt._)`${e.schemaPath}${(0, rt.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: u[r],
      schemaPath: (0, rt._)`${e.schemaPath}${(0, rt.getProperty)(t)}${(0, rt.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Zc.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || i === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: i,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
bt.getSubschema = Af;
function kf(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: i }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: u } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: h } = t, P = u.let("data", (0, rt._)`${t.data}${(0, rt.getProperty)(r)}`, !0);
    c(P), e.errorPath = (0, rt.str)`${d}${(0, Zc.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, rt._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof rt.Name ? s : u.let("data", s, !0);
    c(d), i !== void 0 && (e.propertyName = i);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
bt.extendSubschemaData = kf;
function Cf(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
bt.extendSubschemaMode = Cf;
var Se = {}, Xn = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, s, a;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (s = n; s-- !== 0; )
        if (!e(t[s], r[s])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (a = Object.keys(t), n = a.length, n !== Object.keys(r).length) return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, a[s])) return !1;
    for (s = n; s-- !== 0; ) {
      var i = a[s];
      if (!e(t[i], r[i])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, xc = { exports: {} }, Et = xc.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Nn(t, n, s, e, "", e);
};
Et.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Et.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Et.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Et.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Nn(e, t, r, n, s, a, i, u, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, i, u, c, d);
    for (var l in n) {
      var h = n[l];
      if (Array.isArray(h)) {
        if (l in Et.arrayKeywords)
          for (var P = 0; P < h.length; P++)
            Nn(e, t, r, h[P], s + "/" + l + "/" + P, a, s, l, n, P);
      } else if (l in Et.propsKeywords) {
        if (h && typeof h == "object")
          for (var _ in h)
            Nn(e, t, r, h[_], s + "/" + l + "/" + Df(_), a, s, l, n, _);
      } else (l in Et.keywords || e.allKeys && !(l in Et.skipKeywords)) && Nn(e, t, r, h, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, i, u, c, d);
  }
}
function Df(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Mf = xc.exports;
Object.defineProperty(Se, "__esModule", { value: !0 });
Se.getSchemaRefs = Se.resolveUrl = Se.normalizeId = Se._getFullPath = Se.getFullPath = Se.inlineRef = void 0;
const Lf = M, Ff = Xn, Vf = Mf, Uf = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function zf(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Ls(e) : t ? el(e) <= t : !1;
}
Se.inlineRef = zf;
const qf = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Ls(e) {
  for (const t in e) {
    if (qf.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Ls) || typeof r == "object" && Ls(r))
      return !0;
  }
  return !1;
}
function el(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Uf.has(r) && (typeof e[r] == "object" && (0, Lf.eachItem)(e[r], (n) => t += el(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function tl(e, t = "", r) {
  r !== !1 && (t = dr(t));
  const n = e.parse(t);
  return rl(e, n);
}
Se.getFullPath = tl;
function rl(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Se._getFullPath = rl;
const Kf = /#\/?$/;
function dr(e) {
  return e ? e.replace(Kf, "") : "";
}
Se.normalizeId = dr;
function Gf(e, t, r) {
  return r = dr(r), e.resolve(t, r);
}
Se.resolveUrl = Gf;
const Hf = /^[a-z_][-a-z0-9._]*$/i;
function Jf(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = dr(e[r] || t), a = { "": s }, i = tl(n, s, !1), u = {}, c = /* @__PURE__ */ new Set();
  return Vf(e, { allKeys: !0 }, (h, P, _, E) => {
    if (E === void 0)
      return;
    const g = i + P;
    let $ = a[E];
    typeof h[r] == "string" && ($ = p.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), a[P] = $;
    function p(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = dr($ ? R($, N) : N), c.has(N))
        throw l(N);
      c.add(N);
      let I = this.refs[N];
      return typeof I == "string" && (I = this.refs[I]), typeof I == "object" ? d(h, I.schema, N) : N !== dr(g) && (N[0] === "#" ? (d(h, u[N], N), u[N] = h) : this.refs[N] = g), N;
    }
    function v(N) {
      if (typeof N == "string") {
        if (!Hf.test(N))
          throw new Error(`invalid anchor "${N}"`);
        p.call(this, `#${N}`);
      }
    }
  }), u;
  function d(h, P, _) {
    if (P !== void 0 && !Ff(h, P))
      throw l(_);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Se.getSchemaRefs = Jf;
Object.defineProperty(Qe, "__esModule", { value: !0 });
Qe.getData = Qe.KeywordCxt = Qe.validateFunctionCode = void 0;
const nl = yr, ii = $e, _a = ut, Ln = $e, Wf = Bn, Fr = at, hs = bt, K = te, W = ct, Bf = Se, dt = M, Ir = Qr;
function Xf(e) {
  if (ol(e) && (il(e), al(e))) {
    Zf(e);
    return;
  }
  sl(e, () => (0, nl.topBoolOrEmptySchema)(e));
}
Qe.validateFunctionCode = Xf;
function sl({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, K._)`${W.default.data}, ${W.default.valCxt}`, n.$async, () => {
    e.code((0, K._)`"use strict"; ${ci(r, s)}`), Qf(e, s), e.code(a);
  }) : e.func(t, (0, K._)`${W.default.data}, ${Yf(s)}`, n.$async, () => e.code(ci(r, s)).code(a));
}
function Yf(e) {
  return (0, K._)`{${W.default.instancePath}="", ${W.default.parentData}, ${W.default.parentDataProperty}, ${W.default.rootData}=${W.default.data}${e.dynamicRef ? (0, K._)`, ${W.default.dynamicAnchors}={}` : K.nil}}={}`;
}
function Qf(e, t) {
  e.if(W.default.valCxt, () => {
    e.var(W.default.instancePath, (0, K._)`${W.default.valCxt}.${W.default.instancePath}`), e.var(W.default.parentData, (0, K._)`${W.default.valCxt}.${W.default.parentData}`), e.var(W.default.parentDataProperty, (0, K._)`${W.default.valCxt}.${W.default.parentDataProperty}`), e.var(W.default.rootData, (0, K._)`${W.default.valCxt}.${W.default.rootData}`), t.dynamicRef && e.var(W.default.dynamicAnchors, (0, K._)`${W.default.valCxt}.${W.default.dynamicAnchors}`);
  }, () => {
    e.var(W.default.instancePath, (0, K._)`""`), e.var(W.default.parentData, (0, K._)`undefined`), e.var(W.default.parentDataProperty, (0, K._)`undefined`), e.var(W.default.rootData, W.default.data), t.dynamicRef && e.var(W.default.dynamicAnchors, (0, K._)`{}`);
  });
}
function Zf(e) {
  const { schema: t, opts: r, gen: n } = e;
  sl(e, () => {
    r.$comment && t.$comment && ll(e), nh(e), n.let(W.default.vErrors, null), n.let(W.default.errors, 0), r.unevaluated && xf(e), cl(e), oh(e);
  });
}
function xf(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, K._)`${r}.evaluated`), t.if((0, K._)`${e.evaluated}.dynamicProps`, () => t.assign((0, K._)`${e.evaluated}.props`, (0, K._)`undefined`)), t.if((0, K._)`${e.evaluated}.dynamicItems`, () => t.assign((0, K._)`${e.evaluated}.items`, (0, K._)`undefined`));
}
function ci(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, K._)`/*# sourceURL=${r} */` : K.nil;
}
function eh(e, t) {
  if (ol(e) && (il(e), al(e))) {
    th(e, t);
    return;
  }
  (0, nl.boolOrEmptySchema)(e, t);
}
function al({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function ol(e) {
  return typeof e.schema != "boolean";
}
function th(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && ll(e), sh(e), ah(e);
  const a = n.const("_errs", W.default.errors);
  cl(e, a), n.var(t, (0, K._)`${a} === ${W.default.errors}`);
}
function il(e) {
  (0, dt.checkUnknownRules)(e), rh(e);
}
function cl(e, t) {
  if (e.opts.jtd)
    return li(e, [], !1, t);
  const r = (0, ii.getSchemaTypes)(e.schema), n = (0, ii.coerceAndCheckDataType)(e, r);
  li(e, r, !n, t);
}
function rh(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, dt.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function nh(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, dt.checkStrictMode)(e, "default is ignored in the schema root");
}
function sh(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Bf.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function ah(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function ll({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, K._)`${W.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const i = (0, K.str)`${n}/$comment`, u = e.scopeValue("root", { ref: t.root });
    e.code((0, K._)`${W.default.self}.opts.$comment(${a}, ${i}, ${u}.schema)`);
  }
}
function oh(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, K._)`${W.default.errors} === 0`, () => t.return(W.default.data), () => t.throw((0, K._)`new ${s}(${W.default.vErrors})`)) : (t.assign((0, K._)`${n}.errors`, W.default.vErrors), a.unevaluated && ih(e), t.return((0, K._)`${W.default.errors} === 0`));
}
function ih({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof K.Name && e.assign((0, K._)`${t}.props`, r), n instanceof K.Name && e.assign((0, K._)`${t}.items`, n);
}
function li(e, t, r, n) {
  const { gen: s, schema: a, data: i, allErrors: u, opts: c, self: d } = e, { RULES: l } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, dt.schemaHasRulesButRef)(a, l))) {
    s.block(() => fl(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || ch(e, t), s.block(() => {
    for (const P of l.rules)
      h(P);
    h(l.post);
  });
  function h(P) {
    (0, _a.shouldUseGroup)(a, P) && (P.type ? (s.if((0, Ln.checkDataType)(P.type, i, c.strictNumbers)), ui(e, P), t.length === 1 && t[0] === P.type && r && (s.else(), (0, Ln.reportTypeError)(e)), s.endIf()) : ui(e, P), u || s.if((0, K._)`${W.default.errors} === ${n || 0}`));
  }
}
function ui(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Wf.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, _a.shouldUseRule)(n, a) && fl(e, a.keyword, a.definition, t.type);
  });
}
function ch(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (lh(e, t), e.opts.allowUnionTypes || uh(e, t), dh(e, e.dataTypes));
}
function lh(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      ul(e.dataTypes, r) || ga(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), hh(e, t);
  }
}
function uh(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && ga(e, "use allowUnionTypes to allow union type keyword");
}
function dh(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, _a.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((i) => fh(t, i)) && ga(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function fh(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function ul(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function hh(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    ul(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function ga(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, dt.checkStrictMode)(e, t, e.opts.strictTypes);
}
let dl = class {
  constructor(t, r, n) {
    if ((0, Fr.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, dt.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", hl(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Fr.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", W.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, K.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, K.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, K._)`${r} !== undefined && (${(0, K.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Ir.reportExtraError : Ir.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Ir.reportError)(this, this.def.$dataError || Ir.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Ir.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = K.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = K.nil, r = K.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: i } = this;
    n.if((0, K.or)((0, K._)`${s} === undefined`, r)), t !== K.nil && n.assign(t, !0), (a.length || i.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== K.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, K.or)(i(), u());
    function i() {
      if (n.length) {
        if (!(r instanceof K.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, K._)`${(0, Ln.checkDataTypes)(c, r, a.opts.strictNumbers, Ln.DataType.Wrong)}`;
      }
      return K.nil;
    }
    function u() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, K._)`!${c}(${r})`;
      }
      return K.nil;
    }
  }
  subschema(t, r) {
    const n = (0, hs.getSubschema)(this.it, t);
    (0, hs.extendSubschemaData)(n, this.it, t), (0, hs.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return eh(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = dt.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = dt.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, K.Name)), !0;
  }
};
Qe.KeywordCxt = dl;
function fl(e, t, r, n) {
  const s = new dl(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Fr.funcKeywordCode)(s, r) : "macro" in r ? (0, Fr.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Fr.funcKeywordCode)(s, r);
}
const ph = /^\/(?:[^~]|~0|~1)*$/, mh = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function hl(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return W.default.rootData;
  if (e[0] === "/") {
    if (!ph.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = W.default.rootData;
  } else {
    const d = mh.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +d[1];
    if (s = d[2], s === "#") {
      if (l >= t)
        throw new Error(c("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(c("data", l));
    if (a = r[t - l], !s)
      return a;
  }
  let i = a;
  const u = s.split("/");
  for (const d of u)
    d && (a = (0, K._)`${a}${(0, K.getProperty)((0, dt.unescapeJsonPointer)(d))}`, i = (0, K._)`${i} && ${a}`);
  return i;
  function c(d, l) {
    return `Cannot access ${d} ${l} levels up, current level is ${t}`;
  }
}
Qe.getData = hl;
var Zr = {};
Object.defineProperty(Zr, "__esModule", { value: !0 });
let yh = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
Zr.default = yh;
var vr = {};
Object.defineProperty(vr, "__esModule", { value: !0 });
const ps = Se;
let $h = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, ps.resolveUrl)(t, r, n), this.missingSchema = (0, ps.normalizeId)((0, ps.getFullPath)(t, this.missingRef));
  }
};
vr.default = $h;
var Me = {};
Object.defineProperty(Me, "__esModule", { value: !0 });
Me.resolveSchema = Me.getCompilingSchema = Me.resolveRef = Me.compileSchema = Me.SchemaEnv = void 0;
const He = te, _h = Zr, zt = ct, Xe = Se, di = M, gh = Qe;
let Yn = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Xe.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
Me.SchemaEnv = Yn;
function va(e) {
  const t = pl.call(this, e);
  if (t)
    return t;
  const r = (0, Xe.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, i = new He.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let u;
  e.$async && (u = i.scopeValue("Error", {
    ref: _h.default,
    code: (0, He._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = i.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: i,
    allErrors: this.opts.allErrors,
    data: zt.default.data,
    parentData: zt.default.parentData,
    parentDataProperty: zt.default.parentDataProperty,
    dataNames: [zt.default.data],
    dataPathArr: [He.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: i.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, He.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: u,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: He.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, He._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, gh.validateFunctionCode)(d), i.optimize(this.opts.code.optimize);
    const h = i.toString();
    l = `${i.scopeRefs(zt.default.scope)}return ${h}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const _ = new Function(`${zt.default.self}`, `${zt.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: _ }), _.errors = null, _.schema = e.schema, _.schemaEnv = e, e.$async && (_.$async = !0), this.opts.code.source === !0 && (_.source = { validateName: c, validateCode: h, scopeValues: i._values }), this.opts.unevaluated) {
      const { props: E, items: g } = d;
      _.evaluated = {
        props: E instanceof He.Name ? void 0 : E,
        items: g instanceof He.Name ? void 0 : g,
        dynamicProps: E instanceof He.Name,
        dynamicItems: g instanceof He.Name
      }, _.source && (_.source.evaluated = (0, He.stringify)(_.evaluated));
    }
    return e.validate = _, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), h;
  } finally {
    this._compilations.delete(e);
  }
}
Me.compileSchema = va;
function vh(e, t, r) {
  var n;
  r = (0, Xe.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = Sh.call(this, e, r);
  if (a === void 0) {
    const i = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: u } = this.opts;
    i && (a = new Yn({ schema: i, schemaId: u, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = wh.call(this, a);
}
Me.resolveRef = vh;
function wh(e) {
  return (0, Xe.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : va.call(this, e);
}
function pl(e) {
  for (const t of this._compilations)
    if (Eh(t, e))
      return t;
}
Me.getCompilingSchema = pl;
function Eh(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Sh(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Qn.call(this, e, t);
}
function Qn(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Xe._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Xe.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return ms.call(this, r, e);
  const a = (0, Xe.normalizeId)(n), i = this.refs[a] || this.schemas[a];
  if (typeof i == "string") {
    const u = Qn.call(this, e, i);
    return typeof (u == null ? void 0 : u.schema) != "object" ? void 0 : ms.call(this, r, u);
  }
  if (typeof (i == null ? void 0 : i.schema) == "object") {
    if (i.validate || va.call(this, i), a === (0, Xe.normalizeId)(t)) {
      const { schema: u } = i, { schemaId: c } = this.opts, d = u[c];
      return d && (s = (0, Xe.resolveUrl)(this.opts.uriResolver, s, d)), new Yn({ schema: u, schemaId: c, root: e, baseId: s });
    }
    return ms.call(this, r, i);
  }
}
Me.resolveSchema = Qn;
const bh = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function ms(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const u of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, di.unescapeFragment)(u)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !bh.has(u) && d && (t = (0, Xe.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, di.schemaHasRulesButRef)(r, this.RULES)) {
    const u = (0, Xe.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = Qn.call(this, n, u);
  }
  const { schemaId: i } = this.opts;
  if (a = a || new Yn({ schema: r, schemaId: i, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const Ph = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Nh = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Oh = "object", Rh = [
  "$data"
], Th = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, Ih = !1, jh = {
  $id: Ph,
  description: Nh,
  type: Oh,
  required: Rh,
  properties: Th,
  additionalProperties: Ih
};
var wa = {}, Zn = { exports: {} };
const Ah = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), ml = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function yl(e) {
  let t = "", r = 0, n = 0;
  for (n = 0; n < e.length; n++)
    if (r = e[n].charCodeAt(0), r !== 48) {
      if (!(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
        return "";
      t += e[n];
      break;
    }
  for (n += 1; n < e.length; n++) {
    if (r = e[n].charCodeAt(0), !(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
      return "";
    t += e[n];
  }
  return t;
}
const kh = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function fi(e) {
  return e.length = 0, !0;
}
function Ch(e, t, r) {
  if (e.length) {
    const n = yl(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function Dh(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, i = !1, u = Ch;
  for (let c = 0; c < e.length; c++) {
    const d = e[c];
    if (!(d === "[" || d === "]"))
      if (d === ":") {
        if (a === !0 && (i = !0), !u(s, n, r))
          break;
        if (++t > 7) {
          r.error = !0;
          break;
        }
        c > 0 && e[c - 1] === ":" && (a = !0), n.push(":");
        continue;
      } else if (d === "%") {
        if (!u(s, n, r))
          break;
        u = fi;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (u === fi ? r.zone = s.join("") : i ? n.push(s.join("")) : n.push(yl(s))), r.address = n.join(""), r;
}
function $l(e) {
  if (Mh(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = Dh(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function Mh(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function Lh(e) {
  let t = e;
  const r = [];
  let n = -1, s = 0;
  for (; s = t.length; ) {
    if (s === 1) {
      if (t === ".")
        break;
      if (t === "/") {
        r.push("/");
        break;
      } else {
        r.push(t);
        break;
      }
    } else if (s === 2) {
      if (t[0] === ".") {
        if (t[1] === ".")
          break;
        if (t[1] === "/") {
          t = t.slice(2);
          continue;
        }
      } else if (t[0] === "/" && (t[1] === "." || t[1] === "/")) {
        r.push("/");
        break;
      }
    } else if (s === 3 && t === "/..") {
      r.length !== 0 && r.pop(), r.push("/");
      break;
    }
    if (t[0] === ".") {
      if (t[1] === ".") {
        if (t[2] === "/") {
          t = t.slice(3);
          continue;
        }
      } else if (t[1] === "/") {
        t = t.slice(2);
        continue;
      }
    } else if (t[0] === "/" && t[1] === ".") {
      if (t[2] === "/") {
        t = t.slice(2);
        continue;
      } else if (t[2] === "." && t[3] === "/") {
        t = t.slice(3), r.length !== 0 && r.pop();
        continue;
      }
    }
    if ((n = t.indexOf("/", 1)) === -1) {
      r.push(t);
      break;
    } else
      r.push(t.slice(0, n)), t = t.slice(n);
  }
  return r.join("");
}
function Fh(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function Vh(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!ml(r)) {
      const n = $l(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var _l = {
  nonSimpleDomain: kh,
  recomposeAuthority: Vh,
  normalizeComponentEncoding: Fh,
  removeDotSegments: Lh,
  isIPv4: ml,
  isUUID: Ah,
  normalizeIPv6: $l
};
const { isUUID: Uh } = _l, zh = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function gl(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function vl(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function wl(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function qh(e) {
  return e.secure = gl(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function Kh(e) {
  if ((e.port === (gl(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function Gh(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(zh);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = Ea(s);
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function Hh(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = Ea(s);
  a && (e = a.serialize(e, t));
  const i = e, u = e.nss;
  return i.path = `${n || t.nid}:${u}`, t.skipEscape = !0, i;
}
function Jh(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !Uh(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function Wh(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const El = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: vl,
    serialize: wl
  }
), Bh = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: El.domainHost,
    parse: vl,
    serialize: wl
  }
), On = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: qh,
    serialize: Kh
  }
), Xh = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: On.domainHost,
    parse: On.parse,
    serialize: On.serialize
  }
), Yh = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: Gh,
    serialize: Hh,
    skipNormalize: !0
  }
), Qh = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: Jh,
    serialize: Wh,
    skipNormalize: !0
  }
), Fn = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: El,
    https: Bh,
    ws: On,
    wss: Xh,
    urn: Yh,
    "urn:uuid": Qh
  }
);
Object.setPrototypeOf(Fn, null);
function Ea(e) {
  return e && (Fn[
    /** @type {SchemeName} */
    e
  ] || Fn[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var Zh = {
  SCHEMES: Fn,
  getSchemeHandler: Ea
};
const { normalizeIPv6: xh, removeDotSegments: Dr, recomposeAuthority: ep, normalizeComponentEncoding: cn, isIPv4: tp, nonSimpleDomain: rp } = _l, { SCHEMES: np, getSchemeHandler: Sl } = Zh;
function sp(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  ot(pt(e, t), t) : typeof e == "object" && (e = /** @type {T} */
  pt(ot(e, t), t)), e;
}
function ap(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = bl(pt(e, n), pt(t, n), n, !0);
  return n.skipEscape = !0, ot(s, n);
}
function bl(e, t, r, n) {
  const s = {};
  return n || (e = pt(ot(e, r), r), t = pt(ot(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Dr(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Dr(t.path || ""), s.query = t.query) : (t.path ? (t.path[0] === "/" ? s.path = Dr(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = Dr(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function op(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = ot(cn(pt(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = ot(cn(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = ot(cn(pt(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = ot(cn(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function ot(e, t) {
  const r = {
    host: e.host,
    scheme: e.scheme,
    userinfo: e.userinfo,
    port: e.port,
    path: e.path,
    query: e.query,
    nid: e.nid,
    nss: e.nss,
    uuid: e.uuid,
    fragment: e.fragment,
    reference: e.reference,
    resourceName: e.resourceName,
    secure: e.secure,
    error: ""
  }, n = Object.assign({}, t), s = [], a = Sl(n.scheme || r.scheme);
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const i = ep(r);
  if (i !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(i), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let u = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (u = Dr(u)), i === void 0 && u[0] === "/" && u[1] === "/" && (u = "/%2F" + u.slice(2)), s.push(u);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const ip = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function pt(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  };
  let s = !1;
  r.reference === "suffix" && (r.scheme ? e = r.scheme + ":" + e : e = "//" + e);
  const a = e.match(ip);
  if (a) {
    if (n.scheme = a[1], n.userinfo = a[3], n.host = a[4], n.port = parseInt(a[5], 10), n.path = a[6] || "", n.query = a[7], n.fragment = a[8], isNaN(n.port) && (n.port = a[5]), n.host)
      if (tp(n.host) === !1) {
        const c = xh(n.host);
        n.host = c.host.toLowerCase(), s = c.isIPV6;
      } else
        s = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const i = Sl(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!i || !i.unicodeSupport) && n.host && (r.domainHost || i && i.domainHost) && s === !1 && rp(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (u) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + u;
      }
    (!i || i && !i.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = unescape(n.host))), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), i && i.parse && i.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const Sa = {
  SCHEMES: np,
  normalize: sp,
  resolve: ap,
  resolveComponent: bl,
  equal: op,
  serialize: ot,
  parse: pt
};
Zn.exports = Sa;
Zn.exports.default = Sa;
Zn.exports.fastUri = Sa;
var Pl = Zn.exports;
Object.defineProperty(wa, "__esModule", { value: !0 });
const Nl = Pl;
Nl.code = 'require("ajv/dist/runtime/uri").default';
wa.default = Nl;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Qe;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = te;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = Zr, s = vr, a = Yt, i = Me, u = te, c = Se, d = $e, l = M, h = jh, P = wa, _ = (w, m) => new RegExp(w, m);
  _.code = "new RegExp";
  const E = ["removeAdditional", "useDefaults", "coerceTypes"], g = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), $ = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, p = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, v = 200;
  function N(w) {
    var m, S, y, o, f, b, j, A, q, F, re, Fe, Nt, Ot, Rt, Tt, It, jt, At, kt, Ct, Dt, Mt, Lt, Ft;
    const Ge = w.strict, Vt = (m = w.code) === null || m === void 0 ? void 0 : m.optimize, Or = Vt === !0 || Vt === void 0 ? 1 : Vt || 0, Rr = (y = (S = w.code) === null || S === void 0 ? void 0 : S.regExp) !== null && y !== void 0 ? y : _, fs = (o = w.uriResolver) !== null && o !== void 0 ? o : P.default;
    return {
      strictSchema: (b = (f = w.strictSchema) !== null && f !== void 0 ? f : Ge) !== null && b !== void 0 ? b : !0,
      strictNumbers: (A = (j = w.strictNumbers) !== null && j !== void 0 ? j : Ge) !== null && A !== void 0 ? A : !0,
      strictTypes: (F = (q = w.strictTypes) !== null && q !== void 0 ? q : Ge) !== null && F !== void 0 ? F : "log",
      strictTuples: (Fe = (re = w.strictTuples) !== null && re !== void 0 ? re : Ge) !== null && Fe !== void 0 ? Fe : "log",
      strictRequired: (Ot = (Nt = w.strictRequired) !== null && Nt !== void 0 ? Nt : Ge) !== null && Ot !== void 0 ? Ot : !1,
      code: w.code ? { ...w.code, optimize: Or, regExp: Rr } : { optimize: Or, regExp: Rr },
      loopRequired: (Rt = w.loopRequired) !== null && Rt !== void 0 ? Rt : v,
      loopEnum: (Tt = w.loopEnum) !== null && Tt !== void 0 ? Tt : v,
      meta: (It = w.meta) !== null && It !== void 0 ? It : !0,
      messages: (jt = w.messages) !== null && jt !== void 0 ? jt : !0,
      inlineRefs: (At = w.inlineRefs) !== null && At !== void 0 ? At : !0,
      schemaId: (kt = w.schemaId) !== null && kt !== void 0 ? kt : "$id",
      addUsedSchema: (Ct = w.addUsedSchema) !== null && Ct !== void 0 ? Ct : !0,
      validateSchema: (Dt = w.validateSchema) !== null && Dt !== void 0 ? Dt : !0,
      validateFormats: (Mt = w.validateFormats) !== null && Mt !== void 0 ? Mt : !0,
      unicodeRegExp: (Lt = w.unicodeRegExp) !== null && Lt !== void 0 ? Lt : !0,
      int32range: (Ft = w.int32range) !== null && Ft !== void 0 ? Ft : !0,
      uriResolver: fs
    };
  }
  class R {
    constructor(m = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), m = this.opts = { ...m, ...N(m) };
      const { es5: S, lines: y } = this.opts.code;
      this.scope = new u.ValueScope({ scope: {}, prefixes: g, es5: S, lines: y }), this.logger = Q(m.logger);
      const o = m.validateFormats;
      m.validateFormats = !1, this.RULES = (0, a.getRules)(), I.call(this, $, m, "NOT SUPPORTED"), I.call(this, p, m, "DEPRECATED", "warn"), this._metaOpts = H.call(this), m.formats && ue.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), m.keywords && V.call(this, m.keywords), typeof m.meta == "object" && this.addMetaSchema(m.meta), J.call(this), m.validateFormats = o;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: m, meta: S, schemaId: y } = this.opts;
      let o = h;
      y === "id" && (o = { ...h }, o.id = o.$id, delete o.$id), S && m && this.addMetaSchema(o, o[y], !1);
    }
    defaultMeta() {
      const { meta: m, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof m == "object" ? m[S] || m : void 0;
    }
    validate(m, S) {
      let y;
      if (typeof m == "string") {
        if (y = this.getSchema(m), !y)
          throw new Error(`no schema with key or ref "${m}"`);
      } else
        y = this.compile(m);
      const o = y(S);
      return "$async" in y || (this.errors = y.errors), o;
    }
    compile(m, S) {
      const y = this._addSchema(m, S);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(m, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return o.call(this, m, S);
      async function o(F, re) {
        await f.call(this, F.$schema);
        const Fe = this._addSchema(F, re);
        return Fe.validate || b.call(this, Fe);
      }
      async function f(F) {
        F && !this.getSchema(F) && await o.call(this, { $ref: F }, !0);
      }
      async function b(F) {
        try {
          return this._compileSchemaEnv(F);
        } catch (re) {
          if (!(re instanceof s.default))
            throw re;
          return j.call(this, re), await A.call(this, re.missingSchema), b.call(this, F);
        }
      }
      function j({ missingSchema: F, missingRef: re }) {
        if (this.refs[F])
          throw new Error(`AnySchema ${F} is loaded but ${re} cannot be resolved`);
      }
      async function A(F) {
        const re = await q.call(this, F);
        this.refs[F] || await f.call(this, re.$schema), this.refs[F] || this.addSchema(re, F, S);
      }
      async function q(F) {
        const re = this._loading[F];
        if (re)
          return re;
        try {
          return await (this._loading[F] = y(F));
        } finally {
          delete this._loading[F];
        }
      }
    }
    // Adds schema to the instance
    addSchema(m, S, y, o = this.opts.validateSchema) {
      if (Array.isArray(m)) {
        for (const b of m)
          this.addSchema(b, void 0, y, o);
        return this;
      }
      let f;
      if (typeof m == "object") {
        const { schemaId: b } = this.opts;
        if (f = m[b], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${b} must be string`);
      }
      return S = (0, c.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(m, y, S, o, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(m, S, y = this.opts.validateSchema) {
      return this.addSchema(m, S, !0, y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(m, S) {
      if (typeof m == "boolean")
        return !0;
      let y;
      if (y = m.$schema, y !== void 0 && typeof y != "string")
        throw new Error("$schema must be a string");
      if (y = y || this.opts.defaultMeta || this.defaultMeta(), !y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const o = this.validate(y, m);
      if (!o && S) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return o;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(m) {
      let S;
      for (; typeof (S = z.call(this, m)) == "string"; )
        m = S;
      if (S === void 0) {
        const { schemaId: y } = this.opts, o = new i.SchemaEnv({ schema: {}, schemaId: y });
        if (S = i.resolveSchema.call(this, o, m), !S)
          return;
        this.refs[m] = S;
      }
      return S.validate || this._compileSchemaEnv(S);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(m) {
      if (m instanceof RegExp)
        return this._removeAllSchemas(this.schemas, m), this._removeAllSchemas(this.refs, m), this;
      switch (typeof m) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const S = z.call(this, m);
          return typeof S == "object" && this._cache.delete(S.schema), delete this.schemas[m], delete this.refs[m], this;
        }
        case "object": {
          const S = m;
          this._cache.delete(S);
          let y = m[this.opts.schemaId];
          return y && (y = (0, c.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(m) {
      for (const S of m)
        this.addKeyword(S);
      return this;
    }
    addKeyword(m, S) {
      let y;
      if (typeof m == "string")
        y = m, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = y);
      else if (typeof m == "object" && S === void 0) {
        if (S = m, y = S.keyword, Array.isArray(y) && !y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (C.call(this, y, S), !S)
        return (0, l.eachItem)(y, (f) => k.call(this, f)), this;
      D.call(this, S);
      const o = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, l.eachItem)(y, o.type.length === 0 ? (f) => k.call(this, f, o) : (f) => o.type.forEach((b) => k.call(this, f, o, b))), this;
    }
    getKeyword(m) {
      const S = this.RULES.all[m];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(m) {
      const { RULES: S } = this;
      delete S.keywords[m], delete S.all[m];
      for (const y of S.rules) {
        const o = y.rules.findIndex((f) => f.keyword === m);
        o >= 0 && y.rules.splice(o, 1);
      }
      return this;
    }
    // Add format
    addFormat(m, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[m] = S, this;
    }
    errorsText(m = this.errors, { separator: S = ", ", dataVar: y = "data" } = {}) {
      return !m || m.length === 0 ? "No errors" : m.map((o) => `${y}${o.instancePath} ${o.message}`).reduce((o, f) => o + S + f);
    }
    $dataMetaSchema(m, S) {
      const y = this.RULES.all;
      m = JSON.parse(JSON.stringify(m));
      for (const o of S) {
        const f = o.split("/").slice(1);
        let b = m;
        for (const j of f)
          b = b[j];
        for (const j in y) {
          const A = y[j];
          if (typeof A != "object")
            continue;
          const { $data: q } = A.definition, F = b[j];
          q && F && (b[j] = T(F));
        }
      }
      return m;
    }
    _removeAllSchemas(m, S) {
      for (const y in m) {
        const o = m[y];
        (!S || S.test(y)) && (typeof o == "string" ? delete m[y] : o && !o.meta && (this._cache.delete(o.schema), delete m[y]));
      }
    }
    _addSchema(m, S, y, o = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let b;
      const { schemaId: j } = this.opts;
      if (typeof m == "object")
        b = m[j];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof m != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let A = this._cache.get(m);
      if (A !== void 0)
        return A;
      y = (0, c.normalizeId)(b || y);
      const q = c.getSchemaRefs.call(this, m, y);
      return A = new i.SchemaEnv({ schema: m, schemaId: j, meta: S, baseId: y, localRefs: q }), this._cache.set(A.schema, A), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = A), o && this.validateSchema(m, !0), A;
    }
    _checkUnique(m) {
      if (this.schemas[m] || this.refs[m])
        throw new Error(`schema with key or id "${m}" already exists`);
    }
    _compileSchemaEnv(m) {
      if (m.meta ? this._compileMetaSchema(m) : i.compileSchema.call(this, m), !m.validate)
        throw new Error("ajv implementation error");
      return m.validate;
    }
    _compileMetaSchema(m) {
      const S = this.opts;
      this.opts = this._metaOpts;
      try {
        i.compileSchema.call(this, m);
      } finally {
        this.opts = S;
      }
    }
  }
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function I(w, m, S, y = "error") {
    for (const o in w) {
      const f = o;
      f in m && this.logger[y](`${S}: option ${o}. ${w[f]}`);
    }
  }
  function z(w) {
    return w = (0, c.normalizeId)(w), this.schemas[w] || this.refs[w];
  }
  function J() {
    const w = this.opts.schemas;
    if (w)
      if (Array.isArray(w))
        this.addSchema(w);
      else
        for (const m in w)
          this.addSchema(w[m], m);
  }
  function ue() {
    for (const w in this.opts.formats) {
      const m = this.opts.formats[w];
      m && this.addFormat(w, m);
    }
  }
  function V(w) {
    if (Array.isArray(w)) {
      this.addVocabulary(w);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const m in w) {
      const S = w[m];
      S.keyword || (S.keyword = m), this.addKeyword(S);
    }
  }
  function H() {
    const w = { ...this.opts };
    for (const m of E)
      delete w[m];
    return w;
  }
  const ne = { log() {
  }, warn() {
  }, error() {
  } };
  function Q(w) {
    if (w === !1)
      return ne;
    if (w === void 0)
      return console;
    if (w.log && w.warn && w.error)
      return w;
    throw new Error("logger must implement log, warn and error methods");
  }
  const de = /^[a-z_$][a-z0-9_$:-]*$/i;
  function C(w, m) {
    const { RULES: S } = this;
    if ((0, l.eachItem)(w, (y) => {
      if (S.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!de.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!m && m.$data && !("code" in m || "validate" in m))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(w, m, S) {
    var y;
    const o = m == null ? void 0 : m.post;
    if (S && o)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let b = o ? f.post : f.rules.find(({ type: A }) => A === S);
    if (b || (b = { type: S, rules: [] }, f.rules.push(b)), f.keywords[w] = !0, !m)
      return;
    const j = {
      keyword: w,
      definition: {
        ...m,
        type: (0, d.getJSONTypes)(m.type),
        schemaType: (0, d.getJSONTypes)(m.schemaType)
      }
    };
    m.before ? U.call(this, b, j, m.before) : b.rules.push(j), f.all[w] = j, (y = m.implements) === null || y === void 0 || y.forEach((A) => this.addKeyword(A));
  }
  function U(w, m, S) {
    const y = w.rules.findIndex((o) => o.keyword === S);
    y >= 0 ? w.rules.splice(y, 0, m) : (w.rules.push(m), this.logger.warn(`rule ${S} is not defined`));
  }
  function D(w) {
    let { metaSchema: m } = w;
    m !== void 0 && (w.$data && this.opts.$data && (m = T(m)), w.validateSchema = this.compile(m, !0));
  }
  const O = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function T(w) {
    return { anyOf: [w, O] };
  }
})(Lc);
var ba = {}, Pa = {}, Na = {};
Object.defineProperty(Na, "__esModule", { value: !0 });
const cp = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Na.default = cp;
var Qt = {};
Object.defineProperty(Qt, "__esModule", { value: !0 });
Qt.callRef = Qt.getValidate = void 0;
const lp = vr, hi = x, Ce = te, tr = ct, pi = Me, ln = M, up = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: i, opts: u, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = pi.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new lp.default(n.opts.uriResolver, s, r);
    if (l instanceof pi.SchemaEnv)
      return P(l);
    return _(l);
    function h() {
      if (a === d)
        return Rn(e, i, a, a.$async);
      const E = t.scopeValue("root", { ref: d });
      return Rn(e, (0, Ce._)`${E}.validate`, d, d.$async);
    }
    function P(E) {
      const g = Ol(e, E);
      Rn(e, g, E, E.$async);
    }
    function _(E) {
      const g = t.scopeValue("schema", u.code.source === !0 ? { ref: E, code: (0, Ce.stringify)(E) } : { ref: E }), $ = t.name("valid"), p = e.subschema({
        schema: E,
        dataTypes: [],
        schemaPath: Ce.nil,
        topSchemaRef: g,
        errSchemaPath: r
      }, $);
      e.mergeEvaluated(p), e.ok($);
    }
  }
};
function Ol(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ce._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Qt.getValidate = Ol;
function Rn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: i, schemaEnv: u, opts: c } = a, d = c.passContext ? tr.default.this : Ce.nil;
  n ? l() : h();
  function l() {
    if (!u.$async)
      throw new Error("async schema referenced by sync schema");
    const E = s.let("valid");
    s.try(() => {
      s.code((0, Ce._)`await ${(0, hi.callValidateCode)(e, t, d)}`), _(t), i || s.assign(E, !0);
    }, (g) => {
      s.if((0, Ce._)`!(${g} instanceof ${a.ValidationError})`, () => s.throw(g)), P(g), i || s.assign(E, !1);
    }), e.ok(E);
  }
  function h() {
    e.result((0, hi.callValidateCode)(e, t, d), () => _(t), () => P(t));
  }
  function P(E) {
    const g = (0, Ce._)`${E}.errors`;
    s.assign(tr.default.vErrors, (0, Ce._)`${tr.default.vErrors} === null ? ${g} : ${tr.default.vErrors}.concat(${g})`), s.assign(tr.default.errors, (0, Ce._)`${tr.default.vErrors}.length`);
  }
  function _(E) {
    var g;
    if (!a.opts.unevaluated)
      return;
    const $ = (g = r == null ? void 0 : r.validate) === null || g === void 0 ? void 0 : g.evaluated;
    if (a.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (a.props = ln.mergeEvaluated.props(s, $.props, a.props));
      else {
        const p = s.var("props", (0, Ce._)`${E}.evaluated.props`);
        a.props = ln.mergeEvaluated.props(s, p, a.props, Ce.Name);
      }
    if (a.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (a.items = ln.mergeEvaluated.items(s, $.items, a.items));
      else {
        const p = s.var("items", (0, Ce._)`${E}.evaluated.items`);
        a.items = ln.mergeEvaluated.items(s, p, a.items, Ce.Name);
      }
  }
}
Qt.callRef = Rn;
Qt.default = up;
Object.defineProperty(Pa, "__esModule", { value: !0 });
const dp = Na, fp = Qt, hp = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  dp.default,
  fp.default
];
Pa.default = hp;
var Oa = {}, Ra = {};
Object.defineProperty(Ra, "__esModule", { value: !0 });
const Vn = te, yt = Vn.operators, Un = {
  maximum: { okStr: "<=", ok: yt.LTE, fail: yt.GT },
  minimum: { okStr: ">=", ok: yt.GTE, fail: yt.LT },
  exclusiveMaximum: { okStr: "<", ok: yt.LT, fail: yt.GTE },
  exclusiveMinimum: { okStr: ">", ok: yt.GT, fail: yt.LTE }
}, pp = {
  message: ({ keyword: e, schemaCode: t }) => (0, Vn.str)`must be ${Un[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Vn._)`{comparison: ${Un[e].okStr}, limit: ${t}}`
}, mp = {
  keyword: Object.keys(Un),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: pp,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Vn._)`${r} ${Un[t].fail} ${n} || isNaN(${r})`);
  }
};
Ra.default = mp;
var Ta = {};
Object.defineProperty(Ta, "__esModule", { value: !0 });
const Vr = te, yp = {
  message: ({ schemaCode: e }) => (0, Vr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Vr._)`{multipleOf: ${e}}`
}, $p = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: yp,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, i = t.let("res"), u = a ? (0, Vr._)`Math.abs(Math.round(${i}) - ${i}) > 1e-${a}` : (0, Vr._)`${i} !== parseInt(${i})`;
    e.fail$data((0, Vr._)`(${n} === 0 || (${i} = ${r}/${n}, ${u}))`);
  }
};
Ta.default = $p;
var Ia = {}, ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
function Rl(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
ja.default = Rl;
Rl.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Ia, "__esModule", { value: !0 });
const Ht = te, _p = M, gp = ja, vp = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Ht.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Ht._)`{limit: ${e}}`
}, wp = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: vp,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? Ht.operators.GT : Ht.operators.LT, i = s.opts.unicode === !1 ? (0, Ht._)`${r}.length` : (0, Ht._)`${(0, _p.useFunc)(e.gen, gp.default)}(${r})`;
    e.fail$data((0, Ht._)`${i} ${a} ${n}`);
  }
};
Ia.default = wp;
var Aa = {};
Object.defineProperty(Aa, "__esModule", { value: !0 });
const Ep = x, Sp = M, ir = te, bp = {
  message: ({ schemaCode: e }) => (0, ir.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, ir._)`{pattern: ${e}}`
}, Pp = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: bp,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: i } = e, u = i.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = i.opts.code, d = c.code === "new RegExp" ? (0, ir._)`new RegExp` : (0, Sp.useFunc)(t, c), l = t.let("valid");
      t.try(() => t.assign(l, (0, ir._)`${d}(${a}, ${u}).test(${r})`), () => t.assign(l, !1)), e.fail$data((0, ir._)`!${l}`);
    } else {
      const c = (0, Ep.usePattern)(e, s);
      e.fail$data((0, ir._)`!${c}.test(${r})`);
    }
  }
};
Aa.default = Pp;
var ka = {};
Object.defineProperty(ka, "__esModule", { value: !0 });
const Ur = te, Np = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Ur.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Ur._)`{limit: ${e}}`
}, Op = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Np,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Ur.operators.GT : Ur.operators.LT;
    e.fail$data((0, Ur._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
ka.default = Op;
var Ca = {};
Object.defineProperty(Ca, "__esModule", { value: !0 });
const jr = x, zr = te, Rp = M, Tp = {
  message: ({ params: { missingProperty: e } }) => (0, zr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, zr._)`{missingProperty: ${e}}`
}, Ip = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Tp,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: i } = e, { opts: u } = i;
    if (!a && r.length === 0)
      return;
    const c = r.length >= u.loopRequired;
    if (i.allErrors ? d() : l(), u.strictRequired) {
      const _ = e.parentSchema.properties, { definedProperties: E } = e.it;
      for (const g of r)
        if ((_ == null ? void 0 : _[g]) === void 0 && !E.has(g)) {
          const $ = i.schemaEnv.baseId + i.errSchemaPath, p = `required property "${g}" is not defined at "${$}" (strictRequired)`;
          (0, Rp.checkStrictMode)(i, p, i.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(zr.nil, h);
      else
        for (const _ of r)
          (0, jr.checkReportMissingProp)(e, _);
    }
    function l() {
      const _ = t.let("missing");
      if (c || a) {
        const E = t.let("valid", !0);
        e.block$data(E, () => P(_, E)), e.ok(E);
      } else
        t.if((0, jr.checkMissingProp)(e, r, _)), (0, jr.reportMissingProp)(e, _), t.else();
    }
    function h() {
      t.forOf("prop", n, (_) => {
        e.setParams({ missingProperty: _ }), t.if((0, jr.noPropertyInData)(t, s, _, u.ownProperties), () => e.error());
      });
    }
    function P(_, E) {
      e.setParams({ missingProperty: _ }), t.forOf(_, n, () => {
        t.assign(E, (0, jr.propertyInData)(t, s, _, u.ownProperties)), t.if((0, zr.not)(E), () => {
          e.error(), t.break();
        });
      }, zr.nil);
    }
  }
};
Ca.default = Ip;
var Da = {};
Object.defineProperty(Da, "__esModule", { value: !0 });
const qr = te, jp = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, qr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, qr._)`{limit: ${e}}`
}, Ap = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: jp,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? qr.operators.GT : qr.operators.LT;
    e.fail$data((0, qr._)`${r}.length ${s} ${n}`);
  }
};
Da.default = Ap;
var Ma = {}, xr = {};
Object.defineProperty(xr, "__esModule", { value: !0 });
const Tl = Xn;
Tl.code = 'require("ajv/dist/runtime/equal").default';
xr.default = Tl;
Object.defineProperty(Ma, "__esModule", { value: !0 });
const ys = $e, ve = te, kp = M, Cp = xr, Dp = {
  message: ({ params: { i: e, j: t } }) => (0, ve.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ve._)`{i: ${e}, j: ${t}}`
}, Mp = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Dp,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: i, it: u } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, ys.getSchemaTypes)(a.items) : [];
    e.block$data(c, l, (0, ve._)`${i} === false`), e.ok(c);
    function l() {
      const E = t.let("i", (0, ve._)`${r}.length`), g = t.let("j");
      e.setParams({ i: E, j: g }), t.assign(c, !0), t.if((0, ve._)`${E} > 1`, () => (h() ? P : _)(E, g));
    }
    function h() {
      return d.length > 0 && !d.some((E) => E === "object" || E === "array");
    }
    function P(E, g) {
      const $ = t.name("item"), p = (0, ys.checkDataTypes)(d, $, u.opts.strictNumbers, ys.DataType.Wrong), v = t.const("indices", (0, ve._)`{}`);
      t.for((0, ve._)`;${E}--;`, () => {
        t.let($, (0, ve._)`${r}[${E}]`), t.if(p, (0, ve._)`continue`), d.length > 1 && t.if((0, ve._)`typeof ${$} == "string"`, (0, ve._)`${$} += "_"`), t.if((0, ve._)`typeof ${v}[${$}] == "number"`, () => {
          t.assign(g, (0, ve._)`${v}[${$}]`), e.error(), t.assign(c, !1).break();
        }).code((0, ve._)`${v}[${$}] = ${E}`);
      });
    }
    function _(E, g) {
      const $ = (0, kp.useFunc)(t, Cp.default), p = t.name("outer");
      t.label(p).for((0, ve._)`;${E}--;`, () => t.for((0, ve._)`${g} = ${E}; ${g}--;`, () => t.if((0, ve._)`${$}(${r}[${E}], ${r}[${g}])`, () => {
        e.error(), t.assign(c, !1).break(p);
      })));
    }
  }
};
Ma.default = Mp;
var La = {};
Object.defineProperty(La, "__esModule", { value: !0 });
const Fs = te, Lp = M, Fp = xr, Vp = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Fs._)`{allowedValue: ${e}}`
}, Up = {
  keyword: "const",
  $data: !0,
  error: Vp,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, Fs._)`!${(0, Lp.useFunc)(t, Fp.default)}(${r}, ${s})`) : e.fail((0, Fs._)`${a} !== ${r}`);
  }
};
La.default = Up;
var Fa = {};
Object.defineProperty(Fa, "__esModule", { value: !0 });
const Mr = te, zp = M, qp = xr, Kp = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Mr._)`{allowedValues: ${e}}`
}, Gp = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Kp,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: i } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const u = s.length >= i.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, zp.useFunc)(t, qp.default));
    let l;
    if (u || n)
      l = t.let("valid"), e.block$data(l, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const _ = t.const("vSchema", a);
      l = (0, Mr.or)(...s.map((E, g) => P(_, g)));
    }
    e.pass(l);
    function h() {
      t.assign(l, !1), t.forOf("v", a, (_) => t.if((0, Mr._)`${d()}(${r}, ${_})`, () => t.assign(l, !0).break()));
    }
    function P(_, E) {
      const g = s[E];
      return typeof g == "object" && g !== null ? (0, Mr._)`${d()}(${r}, ${_}[${E}])` : (0, Mr._)`${r} === ${g}`;
    }
  }
};
Fa.default = Gp;
Object.defineProperty(Oa, "__esModule", { value: !0 });
const Hp = Ra, Jp = Ta, Wp = Ia, Bp = Aa, Xp = ka, Yp = Ca, Qp = Da, Zp = Ma, xp = La, em = Fa, tm = [
  // number
  Hp.default,
  Jp.default,
  // string
  Wp.default,
  Bp.default,
  // object
  Xp.default,
  Yp.default,
  // array
  Qp.default,
  Zp.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  xp.default,
  em.default
];
Oa.default = tm;
var Va = {}, wr = {};
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.validateAdditionalItems = void 0;
const Jt = te, Vs = M, rm = {
  message: ({ params: { len: e } }) => (0, Jt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Jt._)`{limit: ${e}}`
}, nm = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: rm,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Vs.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Il(e, n);
  }
};
function Il(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: i } = e;
  i.items = !0;
  const u = r.const("len", (0, Jt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Jt._)`${u} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Vs.alwaysValidSchema)(i, n)) {
    const d = r.var("valid", (0, Jt._)`${u} <= ${t.length}`);
    r.if((0, Jt.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, u, (l) => {
      e.subschema({ keyword: a, dataProp: l, dataPropType: Vs.Type.Num }, d), i.allErrors || r.if((0, Jt.not)(d), () => r.break());
    });
  }
}
wr.validateAdditionalItems = Il;
wr.default = nm;
var Ua = {}, Er = {};
Object.defineProperty(Er, "__esModule", { value: !0 });
Er.validateTuple = void 0;
const mi = te, Tn = M, sm = x, am = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return jl(e, "additionalItems", t);
    r.items = !0, !(0, Tn.alwaysValidSchema)(r, t) && e.ok((0, sm.validateArray)(e));
  }
};
function jl(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: i, it: u } = e;
  l(s), u.opts.unevaluated && r.length && u.items !== !0 && (u.items = Tn.mergeEvaluated.items(n, r.length, u.items));
  const c = n.name("valid"), d = n.const("len", (0, mi._)`${a}.length`);
  r.forEach((h, P) => {
    (0, Tn.alwaysValidSchema)(u, h) || (n.if((0, mi._)`${d} > ${P}`, () => e.subschema({
      keyword: i,
      schemaProp: P,
      dataProp: P
    }, c)), e.ok(c));
  });
  function l(h) {
    const { opts: P, errSchemaPath: _ } = u, E = r.length, g = E === h.minItems && (E === h.maxItems || h[t] === !1);
    if (P.strictTuples && !g) {
      const $ = `"${i}" is ${E}-tuple, but minItems or maxItems/${t} are not specified or different at path "${_}"`;
      (0, Tn.checkStrictMode)(u, $, P.strictTuples);
    }
  }
}
Er.validateTuple = jl;
Er.default = am;
Object.defineProperty(Ua, "__esModule", { value: !0 });
const om = Er, im = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, om.validateTuple)(e, "items")
};
Ua.default = im;
var za = {};
Object.defineProperty(za, "__esModule", { value: !0 });
const yi = te, cm = M, lm = x, um = wr, dm = {
  message: ({ params: { len: e } }) => (0, yi.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, yi._)`{limit: ${e}}`
}, fm = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: dm,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, cm.alwaysValidSchema)(n, t) && (s ? (0, um.validateAdditionalItems)(e, s) : e.ok((0, lm.validateArray)(e)));
  }
};
za.default = fm;
var qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
const ze = te, un = M, hm = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, ze.str)`must contain at least ${e} valid item(s)` : (0, ze.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, ze._)`{minContains: ${e}}` : (0, ze._)`{minContains: ${e}, maxContains: ${t}}`
}, pm = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: hm,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let i, u;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (i = c === void 0 ? 1 : c, u = d) : i = 1;
    const l = t.const("len", (0, ze._)`${s}.length`);
    if (e.setParams({ min: i, max: u }), u === void 0 && i === 0) {
      (0, un.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (u !== void 0 && i > u) {
      (0, un.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, un.alwaysValidSchema)(a, r)) {
      let g = (0, ze._)`${l} >= ${i}`;
      u !== void 0 && (g = (0, ze._)`${g} && ${l} <= ${u}`), e.pass(g);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    u === void 0 && i === 1 ? _(h, () => t.if(h, () => t.break())) : i === 0 ? (t.let(h, !0), u !== void 0 && t.if((0, ze._)`${s}.length > 0`, P)) : (t.let(h, !1), P()), e.result(h, () => e.reset());
    function P() {
      const g = t.name("_valid"), $ = t.let("count", 0);
      _(g, () => t.if(g, () => E($)));
    }
    function _(g, $) {
      t.forRange("i", 0, l, (p) => {
        e.subschema({
          keyword: "contains",
          dataProp: p,
          dataPropType: un.Type.Num,
          compositeRule: !0
        }, g), $();
      });
    }
    function E(g) {
      t.code((0, ze._)`${g}++`), u === void 0 ? t.if((0, ze._)`${g} >= ${i}`, () => t.assign(h, !0).break()) : (t.if((0, ze._)`${g} > ${u}`, () => t.assign(h, !1).break()), i === 1 ? t.assign(h, !0) : t.if((0, ze._)`${g} >= ${i}`, () => t.assign(h, !0)));
    }
  }
};
qa.default = pm;
var Al = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = te, r = M, n = x;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: l } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: l, missingProperty: h } }) => (0, t._)`{property: ${c},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${l}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [d, l] = a(c);
      i(c, d), u(c, l);
    }
  };
  function a({ schema: c }) {
    const d = {}, l = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const P = Array.isArray(c[h]) ? d : l;
      P[h] = c[h];
    }
    return [d, l];
  }
  function i(c, d = c.schema) {
    const { gen: l, data: h, it: P } = c;
    if (Object.keys(d).length === 0)
      return;
    const _ = l.let("missing");
    for (const E in d) {
      const g = d[E];
      if (g.length === 0)
        continue;
      const $ = (0, n.propertyInData)(l, h, E, P.opts.ownProperties);
      c.setParams({
        property: E,
        depsCount: g.length,
        deps: g.join(", ")
      }), P.allErrors ? l.if($, () => {
        for (const p of g)
          (0, n.checkReportMissingProp)(c, p);
      }) : (l.if((0, t._)`${$} && (${(0, n.checkMissingProp)(c, g, _)})`), (0, n.reportMissingProp)(c, _), l.else());
    }
  }
  e.validatePropertyDeps = i;
  function u(c, d = c.schema) {
    const { gen: l, data: h, keyword: P, it: _ } = c, E = l.name("valid");
    for (const g in d)
      (0, r.alwaysValidSchema)(_, d[g]) || (l.if(
        (0, n.propertyInData)(l, h, g, _.opts.ownProperties),
        () => {
          const $ = c.subschema({ keyword: P, schemaProp: g }, E);
          c.mergeValidEvaluated($, E);
        },
        () => l.var(E, !0)
        // TODO var
      ), c.ok(E));
  }
  e.validateSchemaDeps = u, e.default = s;
})(Al);
var Ka = {};
Object.defineProperty(Ka, "__esModule", { value: !0 });
const kl = te, mm = M, ym = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, kl._)`{propertyName: ${e.propertyName}}`
}, $m = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: ym,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, mm.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (i) => {
      e.setParams({ propertyName: i }), e.subschema({
        keyword: "propertyNames",
        data: i,
        dataTypes: ["string"],
        propertyName: i,
        compositeRule: !0
      }, a), t.if((0, kl.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
Ka.default = $m;
var xn = {};
Object.defineProperty(xn, "__esModule", { value: !0 });
const dn = x, We = te, _m = ct, fn = M, gm = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, We._)`{additionalProperty: ${e.additionalProperty}}`
}, vm = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: gm,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: i } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: u, opts: c } = i;
    if (i.props = !0, c.removeAdditional !== "all" && (0, fn.alwaysValidSchema)(i, r))
      return;
    const d = (0, dn.allSchemaProperties)(n.properties), l = (0, dn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, We._)`${a} === ${_m.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !l.length ? E($) : t.if(P($), () => E($));
      });
    }
    function P($) {
      let p;
      if (d.length > 8) {
        const v = (0, fn.schemaRefOrVal)(i, n.properties, "properties");
        p = (0, dn.isOwnProperty)(t, v, $);
      } else d.length ? p = (0, We.or)(...d.map((v) => (0, We._)`${$} === ${v}`)) : p = We.nil;
      return l.length && (p = (0, We.or)(p, ...l.map((v) => (0, We._)`${(0, dn.usePattern)(e, v)}.test(${$})`))), (0, We.not)(p);
    }
    function _($) {
      t.code((0, We._)`delete ${s}[${$}]`);
    }
    function E($) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        _($);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: $ }), e.error(), u || t.break();
        return;
      }
      if (typeof r == "object" && !(0, fn.alwaysValidSchema)(i, r)) {
        const p = t.name("valid");
        c.removeAdditional === "failing" ? (g($, p, !1), t.if((0, We.not)(p), () => {
          e.reset(), _($);
        })) : (g($, p), u || t.if((0, We.not)(p), () => t.break()));
      }
    }
    function g($, p, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: fn.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, p);
    }
  }
};
xn.default = vm;
var Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
const wm = Qe, $i = x, $s = M, _i = xn, Em = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && _i.default.code(new wm.KeywordCxt(a, _i.default, "additionalProperties"));
    const i = (0, $i.allSchemaProperties)(r);
    for (const h of i)
      a.definedProperties.add(h);
    a.opts.unevaluated && i.length && a.props !== !0 && (a.props = $s.mergeEvaluated.props(t, (0, $s.toHash)(i), a.props));
    const u = i.filter((h) => !(0, $s.alwaysValidSchema)(a, r[h]));
    if (u.length === 0)
      return;
    const c = t.name("valid");
    for (const h of u)
      d(h) ? l(h) : (t.if((0, $i.propertyInData)(t, s, h, a.opts.ownProperties)), l(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function l(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
Ga.default = Em;
var Ha = {};
Object.defineProperty(Ha, "__esModule", { value: !0 });
const gi = x, hn = te, vi = M, wi = M, Sm = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: i } = a, u = (0, gi.allSchemaProperties)(r), c = u.filter((g) => (0, vi.alwaysValidSchema)(a, r[g]));
    if (u.length === 0 || c.length === u.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = i.strictSchema && !i.allowMatchingProperties && s.properties, l = t.name("valid");
    a.props !== !0 && !(a.props instanceof hn.Name) && (a.props = (0, wi.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    P();
    function P() {
      for (const g of u)
        d && _(g), a.allErrors ? E(g) : (t.var(l, !0), E(g), t.if(l));
    }
    function _(g) {
      for (const $ in d)
        new RegExp(g).test($) && (0, vi.checkStrictMode)(a, `property ${$} matches pattern ${g} (use allowMatchingProperties)`);
    }
    function E(g) {
      t.forIn("key", n, ($) => {
        t.if((0, hn._)`${(0, gi.usePattern)(e, g)}.test(${$})`, () => {
          const p = c.includes(g);
          p || e.subschema({
            keyword: "patternProperties",
            schemaProp: g,
            dataProp: $,
            dataPropType: wi.Type.Str
          }, l), a.opts.unevaluated && h !== !0 ? t.assign((0, hn._)`${h}[${$}]`, !0) : !p && !a.allErrors && t.if((0, hn.not)(l), () => t.break());
        });
      });
    }
  }
};
Ha.default = Sm;
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
const bm = M, Pm = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, bm.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
Ja.default = Pm;
var Wa = {};
Object.defineProperty(Wa, "__esModule", { value: !0 });
const Nm = x, Om = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Nm.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Wa.default = Om;
var Ba = {};
Object.defineProperty(Ba, "__esModule", { value: !0 });
const In = te, Rm = M, Tm = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, In._)`{passingSchemas: ${e.passing}}`
}, Im = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Tm,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, i = t.let("valid", !1), u = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: u }), t.block(d), e.result(i, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((l, h) => {
        let P;
        (0, Rm.alwaysValidSchema)(s, l) ? t.var(c, !0) : P = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, In._)`${c} && ${i}`).assign(i, !1).assign(u, (0, In._)`[${u}, ${h}]`).else(), t.if(c, () => {
          t.assign(i, !0), t.assign(u, h), P && e.mergeEvaluated(P, In.Name);
        });
      });
    }
  }
};
Ba.default = Im;
var Xa = {};
Object.defineProperty(Xa, "__esModule", { value: !0 });
const jm = M, Am = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, i) => {
      if ((0, jm.alwaysValidSchema)(n, a))
        return;
      const u = e.subschema({ keyword: "allOf", schemaProp: i }, s);
      e.ok(s), e.mergeEvaluated(u);
    });
  }
};
Xa.default = Am;
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const zn = te, Cl = M, km = {
  message: ({ params: e }) => (0, zn.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, zn._)`{failingKeyword: ${e.ifClause}}`
}, Cm = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: km,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Cl.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Ei(n, "then"), a = Ei(n, "else");
    if (!s && !a)
      return;
    const i = t.let("valid", !0), u = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(u, d("then", l), d("else", l));
    } else s ? t.if(u, d("then")) : t.if((0, zn.not)(u), d("else"));
    e.pass(i, () => e.error(!0));
    function c() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, u);
      e.mergeEvaluated(l);
    }
    function d(l, h) {
      return () => {
        const P = e.subschema({ keyword: l }, u);
        t.assign(i, u), e.mergeValidEvaluated(P, i), h ? t.assign(h, (0, zn._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function Ei(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Cl.alwaysValidSchema)(e, r);
}
Ya.default = Cm;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
const Dm = M, Mm = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Dm.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Qa.default = Mm;
Object.defineProperty(Va, "__esModule", { value: !0 });
const Lm = wr, Fm = Ua, Vm = Er, Um = za, zm = qa, qm = Al, Km = Ka, Gm = xn, Hm = Ga, Jm = Ha, Wm = Ja, Bm = Wa, Xm = Ba, Ym = Xa, Qm = Ya, Zm = Qa;
function xm(e = !1) {
  const t = [
    // any
    Wm.default,
    Bm.default,
    Xm.default,
    Ym.default,
    Qm.default,
    Zm.default,
    // object
    Km.default,
    Gm.default,
    qm.default,
    Hm.default,
    Jm.default
  ];
  return e ? t.push(Fm.default, Um.default) : t.push(Lm.default, Vm.default), t.push(zm.default), t;
}
Va.default = xm;
var Za = {}, xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const me = te, ey = {
  message: ({ schemaCode: e }) => (0, me.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, me._)`{format: ${e}}`
}, ty = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: ey,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: i, it: u } = e, { opts: c, errSchemaPath: d, schemaEnv: l, self: h } = u;
    if (!c.validateFormats)
      return;
    s ? P() : _();
    function P() {
      const E = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), g = r.const("fDef", (0, me._)`${E}[${i}]`), $ = r.let("fType"), p = r.let("format");
      r.if((0, me._)`typeof ${g} == "object" && !(${g} instanceof RegExp)`, () => r.assign($, (0, me._)`${g}.type || "string"`).assign(p, (0, me._)`${g}.validate`), () => r.assign($, (0, me._)`"string"`).assign(p, g)), e.fail$data((0, me.or)(v(), N()));
      function v() {
        return c.strictSchema === !1 ? me.nil : (0, me._)`${i} && !${p}`;
      }
      function N() {
        const R = l.$async ? (0, me._)`(${g}.async ? await ${p}(${n}) : ${p}(${n}))` : (0, me._)`${p}(${n})`, I = (0, me._)`(typeof ${p} == "function" ? ${R} : ${p}.test(${n}))`;
        return (0, me._)`${p} && ${p} !== true && ${$} === ${t} && !${I}`;
      }
    }
    function _() {
      const E = h.formats[a];
      if (!E) {
        v();
        return;
      }
      if (E === !0)
        return;
      const [g, $, p] = N(E);
      g === t && e.pass(R());
      function v() {
        if (c.strictSchema === !1) {
          h.logger.warn(I());
          return;
        }
        throw new Error(I());
        function I() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(I) {
        const z = I instanceof RegExp ? (0, me.regexpCode)(I) : c.code.formats ? (0, me._)`${c.code.formats}${(0, me.getProperty)(a)}` : void 0, J = r.scopeValue("formats", { key: a, ref: I, code: z });
        return typeof I == "object" && !(I instanceof RegExp) ? [I.type || "string", I.validate, (0, me._)`${J}.validate`] : ["string", I, J];
      }
      function R() {
        if (typeof E == "object" && !(E instanceof RegExp) && E.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, me._)`await ${p}(${n})`;
        }
        return typeof $ == "function" ? (0, me._)`${p}(${n})` : (0, me._)`${p}.test(${n})`;
      }
    }
  }
};
xa.default = ty;
Object.defineProperty(Za, "__esModule", { value: !0 });
const ry = xa, ny = [ry.default];
Za.default = ny;
var $r = {};
Object.defineProperty($r, "__esModule", { value: !0 });
$r.contentVocabulary = $r.metadataVocabulary = void 0;
$r.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
$r.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(ba, "__esModule", { value: !0 });
const sy = Pa, ay = Oa, oy = Va, iy = Za, Si = $r, cy = [
  sy.default,
  ay.default,
  (0, oy.default)(),
  iy.default,
  Si.metadataVocabulary,
  Si.contentVocabulary
];
ba.default = cy;
var eo = {}, es = {};
Object.defineProperty(es, "__esModule", { value: !0 });
es.DiscrError = void 0;
var bi;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(bi || (es.DiscrError = bi = {}));
Object.defineProperty(eo, "__esModule", { value: !0 });
const sr = te, Us = es, Pi = Me, ly = vr, uy = M, dy = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Us.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, sr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, fy = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: dy,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: i } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const u = n.propertyName;
    if (typeof u != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!i)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, sr._)`${r}${(0, sr.getProperty)(u)}`);
    t.if((0, sr._)`typeof ${d} == "string"`, () => l(), () => e.error(!1, { discrError: Us.DiscrError.Tag, tag: d, tagName: u })), e.ok(c);
    function l() {
      const _ = P();
      t.if(!1);
      for (const E in _)
        t.elseIf((0, sr._)`${d} === ${E}`), t.assign(c, h(_[E]));
      t.else(), e.error(!1, { discrError: Us.DiscrError.Mapping, tag: d, tagName: u }), t.endIf();
    }
    function h(_) {
      const E = t.name("valid"), g = e.subschema({ keyword: "oneOf", schemaProp: _ }, E);
      return e.mergeEvaluated(g, sr.Name), E;
    }
    function P() {
      var _;
      const E = {}, g = p(s);
      let $ = !0;
      for (let R = 0; R < i.length; R++) {
        let I = i[R];
        if (I != null && I.$ref && !(0, uy.schemaHasRulesButRef)(I, a.self.RULES)) {
          const J = I.$ref;
          if (I = Pi.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, J), I instanceof Pi.SchemaEnv && (I = I.schema), I === void 0)
            throw new ly.default(a.opts.uriResolver, a.baseId, J);
        }
        const z = (_ = I == null ? void 0 : I.properties) === null || _ === void 0 ? void 0 : _[u];
        if (typeof z != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${u}"`);
        $ = $ && (g || p(I)), v(z, R);
      }
      if (!$)
        throw new Error(`discriminator: "${u}" must be required`);
      return E;
      function p({ required: R }) {
        return Array.isArray(R) && R.includes(u);
      }
      function v(R, I) {
        if (R.const)
          N(R.const, I);
        else if (R.enum)
          for (const z of R.enum)
            N(z, I);
        else
          throw new Error(`discriminator: "properties/${u}" must have "const" or "enum"`);
      }
      function N(R, I) {
        if (typeof R != "string" || R in E)
          throw new Error(`discriminator: "${u}" values must be unique strings`);
        E[R] = I;
      }
    }
  }
};
eo.default = fy;
const hy = "http://json-schema.org/draft-07/schema#", py = "http://json-schema.org/draft-07/schema#", my = "Core schema meta-schema", yy = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, $y = [
  "object",
  "boolean"
], _y = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, gy = {
  $schema: hy,
  $id: py,
  title: my,
  definitions: yy,
  type: $y,
  properties: _y,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = Lc, n = ba, s = eo, a = gy, i = ["/properties"], u = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((E) => this.addVocabulary(E)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const E = this.opts.$data ? this.$dataMetaSchema(a, i) : a;
      this.addMetaSchema(E, u, !1), this.refs["http://json-schema.org/schema"] = u;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(u) ? u : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var d = Qe;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var l = te;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return l._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return l.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return l.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return l.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return l.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return l.CodeGen;
  } });
  var h = Zr;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var P = vr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return P.default;
  } });
})(ks, ks.exports);
var vy = ks.exports, zs = { exports: {} }, Dl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(V, H) {
    return { validate: V, compare: H };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(a, i),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(c, d),
    "date-time": t(h, P),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: g,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: ue,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: p,
    // signed 32 bit integer
    int32: { type: "number", validate: R },
    // signed 64 bit integer
    int64: { type: "number", validate: I },
    // C-type float
    float: { type: "number", validate: z },
    // C-type double
    double: { type: "number", validate: z },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, i),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, d),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, P),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(V) {
    return V % 4 === 0 && (V % 100 !== 0 || V % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function a(V) {
    const H = n.exec(V);
    if (!H)
      return !1;
    const ne = +H[1], Q = +H[2], de = +H[3];
    return Q >= 1 && Q <= 12 && de >= 1 && de <= (Q === 2 && r(ne) ? 29 : s[Q]);
  }
  function i(V, H) {
    if (V && H)
      return V > H ? 1 : V < H ? -1 : 0;
  }
  const u = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i;
  function c(V, H) {
    const ne = u.exec(V);
    if (!ne)
      return !1;
    const Q = +ne[1], de = +ne[2], C = +ne[3], k = ne[5];
    return (Q <= 23 && de <= 59 && C <= 59 || Q === 23 && de === 59 && C === 60) && (!H || k !== "");
  }
  function d(V, H) {
    if (!(V && H))
      return;
    const ne = u.exec(V), Q = u.exec(H);
    if (ne && Q)
      return V = ne[1] + ne[2] + ne[3] + (ne[4] || ""), H = Q[1] + Q[2] + Q[3] + (Q[4] || ""), V > H ? 1 : V < H ? -1 : 0;
  }
  const l = /t|\s/i;
  function h(V) {
    const H = V.split(l);
    return H.length === 2 && a(H[0]) && c(H[1], !0);
  }
  function P(V, H) {
    if (!(V && H))
      return;
    const [ne, Q] = V.split(l), [de, C] = H.split(l), k = i(ne, de);
    if (k !== void 0)
      return k || d(Q, C);
  }
  const _ = /\/|:/, E = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function g(V) {
    return _.test(V) && E.test(V);
  }
  const $ = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function p(V) {
    return $.lastIndex = 0, $.test(V);
  }
  const v = -2147483648, N = 2 ** 31 - 1;
  function R(V) {
    return Number.isInteger(V) && V <= N && V >= v;
  }
  function I(V) {
    return Number.isInteger(V);
  }
  function z() {
    return !0;
  }
  const J = /[^\\]\\Z/;
  function ue(V) {
    if (J.test(V))
      return !1;
    try {
      return new RegExp(V), !0;
    } catch {
      return !1;
    }
  }
})(Dl);
var Ml = {}, qs = { exports: {} }, Ll = {}, Ze = {}, _r = {}, en = {}, Z = {}, Yr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(v) {
      if (super(), !e.IDENTIFIER.test(v))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(v) {
      super(), this._items = typeof v == "string" ? [v] : v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const v = this._items[0];
      return v === "" || v === '""';
    }
    get str() {
      var v;
      return (v = this._str) !== null && v !== void 0 ? v : this._str = this._items.reduce((N, R) => `${N}${R}`, "");
    }
    get names() {
      var v;
      return (v = this._names) !== null && v !== void 0 ? v : this._names = this._items.reduce((N, R) => (R instanceof r && (N[R.str] = (N[R.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(p, ...v) {
    const N = [p[0]];
    let R = 0;
    for (; R < v.length; )
      u(N, v[R]), N.push(p[++R]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function i(p, ...v) {
    const N = [_(p[0])];
    let R = 0;
    for (; R < v.length; )
      N.push(a), u(N, v[R]), N.push(a, _(p[++R]));
    return c(N), new n(N);
  }
  e.str = i;
  function u(p, v) {
    v instanceof n ? p.push(...v._items) : v instanceof r ? p.push(v) : p.push(h(v));
  }
  e.addCodeArg = u;
  function c(p) {
    let v = 1;
    for (; v < p.length - 1; ) {
      if (p[v] === a) {
        const N = d(p[v - 1], p[v + 1]);
        if (N !== void 0) {
          p.splice(v - 1, 3, N);
          continue;
        }
        p[v++] = "+";
      }
      v++;
    }
  }
  function d(p, v) {
    if (v === '""')
      return p;
    if (p === '""')
      return v;
    if (typeof p == "string")
      return v instanceof r || p[p.length - 1] !== '"' ? void 0 : typeof v != "string" ? `${p.slice(0, -1)}${v}"` : v[0] === '"' ? p.slice(0, -1) + v.slice(1) : void 0;
    if (typeof v == "string" && v[0] === '"' && !(p instanceof r))
      return `"${p}${v.slice(1)}`;
  }
  function l(p, v) {
    return v.emptyStr() ? p : p.emptyStr() ? v : i`${p}${v}`;
  }
  e.strConcat = l;
  function h(p) {
    return typeof p == "number" || typeof p == "boolean" || p === null ? p : _(Array.isArray(p) ? p.join(",") : p);
  }
  function P(p) {
    return new n(_(p));
  }
  e.stringify = P;
  function _(p) {
    return JSON.stringify(p).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = _;
  function E(p) {
    return typeof p == "string" && e.IDENTIFIER.test(p) ? new n(`.${p}`) : s`[${p}]`;
  }
  e.getProperty = E;
  function g(p) {
    if (typeof p == "string" && e.IDENTIFIER.test(p))
      return new n(`${p}`);
    throw new Error(`CodeGen: invalid export name: ${p}, use explicit $id name mapping`);
  }
  e.getEsmExportName = g;
  function $(p) {
    return new n(p.toString());
  }
  e.regexpCode = $;
})(Yr);
var Ks = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Yr;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: l } = {}) {
      this._names = {}, this._prefixes = d, this._parent = l;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const l = this._names[d] || this._nameGroup(d);
      return `${d}${l.index++}`;
    }
    _nameGroup(d) {
      var l, h;
      if (!((h = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(d, l) {
      super(l), this.prefix = d;
    }
    setValue(d, { property: l, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(l)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const i = (0, t._)`\n`;
  class u extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? i : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, l) {
      var h;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const P = this.toName(d), { prefix: _ } = P, E = (h = l.key) !== null && h !== void 0 ? h : l.ref;
      let g = this._values[_];
      if (g) {
        const v = g.get(E);
        if (v)
          return v;
      } else
        g = this._values[_] = /* @__PURE__ */ new Map();
      g.set(E, P);
      const $ = this._scope[_] || (this._scope[_] = []), p = $.length;
      return $[p] = l.ref, P.setValue(l, { property: _, itemIndex: p }), P;
    }
    getValue(d, l) {
      const h = this._values[d];
      if (h)
        return h.get(l);
    }
    scopeRefs(d, l = this._values) {
      return this._reduceValues(l, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, l, h) {
      return this._reduceValues(d, (P) => {
        if (P.value === void 0)
          throw new Error(`CodeGen: name "${P}" has no value`);
        return P.value.code;
      }, l, h);
    }
    _reduceValues(d, l, h = {}, P) {
      let _ = t.nil;
      for (const E in d) {
        const g = d[E];
        if (!g)
          continue;
        const $ = h[E] = h[E] || /* @__PURE__ */ new Map();
        g.forEach((p) => {
          if ($.has(p))
            return;
          $.set(p, n.Started);
          let v = l(p);
          if (v) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            _ = (0, t._)`${_}${N} ${p} = ${v};${this.opts._n}`;
          } else if (v = P == null ? void 0 : P(p))
            _ = (0, t._)`${_}${v}${this.opts._n}`;
          else
            throw new r(p);
          $.set(p, n.Completed);
        });
      }
      return _;
    }
  }
  e.ValueScope = u;
})(Ks);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Yr, r = Ks;
  var n = Yr;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = Ks;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(o, f) {
      return this;
    }
  }
  class i extends a {
    constructor(o, f, b) {
      super(), this.varKind = o, this.name = f, this.rhs = b;
    }
    render({ es5: o, _n: f }) {
      const b = o ? r.varKinds.var : this.varKind, j = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${j};` + f;
    }
    optimizeNames(o, f) {
      if (o[this.name.str])
        return this.rhs && (this.rhs = C(this.rhs, o, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class u extends a {
    constructor(o, f, b) {
      super(), this.lhs = o, this.rhs = f, this.sideEffects = b;
    }
    render({ _n: o }) {
      return `${this.lhs} = ${this.rhs};` + o;
    }
    optimizeNames(o, f) {
      if (!(this.lhs instanceof t.Name && !o[this.lhs.str] && !this.sideEffects))
        return this.rhs = C(this.rhs, o, f), this;
    }
    get names() {
      const o = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return de(o, this.rhs);
    }
  }
  class c extends u {
    constructor(o, f, b, j) {
      super(o, b, j), this.op = f;
    }
    render({ _n: o }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + o;
    }
  }
  class d extends a {
    constructor(o) {
      super(), this.label = o, this.names = {};
    }
    render({ _n: o }) {
      return `${this.label}:` + o;
    }
  }
  class l extends a {
    constructor(o) {
      super(), this.label = o, this.names = {};
    }
    render({ _n: o }) {
      return `break${this.label ? ` ${this.label}` : ""};` + o;
    }
  }
  class h extends a {
    constructor(o) {
      super(), this.error = o;
    }
    render({ _n: o }) {
      return `throw ${this.error};` + o;
    }
    get names() {
      return this.error.names;
    }
  }
  class P extends a {
    constructor(o) {
      super(), this.code = o;
    }
    render({ _n: o }) {
      return `${this.code};` + o;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(o, f) {
      return this.code = C(this.code, o, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class _ extends a {
    constructor(o = []) {
      super(), this.nodes = o;
    }
    render(o) {
      return this.nodes.reduce((f, b) => f + b.render(o), "");
    }
    optimizeNodes() {
      const { nodes: o } = this;
      let f = o.length;
      for (; f--; ) {
        const b = o[f].optimizeNodes();
        Array.isArray(b) ? o.splice(f, 1, ...b) : b ? o[f] = b : o.splice(f, 1);
      }
      return o.length > 0 ? this : void 0;
    }
    optimizeNames(o, f) {
      const { nodes: b } = this;
      let j = b.length;
      for (; j--; ) {
        const A = b[j];
        A.optimizeNames(o, f) || (k(o, A.names), b.splice(j, 1));
      }
      return b.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((o, f) => Q(o, f.names), {});
    }
  }
  class E extends _ {
    render(o) {
      return "{" + o._n + super.render(o) + "}" + o._n;
    }
  }
  class g extends _ {
  }
  class $ extends E {
  }
  $.kind = "else";
  class p extends E {
    constructor(o, f) {
      super(f), this.condition = o;
    }
    render(o) {
      let f = `if(${this.condition})` + super.render(o);
      return this.else && (f += "else " + this.else.render(o)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const o = this.condition;
      if (o === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const b = f.optimizeNodes();
        f = this.else = Array.isArray(b) ? new $(b) : b;
      }
      if (f)
        return o === !1 ? f instanceof p ? f : f.nodes : this.nodes.length ? this : new p(U(o), f instanceof p ? [f] : f.nodes);
      if (!(o === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(o, f) {
      var b;
      if (this.else = (b = this.else) === null || b === void 0 ? void 0 : b.optimizeNames(o, f), !!(super.optimizeNames(o, f) || this.else))
        return this.condition = C(this.condition, o, f), this;
    }
    get names() {
      const o = super.names;
      return de(o, this.condition), this.else && Q(o, this.else.names), o;
    }
  }
  p.kind = "if";
  class v extends E {
  }
  v.kind = "for";
  class N extends v {
    constructor(o) {
      super(), this.iteration = o;
    }
    render(o) {
      return `for(${this.iteration})` + super.render(o);
    }
    optimizeNames(o, f) {
      if (super.optimizeNames(o, f))
        return this.iteration = C(this.iteration, o, f), this;
    }
    get names() {
      return Q(super.names, this.iteration.names);
    }
  }
  class R extends v {
    constructor(o, f, b, j) {
      super(), this.varKind = o, this.name = f, this.from = b, this.to = j;
    }
    render(o) {
      const f = o.es5 ? r.varKinds.var : this.varKind, { name: b, from: j, to: A } = this;
      return `for(${f} ${b}=${j}; ${b}<${A}; ${b}++)` + super.render(o);
    }
    get names() {
      const o = de(super.names, this.from);
      return de(o, this.to);
    }
  }
  class I extends v {
    constructor(o, f, b, j) {
      super(), this.loop = o, this.varKind = f, this.name = b, this.iterable = j;
    }
    render(o) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(o);
    }
    optimizeNames(o, f) {
      if (super.optimizeNames(o, f))
        return this.iterable = C(this.iterable, o, f), this;
    }
    get names() {
      return Q(super.names, this.iterable.names);
    }
  }
  class z extends E {
    constructor(o, f, b) {
      super(), this.name = o, this.args = f, this.async = b;
    }
    render(o) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(o);
    }
  }
  z.kind = "func";
  class J extends _ {
    render(o) {
      return "return " + super.render(o);
    }
  }
  J.kind = "return";
  class ue extends E {
    render(o) {
      let f = "try" + super.render(o);
      return this.catch && (f += this.catch.render(o)), this.finally && (f += this.finally.render(o)), f;
    }
    optimizeNodes() {
      var o, f;
      return super.optimizeNodes(), (o = this.catch) === null || o === void 0 || o.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(o, f) {
      var b, j;
      return super.optimizeNames(o, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(o, f), (j = this.finally) === null || j === void 0 || j.optimizeNames(o, f), this;
    }
    get names() {
      const o = super.names;
      return this.catch && Q(o, this.catch.names), this.finally && Q(o, this.finally.names), o;
    }
  }
  class V extends E {
    constructor(o) {
      super(), this.error = o;
    }
    render(o) {
      return `catch(${this.error})` + super.render(o);
    }
  }
  V.kind = "catch";
  class H extends E {
    render(o) {
      return "finally" + super.render(o);
    }
  }
  H.kind = "finally";
  class ne {
    constructor(o, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = o, this._scope = new r.Scope({ parent: o }), this._nodes = [new g()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(o) {
      return this._scope.name(o);
    }
    // reserves unique name in the external scope
    scopeName(o) {
      return this._extScope.name(o);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(o, f) {
      const b = this._extScope.value(o, f);
      return (this._values[b.prefix] || (this._values[b.prefix] = /* @__PURE__ */ new Set())).add(b), b;
    }
    getScopeValue(o, f) {
      return this._extScope.getValue(o, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(o) {
      return this._extScope.scopeRefs(o, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(o, f, b, j) {
      const A = this._scope.toName(f);
      return b !== void 0 && j && (this._constants[A.str] = b), this._leafNode(new i(o, A, b)), A;
    }
    // `const` declaration (`var` in es5 mode)
    const(o, f, b) {
      return this._def(r.varKinds.const, o, f, b);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(o, f, b) {
      return this._def(r.varKinds.let, o, f, b);
    }
    // `var` declaration with optional assignment
    var(o, f, b) {
      return this._def(r.varKinds.var, o, f, b);
    }
    // assignment code
    assign(o, f, b) {
      return this._leafNode(new u(o, f, b));
    }
    // `+=` code
    add(o, f) {
      return this._leafNode(new c(o, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(o) {
      return typeof o == "function" ? o() : o !== t.nil && this._leafNode(new P(o)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...o) {
      const f = ["{"];
      for (const [b, j] of o)
        f.length > 1 && f.push(","), f.push(b), (b !== j || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, j));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(o, f, b) {
      if (this._blockNode(new p(o)), f && b)
        this.code(f).else().code(b).endIf();
      else if (f)
        this.code(f).endIf();
      else if (b)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(o) {
      return this._elseNode(new p(o));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new $());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(p, $);
    }
    _for(o, f) {
      return this._blockNode(o), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(o, f) {
      return this._for(new N(o), f);
    }
    // `for` statement for a range of values
    forRange(o, f, b, j, A = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const q = this._scope.toName(o);
      return this._for(new R(A, q, f, b), () => j(q));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(o, f, b, j = r.varKinds.const) {
      const A = this._scope.toName(o);
      if (this.opts.es5) {
        const q = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${q}.length`, (F) => {
          this.var(A, (0, t._)`${q}[${F}]`), b(A);
        });
      }
      return this._for(new I("of", j, A, f), () => b(A));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(o, f, b, j = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(o, (0, t._)`Object.keys(${f})`, b);
      const A = this._scope.toName(o);
      return this._for(new I("in", j, A, f), () => b(A));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(v);
    }
    // `label` statement
    label(o) {
      return this._leafNode(new d(o));
    }
    // `break` statement
    break(o) {
      return this._leafNode(new l(o));
    }
    // `return` statement
    return(o) {
      const f = new J();
      if (this._blockNode(f), this.code(o), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(J);
    }
    // `try` statement
    try(o, f, b) {
      if (!f && !b)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const j = new ue();
      if (this._blockNode(j), this.code(o), f) {
        const A = this.name("e");
        this._currNode = j.catch = new V(A), f(A);
      }
      return b && (this._currNode = j.finally = new H(), this.code(b)), this._endBlockNode(V, H);
    }
    // `throw` statement
    throw(o) {
      return this._leafNode(new h(o));
    }
    // start self-balancing block
    block(o, f) {
      return this._blockStarts.push(this._nodes.length), o && this.code(o).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(o) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const b = this._nodes.length - f;
      if (b < 0 || o !== void 0 && b !== o)
        throw new Error(`CodeGen: wrong number of nodes: ${b} vs ${o} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(o, f = t.nil, b, j) {
      return this._blockNode(new z(o, f, b)), j && this.code(j).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(z);
    }
    optimize(o = 1) {
      for (; o-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(o) {
      return this._currNode.nodes.push(o), this;
    }
    _blockNode(o) {
      this._currNode.nodes.push(o), this._nodes.push(o);
    }
    _endBlockNode(o, f) {
      const b = this._currNode;
      if (b instanceof o || f && b instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${o.kind}/${f.kind}` : o.kind}"`);
    }
    _elseNode(o) {
      const f = this._currNode;
      if (!(f instanceof p))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = o, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const o = this._nodes;
      return o[o.length - 1];
    }
    set _currNode(o) {
      const f = this._nodes;
      f[f.length - 1] = o;
    }
  }
  e.CodeGen = ne;
  function Q(y, o) {
    for (const f in o)
      y[f] = (y[f] || 0) + (o[f] || 0);
    return y;
  }
  function de(y, o) {
    return o instanceof t._CodeOrName ? Q(y, o.names) : y;
  }
  function C(y, o, f) {
    if (y instanceof t.Name)
      return b(y);
    if (!j(y))
      return y;
    return new t._Code(y._items.reduce((A, q) => (q instanceof t.Name && (q = b(q)), q instanceof t._Code ? A.push(...q._items) : A.push(q), A), []));
    function b(A) {
      const q = f[A.str];
      return q === void 0 || o[A.str] !== 1 ? A : (delete o[A.str], q);
    }
    function j(A) {
      return A instanceof t._Code && A._items.some((q) => q instanceof t.Name && o[q.str] === 1 && f[q.str] !== void 0);
    }
  }
  function k(y, o) {
    for (const f in o)
      y[f] = (y[f] || 0) - (o[f] || 0);
  }
  function U(y) {
    return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, t._)`!${S(y)}`;
  }
  e.not = U;
  const D = m(e.operators.AND);
  function O(...y) {
    return y.reduce(D);
  }
  e.and = O;
  const T = m(e.operators.OR);
  function w(...y) {
    return y.reduce(T);
  }
  e.or = w;
  function m(y) {
    return (o, f) => o === t.nil ? f : f === t.nil ? o : (0, t._)`${S(o)} ${y} ${S(f)}`;
  }
  function S(y) {
    return y instanceof t.Name ? y : (0, t._)`(${y})`;
  }
})(Z);
var L = {};
Object.defineProperty(L, "__esModule", { value: !0 });
L.checkStrictMode = L.getErrorPath = L.Type = L.useFunc = L.setEvaluated = L.evaluatedPropsToName = L.mergeEvaluated = L.eachItem = L.unescapeJsonPointer = L.escapeJsonPointer = L.escapeFragment = L.unescapeFragment = L.schemaRefOrVal = L.schemaHasRulesButRef = L.schemaHasRules = L.checkUnknownRules = L.alwaysValidSchema = L.toHash = void 0;
const ce = Z, wy = Yr;
function Ey(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
L.toHash = Ey;
function Sy(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Fl(e, t), !Vl(t, e.self.RULES.all));
}
L.alwaysValidSchema = Sy;
function Fl(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || ql(e, `unknown keyword: "${a}"`);
}
L.checkUnknownRules = Fl;
function Vl(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
L.schemaHasRules = Vl;
function by(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
L.schemaHasRulesButRef = by;
function Py({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ce._)`${r}`;
  }
  return (0, ce._)`${e}${t}${(0, ce.getProperty)(n)}`;
}
L.schemaRefOrVal = Py;
function Ny(e) {
  return Ul(decodeURIComponent(e));
}
L.unescapeFragment = Ny;
function Oy(e) {
  return encodeURIComponent(to(e));
}
L.escapeFragment = Oy;
function to(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
L.escapeJsonPointer = to;
function Ul(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
L.unescapeJsonPointer = Ul;
function Ry(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
L.eachItem = Ry;
function Ni({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, i, u) => {
    const c = i === void 0 ? a : i instanceof ce.Name ? (a instanceof ce.Name ? e(s, a, i) : t(s, a, i), i) : a instanceof ce.Name ? (t(s, i, a), a) : r(a, i);
    return u === ce.Name && !(c instanceof ce.Name) ? n(s, c) : c;
  };
}
L.mergeEvaluated = {
  props: Ni({
    mergeNames: (e, t, r) => e.if((0, ce._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ce._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ce._)`${r} || {}`).code((0, ce._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ce._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ce._)`${r} || {}`), ro(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: zl
  }),
  items: Ni({
    mergeNames: (e, t, r) => e.if((0, ce._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ce._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ce._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ce._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function zl(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ce._)`{}`);
  return t !== void 0 && ro(e, r, t), r;
}
L.evaluatedPropsToName = zl;
function ro(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ce._)`${t}${(0, ce.getProperty)(n)}`, !0));
}
L.setEvaluated = ro;
const Oi = {};
function Ty(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Oi[t.code] || (Oi[t.code] = new wy._Code(t.code))
  });
}
L.useFunc = Ty;
var Gs;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Gs || (L.Type = Gs = {}));
function Iy(e, t, r) {
  if (e instanceof ce.Name) {
    const n = t === Gs.Num;
    return r ? n ? (0, ce._)`"[" + ${e} + "]"` : (0, ce._)`"['" + ${e} + "']"` : n ? (0, ce._)`"/" + ${e}` : (0, ce._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ce.getProperty)(e).toString() : "/" + to(e);
}
L.getErrorPath = Iy;
function ql(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
L.checkStrictMode = ql;
var lt = {};
Object.defineProperty(lt, "__esModule", { value: !0 });
const Oe = Z, jy = {
  // validation function arguments
  data: new Oe.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Oe.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Oe.Name("instancePath"),
  parentData: new Oe.Name("parentData"),
  parentDataProperty: new Oe.Name("parentDataProperty"),
  rootData: new Oe.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Oe.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Oe.Name("vErrors"),
  // null or array of validation errors
  errors: new Oe.Name("errors"),
  // counter of validation errors
  this: new Oe.Name("this"),
  // "globals"
  self: new Oe.Name("self"),
  scope: new Oe.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Oe.Name("json"),
  jsonPos: new Oe.Name("jsonPos"),
  jsonLen: new Oe.Name("jsonLen"),
  jsonPart: new Oe.Name("jsonPart")
};
lt.default = jy;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = Z, r = L, n = lt;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: p }) => p ? (0, t.str)`"${$}" keyword must be ${p} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, p = e.keywordError, v, N) {
    const { it: R } = $, { gen: I, compositeRule: z, allErrors: J } = R, ue = h($, p, v);
    N ?? (z || J) ? c(I, ue) : d(R, (0, t._)`[${ue}]`);
  }
  e.reportError = s;
  function a($, p = e.keywordError, v) {
    const { it: N } = $, { gen: R, compositeRule: I, allErrors: z } = N, J = h($, p, v);
    c(R, J), I || z || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function i($, p) {
    $.assign(n.default.errors, p), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(p, () => $.assign((0, t._)`${n.default.vErrors}.length`, p), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = i;
  function u({ gen: $, keyword: p, schemaValue: v, data: N, errsCount: R, it: I }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const z = $.name("err");
    $.forRange("i", R, n.default.errors, (J) => {
      $.const(z, (0, t._)`${n.default.vErrors}[${J}]`), $.if((0, t._)`${z}.instancePath === undefined`, () => $.assign((0, t._)`${z}.instancePath`, (0, t.strConcat)(n.default.instancePath, I.errorPath))), $.assign((0, t._)`${z}.schemaPath`, (0, t.str)`${I.errSchemaPath}/${p}`), I.opts.verbose && ($.assign((0, t._)`${z}.schema`, v), $.assign((0, t._)`${z}.data`, N));
    });
  }
  e.extendErrors = u;
  function c($, p) {
    const v = $.const("err", p);
    $.if((0, t._)`${n.default.vErrors} === null`, () => $.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), $.code((0, t._)`${n.default.errors}++`);
  }
  function d($, p) {
    const { gen: v, validateName: N, schemaEnv: R } = $;
    R.$async ? v.throw((0, t._)`new ${$.ValidationError}(${p})`) : (v.assign((0, t._)`${N}.errors`, p), v.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h($, p, v) {
    const { createErrors: N } = $.it;
    return N === !1 ? (0, t._)`{}` : P($, p, v);
  }
  function P($, p, v = {}) {
    const { gen: N, it: R } = $, I = [
      _(R, v),
      E($, v)
    ];
    return g($, p, I), N.object(...I);
  }
  function _({ errorPath: $ }, { instancePath: p }) {
    const v = p ? (0, t.str)`${$}${(0, r.getErrorPath)(p, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function E({ keyword: $, it: { errSchemaPath: p } }, { schemaPath: v, parentSchema: N }) {
    let R = N ? p : (0, t.str)`${p}/${$}`;
    return v && (R = (0, t.str)`${R}${(0, r.getErrorPath)(v, r.Type.Str)}`), [l.schemaPath, R];
  }
  function g($, { params: p, message: v }, N) {
    const { keyword: R, data: I, schemaValue: z, it: J } = $, { opts: ue, propertyName: V, topSchemaRef: H, schemaPath: ne } = J;
    N.push([l.keyword, R], [l.params, typeof p == "function" ? p($) : p || (0, t._)`{}`]), ue.messages && N.push([l.message, typeof v == "function" ? v($) : v]), ue.verbose && N.push([l.schema, z], [l.parentSchema, (0, t._)`${H}${ne}`], [n.default.data, I]), V && N.push([l.propertyName, V]);
  }
})(en);
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.boolOrEmptySchema = _r.topBoolOrEmptySchema = void 0;
const Ay = en, ky = Z, Cy = lt, Dy = {
  message: "boolean schema is false"
};
function My(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Kl(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Cy.default.data) : (t.assign((0, ky._)`${n}.errors`, null), t.return(!0));
}
_r.topBoolOrEmptySchema = My;
function Ly(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Kl(e)) : r.var(t, !0);
}
_r.boolOrEmptySchema = Ly;
function Kl(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, Ay.reportError)(s, Dy, void 0, t);
}
var _e = {}, Zt = {};
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.getRules = Zt.isJSONType = void 0;
const Fy = ["string", "number", "integer", "boolean", "null", "object", "array"], Vy = new Set(Fy);
function Uy(e) {
  return typeof e == "string" && Vy.has(e);
}
Zt.isJSONType = Uy;
function zy() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
Zt.getRules = zy;
var ft = {};
Object.defineProperty(ft, "__esModule", { value: !0 });
ft.shouldUseRule = ft.shouldUseGroup = ft.schemaHasRulesForType = void 0;
function qy({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Gl(e, n);
}
ft.schemaHasRulesForType = qy;
function Gl(e, t) {
  return t.rules.some((r) => Hl(e, r));
}
ft.shouldUseGroup = Gl;
function Hl(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
ft.shouldUseRule = Hl;
Object.defineProperty(_e, "__esModule", { value: !0 });
_e.reportTypeError = _e.checkDataTypes = _e.checkDataType = _e.coerceAndCheckDataType = _e.getJSONTypes = _e.getSchemaTypes = _e.DataType = void 0;
const Ky = Zt, Gy = ft, Hy = en, Y = Z, Jl = L;
var fr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(fr || (_e.DataType = fr = {}));
function Jy(e) {
  const t = Wl(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
_e.getSchemaTypes = Jy;
function Wl(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Ky.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
_e.getJSONTypes = Wl;
function Wy(e, t) {
  const { gen: r, data: n, opts: s } = e, a = By(t, s.coerceTypes), i = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, Gy.schemaHasRulesForType)(e, t[0]));
  if (i) {
    const u = no(t, n, s.strictNumbers, fr.Wrong);
    r.if(u, () => {
      a.length ? Xy(e, t, a) : so(e);
    });
  }
  return i;
}
_e.coerceAndCheckDataType = Wy;
const Bl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function By(e, t) {
  return t ? e.filter((r) => Bl.has(r) || t === "array" && r === "array") : [];
}
function Xy(e, t, r) {
  const { gen: n, data: s, opts: a } = e, i = n.let("dataType", (0, Y._)`typeof ${s}`), u = n.let("coerced", (0, Y._)`undefined`);
  a.coerceTypes === "array" && n.if((0, Y._)`${i} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Y._)`${s}[0]`).assign(i, (0, Y._)`typeof ${s}`).if(no(t, s, a.strictNumbers), () => n.assign(u, s))), n.if((0, Y._)`${u} !== undefined`);
  for (const d of r)
    (Bl.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), so(e), n.endIf(), n.if((0, Y._)`${u} !== undefined`, () => {
    n.assign(s, u), Yy(e, u);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, Y._)`${i} == "number" || ${i} == "boolean"`).assign(u, (0, Y._)`"" + ${s}`).elseIf((0, Y._)`${s} === null`).assign(u, (0, Y._)`""`);
        return;
      case "number":
        n.elseIf((0, Y._)`${i} == "boolean" || ${s} === null
              || (${i} == "string" && ${s} && ${s} == +${s})`).assign(u, (0, Y._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, Y._)`${i} === "boolean" || ${s} === null
              || (${i} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(u, (0, Y._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, Y._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(u, !1).elseIf((0, Y._)`${s} === "true" || ${s} === 1`).assign(u, !0);
        return;
      case "null":
        n.elseIf((0, Y._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(u, null);
        return;
      case "array":
        n.elseIf((0, Y._)`${i} === "string" || ${i} === "number"
              || ${i} === "boolean" || ${s} === null`).assign(u, (0, Y._)`[${s}]`);
    }
  }
}
function Yy({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Y._)`${t} !== undefined`, () => e.assign((0, Y._)`${t}[${r}]`, n));
}
function Hs(e, t, r, n = fr.Correct) {
  const s = n === fr.Correct ? Y.operators.EQ : Y.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, Y._)`${t} ${s} null`;
    case "array":
      a = (0, Y._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, Y._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = i((0, Y._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = i();
      break;
    default:
      return (0, Y._)`typeof ${t} ${s} ${e}`;
  }
  return n === fr.Correct ? a : (0, Y.not)(a);
  function i(u = Y.nil) {
    return (0, Y.and)((0, Y._)`typeof ${t} == "number"`, u, r ? (0, Y._)`isFinite(${t})` : Y.nil);
  }
}
_e.checkDataType = Hs;
function no(e, t, r, n) {
  if (e.length === 1)
    return Hs(e[0], t, r, n);
  let s;
  const a = (0, Jl.toHash)(e);
  if (a.array && a.object) {
    const i = (0, Y._)`typeof ${t} != "object"`;
    s = a.null ? i : (0, Y._)`!${t} || ${i}`, delete a.null, delete a.array, delete a.object;
  } else
    s = Y.nil;
  a.number && delete a.integer;
  for (const i in a)
    s = (0, Y.and)(s, Hs(i, t, r, n));
  return s;
}
_e.checkDataTypes = no;
const Qy = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Y._)`{type: ${e}}` : (0, Y._)`{type: ${t}}`
};
function so(e) {
  const t = Zy(e);
  (0, Hy.reportError)(t, Qy);
}
_e.reportTypeError = so;
function Zy(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Jl.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var ts = {};
Object.defineProperty(ts, "__esModule", { value: !0 });
ts.assignDefaults = void 0;
const rr = Z, xy = L;
function e$(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Ri(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => Ri(e, a, s.default));
}
ts.assignDefaults = e$;
function Ri(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: i } = e;
  if (r === void 0)
    return;
  const u = (0, rr._)`${a}${(0, rr.getProperty)(t)}`;
  if (s) {
    (0, xy.checkStrictMode)(e, `default is ignored for: ${u}`);
    return;
  }
  let c = (0, rr._)`${u} === undefined`;
  i.useDefaults === "empty" && (c = (0, rr._)`${c} || ${u} === null || ${u} === ""`), n.if(c, (0, rr._)`${u} = ${(0, rr.stringify)(r)}`);
}
var it = {}, ee = {};
Object.defineProperty(ee, "__esModule", { value: !0 });
ee.validateUnion = ee.validateArray = ee.usePattern = ee.callValidateCode = ee.schemaProperties = ee.allSchemaProperties = ee.noPropertyInData = ee.propertyInData = ee.isOwnProperty = ee.hasPropFunc = ee.reportMissingProp = ee.checkMissingProp = ee.checkReportMissingProp = void 0;
const he = Z, ao = L, $t = lt, t$ = L;
function r$(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(io(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, he._)`${t}` }, !0), e.error();
  });
}
ee.checkReportMissingProp = r$;
function n$({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, he.or)(...n.map((a) => (0, he.and)(io(e, t, a, r.ownProperties), (0, he._)`${s} = ${a}`)));
}
ee.checkMissingProp = n$;
function s$(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ee.reportMissingProp = s$;
function Xl(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, he._)`Object.prototype.hasOwnProperty`
  });
}
ee.hasPropFunc = Xl;
function oo(e, t, r) {
  return (0, he._)`${Xl(e)}.call(${t}, ${r})`;
}
ee.isOwnProperty = oo;
function a$(e, t, r, n) {
  const s = (0, he._)`${t}${(0, he.getProperty)(r)} !== undefined`;
  return n ? (0, he._)`${s} && ${oo(e, t, r)}` : s;
}
ee.propertyInData = a$;
function io(e, t, r, n) {
  const s = (0, he._)`${t}${(0, he.getProperty)(r)} === undefined`;
  return n ? (0, he.or)(s, (0, he.not)(oo(e, t, r))) : s;
}
ee.noPropertyInData = io;
function Yl(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ee.allSchemaProperties = Yl;
function o$(e, t) {
  return Yl(t).filter((r) => !(0, ao.alwaysValidSchema)(e, t[r]));
}
ee.schemaProperties = o$;
function i$({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: i }, u, c, d) {
  const l = d ? (0, he._)`${e}, ${t}, ${n}${s}` : t, h = [
    [$t.default.instancePath, (0, he.strConcat)($t.default.instancePath, a)],
    [$t.default.parentData, i.parentData],
    [$t.default.parentDataProperty, i.parentDataProperty],
    [$t.default.rootData, $t.default.rootData]
  ];
  i.opts.dynamicRef && h.push([$t.default.dynamicAnchors, $t.default.dynamicAnchors]);
  const P = (0, he._)`${l}, ${r.object(...h)}`;
  return c !== he.nil ? (0, he._)`${u}.call(${c}, ${P})` : (0, he._)`${u}(${P})`;
}
ee.callValidateCode = i$;
const c$ = (0, he._)`new RegExp`;
function l$({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, he._)`${s.code === "new RegExp" ? c$ : (0, t$.useFunc)(e, s)}(${r}, ${n})`
  });
}
ee.usePattern = l$;
function u$(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const u = t.let("valid", !0);
    return i(() => t.assign(u, !1)), u;
  }
  return t.var(a, !0), i(() => t.break()), a;
  function i(u) {
    const c = t.const("len", (0, he._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: ao.Type.Num
      }, a), t.if((0, he.not)(a), u);
    });
  }
}
ee.validateArray = u$;
function d$(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, ao.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const i = t.let("valid", !1), u = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, u);
    t.assign(i, (0, he._)`${i} || ${u}`), e.mergeValidEvaluated(l, u) || t.if((0, he.not)(i));
  })), e.result(i, () => e.reset(), () => e.error(!0));
}
ee.validateUnion = d$;
Object.defineProperty(it, "__esModule", { value: !0 });
it.validateKeywordUsage = it.validSchemaType = it.funcKeywordCode = it.macroKeywordCode = void 0;
const je = Z, Wt = lt, f$ = ee, h$ = en;
function p$(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: i } = e, u = t.macro.call(i.self, s, a, i), c = Ql(r, n, u);
  i.opts.validateSchema !== !1 && i.self.validateSchema(u, !0);
  const d = r.name("valid");
  e.subschema({
    schema: u,
    schemaPath: je.nil,
    errSchemaPath: `${i.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
it.macroKeywordCode = p$;
function m$(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: i, $data: u, it: c } = e;
  $$(c, t);
  const d = !u && t.compile ? t.compile.call(c.self, a, i, c) : t.validate, l = Ql(n, s, d), h = n.let("valid");
  e.block$data(h, P), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function P() {
    if (t.errors === !1)
      g(), t.modifying && Ti(e), $(() => e.error());
    else {
      const p = t.async ? _() : E();
      t.modifying && Ti(e), $(() => y$(e, p));
    }
  }
  function _() {
    const p = n.let("ruleErrs", null);
    return n.try(() => g((0, je._)`await `), (v) => n.assign(h, !1).if((0, je._)`${v} instanceof ${c.ValidationError}`, () => n.assign(p, (0, je._)`${v}.errors`), () => n.throw(v))), p;
  }
  function E() {
    const p = (0, je._)`${l}.errors`;
    return n.assign(p, null), g(je.nil), p;
  }
  function g(p = t.async ? (0, je._)`await ` : je.nil) {
    const v = c.opts.passContext ? Wt.default.this : Wt.default.self, N = !("compile" in t && !u || t.schema === !1);
    n.assign(h, (0, je._)`${p}${(0, f$.callValidateCode)(e, l, v, N)}`, t.modifying);
  }
  function $(p) {
    var v;
    n.if((0, je.not)((v = t.valid) !== null && v !== void 0 ? v : h), p);
  }
}
it.funcKeywordCode = m$;
function Ti(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, je._)`${n.parentData}[${n.parentDataProperty}]`));
}
function y$(e, t) {
  const { gen: r } = e;
  r.if((0, je._)`Array.isArray(${t})`, () => {
    r.assign(Wt.default.vErrors, (0, je._)`${Wt.default.vErrors} === null ? ${t} : ${Wt.default.vErrors}.concat(${t})`).assign(Wt.default.errors, (0, je._)`${Wt.default.vErrors}.length`), (0, h$.extendErrors)(e);
  }, () => e.error());
}
function $$({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Ql(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, je.stringify)(r) });
}
function _$(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
it.validSchemaType = _$;
function g$({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const i = s.dependencies;
  if (i != null && i.some((u) => !Object.prototype.hasOwnProperty.call(e, u)))
    throw new Error(`parent schema must have dependencies of ${a}: ${i.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
it.validateKeywordUsage = g$;
var Pt = {};
Object.defineProperty(Pt, "__esModule", { value: !0 });
Pt.extendSubschemaMode = Pt.extendSubschemaData = Pt.getSubschema = void 0;
const nt = Z, Zl = L;
function v$(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: i }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const u = e.schema[t];
    return r === void 0 ? {
      schema: u,
      schemaPath: (0, nt._)`${e.schemaPath}${(0, nt.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: u[r],
      schemaPath: (0, nt._)`${e.schemaPath}${(0, nt.getProperty)(t)}${(0, nt.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Zl.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || i === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: i,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Pt.getSubschema = v$;
function w$(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: i }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: u } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: h } = t, P = u.let("data", (0, nt._)`${t.data}${(0, nt.getProperty)(r)}`, !0);
    c(P), e.errorPath = (0, nt.str)`${d}${(0, Zl.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, nt._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof nt.Name ? s : u.let("data", s, !0);
    c(d), i !== void 0 && (e.propertyName = i);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Pt.extendSubschemaData = w$;
function E$(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Pt.extendSubschemaMode = E$;
var be = {}, xl = { exports: {} }, St = xl.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  jn(t, n, s, e, "", e);
};
St.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
St.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
St.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
St.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function jn(e, t, r, n, s, a, i, u, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, i, u, c, d);
    for (var l in n) {
      var h = n[l];
      if (Array.isArray(h)) {
        if (l in St.arrayKeywords)
          for (var P = 0; P < h.length; P++)
            jn(e, t, r, h[P], s + "/" + l + "/" + P, a, s, l, n, P);
      } else if (l in St.propsKeywords) {
        if (h && typeof h == "object")
          for (var _ in h)
            jn(e, t, r, h[_], s + "/" + l + "/" + S$(_), a, s, l, n, _);
      } else (l in St.keywords || e.allKeys && !(l in St.skipKeywords)) && jn(e, t, r, h, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, i, u, c, d);
  }
}
function S$(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var b$ = xl.exports;
Object.defineProperty(be, "__esModule", { value: !0 });
be.getSchemaRefs = be.resolveUrl = be.normalizeId = be._getFullPath = be.getFullPath = be.inlineRef = void 0;
const P$ = L, N$ = Xn, O$ = b$, R$ = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function T$(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Js(e) : t ? eu(e) <= t : !1;
}
be.inlineRef = T$;
const I$ = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Js(e) {
  for (const t in e) {
    if (I$.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Js) || typeof r == "object" && Js(r))
      return !0;
  }
  return !1;
}
function eu(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !R$.has(r) && (typeof e[r] == "object" && (0, P$.eachItem)(e[r], (n) => t += eu(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function tu(e, t = "", r) {
  r !== !1 && (t = hr(t));
  const n = e.parse(t);
  return ru(e, n);
}
be.getFullPath = tu;
function ru(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
be._getFullPath = ru;
const j$ = /#\/?$/;
function hr(e) {
  return e ? e.replace(j$, "") : "";
}
be.normalizeId = hr;
function A$(e, t, r) {
  return r = hr(r), e.resolve(t, r);
}
be.resolveUrl = A$;
const k$ = /^[a-z_][-a-z0-9._]*$/i;
function C$(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = hr(e[r] || t), a = { "": s }, i = tu(n, s, !1), u = {}, c = /* @__PURE__ */ new Set();
  return O$(e, { allKeys: !0 }, (h, P, _, E) => {
    if (E === void 0)
      return;
    const g = i + P;
    let $ = a[E];
    typeof h[r] == "string" && ($ = p.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), a[P] = $;
    function p(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = hr($ ? R($, N) : N), c.has(N))
        throw l(N);
      c.add(N);
      let I = this.refs[N];
      return typeof I == "string" && (I = this.refs[I]), typeof I == "object" ? d(h, I.schema, N) : N !== hr(g) && (N[0] === "#" ? (d(h, u[N], N), u[N] = h) : this.refs[N] = g), N;
    }
    function v(N) {
      if (typeof N == "string") {
        if (!k$.test(N))
          throw new Error(`invalid anchor "${N}"`);
        p.call(this, `#${N}`);
      }
    }
  }), u;
  function d(h, P, _) {
    if (P !== void 0 && !N$(h, P))
      throw l(_);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
be.getSchemaRefs = C$;
Object.defineProperty(Ze, "__esModule", { value: !0 });
Ze.getData = Ze.KeywordCxt = Ze.validateFunctionCode = void 0;
const nu = _r, Ii = _e, co = ft, qn = _e, D$ = ts, Kr = it, _s = Pt, G = Z, B = lt, M$ = be, ht = L, Ar = en;
function L$(e) {
  if (ou(e) && (iu(e), au(e))) {
    U$(e);
    return;
  }
  su(e, () => (0, nu.topBoolOrEmptySchema)(e));
}
Ze.validateFunctionCode = L$;
function su({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, G._)`${B.default.data}, ${B.default.valCxt}`, n.$async, () => {
    e.code((0, G._)`"use strict"; ${ji(r, s)}`), V$(e, s), e.code(a);
  }) : e.func(t, (0, G._)`${B.default.data}, ${F$(s)}`, n.$async, () => e.code(ji(r, s)).code(a));
}
function F$(e) {
  return (0, G._)`{${B.default.instancePath}="", ${B.default.parentData}, ${B.default.parentDataProperty}, ${B.default.rootData}=${B.default.data}${e.dynamicRef ? (0, G._)`, ${B.default.dynamicAnchors}={}` : G.nil}}={}`;
}
function V$(e, t) {
  e.if(B.default.valCxt, () => {
    e.var(B.default.instancePath, (0, G._)`${B.default.valCxt}.${B.default.instancePath}`), e.var(B.default.parentData, (0, G._)`${B.default.valCxt}.${B.default.parentData}`), e.var(B.default.parentDataProperty, (0, G._)`${B.default.valCxt}.${B.default.parentDataProperty}`), e.var(B.default.rootData, (0, G._)`${B.default.valCxt}.${B.default.rootData}`), t.dynamicRef && e.var(B.default.dynamicAnchors, (0, G._)`${B.default.valCxt}.${B.default.dynamicAnchors}`);
  }, () => {
    e.var(B.default.instancePath, (0, G._)`""`), e.var(B.default.parentData, (0, G._)`undefined`), e.var(B.default.parentDataProperty, (0, G._)`undefined`), e.var(B.default.rootData, B.default.data), t.dynamicRef && e.var(B.default.dynamicAnchors, (0, G._)`{}`);
  });
}
function U$(e) {
  const { schema: t, opts: r, gen: n } = e;
  su(e, () => {
    r.$comment && t.$comment && lu(e), H$(e), n.let(B.default.vErrors, null), n.let(B.default.errors, 0), r.unevaluated && z$(e), cu(e), B$(e);
  });
}
function z$(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, G._)`${r}.evaluated`), t.if((0, G._)`${e.evaluated}.dynamicProps`, () => t.assign((0, G._)`${e.evaluated}.props`, (0, G._)`undefined`)), t.if((0, G._)`${e.evaluated}.dynamicItems`, () => t.assign((0, G._)`${e.evaluated}.items`, (0, G._)`undefined`));
}
function ji(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, G._)`/*# sourceURL=${r} */` : G.nil;
}
function q$(e, t) {
  if (ou(e) && (iu(e), au(e))) {
    K$(e, t);
    return;
  }
  (0, nu.boolOrEmptySchema)(e, t);
}
function au({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function ou(e) {
  return typeof e.schema != "boolean";
}
function K$(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && lu(e), J$(e), W$(e);
  const a = n.const("_errs", B.default.errors);
  cu(e, a), n.var(t, (0, G._)`${a} === ${B.default.errors}`);
}
function iu(e) {
  (0, ht.checkUnknownRules)(e), G$(e);
}
function cu(e, t) {
  if (e.opts.jtd)
    return Ai(e, [], !1, t);
  const r = (0, Ii.getSchemaTypes)(e.schema), n = (0, Ii.coerceAndCheckDataType)(e, r);
  Ai(e, r, !n, t);
}
function G$(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, ht.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function H$(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, ht.checkStrictMode)(e, "default is ignored in the schema root");
}
function J$(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, M$.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function W$(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function lu({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, G._)`${B.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const i = (0, G.str)`${n}/$comment`, u = e.scopeValue("root", { ref: t.root });
    e.code((0, G._)`${B.default.self}.opts.$comment(${a}, ${i}, ${u}.schema)`);
  }
}
function B$(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, G._)`${B.default.errors} === 0`, () => t.return(B.default.data), () => t.throw((0, G._)`new ${s}(${B.default.vErrors})`)) : (t.assign((0, G._)`${n}.errors`, B.default.vErrors), a.unevaluated && X$(e), t.return((0, G._)`${B.default.errors} === 0`));
}
function X$({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof G.Name && e.assign((0, G._)`${t}.props`, r), n instanceof G.Name && e.assign((0, G._)`${t}.items`, n);
}
function Ai(e, t, r, n) {
  const { gen: s, schema: a, data: i, allErrors: u, opts: c, self: d } = e, { RULES: l } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, ht.schemaHasRulesButRef)(a, l))) {
    s.block(() => fu(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || Y$(e, t), s.block(() => {
    for (const P of l.rules)
      h(P);
    h(l.post);
  });
  function h(P) {
    (0, co.shouldUseGroup)(a, P) && (P.type ? (s.if((0, qn.checkDataType)(P.type, i, c.strictNumbers)), ki(e, P), t.length === 1 && t[0] === P.type && r && (s.else(), (0, qn.reportTypeError)(e)), s.endIf()) : ki(e, P), u || s.if((0, G._)`${B.default.errors} === ${n || 0}`));
  }
}
function ki(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, D$.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, co.shouldUseRule)(n, a) && fu(e, a.keyword, a.definition, t.type);
  });
}
function Y$(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (Q$(e, t), e.opts.allowUnionTypes || Z$(e, t), x$(e, e.dataTypes));
}
function Q$(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      uu(e.dataTypes, r) || lo(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), t_(e, t);
  }
}
function Z$(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && lo(e, "use allowUnionTypes to allow union type keyword");
}
function x$(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, co.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((i) => e_(t, i)) && lo(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function e_(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function uu(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function t_(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    uu(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function lo(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, ht.checkStrictMode)(e, t, e.opts.strictTypes);
}
class du {
  constructor(t, r, n) {
    if ((0, Kr.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, ht.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", hu(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Kr.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", B.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, G.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, G.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, G._)`${r} !== undefined && (${(0, G.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Ar.reportExtraError : Ar.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Ar.reportError)(this, this.def.$dataError || Ar.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Ar.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = G.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = G.nil, r = G.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: i } = this;
    n.if((0, G.or)((0, G._)`${s} === undefined`, r)), t !== G.nil && n.assign(t, !0), (a.length || i.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== G.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, G.or)(i(), u());
    function i() {
      if (n.length) {
        if (!(r instanceof G.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, G._)`${(0, qn.checkDataTypes)(c, r, a.opts.strictNumbers, qn.DataType.Wrong)}`;
      }
      return G.nil;
    }
    function u() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, G._)`!${c}(${r})`;
      }
      return G.nil;
    }
  }
  subschema(t, r) {
    const n = (0, _s.getSubschema)(this.it, t);
    (0, _s.extendSubschemaData)(n, this.it, t), (0, _s.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return q$(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = ht.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = ht.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, G.Name)), !0;
  }
}
Ze.KeywordCxt = du;
function fu(e, t, r, n) {
  const s = new du(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Kr.funcKeywordCode)(s, r) : "macro" in r ? (0, Kr.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Kr.funcKeywordCode)(s, r);
}
const r_ = /^\/(?:[^~]|~0|~1)*$/, n_ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function hu(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return B.default.rootData;
  if (e[0] === "/") {
    if (!r_.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = B.default.rootData;
  } else {
    const d = n_.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +d[1];
    if (s = d[2], s === "#") {
      if (l >= t)
        throw new Error(c("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(c("data", l));
    if (a = r[t - l], !s)
      return a;
  }
  let i = a;
  const u = s.split("/");
  for (const d of u)
    d && (a = (0, G._)`${a}${(0, G.getProperty)((0, ht.unescapeJsonPointer)(d))}`, i = (0, G._)`${i} && ${a}`);
  return i;
  function c(d, l) {
    return `Cannot access ${d} ${l} levels up, current level is ${t}`;
  }
}
Ze.getData = hu;
var tn = {};
Object.defineProperty(tn, "__esModule", { value: !0 });
class s_ extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
tn.default = s_;
var Sr = {};
Object.defineProperty(Sr, "__esModule", { value: !0 });
const gs = be;
class a_ extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, gs.resolveUrl)(t, r, n), this.missingSchema = (0, gs.normalizeId)((0, gs.getFullPath)(t, this.missingRef));
  }
}
Sr.default = a_;
var Le = {};
Object.defineProperty(Le, "__esModule", { value: !0 });
Le.resolveSchema = Le.getCompilingSchema = Le.resolveRef = Le.compileSchema = Le.SchemaEnv = void 0;
const Je = Z, o_ = tn, qt = lt, Ye = be, Ci = L, i_ = Ze;
class rs {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Ye.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Le.SchemaEnv = rs;
function uo(e) {
  const t = pu.call(this, e);
  if (t)
    return t;
  const r = (0, Ye.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, i = new Je.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let u;
  e.$async && (u = i.scopeValue("Error", {
    ref: o_.default,
    code: (0, Je._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = i.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: i,
    allErrors: this.opts.allErrors,
    data: qt.default.data,
    parentData: qt.default.parentData,
    parentDataProperty: qt.default.parentDataProperty,
    dataNames: [qt.default.data],
    dataPathArr: [Je.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: i.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Je.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: u,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Je.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Je._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, i_.validateFunctionCode)(d), i.optimize(this.opts.code.optimize);
    const h = i.toString();
    l = `${i.scopeRefs(qt.default.scope)}return ${h}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const _ = new Function(`${qt.default.self}`, `${qt.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: _ }), _.errors = null, _.schema = e.schema, _.schemaEnv = e, e.$async && (_.$async = !0), this.opts.code.source === !0 && (_.source = { validateName: c, validateCode: h, scopeValues: i._values }), this.opts.unevaluated) {
      const { props: E, items: g } = d;
      _.evaluated = {
        props: E instanceof Je.Name ? void 0 : E,
        items: g instanceof Je.Name ? void 0 : g,
        dynamicProps: E instanceof Je.Name,
        dynamicItems: g instanceof Je.Name
      }, _.source && (_.source.evaluated = (0, Je.stringify)(_.evaluated));
    }
    return e.validate = _, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), h;
  } finally {
    this._compilations.delete(e);
  }
}
Le.compileSchema = uo;
function c_(e, t, r) {
  var n;
  r = (0, Ye.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = d_.call(this, e, r);
  if (a === void 0) {
    const i = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: u } = this.opts;
    i && (a = new rs({ schema: i, schemaId: u, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = l_.call(this, a);
}
Le.resolveRef = c_;
function l_(e) {
  return (0, Ye.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : uo.call(this, e);
}
function pu(e) {
  for (const t of this._compilations)
    if (u_(t, e))
      return t;
}
Le.getCompilingSchema = pu;
function u_(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function d_(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || ns.call(this, e, t);
}
function ns(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Ye._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Ye.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return vs.call(this, r, e);
  const a = (0, Ye.normalizeId)(n), i = this.refs[a] || this.schemas[a];
  if (typeof i == "string") {
    const u = ns.call(this, e, i);
    return typeof (u == null ? void 0 : u.schema) != "object" ? void 0 : vs.call(this, r, u);
  }
  if (typeof (i == null ? void 0 : i.schema) == "object") {
    if (i.validate || uo.call(this, i), a === (0, Ye.normalizeId)(t)) {
      const { schema: u } = i, { schemaId: c } = this.opts, d = u[c];
      return d && (s = (0, Ye.resolveUrl)(this.opts.uriResolver, s, d)), new rs({ schema: u, schemaId: c, root: e, baseId: s });
    }
    return vs.call(this, r, i);
  }
}
Le.resolveSchema = ns;
const f_ = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function vs(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const u of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Ci.unescapeFragment)(u)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !f_.has(u) && d && (t = (0, Ye.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Ci.schemaHasRulesButRef)(r, this.RULES)) {
    const u = (0, Ye.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = ns.call(this, n, u);
  }
  const { schemaId: i } = this.opts;
  if (a = a || new rs({ schema: r, schemaId: i, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const h_ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", p_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", m_ = "object", y_ = [
  "$data"
], $_ = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, __ = !1, g_ = {
  $id: h_,
  description: p_,
  type: m_,
  required: y_,
  properties: $_,
  additionalProperties: __
};
var fo = {};
Object.defineProperty(fo, "__esModule", { value: !0 });
const mu = Pl;
mu.code = 'require("ajv/dist/runtime/uri").default';
fo.default = mu;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Ze;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = Z;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = tn, s = Sr, a = Zt, i = Le, u = Z, c = be, d = _e, l = L, h = g_, P = fo, _ = (w, m) => new RegExp(w, m);
  _.code = "new RegExp";
  const E = ["removeAdditional", "useDefaults", "coerceTypes"], g = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), $ = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, p = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, v = 200;
  function N(w) {
    var m, S, y, o, f, b, j, A, q, F, re, Fe, Nt, Ot, Rt, Tt, It, jt, At, kt, Ct, Dt, Mt, Lt, Ft;
    const Ge = w.strict, Vt = (m = w.code) === null || m === void 0 ? void 0 : m.optimize, Or = Vt === !0 || Vt === void 0 ? 1 : Vt || 0, Rr = (y = (S = w.code) === null || S === void 0 ? void 0 : S.regExp) !== null && y !== void 0 ? y : _, fs = (o = w.uriResolver) !== null && o !== void 0 ? o : P.default;
    return {
      strictSchema: (b = (f = w.strictSchema) !== null && f !== void 0 ? f : Ge) !== null && b !== void 0 ? b : !0,
      strictNumbers: (A = (j = w.strictNumbers) !== null && j !== void 0 ? j : Ge) !== null && A !== void 0 ? A : !0,
      strictTypes: (F = (q = w.strictTypes) !== null && q !== void 0 ? q : Ge) !== null && F !== void 0 ? F : "log",
      strictTuples: (Fe = (re = w.strictTuples) !== null && re !== void 0 ? re : Ge) !== null && Fe !== void 0 ? Fe : "log",
      strictRequired: (Ot = (Nt = w.strictRequired) !== null && Nt !== void 0 ? Nt : Ge) !== null && Ot !== void 0 ? Ot : !1,
      code: w.code ? { ...w.code, optimize: Or, regExp: Rr } : { optimize: Or, regExp: Rr },
      loopRequired: (Rt = w.loopRequired) !== null && Rt !== void 0 ? Rt : v,
      loopEnum: (Tt = w.loopEnum) !== null && Tt !== void 0 ? Tt : v,
      meta: (It = w.meta) !== null && It !== void 0 ? It : !0,
      messages: (jt = w.messages) !== null && jt !== void 0 ? jt : !0,
      inlineRefs: (At = w.inlineRefs) !== null && At !== void 0 ? At : !0,
      schemaId: (kt = w.schemaId) !== null && kt !== void 0 ? kt : "$id",
      addUsedSchema: (Ct = w.addUsedSchema) !== null && Ct !== void 0 ? Ct : !0,
      validateSchema: (Dt = w.validateSchema) !== null && Dt !== void 0 ? Dt : !0,
      validateFormats: (Mt = w.validateFormats) !== null && Mt !== void 0 ? Mt : !0,
      unicodeRegExp: (Lt = w.unicodeRegExp) !== null && Lt !== void 0 ? Lt : !0,
      int32range: (Ft = w.int32range) !== null && Ft !== void 0 ? Ft : !0,
      uriResolver: fs
    };
  }
  class R {
    constructor(m = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), m = this.opts = { ...m, ...N(m) };
      const { es5: S, lines: y } = this.opts.code;
      this.scope = new u.ValueScope({ scope: {}, prefixes: g, es5: S, lines: y }), this.logger = Q(m.logger);
      const o = m.validateFormats;
      m.validateFormats = !1, this.RULES = (0, a.getRules)(), I.call(this, $, m, "NOT SUPPORTED"), I.call(this, p, m, "DEPRECATED", "warn"), this._metaOpts = H.call(this), m.formats && ue.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), m.keywords && V.call(this, m.keywords), typeof m.meta == "object" && this.addMetaSchema(m.meta), J.call(this), m.validateFormats = o;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: m, meta: S, schemaId: y } = this.opts;
      let o = h;
      y === "id" && (o = { ...h }, o.id = o.$id, delete o.$id), S && m && this.addMetaSchema(o, o[y], !1);
    }
    defaultMeta() {
      const { meta: m, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof m == "object" ? m[S] || m : void 0;
    }
    validate(m, S) {
      let y;
      if (typeof m == "string") {
        if (y = this.getSchema(m), !y)
          throw new Error(`no schema with key or ref "${m}"`);
      } else
        y = this.compile(m);
      const o = y(S);
      return "$async" in y || (this.errors = y.errors), o;
    }
    compile(m, S) {
      const y = this._addSchema(m, S);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(m, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return o.call(this, m, S);
      async function o(F, re) {
        await f.call(this, F.$schema);
        const Fe = this._addSchema(F, re);
        return Fe.validate || b.call(this, Fe);
      }
      async function f(F) {
        F && !this.getSchema(F) && await o.call(this, { $ref: F }, !0);
      }
      async function b(F) {
        try {
          return this._compileSchemaEnv(F);
        } catch (re) {
          if (!(re instanceof s.default))
            throw re;
          return j.call(this, re), await A.call(this, re.missingSchema), b.call(this, F);
        }
      }
      function j({ missingSchema: F, missingRef: re }) {
        if (this.refs[F])
          throw new Error(`AnySchema ${F} is loaded but ${re} cannot be resolved`);
      }
      async function A(F) {
        const re = await q.call(this, F);
        this.refs[F] || await f.call(this, re.$schema), this.refs[F] || this.addSchema(re, F, S);
      }
      async function q(F) {
        const re = this._loading[F];
        if (re)
          return re;
        try {
          return await (this._loading[F] = y(F));
        } finally {
          delete this._loading[F];
        }
      }
    }
    // Adds schema to the instance
    addSchema(m, S, y, o = this.opts.validateSchema) {
      if (Array.isArray(m)) {
        for (const b of m)
          this.addSchema(b, void 0, y, o);
        return this;
      }
      let f;
      if (typeof m == "object") {
        const { schemaId: b } = this.opts;
        if (f = m[b], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${b} must be string`);
      }
      return S = (0, c.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(m, y, S, o, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(m, S, y = this.opts.validateSchema) {
      return this.addSchema(m, S, !0, y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(m, S) {
      if (typeof m == "boolean")
        return !0;
      let y;
      if (y = m.$schema, y !== void 0 && typeof y != "string")
        throw new Error("$schema must be a string");
      if (y = y || this.opts.defaultMeta || this.defaultMeta(), !y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const o = this.validate(y, m);
      if (!o && S) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return o;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(m) {
      let S;
      for (; typeof (S = z.call(this, m)) == "string"; )
        m = S;
      if (S === void 0) {
        const { schemaId: y } = this.opts, o = new i.SchemaEnv({ schema: {}, schemaId: y });
        if (S = i.resolveSchema.call(this, o, m), !S)
          return;
        this.refs[m] = S;
      }
      return S.validate || this._compileSchemaEnv(S);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(m) {
      if (m instanceof RegExp)
        return this._removeAllSchemas(this.schemas, m), this._removeAllSchemas(this.refs, m), this;
      switch (typeof m) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const S = z.call(this, m);
          return typeof S == "object" && this._cache.delete(S.schema), delete this.schemas[m], delete this.refs[m], this;
        }
        case "object": {
          const S = m;
          this._cache.delete(S);
          let y = m[this.opts.schemaId];
          return y && (y = (0, c.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(m) {
      for (const S of m)
        this.addKeyword(S);
      return this;
    }
    addKeyword(m, S) {
      let y;
      if (typeof m == "string")
        y = m, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = y);
      else if (typeof m == "object" && S === void 0) {
        if (S = m, y = S.keyword, Array.isArray(y) && !y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (C.call(this, y, S), !S)
        return (0, l.eachItem)(y, (f) => k.call(this, f)), this;
      D.call(this, S);
      const o = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, l.eachItem)(y, o.type.length === 0 ? (f) => k.call(this, f, o) : (f) => o.type.forEach((b) => k.call(this, f, o, b))), this;
    }
    getKeyword(m) {
      const S = this.RULES.all[m];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(m) {
      const { RULES: S } = this;
      delete S.keywords[m], delete S.all[m];
      for (const y of S.rules) {
        const o = y.rules.findIndex((f) => f.keyword === m);
        o >= 0 && y.rules.splice(o, 1);
      }
      return this;
    }
    // Add format
    addFormat(m, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[m] = S, this;
    }
    errorsText(m = this.errors, { separator: S = ", ", dataVar: y = "data" } = {}) {
      return !m || m.length === 0 ? "No errors" : m.map((o) => `${y}${o.instancePath} ${o.message}`).reduce((o, f) => o + S + f);
    }
    $dataMetaSchema(m, S) {
      const y = this.RULES.all;
      m = JSON.parse(JSON.stringify(m));
      for (const o of S) {
        const f = o.split("/").slice(1);
        let b = m;
        for (const j of f)
          b = b[j];
        for (const j in y) {
          const A = y[j];
          if (typeof A != "object")
            continue;
          const { $data: q } = A.definition, F = b[j];
          q && F && (b[j] = T(F));
        }
      }
      return m;
    }
    _removeAllSchemas(m, S) {
      for (const y in m) {
        const o = m[y];
        (!S || S.test(y)) && (typeof o == "string" ? delete m[y] : o && !o.meta && (this._cache.delete(o.schema), delete m[y]));
      }
    }
    _addSchema(m, S, y, o = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let b;
      const { schemaId: j } = this.opts;
      if (typeof m == "object")
        b = m[j];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof m != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let A = this._cache.get(m);
      if (A !== void 0)
        return A;
      y = (0, c.normalizeId)(b || y);
      const q = c.getSchemaRefs.call(this, m, y);
      return A = new i.SchemaEnv({ schema: m, schemaId: j, meta: S, baseId: y, localRefs: q }), this._cache.set(A.schema, A), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = A), o && this.validateSchema(m, !0), A;
    }
    _checkUnique(m) {
      if (this.schemas[m] || this.refs[m])
        throw new Error(`schema with key or id "${m}" already exists`);
    }
    _compileSchemaEnv(m) {
      if (m.meta ? this._compileMetaSchema(m) : i.compileSchema.call(this, m), !m.validate)
        throw new Error("ajv implementation error");
      return m.validate;
    }
    _compileMetaSchema(m) {
      const S = this.opts;
      this.opts = this._metaOpts;
      try {
        i.compileSchema.call(this, m);
      } finally {
        this.opts = S;
      }
    }
  }
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function I(w, m, S, y = "error") {
    for (const o in w) {
      const f = o;
      f in m && this.logger[y](`${S}: option ${o}. ${w[f]}`);
    }
  }
  function z(w) {
    return w = (0, c.normalizeId)(w), this.schemas[w] || this.refs[w];
  }
  function J() {
    const w = this.opts.schemas;
    if (w)
      if (Array.isArray(w))
        this.addSchema(w);
      else
        for (const m in w)
          this.addSchema(w[m], m);
  }
  function ue() {
    for (const w in this.opts.formats) {
      const m = this.opts.formats[w];
      m && this.addFormat(w, m);
    }
  }
  function V(w) {
    if (Array.isArray(w)) {
      this.addVocabulary(w);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const m in w) {
      const S = w[m];
      S.keyword || (S.keyword = m), this.addKeyword(S);
    }
  }
  function H() {
    const w = { ...this.opts };
    for (const m of E)
      delete w[m];
    return w;
  }
  const ne = { log() {
  }, warn() {
  }, error() {
  } };
  function Q(w) {
    if (w === !1)
      return ne;
    if (w === void 0)
      return console;
    if (w.log && w.warn && w.error)
      return w;
    throw new Error("logger must implement log, warn and error methods");
  }
  const de = /^[a-z_$][a-z0-9_$:-]*$/i;
  function C(w, m) {
    const { RULES: S } = this;
    if ((0, l.eachItem)(w, (y) => {
      if (S.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!de.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!m && m.$data && !("code" in m || "validate" in m))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(w, m, S) {
    var y;
    const o = m == null ? void 0 : m.post;
    if (S && o)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let b = o ? f.post : f.rules.find(({ type: A }) => A === S);
    if (b || (b = { type: S, rules: [] }, f.rules.push(b)), f.keywords[w] = !0, !m)
      return;
    const j = {
      keyword: w,
      definition: {
        ...m,
        type: (0, d.getJSONTypes)(m.type),
        schemaType: (0, d.getJSONTypes)(m.schemaType)
      }
    };
    m.before ? U.call(this, b, j, m.before) : b.rules.push(j), f.all[w] = j, (y = m.implements) === null || y === void 0 || y.forEach((A) => this.addKeyword(A));
  }
  function U(w, m, S) {
    const y = w.rules.findIndex((o) => o.keyword === S);
    y >= 0 ? w.rules.splice(y, 0, m) : (w.rules.push(m), this.logger.warn(`rule ${S} is not defined`));
  }
  function D(w) {
    let { metaSchema: m } = w;
    m !== void 0 && (w.$data && this.opts.$data && (m = T(m)), w.validateSchema = this.compile(m, !0));
  }
  const O = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function T(w) {
    return { anyOf: [w, O] };
  }
})(Ll);
var ho = {}, po = {}, mo = {};
Object.defineProperty(mo, "__esModule", { value: !0 });
const v_ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
mo.default = v_;
var xt = {};
Object.defineProperty(xt, "__esModule", { value: !0 });
xt.callRef = xt.getValidate = void 0;
const w_ = Sr, Di = ee, De = Z, nr = lt, Mi = Le, pn = L, E_ = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: i, opts: u, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = Mi.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new w_.default(n.opts.uriResolver, s, r);
    if (l instanceof Mi.SchemaEnv)
      return P(l);
    return _(l);
    function h() {
      if (a === d)
        return An(e, i, a, a.$async);
      const E = t.scopeValue("root", { ref: d });
      return An(e, (0, De._)`${E}.validate`, d, d.$async);
    }
    function P(E) {
      const g = yu(e, E);
      An(e, g, E, E.$async);
    }
    function _(E) {
      const g = t.scopeValue("schema", u.code.source === !0 ? { ref: E, code: (0, De.stringify)(E) } : { ref: E }), $ = t.name("valid"), p = e.subschema({
        schema: E,
        dataTypes: [],
        schemaPath: De.nil,
        topSchemaRef: g,
        errSchemaPath: r
      }, $);
      e.mergeEvaluated(p), e.ok($);
    }
  }
};
function yu(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, De._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
xt.getValidate = yu;
function An(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: i, schemaEnv: u, opts: c } = a, d = c.passContext ? nr.default.this : De.nil;
  n ? l() : h();
  function l() {
    if (!u.$async)
      throw new Error("async schema referenced by sync schema");
    const E = s.let("valid");
    s.try(() => {
      s.code((0, De._)`await ${(0, Di.callValidateCode)(e, t, d)}`), _(t), i || s.assign(E, !0);
    }, (g) => {
      s.if((0, De._)`!(${g} instanceof ${a.ValidationError})`, () => s.throw(g)), P(g), i || s.assign(E, !1);
    }), e.ok(E);
  }
  function h() {
    e.result((0, Di.callValidateCode)(e, t, d), () => _(t), () => P(t));
  }
  function P(E) {
    const g = (0, De._)`${E}.errors`;
    s.assign(nr.default.vErrors, (0, De._)`${nr.default.vErrors} === null ? ${g} : ${nr.default.vErrors}.concat(${g})`), s.assign(nr.default.errors, (0, De._)`${nr.default.vErrors}.length`);
  }
  function _(E) {
    var g;
    if (!a.opts.unevaluated)
      return;
    const $ = (g = r == null ? void 0 : r.validate) === null || g === void 0 ? void 0 : g.evaluated;
    if (a.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (a.props = pn.mergeEvaluated.props(s, $.props, a.props));
      else {
        const p = s.var("props", (0, De._)`${E}.evaluated.props`);
        a.props = pn.mergeEvaluated.props(s, p, a.props, De.Name);
      }
    if (a.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (a.items = pn.mergeEvaluated.items(s, $.items, a.items));
      else {
        const p = s.var("items", (0, De._)`${E}.evaluated.items`);
        a.items = pn.mergeEvaluated.items(s, p, a.items, De.Name);
      }
  }
}
xt.callRef = An;
xt.default = E_;
Object.defineProperty(po, "__esModule", { value: !0 });
const S_ = mo, b_ = xt, P_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  S_.default,
  b_.default
];
po.default = P_;
var yo = {}, $o = {};
Object.defineProperty($o, "__esModule", { value: !0 });
const Kn = Z, _t = Kn.operators, Gn = {
  maximum: { okStr: "<=", ok: _t.LTE, fail: _t.GT },
  minimum: { okStr: ">=", ok: _t.GTE, fail: _t.LT },
  exclusiveMaximum: { okStr: "<", ok: _t.LT, fail: _t.GTE },
  exclusiveMinimum: { okStr: ">", ok: _t.GT, fail: _t.LTE }
}, N_ = {
  message: ({ keyword: e, schemaCode: t }) => (0, Kn.str)`must be ${Gn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Kn._)`{comparison: ${Gn[e].okStr}, limit: ${t}}`
}, O_ = {
  keyword: Object.keys(Gn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: N_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Kn._)`${r} ${Gn[t].fail} ${n} || isNaN(${r})`);
  }
};
$o.default = O_;
var _o = {};
Object.defineProperty(_o, "__esModule", { value: !0 });
const Gr = Z, R_ = {
  message: ({ schemaCode: e }) => (0, Gr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Gr._)`{multipleOf: ${e}}`
}, T_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: R_,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, i = t.let("res"), u = a ? (0, Gr._)`Math.abs(Math.round(${i}) - ${i}) > 1e-${a}` : (0, Gr._)`${i} !== parseInt(${i})`;
    e.fail$data((0, Gr._)`(${n} === 0 || (${i} = ${r}/${n}, ${u}))`);
  }
};
_o.default = T_;
var go = {}, vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
function $u(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
vo.default = $u;
$u.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(go, "__esModule", { value: !0 });
const Bt = Z, I_ = L, j_ = vo, A_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Bt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Bt._)`{limit: ${e}}`
}, k_ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: A_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? Bt.operators.GT : Bt.operators.LT, i = s.opts.unicode === !1 ? (0, Bt._)`${r}.length` : (0, Bt._)`${(0, I_.useFunc)(e.gen, j_.default)}(${r})`;
    e.fail$data((0, Bt._)`${i} ${a} ${n}`);
  }
};
go.default = k_;
var wo = {};
Object.defineProperty(wo, "__esModule", { value: !0 });
const C_ = ee, D_ = L, cr = Z, M_ = {
  message: ({ schemaCode: e }) => (0, cr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, cr._)`{pattern: ${e}}`
}, L_ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: M_,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: i } = e, u = i.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = i.opts.code, d = c.code === "new RegExp" ? (0, cr._)`new RegExp` : (0, D_.useFunc)(t, c), l = t.let("valid");
      t.try(() => t.assign(l, (0, cr._)`${d}(${a}, ${u}).test(${r})`), () => t.assign(l, !1)), e.fail$data((0, cr._)`!${l}`);
    } else {
      const c = (0, C_.usePattern)(e, s);
      e.fail$data((0, cr._)`!${c}.test(${r})`);
    }
  }
};
wo.default = L_;
var Eo = {};
Object.defineProperty(Eo, "__esModule", { value: !0 });
const Hr = Z, F_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Hr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Hr._)`{limit: ${e}}`
}, V_ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: F_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Hr.operators.GT : Hr.operators.LT;
    e.fail$data((0, Hr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Eo.default = V_;
var So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
const kr = ee, Jr = Z, U_ = L, z_ = {
  message: ({ params: { missingProperty: e } }) => (0, Jr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Jr._)`{missingProperty: ${e}}`
}, q_ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: z_,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: i } = e, { opts: u } = i;
    if (!a && r.length === 0)
      return;
    const c = r.length >= u.loopRequired;
    if (i.allErrors ? d() : l(), u.strictRequired) {
      const _ = e.parentSchema.properties, { definedProperties: E } = e.it;
      for (const g of r)
        if ((_ == null ? void 0 : _[g]) === void 0 && !E.has(g)) {
          const $ = i.schemaEnv.baseId + i.errSchemaPath, p = `required property "${g}" is not defined at "${$}" (strictRequired)`;
          (0, U_.checkStrictMode)(i, p, i.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(Jr.nil, h);
      else
        for (const _ of r)
          (0, kr.checkReportMissingProp)(e, _);
    }
    function l() {
      const _ = t.let("missing");
      if (c || a) {
        const E = t.let("valid", !0);
        e.block$data(E, () => P(_, E)), e.ok(E);
      } else
        t.if((0, kr.checkMissingProp)(e, r, _)), (0, kr.reportMissingProp)(e, _), t.else();
    }
    function h() {
      t.forOf("prop", n, (_) => {
        e.setParams({ missingProperty: _ }), t.if((0, kr.noPropertyInData)(t, s, _, u.ownProperties), () => e.error());
      });
    }
    function P(_, E) {
      e.setParams({ missingProperty: _ }), t.forOf(_, n, () => {
        t.assign(E, (0, kr.propertyInData)(t, s, _, u.ownProperties)), t.if((0, Jr.not)(E), () => {
          e.error(), t.break();
        });
      }, Jr.nil);
    }
  }
};
So.default = q_;
var bo = {};
Object.defineProperty(bo, "__esModule", { value: !0 });
const Wr = Z, K_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Wr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Wr._)`{limit: ${e}}`
}, G_ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: K_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Wr.operators.GT : Wr.operators.LT;
    e.fail$data((0, Wr._)`${r}.length ${s} ${n}`);
  }
};
bo.default = G_;
var Po = {}, rn = {};
Object.defineProperty(rn, "__esModule", { value: !0 });
const _u = Xn;
_u.code = 'require("ajv/dist/runtime/equal").default';
rn.default = _u;
Object.defineProperty(Po, "__esModule", { value: !0 });
const ws = _e, we = Z, H_ = L, J_ = rn, W_ = {
  message: ({ params: { i: e, j: t } }) => (0, we.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, we._)`{i: ${e}, j: ${t}}`
}, B_ = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: W_,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: i, it: u } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, ws.getSchemaTypes)(a.items) : [];
    e.block$data(c, l, (0, we._)`${i} === false`), e.ok(c);
    function l() {
      const E = t.let("i", (0, we._)`${r}.length`), g = t.let("j");
      e.setParams({ i: E, j: g }), t.assign(c, !0), t.if((0, we._)`${E} > 1`, () => (h() ? P : _)(E, g));
    }
    function h() {
      return d.length > 0 && !d.some((E) => E === "object" || E === "array");
    }
    function P(E, g) {
      const $ = t.name("item"), p = (0, ws.checkDataTypes)(d, $, u.opts.strictNumbers, ws.DataType.Wrong), v = t.const("indices", (0, we._)`{}`);
      t.for((0, we._)`;${E}--;`, () => {
        t.let($, (0, we._)`${r}[${E}]`), t.if(p, (0, we._)`continue`), d.length > 1 && t.if((0, we._)`typeof ${$} == "string"`, (0, we._)`${$} += "_"`), t.if((0, we._)`typeof ${v}[${$}] == "number"`, () => {
          t.assign(g, (0, we._)`${v}[${$}]`), e.error(), t.assign(c, !1).break();
        }).code((0, we._)`${v}[${$}] = ${E}`);
      });
    }
    function _(E, g) {
      const $ = (0, H_.useFunc)(t, J_.default), p = t.name("outer");
      t.label(p).for((0, we._)`;${E}--;`, () => t.for((0, we._)`${g} = ${E}; ${g}--;`, () => t.if((0, we._)`${$}(${r}[${E}], ${r}[${g}])`, () => {
        e.error(), t.assign(c, !1).break(p);
      })));
    }
  }
};
Po.default = B_;
var No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
const Ws = Z, X_ = L, Y_ = rn, Q_ = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Ws._)`{allowedValue: ${e}}`
}, Z_ = {
  keyword: "const",
  $data: !0,
  error: Q_,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, Ws._)`!${(0, X_.useFunc)(t, Y_.default)}(${r}, ${s})`) : e.fail((0, Ws._)`${a} !== ${r}`);
  }
};
No.default = Z_;
var Oo = {};
Object.defineProperty(Oo, "__esModule", { value: !0 });
const Lr = Z, x_ = L, eg = rn, tg = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Lr._)`{allowedValues: ${e}}`
}, rg = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: tg,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: i } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const u = s.length >= i.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, x_.useFunc)(t, eg.default));
    let l;
    if (u || n)
      l = t.let("valid"), e.block$data(l, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const _ = t.const("vSchema", a);
      l = (0, Lr.or)(...s.map((E, g) => P(_, g)));
    }
    e.pass(l);
    function h() {
      t.assign(l, !1), t.forOf("v", a, (_) => t.if((0, Lr._)`${d()}(${r}, ${_})`, () => t.assign(l, !0).break()));
    }
    function P(_, E) {
      const g = s[E];
      return typeof g == "object" && g !== null ? (0, Lr._)`${d()}(${r}, ${_}[${E}])` : (0, Lr._)`${r} === ${g}`;
    }
  }
};
Oo.default = rg;
Object.defineProperty(yo, "__esModule", { value: !0 });
const ng = $o, sg = _o, ag = go, og = wo, ig = Eo, cg = So, lg = bo, ug = Po, dg = No, fg = Oo, hg = [
  // number
  ng.default,
  sg.default,
  // string
  ag.default,
  og.default,
  // object
  ig.default,
  cg.default,
  // array
  lg.default,
  ug.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  dg.default,
  fg.default
];
yo.default = hg;
var Ro = {}, br = {};
Object.defineProperty(br, "__esModule", { value: !0 });
br.validateAdditionalItems = void 0;
const Xt = Z, Bs = L, pg = {
  message: ({ params: { len: e } }) => (0, Xt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Xt._)`{limit: ${e}}`
}, mg = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: pg,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Bs.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    gu(e, n);
  }
};
function gu(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: i } = e;
  i.items = !0;
  const u = r.const("len", (0, Xt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Xt._)`${u} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Bs.alwaysValidSchema)(i, n)) {
    const d = r.var("valid", (0, Xt._)`${u} <= ${t.length}`);
    r.if((0, Xt.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, u, (l) => {
      e.subschema({ keyword: a, dataProp: l, dataPropType: Bs.Type.Num }, d), i.allErrors || r.if((0, Xt.not)(d), () => r.break());
    });
  }
}
br.validateAdditionalItems = gu;
br.default = mg;
var To = {}, Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.validateTuple = void 0;
const Li = Z, kn = L, yg = ee, $g = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return vu(e, "additionalItems", t);
    r.items = !0, !(0, kn.alwaysValidSchema)(r, t) && e.ok((0, yg.validateArray)(e));
  }
};
function vu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: i, it: u } = e;
  l(s), u.opts.unevaluated && r.length && u.items !== !0 && (u.items = kn.mergeEvaluated.items(n, r.length, u.items));
  const c = n.name("valid"), d = n.const("len", (0, Li._)`${a}.length`);
  r.forEach((h, P) => {
    (0, kn.alwaysValidSchema)(u, h) || (n.if((0, Li._)`${d} > ${P}`, () => e.subschema({
      keyword: i,
      schemaProp: P,
      dataProp: P
    }, c)), e.ok(c));
  });
  function l(h) {
    const { opts: P, errSchemaPath: _ } = u, E = r.length, g = E === h.minItems && (E === h.maxItems || h[t] === !1);
    if (P.strictTuples && !g) {
      const $ = `"${i}" is ${E}-tuple, but minItems or maxItems/${t} are not specified or different at path "${_}"`;
      (0, kn.checkStrictMode)(u, $, P.strictTuples);
    }
  }
}
Pr.validateTuple = vu;
Pr.default = $g;
Object.defineProperty(To, "__esModule", { value: !0 });
const _g = Pr, gg = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, _g.validateTuple)(e, "items")
};
To.default = gg;
var Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
const Fi = Z, vg = L, wg = ee, Eg = br, Sg = {
  message: ({ params: { len: e } }) => (0, Fi.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Fi._)`{limit: ${e}}`
}, bg = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Sg,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, vg.alwaysValidSchema)(n, t) && (s ? (0, Eg.validateAdditionalItems)(e, s) : e.ok((0, wg.validateArray)(e)));
  }
};
Io.default = bg;
var jo = {};
Object.defineProperty(jo, "__esModule", { value: !0 });
const qe = Z, mn = L, Pg = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, qe.str)`must contain at least ${e} valid item(s)` : (0, qe.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, qe._)`{minContains: ${e}}` : (0, qe._)`{minContains: ${e}, maxContains: ${t}}`
}, Ng = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Pg,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let i, u;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (i = c === void 0 ? 1 : c, u = d) : i = 1;
    const l = t.const("len", (0, qe._)`${s}.length`);
    if (e.setParams({ min: i, max: u }), u === void 0 && i === 0) {
      (0, mn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (u !== void 0 && i > u) {
      (0, mn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, mn.alwaysValidSchema)(a, r)) {
      let g = (0, qe._)`${l} >= ${i}`;
      u !== void 0 && (g = (0, qe._)`${g} && ${l} <= ${u}`), e.pass(g);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    u === void 0 && i === 1 ? _(h, () => t.if(h, () => t.break())) : i === 0 ? (t.let(h, !0), u !== void 0 && t.if((0, qe._)`${s}.length > 0`, P)) : (t.let(h, !1), P()), e.result(h, () => e.reset());
    function P() {
      const g = t.name("_valid"), $ = t.let("count", 0);
      _(g, () => t.if(g, () => E($)));
    }
    function _(g, $) {
      t.forRange("i", 0, l, (p) => {
        e.subschema({
          keyword: "contains",
          dataProp: p,
          dataPropType: mn.Type.Num,
          compositeRule: !0
        }, g), $();
      });
    }
    function E(g) {
      t.code((0, qe._)`${g}++`), u === void 0 ? t.if((0, qe._)`${g} >= ${i}`, () => t.assign(h, !0).break()) : (t.if((0, qe._)`${g} > ${u}`, () => t.assign(h, !1).break()), i === 1 ? t.assign(h, !0) : t.if((0, qe._)`${g} >= ${i}`, () => t.assign(h, !0)));
    }
  }
};
jo.default = Ng;
var wu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = Z, r = L, n = ee;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: l } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: l, missingProperty: h } }) => (0, t._)`{property: ${c},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${l}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [d, l] = a(c);
      i(c, d), u(c, l);
    }
  };
  function a({ schema: c }) {
    const d = {}, l = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const P = Array.isArray(c[h]) ? d : l;
      P[h] = c[h];
    }
    return [d, l];
  }
  function i(c, d = c.schema) {
    const { gen: l, data: h, it: P } = c;
    if (Object.keys(d).length === 0)
      return;
    const _ = l.let("missing");
    for (const E in d) {
      const g = d[E];
      if (g.length === 0)
        continue;
      const $ = (0, n.propertyInData)(l, h, E, P.opts.ownProperties);
      c.setParams({
        property: E,
        depsCount: g.length,
        deps: g.join(", ")
      }), P.allErrors ? l.if($, () => {
        for (const p of g)
          (0, n.checkReportMissingProp)(c, p);
      }) : (l.if((0, t._)`${$} && (${(0, n.checkMissingProp)(c, g, _)})`), (0, n.reportMissingProp)(c, _), l.else());
    }
  }
  e.validatePropertyDeps = i;
  function u(c, d = c.schema) {
    const { gen: l, data: h, keyword: P, it: _ } = c, E = l.name("valid");
    for (const g in d)
      (0, r.alwaysValidSchema)(_, d[g]) || (l.if(
        (0, n.propertyInData)(l, h, g, _.opts.ownProperties),
        () => {
          const $ = c.subschema({ keyword: P, schemaProp: g }, E);
          c.mergeValidEvaluated($, E);
        },
        () => l.var(E, !0)
        // TODO var
      ), c.ok(E));
  }
  e.validateSchemaDeps = u, e.default = s;
})(wu);
var Ao = {};
Object.defineProperty(Ao, "__esModule", { value: !0 });
const Eu = Z, Og = L, Rg = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Eu._)`{propertyName: ${e.propertyName}}`
}, Tg = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Rg,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Og.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (i) => {
      e.setParams({ propertyName: i }), e.subschema({
        keyword: "propertyNames",
        data: i,
        dataTypes: ["string"],
        propertyName: i,
        compositeRule: !0
      }, a), t.if((0, Eu.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
Ao.default = Tg;
var ss = {};
Object.defineProperty(ss, "__esModule", { value: !0 });
const yn = ee, Be = Z, Ig = lt, $n = L, jg = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Be._)`{additionalProperty: ${e.additionalProperty}}`
}, Ag = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: jg,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: i } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: u, opts: c } = i;
    if (i.props = !0, c.removeAdditional !== "all" && (0, $n.alwaysValidSchema)(i, r))
      return;
    const d = (0, yn.allSchemaProperties)(n.properties), l = (0, yn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Be._)`${a} === ${Ig.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !l.length ? E($) : t.if(P($), () => E($));
      });
    }
    function P($) {
      let p;
      if (d.length > 8) {
        const v = (0, $n.schemaRefOrVal)(i, n.properties, "properties");
        p = (0, yn.isOwnProperty)(t, v, $);
      } else d.length ? p = (0, Be.or)(...d.map((v) => (0, Be._)`${$} === ${v}`)) : p = Be.nil;
      return l.length && (p = (0, Be.or)(p, ...l.map((v) => (0, Be._)`${(0, yn.usePattern)(e, v)}.test(${$})`))), (0, Be.not)(p);
    }
    function _($) {
      t.code((0, Be._)`delete ${s}[${$}]`);
    }
    function E($) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        _($);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: $ }), e.error(), u || t.break();
        return;
      }
      if (typeof r == "object" && !(0, $n.alwaysValidSchema)(i, r)) {
        const p = t.name("valid");
        c.removeAdditional === "failing" ? (g($, p, !1), t.if((0, Be.not)(p), () => {
          e.reset(), _($);
        })) : (g($, p), u || t.if((0, Be.not)(p), () => t.break()));
      }
    }
    function g($, p, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: $n.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, p);
    }
  }
};
ss.default = Ag;
var ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
const kg = Ze, Vi = ee, Es = L, Ui = ss, Cg = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Ui.default.code(new kg.KeywordCxt(a, Ui.default, "additionalProperties"));
    const i = (0, Vi.allSchemaProperties)(r);
    for (const h of i)
      a.definedProperties.add(h);
    a.opts.unevaluated && i.length && a.props !== !0 && (a.props = Es.mergeEvaluated.props(t, (0, Es.toHash)(i), a.props));
    const u = i.filter((h) => !(0, Es.alwaysValidSchema)(a, r[h]));
    if (u.length === 0)
      return;
    const c = t.name("valid");
    for (const h of u)
      d(h) ? l(h) : (t.if((0, Vi.propertyInData)(t, s, h, a.opts.ownProperties)), l(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function l(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
ko.default = Cg;
var Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
const zi = ee, _n = Z, qi = L, Ki = L, Dg = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: i } = a, u = (0, zi.allSchemaProperties)(r), c = u.filter((g) => (0, qi.alwaysValidSchema)(a, r[g]));
    if (u.length === 0 || c.length === u.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = i.strictSchema && !i.allowMatchingProperties && s.properties, l = t.name("valid");
    a.props !== !0 && !(a.props instanceof _n.Name) && (a.props = (0, Ki.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    P();
    function P() {
      for (const g of u)
        d && _(g), a.allErrors ? E(g) : (t.var(l, !0), E(g), t.if(l));
    }
    function _(g) {
      for (const $ in d)
        new RegExp(g).test($) && (0, qi.checkStrictMode)(a, `property ${$} matches pattern ${g} (use allowMatchingProperties)`);
    }
    function E(g) {
      t.forIn("key", n, ($) => {
        t.if((0, _n._)`${(0, zi.usePattern)(e, g)}.test(${$})`, () => {
          const p = c.includes(g);
          p || e.subschema({
            keyword: "patternProperties",
            schemaProp: g,
            dataProp: $,
            dataPropType: Ki.Type.Str
          }, l), a.opts.unevaluated && h !== !0 ? t.assign((0, _n._)`${h}[${$}]`, !0) : !p && !a.allErrors && t.if((0, _n.not)(l), () => t.break());
        });
      });
    }
  }
};
Co.default = Dg;
var Do = {};
Object.defineProperty(Do, "__esModule", { value: !0 });
const Mg = L, Lg = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Mg.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
Do.default = Lg;
var Mo = {};
Object.defineProperty(Mo, "__esModule", { value: !0 });
const Fg = ee, Vg = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Fg.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Mo.default = Vg;
var Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
const Cn = Z, Ug = L, zg = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Cn._)`{passingSchemas: ${e.passing}}`
}, qg = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: zg,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, i = t.let("valid", !1), u = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: u }), t.block(d), e.result(i, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((l, h) => {
        let P;
        (0, Ug.alwaysValidSchema)(s, l) ? t.var(c, !0) : P = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, Cn._)`${c} && ${i}`).assign(i, !1).assign(u, (0, Cn._)`[${u}, ${h}]`).else(), t.if(c, () => {
          t.assign(i, !0), t.assign(u, h), P && e.mergeEvaluated(P, Cn.Name);
        });
      });
    }
  }
};
Lo.default = qg;
var Fo = {};
Object.defineProperty(Fo, "__esModule", { value: !0 });
const Kg = L, Gg = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, i) => {
      if ((0, Kg.alwaysValidSchema)(n, a))
        return;
      const u = e.subschema({ keyword: "allOf", schemaProp: i }, s);
      e.ok(s), e.mergeEvaluated(u);
    });
  }
};
Fo.default = Gg;
var Vo = {};
Object.defineProperty(Vo, "__esModule", { value: !0 });
const Hn = Z, Su = L, Hg = {
  message: ({ params: e }) => (0, Hn.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Hn._)`{failingKeyword: ${e.ifClause}}`
}, Jg = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Hg,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Su.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Gi(n, "then"), a = Gi(n, "else");
    if (!s && !a)
      return;
    const i = t.let("valid", !0), u = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(u, d("then", l), d("else", l));
    } else s ? t.if(u, d("then")) : t.if((0, Hn.not)(u), d("else"));
    e.pass(i, () => e.error(!0));
    function c() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, u);
      e.mergeEvaluated(l);
    }
    function d(l, h) {
      return () => {
        const P = e.subschema({ keyword: l }, u);
        t.assign(i, u), e.mergeValidEvaluated(P, i), h ? t.assign(h, (0, Hn._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function Gi(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Su.alwaysValidSchema)(e, r);
}
Vo.default = Jg;
var Uo = {};
Object.defineProperty(Uo, "__esModule", { value: !0 });
const Wg = L, Bg = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Wg.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Uo.default = Bg;
Object.defineProperty(Ro, "__esModule", { value: !0 });
const Xg = br, Yg = To, Qg = Pr, Zg = Io, xg = jo, e0 = wu, t0 = Ao, r0 = ss, n0 = ko, s0 = Co, a0 = Do, o0 = Mo, i0 = Lo, c0 = Fo, l0 = Vo, u0 = Uo;
function d0(e = !1) {
  const t = [
    // any
    a0.default,
    o0.default,
    i0.default,
    c0.default,
    l0.default,
    u0.default,
    // object
    t0.default,
    r0.default,
    e0.default,
    n0.default,
    s0.default
  ];
  return e ? t.push(Yg.default, Zg.default) : t.push(Xg.default, Qg.default), t.push(xg.default), t;
}
Ro.default = d0;
var zo = {}, qo = {};
Object.defineProperty(qo, "__esModule", { value: !0 });
const ye = Z, f0 = {
  message: ({ schemaCode: e }) => (0, ye.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, ye._)`{format: ${e}}`
}, h0 = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: f0,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: i, it: u } = e, { opts: c, errSchemaPath: d, schemaEnv: l, self: h } = u;
    if (!c.validateFormats)
      return;
    s ? P() : _();
    function P() {
      const E = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), g = r.const("fDef", (0, ye._)`${E}[${i}]`), $ = r.let("fType"), p = r.let("format");
      r.if((0, ye._)`typeof ${g} == "object" && !(${g} instanceof RegExp)`, () => r.assign($, (0, ye._)`${g}.type || "string"`).assign(p, (0, ye._)`${g}.validate`), () => r.assign($, (0, ye._)`"string"`).assign(p, g)), e.fail$data((0, ye.or)(v(), N()));
      function v() {
        return c.strictSchema === !1 ? ye.nil : (0, ye._)`${i} && !${p}`;
      }
      function N() {
        const R = l.$async ? (0, ye._)`(${g}.async ? await ${p}(${n}) : ${p}(${n}))` : (0, ye._)`${p}(${n})`, I = (0, ye._)`(typeof ${p} == "function" ? ${R} : ${p}.test(${n}))`;
        return (0, ye._)`${p} && ${p} !== true && ${$} === ${t} && !${I}`;
      }
    }
    function _() {
      const E = h.formats[a];
      if (!E) {
        v();
        return;
      }
      if (E === !0)
        return;
      const [g, $, p] = N(E);
      g === t && e.pass(R());
      function v() {
        if (c.strictSchema === !1) {
          h.logger.warn(I());
          return;
        }
        throw new Error(I());
        function I() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(I) {
        const z = I instanceof RegExp ? (0, ye.regexpCode)(I) : c.code.formats ? (0, ye._)`${c.code.formats}${(0, ye.getProperty)(a)}` : void 0, J = r.scopeValue("formats", { key: a, ref: I, code: z });
        return typeof I == "object" && !(I instanceof RegExp) ? [I.type || "string", I.validate, (0, ye._)`${J}.validate`] : ["string", I, J];
      }
      function R() {
        if (typeof E == "object" && !(E instanceof RegExp) && E.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, ye._)`await ${p}(${n})`;
        }
        return typeof $ == "function" ? (0, ye._)`${p}(${n})` : (0, ye._)`${p}.test(${n})`;
      }
    }
  }
};
qo.default = h0;
Object.defineProperty(zo, "__esModule", { value: !0 });
const p0 = qo, m0 = [p0.default];
zo.default = m0;
var gr = {};
Object.defineProperty(gr, "__esModule", { value: !0 });
gr.contentVocabulary = gr.metadataVocabulary = void 0;
gr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
gr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(ho, "__esModule", { value: !0 });
const y0 = po, $0 = yo, _0 = Ro, g0 = zo, Hi = gr, v0 = [
  y0.default,
  $0.default,
  (0, _0.default)(),
  g0.default,
  Hi.metadataVocabulary,
  Hi.contentVocabulary
];
ho.default = v0;
var Ko = {}, as = {};
Object.defineProperty(as, "__esModule", { value: !0 });
as.DiscrError = void 0;
var Ji;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Ji || (as.DiscrError = Ji = {}));
Object.defineProperty(Ko, "__esModule", { value: !0 });
const ar = Z, Xs = as, Wi = Le, w0 = Sr, E0 = L, S0 = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Xs.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, ar._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, b0 = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: S0,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: i } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const u = n.propertyName;
    if (typeof u != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!i)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, ar._)`${r}${(0, ar.getProperty)(u)}`);
    t.if((0, ar._)`typeof ${d} == "string"`, () => l(), () => e.error(!1, { discrError: Xs.DiscrError.Tag, tag: d, tagName: u })), e.ok(c);
    function l() {
      const _ = P();
      t.if(!1);
      for (const E in _)
        t.elseIf((0, ar._)`${d} === ${E}`), t.assign(c, h(_[E]));
      t.else(), e.error(!1, { discrError: Xs.DiscrError.Mapping, tag: d, tagName: u }), t.endIf();
    }
    function h(_) {
      const E = t.name("valid"), g = e.subschema({ keyword: "oneOf", schemaProp: _ }, E);
      return e.mergeEvaluated(g, ar.Name), E;
    }
    function P() {
      var _;
      const E = {}, g = p(s);
      let $ = !0;
      for (let R = 0; R < i.length; R++) {
        let I = i[R];
        if (I != null && I.$ref && !(0, E0.schemaHasRulesButRef)(I, a.self.RULES)) {
          const J = I.$ref;
          if (I = Wi.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, J), I instanceof Wi.SchemaEnv && (I = I.schema), I === void 0)
            throw new w0.default(a.opts.uriResolver, a.baseId, J);
        }
        const z = (_ = I == null ? void 0 : I.properties) === null || _ === void 0 ? void 0 : _[u];
        if (typeof z != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${u}"`);
        $ = $ && (g || p(I)), v(z, R);
      }
      if (!$)
        throw new Error(`discriminator: "${u}" must be required`);
      return E;
      function p({ required: R }) {
        return Array.isArray(R) && R.includes(u);
      }
      function v(R, I) {
        if (R.const)
          N(R.const, I);
        else if (R.enum)
          for (const z of R.enum)
            N(z, I);
        else
          throw new Error(`discriminator: "properties/${u}" must have "const" or "enum"`);
      }
      function N(R, I) {
        if (typeof R != "string" || R in E)
          throw new Error(`discriminator: "${u}" values must be unique strings`);
        E[R] = I;
      }
    }
  }
};
Ko.default = b0;
const P0 = "http://json-schema.org/draft-07/schema#", N0 = "http://json-schema.org/draft-07/schema#", O0 = "Core schema meta-schema", R0 = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, T0 = [
  "object",
  "boolean"
], I0 = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, j0 = {
  $schema: P0,
  $id: N0,
  title: O0,
  definitions: R0,
  type: T0,
  properties: I0,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = Ll, n = ho, s = Ko, a = j0, i = ["/properties"], u = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((E) => this.addVocabulary(E)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const E = this.opts.$data ? this.$dataMetaSchema(a, i) : a;
      this.addMetaSchema(E, u, !1), this.refs["http://json-schema.org/schema"] = u;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(u) ? u : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var d = Ze;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var l = Z;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return l._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return l.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return l.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return l.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return l.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return l.CodeGen;
  } });
  var h = tn;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var P = Sr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return P.default;
  } });
})(qs, qs.exports);
var A0 = qs.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = A0, r = Z, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: u, schemaCode: c }) => r.str`should be ${s[u].okStr} ${c}`,
    params: ({ keyword: u, schemaCode: c }) => r._`{comparison: ${s[u].okStr}, limit: ${c}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(u) {
      const { gen: c, data: d, schemaCode: l, keyword: h, it: P } = u, { opts: _, self: E } = P;
      if (!_.validateFormats)
        return;
      const g = new t.KeywordCxt(P, E.RULES.all.format.definition, "format");
      g.$data ? $() : p();
      function $() {
        const N = c.scopeValue("formats", {
          ref: E.formats,
          code: _.code.formats
        }), R = c.const("fmt", r._`${N}[${g.schemaCode}]`);
        u.fail$data(r.or(r._`typeof ${R} != "object"`, r._`${R} instanceof RegExp`, r._`typeof ${R}.compare != "function"`, v(R)));
      }
      function p() {
        const N = g.schema, R = E.formats[N];
        if (!R || R === !0)
          return;
        if (typeof R != "object" || R instanceof RegExp || typeof R.compare != "function")
          throw new Error(`"${h}": format "${N}" does not define "compare" function`);
        const I = c.scopeValue("formats", {
          key: N,
          ref: R,
          code: _.code.formats ? r._`${_.code.formats}${r.getProperty(N)}` : void 0
        });
        u.fail$data(v(I));
      }
      function v(N) {
        return r._`${N}.compare(${d}, ${l}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const i = (u) => (u.addKeyword(e.formatLimitDefinition), u);
  e.default = i;
})(Ml);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = Dl, n = Ml, s = Z, a = new s.Name("fullFormats"), i = new s.Name("fastFormats"), u = (d, l = { keywords: !0 }) => {
    if (Array.isArray(l))
      return c(d, l, r.fullFormats, a), d;
    const [h, P] = l.mode === "fast" ? [r.fastFormats, i] : [r.fullFormats, a], _ = l.formats || r.formatNames;
    return c(d, _, h, P), l.keywords && n.default(d), d;
  };
  u.get = (d, l = "full") => {
    const P = (l === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!P)
      throw new Error(`Unknown format "${d}"`);
    return P;
  };
  function c(d, l, h, P) {
    var _, E;
    (_ = (E = d.opts.code).formats) !== null && _ !== void 0 || (E.formats = s._`require("ajv-formats/dist/formats").${P}`);
    for (const g of l)
      d.addFormat(g, h[g]);
  }
  e.exports = t = u, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = u;
})(zs, zs.exports);
var k0 = zs.exports;
const C0 = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !D0(s, a) && n || Object.defineProperty(e, r, a);
}, D0 = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, M0 = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, L0 = (e, t) => `/* Wrapped ${e}*/
${t}`, F0 = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), V0 = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), U0 = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = L0.bind(null, n, t.toString());
  Object.defineProperty(s, "name", V0), Object.defineProperty(e, "toString", { ...F0, value: s });
}, z0 = (e, t, { ignoreNonConfigurable: r = !1 } = {}) => {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    C0(e, t, s, r);
  return M0(e, t), U0(e, t, n), e;
};
var q0 = z0;
const K0 = q0;
var G0 = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    before: n = !1,
    after: s = !0
  } = t;
  if (!n && !s)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let a, i;
  const u = function(...c) {
    const d = this, l = () => {
      a = void 0, s && (i = e.apply(d, c));
    }, h = n && !a;
    return clearTimeout(a), a = setTimeout(l, r), h && (i = e.apply(d, c)), i;
  };
  return K0(u, e), u.cancel = () => {
    a && (clearTimeout(a), a = void 0);
  }, u;
}, Ys = { exports: {} };
const H0 = "2.0.0", bu = 256, J0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, W0 = 16, B0 = bu - 6, X0 = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var os = {
  MAX_LENGTH: bu,
  MAX_SAFE_COMPONENT_LENGTH: W0,
  MAX_SAFE_BUILD_LENGTH: B0,
  MAX_SAFE_INTEGER: J0,
  RELEASE_TYPES: X0,
  SEMVER_SPEC_VERSION: H0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Y0 = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var is = Y0;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = os, a = is;
  t = e.exports = {};
  const i = t.re = [], u = t.safeRe = [], c = t.src = [], d = t.safeSrc = [], l = t.t = {};
  let h = 0;
  const P = "[a-zA-Z0-9-]", _ = [
    ["\\s", 1],
    ["\\d", s],
    [P, n]
  ], E = ($) => {
    for (const [p, v] of _)
      $ = $.split(`${p}*`).join(`${p}{0,${v}}`).split(`${p}+`).join(`${p}{1,${v}}`);
    return $;
  }, g = ($, p, v) => {
    const N = E(p), R = h++;
    a($, R, p), l[$] = R, c[R] = p, d[R] = N, i[R] = new RegExp(p, v ? "g" : void 0), u[R] = new RegExp(N, v ? "g" : void 0);
  };
  g("NUMERICIDENTIFIER", "0|[1-9]\\d*"), g("NUMERICIDENTIFIERLOOSE", "\\d+"), g("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${P}*`), g("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), g("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), g("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), g("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), g("BUILDIDENTIFIER", `${P}+`), g("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), g("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), g("FULL", `^${c[l.FULLPLAIN]}$`), g("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), g("LOOSE", `^${c[l.LOOSEPLAIN]}$`), g("GTLT", "((?:<|>)?=?)"), g("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), g("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), g("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), g("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), g("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), g("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), g("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), g("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), g("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), g("COERCERTL", c[l.COERCE], !0), g("COERCERTLFULL", c[l.COERCEFULL], !0), g("LONETILDE", "(?:~>?)"), g("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", g("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), g("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), g("LONECARET", "(?:\\^)"), g("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", g("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), g("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), g("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), g("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), g("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", g("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), g("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), g("STAR", "(<|>)?=?\\s*\\*"), g("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), g("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Ys, Ys.exports);
var nn = Ys.exports;
const Q0 = Object.freeze({ loose: !0 }), Z0 = Object.freeze({}), x0 = (e) => e ? typeof e != "object" ? Q0 : e : Z0;
var Go = x0;
const Bi = /^[0-9]+$/, Pu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Bi.test(e), n = Bi.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, ev = (e, t) => Pu(t, e);
var Nu = {
  compareIdentifiers: Pu,
  rcompareIdentifiers: ev
};
const gn = is, { MAX_LENGTH: Xi, MAX_SAFE_INTEGER: vn } = os, { safeRe: wn, t: En } = nn, tv = Go, { compareIdentifiers: Ss } = Nu;
let rv = class tt {
  constructor(t, r) {
    if (r = tv(r), t instanceof tt) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Xi)
      throw new TypeError(
        `version is longer than ${Xi} characters`
      );
    gn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? wn[En.LOOSE] : wn[En.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > vn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > vn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > vn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < vn)
          return a;
      }
      return s;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (gn("SemVer.compare", this.version, this.options, t), !(t instanceof tt)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new tt(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof tt || (t = new tt(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof tt || (t = new tt(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (gn("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Ss(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof tt || (t = new tt(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (gn("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Ss(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? wn[En.PRERELEASELOOSE] : wn[En.PRERELEASE]);
        if (!s || s[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const s = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [s];
        else {
          let a = this.prerelease.length;
          for (; --a >= 0; )
            typeof this.prerelease[a] == "number" && (this.prerelease[a]++, a = -2);
          if (a === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(s);
          }
        }
        if (r) {
          let a = [r, s];
          n === !1 && (a = [r]), Ss(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Ae = rv;
const Yi = Ae, nv = (e, t, r = !1) => {
  if (e instanceof Yi)
    return e;
  try {
    return new Yi(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Nr = nv;
const sv = Nr, av = (e, t) => {
  const r = sv(e, t);
  return r ? r.version : null;
};
var ov = av;
const iv = Nr, cv = (e, t) => {
  const r = iv(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var lv = cv;
const Qi = Ae, uv = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Qi(
      e instanceof Qi ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var dv = uv;
const Zi = Nr, fv = (e, t) => {
  const r = Zi(e, null, !0), n = Zi(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, i = a ? r : n, u = a ? n : r, c = !!i.prerelease.length;
  if (!!u.prerelease.length && !c) {
    if (!u.patch && !u.minor)
      return "major";
    if (u.compareMain(i) === 0)
      return u.minor && !u.patch ? "minor" : "patch";
  }
  const l = c ? "pre" : "";
  return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};
var hv = fv;
const pv = Ae, mv = (e, t) => new pv(e, t).major;
var yv = mv;
const $v = Ae, _v = (e, t) => new $v(e, t).minor;
var gv = _v;
const vv = Ae, wv = (e, t) => new vv(e, t).patch;
var Ev = wv;
const Sv = Nr, bv = (e, t) => {
  const r = Sv(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var Pv = bv;
const xi = Ae, Nv = (e, t, r) => new xi(e, r).compare(new xi(t, r));
var xe = Nv;
const Ov = xe, Rv = (e, t, r) => Ov(t, e, r);
var Tv = Rv;
const Iv = xe, jv = (e, t) => Iv(e, t, !0);
var Av = jv;
const ec = Ae, kv = (e, t, r) => {
  const n = new ec(e, r), s = new ec(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var Ho = kv;
const Cv = Ho, Dv = (e, t) => e.sort((r, n) => Cv(r, n, t));
var Mv = Dv;
const Lv = Ho, Fv = (e, t) => e.sort((r, n) => Lv(n, r, t));
var Vv = Fv;
const Uv = xe, zv = (e, t, r) => Uv(e, t, r) > 0;
var cs = zv;
const qv = xe, Kv = (e, t, r) => qv(e, t, r) < 0;
var Jo = Kv;
const Gv = xe, Hv = (e, t, r) => Gv(e, t, r) === 0;
var Ou = Hv;
const Jv = xe, Wv = (e, t, r) => Jv(e, t, r) !== 0;
var Ru = Wv;
const Bv = xe, Xv = (e, t, r) => Bv(e, t, r) >= 0;
var Wo = Xv;
const Yv = xe, Qv = (e, t, r) => Yv(e, t, r) <= 0;
var Bo = Qv;
const Zv = Ou, xv = Ru, ew = cs, tw = Wo, rw = Jo, nw = Bo, sw = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return Zv(e, r, n);
    case "!=":
      return xv(e, r, n);
    case ">":
      return ew(e, r, n);
    case ">=":
      return tw(e, r, n);
    case "<":
      return rw(e, r, n);
    case "<=":
      return nw(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Tu = sw;
const aw = Ae, ow = Nr, { safeRe: Sn, t: bn } = nn, iw = (e, t) => {
  if (e instanceof aw)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Sn[bn.COERCEFULL] : Sn[bn.COERCE]);
  else {
    const c = t.includePrerelease ? Sn[bn.COERCERTLFULL] : Sn[bn.COERCERTL];
    let d;
    for (; (d = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), c.lastIndex = d.index + d[1].length + d[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", i = t.includePrerelease && r[5] ? `-${r[5]}` : "", u = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return ow(`${n}.${s}.${a}${i}${u}`, t);
};
var cw = iw;
class lw {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const s = this.map.keys().next().value;
        this.delete(s);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var uw = lw, bs, tc;
function et() {
  if (tc) return bs;
  tc = 1;
  const e = /\s+/g;
  class t {
    constructor(k, U) {
      if (U = s(U), k instanceof t)
        return k.loose === !!U.loose && k.includePrerelease === !!U.includePrerelease ? k : new t(k.raw, U);
      if (k instanceof a)
        return this.raw = k.value, this.set = [[k]], this.formatted = void 0, this;
      if (this.options = U, this.loose = !!U.loose, this.includePrerelease = !!U.includePrerelease, this.raw = k.trim().replace(e, " "), this.set = this.raw.split("||").map((D) => this.parseRange(D.trim())).filter((D) => D.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const D = this.set[0];
        if (this.set = this.set.filter((O) => !g(O[0])), this.set.length === 0)
          this.set = [D];
        else if (this.set.length > 1) {
          for (const O of this.set)
            if (O.length === 1 && $(O[0])) {
              this.set = [O];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let k = 0; k < this.set.length; k++) {
          k > 0 && (this.formatted += "||");
          const U = this.set[k];
          for (let D = 0; D < U.length; D++)
            D > 0 && (this.formatted += " "), this.formatted += U[D].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(k) {
      const D = ((this.options.includePrerelease && _) | (this.options.loose && E)) + ":" + k, O = n.get(D);
      if (O)
        return O;
      const T = this.options.loose, w = T ? c[d.HYPHENRANGELOOSE] : c[d.HYPHENRANGE];
      k = k.replace(w, Q(this.options.includePrerelease)), i("hyphen replace", k), k = k.replace(c[d.COMPARATORTRIM], l), i("comparator trim", k), k = k.replace(c[d.TILDETRIM], h), i("tilde trim", k), k = k.replace(c[d.CARETTRIM], P), i("caret trim", k);
      let m = k.split(" ").map((f) => v(f, this.options)).join(" ").split(/\s+/).map((f) => ne(f, this.options));
      T && (m = m.filter((f) => (i("loose invalid filter", f, this.options), !!f.match(c[d.COMPARATORLOOSE])))), i("range list", m);
      const S = /* @__PURE__ */ new Map(), y = m.map((f) => new a(f, this.options));
      for (const f of y) {
        if (g(f))
          return [f];
        S.set(f.value, f);
      }
      S.size > 1 && S.has("") && S.delete("");
      const o = [...S.values()];
      return n.set(D, o), o;
    }
    intersects(k, U) {
      if (!(k instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((D) => p(D, U) && k.set.some((O) => p(O, U) && D.every((T) => O.every((w) => T.intersects(w, U)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(k) {
      if (!k)
        return !1;
      if (typeof k == "string")
        try {
          k = new u(k, this.options);
        } catch {
          return !1;
        }
      for (let U = 0; U < this.set.length; U++)
        if (de(this.set[U], k, this.options))
          return !0;
      return !1;
    }
  }
  bs = t;
  const r = uw, n = new r(), s = Go, a = ls(), i = is, u = Ae, {
    safeRe: c,
    t: d,
    comparatorTrimReplace: l,
    tildeTrimReplace: h,
    caretTrimReplace: P
  } = nn, { FLAG_INCLUDE_PRERELEASE: _, FLAG_LOOSE: E } = os, g = (C) => C.value === "<0.0.0-0", $ = (C) => C.value === "", p = (C, k) => {
    let U = !0;
    const D = C.slice();
    let O = D.pop();
    for (; U && D.length; )
      U = D.every((T) => O.intersects(T, k)), O = D.pop();
    return U;
  }, v = (C, k) => (C = C.replace(c[d.BUILD], ""), i("comp", C, k), C = z(C, k), i("caret", C), C = R(C, k), i("tildes", C), C = ue(C, k), i("xrange", C), C = H(C, k), i("stars", C), C), N = (C) => !C || C.toLowerCase() === "x" || C === "*", R = (C, k) => C.trim().split(/\s+/).map((U) => I(U, k)).join(" "), I = (C, k) => {
    const U = k.loose ? c[d.TILDELOOSE] : c[d.TILDE];
    return C.replace(U, (D, O, T, w, m) => {
      i("tilde", C, D, O, T, w, m);
      let S;
      return N(O) ? S = "" : N(T) ? S = `>=${O}.0.0 <${+O + 1}.0.0-0` : N(w) ? S = `>=${O}.${T}.0 <${O}.${+T + 1}.0-0` : m ? (i("replaceTilde pr", m), S = `>=${O}.${T}.${w}-${m} <${O}.${+T + 1}.0-0`) : S = `>=${O}.${T}.${w} <${O}.${+T + 1}.0-0`, i("tilde return", S), S;
    });
  }, z = (C, k) => C.trim().split(/\s+/).map((U) => J(U, k)).join(" "), J = (C, k) => {
    i("caret", C, k);
    const U = k.loose ? c[d.CARETLOOSE] : c[d.CARET], D = k.includePrerelease ? "-0" : "";
    return C.replace(U, (O, T, w, m, S) => {
      i("caret", C, O, T, w, m, S);
      let y;
      return N(T) ? y = "" : N(w) ? y = `>=${T}.0.0${D} <${+T + 1}.0.0-0` : N(m) ? T === "0" ? y = `>=${T}.${w}.0${D} <${T}.${+w + 1}.0-0` : y = `>=${T}.${w}.0${D} <${+T + 1}.0.0-0` : S ? (i("replaceCaret pr", S), T === "0" ? w === "0" ? y = `>=${T}.${w}.${m}-${S} <${T}.${w}.${+m + 1}-0` : y = `>=${T}.${w}.${m}-${S} <${T}.${+w + 1}.0-0` : y = `>=${T}.${w}.${m}-${S} <${+T + 1}.0.0-0`) : (i("no pr"), T === "0" ? w === "0" ? y = `>=${T}.${w}.${m}${D} <${T}.${w}.${+m + 1}-0` : y = `>=${T}.${w}.${m}${D} <${T}.${+w + 1}.0-0` : y = `>=${T}.${w}.${m} <${+T + 1}.0.0-0`), i("caret return", y), y;
    });
  }, ue = (C, k) => (i("replaceXRanges", C, k), C.split(/\s+/).map((U) => V(U, k)).join(" ")), V = (C, k) => {
    C = C.trim();
    const U = k.loose ? c[d.XRANGELOOSE] : c[d.XRANGE];
    return C.replace(U, (D, O, T, w, m, S) => {
      i("xRange", C, D, O, T, w, m, S);
      const y = N(T), o = y || N(w), f = o || N(m), b = f;
      return O === "=" && b && (O = ""), S = k.includePrerelease ? "-0" : "", y ? O === ">" || O === "<" ? D = "<0.0.0-0" : D = "*" : O && b ? (o && (w = 0), m = 0, O === ">" ? (O = ">=", o ? (T = +T + 1, w = 0, m = 0) : (w = +w + 1, m = 0)) : O === "<=" && (O = "<", o ? T = +T + 1 : w = +w + 1), O === "<" && (S = "-0"), D = `${O + T}.${w}.${m}${S}`) : o ? D = `>=${T}.0.0${S} <${+T + 1}.0.0-0` : f && (D = `>=${T}.${w}.0${S} <${T}.${+w + 1}.0-0`), i("xRange return", D), D;
    });
  }, H = (C, k) => (i("replaceStars", C, k), C.trim().replace(c[d.STAR], "")), ne = (C, k) => (i("replaceGTE0", C, k), C.trim().replace(c[k.includePrerelease ? d.GTE0PRE : d.GTE0], "")), Q = (C) => (k, U, D, O, T, w, m, S, y, o, f, b) => (N(D) ? U = "" : N(O) ? U = `>=${D}.0.0${C ? "-0" : ""}` : N(T) ? U = `>=${D}.${O}.0${C ? "-0" : ""}` : w ? U = `>=${U}` : U = `>=${U}${C ? "-0" : ""}`, N(y) ? S = "" : N(o) ? S = `<${+y + 1}.0.0-0` : N(f) ? S = `<${y}.${+o + 1}.0-0` : b ? S = `<=${y}.${o}.${f}-${b}` : C ? S = `<${y}.${o}.${+f + 1}-0` : S = `<=${S}`, `${U} ${S}`.trim()), de = (C, k, U) => {
    for (let D = 0; D < C.length; D++)
      if (!C[D].test(k))
        return !1;
    if (k.prerelease.length && !U.includePrerelease) {
      for (let D = 0; D < C.length; D++)
        if (i(C[D].semver), C[D].semver !== a.ANY && C[D].semver.prerelease.length > 0) {
          const O = C[D].semver;
          if (O.major === k.major && O.minor === k.minor && O.patch === k.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return bs;
}
var Ps, rc;
function ls() {
  if (rc) return Ps;
  rc = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, h) {
      if (h = r(h), l instanceof t) {
        if (l.loose === !!h.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), i("comparator", l, h), this.options = h, this.loose = !!h.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, i("comp", this);
    }
    parse(l) {
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], P = l.match(h);
      if (!P)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = P[1] !== void 0 ? P[1] : "", this.operator === "=" && (this.operator = ""), P[2] ? this.semver = new u(P[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (i("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new u(l, this.options);
        } catch {
          return !1;
        }
      return a(l, this.operator, this.semver, this.options);
    }
    intersects(l, h) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(l.value, h).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new c(this.value, h).test(l.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || a(this.semver, "<", l.semver, h) && this.operator.startsWith(">") && l.operator.startsWith("<") || a(this.semver, ">", l.semver, h) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  Ps = t;
  const r = Go, { safeRe: n, t: s } = nn, a = Tu, i = is, u = Ae, c = et();
  return Ps;
}
const dw = et(), fw = (e, t, r) => {
  try {
    t = new dw(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var us = fw;
const hw = et(), pw = (e, t) => new hw(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var mw = pw;
const yw = Ae, $w = et(), _w = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new $w(t, r);
  } catch {
    return null;
  }
  return e.forEach((i) => {
    a.test(i) && (!n || s.compare(i) === -1) && (n = i, s = new yw(n, r));
  }), n;
};
var gw = _w;
const vw = Ae, ww = et(), Ew = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new ww(t, r);
  } catch {
    return null;
  }
  return e.forEach((i) => {
    a.test(i) && (!n || s.compare(i) === 1) && (n = i, s = new vw(n, r));
  }), n;
};
var Sw = Ew;
const Ns = Ae, bw = et(), nc = cs, Pw = (e, t) => {
  e = new bw(e, t);
  let r = new Ns("0.0.0");
  if (e.test(r) || (r = new Ns("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let a = null;
    s.forEach((i) => {
      const u = new Ns(i.semver.version);
      switch (i.operator) {
        case ">":
          u.prerelease.length === 0 ? u.patch++ : u.prerelease.push(0), u.raw = u.format();
        case "":
        case ">=":
          (!a || nc(u, a)) && (a = u);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${i.operator}`);
      }
    }), a && (!r || nc(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var Nw = Pw;
const Ow = et(), Rw = (e, t) => {
  try {
    return new Ow(e, t).range || "*";
  } catch {
    return null;
  }
};
var Tw = Rw;
const Iw = Ae, Iu = ls(), { ANY: jw } = Iu, Aw = et(), kw = us, sc = cs, ac = Jo, Cw = Bo, Dw = Wo, Mw = (e, t, r, n) => {
  e = new Iw(e, n), t = new Aw(t, n);
  let s, a, i, u, c;
  switch (r) {
    case ">":
      s = sc, a = Cw, i = ac, u = ">", c = ">=";
      break;
    case "<":
      s = ac, a = Dw, i = sc, u = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (kw(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const l = t.set[d];
    let h = null, P = null;
    if (l.forEach((_) => {
      _.semver === jw && (_ = new Iu(">=0.0.0")), h = h || _, P = P || _, s(_.semver, h.semver, n) ? h = _ : i(_.semver, P.semver, n) && (P = _);
    }), h.operator === u || h.operator === c || (!P.operator || P.operator === u) && a(e, P.semver))
      return !1;
    if (P.operator === c && i(e, P.semver))
      return !1;
  }
  return !0;
};
var Xo = Mw;
const Lw = Xo, Fw = (e, t, r) => Lw(e, t, ">", r);
var Vw = Fw;
const Uw = Xo, zw = (e, t, r) => Uw(e, t, "<", r);
var qw = zw;
const oc = et(), Kw = (e, t, r) => (e = new oc(e, r), t = new oc(t, r), e.intersects(t, r));
var Gw = Kw;
const Hw = us, Jw = xe;
var Ww = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const i = e.sort((l, h) => Jw(l, h, r));
  for (const l of i)
    Hw(l, t, r) ? (a = l, s || (s = l)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const u = [];
  for (const [l, h] of n)
    l === h ? u.push(l) : !h && l === i[0] ? u.push("*") : h ? l === i[0] ? u.push(`<=${h}`) : u.push(`${l} - ${h}`) : u.push(`>=${l}`);
  const c = u.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < d.length ? c : t;
};
const ic = et(), Yo = ls(), { ANY: Os } = Yo, Cr = us, Qo = xe, Bw = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new ic(e, r), t = new ic(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const a of t.set) {
      const i = Yw(s, a, r);
      if (n = n || i !== null, i)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, Xw = [new Yo(">=0.0.0-0")], cc = [new Yo(">=0.0.0")], Yw = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Os) {
    if (t.length === 1 && t[0].semver === Os)
      return !0;
    r.includePrerelease ? e = Xw : e = cc;
  }
  if (t.length === 1 && t[0].semver === Os) {
    if (r.includePrerelease)
      return !0;
    t = cc;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const _ of e)
    _.operator === ">" || _.operator === ">=" ? s = lc(s, _, r) : _.operator === "<" || _.operator === "<=" ? a = uc(a, _, r) : n.add(_.semver);
  if (n.size > 1)
    return null;
  let i;
  if (s && a) {
    if (i = Qo(s.semver, a.semver, r), i > 0)
      return null;
    if (i === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const _ of n) {
    if (s && !Cr(_, String(s), r) || a && !Cr(_, String(a), r))
      return null;
    for (const E of t)
      if (!Cr(_, String(E), r))
        return !1;
    return !0;
  }
  let u, c, d, l, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, P = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const _ of t) {
    if (l = l || _.operator === ">" || _.operator === ">=", d = d || _.operator === "<" || _.operator === "<=", s) {
      if (P && _.semver.prerelease && _.semver.prerelease.length && _.semver.major === P.major && _.semver.minor === P.minor && _.semver.patch === P.patch && (P = !1), _.operator === ">" || _.operator === ">=") {
        if (u = lc(s, _, r), u === _ && u !== s)
          return !1;
      } else if (s.operator === ">=" && !Cr(s.semver, String(_), r))
        return !1;
    }
    if (a) {
      if (h && _.semver.prerelease && _.semver.prerelease.length && _.semver.major === h.major && _.semver.minor === h.minor && _.semver.patch === h.patch && (h = !1), _.operator === "<" || _.operator === "<=") {
        if (c = uc(a, _, r), c === _ && c !== a)
          return !1;
      } else if (a.operator === "<=" && !Cr(a.semver, String(_), r))
        return !1;
    }
    if (!_.operator && (a || s) && i !== 0)
      return !1;
  }
  return !(s && d && !a && i !== 0 || a && l && !s && i !== 0 || P || h);
}, lc = (e, t, r) => {
  if (!e)
    return t;
  const n = Qo(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, uc = (e, t, r) => {
  if (!e)
    return t;
  const n = Qo(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Qw = Bw;
const Rs = nn, dc = os, Zw = Ae, fc = Nu, xw = Nr, eE = ov, tE = lv, rE = dv, nE = hv, sE = yv, aE = gv, oE = Ev, iE = Pv, cE = xe, lE = Tv, uE = Av, dE = Ho, fE = Mv, hE = Vv, pE = cs, mE = Jo, yE = Ou, $E = Ru, _E = Wo, gE = Bo, vE = Tu, wE = cw, EE = ls(), SE = et(), bE = us, PE = mw, NE = gw, OE = Sw, RE = Nw, TE = Tw, IE = Xo, jE = Vw, AE = qw, kE = Gw, CE = Ww, DE = Qw;
var ME = {
  parse: xw,
  valid: eE,
  clean: tE,
  inc: rE,
  diff: nE,
  major: sE,
  minor: aE,
  patch: oE,
  prerelease: iE,
  compare: cE,
  rcompare: lE,
  compareLoose: uE,
  compareBuild: dE,
  sort: fE,
  rsort: hE,
  gt: pE,
  lt: mE,
  eq: yE,
  neq: $E,
  gte: _E,
  lte: gE,
  cmp: vE,
  coerce: wE,
  Comparator: EE,
  Range: SE,
  satisfies: bE,
  toComparators: PE,
  maxSatisfying: NE,
  minSatisfying: OE,
  minVersion: RE,
  validRange: TE,
  outside: IE,
  gtr: jE,
  ltr: AE,
  intersects: kE,
  simplifyRange: CE,
  subset: DE,
  SemVer: Zw,
  re: Rs.re,
  src: Rs.src,
  tokens: Rs.t,
  SEMVER_SPEC_VERSION: dc.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: dc.RELEASE_TYPES,
  compareIdentifiers: fc.compareIdentifiers,
  rcompareIdentifiers: fc.rcompareIdentifiers
}, ds = { exports: {} }, Zo = { exports: {} };
const ju = (e, t) => {
  for (const r of Reflect.ownKeys(t))
    Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
  return e;
};
Zo.exports = ju;
Zo.exports.default = ju;
var LE = Zo.exports;
const FE = LE, Jn = /* @__PURE__ */ new WeakMap(), Au = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError("Expected a function");
  let r, n = 0;
  const s = e.displayName || e.name || "<anonymous>", a = function(...i) {
    if (Jn.set(a, ++n), n === 1)
      r = e.apply(this, i), e = null;
    else if (t.throw === !0)
      throw new Error(`Function \`${s}\` can only be called once`);
    return r;
  };
  return FE(a, e), Jn.set(a, n), a;
};
ds.exports = Au;
ds.exports.default = Au;
ds.exports.callCount = (e) => {
  if (!Jn.has(e))
    throw new Error(`The given function \`${e.name}\` is not wrapped by the \`onetime\` package`);
  return Jn.get(e);
};
var VE = ds.exports;
(function(e, t) {
  var r = sn && sn.__classPrivateFieldSet || function(D, O, T, w, m) {
    if (w === "m") throw new TypeError("Private method is not writable");
    if (w === "a" && !m) throw new TypeError("Private accessor was defined without a setter");
    if (typeof O == "function" ? D !== O || !m : !O.has(D)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return w === "a" ? m.call(D, T) : m ? m.value = T : O.set(D, T), T;
  }, n = sn && sn.__classPrivateFieldGet || function(D, O, T, w) {
    if (T === "a" && !w) throw new TypeError("Private accessor was defined without a getter");
    if (typeof O == "function" ? D !== O || !w : !O.has(D)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return T === "m" ? w : T === "a" ? w.call(D) : w ? w.value : O.get(D);
  }, s, a, i, u, c, d;
  Object.defineProperty(t, "__esModule", { value: !0 });
  const l = _c, h = Br, P = Ke, _ = Is, E = Fu, g = Vu, $ = Wu, p = sd, v = cd, N = st, R = vy, I = k0, z = G0, J = ME, ue = VE, V = "aes-256-cbc", H = () => /* @__PURE__ */ Object.create(null), ne = (D) => D != null;
  let Q = "";
  try {
    delete require.cache[__filename], Q = P.dirname((a = (s = e.parent) === null || s === void 0 ? void 0 : s.filename) !== null && a !== void 0 ? a : ".");
  } catch {
  }
  const de = (D, O) => {
    const T = /* @__PURE__ */ new Set([
      "undefined",
      "symbol",
      "function"
    ]), w = typeof O;
    if (T.has(w))
      throw new TypeError(`Setting a value of type \`${w}\` for key \`${D}\` is not allowed as it's not supported by JSON`);
  }, C = "__internal__", k = `${C}.migrations.version`;
  class U {
    constructor(O = {}) {
      var T;
      i.set(this, void 0), u.set(this, void 0), c.set(this, void 0), d.set(this, {}), this._deserialize = (f) => JSON.parse(f), this._serialize = (f) => JSON.stringify(f, void 0, "	");
      const w = {
        configName: "config",
        fileExtension: "json",
        projectSuffix: "nodejs",
        clearInvalidConfig: !1,
        accessPropertiesByDotNotation: !0,
        configFileMode: 438,
        ...O
      }, m = ue(() => {
        const f = p.sync({ cwd: Q }), b = f && JSON.parse(h.readFileSync(f, "utf8"));
        return b ?? {};
      });
      if (!w.cwd) {
        if (w.projectName || (w.projectName = m().name), !w.projectName)
          throw new Error("Project name could not be inferred. Please specify the `projectName` option.");
        w.cwd = v(w.projectName, { suffix: w.projectSuffix }).config;
      }
      if (r(this, c, w, "f"), w.schema) {
        if (typeof w.schema != "object")
          throw new TypeError("The `schema` option must be an object.");
        const f = new R.default({
          allErrors: !0,
          useDefaults: !0
        });
        (0, I.default)(f);
        const b = {
          type: "object",
          properties: w.schema
        };
        r(this, i, f.compile(b), "f");
        for (const [j, A] of Object.entries(w.schema))
          A != null && A.default && (n(this, d, "f")[j] = A.default);
      }
      w.defaults && r(this, d, {
        ...n(this, d, "f"),
        ...w.defaults
      }, "f"), w.serialize && (this._serialize = w.serialize), w.deserialize && (this._deserialize = w.deserialize), this.events = new g.EventEmitter(), r(this, u, w.encryptionKey, "f");
      const S = w.fileExtension ? `.${w.fileExtension}` : "";
      this.path = P.resolve(w.cwd, `${(T = w.configName) !== null && T !== void 0 ? T : "config"}${S}`);
      const y = this.store, o = Object.assign(H(), w.defaults, y);
      this._validate(o);
      try {
        E.deepEqual(y, o);
      } catch {
        this.store = o;
      }
      if (w.watch && this._watch(), w.migrations) {
        if (w.projectVersion || (w.projectVersion = m().version), !w.projectVersion)
          throw new Error("Project version could not be inferred. Please specify the `projectVersion` option.");
        this._migrate(w.migrations, w.projectVersion, w.beforeEachMigration);
      }
    }
    get(O, T) {
      if (n(this, c, "f").accessPropertiesByDotNotation)
        return this._get(O, T);
      const { store: w } = this;
      return O in w ? w[O] : T;
    }
    set(O, T) {
      if (typeof O != "string" && typeof O != "object")
        throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof O}`);
      if (typeof O != "object" && T === void 0)
        throw new TypeError("Use `delete()` to clear values");
      if (this._containsReservedKey(O))
        throw new TypeError(`Please don't use the ${C} key, as it's used to manage this module internal operations.`);
      const { store: w } = this, m = (S, y) => {
        de(S, y), n(this, c, "f").accessPropertiesByDotNotation ? $.set(w, S, y) : w[S] = y;
      };
      if (typeof O == "object") {
        const S = O;
        for (const [y, o] of Object.entries(S))
          m(y, o);
      } else
        m(O, T);
      this.store = w;
    }
    /**
        Check if an item exists.
    
        @param key - The key of the item to check.
        */
    has(O) {
      return n(this, c, "f").accessPropertiesByDotNotation ? $.has(this.store, O) : O in this.store;
    }
    /**
        Reset items to their default values, as defined by the `defaults` or `schema` option.
    
        @see `clear()` to reset all items.
    
        @param keys - The keys of the items to reset.
        */
    reset(...O) {
      for (const T of O)
        ne(n(this, d, "f")[T]) && this.set(T, n(this, d, "f")[T]);
    }
    /**
        Delete an item.
    
        @param key - The key of the item to delete.
        */
    delete(O) {
      const { store: T } = this;
      n(this, c, "f").accessPropertiesByDotNotation ? $.delete(T, O) : delete T[O], this.store = T;
    }
    /**
        Delete all items.
    
        This resets known items to their default values, if defined by the `defaults` or `schema` option.
        */
    clear() {
      this.store = H();
      for (const O of Object.keys(n(this, d, "f")))
        this.reset(O);
    }
    /**
        Watches the given `key`, calling `callback` on any changes.
    
        @param key - The key wo watch.
        @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
        @returns A function, that when called, will unsubscribe.
        */
    onDidChange(O, T) {
      if (typeof O != "string")
        throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof O}`);
      if (typeof T != "function")
        throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof T}`);
      return this._handleChange(() => this.get(O), T);
    }
    /**
        Watches the whole config object, calling `callback` on any changes.
    
        @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
        @returns A function, that when called, will unsubscribe.
        */
    onDidAnyChange(O) {
      if (typeof O != "function")
        throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof O}`);
      return this._handleChange(() => this.store, O);
    }
    get size() {
      return Object.keys(this.store).length;
    }
    get store() {
      try {
        const O = h.readFileSync(this.path, n(this, u, "f") ? null : "utf8"), T = this._encryptData(O), w = this._deserialize(T);
        return this._validate(w), Object.assign(H(), w);
      } catch (O) {
        if ((O == null ? void 0 : O.code) === "ENOENT")
          return this._ensureDirectory(), H();
        if (n(this, c, "f").clearInvalidConfig && O.name === "SyntaxError")
          return H();
        throw O;
      }
    }
    set store(O) {
      this._ensureDirectory(), this._validate(O), this._write(O), this.events.emit("change");
    }
    *[(i = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap(), d = /* @__PURE__ */ new WeakMap(), Symbol.iterator)]() {
      for (const [O, T] of Object.entries(this.store))
        yield [O, T];
    }
    _encryptData(O) {
      if (!n(this, u, "f"))
        return O.toString();
      try {
        if (n(this, u, "f"))
          try {
            if (O.slice(16, 17).toString() === ":") {
              const T = O.slice(0, 16), w = _.pbkdf2Sync(n(this, u, "f"), T.toString(), 1e4, 32, "sha512"), m = _.createDecipheriv(V, w, T);
              O = Buffer.concat([m.update(Buffer.from(O.slice(17))), m.final()]).toString("utf8");
            } else {
              const T = _.createDecipher(V, n(this, u, "f"));
              O = Buffer.concat([T.update(Buffer.from(O)), T.final()]).toString("utf8");
            }
          } catch {
          }
      } catch {
      }
      return O.toString();
    }
    _handleChange(O, T) {
      let w = O();
      const m = () => {
        const S = w, y = O();
        (0, l.isDeepStrictEqual)(y, S) || (w = y, T.call(this, y, S));
      };
      return this.events.on("change", m), () => this.events.removeListener("change", m);
    }
    _validate(O) {
      if (!n(this, i, "f") || n(this, i, "f").call(this, O) || !n(this, i, "f").errors)
        return;
      const w = n(this, i, "f").errors.map(({ instancePath: m, message: S = "" }) => `\`${m.slice(1)}\` ${S}`);
      throw new Error("Config schema violation: " + w.join("; "));
    }
    _ensureDirectory() {
      h.mkdirSync(P.dirname(this.path), { recursive: !0 });
    }
    _write(O) {
      let T = this._serialize(O);
      if (n(this, u, "f")) {
        const w = _.randomBytes(16), m = _.pbkdf2Sync(n(this, u, "f"), w.toString(), 1e4, 32, "sha512"), S = _.createCipheriv(V, m, w);
        T = Buffer.concat([w, Buffer.from(":"), S.update(Buffer.from(T)), S.final()]);
      }
      if (process.env.SNAP)
        h.writeFileSync(this.path, T, { mode: n(this, c, "f").configFileMode });
      else
        try {
          N.writeFileSync(this.path, T, { mode: n(this, c, "f").configFileMode });
        } catch (w) {
          if ((w == null ? void 0 : w.code) === "EXDEV") {
            h.writeFileSync(this.path, T, { mode: n(this, c, "f").configFileMode });
            return;
          }
          throw w;
        }
    }
    _watch() {
      this._ensureDirectory(), h.existsSync(this.path) || this._write(H()), process.platform === "win32" ? h.watch(this.path, { persistent: !1 }, z(() => {
        this.events.emit("change");
      }, { wait: 100 })) : h.watchFile(this.path, { persistent: !1 }, z(() => {
        this.events.emit("change");
      }, { wait: 5e3 }));
    }
    _migrate(O, T, w) {
      let m = this._get(k, "0.0.0");
      const S = Object.keys(O).filter((o) => this._shouldPerformMigration(o, m, T));
      let y = { ...this.store };
      for (const o of S)
        try {
          w && w(this, {
            fromVersion: m,
            toVersion: o,
            finalVersion: T,
            versions: S
          });
          const f = O[o];
          f(this), this._set(k, o), m = o, y = { ...this.store };
        } catch (f) {
          throw this.store = y, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${f}`);
        }
      (this._isVersionInRangeFormat(m) || !J.eq(m, T)) && this._set(k, T);
    }
    _containsReservedKey(O) {
      return typeof O == "object" && Object.keys(O)[0] === C ? !0 : typeof O != "string" ? !1 : n(this, c, "f").accessPropertiesByDotNotation ? !!O.startsWith(`${C}.`) : !1;
    }
    _isVersionInRangeFormat(O) {
      return J.clean(O) === null;
    }
    _shouldPerformMigration(O, T, w) {
      return this._isVersionInRangeFormat(O) ? T !== "0.0.0" && J.satisfies(T, O) ? !1 : J.satisfies(w, O) : !(J.lte(O, T) || J.gt(O, w));
    }
    _get(O, T) {
      return $.get(this.store, O, T);
    }
    _set(O, T) {
      const { store: w } = this;
      $.set(w, O, T), this.store = w;
    }
  }
  t.default = U, e.exports = U, e.exports.default = U;
})(js, js.exports);
var UE = js.exports;
const hc = Ke, { app: Dn, ipcMain: Qs, ipcRenderer: pc, shell: zE } = Cu, qE = UE;
let mc = !1;
const yc = () => {
  if (!Qs || !Dn)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Dn.getPath("userData"),
    appVersion: Dn.getVersion()
  };
  return mc || (Qs.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), mc = !0), e;
};
class KE extends qE {
  constructor(t) {
    let r, n;
    if (pc) {
      const s = pc.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else Qs && Dn && ({ defaultCwd: r, appVersion: n } = yc());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = hc.isAbsolute(t.cwd) ? t.cwd : hc.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    yc();
  }
  async openInEditor() {
    const t = await zE.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
var GE = KE;
const HE = /* @__PURE__ */ Ku(GE);
let JE = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
const WE = 128;
let Kt, lr, BE = (e) => {
  !Kt || Kt.length < e ? (Kt = Buffer.allocUnsafe(e * WE), Is.randomFillSync(Kt), lr = 0) : lr + e > Kt.length && (Is.randomFillSync(Kt), lr = 0), lr += e;
}, $c = (e = 21) => {
  BE(e |= 0);
  let t = "";
  for (let r = lr - e; r < lr; r++)
    t += JE[Kt[r] & 63];
  return t;
};
const XE = Lu(import.meta.url), Pn = Ke.dirname(XE), Ts = process.env.NODE_ENV === "development" || !!process.env.VITE_DEV_SERVER_URL, YE = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";
console.log("Starting main.js");
function ku(e) {
  return e ? Mn.isEncryptionAvailable() ? Mn.encryptString(e).toString("base64") : e : "";
}
function QE(e) {
  if (!e) return "";
  if (!Mn.isEncryptionAvailable()) return e;
  try {
    return Mn.decryptString(Buffer.from(e, "base64"));
  } catch {
    return e;
  }
}
function ZE(e) {
  return e.password ? { ...e, password: ku(e.password), _passwordEncrypted: !0 } : { ...e, _passwordEncrypted: !1 };
}
function xE(e) {
  if (!e.password || !e._passwordEncrypted) {
    const { _passwordEncrypted: n, ...s } = e;
    return s;
  }
  const { _passwordEncrypted: t, ...r } = e;
  return { ...r, password: QE(e.password) };
}
try {
  let e = function() {
    const u = Ts ? Ke.join(Pn, "dist-electron", "preload.mjs") : Ke.join(Pn, "preload.mjs"), c = new xo({
      width: 800,
      height: 600,
      title: t.get("appTitle", n.title || n.name || "SSH Connection Manager"),
      backgroundColor: "#212529",
      resizable: !0,
      webPreferences: {
        preload: u,
        contextIsolation: !0,
        nodeIntegration: !1,
        sandbox: !1
      },
      frame: !0
    });
    Du.setApplicationMenu(null), Ts ? c.loadURL(YE).catch((d) => console.error("Failed to load dev server:", d)) : c.loadFile(Ke.join(Pn, "dist", "index.html")).catch((d) => {
      console.error("Failed to load index.html:", d);
    }), c.maximize(), Ts && c.webContents.openDevTools();
  };
  const t = new HE(), r = Ke.join(Pn, "package.json"), n = JSON.parse(Br.readFileSync(r, "utf8")), s = () => {
    let u = t.get("favorites", []), c = !1;
    u = u.map((h) => h.id ? h : (c = !0, { ...h, id: $c(5) }));
    const d = u.map((h) => h.id), l = new Set(d);
    d.length !== l.size && (console.warn("Duplicate IDs found, regenerating..."), u = u.map((h) => ({ ...h, id: $c(5) })), c = !0), u = u.map((h) => h.password && !h._passwordEncrypted ? (c = !0, { ...h, password: ku(h.password), _passwordEncrypted: !0 }) : h), c && t.set("favorites", u);
  }, a = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  Pe.handle("spawn-local-shell", async (u, { tabId: c, disableEcho: d }) => {
    try {
      const l = process.platform === "win32" ? "powershell.exe" : process.env.SHELL || "/bin/bash", h = process.platform === "win32" ? ["-NoExit"] : [];
      console.log(`Spawning local shell for tab ${c} with shell: ${l}`);
      const P = qu.spawn(l, h, {
        name: "xterm-color",
        cols: 80,
        rows: 30,
        cwd: process.env.HOME || process.env.USERPROFILE,
        env: process.env
      });
      return i.set(c, P), P.on("data", (_) => {
        u.sender.send(`pty-data-${c}`, _);
      }), P.on("exit", () => {
        u.sender.send(`pty-close-${c}`), i.delete(c);
      }), { success: !0 };
    } catch (l) {
      return console.error(`Failed to spawn shell for tab ${c}:`, l), { success: !1, error: l.message };
    }
  }), Pe.on("pty-input", (u, { tabId: c, data: d }) => {
    const l = i.get(c);
    l ? l.write(d) : console.log("No active PTY process for tab:", c);
  }), Pe.on("resize-pty", (u, { tabId: c, cols: d, rows: l }) => {
    const h = i.get(c);
    h && h.resize(d, l);
  }), Pe.on("resize-ssh", (u, { tabId: c, cols: d, rows: l }) => {
    const h = a.get(c);
    if (h && h.shellStream)
      try {
        h.shellStream.setWindow(l, d), console.log(`Resized SSH session for tab ${c} to ${d}x${l}`);
      } catch (P) {
        console.error(`Failed to resize SSH session: ${P.message}`);
      }
  }), Pe.on("close-tab", (u, c) => {
    u.sender.send("close-tab", c);
  }), Pe.on("update-tab-display-name", (u, c) => {
    u.sender.send("update-tab-display-name", c);
  }), Pe.on("kill-pty", (u, c) => {
    const d = i.get(c);
    d && (d.kill(), i.delete(c));
  }), Pe.handle("connect-ssh", async (u, { tabId: c, options: d }) => {
    const l = new zu(), { host: h, username: P, keyPath: _, password: E, port: g = 22, cols: $ = 80, rows: p = 24 } = d;
    try {
      const v = { host: h, username: P, port: g };
      _ ? v.privateKey = Br.readFileSync(_, "utf8") : E && (v.password = E), await l.connect(v);
      const N = await l.requestShell({ term: "xterm-256color", cols: $, rows: p });
      return a.set(c, { ssh: l, shellStream: N }), N.on("data", (R) => {
        u.sender.send(`ssh-data-${c}`, R.toString());
      }), N.on("close", () => {
        u.sender.send(`ssh-close-${c}`), l.dispose(), a.delete(c);
      }), { success: !0 };
    } catch (v) {
      return { success: !1, error: v.message };
    }
  }), Pe.on("ssh-input", (u, { tabId: c, data: d }) => {
    const l = a.get(c);
    l && l.shellStream ? l.shellStream.write(d) : console.log(`No active SSH session for tab: ${c}`);
  }), Pe.on("disconnect-ssh", (u, c) => {
    const d = a.get(c);
    d && (d.ssh.dispose(), a.delete(c));
  }), Pe.handle("select-ssh-key", async () => {
    const u = await Mu.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "SSH Keys", extensions: ["pem", ""] }]
    });
    return !u.canceled && u.filePaths.length > 0 ? u.filePaths[0] : null;
  }), Pe.handle("get-settings", () => ({
    useSshKey: t.get("useSshKey", !1),
    sshKeyPath: t.get("sshKeyPath", "")
  })), Pe.on("save-settings", (u, c) => {
    t.set("useSshKey", c.useSshKey), t.set("sshKeyPath", c.sshKeyPath);
  }), Pe.handle("get-favorites", () => t.get("favorites", []).map(xE)), Pe.on("save-favorites", (u, c) => {
    t.set("favorites", c.map(ZE)), u.sender.send("favorites-updated");
  }), Pe.handle("get-app-title", () => n.title || n.name || "SSH Connection Manager"), Tr.whenReady().then(() => {
    s(), e(), Tr.on("activate", () => {
      xo.getAllWindows().length === 0 && e();
    });
  }), Tr.on("window-all-closed", () => {
    process.platform !== "darwin" && Tr.quit();
  });
} catch (e) {
  console.error("Failed to initialize electron app:", e), Tr.quit();
}
