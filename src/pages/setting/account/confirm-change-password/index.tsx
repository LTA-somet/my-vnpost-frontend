import { regexCode, regexName, regexPhone, validateMessages } from '@/core/contains';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, DatePicker, Form, FormInstance, Input, Row, Spin, Drawer, Button, Space, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { useModel } from 'umi';

const ConfirmChangePassword = () => {
    // const { dataSource, reload, loading, deleteRecord, createRecord, updateRecord } = useModel('useUomList');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const formRef = useRef<FormInstance>(null);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Form
                        name="form-comfirm-change-password"
                        labelCol={{ flex: '120px' }}
                        labelAlign="left"
                        labelWrap
                        // wrapperCol={{ flex: 1 }}
                        colon={false}
                        ref={formRef}
                        validateMessages={validateMessages}
                    >
                        <Modal title="ĐỔI MẬT KHẨU" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                            <p>Mã OTP vừa được gửi đến số điện thoại 090***2009 của bạn</p>
                            <Row gutter={14}>
                                <Col span={24}>
                                    <Form.Item
                                        name="otp"
                                        label="Nhập mã OTP"
                                        rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                                    >
                                        <Input maxLength={15} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <p style={{ border: '1px solid orange' }}>Nếu không nhận được mã, vui lòng gửi email <b style={{ color: 'orange' }}>cskhvnpost@vnpost.vn</b>
                                Hoặc <b style={{ color: 'orange' }}>Chat với CSKH</b></p>
                        </Modal>
                    </Form>
                </Spin>
            </PageContainer >
        </div>
    );

};

export default ConfirmChangePassword;