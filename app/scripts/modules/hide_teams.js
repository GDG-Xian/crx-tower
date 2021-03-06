/**
 * 隐藏和显示团队
 */

import $ from 'jquery'
import _ from 'lodash'
import api from '../lib/tower_api'

const TPL_TEAMS_TOGGLE = `
  <div class="tp-wrapper tp-text-center">
    <label>
      <input type="checkbox" class="tp-teams-toggle" />
      显示隐藏的团队
    </label>
  </div>
`

function inLaunchPadPage () {
  var url = document.location.href
  var pat = /https?:\/\/tower.im\/launchpad.*/i

  return pat.test(url)
}

function getTeamId ($team) {
  var url = $team.attr('href')
  return url.replace(/\/teams\/(.*)\/projects/, '$1')
}

function applyToggle ($team, hidden) {
  var text = hidden ? '显示' : '隐藏'
  $team.find('.fly').html(text)

  $team.parent().toggleClass('tp-hide', hidden)
}

function refreshLaunchpad () {
  if (!api.moduleEnabled('launchpad')) return

  var launchpadRefresh = $('.tp-launchpad .tp-btn-refresh').get(0)
  if (launchpadRefresh) {
    launchpadRefresh.click()
  }
}

function toggleTeam (event) {
  event.preventDefault()
  event.stopImmediatePropagation()

  var $team = $(this).parents('a')
  var teamId = getTeamId($team)
  var hidden = !api.isTeamHidden(teamId)

  // Toogle team hide
  var hiddenTeams = api.hiddenTeams()
  if (hidden) {
    hiddenTeams.push(teamId)
  } else {
    _.pull(hiddenTeams, teamId)
  }
  api.cache.set('hidden_teams', hiddenTeams)

  applyToggle($team, hidden)
  refreshLaunchpad()
}

function toggleHideTeams () {
  var showHideTeams = $(this).prop('checked')
  $('.teams').toggleClass('tp-show-hide-teams', showHideTeams)
}

function initialize () {
  if (!api.moduleEnabled('hide_teams')) return
  if (!inLaunchPadPage()) return

  $('.teams').before(TPL_TEAMS_TOGGLE)

  $('.tp-teams-toggle').on('click', toggleHideTeams)

  $('.teams a[href^="/teams/"]').each(function () {
    var $team = $(this)
    var teamId = getTeamId($team)
    var hidden = api.isTeamHidden(teamId)

    applyToggle($team, hidden)
  })

  $('.teams a[href^="/teams/"] .fly').on('click', toggleTeam)
}

module.exports = initialize
