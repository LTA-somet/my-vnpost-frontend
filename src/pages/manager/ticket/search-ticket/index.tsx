import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Spin, Card, DatePicker, Form, Input, Select, Upload, Row, Col, Button, Table, message, Tooltip } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { useCategoryAppParamList } from '@/core/selectors';
import { notification } from 'antd';
import moment from 'moment';
import TicketViewDetail from '../ticket-detail/ticket-view-detail';
import { upperCase } from 'lodash';
const { RangePicker } = DatePicker;
const { Option } = Select;
const SearchTicket = () => {
    const { initialState } = useModel('@@initialState');
    const user = initialState?.accountInfo;
    const { isLoading, ticketList, ticketGroupReason, seachTicket, getTicketGroupType, getTicketGroupStatus, ticketGroupStatus } = useModel('ticketModelList');
    const { opAccounts, getOpAccountChild } = useModel('productList');
    const [searchTime, setSearchTime] = useState<string[]>([]);
    const [paramSearch, setParamSeach] = useState<any>({});
    const [showTicketViewDetail, setShowTicketViewDetail] = useState<boolean>(false);
    const [ticketDetail, setTicketDetail] = useState<any>({});
    const [account, setAccount] = useState<any>(user?.uid);

    const TTK_STATUS = useCategoryAppParamList().filter((c) => c.type === 'TTK_STATUS');


    useEffect(() => {
        setSearchTime([moment().format("DD/MM/YYYY"), moment().format("DD/MM/YYYY")])
        getTicketGroupType("TKREASON");
        getTicketGroupStatus("STATUS");
        getOpAccountChild();
    }, []);

    const onChangeToDateFromDate = (_dates: any, dateStrings: any) => {
        setSearchTime(dateStrings)
    }
    // console.log("dateStrings", searchTime);

    const changeSelected = (value: any, label: any) => {
        console.log(value);

        paramSearch[label] = value;
        setParamSeach(paramSearch);
    }

    const changeInput = (e: any, label: any) => {
        console.log('Change:', e.target.value)
        paramSearch[label] = e.target.value;
        setParamSeach(paramSearch);
    }
    // console.log("praam", paramSearch);
    // console.log('user', user);
    // console.log("TTK_STATUS", TTK_STATUS);

    function validParamCondition() {
        console.log("validParamCondition", searchTime);
        if (searchTime.length < 2) {
            return {
                status: false,
                mess: "Ch??a nh???p th???i gian tra c???u",
                id: ''
            }
        } else {
            const fromDate = moment(searchTime[0], 'DD/MM/YYYY');
            const toDate = moment(searchTime[1], 'DD/MM/YYYY');
            const fromDate30Day = moment(fromDate).add('day', 30);
            if (fromDate > toDate) {
                return {
                    status: false,
                    mess: "T??? ng??y ph???i nh??? h??n ?????n ng??y",
                    id: ''
                }
            } else {
                if (fromDate30Day < toDate) {
                    return {
                        status: false,
                        mess: "Kho???ng c??ch t??? ng??y, ?????n ng??y kh??ng ???????c qu?? 30 ng??y",
                        id: ''
                    }
                }

            }
        }
        return {
            status: true,
            mess: '',
            id: ''
        };
    }

    const onSearchData = () => {
        console.log("paramSearch", paramSearch);
        const paramCondition = validParamCondition();
        console.log("paramCondition", paramCondition);

        if (paramCondition?.status) {
            paramSearch.createdDateFrom = searchTime[0];
            paramSearch.createdDateTo = searchTime[1];
            paramSearch.ttkReason = paramSearch?.ttkReason == "ALL" ? null : paramSearch?.ttkReason;
            paramSearch.ttkCode = paramSearch?.ttkCode ? paramSearch?.ttkCode : null;
            paramSearch.ttkStatus = paramSearch?.ttkStatus == "ALL" ? null : paramSearch?.ttkStatus;
            paramSearch.accntCode = account;
            paramSearch.parcelId = paramSearch?.parcelId ? paramSearch?.parcelId : null;
            seachTicket(paramSearch);
        } else {
            console.log("false");
            notification.error({
                message: paramCondition.mess,
            });
        }
    }
    const handleClick = (record: any) => {
        console.log("row", record);
        setShowTicketViewDetail(true);
        setTicketDetail(record);
    }

    const Columns = [
        {
            title: "STT",
            render: (item: any, record: any, index: number) => (
                <>{index + 1}</>
            )
        },
        {
            title: "M?? y??u c???u",
            dataIndex: "ttkCode",
            key: "ttkCode",
            render: (item: any, record: any, index: number) => (
                <Tooltip title="Xem chi ti???t">
                    <a onClick={() => handleClick(record)}>{record.ttkCode}</a>
                </Tooltip>
            )
        },
        { title: "Ng??y t???o", dataIndex: "createdDate", key: "createdDate" },
        { title: "Lo???i", dataIndex: "reasonName", key: "reasonName" },
        { title: "S??? hi???u b??u g???i", dataIndex: "parcelId", key: "parcelId" },
        { title: "Ng?????i nh???n", dataIndex: "poRecipientName", key: "poRecipientName" },
        { title: "Tr???ng th??i x??? l??", dataIndex: "ttkStatusName", key: "ttkStatusName" },
    ];



    const key = 'tkcodeMyvnp';

    const arrayUniqueByKey = [...ticketGroupStatus].filter((v, index) => {
        return ticketGroupStatus.findIndex(object => {
            return object[key] === v[key];
        }) == index;
    })

    return (
        <>
            <Spin spinning={isLoading}>
                <Card >
                    <Row gutter={24}>
                        <Col span={3}><label className='label'>Th???i gian t???o</label></Col>
                        <Col className='config-height' span={9}>
                            <RangePicker
                                defaultValue={[moment(), moment()]}
                                placeholder={["T??? ng??y", "?????n ng??y"]}
                                style={{ width: "100%" }}
                                ranges={{
                                    'H??m nay': [moment(), moment()],
                                    'H??m qua': [moment().subtract(1, 'days'), moment()],
                                    '7 ng??y tr?????c': [moment().subtract(7, 'days'), moment()],
                                    '30 ng??y tr?????c': [moment().subtract(30, 'days'), moment()],
                                    'Th??ng n??y': [moment().startOf('month'), moment()],
                                    'Th??ng tr?????c': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                                }}
                                format="DD/MM/YYYY"
                                onChange={onChangeToDateFromDate}
                            />
                        </Col>
                        <Col span={3}><label className='label'>Lo???i y??u c???u</label></Col>
                        <Col className='config-height' span={9}>
                            <Select style={{ width: "100%" }}
                                defaultValue="ALL"
                                onChange={(value) => changeSelected(value, "ttkReason")} allowClear>
                                <Select.Option key="ALL" value="ALL">T???t c???</Select.Option>
                                {ticketGroupReason.map((option) => {
                                    return (
                                        <Select.Option key={option?.tkcodeCms} value={option?.tkcodeCms}> {option?.tknameMyvnp}</Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col className='config-height' span={3}><label className='label'>M?? y??u c???u</label></Col>
                        <Col span={9}>
                            <Input className='input-custome' placeholder="" onChange={(e) => changeInput(e, "ttkCode")} />
                        </Col>
                        <Col span={3}><label className='label'>Tr???ng th??i </label></Col>
                        <Col className='config-height' span={9}>
                            <Select style={{ width: "100%" }} defaultValue="ALL"
                                onChange={(value) => changeSelected(value, "ttkStatus")}
                            >
                                <Select.Option key={-1} value="ALL">T???t c???</Select.Option>
                                {arrayUniqueByKey.map((row, i) => {
                                    return (
                                        <Select.Option key={row?.tkcodeMyvnp} > {row?.tknameMyvnp}</Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col className='config-height' span={3}><label className='label'>Ng?????i t???o</label></Col>
                        <Col span={9}>
                            <Select
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => upperCase((option!.children as unknown as string)).includes(upperCase(input))}
                                placeholder="T??i kho???n qu???n l??"
                                // allowClear
                                style={{ width: '100%' }}
                                value={account}
                                onChange={(value) => setAccount(value)}
                                tokenSeparators={[',']}>
                                {opAccounts?.map(row => (
                                    <Option key={row.value} value={row.value}>{row.label}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={3}><label className='label'>S??? hi???u b??u g???i</label></Col>
                        <Col span={9}>
                            <Input className='input-custome' placeholder="" onChange={(e) => changeInput(e, "parcelId")} />
                        </Col>
                    </Row>
                    <Row>
                        <Col flex="auto" style={{ textAlign: 'center' }}>
                            <Button className='height-btn2 btn-outline-info' icon={<SearchOutlined />} onClick={() => onSearchData()}>T??m ki???m</Button>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Table
                        bordered
                        columns={Columns}
                        dataSource={ticketList}
                        // pagination={false}
                        rowKey="STT"
                        size="small"
                    />
                </Card>
                <TicketViewDetail isOpenPopup={showTicketViewDetail} setIsOpenPopup={setShowTicketViewDetail} ticketDetail={ticketDetail} />
            </Spin>
        </>
    )
}
export default SearchTicket;