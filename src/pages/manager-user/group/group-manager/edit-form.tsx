import React, { useEffect, useState } from 'react';
import { McasGroupDto } from '@/services/client';
import { Form, Input, Modal, Space, Button, Col, Checkbox, Select } from 'antd';
import { validateMessages } from '@/core/contains';
import { ExportOutlined, PlusCircleOutlined, UndoOutlined } from '@ant-design/icons';

const EditFormMcasGroup: React.FC<Props> = (props: Props) => {
    const [form] = Form.useForm();
    //const [groupDto, setGroupDto] = useState<McasGroupDto[]>([]);
    const [group, setGroup] = useState<McasGroupDto>();
    const [orgCode, setOrgCode] = useState<boolean>(false);

    useEffect(() => {
        // load lại thông tin nhóm quyền
        if (props.visible && props.record && (!group || group.groupCode !== props.record.groupCode)) {
            setGroup(props.record)
        }

        if (!props.visible) {
            //console.log('ddd->>>>visible', props.visible);
            setGroup(undefined);
            form.resetFields();
        }
        //console.log('1. props.record->', props.record);
    }, [props.visible])

    const onFill = () => {
        //console.log('2. props->', props.record);
        if (props.record && group) {
            form.setFieldsValue(props.record);
            //console.log('isInternalUser', props.record.isInternalUser, ' props.record', props.record);
            form.setFieldsValue({ "orgLevel": props.record.orgLevel === 1 ? '1' : props.record.orgLevel === 2 ? '2' : props.record.orgLevel === 3 ? '3' : '' });
            form.setFieldsValue({ "isInternalUser": props.record.isInternalUser ? 'true' : 'false' });
            setOrgCode(!props.record.isInternalUser);
        } else {
            form.resetFields();
        }
    };

    useEffect(() => {
        onFill();
    }, [group]);

    const onEdit = () => {

        form.validateFields()
            .then(formValue => props.onEdit(formValue)
            );
    }
    const onChangObj = (value: string) => {
        //console.log('onChangObj:', "true".includes(value) ? "1" : "0", ' "true".includes(value): ', "true".includes(value));
        setOrgCode(!"true".includes(value));
    }
    return (
        <Modal
            title={props.record ? (props.isView ? 'Xem thông tin nhóm' : 'Chỉnh sửa nhóm') : 'Thêm mới nhóm'}
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            width={700}
            footer={
                <Space>
                    <Button className='custom-btn1 btn-outline-secondary' icon={<ExportOutlined />} onClick={() => props.setVisible(false)}>Đóng</Button>
                    {props.iaction === 'New' && <>
                        <Button className='custom-btn1 btn-outline-danger' icon={<UndoOutlined />} onClick={() => form.resetFields()}>Nhập lại</Button>
                    </>}
                    {(props.iaction === 'New' || props.iaction === 'Edit') &&
                        <>
                            <Button className='custom-btn1 btn-outline-info' icon={<PlusCircleOutlined />} onClick={onEdit} loading={props.isSaving}>
                                Xác nhận
                            </Button>
                        </>
                    }

                </Space>
            }
            destroyOnClose
        >
            <Form
                name="form-create-group"
                labelCol={{ flex: '120px' }}
                labelWrap
                labelAlign='left'
                form={form}
                validateMessages={validateMessages}
            >
                <Col className='config-height'>
                    {props.isShowRole && <Form.Item
                        name="groupCode"
                        label="Mã nhóm"
                        rules={[{ required: true }]}
                    >
                        <Input disabled={props.isView || props.record != undefined} />
                    </Form.Item>
                    }
                </Col>
                <Col className='config-height'>
                    <Form.Item
                        name="name"
                        label="Tên nhóm"
                        rules={[{ required: true }]}
                    >
                        <Input disabled={props.isView} />
                    </Form.Item>
                </Col>
                <Col className='config-height'>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: false }]}
                    >
                        <Input disabled={props.isView} />
                    </Form.Item>
                </Col>
                <Col className='config-height'>
                    <Form.Item
                        name="isInternalUser"
                        label="Đối tượng"
                        rules={[{ required: true }]}
                    >
                        <Select disabled={props.isView} onChange={onChangObj}>
                            <Option value="true">Nội bộ</Option>
                            <Option value="false">Khách hàng</Option>
                        </Select>
                    </Form.Item>
                </Col>
                {
                    !orgCode &&
                    <>
                        <Col className='config-height'>
                            <Form.Item
                                name="orgLevel"
                                label="Đơn vị"
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Option value="1">Tổng công ty</Option>
                                    <Option value="2">Bưu điện Tỉnh</Option>
                                    <Option value="3">Bưu điện Huyện</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </>
                }
            </Form>
        </Modal>
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    record?: McasGroupDto,
    onEdit: (record: McasGroupDto) => void,
    isSaving: boolean,
    isView: boolean,
    iaction: string,
    isShowRole?: boolean
}
EditFormMcasGroup.defaultProps = {
    isShowRole: true
}
export default EditFormMcasGroup;