import { EditableCell, EditableRow } from '@/components/Editable';
import { VasPropsDto } from '@/services/client';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Space, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const VaItemTable = (props: Props) => {
    const count = useRef<number>(-1);
    const [dataTable, setDataTable] = useState<any[]>([]);
    const [defineColumn, setDefineColumn] = useState<any[]>([]);
    const columnsName = useRef<string[]>([]);

    useEffect(() => {
        const columns: any[] = eval(props.vaProp.defineColumn || '[]');
        columnsName.current = columns?.map(c => c.dataIndex);
        setDefineColumn(columns);
    }, [props.vaProp.defineColumn]);

    // tách value sang array
    useEffect(() => {
        const newDataTable: any[] = [];
        const row = props.value?.split("|");
        row?.forEach((r, i) => {
            if (!r) return;
            const cols = r.split("^");
            const item = {};
            item['index'] = -1 * i;
            columnsName.current.forEach((c, j) => {
                item[c] = cols[j] ?? '';
            })
            newDataTable.push(item);
        })

        const arrId = [...(newDataTable.map(v => v.index!) || []), 0]
        const min = Math.min(...arrId);

        count.current = min - 1;
        setDataTable(newDataTable);
    }, [props.value]);

    const triggerChange = (newDataTable: any[]) => {
        const colsStr = newDataTable.map(d => {
            const lst = defineColumn.map(c => {
                const dataIndex = c.dataIndex;
                if (c.dataType === 'calculate') {
                    // nếu type là tính toán thì tính giá trị theo hàm render
                    try {
                        const renderFnc = c.render;
                        return renderFnc(d[dataIndex], d);
                    } catch (e) {
                        console.log(e);
                        return '';
                    }
                } else {
                    return d[dataIndex];
                }
            });
            return lst.length > 0 ? lst.reduce((prev, next) => (prev ?? '') + "^" + (next ?? '')) : [];
        });
        const retVal = colsStr.length > 0 ? colsStr.reduce((total, next) => total + "|" + next) : '';

        props.onChange?.(retVal);
    }

    const handleDelete = (key: number) => {
        const newDataSource = [...dataTable];
        const newContentList = newDataSource.filter(item => item.index !== key);
        triggerChange(newContentList);
    };

    const handleAdd = () => {
        const newItem: any = {
            index: count.current
        };
        triggerChange([...dataTable, newItem]);
        // setCount(count - 1)
    };
    const handleSave = (row: any) => {
        const newData = [...dataTable];
        const index = newData.findIndex(item => row.index === item.index);
        const item = newData[index];

        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        triggerChange(newData);
    };

    const action = (index: number): React.ReactNode => {
        return <Space key={index}>
            <Button className="btn-outline-danger" size="small" onClick={() => handleDelete(index)}><DeleteOutlined /></Button>
        </Space>
    }

    const columnsViewer: any[] = [
        {

            dataIndex: 'index',
            align: 'center',
            width: '60px',
            key: 'index',
            title: <Button className='btn-outline-info' size='small' onClick={handleAdd} icon={<PlusCircleOutlined />} />,
            render: (index: any) => action(index)
        },
        ...defineColumn
    ];

    const columns = columnsViewer.map(col => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record: any[]) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                dataType: col.dataType,
                handleSave: handleSave,
                options: col.options
            }),
        };
    });
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    return (
        <div>
            <Table
                size='small'
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataTable}
                columns={columns}
                pagination={false}
            />
        </div>
    );
}

type Props = {
    value?: string,
    onChange?: (value: string) => void,
    vaProp: VasPropsDto
}

export default VaItemTable;