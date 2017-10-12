'use strict';

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _settings = require('./modules/settings');

var _settings2 = _interopRequireDefault(_settings);

var _launchpad = require('./modules/launchpad');

var _launchpad2 = _interopRequireDefault(_launchpad);

var _eventToggle = require('./modules/eventToggle');

var _eventToggle2 = _interopRequireDefault(_eventToggle);

var _hideTeams = require('./modules/hideTeams');

var _hideTeams2 = _interopRequireDefault(_hideTeams);

var _hideProjects = require('./modules/hideProjects');

var _hideProjects2 = _interopRequireDefault(_hideProjects);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function injectScript(url) {
  var $script = (0, _jquery2.default)('<script type="text/javascript"></script>');
  $script.attr('src', url).appendTo('head');
}

function setupEventBridge() {
  injectScript(chrome.extension.getURL('js/bridge.js'));

  window.addEventListener('message', function (event) {
    if (event.source !== window) return;

    (0, _jquery2.default)(document).trigger(event.data.type);
    (0, _jquery2.default)(document).trigger('pjaxload');
  }, false);
}

(0, _jquery2.default)(document).ready(function () {
  setupEventBridge();

  (0, _settings2.default)();
  (0, _launchpad2.default)();
  (0, _hideTeams2.default)();
  (0, _hideProjects2.default)();
  (0, _eventToggle2.default)();

  (0, _jquery2.default)(document).on('pjaxload', function () {
    (0, _hideTeams2.default)();
    (0, _hideProjects2.default)();
    (0, _eventToggle2.default)();
  });
});