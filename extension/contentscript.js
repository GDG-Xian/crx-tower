// executeCommand 命令详见：
// https://developer.mozilla.org/en/docs/Rich-Text_Editing_in_Mozilla
var TPLS = {
    BTN_LINK: ''
        + '<li><a tabindex="-1" unselectable="on" class="toolbar-item link"'
        + ' href="javascript:;" title="插入链接"><span class="crx-icon-link"></span></a></li>',
    BTN_INDENT: ''
        + '<li><a tabindex="-1" unselectable="on" class="toolbar-item indent"'
        + ' href="javascript:;" title="缩进"><span class="crx-icon-indent"></span></a></li>',
    BTN_OUTDENT: ''
        + '<li><a tabindex="-1" unselectable="on" class="toolbar-item outdent"'
        + ' href="javascript:;" title="取消缩进"><span class="crx-icon-outdent"></span></a></li>',
    BTN_SEP: '<li><span class="separator"></span></li>',
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

function extendEditorToolbar() {
    var $editor = findActiveEditor();
    if ($editor.is('.crx-extended')) return;

    var $toolbar = $editor.find('.editor-toolbar').find('ul');
    $toolbar.append($(TPLS.BTN_SEP));

    $(TPLS.BTN_LINK).appendTo($toolbar).on('click', onCommandCreateLink);
    $(TPLS.BTN_INDENT).appendTo($toolbar).on('click', onCommandIndent);
    $(TPLS.BTN_OUTDENT).appendTo($toolbar).on('click', onCommandOutdent);

    $editor.data('crx-extended');
}

$(function() {
	$(document).on('click', '.fake-textarea', extendEditorToolbar);
    $(document).on('click', '.btn-new-discussion', extendEditorToolbar);
    extendEditorToolbar();
});