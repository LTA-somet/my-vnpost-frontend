import React, { useEffect, useState } from 'react';
import { AccountApi, AccountDto, McasGroupDto } from '@/services/client';
import { Form, Input, Row, Col, Modal, Space, Button, Select } from 'antd';
import { ExportOutlined, UndoOutlined, UserOutlined } from '@ant-design/icons';
import { patternPhone, pattenPassword, validateMessages } from '@/core/contains';
import Address from '@/components/Address';
import { capitalizeName, dataToSelectBox } from '@/utils';

const accountApi = new AccountApi();
const EditFormEmployee: React.FC<Props> = (props: Props) => {
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
        if (!props.isNew && props.visible && props.record && (!account || account.username !== props.record.username)) {
            if (props.isShowRole) {
                accountApi.findAccountByUsername(props.record!.username!)
                    .then(resp => resp.status === 200 && setAccount(resp.data));
            } else {
                setAccount(props.record)
            }
        }

        if (props.record === undefined) {

        }

        if (!props.visible) {
            setAccount(undefined);
            form.resetFields();
        }
    }, [props.visible])

    const onFill = () => {
        if (props.record) {
            const rolesActive = account?.roles?.filter(r => groupDto.some(g => g.groupCode === r));
            form.setFieldsValue({ ...account, roles: rolesActive });
        } else {
            form.resetFields();
        }
    };

    useEffect(() => {
        if (props.isNew) {
            form.setFieldsValue({ ...props.record });
        }
    }, [props.visible]);

    useEffect(() => {
        onFill();
    }, [account, groupDto]);

    const onEdit = () => {
        form.validateFields()
            .then(formValue => props.onEdit(formValue));
    }

    return (
        <Modal
            title={!props.isNew ? (props.isView ? 'Xem thông tin thành viên' : 'Chỉnh sửa thành viên') : 'Thêm mới thành viên'}
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            width={700}
            footer={
                <Space>
                    <Button className='custom-btn1 btn-outline-secondary' icon={<ExportOutlined />} onClick={() => props.setVisible(false)}>Đóng</Button>
                    {!props.isView && <><Button className='custom-btn1 btn-outline-danger' icon={<UndoOutlined />} onClick={() => form.resetFields()}>Nhập lại</Button>
                        <Button icon={<UserOutlined />} onClick={onEdit} className='btn-outline-success' loading={props.isSaving}>
                            {!props.isNew ? 'Sửa thành viên' : 'Thêm thành viên'}
                        </Button></>}
                </Space>
            }
            destroyOnClose
        >
            <Form
                name="form-create-employee"
                labelCol={{ flex: '130px' }}
                labelAlign='left'
                labelWrap
                form={form}
                validateMessages={validateMessages}
            // autoComplete="off"
            >
                {props.isShowRole && <Row gutter={6}>
                    <Col span={24}>
                        <Form.Item
                            name="roles"
                            label="Nhóm quyền"
                            rules={[{ required: true }]}
                        >
                            <Select mode="multiple" disabled={props.isView}>
                                {dataToSelectBox(groupDto, 'groupCode', 'name')}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                }
                <Row gutter={6}>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="fullname"
                            label="Họ và tên"
                            rules={[{ required: true }]}
                            getValueFromEvent={e => capitalizeName(e.target.value)}
                        >
                            <Input disabled={props.isView} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col className='config-height' span={12} md={12} xs={24}>
                        <Form.Item
                            name="phoneNumber"
                            label="Số điện thoại"
                            rules={[{ required: true }, patternPhone]}
                        >
                            <Input disabled={props.isView} />
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={12} md={12} xs={24}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ type: 'email' }]}
                        >
                            <Input disabled={props.isView} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Address form={form} md={24} lg={24} disabled={props.isView} />
                </Row>
                {!props.isView && props.isNew && <>
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true }, pattenPassword]}
                        hasFeedback
                    >
                        <Input.Password autoComplete="new-password" />
                    </Form.Item>
                </>}
            </Form>
        </Modal>
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    record?: AccountDto,
    onEdit: (record: AccountDto) => void,
    isSaving: boolean,
    isView: boolean,
    isShowRole?: boolean,
    isNew: boolean
}
EditFormEmployee.defaultProps = {
    isShowRole: true
}
export default EditFormEmployee;