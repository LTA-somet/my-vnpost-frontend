import { useCurrencyList } from "@/core/selectors"
import type { ProductEntity } from "@/services/client"
import { dataToSelectBox, removeAccents } from "@/utils"
import { ShrinkOutlined, ArrowsAltOutlined } from "@ant-design/icons"
import { Row, Col, Form, Card, Select, Button } from "antd"
import type { FormInstance } from "antd/lib/form"
import TextArea from "antd/lib/input/TextArea"
import { useState } from "react"
import ContentTable from "./content-table"

const ContentInfo: React.FC<Props> = (props: Props) => {
    const [expand, setExpand] = useState<boolean>(false);
    const currencyList = useCurrencyList();
    const postType = Form.useWatch('postType', props.form);
    const [openModalProduct, setOpenModalProduct] = useState<boolean>(false);
    const [productList, setProductList] = useState<ProductEntity[]>([]);

    const checkNumber = (value: any): boolean => {
        if (isNaN(value)) return false;
        const n: number = +value;
        return n > 0;
    }

    const checkValidateContent = (_: any, newValues: any[] = []) => {
        if (newValues.length === 0) {
            return Promise.reject(new Error(`Bắt buộc ít nhất một hàng hoá`));
        }
        for (let i = 0; i < newValues.length; i++) {
            const newValue = newValues[i];
            if (newValue) {
                if (!newValue.nameEn || !newValue.nameVi || !checkNumber(newValue.quantity) || !checkNumber(newValue.netWeight) || !checkNumber(newValue.priceVnd) || !checkNumber(newValue.weight)) {
                    return Promise.reject(new Error(`Chưa nhập đủ thông tin`));
                }
            }
        }
        return Promise.resolve();
    };
    const onChangeItemContent = (contents: OrderContentDto[]) => {
        // if (!isTouchedWeight?.current) {
        //     const totalWeight = contents.reduce((total, next) => total + ((next.quantity || 0) * (next.weight || 0)), 0);
        //     // nếu chưa tự thay đổi weight
        //     props.form.setFieldsValue({
        //         weight: totalWeight
        //     });
        //     onReCalculatePriceWeight();
        // }
    }
    return (
        <Row gutter={8}>
            <Col span={24}>
                <Form.Item
                    label="Nội dung bưu gửi"
                    tooltip='Mô tả chi tiết từng mặt hàng trong lô hàng của bạn. Nội dung hàng hóa phải tuân thủ quy định cấm gửi của UPU, danh mục hàng hóa được vận chuyển, danh mục các vật phẩm hàng hóa được xuất khẩu và xuất khẩu có điều kiện của Nhà nước, danh mục các vật phẩm hàng hóa được nhập khẩu và nhập khẩu có điều kiện của nước nhận.'
                    labelCol={{ flex: '125px' }}
                >
                    <Card
                        title={
                            <>
                                <Row justify='space-between'>
                                    <Col span={22}>
                                        <Form.Item
                                            label='Đơn vị tiền tệ'
                                            labelCol={{ flex: '200px' }}
                                            name='currency'
                                        >
                                            <Select style={{ width: '30%' }}>
                                                {dataToSelectBox(currencyList, 'value', 'name')}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={1.5}>
                                        <Button className="btn-outline-primary"
                                            icon={expand ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
                                            onClick={() => setExpand(!expand)}
                                        />
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label='Mô tả chung (tiếng Anh)'
                                            labelCol={{ flex: '200px' }}
                                            name='description'
                                            rules={[{ required: postType === 'HH' }]}
                                            getValueFromEvent={e => removeAccents(e.target.value)}
                                        >
                                            <TextArea />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </>
                        }
                        className="fadeInRight"
                        bordered={true}
                        size="small"
                    >
                        <Row gutter={8}>
                            <Col span={24}>
                                <Form.Item
                                    name="orderContents"
                                    rules={[{ validator: checkValidateContent }]}

                                >
                                    <ContentTable
                                        // contentTableCaseTypeId={props.contentCaseTypeId}
                                        form={props.form}
                                        expand={expand}
                                        openModalProduct={openModalProduct}
                                        setOpenModalProduct={setOpenModalProduct}
                                        productList={productList}
                                        onChangeItemContent={onChangeItemContent}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Form.Item>
            </Col>
        </Row>
    )
};
type Props = {
    contentCaseTypeId?: number
    form: FormInstance<any>,
    required?: boolean
}
ContentInfo.defaultProps = {
    required: true
}
export default ContentInfo;