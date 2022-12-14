import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import moment from 'moment';
import { PageContainer } from "@ant-design/pro-layout";
import { Spin, Card, DatePicker, Input, Select, Row, Col, Button, Table } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { Columns } from './column';
import { useAdministrativeUnitList } from '@/core/selectors';
import { SearchCollatingDto } from '@/services/client';
import { notification } from 'antd';
import { upperCase } from 'lodash';
import { isBuffer } from 'lodash';

const { RangePicker } = DatePicker;

const SeachForControl = () => {
    const { initialState } = useModel('@@initialState')
    const user = initialState?.accountInfo;
    const administrativeUnitList = useAdministrativeUnitList();
    const unitList = administrativeUnitList.administrativeUnitList
    const { isLoading, isSaving, listOrg, colectingSearchData, getListOrg, getCollatingByParam, mcasOrganizationStandard, getListMcasOrganizationStandard } = useModel("forControlModelList");

    const [dateFrom, setDateFrom] = useState<string>(moment().subtract(1, 'months').startOf('month').format("DD-MM-YYYY"));
    // moment(dateFrom).subtract(1,'months').endOf('month').format('YYYY-MM-DD');
    const [dateTo, setDateTo] = useState<string>(moment().subtract(1, 'months').endOf('month').format("DD-MM-YYYY"));
    const [bdtCode, setBdtCode] = useState<string>("");
    const [lstBdtCode, setLstBdtCode] = useState<any[]>([]);
    const [bdhCode, setBdhCode] = useState<string>("");
    const [lstBdhCode, setLstBdhCode] = useState<any[]>([]);
    const [status, setStatus] = useState<string>("ALL");

    const [customerCode, setCustomerCode] = useState<string>();
    const [searchCollatingDto, setSearchCollatingDto] = useState<SearchCollatingDto>();
    const [infoOrgUnit, setInfoOrgUnit] = useState<any>();



    useEffect(() => {
        getListMcasOrganizationStandard('UNIT');
    }, []);

    useEffect(() => {
        if (mcasOrganizationStandard) {
            if (user?.org && user?.isEmployee == true) {
                const infoUnit: any = mcasOrganizationStandard.find((unit: any) => unit?.unitCode == user?.org);
                setInfoOrgUnit(infoUnit);
                if (infoUnit && infoUnit?.typeCode == '1') {
                    setBdtCode('ALL');
                    setBdhCode('ALL');
                    setLstBdtCode(mcasOrganizationStandard.filter((unit: any) => unit?.typeCode == "2"));
                    setLstBdhCode(mcasOrganizationStandard.filter((unit: any) => unit?.typeCode == "3"));
                } else if (infoUnit && infoUnit?.typeCode == '2') {
                    setBdtCode(infoUnit?.unitCode);
                    setBdhCode('ALL');
                    setLstBdtCode(mcasOrganizationStandard.filter((unit: any) => unit?.typeCode == "2" && unit?.unitCode == infoUnit?.provinceCode));
                    setLstBdhCode(mcasOrganizationStandard.filter((unit: any) => unit?.typeCode == "3" && unit?.parentCode === infoUnit?.unitCode));
                } else if (infoUnit && infoUnit?.typeCode == '3') {
                    setBdtCode(infoUnit?.provinceCode);
                    setBdhCode(infoUnit?.districtCode);
                    setLstBdtCode(mcasOrganizationStandard.filter((unit: any) => unit?.typeCode == "2" && unit?.unitCode == infoUnit?.provinceCode));
                    setLstBdhCode(mcasOrganizationStandard.filter((unit: any) => unit?.typeCode == "3" && unit?.unitCode == infoUnit?.districtCode));
                } else {
                    setBdtCode(infoUnit?.provinceCode);
                    setBdhCode(infoUnit?.districtCode);
                    setLstBdtCode(mcasOrganizationStandard.filter((unit: any) => unit?.typeCode == "2" && unit?.unitCode == infoUnit?.provinceCode));
                    setLstBdhCode(mcasOrganizationStandard.filter((unit: any) => unit?.typeCode == "3" && unit?.unitCode == infoUnit?.districtCode));
                }
            }

        }

    }, [mcasOrganizationStandard]);

    // console.log('lstBdtCode', lstBdtCode);


    const onChangeSelect = (value: any, param: any) => {
        console.log("value", value, param);
        if (param == "bdtCode") {
            setBdtCode(value);
            setBdhCode("ALL");
        }
        if (param == "bdhCode") {
            setBdhCode(value);
        }
        if (param == "kyDoiSoat") {
            if (value == "MONTH") {
                setDateFrom(moment().subtract(1, 'months').startOf('month').format("DD-MM-YYYY"));
                setDateTo(moment().subtract(1, 'months').endOf('month').format("DD-MM-YYYY"));
            } else {
                setDateFrom(moment().subtract(1, 'weeks').startOf('week').format("DD-MM-YYYY"));
                setDateTo(moment().subtract(1, 'weeks').endOf('week').format("DD-MM-YYYY"));
            }
        }
        if (param == "status") {
            setStatus(value);
        }
    }
    function validParamCondition() {
        // if (!bdtCode || bdtCode == "ALL") {
        //     return {
        //         status: false,
        //         mess: "T???nh qu???n l?? l?? b???t bu???c",
        //         id: ''
        //     }
        // }
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
        if (infoOrgUnit && infoOrgUnit?.typeCode > 3) {
            return {
                status: false,
                mess: "Kh??ng c?? quy???n truy xu???t d??? li???u",
                id: ''
            }
        }
        return {
            status: true,
            mess: '',
            id: ''
        };
    }

    const onSearchData = () => {
        const paramCondition = validParamCondition();
        if (paramCondition?.status) {
            const param = {
                "customerCode": customerCode,
                "bdtCode": bdtCode == "ALL" ? undefined : bdtCode,
                "bdhCode": bdhCode == "ALL" ? undefined : bdhCode,
                "dateFrom": dateFrom,
                "dateTo": dateTo,
                "status": status == "ALL" ? undefined : status
            }
            getCollatingByParam(param);
        } else {
            notification.error({
                message: paramCondition.mess,
            });
        }

    }

    const changeInput = (e: any, param: string) => {
        console.log(e);
        if (param == "setCustomerCode") {
            setCustomerCode(e?.target?.value);
        }
    }

    const onChange = (date: any, dateString: any, param: any) => {
        console.log(dateString, param);
        if (param == "dateFrom") {
            setDateFrom(dateString);
        }
        if (param == "dateTo") {
            setDateTo(dateString);
        }
    }
    // console.log(bdtCode, bdhCode, infoOrgUnit);

    return (
        <>
            <Spin spinning={isLoading}>
                <Card title="Tra c???u t??nh h??nh ?????i so??t" size='small' bordered={false}>
                    <Row gutter={24}>
                        <Col span={3}><label className='label'>T???nh qu???n l??</label></Col>
                        <Col span={9}>
                            <Select style={{ width: "100%" }}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => upperCase((option!.children as unknown as string)).includes(upperCase(input))}
                                value={bdtCode}
                                disabled={infoOrgUnit && parseInt(infoOrgUnit?.typeCode) > 1 ? true : false}
                                onChange={(value) => onChangeSelect(value, "bdtCode")}
                                allowClear
                                onClear={() => setBdtCode('ALL')}
                            >
                                <Select.Option key={-1} value="ALL">T???t c???</Select.Option>
                                {lstBdtCode.map((row: any) => {
                                    return (
                                        <Select.Option key={row?.unitCode} value={row?.unitCode}> {row?.unitCode + '-' + row?.unitName}</Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                        {/* <Col span={4} /> */}
                        <Col span={3} ><label className='label'>Huy???n qu???n l??</label></Col>
                        <Col span={9}>
                            <Select style={{ width: "100%", marginLeft: '2px' }}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => upperCase((option!.children as unknown as string)).includes(upperCase(input))}
                                value={bdhCode}
                                disabled={infoOrgUnit && parseInt(infoOrgUnit?.typeCode) > 2 ? true : false}
                                onChange={(value) => onChangeSelect(value, "bdhCode")}
                                allowClear
                                onClear={() => setBdhCode("ALL")}
                            >
                                <Select.Option key={-1} value="ALL">T???t c???</Select.Option>
                                {lstBdhCode.map((row: any) => {
                                    return (
                                        <Select.Option key={row?.unitCode} value={row?.unitCode}> {row?.unitCode + '-' + row?.unitName}</Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                    </Row>
                    <p />
                    <Row gutter={24}>
                        <Col span={3}><label className='label'>M?? kh??ch h??ng</label></Col>
                        <Col span={9}>
                            <Input className='input-custome' placeholder="" onChange={(e) => changeInput(e, "setCustomerCode")} />
                        </Col>
                        {/* <Col span={4} /> */}
                        <Col span={3}><label className='label'>Chu k??? ?????i so??t</label></Col>

                        <Col span={9}>
                            <Select style={{ width: "100%" }} className='input-custome'
                                onChange={(value) => onChangeSelect(value, "kyDoiSoat")}
                                defaultValue="MONTH">
                                <Select.Option key={'WEEK'} value="WEEK">Tu???n</Select.Option>
                                <Select.Option key={'MONTH'} value="MONTH">Th??ng</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                    <p />
                    <Row gutter={24}>
                        <Col span={3}><label className='label'>K??? t??? ng??y</label></Col>
                        <Col span={9}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format={"DD-MM-YYYY"}
                                value={dateFrom ? moment(dateFrom, "DD-MM-YYYY") : null}
                                defaultValue={moment('01-01-2021', "DD-MM-YYYY")}
                                onChange={(date, dateString) => onChange(date, dateString, "dateFrom")} />
                        </Col>
                        {/* <Col span={4} /> */}
                        <Col span={3}><label className='label'>K??? ?????n ng??y</label></Col>
                        <Col span={9}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format={"DD-MM-YYYY"}
                                value={dateTo ? moment(dateTo, "DD-MM-YYYY") : null}
                                onChange={(date, dateString) => onChange(date, dateString, "dateTo")} />
                        </Col>
                    </Row>
                    <p />
                    <Row gutter={24}>
                        <Col span={3}><label className='label'>T??nh tr???ng</label></Col>
                        <Col span={9}>
                            <Select style={{ width: "100%" }}
                                onChange={(value) => onChangeSelect(value, "status")}
                                defaultValue="ALL"
                            >
                                <Select.Option key={-1} value={"ALL"}>T???t c???</Select.Option>
                                <Select.Option key={0} value={0}>Ch??a x??c nh???n</Select.Option>
                                <Select.Option key={1} value={1}>???? x??c nh???n</Select.Option>
                            </Select>
                        </Col>
                        {/* <Col flex="auto" /> */}

                    </Row>
                    <br />
                    <Row >
                        <Col flex="auto" style={{ textAlign: 'center' }}>
                            <Button className='height-btn2 btn-outline-info' icon={<SearchOutlined />} onClick={() => onSearchData()}>T??m ki???m</Button>
                        </Col>

                    </Row>
                </Card>
                <Card size='small' bordered={false}>
                    <Table
                        bordered
                        // onRow={record => ({
                        //     onClick: (e) => handleClick(record)
                        // })}

                        columns={Columns}
                        dataSource={colectingSearchData}
                        // pagination={false}
                        rowKey={record => record.uid}
                        size="small"

                    />
                </Card>

            </Spin>
        </>
    )
}
export default SeachForControl;