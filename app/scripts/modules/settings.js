import $ from 'jquery'
import api from '../lib/tower_api'
import log from '../lib/log'

const TPL_MENU_SETTING = '<li><a href="javascript:;" class="fp-menu-setting">扩展设置</a></li>'
const TPL_SETTINGS_DIALOG = `
  <div class="simple-dialog fp-dialog-settings">
    <a class="simple-dialog-remove" href="javascript:;">
      <i class="icon-cross"><span>✕</span></i>
    </a>

    <div class="simple-dialog-wrapper">
      <div class="simple-dialog-content">
        <h3>Tower Plus 设置</h3>
        
        <form class="form">
          <div class="form-item">
            <h4>管理扩展功能</h4>
            <p class="desc">你可以自由的启用停用用扩展的功能</p>
            
            <div class="option">
              <label><input type="checkbox" value="launchpad"> 快速导航</label>
            </div>
            <div class="option">
              <label><input type="checkbox" value="event_toggle" /> 事件折叠</label>
            </div>
            <div class="option">
              <label><input type="checkbox" value="hide_teams"> 隐藏团队</label>
            </div>
            <div class="option">
              <label><input type="checkbox" value="hide_projects" /> 隐藏项目</label>
            </div>
          </div>
          <div class="form-buttons">
            <input type="submit" class="btn" value="保存">
          </div>
        </form>
      </div>
    </div>
  <div>
`

function setupSettingsMenu () {
  $('.popover-header-menu .part-line:first').before(TPL_MENU_SETTING)
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

  var $dialog = $(TPL_SETTINGS_DIALOG)
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
