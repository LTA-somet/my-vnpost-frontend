
import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Modal, Space, Button, Select, Table, Card, Spin, notification } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { patternPhone, validateMessages } from '@/core/contains';
import { AccountApi, McasOrganizationStandardDto } from '@/services/client';
import './style.css';
import { dataToSelectBox } from '@/utils';
import { SaveOutlined, SearchOutlined } from '@ant-design/icons';


const accountApi = new AccountApi();
const AssignAccount: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>();
    const [usernamePar, setUsernamePar] = useState<string>();

    const [tkChild, setTkChild] = useState<string>();
    const [tkParent, setTkParent] = useState<string>();

    const [tenthanhvien, setTenthanhvien] = useState<string>();
    const [tenthanhvienCha, setTenthanhvienCha] = useState<string>();
    const [mathanhvienCha, setMathanhvienCha] = useState<string>();

    const [orgListdto, setOrgListdto] = useState<McasOrganizationStandardDto>([])
    const [orgListId, setOrgListId] = useState<any[]>([]);
    const [form] = Form.useForm();

    const onChangeOrg = (value: any) => {
        //console.log('onChangeOrg', value);
        setOrgListId(value);
    }
    const onSave = () => {
        if (username !== undefined && orgListId.length > 0 && usernamePar !== undefined) {
            accountApi.createOrgsUser(username, usernamePar, orgListId)
                .then(resp => {
                    if (resp.status === 200) {
                        if (!resp.data) {
                            notification.error({ message: 'Khách hàng không tồn tại trên hệ thống' })
                        }

                    }
                }).finally(() => setLoading(false))
        }
    }

    const onSearchCustom = () => {
        //console.log('mathanhvienCha: ', mathanhvienCha);
        if (usernamePar !== undefined && username !== undefined && usernamePar !== "" && username !== "") {
            accountApi.searchOrgList(usernamePar, username)
                .then(resp => {
                    if (resp.status === 200) {
                        //console.log('respont tim khach hang: ', resp.data);
                        const orgOfUser = resp.data.map((orgObj) => {
                            return {
                                ...orgObj,
                                unitName: orgObj.unitCode + ' - ' + orgObj.unitName,
                            };
                        });
                        setOrgListdto(orgOfUser);

                    }
                }).finally(() => setLoading(false))
        }
        else {
            setOrgListdto(undefined);
        }
    }

    const onSearchPhone = (value: string, iCha: number) => {
        if (!value) {
            return;
        }
        if (iCha === 1) {
            setTkParent(value);
        }
        else {
            setTkChild(value);
        }

        setLoading(true);
        accountApi.searchContactByPhoneAssign(value)
            .then(resp => {
                if (resp.status === 200) {
                    //console.log('resp', resp.data);
                    if (!resp.data) {
                        notification.error({ message: 'Tài khoản không tồn tại trên hệ thống' })
                        if (iCha === 1) {
                            const values = {
                                //tkThanhVien: 1231231,
                                tenTkCha: ""
                            }
                            form.setFieldsValue(values);
                            setMathanhvienCha("");
                            setUsernamePar("");
                        }
                        else {
                            const values = {
                                tenTkThanhVien: ""
                            }
                            setUsername("");
                            form.setFieldsValue(values);
                        }
                        setOrgListdto(undefined);
                    }
                    else {
                        if (iCha === 1) {
                            //console.log('resp.description->', resp.data.description);
                            setUsernamePar(resp.data.username);
                            setTenthanhvienCha(resp.data.description);
                            setMathanhvienCha(resp.data.employeeCode);
                            const values = {
                                //tkThanhVien: 1231231,
                                tenTkCha: resp.data.description
                            }
                            form.setFieldsValue(values);
                        }
                        else {
                            setUsername(resp.data.username);
                            setTenthanhvien(resp.data.description);
                            const values = {
                                tenTkThanhVien: resp.data.description
                            }
                            form.setFieldsValue(values);
                        }
                        ///onSearchCustom();
                    }

                }
            }).finally(() => setLoading(false))
    }
    const onBlurPhone = (value: string, iCha: number) => {

        if (iCha === 1) {
            //console.log('1. Cha->onBlurPhone: ', value);
            if (value === undefined || value === '') {
                //console.log('2. Cha->onBlurPhone: ', value);
                const values = {
                    //tkThanhVien: 1231231,
                    tenTkCha: ""
                }
                form.setFieldsValue(values);
                setMathanhvienCha("");
                setUsernamePar("");
            }
            else if (tkParent !== value) {
                //console.log('3. Cha->onBlurPhone: ', value);
                onSearchPhone(value, iCha);
            }
            setTkParent(value);
        }
        else {
            //console.log('1. Con->onBlurPhone: ', value);
            if (value === undefined || value === '') {
                //console.log('2. Con->onBlurPhone: ', value);
                const values = {
                    tenTkThanhVien: ""
                }
                setUsername("");
                form.setFieldsValue(values);
            }
            else if (tkChild !== value) {
                //console.log('3. Con->onBlurPhone: ', value);
                onSearchPhone(value, iCha);
            }
            setTkChild(value);
        }
    }

    useEffect(() => {
        onSearchCustom();
    }, [username, usernamePar, mathanhvienCha]);

    return (
        <PageContainer>
            <Spin spinning={loading}>
                {/* <Card title="Tìm kiếm các tài khoản thành viên" className="fadeInRight"> */}
                <Form
                    name="form-assign-account"
                    labelCol={{ flex: '170px' }}
                    labelWrap
                    form={form}
                    validateMessages={validateMessages}
                >
                    <Row>
                        <Col className='config-height' span={11}>
                            <Form.Item
                                name="tkThanhVien"
                                label="Tài khoản thành viên (*)"
                            // rules={[{ required: true }, patternPhone]}
                            >
                                <Input.Search
                                    placeholder="Số điện thoại (+84)"
                                    allowClear
                                    onSearch={(value) => onSearchPhone(value, 0)} onBlur={(e) => onBlurPhone(e.target.value, 0)} />
                            </Form.Item>
                        </Col>
                        <Col span={1} />
                        <Col className='config-height' span={12}>
                            <Form.Item
                                name="tenTkThanhVien"
                                label="Tên tài khoản thành viên"
                            >
                                <Input disabled value={tenthanhvien} placeholder="" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='config-height' span={11}>
                            <Form.Item
                                name="tkCha"
                                label="Tài khoản cha (*)"
                            >
                                <Input.Search
                                    placeholder="Số điện thoại (+84)"
                                    allowClear
                                    onSearch={(value) => onSearchPhone(value, 1)} onBlur={(e) => onBlurPhone(e.target.value, 1)} />
                            </Form.Item>
                        </Col>
                        <Col span={1} />
                        <Col className='config-height' span={12}>
                            <Form.Item
                                name="tenTkCha"
                                label="Tên tài khoản cha"
                            >
                                <Input disabled value={tenthanhvienCha} placeholder="" />
                            </Form.Item>
                        </Col>
                        {/* <Col style={{ height: '58px' }} span={24}>
                                <Button icon={<SearchOutlined />} className='btn-outline-info' size="large" style={{ float: "right" }} onClick={onSearchCustom} disabled={usernamePar === undefined}> Tìm mã khách hàng </Button>
                            </Col> */}
                        <Col span={24}>
                            <Form.Item
                                name="dvTkCha"

                            >
                                <Select placeholder="Đơn vị của tài khoản cha" mode="tags" allowClear
                                    style={{ width: '100%' }} onChange={onChangeOrg}>
                                    {dataToSelectBox(orgListdto, 'unitCode', 'unitName')}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
                <Col style={{ textAlign: 'center', float: 'right' }}>

                    <Form.Item   >
                        <Button className='custom-btn4 btn-outline-success' size="large" icon={<SaveOutlined />} onClick={onSave} disabled={!(username !== undefined && usernamePar !== undefined && orgListId.length > 0)}> Lưu thông tin </Button>
                    </Form.Item>

                </Col>
                {/* </Card> */}
            </Spin>
        </PageContainer >
    );
};
export default AssignAccount;