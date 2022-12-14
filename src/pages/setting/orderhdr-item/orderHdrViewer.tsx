import React, { useState, useEffect } from 'react';
import { Button, Modal, Card, Table, Row, Col, Checkbox, Image, Tooltip } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { columnCorrectionHistorys, columnRequetSupport } from './Columns';
import { useModel, useParams } from 'umi';
import {
    BookOutlined, EnvironmentOutlined, UserOutlined, UserSwitchOutlined, ExclamationCircleOutlined,
    ArrowDownOutlined, ArrowUpOutlined, MenuUnfoldOutlined, BorderOuterOutlined, InfoCircleOutlined, PlusCircleOutlined, UserAddOutlined, SearchOutlined, DollarOutlined, ZoomInOutlined, DollarCircleOutlined, ShoppingCartOutlined, HistoryOutlined, InboxOutlined, PhoneOutlined, HighlightOutlined, createFromIconfontCN
} from '@ant-design/icons';
import OrderDetail from "./component/orderDetail/orderDetail"
import CollectionDetail from './component/collectionDetail/collectionDetail';
import VasPropsDetail from './component/vasPropsDetail/vasPropsDetail';
import BarcodeViewer from './component/barCode/barcodeViewer';
import UpLoadImage from './component/upload-picture/upLoadImage';
import CallHistory from './component/call-history/callHistory';
import OrderHistory from './component/order-history/orderHistory';
import CorrectionDetail from '../../manager/correction-manager/correction-info';
import TicketViewDetail from '../../manager/ticket/ticket-detail/ticket-view-detail';
import { useAdministrativeUnitList, useCurrentUser } from '@/core/selectors';
import { formatCurrency } from '@/utils';
import { formatStart0 } from '@/utils/PhoneUtil';
import './style.css';
import EvaluateView from './component/evaluate/evaluateView';
import EvaluateSender from './component/evaluate/evaluateSender';
import { OrderReviewApi } from '@/services/client';

const spanLeft = 6;
const spanRight = 12;
const orderReviewApi = new OrderReviewApi();

const isProd = REACT_APP_ENV === 'prod';

