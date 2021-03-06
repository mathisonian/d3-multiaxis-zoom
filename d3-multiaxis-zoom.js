(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.d3_multiaxis_zoom = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var d3_multiaxis_zoom = require('./src');
 
// export as a Node module, an AMD module or a global browser variable
if (typeof module !== 'undefined') {
    module.exports = d3_multiaxis_zoom;
 
} else if (typeof define === 'function' && define.amd) {
    define(function() {
        return d3_multiaxis_zoom;
    });
 
} else {
    window.d3_multiaxis_zoom = d3_multiaxis_zoom;
}

},{"./src":2}],2:[function(require,module,exports){


var Plugin = function(d3) {
  
function d3_class(ctor, properties) {
  for (var key in properties) {
    Object.defineProperty(ctor.prototype, key, {
      value: properties[key],
      enumerable: false
    });
  }
}

d3.map = function(object, f) {
  var map = new d3_Map();
  if (object instanceof d3_Map) {
    object.forEach(function(key, value) {
      map.set(key, value);
    });
  } else if (Array.isArray(object)) {
    var i = -1, n = object.length, o;
    if (arguments.length === 1) while (++i < n) map.set(i, object[i]); else while (++i < n) map.set(f.call(object, o = object[i], i), o);
  } else {
    for (var key in object) map.set(key, object[key]);
  }
  return map;
};

function d3_Map() {
  this._ = Object.create(null);
}

var d3_map_proto = "__proto__", d3_map_zero = "\x00";

d3_class(d3_Map, {
  has: d3_map_has,
  get: function(key) {
    return this._[d3_map_escape(key)];
  },
  set: function(key, value) {
    return this._[d3_map_escape(key)] = value;
  },
  remove: d3_map_remove,
  keys: d3_map_keys,
  values: function() {
    var values = [];
    for (var key in this._) values.push(this._[key]);
    return values;
  },
  entries: function() {
    var entries = [];
    for (var key in this._) entries.push({
      key: d3_map_unescape(key),
      value: this._[key]
    });
    return entries;
  },
  size: d3_map_size,
  empty: d3_map_empty,
  forEach: function(f) {
    for (var key in this._) f.call(this, d3_map_unescape(key), this._[key]);
  }
});

function d3_map_escape(key) {
  return (key += "") === d3_map_proto || key[0] === d3_map_zero ? d3_map_zero + key : key;
}

function d3_map_unescape(key) {
  return (key += "")[0] === d3_map_zero ? key.slice(1) : key;
}

function d3_map_has(key) {
  return d3_map_escape(key) in this._;
}

function d3_map_remove(key) {
  return (key = d3_map_escape(key)) in this._ && delete this._[key];
}

function d3_map_keys() {
  var keys = [];
  for (var key in this._) keys.push(d3_map_unescape(key));
  return keys;
}

function d3_map_size() {
  var size = 0;
  for (var key in this._) ++size;
  return size;
}

function d3_map_empty() {
  for (var key in this._) return false;
  return true;
}

d3.dispatch = function() {
  var dispatch = new d3_dispatch(), i = -1, n = arguments.length;
  while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
  return dispatch;
};

function d3_dispatch() {}

d3_dispatch.prototype.on = function(type, listener) {
  var i = type.indexOf("."), name = "";
  if (i >= 0) {
    name = type.slice(i + 1);
    type = type.slice(0, i);
  }
  if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);
  if (arguments.length === 2) {
    if (listener == null) for (type in this) {
      if (this.hasOwnProperty(type)) this[type].on(name, null);
    }
    return this;
  }
};

function d3_dispatch_event(dispatch) {
  var listeners = [], listenerByName = new d3_Map();
  function event() {
    var z = listeners, i = -1, n = z.length, l;
    while (++i < n) if (l = z[i].on) l.apply(this, arguments);
    return dispatch;
  }
  event.on = function(name, listener) {
    var l = listenerByName.get(name), i;
    if (arguments.length < 2) return l && l.on;
    if (l) {
      l.on = null;
      listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
      listenerByName.remove(name);
    }
    if (listener) listeners.push(listenerByName.set(name, {
      on: listener
    }));
    return dispatch;
  };
  return event;
}

d3.event = null;

function d3_eventPreventDefault() {
  d3.event.preventDefault();
}

function d3_eventSource() {
  var e = d3.event, s;
  while (s = e.sourceEvent) e = s;
  return e;
}

function d3_eventDispatch(target) {
  var dispatch = new d3_dispatch(), i = 0, n = arguments.length;
  while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
  dispatch.of = function(thiz, argumentz) {
    return function(e1) {
      try {
        var e0 = e1.sourceEvent = d3.event;
        e1.target = target;
        d3.event = e1;
        dispatch[e1.type].apply(thiz, argumentz);
      } finally {
        d3.event = e0;
      }
    };
  };
  return dispatch;
}

var d3_arraySlice = [].slice, d3_array = function(list) {
  return d3_arraySlice.call(list);
};

var d3_document = document, d3_documentElement = d3_document.documentElement, d3_window = window;

try {
  d3_array(d3_documentElement.childNodes)[0].nodeType;
} catch (e) {
  d3_array = function(list) {
    var i = list.length, array = new Array(i);
    while (i--) array[i] = list[i];
    return array;
  };
}

d3.mouse = function(container) {
  return d3_mousePoint(container, d3_eventSource());
};

var d3_mouse_bug44083 = /WebKit/.test(d3_window.navigator.userAgent) ? -1 : 0;

function d3_mousePoint(container, e) {
  if (e.changedTouches) e = e.changedTouches[0];
  var svg = container.ownerSVGElement || container;
  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    if (d3_mouse_bug44083 < 0 && (d3_window.scrollX || d3_window.scrollY)) {
      svg = d3.select("body").append("svg").style({
        position: "absolute",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        border: "none"
      }, "important");
      var ctm = svg[0][0].getScreenCTM();
      d3_mouse_bug44083 = !(ctm.f || ctm.e);
      svg.remove();
    }
    if (d3_mouse_bug44083) point.x = e.pageX, point.y = e.pageY; else point.x = e.clientX, 
    point.y = e.clientY;
    point = point.matrixTransform(container.getScreenCTM().inverse());
    return [ point.x, point.y ];
  }
  var rect = container.getBoundingClientRect();
  return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];
}

d3.touch = function(container, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = d3_eventSource().changedTouches;
  if (touches) for (var i = 0, n = touches.length, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return d3_mousePoint(container, touch);
    }
  }
};

d3.touches = function(container, touches) {
  if (arguments.length < 2) touches = d3_eventSource().touches;
  return touches ? d3_array(touches).map(function(touch) {
    var point = d3_mousePoint(container, touch);
    point.identifier = touch.identifier;
    return point;
  }) : [];
};

function d3_vendorSymbol(object, name) {
  if (name in object) return name;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
    var prefixName = d3_vendorPrefixes[i] + name;
    if (prefixName in object) return prefixName;
  }
}

var d3_vendorPrefixes = [ "webkit", "ms", "moz", "Moz", "o", "O" ];

var d3_timer_queueHead, d3_timer_queueTail, d3_timer_interval, d3_timer_timeout, d3_timer_active, d3_timer_frame = d3_window[d3_vendorSymbol(d3_window, "requestAnimationFrame")] || function(callback) {
  setTimeout(callback, 17);
};

d3.timer = function(callback, delay, then) {
  var n = arguments.length;
  if (n < 2) delay = 0;
  if (n < 3) then = Date.now();
  var time = then + delay, timer = {
    c: callback,
    t: time,
    f: false,
    n: null
  };
  if (d3_timer_queueTail) d3_timer_queueTail.n = timer; else d3_timer_queueHead = timer;
  d3_timer_queueTail = timer;
  if (!d3_timer_interval) {
    d3_timer_timeout = clearTimeout(d3_timer_timeout);
    d3_timer_interval = 1;
    d3_timer_frame(d3_timer_step);
  }
};

function d3_timer_step() {
  var now = d3_timer_mark(), delay = d3_timer_sweep() - now;
  if (delay > 24) {
    if (isFinite(delay)) {
      clearTimeout(d3_timer_timeout);
      d3_timer_timeout = setTimeout(d3_timer_step, delay);
    }
    d3_timer_interval = 0;
  } else {
    d3_timer_interval = 1;
    d3_timer_frame(d3_timer_step);
  }
}

d3.timer.flush = function() {
  d3_timer_mark();
  d3_timer_sweep();
};

function d3_timer_mark() {
  var now = Date.now();
  d3_timer_active = d3_timer_queueHead;
  while (d3_timer_active) {
    if (now >= d3_timer_active.t) d3_timer_active.f = d3_timer_active.c(now - d3_timer_active.t);
    d3_timer_active = d3_timer_active.n;
  }
  return now;
}

