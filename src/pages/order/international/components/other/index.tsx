import { usePostTypeList } from '@/core/selectors';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Card, Checkbox, Col, Form, Radio, Row, Tooltip } from 'antd';

const Other: React.FC<Props> = (props: Props) => {
    const postTypeList = usePostTypeList();

    return (
        <Card
            className="fadeInRight"
            title="Yêu cầu thêm"
            bordered={false}
            size="small"
        >
            <Row gutter={8}>
                <Col span={24}>
                    <Form.Item name="sendType" label="Hình thức gửi hàng" rules={[{ required: props.required }]} labelCol={{ span: 24 }} initialValue={'1'}>
                        <Radio.Group>
                            {postTypeList.map(item => <Radio className='span-font' key={item.id} value={item.value}>{item.name}</Radio>)}
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
};
type Props = {
    otherCaseTypeId?: number,
    form: FormInstance<any>,
    required?: boolean
}
Other.defaultProps = {
    required: true
}
export default Other;