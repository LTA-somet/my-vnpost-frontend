import CustomUpload from '@/components/CustomUpload';
import { EditableCell, EditableRow } from '@/components/Editable';
import { OrderContentDto, ProductEntity } from '@/services/client';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, FormInstance, Popconfirm, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import defineColumns from './document-table-columns';
import './style.css';

type EditableTableProps = Parameters<typeof Table>[0];
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;
// type columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[];

type Props = {
    form: FormInstance<any>,
    expand: boolean,
    value?: any[],
    onChange?: (values: OrderContentDto[]) => void
}

export type ProductTypeOption = { value?: string, weight?: number, image?: string }

const DocumentTable = (props: Props) => {
    // const [dataSource, setDataSource] = useState<OrderContentDto[]>([]);
    const [count, setCount] = useState<number>(-1);

    useEffect(() => {
        const arrId = [...(props.value?.map(v => v.itemDocId!) || []), 0]
        const min = Math.min(...arrId);

        setCount(min - 1)
    }, [props.value]);

    const handleDelete = (key: number) => {
        const newDataSource = [...props.value || []];
        const newContentList = newDataSource.filter(item => item.itemDocId !== key);
        props.onChange?.(newContentList);
    };

    const action = (itemContentId: number): React.ReactNode => {
        return <Space key={itemContentId}>
            {/* <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                onConfirm={() => handleDelete(itemContentId)}
                okText="Đồng ý"
                cancelText="Hủy bỏ"
            >
                <Button size="small"><DeleteOutlined style={{ color: 'red' }} /></Button>
            </Popconfirm> */}
            <Button className='btn-outline-danger' size='small' onClick={() => handleDelete(itemContentId)} icon={<DeleteOutlined />} />
        </Space>
    }
    const handleAdd = () => {
        const newData: any = {
            itemDocId: count,
            docType: ``,
            docNumber: ``,
            image: '',
        };
        props.onChange?.([...props.value || [], newData]);
        // setCount(count - 1)
    };
    const handleSave = (row: OrderContentDto) => {
        const newData = [...props.value || []];
        const index = newData.findIndex(item => row.itemContentId === item.itemContentId);
        const item = newData[index];
        // console.log('newData, index, item', row);

        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        props.onChange?.(newData);
    };

    const onChangeImage = (id: number, images: any[]) => {
        const newData = [...props.value || []];
        const index = newData.findIndex(item => id === item.itemContentId);
        const item = newData[index];

        newData.splice(index, 1, {
            ...item,
            image: images.length > 0 ? images[0].dataImg : '',
        });
        props.onChange?.(newData);
    }

    const renderImage = (id: number, image?: string) => {
        const valueState = image ? [{
            orderImgId: id,
            dataImg: image
        }] : [];
        return <CustomUpload value={valueState} maxImage={1} onChange={(images) => onChangeImage(id, images)} />
    }


    const columnsViewer: any[] = defineColumns(false, action, handleAdd, renderImage);
    const columns = columnsViewer.map(col => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record: OrderContentDto) => ({
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

    const onAddMultiItem = (products: ProductEntity[]) => {
        let i = count;
        const newData: OrderContentDto[] = products.map(p => {
            const d: OrderContentDto = { ...p, itemContentId: i, quantity: 1 }
            i = i - 1;
            return d;
        });
        setCount(i);
        const newContentList = [...props.value || [], ...newData];
        props.onChange?.(newContentList);
    }

    const localeNoContent = {
        emptyText: (
            <span>
                Không có tài liệu
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
                columns={columns as ColumnTypes}
                scroll={props.expand ? {} : { y: 100 }}
                pagination={false}
                style={props.expand ? { width: '100%' } : { width: 'calc(100% - 4 px)' }}
            />
        </>
    );
};
export default DocumentTable;