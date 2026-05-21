import { jsx as G, jsxs as ct } from "react/jsx-runtime";
import me, { useRef as Cs, useEffect as $s, useState as ci, useCallback as ui } from "react";
const ho = '.ab-root{--ab-bg: #0a0a0f;--ab-surface: #13131a;--ab-accent: #4f8cff;--ab-text: #e8e8f0;--ab-dim: #6e6e85;--ab-muted: #3a3a50;--ab-mono: "JetBrains Mono", monospace;--ab-display: "Syne", sans-serif;--ab-ease-out: cubic-bezier(.16, 1, .3, 1);position:relative;width:100%;height:100%;background-color:var(--ab-bg);overflow:hidden;font-family:var(--ab-mono);color:var(--ab-text)}';
var I = /* @__PURE__ */ ((s) => (s.Application = "application", s.WebGLPipes = "webgl-pipes", s.WebGLPipesAdaptor = "webgl-pipes-adaptor", s.WebGLSystem = "webgl-system", s.WebGPUPipes = "webgpu-pipes", s.WebGPUPipesAdaptor = "webgpu-pipes-adaptor", s.WebGPUSystem = "webgpu-system", s.CanvasSystem = "canvas-system", s.CanvasPipesAdaptor = "canvas-pipes-adaptor", s.CanvasPipes = "canvas-pipes", s.Asset = "asset", s.LoadParser = "load-parser", s.ResolveParser = "resolve-parser", s.CacheParser = "cache-parser", s.DetectionParser = "detection-parser", s.MaskEffect = "mask-effect", s.BlendMode = "blend-mode", s.TextureSource = "texture-source", s.Environment = "environment", s.ShapeBuilder = "shape-builder", s.Batcher = "batcher", s))(I || {});
const Ms = (s) => {
  if (typeof s == "function" || typeof s == "object" && s.extension) {
    if (!s.extension)
      throw new Error("Extension class must have an extension object");
    s = { ...typeof s.extension != "object" ? { type: s.extension } : s.extension, ref: s };
  }
  if (typeof s == "object")
    s = { ...s };
  else
    throw new Error("Invalid extension type");
  return typeof s.type == "string" && (s.type = [s.type]), s;
}, be = (s, t) => Ms(s).priority ?? t, X = {
  /** @ignore */
  _addHandlers: {},
  /** @ignore */
  _removeHandlers: {},
  /** @ignore */
  _queue: {},
  /**
   * Remove extensions from PixiJS.
   * @param extensions - Extensions to be removed. Can be:
   * - Extension class with static `extension` property
   * - Extension format object with `type` and `ref`
   * - Multiple extensions as separate arguments
   * @returns {extensions} this for chaining
   * @example
   * ```ts
   * // Remove a single extension
   * extensions.remove(MyRendererPlugin);
   *
   * // Remove multiple extensions
   * extensions.remove(
   *     MyRendererPlugin,
   *     MySystemPlugin
   * );
   * ```
   * @see {@link ExtensionType} For available extension types
   * @see {@link ExtensionFormat} For extension format details
   */
  remove(...s) {
    return s.map(Ms).forEach((t) => {
      t.type.forEach((e) => {
        var i, r;
        return (r = (i = this._removeHandlers)[e]) == null ? void 0 : r.call(i, t);
      });
    }), this;
  },
  /**
   * Register new extensions with PixiJS. Extensions can be registered in multiple formats:
   * - As a class with a static `extension` property
   * - As an extension format object
   * - As multiple extensions passed as separate arguments
   * @param extensions - Extensions to add to PixiJS. Each can be:
   * - A class with static `extension` property
   * - An extension format object with `type` and `ref`
   * - Multiple extensions as separate arguments
   * @returns This extensions instance for chaining
   * @example
   * ```ts
   * // Register a simple extension
   * extensions.add(MyRendererPlugin);
   *
   * // Register multiple extensions
   * extensions.add(
   *     MyRendererPlugin,
   *     MySystemPlugin,
   * });
   * ```
   * @see {@link ExtensionType} For available extension types
   * @see {@link ExtensionFormat} For extension format details
   * @see {@link extensions.remove} For removing registered extensions
   */
  add(...s) {
    return s.map(Ms).forEach((t) => {
      t.type.forEach((e) => {
        var n, o;
        const i = this._addHandlers, r = this._queue;
        i[e] ? (o = i[e]) == null || o.call(i, t) : (r[e] = r[e] || [], (n = r[e]) == null || n.push(t));
      });
    }), this;
  },
  /**
   * Internal method to handle extensions by name.
   * @param type - The extension type.
   * @param onAdd  - Function handler when extensions are added/registered {@link StrictExtensionFormat}.
   * @param onRemove  - Function handler when extensions are removed/unregistered {@link StrictExtensionFormat}.
   * @returns this for chaining.
   * @internal
   * @ignore
   */
  handle(s, t, e) {
    var o;
    const i = this._addHandlers, r = this._removeHandlers;
    if (i[s] || r[s])
      throw new Error(`Extension type ${s} already has a handler`);
    i[s] = t, r[s] = e;
    const n = this._queue;
    return n[s] && ((o = n[s]) == null || o.forEach((a) => t(a)), delete n[s]), this;
  },
  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns this for chaining.
   * @ignore
   */
  handleByMap(s, t) {
    return this.handle(
      s,
      (e) => {
        e.name && (t[e.name] = e.ref);
      },
      (e) => {
        e.name && delete t[e.name];
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions with a `name` property.
   * @param type - Type of extension to handle.
   * @param map - The array of named extensions.
   * @param defaultPriority - Fallback priority if none is defined.
   * @returns this for chaining.
   * @ignore
   */
  handleByNamedList(s, t, e = -1) {
    return this.handle(
      s,
      (i) => {
        t.findIndex((n) => n.name === i.name) >= 0 || (t.push({ name: i.name, value: i.ref }), t.sort((n, o) => be(o.value, e) - be(n.value, e)));
      },
      (i) => {
        const r = t.findIndex((n) => n.name === i.name);
        r !== -1 && t.splice(r, 1);
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions.
   * @param type - Type of extension to handle.
   * @param list - The list of extensions.
   * @param defaultPriority - The default priority to use if none is specified.
   * @returns this for chaining.
   * @ignore
   */
  handleByList(s, t, e = -1) {
    return this.handle(
      s,
      (i) => {
        t.includes(i.ref) || (t.push(i.ref), t.sort((r, n) => be(n, e) - be(r, e)));
      },
      (i) => {
        const r = t.indexOf(i.ref);
        r !== -1 && t.splice(r, 1);
      }
    );
  },
  /**
   * Mixin the source object(s) properties into the target class's prototype.
   * Copies all property descriptors from source objects to the target's prototype.
   * @param Target - The target class to mix properties into
   * @param sources - One or more source objects containing properties to mix in
   * @example
   * ```ts
   * // Create a mixin with shared properties
   * const moveable = {
   *     x: 0,
   *     y: 0,
   *     move(x: number, y: number) {
   *         this.x += x;
   *         this.y += y;
   *     }
   * };
   *
   * // Create a mixin with computed properties
   * const scalable = {
   *     scale: 1,
   *     get scaled() {
   *         return this.scale > 1;
   *     }
   * };
   *
   * // Apply mixins to a class
   * extensions.mixin(Sprite, moveable, scalable);
   *
   * // Use mixed-in properties
   * const sprite = new Sprite();
   * sprite.move(10, 20);
   * console.log(sprite.x, sprite.y); // 10, 20
   * ```
   * @remarks
   * - Copies all properties including getters/setters
   * - Does not modify source objects
   * - Preserves property descriptors
   * @see {@link Object.defineProperties} For details on property descriptors
   * @see {@link Object.getOwnPropertyDescriptors} For details on property copying
   */
  mixin(s, ...t) {
    for (const e of t)
      Object.defineProperties(s.prototype, Object.getOwnPropertyDescriptors(e));
  }
}, lo = {
  extension: {
    type: I.Environment,
    name: "browser",
    priority: -1
  },
  test: () => !0,
  load: async () => {
    await import("./browserAll--_qERzAP.js");
  }
}, co = {
  extension: {
    type: I.Environment,
    name: "webworker",
    priority: 0
  },
  test: () => typeof self < "u" && self.WorkerGlobalScope !== void 0,
  load: async () => {
    await import("./webworkerAll-D1Bnp0w_.js");
  }
};
class W {
  /**
   * Creates a new `ObservablePoint`
   * @param observer - Observer to pass to listen for change events.
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(t, e, i) {
    this._x = e || 0, this._y = i || 0, this._observer = t;
  }
  /**
   * Creates a clone of this point.
   * @example
   * ```ts
   * // Basic cloning
   * const point = new ObservablePoint(observer, 100, 200);
   * const copy = point.clone();
   *
   * // Clone with new observer
   * const newObserver = {
   *     _onUpdate: (p) => console.log(`Clone updated: (${p.x}, ${p.y})`)
   * };
   * const watched = point.clone(newObserver);
   *
   * // Verify independence
   * watched.set(300, 400); // Only triggers new observer
   * ```
   * @param observer - Optional observer to pass to the new observable point
   * @returns A copy of this observable point
   * @see {@link ObservablePoint.copyFrom} For copying into existing point
   * @see {@link Observer} For observer interface details
   */
  clone(t) {
    return new W(t ?? this._observer, this._x, this._y);
  }
  /**
   * Sets the point to a new x and y position.
   *
   * If y is omitted, both x and y will be set to x.
   * @example
   * ```ts
   * // Basic position setting
   * const point = new ObservablePoint(observer);
   * point.set(100, 200);
   *
   * // Set both x and y to same value
   * point.set(50); // x=50, y=50
   * ```
   * @param x - Position on the x axis
   * @param y - Position on the y axis, defaults to x
   * @returns The point instance itself
   * @see {@link ObservablePoint.copyFrom} For copying from another point
   * @see {@link ObservablePoint.equals} For comparing positions
   */
  set(t = 0, e = t) {
    return (this._x !== t || this._y !== e) && (this._x = t, this._y = e, this._observer._onUpdate(this)), this;
  }
  /**
   * Copies x and y from the given point into this point.
   * @example
   * ```ts
   * // Basic copying
   * const source = new ObservablePoint(observer, 100, 200);
   * const target = new ObservablePoint();
   * target.copyFrom(source);
   *
   * // Copy and chain operations
   * const point = new ObservablePoint()
   *     .copyFrom(source)
   *     .set(x + 50, y + 50);
   *
   * // Copy from any PointData
   * const data = { x: 10, y: 20 };
   * point.copyFrom(data);
   * ```
   * @param p - The point to copy from
   * @returns The point instance itself
   * @see {@link ObservablePoint.copyTo} For copying to another point
   * @see {@link ObservablePoint.clone} For creating new point copy
   */
  copyFrom(t) {
    return (this._x !== t.x || this._y !== t.y) && (this._x = t.x, this._y = t.y, this._observer._onUpdate(this)), this;
  }
  /**
   * Copies this point's x and y into the given point.
   * @example
   * ```ts
   * // Basic copying
   * const source = new ObservablePoint(100, 200);
   * const target = new ObservablePoint();
   * source.copyTo(target);
   * ```
   * @param p - The point to copy to. Can be any type that is or extends `PointLike`
   * @returns The point (`p`) with values updated
   * @see {@link ObservablePoint.copyFrom} For copying from another point
   * @see {@link ObservablePoint.clone} For creating new point copy
   */
  copyTo(t) {
    return t.set(this._x, this._y), t;
  }
  /**
   * Checks if another point is equal to this point.
   *
   * Compares x and y values using strict equality.
   * @example
   * ```ts
   * // Basic equality check
   * const p1 = new ObservablePoint(100, 200);
   * const p2 = new ObservablePoint(100, 200);
   * console.log(p1.equals(p2)); // true
   *
   * // Compare with PointData
   * const data = { x: 100, y: 200 };
   * console.log(p1.equals(data)); // true
   *
   * // Check different points
   * const p3 = new ObservablePoint(200, 300);
   * console.log(p1.equals(p3)); // false
   * ```
   * @param p - The point to check
   * @returns `true` if both `x` and `y` are equal
   * @see {@link ObservablePoint.copyFrom} For making points equal
   * @see {@link PointData} For point data interface
   */
  equals(t) {
    return t.x === this._x && t.y === this._y;
  }
  toString() {
    return `[pixi.js/math:ObservablePoint x=${this._x} y=${this._y} scope=${this._observer}]`;
  }
  /**
   * Position of the observable point on the x axis.
   * Triggers observer callback when value changes.
   * @example
   * ```ts
   * // Basic x position
   * const point = new ObservablePoint(observer);
   * point.x = 100; // Triggers observer
   *
   * // Use in calculations
   * const width = rightPoint.x - leftPoint.x;
   * ```
   * @default 0
   */
  get x() {
    return this._x;
  }
  set x(t) {
    this._x !== t && (this._x = t, this._observer._onUpdate(this));
  }
  /**
   * Position of the observable point on the y axis.
   * Triggers observer callback when value changes.
   * @example
   * ```ts
   * // Basic y position
   * const point = new ObservablePoint(observer);
   * point.y = 200; // Triggers observer
   *
   * // Use in calculations
   * const height = bottomPoint.y - topPoint.y;
   * ```
   * @default 0
   */
  get y() {
    return this._y;
  }
  set y(t) {
    this._y !== t && (this._y = t, this._observer._onUpdate(this));
  }
}
function Ys(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var Fr = { exports: {} };
(function(s) {
  var t = Object.prototype.hasOwnProperty, e = "~";
  function i() {
  }
  Object.create && (i.prototype = /* @__PURE__ */ Object.create(null), new i().__proto__ || (e = !1));
  function r(h, l, c) {
    this.fn = h, this.context = l, this.once = c || !1;
  }
  function n(h, l, c, u, f) {
    if (typeof c != "function")
      throw new TypeError("The listener must be a function");
    var d = new r(c, u || h, f), p = e ? e + l : l;
    return h._events[p] ? h._events[p].fn ? h._events[p] = [h._events[p], d] : h._events[p].push(d) : (h._events[p] = d, h._eventsCount++), h;
  }
  function o(h, l) {
    --h._eventsCount === 0 ? h._events = new i() : delete h._events[l];
  }
  function a() {
    this._events = new i(), this._eventsCount = 0;
  }
  a.prototype.eventNames = function() {
    var l = [], c, u;
    if (this._eventsCount === 0) return l;
    for (u in c = this._events)
      t.call(c, u) && l.push(e ? u.slice(1) : u);
    return Object.getOwnPropertySymbols ? l.concat(Object.getOwnPropertySymbols(c)) : l;
  }, a.prototype.listeners = function(l) {
    var c = e ? e + l : l, u = this._events[c];
    if (!u) return [];
    if (u.fn) return [u.fn];
    for (var f = 0, d = u.length, p = new Array(d); f < d; f++)
      p[f] = u[f].fn;
    return p;
  }, a.prototype.listenerCount = function(l) {
    var c = e ? e + l : l, u = this._events[c];
    return u ? u.fn ? 1 : u.length : 0;
  }, a.prototype.emit = function(l, c, u, f, d, p) {
    var g = e ? e + l : l;
    if (!this._events[g]) return !1;
    var m = this._events[g], x = arguments.length, y, _;
    if (m.fn) {
      switch (m.once && this.removeListener(l, m.fn, void 0, !0), x) {
        case 1:
          return m.fn.call(m.context), !0;
        case 2:
          return m.fn.call(m.context, c), !0;
        case 3:
          return m.fn.call(m.context, c, u), !0;
        case 4:
          return m.fn.call(m.context, c, u, f), !0;
        case 5:
          return m.fn.call(m.context, c, u, f, d), !0;
        case 6:
          return m.fn.call(m.context, c, u, f, d, p), !0;
      }
      for (_ = 1, y = new Array(x - 1); _ < x; _++)
        y[_ - 1] = arguments[_];
      m.fn.apply(m.context, y);
    } else {
      var b = m.length, S;
      for (_ = 0; _ < b; _++)
        switch (m[_].once && this.removeListener(l, m[_].fn, void 0, !0), x) {
          case 1:
            m[_].fn.call(m[_].context);
            break;
          case 2:
            m[_].fn.call(m[_].context, c);
            break;
          case 3:
            m[_].fn.call(m[_].context, c, u);
            break;
          case 4:
            m[_].fn.call(m[_].context, c, u, f);
            break;
          default:
            if (!y) for (S = 1, y = new Array(x - 1); S < x; S++)
              y[S - 1] = arguments[S];
            m[_].fn.apply(m[_].context, y);
        }
    }
    return !0;
  }, a.prototype.on = function(l, c, u) {
    return n(this, l, c, u, !1);
  }, a.prototype.once = function(l, c, u) {
    return n(this, l, c, u, !0);
  }, a.prototype.removeListener = function(l, c, u, f) {
    var d = e ? e + l : l;
    if (!this._events[d]) return this;
    if (!c)
      return o(this, d), this;
    var p = this._events[d];
    if (p.fn)
      p.fn === c && (!f || p.once) && (!u || p.context === u) && o(this, d);
    else {
      for (var g = 0, m = [], x = p.length; g < x; g++)
        (p[g].fn !== c || f && !p[g].once || u && p[g].context !== u) && m.push(p[g]);
      m.length ? this._events[d] = m.length === 1 ? m[0] : m : o(this, d);
    }
    return this;
  }, a.prototype.removeAllListeners = function(l) {
    var c;
    return l ? (c = e ? e + l : l, this._events[c] && o(this, c)) : (this._events = new i(), this._eventsCount = 0), this;
  }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = e, a.EventEmitter = a, s.exports = a;
})(Fr);
var uo = Fr.exports;
const mt = /* @__PURE__ */ Ys(uo), fo = Math.PI * 2, po = 180 / Math.PI, mo = Math.PI / 180;
class j {
  /**
   * Creates a new `Point`
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(t = 0, e = 0) {
    this.x = 0, this.y = 0, this.x = t, this.y = e;
  }
  /**
   * Creates a clone of this point, which is a new instance with the same `x` and `y` values.
   * @example
   * ```ts
   * // Basic point cloning
   * const original = new Point(100, 200);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.set(300, 400);
   *
   * // Verify independence
   * console.log(original); // Point(100, 200)
   * console.log(modified); // Point(300, 400)
   * ```
   * @remarks
   * - Creates new Point instance
   * - Deep copies x and y values
   * - Independent from original
   * - Useful for preserving values
   * @returns A clone of this point
   * @see {@link Point.copyFrom} For copying into existing point
   * @see {@link Point.copyTo} For copying to existing point
   */
  clone() {
    return new j(this.x, this.y);
  }
  /**
   * Copies x and y from the given point into this point.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Point(100, 200);
   * const target = new Point();
   * target.copyFrom(source);
   *
   * // Copy and chain operations
   * const point = new Point()
   *     .copyFrom(source)
   *     .set(x + 50, y + 50);
   *
   * // Copy from any PointData
   * const data = { x: 10, y: 20 };
   * point.copyFrom(data);
   * ```
   * @param p - The point to copy from
   * @returns The point instance itself
   * @see {@link Point.copyTo} For copying to another point
   * @see {@link Point.clone} For creating new point copy
   */
  copyFrom(t) {
    return this.set(t.x, t.y), this;
  }
  /**
   * Copies this point's x and y into the given point.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Point(100, 200);
   * const target = new Point();
   * source.copyTo(target);
   * ```
   * @param p - The point to copy to. Can be any type that is or extends `PointLike`
   * @returns The point (`p`) with values updated
   * @see {@link Point.copyFrom} For copying from another point
   * @see {@link Point.clone} For creating new point copy
   */
  copyTo(t) {
    return t.set(this.x, this.y), t;
  }
  /**
   * Checks if another point is equal to this point.
   *
   * Compares x and y values using strict equality.
   * @example
   * ```ts
   * // Basic equality check
   * const p1 = new Point(100, 200);
   * const p2 = new Point(100, 200);
   * console.log(p1.equals(p2)); // true
   *
   * // Compare with PointData
   * const data = { x: 100, y: 200 };
   * console.log(p1.equals(data)); // true
   *
   * // Check different points
   * const p3 = new Point(200, 300);
   * console.log(p1.equals(p3)); // false
   * ```
   * @param p - The point to check
   * @returns `true` if both `x` and `y` are equal
   * @see {@link Point.copyFrom} For making points equal
   * @see {@link PointData} For point data interface
   */
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  /**
   * Sets the point to a new x and y position.
   *
   * If y is omitted, both x and y will be set to x.
   * @example
   * ```ts
   * // Basic position setting
   * const point = new Point();
   * point.set(100, 200);
   *
   * // Set both x and y to same value
   * point.set(50); // x=50, y=50
   *
   * // Chain with other operations
   * point
   *     .set(10, 20)
   *     .copyTo(otherPoint);
   * ```
   * @param x - Position on the x axis
   * @param y - Position on the y axis, defaults to x
   * @returns The point instance itself
   * @see {@link Point.copyFrom} For copying from another point
   * @see {@link Point.equals} For comparing positions
   */
  set(t = 0, e = t) {
    return this.x = t, this.y = e, this;
  }
  toString() {
    return `[pixi.js/math:Point x=${this.x} y=${this.y}]`;
  }
  /**
   * A static Point object with `x` and `y` values of `0`.
   *
   * This shared instance is reset to zero values when accessed.
   *
   * > [!IMPORTANT] This point is shared and temporary. Do not store references to it.
   * @example
   * ```ts
   * // Use for temporary calculations
   * const tempPoint = Point.shared;
   * tempPoint.set(100, 200);
   * matrix.apply(tempPoint);
   *
   * // Will be reset to (0,0) on next access
   * const fresh = Point.shared; // x=0, y=0
   * ```
   * @readonly
   * @returns A fresh zeroed point for temporary use
   * @see {@link Point.constructor} For creating new points
   * @see {@link PointData} For basic point interface
   */
  static get shared() {
    return We.x = 0, We.y = 0, We;
  }
}
const We = new j();
class k {
  /**
   * @param a - x scale
   * @param b - y skew
   * @param c - x skew
   * @param d - y scale
   * @param tx - x translation
   * @param ty - y translation
   */
  constructor(t = 1, e = 0, i = 0, r = 1, n = 0, o = 0) {
    this.array = null, this.a = t, this.b = e, this.c = i, this.d = r, this.tx = n, this.ty = o;
  }
  /**
   * Creates a Matrix object based on the given array.
   * Populates matrix components from a flat array in column-major order.
   *
   * > [!NOTE] Array mapping order:
   * > ```
   * > array[0] = a  (x scale)
   * > array[1] = b  (y skew)
   * > array[2] = tx (x translation)
   * > array[3] = c  (x skew)
   * > array[4] = d  (y scale)
   * > array[5] = ty (y translation)
   * > ```
   * @example
   * ```ts
   * // Create matrix from array
   * const matrix = new Matrix();
   * matrix.fromArray([
   *     2, 0,  100,  // a, b, tx
   *     0, 2,  100   // c, d, ty
   * ]);
   *
   * // Create matrix from typed array
   * const float32Array = new Float32Array([
   *     1, 0, 0,     // Scale x1, no skew
   *     0, 1, 0      // No skew, scale x1
   * ]);
   * matrix.fromArray(float32Array);
   * ```
   * @param array - The array to populate the matrix from
   * @see {@link Matrix.toArray} For converting matrix to array
   * @see {@link Matrix.set} For setting values directly
   */
  fromArray(t) {
    this.a = t[0], this.b = t[1], this.c = t[3], this.d = t[4], this.tx = t[2], this.ty = t[5];
  }
  /**
   * Sets the matrix properties directly.
   * All matrix components can be set in one call.
   * @example
   * ```ts
   * // Set to identity matrix
   * matrix.set(1, 0, 0, 1, 0, 0);
   *
   * // Set to scale matrix
   * matrix.set(2, 0, 0, 2, 0, 0); // Scale 2x
   *
   * // Set to translation matrix
   * matrix.set(1, 0, 0, 1, 100, 50); // Move 100,50
   * ```
   * @param a - Scale on x axis
   * @param b - Shear on y axis
   * @param c - Shear on x axis
   * @param d - Scale on y axis
   * @param tx - Translation on x axis
   * @param ty - Translation on y axis
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.identity} For resetting to identity
   * @see {@link Matrix.fromArray} For setting from array
   */
  set(t, e, i, r, n, o) {
    return this.a = t, this.b = e, this.c = i, this.d = r, this.tx = n, this.ty = o, this;
  }
  /**
   * Creates an array from the current Matrix object.
   *
   * > [!NOTE] The array format is:
   * > ```
   * > Non-transposed:
   * > [a, c, tx,
   * > b, d, ty,
   * > 0, 0, 1]
   * >
   * > Transposed:
   * > [a, b, 0,
   * > c, d, 0,
   * > tx,ty,1]
   * > ```
   * @example
   * ```ts
   * // Basic array conversion
   * const matrix = new Matrix(2, 0, 0, 2, 100, 100);
   * const array = matrix.toArray();
   *
   * // Using existing array
   * const float32Array = new Float32Array(9);
   * matrix.toArray(false, float32Array);
   *
   * // Get transposed array
   * const transposed = matrix.toArray(true);
   * ```
   * @param transpose - Whether to transpose the matrix
   * @param out - Optional Float32Array to store the result
   * @returns The array containing the matrix values
   * @see {@link Matrix.fromArray} For creating matrix from array
   * @see {@link Matrix.array} For cached array storage
   */
  toArray(t, e) {
    this.array || (this.array = new Float32Array(9));
    const i = e || this.array;
    return t ? (i[0] = this.a, i[1] = this.b, i[2] = 0, i[3] = this.c, i[4] = this.d, i[5] = 0, i[6] = this.tx, i[7] = this.ty, i[8] = 1) : (i[0] = this.a, i[1] = this.c, i[2] = this.tx, i[3] = this.b, i[4] = this.d, i[5] = this.ty, i[6] = 0, i[7] = 0, i[8] = 1), i;
  }
  /**
   * Get a new position with the current transformation applied.
   *
   * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
   * @example
   * ```ts
   * // Basic point transformation
   * const matrix = new Matrix().translate(100, 50).rotate(Math.PI / 4);
   * const point = new Point(10, 20);
   * const transformed = matrix.apply(point);
   *
   * // Reuse existing point
   * const output = new Point();
   * matrix.apply(point, output);
   * ```
   * @param pos - The origin point to transform
   * @param newPos - Optional point to store the result
   * @returns The transformed point
   * @see {@link Matrix.applyInverse} For inverse transformation
   * @see {@link Point} For point operations
   */
  apply(t, e) {
    e = e || new j();
    const i = t.x, r = t.y;
    return e.x = this.a * i + this.c * r + this.tx, e.y = this.b * i + this.d * r + this.ty, e;
  }
  /**
   * Get a new position with the inverse of the current transformation applied.
   *
   * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
   * @example
   * ```ts
   * // Basic inverse transformation
   * const matrix = new Matrix().translate(100, 50).rotate(Math.PI / 4);
   * const worldPoint = new Point(150, 100);
   * const localPoint = matrix.applyInverse(worldPoint);
   *
   * // Reuse existing point
   * const output = new Point();
   * matrix.applyInverse(worldPoint, output);
   *
   * // Convert mouse position to local space
   * const mousePoint = new Point(mouseX, mouseY);
   * const localMouse = matrix.applyInverse(mousePoint);
   * ```
   * @param pos - The origin point to inverse-transform
   * @param newPos - Optional point to store the result
   * @returns The inverse-transformed point
   * @see {@link Matrix.apply} For forward transformation
   * @see {@link Matrix.invert} For getting inverse matrix
   */
  applyInverse(t, e) {
    e = e || new j();
    const i = this.a, r = this.b, n = this.c, o = this.d, a = this.tx, h = this.ty, l = 1 / (i * o + n * -r), c = t.x, u = t.y;
    return e.x = o * l * c + -n * l * u + (h * n - a * o) * l, e.y = i * l * u + -r * l * c + (-h * i + a * r) * l, e;
  }
  /**
   * Translates the matrix on the x and y axes.
   * Adds to the position values while preserving scale, rotation and skew.
   * @example
   * ```ts
   * // Basic translation
   * const matrix = new Matrix();
   * matrix.translate(100, 50); // Move right 100, down 50
   *
   * // Chain with other transformations
   * matrix
   *     .scale(2, 2)
   *     .translate(100, 0)
   *     .rotate(Math.PI / 4);
   * ```
   * @param x - How much to translate on the x axis
   * @param y - How much to translate on the y axis
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.set} For setting position directly
   * @see {@link Matrix.setTransform} For complete transform setup
   */
  translate(t, e) {
    return this.tx += t, this.ty += e, this;
  }
  /**
   * Applies a scale transformation to the matrix.
   * Multiplies the scale values with existing matrix components.
   * @example
   * ```ts
   * // Basic scaling
   * const matrix = new Matrix();
   * matrix.scale(2, 3); // Scale 2x horizontally, 3x vertically
   *
   * // Chain with other transformations
   * matrix
   *     .translate(100, 100)
   *     .scale(2, 2)     // Scales after translation
   *     .rotate(Math.PI / 4);
   * ```
   * @param x - The amount to scale horizontally
   * @param y - The amount to scale vertically
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.setTransform} For setting scale directly
   * @see {@link Matrix.append} For combining transformations
   */
  scale(t, e) {
    return this.a *= t, this.d *= e, this.c *= t, this.b *= e, this.tx *= t, this.ty *= e, this;
  }
  /**
   * Applies a rotation transformation to the matrix.
   *
   * Rotates around the origin (0,0) by the given angle in radians.
   * @example
   * ```ts
   * // Basic rotation
   * const matrix = new Matrix();
   * matrix.rotate(Math.PI / 4); // Rotate 45 degrees
   *
   * // Chain with other transformations
   * matrix
   *     .translate(100, 100) // Move to rotation center
   *     .rotate(Math.PI)     // Rotate 180 degrees
   *     .scale(2, 2);        // Scale after rotation
   *
   * // Common angles
   * matrix.rotate(Math.PI / 2);  // 90 degrees
   * matrix.rotate(Math.PI);      // 180 degrees
   * matrix.rotate(Math.PI * 2);  // 360 degrees
   * ```
   * @remarks
   * - Rotates around origin point (0,0)
   * - Affects position if translation was set
   * - Uses counter-clockwise rotation
   * - Order of operations matters when chaining
   * @param angle - The angle in radians
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.setTransform} For setting rotation directly
   * @see {@link Matrix.append} For combining transformations
   */
  rotate(t) {
    const e = Math.cos(t), i = Math.sin(t), r = this.a, n = this.c, o = this.tx;
    return this.a = r * e - this.b * i, this.b = r * i + this.b * e, this.c = n * e - this.d * i, this.d = n * i + this.d * e, this.tx = o * e - this.ty * i, this.ty = o * i + this.ty * e, this;
  }
  /**
   * Appends the given Matrix to this Matrix.
   * Combines two matrices by multiplying them together: this = this * matrix
   * @example
   * ```ts
   * // Basic matrix combination
   * const matrix = new Matrix();
   * const other = new Matrix().translate(100, 0).rotate(Math.PI / 4);
   * matrix.append(other);
   * ```
   * @remarks
   * - Order matters: A.append(B) !== B.append(A)
   * - Modifies current matrix
   * - Preserves transformation order
   * - Commonly used for combining transforms
   * @param matrix - The matrix to append
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.prepend} For prepending transformations
   * @see {@link Matrix.appendFrom} For appending two external matrices
   */
  append(t) {
    const e = this.a, i = this.b, r = this.c, n = this.d;
    return this.a = t.a * e + t.b * r, this.b = t.a * i + t.b * n, this.c = t.c * e + t.d * r, this.d = t.c * i + t.d * n, this.tx = t.tx * e + t.ty * r + this.tx, this.ty = t.tx * i + t.ty * n + this.ty, this;
  }
  /**
   * Appends two matrices and sets the result to this matrix.
   * Performs matrix multiplication: this = A * B
   * @example
   * ```ts
   * // Basic matrix multiplication
   * const result = new Matrix();
   * const matrixA = new Matrix().scale(2, 2);
   * const matrixB = new Matrix().rotate(Math.PI / 4);
   * result.appendFrom(matrixA, matrixB);
   * ```
   * @remarks
   * - Order matters: A * B !== B * A
   * - Creates a new transformation from two others
   * - More efficient than append() for multiple operations
   * - Does not modify input matrices
   * @param a - The first matrix to multiply
   * @param b - The second matrix to multiply
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.append} For single matrix combination
   * @see {@link Matrix.prepend} For reverse order multiplication
   */
  appendFrom(t, e) {
    const i = t.a, r = t.b, n = t.c, o = t.d, a = t.tx, h = t.ty, l = e.a, c = e.b, u = e.c, f = e.d;
    return this.a = i * l + r * u, this.b = i * c + r * f, this.c = n * l + o * u, this.d = n * c + o * f, this.tx = a * l + h * u + e.tx, this.ty = a * c + h * f + e.ty, this;
  }
  /**
   * Sets the matrix based on all the available properties.
   * Combines position, scale, rotation, skew and pivot in a single operation.
   * @example
   * ```ts
   * // Basic transform setup
   * const matrix = new Matrix();
   * matrix.setTransform(
   *     100, 100,    // position
   *     0, 0,        // pivot
   *     2, 2,        // scale
   *     Math.PI / 4, // rotation (45 degrees)
   *     0, 0         // skew
   * );
   * ```
   * @remarks
   * - Updates all matrix components at once
   * - More efficient than separate transform calls
   * - Uses radians for rotation and skew
   * - Pivot affects rotation center
   * @param x - Position on the x axis
   * @param y - Position on the y axis
   * @param pivotX - Pivot on the x axis
   * @param pivotY - Pivot on the y axis
   * @param scaleX - Scale on the x axis
   * @param scaleY - Scale on the y axis
   * @param rotation - Rotation in radians
   * @param skewX - Skew on the x axis
   * @param skewY - Skew on the y axis
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.decompose} For extracting transform properties
   * @see {@link TransformableObject} For transform data structure
   */
  setTransform(t, e, i, r, n, o, a, h, l) {
    return this.a = Math.cos(a + l) * n, this.b = Math.sin(a + l) * n, this.c = -Math.sin(a - h) * o, this.d = Math.cos(a - h) * o, this.tx = t - (i * this.a + r * this.c), this.ty = e - (i * this.b + r * this.d), this;
  }
  /**
   * Prepends the given Matrix to this Matrix.
   * Combines two matrices by multiplying them together: this = matrix * this
   * @example
   * ```ts
   * // Basic matrix prepend
   * const matrix = new Matrix().scale(2, 2);
   * const other = new Matrix().translate(100, 0);
   * matrix.prepend(other); // Translation happens before scaling
   * ```
   * @remarks
   * - Order matters: A.prepend(B) !== B.prepend(A)
   * - Modifies current matrix
   * - Reverses transformation order compared to append()
   * @param matrix - The matrix to prepend
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.append} For appending transformations
   * @see {@link Matrix.appendFrom} For combining external matrices
   */
  prepend(t) {
    const e = this.tx;
    if (t.a !== 1 || t.b !== 0 || t.c !== 0 || t.d !== 1) {
      const i = this.a, r = this.c;
      this.a = i * t.a + this.b * t.c, this.b = i * t.b + this.b * t.d, this.c = r * t.a + this.d * t.c, this.d = r * t.b + this.d * t.d;
    }
    return this.tx = e * t.a + this.ty * t.c + t.tx, this.ty = e * t.b + this.ty * t.d + t.ty, this;
  }
  /**
   * Decomposes the matrix into its individual transform components.
   * Extracts position, scale, rotation and skew values from the matrix.
   * @example
   * ```ts
   * // Basic decomposition
   * const matrix = new Matrix()
   *     .translate(100, 100)
   *     .rotate(Math.PI / 4)
   *     .scale(2, 2);
   *
   * const transform = {
   *     position: new Point(),
   *     scale: new Point(),
   *     pivot: new Point(),
   *     skew: new Point(),
   *     rotation: 0
   * };
   *
   * matrix.decompose(transform);
   * console.log(transform.position); // Point(100, 100)
   * console.log(transform.rotation); // ~0.785 (PI/4)
   * console.log(transform.scale); // Point(2, 2)
   * ```
   * @remarks
   * - Handles combined transformations
   * - Accounts for pivot points
   * - Chooses between rotation/skew based on transform type
   * - Uses radians for rotation and skew
   * @param transform - The transform object to store the decomposed values
   * @returns The transform with the newly applied properties
   * @see {@link Matrix.setTransform} For composing from components
   * @see {@link TransformableObject} For transform structure
   */
  decompose(t) {
    const e = this.a, i = this.b, r = this.c, n = this.d, o = t.pivot, a = -Math.atan2(-r, n), h = Math.atan2(i, e), l = Math.abs(a + h);
    return l < 1e-5 || Math.abs(fo - l) < 1e-5 ? (t.rotation = h, t.skew.x = t.skew.y = 0) : (t.rotation = 0, t.skew.x = a, t.skew.y = h), t.scale.x = Math.sqrt(e * e + i * i), t.scale.y = Math.sqrt(r * r + n * n), t.position.x = this.tx + (o.x * e + o.y * r), t.position.y = this.ty + (o.x * i + o.y * n), t;
  }
  /**
   * Inverts this matrix.
   * Creates the matrix that when multiplied with this matrix results in an identity matrix.
   * @example
   * ```ts
   * // Basic matrix inversion
   * const matrix = new Matrix()
   *     .translate(100, 50)
   *     .scale(2, 2);
   *
   * matrix.invert(); // Now transforms in opposite direction
   *
   * // Verify inversion
   * const point = new Point(50, 50);
   * const transformed = matrix.apply(point);
   * const original = matrix.invert().apply(transformed);
   * // original ≈ point
   * ```
   * @remarks
   * - Modifies the current matrix
   * - Useful for reversing transformations
   * - Cannot invert matrices with zero determinant
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.identity} For resetting to identity
   * @see {@link Matrix.applyInverse} For inverse transformations
   */
  invert() {
    const t = this.a, e = this.b, i = this.c, r = this.d, n = this.tx, o = t * r - e * i;
    return this.a = r / o, this.b = -e / o, this.c = -i / o, this.d = t / o, this.tx = (i * this.ty - r * n) / o, this.ty = -(t * this.ty - e * n) / o, this;
  }
  /**
   * Checks if this matrix is an identity matrix.
   *
   * An identity matrix has no transformations applied (default state).
   * @example
   * ```ts
   * // Check if matrix is identity
   * const matrix = new Matrix();
   * console.log(matrix.isIdentity()); // true
   *
   * // Check after transformations
   * matrix.translate(100, 0);
   * console.log(matrix.isIdentity()); // false
   *
   * // Reset and verify
   * matrix.identity();
   * console.log(matrix.isIdentity()); // true
   * ```
   * @remarks
   * - Verifies a = 1, d = 1 (no scale)
   * - Verifies b = 0, c = 0 (no skew)
   * - Verifies tx = 0, ty = 0 (no translation)
   * @returns True if matrix has no transformations
   * @see {@link Matrix.identity} For resetting to identity
   * @see {@link Matrix.IDENTITY} For constant identity matrix
   */
  isIdentity() {
    return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
  }
  /**
   * Resets this Matrix to an identity (default) matrix.
   * Sets all components to their default values: scale=1, no skew, no translation.
   * @example
   * ```ts
   * // Reset transformed matrix
   * const matrix = new Matrix()
   *     .scale(2, 2)
   *     .rotate(Math.PI / 4);
   * matrix.identity(); // Back to default state
   *
   * // Chain after reset
   * matrix
   *     .identity()
   *     .translate(100, 100)
   *     .scale(2, 2);
   *
   * // Compare with identity constant
   * const isDefault = matrix.equals(Matrix.IDENTITY);
   * ```
   * @remarks
   * - Sets a=1, d=1 (default scale)
   * - Sets b=0, c=0 (no skew)
   * - Sets tx=0, ty=0 (no translation)
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.IDENTITY} For constant identity matrix
   * @see {@link Matrix.isIdentity} For checking identity state
   */
  identity() {
    return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
  }
  /**
   * Creates a new Matrix object with the same values as this one.
   * @returns A copy of this matrix. Good for chaining method calls.
   */
  clone() {
    const t = new k();
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  /**
   * Creates a new Matrix object with the same values as this one.
   * @param matrix
   * @example
   * ```ts
   * // Basic matrix cloning
   * const matrix = new Matrix()
   *     .translate(100, 100)
   *     .rotate(Math.PI / 4);
   * const copy = matrix.clone();
   *
   * // Clone and modify
   * const modified = matrix.clone()
   *     .scale(2, 2);
   *
   * // Compare matrices
   * console.log(matrix.equals(copy));     // true
   * console.log(matrix.equals(modified)); // false
   * ```
   * @returns A copy of this matrix. Good for chaining method calls.
   * @see {@link Matrix.copyTo} For copying to existing matrix
   * @see {@link Matrix.copyFrom} For copying from another matrix
   */
  copyTo(t) {
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  /**
   * Changes the values of the matrix to be the same as the ones in given matrix.
   * @example
   * ```ts
   * // Basic matrix copying
   * const source = new Matrix()
   *     .translate(100, 100)
   *     .rotate(Math.PI / 4);
   * const target = new Matrix();
   * target.copyFrom(source);
   * ```
   * @param matrix - The matrix to copy from
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.clone} For creating new matrix copy
   * @see {@link Matrix.copyTo} For copying to another matrix
   */
  copyFrom(t) {
    return this.a = t.a, this.b = t.b, this.c = t.c, this.d = t.d, this.tx = t.tx, this.ty = t.ty, this;
  }
  /**
   * Checks if this matrix equals another matrix.
   * Compares all components for exact equality.
   * @example
   * ```ts
   * // Basic equality check
   * const m1 = new Matrix();
   * const m2 = new Matrix();
   * console.log(m1.equals(m2)); // true
   *
   * // Compare transformed matrices
   * const transform = new Matrix()
   *     .translate(100, 100)
   * const clone = new Matrix()
   *     .scale(2, 2);
   * console.log(transform.equals(clone)); // false
   * ```
   * @param matrix - The matrix to compare to
   * @returns True if matrices are identical
   * @see {@link Matrix.copyFrom} For copying matrix values
   * @see {@link Matrix.isIdentity} For identity comparison
   */
  equals(t) {
    return t.a === this.a && t.b === this.b && t.c === this.c && t.d === this.d && t.tx === this.tx && t.ty === this.ty;
  }
  toString() {
    return `[pixi.js:Matrix a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty}]`;
  }
  /**
   * A default (identity) matrix with no transformations applied.
   *
   * > [!IMPORTANT] This is a shared read-only object. Create a new Matrix if you need to modify it.
   * @example
   * ```ts
   * // Get identity matrix reference
   * const identity = Matrix.IDENTITY;
   * console.log(identity.isIdentity()); // true
   *
   * // Compare with identity
   * const matrix = new Matrix();
   * console.log(matrix.equals(Matrix.IDENTITY)); // true
   *
   * // Create new matrix instead of modifying IDENTITY
   * const transform = new Matrix()
   *     .copyFrom(Matrix.IDENTITY)
   *     .translate(100, 100);
   * ```
   * @readonly
   * @returns A read-only identity matrix
   * @see {@link Matrix.shared} For temporary calculations
   * @see {@link Matrix.identity} For resetting matrices
   */
  static get IDENTITY() {
    return xo.identity();
  }
  /**
   * A static Matrix that can be used to avoid creating new objects.
   * Will always ensure the matrix is reset to identity when requested.
   *
   * > [!IMPORTANT] This matrix is shared and temporary. Do not store references to it.
   * @example
   * ```ts
   * // Use for temporary calculations
   * const tempMatrix = Matrix.shared;
   * tempMatrix.translate(100, 100).rotate(Math.PI / 4);
   * const point = tempMatrix.apply({ x: 10, y: 20 });
   *
   * // Will be reset to identity on next access
   * const fresh = Matrix.shared; // Back to identity
   * ```
   * @remarks
   * - Always returns identity matrix
   * - Safe to modify temporarily
   * - Not safe to store references
   * - Useful for one-off calculations
   * @readonly
   * @returns A fresh identity matrix for temporary use
   * @see {@link Matrix.IDENTITY} For immutable identity matrix
   * @see {@link Matrix.identity} For resetting matrices
   */
  static get shared() {
    return go.identity();
  }
}
const go = new k(), xo = new k(), Mt = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1], At = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1], Tt = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1], Pt = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1], As = [], Dr = [], ve = Math.sign;
function yo() {
  for (let s = 0; s < 16; s++) {
    const t = [];
    As.push(t);
    for (let e = 0; e < 16; e++) {
      const i = ve(Mt[s] * Mt[e] + Tt[s] * At[e]), r = ve(At[s] * Mt[e] + Pt[s] * At[e]), n = ve(Mt[s] * Tt[e] + Tt[s] * Pt[e]), o = ve(At[s] * Tt[e] + Pt[s] * Pt[e]);
      for (let a = 0; a < 16; a++)
        if (Mt[a] === i && At[a] === r && Tt[a] === n && Pt[a] === o) {
          t.push(a);
          break;
        }
    }
  }
  for (let s = 0; s < 16; s++) {
    const t = new k();
    t.set(Mt[s], At[s], Tt[s], Pt[s], 0, 0), Dr.push(t);
  }
}
yo();
const D = {
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 0°       | East      |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  E: 0,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 45°↻     | Southeast |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  SE: 1,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 90°↻     | South     |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  S: 2,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 135°↻    | Southwest |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  SW: 3,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 180°     | West      |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  W: 4,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -135°/225°↻ | Northwest    |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  NW: 5,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -90°/270°↻  | North        |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  N: 6,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -45°/315°↻  | Northeast    |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  NE: 7,
  /**
   * Reflection about Y-axis.
   * @group groupD8
   * @type {GD8Symmetry}
   */
  MIRROR_VERTICAL: 8,
  /**
   * Reflection about the main diagonal.
   * @group groupD8
   * @type {GD8Symmetry}
   */
  MAIN_DIAGONAL: 10,
  /**
   * Reflection about X-axis.
   * @group groupD8
   * @type {GD8Symmetry}
   */
  MIRROR_HORIZONTAL: 12,
  /**
   * Reflection about reverse diagonal.
   * @group groupD8
   * @type {GD8Symmetry}
   */
  REVERSE_DIAGONAL: 14,
  /**
   * @group groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the U-axis
   *    after rotating the axes.
   */
  uX: (s) => Mt[s],
  /**
   * @group groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the U-axis
   *    after rotating the axes.
   */
  uY: (s) => At[s],
  /**
   * @group groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the V-axis
   *    after rotating the axes.
   */
  vX: (s) => Tt[s],
  /**
   * @group groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the V-axis
   *    after rotating the axes.
   */
  vY: (s) => Pt[s],
  /**
   * @group groupD8
   * @param {GD8Symmetry} rotation - symmetry whose opposite
   *   is needed. Only rotations have opposite symmetries while
   *   reflections don't.
   * @returns {GD8Symmetry} The opposite symmetry of `rotation`
   */
  inv: (s) => s & 8 ? s & 15 : -s & 7,
  /**
   * Composes the two D8 operations.
   *
   * Taking `^` as reflection:
   *
   * |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
   * |-------|-----|-----|-----|-----|------|-------|-------|-------|
   * | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
   * | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
   * | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
   * | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
   * | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
   * | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
   * | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
   * | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
   *
   * [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
   * @group groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation, which
   *   is the row in the above cayley table.
   * @param {GD8Symmetry} rotationFirst - First operation, which
   *   is the column in the above cayley table.
   * @returns {GD8Symmetry} Composed operation
   */
  add: (s, t) => As[s][t],
  /**
   * Reverse of `add`.
   * @group groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation
   * @param {GD8Symmetry} rotationFirst - First operation
   * @returns {GD8Symmetry} Result
   */
  sub: (s, t) => As[s][D.inv(t)],
  /**
   * Adds 180 degrees to rotation, which is a commutative
   * operation.
   * @group groupD8
   * @param {number} rotation - The number to rotate.
   * @returns {number} Rotated number
   */
  rotate180: (s) => s ^ 4,
  /**
   * Checks if the rotation angle is vertical, i.e. south
   * or north. It doesn't work for reflections.
   * @group groupD8
   * @param {GD8Symmetry} rotation - The number to check.
   * @returns {boolean} Whether or not the direction is vertical
   */
  isVertical: (s) => (s & 3) === 2,
  // rotation % 4 === 2
  /**
   * Approximates the vector `V(dx,dy)` into one of the
   * eight directions provided by `groupD8`.
   * @group groupD8
   * @param {number} dx - X-component of the vector
   * @param {number} dy - Y-component of the vector
   * @returns {GD8Symmetry} Approximation of the vector into
   *  one of the eight symmetries.
   */
  byDirection: (s, t) => Math.abs(s) * 2 <= Math.abs(t) ? t >= 0 ? D.S : D.N : Math.abs(t) * 2 <= Math.abs(s) ? s > 0 ? D.E : D.W : t > 0 ? s > 0 ? D.SE : D.SW : s > 0 ? D.NE : D.NW,
  /**
   * Helps sprite to compensate texture packer rotation.
   * @group groupD8
   * @param {Matrix} matrix - sprite world matrix
   * @param {GD8Symmetry} rotation - The rotation factor to use.
   * @param {number} tx - sprite anchoring
   * @param {number} ty - sprite anchoring
   * @param {number} dw - sprite width
   * @param {number} dh - sprite height
   */
  matrixAppendRotationInv: (s, t, e = 0, i = 0, r = 0, n = 0) => {
    const o = Dr[D.inv(t)], a = o.a, h = o.b, l = o.c, c = o.d, u = e - Math.min(0, a * r, l * n, a * r + l * n), f = i - Math.min(0, h * r, c * n, h * r + c * n), d = s.a, p = s.b, g = s.c, m = s.d;
    s.a = a * d + h * g, s.b = a * p + h * m, s.c = l * d + c * g, s.d = l * p + c * m, s.tx = u * d + f * g + s.tx, s.ty = u * p + f * m + s.ty;
  },
  /**
   * Transforms rectangle coordinates based on texture packer rotation.
   * Used when texture atlas pages are rotated and coordinates need to be adjusted.
   * @group groupD8
   * @param {RectangleLike} rect - Rectangle with original coordinates to transform
   * @param {RectangleLike} sourceFrame - Source texture frame (includes offset and dimensions)
   * @param {GD8Symmetry} rotation - The groupD8 rotation value
   * @param {Rectangle} out - Rectangle to store the result
   * @returns {Rectangle} Transformed coordinates (includes source frame offset)
   */
  transformRectCoords: (s, t, e, i) => {
    const { x: r, y: n, width: o, height: a } = s, { x: h, y: l, width: c, height: u } = t;
    return e === D.E ? (i.set(r + h, n + l, o, a), i) : e === D.S ? i.set(
      c - n - a + h,
      r + l,
      a,
      o
    ) : e === D.W ? i.set(
      c - r - o + h,
      u - n - a + l,
      o,
      a
    ) : e === D.N ? i.set(
      n + h,
      u - r - o + l,
      a,
      o
    ) : i.set(r + h, n + l, o, a);
  }
}, we = [new j(), new j(), new j(), new j()];
class Y {
  /**
   * @param x - The X coordinate of the upper-left corner of the rectangle
   * @param y - The Y coordinate of the upper-left corner of the rectangle
   * @param width - The overall width of the rectangle
   * @param height - The overall height of the rectangle
   */
  constructor(t = 0, e = 0, i = 0, r = 0) {
    this.type = "rectangle", this.x = Number(t), this.y = Number(e), this.width = Number(i), this.height = Number(r);
  }
  /**
   * Returns the left edge (x-coordinate) of the rectangle.
   * @example
   * ```ts
   * // Get left edge position
   * const rect = new Rectangle(100, 100, 200, 150);
   * console.log(rect.left); // 100
   *
   * // Use in alignment calculations
   * sprite.x = rect.left + padding;
   *
   * // Compare positions
   * if (point.x > rect.left) {
   *     console.log('Point is right of rectangle');
   * }
   * ```
   * @readonly
   * @returns The x-coordinate of the left edge
   * @see {@link Rectangle.right} For right edge position
   * @see {@link Rectangle.x} For direct x-coordinate access
   */
  get left() {
    return this.x;
  }
  /**
   * Returns the right edge (x + width) of the rectangle.
   * @example
   * ```ts
   * // Get right edge position
   * const rect = new Rectangle(100, 100, 200, 150);
   * console.log(rect.right); // 300
   *
   * // Align to right edge
   * sprite.x = rect.right - sprite.width;
   *
   * // Check boundaries
   * if (point.x < rect.right) {
   *     console.log('Point is inside right bound');
   * }
   * ```
   * @readonly
   * @returns The x-coordinate of the right edge
   * @see {@link Rectangle.left} For left edge position
   * @see {@link Rectangle.width} For width value
   */
  get right() {
    return this.x + this.width;
  }
  /**
   * Returns the top edge (y-coordinate) of the rectangle.
   * @example
   * ```ts
   * // Get top edge position
   * const rect = new Rectangle(100, 100, 200, 150);
   * console.log(rect.top); // 100
   *
   * // Position above rectangle
   * sprite.y = rect.top - sprite.height;
   *
   * // Check vertical position
   * if (point.y > rect.top) {
   *     console.log('Point is below top edge');
   * }
   * ```
   * @readonly
   * @returns The y-coordinate of the top edge
   * @see {@link Rectangle.bottom} For bottom edge position
   * @see {@link Rectangle.y} For direct y-coordinate access
   */
  get top() {
    return this.y;
  }
  /**
   * Returns the bottom edge (y + height) of the rectangle.
   * @example
   * ```ts
   * // Get bottom edge position
   * const rect = new Rectangle(100, 100, 200, 150);
   * console.log(rect.bottom); // 250
   *
   * // Stack below rectangle
   * sprite.y = rect.bottom + margin;
   *
   * // Check vertical bounds
   * if (point.y < rect.bottom) {
   *     console.log('Point is above bottom edge');
   * }
   * ```
   * @readonly
   * @returns The y-coordinate of the bottom edge
   * @see {@link Rectangle.top} For top edge position
   * @see {@link Rectangle.height} For height value
   */
  get bottom() {
    return this.y + this.height;
  }
  /**
   * Determines whether the Rectangle is empty (has no area).
   * @example
   * ```ts
   * // Check zero dimensions
   * const rect = new Rectangle(100, 100, 0, 50);
   * console.log(rect.isEmpty()); // true
   * ```
   * @returns True if the rectangle has no area
   * @see {@link Rectangle.width} For width value
   * @see {@link Rectangle.height} For height value
   */
  isEmpty() {
    return this.left === this.right || this.top === this.bottom;
  }
  /**
   * A constant empty rectangle. This is a new object every time the property is accessed.
   * @example
   * ```ts
   * // Get fresh empty rectangle
   * const empty = Rectangle.EMPTY;
   * console.log(empty.isEmpty()); // true
   * ```
   * @returns A new empty rectangle instance
   * @see {@link Rectangle.isEmpty} For empty state testing
   */
  static get EMPTY() {
    return new Y(0, 0, 0, 0);
  }
  /**
   * Creates a clone of this Rectangle
   * @example
   * ```ts
   * // Basic cloning
   * const original = new Rectangle(100, 100, 200, 150);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.width *= 2;
   * modified.height += 50;
   *
   * // Verify independence
   * console.log(original.width);  // 200
   * console.log(modified.width);  // 400
   * ```
   * @returns A copy of the rectangle
   * @see {@link Rectangle.copyFrom} For copying into existing rectangle
   * @see {@link Rectangle.copyTo} For copying to another rectangle
   */
  clone() {
    return new Y(this.x, this.y, this.width, this.height);
  }
  /**
   * Converts a Bounds object to a Rectangle object.
   * @example
   * ```ts
   * // Convert bounds to rectangle
   * const bounds = container.getBounds();
   * const rect = new Rectangle().copyFromBounds(bounds);
   * ```
   * @param bounds - The bounds to copy and convert to a rectangle
   * @returns Returns itself
   * @see {@link Bounds} For bounds object structure
   * @see {@link Rectangle.getBounds} For getting rectangle bounds
   */
  copyFromBounds(t) {
    return this.x = t.minX, this.y = t.minY, this.width = t.maxX - t.minX, this.height = t.maxY - t.minY, this;
  }
  /**
   * Copies another rectangle to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Rectangle(100, 100, 200, 150);
   * const target = new Rectangle();
   * target.copyFrom(source);
   *
   * // Chain with other operations
   * const rect = new Rectangle()
   *     .copyFrom(source)
   *     .pad(10);
   * ```
   * @param rectangle - The rectangle to copy from
   * @returns Returns itself
   * @see {@link Rectangle.copyTo} For copying to another rectangle
   * @see {@link Rectangle.clone} For creating new rectangle copy
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
  }
  /**
   * Copies this rectangle to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Rectangle(100, 100, 200, 150);
   * const target = new Rectangle();
   * source.copyTo(target);
   *
   * // Chain with other operations
   * const result = source
   *     .copyTo(new Rectangle())
   *     .getBounds();
   * ```
   * @param rectangle - The rectangle to copy to
   * @returns Returns given parameter
   * @see {@link Rectangle.copyFrom} For copying from another rectangle
   * @see {@link Rectangle.clone} For creating new rectangle copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rectangle
   * @example
   * ```ts
   * // Basic containment check
   * const rect = new Rectangle(100, 100, 200, 150);
   * const isInside = rect.contains(150, 125); // true
   * // Check edge cases
   * console.log(rect.contains(100, 100)); // true (on edge)
   * console.log(rect.contains(300, 250)); // false (outside)
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Rectangle
   * @see {@link Rectangle.containsRect} For rectangle containment
   * @see {@link Rectangle.strokeContains} For checking stroke intersection
   */
  contains(t, e) {
    return this.width <= 0 || this.height <= 0 ? !1 : t >= this.x && t < this.x + this.width && e >= this.y && e < this.y + this.height;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const rect = new Rectangle(100, 100, 200, 150);
   * const isOnStroke = rect.strokeContains(150, 100, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = rect.strokeContains(150, 100, 4, 1);   // Inside
   * const centerStroke = rect.strokeContains(150, 100, 4, 0.5); // Centered
   * const outerStroke = rect.strokeContains(150, 100, 4, 0);   // Outside
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
   * @returns Whether the x/y coordinates are within this rectangle's stroke
   * @see {@link Rectangle.contains} For checking fill containment
   * @see {@link Rectangle.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, i, r = 0.5) {
    const { width: n, height: o } = this;
    if (n <= 0 || o <= 0) return !1;
    const a = this.x, h = this.y, l = i * (1 - r), c = i - l, u = a - l, f = a + n + l, d = h - l, p = h + o + l, g = a + c, m = a + n - c, x = h + c, y = h + o - c;
    return t >= u && t <= f && e >= d && e <= p && !(t > g && t < m && e > x && e < y);
  }
  /**
   * Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
   * Returns true only if the area of the intersection is >0, this means that Rectangles
   * sharing a side are not overlapping. Another side effect is that an arealess rectangle
   * (width or height equal to zero) can't intersect any other rectangle.
   * @param {Rectangle} other - The Rectangle to intersect with `this`.
   * @param {Matrix} transform - The transformation matrix of `other`.
   * @returns {boolean} A value of `true` if the transformed `other` Rectangle intersects with `this`; otherwise `false`.
   */
  /**
   * Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
   *
   * Returns true only if the area of the intersection is greater than 0.
   * This means that rectangles sharing only a side are not considered intersecting.
   * @example
   * ```ts
   * // Basic intersection check
   * const rect1 = new Rectangle(0, 0, 100, 100);
   * const rect2 = new Rectangle(50, 50, 100, 100);
   * console.log(rect1.intersects(rect2)); // true
   *
   * // With transformation matrix
   * const matrix = new Matrix();
   * matrix.rotate(Math.PI / 4); // 45 degrees
   * console.log(rect1.intersects(rect2, matrix)); // Checks with rotation
   *
   * // Edge cases
   * const zeroWidth = new Rectangle(0, 0, 0, 100);
   * console.log(rect1.intersects(zeroWidth)); // false (no area)
   * ```
   * @remarks
   * - Returns true only if intersection area is > 0
   * - Rectangles sharing only a side are not intersecting
   * - Zero-area rectangles cannot intersect anything
   * - Supports optional transformation matrix
   * @param other - The Rectangle to intersect with `this`
   * @param transform - Optional transformation matrix of `other`
   * @returns True if the transformed `other` Rectangle intersects with `this`
   * @see {@link Rectangle.containsRect} For containment testing
   * @see {@link Rectangle.contains} For point testing
   */
  intersects(t, e) {
    if (!e) {
      const M = this.x < t.x ? t.x : this.x;
      if ((this.right > t.right ? t.right : this.right) <= M)
        return !1;
      const C = this.y < t.y ? t.y : this.y;
      return (this.bottom > t.bottom ? t.bottom : this.bottom) > C;
    }
    const i = this.left, r = this.right, n = this.top, o = this.bottom;
    if (r <= i || o <= n)
      return !1;
    const a = we[0].set(t.left, t.top), h = we[1].set(t.left, t.bottom), l = we[2].set(t.right, t.top), c = we[3].set(t.right, t.bottom);
    if (l.x <= a.x || h.y <= a.y)
      return !1;
    const u = Math.sign(e.a * e.d - e.b * e.c);
    if (u === 0 || (e.apply(a, a), e.apply(h, h), e.apply(l, l), e.apply(c, c), Math.max(a.x, h.x, l.x, c.x) <= i || Math.min(a.x, h.x, l.x, c.x) >= r || Math.max(a.y, h.y, l.y, c.y) <= n || Math.min(a.y, h.y, l.y, c.y) >= o))
      return !1;
    const f = u * (h.y - a.y), d = u * (a.x - h.x), p = f * i + d * n, g = f * r + d * n, m = f * i + d * o, x = f * r + d * o;
    if (Math.max(p, g, m, x) <= f * a.x + d * a.y || Math.min(p, g, m, x) >= f * c.x + d * c.y)
      return !1;
    const y = u * (a.y - l.y), _ = u * (l.x - a.x), b = y * i + _ * n, S = y * r + _ * n, v = y * i + _ * o, w = y * r + _ * o;
    return !(Math.max(b, S, v, w) <= y * a.x + _ * a.y || Math.min(b, S, v, w) >= y * c.x + _ * c.y);
  }
  /**
   * Pads the rectangle making it grow in all directions.
   *
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @example
   * ```ts
   * // Basic padding
   * const rect = new Rectangle(100, 100, 200, 150);
   * rect.pad(10); // Adds 10px padding on all sides
   *
   * // Different horizontal and vertical padding
   * const uiRect = new Rectangle(0, 0, 100, 50);
   * uiRect.pad(20, 10); // 20px horizontal, 10px vertical
   * ```
   * @remarks
   * - Adjusts x/y by subtracting padding
   * - Increases width/height by padding * 2
   * - Common in UI layout calculations
   * - Chainable with other methods
   * @param paddingX - The horizontal padding amount
   * @param paddingY - The vertical padding amount
   * @returns Returns itself
   * @see {@link Rectangle.enlarge} For growing to include another rectangle
   * @see {@link Rectangle.fit} For shrinking to fit within another rectangle
   */
  pad(t = 0, e = t) {
    return this.x -= t, this.y -= e, this.width += t * 2, this.height += e * 2, this;
  }
  /**
   * Fits this rectangle around the passed one.
   * @example
   * ```ts
   * // Basic fitting
   * const container = new Rectangle(0, 0, 100, 100);
   * const content = new Rectangle(25, 25, 200, 200);
   * content.fit(container); // Clips to container bounds
   * ```
   * @param rectangle - The rectangle to fit around
   * @returns Returns itself
   * @see {@link Rectangle.enlarge} For growing to include another rectangle
   * @see {@link Rectangle.pad} For adding padding around the rectangle
   */
  fit(t) {
    const e = Math.max(this.x, t.x), i = Math.min(this.x + this.width, t.x + t.width), r = Math.max(this.y, t.y), n = Math.min(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = Math.max(i - e, 0), this.y = r, this.height = Math.max(n - r, 0), this;
  }
  /**
   * Enlarges rectangle so that its corners lie on a grid defined by resolution.
   * @example
   * ```ts
   * // Basic grid alignment
   * const rect = new Rectangle(10.2, 10.6, 100.8, 100.4);
   * rect.ceil(); // Aligns to whole pixels
   *
   * // Custom resolution grid
   * const uiRect = new Rectangle(5.3, 5.7, 50.2, 50.8);
   * uiRect.ceil(0.5); // Aligns to half pixels
   *
   * // Use with precision value
   * const preciseRect = new Rectangle(20.001, 20.999, 100.001, 100.999);
   * preciseRect.ceil(1, 0.01); // Handles small decimal variations
   * ```
   * @param resolution - The grid size to align to (1 = whole pixels)
   * @param eps - Small number to prevent floating point errors
   * @returns Returns itself
   * @see {@link Rectangle.fit} For constraining to bounds
   * @see {@link Rectangle.enlarge} For growing dimensions
   */
  ceil(t = 1, e = 1e-3) {
    const i = Math.ceil((this.x + this.width - e) * t) / t, r = Math.ceil((this.y + this.height - e) * t) / t;
    return this.x = Math.floor((this.x + e) * t) / t, this.y = Math.floor((this.y + e) * t) / t, this.width = i - this.x, this.height = r - this.y, this;
  }
  /**
   * Scales the rectangle's dimensions and position by the specified factors.
   * @example
   * ```ts
   * const rect = new Rectangle(50, 50, 100, 100);
   *
   * // Scale uniformly
   * rect.scale(0.5, 0.5);
   * // rect is now: x=25, y=25, width=50, height=50
   *
   * // non-uniformly
   * rect.scale(0.5, 1);
   * // rect is now: x=25, y=50, width=50, height=100
   * ```
   * @param x - The factor by which to scale the horizontal properties (x, width).
   * @param y - The factor by which to scale the vertical properties (y, height).
   * @returns Returns itself
   */
  scale(t, e = t) {
    return this.x *= t, this.y *= e, this.width *= t, this.height *= e, this;
  }
  /**
   * Enlarges this rectangle to include the passed rectangle.
   * @example
   * ```ts
   * // Basic enlargement
   * const rect = new Rectangle(50, 50, 100, 100);
   * const other = new Rectangle(0, 0, 200, 75);
   * rect.enlarge(other);
   * // rect is now: x=0, y=0, width=200, height=150
   *
   * // Use for bounding box calculation
   * const bounds = new Rectangle();
   * objects.forEach((obj) => {
   *     bounds.enlarge(obj.getBounds());
   * });
   * ```
   * @param rectangle - The rectangle to include
   * @returns Returns itself
   * @see {@link Rectangle.fit} For shrinking to fit within another rectangle
   * @see {@link Rectangle.pad} For adding padding around the rectangle
   */
  enlarge(t) {
    const e = Math.min(this.x, t.x), i = Math.max(this.x + this.width, t.x + t.width), r = Math.min(this.y, t.y), n = Math.max(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = i - e, this.y = r, this.height = n - r, this;
  }
  /**
   * Returns the framing rectangle of the rectangle as a Rectangle object
   * @example
   * ```ts
   * // Basic bounds retrieval
   * const rect = new Rectangle(100, 100, 200, 150);
   * const bounds = rect.getBounds();
   *
   * // Reuse existing rectangle
   * const out = new Rectangle();
   * rect.getBounds(out);
   * ```
   * @param out - Optional rectangle to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle.copyFrom} For direct copying
   * @see {@link Rectangle.clone} For creating new copy
   */
  getBounds(t) {
    return t || (t = new Y()), t.copyFrom(this), t;
  }
  /**
   * Determines whether another Rectangle is fully contained within this Rectangle.
   *
   * Rectangles that occupy the same space are considered to be containing each other.
   *
   * Rectangles without area (width or height equal to zero) can't contain anything,
   * not even other arealess rectangles.
   * @example
   * ```ts
   * // Check if one rectangle contains another
   * const container = new Rectangle(0, 0, 100, 100);
   * const inner = new Rectangle(25, 25, 50, 50);
   *
   * console.log(container.containsRect(inner)); // true
   *
   * // Check overlapping rectangles
   * const partial = new Rectangle(75, 75, 50, 50);
   * console.log(container.containsRect(partial)); // false
   *
   * // Zero-area rectangles
   * const empty = new Rectangle(0, 0, 0, 100);
   * console.log(container.containsRect(empty)); // false
   * ```
   * @param other - The Rectangle to check for containment
   * @returns True if other is fully contained within this Rectangle
   * @see {@link Rectangle.contains} For point containment
   * @see {@link Rectangle.intersects} For overlap testing
   */
  containsRect(t) {
    if (this.width <= 0 || this.height <= 0) return !1;
    const e = t.x, i = t.y, r = t.x + t.width, n = t.y + t.height;
    return e >= this.x && e < this.x + this.width && i >= this.y && i < this.y + this.height && r >= this.x && r < this.x + this.width && n >= this.y && n < this.y + this.height;
  }
  /**
   * Sets the position and dimensions of the rectangle.
   * @example
   * ```ts
   * // Basic usage
   * const rect = new Rectangle();
   * rect.set(100, 100, 200, 150);
   *
   * // Chain with other operations
   * const bounds = new Rectangle()
   *     .set(0, 0, 100, 100)
   *     .pad(10);
   * ```
   * @param x - The X coordinate of the upper-left corner of the rectangle
   * @param y - The Y coordinate of the upper-left corner of the rectangle
   * @param width - The overall width of the rectangle
   * @param height - The overall height of the rectangle
   * @returns Returns itself for method chaining
   * @see {@link Rectangle.copyFrom} For copying from another rectangle
   * @see {@link Rectangle.clone} For creating a new copy
   */
  set(t, e, i, r) {
    return this.x = t, this.y = e, this.width = i, this.height = r, this;
  }
  toString() {
    return `[pixi.js/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
  }
}
const je = {
  default: -1
};
function V(s = "default") {
  return je[s] === void 0 && (je[s] = -1), ++je[s];
}
const di = /* @__PURE__ */ new Set(), H = "8.0.0", _o = "8.3.4", Ot = {
  quiet: !1,
  noColor: !1
}, B = (s, t, e = 3) => {
  if (Ot.quiet || di.has(t)) return;
  let i = new Error().stack;
  const r = `${t}
Deprecated since v${s}`, n = typeof console.groupCollapsed == "function" && !Ot.noColor;
  typeof i > "u" ? console.warn("PixiJS Deprecation Warning: ", r) : (i = i.split(`
`).splice(e).join(`
`), n ? (console.groupCollapsed(
    "%cPixiJS Deprecation Warning: %c%s",
    "color:#614108;background:#fffbe6",
    "font-weight:normal;color:#614108;background:#fffbe6",
    r
  ), console.warn(i), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", r), console.warn(i))), di.add(t);
};
Object.defineProperties(B, {
  quiet: {
    get: () => Ot.quiet,
    set: (s) => {
      Ot.quiet = s;
    },
    enumerable: !0,
    configurable: !1
  },
  noColor: {
    get: () => Ot.noColor,
    set: (s) => {
      Ot.noColor = s;
    },
    enumerable: !0,
    configurable: !1
  }
});
const Lr = () => {
};
function fi(s) {
  return s += s === 0 ? 1 : 0, --s, s |= s >>> 1, s |= s >>> 2, s |= s >>> 4, s |= s >>> 8, s |= s >>> 16, s + 1;
}
function pi(s) {
  return !(s & s - 1) && !!s;
}
function Or(s) {
  const t = {};
  for (const e in s)
    s[e] !== void 0 && (t[e] = s[e]);
  return t;
}
const mi = /* @__PURE__ */ Object.create(null);
function bo(s) {
  const t = mi[s];
  return t === void 0 && (mi[s] = V("resource")), t;
}
const zr = class Ur extends mt {
  /**
   * @param options - options for the style
   */
  constructor(t = {}) {
    super(), this._resourceType = "textureSampler", this._touched = 0, this._maxAnisotropy = 1, this.destroyed = !1, t = { ...Ur.defaultOptions, ...t }, this.addressMode = t.addressMode, this.addressModeU = t.addressModeU ?? this.addressModeU, this.addressModeV = t.addressModeV ?? this.addressModeV, this.addressModeW = t.addressModeW ?? this.addressModeW, this.scaleMode = t.scaleMode, this.magFilter = t.magFilter ?? this.magFilter, this.minFilter = t.minFilter ?? this.minFilter, this.mipmapFilter = t.mipmapFilter ?? this.mipmapFilter, this.lodMinClamp = t.lodMinClamp, this.lodMaxClamp = t.lodMaxClamp, this.compare = t.compare, this.maxAnisotropy = t.maxAnisotropy ?? 1;
  }
  set addressMode(t) {
    this.addressModeU = t, this.addressModeV = t, this.addressModeW = t;
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this.addressModeU;
  }
  set wrapMode(t) {
    B(H, "TextureStyle.wrapMode is now TextureStyle.addressMode"), this.addressMode = t;
  }
  get wrapMode() {
    return this.addressMode;
  }
  set scaleMode(t) {
    this.magFilter = t, this.minFilter = t, this.mipmapFilter = t;
  }
  /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
  get scaleMode() {
    return this.magFilter;
  }
  /** Specifies the maximum anisotropy value clamp used by the sampler. */
  set maxAnisotropy(t) {
    this._maxAnisotropy = Math.min(t, 16), this._maxAnisotropy > 1 && (this.scaleMode = "linear");
  }
  get maxAnisotropy() {
    return this._maxAnisotropy;
  }
  // TODO - move this to WebGL?
  get _resourceId() {
    return this._sharedResourceId || this._generateResourceId();
  }
  update() {
    this._sharedResourceId = null, this.emit("change", this);
  }
  _generateResourceId() {
    const t = `${this.addressModeU}-${this.addressModeV}-${this.addressModeW}-${this.magFilter}-${this.minFilter}-${this.mipmapFilter}-${this.lodMinClamp}-${this.lodMaxClamp}-${this.compare}-${this._maxAnisotropy}`;
    return this._sharedResourceId = bo(t), this._resourceId;
  }
  /** Destroys the style */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this.removeAllListeners();
  }
};
zr.defaultOptions = {
  addressMode: "clamp-to-edge",
  scaleMode: "linear"
};
let Nr = zr;
const Vr = class Hr extends mt {
  /**
   * @param options - options for creating a new TextureSource
   */
  constructor(t = {}) {
    super(), this.options = t, this._gpuData = /* @__PURE__ */ Object.create(null), this._gcLastUsed = -1, this.uid = V("textureSource"), this._resourceType = "textureSource", this._resourceId = V("resource"), this.uploadMethodId = "unknown", this._resolution = 1, this.pixelWidth = 1, this.pixelHeight = 1, this.width = 1, this.height = 1, this.sampleCount = 1, this.mipLevelCount = 1, this.autoGenerateMipmaps = !1, this.format = "rgba8unorm", this.dimension = "2d", this.viewDimension = "2d", this.arrayLayerCount = 1, this.antialias = !1, this._touched = 0, this._batchTick = -1, this._textureBindLocation = -1, t = { ...Hr.defaultOptions, ...t }, this.label = t.label ?? "", this.resource = t.resource, this.autoGarbageCollect = t.autoGarbageCollect, this._resolution = t.resolution, t.width ? this.pixelWidth = t.width * this._resolution : this.pixelWidth = this.resource ? this.resourceWidth ?? 1 : 1, t.height ? this.pixelHeight = t.height * this._resolution : this.pixelHeight = this.resource ? this.resourceHeight ?? 1 : 1, this.width = this.pixelWidth / this._resolution, this.height = this.pixelHeight / this._resolution, this.format = t.format, this.dimension = t.dimensions, this.viewDimension = t.viewDimension ?? t.dimensions, this.arrayLayerCount = t.arrayLayerCount, this.mipLevelCount = t.mipLevelCount, this.autoGenerateMipmaps = t.autoGenerateMipmaps, this.sampleCount = t.sampleCount, this.antialias = t.antialias, this.alphaMode = t.alphaMode, this.style = new Nr(Or(t)), this.destroyed = !1, this._refreshPOT();
  }
  /** returns itself */
  get source() {
    return this;
  }
  /** the style of the texture */
  get style() {
    return this._style;
  }
  set style(t) {
    var e, i;
    this.style !== t && ((e = this._style) == null || e.off("change", this._onStyleChange, this), this._style = t, (i = this._style) == null || i.on("change", this._onStyleChange, this), this._onStyleChange());
  }
  /** Specifies the maximum anisotropy value clamp used by the sampler. */
  set maxAnisotropy(t) {
    this._style.maxAnisotropy = t;
  }
  get maxAnisotropy() {
    return this._style.maxAnisotropy;
  }
  /** setting this will set wrapModeU, wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this._style.addressMode;
  }
  set addressMode(t) {
    this._style.addressMode = t;
  }
  /** setting this will set wrapModeU, wrapModeV and wrapModeW all at once! */
  get repeatMode() {
    return this._style.addressMode;
  }
  set repeatMode(t) {
    this._style.addressMode = t;
  }
  /** Specifies the sampling behavior when the sample footprint is smaller than or equal to one texel. */
  get magFilter() {
    return this._style.magFilter;
  }
  set magFilter(t) {
    this._style.magFilter = t;
  }
  /** Specifies the sampling behavior when the sample footprint is larger than one texel. */
  get minFilter() {
    return this._style.minFilter;
  }
  set minFilter(t) {
    this._style.minFilter = t;
  }
  /** Specifies behavior for sampling between mipmap levels. */
  get mipmapFilter() {
    return this._style.mipmapFilter;
  }
  set mipmapFilter(t) {
    this._style.mipmapFilter = t;
  }
  /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
  get lodMinClamp() {
    return this._style.lodMinClamp;
  }
  set lodMinClamp(t) {
    this._style.lodMinClamp = t;
  }
  /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
  get lodMaxClamp() {
    return this._style.lodMaxClamp;
  }
  set lodMaxClamp(t) {
    this._style.lodMaxClamp = t;
  }
  _onStyleChange() {
    this.emit("styleChange", this);
  }
  /** call this if you have modified the texture outside of the constructor */
  update() {
    if (this.resource) {
      const t = this._resolution;
      if (this.resize(this.resourceWidth / t, this.resourceHeight / t)) return;
    }
    this.emit("update", this);
  }
  /** Destroys this texture source */
  destroy() {
    this.destroyed = !0, this.unload(), this.emit("destroy", this), this._style && (this._style.destroy(), this._style = null), this.uploadMethodId = null, this.resource = null, this.removeAllListeners();
  }
  /**
   * This will unload the Texture source from the GPU. This will free up the GPU memory
   * As soon as it is required fore rendering, it will be re-uploaded.
   */
  unload() {
    var t, e;
    this._resourceId = V("resource"), this.emit("change", this), this.emit("unload", this);
    for (const i in this._gpuData)
      (e = (t = this._gpuData[i]) == null ? void 0 : t.destroy) == null || e.call(t);
    this._gpuData = /* @__PURE__ */ Object.create(null);
  }
  /** the width of the resource. This is the REAL pure number, not accounting resolution   */
  get resourceWidth() {
    const { resource: t } = this;
    return t.naturalWidth || t.videoWidth || t.displayWidth || t.width;
  }
  /** the height of the resource. This is the REAL pure number, not accounting resolution */
  get resourceHeight() {
    const { resource: t } = this;
    return t.naturalHeight || t.videoHeight || t.displayHeight || t.height;
  }
  /**
   * the resolution of the texture. Changing this number, will not change the number of pixels in the actual texture
   * but will the size of the texture when rendered.
   *
   * changing the resolution of this texture to 2 for example will make it appear twice as small when rendered (as pixel
   * density will have increased)
   */
  get resolution() {
    return this._resolution;
  }
  set resolution(t) {
    this._resolution !== t && (this._resolution = t, this.width = this.pixelWidth / t, this.height = this.pixelHeight / t);
  }
  /**
   * Resize the texture, this is handy if you want to use the texture as a render texture
   * @param width - the new width of the texture
   * @param height - the new height of the texture
   * @param resolution - the new resolution of the texture
   * @returns - if the texture was resized
   */
  resize(t, e, i) {
    i || (i = this._resolution), t || (t = this.width), e || (e = this.height);
    const r = Math.round(t * i), n = Math.round(e * i);
    return this.width = r / i, this.height = n / i, this._resolution = i, this.pixelWidth === r && this.pixelHeight === n ? !1 : (this._refreshPOT(), this.pixelWidth = r, this.pixelHeight = n, this.emit("resize", this), this._resourceId = V("resource"), this.emit("change", this), !0);
  }
  /**
   * Lets the renderer know that this texture has been updated and its mipmaps should be re-generated.
   * This is only important for RenderTexture instances, as standard Texture instances will have their
   * mipmaps generated on upload. You should call this method after you make any change to the texture
   *
   * The reason for this is is can be quite expensive to update mipmaps for a texture. So by default,
   * We want you, the developer to specify when this action should happen.
   *
   * Generally you don't want to have mipmaps generated on Render targets that are changed every frame,
   */
  updateMipmaps() {
    this.autoGenerateMipmaps && this.mipLevelCount > 1 && this.emit("updateMipmaps", this);
  }
  set wrapMode(t) {
    this._style.wrapMode = t;
  }
  get wrapMode() {
    return this._style.wrapMode;
  }
  set scaleMode(t) {
    this._style.scaleMode = t;
  }
  /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
  get scaleMode() {
    return this._style.scaleMode;
  }
  /**
   * Refresh check for isPowerOfTwo texture based on size
   * @private
   */
  _refreshPOT() {
    this.isPowerOfTwo = pi(this.pixelWidth) && pi(this.pixelHeight);
  }
  static test(t) {
    throw new Error("Unimplemented");
  }
};
Vr.defaultOptions = {
  resolution: 1,
  format: "bgra8unorm",
  alphaMode: "premultiply-alpha-on-upload",
  dimensions: "2d",
  viewDimension: "2d",
  arrayLayerCount: 1,
  mipLevelCount: 1,
  autoGenerateMipmaps: !1,
  sampleCount: 1,
  antialias: !1,
  autoGarbageCollect: !1
};
let at = Vr;
class Xs extends at {
  constructor(t) {
    const e = t.resource || new Float32Array(t.width * t.height * 4);
    let i = t.format;
    i || (e instanceof Float32Array ? i = "rgba32float" : e instanceof Int32Array || e instanceof Uint32Array ? i = "rgba32uint" : e instanceof Int16Array || e instanceof Uint16Array ? i = "rgba16uint" : (e instanceof Int8Array, i = "bgra8unorm")), super({
      ...t,
      resource: e,
      format: i
    }), this.uploadMethodId = "buffer";
  }
  static test(t) {
    return t instanceof Int8Array || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array;
  }
}
Xs.extension = I.TextureSource;
const gi = new k();
class vo {
  /**
   * @param texture - observed texture
   * @param clampMargin - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
   */
  constructor(t, e) {
    this.mapCoord = new k(), this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._updateID = 0, this.clampOffset = 0, typeof e > "u" ? this.clampMargin = t.width < 10 ? 0 : 0.5 : this.clampMargin = e, this.isSimple = !1, this.texture = t;
  }
  /** Texture property. */
  get texture() {
    return this._texture;
  }
  set texture(t) {
    var e;
    this._texture !== t && ((e = this._texture) == null || e.removeListener("update", this.update, this), this._texture = t, this._texture.addListener("update", this.update, this)), this.update();
  }
  /**
   * Multiplies uvs array to transform
   * @param uvs - mesh uvs
   * @param [out=uvs] - output
   * @returns - output
   */
  multiplyUvs(t, e) {
    e === void 0 && (e = t);
    const i = this.mapCoord;
    for (let r = 0; r < t.length; r += 2) {
      const n = t[r], o = t[r + 1];
      e[r] = n * i.a + o * i.c + i.tx, e[r + 1] = n * i.b + o * i.d + i.ty;
    }
    return e;
  }
  /**
   * Updates matrices if texture was changed
   * @returns - whether or not it was updated
   */
  update() {
    const t = this._texture;
    this._updateID++;
    const e = t.uvs;
    this.mapCoord.set(e.x1 - e.x0, e.y1 - e.y0, e.x3 - e.x0, e.y3 - e.y0, e.x0, e.y0);
    const i = t.orig, r = t.trim;
    r && (gi.set(
      i.width / r.width,
      0,
      0,
      i.height / r.height,
      -r.x / r.width,
      -r.y / r.height
    ), this.mapCoord.append(gi));
    const n = t.source, o = this.uClampFrame, a = this.clampMargin / n._resolution, h = this.clampOffset / n._resolution;
    return o[0] = (t.frame.x + a + h) / n.width, o[1] = (t.frame.y + a + h) / n.height, o[2] = (t.frame.x + t.frame.width - a + h) / n.width, o[3] = (t.frame.y + t.frame.height - a + h) / n.height, this.uClampOffset[0] = this.clampOffset / n.pixelWidth, this.uClampOffset[1] = this.clampOffset / n.pixelHeight, this.isSimple = t.frame.width === n.width && t.frame.height === n.height && t.rotate === 0, !0;
  }
}
class L extends mt {
  /**
   * @param {TextureOptions} options - Options for the texture
   */
  constructor({
    source: t,
    label: e,
    frame: i,
    orig: r,
    trim: n,
    defaultAnchor: o,
    defaultBorders: a,
    rotate: h,
    dynamic: l
  } = {}) {
    if (super(), this.uid = V("texture"), this.uvs = { x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 }, this.frame = new Y(), this.noFrame = !1, this.dynamic = !1, this.isTexture = !0, this.label = e, this.source = (t == null ? void 0 : t.source) ?? new at(), this.noFrame = !i, i)
      this.frame.copyFrom(i);
    else {
      const { width: c, height: u } = this._source;
      this.frame.width = c, this.frame.height = u;
    }
    this.orig = r || this.frame, this.trim = n, this.rotate = h ?? 0, this.defaultAnchor = o, this.defaultBorders = a, this.destroyed = !1, this.dynamic = l || !1, this.updateUvs();
  }
  set source(t) {
    this._source && this._source.off("resize", this.update, this), this._source = t, t.on("resize", this.update, this), this.emit("update", this);
  }
  /** the underlying source of the texture (equivalent of baseTexture in v7) */
  get source() {
    return this._source;
  }
  /** returns a TextureMatrix instance for this texture. By default, that object is not created because its heavy. */
  get textureMatrix() {
    return this._textureMatrix || (this._textureMatrix = new vo(this)), this._textureMatrix;
  }
  /** The width of the Texture in pixels. */
  get width() {
    return this.orig.width;
  }
  /** The height of the Texture in pixels. */
  get height() {
    return this.orig.height;
  }
  /** Call this function when you have modified the frame of this texture. */
  updateUvs() {
    const { uvs: t, frame: e } = this, { width: i, height: r } = this._source, n = e.x / i, o = e.y / r, a = e.width / i, h = e.height / r;
    let l = this.rotate;
    if (l) {
      const c = a / 2, u = h / 2, f = n + c, d = o + u;
      l = D.add(l, D.NW), t.x0 = f + c * D.uX(l), t.y0 = d + u * D.uY(l), l = D.add(l, 2), t.x1 = f + c * D.uX(l), t.y1 = d + u * D.uY(l), l = D.add(l, 2), t.x2 = f + c * D.uX(l), t.y2 = d + u * D.uY(l), l = D.add(l, 2), t.x3 = f + c * D.uX(l), t.y3 = d + u * D.uY(l);
    } else
      t.x0 = n, t.y0 = o, t.x1 = n + a, t.y1 = o, t.x2 = n + a, t.y2 = o + h, t.x3 = n, t.y3 = o + h;
  }
  /**
   * Destroys this texture
   * @param destroySource - Destroy the source when the texture is destroyed.
   */
  destroy(t = !1) {
    this._source && (this._source.off("resize", this.update, this), t && (this._source.destroy(), this._source = null)), this._textureMatrix = null, this.destroyed = !0, this.emit("destroy", this), this.removeAllListeners();
  }
  /**
   * Call this if you have modified the `texture outside` of the constructor.
   *
   * If you have modified this texture's source, you must separately call `texture.source.update()` to see those changes.
   */
  update() {
    this.noFrame && (this.frame.width = this._source.width, this.frame.height = this._source.height), this.updateUvs(), this.emit("update", this);
  }
  /** @deprecated since 8.0.0 */
  get baseTexture() {
    return B(H, "Texture.baseTexture is now Texture.source"), this._source;
  }
}
L.EMPTY = new L({
  label: "EMPTY",
  source: new at({
    label: "EMPTY"
  })
});
L.EMPTY.destroy = Lr;
L.WHITE = new L({
  source: new Xs({
    resource: new Uint8Array([255, 255, 255, 255]),
    width: 1,
    height: 1,
    alphaMode: "premultiply-alpha-on-upload",
    label: "WHITE"
  }),
  label: "WHITE"
});
L.WHITE.destroy = Lr;
function wo(s, t, e) {
  const { width: i, height: r } = e.orig, n = e.trim;
  if (n) {
    const o = n.width, a = n.height;
    s.minX = n.x - t._x * i, s.maxX = s.minX + o, s.minY = n.y - t._y * r, s.maxY = s.minY + a;
  } else
    s.minX = -t._x * i, s.maxX = s.minX + i, s.minY = -t._y * r, s.maxY = s.minY + r;
}
const xi = new k();
class ot {
  /**
   * Creates a new Bounds object.
   * @param minX - The minimum X coordinate of the bounds.
   * @param minY - The minimum Y coordinate of the bounds.
   * @param maxX - The maximum X coordinate of the bounds.
   * @param maxY - The maximum Y coordinate of the bounds.
   */
  constructor(t = 1 / 0, e = 1 / 0, i = -1 / 0, r = -1 / 0) {
    this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = xi, this.minX = t, this.minY = e, this.maxX = i, this.maxY = r;
  }
  /**
   * Checks if bounds are empty, meaning either width or height is zero or negative.
   * Empty bounds occur when min values exceed max values on either axis.
   * @example
   * ```ts
   * const bounds = new Bounds();
   *
   * // Check if newly created bounds are empty
   * console.log(bounds.isEmpty()); // true, default bounds are empty
   *
   * // Add frame and check again
   * bounds.addFrame(0, 0, 100, 100);
   * console.log(bounds.isEmpty()); // false, bounds now have area
   *
   * // Clear bounds
   * bounds.clear();
   * console.log(bounds.isEmpty()); // true, bounds are empty again
   * ```
   * @returns True if bounds are empty (have no area)
   * @see {@link Bounds#clear} For resetting bounds
   * @see {@link Bounds#isValid} For checking validity
   */
  isEmpty() {
    return this.minX > this.maxX || this.minY > this.maxY;
  }
  /**
   * The bounding rectangle representation of these bounds.
   * Lazily creates and updates a Rectangle instance based on the current bounds.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   *
   * // Get rectangle representation
   * const rect = bounds.rectangle;
   * console.log(rect.x, rect.y, rect.width, rect.height);
   *
   * // Use for hit testing
   * if (bounds.rectangle.contains(mouseX, mouseY)) {
   *     console.log('Mouse is inside bounds!');
   * }
   * ```
   * @see {@link Rectangle} For rectangle methods
   * @see {@link Bounds.isEmpty} For bounds validation
   */
  get rectangle() {
    this._rectangle || (this._rectangle = new Y());
    const t = this._rectangle;
    return this.minX > this.maxX || this.minY > this.maxY ? (t.x = 0, t.y = 0, t.width = 0, t.height = 0) : t.copyFromBounds(this), t;
  }
  /**
   * Clears the bounds and resets all coordinates to their default values.
   * Resets the transformation matrix back to identity.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * console.log(bounds.isEmpty()); // false
   * // Clear the bounds
   * bounds.clear();
   * console.log(bounds.isEmpty()); // true
   * ```
   * @returns This bounds object for chaining
   */
  clear() {
    return this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = xi, this;
  }
  /**
   * Sets the bounds directly using coordinate values.
   * Provides a way to set all bounds values at once.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * bounds.set(0, 0, 100, 100);
   * ```
   * @param x0 - Left X coordinate of frame
   * @param y0 - Top Y coordinate of frame
   * @param x1 - Right X coordinate of frame
   * @param y1 - Bottom Y coordinate of frame
   * @see {@link Bounds#addFrame} For matrix-aware bounds setting
   * @see {@link Bounds#clear} For resetting bounds
   */
  set(t, e, i, r) {
    this.minX = t, this.minY = e, this.maxX = i, this.maxY = r;
  }
  /**
   * Adds a rectangular frame to the bounds, optionally transformed by a matrix.
   * Updates the bounds to encompass the new frame coordinates.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * bounds.addFrame(0, 0, 100, 100);
   *
   * // Add transformed frame
   * const matrix = new Matrix()
   *     .translate(50, 50)
   *     .rotate(Math.PI / 4);
   * bounds.addFrame(0, 0, 100, 100, matrix);
   * ```
   * @param x0 - Left X coordinate of frame
   * @param y0 - Top Y coordinate of frame
   * @param x1 - Right X coordinate of frame
   * @param y1 - Bottom Y coordinate of frame
   * @param matrix - Optional transformation matrix
   * @see {@link Bounds#addRect} For adding Rectangle objects
   * @see {@link Bounds#addBounds} For adding other Bounds
   */
  addFrame(t, e, i, r, n) {
    n || (n = this.matrix);
    const o = n.a, a = n.b, h = n.c, l = n.d, c = n.tx, u = n.ty;
    let f = this.minX, d = this.minY, p = this.maxX, g = this.maxY, m = o * t + h * e + c, x = a * t + l * e + u;
    m < f && (f = m), x < d && (d = x), m > p && (p = m), x > g && (g = x), m = o * i + h * e + c, x = a * i + l * e + u, m < f && (f = m), x < d && (d = x), m > p && (p = m), x > g && (g = x), m = o * t + h * r + c, x = a * t + l * r + u, m < f && (f = m), x < d && (d = x), m > p && (p = m), x > g && (g = x), m = o * i + h * r + c, x = a * i + l * r + u, m < f && (f = m), x < d && (d = x), m > p && (p = m), x > g && (g = x), this.minX = f, this.minY = d, this.maxX = p, this.maxY = g;
  }
  /**
   * Adds a rectangle to the bounds, optionally transformed by a matrix.
   * Updates the bounds to encompass the given rectangle.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * // Add simple rectangle
   * const rect = new Rectangle(0, 0, 100, 100);
   * bounds.addRect(rect);
   *
   * // Add transformed rectangle
   * const matrix = new Matrix()
   *     .translate(50, 50)
   *     .rotate(Math.PI / 4);
   * bounds.addRect(rect, matrix);
   * ```
   * @param rect - The rectangle to be added
   * @param matrix - Optional transformation matrix
   * @see {@link Bounds#addFrame} For adding raw coordinates
   * @see {@link Bounds#addBounds} For adding other bounds
   */
  addRect(t, e) {
    this.addFrame(t.x, t.y, t.x + t.width, t.y + t.height, e);
  }
  /**
   * Adds another bounds object to this one, optionally transformed by a matrix.
   * Expands the bounds to include the given bounds' area.
   * @example
   * ```ts
   * const bounds = new Bounds();
   *
   * // Add child bounds
   * const childBounds = sprite.getBounds();
   * bounds.addBounds(childBounds);
   *
   * // Add transformed bounds
   * const matrix = new Matrix()
   *     .scale(2, 2);
   * bounds.addBounds(childBounds, matrix);
   * ```
   * @param bounds - The bounds to be added
   * @param matrix - Optional transformation matrix
   * @see {@link Bounds#addFrame} For adding raw coordinates
   * @see {@link Bounds#addRect} For adding rectangles
   */
  addBounds(t, e) {
    this.addFrame(t.minX, t.minY, t.maxX, t.maxY, e);
  }
  /**
   * Adds other Bounds as a mask, creating an intersection of the two bounds.
   * Only keeps the overlapping region between current bounds and mask bounds.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Create mask bounds
   * const mask = new Bounds();
   * mask.addFrame(50, 50, 150, 150);
   * // Apply mask - results in bounds of (50,50,100,100)
   * bounds.addBoundsMask(mask);
   * ```
   * @param mask - The Bounds to use as a mask
   * @see {@link Bounds#addBounds} For union operation
   * @see {@link Bounds#fit} For fitting to rectangle
   */
  addBoundsMask(t) {
    this.minX = this.minX > t.minX ? this.minX : t.minX, this.minY = this.minY > t.minY ? this.minY : t.minY, this.maxX = this.maxX < t.maxX ? this.maxX : t.maxX, this.maxY = this.maxY < t.maxY ? this.maxY : t.maxY;
  }
  /**
   * Applies a transformation matrix to the bounds, updating its coordinates.
   * Transforms all corners of the bounds using the given matrix.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Apply translation
   * const translateMatrix = new Matrix()
   *     .translate(50, 50);
   * bounds.applyMatrix(translateMatrix);
   * ```
   * @param matrix - The matrix to apply to the bounds
   * @see {@link Matrix} For matrix operations
   * @see {@link Bounds#addFrame} For adding transformed frames
   */
  applyMatrix(t) {
    const e = this.minX, i = this.minY, r = this.maxX, n = this.maxY, { a: o, b: a, c: h, d: l, tx: c, ty: u } = t;
    let f = o * e + h * i + c, d = a * e + l * i + u;
    this.minX = f, this.minY = d, this.maxX = f, this.maxY = d, f = o * r + h * i + c, d = a * r + l * i + u, this.minX = f < this.minX ? f : this.minX, this.minY = d < this.minY ? d : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = d > this.maxY ? d : this.maxY, f = o * e + h * n + c, d = a * e + l * n + u, this.minX = f < this.minX ? f : this.minX, this.minY = d < this.minY ? d : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = d > this.maxY ? d : this.maxY, f = o * r + h * n + c, d = a * r + l * n + u, this.minX = f < this.minX ? f : this.minX, this.minY = d < this.minY ? d : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = d > this.maxY ? d : this.maxY;
  }
  /**
   * Resizes the bounds object to fit within the given rectangle.
   * Clips the bounds if they extend beyond the rectangle's edges.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 200, 200);
   * // Fit within viewport
   * const viewport = new Rectangle(50, 50, 100, 100);
   * bounds.fit(viewport);
   * // bounds are now (50, 50, 150, 150)
   * ```
   * @param rect - The rectangle to fit within
   * @returns This bounds object for chaining
   * @see {@link Bounds#addBoundsMask} For intersection
   * @see {@link Bounds#pad} For expanding bounds
   */
  fit(t) {
    return this.minX < t.left && (this.minX = t.left), this.maxX > t.right && (this.maxX = t.right), this.minY < t.top && (this.minY = t.top), this.maxY > t.bottom && (this.maxY = t.bottom), this;
  }
  /**
   * Resizes the bounds object to include the given bounds.
   * Similar to fit() but works with raw coordinate values instead of a Rectangle.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 200, 200);
   * // Fit to specific coordinates
   * bounds.fitBounds(50, 150, 50, 150);
   * // bounds are now (50, 50, 150, 150)
   * ```
   * @param left - The left value of the bounds
   * @param right - The right value of the bounds
   * @param top - The top value of the bounds
   * @param bottom - The bottom value of the bounds
   * @returns This bounds object for chaining
   * @see {@link Bounds#fit} For fitting to Rectangle
   * @see {@link Bounds#addBoundsMask} For intersection
   */
  fitBounds(t, e, i, r) {
    return this.minX < t && (this.minX = t), this.maxX > e && (this.maxX = e), this.minY < i && (this.minY = i), this.maxY > r && (this.maxY = r), this;
  }
  /**
   * Pads bounds object, making it grow in all directions.
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   *
   * // Add equal padding
   * bounds.pad(10);
   * // bounds are now (-10, -10, 110, 110)
   *
   * // Add different padding for x and y
   * bounds.pad(20, 10);
   * // bounds are now (-30, -20, 130, 120)
   * ```
   * @param paddingX - The horizontal padding amount
   * @param paddingY - The vertical padding amount
   * @returns This bounds object for chaining
   * @see {@link Bounds#fit} For constraining bounds
   * @see {@link Bounds#scale} For uniform scaling
   */
  pad(t, e = t) {
    return this.minX -= t, this.maxX += t, this.minY -= e, this.maxY += e, this;
  }
  /**
   * Ceils the bounds by rounding up max values and rounding down min values.
   * Useful for pixel-perfect calculations and avoiding fractional pixels.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * bounds.set(10.2, 10.9, 50.1, 50.8);
   *
   * // Round to whole pixels
   * bounds.ceil();
   * // bounds are now (10, 10, 51, 51)
   * ```
   * @returns This bounds object for chaining
   * @see {@link Bounds#scale} For size adjustments
   * @see {@link Bounds#fit} For constraining bounds
   */
  ceil() {
    return this.minX = Math.floor(this.minX), this.minY = Math.floor(this.minY), this.maxX = Math.ceil(this.maxX), this.maxY = Math.ceil(this.maxY), this;
  }
  /**
   * Creates a new Bounds instance with the same values.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   *
   * // Create a copy
   * const copy = bounds.clone();
   *
   * // Original and copy are independent
   * bounds.pad(10);
   * console.log(copy.width === bounds.width); // false
   * ```
   * @returns A new Bounds instance with the same values
   * @see {@link Bounds#copyFrom} For reusing existing bounds
   */
  clone() {
    return new ot(this.minX, this.minY, this.maxX, this.maxY);
  }
  /**
   * Scales the bounds by the given values, adjusting all edges proportionally.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   *
   * // Scale uniformly
   * bounds.scale(2);
   * // bounds are now (0, 0, 200, 200)
   *
   * // Scale non-uniformly
   * bounds.scale(0.5, 2);
   * // bounds are now (0, 0, 100, 400)
   * ```
   * @param x - The X value to scale by
   * @param y - The Y value to scale by (defaults to x)
   * @returns This bounds object for chaining
   * @see {@link Bounds#pad} For adding padding
   * @see {@link Bounds#fit} For constraining size
   */
  scale(t, e = t) {
    return this.minX *= t, this.minY *= e, this.maxX *= t, this.maxY *= e, this;
  }
  /**
   * The x position of the bounds in local space.
   * Setting this value will move the bounds while maintaining its width.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Get x position
   * console.log(bounds.x); // 0
   *
   * // Move bounds horizontally
   * bounds.x = 50;
   * console.log(bounds.minX, bounds.maxX); // 50, 150
   *
   * // Width stays the same
   * console.log(bounds.width); // Still 100
   * ```
   */
  get x() {
    return this.minX;
  }
  set x(t) {
    const e = this.maxX - this.minX;
    this.minX = t, this.maxX = t + e;
  }
  /**
   * The y position of the bounds in local space.
   * Setting this value will move the bounds while maintaining its height.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Get y position
   * console.log(bounds.y); // 0
   *
   * // Move bounds vertically
   * bounds.y = 50;
   * console.log(bounds.minY, bounds.maxY); // 50, 150
   *
   * // Height stays the same
   * console.log(bounds.height); // Still 100
   * ```
   */
  get y() {
    return this.minY;
  }
  set y(t) {
    const e = this.maxY - this.minY;
    this.minY = t, this.maxY = t + e;
  }
  /**
   * The width value of the bounds.
   * Represents the distance between minX and maxX coordinates.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Get width
   * console.log(bounds.width); // 100
   * // Resize width
   * bounds.width = 200;
   * console.log(bounds.maxX - bounds.minX); // 200
   * ```
   */
  get width() {
    return this.maxX - this.minX;
  }
  set width(t) {
    this.maxX = this.minX + t;
  }
  /**
   * The height value of the bounds.
   * Represents the distance between minY and maxY coordinates.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Get height
   * console.log(bounds.height); // 100
   * // Resize height
   * bounds.height = 150;
   * console.log(bounds.maxY - bounds.minY); // 150
   * ```
   */
  get height() {
    return this.maxY - this.minY;
  }
  set height(t) {
    this.maxY = this.minY + t;
  }
  /**
   * The left edge coordinate of the bounds.
   * Alias for minX.
   * @example
   * ```ts
   * const bounds = new Bounds(50, 0, 150, 100);
   * console.log(bounds.left); // 50
   * console.log(bounds.left === bounds.minX); // true
   * ```
   * @readonly
   */
  get left() {
    return this.minX;
  }
  /**
   * The right edge coordinate of the bounds.
   * Alias for maxX.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * console.log(bounds.right); // 100
   * console.log(bounds.right === bounds.maxX); // true
   * ```
   * @readonly
   */
  get right() {
    return this.maxX;
  }
  /**
   * The top edge coordinate of the bounds.
   * Alias for minY.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 25, 100, 125);
   * console.log(bounds.top); // 25
   * console.log(bounds.top === bounds.minY); // true
   * ```
   * @readonly
   */
  get top() {
    return this.minY;
  }
  /**
   * The bottom edge coordinate of the bounds.
   * Alias for maxY.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 200);
   * console.log(bounds.bottom); // 200
   * console.log(bounds.bottom === bounds.maxY); // true
   * ```
   * @readonly
   */
  get bottom() {
    return this.maxY;
  }
  /**
   * Whether the bounds has positive width and height.
   * Checks if both dimensions are greater than zero.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Check if bounds are positive
   * console.log(bounds.isPositive); // true
   *
   * // Negative bounds
   * bounds.maxX = bounds.minX;
   * console.log(bounds.isPositive); // false, width is 0
   * ```
   * @readonly
   * @see {@link Bounds#isEmpty} For checking empty state
   * @see {@link Bounds#isValid} For checking validity
   */
  get isPositive() {
    return this.maxX - this.minX > 0 && this.maxY - this.minY > 0;
  }
  /**
   * Whether the bounds has valid coordinates.
   * Checks if the bounds has been initialized with real values.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * console.log(bounds.isValid); // false, default state
   *
   * // Set valid bounds
   * bounds.addFrame(0, 0, 100, 100);
   * console.log(bounds.isValid); // true
   * ```
   * @readonly
   * @see {@link Bounds#isEmpty} For checking empty state
   * @see {@link Bounds#isPositive} For checking dimensions
   */
  get isValid() {
    return this.minX + this.minY !== 1 / 0;
  }
  /**
   * Adds vertices from a Float32Array to the bounds, optionally transformed by a matrix.
   * Used for efficiently updating bounds from raw vertex data.
   * @example
   * ```ts
   * const bounds = new Bounds();
   *
   * // Add vertices from geometry
   * const vertices = new Float32Array([
   *     0, 0,    // Vertex 1
   *     100, 0,  // Vertex 2
   *     100, 100 // Vertex 3
   * ]);
   * bounds.addVertexData(vertices, 0, 6);
   *
   * // Add transformed vertices
   * const matrix = new Matrix()
   *     .translate(50, 50)
   *     .rotate(Math.PI / 4);
   * bounds.addVertexData(vertices, 0, 6, matrix);
   *
   * // Add subset of vertices
   * bounds.addVertexData(vertices, 2, 4); // Only second vertex
   * ```
   * @param vertexData - The array of vertices to add
   * @param beginOffset - Starting index in the vertex array
   * @param endOffset - Ending index in the vertex array (excluded)
   * @param matrix - Optional transformation matrix
   * @see {@link Bounds#addFrame} For adding rectangular frames
   * @see {@link Matrix} For transformation details
   */
  addVertexData(t, e, i, r) {
    let n = this.minX, o = this.minY, a = this.maxX, h = this.maxY;
    r || (r = this.matrix);
    const l = r.a, c = r.b, u = r.c, f = r.d, d = r.tx, p = r.ty;
    for (let g = e; g < i; g += 2) {
      const m = t[g], x = t[g + 1], y = l * m + u * x + d, _ = c * m + f * x + p;
      n = y < n ? y : n, o = _ < o ? _ : o, a = y > a ? y : a, h = _ > h ? _ : h;
    }
    this.minX = n, this.minY = o, this.maxX = a, this.maxY = h;
  }
  /**
   * Checks if a point is contained within the bounds.
   * Returns true if the point's coordinates fall within the bounds' area.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Basic point check
   * console.log(bounds.containsPoint(50, 50)); // true
   * console.log(bounds.containsPoint(150, 150)); // false
   *
   * // Check edges
   * console.log(bounds.containsPoint(0, 0));   // true, includes edges
   * console.log(bounds.containsPoint(100, 100)); // true, includes edges
   * ```
   * @param x - x coordinate to check
   * @param y - y coordinate to check
   * @returns True if the point is inside the bounds
   * @see {@link Bounds#isPositive} For valid bounds check
   * @see {@link Bounds#rectangle} For Rectangle representation
   */
  containsPoint(t, e) {
    return this.minX <= t && this.minY <= e && this.maxX >= t && this.maxY >= e;
  }
  /**
   * Returns a string representation of the bounds.
   * Useful for debugging and logging bounds information.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * console.log(bounds.toString()); // "[pixi.js:Bounds minX=0 minY=0 maxX=100 maxY=100 width=100 height=100]"
   * ```
   * @returns A string describing the bounds
   * @see {@link Bounds#copyFrom} For copying bounds
   * @see {@link Bounds#clone} For creating a new instance
   */
  toString() {
    return `[pixi.js:Bounds minX=${this.minX} minY=${this.minY} maxX=${this.maxX} maxY=${this.maxY} width=${this.width} height=${this.height}]`;
  }
  /**
   * Copies the bounds from another bounds object.
   * Useful for reusing bounds objects and avoiding allocations.
   * @example
   * ```ts
   * const sourceBounds = new Bounds(0, 0, 100, 100);
   * // Copy bounds
   * const targetBounds = new Bounds();
   * targetBounds.copyFrom(sourceBounds);
   * ```
   * @param bounds - The bounds to copy from
   * @returns This bounds object for chaining
   * @see {@link Bounds#clone} For creating new instances
   */
  copyFrom(t) {
    return this.minX = t.minX, this.minY = t.minY, this.maxX = t.maxX, this.maxY = t.maxY, this;
  }
}
var So = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) }, ut = function(s) {
  return typeof s == "string" ? s.length > 0 : typeof s == "number";
}, $ = function(s, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = Math.pow(10, t)), Math.round(e * s) / e + 0;
}, it = function(s, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = 1), s > e ? e : s > t ? s : t;
}, $r = function(s) {
  return (s = isFinite(s) ? s % 360 : 0) > 0 ? s : s + 360;
}, yi = function(s) {
  return { r: it(s.r, 0, 255), g: it(s.g, 0, 255), b: it(s.b, 0, 255), a: it(s.a) };
}, qe = function(s) {
  return { r: $(s.r), g: $(s.g), b: $(s.b), a: $(s.a, 3) };
}, Co = /^#([0-9a-f]{3,8})$/i, Se = function(s) {
  var t = s.toString(16);
  return t.length < 2 ? "0" + t : t;
}, Yr = function(s) {
  var t = s.r, e = s.g, i = s.b, r = s.a, n = Math.max(t, e, i), o = n - Math.min(t, e, i), a = o ? n === t ? (e - i) / o : n === e ? 2 + (i - t) / o : 4 + (t - e) / o : 0;
  return { h: 60 * (a < 0 ? a + 6 : a), s: n ? o / n * 100 : 0, v: n / 255 * 100, a: r };
}, Xr = function(s) {
  var t = s.h, e = s.s, i = s.v, r = s.a;
  t = t / 360 * 6, e /= 100, i /= 100;
  var n = Math.floor(t), o = i * (1 - e), a = i * (1 - (t - n) * e), h = i * (1 - (1 - t + n) * e), l = n % 6;
  return { r: 255 * [i, a, o, o, h, i][l], g: 255 * [h, i, i, a, o, o][l], b: 255 * [o, o, h, i, i, a][l], a: r };
}, _i = function(s) {
  return { h: $r(s.h), s: it(s.s, 0, 100), l: it(s.l, 0, 100), a: it(s.a) };
}, bi = function(s) {
  return { h: $(s.h), s: $(s.s), l: $(s.l), a: $(s.a, 3) };
}, vi = function(s) {
  return Xr((e = (t = s).s, { h: t.h, s: (e *= ((i = t.l) < 50 ? i : 100 - i) / 100) > 0 ? 2 * e / (i + e) * 100 : 0, v: i + e, a: t.a }));
  var t, e, i;
}, re = function(s) {
  return { h: (t = Yr(s)).h, s: (r = (200 - (e = t.s)) * (i = t.v) / 100) > 0 && r < 200 ? e * i / 100 / (r <= 100 ? r : 200 - r) * 100 : 0, l: r / 2, a: t.a };
  var t, e, i, r;
}, Mo = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Ao = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, To = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Po = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Ts = { string: [[function(s) {
  var t = Co.exec(s);
  return t ? (s = t[1]).length <= 4 ? { r: parseInt(s[0] + s[0], 16), g: parseInt(s[1] + s[1], 16), b: parseInt(s[2] + s[2], 16), a: s.length === 4 ? $(parseInt(s[3] + s[3], 16) / 255, 2) : 1 } : s.length === 6 || s.length === 8 ? { r: parseInt(s.substr(0, 2), 16), g: parseInt(s.substr(2, 2), 16), b: parseInt(s.substr(4, 2), 16), a: s.length === 8 ? $(parseInt(s.substr(6, 2), 16) / 255, 2) : 1 } : null : null;
}, "hex"], [function(s) {
  var t = To.exec(s) || Po.exec(s);
  return t ? t[2] !== t[4] || t[4] !== t[6] ? null : yi({ r: Number(t[1]) / (t[2] ? 100 / 255 : 1), g: Number(t[3]) / (t[4] ? 100 / 255 : 1), b: Number(t[5]) / (t[6] ? 100 / 255 : 1), a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1) }) : null;
}, "rgb"], [function(s) {
  var t = Mo.exec(s) || Ao.exec(s);
  if (!t) return null;
  var e, i, r = _i({ h: (e = t[1], i = t[2], i === void 0 && (i = "deg"), Number(e) * (So[i] || 1)), s: Number(t[3]), l: Number(t[4]), a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1) });
  return vi(r);
}, "hsl"]], object: [[function(s) {
  var t = s.r, e = s.g, i = s.b, r = s.a, n = r === void 0 ? 1 : r;
  return ut(t) && ut(e) && ut(i) ? yi({ r: Number(t), g: Number(e), b: Number(i), a: Number(n) }) : null;
}, "rgb"], [function(s) {
  var t = s.h, e = s.s, i = s.l, r = s.a, n = r === void 0 ? 1 : r;
  if (!ut(t) || !ut(e) || !ut(i)) return null;
  var o = _i({ h: Number(t), s: Number(e), l: Number(i), a: Number(n) });
  return vi(o);
}, "hsl"], [function(s) {
  var t = s.h, e = s.s, i = s.v, r = s.a, n = r === void 0 ? 1 : r;
  if (!ut(t) || !ut(e) || !ut(i)) return null;
  var o = function(a) {
    return { h: $r(a.h), s: it(a.s, 0, 100), v: it(a.v, 0, 100), a: it(a.a) };
  }({ h: Number(t), s: Number(e), v: Number(i), a: Number(n) });
  return Xr(o);
}, "hsv"]] }, wi = function(s, t) {
  for (var e = 0; e < t.length; e++) {
    var i = t[e][0](s);
    if (i) return [i, t[e][1]];
  }
  return [null, void 0];
}, Eo = function(s) {
  return typeof s == "string" ? wi(s.trim(), Ts.string) : typeof s == "object" && s !== null ? wi(s, Ts.object) : [null, void 0];
}, Ke = function(s, t) {
  var e = re(s);
  return { h: e.h, s: it(e.s + 100 * t, 0, 100), l: e.l, a: e.a };
}, Ze = function(s) {
  return (299 * s.r + 587 * s.g + 114 * s.b) / 1e3 / 255;
}, Si = function(s, t) {
  var e = re(s);
  return { h: e.h, s: e.s, l: it(e.l + 100 * t, 0, 100), a: e.a };
}, Ps = function() {
  function s(t) {
    this.parsed = Eo(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }
  return s.prototype.isValid = function() {
    return this.parsed !== null;
  }, s.prototype.brightness = function() {
    return $(Ze(this.rgba), 2);
  }, s.prototype.isDark = function() {
    return Ze(this.rgba) < 0.5;
  }, s.prototype.isLight = function() {
    return Ze(this.rgba) >= 0.5;
  }, s.prototype.toHex = function() {
    return t = qe(this.rgba), e = t.r, i = t.g, r = t.b, o = (n = t.a) < 1 ? Se($(255 * n)) : "", "#" + Se(e) + Se(i) + Se(r) + o;
    var t, e, i, r, n, o;
  }, s.prototype.toRgb = function() {
    return qe(this.rgba);
  }, s.prototype.toRgbString = function() {
    return t = qe(this.rgba), e = t.r, i = t.g, r = t.b, (n = t.a) < 1 ? "rgba(" + e + ", " + i + ", " + r + ", " + n + ")" : "rgb(" + e + ", " + i + ", " + r + ")";
    var t, e, i, r, n;
  }, s.prototype.toHsl = function() {
    return bi(re(this.rgba));
  }, s.prototype.toHslString = function() {
    return t = bi(re(this.rgba)), e = t.h, i = t.s, r = t.l, (n = t.a) < 1 ? "hsla(" + e + ", " + i + "%, " + r + "%, " + n + ")" : "hsl(" + e + ", " + i + "%, " + r + "%)";
    var t, e, i, r, n;
  }, s.prototype.toHsv = function() {
    return t = Yr(this.rgba), { h: $(t.h), s: $(t.s), v: $(t.v), a: $(t.a, 3) };
    var t;
  }, s.prototype.invert = function() {
    return ht({ r: 255 - (t = this.rgba).r, g: 255 - t.g, b: 255 - t.b, a: t.a });
    var t;
  }, s.prototype.saturate = function(t) {
    return t === void 0 && (t = 0.1), ht(Ke(this.rgba, t));
  }, s.prototype.desaturate = function(t) {
    return t === void 0 && (t = 0.1), ht(Ke(this.rgba, -t));
  }, s.prototype.grayscale = function() {
    return ht(Ke(this.rgba, -1));
  }, s.prototype.lighten = function(t) {
    return t === void 0 && (t = 0.1), ht(Si(this.rgba, t));
  }, s.prototype.darken = function(t) {
    return t === void 0 && (t = 0.1), ht(Si(this.rgba, -t));
  }, s.prototype.rotate = function(t) {
    return t === void 0 && (t = 15), this.hue(this.hue() + t);
  }, s.prototype.alpha = function(t) {
    return typeof t == "number" ? ht({ r: (e = this.rgba).r, g: e.g, b: e.b, a: t }) : $(this.rgba.a, 3);
    var e;
  }, s.prototype.hue = function(t) {
    var e = re(this.rgba);
    return typeof t == "number" ? ht({ h: t, s: e.s, l: e.l, a: e.a }) : $(e.h);
  }, s.prototype.isEqual = function(t) {
    return this.toHex() === ht(t).toHex();
  }, s;
}(), ht = function(s) {
  return s instanceof Ps ? s : new Ps(s);
}, Ci = [], ko = function(s) {
  s.forEach(function(t) {
    Ci.indexOf(t) < 0 && (t(Ps, Ts), Ci.push(t));
  });
};
function Io(s, t) {
  var e = { white: "#ffffff", bisque: "#ffe4c4", blue: "#0000ff", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", antiquewhite: "#faebd7", aqua: "#00ffff", azure: "#f0ffff", whitesmoke: "#f5f5f5", papayawhip: "#ffefd5", plum: "#dda0dd", blanchedalmond: "#ffebcd", black: "#000000", gold: "#ffd700", goldenrod: "#daa520", gainsboro: "#dcdcdc", cornsilk: "#fff8dc", cornflowerblue: "#6495ed", burlywood: "#deb887", aquamarine: "#7fffd4", beige: "#f5f5dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkkhaki: "#bdb76b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", peachpuff: "#ffdab9", darkmagenta: "#8b008b", darkred: "#8b0000", darkorchid: "#9932cc", darkorange: "#ff8c00", darkslateblue: "#483d8b", gray: "#808080", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", deeppink: "#ff1493", deepskyblue: "#00bfff", wheat: "#f5deb3", firebrick: "#b22222", floralwhite: "#fffaf0", ghostwhite: "#f8f8ff", darkviolet: "#9400d3", magenta: "#ff00ff", green: "#008000", dodgerblue: "#1e90ff", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", blueviolet: "#8a2be2", forestgreen: "#228b22", lawngreen: "#7cfc00", indianred: "#cd5c5c", indigo: "#4b0082", fuchsia: "#ff00ff", brown: "#a52a2a", maroon: "#800000", mediumblue: "#0000cd", lightcoral: "#f08080", darkturquoise: "#00ced1", lightcyan: "#e0ffff", ivory: "#fffff0", lightyellow: "#ffffe0", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", linen: "#faf0e6", mediumaquamarine: "#66cdaa", lemonchiffon: "#fffacd", lime: "#00ff00", khaki: "#f0e68c", mediumseagreen: "#3cb371", limegreen: "#32cd32", mediumspringgreen: "#00fa9a", lightskyblue: "#87cefa", lightblue: "#add8e6", midnightblue: "#191970", lightpink: "#ffb6c1", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", mintcream: "#f5fffa", lightslategray: "#778899", lightslategrey: "#778899", navajowhite: "#ffdead", navy: "#000080", mediumvioletred: "#c71585", powderblue: "#b0e0e6", palegoldenrod: "#eee8aa", oldlace: "#fdf5e6", paleturquoise: "#afeeee", mediumturquoise: "#48d1cc", mediumorchid: "#ba55d3", rebeccapurple: "#663399", lightsteelblue: "#b0c4de", mediumslateblue: "#7b68ee", thistle: "#d8bfd8", tan: "#d2b48c", orchid: "#da70d6", mediumpurple: "#9370db", purple: "#800080", pink: "#ffc0cb", skyblue: "#87ceeb", springgreen: "#00ff7f", palegreen: "#98fb98", red: "#ff0000", yellow: "#ffff00", slateblue: "#6a5acd", lavenderblush: "#fff0f5", peru: "#cd853f", palevioletred: "#db7093", violet: "#ee82ee", teal: "#008080", slategray: "#708090", slategrey: "#708090", aliceblue: "#f0f8ff", darkseagreen: "#8fbc8f", darkolivegreen: "#556b2f", greenyellow: "#adff2f", seagreen: "#2e8b57", seashell: "#fff5ee", tomato: "#ff6347", silver: "#c0c0c0", sienna: "#a0522d", lavender: "#e6e6fa", lightgreen: "#90ee90", orange: "#ffa500", orangered: "#ff4500", steelblue: "#4682b4", royalblue: "#4169e1", turquoise: "#40e0d0", yellowgreen: "#9acd32", salmon: "#fa8072", saddlebrown: "#8b4513", sandybrown: "#f4a460", rosybrown: "#bc8f8f", darksalmon: "#e9967a", lightgoldenrodyellow: "#fafad2", snow: "#fffafa", lightgrey: "#d3d3d3", lightgray: "#d3d3d3", dimgray: "#696969", dimgrey: "#696969", olivedrab: "#6b8e23", olive: "#808000" }, i = {};
  for (var r in e) i[e[r]] = r;
  var n = {};
  s.prototype.toName = function(o) {
    if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b)) return "transparent";
    var a, h, l = i[this.toHex()];
    if (l) return l;
    if (o != null && o.closest) {
      var c = this.toRgb(), u = 1 / 0, f = "black";
      if (!n.length) for (var d in e) n[d] = new s(e[d]).toRgb();
      for (var p in e) {
        var g = (a = c, h = n[p], Math.pow(a.r - h.r, 2) + Math.pow(a.g - h.g, 2) + Math.pow(a.b - h.b, 2));
        g < u && (u = g, f = p);
      }
      return f;
    }
  }, t.string.push([function(o) {
    var a = o.toLowerCase(), h = a === "transparent" ? "#0000" : e[a];
    return h ? new s(h).toRgb() : null;
  }, "name"]);
}
ko([Io]);
const Ut = class te {
  /**
   * @param {ColorSource} value - Optional value to use, if not provided, white is used.
   */
  constructor(t = 16777215) {
    this._value = null, this._components = new Float32Array(4), this._components.fill(1), this._int = 16777215, this.value = t;
  }
  /**
   * Get the red component of the color, normalized between 0 and 1.
   * @example
   * ```ts
   * const color = new Color('red');
   * console.log(color.red); // 1
   *
   * const green = new Color('#00ff00');
   * console.log(green.red); // 0
   * ```
   */
  get red() {
    return this._components[0];
  }
  /**
   * Get the green component of the color, normalized between 0 and 1.
   * @example
   * ```ts
   * const color = new Color('lime');
   * console.log(color.green); // 1
   *
   * const red = new Color('#ff0000');
   * console.log(red.green); // 0
   * ```
   */
  get green() {
    return this._components[1];
  }
  /**
   * Get the blue component of the color, normalized between 0 and 1.
   * @example
   * ```ts
   * const color = new Color('blue');
   * console.log(color.blue); // 1
   *
   * const yellow = new Color('#ffff00');
   * console.log(yellow.blue); // 0
   * ```
   */
  get blue() {
    return this._components[2];
  }
  /**
   * Get the alpha component of the color, normalized between 0 and 1.
   * @example
   * ```ts
   * const color = new Color('red');
   * console.log(color.alpha); // 1 (fully opaque)
   *
   * const transparent = new Color('rgba(255, 0, 0, 0.5)');
   * console.log(transparent.alpha); // 0.5 (semi-transparent)
   * ```
   */
  get alpha() {
    return this._components[3];
  }
  /**
   * Sets the color value and returns the instance for chaining.
   *
   * This is a chainable version of setting the `value` property.
   * @param value - The color to set. Accepts various formats:
   * - Hex strings/numbers (e.g., '#ff0000', 0xff0000)
   * - RGB/RGBA values (arrays, objects)
   * - CSS color names
   * - HSL/HSLA values
   * - HSV/HSVA values
   * @returns The Color instance for chaining
   * @example
   * ```ts
   * // Basic usage
   * const color = new Color();
   * color.setValue('#ff0000')
   *     .setAlpha(0.5)
   *     .premultiply(0.8);
   *
   * // Different formats
   * color.setValue(0xff0000);          // Hex number
   * color.setValue('#ff0000');         // Hex string
   * color.setValue([1, 0, 0]);         // RGB array
   * color.setValue([1, 0, 0, 0.5]);    // RGBA array
   * color.setValue({ r: 1, g: 0, b: 0 }); // RGB object
   *
   * // Copy from another color
   * const red = new Color('red');
   * color.setValue(red);
   * ```
   * @throws {Error} If the color value is invalid or null
   * @see {@link Color.value} For the underlying value property
   */
  setValue(t) {
    return this.value = t, this;
  }
  /**
   * The current color source. This property allows getting and setting the color value
   * while preserving the original format where possible.
   * @remarks
   * When setting:
   * - Setting to a `Color` instance copies its source and components
   * - Setting to other valid sources normalizes and stores the value
   * - Setting to `null` throws an Error
   * - The color remains unchanged if normalization fails
   *
   * When getting:
   * - Returns `null` if color was modified by {@link Color.multiply} or {@link Color.premultiply}
   * - Otherwise returns the original color source
   * @example
   * ```ts
   * // Setting different color formats
   * const color = new Color();
   *
   * color.value = 0xff0000;         // Hex number
   * color.value = '#ff0000';        // Hex string
   * color.value = [1, 0, 0];        // RGB array
   * color.value = [1, 0, 0, 0.5];   // RGBA array
   * color.value = { r: 1, g: 0, b: 0 }; // RGB object
   *
   * // Copying from another color
   * const red = new Color('red');
   * color.value = red;  // Copies red's components
   *
   * // Getting the value
   * console.log(color.value);  // Returns original format
   *
   * // After modifications
   * color.multiply([0.5, 0.5, 0.5]);
   * console.log(color.value);  // Returns null
   * ```
   * @throws {Error} When attempting to set `null`
   */
  set value(t) {
    if (t instanceof te)
      this._value = this._cloneSource(t._value), this._int = t._int, this._components.set(t._components);
    else {
      if (t === null)
        throw new Error("Cannot set Color#value to null");
      (this._value === null || !this._isSourceEqual(this._value, t)) && (this._value = this._cloneSource(t), this._normalize(this._value));
    }
  }
  get value() {
    return this._value;
  }
  /**
   * Copy a color source internally.
   * @param value - Color source
   */
  _cloneSource(t) {
    return typeof t == "string" || typeof t == "number" || t instanceof Number || t === null ? t : Array.isArray(t) || ArrayBuffer.isView(t) ? t.slice(0) : typeof t == "object" && t !== null ? { ...t } : t;
  }
  /**
   * Equality check for color sources.
   * @param value1 - First color source
   * @param value2 - Second color source
   * @returns `true` if the color sources are equal, `false` otherwise.
   */
  _isSourceEqual(t, e) {
    const i = typeof t;
    if (i !== typeof e)
      return !1;
    if (i === "number" || i === "string" || t instanceof Number)
      return t === e;
    if (Array.isArray(t) && Array.isArray(e) || ArrayBuffer.isView(t) && ArrayBuffer.isView(e))
      return t.length !== e.length ? !1 : t.every((n, o) => n === e[o]);
    if (t !== null && e !== null) {
      const n = Object.keys(t), o = Object.keys(e);
      return n.length !== o.length ? !1 : n.every((a) => t[a] === e[a]);
    }
    return t === e;
  }
  /**
   * Convert to a RGBA color object with normalized components (0-1).
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Convert colors to RGBA objects
   * new Color('white').toRgba();     // returns { r: 1, g: 1, b: 1, a: 1 }
   * new Color('#ff0000').toRgba();   // returns { r: 1, g: 0, b: 0, a: 1 }
   *
   * // With transparency
   * new Color('rgba(255,0,0,0.5)').toRgba(); // returns { r: 1, g: 0, b: 0, a: 0.5 }
   * ```
   * @returns An RGBA object with normalized components
   */
  toRgba() {
    const [t, e, i, r] = this._components;
    return { r: t, g: e, b: i, a: r };
  }
  /**
   * Convert to a RGB color object with normalized components (0-1).
   *
   * Alpha component is omitted in the output.
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Convert colors to RGB objects
   * new Color('white').toRgb();     // returns { r: 1, g: 1, b: 1 }
   * new Color('#ff0000').toRgb();   // returns { r: 1, g: 0, b: 0 }
   *
   * // Alpha is ignored
   * new Color('rgba(255,0,0,0.5)').toRgb(); // returns { r: 1, g: 0, b: 0 }
   * ```
   * @returns An RGB object with normalized components
   */
  toRgb() {
    const [t, e, i] = this._components;
    return { r: t, g: e, b: i };
  }
  /**
   * Convert to a CSS-style rgba string representation.
   *
   * RGB components are scaled to 0-255 range, alpha remains 0-1.
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Convert colors to RGBA strings
   * new Color('white').toRgbaString();     // returns "rgba(255,255,255,1)"
   * new Color('#ff0000').toRgbaString();   // returns "rgba(255,0,0,1)"
   *
   * // With transparency
   * new Color([1, 0, 0, 0.5]).toRgbaString(); // returns "rgba(255,0,0,0.5)"
   * ```
   * @returns A CSS-compatible rgba string
   */
  toRgbaString() {
    const [t, e, i] = this.toUint8RgbArray();
    return `rgba(${t},${e},${i},${this.alpha})`;
  }
  /**
   * Convert to an [R, G, B] array of clamped uint8 values (0 to 255).
   * @param {number[]|Uint8Array|Uint8ClampedArray} [out] - Optional output array. If not provided,
   * a cached array will be used and returned.
   * @returns Array containing RGB components as integers between 0-255
   * @example
   * ```ts
   * // Basic usage
   * new Color('white').toUint8RgbArray(); // returns [255, 255, 255]
   * new Color('#ff0000').toUint8RgbArray(); // returns [255, 0, 0]
   *
   * // Using custom output array
   * const rgb = new Uint8Array(3);
   * new Color('blue').toUint8RgbArray(rgb); // rgb is now [0, 0, 255]
   *
   * // Using different array types
   * new Color('red').toUint8RgbArray(new Uint8ClampedArray(3)); // [255, 0, 0]
   * new Color('red').toUint8RgbArray([]); // [255, 0, 0]
   * ```
   * @remarks
   * - Output values are always clamped between 0-255
   * - Alpha component is not included in output
   * - Reuses internal cache array if no output array provided
   */
  toUint8RgbArray(t) {
    const [e, i, r] = this._components;
    return this._arrayRgb || (this._arrayRgb = []), t || (t = this._arrayRgb), t[0] = Math.round(e * 255), t[1] = Math.round(i * 255), t[2] = Math.round(r * 255), t;
  }
  /**
   * Convert to an [R, G, B, A] array of normalized floats (numbers from 0.0 to 1.0).
   * @param {number[]|Float32Array} [out] - Optional output array. If not provided,
   * a cached array will be used and returned.
   * @returns Array containing RGBA components as floats between 0-1
   * @example
   * ```ts
   * // Basic usage
   * new Color('white').toArray();  // returns [1, 1, 1, 1]
   * new Color('red').toArray();    // returns [1, 0, 0, 1]
   *
   * // With alpha
   * new Color('rgba(255,0,0,0.5)').toArray(); // returns [1, 0, 0, 0.5]
   *
   * // Using custom output array
   * const rgba = new Float32Array(4);
   * new Color('blue').toArray(rgba); // rgba is now [0, 0, 1, 1]
   * ```
   * @remarks
   * - Output values are normalized between 0-1
   * - Includes alpha component as the fourth value
   * - Reuses internal cache array if no output array provided
   */
  toArray(t) {
    this._arrayRgba || (this._arrayRgba = []), t || (t = this._arrayRgba);
    const [e, i, r, n] = this._components;
    return t[0] = e, t[1] = i, t[2] = r, t[3] = n, t;
  }
  /**
   * Convert to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).
   * @param {number[]|Float32Array} [out] - Optional output array. If not provided,
   * a cached array will be used and returned.
   * @returns Array containing RGB components as floats between 0-1
   * @example
   * ```ts
   * // Basic usage
   * new Color('white').toRgbArray(); // returns [1, 1, 1]
   * new Color('red').toRgbArray();   // returns [1, 0, 0]
   *
   * // Using custom output array
   * const rgb = new Float32Array(3);
   * new Color('blue').toRgbArray(rgb); // rgb is now [0, 0, 1]
   * ```
   * @remarks
   * - Output values are normalized between 0-1
   * - Alpha component is omitted from output
   * - Reuses internal cache array if no output array provided
   */
  toRgbArray(t) {
    this._arrayRgb || (this._arrayRgb = []), t || (t = this._arrayRgb);
    const [e, i, r] = this._components;
    return t[0] = e, t[1] = i, t[2] = r, t;
  }
  /**
   * Convert to a hexadecimal number.
   * @returns The color as a 24-bit RGB integer
   * @example
   * ```ts
   * // Basic usage
   * new Color('white').toNumber(); // returns 0xffffff
   * new Color('red').toNumber();   // returns 0xff0000
   *
   * // Store as hex
   * const color = new Color('blue');
   * const hex = color.toNumber(); // 0x0000ff
   * ```
   */
  toNumber() {
    return this._int;
  }
  /**
   * Convert to a BGR number.
   *
   * Useful for platforms that expect colors in BGR format.
   * @returns The color as a 24-bit BGR integer
   * @example
   * ```ts
   * // Convert RGB to BGR
   * new Color(0xffcc99).toBgrNumber(); // returns 0x99ccff
   *
   * // Common use case: platform-specific color format
   * const color = new Color('orange');
   * const bgrColor = color.toBgrNumber(); // Color with swapped R/B channels
   * ```
   * @remarks
   * This swaps the red and blue channels compared to the normal RGB format:
   * - RGB 0xRRGGBB becomes BGR 0xBBGGRR
   */
  toBgrNumber() {
    const [t, e, i] = this.toUint8RgbArray();
    return (i << 16) + (e << 8) + t;
  }
  /**
   * Convert to a hexadecimal number in little endian format (e.g., BBGGRR).
   *
   * Useful for platforms that expect colors in little endian byte order.
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Convert RGB color to little endian format
   * new Color(0xffcc99).toLittleEndianNumber(); // returns 0x99ccff
   *
   * // Common use cases:
   * const color = new Color('orange');
   * const leColor = color.toLittleEndianNumber(); // Swaps byte order for LE systems
   *
   * // Multiple conversions
   * const colors = {
   *     normal: 0xffcc99,
   *     littleEndian: new Color(0xffcc99).toLittleEndianNumber(), // 0x99ccff
   *     backToNormal: new Color(0x99ccff).toLittleEndianNumber()  // 0xffcc99
   * };
   * ```
   * @remarks
   * - Swaps R and B channels in the color value
   * - RGB 0xRRGGBB becomes 0xBBGGRR
   * - Useful for systems that use little endian byte order
   * - Can be used to convert back and forth between formats
   * @returns The color as a number in little endian format (BBGGRR)
   * @see {@link Color.toBgrNumber} For BGR format without byte swapping
   */
  toLittleEndianNumber() {
    const t = this._int;
    return (t >> 16) + (t & 65280) + ((t & 255) << 16);
  }
  /**
   * Multiply with another color.
   *
   * This action is destructive and modifies the original color.
   * @param {ColorSource} value - The color to multiply by. Accepts any valid color format:
   * - Hex strings/numbers (e.g., '#ff0000', 0xff0000)
   * - RGB/RGBA arrays ([1, 0, 0], [1, 0, 0, 1])
   * - Color objects ({ r: 1, g: 0, b: 0 })
   * - CSS color names ('red', 'blue')
   * @returns this - The Color instance for chaining
   * @example
   * ```ts
   * // Basic multiplication
   * const color = new Color('#ff0000');
   * color.multiply(0x808080); // 50% darker red
   *
   * // With transparency
   * color.multiply([1, 1, 1, 0.5]); // 50% transparent
   *
   * // Chain operations
   * color
   *     .multiply('#808080')
   *     .multiply({ r: 1, g: 1, b: 1, a: 0.5 });
   * ```
   * @remarks
   * - Multiplies each RGB component and alpha separately
   * - Values are clamped between 0-1
   * - Original color format is lost (value becomes null)
   * - Operation cannot be undone
   */
  multiply(t) {
    const [e, i, r, n] = te._temp.setValue(t)._components;
    return this._components[0] *= e, this._components[1] *= i, this._components[2] *= r, this._components[3] *= n, this._refreshInt(), this._value = null, this;
  }
  /**
   * Converts color to a premultiplied alpha format.
   *
   * This action is destructive and modifies the original color.
   * @param alpha - The alpha value to multiply by (0-1)
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels
   * @returns {Color} The Color instance for chaining
   * @example
   * ```ts
   * // Basic premultiplication
   * const color = new Color('red');
   * color.premultiply(0.5); // 50% transparent red with premultiplied RGB
   *
   * // Alpha only (RGB unchanged)
   * color.premultiply(0.5, false); // 50% transparent, original RGB
   *
   * // Chain with other operations
   * color
   *     .multiply(0x808080)
   *     .premultiply(0.5)
   *     .toNumber();
   * ```
   * @remarks
   * - RGB channels are multiplied by alpha when applyToRGB is true
   * - Alpha is always set to the provided value
   * - Values are clamped between 0-1
   * - Original color format is lost (value becomes null)
   * - Operation cannot be undone
   */
  premultiply(t, e = !0) {
    return e && (this._components[0] *= t, this._components[1] *= t, this._components[2] *= t), this._components[3] = t, this._refreshInt(), this._value = null, this;
  }
  /**
   * Returns the color as a 32-bit premultiplied alpha integer.
   *
   * Format: 0xAARRGGBB
   * @param {number} alpha - The alpha value to multiply by (0-1)
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels
   * @returns {number} The premultiplied color as a 32-bit integer
   * @example
   * ```ts
   * // Convert to premultiplied format
   * const color = new Color('red');
   *
   * // Full opacity (0xFFRRGGBB)
   * color.toPremultiplied(1.0); // 0xFFFF0000
   *
   * // 50% transparency with premultiplied RGB
   * color.toPremultiplied(0.5); // 0x7F7F0000
   *
   * // 50% transparency without RGB premultiplication
   * color.toPremultiplied(0.5, false); // 0x7FFF0000
   * ```
   * @remarks
   * - Returns full opacity (0xFF000000) when alpha is 1.0
   * - Returns 0 when alpha is 0.0 and applyToRGB is true
   * - RGB values are rounded during premultiplication
   */
  toPremultiplied(t, e = !0) {
    if (t === 1)
      return (255 << 24) + this._int;
    if (t === 0)
      return e ? 0 : this._int;
    let i = this._int >> 16 & 255, r = this._int >> 8 & 255, n = this._int & 255;
    return e && (i = i * t + 0.5 | 0, r = r * t + 0.5 | 0, n = n * t + 0.5 | 0), (t * 255 << 24) + (i << 16) + (r << 8) + n;
  }
  /**
   * Convert to a hexadecimal string (6 characters).
   * @returns A CSS-compatible hex color string (e.g., "#ff0000")
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Basic colors
   * new Color('red').toHex();    // returns "#ff0000"
   * new Color('white').toHex();  // returns "#ffffff"
   * new Color('black').toHex();  // returns "#000000"
   *
   * // From different formats
   * new Color(0xff0000).toHex(); // returns "#ff0000"
   * new Color([1, 0, 0]).toHex(); // returns "#ff0000"
   * new Color({ r: 1, g: 0, b: 0 }).toHex(); // returns "#ff0000"
   * ```
   * @remarks
   * - Always returns a 6-character hex string
   * - Includes leading "#" character
   * - Alpha channel is ignored
   * - Values are rounded to nearest hex value
   */
  toHex() {
    const t = this._int.toString(16);
    return `#${"000000".substring(0, 6 - t.length) + t}`;
  }
  /**
   * Convert to a hexadecimal string with alpha (8 characters).
   * @returns A CSS-compatible hex color string with alpha (e.g., "#ff0000ff")
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Fully opaque colors
   * new Color('red').toHexa();   // returns "#ff0000ff"
   * new Color('white').toHexa(); // returns "#ffffffff"
   *
   * // With transparency
   * new Color('rgba(255, 0, 0, 0.5)').toHexa(); // returns "#ff00007f"
   * new Color([1, 0, 0, 0]).toHexa(); // returns "#ff000000"
   * ```
   * @remarks
   * - Returns an 8-character hex string
   * - Includes leading "#" character
   * - Alpha is encoded in last two characters
   * - Values are rounded to nearest hex value
   */
  toHexa() {
    const e = Math.round(this._components[3] * 255).toString(16);
    return this.toHex() + "00".substring(0, 2 - e.length) + e;
  }
  /**
   * Set alpha (transparency) value while preserving color components.
   *
   * Provides a chainable interface for setting alpha.
   * @param alpha - Alpha value between 0 (fully transparent) and 1 (fully opaque)
   * @returns The Color instance for chaining
   * @example
   * ```ts
   * // Basic alpha setting
   * const color = new Color('red');
   * color.setAlpha(0.5);  // 50% transparent red
   *
   * // Chain with other operations
   * color
   *     .setValue('#ff0000')
   *     .setAlpha(0.8)    // 80% opaque
   *     .premultiply(0.5); // Further modify alpha
   *
   * // Reset to fully opaque
   * color.setAlpha(1);
   * ```
   * @remarks
   * - Alpha value is clamped between 0-1
   * - Can be chained with other color operations
   */
  setAlpha(t) {
    return this._components[3] = this._clamp(t), this._value = null, this;
  }
  /**
   * Normalize the input value into rgba
   * @param value - Input value
   */
  _normalize(t) {
    let e, i, r, n;
    if ((typeof t == "number" || t instanceof Number) && t >= 0 && t <= 16777215) {
      const o = t;
      e = (o >> 16 & 255) / 255, i = (o >> 8 & 255) / 255, r = (o & 255) / 255, n = 1;
    } else if ((Array.isArray(t) || t instanceof Float32Array) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t), [e, i, r, n = 1] = t;
    else if ((t instanceof Uint8Array || t instanceof Uint8ClampedArray) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t, 0, 255), [e, i, r, n = 255] = t, e /= 255, i /= 255, r /= 255, n /= 255;
    else if (typeof t == "string" || typeof t == "object") {
      if (typeof t == "string") {
        const a = te.HEX_PATTERN.exec(t);
        a && (t = `#${a[2]}`);
      }
      const o = ht(t);
      o.isValid() && ({ r: e, g: i, b: r, a: n } = o.rgba, e /= 255, i /= 255, r /= 255);
    }
    if (e !== void 0)
      this._components[0] = e, this._components[1] = i, this._components[2] = r, this._components[3] = n, this._refreshInt();
    else
      throw new Error(`Unable to convert color ${t}`);
  }
  /** Refresh the internal color rgb number */
  _refreshInt() {
    this._clamp(this._components);
    const [t, e, i] = this._components;
    this._int = (t * 255 << 16) + (e * 255 << 8) + (i * 255 | 0);
  }
  /**
   * Clamps values to a range. Will override original values
   * @param value - Value(s) to clamp
   * @param min - Minimum value
   * @param max - Maximum value
   */
  _clamp(t, e = 0, i = 1) {
    return typeof t == "number" ? Math.min(Math.max(t, e), i) : (t.forEach((r, n) => {
      t[n] = Math.min(Math.max(r, e), i);
    }), t);
  }
  /**
   * Check if a value can be interpreted as a valid color format.
   * Supports all color formats that can be used with the Color class.
   * @param value - Value to check
   * @returns True if the value can be used as a color
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // CSS colors and hex values
   * Color.isColorLike('red');          // true
   * Color.isColorLike('#ff0000');      // true
   * Color.isColorLike(0xff0000);       // true
   *
   * // Arrays (RGB/RGBA)
   * Color.isColorLike([1, 0, 0]);      // true
   * Color.isColorLike([1, 0, 0, 0.5]); // true
   *
   * // TypedArrays
   * Color.isColorLike(new Float32Array([1, 0, 0]));          // true
   * Color.isColorLike(new Uint8Array([255, 0, 0]));          // true
   * Color.isColorLike(new Uint8ClampedArray([255, 0, 0]));   // true
   *
   * // Object formats
   * Color.isColorLike({ r: 1, g: 0, b: 0 });            // true (RGB)
   * Color.isColorLike({ r: 1, g: 0, b: 0, a: 0.5 });    // true (RGBA)
   * Color.isColorLike({ h: 0, s: 100, l: 50 });         // true (HSL)
   * Color.isColorLike({ h: 0, s: 100, l: 50, a: 0.5 }); // true (HSLA)
   * Color.isColorLike({ h: 0, s: 100, v: 100 });        // true (HSV)
   * Color.isColorLike({ h: 0, s: 100, v: 100, a: 0.5 });// true (HSVA)
   *
   * // Color instances
   * Color.isColorLike(new Color('red')); // true
   *
   * // Invalid values
   * Color.isColorLike(null);           // false
   * Color.isColorLike(undefined);      // false
   * Color.isColorLike({});             // false
   * Color.isColorLike([]);             // false
   * Color.isColorLike('not-a-color');  // false
   * ```
   * @remarks
   * Checks for the following formats:
   * - Numbers (0x000000 to 0xffffff)
   * - CSS color strings
   * - RGB/RGBA arrays and objects
   * - HSL/HSLA objects
   * - HSV/HSVA objects
   * - TypedArrays (Float32Array, Uint8Array, Uint8ClampedArray)
   * - Color instances
   * @see {@link ColorSource} For supported color format types
   * @see {@link Color.setValue} For setting color values
   * @category utility
   */
  static isColorLike(t) {
    return typeof t == "number" || typeof t == "string" || t instanceof Number || t instanceof te || Array.isArray(t) || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Float32Array || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 && t.a !== void 0;
  }
};
Ut.shared = new Ut();
Ut._temp = new Ut();
Ut.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;
let rt = Ut;
const Ro = {
  cullArea: null,
  cullable: !1,
  cullableChildren: !0
};
let Qe = 0;
const Mi = 500;
function J(...s) {
  Qe !== Mi && (Qe++, Qe === Mi ? console.warn("PixiJS Warning: too many warnings, no more warnings will be reported to the console by PixiJS.") : console.warn("PixiJS Warning: ", ...s));
}
const Ue = {
  /**
   * Set of registered pools and cleanable objects.
   * @private
   */
  _registeredResources: /* @__PURE__ */ new Set(),
  /**
   * Registers a pool or cleanable object for cleanup.
   * @param {Cleanable} pool - The pool or object to register.
   */
  register(s) {
    this._registeredResources.add(s);
  },
  /**
   * Unregisters a pool or cleanable object from cleanup.
   * @param {Cleanable} pool - The pool or object to unregister.
   */
  unregister(s) {
    this._registeredResources.delete(s);
  },
  /** Clears all registered pools and cleanable objects. This will call clear() on each registered item. */
  release() {
    this._registeredResources.forEach((s) => s.clear());
  },
  /**
   * Gets the number of registered pools and cleanable objects.
   * @returns {number} The count of registered items.
   */
  get registeredCount() {
    return this._registeredResources.size;
  },
  /**
   * Checks if a specific pool or cleanable object is registered.
   * @param {Cleanable} pool - The pool or object to check.
   * @returns {boolean} True if the item is registered, false otherwise.
   */
  isRegistered(s) {
    return this._registeredResources.has(s);
  },
  /**
   * Removes all registrations without clearing the pools.
   * Useful if you want to reset the collector without affecting the pools.
   */
  reset() {
    this._registeredResources.clear();
  }
};
class Go {
  /**
   * Constructs a new Pool.
   * @param ClassType - The constructor of the items in the pool.
   * @param {number} [initialSize] - The initial size of the pool.
   */
  constructor(t, e) {
    this._pool = [], this._count = 0, this._index = 0, this._classType = t, e && this.prepopulate(e);
  }
  /**
   * Prepopulates the pool with a given number of items.
   * @param total - The number of items to add to the pool.
   */
  prepopulate(t) {
    for (let e = 0; e < t; e++)
      this._pool[this._index++] = new this._classType();
    this._count += t;
  }
  /**
   * Gets an item from the pool. Calls the item's `init` method if it exists.
   * If there are no items left in the pool, a new one will be created.
   * @param {I} [data] - Optional data to pass to the item's constructor.
   * @returns {T} The item from the pool.
   */
  get(t) {
    var i;
    let e;
    return this._index > 0 ? e = this._pool[--this._index] : (e = new this._classType(), this._count++), (i = e.init) == null || i.call(e, t), e;
  }
  /**
   * Returns an item to the pool. Calls the item's `reset` method if it exists.
   * @param {T} item - The item to return to the pool.
   */
  return(t) {
    var e;
    (e = t.reset) == null || e.call(t), this._pool[this._index++] = t;
  }
  /**
   * Gets the number of items in the pool.
   * @readonly
   */
  get totalSize() {
    return this._count;
  }
  /**
   * Gets the number of items in the pool that are free to use without needing to create more.
   * @readonly
   */
  get totalFree() {
    return this._index;
  }
  /**
   * Gets the number of items in the pool that are currently in use.
   * @readonly
   */
  get totalUsed() {
    return this._count - this._index;
  }
  /** clears the pool */
  clear() {
    if (this._pool.length > 0 && this._pool[0].destroy)
      for (let t = 0; t < this._index; t++)
        this._pool[t].destroy();
    this._pool.length = 0, this._count = 0, this._index = 0;
  }
}
class Bo {
  constructor() {
    this._poolsByClass = /* @__PURE__ */ new Map();
  }
  /**
   * Prepopulates a specific pool with a given number of items.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
   * @param {number} total - The number of items to add to the pool.
   */
  prepopulate(t, e) {
    this.getPool(t).prepopulate(e);
  }
  /**
   * Gets an item from a specific pool.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
   * @param {unknown} [data] - Optional data to pass to the item's constructor.
   * @returns {T} The item from the pool.
   */
  get(t, e) {
    return this.getPool(t).get(e);
  }
  /**
   * Returns an item to its respective pool.
   * @param {PoolItem} item - The item to return to the pool.
   */
  return(t) {
    this.getPool(t.constructor).return(t);
  }
  /**
   * Gets a specific pool based on the class type.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} ClassType - The constructor of the items in the pool.
   * @returns {Pool<T>} The pool of the given class type.
   */
  getPool(t) {
    return this._poolsByClass.has(t) || this._poolsByClass.set(t, new Go(t)), this._poolsByClass.get(t);
  }
  /** gets the usage stats of each pool in the system */
  stats() {
    const t = {};
    return this._poolsByClass.forEach((e) => {
      const i = t[e._classType.name] ? e._classType.name + e._classType.ID : e._classType.name;
      t[i] = {
        free: e.totalFree,
        used: e.totalUsed,
        size: e.totalSize
      };
    }), t;
  }
  /** Clears all pools in the group. This will reset all pools and free their resources. */
  clear() {
    this._poolsByClass.forEach((t) => t.clear()), this._poolsByClass.clear();
  }
}
const Z = new Bo();
Ue.register(Z);
const Fo = {
  get isCachedAsTexture() {
    var s;
    return !!((s = this.renderGroup) != null && s.isCachedAsTexture);
  },
  cacheAsTexture(s) {
    typeof s == "boolean" && s === !1 ? this.disableRenderGroup() : (this.enableRenderGroup(), this.renderGroup.enableCacheAsTexture(s === !0 ? {} : s));
  },
  updateCacheTexture() {
    var s;
    (s = this.renderGroup) == null || s.updateCacheTexture();
  },
  get cacheAsBitmap() {
    return this.isCachedAsTexture;
  },
  set cacheAsBitmap(s) {
    B("v8.6.0", "cacheAsBitmap is deprecated, use cacheAsTexture instead."), this.cacheAsTexture(s);
  }
};
function Do(s, t, e) {
  const i = s.length;
  let r;
  if (t >= i || e === 0)
    return;
  e = t + e > i ? i - t : e;
  const n = i - e;
  for (r = t; r < n; ++r)
    s[r] = s[r + e];
  s.length = n;
}
const Lo = {
  allowChildren: !0,
  removeChildren(s = 0, t) {
    var n;
    const e = t ?? this.children.length, i = e - s, r = [];
    if (i > 0 && i <= e) {
      for (let a = e - 1; a >= s; a--) {
        const h = this.children[a];
        h && (r.push(h), h.parent = null);
      }
      Do(this.children, s, e);
      const o = this.renderGroup || this.parentRenderGroup;
      o && o.removeChildren(r);
      for (let a = 0; a < r.length; ++a) {
        const h = r[a];
        (n = h.parentRenderLayer) == null || n.detach(h), this.emit("childRemoved", h, this, a), r[a].emit("removed", this);
      }
      return r.length > 0 && this._didViewChangeTick++, r;
    } else if (i === 0 && this.children.length === 0)
      return r;
    throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
  },
  removeChildAt(s) {
    const t = this.getChildAt(s);
    return this.removeChild(t);
  },
  getChildAt(s) {
    if (s < 0 || s >= this.children.length)
      throw new Error(`getChildAt: Index (${s}) does not exist.`);
    return this.children[s];
  },
  setChildIndex(s, t) {
    if (t < 0 || t >= this.children.length)
      throw new Error(`The index ${t} supplied is out of bounds ${this.children.length}`);
    this.getChildIndex(s), this.addChildAt(s, t);
  },
  getChildIndex(s) {
    const t = this.children.indexOf(s);
    if (t === -1)
      throw new Error("The supplied Container must be a child of the caller");
    return t;
  },
  addChildAt(s, t) {
    this.allowChildren || B(H, "addChildAt: Only Containers will be allowed to add children in v8.0.0");
    const { children: e } = this;
    if (t < 0 || t > e.length)
      throw new Error(`${s}addChildAt: The index ${t} supplied is out of bounds ${e.length}`);
    const i = s.parent === this;
    if (s.parent) {
      const n = s.parent.children.indexOf(s);
      if (i) {
        if (n === t)
          return s;
        s.parent.children.splice(n, 1);
      } else
        s.removeFromParent();
    }
    t === e.length ? e.push(s) : e.splice(t, 0, s), s.parent = this, s.didChange = !0, s._updateFlags = 15;
    const r = this.renderGroup || this.parentRenderGroup;
    return r && r.addChild(s), this.sortableChildren && (this.sortDirty = !0), i || (this.emit("childAdded", s, this, t), s.emit("added", this)), s;
  },
  swapChildren(s, t) {
    if (s === t)
      return;
    const e = this.getChildIndex(s), i = this.getChildIndex(t);
    this.children[e] = t, this.children[i] = s;
    const r = this.renderGroup || this.parentRenderGroup;
    r && (r.structureDidChange = !0), this._didContainerChangeTick++;
  },
  removeFromParent() {
    var s;
    (s = this.parent) == null || s.removeChild(this);
  },
  reparentChild(...s) {
    return s.length === 1 ? this.reparentChildAt(s[0], this.children.length) : (s.forEach((t) => this.reparentChildAt(t, this.children.length)), s[0]);
  },
  reparentChildAt(s, t) {
    if (s.parent === this)
      return this.setChildIndex(s, t), s;
    const e = s.worldTransform.clone();
    s.removeFromParent(), this.addChildAt(s, t);
    const i = this.worldTransform.clone();
    return i.invert(), e.prepend(i), s.setFromMatrix(e), s;
  },
  replaceChild(s, t) {
    s.updateLocalTransform(), this.addChildAt(t, this.getChildIndex(s)), t.setFromMatrix(s.localTransform), t.updateLocalTransform(), this.removeChild(s);
  }
}, Oo = {
  collectRenderables(s, t, e) {
    this.parentRenderLayer && this.parentRenderLayer !== e || this.globalDisplayStatus < 7 || !this.includeInBuild || (this.sortableChildren && this.sortChildren(), this.isSimple ? this.collectRenderablesSimple(s, t, e) : this.renderGroup ? t.renderPipes.renderGroup.addRenderGroup(this.renderGroup, s) : this.collectRenderablesWithEffects(s, t, e));
  },
  collectRenderablesSimple(s, t, e) {
    const i = this.children, r = i.length;
    for (let n = 0; n < r; n++)
      i[n].collectRenderables(s, t, e);
  },
  collectRenderablesWithEffects(s, t, e) {
    const { renderPipes: i } = t;
    for (let r = 0; r < this.effects.length; r++) {
      const n = this.effects[r];
      i[n.pipe].push(n, this, s);
    }
    this.collectRenderablesSimple(s, t, e);
    for (let r = this.effects.length - 1; r >= 0; r--) {
      const n = this.effects[r];
      i[n.pipe].pop(n, this, s);
    }
  }
};
class Ai {
  constructor() {
    this.pipe = "filter", this.priority = 1;
  }
  destroy() {
    for (let t = 0; t < this.filters.length; t++)
      this.filters[t].destroy();
    this.filters = null, this.filterArea = null;
  }
}
class zo {
  constructor() {
    this._effectClasses = [], this._tests = [], this._initialized = !1;
  }
  init() {
    this._initialized || (this._initialized = !0, this._effectClasses.forEach((t) => {
      this.add({
        test: t.test,
        maskClass: t
      });
    }));
  }
  add(t) {
    this._tests.push(t);
  }
  getMaskEffect(t) {
    this._initialized || this.init();
    for (let e = 0; e < this._tests.length; e++) {
      const i = this._tests[e];
      if (i.test(t))
        return Z.get(i.maskClass, t);
    }
    return t;
  }
  returnMaskEffect(t) {
    Z.return(t);
  }
}
const Es = new zo();
X.handleByList(I.MaskEffect, Es._effectClasses);
const Uo = {
  _maskEffect: null,
  _maskOptions: {
    inverse: !1,
    channel: "red"
  },
  _filterEffect: null,
  effects: [],
  _markStructureAsChanged() {
    const s = this.renderGroup || this.parentRenderGroup;
    s && (s.structureDidChange = !0);
  },
  addEffect(s) {
    this.effects.indexOf(s) === -1 && (this.effects.push(s), this.effects.sort((e, i) => e.priority - i.priority), this._markStructureAsChanged(), this._updateIsSimple());
  },
  removeEffect(s) {
    const t = this.effects.indexOf(s);
    t !== -1 && (this.effects.splice(t, 1), this._markStructureAsChanged(), this._updateIsSimple());
  },
  set mask(s) {
    const t = this._maskEffect;
    (t == null ? void 0 : t.mask) !== s && (t && (this.removeEffect(t), Es.returnMaskEffect(t), this._maskEffect = null), s != null && (this._maskEffect = Es.getMaskEffect(s), this.addEffect(this._maskEffect)));
  },
  get mask() {
    var s;
    return (s = this._maskEffect) == null ? void 0 : s.mask;
  },
  setMask(s) {
    this._maskOptions = {
      ...this._maskOptions,
      ...s
    }, s.mask && (this.mask = s.mask), this._markStructureAsChanged();
  },
  set filters(s) {
    var n;
    !Array.isArray(s) && s && (s = [s]);
    const t = this._filterEffect || (this._filterEffect = new Ai());
    s = s;
    const e = (s == null ? void 0 : s.length) > 0, i = ((n = t.filters) == null ? void 0 : n.length) > 0, r = e !== i;
    s = Array.isArray(s) ? s.slice(0) : s, t.filters = Object.freeze(s), r && (e ? this.addEffect(t) : (this.removeEffect(t), t.filters = s ?? null));
  },
  get filters() {
    var s;
    return (s = this._filterEffect) == null ? void 0 : s.filters;
  },
  set filterArea(s) {
    this._filterEffect || (this._filterEffect = new Ai()), this._filterEffect.filterArea = s;
  },
  get filterArea() {
    var s;
    return (s = this._filterEffect) == null ? void 0 : s.filterArea;
  }
}, No = {
  label: null,
  get name() {
    return B(H, "Container.name property has been removed, use Container.label instead"), this.label;
  },
  set name(s) {
    B(H, "Container.name property has been removed, use Container.label instead"), this.label = s;
  },
  getChildByName(s, t = !1) {
    return this.getChildByLabel(s, t);
  },
  getChildByLabel(s, t = !1) {
    const e = this.children;
    for (let i = 0; i < e.length; i++) {
      const r = e[i];
      if (r.label === s || s instanceof RegExp && s.test(r.label)) return r;
    }
    if (t)
      for (let i = 0; i < e.length; i++) {
        const n = e[i].getChildByLabel(s, !0);
        if (n)
          return n;
      }
    return null;
  },
  getChildrenByLabel(s, t = !1, e = []) {
    const i = this.children;
    for (let r = 0; r < i.length; r++) {
      const n = i[r];
      (n.label === s || s instanceof RegExp && s.test(n.label)) && e.push(n);
    }
    if (t)
      for (let r = 0; r < i.length; r++)
        i[r].getChildrenByLabel(s, !0, e);
    return e;
  }
}, q = Z.getPool(k), dt = Z.getPool(ot), Vo = new k(), Ho = {
  getFastGlobalBounds(s, t) {
    t || (t = new ot()), t.clear(), this._getGlobalBoundsRecursive(!!s, t, this.parentRenderLayer), t.isValid || t.set(0, 0, 0, 0);
    const e = this.renderGroup || this.parentRenderGroup;
    return t.applyMatrix(e.worldTransform), t;
  },
  _getGlobalBoundsRecursive(s, t, e) {
    let i = t;
    if (s && this.parentRenderLayer && this.parentRenderLayer !== e || this.localDisplayStatus !== 7 || !this.measurable)
      return;
    const r = !!this.effects.length;
    if ((this.renderGroup || r) && (i = dt.get().clear()), this.boundsArea)
      t.addRect(this.boundsArea, this.worldTransform);
    else {
      if (this.renderPipeId) {
        const o = this.bounds;
        i.addFrame(
          o.minX,
          o.minY,
          o.maxX,
          o.maxY,
          this.groupTransform
        );
      }
      const n = this.children;
      for (let o = 0; o < n.length; o++)
        n[o]._getGlobalBoundsRecursive(s, i, e);
    }
    if (r) {
      let n = !1;
      const o = this.renderGroup || this.parentRenderGroup;
      for (let a = 0; a < this.effects.length; a++)
        this.effects[a].addBounds && (n || (n = !0, i.applyMatrix(o.worldTransform)), this.effects[a].addBounds(i, !0));
      n && i.applyMatrix(o.worldTransform.copyTo(Vo).invert()), t.addBounds(i), dt.return(i);
    } else this.renderGroup && (t.addBounds(i, this.relativeGroupTransform), dt.return(i));
  }
};
function Wr(s, t, e) {
  e.clear();
  let i, r;
  return s.parent ? t ? i = s.parent.worldTransform : (r = q.get().identity(), i = Ws(s, r)) : i = k.IDENTITY, jr(s, e, i, t), r && q.return(r), e.isValid || e.set(0, 0, 0, 0), e;
}
function jr(s, t, e, i) {
  var a, h;
  if (!s.visible || !s.measurable) return;
  let r;
  i ? r = s.worldTransform : (s.updateLocalTransform(), r = q.get(), r.appendFrom(s.localTransform, e));
  const n = t, o = !!s.effects.length;
  if (o && (t = dt.get().clear()), s.boundsArea)
    t.addRect(s.boundsArea, r);
  else {
    const l = s.bounds;
    l && !l.isEmpty() && (t.matrix = r, t.addBounds(l));
    for (let c = 0; c < s.children.length; c++)
      jr(s.children[c], t, r, i);
  }
  if (o) {
    for (let l = 0; l < s.effects.length; l++)
      (h = (a = s.effects[l]).addBounds) == null || h.call(a, t);
    n.addBounds(t, k.IDENTITY), dt.return(t);
  }
  i || q.return(r);
}
function Ws(s, t) {
  const e = s.parent;
  return e && (Ws(e, t), e.updateLocalTransform(), t.append(e.localTransform)), t;
}
function qr(s, t) {
  if (s === 16777215 || !t) return t;
  if (t === 16777215 || !s) return s;
  const e = s >> 16 & 255, i = s >> 8 & 255, r = s & 255, n = t >> 16 & 255, o = t >> 8 & 255, a = t & 255, h = e * n / 255 | 0, l = i * o / 255 | 0, c = r * a / 255 | 0;
  return (h << 16) + (l << 8) + c;
}
const Ti = 16777215;
function Pi(s, t) {
  return s === Ti ? t : t === Ti ? s : qr(s, t);
}
function Be(s) {
  return ((s & 255) << 16) + (s & 65280) + (s >> 16 & 255);
}
const $o = {
  getGlobalAlpha(s) {
    if (s)
      return this.renderGroup ? this.renderGroup.worldAlpha : this.parentRenderGroup ? this.parentRenderGroup.worldAlpha * this.alpha : this.alpha;
    let t = this.alpha, e = this.parent;
    for (; e; )
      t *= e.alpha, e = e.parent;
    return t;
  },
  getGlobalTransform(s = new k(), t) {
    if (t)
      return s.copyFrom(this.worldTransform);
    this.updateLocalTransform();
    const e = Ws(this, q.get().identity());
    return s.appendFrom(this.localTransform, e), q.return(e), s;
  },
  getGlobalTint(s) {
    if (s)
      return this.renderGroup ? Be(this.renderGroup.worldColor) : this.parentRenderGroup ? Be(
        Pi(this.localColor, this.parentRenderGroup.worldColor)
      ) : this.tint;
    let t = this.localColor, e = this.parent;
    for (; e; )
      t = Pi(t, e.localColor), e = e.parent;
    return Be(t);
  }
};
function Kr(s, t, e) {
  return t.clear(), e || (e = k.IDENTITY), Zr(s, t, e, s, !0), t.isValid || t.set(0, 0, 0, 0), t;
}
function Zr(s, t, e, i, r) {
  var h, l;
  let n;
  if (r)
    n = q.get(), n = e.copyTo(n);
  else {
    if (!s.visible || !s.measurable) return;
    s.updateLocalTransform();
    const c = s.localTransform;
    n = q.get(), n.appendFrom(c, e);
  }
  const o = t, a = !!s.effects.length;
  if (a && (t = dt.get().clear()), s.boundsArea)
    t.addRect(s.boundsArea, n);
  else {
    s.renderPipeId && (t.matrix = n, t.addBounds(s.bounds));
    const c = s.children;
    for (let u = 0; u < c.length; u++)
      Zr(c[u], t, n, i, !1);
  }
  if (a) {
    for (let c = 0; c < s.effects.length; c++)
      (l = (h = s.effects[c]).addLocalBounds) == null || l.call(h, t, i);
    o.addBounds(t, k.IDENTITY), dt.return(t);
  }
  q.return(n);
}
function Qr(s, t) {
  const e = s.children;
  for (let i = 0; i < e.length; i++) {
    const r = e[i], n = r.uid, o = (r._didViewChangeTick & 65535) << 16 | r._didContainerChangeTick & 65535, a = t.index;
    (t.data[a] !== n || t.data[a + 1] !== o) && (t.data[t.index] = n, t.data[t.index + 1] = o, t.didChange = !0), t.index = a + 2, r.children.length && Qr(r, t);
  }
  return t.didChange;
}
const Yo = new k(), Xo = {
  _localBoundsCacheId: -1,
  _localBoundsCacheData: null,
  _setWidth(s, t) {
    const e = Math.sign(this.scale.x) || 1;
    t !== 0 ? this.scale.x = s / t * e : this.scale.x = e;
  },
  _setHeight(s, t) {
    const e = Math.sign(this.scale.y) || 1;
    t !== 0 ? this.scale.y = s / t * e : this.scale.y = e;
  },
  getLocalBounds() {
    this._localBoundsCacheData || (this._localBoundsCacheData = {
      data: [],
      index: 1,
      didChange: !1,
      localBounds: new ot()
    });
    const s = this._localBoundsCacheData;
    return s.index = 1, s.didChange = !1, s.data[0] !== this._didViewChangeTick && (s.didChange = !0, s.data[0] = this._didViewChangeTick), Qr(this, s), s.didChange && Kr(this, s.localBounds, Yo), s.localBounds;
  },
  getBounds(s, t) {
    return Wr(this, s, t || new ot());
  }
}, Wo = {
  _onRender: null,
  set onRender(s) {
    const t = this.renderGroup || this.parentRenderGroup;
    if (!s) {
      this._onRender && (t == null || t.removeOnRender(this)), this._onRender = null;
      return;
    }
    this._onRender || t == null || t.addOnRender(this), this._onRender = s;
  },
  get onRender() {
    return this._onRender;
  }
}, jo = {
  _zIndex: 0,
  sortDirty: !1,
  sortableChildren: !1,
  get zIndex() {
    return this._zIndex;
  },
  set zIndex(s) {
    this._zIndex !== s && (this._zIndex = s, this.depthOfChildModified());
  },
  depthOfChildModified() {
    this.parent && (this.parent.sortableChildren = !0, this.parent.sortDirty = !0), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0);
  },
  sortChildren() {
    this.sortDirty && (this.sortDirty = !1, this.children.sort(qo));
  }
};
function qo(s, t) {
  return s._zIndex - t._zIndex;
}
const Ko = {
  getGlobalPosition(s = new j(), t = !1) {
    return this.parent ? this.parent.toGlobal(this._position, s, t) : (s.x = this._position.x, s.y = this._position.y), s;
  },
  toGlobal(s, t, e = !1) {
    const i = this.getGlobalTransform(q.get(), e);
    return t = i.apply(s, t), q.return(i), t;
  },
  toLocal(s, t, e, i) {
    t && (s = t.toGlobal(s, e, i));
    const r = this.getGlobalTransform(q.get(), i);
    return e = r.applyInverse(s, e), q.return(r), e;
  }
};
class js {
  constructor() {
    this.uid = V("instructionSet"), this.instructions = [], this.instructionSize = 0, this.renderables = [], this.gcTick = 0;
  }
  /** reset the instruction set so it can be reused set size back to 0 */
  reset() {
    this.instructionSize = 0;
  }
  /**
   * Destroy the instruction set, clearing the instructions and renderables.
   * @internal
   */
  destroy() {
    this.instructions.length = 0, this.renderables.length = 0, this.renderPipes = null, this.gcTick = 0;
  }
  /**
   * Add an instruction to the set
   * @param instruction - add an instruction to the set
   */
  add(t) {
    this.instructions[this.instructionSize++] = t;
  }
  /**
   * Log the instructions to the console (for debugging)
   * @internal
   */
  log() {
    this.instructions.length = this.instructionSize, console.table(this.instructions, ["type", "action"]);
  }
}
let Zo = 0;
class Qo {
  /**
   * @param textureOptions - options that will be passed to BaseRenderTexture constructor
   * @param {SCALE_MODE} [textureOptions.scaleMode] - See {@link SCALE_MODE} for possible values.
   */
  constructor(t) {
    this._poolKeyHash = /* @__PURE__ */ Object.create(null), this._texturePool = {}, this.textureOptions = t || {}, this.enableFullScreen = !1, this.textureStyle = new Nr(this.textureOptions);
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param pixelWidth - Width of texture in pixels.
   * @param pixelHeight - Height of texture in pixels.
   * @param antialias
   * @param autoGenerateMipmaps - Whether to automatically generate mipmaps for this texture
   */
  createTexture(t, e, i, r) {
    const n = new at({
      ...this.textureOptions,
      width: t,
      height: e,
      resolution: 1,
      antialias: i,
      autoGarbageCollect: !1,
      autoGenerateMipmaps: r
    });
    return new L({
      source: n,
      label: `texturePool_${Zo++}`
    });
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param frameWidth - The minimum width of the render texture.
   * @param frameHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @param antialias
   * @param autoGenerateMipmaps - Whether to automatically generate mipmaps. Defaults to false.
   * @returns The new render texture.
   */
  getOptimalTexture(t, e, i = 1, r, n = !1) {
    let o = Math.ceil(t * i - 1e-6), a = Math.ceil(e * i - 1e-6);
    o = fi(o), a = fi(a);
    const h = r ? 1 : 0, l = n ? 1 : 0, c = (o << 17) + (a << 2) + (l << 1) + h;
    this._texturePool[c] || (this._texturePool[c] = []);
    let u = this._texturePool[c].pop();
    return u || (u = this.createTexture(o, a, r, n)), u.source._resolution = i, u.source.width = o / i, u.source.height = a / i, u.source.pixelWidth = o, u.source.pixelHeight = a, u.frame.x = 0, u.frame.y = 0, u.frame.width = t, u.frame.height = e, u.updateUvs(), this._poolKeyHash[u.uid] = c, u;
  }
  /**
   * Gets a pooled texture matching the dimensions and resolution of the given texture.
   *
   * This is a convenience wrapper around {@link TexturePoolClass#getOptimalTexture|getOptimalTexture}
   * that copies width, height, and resolution from an existing texture. Useful when a filter needs
   * a temporary texture the same size as its input (e.g., for multi-pass blur).
   * @param texture - The texture whose dimensions to match.
   * @param antialias - Whether to use antialias on the pooled texture. Defaults to `false`.
   * @returns A pooled texture with power-of-two backing dimensions at the source resolution.
   */
  getSameSizeTexture(t, e = !1) {
    const i = t.source;
    return this.getOptimalTexture(t.width, t.height, i._resolution, e);
  }
  /**
   * Returns a texture to the pool so it can be reused by future
   * {@link TexturePoolClass#getOptimalTexture|getOptimalTexture}
   * or {@link TexturePoolClass#getSameSizeTexture|getSameSizeTexture} calls.
   *
   * If you modified the texture's style after obtaining it (e.g., changed filtering or wrapping),
   * pass `resetStyle = true` to restore the pool's default {@link TexturePoolClass#textureStyle|textureStyle}.
   * This prevents style changes from leaking into subsequent consumers of the same pooled texture.
   * @param renderTexture - The texture to return to the pool.
   * @param resetStyle - When `true`, replaces the texture source's style with the pool default. Defaults to `false`.
   */
  returnTexture(t, e = !1) {
    const i = this._poolKeyHash[t.uid];
    e && (t.source.style = this.textureStyle), this._texturePool[i].push(t);
  }
  /**
   * Clears the pool.
   * @param destroyTextures - Destroy all stored textures.
   */
  clear(t) {
    if (t = t !== !1, t)
      for (const e in this._texturePool) {
        const i = this._texturePool[e];
        if (i)
          for (let r = 0; r < i.length; r++)
            i[r].destroy(!0);
      }
    this._texturePool = {};
  }
}
const Jr = new Qo();
Ue.register(Jr);
class Jo {
  constructor() {
    this.renderPipeId = "renderGroup", this.root = null, this.canBundle = !1, this.renderGroupParent = null, this.renderGroupChildren = [], this.worldTransform = new k(), this.worldColorAlpha = 4294967295, this.worldColor = 16777215, this.worldAlpha = 1, this.childrenToUpdate = /* @__PURE__ */ Object.create(null), this.updateTick = 0, this.gcTick = 0, this.childrenRenderablesToUpdate = { list: [], index: 0 }, this.structureDidChange = !0, this.instructionSet = new js(), this._onRenderContainers = [], this.textureNeedsUpdate = !0, this.isCachedAsTexture = !1, this._matrixDirty = 7;
  }
  init(t) {
    this.root = t, t._onRender && this.addOnRender(t), t.didChange = !0;
    const e = t.children;
    for (let i = 0; i < e.length; i++) {
      const r = e[i];
      r._updateFlags = 15, this.addChild(r);
    }
  }
  enableCacheAsTexture(t = {}) {
    this.textureOptions = t, this.isCachedAsTexture = !0, this.textureNeedsUpdate = !0;
  }
  disableCacheAsTexture() {
    this.isCachedAsTexture = !1, this.texture && (Jr.returnTexture(this.texture, !0), this.texture = null);
  }
  updateCacheTexture() {
    this.textureNeedsUpdate = !0;
    const t = this._parentCacheAsTextureRenderGroup;
    t && !t.textureNeedsUpdate && t.updateCacheTexture();
  }
  reset() {
    this.renderGroupChildren.length = 0;
    for (const t in this.childrenToUpdate) {
      const e = this.childrenToUpdate[t];
      e.list.fill(null), e.index = 0;
    }
    this.childrenRenderablesToUpdate.index = 0, this.childrenRenderablesToUpdate.list.fill(null), this.root = null, this.updateTick = 0, this.structureDidChange = !0, this._onRenderContainers.length = 0, this.renderGroupParent = null, this.disableCacheAsTexture();
  }
  get localTransform() {
    return this.root.localTransform;
  }
  addRenderGroupChild(t) {
    t.renderGroupParent && t.renderGroupParent._removeRenderGroupChild(t), t.renderGroupParent = this, this.renderGroupChildren.push(t);
  }
  _removeRenderGroupChild(t) {
    const e = this.renderGroupChildren.indexOf(t);
    e > -1 && this.renderGroupChildren.splice(e, 1), t.renderGroupParent = null;
  }
  addChild(t) {
    if (this.structureDidChange = !0, t.parentRenderGroup = this, t.updateTick = -1, t.parent === this.root ? t.relativeRenderGroupDepth = 1 : t.relativeRenderGroupDepth = t.parent.relativeRenderGroupDepth + 1, t.didChange = !0, this.onChildUpdate(t), t.renderGroup) {
      this.addRenderGroupChild(t.renderGroup);
      return;
    }
    t._onRender && this.addOnRender(t);
    const e = t.children;
    for (let i = 0; i < e.length; i++)
      this.addChild(e[i]);
  }
  removeChild(t) {
    if (this.structureDidChange = !0, t._onRender && (t.renderGroup || this.removeOnRender(t)), t.parentRenderGroup = null, t.renderGroup) {
      this._removeRenderGroupChild(t.renderGroup);
      return;
    }
    const e = t.children;
    for (let i = 0; i < e.length; i++)
      this.removeChild(e[i]);
  }
  removeChildren(t) {
    for (let e = 0; e < t.length; e++)
      this.removeChild(t[e]);
  }
  onChildUpdate(t) {
    let e = this.childrenToUpdate[t.relativeRenderGroupDepth];
    e || (e = this.childrenToUpdate[t.relativeRenderGroupDepth] = {
      index: 0,
      list: []
    }), e.list[e.index++] = t;
  }
  updateRenderable(t) {
    t.globalDisplayStatus < 7 || (this.instructionSet.renderPipes[t.renderPipeId].updateRenderable(t), t.didViewUpdate = !1);
  }
  onChildViewUpdate(t) {
    this.childrenRenderablesToUpdate.list[this.childrenRenderablesToUpdate.index++] = t;
  }
  get isRenderable() {
    return this.root.localDisplayStatus === 7 && this.worldAlpha > 0;
  }
  /**
   * adding a container to the onRender list will make sure the user function
   * passed in to the user defined 'onRender` callBack
   * @param container - the container to add to the onRender list
   */
  addOnRender(t) {
    this._onRenderContainers.push(t);
  }
  removeOnRender(t) {
    this._onRenderContainers.splice(this._onRenderContainers.indexOf(t), 1);
  }
  runOnRender(t) {
    for (let e = 0; e < this._onRenderContainers.length; e++)
      this._onRenderContainers[e]._onRender(t);
  }
  destroy() {
    this.disableCacheAsTexture(), this.renderGroupParent = null, this.root = null, this.childrenRenderablesToUpdate = null, this.childrenToUpdate = null, this.renderGroupChildren = null, this._onRenderContainers = null, this.instructionSet = null;
  }
  getChildren(t = []) {
    const e = this.root.children;
    for (let i = 0; i < e.length; i++)
      this._getChildren(e[i], t);
    return t;
  }
  _getChildren(t, e = []) {
    if (e.push(t), t.renderGroup) return e;
    const i = t.children;
    for (let r = 0; r < i.length; r++)
      this._getChildren(i[r], e);
    return e;
  }
  invalidateMatrices() {
    this._matrixDirty = 7;
  }
  /**
   * Returns the inverse of the world transform matrix.
   * @returns {Matrix} The inverse of the world transform matrix.
   */
  get inverseWorldTransform() {
    return this._matrixDirty & 1 ? (this._matrixDirty &= -2, this._inverseWorldTransform || (this._inverseWorldTransform = new k()), this._inverseWorldTransform.copyFrom(this.worldTransform).invert()) : this._inverseWorldTransform;
  }
  /**
   * Returns the inverse of the texture offset transform matrix.
   * @returns {Matrix} The inverse of the texture offset transform matrix.
   */
  get textureOffsetInverseTransform() {
    return this._matrixDirty & 2 ? (this._matrixDirty &= -3, this._textureOffsetInverseTransform || (this._textureOffsetInverseTransform = new k()), this._textureOffsetInverseTransform.copyFrom(this.inverseWorldTransform).translate(
      -this._textureBounds.x,
      -this._textureBounds.y
    )) : this._textureOffsetInverseTransform;
  }
  /**
   * Returns the inverse of the parent texture transform matrix.
   * This is used to properly transform coordinates when rendering into cached textures.
   * @returns {Matrix} The inverse of the parent texture transform matrix.
   */
  get inverseParentTextureTransform() {
    if (!(this._matrixDirty & 4)) return this._inverseParentTextureTransform;
    this._matrixDirty &= -5;
    const t = this._parentCacheAsTextureRenderGroup;
    return t ? (this._inverseParentTextureTransform || (this._inverseParentTextureTransform = new k()), this._inverseParentTextureTransform.copyFrom(this.worldTransform).prepend(t.inverseWorldTransform).translate(
      -t._textureBounds.x,
      -t._textureBounds.y
    )) : this.worldTransform;
  }
  /**
   * Returns a matrix that transforms coordinates to the correct coordinate space of the texture being rendered to.
   * This is the texture offset inverse transform of the closest parent RenderGroup that is cached as a texture.
   * @returns {Matrix | null} The transform matrix for the cached texture coordinate space,
   * or null if no parent is cached as texture.
   */
  get cacheToLocalTransform() {
    return this.isCachedAsTexture ? this.textureOffsetInverseTransform : this._parentCacheAsTextureRenderGroup ? this._parentCacheAsTextureRenderGroup.textureOffsetInverseTransform : null;
  }
}
function ta(s, t, e = {}) {
  for (const i in t)
    !e[i] && t[i] !== void 0 && (s[i] = t[i]);
}
const Je = new W(null), Ce = new W(null), ts = new W(null, 1, 1), Me = new W(null), Ei = 1, ea = 2, es = 4;
class yt extends mt {
  constructor(t = {}) {
    var e, i;
    super(), this.uid = V("renderable"), this._updateFlags = 15, this.renderGroup = null, this.parentRenderGroup = null, this.parentRenderGroupIndex = 0, this.didChange = !1, this.didViewUpdate = !1, this.relativeRenderGroupDepth = 0, this.children = [], this.parent = null, this.includeInBuild = !0, this.measurable = !0, this.isSimple = !0, this.parentRenderLayer = null, this.updateTick = -1, this.localTransform = new k(), this.relativeGroupTransform = new k(), this.groupTransform = this.relativeGroupTransform, this.destroyed = !1, this._position = new W(this, 0, 0), this._scale = ts, this._pivot = Ce, this._origin = Me, this._skew = Je, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._rotation = 0, this.localColor = 16777215, this.localAlpha = 1, this.groupAlpha = 1, this.groupColor = 16777215, this.groupColorAlpha = 4294967295, this.localBlendMode = "inherit", this.groupBlendMode = "normal", this.localDisplayStatus = 7, this.globalDisplayStatus = 7, this._didContainerChangeTick = 0, this._didViewChangeTick = 0, this._didLocalTransformChangeId = -1, this.effects = [], ta(this, t, {
      children: !0,
      parent: !0,
      effects: !0
    }), (e = t.children) == null || e.forEach((r) => this.addChild(r)), (i = t.parent) == null || i.addChild(this);
  }
  /**
   * Mixes all enumerable properties and methods from a source object to Container.
   * @param source - The source of properties and methods to mix in.
   * @deprecated since 8.8.0
   */
  static mixin(t) {
    B("8.8.0", "Container.mixin is deprecated, please use extensions.mixin instead."), X.mixin(yt, t);
  }
  // = 'default';
  /**
   * We now use the _didContainerChangeTick and _didViewChangeTick to track changes
   * @deprecated since 8.2.6
   * @ignore
   */
  set _didChangeId(t) {
    this._didViewChangeTick = t >> 12 & 4095, this._didContainerChangeTick = t & 4095;
  }
  /** @ignore */
  get _didChangeId() {
    return this._didContainerChangeTick & 4095 | (this._didViewChangeTick & 4095) << 12;
  }
  /**
   * Adds one or more children to the container.
   * The children will be rendered as part of this container's display list.
   * @example
   * ```ts
   * // Add a single child
   * container.addChild(sprite);
   *
   * // Add multiple children
   * container.addChild(background, player, foreground);
   *
   * // Add with type checking
   * const sprite = container.addChild<Sprite>(new Sprite(texture));
   * sprite.tint = 'red';
   * ```
   * @param children - The Container(s) to add to the container
   * @returns The first child that was added
   * @see {@link Container#removeChild} For removing children
   * @see {@link Container#addChildAt} For adding at specific index
   */
  addChild(...t) {
    if (this.allowChildren || B(H, "addChild: Only Containers will be allowed to add children in v8.0.0"), t.length > 1) {
      for (let r = 0; r < t.length; r++)
        this.addChild(t[r]);
      return t[0];
    }
    const e = t[0], i = this.renderGroup || this.parentRenderGroup;
    return e.parent === this ? (this.children.splice(this.children.indexOf(e), 1), this.children.push(e), i && (i.structureDidChange = !0), e) : (e.parent && e.parent.removeChild(e), this.children.push(e), this.sortableChildren && (this.sortDirty = !0), e.parent = this, e.didChange = !0, e._updateFlags = 15, i && i.addChild(e), this.emit("childAdded", e, this, this.children.length - 1), e.emit("added", this), this._didViewChangeTick++, e._zIndex !== 0 && e.depthOfChildModified(), e);
  }
  /**
   * Removes one or more children from the container.
   * When removing multiple children, events will be triggered for each child in sequence.
   * @example
   * ```ts
   * // Remove a single child
   * const removed = container.removeChild(sprite);
   *
   * // Remove multiple children
   * const bg = container.removeChild(background, player, userInterface);
   *
   * // Remove with type checking
   * const sprite = container.removeChild<Sprite>(childSprite);
   * sprite.texture = newTexture;
   * ```
   * @param children - The Container(s) to remove
   * @returns The first child that was removed
   * @see {@link Container#addChild} For adding children
   * @see {@link Container#removeChildren} For removing multiple children
   */
  removeChild(...t) {
    if (t.length > 1) {
      for (let r = 0; r < t.length; r++)
        this.removeChild(t[r]);
      return t[0];
    }
    const e = t[0], i = this.children.indexOf(e);
    return i > -1 && (this._didViewChangeTick++, this.children.splice(i, 1), this.renderGroup ? this.renderGroup.removeChild(e) : this.parentRenderGroup && this.parentRenderGroup.removeChild(e), e.parentRenderLayer && e.parentRenderLayer.detach(e), e.parent = null, this.emit("childRemoved", e, this, i), e.emit("removed", this)), e;
  }
  /** @ignore */
  _onUpdate(t) {
    t && t === this._skew && this._updateSkew(), this._didContainerChangeTick++, !this.didChange && (this.didChange = !0, this.parentRenderGroup && this.parentRenderGroup.onChildUpdate(this));
  }
  set isRenderGroup(t) {
    !!this.renderGroup !== t && (t ? this.enableRenderGroup() : this.disableRenderGroup());
  }
  /**
   * Returns true if this container is a render group.
   * This means that it will be rendered as a separate pass, with its own set of instructions
   * @advanced
   */
  get isRenderGroup() {
    return !!this.renderGroup;
  }
  /**
   * Calling this enables a render group for this container.
   * This means it will be rendered as a separate set of instructions.
   * The transform of the container will also be handled on the GPU rather than the CPU.
   * @advanced
   */
  enableRenderGroup() {
    if (this.renderGroup) return;
    const t = this.parentRenderGroup;
    t == null || t.removeChild(this), this.renderGroup = Z.get(Jo, this), this.groupTransform = k.IDENTITY, t == null || t.addChild(this), this._updateIsSimple();
  }
  /**
   * This will disable the render group for this container.
   * @advanced
   */
  disableRenderGroup() {
    if (!this.renderGroup) return;
    const t = this.parentRenderGroup;
    t == null || t.removeChild(this), Z.return(this.renderGroup), this.renderGroup = null, this.groupTransform = this.relativeGroupTransform, t == null || t.addChild(this), this._updateIsSimple();
  }
  /** @ignore */
  _updateIsSimple() {
    this.isSimple = !this.renderGroup && this.effects.length === 0;
  }
  /**
   * Current transform of the object based on world (parent) factors.
   *
   * This matrix represents the absolute transformation in the scene graph.
   * @example
   * ```ts
   * // Get world position
   * const worldPos = container.worldTransform;
   * console.log(`World position: (${worldPos.tx}, ${worldPos.ty})`);
   * ```
   * @readonly
   * @see {@link Container#localTransform} For local space transform
   */
  get worldTransform() {
    return this._worldTransform || (this._worldTransform = new k()), this.renderGroup ? this._worldTransform.copyFrom(this.renderGroup.worldTransform) : this.parentRenderGroup && this._worldTransform.appendFrom(this.relativeGroupTransform, this.parentRenderGroup.worldTransform), this._worldTransform;
  }
  /**
   * The position of the container on the x axis relative to the local coordinates of the parent.
   *
   * An alias to position.x
   * @example
   * ```ts
   * // Basic position
   * container.x = 100;
   * ```
   */
  get x() {
    return this._position.x;
  }
  set x(t) {
    this._position.x = t;
  }
  /**
   * The position of the container on the y axis relative to the local coordinates of the parent.
   *
   * An alias to position.y
   * @example
   * ```ts
   * // Basic position
   * container.y = 200;
   * ```
   */
  get y() {
    return this._position.y;
  }
  set y(t) {
    this._position.y = t;
  }
  /**
   * The coordinate of the object relative to the local coordinates of the parent.
   * @example
   * ```ts
   * // Basic position setting
   * container.position.set(100, 200);
   * container.position.set(100); // Sets both x and y to 100
   * // Using point data
   * container.position = { x: 50, y: 75 };
   * ```
   * @since 4.0.0
   */
  get position() {
    return this._position;
  }
  set position(t) {
    this._position.copyFrom(t);
  }
  /**
   * The rotation of the object in radians.
   *
   * > [!NOTE] 'rotation' and 'angle' have the same effect on a display object;
   * > rotation is in radians, angle is in degrees.
   * @example
   * ```ts
   * // Basic rotation
   * container.rotation = Math.PI / 4; // 45 degrees
   *
   * // Convert from degrees
   * const degrees = 45;
   * container.rotation = degrees * Math.PI / 180;
   *
   * // Rotate around center
   * container.pivot.set(container.width / 2, container.height / 2);
   * container.rotation = Math.PI; // 180 degrees
   *
   * // Rotate around center with origin
   * container.origin.set(container.width / 2, container.height / 2);
   * container.rotation = Math.PI; // 180 degrees
   * ```
   */
  get rotation() {
    return this._rotation;
  }
  set rotation(t) {
    this._rotation !== t && (this._rotation = t, this._onUpdate(this._skew));
  }
  /**
   * The angle of the object in degrees.
   *
   * > [!NOTE] 'rotation' and 'angle' have the same effect on a display object;
   * > rotation is in radians, angle is in degrees.
   * @example
   * ```ts
   * // Basic angle rotation
   * sprite.angle = 45; // 45 degrees
   *
   * // Rotate around center
   * sprite.pivot.set(sprite.width / 2, sprite.height / 2);
   * sprite.angle = 180; // Half rotation
   *
   * // Rotate around center with origin
   * sprite.origin.set(sprite.width / 2, sprite.height / 2);
   * sprite.angle = 180; // Half rotation
   *
   * // Reset rotation
   * sprite.angle = 0;
   * ```
   */
  get angle() {
    return this.rotation * po;
  }
  set angle(t) {
    this.rotation = t * mo;
  }
  /**
   * The center of rotation, scaling, and skewing for this display object in its local space.
   * The `position` is the projection of `pivot` in the parent's local space.
   *
   * By default, the pivot is the origin (0, 0).
   * @example
   * ```ts
   * // Rotate around center
   * container.pivot.set(container.width / 2, container.height / 2);
   * container.rotation = Math.PI; // Rotates around center
   * ```
   * @since 4.0.0
   */
  get pivot() {
    return this._pivot === Ce && (this._pivot = new W(this, 0, 0)), this._pivot;
  }
  set pivot(t) {
    this._pivot === Ce && (this._pivot = new W(this, 0, 0), this._origin !== Me && J("Setting both a pivot and origin on a Container is not recommended. This can lead to unexpected behavior if not handled carefully.")), typeof t == "number" ? this._pivot.set(t) : this._pivot.copyFrom(t);
  }
  /**
   * The skew factor for the object in radians. Skewing is a transformation that distorts
   * the object by rotating it differently at each point, creating a non-uniform shape.
   * @example
   * ```ts
   * // Basic skewing
   * container.skew.set(0.5, 0); // Skew horizontally
   * container.skew.set(0, 0.5); // Skew vertically
   *
   * // Skew with point data
   * container.skew = { x: 0.3, y: 0.3 }; // Diagonal skew
   *
   * // Reset skew
   * container.skew.set(0, 0);
   *
   * // Animate skew
   * app.ticker.add(() => {
   *     // Create wave effect
   *     container.skew.x = Math.sin(Date.now() / 1000) * 0.3;
   * });
   *
   * // Combine with rotation
   * container.rotation = Math.PI / 4; // 45 degrees
   * container.skew.set(0.2, 0.2); // Skew the rotated object
   * ```
   * @since 4.0.0
   * @type {ObservablePoint} Point-like object with x/y properties in radians
   * @default {x: 0, y: 0}
   */
  get skew() {
    return this._skew === Je && (this._skew = new W(this, 0, 0)), this._skew;
  }
  set skew(t) {
    this._skew === Je && (this._skew = new W(this, 0, 0)), this._skew.copyFrom(t);
  }
  /**
   * The scale factors of this object along the local coordinate axes.
   *
   * The default scale is (1, 1).
   * @example
   * ```ts
   * // Basic scaling
   * container.scale.set(2, 2); // Scales to double size
   * container.scale.set(2); // Scales uniformly to double size
   * container.scale = 2; // Scales uniformly to double size
   * // Scale to a specific width and height
   * container.setSize(200, 100); // Sets width to 200 and height to 100
   * ```
   * @since 4.0.0
   */
  get scale() {
    return this._scale === ts && (this._scale = new W(this, 1, 1)), this._scale;
  }
  set scale(t) {
    this._scale === ts && (this._scale = new W(this, 0, 0)), typeof t == "string" && (t = parseFloat(t)), typeof t == "number" ? this._scale.set(t) : this._scale.copyFrom(t);
  }
  /**
   * @experimental
   * The origin point around which the container rotates and scales without affecting its position.
   * Unlike pivot, changing the origin will not move the container's position.
   * @example
   * ```ts
   * // Rotate around center point
   * container.origin.set(container.width / 2, container.height / 2);
   * container.rotation = Math.PI; // Rotates around center
   *
   * // Reset origin
   * container.origin.set(0, 0);
   * ```
   */
  get origin() {
    return this._origin === Me && (this._origin = new W(this, 0, 0)), this._origin;
  }
  set origin(t) {
    this._origin === Me && (this._origin = new W(this, 0, 0), this._pivot !== Ce && J("Setting both a pivot and origin on a Container is not recommended. This can lead to unexpected behavior if not handled carefully.")), typeof t == "number" ? this._origin.set(t) : this._origin.copyFrom(t);
  }
  /**
   * The width of the Container, setting this will actually modify the scale to achieve the value set.
   * > [!NOTE] Changing the width will adjust the scale.x property of the container while maintaining its aspect ratio.
   * > [!NOTE] If you want to set both width and height at the same time, use {@link Container#setSize}
   * as it is more optimized by not recalculating the local bounds twice.
   * @example
   * ```ts
   * // Basic width setting
   * container.width = 100;
   * // Optimized width setting
   * container.setSize(100, 100);
   * ```
   */
  get width() {
    return Math.abs(this.scale.x * this.getLocalBounds().width);
  }
  set width(t) {
    const e = this.getLocalBounds().width;
    this._setWidth(t, e);
  }
  /**
   * The height of the Container,
   * > [!NOTE] Changing the height will adjust the scale.y property of the container while maintaining its aspect ratio.
   * > [!NOTE] If you want to set both width and height at the same time, use {@link Container#setSize}
   * as it is more optimized by not recalculating the local bounds twice.
   * @example
   * ```ts
   * // Basic height setting
   * container.height = 200;
   * // Optimized height setting
   * container.setSize(100, 200);
   * ```
   */
  get height() {
    return Math.abs(this.scale.y * this.getLocalBounds().height);
  }
  set height(t) {
    const e = this.getLocalBounds().height;
    this._setHeight(t, e);
  }
  /**
   * Retrieves the size of the container as a [Size]{@link Size} object.
   *
   * This is faster than get the width and height separately.
   * @example
   * ```ts
   * // Basic size retrieval
   * const size = container.getSize();
   * console.log(`Size: ${size.width}x${size.height}`);
   *
   * // Reuse existing size object
   * const reuseSize = { width: 0, height: 0 };
   * container.getSize(reuseSize);
   * ```
   * @param out - Optional object to store the size in.
   * @returns The size of the container.
   */
  getSize(t) {
    t || (t = {});
    const e = this.getLocalBounds();
    return t.width = Math.abs(this.scale.x * e.width), t.height = Math.abs(this.scale.y * e.height), t;
  }
  /**
   * Sets the size of the container to the specified width and height.
   * This is more efficient than setting width and height separately as it only recalculates bounds once.
   * @example
   * ```ts
   * // Basic size setting
   * container.setSize(100, 200);
   *
   * // Set uniform size
   * container.setSize(100); // Sets both width and height to 100
   * ```
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(t, e) {
    const i = this.getLocalBounds();
    typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, i.width), e !== void 0 && this._setHeight(e, i.height);
  }
  /** Called when the skew or the rotation changes. */
  _updateSkew() {
    const t = this._rotation, e = this._skew;
    this._cx = Math.cos(t + e._y), this._sx = Math.sin(t + e._y), this._cy = -Math.sin(t - e._x), this._sy = Math.cos(t - e._x);
  }
  /**
   * Updates the transform properties of the container.
   * Allows partial updates of transform properties for optimized manipulation.
   * @example
   * ```ts
   * // Basic transform update
   * container.updateTransform({
   *     x: 100,
   *     y: 200,
   *     rotation: Math.PI / 4
   * });
   *
   * // Scale and rotate around center
   * sprite.updateTransform({
   *     pivotX: sprite.width / 2,
   *     pivotY: sprite.height / 2,
   *     scaleX: 2,
   *     scaleY: 2,
   *     rotation: Math.PI
   * });
   *
   * // Update position only
   * button.updateTransform({
   *     x: button.x + 10, // Move right
   *     y: button.y      // Keep same y
   * });
   * ```
   * @param opts - Transform options to update
   * @param opts.x - The x position
   * @param opts.y - The y position
   * @param opts.scaleX - The x-axis scale factor
   * @param opts.scaleY - The y-axis scale factor
   * @param opts.rotation - The rotation in radians
   * @param opts.skewX - The x-axis skew factor
   * @param opts.skewY - The y-axis skew factor
   * @param opts.pivotX - The x-axis pivot point
   * @param opts.pivotY - The y-axis pivot point
   * @returns This container, for chaining
   * @see {@link Container#setFromMatrix} For matrix-based transforms
   * @see {@link Container#position} For direct position access
   */
  updateTransform(t) {
    return this.position.set(
      typeof t.x == "number" ? t.x : this.position.x,
      typeof t.y == "number" ? t.y : this.position.y
    ), this.scale.set(
      typeof t.scaleX == "number" ? t.scaleX || 1 : this.scale.x,
      typeof t.scaleY == "number" ? t.scaleY || 1 : this.scale.y
    ), this.rotation = typeof t.rotation == "number" ? t.rotation : this.rotation, this.skew.set(
      typeof t.skewX == "number" ? t.skewX : this.skew.x,
      typeof t.skewY == "number" ? t.skewY : this.skew.y
    ), this.pivot.set(
      typeof t.pivotX == "number" ? t.pivotX : this.pivot.x,
      typeof t.pivotY == "number" ? t.pivotY : this.pivot.y
    ), this.origin.set(
      typeof t.originX == "number" ? t.originX : this.origin.x,
      typeof t.originY == "number" ? t.originY : this.origin.y
    ), this;
  }
  /**
   * Updates the local transform properties by decomposing the given matrix.
   * Extracts position, scale, rotation, and skew from a transformation matrix.
   * @example
   * ```ts
   * // Basic matrix transform
   * const matrix = new Matrix()
   *     .translate(100, 100)
   *     .rotate(Math.PI / 4)
   *     .scale(2, 2);
   *
   * container.setFromMatrix(matrix);
   *
   * // Copy transform from another container
   * const source = new Container();
   * source.position.set(100, 100);
   * source.rotation = Math.PI / 2;
   *
   * target.setFromMatrix(source.localTransform);
   *
   * // Reset transform
   * container.setFromMatrix(Matrix.IDENTITY);
   * ```
   * @param matrix - The matrix to use for updating the transform
   * @see {@link Container#updateTransform} For property-based updates
   * @see {@link Matrix#decompose} For matrix decomposition details
   */
  setFromMatrix(t) {
    t.decompose(this);
  }
  /** Updates the local transform. */
  updateLocalTransform() {
    const t = this._didContainerChangeTick;
    if (this._didLocalTransformChangeId === t) return;
    this._didLocalTransformChangeId = t;
    const e = this.localTransform, i = this._scale, r = this._pivot, n = this._origin, o = this._position, a = i._x, h = i._y, l = r._x, c = r._y, u = -n._x, f = -n._y;
    e.a = this._cx * a, e.b = this._sx * a, e.c = this._cy * h, e.d = this._sy * h, e.tx = o._x - (l * e.a + c * e.c) + (u * e.a + f * e.c) - u, e.ty = o._y - (l * e.b + c * e.d) + (u * e.b + f * e.d) - f;
  }
  // / ///// color related stuff
  set alpha(t) {
    t !== this.localAlpha && (this.localAlpha = t, this._updateFlags |= Ei, this._onUpdate());
  }
  /**
   * The opacity of the object relative to its parent's opacity.
   * Value ranges from 0 (fully transparent) to 1 (fully opaque).
   * @example
   * ```ts
   * // Basic transparency
   * sprite.alpha = 0.5; // 50% opacity
   *
   * // Inherited opacity
   * container.alpha = 0.5;
   * const child = new Sprite(texture);
   * child.alpha = 0.5;
   * container.addChild(child);
   * // child's effective opacity is 0.25 (0.5 * 0.5)
   * ```
   * @default 1
   * @see {@link Container#visible} For toggling visibility
   * @see {@link Container#renderable} For render control
   */
  get alpha() {
    return this.localAlpha;
  }
  set tint(t) {
    const i = rt.shared.setValue(t ?? 16777215).toBgrNumber();
    i !== this.localColor && (this.localColor = i, this._updateFlags |= Ei, this._onUpdate());
  }
  /**
   * The tint applied to the sprite.
   *
   * This can be any valid {@link ColorSource}.
   * @example
   * ```ts
   * // Basic color tinting
   * container.tint = 0xff0000; // Red tint
   * container.tint = 'red';    // Same as above
   * container.tint = '#00ff00'; // Green
   * container.tint = 'rgb(0,0,255)'; // Blue
   *
   * // Remove tint
   * container.tint = 0xffffff; // White = no tint
   * container.tint = null;     // Also removes tint
   * ```
   * @default 0xFFFFFF
   * @see {@link Container#alpha} For transparency
   * @see {@link Container#visible} For visibility control
   */
  get tint() {
    return Be(this.localColor);
  }
  // / //////////////// blend related stuff
  set blendMode(t) {
    this.localBlendMode !== t && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= ea, this.localBlendMode = t, this._onUpdate());
  }
  /**
   * The blend mode to be applied to the sprite. Controls how pixels are blended when rendering.
   *
   * Setting to 'normal' will reset to default blending.
   * > [!NOTE] More blend modes are available after importing the `pixi.js/advanced-blend-modes` sub-export.
   * @example
   * ```ts
   * // Basic blend modes
   * sprite.blendMode = 'add';        // Additive blending
   * sprite.blendMode = 'multiply';   // Multiply colors
   * sprite.blendMode = 'screen';     // Screen blend
   *
   * // Reset blend mode
   * sprite.blendMode = 'normal';     // Normal blending
   * ```
   * @default 'normal'
   * @see {@link Container#alpha} For transparency
   * @see {@link Container#tint} For color adjustments
   */
  get blendMode() {
    return this.localBlendMode;
  }
  // / ///////// VISIBILITY / RENDERABLE /////////////////
  /**
   * The visibility of the object. If false the object will not be drawn,
   * and the transform will not be updated.
   * @example
   * ```ts
   * // Basic visibility toggle
   * sprite.visible = false; // Hide sprite
   * sprite.visible = true;  // Show sprite
   * ```
   * @default true
   * @see {@link Container#renderable} For render-only control
   * @see {@link Container#alpha} For transparency
   */
  get visible() {
    return !!(this.localDisplayStatus & 2);
  }
  set visible(t) {
    const e = t ? 2 : 0;
    (this.localDisplayStatus & 2) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= es, this.localDisplayStatus ^= 2, this._onUpdate(), this.emit("visibleChanged", t));
  }
  /** @ignore */
  get culled() {
    return !(this.localDisplayStatus & 4);
  }
  /** @ignore */
  set culled(t) {
    const e = t ? 0 : 4;
    (this.localDisplayStatus & 4) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= es, this.localDisplayStatus ^= 4, this._onUpdate());
  }
  /**
   * Controls whether this object can be rendered. If false the object will not be drawn,
   * but the transform will still be updated. This is different from visible, which skips
   * transform updates.
   * @example
   * ```ts
   * // Basic render control
   * sprite.renderable = false; // Skip rendering
   * sprite.renderable = true;  // Enable rendering
   * ```
   * @default true
   * @see {@link Container#visible} For skipping transform updates
   * @see {@link Container#alpha} For transparency
   */
  get renderable() {
    return !!(this.localDisplayStatus & 1);
  }
  set renderable(t) {
    const e = t ? 1 : 0;
    (this.localDisplayStatus & 1) !== e && (this._updateFlags |= es, this.localDisplayStatus ^= 1, this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._onUpdate());
  }
  /**
   * Whether or not the object should be rendered.
   * @advanced
   */
  get isRenderable() {
    return this.localDisplayStatus === 7 && this.groupAlpha > 0;
  }
  /**
   * Removes all internal references and listeners as well as removes children from the display list.
   * Do not use a Container after calling `destroy`.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @example
   * ```ts
   * container.destroy();
   * container.destroy(true);
   * container.destroy({ children: true });
   * container.destroy({ children: true, texture: true, textureSource: true });
   * ```
   */
  destroy(t = !1) {
    var r;
    if (this.destroyed) return;
    this.destroyed = !0;
    let e;
    if (this.children.length && (e = this.removeChildren(0, this.children.length)), this.removeFromParent(), this.parent = null, this._maskEffect = null, this._filterEffect = null, this.effects = null, this._position = null, this._scale = null, this._pivot = null, this._origin = null, this._skew = null, this.emit("destroyed", this), this.removeAllListeners(), (typeof t == "boolean" ? t : t == null ? void 0 : t.children) && e)
      for (let n = 0; n < e.length; ++n)
        e[n].destroy(t);
    (r = this.renderGroup) == null || r.destroy(), this.renderGroup = null;
  }
}
X.mixin(
  yt,
  Lo,
  Ho,
  Ko,
  Wo,
  Xo,
  Uo,
  No,
  jo,
  Ro,
  Fo,
  $o,
  Oo
);
class tn extends yt {
  constructor(t) {
    super(t), this.canBundle = !0, this.allowChildren = !1, this._roundPixels = 0, this._lastUsed = -1, this._gpuData = /* @__PURE__ */ Object.create(null), this.autoGarbageCollect = !0, this._gcLastUsed = -1, this._bounds = new ot(0, 1, 0, 0), this._boundsDirty = !0, this.autoGarbageCollect = t.autoGarbageCollect ?? !0;
  }
  /**
   * The local bounds of the view in its own coordinate space.
   * Bounds are automatically updated when the view's content changes.
   * @example
   * ```ts
   * // Get bounds dimensions
   * const bounds = view.bounds;
   * console.log(`Width: ${bounds.maxX - bounds.minX}`);
   * console.log(`Height: ${bounds.maxY - bounds.minY}`);
   * ```
   * @returns The rectangular bounds of the view
   * @see {@link Bounds} For bounds operations
   */
  get bounds() {
    return this._boundsDirty ? (this.updateBounds(), this._boundsDirty = !1, this._bounds) : this._bounds;
  }
  /**
   * Whether or not to round the x/y position of the sprite.
   * @example
   * ```ts
   * // Enable pixel rounding for crisp rendering
   * view.roundPixels = true;
   * ```
   * @default false
   */
  get roundPixels() {
    return !!this._roundPixels;
  }
  set roundPixels(t) {
    this._roundPixels = t ? 1 : 0;
  }
  /**
   * Checks if the object contains the given point in local coordinates.
   * Uses the view's bounds for hit testing.
   * @example
   * ```ts
   * // Basic point check
   * const localPoint = { x: 50, y: 25 };
   * const contains = view.containsPoint(localPoint);
   * console.log('Point is inside:', contains);
   * ```
   * @param point - The point to check in local coordinates
   * @returns True if the point is within the view's bounds
   * @see {@link ViewContainer#bounds} For the bounds used in hit testing
   * @see {@link Container#toLocal} For converting global coordinates to local
   */
  containsPoint(t) {
    const e = this.bounds, { x: i, y: r } = t;
    return i >= e.minX && i <= e.maxX && r >= e.minY && r <= e.maxY;
  }
  /** @private */
  onViewUpdate() {
    if (this._didViewChangeTick++, this._boundsDirty = !0, this.didViewUpdate) return;
    this.didViewUpdate = !0;
    const t = this.renderGroup || this.parentRenderGroup;
    t && t.onChildViewUpdate(this);
  }
  /** Unloads the GPU data from the view. */
  unload() {
    var t;
    this.emit("unload", this);
    for (const e in this._gpuData)
      (t = this._gpuData[e]) == null || t.destroy();
    this._gpuData = /* @__PURE__ */ Object.create(null), this.onViewUpdate();
  }
  destroy(t) {
    this.unload(), super.destroy(t), this._bounds = null;
  }
  /**
   * Collects renderables for the view container.
   * @param instructionSet - The instruction set to collect renderables for.
   * @param renderer - The renderer to collect renderables for.
   * @param currentLayer - The current render layer.
   * @internal
   */
  collectRenderablesSimple(t, e, i) {
    const { renderPipes: r } = e;
    r.blendMode.pushBlendMode(this, this.groupBlendMode, t);
    const o = r[this.renderPipeId];
    o != null && o.addRenderable && o.addRenderable(this, t), this.didViewUpdate = !1;
    const a = this.children, h = a.length;
    for (let l = 0; l < h; l++)
      a[l].collectRenderables(t, e, i);
    r.blendMode.popBlendMode(t);
  }
}
class he extends tn {
  /**
   * @param options - The options for creating the sprite.
   */
  constructor(t = L.EMPTY) {
    t instanceof L && (t = { texture: t });
    const { texture: e = L.EMPTY, anchor: i, roundPixels: r, width: n, height: o, ...a } = t;
    super({
      label: "Sprite",
      ...a
    }), this.renderPipeId = "sprite", this.batched = !0, this._visualBounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, this._anchor = new W(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), i ? this.anchor = i : e.defaultAnchor && (this.anchor = e.defaultAnchor), this.texture = e, this.allowChildren = !1, this.roundPixels = r ?? !1, n !== void 0 && (this.width = n), o !== void 0 && (this.height = o);
  }
  /**
   * Creates a new sprite based on a source texture, image, video, or canvas element.
   * This is a convenience method that automatically creates and manages textures.
   * @example
   * ```ts
   * // Create from path or URL
   * const sprite = Sprite.from('assets/image.png');
   *
   * // Create from existing texture
   * const sprite = Sprite.from(texture);
   *
   * // Create from canvas
   * const canvas = document.createElement('canvas');
   * const sprite = Sprite.from(canvas, true); // Skip caching new texture
   * ```
   * @param source - The source to create the sprite from. Can be a path to an image, a texture,
   * or any valid texture source (canvas, video, etc.)
   * @param skipCache - Whether to skip adding to the texture cache when creating a new texture
   * @returns A new sprite based on the source
   * @see {@link Texture.from} For texture creation details
   * @see {@link Assets} For asset loading and management
   */
  static from(t, e = !1) {
    return t instanceof L ? new he(t) : new he(L.from(t, e));
  }
  set texture(t) {
    t || (t = L.EMPTY);
    const e = this._texture;
    e !== t && (e && e.dynamic && e.off("update", this.onViewUpdate, this), t.dynamic && t.on("update", this.onViewUpdate, this), this._texture = t, this._width && this._setWidth(this._width, this._texture.orig.width), this._height && this._setHeight(this._height, this._texture.orig.height), this.onViewUpdate());
  }
  /**
   * The texture that is displayed by the sprite. When changed, automatically updates
   * the sprite dimensions and manages texture event listeners.
   * @example
   * ```ts
   * // Create sprite with texture
   * const sprite = new Sprite({
   *     texture: Texture.from('sprite.png')
   * });
   *
   * // Update texture
   * sprite.texture = Texture.from('newSprite.png');
   *
   * // Use texture from spritesheet
   * const sheet = await Assets.load('spritesheet.json');
   * sprite.texture = sheet.textures['frame1.png'];
   *
   * // Reset to empty texture
   * sprite.texture = Texture.EMPTY;
   * ```
   * @see {@link Texture} For texture creation and management
   * @see {@link Assets} For asset loading
   */
  get texture() {
    return this._texture;
  }
  /**
   * The bounds of the sprite, taking into account the texture's trim area.
   * @example
   * ```ts
   * const texture = new Texture({
   *     source: new TextureSource({ width: 300, height: 300 }),
   *     frame: new Rectangle(196, 66, 58, 56),
   *     trim: new Rectangle(4, 4, 58, 56),
   *     orig: new Rectangle(0, 0, 64, 64),
   *     rotate: 2,
   * });
   * const sprite = new Sprite(texture);
   * const visualBounds = sprite.visualBounds;
   * // console.log(visualBounds); // { minX: -4, maxX: 62, minY: -4, maxY: 60 }
   */
  get visualBounds() {
    return wo(this._visualBounds, this._anchor, this._texture), this._visualBounds;
  }
  /**
   * @deprecated
   * @ignore
   */
  get sourceBounds() {
    return B("8.6.1", "Sprite.sourceBounds is deprecated, use visualBounds instead."), this.visualBounds;
  }
  /** @private */
  updateBounds() {
    const t = this._anchor, e = this._texture, i = this._bounds, { width: r, height: n } = e.orig;
    i.minX = -t._x * r, i.maxX = i.minX + r, i.minY = -t._y * n, i.maxY = i.minY + n;
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @example
   * sprite.destroy();
   * sprite.destroy(true);
   * sprite.destroy({ texture: true, textureSource: true });
   */
  destroy(t = !1) {
    if (super.destroy(t), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const i = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      this._texture.destroy(i);
    }
    this._texture = null, this._visualBounds = null, this._bounds = null, this._anchor = null;
  }
  /**
   * The anchor sets the origin point of the sprite. The default value is taken from the {@link Texture}
   * and passed to the constructor.
   *
   * - The default is `(0,0)`, this means the sprite's origin is the top left.
   * - Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
   * - Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * ```ts
   * // Center the anchor point
   * sprite.anchor = 0.5; // Sets both x and y to 0.5
   * sprite.position.set(400, 300); // Sprite will be centered at this position
   *
   * // Set specific x/y anchor points
   * sprite.anchor = {
   *     x: 1, // Right edge
   *     y: 0  // Top edge
   * };
   *
   * // Using individual coordinates
   * sprite.anchor.set(0.5, 1); // Center-bottom
   *
   * // For rotation around center
   * sprite.anchor.set(0.5);
   * sprite.rotation = Math.PI / 4; // 45 degrees around center
   *
   * // For scaling from center
   * sprite.anchor.set(0.5);
   * sprite.scale.set(2); // Scales from center point
   * ```
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
  }
  /**
   * The width of the sprite, setting this will actually modify the scale to achieve the value set.
   * @example
   * ```ts
   * // Set width directly
   * sprite.width = 200;
   * console.log(sprite.scale.x); // Scale adjusted to match width
   *
   * // Set width while preserving aspect ratio
   * const ratio = sprite.height / sprite.width;
   * sprite.width = 300;
   * sprite.height = 300 * ratio;
   *
   * // For better performance when setting both width and height
   * sprite.setSize(300, 400); // Avoids recalculating bounds twice
   *
   * // Reset to original texture size
   * sprite.width = sprite.texture.orig.width;
   * ```
   */
  get width() {
    return Math.abs(this.scale.x) * this._texture.orig.width;
  }
  set width(t) {
    this._setWidth(t, this._texture.orig.width), this._width = t;
  }
  /**
   * The height of the sprite, setting this will actually modify the scale to achieve the value set.
   * @example
   * ```ts
   * // Set height directly
   * sprite.height = 150;
   * console.log(sprite.scale.y); // Scale adjusted to match height
   *
   * // Set height while preserving aspect ratio
   * const ratio = sprite.width / sprite.height;
   * sprite.height = 200;
   * sprite.width = 200 * ratio;
   *
   * // For better performance when setting both width and height
   * sprite.setSize(300, 400); // Avoids recalculating bounds twice
   *
   * // Reset to original texture size
   * sprite.height = sprite.texture.orig.height;
   * ```
   */
  get height() {
    return Math.abs(this.scale.y) * this._texture.orig.height;
  }
  set height(t) {
    this._setHeight(t, this._texture.orig.height), this._height = t;
  }
  /**
   * Retrieves the size of the Sprite as a [Size]{@link Size} object based on the texture dimensions and scale.
   * This is faster than getting width and height separately as it only calculates the bounds once.
   * @example
   * ```ts
   * // Basic size retrieval
   * const sprite = new Sprite(Texture.from('sprite.png'));
   * const size = sprite.getSize();
   * console.log(`Size: ${size.width}x${size.height}`);
   *
   * // Reuse existing size object
   * const reuseSize = { width: 0, height: 0 };
   * sprite.getSize(reuseSize);
   * ```
   * @param out - Optional object to store the size in, to avoid allocating a new object
   * @returns The size of the Sprite
   * @see {@link Sprite#width} For getting just the width
   * @see {@link Sprite#height} For getting just the height
   * @see {@link Sprite#setSize} For setting both width and height
   */
  getSize(t) {
    return t || (t = {}), t.width = Math.abs(this.scale.x) * this._texture.orig.width, t.height = Math.abs(this.scale.y) * this._texture.orig.height, t;
  }
  /**
   * Sets the size of the Sprite to the specified width and height.
   * This is faster than setting width and height separately as it only recalculates bounds once.
   * @example
   * ```ts
   * // Basic size setting
   * const sprite = new Sprite(Texture.from('sprite.png'));
   * sprite.setSize(100, 200); // Width: 100, Height: 200
   *
   * // Set uniform size
   * sprite.setSize(100); // Sets both width and height to 100
   *
   * // Set size with object
   * sprite.setSize({
   *     width: 200,
   *     height: 300
   * });
   *
   * // Reset to texture size
   * sprite.setSize(
   *     sprite.texture.orig.width,
   *     sprite.texture.orig.height
   * );
   * ```
   * @param value - This can be either a number or a {@link Size} object
   * @param height - The height to set. Defaults to the value of `width` if not provided
   * @see {@link Sprite#width} For setting width only
   * @see {@link Sprite#height} For setting height only
   * @see {@link Sprite#texture} For the source dimensions
   */
  setSize(t, e) {
    typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, this._texture.orig.width), e !== void 0 && this._setHeight(e, this._texture.orig.height);
  }
}
const sa = new ot();
function en(s, t, e) {
  const i = sa;
  s.measurable = !0, Wr(s, e, i), t.addBoundsMask(i), s.measurable = !1;
}
function sn(s, t, e) {
  const i = dt.get();
  s.measurable = !0;
  const r = q.get().identity(), n = rn(s, e, r);
  Kr(s, i, n), s.measurable = !1, t.addBoundsMask(i), q.return(r), dt.return(i);
}
function rn(s, t, e) {
  return s ? (s !== t && (rn(s.parent, t, e), s.updateLocalTransform(), e.append(s.localTransform)), e) : (J("Mask bounds, renderable is not inside the root container"), e);
}
class nn {
  constructor(t) {
    this.priority = 0, this.inverse = !1, this.channel = "red", this.pipe = "alphaMask", t != null && t.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t, this.renderMaskToTexture = !(t instanceof he), this.mask.renderable = this.renderMaskToTexture, this.mask.includeInBuild = !this.renderMaskToTexture, this.mask.measurable = !1;
  }
  reset() {
    this.mask !== null && (this.mask.measurable = !0, this.mask = null);
  }
  addBounds(t, e) {
    this.inverse || en(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    sn(this.mask, t, e);
  }
  containsPoint(t, e) {
    const i = this.mask;
    return e(i, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof he;
  }
}
nn.extension = I.MaskEffect;
class on {
  constructor(t) {
    this.priority = 0, this.pipe = "colorMask", t != null && t.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t;
  }
  destroy() {
  }
  static test(t) {
    return typeof t == "number";
  }
}
on.extension = I.MaskEffect;
class an {
  constructor(t) {
    this.priority = 0, this.pipe = "stencilMask", t != null && t.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t, this.mask.includeInBuild = !1, this.mask.measurable = !1;
  }
  reset() {
    this.mask !== null && (this.mask.measurable = !0, this.mask.includeInBuild = !0, this.mask = null);
  }
  addBounds(t, e) {
    en(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    sn(this.mask, t, e);
  }
  containsPoint(t, e) {
    const i = this.mask;
    return e(i, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof yt;
  }
}
an.extension = I.MaskEffect;
const ia = {
  createCanvas: (s, t) => {
    const e = document.createElement("canvas");
    return e.width = s, e.height = t, e;
  },
  createImage: () => new Image(),
  getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
  getWebGLRenderingContext: () => WebGLRenderingContext,
  getNavigator: () => navigator,
  getBaseUrl: () => document.baseURI ?? window.location.href,
  getFontFaceSet: () => document.fonts,
  fetch: (s, t) => fetch(s, t),
  parseXML: (s) => new DOMParser().parseFromString(s, "text/xml")
};
let ki = ia;
const _t = {
  /**
   * Returns the current adapter.
   * @returns {environment.Adapter} The current adapter.
   */
  get() {
    return ki;
  },
  /**
   * Sets the current adapter.
   * @param adapter - The new adapter.
   */
  set(s) {
    ki = s;
  }
};
class hn extends at {
  constructor(t) {
    t.resource || (t.resource = _t.get().createCanvas()), t.width || (t.width = t.resource.width, t.autoDensity || (t.width /= t.resolution)), t.height || (t.height = t.resource.height, t.autoDensity || (t.height /= t.resolution)), super(t), this.uploadMethodId = "image", this.autoDensity = t.autoDensity, this.resizeCanvas(), this.transparent = !!t.transparent;
  }
  resizeCanvas() {
    this.autoDensity && "style" in this.resource && (this.resource.style.width = `${this.width}px`, this.resource.style.height = `${this.height}px`), (this.resource.width !== this.pixelWidth || this.resource.height !== this.pixelHeight) && (this.resource.width = this.pixelWidth, this.resource.height = this.pixelHeight);
  }
  resize(t = this.width, e = this.height, i = this._resolution) {
    const r = super.resize(t, e, i);
    return r && this.resizeCanvas(), r;
  }
  static test(t) {
    return globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement || globalThis.OffscreenCanvas && t instanceof OffscreenCanvas;
  }
  /**
   * Returns the 2D rendering context for the canvas.
   * Caches the context after creating it.
   * @returns The 2D rendering context of the canvas.
   */
  get context2D() {
    return this._context2D || (this._context2D = this.resource.getContext("2d"));
  }
}
hn.extension = I.TextureSource;
class De extends at {
  constructor(t) {
    super(t), this.uploadMethodId = "image", this.autoGarbageCollect = !0;
  }
  static test(t) {
    return globalThis.HTMLImageElement && t instanceof HTMLImageElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap || globalThis.VideoFrame && t instanceof VideoFrame;
  }
}
De.extension = I.TextureSource;
var Le = /* @__PURE__ */ ((s) => (s[s.INTERACTION = 50] = "INTERACTION", s[s.HIGH = 25] = "HIGH", s[s.NORMAL = 0] = "NORMAL", s[s.LOW = -25] = "LOW", s[s.UTILITY = -50] = "UTILITY", s))(Le || {});
class ss {
  /**
   * Constructor
   * @private
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param priority - The priority for emitting
   * @param once - If the handler should fire once
   */
  constructor(t, e = null, i = 0, r = !1) {
    this.next = null, this.previous = null, this._destroyed = !1, this._fn = t, this._context = e, this.priority = i, this._once = r;
  }
  /**
   * Simple compare function to figure out if a function and context match.
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @returns `true` if the listener match the arguments
   */
  match(t, e = null) {
    return this._fn === t && this._context === e;
  }
  /**
   * Emit by calling the current function.
   * @param ticker - The ticker emitting.
   * @returns Next ticker
   */
  emit(t) {
    this._fn && (this._context ? this._fn.call(this._context, t) : this._fn(t));
    const e = this.next;
    return this._once && this.destroy(!0), this._destroyed && (this.next = null), e;
  }
  /**
   * Connect to the list.
   * @param previous - Input node, previous listener
   */
  connect(t) {
    this.previous = t, t.next && (t.next.previous = this), this.next = t.next, t.next = this;
  }
  /**
   * Destroy and don't use after this.
   * @param hard - `true` to remove the `next` reference, this
   *        is considered a hard destroy. Soft destroy maintains the next reference.
   * @returns The listener to redirect while emitting or removing.
   */
  destroy(t = !1) {
    this._destroyed = !0, this._fn = null, this._context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
    const e = this.next;
    return this.next = t ? null : e, this.previous = null, e;
  }
}
const ln = class Q {
  constructor() {
    this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new ss(null, null, 1 / 0), this.deltaMS = 1 / Q.targetFPMS, this.elapsedMS = 1 / Q.targetFPMS, this._tick = (t) => {
      this._requestId = null, this.started && (this.update(t), this.started && this._requestId === null && this._head.next && (this._requestId = requestAnimationFrame(this._tick)));
    };
  }
  /**
   * Conditionally requests a new animation frame.
   * If a frame has not already been requested, and if the internal
   * emitter has listeners, a new frame is requested.
   */
  _requestIfNeeded() {
    this._requestId === null && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
  }
  /** Conditionally cancels a pending animation frame. */
  _cancelIfNeeded() {
    this._requestId !== null && (cancelAnimationFrame(this._requestId), this._requestId = null);
  }
  /**
   * Conditionally requests a new animation frame.
   * If the ticker has been started it checks if a frame has not already
   * been requested, and if the internal emitter has listeners. If these
   * conditions are met, a new frame is requested. If the ticker has not
   * been started, but autoStart is `true`, then the ticker starts now,
   * and continues with the previous conditions to request a new frame.
   */
  _startIfPossible() {
    this.started ? this._requestIfNeeded() : this.autoStart && this.start();
  }
  /**
   * Register a handler for tick events.
   * @param fn - The listener function to add. Receives the Ticker instance as parameter
   * @param context - The context for the listener
   * @param priority - The priority of the listener
   * @example
   * ```ts
   * // Access time properties through the ticker parameter
   * ticker.add((ticker) => {
   *     // Use deltaTime (dimensionless scalar) for frame-independent animations
   *     sprite.rotation += 0.1 * ticker.deltaTime;
   *
   *     // Use deltaMS (milliseconds) for time-based calculations
   *     const progress = ticker.deltaMS / animationDuration;
   *
   *     // Use elapsedMS for raw timing measurements
   *     console.log(`Raw frame time: ${ticker.elapsedMS}ms`);
   * });
   * ```
   */
  add(t, e, i = Le.NORMAL) {
    return this._addListener(new ss(t, e, i));
  }
  /**
   * Add a handler for the tick event which is only executed once on the next frame.
   * @example
   * ```ts
   * // Basic one-time update
   * ticker.addOnce(() => {
   *     console.log('Runs next frame only');
   * });
   *
   * // With specific context
   * const game = {
   *     init(ticker) {
   *         this.loadResources();
   *         console.log('Game initialized');
   *     }
   * };
   * ticker.addOnce(game.init, game);
   *
   * // With priority
   * ticker.addOnce(
   *     () => {
   *         // High priority one-time setup
   *         physics.init();
   *     },
   *     undefined,
   *     UPDATE_PRIORITY.HIGH
   * );
   * ```
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param priority - The priority for emitting (default: UPDATE_PRIORITY.NORMAL)
   * @returns This instance of a ticker
   * @see {@link Ticker#add} For continuous updates
   * @see {@link Ticker#remove} For removing handlers
   */
  addOnce(t, e, i = Le.NORMAL) {
    return this._addListener(new ss(t, e, i, !0));
  }
  /**
   * Internally adds the event handler so that it can be sorted by priority.
   * Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
   * before the rendering.
   * @private
   * @param listener - Current listener being added.
   * @returns This instance of a ticker
   */
  _addListener(t) {
    let e = this._head.next, i = this._head;
    if (!e)
      t.connect(i);
    else {
      for (; e; ) {
        if (t.priority > e.priority) {
          t.connect(i);
          break;
        }
        i = e, e = e.next;
      }
      t.previous || t.connect(i);
    }
    return this._startIfPossible(), this;
  }
  /**
   * Removes any handlers matching the function and context parameters.
   * If no handlers are left after removing, then it cancels the animation frame.
   * @example
   * ```ts
   * // Basic removal
   * const onTick = () => {
   *     sprite.rotation += 0.1;
   * };
   * ticker.add(onTick);
   * ticker.remove(onTick);
   *
   * // Remove with context
   * const game = {
   *     update(ticker) {
   *         this.physics.update(ticker.deltaTime);
   *     }
   * };
   * ticker.add(game.update, game);
   * ticker.remove(game.update, game);
   *
   * // Remove all matching handlers
   * // (if same function was added multiple times)
   * ticker.add(onTick);
   * ticker.add(onTick);
   * ticker.remove(onTick); // Removes all instances
   * ```
   * @param fn - The listener function to be removed
   * @param context - The listener context to be removed
   * @returns This instance of a ticker
   * @see {@link Ticker#add} For adding handlers
   * @see {@link Ticker#addOnce} For one-time handlers
   */
  remove(t, e) {
    let i = this._head.next;
    for (; i; )
      i.match(t, e) ? i = i.destroy() : i = i.next;
    return this._head.next || this._cancelIfNeeded(), this;
  }
  /**
   * The number of listeners on this ticker, calculated by walking through linked list.
   * @example
   * ```ts
   * // Check number of active listeners
   * const ticker = new Ticker();
   * console.log(ticker.count); // 0
   *
   * // Add some listeners
   * ticker.add(() => {});
   * ticker.add(() => {});
   * console.log(ticker.count); // 2
   *
   * // Check after cleanup
   * ticker.destroy();
   * console.log(ticker.count); // 0
   * ```
   * @readonly
   * @see {@link Ticker#add} For adding listeners
   * @see {@link Ticker#remove} For removing listeners
   */
  get count() {
    if (!this._head)
      return 0;
    let t = 0, e = this._head;
    for (; e = e.next; )
      t++;
    return t;
  }
  /**
   * Starts the ticker. If the ticker has listeners a new animation frame is requested at this point.
   * @example
   * ```ts
   * // Basic manual start
   * const ticker = new Ticker();
   * ticker.add(() => {
   *     // Animation code here
   * });
   * ticker.start();
   * ```
   * @see {@link Ticker#stop} For stopping the ticker
   * @see {@link Ticker#autoStart} For automatic starting
   * @see {@link Ticker#started} For checking ticker state
   */
  start() {
    this.started || (this.started = !0, this._requestIfNeeded());
  }
  /**
   * Stops the ticker. If the ticker has requested an animation frame it is canceled at this point.
   * @example
   * ```ts
   * // Basic stop
   * const ticker = new Ticker();
   * ticker.stop();
   * ```
   * @see {@link Ticker#start} For starting the ticker
   * @see {@link Ticker#started} For checking ticker state
   * @see {@link Ticker#destroy} For cleaning up the ticker
   */
  stop() {
    this.started && (this.started = !1, this._cancelIfNeeded());
  }
  /**
   * Destroy the ticker and don't use after this. Calling this method removes all references to internal events.
   * @example
   * ```ts
   * // Clean up with active listeners
   * const ticker = new Ticker();
   * ticker.add(() => {});
   * ticker.destroy(); // Removes all listeners
   * ```
   * @see {@link Ticker#stop} For stopping without destroying
   * @see {@link Ticker#remove} For removing specific listeners
   */
  destroy() {
    if (!this._protected) {
      this.stop();
      let t = this._head.next;
      for (; t; )
        t = t.destroy(!0);
      this._head.destroy(), this._head = null;
    }
  }
  /**
   * Triggers an update.
   *
   * An update entails setting the
   * current {@link Ticker#elapsedMS|elapsedMS},
   * the current {@link Ticker#deltaTime|deltaTime},
   * invoking all listeners with current deltaTime,
   * and then finally setting {@link Ticker#lastTime|lastTime}
   * with the value of currentTime that was provided.
   *
   * This method will be called automatically by animation
   * frame callbacks if the ticker instance has been started
   * and listeners are added.
   * @example
   * ```ts
   * // Basic manual update
   * const ticker = new Ticker();
   * ticker.update(performance.now());
   * ```
   * @param currentTime - The current time of execution (defaults to performance.now())
   * @see {@link Ticker#deltaTime} For frame delta value
   * @see {@link Ticker#elapsedMS} For raw elapsed time
   */
  update(t = performance.now()) {
    let e;
    if (t > this.lastTime) {
      if (e = this.elapsedMS = t - this.lastTime, e > this._maxElapsedMS && (e = this._maxElapsedMS), e *= this.speed, this._minElapsedMS) {
        const n = t - this._lastFrame | 0;
        if (n < this._minElapsedMS)
          return;
        this._lastFrame = t - n % this._minElapsedMS;
      }
      this.deltaMS = e, this.deltaTime = this.deltaMS * Q.targetFPMS;
      const i = this._head;
      let r = i.next;
      for (; r; )
        r = r.emit(this);
      i.next || this._cancelIfNeeded();
    } else
      this.deltaTime = this.deltaMS = this.elapsedMS = 0;
    this.lastTime = t;
  }
  /**
   * The frames per second at which this ticker is running.
   * The default is approximately 60 in most modern browsers.
   * > [!NOTE] This does not factor in the value of
   * > {@link Ticker#speed|speed}, which is specific
   * > to scaling {@link Ticker#deltaTime|deltaTime}.
   * @example
   * ```ts
   * // Basic FPS monitoring
   * ticker.add(() => {
   *     console.log(`Current FPS: ${Math.round(ticker.FPS)}`);
   * });
   * ```
   * @readonly
   */
  get FPS() {
    return 1e3 / this.elapsedMS;
  }
  /**
   * Manages the maximum amount of milliseconds allowed to
   * elapse between invoking {@link Ticker#update|update}.
   *
   * This value is used to cap {@link Ticker#deltaTime|deltaTime},
   * but does not effect the measured value of {@link Ticker#FPS|FPS}.
   *
   * When setting this property it is clamped to a value between
   * `0` and `Ticker.targetFPMS * 1000` (typically 60).
   *
   * If `maxFPS` is currently set (non-zero) and `minFPS` is set above it,
   * `maxFPS` is automatically raised to match. This keeps the two limits consistent.
   * @example
   * ```ts
   * // Set minimum acceptable frame rate
   * const ticker = new Ticker();
   * ticker.minFPS = 30; // Never go below 30 FPS
   *
   * // Use with maxFPS for frame rate clamping
   * ticker.minFPS = 30;
   * ticker.maxFPS = 60;
   *
   * // minFPS above maxFPS pushes maxFPS up
   * ticker.minFPS = 50; // maxFPS is raised to 50
   * ```
   * @default 10
   */
  get minFPS() {
    return 1e3 / this._maxElapsedMS;
  }
  set minFPS(t) {
    const e = Math.min(Math.max(0, t) / 1e3, Q.targetFPMS);
    this._maxElapsedMS = 1 / e, this._minElapsedMS && t > this.maxFPS && (this.maxFPS = t);
  }
  /**
   * Manages the minimum amount of milliseconds required to
   * elapse between invoking {@link Ticker#update|update}.
   *
   * This will effect the measured value of {@link Ticker#FPS|FPS}.
   *
   * If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
   * Otherwise it will be at least `minFPS`.
   *
   * If `maxFPS` is set below the current `minFPS`, `minFPS` is automatically lowered to match.
   * This keeps the two limits consistent.
   * @example
   * ```ts
   * // Cap the frame rate
   * const ticker = new Ticker();
   * ticker.maxFPS = 60; // Never go above 60 FPS
   *
   * // Use with minFPS for frame rate clamping
   * ticker.minFPS = 30;
   * ticker.maxFPS = 60;
   *
   * // maxFPS below minFPS pushes minFPS down
   * ticker.maxFPS = 20; // minFPS is now also 20
   * ```
   * @default 0
   */
  get maxFPS() {
    return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0;
  }
  set maxFPS(t) {
    t === 0 ? this._minElapsedMS = 0 : (t < this.minFPS && (this.minFPS = t), this._minElapsedMS = 1 / (t / 1e3));
  }
  /**
   * The shared ticker instance used by {@link AnimatedSprite} and by
   * {@link VideoSource} to update animation frames / video textures.
   *
   * It may also be used by {@link Application} if created with the `sharedTicker` option property set to true.
   *
   * The property {@link Ticker#autoStart|autoStart} is set to `true` for this instance.
   * Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
   * @example
   * import { Ticker } from 'pixi.js';
   *
   * const ticker = Ticker.shared;
   * // Set this to prevent starting this ticker when listeners are added.
   * // By default this is true only for the Ticker.shared instance.
   * ticker.autoStart = false;
   *
   * // FYI, call this to ensure the ticker is stopped. It should be stopped
   * // if you have not attempted to render anything yet.
   * ticker.stop();
   *
   * // Call this when you are ready for a running shared ticker.
   * ticker.start();
   * @example
   * import { autoDetectRenderer, Container } from 'pixi.js';
   *
   * // You may use the shared ticker to render...
   * const renderer = autoDetectRenderer();
   * const stage = new Container();
   * document.body.appendChild(renderer.view);
   * ticker.add((time) => renderer.render(stage));
   *
   * // Or you can just update it manually.
   * ticker.autoStart = false;
   * ticker.stop();
   * const animate = (time) => {
   *     ticker.update(time);
   *     renderer.render(stage);
   *     requestAnimationFrame(animate);
   * };
   * animate(performance.now());
   * @type {Ticker}
   * @readonly
   */
  static get shared() {
    if (!Q._shared) {
      const t = Q._shared = new Q();
      t.autoStart = !0, t._protected = !0;
    }
    return Q._shared;
  }
  /**
   * The system ticker instance used by {@link PrepareBase} for core timing
   * functionality that shouldn't usually need to be paused, unlike the `shared`
   * ticker which drives visual animations and rendering which may want to be paused.
   *
   * The property {@link Ticker#autoStart|autoStart} is set to `true` for this instance.
   * @type {Ticker}
   * @readonly
   * @advanced
   */
  static get system() {
    if (!Q._system) {
      const t = Q._system = new Q();
      t.autoStart = !0, t._protected = !0;
    }
    return Q._system;
  }
};
ln.targetFPMS = 0.06;
let zt = ln, is;
async function ra() {
  return is ?? (is = (async () => {
    var o;
    const t = _t.get().createCanvas(1, 1).getContext("webgl");
    if (!t)
      return "premultiply-alpha-on-upload";
    const e = await new Promise((a) => {
      const h = document.createElement("video");
      h.onloadeddata = () => a(h), h.onerror = () => a(null), h.autoplay = !1, h.crossOrigin = "anonymous", h.preload = "auto", h.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=", h.load();
    });
    if (!e)
      return "premultiply-alpha-on-upload";
    const i = t.createTexture();
    t.bindTexture(t.TEXTURE_2D, i);
    const r = t.createFramebuffer();
    t.bindFramebuffer(t.FRAMEBUFFER, r), t.framebufferTexture2D(
      t.FRAMEBUFFER,
      t.COLOR_ATTACHMENT0,
      t.TEXTURE_2D,
      i,
      0
    ), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, t.NONE), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e);
    const n = new Uint8Array(4);
    return t.readPixels(0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, n), t.deleteFramebuffer(r), t.deleteTexture(i), (o = t.getExtension("WEBGL_lose_context")) == null || o.loseContext(), n[0] <= n[3] ? "premultiplied-alpha" : "premultiply-alpha-on-upload";
  })()), is;
}
const Ne = class cn extends at {
  constructor(t) {
    super(t), this.isReady = !1, this.uploadMethodId = "video", t = {
      ...cn.defaultOptions,
      ...t
    }, this._autoUpdate = !0, this._isConnectedToTicker = !1, this._updateFPS = t.updateFPS || 0, this._msToNextUpdate = 0, this.autoPlay = t.autoPlay !== !1, this.alphaMode = t.alphaMode ?? "premultiply-alpha-on-upload", this._videoFrameRequestCallback = this._videoFrameRequestCallback.bind(this), this._videoFrameRequestCallbackHandle = null, this._load = null, this._resolve = null, this._reject = null, this._onCanPlay = this._onCanPlay.bind(this), this._onCanPlayThrough = this._onCanPlayThrough.bind(this), this._onError = this._onError.bind(this), this._onPlayStart = this._onPlayStart.bind(this), this._onPlayStop = this._onPlayStop.bind(this), this._onSeeked = this._onSeeked.bind(this), this._onLoadedMetadata = this._onLoadedMetadata.bind(this), t.autoLoad !== !1 && this.load();
  }
  /** Update the video frame if the source is not destroyed and meets certain conditions. */
  updateFrame() {
    if (!this.destroyed) {
      if (this._updateFPS) {
        const t = zt.shared.elapsedMS * this.resource.playbackRate;
        this._msToNextUpdate = Math.floor(this._msToNextUpdate - t);
      }
      (!this._updateFPS || this._msToNextUpdate <= 0) && (this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0), this.isValid && this.update();
    }
  }
  /** Callback to update the video frame and potentially request the next frame update. */
  _videoFrameRequestCallback() {
    this.updateFrame(), this.destroyed ? this._videoFrameRequestCallbackHandle = null : this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    );
  }
  /**
   * Checks if the resource has valid dimensions.
   * @returns {boolean} True if width and height are set, otherwise false.
   */
  get isValid() {
    return !!this.resource.videoWidth && !!this.resource.videoHeight;
  }
  /**
   * Start preloading the video resource.
   * @returns {Promise<this>} Handle the validate event
   */
  async load() {
    if (this._load)
      return this._load;
    const t = this.resource, e = this.options;
    return (t.readyState === t.HAVE_ENOUGH_DATA || t.readyState === t.HAVE_FUTURE_DATA) && t.width && t.height && (t.complete = !0), t.addEventListener("play", this._onPlayStart), t.addEventListener("pause", this._onPlayStop), t.addEventListener("seeked", this._onSeeked), this._isSourceReady() ? this._mediaReady() : (e.preload || t.addEventListener("canplay", this._onCanPlay), t.addEventListener("canplaythrough", this._onCanPlayThrough), t.addEventListener("error", this._onError, !0)), this.isValid || t.addEventListener("loadedmetadata", this._onLoadedMetadata), this.alphaMode = await ra(), this._load = new Promise((i, r) => {
      this.isValid ? i(this) : (this._resolve = i, this._reject = r, e.preloadTimeoutMs !== void 0 && (this._preloadTimeout = setTimeout(() => {
        this._onError(new ErrorEvent(`Preload exceeded timeout of ${e.preloadTimeoutMs}ms`));
      })), t.load());
    }), this._load;
  }
  /**
   * Handle video error events.
   * @param event - The error event
   */
  _onError(t) {
    this.resource.removeEventListener("error", this._onError, !0), this.emit("error", t), this._reject && (this._reject(t), this._reject = null, this._resolve = null);
  }
  /**
   * Checks if the underlying source is playing.
   * @returns True if playing.
   */
  _isSourcePlaying() {
    const t = this.resource;
    return !t.paused && !t.ended;
  }
  /**
   * Checks if the underlying source is ready for playing.
   * @returns True if ready.
   */
  _isSourceReady() {
    return this.resource.readyState > 2;
  }
  /** Runs the update loop when the video is ready to play. */
  _onPlayStart() {
    this._configureAutoUpdate();
  }
  /** Stops the update loop when a pause event is triggered. */
  _onPlayStop() {
    this._configureAutoUpdate();
  }
  /** Handles behavior when the video completes seeking to the current playback position. */
  _onSeeked() {
    this._autoUpdate && !this._isSourcePlaying() && (this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0);
  }
  /** When intrinsic size becomes known after play / canplay (common with MediaStream). */
  _onLoadedMetadata() {
    this.isValid && this._mediaReady();
  }
  _onCanPlay() {
    this.resource.removeEventListener("canplay", this._onCanPlay), this._mediaReady();
  }
  _onCanPlayThrough() {
    this.resource.removeEventListener("canplaythrough", this._onCanPlayThrough), this._preloadTimeout && (clearTimeout(this._preloadTimeout), this._preloadTimeout = void 0), this._mediaReady();
  }
  /** Fired when the video is loaded and ready to play. */
  _mediaReady() {
    const t = this.resource;
    this.isValid && (this.isReady = !0, this.resize(t.videoWidth, t.videoHeight)), this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0, this._resolve && this.isValid && (this._resolve(this), this._resolve = null, this._reject = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && this.resource.play();
  }
  /** Cleans up resources and event listeners associated with this texture. */
  destroy() {
    this._configureAutoUpdate();
    const t = this.resource;
    t && (t.removeEventListener("play", this._onPlayStart), t.removeEventListener("pause", this._onPlayStop), t.removeEventListener("seeked", this._onSeeked), t.removeEventListener("canplay", this._onCanPlay), t.removeEventListener("canplaythrough", this._onCanPlayThrough), t.removeEventListener("loadedmetadata", this._onLoadedMetadata), t.removeEventListener("error", this._onError, !0), t.pause(), t.src = "", t.load()), super.destroy();
  }
  /** Should the base texture automatically update itself, set to true by default. */
  get autoUpdate() {
    return this._autoUpdate;
  }
  set autoUpdate(t) {
    t !== this._autoUpdate && (this._autoUpdate = t, this._configureAutoUpdate());
  }
  /**
   * How many times a second to update the texture from the video.
   * Leave at 0 to update at every render.
   * A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
   */
  get updateFPS() {
    return this._updateFPS;
  }
  set updateFPS(t) {
    t !== this._updateFPS && (this._updateFPS = t, this._configureAutoUpdate());
  }
  /**
   * Configures the updating mechanism based on the current state and settings.
   *
   * This method decides between using the browser's native video frame callback or a custom ticker
   * for updating the video frame. It ensures optimal performance and responsiveness
   * based on the video's state, playback status, and the desired frames-per-second setting.
   *
   * - If `_autoUpdate` is enabled and the video source is playing:
   *   - It will prefer the native video frame callback if available and no specific FPS is set.
   *   - Otherwise, it will use a custom ticker for manual updates.
   * - If `_autoUpdate` is disabled or the video isn't playing, any active update mechanisms are halted.
   */
  _configureAutoUpdate() {
    this._autoUpdate && this._isSourcePlaying() ? !this._updateFPS && this.resource.requestVideoFrameCallback ? (this._isConnectedToTicker && (zt.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0), this._videoFrameRequestCallbackHandle === null && (this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    ))) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker || (zt.shared.add(this.updateFrame, this), this._isConnectedToTicker = !0, this._msToNextUpdate = 0)) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker && (zt.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0));
  }
  static test(t) {
    return globalThis.HTMLVideoElement && t instanceof HTMLVideoElement;
  }
};
Ne.extension = I.TextureSource;
Ne.defaultOptions = {
  ...at.defaultOptions,
  /** If true, the video will start loading immediately. */
  autoLoad: !0,
  /** If true, the video will start playing as soon as it is loaded. */
  autoPlay: !0,
  /** The number of times a second to update the texture from the video. Leave at 0 to update at every render. */
  updateFPS: 0,
  /** If true, the video will be loaded with the `crossorigin` attribute. */
  crossorigin: !0,
  /** If true, the video will loop when it ends. */
  loop: !1,
  /** If true, the video will be muted. */
  muted: !0,
  /** If true, the video will play inline. */
  playsinline: !0,
  /** If true, the video will be preloaded. */
  preload: !1
};
Ne.MIME_TYPES = {
  ogv: "video/ogg",
  mov: "video/quicktime",
  m4v: "video/mp4"
};
let na = Ne;
const Dt = (s, t, e = !1) => (Array.isArray(s) || (s = [s]), t ? s.map((i) => typeof i == "string" || e ? t(i) : i) : s);
class oa {
  constructor() {
    this._parsers = [], this._cache = /* @__PURE__ */ new Map(), this._cacheMap = /* @__PURE__ */ new Map();
  }
  /** Clear all entries. */
  reset() {
    this._cacheMap.clear(), this._cache.clear();
  }
  /**
   * Check if the key exists
   * @param key - The key to check
   */
  has(t) {
    return this._cache.has(t);
  }
  /**
   * Fetch entry by key
   * @param key - The key of the entry to get
   */
  get(t) {
    const e = this._cache.get(t);
    return e || J(`[Assets] Asset id ${t} was not found in the Cache`), e;
  }
  /**
   * Set a value by key or keys name
   * @param key - The key or keys to set
   * @param value - The value to store in the cache or from which cacheable assets will be derived.
   */
  set(t, e) {
    const i = Dt(t);
    let r;
    for (let h = 0; h < this.parsers.length; h++) {
      const l = this.parsers[h];
      if (l.test(e)) {
        r = l.getCacheableAssets(i, e);
        break;
      }
    }
    const n = new Map(Object.entries(r || {}));
    r || i.forEach((h) => {
      n.set(h, e);
    });
    const o = [...n.keys()], a = {
      cacheKeys: o,
      keys: i
    };
    i.forEach((h) => {
      this._cacheMap.set(h, a);
    }), o.forEach((h) => {
      const l = r ? r[h] : e;
      this._cache.has(h) && this._cache.get(h) !== l && J("[Cache] already has key:", h), this._cache.set(h, n.get(h));
    });
  }
  /**
   * Remove entry by key
   *
   * This function will also remove any associated alias from the cache also.
   * @param key - The key of the entry to remove
   */
  remove(t) {
    if (!this._cacheMap.has(t)) {
      J(`[Assets] Asset id ${t} was not found in the Cache`);
      return;
    }
    const e = this._cacheMap.get(t);
    e.cacheKeys.forEach((r) => {
      this._cache.delete(r);
    }), e.keys.forEach((r) => {
      this._cacheMap.delete(r);
    });
  }
  /**
   * All loader parsers registered
   * @advanced
   */
  get parsers() {
    return this._parsers;
  }
}
const Lt = new oa(), ks = [];
X.handleByList(I.TextureSource, ks);
function un(s = {}) {
  const t = s && s.resource, e = t ? s.resource : s, i = t ? s : { resource: s };
  for (let r = 0; r < ks.length; r++) {
    const n = ks[r];
    if (n.test(e))
      return new n(i);
  }
  throw new Error(`Could not find a source type for resource: ${i.resource}`);
}
function aa(s = {}, t = !1) {
  const e = s && s.resource, i = e ? s.resource : s, r = e ? s : { resource: s };
  if (!t && Lt.has(i))
    return Lt.get(i);
  const n = new L({ source: un(r) });
  return n.on("destroy", () => {
    Lt.has(i) && Lt.remove(i);
  }), t || Lt.set(i, n), n;
}
function ha(s, t = !1) {
  return typeof s == "string" ? Lt.get(s) : s instanceof at ? new L({ source: s }) : aa(s, t);
}
L.from = ha;
at.from = un;
X.add(nn, on, an, na, De, hn, Xs);
var dn = /* @__PURE__ */ ((s) => (s[s.Low = 0] = "Low", s[s.Normal = 1] = "Normal", s[s.High = 2] = "High", s))(dn || {});
function nt(s) {
  if (typeof s != "string")
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(s)}`);
}
function Wt(s) {
  return s.split("?")[0].split("#")[0];
}
function la(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function ca(s, t, e) {
  return s.replace(new RegExp(la(t), "g"), e);
}
function ua(s, t) {
  let e = "", i = 0, r = -1, n = 0, o = -1;
  for (let a = 0; a <= s.length; ++a) {
    if (a < s.length)
      o = s.charCodeAt(a);
    else {
      if (o === 47)
        break;
      o = 47;
    }
    if (o === 47) {
      if (!(r === a - 1 || n === 1)) if (r !== a - 1 && n === 2) {
        if (e.length < 2 || i !== 2 || e.charCodeAt(e.length - 1) !== 46 || e.charCodeAt(e.length - 2) !== 46) {
          if (e.length > 2) {
            const h = e.lastIndexOf("/");
            if (h !== e.length - 1) {
              h === -1 ? (e = "", i = 0) : (e = e.slice(0, h), i = e.length - 1 - e.lastIndexOf("/")), r = a, n = 0;
              continue;
            }
          } else if (e.length === 2 || e.length === 1) {
            e = "", i = 0, r = a, n = 0;
            continue;
          }
        }
      } else
        e.length > 0 ? e += `/${s.slice(r + 1, a)}` : e = s.slice(r + 1, a), i = a - r - 1;
      r = a, n = 0;
    } else o === 46 && n !== -1 ? ++n : n = -1;
  }
  return e;
}
const le = {
  /**
   * Converts a path to posix format.
   * @param path - The path to convert to posix
   * @example
   * ```ts
   * // Convert a Windows path to POSIX format
   * path.toPosix('C:\\Users\\User\\Documents\\file.txt');
   * // -> 'C:/Users/User/Documents/file.txt'
   * ```
   */
  toPosix(s) {
    return ca(s, "\\", "/");
  },
  /**
   * Checks if the path is a URL e.g. http://, https://
   * @param path - The path to check
   * @example
   * ```ts
   * // Check if a path is a URL
   * path.isUrl('http://www.example.com');
   * // -> true
   * path.isUrl('C:/Users/User/Documents/file.txt');
   * // -> false
   * ```
   */
  isUrl(s) {
    return /^https?:/.test(this.toPosix(s));
  },
  /**
   * Checks if the path is a data URL
   * @param path - The path to check
   * @example
   * ```ts
   * // Check if a path is a data URL
   * path.isDataUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...');
   * // -> true
   * ```
   */
  isDataUrl(s) {
    return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(s);
  },
  /**
   * Checks if the path is a blob URL
   * @param path - The path to check
   * @example
   * ```ts
   * // Check if a path is a blob URL
   * path.isBlobUrl('blob:http://www.example.com/12345678-1234-1234-1234-123456789012');
   * // -> true
   * ```
   */
  isBlobUrl(s) {
    return s.startsWith("blob:");
  },
  /**
   * Checks if the path has a protocol e.g. http://, https://, file:///, data:, blob:, C:/
   * This will return true for windows file paths
   * @param path - The path to check
   * @example
   * ```ts
   * // Check if a path has a protocol
   * path.hasProtocol('http://www.example.com');
   * // -> true
   * path.hasProtocol('C:/Users/User/Documents/file.txt');
   * // -> true
   * ```
   */
  hasProtocol(s) {
    return /^[^/:]+:/.test(this.toPosix(s));
  },
  /**
   * Returns the protocol of the path e.g. http://, https://, file:///, data:, blob:, C:/
   * @param path - The path to get the protocol from
   * @example
   * ```ts
   * // Get the protocol from a URL
   * path.getProtocol('http://www.example.com/path/to/resource');
   * // -> 'http://'
   * // Get the protocol from a file path
   * path.getProtocol('C:/Users/User/Documents/file.txt');
   * // -> 'C:/'
   * ```
   */
  getProtocol(s) {
    nt(s), s = this.toPosix(s);
    const t = /^file:\/\/\//.exec(s);
    if (t)
      return t[0];
    const e = /^[^/:]+:\/{0,2}/.exec(s);
    return e ? e[0] : "";
  },
  /**
   * Converts URL to an absolute path.
   * When loading from a Web Worker, we must use absolute paths.
   * If the URL is already absolute we return it as is
   * If it's not, we convert it
   * @param url - The URL to test
   * @param customBaseUrl - The base URL to use
   * @param customRootUrl - The root URL to use
   * @example
   * ```ts
   * // Convert a relative URL to an absolute path
   * path.toAbsolute('images/texture.png', 'http://example.com/assets/');
   * // -> 'http://example.com/assets/images/texture.png'
   * ```
   */
  toAbsolute(s, t, e) {
    if (nt(s), this.isDataUrl(s) || this.isBlobUrl(s)) return s;
    const i = Wt(this.toPosix(t ?? _t.get().getBaseUrl())), r = Wt(this.toPosix(e ?? this.rootname(i)));
    return s = this.toPosix(s), s.startsWith("/") ? le.join(r, s.slice(1)) : this.isAbsolute(s) ? s : this.join(i, s);
  },
  /**
   * Normalizes the given path, resolving '..' and '.' segments
   * @param path - The path to normalize
   * @example
   * ```ts
   * // Normalize a path with relative segments
   * path.normalize('http://www.example.com/foo/bar/../baz');
   * // -> 'http://www.example.com/foo/baz'
   * // Normalize a file path with relative segments
   * path.normalize('C:\\Users\\User\\Documents\\..\\file.txt');
   * // -> 'C:/Users/User/file.txt'
   * ```
   */
  normalize(s) {
    if (nt(s), s.length === 0) return ".";
    if (this.isDataUrl(s) || this.isBlobUrl(s)) return s;
    s = this.toPosix(s);
    let t = "";
    const e = s.startsWith("/");
    this.hasProtocol(s) && (t = this.rootname(s), s = s.slice(t.length));
    const i = s.endsWith("/");
    return s = ua(s), s.length > 0 && i && (s += "/"), e ? `/${s}` : t + s;
  },
  /**
   * Determines if path is an absolute path.
   * Absolute paths can be urls, data urls, or paths on disk
   * @param path - The path to test
   * @example
   * ```ts
   * // Check if a path is absolute
   * path.isAbsolute('http://www.example.com/foo/bar');
   * // -> true
   * path.isAbsolute('C:/Users/User/Documents/file.txt');
   * // -> true
   * ```
   */
  isAbsolute(s) {
    return nt(s), s = this.toPosix(s), this.hasProtocol(s) ? !0 : s.startsWith("/");
  },
  /**
   * Joins all given path segments together using the platform-specific separator as a delimiter,
   * then normalizes the resulting path
   * @param segments - The segments of the path to join
   * @example
   * ```ts
   * // Join multiple path segments
   * path.join('assets', 'images', 'sprite.png');
   * // -> 'assets/images/sprite.png'
   * // Join with relative segments
   * path.join('assets', 'images', '../textures', 'sprite.png');
   * // -> 'assets/textures/sprite.png'
   * ```
   */
  join(...s) {
    if (s.length === 0)
      return ".";
    let t;
    for (let e = 0; e < s.length; ++e) {
      const i = s[e];
      if (nt(i), i.length > 0)
        if (t === void 0) t = i;
        else {
          const r = s[e - 1] ?? "";
          this.joinExtensions.includes(this.extname(r).toLowerCase()) ? t += `/../${i}` : t += `/${i}`;
        }
    }
    return t === void 0 ? "." : this.normalize(t);
  },
  /**
   * Returns the directory name of a path
   * @param path - The path to parse
   * @example
   * ```ts
   * // Get the directory name of a path
   * path.dirname('http://www.example.com/foo/bar/baz.png');
   * // -> 'http://www.example.com/foo/bar'
   * // Get the directory name of a file path
   * path.dirname('C:/Users/User/Documents/file.txt');
   * // -> 'C:/Users/User/Documents'
   * ```
   */
  dirname(s) {
    if (nt(s), s.length === 0) return ".";
    s = this.toPosix(s);
    let t = s.charCodeAt(0);
    const e = t === 47;
    let i = -1, r = !0;
    const n = this.getProtocol(s), o = s;
    s = s.slice(n.length);
    for (let a = s.length - 1; a >= 1; --a)
      if (t = s.charCodeAt(a), t === 47) {
        if (!r) {
          i = a;
          break;
        }
      } else
        r = !1;
    return i === -1 ? e ? "/" : this.isUrl(o) ? n + s : n : e && i === 1 ? "//" : n + s.slice(0, i);
  },
  /**
   * Returns the root of the path e.g. /, C:/, file:///, http://domain.com/
   * @param path - The path to parse
   * @example
   * ```ts
   * // Get the root of a URL
   * path.rootname('http://www.example.com/foo/bar/baz.png');
   * // -> 'http://www.example.com/'
   * // Get the root of a file path
   * path.rootname('C:/Users/User/Documents/file.txt');
   * // -> 'C:/'
   * ```
   */
  rootname(s) {
    nt(s), s = this.toPosix(s);
    let t = "";
    if (s.startsWith("/") ? t = "/" : t = this.getProtocol(s), this.isUrl(s)) {
      const e = s.indexOf("/", t.length);
      e !== -1 ? t = s.slice(0, e) : t = s, t.endsWith("/") || (t += "/");
    }
    return t;
  },
  /**
   * Returns the last portion of a path
   * @param path - The path to test
   * @param ext - Optional extension to remove
   * @example
   * ```ts
   * // Get the basename of a URL
   * path.basename('http://www.example.com/foo/bar/baz.png');
   * // -> 'baz.png'
   * // Get the basename of a file path
   * path.basename('C:/Users/User/Documents/file.txt');
   * // -> 'file.txt'
   * ```
   */
  basename(s, t) {
    nt(s), t && nt(t), s = Wt(this.toPosix(s));
    let e = 0, i = -1, r = !0, n;
    if (t !== void 0 && t.length > 0 && t.length <= s.length) {
      if (t.length === s.length && t === s) return "";
      let o = t.length - 1, a = -1;
      for (n = s.length - 1; n >= 0; --n) {
        const h = s.charCodeAt(n);
        if (h === 47) {
          if (!r) {
            e = n + 1;
            break;
          }
        } else
          a === -1 && (r = !1, a = n + 1), o >= 0 && (h === t.charCodeAt(o) ? --o === -1 && (i = n) : (o = -1, i = a));
      }
      return e === i ? i = a : i === -1 && (i = s.length), s.slice(e, i);
    }
    for (n = s.length - 1; n >= 0; --n)
      if (s.charCodeAt(n) === 47) {
        if (!r) {
          e = n + 1;
          break;
        }
      } else i === -1 && (r = !1, i = n + 1);
    return i === -1 ? "" : s.slice(e, i);
  },
  /**
   * Returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last
   * portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than
   * the first character of the basename of path, an empty string is returned.
   * @param path - The path to parse
   * @example
   * ```ts
   * // Get the extension of a URL
   * path.extname('http://www.example.com/foo/bar/baz.png');
   * // -> '.png'
   * // Get the extension of a file path
   * path.extname('C:/Users/User/Documents/file.txt');
   * // -> '.txt'
   * ```
   */
  extname(s) {
    nt(s), s = Wt(this.toPosix(s));
    let t = -1, e = 0, i = -1, r = !0, n = 0;
    for (let o = s.length - 1; o >= 0; --o) {
      const a = s.charCodeAt(o);
      if (a === 47) {
        if (!r) {
          e = o + 1;
          break;
        }
        continue;
      }
      i === -1 && (r = !1, i = o + 1), a === 46 ? t === -1 ? t = o : n !== 1 && (n = 1) : t !== -1 && (n = -1);
    }
    return t === -1 || i === -1 || n === 0 || n === 1 && t === i - 1 && t === e + 1 ? "" : s.slice(t, i);
  },
  /**
   * Parses a path into an object containing the 'root', `dir`, `base`, `ext`, and `name` properties.
   * @param path - The path to parse
   * @example
   * ```ts
   * // Parse a URL
   * const parsed = path.parse('http://www.example.com/foo/bar/baz.png');
   * // -> {
   * //   root: 'http://www.example.com/',
   * //   dir: 'http://www.example.com/foo/bar',
   * //   base: 'baz.png',
   * //   ext: '.png',
   * //   name: 'baz'
   * // }
   * // Parse a file path
   * const parsedFile = path.parse('C:/Users/User/Documents/file.txt');
   * // -> {
   * //   root: 'C:/',
   * //   dir: 'C:/Users/User/Documents',
   * //   base: 'file.txt',
   * //   ext: '.txt',
   * //   name: 'file'
   * // }
   * ```
   */
  parse(s) {
    nt(s);
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (s.length === 0) return t;
    s = Wt(this.toPosix(s));
    let e = s.charCodeAt(0);
    const i = this.isAbsolute(s);
    let r;
    t.root = this.rootname(s), i || this.hasProtocol(s) ? r = 1 : r = 0;
    let n = -1, o = 0, a = -1, h = !0, l = s.length - 1, c = 0;
    for (; l >= r; --l) {
      if (e = s.charCodeAt(l), e === 47) {
        if (!h) {
          o = l + 1;
          break;
        }
        continue;
      }
      a === -1 && (h = !1, a = l + 1), e === 46 ? n === -1 ? n = l : c !== 1 && (c = 1) : n !== -1 && (c = -1);
    }
    return n === -1 || a === -1 || c === 0 || c === 1 && n === a - 1 && n === o + 1 ? a !== -1 && (o === 0 && i ? t.base = t.name = s.slice(1, a) : t.base = t.name = s.slice(o, a)) : (o === 0 && i ? (t.name = s.slice(1, n), t.base = s.slice(1, a)) : (t.name = s.slice(o, n), t.base = s.slice(o, a)), t.ext = s.slice(n, a)), t.dir = this.dirname(s), t;
  },
  sep: "/",
  delimiter: ":",
  joinExtensions: [".html"]
};
function fn(s, t, e, i, r) {
  const n = t[e];
  for (let o = 0; o < n.length; o++) {
    const a = n[o];
    e < t.length - 1 ? fn(s.replace(i[e], a), t, e + 1, i, r) : r.push(s.replace(i[e], a));
  }
}
function da(s) {
  const t = /\{(.*?)\}/g, e = s.match(t), i = [];
  if (e) {
    const r = [];
    e.forEach((n) => {
      const o = n.substring(1, n.length - 1).split(",");
      r.push(o);
    }), fn(s, r, 0, e, i);
  } else
    i.push(s);
  return i;
}
const Ii = (s) => !Array.isArray(s);
class pn {
  constructor() {
    this._defaultBundleIdentifierOptions = {
      connector: "-",
      createBundleAssetId: (t, e) => `${t}${this._bundleIdConnector}${e}`,
      extractAssetIdFromBundle: (t, e) => e.replace(`${t}${this._bundleIdConnector}`, "")
    }, this._bundleIdConnector = this._defaultBundleIdentifierOptions.connector, this._createBundleAssetId = this._defaultBundleIdentifierOptions.createBundleAssetId, this._extractAssetIdFromBundle = this._defaultBundleIdentifierOptions.extractAssetIdFromBundle, this._assetMap = {}, this._preferredOrder = [], this._parsers = [], this._resolverHash = {}, this._bundles = {};
  }
  /**
   * Override how the resolver deals with generating bundle ids.
   * must be called before any bundles are added
   * @param bundleIdentifier - the bundle identifier options
   */
  setBundleIdentifier(t) {
    if (this._bundleIdConnector = t.connector ?? this._bundleIdConnector, this._createBundleAssetId = t.createBundleAssetId ?? this._createBundleAssetId, this._extractAssetIdFromBundle = t.extractAssetIdFromBundle ?? this._extractAssetIdFromBundle, this._extractAssetIdFromBundle("foo", this._createBundleAssetId("foo", "bar")) !== "bar")
      throw new Error("[Resolver] GenerateBundleAssetId are not working correctly");
  }
  /**
   * Let the resolver know which assets you prefer to use when resolving assets.
   * Multiple prefer user defined rules can be added.
   * @example
   * resolver.prefer({
   *     // first look for something with the correct format, and then then correct resolution
   *     priority: ['format', 'resolution'],
   *     params:{
   *         format:'webp', // prefer webp images
   *         resolution: 2, // prefer a resolution of 2
   *     }
   * })
   * resolver.add('foo', ['bar@2x.webp', 'bar@2x.png', 'bar.webp', 'bar.png']);
   * resolver.resolveUrl('foo') // => 'bar@2x.webp'
   * @param preferOrders - the prefer options
   */
  prefer(...t) {
    t.forEach((e) => {
      this._preferredOrder.push(e), e.priority || (e.priority = Object.keys(e.params));
    }), this._resolverHash = {};
  }
  /**
   * Set the base path to prepend to all urls when resolving
   * @example
   * resolver.basePath = 'https://home.com/';
   * resolver.add('foo', 'bar.ong');
   * resolver.resolveUrl('foo', 'bar.png'); // => 'https://home.com/bar.png'
   * @param basePath - the base path to use
   */
  set basePath(t) {
    this._basePath = t;
  }
  get basePath() {
    return this._basePath;
  }
  /**
   * Set the root path for root-relative URLs. By default the `basePath`'s root is used. If no `basePath` is set, then the
   * default value for browsers is `window.location.origin`
   * @example
   * // Application hosted on https://home.com/some-path/index.html
   * resolver.basePath = 'https://home.com/some-path/';
   * resolver.rootPath = 'https://home.com/';
   * resolver.add('foo', '/bar.png');
   * resolver.resolveUrl('foo', '/bar.png'); // => 'https://home.com/bar.png'
   * @param rootPath - the root path to use
   */
  set rootPath(t) {
    this._rootPath = t;
  }
  get rootPath() {
    return this._rootPath;
  }
  /**
   * All the active URL parsers that help the parser to extract information and create
   * an asset object-based on parsing the URL itself.
   *
   * Can be added using the extensions API
   * @example
   * resolver.add('foo', [
   *     {
   *         resolution: 2,
   *         format: 'png',
   *         src: 'image@2x.png',
   *     },
   *     {
   *         resolution:1,
   *         format:'png',
   *         src: 'image.png',
   *     },
   * ]);
   *
   * // With a url parser the information such as resolution and file format could extracted from the url itself:
   * extensions.add({
   *     extension: ExtensionType.ResolveParser,
   *     test: loadTextures.test, // test if url ends in an image
   *     parse: (value: string) =>
   *     ({
   *         resolution: parseFloat(Resolver.RETINA_PREFIX.exec(value)?.[1] ?? '1'),
   *         format: value.split('.').pop(),
   *         src: value,
   *     }),
   * });
   *
   * // Now resolution and format can be extracted from the url
   * resolver.add('foo', [
   *     'image@2x.png',
   *     'image.png',
   * ]);
   */
  get parsers() {
    return this._parsers;
  }
  /** Used for testing, this resets the resolver to its initial state */
  reset() {
    this.setBundleIdentifier(this._defaultBundleIdentifierOptions), this._assetMap = {}, this._preferredOrder = [], this._resolverHash = {}, this._rootPath = null, this._basePath = null, this._manifest = null, this._bundles = {}, this._defaultSearchParams = null;
  }
  /**
   * Sets the default URL search parameters for the URL resolver. The urls can be specified as a string or an object.
   * @param searchParams - the default url parameters to append when resolving urls
   */
  setDefaultSearchParams(t) {
    if (typeof t == "string")
      this._defaultSearchParams = t;
    else {
      const e = t;
      this._defaultSearchParams = Object.keys(e).map((i) => `${encodeURIComponent(i)}=${encodeURIComponent(e[i])}`).join("&");
    }
  }
  /**
   * Returns the aliases for a given asset
   * @param asset - the asset to get the aliases for
   */
  getAlias(t) {
    const { alias: e, src: i } = t;
    return Dt(
      e || i,
      (n) => typeof n == "string" ? n : Array.isArray(n) ? n.map((o) => (o == null ? void 0 : o.src) ?? o) : n != null && n.src ? n.src : n,
      !0
    );
  }
  /**
   * Removes the specified alias for an asset.
   *
   * This only removes the alias mapping. It does **not** remove, unload, or destroy the
   * underlying asset. If the asset is already cached, it stays in memory until you call
   * `Assets.unload`.
   *
   * If `asset` is provided, the alias is only removed when the resolver's current mapping for
   * that alias matches the given `ResolvedAsset`. This lets you avoid accidentally removing an
   * alias that has been reassigned.
   *
   * Silently returns if the alias does not exist or the asset does not match.
   * @param alias - the alias to remove
   * @param asset - only remove the alias if it is currently assigned to this asset
   * @example
   * ```ts
   * resolver.add({ alias: 'hero', src: 'hero.png' });
   *
   * // Simple removal
   * resolver.removeAlias('hero');
   *
   * // Conditional removal — only if alias currently maps to a specific asset
   * const resolved = resolver.resolve('hero');
   * resolver.removeAlias('hero', resolved);
   * ```
   */
  removeAlias(t, e) {
    this._assetMap[t] && (e && e !== this._resolverHash[t] || (delete this._resolverHash[t], delete this._assetMap[t]));
  }
  /**
   * Add a manifest to the asset resolver. This is a nice way to add all the asset information in one go.
   * generally a manifest would be built using a tool.
   * @param manifest - the manifest to add to the resolver
   */
  addManifest(t) {
    this._manifest && J("[Resolver] Manifest already exists, this will be overwritten"), this._manifest = t, t.bundles.forEach((e) => {
      this.addBundle(e.name, e.assets);
    });
  }
  /**
   * This adds a bundle of assets in one go so that you can resolve them as a group.
   * For example you could add a bundle for each screen in you pixi app
   * @example
   * resolver.addBundle('animals', [
   *  { alias: 'bunny', src: 'bunny.png' },
   *  { alias: 'chicken', src: 'chicken.png' },
   *  { alias: 'thumper', src: 'thumper.png' },
   * ]);
   * // or
   * resolver.addBundle('animals', {
   *     bunny: 'bunny.png',
   *     chicken: 'chicken.png',
   *     thumper: 'thumper.png',
   * });
   *
   * const resolvedAssets = await resolver.resolveBundle('animals');
   * @param bundleId - The id of the bundle to add
   * @param assets - A record of the asset or assets that will be chosen from when loading via the specified key
   */
  addBundle(t, e) {
    const i = [];
    let r = e;
    Array.isArray(e) || (r = Object.entries(e).map(([n, o]) => typeof o == "string" || Array.isArray(o) ? { alias: n, src: o } : { alias: n, ...o })), r.forEach((n) => {
      const o = n.src, a = n.alias;
      let h;
      if (typeof a == "string") {
        const l = this._createBundleAssetId(t, a);
        i.push(l), h = [a, l];
      } else {
        const l = a.map((c) => this._createBundleAssetId(t, c));
        i.push(...l), h = [...a, ...l];
      }
      this.add({
        ...n,
        alias: h,
        src: o
      });
    }), this._bundles[t] = i;
  }
  /**
   * Tells the resolver what keys are associated with witch asset.
   * The most important thing the resolver does
   * @example
   * // Single key, single asset:
   * resolver.add({alias: 'foo', src: 'bar.png');
   * resolver.resolveUrl('foo') // => 'bar.png'
   *
   * // Multiple keys, single asset:
   * resolver.add({alias: ['foo', 'boo'], src: 'bar.png'});
   * resolver.resolveUrl('foo') // => 'bar.png'
   * resolver.resolveUrl('boo') // => 'bar.png'
   *
   * // Multiple keys, multiple assets:
   * resolver.add({alias: ['foo', 'boo'], src: ['bar.png', 'bar.webp']});
   * resolver.resolveUrl('foo') // => 'bar.png'
   *
   * // Add custom data attached to the resolver
   * Resolver.add({
   *     alias: 'bunnyBooBooSmooth',
   *     src: 'bunny{png,webp}',
   *     data: { scaleMode:SCALE_MODES.NEAREST }, // Base texture options
   * });
   *
   * resolver.resolve('bunnyBooBooSmooth') // => { src: 'bunny.png', data: { scaleMode: SCALE_MODES.NEAREST } }
   * @param aliases - the UnresolvedAsset or array of UnresolvedAssets to add to the resolver
   */
  add(t) {
    const e = [];
    Array.isArray(t) ? e.push(...t) : e.push(t);
    let i;
    i = (n) => {
      this.hasKey(n) && J(`[Resolver] already has key: ${n} overwriting`);
    }, Dt(e).forEach((n) => {
      const { src: o } = n;
      let {
        data: a,
        format: h,
        loadParser: l,
        parser: c
      } = n;
      const u = Dt(o).map((g) => typeof g == "string" ? da(g) : Array.isArray(g) ? g : [g]), f = this.getAlias(n);
      Array.isArray(f) ? f.forEach(i) : i(f);
      const d = [], p = (g) => {
        const m = this._parsers.find((x) => x.test(g));
        return {
          src: g,
          ...m == null ? void 0 : m.parse(g)
        };
      };
      u.forEach((g) => {
        g.forEach((m) => {
          let x = {};
          if (typeof m != "object" ? x = p(m) : (a = m.data ?? a, h = m.format ?? h, (m.loadParser || m.parser) && (l = m.loadParser ?? l, c = m.parser ?? c), x = {
            ...p(m.src),
            ...m
          }), !f)
            throw new Error(`[Resolver] alias is undefined for this asset: ${x.src}`);
          x = this._buildResolvedAsset(x, {
            aliases: f,
            data: a,
            format: h,
            loadParser: l,
            parser: c,
            progressSize: n.progressSize
          }), d.push(x);
        });
      }), f.forEach((g) => {
        this._assetMap[g] = d;
      });
    });
  }
  // TODO: this needs an overload like load did in Assets
  /**
   * If the resolver has had a manifest set via setManifest, this will return the assets urls for
   * a given bundleId or bundleIds.
   * @example
   * // Manifest Example
   * const manifest = {
   *     bundles: [
   *         {
   *             name: 'load-screen',
   *             assets: [
   *                 {
   *                     alias: 'background',
   *                     src: 'sunset.png',
   *                 },
   *                 {
   *                     alias: 'bar',
   *                     src: 'load-bar.{png,webp}',
   *                 },
   *             ],
   *         },
   *         {
   *             name: 'game-screen',
   *             assets: [
   *                 {
   *                     alias: 'character',
   *                     src: 'robot.png',
   *                 },
   *                 {
   *                     alias: 'enemy',
   *                     src: 'bad-guy.png',
   *                 },
   *             ],
   *         },
   *     ]
   * };
   *
   * resolver.setManifest(manifest);
   * const resolved = resolver.resolveBundle('load-screen');
   * @param bundleIds - The bundle ids to resolve
   * @returns All the bundles assets or a hash of assets for each bundle specified
   */
  resolveBundle(t) {
    const e = Ii(t);
    t = Dt(t);
    const i = {};
    return t.forEach((r) => {
      const n = this._bundles[r];
      if (n) {
        const o = this.resolve(n), a = {};
        for (const h in o) {
          const l = o[h];
          a[this._extractAssetIdFromBundle(r, h)] = l;
        }
        i[r] = a;
      }
    }), e ? i[t[0]] : i;
  }
  /**
   * Does exactly what resolve does, but returns just the URL rather than the whole asset object
   * @param key - The key or keys to resolve
   * @returns - The URLs associated with the key(s)
   */
  resolveUrl(t) {
    const e = this.resolve(t);
    if (typeof t != "string") {
      const i = {};
      for (const r in e)
        i[r] = e[r].src;
      return i;
    }
    return e.src;
  }
  resolve(t) {
    const e = Ii(t);
    t = Dt(t);
    const i = {};
    return t.forEach((r) => {
      if (!this._resolverHash[r])
        if (this._assetMap[r]) {
          let n = this._assetMap[r];
          const o = this._getPreferredOrder(n);
          o == null || o.priority.forEach((a) => {
            o.params[a].forEach((h) => {
              const l = n.filter((c) => c[a] ? c[a] === h : !1);
              l.length && (n = l);
            });
          }), this._resolverHash[r] = n[0];
        } else
          this._resolverHash[r] = this._buildResolvedAsset({
            alias: [r],
            src: r
          }, {});
      i[r] = this._resolverHash[r];
    }), e ? i[t[0]] : i;
  }
  /**
   * Checks if an asset with a given key exists in the resolver
   * @param key - The key of the asset
   */
  hasKey(t) {
    return !!this._assetMap[t];
  }
  /**
   * Checks if a bundle with the given key exists in the resolver
   * @param key - The key of the bundle
   */
  hasBundle(t) {
    return !!this._bundles[t];
  }
  /**
   * Internal function for figuring out what prefer criteria an asset should use.
   * @param assets
   */
  _getPreferredOrder(t) {
    for (let e = 0; e < t.length; e++) {
      const i = t[e], r = this._preferredOrder.find((n) => n.params.format.includes(i.format));
      if (r)
        return r;
    }
    return this._preferredOrder[0];
  }
  /**
   * Appends the default url parameters to the url
   * @param url - The url to append the default parameters to
   * @returns - The url with the default parameters appended
   */
  _appendDefaultSearchParams(t) {
    if (!this._defaultSearchParams) return t;
    const e = /\?/.test(t) ? "&" : "?";
    return `${t}${e}${this._defaultSearchParams}`;
  }
  _buildResolvedAsset(t, e) {
    const { aliases: i, data: r, loadParser: n, parser: o, format: a, progressSize: h } = e;
    return (this._basePath || this._rootPath) && (t.src = le.toAbsolute(t.src, this._basePath, this._rootPath)), t.alias = i ?? t.alias ?? [t.src], t.src = this._appendDefaultSearchParams(t.src), t.data = { ...r || {}, ...t.data }, t.loadParser = n ?? t.loadParser, t.parser = o ?? t.parser, t.format = a ?? t.format ?? fa(t.src), h !== void 0 && (t.progressSize = h), t;
  }
}
pn.RETINA_PREFIX = /@([0-9\.]+)x/;
function fa(s) {
  return s.split(".").pop().split("?").shift().split("#").shift();
}
const Ri = (s, t) => {
  const e = t.split("?")[1];
  return e && (s += `?${e}`), s;
}, mn = class ee {
  constructor(t, e) {
    this.linkedSheets = [];
    let i = t;
    (t == null ? void 0 : t.source) instanceof at && (i = {
      texture: t,
      data: e
    });
    const { texture: r, data: n, cachePrefix: o = "" } = i;
    this.cachePrefix = o, this._texture = r instanceof L ? r : null, this.textureSource = r.source, this.textures = {}, this.animations = {}, this.data = n;
    const a = parseFloat(n.meta.scale);
    a ? (this.resolution = a, r.source.resolution = this.resolution) : this.resolution = r.source._resolution, this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
  }
  /**
   * Parse spritesheet from loaded data. This is done asynchronously
   * to prevent creating too many Texture within a single process.
   */
  parse() {
    return new Promise((t) => {
      this._callback = t, this._batchIndex = 0, this._frameKeys.length <= ee.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
    });
  }
  /**
   * Parse spritesheet from loaded data. This is done synchronously
   * and is only suitable for smaller spritesheets (less than ~1000 frames)
   * or may cause too many Texture within a single process. However, synchronous parsing may be
   * more convenient since the called does not need to be asynchronous and is safe for
   * small-to-medium sized spritesheets.
   *
   * Other than being synchronous, `parseSync` is otherwise identical to `.parse()`.
   */
  parseSync() {
    return this._processFrames(0, !0), this._processAnimations(), this.textures;
  }
  /**
   * Process a batch of frames
   * @param initialFrameIndex - The index of frame to start.
   * @param processAll - if true will process all frames in a single batch, ignoring BATCH_SIZE - this
   * is used for synchronous parsing.
   */
  _processFrames(t, e = !1) {
    let i = t;
    const r = e ? 1 / 0 : ee.BATCH_SIZE;
    for (; i - t < r && i < this._frameKeys.length; ) {
      const n = this._frameKeys[i], o = this._frames[n], a = o.frame;
      if (a) {
        let h = null, l = null;
        const c = o.trimmed !== !1 && o.sourceSize ? o.sourceSize : o.frame, u = new Y(
          0,
          0,
          Math.floor(c.w) / this.resolution,
          Math.floor(c.h) / this.resolution
        );
        o.rotated ? h = new Y(
          Math.floor(a.x) / this.resolution,
          Math.floor(a.y) / this.resolution,
          Math.floor(a.h) / this.resolution,
          Math.floor(a.w) / this.resolution
        ) : h = new Y(
          Math.floor(a.x) / this.resolution,
          Math.floor(a.y) / this.resolution,
          Math.floor(a.w) / this.resolution,
          Math.floor(a.h) / this.resolution
        ), o.trimmed !== !1 && o.spriteSourceSize && (l = new Y(
          Math.floor(o.spriteSourceSize.x) / this.resolution,
          Math.floor(o.spriteSourceSize.y) / this.resolution,
          Math.floor(a.w) / this.resolution,
          Math.floor(a.h) / this.resolution
        )), this.textures[n] = new L({
          source: this.textureSource,
          frame: h,
          orig: u,
          trim: l,
          rotate: o.rotated ? 2 : 0,
          defaultAnchor: o.anchor,
          defaultBorders: o.borders,
          label: n.toString()
        });
      }
      i++;
    }
  }
  /** Parse animations config. */
  _processAnimations() {
    const t = this.data.animations || {};
    for (const e in t) {
      this.animations[e] = [];
      for (let i = 0; i < t[e].length; i++) {
        const r = t[e][i];
        this.animations[e].push(this.textures[r]);
      }
    }
  }
  /** The parse has completed. */
  _parseComplete() {
    const t = this._callback;
    this._callback = null, this._batchIndex = 0, t.call(this, this.textures);
  }
  /** Begin the next batch of textures. */
  _nextBatch() {
    this._processFrames(this._batchIndex * ee.BATCH_SIZE), this._batchIndex++, setTimeout(() => {
      this._batchIndex * ee.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete());
    }, 0);
  }
  /**
   * Destroy Spritesheet and don't use after this.
   * @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
   */
  destroy(t = !1) {
    var e;
    for (const i in this.textures)
      this.textures[i].destroy();
    this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, t && ((e = this._texture) == null || e.destroy(), this.textureSource.destroy()), this._texture = null, this.textureSource = null, this.linkedSheets = [];
  }
};
mn.BATCH_SIZE = 1e3;
let Gi = mn;
const pa = [
  "jpg",
  "png",
  "jpeg",
  "avif",
  "webp",
  "basis",
  "etc2",
  "bc7",
  "bc6h",
  "bc5",
  "bc4",
  "bc3",
  "bc2",
  "bc1",
  "eac",
  "astc"
];
function gn(s, t, e) {
  const i = {};
  if (s.forEach((r) => {
    i[r] = t;
  }), Object.keys(t.textures).forEach((r) => {
    i[`${t.cachePrefix}${r}`] = t.textures[r];
  }), !e) {
    const r = le.dirname(s[0]);
    t.linkedSheets.forEach((n, o) => {
      const a = gn([`${r}/${t.data.meta.related_multi_packs[o]}`], n, !0);
      Object.assign(i, a);
    });
  }
  return i;
}
const ma = {
  extension: I.Asset,
  /** Handle the caching of the related Spritesheet Textures */
  cache: {
    test: (s) => s instanceof Gi,
    getCacheableAssets: (s, t) => gn(s, t, !1)
  },
  /** Resolve the resolution of the asset. */
  resolver: {
    extension: {
      type: I.ResolveParser,
      name: "resolveSpritesheet"
    },
    test: (s) => {
      const e = s.split("?")[0].split("."), i = e.pop(), r = e.pop();
      return i === "json" && pa.includes(r);
    },
    parse: (s) => {
      var e;
      const t = s.split(".");
      return {
        resolution: parseFloat(((e = pn.RETINA_PREFIX.exec(s)) == null ? void 0 : e[1]) ?? "1"),
        format: t[t.length - 2],
        src: s
      };
    }
  },
  /**
   * Loader plugin that parses sprite sheets!
   * once the JSON has been loaded this checks to see if the JSON is spritesheet data.
   * If it is, we load the spritesheets image and parse the data into Spritesheet
   * All textures in the sprite sheet are then added to the cache
   */
  loader: {
    /** used for deprecation purposes */
    name: "spritesheetLoader",
    id: "spritesheet",
    extension: {
      type: I.LoadParser,
      priority: dn.Normal,
      name: "spritesheetLoader"
    },
    async testParse(s, t) {
      return le.extname(t.src).toLowerCase() === ".json" && !!s.frames;
    },
    async parse(s, t, e) {
      var u, f;
      const {
        texture: i,
        // if user need to use preloaded texture
        imageFilename: r,
        // if user need to use custom filename (not from jsonFile.meta.image)
        textureOptions: n,
        // if user need to set texture options on texture
        cachePrefix: o
        // if user need to use custom cache prefix
      } = (t == null ? void 0 : t.data) ?? {};
      let a = le.dirname(t.src);
      a && a.lastIndexOf("/") !== a.length - 1 && (a += "/");
      let h;
      if (i instanceof L)
        h = i;
      else {
        const d = Ri(a + (r ?? s.meta.image), t.src);
        h = (await e.load([{ src: d, data: n }]))[d];
      }
      const l = new Gi({
        texture: h.source,
        data: s,
        cachePrefix: o
      });
      await l.parse();
      const c = (u = s == null ? void 0 : s.meta) == null ? void 0 : u.related_multi_packs;
      if (Array.isArray(c)) {
        const d = [];
        for (const g of c) {
          if (typeof g != "string")
            continue;
          let m = a + g;
          (f = t.data) != null && f.ignoreMultiPack || (m = Ri(m, t.src), d.push(e.load({
            src: m,
            data: {
              textureOptions: n,
              ignoreMultiPack: !0
            }
          })));
        }
        const p = await Promise.all(d);
        l.linkedSheets = p, p.forEach((g) => {
          g.linkedSheets = [l].concat(l.linkedSheets.filter((m) => m !== g));
        });
      }
      return l;
    },
    async unload(s, t, e) {
      await e.unload(s.textureSource._sourceOrigin), s.destroy(!1);
    }
  }
};
X.add(ma);
const rs = /* @__PURE__ */ Object.create(null), Bi = /* @__PURE__ */ Object.create(null);
function qs(s, t) {
  let e = Bi[s];
  return e === void 0 && (rs[t] === void 0 && (rs[t] = 1), Bi[s] = e = rs[t]++), e;
}
let Rt;
function xn() {
  return (!Rt || Rt != null && Rt.isContextLost()) && (Rt = _t.get().createCanvas().getContext("webgl", {})), Rt;
}
let Ae;
function ga() {
  if (!Ae) {
    Ae = "mediump";
    const s = xn();
    s && s.getShaderPrecisionFormat && (Ae = s.getShaderPrecisionFormat(s.FRAGMENT_SHADER, s.HIGH_FLOAT).precision ? "highp" : "mediump");
  }
  return Ae;
}
function xa(s, t, e) {
  return t ? s : e ? (s = s.replace("out vec4 finalColor;", ""), `

        #ifdef GL_ES // This checks if it is WebGL1
        #define in varying
        #define finalColor gl_FragColor
        #define texture texture2D
        #endif
        ${s}
        `) : `

        #ifdef GL_ES // This checks if it is WebGL1
        #define in attribute
        #define out varying
        #endif
        ${s}
        `;
}
function ya(s, t, e) {
  const i = e ? t.maxSupportedFragmentPrecision : t.maxSupportedVertexPrecision;
  if (s.substring(0, 9) !== "precision") {
    let r = e ? t.requestedFragmentPrecision : t.requestedVertexPrecision;
    return r === "highp" && i !== "highp" && (r = "mediump"), `precision ${r} float;
${s}`;
  } else if (i !== "highp" && s.substring(0, 15) === "precision highp")
    return s.replace("precision highp", "precision mediump");
  return s;
}
function _a(s, t) {
  return t ? `#version 300 es
${s}` : s;
}
const ba = {}, va = {};
function wa(s, { name: t = "pixi-program" }, e = !0) {
  t = t.replace(/\s+/g, "-"), t += e ? "-fragment" : "-vertex";
  const i = e ? ba : va;
  return i[t] ? (i[t]++, t += `-${i[t]}`) : i[t] = 1, s.indexOf("#define SHADER_NAME") !== -1 ? s : `${`#define SHADER_NAME ${t}`}
${s}`;
}
function Sa(s, t) {
  return t ? s.replace("#version 300 es", "") : s;
}
const ns = {
  // strips any version headers..
  stripVersion: Sa,
  // adds precision string if not already present
  ensurePrecision: ya,
  // add some defines if WebGL1 to make it more compatible with WebGL2 shaders
  addProgramDefines: xa,
  // add the program name to the shader
  setProgramName: wa,
  // add the version string to the shader header
  insertVersion: _a
}, jt = /* @__PURE__ */ Object.create(null), yn = class Is {
  /**
   * Creates a shiny new GlProgram. Used by WebGL renderer.
   * @param options - The options for the program.
   */
  constructor(t) {
    t = { ...Is.defaultOptions, ...t };
    const e = t.fragment.indexOf("#version 300 es") !== -1, i = {
      stripVersion: e,
      ensurePrecision: {
        requestedFragmentPrecision: t.preferredFragmentPrecision,
        requestedVertexPrecision: t.preferredVertexPrecision,
        maxSupportedVertexPrecision: "highp",
        maxSupportedFragmentPrecision: ga()
      },
      setProgramName: {
        name: t.name
      },
      addProgramDefines: e,
      insertVersion: e
    };
    let r = t.fragment, n = t.vertex;
    Object.keys(ns).forEach((o) => {
      const a = i[o];
      r = ns[o](r, a, !0), n = ns[o](n, a, !1);
    }), this.fragment = r, this.vertex = n, this.transformFeedbackVaryings = t.transformFeedbackVaryings, this._key = qs(`${this.vertex}:${this.fragment}`, "gl-program");
  }
  /** destroys the program */
  destroy() {
    this.fragment = null, this.vertex = null, this._attributeData = null, this._uniformData = null, this._uniformBlockData = null, this.transformFeedbackVaryings = null, jt[this._cacheKey] = null;
  }
  /**
   * Helper function that creates a program for a given source.
   * It will check the program cache if the program has already been created.
   * If it has that one will be returned, if not a new one will be created and cached.
   * @param options - The options for the program.
   * @returns A program using the same source
   */
  static from(t) {
    const e = `${t.vertex}:${t.fragment}`;
    return jt[e] || (jt[e] = new Is(t), jt[e]._cacheKey = e), jt[e];
  }
};
yn.defaultOptions = {
  preferredVertexPrecision: "highp",
  preferredFragmentPrecision: "mediump"
};
let _n = yn;
const Fi = {
  uint8x2: { size: 2, stride: 2, normalised: !1 },
  uint8x4: { size: 4, stride: 4, normalised: !1 },
  sint8x2: { size: 2, stride: 2, normalised: !1 },
  sint8x4: { size: 4, stride: 4, normalised: !1 },
  unorm8x2: { size: 2, stride: 2, normalised: !0 },
  unorm8x4: { size: 4, stride: 4, normalised: !0 },
  snorm8x2: { size: 2, stride: 2, normalised: !0 },
  snorm8x4: { size: 4, stride: 4, normalised: !0 },
  uint16x2: { size: 2, stride: 4, normalised: !1 },
  uint16x4: { size: 4, stride: 8, normalised: !1 },
  sint16x2: { size: 2, stride: 4, normalised: !1 },
  sint16x4: { size: 4, stride: 8, normalised: !1 },
  unorm16x2: { size: 2, stride: 4, normalised: !0 },
  unorm16x4: { size: 4, stride: 8, normalised: !0 },
  snorm16x2: { size: 2, stride: 4, normalised: !0 },
  snorm16x4: { size: 4, stride: 8, normalised: !0 },
  float16x2: { size: 2, stride: 4, normalised: !1 },
  float16x4: { size: 4, stride: 8, normalised: !1 },
  float32: { size: 1, stride: 4, normalised: !1 },
  float32x2: { size: 2, stride: 8, normalised: !1 },
  float32x3: { size: 3, stride: 12, normalised: !1 },
  float32x4: { size: 4, stride: 16, normalised: !1 },
  uint32: { size: 1, stride: 4, normalised: !1 },
  uint32x2: { size: 2, stride: 8, normalised: !1 },
  uint32x3: { size: 3, stride: 12, normalised: !1 },
  uint32x4: { size: 4, stride: 16, normalised: !1 },
  sint32: { size: 1, stride: 4, normalised: !1 },
  sint32x2: { size: 2, stride: 8, normalised: !1 },
  sint32x3: { size: 3, stride: 12, normalised: !1 },
  sint32x4: { size: 4, stride: 16, normalised: !1 }
};
function Ca(s) {
  return Fi[s] ?? Fi.float32;
}
const Ma = {
  f32: "float32",
  "vec2<f32>": "float32x2",
  "vec3<f32>": "float32x3",
  "vec4<f32>": "float32x4",
  vec2f: "float32x2",
  vec3f: "float32x3",
  vec4f: "float32x4",
  i32: "sint32",
  "vec2<i32>": "sint32x2",
  "vec3<i32>": "sint32x3",
  "vec4<i32>": "sint32x4",
  vec2i: "sint32x2",
  vec3i: "sint32x3",
  vec4i: "sint32x4",
  u32: "uint32",
  "vec2<u32>": "uint32x2",
  "vec3<u32>": "uint32x3",
  "vec4<u32>": "uint32x4",
  vec2u: "uint32x2",
  vec3u: "uint32x3",
  vec4u: "uint32x4",
  bool: "uint32",
  "vec2<bool>": "uint32x2",
  "vec3<bool>": "uint32x3",
  "vec4<bool>": "uint32x4"
}, Di = /@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|\)|$)/g;
function Li(s, t) {
  let e;
  for (; (e = Di.exec(s)) !== null; ) {
    const i = Ma[e[3]] ?? "float32";
    t[e[2]] = {
      location: parseInt(e[1], 10),
      format: i,
      stride: Ca(i).stride,
      offset: 0,
      instance: !1,
      start: 0
    };
  }
  Di.lastIndex = 0;
}
function Aa(s) {
  return s.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
}
function Ta({ source: s, entryPoint: t }) {
  const e = {}, i = Aa(s), r = i.indexOf(`fn ${t}(`);
  if (r === -1)
    return e;
  const n = i.indexOf("->", r);
  if (n === -1)
    return e;
  const o = i.substring(r, n);
  if (Li(o, e), Object.keys(e).length === 0) {
    const a = o.match(/\(\s*\w+\s*:\s*(\w+)/);
    if (a) {
      const h = a[1], l = new RegExp(`struct\\s+${h}\\s*\\{([^}]+)\\}`, "s"), c = i.match(l);
      c && Li(c[1], e);
    }
  }
  return e;
}
function os(s) {
  var u, f;
  const t = /(^|[^/])@(group|binding)\(\d+\)[^;]+;/g, e = /@group\((\d+)\)/, i = /@binding\((\d+)\)/, r = /var(<[^>]+>)? (\w+)/, n = /:\s*([\w<>]+)/, o = /struct\s+(\w+)\s*{([^}]+)}/g, a = /(\w+)\s*:\s*([\w\<\>]+)/g, h = /struct\s+(\w+)/, l = (u = s.match(t)) == null ? void 0 : u.map((d) => ({
    group: parseInt(d.match(e)[1], 10),
    binding: parseInt(d.match(i)[1], 10),
    name: d.match(r)[2],
    isUniform: d.match(r)[1] === "<uniform>",
    type: d.match(n)[1]
  }));
  if (!l)
    return {
      groups: [],
      structs: []
    };
  const c = ((f = s.match(o)) == null ? void 0 : f.map((d) => {
    const p = d.match(h)[1], g = d.match(a).reduce((m, x) => {
      const [y, _] = x.split(":");
      return m[y.trim()] = _.trim(), m;
    }, {});
    return g ? { name: p, members: g } : null;
  }).filter(({ name: d }) => l.some(
    (p) => (
      // Handle both direct type matches and generic types like array<StructName>
      p.type === d || p.type.includes(`<${d}>`)
    )
  ))) ?? [];
  return {
    groups: l,
    structs: c
  };
}
var Et = /* @__PURE__ */ ((s) => (s[s.VERTEX = 1] = "VERTEX", s[s.FRAGMENT = 2] = "FRAGMENT", s[s.COMPUTE = 4] = "COMPUTE", s))(Et || {});
function Pa({ groups: s }) {
  const t = [];
  for (let e = 0; e < s.length; e++) {
    const i = s[e];
    t[i.group] || (t[i.group] = []), i.isUniform ? t[i.group].push({
      binding: i.binding,
      visibility: Et.VERTEX | Et.FRAGMENT,
      buffer: {
        type: "uniform"
      }
    }) : i.type === "sampler" ? t[i.group].push({
      binding: i.binding,
      visibility: Et.FRAGMENT,
      sampler: {
        type: "filtering"
      }
    }) : i.type === "texture_2d" || i.type.startsWith("texture_2d<") ? t[i.group].push({
      binding: i.binding,
      visibility: Et.FRAGMENT,
      texture: {
        sampleType: "float",
        viewDimension: "2d",
        multisampled: !1
      }
    }) : i.type === "texture_2d_array" || i.type.startsWith("texture_2d_array<") ? t[i.group].push({
      binding: i.binding,
      visibility: Et.FRAGMENT,
      texture: {
        sampleType: "float",
        viewDimension: "2d-array",
        multisampled: !1
      }
    }) : (i.type === "texture_cube" || i.type.startsWith("texture_cube<")) && t[i.group].push({
      binding: i.binding,
      visibility: Et.FRAGMENT,
      texture: {
        sampleType: "float",
        viewDimension: "cube",
        multisampled: !1
      }
    });
  }
  for (let e = 0; e < t.length; e++)
    t[e] || (t[e] = []);
  return t;
}
function Ea({ groups: s }) {
  const t = [];
  for (let e = 0; e < s.length; e++) {
    const i = s[e];
    t[i.group] || (t[i.group] = {}), t[i.group][i.name] = i.binding;
  }
  return t;
}
function ka(s, t) {
  const e = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = [...s.structs, ...t.structs].filter((o) => e.has(o.name) ? !1 : (e.add(o.name), !0)), n = [...s.groups, ...t.groups].filter((o) => {
    const a = `${o.name}-${o.binding}`;
    return i.has(a) ? !1 : (i.add(a), !0);
  });
  return { structs: r, groups: n };
}
const qt = /* @__PURE__ */ Object.create(null);
class Ve {
  /**
   * Create a new GpuProgram
   * @param options - The options for the gpu program
   */
  constructor(t) {
    var a, h;
    this._layoutKey = 0, this._attributeLocationsKey = 0;
    const { fragment: e, vertex: i, layout: r, gpuLayout: n, name: o } = t;
    if (this.name = o, this.fragment = e, this.vertex = i, e.source === i.source) {
      const l = os(e.source);
      this.structsAndGroups = l;
    } else {
      const l = os(i.source), c = os(e.source);
      this.structsAndGroups = ka(l, c);
    }
    this.layout = r ?? Ea(this.structsAndGroups), this.gpuLayout = n ?? Pa(this.structsAndGroups), this.autoAssignGlobalUniforms = ((a = this.layout[0]) == null ? void 0 : a.globalUniforms) !== void 0, this.autoAssignLocalUniforms = ((h = this.layout[1]) == null ? void 0 : h.localUniforms) !== void 0, this._generateProgramKey();
  }
  // TODO maker this pure
  _generateProgramKey() {
    const { vertex: t, fragment: e } = this, i = t.source + e.source + t.entryPoint + e.entryPoint;
    this._layoutKey = qs(i, "program");
  }
  get attributeData() {
    return this._attributeData ?? (this._attributeData = Ta(this.vertex)), this._attributeData;
  }
  /** destroys the program */
  destroy() {
    this.gpuLayout = null, this.layout = null, this.structsAndGroups = null, this.fragment = null, this.vertex = null, qt[this._cacheKey] = null;
  }
  /**
   * Helper function that creates a program for a given source.
   * It will check the program cache if the program has already been created.
   * If it has that one will be returned, if not a new one will be created and cached.
   * @param options - The options for the program.
   * @returns A program using the same source
   */
  static from(t) {
    const e = `${t.vertex.source}:${t.fragment.source}:${t.fragment.entryPoint}:${t.vertex.entryPoint}`;
    return qt[e] || (qt[e] = new Ve(t), qt[e]._cacheKey = e), qt[e];
  }
}
const bn = [
  "f32",
  "i32",
  "vec2<f32>",
  "vec3<f32>",
  "vec4<f32>",
  "mat2x2<f32>",
  "mat3x3<f32>",
  "mat4x4<f32>",
  "mat3x2<f32>",
  "mat4x2<f32>",
  "mat2x3<f32>",
  "mat4x3<f32>",
  "mat2x4<f32>",
  "mat3x4<f32>",
  "vec2<i32>",
  "vec3<i32>",
  "vec4<i32>"
], Ia = bn.reduce((s, t) => (s[t] = !0, s), {});
function Ra(s, t) {
  switch (s) {
    case "f32":
      return 0;
    case "vec2<f32>":
      return new Float32Array(2 * t);
    case "vec3<f32>":
      return new Float32Array(3 * t);
    case "vec4<f32>":
      return new Float32Array(4 * t);
    case "mat2x2<f32>":
      return new Float32Array([
        1,
        0,
        0,
        1
      ]);
    case "mat3x3<f32>":
      return new Float32Array([
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ]);
    case "mat4x4<f32>":
      return new Float32Array([
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ]);
  }
  return null;
}
const vn = class wn {
  /**
   * Create a new Uniform group
   * @param uniformStructures - The structures of the uniform group
   * @param options - The optional parameters of this uniform group
   */
  constructor(t, e) {
    this._touched = 0, this.uid = V("uniform"), this._resourceType = "uniformGroup", this._resourceId = V("resource"), this.isUniformGroup = !0, this._dirtyId = 0, this.destroyed = !1, e = { ...wn.defaultOptions, ...e }, this.uniformStructures = t;
    const i = {};
    for (const r in t) {
      const n = t[r];
      if (n.name = r, n.size = n.size ?? 1, !Ia[n.type]) {
        const o = n.type.match(/^array<(\w+(?:<\w+>)?),\s*(\d+)>$/);
        if (o) {
          const [, a, h] = o;
          throw new Error(
            `Uniform type ${n.type} is not supported. Use type: '${a}', size: ${h} instead.`
          );
        }
        throw new Error(`Uniform type ${n.type} is not supported. Supported uniform types are: ${bn.join(", ")}`);
      }
      n.value ?? (n.value = Ra(n.type, n.size)), i[r] = n.value;
    }
    this.uniforms = i, this._dirtyId = 1, this.ubo = e.ubo, this.isStatic = e.isStatic, this._signature = qs(Object.keys(i).map(
      (r) => `${r}-${t[r].type}`
    ).join("-"), "uniform-group");
  }
  /** Call this if you want the uniform groups data to be uploaded to the GPU only useful if `isStatic` is true. */
  update() {
    this._dirtyId++;
  }
};
vn.defaultOptions = {
  /** if true the UniformGroup is handled as an Uniform buffer object. */
  ubo: !1,
  /** if true, then you are responsible for when the data is uploaded to the GPU by calling `update()` */
  isStatic: !1
};
let Sn = vn;
class Fe {
  /**
   * Create a new instance eof the Bind Group.
   * @param resources - The resources that are bound together for use by a shader.
   */
  constructor(t) {
    this.resources = /* @__PURE__ */ Object.create(null), this._dirty = !0;
    let e = 0;
    for (const i in t) {
      const r = t[i];
      this.setResource(r, e++);
    }
    this._updateKey();
  }
  /**
   * Updates the key if its flagged as dirty. This is used internally to
   * match this bind group to a WebGPU BindGroup.
   * @internal
   */
  _updateKey() {
    if (!this._dirty) return;
    this._dirty = !1;
    const t = [];
    let e = 0;
    for (const i in this.resources)
      t[e++] = this.resources[i]._resourceId;
    this._key = t.join("|");
  }
  /**
   * Set a resource at a given index. this function will
   * ensure that listeners will be removed from the current resource
   * and added to the new resource.
   * @param resource - The resource to set.
   * @param index - The index to set the resource at.
   */
  setResource(t, e) {
    var r, n;
    const i = this.resources[e];
    t !== i && ((r = i == null ? void 0 : i.off) == null || r.call(i, "change", this.onResourceChange, this), (n = t.on) == null || n.call(t, "change", this.onResourceChange, this), this.resources[e] = t, this._dirty = !0);
  }
  /**
   * Returns the resource at the current specified index.
   * @param index - The index of the resource to get.
   * @returns - The resource at the specified index.
   */
  getResource(t) {
    return this.resources[t];
  }
  /**
   * Used internally to 'touch' each resource, to ensure that the GC
   * knows that all resources in this bind group are still being used.
   * @param now - The current time in milliseconds.
   * @param tick - The current tick.
   * @internal
   */
  _touch(t, e) {
    const i = this.resources;
    for (const r in i)
      i[r]._gcLastUsed = t, i[r]._touched = e;
  }
  /** Destroys this bind group and removes all listeners. */
  destroy() {
    var e;
    const t = this.resources;
    for (const i in t) {
      const r = t[i];
      (e = r == null ? void 0 : r.off) == null || e.call(r, "change", this.onResourceChange, this);
    }
    this.resources = null;
  }
  onResourceChange(t) {
    this._dirty = !0, t.destroyed ? this.destroy() : this._updateKey();
  }
}
var Rs = /* @__PURE__ */ ((s) => (s[s.WEBGL = 1] = "WEBGL", s[s.WEBGPU = 2] = "WEBGPU", s[s.CANVAS = 4] = "CANVAS", s[s.BOTH = 3] = "BOTH", s))(Rs || {});
class Ks extends mt {
  constructor(t) {
    super(), this.uid = V("shader"), this._uniformBindMap = /* @__PURE__ */ Object.create(null), this._ownedBindGroups = [], this._destroyed = !1;
    let {
      gpuProgram: e,
      glProgram: i,
      groups: r,
      resources: n,
      compatibleRenderers: o,
      groupMap: a
    } = t;
    this.gpuProgram = e, this.glProgram = i, o === void 0 && (o = 0, e && (o |= Rs.WEBGPU), i && (o |= Rs.WEBGL)), this.compatibleRenderers = o;
    const h = {};
    if (!n && !r && (n = {}), n && r)
      throw new Error("[Shader] Cannot have both resources and groups");
    if (!e && r && !a)
      throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");
    if (!e && r && a)
      for (const l in a)
        for (const c in a[l]) {
          const u = a[l][c];
          h[u] = {
            group: l,
            binding: c,
            name: u
          };
        }
    else if (e && r && !a) {
      const l = e.structsAndGroups.groups;
      a = {}, l.forEach((c) => {
        a[c.group] = a[c.group] || {}, a[c.group][c.binding] = c.name, h[c.name] = c;
      });
    } else if (n) {
      r = {}, a = {}, e && e.structsAndGroups.groups.forEach((u) => {
        a[u.group] = a[u.group] || {}, a[u.group][u.binding] = u.name, h[u.name] = u;
      });
      let l = 0;
      for (const c in n)
        h[c] || (r[99] || (r[99] = new Fe(), this._ownedBindGroups.push(r[99])), h[c] = { group: 99, binding: l, name: c }, a[99] = a[99] || {}, a[99][l] = c, l++);
      for (const c in n) {
        const u = c;
        let f = n[c];
        !f.source && !f._resourceType && (f = new Sn(f));
        const d = h[u];
        d && (r[d.group] || (r[d.group] = new Fe(), this._ownedBindGroups.push(r[d.group])), r[d.group].setResource(f, d.binding));
      }
    }
    this.groups = r, this._uniformBindMap = a, this.resources = this._buildResourceAccessor(r, h);
  }
  /**
   * Sometimes a resource group will be provided later (for example global uniforms)
   * In such cases, this method can be used to let the shader know about the group.
   * @param name - the name of the resource group
   * @param groupIndex - the index of the group (should match the webGPU shader group location)
   * @param bindIndex - the index of the bind point (should match the webGPU shader bind point)
   */
  addResource(t, e, i) {
    var r, n;
    (r = this._uniformBindMap)[e] || (r[e] = {}), (n = this._uniformBindMap[e])[i] || (n[i] = t), this.groups[e] || (this.groups[e] = new Fe(), this._ownedBindGroups.push(this.groups[e]));
  }
  _buildResourceAccessor(t, e) {
    const i = {};
    for (const r in e) {
      const n = e[r];
      Object.defineProperty(i, n.name, {
        get() {
          return t[n.group].getResource(n.binding);
        },
        set(o) {
          t[n.group].setResource(o, n.binding);
        }
      });
    }
    return i;
  }
  /**
   * Use to destroy the shader when its not longer needed.
   * It will destroy the resources and remove listeners.
   * @param destroyPrograms - if the programs should be destroyed as well.
   * Make sure its not being used by other shaders!
   */
  destroy(t = !1) {
    var e, i;
    this._destroyed || (this._destroyed = !0, this.emit("destroy", this), t && ((e = this.gpuProgram) == null || e.destroy(), (i = this.glProgram) == null || i.destroy()), this.gpuProgram = null, this.glProgram = null, this.removeAllListeners(), this._uniformBindMap = null, this._ownedBindGroups.forEach((r) => {
      r.destroy();
    }), this._ownedBindGroups = null, this.resources = null, this.groups = null);
  }
  static from(t) {
    const { gpu: e, gl: i, ...r } = t;
    let n, o;
    return e && (n = Ve.from(e)), i && (o = _n.from(i)), new Ks({
      gpuProgram: n,
      glProgram: o,
      ...r
    });
  }
}
const Ga = {
  normal: 0,
  add: 1,
  multiply: 2,
  screen: 3,
  overlay: 4,
  erase: 5,
  "normal-npm": 6,
  "add-npm": 7,
  "screen-npm": 8,
  min: 9,
  max: 10
}, as = 0, hs = 1, ls = 2, cs = 3, us = 4, ds = 5, Gs = class Cn {
  constructor() {
    this.data = 0, this.blendMode = "normal", this.polygonOffset = 0, this.blend = !0, this.depthMask = !0;
  }
  /**
   * Activates blending of the computed fragment color values.
   * @default true
   */
  get blend() {
    return !!(this.data & 1 << as);
  }
  set blend(t) {
    !!(this.data & 1 << as) !== t && (this.data ^= 1 << as);
  }
  /**
   * Activates adding an offset to depth values of polygon's fragments
   * @default false
   */
  get offsets() {
    return !!(this.data & 1 << hs);
  }
  set offsets(t) {
    !!(this.data & 1 << hs) !== t && (this.data ^= 1 << hs);
  }
  /** The culling settings for this state none - No culling back - Back face culling front - Front face culling */
  set cullMode(t) {
    if (t === "none") {
      this.culling = !1;
      return;
    }
    this.culling = !0, this.clockwiseFrontFace = t === "front";
  }
  get cullMode() {
    return this.culling ? this.clockwiseFrontFace ? "front" : "back" : "none";
  }
  /**
   * Activates culling of polygons.
   * @default false
   */
  get culling() {
    return !!(this.data & 1 << ls);
  }
  set culling(t) {
    !!(this.data & 1 << ls) !== t && (this.data ^= 1 << ls);
  }
  /**
   * Activates depth comparisons and updates to the depth buffer.
   * @default false
   */
  get depthTest() {
    return !!(this.data & 1 << cs);
  }
  set depthTest(t) {
    !!(this.data & 1 << cs) !== t && (this.data ^= 1 << cs);
  }
  /**
   * Enables or disables writing to the depth buffer.
   * @default true
   */
  get depthMask() {
    return !!(this.data & 1 << ds);
  }
  set depthMask(t) {
    !!(this.data & 1 << ds) !== t && (this.data ^= 1 << ds);
  }
  /**
   * Specifies whether or not front or back-facing polygons can be culled.
   * @default false
   */
  get clockwiseFrontFace() {
    return !!(this.data & 1 << us);
  }
  set clockwiseFrontFace(t) {
    !!(this.data & 1 << us) !== t && (this.data ^= 1 << us);
  }
  /**
   * The blend mode to be applied when this state is set. Apply a value of `normal` to reset the blend mode.
   * Setting this mode to anything other than NO_BLEND will automatically switch blending on.
   * @default 'normal'
   */
  get blendMode() {
    return this._blendMode;
  }
  set blendMode(t) {
    this.blend = t !== "none", this._blendMode = t, this._blendModeId = Ga[t] || 0;
  }
  /**
   * The polygon offset. Setting this property to anything other than 0 will automatically enable polygon offset fill.
   * @default 0
   */
  get polygonOffset() {
    return this._polygonOffset;
  }
  set polygonOffset(t) {
    this.offsets = !!t, this._polygonOffset = t;
  }
  toString() {
    return `[pixi.js/core:State blendMode=${this.blendMode} clockwiseFrontFace=${this.clockwiseFrontFace} culling=${this.culling} depthMask=${this.depthMask} polygonOffset=${this.polygonOffset}]`;
  }
  /**
   * A quickly getting an instance of a State that is configured for 2d rendering.
   * @returns a new State with values set for 2d rendering
   */
  static for2d() {
    const t = new Cn();
    return t.depthTest = !1, t.blend = !0, t;
  }
};
Gs.default2d = Gs.for2d();
let Mn = Gs;
const Bs = [];
X.handleByNamedList(I.Environment, Bs);
async function Ba(s) {
  if (!s)
    for (let t = 0; t < Bs.length; t++) {
      const e = Bs[t];
      if (e.value.test()) {
        await e.value.load();
        return;
      }
    }
}
let Kt;
function Fa() {
  if (typeof Kt == "boolean")
    return Kt;
  try {
    Kt = new Function("param1", "param2", "param3", "return param1[param2] === param3;")({ a: "b" }, "a", "b") === !0;
  } catch {
    Kt = !1;
  }
  return Kt;
}
function Oi(s, t, e = 2) {
  const i = t && t.length, r = i ? t[0] * e : s.length;
  let n = An(s, 0, r, e, !0);
  const o = [];
  if (!n || n.next === n.prev) return o;
  let a, h, l;
  if (i && (n = Ua(s, t, n, e)), s.length > 80 * e) {
    a = s[0], h = s[1];
    let c = a, u = h;
    for (let f = e; f < r; f += e) {
      const d = s[f], p = s[f + 1];
      d < a && (a = d), p < h && (h = p), d > c && (c = d), p > u && (u = p);
    }
    l = Math.max(c - a, u - h), l = l !== 0 ? 32767 / l : 0;
  }
  return ce(n, o, e, a, h, l, 0), o;
}
function An(s, t, e, i, r) {
  let n;
  if (r === Za(s, t, e, i) > 0)
    for (let o = t; o < e; o += i) n = zi(o / i | 0, s[o], s[o + 1], n);
  else
    for (let o = e - i; o >= t; o -= i) n = zi(o / i | 0, s[o], s[o + 1], n);
  return n && Nt(n, n.next) && (de(n), n = n.next), n;
}
function kt(s, t) {
  if (!s) return s;
  t || (t = s);
  let e = s, i;
  do
    if (i = !1, !e.steiner && (Nt(e, e.next) || U(e.prev, e, e.next) === 0)) {
      if (de(e), e = t = e.prev, e === e.next) break;
      i = !0;
    } else
      e = e.next;
  while (i || e !== t);
  return t;
}
function ce(s, t, e, i, r, n, o) {
  if (!s) return;
  !o && n && Ya(s, i, r, n);
  let a = s;
  for (; s.prev !== s.next; ) {
    const h = s.prev, l = s.next;
    if (n ? La(s, i, r, n) : Da(s)) {
      t.push(h.i, s.i, l.i), de(s), s = l.next, a = l.next;
      continue;
    }
    if (s = l, s === a) {
      o ? o === 1 ? (s = Oa(kt(s), t), ce(s, t, e, i, r, n, 2)) : o === 2 && za(s, t, e, i, r, n) : ce(kt(s), t, e, i, r, n, 1);
      break;
    }
  }
}
function Da(s) {
  const t = s.prev, e = s, i = s.next;
  if (U(t, e, i) >= 0) return !1;
  const r = t.x, n = e.x, o = i.x, a = t.y, h = e.y, l = i.y, c = Math.min(r, n, o), u = Math.min(a, h, l), f = Math.max(r, n, o), d = Math.max(a, h, l);
  let p = i.next;
  for (; p !== t; ) {
    if (p.x >= c && p.x <= f && p.y >= u && p.y <= d && se(r, a, n, h, o, l, p.x, p.y) && U(p.prev, p, p.next) >= 0) return !1;
    p = p.next;
  }
  return !0;
}
function La(s, t, e, i) {
  const r = s.prev, n = s, o = s.next;
  if (U(r, n, o) >= 0) return !1;
  const a = r.x, h = n.x, l = o.x, c = r.y, u = n.y, f = o.y, d = Math.min(a, h, l), p = Math.min(c, u, f), g = Math.max(a, h, l), m = Math.max(c, u, f), x = Fs(d, p, t, e, i), y = Fs(g, m, t, e, i);
  let _ = s.prevZ, b = s.nextZ;
  for (; _ && _.z >= x && b && b.z <= y; ) {
    if (_.x >= d && _.x <= g && _.y >= p && _.y <= m && _ !== r && _ !== o && se(a, c, h, u, l, f, _.x, _.y) && U(_.prev, _, _.next) >= 0 || (_ = _.prevZ, b.x >= d && b.x <= g && b.y >= p && b.y <= m && b !== r && b !== o && se(a, c, h, u, l, f, b.x, b.y) && U(b.prev, b, b.next) >= 0)) return !1;
    b = b.nextZ;
  }
  for (; _ && _.z >= x; ) {
    if (_.x >= d && _.x <= g && _.y >= p && _.y <= m && _ !== r && _ !== o && se(a, c, h, u, l, f, _.x, _.y) && U(_.prev, _, _.next) >= 0) return !1;
    _ = _.prevZ;
  }
  for (; b && b.z <= y; ) {
    if (b.x >= d && b.x <= g && b.y >= p && b.y <= m && b !== r && b !== o && se(a, c, h, u, l, f, b.x, b.y) && U(b.prev, b, b.next) >= 0) return !1;
    b = b.nextZ;
  }
  return !0;
}
function Oa(s, t) {
  let e = s;
  do {
    const i = e.prev, r = e.next.next;
    !Nt(i, r) && Pn(i, e, e.next, r) && ue(i, r) && ue(r, i) && (t.push(i.i, e.i, r.i), de(e), de(e.next), e = s = r), e = e.next;
  } while (e !== s);
  return kt(e);
}
function za(s, t, e, i, r, n) {
  let o = s;
  do {
    let a = o.next.next;
    for (; a !== o.prev; ) {
      if (o.i !== a.i && ja(o, a)) {
        let h = En(o, a);
        o = kt(o, o.next), h = kt(h, h.next), ce(o, t, e, i, r, n, 0), ce(h, t, e, i, r, n, 0);
        return;
      }
      a = a.next;
    }
    o = o.next;
  } while (o !== s);
}
function Ua(s, t, e, i) {
  const r = [];
  for (let n = 0, o = t.length; n < o; n++) {
    const a = t[n] * i, h = n < o - 1 ? t[n + 1] * i : s.length, l = An(s, a, h, i, !1);
    l === l.next && (l.steiner = !0), r.push(Wa(l));
  }
  r.sort(Na);
  for (let n = 0; n < r.length; n++)
    e = Va(r[n], e);
  return e;
}
function Na(s, t) {
  let e = s.x - t.x;
  if (e === 0 && (e = s.y - t.y, e === 0)) {
    const i = (s.next.y - s.y) / (s.next.x - s.x), r = (t.next.y - t.y) / (t.next.x - t.x);
    e = i - r;
  }
  return e;
}
function Va(s, t) {
  const e = Ha(s, t);
  if (!e)
    return t;
  const i = En(e, s);
  return kt(i, i.next), kt(e, e.next);
}
function Ha(s, t) {
  let e = t;
  const i = s.x, r = s.y;
  let n = -1 / 0, o;
  if (Nt(s, e)) return e;
  do {
    if (Nt(s, e.next)) return e.next;
    if (r <= e.y && r >= e.next.y && e.next.y !== e.y) {
      const u = e.x + (r - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (u <= i && u > n && (n = u, o = e.x < e.next.x ? e : e.next, u === i))
        return o;
    }
    e = e.next;
  } while (e !== t);
  if (!o) return null;
  const a = o, h = o.x, l = o.y;
  let c = 1 / 0;
  e = o;
  do {
    if (i >= e.x && e.x >= h && i !== e.x && Tn(r < l ? i : n, r, h, l, r < l ? n : i, r, e.x, e.y)) {
      const u = Math.abs(r - e.y) / (i - e.x);
      ue(e, s) && (u < c || u === c && (e.x > o.x || e.x === o.x && $a(o, e))) && (o = e, c = u);
    }
    e = e.next;
  } while (e !== a);
  return o;
}
function $a(s, t) {
  return U(s.prev, s, t.prev) < 0 && U(t.next, s, s.next) < 0;
}
function Ya(s, t, e, i) {
  let r = s;
  do
    r.z === 0 && (r.z = Fs(r.x, r.y, t, e, i)), r.prevZ = r.prev, r.nextZ = r.next, r = r.next;
  while (r !== s);
  r.prevZ.nextZ = null, r.prevZ = null, Xa(r);
}
function Xa(s) {
  let t, e = 1;
  do {
    let i = s, r;
    s = null;
    let n = null;
    for (t = 0; i; ) {
      t++;
      let o = i, a = 0;
      for (let l = 0; l < e && (a++, o = o.nextZ, !!o); l++)
        ;
      let h = e;
      for (; a > 0 || h > 0 && o; )
        a !== 0 && (h === 0 || !o || i.z <= o.z) ? (r = i, i = i.nextZ, a--) : (r = o, o = o.nextZ, h--), n ? n.nextZ = r : s = r, r.prevZ = n, n = r;
      i = o;
    }
    n.nextZ = null, e *= 2;
  } while (t > 1);
  return s;
}
function Fs(s, t, e, i, r) {
  return s = (s - e) * r | 0, t = (t - i) * r | 0, s = (s | s << 8) & 16711935, s = (s | s << 4) & 252645135, s = (s | s << 2) & 858993459, s = (s | s << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, s | t << 1;
}
function Wa(s) {
  let t = s, e = s;
  do
    (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
  while (t !== s);
  return e;
}
function Tn(s, t, e, i, r, n, o, a) {
  return (r - o) * (t - a) >= (s - o) * (n - a) && (s - o) * (i - a) >= (e - o) * (t - a) && (e - o) * (n - a) >= (r - o) * (i - a);
}
function se(s, t, e, i, r, n, o, a) {
  return !(s === o && t === a) && Tn(s, t, e, i, r, n, o, a);
}
function ja(s, t) {
  return s.next.i !== t.i && s.prev.i !== t.i && !qa(s, t) && // doesn't intersect other edges
  (ue(s, t) && ue(t, s) && Ka(s, t) && // locally visible
  (U(s.prev, s, t.prev) || U(s, t.prev, t)) || // does not create opposite-facing sectors
  Nt(s, t) && U(s.prev, s, s.next) > 0 && U(t.prev, t, t.next) > 0);
}
function U(s, t, e) {
  return (t.y - s.y) * (e.x - t.x) - (t.x - s.x) * (e.y - t.y);
}
function Nt(s, t) {
  return s.x === t.x && s.y === t.y;
}
function Pn(s, t, e, i) {
  const r = Pe(U(s, t, e)), n = Pe(U(s, t, i)), o = Pe(U(e, i, s)), a = Pe(U(e, i, t));
  return !!(r !== n && o !== a || r === 0 && Te(s, e, t) || n === 0 && Te(s, i, t) || o === 0 && Te(e, s, i) || a === 0 && Te(e, t, i));
}
function Te(s, t, e) {
  return t.x <= Math.max(s.x, e.x) && t.x >= Math.min(s.x, e.x) && t.y <= Math.max(s.y, e.y) && t.y >= Math.min(s.y, e.y);
}
function Pe(s) {
  return s > 0 ? 1 : s < 0 ? -1 : 0;
}
function qa(s, t) {
  let e = s;
  do {
    if (e.i !== s.i && e.next.i !== s.i && e.i !== t.i && e.next.i !== t.i && Pn(e, e.next, s, t)) return !0;
    e = e.next;
  } while (e !== s);
  return !1;
}
function ue(s, t) {
  return U(s.prev, s, s.next) < 0 ? U(s, t, s.next) >= 0 && U(s, s.prev, t) >= 0 : U(s, t, s.prev) < 0 || U(s, s.next, t) < 0;
}
function Ka(s, t) {
  let e = s, i = !1;
  const r = (s.x + t.x) / 2, n = (s.y + t.y) / 2;
  do
    e.y > n != e.next.y > n && e.next.y !== e.y && r < (e.next.x - e.x) * (n - e.y) / (e.next.y - e.y) + e.x && (i = !i), e = e.next;
  while (e !== s);
  return i;
}
function En(s, t) {
  const e = Ds(s.i, s.x, s.y), i = Ds(t.i, t.x, t.y), r = s.next, n = t.prev;
  return s.next = t, t.prev = s, e.next = r, r.prev = e, i.next = e, e.prev = i, n.next = i, i.prev = n, i;
}
function zi(s, t, e, i) {
  const r = Ds(s, t, e);
  return i ? (r.next = i.next, r.prev = i, i.next.prev = r, i.next = r) : (r.prev = r, r.next = r), r;
}
function de(s) {
  s.next.prev = s.prev, s.prev.next = s.next, s.prevZ && (s.prevZ.nextZ = s.nextZ), s.nextZ && (s.nextZ.prevZ = s.prevZ);
}
function Ds(s, t, e) {
  return {
    i: s,
    // vertex index in coordinates array
    x: t,
    y: e,
    // vertex coordinates
    prev: null,
    // previous and next vertex nodes in a polygon ring
    next: null,
    z: 0,
    // z-order curve value
    prevZ: null,
    // previous and next nodes in z-order
    nextZ: null,
    steiner: !1
    // indicates whether this is a steiner point
  };
}
function Za(s, t, e, i) {
  let r = 0;
  for (let n = t, o = e - i; n < e; n += i)
    r += (s[o] - s[n]) * (s[n + 1] + s[o + 1]), o = n;
  return r;
}
const Qa = Oi.default || Oi;
var kn = /* @__PURE__ */ ((s) => (s[s.NONE = 0] = "NONE", s[s.COLOR = 16384] = "COLOR", s[s.STENCIL = 1024] = "STENCIL", s[s.DEPTH = 256] = "DEPTH", s[s.COLOR_DEPTH = 16640] = "COLOR_DEPTH", s[s.COLOR_STENCIL = 17408] = "COLOR_STENCIL", s[s.DEPTH_STENCIL = 1280] = "DEPTH_STENCIL", s[s.ALL = 17664] = "ALL", s))(kn || {});
class Ja {
  /**
   * @param name - The function name that will be executed on the listeners added to this Runner.
   */
  constructor(t) {
    this.items = [], this._name = t;
  }
  /* jsdoc/check-param-names */
  /**
   * Dispatch/Broadcast Runner to all listeners added to the queue.
   * @param {...any} params - (optional) parameters to pass to each listener
   */
  /* jsdoc/check-param-names */
  emit(t, e, i, r, n, o, a, h) {
    const { name: l, items: c } = this;
    for (let u = 0, f = c.length; u < f; u++)
      c[u][l](t, e, i, r, n, o, a, h);
    return this;
  }
  /**
   * Add a listener to the Runner
   *
   * Runners do not need to have scope or functions passed to them.
   * All that is required is to pass the listening object and ensure that it has contains a function that has the same name
   * as the name provided to the Runner when it was created.
   *
   * Eg A listener passed to this Runner will require a 'complete' function.
   *
   * ```ts
   * import { Runner } from 'pixi.js';
   *
   * const complete = new Runner('complete');
   * ```
   *
   * The scope used will be the object itself.
   * @param {any} item - The object that will be listening.
   */
  add(t) {
    return t[this._name] && (this.remove(t), this.items.push(t)), this;
  }
  /**
   * Remove a single listener from the dispatch queue.
   * @param {any} item - The listener that you would like to remove.
   */
  remove(t) {
    const e = this.items.indexOf(t);
    return e !== -1 && this.items.splice(e, 1), this;
  }
  /**
   * Check to see if the listener is already in the Runner
   * @param {any} item - The listener that you would like to check.
   */
  contains(t) {
    return this.items.indexOf(t) !== -1;
  }
  /** Remove all listeners from the Runner */
  removeAll() {
    return this.items.length = 0, this;
  }
  /** Remove all references, don't use after this. */
  destroy() {
    this.removeAll(), this.items = null, this._name = null;
  }
  /**
   * `true` if there are no this Runner contains no listeners
   * @readonly
   */
  get empty() {
    return this.items.length === 0;
  }
  /**
   * The name of the runner.
   * @readonly
   */
  get name() {
    return this._name;
  }
}
const th = [
  "init",
  "destroy",
  "contextChange",
  "resolutionChange",
  "resetState",
  "renderEnd",
  "renderStart",
  "render",
  "update",
  "postrender",
  "prerender"
], In = class Rn extends mt {
  /**
   * Set up a system with a collection of SystemClasses and runners.
   * Systems are attached dynamically to this class when added.
   * @param config - the config for the system manager
   */
  constructor(t) {
    super(), this.tick = 0, this.uid = V("renderer"), this.runners = /* @__PURE__ */ Object.create(null), this.renderPipes = /* @__PURE__ */ Object.create(null), this._initOptions = {}, this._systemsHash = /* @__PURE__ */ Object.create(null), this.type = t.type, this.name = t.name, this.config = t;
    const e = [...th, ...this.config.runners ?? []];
    this._addRunners(...e), this._unsafeEvalCheck();
  }
  /**
   * Initialize the renderer.
   * @param options - The options to use to create the renderer.
   */
  async init(t = {}) {
    const e = t.skipExtensionImports === !0 ? !0 : t.manageImports === !1;
    await Ba(e), this._addSystems(this.config.systems), this._addPipes(this.config.renderPipes, this.config.renderPipeAdaptors);
    for (const i in this._systemsHash)
      t = { ...this._systemsHash[i].constructor.defaultOptions, ...t };
    t = { ...Rn.defaultOptions, ...t }, this._roundPixels = t.roundPixels ? 1 : 0;
    for (let i = 0; i < this.runners.init.items.length; i++)
      await this.runners.init.items[i].init(t);
    this._initOptions = t;
  }
  render(t, e) {
    this.tick++;
    let i = t;
    if (i instanceof yt && (i = { container: i }, e && (B(H, "passing a second argument is deprecated, please use render options instead"), i.target = e.renderTexture)), i.target || (i.target = this.view.renderTarget), i.target === this.view.renderTarget && (this._lastObjectRendered = i.container, i.clearColor ?? (i.clearColor = this.background.colorRgba), i.clear ?? (i.clear = this.background.clearBeforeRender)), i.clearColor) {
      const r = Array.isArray(i.clearColor) && i.clearColor.length === 4;
      i.clearColor = r ? i.clearColor : rt.shared.setValue(i.clearColor).toArray();
    }
    i.transform || (i.container.updateLocalTransform(), i.transform = i.container.localTransform), i.container.visible && (i.container.enableRenderGroup(), this.runners.prerender.emit(i), this.runners.renderStart.emit(i), this.runners.render.emit(i), this.runners.renderEnd.emit(i), this.runners.postrender.emit(i));
  }
  /**
   * Resizes the WebGL view to the specified width and height.
   * @param desiredScreenWidth - The desired width of the screen.
   * @param desiredScreenHeight - The desired height of the screen.
   * @param resolution - The resolution / device pixel ratio of the renderer.
   */
  resize(t, e, i) {
    const r = this.view.resolution;
    this.view.resize(t, e, i), this.emit("resize", this.view.screen.width, this.view.screen.height, this.view.resolution), i !== void 0 && i !== r && this.runners.resolutionChange.emit(i);
  }
  /**
   * Clears the render target.
   * @param options - The options to use when clearing the render target.
   * @param options.target - The render target to clear.
   * @param options.clearColor - The color to clear with.
   * @param options.clear - The clear mode to use.
   * @advanced
   */
  clear(t = {}) {
    const e = this;
    t.target || (t.target = e.renderTarget.renderTarget), t.clearColor || (t.clearColor = this.background.colorRgba), t.clear ?? (t.clear = kn.ALL);
    const { clear: i, clearColor: r, target: n, mipLevel: o, layer: a } = t;
    rt.shared.setValue(r ?? this.background.colorRgba), e.renderTarget.clear(n, i, rt.shared.toArray(), o ?? 0, a ?? 0);
  }
  /** The resolution / device pixel ratio of the renderer. */
  get resolution() {
    return this.view.resolution;
  }
  set resolution(t) {
    this.view.resolution = t, this.runners.resolutionChange.emit(t);
  }
  /**
   * Same as view.width, actual number of pixels in the canvas by horizontal.
   * @type {number}
   * @readonly
   * @default 800
   */
  get width() {
    return this.view.texture.frame.width;
  }
  /**
   * Same as view.height, actual number of pixels in the canvas by vertical.
   * @default 600
   */
  get height() {
    return this.view.texture.frame.height;
  }
  // NOTE: this was `view` in v7
  /**
   * The canvas element that everything is drawn to.
   * @type {environment.ICanvas}
   */
  get canvas() {
    return this.view.canvas;
  }
  /**
   * the last object rendered by the renderer. Useful for other plugins like interaction managers
   * @readonly
   */
  get lastObjectRendered() {
    return this._lastObjectRendered;
  }
  /**
   * Flag if we are rendering to the screen vs renderTexture
   * @readonly
   * @default true
   */
  get renderingToScreen() {
    return this.renderTarget.renderingToScreen;
  }
  /**
   * Measurements of the screen. (0, 0, screenWidth, screenHeight).
   *
   * Its safe to use as filterArea or hitArea for the whole stage.
   */
  get screen() {
    return this.view.screen;
  }
  /**
   * Create a bunch of runners based of a collection of ids
   * @param runnerIds - the runner ids to add
   */
  _addRunners(...t) {
    t.forEach((e) => {
      this.runners[e] = new Ja(e);
    });
  }
  _addSystems(t) {
    let e;
    for (e in t) {
      const i = t[e];
      this._addSystem(i.value, i.name);
    }
  }
  /**
   * Add a new system to the renderer.
   * @param ClassRef - Class reference
   * @param name - Property name for system, if not specified
   *        will use a static `name` property on the class itself. This
   *        name will be assigned as s property on the Renderer so make
   *        sure it doesn't collide with properties on Renderer.
   * @returns Return instance of renderer
   */
  _addSystem(t, e) {
    const i = new t(this);
    if (this[e])
      throw new Error(`Whoops! The name "${e}" is already in use`);
    this[e] = i, this._systemsHash[e] = i;
    for (const r in this.runners)
      this.runners[r].add(i);
    return this;
  }
  _addPipes(t, e) {
    const i = e.reduce((r, n) => (r[n.name] = n.value, r), {});
    t.forEach((r) => {
      const n = r.value, o = r.name, a = i[o];
      this.renderPipes[o] = new n(
        this,
        a ? new a() : null
      ), this.runners.destroy.add(this.renderPipes[o]);
    });
  }
  destroy(t = !1) {
    this.runners.destroy.items.reverse(), this.runners.destroy.emit(t), (t === !0 || typeof t == "object" && t.releaseGlobalResources) && Ue.release(), Object.values(this.runners).forEach((e) => {
      e.destroy();
    }), this._systemsHash = null, this.renderPipes = null, this.removeAllListeners();
  }
  /**
   * Generate a texture from a container.
   * @param options - options or container target to use when generating the texture
   * @returns a texture
   */
  generateTexture(t) {
    return this.textureGenerator.generateTexture(t);
  }
  /**
   * Whether the renderer will round coordinates to whole pixels when rendering.
   * Can be overridden on a per scene item basis.
   */
  get roundPixels() {
    return !!this._roundPixels;
  }
  /**
   * Overridable function by `pixi.js/unsafe-eval` to silence
   * throwing an error if platform doesn't support unsafe-evals.
   * @private
   * @ignore
   */
  _unsafeEvalCheck() {
    if (!Fa())
      throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
  }
  /**
   * Resets the rendering state of the renderer.
   * This is useful when you want to use the WebGL context directly and need to ensure PixiJS's internal state
   * stays synchronized. When modifying the WebGL context state externally, calling this method before the next Pixi
   * render will reset all internal caches and ensure it executes correctly.
   *
   * This is particularly useful when combining PixiJS with other rendering engines like Three.js:
   * ```js
   * // Reset Three.js state
   * threeRenderer.resetState();
   *
   * // Render a Three.js scene
   * threeRenderer.render(threeScene, threeCamera);
   *
   * // Reset PixiJS state since Three.js modified the WebGL context
   * pixiRenderer.resetState();
   *
   * // Now render Pixi content
   * pixiRenderer.render(pixiScene);
   * ```
   * @advanced
   */
  resetState() {
    this.runners.resetState.emit();
  }
};
In.defaultOptions = {
  /**
   * Default resolution / device pixel ratio of the renderer.
   * @default 1
   */
  resolution: 1,
  /**
   * Should the `failIfMajorPerformanceCaveat` flag be enabled as a context option used in the `isWebGLSupported`
   * function. If set to true, a WebGL renderer can fail to be created if the browser thinks there could be
   * performance issues when using WebGL.
   *
   * In PixiJS v6 this has changed from true to false by default, to allow WebGL to work in as many
   * scenarios as possible. However, some users may have a poor experience, for example, if a user has a gpu or
   * driver version blacklisted by the
   * browser.
   *
   * If your application requires high performance rendering, you may wish to set this to false.
   * We recommend one of two options if you decide to set this flag to false:
   *
   * 1: Use the Canvas renderer as a fallback in case high performance WebGL is
   *    not supported.
   *
   * 2: Call `isWebGLSupported` (which if found in the utils package) in your code before attempting to create a
   *    PixiJS renderer, and show an error message to the user if the function returns false, explaining that their
   *    device & browser combination does not support high performance WebGL.
   *    This is a much better strategy than trying to create a PixiJS renderer and finding it then fails.
   * @default false
   */
  failIfMajorPerformanceCaveat: !1,
  /**
   * Should round pixels be forced when rendering?
   * @default false
   */
  roundPixels: !1
};
let Gn = In, Ee;
function eh(s) {
  return Ee !== void 0 || (Ee = (() => {
    var e;
    const t = {
      stencil: !0,
      failIfMajorPerformanceCaveat: s ?? Gn.defaultOptions.failIfMajorPerformanceCaveat
    };
    try {
      if (!_t.get().getWebGLRenderingContext())
        return !1;
      let r = _t.get().createCanvas().getContext("webgl", t);
      const n = !!((e = r == null ? void 0 : r.getContextAttributes()) != null && e.stencil);
      if (r) {
        const o = r.getExtension("WEBGL_lose_context");
        o && o.loseContext();
      }
      return r = null, n;
    } catch {
      return !1;
    }
  })()), Ee;
}
let ke;
async function sh(s = {}) {
  return ke !== void 0 || (ke = await (async () => {
    const t = _t.get().getNavigator().gpu;
    if (!t)
      return !1;
    try {
      return await (await t.requestAdapter(s)).requestDevice(), !0;
    } catch {
      return !1;
    }
  })()), ke;
}
const Ui = ["webgl", "webgpu", "canvas"];
async function ih(s) {
  let t = [];
  s.preference ? Array.isArray(s.preference) ? t = s.preference.slice() : (t.push(s.preference), Ui.forEach((n) => {
    n !== s.preference && t.push(n);
  })) : t = Ui.slice();
  let e, i = {};
  for (let n = 0; n < t.length; n++) {
    const o = t[n];
    if (o === "webgpu" && await sh()) {
      const { WebGPURenderer: a } = await import("./WebGPURenderer-BBOfa1m5.js");
      e = a, i = { ...s, ...s.webgpu };
      break;
    } else if (o === "webgl" && eh(
      s.failIfMajorPerformanceCaveat ?? Gn.defaultOptions.failIfMajorPerformanceCaveat
    )) {
      const { WebGLRenderer: a } = await import("./WebGLRenderer-C1lN5TE9.js");
      e = a, i = { ...s, ...s.webgl };
      break;
    } else if (o === "canvas") {
      const { CanvasRenderer: a } = await import("./CanvasRenderer-DJi8nVpX.js");
      e = a, i = { ...s, ...s.canvasOptions };
      break;
    }
  }
  if (delete i.webgpu, delete i.webgl, delete i.canvasOptions, !e)
    throw new Error("No available renderer for the current environment");
  const r = new e();
  return await r.init(i), r;
}
const Bn = "8.18.1";
class Fn {
  static init() {
    var t;
    (t = globalThis.__PIXI_APP_INIT__) == null || t.call(globalThis, this, Bn);
  }
  static destroy() {
  }
}
Fn.extension = I.Application;
class rh {
  constructor(t) {
    this._renderer = t;
  }
  init() {
    var t;
    (t = globalThis.__PIXI_RENDERER_INIT__) == null || t.call(globalThis, this._renderer, Bn);
  }
  destroy() {
    this._renderer = null;
  }
}
rh.extension = {
  type: [
    I.WebGLSystem,
    I.WebGPUSystem
  ],
  name: "initHook",
  priority: -10
};
class Dn {
  /**
   * Initialize the plugin with scope of application instance
   * @private
   * @param {object} [options] - See application options
   */
  static init(t) {
    Object.defineProperty(
      this,
      "resizeTo",
      {
        configurable: !0,
        set(e) {
          globalThis.removeEventListener("resize", this.queueResize), this._resizeTo = e, e && (globalThis.addEventListener("resize", this.queueResize), this.resize());
        },
        get() {
          return this._resizeTo;
        }
      }
    ), this.queueResize = () => {
      this._resizeTo && (this._cancelResize(), this._resizeId = requestAnimationFrame(() => this.resize()));
    }, this._cancelResize = () => {
      this._resizeId && (cancelAnimationFrame(this._resizeId), this._resizeId = null);
    }, this.resize = () => {
      if (!this._resizeTo)
        return;
      this._cancelResize();
      let e, i;
      if (this._resizeTo === globalThis.window)
        e = globalThis.innerWidth, i = globalThis.innerHeight;
      else {
        const { clientWidth: r, clientHeight: n } = this._resizeTo;
        e = r, i = n;
      }
      this.renderer.resize(e, i), this.render();
    }, this._resizeId = null, this._resizeTo = null, this.resizeTo = t.resizeTo || null;
  }
  /**
   * Clean up the ticker, scoped to application
   * @private
   */
  static destroy() {
    globalThis.removeEventListener("resize", this.queueResize), this._cancelResize(), this._cancelResize = null, this.queueResize = null, this.resizeTo = null, this.resize = null;
  }
}
Dn.extension = I.Application;
class Ln {
  /**
   * Initialize the plugin with scope of application instance
   * @private
   * @param {object} [options] - See application options
   */
  static init(t) {
    t = Object.assign({
      autoStart: !0,
      sharedTicker: !1
    }, t), Object.defineProperty(
      this,
      "ticker",
      {
        configurable: !0,
        set(e) {
          this._ticker && this._ticker.remove(this.render, this), this._ticker = e, e && e.add(this.render, this, Le.LOW);
        },
        get() {
          return this._ticker;
        }
      }
    ), this.stop = () => {
      this._ticker.stop();
    }, this.start = () => {
      this._ticker.start();
    }, this._ticker = null, this.ticker = t.sharedTicker ? zt.shared : new zt(), t.autoStart && this.start();
  }
  /**
   * Clean up the ticker, scoped to application.
   * @private
   */
  static destroy() {
    if (this._ticker) {
      const t = this._ticker;
      this.ticker = null, t.destroy();
    }
  }
}
Ln.extension = I.Application;
X.add(Dn);
X.add(Ln);
const On = class Ls {
  constructor(...t) {
    this.stage = new yt(), t[0] !== void 0 && B(H, "Application constructor options are deprecated, please use Application.init() instead.");
  }
  /**
   * Initializes the PixiJS application with the specified options.
   *
   * This method must be called after creating a new Application instance.
   * @param options - Configuration options for the application and renderer
   * @returns A promise that resolves when initialization is complete
   * @example
   * ```js
   * const app = new Application();
   *
   * // Initialize with custom options
   * await app.init({
   *     width: 800,
   *     height: 600,
   *     backgroundColor: 0x1099bb,
   *     preference: 'webgl', // or 'webgpu'
   * });
   * ```
   */
  async init(t) {
    t = { ...t }, this.stage || (this.stage = new yt()), this.renderer = await ih(t), Ls._plugins.forEach((e) => {
      e.init.call(this, t);
    });
  }
  /**
   * Renders the current stage to the screen.
   *
   * When using the default setup with {@link TickerPlugin} (enabled by default), you typically don't need to call
   * this method directly as rendering is handled automatically.
   *
   * Only use this method if you've disabled the {@link TickerPlugin} or need custom
   * render timing control.
   * @example
   * ```js
   * // Example 1: Default setup (TickerPlugin handles rendering)
   * const app = new Application();
   * await app.init();
   * // No need to call render() - TickerPlugin handles it
   *
   * // Example 2: Custom rendering loop (if TickerPlugin is disabled)
   * const app = new Application();
   * await app.init({ autoStart: false }); // Disable automatic rendering
   *
   * function animate() {
   *     app.render();
   *     requestAnimationFrame(animate);
   * }
   * animate();
   * ```
   */
  render() {
    this.renderer.render({ container: this.stage });
  }
  /**
   * Reference to the renderer's canvas element. This is the HTML element
   * that displays your application's graphics.
   * @readonly
   * @type {HTMLCanvasElement}
   * @example
   * ```js
   * // Create a new application
   * const app = new Application();
   * // Initialize the application
   * await app.init({...});
   * // Add canvas to the page
   * document.body.appendChild(app.canvas);
   *
   * // Access the canvas directly
   * console.log(app.canvas); // HTMLCanvasElement
   * ```
   */
  get canvas() {
    return this.renderer.canvas;
  }
  /**
   * Reference to the renderer's canvas element.
   * @type {HTMLCanvasElement}
   * @deprecated since 8.0.0
   * @see {@link Application#canvas}
   */
  get view() {
    return B(H, "Application.view is deprecated, please use Application.canvas instead."), this.renderer.canvas;
  }
  /**
   * Reference to the renderer's screen rectangle. This represents the visible area of your application.
   *
   * It's commonly used for:
   * - Setting filter areas for full-screen effects
   * - Defining hit areas for screen-wide interaction
   * - Determining the visible bounds of your application
   * @readonly
   * @example
   * ```js
   * // Use as filter area for a full-screen effect
   * const blurFilter = new BlurFilter();
   * sprite.filterArea = app.screen;
   *
   * // Use as hit area for screen-wide interaction
   * const screenSprite = new Sprite();
   * screenSprite.hitArea = app.screen;
   *
   * // Get screen dimensions
   * console.log(app.screen.width, app.screen.height);
   * ```
   * @see {@link Rectangle} For all available properties and methods
   */
  get screen() {
    return this.renderer.screen;
  }
  /**
   * Get the html div element that holds all DOM Container elements.
   * @readonly
   * @type {HTMLDivElement}
   */
  get domContainerRoot() {
    var t;
    return (t = this.renderer.renderPipes.dom) == null ? void 0 : t._domElement;
  }
  /**
   * Destroys the application and all of its resources.
   *
   * This method should be called when you want to completely
   * clean up the application and free all associated memory.
   * @param rendererDestroyOptions - Options for destroying the renderer:
   *  - `false` or `undefined`: Preserves the canvas element (default)
   *  - `true`: Removes the canvas element
   *  - `{ removeView: boolean }`: Object with removeView property to control canvas removal
   * @param options - Options for destroying the application:
   *  - `false` or `undefined`: Basic cleanup (default)
   *  - `true`: Complete cleanup including children
   *  - Detailed options object:
   *    - `children`: Remove children
   *    - `texture`: Destroy textures
   *    - `textureSource`: Destroy texture sources
   *    - `context`: Destroy WebGL context
   * @example
   * ```js
   * // Basic cleanup
   * app.destroy();
   *
   * // Remove canvas and do complete cleanup
   * app.destroy(true, true);
   *
   * // Remove canvas with explicit options
   * app.destroy({ removeView: true }, true);
   *
   * // Detailed cleanup with specific options
   * app.destroy(
   *     { removeView: true },
   *     {
   *         children: true,
   *         texture: true,
   *         textureSource: true,
   *         context: true
   *     }
   * );
   * ```
   * > [!WARNING] After calling destroy, the application instance should no longer be used.
   * > All properties will be null and further operations will throw errors.
   */
  destroy(t = !1, e = !1) {
    const i = Ls._plugins.slice(0);
    i.reverse(), i.forEach((r) => {
      r.destroy.call(this);
    }), this.stage.destroy(e), this.stage = null, this.renderer.destroy(t), this.renderer = null;
  }
};
On._plugins = [];
let zn = On;
X.handleByList(I.Application, zn._plugins);
X.add(Fn);
var nh = ah, fs = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }, oh = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
function ah(s) {
  var t = [];
  return s.replace(oh, function(e, i, r) {
    var n = i.toLowerCase();
    for (r = lh(r), n == "m" && r.length > 2 && (t.push([i].concat(r.splice(0, 2))), n = "l", i = i == "m" ? "l" : "L"); ; ) {
      if (r.length == fs[n])
        return r.unshift(i), t.push(r);
      if (r.length < fs[n]) throw new Error("malformed path data");
      t.push([i].concat(r.splice(0, fs[n])));
    }
  }), t;
}
var hh = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
function lh(s) {
  var t = s.match(hh);
  return t ? t.map(Number) : [];
}
const ch = /* @__PURE__ */ Ys(nh);
function uh(s, t) {
  const e = ch(s), i = [];
  let r = null, n = 0, o = 0;
  for (let a = 0; a < e.length; a++) {
    const h = e[a], l = h[0], c = h;
    switch (l) {
      case "M":
        n = c[1], o = c[2], t.moveTo(n, o);
        break;
      case "m":
        n += c[1], o += c[2], t.moveTo(n, o);
        break;
      case "H":
        n = c[1], t.lineTo(n, o);
        break;
      case "h":
        n += c[1], t.lineTo(n, o);
        break;
      case "V":
        o = c[1], t.lineTo(n, o);
        break;
      case "v":
        o += c[1], t.lineTo(n, o);
        break;
      case "L":
        n = c[1], o = c[2], t.lineTo(n, o);
        break;
      case "l":
        n += c[1], o += c[2], t.lineTo(n, o);
        break;
      case "C":
        n = c[5], o = c[6], t.bezierCurveTo(
          c[1],
          c[2],
          // First control point
          c[3],
          c[4],
          // Second control point
          n,
          o
          // End point
        );
        break;
      case "c":
        t.bezierCurveTo(
          n + c[1],
          o + c[2],
          // First control point
          n + c[3],
          o + c[4],
          // Second control point
          n + c[5],
          o + c[6]
          // End point
        ), n += c[5], o += c[6];
        break;
      case "S":
        n = c[3], o = c[4], t.bezierCurveToShort(
          c[1],
          c[2],
          // Control point
          n,
          o
          // End point
        );
        break;
      case "s":
        t.bezierCurveToShort(
          n + c[1],
          o + c[2],
          // Control point
          n + c[3],
          o + c[4]
          // End point
        ), n += c[3], o += c[4];
        break;
      case "Q":
        n = c[3], o = c[4], t.quadraticCurveTo(
          c[1],
          c[2],
          // Control point
          n,
          o
          // End point
        );
        break;
      case "q":
        t.quadraticCurveTo(
          n + c[1],
          o + c[2],
          // Control point
          n + c[3],
          o + c[4]
          // End point
        ), n += c[3], o += c[4];
        break;
      case "T":
        n = c[1], o = c[2], t.quadraticCurveToShort(
          n,
          o
          // End point
        );
        break;
      case "t":
        n += c[1], o += c[2], t.quadraticCurveToShort(
          n,
          o
          // End point
        );
        break;
      case "A":
        n = c[6], o = c[7], t.arcToSvg(
          c[1],
          // rx
          c[2],
          // ry
          c[3],
          // x-axis-rotation
          c[4],
          // large-arc-flag
          c[5],
          // sweep-flag
          n,
          o
          // End point
        );
        break;
      case "a":
        n += c[6], o += c[7], t.arcToSvg(
          c[1],
          // rx
          c[2],
          // ry
          c[3],
          // x-axis-rotation
          c[4],
          // large-arc-flag
          c[5],
          // sweep-flag
          n,
          o
          // End point
        );
        break;
      case "Z":
      case "z":
        t.closePath(), i.length > 0 && (r = i.pop(), r ? (n = r.startX, o = r.startY) : (n = 0, o = 0)), r = null;
        break;
      default:
        J(`Unknown SVG path command: ${l}`);
    }
    l !== "Z" && l !== "z" && r === null && (r = { startX: n, startY: o }, i.push(r));
  }
  return t;
}
class Zs {
  /**
   * @param x - The X coordinate of the center of this circle
   * @param y - The Y coordinate of the center of this circle
   * @param radius - The radius of the circle
   */
  constructor(t = 0, e = 0, i = 0) {
    this.type = "circle", this.x = t, this.y = e, this.radius = i;
  }
  /**
   * Creates a clone of this Circle instance.
   * @example
   * ```ts
   * // Basic circle cloning
   * const original = new Circle(100, 100, 50);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.radius = 75;
   *
   * // Verify independence
   * console.log(original.radius); // 50
   * console.log(modified.radius); // 75
   * ```
   * @returns A copy of the Circle
   * @see {@link Circle.copyFrom} For copying into existing circle
   * @see {@link Circle.copyTo} For copying to another circle
   */
  clone() {
    return new Zs(this.x, this.y, this.radius);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle.
   *
   * Uses the distance formula to determine if a point is inside the circle's radius.
   *
   * Commonly used for hit testing in PixiJS events and graphics.
   * @example
   * ```ts
   * // Basic containment check
   * const circle = new Circle(100, 100, 50);
   * const isInside = circle.contains(120, 120);
   *
   * // Check mouse position
   * const circle = new Circle(0, 0, 100);
   * container.hitArea = circle;
   * container.on('pointermove', (e) => {
   *     // only called if pointer is within circle
   * });
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Circle
   * @see {@link Circle.strokeContains} For checking stroke intersection
   * @see {@link Circle.getBounds} For getting bounding box
   */
  contains(t, e) {
    if (this.radius <= 0) return !1;
    const i = this.radius * this.radius;
    let r = this.x - t, n = this.y - e;
    return r *= r, n *= n, r + n <= i;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle including the stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const circle = new Circle(100, 100, 50);
   * const isOnStroke = circle.strokeContains(150, 100, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = circle.strokeContains(150, 100, 4, 1);   // Inside
   * const centerStroke = circle.strokeContains(150, 100, 4, 0.5); // Centered
   * const outerStroke = circle.strokeContains(150, 100, 4, 0);   // Outside
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param width - The width of the line to check
   * @param alignment - The alignment of the stroke, 0.5 by default
   * @returns Whether the x/y coordinates are within this Circle's stroke
   * @see {@link Circle.contains} For checking fill containment
   * @see {@link Circle.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, i, r = 0.5) {
    if (this.radius === 0) return !1;
    const n = this.x - t, o = this.y - e, a = this.radius, h = (1 - r) * i, l = Math.sqrt(n * n + o * o);
    return l <= a + h && l > a - (i - h);
  }
  /**
   * Returns the framing rectangle of the circle as a Rectangle object.
   * @example
   * ```ts
   * // Basic bounds calculation
   * const circle = new Circle(100, 100, 50);
   * const bounds = circle.getBounds();
   * // bounds: x=50, y=50, width=100, height=100
   *
   * // Reuse existing rectangle
   * const rect = new Rectangle();
   * circle.getBounds(rect);
   * ```
   * @param out - Optional Rectangle object to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle} For rectangle properties
   * @see {@link Circle.contains} For point containment
   */
  getBounds(t) {
    return t || (t = new Y()), t.x = this.x - this.radius, t.y = this.y - this.radius, t.width = this.radius * 2, t.height = this.radius * 2, t;
  }
  /**
   * Copies another circle to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Circle(100, 100, 50);
   * const target = new Circle();
   * target.copyFrom(source);
   * ```
   * @param circle - The circle to copy from
   * @returns Returns itself
   * @see {@link Circle.copyTo} For copying to another circle
   * @see {@link Circle.clone} For creating new circle copy
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.radius = t.radius, this;
  }
  /**
   * Copies this circle to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Circle(100, 100, 50);
   * const target = new Circle();
   * source.copyTo(target);
   * ```
   * @param circle - The circle to copy to
   * @returns Returns given parameter
   * @see {@link Circle.copyFrom} For copying from another circle
   * @see {@link Circle.clone} For creating new circle copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Circle x=${this.x} y=${this.y} radius=${this.radius}]`;
  }
}
class Qs {
  /**
   * @param x - The X coordinate of the center of this ellipse
   * @param y - The Y coordinate of the center of this ellipse
   * @param halfWidth - The half width of this ellipse
   * @param halfHeight - The half height of this ellipse
   */
  constructor(t = 0, e = 0, i = 0, r = 0) {
    this.type = "ellipse", this.x = t, this.y = e, this.halfWidth = i, this.halfHeight = r;
  }
  /**
   * Creates a clone of this Ellipse instance.
   * @example
   * ```ts
   * // Basic cloning
   * const original = new Ellipse(100, 100, 50, 25);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.halfWidth *= 2;
   * modified.halfHeight *= 2;
   *
   * // Verify independence
   * console.log(original.halfWidth);  // 50
   * console.log(modified.halfWidth);  // 100
   * ```
   * @returns A copy of the ellipse
   * @see {@link Ellipse.copyFrom} For copying into existing ellipse
   * @see {@link Ellipse.copyTo} For copying to another ellipse
   */
  clone() {
    return new Qs(this.x, this.y, this.halfWidth, this.halfHeight);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse.
   * Uses normalized coordinates and the ellipse equation to determine containment.
   * @example
   * ```ts
   * // Basic containment check
   * const ellipse = new Ellipse(100, 100, 50, 25);
   * const isInside = ellipse.contains(120, 110);
   * ```
   * @remarks
   * - Uses ellipse equation (x²/a² + y²/b² ≤ 1)
   * - Returns false if dimensions are 0 or negative
   * - Normalized to center (0,0) for calculation
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coords are within this ellipse
   * @see {@link Ellipse.strokeContains} For checking stroke intersection
   * @see {@link Ellipse.getBounds} For getting containing rectangle
   */
  contains(t, e) {
    if (this.halfWidth <= 0 || this.halfHeight <= 0)
      return !1;
    let i = (t - this.x) / this.halfWidth, r = (e - this.y) / this.halfHeight;
    return i *= i, r *= r, i + r <= 1;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse including stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const ellipse = new Ellipse(100, 100, 50, 25);
   * const isOnStroke = ellipse.strokeContains(150, 100, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = ellipse.strokeContains(150, 100, 4, 1);   // Inside
   * const centerStroke = ellipse.strokeContains(150, 100, 4, 0.5); // Centered
   * const outerStroke = ellipse.strokeContains(150, 100, 4, 0);   // Outside
   * ```
   * @remarks
   * - Uses normalized ellipse equations
   * - Considers stroke alignment
   * - Returns false if dimensions are 0
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
   * @returns Whether the x/y coords are within this ellipse's stroke
   * @see {@link Ellipse.contains} For checking fill containment
   * @see {@link Ellipse.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, i, r = 0.5) {
    const { halfWidth: n, halfHeight: o } = this;
    if (n <= 0 || o <= 0)
      return !1;
    const a = i * (1 - r), h = i - a, l = n - h, c = o - h, u = n + a, f = o + a, d = t - this.x, p = e - this.y, g = d * d / (l * l) + p * p / (c * c), m = d * d / (u * u) + p * p / (f * f);
    return g > 1 && m <= 1;
  }
  /**
   * Returns the framing rectangle of the ellipse as a Rectangle object.
   * @example
   * ```ts
   * // Basic bounds calculation
   * const ellipse = new Ellipse(100, 100, 50, 25);
   * const bounds = ellipse.getBounds();
   * // bounds: x=50, y=75, width=100, height=50
   *
   * // Reuse existing rectangle
   * const rect = new Rectangle();
   * ellipse.getBounds(rect);
   * ```
   * @remarks
   * - Creates Rectangle if none provided
   * - Top-left is (x-halfWidth, y-halfHeight)
   * - Width is halfWidth * 2
   * - Height is halfHeight * 2
   * @param out - Optional Rectangle object to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle} For rectangle properties
   * @see {@link Ellipse.contains} For checking if a point is inside
   */
  getBounds(t) {
    return t || (t = new Y()), t.x = this.x - this.halfWidth, t.y = this.y - this.halfHeight, t.width = this.halfWidth * 2, t.height = this.halfHeight * 2, t;
  }
  /**
   * Copies another ellipse to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Ellipse(100, 100, 50, 25);
   * const target = new Ellipse();
   * target.copyFrom(source);
   * ```
   * @param ellipse - The ellipse to copy from
   * @returns Returns itself
   * @see {@link Ellipse.copyTo} For copying to another ellipse
   * @see {@link Ellipse.clone} For creating new ellipse copy
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.halfWidth = t.halfWidth, this.halfHeight = t.halfHeight, this;
  }
  /**
   * Copies this ellipse to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Ellipse(100, 100, 50, 25);
   * const target = new Ellipse();
   * source.copyTo(target);
   * ```
   * @param ellipse - The ellipse to copy to
   * @returns Returns given parameter
   * @see {@link Ellipse.copyFrom} For copying from another ellipse
   * @see {@link Ellipse.clone} For creating new ellipse copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Ellipse x=${this.x} y=${this.y} halfWidth=${this.halfWidth} halfHeight=${this.halfHeight}]`;
  }
}
function dh(s, t, e, i, r, n) {
  const o = s - e, a = t - i, h = r - e, l = n - i, c = o * h + a * l, u = h * h + l * l;
  let f = -1;
  u !== 0 && (f = c / u);
  let d, p;
  f < 0 ? (d = e, p = i) : f > 1 ? (d = r, p = n) : (d = e + f * h, p = i + f * l);
  const g = s - d, m = t - p;
  return g * g + m * m;
}
let fh, ph;
class ne {
  /**
   * @param points - This can be an array of Points
   *  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
   *  the arguments passed can be all the points of the polygon e.g.
   *  `new Polygon(new Point(), new Point(), ...)`, or the arguments passed can be flat
   *  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
   */
  constructor(...t) {
    this.type = "polygon";
    let e = Array.isArray(t[0]) ? t[0] : t;
    if (typeof e[0] != "number") {
      const i = [];
      for (let r = 0, n = e.length; r < n; r++)
        i.push(e[r].x, e[r].y);
      e = i;
    }
    this.points = e, this.closePath = !0;
  }
  /**
   * Determines whether the polygon's points are arranged in a clockwise direction.
   * Uses the shoelace formula (surveyor's formula) to calculate the signed area.
   *
   * A positive area indicates clockwise winding, while negative indicates counter-clockwise.
   *
   * The formula sums up the cross products of adjacent vertices:
   * For each pair of adjacent points (x1,y1) and (x2,y2), we calculate (x1*y2 - x2*y1)
   * The final sum divided by 2 gives the signed area - positive for clockwise.
   * @example
   * ```ts
   * // Check polygon winding
   * const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
   * console.log(polygon.isClockwise()); // Check direction
   *
   * // Use in path construction
   * const hole = new Polygon([25, 25, 75, 25, 75, 75, 25, 75]);
   * if (hole.isClockwise() === shape.isClockwise()) {
   *     hole.points.reverse(); // Reverse for proper hole winding
   * }
   * ```
   * @returns `true` if the polygon's points are arranged clockwise, `false` if counter-clockwise
   */
  isClockwise() {
    let t = 0;
    const e = this.points, i = e.length;
    for (let r = 0; r < i; r += 2) {
      const n = e[r], o = e[r + 1], a = e[(r + 2) % i], h = e[(r + 3) % i];
      t += (a - n) * (h + o);
    }
    return t < 0;
  }
  /**
   * Checks if this polygon completely contains another polygon.
   * Used for detecting holes in shapes, like when parsing SVG paths.
   * @example
   * ```ts
   * // Basic containment check
   * const outerSquare = new Polygon([0,0, 100,0, 100,100, 0,100]); // A square
   * const innerSquare = new Polygon([25,25, 75,25, 75,75, 25,75]); // A smaller square inside
   *
   * outerSquare.containsPolygon(innerSquare); // Returns true
   * innerSquare.containsPolygon(outerSquare); // Returns false
   * ```
   * @remarks
   * - Uses bounds check for quick rejection
   * - Tests all points for containment
   * @param polygon - The polygon to test for containment
   * @returns True if this polygon completely contains the other polygon
   * @see {@link Polygon.contains} For single point testing
   * @see {@link Polygon.getBounds} For bounds calculation
   */
  containsPolygon(t) {
    const e = this.getBounds(fh), i = t.getBounds(ph);
    if (!e.containsRect(i))
      return !1;
    const r = t.points;
    for (let n = 0; n < r.length; n += 2) {
      const o = r[n], a = r[n + 1];
      if (!this.contains(o, a))
        return !1;
    }
    return !0;
  }
  /**
   * Creates a clone of this polygon.
   * @example
   * ```ts
   * // Basic cloning
   * const original = new Polygon([0, 0, 100, 0, 50, 100]);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.points[0] = 10; // Modify first x coordinate
   * ```
   * @returns A copy of the polygon
   * @see {@link Polygon.copyFrom} For copying into existing polygon
   * @see {@link Polygon.copyTo} For copying to another polygon
   */
  clone() {
    const t = this.points.slice(), e = new ne(t);
    return e.closePath = this.closePath, e;
  }
  /**
   * Checks whether the x and y coordinates passed to this function are contained within this polygon.
   * Uses raycasting algorithm for point-in-polygon testing.
   * @example
   * ```ts
   * // Basic containment check
   * const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
   * const isInside = polygon.contains(25, 25); // true
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this polygon
   * @see {@link Polygon.strokeContains} For checking stroke intersection
   * @see {@link Polygon.containsPolygon} For polygon-in-polygon testing
   */
  contains(t, e) {
    let i = !1;
    const r = this.points.length / 2;
    for (let n = 0, o = r - 1; n < r; o = n++) {
      const a = this.points[n * 2], h = this.points[n * 2 + 1], l = this.points[o * 2], c = this.points[o * 2 + 1];
      h > e != c > e && t < (l - a) * ((e - h) / (c - h)) + a && (i = !i);
    }
    return i;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this polygon including the stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
   * const isOnStroke = polygon.strokeContains(25, 25, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = polygon.strokeContains(25, 25, 4, 1);   // Inside
   * const centerStroke = polygon.strokeContains(25, 25, 4, 0.5); // Centered
   * const outerStroke = polygon.strokeContains(25, 25, 4, 0);   // Outside
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
   * @returns Whether the x/y coordinates are within this polygon's stroke
   * @see {@link Polygon.contains} For checking fill containment
   * @see {@link Polygon.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, i, r = 0.5) {
    const n = i * i, o = n * (1 - r), a = n - o, { points: h } = this, l = h.length - (this.closePath ? 0 : 2);
    for (let c = 0; c < l; c += 2) {
      const u = h[c], f = h[c + 1], d = h[(c + 2) % h.length], p = h[(c + 3) % h.length], g = dh(t, e, u, f, d, p), m = Math.sign((d - u) * (e - f) - (p - f) * (t - u));
      if (g <= (m < 0 ? a : o))
        return !0;
    }
    return !1;
  }
  /**
   * Returns the framing rectangle of the polygon as a Rectangle object.
   * @example
   * ```ts
   * // Basic bounds calculation
   * const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
   * const bounds = polygon.getBounds();
   * // bounds: x=0, y=0, width=100, height=100
   *
   * // Reuse existing rectangle
   * const rect = new Rectangle();
   * polygon.getBounds(rect);
   * ```
   * @param out - Optional rectangle to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle} For rectangle properties
   * @see {@link Polygon.contains} For checking if a point is inside
   */
  getBounds(t) {
    t || (t = new Y());
    const e = this.points;
    let i = 1 / 0, r = -1 / 0, n = 1 / 0, o = -1 / 0;
    for (let a = 0, h = e.length; a < h; a += 2) {
      const l = e[a], c = e[a + 1];
      i = l < i ? l : i, r = l > r ? l : r, n = c < n ? c : n, o = c > o ? c : o;
    }
    return t.x = i, t.width = r - i, t.y = n, t.height = o - n, t;
  }
  /**
   * Copies another polygon to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Polygon([0, 0, 100, 0, 50, 100]);
   * const target = new Polygon();
   * target.copyFrom(source);
   * ```
   * @param polygon - The polygon to copy from
   * @returns Returns itself
   * @see {@link Polygon.copyTo} For copying to another polygon
   * @see {@link Polygon.clone} For creating new polygon copy
   */
  copyFrom(t) {
    return this.points = t.points.slice(), this.closePath = t.closePath, this;
  }
  /**
   * Copies this polygon to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Polygon([0, 0, 100, 0, 50, 100]);
   * const target = new Polygon();
   * source.copyTo(target);
   * ```
   * @param polygon - The polygon to copy to
   * @returns Returns given parameter
   * @see {@link Polygon.copyFrom} For copying from another polygon
   * @see {@link Polygon.clone} For creating new polygon copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:PolygoncloseStroke=${this.closePath}points=${this.points.reduce((t, e) => `${t}, ${e}`, "")}]`;
  }
  /**
   * Get the last X coordinate of the polygon.
   * @example
   * ```ts
   * // Basic coordinate access
   * const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
   * console.log(polygon.lastX); // 300
   * ```
   * @readonly
   * @returns The x-coordinate of the last vertex
   * @see {@link Polygon.lastY} For last Y coordinate
   * @see {@link Polygon.points} For raw points array
   */
  get lastX() {
    return this.points[this.points.length - 2];
  }
  /**
   * Get the last Y coordinate of the polygon.
   * @example
   * ```ts
   * // Basic coordinate access
   * const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
   * console.log(polygon.lastY); // 400
   * ```
   * @readonly
   * @returns The y-coordinate of the last vertex
   * @see {@link Polygon.lastX} For last X coordinate
   * @see {@link Polygon.points} For raw points array
   */
  get lastY() {
    return this.points[this.points.length - 1];
  }
  /**
   * Get the last X coordinate of the polygon.
   * @readonly
   * @deprecated since 8.11.0, use {@link Polygon.lastX} instead.
   */
  get x() {
    return B("8.11.0", "Polygon.lastX is deprecated, please use Polygon.lastX instead."), this.points[this.points.length - 2];
  }
  /**
   * Get the last Y coordinate of the polygon.
   * @readonly
   * @deprecated since 8.11.0, use {@link Polygon.lastY} instead.
   */
  get y() {
    return B("8.11.0", "Polygon.y is deprecated, please use Polygon.lastY instead."), this.points[this.points.length - 1];
  }
  /**
   * Get the first X coordinate of the polygon.
   * @example
   * ```ts
   * // Basic coordinate access
   * const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
   * console.log(polygon.x); // 0
   * ```
   * @readonly
   * @returns The x-coordinate of the first vertex
   * @see {@link Polygon.startY} For first Y coordinate
   * @see {@link Polygon.points} For raw points array
   */
  get startX() {
    return this.points[0];
  }
  /**
   * Get the first Y coordinate of the polygon.
   * @example
   * ```ts
   * // Basic coordinate access
   * const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
   * console.log(polygon.y); // 0
   * ```
   * @readonly
   * @returns The y-coordinate of the first vertex
   * @see {@link Polygon.startX} For first X coordinate
   * @see {@link Polygon.points} For raw points array
   */
  get startY() {
    return this.points[1];
  }
}
const Ie = (s, t, e, i, r, n, o) => {
  const a = s - e, h = t - i, l = Math.sqrt(a * a + h * h);
  return l >= r - n && l <= r + o;
};
class Js {
  /**
   * @param x - The X coordinate of the upper-left corner of the rounded rectangle
   * @param y - The Y coordinate of the upper-left corner of the rounded rectangle
   * @param width - The overall width of this rounded rectangle
   * @param height - The overall height of this rounded rectangle
   * @param radius - Controls the radius of the rounded corners
   */
  constructor(t = 0, e = 0, i = 0, r = 0, n = 20) {
    this.type = "roundedRectangle", this.x = t, this.y = e, this.width = i, this.height = r, this.radius = n;
  }
  /**
   * Returns the framing rectangle of the rounded rectangle as a Rectangle object
   * @example
   * ```ts
   * // Basic bounds calculation
   * const rect = new RoundedRectangle(100, 100, 200, 150, 20);
   * const bounds = rect.getBounds();
   * // bounds: x=100, y=100, width=200, height=150
   *
   * // Reuse existing rectangle
   * const out = new Rectangle();
   * rect.getBounds(out);
   * ```
   * @remarks
   * - Rectangle matches outer dimensions
   * - Ignores corner radius
   * @param out - Optional rectangle to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle} For rectangle properties
   * @see {@link RoundedRectangle.contains} For checking if a point is inside
   */
  getBounds(t) {
    return t || (t = new Y()), t.x = this.x, t.y = this.y, t.width = this.width, t.height = this.height, t;
  }
  /**
   * Creates a clone of this Rounded Rectangle.
   * @example
   * ```ts
   * // Basic cloning
   * const original = new RoundedRectangle(100, 100, 200, 150, 20);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.radius = 30;
   * modified.width *= 2;
   *
   * // Verify independence
   * console.log(original.radius);  // 20
   * console.log(modified.radius);  // 30
   * ```
   * @returns A copy of the rounded rectangle
   * @see {@link RoundedRectangle.copyFrom} For copying into existing rectangle
   * @see {@link RoundedRectangle.copyTo} For copying to another rectangle
   */
  clone() {
    return new Js(this.x, this.y, this.width, this.height, this.radius);
  }
  /**
   * Copies another rectangle to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new RoundedRectangle(100, 100, 200, 150, 20);
   * const target = new RoundedRectangle();
   * target.copyFrom(source);
   *
   * // Chain with other operations
   * const rect = new RoundedRectangle()
   *     .copyFrom(source)
   *     .getBounds(rect);
   * ```
   * @param rectangle - The rectangle to copy from
   * @returns Returns itself
   * @see {@link RoundedRectangle.copyTo} For copying to another rectangle
   * @see {@link RoundedRectangle.clone} For creating new rectangle copy
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
  }
  /**
   * Copies this rectangle to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new RoundedRectangle(100, 100, 200, 150, 20);
   * const target = new RoundedRectangle();
   * source.copyTo(target);
   *
   * // Chain with other operations
   * const result = source
   *     .copyTo(new RoundedRectangle())
   *     .getBounds();
   * ```
   * @param rectangle - The rectangle to copy to
   * @returns Returns given parameter
   * @see {@link RoundedRectangle.copyFrom} For copying from another rectangle
   * @see {@link RoundedRectangle.clone} For creating new rectangle copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rounded Rectangle
   * @example
   * ```ts
   * // Basic containment check
   * const rect = new RoundedRectangle(100, 100, 200, 150, 20);
   * const isInside = rect.contains(150, 125); // true
   * // Check corner radius
   * const corner = rect.contains(100, 100); // false if within corner curve
   * ```
   * @remarks
   * - Returns false if width/height is 0 or negative
   * - Handles rounded corners with radius check
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Rounded Rectangle
   * @see {@link RoundedRectangle.strokeContains} For checking stroke intersection
   * @see {@link RoundedRectangle.getBounds} For getting containing rectangle
   */
  contains(t, e) {
    if (this.width <= 0 || this.height <= 0)
      return !1;
    if (t >= this.x && t <= this.x + this.width && e >= this.y && e <= this.y + this.height) {
      const i = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
      if (e >= this.y + i && e <= this.y + this.height - i || t >= this.x + i && t <= this.x + this.width - i)
        return !0;
      let r = t - (this.x + i), n = e - (this.y + i);
      const o = i * i;
      if (r * r + n * n <= o || (r = t - (this.x + this.width - i), r * r + n * n <= o) || (n = e - (this.y + this.height - i), r * r + n * n <= o) || (r = t - (this.x + i), r * r + n * n <= o))
        return !0;
    }
    return !1;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const rect = new RoundedRectangle(100, 100, 200, 150, 20);
   * const isOnStroke = rect.strokeContains(150, 100, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = rect.strokeContains(150, 100, 4, 1);   // Inside
   * const centerStroke = rect.strokeContains(150, 100, 4, 0.5); // Centered
   * const outerStroke = rect.strokeContains(150, 100, 4, 0);   // Outside
   * ```
   * @param pX - The X coordinate of the point to test
   * @param pY - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
   * @returns Whether the x/y coordinates are within this rectangle's stroke
   * @see {@link RoundedRectangle.contains} For checking fill containment
   * @see {@link RoundedRectangle.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, i, r = 0.5) {
    const { x: n, y: o, width: a, height: h, radius: l } = this, c = i * (1 - r), u = i - c, f = n + l, d = o + l, p = a - l * 2, g = h - l * 2, m = n + a, x = o + h;
    return (t >= n - c && t <= n + u || t >= m - u && t <= m + c) && e >= d && e <= d + g || (e >= o - c && e <= o + u || e >= x - u && e <= x + c) && t >= f && t <= f + p ? !0 : (
      // Top-left
      t < f && e < d && Ie(
        t,
        e,
        f,
        d,
        l,
        u,
        c
      ) || t > m - l && e < d && Ie(
        t,
        e,
        m - l,
        d,
        l,
        u,
        c
      ) || t > m - l && e > x - l && Ie(
        t,
        e,
        m - l,
        x - l,
        l,
        u,
        c
      ) || t < f && e > x - l && Ie(
        t,
        e,
        f,
        x - l,
        l,
        u,
        c
      )
    );
  }
  toString() {
    return `[pixi.js/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`;
  }
}
const Un = {};
function mh(s, t, e) {
  let i = 2166136261;
  for (let r = 0; r < t; r++)
    i ^= s[r].uid, i = Math.imul(i, 16777619), i >>>= 0;
  return Un[i] || gh(s, t, i, e);
}
function gh(s, t, e, i) {
  const r = {};
  let n = 0;
  for (let a = 0; a < i; a++) {
    const h = a < t ? s[a] : L.EMPTY.source;
    r[n++] = h.source, r[n++] = h.style;
  }
  const o = new Fe(r);
  return Un[e] = o, o;
}
class Ni {
  constructor(t) {
    typeof t == "number" ? this.rawBinaryData = new ArrayBuffer(t) : t instanceof Uint8Array ? this.rawBinaryData = t.buffer : this.rawBinaryData = t, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData), this.size = this.rawBinaryData.byteLength;
  }
  /** View on the raw binary data as a `Int8Array`. */
  get int8View() {
    return this._int8View || (this._int8View = new Int8Array(this.rawBinaryData)), this._int8View;
  }
  /** View on the raw binary data as a `Uint8Array`. */
  get uint8View() {
    return this._uint8View || (this._uint8View = new Uint8Array(this.rawBinaryData)), this._uint8View;
  }
  /**  View on the raw binary data as a `Int16Array`. */
  get int16View() {
    return this._int16View || (this._int16View = new Int16Array(this.rawBinaryData)), this._int16View;
  }
  /** View on the raw binary data as a `Int32Array`. */
  get int32View() {
    return this._int32View || (this._int32View = new Int32Array(this.rawBinaryData)), this._int32View;
  }
  /** View on the raw binary data as a `Float64Array`. */
  get float64View() {
    return this._float64Array || (this._float64Array = new Float64Array(this.rawBinaryData)), this._float64Array;
  }
  /** View on the raw binary data as a `BigUint64Array`. */
  get bigUint64View() {
    return this._bigUint64Array || (this._bigUint64Array = new BigUint64Array(this.rawBinaryData)), this._bigUint64Array;
  }
  /**
   * Returns the view of the given type.
   * @param type - One of `int8`, `uint8`, `int16`,
   *    `uint16`, `int32`, `uint32`, and `float32`.
   * @returns - typed array of given type
   */
  view(t) {
    return this[`${t}View`];
  }
  /** Destroys all buffer references. Do not use after calling this. */
  destroy() {
    this.rawBinaryData = null, this.uint32View = null, this.float32View = null, this.uint16View = null, this._int8View = null, this._uint8View = null, this._int16View = null, this._int32View = null, this._float64Array = null, this._bigUint64Array = null;
  }
  /**
   * Returns the size of the given type in bytes.
   * @param type - One of `int8`, `uint8`, `int16`,
   *   `uint16`, `int32`, `uint32`, and `float32`.
   * @returns - size of the type in bytes
   */
  static sizeOf(t) {
    switch (t) {
      case "int8":
      case "uint8":
        return 1;
      case "int16":
      case "uint16":
        return 2;
      case "int32":
      case "uint32":
      case "float32":
        return 4;
      default:
        throw new Error(`${t} isn't a valid view type`);
    }
  }
}
function Vi(s, t, e, i) {
  if (e ?? (e = 0), i ?? (i = Math.min(s.byteLength - e, t.byteLength)), !(e & 7) && !(i & 7)) {
    const r = i / 8;
    new Float64Array(t, 0, r).set(new Float64Array(s, e, r));
  } else if (!(e & 3) && !(i & 3)) {
    const r = i / 4;
    new Float32Array(t, 0, r).set(new Float32Array(s, e, r));
  } else
    new Uint8Array(t).set(new Uint8Array(s, e, i));
}
const xh = {
  normal: "normal-npm",
  add: "add-npm",
  screen: "screen-npm"
};
var yh = /* @__PURE__ */ ((s) => (s[s.DISABLED = 0] = "DISABLED", s[s.RENDERING_MASK_ADD = 1] = "RENDERING_MASK_ADD", s[s.MASK_ACTIVE = 2] = "MASK_ACTIVE", s[s.INVERSE_MASK_ACTIVE = 3] = "INVERSE_MASK_ACTIVE", s[s.RENDERING_MASK_REMOVE = 4] = "RENDERING_MASK_REMOVE", s[s.NONE = 5] = "NONE", s))(yh || {});
function Hi(s, t) {
  return t.alphaMode === "no-premultiply-alpha" && xh[s] || s;
}
const _h = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}"
].join(`
`);
function bh(s) {
  let t = "";
  for (let e = 0; e < s; ++e)
    e > 0 && (t += `
else `), e < s - 1 && (t += `if(test == ${e}.0){}`);
  return t;
}
function vh(s, t) {
  if (s === 0)
    throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  const e = t.createShader(t.FRAGMENT_SHADER);
  try {
    for (; ; ) {
      const i = _h.replace(/%forloop%/gi, bh(s));
      if (t.shaderSource(e, i), t.compileShader(e), !t.getShaderParameter(e, t.COMPILE_STATUS))
        s = s / 2 | 0;
      else
        break;
    }
  } finally {
    t.deleteShader(e);
  }
  return s;
}
let Gt = null;
function wh() {
  var t;
  if (Gt) return Gt;
  const s = xn();
  return Gt = s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS), Gt = vh(
    Gt,
    s
  ), (t = s.getExtension("WEBGL_lose_context")) == null || t.loseContext(), Gt;
}
class Sh {
  constructor() {
    this.ids = /* @__PURE__ */ Object.create(null), this.textures = [], this.count = 0;
  }
  /** Clear the textures and their locations. */
  clear() {
    for (let t = 0; t < this.count; t++) {
      const e = this.textures[t];
      this.textures[t] = null, this.ids[e.uid] = null;
    }
    this.count = 0;
  }
}
class Ch {
  constructor() {
    this.renderPipeId = "batch", this.action = "startBatch", this.start = 0, this.size = 0, this.textures = new Sh(), this.blendMode = "normal", this.topology = "triangle-strip", this.canBundle = !0;
  }
  destroy() {
    this.textures = null, this.gpuBindGroup = null, this.bindGroup = null, this.batcher = null, this.elements = null;
  }
}
const oe = [];
let Oe = 0;
Ue.register({
  clear: () => {
    if (oe.length > 0)
      for (const s of oe)
        s && s.destroy();
    oe.length = 0, Oe = 0;
  }
});
function $i() {
  return Oe > 0 ? oe[--Oe] : new Ch();
}
function Yi(s) {
  s.elements = null, oe[Oe++] = s;
}
let Zt = 0;
const Nn = class Vn {
  constructor(t) {
    this.uid = V("batcher"), this.dirty = !0, this.batchIndex = 0, this.batches = [], this._elements = [], t = { ...Vn.defaultOptions, ...t }, t.maxTextures || (B("v8.8.0", "maxTextures is a required option for Batcher now, please pass it in the options"), t.maxTextures = wh());
    const { maxTextures: e, attributesInitialSize: i, indicesInitialSize: r } = t;
    this.attributeBuffer = new Ni(i * 4), this.indexBuffer = new Uint16Array(r), this.maxTextures = e;
  }
  begin() {
    this.elementSize = 0, this.elementStart = 0, this.indexSize = 0, this.attributeSize = 0;
    for (let t = 0; t < this.batchIndex; t++)
      Yi(this.batches[t]);
    this.batchIndex = 0, this._batchIndexStart = 0, this._batchIndexSize = 0, this.dirty = !0;
  }
  add(t) {
    this._elements[this.elementSize++] = t, t._indexStart = this.indexSize, t._attributeStart = this.attributeSize, t._batcher = this, this.indexSize += t.indexSize, this.attributeSize += t.attributeSize * this.vertexSize;
  }
  checkAndUpdateTexture(t, e) {
    const i = t._batch.textures.ids[e._source.uid];
    return !i && i !== 0 ? !1 : (t._textureId = i, t.texture = e, !0);
  }
  updateElement(t) {
    this.dirty = !0;
    const e = this.attributeBuffer;
    t.packAsQuad ? this.packQuadAttributes(
      t,
      e.float32View,
      e.uint32View,
      t._attributeStart,
      t._textureId
    ) : this.packAttributes(
      t,
      e.float32View,
      e.uint32View,
      t._attributeStart,
      t._textureId
    );
  }
  /**
   * breaks the batcher. This happens when a batch gets too big,
   * or we need to switch to a different type of rendering (a filter for example)
   * @param instructionSet
   */
  break(t) {
    const e = this._elements;
    if (!e[this.elementStart]) return;
    let i = $i(), r = i.textures;
    r.clear();
    const n = e[this.elementStart];
    let o = Hi(n.blendMode, n.texture._source), a = n.topology;
    this.attributeSize * 4 > this.attributeBuffer.size && this._resizeAttributeBuffer(this.attributeSize * 4), this.indexSize > this.indexBuffer.length && this._resizeIndexBuffer(this.indexSize);
    const h = this.attributeBuffer.float32View, l = this.attributeBuffer.uint32View, c = this.indexBuffer;
    let u = this._batchIndexSize, f = this._batchIndexStart, d = "startBatch", p = [];
    const g = this.maxTextures;
    for (let m = this.elementStart; m < this.elementSize; ++m) {
      const x = e[m];
      e[m] = null;
      const _ = x.texture._source, b = Hi(x.blendMode, _), S = o !== b || a !== x.topology;
      if (_._batchTick === Zt && !S) {
        x._textureId = _._textureBindLocation, u += x.indexSize, x.packAsQuad ? (this.packQuadAttributes(
          x,
          h,
          l,
          x._attributeStart,
          x._textureId
        ), this.packQuadIndex(
          c,
          x._indexStart,
          x._attributeStart / this.vertexSize
        )) : (this.packAttributes(
          x,
          h,
          l,
          x._attributeStart,
          x._textureId
        ), this.packIndex(
          x,
          c,
          x._indexStart,
          x._attributeStart / this.vertexSize
        )), x._batch = i, p.push(x);
        continue;
      }
      _._batchTick = Zt, (r.count >= g || S) && (this._finishBatch(
        i,
        f,
        u - f,
        r,
        o,
        a,
        t,
        d,
        p
      ), d = "renderBatch", f = u, o = b, a = x.topology, i = $i(), r = i.textures, r.clear(), p = [], ++Zt), x._textureId = _._textureBindLocation = r.count, r.ids[_.uid] = r.count, r.textures[r.count++] = _, x._batch = i, p.push(x), u += x.indexSize, x.packAsQuad ? (this.packQuadAttributes(
        x,
        h,
        l,
        x._attributeStart,
        x._textureId
      ), this.packQuadIndex(
        c,
        x._indexStart,
        x._attributeStart / this.vertexSize
      )) : (this.packAttributes(
        x,
        h,
        l,
        x._attributeStart,
        x._textureId
      ), this.packIndex(
        x,
        c,
        x._indexStart,
        x._attributeStart / this.vertexSize
      ));
    }
    r.count > 0 && (this._finishBatch(
      i,
      f,
      u - f,
      r,
      o,
      a,
      t,
      d,
      p
    ), f = u, ++Zt), this.elementStart = this.elementSize, this._batchIndexStart = f, this._batchIndexSize = u;
  }
  _finishBatch(t, e, i, r, n, o, a, h, l) {
    t.gpuBindGroup = null, t.bindGroup = null, t.action = h, t.batcher = this, t.textures = r, t.blendMode = n, t.topology = o, t.start = e, t.size = i, t.elements = l, ++Zt, this.batches[this.batchIndex++] = t, a.add(t);
  }
  finish(t) {
    this.break(t);
  }
  /**
   * Resizes the attribute buffer to the given size (1 = 1 float32)
   * @param size - the size in vertices to ensure (not bytes!)
   */
  ensureAttributeBuffer(t) {
    t * 4 <= this.attributeBuffer.size || this._resizeAttributeBuffer(t * 4);
  }
  /**
   * Resizes the index buffer to the given size (1 = 1 float32)
   * @param size - the size in vertices to ensure (not bytes!)
   */
  ensureIndexBuffer(t) {
    t <= this.indexBuffer.length || this._resizeIndexBuffer(t);
  }
  _resizeAttributeBuffer(t) {
    const e = Math.max(t, this.attributeBuffer.size * 2), i = new Ni(e);
    Vi(this.attributeBuffer.rawBinaryData, i.rawBinaryData), this.attributeBuffer = i;
  }
  _resizeIndexBuffer(t) {
    const e = this.indexBuffer;
    let i = Math.max(t, e.length * 1.5);
    i += i % 2;
    const r = i > 65535 ? new Uint32Array(i) : new Uint16Array(i);
    if (r.BYTES_PER_ELEMENT !== e.BYTES_PER_ELEMENT)
      for (let n = 0; n < e.length; n++)
        r[n] = e[n];
    else
      Vi(e.buffer, r.buffer);
    this.indexBuffer = r;
  }
  packQuadIndex(t, e, i) {
    t[e] = i + 0, t[e + 1] = i + 1, t[e + 2] = i + 2, t[e + 3] = i + 0, t[e + 4] = i + 2, t[e + 5] = i + 3;
  }
  packIndex(t, e, i, r) {
    const n = t.indices, o = t.indexSize, a = t.indexOffset, h = t.attributeOffset;
    for (let l = 0; l < o; l++)
      e[i++] = r + n[l + a] - h;
  }
  /**
   * Destroys the batch and its resources.
   * @param options - destruction options
   * @param options.shader - whether to destroy the associated shader
   */
  destroy(t = {}) {
    var e;
    if (this.batches !== null) {
      for (let i = 0; i < this.batchIndex; i++)
        Yi(this.batches[i]);
      this.batches = null, this.geometry.destroy(!0), this.geometry = null, t.shader && ((e = this.shader) == null || e.destroy(), this.shader = null);
      for (let i = 0; i < this._elements.length; i++)
        this._elements[i] && (this._elements[i]._batch = null);
      this._elements = null, this.indexBuffer = null, this.attributeBuffer.destroy(), this.attributeBuffer = null;
    }
  }
};
Nn.defaultOptions = {
  maxTextures: null,
  attributesInitialSize: 4,
  indicesInitialSize: 6
};
let Mh = Nn;
var K = /* @__PURE__ */ ((s) => (s[s.MAP_READ = 1] = "MAP_READ", s[s.MAP_WRITE = 2] = "MAP_WRITE", s[s.COPY_SRC = 4] = "COPY_SRC", s[s.COPY_DST = 8] = "COPY_DST", s[s.INDEX = 16] = "INDEX", s[s.VERTEX = 32] = "VERTEX", s[s.UNIFORM = 64] = "UNIFORM", s[s.STORAGE = 128] = "STORAGE", s[s.INDIRECT = 256] = "INDIRECT", s[s.QUERY_RESOLVE = 512] = "QUERY_RESOLVE", s[s.STATIC = 1024] = "STATIC", s))(K || {});
class fe extends mt {
  /**
   * Creates a new Buffer with the given options
   * @param options - the options for the buffer
   */
  constructor(t) {
    let { data: e, size: i } = t;
    const { usage: r, label: n, shrinkToFit: o } = t;
    super(), this._gpuData = /* @__PURE__ */ Object.create(null), this._gcLastUsed = -1, this.autoGarbageCollect = !0, this.uid = V("buffer"), this._resourceType = "buffer", this._resourceId = V("resource"), this._touched = 0, this._updateID = 1, this._dataInt32 = null, this.shrinkToFit = !0, this.destroyed = !1, e instanceof Array && (e = new Float32Array(e)), this._data = e, i ?? (i = e == null ? void 0 : e.byteLength);
    const a = !!e;
    this.descriptor = {
      size: i,
      usage: r,
      mappedAtCreation: a,
      label: n
    }, this.shrinkToFit = o ?? !0;
  }
  /** the data in the buffer */
  get data() {
    return this._data;
  }
  set data(t) {
    this.setDataWithSize(t, t.length, !0);
  }
  get dataInt32() {
    return this._dataInt32 || (this._dataInt32 = new Int32Array(this.data.buffer)), this._dataInt32;
  }
  /** whether the buffer is static or not */
  get static() {
    return !!(this.descriptor.usage & K.STATIC);
  }
  set static(t) {
    t ? this.descriptor.usage |= K.STATIC : this.descriptor.usage &= ~K.STATIC;
  }
  /**
   * Sets the data in the buffer to the given value. This will immediately update the buffer on the GPU.
   * If you only want to update a subset of the buffer, you can pass in the size of the data.
   * @param value - the data to set
   * @param size - the size of the data in bytes
   * @param syncGPU - should the buffer be updated on the GPU immediately?
   */
  setDataWithSize(t, e, i) {
    if (this._updateID++, this._updateSize = e * t.BYTES_PER_ELEMENT, this._data === t) {
      i && this.emit("update", this);
      return;
    }
    const r = this._data;
    if (this._data = t, this._dataInt32 = null, !r || r.length !== t.length) {
      !this.shrinkToFit && r && t.byteLength < r.byteLength ? i && this.emit("update", this) : (this.descriptor.size = t.byteLength, this._resourceId = V("resource"), this.emit("change", this));
      return;
    }
    i && this.emit("update", this);
  }
  /**
   * updates the buffer on the GPU to reflect the data in the buffer.
   * By default it will update the entire buffer. If you only want to update a subset of the buffer,
   * you can pass in the size of the buffer to update.
   * @param sizeInBytes - the new size of the buffer in bytes
   */
  update(t) {
    this._updateSize = t ?? this._updateSize, this._updateID++, this.emit("update", this);
  }
  /** Unloads the buffer from the GPU */
  unload() {
    var t;
    this.emit("unload", this);
    for (const e in this._gpuData)
      (t = this._gpuData[e]) == null || t.destroy();
    this._gpuData = /* @__PURE__ */ Object.create(null);
  }
  /** Destroys the buffer */
  destroy() {
    this.destroyed = !0, this.unload(), this.emit("destroy", this), this.emit("change", this), this._data = null, this.descriptor = null, this.removeAllListeners();
  }
}
function Hn(s, t) {
  if (!(s instanceof fe)) {
    let e = t ? K.INDEX : K.VERTEX;
    s instanceof Array && (t ? (s = new Uint32Array(s), e = K.INDEX | K.COPY_DST) : (s = new Float32Array(s), e = K.VERTEX | K.COPY_DST)), s = new fe({
      data: s,
      label: t ? "index-mesh-buffer" : "vertex-mesh-buffer",
      usage: e
    });
  }
  return s;
}
function Ah(s, t, e) {
  const i = s.getAttribute(t);
  if (!i)
    return e.minX = 0, e.minY = 0, e.maxX = 0, e.maxY = 0, e;
  const r = i.buffer.data;
  let n = 1 / 0, o = 1 / 0, a = -1 / 0, h = -1 / 0;
  const l = r.BYTES_PER_ELEMENT, c = (i.offset || 0) / l, u = (i.stride || 2 * 4) / l;
  for (let f = c; f < r.length; f += u) {
    const d = r[f], p = r[f + 1];
    d > a && (a = d), p > h && (h = p), d < n && (n = d), p < o && (o = p);
  }
  return e.minX = n, e.minY = o, e.maxX = a, e.maxY = h, e;
}
function Th(s) {
  return (s instanceof fe || Array.isArray(s) || s.BYTES_PER_ELEMENT) && (s = {
    buffer: s
  }), s.buffer = Hn(s.buffer, !1), s;
}
class Ph extends mt {
  /**
   * Create a new instance of a geometry
   * @param options - The options for the geometry.
   */
  constructor(t = {}) {
    super(), this._gpuData = /* @__PURE__ */ Object.create(null), this.autoGarbageCollect = !0, this._gcLastUsed = -1, this.uid = V("geometry"), this._layoutKey = 0, this.instanceCount = 1, this._bounds = new ot(), this._boundsDirty = !0;
    const { attributes: e, indexBuffer: i, topology: r } = t;
    if (this.buffers = [], this.attributes = {}, e)
      for (const n in e)
        this.addAttribute(n, e[n]);
    this.instanceCount = t.instanceCount ?? 1, i && this.addIndex(i), this.topology = r || "triangle-list";
  }
  onBufferUpdate() {
    this._boundsDirty = !0, this.emit("update", this);
  }
  /**
   * Returns the requested attribute.
   * @param id - The name of the attribute required
   * @returns - The attribute requested.
   */
  getAttribute(t) {
    return this.attributes[t];
  }
  /**
   * Returns the index buffer
   * @returns - The index buffer.
   */
  getIndex() {
    return this.indexBuffer;
  }
  /**
   * Returns the requested buffer.
   * @param id - The name of the buffer required.
   * @returns - The buffer requested.
   */
  getBuffer(t) {
    return this.getAttribute(t).buffer;
  }
  /**
   * Used to figure out how many vertices there are in this geometry
   * @returns the number of vertices in the geometry
   */
  getSize() {
    for (const t in this.attributes) {
      const e = this.attributes[t];
      return e.buffer.data.length / (e.stride / 4 || e.size);
    }
    return 0;
  }
  /**
   * Adds an attribute to the geometry.
   * @param name - The name of the attribute to add.
   * @param attributeOption - The attribute option to add.
   */
  addAttribute(t, e) {
    const i = Th(e);
    this.buffers.indexOf(i.buffer) === -1 && (this.buffers.push(i.buffer), i.buffer.on("update", this.onBufferUpdate, this), i.buffer.on("change", this.onBufferUpdate, this)), this.attributes[t] = i;
  }
  /**
   * Adds an index buffer to the geometry.
   * @param indexBuffer - The index buffer to add. Can be a Buffer, TypedArray, or an array of numbers.
   */
  addIndex(t) {
    this.indexBuffer = Hn(t, !0), this.buffers.push(this.indexBuffer);
  }
  /** Returns the bounds of the geometry. */
  get bounds() {
    return this._boundsDirty ? (this._boundsDirty = !1, Ah(this, "aPosition", this._bounds)) : this._bounds;
  }
  /** Unloads the geometry from the GPU. */
  unload() {
    var t;
    this.emit("unload", this);
    for (const e in this._gpuData)
      (t = this._gpuData[e]) == null || t.destroy();
    this._gpuData = /* @__PURE__ */ Object.create(null);
  }
  /**
   * destroys the geometry.
   * @param destroyBuffers - destroy the buffers associated with this geometry
   */
  destroy(t = !1) {
    var e;
    this.emit("destroy", this), this.removeAllListeners(), t && this.buffers.forEach((i) => i.destroy()), this.unload(), (e = this.indexBuffer) == null || e.destroy(), this.attributes = null, this.buffers = null, this.indexBuffer = null, this._bounds = null;
  }
}
const Eh = new Float32Array(1), kh = new Uint32Array(1);
class Ih extends Ph {
  constructor() {
    const e = new fe({
      data: Eh,
      label: "attribute-batch-buffer",
      usage: K.VERTEX | K.COPY_DST,
      shrinkToFit: !1
    }), i = new fe({
      data: kh,
      label: "index-batch-buffer",
      usage: K.INDEX | K.COPY_DST,
      // | BufferUsage.STATIC,
      shrinkToFit: !1
    }), r = 6 * 4;
    super({
      attributes: {
        aPosition: {
          buffer: e,
          format: "float32x2",
          stride: r,
          offset: 0
        },
        aUV: {
          buffer: e,
          format: "float32x2",
          stride: r,
          offset: 2 * 4
        },
        aColor: {
          buffer: e,
          format: "unorm8x4",
          stride: r,
          offset: 4 * 4
        },
        aTextureIdAndRound: {
          buffer: e,
          format: "uint16x2",
          stride: r,
          offset: 5 * 4
        }
      },
      indexBuffer: i
    });
  }
}
function Xi(s, t, e) {
  if (s)
    for (const i in s) {
      const r = i.toLocaleLowerCase(), n = t[r];
      if (n) {
        let o = s[i];
        i === "header" && (o = o.replace(/@in\s+[^;]+;\s*/g, "").replace(/@out\s+[^;]+;\s*/g, "")), e && n.push(`//----${e}----//`), n.push(o);
      } else
        J(`${i} placement hook does not exist in shader`);
    }
}
const Rh = /\{\{(.*?)\}\}/g;
function Wi(s) {
  var i;
  const t = {};
  return (((i = s.match(Rh)) == null ? void 0 : i.map((r) => r.replace(/[{()}]/g, ""))) ?? []).forEach((r) => {
    t[r] = [];
  }), t;
}
function ji(s, t) {
  let e;
  const i = /@in\s+([^;]+);/g;
  for (; (e = i.exec(s)) !== null; )
    t.push(e[1]);
}
function qi(s, t, e = !1) {
  const i = [];
  ji(t, i), s.forEach((a) => {
    a.header && ji(a.header, i);
  });
  const r = i;
  e && r.sort();
  const n = r.map((a, h) => `       @location(${h}) ${a},`).join(`
`);
  let o = t.replace(/@in\s+[^;]+;\s*/g, "");
  return o = o.replace("{{in}}", `
${n}
`), o;
}
function Ki(s, t) {
  let e;
  const i = /@out\s+([^;]+);/g;
  for (; (e = i.exec(s)) !== null; )
    t.push(e[1]);
}
function Gh(s) {
  const e = /\b(\w+)\s*:/g.exec(s);
  return e ? e[1] : "";
}
function Bh(s) {
  const t = /@.*?\s+/g;
  return s.replace(t, "");
}
function Fh(s, t) {
  const e = [];
  Ki(t, e), s.forEach((h) => {
    h.header && Ki(h.header, e);
  });
  let i = 0;
  const r = e.sort().map((h) => h.indexOf("builtin") > -1 ? h : `@location(${i++}) ${h}`).join(`,
`), n = e.sort().map((h) => `       var ${Bh(h)};`).join(`
`), o = `return VSOutput(
            ${e.sort().map((h) => ` ${Gh(h)}`).join(`,
`)});`;
  let a = t.replace(/@out\s+[^;]+;\s*/g, "");
  return a = a.replace("{{struct}}", `
${r}
`), a = a.replace("{{start}}", `
${n}
`), a = a.replace("{{return}}", `
${o}
`), a;
}
function Zi(s, t) {
  let e = s;
  for (const i in t) {
    const r = t[i];
    r.join(`
`).length ? e = e.replace(`{{${i}}}`, `//-----${i} START-----//
${r.join(`
`)}
//----${i} FINISH----//`) : e = e.replace(`{{${i}}}`, "");
  }
  return e;
}
const xt = /* @__PURE__ */ Object.create(null), ps = /* @__PURE__ */ new Map();
let Dh = 0;
function Lh({
  template: s,
  bits: t
}) {
  const e = $n(s, t);
  if (xt[e]) return xt[e];
  const { vertex: i, fragment: r } = zh(s, t);
  return xt[e] = Yn(i, r, t), xt[e];
}
function Oh({
  template: s,
  bits: t
}) {
  const e = $n(s, t);
  return xt[e] || (xt[e] = Yn(s.vertex, s.fragment, t)), xt[e];
}
function zh(s, t) {
  const e = t.map((o) => o.vertex).filter((o) => !!o), i = t.map((o) => o.fragment).filter((o) => !!o);
  let r = qi(e, s.vertex, !0);
  r = Fh(e, r);
  const n = qi(i, s.fragment, !0);
  return {
    vertex: r,
    fragment: n
  };
}
function $n(s, t) {
  return t.map((e) => (ps.has(e) || ps.set(e, Dh++), ps.get(e))).sort((e, i) => e - i).join("-") + s.vertex + s.fragment;
}
function Yn(s, t, e) {
  const i = Wi(s), r = Wi(t);
  return e.forEach((n) => {
    Xi(n.vertex, i, n.name), Xi(n.fragment, r, n.name);
  }), {
    vertex: Zi(s, i),
    fragment: Zi(t, r)
  };
}
const Uh = (
  /* wgsl */
  `
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}

        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);

        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`
), Nh = (
  /* wgsl */
  `
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;

    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {

        {{start}}

        var outColor:vec4<f32>;

        {{main}}

        var finalColor:vec4<f32> = outColor * vColor;

        {{end}}

        return finalColor;
      };
`
), Vh = (
  /* glsl */
  `
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;

        {{start}}

        vColor = vec4(1.);

        {{main}}

        vUV = uv;

        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`
), Hh = (
  /* glsl */
  `

    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {

        {{start}}

        vec4 outColor;

        {{main}}

        finalColor = outColor * vColor;

        {{end}}
    }
`
), $h = {
  name: "global-uniforms-bit",
  vertex: {
    header: (
      /* wgsl */
      `
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `
    )
  }
}, Yh = {
  name: "global-uniforms-bit",
  vertex: {
    header: (
      /* glsl */
      `
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `
    )
  }
};
function Xh({ bits: s, name: t }) {
  const e = Lh({
    template: {
      fragment: Nh,
      vertex: Uh
    },
    bits: [
      $h,
      ...s
    ]
  });
  return Ve.from({
    name: t,
    vertex: {
      source: e.vertex,
      entryPoint: "main"
    },
    fragment: {
      source: e.fragment,
      entryPoint: "main"
    }
  });
}
function Wh({ bits: s, name: t }) {
  return new _n({
    name: t,
    ...Oh({
      template: {
        vertex: Vh,
        fragment: Hh
      },
      bits: [
        Yh,
        ...s
      ]
    })
  });
}
const jh = {
  name: "color-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            @in aColor: vec4<f32>;
        `
    ),
    main: (
      /* wgsl */
      `
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `
    )
  }
}, qh = {
  name: "color-bit",
  vertex: {
    header: (
      /* glsl */
      `
            in vec4 aColor;
        `
    ),
    main: (
      /* glsl */
      `
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `
    )
  }
}, ms = {};
function Kh(s) {
  const t = [];
  if (s === 1)
    t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"), t.push("@group(1) @binding(1) var textureSampler1: sampler;");
  else {
    let e = 0;
    for (let i = 0; i < s; i++)
      t.push(`@group(1) @binding(${e++}) var textureSource${i + 1}: texture_2d<f32>;`), t.push(`@group(1) @binding(${e++}) var textureSampler${i + 1}: sampler;`);
  }
  return t.join(`
`);
}
function Zh(s) {
  const t = [];
  if (s === 1)
    t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");
  else {
    t.push("switch vTextureId {");
    for (let e = 0; e < s; e++)
      e === s - 1 ? t.push("  default:{") : t.push(`  case ${e}:{`), t.push(`      outColor = textureSampleGrad(textureSource${e + 1}, textureSampler${e + 1}, vUV, uvDx, uvDy);`), t.push("      break;}");
    t.push("}");
  }
  return t.join(`
`);
}
function Qh(s) {
  return ms[s] || (ms[s] = {
    name: "texture-batch-bit",
    vertex: {
      header: `
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,
      main: `
                vTextureId = aTextureIdAndRound.y;
            `,
      end: `
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `
    },
    fragment: {
      header: `
                @in @interpolate(flat) vTextureId: u32;

                ${Kh(s)}
            `,
      main: `
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${Zh(s)}
            `
    }
  }), ms[s];
}
const gs = {};
function Jh(s) {
  const t = [];
  for (let e = 0; e < s; e++)
    e > 0 && t.push("else"), e < s - 1 && t.push(`if(vTextureId < ${e}.5)`), t.push("{"), t.push(`	outColor = texture(uTextures[${e}], vUV);`), t.push("}");
  return t.join(`
`);
}
function tl(s) {
  return gs[s] || (gs[s] = {
    name: "texture-batch-bit",
    vertex: {
      header: `
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,
      main: `
                vTextureId = aTextureIdAndRound.y;
            `,
      end: `
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `
    },
    fragment: {
      header: `
                in float vTextureId;

                uniform sampler2D uTextures[${s}];

            `,
      main: `

                ${Jh(s)}
            `
    }
  }), gs[s];
}
const el = {
  name: "round-pixels-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `
    )
  }
}, sl = {
  name: "round-pixels-bit",
  vertex: {
    header: (
      /* glsl */
      `
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `
    )
  }
}, Qi = {};
function il(s) {
  let t = Qi[s];
  if (t) return t;
  const e = new Int32Array(s);
  for (let i = 0; i < s; i++)
    e[i] = i;
  return t = Qi[s] = new Sn({
    uTextures: { value: e, type: "i32", size: s }
  }, { isStatic: !0 }), t;
}
class Ji extends Ks {
  constructor(t) {
    const e = Wh({
      name: "batch",
      bits: [
        qh,
        tl(t),
        sl
      ]
    }), i = Xh({
      name: "batch",
      bits: [
        jh,
        Qh(t),
        el
      ]
    });
    super({
      glProgram: e,
      gpuProgram: i,
      resources: {
        batchSamplers: il(t)
      }
    }), this.maxTextures = t;
  }
}
let Qt = null;
const Xn = class Wn extends Mh {
  constructor(t) {
    super(t), this.geometry = new Ih(), this.name = Wn.extension.name, this.vertexSize = 6, Qt ?? (Qt = new Ji(t.maxTextures)), this.shader = Qt;
  }
  /**
   * Packs the attributes of a DefaultBatchableMeshElement into the provided views.
   * @param element - The DefaultBatchableMeshElement to pack.
   * @param float32View - The Float32Array view to pack into.
   * @param uint32View - The Uint32Array view to pack into.
   * @param index - The starting index in the views.
   * @param textureId - The texture ID to use.
   */
  packAttributes(t, e, i, r, n) {
    const o = n << 16 | t.roundPixels & 65535, a = t.transform, h = a.a, l = a.b, c = a.c, u = a.d, f = a.tx, d = a.ty, { positions: p, uvs: g } = t, m = t.color, x = t.attributeOffset, y = x + t.attributeSize;
    for (let _ = x; _ < y; _++) {
      const b = _ * 2, S = p[b], v = p[b + 1];
      e[r++] = h * S + c * v + f, e[r++] = u * v + l * S + d, e[r++] = g[b], e[r++] = g[b + 1], i[r++] = m, i[r++] = o;
    }
  }
  /**
   * Packs the attributes of a DefaultBatchableQuadElement into the provided views.
   * @param element - The DefaultBatchableQuadElement to pack.
   * @param float32View - The Float32Array view to pack into.
   * @param uint32View - The Uint32Array view to pack into.
   * @param index - The starting index in the views.
   * @param textureId - The texture ID to use.
   */
  packQuadAttributes(t, e, i, r, n) {
    const o = t.texture, a = t.transform, h = a.a, l = a.b, c = a.c, u = a.d, f = a.tx, d = a.ty, p = t.bounds, g = p.maxX, m = p.minX, x = p.maxY, y = p.minY, _ = o.uvs, b = t.color, S = n << 16 | t.roundPixels & 65535;
    e[r + 0] = h * m + c * y + f, e[r + 1] = u * y + l * m + d, e[r + 2] = _.x0, e[r + 3] = _.y0, i[r + 4] = b, i[r + 5] = S, e[r + 6] = h * g + c * y + f, e[r + 7] = u * y + l * g + d, e[r + 8] = _.x1, e[r + 9] = _.y1, i[r + 10] = b, i[r + 11] = S, e[r + 12] = h * g + c * x + f, e[r + 13] = u * x + l * g + d, e[r + 14] = _.x2, e[r + 15] = _.y2, i[r + 16] = b, i[r + 17] = S, e[r + 18] = h * m + c * x + f, e[r + 19] = u * x + l * m + d, e[r + 20] = _.x3, e[r + 21] = _.y3, i[r + 22] = b, i[r + 23] = S;
  }
  /**
   * Updates the maximum number of textures that can be used in the shader.
   * @param maxTextures - The maximum number of textures that can be used in the shader.
   * @internal
   */
  _updateMaxTextures(t) {
    this.shader.maxTextures !== t && (Qt = new Ji(t), this.shader = Qt);
  }
  destroy() {
    this.shader = null, super.destroy();
  }
};
Xn.extension = {
  type: [
    I.Batcher
  ],
  name: "default"
};
let rl = Xn;
class He {
  constructor(t) {
    this.items = /* @__PURE__ */ Object.create(null);
    const { renderer: e, type: i, onUnload: r, priority: n, name: o } = t;
    this._renderer = e, e.gc.addResourceHash(this, "items", i, n ?? 0), this._onUnload = r, this.name = o;
  }
  /**
   * Add an item to the hash. No-op if already added.
   * @param item
   * @returns true if the item was added, false if it was already in the hash
   */
  add(t) {
    return this.items[t.uid] ? !1 : (this.items[t.uid] = t, t.once("unload", this.remove, this), t._gcLastUsed = this._renderer.gc.now, !0);
  }
  remove(t, ...e) {
    var r;
    if (!this.items[t.uid]) return;
    const i = t._gpuData[this._renderer.uid];
    i && ((r = this._onUnload) == null || r.call(this, t, ...e), i.destroy(), t._gpuData[this._renderer.uid] = null, this.items[t.uid] = null);
  }
  removeAll(...t) {
    Object.values(this.items).forEach((e) => e && this.remove(e, ...t));
  }
  destroy(...t) {
    this.removeAll(...t), this.items = /* @__PURE__ */ Object.create(null), this._renderer = null, this._onUnload = null;
  }
}
function nl(s, t, e, i, r, n, o, a = null) {
  let h = 0;
  e *= t, r *= n;
  const l = a.a, c = a.b, u = a.c, f = a.d, d = a.tx, p = a.ty;
  for (; h < o; ) {
    const g = s[e], m = s[e + 1];
    i[r] = l * g + u * m + d, i[r + 1] = c * g + f * m + p, r += n, e += t, h++;
  }
}
function ol(s, t, e, i) {
  let r = 0;
  for (t *= e; r < i; )
    s[t] = 0, s[t + 1] = 0, t += e, r++;
}
function jn(s, t, e, i, r) {
  const n = t.a, o = t.b, a = t.c, h = t.d, l = t.tx, c = t.ty;
  e || (e = 0), i || (i = 2), r || (r = s.length / i - e);
  let u = e * i;
  for (let f = 0; f < r; f++) {
    const d = s[u], p = s[u + 1];
    s[u] = n * d + a * p + l, s[u + 1] = o * d + h * p + c, u += i;
  }
}
const al = new k();
class ti {
  constructor() {
    this.packAsQuad = !1, this.batcherName = "default", this.topology = "triangle-list", this.applyTransform = !0, this.roundPixels = 0, this._batcher = null, this._batch = null;
  }
  get uvs() {
    return this.geometryData.uvs;
  }
  get positions() {
    return this.geometryData.vertices;
  }
  get indices() {
    return this.geometryData.indices;
  }
  get blendMode() {
    return this.renderable && this.applyTransform ? this.renderable.groupBlendMode : "normal";
  }
  get color() {
    const t = this.baseColor, e = t >> 16 | t & 65280 | (t & 255) << 16, i = this.renderable;
    return i ? qr(e, i.groupColor) + (this.alpha * i.groupAlpha * 255 << 24) : e + (this.alpha * 255 << 24);
  }
  get transform() {
    var t;
    return ((t = this.renderable) == null ? void 0 : t.groupTransform) || al;
  }
  copyTo(t) {
    t.indexOffset = this.indexOffset, t.indexSize = this.indexSize, t.attributeOffset = this.attributeOffset, t.attributeSize = this.attributeSize, t.baseColor = this.baseColor, t.alpha = this.alpha, t.texture = this.texture, t.geometryData = this.geometryData, t.topology = this.topology;
  }
  reset() {
    this.applyTransform = !0, this.renderable = null, this.topology = "triangle-list";
  }
  destroy() {
    this.renderable = null, this.texture = null, this.geometryData = null, this._batcher = null, this._batch = null;
  }
}
const pe = {
  extension: {
    type: I.ShapeBuilder,
    name: "circle"
  },
  build(s, t) {
    let e, i, r, n, o, a;
    if (s.type === "circle") {
      const b = s;
      if (o = a = b.radius, o <= 0)
        return !1;
      e = b.x, i = b.y, r = n = 0;
    } else if (s.type === "ellipse") {
      const b = s;
      if (o = b.halfWidth, a = b.halfHeight, o <= 0 || a <= 0)
        return !1;
      e = b.x, i = b.y, r = n = 0;
    } else {
      const b = s, S = b.width / 2, v = b.height / 2;
      e = b.x + S, i = b.y + v, o = a = Math.max(0, Math.min(b.radius, Math.min(S, v))), r = S - o, n = v - a;
    }
    if (r < 0 || n < 0)
      return !1;
    const h = Math.ceil(2.3 * Math.sqrt(o + a)), l = h * 8 + (r ? 4 : 0) + (n ? 4 : 0);
    if (l === 0)
      return !1;
    if (h === 0)
      return t[0] = t[6] = e + r, t[1] = t[3] = i + n, t[2] = t[4] = e - r, t[5] = t[7] = i - n, !0;
    let c = 0, u = h * 4 + (r ? 2 : 0) + 2, f = u, d = l, p = r + o, g = n, m = e + p, x = e - p, y = i + g;
    if (t[c++] = m, t[c++] = y, t[--u] = y, t[--u] = x, n) {
      const b = i - g;
      t[f++] = x, t[f++] = b, t[--d] = b, t[--d] = m;
    }
    for (let b = 1; b < h; b++) {
      const S = Math.PI / 2 * (b / h), v = r + Math.cos(S) * o, w = n + Math.sin(S) * a, M = e + v, P = e - v, C = i + w, A = i - w;
      t[c++] = M, t[c++] = C, t[--u] = C, t[--u] = P, t[f++] = P, t[f++] = A, t[--d] = A, t[--d] = M;
    }
    p = r, g = n + a, m = e + p, x = e - p, y = i + g;
    const _ = i - g;
    return t[c++] = m, t[c++] = y, t[--d] = _, t[--d] = m, r && (t[c++] = x, t[c++] = y, t[--d] = _, t[--d] = x), !0;
  },
  triangulate(s, t, e, i, r, n) {
    if (s.length === 0)
      return;
    let o = 0, a = 0;
    for (let c = 0; c < s.length; c += 2)
      o += s[c], a += s[c + 1];
    o /= s.length / 2, a /= s.length / 2;
    let h = i;
    t[h * e] = o, t[h * e + 1] = a;
    const l = h++;
    for (let c = 0; c < s.length; c += 2)
      t[h * e] = s[c], t[h * e + 1] = s[c + 1], c > 0 && (r[n++] = h, r[n++] = l, r[n++] = h - 1), h++;
    r[n++] = l + 1, r[n++] = l, r[n++] = h - 1;
  }
}, hl = { ...pe, extension: { ...pe.extension, name: "ellipse" } }, ll = { ...pe, extension: { ...pe.extension, name: "roundedRectangle" } }, qn = 1e-4, tr = 1e-4;
function cl(s) {
  const t = s.length;
  if (t < 6)
    return 1;
  let e = 0;
  for (let i = 0, r = s[t - 2], n = s[t - 1]; i < t; i += 2) {
    const o = s[i], a = s[i + 1];
    e += (o - r) * (a + n), r = o, n = a;
  }
  return e < 0 ? -1 : 1;
}
function er(s, t, e, i, r, n, o, a) {
  const h = s - e * r, l = t - i * r, c = s + e * n, u = t + i * n;
  let f, d;
  o ? (f = i, d = -e) : (f = -i, d = e);
  const p = h + f, g = l + d, m = c + f, x = u + d;
  return a.push(p, g), a.push(m, x), 2;
}
function Ct(s, t, e, i, r, n, o, a) {
  const h = e - s, l = i - t;
  let c = Math.atan2(h, l), u = Math.atan2(r - s, n - t);
  a && c < u ? c += Math.PI * 2 : !a && c > u && (u += Math.PI * 2);
  let f = c;
  const d = u - c, p = Math.abs(d), g = Math.sqrt(h * h + l * l), m = (15 * p * Math.sqrt(g) / Math.PI >> 0) + 1, x = d / m;
  if (f += x, a) {
    o.push(s, t), o.push(e, i);
    for (let y = 1, _ = f; y < m; y++, _ += x)
      o.push(s, t), o.push(
        s + Math.sin(_) * g,
        t + Math.cos(_) * g
      );
    o.push(s, t), o.push(r, n);
  } else {
    o.push(e, i), o.push(s, t);
    for (let y = 1, _ = f; y < m; y++, _ += x)
      o.push(
        s + Math.sin(_) * g,
        t + Math.cos(_) * g
      ), o.push(s, t);
    o.push(r, n), o.push(s, t);
  }
  return m * 2;
}
function ul(s, t, e, i, r, n) {
  const o = qn;
  if (s.length === 0)
    return;
  const a = t;
  let h = a.alignment;
  if (t.alignment !== 0.5) {
    let R = cl(s);
    h = (h - 0.5) * R + 0.5;
  }
  const l = new j(s[0], s[1]), c = new j(s[s.length - 2], s[s.length - 1]), u = i, f = Math.abs(l.x - c.x) < o && Math.abs(l.y - c.y) < o;
  if (u) {
    s = s.slice(), f && (s.pop(), s.pop(), c.set(s[s.length - 2], s[s.length - 1]));
    const R = (l.x + c.x) * 0.5, gt = (c.y + l.y) * 0.5;
    s.unshift(R, gt), s.push(R, gt);
  }
  const d = r, p = s.length / 2;
  let g = s.length;
  const m = d.length / 2, x = a.width / 2, y = x * x, _ = a.miterLimit * a.miterLimit;
  let b = s[0], S = s[1], v = s[2], w = s[3], M = 0, P = 0, C = -(S - w), A = b - v, F = 0, O = 0, z = Math.sqrt(C * C + A * A);
  C /= z, A /= z, C *= x, A *= x;
  const It = h, T = (1 - It) * 2, E = It * 2;
  u || (a.cap === "round" ? g += Ct(
    b - C * (T - E) * 0.5,
    S - A * (T - E) * 0.5,
    b - C * T,
    S - A * T,
    b + C * E,
    S + A * E,
    d,
    !0
  ) + 2 : a.cap === "square" && (g += er(b, S, C, A, T, E, !0, d))), d.push(
    b - C * T,
    S - A * T
  ), d.push(
    b + C * E,
    S + A * E
  );
  for (let R = 1; R < p - 1; ++R) {
    b = s[(R - 1) * 2], S = s[(R - 1) * 2 + 1], v = s[R * 2], w = s[R * 2 + 1], M = s[(R + 1) * 2], P = s[(R + 1) * 2 + 1], C = -(S - w), A = b - v, z = Math.sqrt(C * C + A * A), C /= z, A /= z, C *= x, A *= x, F = -(w - P), O = v - M, z = Math.sqrt(F * F + O * O), F /= z, O /= z, F *= x, O *= x;
    const gt = v - b, Ht = S - w, $t = v - M, Yt = P - w, oi = gt * $t + Ht * Yt, xe = Ht * $t - Yt * gt, Xt = xe < 0;
    if (Math.abs(xe) < 1e-3 * Math.abs(oi)) {
      d.push(
        v - C * T,
        w - A * T
      ), d.push(
        v + C * E,
        w + A * E
      ), oi >= 0 && (a.join === "round" ? g += Ct(
        v,
        w,
        v - C * T,
        w - A * T,
        v - F * T,
        w - O * T,
        d,
        !1
      ) + 4 : g += 2, d.push(
        v - F * E,
        w - O * E
      ), d.push(
        v + F * T,
        w + O * T
      ));
      continue;
    }
    const ai = (-C + b) * (-A + w) - (-C + v) * (-A + S), hi = (-F + M) * (-O + w) - (-F + v) * (-O + P), ye = (gt * hi - $t * ai) / xe, _e = (Yt * ai - Ht * hi) / xe, Xe = (ye - v) * (ye - v) + (_e - w) * (_e - w), bt = v + (ye - v) * T, vt = w + (_e - w) * T, wt = v - (ye - v) * E, St = w - (_e - w) * E, oo = Math.min(gt * gt + Ht * Ht, $t * $t + Yt * Yt), li = Xt ? T : E, ao = oo + li * li * y;
    Xe <= ao ? a.join === "bevel" || Xe / y > _ ? (Xt ? (d.push(bt, vt), d.push(v + C * E, w + A * E), d.push(bt, vt), d.push(v + F * E, w + O * E)) : (d.push(v - C * T, w - A * T), d.push(wt, St), d.push(v - F * T, w - O * T), d.push(wt, St)), g += 2) : a.join === "round" ? Xt ? (d.push(bt, vt), d.push(v + C * E, w + A * E), g += Ct(
      v,
      w,
      v + C * E,
      w + A * E,
      v + F * E,
      w + O * E,
      d,
      !0
    ) + 4, d.push(bt, vt), d.push(v + F * E, w + O * E)) : (d.push(v - C * T, w - A * T), d.push(wt, St), g += Ct(
      v,
      w,
      v - C * T,
      w - A * T,
      v - F * T,
      w - O * T,
      d,
      !1
    ) + 4, d.push(v - F * T, w - O * T), d.push(wt, St)) : (d.push(bt, vt), d.push(wt, St)) : (d.push(v - C * T, w - A * T), d.push(v + C * E, w + A * E), a.join === "round" ? Xt ? g += Ct(
      v,
      w,
      v + C * E,
      w + A * E,
      v + F * E,
      w + O * E,
      d,
      !0
    ) + 2 : g += Ct(
      v,
      w,
      v - C * T,
      w - A * T,
      v - F * T,
      w - O * T,
      d,
      !1
    ) + 2 : a.join === "miter" && Xe / y <= _ && (Xt ? (d.push(wt, St), d.push(wt, St)) : (d.push(bt, vt), d.push(bt, vt)), g += 2), d.push(v - F * T, w - O * T), d.push(v + F * E, w + O * E), g += 2);
  }
  b = s[(p - 2) * 2], S = s[(p - 2) * 2 + 1], v = s[(p - 1) * 2], w = s[(p - 1) * 2 + 1], C = -(S - w), A = b - v, z = Math.sqrt(C * C + A * A), C /= z, A /= z, C *= x, A *= x, d.push(v - C * T, w - A * T), d.push(v + C * E, w + A * E), u || (a.cap === "round" ? g += Ct(
    v - C * (T - E) * 0.5,
    w - A * (T - E) * 0.5,
    v - C * T,
    w - A * T,
    v + C * E,
    w + A * E,
    d,
    !1
  ) + 2 : a.cap === "square" && (g += er(v, w, C, A, T, E, !1, d)));
  const Vt = tr * tr;
  for (let R = m; R < g + m - 2; ++R)
    b = d[R * 2], S = d[R * 2 + 1], v = d[(R + 1) * 2], w = d[(R + 1) * 2 + 1], M = d[(R + 2) * 2], P = d[(R + 2) * 2 + 1], !(Math.abs(b * (w - P) + v * (P - S) + M * (S - w)) < Vt) && n.push(R, R + 1, R + 2);
}
function dl(s, t, e, i) {
  const r = qn;
  if (s.length === 0)
    return;
  const n = s[0], o = s[1], a = s[s.length - 2], h = s[s.length - 1], l = t || Math.abs(n - a) < r && Math.abs(o - h) < r, c = e, u = s.length / 2, f = c.length / 2;
  for (let d = 0; d < u; d++)
    c.push(s[d * 2]), c.push(s[d * 2 + 1]);
  for (let d = 0; d < u - 1; d++)
    i.push(f + d, f + d + 1);
  l && i.push(f + u - 1, f);
}
function Kn(s, t, e, i, r, n, o) {
  const a = Qa(s, t, 2);
  if (!a)
    return;
  for (let l = 0; l < a.length; l += 3)
    n[o++] = a[l] + r, n[o++] = a[l + 1] + r, n[o++] = a[l + 2] + r;
  let h = r * i;
  for (let l = 0; l < s.length; l += 2)
    e[h] = s[l], e[h + 1] = s[l + 1], h += i;
}
const fl = [], pl = {
  extension: {
    type: I.ShapeBuilder,
    name: "polygon"
  },
  build(s, t) {
    for (let e = 0; e < s.points.length; e++)
      t[e] = s.points[e];
    return !0;
  },
  triangulate(s, t, e, i, r, n) {
    Kn(s, fl, t, e, i, r, n);
  }
}, ml = {
  extension: {
    type: I.ShapeBuilder,
    name: "rectangle"
  },
  build(s, t) {
    const e = s, i = e.x, r = e.y, n = e.width, o = e.height;
    return n > 0 && o > 0 ? (t[0] = i, t[1] = r, t[2] = i + n, t[3] = r, t[4] = i + n, t[5] = r + o, t[6] = i, t[7] = r + o, !0) : !1;
  },
  triangulate(s, t, e, i, r, n) {
    let o = 0;
    i *= e, t[i + o] = s[0], t[i + o + 1] = s[1], o += e, t[i + o] = s[2], t[i + o + 1] = s[3], o += e, t[i + o] = s[6], t[i + o + 1] = s[7], o += e, t[i + o] = s[4], t[i + o + 1] = s[5], o += e;
    const a = i / e;
    r[n++] = a, r[n++] = a + 1, r[n++] = a + 2, r[n++] = a + 1, r[n++] = a + 3, r[n++] = a + 2;
  }
}, gl = {
  extension: {
    type: I.ShapeBuilder,
    name: "triangle"
  },
  build(s, t) {
    return t[0] = s.x, t[1] = s.y, t[2] = s.x2, t[3] = s.y2, t[4] = s.x3, t[5] = s.y3, !0;
  },
  triangulate(s, t, e, i, r, n) {
    let o = 0;
    i *= e, t[i + o] = s[0], t[i + o + 1] = s[1], o += e, t[i + o] = s[2], t[i + o + 1] = s[3], o += e, t[i + o] = s[4], t[i + o + 1] = s[5];
    const a = i / e;
    r[n++] = a, r[n++] = a + 1, r[n++] = a + 2;
  }
}, sr = [{ offset: 0, color: "white" }, { offset: 1, color: "black" }], ei = class Os {
  constructor(...t) {
    this.uid = V("fillGradient"), this._tick = 0, this.type = "linear", this.colorStops = [];
    let e = xl(t);
    e = { ...e.type === "radial" ? Os.defaultRadialOptions : Os.defaultLinearOptions, ...Or(e) }, this._textureSize = e.textureSize, this._wrapMode = e.wrapMode, e.type === "radial" ? (this.center = e.center, this.outerCenter = e.outerCenter ?? this.center, this.innerRadius = e.innerRadius, this.outerRadius = e.outerRadius, this.scale = e.scale, this.rotation = e.rotation) : (this.start = e.start, this.end = e.end), this.textureSpace = e.textureSpace, this.type = e.type, e.colorStops.forEach((r) => {
      this.addColorStop(r.offset, r.color);
    });
  }
  /**
   * Adds a color stop to the gradient
   * @param offset - Position of the stop (0-1)
   * @param color - Color of the stop
   * @returns This gradient instance for chaining
   */
  addColorStop(t, e) {
    return this.colorStops.push({ offset: t, color: rt.shared.setValue(e).toHexa() }), this;
  }
  /**
   * Builds the internal texture and transform for the gradient.
   * Called automatically when the gradient is first used.
   * @internal
   */
  buildLinearGradient() {
    if (this.texture) return;
    let { x: t, y: e } = this.start, { x: i, y: r } = this.end, n = i - t, o = r - e;
    const a = n < 0 || o < 0;
    if (this._wrapMode === "clamp-to-edge") {
      if (n < 0) {
        const m = t;
        t = i, i = m, n *= -1;
      }
      if (o < 0) {
        const m = e;
        e = r, r = m, o *= -1;
      }
    }
    const h = this.colorStops.length ? this.colorStops : sr, l = this._textureSize, { canvas: c, context: u } = rr(l, 1), f = a ? u.createLinearGradient(this._textureSize, 0, 0, 0) : u.createLinearGradient(0, 0, this._textureSize, 0);
    ir(f, h), u.fillStyle = f, u.fillRect(0, 0, l, 1), this.texture = new L({
      source: new De({
        resource: c,
        addressMode: this._wrapMode
      })
    });
    const d = Math.sqrt(n * n + o * o), p = Math.atan2(o, n), g = new k();
    g.scale(d / l, 1), g.rotate(p), g.translate(t, e), this.textureSpace === "local" && g.scale(l, l), this.transform = g;
  }
  /**
   * Builds the internal texture and transform for the gradient.
   * Called automatically when the gradient is first used.
   * @internal
   */
  buildGradient() {
    this.texture || this._tick++, this.type === "linear" ? this.buildLinearGradient() : this.buildRadialGradient();
  }
  /**
   * Builds the internal texture and transform for the radial gradient.
   * Called automatically when the gradient is first used.
   * @internal
   */
  buildRadialGradient() {
    if (this.texture) return;
    const t = this.colorStops.length ? this.colorStops : sr, e = this._textureSize, { canvas: i, context: r } = rr(e, e), { x: n, y: o } = this.center, { x: a, y: h } = this.outerCenter, l = this.innerRadius, c = this.outerRadius, u = a - c, f = h - c, d = e / (c * 2), p = (n - u) * d, g = (o - f) * d, m = r.createRadialGradient(
      p,
      g,
      l * d,
      (a - u) * d,
      (h - f) * d,
      c * d
    );
    ir(m, t), r.fillStyle = t[t.length - 1].color, r.fillRect(0, 0, e, e), r.fillStyle = m, r.translate(p, g), r.rotate(this.rotation), r.scale(1, this.scale), r.translate(-p, -g), r.fillRect(0, 0, e, e), this.texture = new L({
      source: new De({
        resource: i,
        addressMode: this._wrapMode
      })
    });
    const x = new k();
    x.scale(1 / d, 1 / d), x.translate(u, f), this.textureSpace === "local" && x.scale(e, e), this.transform = x;
  }
  /** Destroys the gradient, releasing resources. This will also destroy the internal texture. */
  destroy() {
    var t;
    (t = this.texture) == null || t.destroy(!0), this.texture = null, this.transform = null, this.colorStops = [], this.start = null, this.end = null, this.center = null, this.outerCenter = null;
  }
  /**
   * Returns a unique key for this gradient instance.
   * This key is used for caching and texture management.
   * @returns {string} Unique key for the gradient
   */
  get styleKey() {
    return `fill-gradient-${this.uid}-${this._tick}`;
  }
};
ei.defaultLinearOptions = {
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
  colorStops: [],
  textureSpace: "local",
  type: "linear",
  textureSize: 256,
  wrapMode: "clamp-to-edge"
};
ei.defaultRadialOptions = {
  center: { x: 0.5, y: 0.5 },
  innerRadius: 0,
  outerRadius: 0.5,
  colorStops: [],
  scale: 1,
  textureSpace: "local",
  type: "radial",
  textureSize: 256,
  wrapMode: "clamp-to-edge"
};
let ge = ei;
function ir(s, t) {
  for (let e = 0; e < t.length; e++) {
    const i = t[e];
    s.addColorStop(i.offset, i.color);
  }
}
function rr(s, t) {
  const e = _t.get().createCanvas(s, t), i = e.getContext("2d");
  return { canvas: e, context: i };
}
function xl(s) {
  let t = s[0] ?? {};
  return (typeof t == "number" || s[1]) && (B("8.5.2", "use options object instead"), t = {
    type: "linear",
    start: { x: s[0], y: s[1] },
    end: { x: s[2], y: s[3] },
    textureSpace: s[4],
    textureSize: s[5] ?? ge.defaultLinearOptions.textureSize
  }), t;
}
const yl = new k(), _l = new Y();
function bl(s, t, e, i) {
  const r = t.matrix ? s.copyFrom(t.matrix).invert() : s.identity();
  if (t.textureSpace === "local") {
    const o = e.getBounds(_l);
    t.width && o.pad(t.width);
    const { x: a, y: h } = o, l = 1 / o.width, c = 1 / o.height, u = -a * l, f = -h * c, d = r.a, p = r.b, g = r.c, m = r.d;
    r.a *= l, r.b *= l, r.c *= c, r.d *= c, r.tx = u * d + f * g + r.tx, r.ty = u * p + f * m + r.ty;
  } else
    r.translate(t.texture.frame.x, t.texture.frame.y), r.scale(1 / t.texture.source.width, 1 / t.texture.source.height);
  const n = t.texture.source.style;
  return !(t.fill instanceof ge) && n.addressMode === "clamp-to-edge" && (n.addressMode = "repeat", n.update()), i && r.append(yl.copyFrom(i).invert()), r;
}
const $e = {};
X.handleByMap(I.ShapeBuilder, $e);
X.add(ml, pl, gl, pe, hl, ll);
const vl = new Y(), wl = new k();
function Sl(s, t) {
  const { geometryData: e, batches: i } = t;
  i.length = 0, e.indices.length = 0, e.vertices.length = 0, e.uvs.length = 0;
  for (let r = 0; r < s.instructions.length; r++) {
    const n = s.instructions[r];
    if (n.action === "texture")
      Cl(n.data, i, e);
    else if (n.action === "fill" || n.action === "stroke") {
      const o = n.action === "stroke", a = n.data.path.shapePath, h = n.data.style, l = n.data.hole;
      o && l && nr(l.shapePath, h, !0, i, e), l && (a.shapePrimitives[a.shapePrimitives.length - 1].holes = l.shapePath.shapePrimitives), nr(a, h, o, i, e);
    }
  }
}
function Cl(s, t, e) {
  const i = [], r = $e.rectangle, n = vl;
  n.x = s.dx, n.y = s.dy, n.width = s.dw, n.height = s.dh;
  const o = s.transform;
  if (!r.build(n, i))
    return;
  const { vertices: a, uvs: h, indices: l } = e, c = l.length, u = a.length / 2;
  o && jn(i, o), r.triangulate(i, a, 2, u, l, c);
  const f = s.image, d = f.uvs;
  h.push(
    d.x0,
    d.y0,
    d.x1,
    d.y1,
    d.x3,
    d.y3,
    d.x2,
    d.y2
  );
  const p = Z.get(ti);
  p.indexOffset = c, p.indexSize = l.length - c, p.attributeOffset = u, p.attributeSize = a.length / 2 - u, p.baseColor = s.style, p.alpha = s.alpha, p.texture = f, p.geometryData = e, t.push(p);
}
function nr(s, t, e, i, r) {
  const { vertices: n, uvs: o, indices: a } = r;
  s.shapePrimitives.forEach(({ shape: h, transform: l, holes: c }) => {
    const u = [], f = $e[h.type];
    if (!f.build(h, u))
      return;
    const d = a.length, p = n.length / 2;
    let g = "triangle-list";
    if (l && jn(u, l), e) {
      const _ = h.closePath ?? !0, b = t;
      b.pixelLine ? (dl(u, _, n, a), g = "line-list") : ul(u, b, !1, _, n, a);
    } else if (c) {
      const _ = [], b = u.slice();
      Ml(c).forEach((v) => {
        _.push(b.length / 2), b.push(...v);
      }), Kn(b, _, n, 2, p, a, d);
    } else
      f.triangulate(u, n, 2, p, a, d);
    const m = o.length / 2, x = t.texture;
    if (x !== L.WHITE) {
      const _ = bl(wl, t, h, l);
      nl(n, 2, p, o, m, 2, n.length / 2 - p, _);
    } else
      ol(o, m, 2, n.length / 2 - p);
    const y = Z.get(ti);
    y.indexOffset = d, y.indexSize = a.length - d, y.attributeOffset = p, y.attributeSize = n.length / 2 - p, y.baseColor = t.color, y.alpha = t.alpha, y.texture = x, y.geometryData = r, y.topology = g, i.push(y);
  });
}
function Ml(s) {
  const t = [];
  for (let e = 0; e < s.length; e++) {
    const i = s[e].shape, r = [];
    $e[i.type].build(i, r) && t.push(r);
  }
  return t;
}
class Al {
  constructor() {
    this.batches = [], this.geometryData = {
      vertices: [],
      uvs: [],
      indices: []
    };
  }
  reset() {
    this.batches && this.batches.forEach((t) => {
      Z.return(t);
    }), this.graphicsData && Z.return(this.graphicsData), this.isBatchable = !1, this.context = null, this.batches.length = 0, this.geometryData.indices.length = 0, this.geometryData.vertices.length = 0, this.geometryData.uvs.length = 0, this.graphicsData = null;
  }
  destroy() {
    this.reset(), this.batches = null, this.geometryData = null;
  }
}
class Tl {
  constructor() {
    this.instructions = new js();
  }
  init(t) {
    const e = t.maxTextures;
    this.batcher ? this.batcher._updateMaxTextures(e) : this.batcher = new rl({ maxTextures: e }), this.instructions.reset();
  }
  /**
   * @deprecated since version 8.0.0
   * Use `batcher.geometry` instead.
   * @see {Batcher#geometry}
   */
  get geometry() {
    return B(_o, "GraphicsContextRenderData#geometry is deprecated, please use batcher.geometry instead."), this.batcher.geometry;
  }
  destroy() {
    this.batcher.destroy(), this.instructions.destroy(), this.batcher = null, this.instructions = null;
  }
}
const si = class zs {
  constructor(t) {
    this._renderer = t, this._managedContexts = new He({ renderer: t, type: "resource", name: "graphicsContext" });
  }
  /**
   * Runner init called, update the default options
   * @ignore
   */
  init(t) {
    zs.defaultOptions.bezierSmoothness = (t == null ? void 0 : t.bezierSmoothness) ?? zs.defaultOptions.bezierSmoothness;
  }
  /**
   * Returns the render data for a given GraphicsContext.
   * @param context - The GraphicsContext to get the render data for.
   * @internal
   */
  getContextRenderData(t) {
    return t._gpuData[this._renderer.uid].graphicsData || this._initContextRenderData(t);
  }
  /**
   * Updates the GPU context for a given GraphicsContext.
   * If the context is dirty, it will rebuild the batches and geometry data.
   * @param context - The GraphicsContext to update.
   * @returns The updated GpuGraphicsContext.
   * @internal
   */
  updateGpuContext(t) {
    const e = !!t._gpuData[this._renderer.uid], i = t._gpuData[this._renderer.uid] || this._initContext(t);
    if (t.dirty || !e) {
      e && i.reset(), Sl(t, i);
      const r = t.batchMode;
      t.customShader || r === "no-batch" ? i.isBatchable = !1 : r === "auto" ? i.isBatchable = i.geometryData.vertices.length < 400 : i.isBatchable = !0, t.dirty = !1;
    }
    return i;
  }
  /**
   * Returns the GpuGraphicsContext for a given GraphicsContext.
   * If it does not exist, it will initialize a new one.
   * @param context - The GraphicsContext to get the GpuGraphicsContext for.
   * @returns The GpuGraphicsContext for the given GraphicsContext.
   * @internal
   */
  getGpuContext(t) {
    return t._gpuData[this._renderer.uid] || this._initContext(t);
  }
  _initContextRenderData(t) {
    const e = Z.get(Tl, {
      maxTextures: this._renderer.limits.maxBatchableTextures
    }), i = t._gpuData[this._renderer.uid], { batches: r, geometryData: n } = i;
    i.graphicsData = e;
    const o = n.vertices.length, a = n.indices.length;
    for (let u = 0; u < r.length; u++)
      r[u].applyTransform = !1;
    const h = e.batcher;
    h.ensureAttributeBuffer(o), h.ensureIndexBuffer(a), h.begin();
    for (let u = 0; u < r.length; u++) {
      const f = r[u];
      h.add(f);
    }
    h.finish(e.instructions);
    const l = h.geometry;
    l.indexBuffer.setDataWithSize(h.indexBuffer, h.indexSize, !0), l.buffers[0].setDataWithSize(h.attributeBuffer.float32View, h.attributeSize, !0);
    const c = h.batches;
    for (let u = 0; u < c.length; u++) {
      const f = c[u];
      f.bindGroup = mh(
        f.textures.textures,
        f.textures.count,
        this._renderer.limits.maxBatchableTextures
      );
    }
    return e;
  }
  _initContext(t) {
    const e = new Al();
    return e.context = t, t._gpuData[this._renderer.uid] = e, this._managedContexts.add(t), e;
  }
  destroy() {
    this._managedContexts.destroy(), this._renderer = null;
  }
};
si.extension = {
  type: [
    I.WebGLSystem,
    I.WebGPUSystem
  ],
  name: "graphicsContext"
};
si.defaultOptions = {
  /**
   * A value from 0 to 1 that controls the smoothness of bezier curves (the higher the smoother)
   * @default 0.5
   */
  bezierSmoothness: 0.5
};
let ii = si;
const Pl = 8, Re = 11920929e-14, El = 1;
function Zn(s, t, e, i, r, n, o, a, h, l) {
  const u = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, l ?? ii.defaultOptions.bezierSmoothness)
  );
  let f = (El - u) / 1;
  return f *= f, kl(t, e, i, r, n, o, a, h, s, f), s;
}
function kl(s, t, e, i, r, n, o, a, h, l) {
  Us(s, t, e, i, r, n, o, a, h, l, 0), h.push(o, a);
}
function Us(s, t, e, i, r, n, o, a, h, l, c) {
  if (c > Pl)
    return;
  const u = (s + e) / 2, f = (t + i) / 2, d = (e + r) / 2, p = (i + n) / 2, g = (r + o) / 2, m = (n + a) / 2, x = (u + d) / 2, y = (f + p) / 2, _ = (d + g) / 2, b = (p + m) / 2, S = (x + _) / 2, v = (y + b) / 2;
  if (c > 0) {
    let w = o - s, M = a - t;
    const P = Math.abs((e - o) * M - (i - a) * w), C = Math.abs((r - o) * M - (n - a) * w);
    if (P > Re && C > Re) {
      if ((P + C) * (P + C) <= l * (w * w + M * M)) {
        h.push(S, v);
        return;
      }
    } else if (P > Re) {
      if (P * P <= l * (w * w + M * M)) {
        h.push(S, v);
        return;
      }
    } else if (C > Re) {
      if (C * C <= l * (w * w + M * M)) {
        h.push(S, v);
        return;
      }
    } else if (w = S - (s + o) / 2, M = v - (t + a) / 2, w * w + M * M <= l) {
      h.push(S, v);
      return;
    }
  }
  Us(s, t, u, f, x, y, S, v, h, l, c + 1), Us(S, v, _, b, g, m, o, a, h, l, c + 1);
}
const Il = 8, Rl = 11920929e-14, Gl = 1;
function Bl(s, t, e, i, r, n, o, a) {
  const l = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, a ?? ii.defaultOptions.bezierSmoothness)
  );
  let c = (Gl - l) / 1;
  return c *= c, Fl(t, e, i, r, n, o, s, c), s;
}
function Fl(s, t, e, i, r, n, o, a) {
  Ns(o, s, t, e, i, r, n, a, 0), o.push(r, n);
}
function Ns(s, t, e, i, r, n, o, a, h) {
  if (h > Il)
    return;
  const l = (t + i) / 2, c = (e + r) / 2, u = (i + n) / 2, f = (r + o) / 2, d = (l + u) / 2, p = (c + f) / 2;
  let g = n - t, m = o - e;
  const x = Math.abs((i - n) * m - (r - o) * g);
  if (x > Rl) {
    if (x * x <= a * (g * g + m * m)) {
      s.push(d, p);
      return;
    }
  } else if (g = d - (t + n) / 2, m = p - (e + o) / 2, g * g + m * m <= a) {
    s.push(d, p);
    return;
  }
  Ns(s, t, e, l, c, d, p, a, h + 1), Ns(s, d, p, u, f, n, o, a, h + 1);
}
function Qn(s, t, e, i, r, n, o, a) {
  let h = Math.abs(r - n);
  (!o && r > n || o && n > r) && (h = 2 * Math.PI - h), a || (a = Math.max(6, Math.floor(6 * Math.pow(i, 1 / 3) * (h / Math.PI)))), a = Math.max(a, 3);
  let l = h / a, c = r;
  l *= o ? -1 : 1;
  for (let u = 0; u < a + 1; u++) {
    const f = Math.cos(c), d = Math.sin(c), p = t + f * i, g = e + d * i;
    s.push(p, g), c += l;
  }
}
function Dl(s, t, e, i, r, n) {
  const o = s[s.length - 2], h = s[s.length - 1] - e, l = o - t, c = r - e, u = i - t, f = Math.abs(h * u - l * c);
  if (f < 1e-8 || n === 0) {
    (s[s.length - 2] !== t || s[s.length - 1] !== e) && s.push(t, e);
    return;
  }
  const d = h * h + l * l, p = c * c + u * u, g = h * c + l * u, m = n * Math.sqrt(d) / f, x = n * Math.sqrt(p) / f, y = m * g / d, _ = x * g / p, b = m * u + x * l, S = m * c + x * h, v = l * (x + y), w = h * (x + y), M = u * (m + _), P = c * (m + _), C = Math.atan2(w - S, v - b), A = Math.atan2(P - S, M - b);
  Qn(
    s,
    b + t,
    S + e,
    n,
    C,
    A,
    l * c > u * h
  );
}
const ae = Math.PI * 2, xs = {
  centerX: 0,
  centerY: 0,
  ang1: 0,
  ang2: 0
}, ys = ({ x: s, y: t }, e, i, r, n, o, a, h) => {
  s *= e, t *= i;
  const l = r * s - n * t, c = n * s + r * t;
  return h.x = l + o, h.y = c + a, h;
};
function Ll(s, t) {
  const e = t === -1.5707963267948966 ? -0.551915024494 : 1.3333333333333333 * Math.tan(t / 4), i = t === 1.5707963267948966 ? 0.551915024494 : e, r = Math.cos(s), n = Math.sin(s), o = Math.cos(s + t), a = Math.sin(s + t);
  return [
    {
      x: r - n * i,
      y: n + r * i
    },
    {
      x: o + a * i,
      y: a - o * i
    },
    {
      x: o,
      y: a
    }
  ];
}
const or = (s, t, e, i) => {
  const r = s * i - t * e < 0 ? -1 : 1;
  let n = s * e + t * i;
  return n > 1 && (n = 1), n < -1 && (n = -1), r * Math.acos(n);
}, Ol = (s, t, e, i, r, n, o, a, h, l, c, u, f) => {
  const d = Math.pow(r, 2), p = Math.pow(n, 2), g = Math.pow(c, 2), m = Math.pow(u, 2);
  let x = d * p - d * m - p * g;
  x < 0 && (x = 0), x /= d * m + p * g, x = Math.sqrt(x) * (o === a ? -1 : 1);
  const y = x * r / n * u, _ = x * -n / r * c, b = l * y - h * _ + (s + e) / 2, S = h * y + l * _ + (t + i) / 2, v = (c - y) / r, w = (u - _) / n, M = (-c - y) / r, P = (-u - _) / n, C = or(1, 0, v, w);
  let A = or(v, w, M, P);
  a === 0 && A > 0 && (A -= ae), a === 1 && A < 0 && (A += ae), f.centerX = b, f.centerY = S, f.ang1 = C, f.ang2 = A;
};
function zl(s, t, e, i, r, n, o, a = 0, h = 0, l = 0) {
  if (n === 0 || o === 0)
    return;
  const c = Math.sin(a * ae / 360), u = Math.cos(a * ae / 360), f = u * (t - i) / 2 + c * (e - r) / 2, d = -c * (t - i) / 2 + u * (e - r) / 2;
  if (f === 0 && d === 0)
    return;
  n = Math.abs(n), o = Math.abs(o);
  const p = Math.pow(f, 2) / Math.pow(n, 2) + Math.pow(d, 2) / Math.pow(o, 2);
  p > 1 && (n *= Math.sqrt(p), o *= Math.sqrt(p)), Ol(
    t,
    e,
    i,
    r,
    n,
    o,
    h,
    l,
    c,
    u,
    f,
    d,
    xs
  );
  let { ang1: g, ang2: m } = xs;
  const { centerX: x, centerY: y } = xs;
  let _ = Math.abs(m) / (ae / 4);
  Math.abs(1 - _) < 1e-7 && (_ = 1);
  const b = Math.max(Math.ceil(_), 1);
  m /= b;
  let S = s[s.length - 2], v = s[s.length - 1];
  const w = { x: 0, y: 0 };
  for (let M = 0; M < b; M++) {
    const P = Ll(g, m), { x: C, y: A } = ys(P[0], n, o, u, c, x, y, w), { x: F, y: O } = ys(P[1], n, o, u, c, x, y, w), { x: z, y: It } = ys(P[2], n, o, u, c, x, y, w);
    Zn(
      s,
      S,
      v,
      C,
      A,
      F,
      O,
      z,
      It
    ), S = z, v = It, g += m;
  }
}
function Ul(s, t, e) {
  const i = (o, a) => {
    const h = a.x - o.x, l = a.y - o.y, c = Math.sqrt(h * h + l * l), u = h / c, f = l / c;
    return { len: c, nx: u, ny: f };
  }, r = (o, a) => {
    o === 0 ? s.moveTo(a.x, a.y) : s.lineTo(a.x, a.y);
  };
  let n = t[t.length - 1];
  for (let o = 0; o < t.length; o++) {
    const a = t[o % t.length], h = a.radius ?? e;
    if (h <= 0) {
      r(o, a), n = a;
      continue;
    }
    const l = t[(o + 1) % t.length], c = i(a, n), u = i(a, l);
    if (c.len < 1e-4 || u.len < 1e-4) {
      r(o, a), n = a;
      continue;
    }
    let f = Math.asin(c.nx * u.ny - c.ny * u.nx), d = 1, p = !1;
    c.nx * u.nx - c.ny * -u.ny < 0 ? f < 0 ? f = Math.PI + f : (f = Math.PI - f, d = -1, p = !0) : f > 0 && (d = -1, p = !0);
    const g = f / 2;
    let m, x = Math.abs(
      Math.cos(g) * h / Math.sin(g)
    );
    x > Math.min(c.len / 2, u.len / 2) ? (x = Math.min(c.len / 2, u.len / 2), m = Math.abs(x * Math.sin(g) / Math.cos(g))) : m = h;
    const y = a.x + u.nx * x + -u.ny * m * d, _ = a.y + u.ny * x + u.nx * m * d, b = Math.atan2(c.ny, c.nx) + Math.PI / 2 * d, S = Math.atan2(u.ny, u.nx) - Math.PI / 2 * d;
    o === 0 && s.moveTo(
      y + Math.cos(b) * m,
      _ + Math.sin(b) * m
    ), s.arc(y, _, m, b, S, p), n = a;
  }
}
function Nl(s, t, e, i) {
  const r = (a, h) => Math.sqrt((a.x - h.x) ** 2 + (a.y - h.y) ** 2), n = (a, h, l) => ({
    x: a.x + (h.x - a.x) * l,
    y: a.y + (h.y - a.y) * l
  }), o = t.length;
  for (let a = 0; a < o; a++) {
    const h = t[(a + 1) % o], l = h.radius ?? e;
    if (l <= 0) {
      a === 0 ? s.moveTo(h.x, h.y) : s.lineTo(h.x, h.y);
      continue;
    }
    const c = t[a], u = t[(a + 2) % o], f = r(c, h);
    let d;
    if (f < 1e-4)
      d = h;
    else {
      const m = Math.min(f / 2, l);
      d = n(
        h,
        c,
        m / f
      );
    }
    const p = r(u, h);
    let g;
    if (p < 1e-4)
      g = h;
    else {
      const m = Math.min(p / 2, l);
      g = n(
        h,
        u,
        m / p
      );
    }
    a === 0 ? s.moveTo(d.x, d.y) : s.lineTo(d.x, d.y), s.quadraticCurveTo(h.x, h.y, g.x, g.y, i);
  }
}
const Vl = new Y();
class Hl {
  constructor(t) {
    this.shapePrimitives = [], this._currentPoly = null, this._bounds = new ot(), this._graphicsPath2D = t, this.signed = t.checkForHoles;
  }
  /**
   * Sets the starting point for a new sub-path. Any subsequent drawing commands are considered part of this path.
   * @param x - The x-coordinate for the starting point.
   * @param y - The y-coordinate for the starting point.
   * @returns The instance of the current object for chaining.
   */
  moveTo(t, e) {
    return this.startPoly(t, e), this;
  }
  /**
   * Connects the current point to a new point with a straight line. This method updates the current path.
   * @param x - The x-coordinate of the new point to connect to.
   * @param y - The y-coordinate of the new point to connect to.
   * @returns The instance of the current object for chaining.
   */
  lineTo(t, e) {
    this._ensurePoly();
    const i = this._currentPoly.points, r = i[i.length - 2], n = i[i.length - 1];
    return (r !== t || n !== e) && i.push(t, e), this;
  }
  /**
   * Adds an arc to the path. The arc is centered at (x, y)
   *  position with radius `radius` starting at `startAngle` and ending at `endAngle`.
   * @param x - The x-coordinate of the arc's center.
   * @param y - The y-coordinate of the arc's center.
   * @param radius - The radius of the arc.
   * @param startAngle - The starting angle of the arc, in radians.
   * @param endAngle - The ending angle of the arc, in radians.
   * @param counterclockwise - Specifies whether the arc should be drawn in the anticlockwise direction. False by default.
   * @returns The instance of the current object for chaining.
   */
  arc(t, e, i, r, n, o) {
    this._ensurePoly(!1);
    const a = this._currentPoly.points;
    return Qn(a, t, e, i, r, n, o), this;
  }
  /**
   * Adds an arc to the path with the arc tangent to the line joining two specified points.
   * The arc radius is specified by `radius`.
   * @param x1 - The x-coordinate of the first point.
   * @param y1 - The y-coordinate of the first point.
   * @param x2 - The x-coordinate of the second point.
   * @param y2 - The y-coordinate of the second point.
   * @param radius - The radius of the arc.
   * @returns The instance of the current object for chaining.
   */
  arcTo(t, e, i, r, n) {
    this._ensurePoly();
    const o = this._currentPoly.points;
    return Dl(o, t, e, i, r, n), this;
  }
  /**
   * Adds an SVG-style arc to the path, allowing for elliptical arcs based on the SVG spec.
   * @param rx - The x-radius of the ellipse.
   * @param ry - The y-radius of the ellipse.
   * @param xAxisRotation - The rotation of the ellipse's x-axis relative
   * to the x-axis of the coordinate system, in degrees.
   * @param largeArcFlag - Determines if the arc should be greater than or less than 180 degrees.
   * @param sweepFlag - Determines if the arc should be swept in a positive angle direction.
   * @param x - The x-coordinate of the arc's end point.
   * @param y - The y-coordinate of the arc's end point.
   * @returns The instance of the current object for chaining.
   */
  arcToSvg(t, e, i, r, n, o, a) {
    const h = this._currentPoly.points;
    return zl(
      h,
      this._currentPoly.lastX,
      this._currentPoly.lastY,
      o,
      a,
      t,
      e,
      i,
      r,
      n
    ), this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires three points: the first two are control points and the third one is the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the first control point.
   * @param cp1y - The y-coordinate of the first control point.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveTo(t, e, i, r, n, o, a) {
    this._ensurePoly();
    const h = this._currentPoly;
    return Zn(
      this._currentPoly.points,
      h.lastX,
      h.lastY,
      t,
      e,
      i,
      r,
      n,
      o,
      a
    ), this;
  }
  /**
   * Adds a quadratic curve to the path. It requires two points: the control point and the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the control point.
   * @param cp1y - The y-coordinate of the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothing - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveTo(t, e, i, r, n) {
    this._ensurePoly();
    const o = this._currentPoly;
    return Bl(
      this._currentPoly.points,
      o.lastX,
      o.lastY,
      t,
      e,
      i,
      r,
      n
    ), this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this.endPoly(!0), this;
  }
  /**
   * Adds another path to the current path. This method allows for the combination of multiple paths into one.
   * @param path - The `GraphicsPath` object representing the path to add.
   * @param transform - An optional `Matrix` object to apply a transformation to the path before adding it.
   * @returns The instance of the current object for chaining.
   */
  addPath(t, e) {
    this.endPoly(), e && !e.isIdentity() && (t = t.clone(!0), t.transform(e));
    const i = this.shapePrimitives, r = i.length;
    for (let n = 0; n < t.instructions.length; n++) {
      const o = t.instructions[n];
      this[o.action](...o.data);
    }
    if (t.checkForHoles && i.length - r > 1) {
      let n = null;
      for (let o = r; o < i.length; o++) {
        const a = i[o];
        if (a.shape.type === "polygon") {
          const h = a.shape, l = n == null ? void 0 : n.shape;
          l && l.containsPolygon(h) ? (n.holes || (n.holes = []), n.holes.push(a), i.copyWithin(o, o + 1), i.length--, o--) : n = a;
        }
      }
    }
    return this;
  }
  /**
   * Finalizes the drawing of the current path. Optionally, it can close the path.
   * @param closePath - A boolean indicating whether to close the path after finishing. False by default.
   */
  finish(t = !1) {
    this.endPoly(t);
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, i, r, n) {
    return this.drawShape(new Y(t, e, i, r), n), this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, i, r) {
    return this.drawShape(new Zs(t, e, i), r), this;
  }
  /**
   * Draws a polygon shape. This method allows for the creation of complex polygons by specifying a sequence of points.
   * @param points - An array of numbers, or or an array of PointData objects eg [{x,y}, {x,y}, {x,y}]
   * representing the x and y coordinates of the polygon's vertices, in sequence.
   * @param close - A boolean indicating whether to close the polygon path. True by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  poly(t, e, i) {
    const r = new ne(t);
    return r.closePath = e, this.drawShape(r, i), this;
  }
  /**
   * Draws a regular polygon with a specified number of sides. All sides and angles are equal.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  regularPoly(t, e, i, r, n = 0, o) {
    r = Math.max(r | 0, 3);
    const a = -1 * Math.PI / 2 + n, h = Math.PI * 2 / r, l = [];
    for (let c = 0; c < r; c++) {
      const u = a - c * h;
      l.push(
        t + i * Math.cos(u),
        e + i * Math.sin(u)
      );
    }
    return this.poly(l, !0, o), this;
  }
  /**
   * Draws a polygon with rounded corners.
   * Similar to `regularPoly` but with the ability to round the corners of the polygon.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param corner - The radius of the rounding of the corners.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param smoothness - Optional parameter to adjust the smoothness of the rounding.
   * @returns The instance of the current object for chaining.
   */
  roundPoly(t, e, i, r, n, o = 0, a) {
    if (r = Math.max(r | 0, 3), n <= 0)
      return this.regularPoly(t, e, i, r, o);
    const h = i * Math.sin(Math.PI / r) - 1e-3;
    n = Math.min(n, h);
    const l = -1 * Math.PI / 2 + o, c = Math.PI * 2 / r, u = (r - 2) * Math.PI / r / 2;
    for (let f = 0; f < r; f++) {
      const d = f * c + l, p = t + i * Math.cos(d), g = e + i * Math.sin(d), m = d + Math.PI + u, x = d - Math.PI - u, y = p + n * Math.cos(m), _ = g + n * Math.sin(m), b = p + n * Math.cos(x), S = g + n * Math.sin(x);
      f === 0 ? this.moveTo(y, _) : this.lineTo(y, _), this.quadraticCurveTo(p, g, b, S, a);
    }
    return this.closePath();
  }
  /**
   * Draws a shape with rounded corners. This function supports custom radius for each corner of the shape.
   * Optionally, corners can be rounded using a quadratic curve instead of an arc, providing a different aesthetic.
   * @param points - An array of `RoundedPoint` representing the corners of the shape to draw.
   * A minimum of 3 points is required.
   * @param radius - The default radius for the corners.
   * This radius is applied to all corners unless overridden in `points`.
   * @param useQuadratic - If set to true, rounded corners are drawn using a quadraticCurve
   *  method instead of an arc method. Defaults to false.
   * @param smoothness - Specifies the smoothness of the curve when `useQuadratic` is true.
   * Higher values make the curve smoother.
   * @returns The instance of the current object for chaining.
   */
  roundShape(t, e, i = !1, r) {
    return t.length < 3 ? this : (i ? Nl(this, t, e, r) : Ul(this, t, e), this.closePath());
  }
  /**
   * Draw Rectangle with fillet corners. This is much like rounded rectangle
   * however it support negative numbers as well for the corner radius.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param fillet - accept negative or positive values
   */
  filletRect(t, e, i, r, n) {
    if (n === 0)
      return this.rect(t, e, i, r);
    const o = Math.min(i, r) / 2, a = Math.min(o, Math.max(-o, n)), h = t + i, l = e + r, c = a < 0 ? -a : 0, u = Math.abs(a);
    return this.moveTo(t, e + u).arcTo(t + c, e + c, t + u, e, u).lineTo(h - u, e).arcTo(h - c, e + c, h, e + u, u).lineTo(h, l - u).arcTo(h - c, l - c, t + i - u, l, u).lineTo(t + u, l).arcTo(t + c, l - c, t, l - u, u).closePath();
  }
  /**
   * Draw Rectangle with chamfer corners. These are angled corners.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param chamfer - non-zero real number, size of corner cutout
   * @param transform
   */
  chamferRect(t, e, i, r, n, o) {
    if (n <= 0)
      return this.rect(t, e, i, r);
    const a = Math.min(n, Math.min(i, r) / 2), h = t + i, l = e + r, c = [
      t + a,
      e,
      h - a,
      e,
      h,
      e + a,
      h,
      l - a,
      h - a,
      l,
      t + a,
      l,
      t,
      l - a,
      t,
      e + a
    ];
    for (let u = c.length - 1; u >= 2; u -= 2)
      c[u] === c[u - 2] && c[u - 1] === c[u - 3] && c.splice(u - 1, 2);
    return this.poly(c, !0, o);
  }
  /**
   * Draws an ellipse at the specified location and with the given x and y radii.
   * An optional transformation can be applied, allowing for rotation, scaling, and translation.
   * @param x - The x-coordinate of the center of the ellipse.
   * @param y - The y-coordinate of the center of the ellipse.
   * @param radiusX - The horizontal radius of the ellipse.
   * @param radiusY - The vertical radius of the ellipse.
   * @param transform - An optional `Matrix` object to apply a transformation to the ellipse. This can include rotations.
   * @returns The instance of the current object for chaining.
   */
  ellipse(t, e, i, r, n) {
    return this.drawShape(new Qs(t, e, i, r), n), this;
  }
  /**
   * Draws a rectangle with rounded corners.
   * The corner radius can be specified to determine how rounded the corners should be.
   * An optional transformation can be applied, which allows for rotation, scaling, and translation of the rectangle.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param radius - The radius of the rectangle's corners. If not specified, corners will be sharp.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  roundRect(t, e, i, r, n, o) {
    return this.drawShape(new Js(t, e, i, r, n), o), this;
  }
  /**
   * Draws a given shape on the canvas.
   * This is a generic method that can draw any type of shape specified by the `ShapePrimitive` parameter.
   * An optional transformation matrix can be applied to the shape, allowing for complex transformations.
   * @param shape - The shape to draw, defined as a `ShapePrimitive` object.
   * @param matrix - An optional `Matrix` for transforming the shape. This can include rotations,
   * scaling, and translations.
   * @returns The instance of the current object for chaining.
   */
  drawShape(t, e) {
    return this.endPoly(), this.shapePrimitives.push({ shape: t, transform: e }), this;
  }
  /**
   * Starts a new polygon path from the specified starting point.
   * This method initializes a new polygon or ends the current one if it exists.
   * @param x - The x-coordinate of the starting point of the new polygon.
   * @param y - The y-coordinate of the starting point of the new polygon.
   * @returns The instance of the current object for chaining.
   */
  startPoly(t, e) {
    let i = this._currentPoly;
    return i && this.endPoly(), i = new ne(), i.points.push(t, e), this._currentPoly = i, this;
  }
  /**
   * Ends the current polygon path. If `closePath` is set to true,
   * the path is closed by connecting the last point to the first one.
   * This method finalizes the current polygon and prepares it for drawing or adding to the shape primitives.
   * @param closePath - A boolean indicating whether to close the polygon by connecting the last point
   *  back to the starting point. False by default.
   * @returns The instance of the current object for chaining.
   */
  endPoly(t = !1) {
    const e = this._currentPoly;
    return e && e.points.length > 2 && (e.closePath = t, this.shapePrimitives.push({ shape: e })), this._currentPoly = null, this;
  }
  _ensurePoly(t = !0) {
    if (!this._currentPoly && (this._currentPoly = new ne(), t)) {
      const e = this.shapePrimitives[this.shapePrimitives.length - 1];
      if (e) {
        let i = e.shape.x, r = e.shape.y;
        if (e.transform && !e.transform.isIdentity()) {
          const n = e.transform, o = i;
          i = n.a * i + n.c * r + n.tx, r = n.b * o + n.d * r + n.ty;
        }
        this._currentPoly.points.push(i, r);
      } else
        this._currentPoly.points.push(0, 0);
    }
  }
  /** Builds the path. */
  buildPath() {
    const t = this._graphicsPath2D;
    this.shapePrimitives.length = 0, this._currentPoly = null;
    for (let e = 0; e < t.instructions.length; e++) {
      const i = t.instructions[e];
      this[i.action](...i.data);
    }
    this.finish();
  }
  /** Gets the bounds of the path. */
  get bounds() {
    const t = this._bounds;
    t.clear();
    const e = this.shapePrimitives;
    for (let i = 0; i < e.length; i++) {
      const r = e[i], n = r.shape.getBounds(Vl);
      r.transform ? t.addRect(n, r.transform) : t.addRect(n);
    }
    return t;
  }
}
class ft {
  /**
   * Creates a `GraphicsPath` instance optionally from an SVG path string or an array of `PathInstruction`.
   * @param instructions - An SVG path string or an array of `PathInstruction` objects.
   * @param signed
   */
  constructor(t, e = !1) {
    this.instructions = [], this.uid = V("graphicsPath"), this._dirty = !0, this.checkForHoles = e, typeof t == "string" ? uh(t, this) : this.instructions = (t == null ? void 0 : t.slice()) ?? [];
  }
  /**
   * Provides access to the internal shape path, ensuring it is up-to-date with the current instructions.
   * @returns The `ShapePath` instance associated with this `GraphicsPath`.
   */
  get shapePath() {
    return this._shapePath || (this._shapePath = new Hl(this)), this._dirty && (this._dirty = !1, this._shapePath.buildPath()), this._shapePath;
  }
  /**
   * Adds another `GraphicsPath` to this path, optionally applying a transformation.
   * @param path - The `GraphicsPath` to add.
   * @param transform - An optional transformation to apply to the added path.
   * @returns The instance of the current object for chaining.
   */
  addPath(t, e) {
    return t = t.clone(), this.instructions.push({ action: "addPath", data: [t, e] }), this._dirty = !0, this;
  }
  arc(...t) {
    return this.instructions.push({ action: "arc", data: t }), this._dirty = !0, this;
  }
  arcTo(...t) {
    return this.instructions.push({ action: "arcTo", data: t }), this._dirty = !0, this;
  }
  arcToSvg(...t) {
    return this.instructions.push({ action: "arcToSvg", data: t }), this._dirty = !0, this;
  }
  bezierCurveTo(...t) {
    return this.instructions.push({ action: "bezierCurveTo", data: t }), this._dirty = !0, this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires two points: the second control point and the end point. The first control point is assumed to be
   * The starting point is the last point in the current path.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveToShort(t, e, i, r, n) {
    const o = this.instructions[this.instructions.length - 1], a = this.getLastPoint(j.shared);
    let h = 0, l = 0;
    if (!o || o.action !== "bezierCurveTo")
      h = a.x, l = a.y;
    else {
      h = o.data[2], l = o.data[3];
      const c = a.x, u = a.y;
      h = c + (c - h), l = u + (u - l);
    }
    return this.instructions.push({ action: "bezierCurveTo", data: [h, l, t, e, i, r, n] }), this._dirty = !0, this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this.instructions.push({ action: "closePath", data: [] }), this._dirty = !0, this;
  }
  ellipse(...t) {
    return this.instructions.push({ action: "ellipse", data: t }), this._dirty = !0, this;
  }
  lineTo(...t) {
    return this.instructions.push({ action: "lineTo", data: t }), this._dirty = !0, this;
  }
  moveTo(...t) {
    return this.instructions.push({ action: "moveTo", data: t }), this;
  }
  quadraticCurveTo(...t) {
    return this.instructions.push({ action: "quadraticCurveTo", data: t }), this._dirty = !0, this;
  }
  /**
   * Adds a quadratic curve to the path. It uses the previous point as the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveToShort(t, e, i) {
    const r = this.instructions[this.instructions.length - 1], n = this.getLastPoint(j.shared);
    let o = 0, a = 0;
    if (!r || r.action !== "quadraticCurveTo")
      o = n.x, a = n.y;
    else {
      o = r.data[0], a = r.data[1];
      const h = n.x, l = n.y;
      o = h + (h - o), a = l + (l - a);
    }
    return this.instructions.push({ action: "quadraticCurveTo", data: [o, a, t, e, i] }), this._dirty = !0, this;
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, i, r, n) {
    return this.instructions.push({ action: "rect", data: [t, e, i, r, n] }), this._dirty = !0, this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, i, r) {
    return this.instructions.push({ action: "circle", data: [t, e, i, r] }), this._dirty = !0, this;
  }
  roundRect(...t) {
    return this.instructions.push({ action: "roundRect", data: t }), this._dirty = !0, this;
  }
  poly(...t) {
    return this.instructions.push({ action: "poly", data: t }), this._dirty = !0, this;
  }
  regularPoly(...t) {
    return this.instructions.push({ action: "regularPoly", data: t }), this._dirty = !0, this;
  }
  roundPoly(...t) {
    return this.instructions.push({ action: "roundPoly", data: t }), this._dirty = !0, this;
  }
  roundShape(...t) {
    return this.instructions.push({ action: "roundShape", data: t }), this._dirty = !0, this;
  }
  filletRect(...t) {
    return this.instructions.push({ action: "filletRect", data: t }), this._dirty = !0, this;
  }
  chamferRect(...t) {
    return this.instructions.push({ action: "chamferRect", data: t }), this._dirty = !0, this;
  }
  /**
   * Draws a star shape centered at a specified location. This method allows for the creation
   *  of stars with a variable number of points, outer radius, optional inner radius, and rotation.
   * The star is drawn as a closed polygon with alternating outer and inner vertices to create the star's points.
   * An optional transformation can be applied to scale, rotate, or translate the star as needed.
   * @param x - The x-coordinate of the center of the star.
   * @param y - The y-coordinate of the center of the star.
   * @param points - The number of points of the star.
   * @param radius - The outer radius of the star (distance from the center to the outer points).
   * @param innerRadius - Optional. The inner radius of the star
   * (distance from the center to the inner points between the outer points).
   * If not provided, defaults to half of the `radius`.
   * @param rotation - Optional. The rotation of the star in radians, where 0 is aligned with the y-axis.
   * Defaults to 0, meaning one point is directly upward.
   * @param transform - An optional `Matrix` object to apply a transformation to the star.
   * This can include rotations, scaling, and translations.
   * @returns The instance of the current object for chaining further drawing commands.
   */
  // eslint-disable-next-line max-len
  star(t, e, i, r, n, o, a) {
    n || (n = r / 2);
    const h = -1 * Math.PI / 2 + o, l = i * 2, c = Math.PI * 2 / l, u = [];
    for (let f = 0; f < l; f++) {
      const d = f % 2 ? n : r, p = f * c + h;
      u.push(
        t + d * Math.cos(p),
        e + d * Math.sin(p)
      );
    }
    return this.poly(u, !0, a), this;
  }
  /**
   * Creates a copy of the current `GraphicsPath` instance. This method supports both shallow and deep cloning.
   * A shallow clone copies the reference of the instructions array, while a deep clone creates a new array and
   * copies each instruction individually, ensuring that modifications to the instructions of the cloned `GraphicsPath`
   * do not affect the original `GraphicsPath` and vice versa.
   * @param deep - A boolean flag indicating whether the clone should be deep.
   * @returns A new `GraphicsPath` instance that is a clone of the current instance.
   */
  clone(t = !1) {
    const e = new ft();
    if (e.checkForHoles = this.checkForHoles, !t)
      e.instructions = this.instructions.slice();
    else
      for (let i = 0; i < this.instructions.length; i++) {
        const r = this.instructions[i];
        e.instructions.push({ action: r.action, data: r.data.slice() });
      }
    return e;
  }
  clear() {
    return this.instructions.length = 0, this._dirty = !0, this;
  }
  /**
   * Applies a transformation matrix to all drawing instructions within the `GraphicsPath`.
   * This method enables the modification of the path's geometry according to the provided
   * transformation matrix, which can include translations, rotations, scaling, and skewing.
   *
   * Each drawing instruction in the path is updated to reflect the transformation,
   * ensuring the visual representation of the path is consistent with the applied matrix.
   *
   * Note: The transformation is applied directly to the coordinates and control points of the drawing instructions,
   * not to the path as a whole. This means the transformation's effects are baked into the individual instructions,
   * allowing for fine-grained control over the path's appearance.
   * @param matrix - A `Matrix` object representing the transformation to apply.
   * @returns The instance of the current object for chaining further operations.
   */
  transform(t) {
    if (t.isIdentity()) return this;
    const e = t.a, i = t.b, r = t.c, n = t.d, o = t.tx, a = t.ty;
    let h = 0, l = 0, c = 0, u = 0, f = 0, d = 0, p = 0, g = 0;
    for (let m = 0; m < this.instructions.length; m++) {
      const x = this.instructions[m], y = x.data;
      switch (x.action) {
        case "moveTo":
        case "lineTo":
          h = y[0], l = y[1], y[0] = e * h + r * l + o, y[1] = i * h + n * l + a;
          break;
        case "bezierCurveTo":
          c = y[0], u = y[1], f = y[2], d = y[3], h = y[4], l = y[5], y[0] = e * c + r * u + o, y[1] = i * c + n * u + a, y[2] = e * f + r * d + o, y[3] = i * f + n * d + a, y[4] = e * h + r * l + o, y[5] = i * h + n * l + a;
          break;
        case "quadraticCurveTo":
          c = y[0], u = y[1], h = y[2], l = y[3], y[0] = e * c + r * u + o, y[1] = i * c + n * u + a, y[2] = e * h + r * l + o, y[3] = i * h + n * l + a;
          break;
        case "arcToSvg":
          h = y[5], l = y[6], p = y[0], g = y[1], y[0] = e * p + r * g, y[1] = i * p + n * g, y[5] = e * h + r * l + o, y[6] = i * h + n * l + a;
          break;
        case "circle":
          y[4] = Bt(y[3], t);
          break;
        case "rect":
          y[4] = Bt(y[4], t);
          break;
        case "ellipse":
          y[8] = Bt(y[8], t);
          break;
        case "roundRect":
          y[5] = Bt(y[5], t);
          break;
        case "addPath":
          y[0].transform(t);
          break;
        case "poly":
          y[2] = Bt(y[2], t);
          break;
        case "regularPoly":
        case "chamferRect":
          y[5] = Bt(y[5], t);
          break;
        case "closePath":
          break;
        default:
          J("unknown transform action", x.action);
          break;
      }
    }
    return this._dirty = !0, this;
  }
  get bounds() {
    return this.shapePath.bounds;
  }
  /**
   * Retrieves the last point from the current drawing instructions in the `GraphicsPath`.
   * This method is useful for operations that depend on the path's current endpoint,
   * such as connecting subsequent shapes or paths. It supports various drawing instructions,
   * ensuring the last point's position is accurately determined regardless of the path's complexity.
   *
   * If the last instruction is a `closePath`, the method iterates backward through the instructions
   *  until it finds an actionable instruction that defines a point (e.g., `moveTo`, `lineTo`,
   * `quadraticCurveTo`, etc.). For compound paths added via `addPath`, it recursively retrieves
   * the last point from the nested path.
   * @param out - A `Point` object where the last point's coordinates will be stored.
   * This object is modified directly to contain the result.
   * @returns The `Point` object containing the last point's coordinates.
   */
  getLastPoint(t) {
    let e = this.instructions.length - 1, i = this.instructions[e];
    if (!i)
      return t.x = 0, t.y = 0, t;
    for (; i.action === "closePath"; ) {
      if (e--, e < 0)
        return t.x = 0, t.y = 0, t;
      i = this.instructions[e];
    }
    switch (i.action) {
      case "moveTo":
      case "lineTo":
        t.x = i.data[0], t.y = i.data[1];
        break;
      case "quadraticCurveTo":
        t.x = i.data[2], t.y = i.data[3];
        break;
      case "bezierCurveTo":
        t.x = i.data[4], t.y = i.data[5];
        break;
      case "arc":
      case "arcToSvg":
        t.x = i.data[5], t.y = i.data[6];
        break;
      case "addPath":
        i.data[0].getLastPoint(t);
        break;
    }
    return t;
  }
}
function Bt(s, t) {
  return s ? s.prepend(t) : t.clone();
}
function N(s, t, e) {
  const i = s.getAttribute(t);
  return i ? Number(i) : e;
}
function $l(s, t) {
  const e = s.querySelectorAll("defs");
  for (let i = 0; i < e.length; i++) {
    const r = e[i];
    for (let n = 0; n < r.children.length; n++) {
      const o = r.children[n];
      switch (o.nodeName.toLowerCase()) {
        case "lineargradient":
          t.defs[o.id] = Yl(o);
          break;
        case "radialgradient":
          t.defs[o.id] = Xl();
          break;
      }
    }
  }
}
function Yl(s) {
  const t = N(s, "x1", 0), e = N(s, "y1", 0), i = N(s, "x2", 1), r = N(s, "y2", 0), n = s.getAttribute("gradientUnits") || "objectBoundingBox", o = new ge(
    t,
    e,
    i,
    r,
    n === "objectBoundingBox" ? "local" : "global"
  );
  for (let a = 0; a < s.children.length; a++) {
    const h = s.children[a], l = N(h, "offset", 0), c = rt.shared.setValue(h.getAttribute("stop-color")).toNumber();
    o.addColorStop(l, c);
  }
  return o;
}
function Xl(s) {
  return J("[SVG Parser] Radial gradients are not yet supported"), new ge(0, 0, 1, 0);
}
function ar(s) {
  const t = s.match(/url\s*\(\s*['"]?\s*#([^'"\s)]+)\s*['"]?\s*\)/i);
  return t ? t[1] : "";
}
const hr = {
  // Fill properties
  fill: { type: "paint", default: 0 },
  // Fill color/gradient
  "fill-opacity": { type: "number", default: 1 },
  // Fill transparency
  // Stroke properties
  stroke: { type: "paint", default: 0 },
  // Stroke color/gradient
  "stroke-width": { type: "number", default: 1 },
  // Width of stroke
  "stroke-opacity": { type: "number", default: 1 },
  // Stroke transparency
  "stroke-linecap": { type: "string", default: "butt" },
  // End cap style: butt, round, square
  "stroke-linejoin": { type: "string", default: "miter" },
  // Join style: miter, round, bevel
  "stroke-miterlimit": { type: "number", default: 10 },
  // Limit on miter join sharpness
  "stroke-dasharray": { type: "string", default: "none" },
  // Dash pattern
  "stroke-dashoffset": { type: "number", default: 0 },
  // Offset for dash pattern
  // Global properties
  opacity: { type: "number", default: 1 }
  // Overall opacity
};
function Jn(s, t) {
  const e = s.getAttribute("style"), i = {}, r = {}, n = {
    strokeStyle: i,
    fillStyle: r,
    useFill: !1,
    useStroke: !1
  };
  for (const o in hr) {
    const a = s.getAttribute(o);
    a && lr(t, n, o, a.trim());
  }
  if (e) {
    const o = e.split(";");
    for (let a = 0; a < o.length; a++) {
      const h = o[a].trim(), [l, c] = h.split(":");
      hr[l] && lr(t, n, l, c.trim());
    }
  }
  return {
    strokeStyle: n.useStroke ? i : null,
    fillStyle: n.useFill ? r : null,
    useFill: n.useFill,
    useStroke: n.useStroke
  };
}
function lr(s, t, e, i) {
  switch (e) {
    case "stroke":
      if (i !== "none") {
        if (i.startsWith("url(")) {
          const r = ar(i);
          t.strokeStyle.fill = s.defs[r];
        } else
          t.strokeStyle.color = rt.shared.setValue(i).toNumber();
        t.useStroke = !0;
      }
      break;
    case "stroke-width":
      t.strokeStyle.width = Number(i);
      break;
    case "fill":
      if (i !== "none") {
        if (i.startsWith("url(")) {
          const r = ar(i);
          t.fillStyle.fill = s.defs[r];
        } else
          t.fillStyle.color = rt.shared.setValue(i).toNumber();
        t.useFill = !0;
      }
      break;
    case "fill-opacity":
      t.fillStyle.alpha = Number(i);
      break;
    case "stroke-opacity":
      t.strokeStyle.alpha = Number(i);
      break;
    case "opacity":
      t.fillStyle.alpha = Number(i), t.strokeStyle.alpha = Number(i);
      break;
  }
}
function Wl(s) {
  if (s.length <= 2)
    return !0;
  const t = s.map((a) => a.area).sort((a, h) => h - a), [e, i] = t, r = t[t.length - 1], n = e / i, o = i / r;
  return !(n > 3 && o < 2);
}
function jl(s) {
  return s.split(/(?=[Mm])/).filter((i) => i.trim().length > 0);
}
function ql(s) {
  const t = s.match(/[-+]?[0-9]*\.?[0-9]+/g);
  if (!t || t.length < 4) return 0;
  const e = t.map(Number), i = [], r = [];
  for (let c = 0; c < e.length; c += 2)
    c + 1 < e.length && (i.push(e[c]), r.push(e[c + 1]));
  if (i.length === 0 || r.length === 0) return 0;
  const n = Math.min(...i), o = Math.max(...i), a = Math.min(...r), h = Math.max(...r);
  return (o - n) * (h - a);
}
function cr(s, t) {
  const e = new ft(s, !1);
  for (const i of e.instructions)
    t.instructions.push(i);
}
function Kl(s, t) {
  if (typeof s == "string") {
    const o = document.createElement("div");
    o.innerHTML = s.trim(), s = o.querySelector("svg");
  }
  const e = {
    context: t,
    defs: {},
    path: new ft()
  };
  $l(s, e);
  const i = s.children, { fillStyle: r, strokeStyle: n } = Jn(s, e);
  for (let o = 0; o < i.length; o++) {
    const a = i[o];
    a.nodeName.toLowerCase() !== "defs" && to(a, e, r, n);
  }
  return t;
}
function to(s, t, e, i) {
  const r = s.children, { fillStyle: n, strokeStyle: o } = Jn(s, t);
  n && e ? e = { ...e, ...n } : n && (e = n), o && i ? i = { ...i, ...o } : o && (i = o);
  const a = !e && !i;
  a && (e = { color: 0 });
  let h, l, c, u, f, d, p, g, m, x, y, _, b, S, v, w, M;
  switch (s.nodeName.toLowerCase()) {
    case "path": {
      S = s.getAttribute("d");
      const P = s.getAttribute("fill-rule"), C = jl(S), A = P === "evenodd", F = C.length > 1;
      if (A && F) {
        const z = C.map((T) => ({
          path: T,
          area: ql(T)
        }));
        if (z.sort((T, E) => E.area - T.area), C.length > 3 || !Wl(z))
          for (let T = 0; T < z.length; T++) {
            const E = z[T], Vt = T === 0;
            t.context.beginPath();
            const R = new ft(void 0, !0);
            cr(E.path, R), t.context.path(R), Vt ? (e && t.context.fill(e), i && t.context.stroke(i)) : t.context.cut();
          }
        else
          for (let T = 0; T < z.length; T++) {
            const E = z[T], Vt = T % 2 === 1;
            t.context.beginPath();
            const R = new ft(void 0, !0);
            cr(E.path, R), t.context.path(R), Vt ? t.context.cut() : (e && t.context.fill(e), i && t.context.stroke(i));
          }
      } else {
        const z = P ? P === "evenodd" : !0;
        v = new ft(S, z), t.context.path(v), e && t.context.fill(e), i && t.context.stroke(i);
      }
      break;
    }
    case "circle":
      p = N(s, "cx", 0), g = N(s, "cy", 0), m = N(s, "r", 0), t.context.ellipse(p, g, m, m), e && t.context.fill(e), i && t.context.stroke(i);
      break;
    case "rect":
      h = N(s, "x", 0), l = N(s, "y", 0), w = N(s, "width", 0), M = N(s, "height", 0), x = N(s, "rx", 0), y = N(s, "ry", 0), x || y ? t.context.roundRect(h, l, w, M, x || y) : t.context.rect(h, l, w, M), e && t.context.fill(e), i && t.context.stroke(i);
      break;
    case "ellipse":
      p = N(s, "cx", 0), g = N(s, "cy", 0), x = N(s, "rx", 0), y = N(s, "ry", 0), t.context.beginPath(), t.context.ellipse(p, g, x, y), e && t.context.fill(e), i && t.context.stroke(i);
      break;
    case "line":
      c = N(s, "x1", 0), u = N(s, "y1", 0), f = N(s, "x2", 0), d = N(s, "y2", 0), t.context.beginPath(), t.context.moveTo(c, u), t.context.lineTo(f, d), i && t.context.stroke(i);
      break;
    case "polygon":
      b = s.getAttribute("points"), _ = b.match(/-?\d+/g).map((P) => parseInt(P, 10)), t.context.poly(_, !0), e && t.context.fill(e), i && t.context.stroke(i);
      break;
    case "polyline":
      b = s.getAttribute("points"), _ = b.match(/-?\d+/g).map((P) => parseInt(P, 10)), t.context.poly(_, !1), i && t.context.stroke(i);
      break;
    case "g":
    case "svg":
      break;
    default: {
      J(`[SVG parser] <${s.nodeName}> elements unsupported`);
      break;
    }
  }
  a && (e = null);
  for (let P = 0; P < r.length; P++)
    to(r[P], t, e, i);
}
const ur = {
  repeat: {
    addressModeU: "repeat",
    addressModeV: "repeat"
  },
  "repeat-x": {
    addressModeU: "repeat",
    addressModeV: "clamp-to-edge"
  },
  "repeat-y": {
    addressModeU: "clamp-to-edge",
    addressModeV: "repeat"
  },
  "no-repeat": {
    addressModeU: "clamp-to-edge",
    addressModeV: "clamp-to-edge"
  }
};
class Zl {
  constructor(t, e) {
    this.uid = V("fillPattern"), this._tick = 0, this.transform = new k(), this.texture = t, this.transform.scale(
      1 / t.frame.width,
      1 / t.frame.height
    ), e && (t.source.style.addressModeU = ur[e].addressModeU, t.source.style.addressModeV = ur[e].addressModeV);
  }
  /**
   * Sets the transform for the pattern
   * @param transform - The transform matrix to apply to the pattern.
   * If not provided, the pattern will use the default transform.
   */
  setTransform(t) {
    const e = this.texture;
    this.transform.copyFrom(t), this.transform.invert(), this.transform.scale(
      1 / e.frame.width,
      1 / e.frame.height
    ), this._tick++;
  }
  /** Internal texture used to render the gradient */
  get texture() {
    return this._texture;
  }
  set texture(t) {
    this._texture !== t && (this._texture = t, this._tick++);
  }
  /**
   * Returns a unique key for this instance.
   * This key is used for caching.
   * @returns {string} Unique key for the instance
   */
  get styleKey() {
    return `fill-pattern-${this.uid}-${this._tick}`;
  }
  /** Destroys the fill pattern, releasing resources. This will also destroy the internal texture. */
  destroy() {
    this.texture.destroy(!0), this.texture = null;
  }
}
function Ql(s) {
  return rt.isColorLike(s);
}
function dr(s) {
  return s instanceof Zl;
}
function fr(s) {
  return s instanceof ge;
}
function Jl(s) {
  return s instanceof L;
}
function tc(s, t, e) {
  const i = rt.shared.setValue(t ?? 0);
  return s.color = i.toNumber(), s.alpha = i.alpha === 1 ? e.alpha : i.alpha, s.texture = L.WHITE, { ...e, ...s };
}
function ec(s, t, e) {
  return s.texture = t, { ...e, ...s };
}
function pr(s, t, e) {
  return s.fill = t, s.color = 16777215, s.texture = t.texture, s.matrix = t.transform, { ...e, ...s };
}
function mr(s, t, e) {
  return t.buildGradient(), s.fill = t, s.color = 16777215, s.texture = t.texture, s.matrix = t.transform, s.textureSpace = t.textureSpace, { ...e, ...s };
}
function sc(s, t) {
  const e = { ...t, ...s }, i = rt.shared.setValue(e.color);
  return e.alpha *= i.alpha, e.color = i.toNumber(), e;
}
function ie(s, t) {
  if (s == null)
    return null;
  const e = {}, i = s;
  return Ql(s) ? tc(e, s, t) : Jl(s) ? ec(e, s, t) : dr(s) ? pr(e, s, t) : fr(s) ? mr(e, s, t) : i.fill && dr(i.fill) ? pr(i, i.fill, t) : i.fill && fr(i.fill) ? mr(i, i.fill, t) : sc(i, t);
}
function gr(s, t) {
  const { width: e, alignment: i, miterLimit: r, cap: n, join: o, pixelLine: a, ...h } = t, l = ie(s, h);
  return l ? {
    width: e,
    alignment: i,
    miterLimit: r,
    cap: n,
    join: o,
    pixelLine: a,
    ...l
  } : null;
}
function ic(s, t) {
  let e = 1;
  const i = s.shapePath.shapePrimitives;
  for (let r = 0; r < i.length; r++) {
    const n = i[r].shape;
    if (n.type !== "polygon") continue;
    const o = n.points, a = o.length;
    if (a < 6) continue;
    const h = n.closePath;
    for (let l = 0; l < a; l += 2) {
      if (!h && (l === 0 || l === a - 2)) continue;
      const c = (l - 2 + a) % a, u = (l + 2) % a, f = o[c], d = o[c + 1], p = o[l], g = o[l + 1], m = o[u], x = o[u + 1], y = f - p, _ = d - g, b = m - p, S = x - g, v = y * y + _ * _, w = b * b + S * S;
      if (v < 1e-12 || w < 1e-12) continue;
      let C = (y * b + _ * S) / Math.sqrt(v * w);
      C < -1 ? C = -1 : C > 1 && (C = 1);
      const A = Math.sqrt((1 - C) * 0.5);
      if (A < 1e-6) continue;
      const F = Math.min(1 / A, t);
      F > e && (e = F);
    }
  }
  return e;
}
const rc = new j(), xr = new k(), ri = class lt extends mt {
  constructor() {
    super(...arguments), this._gpuData = /* @__PURE__ */ Object.create(null), this.autoGarbageCollect = !0, this._gcLastUsed = -1, this.uid = V("graphicsContext"), this.dirty = !0, this.batchMode = "auto", this.instructions = [], this.destroyed = !1, this._activePath = new ft(), this._transform = new k(), this._fillStyle = { ...lt.defaultFillStyle }, this._strokeStyle = { ...lt.defaultStrokeStyle }, this._stateStack = [], this._tick = 0, this._bounds = new ot(), this._boundsDirty = !0;
  }
  /**
   * Creates a new GraphicsContext object that is a clone of this instance, copying all properties,
   * including the current drawing state, transformations, styles, and instructions.
   * @returns A new GraphicsContext instance with the same properties and state as this one.
   */
  clone() {
    const t = new lt();
    return t.batchMode = this.batchMode, t.instructions = this.instructions.slice(), t._activePath = this._activePath.clone(), t._transform = this._transform.clone(), t._fillStyle = { ...this._fillStyle }, t._strokeStyle = { ...this._strokeStyle }, t._stateStack = this._stateStack.slice(), t._bounds = this._bounds.clone(), t._boundsDirty = !0, t;
  }
  /**
   * The current fill style of the graphics context. This can be a color, gradient, pattern, or a more complex style defined by a FillStyle object.
   */
  get fillStyle() {
    return this._fillStyle;
  }
  set fillStyle(t) {
    this._fillStyle = ie(t, lt.defaultFillStyle);
  }
  /**
   * The current stroke style of the graphics context. Similar to fill styles, stroke styles can encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   */
  get strokeStyle() {
    return this._strokeStyle;
  }
  set strokeStyle(t) {
    this._strokeStyle = gr(t, lt.defaultStrokeStyle);
  }
  /**
   * Sets the current fill style of the graphics context. The fill style can be a color, gradient,
   * pattern, or a more complex style defined by a FillStyle object.
   * @param style - The fill style to apply. This can be a simple color, a gradient or pattern object,
   *                or a FillStyle or ConvertedFillStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setFillStyle(t) {
    return this._fillStyle = ie(t, lt.defaultFillStyle), this;
  }
  /**
   * Sets the current stroke style of the graphics context. Similar to fill styles, stroke styles can
   * encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   * @param style - The stroke style to apply. Can be defined as a color, a gradient or pattern,
   *                or a StrokeStyle or ConvertedStrokeStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setStrokeStyle(t) {
    return this._strokeStyle = ie(t, lt.defaultStrokeStyle), this;
  }
  texture(t, e, i, r, n, o) {
    return this.instructions.push({
      action: "texture",
      data: {
        image: t,
        dx: i || 0,
        dy: r || 0,
        dw: n || t.frame.width,
        dh: o || t.frame.height,
        transform: this._transform.clone(),
        alpha: this._fillStyle.alpha,
        style: e || e === 0 ? rt.shared.setValue(e).toNumber() : 16777215
      }
    }), this.onUpdate(), this;
  }
  /**
   * Resets the current path. Any previous path and its commands are discarded and a new path is
   * started. This is typically called before beginning a new shape or series of drawing commands.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  beginPath() {
    return this._activePath = new ft(), this;
  }
  fill(t, e) {
    let i;
    const r = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && (r == null ? void 0 : r.action) === "stroke" ? i = r.data.path : i = this._activePath.clone(), i ? (t != null && (e !== void 0 && typeof t == "number" && (B(H, "GraphicsContext.fill(color, alpha) is deprecated, use GraphicsContext.fill({ color, alpha }) instead"), t = { color: t, alpha: e }), this._fillStyle = ie(t, lt.defaultFillStyle)), this.instructions.push({
      action: "fill",
      // TODO copy fill style!
      data: { style: this.fillStyle, path: i }
    }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  _initNextPathLocation() {
    const { x: t, y: e } = this._activePath.getLastPoint(j.shared);
    this._activePath.clear(), this._activePath.moveTo(t, e);
  }
  /**
   * Strokes the current path with the current stroke style. This method can take an optional
   * FillInput parameter to define the stroke's appearance, including its color, width, and other properties.
   * @param style - (Optional) The stroke style to apply. Can be defined as a simple color or a more complex style object. If omitted, uses the current stroke style.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  stroke(t) {
    let e;
    const i = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && (i == null ? void 0 : i.action) === "fill" ? e = i.data.path : e = this._activePath.clone(), e ? (t != null && (this._strokeStyle = gr(t, lt.defaultStrokeStyle)), this.instructions.push({
      action: "stroke",
      // TODO copy fill style!
      data: { style: this.strokeStyle, path: e }
    }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  /**
   * Applies a cutout to the last drawn shape. This is used to create holes or complex shapes by
   * subtracting a path from the previously drawn path. If a hole is not completely in a shape, it will
   * fail to cut correctly!
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  cut() {
    for (let t = 0; t < 2; t++) {
      const e = this.instructions[this.instructions.length - 1 - t], i = this._activePath.clone();
      if (e && (e.action === "stroke" || e.action === "fill"))
        if (e.data.hole)
          e.data.hole.addPath(i);
        else {
          e.data.hole = i;
          break;
        }
    }
    return this._initNextPathLocation(), this;
  }
  /**
   * Adds an arc to the current path, which is centered at (x, y) with the specified radius,
   * starting and ending angles, and direction.
   * @param x - The x-coordinate of the arc's center.
   * @param y - The y-coordinate of the arc's center.
   * @param radius - The arc's radius.
   * @param startAngle - The starting angle, in radians.
   * @param endAngle - The ending angle, in radians.
   * @param counterclockwise - (Optional) Specifies whether the arc is drawn counterclockwise (true) or clockwise (false). Defaults to false.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  arc(t, e, i, r, n, o) {
    this._tick++;
    const a = this._transform;
    return this._activePath.arc(
      a.a * t + a.c * e + a.tx,
      a.b * t + a.d * e + a.ty,
      i,
      r,
      n,
      o
    ), this;
  }
  /**
   * Adds an arc to the current path with the given control points and radius, connected to the previous point
   * by a straight line if necessary.
   * @param x1 - The x-coordinate of the first control point.
   * @param y1 - The y-coordinate of the first control point.
   * @param x2 - The x-coordinate of the second control point.
   * @param y2 - The y-coordinate of the second control point.
   * @param radius - The arc's radius.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  arcTo(t, e, i, r, n) {
    this._tick++;
    const o = this._transform;
    return this._activePath.arcTo(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      o.a * i + o.c * r + o.tx,
      o.b * i + o.d * r + o.ty,
      n
    ), this;
  }
  /**
   * Adds an SVG-style arc to the path, allowing for elliptical arcs based on the SVG spec.
   * @param rx - The x-radius of the ellipse.
   * @param ry - The y-radius of the ellipse.
   * @param xAxisRotation - The rotation of the ellipse's x-axis relative
   * to the x-axis of the coordinate system, in degrees.
   * @param largeArcFlag - Determines if the arc should be greater than or less than 180 degrees.
   * @param sweepFlag - Determines if the arc should be swept in a positive angle direction.
   * @param x - The x-coordinate of the arc's end point.
   * @param y - The y-coordinate of the arc's end point.
   * @returns The instance of the current object for chaining.
   */
  arcToSvg(t, e, i, r, n, o, a) {
    this._tick++;
    const h = this._transform;
    return this._activePath.arcToSvg(
      t,
      e,
      i,
      // should we rotate this with transform??
      r,
      n,
      h.a * o + h.c * a + h.tx,
      h.b * o + h.d * a + h.ty
    ), this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires three points: the first two are control points and the third one is the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the first control point.
   * @param cp1y - The y-coordinate of the first control point.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveTo(t, e, i, r, n, o, a) {
    this._tick++;
    const h = this._transform;
    return this._activePath.bezierCurveTo(
      h.a * t + h.c * e + h.tx,
      h.b * t + h.d * e + h.ty,
      h.a * i + h.c * r + h.tx,
      h.b * i + h.d * r + h.ty,
      h.a * n + h.c * o + h.tx,
      h.b * n + h.d * o + h.ty,
      a
    ), this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    var t;
    return this._tick++, (t = this._activePath) == null || t.closePath(), this;
  }
  /**
   * Draws an ellipse at the specified location and with the given x and y radii.
   * An optional transformation can be applied, allowing for rotation, scaling, and translation.
   * @param x - The x-coordinate of the center of the ellipse.
   * @param y - The y-coordinate of the center of the ellipse.
   * @param radiusX - The horizontal radius of the ellipse.
   * @param radiusY - The vertical radius of the ellipse.
   * @returns The instance of the current object for chaining.
   */
  ellipse(t, e, i, r) {
    return this._tick++, this._activePath.ellipse(t, e, i, r, this._transform.clone()), this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, i) {
    return this._tick++, this._activePath.circle(t, e, i, this._transform.clone()), this;
  }
  /**
   * Adds another `GraphicsPath` to this path, optionally applying a transformation.
   * @param path - The `GraphicsPath` to add.
   * @returns The instance of the current object for chaining.
   */
  path(t) {
    return this._tick++, this._activePath.addPath(t, this._transform.clone()), this;
  }
  /**
   * Connects the current point to a new point with a straight line. This method updates the current path.
   * @param x - The x-coordinate of the new point to connect to.
   * @param y - The y-coordinate of the new point to connect to.
   * @returns The instance of the current object for chaining.
   */
  lineTo(t, e) {
    this._tick++;
    const i = this._transform;
    return this._activePath.lineTo(
      i.a * t + i.c * e + i.tx,
      i.b * t + i.d * e + i.ty
    ), this;
  }
  /**
   * Sets the starting point for a new sub-path. Any subsequent drawing commands are considered part of this path.
   * @param x - The x-coordinate for the starting point.
   * @param y - The y-coordinate for the starting point.
   * @returns The instance of the current object for chaining.
   */
  moveTo(t, e) {
    this._tick++;
    const i = this._transform, r = this._activePath.instructions, n = i.a * t + i.c * e + i.tx, o = i.b * t + i.d * e + i.ty;
    return r.length === 1 && r[0].action === "moveTo" ? (r[0].data[0] = n, r[0].data[1] = o, this) : (this._activePath.moveTo(
      n,
      o
    ), this);
  }
  /**
   * Adds a quadratic curve to the path. It requires two points: the control point and the end point.
   * The starting point is the last point in the current path.
   * @param cpx - The x-coordinate of the control point.
   * @param cpy - The y-coordinate of the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveTo(t, e, i, r, n) {
    this._tick++;
    const o = this._transform;
    return this._activePath.quadraticCurveTo(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      o.a * i + o.c * r + o.tx,
      o.b * i + o.d * r + o.ty,
      n
    ), this;
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, i, r) {
    return this._tick++, this._activePath.rect(t, e, i, r, this._transform.clone()), this;
  }
  /**
   * Draws a rectangle with rounded corners.
   * The corner radius can be specified to determine how rounded the corners should be.
   * An optional transformation can be applied, which allows for rotation, scaling, and translation of the rectangle.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param radius - The radius of the rectangle's corners. If not specified, corners will be sharp.
   * @returns The instance of the current object for chaining.
   */
  roundRect(t, e, i, r, n) {
    return this._tick++, this._activePath.roundRect(t, e, i, r, n, this._transform.clone()), this;
  }
  /**
   * Draws a polygon shape by specifying a sequence of points. This method allows for the creation of complex polygons,
   * which can be both open and closed. An optional transformation can be applied, enabling the polygon to be scaled,
   * rotated, or translated as needed.
   * @param points - An array of numbers, or an array of PointData objects eg [{x,y}, {x,y}, {x,y}]
   * representing the x and y coordinates, of the polygon's vertices, in sequence.
   * @param close - A boolean indicating whether to close the polygon path. True by default.
   */
  poly(t, e) {
    return this._tick++, this._activePath.poly(t, e, this._transform.clone()), this;
  }
  /**
   * Draws a regular polygon with a specified number of sides. All sides and angles are equal.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  regularPoly(t, e, i, r, n = 0, o) {
    return this._tick++, this._activePath.regularPoly(t, e, i, r, n, o), this;
  }
  /**
   * Draws a polygon with rounded corners.
   * Similar to `regularPoly` but with the ability to round the corners of the polygon.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param corner - The radius of the rounding of the corners.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @returns The instance of the current object for chaining.
   */
  roundPoly(t, e, i, r, n, o) {
    return this._tick++, this._activePath.roundPoly(t, e, i, r, n, o), this;
  }
  /**
   * Draws a shape with rounded corners. This function supports custom radius for each corner of the shape.
   * Optionally, corners can be rounded using a quadratic curve instead of an arc, providing a different aesthetic.
   * @param points - An array of `RoundedPoint` representing the corners of the shape to draw.
   * A minimum of 3 points is required.
   * @param radius - The default radius for the corners.
   * This radius is applied to all corners unless overridden in `points`.
   * @param useQuadratic - If set to true, rounded corners are drawn using a quadraticCurve
   *  method instead of an arc method. Defaults to false.
   * @param smoothness - Specifies the smoothness of the curve when `useQuadratic` is true.
   * Higher values make the curve smoother.
   * @returns The instance of the current object for chaining.
   */
  roundShape(t, e, i, r) {
    return this._tick++, this._activePath.roundShape(t, e, i, r), this;
  }
  /**
   * Draw Rectangle with fillet corners. This is much like rounded rectangle
   * however it support negative numbers as well for the corner radius.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param fillet - accept negative or positive values
   */
  filletRect(t, e, i, r, n) {
    return this._tick++, this._activePath.filletRect(t, e, i, r, n), this;
  }
  /**
   * Draw Rectangle with chamfer corners. These are angled corners.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param chamfer - non-zero real number, size of corner cutout
   * @param transform
   */
  chamferRect(t, e, i, r, n, o) {
    return this._tick++, this._activePath.chamferRect(t, e, i, r, n, o), this;
  }
  /**
   * Draws a star shape centered at a specified location. This method allows for the creation
   *  of stars with a variable number of points, outer radius, optional inner radius, and rotation.
   * The star is drawn as a closed polygon with alternating outer and inner vertices to create the star's points.
   * An optional transformation can be applied to scale, rotate, or translate the star as needed.
   * @param x - The x-coordinate of the center of the star.
   * @param y - The y-coordinate of the center of the star.
   * @param points - The number of points of the star.
   * @param radius - The outer radius of the star (distance from the center to the outer points).
   * @param innerRadius - Optional. The inner radius of the star
   * (distance from the center to the inner points between the outer points).
   * If not provided, defaults to half of the `radius`.
   * @param rotation - Optional. The rotation of the star in radians, where 0 is aligned with the y-axis.
   * Defaults to 0, meaning one point is directly upward.
   * @returns The instance of the current object for chaining further drawing commands.
   */
  star(t, e, i, r, n = 0, o = 0) {
    return this._tick++, this._activePath.star(t, e, i, r, n, o, this._transform.clone()), this;
  }
  /**
   * Parses and renders an SVG string into the graphics context. This allows for complex shapes and paths
   * defined in SVG format to be drawn within the graphics context.
   * @param svg - The SVG string to be parsed and rendered.
   */
  svg(t) {
    return this._tick++, Kl(t, this), this;
  }
  /**
   * Restores the most recently saved graphics state by popping the top of the graphics state stack.
   * This includes transformations, fill styles, and stroke styles.
   */
  restore() {
    const t = this._stateStack.pop();
    return t && (this._transform = t.transform, this._fillStyle = t.fillStyle, this._strokeStyle = t.strokeStyle), this;
  }
  /** Saves the current graphics state, including transformations, fill styles, and stroke styles, onto a stack. */
  save() {
    return this._stateStack.push({
      transform: this._transform.clone(),
      fillStyle: { ...this._fillStyle },
      strokeStyle: { ...this._strokeStyle }
    }), this;
  }
  /**
   * Returns the current transformation matrix of the graphics context.
   * @returns The current transformation matrix.
   */
  getTransform() {
    return this._transform;
  }
  /**
   * Resets the current transformation matrix to the identity matrix, effectively removing any transformations (rotation, scaling, translation) previously applied.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  resetTransform() {
    return this._transform.identity(), this;
  }
  /**
   * Applies a rotation transformation to the graphics context around the current origin.
   * @param angle - The angle of rotation in radians.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  rotate(t) {
    return this._transform.rotate(t), this;
  }
  /**
   * Applies a scaling transformation to the graphics context, scaling drawings by x horizontally and by y vertically.
   * @param x - The scale factor in the horizontal direction.
   * @param y - (Optional) The scale factor in the vertical direction. If not specified, the x value is used for both directions.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  scale(t, e = t) {
    return this._transform.scale(t, e), this;
  }
  setTransform(t, e, i, r, n, o) {
    return t instanceof k ? (this._transform.set(t.a, t.b, t.c, t.d, t.tx, t.ty), this) : (this._transform.set(t, e, i, r, n, o), this);
  }
  transform(t, e, i, r, n, o) {
    return t instanceof k ? (this._transform.append(t), this) : (xr.set(t, e, i, r, n, o), this._transform.append(xr), this);
  }
  /**
   * Applies a translation transformation to the graphics context, moving the origin by the specified amounts.
   * @param x - The amount to translate in the horizontal direction.
   * @param y - (Optional) The amount to translate in the vertical direction. If not specified, the x value is used for both directions.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  translate(t, e = t) {
    return this._transform.translate(t, e), this;
  }
  /**
   * Clears all drawing commands from the graphics context, effectively resetting it. This includes clearing the path,
   * and optionally resetting transformations to the identity matrix.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  clear() {
    return this._activePath.clear(), this.instructions.length = 0, this.resetTransform(), this.onUpdate(), this;
  }
  onUpdate() {
    this._boundsDirty = !0, this.dirty = !0, this.emit("update", this, 16);
  }
  /** The bounds of the graphic shape. */
  get bounds() {
    if (!this._boundsDirty) return this._bounds;
    this._boundsDirty = !1;
    const t = this._bounds;
    t.clear();
    for (let e = 0; e < this.instructions.length; e++) {
      const i = this.instructions[e], r = i.action;
      if (r === "fill") {
        const n = i.data;
        t.addBounds(n.path.bounds);
      } else if (r === "texture") {
        const n = i.data;
        t.addFrame(n.dx, n.dy, n.dx + n.dw, n.dy + n.dh, n.transform);
      }
      if (r === "stroke") {
        const n = i.data, o = n.style.alignment;
        let a = n.style.width * (1 - o);
        n.style.join === "miter" && (a *= ic(n.path, n.style.miterLimit));
        const h = n.path.bounds;
        t.addFrame(
          h.minX - a,
          h.minY - a,
          h.maxX + a,
          h.maxY + a
        );
      }
    }
    return t.isValid || t.set(0, 0, 0, 0), t;
  }
  /**
   * Check to see if a point is contained within this geometry.
   * @param point - Point to check if it's contained.
   * @returns {boolean} `true` if the point is contained within geometry.
   */
  containsPoint(t) {
    var r;
    if (!this.bounds.containsPoint(t.x, t.y)) return !1;
    const e = this.instructions;
    let i = !1;
    for (let n = 0; n < e.length; n++) {
      const o = e[n], a = o.data, h = a.path;
      if (!o.action || !h) continue;
      const l = a.style, c = h.shapePath.shapePrimitives;
      for (let u = 0; u < c.length; u++) {
        const f = c[u].shape;
        if (!l || !f) continue;
        const d = c[u].transform, p = d ? d.applyInverse(t, rc) : t;
        if (o.action === "fill")
          i = f.contains(p.x, p.y);
        else {
          const m = l;
          i = f.strokeContains(p.x, p.y, m.width, m.alignment);
        }
        const g = a.hole;
        if (g) {
          const m = (r = g.shapePath) == null ? void 0 : r.shapePrimitives;
          if (m)
            for (let x = 0; x < m.length; x++)
              m[x].shape.contains(p.x, p.y) && (i = !1);
        }
        if (i)
          return !0;
      }
    }
    return i;
  }
  /** Unloads the GPU data from the graphics context. */
  unload() {
    var t;
    this.emit("unload", this);
    for (const e in this._gpuData)
      (t = this._gpuData[e]) == null || t.destroy();
    this._gpuData = /* @__PURE__ */ Object.create(null);
  }
  /**
   * Destroys the GraphicsData object.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @example
   * context.destroy();
   * context.destroy(true);
   * context.destroy({ texture: true, textureSource: true });
   */
  destroy(t = !1) {
    if (this.destroyed) return;
    if (this.destroyed = !0, this._stateStack.length = 0, this._transform = null, this.unload(), this.emit("destroy", this), this.removeAllListeners(), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const i = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      this._fillStyle.texture && (this._fillStyle.fill && "uid" in this._fillStyle.fill ? this._fillStyle.fill.destroy() : this._fillStyle.texture.destroy(i)), this._strokeStyle.texture && (this._strokeStyle.fill && "uid" in this._strokeStyle.fill ? this._strokeStyle.fill.destroy() : this._strokeStyle.texture.destroy(i));
    }
    this._fillStyle = null, this._strokeStyle = null, this.instructions = null, this._activePath = null, this._bounds = null, this._stateStack = null, this.customShader = null, this._transform = null;
  }
};
ri.defaultFillStyle = {
  /** The color to use for the fill. */
  color: 16777215,
  /** The alpha value to use for the fill. */
  alpha: 1,
  /** The texture to use for the fill. */
  texture: L.WHITE,
  /** The matrix to apply. */
  matrix: null,
  /** The fill pattern to use. */
  fill: null,
  /** Whether coordinates are 'global' or 'local' */
  textureSpace: "local"
};
ri.defaultStrokeStyle = {
  /** The width of the stroke. */
  width: 1,
  /** The color to use for the stroke. */
  color: 16777215,
  /** The alpha value to use for the stroke. */
  alpha: 1,
  /** The alignment of the stroke. */
  alignment: 0.5,
  /** The miter limit to use. */
  miterLimit: 10,
  /** The line cap style to use. */
  cap: "butt",
  /** The line join style to use. */
  join: "miter",
  /** The texture to use for the fill. */
  texture: L.WHITE,
  /** The matrix to apply. */
  matrix: null,
  /** The fill pattern to use. */
  fill: null,
  /** Whether coordinates are 'global' or 'local' */
  textureSpace: "local",
  /** If the stroke is a pixel line. */
  pixelLine: !1
};
let Jt = ri;
class nc {
  constructor() {
    this.isBatchable = !1;
  }
  /**
   * Reset cached canvas data.
   * @advanced
   */
  reset() {
    this.isBatchable = !1, this.context = null, this.graphicsData && (this.graphicsData.destroy(), this.graphicsData = null);
  }
  /**
   * Destroy the cached data.
   * @advanced
   */
  destroy() {
    this.reset();
  }
}
class oc {
  constructor() {
    this.instructions = new js();
  }
  /**
   * Initialize render data.
   * @advanced
   */
  init() {
    this.instructions.reset();
  }
  /**
   * Destroy render data.
   * @advanced
   */
  destroy() {
    this.instructions.destroy(), this.instructions = null;
  }
}
const ni = class Vs {
  constructor(t) {
    this._renderer = t, this._managedContexts = new He({ renderer: t, type: "resource", name: "graphicsContext" });
  }
  /**
   * Runner init called, update the default options
   * @ignore
   */
  init(t) {
    Vs.defaultOptions.bezierSmoothness = (t == null ? void 0 : t.bezierSmoothness) ?? Vs.defaultOptions.bezierSmoothness;
  }
  /**
   * Returns the render data for a given GraphicsContext.
   * @param context - The GraphicsContext to get the render data for.
   * @internal
   */
  getContextRenderData(t) {
    return this.getGpuContext(t).graphicsData || this._initContextRenderData(t);
  }
  /**
   * Updates the GPU context for a given GraphicsContext.
   * @param context - The GraphicsContext to update.
   * @returns The updated CanvasGraphicsContext.
   * @internal
   */
  updateGpuContext(t) {
    const e = t._gpuData, i = !!e[this._renderer.uid], r = e[this._renderer.uid] || this._initContext(t);
    return (t.dirty || !i) && (i && r.reset(), r.isBatchable = !1, t.dirty = !1), r;
  }
  /**
   * Returns the CanvasGraphicsContext for a given GraphicsContext.
   * If it does not exist, it will initialize a new one.
   * @param context - The GraphicsContext to get the CanvasGraphicsContext for.
   * @returns The CanvasGraphicsContext for the given GraphicsContext.
   * @internal
   */
  getGpuContext(t) {
    return t._gpuData[this._renderer.uid] || this._initContext(t);
  }
  _initContextRenderData(t) {
    const e = new oc(), i = this.getGpuContext(t);
    return i.graphicsData = e, e.init(), e;
  }
  _initContext(t) {
    const e = new nc();
    return e.context = t, t._gpuData[this._renderer.uid] = e, this._managedContexts.add(t), e;
  }
  destroy() {
    this._managedContexts.destroy(), this._renderer = null;
  }
};
ni.extension = {
  type: [
    I.CanvasSystem
  ],
  name: "graphicsContext"
};
ni.defaultOptions = {
  /**
   * A value from 0 to 1 that controls the smoothness of bezier curves (the higher the smoother)
   * @default 0.5
   */
  bezierSmoothness: 0.5
};
let ac = ni;
class eo {
  constructor(t, e) {
    this.state = Mn.for2d(), this.renderer = t, this._adaptor = e, this.renderer.runners.contextChange.add(this), this._managedGraphics = new He({ renderer: t, type: "renderable", priority: -1, name: "graphics" });
  }
  contextChange() {
    this._adaptor.contextChange(this.renderer);
  }
  validateRenderable(t) {
    return !1;
  }
  addRenderable(t, e) {
    this._managedGraphics.add(t), this.renderer.renderPipes.batch.break(e), e.add(t);
  }
  updateRenderable(t) {
  }
  execute(t) {
    t.isRenderable && this._adaptor.execute(this, t);
  }
  destroy() {
    this._managedGraphics.destroy(), this.renderer = null, this._adaptor.destroy(), this._adaptor = null;
  }
}
eo.extension = {
  type: [
    I.CanvasPipes
  ],
  name: "graphics"
};
function hc(s, t, e) {
  const i = (s >> 24 & 255) / 255;
  t[e++] = (s & 255) / 255 * i, t[e++] = (s >> 8 & 255) / 255 * i, t[e++] = (s >> 16 & 255) / 255 * i, t[e++] = i;
}
class lc {
  constructor() {
    this.batches = [], this.batched = !1;
  }
  destroy() {
    this.batches.forEach((t) => {
      Z.return(t);
    }), this.batches.length = 0;
  }
}
class so {
  constructor(t, e) {
    this.state = Mn.for2d(), this.renderer = t, this._adaptor = e, this.renderer.runners.contextChange.add(this), this._managedGraphics = new He({ renderer: t, type: "renderable", priority: -1, name: "graphics" });
  }
  contextChange() {
    this._adaptor.contextChange(this.renderer);
  }
  validateRenderable(t) {
    const e = t.context, i = !!t._gpuData, n = this.renderer.graphicsContext.updateGpuContext(e);
    return !!(n.isBatchable || i !== n.isBatchable);
  }
  addRenderable(t, e) {
    const r = this.renderer.graphicsContext.updateGpuContext(t.context);
    t.didViewUpdate && this._rebuild(t), r.isBatchable ? this._addToBatcher(t, e) : (this.renderer.renderPipes.batch.break(e), e.add(t));
  }
  updateRenderable(t) {
    const i = this._getGpuDataForRenderable(t).batches;
    for (let r = 0; r < i.length; r++) {
      const n = i[r];
      n._batcher.updateElement(n);
    }
  }
  execute(t) {
    if (!t.isRenderable) return;
    const e = this.renderer, i = t.context;
    if (!e.graphicsContext.getGpuContext(i).batches.length)
      return;
    const n = i.customShader || this._adaptor.shader;
    this.state.blendMode = t.groupBlendMode;
    const o = n.resources.localUniforms.uniforms;
    o.uTransformMatrix = t.groupTransform, o.uRound = e._roundPixels | t._roundPixels, hc(
      t.groupColorAlpha,
      o.uColor,
      0
    ), this._adaptor.execute(this, t);
  }
  _rebuild(t) {
    const e = this._getGpuDataForRenderable(t), r = this.renderer.graphicsContext.updateGpuContext(t.context);
    e.destroy(), r.isBatchable && this._updateBatchesForRenderable(t, e);
  }
  _addToBatcher(t, e) {
    const i = this.renderer.renderPipes.batch, r = this._getGpuDataForRenderable(t).batches;
    for (let n = 0; n < r.length; n++) {
      const o = r[n];
      i.addToBatch(o, e);
    }
  }
  _getGpuDataForRenderable(t) {
    return t._gpuData[this.renderer.uid] || this._initGpuDataForRenderable(t);
  }
  _initGpuDataForRenderable(t) {
    const e = new lc();
    return t._gpuData[this.renderer.uid] = e, this._managedGraphics.add(t), e;
  }
  _updateBatchesForRenderable(t, e) {
    const i = t.context, n = this.renderer.graphicsContext.getGpuContext(i), o = this.renderer._roundPixels | t._roundPixels;
    e.batches = n.batches.map((a) => {
      const h = Z.get(ti);
      return a.copyTo(h), h.renderable = t, h.roundPixels = o, h;
    });
  }
  destroy() {
    this._managedGraphics.destroy(), this.renderer = null, this._adaptor.destroy(), this._adaptor = null, this.state = null;
  }
}
so.extension = {
  type: [
    I.WebGLPipes,
    I.WebGPUPipes
  ],
  name: "graphics"
};
X.add(eo);
X.add(so);
X.add(ac);
X.add(ii);
class pt extends tn {
  /**
   * Creates a new Graphics object.
   * @param options - Options for the Graphics.
   */
  constructor(t) {
    t instanceof Jt && (t = { context: t });
    const { context: e, roundPixels: i, ...r } = t || {};
    super({
      label: "Graphics",
      ...r
    }), this.renderPipeId = "graphics", e ? this.context = e : (this.context = this._ownedContext = new Jt(), this.context.autoGarbageCollect = this.autoGarbageCollect), this.didViewUpdate = !0, this.allowChildren = !1, this.roundPixels = i ?? !1;
  }
  set context(t) {
    t !== this._context && (this._context && (this._context.off("update", this.onViewUpdate, this), this._context.off("unload", this.unload, this)), this._context = t, this._context.on("update", this.onViewUpdate, this), this._context.on("unload", this.unload, this), this.onViewUpdate());
  }
  /**
   * The underlying graphics context used for drawing operations.
   * Controls how shapes and paths are rendered.
   * @example
   * ```ts
   * // Create a shared context
   * const sharedContext = new GraphicsContext();
   *
   * // Create graphics objects sharing the same context
   * const graphics1 = new Graphics();
   * const graphics2 = new Graphics();
   *
   * // Assign shared context
   * graphics1.context = sharedContext;
   * graphics2.context = sharedContext;
   *
   * // Both graphics will show the same shapes
   * sharedContext
   *     .rect(0, 0, 100, 100)
   *     .fill({ color: 0xff0000 });
   * ```
   * @see {@link GraphicsContext} For drawing operations
   * @see {@link GraphicsOptions} For context configuration
   */
  get context() {
    return this._context;
  }
  /**
   * The local bounds of the graphics object.
   * Returns the boundaries after all graphical operations but before any transforms.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Draw a shape
   * graphics
   *     .rect(0, 0, 100, 100)
   *     .fill({ color: 0xff0000 });
   *
   * // Get bounds information
   * const bounds = graphics.bounds;
   * console.log(bounds.width);  // 100
   * console.log(bounds.height); // 100
   * ```
   * @readonly
   * @see {@link Bounds} For bounds operations
   * @see {@link Container#getBounds} For transformed bounds
   */
  get bounds() {
    return this._context.bounds;
  }
  /**
   * Graphics objects do not need to update their bounds as the context handles this.
   * @private
   */
  updateBounds() {
  }
  /**
   * Checks if the object contains the given point.
   * Returns true if the point lies within the Graphics object's rendered area.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Draw a shape
   * graphics
   *     .rect(0, 0, 100, 100)
   *     .fill({ color: 0xff0000 });
   *
   * // Check point intersection
   * if (graphics.containsPoint({ x: 50, y: 50 })) {
   *     console.log('Point is inside rectangle!');
   * }
   * ```
   * @param point - The point to check in local coordinates
   * @returns True if the point is inside the Graphics object
   * @see {@link Graphics#bounds} For bounding box checks
   * @see {@link PointData} For point data structure
   */
  containsPoint(t) {
    return this._context.containsPoint(t);
  }
  /**
   * Destroys this graphics renderable and optionally its context.
   * @param options - Options parameter. A boolean will act as if all options
   *
   * If the context was created by this graphics and `destroy(false)` or `destroy()` is called
   * then the context will still be destroyed.
   *
   * If you want to explicitly not destroy this context that this graphics created,
   * then you should pass destroy({ context: false })
   *
   * If the context was passed in as an argument to the constructor then it will not be destroyed
   * @example
   * ```ts
   * // Destroy the graphics and its context
   * graphics.destroy();
   * graphics.destroy(true);
   * graphics.destroy({ context: true, texture: true, textureSource: true });
   * ```
   */
  destroy(t) {
    this._ownedContext && !t ? this._ownedContext.destroy(t) : (t === !0 || (t == null ? void 0 : t.context) === !0) && this._context.destroy(t), this._ownedContext = null, this._context = null, super.destroy(t);
  }
  /**
   * @param now - The current time in milliseconds.
   * @internal
   */
  _onTouch(t) {
    this._gcLastUsed = t, this._context._gcLastUsed = t;
  }
  _callContextMethod(t, e) {
    return this.context[t](...e), this;
  }
  // --------------------------------------- GraphicsContext methods ---------------------------------------
  /**
   * Sets the current fill style of the graphics context.
   * The fill style can be a color, gradient, pattern, or a complex style object.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Basic color fill
   * graphics
   *     .setFillStyle({ color: 0xff0000 }) // Red fill
   *     .rect(0, 0, 100, 100)
   *     .fill();
   *
   * // Gradient fill
   * const gradient = new FillGradient({
   *    end: { x: 1, y: 0 },
   *    colorStops: [
   *         { offset: 0, color: 0xff0000 }, // Red at start
   *         { offset: 0.5, color: 0x00ff00 }, // Green at middle
   *         { offset: 1, color: 0x0000ff }, // Blue at end
   *    ],
   * });
   *
   * graphics
   *     .setFillStyle(gradient)
   *     .circle(100, 100, 50)
   *     .fill();
   *
   * // Pattern fill
   * const pattern = new FillPattern(texture);
   * graphics
   *     .setFillStyle({
   *         fill: pattern,
   *         alpha: 0.5
   *     })
   *     .rect(0, 0, 200, 200)
   *     .fill();
   * ```
   * @param {FillInput} args - The fill style to apply
   * @returns The Graphics instance for chaining
   * @see {@link FillStyle} For fill style options
   * @see {@link FillGradient} For gradient fills
   * @see {@link FillPattern} For pattern fills
   */
  setFillStyle(...t) {
    return this._callContextMethod("setFillStyle", t);
  }
  /**
   * Sets the current stroke style of the graphics context.
   * Similar to fill styles, stroke styles can encompass colors, gradients, patterns, or more detailed configurations.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Basic color stroke
   * graphics
   *     .setStrokeStyle({
   *         width: 2,
   *         color: 0x000000
   *     })
   *     .rect(0, 0, 100, 100)
   *     .stroke();
   *
   * // Complex stroke style
   * graphics
   *     .setStrokeStyle({
   *         width: 4,
   *         color: 0xff0000,
   *         alpha: 0.5,
   *         join: 'round',
   *         cap: 'round',
   *         alignment: 0.5
   *     })
   *     .circle(100, 100, 50)
   *     .stroke();
   *
   * // Gradient stroke
   * const gradient = new FillGradient({
   *    end: { x: 1, y: 0 },
   *    colorStops: [
   *         { offset: 0, color: 0xff0000 }, // Red at start
   *         { offset: 0.5, color: 0x00ff00 }, // Green at middle
   *         { offset: 1, color: 0x0000ff }, // Blue at end
   *    ],
   * });
   *
   * graphics
   *     .setStrokeStyle({
   *         width: 10,
   *         fill: gradient
   *     })
   *     .poly([0,0, 100,50, 0,100])
   *     .stroke();
   * ```
   * @param {StrokeInput} args - The stroke style to apply
   * @returns The Graphics instance for chaining
   * @see {@link StrokeStyle} For stroke style options
   * @see {@link FillGradient} For gradient strokes
   * @see {@link FillPattern} For pattern strokes
   */
  setStrokeStyle(...t) {
    return this._callContextMethod("setStrokeStyle", t);
  }
  fill(...t) {
    return this._callContextMethod("fill", t);
  }
  /**
   * Strokes the current path with the current stroke style or specified style.
   * Outlines the shape using the stroke settings.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Stroke with direct color
   * graphics
   *     .circle(50, 50, 25)
   *     .stroke({
   *         width: 2,
   *         color: 0xff0000
   *     }); // 2px red stroke
   *
   * // Fill with texture
   * graphics
   *    .rect(0, 0, 100, 100)
   *    .stroke(myTexture); // Fill with texture
   *
   * // Stroke with gradient
   * const gradient = new FillGradient({
   *     end: { x: 1, y: 0 },
   *     colorStops: [
   *         { offset: 0, color: 0xff0000 },
   *         { offset: 0.5, color: 0x00ff00 },
   *         { offset: 1, color: 0x0000ff },
   *     ],
   * });
   *
   * graphics
   *     .rect(0, 0, 100, 100)
   *     .stroke({
   *         width: 4,
   *         fill: gradient,
   *         alignment: 0.5,
   *         join: 'round'
   *     });
   * ```
   * @param {StrokeStyle} args - Optional stroke style to apply. Can be:
   * - A stroke style object with width, color, etc.
   * - A gradient
   * - A pattern
   * If omitted, uses current stroke style.
   * @returns The Graphics instance for chaining
   * @see {@link StrokeStyle} For stroke style options
   * @see {@link FillGradient} For gradient strokes
   * @see {@link setStrokeStyle} For setting default stroke style
   */
  stroke(...t) {
    return this._callContextMethod("stroke", t);
  }
  texture(...t) {
    return this._callContextMethod("texture", t);
  }
  /**
   * Resets the current path. Any previous path and its commands are discarded and a new path is
   * started. This is typically called before beginning a new shape or series of drawing commands.
   * @example
   * ```ts
   * const graphics = new Graphics();
   * graphics
   *     .circle(150, 150, 50)
   *     .fill({ color: 0x00ff00 })
   *     .beginPath() // Starts a new path
   *     .circle(250, 150, 50)
   *     .fill({ color: 0x0000ff });
   * ```
   * @returns The Graphics instance for chaining
   * @see {@link Graphics#moveTo} For starting a new subpath
   * @see {@link Graphics#closePath} For closing the current path
   */
  beginPath() {
    return this._callContextMethod("beginPath", []);
  }
  /**
   * Applies a cutout to the last drawn shape. This is used to create holes or complex shapes by
   * subtracting a path from the previously drawn path.
   *
   * If a hole is not completely in a shape, it will fail to cut correctly.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Draw outer circle
   * graphics
   *     .circle(100, 100, 50)
   *     .fill({ color: 0xff0000 });
   *     .circle(100, 100, 25) // Inner circle
   *     .cut() // Cuts out the inner circle from the outer circle
   * ```
   */
  cut() {
    return this._callContextMethod("cut", []);
  }
  arc(...t) {
    return this._callContextMethod("arc", t);
  }
  arcTo(...t) {
    return this._callContextMethod("arcTo", t);
  }
  arcToSvg(...t) {
    return this._callContextMethod("arcToSvg", t);
  }
  bezierCurveTo(...t) {
    return this._callContextMethod("bezierCurveTo", t);
  }
  /**
   * Closes the current path by drawing a straight line back to the start point.
   *
   * This is useful for completing shapes and ensuring they are properly closed for fills.
   * @example
   * ```ts
   * // Create a triangle with closed path
   * const graphics = new Graphics();
   * graphics
   *     .moveTo(50, 50)
   *     .lineTo(100, 100)
   *     .lineTo(0, 100)
   *     .closePath()
   * ```
   * @returns The Graphics instance for method chaining
   * @see {@link Graphics#beginPath} For starting a new path
   * @see {@link Graphics#fill} For filling closed paths
   * @see {@link Graphics#stroke} For stroking paths
   */
  closePath() {
    return this._callContextMethod("closePath", []);
  }
  ellipse(...t) {
    return this._callContextMethod("ellipse", t);
  }
  circle(...t) {
    return this._callContextMethod("circle", t);
  }
  path(...t) {
    return this._callContextMethod("path", t);
  }
  lineTo(...t) {
    return this._callContextMethod("lineTo", t);
  }
  moveTo(...t) {
    return this._callContextMethod("moveTo", t);
  }
  quadraticCurveTo(...t) {
    return this._callContextMethod("quadraticCurveTo", t);
  }
  rect(...t) {
    return this._callContextMethod("rect", t);
  }
  roundRect(...t) {
    return this._callContextMethod("roundRect", t);
  }
  poly(...t) {
    return this._callContextMethod("poly", t);
  }
  regularPoly(...t) {
    return this._callContextMethod("regularPoly", t);
  }
  roundPoly(...t) {
    return this._callContextMethod("roundPoly", t);
  }
  roundShape(...t) {
    return this._callContextMethod("roundShape", t);
  }
  filletRect(...t) {
    return this._callContextMethod("filletRect", t);
  }
  chamferRect(...t) {
    return this._callContextMethod("chamferRect", t);
  }
  star(...t) {
    return this._callContextMethod("star", t);
  }
  svg(...t) {
    return this._callContextMethod("svg", t);
  }
  restore(...t) {
    return this._callContextMethod("restore", t);
  }
  /**
   * Saves the current graphics state onto a stack. The state includes:
   * - Current transformation matrix
   * - Current fill style
   * - Current stroke style
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Save state before complex operations
   * graphics.save();
   *
   * // Create transformed and styled shape
   * graphics
   *     .translateTransform(100, 100)
   *     .rotateTransform(Math.PI / 4)
   *     .setFillStyle({
   *         color: 0xff0000,
   *         alpha: 0.5
   *     })
   *     .rect(-25, -25, 50, 50)
   *     .fill();
   *
   * // Restore to original state
   * graphics.restore();
   *
   * // Continue drawing with previous state
   * graphics
   *     .circle(50, 50, 25)
   *     .fill();
   * ```
   * @returns The Graphics instance for method chaining
   * @see {@link Graphics#restore} For restoring the saved state
   * @see {@link Graphics#setTransform} For setting transformations
   */
  save() {
    return this._callContextMethod("save", []);
  }
  /**
   * Returns the current transformation matrix of the graphics context.
   * This matrix represents all accumulated transformations including translate, scale, and rotate.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Apply some transformations
   * graphics
   *     .translateTransform(100, 100)
   *     .rotateTransform(Math.PI / 4);
   *
   * // Get the current transform matrix
   * const matrix = graphics.getTransform();
   * console.log(matrix.tx, matrix.ty); // 100, 100
   *
   * // Use the matrix for other operations
   * graphics
   *     .setTransform(matrix)
   *     .circle(0, 0, 50)
   *     .fill({ color: 0xff0000 });
   * ```
   * @returns The current transformation matrix.
   * @see {@link Graphics#setTransform} For setting the transform matrix
   * @see {@link Matrix} For matrix operations
   */
  getTransform() {
    return this.context.getTransform();
  }
  /**
   * Resets the current transformation matrix to the identity matrix, effectively removing
   * any transformations (rotation, scaling, translation) previously applied.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Apply transformations
   * graphics
   *     .translateTransform(100, 100)
   *     .scaleTransform(2, 2)
   *     .circle(0, 0, 25)
   *     .fill({ color: 0xff0000 });
   * // Reset transform to default state
   * graphics
   *     .resetTransform()
   *     .circle(50, 50, 25) // Will draw at actual coordinates
   *     .fill({ color: 0x00ff00 });
   * ```
   * @returns The Graphics instance for method chaining
   * @see {@link Graphics#getTransform} For getting the current transform
   * @see {@link Graphics#setTransform} For setting a specific transform
   * @see {@link Graphics#save} For saving the current transform state
   * @see {@link Graphics#restore} For restoring a previous transform state
   */
  resetTransform() {
    return this._callContextMethod("resetTransform", []);
  }
  rotateTransform(...t) {
    return this._callContextMethod("rotate", t);
  }
  scaleTransform(...t) {
    return this._callContextMethod("scale", t);
  }
  setTransform(...t) {
    return this._callContextMethod("setTransform", t);
  }
  transform(...t) {
    return this._callContextMethod("transform", t);
  }
  translateTransform(...t) {
    return this._callContextMethod("translate", t);
  }
  /**
   * Clears all drawing commands from the graphics context, effectively resetting it.
   * This includes clearing the current path, fill style, stroke style, and transformations.
   *
   * > [!NOTE] Graphics objects are not designed to be continuously cleared and redrawn.
   * > Instead, they are intended to be used for static or semi-static graphics that
   * > can be redrawn as needed. Frequent clearing and redrawing may lead to performance issues.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Draw some shapes
   * graphics
   *     .circle(100, 100, 50)
   *     .fill({ color: 0xff0000 })
   *     .rect(200, 100, 100, 50)
   *     .fill({ color: 0x00ff00 });
   *
   * // Clear all graphics
   * graphics.clear();
   *
   * // Start fresh with new shapes
   * graphics
   *     .circle(150, 150, 30)
   *     .fill({ color: 0x0000ff });
   * ```
   * @returns The Graphics instance for method chaining
   * @see {@link Graphics#beginPath} For starting a new path without clearing styles
   * @see {@link Graphics#save} For saving the current state
   * @see {@link Graphics#restore} For restoring a previous state
   */
  clear() {
    return this._callContextMethod("clear", []);
  }
  /**
   * Gets or sets the current fill style for the graphics context. The fill style determines
   * how shapes are filled when using the fill() method.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Basic color fill
   * graphics.fillStyle = {
   *     color: 0xff0000,  // Red
   *     alpha: 1
   * };
   *
   * // Using gradients
   * const gradient = new FillGradient({
   *     end: { x: 0, y: 1 }, // Vertical gradient
   *     stops: [
   *         { offset: 0, color: 0xff0000, alpha: 1 }, // Start color
   *         { offset: 1, color: 0x0000ff, alpha: 1 }  // End color
   *     ]
   * });
   *
   * graphics.fillStyle = {
   *     fill: gradient,
   *     alpha: 0.8
   * };
   *
   * // Using patterns
   * graphics.fillStyle = {
   *     texture: myTexture,
   *     alpha: 1,
   *     matrix: new Matrix()
   *         .scale(0.5, 0.5)
   *         .rotate(Math.PI / 4)
   * };
   * ```
   * @type {ConvertedFillStyle}
   * @see {@link FillStyle} For all available fill style options
   * @see {@link FillGradient} For creating gradient fills
   * @see {@link Graphics#fill} For applying the fill to paths
   */
  get fillStyle() {
    return this._context.fillStyle;
  }
  set fillStyle(t) {
    this._context.fillStyle = t;
  }
  /**
   * Gets or sets the current stroke style for the graphics context. The stroke style determines
   * how paths are outlined when using the stroke() method.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Basic stroke style
   * graphics.strokeStyle = {
   *     width: 2,
   *     color: 0xff0000,
   *     alpha: 1
   * };
   *
   * // Using with gradients
   * const gradient = new FillGradient({
   *   end: { x: 0, y: 1 },
   *   stops: [
   *       { offset: 0, color: 0xff0000, alpha: 1 },
   *       { offset: 1, color: 0x0000ff, alpha: 1 }
   *   ]
   * });
   *
   * graphics.strokeStyle = {
   *     width: 4,
   *     fill: gradient,
   *     alignment: 0.5,
   *     join: 'round',
   *     cap: 'round'
   * };
   *
   * // Complex stroke settings
   * graphics.strokeStyle = {
   *     width: 6,
   *     color: 0x00ff00,
   *     alpha: 0.5,
   *     join: 'miter',
   *     miterLimit: 10,
   * };
   * ```
   * @see {@link StrokeStyle} For all available stroke style options
   * @see {@link Graphics#stroke} For applying the stroke to paths
   */
  get strokeStyle() {
    return this._context.strokeStyle;
  }
  set strokeStyle(t) {
    this._context.strokeStyle = t;
  }
  /**
   * Creates a new Graphics object that copies the current graphics content.
   * The clone can either share the same context (shallow clone) or have its own independent
   * context (deep clone).
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Create original graphics content
   * graphics
   *     .circle(100, 100, 50)
   *     .fill({ color: 0xff0000 });
   *
   * // Create a shallow clone (shared context)
   * const shallowClone = graphics.clone();
   *
   * // Changes to original affect the clone
   * graphics
   *     .circle(200, 100, 30)
   *     .fill({ color: 0x00ff00 });
   *
   * // Create a deep clone (independent context)
   * const deepClone = graphics.clone(true);
   *
   * // Modify deep clone independently
   * deepClone
   *     .translateTransform(100, 100)
   *     .circle(0, 0, 40)
   *     .fill({ color: 0x0000ff });
   * ```
   * @param deep - Whether to create a deep clone of the graphics object.
   *              If false (default), the context will be shared between objects.
   *              If true, creates an independent copy of the context.
   * @returns A new Graphics instance with either shared or copied context
   * @see {@link Graphics#context} For accessing the underlying graphics context
   * @see {@link GraphicsContext} For understanding the shared context behavior
   */
  clone(t = !1) {
    return t ? new pt(this._context.clone()) : (this._ownedContext = null, new pt(this._context));
  }
  // -------- v7 deprecations ---------
  /**
   * @param width
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#setStrokeStyle} instead
   */
  lineStyle(t, e, i) {
    B(H, "Graphics#lineStyle is no longer needed. Use Graphics#setStrokeStyle to set the stroke style.");
    const r = {};
    return t && (r.width = t), e && (r.color = e), i && (r.alpha = i), this.context.strokeStyle = r, this;
  }
  /**
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  beginFill(t, e) {
    B(H, "Graphics#beginFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.");
    const i = {};
    return t !== void 0 && (i.color = t), e !== void 0 && (i.alpha = e), this.context.fillStyle = i, this;
  }
  /**
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  endFill() {
    B(H, "Graphics#endFill is no longer needed. Use Graphics#fill to fill the shape with the desired style."), this.context.fill();
    const t = this.context.strokeStyle;
    return (t.width !== Jt.defaultStrokeStyle.width || t.color !== Jt.defaultStrokeStyle.color || t.alpha !== Jt.defaultStrokeStyle.alpha) && this.context.stroke(), this;
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#circle} instead
   */
  drawCircle(...t) {
    return B(H, "Graphics#drawCircle has been renamed to Graphics#circle"), this._callContextMethod("circle", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#ellipse} instead
   */
  drawEllipse(...t) {
    return B(H, "Graphics#drawEllipse has been renamed to Graphics#ellipse"), this._callContextMethod("ellipse", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#poly} instead
   */
  drawPolygon(...t) {
    return B(H, "Graphics#drawPolygon has been renamed to Graphics#poly"), this._callContextMethod("poly", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#rect} instead
   */
  drawRect(...t) {
    return B(H, "Graphics#drawRect has been renamed to Graphics#rect"), this._callContextMethod("rect", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#roundRect} instead
   */
  drawRoundedRect(...t) {
    return B(H, "Graphics#drawRoundedRect has been renamed to Graphics#roundRect"), this._callContextMethod("roundRect", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#star} instead
   */
  drawStar(...t) {
    return B(H, "Graphics#drawStar has been renamed to Graphics#star"), this._callContextMethod("star", t);
  }
}
X.add(lo, co);
const et = 960, st = 640, cc = 20, uc = 120, yr = 0.18, _r = 0.065, _s = 6, br = 0.98, Ft = 12, dc = 14, vr = 10, fc = 55, pc = {
  large: 48,
  medium: 26,
  small: 13
}, mc = {
  large: 20,
  medium: 50,
  small: 100
}, wr = 6, gc = 10, Sr = 0.28, xc = 3, yc = 2, _c = 3, bc = 120, Ye = 5213439, vc = 10526896, Cr = 100;
function wc({ onAppReady: s, onError: t }) {
  const e = Cs(null), i = Cs(t);
  return i.current = t, $s(() => {
    if (!e.current) return;
    const r = e.current, n = new zn();
    let o = !1, a = !1;
    const h = (c) => {
      var f;
      c.preventDefault();
      const u = new Error("WebGL context lost");
      console.error("[AsteroidBlaster] WebGL context lost", u), (f = i.current) == null || f.call(i, u);
    };
    async function l() {
      var c;
      try {
        await n.init({
          width: et,
          height: st,
          backgroundAlpha: 0,
          antialias: !0,
          resolution: Math.min(window.devicePixelRatio, 2),
          autoDensity: !0
        });
      } catch (u) {
        const f = u instanceof Error ? u : new Error(String(u));
        console.error("[AsteroidBlaster] PixiJS init failed:", f), n.destroy(!0, { children: !0, texture: !0 }), (c = i.current) == null || c.call(i, f);
        return;
      }
      if (a) {
        n.destroy(!0, { children: !0, texture: !0 });
        return;
      }
      o = !0, n.canvas.style.width = "100%", n.canvas.style.height = "100%", n.canvas.style.display = "block", n.canvas.style.objectFit = "contain", n.canvas.addEventListener("webglcontextlost", h), r.appendChild(n.canvas), s(n);
    }
    return l(), () => {
      o ? (n.canvas.removeEventListener("webglcontextlost", h), n.destroy(!0, { children: !0, texture: !0 })) : a = !0;
    };
  }, []), /* @__PURE__ */ G(
    "div",
    {
      ref: e,
      "aria-hidden": "true",
      style: { position: "absolute", inset: 0 }
    }
  );
}
const Sc = {}, Mr = (s) => {
  let t;
  const e = /* @__PURE__ */ new Set(), i = (c, u) => {
    const f = typeof c == "function" ? c(t) : c;
    if (!Object.is(f, t)) {
      const d = t;
      t = u ?? (typeof f != "object" || f === null) ? f : Object.assign({}, t, f), e.forEach((p) => p(t, d));
    }
  }, r = () => t, h = { setState: i, getState: r, getInitialState: () => l, subscribe: (c) => (e.add(c), () => e.delete(c)), destroy: () => {
    (Sc ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), e.clear();
  } }, l = t = s(i, r, h);
  return h;
}, Cc = (s) => s ? Mr(s) : Mr;
var Hs = { exports: {} }, bs = {}, Ge = { exports: {} }, vs = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ar;
function Mc() {
  if (Ar) return vs;
  Ar = 1;
  var s = me;
  function t(u, f) {
    return u === f && (u !== 0 || 1 / u === 1 / f) || u !== u && f !== f;
  }
  var e = typeof Object.is == "function" ? Object.is : t, i = s.useState, r = s.useEffect, n = s.useLayoutEffect, o = s.useDebugValue;
  function a(u, f) {
    var d = f(), p = i({ inst: { value: d, getSnapshot: f } }), g = p[0].inst, m = p[1];
    return n(
      function() {
        g.value = d, g.getSnapshot = f, h(g) && m({ inst: g });
      },
      [u, d, f]
    ), r(
      function() {
        return h(g) && m({ inst: g }), u(function() {
          h(g) && m({ inst: g });
        });
      },
      [u]
    ), o(d), d;
  }
  function h(u) {
    var f = u.getSnapshot;
    u = u.value;
    try {
      var d = f();
      return !e(u, d);
    } catch {
      return !0;
    }
  }
  function l(u, f) {
    return f();
  }
  var c = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? l : a;
  return vs.useSyncExternalStore = s.useSyncExternalStore !== void 0 ? s.useSyncExternalStore : c, vs;
}
var ws = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Tr;
function Ac() {
  return Tr || (Tr = 1, process.env.NODE_ENV !== "production" && function() {
    function s(d, p) {
      return d === p && (d !== 0 || 1 / d === 1 / p) || d !== d && p !== p;
    }
    function t(d, p) {
      c || r.startTransition === void 0 || (c = !0, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var g = p();
      if (!u) {
        var m = p();
        n(g, m) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), u = !0);
      }
      m = o({
        inst: { value: g, getSnapshot: p }
      });
      var x = m[0].inst, y = m[1];
      return h(
        function() {
          x.value = g, x.getSnapshot = p, e(x) && y({ inst: x });
        },
        [d, g, p]
      ), a(
        function() {
          return e(x) && y({ inst: x }), d(function() {
            e(x) && y({ inst: x });
          });
        },
        [d]
      ), l(g), g;
    }
    function e(d) {
      var p = d.getSnapshot;
      d = d.value;
      try {
        var g = p();
        return !n(d, g);
      } catch {
        return !0;
      }
    }
    function i(d, p) {
      return p();
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var r = me, n = typeof Object.is == "function" ? Object.is : s, o = r.useState, a = r.useEffect, h = r.useLayoutEffect, l = r.useDebugValue, c = !1, u = !1, f = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? i : t;
    ws.useSyncExternalStore = r.useSyncExternalStore !== void 0 ? r.useSyncExternalStore : f, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), ws;
}
var Pr;
function io() {
  return Pr || (Pr = 1, process.env.NODE_ENV === "production" ? Ge.exports = Mc() : Ge.exports = Ac()), Ge.exports;
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Er;
function Tc() {
  if (Er) return bs;
  Er = 1;
  var s = me, t = io();
  function e(l, c) {
    return l === c && (l !== 0 || 1 / l === 1 / c) || l !== l && c !== c;
  }
  var i = typeof Object.is == "function" ? Object.is : e, r = t.useSyncExternalStore, n = s.useRef, o = s.useEffect, a = s.useMemo, h = s.useDebugValue;
  return bs.useSyncExternalStoreWithSelector = function(l, c, u, f, d) {
    var p = n(null);
    if (p.current === null) {
      var g = { hasValue: !1, value: null };
      p.current = g;
    } else g = p.current;
    p = a(
      function() {
        function x(v) {
          if (!y) {
            if (y = !0, _ = v, v = f(v), d !== void 0 && g.hasValue) {
              var w = g.value;
              if (d(w, v))
                return b = w;
            }
            return b = v;
          }
          if (w = b, i(_, v)) return w;
          var M = f(v);
          return d !== void 0 && d(w, M) ? (_ = v, w) : (_ = v, b = M);
        }
        var y = !1, _, b, S = u === void 0 ? null : u;
        return [
          function() {
            return x(c());
          },
          S === null ? void 0 : function() {
            return x(S());
          }
        ];
      },
      [c, u, f, d]
    );
    var m = r(l, p[0], p[1]);
    return o(
      function() {
        g.hasValue = !0, g.value = m;
      },
      [m]
    ), h(m), m;
  }, bs;
}
var Ss = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var kr;
function Pc() {
  return kr || (kr = 1, process.env.NODE_ENV !== "production" && function() {
    function s(l, c) {
      return l === c && (l !== 0 || 1 / l === 1 / c) || l !== l && c !== c;
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var t = me, e = io(), i = typeof Object.is == "function" ? Object.is : s, r = e.useSyncExternalStore, n = t.useRef, o = t.useEffect, a = t.useMemo, h = t.useDebugValue;
    Ss.useSyncExternalStoreWithSelector = function(l, c, u, f, d) {
      var p = n(null);
      if (p.current === null) {
        var g = { hasValue: !1, value: null };
        p.current = g;
      } else g = p.current;
      p = a(
        function() {
          function x(v) {
            if (!y) {
              if (y = !0, _ = v, v = f(v), d !== void 0 && g.hasValue) {
                var w = g.value;
                if (d(w, v))
                  return b = w;
              }
              return b = v;
            }
            if (w = b, i(_, v))
              return w;
            var M = f(v);
            return d !== void 0 && d(w, M) ? (_ = v, w) : (_ = v, b = M);
          }
          var y = !1, _, b, S = u === void 0 ? null : u;
          return [
            function() {
              return x(c());
            },
            S === null ? void 0 : function() {
              return x(S());
            }
          ];
        },
        [c, u, f, d]
      );
      var m = r(l, p[0], p[1]);
      return o(
        function() {
          g.hasValue = !0, g.value = m;
        },
        [m]
      ), h(m), m;
    }, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), Ss;
}
process.env.NODE_ENV === "production" ? Hs.exports = Tc() : Hs.exports = Pc();
var Ec = Hs.exports;
const kc = /* @__PURE__ */ Ys(Ec), ro = {}, { useDebugValue: Ic } = me, { useSyncExternalStoreWithSelector: Rc } = kc;
let Ir = !1;
const Gc = (s) => s;
function Bc(s, t = Gc, e) {
  (ro ? "production" : void 0) !== "production" && e && !Ir && (console.warn(
    "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
  ), Ir = !0);
  const i = Rc(
    s.subscribe,
    s.getState,
    s.getServerState || s.getInitialState,
    t,
    e
  );
  return Ic(i), i;
}
const Rr = (s) => {
  (ro ? "production" : void 0) !== "production" && typeof s != "function" && console.warn(
    "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
  );
  const t = typeof s == "function" ? Cc(s) : s, e = (i, r) => Bc(t, i, r);
  return Object.assign(e, t), e;
}, Fc = (s) => s ? Rr(s) : Rr, Gr = "ab-hiscore", tt = Fc((s, t) => ({
  phase: "menu",
  score: 0,
  lives: 3,
  level: 1,
  hiScore: Number(localStorage.getItem(Gr) ?? 0),
  setPhase: (e) => s({ phase: e }),
  addScore: (e) => {
    const i = t().score + e;
    s({ score: i }), i > t().hiScore && (localStorage.setItem(Gr, String(i)), s({ hiScore: i }));
  },
  loseLife: () => {
    const e = t().lives - 1;
    s({ lives: e }), e <= 0 && s({ phase: "gameover" });
  },
  nextLevel: () => s((e) => ({ level: e.level + 1 })),
  resetGame: () => s({ phase: "playing", score: 0, lives: 3, level: 1 })
}));
function Dc() {
  const { score: s, lives: t, level: e, phase: i } = tt();
  return i === "menu" || i === "gameover" ? null : /* @__PURE__ */ ct(
    "div",
    {
      "aria-live": "polite",
      style: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        fontFamily: "var(--ab-mono)",
        color: "var(--ab-text)"
      },
      children: [
        /* @__PURE__ */ ct("div", { style: { position: "absolute", top: 20, left: 24 }, children: [
          /* @__PURE__ */ G("div", { style: { fontSize: 10, color: "var(--ab-dim)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }, children: "Score" }),
          /* @__PURE__ */ G("div", { style: { fontSize: 20, fontWeight: 500, color: "var(--ab-text)", fontVariantNumeric: "tabular-nums" }, children: String(s).padStart(6, "0") })
        ] }),
        /* @__PURE__ */ ct("div", { style: { position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ab-dim)" }, children: [
          "// Level ",
          e
        ] }),
        /* @__PURE__ */ G("div", { style: { position: "absolute", bottom: 20, right: 24, display: "flex", gap: 6 }, children: Array.from({ length: _c }).map((r, n) => /* @__PURE__ */ G(
          "span",
          {
            style: {
              fontSize: 16,
              color: n < t ? "var(--ab-accent)" : "var(--ab-muted)",
              transition: "color 200ms"
            },
            children: "▲"
          },
          n
        )) }),
        i === "playing" && /* @__PURE__ */ G("div", { style: { position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ab-muted)" }, children: "Esc · Pause" })
      ]
    }
  );
}
class Lc {
  constructor() {
    this.keys = /* @__PURE__ */ new Set(), this.onDown = this.onDown.bind(this), this.onUp = this.onUp.bind(this), window.addEventListener("keydown", this.onDown), window.addEventListener("keyup", this.onUp);
  }
  onDown(t) {
    ["ArrowUp", "ArrowLeft", "ArrowRight", " "].includes(t.key) && t.preventDefault(), this.keys.add(t.key);
  }
  onUp(t) {
    this.keys.delete(t.key);
  }
  snapshot() {
    return {
      thrust: this.keys.has("ArrowUp") || this.keys.has("w") || this.keys.has("W"),
      left: this.keys.has("ArrowLeft") || this.keys.has("a") || this.keys.has("A"),
      right: this.keys.has("ArrowRight") || this.keys.has("d") || this.keys.has("D"),
      fire: this.keys.has(" "),
      pause: this.keys.has("Escape"),
      confirm: this.keys.has("Enter") || this.keys.has(" ")
    };
  }
  destroy() {
    window.removeEventListener("keydown", this.onDown), window.removeEventListener("keyup", this.onUp);
  }
}
class no {
  constructor(t, e) {
    this.lastFreeIdx = 0, this.pool = Array.from({ length: e }, t), this.pool.forEach((i) => i.active = !1);
  }
  acquire() {
    for (let t = 0; t < this.pool.length; t++) {
      const e = (this.lastFreeIdx + t) % this.pool.length;
      if (!this.pool[e].active)
        return this.lastFreeIdx = (e + 1) % this.pool.length, this.pool[e].active = !0, this.pool[e];
    }
    return console.warn("ObjectPool exhausted — increase pool size"), null;
  }
  release(t) {
    t.active = !1;
  }
  forEach(t) {
    for (const e of this.pool)
      e.active && t(e);
  }
  releaseAll(t) {
    this.pool.forEach((e) => {
      t == null || t(e), e.active = !1;
    }), this.lastFreeIdx = 0;
  }
}
class Oc {
  constructor(t) {
    this.pos = { x: et / 2, y: st / 2 }, this.vel = { x: 0, y: 0 }, this.rotation = -Math.PI / 2, this.invincible = 0, this.thrustOn = !1, this.gfx = new pt(), this.gfx.moveTo(0, -Ft), this.gfx.lineTo(Ft * 0.7, Ft * 0.8), this.gfx.lineTo(0, Ft * 0.4), this.gfx.lineTo(-Ft * 0.7, Ft * 0.8), this.gfx.closePath(), this.gfx.stroke({ color: Ye, width: 1.5 }), t.addChild(this.gfx);
  }
  update(t) {
    if (t.left && (this.rotation -= _r), t.right && (this.rotation += _r), this.thrustOn = t.thrust, t.thrust) {
      this.vel.x += Math.cos(this.rotation) * yr, this.vel.y += Math.sin(this.rotation) * yr;
      const e = Math.hypot(this.vel.x, this.vel.y);
      e > _s && (this.vel.x = this.vel.x / e * _s, this.vel.y = this.vel.y / e * _s);
    }
    this.vel.x *= br, this.vel.y *= br, this.pos.x += this.vel.x, this.pos.y += this.vel.y, this.pos.x < 0 && (this.pos.x += et), this.pos.x > et && (this.pos.x -= et), this.pos.y < 0 && (this.pos.y += st), this.pos.y > st && (this.pos.y -= st), this.invincible > 0 && this.invincible--, this.gfx.x = this.pos.x, this.gfx.y = this.pos.y, this.gfx.rotation = this.rotation + Math.PI / 2, this.gfx.alpha = this.invincible > 0 && this.invincible % 6 < 3 ? 0.3 : 1;
  }
  hit() {
    this.invincible = bc, this.vel = { x: 0, y: 0 }, this.pos = { x: et / 2, y: st / 2 };
  }
  destroy() {
    this.gfx.destroy();
  }
}
class ze {
  constructor(t, e, i, r) {
    this.active = !0, this.rotation = 0, this.size = e, this.radius = pc[e], this.pos = i ?? {
      x: Math.random() < 0.5 ? -this.radius : et + this.radius,
      y: Math.random() * st
    };
    const n = Math.random() * 0.8 + 0.4, o = Math.random() * Math.PI * 2;
    this.vel = r ?? { x: Math.cos(o) * n, y: Math.sin(o) * n }, this.rotationSpeed = (Math.random() - 0.5) * 0.02, this.gfx = new pt(), t.addChild(this.gfx), this.buildShape();
  }
  buildShape() {
    const t = wr + Math.floor(Math.random() * (gc - wr)), e = [];
    for (let i = 0; i < t; i++) {
      const r = i / t * Math.PI * 2, n = this.radius * (1 - Sr + Math.random() * Sr);
      e.push(Math.cos(r) * n, Math.sin(r) * n);
    }
    this.gfx.clear(), this.gfx.poly(e).stroke({ color: vc, width: 1.5 });
  }
  update(t) {
    this.pos.x += this.vel.x * t, this.pos.y += this.vel.y * t, this.rotation += this.rotationSpeed;
    const e = this.radius;
    this.pos.x < -e && (this.pos.x += et + e * 2), this.pos.x > et + e && (this.pos.x -= et + e * 2), this.pos.y < -e && (this.pos.y += st + e * 2), this.pos.y > st + e && (this.pos.y -= st + e * 2), this.gfx.x = this.pos.x, this.gfx.y = this.pos.y, this.gfx.rotation = this.rotation;
  }
  split(t) {
    if (this.size === "small") return [];
    const e = this.size === "large" ? "medium" : "small";
    return [
      new ze(t, e, { ...this.pos }, {
        x: this.vel.y * 1.5 + (Math.random() - 0.5),
        y: -this.vel.x * 1.5 + (Math.random() - 0.5)
      }),
      new ze(t, e, { ...this.pos }, {
        x: -this.vel.y * 1.5 + (Math.random() - 0.5),
        y: this.vel.x * 1.5 + (Math.random() - 0.5)
      })
    ];
  }
  destroy() {
    this.active = !1, this.gfx.destroy();
  }
}
class zc {
  constructor(t) {
    this.active = !1, this.pos = { x: 0, y: 0 }, this.vel = { x: 0, y: 0 }, this.radius = 3, this.lifetime = 0, this.gfx = new pt(), this.gfx.circle(0, 0, this.radius).fill({ color: Ye }), this.gfx.visible = !1, t.addChild(this.gfx);
  }
  init(t, e) {
    this.pos = { ...t }, this.vel = { x: Math.cos(e) * vr, y: Math.sin(e) * vr }, this.lifetime = fc, this.gfx.visible = !0;
  }
  update() {
    this.pos.x += this.vel.x, this.pos.y += this.vel.y, this.lifetime--;
    const t = this.pos.x < 0 || this.pos.x > et || this.pos.y < 0 || this.pos.y > st;
    return this.lifetime <= 0 || t ? (this.deactivate(), !1) : (this.gfx.x = this.pos.x, this.gfx.y = this.pos.y, !0);
  }
  deactivate() {
    this.active = !1, this.gfx.visible = !1;
  }
  destroy() {
    this.gfx.destroy();
  }
}
function Br(s, t, e, i) {
  const r = s.x - e.x, n = s.y - e.y;
  return r * r + n * n < (t + i) * (t + i);
}
function Uc(s) {
  return xc + (s - 1);
}
function Nc(s) {
  return Math.min(1 + (s - 1) * 0.05, yc);
}
function Vc(s) {
  return Math.max(dc - (s - 1) * 2, 8);
}
class Hc {
  constructor(t) {
    this.active = !1, this.pos = { x: 0, y: 0 }, this.vel = { x: 0, y: 0 }, this.radius = 2, this.alpha = 1, this.decay = 0.04, this.color = 5213439, this.gfx = new pt(), this.gfx.visible = !1, t.addChild(this.gfx);
  }
  init(t, e, i) {
    this.pos = { ...t }, this.vel = { ...e }, this.alpha = 1, this.color = i, this.decay = 0.035 + Math.random() * 0.025, this.gfx.clear(), this.gfx.circle(0, 0, this.radius).fill({ color: this.color }), this.gfx.alpha = 1, this.gfx.visible = !0;
  }
  update() {
    return this.pos.x += this.vel.x, this.pos.y += this.vel.y, this.vel.x *= 0.96, this.vel.y *= 0.96, this.alpha -= this.decay, this.alpha <= 0 ? (this.active = !1, this.gfx.visible = !1, !1) : (this.gfx.x = this.pos.x, this.gfx.y = this.pos.y, this.gfx.alpha = this.alpha, !0);
  }
  destroy() {
    this.gfx.destroy();
  }
}
class $c {
  constructor(t) {
    this.pool = new no(() => new Hc(t), uc);
  }
  burst(t, e, i) {
    for (let r = 0; r < e; r++) {
      const n = this.pool.acquire();
      if (!n) break;
      const o = Math.random() * Math.PI * 2, a = Math.random() * 3 + 1;
      n.init(t, { x: Math.cos(o) * a, y: Math.sin(o) * a }, i);
    }
  }
  update() {
    this.pool.forEach((t) => t.update());
  }
}
class Yc {
  constructor(t) {
    this.gfx = new pt(), t.addChildAt(this.gfx, 0);
  }
  update(t, e, i, r) {
    if (this.gfx.clear(), !r) return;
    const n = 14 + Math.random() * 8, o = i + Math.PI, a = t + Math.cos(o) * n, h = e + Math.sin(o) * n, l = i + Math.PI / 2, c = 5, u = t + Math.cos(l) * c, f = e + Math.sin(l) * c, d = t - Math.cos(l) * c, p = e - Math.sin(l) * c;
    this.gfx.moveTo(u, f).lineTo(a, h).lineTo(d, p).closePath().fill({ color: Ye, alpha: 0.6 + Math.random() * 0.4 });
  }
  destroy() {
    this.gfx.destroy();
  }
}
function Xc(s) {
  const t = new pt();
  for (let e = 0; e < Cr; e++) {
    const i = e < Cr * 0.7 ? 0 : 1, r = Math.random() * et, n = Math.random() * st, o = i === 0 ? 0.8 : 1.2, a = i === 0 ? 0.2 : 0.45;
    t.circle(r, n, o).fill({ color: 15263984, alpha: a });
  }
  return s.addChildAt(t, 0), t;
}
function Wc(s, t, e = 8, i = 12) {
  const r = t.pivot.x, n = t.pivot.y;
  let o = i;
  function a() {
    if (o <= 0) {
      t.pivot.x = r, t.pivot.y = n, s.remove(a);
      return;
    }
    const h = o / i;
    t.pivot.x = r + (Math.random() - 0.5) * e * h * 2, t.pivot.y = n + (Math.random() - 0.5) * e * h * 2, o--;
  }
  s.add(a);
}
function jc(s, t) {
  const e = Cs(t);
  e.current = t, $s(() => {
    const i = s.stage, r = new Lc(), n = new no(() => new zc(i), cc), o = new $c(i), a = new Yc(i);
    Xc(i);
    let h = null, l = [], c = 0, u = !1, f = !1;
    function d(x) {
      for (let y = 0; y < Uc(x); y++)
        l.push(new ze(i, "large"));
    }
    function p() {
      l.forEach((x) => x.destroy()), l = [], n.releaseAll((x) => x.deactivate()), h == null || h.destroy(), tt.getState().resetGame(), h = new Oc(i), d(1);
    }
    function g(x) {
      const { phase: y, level: _ } = tt.getState(), b = r.snapshot();
      if (y === "menu") {
        b.confirm && !f && p(), f = b.confirm;
        return;
      }
      if (y === "gameover") {
        b.confirm && !f && p(), f = b.confirm;
        return;
      }
      if (b.pause && !u && tt.getState().setPhase(y === "paused" ? "playing" : "paused"), u = b.pause, y === "paused") return;
      const S = Nc(_) * x, v = Vc(_);
      if (h && h.update(b), h && a.update(h.pos.x, h.pos.y, h.rotation, h.thrustOn), o.update(), b.fire && c <= 0 && h) {
        const M = n.acquire();
        M && (M.init(h.pos, h.rotation), c = v);
      }
      c > 0 && (c -= x), n.forEach((M) => M.update()), l.forEach((M) => M.update(S));
      const w = [];
      if (n.forEach((M) => {
        for (const P of l)
          if (!(!M.active || !P.active) && Br(M.pos, M.radius, P.pos, P.radius)) {
            M.deactivate(), tt.getState().addScore(mc[P.size]), w.push(...P.split(i));
            const C = P.size === "large" ? 18 : P.size === "medium" ? 12 : 7;
            o.burst(P.pos, C, Ye), P.destroy();
            break;
          }
      }), l = l.filter((M) => M.active), l.push(...w), h && h.invincible === 0) {
        for (const M of l)
          if (Br(h.pos, 10, M.pos, M.radius)) {
            h.hit(), tt.getState().loseLife(), Wc(s.ticker, i);
            break;
          }
      }
      if (l.length === 0) {
        const M = tt.getState().level + 1;
        tt.getState().nextLevel(), d(M);
      }
    }
    const m = (x) => {
      var y;
      try {
        g(x.deltaTime);
      } catch (_) {
        const b = _ instanceof Error ? _ : new Error(String(_));
        console.error("[AsteroidBlaster] Game loop error:", b), s.ticker.remove(m), (y = e.current) == null || y.call(e, b);
      } finally {
      }
    };
    return s.ticker.add(m), () => {
      var x;
      (x = s.ticker) == null || x.remove(m), h == null || h.destroy(), l.forEach((y) => y.destroy()), n.releaseAll(), r.destroy(), tt.getState().setPhase("menu");
    };
  }, [s]);
}
function qc({ app: s, onError: t }) {
  return jc(s, t), null;
}
function Kc() {
  const t = tt((e) => e.phase) === "menu";
  return /* @__PURE__ */ ct("div", { style: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--ab-mono)",
    backgroundColor: "rgba(10,10,15,0.88)",
    opacity: t ? 1 : 0,
    pointerEvents: "none",
    transition: "opacity 300ms var(--ab-ease-out)",
    zIndex: 2
  }, children: [
    /* @__PURE__ */ G("p", { style: { fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ab-dim)", marginBottom: 16 }, children: "// James Gardener · 2026" }),
    /* @__PURE__ */ G("h1", { style: { fontFamily: "var(--ab-display)", fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ab-text)", margin: "0 0 8px" }, children: "Asteroid Blaster" }),
    /* @__PURE__ */ G("p", { style: { fontSize: 12, color: "var(--ab-dim)", marginBottom: 48 }, children: "PixiJS · TypeScript · React · Object pooling" }),
    /* @__PURE__ */ G("p", { style: { fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ab-accent)", marginBottom: 32 }, children: "Press Enter or Space to play" }),
    /* @__PURE__ */ ct("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontSize: 11, color: "var(--ab-muted)", letterSpacing: "0.06em" }, children: [
      /* @__PURE__ */ G("span", { children: "↑ / W · Thrust" }),
      /* @__PURE__ */ G("span", { children: "← → / A D · Rotate" }),
      /* @__PURE__ */ G("span", { children: "Space · Fire" }),
      /* @__PURE__ */ G("span", { children: "Esc · Pause" })
    ] })
  ] });
}
function Zc() {
  const t = tt((e) => e.phase) === "paused";
  return /* @__PURE__ */ ct("div", { style: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--ab-mono)",
    backgroundColor: "rgba(10,10,15,0.6)",
    backdropFilter: "blur(4px)",
    opacity: t ? 1 : 0,
    pointerEvents: "none",
    transition: "opacity 200ms var(--ab-ease-out)",
    zIndex: 2
  }, children: [
    /* @__PURE__ */ G("p", { style: { fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ab-dim)", marginBottom: 12 }, children: "// Paused" }),
    /* @__PURE__ */ G("p", { style: { fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ab-accent)" }, children: "Press Esc to resume" })
  ] });
}
function Qc() {
  const { phase: s, score: t, hiScore: e } = tt();
  return /* @__PURE__ */ ct("div", { style: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--ab-mono)",
    color: "var(--ab-text)",
    backgroundColor: "rgba(10,10,15,0.88)",
    opacity: s === "gameover" ? 1 : 0,
    pointerEvents: "none",
    transition: "opacity 400ms var(--ab-ease-out)",
    zIndex: 2
  }, children: [
    /* @__PURE__ */ G("p", { style: { fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ab-dim)", marginBottom: 16 }, children: "// Game over" }),
    /* @__PURE__ */ G("p", { style: { fontFamily: "var(--ab-display)", fontSize: 64, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ab-text)", margin: "0 0 8px", fontVariantNumeric: "tabular-nums" }, children: String(t).padStart(6, "0") }),
    t > 0 && t >= e && /* @__PURE__ */ G("p", { style: { fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ab-accent)", marginBottom: 8 }, children: "// New high score" }),
    /* @__PURE__ */ ct("p", { style: { fontSize: 12, color: "var(--ab-dim)", marginBottom: 40 }, children: [
      "Best · ",
      String(e).padStart(6, "0")
    ] }),
    /* @__PURE__ */ G("p", { style: { fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ab-accent)" }, children: "Press Enter or Space to play again" })
  ] });
}
function su({ onClose: s, onError: t }) {
  const [e, i] = ci(null), [r, n] = ci(null);
  $s(() => {
    const h = document.createElement("style");
    return h.textContent = ho, document.head.appendChild(h), () => {
      h.remove();
    };
  }, []);
  const o = ui((h) => {
    i(h);
  }, []), a = ui((h) => {
    n(h), t == null || t(h);
  }, [t]);
  return r ? /* @__PURE__ */ ct(
    "div",
    {
      className: "ab-root",
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px"
      },
      children: [
        /* @__PURE__ */ G(
          "p",
          {
            style: {
              color: "var(--ab-dim)",
              fontFamily: "var(--ab-mono)",
              fontSize: 13,
              margin: 0
            },
            children: "Game failed to load"
          }
        ),
        /* @__PURE__ */ G(
          "button",
          {
            onClick: s,
            "aria-label": "Close game",
            style: {
              background: "none",
              border: "1px solid var(--ab-muted)",
              borderRadius: 4,
              padding: "4px 10px",
              color: "var(--ab-dim)",
              fontFamily: "var(--ab-mono)",
              fontSize: 10,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer"
            },
            children: "Close"
          }
        )
      ]
    }
  ) : /* @__PURE__ */ ct("div", { className: "ab-root", children: [
    /* @__PURE__ */ G(wc, { onAppReady: o, onError: a }),
    e && /* @__PURE__ */ G(qc, { app: e, onError: a }),
    /* @__PURE__ */ G(Dc, {}),
    /* @__PURE__ */ G(Kc, {}),
    /* @__PURE__ */ G(Zc, {}),
    /* @__PURE__ */ G(Qc, {}),
    /* @__PURE__ */ G(
      "button",
      {
        onClick: s,
        "aria-label": "Close game",
        style: {
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          background: "none",
          border: "1px solid var(--ab-muted)",
          borderRadius: 4,
          padding: "4px 10px",
          color: "var(--ab-dim)",
          fontFamily: "var(--ab-mono)",
          fontSize: 10,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "border-color 150ms, color 150ms"
        },
        onMouseEnter: (h) => {
          h.currentTarget.style.borderColor = "var(--ab-accent)", h.currentTarget.style.color = "var(--ab-text)";
        },
        onMouseLeave: (h) => {
          h.currentTarget.style.borderColor = "var(--ab-muted)", h.currentTarget.style.color = "var(--ab-dim)";
        },
        children: "Esc ×"
      }
    )
  ] });
}
export {
  rl as $,
  Gn as A,
  fe as B,
  rt as C,
  _t as D,
  mt as E,
  ge as F,
  Ue as G,
  Le as H,
  Do as I,
  yt as J,
  mh as K,
  He as L,
  k as M,
  Vi as N,
  qs as O,
  j as P,
  kn as Q,
  Rs as R,
  Ks as S,
  Jr as T,
  Sn as U,
  at as V,
  Xh as W,
  jh as X,
  el as Y,
  Qh as Z,
  vo as _,
  Mn as a,
  Z as a0,
  Wr as a1,
  Ai as a2,
  he as a3,
  Jo as a4,
  Pi as a5,
  es as a6,
  Ei as a7,
  ea as a8,
  Nr as a9,
  Y as aa,
  Kr as ab,
  hc as ac,
  Bn as ad,
  B as ae,
  H as af,
  rh as ag,
  Ja as ah,
  vh as ai,
  Wh as aj,
  qh as ak,
  sl as al,
  tl as am,
  il as an,
  su as ao,
  Ve as b,
  _n as c,
  Ca as d,
  yh as e,
  K as f,
  D as g,
  V as h,
  ot as i,
  I as j,
  Fe as k,
  L as l,
  Ph as m,
  fi as n,
  X as o,
  Be as p,
  qr as q,
  pt as r,
  $e as s,
  ul as t,
  Fa as u,
  bl as v,
  J as w,
  Zl as x,
  hn as y,
  zt as z
};
