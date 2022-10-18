import React, { useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import Footer from '@/components/Footer';
import { loginPath, patternPhone, reCaptchaKey, validateMessages } from '@/core/contains';
import { AccountApi, AuthApi, ChangeInfoResponseTypeEnum, McasEmployeeApi, McasEmployeeDto } from '@/services/client';
import { Alert, Button, Card, Form, Input, Modal, notification } from 'antd';
import LoadingPage from '@/components/LoadingPage';
import ReCAPTCHA from 'react-google-recaptcha';
import { useCurrentUser } from '@/core/selectors';

const mcasEmployeeApi = new McasEmployeeApi();
const authApi = new AuthApi();
type VerifyType = 'PHONE' | 'EMAIL';
type ActionForm = 'RESEND' | 'CHANGE_INFO' | undefined;
const ConfirmChangeInfo: React.FC<Props> = (props: Props) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [actionType, setActionType] = useState<VerifyType>('PHONE');
    const [actionForm, setActionForm] = useState<ActionForm>();

    const recaptchaRef = React.createRef<ReCAPTCHA>();
    const [form] = Form.useForm();

    const currentUser = useCurrentUser();

    // console.log("props", props);

    const handleConfirm = () => {
        if (!props.employee?.verifyPhone) {
            notification.success({ message: 'Bạn chưa xác nhận Số điện thoại' });
            return;
        }
        if (props.employee.email && !props.employee?.verifyEmail) {
            notification.success({ message: 'Bạn chưa xác nhận Email' });
            return;
        }

        props.onFinish();

        // authApi.confirmRegister(username).then(resp => {
        //     if (resp.status === 200) {
        //         notification.success({ message: 'Đăng ký thành công' })
        //     }
        // })
    };

    const handleVerify = (otp: string, verifyType: VerifyType) => {
        if (!otp) return;

        mcasEmployeeApi.verifyCurrentUser(otp, verifyType).then(resp => {
            console.log("Xác nhận", resp);

            if (resp.status === 200) {
                props.setEmployee(resp.data);
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
        form.setFieldsValue(props.employee);
    }

    const handleResendOtp = () => {
        setLoading(true);
        const value = actionType === 'PHONE' ? props.employee!.phoneNumber! : props.employee!.email!;
        mcasEmployeeApi.resendOtpCurrentUser(actionType, value).then(resp => {
            if (resp.status === 200) {
                notification.success({ message: 'Mã xác nhận đã được gửi lại về ' + (actionType === 'PHONE' ? ' Số điện thoại' : 'Email') });
                setActionForm(undefined);
            }
        }).finally(() => setLoading(false));
    }

    const changePhoneOrEmail = (values: any) => {
        setLoading(true);
        const value = actionType === 'PHONE' ? values.phoneNumber : values.email;
        authApi.changePhoneOrEmail(currentUser.uid!, actionType, value).then(resp => {
            if (resp.status === 200) {
                notification.success({ message: 'Mã xác nhận đã được gửi lại về ' + (actionType === 'PHONE' ? ' Số điện thoại mới' : 'Email mới') })
                setActionForm(undefined);
                const newEmployee: McasEmployeeDto = { ...props.employee! }
                if (actionType === 'PHONE') {
                    newEmployee.phoneNumber = value;
                }
                if (actionType === 'EMAIL') {
                    newEmployee.email = value;
                }
                props.setEmployee(newEmployee)
            }
        }).finally(() => setLoading(false));
    }

    return (
        <Modal
            visible={props.visible}
            width={650}
            title={props.requestForm === ChangeInfoResponseTypeEnum.VerifyOld ? 'Xác nhận thông tin cũ' : 'Xác nhận thông tin mới'}
            onOk={() => {
                const recaptchaValue = recaptchaRef.current?.getValue();
                if (!recaptchaValue) {
                    return;
                }
                form.submit();
            }}
            footer={false}
            destroyOnClose
            onCancel={() => props.setVisible(false)}
        >
            <div className='g-container'>
                <div className='content'>
                    <div className={`form-register`}>
                        <div style={{ textAlign: 'left' }}>
                            {/* {(props.employee?.verifyPhone || props.employee?.verifyEmail) && <>Để hoàn thành việc đăng ký, bạn cần xác nhận các thông tin sau<br /></>} */}
                            {props.employee?.verifyPhone ?
                                // <Alert message="Số điện thoại đã được xác nhận" type="success" />
                                <></>
                                :
                                <>
                                    <div style={{ padding: '5px 0px' }}>
                                        Mã xác nhận đã được gửi tới SĐT: {props.employee?.phoneNumber} <br />
                                        Vui lòng kiểm tra tin nhắn và điền mã xác minh
                                        {/* <a style={{ float: 'right' }} onClick={() => handleOpenPopupChangeData('PHONE')}> Thay đổi SĐT </a> */}
                                    </div>
                                    <div style={{ padding: '5px 0px', fontWeight: 'bold' }}>
                                        Mã xác nhận điện thoại &nbsp;
                                        <a style={{ float: 'right' }} onClick={() => handleOpenPopupResend('PHONE')}> Gửi lại mã </a>
                                    </div>
                                    <Input.Search maxLength={4} enterButton="Xác nhận" size='small'
                                        onSearch={(value) => handleVerify(value, 'PHONE')} />
                                    <br />
                                </>
                            }

                            {props.employee?.email && <>
                                {props.employee?.verifyEmail ?
                                    // <Alert message="Email đã được xác nhận" type="success" />
                                    <></>
                                    :
                                    <>
                                        <br />
                                        <div style={{ padding: '5px 0px' }}>
                                            Mã xác nhận đã được gửi tới email: {props.employee?.email} <br />
                                            Vui lòng kiểm tra email và điền mã xác minh
                                            {/* <a style={{ float: 'right' }} onClick={() => handleOpenPopupChangeData('EMAIL')}> Thay đổi Email </a> */}
                                        </div>
                                        <div style={{ padding: '5px 0px', fontWeight: 'bold' }}>
                                            Mã xác nhận email &nbsp;
                                            <a style={{ float: 'right' }} onClick={() => handleOpenPopupResend('EMAIL')}> Gửi lại mã </a>
                                        </div>
                                        <Input.Search maxLength={4} enterButton="Xác nhận" onSearch={(value) => handleVerify(value, 'EMAIL')} />
                                    </>
                                }
                            </>}

                            <div style={{ textAlign: 'center', marginTop: 20 }}>
                                <Button type="primary" onClick={handleConfirm} >Hoàn tất</Button>
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
            </div >
        </Modal>
    );
};

type Props = {
    onFinish: () => void,
    visible: boolean,
    setVisible: (visible: boolean) => void,
    employee?: McasEmployeeDto,
    setEmployee: (employee: McasEmployeeDto) => void,
    requestForm: ChangeInfoResponseTypeEnum
}

export default ConfirmChangeInfo;
