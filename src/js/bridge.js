// Tower im event bridge

var events = [
  'pjaxload#page-projects',
  'pjaxload#page-message',
  'pjaxload#page-todo',
  'pjaxload#page-doc'
].join(' ');

$(document).on(events, function(event) {
  window.postMessage({ type: event.type }, '*');
});
  
console.log('[tower+] Event bride installed.')