import { DeleteOutlined, EditOutlined, ReloadOutlined, CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Drawer, Input, Popconfirm, Row, Space, Spin, Table } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import defineColumns from './columns';
import EditFormMenu from './edit';
import type { MenuDto } from '@/services/client';
import { useModel } from 'umi';
import { dataToTree } from '@/utils';


export default () => {
    const { dataSource, reload, isLoading, isSaving, deleteRecord, createRecord, updateRecord } = useModel('menuList');
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<MenuDto>();
    const [searchValue, setSearchValue] = useState<string>();
    const [dataTable, setDataTable] = useState<MenuDto[]>([]);
    const [treeData, setTreeData] = useState<any[]>([]);

    useEffect(() => {
        reload();
    }, [])

    useEffect(() => {
        if (!searchValue) {
            setDataTable(dataSource);
        } else {
            setDataTable(dataSource.filter(d => d.menuCode?.includes(searchValue)))
        }
    }, [dataSource, searchValue]);


    useEffect(() => {
        const tree = dataToTree(dataTable, 'menuCode', 'parentCode');
        setTreeData(tree);
    }, [dataTable]);

    const toggleShowEdit = () => {
        setShowEdit(!showEdit);
    }
    const handleCreate = () => {
        setRecordEdit(undefined);
        toggleShowEdit();
    }
    const handleEdit = (record: MenuDto) => {
        toggleShowEdit();
        setRecordEdit(record);
    }
    const onEdit = (formValue: any) => {
        console.log('formValue', formValue);

        const values: MenuDto = { ...formValue, url: (formValue.method ?? '') + (formValue.url ?? '') }
        if (recordEdit) {
            // update
            updateRecord(recordEdit!.menuCode!, values, () => toggleShowEdit());
        } else {
            createRecord(values, () => toggleShowEdit());
        }
    }
    const onDelete = (menuCode: string) => {
        deleteRecord(menuCode);
    }

    const action = (menuCode: string, record: MenuDto): React.ReactNode => {
        return <Space key={menuCode}>
            <Button title='Sửa' className="btn-outline-info" size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
            <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                onConfirm={() => onDelete(menuCode)}
                okText="Đồng ý"
                cancelText="Hủy bỏ"
            >
                <Button title='Xóa' className="btn-outline-danger" size="small"><DeleteOutlined style={{ color: 'red' }} /></Button>
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
                                    <Button className="btn-outline-info" icon={<PlusCircleOutlined />} onClick={handleCreate}>Thêm mới</Button>
                                    <Button onClick={() => reload()} icon={<ReloadOutlined />} />
                                </Space>
                            </Col>
                            <Col span={10} >
                                <Input.Search
                                    placeholder="Nhập mã menu"
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
                            dataSource={treeData}
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
                        <Button className='btn-outline-success' icon={<SaveOutlined />} htmlType="submit" form="form-create-menu" type="primary" loading={isSaving}>
                            Lưu
                        </Button>
                        <div style={{ width: 80 }} />
                    </Space>
                }
            >
                {showEdit && <EditFormMenu
                    record={recordEdit}
                    onEdit={onEdit}
                    menuTree={treeData}
                />}
            </Drawer>
        </div>
    );
};