import React, { useEffect, useState } from 'react';
import type { ContractServiceCode, OrderHdrDto } from '@/services/client';
import { Button, Card, Col, Form, List, Modal, notification, Row, Space } from 'antd';
import { validateMessages } from '@/core/contains';
import Sender from '@/pages/order/create/components/sender';
import Receiver from '@/pages/order/create/components/receiver';
import Service from '@/pages/order/create/components/service';
import Content from '@/pages/order/create/components/content';
import Other from '@/pages/order/create/components/other';
import { useModel } from 'umi';
import moment from 'moment';
import { validateFormOrder } from '@/utils/orderHelper';

const EditOrderModal: React.FC<Props> = (props: Props) => {
    const [form] = Form.useForm();
    const [contractServiceCodes, setContractServiceCodes] = useState<ContractServiceCode[]>([]);
    const { onEditOrder, createListOrder, createListOrderDraft } = useModel('importModel')
    const { addSenderFromOrder, serviceListAppend } = useModel('orderModel');
    const { vasList } = useModel('vasList');

    const onFill = () => {
        if (props.record) {
            const orderHdrBinding = addSenderFromOrder(props.record);

            const formValue = {
                ...orderHdrBinding,
                collectionDate: orderHdrBinding.collectionDate ? moment(orderHdrBinding.collectionDate, 'DD/MM/YYYY HH:mm:ss') : undefined
            };

            setContractServiceCodes(orderHdrBinding.contractServiceCodes || [])
            form!.setFieldsValue(formValue);
        } else {
            form!.resetFields();
        }
    };

    useEffect(() => {
        if (props.visible) {
            onFill();
        }
    }, [props.visible]);

    const onEdit = () => {
        form.validateFields()
            .then(formValue => {
                try {
                    const order = validateFormOrder(formValue, serviceListAppend, contractServiceCodes, false, vasList);

                    onEditOrder({ ...props.record, ...order, status: -1 });
                    props.setVisible(false);
                } catch (e: any) {
                    notification.error({ message: e.message })
                    return;
                }
            })
    }

    const onCreateOrder = () => {
        form.validateFields()
            .then(formValue => {
                try {
                    let order = validateFormOrder(formValue, serviceListAppend, contractServiceCodes, false, vasList);
                    order = { ...props.record, ...order, status: -1 }
                    createListOrder([order], (success: boolean) => success && props.setVisible(false))

                    // onEditOrder({ ...props.record, ...order, status: -1 });
                    // props.setVisible(false);
                } catch (e: any) {
                    notification.error({ message: e.message })
                    return;
                }
            })
    }

    const onCreateOrderDraft = () => {
        form.validateFields()
            .then(formValue => {
                try {
                    let order = validateFormOrder(formValue, serviceListAppend, contractServiceCodes, false, vasList);
                    order = { ...props.record, ...order, status: -1 }
                    createListOrderDraft([order], (success: boolean) => success && props.setVisible(false))

                    // onEditOrder({ ...props.record, ...order, status: -1 });

                } catch (e: any) {
                    notification.error({ message: e.message })
                    return;
                }
            })
    }

    return (
        <div>
            <Modal
                title={'Sửa thông tin bưu gửi'}
                visible={props.visible}
                onCancel={() => props.setVisible(false)}
                width={1400}
                footer={
                    <Space>
                        <Button onClick={() => props.setVisible(false)}>Đóng</Button>
                        <Button onClick={onCreateOrder} type="primary">
                            Tạo đơn hàng
                        </Button>
                        <Button onClick={onCreateOrderDraft} type="primary">
                            Lưu nháp
                        </Button>
                        <Button onClick={onEdit} type="primary">
                            Đồng ý
                        </Button>
                    </Space>
                }
                bodyStyle={{ backgroundColor: '#eeeeee' }}
                destroyOnClose
            >
                <Form
                    name="form-create-order"
                    labelCol={{ flex: '120px' }}
                    labelAlign="left"
                    labelWrap
                    colon={false}
                    form={form}
                    validateMessages={validateMessages}
                >
                    <Row gutter={[14, 14]}>
                        {(props.record?.errors?.length || 0) > 0 && <Col span={24} >
                            <Card className="fadeInRight" size='small'>
                                <List
                                    size="small"
                                    // header={<div>Danh sách lỗi</div>}
                                    bordered
                                    dataSource={props.record?.errors}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Card>
                        </Col>}
                        <Col span={12} >
                            <Space direction='vertical' size={14} >
                                <Sender form={form} setContractServiceCodes={setContractServiceCodes} isHasOrderTemplate={false} orderHdrId={"-1"} />
                                <Receiver form={form} setContractServiceCodes={setContractServiceCodes} />
                                <Service form={form} contractServiceCodes={contractServiceCodes} />
                            </Space>
                        </Col>
                        <Col span={12}>
                            <Space direction='vertical' size={14} >
                                <Content form={form} />
                                <Other form={form} />
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </Modal >
        </div >
    );
};

type Props = {
    record?: OrderHdrDto,
    visible: boolean,
    setVisible: (visible: boolean) => void
}
export default EditOrderModal;