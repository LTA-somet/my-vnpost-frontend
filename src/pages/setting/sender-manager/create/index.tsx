
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Drawer, notification, Popconfirm, Space, Spin, Table, Row, Col, Modal } from 'antd';
export default () => {

    return (
        <div>
            <PageContainer>
                <Spin spinning={false}>
                    <Card className="fadeInRight">
                        <Row >
                            <Col> Danh sách người nhận
                            </Col>
                        </Row>
                    </Card>
                </Spin>
            </PageContainer>
        </div>
    )
}