import { validateMessages } from "@/core/contains";
import { McasEmployeeDto } from "@/services/client";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { reCaptchaKey } from '@/core/contains';

const { confirm } = Modal;
type VerifyType = 'PHONE' | 'EMAIL' | undefined;
const RegisterConfirm: React.FC<Props> = (props: Props) => {
    const [verifyType, setVerifyType] = useState<VerifyType>();
    const recaptchaRef = React.createRef<ReCAPTCHA>();

    return (
        <div className={`form-register fadeInBottom`}>
            <Card title="Xác nhận thông tin">
                <div style={{ textAlign: 'left' }}>
                    {(props.employee?.verifyPhone || props.employee?.verifyEmail) && <>Để hoàn thành việc đăng ký, bạn cần xác nhận các thông tin sau<br /></>}
                    <br />
                    {props.employee?.verifyPhone ?
                        <Alert message="Số điện thoại đã được xác nhận" type="success" />
                        :
                        <>
                            Mã xác nhận đã được gửi tới SĐT: {props.employee?.phoneNumber} <br />
                            Vui lòng kiểm tra tin nhắn và điền mã xác minh
                            <br />
                            <div style={{ padding: '5px 0px', fontWeight: 'bold' }}>
                                Mã xác nhận điện thoại &nbsp;
                                <a style={{ float: 'right' }} onClick={() => setVerifyType('PHONE')}> Gửi lại mã </a>
                            </div>
                            <Input.Search maxLength={4} size="large" enterButton="Xác nhận"
                                onSearch={(value) => props.onVerify(value, 'PHONE')} />
                        </>
                    }

                    {props.employee?.email && <>
                        <br /><br />
                        {props.employee?.verifyEmail ?
                            <Alert message="Email đã được xác nhận" type="success" />
                            :
                            <>
                                Mã xác nhận đã được gửi tới email: {props.employee?.email} <br />
                                Vui lòng kiểm tra email và điền mã xác minh
                                <br />
                                <div style={{ padding: '5px 0px', fontWeight: 'bold' }}>
                                    Mã xác nhận email &nbsp;
                                    <a style={{ float: 'right' }} onClick={() => setVerifyType('EMAIL')}> Gửi lại mã </a>
                                </div>
                                <Input.Search maxLength={4} size="large" enterButton="Xác nhận" onSearch={(value) => props.onVerify(value, 'EMAIL')} />
                            </>
                        }
                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                            <Button type="primary" onClick={props.onConfirm} >Xác nhận</Button>
                        </div>
                    </>}
                </div>
            </Card >
            <Modal
                visible={!!verifyType}
                width={350}
                title='Xác nhận gửi lại mã OTP'
                onOk={() => {
                    const recaptchaValue = recaptchaRef.current?.getValue();
                    console.log(recaptchaValue)
                    if (!recaptchaValue) {
                        return;
                    }
                    props.onResendOtp(verifyType!, (success: boolean) => success && setVerifyType(undefined));
                }}
                okText='Đồng ý'
                onCancel={() => setVerifyType(undefined)}
            >
                <ReCAPTCHA
                    sitekey={reCaptchaKey}
                    size='normal'
                    ref={recaptchaRef}
                />
            </Modal>
        </div >
    )
}
type Props = {
    onConfirm: (value: any) => void,
    onVerify: (otp: string, verifyType: 'PHONE' | 'EMAIL') => void,
    onResendOtp: (verifyType: 'PHONE' | 'EMAIL', callback: (success: boolean) => void) => void,
    isConfirming: boolean,
    employee?: McasEmployeeDto
}
export default RegisterConfirm;