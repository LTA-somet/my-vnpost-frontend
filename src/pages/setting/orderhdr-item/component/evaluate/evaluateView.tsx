import { useModel } from 'umi';
import { Button, Card, Checkbox, Col, Divider, Form, Input, message, Modal, Rate, Row, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import './styles.css';
import { formatCurrency } from '@/utils';
import { ArrowDownOutlined, ArrowUpOutlined, SaveOutlined, StarOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useCurrentUser } from '@/core/selectors';
import { ConfigReviewApi, ConfigReviewDto, OrderReviewApi, OrderReviewDto } from '@/services/client';
import orderHdr from '@/pages/setting/orderHdr';
import { any } from '@amcharts/amcharts5/.internal/core/util/Array';

const desc = ['Rất tệ', 'Tệ', 'Bình thường', 'Khá tốt', 'Rất tốt'];
const CheckboxGroup = Checkbox.Group;

const configReviewApi = new ConfigReviewApi();
const orderReviewApi = new OrderReviewApi();

const EvaluateView = (props: Props) => {
    const [isDgtg, setShowDgtg] = useState(false);
    const [isDgcdv, setShowDgcdv] = useState(false);
    const [isDgp, setShowDgp] = useState(false);

    const [isDisable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [valueRateDgtg, setvalueRateDgtg] = useState(5);
    const [valueRateDgcdv, setvalueRateDgcdv] = useState(5);
    const [valueRateDgp, setvalueRateDgp] = useState(5);

    const [formDgtg] = Form.useForm();
    const [formDgcdv] = Form.useForm();
    const [formDgp] = Form.useForm();

    const [dgTgList, setDgTgList] = useState<ConfigReviewDto[]>([]);
    const [dgpList, setDgpList] = useState<ConfigReviewDto[]>([]);
    const [dgcdvList, setDgcdvList] = useState<ConfigReviewDto[]>([]);
    const [dataOrderReviewDgtg, setDataOrderReviewDgtg] = useState<OrderReviewDto>();
    const [dataOrderReviewDgp, setDataOrderReviewDgp] = useState<OrderReviewDto>();
    const [dataOrderReviewDgcdv, setDataOrderReviewDgcdv] = useState<OrderReviewDto>();

    const setFillData = (list: any, listConfig: any) => {
        const dataDgtg = list.find((e: any) => e.stageReview === "DGTG");
        if (dataDgtg != null) {
            setDataOrderReviewDgtg(dataDgtg);
            setvalueRateDgtg(dataDgtg.rate);
            formDgtg.setFieldsValue(dataDgtg);
            if (dataDgtg.listReview != null) {
                const arr = dataDgtg.listReview.split(',');
                const Temp: any = [];
                arr.forEach((ids: any) => {
                    const numberIds = Number(ids);
                    const nameDgtg = listConfig.find((e: any) => e.id === numberIds);
                    Temp.push(nameDgtg)
                });
                setDgTgList(Temp);
            }
        }

        const dataDgp = list.find((e: any) => e.stageReview === "DGP");
        if (dataDgp != null) {
            setDataOrderReviewDgp(dataDgp);
            setvalueRateDgp(dataDgp.rate);
            formDgp.setFieldsValue(dataDgp);
            if (dataDgp.listReview != null) {
                const arrDgp = dataDgp.listReview.split(',');
                const TempDgp: any = [];
                arrDgp.forEach((ids: any) => {
                    const numberIds = Number(ids);
                    const nameDgp = listConfig.find((e: any) => e.id === numberIds);
                    TempDgp.push(nameDgp)
                });
                setDgpList(TempDgp);
            }
        }

        const dataDgcdv = list.find((e: any) => e.stageReview === "DGCDV");
        if (dataDgcdv != null) {
            setDataOrderReviewDgcdv(dataDgcdv);
            setvalueRateDgcdv(dataDgcdv.rate);
            formDgcdv.setFieldsValue(dataDgcdv);
            if (dataDgcdv.listReview != null) {
                const arrDgcdv = dataDgcdv.listReview.split(',');
                const TempDgcdv: any = [];
                arrDgcdv.forEach((ids: any) => {
                    const numberIds = Number(ids);
                    const nameDgcdv = listConfig.find((e: any) => e.id === numberIds);
                    TempDgcdv.push(nameDgcdv)
                });
                setDgcdvList(TempDgcdv);
            }
        }
    }

    //Get data by CurrentUser.orgCde, originalId sau đó xử lý lọc theo khâu ở phía dưới FE gọi hàm setFillData()
    const getAllListOrderReview = (listConfig: any) => {
        orderReviewApi.getAllByOnlyOrderReview(props.originalId!, '').then((res) => {
            if (res.status === 200) {
                setFillData(res.data, listConfig);
            }
        })
    }

    const getAllListConfigReview = () => {
        configReviewApi.getAll().then((res) => {
            if (res.status === 200) {
                // setListConfigReview(res.data);
                getAllListOrderReview(res.data);
            }
        })
    }

    useEffect(() => {
        getAllListConfigReview();
    }, []);

    const onClickDgtg = () => {
        setShowDgtg(!isDgtg);
    }

    const onClickDgcdv = () => {
        setShowDgcdv(!isDgcdv);
    }

    const onClickDgp = () => {
        setShowDgp(!isDgp);
    }

    return (
        <>
            {
                dataOrderReviewDgtg && <Card extra={
                    <Button
                        icon={isDgtg ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        onClick={onClickDgtg} />
                }
                    size='small' bordered={false} className="fadeInRight" title="Đánh giá bưu tá thu gom">
                    {isDgtg &&
                        <>
                            <Form name="form-evaluate-sender-dgtg-detail"
                                labelWrap
                                labelAlign="left"
                                form={formDgtg}
                            >
                                {/* <Col span={24}>
                                    <Form.Item label="Bưu tá thu gom">
                                        {props.senderName} - {props.senderPhone}
                                    </Form.Item>
                                </Col> */}
                                <Col span={24}>
                                    <Form.Item label="Mức độ hài lòng của quý khách:" name="">
                                        <span>
                                            <Rate style={{ marginTop: '-5px' }} tooltips={desc} value={valueRateDgtg} disabled />
                                            {valueRateDgtg ? <span className="ant-rate-text">{desc[valueRateDgtg - 1]}</span> : ''}
                                        </span>
                                    </Form.Item>
                                </Col>
                                <Col span={24} style={{ marginBottom: '10px' }}>
                                    <Row>
                                        <Col span={24}>
                                            {
                                                dgTgList.map(e => (
                                                    <p className="span-font">{e.reviewTypeDetail}</p>
                                                ))
                                            }
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24}>
                                    <span className="span-font">Ý kiến khác: {dataOrderReviewDgtg?.otherContent}</span>
                                </Col>
                            </Form>
                        </>
                    }
                </Card>
            }

            {
                dataOrderReviewDgp &&
                <>
                    <Divider />
                    <Card extra={
                        <Button
                            icon={isDgp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            onClick={onClickDgp} />
                    }
                        size='small' bordered={false} className="fadeInRight" title="Đánh giá bưu tá phát">
                        {isDgp &&
                            // && props.status === 14
                            <Form name="form-evaluate-sender-play-detail"
                                labelWrap
                                labelAlign="left"
                                form={formDgp}
                            >
                                {/* <Col span={24}>
                                <Form.Item label="Bưu tá phát">
                                    {props.senderName} - {props.senderPhone}
                                </Form.Item>
                            </Col> */}
                                <Col span={24}>
                                    <Form.Item label="Mức độ hài lòng của quý khách:" name="">
                                        <span>
                                            <Rate style={{ marginTop: '-5px' }} tooltips={desc} value={valueRateDgp} disabled />
                                            {valueRateDgp ? <span className="ant-rate-text">{desc[valueRateDgp - 1]}</span> : ''}
                                        </span>
                                    </Form.Item>
                                </Col>
                                <Col span={24} style={{ marginBottom: '10px' }}>
                                    <Row>
                                        <Col span={24}>
                                            {
                                                dgpList.map(e => (
                                                    <p className="span-font">{e.reviewTypeDetail}</p>
                                                ))
                                            }
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24}>
                                    <span className="span-font">Ý kiến khác: {dataOrderReviewDgp?.otherContent}</span>
                                </Col>
                            </Form>
                        }
                    </Card>
                </>
            }


            {
                dataOrderReviewDgcdv &&
                <>
                    <Divider />
                    <Card extra={
                        <Button
                            icon={isDgcdv ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            onClick={onClickDgcdv} />
                    }
                        size='small' bordered={false} className="fadeInRight" title="Đánh giá chung dịch vụ">
                        {isDgcdv &&
                            <Form name="form-evaluate-sender-dgcdv-detail"
                                labelWrap
                                labelAlign="left"
                                form={formDgcdv}
                            >
                                <Col span={24}>
                                    <Form.Item label="Mức độ hài lòng của quý khách:" name="">
                                        <span>
                                            <Rate style={{ marginTop: '-5px' }} tooltips={desc} value={valueRateDgcdv} disabled />
                                            {valueRateDgcdv ? <span className="ant-rate-text">{desc[valueRateDgcdv - 1]}</span> : ''}
                                        </span>
                                    </Form.Item>
                                </Col>
                                <Col span={24} style={{ marginBottom: '10px' }}>
                                    <Row>
                                        <Col span={24}>
                                            {
                                                dgcdvList.map(e => (
                                                    <p className="span-font">{e.reviewTypeDetail}</p>
                                                ))
                                            }
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24}>
                                    <span className="span-font">Ý kiến khác: {dataOrderReviewDgcdv?.otherContent}</span>
                                </Col>
                            </Form>
                        }
                    </Card>
                </>


            }
            {/* <Divider /> */}
        </>
    )
};
type Props = {
    isOpenPopup: boolean;
    itemCode?: string;
    sendType?: string;
    status: number | undefined;
    // senderName?: string;
    // senderPhone?: string;
    originalId?: string
    setIsOpenPopup: (isOpenPopup: boolean) => void;
}

export default EvaluateView;


