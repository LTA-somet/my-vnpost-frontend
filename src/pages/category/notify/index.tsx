import { DeleteOutlined, EditOutlined, ReloadOutlined, SaveOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Drawer, Input, Popconfirm, Row, Space, Spin, Table } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import defineColumns from './columns';
import EditFormNotify from './edit';
import type { DmNotifyDto } from '@/services/client';
import { useModel } from 'umi';

export default () => {
    const { dataSource, reload, isLoading, isSaving, deleteRecord, createRecord, updateRecord } = useModel('notifyList');
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<DmNotifyDto>();
    const [searchValue, setSearchValue] = useState<string>();
    const [dataTable, setDataTable] = useState<DmNotifyDto[]>([]);

    useEffect(() => {
        reload();
    }, [])

    useEffect(() => {
        if (!searchValue) {
            setDataTable(dataSource);
        } else {
            setDataTable(dataSource.filter(d => d.notifyCode?.includes(searchValue)))
        }
    }, [dataSource, searchValue])

    const toggleShowEdit = () => {
        setShowEdit(!showEdit);
    }
    const handleCreate = () => {
        setRecordEdit(undefined);
        toggleShowEdit();
    }
    const handleEdit = (record: DmNotifyDto) => {
        toggleShowEdit();
        setRecordEdit(record);
    }
    const onEdit = (values: DmNotifyDto) => {

        if (recordEdit) {
            // update
            updateRecord(recordEdit!.notifyCode!, values, () => toggleShowEdit());
        } else {
            createRecord(values, () => toggleShowEdit());
        }
    }
    const onDelete = (notifyCode: string) => {
        deleteRecord(notifyCode);
    }

    const action = (notifyCode: string, record: DmNotifyDto): React.ReactNode => {
        return <Space key={notifyCode}>
            <Button size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
            <Popconfirm
                title="B???n ch???c ch???n mu???n x??a?"
                onConfirm={() => onDelete(notifyCode)}
                okText="?????ng ??"
                cancelText="H???y b???"
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
                                    <Button icon={<PlusCircleOutlined />} className="custom-btn1 btn-outline-info" onClick={handleCreate} type="primary">Th??m m???i</Button>
                                    <Button onClick={() => reload()} icon={<ReloadOutlined />} />
                                </Space>
                            </Col>
                            <Col span={10} >
                                <Input.Search
                                    placeholder="Nh???p m?? notify"
                                    allowClear
                                    enterButton={<SearchOutlined />}
                                    onSearch={(value) => setSearchValue(value)}
                                    width={250}
                                />
                            </Col>
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
                title={recordEdit ? 'S???a th??ng tin' : 'T???o m???i'}
                width={window.innerWidth > 768 ? 720 : '100%'}
                onClose={toggleShowEdit}
                visible={showEdit}
                bodyStyle={{ paddingBottom: 80 }}
                footerStyle={{ textAlign: 'right' }}
                footer={
                    <Space>
                        <Button className='btn-outline-danger' icon={<CloseCircleOutlined />} onClick={toggleShowEdit}>Hu???</Button>
                        <Button className='btn-outline-success' icon={<SaveOutlined />} htmlType="submit" form="form-create-notify" type="primary" loading={isSaving}>
                            L??u
                        </Button>
                    </Space>
                }
            >
                {showEdit && <EditFormNotify
                    record={recordEdit}
                    onEdit={onEdit}
                />}
            </Drawer>
        </div>
    );
};