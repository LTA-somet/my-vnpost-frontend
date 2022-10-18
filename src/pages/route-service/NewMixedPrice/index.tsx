import React from 'react';
import { Card, Col, Input, Row, Button, Select, Spin, Form, Divider, notification } from 'antd';
import { DeleteOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useModel, useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { validateMessages } from '@/core/contains';
import AddCustomerContract from '../AddCustomerContract';
import MixedRouting from '../MixedRouting';
import { FooterToolbar } from '@ant-design/pro-layout';
import {
    RequetMixedPriceDto,
} from '@/services/client';
import notifyList from '@/models/notifyList';
import { tree } from '@/pages/dashboard/plugins/d3/dist/d3';
const { Option } = Select;
export default () => {
    const { isLoading, lstOrganization, requetMixedPriceDto, onFindRouterMixedById,
        findLstOrganizationByUnitCode, onSaveDataMixedPriceDto } = useModel('routeServiceSamePriceModels');
    const { initialState } = useModel('@@initialState')
    const user = initialState?.accountInfo;
    const [form] = Form.useForm();

    const [routerSameValue, setRouterSameValue] = useState<any>();
    const [customerContractData, setCustomerContractData] = useState<any[]>([]);
    const [mixedRoutingData, setMixedRoutingData] = useState<any[]>([]);
    const [type, setType] = useState<any>("FIXED");
    const [checkAll, setCheckAll] = useState<boolean>(true);
    const [valueDefault, setValueDefault] = useState<any>({});

    const params: any = useParams();
    const id = params.id;
    function mapDtotoCustomer(data: RequetMixedPriceDto) {
        const newLstCustommer: any[] = [];
        data?.lstCustomerDto?.forEach((item: any) => {
            const newitem = Object.assign(item, data?.routerSameValueDto);
            newLstCustommer.push(newitem);
        })
        return newLstCustommer;
    }

    function mapDtoToDetail(data: RequetMixedPriceDto) {
        const newListDetail: any[] = [];
        data?.lstDetailDto?.forEach((item: any) => {
            const newitem = Object.assign(item, data?.routerSameValueDto);
            newListDetail.push(newitem);
        })
        return newListDetail;
    }

    useEffect(() => {
        if (lstOrganization.length <= 0) {
            findLstOrganizationByUnitCode(user?.org || "");
        }
        if (id) {
            onFindRouterMixedById(id, (success: boolean, data: RequetMixedPriceDto) => {
                if (success == true) {
                    if (data) {
                        setCustomerContractData(mapDtotoCustomer(data));
                        setMixedRoutingData(mapDtoToDetail(data));
                        form.setFieldsValue({
                            typeCode: type,
                            bdtCode: user?.org,
                            routeName: data?.routerSameValueDto?.routerName
                        })
                    }
                }

            });
        } else {
            form.setFieldsValue({
                typeCode: type,
                bdtCode: user?.org,
            })
        }
    }, []);

    console.log("mixedRoutingData", mixedRoutingData);

    function compare(a: any, b: any) {
        if (b.weightTo <= a.weightFrom || b.weightFrom >= a.weightTo) {
            return true;
        } else {
            return false;
        }
    }



    function checkMixedRoutingData() {
        const newMixedRoutingData = [...mixedRoutingData];
        newMixedRoutingData.forEach((a, index) => {
            newMixedRoutingData[index].check = null;
            newMixedRoutingData[index].log = null;
        });
        newMixedRoutingData.forEach((a, indexa) => {
            if (a.locationFrom > a.locationTo) {
                a.check = false;
                a.log = "Khối lượng từ > khối lượng đến"
            }
            mixedRoutingData.forEach((b, indexb) => {
                if (indexa != indexb) {
                    if (!compare(a, b)) {
                        setCheckAll(false);
                        newMixedRoutingData[indexa].check = false;
                        newMixedRoutingData[indexa].log = "Trùng khối lượng từ đến";
                    }
                }
            })
        })
        return newMixedRoutingData;
    }

    const onSaveData = () => {
        const newMixedRoutingData = checkMixedRoutingData();
        if (checkAll == true) {
            const param: RequetMixedPriceDto = {};
            param.routerSameValueDto = {
                routerId: routerSameValue?.routerId,
                areaFromCode: form.getFieldValue("bdtCode"),
                areaFromName: lstOrganization.find(item => item.unitCode == form.getFieldValue("bdtCode"))?.unitName,
                routerType: "DGHH",
                bdtCode: user?.org,
                routerName: form.getFieldValue("routeName"),
                orgCode: user?.org
            }
            const cloneCustomer: any[] = JSON.parse(JSON.stringify(customerContractData));
            const resultCustomer: any[] = cloneCustomer.map((item: any) => {
                return {
                    id: item?.id,
                    customerName: item?.customerName,
                    contractNumber: item?.contractNumber,
                    customerCode: item?.customerCode,
                    routerId: item?.routerId,
                }
            })
            param.lstCustomerDto = resultCustomer;

            const cloneDetail: any[] = JSON.parse(JSON.stringify(mixedRoutingData));
            const resultDetail: any[] = cloneDetail.map((item: any) => {
                const areaToCode = item?.areaToName.split("-")[0].trim();
                let areaToName = "";
                if (areaToCode) {
                    const itemOrg = lstOrganization.find(org => org.unitCode == item?.locationTo);
                    areaToName = itemOrg?.unitCode + "-" + itemOrg?.unitName;

                }
                return {
                    id: item?.id,
                    areaToCode: areaToCode,
                    areaToName: areaToName,
                    weightFrom: item?.weightFrom,
                    weightTo: item?.weightTo,
                    serviceCode: item?.serviceCode,
                    serviceGroupId: undefined,
                }
            })
            param.lstDetailDto = resultDetail;
            onSaveDataMixedPriceDto(param, (success: boolean, data: RequetMixedPriceDto) => {
                if (success == true) {
                    setRouterSameValue(data?.routerSameValueDto);
                    setCustomerContractData(data?.lstCustomerDto || []);
                    setMixedRoutingData(data?.lstDetailDto || []);
                    if (data?.checkAll == true) {
                        notification.success({
                            message: "Lưu thành công"
                        })
                    } else {
                        if (data?.routerSameValueDto?.check == false) {
                            notification.error({
                                message: "Trùng tên định tuyến"
                            })
                        } else {
                            notification.error({
                                message: "Dữ liệu không hợp lệ"
                            })
                        }
                    }

                } else {
                    notification.error({
                        message: "Không lưu được dữ liệu"
                    })
                }
            });
        } else {
            // setCustomerContractData(customerContractData);
            setMixedRoutingData(newMixedRoutingData);
            notification.error({
                message: "Dữ diệu không hợp lệ"
            })
        }
    }
    const onFinish = (param: any) => {
        console.log("param: ", param);
        onSaveData();

    }

    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Form
                        name="form-route-service-parity"
                        labelCol={{ flex: '150px' }}
                        labelAlign='left'
                        labelWrap
                        onFinish={onFinish}
                        form={form}
                        initialValues={valueDefault}
                        validateMessages={validateMessages}
                    >
                        <Card>
                            <Row justify="space-evenly" gutter={24} >
                                <Col span={12}>
                                    <Form.Item label='Đơn vị khai báo' name="bdtCode" style={{ wordWrap: 'initial' }}>
                                        <Select
                                            placeholder="Đơn vị khai báo"
                                            allowClear
                                            disabled={true}
                                        >
                                            {lstOrganization.map(item => {
                                                return (
                                                    <Option key={item?.unitCode} value={item?.unitCode}>{item?.unitCode + "-" + item?.unitName}</Option>
                                                )
                                            })}

                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="routeName"
                                        label='Tên định tuyến'
                                        rules={[{ required: true, message: 'Vui lòng nhập tên định tuyến!' }]}
                                    >
                                        <Input allowClear placeholder='Tên định tuyến'
                                        >
                                            {/* {dataToSelectBox(options, 'orgCode', 'orgName')} */}
                                        </Input>
                                    </Form.Item>
                                </Col>
                                <Col flex={'auto'} />
                            </Row>
                        </Card>
                        <Divider />
                        <AddCustomerContract dataSource={customerContractData} setDataSource={setCustomerContractData} />
                        <Divider />
                        <MixedRouting dataSource={mixedRoutingData} setDataSource={setMixedRoutingData} />
                        <FooterToolbar style={{ height: '50px' }}                        >
                            <Button className='btn-outline-info'
                                style={{ marginRight: '800px', minWidth: '120px' }}
                                icon={<PlusCircleOutlined />}
                                // onClick={() => onSaveData()} 
                                htmlType='submit'
                            >Lưu</Button>
                        </FooterToolbar>

                    </Form>
                </Spin>
            </PageContainer>
        </div>
    );

};


