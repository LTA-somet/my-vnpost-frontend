import React, { useEffect } from 'react';
import type { DmAppParamDto } from '@/services/client';
import { Form, Input, Row, Col, DatePicker } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { regexCode } from '@/core/contains';

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};
const EditFormAppParam: React.FC<Props> = (props: Props) => {
    const formRef = React.createRef<FormInstance>();

    const onFill = () => {
        if (props.record) {
            formRef.current!.setFieldsValue(props.record);
        } else {
            formRef.current!.resetFields();
        }
    };

    useEffect(() => {
        onFill();
    }, [props.record]);

    return (
        <div>
            <Form
                name="form-create-appparam"
                {...formItemLayout}
                onFinish={props.onEdit}
                ref={formRef}
            >
                <Row>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="id"
                            label="ID"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }, { pattern: regexCode, message: 'Trường này chứa ký tự không hợp lệ!' }]}
                        >
                            <Input maxLength={10} disabled={!!props.record} />
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="type"
                            label="TYPE"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }, { pattern: regexCode, message: 'Trường này chứa ký tự không hợp lệ!' }]}
                        >
                            <Input maxLength={100} disabled={!!props.record} />
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="name"
                            label="NAME"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                        >
                            <Input maxLength={500} />
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="value"
                            label="VALUE"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                        >
                            <Input maxLength={500} />
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="stt"
                            label="STT"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                        >
                            <Input maxLength={20} />
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="description"
                            label="DESCRIPTION"
                            rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                        >
                            <Input maxLength={100} />
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </div>
    );
};

type Props = {
    record?: DmAppParamDto,
    onEdit: (record: DmAppParamDto) => void
}
export default EditFormAppParam;