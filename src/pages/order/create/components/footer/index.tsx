import {
    McasServiceApi,
    McasTargetsProcessEntity,
    OrderBillingDto,
    OrderHdrApi,
    OrderHdrDto,
    ContractServiceCode,
    OrderCorrectionApi,
    OrderTemplateDto,
    McasUserApi,
} from '@/services/client';
import { getKeepOrderData, validateBillingFormOrder, validateFormOrder } from '@/utils/orderHelper';
import {
    CheckCircleOutlined,
    DeliveredProcedureOutlined,
    DollarOutlined,
    FileSearchOutlined,
    PlusCircleOutlined,
    QuestionCircleOutlined,
    ReloadOutlined,
    ExportOutlined,
    UndoOutlined,
    GoldOutlined,
} from '@ant-design/icons';
import { FooterToolbar } from '@ant-design/pro-layout';
import {
    Button,
    Card,
    Form,
    FormInstance,
    Modal,
    notification,
    Space,
    Tooltip,
    Input,
    Spin,
    Row,
    Col,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import CardPrice from './card-price';
import './style.css';
import { history, Link } from 'umi';
import { formatCurrency, printFile } from '@/utils';
import PrintOrderForm from '@/components/PrintOrder/print-order';
import { detectFee } from './feeHelper';

export type FeeContent = {
    billing: OrderBillingDto[];
    totalFee: number;
    totalFeeReceiver: number;
    totalFeeSender: number;
    feeNode?: React.ReactNode;
    feeReceiverNode?: React.ReactNode;
    priceWeight?: number;
};

const defaultFeeContent = {
    billing: [],
    totalFee: 0,
    totalFeeReceiver: 0,
    totalFeeSender: 0,
};

export const defaultContentInBatch = {
    weight: undefined,
    length: undefined,
    height: undefined,
    width: undefined,
    priceWeight: undefined,
    dimWeight: undefined,
    contentNote: undefined,
    orderImages: undefined,
    isBroken: false,
    orderContents: []
}

const orderHdrApi = new OrderHdrApi();
const orderCorrectionApi = new OrderCorrectionApi();

const mcasServiceApi = new McasServiceApi();
const mcasUserApi = new McasUserApi();

const OrderFooter: React.FC<Props> = (props: Props) => {
    const [feeContent, setFeeContent] = useState<FeeContent>(defaultFeeContent);
    const { serviceListAppend, findAllSender, batch, onSetItemBatchRef, onFocusBatchInfo, getBatchFinalAndValidate, setDefaultSender, setBatch, caseTypeId } = useModel('orderModel');
    const [targetProcess, setTargetProcess] = useState<McasTargetsProcessEntity>();
    const { vasList, vasExtendList } = useModel('vasList');
    const [isModalLoading, setIsModalLoading] = useState<boolean>(false);
    const [moneyAfter, setMoneyAfter] = useState<string>('0');
    const [visiblePrintForm, setVisiblePrintForm] = useState<boolean>(false);
    const [orderHdrPrint, setOrderHdrPrint] = useState<OrderHdrDto>();
    const [repayLoading, SetRepayLoading] = useState<boolean>(false);
    const printRef = useRef<any>();

    const serviceCode = Form.useWatch('serviceCode', props.form);
    const senderProvinceCode = Form.useWatch('senderProvinceCode', props.form);
    const receiverProvinceCode = Form.useWatch('receiverProvinceCode', props.form);
    const receiverContractNumber = Form.useWatch('receiverContractNumber', props.form);
    const priceWeight = Form.useWatch('priceWeight', props.form)
    const [spinLoading, setIsSpinLoading] = useState<boolean>(false);
    const [mauinDefault, setmauInDefault] = useState<string>();
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [priceWeightDisplay, setPriceWeightDisplay] = useState<number>(0);

    useEffect(() => {
        if (serviceCode && senderProvinceCode && receiverProvinceCode) {
            mcasServiceApi
                .findTargetProcess(serviceCode, senderProvinceCode, receiverProvinceCode)
                .then((resp) => resp.status === 200 && setTargetProcess(resp.data));
        } else {
            setTargetProcess(undefined);
        }
    }, [serviceCode, senderProvinceCode, receiverProvinceCode]);

    // tính khối lượng tính cước
    useEffect(() => {
        let newPriceWeightDisplay = 0;
        console.log(priceWeight);

        if (props.isBatch) {
            if (batch.length > 0) {
                newPriceWeightDisplay = batch.reduce((t, n) => t + (n?.priceWeight ?? 0), 0);
            }
        } else {
            newPriceWeightDisplay = priceWeight;
        }
        setPriceWeightDisplay(newPriceWeightDisplay)
    }, [props.isBatch, priceWeight, batch]);

    useEffect(() => {
        setMoneyAfter(formatCurrency(Math.abs(feeContent.totalFee - props.totalFeeBefore!)));
    }, [feeContent]);


    const handlePrint = (oh: OrderHdrDto) => {
        setIsSpinLoading(true);
        mcasUserApi.getDataPrintConfig().then((resp) => {
            if (resp.status === 200) {
                if (resp.data.isDefault) {
                    orderHdrApi
                        .exportReport(oh!.orderHdrId!, resp.data.mauinCode!)
                        .then((res) => {
                            if (res.status === 200) {
                                printFile(res.data);
                            }
                        })
                        .finally(() => setIsSpinLoading(false));
                } else {
                    setmauInDefault(resp.data.mauinCode);
                    setVisiblePrintForm(true);
                    setOrderHdrPrint(oh);
                }
            }
        });
    };

    const handleOpenPrintMulti = (ohs: OrderHdrDto[]) => {
        setIsSpinLoading(true);
        mcasUserApi.getDataPrintConfig().then((resp) => {
            if (resp.status === 200) {
                const ids = ohs.map(o => o.orderHdrId!);
                if (resp.data.isDefault) {
                    orderHdrApi
                        .exportListReport(resp.data.mauinCode!, ids)
                        .then((res) => {
                            if (res.status === 200) {
                                printFile(res.data);
                            }
                        })
                        .finally(() => setIsSpinLoading(false));
                } else {
                    setmauInDefault(resp.data.mauinCode);
                    printRef.current.handleOpenPrintMulti?.(ids);
                    // setVisiblePrintForm(true);
                    // setOrderHdrPrint(oh);
                }
            }
        });
    };

    const onCalculateSingle = () => {
        props.form.validateFields().then((formValue) => {
            try {
                const order = validateBillingFormOrder(formValue, serviceListAppend, props.contractServiceCodes, false, vasList);

                props.setIsLoading(true);
                setFeeContent(defaultFeeContent);
                orderHdrApi
                    .calculateFee(order)
                    .then((resp) => {
                        if (resp.status === 200) {
                            const newFeeContent = detectFee(resp.data, resp.data.orderBillings, vasList);
                            setFeeContent(newFeeContent)
                            SetRepayLoading(true);
                        }
                    })
                    .finally(() => props.setIsLoading(false));
            } catch (e: any) {
                notification.error({ message: e.message });
                return;
            }
        });
    }

    const onCalculateBatch = () => {
        props.form.validateFields().then((formValue) => {
            try {
                const itemBatchRef = validateBillingFormOrder(formValue, serviceListAppend, props.contractServiceCodes, false, vasList);
                onSetItemBatchRef(itemBatchRef);
                getBatchFinalAndValidate(itemBatchRef).then(batchFinal => {
                    props.setIsLoading(true);
                    orderHdrApi
                        .calculateBatchFee(batchFinal)
                        .then((resp) => {
                            if (resp.status === 200) {
                                const lastItemInBatch = resp.data[resp.data.length - 1];
                                const newFeeContent = detectFee(lastItemInBatch, lastItemInBatch.orderBillings, vasList, resp.data);
                                setFeeContent(newFeeContent)
                                SetRepayLoading(true);
                            }
                        })
                        .catch((e) => {
                            e?.errorFields?.forEach((element: any) => {
                                element?.errors?.forEach((err: any) => {
                                    notification.error({ message: err });
                                    return;
                                });
                            });
                        })
                        .finally(() => props.setIsLoading(false));
                })
            } catch (e: any) {
                notification.error({ message: e.message });
                return;
            }
        }).catch(() => {
            onFocusBatchInfo();
        });
    }

    const onCalculate = () => {
        if (props.isBatch) {
            onCalculateBatch();
        } else {
            onCalculateSingle();
        }
    };

    const onCalculateFeeKHL = () => {
        props.form.validateFields().then((formValue) => {
            try {
                const order = validateBillingFormOrder(formValue, serviceListAppend, props.contractServiceCodes, false, vasList);

                props.setIsLoading(true);
                setFeeContent(defaultFeeContent);
                orderCorrectionApi
                    .calculateKHLFeeV2(caseTypeId as number, props.correctingOrderId as string, order)
                    .then((resp) => {
                        if (resp.status === 200) {
                            const newFeeContent = detectFee(resp.data, resp.data.orderBillings, vasList);
                            setFeeContent(newFeeContent)
                            SetRepayLoading(true);
                        }
                    })
                    .finally(() => props.setIsLoading(false));
            } catch (e: any) {
                notification.error({ message: e.message });
                return;
            }
        });
    };

    // tính cước hiệu chỉnh
    const caCu = () => {
        props.form.validateFields().then(() => {
            if (caseTypeId == 1 || caseTypeId == 2) {
                onCalculate();
            } else {
                onCalculateFeeKHL();
            }
            setIsModalLoading(true);
        })
    };

    const createDraftSingle = () => {
        props.form.validateFields().then((formValue) => {
            try {
                const order = validateFormOrder(formValue, serviceListAppend, props.contractServiceCodes, false, vasList);

                order.orderHdrId = props.orderHdrId;
                props.setIsLoading(true);
                orderHdrApi
                    .createDraft(order)
                    .then((resp) => {
                        if (resp.status === 201) {
                            Modal.confirm({
                                title: 'Lưu nháp đơn hàng thành công',
                                icon: <CheckCircleOutlined />,
                                content: 'Bạn có muốn chuyển sang đơn hàng nháp không?',
                                okText: 'Đồng ý',
                                cancelText: 'Đóng',
                                onOk() {
                                    history.push({ pathname: '/manage/order-manager', query: { orderType: '3' } });
                                },
                                onCancel() {
                                    props.form.resetFields();
                                    if (formValue.keepOrderInfo) {
                                        // Lưu thông tin đơn hàng
                                        const oldFormValue = getKeepOrderData(formValue, vasExtendList);
                                        props.form.setFieldsValue(oldFormValue);
                                    } else {
                                        props.setOrderTemplateSelected(undefined);
                                    }
                                    if (props.orderHdrId) {
                                        history.push('/order/create');
                                    }
                                    setDefaultSender();
                                    setFeeContent(defaultFeeContent);
                                },
                            });
                        }
                    })
                    .catch((e) => {
                        e?.errorFields?.forEach((element: any) => {
                            element?.errors?.forEach((err: any) => {
                                notification.error({ message: err });
                                return;
                            });
                        });
                    })
                    .finally(() => props.setIsLoading(false));
            } catch (e: any) {
                notification.error({ message: e.message });
                return;
            }
        });
    };

    const createDraftBatch = () => {
        props.form.validateFields().then((formValue) => {
            try {
                const itemBatchRef = validateBillingFormOrder(formValue, serviceListAppend, props.contractServiceCodes, false, vasList);
                onSetItemBatchRef(itemBatchRef);
                getBatchFinalAndValidate(itemBatchRef).then(batchFinal => {
                    props.setIsLoading(true);
                    orderHdrApi
                        .createDraftBatch(batchFinal)
                        .then((resp) => {
                            if (resp.status === 201) {
                                Modal.confirm({
                                    title: 'Lưu nháp đơn hàng thành công',
                                    icon: <CheckCircleOutlined />,
                                    content: 'Bạn có muốn chuyển sang đơn hàng nháp không?',
                                    okText: 'Đồng ý',
                                    cancelText: 'Đóng',
                                    onOk() {
                                        history.push({ pathname: '/manage/order-manager', query: { orderType: '3' } });
                                    },
                                    onCancel() {
                                        const keepOrderInfo = props.form.getFieldValue('keepOrderInfo');
                                        props.form.resetFields();
                                        if (keepOrderInfo) {
                                            // Lưu thông tin đơn hàng
                                            const oldFormValue = getKeepOrderData(itemBatchRef, vasExtendList);
                                            props.form.setFieldsValue(oldFormValue);
                                        } else {
                                            props.setOrderTemplateSelected(undefined);
                                        }
                                        if (props.orderHdrId) {
                                            history.push('/order/create');
                                        }
                                        setBatch([]);
                                        setDefaultSender();
                                        setFeeContent(defaultFeeContent);
                                    },
                                });
                            }
                        })
                        .catch((e) => {
                            e?.errorFields?.forEach((element: any) => {
                                element?.errors?.forEach((err: any) => {
                                    notification.error({ message: err });
                                    return;
                                });
                            });
                        })
                        .finally(() => props.setIsLoading(false));
                })
            } catch (e: any) {
                notification.error({ message: e.message });
                return;
            }
        }).catch(() => {
            onFocusBatchInfo();
        });
    }

    const createDraft = () => {
        if (props.isBatch) {
            createDraftBatch();
        } else {
            createDraftSingle();
        }
    }

    const onSaveOrderSingle = () => {
        props.form.validateFields().then((formValue) => {
            try {
                const order = validateFormOrder(formValue, serviceListAppend, props.contractServiceCodes, false, vasList);

                props.setIsLoading(true);
                orderHdrApi
                    .createOrderHdr(order)
                    .then((resp) => {
                        if (resp.status === 200) {
                            if (printRef.current?.printType) {
                                printRef.current?.handlePrint(resp.data);
                            }
                            Modal.confirm({
                                title: 'Tạo vận đơn mới thành công',
                                icon: <CheckCircleOutlined />,
                                content: (
                                    <>
                                        <span style={{ color: '#ff0000' }}>Lưu ý:</span> Bạn vui lòng in và dán vận đơn (hoặc viết số hiệu bưu gửi{' '}
                                        <b>{resp.data.itemCode}</b>) lên gói hàng.
                                        <br />
                                        <div onClick={() => handlePrint(resp.data)}>
                                            <a>Nhấn vào đây để in đơn hàng</a>
                                        </div>
                                        {/* Bạn có muốn chuyển sang màn hình Quản lý đơn hàng không? */}
                                    </>
                                ),
                                okText: 'Quản lý đơn hàng',
                                cancelText: 'Tạo đơn hàng mới',
                                onOk() {
                                    history.push({ pathname: '/manage/order-manager', query: { orderType: '2' } });
                                },
                                onCancel() {
                                    props.form.resetFields();
                                    if (formValue.keepOrderInfo) {
                                        // Lưu thông tin đơn hàng
                                        const oldFormValue = getKeepOrderData(formValue, vasExtendList);
                                        props.form.setFieldsValue(oldFormValue);
                                    } else {
                                        props.setOrderTemplateSelected(undefined);
                                    }
                                    if (props.orderHdrId) {
                                        history.push('/order/create');
                                    }
                                    findAllSender();
                                    setDefaultSender();
                                    // findAllReceiver();
                                    setFeeContent(defaultFeeContent);
                                },
                                width: 800
                            });
                        }
                    })
                    .catch((e) => {
                        e?.errorFields?.forEach((element: any) => {
                            element?.errors?.forEach((err: any) => {
                                notification.error({ message: err });
                                return;
                            });
                        });
                    })
                    .finally(() => props.setIsLoading(false));
            } catch (e: any) {
                notification.error({ message: e.message });
                return;
            }
        });
    };

    const onSaveOrderInternational = () => {
        props.form.validateFields().then((formValue) => {
            try {
                const order = validateFormOrder(formValue, serviceListAppend, props.contractServiceCodes, false, vasList);
                console.log(order);

                props.setIsLoading(true);
                orderHdrApi
                    .createOrderHdr(order)
                    .then((resp) => {
                        if (resp.status === 200) {
                            if (printRef.current?.printType) {
                                printRef.current?.handlePrint(resp.data);
                            }
                            Modal.confirm({
                                title: 'Tạo vận đơn mới thành công',
                                icon: <CheckCircleOutlined />,
                                content: (
                                    <>
                                        <span style={{ color: '#ff0000' }}>Lưu ý:</span> Bạn vui lòng in và dán vận đơn (hoặc viết số hiệu bưu gửi{' '}
                                        <b>{resp.data.itemCode}</b>) lên gói hàng.
                                        <br />
                                        <div onClick={() => handlePrint(resp.data)}>
                                            <a>Nhấn vào đây để in đơn hàng</a>
                                        </div>
                                        {/* Bạn có muốn chuyển sang màn hình Quản lý đơn hàng không? */}
                                    </>
                                ),
                                okText: 'Quản lý đơn hàng',
                                cancelText: 'Tạo đơn hàng mới',
                                onOk() {
                                    history.push({ pathname: '/manage/order-manager', query: { orderType: '2' } });
                                },
                                onCancel() {
                                    props.form.resetFields();
                                    if (formValue.keepOrderInfo) {
                                        // Lưu thông tin đơn hàng
                                        const oldFormValue = getKeepOrderData(formValue, vasExtendList);
                                        props.form.setFieldsValue(oldFormValue);
                                    } else {
                                        props.setOrderTemplateSelected(undefined);
                                    }
                                    if (props.orderHdrId) {
                                        history.push('/order/create');
                                    }
                                    findAllSender();
                                    setDefaultSender();
                                    // findAllReceiver();
                                    setFeeContent(defaultFeeContent);
                                },
                                width: 800
                            });
                        }
                    })
                    .catch((e) => {
                        e?.errorFields?.forEach((element: any) => {
                            element?.errors?.forEach((err: any) => {
                                notification.error({ message: err });
                                return;
                            });
                        });
                    })
                    .finally(() => props.setIsLoading(false));
            } catch (e: any) {
                notification.error({ message: e.message });
                return;
            }
        });
    };

    const onSaveOrderBatch = () => {
        props.form.validateFields().then((formValue) => {
            try {
                const itemBatchRef = validateBillingFormOrder(formValue, serviceListAppend, props.contractServiceCodes, false, vasList);
                onSetItemBatchRef(itemBatchRef);
                getBatchFinalAndValidate(itemBatchRef).then(batchFinal => {
                    props.setIsLoading(true);
                    orderHdrApi
                        .createBatch(batchFinal)
                        .then((resp) => {
                            if (resp.status === 200) {
                                // if (printRef.current?.printType) {
                                //     printRef.current?.handlePrint(resp.data);
                                // }
                                Modal.confirm({
                                    title: 'Tạo vận đơn mới thành công',
                                    icon: <CheckCircleOutlined />,
                                    content: (
                                        <>
                                            <span style={{ color: '#ff0000' }}>Lưu ý:</span> Bạn vui lòng in và dán vận đơn (hoặc viết số hiệu bưu gửi) lên gói hàng.
                                            <br />
                                            Mã lô: <b>{resp.data[0]?.batchCode}</b>
                                            <br />
                                            <div onClick={() => handleOpenPrintMulti(resp.data)}>
                                                <a>Nhấn vào đây để in đơn hàng</a>
                                            </div>
                                            {/* Bạn có muốn chuyển sang màn hình Quản lý đơn hàng không? */}
                                        </>
                                    ),
                                    okText: 'Quản lý đơn hàng',
                                    cancelText: 'Tạo đơn hàng mới',
                                    onOk() {
                                        history.push({ pathname: '/manage/order-manager', query: { orderType: '2' } });
                                    },
                                    onCancel() {
                                        props.form.resetFields();
                                        const lastItemInBatch: any = batch[batch.length - 1];
                                        if (lastItemInBatch.keepOrderInfo) {
                                            // Lưu thông tin đơn hàng
                                            const oldFormValue = getKeepOrderData(lastItemInBatch, vasExtendList);
                                            props.form.setFieldsValue(oldFormValue);
                                        } else {
                                            props.setOrderTemplateSelected(undefined);
                                        }
                                        if (props.orderHdrId) {
                                            history.push('/order/create');
                                        }
                                        findAllSender();
                                        setDefaultSender();
                                        setBatch([]);
                                        // findAllReceiver();
                                        setFeeContent(defaultFeeContent);
                                    },
                                    width: 800
                                });
                            }
                        })
                        .catch((e) => {
                            e?.errorFields?.forEach((element: any) => {
                                element?.errors?.forEach((err: any) => {
                                    notification.error({ message: err });
                                    return;
                                });
                            });
                        })
                        .finally(() => props.setIsLoading(false));
                })
            } catch (e: any) {
                notification.error({ message: e.message });
                return;
            }
        }).catch(() => {
            onFocusBatchInfo();
        });
    }

    const onSaveOrder = () => {
        if (props.isBatch) {
            onSaveOrderBatch();
        } else if (props.isInternational) {
            onSaveOrderInternational();

        } else {
            onSaveOrderSingle();
        }
    }

    const onSaveCorrectingOrder = () => {
        props.form.validateFields().then((formValue) => {
            try {
                setIsSaved(true);
                setIsSpinLoading(true);
                const order = validateFormOrder(formValue, serviceListAppend, props.contractServiceCodes, false, vasList);
                props.setIsLoading(true);
                orderCorrectionApi
                    .createCorrectionOrder(
                        caseTypeId as number,
                        props.correctingOrderId as string,
                        order,
                    )
                    .then((resp) => {
                        if (resp.status === 201 || resp.status === 200) {
                            setIsSpinLoading(false);
                            setIsSaved(false);
                            notification.success({ message: `Đơn hàng ${resp.data.itemCode} hiệu chỉnh thành công` });
                            history.push('/manage/order-manager');
                        }
                    })
                    .finally(() => {
                        props.setIsLoading(false);
                        setIsSpinLoading(false);
                        setIsSaved(false);
                    });
            } catch (e: any) {
                notification.error({ message: e.message });
                history.push('/manage/order-manager');

                props.setIsLoading(false);
                return;
            }
        });
    };

    const onUpdateOrderSingle = () => {
        props.form.validateFields().then((formValue) => {
            const order = validateFormOrder(formValue, serviceListAppend, props.contractServiceCodes, false, vasList);
            props.setIsLoading(true);
            orderHdrApi
                .updateOrderHdr(props.orderHdrId!, order)
                .then((resp) => {
                    if (resp.status === 201) {
                        if (printRef.current?.printType) {
                            printRef.current?.handlePrint(resp.data);
                        }
                        Modal.confirm({
                            title: 'Tạo vận đơn mới thành công',
                            icon: <CheckCircleOutlined />,
                            content: (
                                <>
                                    Lưu ý: bạn vui lòng in và dán vận đơn (hoặc viết số hiệu bưu gửi{' '}
                                    {resp.data.itemCode}) lên gói hàng
                                    <div onClick={() => handlePrint(resp.data)}>
                                        <b>Nhấn vào đây để in đơn hàng</b>
                                    </div>
                                    Bạn có muốn chuyển sang màn hình Quản lý đơn hàng không?
                                </>
                            ),
                            okText: 'Đồng ý',
                            cancelText: 'Đóng',
                            onOk() {
                                history.push({ pathname: '/manage/order-manager', query: { orderType: '2' } });
                            },
                            onCancel() {
                                props.form.resetFields();
                                if (formValue.keepOrderInfo) {
                                    // Lưu thông tin đơn hàng
                                    const oldFormValue = getKeepOrderData(formValue, vasExtendList);
                                    props.form.setFieldsValue(oldFormValue);
                                }
                                if (props.orderHdrId) {
                                    history.push('/order/create');
                                }
                                findAllSender();
                                setDefaultSender();
                            },
                        });
                    }
                })
                .catch((e) => {
                    e?.errorFields?.forEach((element: any) => {
                        element?.errors?.forEach((err: any) => {
                            notification.error({ message: err });
                            return;
                        });
                    });
                })
                .finally(() => props.setIsLoading(false));
        });
    };

    const onUpdateOrder = () => {
        if (props.isBatch) {
            onSaveOrderBatch();
        } else {
            onUpdateOrderSingle();
        }
    }

    const onReset = () => {
        props.form.resetFields();
        props.resetDefaultOrderTemplate();
    };

    return (
        <FooterToolbar
            // style={{ overflowX: 'auto' }}
            extra={
                <Space>
                    <div style={{ width: 30 }} />
                    {!props.isInternational &&
                        <CardPrice
                            key="kltc"
                            title={'Khối lượng tính cước'}
                            price={formatCurrency(priceWeightDisplay ?? 0) + ' gram'}
                            icon={<GoldOutlined style={{ fontSize: 20 }} />}
                        />}
                    <CardPrice
                        key="tctt"
                        title={
                            <>
                                Tổng cước tạm tính
                                {receiverContractNumber && (
                                    <Tooltip title={'Người nhận trả cước'}>
                                        {' '}
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                )}
                            </>
                        }
                        price={formatCurrency(feeContent.totalFee) + ' đ'}
                        icon={<FileSearchOutlined style={{ fontSize: 20 }} />}
                        menu={feeContent.feeNode}

                    />
                    <CardPrice
                        key="ttth"
                        title="Tổng tiền thu hộ"
                        price={formatCurrency(feeContent.totalFeeReceiver) + ' đ'}
                        icon={<FileSearchOutlined style={{ fontSize: 20 }} />}
                        menu={feeContent.feeReceiverNode}
                    />
                    {/* <CardPrice
                        title="Tiền thu người gửi"
                        price={formatCurrency(feeContent.totalFeeSender)}
                    /> */}
                    {caseTypeId && (
                        <CardPrice
                            key="sttt"
                            // disabled={!repayLoading}
                            title={
                                !repayLoading ? 'Số tiền trả thêm/nhận lại tạm tính' :
                                    (feeContent.totalFee - props.totalFeeBefore! > 0
                                        ? 'Số tiền trả thêm tạm tính'
                                        : 'Số tiền nhận lại tạm tính')
                            }
                            price={feeContent.totalFee + ' đ' ? moneyAfter : '0 đ'}
                        />
                    )}
                    {!props.isInternational &&
                        <CardPrice
                            key="tgdk"
                            title={
                                <>
                                    Thời gian dự kiến
                                    <Tooltip
                                        title={`Tính từ ngày chấp nhận bưu gửi ${targetProcess
                                            ? targetProcess.dayOff
                                                ? 'Tính cả ngày nghỉ'
                                                : 'Không tính ngày nghỉ'
                                            : ''
                                            }`}
                                    >
                                        {' '}
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </>
                            }
                            description={
                                targetProcess ? (
                                    `Từ ${targetProcess.minimumTime} đến ${targetProcess.maxTime} ngày`
                                ) : (
                                    <></>
                                )
                            }
                        />
                    }
                </Space>
            }
        >
            <Space>
                <Button
                    size="large"
                    className="height-btn1 btn-outline-warning width-btn1"
                    icon={<DollarOutlined />}
                    key="calculate"
                    onClick={
                        caseTypeId == 4 ||
                            caseTypeId == 5 ||
                            caseTypeId == 6 ||
                            caseTypeId == 7
                            ? onCalculateFeeKHL
                            : onCalculate
                    }
                >
                    Tính cước
                </Button>
                {props.orderHdrId ? (
                    <Button
                        size="large"
                        key="xacnhan"
                        className="btn btn-outline-success"
                        onClick={onUpdateOrder}
                        hidden={caseTypeId !== undefined}
                    >
                        Xác nhận
                    </Button>
                ) : (
                    <Button
                        size="large"
                        icon={<PlusCircleOutlined />}
                        key="taodon"
                        className="btn btn-outline-info"
                        onClick={onSaveOrder}
                    >
                        Tạo đơn
                    </Button>
                )}
                {caseTypeId ? (
                    <>
                        <Button
                            size="large"
                            key="correct"
                            onClick={() => {
                                caCu();
                            }}
                            icon={<PlusCircleOutlined />}
                            className="height-btn1 btn-outline-info"
                        >
                            Hiệu Chỉnh
                        </Button>

                        <Button
                            key="correct-cancel"
                            onClick={() => setIsModalLoading(false)}
                            className="height-btn1 btn-outline-secondary"
                            size="large"
                            style={{ marginLeft: '7px' }}
                        >
                            <Link to={'/manage/order-manager'}>
                                <ExportOutlined /> Đóng
                            </Link>
                        </Button>
                    </>
                ) : null}

                <Button
                    hidden={caseTypeId !== undefined}
                    size="large"
                    icon={<DeliveredProcedureOutlined />}
                    key="luunhap"
                    className="btn btn-outline-secondary"
                    form="form-create-order"
                    onClick={createDraft}
                >
                    Lưu nháp
                </Button>
                <Button
                    hidden={caseTypeId !== undefined}
                    size="large"
                    icon={<ReloadOutlined />}
                    key="lammoi"
                    className="btn btn-outline-danger"
                    onClick={onReset}
                >
                    Làm mới
                </Button>
                <div style={{ width: 60 }} />
            </Space>
            <Modal
                title="Chi tiết cước hiệu chỉnh"
                className="correct-modal-box"
                visible={isModalLoading}
                onCancel={() => {
                    setIsModalLoading(false);
                    setMoneyAfter(formatCurrency(Math.abs(feeContent.totalFee - props.totalFeeBefore!)));
                }}
                width={600}
                footer={[
                    <Button
                        icon={<UndoOutlined />}
                        className="btn-outline-danger"
                        key="correct-close"
                        onClick={() => {
                            setIsModalLoading(false);
                            setMoneyAfter(formatCurrency(Math.abs(feeContent.totalFee - props.totalFeeBefore!)));
                        }}
                        disabled={isSaved}
                    >
                        Quay Lại
                    </Button>,
                    // <Button type="primary" onClick={onSaveCase}>
                    //     Test
                    // </Button>,
                    <Button
                        key="xnhc"
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        className="btn-outline-success"
                        onClick={() => onSaveCorrectingOrder()}
                        disabled={isSaved}
                    >
                        Xác nhận hiệu chỉnh
                    </Button>
                ]}
            >
                <Spin spinning={spinLoading}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>Tổng cước tạm tính trước hiệu chỉnh</Col>
                        <Col span={12}>
                            <Input
                                style={{ textAlign: 'right' }}
                                // disabled
                                addonAfter="VNĐ"
                                readOnly={true}
                                size={'middle'}
                                value={formatCurrency(props.totalFeeBefore)}
                            />
                        </Col>
                        <Col span={12}>Tổng cước tạm tính sau hiệu chỉnh</Col>
                        <Col span={12}>
                            <Input
                                style={{ textAlign: 'right' }}
                                // disabled
                                addonAfter="VNĐ"
                                readOnly={true}
                                size={'middle'}
                                value={formatCurrency(feeContent.totalFee)}
                            />
                        </Col>
                        <Col span={12}>{feeContent.totalFee - props.totalFeeBefore! > 0
                            ? 'Số tiền trả thêm tạm tính'
                            : 'Số tiền nhận lại tạm tính'}</Col>
                        <Col span={12}>
                            <Input
                                style={{ textAlign: 'right' }}
                                // disabled
                                addonAfter="VNĐ"
                                readOnly={true}
                                size={'middle'}
                                value={formatCurrency(
                                    Math.abs(feeContent.totalFee - props.totalFeeBefore!)
                                )}
                            />
                        </Col>
                    </Row>
                </Spin>
            </Modal>
            <PrintOrderForm
                visible={visiblePrintForm}
                setVisible={setVisiblePrintForm}
                mauinDefault={mauinDefault}
                record={orderHdrPrint}
                ref={printRef}
            />
        </FooterToolbar>
    );
};
type Props = {
    correctingOrderStatus?: number;
    totalFeeBefore?: number;
    correctingOrderId?: string;
    form: FormInstance<any>;
    setIsLoading: (loading: boolean) => void;
    orderHdrId?: string;
    resetDefaultOrderTemplate: () => void;
    contractServiceCodes: ContractServiceCode[];
    setOrderTemplateSelected: (value?: OrderTemplateDto) => void,
    isBatch: boolean,
    isInternational?: boolean
};
export default OrderFooter;
