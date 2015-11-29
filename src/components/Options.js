'use strict'
import React from 'react'
import FluxComponent from 'Flummox/component'
import { pull } from '../utils/utils'
import appState from '../utils/appState'
import OptionsConfig from '../constants/Options'

export default class Options {
  render() {
    return (
      <FluxComponent
        connectToStores={{
          options: flux.getStore('optionsStore')
        }}
        render={({groupPropsList}) =>
          <div>
            {groupPropsList.map((groupProps) =>
              <Group groupProps={groupProps}
                     optionsActions={optionsActions} />
            )}
          </div>
        }
      />
    )
  }
}

class Group extends React.Component {
  render() {
    const { name, tabsPerWindow } = this.props.groupProps

    return (
      <div>
        <div>名前: {name}</div>
        <div>ウィンドウ毎のタブ数: {tabsPerWindow}</div>
      </div>
    )
  }
}

export default class OptionsActions {
}

export default class Options extends React.Component {
  save() {
    appState.update({
      store: {
        tabsPerWindow: { $set: this.props.tabsPerWindow },
        rules: { $set: this.props.rules },
      },
      saved: { $set: true },
    })
    this.props.viewState.save()
    // this.context.cursors.groupPropsList.set(this.props.groupPropsList)
  }

  removeRule(rule) {
    appState.update({
      store: {
        rules: { $apply: (rules) => pull(this.props.rules, rule) }
      }
    })
  }

  restore() {
    this.props.update({
      tabsPerWindow: { $set: this.props.tabsPerWindow },
      rules: { $set: this.props.rules },
    })
  }

  addRules() {
    appState.update({
      store: {
        rules: { $push: assign({}, OptionsConfig.defaultRule) }
      }
    })
  }

  upRule(rule) {
    const rules = this.props.rules
    const i = findIndex(rules, rule)
    if (i >= 1) {
      swapInArray(rules, i, i - 1)
    }
    appState.update({
      $set: { rules }
    })
  }

  downRule(rule) {
    const rules = this.props.rules
    const i = findIndex(rules, rule)
    if (i >= 0 && i <= rules.length - 2) {
      swapInArray(rules, i, i + 1)
    }
    appState.update({
      $set: { rules }
    })
  }

  render() {
    return (
      <div>Hello</div>
    )
  }
}

function findIndex(array, element) {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] === element) {
      return i
    }
  }
  return -1
}

function swapInArray(array, i, j) {
  if (i === j) {
    return
  }
  if (i > j) {
    [j, i] = [i, j]
  }
  array.splice(i, 1, array[j])
  array.splice(j, 1, array[i])
  return array
}
