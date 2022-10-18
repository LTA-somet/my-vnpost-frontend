import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Modal, Space, Button, Select, Table, Card, Popconfirm, Spin, notification, List } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { patternPhone, validateMessages } from '@/core/contains';
import { SaveOutlined } from '@ant-design/icons';
import { AccountApi, AccountDto, ContactModel, CustomerModel } from '@/services/client';
import Address from '@/components/Address';
import './style.css';

const accountApi = new AccountApi();
const CreateCustomer: React.FC = () => {
    const [isOpenSelectOrg, setOpenSelectOrg] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [contact, setContact] = useState<ContactModel>();
    const [customer, setCustomer] = useState<CustomerModel>();

    const [customerList, setCustomerList] = useState<CustomerModel[]>([]);

    const [form] = Form.useForm();

    useEffect(() => {
    }, []);

    const onSave = () => {
        if (!contact || !customer) {
            notification.error({ message: 'Bạn chưa chọn đủ thông tin' });
            return;
        }
        setLoading(true);
        accountApi.createAccountForCustomer({ contact, customer })
            .then(resp => {
                if (resp.status === 201) {
                    form.resetFields();
                }
            }).finally(() => setLoading(false));
    }

    const onFill = (newContact: ContactModel, newCustomer: CustomerModel) => {
        const values = {
            phoneNumber: newContact?.contactTel1,
            contactEmail: newContact?.contactEmail,
            contactName: newContact?.contactName,
            accntAdd: newCustomer?.accntAdd,
            province: newCustomer?.province?.code,
            district: newCustomer?.district?.code,
            wards: newCustomer?.wards?.code
        }
        form.setFieldsValue(values);
    }

    const onSearchPhone = (value: string) => {
        if (!value) {
            form.resetFields();
            return;
        }
        form.resetFields();
        setLoading(true);
        accountApi.searchContactByPhone(value)
            .then(resp => {
                if (resp.status === 200) {
                    if (!resp.data.customers || resp.data.customers?.length === 0) {
                        notification.error({ message: 'Khách hàng chưa được gắn với đơn vị nào' })
                    } else if (resp.data.customers!.length > 1) {
                        // show popup select
                        setCustomerList(resp.data.customers);
                        setContact(resp.data.contact);
                        setOpenSelectOrg(true);
                    } else {
                        setContact(resp.data.contact);
                        setCustomer(resp.data.customers[0]);
                        onFill(resp.data.contact!, resp.data.customers[0]);
                    }
                }
            }).finally(() => setLoading(false))
    }

    const closePopupSelectOrg = () => {
        setOpenSelectOrg(false);
        form.resetFields();
    }

    const selectOrg = (customerSelected: CustomerModel) => {
        setCustomer(customerSelected);
        setOpenSelectOrg(false);
        onFill(contact!, customerSelected);
    }

    return (

        <PageContainer>
            <Spin spinning={loading}>
                <Card title="Thông tin tài khoản" className="fadeInRight">
                    <Form
                        name="form-create-customer"
                        labelCol={{ flex: '120px' }}
                        labelAlign='left'
                        labelWrap
                        form={form}
                        validateMessages={validateMessages}
                    >
                        <Row gutter={8}>
                            <Col className='config-height' span={8}>
                                <Form.Item
                                    name="phoneNumber"
                                    label="Số điện thoại"
                                    rules={[{ required: true }, patternPhone]}
                                >
                                    <Input.Search
                                        title='Tìm kiếm'
                                        allowClear
                                        onSearch={(value) => onSearchPhone(value)} placeholder="Nhập số điện thoại" />
                                </Form.Item>
                            </Col>
                            <Col className='config-height' span={8}>
                                <Form.Item
                                    name="contactName"
                                    label="Họ và tên"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="Nhập tên khách hàng" disabled />
                                </Form.Item>
                            </Col>
                            <Col className='config-height' span={8}>
                                <Form.Item
                                    name="contactEmail"
                                    label="Email"
                                    rules={[{ type: 'email' }]}
                                >
                                    <Input placeholder="E-mail" disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className='config-height'>
                            <Address

                                form={form}
                                md={8} lg={8}
                                addressField='accntAdd'
                                provinceField='province'
                                districtField='district'
                                communeField='wards'
                                provinceName='Tỉnh/Thành phố'
                                districtName='Quận/huyện'
                                communeName='Phường/Xã'
                                styleBorder='5px'
                            // hiddenLabel={true}
                            // labelWidth={0}
                            />

                        </Row>

                        <Form.Item style={{ textAlign: 'center', marginTop: '60px' }} >
                            <Button size="large" icon={<SaveOutlined />} onClick={onSave} className='btn btn-outline-success'> Lưu thông tin </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Spin>
            <Modal
                title={'Chọn tổ chức'}
                visible={isOpenSelectOrg}
                onCancel={closePopupSelectOrg}
                width={700}
                footer={
                    <></>
                }
                destroyOnClose
            >
                <List
                    itemLayout="horizontal"
                    dataSource={customerList}
                    bordered
                    renderItem={item => (
                        <List.Item key={item.accntCode} onClick={() => selectOrg(item)} className={"org-item"}>
                            <List.Item.Meta
                                title={item.accntName}
                                description={`${item.accntCode}`}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </PageContainer>

    );
};
export default CreateCustomer;