(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
var interpolateZoom = require('./interpolateZoom');


var Plugin = function(d3) {

  d3.behavior.zoom = function() {
    var view = {x: 0, y: 0, kx: 1, ky: 1},
        translate0, // translate when we started zooming (to avoid drift)
        center0, // implicit desired position of translate0 after zooming
        center, // explicit desired position of translate0 after zooming
        size = [960, 500], // viewport size; required for zoom interpolation
        scaleExtent = d3_behavior_zoomInfinity,
        duration = 250,
        zooming = 0,
        mousedown = "mousedown.zoom",
        mousemove = "mousemove.zoom",
        mouseup = "mouseup.zoom",
        mousewheelTimer,
        touchstart = "touchstart.zoom",
        touchtime, // time of last touchstart (to detect double-tap)
        event = d3_eventDispatch(zoom, "zoomstart", "zoom", "zoomend"),
        x0,
        x1,
        y0,
        y1;

    function zoom(g) {
      g   .on(mousedown, mousedowned)
          .on(d3_behavior_zoomWheel + ".zoom", mousewheeled)
          .on("dblclick.zoom", dblclicked)
          .on(touchstart, touchstarted);
    }

    zoom.event = function(g) {
      g.each(function() {
        var dispatch = event.of(this, arguments),
            view1 = view;
        if (d3_transitionInheritId) {
          d3.select(this).transition()
              .each("start.zoom", function() {
                view = this.__chart__ || {x: 0, y: 0, kx: 1, ky: 1}; // pre-transition state
                zoomstarted(dispatch);
              })
              .tween("zoom:zoom", function() {

                console.log('zoom:zoom');
                console.log('dx: ' + dx);
                console.log('dy: ' + dy);
                var dx = size[0],
                    dy = size[1],
                    cx = center0 ? center0[0] : dx / 2,
                    cy = center0 ? center0[1] : dy / 2,
                    i = interpolateZoom(
                      [(cx - view.x) / view.kx, (cy - view.y) / view.ky, dx / view.kx, dy / view.ky],
                      [(cx - view1.x) / view1.kx, (cy - view1.y) / view1.ky, dx / view1.kx, dy / view1.ky]
                    );
                return function(t) {
                  var l = i(t), kx = dx / l[2], ky = dy / l[3];
                  this.__chart__ = view = {x: cx - l[0] * kx, y: cy - l[1] * ky, kx: kx, ky: ky};
                  zoomed(dispatch);
                };
              })
              .each("interrupt.zoom", function() {
                zoomended(dispatch);
              })
              .each("end.zoom", function() {
                zoomended(dispatch);
              });
        } else {
          this.__chart__ = view;
          zoomstarted(dispatch);
          zoomed(dispatch);
          zoomended(dispatch);
        }
      });
    }

    zoom.translate = function(_) {
      if (!arguments.length) return [view.x, view.y];
      view = {x: +_[0], y: +_[1], kx: view.kx, ky: view.ky}; // copy-on-write
      rescale();
      return zoom;
    };

    zoom.scale = function(_kx, _ky) {
      if (!arguments.length) return view.k;
      _ky = _ky == null ? _kx : _ky;
      view = {x: view.x, y: view.y, kx: +_kx, ky: +_ky}; // copy-on-write
      rescale();
      return zoom;
    };

    zoom.scaleExtent = function(_) {
      if (!arguments.length) return scaleExtent;
      scaleExtent = _ == null ? d3_behavior_zoomInfinity : [+_[0], +_[1]];
      return zoom;
    };

    zoom.center = function(_) {
      if (!arguments.length) return center;
      center = _ && [+_[0], +_[1]];
      return zoom;
    };

    zoom.size = function(_) {
      if (!arguments.length) return size;
      size = _ && [+_[0], +_[1]];
      return zoom;
    };

    zoom.duration = function(_) {
      if (!arguments.length) return duration;
      duration = +_; // TODO function based on interpolateZoom distance?
      return zoom;
    };

    zoom.x = function(z) {
      if (!arguments.length) return x1;
      x1 = z;
      x0 = z.copy();
      view = {x: 0, y: view.y, kx: 1, ky: view.ky}; // copy-on-write
      return zoom;
    };

    zoom.y = function(z) {
      if (!arguments.length) return y1;
      y1 = z;
      y0 = z.copy();
      view = {x: view.x, y: 0, kx: view.kx, ky: 1}; // copy-on-write
      return zoom;
    };

    function location(p) {
      return [(p[0] - view.x) / view.kx, (p[1] - view.y) / view.ky];
    }

    function point(l) {
      return [l[0] * view.kx + view.x, l[1] * view.ky + view.y];
    }

    function scaleTo(sx, sy) {
      console.log('scaling to ' + [sx, sy]);
      sy = sy == null ? sx : sy;
      view.kx = Math.max(scaleExtent[0], Math.min(scaleExtent[1], sx));
      view.ky = Math.max(scaleExtent[0], Math.min(scaleExtent[1], sy));
    }

    function translateTo(p, l) {
      l = point(l);
      view.x += p[0] - l[0];
      view.y += p[1] - l[1];
    }

    function zoomTo(that, p, l, kx, ky) {
      ky = ky == null ? kx : ky;
      that.__chart__ = {x: view.x, y: view.y, kx: view.kx, ky: view.ky};

      scaleTo(Math.pow(2, kx), Math.pow(2, ky));
      translateTo(center0 = p, l);

      that = d3.select(that);
      if (duration > 0) that = that.transition().duration(duration);
      that.call(zoom.event);
    }

    function rescale() {
      if (x1) x1.domain(x0.range().map(function(x) { return (x - view.x) / view.kx; }).map(x0.invert));
      if (y1) y1.domain(y0.range().map(function(y) { return (y - view.y) / view.ky; }).map(y0.invert));
    }

    function zoomstarted(dispatch) {
      if (!zooming++) dispatch({type: "zoomstart"});
    }

    function zoomed(dispatch) {
      rescale();
      console.log({type: "zoom", scaleX: view.kx, scaleY: view.ky, translate: [view.x, view.y]});
      dispatch({type: "zoom", scaleX: view.kx, scaleY: view.ky, translate: [view.x, view.y]});
    }

    function zoomended(dispatch) {
      if (!--zooming) dispatch({type: "zoomend"});
      center0 = null;
    }

    function mousedowned() {
      var that = this,
          target = d3.event.target,
          dispatch = event.of(that, arguments),
          dragged = 0,
          subject = d3.select(d3_window).on(mousemove, moved).on(mouseup, ended),
          location0 = location(d3.mouse(that)),
          dragRestore = d3_event_dragSuppress();

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

    // These closures persist for as long as at least one touch is active.
    function touchstarted() {
      var that = this,
          dispatch = event.of(that, arguments),
          locations0 = {}, // touchstart locations
          distance0 = 0, // distance² between initial touches
          scale0, // scale when we started touching
          zoomName = ".zoom-" + d3.event.changedTouches[0].identifier,
          touchmove = "touchmove" + zoomName,
          touchend = "touchend" + zoomName,
          targets = [],
          subject = d3.select(that),
          dragRestore = d3_event_dragSuppress();

      started();
      zoomstarted(dispatch);

      // Workaround for Chrome issue 412723: the touchstart listener must be set
      // after the touchmove listener.
      subject.on(mousedown, null).on(touchstart, started); // prevent duplicate events

      // Updates locations of any touches in locations0.
      function relocate() {
        var touches = d3.touches(that);
        scale0 = view.kx;
        touches.forEach(function(t) {
          if (t.identifier in locations0) locations0[t.identifier] = location(t);
        });
        return touches;
      }

      // Temporarily override touchstart while gesture is active.
      function started() {

        // Listen for touchmove and touchend on the target of touchstart.
        var target = d3.event.target;
        d3.select(target).on(touchmove, moved).on(touchend, ended);
        targets.push(target);

        // Only track touches started on the same subject element.
        var changed = d3.event.changedTouches;
        for (var i = 0, n = changed.length; i < n; ++i) {
          locations0[changed[i].identifier] = null;
        }

        var touches = relocate(),
            now = Date.now();

        if (touches.length === 1) {
          if (now - touchtime < 500) { // dbltap
            var p = touches[0];
            zoomTo(that, p, locations0[p.identifier], Math.floor(Math.log(view.kx) / Math.LN2) + 1);
            d3_eventPreventDefault();
          }
          touchtime = now;
        } else if (touches.length > 1) {
          var p = touches[0], q = touches[1],
              dx = p[0] - q[0], dy = p[1] - q[1];
          distance0 = dx * dx + dy * dy;
        }
      }

      function moved() {
        var touches = d3.touches(that),
            p0, l0,
            p1, l1;

        d3_selection_interrupt.call(that);

        for (var i = 0, n = touches.length; i < n; ++i, l1 = null) {
          p1 = touches[i];
          if (l1 = locations0[p1.identifier]) {
            if (l0) break;
            p0 = p1, l0 = l1;
          }
        }

        if (l1) {
          var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1,
              scale1 = distance0 && Math.sqrt(distance1 / distance0);
          p0 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
          l0 = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
          scaleTo(scale1);
        }

        touchtime = null;
        translateTo(p0, l0);
        zoomed(dispatch);
      }

      function ended() {
        // If there are any globally-active touches remaining, remove the ended
        // touches from locations0.
        if (d3.event.touches.length) {
          var changed = d3.event.changedTouches;
          for (var i = 0, n = changed.length; i < n; ++i) {
            delete locations0[changed[i].identifier];
          }
          // If locations0 is not empty, then relocate and continue listening for
          // touchmove and touchend.
          for (var identifier in locations0) {
            return void relocate(); // locations may have detached due to rotation
          }
        }
        // Otherwise, remove touchmove and touchend listeners.
        d3.selectAll(targets).on(zoomName, null);
        subject.on(mousedown, mousedowned).on(touchstart, touchstarted);
        dragRestore();
        zoomended(dispatch);
      }
    }

    function mousewheeled() {
      var dispatch = event.of(this, arguments);
      if (mousewheelTimer) clearTimeout(mousewheelTimer);
      else translate0 = location(center0 = center || d3.mouse(this)), d3_selection_interrupt.call(this), zoomstarted(dispatch);
      mousewheelTimer = setTimeout(function() { mousewheelTimer = null; zoomended(dispatch); }, 50);
      d3_eventPreventDefault();

      if(d3.event.altKey) {
        scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * view.kx, view.ky);
      } else if (d3.event.ctrlKey) {
        scaleTo(view.kx, Math.pow(2, d3_behavior_zoomDelta() * .002) * view.ky);
      } else {
        scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * view.kx, Math.pow(2, d3_behavior_zoomDelta() * .002) * view.ky);
      }
      translateTo(center0, translate0);
      zoomed(dispatch);
    }

    function dblclicked() {
      var p = d3.mouse(this),
          kx = Math.log(view.kx) / Math.LN2,
          ky = Math.log(view.ky) / Math.LN2;


      if(d3.event.altKey) {
        zoomTo(this, p, location(p), d3.event.shiftKey ? Math.ceil(kx) - 1 : Math.floor(ky) + 1, ky);
      } else if (d3.event.ctrlKey) {
        scaleTo(kx, Math.pow(2, d3_behavior_zoomDelta() * .002) * view.ky);
        zoomTo(this, p, location(p), kx, d3.event.shiftKey ? Math.ceil(ky) - 1 : Math.floor(ky) + 1);
      } else {
        zoomTo(this, p, location(p), d3.event.shiftKey ? Math.ceil(kx) - 1 : Math.floor(ky) + 1, d3.event.shiftKey ? Math.ceil(ky) - 1 : Math.floor(ky) + 1);
      }
    }

    return d3.rebind(zoom, event, "on");
  };

  var d3_behavior_zoomInfinity = [0, Infinity]; // default scale extent

  // https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/wheel
  var d3_behavior_zoomDelta, d3_behavior_zoomWheel
      = "onwheel" in d3_document ? (d3_behavior_zoomDelta = function() { return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1); }, "wheel")
      : "onmousewheel" in d3_document ? (d3_behavior_zoomDelta = function() { return d3.event.wheelDelta; }, "mousewheel")
      : (d3_behavior_zoomDelta = function() { return -d3.event.detail; }, "MozMousePixelScroll");

};


