import type { ProductEntity } from '@/services/client';
import { ProductApi } from '@/services/client';
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Button, Card, Col, Form, Input, InputNumber, Row, Space } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatInputNumber } from '@/core/contains';
import { useModel } from 'umi';
import PackageTable from './package-table';
import { useCurrencyList } from '@/core/selectors';

const productApi = new ProductApi();
const PackageInfo: React.FC<Props> = (props: Props) => {
    const [expand, setExpand] = useState<boolean>(false);
    const [openModalProduct, setOpenModalProduct] = useState<boolean>(false);
    const isTouchedWeight = useRef<boolean>(false);
    const [productList, setProductList] = useState<ProductEntity[]>([]);
    const { serviceListAppend } = useModel('orderModel');
    const currencyList = useCurrencyList();
    const weight = Form.useWatch('weight', props.form);
    const serviceCode = Form.useWatch('serviceCode', props.form);

    // là spdv tài liệu
    const isServiceDocument: boolean = useMemo(() => {
        const service = serviceListAppend.find(s => s.mailServiceId === serviceCode);
        return service?.type === 'TL';
    }, [serviceCode]);

    // const vas: VaDto[] = Form.useWatch('vas', props.form);

    // const isHasPhatMotPhan = useMemo(() => vas?.some(va => va.vaCode === 'GTG068'), [vas]);

    useEffect(() => {
        productApi.findAllProduct()
            .then(resp => {
                if (resp.status === 200) {
                    setProductList(resp.data);
                }
            })
    }, []);

    useEffect(() => {
        // nếu reset form thì set isTouchedWeight = false
        if (!weight) {
            isTouchedWeight.current = false;
        }
    }, [weight])

    const checkNumber = (value: any): boolean => {
        if (isNaN(value)) return false;
        const n: number = +value;
        return n > 0;
    }

    const onReCalculatePriceWeight = () => {
        if (!props.showPackage) {
            const newWeight: number = props.form.getFieldValue('weight') || 0;
            const height: number = props.form.getFieldValue('height') || 0;
            const width: number = props.form.getFieldValue('width') || 0;
            const length: number = props.form.getFieldValue('length') || 0;


            let dimWeight = 0;
            if (height && width && length) {
                dimWeight = Math.round((height * length * width) / 6);
            }
            const priceWeight = Math.max(newWeight, dimWeight);
            props.form.setFieldsValue({
                'dimWeight': dimWeight,
                'priceWeight': priceWeight
            });
        }
    }

    const checkValidate = (_: any, newValues: any[] = []) => {
        if (props.required && newValues.length === 0) {
            return Promise.reject(new Error(`Bắt buộc ít nhất một kiện hàng`));
        }
        for (let i = 0; i < newValues.length; i++) {
            const newValue = newValues[i];
            if (newValue) {
                if (!checkNumber(newValue.weightActual) || !checkNumber(newValue.width) || !checkNumber(newValue.length) || !checkNumber(newValue.height)) {
                    return Promise.reject(new Error(`Chưa nhập đủ thông tin`));
                }
            }
        }
        return Promise.resolve();
    };

    const onChangeItemPackage = (packages: any[]) => {
        if (!isTouchedWeight?.current) {
            const totalWeight = packages.reduce((total, next) => total + ((next.weightActual || 0)), 0);
            const totalDimWeight = packages.reduce((total, next) => total + ((Math.round(((next.height || 0) * (next.length || 0) * (next.width || 0)) / 6) || 0)), 0);
            // nếu chưa tự thay đổi weight
            console.log(totalDimWeight);

            props.form.setFieldsValue({
                weight: totalWeight,
                dimWeight: totalDimWeight
            });
            onReCalculatePriceWeight();
        }
    }

    const onChangeWeight = () => {
        isTouchedWeight.current = true;
        onReCalculatePriceWeight();
    }

    return (
        <Space direction='vertical' size={14} style={{ width: '100%' }}>
            <Card
                className="fadeInRight"
                title="Thông tin hàng hoá"
                bordered={false}
                size="small"
            >
                <>
                    <Row gutter={8}>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="saleOrderCode"
                                label="Mã đơn hàng"
                                labelCol={{ flex: '125px' }}
                            >
                                <Input maxLength={15} disabled={props.contentCaseTypeId === 4 || props.contentCaseTypeId === 5 || props.contentCaseTypeId === 6 || props.contentCaseTypeId === 7} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col className='config-height' span={24}>
                            <Form.Item
                                name="weight"
                                label="Tổng khối lượng"
                                rules={[{ required: props.required }]}
                                labelCol={{ flex: '125px' }}
                            >
                                <InputNumber style={{ width: '100%' }} min={0} max={1000000000} addonAfter="gram" onChange={onChangeWeight}
                                    {...formatInputNumber}
                                    disabled={props.showPackage}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col style={{ width: 125, paddingTop: 4 }}>
                            <span className='font-custome'>Kích thước (cm)</span>
                        </Col>
                        <Col className='config-height' style={{ width: `calc(100% - 125px)` }}>
                            <Row gutter={8}>
                                <Col span={4} >
                                    <Form.Item
                                        name="length"
                                    // rules={[{ required: props.required }]}
                                    >
                                        <InputNumber style={{ width: '100%' }} min={0} max={1000000000} placeholder='Dài' maxLength={50} onBlur={onReCalculatePriceWeight} disabled={props.showPackage}
                                            {...formatInputNumber}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item
                                        name="width"
                                    // rules={[{ required: props.required }]}
                                    >
                                        <InputNumber style={{ width: '100%' }} min={0} max={1000000000} placeholder='Rộng' maxLength={50} onBlur={onReCalculatePriceWeight} disabled={props.showPackage}
                                            {...formatInputNumber}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item
                                        name="height"
                                    // rules={[{ required: props.required }]}
                                    >
                                        <InputNumber style={{ width: '100%' }} min={0} max={1000000000} placeholder='Cao' maxLength={50} onBlur={onReCalculatePriceWeight} disabled={props.showPackage}
                                            {...formatInputNumber}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className='config-height' span={12}>
                                    <Form.Item
                                        labelCol={{ flex: '1px 125px' }}
                                        name="dimWeight"
                                        label="Quy đổi"
                                        initialValue={0}
                                        tooltip="Khối lượng quy đổi tạm tính từ kích thước hàng hóa"
                                    >
                                        <InputNumber style={{ width: '100%' }} min={0} max={1000000000} disabled addonAfter="gram"
                                            {...formatInputNumber}
                                        />
                                    </Form.Item>
                                </Col>
                                {/* <Col className='config-height' span={12}>
                                    <Form.Item
                                        labelCol={{ flex: '1px 125px' }}
                                        name="priceWeight"
                                        label="KL tính cước"
                                        initialValue={0}
                                    >
                                        <InputNumber style={{ width: '100%' }} min={0} max={1000000000} disabled addonAfter="gram"
                                            {...formatInputNumber}
                                        />
                                    </Form.Item>
                                </Col> */}
                            </Row>
                        </Col>
                    </Row>
                    {props.showPackage && <Row gutter={8}>
                        <Col span={24}>
                            <Form.Item
                                label="Thông tin kiện hàng"
                                tooltip='Nhập thông tin kích thước, khối lượng cho từng kiện hàng trong lô hàng của bạn'
                                labelCol={{ flex: '125px' }}
                            >
                                <Card
                                    className="fadeInRight"
                                    bordered={true}
                                    size="small"
                                    extra={<Space>
                                        <><Button className="btn-outline-primary"
                                            icon={expand ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
                                            onClick={() => setExpand(!expand)}
                                        />
                                        </>
                                    </Space>}
                                >
                                    <Form.Item
                                        name="orderPackages"
                                        rules={[{ validator: checkValidate }]}
                                    >
                                        <PackageTable
                                            contentTableCaseTypeId={props.contentCaseTypeId}
                                            form={props.form}
                                            expand={expand}
                                            openModalProduct={openModalProduct}
                                            setOpenModalProduct={setOpenModalProduct}
                                            onChangeItemPackage={onChangeItemPackage}
                                        />
                                    </Form.Item>
                                </Card>
                            </Form.Item>
                        </Col>
                    </Row>}
                </>
            </Card>
        </Space >
    );
};
type Props = {
    contentCaseTypeId?: number
    form: FormInstance<any>,
    required?: boolean,
    showPackage: boolean
}
PackageInfo.defaultProps = {
    required: true
}
export default PackageInfo;