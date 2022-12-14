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
            notification.success({ message: 'B???n ch??a x??c nh???n S??? ??i???n tho???i' });
            return;
        }
        if (employee.email && !employee?.verifyEmail) {
            notification.success({ message: 'B???n ch??a x??c nh???n Email' });
            return;
        }
        setConfirming(true);
        authApi.confirmRegister(username).then(resp => {
            if (resp.status === 200) {
                notification.success({ message: '????ng k?? th??nh c??ng' })
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
                notification.success({ message: 'M?? x??c nh???n ???? ???????c g???i l???i v??? ' + (actionType === 'PHONE' ? ' S??? ??i???n tho???i' : 'Email') });
                setActionForm(undefined);
            }
        }).finally(() => setLoading(false));
    }

    const changePhoneOrEmail = (values: any) => {
        setLoading(true);
        const value = actionType === 'PHONE' ? values.phoneNumber : values.email;
        authApi.changePhoneOrEmail(username, actionType, value).then(resp => {
            if (resp.status === 200) {
                notification.success({ message: 'M?? x??c nh???n ???? ???????c g???i l???i v??? ' + (actionType === 'PHONE' ? ' S??? ??i???n tho???i m???i' : 'Email m???i') })
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
                                            <h3>X??c nh???n th??ng tin</h3>

                                            <div style={{ textAlign: 'left' }}>
                                                {(employee?.verifyPhone || employee?.verifyEmail) && <>????? ho??n th??nh vi???c ????ng k??, b???n c???n x??c nh???n c??c th??ng tin sau<br /></>}
                                                <br />
                                                {employee?.verifyPhone ?
                                                    <Alert message="S??? ??i???n tho???i ???? ???????c x??c nh???n" type="success" />
                                                    :
                                                    <>
                                                        <div style={{ padding: '5px 0px' }}>
                                                            <p> M?? x??c nh???n ???? ???????c g???i t???i S??T: <span style={{ fontWeight: 'bold' }}>{employee?.phoneNumber} </span><br />Vui l??ng ki???m tra tin nh???n v?? ??i???n m?? x??c minh
                                                                <a style={{ float: 'right' }} onClick={() => handleOpenPopupChangeData('PHONE')}>Thay ?????i S??T</a></p>


                                                        </div>
                                                        <div style={{ padding: '5px 0px' }}>
                                                            M?? x??c nh???n ??i???n tho???i &nbsp;
                                                            <a style={{ float: 'right' }} onClick={() => handleOpenPopupResend('PHONE')}><span style={{ fontWeight: 'bold' }}>G???i l???i m??</span>  </a>
                                                        </div>
                                                        <Input.Search size="middle" maxLength={4} enterButton="X??c nh???n"
                                                            onSearch={(value) => handleVerify(value, 'PHONE')} />
                                                    </>
                                                }

                                                {employee?.email && <>
                                                    <br /><br />
                                                    {employee?.verifyEmail ?
                                                        <Alert message="Email ???? ???????c x??c nh???n" type="success" />
                                                        :
                                                        <>
                                                            <div style={{ padding: '5px 0px' }}>
                                                                <p> M?? x??c nh???n ???? ???????c g???i t???i email: <span style={{ fontWeight: 'bold' }}> {employee?.email}</span>  <br />
                                                                    Vui l??ng ki???m tra email v?? ??i???n m?? x??c minh
                                                                    <a style={{ float: 'right' }} onClick={() => handleOpenPopupChangeData('EMAIL')}>Thay ?????i Email</a></p>
                                                            </div>
                                                            <div style={{ padding: '5px 0px' }}>
                                                                M?? x??c nh???n email &nbsp;
                                                                <a style={{ float: 'right' }} onClick={() => handleOpenPopupResend('EMAIL')}><span style={{ fontWeight: 'bold' }}>G???i l???i m??</span> </a>
                                                            </div>
                                                            <Input.Search size="middle" maxLength={4} enterButton="X??c nh???n" onSearch={(value) => handleVerify(value, 'EMAIL')} />
                                                        </>
                                                    }
                                                </>}

                                                <div style={{ textAlign: 'center', marginTop: 55 }}>
                                                    <Button loading={confirming} style={{ height: '40px' }} className="btn_login btn-theme" type="primary" onClick={handleConfirm} >Ho??n t???t</Button>
                                                </div>
                                            </div>



                                            <Modal
                                                visible={actionForm === 'RESEND'}
                                                width={350}
                                                title='X??c nh???n g???i l???i m?? OTP'
                                                onOk={() => {
                                                    const recaptchaValue = recaptchaRef.current?.getValue();
                                                    console.log(recaptchaValue)
                                                    if (!recaptchaValue) {
                                                        return;
                                                    }
                                                    handleResendOtp();
                                                }}
                                                okText='?????ng ??'
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
                                                title={'Thay ?????i ' + (actionType === 'PHONE' ? 's??? ??i???n tho???i' : 'email')}
                                                onOk={() => {
                                                    const recaptchaValue = recaptchaRef.current?.getValue();
                                                    console.log(recaptchaValue)
                                                    if (!recaptchaValue) {
                                                        return;
                                                    }
                                                    form.submit();
                                                }}
                                                okButtonProps={{ loading: isLoading }}
                                                okText='?????ng ??'
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
                                                            label="S??? ??i???n tho???i"
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
