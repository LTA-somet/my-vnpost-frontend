import React, { useEffect, useState } from 'react';
import type { McasServiceDto, MyvnpServiceGroupEntity } from '@/services/client';
import { Form, Input, Row, Col, Modal, Space, Button, Checkbox, Select, InputNumber } from 'antd';
import { validateMessages } from '@/core/contains';
import { ExportOutlined, SaveOutlined } from '@ant-design/icons';
import { useMyvnpServiceGroupList } from '@/core/selectors';

const { Option } = Select;
const EditServiceConfiguration: React.FC<Props> = (props: Props) => {
    const [form] = Form.useForm();
    const [checkedIsRetailCustomer, setCheckedIsRetailCustomer] = useState(true);
    const [checkedIsDisplay, setCheckedIsDisplay] = useState(true);
    const [serviceGroupFilter, setServiceGroupFilter] = useState<MyvnpServiceGroupEntity[]>([]);
    const serviceGroupList = useMyvnpServiceGroupList();

    const onFill = () => {
        if (props.record) {
            setCheckedIsRetailCustomer(props.record.isRetailCustomer!);
            setCheckedIsDisplay(props.record.isDisplay!);
            props.record.mailServiceId = props.record.mailServiceId.concat(" - " + props.record.mailServiceName);
            form.setFieldsValue(props.record);
        } else {
            form.resetFields();
        }
        setServiceGroupFilter(serviceGroupList.filter(e => e.scope == "1"));
    };

    useEffect(() => {
        onFill();
    }, [props.record]);

    const onEdit = () => {
        form.validateFields().then(formValue => {
            formValue.isDisplay = checkedIsDisplay;
            formValue.isRetailCustomer = checkedIsRetailCustomer;
            formValue.mailServiceId = formValue.mailServiceId.split(" - " + props.record?.mailServiceName, 1).toString();
            props.onEdit(formValue);
        });
    }

    const onChangeIsRetailCustomer = (e: { target: { checked: boolean } }) => {
        setCheckedIsRetailCustomer(e.target.checked);
    }

    const onChangeIsDisplay = (e: { target: { checked: boolean } }) => {
        setCheckedIsDisplay(e.target.checked);
    }

    const onCancel = () => {
        props.setVisible(false);
        onFill();
    }

    return (
        <div>
            <Modal
                title={<div style={{ fontSize: '16px' }}>{'C???u h??nh S???n ph???m d???ch v???'}</div>}
                visible={props.visible}
                onCancel={() => props.setVisible(false)}
                width={1000}

                footer={
                    <Space>
                        {!props.isView && <Button className='custom-btn1 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" onClick={onEdit} loading={props.isSaving} >
                            L??u
                        </Button>}
                        <Button className='custom-btn1 btn-outline-secondary' icon={<ExportOutlined />} onClick={() => onCancel()}>????ng</Button>
                        {/* onClick={() => props.setVisible(false)} */}
                    </Space>
                }
                destroyOnClose
            >
                <Form
                    name="form-Service-Configuration"
                    labelCol={{ flex: '200px' }}
                    labelAlign='left'
                    labelWrap
                    // onFinish={props.onEdit}
                    form={form}
                    validateMessages={validateMessages}
                >
                    <Row gutter={14}>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="mailServiceId"
                                label="M?? SPDV"
                            >
                                <Input maxLength={10} disabled />
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="myvnpServiceGroupId"
                                label="Nh??m d???ch v??? MYVNP"
                            >
                                <Select
                                    allowClear
                                // onChange={onChangeServiceGroup}
                                >
                                    {serviceGroupFilter.map(item => (
                                        <Option key={item.serviceGroupId}>{item.serviceGroupName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="myvnpMailServiceName"
                                label="T??n SPDV hi???n th??? tr??n MYVNP"
                            >
                                <Input maxLength={10} />
                            </Form.Item>
                        </Col>
                        {/* <Col className='config-height' span={24}>
                            <Form.Item
                                name="priceGroup"
                                label="Nh??m ?????ng gi??"
                            >
                                <Input maxLength={20} disabled />
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="typePriceGroup"
                                label="Lo???i ?????ng gi??"
                            >
                                <Input maxLength={20} disabled />
                            </Form.Item>
                        </Col> */}
                        <Col className='config-height' span={9}>
                            <Form.Item
                                name="isDisplay"
                                label="???n/Hi???n tr??n MYVNP"
                            >
                                <Checkbox checked={checkedIsDisplay} onChange={onChangeIsDisplay} />
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={9}>
                            <Form.Item
                                name="isRetailCustomer"
                                label="Hi???n th??? cho kh??ch l???"
                            >
                                <Checkbox checked={checkedIsRetailCustomer} onChange={onChangeIsRetailCustomer} />
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={6}>
                            <Form.Item
                                name="orderNum"
                                label="Th??? t??? hi???n th???"
                                labelCol={{ flex: '150px' }}
                            >
                                <InputNumber />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

        </div >
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    record?: McasServiceDto,
    onEdit: (record: McasServiceDto) => void,
    isSaving: boolean,
    isView: boolean,
}
export default EditServiceConfiguration;