import React from 'react';
import { AccountReplaceDto, McasOrganizationStandardApi, McasOrganizationStandardDto } from '@/services/client';
import { Card, Col, Input, Row, Button, Select, Spin, Form, Table, Space, AutoComplete, Divider } from 'antd';
import { DeleteOutlined, SearchOutlined, PlusCircleOutlined, CheckSquareOutlined, BorderOutlined, EditOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { validateMessages } from '@/core/contains';
import { useModel } from 'umi';
import defineColumns from './columns';
import SearchCusomter from '../PopupCustomer';
const { Option } = Select;

const groupServiceFrice = [
    { value: 1, label: "Đồng giá nhanh" },
    { value: 2, label: "Đồng giá hỗn hợp" }
]

export default (props: Props) => {

    const [, setPage] = React.useState(1);
    const { isLoading } = useModel('routeServiceSamePriceModels');
    const [form] = Form.useForm();
    const [isShowSelectAll, setIsShowSelectAll] = useState<boolean>(true);
    const [isOpenPopupSearchCustomer, setIsOpenPopupSearchCustomer] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    const [type, setType] = useState<any>("FIXED");
    const [dataSource, setDataSource] = useState<any[]>([]);

    useEffect(() => {
        setDataSource([{ key: 1, accntCode: "10", groupServicePrice: 1 }]);
    }, [])



    const deleteRecord = (id: any) => {
        const newDataSource = [...dataSource];
        const index = newDataSource.findIndex(item => item.key == id);
        if (index >= 0) {
            newDataSource.splice(index, 1);
        }
        setDataSource(newDataSource);
    }


    const action = (id: any): React.ReactNode => {
        return <Space key={id}>
            <Button className="btn-outline-info" onClick={() => deleteRecord(id)} size="small"><EditOutlined /></Button>
            <Button className="btn-outline-danger" onClick={() => deleteRecord(id)} size="small"><DeleteOutlined /></Button>
        </Space>
    }

    const onChangeGroupServicePrice = (id: any, record: any, value: string) => {
        const newDataSource = [...dataSource];
        console.log(newDataSource, id);

        const index = newDataSource.findIndex(item => { return item.key === record.key });
        console.log("index", index);

        if (index >= 0) {
            newDataSource[index].groupServicePrice = value;
            setDataSource(newDataSource);
        }

    }
    const onChangeSelectBox = (id: any, record: any) => {
        return (
            <Select
                style={{ width: '100%' }}
                key={id}
                placeholder="Đơn vị"
                allowClear
                value={record?.groupServicePrice || ""}
                onChange={(value) => onChangeGroupServicePrice(id, record, value)}
            // disabled={true}
            >
                {groupServiceFrice.map((item) => {
                    return (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                    )
                })}
                {/* <Option key={1} value={"BĐT"}>10 - Hà Nội</Option>
                <Option key={1} value={"BĐT"}>10 - Hà Nội</Option> */}
            </Select>
        )
    }

    const columns: any[] = defineColumns(action, onChangeSelectBox);

    const onAddCustomerToTable = (data: any) => {
        console.log("dataAdd", data);
        setDataSource(data);

    }

    const onSelectChange = (newSelectedRowKeys: any) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const SelectedAll = () => {
        let newSelectedRowKeys = [];
        newSelectedRowKeys = dataSource.map((element: any) => element.key);
        onSelectChange(newSelectedRowKeys);
        setIsShowSelectAll(false);
    };

    const cancelSelectedAll = () => {
        setSelectedRowKeys([]);
        setIsShowSelectAll(true);
    };

    const onDeleteCustomersChoose = () => {

    }


    return (
        <Spin spinning={isLoading}>
            <Form
                name="form-route-service-parity"
                labelCol={{ flex: '150px' }}
                labelAlign='left'
                labelWrap
                // onFinish={onFinish}
                form={form}
                initialValues={{
                    typeCode: type,
                    bdtCode: 'BĐT'
                }}
                validateMessages={validateMessages}
            >
                <Card>
                    <Row justify="space-evenly" gutter={24} >
                        <Col span={6}>
                            <Form.Item label='Đơn vị' name="bdtCode" style={{ wordWrap: 'initial' }}>
                                <Select
                                    placeholder="Đơn vị"
                                    allowClear
                                    disabled={true}
                                >
                                    <Option key={1} value={"BĐT"}>10 - Hà Nội</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label='Mã khách hàng CMS'
                                name="cmsCustomer"
                            >
                                <Input
                                    placeholder="Mã khách hàng CMS"
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="contractNumber"
                                label='Số hợp đồng'
                            >
                                <Input allowClear placeholder='số hợp đồng'
                                >
                                    {/* {dataToSelectBox(options, 'orgCode', 'orgName')} */}
                                </Input>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="serviceGroup"
                                label='Nhóm dịch vụ đồng giá'
                            >
                                <Input allowClear placeholder='Nhóm dịch vụ đồng giá'
                                >
                                    {/* {dataToSelectBox(options, 'orgCode', 'orgName')} */}
                                </Input>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="deliveryService"
                                label='Dịch vụ chuyển phát'
                            >
                                <Input allowClear placeholder='Dịch vụ chuyển phát'
                                >
                                    {/* {dataToSelectBox(options, 'orgCode', 'orgName')} */}
                                </Input>
                            </Form.Item>
                        </Col>
                        <Col flex={'auto'} />
                    </Row>
                </Card>
            </Form>
            <SearchCusomter isOpenPopup={isOpenPopupSearchCustomer} setIsOpenPopup={setIsOpenPopupSearchCustomer} itemCode='123' setCustomer={onAddCustomerToTable} />
            <Card>
                <Row gutter={8}>
                    <Col span={6}>
                        <Space className="button-group" style={{ textAlign: 'end' }}>
                            {isShowSelectAll && <Button className='custom-btn2 btn-outline-success' icon={<CheckSquareOutlined />} onClick={() => SelectedAll()}>Chọn tất cả</Button>}
                            {!isShowSelectAll && <Button className='custom-btn2 btn-outline-danger' icon={<BorderOutlined />} onClick={() => cancelSelectedAll()}>Hủy chọn</Button>}
                        </Space>
                    </Col>
                    <Col flex={'auto'} style={{ textAlign: 'end' }}>
                        <Button className='btn-outline-info' style={{ marginRight: "10px" }} icon={<PlusCircleOutlined />} onClick={() => setIsOpenPopupSearchCustomer(true)} >Thêm mới</Button>
                        <Button className='custom-btn1 btn-outline-danger' title='Xóa' icon={< DeleteOutlined />} type="primary" onClick={() => onDeleteCustomersChoose}>Xoá</Button>
                    </Col>
                </Row>
                <Row gutter={8}>

                    <Col span={24}>
                        <Table
                            rowSelection={rowSelection}
                            size='small'
                            dataSource={dataSource}
                            pagination={{
                                defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'], onChange(current) {
                                    setPage(current);
                                }
                            }}
                            columns={columns}
                            bordered
                        />
                    </Col>
                </Row>

            </Card>
        </Spin>
    )
}