function d3_timer_sweep() {
  var t0, t1 = d3_timer_queueHead, time = Infinity;
  while (t1) {
    if (t1.f) {
      t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n;
    } else {
      if (t1.t < time) time = t1.t;
      t1 = (t0 = t1).n;
    }
  }
  d3_timer_queueTail = t0;
  return time;
}

var d3_subclass = {}.__proto__ ? function(object, prototype) {
  object.__proto__ = prototype;
} : function(object, prototype) {
  for (var property in prototype) object[property] = prototype[property];
};

function d3_selection(groups) {
  d3_subclass(groups, d3_selectionPrototype);
  return groups;
}

var d3_select = function(s, n) {
  return n.querySelector(s);
}, d3_selectAll = function(s, n) {
  return n.querySelectorAll(s);
}, d3_selectMatcher = d3_documentElement.matches || d3_documentElement[d3_vendorSymbol(d3_documentElement, "matchesSelector")], d3_selectMatches = function(n, s) {
  return d3_selectMatcher.call(n, s);
};

if (typeof Sizzle === "function") {
  d3_select = function(s, n) {
    return Sizzle(s, n)[0] || null;
  };
  d3_selectAll = Sizzle;
  d3_selectMatches = Sizzle.matchesSelector;
}

d3.selection = function() {
  return d3_selectionRoot;
};

var d3_selectionPrototype = d3.selection.prototype = [];

d3_selectionPrototype.select = function(selector) {
  var subgroups = [], subgroup, subnode, group, node;
  selector = d3_selection_selector(selector);
  for (var j = -1, m = this.length; ++j < m; ) {
    subgroups.push(subgroup = []);
    subgroup.parentNode = (group = this[j]).parentNode;
    for (var i = -1, n = group.length; ++i < n; ) {
      if (node = group[i]) {
        subgroup.push(subnode = selector.call(node, node.__data__, i, j));
        if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
      } else {
        subgroup.push(null);
      }
    }
  }
  return d3_selection(subgroups);
};

function d3_selection_selector(selector) {
  return typeof selector === "function" ? selector : function() {
    return d3_select(selector, this);
  };
}

d3_selectionPrototype.selectAll = function(selector) {
  var subgroups = [], subgroup, node;
  selector = d3_selection_selectorAll(selector);
  for (var j = -1, m = this.length; ++j < m; ) {
    for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
      if (node = group[i]) {
        subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
        subgroup.parentNode = node;
      }
    }
  }
  return d3_selection(subgroups);
};

function d3_selection_selectorAll(selector) {
  return typeof selector === "function" ? selector : function() {
    return d3_selectAll(selector, this);
  };
}

var d3_nsPrefix = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: "http://www.w3.org/1999/xhtml",
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

d3.ns = {
  prefix: d3_nsPrefix,
  qualify: function(name) {
    var i = name.indexOf(":"), prefix = name;
    if (i >= 0) {
      prefix = name.slice(0, i);
      name = name.slice(i + 1);
    }
    return d3_nsPrefix.hasOwnProperty(prefix) ? {
      space: d3_nsPrefix[prefix],
      local: name
    } : name;
  }
};

d3_selectionPrototype.attr = function(name, value) {
  if (arguments.length < 2) {
    if (typeof name === "string") {
      var node = this.node();
      name = d3.ns.qualify(name);
      return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);
    }
    for (value in name) this.each(d3_selection_attr(value, name[value]));
    return this;
  }
  return this.each(d3_selection_attr(name, value));
};

function d3_selection_attr(name, value) {
  name = d3.ns.qualify(name);
  function attrNull() {
    this.removeAttribute(name);
  }
  function attrNullNS() {
    this.removeAttributeNS(name.space, name.local);
  }
  function attrConstant() {
    this.setAttribute(name, value);
  }
  function attrConstantNS() {
    this.setAttributeNS(name.space, name.local, value);
  }
  function attrFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttribute(name); else this.setAttribute(name, x);
  }
  function attrFunctionNS() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x);
  }
  return value == null ? name.local ? attrNullNS : attrNull : typeof value === "function" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;
}

function d3_collapse(s) {
  return s.trim().replace(/\s+/g, " ");
}

d3.requote = function(s) {
  return s.replace(d3_requote_re, "\\$&");
};

var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

d3_selectionPrototype.classed = function(name, value) {
  if (arguments.length < 2) {
    if (typeof name === "string") {
      var node = this.node(), n = (name = d3_selection_classes(name)).length, i = -1;
      if (value = node.classList) {
        while (++i < n) if (!value.contains(name[i])) return false;
      } else {
        value = node.getAttribute("class");
        while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
      }
      return true;
    }
    for (value in name) this.each(d3_selection_classed(value, name[value]));
    return this;
  }
  return this.each(d3_selection_classed(name, value));
};

function d3_selection_classedRe(name) {
  return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
}

function d3_selection_classes(name) {
  return (name + "").trim().split(/^|\s+/);
}

function d3_selection_classed(name, value) {
  name = d3_selection_classes(name).map(d3_selection_classedName);
  var n = name.length;
  function classedConstant() {
    var i = -1;
    while (++i < n) name[i](this, value);
  }
  function classedFunction() {
    var i = -1, x = value.apply(this, arguments);
    while (++i < n) name[i](this, x);
  }
  return typeof value === "function" ? classedFunction : classedConstant;
}

function d3_selection_classedName(name) {
  var re = d3_selection_classedRe(name);
  return function(node, value) {
    if (c = node.classList) return value ? c.add(name) : c.remove(name);
    var c = node.getAttribute("class") || "";
    if (value) {
      re.lastIndex = 0;
      if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
    } else {
      node.setAttribute("class", d3_collapse(c.replace(re, " ")));
    }
  };
}

d3_selectionPrototype.style = function(name, value, priority) {
  var n = arguments.length;
  if (n < 3) {
    if (typeof name !== "string") {
      if (n < 2) value = "";
      for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
      return this;
    }
    if (n < 2) return d3_window.getComputedStyle(this.node(), null).getPropertyValue(name);
    priority = "";
  }
  return this.each(d3_selection_style(name, value, priority));
};

function d3_selection_style(name, value, priority) {
  function styleNull() {
    this.style.removeProperty(name);
  }
  function styleConstant() {
    this.style.setProperty(name, value, priority);
  }
  function styleFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority);
  }
  return value == null ? styleNull : typeof value === "function" ? styleFunction : styleConstant;
}

d3_selectionPrototype.property = function(name, value) {
  if (arguments.length < 2) {
    if (typeof name === "string") return this.node()[name];
    for (value in name) this.each(d3_selection_property(value, name[value]));
    return this;
  }
  return this.each(d3_selection_property(name, value));
};

function d3_selection_property(name, value) {
  function propertyNull() {
    delete this[name];
  }
  function propertyConstant() {
    this[name] = value;
  }
  function propertyFunction() {
    var x = value.apply(this, arguments);
    if (x == null) delete this[name]; else this[name] = x;
  }
  return value == null ? propertyNull : typeof value === "function" ? propertyFunction : propertyConstant;
}

d3_selectionPrototype.text = function(value) {
  return arguments.length ? this.each(typeof value === "function" ? function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  } : value == null ? function() {
    this.textContent = "";
  } : function() {
    this.textContent = value;
  }) : this.node().textContent;
};

d3_selectionPrototype.html = function(value) {
  return arguments.length ? this.each(typeof value === "function" ? function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  } : value == null ? function() {
    this.innerHTML = "";
  } : function() {
    this.innerHTML = value;
  }) : this.node().innerHTML;
};

d3_selectionPrototype.append = function(name) {
  name = d3_selection_creator(name);
  return this.select(function() {
    return this.appendChild(name.apply(this, arguments));
  });
};

function d3_selection_creator(name) {
  return typeof name === "function" ? name : (name = d3.ns.qualify(name)).local ? function() {
    return this.ownerDocument.createElementNS(name.space, name.local);
  } : function() {
    return this.ownerDocument.createElementNS(this.namespaceURI, name);
  };
}

d3_selectionPrototype.insert = function(name, before) {
  name = d3_selection_creator(name);
  before = d3_selection_selector(before);
  return this.select(function() {
    return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
  });
};

d3_selectionPrototype.remove = function() {
  return this.each(d3_selectionRemove);
};

function d3_selectionRemove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

d3.set = function(array) {
  var set = new d3_Set();
  if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i]);
  return set;
};

function d3_Set() {
  this._ = Object.create(null);
}

d3_class(d3_Set, {
  has: d3_map_has,
  add: function(key) {
    this._[d3_map_escape(key += "")] = true;
    return key;
  },
  remove: d3_map_remove,
  values: d3_map_keys,
  size: d3_map_size,
  empty: d3_map_empty,
  forEach: function(f) {
    for (var key in this._) f.call(this, d3_map_unescape(key));
  }
});

