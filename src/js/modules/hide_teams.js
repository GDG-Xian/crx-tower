/**
 * 隐藏和显示团队
 */

var $   = require('jquery');
var log = require('../lib/log');
var tpl = require('../lib/template');
var api = require('../lib/tower_api');

function inLaunchPadPage() {
  var url = document.location.href;
  var pat = /https?:\/\/tower.im\/launchpad.*/i;

  return pat.test(url);
}

function getTeamId($team) {
  var url = $team.attr('href');
  return url.replace('/teams/', '');
}

function applyToggle($team, hide) {
  var text = hide ? '显示' : '隐藏';
  $team.find('.fly').html(text);

  $team.parent().toggleClass('tp-hide', !!hide);
}

function toggleTeam(event) {
  event.preventDefault();
  event.stopImmediatePropagation();

  var $team = $(this).parents('a');
  var teamId = getTeamId($team);
  var team = api.get('team_' + teamId);

  // Toogle team and save
  team.hide = !team.hide;
  api.set('team_' + teamId, team);

  applyToggle($team, team.hide);
}

function toggleHideTeams() {
  var showHideTeams = $(this).prop('checked');
  $('.teams').toggleClass('tp-show-hide-teams', showHideTeams);
}

function initialize() {
  if (!inLaunchPadPage()) return;

  $('.teams').before(tpl.teamsToggle);

  $('.tp-teams-toggle').on('click', toggleHideTeams);

  $('.teams a[href^="/teams/"]').each(function() {
    var $team = $(this);
    var teamId = getTeamId($team);
    var team = api.get('team_' + teamId);

    applyToggle($team, team.hide);
  });

  $('.teams a[href^="/teams/"] .fly').on('click', toggleTeam);
}

module.exports = initialize;