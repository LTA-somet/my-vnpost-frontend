import React, { useEffect, useState } from 'react';
import { Form, Modal, Space, Button, Row, Col, Input, Checkbox } from 'antd';
import { CheckCircleOutlined, ExportOutlined, UndoOutlined } from '@ant-design/icons';
import { regexUrl, validateMessages } from '@/core/contains';
import { PartnerCategoryDto } from '@/services/client';
import { useCurrentUser } from '@/core/selectors';

const EditFormPartner: React.FC<Props> = (props: Props) => {
    const currentUser = useCurrentUser();
    const [form] = Form.useForm();

    const onFill = () => {
        if (props.record) {
            // console.log("props.record", props.record);

            form.setFieldsValue(props.record)
        } else {
            form.resetFields();
        }
    }

    useEffect(() => {
        onFill();
    }, [props.visible]);

    const onEdit = () => {
        form.validateFields().then(formValue => props.onEdit(formValue));
    }

    const onCancel = () => {
        props.setVisible(false);
        form.resetFields();
    }

    const onCheckUrlWebhook = () => {
        //Viết api check link:
        //- gọi api webhook: request, status, response
        const partnerUrl = form.getFieldValue(["partnerUrl"]);
        console.log("partnerUrl", partnerUrl);


    }

    const onChangCheckbox = (e: any) => {
        // console.log("e", e);

    }


    return (
        <Modal
            title={props.record ? (props.isView ? currentUser.isEmployee ? 'Xem thông tin đối tác' : 'Xem thông tin cấu hình Webhook' : currentUser.isEmployee ? 'Chỉnh sửa đối tác' : 'Chỉnh sửa cấu hình Webhook') : currentUser.isEmployee ? 'Thêm mới đối tác' : 'Cấu hình Webhook'}
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            width={700}
            footer={
                <Space>
                    <Button className='custom-btn1 btn-outline-success' icon={<CheckCircleOutlined />} onClick={onEdit} loading={props.isSaving}>
                        Xác nhận
                    </Button>
                    <Button className='btn-outline-danger' icon={<UndoOutlined />} onClick={onCheckUrlWebhook}>Kiểm tra đường dẫn</Button>
                    <Button className='custom-btn1 btn-outline-secondary' icon={<ExportOutlined />} onClick={() => onCancel()}>Đóng</Button>
                </Space>
            }
            destroyOnClose
        >
            <Form
                name="form-create-partner"
                labelCol={{ flex: '120px' }}
                labelWrap
                labelAlign='left'
                form={form}
                validateMessages={validateMessages}
            >
                {
                    currentUser.isEmployee ? <Row>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="partnerName"
                                label="Tên đối tác"
                                rules={[{ required: true, message: 'Tên đối tác không được để trống!' }]}
                            >
                                <Input maxLength={200} />
                            </Form.Item>
                        </Col>
                    </Row>
                        :
                        null
                }

                <Row>
                    <Col className='config-height' span={24}>
                        <Form.Item>
                            <label className='label'>Cấu hình đường dẫn Webhook</label>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col className='config-height' span={24}>
                        <Form.Item name="partnerUrl"
                            rules={[{ pattern: regexUrl, message: 'Đường dẫn Webhook không hợp lệ!' }]}
                        >
                            <Input maxLength={200} />
                        </Form.Item>
                    </Col>
                </Row>
                {
                    currentUser.isEmployee ? <Row>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="deActive"
                                label="Ngừng hoạt động?"
                                labelCol={{ flex: '150px' }}
                                valuePropName="checked"
                            // rules={[{ required: true, message: 'Tên đối tác không được để trống!' }]}
                            >
                                <Checkbox onChange={onChangCheckbox} />
                            </Form.Item>
                        </Col>
                    </Row>
                        :
                        null
                }
            </Form>
        </Modal>
    );
};
type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    record?: PartnerCategoryDto,
    onEdit: (record: PartnerCategoryDto) => void,
    isSaving: boolean,
    isView: boolean,
}
export default EditFormPartner;