(function() {
  var TPL = {
    LOADING: '<span class="tp-loading">载入中...</div>',
    LAUNCHPAD: '<div class="tp-launchpad"></div>',
    TEAMS: ''
      + '<ul class="tp-teams tp-hide">'
      + '  <li class="tp-team">'
      + '    <a href="javascript:;" class="tp-btn-refresh" title="重读项目列表">【刷新】</a>'
      + '  </li>'
      + '</ul>',
    TEAM: ''
      + '<li class="tp-team" data-id="%(id)s">'
      + '  <a href="%(url)s">'
      + '    %(name)s <span class="twr twr-caret-down"></span>'
      + '  </a>'
      + '  <ul class="tp-projects"></ul>'
      + '</li>',
    PROJECT: ''
      + '<li class="tp-project" data-id="%(id)s">'
      + '  <a href="%(url)s">%(name)s</a>'
      + '</li>',
  }

  function log() {
    var message = Array.prototype.slice.call(arguments, 0);
    console.log.apply(console, ['[tower+]'].concat(message));
  }

  function setupLaunchpad() {
    $('.tp-launchpad').remove();

    var $launchpad = $(TPL.LAUNCHPAD).prependTo('body');
    $launchpad.append(TPL.LOADING);
    
    api.teams(function(teams) {
      var $teams = $(TPL.TEAMS).appendTo($launchpad);

      _.each(teams, function(team) {
        var $team = $(_.sprintf(TPL.TEAM, team)).appendTo($teams);
      });

      $('.tp-teams').removeClass('tp-hide');
      $('.tp-launchpad .tp-loading').remove();
    });
  }

  function loadProjects($team) {
    api.projects($team.data('id'), function(projects) {
      var html = _.map(projects, function(project) {
        return _.sprintf(TPL.PROJECT, project);
      }).join('');

      $team.find('.tp-projects').html(html);
    });
  }

  function initialize() {
    setupLaunchpad();

    $(document).on('mouseenter', '.tp-team', function() {
      $('.tp-team.active').removeClass('active');
      $(this).addClass('active');
      loadProjects($(this));
    });

    $(document).on('mouseleave', '.tp-team', function(event) {
      $(this).removeClass('active');
    });

    $(document).on('click', '.tp-btn-refresh', function(event) {
      api.cache.clear('project');
      api.cache.clear('team');
      setupLaunchpad();
    });
  }

  $(document).ready(initialize);
})();