import { AuditOutlined, DeleteOutlined, EditOutlined, EyeOutlined, ReloadOutlined, PlusCircleOutlined, SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, Popconfirm, Row, Space, Spin, Table, notification, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import defineColumns from './columns';
import type { McasGroupDto, McasMenuByGroupPermissionAllDto } from '@/services/client';
import { useModel } from 'umi';
import EditFormMcasGroup from './edit-form';

// import { groupBy } from 'lodash';
// import { name } from './../../../auth/plugins/d3/dist/package';
import MenuTree from './menutree';
import { PageContainer } from '@ant-design/pro-layout';


export default () => {
    const { dataSource, reload, dataTreeList, loadTreeGroup, isLoading, isSaving, deleteRecord, createRecord, updateRecord, saveMenuTree } = useModel('mcasGroupList')
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [showTree, setShowTree] = useState<boolean>(false);
    const [isView, setIsView] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<McasGroupDto>();
    const [searchValue, setSearchValue] = useState<string>();
    const [searchDoituong, setSearchDoituong] = useState<string>();

    const [dataTable, setDataTable] = useState<McasGroupDto[]>([]);
    const [dataTree, setDataTree] = useState<McasMenuByGroupPermissionAllDto[]>([]);
    const [groupName, setGroupName] = useState<string>();
    //const [groupKey, setGroupKey] = useState<string>();
    const [actionSave, setActionSave] = useState<string>();
    const [, setPage] = React.useState(1);

    useEffect(() => {
        reload();
    }, []);
    useEffect(() => {
        if (!searchValue) {
            setDataTable(dataSource);
        } else {
            setDataTable(dataSource.filter(d => d.groupCode?.includes(searchValue) || d.name?.includes(searchValue) && (d.isInternalUser === searchDoituong)))
        }
    }, [dataSource])

    useEffect(() => {
        if (recordEdit && showTree) {
            //Load DL từ DB
            //console.log('1. Bắt đầu call API từ backen: ', recordEdit.groupCode);
            loadTreeGroup(recordEdit.groupCode);
            setGroupName(recordEdit.name);
        }
    }, [showTree]);

    useEffect(() => {
        if (dataTreeList) {
            //console.log('2. Đã lấy dc DL tree', dataTreeList);
            setDataTree(dataTreeList);
        }
    }, [dataTreeList]);

    const toggleShowEdit = () => {
        if (showEdit) {
            setRecordEdit(undefined);
        }
        setShowEdit(!showEdit);
    }
    const handleCreate = () => {
        setRecordEdit(undefined);
        setShowEdit(true);
        setActionSave('New');
    }
    const handleEdit = (record: McasGroupDto) => {
        toggleShowEdit();
        setRecordEdit(record);
        setIsView(false);
        setActionSave('Edit');
    }
    const handleView = (record: McasGroupDto) => {
        toggleShowEdit();
        setRecordEdit(record);
        setIsView(true);
        setActionSave('view');
    }
    const handleAudit = (record: McasGroupDto) => {
        //setShowModalChangePass(true);
        setShowTree(true);
        setRecordEdit(record);
    }
    const onEdit = (values: any) => {
        console.log('GHI NHOM ', values);
        if (recordEdit) {
            // update
            updateRecord(recordEdit.groupCode!, values, () => toggleShowEdit());
        } else {
            createRecord(values, () => toggleShowEdit());
        }
    }

    const action = (groupCode: string, record: McasGroupDto): React.ReactNode => {
        return <Space key={groupCode}>
            <Button className="btn-outline-secondary" size="small" onClick={() => handleView(record)}><EyeOutlined /></Button>
            <Button className="btn-outline-info" size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
            <Popconfirm
                title="Bạn chắc chắn muốn đóng?"
                onConfirm={() => deleteRecord(record)}
                okText="Đồng ý"
                cancelText="Hủy bỏ"
            >
                <Button className="btn-outline-danger" size="small"><DeleteOutlined /></Button>
            </Popconfirm>
            <Button className="btn-outline-primary" size="small" onClick={() => handleAudit(record)}><AuditOutlined /></Button>
        </Space>
    }

    const onSaveMenuTree = (value: React.Key[]) => {
        //console.log('call API groupList->>>>>>>', value, ' recordEdit ', recordEdit?.groupCode);
        if (recordEdit !== undefined) {
            saveMenuTree(value, recordEdit.groupCode, () => loadTreeGroup(recordEdit.groupCode));
        }
        else {
            notification.error({ message: 'Nhóm được gán quyền không tồn tại' })
        }
    }
    const columns: any[] = defineColumns(action);

    const onBlurSearchValue = (e: any) => {
        setSearchValue(e.target.value);
    }

    // const onBlurSearchName = (e: any) => {
    //     setGroupName(e.target.value);
    // }

    const onChangeDoituong = (e: any) => {
        //console.log('GHI onChangeDoituong ', e);
        setSearchDoituong(e);
    }

    const handleSearch = () => {
        //console.log('searchDoituong: ', searchDoituong, ' searchValue ', searchValue)
        //if (searchValue !== undefined) {
        setDataTable(dataSource.filter(d => (d.groupCode?.includes(searchValue) || d.name?.includes(searchValue) || searchValue === undefined) && (d.isInternalUser === (searchDoituong === 'true') || searchDoituong === undefined)))
        //}

    }

    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Card className="fadeInRight" size='small' bordered={false}>
                        <Row gutter={8}>
                            <Col span={6}>
                                <Input
                                    className="config-input"
                                    placeholder="Nhập mã nhóm/tên nhóm"
                                    allowClear
                                    style={{ width: "100%" }}
                                    //onSearch={(value) => setSearchValue(value)}
                                    onBlur={onBlurSearchValue}
                                />
                            </Col>
                            <Col span={6}>
                                <Select style={{ width: '100%' }} placeholder="Đối tượng" onChange={onChangeDoituong} allowClear>
                                    <Option value="true">Nội bộ</Option>
                                    <Option value="false">Khách hàng</Option>
                                </Select></Col>
                            <Col span={12}>
                                <Space>
                                    <Button icon={<SearchOutlined />} title='Tìm kiếm' onClick={handleSearch} className='custom-btn2 btn-outline-info' >Tìm kiếm</Button>
                                    <Button icon={<PlusCircleOutlined />} className="custom-btn2 btn-outline-info" onClick={handleCreate}>Thêm mới</Button>
                                </Space>
                            </Col>
                        </Row>
                        <br />
                        <Row gutter={8}>
                            <Col span={24}>
                                <Table
                                    size='small'
                                    dataSource={dataTable}
                                    columns={columns}
                                    bordered
                                    pagination={{
                                        defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '50', '100'], onChange(current) {
                                            setPage(current);
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Spin>
            </PageContainer>
            <EditFormMcasGroup
                visible={showEdit}
                setVisible={setShowEdit}
                onEdit={onEdit}
                record={recordEdit}
                isSaving={isSaving}
                isView={isView}
                iaction={actionSave}
            />

            <MenuTree
                visible={showTree}
                setVisible={setShowTree}
                dataTree={dataTree}
                isSaving={isSaving}
                groupName={groupName}
                onSaveMenu={onSaveMenuTree}

            />

        </div>
    );
};