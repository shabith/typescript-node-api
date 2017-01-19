module.exports = function() {
    var colors = require('mocha/lib/reporters/base').colors;
    colors['error stack'] = '30;42';
    colors['pass'] = '50;100';
}