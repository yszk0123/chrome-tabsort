import React, { Component, PropTypes } from 'react'

const RuleListItem = ({
  item: { regexp, disable, isolate },
  onModifyRegExpAt,
  onToggleDisableAt,
  onToggleIsolateAt,
  onRemoveAt
}) => {
  return (
    <li>
      <input type="text" value={regexp} onChange={(event) => onModifyRegExpAt(event.target.value)} />
      <input type="checkbox" checked={disable} onChange={onToggleDisableAt} />
      <input type="checkbox" checked={isolate} onChange={onToggleIsolateAt} />
      <input type="button" value="Remove" onClick={onRemoveAt} />
    </li>
  )
}

export default class RuleList extends Component {
  render() {
    const {
      items,
      onModifyRegExpAt,
      onToggleDisableAt,
      onToggleIsolateAt,
      onAdd,
      onRemoveAt
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
                onModifyRegExpAt={(text) => onModifyRegExpAt(i, text)}
                onToggleDisableAt={() => onToggleDisableAt(i)}
                onToggleIsolateAt={() => onToggleIsolateAt(i)}
                onRemoveAt={() => onRemoveAt(i)}
              />
            )
          })}
        </ul>
        <div>
        <input type="button" value="Add Rule" onClick={onAdd} />
        </div>
      </div>
    )
  }
}

RuleList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onModifyRegExpAt: PropTypes.func.isRequired,
  onToggleDisableAt: PropTypes.func.isRequired,
  onToggleIsolateAt: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemoveAt: PropTypes.func.isRequired,
}
