{pull} = require '../common/helpers'

angular.module 'app', ['ngSanitize']

.factory 'storageService', ->
  require('../common/storage').storage

.constant 'optionsConfig',
  timeout: 800
  defaultRule:
    regexp: ''
    disable: false
    isolate: false

.controller 'OptionsController', class
  @$inject: ['$timeout', 'storageService', 'optionsConfig']
  constructor: ($timeout, storageService, optionsConfig) ->
    @saved = false

    @restore = ->
      @tabsPerWindow = storageService.get 'tabsPerWindow'
      @rules = storageService.get 'rules'

    @save = ->
      storageService.set 'tabsPerWindow', @tabsPerWindow
      storageService.set 'rules', @rules
      @saved = true
      $timeout (=> @saved = false), optionsConfig.timeout

    @removeRule = (rule) ->
      pull @rules, rule

    @addRules = ->
      @rules ?= []
      @rules.push angular.extend {}, optionsConfig.defaultRule

    @upRule = (rule) ->
      i = findIndex(@rules, rule)
      return unless i isnt -1 and i >= 1
      swapInArray @rules, i, i - 1

    @downRule = (rule) ->
      i = findIndex(@rules, rule)
      return unless i isnt -1 and i <= @rules.length - 2
      swapInArray @rules, i, i + 1

    findIndex = (array, element) ->
      for e, i in array
        if e is element
          return i
      -1

    swapInArray = (array, i, j) ->
      return if i is j
      [j, i] = [i, j] if i > j
      a = array[i]
      b = array[j]
      array.splice(i, 1, b)
      array.splice(j, 1, a)
      array

    @restore()
