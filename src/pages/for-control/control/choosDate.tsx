import { Modal } from "antd";
import moment from 'moment';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { DatePicker, Row, Col, Button } from "antd";
import { notification } from 'antd';
const ChooseDate = (props: Props) => {

    const onChange = (date, dateString: any, param: any) => {
        console.log(dateString, param);
        if (param == "dateFrom") {
            props.setDateFrom(dateString);
        }
        if (param == "dateTo") {
            props.setDateTo(dateString);
        }
    }
    function validParamCondition() {
        if (!props.dateFrom) {
            return {
                status: false,
                mess: "Kỳ từ ngày là bắt buộc",
                id: ''
            }
        }
        if (!props.dateTo) {
            return {
                status: false,
                mess: "Kỳ đến ngày là bắt buộc",
                id: ''
            }
        }
        return {
            status: true,
            mess: '',
            id: ''
        };
    }

    const onAcceptDate = () => {
        const paramCondition = validParamCondition();
        if (paramCondition?.status) {
            props.setIsOpenPopup(false)
            props.getCollatingHdrDataSearch();
        } else {
            notification.error({
                message: paramCondition.mess,
            });
        }

    }

    return (
        <Modal
            title='Chọn thời gian'
            visible={props.isOpenPopup}
            width={800}
            // onOk={() => props.setIsOpenPopup(false)}
            onCancel={() => props.setIsOpenPopup(false)}
            footer={[
                <Button className='custom-btn1 btn-outline-success' icon={<CheckCircleOutlined />} key="submit" type="primary" onClick={onAcceptDate}>
                    Đồng ý
                </Button>,
                <Button className='custom-btn1 btn-outline-danger' icon={<CloseCircleOutlined />} key="back" type="primary" onClick={() => props.setIsOpenPopup(false)}>
                    Thoát
                </Button>,
            ]}
        >
            <div
                style={{
                    textAlign: 'center'
                }}
            >
                <Row>
                    <Col className='config-height' span={4}>Từ ngày</Col>
                    <Col className='config-height' span={6}>
                        <DatePicker
                            format={"DD-MM-YYYY"}
                            value={props.dateFrom ? moment(props.dateFrom, "DD-MM-YYYY") : null}
                            onChange={(date, dateString) => onChange(date, dateString, "dateFrom")} />
                    </Col>
                    <Col className='config-height' span={4} />
                    <Col className='config-height' span={4}>Đến ngày</Col>
                    <Col className='config-height' span={6}>
                        <DatePicker
                            format={"DD-MM-YYYY"}
                            value={props.dateTo ? moment(props.dateTo, "DD-MM-YYYY") : null}
                            onChange={(date, dateString) => onChange(date, dateString, "dateTo")} />
                    </Col>
                </Row>
            </div>
        </Modal>
    )
};
type Props = {
    isOpenPopup: boolean;
    dateFrom: string,
    dateTo: string,
    setDateFrom: (dateFrom: string) => void;
    setDateTo: (dateFrom: string) => void;
    setIsOpenPopup: (isOpenPopup: boolean) => void;
    getCollatingHdrDataSearch: () => void;
}

export default ChooseDate;


