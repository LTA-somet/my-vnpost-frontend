import { OrderHdrDto, VaDto } from '@/services/client';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Collapse, Form, Popconfirm, Space, Table } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useModel } from 'umi';
import columnsDefine from './columns';
import EditContentPopup from './edit-content-popup';

const Batch = () => {
    const { batch, removeForBatch, addForBatch, editItemInBatch, isLoadingBatch, form } = useModel('orderModel');
    const editContentRef = useRef<any>();

    const handleAdd = (e: any) => {
        e?.stopPropagation();
        editContentRef.current.handleAddContent((newContent: any) => {
            const newOrder = { ...newContent }
            addForBatch(newOrder);
        })
    }

    const handleEdit = (record: OrderHdrDto) => {
        editContentRef.current.handleEditContent(record, (newContent: any) => {
            console.log('newOrderHdr', newContent, record.orderHdrId!);
            const newOrder = { ...record, ...newContent }
            editItemInBatch(record.orderHdrId!, newOrder);
        })
    }

    const action = (id: string, record: OrderHdrDto): React.ReactNode => {
        return <Space>
            <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                onConfirm={() => removeForBatch(record)}
                okText="Đồng ý"
                cancelText="Hủy bỏ"
            >
                <Button size="small"><DeleteOutlined style={{ color: 'red' }} /></Button>
            </Popconfirm>
            <Button size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
        </Space>
    }

    const vas: VaDto[] = Form.useWatch('vas', form);

    const columns = columnsDefine(action, vas);

    return (
        <Collapse defaultActiveKey={['1']}>
            <Collapse.Panel header={<>
                <b>Thông tin bưu gửi trong lô</b>
                <Button className='btn btn-outline-info' icon={<PlusCircleOutlined />} onClick={handleAdd}
                    style={{ margin: '-5px 0 -5px 20px' }}> Thêm bưu gửi vào  lô</Button>
            </>}
                key="1"
            >
                <Table
                    columns={columns}
                    dataSource={batch}
                    size={'small'}
                    bordered
                    loading={isLoadingBatch}
                />
                <EditContentPopup ref={editContentRef} />
            </Collapse.Panel>
        </Collapse >
    );
};

export default Batch;