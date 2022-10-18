import CustomUpload from '@/components/CustomUpload';
import { EditableCell, EditableRow } from '@/components/Editable';
import { OrderContentDto, ProductEntity } from '@/services/client';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, FormInstance, Popconfirm, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import defineColumns from './content-table-columns';
import ProductModal from './product-modal';
import './style.css';

type EditableTableProps = Parameters<typeof Table>[0];
export type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;
// type columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[];

type Props = {
    caseTypeId?: number,
    disabledEdit: boolean,
    form: FormInstance<any>,
    expand: boolean,
    setOpenModalProduct: (isOpen: boolean) => void,
    openModalProduct: boolean,
    value?: OrderContentDto[],
    onChange?: (values: OrderContentDto[]) => void,
    productList: ProductEntity[],
    onChangeItemContent?: (contents: OrderContentDto[]) => void
}

export type ProductTypeOption = { value?: string, weight?: number, image?: string }

const ContentTable = (props: Props) => {
    // const [dataSource, setDataSource] = useState<OrderContentDto[]>([]);
    const [count, setCount] = useState<number>(-1);
    const [optionProducts, setOptionProducts] = useState<ProductTypeOption[]>([]);

    useEffect(() => {
        const arrId = [...(props.value?.map(v => v.itemContentId!) || []), 0]
        const min = Math.min(...arrId);

        setCount(min - 1)
    }, [props.value]);

    useEffect(() => {
        setOptionProducts(props.productList.map(p => ({ value: p.nameVi, weight: p.weight, image: p.image })))
    }, [props.productList]);

    const handleDelete = (key: number) => {
        const newDataSource = [...props.value || []];
        const newContentList = newDataSource.filter(item => item.itemContentId !== key);
        props.onChange?.(newContentList);
        props.onChangeItemContent?.(newContentList);
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
            <Button className='btn-outline-danger' size='small' disabled={props.disabledEdit} onClick={() => handleDelete(itemContentId)} icon={<DeleteOutlined />} />
        </Space>
    }
    const handleAdd = () => {
        const newData: OrderContentDto = {
            itemContentId: count,
            nameVi: ``,
            quantity: 0,
            weight: 0,
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
        props.onChangeItemContent?.(newData);
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
        return <CustomUpload uploadCaseTypeId={props.caseTypeId} value={valueState} maxImage={1} onChange={(images) => onChangeImage(id, images)} />
    }


    const columnsViewer: any[] = defineColumns(props.disabledEdit, action, handleAdd, renderImage, optionProducts);
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
        props.onChangeItemContent?.(newContentList);
    }

    const localeNoContent = {
        emptyText: (
            <span>
                Không có hàng hoá
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
            <ProductModal
                openModalProduct={props.openModalProduct}
                setOpenModalProduct={props.setOpenModalProduct}
                onAddMultiItem={onAddMultiItem}
                productList={props.productList}
            />
        </>
    );
};
export default ContentTable;