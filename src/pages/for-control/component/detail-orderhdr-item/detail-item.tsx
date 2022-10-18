import { Modal } from "antd";
import moment from 'moment';
import { Link, useModel, useHistory } from 'umi';
import { Spin, Card, Checkbox, DatePicker, Form, Input, Select, Upload, Row, Col, Button, Table, message } from "antd";
import { useEffect } from "react";
import { formatCurrency } from '@/utils';
import { CheckCircleOutlined, ExportOutlined } from "@ant-design/icons";
const DetailOrderHdrItem = (props: Props) => {
    const { isLoading, orderHdrDto, seachOrderHdrByItemCode } = useModel('ticketModelList');
    const { statusHdr } = useModel("forControlModelList");
    const { initialState } = useModel('@@initialState')
    const user = initialState?.accountInfo;
    const history = useHistory();

    useEffect(() => {
        if (props.itemCode && props.isOpenPopup == true) {
            seachOrderHdrByItemCode(props.itemCode);
        }

    }, [props.isOpenPopup]);

    // useEffect(()=>{
    //     const isSender = orderHdrDto?.receiverOwner == user?.uid || orderHdrDto?.receiverCode == user?.uid ? 1 : 0;
    // }, [orderHdrDto]);


    const showOrderDetail = () => {
        history.push('/manage/order-manager/sender/' + orderHdrDto?.orderHdrId);
        //đơn hàng nhận
        // const isSender = orderHdrDto?.receiverOwner == user?.uid || orderHdrDto?.receiverCode == user?.uid ? 1 : 0;
        // console.log("isSender", isSender);
        // if (isSender === 1) {
        //     // return (
        //     //     <Link to={'/manager/order-manager/sender/' + orderHdrDto?.orderHdrId}> </Link>
        //     // )
        //     history.push('/manager/order-manager/sender/' + orderHdrDto?.orderHdrId);
        // }
        // if (isSender === 0) {
        //     console.log("abc");

        //     // return (
        //     //     <Link to={'/manager/order-manager/receiver/' + orderHdrDto?.orderHdrId}> abc </Link >
        //     // )
        //     history.push('/manager/order-manager/receiver/' + orderHdrDto?.orderHdrId);
        // }
    }

    return (
        <Spin spinning={isLoading}>
            <Modal
                title="Thông tin chi tiết bưu gửi (dạng rút gọn)"
                visible={props.isOpenPopup}
                width={800}
                onOk={() => props.setIsOpenPopup(false)}
                onCancel={() => props.setIsOpenPopup(false)}
                footer={null}
            >
                <div>
                    <Row style={{ border: '1px solid rgba(0, 0, 0, 0.2)', borderBottom: 'none', padding: '5px' }}>
                        <Col span={12}>Số hiệu</Col>
                        <Col span={12}>{orderHdrDto?.itemCode}</Col>
                    </Row>
                    <Row style={{ border: '1px solid rgba(0, 0, 0, 0.2)', borderBottom: 'none', padding: '5px' }}>
                        <Col span={12}>Người nhận</Col>
                        <Col span={12}>{orderHdrDto?.receiverName}</Col>
                    </Row>
                    <Row style={{ border: '1px solid rgba(0, 0, 0, 0.2)', borderBottom: 'none', padding: '5px' }}>
                        <Col span={12}>Nội dung hàng</Col>
                        <Col span={12}>{orderHdrDto?.contentNote}</Col>
                    </Row>
                    <Row style={{ border: '1px solid rgba(0, 0, 0, 0.2)', borderBottom: 'none', padding: '5px' }}>
                        <Col span={12}>Khối lượng</Col>
                        <Col span={12}>{formatCurrency(orderHdrDto?.weight || 0)}</Col>
                    </Row>
                    <Row style={{ border: '1px solid rgba(0, 0, 0, 0.2)', borderBottom: 'none', padding: '5px' }}>
                        <Col span={12}>Tiền cước</Col>
                        <Col span={12}>{formatCurrency(orderHdrDto?.mainFee || 0)}</Col>
                    </Row>
                    <Row style={{ border: '1px solid rgba(0, 0, 0, 0.2)', borderBottom: 'none', padding: '5px' }}>
                        <Col span={12}>Tiền COD</Col>
                        <Col span={12}>{formatCurrency(orderHdrDto?.codAmount || 0)}</Col>
                    </Row>
                    <Row style={{ border: '1px solid rgba(0, 0, 0, 0.2)', borderBottom: 'none', padding: '5px' }}>
                        <Col span={12}>Ghi chú phát</Col>
                        <Col span={12}>{orderHdrDto?.deliveryRequire == "1" ? "Không cho xem hàng" : orderHdrDto?.deliveryRequire == "2" ? "Cho xem hàng" : ""}</Col>
                    </Row>
                    <Row style={{ border: '1px solid rgba(0, 0, 0, 0.2)', padding: '5px' }}>
                        <Col span={12}>Trạng thái</Col>
                        <Col span={12}>{orderHdrDto?.statusName}</Col>
                    </Row>
                    <Row >
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button
                                style={{ fontStyle: 'italic', height: '30px', textAlign: 'center', color: '#fd9713', padding: '10px', border: 'none', background: 'none' }}
                                disabled={orderHdrDto ? false : true}
                                onClick={() => showOrderDetail()}>
                                Để xem đầy đủ thông tin đơn hàng, vui lòng ấn "Tại đây"
                            </Button>
                        </Col>
                    </Row>
                    <br />
                    <Row >
                        <Col span={24} style={{
                            textAlign: 'center'
                        }}>
                            {orderHdrDto?.itemCode ?
                                <Link
                                    to={{
                                        pathname: '/manage/ticket',
                                        search: '?itemCode=' + props.itemCode,
                                        // hash: '#the-hash',
                                        state: { type: "FORM_CONTROL", itemCode: props.itemCode, collactingDtlId: props.collactingDtlId, collactingHdrId: props.collactingHdrId },
                                    }}
                                >
                                    <Button className='height-btn2 btn-outline-success' icon={<CheckCircleOutlined />} disabled={statusHdr || props?.customerCode != user?.org}>Gửi yêu cầu</Button>
                                </Link>
                                : <Button className='height-btn2 btn-outline-success' icon={<CheckCircleOutlined />} disabled={statusHdr || props?.customerCode != user?.org}>Gửi yêu cầu</Button>
                            }
                            <Button className='height-btn2 btn-outline-secondary' icon={<ExportOutlined />} style={{ marginLeft: '20px' }} onClick={() => props.setIsOpenPopup(false)}>Đóng</Button>
                        </Col>
                    </Row>
                </div>

            </Modal>
        </Spin>
    )


};
type Props = {
    isOpenPopup: boolean;
    itemCode: string;
    customerCode: string,
    collactingDtlId: string;
    collactingHdrId: string;
    setIsOpenPopup: (isOpenPopup: boolean) => void;

}

export default DetailOrderHdrItem;


