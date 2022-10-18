import type { CollectionScheduleDto, CollectOrderSearchDto, ContactDto } from '@/services/client';
import { ContactApi } from '@/services/client';
import { Card, Col, Input, Row, Button, Select, Spin, Form, Table, DatePicker, Divider, Space } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import defineColumns from './columns';
import { PageContainer } from '@ant-design/pro-layout';
import * as PhoneUtil from '@/utils/PhoneUtil';
import { validateMessages } from '@/core/contains';
import { equalsText } from '@/utils';
import { useCategoryAppParamList } from '@/core/selectors';
import moment from 'moment';
import CreateCollectionSchedule from './create/edit';


const contactApi = new ContactApi();
const CollectionNew = () => {
    const { searchAllByParam, setPage, onCreate, deleteRecord, dataSource, setShowEdit, isLoading, setSize, page, size, totalRecord, paramSearch } = useModel('collectionScheduleModel')
    const [isView, setIsView] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [contact, setContact] = useState<ContactDto[]>([]);
    const [recordDetail, setRecordDetail] = useState<CollectionScheduleDto>();
    const { RangePicker } = DatePicker;
    const STATUS = useCategoryAppParamList().filter((c) => c.type === 'LIST_STATUS_COLL_ORD');


    useEffect(() => {
        searchAllByParam({}, 0, 10)
    }, [])

    const onFinish = (param: any) => {
        if (param.senderId) {
            param.senderName = contact.find(c => c.contactId === param.senderId)?.name
        }
        searchAllByParam(param, 0, size);
        setPage(0);
    }

    useEffect(() => {
        contactApi.findAllByCurrentUser(true)
            .then(resp => {
                if (resp.status === 200) {
                    setContact(resp.data)
                }
            })
    }, [])

    const filterOption = (value: any, option: any): boolean => {
        const phoneStartZero = PhoneUtil.formatNoStart(value);
        const phoneStart84 = PhoneUtil.formatStart84(value);

        return equalsText(option.label, value) || equalsText(option.label, phoneStartZero) || equalsText(option.label, phoneStart84);

    }

    const handleEdit = (record: CollectionScheduleDto) => {
        console.log(record);

        setShowEdit(true);
        setRecordDetail(record);
        setIsView(false);
    }
    const handleView = (record: CollectionScheduleDto) => {
        setShowEdit(true);
        setRecordDetail(record);
        setIsView(true);
    }

    const action = (scheduleId: number, record: CollectionScheduleDto): React.ReactNode => {
        return <Space key={scheduleId}>
            <Button title='xem chi tiết' className="btn-outline-secondary" size="small" onClick={() => handleView(record)}><EyeOutlined /></Button>
            <Button title='Sửa' className="btn-outline-info" size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
            <Button title='Xóa' className="btn-outline-danger" size="small" onClick={() => deleteRecord(record.scheduleId!)}><DeleteOutlined /></Button>
        </Space>
    }

    const onChangePage = (p: any, s: any) => {
        setPage(p - 1);
        setSize(s);
        searchAllByParam(paramSearch!, p - 1, s)
    };

    const onChangeSender = (senderId: any) => {
        const sender = contact.find(r => r.contactId === senderId);
        form.setFieldsValue({
            phoneNumber: sender?.phone
        })

    }

    const columns: any[] = defineColumns(action);

    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Form
                        name="form-search-collect-schedule"
                        onFinish={onFinish}
                        form={form}
                        validateMessages={validateMessages}
                    >
                        <Card>
                            <Divider orientation="left" orientationMargin="0" plain>Điều kiện tìm kiếm</Divider>
                            <Row gutter={24} >
                                <Col flex={'40%'}>
                                    <Form.Item
                                        name="senderId"
                                        label='Người gửi'
                                    >
                                        <Select onChange={onChangeSender} allowClear showSearch placeholder='Người gửi' filterOption={filterOption}>
                                            {/* {dataToSelectBox(senderList, 'contactId', ['name', 'phone', 'address'])} */}
                                            {contact.map(record => (
                                                <Select.Option key={record.contactId} value={record.contactId} label={record.name + '-' + record.phone}>
                                                    <>
                                                        <p style={{ margin: 0 }}>{record.name}</p>
                                                        <p style={{ fontStyle: 'italic', fontWeight: 300, fontSize: 13, margin: 0, color: 'grey' }} >{record.address}</p>
                                                    </>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col flex={'40%'}>
                                    <Form.Item
                                        name="phoneNumber"
                                        label='Số điện thoại người gửi'
                                    >
                                        <Input allowClear placeholder='Số điện thoại người gửi' />
                                    </Form.Item>
                                </Col>
                                <Col flex={'10%'}>
                                    <Button icon={<SearchOutlined />} className='btn-outline-info' title='Tìm kiếm' htmlType='submit' >Tìm kiếm</Button>
                                </Col>
                                <Col flex={'10%'}>
                                    <Button className='custom-btn1 btn-outline-info' icon={<PlusCircleOutlined />} onClick={() => setShowEdit(true)} >Thêm mới</Button>
                                </Col>
                            </Row>
                            <Divider orientation="left" orientationMargin="0" plain>Kết quả tìm kiếm</Divider>
                            <Row gutter={8}>
                                <Col span={24}>
                                    <Table
                                        size="small"
                                        pagination={{
                                            total: totalRecord,
                                            current: page + 1,
                                            defaultPageSize: 10,
                                            showSizeChanger: true,
                                            pageSizeOptions: ['10', '20', '50', '100'],
                                            onChange: onChangePage,
                                        }}
                                        dataSource={dataSource}
                                        columns={columns}
                                        bordered
                                    />
                                </Col>
                            </Row>
                            {/* </Card> */}
                        </Card>
                    </Form>
                </Spin>

            </PageContainer>
            <CreateCollectionSchedule
                isView={isView}
                onCreate={onCreate}
                record={recordDetail}
                setRecord={setRecordDetail}
                setIsView={setIsView}
            />
        </div>

    );

};
export default CollectionNew;


