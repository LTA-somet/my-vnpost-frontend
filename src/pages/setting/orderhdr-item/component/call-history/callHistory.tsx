import { useEffect, useState } from "react";
import { useModel } from 'umi';
import { Button, Modal, Card, Table, Row, Col, Checkbox, Image, Form } from 'antd';
import moment from "moment";
import { bounce } from "@amcharts/amcharts5/.internal/core/util/Ease";



const CallHistory = (props: Props) => {
    const { isLoading, orderCallHistory, getCallHistoty } = useModel('orderDetailsList');
    const [lstCallHistory, setListCallHistory] = useState<any>([]);

    useEffect(() => {
        if (props.itemCode) {
            getCallHistoty(props.itemCode, (success: boolean, data: any) => {
                console.log("data", data);

                if (data?.code == "00") {
                    const listValue = data?.listValue || [];
                    listValue.forEach((row: any) => {
                        if (row.startTime && row.endTime) {
                            const startTime = moment(row?.startTime, 'DD/MM/YYYY HH:mm:ss');
                            const endTime = moment(row?.endTime, 'DD/MM/YYYY HH:mm:ss');
                            const diff = endTime.diff(startTime);
                            console.log("startTime", "-", diff, msToTime(diff));
                            row.subTime = msToTime(diff);
                        }
                    })
                    setListCallHistory(listValue);
                } else {
                    setListCallHistory([]);
                }
            });
        }
    }, [props.itemCode]);

    console.log("lstCallHistory", lstCallHistory);


    function msToTime(duration: any) {
        // const milliseconds = Math.floor((duration % 1000) / 100);
        const seconds = Math.floor((duration / 1000) % 60);
        const minutes = Math.floor((duration / (1000 * 60)) % 60);
        const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        const strHours = (hours < 10) ? "0" + hours : hours;
        const strMinutes = (minutes < 10) ? "0" + minutes : minutes;
        const strSeconds = (seconds < 10) ? "0" + seconds : seconds;

        return strHours + ":" + strMinutes + ":" + strSeconds;
    }
    return (
        <>
            {lstCallHistory.map((element: any) => {
                return (
                    <Row>
                        <Col span={24}>
                            <table>
                                <th className="span-font">Ngày giờ gọi/kết thúc:</th>
                                <td className="span-font">Cuộc gọi từ {element?.from}&nbsp;  đến {element?.to}&nbsp;  thời gian gọi từ: {element?.startTime}, &nbsp;   thời gian kết thúc: {element?.endTime}, &nbsp; thời gian gọi: {element?.subTime}</td>
                            </table>
                        </Col>
                    </Row>
                )
            })}

        </>
    )
}
type Props = {
    itemCode: string;
}
export default CallHistory;