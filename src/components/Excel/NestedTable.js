import React, { Component } from 'react';
import DataSheet from '../../components/Excel/DataSheet';
import '../../components/Excel/react-datasheet.css';

const headerBgColors = '#b3d4fc';
const rowBgColors = '#fff';

const SheetRenderer = (props) => {
  const {
    as: Tag,
    headerAs: Header,
    bodyAs: Body,
    rowAs: Row,
    cellAs: Cell,
    className,
    columns,
    selections,
    onSelectAllChanged,
    onAddNewRow,
    stepIndex,
    calcSteps,
  } = props;

  const visibleColumns = columns;
  let tableWidth = 30 + 30 + 30;
  visibleColumns.forEach((c) => {
    tableWidth = tableWidth + c.width || 0;
  });

  return (
    <Tag className={className}>
      <Header style={{ fontWeight: 'normal' }}>
        <Row style={{ height: 20, background: headerBgColors }}>
          <Cell className="action-cell cell center title" style={{ width: 30 }}>
            {!props.isViewOnly && (
              <div
                className="btn-action"
                style={{ color: 'black' }}
                onClick={(e) => onAddNewRow(e)}
              >
                {' '}
                +{' '}
              </div>
            )}
          </Cell>
          {visibleColumns.map((column, i) => (
            <Cell
              className="cell center title"
              width={column.width}
              style={{ color: 'black', width: column.width }}
              key={column.label}
            >
              {column.label}
            </Cell>
          ))}
        </Row>
      </Header>
      <Body className="data-body">{props.children}</Body>
    </Tag>
    // </div>
  );
};

const RowRenderer = (props) => {
  const {
    as: Tag,
    cellAs: Cell,
    className,
    row,
    selected,
    onSelectChanged,
    stepIndex,
    columns,
    rowData,
    onDeleteRow,
    showLevel,
  } = props;
  return (
    <React.Fragment>
      <Tag className={className} style={{ background: rowBgColors }}>
        <Cell className="action-cell cell center" style={{ background: headerBgColors }}>
          {
            //for debug
            //rowData[0].stepDetailId
          }
          {!props.isViewOnly && (
            <div
              className="btn-action"
              style={{ color: 'black' }}
              onClick={(e) => onDeleteRow(row)}
            >
              {' '}
              -{' '}
            </div>
          )}
        </Cell>
        {props.children}
      </Tag>
      {stepIndex + 1 <= showLevel && (
        <Tag>
          <Cell className="action-cell cell" style={{ background: headerBgColors }}></Cell>
          <Cell className="action-cell cell" style={{ background: headerBgColors }}></Cell>
        </Tag>
      )}
    </React.Fragment>
  );
};

const CellRenderer = (props) => {
  let {
    as: Tag,
    cell,
    row,
    col,
    columns,
    attributesRenderer,
    selected,
    editing,
    updated,
    style,
    ...rest
  } = props;

  // hey, how about some custom attributes on our cell?
  const attributes = cell.attributes || {};
  // ignore default style handed to us by the component and roll our own
  attributes.style = { width: columns[col].width };
  if (col === 0) {
    attributes.title = cell.label;
  }
  return (
    <Tag {...rest} {...attributes}>
      {props.children}
    </Tag>
  );
};

class NestedTable extends Component {
  constructor(props) {
    super(props);
    this.handleSelectAllChanged = this.handleSelectAllChanged.bind(this);
    this.handleSelectChanged = this.handleSelectChanged.bind(this);
    this.handleCellsChanged = this.handleCellsChanged.bind(this);

    this.sheetRenderer = this.sheetRenderer.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.cellRenderer = this.cellRenderer.bind(this);

    this.handleAddNewRow = this.handleAddNewRow.bind(this);
    this.handleDeleteRow = this.handleDeleteRow.bind(this);

    this.loadGridData = this.loadGridData.bind(this);

    const grid = this.loadGridData(this.props);
    let columnIndexes = {};

    const Columns = this.props.columns;

    Columns.forEach((c, i) => {
      columnIndexes[c.fieldName] = i;
    });

    this.state = {
      as: 'table',
      columns: Columns,
      columnIndexes: columnIndexes,
      grid: grid,
      selections: grid.map((ticked) => false),
      editing: {},
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stepDetails !== this.props.stepDetails) {
      const grid = this.loadGridData(this.props);
      this.setState({
        grid: grid,
        selections: grid.map((ticked) => false),
      });
    }
  }

  loadGridData = (props) => {
    const stepDetails = props.stepDetails;

    const grid = stepDetails.map((d) => {
      return this.props.columns.map((c, i) => {
        const EditorTag = c.editorTag;

        const value = d[c.fieldName];
        let retval = {
          fieldName: c.fieldName,
          dataType: c.dataType,
          maxLength: c.maxLength,
          max: c.max,
          value: value,
          valueViewer: c.valueViewer,
          dataEditor: c.dataEditor,
          align: c.align,
          readOnly: c.readOnly || props.isViewOnly,
          displayField: c.displayFieldName,
          oldValue: value,
          dataEditor: EditorTag,
          dataEditorParams: {
            fieldName: c.fieldName,
            value: d[c.fieldName],
            stepDetail: d,
          },
        };

        if (i == 0) {
          //first cell of row contains row attributes:
          retval = {
            ...retval,
            stepDetailId: d.stepDetailId,
            fullRowData: { ...d },
            error: d.error,
          };
        }

        return retval;
      });
    });
    return grid;
  };

