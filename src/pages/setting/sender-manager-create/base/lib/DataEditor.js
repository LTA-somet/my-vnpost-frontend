import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CellShape from './CellShape';

export default class DataEditor extends PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this._input.focus();
    }

    handleChange(e) {
        if (this.props.cell.dataType === 'checkbox') {
            this.props.onChange(e.target.checked);
        } else {
            this.props.onChange(e.target.value);
        }
    }

    render() {
        const { value, onKeyDown, cell } = this.props;
        //console.log('cell', cell)
        const defaultChecked = cell.dataType === 'checkbox' && value == 1;
        return (
            <input
                ref={input => {
                    this._input = input;
                }}
                className="data-editor"
                value={value}
                onChange={this.handleChange}
                onKeyDown={onKeyDown}
                maxLength={cell.maxLength || (cell.dataType === 'number' ? 15 : 100)}
                type={cell.dataType || 'text'}
                max={cell.max || ''}
                checked={defaultChecked}
            />
        );
    }
}

DataEditor.propTypes = {
    value: PropTypes.node.isRequired,
    row: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
    cell: PropTypes.shape(CellShape),
    onChange: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    onRevert: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
};