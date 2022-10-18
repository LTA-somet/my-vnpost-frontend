import React, { useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import Footer from '@/components/Footer';
import { loginPath, patternPhone, reCaptchaKey, validateMessages } from '@/core/contains';
import { AuthApi, McasEmployeeDto } from '@/services/client';
import '../../index.less'
import { Alert, Button, Card, Form, Input, Modal, notification, Row } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import LoadingPage from '@/components/LoadingPage';
import ReCAPTCHA from 'react-google-recaptcha';

import './scss/theme.css';
import './scss/style.css';
import './plugins/bootstrap/dist/css/bootstrap.min.css';
import './plugins/fontawesome-free/css/all.min.css';
import './plugins/ionicons/dist/css/ionicons.min.css';
import './plugins/icon-kit/dist/css/iconkit.min.css';
import './plugins/perfect-scrollbar/css/perfect-scrollbar.css';
import './plugins/datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import '../components/style.less';

const authApi = new AuthApi();
type VerifyType = 'PHONE' | 'EMAIL';
type ActionForm = 'RESEND' | 'CHANGE_INFO' | undefined;
const Login: React.FC = () => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [employee, setEmployee] = useState<McasEmployeeDto>();
    const [actionType, setActionType] = useState<VerifyType>('PHONE');
    const [actionForm, setActionForm] = useState<ActionForm>();
    const [confirming, setConfirming] = useState<boolean>(false);

    const recaptchaRef = React.createRef<ReCAPTCHA>();
    const [form] = Form.useForm();

    const params: any = useParams();
    const username = params.username;

    useEffect(() => {
        authApi.getEmployeeDtoNotActive(username)
            .then(resp => resp.status === 200 && setEmployee(resp.data));
    }, [username]);

    if (!employee) {
        return <LoadingPage />
    }

    const redirectUrl = () => {
        history.push(loginPath);
        return;
    }

    const handleConfirm = () => {
        if (!employee?.verifyPhone) {
            notification.success({ message: 'Bạn chưa xác nhận Số điện thoại' });
            return;
        }
        if (employee.email && !employee?.verifyEmail) {
            notification.success({ message: 'Bạn chưa xác nhận Email' });
            return;
        }
        setConfirming(true);
        authApi.confirmRegister(username).then(resp => {
            if (resp.status === 200) {
                notification.success({ message: 'Đăng ký thành công' })
                redirectUrl();
            }
        }).finally(() => setConfirming(false));
    };

    const handleVerify = (otp: string, verifyType: VerifyType) => {
        if (!otp) return;

        authApi.verify(username, otp, verifyType).then(resp => {
            if (resp.status === 200) {
                setEmployee(resp.data);
            }
        })
    };

    const handleOpenPopupResend = (verifyType: VerifyType) => {
        setActionForm('RESEND');
        setActionType(verifyType);
    }

    const handleOpenPopupChangeData = (verifyType: VerifyType) => {
        setActionForm('CHANGE_INFO');
        setActionType(verifyType);
        form.setFieldsValue(employee);
    }

    const handleResendOtp = () => {
        setLoading(true);
        authApi.resendOtp(username, actionType).then(resp => {
            if (resp.status === 200) {
                notification.success({ message: 'Mã xác nhận đã được gửi lại về ' + (actionType === 'PHONE' ? ' Số điện thoại' : 'Email') });
                setActionForm(undefined);
            }
        }).finally(() => setLoading(false));
    }

    const changePhoneOrEmail = (values: any) => {
        setLoading(true);
        const value = actionType === 'PHONE' ? values.phoneNumber : values.email;
        authApi.changePhoneOrEmail(username, actionType, value).then(resp => {
            if (resp.status === 200) {
                notification.success({ message: 'Mã xác nhận đã được gửi lại về ' + (actionType === 'PHONE' ? ' Số điện thoại mới' : 'Email mới') })
                setActionForm(undefined);
                const newEmployee = { ...employee }
                if (actionType === 'PHONE') {
                    newEmployee.phoneNumber = value;
                }
                if (actionType === 'EMAIL') {
                    newEmployee.email = value;
                }
                setEmployee(newEmployee)
            }
        }).finally(() => setLoading(false));
    }

    return (
        <Form
            size={"small"}
        >

            <body>
                <div className="auth-wrapper">
                    <div className="container-fluid h-100">
                        <div className="row flex-row h-100 bg-white">
                            <div className="lavalite-bg" style={{ backgroundImage: `url('/img/auth/register.jpg')`, width: '100%' }}>
                                <div className="lavalite-overlay1">
                                    <div className="register-2" >
                                        <div className="authentication-form mx-auto">
                                            <div >
                                                <a href="../index.html"> <img src='/img/auth/logo.png' alt='' style={{ width: '20%', margin: '0px 40%' }} /></a>
                                            </div>
                                            <h3>Xác nhận thông tin</h3>

                                            <div style={{ textAlign: 'left' }}>
                                                {(employee?.verifyPhone || employee?.verifyEmail) && <>Để hoàn thành việc đăng ký, bạn cần xác nhận các thông tin sau<br /></>}
                                                <br />
                                                {employee?.verifyPhone ?
                                                    <Alert message="Số điện thoại đã được xác nhận" type="success" />
                                                    :
                                                    <>
                                                        <div style={{ padding: '5px 0px' }}>
                                                            <p> Mã xác nhận đã được gửi tới SĐT: <span style={{ fontWeight: 'bold' }}>{employee?.phoneNumber} </span><br />Vui lòng kiểm tra tin nhắn và điền mã xác minh
                                                                <a style={{ float: 'right' }} onClick={() => handleOpenPopupChangeData('PHONE')}>Thay đổi SĐT</a></p>


                                                        </div>
                                                        <div style={{ padding: '5px 0px' }}>
                                                            Mã xác nhận điện thoại &nbsp;
                                                            <a style={{ float: 'right' }} onClick={() => handleOpenPopupResend('PHONE')}><span style={{ fontWeight: 'bold' }}>Gửi lại mã</span>  </a>
                                                        </div>
                                                        <Input.Search size="middle" maxLength={4} enterButton="Xác nhận"
                                                            onSearch={(value) => handleVerify(value, 'PHONE')} />
                                                    </>
                                                }

                                                {employee?.email && <>
                                                    <br /><br />
                                                    {employee?.verifyEmail ?
                                                        <Alert message="Email đã được xác nhận" type="success" />
                                                        :
                                                        <>
                                                            <div style={{ padding: '5px 0px' }}>
                                                                <p> Mã xác nhận đã được gửi tới email: <span style={{ fontWeight: 'bold' }}> {employee?.email}</span>  <br />
                                                                    Vui lòng kiểm tra email và điền mã xác minh
                                                                    <a style={{ float: 'right' }} onClick={() => handleOpenPopupChangeData('EMAIL')}>Thay đổi Email</a></p>
                                                            </div>
                                                            <div style={{ padding: '5px 0px' }}>
                                                                Mã xác nhận email &nbsp;
                                                                <a style={{ float: 'right' }} onClick={() => handleOpenPopupResend('EMAIL')}><span style={{ fontWeight: 'bold' }}>Gửi lại mã</span> </a>
                                                            </div>
                                                            <Input.Search size="middle" maxLength={4} enterButton="Xác nhận" onSearch={(value) => handleVerify(value, 'EMAIL')} />
                                                        </>
                                                    }
                                                </>}

                                                <div style={{ textAlign: 'center', marginTop: 55 }}>
                                                    <Button loading={confirming} style={{ height: '40px' }} className="btn_login btn-theme" type="primary" onClick={handleConfirm} >Hoàn tất</Button>
                                                </div>
                                            </div>



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
                                                okButtonProps={{ loading: isLoading }}
                                                destroyOnClose
                                            >
                                                <ReCAPTCHA
                                                    sitekey={reCaptchaKey}
                                                    size='normal'
                                                    ref={recaptchaRef}
                                                />
                                            </Modal>
                                            <Modal
                                                visible={actionForm === 'CHANGE_INFO'}
                                                width={350}
                                                title={'Thay đổi ' + (actionType === 'PHONE' ? 'số điện thoại' : 'email')}
                                                onOk={() => {
                                                    const recaptchaValue = recaptchaRef.current?.getValue();
                                                    console.log(recaptchaValue)
                                                    if (!recaptchaValue) {
                                                        return;
                                                    }
                                                    form.submit();
                                                }}
                                                okButtonProps={{ loading: isLoading }}
                                                okText='Đồng ý'
                                                onCancel={() => setActionForm(undefined)}
                                                destroyOnClose
                                            >
                                                <Form name="form-change-value"
                                                    // labelCol={{ flex: '130px' }}
                                                    labelWrap
                                                    onFinish={changePhoneOrEmail}
                                                    form={form}
                                                    validateMessages={validateMessages}
                                                    layout='vertical'
                                                >
                                                    {actionType === 'PHONE' &&
                                                        <Form.Item
                                                            name="phoneNumber"
                                                            label="Số điện thoại"
                                                            rules={[{ required: true }, patternPhone]}
                                                        >
                                                            <Input size="large" />
                                                        </Form.Item>
                                                    }
                                                    {actionType === 'EMAIL' &&
                                                        <Form.Item
                                                            name="email"
                                                            label="Email"
                                                            rules={[{ type: 'email' }]}
                                                        >
                                                            <Input size="large" />
                                                        </Form.Item>}
                                                </Form>
                                                <ReCAPTCHA
                                                    sitekey={reCaptchaKey}
                                                    size='normal'
                                                    ref={recaptchaRef}
                                                />
                                            </Modal>
                                        </div >

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </body>
            {/* </Spin> */}
        </Form >
    );
};

export default Login;
