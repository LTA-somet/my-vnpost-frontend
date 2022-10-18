import { useModel } from 'umi';
import { Button, Card, Checkbox, Col, Divider, Form, message, Modal, Rate, Row, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import './styles.css';
import { formatCurrency } from '@/utils';
import { ArrowDownOutlined, ArrowUpOutlined, SaveOutlined, StarOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useCurrentUser } from '@/core/selectors';
import { P } from '@antv/g2plot';
import { ConfigReviewApi, ConfigReviewDto, OrderReviewApi, OrderReviewDto } from '@/services/client';
import { Label } from '@amcharts/amcharts5';
import { head } from 'lodash';

const desc = ['Rất tệ', 'Tệ', 'Bình thường', 'Khá tốt', 'Rất tốt'];
const CheckboxGroup = Checkbox.Group;

const configReviewApi = new ConfigReviewApi();
const orderReviewApi = new OrderReviewApi();

const EvaluateTicket = (props: Props) => {
    const [isTicket, setShowTicket] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [valueRateTicket, setValueRateTicket] = useState(5);
    const [formCollect] = Form.useForm();
    const [checkedListTicket, setcheckedListTicket] = useState<CheckboxValueType[]>([]);
    const [dgTicketBadList, setDgTicketBadList] = useState<ConfigReviewDto[]>([]);
    const [dgTicketGoodList, setDgTicketGoodList] = useState<ConfigReviewDto[]>([]);
    const [isDisabled, setDisabled] = useState(false);
    const currentUser = useCurrentUser();
    const dataTicket = props.data;
    const [isReview, setReview] = useState(false);
    const [dataBindingList, setDataBindingList] = useState<ConfigReviewDto[]>([]);
    const [dataBinding, setDataBinding] = useState<OrderReviewDto>();
    const [isCheckStatusTicket, setIsCheckStatusTicket] = useState(false);
    const [arrRateTicket, setArrRateTicket] = useState<any>([]);
    // const [count, setCount] = useState(0);

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
        const data = list.find((e: any) => e.stageReview === "DGTIKET");
        if (data != null) { //Đã đánh giá
            setDisabled(true);
            setReview(false);
            setValueRateTicket(data.rate);
            setDataBinding(data);
            setDataBindingList(funcGetNameConfig(data.listReview, listConfig));
            // const arr = data.listReview.split(',');
            // const Temp: any = [];
            // arr.forEach((ids: any) => {
            //     const name = listConfig.find((e: any) => e.id == ids);
            //     Temp.push(name)
            // });
            // setDataBindingList(Temp);
        } else {
            setReview(true);
        }
    }

    //Get data by CurrentUser.orgCde, originalId sau đó xử lý lọc theo khâu ở phía dưới FE gọi hàm setFillData()
    const getAllListOrderReview = (listConfig: any) => {
        orderReviewApi.getAllByOnlyOrderReview('', dataTicket.ttkCode).then((res) => {
            if (res.status === 200) {
                setFillData(res.data, listConfig);
            }
        })
    }

    const funcCheckListStatus = (list: any[]) => {
        if (list != null) {
            const data = list.find((e: any) => e.status);
            const arr = data.status.split(',');
            const index = arr.findIndex((e: any) => Number(e) === dataTicket.ttkStatusMyVnpost);
            if (index != -1) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    const loadDataBindingDefault = (ticketList: any) => {
        setDgTicketBadList(ticketList.filter((e: any) => e.reviewType === 'BAD' && e.statusReviewTypeDetail === "1"));
        setDgTicketGoodList(ticketList.filter((e: any) => e.reviewType === 'GOOD' && e.statusReviewTypeDetail === "1"));

        setIsCheckStatusTicket(funcCheckListStatus(ticketList));
    }

    const getAllListConfigReview = () => {
        configReviewApi.getAllByTicket().then((res) => {
            if (res.status === 200) {
                loadDataBindingDefault(res.data);
                getAllListOrderReview(res.data);
            }
        })
    }

    useEffect(() => {
        getAllListConfigReview();
    }, []);


    const onClickTicket = () => {
        setShowTicket(!isTicket);
    }

    const onChangeCheckBoxTicket = (list: CheckboxValueType[]) => {
        setcheckedListTicket(list);
    };

    //Gửi yêu cầu Đánh giá yêu cầu hỗ trợ
    const onFinishTicket = (values: any) => {
        setIsLoading(true);
        setDisabled(true);
        const record = {
            originalId: '',
            ticketId: dataTicket.ttkCode,
            itemCode: dataTicket.parcelId,
            owner: '',
            orgCode: '',
            name: '',
            phone: '',
            rate: valueRateTicket,
            listReview: arrRateTicket.join(','),
            otherContent: values.otherContent,
            stageReview: 'DGTIKET'
        }
        orderReviewApi.createorderReview(record)
            .then((resp) => {
                if (resp.status === 200) {
                    message.success('Cập nhật thành công !');
                } else {
                    message.error('Cật nhật thất bại !');
                }
            }).finally(() => setIsLoading(false));

    }

    const onChangeValueRateTicket = (value: any) => {
        setValueRateTicket(value);
        if ((valueRateTicket === 1 || valueRateTicket === 2) && value > 2) {
            // setcheckedListTicket([]);
            setArrRateTicket([]);
            formCollect.resetFields();
        } else if (valueRateTicket === 3 && value != 3) {
            // setcheckedListTicket([]);
            setArrRateTicket([]);
            formCollect.resetFields();
        } else if ((valueRateTicket === 4 || valueRateTicket === 5) && value < 4) {
            // setcheckedListTicket([]);
            setArrRateTicket([]);
            formCollect.resetFields();
        }
    }

    const onClickButtonTicket = (id: any) => {
        const newArr = [...arrRateTicket];
        const index = newArr.findIndex((c: any) => c === id);
        if (index == -1) {
            newArr.push(id);
        } else {
            newArr.splice(index, 1);
        }
        setArrRateTicket(newArr);
    }

    // console.log("data ticket", props.data);

    return (
        <Modal
            title={isReview ? "Đánh giá yêu cầu hỗ trợ - " + (dataTicket.parcelId == null ? '' : dataTicket.parcelId) : "Xem kết quả đánh giá yêu cầu hỗ trợ"}
            visible={props.isOpenPopup}
            width={1000}
            onOk={() => props.setIsOpenPopup(false)}
            onCancel={() => props.setIsOpenPopup(false)}
            footer={null}
        >
            {/* <Card extra={
                <Button
                    icon={isTicket ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    onClick={onClickTicket} />
            }
                size='small' bordered={false} className="fadeInRight" title="Đánh giá yêu cầu hỗ trợ">
                {isTicket &&
                    <> */}
            {
                currentUser.uid === dataTicket.createdUser && isCheckStatusTicket &&
                <Form name="form-evaluate-ticket"
                    labelWrap
                    labelAlign="left"
                    onFinish={onFinishTicket}
                    form={formCollect}
                >
                    <Col span={24}>
                        <Form.Item label="Mức độ hài lòng của quý khách:" name="">
                            <span>
                                <Rate style={{ marginTop: 10, fontSize: 36, marginLeft: '15%' }} tooltips={desc} onChange={onChangeValueRateTicket} value={valueRateTicket} disabled={isDisabled} />
                                {valueRateTicket ? <span className="ant-rate-text">{desc[valueRateTicket - 1]}</span> : ''}
                            </span>
                        </Form.Item>
                    </Col>
                    {isReview ?
                        <>
                            {
                                (valueRateTicket === 1 || valueRateTicket === 2) &&
                                // <>Hiển thị danh sách tiêu chí đánh giá xấu theo khâu đánh giá (Bưu tá thu gom)</>
                                <Col span={24} style={{ marginBottom: '20px', textAlign: "center" }}>
                                    {/* <CheckboxGroup value={checkedListTicket} onChange={onChangeCheckBoxTicket}>{
                                        dgTicketBadList.length && dgTicketBadList.map(c => (
                                            <Row key={c.id}>
                                                <Col span={24}>
                                                    <Checkbox value={c.id} disabled={isDisabled}>{c.reviewTypeDetail}</Checkbox>
                                                </Col>
                                            </Row>
                                        ))
                                    }
                                    </CheckboxGroup> */}
                                    {
                                        dgTicketBadList.length ? dgTicketBadList.map(c => (
                                            <Button disabled={isDisabled} className={arrRateTicket.includes(c.id) ? 'btn-rate' : 'btn-rate-unclick'} style={{ borderRadius: 20, margin: 5 }} onClick={() => onClickButtonTicket(c.id)}>{c.reviewTypeDetail}</Button>
                                        )) : ''
                                    }
                                </Col>
                            }
                            {
                                (valueRateTicket === 4 || valueRateTicket === 5) &&
                                <Col span={24} style={{ marginBottom: '20px', textAlign: "center" }}>
                                    {/* <CheckboxGroup value={checkedListTicket} onChange={onChangeCheckBoxTicket}>{
                                        dgTicketGoodList.length && dgTicketGoodList.map(c => (
                                            <Row>
                                                <Col span={24}>
                                                    <Checkbox value={c.id} disabled={isDisabled}>{c.reviewTypeDetail}</Checkbox>
                                                </Col>
                                            </Row>
                                        ))
                                    }
                                    </CheckboxGroup> */}
                                    {
                                        dgTicketGoodList.length ? dgTicketGoodList.map(c => (
                                            <Button disabled={isDisabled} className={arrRateTicket.includes(c.id) ? 'btn-rate' : 'btn-rate-unclick'} style={{ borderRadius: 20, margin: 5 }} onClick={() => onClickButtonTicket(c.id)}>{c.reviewTypeDetail}</Button>
                                        )) : ''
                                    }
                                </Col>
                            }
                            {
                                valueRateTicket > 0 && <>
                                    <Col span={24}>
                                        <Form.Item name="otherContent" label="">
                                            <TextArea showCount maxLength={250} disabled={isDisabled} rows={3} placeholder="Thêm ý kiến đóng góp" />
                                        </Form.Item>
                                        {/* onChange={e => setCount(e.target.value.length)}
                                            <p className='span-font' style={{ textAlign: 'right' }} >{count}/ 250 ký tự</p> */}
                                    </Col>
                                    <Row justify='center' style={{ marginTop: -30 }}>
                                        <Col>
                                            <Button disabled={isDisabled} loading={isLoading} className='custom-btn4 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" form="form-evaluate-ticket" size="large" >
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
                                            dataBindingList.map(e => (
                                                <p className="span-font">{e.reviewTypeDetail}</p>
                                            ))
                                        }
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <span className="span-font"><label className="label">Ý kiến khác: </label> {dataBinding?.otherContent}</span>
                            </Col>
                        </>

                    }

                </Form>
            }
            {/* 
                    </>
                }
            </Card> */}
        </Modal >
    )
};

type Props = {
    isOpenPopup: boolean;
    data: any;
    setIsOpenPopup: (isOpenPopup: boolean) => void;
}

export default EvaluateTicket;


