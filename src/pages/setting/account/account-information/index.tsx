import Address from '@/components/Address';
import { ACCESS_TOKEN_KEY, patternPhone, regexName, regexPhone, validateMessages } from '@/core/contains';
import { AccountInfo, AuthApi, ChangeInfoResponseTypeEnum, McasEmployeeApi, McasEmployeeDto } from '@/services/client';
import { Card, Col, DatePicker, Form, Input, Row, Spin, Button, Space, notification, Modal } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import ConfirmChangeInfo from './confirm';
import { UndoOutlined, SaveOutlined, LinkOutlined, UserOutlined, MessageOutlined, DisconnectOutlined, ExclamationCircleOutlined, CloseOutlined } from '@ant-design/icons';
import './index.less'
import { capitalizeName } from '@/utils';
import { useModel } from 'umi';
import { reloadAccessToken } from '@/core/interceptors/axiosConfig';
import { logout } from '@/components/RightContent/AvatarDropdown';

const mcasEmployeeApi = new McasEmployeeApi();
const authApi = new AuthApi();
const AccountInformation = () => {
    // const [dataSource, setDataSource] = useState<McasEmployeeDto[]>([]);
    const { initialState, setInitialState } = useModel('@@initialState');
    const [isLoading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [visibleFormVerify, setVisibleFormVerify] = useState<boolean>(false);
    const [requestForm, setRequestForm] = useState<ChangeInfoResponseTypeEnum>(ChangeInfoResponseTypeEnum.Change);

    const [employee, setEmployee] = useState<McasEmployeeDto>();

    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };

    useEffect(() => {
        if (!visibleFormVerify) {
            setRequestForm(ChangeInfoResponseTypeEnum.Change);
        }
    }, [visibleFormVerify])

    const onReset = () => {
        form.resetFields();
    };

    const resetAccountInfo = (newEmployee: McasEmployeeDto) => {
        const newAccount: AccountInfo = {
            ...initialState?.accountInfo,
            ufn: newEmployee.fullname,
            phoneNumber: newEmployee.phoneNumber,
            addr: newEmployee.address,
            prov: newEmployee.provinceCode,
            dist: newEmployee.districtCode,
            comm: newEmployee.communeCode
        }
        setInitialState({ ...initialState, accountInfo: newAccount })
    }

    const renewToken = () => {
        authApi.renewToken()
            .then(resp => {
                localStorage.setItem(ACCESS_TOKEN_KEY, resp.data.accessToken!);
                reloadAccessToken(resp.data.accessToken!);
            })
    }

    const onFinish = () => {
        setLoading(true);
        form.validateFields()
            .then(formValue => {
                if (formValue.dateOfBirth) {
                    formValue.dateOfBirth = formValue.dateOfBirth?.format('DD/MM/YYYY HH:mm:ss');
                }
                let requestType = ChangeInfoResponseTypeEnum.Change;
                if (requestForm === ChangeInfoResponseTypeEnum.VerifyOld) {
                    requestType = ChangeInfoResponseTypeEnum.ConfirmVerifyOld;
                }
                if (requestForm === ChangeInfoResponseTypeEnum.VerifyNew) {
                    requestType = ChangeInfoResponseTypeEnum.ConfirmVerifyNew;
                }
                mcasEmployeeApi.updateCurrentUser(requestType, formValue)
                    .then(resp => {

                        console.log("resp", resp);

                        if (resp.status === 200) {
                            if (resp.data.type === ChangeInfoResponseTypeEnum.Success) {
                                notification.success({ message: 'Thay đổi thông tin thành công' })
                                setVisibleFormVerify(false);
                                renewToken();
                                resetAccountInfo(resp.data.employeeDto!);
                                return;
                            }
                            if (resp.data.type === ChangeInfoResponseTypeEnum.VerifyNew) {
                                // đổi thông tin emp về thông tin mới
                                setEmployee({ ...resp.data.employeeDto!, phoneNumber: formValue?.phoneNumber, email: formValue?.email })
                            } else {
                                setEmployee(resp.data.employeeDto)
                            }
                            setRequestForm(resp.data.type!);
                            setVisibleFormVerify(true);
                        }
                    })
            }).finally(() => setLoading(false));
    };

    const onFill = (formValue: any) => {
        if (formValue.dateOfBirth) {
            formValue.dateOfBirth = moment(formValue.dateOfBirth, 'YYYY-MM-DD');
        }
        form.setFieldsValue(formValue);
    };

    const reload = useCallback((callback?: (success: boolean) => void) => {
        setLoading(true);
        mcasEmployeeApi
            .getCurrentUser()
            .then((resp) => {
                if (resp.status === 200) {
                    //setDataSource(resp.data);
                    onFill(resp.data);
                }
                if (callback) {
                    callback(resp.status === 200);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        reload();
    }, []);

    const onDelete = () => {
        Modal.confirm({
            title: 'Xác nhận xoá tài khoản',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có muốn xoá tài khoản hiện tại?',
            okText: 'Đồng ý',
            cancelText: 'Huỷ',
            onOk() {
                mcasEmployeeApi.deleteCurrentUser()
                    .then(resp => {
                        if (resp.status === 200) {
                            setInitialState((s) => ({ ...s, currentUser: undefined, globalData: undefined }));
                            logout();
                        }
                    });
            }
        });
    }

    return (
        <div>
            <Spin spinning={isLoading}>
                <Card className="fadeInRight" bordered={false}>
                    <Form

                        form={form}
                        // onFinish={onFinish}
                        name="form-create-account-information"
                        labelCol={{ flex: '120px' }}
                        labelAlign='left'
                        // wrapperCol={{ flex: 'calc(100% - 120px)' }}
                        // labelCol={{ span: 8 }}
                        // wrapperCol={{ span: 16 }}
                        // colon={false}
                        validateMessages={validateMessages}
                    >
                        <Row gutter={8}>
                            <Col className='config-height' span={8}>
                                <Form.Item
                                    name="fullname"
                                    label="Tên khách hàng"
                                    rules={[{ required: true }, { pattern: regexName, message: 'Tên khách hàng không hợp lệ!' }]}
                                    getValueFromEvent={e => capitalizeName(e.target.value)}
                                >
                                    <Input maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col className='config-height' span={8}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[{ type: 'email' }]}
                                >
                                    <Input maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col className='config-height' span={8}>
                                <Form.Item
                                    name="phoneNumber"
                                    label="Số điện thoại"
                                    rules={[{ required: true }, patternPhone]}
                                >
                                    <Input maxLength={15} />
                                </Form.Item>
                            </Col>
                            <Col className='config-height' span={8}>
                                <Form.Item
                                    name="dateOfBirth"
                                    label="Ngày sinh"
                                >
                                    <DatePicker placeholder="" format="DD/MM/YYYY" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col className='config-height' span={8}>
                                <Form.Item
                                    name="idCard"
                                    label="CMT/CCCD"
                                >
                                    <Input maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col className='config-height' span={8}>
                                <Form.Item
                                    name="taxCode"
                                    label="Mã số thuế"
                                >
                                    <Input maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Address form={form} span={6} xs={24} md={12} lg={8} />
                        </Row>
                        <br />
                        {/* <div className="col-md-12">
                            <div className="form-group">
                                <label >Nếu bạn không tìm thấy địa chỉ gợi ý <a href="#" style={{ color: '#0b5291' }} target="" >Nhấn vào đây</a> để tìm kiếm trên bản đồ</label>
                            </div>
                        </div>
                        <br /> */}
                        <div className="col-md-12">
                            <table id="" className="" style={{ width: "100%", border: '1px solid #dee2e6' }}>
                                {/* table table-striped table-bordered nowrap */}
                                <tbody  >
                                    <tr style={{ textAlign: 'left' }}>
                                        <td style={{ width: "20%", borderRight: '1px solid #dee2e6', paddingLeft: '5px' }}>
                                            <span><a href="#" className="ant-table-thead" target=""> <LinkOutlined /> Zalo</a></span>
                                        </td>
                                        <td style={{ width: "20%", borderRight: '1px solid #dee2e6', paddingLeft: '5px' }}>
                                            <span><a href="#" className="ant-table-thead" target=""><UserOutlined />  User Name</a></span>
                                        </td>
                                        <td style={{ width: "20%", borderRight: '1px solid #dee2e6', paddingLeft: '5px' }}>
                                            <span><a href="#" className="ant-table-thead" target=""><LinkOutlined /> Liên kết Facebook</a></span>
                                        </td>
                                        <td style={{ width: "20%", borderRight: '1px solid #dee2e6', paddingLeft: '5px' }}>
                                            <span><a href="#" className="ant-table-thead" target=""> <DisconnectOutlined /> Bỏ liên kết tài khoản</a></span>
                                        </td>
                                        <td style={{ paddingLeft: '5px' }}>
                                            <span><a href="#" className="ant-table-thead" target=""> <MessageOutlined /> Cài đặt tin nhắn</a></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <br />
                        <br />
                        {/* <Form.Item {...tailLayout}>
                            <Space className="button-group">
                                <Button className='height-btn4 btn-outline-success' icon={<SaveOutlined className="site-form-item-icon" />} loading={isLoading} onClick={onFinish} size="large" >
                                    Lưu thông tin
                                </Button>
                                <Button className='height-btn4 btn-outline-danger' icon={<UndoOutlined className="site-form-item-icon" />} onClick={onReset} size="large" >
                                    Nhập lại
                                </Button>
                            </Space>
                        </Form.Item> */}
                        <Row >
                            <Col flex="auto" style={{ textAlign: 'center' }}>
                                <Space>
                                    <Button className='height-btn4 btn-outline-success' icon={<SaveOutlined className="site-form-item-icon" />} loading={isLoading} onClick={onFinish} size="large" >
                                        Lưu thông tin
                                    </Button>
                                    <Button className='height-btn4 btn-outline-danger' icon={<UndoOutlined className="site-form-item-icon" />} onClick={onReset} size="large" >
                                        Nhập lại
                                    </Button>
                                    <Button className='height-btn4 btn-outline-danger' icon={<CloseOutlined className="site-form-item-icon" />} onClick={onDelete} size="large" >
                                        Xoá tài khoản
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Spin>
            <ConfirmChangeInfo
                visible={visibleFormVerify}
                setVisible={setVisibleFormVerify}
                onFinish={onFinish}
                employee={employee}
                setEmployee={setEmployee}
                requestForm={requestForm}
            />
        </div >
    );

};

export default AccountInformation;