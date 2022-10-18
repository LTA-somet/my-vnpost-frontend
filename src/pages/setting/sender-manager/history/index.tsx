import { Card, Col, Form, Input, Row } from 'antd';

const History = () => {
    return (
        // <Card
        //     bordered={false}
        // // size='small'
        // >
        <Row gutter={14}>
            {/* <Col span={24}>
                    <Form.Item
                        name="orgCode"
                        label="Đơn vị"
                        style={{ width: 300 }}
                    >
                        <Input maxLength={50} disabled={true} />
                    </Form.Item>
                </Col> */}
            <Col span={12}>
                <Form.Item
                    name="createdByName"
                    label="Người tạo"
                >
                    <Input disabled={true} />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name="createdDate"
                    label="Ngày tạo"
                >
                    <Input disabled={true} />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name="updatedByName"
                    label="Người cập nhật"
                >
                    <Input disabled={true} />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name="updatedDate"
                    label="Ngày cập nhật"
                >
                    <Input maxLength={50} disabled={true} />
                </Form.Item>
            </Col>
        </Row>
        // </Card>
    );
};

export default History;