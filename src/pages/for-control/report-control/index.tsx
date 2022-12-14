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
                mess: "K??? t??? ng??y l?? b???t bu???c",
                id: ''
            }
        }
        if (!dateTo) {
            return {
                status: false,
                mess: "K??? ?????n ng??y l?? b???t bu???c",
                id: ''
            }
        }
        if (dateFrom && dateTo && moment(dateFrom, "DD-MM-YYYY") > moment(dateTo, "DD-MM-YYYY")) {
            return {
                status: false,
                mess: "K??? t??? ng??y ph???i nh??? h??n k??? ?????n ng??y",
                id: ''
            }
        }
        if (template == 'Buu_gui_chuyen_ky' || template == 'Phat_sinh_buu_gui') {
            if (!customerCode) {
                return {
                    status: false,
                    mess: "M?? kh??ch h??ng l?? b???t bu???c",
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
                <Card title="B??o c??o ?????i so??t" size='small' bordered={false}>
                    <Row gutter={24}>
                        <Col span={3}><label className='label'>M???u b??o c??o</label></Col>
                        <Col span={9}>
                            <Select style={{ width: "100%" }}
                                onChange={(value) => onChangeSelect(value, "template")}
                                defaultValue={defaultTemplate}>
                                <Select.Option key={1} value="Buu_gui_chuyen_ky">B???ng k?? chi ti???t b??u g???i chuy???n k??? ?????i so??t</Select.Option>
                                <Select.Option key={2} value="Tong_hop_theo_KH">B??o c??o t???ng h???p ?????i so??t theo kh??ch h??ng</Select.Option>
                                <Select.Option key={3} value="Phat_sinh_buu_gui">B???ng k?? ?????i so??t chi ti???t x??c nh???n ph??t sinh b??u g???i</Select.Option>
                            </Select>
                        </Col>
                        <Col span={3}><label className='label'>M?? kh??ch h??ng</label> {template == 'Buu_gui_chuyen_ky' || template == 'Phat_sinh_buu_gui' ? <span style={{ color: 'red' }}> *</span> : ''} </Col>
                        <Col span={9}>
                            <Input placeholder="" className='input-custome'
                                onChange={(e) => changeInput(e, "customer_code")}
                            />
                        </Col>
                    </Row>
                    <p />
                    <Row gutter={24}>
                        <Col span={3}><label className='label'>K??? t??? ng??y</label><span style={{ color: 'red' }}> *</span> </Col>
                        <Col span={9}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format={"DD-MM-YYYY"}
                                value={dateFrom ? moment(dateFrom, "DD-MM-YYYY") : null}
                                defaultValue={moment('01-01-2021', "DD-MM-YYYY")}
                                onChange={(date, dateString) => onChangeDate(date, dateString, "dateFrom")} />
                        </Col>
                        <Col span={3}> <label className='label'>K??? ?????n ng??y</label> <span style={{ color: 'red' }}> *</span></Col>
                        <Col span={9}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format={"DD-MM-YYYY"}
                                value={dateTo ? moment(dateTo, "DD-MM-YYYY") : null}
                                onChange={(date, dateString) => onChangeDate(date, dateString, "dateTo")} />
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col span={3}><label className='label'>M???u b??o c??o</label></Col>
                        <Col span={6}>
                            <Select style={{ width: "100%" }}
                                onChange={(value) => onChangeSelect(value, "template")}
                                defaultValue={defaultTemplate}>
                                <Select.Option key={1} value="Buu_gui_chuyen_ky">B???ng k?? chi ti???t b??u g???i chuy???n k??? ?????i so??t</Select.Option>
                                <Select.Option key={2} value="Tong_hop_theo_KH">B??o c??o t???ng h???p ?????i so??t theo kh??ch h??ng</Select.Option>
                                <Select.Option key={3} value="Phat_sinh_buu_gui">B???ng k?? ?????i so??t chi ti???t x??c nh???n ph??t sinh b??u g???i</Select.Option>
                            </Select>
                        </Col>
                        <Col span={4} />
                        <Col span={3}><label className='label'>M?? kh??ch h??ng</label> {template == 'Buu_gui_chuyen_ky' || template == 'Phat_sinh_buu_gui' ? <span style={{ color: 'red' }}>*</span> : ''} </Col>
                        <Col span={6}>
                            <Input placeholder="" className='input-custome'
                                onChange={(e) => changeInput(e, "customer_code")}
                            />
                        </Col>
                        <Col flex="auto" />
                    </Row> */}
                    {/* <p /> */}
                    {/* <Row>
                        <Col span={3}><label className='label'> K??? t??? ng??y</label><span style={{ color: 'red' }}>*</span> </Col>
                        <Col span={6}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format={"DD-MM-YYYY"}
                                value={dateFrom ? moment(dateFrom, "DD-MM-YYYY") : null}
                                defaultValue={moment('01-01-2021', "DD-MM-YYYY")}
                                onChange={(date, dateString) => onChangeDate(date, dateString, "dateFrom")} />
                        </Col>
                        <Col span={4} />
                        <Col span={3}> <label className='label'> K??? ?????n ng??y</label> <span style={{ color: 'red' }}>*</span></Col>
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
                            <Button className='height-btn2 btn-outline-success' icon={<PrinterOutlined />} onClick={() => onExportData()}>In b??o c??o</Button>
                        </Col>
                    </Row>
                </Card>

            </Spin>
        </>
    )

}
export default ReportControl;