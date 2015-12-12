import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import RuleList from '../components/RuleList';
import TabOptions from '../components/TabOptions';
import OptionsButtons from '../components/OptionsButtons';
import * as OptionsActions from '../actions/options';
import * as TabsActions from '../actions/tabs';
import * as RulesActions from '../actions/rules';
import rulesSelector from '../selectors/rules';

import '../styles/app.css';

const mapStateToProps = ({ options, rules, tabs }) => {
  return {
    options,
    rules: rulesSelector(rules),
    tabs
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    optionsActions: bindActionCreators(OptionsActions, dispatch),
    tabsActions: bindActionCreators(TabsActions, dispatch),
    rulesActions: bindActionCreators(RulesActions, dispatch)
  };
};

const OptionsOutput = ({ output, onChange }) => {
  return (
    <textarea
      className="OptionsOutput"
      value={output}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

export class Options extends Component {
  render() {
    const {
      options,
      rules,
      tabs,
      optionsActions,
      rulesActions,
      tabsActions
    } = this.props;

    return (
      <div>
        <h1>Options Page</h1>
        <TabOptions
          {...tabs}
          onTabsPerWindowChange={(event) => {
            tabsActions.updateTabsPerWindow(Number(event.target.value));
          }}
        />
        <RuleList
          {...rules}
          onModifyRegExpAt={rulesActions.modifyRegExpAt}
          onToggleDisableAt={rulesActions.toggleDisableAt}
          onToggleIsolateAt={rulesActions.toggleIsolateAt}
          onAdd={rulesActions.add}
          onRemoveAt={rulesActions.removeAt}
          onMoveToGroupById={rulesActions.moveToGroupById}
        />
        <OptionsOutput
          output={options.serializedState}
          onChange={optionsActions.updateSerializedState}
        />
        <OptionsButtons
          onLoad={optionsActions.load}
          onSave={optionsActions.save}
          onImport={() => optionsActions.deserialize(options.serializedState)}
          onExport={optionsActions.serialize}
        />
      </div>
    );
  }
}

Options.propTypes = {
  options: PropTypes.object.isRequired,
  rules: PropTypes.object.isRequired,
  tabs: PropTypes.object.isRequired
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  DragDropContext(HTML5Backend)
)(Options);
