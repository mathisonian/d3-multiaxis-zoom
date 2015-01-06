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
