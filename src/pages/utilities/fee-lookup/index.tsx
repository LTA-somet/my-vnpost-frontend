import Address2 from "@/components/Address/Address";
import { formatInputNumber, validateMessages } from "@/core/contains";
import { useMyvnpServiceGroupList, useServiceList } from "@/core/selectors";
import { FeeResponseDto, McasNationalApi, McasNationalCityDto, McasNationalDto, OrderBillingDto } from "@/services/client";
import { FeeLookupApi, OrderBillingDtoPatternEnum } from "@/services/client";
import { dataToSelectBox, formatNumber } from "@/utils";
import { DropboxOutlined, SearchOutlined, UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { Button, Card, Col, Form, InputNumber, Row, Select, Spin, Table } from "antd"
import { useEffect, useState } from "react"
// import './style.css'

const columns = [
    {
        title: 'SPDV',
        dataIndex: 'serviceName',
        key: 'serviceName'
    },
    {
        title: 'Tổng cước tạm tính (VNĐ)',
        dataIndex: 'totalFee',
        align: 'right',
        key: 'totalFee',
    },
    {
        title: 'Thời gian phát dự kiến',
        dataIndex: 'timeDelivery',
        key: 'timeDelivery',
    }
]

const feeLookupApi = new FeeLookupApi();
const mcasNationalApi = new McasNationalApi();
const FeeLookup = () => {
    const [postType, setPostType] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRange, setIsRange] = useState<boolean>(false);
    const serviceList = useServiceList();
    const services = serviceList.filter(s => s.scope === '1').map(service => service.mailServiceId);
    const servicesInternational = serviceList.filter(s => s.scope === '2').map(service => service.mailServiceId);
    const [form] = Form.useForm();
    const [feeList, setFeeList] = useState<any[]>([]);
    const [nationalList, setNationalList] = useState<McasNationalDto[]>([]);
    const serviceGroupList = useMyvnpServiceGroupList();
    const serviceGroupListHas = serviceGroupList.filter(sg => serviceList.some(s => s.myvnpServiceGroupId === sg.serviceGroupId));
    const renderSerViceName = (feeResponse: FeeResponseDto) => {
        const objService = serviceList.find(s => s.mailServiceId === feeResponse?.serviceCode);
        const billing = feeResponse?.orderBillingDtos;
        const feeNotRate = billing?.filter(b => b.pattern !== OrderBillingDtoPatternEnum.Rate);
        const totalFee = feeNotRate?.reduce((a, b: OrderBillingDto) => a + b.fee!, 0);
        const serviceGroup = serviceGroupListHas.find(group => group.serviceGroupId === objService?.myvnpServiceGroupId);
        return ({
            serviceName: `${serviceGroup?.serviceGroupName} - ${objService?.myvnpMailServiceName}`,
            totalFee: `${billing?.length !== 0 ? formatNumber(totalFee) : 'Lỗi tính cước'}`,
            timeDelivery: `${feeResponse.fromDate ? `Từ ${feeResponse.fromDate} đến ${feeResponse.toDate} ngày, ` : ''}`
        })

    }

    const calulateFee = (param: any) => {
        setIsLoading(true)
        feeLookupApi.feeLookup(param)
            .then(resp => {
                console.log("resp.data", resp.data);

                if (resp.status === 200) {
                    setFeeList(resp.data.map(data => renderSerViceName(data)));
                }
            }).finally(() => setIsLoading(false));
    }

    const onFinish = (param: any) => {
        calulateFee(param)
    }

    const { Option } = Select;

    const onChangeRange = (value: any) => {
        if (value === "2") {
            setIsRange(true);
            setFeeList([]);
            form.resetFields();
            form.setFieldsValue({
                range: "2"
            })
        } else {
            setIsRange(false);
            setFeeList([]);
            form.resetFields();
            form.setFieldsValue({
                range: "1"
            })
        }
    }

    const getAllNationals = () => {
        mcasNationalApi.getAllNationals()
            .then(resp => {
                if (resp.status === 200) {
                    setNationalList(resp.data);
                }
            }).catch(() => setNationalList([]));
    }

    const onReCalculatePriceWeight = () => {
        const height: number = form.getFieldValue('height') || 0;
        const width: number = form.getFieldValue('width') || 0;
        const length: number = form.getFieldValue('length') || 0;


        let dimWeight = 0;
        if (height && width && length) {
            dimWeight = Math.round((height * length * width) / 6);
        }
        form.setFieldsValue({
            'dimWeight': dimWeight
        });
    }

    const onChangePostType = (value: any) => {
        setPostType(value)
    }

    useEffect(() => {
        getAllNationals();
    }, [])

    const locale = {
        emptyText: 'Không tồn tại dữ liệu cước phí',
    };

    return (
        <PageContainer>
            <Spin spinning={isLoading}>
                <Card className="fadeInRight" size="small" bordered={false}>
                    <Form
                        name="form-fee-lookup"
                        labelCol={{ flex: '130px' }}
                        labelWrap
                        labelAlign="left"
                        onFinish={onFinish}
                        form={form}
                        validateMessages={validateMessages}
                    >
                        <Row gutter={24}>
                            <Col span={12} >
                                <Form.Item
                                    name="range"
                                    label="Phạm vi gửi hàng: "
                                    initialValue={"1"}
                                    labelCol={{ flex: '140px' }}
                                >
                                    <Select onChange={onChangeRange}>
                                        <Option value="1">Trong nước</Option>
                                        <Option value="2">Quốc tế</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            {/* Tra cứu cước quốc tế */}
                            {isRange && <Col span={12} >
                                <Form.Item
                                    name="receiverNational"
                                    label="Quốc gia"
                                    rules={[{ required: true, message: 'Quốc gia là bắt buộc' }]}
                                >
                                    <Select showSearch allowClear>
                                        {nationalList.map((element: McasNationalDto) => {
                                            return (
                                                <Option value={element.code}>{element.name} ({element.code})</Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>}
                        </Row>
                        {isRange ? <>
                            <Row gutter={24}>
                                <Col span={12} >
                                    <Form.Item
                                        name="typePostage"
                                        label="Loại bưu gửi"
                                        labelCol={{ flex: '140px' }}
                                        initialValue={"TL"}
                                        rules={[{ required: true, message: 'Loại bưu gửi là bắt buộc' }]}
                                    >
                                        <Select onChange={onChangePostType}>
                                            <Option value="TL">Tài liệu</Option>
                                            <Option value="HH">Hàng hóa</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12} >
                                    <Form.Item name="weight" label="Tổng Khối lượng" rules={[{ required: true, message: 'Khối lượng là bắt buộc' }]}>
                                        <InputNumber style={{ width: '100%' }} min={0} max={1000000000} addonAfter="gram" {...formatInputNumber} />
                                    </Form.Item>
                                </Col>
                                {postType === 'HH' && <>
                                    <Col span={12}>
                                        <Row gutter={8}>
                                            <Col style={{ width: 140, paddingTop: 4 }}>
                                                <span className='font-custome'>Kích thước (cm)</span>
                                            </Col>
                                            <Col style={{ width: `calc(100% - 140px)` }}>
                                                <Row gutter={8}>
                                                    <Col span={8} >
                                                        <Form.Item
                                                            name="length"
                                                        >
                                                            <InputNumber style={{ width: '100%' }} min={0} max={1000000000} placeholder='Dài' maxLength={50} onBlur={onReCalculatePriceWeight}
                                                                {...formatInputNumber}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            name="width"
                                                        >
                                                            <InputNumber style={{ width: '100%' }} min={0} max={1000000000} placeholder='Rộng' maxLength={50} onBlur={onReCalculatePriceWeight}
                                                                {...formatInputNumber}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            name="height"
                                                        >
                                                            <InputNumber style={{ width: '100%' }} min={0} max={1000000000} placeholder='Cao' maxLength={50} onBlur={onReCalculatePriceWeight}
                                                                {...formatInputNumber}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            labelCol={{ flex: '130px' }}
                                            name="dimWeight"
                                            label="Khối lượng quy đổi"
                                            initialValue={0}
                                        >
                                            <InputNumber style={{ width: '100%' }} min={0} max={1000000000} disabled addonAfter="gram"
                                                {...formatInputNumber}
                                            />
                                        </Form.Item>
                                    </Col>
                                </>
                                }
                            </Row>
                            <Row justify="center">
                                <Col style={{ textAlign: 'center' }}>
                                    <Button className='height-btn2 btn-outline-info' icon={<SearchOutlined />} title='Tra cứu' htmlType='submit' >Tra cứu</Button>
                                </Col>
                            </Row>
                        </> :
                            <>
                                <Row gutter={24}>
                                    <Col span={12} >
                                        <Card size="small" bordered={false} className="fadeInRight" title={<div><UserOutlined /> Người gửi</div>} >

                                            <Address2 form={form} md={24} lg={24} requiredDist={true} requiredProv={true}
                                                // addressField="senderAddress"
                                                provinceField='senderProvinceCode'
                                                districtField='senderDistrictCode'
                                                communeField='senderrCommuneCode'
                                            />

                                        </Card>
                                    </Col>
                                    <Col span={12} >
                                        <Card size="small" bordered={false} className="fadeInRight" title={<div><UserSwitchOutlined /> Người nhận</div>}>

                                            <Address2 form={form} md={24} lg={24} requiredDist={true} requiredProv={true}
                                                // addressField="receiverAddress"
                                                provinceField='receiverProvinceCode'
                                                districtField='receiverDistrictCode'
                                                communeField='receiverCommuneCode'
                                            />

                                        </Card>
                                    </Col>
                                </Row>
                                <Card size="small" bordered={false} className="fadeInRight" title={<div ><DropboxOutlined /> Thông tin bưu gửi</div>}>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item name="weight" label="Khối lượng" rules={[{ required: true, message: 'Khối lượng là bắt buộc' }]}>
                                                <InputNumber style={{ width: '100%' }} min={0} max={1000000000} addonAfter="gram" {...formatInputNumber} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item labelCol={{ flex: '140px' }} name="codAmount" label="Số tiền thu hộ" rules={[{ pattern: new RegExp("^[0-9]"), message: 'Số tiền không đúng định dạng!' }]}>
                                                <InputNumber style={{ width: '100%' }} min={0} max={1000000000} addonAfter="VNĐ" {...formatInputNumber} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Row gutter={8}>
                                                <Col style={{ width: 130, paddingTop: 4 }}>
                                                    <span className='font-custome'>Kích thước (cm)</span>
                                                </Col>
                                                <Col style={{ width: `calc(100% - 130px)` }}>
                                                    <Row gutter={8}>
                                                        <Col span={8} >
                                                            <Form.Item
                                                                name="length"
                                                            >
                                                                <InputNumber style={{ width: '100%' }} min={0} max={1000000000} placeholder='Dài' maxLength={50} onBlur={onReCalculatePriceWeight}
                                                                    {...formatInputNumber}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                name="width"
                                                            >
                                                                <InputNumber style={{ width: '100%' }} min={0} max={1000000000} placeholder='Rộng' maxLength={50} onBlur={onReCalculatePriceWeight}
                                                                    {...formatInputNumber}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                name="height"
                                                            >
                                                                <InputNumber style={{ width: '100%' }} min={0} max={1000000000} placeholder='Cao' maxLength={50} onBlur={onReCalculatePriceWeight}
                                                                    {...formatInputNumber}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                labelCol={{ flex: '140px' }}
                                                name="dimWeight"
                                                label="Khối lượng quy đổi"
                                                initialValue={0}
                                            >
                                                <InputNumber style={{ width: '100%' }} min={0} max={1000000000} disabled addonAfter="gram"
                                                    {...formatInputNumber}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Form.Item name='services' hidden initialValue={services} />
                                    </Row>
                                </Card>
                                <br />
                                <Row justify="center">
                                    <Col style={{ textAlign: 'center' }}>
                                        <Button className='height-btn2 btn-outline-info' icon={<SearchOutlined />} title='Tra cứu' htmlType='submit' >Tra cứu</Button>
                                    </Col>
                                </Row>
                            </>}
                    </Form>
                </Card>
                {/* {feeList.length > 0 && */}
                <Card size="small" bordered={false} className="fadeInRight" title={'Cước phí'}>
                    <Table size="small" bordered dataSource={feeList} columns={columns} locale={locale} />
                </Card>
                {/* } */}
            </Spin>
        </PageContainer >
    )
};
export default FeeLookup