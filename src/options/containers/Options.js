import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Layout from '../components/Layout';
import RuleList from '../components/RuleList';
import TabOptions from '../components/TabOptions';
import OptionsButtons from '../components/OptionsButtons';
import * as OptionsActions from '../actions/Options';
import * as TabsActions from '../actions/Tabs';
import * as RulesActions from '../actions/Rules';
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
    <div>
      <h2>Output</h2>
      <textarea
        className="OptionsOutput"
        value={output}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
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
      <Layout>
        <h1>Options Page</h1>
        <RuleList
          {...rules}
          onModifyRegExpAt={rulesActions.modifyRegExpAt}
          onAdd={rulesActions.add}
          onRemoveAt={rulesActions.removeAt}
          onMoveToGroupById={rulesActions.moveToGroupById}
        />
        <TabOptions
          {...tabs}
          onTabsPerWindowChange={(event) => {
            tabsActions.updateTabsPerWindow(Number(event.target.value));
          }}
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
      </Layout>
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
