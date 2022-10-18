import { Modal } from "antd";
import moment from 'moment';
import { Link, useModel } from 'umi';
import { Spin, Card, Checkbox, DatePicker, Form, Input, Select, Upload, Row, Col, Button, Table, message } from "antd";
import { useEffect } from "react";
import { useHistory, useIntl, useLocation } from "umi";
import { formatCurrency } from '@/utils';
import { CheckCircleOutlined, ExportOutlined } from "@ant-design/icons";

const dateFormat = 'DD/MM/YYYY';

const FormConfirm = (props: Props) => {
    const { idHdr, setReloadFrom, getDataComfirm, collactingDtlConfirm, getConfirmChangeStatus } = useModel('forControlModelList');
    const history = useHistory();

    console.log("idHdr", idHdr);

    useEffect(() => {
        if (idHdr && props.isOpenPopup == true) {
            getDataComfirm(idHdr);
        }
    }, [props.isOpenPopup]);


    // useEffect(() => {
    //     if (statusConfiml == true) {
    //         history.push('/for-control/control');
    //     }
    // }, [statusConfiml]);

    const onConFiml = () => {
        getConfirmChangeStatus(idHdr, (success: any) => {
            if (success) {
                setReloadFrom(true);
                props.setIsOpenPopup(false);
                history.push('/for-control/control');
            }
        });
    }

    return (
        <Modal
            title="Vui lòng xác nhận"
            visible={props.isOpenPopup}
            width={800}
            onOk={() => props.setIsOpenPopup(false)}
            onCancel={() => props.setIsOpenPopup(false)}
            footer={null}
        >
            <div>
                {collactingDtlConfirm.map((option: any) => {
                    return (
                        <>
                            <table style={{ width: '100%', fontSize: '12px' }} className='table'>
                                {option?.stt == 1
                                    ?
                                    <>
                                        <tr className="border-row">
                                            <td className='border-tdr' style={{ paddingLeft: '3px', fontWeight: 'bold' }}> Giao dịch phát sinh
                                            </td >
                                            <td className='border-tdr' style={{ textAlign: 'center', fontWeight: 'bold' }}>SL: {option?.counts ? formatCurrency(parseInt(option?.counts)) : ''}</td>
                                        </tr>
                                        <tr className="border-row">
                                            <td className='border-tdr' style={{ paddingLeft: '35px' }}>Cước</td>
                                            <td className='border-tdr' style={{ paddingRight: '5px', textAlign: 'right' }}>{option?.sumTotalFee ? formatCurrency(parseInt(option?.sumTotalFee)) + " đ" : ""} </td>
                                        </tr>
                                        <tr className="border-row">
                                            <td className='border-tdr' style={{ paddingLeft: '35px' }}>Tiền COD</td>
                                            <td className='border-tdr' style={{ paddingRight: '5px', textAlign: 'right' }}>{option?.sumCodeAmount ? formatCurrency(parseInt(option?.sumCodeAmount)) + " đ" : ""}</td>
                                        </tr>
                                    </>
                                    : null
                                }
                                {option?.stt == 2
                                    ? <>
                                        <tr className="border-row">
                                            <td className='border-tdr' style={{ paddingLeft: '3px', fontWeight: 'bold' }}> {option?.statusDtl.trim() == "1"
                                                ? "Đối soát thành công"
                                                : option?.statusDtl == "2" ? "Đối soát chưa thành công" : "Chưa đối soát"
                                            }</td>
                                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>SL: {option?.counts ? formatCurrency(parseInt(option?.counts)) : ''}</td>
                                        </tr>
                                        <tr className="border-row" >
                                            <td className='border-tdr' style={{ paddingLeft: '35px' }}>Cước</td>
                                            <td className='border-tdr' style={option?.statusDtl == "2" ? { paddingRight: '5px', textAlign: 'right', color: 'red' } : { paddingRight: '5px', textAlign: 'right' }}  >{option?.sumTotalFee ? formatCurrency(parseInt(option?.sumTotalFee)) + " đ" : ""}</td>
                                        </tr>
                                        <tr className="border-row" >
                                            <td className='border-tdr' style={{ paddingLeft: '35px' }}>Tiền COD</td>
                                            <td className='border-tdr' style={option?.statusDtl == "2" ? { paddingRight: '5px', textAlign: 'right', color: 'red' } : { paddingRight: '5px', textAlign: 'right' }}>{option?.sumCodeAmount ? formatCurrency(parseInt(option?.sumCodeAmount)) + " đ" : ""}</td>
                                        </tr>
                                    </>
                                    : null}
                            </table>
                            {option?.stt == 3
                                ?
                                <Row>
                                    <Col span={24} className='note'>
                                        {option?.statusHdr == "UNCONFIRMED" ?
                                            "Lưu ý: Sau ngày " + moment(option?.dateFrom, dateFormat).add(10, 'days').format(dateFormat) + " nếu bạn không xác nhận, hệ thống sẽ tự động xác nhận."
                                            :
                                            "Lưu ý: Dữ liệu đối soát chưa thành công sẽ chuyển sang kỳ đối soát gần nhất."
                                        }
                                    </Col>
                                </Row>
                                : null}
                        </>
                    )
                })}
                <Row style={{ marginTop: '10px' }}>
                    <Col span={24}
                        style={{ textAlign: 'center' }}
                    >
                        <Button className='height-btn1 btn-outline-success'
                            icon={<CheckCircleOutlined />}
                            style={{ marginRight: '20px' }}
                            onClick={onConFiml}
                        >Xác nhận</Button>
                        <Button className='height-btn1  btn-outline-secondary'
                            icon={<ExportOutlined />}
                            style={{ marginRight: '20px' }}
                            onClick={() => props.setIsOpenPopup(false)}
                        >Đóng</Button>
                    </Col>

                </Row>

            </div>

        </Modal>
    )


};
type Props = {
    isOpenPopup: boolean;
    idHdr: string;
    setIsOpenPopup: (isOpenPopup: boolean) => void;
}

export default FormConfirm;


