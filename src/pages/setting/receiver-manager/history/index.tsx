import { dataToSelectBox } from '@/utils';
import { Card, Col, Form, Input, Row, Select } from 'antd';

const History = (props: Props) => {
    return (
        <Card
            bordered={false}
        >
            <Row gutter={14}>
                {/* <Col span={12}>
                    <Form.Item
                        name="orgCode"
                        label="Đơn vị"
                    >
                        <Input maxLength={50} disabled={true} />
                    </Form.Item>
                </Col> */}
                <Col className='config-height' span={12}>
                    <Form.Item
                        name="createdByName"
                        label="Người tạo"
                    >
                        <Select
                            showSearch
                            disabled
                            showArrow={false}
                        >
                            {dataToSelectBox(props.accountDto, 'username', ['fullname', 'phoneNumber'])}
                        </Select>
                    </Form.Item>
                </Col>
                <Col className='config-height' span={12}>
                    <Form.Item
                        name="createdDate"
                        label="Ngày tạo"
                    >
                        <Input maxLength={50} disabled={true} />
                    </Form.Item>
                </Col>
                <Col className='config-height' span={12}>
                    <Form.Item
                        name="updatedByName"
                        label="Người cập nhật"
                    >
                        <Select
                            showSearch
                            disabled
                            showArrow={false}
                        >
                            {dataToSelectBox(props.accountDto, 'username', ['fullname', 'phoneNumber'])}
                        </Select>
                    </Form.Item>
                </Col>
                <Col className='config-height' span={12}>
                    <Form.Item
                        name="updatedDate"
                        label="Ngày cập nhật"
                    >
                        <Input maxLength={50} disabled={true} />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
};

type Props = {
    accountDto: any[],
}

export default History;