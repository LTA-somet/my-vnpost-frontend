import { loginPath, pattenPassword, regexPassword, validateMessages } from '@/core/contains';
import { AuthApi } from '@/services/client';
import { Col, Form, Input, Row, Button, notification } from 'antd';
import React, { useState } from 'react';
import { Link } from 'umi';
import { EyeInvisibleOutlined, LockOutlined } from '@ant-design/icons';
import '../scss/theme.css';
import '../scss/style.css';
import '../plugins/bootstrap/dist/css/bootstrap.min.css';
import '../plugins/fontawesome-free/css/all.min.css';
import '../plugins/ionicons/dist/css/ionicons.min.css';
import '../plugins/icon-kit/dist/css/iconkit.min.css';
import '../plugins/perfect-scrollbar/css/perfect-scrollbar.css';
import '../plugins/datatables.net-bs4/css/dataTables.bootstrap4.min.css'

const authApi = new AuthApi();

const ResetPassword: React.FC = () => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    //Check trùng otp vs otpPhone or otpEmail và lưu mật khẩu mới vào bảng mcas_user
    const onUpdate = (values: any) => {
        console.log("values", values);

        const queryParams = new URLSearchParams(window.location.search);
        const email = queryParams.get('email');
        const otpEmail = queryParams.get('otp');
        setLoading(true);
        authApi.updateResetPassword("", "", email!, otpEmail!, values.password).then(resp => {
            if (resp.status === 200) {
                notification.success({ message: 'Cập nhật thành công' })
            } else {
                notification.error({ message: 'Cập nhật thất bại' })
            }
        }).finally(() => setLoading(false));
    }

    return (
        <>
            <div className="auth-wrapper">
                <div className="container-fluid h-100">
                    <div className="row flex-row h-100 bg-light">
                        <div className="col-xl-8 col-lg-6 col-md-5 p-0 d-md-block d-lg-block d-sm-none d-none">
                            <div className="lavalite-bg" style={{ backgroundImage: `url('/img/auth/30.jpg')` }}>
                                <div className="lavalite-overlay"></div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-7 my-auto p-0">
                            <div style={{ backgroundColor: "white", height: '100vh' }} >
                                <div className="authentication-form mx-auto">
                                    <div className="logo-centered">
                                        <a href="../index.html"> <img src='/img/auth/logo.png' style={{ width: '50%', marginRight: '24%', marginLeft: '20%' }} /></a>
                                    </div>
                                    <h3>Yêu cầu Đổi mật khẩu</h3>

                                    <Form
                                        name="reset-password-form"
                                        labelCol={{ flex: '105px' }}
                                        labelAlign="left"
                                        labelWrap
                                        colon={false}
                                        onFinish={onUpdate}
                                        autoComplete="off"
                                        validateMessages={validateMessages}
                                        form={form}
                                    >
                                        <Row gutter={8}>
                                            <Col span={24}>
                                                <Form.Item
                                                    name="password"
                                                    label="Mật khẩu"
                                                    rules={[{ required: true }, pattenPassword]}
                                                    hasFeedback
                                                >
                                                    <Input.Password size="large" prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Mật khẩu' />
                                                </Form.Item>
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
                                                    <Input.Password size="large" prefix={<EyeInvisibleOutlined className="site-form-item-icon" />} placeholder="Xác nhận mật khẩu" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <div className="sign-btn text-center">
                                            <Button loading={isLoading} type="primary" htmlType="submit" className="btn_login btn-theme" size="large"> Xác nhận</Button>
                                        </div>
                                    </Form >
                                    <div className="register">
                                        <p>Bạn đã xác thực thành công?<Link to={loginPath}> Vui lòng bấm vào đây để <b>Đăng nhập</b></Link></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;