d3_selectionPrototype.data = function(value, key) {
  var i = -1, n = this.length, group, node;
  if (!arguments.length) {
    value = new Array(n = (group = this[0]).length);
    while (++i < n) {
      if (node = group[i]) {
        value[i] = node.__data__;
      }
    }
    return value;
  }
  function bind(group, groupData) {
    var i, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n), node, nodeData;
    if (key) {
      var nodeByKeyValue = new d3_Map(), keyValues = new Array(n), keyValue;
      for (i = -1; ++i < n; ) {
        if (nodeByKeyValue.has(keyValue = key.call(node = group[i], node.__data__, i))) {
          exitNodes[i] = node;
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
        keyValues[i] = keyValue;
      }
      for (i = -1; ++i < m; ) {
        if (!(node = nodeByKeyValue.get(keyValue = key.call(groupData, nodeData = groupData[i], i)))) {
          enterNodes[i] = d3_selection_dataNode(nodeData);
        } else if (node !== true) {
          updateNodes[i] = node;
          node.__data__ = nodeData;
        }
        nodeByKeyValue.set(keyValue, true);
      }
      for (i = -1; ++i < n; ) {
        if (nodeByKeyValue.get(keyValues[i]) !== true) {
          exitNodes[i] = group[i];
        }
      }
    } else {
      for (i = -1; ++i < n0; ) {
        node = group[i];
        nodeData = groupData[i];
        if (node) {
          node.__data__ = nodeData;
          updateNodes[i] = node;
        } else {
          enterNodes[i] = d3_selection_dataNode(nodeData);
        }
      }
      for (;i < m; ++i) {
        enterNodes[i] = d3_selection_dataNode(groupData[i]);
      }
      for (;i < n; ++i) {
        exitNodes[i] = group[i];
      }
    }
    enterNodes.update = updateNodes;
    enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;
    enter.push(enterNodes);
    update.push(updateNodes);
    exit.push(exitNodes);
  }
  var enter = d3_selection_enter([]), update = d3_selection([]), exit = d3_selection([]);
  if (typeof value === "function") {
    while (++i < n) {
      bind(group = this[i], value.call(group, group.parentNode.__data__, i));
    }
  } else {
    while (++i < n) {
      bind(group = this[i], value);
    }
  }
  update.enter = function() {
    return enter;
  };
  update.exit = function() {
    return exit;
  };
  return update;
};

function d3_selection_dataNode(data) {
  return {
    __data__: data
  };
}

d3_selectionPrototype.datum = function(value) {
  return arguments.length ? this.property("__data__", value) : this.property("__data__");
};

d3_selectionPrototype.filter = function(filter) {
  var subgroups = [], subgroup, group, node;
  if (typeof filter !== "function") filter = d3_selection_filter(filter);
  for (var j = 0, m = this.length; j < m; j++) {
    subgroups.push(subgroup = []);
    subgroup.parentNode = (group = this[j]).parentNode;
    for (var i = 0, n = group.length; i < n; i++) {
      if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
        subgroup.push(node);
      }
    }
  }
  return d3_selection(subgroups);
};

function d3_selection_filter(selector) {
  return function() {
    return d3_selectMatches(this, selector);
  };
}

d3_selectionPrototype.order = function() {
  for (var j = -1, m = this.length; ++j < m; ) {
    for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
      if (node = group[i]) {
        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
};

d3.ascending = d3_ascending;

function d3_ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

d3_selectionPrototype.sort = function(comparator) {
  comparator = d3_selection_sortComparator.apply(this, arguments);
  for (var j = -1, m = this.length; ++j < m; ) this[j].sort(comparator);
  return this.order();
};

function d3_selection_sortComparator(comparator) {
  if (!arguments.length) comparator = d3_ascending;
  return function(a, b) {
    return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
  };
}

function d3_noop() {}

d3_selectionPrototype.on = function(type, listener, capture) {
  var n = arguments.length;
  if (n < 3) {
    if (typeof type !== "string") {
      if (n < 2) listener = false;
      for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
      return this;
    }
    if (n < 2) return (n = this.node()["__on" + type]) && n._;
    capture = false;
  }
  return this.each(d3_selection_on(type, listener, capture));
};

function d3_selection_on(type, listener, capture) {
  var name = "__on" + type, i = type.indexOf("."), wrap = d3_selection_onListener;
  if (i > 0) type = type.slice(0, i);
  var filter = d3_selection_onFilters.get(type);
  if (filter) type = filter, wrap = d3_selection_onFilter;
  function onRemove() {
    var l = this[name];
    if (l) {
      this.removeEventListener(type, l, l.$);
      delete this[name];
    }
  }
  function onAdd() {
    var l = wrap(listener, d3_array(arguments));
    onRemove.call(this);
    this.addEventListener(type, this[name] = l, l.$ = capture);
    l._ = listener;
  }
  function removeAll() {
    var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"), match;
    for (var name in this) {
      if (match = name.match(re)) {
        var l = this[name];
        this.removeEventListener(match[1], l, l.$);
        delete this[name];
      }
    }
  }
  return i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll;
}

var d3_selection_onFilters = d3.map({
  mouseenter: "mouseover",
  mouseleave: "mouseout"
});

d3_selection_onFilters.forEach(function(k) {
  if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
});

function d3_selection_onListener(listener, argumentz) {
  return function(e) {
    var o = d3.event;
    d3.event = e;
    argumentz[0] = this.__data__;
    try {
      listener.apply(this, argumentz);
    } finally {
      d3.event = o;
    }
  };
}

function d3_selection_onFilter(listener, argumentz) {
  var l = d3_selection_onListener(listener, argumentz);
  return function(e) {
    var target = this, related = e.relatedTarget;
    if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {
      l.call(target, e);
    }
  };
}

d3_selectionPrototype.each = function(callback) {
  return d3_selection_each(this, function(node, i, j) {
    callback.call(node, node.__data__, i, j);
  });
};

function d3_selection_each(groups, callback) {
  for (var j = 0, m = groups.length; j < m; j++) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
      if (node = group[i]) callback(node, i, j);
    }
  }
  return groups;
}

d3_selectionPrototype.call = function(callback) {
  var args = d3_array(arguments);
  callback.apply(args[0] = this, args);
  return this;
};

d3_selectionPrototype.empty = function() {
  return !this.node();
};

d3_selectionPrototype.node = function() {
  for (var j = 0, m = this.length; j < m; j++) {
    for (var group = this[j], i = 0, n = group.length; i < n; i++) {
      var node = group[i];
      if (node) return node;
    }
  }
  return null;
};

d3_selectionPrototype.size = function() {
  var n = 0;
  d3_selection_each(this, function() {
    ++n;
  });
  return n;
};

function d3_selection_enter(selection) {
  d3_subclass(selection, d3_selection_enterPrototype);
  return selection;
}

var d3_selection_enterPrototype = [];

d3.selection.enter = d3_selection_enter;

d3.selection.enter.prototype = d3_selection_enterPrototype;

d3_selection_enterPrototype.append = d3_selectionPrototype.append;

d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;

d3_selection_enterPrototype.node = d3_selectionPrototype.node;

d3_selection_enterPrototype.call = d3_selectionPrototype.call;

d3_selection_enterPrototype.size = d3_selectionPrototype.size;

d3_selection_enterPrototype.select = function(selector) {
  var subgroups = [], subgroup, subnode, upgroup, group, node;
  for (var j = -1, m = this.length; ++j < m; ) {
    upgroup = (group = this[j]).update;
    subgroups.push(subgroup = []);
    subgroup.parentNode = group.parentNode;
    for (var i = -1, n = group.length; ++i < n; ) {
      if (node = group[i]) {
        subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
        subnode.__data__ = node.__data__;
      } else {
        subgroup.push(null);
      }
    }
  }
  return d3_selection(subgroups);
};

d3_selection_enterPrototype.insert = function(name, before) {
  if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
  return d3_selectionPrototype.insert.call(this, name, before);
};

function d3_selection_enterInsertBefore(enter) {
  var i0, j0;
  return function(d, i, j) {
    var group = enter[j].update, n = group.length, node;
    if (j != j0) j0 = j, i0 = 0;
    if (i >= i0) i0 = i + 1;
    while (!(node = group[i0]) && ++i0 < n) ;
    return node;
  };
}

d3.select = function(node) {
  var group = [ typeof node === "string" ? d3_select(node, d3_document) : node ];
  group.parentNode = d3_documentElement;
  return d3_selection([ group ]);
};

d3.selectAll = function(nodes) {
  var group = d3_array(typeof nodes === "string" ? d3_selectAll(nodes, d3_document) : nodes);
  group.parentNode = d3_documentElement;
  return d3_selection([ group ]);
};

var d3_selectionRoot = d3.select(d3_documentElement);

function d3_true() {
  return true;
}

