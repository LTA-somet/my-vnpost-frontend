import { PageContainer } from "@ant-design/pro-layout";
import { useModel } from "@/.umi/plugin-model/useModel";
import { Spin, Card, Row, Col, Button, Table } from "antd";
import { Select } from 'antd';
import { useEffect, useState } from "react";
import { SearchOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { ColumnsPortalNumber } from './columns';

export default () => {
    const {
        postalNumberCal,
        categoryServiceGroup,
        isLoading,
        getCategoryServiceGroup,
        getPostalNumberCal,
        savePostalNumber
    } = useModel('postalNumberList');

    const [serviceGroup, setServiceGroup] = useState("");

    useEffect(() => {
        getCategoryServiceGroup("SERVICE_GROUP");
    }, []);

    const onSearchByParam = () => {
        getPostalNumberCal(serviceGroup);
    }

    const onGetPostalNumber = () => {
        savePostalNumber(null, null);
    }
    return (
        <PageContainer>
            <Spin spinning={isLoading}>
                <Card>
                    <Row>
                        <Col span={3}> Nhóm dịch vụ <span style={{ color: 'red' }}>*</span></Col>
                        <Col span={4}>
                            <Select
                                value={serviceGroup}
                                onChange={(value) => setServiceGroup(value)}
                                allowClear
                                placeholder="Chọn nhóm dịch vụ"
                                style={{ width: '95%' }}
                            >
                                <Select.Option key='ALL' value="">
                                    Tất cả
                                </Select.Option>
                                {categoryServiceGroup?.map((row: any) => (
                                    <Select.Option key={row?.value} value={row?.value}>
                                        {row?.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col flex="auto">
                            <Button className="custom-btn1  btn-outline-info" icon={<SearchOutlined />} style={{ width: 120 }} type="primary" onClick={() => onSearchByParam()}>Tìm kiếm</Button>
                            <Button className="custom-btn1 btn-outline-info" icon={<VerticalAlignBottomOutlined />} style={{ width: 120, marginLeft: '10px' }} type="primary" onClick={() => onGetPostalNumber()}>Lấy số</Button>
                        </Col>
                    </Row>

                </Card>
                <Card className="fadeInRight">
                    <Table
                        bordered
                        size="small"
                        dataSource={postalNumberCal}
                        columns={ColumnsPortalNumber}
                        rowKey="serviceGroup"

                    />
                </Card>
            </Spin>
        </PageContainer>
    )
}