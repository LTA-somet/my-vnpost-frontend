import type { CollectionOrderDto, CollectOrderSearchDto, ContactDto } from '@/services/client';
import { ContactApi } from '@/services/client';
import { Card, Col, Input, Row, Button, Select, Spin, Form, Table, DatePicker, Divider } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import defineColumns from './columns';
import { PageContainer } from '@ant-design/pro-layout';
import * as PhoneUtil from '@/utils/PhoneUtil';
import { validateMessages } from '@/core/contains';
import CreateCollectionNewPopUp from './create/edit';
import { dataToSelectBox, equalsText } from '@/utils';
import { useCategoryAppParamList } from '@/core/selectors';
import moment from 'moment';
import { RangePickerProps } from 'antd/lib/date-picker';


const contactApi = new ContactApi();
const CollectionNew = () => {
    const { searchAllByParam, setPage, onCreate, dataSource, setShowEdit, isLoading, setSize, page, size, totalRecord, paramSearch } = useModel('collectionNewsModel')
    const [isView, setIsView] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [contact, setContact] = useState<ContactDto[]>([]);
    const [recordDetail, setRecordDetail] = useState<CollectionOrderDto>();
    const { RangePicker } = DatePicker;
    const STATUS = useCategoryAppParamList().filter((c) => c.type === 'LIST_STATUS_COLL_ORD');
    const [disableDate, setDisableDate] = useState<any>();


    useEffect(() => {
        searchAllByParam({}, 0, 10)
    }, [])

    const disabledDate: RangePickerProps['disabledDate'] = current => {
        if (disableDate && disableDate[0]) {
            return (
                current.isAfter(moment(disableDate[0]).add(31, 'day'))
            )
        }
        if (disableDate && disableDate[1]) {
            return (
                current.isBefore(moment(disableDate[1]).subtract(31, 'day'))
            )
        }
        else {
            return (
                current.isBefore(moment().subtract(1, 'day').subtract(2, 'year'))
            )
        }
    };

    const onFinish = (param: any) => {
        if (param.fromDateToDate) {
            // console.log(moment(param.toDateFromDate[0]).format('YYYY-MM-DD HH:mm'));
            const date: string[] = []
            param.fromDateToDate.map(d => {
                date.push(moment(d).format('YYYY-MM-DD HH:mm'));
            })
            param.fromDateToDate = date

        }
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
    const showCollectionDetail = (collectionRequestCode: string, record: CollectionOrderDto) => {
        setIsView(true);
        setShowEdit(true)
        setRecordDetail(record);
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

    const resetDate = () => {
        form.setFieldsValue({ fromDateToDate: undefined })
        const a = document.getElementById('form-search-collect-order_fromDateToDate');
        a?.focus();

    }

    const columns: any[] = defineColumns(showCollectionDetail);

    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Form
                        name="form-search-collect-order"
                        onFinish={onFinish}
                        form={form}
                        validateMessages={validateMessages}
                    >
                        <Card>
                            <Divider orientation="left" orientationMargin="0" plain>Điều kiện tìm kiếm</Divider>
                            <Row gutter={14} >
                                <Col flex={'20%'}>
                                    <Form.Item
                                        name="senderId"
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
                                <Col flex={'20%'}>
                                    <Form.Item name="status">
                                        <Select
                                            placeholder='Trạng thái'
                                            allowClear
                                        >
                                            {dataToSelectBox(STATUS, 'value', 'name')}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col flex={'20%'}>
                                    <Form.Item
                                        name="phoneNumber"
                                    >
                                        <Input allowClear placeholder='Số điện thoại' />
                                    </Form.Item>
                                </Col>
                                <Col flex={'20%'}>
                                    <Form.Item
                                        name="fromDateToDate"
                                        initialValue={[moment(), moment()]}
                                    >
                                        <RangePicker
                                            style={{ width: "100%" }}
                                            placeholder={["từ ngày", "đến ngày"]}
                                            format="DD/MM/YYYY"
                                            onClick={resetDate}
                                            onCalendarChange={(e) => setDisableDate(e)}
                                            disabledDate={disabledDate}
                                        />
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
            <CreateCollectionNewPopUp
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