d3_selectionPrototype.transition = function(name) {
  var id = d3_transitionInheritId || ++d3_transitionId, ns = d3_transitionNamespace(name), subgroups = [], subgroup, node, transition = d3_transitionInherit || {
    time: Date.now(),
    ease: d3_ease_cubicInOut,
    delay: 0,
    duration: 250
  };
  for (var j = -1, m = this.length; ++j < m; ) {
    subgroups.push(subgroup = []);
    for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
      if (node = group[i]) d3_transitionNode(node, i, ns, id, transition);
      subgroup.push(node);
    }
  }
  return d3_transition(subgroups, ns, id);
};

d3_selectionPrototype.interrupt = function(name) {
  return this.each(name == null ? d3_selection_interrupt : d3_selection_interruptNS(d3_transitionNamespace(name)));
};

var d3_selection_interrupt = d3_selection_interruptNS(d3_transitionNamespace());

function d3_selection_interruptNS(ns) {
  return function() {
    var lock, active;
    if ((lock = this[ns]) && (active = lock[lock.active])) {
      if (--lock.count) delete lock[lock.active]; else delete this[ns];
      lock.active += .5;
      active.event && active.event.interrupt.call(this, this.__data__, active.index);
    }
  };
}

function d3_transition(groups, ns, id) {
  d3_subclass(groups, d3_transitionPrototype);
  groups.namespace = ns;
  groups.id = id;
  return groups;
}

var d3_transitionPrototype = [], d3_transitionId = 0, d3_transitionInheritId, d3_transitionInherit;

d3_transitionPrototype.call = d3_selectionPrototype.call;

d3_transitionPrototype.empty = d3_selectionPrototype.empty;

d3_transitionPrototype.node = d3_selectionPrototype.node;

d3_transitionPrototype.size = d3_selectionPrototype.size;

d3.transition = function(selection, name) {
  return selection && selection.transition ? d3_transitionInheritId ? selection.transition(name) : selection : d3_selectionRoot.transition(selection);
};

d3.transition.prototype = d3_transitionPrototype;

d3_transitionPrototype.select = function(selector) {
  var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnode, node;
  selector = d3_selection_selector(selector);
  for (var j = -1, m = this.length; ++j < m; ) {
    subgroups.push(subgroup = []);
    for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
      if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        d3_transitionNode(subnode, i, ns, id, node[ns][id]);
        subgroup.push(subnode);
      } else {
        subgroup.push(null);
      }
    }
  }
  return d3_transition(subgroups, ns, id);
};

d3_transitionPrototype.selectAll = function(selector) {
  var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnodes, node, subnode, transition;
  selector = d3_selection_selectorAll(selector);
  for (var j = -1, m = this.length; ++j < m; ) {
    for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
      if (node = group[i]) {
        transition = node[ns][id];
        subnodes = selector.call(node, node.__data__, i, j);
        subgroups.push(subgroup = []);
        for (var k = -1, o = subnodes.length; ++k < o; ) {
          if (subnode = subnodes[k]) d3_transitionNode(subnode, k, ns, id, transition);
          subgroup.push(subnode);
        }
      }
    }
  }
  return d3_transition(subgroups, ns, id);
};

d3_transitionPrototype.filter = function(filter) {
  var subgroups = [], subgroup, group, node;
  if (typeof filter !== "function") filter = d3_selection_filter(filter);
  for (var j = 0, m = this.length; j < m; j++) {
    subgroups.push(subgroup = []);
    for (var group = this[j], i = 0, n = group.length; i < n; i++) {
      if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
        subgroup.push(node);
      }
    }
  }
  return d3_transition(subgroups, this.namespace, this.id);
};

d3.color = d3_color;

function d3_color() {}

d3_color.prototype.toString = function() {
  return this.rgb() + "";
};

d3.hsl = d3_hsl;

function d3_hsl(h, s, l) {
  return this instanceof d3_hsl ? void (this.h = +h, this.s = +s, this.l = +l) : arguments.length < 2 ? h instanceof d3_hsl ? new d3_hsl(h.h, h.s, h.l) : d3_rgb_parse("" + h, d3_rgb_hsl, d3_hsl) : new d3_hsl(h, s, l);
}

var d3_hslPrototype = d3_hsl.prototype = new d3_color();

d3_hslPrototype.brighter = function(k) {
  k = Math.pow(.7, arguments.length ? k : 1);
  return new d3_hsl(this.h, this.s, this.l / k);
};

d3_hslPrototype.darker = function(k) {
  k = Math.pow(.7, arguments.length ? k : 1);
  return new d3_hsl(this.h, this.s, k * this.l);
};

d3_hslPrototype.rgb = function() {
  return d3_hsl_rgb(this.h, this.s, this.l);
};

function d3_hsl_rgb(h, s, l) {
  var m1, m2;
  h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
  s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
  l = l < 0 ? 0 : l > 1 ? 1 : l;
  m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
  m1 = 2 * l - m2;
  function v(h) {
    if (h > 360) h -= 360; else if (h < 0) h += 360;
    if (h < 60) return m1 + (m2 - m1) * h / 60;
    if (h < 180) return m2;
    if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
    return m1;
  }
  function vv(h) {
    return Math.round(v(h) * 255);
  }
  return new d3_rgb(vv(h + 120), vv(h), vv(h - 120));
}

var ε = 1e-6, ε2 = ε * ε, π = Math.PI, τ = 2 * π, τε = τ - ε, halfπ = π / 2, d3_radians = π / 180, d3_degrees = 180 / π;

function d3_sgn(x) {
  return x > 0 ? 1 : x < 0 ? -1 : 0;
}

function d3_cross2d(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

function d3_acos(x) {
  return x > 1 ? 0 : x < -1 ? π : Math.acos(x);
}

function d3_asin(x) {
  return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);
}

function d3_sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}

function d3_cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}

function d3_tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}

function d3_haversin(x) {
  return (x = Math.sin(x / 2)) * x;
}

d3.hcl = d3_hcl;

function d3_hcl(h, c, l) {
  return this instanceof d3_hcl ? void (this.h = +h, this.c = +c, this.l = +l) : arguments.length < 2 ? h instanceof d3_hcl ? new d3_hcl(h.h, h.c, h.l) : h instanceof d3_lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : new d3_hcl(h, c, l);
}

var d3_hclPrototype = d3_hcl.prototype = new d3_color();

d3_hclPrototype.brighter = function(k) {
  return new d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)));
};

d3_hclPrototype.darker = function(k) {
  return new d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)));
};

d3_hclPrototype.rgb = function() {
  return d3_hcl_lab(this.h, this.c, this.l).rgb();
};

function d3_hcl_lab(h, c, l) {
  if (isNaN(h)) h = 0;
  if (isNaN(c)) c = 0;
  return new d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c);
}

d3.lab = d3_lab;

function d3_lab(l, a, b) {
  return this instanceof d3_lab ? void (this.l = +l, this.a = +a, this.b = +b) : arguments.length < 2 ? l instanceof d3_lab ? new d3_lab(l.l, l.a, l.b) : l instanceof d3_hcl ? d3_hcl_lab(l.h, l.c, l.l) : d3_rgb_lab((l = d3_rgb(l)).r, l.g, l.b) : new d3_lab(l, a, b);
}

var d3_lab_K = 18;

var d3_lab_X = .95047, d3_lab_Y = 1, d3_lab_Z = 1.08883;

var d3_labPrototype = d3_lab.prototype = new d3_color();

d3_labPrototype.brighter = function(k) {
  return new d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
};

d3_labPrototype.darker = function(k) {
  return new d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
};

d3_labPrototype.rgb = function() {
  return d3_lab_rgb(this.l, this.a, this.b);
};

function d3_lab_rgb(l, a, b) {
  var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200;
  x = d3_lab_xyz(x) * d3_lab_X;
  y = d3_lab_xyz(y) * d3_lab_Y;
  z = d3_lab_xyz(z) * d3_lab_Z;
  return new d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));
}

function d3_lab_hcl(l, a, b) {
  return l > 0 ? new d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : new d3_hcl(NaN, NaN, l);
}

function d3_lab_xyz(x) {
  return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;
}

function d3_xyz_lab(x) {
  return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;
}

function d3_xyz_rgb(r) {
  return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));
}

d3.rgb = d3_rgb;

function d3_rgb(r, g, b) {
  return this instanceof d3_rgb ? void (this.r = ~~r, this.g = ~~g, this.b = ~~b) : arguments.length < 2 ? r instanceof d3_rgb ? new d3_rgb(r.r, r.g, r.b) : d3_rgb_parse("" + r, d3_rgb, d3_hsl_rgb) : new d3_rgb(r, g, b);
}

function d3_rgbNumber(value) {
  return new d3_rgb(value >> 16, value >> 8 & 255, value & 255);
}

function d3_rgbString(value) {
  return d3_rgbNumber(value) + "";
}

var d3_rgbPrototype = d3_rgb.prototype = new d3_color();

