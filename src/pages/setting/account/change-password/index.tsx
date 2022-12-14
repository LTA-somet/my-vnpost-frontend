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
        //Update Password m???i v??o b???n mcas_user.employee_code = mcas_employee.code
        const newPassword = form.getFieldValue('password');
        const otpPhone = formOtp.getFieldValue('otp');
        const otpEmail: string = "";
        // const otpPhone = values.otp;
        //L???y code b???ng h??m get user ??ang ????ng nh???p
        mcasUserApi.updateChangePassword(otpPhone, otpEmail, newPassword).then(resp => {
            // console.log("resp", resp);

            if (resp.status === 200) {
                notification.success({ message: 'C???p nh???t th??nh c??ng' })
            } else {
                notification.error({ message: 'C???p nh???t th???t b???i' })
            }
        }).finally(() => setLoading(false));
        onCancel();
        onResetFormPass();
    };

    const onFinish = () => {
        //L???y m?? OTP l??u v??o b???ng mcas_employee > update handleOk() b???ng mcas_user
        setLoading(true);
        mcasUserApi.sendOtpChangePassword(actionType).then(resp => {
            if (resp.status === 200) {
                notification.success({ message: 'M?? x??c nh???n ???? ???????c g???i v??? ' + (actionType === 'PHONE' ? ' S??? ??i???n tho???i' : 'Email') });
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
                notification.success({ message: 'M?? x??c nh???n ???? ???????c g???i l???i v??? ' + (actionType === 'PHONE' ? ' S??? ??i???n tho???i' : 'Email') });
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
                                            label="M???t kh???u m???i"
                                            rules={[{ required: true }, pattenPassword]}
                                            hasFeedback
                                        >
                                            <Input.Password size="large" prefix={<LockOutlined className="site-form-item-icon" />} placeholder='M???t kh???u m???i' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="confirmPassword"
                                            label="Nh???p l???i m???t kh???u m???i"
                                            dependencies={['password']}
                                            hasFeedback
                                            rules={[{ required: true }, pattenPassword,
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('M???t kh???u kh??ng kh???p!'));
                                                },
                                            }),

                                            ]}
                                        >
                                            <Input.Password size="large" prefix={<EyeInvisibleOutlined className="site-form-item-icon" />} placeholder='M???t kh???u m???i' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                {/* <Row>
                                    <Col offset={10}>
                                        <Button className='custom-btn5 btn-outline-success' icon={<DoubleRightOutlined />} loading={isLoading} htmlType="submit" form="form-change-password" size="large" >
                                            Ti???p t???c
                                        </Button>
                                    </Col>
                                </Row> */}
                                <Row >
                                    <Col flex="auto" style={{ textAlign: 'center' }}>
                                        <Button className='custom-btn5 btn-outline-success' icon={<DoubleRightOutlined />} loading={isLoading} htmlType="submit" form="form-change-password" size="large" >
                                            Ti???p t???c
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                        </Form>
                    </Spin >
                </table>
            </div >
            <Modal title="X??c nh???n ?????i m???t kh???u"
                visible={isModalVisible}
                onOk={onConfirm}
                onCancel={onCancel}
                width={900}
                footer={
                    <Space>
                        <Button icon={<SendOutlined />} loading={isLoading} className="btn-outline-info" onClick={onResendOtp} >G???i l???i otp</Button>
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
                            cancelText="????ng"
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
                            X??c nh???n
                        </Button>
                        <Button icon={<ExportOutlined />} className='custom-btn1 btn-outline-secondary' key="back" onClick={onCancel}>
                            ????ng
                        </Button>
                        {/* <div className="col-md-12 center">
                            <div className="form-group">
                                <button type="button" onClick={onConfirm} className="btn btn-outline-success mr-2"><i className="ik ik-check-square"></i>  X??c nh???n</button>
                            </div>
                        </div> */}
                    </Space>
                }
            >
                <p>M?? OTP v???a ???????c g???i ?????n s??? ??i???n tho???i {formatPhone} c???a b???n</p>

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
                                label="Nh???p m?? OTP"
                                rules={[{ required: true, message: 'Tr?????ng n??y kh??ng ???????c ????? tr???ng!' }]}
                            >
                                <Input id="inputCustomPassword" maxLength={15} placeholder='Nh???p m?? OTP' />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <p style={{ border: '1px solid #e6dee1', padding: '0.3rem' }}>N???u kh??ng nh???n ???????c m??, vui l??ng g???i email <b style={{ color: '#0b5291' }}>cskhvnpost@vnpost.vn</b> Ho???c <b style={{ color: '#0b5291' }}>Chat v???i CSKH</b></p>
            </Modal>
        </>
    );

};

export default ChangePassword;