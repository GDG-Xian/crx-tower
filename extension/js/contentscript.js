(function() {
  var PATTERN = {
    HTML_BODY: /(<body[\s\S]*<\/body>)/img,
  };

  var TPL = {
    LI_A: '<li><a href="#{1}">#{2}</a></li>',
  }

  function fmt() {
      var args = arguments;
      return args[0].replace(/#{(.*?)}/g, function(match, prop) {
          return function(obj, props) {
              var prop = /\d+/.test(props[0]) ? parseInt(props[0]) : props[0];
              if (props.length > 1) {
                  return arguments.callee(obj[prop], props.slice(1));
              } else {
                  return obj[prop];
              }
          }(typeof args[1] === 'object' ? args[1] : args, prop.split(/\.|\[|\]\[|\]\./));
      });
  }

  function log() {
      var message = Array.prototype.slice.call(arguments, 0);
      console.log.apply(console, ['[tower+]'].concat(message));
  }

  function getPage(url, callback) {
    $.get(url, function(html) {
      callback(PATTERN.HTML_BODY.test(html) ? RegExp.$1 : '');
    });
  }

  function loadTeams() {
    var $tpTeams = $('.tp-teams');
    var tplCaret = '<span class="twr twr-caret-down"></span>';
    getPage('https://tower.im/launchpad?skip=1', function(html) {
      $(html).find('.teams li:not(:last)').each(function() {
        var $team = $(this);
        $team.find('.fly').replaceWith(tplCaret);
        $tpTeams.append($team);
      });
    });
  }

  function loadProjects() {
    var url = this.href,
        $team = $(this).parent(),
        $tpProjects = $team.find('.tp-projects'),
        tplProjects = '<ul class="tp-projects tp-hide"></ul>';

    if ($tpProjects.size() == 0) {
      $tpProjects = $(tplProjects).appendTo($team);

      getPage(url, function(html) {
        $(html).find('.projects a.project:not(.new)').each(function() {
          var $project = $(this),
              href     = $project.attr('href'),
              title    = $project.attr('title');
          $tpProjects.append(fmt(TPL.LI_A, href, title));
        });
      });
    }

    $('.tp-projects').hide();
    $tpProjects.show();
  }

  function setupLaunchpad() {
    var tpl = '' +
      '<div id="tp-launchpad">' +
      '  <ul class="tp-teams"></ul>' +
      '</div>';
    $('body').prepend(tpl);

    loadTeams();

    $(document).on('mouseenter', '.tp-teams > li > a', loadProjects);
    $(document).on('mouseout', '.tp-projects', function() {
      $(this).hide();
    });
  }

  function initialize() {
    setupLaunchpad();
  }

  $(document).ready(initialize);
})();