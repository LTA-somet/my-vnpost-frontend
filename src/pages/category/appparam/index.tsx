import { DeleteOutlined, EditOutlined, ReloadOutlined, CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Drawer, /**Input*/Popconfirm, Row, Space, Spin, Table } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import defineColumns from './columns';
import EditFormAppParam from './edit';
import type { DmAppParamDto } from '@/services/client';
import { useModel } from 'umi';


export default () => {
    const { dataSource, reload, isLoading, isSaving, deleteRecord, createRecord, updateRecord } = useModel('appparamList');
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<DmAppParamDto>();
    const [searchValue, /**setSearchValue*/] = useState<string>();
    const [dataTable, setDataTable] = useState<DmAppParamDto[]>([]);

    useEffect(() => {
        reload();
    }, [])

    useEffect(() => {
        if (!searchValue) {
            setDataTable(dataSource);
        } else {
            // setDataTable(dataSource.filter(d => d.id?.includes(searchValue)))
        }
    }, [dataSource, searchValue])

    const toggleShowEdit = () => {
        setShowEdit(!showEdit);
    }
    const handleCreate = () => {
        setRecordEdit(undefined);
        toggleShowEdit();
    }
    const handleEdit = (record: DmAppParamDto) => {
        toggleShowEdit();
        setRecordEdit(record);
    }
    const onEdit = (values: DmAppParamDto) => {

        if (recordEdit) {
            // update
            updateRecord(recordEdit!.id!, values, () => toggleShowEdit());
        } else {
            createRecord(values, () => toggleShowEdit());
        }
    }
    const onDelete = (id: number) => {
        deleteRecord(id);
    }

    const action = (id: number, record: DmAppParamDto): React.ReactNode => {
        return <Space key={id}>
            <Button size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
            <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                onConfirm={() => onDelete(id)}
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
                        <Row>
                            <Col span={14}>
                                <Space className="button-group" style={{ textAlign: 'end', width: '100%' }}>
                                    <Button icon={<PlusCircleOutlined />} className="custom-btn1 btn-outline-info" onClick={handleCreate} type="primary">Thêm mới</Button>
                                    <Button onClick={() => reload()} icon={<ReloadOutlined />} />
                                </Space>
                            </Col>
                            {/* <Col span={10} >
                                <Input.Search
                                    placeholder="Nhập ID"
                                    allowClear
                                    enterButton="Tìm kiếm"
                                    onSearch={(value) => setSearchValue(value)}
                                    width={250}
                                />
                            </Col> */}
                        </Row>
                        <Table
                            dataSource={dataTable}
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
                        <Button className='btn-outline-success' icon={<SaveOutlined />} htmlType="submit" form="form-create-AppParam" type="primary" loading={isSaving}>
                            Lưu
                        </Button>
                    </Space>
                }
            >
                {showEdit && <EditFormAppParam
                    record={recordEdit}
                    onEdit={onEdit}
                />}
            </Drawer>
        </div>
    );
};