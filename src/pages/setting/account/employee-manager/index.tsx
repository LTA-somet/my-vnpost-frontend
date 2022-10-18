import { DeleteOutlined, EditOutlined, EyeOutlined, KeyOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, Modal, Popconfirm, Row, Space, Spin, Table } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import defineColumns from './columns';
import type { AccountDto } from '@/services/client';
import { useModel } from 'umi';
import EditFormEmployee from './edit-form';
import ChangePassEmployee from './change-pass';

export default () => {
    const { dataSource, reload, isLoading, isSaving, deleteRecord, createRecord, updateRecord, lockRecord, changePass } = useModel('employeeList')
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [isView, setIsView] = useState<boolean>(false);
    const [isNew, setIsNew] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<AccountDto>();
    const [searchValue, setSearchValue] = useState<string>();
    const [dataTable, setDataTable] = useState<AccountDto[]>([]);
    const [showModalChangePass, setShowModalChangePass] = useState<boolean>(false);
    const { initialState } = useModel('@@initialState')
    const user = initialState?.accountInfo;

    useEffect(() => {
        reload();
    }, []);
    useEffect(() => {
        if (!searchValue) {
            setDataTable(dataSource);
        } else {
            setDataTable(dataSource.filter(d =>
                d.email?.toLocaleUpperCase().includes(searchValue.toUpperCase())
                || d.fullname?.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase())))
        }
    }, [dataSource, searchValue])

    const toggleShowEdit = () => {
        if (showEdit) {
            setRecordEdit(undefined);
        }
        setShowEdit(!showEdit);
    }
    const handleCreate = () => {
        const record: AccountDto = {
            address: user?.addr,
            provinceCode: user?.prov,
            districtCode: user?.dist,
            communeCode: user?.comm
        };
        setRecordEdit(record);
        toggleShowEdit();
        setIsView(false);
        setIsNew(true);
    }
    const handleEdit = (record: AccountDto) => {
        toggleShowEdit();
        setRecordEdit(record);
        setIsView(false);
        setIsNew(false);
    }
    const handleView = (record: AccountDto) => {
        toggleShowEdit();
        setRecordEdit(record);
        setIsView(true);
        setIsNew(false);
    }
    const handleChangePass = (record: AccountDto) => {
        setShowModalChangePass(true);
        setRecordEdit(record);
    }
    const onEdit = (values: any) => {
        if (recordEdit && !isNew) {
            // update
            updateRecord(recordEdit.username!, values, () => toggleShowEdit());
        } else {
            createRecord(values, () => toggleShowEdit());
        }
    }
    const onChangePass = (username: string, password: string) => {
        changePass(username, password, (success) => success && setShowModalChangePass(false))
    }

    const action = (username: string, record: AccountDto): React.ReactNode => {
        return <Space key={username}>
            <Button title='xem chi tiết' className="btn-outline-secondary" size="small" onClick={() => handleView(record)}><EyeOutlined /></Button>
            <Button title='Sửa' className="btn-outline-info" size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
            <Button title='Đổi mật khẩu' className="btn-outline-warning" size="small" onClick={() => handleChangePass(record)}><KeyOutlined /></Button>
            <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                onConfirm={() => deleteRecord(username)}
                okText="Đồng ý"
                cancelText="Hủy bỏ"
            >
                <Button title='xóa' className="btn-outline-danger" size="small"><DeleteOutlined /></Button>
            </Popconfirm>
        </Space>
    }

    const columns: any[] = defineColumns(action, lockRecord);

    return (
        <div>
            <Spin spinning={isLoading}>
                <Card className="fadeInRight" >
                    <Row>
                        <Col className='config-height' span={14}>
                            <Space className="button-group" style={{ textAlign: 'end', width: '100%' }}>
                                <Button icon={<PlusCircleOutlined />} onClick={handleCreate} className='custom-btn1 btn-outline-info'>Thêm mới</Button>
                                <Button onClick={() => reload()} icon={<ReloadOutlined />} />
                            </Space>
                        </Col>
                        <Col className='config-height' span={10} >
                            <Input.Search
                                className="config-input"
                                placeholder="Nhập email/tên thành viên"
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
                        size="small"
                    />

                </Card>
            </Spin>
            <EditFormEmployee
                visible={showEdit}
                setVisible={setShowEdit}
                onEdit={onEdit}
                record={recordEdit}
                isSaving={isSaving}
                isView={isView}
                isNew={isNew}
            />
            <ChangePassEmployee
                visible={showModalChangePass}
                onChangePass={onChangePass}
                isSaving={isSaving}
                setVisible={setShowModalChangePass}
                record={recordEdit}
            />
        </div>
    );
};