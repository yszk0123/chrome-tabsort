import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import RuleList from '../components/RuleList'
import TabOptions from '../components/TabOptions'
import OptionsButtons from '../components/OptionsButtons'
import * as OptionsActions from '../actions/options'
import * as TabsActions from '../actions/tabs'
import * as RulesActions from '../actions/rules'

import '../styles/app.css'

const mapStateToProps = ({ options, rules, tabs }) => {
  return {
    options,
    rules,
    tabs
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    optionsActions: bindActionCreators(OptionsActions, dispatch),
    tabsActions: bindActionCreators(TabsActions, dispatch),
    rulesActions: bindActionCreators(RulesActions, dispatch)
  }
}

export class Options extends Component {
  render() {
    const {
      options,
      rules,
      tabs,
      optionsActions,
      rulesActions,
      tabsActions
    } = this.props

    return (
      <div>
        <div>Options Page</div>
        <TabOptions
          {...tabs}
          onTabsPerWindowChange={(event) => {
            tabsActions.updateTabsPerWindow(Number(event.target.value))
          }}
        />
        <RuleList
          {...rules}
          onModifyRegExpAt={rulesActions.modifyRegExpAt}
          onToggleDisableAt={rulesActions.toggleDisableAt}
          onToggleIsolateAt={rulesActions.toggleIsolateAt}
          onMoveToPreviousAt={rulesActions.moveToPrevious}
          onMoveToNextAt={rulesActions.moveToNext}
          onAdd={rulesActions.add}
          onRemoveAt={rulesActions.removeAt}
        />
        <OptionsButtons
          onLoad={optionsActions.load}
          onSave={optionsActions.save}
        />
      </div>
    )
  }
}

Options.propTypes = {
  options: PropTypes.object.isRequired,
  rules: PropTypes.object.isRequired,
  tabs: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Options)