d3_rgbPrototype.brighter = function(k) {
  k = Math.pow(.7, arguments.length ? k : 1);
  var r = this.r, g = this.g, b = this.b, i = 30;
  if (!r && !g && !b) return new d3_rgb(i, i, i);
  if (r && r < i) r = i;
  if (g && g < i) g = i;
  if (b && b < i) b = i;
  return new d3_rgb(Math.min(255, r / k), Math.min(255, g / k), Math.min(255, b / k));
};

d3_rgbPrototype.darker = function(k) {
  k = Math.pow(.7, arguments.length ? k : 1);
  return new d3_rgb(k * this.r, k * this.g, k * this.b);
};

d3_rgbPrototype.hsl = function() {
  return d3_rgb_hsl(this.r, this.g, this.b);
};

d3_rgbPrototype.toString = function() {
  return "#" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);
};

function d3_rgb_hex(v) {
  return v < 16 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
}

function d3_rgb_parse(format, rgb, hsl) {
  var r = 0, g = 0, b = 0, m1, m2, color;
  m1 = /([a-z]+)\((.*)\)/i.exec(format);
  if (m1) {
    m2 = m1[2].split(",");
    switch (m1[1]) {
     case "hsl":
      {
        return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
      }

     case "rgb":
      {
        return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]));
      }
    }
  }
  if (color = d3_rgb_names.get(format)) return rgb(color.r, color.g, color.b);
  if (format != null && format.charAt(0) === "#" && !isNaN(color = parseInt(format.slice(1), 16))) {
    if (format.length === 4) {
      r = (color & 3840) >> 4;
      r = r >> 4 | r;
      g = color & 240;
      g = g >> 4 | g;
      b = color & 15;
      b = b << 4 | b;
    } else if (format.length === 7) {
      r = (color & 16711680) >> 16;
      g = (color & 65280) >> 8;
      b = color & 255;
    }
  }
  return rgb(r, g, b);
}

function d3_rgb_hsl(r, g, b) {
  var min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, h, s, l = (max + min) / 2;
  if (d) {
    s = l < .5 ? d / (max + min) : d / (2 - max - min);
    if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;
    h *= 60;
  } else {
    h = NaN;
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new d3_hsl(h, s, l);
}

function d3_rgb_lab(r, g, b) {
  r = d3_rgb_xyz(r);
  g = d3_rgb_xyz(g);
  b = d3_rgb_xyz(b);
  var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X), y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y), z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);
  return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));
}

function d3_rgb_xyz(r) {
  return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);
}

function d3_rgb_parseNumber(c) {
  var f = parseFloat(c);
  return c.charAt(c.length - 1) === "%" ? Math.round(f * 2.55) : f;
}

var d3_rgb_names = d3.map({
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
});

d3_rgb_names.forEach(function(key, value) {
  d3_rgb_names.set(key, d3_rgbNumber(value));
});

d3.interpolateRgb = d3_interpolateRgb;

function d3_interpolateRgb(a, b) {
  a = d3.rgb(a);
  b = d3.rgb(b);
  var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab;
  return function(t) {
    return "#" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t));
  };
}

d3.interpolateObject = d3_interpolateObject;

function d3_interpolateObject(a, b) {
  var i = {}, c = {}, k;
  for (k in a) {
    if (k in b) {
      i[k] = d3_interpolate(a[k], b[k]);
    } else {
      c[k] = a[k];
    }
  }
  for (k in b) {
    if (!(k in a)) {
      c[k] = b[k];
    }
  }
  return function(t) {
    for (k in i) c[k] = i[k](t);
    return c;
  };
}

d3.interpolateArray = d3_interpolateArray;

function d3_interpolateArray(a, b) {
  var x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length), i;
  for (i = 0; i < n0; ++i) x.push(d3_interpolate(a[i], b[i]));
  for (;i < na; ++i) c[i] = a[i];
  for (;i < nb; ++i) c[i] = b[i];
  return function(t) {
    for (i = 0; i < n0; ++i) c[i] = x[i](t);
    return c;
  };
}

d3.interpolateNumber = d3_interpolateNumber;

function d3_interpolateNumber(a, b) {
  a = +a, b = +b;
  return function(t) {
    return a * (1 - t) + b * t;
  };
}

d3.interpolateString = d3_interpolateString;

function d3_interpolateString(a, b) {
  var bi = d3_interpolate_numberA.lastIndex = d3_interpolate_numberB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
  a = a + "", b = b + "";
  while ((am = d3_interpolate_numberA.exec(a)) && (bm = d3_interpolate_numberB.exec(b))) {
    if ((bs = bm.index) > bi) {
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      if (s[i]) s[i] += bm; else s[++i] = bm;
    } else {
      s[++i] = null;
      q.push({
        i: i,
        x: d3_interpolateNumber(am, bm)
      });
    }
    bi = d3_interpolate_numberB.lastIndex;
  }
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; else s[++i] = bs;
  }
  return s.length < 2 ? q[0] ? (b = q[0].x, function(t) {
    return b(t) + "";
  }) : function() {
    return b;
  } : (b = q.length, function(t) {
    for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
    return s.join("");
  });
}

var d3_interpolate_numberA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, d3_interpolate_numberB = new RegExp(d3_interpolate_numberA.source, "g");

d3.interpolate = d3_interpolate;

function d3_interpolate(a, b) {
  var i = d3.interpolators.length, f;
  while (--i >= 0 && !(f = d3.interpolators[i](a, b))) ;
  return f;
}

d3.interpolators = [ function(a, b) {
  var t = typeof b;
  return (t === "string" ? d3_rgb_names.has(b) || /^(#|rgb\(|hsl\()/.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_color ? d3_interpolateRgb : Array.isArray(b) ? d3_interpolateArray : t === "object" && isNaN(b) ? d3_interpolateObject : d3_interpolateNumber)(a, b);
} ];

d3.transform = function(string) {
  var g = d3_document.createElementNS(d3.ns.prefix.svg, "g");
  return (d3.transform = function(string) {
    if (string != null) {
      g.setAttribute("transform", string);
      var t = g.transform.baseVal.consolidate();
    }
    return new d3_transform(t ? t.matrix : d3_transformIdentity);
  })(string);
};

function d3_transform(m) {
  var r0 = [ m.a, m.b ], r1 = [ m.c, m.d ], kx = d3_transformNormalize(r0), kz = d3_transformDot(r0, r1), ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0;
  if (r0[0] * r1[1] < r1[0] * r0[1]) {
    r0[0] *= -1;
    r0[1] *= -1;
    kx *= -1;
    kz *= -1;
  }
  this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees;
  this.translate = [ m.e, m.f ];
  this.scale = [ kx, ky ];
  this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0;
}

d3_transform.prototype.toString = function() {
  return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")";
};

function d3_transformDot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}

function d3_transformNormalize(a) {
  var k = Math.sqrt(d3_transformDot(a, a));
  if (k) {
    a[0] /= k;
    a[1] /= k;
  }
  return k;
}

function d3_transformCombine(a, b, k) {
  a[0] += k * b[0];
  a[1] += k * b[1];
  return a;
}

var d3_transformIdentity = {
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  e: 0,
  f: 0
};

d3.interpolateTransform = d3_interpolateTransform;

function d3_interpolateTransform(a, b) {
  var s = [], q = [], n, A = d3.transform(a), B = d3.transform(b), ta = A.translate, tb = B.translate, ra = A.rotate, rb = B.rotate, wa = A.skew, wb = B.skew, ka = A.scale, kb = B.scale;
  if (ta[0] != tb[0] || ta[1] != tb[1]) {
    s.push("translate(", null, ",", null, ")");
    q.push({
      i: 1,
      x: d3_interpolateNumber(ta[0], tb[0])
    }, {
      i: 3,
      x: d3_interpolateNumber(ta[1], tb[1])
    });
  } else if (tb[0] || tb[1]) {
    s.push("translate(" + tb + ")");
  } else {
    s.push("");
  }
  if (ra != rb) {
    if (ra - rb > 180) rb += 360; else if (rb - ra > 180) ra += 360;
    q.push({
      i: s.push(s.pop() + "rotate(", null, ")") - 2,
      x: d3_interpolateNumber(ra, rb)
    });
  } else if (rb) {
    s.push(s.pop() + "rotate(" + rb + ")");
  }
  if (wa != wb) {
    q.push({
      i: s.push(s.pop() + "skewX(", null, ")") - 2,
      x: d3_interpolateNumber(wa, wb)
    });
  } else if (wb) {
    s.push(s.pop() + "skewX(" + wb + ")");
  }
  if (ka[0] != kb[0] || ka[1] != kb[1]) {
    n = s.push(s.pop() + "scale(", null, ",", null, ")");
    q.push({
      i: n - 4,
      x: d3_interpolateNumber(ka[0], kb[0])
    }, {
      i: n - 2,
      x: d3_interpolateNumber(ka[1], kb[1])
    });
  } else if (kb[0] != 1 || kb[1] != 1) {
    s.push(s.pop() + "scale(" + kb + ")");
  }
  n = q.length;
  return function(t) {
    var i = -1, o;
    while (++i < n) s[(o = q[i]).i] = o.x(t);
    return s.join("");
  };
}

d3_transitionPrototype.tween = function(name, tween) {
  var id = this.id, ns = this.namespace;
  if (arguments.length < 2) return this.node()[ns][id].tween.get(name);
  return d3_selection_each(this, tween == null ? function(node) {
    node[ns][id].tween.remove(name);
  } : function(node) {
    node[ns][id].tween.set(name, tween);
  });
};

function d3_transition_tween(groups, name, value, tween) {
  var id = groups.id, ns = groups.namespace;
  return d3_selection_each(groups, typeof value === "function" ? function(node, i, j) {
    node[ns][id].tween.set(name, tween(value.call(node, node.__data__, i, j)));
  } : (value = tween(value), function(node) {
    node[ns][id].tween.set(name, value);
  }));
}

d3_transitionPrototype.attr = function(nameNS, value) {
  if (arguments.length < 2) {
    for (value in nameNS) this.attr(value, nameNS[value]);
    return this;
  }
  var interpolate = nameNS == "transform" ? d3_interpolateTransform : d3_interpolate, name = d3.ns.qualify(nameNS);
  function attrNull() {
    this.removeAttribute(name);
  }
  function attrNullNS() {
    this.removeAttributeNS(name.space, name.local);
  }
  function attrTween(b) {
    return b == null ? attrNull : (b += "", function() {
      var a = this.getAttribute(name), i;
      return a !== b && (i = interpolate(a, b), function(t) {
        this.setAttribute(name, i(t));
      });
    });
  }
  function attrTweenNS(b) {
    return b == null ? attrNullNS : (b += "", function() {
      var a = this.getAttributeNS(name.space, name.local), i;
      return a !== b && (i = interpolate(a, b), function(t) {
        this.setAttributeNS(name.space, name.local, i(t));
      });
    });
  }
  return d3_transition_tween(this, "attr." + nameNS, value, name.local ? attrTweenNS : attrTween);
};

d3_transitionPrototype.attrTween = function(nameNS, tween) {
  var name = d3.ns.qualify(nameNS);
  function attrTween(d, i) {
    var f = tween.call(this, d, i, this.getAttribute(name));
    return f && function(t) {
      this.setAttribute(name, f(t));
    };
  }
  function attrTweenNS(d, i) {
    var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local));
    return f && function(t) {
      this.setAttributeNS(name.space, name.local, f(t));
    };
  }
  return this.tween("attr." + nameNS, name.local ? attrTweenNS : attrTween);
};

