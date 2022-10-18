import React, { useState } from 'react';
import { useModel, Link } from 'umi';
import moment from 'moment';
import { useEffect } from "react";
import { Spin, Card, Checkbox, Select, Row, Col } from "antd";
import ChooseDate from './choosDate';
import './style.css';
import { formatCurrency } from '@/utils';
const dateFormat = 'DD/MM/YYYY';
const optionDateValue = [
    { value: "THIS_MONTH", label: "Tháng này", key: [moment().clone().startOf('month').format(dateFormat), moment().format(dateFormat)] },
    { value: "30_DAY_AGO", label: "30 ngày trước", key: [moment().subtract(30, "days").format(dateFormat), moment().format(dateFormat)] },
    { value: "LAST_MONTH", label: "Tháng trước", key: [moment().subtract(1, 'month').clone().startOf('month').format(dateFormat), moment().subtract(1, 'month').clone().endOf('month').format(dateFormat)] },
    { value: "2_MONTH_AGO", label: "2 tháng trước", key: [moment().subtract(2, 'month').clone().startOf('month').format(dateFormat), moment().subtract(2, 'month').clone().endOf('month').format(dateFormat)] },
    { value: "3_MONTH_AGO", label: "3 tháng trước", key: [moment().subtract(3, 'month').clone().startOf('month').format(dateFormat), moment().subtract(3, 'month').clone().endOf('month').format(dateFormat)] }
]

