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
        { title: "S???n ph???m", dataIndex: "nameVi" },
        { title: "Kh???i l?????ng(gram)", dataIndex: "weight" },
        { title: "S??? l?????ng", dataIndex: "quantity" },
        {
            title: 'H??nh ???nh',
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
                        <Modal title="Xem ???nh" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
                            <img alt="example" style={{ width: '100%' }} src={`${r.image}`} />
                        </Modal>
                    </>
                    : null
                }

                </>
        }
    ]



    return (
        <PageContainer content="Chi ti???t v???n ????n">
            <Row>
                <Col span={12} >
                    <Card title={<div style={{ marginLeft: '0px', color: "#00549a" }}> <BookOutlined></BookOutlined> ????n h??ng</div>} style={{ width: "100%", height: "100%", padding: "20px" }} >

                        {orderHdr?.orgCode ?
                            <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                                <Col span={spanLeft}  > M?? ????n h??ng: </Col>
                                <Col span={spanRight}> {orderHdr?.orderCode}</Col>
                            </Row> : null}


                        {orderHdr?.itemCode ? <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}> M?? v???n ????n: </Col>
                            <Col span={spanRight}> {orderHdr?.itemCode}</Col>
                        </Row> : null}
                        {orderHdr?.createdDate ? <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}> Ng??y t???o: </Col>
                            <Col span={spanRight}> {orderHdr?.createdDate}</Col>
                        </Row> : null}
                        {orderHdr?.createdBy ? <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>Ng?????i t???o: </Col>
                            <Col span={spanRight}> {orderHdr?.createdBy}</Col>
                        </Row> : null}
                        {orderHdr?.status ? <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={6}>Tr???ng th??i: </Col>
                            <Col span={6}> {orderHdr?.status}</Col>
                            <Col span={12}> Xem h??nh tr??nh</Col>
                        </Row> : null}
                        {orderHdr?.senderContractNumber ? <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>H???p ?????ng g???i h??ng: </Col>
                            <Col span={spanRight}> {orderHdr?.senderContractNumber}</Col>
                        </Row> : null}
                        {orderHdr?.isContractC ? <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>H???p ?????ng C: </Col>
                            <Col span={spanRight}> {orderHdr?.isContractC}</Col>
                        </Row> : null}

                        {/* <table style={{ width: '100%' }}>
                            <tr style={{ borderBottom: '1px solid black' }}>
                                <Row style={{ paddingBottom: "5px" }}>
                                    <Col span={spanLeft}>S??? ti???n khai gi??: </Col>
                                    <Col span={spanRight}> ABCD </Col>
                                </Row >
                            </tr>
                        </table> */}
                        <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>S??? ti???n khai gi??: </Col>
                            <Col span={spanRight}> ABCD </Col>
                        </Row >
                        <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>D???ch v??? chuy???n ph??t: </Col>
                            <Col span={spanRight}> ABCD </Col>
                        </Row>
                        <Row style={{ paddingBottom: "5px", borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>D???ch v??? c???ng th??m: </Col>
                            <Col span={spanRight}> ABCD </Col>
                        </Row>

                    </Card>

                </Col>
                <Col span={12} >
                    <Card title={<div style={{

                        marginLeft: '0px',
                        color: '#00549a'
                    }}><UserOutlined /> Ng?????i g???i </div>} style={{ width: "98%", height: "50%", padding: "20px", marginLeft: "10px" }}>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>H??? v?? t??n   </Col>
                            <Col span={spanRight}> {orderHdr?.senderName} </Col>
                        </Row>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>
                            <Col span={spanLeft}>S??? ??i???n tho???i  </Col>
                            <Col span={spanRight}> {orderHdr?.senderPhone} </Col>
                        </Row>
                        <Row style={{ fontSize: '12px' }}>
                            <Col span={spanLeft}>?????a ch???, Ph?????ng/X??, Qu???n/Huy???n, T???nh/TP </Col>
                            <Col span={spanRight}> {orderHdr?.senderAddress}</Col>
                        </Row>
                        {/* <p style={{ borderBottom: '1px solid #ebe4e4' }}>H??? v?? t??n - S??T {orderHdr?.senderName + "-" + orderHdr?.senderPhone}</p>
                        <p>?????a ch???, Ph?????ng/X??, Qu???n/Huy???n, T???nh/TP  {orderHdr?.senderAddress}</p> */}
                    </Card>

                    <Card title={<div style={{

                        marginLeft: '0px',
                        color: '#00549a'
                    }}><UserSwitchOutlined /> Ng?????i nh???n</div>} style={{ width: "98%", height: "47.7%", padding: "20px", marginLeft: "10px", marginTop: "10px" }}>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>H??? v?? t??n   </Col>
                            <Col span={spanRight}> {orderHdr?.receiverName} </Col>
                        </Row>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={spanLeft}>S??? ??i???n tho???i  </Col>
                            <Col span={spanRight}> {orderHdr?.receiverPhone} </Col>
                        </Row>
                        <Row style={{ fontSize: '12px' }}>
                            <Col span={spanLeft}>?????a ch???, Ph?????ng/X??, Qu???n/Huy???n, T???nh/TP </Col>
                            <Col span={spanRight}> {orderHdr?.receiverAddress}</Col>
                        </Row>
                        {/* <p >H??? v?? t??n - S??T {orderHdr?.receiverName + "-" + orderHdr?.receiverPhone}</p>
                        <p>?????a ch???, Ph?????ng/X??, Qu???n/Huy???n, T???nh/TP {orderHdr?.receiverAddress}</p> */}

                    </Card>

                </Col>
            </Row>
            <p></p>
            <Row>
                <Col span={12}>
                    <Card title={<div style={{

                        marginLeft: '0px',
                        color: "#00549a"
                    }} >Th??ng tin h??ng h??a</div>} style={{ width: "100%", height: "39%", padding: "20px" }}>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>N???i dung h??ng:</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>Kh???i l?????ng/ Th???c t???(gram): {orderHdr?.weight}</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>K??ch th?????c/ Th???c t???(cm): {orderHdr?.length} * {orderHdr?.width} * {orderHdr?.height} </p>
                        <Checkbox
                            checked={orderHdr?.isBroken}
                            style={{ fontSize: '12px' }}
                        >
                            H??ng d??? v???
                        </Checkbox>
                    </Card>
                    <Card title={<div style={{
                        marginLeft: '0px',
                        color: "#00549a"
                    }}> Y??u c???u th??m</div>} style={{ width: "100%", height: "59.3%", padding: "20px", marginTop: "10px" }}>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>Y??u c???u b??? sung:</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>H??nh th???c g???i h??ng: {orderHdr?.sendType}</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>Ca thu gom: {orderHdr?.shiftCodeCollect}</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>Ng??y thu gom: {orderHdr?.collectionDate}</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>Y??u c???u khi ph??t h??ng: {orderHdr?.deliveryRequire}</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>Th???i gian ph??t h??ng mong mu???n:</p>
                        <p style={{ fontSize: '12px' }}>Y??u c???u kh??c: {orderHdr?.deliveryInstruction}</p>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title={<div style={{
                        marginLeft: '0px',
                        color: "#00549a"
                    }} >C?????c ph?? v?? ti???n thu h???</div>} style={{ width: "98%", height: "100%", padding: "20px", marginLeft: "10px" }}>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>
                            <Col span={12}></Col>
                            <Col span={4} style={{ textAlign: "right" }}>T???m t??nh</Col>
                            <Col span={4}>| Th???c t???</Col>
                        </Row>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>
                            <Col span={3}> <Button icon={<MenuUnfoldOutlined />}></Button>
                            </Col><Col span={12}>T???ng c?????c</Col>
                            <Col span={4} style={{ textAlign: "right" }}>{orderHdr?.mainFee ? orderHdr?.mainFee : 0 + feeAndCollection?.fee ? feeAndCollection?.fee : 0}</Col>
                            <Col span={4}>| {orderHdr?.mainFeeActual ? orderHdr?.mainFeeActual : 0 + feeAndCollection?.feeActual ? feeAndCollection?.feeActual : 0}</Col>
                        </Row>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>
                            <Col span={1}></Col>
                            <Col span={11}>C?????c ch??nh</Col>
                            <Col span={4} style={{ textAlign: "right", fontSize: '12px' }}>{orderHdr?.mainFee ? orderHdr?.mainFee : 0}</Col>
                            <Col span={4}>| {orderHdr?.mainFeeActual ? orderHdr?.mainFeeActual : 0}</Col>
                        </Row>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>
                            <Col span={1}></Col>
                            <Col span={11}>- D???ch v??? c???ng th??m:</Col>
                            <Col span={4} style={{ textAlign: "right" }}>{feeAndCollection?.fee}</Col>
                            <Col span={4}>| {feeAndCollection?.feeActual}</Col>
                        </Row>
                        <Row style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>
                            <Col span={1}></Col>
                            <Col span={11}>- Y??u c???u b??? sung:</Col>
                            <Col span={4} style={{ textAlign: "right", fontSize: '12px' }}>{feeAndCollection?.fee}</Col>
                            <Col span={4}>| {feeAndCollection?.feeActual}</Col>
                        </Row>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>(Ng?????i g???i tr???/ Ng?????i nh???n tr???)</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>&nbsp; - Gi?? c?????c th???c t??? ??ang hi???n th??? l?? c?????c c??? l??:</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px', fontWeight: 'bold' }}>T???ng ti???n thu h???</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>&nbsp; - Ti???n c?????c:</p>
                        <p style={{ borderBottom: '1px solid #ebe4e4', fontSize: '12px' }}>&nbsp; - ti???n h??ng:</p>
                        <p style={{ fontSize: '12px' }} >&nbsp; - Ti???n c??c d???ch v??? ph??t sinh</p>
                    </Card>
                </Col>
            </Row>
            <p></p>
            <Card className="fadeInRight" title={<div style={{
                marginLeft: '0px',
                color: '#00549a'
            }}>Chi ti???t h??ng h??a</div>}
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
            }}>L???ch s??? hi???u ch???nh</div>}
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
            }}>Y??u c???u h??? tr???</div>}
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
            }}>L???ch s??? cu???c g???i</div>}
                extra={<Button
                    icon={showHistoryCall ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    onClick={() => setShowHistoryCall(!showHistoryCall)}>
                </Button>}>
            </Card>
        </PageContainer>
    )
}