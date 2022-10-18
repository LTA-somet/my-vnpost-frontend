import React, { useEffect, useState } from 'react';
import type { AccountFindDto, AccountReplaceDto } from '@/services/client';
import { AccountReplaceApi } from '@/services/client';
import { Form, Input, Row, Col, Modal, Space, Button, Select } from 'antd';
import { validateMessages } from '@/core/contains';
import { SaveOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { dataToSelectBox } from '@/utils';
// import { useCurrentUser } from '@/core/selectors';

const accountReplaceApi = new AccountReplaceApi();
const EditFormAccountReplace: React.FC<Props> = (props: Props) => {
    const [form] = Form.useForm();
    const [accountFind, setAccountFind] = useState<AccountFindDto[]>([]);
    // const currentUser = useCurrentUser();

    useEffect(() => {
        if (!props.visible) {
            form.resetFields();
        }
    }, [props.visible])

    const onSave = () => {
        form.validateFields()
            .then(formValue => {
                props.onCreate(formValue)
            })
    }

    const onBlur = (e: any) => {
        console.log(e.target.value);
        accountReplaceApi.findAccountReplace(e.target.value)
            .then(resp => {
                if (resp.status === 200 && resp.data) {
                    setAccountFind([resp.data]);
                    form.setFieldsValue({ 'accReplaceName': resp.data.fullname, 'accOrgCode': resp.data.orgCode });
                }
                else {
                    form.resetFields()
                }
            })
    }

    return (
        <Modal
            title={<div style={{ fontSize: '16px', color: '#00549a' }}>Thêm mới tài khoản nhập thay thế</div>}
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            width={500}
            footer={
                <Space>
                    <Button className='custom-btn1 btn-outline-danger' icon={<CloseCircleOutlined />} onClick={() => props.setVisible(false)}>Huỷ</Button>
                    {!props.isView && <Button className='custom-btn1 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" onClick={onSave} >
                        Lưu
                    </Button>}
                </Space>
            }
            destroyOnClose
        >
            <Form
                name="form-create-replace-account"
                labelCol={{ flex: '130px' }}
                labelWrap
                form={form}
                validateMessages={validateMessages}
            >

                <Row gutter={14}>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="accReplace"
                            label="TK nhập thay thế"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                        >
                            <Input maxLength={50} onPressEnter={onBlur} />
                        </Form.Item>

                    </Col>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="accReplaceName"
                            label="Tên tài khoản"
                        >
                            <Input maxLength={50} disabled />
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="accOrgCode"
                            label="Đơn vị"
                        >
                            <Select disabled showArrow={false}>
                                {dataToSelectBox(accountFind, 'orgCode', ['orgCode', 'orgName'])}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    onCreate: (record: AccountReplaceDto) => void,
    isView: boolean,
}
export default EditFormAccountReplace;