const ForControl = () => {
    const { setIdhdr, collactingHdrData, checked, setChecked, reloadForm, setReloadFrom, dateFromFormControl, setDateFromFormControl,
        dateToFormControl, setDateToFormControl,
        getCollatingHdrDataSearch, dateFrom, setDateFrom, dateTo, setDateTo, setStatusHdr } = useModel("forControlModelList");
    // const [checked, setChecked] = useState(false);
    // const [dateFrom, setDateFrom] = useState<string>(moment().format("DD-MM-YYYY"));
    // const [dateTo, setDateTo] = useState<string>(moment().format("DD-MM-YYYY"));
    const [showChooseDate, setShowChooseDate] = useState(false);
    const [optionSelectDate, setOptionSelectDate] = useState<string>("THIS_MONTH");

    useEffect(() => {
        getCollatingHdrDataSearch(dateFrom, dateTo, checked);
    }, [])

    useEffect(() => {
        if (dateFrom && dateTo && reloadForm == true) {
            getCollatingHdrDataSearch(dateFrom, dateTo, checked);
            setReloadFrom(false);
        }
    }, [reloadForm]);

    const onChangeCheckBox = (e: any) => {
        setChecked(e.target.checked)
        getCollatingHdrDataSearch(dateFrom, dateTo, e.target.checked);
    }

    const onSelectOption = (value: any) => {
        console.log("value: ", value);
        setOptionSelectDate(value);
        if (value == "OPTION") {
            setShowChooseDate(true);
        } else {

            const optionDate = optionDateValue.find((e) => {
                return e.value == value;
            });
            setDateFrom(optionDate ? optionDate?.key[0] : "");
            setDateTo(optionDate ? optionDate?.key[1] : "");
            getCollatingHdrDataSearch(optionDate ? optionDate?.key[0] : "", optionDate ? optionDate?.key[1] : "", checked);
        }
    }

    const onSearchData = () => {
        if (dateFrom && dateTo) {
            getCollatingHdrDataSearch(dateFrom, dateTo, checked);
        }
    }

    const onLinkNewFrom = (option: any) => {
        setIdhdr(option?.collactingHdrId);
        setStatusHdr(option?.statusHdr == 1 ? true : false);
        setDateFromFormControl(option?.dateFrom)
        setDateToFormControl(option?.dateTo)
    }

    return (
        <>
            <Spin spinning={false}>
                <Card title="Dữ liệu đối soát" size='small' bordered={false}>
                    <Row style={{ margin: "3px", fontSize: '14px' }}>
                        <Col span={10}>
                            <Select style={{ width: "100%" }}
                                defaultValue={optionSelectDate}
                                onSelect={onSelectOption}
                            >
                                <option value='0' ><p style={{ fontWeight: 'bold' }}>Lựa chọn thời gian hiển thị</p></option>
                                {optionDateValue.map((option) => {
                                    return (
                                        <Select.Option key={option.value} value={option.value} >
                                            <>
                                                <p >{option.label}</p>
                                                <p style={{ marginLeft: '30px', fontStyle: 'italic' }} >Từ {option.key[0]} đến {option.key[1]}</p>
                                            </>
                                        </Select.Option>
                                    )
                                })}
                                <Select.Option key="OPTION" value="OPTION" >
                                    <>
                                        <p style={{ fontWeight: 'bold' }}>Tùy chọn</p>
                                        {/* <p style={{ marginLeft: '30px', fontStyle: 'italic' }} > Từ {dateFrom ? dateFrom : " ..."} đến {dateTo ? dateTo : "..."} </p> */}
                                        <p style={{ marginLeft: '30px', fontStyle: 'italic' }}>Nhấn vào để chọn thời gian</p>
                                    </>
                                </Select.Option>
                            </Select>
                        </Col>
                        <ChooseDate dateFrom={dateFrom} dateTo={dateTo}
                            isOpenPopup={showChooseDate}
                            setIsOpenPopup={setShowChooseDate}
                            setDateFrom={setDateFrom}
                            setDateTo={setDateTo}
                            getCollatingHdrDataSearch={onSearchData}
                        />
                        <Col span={1} />
                        <Col span={8} style={{ marginTop: 5 }}>
                            <Checkbox
                                checked={checked}
                                onChange={onChangeCheckBox}
                                style={{ fontSize: '14px' }}
                            ><span className='span-font'>Bao gồm dữ liệu chi nhánh</span></Checkbox>
                        </Col>
                    </Row>
                </Card>
                <Card title="Danh sách các kỳ đối soát" size='small' bordered={false}>
                    {collactingHdrData.map((option: any) => {
                        return (
                            <>
                                <table style={{ width: '100%', fontSize: '12px' }} className='table'>
                                    {option?.stt == 1
                                        ?
                                        <>
                                            <thead>
                                                <tr style={{ fontWeight: 'bold', textAlign: 'left' }} className="border-row">
                                                    <th className='border-tdr' style={{ paddingLeft: '3px' }}>
                                                        <span className='span-font'>Kỳ từ {option?.dateFrom} đến {option?.dateTo}</span>
                                                        <Link
                                                            className='span-font'
                                                            onClick={() => onLinkNewFrom(option)}
                                                            to={{
                                                                pathname: '/for-control/detail-control/' + option?.collactingHdrId,
                                                                // search: '?sort=name',
                                                                // hash: '#the-hash',
                                                                state: {
                                                                    fromDate: option?.dateFrom,
                                                                    toDate: option?.dateTo,
                                                                    idHdr: option?.collactingHdrId,
                                                                    statusHdr: option?.statusHdr
                                                                },
                                                            }}
                                                            style={{ margin: '5px' }}
                                                        >
                                                            <i>(Xem chi tiết)</i></Link>
                                                    </th>
                                                    <th className='span-font' style={{ paddingLeft: '3px' }}> {option?.statusHdr == "1" ? "Đã xác nhận" : "Chưa xác nhận"}</th>
                                                </tr>
                                                <tr className="border-row">
                                                    <td className='border-tdr' style={{ paddingLeft: '3px', fontWeight: 'bold' }}> Bưu gửi phát sinh
                                                    </td >
                                                    <td className='border-tdr' style={{ paddingLeft: '3px', fontWeight: 'bold' }}>SL: {option?.rowCount ? formatCurrency(parseInt(option?.rowCount)) : ''}</td>
                                                </tr>
                                                <tr className="border-row">
                                                    <td className='border-tdr' style={{ paddingLeft: '35px' }}>Cước</td>
                                                    <td className='border-tdr' style={{ paddingLeft: '3px' }}>{option?.sumTotalFee ? formatCurrency(parseInt(option?.sumTotalFee)) : ''} đ</td>
                                                </tr>
                                                <tr className="border-row">
                                                    <td className='border-tdr' style={{ paddingLeft: '35px' }}>Tiền COD</td>
                                                    <td className='border-tdr' style={{ paddingLeft: '3px' }}>{option?.sumCodAmount ? formatCurrency(parseInt(option?.sumCodAmount)) : ''} đ</td>
                                                </tr>
                                            </thead>
                                        </>
                                        : null
                                    }
                                    {option?.stt == 2 && (option?.statusDtl == '1' || option?.statusDtl == '2')
                                        ? <>
                                            <tbody>
                                                <tr className="border-row">
                                                    <td className='border-tdr' style={{ paddingLeft: '3px', fontWeight: 'bold' }}> {option?.statusDtl.trim() == "1"
                                                        ? "Bưu gửi đối soát thành công"
                                                        : option?.statusDtl == "0" ? "Bưu gửi phát sinh" : "Bưu gửi đối soát chưa thành công"
                                                    }</td>
                                                    <td
                                                        style={option?.statusDtl.trim() == "2" ? { paddingLeft: '3px', fontWeight: 'bold', color: 'red' } : { paddingLeft: '3px', fontWeight: 'bold' }}
                                                    >SL: {option?.rowCount ? formatCurrency(option?.rowCount) : ''}</td>
                                                </tr>
                                                <tr className="border-row">
                                                    <td className='border-tdr' style={{ paddingLeft: '35px' }}>Cước</td>
                                                    <td className='border-tdr'
                                                        style={option?.statusDtl.trim() == "2" ? { paddingLeft: '3px', fontWeight: 'bold', color: 'red' } : { paddingLeft: '3px' }}
                                                    >{option?.sumTotalFee ? formatCurrency(option?.sumTotalFee) : ''} đ</td>
                                                </tr>
                                                <tr className="border-row">
                                                    <td className='border-tdr' style={{ paddingLeft: '35px' }}>Tiền COD</td>
                                                    <td className='border-tdr'
                                                        style={option?.statusDtl.trim() == "2" ? { paddingLeft: '3px', fontWeight: 'bold', color: 'red' } : { paddingLeft: '3px' }}
                                                    >{option?.sumCodAmount ? formatCurrency(option?.sumCodAmount) : ''} đ</td>
                                                </tr>
                                                {
                                                    option?.statusDtl.trim() == "1" ?
                                                        <tr className="border-row">
                                                            <td className='border-tdr' style={{ paddingLeft: '35px' }}>Thực nhận</td>
                                                            <td className='border-tdr' style={{ paddingLeft: '3px' }}>{option?.sumCodAmount && option?.sumTotalFee ? formatCurrency(option?.sumCodAmount - option?.sumTotalFee) : ''} đ</td>
                                                        </tr> : null

                                                }
                                            </tbody>
                                        </>
                                        : null}
                                </table>
                                {option?.stt == 3
                                    ?
                                    <Row>
                                        <Col span={24} className='note'>
                                            {option?.statusHdr == "0" ?
                                                "Lưu ý: Sau ngày " + moment(option?.dateTo, dateFormat).add(6, 'days').format(dateFormat) + " nếu bạn không xác nhận, hệ thống sẽ tự động xác nhận."
                                                :
                                                "Lưu ý: Dữ liệu đối soát chưa thành công sẽ chuyển sang kỳ đối soát gần nhất."
                                            }
                                        </Col>
                                    </Row>
                                    : null}
                            </>
                        )
                    })}
                </Card>
            </Spin>
        </>
    )
}
export default ForControl;