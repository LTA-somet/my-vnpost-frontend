import React, { useEffect, useState } from 'react';
import { AccountApi, AccountDto, McasGroupDto } from '@/services/client';
import { Form, Input, Row, Col, Modal, Space, Button, Select } from 'antd';
import { pattenPassword, patternPhone, validateMessages } from '@/core/contains';
import { CheckCircleOutlined, CloseCircleOutlined, LockOutlined } from '@ant-design/icons';

const accountApi = new AccountApi();
const ChangePassEmployee: React.FC<Props> = (props: Props) => {
    const [form] = Form.useForm();
    const [groupDto, setGroupDto] = useState<McasGroupDto[]>([]);
    const [account, setAccount] = useState<AccountDto>();

    useEffect(() => {
        // load nhóm quyền
        if (!props.isShowRole && props.visible && groupDto.length === 0) {
            accountApi.findGroupPermission()
                .then(resp => resp.status === 200 && setGroupDto(resp.data));
        }

        // load lại thông tin account nếu cần hiển thị nhóm quyền
        if (props.visible && props.record && (!account || account.username !== props.record.username)) {
            if (props.isShowRole) {
                accountApi.findAccountByUsername(props.record!.username!)
                    .then(resp => resp.status === 200 && setAccount(resp.data));
            } else {
                setAccount(props.record)
            }
        }
    }, [props.visible])

    const onFill = () => {
        if (props.record) {
            form.setFieldsValue(account);
        } else {
            form.resetFields();
        }
    };

    useEffect(() => {
        onFill();
    }, [account]);

    const onFinish = (values: any) => {
        props.onChangePass(props.record!.username!, values.password);
    }

    return (
        <Modal
            title={'Đổi mật khẩu thành viên'}
            onCancel={() => props.setVisible(false)}
            width={700}
            visible={props.visible}
            footer={
                <Space>
                    <Button className='custom-btn1 btn-outline-danger' icon={<CloseCircleOutlined />} onClick={() => props.setVisible(false)}>Bỏ qua</Button>
                    <Button className='custom-btn1 btn-outline-success' icon={<CheckCircleOutlined />} htmlType="submit" form="form-create-employee" loading={props.isSaving}>
                        Thực hiện
                    </Button>
                </Space>
            }
            destroyOnClose
        >
            <Form
                name="form-create-employee"
                labelCol={{ flex: '120px' }}
                labelWrap
                labelAlign='left'
                onFinish={onFinish}
                form={form}
                validateMessages={validateMessages}
            >
                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true }, pattenPassword]}
                    hasFeedback
                >
                    <Input.Password size="large" prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Mật khẩu mới' />
                </Form.Item>
                {/* <Form.Item
                    name="confirm"
                    label="Xác nhận mật khẩu"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                        },
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
                    <Input.Password />
                </Form.Item> */}
            </Form>
        </Modal>
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    record?: AccountDto,
    onChangePass: (username: string, password: string) => void,
    isSaving: boolean,
}
export default ChangePassEmployee;