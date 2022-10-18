import { useCurrentUser } from '@/core/selectors';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Checkbox, Col, Form, Input, Row } from 'antd';
import { Link } from 'umi';

const TemplateInfo = () => {
    const currentUser = useCurrentUser();
    return (
        <Card
            className="fadeInRight"
            title="Thông tin cấu hình"
            bordered={false}
            size="small"
        >
            <Row gutter={14} >
                <Col className='config-height' span={24} >
                    <Form.Item
                        name="orderContent"
                        label="Tên cấu hình"
                        rules={[{ required: true }]}
                    >
                        <Input maxLength={100} />
                    </Form.Item>
                </Col>
                <Col className='config-height1' span={24}>
                    <Form.Item
                        name="orderNote"
                        label="Ghi chú"
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Col>
                <Col className='config-height' span={24}>
                    <Form.Item
                        name="default"
                        label=" "
                        valuePropName='checked'
                    >
                        <Checkbox
                        // disabled={currentUser.uid !== currentUser.owner}
                        > Mặc định
                        </Checkbox>
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
};
export default TemplateInfo;