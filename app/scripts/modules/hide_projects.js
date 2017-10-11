/**
 * 隐藏和显示团队
 */

import $ from 'jquery'
import _ from 'lodash'
import api from '../lib/tower_api'

const TPL_PROJECTS_TOGGLE = ```
  <label class="tp-projects-toggle">
    <input type="checkbox" />
    显示隐藏的项目
  </label>
```
const TPL_PROJECT_TOGGLE = ```
  <span class="tp-project-toggle">隐藏</span>
```

function inTeamProjectsPage () {
  var url = document.location.href
  var pat = /https?:\/\/tower\.im\/teams\/.*\/projects\/.*/i

  return pat.test(url)
}

function getProjectId ($project) {
  var url = $project.attr('href')
  return url.replace('/projects/', '')
}

function applyToggle ($project, hidden) {
  var text = hidden ? '显示' : '隐藏'

  $project.find('.tp-project-toggle').html(text)
  $project.toggleClass('tp-hide', hidden)
}

function refreshLaunchpad () {
  if (!api.moduleEnabled('launchpad')) return

  var launchpadRefresh = $('.tp-launchpad .tp-btn-refresh').get(0)
  if (launchpadRefresh) {
    launchpadRefresh.click()
  }
}

function toggleProject (event) {
  event.preventDefault()
  event.stopImmediatePropagation()

  var $project = $(this).parents('a')
  var projectId = getProjectId($project)
  var hidden = !api.isProjectHidden(projectId)

  // Toogle team hide
  var hiddenProjects = api.hiddenProjects()
  if (hidden) {
    hiddenProjects.push(projectId)
  } else {
    _.pull(hiddenProjects, projectId)
  }
  api.cache.set('hidden_projects', hiddenProjects)

  applyToggle($project, hidden)
  refreshLaunchpad()
}

function toggleHideProjects () {
  var showHideProjects = $(this).prop('checked')
  $('.projects').toggleClass('tp-show-hide-projects', showHideProjects)
}

function initialize () {
  if (!api.moduleEnabled('hide_projects')) return
  if (!inTeamProjectsPage()) return

  $('.project-tools-right').prepend(TPL_PROJECTS_TOGGLE)

  $('.tp-projects-toggle :checkbox').on('click', toggleHideProjects)

  $('.projects a.project[href^="/projects/"]').each(function () {
    var $project = $(this)
    var projectId = getProjectId($project)
    var hidden = api.isProjectHidden(projectId)

    $project.append(TPL_PROJECT_TOGGLE)

    applyToggle($project, hidden)
  })

  $('.tp-project-toggle').on('click', toggleProject)
}

module.exports = initialize
