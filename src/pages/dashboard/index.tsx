import { PageContainer } from '@ant-design/pro-layout';
import { Col, Row, Select, DatePicker, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { dataToSelectBox } from '@/utils';
import { AccountApi, CmsCustomerApi, CmsCustomerDto, ValueComboboxDto } from '@/services/client';
import Money from './money';
import OrderStatistics from './order-statistics';
import './style.css';
import { useCurrentUser } from '@/core/selectors';
import moment, { Moment } from 'moment';
import { RangePickerProps } from 'antd/lib/date-picker';


const getDefaultRangeDate = (): RangeValue => {
    return [moment().subtract(6, 'days'), moment()];
}
export type RangeValue = [Moment | null, Moment | null] | null;

const accountApi = new AccountApi();
const cmsCustomerApi = new CmsCustomerApi();
export default () => {
    const currentUser = useCurrentUser();
    const [username, setUsername] = useState<string>();
    const [branch, setBranch] = useState<string[]>([currentUser.org!]);
    const [listUsername, setListUsername] = useState<ValueComboboxDto[]>([]);
    const [listBranch, setListBranch] = useState<CmsCustomerDto[]>([]);
    const [rangeDate, setRangeDate] = useState<RangeValue>(() => getDefaultRangeDate());
    const [rangeDateCheckDisable, setRangeDateCheckDisable] = useState<RangeValue>(() => getDefaultRangeDate());

    if (currentUser.isEmployee) {
        return <div className='dashboard-bg' />;
    }

    useEffect(() => {
        accountApi.getChildAccount()
            .then(resp => setListUsername(resp.data));
        cmsCustomerApi.findByAccntParentCode().then(resp => setListBranch(resp.data));
    }, []);

    // useEffect(() => {
    //     if (branch.length === 1) {
    //         if (branch[0] !== currentUser.org) {
    //             setUsername('');
    //         } else {
    //             // setUsername(currentUser.uid!);
    //         }
    //     } else if (branch.length > 1) {
    //         setUsername('');
    //     } else {
    //         // setUsername(currentUser.uid!);
    //     }
    // }, [branch]);

    const onSetBrand = (newBrand: string[]) => {
        if (newBrand.length === 1) {
            if (branch[0] !== currentUser.org) {
                setUsername('');
            } else {
                // setUsername(currentUser.uid!);
            }
        } else if (newBrand.length > 1) {
            setUsername('');
        } else {
            // setUsername(currentUser.uid!);
        }
        setBranch(newBrand)
    }

    const disabledDate: RangePickerProps['disabledDate'] = (current: Moment) => {
        if (!rangeDateCheckDisable) {
            return (
                current.isBefore(moment().subtract(1, 'day').subtract(2, 'year')) ||
                current.isAfter(moment())
            )
        }
        if (rangeDateCheckDisable[0]) {
            return (
                current.isAfter(moment(rangeDateCheckDisable[0]).add(31, 'day')) || current.isAfter(moment())
            )
        } else if (rangeDateCheckDisable[1]) {
            return (
                current.isBefore(moment(rangeDateCheckDisable[1]).subtract(31, 'day'))
            )
        }
    };

    // console.log('rangeDate', rangeDate?.[0]?.format('DD/MM/YYYY'), rangeDate?.[0]?.format('DD/MM/YYYY'));

    const onClickRangeDate = () => {
        const rangeDateElement = window.document.getElementById('rangeDate');
        rangeDateElement?.focus();
        setRangeDate(null)
        setRangeDateCheckDisable(null);
    }

    const onChangeRangeDate = (value: RangeValue) => {
        setRangeDateCheckDisable(value);
        if (!value || !value[0] || !value[1]) {
            // message.error('T??? ng??y ?????n ng??y kh??ng ???????c b??? tr???ng');
            return;
        }

        const fromDate = value?.[0];
        const toDate = value?.[1];

        if (fromDate?.isAfter(toDate)) {
            message.error('T??? ng??y ph???i nh??? h??n ?????n ng??y');
            return;
        }
        const now = moment();
        const twoYearBefore = now.subtract(2, 'year').subtract(1, 'day');

        if (fromDate?.isBefore(twoYearBefore)) {
            message.error('Ch??? c?? th??? tra c???u t???i ??a 2 n??m');
            return;
        }
        const monthBefore = moment(toDate).subtract(31, 'days')
        if (fromDate?.isBefore(monthBefore)) {
            message.error('Ch??? ???????c xem d??? li???u trong v??ng 31 ng??y');
            return;
        }
        setRangeDate([fromDate, toDate]);
    }

    return (
        <>
            <PageContainer
                extra={
                    [
                        <Select value={branch} onChange={onSetBrand} className='g-input' placeholder='Chi nh??nh' allowClear mode="multiple"
                            style={{ display: listBranch.length > 1 ? '' : 'none' }}
                        >
                            {dataToSelectBox(listBranch, 'accntCode', 'accntName')}
                        </Select>,
                        <Select value={username} onChange={setUsername} className='g-input' placeholder='T??i kho???n' allowClear
                            // style={{ display: listUsername.length > 1 && (branch.length === 0 || (branch.length === 1 && branch[0] === currentUser.org)) ? '' : 'none' }}
                            style={{ display: (branch.length === 0 || (branch.length === 1 && branch[0] === currentUser.org)) ? '' : 'none' }}
                        >
                            {dataToSelectBox(listUsername, 'value', 'label')}
                        </Select>,
                        // <Select value={dateType} onChange={setDateType} className='g-input'>
                        //     <Select.Option key='DD' value='DD'>H??m nay</Select.Option>
                        //     <Select.Option key='IW' value='IW'>Tu???n n??y</Select.Option>
                        //     <Select.Option key='MONTH' value='MONTH'>Th??ng n??y</Select.Option>
                        // </Select>,
                        <DatePicker.RangePicker
                            style={{ width: '100%' }}
                            placeholder={['t??? ng??y', '?????n ng??y']}
                            // onClick={resetDate}
                            onCalendarChange={val => onChangeRangeDate(val)}
                            disabledDate={disabledDate}
                            value={rangeDate}
                            id="rangeDate"
                            onClick={onClickRangeDate}
                            ranges={{
                                'H??m nay': [moment(), moment()],
                                'H??m qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                                '7 ng??y tr?????c': [moment().subtract(6, 'days'), moment()],
                                '30 ng??y tr?????c': [moment().subtract(29, 'days'), moment()],
                                'Th??ng n??y': [moment().startOf('month'), moment()],
                                'Th??ng tr?????c': [
                                    moment().subtract(1, 'month').startOf('month'),
                                    moment().subtract(1, 'month').endOf('month'),
                                ],
                            }}
                            allowClear={false}
                            format="DD/MM/YYYY"
                        // onOk={val => onChangeRangeDate(val)}
                        />
                    ]
                }
            >
                {/* <Col span={24}><OrderStatistics /></Col> */}
                < div className="fadeInRight" >
                    <Row gutter={[14, 14]}>
                        <Col span={24}><Money username={username} rangeDate={rangeDate} branch={branch} /></Col>
                        <Col span={24}><OrderStatistics username={username} rangeDate={rangeDate} branch={branch} /></Col>
                    </Row>
                </div >
            </PageContainer >
        </>
    );
};