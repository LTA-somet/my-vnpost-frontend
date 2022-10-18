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
                mess: "Chưa nhập thời gian tra cứu",
                id: ''
            }
        } else {
            const fromDate = moment(searchTime[0], 'DD/MM/YYYY');
            const toDate = moment(searchTime[1], 'DD/MM/YYYY');
            const fromDate30Day = moment(fromDate).add('day', 30);
            if (fromDate > toDate) {
                return {
                    status: false,
                    mess: "Từ ngày phải nhỏ hơn đến ngày",
                    id: ''
                }
            } else {
                if (fromDate30Day < toDate) {
                    return {
                        status: false,
                        mess: "Khoảng cách từ ngày, đến ngày không được quá 30 ngày",
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
            title: "Mã yêu cầu",
            dataIndex: "ttkCode",
            key: "ttkCode",
            render: (item: any, record: any, index: number) => (
                <Tooltip title="Xem chi tiết">
                    <a onClick={() => handleClick(record)}>{record.ttkCode}</a>
                </Tooltip>
            )
        },
        { title: "Ngày tạo", dataIndex: "createdDate", key: "createdDate" },
        { title: "Loại", dataIndex: "reasonName", key: "reasonName" },
        { title: "Số hiệu bưu gửi", dataIndex: "parcelId", key: "parcelId" },
        { title: "Người nhận", dataIndex: "poRecipientName", key: "poRecipientName" },
        { title: "Trạng thái xử lý", dataIndex: "ttkStatusName", key: "ttkStatusName" },
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
                        <Col span={3}><label className='label'>Thời gian tạo</label></Col>
                        <Col className='config-height' span={9}>
                            <RangePicker
                                defaultValue={[moment(), moment()]}
                                placeholder={["Từ ngày", "Đến ngày"]}
                                style={{ width: "100%" }}
                                ranges={{
                                    'Hôm nay': [moment(), moment()],
                                    'Hôm qua': [moment().subtract(1, 'days'), moment()],
                                    '7 ngày trước': [moment().subtract(7, 'days'), moment()],
                                    '30 ngày trước': [moment().subtract(30, 'days'), moment()],
                                    'Tháng này': [moment().startOf('month'), moment()],
                                    'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                                }}
                                format="DD/MM/YYYY"
                                onChange={onChangeToDateFromDate}
                            />
                        </Col>
                        <Col span={3}><label className='label'>Loại yêu cầu</label></Col>
                        <Col className='config-height' span={9}>
                            <Select style={{ width: "100%" }}
                                defaultValue="ALL"
                                onChange={(value) => changeSelected(value, "ttkReason")} allowClear>
                                <Select.Option key="ALL" value="ALL">Tất cả</Select.Option>
                                {ticketGroupReason.map((option) => {
                                    return (
                                        <Select.Option key={option?.tkcodeCms} value={option?.tkcodeCms}> {option?.tknameMyvnp}</Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col className='config-height' span={3}><label className='label'>Mã yêu cầu</label></Col>
                        <Col span={9}>
                            <Input className='input-custome' placeholder="" onChange={(e) => changeInput(e, "ttkCode")} />
                        </Col>
                        <Col span={3}><label className='label'>Trạng thái </label></Col>
                        <Col className='config-height' span={9}>
                            <Select style={{ width: "100%" }} defaultValue="ALL"
                                onChange={(value) => changeSelected(value, "ttkStatus")}
                            >
                                <Select.Option key={-1} value="ALL">Tất cả</Select.Option>
                                {arrayUniqueByKey.map((row, i) => {
                                    return (
                                        <Select.Option key={row?.tkcodeMyvnp} > {row?.tknameMyvnp}</Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col className='config-height' span={3}><label className='label'>Người tạo</label></Col>
                        <Col span={9}>
                            <Select
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => upperCase((option!.children as unknown as string)).includes(upperCase(input))}
                                placeholder="Tài khoản quản lý"
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
                        <Col span={3}><label className='label'>Số hiệu bưu gửi</label></Col>
                        <Col span={9}>
                            <Input className='input-custome' placeholder="" onChange={(e) => changeInput(e, "parcelId")} />
                        </Col>
                    </Row>
                    <Row>
                        <Col flex="auto" style={{ textAlign: 'center' }}>
                            <Button className='height-btn2 btn-outline-info' icon={<SearchOutlined />} onClick={() => onSearchData()}>Tìm kiếm</Button>
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