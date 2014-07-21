
TIMEOUT = 750

notifyStatus = (s) ->
  el = document.getElementById('status')
  el.innerHTML = s
  el.classList.add 'show' unless el.classList.contains 'show'
  setTimeout ->
    el.innerHTML = ''
    el.classList.remove 'show'
  , TIMEOUT

saveOptions = (value) ->
  el = document.getElementById('tabs-per-window')
  localStorage.setItem 'tabsPerWindow', el.value

  el = document.getElementById('register-list')
  localStorage.setItem 'registerList', el.value

  notifyStatus('Options saved')

restoreOptions = () ->
  el = document.getElementById('tabs-per-window')
  el.value = localStorage.getItem('tabsPerWindow')
  
  el = document.getElementById('register-list')
  el.value = localStorage.getItem('registerList')

document.addEventListener 'DOMContentLoaded', ->
  restoreOptions()

  el = document.getElementById('tabs-per-window')
  el.addEventListener 'blur', saveOptions

  el = document.getElementById('register-list')
  el.addEventListener 'blur', saveOptions

