import { EditableCell, EditableRow } from '@/components/Editable';
import type { ProductEntity } from '@/services/client';
import { DeleteOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Button, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import defineColumns from './package-table-columns';
import './style.css';

type EditableTableProps = Parameters<typeof Table>[0];
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;
// type columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[];

type Props = {
    contentTableCaseTypeId?: number
    form: FormInstance<any>,
    expand: boolean,
    setOpenModalProduct: (isOpen: boolean) => void,
    openModalProduct: boolean,
    value?: any[],
    onChange?: (values: any[]) => void,
    onChangeItemPackage?: (contents: any[]) => void
}

export type ProductTypeOption = { value?: string, weight?: number, image?: string }

const PackageTable = (props: Props) => {
    const [count, setCount] = useState<number>(-1);
    const [optionProducts, setOptionProducts] = useState<ProductTypeOption[]>([]);
    const [dataSource, setDataSource] = useState<any[]>([]);

    useEffect(() => {
        const arrId = [...(props.value?.map(v => v.itemPackageId!) || []), 0]
        const min = Math.min(...arrId);

        setCount(min - 1)
    }, [props.value]);

    const handleDelete = (key: number) => {
        const newDataSource = [...props.value || []];
        const newPackageList = newDataSource.filter(item => item.itemPackageId !== key);
        props.onChange?.(newPackageList);
        props.onChangeItemPackage?.(newPackageList);
    };

    const action = (itemPackageId: number): React.ReactNode => {
        return <Space key={itemPackageId}>
            {/* <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                onConfirm={() => handleDelete(id)}
                okText="Đồng ý"
                cancelText="Hủy bỏ"
            >
                <Button size="small"><DeleteOutlined style={{ color: 'red' }} /></Button>
            </Popconfirm> */}
            <Button className='btn-outline-danger' size='small' onClick={() => handleDelete(itemPackageId)} icon={<DeleteOutlined />} />
        </Space>
    }
    const handleAdd = () => {
        const newData = {
            itemPackageId: count,
            packageId: '',
            weightActual: 0,
            length: 0,
            width: 0,
            height: 0,
            isPallet: false,
        };
        props.onChange?.([...props.value || [], newData]);
        // setDataSource([...props.value || [], newData])
        console.log(newData);


        // setCount(count - 1)
    };
    const handleSave = (row: any) => {
        const newData = [...props.value || []];
        const index = newData.findIndex(item => row.itemPackageId === item.itemPackageId);
        const item = newData[index];
        console.log('newData, index, item', index);

        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        props.onChange?.(newData);
        props.onChangeItemPackage?.(newData);
    };

    const onChangeImage = (id: number, images: any[]) => {
        const newData = [...props.value || []];
        const index = newData.findIndex(item => id === item.id);
        const item = newData[index];

        newData.splice(index, 1, {
            ...item,
            image: images.length > 0 ? images[0].dataImg : '',
        });
        props.onChange?.(newData);
    }


    const columnsViewer: any[] = defineColumns(action, handleAdd);
    const columns = columnsViewer.map(col => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record: any) => ({
                record,
                ...col,
                handleSave: handleSave,
            }),
        };
    });


    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const onAddMultiItem = (products: ProductEntity[]) => {
        let i = count;
        const newData: any[] = products.map(p => {
            const d: any = { ...p, id: i, quantity: 1 }
            i = i - 1;
            return d;
        });
        setCount(i);
        const newContentList = [...props.value || [], ...newData];
        props.onChange?.(newContentList);
        props.onChangeItemPackage?.(newContentList);
    }

    const localeNoContent = {
        emptyText: (
            <span>
                Không có kiện hàng
            </span>
        )
    };


    return (
        <>
            <Table
                locale={localeNoContent}
                size='small'
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={props.value || []}
                // dataSource={dataSource}
                columns={columns as ColumnTypes}
                scroll={props.expand ? {} : { y: 100 }}
                pagination={false}
                style={props.expand ? { width: '100%' } : { width: 'calc(100% - 4 px)' }}
            />
        </>
    );
};
export default PackageTable;