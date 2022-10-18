import { validateMessages } from '@/core/contains';
import { ContractServiceCode, OrderHdrApi, OrderHdrDto, OrderTemplateDto, OrderCorrectionControllerApi, ContractApi, ProductEntity } from '@/services/client';
import { dataToSelectBox } from '@/utils';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Checkbox, Col, Form, Input, Row, Select, Space, Spin, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useModel, useParams } from 'umi';
import Other from './components/other';
import Receiver from './components/receiver';
import Sender from '../create/components/sender';
import moment from 'moment';
import { resultDataToListContract, setDefaultContract } from '@/utils/orderHelper';
import Service from '../create/components/service';
import DocumentTable from './components/content/document-table';
import { ArrowsAltOutlined, QuestionCircleOutlined, ShrinkOutlined } from '@ant-design/icons';
import ContentTable from './components/content/content-table';
import { useCurrencyList, useMyvnpServiceGroupList, usePostalType, useServiceList } from '@/core/selectors';
import CustomUpload from '@/components/CustomUpload';
import TextArea from 'antd/lib/input/TextArea';
import OrderFooter from '../create/components/footer';
import PackageInfo from './components/content/package-infor';
import ContentInfo from './components/content/content-infor';
import DocumentInfo from './components/content/document-infor';

const orderCorrectionControllerApi = new OrderCorrectionControllerApi();
const orderHdrApi = new OrderHdrApi();
const contractApi = new ContractApi();
const OrderHdr = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const { sampleOrders, findAllSampleOrders } = useModel('sampleOrderList');
    const [orderTemplateSelected, setOrderTemplateSelected] = useState<OrderTemplateDto>();
    const [contractServiceCodes, setContractServiceCodes] = useState<ContractServiceCode[]>([]);
    const { addSenderFromOrder, contractList, setDefaultSender, resetListSender } = useModel('orderModel');
    const [CorrectingOrder, SetCorrectingOrder] = useState<OrderHdrDto>()
    const [expand, setExpand] = useState<boolean>(false);
    const [openModalProduct, setOpenModalProduct] = useState<boolean>(false);
    const [productList, setProductList] = useState<ProductEntity[]>([]);
    const currencyList = useCurrencyList();
    const serviceCode = Form.useWatch('serviceCode', form);
    const allServiceList = useServiceList();
    const serviceGroupList = useMyvnpServiceGroupList();
    const [showPackage, setShowPackage] = useState<boolean>(false);
    const [showDoc, setShowDoc] = useState<boolean>(false);
    const postType = Form.useWatch('postType', form);
    const postalType = usePostalType();

    const params: any = useParams();
    const id = params.id;
    const case_type_id: number | undefined = params.case_type_id ? +params.case_type_id : undefined;


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
        if (id) {
            setIsLoading(true);
            if (case_type_id) {
                orderCorrectionControllerApi?.findOrderById(id).then((resp) => {
                    if (resp.status === 200) {
                        SetCorrectingOrder(resp.data as OrderHdrDto);
                        onFill(resp.data as OrderHdrDto);
                        // console.log(resp.data)
                    }
                }
                ).finally(() => setIsLoading(false))
            } else {
                orderHdrApi.findOrderDraftById(id)
                    .then(resp => {
                        if (resp.status === 200) {
                            onFill(resp.data);
                        }
                    }).finally(() => setIsLoading(false))
            }
        }

        // lấy danh sách đơn hàng mẫu
        findAllSampleOrders();
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

    useEffect(() => {
        if (allServiceList.find(s => s.mailServiceId === serviceCode)?.myvnpServiceGroupId === '6' && serviceCode !== 'EQT002') {
            setShowPackage(true)
        } else {
            setShowPackage(false)
        }
        if (allServiceList.find(s => s.mailServiceId === serviceCode)?.myvnpServiceGroupId === '5') {
            setShowDoc(true)
        } else {
            setShowDoc(false)
        }
        if (postType === 'HH' && (allServiceList.find(s => s.mailServiceId === serviceCode)?.myvnpServiceGroupId === '5' || serviceCode === 'EQT002')) {
            form.setFieldsValue({ currency: 'VND' })
        }
        if (postType === 'HH' && (allServiceList.find(s => s.mailServiceId === serviceCode)?.myvnpServiceGroupId === '6' && serviceCode !== 'EQT002')) {
            form.setFieldsValue({ currency: 'USD' })
        }
    }, [serviceCode])

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

    const onChangeItemContent = (contents: OrderContentDto[]) => {
        // if (!isTouchedWeight?.current) {
        //     const totalWeight = contents.reduce((total, next) => total + ((next.quantity || 0) * (next.weight || 0)), 0);
        //     // nếu chưa tự thay đổi weight
        //     props.form.setFieldsValue({
        //         weight: totalWeight
        //     });
        //     onReCalculatePriceWeight();
        // }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log(errorInfo);
    }

    const checkNumber = (value: any): boolean => {
        if (isNaN(value)) return false;
        const n: number = +value;
        return n > 0;
    }

    const checkValidateContent = (_: any, newValues: any[] = []) => {
        if (newValues.length === 0) {
            return Promise.reject(new Error(`Bắt buộc ít nhất một hàng hoá`));
        }
        for (let i = 0; i < newValues.length; i++) {
            const newValue = newValues[i];
            if (newValue) {
                if (!newValue.nameEn || !newValue.nameVi || !checkNumber(newValue.quantity) || !checkNumber(newValue.netWeight) || !checkNumber(newValue.priceVnd) || !checkNumber(newValue.weight)) {
                    return Promise.reject(new Error(`Chưa nhập đủ thông tin`));
                }
            }
        }
        return Promise.resolve();
    };

    return (
        <>
            <PageContainer
                // style={{ marginRight: 20 }}
                extra={case_type_id ? '' : <>
                    <b style={{ marginRight: 20 }}>Đơn hàng mẫu</b>
                    <Select style={{ width: 200 }} value={orderTemplateSelected?.orderTemplateId} onChange={onchangeOrderTemplate} allowClear>
                        {dataToSelectBox(sampleOrders, 'orderTemplateId', 'orderContent')}
                    </Select>
                </>}
            >
                <Spin spinning={isLoading}>
                    <Form
                        name="form-create-order-international"
                        labelCol={{ flex: '120px' }}
                        labelAlign="left"
                        labelWrap
                        colon={false}
                        form={form}
                        onFinishFailed={onFinishFailed}
                        validateMessages={validateMessages}
                    >
                        <Form.Item name='international' initialValue={true} hidden />
                        <Row gutter={[14, 14]} style={{ marginTop: -14 }} >
                            <Col md={12} sm={24} xs={24}>
                                <Space direction='vertical' size={14} style={{ width: '100%' }}>
                                    <Sender form={form} setContractServiceCodes={setContractServiceCodes} orderHdrId={id} isHasOrderTemplate={!!orderTemplateSelected} isInternational={true} />
                                    <Receiver caseTypeId={case_type_id} form={form} setContractServiceCodes={setContractServiceCodes} />
                                    {showDoc && <Card size='small'>
                                        <DocumentInfo contentCaseTypeId={case_type_id} form={form} />
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item
                                                    label='Loại bưu gửi'
                                                    labelCol={{ flex: '125px' }}
                                                    name='postalType'
                                                >
                                                    <Select style={{ width: '50%' }}>
                                                        {dataToSelectBox(postalType, 'value', 'name')}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>}
                                </Space>
                            </Col>
                            <Col md={12} sm={24} xs={24}>
                                <Space direction='vertical' size={14} style={{ width: '100%' }}>
                                    <PackageInfo contentCaseTypeId={case_type_id} form={form} showPackage={showPackage} />
                                    <Service form={form} contractServiceCodes={contractServiceCodes} isInternational={true} />
                                    {/* <Other otherCaseTypeId={case_type_id} form={form} /> */}
                                </Space>
                            </Col>
                            <Col span={24}>
                                <Card size='small'>
                                    <ContentInfo contentCaseTypeId={case_type_id} form={form} />
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="orderImages"
                                                // label="Đính kèm hình ảnh"
                                                label="Ảnh đính kèm"
                                                labelCol={{ flex: '125px' }}
                                            >
                                                <CustomUpload maxImage={5} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} style={{ textAlign: 'end' }}>
                                            <Form.Item
                                                name="keepOrderInfo"
                                                valuePropName='checked'
                                            >
                                                <Checkbox >
                                                    <span className='span-font'>Lưu thông tin đơn hàng</span>
                                                    <Tooltip
                                                        title={`Lưu thông tin hàng hóa và Yêu cầu thêm`}
                                                    >
                                                        {' '}
                                                        <QuestionCircleOutlined />
                                                    </Tooltip>
                                                </Checkbox>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                    <OrderFooter
                        correctingOrderStatus={CorrectingOrder?.status}
                        totalFeeBefore={CorrectingOrder?.totalFee || 0}
                        correctingOrderId={id}
                        form={form}
                        setIsLoading={setIsLoading}
                        orderHdrId={id}
                        resetDefaultOrderTemplate={resetDefaultOrderTemplate}
                        contractServiceCodes={contractServiceCodes}
                        setOrderTemplateSelected={setOrderTemplateSelected} isBatch={false}
                        isInternational={true}
                    />
                </Spin>
            </PageContainer >
        </>
    );
};

export default OrderHdr;