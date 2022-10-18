import { AccountReplaceDto, McasOrganizationStandardApi, McasOrganizationStandardDto } from '@/services/client';
import { Card, Col, Input, Row, Button, Select, Spin, Form, Table, Space, AutoComplete } from 'antd';
import { DeleteOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import defineColumns from './columns';
import { PageContainer } from '@ant-design/pro-layout';
import EditFormAccountReplace from './edit';
import React from 'react';
import { validateMessages } from '@/core/contains';
import { debounce } from 'lodash';
import { dataToSelectBox } from '@/utils';


const mcasOrganizationStandardApi = new McasOrganizationStandardApi();
const AccountReplace = () => {
    const { searchAllByParam, deleteRecord, onCreate, dataSource, showEdit, setShowEdit, isLoading, setIsLoading } = useModel('accountReplaceModel')
    const [isView] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [paramSearch, setParamSearch] = useState<AccountReplaceDto>();
    const [, setPage] = React.useState(1);
    const [options, setOptions] = useState<any[]>([]);


    useEffect(() => {
        if (paramSearch) {
            searchAllByParam(paramSearch)
        } else {
            searchAllByParam({})
        }
    }, [paramSearch, searchAllByParam])

    const onFinish = (param: any) => {
        setParamSearch(param)
        setPage(0);
    }

    const getOrg = (data: McasOrganizationStandardDto) => {
        return {
            label: data.unitCode + ' - ' + data.unitName,
            value: data.unitCode
        }
    }

    const searching = useCallback((values: string, callback?: (success: any) => void) => {
        setIsLoading(true);
        if (values) {
            mcasOrganizationStandardApi
                .searchSmallByCodeOrName(0, 10, values)
                .then((resp) => {
                    if (resp.status === 200 && resp.data.result) {
                        const result = resp.data.result.map(d => {
                            return getOrg(d)
                        })
                        setOptions(result!);
                        if (callback) {
                            callback(result);
                        }
                    }
                }).finally(() => setIsLoading(false));
        }
    }, []);

    useEffect(() => {
        searching('00')
    }, [])

    // useEffect(() => {
    //     mcasOrganizationStandardApi
    //         .searchSmallByCodeOrName(0, 10)
    //         .then((resp) => {
    //             if (resp.status === 200 && resp.data.result) {
    //                 const result = resp.data.result.map(d => {
    //                     return getOrg(d)
    //                 })
    //                 setOptions(result!);
    //             }
    //         })
    // }, [])

    const debounceSearching = useCallback(debounce((value) => searching(value), 300), [])

    const handleSearch = (values: string) => {
        if (values !== '') {
            debounceSearching(values);
        }
    };


    const action = (id: number): React.ReactNode => {
        return <Space key={id}>
            <Button className="btn-outline-danger" onClick={() => deleteRecord(id)} size="small"><DeleteOutlined /></Button>
        </Space>
    }

    const columns: any[] = defineColumns(action);

    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Form
                        name="form-account-replace"
                        labelCol={{ flex: '130px' }}
                        labelWrap
                        onFinish={onFinish}
                        form={form}
                        validateMessages={validateMessages}
                    >
                        <Card>
                            <Row gutter={8} >
                                <Col span={6}>
                                    <Form.Item name="username" style={{ wordWrap: 'initial' }}>
                                        <Input
                                            placeholder="Mã TK nhập thay thế"
                                            title='Mã TK nhập thay thế'
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="fullname"
                                    >
                                        <Input
                                            placeholder="Tên người nhập thay thế"
                                            title='Tên người nhập thay thế'
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="orgCode"
                                    >
                                        <Select allowClear showSearch placeholder={'Đơn vị'}
                                            onSearch={handleSearch}
                                            options={options}
                                            filterOption={false}
                                        >
                                            {/* {dataToSelectBox(options, 'orgCode', 'orgName')} */}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col >
                                    <Button icon={<SearchOutlined />} style={{ float: "right" }} className='btn-outline-info' title='Tìm kiếm' htmlType='submit' >Tìm kiếm</Button>
                                </Col>
                                <Col>
                                    <Button onClick={() => setShowEdit(true)} className='btn-outline-info' style={{ float: "right" }} icon={<PlusCircleOutlined />}  >Thêm mới</Button>
                                    {/* type="primary" */}
                                </Col>
                            </Row>
                            <br />
                            {/* <Card> */}
                            <Row gutter={8}>
                                <Col span={24}>
                                    <Table
                                        size='small'
                                        dataSource={dataSource}
                                        pagination={{
                                            defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'], onChange(current) {
                                                setPage(current);
                                            }
                                        }}
                                        columns={columns}
                                        bordered
                                    />
                                </Col>
                            </Row>
                            {/* </Card> */}
                        </Card>
                    </Form>
                </Spin>
                <EditFormAccountReplace
                    visible={showEdit}
                    setVisible={setShowEdit}
                    onCreate={onCreate}
                    isView={isView}
                />
            </PageContainer>
        </div>
    );

};
export default AccountReplace;


