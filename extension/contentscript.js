function makeToolbarItem(name, title) {
    return '<li><a tabindex="-1" unselectable="on" class="toolbar-item ' + name 
        + '" href="javascript:;" data-command="' + name + '" title="' + title 
        + '"><span>Link</span></a></li>';
}

function findActiveEditor() {
   return $('.editor-wrapper:visible');
}

function extendEditorToolbar($editor) {
    if ($editor.is('.crx-extended')) return;

    var $item1 = makeToolbarItem('link', '点击插入链接');
    $editor.find('.editor-toolbar').find('ul').append($item1);
    $editor.addClass('crx-extended');
}

$(function() {
	$(document).on('click', function() {
	    var $editor = findActiveEditor();
	    extendEditorToolbar($editor);
	});
});
