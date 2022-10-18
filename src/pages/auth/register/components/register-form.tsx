import Address from "@/components/Address";
import { validatePhone, validateMessages, pattenPassword, reCaptchaKey, patternPhone } from "@/core/contains";
import { getUnitList } from "@/core/initdata";
import { AuthApi } from "@/services/client";
import { capitalizeName } from "@/utils";
import { formatNoStart } from "@/utils/PhoneUtil";
import { CompassOutlined, EyeInvisibleOutlined, GlobalOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Spin, Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useModel } from "umi";
import '../components/style.less';

const authApi = new AuthApi();
const RegisterForm: React.FC<Props> = (props: Props) => {
    const { initialState, setInitialState } = useModel('@@initialState');
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const recaptchaRef = React.createRef<ReCAPTCHA>();

    useEffect(() => {
        if (!initialState?.globalData?.administrativeUnitList) {
            setLoading(true);
            authApi
                .findAllUnit()
                .then((resp) => {
                    if (resp.status === 200) {
                        setInitialState((s) => ({
                            ...s,
                            globalData: {
                                administrativeUnitList: getUnitList(resp.data),
                                serviceList: [],
                                categoryAppParamList: [],
                                myvnpServiceGroupList: []
                            },
                        }));
                    }
                })
                .finally(() => setLoading(false));
        }
    }, []);

    const onBlurPhone = (e: any) => {
        const phone = e.target.value;
        form.setFieldsValue({
            phoneNumber: formatNoStart(phone)
        })
    }

    const onRegister = () => {
        form.validateFields()
            .then(formValue => {
                const recaptchaValue = recaptchaRef.current?.getValue();
                if (!recaptchaValue) {
                    return;
                }
                props.onRegister(formValue);
            })
    }

    return (
        <Form
            name="form-register"
            // onFinish={onRegister}
            // autoComplete="off"
            layout='horizontal'
            validateMessages={validateMessages}
            form={form}
            size={"small"}
        >
            {/* <Spin spinning={loading}> */}
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
                                            <h3>New to VietNamPost</h3>
                                            {/* <form action="../index.html"> */}
                                            <Row gutter={8} >
                                                <Col span={8} >
                                                    <Form.Item name="fullname" rules={[{ required: true, message: 'Họ tên là bắt buộc' }]} getValueFromEvent={e => capitalizeName(e.target.value)}>
                                                        <Input autoComplete="new-fullname" prefix={<UserOutlined className="site-form-item-icon" />}
                                                            style={{ borderRadius: "5px", fontSize: "0.8rem" }} size="large" type="text" placeholder="Họ và tên" />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item name="email" rules={[{ type: 'email' }]} >
                                                        <Input prefix={<MailOutlined className="site-form-item-icon" />} style={{ borderRadius: "5px", fontSize: "0.8rem" }} size="large" type="text" placeholder="E-mail" />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <div id="inputPhoneNumberAddon" className="inputPhoneNumber">
                                                        <Form.Item name="phoneNumber" rules={[{ required: true, message: 'Số điện thoại là bắt buộc' }, patternPhone]}>
                                                            <Input autoComplete="new-phoneNumber" id="inputPhoneNumberAddon" addonBefore="+84" prefix={<PhoneOutlined className="site-form-item-icon" />} size="large" onBlur={onBlurPhone} placeholder="Điện thoại" />
                                                        </Form.Item>
                                                    </div>
                                                </Col>
                                                <Address form={form} size="middle" span={12}
                                                    // md={24} lg={24}

                                                    hiddenLabel={true}
                                                    addressName=""
                                                    id="form-register_address"
                                                    className="inputBorderRadius"
                                                    styleBorder="5px"
                                                    styleFontSize="0.8rem"
                                                    styleHeight="35px"
                                                    labelWidth={0}
                                                    prefixAddress={<GlobalOutlined className="site-form-item-icon" />}
                                                    prefixProvince={<CompassOutlined />}
                                                />
                                            </Row>
                                            <Row gutter={8}>
                                                <Col span={12}>
                                                    <div id="inputBorderRadius">
                                                        <Form.Item name="password" rules={[{ required: true }, pattenPassword]} hasFeedback>
                                                            <Input.Password autoComplete="new-password" id="inputBorderRadius" prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Mật khẩu' size="large" />
                                                        </Form.Item>
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <div id="inputBorderRadius">
                                                        <Form.Item name="confirm" dependencies={['password']} hasFeedback rules={[{ required: true, },
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
                                                            <Input.Password autoComplete="off" id="inputBorderRadius" prefix={<EyeInvisibleOutlined className="site-form-item-icon" />} size="large" placeholder="Xác nhận mật khẩu" />
                                                        </Form.Item>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={12}>
                                                    <ReCAPTCHA
                                                        sitekey={reCaptchaKey}
                                                        size='normal'
                                                        style={{ width: '50%' }}
                                                        ref={recaptchaRef}
                                                        className='g-recaptcha'
                                                    // onChange={onChange}
                                                    />
                                                </Col>

                                            </Row>
                                            <div className="sign-btn text-center">
                                                <Button loading={props.isRegistering} className="btn_login btn-theme" type="primary" onClick={onRegister} size="large">
                                                    Đăng ký
                                                </Button>
                                                <br />
                                                <br />
                                                <span >Bạn đã có tài khoản?<Link to="/auth/login"> <b>Đăng nhập</b> </Link></span>
                                            </div>
                                            {/* </form> */}
                                            {/* <div style={{ padding: '20px', textAlign: 'center' }}>
                                                <span >Bạn đã có tài khoản?<Link to="/auth/login"> <b>Đăng nhập</b> </Link></span>
                                            </div> */}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            {/* </Spin> */}
        </Form >
    )
}
type Props = {
    onRegister: (value: any) => void,
    isRegistering: boolean,
}
export default RegisterForm;
