import React, { useEffect, useState } from 'react';
import type { McasVaServiceDto, VasPropEntity, VasPropsDto } from '@/services/client';
import { Form, Input, Row, Col, Modal, Space, Button, Checkbox, Select, Table, InputNumber } from 'antd';
import { validateMessages } from '@/core/contains';
import { EditOutlined, ExportOutlined, SaveOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import defineColumns from './columnsVasProp';
import { forEach } from 'lodash';

const vaServiceGroupList = [
    { id: '0', name: 'Dịch vụ cộng thêm' },
    { id: '1', name: 'Yêu cầu bổ sung' }
];

const { Option } = Select;
const DetailVasConfiguration: React.FC<Props> = (props: Props) => {
    const { dataSource, isLoading, getAllVasProp, setDataSource } = useModel('vasPropList');
    const [form] = Form.useForm();
    const [isExtent, setExtend] = useState(true);
    const [checkedIsDisplay, setCheckedIsDisplay] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);
    // const [vasPropsDto, setVasPropsDto] = useState<VasPropEntity[]>([]);
    const [currentValue, setCurrentValue] = useState<string>('');

    // console.log("dataSource", dataSource);

    const onFill = () => {
        // console.log("props.record", props.record);

        if (props.record) {
            getAllVasProp(props.record.vaServiceId);
            form.setFieldsValue({ "vasGroup": props.record.extend ? '1' : '0' });
            setCheckedIsDisplay(props.record.display!);
            props.record.vaServiceId = props.record.vaServiceId.concat(" - " + props.record.vaServiceName);
            form.setFieldsValue(props.record);
        } else {
            form.resetFields();
        }
    };

    useEffect(() => {
        onFill();
    }, [props.record]);

    // useEffect(() => {
    //     getAllVasProp();
    // }, []);

    const onEdit = () => {
        form.validateFields().then(formValue => {
            formValue.display = checkedIsDisplay;
            formValue.vaServiceId = formValue.vaServiceId.split(" - " + props.record?.vaServiceName, 1).toString();
            if (formValue.vasGroup === '1') {
                formValue.extend = true;
            } else {
                formValue.extend = false;
            }
            formValue.propsList = dataSource;
            props.onEdit(formValue);
        });
    }

    const onChangeIsDisplay = (e: { target: { checked: boolean } }) => {
        setCheckedIsDisplay(e.target.checked);
    }

    const onChangeVaServiceGroupList = (event: any) => {
        // if (event === '1') {
        //     setExtend(true);
        // } else {
        //     setExtend(false);
        // }
    }

    const handleEdit = (record: VasPropsDto) => {

    }

    const onChangeInput = (propCode: string, value: string) => {
        const newData = dataSource;
        newData.forEach((element: any) => {
            if (element.propCode === propCode) {
                element.description = value;
            }
        });
        setDataSource(newData);
    }

    const actionVasProp = (value: string, record: VasPropsDto): React.ReactNode => {
        return <Input
            disabled
            name='description'
            size='middle' bordered={false}
            style={{ borderBottom: '1px solid #fdb813', boxShadow: 'none' }}
            defaultValue={value}
            onChange={(e) => onChangeInput(record.propCode!, e.target.value)}
        />
    }

    const onChangeShow = (record: VasPropsDto, checked: boolean) => {
        const newData = dataSource;
        newData.forEach((element: any) => {
            if (element.propCode === record.propCode) {
                element.show = checked;
            }
        });
        setDataSource(newData);
    }

    const actionVasPropShow = (value: boolean, record: VasPropsDto): React.ReactNode => {
        return <Space key={record.propCode}>
            <Checkbox defaultChecked={value} onChange={e => onChangeShow(record, e.target.checked)} disabled />
        </Space>
    }

    const onCancel = () => {
        props.setVisible(false);
        getAllVasProp();
    }

    const columnsVasProp: any[] = defineColumns(actionVasProp, actionVasPropShow);
    return (
        <div>
            <Modal
                title={<div style={{ fontSize: '16px' }}>{'Xem Cấu hình thuộc tính giá trị gia tăng'}</div>}
                visible={props.visible}
                onCancel={() => props.setVisible(false)}
                width={1000}

                footer={
                    <Space>
                        {/* {!props.isView && <Button className='custom-btn1 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" onClick={onEdit} loading={props.isSaving} >
                            Lưu
                        </Button>} */}
                        {/* <Button className='custom-btn1 btn-outline-secondary' icon={<ExportOutlined />} onClick={() => props.setVisible(false)}>Đóng</Button> */}
                        <Button className='custom-btn1 btn-outline-secondary' icon={<ExportOutlined />} onClick={() => onCancel()}>Đóng</Button>
                    </Space>
                }
                destroyOnClose
            >
                <Form
                    name="form-vas-Configuration"
                    labelCol={{ flex: '200px' }}
                    labelAlign='left'
                    labelWrap
                    // onFinish={props.onEdit}
                    form={form}
                    validateMessages={validateMessages}
                >
                    <Row gutter={14}>
                        <Col className='config-height' span={24}>
                            <span className='label'><b>Cấu hình thông tin chung GTGT</b></span>
                        </Col>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="vaServiceId"
                                label="Mã GTGT"
                            >
                                <Input maxLength={10} disabled />
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={24}>
                            <Form.Item label="Nhóm GTGT" name="vasGroup" >
                                <Select
                                    allowClear
                                    // mode="multiple"
                                    onChange={onChangeVaServiceGroupList}
                                    disabled
                                >
                                    {vaServiceGroupList.map(item => (
                                        <Option key={item.id}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="vaServiceNameVnp"
                                label="Tên GTGT hiển thị trên MYVNP"
                            >
                                <Input maxLength={50} disabled />
                            </Form.Item>
                        </Col>
                        <Col className='config-height' span={12}>
                            <Form.Item
                                name="display"
                                label="Ẩn/Hiện trên MYVNP"
                            >
                                <Checkbox checked={checkedIsDisplay} onChange={onChangeIsDisplay} disabled />
                            </Form.Item>
                        </Col>
                        {/* <Col className='config-height' span={12}>
                            <Form.Item
                                name="orderNum"
                                label="Thứ tự hiển thị"
                                labelCol={{ flex: '150px' }}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col> */}
                    </Row>
                    <Row gutter={14}>
                        <Col className='config-height' span={24}>
                            <span className='label'><b>Cấu hình thuộc tính GTGT</b></span>
                        </Col>
                    </Row>
                    <Table
                        loading={isLoading}
                        size='small'
                        dataSource={dataSource}
                        columns={columnsVasProp}
                        bordered
                        pagination={{ showSizeChanger: true }}
                    />
                </Form>
            </Modal>

        </div >
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    record?: McasVaServiceDto,
    onEdit: (record: McasVaServiceDto) => void,
    isSaving: boolean,
    isView: boolean,
}
export default DetailVasConfiguration;