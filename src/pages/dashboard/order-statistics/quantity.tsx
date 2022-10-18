import { OverviewResponse } from '@/services/client';
import { Card, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { RangeValue } from '../index.js';
// import C3Chart from "react-c3js";
import '../plugins/amcharts/amcharts.js';
import '../plugins/amcharts/serial.js';
import { Columns } from './index';

type Props = {
    overviewData: OverviewResponse[],
    loading: boolean,
    // dateType: 'DD' | 'IW' | 'MONTH'
    rangeDate: RangeValue,
}
const Quantity = (props: Props) => {
    const loadChart = () => {
        const AmCharts: any = window.AmCharts;

        // gen graphs
        const graphs = Columns.map((c, i) => ({
            "id": "g" + (i + 1),
            "valueAxis": "v2",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "bulletSize": 8,
            "hideBulletsCount": 50,
            "lineThickness": 3,
            "lineColor": c.color,
            "title": c.name,
            "useLineColorForBulletBorder": true,
            "valueField": c.valueField,
            "balloonText": "[[title]]<br /><b style='font-size: 130%'>[[value]]</b>"
        }))

        // gen dataProvider
        const startOfPeriod = props.rangeDate![0]!;
        const endOfPeriod = props.rangeDate![1]!;
        const nextDay = moment(startOfPeriod);
        const endDay = moment(endOfPeriod);
        // const today = moment();
        const dataProvider: any[] = [];
        while (true) {
            if (nextDay.isAfter(endDay)) {
                break;
            }
            const item: any = {};
            const txtDay = nextDay.format('DD/MM/YYYY');
            item.date = nextDay.format('DD/MM');

            Columns.forEach(c => {
                const ov = props.overviewData.find(o => o.createdDate === txtDay && o.statusCode === c.valueField);
                item[c.valueField] = ov ? ov.num : 0;
            });
            dataProvider.push(item);
            nextDay.add(1, 'days');
        }

        AmCharts?.makeChart("line_chart", {
            "type": "serial",
            "theme": "light",
            "dataDateFormat": "DD/MM/YYYY",
            "precision": 0,
            "valueAxes": [{
                "id": "v1",
                "position": "left",
                "autoGridCount": false,
                "labelFunction": function (value) {
                    return "$" + Math.round(value) + "M";
                }
            }, {
                "id": "v2",
                "gridAlpha": 0,
                "autoGridCount": false
            }],
            "graphs": graphs,
            "chartCursor": {
                "pan": true,
                "valueLineEnabled": true,
                "valueLineBalloonEnabled": true,
                "cursorAlpha": 0,
                "valueLineAlpha": 0.2
            },
            "categoryField": "date",
            "categoryAxis": {
                // "parseDates": true,
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "legend": {
                "useGraphSettings": true,
                "position": "top"
            },
            "balloon": {
                "borderThickness": 1,
                "shadowAlpha": 0
            },
            "dataProvider": dataProvider
        });
    }

    useEffect(() => {
        // const data = getData(overviewData);
        loadChart();
    }, [props.overviewData])

    return (
        <>
            <Spin spinning={props.loading}>
                <Card size='small' bordered={false} title={`Thống kê đơn hàng trong kỳ`}>
                    <div id="line_chart" className="chart-shadow" style={{ height: 445 }} />
                </Card>
            </Spin>
        </>
    );
};

export default Quantity;