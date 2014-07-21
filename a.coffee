util = require 'util'

DOMAIN = /// ^ [^:]+:/+([^/]+) ///

REGS = [
  ['a1','a2']
  /^[A-Z]/
  ['b1','b2','b3']
]

inreg = (a, reg) ->
  if Array.isArray reg
    reg.indexOf(a.domain) != -1
  else if reg instanceof RegExp
    reg.test a.domain
  else
    false

getDomain = (url) ->
  if match = DOMAIN.exec url then match[1] else ''

wrap = (input) ->
  for a in input
    id: a.id
    url: a.url
    domain: getDomain a.url

groupByDomain = (input, regs) ->
  divs = []
  for a in input
    for reg, i in regs
      if inreg a, reg
        a.domain = '_reg_' + i
        break
    dest = null
    for div in divs
      if a.domain == div[0].domain
        dest = div
        break
    if dest
      dest.push a
    else
      divs.push [a]
  divs

pack = (divs, capacity) ->
  outs = []
  while divs and divs.length
    out = divs.pop()
    count = out.length
    if divs.length
      for i in [divs.length-1..0]
        div = divs[i]
        len = div.length
        if count + len <= capacity
          out = out.concat div
          divs.splice i, 1
          count += len
    outs.push out
  outs

flatten = (out) ->
  b = []
  b = b.concat a for a in out
  b

divide = (input, regs, size) ->
  regs = [] unless regs?
  divs = wrap input
  divs = groupByDomain divs, regs
  divs = divs.sort (a, b) -> b.length - a.length
  divs = pack divs, size
  divs = (flatten(div).sort((a,b)->a.url > b.url) for div in divs)

do ->
  input = [
    {id:1, url: 'http://b/c'}
    {id:1, url: 'http://a2/k'}
    {id:1, url: 'http://a1/c'}
    {id:1, url: 'http://d/d'}
    {id:1, url: 'http://e/f'}
    {id:1, url: 'http://Aob/f'}
    {id:1, url: 'http://b/g'}
    {id:1, url: 'http://b/f'}
    {id:1, url: 'http://b/f'}
    {id:1, url: 'http://Book/f'}
    {id:1, url: 'http://b/g/h/i'}
    {id:1, url: 'http://b/j/'}
  ]

  console.log divide input, REGS, 3
  return
  #console.log input

  divs = wrap input
  divs = groupByDomain divs, REGS
  divs = divs.sort (a, b) -> b.length - a.length
  #console.log 'sorted >'
  #console.log util.inspect divs, false, 5
  
  divs = pack divs, 3
  #console.log 'packed >'
  #console.log util.inspect divs, false, 5
  
  divs = (flatten(div).sort((a,b)->a.url > b.url) for div in divs)
  console.log 'falatten >'
  console.log divs



