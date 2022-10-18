import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CellShape from './CellShape';

export default class ValueViewer extends PureComponent {
  render() {
    //const { value, displayField, rowData, cell, row, col, tableId} = this.props;
    // const align = isNaN(this.props.value) ? 'left' : 'right';
    // return (
    //     <span className="value-viewer" style={{ textAlign: align }}>{this.props.value}</span>
    // );

    const align = this.props.cell.dataType == 'text' ? 'left' : 'right';
    if (this.props.cell.dataType == 'number') {
      return (
        <span className="value-viewer" style={{ textAlign: align }}>
          {/*<NumberFormat
                        value={this.props.value}
                        displayType={this.props.cell.dataType}
                        thousandSeparator="."
                        decimalSeparator=","
                    />*/}
          {this.props.value
            ? Intl.NumberFormat('de-DE').format(Math.trunc(parseInt(this.props.value.toString().replace('-', ''))))
            : null}
          {/* {Intl.NumberFormat('de-DE').format(Math.trunc(this.props.value))} */}
        </span>
      );
    } else {
      return (
        <span className="value-viewer" style={{ textAlign: align }}>
          {this.props.value}
        </span>
      );
    }
  }
}

ValueViewer.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  cell: PropTypes.shape(CellShape),
  value: PropTypes.node.isRequired,
};