  handleAddNewRow(e) {
    const grid = this.state.grid; // {...this.state.grid};
    const selections = [...this.state.selections];
    const newRow = grid.length;

    grid[newRow] = this.props.columns.map((c) => {
      return {
        fieldName: c.fieldName,
        dataType: c.dataType,
        displayField: c.displayFieldName,
        dataEditor: c.editorTag,
        value: c.defaultValue || '',
        valueViewer: c.valueViewer,
        dataEditor: c.dataEditor,
        align: c.align,
        readOnly: c.readOnly,
        dataEditorParams: {
          fieldName: c.fieldName,
          value: '',
          visible: true,
        },
      };
    });

    // set id
    let minId = -1;
    if (this.props.stepDetails.length > 0) {
      minId = Math.min.apply(
        Math,
        this.props.stepDetails.map((o) => o.stepDetailId),
      );
      minId--;
    }

    grid[newRow][0] = {
      ...grid[newRow][0],
      stepDetailId: minId,
    };

    selections[selections.length] = false;

    this.props.onRowChange(grid[newRow]);
    this.setState({ grid, selections });
  }

  handleDeleteRow(row) {
    if (row !== undefined && row !== null) {
      const grid = [...this.state.grid];
      this.props.onRowDelete(grid[row][0].stepDetailId);
    }
  }

  handleSelectAllChanged(selected) {
    const selections = this.state.selections.map((s) => selected);
    this.setState({ selections });
  }

  handleSelectChanged(index, selected) {
    const selections = [...this.state.selections];
    selections[index] = selected;
    this.setState({ selections });
  }

  handleCellsChanged(changes, additions) {
    if (this.props.isViewOnly) {
      return;
    }
    const grid = this.state.grid;
    const visibleColumns = this.props.columns;
    let minId = 0;
    if (this.props.stepDetails.length > 0) {
      minId = Math.min.apply(
        Math,
        this.props.stepDetails.map((o) => o.stepDetailId),
      );
    }
    changes.forEach(({ cell, row, col, value }) => {
      if (grid[row][col].value != value) {
        //new value != old value
        grid[row][col] = { ...grid[row][col], value };
        this.props.onRowChange(grid[row]);
      }
    });

    // paste extended beyond end, so add a new row
    additions &&
      additions.forEach(({ cell, row, col, value }, k) => {
        if (k === additions.length - 1 && value === '') {
          // fix lỗi trong trường hợp paste từ excel vào sẽ bị thêm 1 dòng trống ở cuối
          return;
        }
        minId--;
        if (!grid[row]) {
          //add new row
          grid[row] = visibleColumns.map((c) => ({
            fieldName: c.fieldName,
            value: c.defaultValue,
            align: c.align,
            stepDetailId: minId,
            readOnly: c.readOnly,
            dataEditor: c.editorTag,
            dataEditorParams: {
              fieldName: c.fieldName,
              value: c.defaultValue,
              visible: true,
            },
            valueViewer: c.valueViewer,
            dataEditor: c.dataEditor,
          }));
        }
        if (grid[row][col]) {
          //new col
          grid[row][col] = { ...grid[row][col], value };
        }
      });

    this.props.onFullRowChange(grid);
    const selections = grid.map((r) => false);

    this.setState({ grid, selections });
  }

  sheetRenderer(props) {
    const { columns, selections, stepIndex } = this.state;

    return (
      <SheetRenderer
        stepIndex={stepIndex}
        columns={columns}
        selections={selections}
        onSelectAllChanged={this.handleSelectAllChanged}
        onAddNewRow={this.handleAddNewRow}
        as="table"
        headerAs="thead"
        bodyAs="tbody"
        rowAs="tr"
        cellAs="td"
        isViewOnly={this.props.isViewOnly}
        {...props}
      />
    );
  }

  rowRenderer(props) {
    const { columns, selections, grid } = this.state;
    return (
      <RowRenderer
        stepDetails={this.props.stepDetails}
        onRowChange={this.props.onRowChange}
        as="tr"
        cellAs="td"
        onDeleteRow={this.handleDeleteRow}
        onRowDelete={this.props.onRowDelete}
        selected={selections[props.row]}
        rowData={grid[props.row]}
        columns={columns}
        onSelectChanged={this.handleSelectChanged}
        className="data-row"
        isViewOnly={this.props.isViewOnly}
        {...props}
      />
    );
  }

  cellRenderer(props) {
    return <CellRenderer as="td" columns={this.props.columns} {...props} />;
  }

  render() {
    return (
      <div>
        <DataSheet
          data={this.state.grid}
          className="custom-sheet"
          sheetRenderer={this.sheetRenderer}
          editing={this.state.editing}
          rowRenderer={this.rowRenderer}
          cellRenderer={this.cellRenderer}
          onCellsChanged={this.handleCellsChanged}
          valueRenderer={(cell) => cell && cell.value}
          horizontalScroll={true}
        />
      </div>
    );
  }
}

export default NestedTable;
