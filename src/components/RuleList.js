import React, { Component, PropTypes } from 'react'

const RuleListItem = ({ item: { regexp, disable, isolate } }) => {
  return (
    <li>{`${regexp} ${disable} ${isolate}`}</li>
  )
}

export default class RuleList extends Component {
  render() {
    const { items } = this.props

    return (
      <div>
        <label>Rules</label>
        <ul>
          {items.map((item, i) => {
            return (
              <RuleListItem
                key={i}
                item={item} />
            )
          })}
        </ul>
        <div>
        </div>
      </div>
    )
  }
}

RuleList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
}
