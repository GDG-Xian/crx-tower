(function() {
  var TPL = {
    LAUNCHPAD: '<div class="tp-launchpad"></div>',
    TEAMS: '<ul class="tp-teams"></ul>',
    TEAM: ''
      + '<li class="tp-team" id="tp-team-%(id)s">'
      + '  <a href="%(url)s">'
      + '    %(name)s <span class="twr twr-caret-down"></span>'
      + '  </a>'
      + '</li>',
    PROJECTS: '<ul class="tp-projects"></ul>',
    PROJECT: ''
      + '<li class="tp-project" id="tp-project-%(id)s">'
      + '  <a href="%(url)s">%(name)s</a>'
      + '</li>',
  }

  function log() {
    var message = Array.prototype.slice.call(arguments, 0);
    console.log.apply(console, ['[tower+]'].concat(message));
  }

  function setupLaunchpad() {
    var $launchpad = $(TPL.LAUNCHPAD).prependTo('body');

    api.teams(function(teams) {
      var $teams = $(TPL.TEAMS).appendTo($launchpad);

      _.each(teams, function(team) {
        var $team = $(_.sprintf(TPL.TEAM, team)).appendTo($teams);
        
        api.projects(team.id, function(projects) {
          var $projects = $(TPL.PROJECTS).appendTo($team);

          _.each(projects, function(project) {
            $projects.append(_.sprintf(TPL.PROJECT, project));
          });
        });
      });
    });

    $(document).on('mouseover', '.tp-team', function() {
      $('.tp-team.active').removeClass('active');
      $(this).addClass('active');
    });

    $(document).on('mouseleave', '.tp-team', function(event) {
      $(this).removeClass('active');
    });
  }

  function initialize() {
    setupLaunchpad();
  }

  $(document).ready(initialize);
})();