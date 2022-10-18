import {
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';
import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import type { LoginRequestDTO } from '@/services/client';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { reCaptchaKey } from '@/core/contains';

const isDev = REACT_APP_ENV === 'dev' || REACT_APP_ENV === 'test';

const LoginForm: React.FC<Props> = (props: Props) => {
    const recaptchaRef = React.createRef<ReCAPTCHA>();
    const onFinish = async (values: any) => {
        const recaptchaValue = recaptchaRef.current?.getValue();
        if (!recaptchaValue && !isDev) {
            return;
        }
        props.onLogin(values);
    }
    return (
        <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            layout='vertical'
        >
            <Form.Item
                name="username"
                // label="Số điện thoại/Email"
                rules={[{ required: true, message: 'Tài khoản là bắt buộc!' }]}
            >
                <Input placeholder='Tài khoản' prefix={<UserOutlined className="site-form-item-icon" />} size="large" />
            </Form.Item>

            <Form.Item
                name="password"
                // label="Mật khẩu"
                rules={[{ required: true }]}
            >
                <Input.Password placeholder='Mật khẩu' prefix={<LockOutlined className="site-form-item-icon" />} size="large" />
            </Form.Item>
            <Row>
                <Col span={16}>{!isDev &&
                    <ReCAPTCHA
                        sitekey={reCaptchaKey}
                        size='normal'
                        ref={recaptchaRef}
                        className='g-recaptcha'
                    // onChange={onChange}
                    />
                }
                </Col>
                {!props.isEmployee && <Col span={8}>
                    <Link
                        to="/auth/restore-password"
                        style={{
                            float: 'right',
                            marginBottom: 10
                        }}
                    >
                        Quên mật khẩu
                    </Link>
                </Col>
                }
            </Row>
            <div className="text-center">
                <Button style={{ marginBottom: -5 }} loading={props.isLogging} htmlType="submit" className="btn_login btn-theme" size="large">Đăng nhập</Button>
            </div>
            {props.isEmployee && <div className="sign-btn-chip text-center">
                {<Link to="/auth/login"><b> Đăng nhập với tư cách là người sử dụng</b></Link>}
            </div>}

            {/* <Button loading={props.isLogging} type="primary" htmlType="submit" style={{ width: '100%', height: 44, borderRadius: 5, color: '#fff' }} size="large">
                Đăng Nhập
            </Button> */}
        </Form>
    )
}
type Props = {
    onLogin: (payload: LoginRequestDTO) => void,
    isLogging: boolean,
    isEmployee: boolean
}

export default LoginForm;
//30 + 