d3_transitionPrototype.style = function(name, value, priority) {
  var n = arguments.length;
  if (n < 3) {
    if (typeof name !== "string") {
      if (n < 2) value = "";
      for (priority in name) this.style(priority, name[priority], value);
      return this;
    }
    priority = "";
  }
  function styleNull() {
    this.style.removeProperty(name);
  }
  function styleString(b) {
    return b == null ? styleNull : (b += "", function() {
      var a = d3_window.getComputedStyle(this, null).getPropertyValue(name), i;
      return a !== b && (i = d3_interpolate(a, b), function(t) {
        this.style.setProperty(name, i(t), priority);
      });
    });
  }
  return d3_transition_tween(this, "style." + name, value, styleString);
};

d3_transitionPrototype.styleTween = function(name, tween, priority) {
  if (arguments.length < 3) priority = "";
  function styleTween(d, i) {
    var f = tween.call(this, d, i, d3_window.getComputedStyle(this, null).getPropertyValue(name));
    return f && function(t) {
      this.style.setProperty(name, f(t), priority);
    };
  }
  return this.tween("style." + name, styleTween);
};

d3_transitionPrototype.text = function(value) {
  return d3_transition_tween(this, "text", value, d3_transition_text);
};

function d3_transition_text(b) {
  if (b == null) b = "";
  return function() {
    this.textContent = b;
  };
}

d3_transitionPrototype.remove = function() {
  var ns = this.namespace;
  return this.each("end.transition", function() {
    var p;
    if (this[ns].count < 2 && (p = this.parentNode)) p.removeChild(this);
  });
};

function d3_identity(d) {
  return d;
}

var d3_ease_default = function() {
  return d3_identity;
};

var d3_ease = d3.map({
  linear: d3_ease_default,
  poly: d3_ease_poly,
  quad: function() {
    return d3_ease_quad;
  },
  cubic: function() {
    return d3_ease_cubic;
  },
  sin: function() {
    return d3_ease_sin;
  },
  exp: function() {
    return d3_ease_exp;
  },
  circle: function() {
    return d3_ease_circle;
  },
  elastic: d3_ease_elastic,
  back: d3_ease_back,
  bounce: function() {
    return d3_ease_bounce;
  }
});

var d3_ease_mode = d3.map({
  "in": d3_identity,
  out: d3_ease_reverse,
  "in-out": d3_ease_reflect,
  "out-in": function(f) {
    return d3_ease_reflect(d3_ease_reverse(f));
  }
});

d3.ease = function(name) {
  var i = name.indexOf("-"), t = i >= 0 ? name.slice(0, i) : name, m = i >= 0 ? name.slice(i + 1) : "in";
  t = d3_ease.get(t) || d3_ease_default;
  m = d3_ease_mode.get(m) || d3_identity;
  return d3_ease_clamp(m(t.apply(null, d3_arraySlice.call(arguments, 1))));
};

function d3_ease_clamp(f) {
  return function(t) {
    return t <= 0 ? 0 : t >= 1 ? 1 : f(t);
  };
}

function d3_ease_reverse(f) {
  return function(t) {
    return 1 - f(1 - t);
  };
}

function d3_ease_reflect(f) {
  return function(t) {
    return .5 * (t < .5 ? f(2 * t) : 2 - f(2 - 2 * t));
  };
}

function d3_ease_quad(t) {
  return t * t;
}

function d3_ease_cubic(t) {
  return t * t * t;
}

function d3_ease_cubicInOut(t) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  var t2 = t * t, t3 = t2 * t;
  return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);
}

function d3_ease_poly(e) {
  return function(t) {
    return Math.pow(t, e);
  };
}

function d3_ease_sin(t) {
  return 1 - Math.cos(t * halfπ);
}

function d3_ease_exp(t) {
  return Math.pow(2, 10 * (t - 1));
}

function d3_ease_circle(t) {
  return 1 - Math.sqrt(1 - t * t);
}

function d3_ease_elastic(a, p) {
  var s;
  if (arguments.length < 2) p = .45;
  if (arguments.length) s = p / τ * Math.asin(1 / a); else a = 1, s = p / 4;
  return function(t) {
    return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * τ / p);
  };
}

function d3_ease_back(s) {
  if (!s) s = 1.70158;
  return function(t) {
    return t * t * ((s + 1) * t - s);
  };
}

function d3_ease_bounce(t) {
  return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
}

d3_transitionPrototype.ease = function(value) {
  var id = this.id, ns = this.namespace;
  if (arguments.length < 1) return this.node()[ns][id].ease;
  if (typeof value !== "function") value = d3.ease.apply(d3, arguments);
  return d3_selection_each(this, function(node) {
    node[ns][id].ease = value;
  });
};

d3_transitionPrototype.delay = function(value) {
  var id = this.id, ns = this.namespace;
  if (arguments.length < 1) return this.node()[ns][id].delay;
  return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
    node[ns][id].delay = +value.call(node, node.__data__, i, j);
  } : (value = +value, function(node) {
    node[ns][id].delay = value;
  }));
};

d3_transitionPrototype.duration = function(value) {
  var id = this.id, ns = this.namespace;
  if (arguments.length < 1) return this.node()[ns][id].duration;
  return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
    node[ns][id].duration = Math.max(1, value.call(node, node.__data__, i, j));
  } : (value = Math.max(1, value), function(node) {
    node[ns][id].duration = value;
  }));
};

d3_transitionPrototype.each = function(type, listener) {
  var id = this.id, ns = this.namespace;
  if (arguments.length < 2) {
    var inherit = d3_transitionInherit, inheritId = d3_transitionInheritId;
    try {
      d3_transitionInheritId = id;
      d3_selection_each(this, function(node, i, j) {
        d3_transitionInherit = node[ns][id];
        type.call(node, node.__data__, i, j);
      });
    } finally {
      d3_transitionInherit = inherit;
      d3_transitionInheritId = inheritId;
    }
  } else {
    d3_selection_each(this, function(node) {
      var transition = node[ns][id];
      (transition.event || (transition.event = d3.dispatch("start", "end", "interrupt"))).on(type, listener);
    });
  }
  return this;
};

