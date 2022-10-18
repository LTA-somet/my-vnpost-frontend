import React, { useEffect } from 'react';
import type { UserBankAccountDto } from '@/services/client';
import { Form, Input, Row, Col, Modal, Space, Button } from 'antd';
import { validateMessages } from '@/core/contains';
import { ExportOutlined, SaveOutlined } from '@ant-design/icons';

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};
const EditFormApproval: React.FC<Props> = (props: Props) => {
    const [form] = Form.useForm();

    const onFill = () => {
        if (props.record) {
            form.setFieldsValue(props.record);
        } else {
            form.resetFields();
        }
    };

    useEffect(() => {
        onFill();
    }, [props.record]);

    const onApproval = () => {
        form.validateFields().then(formValue =>
            props.onEdit(formValue)
        );

    }

    return (
        <div>
            <Modal
                title={<div style={{ fontSize: '16px' }}>{props.record ? 'Phê duyệt tài khoản kết nối ngân hàng' : 'Khai báo thông tin tài khoản kết nối ngân hàng'}</div>}
                visible={props.visible}
                onCancel={() => props.setVisible(false)}
                width={1000}

                footer={
                    <Space>
                        <Button className='custom-btn1 btn-outline-secondary' icon={<ExportOutlined />} onClick={() => props.setVisible(false)}>Đóng</Button>
                        {!props.isView && <Button className='custom-btn1 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" onClick={onApproval} loading={props.isSaving} >
                            Phê duyệt
                        </Button>}
                    </Space>
                }
                destroyOnClose
            >
                <Form
                    name="form-approval-connect-bank"
                    {...formItemLayout}
                    // onFinish={props.onEdit}
                    labelAlign='left'
                    form={form}
                    validateMessages={validateMessages}
                >
                    <Row>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="phoneNumber"
                                label="Tài khoản"
                            >
                                <Input maxLength={10} disabled />
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="fullName"
                                label="Tên tài khoản"
                            >
                                <Input maxLength={10} disabled />
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="bankName"
                                label="Tên ngân hàng"
                            >
                                <Input maxLength={10} disabled />
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="accountName"
                                label="Chủ tài khoản NH"
                            >
                                <Input maxLength={10} disabled />
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="branchName"
                                label="Chi nhánh NH"
                            >
                                <Input maxLength={20} disabled />
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="accountNumber"
                                label="Số tài khoản NH"
                            >
                                <Input maxLength={20} disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

        </div >
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    record?: UserBankAccountDto,
    onEdit: (record: UserBankAccountDto) => void,
    isSaving: boolean,
    isView: boolean,
}
export default EditFormApproval;