var $ = require('jquery')
var _ = require('lodash')

var PAT = {
  BODY: /(<body[\s\S]*<\/body>)/img
}

var DEFAULT_MODULES = [
  'launchpad', 'event_toggle',
  'hide_teams', 'hide_projects'
]

// Chrome window.LocalStorage Utilities
var cache = {
  set: function (key, value) {
    window.localStorage['tp_' + key] = JSON.stringify(value)
  },

  get: function (key, defaultValue) {
    var value = window.localStorage['tp_' + key]
    if (_.isEmpty(value)) {
      return defaultValue
    } else {
      return JSON.parse(value)
    }
  },

  remove: function (key) {
    delete window.localStorage['tp_' + key]
  },

  getAll: function (pattern) {
    var list = []
    var pat = pattern || ''
    var regex = new RegExp('^tp_' + pat + '.*$', 'i')

    for (var key in window.localStorage) {
      if (regex.test(key)) {
        key = key.replace(/^tp_/, '')
        list.push(cache.get(key))
      }
    }

    return list
  },

  clear: function (pattern) {
    var pat = pattern || ''
    var regex = new RegExp('^tp_' + pat + '.*$', 'i')

    for (var key in window.localStorage) {
      if (regex.test(key)) {
        key = key.replace(/^tp_/, '')
        cache.remove(key)
      }
    }
  }
}

// Tower API
var api = { cache: cache }

api.urlFor = function (path, params) {
  var query = $.param(params || {}).replace(/^(.+)$/, '?$1')

  return 'https://tower.im' + path + query
}

// 向指定 url 发送 get 请求，并返回 body 之间的内容
api.getPage = function (url, callback) {
  $.get(url, function (html) {
    var match = html.match(PAT.BODY)
    callback(match ? match[0] : html)
  })
}

// 取得团队列表，如果缓存中没有记录，则从页面中取
api.teams = function (callback) {
  var teams = cache.getAll('team')

  if (teams.length > 0) {
    callback(teams)
  } else {
    api.getPage(api.urlFor('/launchpad?skip=1'), function (html) {
      $(html).find('.teams li:not(.new,.team-join-request)').each(function () {
        var $team = $(this)

        var url = $team.find('a').attr('href')
        var name = _.trim($team.find('.name').text())
        var id = url.replace(/\/teams\/(.*)\/projects/, '$1')

        var team = { id, name, url: api.urlFor(url) }

        cache.set('team_' + team.id, team)
        teams.push(team)
      })

      callback(teams)
    })
  }
}

// 取得团队下面的项目列表，如果缓存中没有，则从页面中取
api.projects = function (teamId, callback) {
  var projects = cache.getAll('project').filter({ teamId: teamId })

  if (projects.length > 0) {
    callback(projects)
  } else {
    var teamUrl = api.urlFor('/teams/' + teamId + '/projects/')
    api.getPage(teamUrl, function (html) {
      $(html).find('.projects a.project:not(.new)').each(function () {
        var $project = $(this)

        var url = $project.attr('href')
        var name = _.trim($project.find('span.name').text())
        var id = url.replace(/\/projects\//i, '')
        var project = { id, name, teamId, url: api.urlFor(url) }

        cache.set('project_' + project.id, project)
        projects.push(project)
      })

      callback(projects)
    })
  }
}

api.hiddenTeams = function () {
  return cache.get('hidden_teams', [])
}

api.isTeamHidden = function (teamId) {
  return api.hiddenTeams().findIndex(teamId) !== -1
}

api.hiddenProjects = function () {
  return cache.get('hidden_projects', [])
}

api.isProjectHidden = function (projectId) {
  return api.hiddenProjects().findIndex(projectId) !== -1
}

api.enabledModules = function () {
  return cache.get('enabled_modules', DEFAULT_MODULES)
}

api.moduleEnabled = function (module) {
  var modules = api.enabledModules()
  return modules.findIndex(module) !== -1
}

module.exports = api
