import HTML5Backend from 'react-dnd-html5-backend';
import React, { PropTypes } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import * as Background from 'ts-page-background';
import * as Options from 'ts-page-options';
import { Rules } from 'ts-container-rules';
import Layout from '../components/Layout';
import OptionsButtons from '../components/OptionsButtons';
import TabOptions from '../components/TabOptions';

const mapStateToProps = (state) => {
  return {
    options: Options.getOptions(state),
    tabs: Background.getTabs(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    optionsActions: bindActionCreators(Options.actions, dispatch),
    backgroundActions: bindActionCreators(Background.actions, dispatch),
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

export function Options({
  options,
  tabs,
  optionsActions,
  backgroundActions,
}) {
  return (
    <Layout>
      <h1>Options Page</h1>
      <Rules />
      <TabOptions
        {...tabs}
        onTabsPerWindowChange={(event) => {
          backgroundActions.updateTabsPerWindow(Number(event.target.value));
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

Options.propTypes = {
  options: PropTypes.object.isRequired,
  tabs: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Options);
