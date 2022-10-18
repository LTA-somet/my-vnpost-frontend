import { OverviewResponse } from '@/services/client';
import { formatCurrency } from '@/utils';
import { Pie } from '@ant-design/plots';
import { Card, Col, Row, Spin } from 'antd';
import moment from 'moment';
import { useMemo } from 'react';
import { history } from 'umi';
import { Columns } from '.';
import { RangeValue } from '..';
// import './plugins/d3/d3.min.js';
// import '../plugins/c3/c3.min.js';

type Props = {
    overviewData: OverviewResponse[],
    loading: boolean,
    username?: string,
    // dateType: 'DD' | 'IW' | 'MONTH',
    rangeDate: RangeValue,
    branch?: string[]
}
const Overview = (props: Props) => {
    const data = useMemo(() => {
        const retVal: any[] = [];
        Columns.forEach(c => {
            const sum = props.overviewData.filter(o => o.statusCode === c.valueField).reduce((p, n) => p + n.num!, 0);
            const sumFee = props.overviewData.filter(o => o.statusCode === c.valueField).reduce((p, n) => p + n.totalFee!, 0);
            const sumCodAmount = props.overviewData.filter(o => o.statusCode === c.valueField).reduce((p, n) => p + n.codAmount!, 0);
            if (sum === 0) return;
            retVal.push({
                statusName: c.name, value: sum, statusCode: c.valueField, sumFee, sumCodAmount,
                searchParam: {
                    username: props.username,
                    fromDate: props.rangeDate?.[0]?.format('DD/MM/YYYY'),
                    toDate: props.rangeDate?.[1]?.format('DD/MM/YYYY')
                    , branch: props.branch
                }
            })
        })
        if (retVal.length === 0) {
            retVal.push({ value: 0, statusName: 'Không có dữ liệu' })
        }
        return retVal;
    }, [props.overviewData]);

    const config = {
        width: 445,
        height: 445,
        appendPadding: 0,
        data,
        angleField: 'value',
        colorField: 'statusName',
        innerRadius: 0.6,
        radius: 0.9,
        // legend: {
        //     layout: 'horizontal',
        //     position: 'right'
        // },
        tooltip: {
            customContent: (title: string, fullData: any) => {
                return <b>
                    <Row>
                        <Col style={{ borderRight: 'solid 1px #dddddd', padding: 10, width: 150, fontSize: 14, textAlign: 'center', lineHeight: 1.4 }}>
                            {title} <br />
                            ({fullData?.[0]?.data?.value ?? 0})
                        </Col>
                        <Col style={{ padding: 10, width: 200 }}>
                            <Row gutter={[10, 10]}>
                                <Col span={12}>Cước:</Col>
                                <Col span={12}> {formatCurrency(fullData?.[0]?.data?.sumFee)}đ</Col>
                                <Col span={12}>Tiền thu hộ:</Col>
                                <Col span={12}>{formatCurrency(fullData?.[0]?.data?.sumCodAmount)}đ</Col>
                            </Row>
                        </Col>
                    </Row>
                </b>
            }
        },
        stroke: '#000',
        color: ({ statusName }) => {
            return Columns.find(c => c.name === statusName)?.color ?? '#ddd';
        },
        label: {
            type: 'inner',
            offset: '-50%',
            content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 12,
                textAlign: 'center',
                fill: 'black'
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: 14,

                },
                content: `Đơn hàng trong kỳ`,
            },
        },
    };

    const handleClick = (statusCode: string, searchParam: any) => {
        if (statusCode) {
            const column = Columns.find(c => c.valueField === statusCode);
            if (column) {
                const txtStatus: string = column.status.join(',');
                console.log(' props.branch', searchParam.branch);

                const orgCode: string | undefined = searchParam.branch?.join(',');
                const fromDate = searchParam.fromDate;
                const toDate = searchParam.toDate;
                history.push({
                    pathname: '/manage/order-manager',
                    query: {
                        status: txtStatus,
                        owner: searchParam.username ?? '',
                        orgCode: orgCode ?? '',
                        orderType: "1",
                        fromDate,
                        toDate
                    }
                })
            }
        }
    }

    const onEvent = (plot: any) => {
        plot.on('element:click', (charData: any) => {
            const statusCode = charData?.data?.data?.statusCode;
            const searchParam = charData?.data?.data?.searchParam;
            handleClick(statusCode, searchParam);
        });
    }

    return (
        <Spin spinning={props.loading}>
            <Card size='small' bordered={false} title={`Thống kê tổng đơn hàng trong kỳ`}>
                {/* <div id="c3-donut-chart"></div> */}
                <Pie {...config} onReady={onEvent} />
            </Card >
        </Spin>
    );
};

export default Overview;