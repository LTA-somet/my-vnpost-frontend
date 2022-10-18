import React from 'react';
import { AccountReplaceDto, McasOrganizationStandardApi, McasOrganizationStandardDto } from '@/services/client';
import { Card, Col, Input, Row, Button, Select, Spin, Form, TreeSelect, Tabs } from 'antd';
import { DeleteOutlined, SearchOutlined, PlusCircleOutlined, CheckSquareOutlined, BorderOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { validateMessages } from '@/core/contains';
import SearchMixedPrice from './SearchMixedPrice';
import SearchFastPrice from './SearchFastPrice';
import NewFastPrice from './NewFastPrice';
import MixedRouting from './MixedRouting';
const { Option } = Select;
const { TreeNode } = TreeSelect;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const { TabPane } = Tabs;


const AccountReplace = () => {
    // const { searchAllByParam, deleteRecord, onCreate, dataSource, showEdit, setShowEdit, isLoading, setIsLoading } = useModel('accountReplaceModel')
    const [form] = Form.useForm();
    const { isLoading, lstOrganization, lstSearchRouterSameValueDto, setLstSearchRouterSameValueDto, lstSearchRouterFastDto, setLstSearchRouterFastDto,
        findLstOrganizationByUnitCode, onSearchRouterSameValue, onSearchRouterFast } = useModel('routeServiceSamePriceModels');
    const { initialState } = useModel('@@initialState');
    const user = initialState?.accountInfo;
    // const [searchMixedPriceData, setSearchMixedPriceData] = useState<any[]>([]);
    // const [treeLine, setTreeLine] = useState(true);
    // const [showLeafIcon, setShowLeafIcon] = useState(false);
    const [tab, setTab] = useState<string>("1");

    useEffect(() => {
        findLstOrganizationByUnitCode(user?.org || "");
    }, []);

    const onFinish = (param: any, typeCode: string) => {
        console.log("param", param);
        if (typeCode == 'DGHH') {
            onSearchRouterSameValue(typeCode, param?.bdtCode, param?.routeName, param?.contractNumber, param?.cmsCustomer, param?.serviceGroupId, param?.serviceCode);
        } else {
            onSearchRouterFast(param?.bdtCode, param?.contractNumber, param?.cmsCustomer, param?.serviceGroupSamePrice, param?.serviceCode);
        }
    }

    const onChange = (key: string) => {
        setTab(key);
    };


    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Tabs defaultActiveKey="1" type="card" size={'large'} onChange={onChange}>
                        <TabPane tab="Đồng giá hỗn hợp" key="1"  >
                            <Card style={{ marginTop: "-15px" }} >
                                <Form
                                    name="form-route-service-parity"
                                    labelCol={{ flex: '150px' }}
                                    labelAlign='left'
                                    labelWrap
                                    onFinish={(param) => onFinish(param, 'DGHH')}
                                    form={form}
                                    initialValues={{
                                        typeCode: "DGHH",
                                        bdtCode: user?.org
                                    }}
                                    validateMessages={validateMessages}
                                >
                                    <Row gutter={24} >
                                        <Col span={6}>
                                            <Form.Item
                                                // label='Đơn vị' 
                                                name="bdtCode"
                                                style={{ wordWrap: 'initial' }}>
                                                <Select
                                                    placeholder="Đơn vị khai báo"
                                                    allowClear
                                                >
                                                    {lstOrganization.map((item: any) => {
                                                        if (item?.level <= 2) {
                                                            return (
                                                                <Option key={item?.unitCode} value={item?.unitCode}>{item?.unitCode + "-" + item?.unitName}</Option>
                                                            )
                                                        }
                                                    })}

                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item name="cmsCustomer">
                                                <Input
                                                    placeholder="Mã khách hàng CMS"
                                                    allowClear
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item name="contractNumber">
                                                <Input allowClear placeholder='Số hợp đồng' />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item name="routeName">
                                                <Input allowClear placeholder='Tên định tuyến' />
                                            </Form.Item>
                                        </Col>
                                        <Col flex={'auto'}>
                                            <Button icon={<SearchOutlined />} style={{ float: "right" }} className='btn-outline-info' title='Tìm kiếm' htmlType='submit' >Tìm kiếm</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                            <SearchMixedPrice dataSource={lstSearchRouterSameValueDto} setDataSource={() => setLstSearchRouterSameValueDto} />
                            {/* <MixedRouting dataSource={} setDataSource() /> */}
                        </TabPane>
                        <TabPane tab="Đồng giá nhanh" key="2">
                            <Card style={{ marginTop: "-15px" }} >
                                <Form
                                    name="form-route-service-parity"
                                    labelCol={{ flex: '150px' }}
                                    labelAlign='left'
                                    labelWrap
                                    onFinish={(param) => onFinish(param, 'DGNTK')}
                                    form={form}
                                    initialValues={{
                                        typeCode: "DGNTK",
                                        bdtCode: user?.org
                                    }}
                                    validateMessages={validateMessages}
                                >
                                    <Row justify="space-evenly" gutter={24} >
                                        <Col span={6}>
                                            <Form.Item name="bdtCode" style={{ wordWrap: 'initial' }}>
                                                <Select
                                                    placeholder="Đơn vị khai báo"
                                                    allowClear
                                                >
                                                    {lstOrganization.map((item: any) => {
                                                        if (item?.level <= 2) {
                                                            return (
                                                                <Option
                                                                    key={item?.unitCode} value={item?.unitCode}>{item?.unitCode + "-" + item?.unitName}</Option>
                                                            )
                                                        }
                                                    })}

                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item name="cmsCustomer">
                                                <Input
                                                    placeholder="Mã khách hàng CMS"
                                                    allowClear
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item name="contractNumber">
                                                <Input allowClear placeholder='Số hợp đồng' />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item name="serviceGroupSamePrice">
                                                <Input allowClear placeholder='Nhóm dịch vụ đồng giá' />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item name="serviceCode">
                                                <Input allowClear placeholder='Dịch vụ chuyển phát' />
                                            </Form.Item>
                                        </Col>
                                        <Col flex={'auto'}>
                                            <Button icon={<SearchOutlined />} style={{ float: "right" }} className='btn-outline-info' title='Tìm kiếm' htmlType='submit' >Tìm kiếm</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                            <Card>
                                {/* <SearchFastPrice dataSource={lstSearchRouterSameValueDto} setDataSource={() => setSearchMixedPriceData} /> */}
                                <SearchFastPrice dataSource={lstSearchRouterFastDto} setDataSource={() => setLstSearchRouterFastDto} />
                            </Card>
                        </TabPane>
                    </Tabs>

                </Spin>
            </PageContainer>

        </div >
    );

};
export default AccountReplace;


