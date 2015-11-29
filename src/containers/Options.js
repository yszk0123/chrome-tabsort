import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import RuleList from '../components/RuleList'
import TabOptions from '../components/TabOptions'

const mapStateToProps = ({ rules, tabs }) => {
  return {
    rules,
    tabs
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export class Options extends Component {
  render() {
    const { rules, tabs } = this.props

    return (
      <div>
        <div>Options Page</div>
        <RuleList {...rules} />
        <TabOptions {...tabs} />
      </div>
    )
  }
}

Options.propTypes = {
  rules: PropTypes.object.isRequired,
  tabs: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Options)
