import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { DashboardApi, OverviewResponse } from '@/services/client';
import Quantity from './quantity';
import Overview from './overview';
import { Moment } from 'moment';
import { RangeValue } from '..';

const dashboardApi = new DashboardApi();

export type Props = {
    username?: string,
    // dateType: 'DD' | 'IW' | 'MONTH',
    rangeDate: RangeValue,
    branch?: string[]
}
export const Columns = [
    { valueField: 'DLH', name: 'Đang lấy hàng', color: '#2ed8b6', status: [1, 2, 3, 4, 5] },
    { valueField: 'TC', name: 'Thành công', color: '#538bdf', status: [14, 21] },
    { valueField: 'DTH', name: 'Đang thực hiện', color: '#85de77', status: [6, 7, 10, 11, 12, 13, 15] },
    { valueField: 'TCMP', name: 'Thành công một phần', color: '#ffb74d', status: [20] },
    { valueField: 'CH', name: 'Chuyển hoàn', color: '#e95753', status: [16, 17, 18, 19] },
]

const OrderStatistics = (props: Props) => {
    const [overviewData, setOverviewData] = useState<OverviewResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!props.rangeDate) {
            return;
        }
        setLoading(true);
        dashboardApi.getDetailOverviewData({
            username: props.username,
            fromDate: props.rangeDate?.[0]?.format('DD/MM/YYYY'),
            toDate: props.rangeDate?.[1]?.format('DD/MM/YYYY'),
            branch: props.branch
        })
            .then(resp => setOverviewData(resp.data))
            .finally(() => setLoading(false));
    }, [props.username, props.rangeDate, props.branch])

    return (
        <>
            <Row gutter={[14, 14]}>
                <Col lg={7} md={7} sm={24} xs={24}>
                    <Overview overviewData={overviewData} loading={loading} rangeDate={props.rangeDate} username={props.username} branch={props.branch} />
                </Col>
                <Col lg={17} md={17} sm={24} xs={24}>
                    <Quantity overviewData={overviewData} loading={loading} rangeDate={props.rangeDate} />
                </Col>

            </Row>
        </>
    );
}

export default OrderStatistics;