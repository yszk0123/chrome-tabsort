import React, { Component, PropTypes } from 'react'

const RuleListItem = ({
  item: { regexp, disable, isolate },
  onModifyAt,
  onToggleDisableAt,
  onToggleIsolateAt,
  onRemoveRuleAt
}) => {
  return (
    <li>
      <input type="text" value={regexp} onChange={(event) => onModifyAt(event.target.value)} />
      <input type="checkbox" checked={disable} onChange={onToggleDisableAt} />
      <input type="checkbox" checked={isolate} onChange={onToggleIsolateAt} />
      <input type="button" value="Remove" onClick={onRemoveRuleAt} />
    </li>
  )
}

export default class RuleList extends Component {
  render() {
    const {
      items,
      onModifyAt,
      onToggleDisableAt,
      onToggleIsolateAt,
      onAddRule,
      onRemoveRuleAt
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
                onModifyAt={(text) => onModifyAt(i, text)}
                onToggleDisableAt={() => onToggleDisableAt(i)}
                onToggleIsolateAt={() => onToggleIsolateAt(i)}
                onRemoveRuleAt={() => onRemoveRuleAt(i)}
              />
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
  onModifyAt: PropTypes.func.isRequired,
  onToggleDisableAt: PropTypes.func.isRequired,
  onToggleIsolateAt: PropTypes.func.isRequired,
  onAddRule: PropTypes.func.isRequired,
  onRemoveRuleAt: PropTypes.func.isRequired,
}
