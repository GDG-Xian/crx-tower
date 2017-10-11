import $ from 'jquery'
import settings from './modules/settings'
import launchpad from './modules/launchpad'
import eventToggle from './modules/event_toggle'
import hideTeams from './modules/hide_teams'
import hideProjects from './modules/hide_projects'

function injectScript (url) {
  var $script = $('<script type="text/javascript"></script>')
  $script.attr('src', url).appendTo('head')
}

function setupEventBridge () {
  injectScript(chrome.extension.getURL('js/bridge.js'))

  window.addEventListener('message', function (event) {
    if (event.source !== window) return

    $(document).trigger(event.data.type)
    $(document).trigger('pjaxload')
  }, false)
}

$(document).ready(function () {
  setupEventBridge()

  settings()
  launchpad()
  hideTeams()
  hideProjects()
  eventToggle()

  $(document).on('pjaxload', function () {
    hideTeams()
    hideProjects()
    eventToggle()
  })
})
