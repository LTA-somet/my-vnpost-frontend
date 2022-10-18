import { validateMessages } from '@/core/contains';
import { ContractServiceCode, OrderHdrApi, OrderHdrDto, OrderTemplateDto, OrderCorrectionControllerApi, ContractApi } from '@/services/client';
import { dataToSelectBox } from '@/utils';
import { PageContainer } from '@ant-design/pro-layout';
import { Col, Collapse, Form, Row, Select, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useModel, useParams } from 'umi';
import Content from './components/content';
import OrderFooter, { defaultContentInBatch } from './components/footer';
import Other from './components/other';
import Receiver from './components/receiver';
import Sender from './components/sender';
import Service from './components/service';
import moment from 'moment';
import { resultDataToListContract, setDefaultContract } from '@/utils/orderHelper';
import Batch from './components/batch';
import GroupTag from '@/components/GroupTag';

const orderCorrectionControllerApi = new OrderCorrectionControllerApi();
const orderHdrApi = new OrderHdrApi();
const contractApi = new ContractApi();
const OrderHdr = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const { sampleOrders, findAllSampleOrders } = useModel('sampleOrderList');
    const [orderTemplateSelected, setOrderTemplateSelected] = useState<OrderTemplateDto>();
    const [contractServiceCodes, setContractServiceCodes] = useState<ContractServiceCode[]>([]);
    const { addSenderFromOrder, contractList, setDefaultSender, resetListSender, setBatchCode, onSetItemBatchRef, setFormInit, cleanup } = useModel('orderModel');
    const [correctingOrder, setCorrectingOrder] = useState<OrderHdrDto>();
    const [isBatch, setIsBatch] = useState<boolean>(false);

    const params: any = useParams();
    const location = useLocation();
    const id = params.id;
    const caseTypeId: number | undefined = params.case_type_id ? +params.case_type_id : undefined;

    const onSearchReceiverContract = (receiverContractNumber?: string) => {
        if (receiverContractNumber) {
            contractApi.findReceiverContract(receiverContractNumber, '')
                .then(resp => {
                    if (resp.status === 200) {
                        const data = resultDataToListContract(resp.data, true, receiverContractNumber);
                        const contract = data.find(c => c.contractNumber === receiverContractNumber);
                        setContractServiceCodes(contract?.contractServiceCodes || [])
                    }
                })
        }
    }

    const onFill = (orderHdr: OrderHdrDto) => {
        const orderHdrBinding = addSenderFromOrder(orderHdr);
        const formValue = {
            ...orderHdrBinding,
            collectionDate: orderHdrBinding.collectionDate ? moment(orderHdrBinding.collectionDate, 'DD/MM/YYYY HH:mm:ss') : undefined
        };
        // setContractServiceCodes(orderHdr.contractServiceCodes || []) 
        onSearchReceiverContract(orderHdr.receiverContractNumber);
        form.setFieldsValue(formValue);
    }

    useEffect(() => {
        setFormInit(form, caseTypeId);

        if (id) {
            setIsLoading(true);
            if (caseTypeId) {
                orderCorrectionControllerApi?.findOrderById(id).then((resp) => {
                    if (resp.status === 200) {
                        const order: OrderHdrDto = resp.data as OrderHdrDto;
                        setCorrectingOrder(order);
                        onFill(order);
                        setIsBatch(!!order.batchCode);
                        setBatchCode(order.batchCode);
                        onSetItemBatchRef(order);
                    }
                }
                ).finally(() => setIsLoading(false))
            } else {
                orderHdrApi.findOrderDraftById(id)
                    .then(resp => {
                        if (resp.status === 200) {
                            if (resp.data.batchCode) {
                                const formValue: any = { ...resp.data, ...defaultContentInBatch }
                                if (!formValue.amountForBatch) {
                                    formValue.vas = formValue.vas?.filter((v: any) => v.vaCode !== 'GTG021');
                                }
                                setIsBatch(!!resp.data.batchCode);
                                setBatchCode(resp.data.batchCode);
                                onSetItemBatchRef(resp.data);
                                onFill(formValue);
                            } else {
                                onFill(resp.data);
                            }
                        }
                    }).finally(() => setIsLoading(false))
            }
        } else {
            const checkIsBatch = location.pathname.includes('/batch/');
            setIsBatch(checkIsBatch);
            setBatchCode(undefined);
        }

        // lấy danh sách đơn hàng mẫu
        findAllSampleOrders();
        return () => {
            cleanup();
        }
    }, []);

    const resetDefaultOrderTemplate = () => {
        const ot = sampleOrders.find(o => o['default']);

        if (ot) {
            onFill(ot.data!);
        } else {
            resetListSender();
            setDefaultSender();
            setDefaultContract(form, contractList, setContractServiceCodes);
        }
        setOrderTemplateSelected(ot);
    }

    useEffect(() => {
        if (!id) {
            resetDefaultOrderTemplate();
        }
    }, [sampleOrders])

    const onchangeOrderTemplate = (orderTemplateId: number) => {
        if (orderTemplateId) {
            const ot = sampleOrders.find(o => o.orderTemplateId === orderTemplateId);
            if (ot) {
                setOrderTemplateSelected(ot);
                onFill(ot.data!);
            }
        } else {
            setOrderTemplateSelected(undefined);
            form.resetFields();
            setDefaultSender();
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log(errorInfo);
    }

    return (
        <>
            <PageContainer
                // style={{ marginRight: 20 }}
                extra={caseTypeId ? '' : <>
                    <b style={{ marginRight: 20 }}>Đơn hàng mẫu</b>
                    <Select style={{ width: 200 }} value={orderTemplateSelected?.orderTemplateId} onChange={onchangeOrderTemplate} allowClear>
                        {dataToSelectBox(sampleOrders, 'orderTemplateId', 'orderContent')}
                    </Select>
                </>}
            >
                <Spin spinning={isLoading}>
                    <Form
                        name="form-create-order"
                        labelCol={{ flex: '120px' }}
                        labelAlign="left"
                        labelWrap
                        colon={false}
                        form={form}
                        onFinishFailed={onFinishFailed}
                        validateMessages={validateMessages}
                    >
                        <GroupTag isBatch={isBatch} title={'Thông tin chung'}>
                            <Row gutter={[14, 14]} style={{ marginTop: -14 }} >
                                <Col md={12} sm={24} xs={24}>
                                    <Space direction='vertical' size={14} style={{ width: '100%' }}>
                                        <Sender form={form} setContractServiceCodes={setContractServiceCodes} orderHdrId={id} isHasOrderTemplate={!!orderTemplateSelected} />
                                        {!isBatch && <Receiver form={form} setContractServiceCodes={setContractServiceCodes} />}
                                        <Service form={form} contractServiceCodes={contractServiceCodes} isBatch={isBatch} />
                                    </Space>
                                </Col>
                                <Col md={12} sm={24} xs={24}>
                                    <Space direction='vertical' size={14} style={{ width: '100%' }}>
                                        {!isBatch && <Content form={form} />}
                                        {isBatch && <Receiver form={form} setContractServiceCodes={setContractServiceCodes} />}
                                        <Other correctingOrder={correctingOrder} form={form} />
                                    </Space>
                                </Col>
                            </Row>
                        </GroupTag>
                        {isBatch && <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
                            <Col span={24}>
                                <Batch />
                            </Col>
                        </Row>}
                    </Form>
                    <OrderFooter
                        correctingOrderStatus={correctingOrder?.status}
                        totalFeeBefore={correctingOrder?.totalFee || 0}
                        correctingOrderId={id}

                        form={form}
                        setIsLoading={setIsLoading}
                        orderHdrId={id}
                        resetDefaultOrderTemplate={resetDefaultOrderTemplate}
                        contractServiceCodes={contractServiceCodes}
                        setOrderTemplateSelected={setOrderTemplateSelected}
                        isBatch={isBatch}
                    />
                </Spin>
            </PageContainer >
        </>
    );
};

export default OrderHdr;