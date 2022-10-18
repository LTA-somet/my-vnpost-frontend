import { regexUrl, validateMessages } from '@/core/contains';
import { ConfigPartnerApi, ConfigPartnerDto, PartnerCategoryDto } from '@/services/client';
import { ReloadOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Col, Form, FormInstance, Row, Spin, Button, Space, Checkbox, Divider, Input } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';

const ConfigWebhook = () => {
    const { dataConfigWebhook, reloadConfigWebhook, isLoading, isSaving, updateConfigWebhook } = useModel('partnerCategoryList');
    const [form] = Form.useForm();

    useEffect(() => {
        reloadConfigWebhook();
    }, [])

    useEffect(() => {
        form.setFieldsValue(dataConfigWebhook);
    }, [dataConfigWebhook])

    const onFinish = (values: PartnerCategoryDto) => {
        if (values.partnerUrl) {
            updateConfigWebhook(values);
        }
    };

    return (
        <div>
            <Spin spinning={isLoading}>
                <Card className="fadeInRight" bordered={false}>
                    <Form
                        name="form-config-webhook"
                        onFinish={onFinish}
                        form={form}
                        validateMessages={validateMessages}
                        layout="vertical"
                    >
                        <Form.Item name="partnerUrl"
                            label="Cấu hình đường dẫn Webhook (Khách hàng cung cấp)"
                            rules={[{ pattern: regexUrl, message: 'Đường dẫn Webhook không hợp lệ!' }]}
                        >
                            <Input maxLength={200} />
                        </Form.Item>
                        <Row >
                            <Col flex="auto" style={{ textAlign: 'center' }}>
                                <Button loading={isSaving} className='custom-btn4 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" form="form-config-webhook" size="large" >
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

export default ConfigWebhook;