import { regexUrl, validateMessages } from '@/core/contains';
import { useCurrentUser } from '@/core/selectors';
import { AuthApi, McasUserApi } from '@/services/client';
import { CheckCircleOutlined, DoubleRightOutlined, ExportOutlined, EyeInvisibleOutlined, LockOutlined, SendOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Form, FormInstance, Input, Row, Spin, Button, Space, Modal, notification } from 'antd';
import React, { useRef, useState } from 'react';

const mcasUserApi = new McasUserApi();

const WebhookConfiguration = () => {
    // const { dataSource, reload, loading, deleteRecord, createRecord, updateRecord } = useModel('useUomList');
    const [isLoading, setLoading] = useState<boolean>(false);
    const formRef = useRef<FormInstance>(null);
    const [form] = Form.useForm();

    const onCancel = () => {

    };

    const onFinish = () => {
        //Lấy mã OTP lưu vào bảng mcas_employee > update handleOk() bảng mcas_user
        setLoading(true);
        mcasUserApi.sendOtpChangePassword(actionType).then(resp => {
            if (resp.status === 200) {
                notification.success({ message: 'Mã xác nhận đã được gửi về ' + (actionType === 'PHONE' ? ' Số điện thoại' : 'Email') });
            } else {
                // notification.error({ message: resp.message })
            }
        }).finally(() => setLoading(false));
    };

    return (
        <>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Form
                        form={form}
                        name="form-webhook-config"
                        onFinish={onFinish}
                        validateMessages={validateMessages}
                        ref={formRef}
                        labelCol={{ flex: '170px' }}
                        labelAlign="left"
                        labelWrap
                    >
                        <Card className="fadeInRight" bordered={false} size='small'>
                            <Row gutter={8}>
                                <Col span={24}>
                                    <Form.Item
                                        name="link"
                                        label="Cấu hình đường dẫn Webhook"
                                        rules={[{ pattern: regexUrl, message: 'Đường dẫn Webhook không hợp lệ!' }]}
                                    >
                                        <Input size='large' maxLength={200} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col flex="auto" style={{ textAlign: 'center' }}>
                                    <Space>
                                        <Button className='custom-btn5 btn-outline-success' icon={<DoubleRightOutlined />} loading={isLoading} htmlType="submit" form="form-change-password" size="large" >
                                            Tiếp tục
                                        </Button>
                                        <Button className='custom-btn5 btn-outline-success' icon={<DoubleRightOutlined />} loading={isLoading} htmlType="submit" form="form-change-password" size="large" >
                                            Tiếp tục
                                        </Button>
                                        <Button className='custom-btn5 btn-outline-success' icon={<DoubleRightOutlined />} loading={isLoading} htmlType="submit" form="form-change-password" size="large" >
                                            Tiếp tục
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Spin >
            </PageContainer>
        </>
    );

};

export default WebhookConfiguration;