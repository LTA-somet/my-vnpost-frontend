import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Drawer, notification, Popconfirm, Space, Spin, Table } from 'antd';
import { PlusCircleOutlined, CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import defineColumns from './columns';
import EditFormUom from './edit';
import type { McasUomDto } from '@/services/client';
import { useModel } from 'umi';

export default () => {
    const { dataSource, reload, isLoading, isSaving, deleteRecord, createRecord, updateRecord } = useModel('uomList');
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<McasUomDto>();

    useEffect(() => {
        reload();
    }, [])

    const toggleShowEdit = () => {
        setShowEdit(!showEdit);
    }
    const handleCreate = () => {
        setRecordEdit(undefined);
        toggleShowEdit();
    }
    const handleEdit = (record: McasUomDto) => {
        toggleShowEdit();
        setRecordEdit(record);
    }
    const onEdit = (values: McasUomDto) => {
        // setIsSaving(true);
        // if (values.uomName.length < 10) {
        //     notification.error({ message: 'Lỗi' });
        //     return;
        // }
        if (recordEdit) {
            // update
            updateRecord(recordEdit!.uomId, values, () => toggleShowEdit());
        } else {
            createRecord(values, () => toggleShowEdit());
        }
    }
    const onDelete = (uomId: string) => {
        deleteRecord(uomId);
    }

    const action = (uomId: string, record: McasUomDto): React.ReactNode => {
        return <Space key={uomId}>
            <Button size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
            <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                onConfirm={() => onDelete(uomId)}
                okText="Đồng ý"
                cancelText="Hủy bỏ"
            >
                <Button size="small"><DeleteOutlined style={{ color: 'red' }} /></Button>
            </Popconfirm>
        </Space>
    }

    const columns: any[] = defineColumns(action);
    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Card className="fadeInRight">
                        <Space className="button-group" style={{ textAlign: 'end' }}>
                            <Button icon={<PlusCircleOutlined />} className="custom-btn1 btn-outline-info" onClick={handleCreate} type="primary">Thêm mới</Button>
                            <Button onClick={() => reload()} icon={<ReloadOutlined />} />
                        </Space>
                        <Table
                            dataSource={dataSource}
                            columns={columns}
                            bordered
                        />
                    </Card>
                </Spin>
            </PageContainer>
            <Drawer
                title={recordEdit ? 'Sửa thông tin' : 'Tạo mới'}
                width={window.innerWidth > 768 ? 720 : '100%'}
                onClose={toggleShowEdit}
                visible={showEdit}
                bodyStyle={{ paddingBottom: 80 }}
                footerStyle={{ textAlign: 'right' }}
                footer={
                    <Space>
                        <Button className='btn-outline-danger' icon={<CloseCircleOutlined />} onClick={toggleShowEdit}>Huỷ</Button>
                        <Button className='btn-outline-success' icon={<SaveOutlined />} htmlType="submit" form="form-create-uom" type="primary" loading={isSaving}>
                            Lưu
                        </Button>
                    </Space>
                }
            >
                {showEdit && <EditFormUom
                    record={recordEdit}
                    onEdit={onEdit}
                />}
            </Drawer>
        </div>
    );
};