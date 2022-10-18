import { useEoriNational, useIossNational, useVatNational } from "@/core/selectors";
import type { McasNationalDto } from "@/services/client";
import { dataToSelectBox, removeAccents } from "@/utils";
import { Row, Col, Form, Select, Input } from "antd";

const { Option } = Select;
const InfoModal: React.FC<Props> = (props: Props) => {
    const vatNational = useVatNational();
    const eoriNational = useEoriNational();
    const iossNational = useIossNational();
    return (
        <Row gutter={14}>
            {/* <Col span={12}>
                    <Form.Item
                        name="orgCode"
                        label="Đơn vị"
                    >
                        <Input maxLength={50} disabled={true} />
                    </Form.Item>
                </Col> */}
            <Col className='config-height' span={24}>
                <Form.Item
                    label="Thông tin VAT"
                >
                    <Input.Group>
                        <Row justify="space-evenly" gutter={14}>
                            <Col span={8}>
                                <Form.Item
                                    name='vatNum'
                                >
                                    <Input placeholder="Số" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name='vatType'
                                >
                                    <Select placeholder="Kiểu đăng ký" >
                                        {dataToSelectBox(vatNational, 'value', 'name')}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name='vatNational'
                                >
                                    <Select showSearch filterOption={props.filterOption} placeholder='Quốc gia'>
                                        {props.nation.map((element: McasNationalDto) => {
                                            return (
                                                <Option value={element.code} >{`${element.name} (${element.code})`}</Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Input.Group>
                </Form.Item>
            </Col>
            <Col className='config-height' span={24}>
                <Form.Item
                    label="Thông tin EORI"
                >
                    <Input.Group>
                        <Row justify="space-evenly" gutter={14}>
                            <Col span={8}>
                                <Form.Item
                                    name='eoriNum'
                                    getValueFromEvent={e => removeAccents(e.target.value)}
                                >
                                    <Input placeholder="Số" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name='eoriType'
                                >
                                    <Select placeholder="Kiểu đăng ký">
                                        {dataToSelectBox(eoriNational, 'value', 'name')}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name='eoriNational'
                                >
                                    <Select showSearch filterOption={props.filterOption} placeholder='Quốc gia'>
                                        {props.nation.map((element: McasNationalDto) => {
                                            return (
                                                <Option value={element.code} >{`${element.name} (${element.code})`}</Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Input.Group>
                </Form.Item>
            </Col>
            <Col className='config-height' span={24}>
                <Form.Item
                    label="Thông tin IOSS"
                >
                    <Input.Group>
                        <Row justify="space-evenly" gutter={14}>
                            <Col span={8}>
                                <Form.Item
                                    name='iossNum'
                                >
                                    <Input placeholder="Số" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name='iossType'
                                >
                                    <Select placeholder="Kiểu đăng ký">
                                        {dataToSelectBox(iossNational, 'value', 'name')}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name='iossNational'
                                >
                                    <Select showSearch filterOption={props.filterOption} placeholder='Quốc gia'>
                                        {props.nation.map((element: McasNationalDto) => {
                                            return (
                                                <Option value={element.code} >{`${element.name} (${element.code})`}</Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Input.Group>
                </Form.Item>
            </Col>
        </Row>
    );
};
type Props = {
    nation: McasNationalDto[],
    filterOption: (value: any, option: any) => boolean,
}

export default InfoModal;