d3_transitionPrototype.transition = function() {
  var id0 = this.id, id1 = ++d3_transitionId, ns = this.namespace, subgroups = [], subgroup, group, node, transition;
  for (var j = 0, m = this.length; j < m; j++) {
    subgroups.push(subgroup = []);
    for (var group = this[j], i = 0, n = group.length; i < n; i++) {
      if (node = group[i]) {
        transition = node[ns][id0];
        d3_transitionNode(node, i, ns, id1, {
          time: transition.time,
          ease: transition.ease,
          delay: transition.delay + transition.duration,
          duration: transition.duration
        });
      }
      subgroup.push(node);
    }
  }
  return d3_transition(subgroups, ns, id1);
};

function d3_transitionNamespace(name) {
  return name == null ? "__transition__" : "__transition_" + name + "__";
}

function d3_transitionNode(node, i, ns, id, inherit) {
  var lock = node[ns] || (node[ns] = {
    active: 0,
    count: 0
  }), transition = lock[id];
  if (!transition) {
    var time = inherit.time;
    transition = lock[id] = {
      tween: new d3_Map(),
      time: time,
      delay: inherit.delay,
      duration: inherit.duration,
      ease: inherit.ease,
      index: i
    };
    inherit = null;
    ++lock.count;
    d3.timer(function(elapsed) {
      var delay = transition.delay, duration, ease, timer = d3_timer_active, tweened = [];
      timer.t = delay + time;
      if (delay <= elapsed) return start(elapsed - delay);
      timer.c = start;
      function start(elapsed) {
        if (lock.active > id) return stop();
        var active = lock[lock.active];
        if (active) {
          --lock.count;
          delete lock[lock.active];
          active.event && active.event.interrupt.call(node, node.__data__, active.index);
        }
        lock.active = id;
        transition.event && transition.event.start.call(node, node.__data__, i);
        transition.tween.forEach(function(key, value) {
          if (value = value.call(node, node.__data__, i)) {
            tweened.push(value);
          }
        });
        ease = transition.ease;
        duration = transition.duration;
        d3.timer(function() {
          timer.c = tick(elapsed || 1) ? d3_true : tick;
          return 1;
        }, 0, time);
      }
      function tick(elapsed) {
        if (lock.active !== id) return 1;
        var t = elapsed / duration, e = ease(t), n = tweened.length;
        while (n > 0) {
          tweened[--n].call(node, e);
        }
        if (t >= 1) {
          transition.event && transition.event.end.call(node, node.__data__, i);
          return stop();
        }
      }
      function stop() {
        if (--lock.count) delete lock[id]; else delete node[ns];
        return 1;
      }
    }, 0, time);
  }
}

d3.rebind = function(target, source) {
  var i = 1, n = arguments.length, method;
  while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
  return target;
};

function d3_rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments);
    return value === source ? target : value;
  };
}

var d3_event_dragSelect = "onselectstart" in d3_document ? null : d3_vendorSymbol(d3_documentElement.style, "userSelect"), d3_event_dragId = 0;

function d3_event_dragSuppress() {
  var name = ".dragsuppress-" + ++d3_event_dragId, click = "click" + name, w = d3.select(d3_window).on("touchmove" + name, d3_eventPreventDefault).on("dragstart" + name, d3_eventPreventDefault).on("selectstart" + name, d3_eventPreventDefault);
  if (d3_event_dragSelect) {
    var style = d3_documentElement.style, select = style[d3_event_dragSelect];
    style[d3_event_dragSelect] = "none";
  }
  return function(suppressClick) {
    w.on(name, null);
    if (d3_event_dragSelect) style[d3_event_dragSelect] = select;
    if (suppressClick) {
      var off = function() {
        w.on(click, null);
      };
      w.on(click, function() {
        d3_eventPreventDefault();
        off();
      }, true);
      setTimeout(off, 0);
    }
  };
}

var ρ = Math.SQRT2, ρ2 = 2, ρ4 = 4;

d3.interpolateZoom = function(p0, p1) {
  var ux0 = p0[0], uy0 = p0[1], wx0 = p0[2], wy0 = p0[3], ux1 = p1[0], uy1 = p1[1], wx1 = p1[2], wy1 = p1[3];
  var dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, d1 = Math.sqrt(d2), bx0 = (wx1 * wx1 - wx0 * wx0 + ρ4 * d2) / (2 * wx0 * ρ2 * d1), by0 = (wy1 * wy1 - wy0 * wy0 + ρ4 * d2) / (2 * wy0 * ρ2 * d1), bx1 = (wx1 * wx1 - wx0 * wx0 - ρ4 * d2) / (2 * wx1 * ρ2 * d1), by1 = (wy1 * wy1 - wy0 * wy0 - ρ4 * d2) / (2 * wy1 * ρ2 * d1), rx0 = Math.log(Math.sqrt(bx0 * bx0 + 1) - bx0), ry0 = Math.log(Math.sqrt(by0 * by0 + 1) - by0), rx1 = Math.log(Math.sqrt(bx1 * bx1 + 1) - bx1), ry1 = Math.log(Math.sqrt(by1 * by1 + 1) - by1), drx = rx1 - rx0, dry = ry1 - ry0, Sx = (drx || Math.log(wx1 / wx0)) / ρ, Sy = (dry || Math.log(wy1 / wy0)) / ρ;
  function interpolate(t) {
    var sx = t * Sx;
    var sy = t * Sy;
    if (drx || dry) {
      var coshrx0 = d3_cosh(rx0), coshry0 = d3_cosh(ry0), ux = wx0 / (ρ2 * d1) * (coshrx0 * d3_tanh(ρ * sx + rx0) - d3_sinh(rx0)), uy = wy0 / (ρ2 * d1) * (coshry0 * d3_tanh(ρ * sy + ry0) - d3_sinh(ry0));
      return [ ux0 + ux * dx, uy0 + uy * dy, wx0 * coshrx0 / d3_cosh(ρ * sx + rx0), wy0 * coshry0 / d3_cosh(ρ * sy + ry0) ];
    }
    return [ ux0 + t * dx, uy0 + t * dy, wx0 * Math.exp(ρ * sx), wy0 * Math.exp(ρ * sy) ];
  }
  interpolate.duration = (Sx * 1e3 + Sy * 1e3) / 2;
  return interpolate;
};

