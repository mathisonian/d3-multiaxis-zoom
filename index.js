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
