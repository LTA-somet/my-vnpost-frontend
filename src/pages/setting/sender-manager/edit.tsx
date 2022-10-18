import React, { useEffect, useState } from 'react';
import type { AccountDto, ContactDto, PostOfficeModel } from '@/services/client';
import { OwnerApi } from '@/services/client';
import { ContactApi } from '@/services/client';
import { Form, Input, Row, Col, Modal, Space, Button, Select, Checkbox, Collapse } from 'antd';
import { patternPhone, regexName, regexPhone, validateMessages } from '@/core/contains';
import Address from '@/components/Address';
import { capitalizeName, dataToSelectBox } from '@/utils';
import History from './history';
import { SaveOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useAdministrativeUnitList, useCurrentUser } from '@/core/selectors';
import ServicePostOffice from '@/components/ServicePostOffice';
import { formatStart0 } from '@/utils/PhoneUtil';

const ownerApi = new OwnerApi();
const contactApi = new ContactApi();
const EditFormSender: React.FC<Props> = (props: Props) => {
    const [form] = Form.useForm();
    const [accountDto, setAccountDto] = useState<any[]>([]);
    const [postOffice, setPostOffice] = useState<any[]>([]);
    const [contact, setContact] = useState<ContactDto>();
    const [prinConfig, setPrintConfig] = useState<string>("1");
    const currentUser = useCurrentUser();
    const [isCheckDefault, setIsCheckDefault] = useState<boolean>(false);
    const communeCode = Form.useWatch('communeCode', form);
    const addressFromStore = useAdministrativeUnitList();
    const [isModalVisible, setIsModalVisible] = useState(false);


    const getPostOffice = (p: PostOfficeModel, lon: any, lat: any) => {
        if (lon && lat) {
            return {
                postCode: p.postCode,
                name: `Bưu cục ${p.postOfficeName} - SĐT: ${p.phone} (${(+(parseFloat(p.distanceInMeters!) / 1000).toFixed(2)).toLocaleString('vi-VN')} km)`
            }
        }
        else {
            return {
                postCode: p.postCode,
                name: `Bưu cục ${p.postOfficeName} - SĐT: ${p.phone}`
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

    const getOwner = (account: AccountDto) => {
        return {
            username: account.username,
            name: account.fullname + ' ' + account.phoneNumber
        }
    }

    useEffect(() => {
        if (communeCode && !form.getFieldValue('lon') && !form.getFieldValue('lat')) {
            contactApi
                .findVmapsAddress(addressFromStore.communeList.find(commune => commune.code === communeCode)?.name + ', ' +
                    addressFromStore.districtList.find(district => district.code === form.getFieldValue('districtCode'))?.name + ', ' +
                    addressFromStore.provinceList.find(province => province.code === form.getFieldValue('provinceCode'))?.name)
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

    useEffect(() => {
        if (props.visible) {
            if (currentUser.uid === currentUser.owner) {
                ownerApi.findAllOwner()
                    .then(resp => {
                        if (resp.status === 200 && resp.data !== null) {
                            const result = resp.data.map(owner => {
                                return getOwner(owner)
                            })
                            setAccountDto(result);
                        }
                    });
            }
            else {
                setAccountDto([{ username: currentUser.owner, name: currentUser.ufn + ' - ' + formatStart0(currentUser.phoneNumber) }])
            }
        }

        if (props.record) {
            form.setFieldsValue(props.record);
            setPrintConfig(props.record.configPrintOrder!)
            setPostOffice([{ postCode: props.record.orgCodeAccept, name: props.record.orgCodeAcceptName ? 'Bưu cục ' + props.record.orgCodeAcceptName : '' }])
        } else {
            form.resetFields();
        }
        if (contact) {
            onChangeLonLat(contact!.lat!, contact!.lon!)
        }
        if (!props.visible) {
            setContact(undefined);
            form.resetFields();
        }
    }, [props.visible])

    const onSaveSender = () => {
        form.validateFields()
            .then(formValue => {
                props.onEdit(formValue)
            })
    }

    const onChangeOwner = (value: any) => {
        setIsCheckDefault(value !== currentUser.uid);

    }

    const { Panel } = Collapse;
    const { Option } = Select;

    return (
        <Modal
            title={<div style={{ fontSize: '16px', color: '#00549a' }}>{props.record ? 'Chỉnh sửa thông tin người gửi' : 'Thêm mới thông tin người gửi'}</div>}
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            width={1000}
            footer={
                <Space>
                    <Button className='custom-btn1 btn-outline-danger' icon={<CloseCircleOutlined />} onClick={() => props.setVisible(false)}>Huỷ</Button>
                    {!props.isView && <Button className='custom-btn1 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" onClick={onSaveSender} loading={props.isSaving}>
                        Lưu
                    </Button>}
                </Space>
            }
            destroyOnClose
        >
            <Form
                name="form-create-sender"
                labelCol={{ flex: '130px' }}
                labelAlign='left'
                labelWrap
                onFinish={props.onEdit}
                form={form}
                validateMessages={validateMessages}

            >
                <Row gutter={14}>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="owner"
                            label="Tài khoản quản lý"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                            initialValue={currentUser.owner}
                        >
                            <Select
                                showSearch
                                style={{ width: 340 }}
                                disabled={true}
                                onChange={onChangeOwner}
                            >
                                {dataToSelectBox(accountDto, 'username', 'name')}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="isSender"
                            hidden={true}
                            initialValue={true}
                        />
                        <Form.Item
                            name="createdBy"
                            label="Người tạo"
                            hidden={true}
                        >
                            <Input maxLength={50} />
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={12}>
                        <Form.Item
                            getValueFromEvent={e => capitalizeName(e.target.value)}
                            name="name"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }, { pattern: regexName, message: 'Trường này chứa ký tự không hợp lệ!' }]}
                        >
                            <Input maxLength={50} disabled={props.isView} />
                        </Form.Item>

                    </Col>
                    <Col className='config-height' span={12}>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }, patternPhone]}
                        >
                            <Input maxLength={50} disabled={props.isView} />
                        </Form.Item>
                    </Col>
                    <Address form={form} addressName='Địa chỉ' onChangeLonLat={onChangeLonLat} onChangeCommune={onChangeCommune} isCheckQuarantine disabled={props.isView} />
                    <Col className='config-height' span={24}>
                        <Row>
                            <Col style={{ width: 'calc(100% - 40px)' }}>
                                <Form.Item
                                    name="orgCodeAccept"
                                    label="Bưu cục phục vụ"
                                >
                                    <Select
                                        showSearch
                                        disabled={props.isView}
                                    >
                                        {dataToSelectBox(postOffice, 'postCode', 'name')}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col style={{ width: '40px' }}>
                                <Button style={{ width: '40px' }} icon={<SearchOutlined />} onClick={() => setIsModalVisible(true)} />
                                <Modal title="Tìm kiếm Bưu cục phục vụ" width={1200} visible={isModalVisible} onOk={() => setIsModalVisible(false)} onCancel={() => setIsModalVisible(false)}
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
                        </Row>
                    </Col>
                    <Col className='config-height' span={12}>
                        <Form.Item
                            name="isDefault"
                            valuePropName='checked'
                            initialValue={false}
                        >
                            <Checkbox style={{ padding: "10px" }} disabled={props.isView || currentUser.uid !== form.getFieldValue('owner') || isCheckDefault}>
                                Đặt làm người gửi mặc định
                            </Checkbox>
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={12}>
                        <Form.Item
                            name="configPrintOrder"
                            label="Cấu hình in đơn hàng"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                            initialValue="1"

                        >
                            <Select onChange={(v) => setPrintConfig(v)} disabled={props.isView}>
                                <Option value="1">Địa chỉ in giống địa chỉ gửi</Option>
                                <Option value="2">Địa chỉ in khác địa chỉ gửi</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    {
                        prinConfig !== "1" && <>
                            <Col className='config-height' span={12}>
                                <Form.Item
                                    name="namePrinted"
                                    label="Họ và tên in"
                                >
                                    <Input maxLength={50} disabled={props.isView} />
                                </Form.Item>
                            </Col>
                            <Col className='config-height' span={12}>
                                <Form.Item
                                    name="phonePrinted"
                                    label="Số điện thoại in"
                                    rules={[patternPhone]}
                                >
                                    <Input maxLength={50} disabled={props.isView} />
                                </Form.Item>

                            </Col>

                            <Address form={form} disabled={props.isView}
                                addressName='Địa chỉ in' addressField='addressPrinted'
                                provinceName='Tỉnh/thành phố in' provinceField='provinceCodePrinted'
                                districtName='Quận/huyện in' districtField='districtCodePrinted'
                                communeName='Phường/xã in' communeField='communeCodePrinted'
                                required={false} isCheckQuarantine />
                        </>
                    }
                </Row>
                {props.record && <Collapse accordion>
                    <Panel header="Thông tin lịch sử" key="1">
                        <History /></Panel>
                </Collapse>}

            </Form>
        </Modal>
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    record?: ContactDto,
    onEdit: (record: ContactDto) => void,
    isSaving: boolean,
    isView: boolean,
}
export default EditFormSender;