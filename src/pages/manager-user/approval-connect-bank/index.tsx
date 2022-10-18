import { EditOutlined, ZoomInOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Input, Row, Select, Space, Spin, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import defineColumns from './columns';
import type { UserBankAccountDto, UserBankAccountSearchDto } from '@/services/client';
import { useModel } from 'umi';
import EditFormApproval from './edit';
import DetailFormApproval from './detail';
const { Option } = Select;
export default () => {
    const { dataSource, reloadApproval, isLoading, isSaving, deleteRecord, createRecord, updateRecord, approvalRecord, searchApproval } = useModel('connectBankList');
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<UserBankAccountDto>();
    const [searchValue, setSearchValue] = useState<string>();
    const [dataTable, setDataTable] = useState<UserBankAccountDto[]>([]);
    const [isView] = useState<boolean>(false);

    useEffect(() => {
        reloadApproval();
    }, [])

    useEffect(() => {
        if (!searchValue) {
            setDataTable(dataSource);
        } else {
            setDataTable(dataSource.filter(d => d.accountName?.includes(searchValue)))
        }
    }, [dataSource])

    const onSearch = (value: UserBankAccountSearchDto) => {
        if (value) {
            searchApproval(value);
        } else {
            console.log("Không có giá trị nào");

        }
    }

    const toggleShowEdit = () => {
        setShowEdit(!showEdit); //true
    }
    const handleCreate = () => {
        setRecordEdit(undefined);
        toggleShowEdit();
    }
    const handleEdit = (record: UserBankAccountDto) => {
        toggleShowEdit();
        setRecordEdit(record);
    }
    const onEdit = (values: UserBankAccountDto) => {

        if (recordEdit) {
            // update
            approvalRecord(recordEdit!.accountId!, values, () => toggleShowEdit());
        } else {
            createRecord(values, () => toggleShowEdit());
        }
    }
    const onDelete = (accountId: number) => {
        deleteRecord(accountId);
    }
    const toggleShowDetail = () => {
        setShowDetail(!showEdit); //true
    }
    const handleDetail = (record: UserBankAccountDto) => {
        toggleShowDetail();
        setRecordEdit(record);
    }

    const action = (accountId: number, record: UserBankAccountDto): React.ReactNode => {
        return <Space key={accountId}>
            <Button className="btn-outline-secondary" size="small" onClick={() => handleDetail(record)}><ZoomInOutlined /></Button>
            <Button className="btn-outline-info" size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
            {/* <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                onConfirm={() => onDelete(notifyCode)}
                okText="Đồng ý"
                cancelText="Hủy bỏ"
            >
                <Button className="btn-outline-danger" size="small"><DeleteOutlined /></Button>
            </Popconfirm> */}
        </Space>
    }

    const columns: any[] = defineColumns(action);
    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Card className="fadeInRight">
                        <Form name="form-search-connect-bank" onFinish={onSearch}>
                            <Row gutter={8}>
                                <Col span={6}>
                                    <Form.Item name="isApprove">
                                        <Select
                                            allowClear
                                            placeholder="Chọn trạng thái"
                                        >
                                            <Option value="0">Chờ duyệt</Option>
                                            <Option value="1">Đã phê duyệt</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="phoneNumber" >
                                        <Input
                                            placeholder="Nhập số điện thoại"
                                            title='Nhập từ khóa để tìm kiếm'
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="fullName" >
                                        <Input
                                            placeholder="Nhập tên tài khoản"
                                            title='Nhập từ khóa để tìm kiếm'
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Space className="button-group" style={{ textAlign: 'end', width: '100%' }}>
                                        {/* <Button icon={<PlusCircleOutlined />} className="custom-btn1 btn-outline-info" onClick={handleCreate}>Thêm mới</Button> */}
                                        <Button icon={<SearchOutlined />} className="custom-btn1 btn-outline-info" htmlType='submit'>Tra cứu</Button>
                                        {/* <Button onClick={() => reload()} icon={<ReloadOutlined />} /> */}
                                    </Space>
                                </Col>
                            </Row>
                        </Form>

                        <Table
                            size='small'
                            dataSource={dataTable}
                            columns={columns}
                            bordered
                            pagination={{ showSizeChanger: true }}
                        />
                    </Card>
                </Spin>
            </PageContainer>
            <EditFormApproval
                visible={showEdit}
                setVisible={setShowEdit}
                onEdit={onEdit}
                record={recordEdit}
                isSaving={isSaving}
                isView={isView}
            />
            <DetailFormApproval
                visible={showDetail}
                setVisible={setShowDetail}
                onEdit={onEdit}
                record={recordEdit}
                isSaving={isSaving}
                isView={isView}
            />
        </div>
    );
};