import { LibraryInfoDto, LibrarySearchDto } from "@/services/client";
import { LibraryInfoApi } from '@/services/client';
import { dataToSelectBox } from "@/utils";
import { Button, Card, Col, Drawer, Form, Input, Row, Select, Space, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import defineColumns from "./columns"
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useModel } from 'umi';
import EditFormLibrary from "./edit";
import EditFormLibraryInfo from "./editInfo";
import form, { FormInstance } from "antd/lib/form";
import React from "react";
import Popconfirm from "antd/es/popconfirm";
import { PageContainer } from "@ant-design/pro-layout";



export default () => {
    const libraryInfoApi = new LibraryInfoApi();
    const { Option } = Select;
    const { dataSource, dataSourceType, reload, loading, isSaving, loadType, importLibrary, updateLibrary, deleteRecord, setDataSource } = useModel('libraryssList');
    //const [dataTable, setDataTable] = useState<LibraryInfoDto[]>([]);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [showEditInfo, setShowEditInfo] = useState<boolean>(false);
    //const [searchValue, setSearchValue] = useState<string>();
    const [recordEdit, setRecordEdit] = useState<LibraryInfoDto>();
    const [recordEditTypeList, setRecordEditTypeList] = useState<LibraryInfoDto[]>([]);
    const [isView] = useState<boolean>(false);
    const [libraryTypeValue, setLibraryTypeValue] = useState(Number);
    //const [findLibraryInfo, setFindLibraryInfo] = useState<LibraryInfoDto[]>([]);
    // const [file, setFile] = useState<any>();
    // const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        reload();
        loadType();
    }, [])

    const toggleShowEdit = () => {
        setShowEdit(!showEdit);
    }

    const handleCreate = () => {
        setRecordEdit(undefined);
        toggleShowEdit();
    }

    const toggleShowEditInfo = () => {
        setShowEditInfo(!showEditInfo);
    }

    const handleCreateInfo = (typeList: any) => {
        setRecordEditTypeList(typeList);

        toggleShowEditInfo();
    }

    const onEdit = () => {

    }
    const handleEdit = (record: LibraryInfoDto) => {
        toggleShowEdit();
        setRecordEdit(record);
    }

    const onDelete = (libraryInfoId: number) => {
        deleteRecord(libraryInfoId);
    }

    const selectTypeLibrary = (type: any) => {
        const tempList = dataSource.filter(c => c.libraryTypeId == type)
        setLibraryTypeValue(type);
        handleCreateInfo(tempList);
    }

    const onFinish = (param: LibrarySearchDto) => {
        setIsLoading(true);
        if (param.libraryTypeId == undefined) {
            param.libraryTypeId = -1;
        }
        if (param.rank == undefined) {
            param.rank = "";
        }
        if (param.status == undefined) {
            param.status = "";
        }
        if (param.title == undefined) {
            param.title = "";
        }
        libraryInfoApi.searchAllByParamLi(param).then((resp: any) => {
            if (resp.status === 200) {
                setDataSource(resp.data);
            }
        })
            .finally(() => setIsLoading(false));
    }

    const action = (libraryInfoId: number, record: LibraryInfoDto): React.ReactNode => {
        return <Space key={libraryInfoId}>
            <Button className="btn-outline-info" size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
            {/* n??t s???a n???u c???n */}
            {/* <Popconfirm
                title="B???n ch???c ch???n mu???n x??a?"
                onConfirm={() => onDelete(libraryInfoId)}
                okText="?????ng ??"
                cancelText="H???y b???"
            >
                <Button size="small"><DeleteOutlined style={{ color: 'red' }} /></Button>
            </Popconfirm> */}
        </Space>
    }

    const columns: any[] = defineColumns(dataSourceType, action);

    return (
        <PageContainer className="fadeInRight">
            <Spin spinning={isLoading}>
                <Form
                    onFinish={onFinish}>
                    {/* form={form} */}
                    <Card >
                        <Row gutter={8}>
                            <Col span={5}>
                                <Form.Item name="title" >
                                    <Input
                                        placeholder="Nh???p t??? kh??a ????? t??m ki???m ch??? ?????"
                                        title='nh???p t??? kh??a ????? t??m ki???m ch??? ?????'
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item name="libraryTypeId">
                                    <Select
                                        allowClear
                                        placeholder="Ch???n lo???i tin"
                                        style={{ width: "100%" }}
                                    >
                                        {dataToSelectBox(dataSourceType, 'libraryTypeId', 'typeName')}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="rank">
                                    <Select
                                        allowClear
                                        placeholder="Ch???n x???p h???ng"
                                        style={{ width: "100%" }}
                                    >
                                        <Option value="1">Ph??? bi???n</Option>
                                        <Option value="0">??t ph??? bi???n</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="status">
                                    <Select
                                        allowClear
                                        placeholder="Ch???n tr???ng th??i"
                                        style={{ width: "100%" }}
                                    >
                                        <Option value="1">Hi???u l???c</Option>
                                        <Option value="0">Ng???ng hi???u l???c</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Button icon={<SearchOutlined />} className="custom-btn1 btn-outline-info" htmlType='submit'>Tra c???u</Button>
                            </Col>
                            <Col>
                                <Button className="custom-btn1 btn-outline-info" icon={<PlusCircleOutlined />} onClick={handleCreate} >Th??m m???i</Button>
                                {/* type="primary" */}
                            </Col>
                        </Row>
                        {/* <Card> */}
                        <Row gutter={8}>
                            <Col span={24}>
                                <Table
                                    size='small'
                                    // loading={loading}
                                    dataSource={dataSource}
                                    columns={columns}
                                    bordered
                                    pagination={{ showSizeChanger: true }}
                                />
                            </Col>
                        </Row>
                        {/* </Card> */}
                    </Card>
                </Form>
            </Spin>
            <EditFormLibrary
                visible={showEdit}
                setVisible={setShowEdit}
                onEdit={onEdit}
                record={recordEdit}
                isSaving={isSaving}
                isView={isView}
            />
            <EditFormLibraryInfo
                visible={showEditInfo}
                setVisible={setShowEditInfo}
                onEdit={onEdit}
                record={recordEditTypeList}
                isSaving={isSaving}
                isView={isView}
                libraryType={libraryTypeValue}
            />
        </PageContainer>
    )
}