import React, { useEffect } from 'react';
import type { MenuDto } from '@/services/client';
import { Form, Input, Row, Col, DatePicker, TreeSelect, Select, InputNumber, Checkbox } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { regexCode } from '@/core/contains';

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

const methodOption = [
    { value: "[GET]", name: "GET" },
    { value: "[POST]", name: "POST" },
    { value: "[PUT]", name: "PUT" },
    { value: "[DELETE]", name: "DELETE" }
];
const EditFormMenu: React.FC<Props> = (props: Props) => {
    const formRef = React.createRef<FormInstance>();

    const onFill = () => {
        if (props.record) {
            const formValue: any = { ...props.record };
            methodOption.forEach(o => {
                if (formValue.url?.startsWith(o.value)) {
                    formValue.method = o.value;
                    formValue.url = formValue.url.replace(o.value, "");
                }
            })
            formRef.current!.setFieldsValue(formValue);
        } else {
            formRef.current!.resetFields();
        }
    };

    useEffect(() => {
        onFill();
    }, [props.record]);

    const prefixSelector = (
        <Form.Item name="method" noStyle>
            <Select style={{ width: 100 }} allowClear>
                {methodOption.map(o => <Select.Option value={o.value} key={o.value}>{o.name}</Select.Option>)}
            </Select>
        </Form.Item>
    );

    return (
        <div>
            <Form
                name="form-create-menu"
                {...formItemLayout}
                onFinish={props.onEdit}
                ref={formRef}
            >
                <Row>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="menuCode"
                            label="Mã menu"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }, { pattern: regexCode, message: 'Trường này chứa ký tự không hợp lệ!' }]}
                        >
                            <Input maxLength={100} disabled={!!props.record} />
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="name"
                            label="Tên"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                        >
                            <Input maxLength={300} />
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="url"
                            label="URL ([POST]order/create)"
                        >
                            <Input addonBefore={prefixSelector} maxLength={500} />
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="parentCode"
                            label="Parent code"
                        >
                            {/* <Input maxLength={20} /> */}
                            <TreeSelect
                                treeData={props.menuTree}
                            />
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="type"
                            label="Loại"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                            initialValue={2}
                        >
                            <Select>
                                <Select.Option key={1} value={1}>Menu</Select.Option>
                                <Select.Option key={2} value={2}>Url</Select.Option>
                                <Select.Option key={3} value={3}>Public</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="orderNo"
                            label="STT"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                        >
                            <InputNumber />
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="forAccountReplace"
                            label="Nhập thay thế"
                            valuePropName='checked'
                        >
                            <Checkbox />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

type Props = {
    record?: MenuDto,
    onEdit: (record: MenuDto) => void,
    menuTree: any[]
}
export default EditFormMenu;