d3.behavior.zoom = function() {
  var view = {
    x: 0,
    y: 0,
    kx: 1,
    ky: 1
  }, translate0, center0, center, size = [ 960, 500 ], scaleExtent = d3_behavior_zoomInfinity, duration = 250, zooming = 0, mousedown = "mousedown.zoom", mousemove = "mousemove.zoom", mouseup = "mouseup.zoom", mousewheelTimer, touchstart = "touchstart.zoom", touchtime, event = d3_eventDispatch(zoom, "zoomstart", "zoom", "zoomend"), x0, x1, y0, y1;
  function zoom(g) {
    g.on(mousedown, mousedowned).on(d3_behavior_zoomWheel + ".zoom", mousewheeled).on("dblclick.zoom", dblclicked).on(touchstart, touchstarted);
  }
  zoom.event = function(g) {
    g.each(function() {
      var dispatch = event.of(this, arguments), view1 = view;
      if (d3_transitionInheritId) {
        d3.select(this).transition().each("start.zoom", function() {
          view = this.__chart__ || {
            x: 0,
            y: 0,
            kx: 1,
            ky: 1
          };
          zoomstarted(dispatch);
        }).tween("zoom:zoom", function() {
          var dx = size[0], dy = size[1], cx = center0 ? center0[0] : dx / 2, cy = center0 ? center0[1] : dy / 2, i = d3.interpolateZoom([ (cx - view.x) / view.kx, (cy - view.y) / view.ky, dx / view.kx, dy / view.ky ], [ (cx - view1.x) / view1.kx, (cy - view1.y) / view1.ky, dx / view1.kx, dy / view1.ky ]);
          return function(t) {
            var l = i(t), kx = dx / l[2], ky = dy / l[3];
            this.__chart__ = view = {
              x: cx - l[0] * kx,
              y: cy - l[1] * ky,
              kx: kx,
              ky: ky
            };
            zoomed(dispatch);
          };
        }).each("interrupt.zoom", function() {
          zoomended(dispatch);
        }).each("end.zoom", function() {
          zoomended(dispatch);
        });
      } else {
        this.__chart__ = view;
        zoomstarted(dispatch);
        zoomed(dispatch);
        zoomended(dispatch);
      }
    });
  };
  zoom.translate = function(_) {
    if (!arguments.length) return [ view.x, view.y ];
    view = {
      x: +_[0],
      y: +_[1],
      kx: view.kx,
      ky: view.ky
    };
    rescale();
    return zoom;
  };
  zoom.scale = function(_kx, _ky) {
    if (!arguments.length) return view.k;
    _ky = _ky == null ? _kx : _ky;
    view = {
      x: view.x,
      y: view.y,
      kx: +_kx,
      ky: +_ky
    };
    rescale();
    return zoom;
  };
  zoom.scaleExtent = function(_) {
    if (!arguments.length) return scaleExtent;
    scaleExtent = _ == null ? d3_behavior_zoomInfinity : [ +_[0], +_[1] ];
    return zoom;
  };
  zoom.center = function(_) {
    if (!arguments.length) return center;
    center = _ && [ +_[0], +_[1] ];
    return zoom;
  };
  zoom.size = function(_) {
    if (!arguments.length) return size;
    size = _ && [ +_[0], +_[1] ];
    return zoom;
  };
  zoom.duration = function(_) {
    if (!arguments.length) return duration;
    duration = +_;
    return zoom;
  };
  zoom.x = function(z) {
    if (!arguments.length) return x1;
    x1 = z;
    x0 = z.copy();
    view = {
      x: 0,
      y: view.y,
      kx: 1,
      ky: view.ky
    };
    return zoom;
  };
  zoom.y = function(z) {
    if (!arguments.length) return y1;
    y1 = z;
    y0 = z.copy();
    view = {
      x: view.x,
      y: 0,
      kx: view.kx,
      ky: 1
    };
    return zoom;
  };
  function location(p) {
    return [ (p[0] - view.x) / view.kx, (p[1] - view.y) / view.ky ];
  }
  function point(l) {
    return [ l[0] * view.kx + view.x, l[1] * view.ky + view.y ];
  }
  function scaleTo(sx, sy) {
    sy = sy == null ? sx : sy;
    view.kx = Math.max(scaleExtent[0], Math.min(scaleExtent[1], sx));
    view.ky = Math.max(scaleExtent[0], Math.min(scaleExtent[1], sy));
  }
  function translateTo(p, l) {
    l = point(l);
    if (d3.event.altKey) {
      view.x += p[0] - l[0];
    } else if (d3.event.metaKey) {
      view.y += p[1] - l[1];
    } else {
      view.x += p[0] - l[0];
      view.y += p[1] - l[1];
    }

  }
  function zoomTo(that, p, l, kx, ky) {
    ky = ky == null ? kx : ky;
    that.__chart__ = {
      x: view.x,
      y: view.y,
      kx: view.kx,
      ky: view.ky
    };
    scaleTo(Math.pow(2, kx), Math.pow(2, ky));
    translateTo(center0 = p, l);
    that = d3.select(that);
    if (duration > 0) that = that.transition().duration(duration);
    that.call(zoom.event);
  }
  function rescale() {
    if (x1) x1.domain(x0.range().map(function(x) {
      return (x - view.x) / view.kx;
    }).map(x0.invert));
    if (y1) y1.domain(y0.range().map(function(y) {
      return (y - view.y) / view.ky;
    }).map(y0.invert));
  }
  function zoomstarted(dispatch) {
    if (!zooming++) dispatch({
      type: "zoomstart"
    });
  }
  function zoomed(dispatch) {
    rescale();
    dispatch({
      type: "zoom",
      scaleX: view.kx,
      scaleY: view.ky,
      translate: [ view.x, view.y ]
    });
  }
  function zoomended(dispatch) {
    if (!--zooming) dispatch({
      type: "zoomend"
    });
    center0 = null;
  }
  function mousedowned() {
    var that = this, target = d3.event.target, dispatch = event.of(that, arguments), dragged = 0, subject = d3.select(d3_window).on(mousemove, moved).on(mouseup, ended), location0 = location(d3.mouse(that)), dragRestore = d3_event_dragSuppress();
    d3_selection_interrupt.call(that);
    zoomstarted(dispatch);
    function moved() {
      dragged = 1;
      translateTo(d3.mouse(that), location0);
      zoomed(dispatch);
    }
    function ended() {
      subject.on(mousemove, null).on(mouseup, null);
      dragRestore(dragged && d3.event.target === target);
      zoomended(dispatch);
    }
  }
  function touchstarted() {
    var that = this, dispatch = event.of(that, arguments), locations0 = {}, distance0 = 0, scale0, zoomName = ".zoom-" + d3.event.changedTouches[0].identifier, touchmove = "touchmove" + zoomName, touchend = "touchend" + zoomName, targets = [], subject = d3.select(that), dragRestore = d3_event_dragSuppress();
    started();
    zoomstarted(dispatch);
    subject.on(mousedown, null).on(touchstart, started);
    function relocate() {
      var touches = d3.touches(that);
      scale0 = view.kx;
      touches.forEach(function(t) {
        if (t.identifier in locations0) locations0[t.identifier] = location(t);
      });
      return touches;
    }
    function started() {
      var target = d3.event.target;
      d3.select(target).on(touchmove, moved).on(touchend, ended);
      targets.push(target);
      var changed = d3.event.changedTouches;
      for (var i = 0, n = changed.length; i < n; ++i) {
        locations0[changed[i].identifier] = null;
      }
      var touches = relocate(), now = Date.now();
      if (touches.length === 1) {
        if (now - touchtime < 500) {
          var p = touches[0];
          zoomTo(that, p, locations0[p.identifier], Math.floor(Math.log(view.kx) / Math.LN2) + 1);
          d3_eventPreventDefault();
        }
        touchtime = now;
      } else if (touches.length > 1) {
        var p = touches[0], q = touches[1], dx = p[0] - q[0], dy = p[1] - q[1];
        distance0 = dx * dx + dy * dy;
      }
    }
    function moved() {
      var touches = d3.touches(that), p0, l0, p1, l1;
      d3_selection_interrupt.call(that);
      for (var i = 0, n = touches.length; i < n; ++i, l1 = null) {
        p1 = touches[i];
        if (l1 = locations0[p1.identifier]) {
          if (l0) break;
          p0 = p1, l0 = l1;
        }
      }
      if (l1) {
        var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1, scale1 = distance0 && Math.sqrt(distance1 / distance0);
        p0 = [ (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 ];
        l0 = [ (l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2 ];
        scaleTo(scale1);
      }
      touchtime = null;
      translateTo(p0, l0);

      zoomed(dispatch);
    }
    function ended() {
      if (d3.event.touches.length) {
        var changed = d3.event.changedTouches;
        for (var i = 0, n = changed.length; i < n; ++i) {
          delete locations0[changed[i].identifier];
        }
        for (var identifier in locations0) {
          return void relocate();
        }
      }
      d3.selectAll(targets).on(zoomName, null);
      subject.on(mousedown, mousedowned).on(touchstart, touchstarted);
      dragRestore();
      zoomended(dispatch);
    }
  }
  function mousewheeled() {
    var dispatch = event.of(this, arguments);
    if (mousewheelTimer) clearTimeout(mousewheelTimer); else translate0 = location(center0 = center || d3.mouse(this)), 
    d3_selection_interrupt.call(this), zoomstarted(dispatch);
    mousewheelTimer = setTimeout(function() {
      mousewheelTimer = null;
      zoomended(dispatch);
    }, 50);
    d3_eventPreventDefault();
    if (d3.event.altKey) {
      scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * view.kx, view.ky);
    } else if (d3.event.metaKey) {
      scaleTo(view.kx, Math.pow(2, d3_behavior_zoomDelta() * .002) * view.ky);
    } else {
      scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * view.kx, Math.pow(2, d3_behavior_zoomDelta() * .002) * view.ky);
    }
    translateTo(center0, translate0);
    zoomed(dispatch);
  }
  function dblclicked() {
    var p = d3.mouse(this), kx = Math.log(view.kx) / Math.LN2, ky = Math.log(view.ky) / Math.LN2;
    if (d3.event.altKey) {
      zoomTo(this, p, location(p), d3.event.shiftKey ? Math.ceil(kx) - 1 : Math.floor(ky) + 1, ky);
    } else if (d3.event.metaKey) {
      zoomTo(this, p, location(p), kx, d3.event.shiftKey ? Math.ceil(ky) - 1 : Math.floor(ky) + 1);
    } else {
      zoomTo(this, p, location(p), d3.event.shiftKey ? Math.ceil(kx) - 1 : Math.floor(ky) + 1, d3.event.shiftKey ? Math.ceil(ky) - 1 : Math.floor(ky) + 1);
    }
  }
  return d3.rebind(zoom, event, "on");
};

var d3_behavior_zoomInfinity = [ 0, Infinity ];

var d3_behavior_zoomDelta, d3_behavior_zoomWheel = "onwheel" in d3_document ? (d3_behavior_zoomDelta = function() {
  return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1);
}, "wheel") : "onmousewheel" in d3_document ? (d3_behavior_zoomDelta = function() {
  return d3.event.wheelDelta;
}, "mousewheel") : (d3_behavior_zoomDelta = function() {
  return -d3.event.detail;
}, "MozMousePixelScroll");
}

module.exports = Plugin;
},{}]},{},[1])(1)
});