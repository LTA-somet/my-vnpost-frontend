import { EditOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Input, Row, Select, Space, Spin, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import defineColumns from './columns';
import type { McasVaServiceDto, McasVaServiceSearchDto, } from '@/services/client';
import { useModel } from 'umi';
import EditVasConfiguration from './edit';
import DetailVasConfiguration from './detail';
const { Option } = Select;

const vaServiceGroupList = [
    { id: '0', name: 'Dịch vụ cộng thêm' },
    { id: '1', name: 'Yêu cầu bổ sung' }
];

export default () => {
    const { isLoading, isSaving, mcasVaServiceDto, listGtgt, getAllMcasVasService, searchByParamVasService, updateRecord, updateIsDisplay, insertItem } = useModel('mcasVaServiceList');
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<McasVaServiceDto>();
    const [searchValue, setSearchValue] = useState<string>();
    const [dataTable, setDataTable] = useState<McasVaServiceDto[]>([]);
    const [vaServiceListFilter, setVaServiceListFilter] = useState<McasVaServiceDto[]>([]);
    const [vaServiceGroupFilter, setVaServiceGroupFilter] = useState<McasVaServiceDto[]>([]);
    const [isView] = useState<boolean>(false);
    const [form] = Form.useForm();
    // const serviceGroupList = useMyvnpServiceGroupList();

    const reload = () => {
        getAllMcasVasService();
        form.resetFields();
    }

    useEffect(() => {
        getAllMcasVasService();
        // setVaServiceGroupFilter(McasVaServiceDto.filter(e => e.display === true));
    }, [])

    useEffect(() => {
        // console.log("McasVaServiceDto", McasVaServiceDto);

        if (!searchValue) {
            setDataTable(mcasVaServiceDto);
        } else {
            setDataTable(mcasVaServiceDto.filter(d => d.vaServiceName?.includes(searchValue)))
        }
    }, [mcasVaServiceDto])

    const onFilter = (parameter: McasVaServiceSearchDto) => {
        console.log("parameter", parameter);

        parameter.vaServiceId = parameter.vaServiceId ?? '';
        parameter.vasGroup = parameter.vasGroup ?? [];
        searchByParamVasService(parameter);
    }

    const toggleShowEdit = () => {
        setShowEdit(!showEdit); //true

    }
    const handleEdit = (record: McasVaServiceDto) => {
        toggleShowEdit();
        setRecordEdit(record);
    }
    const handleDetail = (record: McasVaServiceDto) => {
        setShowDetail(!showDetail);
        setRecordEdit(record);
    }
    const onEdit = (values: McasVaServiceDto) => {
        console.log("values", values);

        recordEdit!.vaServiceId = recordEdit!.vaServiceId.split(" - " + recordEdit?.vaServiceName, 1).toString();
        if (recordEdit) {
            updateRecord(recordEdit.vaServiceId, values, () => toggleShowEdit());
        }
    }

    // const handleChange = (value: string[]) => {
    //     console.log(`selected ${value}`);
    //   };

    const onChangeVaServiceGroupList = (event: string[]) => {
        form.setFieldsValue({ vaServiceId: '' })
        if (`${event}` === '0') {
            setVaServiceListFilter(listGtgt.filter(e => e.extend === false));
        } else if (`${event}` === '1') {
            setVaServiceListFilter(listGtgt.filter(e => e.extend === true));
        } else if (event.length === 2) {
            setVaServiceListFilter(listGtgt);
        } else if (event.length === 0) {
            setVaServiceListFilter([]);

        }
    }
    // console.log("vaServiceListFilter", vaServiceListFilter);

    const onChangeIsDefault = (record: McasVaServiceDto, checked: boolean) => {
        console.log("record", record);
        if (record) {
            updateIsDisplay(record.vaServiceId, checked);
        }
    }

    const action = (id: number, record: McasVaServiceDto): React.ReactNode => {
        return <Space key={id}>
            {/* {
                record.display ? <Button className="btn-outline-secondary" size="small" onClick={() => handleDetail(record)}><EyeOutlined /></Button> :
                    <Button className="btn-outline-info" size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
            } */}
            <Button className="btn-outline-secondary" size="small" onClick={() => handleDetail(record)}><EyeOutlined /></Button>
        </Space>
    }
    const columns: any[] = defineColumns(action, onChangeIsDefault);
    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Card className="fadeInRight">
                        <Form form={form} name="form-search-vas-configuration" onFinish={onFilter}>
                            <Row gutter={12}>
                                <Col span={9}>
                                    <Form.Item label="Nhóm giá trị gia tăng" name="vasGroup" >
                                        <Select
                                            allowClear
                                            mode="multiple"
                                            onChange={onChangeVaServiceGroupList}
                                        >
                                            {vaServiceGroupList.map(item => (
                                                <Option key={item.id}>{item.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="Dịch vụ GTGT" name="vaServiceId" >
                                        <Select
                                            allowClear
                                        // onChange={onChangeChannel}
                                        >
                                            {vaServiceListFilter.length && vaServiceListFilter.map(item => (
                                                <Option key={item.vaServiceId}>{item.vaServiceId} - {item.vaServiceName}</Option>
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
            {/* <EditVasConfiguration
                visible={showEdit}
                setVisible={setShowEdit}
                onEdit={onEdit}
                record={recordEdit}
                isSaving={isSaving}
                isView={isView}
            /> */}
            <DetailVasConfiguration
                visible={showDetail}
                setVisible={setShowDetail}
                onEdit={onEdit}
                record={recordEdit}
                isSaving={isSaving}
                isView={isView}
            />
        </div >
    );
};