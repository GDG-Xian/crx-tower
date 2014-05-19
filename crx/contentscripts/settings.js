var item1 = ''
    + '<div class="form-item crx-tower">'
	+ '  <div class="form-label"><label for="crx_show_event">显示历史事件</label></div>'
	+ '  <div class="form-field">'
    + '    <label><input type="radio" name="show_event" value="off">隐藏历史事件</label>'
	+ '    <label><input type="radio" name="show_event" value="on" checked="checked">显示历史事件</label>'
    + '  </div>'
    + '</div>';

$(function() {
    $('.form-item:last').after(item1);
});
