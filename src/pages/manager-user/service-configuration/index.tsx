import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Input, Row, Select, Space, Spin, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import defineColumns from './columns';
import type { McasServiceDto, McasServiceGroupDto, McasServiceGroupEntity, MyvnpServiceGroupEntity } from '@/services/client';
import { useModel } from 'umi';
import EditServiceConfiguration from './edit';
import { dataToSelectBox } from '@/utils';
import { useMyvnpServiceGroupList } from '@/core/selectors';
const { Option } = Select;

export default () => {
    const { isLoading, isSaving, mcasServiceDto, getAllMcasService, searchByParamService, updateRecord } = useModel('mcasServiceList');
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<McasServiceDto>();
    const [searchValue, setSearchValue] = useState<string>();
    const [dataTable, setDataTable] = useState<McasServiceDto[]>([]);
    const [serviceListFilter, setServiceListFilter] = useState<McasServiceDto[]>([]);
    const [serviceGroupFilter, setServiceGroupFilter] = useState<MyvnpServiceGroupEntity[]>([]);
    const [isView] = useState<boolean>(false);
    const [form] = Form.useForm();
    const serviceGroupList = useMyvnpServiceGroupList();

    const reload = () => {
        getAllMcasService();
        form.resetFields();
    }

    useEffect(() => {
        getAllMcasService();
        setServiceGroupFilter(serviceGroupList.filter(e => e.scope == "1"));
    }, [])

    useEffect(() => {
        // console.log("mcasServiceDto", mcasServiceDto);

        if (!searchValue) {
            setDataTable(mcasServiceDto);
        } else {
            setDataTable(mcasServiceDto.filter(d => d.mailServiceName?.includes(searchValue)))
        }
    }, [mcasServiceDto])

    const onFilter = (parameter: McasServiceDto) => {
        parameter.mailServiceId = parameter.mailServiceId ?? '';
        parameter.myvnpServiceGroupId = parameter.myvnpServiceGroupId ?? '';
        searchByParamService(parameter);
    }

    const toggleShowEdit = () => {
        setShowEdit(!showEdit); //true
    }
    const handleEdit = (record: McasServiceDto) => {
        toggleShowEdit();
        setRecordEdit(record);
    }
    const onEdit = (values: McasServiceDto) => {
        // console.log("values", values);

        recordEdit!.mailServiceId = recordEdit!.mailServiceId.split(" - " + recordEdit?.mailServiceName, 1).toString();
        if (recordEdit) {
            updateRecord(recordEdit.mailServiceId, values, () => toggleShowEdit());
        }
    }

    const onChangeServiceGroup = (event: any) => {
        setServiceListFilter(mcasServiceDto.filter(e => e.myvnpServiceGroupId === event));
    }

    const onChangeScope = (event: any) => {
        setServiceGroupFilter(serviceGroupList.filter(e => e.scope == event));
    }

    const action = (id: number, record: McasServiceDto): React.ReactNode => {
        return <Space key={id}>
            <Button className="btn-outline-info" size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
        </Space>
    }

    const columns: any[] = defineColumns(action);
    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Card className="fadeInRight">
                        <Form form={form} name="form-search-service-configuration" onFinish={onFilter}>
                            <Row gutter={12}>
                                <Col span={6}>
                                    <Form.Item
                                        label="Phạm vi"
                                        name="scope"
                                        initialValue={"1"}
                                    >
                                        <Select
                                            allowClear
                                            onChange={onChangeScope}
                                        >
                                            <Option value="1">Trong nước</Option>
                                            <Option value="2">Quốc tế</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="Nhóm dịch vụ MYVNP" name="myvnpServiceGroupId" >
                                        <Select
                                            allowClear
                                            onChange={onChangeServiceGroup}
                                        >
                                            {serviceGroupFilter.map(item => (
                                                <Option key={item.serviceGroupId}>{item.serviceGroupId} - {item.serviceGroupName}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="Sản phẩm dịch vụ" name="mailServiceId" >
                                        <Select
                                            allowClear
                                        // onChange={onChangeChannel}
                                        >
                                            {serviceListFilter.length && serviceListFilter.map(item => (
                                                <Option key={item.mailServiceId}>{item.mailServiceId} - {item.mailServiceName}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Space className="button-group" style={{ textAlign: 'end', width: '100%' }}>
                                        <Button icon={<SearchOutlined />} className="custom-btn1 btn-outline-info" htmlType='submit'>Tra cứu</Button>
                                        <Button onClick={reload} icon={<ReloadOutlined />} />
                                    </Space>
                                </Col>
                            </Row>
                        </Form>

                        <Table
                            loading={loading}
                            size='small'
                            dataSource={dataTable}
                            columns={columns}
                            bordered
                            pagination={{ showSizeChanger: true }}
                        />
                    </Card>
                </Spin>
            </PageContainer>
            <EditServiceConfiguration
                visible={showEdit}
                setVisible={setShowEdit}
                onEdit={onEdit}
                record={recordEdit}
                isSaving={isSaving}
                isView={isView}
            />
        </div >
    );
};