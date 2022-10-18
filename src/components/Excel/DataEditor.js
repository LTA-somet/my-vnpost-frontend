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
        this.props.onChange(e.target.value);
    }

    render() {
        //const { value, onKeyDown } = this.props;
        const { cell } = this.props;
        return (
            <input
                ref={input => {
                    this._input = input;
                }}
                className="data-editor"
                value={this.props.value}
                onChange={this.handleChange}
                onKeyDown={this.props.onKeyDown}
                maxLength={cell.maxLength || (cell.dataType === 'number' ? 15 : 100)}
                type={cell.dataType || 'text'}
                max={cell.max || ''} 
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