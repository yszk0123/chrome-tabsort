import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import RuleList from '../components/RuleList'
import TabOptions from '../components/TabOptions'
import * as TabsActions from '../actions/tabs'
import * as RulesActions from '../actions/rules'

const mapStateToProps = ({ rules, tabs }) => {
  return {
    rules,
    tabs
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    tabsActions: bindActionCreators(TabsActions, dispatch),
    rulesActions: bindActionCreators(RulesActions, dispatch)
  }
}

export class Options extends Component {
  render() {
    const { rules, tabs, rulesActions, tabsActions } = this.props

    return (
      <div>
        <div>Options Page</div>
        <RuleList {...rules} rulesActions={RulesActions} />
        <TabOptions {...tabs} tabsActions={TabsActions} />
      </div>
    )
  }
}

Options.propTypes = {
  rules: PropTypes.object.isRequired,
  tabs: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Options)
