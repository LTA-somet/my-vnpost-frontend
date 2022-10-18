
import React, { useState, useEffect } from 'react';
import { useModel, useParams } from 'umi';
import { Button, Card, Table, Row, Col, Tooltip } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { ArrowDownOutlined, ArrowUpOutlined, EnvironmentOutlined, ExclamationCircleOutlined, HighlightOutlined } from '@ant-design/icons';
import OrderHistory from './component/order-history/orderHistory';
import { formatCurrency } from '@/utils';
import './style.css';
import { formatStart0 } from '@/utils/PhoneUtil';
import EvaluateReceived from './component/evaluate/evaluateReceived';
import { useCurrentUser } from '@/core/selectors';
import EvaluateView from './component/evaluate/evaluateView';

const isProd = REACT_APP_ENV === 'prod';

const OrderReceived = (props: any) => {
    const { orderHdr, isLoading, orderColection, getCollectionDetailDto, feeDetailDto, getFeeOrderDto, postMan, getPostmanInfo,
        findById, vasPropsDetail, getVasPropsDetail, orderMapValueNameDto, getMapValueToName } = useModel('orderDetailsList');
    const [showModelOrderHistory, setShowModelOrderHistory] = useState(false);
    const [ShowModelEvaluate, setShowModelEvaluate] = useState(false);
    const [showTableOrderEvaluate, setShowTableOrderEvaluate] = useState(false);

    const [isDisabledReviewParent, setDisabledReviewParent] = useState(false);
    const currentUser = useCurrentUser();

    const params: any = useParams();
    const id = params.id;
    // const id = props.orderHdrid;

    useEffect(() => {
        console.log(id);
        if (id) {
            findById(id);
            getMapValueToName(id);
            getVasPropsDetail(id, undefined);
        }
    }, []);

    useEffect(() => {
        if (orderHdr?.itemCode) {
            getPostmanInfo(orderHdr?.itemCode);
            getFeeOrderDto(orderHdr?.originalId || "", orderHdr?.status || -1, true);
            getCollectionDetailDto(orderHdr?.originalId || "");
        }
        //Điều kiện Un disabled nút đánh giá
        console.log("orderHdr", orderHdr);

        if ((orderHdr?.receiverOwner === currentUser.uid)
            // (orderHdr?.sendType === '1') && 
            || (orderHdr?.receiverOwner != currentUser.uid && orderHdr?.receiverCode === currentUser.org && orderHdr?.receiverContractNumber != null)) {
            setDisabledReviewParent(false);
        } else {
            setDisabledReviewParent(true);
        }
    }, [orderHdr]);

    // console.log("orderHdr Nhận", orderHdr);


    // console.log("orderColection", orderColection);
    //Tổng tiền thu hộ
    function sumMonny() {
        return feeDetailDto.find((item) => { return item.stt == 4 })?.fee + sumCollection(1, "propValue") + sumCollection(2, "propValue");
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

    //Đánh giá
    const onShowModelEvaluate = (isOpenPopup: boolean) => {
        setShowModelEvaluate(isOpenPopup);
    }
    console.log(postMan);

    //Hiển thị table đánh giá đơn hàng
    const showOrderEvaluate = () => {
        setShowTableOrderEvaluate(!showTableOrderEvaluate)
    }

    // const currentUser = useCurrentUser();

    // console.log("orderHdr", orderHdr);


    return (
        <>
            <PageContainer content="Chi tiết vận đơn nhận: ">
                <Row gutter={[8, 8]}>
                    <Col span={12} >
                        <Card style={{ width: "100%", height: "100%" }} className="fadeInRight" bordered={false} size='small' title={orderHdr?.orgCodeAccept + "-" + orderHdr?.orgNameAccept}
                            extra={
                                // (orderHdr?.receiverOwner === currentUser.uid || (orderHdr?.receiverOwner != currentUser.uid && orderHdr?.receiverCode === currentUser.org && orderHdr?.receiverContractNumber != null)) ?
                                !isProd && <Button
                                    className='btn-outline-warning'
                                    style={{ float: "right" }}
                                    id='dialog'
                                    onClick={() => onShowModelEvaluate(true)}
                                    title={'Đánh giá'}
                                    disabled={isDisabledReviewParent}
                                // hidden={isDisabledReviewParent}
                                >
                                    Đánh giá
                                </Button>
                            }

                        >
                            <table className="custom-table-orderhdr-receiver">
                                <tr >
                                    <th>Mã vận đơn:</th>
                                    <td>{orderHdr?.itemCode}</td>
                                </tr>
                                <tr>
                                    <th>Nước chấp nhận:</th>
                                    <td>Việt Nam</td>
                                </tr>
                                <tr>
                                    <th>Bưu cục chấp nhận:</th>
                                    <td>{orderHdr?.orgCodeAccept}</td>
                                </tr>
                                <tr>
                                    <th>Người gửi:</th>
                                    <td>{orderHdr?.senderName}</td>
                                </tr>
                                <tr>
                                    <th>Địa chỉ gửi:</th>
                                    <td>{orderHdr?.senderAddress}</td>
                                </tr>
                                <tr>
                                    <th>SĐT người gửi:</th>
                                    <td>{formatStart0(orderHdr?.senderPhone)}</td>
                                </tr>
                                <tr>
                                    <th>Khối lượng:</th>
                                    <td>{formatCurrency(orderHdr?.weight || 0)}</td>
                                </tr>
                                <tr>
                                    <th>Dịch vụ cộng thêm:</th>
                                    <td>{vasPropsDetail.filter((item) => { return item.isExtend == 0 && item.stt == 1 }).map((element) => { return element.vaServiceName + ', ' })}</td>
                                </tr>
                                <tr>
                                    <th>Yêu cầu bổ sung:</th>
                                    <td>{vasPropsDetail.filter((item) => { return item.isExtend == 1 && item.stt == 1 }).map((element) => { return element.vaServiceName + ', ' })} </td>
                                </tr>
                                <tr>
                                    <th>Hợp đồng C sử dụng:</th>
                                    <td>{orderHdr?.receiverContractNumber || ''} </td>
                                </tr>
                                <tr>
                                    <th>Trạng thái:</th>
                                    <td>{orderMapValueNameDto.find((item) => { return item.key == "STATUS" })?.lable}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <Button
                                            style={{ border: 'none' }}
                                            icon={<EnvironmentOutlined />}
                                            onClick={() => setShowModelOrderHistory(true)}
                                        >
                                            Xem hành trình
                                        </Button>
                                    </td>
                                </tr>
                                <OrderHistory
                                    isOpenPopup={showModelOrderHistory}
                                    setIsOpenPopup={setShowModelOrderHistory}
                                    type={"4"}
                                    itemCode={orderHdr?.itemCode || ""} />
                            </table>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card style={{ width: "100%", height: "100%" }} className="fadeInRight" bordered={false} size='small'
                            headStyle={{ backgroundColor: '#E6ECF0', width: '40px' }}
                            title={orderHdr?.poCodeDelivery ? orderHdr?.poCodeDelivery : "" + "-" + orderHdr?.poNameDelivery ? orderHdr?.poNameDelivery : ""}
                        >
                            <table className="custom-table-orderhdr-receiver">
                                <tr>
                                    <th>Mã đơn hàng:</th>
                                    <td>{orderHdr?.saleOrderCode}</td>
                                </tr>
                                <tr>
                                    <th>Nước phát:</th>
                                    <td>Việt Nam</td>
                                </tr>
                                <tr>
                                    <th>Bưu cục phát:</th>
                                    <td>{orderHdr?.poCodeDelivery}</td>
                                </tr>
                                <tr>
                                    <th>Người nhận:</th>
                                    <td>{orderHdr?.receiverName}</td>
                                </tr>
                                <tr>
                                    <th>Địa chỉ nhận:</th>
                                    <td>{orderHdr?.receiverAddress}</td>
                                </tr>

                                <tr>
                                    <th>SĐT người nhận:</th>
                                    <td>{formatStart0(orderHdr?.receiverPhone)}</td>
                                </tr>

                                {orderHdr?.isContractC == true ?
                                    <>
                                        <tr style={{ fontWeight: 'bold' }}>
                                            <td>Tổng cước</td>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 4 })?.fee || 0) + " đ"}
                                                </div>

                                            </td>
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
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 1 })?.fee || 0) + " đ"}
                                                </div>
                                            </td>
                                            <td />

                                        </tr>
                                        <tr>
                                            <td style={{ paddingLeft: '30px' }}>- Dịch vụ cộng thêm:</td>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 2 })?.fee || 0) + " đ"}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ paddingLeft: '30px' }}>- Yêu cầu bổ sung:</td>
                                            <td>
                                                <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                                    {formatCurrency(feeDetailDto.find((item) => { return item.stt == 3 })?.fee || 0) + " đ"}
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                    : null
                                }
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td >Tổng tiền thu hộ</td>
                                    <td>
                                        <div style={{ textAlign: 'right', marginRight: '80px' }}>
                                            {formatCurrency(orderColection.find((item) => { return item.stt == 2 })?.propValue || 0) + " đ"}
                                        </div>
                                    </td>
                                    <td />
                                </tr >
                                {
                                    orderColection?.map((item: any, index: number) => {
                                        if (item.groupType != null && item.groupTypeName != null) {
                                            return (
                                                <tr key={index} >
                                                    <td style={{ paddingLeft: '30px' }}> - {item?.groupTypeName}
                                                    </td>
                                                    <td >
                                                        <div style={{ textAlign: 'right', marginRight: '80px' }}>{formatCurrency(sumCollection(item?.groupType, "propValue")) + " đ"}</div>
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
                                <tr>
                                    <td>Bưu tá phát hàng:</td>
                                    <td>{postMan && postMan?.ListValue ? postMan?.ListValue[0]?.PostmanName + " - " + postMan?.ListValue[0]?.PostmanTel : ''}</td>
                                </tr>
                            </table>
                        </Card>
                    </Col>
                </Row>

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
                                    // receiverName={orderHdr?.receiverName}
                                    // receiverPhone={orderHdr?.receiverPhone}
                                    originalId={orderHdr?.originalId}
                                />

                            }
                        </Card>
                    </Col>
                }

                {ShowModelEvaluate && (<EvaluateReceived isOpenPopup={ShowModelEvaluate}
                    setIsOpenPopup={onShowModelEvaluate}
                    status={orderHdr!.status}
                    itemCode={orderHdr?.itemCode}
                    sendType={orderHdr?.sendType}
                    // receiverName={orderHdr?.receiverName}
                    // receiverPhone={orderHdr?.receiverPhone}
                    originalId={orderHdr?.originalId}
                />)
                }

            </PageContainer>
        </>
    )
}
export default OrderReceived;
