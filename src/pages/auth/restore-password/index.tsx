import { loginPath, pattenPassword, patternPhone, reCaptchaKey, regexPassword, regexPhone, validateMessages } from '@/core/contains';
import { AuthApi } from '@/services/client';
import { Col, Form, Input, Row, Button, Select, notification, InputNumber, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, Redirect, useLocation } from 'umi';
import { McasEmployeeApi, McasEmployeeDto } from '../../../services/client/api';
import { CheckCircleOutlined, EyeInvisibleOutlined, LockOutlined, MailOutlined, PhoneOutlined, SendOutlined } from '@ant-design/icons';
// import styles from './index.less';
import '../scss/theme.css';
import '../scss/style.css';
import '../plugins/bootstrap/dist/css/bootstrap.min.css';
import '../plugins/fontawesome-free/css/all.min.css';
import '../plugins/ionicons/dist/css/ionicons.min.css';
import '../plugins/icon-kit/dist/css/iconkit.min.css';
import '../plugins/perfect-scrollbar/css/perfect-scrollbar.css';
import '../plugins/datatables.net-bs4/css/dataTables.bootstrap4.min.css'
import ReCAPTCHA from 'react-google-recaptcha';

const authApi = new AuthApi();

type VerifyType = 'PHONE' | 'EMAIL';
type ActionForm = 'RESEND';
const RestorePassword: React.FC = () => {
    const [isLogging, setIsLogging] = useState<boolean>(false);
    const [sendRequirePhone, setSendRequirePhone] = useState<boolean>(false);
    const [sendRequireEmail, setSendRequireEmail] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [actionType, setActionType] = useState<VerifyType>('PHONE');
    const [actionForm, setActionForm] = useState<ActionForm>();
    const { Option } = Select;
    const [employee, setEmployee] = useState<McasEmployeeDto>();
    const [newPassword, setNewPassword] = useState<string>();
    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isFromLogin, setFromLogin] = useState<boolean>(false);

    const recaptchaRef = React.createRef<ReCAPTCHA>();

    const [form] = Form.useForm();

    const location: any = useLocation();
    const actionTypeInit = location?.query?.actionType || 'PHONE';
    const valueInit = location?.query?.value;

    useEffect(() => {
        setActionType(actionTypeInit);
    }, [])

    let formatPhone: any;
    if (employee) {
        formatPhone = employee?.phoneNumber;
        formatPhone = removeSubstring(formatPhone, 4, 9, "xxxxx");
    }

    function removeSubstring(phone: any, startIndex: any, endIndex: any, text: string) {
        if (endIndex < startIndex) {
            startIndex = endIndex;
        }
        const a = phone.substring(0, startIndex);
        const b = phone.substring(endIndex);

        return a + text + b;
    }

    const loadDataEmployee = (phoneNumber: string, emailEmployee: string, type: string) => {
        authApi.getEmployeeDtoByPhoneOrEmail(phoneNumber, emailEmployee, type)
            .then(resp => resp.status === 200 && setEmployee(resp.data));
    };

    //Chọn hình thức xác nhận
    const changePhoneOrEmail = (value: VerifyType) => {
        setActionType(value);
        if (value === "EMAIL") {
            setSendRequirePhone(false);
        } else {
            setSendRequireEmail(true);
        }
    }
    //Gửi yêu cầu thay đổi mật khẩu lưu mã otp vào bảng mcas_employee
    const onFinish = (values: any) => {
        if (values.phoneNumber) { values.email = "" } else { values.phoneNumber = "" }
        setNewPassword(values.password);
        setPhone(values.phoneNumber)
        setEmail(values.email)
        if (actionType === "PHONE") {
            setLoading(true);
            authApi.sendOtpResetPassword(values.phoneNumber, values.email, actionType).then(resp => {
                if (resp.status === 200) {
                    setSendRequirePhone(true);
                    notification.success({ message: 'Mã xác nhận đã được gửi về ' + (actionType === 'PHONE' ? ' Số điện thoại' : 'Email') });
                }
                loadDataEmployee(values.phoneNumber, values.email, actionType)
            }).finally(() => setLoading(false));
        } else {
            setLoading(true);
            authApi.sendOtpResetPassword(values.phoneNumber, values.email, actionType).then(resp => {
                if (resp.status === 200) {
                    // notification.success({ message: 'Gửi Link khôi phục mật khẩu thành công !' });
                    setSendRequireEmail(true);
                    notification.success({ message: 'Mã xác nhận đã được gửi về ' + (actionType === 'EMAIL' ? ' Email' : '') });
                }
                loadDataEmployee(values.phoneNumber, values.email, actionType)
            }).finally(() => setLoading(false));
        }
    }

    //Check trùng otp vs otpPhone or otpEmail và lưu mật khẩu mới vào bảng mcas_user
    const onUpdate = () => {
        let otpPhone = form.getFieldValue('otpPhone');
        let otpEmail = form.getFieldValue('otpEmail');
        if (otpPhone) { otpEmail = "" } else { otpPhone = "" }
        setLoading(true);
        authApi.updateResetPassword(phone!, otpPhone, email, otpEmail, newPassword!).then(resp => {
            if (resp.status === 200) {
                notification.success({ message: 'Cập nhật thành công' })
                setFromLogin(true);
            } else {
                notification.error({ message: 'Cập nhật thất bại' })
            }
        }).finally(() => setLoading(false));
    }

    if (isFromLogin) {
        //Go to Login
        return <Redirect to="/auth/login" />
    }

    const onResendOtp = () => {
        setActionForm("RESEND");
    }

    const handleResendOtp = () => {
        setLoading(true);
        // const value = actionType === 'PHONE' ? phone! : email;
        authApi.sendOtpResetPassword(phone, email, actionType).then(resp => {
            if (resp.status === 200) {
                notification.success({ message: 'Mã xác nhận đã được gửi lại về ' + (actionType === 'PHONE' ? ' Số điện thoại' : 'Email') });
                setActionForm(undefined);
            }
        }).finally(() => setLoading(false));
    }

    return (
        <>
            <div className="auth-wrapper">
                <div className="container-fluid h-100">
                    <div className="row flex-row h-100 bg-white">
                        <div className="col-xl-8 col-lg-6 col-md-5 p-0 d-md-block d-lg-block d-sm-none d-none">
                            <div className="lavalite-bg" style={{ backgroundImage: `url('/img/auth/30.jpg')` }}>
                                <div className="lavalite-overlay"></div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-7 my-auto p-0">
                            <div style={{ backgroundColor: 'white', height: '100vh' }}>
                                <div className="authentication-form mx-auto">
                                    <div className="logo-centered">
                                        <a href="../index.html"><img src='/img/auth/logo.png' alt="" style={{ width: "50%", marginRight: "24%", marginLeft: "20%" }} /></a>
                                    </div>
                                    <h3>Yêu cầu thay đổi mật khẩu</h3>
                                    {actionType === 'EMAIL' && <p>Chúng tôi sẽ gửi cho bạn một liên kết để bạn đặt lại mật khẩu.</p>}
                                    {actionType === 'PHONE' && <p>Chúng tôi sẽ gửi cho bạn một mã xác thực qua tin nhắn để bạn đặt lại mật khẩu.</p>}

                                    <Form
                                        name="restore-password-form"
                                        labelCol={{ flex: '120px' }}
                                        labelAlign="left"
                                        labelWrap
                                        colon={false}
                                        onFinish={onFinish}
                                        autoComplete="off"
                                        validateMessages={validateMessages}
                                        form={form}
                                    >
                                        <Row gutter={8}>
                                            <Col span={24}>
                                                <Form.Item
                                                    name=""
                                                    // label="Chọn hình thức xác nhận"
                                                    label={<span style={{ marginTop: '15%' }} >Chọn hình thức<p>xác nhận</p></span>}
                                                    rules={[{ required: true, }]}
                                                    initialValue={actionTypeInit}
                                                >
                                                    <Select disabled={!!valueInit} onChange={changePhoneOrEmail}>
                                                        <Option value="PHONE">Điện thoại</Option>
                                                        <Option value="EMAIL">Email</Option>
                                                    </Select>
                                                </Form.Item>
                                                {
                                                    actionType === 'EMAIL' && <Form.Item
                                                        name="email"
                                                        label="Email"
                                                        rules={[{ required: true, type: "email" }]}
                                                        initialValue={actionTypeInit === 'EMAIL' ? valueInit : ''}
                                                    >
                                                        <Input disabled={!!valueInit} placeholder='E-mail' prefix={<MailOutlined className="site-form-item-icon" />} />
                                                    </Form.Item>
                                                }
                                                {
                                                    actionType === 'PHONE' && <Form.Item
                                                        name="phoneNumber"
                                                        label="Số điện thoại"
                                                        rules={[{ required: true }, patternPhone]}
                                                        initialValue={actionTypeInit === 'PHONE' ? valueInit : ''}
                                                    >
                                                        <Input disabled={!!valueInit} maxLength={15} placeholder='Nhập số điện thoại' prefix={<PhoneOutlined className="site-form-item-icon" />} />
                                                    </Form.Item>
                                                }
                                                {
                                                    <>
                                                        <Form.Item
                                                            name="password"
                                                            label="Mật khẩu"
                                                            rules={[{ required: true }, pattenPassword]}
                                                            hasFeedback
                                                        >
                                                            <Input.Password autoComplete="new-password" size="middle" placeholder='Nhập mật khẩu' prefix={<LockOutlined className="site-form-item-icon" />} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name="confirmPassword"
                                                            // label="Nhập lại mật khẩu mới"
                                                            label={<span style={{ marginTop: '15%' }}>Nhập lại<p>mật khẩu mới</p></span>}
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
                                                            <Input.Password autoComplete="new-password" size="middle" placeholder='Nhập lại mật khẩu' prefix={<EyeInvisibleOutlined className="site-form-item-icon" />} />
                                                        </Form.Item>
                                                    </>
                                                }
                                                {
                                                    actionType === 'PHONE' && sendRequirePhone &&
                                                    <>
                                                        <p>Mã OTP sẽ được gửi đến số điện thoại {formatPhone} của bạn.</p>
                                                        <Form.Item
                                                            name="otpPhone"
                                                            label="Mã OTP"
                                                            rules={[{ required: true }]}
                                                        >
                                                            <Input maxLength={4} style={{ width: '100%' }} placeholder="Nhập mã OTP" />
                                                        </Form.Item>
                                                    </>
                                                }
                                                {
                                                    actionType === 'EMAIL' && sendRequireEmail &&
                                                    <>
                                                        <p>Mã OTP sẽ được gửi đến email "{employee?.email}" của bạn.</p>
                                                        <Form.Item
                                                            name="otpEmail"
                                                            label="Mã OTP"
                                                            rules={[{ required: true }]}
                                                        >
                                                            <Input className='input-custome' maxLength={4} style={{ width: '100%' }} placeholder="Nhập mã OTP" />
                                                        </Form.Item>
                                                    </>
                                                }
                                            </Col>
                                        </Row>

                                        {
                                            actionType === 'PHONE' && sendRequirePhone && <>
                                                <div style={{ float: "right" }}>
                                                    <Button icon={<CheckCircleOutlined />} loading={isLoading} className="btn-outline-success" onClick={onUpdate} >Xác nhận</Button>
                                                    <span style={{ paddingLeft: 5 }}>
                                                        <Button icon={<SendOutlined />} loading={isLoading} className="btn-outline-info" onClick={onResendOtp} >Gửi lại otp</Button>
                                                    </span>
                                                </div>
                                                <br />
                                            </>
                                        }
                                        {
                                            actionType === 'EMAIL' && sendRequireEmail && <>
                                                <div style={{ float: "right" }}>
                                                    <Button icon={<CheckCircleOutlined />} loading={isLoading} className="btn-outline-success" onClick={onUpdate} >Xác nhận</Button>
                                                    <span style={{ paddingLeft: 5 }}>
                                                        <Button icon={<SendOutlined />} loading={isLoading} className="btn-outline-info" onClick={onResendOtp} >Gửi lại otp</Button>
                                                    </span>
                                                </div>
                                                <br />
                                            </>
                                        }

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
                                        <br />
                                        <div className="sign-btn text-center">
                                            <Button loading={isLogging} htmlType="submit" className="btn_login btn-theme" size="large">Gửi yêu cầu</Button>
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

export default RestorePassword;