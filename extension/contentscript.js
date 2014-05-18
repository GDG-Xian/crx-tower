// executeCommand 命令详见：
// https://developer.mozilla.org/en/docs/Rich-Text_Editing_in_Mozilla
var TPLS = {
    BTN_LINK: ''
        + '<li><a tabindex="-1" unselectable="on" class="toolbar-item link" '
        + 'href="javascript:;" title="插入链接"><span class="crx-icon-link">'
        + '</span></a></li>',
    BTN_INDENT: ''
        + '<li><a tabindex="-1" unselectable="on" class="toolbar-item indent" '
        + 'href="javascript:;" title="缩进"><span class="crx-icon-indent">'
        + '</span></a></li>',
    BTN_OUTDENT: ''
        + '<li><a tabindex="-1" unselectable="on" class="toolbar-item outdent" '
        + 'href="javascript:;" title="取消缩进"><span class="crx-icon-outdent">'
        + '</span></a></li>',
    BTN_HR: ''
        + '<li><a tabindex="-1" unselectable="on" class="toolbar-item hr" '
        + 'href="javascript:;" data-command="hr" title="分隔线" '
        + 'data-need-focus="true"><span class="icon-minus"></span></a></li>',
    BTN_SEP: '<li><span class="separator"></span></li>'
};

function findActiveEditor() {
   return $('.editor-wrapper:visible');
}

function onCommandCreateLink(evt) {
    var link = $.trim(window.prompt('输入链接地址', ''));
    link && document.execCommand("CreateLink", false, link);
}

function onCommandIndent(evt) {
    document.execCommand("indent", true, null);
}

function onCommandOutdent(evt) {
    document.execCommand("outdent", true, null);
}

function onCommandHR(evt) {
    document.execCommand("insertHorizontalRule", true, null);
}

function extendEditorToolbar() {
    var $editor = findActiveEditor();
    if ($editor.is('.crx-extended')) return;

    var $toolbar = $editor.children('.editor-toolbar').children('ul');
    $toolbar.append($(TPLS.BTN_SEP));

    $(TPLS.BTN_LINK).appendTo($toolbar).on('click', onCommandCreateLink);
    $(TPLS.BTN_INDENT).appendTo($toolbar).on('click', onCommandIndent);
    $(TPLS.BTN_OUTDENT).appendTo($toolbar).on('click', onCommandOutdent);

    // 如果不是文档编辑器，为其添加分割线
    if ($toolbar.parents('.doc-editor').size() === 0) {
         $(TPLS.BTN_HR).appendTo($toolbar).on('click', onCommandHR);
    }

    $editor.addClass('crx-extended');
}

function fillQuickBox() {
    getQuickBox().append('<input type="checkbox" id="crx-tower-show-events">');
}

function hideEvent() {
    $('.event').hide();
}

$(function() {
	$(document).on('click', '.fake-textarea', extendEditorToolbar);
    $(document).on('click', '.btn-new-discussion', extendEditorToolbar);
    $(document).on('focus', '.editor-body', extendEditorToolbar);
    extendEditorToolbar();
    hideEvent();
});
