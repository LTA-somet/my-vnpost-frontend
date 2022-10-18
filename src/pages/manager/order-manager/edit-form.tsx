import React, { useEffect, useState } from 'react';
import { AccountApi, AccountDto, McasGroupDto, OrderHdrDto } from '@/services/client';
import { Form, Input, Row, Col, Modal, Space, Button, Select } from 'antd';
import { pattenPassword, patternPhone, validateMessages } from '@/core/contains';
import Address from '@/components/Address';
import { dataToSelectBox } from '@/utils';

const accountApi = new AccountApi();
const EditForm: React.FC<Props> = (props: Props) => {
    const [form] = Form.useForm();
    const [groupDto, setGroupDto] = useState<McasGroupDto[]>([]);
    const [account, setAccount] = useState<AccountDto>();

    useEffect(() => {
        // load nhóm quyền
        if (props.isShowRole && props.visible && groupDto.length === 0) {
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

    return (
        <Modal
            title={props.record ? 'Chỉnh sửa thành viên' : 'Thêm mới thành viên'}
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            width={700}
            footer={
                <Space>
                    <Button onClick={() => props.setVisible(false)}>Huỷ</Button>
                    {!props.isView && <Button htmlType="submit" form="form-create-employee" type="primary" loading={props.isSaving}>
                        Lưu
                    </Button>}
                </Space>
            }
            destroyOnClose
        >
            <Form
                name="form-create-employee"
                labelCol={{ flex: '130px' }}
                labelWrap
                onFinish={props.onEdit}
                form={form}
                validateMessages={validateMessages}
            >
                {props.isShowRole && <Form.Item
                    name="roles"
                    label="Nhóm quyền"
                    rules={[{ required: true }]}
                >
                    <Select mode="multiple" disabled={props.isView}>
                        {dataToSelectBox(groupDto, 'groupCode', 'name')}
                    </Select>
                </Form.Item>
                }
                <Form.Item
                    name="fullname"
                    label="Họ và tên"
                    rules={[{ required: true }]}
                >
                    <Input disabled={props.isView} />
                </Form.Item>
                <Row gutter={6}>
                    <Col span={12} md={12} xs={24}>
                        <Form.Item
                            name="phoneNumber"
                            label="Số điện thoại"
                            rules={[{ required: true }, patternPhone]}
                        >
                            <Input disabled={props.isView} />
                        </Form.Item>
                    </Col>
                    <Col span={12} md={12} xs={24}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ type: 'email' }]}
                        >
                            <Input disabled={props.isView} />
                        </Form.Item>
                    </Col>
                </Row>
                <Address form={form} md={24} lg={24} disabled={props.isView} />
                {!props.isView && <>
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true }, pattenPassword]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Xác nhận mật khẩu"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                            },
                            pattenPassword,
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
                    </Form.Item>
                </>}
            </Form>
        </Modal>
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    record?: OrderHdrDto,
    onEdit: (record: OrderHdrDto) => void,
    isSaving: boolean,
    isView: boolean,
    isShowRole?: boolean
}
EditForm.defaultProps = {
    isShowRole: true
}
export default EditForm;