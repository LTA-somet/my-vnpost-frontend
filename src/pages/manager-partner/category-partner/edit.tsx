import React, { useEffect, useState } from 'react';
import { AccountDto, ContactDto, OwnerApi } from '@/services/client';
import { ContactApi } from '@/services/client';
import { Form, Input, Row, Col, Modal, Space, Button, Checkbox } from 'antd';
import { patternPhone, regexName, regexPhone, validateMessages } from '@/core/contains';
import Address from '@/components/Address';
import { useModel } from 'umi';
import { SaveOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { capitalizeName } from '@/utils';

const contactApi = new ContactApi();
const ownerApi = new OwnerApi();

const EditFormReceiver: React.FC<Props> = (props: Props) => {
    const [form] = Form.useForm();
    const [accountDto, setAccountDto] = useState<AccountDto[]>([]);
    const [contact, setContact] = useState<ContactDto>();
    const { initialState } = useModel('@@initialState');

    useEffect(() => {
        if (props.visible && props.record && (!contact || contact.contactId !== props.record.contactId)) {
            contactApi.findContactById(props.record!.contactId!)
                .then((resp) => {
                    if (resp.status === 200 && resp.data !== null) {
                        setContact(resp.data);

                    }

                })
            ownerApi.findAccount(props.record!.orgCode!, props.record!.createdBy!)
                .then(resp => {
                    if (resp.status === 200 && resp.data !== null) {

                        setAccountDto([resp.data]);
                    }
                });
        }
        if (!props.visible) {
            setContact(undefined);
            form.resetFields();
        }
    }, [contact, form, props.record, props.visible])

    const onFill = () => {
        if (contact) {
            form.setFieldsValue(contact);
        } else {
            form.resetFields();
        }
    };

    const onSaveReceiver = () => {
        form.validateFields()
            .then(formValue => {
                props.onEdit(formValue)
            })
    }


    useEffect(() => {
        onFill();
    }, [contact]);


    return (
        <Modal
            title={<div style={{ fontSize: '16px', color: '#00549a' }}>{props.record ? 'Chỉnh sửa thông tin người nhận' : 'Thêm mới thông tin người nhận'}</div>}
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            width={1000}
            footer={
                <Space>
                    <Button className='custom-btn1 btn-outline-danger' icon={<CloseCircleOutlined />} onClick={() => props.setVisible(false)}>Huỷ</Button>
                    {!props.isView && <Button className='custom-btn1 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" onClick={onSaveReceiver} loading={props.isSaving} >
                        Lưu
                    </Button>}
                </Space>
            }
            destroyOnClose
        >
            <Form
                name="form-create-receiver"
                labelCol={{ flex: '130px' }}
                labelWrap
                onFinish={props.onEdit}
                form={form}
                validateMessages={validateMessages}
            >

                <Row gutter={14}>
                    <Col span={24}>
                        <Form.Item
                            name="owner"
                            label="Tài khoản quản lý"
                            hidden={true}
                            initialValue={initialState?.accountInfo?.uid}
                        >
                            Owner
                        </Form.Item>
                        <Form.Item
                            name="isSender"
                            hidden={true}
                            initialValue={false}
                        >
                            isSender
                        </Form.Item>
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
                            <Input maxLength={50} />
                        </Form.Item>

                    </Col>
                    <Col className='config-height' span={12}>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Số điện thoại không đúng định dạng!' }, patternPhone]}
                        >
                            <Input maxLength={50} />
                        </Form.Item>
                    </Col>
                    <Address form={form} xs={24} md={12} lg={8} addressName='Địa chỉ' isCheckQuarantine />
                    {props.record && <Col className='config-height' span={12}>
                        <Form.Item
                            name="isBlacklist"
                            valuePropName='checked'
                        >
                            <Checkbox style={{ padding: "10px" }} >
                                Danh sách đen
                            </Checkbox>
                        </Form.Item>
                    </Col>}

                </Row>
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
export default EditFormReceiver;