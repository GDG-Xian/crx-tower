import $ from 'jquery'
import _ from 'lodash'
import api from '../lib/tower_api'

const TPL_LAUNCHPAD = '<div class="tp-launchpad"></div>'
const TPL_LOADING = '<span class="tp-loading">载入中...</span>'
const TPL_TEAMS = ```
  <ul class="tp-teams tp-hide">
    <li class="tp-team">
      <a href="javascript:;" class="tp-btn-refresh" title="重读项目列表">
        【刷新】
      </a> 
    </li>
  </ul>
```
const TPL_TEAM = ```
  <li class="tp-team" data-id="<%= id %>">
    <a href="<%= url %>">
      <%= name %> <span class="twr twr-caret-down"></span>
    </a>
    <ul class="tp-projects"></ul>
  </li>
```
const TPL_PROJECT = ```
  <li class="tp-project" data-id="<%= id %>">
    <a href="<%= url %>"><%= name %></a>
  </li>
```

function setupLaunchpad () {
  $('.tp-launchpad').remove()

  var $launchpad = $(TPL_LAUNCHPAD).prependTo('body')
  $launchpad.append(TPL_LOADING)

  api.teams(function (teams) {
    var $teams = $(TPL_TEAMS).appendTo($launchpad)

    teams.forEach(function (team) {
      if (!api.isTeamHidden(team.id)) {
        $(_.template(TPL_TEAM)(team)).appendTo($teams)
      }
    })

    $('.tp-teams').removeClass('tp-hide')
    $('.tp-launchpad .tp-loading').remove()
  })
}

function loadProjects ($team) {
  api.projects($team.data('id'), function (projects) {
    var html = projects.map(function (project) {
      if (api.isProjectHidden(project.id)) {
        return ''
      } else {
        return _.template(TPL_PROJECT)(project)
      }
    }).join('')

    $team.find('.tp-projects').html(html)
  })
}

function initialize () {
  if (!api.moduleEnabled('launchpad')) return
  setupLaunchpad()

  $(document).on('mouseenter', '.tp-team', function () {
    $('.tp-team.active').removeClass('active')
    $(this).addClass('active')

    if ($(this).find('.tp-btn-refresh').length === 0) {
      loadProjects($(this))
    }
  })

  $(document).on('mouseleave', '.tp-team', function (event) {
    $(this).removeClass('active')
  })

  $(document).on('click', '.tp-btn-refresh', function (event) {
    api.cache.clear('project')
    api.cache.clear('team')
    setupLaunchpad()
  })
}

module.exports = initialize
