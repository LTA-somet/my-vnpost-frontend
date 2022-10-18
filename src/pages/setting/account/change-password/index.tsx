import { pattenPassword, reCaptchaKey, regexPassword, validateMessages } from '@/core/contains';
import { useCurrentUser } from '@/core/selectors';
import { AuthApi, McasUserApi } from '@/services/client';
import { CheckCircleOutlined, DoubleRightOutlined, ExportOutlined, EyeInvisibleOutlined, LockOutlined, SendOutlined } from '@ant-design/icons';
import { Card, Col, Form, FormInstance, Input, Row, Spin, Button, Space, Modal, notification } from 'antd';
import React, { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
// import './index.less'

const authApi = new AuthApi();
const mcasUserApi = new McasUserApi();
type VerifyType = 'PHONE' | 'EMAIL';
type ActionForm = 'RESEND';

const ChangePassword = () => {
    // const { dataSource, reload, loading, deleteRecord, createRecord, updateRecord } = useModel('useUomList');
    const [isLoading, setLoading] = useState<boolean>(false);
    const formRef = useRef<FormInstance>(null);
    const [form] = Form.useForm();
    const [formOtp] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [actionType, setActionType] = useState<VerifyType>('PHONE');
    const [actionForm, setActionForm] = useState<ActionForm>();
    const currentUser = useCurrentUser();
    const recaptchaRef = React.createRef<ReCAPTCHA>();

    let formatPhone = currentUser.phoneNumber;
    formatPhone = removeSubstring(formatPhone, 4, 9, "xxxxx");

    function removeSubstring(phone: any, startIndex: any, endIndex: any, text: string) {
        if (endIndex < startIndex) {
            startIndex = endIndex;
        }
        const a = phone.substring(0, startIndex);
        const b = phone.substring(endIndex);

        return a + text + b;
    }

    const onResetFormPass = () => {
        form.resetFields();
    };

    const onResetFormOtp = () => {
        formOtp.resetFields();
    };

    const onCancel = () => {
        onResetFormOtp();
        setIsModalVisible(false);
    };

    const onConfirm = () => {
        setLoading(true);
        //Update Password mới vào bản mcas_user.employee_code = mcas_employee.code
        const newPassword = form.getFieldValue('password');
        const otpPhone = formOtp.getFieldValue('otp');
        const otpEmail: string = "";
        // const otpPhone = values.otp;
        //Lấy code bằng hàm get user đang đăng nhập
        mcasUserApi.updateChangePassword(otpPhone, otpEmail, newPassword).then(resp => {
            // console.log("resp", resp);

            if (resp.status === 200) {
                notification.success({ message: 'Cập nhật thành công' })
            } else {
                notification.error({ message: 'Cập nhật thất bại' })
            }
        }).finally(() => setLoading(false));
        onCancel();
        onResetFormPass();
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

        setIsModalVisible(true);
    };

    const onResendOtp = () => {
        setActionForm("RESEND");
    }

    const handleResendOtp = () => {
        setLoading(true);
        mcasUserApi.sendOtpChangePassword(actionType).then(resp => {
            if (resp.status === 200) {
                notification.success({ message: 'Mã xác nhận đã được gửi lại về ' + (actionType === 'PHONE' ? ' Số điện thoại' : 'Email') });
                setActionForm(undefined);
            }
        }).finally(() => setLoading(false));
    }

    return (
        <>
            <div>
                <table style={{ width: "100%" }}>
                    <Spin spinning={isLoading}>
                        <Form
                            form={form}
                            name="form-change-password"
                            onFinish={onFinish}
                            autoComplete="off"
                            // layout='vertical'
                            validateMessages={validateMessages}
                            ref={formRef}
                            labelCol={{ flex: '170px' }}
                            labelAlign="left"
                            labelWrap
                        >
                            <Card className="fadeInRight" id="inputCustomPassword" bordered={false}>
                                <Row gutter={8}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="password"
                                            label="Mật khẩu mới"
                                            rules={[{ required: true }, pattenPassword]}
                                            hasFeedback
                                        >
                                            <Input.Password size="large" prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Mật khẩu mới' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="confirmPassword"
                                            label="Nhập lại mật khẩu mới"
                                            dependencies={['password']}
                                            hasFeedback
                                            rules={[{ required: true }, pattenPassword,
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                                },
                                            }),

                                            ]}
                                        >
                                            <Input.Password size="large" prefix={<EyeInvisibleOutlined className="site-form-item-icon" />} placeholder='Mật khẩu mới' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                {/* <Row>
                                    <Col offset={10}>
                                        <Button className='custom-btn5 btn-outline-success' icon={<DoubleRightOutlined />} loading={isLoading} htmlType="submit" form="form-change-password" size="large" >
                                            Tiếp tục
                                        </Button>
                                    </Col>
                                </Row> */}
                                <Row >
                                    <Col flex="auto" style={{ textAlign: 'center' }}>
                                        <Button className='custom-btn5 btn-outline-success' icon={<DoubleRightOutlined />} loading={isLoading} htmlType="submit" form="form-change-password" size="large" >
                                            Tiếp tục
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                        </Form>
                    </Spin >
                </table>
            </div >
            <Modal title="Xác nhận đổi mật khẩu"
                visible={isModalVisible}
                onOk={onConfirm}
                onCancel={onCancel}
                width={900}
                footer={
                    <Space>
                        <Button icon={<SendOutlined />} loading={isLoading} className="btn-outline-info" onClick={onResendOtp} >Gửi lại otp</Button>
                        <Modal
                            visible={actionForm === 'RESEND'}
                            width={350}
                            title='Xác nhận gửi lại mã OTP'
                            onOk={() => {
                                const recaptchaValue = recaptchaRef.current?.getValue();
                                console.log(recaptchaValue)
                                if (!recaptchaValue) {
                                    return;
                                }
                                handleResendOtp();
                            }}
                            okText='Đồng ý'
                            onCancel={() => setActionForm(undefined)}
                            cancelText="Đóng"
                            okButtonProps={{ loading: isLoading }}
                            destroyOnClose
                        >
                            <ReCAPTCHA
                                sitekey={reCaptchaKey}
                                size='normal'
                                ref={recaptchaRef}
                            />
                        </Modal>
                        <Button icon={<CheckCircleOutlined />} key="submit" className='custom-btn1 btn-outline-success' loading={isLoading} onClick={onConfirm}>
                            Xác nhận
                        </Button>
                        <Button icon={<ExportOutlined />} className='custom-btn1 btn-outline-secondary' key="back" onClick={onCancel}>
                            Đóng
                        </Button>
                        {/* <div className="col-md-12 center">
                            <div className="form-group">
                                <button type="button" onClick={onConfirm} className="btn btn-outline-success mr-2"><i className="ik ik-check-square"></i>  Xác nhận</button>
                            </div>
                        </div> */}
                    </Space>
                }
            >
                <p>Mã OTP vừa được gửi đến số điện thoại {formatPhone} của bạn</p>

                <Form
                    name="form-confirm-otp"
                    onFinish={onConfirm}
                    autoComplete="off"
                    form={formOtp}
                >
                    <Row>
                        <Col span={12} offset={6}>
                            <Form.Item
                                name="otp"
                                label="Nhập mã OTP"
                                rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                            >
                                <Input id="inputCustomPassword" maxLength={15} placeholder='Nhập mã OTP' />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <p style={{ border: '1px solid #e6dee1', padding: '0.3rem' }}>Nếu không nhận được mã, vui lòng gửi email <b style={{ color: '#0b5291' }}>cskhvnpost@vnpost.vn</b> Hoặc <b style={{ color: '#0b5291' }}>Chat với CSKH</b></p>
            </Modal>
        </>
    );

};

export default ChangePassword;