const OrderHdrViewer = (props: any) => {
    const { orderHdr, isLoading, vasPropsDetail, orderColection, feeDetailDto, orderBilling, orderCaseDto, orderMapValueNameDto, getFeeOrderDto, getCollectionDetailDto,
        findById, getListBillingOrderHdrID, getListOrderCase, getMapValueToName } = useModel('orderDetailsList');
    const { ticketList, seachTicket } = useModel('ticketModelList');
    const [feeAndCollection, setFeeAndCollection] = useState<any>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showTableOrderDetail, setShowTableOrderDetail] = useState(false);
    const [showTableHistory, setShowTableHistory] = useState(false);
    const [showTableHelp, setShowTableHelp] = useState(false);
    const [showTableOrderEvaluate, setShowTableOrderEvaluate] = useState(false);
    const [showHistoryCall, setShowHistoryCall] = useState(false);
    const [showModelOrderBilling, setShowModelOrderBilling] = useState(false);
    const [showModelOrderCollection, setShowModelOrderCollection] = useState(false);
    const [showModelVasPropDetail, setShowModelVasPropDetail] = useState(false);
    const [showModelBarcodeViewer, setShowModelBarcodeViewer] = useState(false);
    const [showModelUploadImage, setShowModelUploadImage] = useState(false);
    const [showModelOrderHistory, setShowModelOrderHistory] = useState(false);
    const [ShowModelEvaluate, setShowModelEvaluate] = useState(false);
    //Xem chi ti???t hi???u ch???nh
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [recordDetail, setRecordDetail] = useState<any>();
    //Xem chi ti???t ticket
    const [showTicketViewDetail, setShowTicketViewDetail] = useState<boolean>(false);
    const [ticketDetail, setTicketDetail] = useState<any>({});

    const [type, setType] = useState("DHNHAN");
    const [isExtend, setIsExtend] = useState(1);

    const administrativeUnitList = useAdministrativeUnitList();

    const [isDisabledReviewParent, setDisabledReviewParent] = useState(false);
    const currentUser = useCurrentUser();

    const params: any = useParams();
    const id = params.id;
    // const id = "48f4ee25cedd438fb0a6bde4a7465959";

    const IconFont = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
    });

    useEffect(() => {
        console.log(id);
        if (id) {
            findById(id);
            getListBillingOrderHdrID(id);
        }
    }, [])

    // console.log("orderHdr", orderHdr);

    useEffect(() => {
        if (orderHdr) {
            getFeeOrderDto(orderHdr?.originalId || "", orderHdr?.status || -1, false);
            getCollectionDetailDto(orderHdr?.originalId || "");
            // if (currentUser.org != orderHdr?.orgCode) {
            //     setDisabledReviewParent(true);
            // } else {
            //     setDisabledReviewParent(false);
            // }

            if (orderHdr.sendType === '1' && (currentUser.org === orderHdr?.senderCode) && currentUser.uid === currentUser.owner) {
                setDisabledReviewParent(false);
            } else if (orderHdr.sendType === '2' && (currentUser.org === orderHdr?.senderCode) && orderHdr.status! >= 14 && currentUser.uid === currentUser.owner) {
                setDisabledReviewParent(false);
            } else {
                setDisabledReviewParent(true);
            }

        }
        // set tr???ng th??i ????n h??ng:
        if (orderHdr && orderHdr?.status == 0) {
            setType("DHNHAP");
        } else {
            setType("DHNHAN");
        }
    }, [orderHdr])

    useEffect(() => {

        console.log("type: ", type);
        let fee = 0, feeActual = 0;
        orderBilling.forEach((row: any) => {
            fee += row.fee ? row.fee : 0;
            feeActual += row.feeActual ? row.feeActual : 0;
        })
        setFeeAndCollection({ "fee": fee, "feeActual": feeActual });
        // const newDataTableContent: any[] = [];
    }, [orderHdr, orderBilling])

    useEffect(() => {
        if (showModelOrderBilling || showDetail || showModelOrderCollection || showTicketViewDetail || showModelVasPropDetail || showModelOrderHistory) {
            document.body.style.overflow = 'unset';
            console.log(1);
        } else {
            console.log(0);
            document.body.style.overflow = 'visible';
        }
    }, [showModelOrderBilling, showDetail, showModelOrderCollection, showTicketViewDetail, showModelVasPropDetail, showModelOrderHistory]);

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columntCustom = [
        {
            title: "STT",
            dataIndex: "stt",
            render: (item: any, record: any, index: number) => (<>{index + 1}</>)
        },
        { title: "S???n ph???m", dataIndex: "nameVi" },
        {
            title: "Kh???i l?????ng(gram)",
            dataIndex: "weight",
            render: (item: any, record: any) => (<p style={{ textAlign: 'right', margin: 'auto' }}>{record?.weight ? formatCurrency(record?.weight) : ''}</p>)
        },
        {
            title: "S??? l?????ng",
            dataIndex: "quantity",
            render: (item: any, record: any) => (<p style={{ textAlign: 'right', margin: 'auto' }}>{record?.quantity ? formatCurrency(record?.quantity) : ''}</p>)
        },
        {
            title: 'H??nh ???nh',
            dataIndex: 'image',
            width: 100,
            maxWidth: 100,
            render: (t: any, r: any) =>
                <>  {r.image ?
                    <>
                        <Image
                            preview={{ visible: false }}
                            width={100}
                            src={r.image}
                            onClick={() => setIsModalVisible(true)}
                        />
                        <Modal title="Xem ???nh" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
                            <img alt="example" style={{ width: '100%' }} src={`${r.image}`} />
                        </Modal>
                    </>
                    : null
                }
                </>
        }
    ]

    const onChangeAddService = (value: number) => {
        setIsExtend(value);
        setShowModelVasPropDetail(true);
    }
    //Hi???n th??? m??n h??nh l???ch s??? hi???u ch???nh
    const showHistoryCase = () => {
        if (!showTableHistory == true) {
            getListOrderCase(orderHdr?.itemCode ? orderHdr?.itemCode : "");
        }
        setShowTableHistory(!showTableHistory)
    }

    //Hi???n th??? table m??n h??nh h??? tr???
    const showRequetSupport = () => {
        if (!showTableHelp == true) {
            const param = {
                // accntCode : user?.uid,
                parcelId: orderHdr?.itemCode ? orderHdr?.itemCode : null, //EM990000244VN
            }
            seachTicket(param);
        }
        setShowTableHelp(!showTableHelp)
    };

    //Hi???n th??? table ????nh gi?? ????n h??ng
    const showOrderEvaluate = () => {
        setShowTableOrderEvaluate(!showTableOrderEvaluate)
    }

    //Chi tiet cuoc
    function sumCollection(groupType: number, key: string) {
        let sum = 0;
        orderColection.forEach((item) => {
            if (item?.groupType == groupType) {
                sum += item[key];
            }
        })
        return sum;
    }

    //D???ch v??? chuy???n ph??t Delivery service
    function onDeliveryService() {
        let delivery = "";
        if (orderHdr?.source == 'MYVNP') {
            delivery = orderHdr?.mailServiceGroupName || "";
        } else {
            if (orderHdr?.itemCode?.startsWith("E")) {
                delivery = "T??i li???u/ h??ng ho?? nhanh"
            }
            if (orderHdr?.itemCode?.startsWith("C")) {
                delivery = "T??i li???u/ h??ng ho?? ti??u chu???n"
            }
            if (orderHdr?.itemCode?.startsWith("P")) {
                delivery = "H??ng n???ng"
            }
            if (orderHdr?.itemCode?.startsWith("R")) {
                delivery = "T??i li???u/ h??ng ho?? ti??u chu???n"
            }
        }
        return delivery;
    }


    //Xem chi ti???t l???ch s??? hi???u ch???nh
    const action = (caseId: any, record: any) => {
        setShowDetail(!showDetail);
        setRecordDetail(record);
    }

    const columnCorrectionHistorysTable: any[] = columnCorrectionHistorys(action);

    //Xem chi ti???t ticket
    const actionTicketSupport = (record: any) => {
        setShowTicketViewDetail(!showTicketViewDetail);
        setTicketDetail(record);
    }
    const columnRequetSupportTable: any[] = columnRequetSupport(actionTicketSupport);

    //Xem chi ti???t t???ng c?????c
    const onShowModelOrderBilling = (isOpenPopup: boolean) => {
        setShowModelOrderBilling(isOpenPopup);
    }
    //Xem chi ti???t ti???n thu h???
    const onShowModelOrderCollection = (isOpenPopup: boolean) => {
        setShowModelOrderCollection(isOpenPopup);
    }

    const onClickMenu = () => {
        history.back();
    }

    //B???m v??o n??t ????nh gi??
    const onShowModelEvaluate = (isOpenPopup: boolean) => {
        setShowModelEvaluate(isOpenPopup);
    }

    // console.log("orderHdrViewer", orderHdr);

    return (

        <PageContainer title="Chi ti???t v???n ????n"
        // extra={[
        //     <Button style={{ border: 'none' }} className="ant-btn-setting-account button:disabled:hover" key='ticket' onClick={() => onClickMenu()}><span><p>Quay l???i</p></span></Button>,
        // ]}
        >
            <Row gutter={[8, 8]}>
                <Col span={12} >
                    <Card
                        extra={
                            // orderHdr?.status != 0 && (orderHdr?.senderCode === currentUser.org || orderHdr?.receiverCode === currentUser.uid) ? 
                            !isProd && orderHdr?.status != 0 &&
                            <Button
                                className='btn-outline-warning'
                                id='dialog'
                                onClick={() => onShowModelEvaluate(true)}
                                title={'????nh gi??'}
                                disabled={isDisabledReviewParent}
                            >
                                ????nh gi??
                            </Button>
                        }
                        size='small' bordered={false} title={<div > <PlusCircleOutlined /> ????n h??ng</div>} style={{ width: "100%", height: "100%" }} >
                        <table id="custom-table-orderhdr-sender">
                            {orderHdr?.orgCode ? <tr>
                                <th> M?? ????n h??ng: </th>
                                <td> {orderHdr?.saleOrderCode}</td>
                            </tr> : null}
                            {orderHdr?.itemCode ? <tr>
                                <th> M?? v???n ????n: </th>
                                <td> {orderHdr?.itemCode}</td>
                                <td>{orderHdr?.itemCode != orderHdr?.originalItemCode ? '(V???n ????n g???c:' + orderHdr?.originalItemCode + ')' : ''} </td>
                            </tr> : null}
                            {orderHdr?.batchCode ? <tr >
                                <th> L?? v???n ????n: </th>
                                <td> {orderHdr?.batchCode}</td>
                            </tr> : null}
                            {orderHdr?.createdDate ? <tr >
                                <th> Ng??y t???o: </th>
                                <td> {orderHdr?.createdDate}</td>
                            </tr> : null}
                            {orderHdr?.createdBy ? <tr >
                                <th>Ng?????i t???o: </th>
                                <td>
                                    {orderHdr?.createdByName}
                                </td>
                            </tr> : null}
                            {orderHdr?.status ? <tr>
                                <th>Tr???ng th??i: </th>
                                <td >
                                    {orderHdr?.statusName}
                                    {/* {orderMapValueNameDto.find((item) => { return item.key == "STATUS" })?.lable} */}
                                </td>
                                <Button
                                    style={{ border: 'none' }}
                                    icon={<EnvironmentOutlined />}
                                    onClick={() => setShowModelOrderHistory(true)}
                                >
                                    <span className='span-font'>Xem h??nh tr??nh</span>
                                </Button>
                            </tr> : null}
                            {showModelOrderHistory && (<OrderHistory
                                isOpenPopup={showModelOrderHistory}
                                setIsOpenPopup={setShowModelOrderHistory}
                                type={"1"}
                                itemCode={orderHdr?.itemCode || ''} />)}

                            {orderHdr?.senderContractNumber ? <tr >
                                <th>H???p ?????ng: </th>
                                <td> {orderHdr?.senderContractNumber}</td>
                            </tr> : null}
                            {orderHdr?.receiverContractNumber && <tr>
                                <th>H???p ?????ng C: </th>
                                <td> {orderHdr?.receiverContractNumber}</td>
                            </tr>}

                            {/* <tr >
                                <th>S??? ti???n khai gi??: </td>
                                <td> {formatCurrency(parseInt(onValuePROP0026()))}</td>
                            </tr> */}

                            <tr >
                                <th>D???ch v??? chuy???n ph??t: </th>
                                <td> {onDeliveryService()}
                                    {orderHdr?.originalMailServiceGroupName != null && orderHdr?.originalMailServiceGroupName != "" ?
                                        <>
                                            <p></p>
                                            (D???ch v??? g???c:  {onDeliveryService()} )
                                        </>
                                        : null}
                                </td>
                            </tr>
                            <tr >
                                <th>D???ch v??? c???ng th??m: </th>
                                <td>{orderHdr?.vasNameService}</td>
                                {/* <td> {vasPropsDetail.filter((item) => { return item.isExtend == 0 && item.stt == 1 }).map((element) => { return element.vaServiceName + ', ' })} </td> */}
                                <td style={{ float: 'right', border: 'none' }}>
                                    <Button
                                        icon={<BorderOuterOutlined />}
                                        onClick={() => onChangeAddService(0)}
                                    />
                                </td>
                            </tr>
                            {showModelVasPropDetail && (<VasPropsDetail isOpenPopup={showModelVasPropDetail} setIsOpenPopup={setShowModelVasPropDetail} orderHdrid={id} isExtend={isExtend} />)}

                        </table>
                    </Card>
                </Col>

                <Col span={12}>
                    <Row gutter={[8, 8]}>
                        <Col span={24}>
                            <Card size='small' bordered={false} title={<div><UserOutlined /> Ng?????i g???i </div>} style={{ width: "100%", height: "100%" }}>
                                <table id="custom-table-orderhdr-sender">
                                    <tr >
                                        <th>H??? v?? t??n   </th>
                                        <td> {orderHdr?.senderName} </td>
                                    </tr>
                                    <tr>
                                        <th>S??? ??i???n tho???i  </th>
                                        <td> {formatStart0(orderHdr?.senderPhone)} </td>


                                    </tr>
                                    <tr>
                                        <th>?????a ch??? </th>
                                        <td> {orderHdr?.senderAddress}</td>
                                    </tr>
                                    <tr>
                                        <td />
                                        <td>
                                            {administrativeUnitList.administrativeUnitList.find((item) => { return item.code == orderHdr?.senderCommuneCode })?.name}
                                            , {administrativeUnitList.administrativeUnitList.find((item) => { return item.code == orderHdr?.senderDistrictCode })?.name}
                                            , {administrativeUnitList.administrativeUnitList.find((item) => { return item.code == orderHdr?.senderProvinceCode })?.name}
                                        </td>
                                        {/*SENDER_ADDRESS + SENDER_COMMUNE_CODE + SENDER_DISTRICT_CODE + SENDER_PROVINCE_CODE   */}
                                    </tr>
                                </table>
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card size='small' bordered={false} title={<div><UserAddOutlined /> Ng?????i nh???n</div>} style={{ width: "100%", height: "100%" }}>
                                <table id="custom-table-orderhdr-sender">
                                    <tr >
                                        <th>H??? v?? t??n   </th>
                                        <td> {orderHdr?.receiverName} </td>
                                    </tr>
                                    <tr >
                                        <th>S??? ??i???n tho???i  </th>
                                        <td> {formatStart0(orderHdr?.receiverPhone)} </td>
                                    </tr>
                                    <tr>
                                        <th>?????a ch???  </th>
                                        <td> {orderHdr?.receiverAddress}</td>
                                    </tr>
                                    <tr>
                                        <th />
                                        <td>
                                            {administrativeUnitList.administrativeUnitList.find((item) => { return item.code == orderHdr?.receiverCommuneCode })?.name}
                                            , {administrativeUnitList.administrativeUnitList.find((item) => { return item.code == orderHdr?.receiverDistrictCode })?.name}
                                            , {administrativeUnitList.administrativeUnitList.find((item) => { return item.code == orderHdr?.receiverProvinceCode })?.name}
                                        </td>
                                        {/* RECEIVER_ADDRESS  RECEIVER_COMMUNE_CODE + RECEIVER_DISTRICT_CODE + RECEIVER_PROVINCE_CODE  */}
                                    </tr>
                                </table>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Row gutter={[8, 8]}>
                        <Col span={24}>
                            <Card size='small' bordered={false} title={<div><SearchOutlined /> Th??ng tin h??ng h??a</div>} style={{ width: "100%", height: "100%" }}>
                                <table id="custom-table-orderhdr-sender">
                                    <tr>
                                        <th>N???i dung h??ng: </th>
                                        <td> {orderHdr?.contentNote}</td>
                                    </tr>
                                    <tr>
                                        <th>Kh???i l?????ng/ Th???c t???(gram): </th>
                                        <td> {orderHdr?.weightProvisional ? formatCurrency(orderHdr?.weightProvisional) : '0'}{orderHdr?.weightReality ? ' / ' + formatCurrency(orderHdr?.weightReality) : ' / 0'} </td>
                                    </tr>
                                    <tr>
                                        <th>K??ch th?????c/ Th???c t???(cm): </th>
                                        <td>{orderHdr?.sizeProvisional ? orderHdr?.sizeProvisional : ''} / {orderHdr?.sizeReality ? orderHdr?.sizeReality : '0'} </td>
                                        {/* <td>{orderHdr?.length ? orderHdr?.length : '0'} * {orderHdr?.width ? orderHdr?.width : '0'} * {orderHdr?.height ? orderHdr?.height : '0'} / {orderHdr?.lengthActual ? orderHdr?.lengthActual : '0'} * {orderHdr?.widthActual ? orderHdr?.widthActual : '0'} * {orderHdr?.heightActual ? orderHdr?.heightActual : '0'}</td> */}
                                    </tr>
                                    {orderHdr?.isBroken && <tr><td style={{ width: '35%', fontWeight: 'bold' }}><span style={{ color: '#eb2a2a' }}>*</span> H??ng d??? v???</td></tr>}
                                </table>
                            </Card>
                        </Col>
                        <Col span={24}>
                            {type == "DHNHAN" ?
                                <Card
                                    extra={<Button
                                        icon={<BorderOuterOutlined />}
                                        onClick={() => onChangeAddService(1)}
                                    />}
                                    size='small' bordered={false} title={<div ><ZoomInOutlined /> Y??u c???u th??m</div>} style={{ width: "100%", height: "277px" }}>
                                    <table id="custom-table-orderhdr-sender">
                                        <tr>
                                            <th>Y??u c???u b??? sung:</th>
                                            <td>{orderHdr?.vasNameRequest} </td>
                                        </tr>
                                        {orderHdr?.sendType ?
                                            <tr>
                                                <th>H??nh th???c g???i h??ng: </th>
                                                <td> {orderHdr?.sendType ? orderHdr!.sendType == "1" ? "Thu gom t???n n??i" : "G???i h??ng t???i b??u c???c" : ""}</td>
                                            </tr>
                                            : null}
                                        {/* <tr>
                                    <th>Ca thu gom: </td>
                                    <td> {orderHdr?.shiftCodeCollect == "C" ? "Chi???u(13-17h)" : orderHdr?.shiftCodeCollect == "S" ? "S??ng (8-12h)" : "C??? ng??y(8-12h, 13-17h)"}</td>
                                </tr>
                                <tr>
                                    <th>Ng??y thu gom: </td>
                                    <td> {orderHdr?.collectionDate}</td>
                                </tr> */}
                                        {orderHdr?.deliveryRequire && <tr>
                                            <th>Y??u c???u khi ph??t h??ng: </th>
                                            <td> {orderHdr?.deliveryRequire == '1' ? "Kh??ng cho xem h??ng" : orderHdr?.deliveryRequire == '2' ? "Cho xem h??ng" : ""}</td>
                                        </tr>}
                                        {orderHdr?.deliveryTime && <tr>
                                            <th>Th???i gian ph??t h??ng mong mu???n: </th>
                                            <td> {orderHdr?.deliveryTime == "S" ? "S??ng (8-12h)" : orderHdr?.deliveryTime == "C" ? "Chi???u(13-17h)" : "C??? ng??y(8-12h, 13-17h)"}</td>
                                        </tr>}
                                        {orderHdr?.deliveryInstruction && <tr>
                                            <th>Y??u c???u kh??c: </th>
                                            <td> {orderHdr?.deliveryInstruction}</td>
                                        </tr>}
                                    </table>
                                </Card>
                                : null}
                        </Col>
                    </Row>
                </Col>

                {type == "DHNHAN" ?
                    <Col span={12}>
                        <Row gutter={[8, 8]}>
                            <Col span={24}>
                                <Card
                                    extra={<Button
                                        id='dialog'
                                        icon={<MenuUnfoldOutlined />}
                                        onClick={() => onShowModelOrderBilling(true)}
                                        title={'Chi ti???t c?????c'} />}
                                    size='small' bordered={false} title={<div><DollarOutlined /> C?????c ph??</div>} style={{ width: "100%", height: "100%" }}>
                                    <table id="custom-table-orderhdr-sender">
                                        <tr>
                                            <th>

                                            </th>
                                            <th style={{ textAlign: 'center' }}>T???m t??nh</th>
                                            <th style={{ textAlign: 'center' }}>Th???c t???</th>
                                        </tr>
                                        <tr>
                                            <th>T???ng c?????c</th>
                                            <th>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 4 })?.fee || 0)}
                                                </div>
                                            </th>
                                            <th>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 4 })?.feeActual || 0) + " ??"}
                                                </div>

                                            </th>
                                            {orderHdr?.batchCode != null ?
                                                <td>
                                                    <Tooltip title="C?????c c??? l??">
                                                        <ExclamationCircleOutlined />
                                                    </Tooltip>
                                                </td>
                                                : null}
                                        </tr>
                                        <tr>
                                            <td style={{ paddingLeft: '30px' }}>- C?????c ch??nh</td>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 1 })?.fee || 0)}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 1 })?.feeActual || 0) + " ??"}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '35%', paddingLeft: '30px' }}>- D???ch v??? c???ng th??m:</td>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 2 })?.fee || 0)}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 2 })?.feeActual || 0) + " ??"}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>

                                            <td style={{ width: '35%', paddingLeft: '30px' }}    >- Y??u c???u b??? sung:</td>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 3 })?.fee || 0)}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 3 })?.feeActual || 0) + " ??"}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontStyle: 'italic' }}> {orderHdr?.isContractC == true ? "(Ng?????i nh???n tr???)" : "(Ng?????i g???i tr???)"} </td>
                                        </tr>
                                        <p style={{ fontSize: '12px', fontStyle: 'italic', color: "blue" }}>  &nbsp; {orderHdr?.batchCode ? <div><InfoCircleOutlined /> Gi?? c?????c th???c t??? ??ang hi???n th??? l?? c?????c c??? l??</div> : null}</p>


                                        {/* <tr>

                                    <td style={{ width: '35%', paddingLeft: '30px' }}>- Ti???n thu h??? kh??c</td>
                                    <th>{formatCurrency(sumCollection(2, "propValue"))}</td>
                                    <td> {formatCurrency(sumCollection(2, "propValueActual")) + " ??"}</td>
                                </tr> */}

                                        {/* ShowModelEvaluate b???ng true th?? b???t form ????nh gi??, b???m v??o n??t ????nh gi?? ??? card ????n h??ng */}
                                        {ShowModelEvaluate && (<EvaluateSender isOpenPopup={ShowModelEvaluate}
                                            setIsOpenPopup={onShowModelEvaluate}
                                            status={orderHdr!.status}
                                            itemCode={orderHdr?.itemCode}
                                            sendType={orderHdr?.sendType}
                                            // senderName={orderHdr?.senderName}
                                            // senderPhone={orderHdr?.senderPhone}
                                            originalId={orderHdr?.originalId}
                                        />)
                                        }
                                        {showModelOrderBilling && (<OrderDetail isOpenPopup={showModelOrderBilling} setIsOpenPopup={onShowModelOrderBilling} originalId={orderHdr?.originalId || ""} status={orderHdr?.status || -1} />)}
                                        {showModelOrderCollection && (<CollectionDetail isOpenPopup={showModelOrderCollection} setIsOpenPopup={onShowModelOrderCollection} originalId={orderHdr?.originalId || ""} />)}
                                        {showModelBarcodeViewer && (<BarcodeViewer isOpenPopup={showModelBarcodeViewer} setIsOpenPopup={setShowModelBarcodeViewer} itemCode={id} />)}
                                        {showModelUploadImage && (<UpLoadImage isOpenPopup={showModelUploadImage} setIsOpenPopup={setShowModelUploadImage} id={id} />)}
                                        {showDetail && (
                                            <CorrectionDetail
                                                visible={showDetail}
                                                setVisible={setShowDetail}
                                                record={recordDetail}
                                            />
                                        )}
                                        {showTicketViewDetail && (
                                            <TicketViewDetail
                                                isOpenPopup={showTicketViewDetail}
                                                setIsOpenPopup={setShowTicketViewDetail}
                                                ticketDetail={ticketDetail}
                                            />
                                        )}

                                    </table>
                                </Card>
                            </Col>
                            <Col span={24}>
                                <Card
                                    extra={<Button
                                        icon={<MenuUnfoldOutlined />}
                                        onClick={() => onShowModelOrderCollection(true)}
                                        title={'Xem c?????c c??c d???ch v???'} />}
                                    size='small' bordered={false} title={<div><DollarCircleOutlined /> Ti???n thu h???</div>} style={{ width: "100%", height: "100%" }}>
                                    <table id="custom-table-orderhdr-sender">
                                        <tr style={{ fontWeight: 'bold' }}>
                                            <th>

                                            </th>
                                            <td style={{ width: '35%', textAlign: 'center' }}>Nh??? thu</td>
                                            <td style={{ textAlign: 'center' }}>Th???c thu</td>
                                        </tr>

                                        <tr style={{ fontWeight: 'bold' }}>
                                            <td >T???ng ti???n thu h???</td>
                                            <th>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(orderColection.find((item) => { return item.stt == 2 })?.propValue || 0)}
                                                    {/* {JSON.stringify(orderColection)} */}
                                                </div>
                                            </th>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>{formatCurrency(orderColection.find((item) => { return item.stt == 2 })?.propValueActual || 0) + " ??"}</div>
                                            </td>
                                        </tr >

                                        {
                                            orderColection?.map((item: any, index: number) => {
                                                if (item.groupType != null && item.groupTypeName != null) {
                                                    return (
                                                        <tr key={index} >
                                                            <td style={{ paddingLeft: '30px' }}> - {item?.groupTypeName}

                                                            </td>
                                                            <td >
                                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>{formatCurrency(sumCollection(item?.groupType, "propValue"))}</div>
                                                            </td>
                                                            <td>
                                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>{formatCurrency(sumCollection(item?.groupType, "propValueActual")) + " ??"}</div>
                                                            </td>
                                                            {item.groupType != 2 && orderHdr?.batchCode != null ?
                                                                <td>
                                                                    <Tooltip title={item?.groupTypeName + " c??? l??"} >
                                                                        <ExclamationCircleOutlined />
                                                                    </Tooltip>
                                                                </td>
                                                                : null}
                                                            {item.groupType == 2 && orderHdr?.amountForBatch == true ?
                                                                <td >
                                                                    <Tooltip title={item?.groupTypeName + " c??? l??"} >
                                                                        <ExclamationCircleOutlined />
                                                                    </Tooltip>
                                                                </td>
                                                                : null}
                                                        </tr>

                                                    )
                                                } else {
                                                    return null;
                                                }
                                            })
                                        }
                                    </table>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    :
                    <Col span={12}>
                        <Card size='small' bordered={false} title={<div><ZoomInOutlined /> Y??u c???u th??m</div>} style={{ width: "100%", height: "100%" }}>
                            <table id="custom-table-orderhdr-sender">
                                <tr>
                                    <th>Y??u c???u b??? sung:</th>
                                    <td>{orderHdr?.vasNameRequest} </td>
                                    <td>
                                        <Button
                                            icon={<BorderOuterOutlined />}
                                            onClick={() => onChangeAddService(1)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>H??nh th???c g???i h??ng:</th>
                                    <td>{orderHdr?.sendType ? orderHdr!.sendType == "1" ? "Thu gom t???n n??i" : "G???i h??ng t???i b??u c???c" : ""}</td>
                                </tr>
                                {/* <tr>
                                    <th>Ca thu gom:</th>
                                    <td>{orderHdr?.shiftCodeCollect == "C" ? "Chi???u(13-17h)" : orderHdr?.shiftCodeCollect == "S" ? "S??ng (8-12h)" : "C??? ng??y(8-12h, 13-17h)"}</td>
                                </tr>
                                <tr>
                                    <th>Ng??y thu gom:</th>
                                    <td>{orderHdr?.collectionDate}</td>
                                </tr> */}
                                <tr>
                                    <th>Y??u c???u khi ph??t h??ng:</th>
                                    <td>{orderHdr?.deliveryRequire ? orderHdr?.deliveryRequire == '1' ? "Kh??ng cho xem h??ng" : "Cho xem h??ng" : ""}</td>
                                </tr>
                                <tr>
                                    <th>Th???i gian ph??t h??ng mong mu???n:</th>
                                    <td>{orderHdr?.deliveryTime ? orderHdr?.deliveryTime == "S" ? "S??ng (8-12h)" : orderHdr?.deliveryTime == "C" ? "Chi???u(13-17h)" : "C??? ng??y(8-12h, 13-17h)" : ""}</td>
                                </tr>
                                <tr >
                                    <th>Y??u c???u kh??c:</th>
                                    <td>{orderHdr?.deliveryInstruction}</td>
                                </tr>
                            </table>
                        </Card>
                    </Col>
                }

                <Col span={24}>
                    <Card size='small' bordered={false} className="fadeInRight" title={<div><ShoppingCartOutlined /> Chi ti???t h??ng h??a</div>}
                        extra={<Button
                            icon={showTableOrderDetail ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            onClick={() => setShowTableOrderDetail(!showTableOrderDetail)} />}>
                        {showTableOrderDetail ?
                            <Table
                                size='small'
                                dataSource={orderHdr?.orderContents}
                                columns={columntCustom}
                                bordered
                                rowKey="stt"
                            />
                            : null}
                    </Card>
                </Col>
                <Col span={24}>
                    {type == "DHNHAN" ?
                        <Card size='small' bordered={false} className="fadeInRight" title={<div><HistoryOutlined /> L???ch s??? hi???u ch???nh</div>}
                            extra={<Button
                                icon={showTableHistory ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                onClick={showHistoryCase} />}>
                            {showTableHistory ?
                                <Table
                                    size='small'
                                    dataSource={orderCaseDto}
                                    columns={columnCorrectionHistorysTable}
                                    bordered
                                    rowKey="stt"
                                /> : null}
                        </Card> : null}
                </Col>
                <Col span={24}>
                    {type == "DHNHAN" ?
                        <Card size='small' bordered={false} className="fadeInRight" title={<div><InboxOutlined /> Y??u c???u h??? tr???</div>}
                            extra={<Button
                                icon={showTableHelp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                onClick={showRequetSupport} />}>
                            {showTableHelp ?
                                <Table
                                    size='small'
                                    dataSource={ticketList}
                                    columns={columnRequetSupportTable}
                                    bordered
                                    rowKey="ttkCode"
                                /> : null}
                        </Card>
                        : null}
                </Col>

                {!isProd &&
                    <Col span={24}>
                        <Card size='small' bordered={false} className="fadeInRight" title={<div><HighlightOutlined /> ????nh gi?? ????n h??ng</div>}
                            extra={<Button
                                icon={showTableOrderEvaluate ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                onClick={showOrderEvaluate} />}>
                            {
                                //Add th??m d??? li???u tr??? ra ???? l??u g???m: Danh s??ch ????nh gi?? ng??i sao, Danh s??ch checkbox ti??u ch?? ????nh gi??, ?? ki???n ????ng g??p
                                showTableOrderEvaluate && <EvaluateView isOpenPopup={ShowModelEvaluate}
                                    setIsOpenPopup={onShowModelEvaluate}
                                    status={orderHdr!.status}
                                    itemCode={orderHdr?.itemCode}
                                    sendType={orderHdr?.sendType}
                                    // senderName={orderHdr?.senderName}
                                    // senderPhone={orderHdr?.senderPhone}
                                    originalId={orderHdr?.originalId}
                                />

                            }
                        </Card>
                    </Col>
                }

                <Col span={24}>
                    {type == "DHNHAN" ?
                        <Card size='small' bordered={false} className="fadeInRight" title={<div><PhoneOutlined /> L???ch s??? cu???c g???i</div>}
                            extra={<Button
                                icon={showHistoryCall ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                onClick={() => setShowHistoryCall(!showHistoryCall)} />} >
                            {showHistoryCall ? <CallHistory itemCode={orderHdr!.itemCode || ""} /> : null}
                            {/* {showHistoryCall ? <CallHistory itemCode="EB475090500VN" /> : null} */}
                        </Card>
                        : null}
                </Col>
            </Row>
        </PageContainer>
    )
}
export default OrderHdrViewer;