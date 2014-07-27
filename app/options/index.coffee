{pull} = require '../common/helpers'

angular.module 'app', ['ngSanitize']

.factory 'storageService', ->
  require('../common/storage').storage

.constant 'optionsConfig',
  timeout: 800
  defaultRule:
    regexp: ''
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

    @restore()
