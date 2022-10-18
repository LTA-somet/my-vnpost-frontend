import React, { Component } from 'react';
import DataSheet from './lib';
import './lib/react-datasheet.css';
import { Checkbox, Button, Popconfirm } from 'antd';
import { Tooltip } from 'antd';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';

import PicturesWall from '../PicturesWall';
import '../styles.css';

const headerBgColors = '#F5F5F5';
const rowBgColors = '#fff';
export const STATUS_EDITED = '**';
export const STATUS_ADDNEW = '*';
export const STATUS_UNCHANGED = ' ';
export const STATUS_DELETED = '-';
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
    checkBoxAll,
    onChangeCheckBoxAll,
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
          <Cell
            className="action-cell cell center title"
            style={{ width: 30, fontWeight: 500, background: '#fff3d8' }}
          >
            {!props.isViewOnly && (
              <Button className="btn-outline-info" size="small" onClick={(e) => onAddNewRow(e)}>
                <PlusCircleOutlined />
              </Button>
              // <div
              //   className="btn-action"
              //   style={{ color: 'black' }}
              //   onClick={(e) => onAddNewRow(e)}
              // >
              //   {' '}
              //   +{' '}
              // </div>
            )}
          </Cell>
          <Cell
            className="action-cell cell center title"
            style={{ width: 30, fontWeight: 500, background: '#fff3d8' }}
          >
            {!props.isViewOnly && (
              <Checkbox
                checked={checkBoxAll()}
                // disabled={this.state.disabled}
                onChange={(e) => onChangeCheckBoxAll(e)}
              >
                {/* {JSON.stringify(props.dataSource)} */}
              </Checkbox>
            )}
          </Cell>
          <Cell
            className="action-cell cell center title"
            style={{ width: 30, fontWeight: 500, background: '#fff3d8' }}
          />
          {visibleColumns.map((column, i) => (
            <Cell
              className="cell center title"
              width={column.width}
              style={{
                // color: 'black',
                width: column.width,
                fontWeight: 500,
                background: '#fff3d8',
                color: '#004588',
              }}
              key={column.label}
            >
              {column.label}
            </Cell>
          ))}
          <Cell
            className="cell center title"
            width={104}
            style={{
              color: 'black',
              width: 104,
              fontWeight: 500,
              background: '#fff3d8',
              color: '#004588',
            }}
            // key={column.label}
          >
            Hình ảnh
          </Cell>
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
    onCheckBoxRow,
    showLevel,
    selectedRowKeys,
    onSelectedRow,
    onUpLoadImage,
    onChangeCheckBoxAll,
    slectedImages,
    onSelecteImage,
  } = props;

  const editStyle = {
    background: rowBgColors,
    fontWeight: 'normal',
    // fontStyle: returnFontStyle(fontStyle),
    fontFamily: 'Arial',
  };
  const disabledStyle = {
    background: 'whitesmoke',
    color: '#999',
    fontWeight: 'normal',
    // fontStyle: returnFontStyle(fontStyle),
    fontFamily: 'Arial',
  };

  const newStyle = {
    background: '#EDF4FC',
    // background: 'whitesmoke',
    // color: '#999',
    fontWeight: 'normal',
    // fontStyle: returnFontStyle(fontStyle),
    fontFamily: 'Arial',
  };

  return (
    <React.Fragment>
      <Tag
        className={className}
        // style={isDataEmpty(props.rowData[0].fullRowData) ? {} : props.rowData[0].fullRowData.isParent == 0 ? parentStyle : childStyle}
        style={
          props.rowData[0].fullRowData
            ? props.rowData[0].fullRowData.isOwner == true
              ? editStyle
              : props.rowData[0].fullRowData?.productId
              ? disabledStyle
              : newStyle
            : {}
        }
        // style={parentStyle}
      >
        <Cell className="action-cell cell center" style={{}}>
          {!props.isViewOnly && (
            // <Button
            //   className="btn-action"
            //   style={{ color: 'black', border : 'none' }}
            //   onClick={(e) => onDeleteRow(row)}
            //   disabled = {props?.rowData[0]?.fullRowData?.isOwner == false ? true : false}
            // >
            //   <DeleteOutlined />
            // </Button>

            <Popconfirm
              title="Bạn chắc chắn muốn xóa?"
              onConfirm={(e) => onDeleteRow(row)}
              okText="Đồng ý"
              cancelText="Hủy bỏ"
              disabled={props?.rowData[0]?.fullRowData?.isOwner == false ? true : false}
            >
              {/* <Button
                className="btn-action"
                style={{ color: 'black', border: 'none' }}
                disabled={props?.rowData[0]?.fullRowData?.isOwner == false ? true : false}
              >
                <DeleteOutlined />
              </Button> */}
              <Button
                className="btn-outline-danger"
                size="small"
                disabled={props?.rowData[0]?.fullRowData?.isOwner == false ? true : false}
              >
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          )}
        </Cell>

        {!props.isViewOnly && (
          <Cell className="action-cell cell center" style={{ color: '#120B03' }}>
            <Checkbox
              checked={rowData[0]?.dataEditorParams?.stepDetail?.checkbox}
              disabled={props?.rowData[0]?.fullRowData?.isOwner == false ? true : false}
              onChange={(e) =>
                onSelectedRow(
                  rowData[0]?.dataEditorParams?.stepDetail?.stepDetailId,
                  e.target.checked,
                )
              }
            />
            {/* {JSON.stringify(props.rowData[0].fullRowData)} */}
          </Cell>
        )}
        {!props.isViewOnly && (
          <Cell className="action-cell cell center">
            <Tooltip title={rowData[0]?.dataEditorParams?.stepDetail?.log}>
              <Cell
                className="action-cell cell center"
                style={
                  rowData[0]?.dataEditorParams?.stepDetail?.check == false
                    ? { background: 'red', width: '40px', border: 'none', color: '#FDB71F' }
                    : { background: 'none', width: '40px', border: 'none', color: '#FDB71F' }
                }
              >
                {rowData[0]?.dataEditorParams?.stepDetail?.status}
                {/* {JSON.stringify(rowData[0]?.dataEditorParams?.stepDetail)} */}
              </Cell>
            </Tooltip>
          </Cell>
        )}

        {props.children}
        {!props.isViewOnly && (
          <Cell className="action-cell cell center" style={{ color: 'red' }}>
            {/* {JSON.stringify(rowData[0]?.dataEditorParams?.stepDetail?.nameVi)} */}
            <PicturesWall
              style={{ background: '#F5F5F5' }}
              upLoadImage={onUpLoadImage}
              rowData={rowData[0]?.dataEditorParams?.stepDetail}
              // rowData = {props.rowData[0].fullRowData}
            />
          </Cell>
        )}
      </Tag>
      {stepIndex + 1 <= showLevel && (
        <Tag>
          <Cell className="action-cell cell" style={{ background: headerBgColors }} />
          <Cell className="action-cell cell" style={{ background: headerBgColors }} />
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

class NestedTable2 extends Component {
  constructor(props) {
    super(props);
    this.handleSelectAllChanged = this.handleSelectAllChanged.bind(this);
    this.handleSelectChanged = this.handleSelectChanged.bind(this);
    this.handleCellsChanged = this.handleCellsChanged.bind(this);

    this.sheetRenderer = this.sheetRenderer.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.cellRenderer = this.cellRenderer.bind(this);

    this.handleAddNewRow = this.handleAddNewRow.bind(this);
    this.handleCheckBoxAll = this.handleCheckBoxAll.bind(this);
    this.handleChangeCheckBoxAll = this.handleChangeCheckBoxAll.bind(this);
    this.handleDeleteRow = this.handleDeleteRow.bind(this);
    this.handleCheckBoxRow = this.handleCheckBoxRow.bind(this);

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
          align: c.align,
          readOnly: c.readOnly || props.isViewOnly,
          displayField: c.displayFieldName,
          oldValue: value,
          status: d.status,
          dataEditor: EditorTag,
          dataEditorParams: {
            fieldName: c.fieldName,
            value: d[c.fieldName],
            stepDetail: d,
          },
          // visible: expenseType.value == 2 && c.fieldName === 'soUoc' ? 'invisible-column' : 'visible-column',
          visible: 'invisible-column',
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
        status: STATUS_ADDNEW,
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
      checkbox: false,
      image: '',
    };

    selections[selections.length] = false;

    this.props.onRowChange(grid[newRow]);
    this.setState({ grid, selections });
  }

  handleCheckBoxAll = () => {
    let check = true;
    const dataSourceNew = [...this.props.dataSource];
    if (dataSourceNew.length > 0) {
      dataSourceNew.forEach((e) => {
        if (e.isOwner != false && (e.checkbox == false || e.checkbox == undefined)) {
          check = false;
          return false;
        }
      });
    } else {
      return false;
    }
    return check;
  };

  handleChangeCheckBoxAll = () => {
    let checked = this.handleCheckBoxAll();
    console.log('is checked all : ', checked);
    const dataSourceNew = [...this.props.dataSource];
    dataSourceNew.forEach((e) => {
      if (e.isOwner != false) {
        e.checkbox = !checked;
      }
      // e.checkbox = !checked;
    });
    this.props.setDataSource(dataSourceNew);
  };

  handleDeleteRow(row) {
    if (row !== undefined && row !== null) {
      const grid = [...this.state.grid];
      this.props.onRowDelete(grid[row][0].stepDetailId);
    }
  }

  handleCheckBoxRow(row) {
    if (row !== undefined && row !== null) {
      const grid = [...this.state.grid];
      this.props.onRowCheckBox(grid[row][0].stepDetailId);
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
        console.log('grid[row][0]', grid[row][0]);
        const rowStatus =
          grid[row][0].status == undefined && grid[row][0]?.fullRowData?.productId
            ? STATUS_EDITED
            : grid[row][0].status || STATUS_ADDNEW;
        grid[row][0] = { ...grid[row][0], status: rowStatus };
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
            status: STATUS_ADDNEW,
            readOnly: c.readOnly,
            dataEditor: c.editorTag,
            dataEditorParams: {
              fieldName: c.fieldName,
              value: c.defaultValue,
              visible: true,
            },
            valueViewer: c.valueViewer,
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
    const { columns, selections, stepIndex, dataSource } = this.state;

    return (
      <SheetRenderer
        stepIndex={stepIndex}
        columns={columns}
        selections={selections}
        onSelectAllChanged={this.handleSelectAllChanged}
        onAddNewRow={this.handleAddNewRow}
        checkBoxAll={this.handleCheckBoxAll}
        onChangeCheckBoxAll={this.handleChangeCheckBoxAll}
        dataSource={this.props.dataSource}
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

  onSelectedRow = (key, checked) => {
    // const newSelectedRowKey = [...this.props.selectedRowKeys];
    // console.log("newSelectedRowKey", newSelectedRowKey);
    // console.log("key", key);
    // const index = newSelectedRowKey.findIndex(s => s === key);
    // if(index > 0) {
    //   newSelectedRowKey.splice(index, 1)
    // } else {
    //   newSelectedRowKey.push(key);
    // }
    // this.props.setSelectedRowKeys(newSelectedRowKey)
    const dataSourceNew = [...this.props.dataSource];
    const index = dataSourceNew.findIndex((s) => s.stepDetailId === key);
    console.log('key', key);
    if (index >= 0) {
      console.log('dataSourceNew[index].checkbox', dataSourceNew[index].checkbox);
      dataSourceNew[index].checkbox = !dataSourceNew[index].checkbox;
    }
    console.log('dataSourceNew', dataSourceNew);
    this.props.setDataSource(dataSourceNew);
  };

  onUpLoadImage = (data) => {
    // const grid = this.state.grid;
    // console.log("grid: ", grid);
    // console.log("data image", data);
    // const newselectedImage = [...this.props.slectedImages];
    // newselectedImage.push(data);
    // this.props.setSelectedImage(newselectedImage);
    // console.log("newselectedImage", this.props.slectedImages);
    const dataSourceNew = [...this.props.dataSource];
    const index = dataSourceNew.findIndex((s) => s.stepDetailId === data.key);
    if (index >= 0) {
      dataSourceNew[index].image = data.image;
    }
    this.props.setDataSource(dataSourceNew);
  };

  rowRenderer(props) {
    const { columns, selections, grid } = this.state;
    return (
      <RowRenderer
        stepDetails={this.props.stepDetails}
        dataSource={this.props.dataSource}
        onRowChange={this.props.onRowChange}
        as="tr"
        cellAs="td"
        onDeleteRow={this.handleDeleteRow}
        onRowDelete={this.props.onRowDelete}
        onCheckBoxRow={this.handleCheckBoxRow}
        onRowCheckBox={this.props.onRowCheckBox}
        selected={selections[props.row]}
        rowData={grid[props.row]}
        columns={columns}
        onSelectChanged={this.handleSelectChanged}
        className="data-row"
        isViewOnly={this.props.isViewOnly}
        selectedRowKeys={this.props.selectedRowKeys}
        onSelectedRow={this.onSelectedRow}
        slectedImages={this.props.slectedImages}
        onUpLoadImage={this.onUpLoadImage}
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
          arrData={this.props.arrData}
        />
      </div>
    );
  }
}

export default NestedTable2;
