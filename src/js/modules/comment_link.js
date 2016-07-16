var $ = require('jquery');
var tpl = require('../lib/template');
var api = require('../lib/tower_api');

function createCommentLink() {
  var $actions = $(this).find('.comment-actions .actions');
  if (!$actions.is(':has(.comment-link)')) {
    $actions.prepend(tpl.commentLink.assign('#' + this.id));
  }
}

function initialize() {
  if (!api.moduleEnabled('comment_link')) return;

  $(document).off('mouseenter', '.comment', createCommentLink);
  $(document).on('mouseenter', '.comment', createCommentLink);
}

module.exports = initialize;
