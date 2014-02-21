function makeToolbarItem(name, title) {
    return $('<li><a tabindex="-1" unselectable="on" class="toolbar-item ' + name 
        + '" href="javascript:;" data-command="' + name + '" title="' + title 
        + '"><span>Link</span></a></li>');
}

function makeTollbarSeparator() {
    return $('<li><span class="separator"></span></li>');
}

function findActiveEditor() {
   return $('.editor-wrapper:visible');
}

function insertLink(evt) {
    var link = $.trim(window.prompt('输入链接地址', ''));
    link && document.execCommand("CreateLink", false, link);
}

function extendEditorToolbar() {
    var $editor = findActiveEditor();
    if ($editor.is('.crx-extended')) return;

    var $toolbar = $editor.find('.editor-toolbar').find('ul');
    makeTollbarSeparator().appendTo($toolbar);

    var $item1 = makeToolbarItem('link', '点击插入链接');
    $item1.appendTo($toolbar).on('click', insertLink);

    $editor.data('crx-extended');
}

$(function() {
	$(document).on('click', '.fake-textarea', extendEditorToolbar);
    $(document).on('click', '.btn-new-discussion', extendEditorToolbar);
    extendEditorToolbar();
});