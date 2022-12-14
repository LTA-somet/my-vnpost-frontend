import { DeleteOutlined, EditOutlined, ReloadOutlined, SaveOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Input, Popconfirm, Row, Space, Spin, Table } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import defineColumns from './columns';
import { UserBankAccountApi, UserBankAccountDto, UserBankAccountSearchDto } from '@/services/client';
import { useModel } from 'umi';
import EditFormDeclare from './edit';
import { useCurrentUser } from '@/core/selectors';

export default () => {
    const { dataSource, dataFilter, reloadDeclare, isLoading, isSaving, deleteRecord, createRecord, updateRecord, searchDeclare } = useModel('connectBankList');
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<UserBankAccountDto>();
    const [searchValue, setSearchValue] = useState<string>();
    const [dataTable, setDataTable] = useState<UserBankAccountDto[]>([]);
    const [isView] = useState<boolean>(false);
    const [isAddNew, setIsAddNew] = useState<boolean>(false);
    const currentUser = useCurrentUser();

    useEffect(() => {
        reloadDeclare();
    }, [])

    const funcShowAddNew = (list: UserBankAccountDto[]) => {
        if (list.length > 0) {
            setIsAddNew(true);
        } else {
            setIsAddNew(false);
        }
    }

    useEffect(() => {
        // if (!searchValue) {
        //     setDataTable(dataSource);
        // } else {
        //     setDataTable(dataSource.filter(d => d.accountName?.includes(searchValue)))
        // }
        setDataTable(dataSource);
        funcShowAddNew(dataFilter);
    }, [dataSource, dataFilter])

    const onSearch = (value: UserBankAccountSearchDto) => {
        if (value) {
            searchDeclare(value);
        }
    }

    const toggleShowEdit = () => {
        setShowEdit(!showEdit);
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
            updateRecord(recordEdit!.accountId!, values, () => toggleShowEdit());
        } else {
            createRecord(values, () => toggleShowEdit());
        }
    }
    const onDelete = (accountId: number) => {
        deleteRecord(accountId);
    }

    const action = (accountId: number, record: UserBankAccountDto): React.ReactNode => {
        return <Space key={accountId}>
            <Button className="btn-outline-info" size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
            <Popconfirm
                title="B???n ch???c ch???n mu???n x??a?"
                onConfirm={() => onDelete(accountId)}
                okText="?????ng ??"
                cancelText="H???y b???"
            >
                <Button className="btn-outline-danger" size="small"><DeleteOutlined /></Button>
            </Popconfirm>
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
                                    <Form.Item initialValue="" name="bankName" >
                                        <Input
                                            placeholder="Nh???p t??n ng??n h??ng"
                                            title='Nh???p t??? kh??a ????? t??m ki???m'
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item initialValue="" name="branchName" >
                                        <Input
                                            placeholder="Chi nh??nh NH"
                                            title='Nh???p t??? kh??a ????? t??m ki???m'
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item initialValue="" name="accountName" >
                                        <Input
                                            placeholder="Nh???p t??n ch??? t??i kho???n NH"
                                            title='Nh???p t??? kh??a ????? t??m ki???m'
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item initialValue="" name="accountNumber" >
                                        <Input
                                            placeholder="Nh???p s??? t??i kho???n NH"
                                            title='Nh???p t??? kh??a ????? t??m ki???m'
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24} flex="auto" style={{ textAlign: 'right' }}>
                                    <Space className="button-group">
                                        <Button icon={<SearchOutlined />} className="custom-btn1 btn-outline-info" htmlType='submit'>Tra c???u</Button>
                                        {/* <Button onClick={() => reload()} icon={<ReloadOutlined />} /> */}
                                        <Button icon={<PlusCircleOutlined />} className="custom-btn1 btn-outline-info" onClick={handleCreate} hidden={isAddNew}>Th??m m???i</Button>
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
            <EditFormDeclare
                visible={showEdit}
                setVisible={setShowEdit}
                onEdit={onEdit}
                record={recordEdit}
                isSaving={isSaving}
                isView={isView}
            />
        </div>
    );
};