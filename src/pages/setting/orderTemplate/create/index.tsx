import { validateMessages } from '@/core/contains';;
import { Button, Col, Form, Row, Space, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { OrderTemplateApi, OrderTemplateDto } from '@/services/client';
import Content from '@/pages/order/create/components/content';
import Other from '@/pages/order/create/components/other';
import Receiver from '@/pages/order/create/components/receiver';
import Service from '@/pages/order/create/components/service';
import Sender from '@/pages/order/create/components/sender';
import TemplateInfo from './components/template-info';
import { PageContainer } from '@ant-design/pro-layout';
import { useHistory, useParams, useModel } from 'umi';
import moment from 'moment';
import History from '@/components/History';
import { ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { validateFormOrder } from '@/utils/orderHelper';


const orderTemplateApi = new OrderTemplateApi();
const OrderTemplate = () => {
    // const { dataSource, reload, loading, deleteRecord, createRecord, updateRecord } = useModel('useUomList');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [contractServiceCodes, setContractServiceCodes] = useState<any[]>([]);
    const { addSenderFromOrder, serviceListAppend, setFormInit, cleanup } = useModel('orderModel');
    const { vasList } = useModel('vasList');

    const history = useHistory();

    const params: any = useParams();
    const id = params.id;

    const onFill = (orderTemplate: OrderTemplateDto) => {
        const orderHdrBinding = addSenderFromOrder(orderTemplate.data!);
        const formValue = {
            ...orderHdrBinding,
            ...orderTemplate,
            collectionDate: orderHdrBinding?.collectionDate ? moment(orderHdrBinding.collectionDate, 'DD/MM/YYYY HH:mm:ss') : undefined
        }
        form.setFieldsValue(formValue)
    }

    useEffect(() => {
        setFormInit(form);
        if (id) {
            orderTemplateApi.findOrderTemplateById(id)
                .then(resp => {
                    if (resp.status === 200) {
                        onFill(resp.data);
                    }
                })
        }
        return () => {
            cleanup();
        }
    }, [])

    const onFinish = () => {
        setIsLoading(true)
        form.validateFields()
            .then(formValue => {
                const orderDto = validateFormOrder(formValue, serviceListAppend, contractServiceCodes, true, vasList);
                orderDto.updatedDate = undefined;
                orderDto.createdDate = undefined;
                const orderTemplateDto: any = {
                    orderNote: formValue.orderNote,
                    orderContent: formValue.orderContent,
                    default: formValue.default,
                    data: orderDto
                }
                if (id) {
                    orderTemplateApi.updateOrderTemplate(id, orderTemplateDto)
                        .then(resp => {
                            if (resp.status === 201) {
                                // form.resetFields();
                                history.push('/setting/order-template')
                            }
                        })
                } else {
                    orderTemplateApi.createOrderTemplate(orderTemplateDto)
                        .then(resp => {
                            if (resp.status === 201) {
                                // form.resetFields();
                                history.push('/setting/order-template')
                            }
                        });
                }
            }).finally(() => setIsLoading(false));
    }

    return (
        <PageContainer>
            <Spin spinning={isLoading}>
                <Form
                    name="form-create-order"
                    labelCol={{ flex: '120px' }}
                    labelAlign="left"
                    labelWrap
                    // wrapperCol={{ flex: 1 }}
                    colon={false}
                    form={form}
                    validateMessages={validateMessages}
                >
                    {/* <Button onClick={onFill}> onFill </Button> */}
                    <Row gutter={[14, 14]} style={{ marginTop: -14 }}>
                        <Col span={12} >
                            <Space direction='vertical' size={14} style={{ width: '100%' }}>
                                <TemplateInfo />
                                <Sender form={form} required={false} setContractServiceCodes={setContractServiceCodes} isHasOrderTemplate={false} isOrderTemplate />
                                <Receiver form={form} required={false} setContractServiceCodes={setContractServiceCodes} />
                                <Service form={form} required={false} contractServiceCodes={contractServiceCodes} />
                            </Space>
                        </Col>
                        <Col span={12}>
                            <Space direction='vertical' size={14} style={{ width: '100%' }}>
                                {id && <History />}
                                <Content form={form} required={false} />
                                <Other form={form} required={false} />
                            </Space>
                        </Col>
                        <Col span={24} style={{ margin: 8, paddingTop: 14, paddingBottom: 14, textAlign: 'center', backgroundColor: '#fff' }}>
                            <Space>
                                <Button style={{ width: 200 }} className='height-btn3 btn-outline-success' icon={<SaveOutlined />} onClick={onFinish} > Lưu đơn hàng mẫu </Button>
                                <Button className='height-btn3 btn-outline-danger' icon={<ReloadOutlined />} onClick={() => form.resetFields()} > Làm mới </Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </PageContainer>
    );
};

export default OrderTemplate;