import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Button } from "antd";
import { DownloadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { downloadFile } from '@/utils';
import { useModel } from 'umi';
import { split } from 'lodash';
import { MimeType } from './mime-type';
import { formatCurrency } from '@/utils';
import EvaluateTicket from '@/pages/setting/orderhdr-item/component/evaluate/EvaluateTicket';

const isProd = REACT_APP_ENV === 'prod';

const TicketViewDetail = (props: Props) => {
    const { strBase64, setStringBase64, getFile } = useModel('ticketModelList');
    const { initialState } = useModel('@@initialState')
    const user = initialState?.accountInfo;

    const ticketDetails = props.ticketDetail;
    const fileName = ticketDetails?.ttkAttachment;

    const [ShowModelEvaluate, setShowModelEvaluate] = useState(false);

    useEffect(() => {
        if (strBase64) {
            const lstType = split(fileName, ".");
            const extension = lstType[lstType.length - 1];
            const mimeType = MimeType[MimeType.findIndex((item) => item.extension == extension)]!.mimeType;
            const lstPath = split(fileName, "/");
            const namePath = lstPath[lstPath.length - 1];
            console.log("down: ", strBase64, namePath, mimeType);

            downloadFile(strBase64, namePath, mimeType);
            setStringBase64("");
        }
    }, [strBase64])

    // downloadAllFile
    const onDownloadFile = () => {
        const lst = split(fileName, ".");
        console.log("lst", lst);
        getFile(fileName);
    }

    //Bấm vào nút Đánh giá
    const onShowModelEvaluate = (isOpenPopup: boolean) => {
        setShowModelEvaluate(isOpenPopup);
    }

    return (
        <Modal
            title="Thông tin yêu cầu"
            visible={props.isOpenPopup}
            width={1000}
            onOk={() => props.setIsOpenPopup(false)}
            onCancel={() => props.setIsOpenPopup(false)}
            footer={[
                !isProd ? <Button
                    className='btn-outline-warning'
                    // style={{ float: "right" }}
                    // id='dialog'
                    onClick={() => onShowModelEvaluate(true)}
                    title={'Đánh giá'}
                >
                    Đánh giá
                </Button> : null

                // null

            ]}
        >
            <div style={{ fontSize: '14px' }}
            >
                <Row style={{ marginBottom: '3px', display: 'flex', alignItems: 'center' }}>
                    <Col span={3} >Mã yêu cầu</Col>
                    <Col span={5} flex="auto" style={{ border: '1px solid rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', minHeight: '30px' }}>{ticketDetails?.ttkCode}</Col>

                    <Col span={3} style={{ paddingLeft: '15px', paddingRight: '15px' }}>Ngày yêu cầu</Col>
                    <Col span={5} flex="auto" style={{ border: '1px solid rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', minHeight: '30px' }}>{ticketDetails?.createdDate}</Col>

                    <Col span={3} style={{ paddingLeft: '15px', paddingRight: '15px' }} >Người <p style={{ display: 'table-cell' }}>yêu cầu</p></Col>
                    <Col span={5} style={{ border: '1px solid rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', minHeight: '30px' }}>
                        {ticketDetails?.createdUserName}
                    </Col>
                </Row>
                <Row style={{ marginBottom: '3px', display: 'flex', alignItems: 'center' }}>
                    <Col span={3} >Số hiệu bưu gửi</Col>
                    <Col span={5} style={{ border: '1px solid rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', minHeight: '30px' }}>{ticketDetails?.parcelId}</Col>
                    <Col span={3} style={{ paddingLeft: '15px', paddingRight: '15px' }}>Loại yêu cầu</Col>
                    <Col span={5} style={{ border: '1px solid rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', minHeight: '30px' }}>{ticketDetails?.reasonName}</Col>
                    <Col span={3} style={{ paddingLeft: '15px', paddingRight: '15px' }} >Nội dung <p style={{ display: 'table-cell' }}>yêu cầu</p></Col>
                    <Col span={5} style={{ border: '1px solid rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', minHeight: '30px' }}>{ticketDetails?.ttkContent}</Col>
                </Row>

                <Row style={{ marginBottom: '3px', display: 'flex', alignItems: 'center' }}>
                    <Col span={3}>Trạng thái xử lý</Col>
                    <Col span={5} style={{ border: '1px solid rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', minHeight: '30px' }}>{ticketDetails?.ttkStatusName}</Col>
                    <Col span={3} style={{ paddingLeft: '15px', paddingRight: '15px' }}>KQ xử lý</Col>
                    <Col span={5} style={{ border: '1px solid rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', minHeight: '30px' }}>{ticketDetails?.docName} </Col>
                    <Col span={3} style={{ paddingLeft: '15px', paddingRight: '15px' }}>Số tiền được<p style={{ display: 'table-cell' }}>bồi thường</p></Col>
                    <Col span={5} style={{ border: '1px solid rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', minHeight: '30px' }}>{formatCurrency(ticketDetails?.amount)}</Col>
                </Row>
                <Row style={{ marginBottom: '3px', display: 'flex', alignItems: 'center' }}>
                    <Col span={3} >File đính kèm</Col>
                    <Col span={5} >
                        <Button style={{ width: '100%' }} icon={<DownloadOutlined />}
                            disabled={ticketDetails?.ttkAttachment ? false : true}
                            onClick={() => onDownloadFile()}>
                            Tải file đính kèm </Button>
                    </Col>
                </Row>
                {ShowModelEvaluate && (<EvaluateTicket isOpenPopup={ShowModelEvaluate}
                    setIsOpenPopup={onShowModelEvaluate}
                    data={ticketDetails}
                />)
                }
            </div>
        </Modal>
    )
};
type Props = {
    isOpenPopup: boolean;
    ticketDetail: any;
    setIsOpenPopup: (isOpenPopup: boolean) => void;
}

export default TicketViewDetail;


