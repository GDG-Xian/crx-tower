var $   = require('jquery');
var api = require('../lib/tower_api');
var tpl = require('../lib/template');
var log = require('../lib/log');

function setupSettingsMenu() {
  $('.member-menu .part-line:first').before(tpl.menuSetting);
}

function showSettingsModal() {
  $('.popover-member-menu').hide();
  $('.fp-dialog-settings').remove();

  var $dialog = $(tpl.settingsDialog);
  $dialog.appendTo('body').fadeIn();
}

function closeDialog() {
  $('.fp-dialog-settings').remove();
}

function initialize() {
  $(document).on('click', '.link-member-menu', setupSettingsMenu);
  $(document).on('click', '.fp-menu-setting', showSettingsModal);
  $(document).on('click', '.fp-dialog-settings .simple-dialog-remove', closeDialog);
}

module.exports = initialize;