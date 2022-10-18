import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import moment from 'moment';
import { PageContainer } from "@ant-design/pro-layout";
import { Spin, Card, DatePicker, Input, Select, Row, Col, Button, Table } from "antd";
import { PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { downloadFile } from '@/utils';
const defaultTemplate = 'Buu_gui_chuyen_ky';
const ReportControl = () => {
    const { strBase64Report, setStrBase64Report, isLoading, getExportReport } = useModel("forControlModelList");
    const [template, setTemplate] = useState<string>(defaultTemplate);
    const [customerCode, setCustomerCode] = useState<string>();
    const [dateFrom, setDateFrom] = useState<string>(moment().format("DD-MM-YYYY"));
    const [dateTo, setDateTo] = useState<string>(moment().format("DD-MM-YYYY"));

    useEffect(() => {
        if (strBase64Report) {
            console.log("strBase64Report", strBase64Report);

            // const lstType = split(fileName, ".");
            // const extension = lstType[lstType.length - 1];
            // const mimeType = MimeType[MimeType.findIndex((item) => item.extension == extension)]!.mimeType;
            // const lstPath = split(fileName, "/");
            // const namePath = lstPath[lstPath.length - 1];
            // console.log("down: ", strBase64Report, namePath, mimeType);
            downloadFile(strBase64Report, template, "application/pdf");
            // setStringBase64("");
        }
    }, [strBase64Report])

    const onChangeDate = (date, dateString: any, param: any) => {
        console.log(dateString, param);
        if (param == "dateFrom") {
            setDateFrom(dateString);
        }
        if (param == "dateTo") {
            setDateTo(dateString);
        }
    }
    const changeInput = (e: any, param: string) => {
        if (param == "customer_code") {
            setCustomerCode(e?.target?.value);
        }
    }
    const onChangeSelect = (value: any, param: any) => {
        if (param == "template") {
            setTemplate(value);
        }
    }
    function validParamCondition() {
        if (!dateFrom) {
            return {
                status: false,
                mess: "Kỳ từ ngày là bắt buộc",
                id: ''
            }
        }
        if (!dateTo) {
            return {
                status: false,
                mess: "Kỳ đến ngày là bắt buộc",
                id: ''
            }
        }
        if (dateFrom && dateTo && moment(dateFrom, "DD-MM-YYYY") > moment(dateTo, "DD-MM-YYYY")) {
            return {
                status: false,
                mess: "Kỳ từ ngày phải nhỏ hơn kỳ đến ngày",
                id: ''
            }
        }
        if (template == 'Buu_gui_chuyen_ky' || template == 'Phat_sinh_buu_gui') {
            if (!customerCode) {
                return {
                    status: false,
                    mess: "Mã khách hàng là bắt buộc",
                    id: ''
                }
            }
        }
        return {
            status: true,
            mess: '',
            id: ''
        };
    }
    const onExportData = () => {
        console.log(template, customerCode, dateFrom, dateTo);
        const paramCondition = validParamCondition();
        console.log("paramCondition", paramCondition);

        if (paramCondition?.status) {
            // customerCode, printName, dateFrom, dateTo
            getExportReport(
                dateFrom,
                dateTo,
                template,
                customerCode ? customerCode : undefined
            )
        } else {
            notification.error({
                message: paramCondition.mess,
            });
        }
    }
    return (
        <>
            <Spin spinning={isLoading}>
                <Card title="Báo cáo đối soát" size='small' bordered={false}>
                    <Row gutter={24}>
                        <Col span={3}><label className='label'>Mẫu báo cáo</label></Col>
                        <Col span={9}>
                            <Select style={{ width: "100%" }}
                                onChange={(value) => onChangeSelect(value, "template")}
                                defaultValue={defaultTemplate}>
                                <Select.Option key={1} value="Buu_gui_chuyen_ky">Bảng kê chi tiết bưu gửi chuyển kỳ đối soát</Select.Option>
                                <Select.Option key={2} value="Tong_hop_theo_KH">Báo cáo tổng hợp đối soát theo khách hàng</Select.Option>
                                <Select.Option key={3} value="Phat_sinh_buu_gui">Bảng kê đối soát chi tiết xác nhận phát sinh bưu gửi</Select.Option>
                            </Select>
                        </Col>
                        <Col span={3}><label className='label'>Mã khách hàng</label> {template == 'Buu_gui_chuyen_ky' || template == 'Phat_sinh_buu_gui' ? <span style={{ color: 'red' }}> *</span> : ''} </Col>
                        <Col span={9}>
                            <Input placeholder="" className='input-custome'
                                onChange={(e) => changeInput(e, "customer_code")}
                            />
                        </Col>
                    </Row>
                    <p />
                    <Row gutter={24}>
                        <Col span={3}><label className='label'>Kỳ từ ngày</label><span style={{ color: 'red' }}> *</span> </Col>
                        <Col span={9}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format={"DD-MM-YYYY"}
                                value={dateFrom ? moment(dateFrom, "DD-MM-YYYY") : null}
                                defaultValue={moment('01-01-2021', "DD-MM-YYYY")}
                                onChange={(date, dateString) => onChangeDate(date, dateString, "dateFrom")} />
                        </Col>
                        <Col span={3}> <label className='label'>Kỳ đến ngày</label> <span style={{ color: 'red' }}> *</span></Col>
                        <Col span={9}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format={"DD-MM-YYYY"}
                                value={dateTo ? moment(dateTo, "DD-MM-YYYY") : null}
                                onChange={(date, dateString) => onChangeDate(date, dateString, "dateTo")} />
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col span={3}><label className='label'>Mẫu báo cáo</label></Col>
                        <Col span={6}>
                            <Select style={{ width: "100%" }}
                                onChange={(value) => onChangeSelect(value, "template")}
                                defaultValue={defaultTemplate}>
                                <Select.Option key={1} value="Buu_gui_chuyen_ky">Bảng kê chi tiết bưu gửi chuyển kỳ đối soát</Select.Option>
                                <Select.Option key={2} value="Tong_hop_theo_KH">Báo cáo tổng hợp đối soát theo khách hàng</Select.Option>
                                <Select.Option key={3} value="Phat_sinh_buu_gui">Bảng kê đối soát chi tiết xác nhận phát sinh bưu gửi</Select.Option>
                            </Select>
                        </Col>
                        <Col span={4} />
                        <Col span={3}><label className='label'>Mã khách hàng</label> {template == 'Buu_gui_chuyen_ky' || template == 'Phat_sinh_buu_gui' ? <span style={{ color: 'red' }}>*</span> : ''} </Col>
                        <Col span={6}>
                            <Input placeholder="" className='input-custome'
                                onChange={(e) => changeInput(e, "customer_code")}
                            />
                        </Col>
                        <Col flex="auto" />
                    </Row> */}
                    {/* <p /> */}
                    {/* <Row>
                        <Col span={3}><label className='label'> Kỳ từ ngày</label><span style={{ color: 'red' }}>*</span> </Col>
                        <Col span={6}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format={"DD-MM-YYYY"}
                                value={dateFrom ? moment(dateFrom, "DD-MM-YYYY") : null}
                                defaultValue={moment('01-01-2021', "DD-MM-YYYY")}
                                onChange={(date, dateString) => onChangeDate(date, dateString, "dateFrom")} />
                        </Col>
                        <Col span={4} />
                        <Col span={3}> <label className='label'> Kỳ đến ngày</label> <span style={{ color: 'red' }}>*</span></Col>
                        <Col span={6}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format={"DD-MM-YYYY"}
                                value={dateTo ? moment(dateTo, "DD-MM-YYYY") : null}
                                onChange={(date, dateString) => onChangeDate(date, dateString, "dateTo")} />
                        </Col>
                        <Col flex="auto" />
                    </Row> */}
                </Card>
                <Card size='small' bordered={false}>
                    <Row >
                        <Col flex="auto" style={{ textAlign: 'center' }}>
                            <Button className='height-btn2 btn-outline-success' icon={<PrinterOutlined />} onClick={() => onExportData()}>In báo cáo</Button>
                        </Col>
                    </Row>
                </Card>

            </Spin>
        </>
    )

}
export default ReportControl;