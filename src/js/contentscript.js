var $   = require('jquery');

var settings     = require('./modules/settings');
var launchpad    = require('./modules/launchpad');
var eventToggle  = require('./modules/event_toggle');
var hideTeams    = require('./modules/hide_teams');
var hideProjects = require('./modules/hide_projects');
var commentLink = require('./modules/comment_link');

function injectScript(url) {
  var $script = $('<script type="text/javascript"></script>');
  $script.attr('src', url).appendTo('head');
}

function setupEventBridge() {
  injectScript(chrome.extension.getURL('js/bridge.js'));

  window.addEventListener("message", function(event) {
    if (event.source != window) return;

    $(document).trigger(event.data.type);
    $(document).trigger('pjaxload');
  }, false);
}

$(document).ready(function() {
  setupEventBridge();

  settings();
  launchpad();
  hideTeams();
  hideProjects();
  eventToggle();
  commentLink();

  $(document).on('pjaxload', function() {
    hideTeams();
    hideProjects();
    eventToggle();
    commentLink();
  });
});
