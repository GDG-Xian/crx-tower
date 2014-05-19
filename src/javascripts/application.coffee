@options =
  hideEvents: 'off'

@log = ->
  message = Array.prototype.slice.call(arguments, 0)
  console.log.apply(console, ['[crx-tower]'].concat(message))

# 从 storage 中读取配置，如果没有配置，则初始化为默认值
@initOptions = (callback) ->
  chrome.storage.sync.get null, (data) ->
    log 'Fetching options from synced storage ...'
    log 'Merging options', data, 'into', options
    Object.merge(options, data)
    chrome.storage.sync.set(options)
    callback && callback()

# 监听设置项的变化
chrome.storage.onChanged.addListener (changes) ->
  for name of changes
    change = changes[name]
    options[name] = change.newValue
    log('Option `{1}` changed from `{2}` to `{3}`'.assign(name, change.oldValue, change.newValue))
