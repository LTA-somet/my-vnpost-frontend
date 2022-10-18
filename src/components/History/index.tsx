import { Card, Col, Form, Input, Row } from 'antd';

const History = () => {
    return (
        <Card
            bordered={false}
            size="small"
            className="fadeInRight"
            title="Thông tin lịch sử"
        >
            <Row gutter={14}>
                {/* <Col span={12}>
                    <Form.Item
                        name="orgName"
                        label="Đơn vị"
                    >
                        <Input maxLength={50} disabled={true} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="ownerName"
                        label="Tài khoản quản lý"
                    >
                        <Input maxLength={50} disabled={true} />
                    </Form.Item>
                </Col> */}
                <Col className='config-height' span={12}>
                    <Form.Item
                        name="createdByName"
                        label="Người tạo"
                    >
                        <Input maxLength={50} disabled={true} />
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
                        <Input maxLength={50} disabled={true} />
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