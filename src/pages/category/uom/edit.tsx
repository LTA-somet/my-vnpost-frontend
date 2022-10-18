import React, { useEffect } from 'react';
import type { McasUomDto } from '@/services/client';
import { Form, Input, Row, Col, DatePicker } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { regexCode } from '@/core/contains';

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};
const EditFormUom: React.FC<Props> = (props: Props) => {
    const [form] = Form.useForm();

    const onFill = () => {
        if (props.record) {
            form!.setFieldsValue(props.record);
        } else {
            form!.resetFields();
        }
    };

    useEffect(() => {
        onFill();
    }, [props.record]);

    return (
        <div>
            <Form
                name="form-create-uom"
                {...formItemLayout}
                onFinish={props.onEdit}
                form={form}
            >
                <Row>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="uomId"
                            label="Mã"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }, { pattern: regexCode, message: 'Trường này chứa ký tự không hợp lệ!' }]}
                        >
                            <Input maxLength={10} disabled={!!props.record} />
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="uomName"
                            label="Tên"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                        >
                            <Input maxLength={20} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

type Props = {
    record?: McasUomDto,
    onEdit: (record: McasUomDto) => void
}
export default EditFormUom;