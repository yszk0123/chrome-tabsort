import React, { Component, PropTypes } from 'react'

const RuleListItem = ({
  item: { regexp, disable, isolate },
  onRemoveRule
}) => {
  return (
    <li onClick={onRemoveRule}>{`${regexp} ${disable} ${isolate}`}</li>
  )
}

export default class RuleList extends Component {
  render() {
    const {
      items,
      onAddRule,
      onRemoveRule
    } = this.props

    return (
      <div>
        <label>Rules</label>
        <ul>
          {items.map((item, i) => {
            return (
              <RuleListItem
                key={i}
                item={item}
                onRemoveRule={() => onRemoveRule(i)} />
            )
          })}
        </ul>
        <div>
        <input type="button" value="Add Rule" onClick={onAddRule} />
        </div>
      </div>
    )
  }
}

RuleList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAddRule: PropTypes.func.isRequired,
  onRemoveRule: PropTypes.func.isRequired,
}
