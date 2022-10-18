import { DeleteOutlined, EditOutlined, ReloadOutlined, CloseCircleOutlined, SaveOutlined, ExclamationCircleOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Drawer, Input, Modal, Popconfirm, Row, Space, Spin, Table } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import defineColumns from './columns';
import type { PartnerCategoryDto } from '@/services/client';
import EditFormPartner from './edit';
import { useModel } from 'umi';
import { lowerCase, upperCase } from 'lodash';


export default () => {
    const { dataSource, reload, isLoading, isSaving, deleteRecord, createRecord, updateRecord, updateDeActivate } = useModel('partnerCategoryList');
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<PartnerCategoryDto>();
    const [searchValue, setSearchValue] = useState<string>();
    const [dataTable, setDataTable] = useState<PartnerCategoryDto[]>([]);
    const [isView] = useState<boolean>(false);

    useEffect(() => {
        reload();
    }, [])

    useEffect(() => {
        if (!searchValue) {
            // setDataTable(dataSource.filter(e => e.status === 1));
            setDataTable(dataSource);
        } else {
            setDataTable(dataSource.filter((d: any) => (d.partnerName?.toLocaleUpperCase()).includes(searchValue.toLocaleUpperCase())))
        }
    }, [dataSource, searchValue]);

    const toggleShowEdit = () => {
        setShowEdit(!showEdit);
    }
    const handleCreate = () => {
        setRecordEdit(undefined);
        toggleShowEdit();
    }
    const handleEdit = (record: PartnerCategoryDto) => {
        toggleShowEdit();
        setRecordEdit(record);
    }

    const onEdit = (values: PartnerCategoryDto) => {
        // console.log("values", values);

        if (recordEdit) {
            // update
            updateRecord(recordEdit.partnerId!, values, () => toggleShowEdit());
        } else {
            createRecord(values, () => toggleShowEdit());
        }
    }
    const onDelete = (partnerId: number) => {
        // console.log("partnerCode", partnerCode);
        // deleteRecord(partnerId);
    }

    const onUpdateStatus = (partnerId: number, record: PartnerCategoryDto) => {
        updateDeActivate(record);
    }

    const confirmChangeStatus = (partnerId: number, record: PartnerCategoryDto) => {
        // setOpenModel(true);
        Modal.confirm({
            title: `Bạn chắc chắn muốn đặt lại trạng thái cho đối tác?`,
            content: 'Trạng thái hoạt động sẽ được đặt lại sau khi bấm nút xác nhận.',
            icon: <ExclamationCircleOutlined />,
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk() {
                onUpdateStatus(partnerId, record)
            }
        });

    }

    const action = (partnerId: number, record: PartnerCategoryDto): React.ReactNode => {
        return <Space key={partnerId}>
            <Button title='Sửa' className="btn-outline-info" size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
            <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                // onConfirm={() => onDelete(partnerId)}
                onConfirm={() => onUpdateStatus(partnerId, record)}
                okText="Đồng ý"
                cancelText="Hủy bỏ"
            >
                {/* <Button title='Xóa' className="btn-outline-danger" size="small"><DeleteOutlined style={{ color: 'red' }} /></Button> */}
            </Popconfirm>
            <Button className="btn-outline-danger" size="small" onClick={() => confirmChangeStatus(partnerId, record)}>{record.deActive === false ? <LockOutlined /> : <UnlockOutlined />}</Button>
        </Space>
    }

    const columns: any[] = defineColumns(action);
    return (
        <>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Card className="fadeInRight">
                        <Row>
                            <Col span={14}>
                                <Space className="button-group" style={{ textAlign: 'end', width: '100%' }}>
                                    <Button className="btn-outline-info" icon={<PlusCircleOutlined />} onClick={handleCreate}>Thêm mới</Button>
                                    <Button onClick={() => reload()} icon={<ReloadOutlined />} />
                                </Space>
                            </Col>
                            <Col span={10} >
                                <Input.Search
                                    placeholder="Nhập tên đối tác"
                                    // enterButton="Xác nhận"
                                    allowClear
                                    enterButton={<SearchOutlined />}
                                    onSearch={(value) => setSearchValue(value)}
                                    width={250}
                                />
                            </Col>
                        </Row>
                        <Table
                            size='small'
                            dataSource={dataTable}
                            columns={columns}
                            bordered
                        />
                    </Card>
                </Spin>
            </PageContainer>
            <EditFormPartner
                visible={showEdit}
                setVisible={setShowEdit}
                onEdit={onEdit}
                record={recordEdit}
                isSaving={isSaving}
                isView={isView}
            /></>
    );
};