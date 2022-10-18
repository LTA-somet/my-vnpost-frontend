import React, { useEffect, useState } from 'react';
import type { ContactDto, PostOfficeModel } from '@/services/client';
import { ContactApi } from '@/services/client';
import { Form, Input, Row, Col, Modal, Space, Button, Select, Checkbox } from 'antd';
import { patternPhone, regexName, regexPhone, validateMessages } from '@/core/contains';
import Address from '@/components/Address';
import { capitalizeName, dataToSelectBox } from '@/utils';
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import ServicePostOffice from '@/components/ServicePostOffice';
import { useAdministrativeUnitList } from '@/core/selectors';

const contactApi = new ContactApi();
const EditFormSender: React.FC<Props> = (props: Props) => {
    const [form] = Form.useForm();
    const [postOffice, setPostOffice] = useState<any[]>([]);
    const [contact, setContact] = useState<ContactDto>();
    const [prinConfig, setPrintConfig] = useState<string>("1");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const communeCode = Form.useWatch('communeCode', form);
    const addressFromStore = useAdministrativeUnitList();
    // const { isloading, setLoading } = useState(false);

    const getPostOffice = (p: PostOfficeModel, lon: any, lat: any) => {
        if (lon && lat) {
            return {
                postCode: p.postCode,
                name: `${p.postOfficeName} - SĐT: ${p.phone} (${(+(parseFloat(p.distanceInMeters!) / 1000).toFixed(2)).toLocaleString('vi-VN')} km)`
            }
        }
        else {
            return {
                postCode: p.postCode,
                name: `${p.postOfficeName} - SĐT: ${p.phone}`
            }
        }
    }

    const onChangeLonLat = (lat: string, lon: string) => {
        if (lon && lat) {
            contactApi.findNearByPostOffice(lat, lon)
                .then(resp => {
                    setPostOffice(resp.data.map(data => getPostOffice(data, lon, lat)))
                });
        }
        else {
            setPostOffice([]);
        }
    }
    const onChangeCommune = () => {
        form.setFieldsValue({ 'lon': undefined, 'lat': undefined })
    }

    useEffect(() => {
        if (props.visible && props.record) {
            setContact(props.record)
        } else {
            setContact(undefined)
        }
    }, [contact, props.record, props.visible])

    useEffect(() => {
        if (communeCode && !form.getFieldValue('lon') && !form.getFieldValue('lat')) {
            contactApi
                .findVmapsAddress(addressFromStore.communeList.find(commune => commune.code === communeCode)!.name)
                .then((resp) => {
                    if (resp.status === 200 && resp.data !== null) {
                        const geometry = resp.data!.features![0].geometry;
                        contactApi.findNearByPostOffice(geometry!.coordinates![1].toString(), geometry!.coordinates![0].toString())
                            .then(res => {
                                const postOfficeTmp = res.data.map(data => getPostOffice(data, undefined, undefined))
                                setPostOffice(postOfficeTmp)
                            });
                    }
                })
        }
    }, [communeCode])



    const onFill = () => {
        if (contact) {
            form.setFieldsValue(contact);
            onChangeLonLat(contact!.lat!, contact!.lon!)
            setPostOffice([{ postCode: contact.orgCodeAccept, name: contact.orgCodeAcceptName ? 'Bưu cục ' + contact.orgCodeAcceptName : '' }])
        } else {
            form.resetFields();
        }
    };

    const { Option } = Select;

    useEffect(() => {
        onFill();
    }, [contact]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const onFinish = () => {
        form.validateFields()
            .then(senderInfo => {
                props.onEditSender(senderInfo);
            })
    }

    return (
        <Modal
            title={props.record ? 'Chỉnh sửa thông tin người gửi' : 'Thêm mới thông tin người gửi'}
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            width={1000}
            footer={
                <Space>
                    {/* <Button onClick={() => props.setVisible(false)}>Huỷ</Button> */}
                    {!props.isView && <Button className='btn-outline-success' icon={<CheckCircleOutlined />} onClick={onFinish} type="primary" loading={props.isSaving}>
                        Xác nhận
                    </Button>}
                </Space>
            }
            destroyOnClose
        >
            <Form
                name="form-order-sender"
                labelCol={{ flex: '120px' }}
                labelWrap
                labelAlign='left'
                // onFinish={onFinish}
                form={form}
                validateMessages={validateMessages}
            >

                <Row gutter={14}>
                    <Col span={24}>
                        <Form.Item
                            name="isSender"
                            hidden={true}
                            initialValue={true}
                        >
                            orgCode
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={16}>
                        <Form.Item
                            name="name"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }, { pattern: regexName, message: 'Trường này chứa ký tự không hợp lệ!' }]}
                            getValueFromEvent={e => capitalizeName(e.target.value)}
                        >
                            <Input maxLength={50} placeholder="Nhập họ tên" />
                        </Form.Item>

                    </Col>
                    <Col className='config-height' span={8}>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }, patternPhone]}
                        >
                            <Input maxLength={50} placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Col>
                    <Address form={form} xs={24} md={12} lg={8} addressName='Địa chỉ' hiddenLabel={false} onChangeLonLat={onChangeLonLat} isCheckQuarantine={true} onChangeCommune={onChangeCommune} />
                    <Col span={24}>
                        <Row>
                            <Input.Group className='config-height' compact>
                                <Col style={{ width: 'calc(100% - 40px)' }}>
                                    <Form.Item
                                        name="orgCodeAccept"
                                        label="Bưu cục phục vụ"
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Chọn bưu cục phục vụ"
                                        >
                                            {dataToSelectBox(postOffice, 'postCode', 'name')}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col style={{ width: '40px' }}>
                                    <Button style={{ width: '40px' }} icon={<SearchOutlined />} onClick={showModal} />
                                    <Modal title="Tìm kiếm Bưu cục phục vụ" width={1200} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
                                        footer={[
                                            false
                                            // <Button key="back" onClick={handleCancel}>
                                            //     Hủy
                                            // </Button>,
                                            // <Button key="submit" type="primary" onClick={handleOk}>
                                            //     Đồng ý
                                            // </Button>
                                        ]}
                                    >
                                        <ServicePostOffice form={form} visible={isModalVisible} setIsModalVisible={setIsModalVisible} setPostOffice={setPostOffice} />
                                    </Modal>
                                </Col>
                            </Input.Group>
                        </Row>
                    </Col>
                    {/* <Col span={12}>
                        <Form.Item
                            name="isDefault"
                            valuePropName='checked'
                        >
                            <Checkbox style={{ padding: "10px" }} >
                                Đặt làm địa chỉ mặc định
                            </Checkbox>
                        </Form.Item>
                    </Col> */}
                    <Col span={8}>
                        <Form.Item
                            name="isSaveSender"
                            valuePropName='checked'
                            label="Lưu vào danh sách"
                        >
                            <Checkbox />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            name="configPrintOrder"
                            // label="Cấu hình in đơn hàng"
                            label={<span style={{ marginTop: '15%' }}>Cấu hình in<p>đơn hàng</p></span>}
                            rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                            initialValue="1"
                        >
                            <Select onChange={(v) => setPrintConfig(v)}>
                                <Option value="1">Địa chỉ in giống địa chỉ gửi</Option>
                                <Option value="2">Địa chỉ in khác địa chỉ gửi</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    {prinConfig !== "1" && <>
                        <Col span={12}>
                            <Form.Item
                                name="namePrinted"
                                label="Họ và tên in"
                            >
                                <Input maxLength={50} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phonePrinted"
                                label="Số điện thoại in"
                                rules={[patternPhone]}
                            >
                                <Input maxLength={50} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Address form={form} xs={24} md={12} lg={8}
                                addressName='Địa chỉ in' addressField='addressPrinted'
                                provinceName='Tỉnh/thành phố in' provinceField='provinceCodePrinted'
                                districtName='Quận/huyện in' districtField='districtCodePrinted'
                                communeName='Phường/xã in' communeField='communeCodePrinted'
                                required={false} />
                        </Col>
                    </>
                    }
                </Row>
            </Form>
        </Modal >
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    record?: ContactDto,
    onEditSender: (senderInfo: any) => void,
    isSaving: boolean,
    isView: boolean,
    isSaveSender: boolean
}
export default EditFormSender;