import React, { Component, PropTypes } from 'react'

import RuleList from '../components/RuleList'

const mapStateToProps = (state) = {
  return {
  }
}

const mapDispatchToProps = (dispatch) = {
  return {
  }
}

export class Options extends Component {
  render() {
    const { items } = this.props

    return (
      <div>
        <div>Options Page</div>
        <RuleList items={items} />
      </div>
    )
  }
}

Options.propTypes = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Options)
