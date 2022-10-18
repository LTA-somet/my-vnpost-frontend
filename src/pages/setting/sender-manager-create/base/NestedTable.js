import { DeleteOutlined, PlusOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { PureComponent } from 'react';
import DataSheet from './lib/DataSheet';
//import DataSheet from 'react-datasheet';
import './lib/react-datasheet.css';
// import { guidGenerator, isNullOrEmpty } from '../../../../ultis/utilities';

//import './override-everything.css'
const headerBgColors = [
  'rgb(78	114	190)',
  'rgb(126	170	85)',
  'rgb(185	212	248)',
  'rgb(126	170	85)',
  'rgb(25	69	131)',
  'rgb(242	185	71)',
];
const rowBgColors = [
  'rgb(193	214	236)',
  'rgb(177	206	148)',
  'rgb(177	206	148)',
  '#E0FFFF',
  '#E0FFFF',
  '#87CEFA',
  '#FFE4E1',
  '#FFE4B5',
  '#87CEEB',
];

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
    stepIndex,
    calcSteps,
  } = props;

  const isLastStep = calcSteps && stepIndex == calcSteps.length - 1;
  const visibleColumns = columns.filter((c) => (!c.lastStepOnly || isLastStep) && !c.hidden);
  let tableWidth = 30 + 30 + 30;
  visibleColumns.forEach((c) => {
    tableWidth = tableWidth + c.width || 0;
  });

  return (
    <Tag className={className} style={{ minWidth: '100%', width: tableWidth }}>
      <Header style={{ fontWeight: 'normal' }}>
        <Row style={{ height: 20, background: headerBgColors[stepIndex] }}>
          <Cell className="action-cell cell center">
            <div
              className="btn-action"
              style={{ color: headerBgColors[stepIndex] }}
              onClick={(e) => props.onExpend()}
            >
              {props.expend ? <DownOutlined /> : <RightOutlined />}
            </div>
          </Cell>
          <Cell className="action-cell cell" />
          <Cell className="cell left" colSpan={visibleColumns.length}>
            <label style={{ color: 'white', padding: '2px 5px' }}>
              {calcSteps[stepIndex].stepName}
            </label>
          </Cell>
        </Row>
        {props.expend && (
          <Row style={{ height: 20, background: headerBgColors[stepIndex] }}>
            <Cell className="action-cell cell center">
              {!props.isViewOnly && (
                <Tooltip title="Thêm dòng">
                  <div
                    className="btn-action"
                    style={{ color: headerBgColors[stepIndex] }}
                    onClick={(e) => onAddNewRow(e)}
                  >
                    <PlusOutlined />
                  </div>
                </Tooltip>
              )}
            </Cell>

            <Cell className="cell" width="20" />
            {visibleColumns.map((column, i) => (
              <Cell
                className="cell center"
                width={column.width}
                style={{ color: 'white' }} //{{ color: headerBgColors[stepIndex], filter: 'invert(100%)' }}
                key={column.label}
              >
                {column.label}
              </Cell>
            ))}
          </Row>
        )}
      </Header>
      {props.expend && <Body className="data-body">{props.children}</Body>}
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
    calcSteps,
    stepIndex,
    columns,
    rowData,
    onDeleteRow,
    showLevel,
  } = props;

  const isLastStep = calcSteps && stepIndex == calcSteps.length - 1;
  const NextTag = !isLastStep && calcSteps[stepIndex + 1].feeClass;
  const visibleColumns = columns.filter((c) => (!c.lastStepOnly || isLastStep) && !c.hidden);

  const backGroundColor = rowData[0].error ? 'red' : headerBgColors[stepIndex];
  const applyByRow = rowData.find((i) => i.fieldName === 'applyBy');
  const isShowChildren = !applyByRow || applyByRow.value != 1;
  return (
    <React.Fragment>
      <Tag className={className} style={{ background: rowBgColors[stepIndex] }}>
        <Cell className="action-cell cell center" style={{ background: headerBgColors[stepIndex] }}>
          {
            //for debug
            //<span style={{ fontSize: '8px'}} >{rowData[0].calcStepId || 'x'} <br/> {rowData[0].parentStepDetailId || 'x'} <br/> {rowData[0].stepDetailId}</span>
          }
          {!props.isViewOnly && (
            <Tooltip title="Xóa dòng">
              <div
                className="btn-action"
                style={{ color: headerBgColors[stepIndex] }}
                onClick={(e) => onDeleteRow(row)}
              >
                <DeleteOutlined />
              </div>
            </Tooltip>
          )}
        </Cell>
        <Tooltip title={rowData[0].error}>
          <Cell className="action-cell cell center" style={{ background: backGroundColor }}>
            {rowData[0].status}
          </Cell>
        </Tooltip>
        {props.children}
      </Tag>
      {!isLastStep && isShowChildren && stepIndex + 1 <= showLevel && (
        <Tag>
          <Cell
            className="action-cell cell"
            style={{ background: headerBgColors[stepIndex] }}
          ></Cell>
          <Cell
            className="action-cell cell"
            style={{ background: headerBgColors[stepIndex] }}
          ></Cell>

          <Cell colSpan={visibleColumns.length}>
            <NextTag
              // {...props}
              showLevel={props.showLevel}
              stepDetails={props.stepDetails}
              onRowChange={props.onRowChange}
              onRowDelete={props.onRowDelete}
              calcSteps={calcSteps}
              stepIndex={stepIndex + 1}
              parentStepDetailId={rowData[0].stepDetailId}
              horizontalScroll={false}
              isViewOnly={props.isViewOnly}
            />
          </Cell>
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

export default class NestedTable extends PureComponent {
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
    this.onExpend = this.onExpend.bind(this);

    const grid = this.loadGridData(this.props);
    let columnIndexes = {};

    props.columns.forEach((c, i) => {
      columnIndexes[c.fieldName] = i;
    });

    this.state = {
      as: 'table',
      columns: props.columns,
      columnIndexes: columnIndexes,

      calcSteps: props.calcSteps,
      stepIndex: props.stepIndex,
      calcStep: props.calcSteps[this.props.stepIndex],

      isLastStep: props.isLastStep,
      parentStepDetailId: props.parentStepDetailId,
      grid: grid,
      selections: grid.map((ticked) => false),
      editing: {},
      expend: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.calcSteps !== this.props.calcSteps) {
      let columnIndexes = {};

      nextProps.columns.forEach((c, i) => {
        columnIndexes[c.fieldName] = i;
      });
      this.setState({
        calcSteps: nextProps.calcSteps,
        calcStep: nextProps.calcSteps[nextProps.stepIndex],

        // columns: nextProps.columns,
        // columnIndexes: columnIndexes,

        // stepIndex: nextProps.stepIndex,

        // isLastStep: nextProps.isLastStep,
        // parentStepDetailId: nextProps.parentStepDetailId,
      });
    }
    if (nextProps.stepDetails !== this.props.stepDetails) {
      const grid = this.loadGridData(nextProps);
      this.setState({
        grid: grid,
        selections: grid.map((ticked) => false),
      });
    }
    if (nextProps.parentStepDetailId !== this.props.parentStepDetailId) {
      this.setState({
        parentStepDetailId: nextProps.parentStepDetailId,
      });
    }
  }

  onExpend = () => {
    this.setState({ expend: !this.state.expend });
  };

  loadGridData = (props) => {
    const calcStep = props.calcSteps[props.stepIndex];
    const { stepDetails } = props; //.stepDetails.filter(sd => {

    const grid = stepDetails
      .filter(
        (sd) =>
          sd.calcStepId === calcStep.calcStepId &&
          sd.parentStepDetailId == props.parentStepDetailId,
      ) //matched calc step details
      .map((d) => {
        // trong trường hợp có lỗi và đang hidden chi tiếc nấc thì mở ra
        if (d.error) {
          if (!this.state.expend) {
            this.setState({
              expend: true,
            });
          }
        }
        return props.columns
          .filter((c) => (!c.lastStepOnly || props.isLastStep) && !c.hidden)
          .map((c, i) => {
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
                calcStep: props.calcSteps[props.stepIndex],
                stepDetail: d,
              },
            };

            if (i == 0) {
              //first cell of row contains row attributes:
              retval = {
                ...retval,
                validFunc: c.validFunc,
                calcStepId: calcStep.calcStepId,
                stepDetailId: d.stepDetailId,
                parentStepDetailId: props.parentStepDetailId,
                feePatternId: calcStep.feePatternId,
                isLastStep: this.props.isLastStep,
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
    const visibleColumns = this.state.columns.filter(
      (c) => (!c.lastStepOnly || this.state.isLastStep) && !c.hidden,
    );
    const grid = this.state.grid; // {...this.state.grid};

    const selections = [...this.state.selections];

    const newRow = grid.length;
    let defData = {};

    grid[newRow] = visibleColumns.map((c) => {
      defData[c.fieldName] = c.defaultValue;

      return {
        fieldName: c.fieldName,
        dataType: c.dataType,
        displayField: c.displayFieldName,
        dataEditor: c.editorTag,
        value: c.defaultValue || '',
        valueViewer: c.valueViewer,
        align: c.align,
        readOnly: c.readOnly,
        status: STATUS_ADDNEW, //state = add new
        calcStepId: this.state.calcStep.calcStepId,
        dataEditorParams: {
          fieldName: c.fieldName,
          value: '',
          calcStep: this.props.calcSteps[this.props.stepIndex],
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

    //first cell of row contains row attributes:
    grid[newRow][0] = {
      ...grid[newRow][0],
      feePatternId: this.state.calcStep.feePatternId,
      //   stepDetailId: (newRow + 1) * -1, //default step detail id = grid rows count
      //   stepDetailId: guidGenerator(),
      stepDetailId: minId,
      parentStepDetailId: this.state.parentStepDetailId, //parent step detail id
      calcStepId: this.state.calcStep.calcStepId,
      isLastStep: this.props.isLastStep,
      validFunc: visibleColumns[0].validFunc,
    };

    grid[newRow][0].fullRowData = defData;

    selections[selections.length] = false;

    /*
            let newStepDetail = {
              calcStepId: this.state.calcStep.calcStepId,
              parentStepDetailId: this.state.parentStepDetailId,
        
            };
        
            this.props.columns.forEach(c => {
              newStepDetail[c.fieldName] = c.defaultValue
            })
        
            let calcStep = {...this.state.calcStep}
            calcStep.stepDetails[calcStep.stepDetails.length] = newStepDetail;
        */

    this.props.onRowChange(grid[newRow]);
    this.setState({ grid, selections /*, calcStep */ });
  }

  handleDeleteRow(row) {
    if (row !== undefined && row !== null) {
      const grid = [...this.state.grid];
      this.props.onRowDelete(
        this.state.calcStep.calcStepId,
        grid[row][0].stepDetailId,
        this.state.parentStepDetailId,
      );

      // grid.forEach((r, i) => {
      //   if (i == row) {
      //     grid[i] = row;
      //   }
      // })
      // this.setState({ grid: grid })
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
    const grid = this.state.grid; // {...this.state.grid}
    const visibleColumns = this.state.columns.filter(
      (c) => (!c.lastStepOnly || this.state.isLastStep) && !c.hidden,
    );

    const { columnIndexes } = this.state;
    //console.log(' changes ', changes, ' additions ', additions)
    changes.forEach(({ cell, row, col, value }) => {
      const { fieldName } = cell;
      const { locationBegin, locationEnd, characteristic, turn, type, itemKey, itemName } = value;
      //console.log('value111', value, ' type ', type)
      if (
        locationBegin &&
        locationEnd &&
        (cell.fieldName == 'fromZoneId' ||
          cell.fieldName == 'fromZoneCode' ||
          cell.fieldName == 'fromZoneName' ||
          cell.fieldName == 'toZoneId' ||
          cell.fieldName == 'toZoneCode' ||
          cell.fieldName == 'toZoneName' ||
          cell.fieldName == 'twoway' ||
          cell.fieldName == 'characteristic')
      ) {
        grid[row][columnIndexes['fromZoneId']] = {
          ...grid[row][columnIndexes['fromZoneId']],
          value: locationBegin.zoneId,
        };
        grid[row][columnIndexes['fromZoneCode']] = {
          ...grid[row][columnIndexes['fromZoneCode']],
          value: locationBegin.code,
        };
        grid[row][columnIndexes['fromZoneName']] = {
          ...grid[row][columnIndexes['fromZoneName']],
          value: locationBegin.zoneName,
        };

        grid[row][columnIndexes['toZoneId']] = {
          ...grid[row][columnIndexes['toZoneId']],
          value: locationEnd.zoneId,
        };
        grid[row][columnIndexes['toZoneCode']] = {
          ...grid[row][columnIndexes['toZoneCode']],
          value: locationEnd.code,
        };
        grid[row][columnIndexes['toZoneName']] = {
          ...grid[row][columnIndexes['toZoneName']],
          value: locationEnd.zoneName,
        };
        grid[row][columnIndexes['twoway']] = {
          ...grid[row][columnIndexes['twoway']],
          value: turn ? 1 : 0,
        };

        grid[row][columnIndexes['characteristic']] = {
          ...grid[row][columnIndexes['characteristic']],
          value: characteristic,
        };

        if (characteristic === 'trungtam') {
          grid[row][columnIndexes['isCenter']] = true;
        } else if (characteristic === 'vungxa') {
          grid[row][columnIndexes['isFar']] = true;
        } else if (characteristic === 'haidao') {
          grid[row][columnIndexes['isIsland']] = true;
        } else if (characteristic === 'miennui') {
          grid[row][columnIndexes['isMountain']] = true;
        }

        const rowStatus =
          grid[row][0].status == STATUS_UNCHANGED ? STATUS_EDITED : grid[row][0].status;

        grid[row][0] = {
          ...grid[row][0],
          status: rowStatus,
          //fullRowData: { ...grid[row][0].fullRowData, fromZoneName: locationBegin.zoneName, toZoneName: locationEnd.zoneName }
        };
        this.props.onRowChange(grid[row]);
      } else if (
        (type == 'acceptFarIsland' || type == 'characteristic') &&
        // !isNullOrEmpty(itemKey) &&
        itemName
      ) {
        // trường hợp là loại hàng
        //console.log('itemKey ', itemKey)
        grid[row][columnIndexes[fieldName]] = {
          ...grid[row][columnIndexes[fieldName]],
          value: String(value.itemKey),
          dataEditorParams: {
            fieldName: fieldName,
            value: String(value.itemKey),
            calcStep: this.props.calcSteps[this.props.stepIndex],
          },
        };
        const rowStatus =
          grid[row][0].status == STATUS_UNCHANGED ? STATUS_EDITED : grid[row][0].status;
        grid[row][0] = { ...grid[row][0], status: rowStatus };

        this.props.onRowChange(grid[row]);
      } else if (type == 'itemType' && itemKey && itemName) {
        // trường hợp là loại hàng
        grid[row][columnIndexes['itemTypeId']] = {
          ...grid[row][columnIndexes['itemTypeId']],
          value: value.itemKey,
          dataEditorParams: {
            fieldName: 'itemTypeId',
            value: value.itemKey,
            calcStep: this.props.calcSteps[this.props.stepIndex],
          },
        };

        grid[row][columnIndexes['itemTypeName']] = {
          ...grid[row][columnIndexes['itemTypeName']],
          value: value.itemName,
          dataEditorParams: {
            fieldName: 'itemTypeName',
            value: value.itemKey,
            calcStep: this.props.calcSteps[this.props.stepIndex],
          },
        };
        const rowStatus =
          grid[row][0].status == STATUS_UNCHANGED ? STATUS_EDITED : grid[row][0].status;
        grid[row][0] = { ...grid[row][0], status: rowStatus };

        this.props.onRowChange(grid[row]);
      } else if (typeof value === 'boolean') {
        grid[row][col] = { ...grid[row][col], value: value ? 1 : 0 };
        const rowStatus =
          grid[row][0].status == STATUS_UNCHANGED ? STATUS_EDITED : grid[row][0].status;
        grid[row][0] = { ...grid[row][0], status: rowStatus };
        this.props.onRowChange(grid[row]);
      } else if (grid[row][col].value != value) {
        //new value != old value
        grid[row][col] = { ...grid[row][col], value };

        if (grid[row][0].status == STATUS_UNCHANGED) {
          //change status
          grid[row][0] = { ...grid[row][0], status: STATUS_EDITED };
        }

        this.props.onRowChange(grid[row]);
      }
    });

    // paste extended beyond end, so add a new row

    //console.log('additions', additions)
    additions &&
      additions.forEach(({ cell, row, col, value }, k) => {
        if (k === additions.length - 1 && value === '') {
          // fix lỗi trong trường hợp paste từ excel vào sẽ bị thêm 1 dòng trống ở cuối
          return;
        }
        if (!grid[row]) {
          //add new row
          grid[row] = visibleColumns.map((c, i) => {
            let newCell = {
              calcStepId: this.state.calcStep.calcStepId,
              feePatternId: this.state.calcStep.feePatternId,
              //stepDetailId: (grid.length + 1) * (-1), //default step detail id = grid rows count
              stepDetailId: guidGenerator(),
              parentStepDetailId: this.state.parentStepDetailId, //parent step detail id
              fieldName: c.fieldName,
              value: c.defaultValue,
              status: STATUS_ADDNEW,
              align: c.align,
              readOnly: c.readOnly,
              dataEditor: c.editorTag,
              dataEditorParams: {
                fieldName: c.fieldName,
                value: c.defaultValue,
                calcStep: this.props.calcSteps[this.props.stepIndex],
                visible: true,
              },
              valueViewer: c.valueViewer,
              isLastStep: this.state.isLastStep,
            };

            if (i == 0) {
              newCell = { ...newCell, validFunc: c.validFunc };
            }
            return newCell;
          });
        }
        if (grid[row][col]) {
          //new col
          grid[row][col] = { ...grid[row][col], value };
        }

        this.props.onRowChange(grid[row]);
      });
    const selections = grid.map((r) => false);

    this.setState({ grid, selections });
  }

  sheetRenderer(props) {
    const { columns, selections, calcSteps, stepIndex } = this.state;

    return (
      <SheetRenderer
        calcSteps={calcSteps}
        stepIndex={stepIndex}
        columns={columns}
        selections={selections}
        onSelectAllChanged={this.handleSelectAllChanged}
        onAddNewRow={this.handleAddNewRow}
        onExpend={this.onExpend}
        expend={this.state.expend}
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
    const { columns, selections, calcSteps, stepIndex, grid } = this.state;

    return (
      <RowRenderer
        calcSteps={calcSteps}
        stepIndex={stepIndex}
        stepDetails={this.props.stepDetails}
        showLevel={this.props.showLevel}
        onRowChange={this.props.onRowChange}
        isLastStep={this.props.isLastStep}
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
    const { columns, calcSteps, stepIndex } = this.state;
    return (
      <CellRenderer
        as="td"
        //calcSteps={calcSteps}
        //stepIndex={stepIndex}
        columns={columns}
        {...props}
      />
    );
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
