import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { Card, Col, Input, Row, Button, Spin, Form, Table, Space, Divider, Modal, notification } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { validateMessages } from '@/core/contains';
import defineColumns from './columm-customer';

const generateKey = (pre: any) => {
    const randomNumber = Math.floor((Math.random() * 1000000000) + 1);
    return `${pre}_${new Date().getTime()}_${randomNumber}`;
}

const SearchCusomter = (props: Props) => {
    const { isLoading, getInforContract } = useModel('routeServiceSamePriceModels');
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const columns: any[] = defineColumns();

    const onFinish = (param: any) => {
        if (param?.accntCode != null || param?.accntTel != null || param?.contractNumber != null || param?.cppaNumber != null) {
            getInforContract(param?.accntCode, param?.accntTel, param?.contractNumber, param?.cppaNumber, (success: boolean, data: any[]) => {
                if (success == true) {
                    const newDataSource: any[] = [];
                    data.forEach((item: any) => {
                        const newItem: any = {};
                        newItem.accntTel1 = item.accntTel1;
                        newItem.customerCode = item.accntCode;
                        newItem.customerName = item.accntName;
                        newItem.managedOrg = item?.managedOrg;
                        newItem.managedOrgName = item?.managedOrgName;
                        const customerRelationshipModels: any[] = item?.customerRelationshipModels;
                        const contractModels: any[] = item?.contractModels;
                        contractModels.forEach(contract => {
                            const newItem1 = Object.assign({}, newItem);
                            newItem1.contractNumber = contract?.contractNumber;
                            newItem1.contractName = contract?.contractName;
                            newItem1.contractSignDate = contract?.contractSignDate;
                            newItem1.contractValidDate = contract?.contractValidDate;
                            if (customerRelationshipModels.length > 0) {
                                newItem1.key = generateKey(item?.accntId)
                                customerRelationshipModels.forEach(relation => {
                                    if (relation?.systemName == "CRM") {
                                        newItem1.systemCustomerId = relation?.systemCustomerId;
                                    } else if (relation?.systemName == "QLKHHCM") {
                                        newItem1.reminderCode = relation?.systemCustomerId;
                                    }
                                });
                                newDataSource.push(newItem1);
                            } else {
                                newItem1.key = generateKey(item?.accntId)
                                newDataSource.push(newItem1);
                            }
                        })
                    })
                    console.log("newDATa", newDataSource);

                    setDataSource(newDataSource);
                }
            });
        } else {
            notification.info({
                message: "Phải nhập ít nhất một tham số"
            })
        }

    }

    const onAddData = () => {
        const newDataSource = [...dataSource];
        const dataFilter = newDataSource.filter(item => {
            return selectedRowKeys.includes(item.key);
        })
        props.setCustomer(dataFilter);
        props.setIsOpenPopup(false);
    }

    return (
        <Spin spinning={isLoading}>
            <Modal
                title={"Tìm thông tin khách hàng hợp đồng"}
                visible={props.isOpenPopup}
                width={1200}
                onOk={() => props.setIsOpenPopup(false)}
                onCancel={() => props.setIsOpenPopup(false)}
                footer={null}
            >
                <Form
                    name="form-route-service-parity"
                    labelCol={{ flex: '150px' }}
                    labelAlign='left'
                    labelWrap
                    onFinish={onFinish}
                    form={form}
                    initialValues={{

                    }}
                    validateMessages={validateMessages}
                >
                    <Card>
                        <Row justify="space-evenly" gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="accntTel"
                                    label='Số điện thoại'
                                >
                                    <Input allowClear placeholder='Số điện thoại'
                                    >
                                        {/* {dataToSelectBox(options, 'orgCode', 'orgName')} */}
                                    </Input>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="accntCode"
                                    label='Mã khách hàng'
                                >
                                    <Input allowClear placeholder='Mã khách hàng'
                                    >
                                        {/* {dataToSelectBox(options, 'orgCode', 'orgName')} */}
                                    </Input>
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row justify="space-evenly" gutter={24} >
                            <Col span={12}>
                                <Form.Item
                                    name="contractNumber"
                                    label='Số hợp đồng'
                                >
                                    <Input allowClear placeholder='Số hợp đồng'
                                    >
                                        {/* {dataToSelectBox(options, 'orgCode', 'orgName')} */}
                                    </Input>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="cppaNumber"
                                    label='Số C/PPA'
                                >
                                    <Input allowClear placeholder='Số C/PPA'
                                    >
                                        {/* {dataToSelectBox(options, 'orgCode', 'orgName')} */}
                                    </Input>
                                </Form.Item>
                            </Col>
                            <Col flex={'auto'} />
                        </Row>
                        <Row justify="space-evenly" gutter={24} style={{ float: 'right' }}>
                            <Col >
                                <Button icon={<SearchOutlined />} style={{ float: "right" }} className='btn-outline-info' title='Tìm kiếm' htmlType='submit' >Tìm kiếm</Button>
                            </Col>
                        </Row>
                    </Card>
                    <Divider />
                </Form>
                <span style={{ marginLeft: 8, border: '2px solid rgba(0, 0, 0, 0.05)' }}>
                    {`Đã chọn ${selectedRowKeys.length} mục`}
                </span>
                <Table
                    rowSelection={rowSelection}
                    bordered
                    columns={columns}
                    dataSource={dataSource}
                    // pagination={false}
                    pagination={pagination}
                    size='small'
                />
                <Row justify="space-evenly" gutter={24} style={{ float: 'right' }}>
                    <Col >
                        <Button icon={<SearchOutlined />} style={{ float: "right" }} className='btn-outline-info' title='Tìm kiếm' onClick={onAddData} >Xác nhận</Button>
                    </Col>
                </Row>
                <p></p>
            </Modal>
        </Spin>
    )

}
type Props = {
    isOpenPopup: boolean;
    itemCode: string;
    setIsOpenPopup: (isOpenPopup: boolean) => void;
    setCustomer: (data: any) => void;
}
export default SearchCusomter;