import { SearchOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Space, Table, Form, TreeSelect, notification, Checkbox } from 'antd';
import React, { useState, useEffect } from 'react';
import defineColumns from './columns';
import { useModel } from 'umi';

// import { groupBy } from 'lodash';
// import { name } from './../../../auth/plugins/d3/dist/package';
import ConfigUser from './configuser';
import { McasUserDto } from './../../../services/client/api';
import { useCurrentUser } from '@/core/selectors';
import { PageContainer } from '@ant-design/pro-layout';

export default () => {
    const { dataSourceUsers, searchUser, isLoading, dataSourceOrgTree, selectChildren } = useModel('mcasUserList')
    const [showAssign, setShowAssign] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<McasUserDto>();

    const [dataTable, setDataTable] = useState<McasUserDto[]>([]);
    const [dataTableOrgTree, setDataTableOrgTree] = useState<any[]>([]);


    const [userName, setUserName] = useState<any>();
    const [employeeName, setEmployeeName] = useState<any>();
    const [orgCode, setOrgCode] = useState<any>();
    const [, setPage] = React.useState(1);
    const [isLoad, setIsLoad] = useState<boolean>(true);

    const [keyTree, setKeyTree] = useState<string>();
    const [isShowChilren, setIsShowChilren] = useState<number>(0);

    const currentUser = useCurrentUser();
    //const isSender: boolean = true;


    useEffect(() => {
        if (isLoad) {
            setIsLoad(false);
            searchUser(userName, employeeName, orgCode, 0, 0, 20);
            selectChildren(orgCode);
            setKeyTree(currentUser.org);

            //console.log('currentUser', currentUser);
        }

    }, [])

    useEffect(() => {
        //Lấy ds các đon vị con của đơn vị theo user đăng nhập        
        // const orgTree = dataSourceOrgTree.map((org) => {
        //     return {
        //         value: org.unitCode,
        //         id: org.unitCode,
        //         title: org.unitName,
        //         pId: org.parentCode
        //     };
        // });
        setDataTableOrgTree(dataSourceOrgTree);
    }, [dataSourceOrgTree])

    useEffect(() => {
        //Lấy danh sách các user theo đơn vị

        setDataTable(dataSourceUsers);
    }, [dataSourceUsers])
    const handleAssign = (record: McasUserDto) => {
        //console.log('1. Hiện thị màn hình gán nhóm quyền cho User:', record.username);
        setRecordEdit(record);
        // selectGroupNotInUserGroupByUser(record);
        // selectGroupInUserGroupByUser(record);
        setShowAssign(true);
    }

    const handleSearch = () => {
        console.log('CALL BACK IN HERE, userName', userName, ' ---- ', employeeName);
        if (orgCode !== undefined && orgCode !== null) {
            searchUser(userName, employeeName, orgCode, isShowChilren, 0, 2000);
        }
        else if (keyTree !== undefined && keyTree !== null) {
            searchUser(userName, employeeName, keyTree, isShowChilren, 0, 2000);
        }
        else {
            notification.warn({ message: 'Bạn chưa chọn đơn vị' });
        }
        // test().then(function (v1) {

        //     getJSONAsync();
        // }); // "something", "hello async"

        // // takeLongTime().then(v => {
        // //     console.log("got", v);
        // // });~

        // //testpromise();
        // doIt();
        // getJSONAsync().then(function msgOk() {
        //     console.log('THEN');
        // }).catch(function msgErr() {
        //     console.log('THEERROR');
        // })
        //console.log('getJSON-> promise:', getJSON());
    };

    const action = (username: string, record: McasUserDto): React.ReactNode => {
        return <Space key={username}>
            <Button className="btn-outline-info" size="small" onClick={() => handleAssign(record)}><UsergroupAddOutlined /></Button>
        </Space>
    }

    const columns: any[] = defineColumns(action);

    const onBlurUserName = (e: any) => {
        setUserName(e.target.value)
    }

    const onBlurEmployeeName = (e: any) => {
        setEmployeeName(e.target.value)
    }

    // const onBlurOrgCode = (e: any) => {
    //     setOrgCode(e.target.value)
    // }

    const onChangeOrg = (value, label) => {
        setOrgCode(value);
        setKeyTree(value);
        //console.log('tree select value', value, 'label ', label);
    }

    const onChangeChildren = (value: boolean) => {
        //console.log('onChangeValue', value);
        setIsShowChilren(value ? 1 : 0);
    }
    return (
        <div>
            <PageContainer>
                {/* <Spin spinning={!isLoading}> */}
                <Card className="fadeInRight" style={{ fontSize: '16px', color: '#00549a' }}>
                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item
                                name="username"
                            >
                                <Input id='form-assign-user_username' placeholder='Nhập mã người dùng' onBlur={onBlurUserName} />
                            </Form.Item>
                        </Col>
                        <Col span={7}>
                            <Form.Item
                                name="name"

                            >
                                <Input id='form-assign-user_name' placeholder='Nhập tên người dùng' onBlur={onBlurEmployeeName} />
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            <TreeSelect

                                showSearch={true}
                                // filterTreeNode={(input, option) =>
                                //     searchText(option.title.toLowerCase(), input)
                                //     //option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                // }
                                treeDataSimpleMode
                                style={{ width: '100%' }}
                                value={keyTree}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', minWidth: 350 }}
                                placeholder="Chọn đơn vị"
                                onChange={onChangeOrg}
                                treeData={dataTableOrgTree}
                            />
                        </Col>
                        <Col span={3}>
                            <Form.Item
                                name="chkChildren"
                            >
                                <Checkbox onChange={e => onChangeChildren(e.target.checked)}>Hiện thị đơn vị cấp dưới</Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Col style={{ float: 'right', paddingBottom: '20px' }}>
                        <Button className='custom-btn1 btn-outline-info' icon={<SearchOutlined />} onClick={handleSearch}  >Tìm kiếm</Button>
                    </Col>
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
                </Card>
                {/* </Spin> */}
            </PageContainer>

            <ConfigUser
                visible={showAssign}
                isLoading={isLoading}
                setVisible={setShowAssign}
                record={recordEdit}
            />

        </div >
    );
};
