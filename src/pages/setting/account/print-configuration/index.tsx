import { validateMessages } from '@/core/contains';
import { DmMauInApi, DmMauinDto, McasUserApi } from '@/services/client';
import { SaveOutlined } from '@ant-design/icons';
import { Card, Col, Form, FormInstance, Row, Spin, Button, Space, Checkbox, InputNumber, Select, message } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const dmMauInApi = new DmMauInApi();
const mcasUserApi = new McasUserApi();

const PrintConfiguration = () => {
    // const { dataSource, reload, loading, deleteRecord, createRecord, updateRecord } = useModel('useUomList');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listDmMauin, setListDmMauin] = useState<DmMauinDto[]>([]);
    const [form] = Form.useForm();
    const formRef = useRef<FormInstance>(null);
    const [checkIsDefault, setCheckIsDefault] = useState(false);

    const [checkIsHidePhone, setCheckIsHidePhone] = useState(false);
    const [checkIsHideAdd, setCheckIsHideAdd] = useState(false);

    const [checkIsHideFee, setCheckIsHideFee] = useState(false);
    const [checkIsHidePoscodeAccept, setCheckIsHidePoscodeAccept] = useState(false);
    const [checkIsHideMass, setCheckIsHideMass] = useState(false);
    const [checkIsHidePhoneReceiver, setCheckIsHidePhoneReceiver] = useState(false);


    useEffect(() => {
        form.validateFields(['isHideAdd', 'isDefault', 'isHidePhone', 'isHideFee', 'isHidePoscodeAccept']);
    }, [checkIsHideAdd, checkIsDefault, checkIsHidePhone, checkIsHideFee, checkIsHidePoscodeAccept]);

    const onChangeIsHideAdd = (e: { target: { checked: boolean } }) => {
        setCheckIsHideAdd(e.target.checked);
    };
    const onChangeIsDefault = (e: { target: { checked: boolean } }) => {
        setCheckIsDefault(e.target.checked);
    }
    const onChangeIsHidePhone = (e: { target: { checked: boolean } }) => {
        setCheckIsHidePhone(e.target.checked);
    };
    const onChangeIsHideFee = (e: { target: { checked: boolean } }) => {
        setCheckIsHideFee(e.target.checked);
    };
    const onChangeIsHidePoscodeAccept = (e: { target: { checked: boolean } }) => {
        setCheckIsHidePoscodeAccept(e.target.checked);
    };
    const onChangeIsHideMass = (e: { target: { checked: boolean } }) => {
        setCheckIsHideMass(e.target.checked);
    };
    const onChangeIsHidePhoneReceiver = (e: { target: { checked: boolean } }) => {
        setCheckIsHidePhoneReceiver(e.target.checked);
    };

    const onFinish = (values: any) => {
        if (values.mauinCode === "A7") { values.mauinCode = 'A7' };
        const data = {
            username: "",
            mauinCode: values.mauinCode,
            fontSize: values.fontSize ? values.fontSize : 10,
            // isHideAdd: checkIsHideAdd,
            isDefault: checkIsDefault,
            // isHidePhone: checkIsHidePhone,
            isHideFee: checkIsHideFee,
            isHidePoscodeAccept: checkIsHidePoscodeAccept,
            isHideMass: checkIsHideMass,
            isHidePhoneReceiver: checkIsHidePhoneReceiver
        }
        mcasUserApi.updatePrintConfig(data)
            .then((response: any) => {
                // console.log('response', response);

                if (response.data && response.status === 200) {
                    message.success('Cập nhật thành công !');
                } else {
                    message.error('Cật nhật thất bại !');
                }
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    const setValueForm = (entity: any) => {
        form.setFieldsValue({
            mauinCode: entity?.mauinCode,
            fontSize: entity?.fontSize,
        })
        setCheckIsHideAdd(entity?.isHideAdd);
        setCheckIsDefault(entity?.isDefault);
        setCheckIsHideFee(entity?.isHideFee);
        setCheckIsHidePhone(entity?.isHidePhone);
        setCheckIsHidePoscodeAccept(entity?.isHidePoscodeAccept);
        setCheckIsHideMass(entity?.isHideMass);
        setCheckIsHidePhoneReceiver(entity?.isHidePhoneReceiver);
    }

    const loadDataPrintConfig = useCallback((callback?: (success: boolean) => void) => {
        setIsLoading(true);
        mcasUserApi
            .getDataPrintConfig()
            .then((resp) => {
                if (resp.status === 200) {
                    setValueForm(resp.data);
                }
                if (callback) {
                    callback(resp.status === 200);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        loadDataPrintConfig();
    }, [])

    const loadGetListDmMauIn = useCallback((callback?: (success: boolean) => void) => {
        setIsLoading(true);
        dmMauInApi
            .findAllDmMauIn()
            .then((resp) => {
                if (resp.status === 200) {
                    setListDmMauin(resp.data);
                }
                if (callback) {
                    callback(resp.status === 200);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        loadGetListDmMauIn();
    }, [])

    const { Option } = Select;

    const tailLayout = {
        // wrapperCol: { offset: 6, span: 12 },
        labelCol: { span: 4, offset: 7 }
    };


    return (
        <div>
            <Spin spinning={isLoading}>
                <Card className="fadeInRight" bordered={false}>
                    <Form
                        name="form-print-configuration"
                        labelCol={{ flex: '200px' }}
                        labelAlign="left"
                        labelWrap
                        colon={false}
                        ref={formRef}
                        onFinish={onFinish}
                        form={form}
                        validateMessages={validateMessages}
                    >
                        <Row gutter={8}>
                            <Col span={24} offset={7}>
                                <Form.Item
                                    name="mauinCode"
                                    label="Thiết lập mẫu in mặc định"
                                    // labelCol={{ flex: '200px' }}
                                    rules={[{ required: true }]}
                                    initialValue="A7"
                                >
                                    <Select
                                        showSearch
                                        style={{ width: 400 }}
                                        placeholder="Chọn mẫu in"
                                    // defaultValue={"A7"}
                                    // onChange={onChangeMauin}
                                    >
                                        {listDmMauin.map(item => (
                                            <Option key={item.mauinCode}>{item.mauinName}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24} offset={7}>
                                <Form.Item
                                    name="fontSize"
                                    label="Size địa chỉ người nhận"
                                >
                                    <InputNumber min={6} max={14} style={{ width: 400, border: '1px solid #ced4da', borderRadius: '0.25rem' }} />
                                </Form.Item>
                            </Col>
                            <Col span={24} offset={7}>
                                <Form.Item name="isDefault" label="">
                                    <Checkbox checked={checkIsDefault} onChange={onChangeIsDefault}>Mặc định mẫu in</Checkbox>
                                </Form.Item>
                            </Col>
                            {/* <Col span={24} >
                                    <Form.Item name="isHidePhone">
                                        <Checkbox checked={checkIsHidePhone} onChange={onChangeIsHidePhone}>Ẩn số điện thoại người gửi</Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item name="isHideAdd">
                                        <Checkbox checked={checkIsHideAdd} onChange={onChangeIsHideAdd}>Ẩn dịa chỉ người gửi (chỉ hỗ trợ trên mẫu giấy Ax)</Checkbox>
                                    </Form.Item>
                                </Col> */}
                            <Col span={24} offset={7}>
                                <Form.Item name="isHideFee" label="">
                                    <Checkbox checked={checkIsHideFee} onChange={onChangeIsHideFee}>Ẩn cước vận chuyển</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={24} offset={7}>
                                <Form.Item name="isHidePoscodeAccept" label="">
                                    <Checkbox checked={checkIsHidePoscodeAccept} onChange={onChangeIsHidePoscodeAccept}>Ẩn bưu cục chấp nhận</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={24} offset={7}>
                                <Form.Item name="isHideMass" label="">
                                    <Checkbox checked={checkIsHideMass} onChange={onChangeIsHideMass}>Ẩn khối lượng</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={24} offset={7}>
                                <Form.Item name="isHidePhoneReceiver" label="">
                                    <Checkbox checked={checkIsHidePhoneReceiver} onChange={onChangeIsHidePhoneReceiver}>Ẩn số điện thoại người nhận</Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>
                        {/* <Row>
                                <Col offset={10}>
                                    <Button className='custom-btn4 btn-outline-success' icon={<SaveOutlined />} loading={isLoading} htmlType="submit" form="form-print-configuration" size="large" >
                                        Lưu cấu hình
                                    </Button>
                                </Col>
                            </Row> */}
                        <Row >
                            <Col flex="auto" style={{ textAlign: 'center' }}>
                                <Button className='custom-btn4 btn-outline-success' icon={<SaveOutlined />} loading={isLoading} htmlType="submit" form="form-print-configuration" size="large" >
                                    Lưu cấu hình
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Spin>
        </div >
    );

};

export default PrintConfiguration;