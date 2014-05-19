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

processHideEvents = (flag) ->
  hideEvents(flag) unless flag == undefined

initOptions -> processHideEvents(options.hideEvents)
chrome.storage.onChanged.addListener (changes) ->
  change = changes['hideEvents']
  flag = change && change.newValue
  processHideEvents(flag)
