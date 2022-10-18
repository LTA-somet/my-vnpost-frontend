import React, { useState, useEffect } from 'react';
import { Button, Modal, Card, Drawer, notification, Popconfirm, Space, Spin, Table, Row, Col, Checkbox, Image } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { any } from 'prop-types';
import { columnOrderDetails, columnCorrectionHistorys, columnRequetSupport } from './Columns';
import { useModel, useParams } from 'umi';
import { BookOutlined, UserOutlined, UserSwitchOutlined, ArrowDownOutlined, ArrowUpOutlined, MenuUnfoldOutlined, TableOutlined, TabletFilled } from '@ant-design/icons';
import data from './data.json';
import { isBuffer } from 'lodash';


const spanLeft = 6;
const spanRight = 12;
export default (props) => {
    const { orderHdr, isLoading, orderBilling,
        findById, getListBillingOrderHdrID, } = useModel('orderDetailsList');
    const [feeAndCollection, setFeeAndCollection] = useState<any>();
    const [visible, setVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [dataTableContent, setDataTableContent] = useState();
    const [showTableOrderDetail, setShowTableOrderDetail] = useState(true);
    const [showTableHistory, setShowTableHistory] = useState(false);
    const [showTableHelp, setShowTableHelp] = useState(false);
    const [showHistoryCall, setShowHistoryCall] = useState(false);
    const params: any = useParams();
    // const id = params.id;
    const id = props.orderHdrid;


    useEffect(() => {
        console.log(id);
        if (id) {
            findById(id);
            getListBillingOrderHdrID(id);
            // getOrderTemplateByHdrID(props.orderHdrid);
        }
    }, [])

    useEffect(() => {
        console.log("orderBilling: ", orderBilling);
        console.log("data", data);

        let fee = 0, feeActual = 0;

        orderBilling.forEach(row => {
            fee += row.fee ? row.fee : 0;
            feeActual += row.feeActual ? row.feeActual : 0;
        })
        setFeeAndCollection({ "fee": fee, "feeActual": feeActual });
        const newDataTableContent: any[] = [];
        console.log(orderHdr);
        if (orderHdr?.length > 0) {
            orderHdr?.forEach((orderHdrItem) => {
                orderHdrItem?.orderContents((orderContentItem, index) => {
                    newDataTableContent.push({
                        "stt": index,
                        "nameVi": orderContentItem.nameVi,
                        "quantity": orderContentItem.quantity,
                        "weight": orderContentItem.weight,
                        "image": orderContentItem.image
                    })
                })
            })
        }


        setDataTableContent(newDataTableContent);
    }, [orderHdr, orderBilling])

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
            render: (index) => <>{index + 1}</>
        },
        { title: "Sản phẩm", dataIndex: "nameVi" },
        { title: "Khối lượng(gram)", dataIndex: "weight" },
        { title: "Số lượng", dataIndex: "quantity" },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            width: 100,
            maxWidth: 100,
            render: (t, r) =>
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



    return (
        <PageContainer content="Chi tiết vận đơn">
            <Row>
                <Col span={12} >
                    <Card title={<div style={{ marginLeft: '0px', color: "#00549a" }}> <BookOutlined></BookOutlined> Đơn hàng</div>} style={{ width: "100%", height: "100%", padding: "20px" }} >

                        {orderHdr?.orgCode ?
                            <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                                <Col span={spanLeft}  > Mã đơn hàng: </Col>
                                <Col span={spanRight}> {orderHdr?.orderCode}</Col>
                            </Row> : null}


                        {orderHdr?.itemCode ? <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}> Mã vận đơn: </Col>
                            <Col span={spanRight}> {orderHdr?.itemCode}</Col>
                        </Row> : null}
                        {orderHdr?.createdDate ? <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}> Ngày tạo: </Col>
                            <Col span={spanRight}> {orderHdr?.createdDate}</Col>
                        </Row> : null}
                        {orderHdr?.createdBy ? <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>Người tạo: </Col>
                            <Col span={spanRight}> {orderHdr?.createdBy}</Col>
                        </Row> : null}
                        {orderHdr?.status ? <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={6}>Trạng thái: </Col>
                            <Col span={6}> {orderHdr?.status}</Col>
                            <Col span={12}> Xem hành trình</Col>
                        </Row> : null}
                        {orderHdr?.senderContractNumber ? <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>Hợp đồng gửi hàng: </Col>
                            <Col span={spanRight}> {orderHdr?.senderContractNumber}</Col>
                        </Row> : null}
                        {orderHdr?.isContractC ? <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>Hợp đồng C: </Col>
                            <Col span={spanRight}> {orderHdr?.isContractC}</Col>
                        </Row> : null}

                        {/* <table style={{ width: '100%' }}>
                            <tr style={{ borderBottom: '1px solid black' }}>
                                <Row style={{ paddingBottom: "5px" }}>
                                    <Col span={spanLeft}>Số tiền khai giá: </Col>
                                    <Col span={spanRight}> ABCD </Col>
                                </Row >
                            </tr>
                        </table> */}
                        <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>Số tiền khai giá: </Col>
                            <Col span={spanRight}> ABCD </Col>
                        </Row >
                        <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>Dịch vụ chuyển phát: </Col>
                            <Col span={spanRight}> ABCD </Col>
                        </Row>
                        <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>Dịch vụ cộng thêm: </Col>
                            <Col span={spanRight}> ABCD </Col>
                        </Row>

                    </Card>

                </Col>
                <Col span={12} >
                    <Card title={<div style={{

                        marginLeft: '0px',
                        color: '#00549a'
                    }}><UserOutlined /> Người gửi </div>} style={{ width: "98%", height: "50%", padding: "20px", marginLeft: "10px" }}>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>Họ và tên   </Col>
                            <Col span={spanRight}> {orderHdr?.senderName} </Col>
                        </Row>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>
                            <Col span={spanLeft}>Số điện thoại  </Col>
                            <Col span={spanRight}> {orderHdr?.senderPhone} </Col>
                        </Row>
                        <Row style={{ fontSize: '12px' }}>
                            <Col span={spanLeft}>Địa chỉ, Phường/Xã, Quận/Huyện, Tỉnh/TP </Col>
                            <Col span={spanRight}> {orderHdr?.senderAddress}</Col>
                        </Row>
                        {/* <p style={{ borderBottom: '1px solid #ebe4e4' }}>Họ và tên - SĐT {orderHdr?.senderName + "-" + orderHdr?.senderPhone}</p>
                        <p>Địa chỉ, Phường/Xã, Quận/Huyện, Tỉnh/TP  {orderHdr?.senderAddress}</p> */}
                    </Card>

                    <Card title={<div style={{

                        marginLeft: '0px',
                        color: '#00549a'
                    }}><UserSwitchOutlined /> Người nhận</div>} style={{ width: "98%", height: "47.7%", padding: "20px", marginLeft: "10px", marginTop: "10px" }}>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>Họ và tên   </Col>
                            <Col span={spanRight}> {orderHdr?.receiverName} </Col>
                        </Row>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>Số điện thoại  </Col>
                            <Col span={spanRight}> {orderHdr?.receiverPhone} </Col>
                        </Row>
                        <Row style={{ fontSize: '12px' }}>
                            <Col span={spanLeft}>Địa chỉ, Phường/Xã, Quận/Huyện, Tỉnh/TP </Col>
                            <Col span={spanRight}> {orderHdr?.receiverAddress}</Col>
                        </Row>
                        {/* <p >Họ và tên - SĐT {orderHdr?.receiverName + "-" + orderHdr?.receiverPhone}</p>
                        <p>Địa chỉ, Phường/Xã, Quận/Huyện, Tỉnh/TP {orderHdr?.receiverAddress}</p> */}

                    </Card>

                </Col>
            </Row>
            <p></p>
            <Row>
                <Col span={12}>
                    <Card title={<div style={{

                        marginLeft: '0px',
                        color: "#00549a"
                    }} >Thông tin hàng hóa</div>} style={{ width: "100%", height: "39%", padding: "20px" }}>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>Nội dung hàng:</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>Khối lượng/ Thực tế(gram): {orderHdr?.weight}</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>Kích thước/ Thực tế(cm): {orderHdr?.length} * {orderHdr?.width} * {orderHdr?.height} </p>
                        <Checkbox
                            checked={orderHdr?.isBroken}
                            style={{ fontSize: '12px' }}
                        >
                            Hàng dễ vỡ
                        </Checkbox>
                    </Card>
                    <Card title={<div style={{
                        marginLeft: '0px',
                        color: "#00549a"
                    }}> Yêu cầu thêm</div>} style={{ width: "100%", height: "59.3%", padding: "20px", marginTop: "10px" }}>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>Yêu cầu bổ sung:</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>Hình thức gửi hàng: {orderHdr?.sendType}</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>Ca thu gom: {orderHdr?.shiftCodeCollect}</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>Ngày thu gom: {orderHdr?.collectionDate}</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>Yêu cầu khi phát hàng: {orderHdr?.deliveryRequire}</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>Thời gian phát hàng mong muốn:</p>
                        <p style={{ fontSize: '12px' }}>Yêu cầu khác: {orderHdr?.deliveryInstruction}</p>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title={<div style={{
                        marginLeft: '0px',
                        color: "#00549a"
                    }} >Cước phí và tiền thu hộ</div>} style={{ width: "98%", height: "100%", padding: "20px", marginLeft: "10px" }}>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>
                            <Col span={12}></Col>
                            <Col span={4} style={{ textAlign: "right" }}>Tạm tính</Col>
                            <Col span={4}>| Thực tế</Col>
                        </Row>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={3}> <Button icon={<MenuUnfoldOutlined />}></Button>
                            </Col><Col span={12}>Tổng cước</Col>
                            <Col span={4} style={{ textAlign: "right" }}>{orderHdr?.mainFee ? orderHdr?.mainFee : 0 + feeAndCollection?.fee ? feeAndCollection?.fee : 0}</Col>
                            <Col span={4}>| {orderHdr?.mainFeeActual ? orderHdr?.mainFeeActual : 0 + feeAndCollection?.feeActual ? feeAndCollection?.feeActual : 0}</Col>
                        </Row>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>
                            <Col span={1}></Col>
                            <Col span={11}>Cước chính</Col>
                            <Col span={4} style={{ textAlign: "right", fontSize: '12px' }}>{orderHdr?.mainFee ? orderHdr?.mainFee : 0}</Col>
                            <Col span={4}>| {orderHdr?.mainFeeActual ? orderHdr?.mainFeeActual : 0}</Col>
                        </Row>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>
                            <Col span={1}></Col>
                            <Col span={11}>- Dịch vụ cộng thêm:</Col>
                            <Col span={4} style={{ textAlign: "right" }}>{feeAndCollection?.fee}</Col>
                            <Col span={4}>| {feeAndCollection?.feeActual}</Col>
                        </Row>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>
                            <Col span={1}></Col>
                            <Col span={11}>- Yêu cầu bổ sung:</Col>
                            <Col span={4} style={{ textAlign: "right", fontSize: '12px' }}>{feeAndCollection?.fee}</Col>
                            <Col span={4}>| {feeAndCollection?.feeActual}</Col>
                        </Row>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>(Người gửi trả/ Người nhận trả)</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>&nbsp; - Giá cước thực tế đang hiển thị là cước cả lô:</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>Tổng tiền thu hộ</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>&nbsp; - Tiền cước:</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>&nbsp; - tiền hàng:</p>
                        <p style={{ fontSize: '12px' }} >&nbsp; - Tiền các dịch vụ phát sinh</p>
                    </Card>
                </Col>
            </Row>
            <p></p>
            <Card className="fadeInRight" title={<div style={{
                marginLeft: '0px',
                color: '#00549a'
            }}>Chi tiết hàng hóa</div>}
                extra={<Button
                    icon={showTableOrderDetail ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    onClick={() => setShowTableOrderDetail(!showTableOrderDetail)}>
                </Button>}>
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
            <p></p>
            <Card className="fadeInRight" title={<div style={{
                marginLeft: '0px',
                color: '#00549a'
            }}>Lịch sử hiệu chỉnh</div>}
                extra={<Button
                    icon={showTableHistory ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    onClick={() => setShowTableHistory(!showTableHistory)}>
                </Button>}>
                {showTableHistory ?
                    <Table
                        size='small'
                        dataSource={[]}
                        columns={columnCorrectionHistorys}
                        bordered
                        rowKey="stt"
                    /> : null}
            </Card>
            <p></p>
            <Card className="fadeInRight" title={<div style={{
                marginLeft: '0px',
                color: '#00549a'
            }}>Yêu cầu hỗ trợ</div>}
                extra={<Button
                    icon={showTableHelp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    onClick={() => setShowTableHelp(!showTableHelp)}>
                </Button>}>
                {showTableHelp ?
                    <Table
                        size='small'
                        dataSource={[]}
                        columns={columnRequetSupport}
                        bordered
                        rowKey="stt"
                    /> : null}
            </Card>
            <p></p>
            <Card className="fadeInRight" title={<div style={{
                marginLeft: '0px',
                color: '#00549a'
            }}>Lịch sử cuộc gọi</div>}
                extra={<Button
                    icon={showHistoryCall ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    onClick={() => setShowHistoryCall(!showHistoryCall)}>
                </Button>}>
            </Card>
        </PageContainer>
    )
}