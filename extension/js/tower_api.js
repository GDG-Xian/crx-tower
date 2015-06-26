// require jquery

(function() {
  var PAT = {
    BODY: /(<body[\s\S]*<\/body>)/img,
  };

  // Chrome LocalStorage Utilities
  var cache = {
    set: function(key, value) {
      localStorage['tp_' + key] = JSON.stringify(value);
    },

    get: function(key) {
      return JSON.parse(localStorage['tp_' + key]);
    },

    remove: function(key) {
      delete localStorage['tp_' + key];
    },

    getAll: function(pattern) {
      var list = [],
          pattern = pattern || '',
          regex = new RegExp('^tp_.*' + pattern + '.*$', 'i');

      for (var key in localStorage) {
        if (regex.test(key)) {
          key = key.replace(/^tp_/, '');
          list.push(cache.get(key));
        }
      }

      return list;
    },

    clear: function(pattern) {
      var pattern = pattern || '',
          regex = new RegExp('^tp_.*' + pattern + '.*$', 'i');

      for (var key in localStorage) {
        if (regex.test(key)) {
          key = key.replace(/^tp_/, '');
          cache.remove(key);
        }
      }
    }
  };

  // Tower API
  var api = window.api = { cache: cache };

  api.urlFor = function(path, params) {
    var query = $.param(params || {}).replace(/^(.+)$/, '?$1');

    return 'https://tower.im' + path + query;
  };

  // 向指定 url 发送 get 请求，并返回 body 之间的内容
  api.getPage = function(url, callback) {
    $.get(url, function(html) {
      var match = html.match(PAT.BODY);
      callback(match ? match[0] : html);
    });
  };

  // 取得团队列表，如果缓存中没有记录，则从页面中取
  api.teams = function(callback) {
    var teams = cache.getAll('team');

    if (teams.length > 0) {
      callback(teams);
    } else {
      api.getPage(api.urlFor('/launchpad?skip=1'), function(html) {
        $(html).find('.teams li:not(.new,.team-join-request)').each(function() {
          var $team = $(this);
          
          var url = $team.find('a').attr('href');
          var name = $team.find('.name').text();
          var id = url.replace('/teams/', '');

          var team = {
            id: id,
            url: api.urlFor(url),
            name: name,
          };

          cache.set('team_' + team.id, team);
          teams.push(team);
        });

        callback(teams);
      });
    }
  };


  // 取得团队下面的项目列表，如果缓存中没有，则从页面中取
  api.projects = function(teamId, callback) {
    var projects = _.where(cache.getAll('project'), { teamId: teamId });

    if (projects.length > 0) {
      callback(projects);
    } else {
      var teamUrl = api.urlFor('/teams/' + teamId + '/projects/');
      api.getPage(teamUrl, function(html) {
        $(html).find('.projects a.project:not(.new)').each(function() {
          var $project = $(this);

          var url = $project.attr('href');
          var name = $project.attr('title');
          var id = url.replace('/projects/', '');

          var project = {
            id: id,
            url: api.urlFor(url),
            name: name,
            teamId: teamId,
          };

          cache.set('project_' + project.id, project);
          projects.push(project);
        });

        callback(projects);
      });
    }
  };
})();