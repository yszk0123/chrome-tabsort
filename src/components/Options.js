import React from 'react';
import { connect } from 'react-redux';

import Group from '../components/Group';

export class Options {
  render() {
    const { groupPropsList } = this.props;

    return (
      <div>
        {groupPropsList.map((groupProps) => <Group {...groupProps} />)}
      </div>
    );
  }
}

Options.propTypes = {
  groupPropsList: PropTypes.array.isRequired,
};

export default connect((state) => {}, {}, Options);
