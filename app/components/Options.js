'use strict';
const React from 'react';
const {pull} from '../lib/helpers';
const appState from '../lib/appState';
const optionsConfig = {
  timeout: 800,
  defaultRule: {
    regexp: '',
    disable: false,
    isolate: false
  }
};

export default class Options extends React.Components {
  save() {
    appState.update({
      store: {
        tabsPerWindow: { $set: this.props.tabsPerWindow },
        rules: { $set: this.props.rules },
      },
      saved: { $set: true },
    });

    $timeout (=> @saved = false), optionsConfig.timeout
  }

  removeRule(rule) {
    appState.update({
      store: {
        rules: { $apply: (rules) => pull(this.props.rules, rule) }
      }
    });
  }

  restore() {
    appState.update({
      store: {
        tabsPerWindow: { $set: this.props.tabsPerWindow },
        rules: { $set: this.props.rules },
      }
    });
  }

  addRules() {
    appState.update({
      store: {
        rules: { $push: assign({}, optionsConfig.defaultRule) }
      }
    });
  }

  upRule(rule) {
    const rules = this.props.rules;
    const i = findIndex(rules, rule);
    return unless i isnt -1 and i >= 1
    if (i >= 1) {
      swapInArray(rules, i, i - 1);
    }
  }

  downRule(rule) {
    const rules = this.props.rules;
    const i = findIndex(rules, rule);
    if (i >= 0 && i <= rules.length - 2) {
      swapInArray(rules, i, i + 1);
    }
  }
}

function findIndex(array, element) {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] === element) {
      return i;
    }
  }
  return -1;
}

function swapInArray(array, i, j) {
  if (i === j) {
    return;
  }
  if (i > j) {
    [j, i] = [i, j];
  }
  array.splice(i, 1, array[j]);
  array.splice(j, 1, array[i]);
  return array;
}
