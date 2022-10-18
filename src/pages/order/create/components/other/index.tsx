import { useCTG, usePostTypeList, useYCKPH } from '@/core/selectors';
import { OrderHdrDto, VaDto } from '@/services/client';
import { dataToSelectBox } from '@/utils';
import { checkValidateVaService } from '@/utils/orderHelper';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Card, Checkbox, Col, DatePicker, Form, FormInstance, Input, Radio, Row, Select, Spin, Tooltip } from 'antd';
import { range } from 'lodash';
import moment, { Moment } from 'moment';
import { useMemo } from 'react';
import { useModel } from 'umi';
import VasService from '../service/vas';

const Other: React.FC<Props> = (props: Props) => {
    const { vasList, isLoadingVas } = useModel('vasList');
    const { caseTypeId, checkDisabledEdit } = useModel('orderModel');
    const yckphList = useYCKPH();
    const ctgList = useCTG();
    const postTypeList = usePostTypeList();

    const checkValidate = (_: any, newValues: VaDto[] = []) => {
        return checkValidateVaService(newValues, vasList, true);
    };

    // Chọn giờ thu gom => tự động điền ca thu gom
    // chọn từ 8–11h => ca sáng
    // chọn từ 13–17h => ca chiều
    // chọn 12h => cả ngày
    const onChangeCollectionDate = (date: Moment) => {
        if (date) {
            const hours = +date.format('HH');

            let shiftCodeCollect = '';
            if (hours <= 11) {
                shiftCodeCollect = 'S';
            } else if (hours >= 13) {
                shiftCodeCollect = 'C';
            } else {
                shiftCodeCollect = 'N';
            }

            props.form.setFieldsValue({ shiftCodeCollect })
        }
    }

    const disabledEdit = useMemo(() => checkDisabledEdit([2, 4, 5, 6, 7]), [caseTypeId]);
    const disabledEdit2 = useMemo(() => checkDisabledEdit([4, 5, 6, 7]), [caseTypeId]);

    return (
        <Card
            className="fadeInRight"
            title="Yêu cầu thêm"
            bordered={false}
            size="small"
        >
            <Row gutter={8}>
                <Col span={24}>
                    <Spin spinning={isLoadingVas}>
                        <Form.Item
                            name="vas"
                            label=""
                            rules={[{ validator: checkValidate }]}
                        // noStyle
                        >
                            <VasService vasCaseTypeId={caseTypeId} vasList={vasList} extend form={props.form} />
                        </Form.Item>
                    </Spin>
                </Col>
            </Row>
            {/* nếu khi tạo hiệu chỉnh và nguồn khác myvnp thì k hiện 2 trường này */}
            {!(props.correctingOrder && props.correctingOrder?.source !== 'MYVNP') && <>
                <Row gutter={8}>
                    <Col span={24}>
                        <Form.Item name="sendType" label="Hình thức gửi hàng" rules={[{ required: props.required }]} labelCol={{ flex: '155px' }} initialValue={'1'}>
                            <Radio.Group disabled={disabledEdit}>
                                {postTypeList.map(item => <Radio className='span-font' key={item.id} value={item.value}>{item.name}</Radio>)}
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col className='config-height' span={24}>
                        <Form.Item
                            name="deliveryRequire"
                            label="Yêu cầu khi phát hàng"
                            // label={<span >Yêu cầu khi<p>phát hàng</p></span>}
                            labelCol={{ flex: '125px' }}
                            initialValue={"1"}
                            rules={[{ required: props.required }]}
                        >
                            <Select disabled={disabledEdit}>
                                {dataToSelectBox(yckphList, 'value', 'name')}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </>}
            <Row gutter={8}>
                <Col className='config-height' span={24}>
                    <Form.Item
                        name="deliveryTime"
                        label="Thời gian phát hàng mong muốn"
                        labelCol={{ flex: '125px' }}
                        initialValue={'N'}
                    >
                        <Select disabled={disabledEdit2}>
                            {dataToSelectBox(ctgList, 'value', 'name')}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={8}>
                <Col className='config-height' span={24}>
                    <Form.Item
                        name="deliveryInstruction"
                        label="Yêu cầu khác"
                        rules={[{ max: 255 }]}
                        labelCol={{ flex: '125px' }}
                    >
                        <Input.TextArea disabled={disabledEdit2} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={8}>
                <Col span={24}>
                    <Form.Item
                        name="keepOrderInfo"
                        label=""
                        tooltip="Lưu thông tin hàng hóa và Yêu cầu thêm"
                        valuePropName='checked'
                        labelCol={{ flex: '1px 0 125px' }}
                    >
                        <br />
                        <Checkbox disabled={disabledEdit2}>
                            <span className='span-font'>Lưu thông tin đơn hàng</span>
                            <Tooltip
                                title={`Lưu thông tin hàng hóa và Yêu cầu thêm`}
                            >
                                {' '}
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </Checkbox>
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
};
type Props = {
    form: FormInstance<any>,
    required?: boolean,
    correctingOrder?: OrderHdrDto
}
Other.defaultProps = {
    required: true
}
export default Other;