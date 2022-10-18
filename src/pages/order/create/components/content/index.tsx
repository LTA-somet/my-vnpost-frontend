import CustomUpload from '@/components/CustomUpload';
import { OrderContentDto, VaDto } from '@/services/client';
import { Card, Checkbox, Col, Form, FormInstance, Input, InputNumber, Row, Space } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import { formatInputNumber, regexCode } from '@/core/contains';
import { useModel } from 'umi';
import { calculateDimWeight, calculatePriceWeight } from '@/utils/orderHelper';
import ContentInfo from './content-info';

const Content: React.FC<Props> = (props: Props) => {
    const isTouchedWeight = useRef<boolean>(false);
    const { serviceListAppend, caseTypeId, checkDisabledEdit } = useModel('orderModel');

    const weight = Form.useWatch('weight', props.form);
    const serviceCode = Form.useWatch('serviceCode', props.form);
    const vas: VaDto[] = Form.useWatch('vas', props.form);

    // là spdv tài liệu
    const isServiceDocument: boolean = useMemo(() => {
        const service = serviceListAppend.find(s => s.mailServiceId === serviceCode);
        return service?.type === 'TL';
    }, [serviceCode]);

    const isHasPhatMotPhan = useMemo((): boolean => {
        const vasActual = props.vas ? props.vas : vas;
        return vasActual?.some(va => va.vaCode === 'GTG068')
    }, [vas, props.vas]);

    useEffect(() => {
        // nếu reset form thì set isTouchedWeight = false
        if (!weight) {
            isTouchedWeight.current = false;
        }
    }, [weight])

    const onReCalculatePriceWeight = () => {
        const newWeight: number = props.form.getFieldValue('weight') || 0;
        const height: number = props.form.getFieldValue('height') || 0;
        const width: number = props.form.getFieldValue('width') || 0;
        const length: number = props.form.getFieldValue('length') || 0;


        const dimWeight = calculateDimWeight(height, width, length);
        const priceWeight = calculatePriceWeight(newWeight, dimWeight);
        props.form.setFieldsValue({
            'dimWeight': dimWeight,
            'priceWeight': priceWeight
        });
    }

    const onChangeWeight = () => {
        isTouchedWeight.current = true;
        onReCalculatePriceWeight();
    }

    const onChangeItemContent = (contents: OrderContentDto[]) => {
        if (!isTouchedWeight?.current) {
            const totalWeight = contents.reduce((total, next) => total + ((next.quantity || 0) * (next.weight || 0)), 0);
            // nếu chưa tự thay đổi weight
            props.form.setFieldsValue({
                weight: totalWeight
            });
            onReCalculatePriceWeight?.();
        }
    }

    const disabledEdit = useMemo(() => checkDisabledEdit([4, 5, 6, 7]), [caseTypeId]);

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
                                rules={[{ pattern: regexCode }, { max: 50 }]}
                            >
                                <Input maxLength={50} disabled={disabledEdit} />
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
                                    disabled={disabledEdit}
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
                                    >
                                        <InputNumber style={{ width: '100%' }} min={0} max={1000000000} placeholder='Dài' maxLength={50} onBlur={onReCalculatePriceWeight} disabled={disabledEdit}
                                            {...formatInputNumber}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item
                                        name="width"
                                    >
                                        <InputNumber style={{ width: '100%' }} min={0} max={1000000000} placeholder='Rộng' maxLength={50} onBlur={onReCalculatePriceWeight} disabled={disabledEdit}
                                            {...formatInputNumber}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item
                                        name="height"
                                    >
                                        <InputNumber style={{ width: '100%' }} min={0} max={1000000000} placeholder='Cao' maxLength={50} onBlur={onReCalculatePriceWeight} disabled={disabledEdit}
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
                                <Col className='config-height' span={12}>
                                    <Form.Item
                                        labelCol={{ flex: '1px 125px' }}
                                        name="priceWeight"
                                        label="KL tính cước"
                                        initialValue={0}
                                        hidden
                                    >
                                        <InputNumber style={{ width: '100%' }} min={0} max={1000000000} disabled addonAfter="gram"
                                            {...formatInputNumber}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>

                    </Row>
                    <Row gutter={8} style={{ paddingBottom: '10px' }}>
                        <Col className='config-height1' span={24}>
                            <Form.Item
                                labelCol={{ flex: '125px' }}
                                name="contentNote"
                                label="Nội dung"
                                rules={[{ required: props.required && (isServiceDocument || !isHasPhatMotPhan) }]}
                            >
                                <Input.TextArea maxLength={500} disabled={disabledEdit} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={18}>
                            <Form.Item
                                name="orderImages"
                                // label="Đính kèm hình ảnh"
                                label="Ảnh đính kèm"
                                labelCol={{ flex: '125px' }}
                            >
                                <CustomUpload uploadCaseTypeId={caseTypeId} maxImage={5} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ flex: '125px' }}
                                name="isBroken"
                                label="Hàng dễ vỡ"
                                valuePropName="checked"
                            >
                                <Checkbox disabled={disabledEdit} />
                            </Form.Item>
                        </Col>
                    </Row>
                </>
            </Card>
            <ContentInfo
                {...props}
                isServiceDocument={isServiceDocument}
                isHasPhatMotPhan={isHasPhatMotPhan}
                onChangeItemContent={onChangeItemContent}
            />
        </Space>
    );
};
type Props = {
    form: FormInstance<any>,
    required?: boolean,
    vas?: VaDto[]
}
Content.defaultProps = {
    required: true
}
export default Content;