var $   = require('jquery');

var launchpad = require('./modules/launchpad');
var eventToggle = require('./modules/event_toggle');

$(document).ready(function() {
  launchpad();
  eventToggle();
});