import { useModel } from 'umi';
import { Button, Card, Checkbox, Col, Divider, Form, message, Modal, Rate, Row, Space, Table, Tooltip } from "antd";
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

const EvaluateSender = (props: Props) => {
    const [isDgtg, setShowDgtg] = useState(false);
    const [isDgcdv, setShowDgcdv] = useState(false);
    const [isDgp, setShowDgp] = useState(false);

    const [isDisableDgtg, setDisableDgtg] = useState(false);
    const [isDisableDgp, setDisableDgp] = useState(false);
    const [isDisableDgcdv, setDisableDgcdv] = useState(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [valueRateDgtg, setValueRateDgtg] = useState(5);
    const [valueRateDgcdv, setValueRateDgcdv] = useState(5);
    const [valueRateDgp, setValueRateDgp] = useState(5);

    const [formDgtg] = Form.useForm();
    const [formDgcdv] = Form.useForm();
    const [formDgp] = Form.useForm();

    const [dgTgBadList, setDgTgBadList] = useState<ConfigReviewDto[]>([]);
    const [dgTgGoodList, setDgTgGoodList] = useState<ConfigReviewDto[]>([]);

    const [dgcdvBadList, setDgcdvBadList] = useState<ConfigReviewDto[]>([]);
    const [dgcdvGoodList, setDgcdvGoodList] = useState<ConfigReviewDto[]>([]);

    const [dgpBadList, setDgpBadList] = useState<ConfigReviewDto[]>([]);
    const [dgpGoodList, setDgpGoodList] = useState<ConfigReviewDto[]>([]);

    const [isReviewDgtg, setReviewDgtg] = useState(false);
    const [isReviewDgp, setReviewDgp] = useState(false);
    const [isReviewDgcdv, setReviewDgcdv] = useState(false);

    const [isCheckStatusDgtg, setIsCheckStatusDgtg] = useState(false);
    const [isCheckStatusDgp, setIsCheckStatusDgp] = useState(false);
    const [isCheckStatusDgcdv, setIsCheckStatusDgcdv] = useState(false);

    const [dataReviewDgtgList, setDataReviewDgtgList] = useState<ConfigReviewDto[]>([]);
    const [dataReviewDgpList, setDataReviewDgpList] = useState<ConfigReviewDto[]>([]);
    const [dataReviewDgcdvList, setDataReviewDgcdvList] = useState<ConfigReviewDto[]>([]);
    const [dataReviewDgtg, setDataReviewDgtg] = useState<OrderReviewDto>();
    const [dataReviewDgp, setDataReviewDgp] = useState<OrderReviewDto>();
    const [dataReviewDgcdv, setDataReviewDgcdv] = useState<OrderReviewDto>();

    const [arrRateDgtg, setArrRateDgtg] = useState<any>([]);
    const [arrRateDgp, setArrRateDgp] = useState<any>([]);
    const [arrRateDgcdv, setArrRateDgcdv] = useState<any>([]);

    const funcCheckListStatus = (list: any[]) => {
        if (list != null && list.length > 0) {
            const data = list.find((e: any) => e.status);
            const arr = data.status.split(',');
            const index = arr.findIndex((e: any) => Number(e) === props.status);
            if (index != -1) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    const loadRateDefault = (list: any) => {
        const tempList: any = [];
        list.forEach((element: any) => {
            const owR = element.ownerReview.split(',');
            owR.map((value: string) => {
                if (value === '1') {
                    tempList.push(element);
                }
            });
        });
        // console.log("tempList", tempList);

        setDgTgGoodList(tempList.filter((e: any) => e.ownerReview.split(',').map((value: string) => value === '1') && e.statusReviewTypeDetail === "1" && e.contentReview === "ORDER" && e.reviewType === "GOOD" && e.stageReview === "DGTG"));
        setDgcdvGoodList(tempList.filter((e: any) => e.ownerReview.split(',').map((value: string) => value === '1') && e.statusReviewTypeDetail === "1" && e.contentReview === "ORDER" && e.reviewType === "GOOD" && e.stageReview === "DGCDV"));
        setDgpGoodList(tempList.filter((e: any) => e.ownerReview.split(',').map((value: string) => value === '1') && e.statusReviewTypeDetail === "1" && e.contentReview === "ORDER" && e.reviewType === "GOOD" && e.stageReview === "DGP"));

        setDgTgBadList(tempList.filter((e: any) => e.ownerReview.split(',').map((value: string) => value === '1') && e.statusReviewTypeDetail === "1" && e.contentReview === "ORDER" && e.reviewType === "BAD" && e.stageReview === "DGTG"));
        setDgcdvBadList(tempList.filter((e: any) => e.ownerReview.split(',').map((value: string) => value === '1') && e.statusReviewTypeDetail === "1" && e.contentReview === "ORDER" && e.reviewType === "BAD" && e.stageReview === "DGCDV"));
        setDgpBadList(tempList.filter((e: any) => e.ownerReview.split(',').map((value: string) => value === '1') && e.statusReviewTypeDetail === "1" && e.contentReview === "ORDER" && e.reviewType === "BAD" && e.stageReview === "DGP"));

        setIsCheckStatusDgtg(funcCheckListStatus(tempList.filter((e: any) => e.ownerReview.split(',').map((value: string) => value === '1') && e.contentReview === "ORDER" && e.stageReview === "DGTG")));
        setIsCheckStatusDgp(funcCheckListStatus(tempList.filter((e: any) => e.ownerReview.split(',').map((value: string) => value === '1') && e.contentReview === "ORDER" && e.stageReview === "DGP")));
        setIsCheckStatusDgcdv(funcCheckListStatus(tempList.filter((e: any) => e.ownerReview.split(',').map((value: string) => value === '1') && e.contentReview === "ORDER" && e.stageReview === "DGCDV")));
    }

    const funcGetNameConfig = (listReview: any, listConfig: any) => {
        const Temp: any = [];
        if (listReview != null) {
            const arr = listReview.split(',');
            arr.forEach((ids: any) => {
                const numberIds = Number(ids);
                const name = listConfig.find((e: any) => e.id === numberIds);
                Temp.push(name)
            });
        }
        return Temp;
    }

    const setFillData = (list: any, listConfig: any) => {
        const dataDgtg = list.find((e: any) => e.stageReview === "DGTG");
        if (dataDgtg != null) {
            setDisableDgtg(true);
            setReviewDgtg(false);
            setValueRateDgtg(dataDgtg.rate);
            setDataReviewDgtg(dataDgtg);
            setDataReviewDgtgList(funcGetNameConfig(dataDgtg.listReview, listConfig));
        } else {
            setReviewDgtg(true);
        }

        const dataDgp = list.find((e: any) => e.stageReview === "DGP");
        if (dataDgp != null) {
            setDisableDgp(true);
            setReviewDgp(false);
            setValueRateDgp(dataDgp.rate);
            setDataReviewDgp(dataDgp);
            setDataReviewDgpList(funcGetNameConfig(dataDgp.listReview, listConfig));
        } else {
            setReviewDgp(true);
        }

        const dataDgcdv = list.find((e: any) => e.stageReview === "DGCDV");
        if (dataDgcdv != null) {
            setDisableDgcdv(true);
            setReviewDgcdv(false);
            setValueRateDgcdv(dataDgcdv.rate);
            setDataReviewDgcdv(dataDgcdv);
            setDataReviewDgcdvList(funcGetNameConfig(dataDgcdv.listReview, listConfig));
        } else {
            setReviewDgcdv(true);
        }
    }

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
                loadRateDefault(res.data);
                getAllListOrderReview(res.data);
            }
        })
    }

    // const getOrderReviewByOriginalId = () => {
    //     configReviewApi.getOrderReviewEntityByOriginalId(props.originalId!).then((res) => {
    //         if (res.status === 200) {
    //             console.log("res.data", res.data);

    //         }
    //     })
    // }

    useEffect(() => {
        getAllListConfigReview();
        // getOrderReviewByOriginalId();
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

    //Gửi yêu cầu Đánh giá thu gom
    const onFinishDgtg = (values: any) => {
        setIsLoading(true);
        setDisableDgtg(true);
        const record = {
            originalId: props.originalId,
            itemCode: props.itemCode,
            owner: '',
            orgCode: '',
            name: '',
            phone: '',
            rate: valueRateDgtg,
            listReview: arrRateDgtg.join(','),
            otherContent: values.otherContent,
            stageReview: 'DGTG'
        }
        // console.log("Đánh giá thu gom", record);
        orderReviewApi.createorderReview(record)
            .then((resp) => {
                if (resp.status === 200) {
                    message.success('Cập nhật thành công !');
                } else {
                    message.error('Cật nhật thất bại !');
                }
            }).finally(() => setIsLoading(false));
    }

    //Gửi yêu cầu Đánh giá chung
    const onFinishDgcdv = (values: any) => {
        setIsLoading(true);
        setDisableDgcdv(true);
        const record = {
            originalId: props.originalId,
            itemCode: props.itemCode,
            owner: '',
            orgCode: '',
            name: '',
            phone: '',
            rate: valueRateDgcdv,
            listReview: arrRateDgcdv.join(','),
            otherContent: values.otherContent,
            stageReview: 'DGCDV'
        }
        // console.log("Đánh giá chung", record);

        orderReviewApi.createorderReview(record)
            .then((resp) => {
                if (resp.status === 200) {
                    message.success('Cập nhật thành công !');
                } else {
                    message.error('Cật nhật thất bại !');
                }
            }).finally(() => setIsLoading(false));
    }

    //Gửi yêu cầu Đánh giá phát
    const onFinishDgp = (values: any) => {
        setIsLoading(true);
        setDisableDgp(true);
        const record = {
            originalId: props.originalId,
            itemCode: props.itemCode,
            owner: '',
            orgCode: '',
            name: '',
            phone: '',
            rate: valueRateDgp,
            listReview: arrRateDgp.join(','),
            otherContent: values.otherContent,
            stageReview: 'DGP'
        }
        // console.log("Đánh giá phát", record);
        orderReviewApi.createorderReview(record)
            .then((resp) => {
                if (resp.status === 200) {
                    message.success('Cập nhật thành công !');
                } else {
                    message.error('Cật nhật thất bại !');
                }
            }).finally(() => setIsLoading(false));
    }

    const onChangeValueRateDgtg = (value: any) => {
        setValueRateDgtg(value);
        if ((valueRateDgtg === 1 || valueRateDgtg === 2) && value > 2) {
            setArrRateDgtg([]);
            formDgtg.resetFields();
        } else if (valueRateDgtg === 3 && value != 3) {
            setArrRateDgtg([]);
            formDgtg.resetFields();
        } else if ((valueRateDgtg === 4 || valueRateDgtg === 5) && value < 4) {
            setArrRateDgtg([]);
            formDgtg.resetFields();
        }
    }

    const onChangeValueRateDgp = (value: any) => {
        setValueRateDgp(value);
        if ((valueRateDgp === 1 || valueRateDgp === 2) && value > 2) {
            setArrRateDgp([]);
            formDgp.resetFields();
        } else if (valueRateDgp === 3 && value != 3) {
            setArrRateDgp([]);
            formDgp.resetFields();
        } else if ((valueRateDgp === 4 || valueRateDgp === 5) && value < 4) {
            setArrRateDgp([]);
            formDgp.resetFields();
        }
    }

    const onChangeValueRateDgcdv = (value: any) => {
        setValueRateDgcdv(value);
        if ((valueRateDgcdv === 1 || valueRateDgcdv === 2) && value > 2) {
            setArrRateDgcdv([]);
            formDgcdv.resetFields();
        } else if (valueRateDgcdv === 3 && value != 3) {
            setArrRateDgcdv([]);
            formDgcdv.resetFields();
        } else if ((valueRateDgcdv === 4 || valueRateDgcdv === 5) && value < 4) {
            setArrRateDgcdv([]);
            formDgcdv.resetFields();
        }
    }

    const onClickButtonDgtg = (id: any) => {
        const newArr = [...arrRateDgtg];
        const index = newArr.findIndex((c: any) => c === id);
        if (index == -1) {
            newArr.push(id);
        } else {
            newArr.splice(index, 1);
        }
        setArrRateDgtg(newArr);
    }

    const onClickButtonDgp = (id: any) => {
        const newArr = [...arrRateDgp];
        const index = newArr.findIndex((c: any) => c === id);
        if (index == -1) {
            newArr.push(id);
        } else {
            newArr.splice(index, 1);
        }
        setArrRateDgp(newArr);
    }

    const onClickButtonDgcdv = (id: any) => {
        const newArr = [...arrRateDgcdv];
        const index = newArr.findIndex((c: any) => c === id);
        if (index == -1) {
            newArr.push(id);
        } else {
            newArr.splice(index, 1);
        }
        setArrRateDgcdv(newArr);
    }

    return (
        <Modal
            title={"Đánh giá đơn hàng - " + props.itemCode}
            visible={props.isOpenPopup}
            width={1000}
            onOk={() => props.setIsOpenPopup(false)}
            onCancel={() => props.setIsOpenPopup(false)}
            footer={null}
        >
            {
                props.sendType != "2" && isCheckStatusDgtg &&
                <Card extra={
                    <Button
                        icon={isDgtg ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        onClick={onClickDgtg} />
                }
                    size='small' bordered={false} className="fadeInRight"
                    title={isReviewDgtg ? "Đánh giá bưu tá thu gom" : "Xem kết quả đánh giá bưu tá thu gom"}>
                    {isDgtg &&
                        <>
                            {
                                <Form name="form-evaluate-sender-dgtg"
                                    labelWrap
                                    labelAlign="left"
                                    onFinish={onFinishDgtg}
                                    form={formDgtg}
                                >
                                    <Col span={24}>
                                        <Form.Item label="Mức độ hài lòng của quý khách:" name="">
                                            <Rate style={{ marginTop: 10, fontSize: 36, marginLeft: '15%' }} tooltips={desc} onChange={onChangeValueRateDgtg} value={valueRateDgtg} disabled={isDisableDgtg} />
                                            {valueRateDgtg ? <span className="ant-rate-text">{desc[valueRateDgtg - 1]}</span> : ''}
                                        </Form.Item>
                                    </Col>
                                    {
                                        isReviewDgtg ?
                                            <>
                                                {
                                                    (valueRateDgtg === 1 || valueRateDgtg === 2) &&
                                                    <Col span={24} style={{ marginBottom: 20, textAlign: "center" }}>
                                                        {
                                                            dgTgBadList.length ? dgTgBadList.map(c => (
                                                                <Button disabled={isDisableDgtg} className={arrRateDgtg.includes(c.id) ? 'btn-rate' : 'btn-rate-unclick'} onClick={() => onClickButtonDgtg(c.id)}>{c.reviewTypeDetail}</Button>
                                                            )) : ''
                                                        }
                                                    </Col>
                                                }
                                                {
                                                    (valueRateDgtg === 4 || valueRateDgtg === 5) &&
                                                    <Col span={24} style={{ marginBottom: 20, textAlign: "center" }}>
                                                        {
                                                            dgTgGoodList.length ? dgTgGoodList.map(c => (
                                                                <Button disabled={isDisableDgtg} className={arrRateDgtg.includes(c.id) ? 'btn-rate' : 'btn-rate-unclick'} onClick={() => onClickButtonDgtg(c.id)}>{c.reviewTypeDetail}</Button>
                                                            )) : ''
                                                        }
                                                    </Col>
                                                }
                                                {
                                                    valueRateDgtg > 0 && <>
                                                        <Col span={24}>
                                                            <Form.Item name="otherContent" label="">
                                                                <TextArea showCount maxLength={250} disabled={isDisableDgtg} rows={3} placeholder="Thêm ý kiến đóng góp" />
                                                            </Form.Item>
                                                        </Col>
                                                        <Row justify='center' style={{ marginTop: -30, marginBottom: 10 }}>
                                                            <Col>
                                                                <Button disabled={isDisableDgtg} loading={isLoading} className='custom-btn4 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" form="form-evaluate-sender-dgtg" size="large" >
                                                                    Gửi đánh giá
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                }
                                            </>
                                            :
                                            <>
                                                <Col span={24} style={{ marginBottom: '10px' }}>
                                                    <Row>
                                                        <Col span={24}>
                                                            {
                                                                dataReviewDgtgList.map(e => (
                                                                    <p className="span-font">{e.reviewTypeDetail}</p>
                                                                ))
                                                            }
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col span={24}>
                                                    <span className="span-font"><label className="label">Ý kiến khác: </label> {dataReviewDgtg?.otherContent}</span>
                                                </Col>
                                            </>
                                    }
                                </Form>
                            }

                        </>
                    }
                </Card>
            }

            {
                // props.status === 14 && 
                isCheckStatusDgp &&
                <>
                    <Divider />
                    <Card extra={
                        <Button
                            icon={isDgp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            onClick={onClickDgp} />
                    }
                        size='small' bordered={false} className="fadeInRight"
                        title={isReviewDgp ? "Đánh giá bưu tá phát" : "Xem kết quả đánh giá bưu tá phát"}>
                        {isDgp &&
                            <Form name="form-evaluate-sender-dgp"
                                labelWrap
                                labelAlign="left"
                                onFinish={onFinishDgp}
                                form={formDgp}
                            >
                                <Col span={24}>
                                    <Form.Item label="Mức độ hài lòng của quý khách:" name="">
                                        <span>
                                            <Rate style={{ marginTop: 10, fontSize: 36, marginLeft: '15%' }} tooltips={desc} onChange={onChangeValueRateDgp} value={valueRateDgp} disabled={isDisableDgp} />
                                            {valueRateDgp ? <span className="ant-rate-text">{desc[valueRateDgp - 1]}</span> : ''}
                                        </span>
                                    </Form.Item>
                                </Col>
                                {
                                    isReviewDgp ?
                                        <>
                                            {
                                                (valueRateDgp === 1 || valueRateDgp === 2) &&
                                                <Col span={24} style={{ marginBottom: '20px', textAlign: "center" }}>
                                                    {
                                                        dgpBadList.length ? dgpBadList.map(c => (
                                                            <Button disabled={isDisableDgp} className={arrRateDgp.includes(c.id) ? 'btn-rate' : 'btn-rate-unclick'} style={{ borderRadius: 20, margin: 5 }} onClick={() => onClickButtonDgp(c.id)}>{c.reviewTypeDetail}</Button>
                                                        )) : ''
                                                    }
                                                </Col>
                                            }
                                            {
                                                (valueRateDgp === 4 || valueRateDgp === 5) &&
                                                <Col span={24} style={{ marginBottom: '20px', textAlign: "center" }}>
                                                    {
                                                        dgpGoodList.length ? dgpGoodList.map(c => (
                                                            <Button disabled={isDisableDgp} className={arrRateDgp.includes(c.id) ? 'btn-rate' : 'btn-rate-unclick'} style={{ borderRadius: 20, margin: 5 }} onClick={() => onClickButtonDgp(c.id)}>{c.reviewTypeDetail}</Button>
                                                        )) : ''
                                                    }
                                                </Col>
                                            }
                                            {
                                                valueRateDgp > 0 && <>
                                                    <Col span={24}>
                                                        <Form.Item name="otherContent" label="">
                                                            <TextArea showCount maxLength={250} disabled={isDisableDgp} rows={3} placeholder="Thêm ý kiến đóng góp" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Row justify='center' style={{ marginTop: -30, marginBottom: 10 }}>
                                                        <Col>
                                                            <Button disabled={isDisableDgp} loading={isLoading} className='custom-btn4 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" form="form-evaluate-sender-dgp" size="large" >
                                                                Gửi đánh giá
                                                            </Button>
                                                        </Col>
                                                    </Row></>
                                            }
                                        </>
                                        :
                                        <>
                                            <Col span={24} style={{ marginBottom: '10px' }}>
                                                <Row>
                                                    <Col span={24}>
                                                        {
                                                            dataReviewDgpList.map(e => (
                                                                <p className="span-font">{e.reviewTypeDetail}</p>
                                                            ))
                                                        }
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col span={24}>
                                                <span className="span-font"><label className="label">Ý kiến khác: </label> {dataReviewDgp?.otherContent}</span>
                                            </Col>
                                        </>
                                }

                            </Form>
                        }
                    </Card>
                </>
            }


            {
                // props.status === 14 && 
                isCheckStatusDgcdv &&
                <>
                    <Divider />
                    <Card extra={
                        <Button
                            icon={isDgcdv ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            onClick={onClickDgcdv} />
                    }
                        size='small' bordered={false} className="fadeInRight"
                        title={isReviewDgcdv ? "Đánh giá chung dịch vụ" : "Xem kết quả đánh giá chung dịch vụ"}>
                        {isDgcdv &&
                            <Form name="form-evaluate-sender-dgcdv"
                                labelWrap
                                labelAlign="left"
                                onFinish={onFinishDgcdv}
                                form={formDgcdv}
                            >
                                <Col span={24}>
                                    <Form.Item label="Mức độ hài lòng của quý khách:" name="">
                                        <span>
                                            <Rate style={{ marginTop: 10, fontSize: 36, marginLeft: '15%' }} tooltips={desc} onChange={onChangeValueRateDgcdv} value={valueRateDgcdv} disabled={isDisableDgcdv} />
                                            {valueRateDgcdv ? <span className="ant-rate-text">{desc[valueRateDgcdv - 1]}</span> : ''}
                                        </span>
                                    </Form.Item>
                                </Col>
                                {
                                    isReviewDgcdv ?
                                        <>
                                            {
                                                (valueRateDgcdv === 1 || valueRateDgcdv === 2) &&
                                                <Col span={24} style={{ marginBottom: '20px', textAlign: "center" }}>

                                                    {
                                                        dgcdvBadList.length ? dgcdvBadList.map(c => (
                                                            <Button disabled={isDisableDgcdv} className={arrRateDgcdv.includes(c.id) ? 'btn-rate' : 'btn-rate-unclick'} style={{ borderRadius: 20, margin: 5 }} onClick={() => onClickButtonDgcdv(c.id)}>{c.reviewTypeDetail}</Button>
                                                        )) : ''
                                                    }
                                                </Col>
                                            }
                                            {
                                                (valueRateDgcdv === 4 || valueRateDgcdv === 5) &&
                                                <Col span={24} style={{ marginBottom: '20px', textAlign: "center" }}>
                                                    {
                                                        dgcdvGoodList.length ? dgcdvGoodList.map(c => (
                                                            <Button disabled={isDisableDgcdv} className={arrRateDgcdv.includes(c.id) ? 'btn-rate' : 'btn-rate-unclick'} style={{ borderRadius: 20, margin: 5 }} onClick={() => onClickButtonDgcdv(c.id)}>{c.reviewTypeDetail}</Button>
                                                        )) : ''
                                                    }
                                                </Col>
                                            }
                                            {
                                                valueRateDgcdv > 0 && <>
                                                    <Col span={24}>
                                                        <Form.Item name="otherContent" label="">
                                                            <TextArea showCount maxLength={250} disabled={isDisableDgcdv} rows={3} placeholder="Thêm ý kiến đóng góp" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Row justify='center' style={{ marginTop: -30, marginBottom: 10 }}>
                                                        <Col>
                                                            <Button disabled={isDisableDgcdv} loading={isLoading} className='custom-btn4 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" form="form-evaluate-sender-dgcdv" size="large" >
                                                                Gửi đánh giá
                                                            </Button>
                                                        </Col>
                                                    </Row></>
                                            }
                                        </>
                                        :
                                        <>
                                            <Col span={24} style={{ marginBottom: '10px' }}>
                                                <Row>
                                                    <Col span={24}>
                                                        {
                                                            dataReviewDgcdvList.map(e => (
                                                                <p className="span-font">{e.reviewTypeDetail}</p>
                                                            ))
                                                        }
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col span={24}>
                                                <span className="span-font"><label className="label">Ý kiến khác: </label> {dataReviewDgcdv?.otherContent}</span>
                                            </Col>
                                        </>
                                }
                            </Form>
                        }
                    </Card>
                </>
            }
        </Modal >
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

export default EvaluateSender;