module.exports = Plugin;
},{"./interpolateZoom":3}],3:[function(require,module,exports){
/*
 * Taken from d3.math.trigonometry
 */

var ε = 1e-6,
    ε2 = ε * ε,
    π = Math.PI,
    τ = 2 * π,
    τε = τ - ε,
    halfπ = π / 2,
    d3_radians = π / 180,
    d3_degrees = 180 / π;

function d3_sgn(x) {
  return x > 0 ? 1 : x < 0 ? -1 : 0;
}

// Returns the 2D cross product of AB and AC vectors, i.e., the z-component of
// the 3D cross product in a quadrant I Cartesian coordinate system (+x is
// right, +y is up). Returns a positive value if ABC is counter-clockwise,
// negative if clockwise, and zero if the points are collinear.
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


var ρ = Math.SQRT2,
    ρ2 = 2,
    ρ4 = 4;

// p0 = [ux0, uy0, w0]
// p1 = [ux1, uy1, w1]
module.exports = function(p0, p1) {
  var ux0 = p0[0], uy0 = p0[1], wx0 = p0[2], wy0 = p0[3],
      ux1 = p1[0], uy1 = p1[1], wx1 = p1[2], wy1 = p1[3];

  var dx = ux1 - ux0,
      dy = uy1 - uy0,
      d2 = dx * dx + dy * dy,
      d1 = Math.sqrt(d2),
      bx0 = (wx1 * wx1 - wx0 * wx0 + ρ4 * d2) / (2 * wx0 * ρ2 * d1),
      by0 = (wy1 * wy1 - wy0 * wy0 + ρ4 * d2) / (2 * wy0 * ρ2 * d1),
      bx1 = (wx1 * wx1 - wx0 * wx0 - ρ4 * d2) / (2 * wx1 * ρ2 * d1),
      by1 = (wy1 * wy1 - wy0 * wy0 - ρ4 * d2) / (2 * wy1 * ρ2 * d1),
      rx0 = Math.log(Math.sqrt(bx0 * bx0 + 1) - bx0),
      ry0 = Math.log(Math.sqrt(by0 * by0 + 1) - by0),
      rx1 = Math.log(Math.sqrt(bx1 * bx1 + 1) - bx1),
      ry1 = Math.log(Math.sqrt(by1 * by1 + 1) - by1),
      drx = rx1 - rx0,
      dry = ry1 - ry0,
      Sx = (drx || Math.log(wx1 / wx0)) / ρ,
      Sy = (dry || Math.log(wy1 / wy0)) / ρ;

  function interpolate(t) {
    var sx = t * Sx;
    var sy = t * Sy;
    if (drx || dry) {
      // General case.
      var coshrx0 = d3_cosh(rx0),
          coshry0 = d3_cosh(ry0),
          ux = wx0 / (ρ2 * d1) * (coshrx0 * d3_tanh(ρ * sx + rx0) - d3_sinh(rx0)),
          uy = wy0 / (ρ2 * d1) * (coshry0 * d3_tanh(ρ * sy + ry0) - d3_sinh(ry0));
      
      return [
        ux0 + ux * dx,
        uy0 + uy * dy,
        wx0 * coshrx0 / d3_cosh(ρ * sx + rx0),
        wy0 * coshry0 / d3_cosh(ρ * sy + ry0)
      ];
    }
    // Special case for u0 ~= u1.
    return [
      ux0 + t * dx,
      uy0 + t * dy,
      wx0 * Math.exp(ρ * sx),
      wy0 * Math.exp(ρ * sy)
    ];
  }

  interpolate.duration = (Sx * 1000 + Sy * 1000) / 2;

  return interpolate;
};

},{}]},{},[1]);
