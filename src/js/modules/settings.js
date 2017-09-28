var $ = require('jquery')
var api = require('../lib/tower_api')
var tpl = require('../lib/template')
var log = require('../lib/log')

function setupSettingsMenu () {
  $('.popover-header-menu .part-line:first').before(tpl.menuSetting)
}

function applySettings () {
  var modules = api.enabledModules()
  modules.forEach(function (module) {
    $('.fp-dialog-settings input[value=' + module + ']').prop('checked', true)
  })
}

function showSettingsModal () {
  $('.popover-header-menu').hide()
  $('.fp-dialog-settings').remove()

  var $dialog = $(tpl.settingsDialog)
  $dialog.appendTo('body').fadeIn()

  applySettings()
}

function closeDialog () {
  $('.fp-dialog-settings').remove()
}

function saveSettings (event) {
  event.preventDefault()

  var selector = '.fp-dialog-settings .option :checkbox:checked'
  var modules = $(selector).toArray().map(function (option) {
    return option.value
  })

  log('Updates enabled modules to', modules)
  api.cache.set('enabled_modules', modules)

  window.alert('扩展设置已更新')
  document.location.reload(false)
}

function initialize () {
  $(document).on('click', '.link-member-menu', setupSettingsMenu)
  $(document).on('click', '.fp-menu-setting', showSettingsModal)
  $(document).on('click', '.fp-dialog-settings .simple-dialog-remove', closeDialog)
  $(document).on('submit', '.fp-dialog-settings form', saveSettings)
}

module.exports = initialize
