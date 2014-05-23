hideEvents = (flag) ->
  hideEventsStyle = document.getElementById('crx-tower-hide-events')
  if flag == 'on'
    unless hideEventsStyle
      hideEventsStyle = document.createElement('style')
      hideEventsStyle.id = 'crx-tower-hide-events'
      hideEventsStyle.type = 'text/css'
      hideEventsStyle.innerHTML = '.histories, .event { display: none; }'
      document.getElementsByTagName('head')[0].appendChild(hideEventsStyle)
  else
    hideEventsStyle && hideEventsStyle.remove()

hideTasks = (flag) ->
  hide = (flag == 'on')
  $('.todo:not(.hl)').toggle(!hide)

processHideEvents = (flag) ->
  hideEvents(flag) unless flag == undefined

processShowHighlightsOnly = (flag) ->
  hideTasks(flag) unless flag == undefined

initOptions ->
  processHideEvents(options.hideEvents)
  jQuery -> processShowHighlightsOnly(options.showHighlightsOnly)

chrome.storage.onChanged.addListener (changes) ->
  if 'hideEvents' in changes
    change = changes['hideEvents']
    flag = change && change.newValue
    processHideEvents(flag)
  else if 'showHighlightsOnly' in changes
    change = changes['showHighlightsOnly']
    flag = change && change.newValue
    processShowHighlightsOnly(flag)

