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
    //Xem chi tiết hiệu chỉnh
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [recordDetail, setRecordDetail] = useState<any>();
    //Xem chi tiết ticket
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
        // set trạng thái đơn hàng:
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
        { title: "Sản phẩm", dataIndex: "nameVi" },
        {
            title: "Khối lượng(gram)",
            dataIndex: "weight",
            render: (item: any, record: any) => (<p style={{ textAlign: 'right', margin: 'auto' }}>{record?.weight ? formatCurrency(record?.weight) : ''}</p>)
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            render: (item: any, record: any) => (<p style={{ textAlign: 'right', margin: 'auto' }}>{record?.quantity ? formatCurrency(record?.quantity) : ''}</p>)
        },
        {
            title: 'Hình ảnh',
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
                        <Modal title="Xem ảnh" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
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
    //Hiển thị màn hình lịch sử hiệu chỉnh
    const showHistoryCase = () => {
        if (!showTableHistory == true) {
            getListOrderCase(orderHdr?.itemCode ? orderHdr?.itemCode : "");
        }
        setShowTableHistory(!showTableHistory)
    }

    //Hiển thị table màn hình hỗ trợ
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

    //Hiển thị table đánh giá đơn hàng
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

    //Dịch vụ chuyển phát Delivery service
    function onDeliveryService() {
        let delivery = "";
        if (orderHdr?.source == 'MYVNP') {
            delivery = orderHdr?.mailServiceGroupName || "";
        } else {
            if (orderHdr?.itemCode?.startsWith("E")) {
                delivery = "Tài liệu/ hàng hoá nhanh"
            }
            if (orderHdr?.itemCode?.startsWith("C")) {
                delivery = "Tài liệu/ hàng hoá tiêu chuẩn"
            }
            if (orderHdr?.itemCode?.startsWith("P")) {
                delivery = "Hàng nặng"
            }
            if (orderHdr?.itemCode?.startsWith("R")) {
                delivery = "Tài liệu/ hàng hoá tiêu chuẩn"
            }
        }
        return delivery;
    }


    //Xem chi tiết lịch sử hiệu chỉnh
    const action = (caseId: any, record: any) => {
        setShowDetail(!showDetail);
        setRecordDetail(record);
    }

    const columnCorrectionHistorysTable: any[] = columnCorrectionHistorys(action);

    //Xem chi tiết ticket
    const actionTicketSupport = (record: any) => {
        setShowTicketViewDetail(!showTicketViewDetail);
        setTicketDetail(record);
    }
    const columnRequetSupportTable: any[] = columnRequetSupport(actionTicketSupport);

    //Xem chi tiết tổng cước
    const onShowModelOrderBilling = (isOpenPopup: boolean) => {
        setShowModelOrderBilling(isOpenPopup);
    }
    //Xem chi tiết tiền thu hộ
    const onShowModelOrderCollection = (isOpenPopup: boolean) => {
        setShowModelOrderCollection(isOpenPopup);
    }

    const onClickMenu = () => {
        history.back();
    }

    //Bấm vào nút Đánh giá
    const onShowModelEvaluate = (isOpenPopup: boolean) => {
        setShowModelEvaluate(isOpenPopup);
    }

    // console.log("orderHdrViewer", orderHdr);

    return (

        <PageContainer title="Chi tiết vận đơn"
        // extra={[
        //     <Button style={{ border: 'none' }} className="ant-btn-setting-account button:disabled:hover" key='ticket' onClick={() => onClickMenu()}><span><p>Quay lại</p></span></Button>,
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
                                title={'Đánh giá'}
                                disabled={isDisabledReviewParent}
                            >
                                Đánh giá
                            </Button>
                        }
                        size='small' bordered={false} title={<div > <PlusCircleOutlined /> Đơn hàng</div>} style={{ width: "100%", height: "100%" }} >
                        <table id="custom-table-orderhdr-sender">
                            {orderHdr?.orgCode ? <tr>
                                <th> Mã đơn hàng: </th>
                                <td> {orderHdr?.saleOrderCode}</td>
                            </tr> : null}
                            {orderHdr?.itemCode ? <tr>
                                <th> Mã vận đơn: </th>
                                <td> {orderHdr?.itemCode}</td>
                                <td>{orderHdr?.itemCode != orderHdr?.originalItemCode ? '(Vận đơn gốc:' + orderHdr?.originalItemCode + ')' : ''} </td>
                            </tr> : null}
                            {orderHdr?.batchCode ? <tr >
                                <th> Lô vận đơn: </th>
                                <td> {orderHdr?.batchCode}</td>
                            </tr> : null}
                            {orderHdr?.createdDate ? <tr >
                                <th> Ngày tạo: </th>
                                <td> {orderHdr?.createdDate}</td>
                            </tr> : null}
                            {orderHdr?.createdBy ? <tr >
                                <th>Người tạo: </th>
                                <td>
                                    {orderHdr?.createdByName}
                                </td>
                            </tr> : null}
                            {orderHdr?.status ? <tr>
                                <th>Trạng thái: </th>
                                <td >
                                    {orderHdr?.statusName}
                                    {/* {orderMapValueNameDto.find((item) => { return item.key == "STATUS" })?.lable} */}
                                </td>
                                <Button
                                    style={{ border: 'none' }}
                                    icon={<EnvironmentOutlined />}
                                    onClick={() => setShowModelOrderHistory(true)}
                                >
                                    <span className='span-font'>Xem hành trình</span>
                                </Button>
                            </tr> : null}
                            {showModelOrderHistory && (<OrderHistory
                                isOpenPopup={showModelOrderHistory}
                                setIsOpenPopup={setShowModelOrderHistory}
                                type={"1"}
                                itemCode={orderHdr?.itemCode || ''} />)}

                            {orderHdr?.senderContractNumber ? <tr >
                                <th>Hợp đồng: </th>
                                <td> {orderHdr?.senderContractNumber}</td>
                            </tr> : null}
                            {orderHdr?.receiverContractNumber && <tr>
                                <th>Hợp đồng C: </th>
                                <td> {orderHdr?.receiverContractNumber}</td>
                            </tr>}

                            {/* <tr >
                                <th>Số tiền khai giá: </td>
                                <td> {formatCurrency(parseInt(onValuePROP0026()))}</td>
                            </tr> */}

                            <tr >
                                <th>Dịch vụ chuyển phát: </th>
                                <td> {onDeliveryService()}
                                    {orderHdr?.originalMailServiceGroupName != null && orderHdr?.originalMailServiceGroupName != "" ?
                                        <>
                                            <p></p>
                                            (Dịch vụ gốc:  {onDeliveryService()} )
                                        </>
                                        : null}
                                </td>
                            </tr>
                            <tr >
                                <th>Dịch vụ cộng thêm: </th>
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
                            <Card size='small' bordered={false} title={<div><UserOutlined /> Người gửi </div>} style={{ width: "100%", height: "100%" }}>
                                <table id="custom-table-orderhdr-sender">
                                    <tr >
                                        <th>Họ và tên   </th>
                                        <td> {orderHdr?.senderName} </td>
                                    </tr>
                                    <tr>
                                        <th>Số điện thoại  </th>
                                        <td> {formatStart0(orderHdr?.senderPhone)} </td>


                                    </tr>
                                    <tr>
                                        <th>Địa chỉ </th>
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
                            <Card size='small' bordered={false} title={<div><UserAddOutlined /> Người nhận</div>} style={{ width: "100%", height: "100%" }}>
                                <table id="custom-table-orderhdr-sender">
                                    <tr >
                                        <th>Họ và tên   </th>
                                        <td> {orderHdr?.receiverName} </td>
                                    </tr>
                                    <tr >
                                        <th>Số điện thoại  </th>
                                        <td> {formatStart0(orderHdr?.receiverPhone)} </td>
                                    </tr>
                                    <tr>
                                        <th>Địa chỉ  </th>
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
                            <Card size='small' bordered={false} title={<div><SearchOutlined /> Thông tin hàng hóa</div>} style={{ width: "100%", height: "100%" }}>
                                <table id="custom-table-orderhdr-sender">
                                    <tr>
                                        <th>Nội dung hàng: </th>
                                        <td> {orderHdr?.contentNote}</td>
                                    </tr>
                                    <tr>
                                        <th>Khối lượng/ Thực tế(gram): </th>
                                        <td> {orderHdr?.weightProvisional ? formatCurrency(orderHdr?.weightProvisional) : '0'}{orderHdr?.weightReality ? ' / ' + formatCurrency(orderHdr?.weightReality) : ' / 0'} </td>
                                    </tr>
                                    <tr>
                                        <th>Kích thước/ Thực tế(cm): </th>
                                        <td>{orderHdr?.sizeProvisional ? orderHdr?.sizeProvisional : ''} / {orderHdr?.sizeReality ? orderHdr?.sizeReality : '0'} </td>
                                        {/* <td>{orderHdr?.length ? orderHdr?.length : '0'} * {orderHdr?.width ? orderHdr?.width : '0'} * {orderHdr?.height ? orderHdr?.height : '0'} / {orderHdr?.lengthActual ? orderHdr?.lengthActual : '0'} * {orderHdr?.widthActual ? orderHdr?.widthActual : '0'} * {orderHdr?.heightActual ? orderHdr?.heightActual : '0'}</td> */}
                                    </tr>
                                    {orderHdr?.isBroken && <tr><td style={{ width: '35%', fontWeight: 'bold' }}><span style={{ color: '#eb2a2a' }}>*</span> Hàng dễ vỡ</td></tr>}
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
                                    size='small' bordered={false} title={<div ><ZoomInOutlined /> Yêu cầu thêm</div>} style={{ width: "100%", height: "277px" }}>
                                    <table id="custom-table-orderhdr-sender">
                                        <tr>
                                            <th>Yêu cầu bổ sung:</th>
                                            <td>{orderHdr?.vasNameRequest} </td>
                                        </tr>
                                        {orderHdr?.sendType ?
                                            <tr>
                                                <th>Hình thức gửi hàng: </th>
                                                <td> {orderHdr?.sendType ? orderHdr!.sendType == "1" ? "Thu gom tận nơi" : "Gửi hàng tại bưu cục" : ""}</td>
                                            </tr>
                                            : null}
                                        {/* <tr>
                                    <th>Ca thu gom: </td>
                                    <td> {orderHdr?.shiftCodeCollect == "C" ? "Chiều(13-17h)" : orderHdr?.shiftCodeCollect == "S" ? "Sáng (8-12h)" : "Cả ngày(8-12h, 13-17h)"}</td>
                                </tr>
                                <tr>
                                    <th>Ngày thu gom: </td>
                                    <td> {orderHdr?.collectionDate}</td>
                                </tr> */}
                                        {orderHdr?.deliveryRequire && <tr>
                                            <th>Yêu cầu khi phát hàng: </th>
                                            <td> {orderHdr?.deliveryRequire == '1' ? "Không cho xem hàng" : orderHdr?.deliveryRequire == '2' ? "Cho xem hàng" : ""}</td>
                                        </tr>}
                                        {orderHdr?.deliveryTime && <tr>
                                            <th>Thời gian phát hàng mong muốn: </th>
                                            <td> {orderHdr?.deliveryTime == "S" ? "Sáng (8-12h)" : orderHdr?.deliveryTime == "C" ? "Chiều(13-17h)" : "Cả ngày(8-12h, 13-17h)"}</td>
                                        </tr>}
                                        {orderHdr?.deliveryInstruction && <tr>
                                            <th>Yêu cầu khác: </th>
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
                                        title={'Chi tiết cước'} />}
                                    size='small' bordered={false} title={<div><DollarOutlined /> Cước phí</div>} style={{ width: "100%", height: "100%" }}>
                                    <table id="custom-table-orderhdr-sender">
                                        <tr>
                                            <th>

                                            </th>
                                            <th style={{ textAlign: 'center' }}>Tạm tính</th>
                                            <th style={{ textAlign: 'center' }}>Thực tế</th>
                                        </tr>
                                        <tr>
                                            <th>Tổng cước</th>
                                            <th>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 4 })?.fee || 0)}
                                                </div>
                                            </th>
                                            <th>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 4 })?.feeActual || 0) + " đ"}
                                                </div>

                                            </th>
                                            {orderHdr?.batchCode != null ?
                                                <td>
                                                    <Tooltip title="Cước cả lô">
                                                        <ExclamationCircleOutlined />
                                                    </Tooltip>
                                                </td>
                                                : null}
                                        </tr>
                                        <tr>
                                            <td style={{ paddingLeft: '30px' }}>- Cước chính</td>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 1 })?.fee || 0)}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 1 })?.feeActual || 0) + " đ"}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '35%', paddingLeft: '30px' }}>- Dịch vụ cộng thêm:</td>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 2 })?.fee || 0)}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 2 })?.feeActual || 0) + " đ"}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>

                                            <td style={{ width: '35%', paddingLeft: '30px' }}    >- Yêu cầu bổ sung:</td>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 3 })?.fee || 0)}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 3 })?.feeActual || 0) + " đ"}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontStyle: 'italic' }}> {orderHdr?.isContractC == true ? "(Người nhận trả)" : "(Người gửi trả)"} </td>
                                        </tr>
                                        <p style={{ fontSize: '12px', fontStyle: 'italic', color: "blue" }}>  &nbsp; {orderHdr?.batchCode ? <div><InfoCircleOutlined /> Giá cước thực tế đang hiển thị là cước cả lô</div> : null}</p>


                                        {/* <tr>

                                    <td style={{ width: '35%', paddingLeft: '30px' }}>- Tiền thu hộ khác</td>
                                    <th>{formatCurrency(sumCollection(2, "propValue"))}</td>
                                    <td> {formatCurrency(sumCollection(2, "propValueActual")) + " đ"}</td>
                                </tr> */}

                                        {/* ShowModelEvaluate bằng true thì bật form đánh giá, bấm vào nút đánh giá ở card Đơn hàng */}
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
                                        title={'Xem cước các dịch vụ'} />}
                                    size='small' bordered={false} title={<div><DollarCircleOutlined /> Tiền thu hộ</div>} style={{ width: "100%", height: "100%" }}>
                                    <table id="custom-table-orderhdr-sender">
                                        <tr style={{ fontWeight: 'bold' }}>
                                            <th>

                                            </th>
                                            <td style={{ width: '35%', textAlign: 'center' }}>Nhờ thu</td>
                                            <td style={{ textAlign: 'center' }}>Thực thu</td>
                                        </tr>

                                        <tr style={{ fontWeight: 'bold' }}>
                                            <td >Tổng tiền thu hộ</td>
                                            <th>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(orderColection.find((item) => { return item.stt == 2 })?.propValue || 0)}
                                                    {/* {JSON.stringify(orderColection)} */}
                                                </div>
                                            </th>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>{formatCurrency(orderColection.find((item) => { return item.stt == 2 })?.propValueActual || 0) + " đ"}</div>
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
                                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>{formatCurrency(sumCollection(item?.groupType, "propValueActual")) + " đ"}</div>
                                                            </td>
                                                            {item.groupType != 2 && orderHdr?.batchCode != null ?
                                                                <td>
                                                                    <Tooltip title={item?.groupTypeName + " cả lô"} >
                                                                        <ExclamationCircleOutlined />
                                                                    </Tooltip>
                                                                </td>
                                                                : null}
                                                            {item.groupType == 2 && orderHdr?.amountForBatch == true ?
                                                                <td >
                                                                    <Tooltip title={item?.groupTypeName + " cả lô"} >
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
                        <Card size='small' bordered={false} title={<div><ZoomInOutlined /> Yêu cầu thêm</div>} style={{ width: "100%", height: "100%" }}>
                            <table id="custom-table-orderhdr-sender">
                                <tr>
                                    <th>Yêu cầu bổ sung:</th>
                                    <td>{orderHdr?.vasNameRequest} </td>
                                    <td>
                                        <Button
                                            icon={<BorderOuterOutlined />}
                                            onClick={() => onChangeAddService(1)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Hình thức gửi hàng:</th>
                                    <td>{orderHdr?.sendType ? orderHdr!.sendType == "1" ? "Thu gom tận nơi" : "Gửi hàng tại bưu cục" : ""}</td>
                                </tr>
                                {/* <tr>
                                    <th>Ca thu gom:</th>
                                    <td>{orderHdr?.shiftCodeCollect == "C" ? "Chiều(13-17h)" : orderHdr?.shiftCodeCollect == "S" ? "Sáng (8-12h)" : "Cả ngày(8-12h, 13-17h)"}</td>
                                </tr>
                                <tr>
                                    <th>Ngày thu gom:</th>
                                    <td>{orderHdr?.collectionDate}</td>
                                </tr> */}
                                <tr>
                                    <th>Yêu cầu khi phát hàng:</th>
                                    <td>{orderHdr?.deliveryRequire ? orderHdr?.deliveryRequire == '1' ? "Không cho xem hàng" : "Cho xem hàng" : ""}</td>
                                </tr>
                                <tr>
                                    <th>Thời gian phát hàng mong muốn:</th>
                                    <td>{orderHdr?.deliveryTime ? orderHdr?.deliveryTime == "S" ? "Sáng (8-12h)" : orderHdr?.deliveryTime == "C" ? "Chiều(13-17h)" : "Cả ngày(8-12h, 13-17h)" : ""}</td>
                                </tr>
                                <tr >
                                    <th>Yêu cầu khác:</th>
                                    <td>{orderHdr?.deliveryInstruction}</td>
                                </tr>
                            </table>
                        </Card>
                    </Col>
                }

                <Col span={24}>
                    <Card size='small' bordered={false} className="fadeInRight" title={<div><ShoppingCartOutlined /> Chi tiết hàng hóa</div>}
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
                        <Card size='small' bordered={false} className="fadeInRight" title={<div><HistoryOutlined /> Lịch sử hiệu chỉnh</div>}
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
                        <Card size='small' bordered={false} className="fadeInRight" title={<div><InboxOutlined /> Yêu cầu hỗ trợ</div>}
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
                        <Card size='small' bordered={false} className="fadeInRight" title={<div><HighlightOutlined /> Đánh giá đơn hàng</div>}
                            extra={<Button
                                icon={showTableOrderEvaluate ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                onClick={showOrderEvaluate} />}>
                            {
                                //Add thêm dữ liệu trả ra đã lưu gồm: Danh sách đánh giá ngôi sao, Danh sách checkbox tiêu chí đánh giá, ý kiến đóng góp
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
                        <Card size='small' bordered={false} className="fadeInRight" title={<div><PhoneOutlined /> Lịch sử cuộc gọi</div>}
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