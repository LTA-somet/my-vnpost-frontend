import { ShrinkOutlined, ArrowsAltOutlined } from "@ant-design/icons"
import { Row, Col, Form, Card, Button, Space } from "antd"
import type { FormInstance } from "antd/lib/form"
import { useState } from "react"
import DocumentTable from "./document-table"

const DocumentInfo: React.FC<Props> = (props: Props) => {
    const [expand, setExpand] = useState<boolean>(false);
    return (
        <Row gutter={8}>
            <Col span={24}>
                <Form.Item
                    label="Giấy tờ đi kèm"
                    tooltip=''
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
                            name="orderDocuments"
                        // rules={[{ validator: checkValidate }]}
                        >
                            <DocumentTable
                                // contentTableCaseTypeId={props.contentCaseTypeId}
                                form={props.form}
                                expand={expand}
                            />
                        </Form.Item>
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
DocumentInfo.defaultProps = {
    required: true
}
export default DocumentInfo;