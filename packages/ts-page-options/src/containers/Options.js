import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Background from 'ts-page-background';
import * as OptionsPage from 'ts-page-options';
import { Rules } from 'ts-container-rules';
import Layout from '../components/Layout';
import OptionsButtons from '../components/OptionsButtons';
import TabOptions from '../components/TabOptions';

function mapStateToProps(state) {
  return {
    options: OptionsPage.getOptions(state),
    tabs: Background.getTabs(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    optionsActions: bindActionCreators(OptionsPage.actions, dispatch),
    backgroundActions: bindActionCreators(Background.actions, dispatch),
  };
}

function OptionsOutput({ output, onChange }) {
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
}

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
