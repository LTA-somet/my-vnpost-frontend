import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CellShape from './CellShape';
// import { getAlign } from '../../../../../ultis/utilities';

export default class ValueViewer extends PureComponent {
  render() {
    const { value, displayField, rowData } = this.props;
    const valueDisplay = (displayField && rowData[0].fullRowData[displayField]) || value;
    // const align = getAlign(valueDisplay);
    const align = this.props.cell.dataType == 'text' ? 'left' : 'right';
    return (
      <span className="value-viewer" style={{ textAlign: align }}>
        {valueDisplay}
      </span>
    );
  }
}

ValueViewer.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  cell: PropTypes.shape(CellShape),
  value: PropTypes.node.isRequired,
};
