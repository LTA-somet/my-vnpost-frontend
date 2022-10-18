import React, { useEffect } from 'react';
import type { AccountReplaceDto } from '@/services/client';
import { AccountReplaceApi } from '@/services/client';
import { Form, Input, Row, Col, Modal, Space, Button, Select, Card, Table } from 'antd';
import { validateMessages } from '@/core/contains';
import { SaveOutlined, CloseCircleOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import defineColumns from './column-kh';

const accountReplaceApi = new AccountReplaceApi();
const EditFormAccountReplace: React.FC<Props> = (props: Props) => {
    const [form] = Form.useForm();

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
                    form.setFieldsValue({ 'accReplaceName': resp.data.fullname, 'orgCode': resp.data.orgCode })
                }
                else {
                    form.resetFields()
                }
            })
    }
    const actionKhhd = (id: number): React.ReactNode => {
        return <Space key={id}>
            <Button className="btn-outline-danger" onClick={() => console.log(id)
            } size="small"><DeleteOutlined /></Button>
        </Space>
    }

    const columnKhhd: any[] = defineColumns(actionKhhd);

    return (
        <Modal
            title={<div style={{ fontSize: '16px', color: '#00549a' }}>Khai báo định tuyến dịch vụ đồng giá</div>}
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            width={700}
            footer={
                <Space>
                    {/* <Button className='custom-btn1 btn-outline-danger' icon={<CloseCircleOutlined />} onClick={() => props.setVisible(false)}>Huỷ</Button> */}
                    {!props.isView && <Button className='custom-btn1 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" onClick={onSave} >
                        Lưu
                    </Button>}
                </Space>
            }
            destroyOnClose
        >
            <Form
                name="form-create-route-service-parity"
                labelCol={{ flex: '200px' }}
                labelAlign="left"
                labelWrap
                form={form}
                validateMessages={validateMessages}
            >

                <Row gutter={[14, 14]}>
                    <Col span={24}>
                        <Card size='small'>
                            <Row gutter={14}>
                                <Col className='config-height' span={24}>
                                    <Form.Item
                                        name="bdtCode"
                                        label="Đơn vị khai báo"
                                    // rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                                    >
                                        <Select />
                                    </Form.Item>

                                </Col>
                                <Col className='config-height' span={24}>
                                    <Form.Item
                                        name="routeName"
                                        label="Tên định tuyến"
                                    >
                                        <Input maxLength={50} disabled />
                                    </Form.Item>
                                </Col>
                                <Col className='config-height' span={24}>
                                    <Form.Item
                                        name="parityType"
                                        label="Loại đồng giá"
                                    >
                                        <Select />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card size='small' title={'Danh sách KH/HĐ'}
                            extra={
                                <Row gutter={8}>
                                    <Col>
                                        <Button icon={< DeleteOutlined />} className='custom-btn1 btn-outline-danger'>Xoá KH/HĐ</Button>
                                    </Col>
                                    <Col>
                                        <Button icon={<SearchOutlined />} className='btn-outline-info'>Tìm KH/HĐ</Button>
                                    </Col>
                                </Row>
                            }
                        >
                            <Table columns={columnKhhd} size='small' />
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card size='small' title='Thông tin định tuyến'>
                            <Table />
                        </Card>
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
