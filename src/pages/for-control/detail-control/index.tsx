import React, { useState, useEffect } from 'react';
import { useModel, Link, useHistory, useParams } from 'umi';
import { Spin, Card, Row, Col, Button, Tooltip } from "antd";
import DetailOrderHdrItem from '../component/detail-orderhdr-item/detail-item';
import FormConfirm from '../component/confirm/form-confirm';
import './style.css';
import { formatCurrency } from '@/utils';
import { CheckCircleOutlined, DownloadOutlined, ExportOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import FileSaver from "file-saver";
import axios from 'axios';

const DetailControl = (props: Props) => {
    const { idHdr, dateFrom, dateTo, statusHdr, collactingDtlData, fileExportDtl, setFileExportDtl, dateFromFormControl, dateToFormControl, exportExcelDtl, getCollatingDtlDataSearch } = useModel("forControlModelList");
    // const [param, setParam] = useState<any>(props?.history?.location?.state);
    const [showDetailOrderHdr, setShowDetailOrderHdr] = useState(false);
    const [showFormConFirm, setShowFormConfirm] = useState(false);
    const [itemCode, setItemCode] = useState<string>();
    const [collactingDtlId, setCollagtingDtlId] = useState<string>();
    const { initialState } = useModel('@@initialState')
    const history = useHistory();
    const user = initialState?.accountInfo;
    const params: any = useParams();
    const id = params.id;

    useEffect(() => {
        if (id) {
            getCollatingDtlDataSearch(id);
        }
    }, [])

    // useEffect(() => {
    //     if (fileExportDtl) {
    //         const blob = new Blob([fileExportDtl], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //         const url = window.URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute(
    //             'download',
    //             'COLLATING_DETAILS.xlsx',
    //         );
    //         document.body.appendChild(link);
    //         link.click();
    //         link.parentNode?.removeChild(link);
    //         setFileExportDtl(undefined);
    //     }
    // }, [fileExportDtl])

    const onOpenDetailOrderHdr = (value: any) => {
        setShowDetailOrderHdr(true);
        setItemCode(value?.item_code);
        setCollagtingDtlId(value?.collactingDtlId);
    }
    const onConFiml = () => {
        setShowFormConfirm(true);
    }

    const exitForm = () => {
        history.push("/for-control/control");
    }

    const downloadFile = () => {
        exportExcelDtl(idHdr, (success: any, data) => {
            if (success) {
                console.log("fileExportDtl", data);

                if (data) {
                    const blob = new Blob([data], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute(
                        'download',
                        'COLLATING_DETAILS.xlsx',
                    );
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode?.removeChild(link);
                }
            }
        });

        // test();
    }

    // function test() {
    //     axios({
    //         url: 'http://localhost:8889/v1/collating/exportExcelDtlCollating?idCollating=6700',
    //         method: 'GET',
    //         responseType: 'blob', // important
    //     }).then((response) => {
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', 'COLLATING_DETAILS.xlsx'); //or any other extension
    //         document.body.appendChild(link);
    //         link.click();
    //     });
    // }

    return (
        <>
            <Spin spinning={false}>
                <Card title={"Chi ti???t ?????i so??t_t??? " + dateFromFormControl + " ?????n " + dateToFormControl} >
                    <Row>
                        <Col span={24} style={{ fontStyle: 'italic', height: '60px', textAlign: 'center', color: '#fd9713' }}>L??u ??: N???u ph??t hi???n sai l???ch, h??y ch???n s??? hi???u b??u g???i ????? xem chi ti???t v?? g???i y??u c???u h??? tr???</Col>
                    </Row>
                    <Row style={{ margin: "3px", fontSize: '16px', fontWeight: 'bold' }}>
                        {collactingDtlData[0]?.customerCode ? collactingDtlData[0]?.customerCode : ""}{collactingDtlData[0]?.customerCode == user?.org ? "_" + user?.ufn : ""}
                    </Row>
                    <table id="table-detail-control">
                        <tr>
                            <th style={{ textAlign: 'center' }}>Th???i gian / M?? v???n ????n</th>
                            <th style={{ textAlign: 'center' }}>S??? l?????ng</th>
                            <th style={{ textAlign: 'center' }}>C?????c</th>
                            <th style={{ textAlign: 'center' }}>COD</th>
                        </tr>
                        {collactingDtlData.map((option: any) => {
                            return (
                                <tbody>
                                    <>
                                        {/* Dong cha */}
                                        {option?.stt == 1 ?
                                            <tr>
                                                <td style={{ fontWeight: 'bold' }}>{option?.acceptedDate}</td>
                                                <td style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: '20px' }}>{option?.numberDtl ? formatCurrency(parseInt(option?.numberDtl)) : ''}</td>
                                                <td style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: '20px' }}>{option?.totalFee ? formatCurrency(parseInt(option?.totalFee)) : ''}</td>
                                                <td style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: '20px' }}>{option?.codAmount ? formatCurrency(parseInt(option?.codAmount)) : ''}</td>
                                            </tr>
                                            : null}
                                        {/* Dong con */}
                                        {option?.stt == 2 ?
                                            <tr>
                                                <td>
                                                    <Button className='btn-detail-control' style={{ border: 'none', color: '#007bff' }}
                                                        onClick={() => onOpenDetailOrderHdr(option)}
                                                    >{option?.item_code}  </Button>
                                                    {option?.status == '2' ? <Tooltip title="B??u g???i n??y s??? ???????c ki???m tra x??c nh???n, k??? to??n v??o k?? ti???p theo">
                                                        <ExclamationCircleOutlined />
                                                    </Tooltip> : null}
                                                </td>
                                                <td />
                                                <td style={{ textAlign: 'right', paddingRight: '20px' }}>{option?.totalFee ? formatCurrency(parseInt(option?.totalFee)) : ''}</td>
                                                <td style={{ textAlign: 'right', paddingRight: '20px' }}>{option?.codAmount ? formatCurrency(parseInt(option?.codAmount)) : ''}</td>
                                            </tr>
                                            : null}
                                    </></tbody>
                            )
                        })}
                    </table>
                </Card>
                <Card >
                    <Row>
                        <Col span={24}
                            style={{ textAlign: 'center' }}
                        >
                            <Button className='height-btn1 btn-outline-success'
                                icon={<CheckCircleOutlined />}
                                style={{ marginRight: '20px' }}
                                onClick={onConFiml}
                                disabled={statusHdr || collactingDtlData[0]?.customerCode != user?.org}>X??c nh???n</Button>
                            <Button className='height-btn1 btn-outline-info' icon={<DownloadOutlined />} style={{ marginRight: '20px' }} onClick={() => downloadFile()}>K???t xu???t</Button>
                            <Button className='height-btn1  btn-outline-secondary' icon={<ExportOutlined />} style={{ marginRight: '20px' }} onClick={exitForm} >????ng</Button>
                        </Col>

                    </Row>
                </Card>
                <DetailOrderHdrItem
                    isOpenPopup={showDetailOrderHdr}
                    setIsOpenPopup={setShowDetailOrderHdr}
                    itemCode={itemCode ? itemCode : ""}
                    customerCode={collactingDtlData[0]?.customerCode}
                    collactingDtlId={collactingDtlId ? collactingDtlId : ""}
                    collactingHdrId={id ? id : ""}
                />
                <FormConfirm isOpenPopup={showFormConFirm} setIsOpenPopup={setShowFormConfirm} idHdr={idHdr} />

            </Spin>
        </>
    )
}

type Props = {
    dateFrom: string,
    dateTo: string,
    history: any,
}
export default DetailControl;