import React, { useCallback, useEffect, useState } from 'react';
import { BankCategoryApi, BankCategoryDto, DmMauInApi, DmMauinDto, UserBankAccountDto } from '@/services/client';
import { Form, Input, Row, Col, DatePicker, Modal, Space, Button, InputNumber, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { regexCode, validateMessages } from '@/core/contains';
import { CloseCircleOutlined, ExportOutlined, SaveOutlined } from '@ant-design/icons';

const { Option } = Select;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};

const bankCategoryApi = new BankCategoryApi();

const EditFormDeclare: React.FC<Props> = (props: Props) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listBankCategory, setListBankCategory] = useState<BankCategoryDto[]>([]);

    const onFill = () => {
        if (props.record) {
            form.setFieldsValue(props.record);
        } else {
            form.resetFields();
        }
    };

    const loadGetAllData = useCallback((callback?: (success: boolean) => void) => {
        setIsLoading(true);
        bankCategoryApi
            .getAllBankCategory()
            .then((resp) => {
                if (resp.status === 200) {
                    setListBankCategory(resp.data);
                }
                if (callback) {
                    callback(resp.status === 200);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        onFill();
        loadGetAllData();
    }, [props.record, props.visible]);

    const onSave = () => {
        form.validateFields().then(formValue => props.onEdit(formValue));
    }

    return (
        <div>
            <Modal
                title={<div style={{ fontSize: '16px' }}>{props.record ? 'Chỉnh sửa tài khoản kết nối ngân hàng' : 'Khai báo tài khoản kết nối ngân hàng'}</div>}
                visible={props.visible}
                onCancel={() => props.setVisible(false)}
                width={1000}
                footer={
                    <Space>
                        <Button className='custom-btn1 btn-outline-secondary' icon={<ExportOutlined />} onClick={() => props.setVisible(false)}>Đóng</Button>
                        {!props.isView && <Button className='custom-btn1 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" onClick={onSave} loading={props.isSaving} >
                            Lưu
                        </Button>}
                    </Space>
                }
                destroyOnClose
            >
                <Form
                    name="form-declare-connect-bank"
                    {...formItemLayout}
                    // onFinish={props.onEdit}
                    labelAlign='left'
                    form={form}
                    validateMessages={validateMessages}
                >
                    <Row>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="bankName"
                                label="Tên ngân hàng"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn ngân hàng"
                                >
                                    {listBankCategory.map(item => (
                                        <Option key={item.bankName}>{item.bankCode} - {item.bankName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="accountName"
                                label="Chủ tài khoản NH"
                                rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                            >
                                <Input maxLength={100} placeholder="Nhập tên chủ tài khoản" />
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="branchName"
                                label="Chi nhánh NH"
                            >
                                <Input maxLength={200} placeholder="Nhập tên chi nhánh" />
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="accountNumber"
                                label="Số tài khoản NH"
                                rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                            >
                                <Input maxLength={20} placeholder="Nhập số tài khoản" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

        </div>
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    record?: UserBankAccountDto,
    onEdit: (record: UserBankAccountDto) => void,
    isSaving: boolean,
    isView: boolean
}
export default EditFormDeclare;