import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { AppLogApi, AppLogEntity } from '@/services/client';
import { Form, Input, Row, Col, DatePicker, Table, Spin, Card, Button, Modal, Descriptions, message, Select, Space, AutoComplete } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import columnsDefine from './columns';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { dataToSelectBox, downloadFile } from '@/utils';
import moment from 'moment';
import { RangePickerProps } from 'antd/lib/date-picker';

const appLogApi = new AppLogApi();
type FilterType = {
    page: number,
    size: number,
    text?: string,
    startDate?: string,
    endDate?: string,
    systemName?: string,
    username?: string,
    success?: number
}
const systemList = [
    { id: 'CMS', value: 'CMS', name: 'CMS' },
    { id: 'BILLING', value: 'BILLING', name: 'BILLING' },
    { id: 'SMS_OTP', value: 'SMS_OTP', name: 'SMS_OTP' },
    { id: 'PNS', value: 'PNS', name: 'PNS' },
    { id: 'Calculate Fee by KHL', value: 'Calculate Fee by KHL', name: 'Calculate Fee by KHL' }
]
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const defaultFilter: FilterType = {
    page: 1,
    size: 10,
    text: '',
    systemName: '',
    startDate: moment().startOf('day').format('DD/MM/YYYY HH:mm:ss'),
    username: '',
    success: undefined
}
const AppLog: React.FC = () => {
    const [dataSource, setDataSource] = useState<any[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [viewRecord, setViewRecord] = useState<AppLogEntity>();
    const [total, setTotal] = useState<number>(10);

    const [filter, setFilter] = useState<FilterType>(defaultFilter);
    const [showExport, setShowExport] = useState<boolean>(false);
    const [disabledStartDate, setDisabledStartDate] = useState<any>(moment().startOf('day'));
    const [form] = Form.useForm();

    const loadData = () => {
        setLoading(true);
        appLogApi.searchAllByPagination(
            filter.systemName || '',
            filter.text || '',
            filter.startDate || '',
            filter.endDate || '',
            filter.username,
            filter.success,
            filter.page - 1,
            filter.size,
            'DESC',
            'created_Date'
        ).then(resp => {
            setDataSource(resp.data);
            const newTotal = +resp.headers['x-total-count'];
            setTotal(newTotal);

            // const page = Math.ceil(newTotal / filter.size);
            // if (page < filter.page) {
            //     setFilter({ ...filter, page: page })
            // }
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        loadData();
    }, [filter]); //Khi submit chạy hàm loadData(), filter là obj input

    const onView = (appLog: AppLogEntity) => {
        setViewRecord(appLog);
    }

    const action = (id: number, record: AppLogEntity): React.ReactNode => {
        return <Button icon={<EyeOutlined />} onClick={() => onView(record)}></Button>
    }

    const columns = columnsDefine(action);

    const textToJson = (text?: string) => {
        if (!text) return text;
        try {
            return JSON.stringify(JSON.parse(text || ''), null, 4);
        } catch (e) {
            return text;
        }
    }

    const request = useMemo(() => textToJson(viewRecord?.request), [viewRecord]);
    const response = useMemo(() => textToJson(viewRecord?.response), [viewRecord]);

    const onCopy = (text?: string) => {
        navigator.clipboard.writeText(text ?? '');
        message.success('Đã copy')
    }

    const onChangePagination = (page: number, pageSize: number) => {
        setFilter({ ...filter, page: page, size: pageSize })
    };

    const pagination = {
        showSizeChanger: true,
        onChange: onChangePagination,
        defaultCurrent: 1,
        defaultPageSize: 10,
        total: total,
        current: filter.page
    }

    const onFilter = (formValue: any) => {
        const text = formValue?.text;
        const systemName = formValue?.systemName;
        const startDate = formValue?.startDate ? formValue?.startDate?.format('DD/MM/YYYY HH:mm:ss') : '';
        const endDate = formValue?.endDate ? formValue?.endDate?.format('DD/MM/YYYY HH:mm:ss') : '';
        const username = formValue?.username;
        const success = formValue?.success ?? -1;
        const res = { ...filter, text, systemName, startDate, endDate, username, success, page: 1 };
        setFilter(res)
        return res;
    }

    const disabledDate: RangePickerProps['disabledDate'] = current => {
        // Can not select days before today and today
        if (disabledStartDate) {
            return (
                current.isAfter(moment(disabledStartDate).add(31, 'day')) || current.isBefore(moment(disabledStartDate))
            )
        }
    };

    const changeStartDate = (event: any) => {
        setDisabledStartDate(event);
        form.setFieldsValue({
            endDate: null
        })
    }

    const onChangeSystem = (event: any) => {
        console.log("event", event);
        if (event === "SMS_OTP") {
            setShowExport(true);
        } else {
            setShowExport(false);
        }
    }

    const exportExcelLogSystem = () => {
        setLoading(true);
        form.validateFields()
            .then(formValue => {
                const input = onFilter(formValue);
                appLogApi
                    .exportExcelLogSystem(
                        input.systemName || '',
                        input.text || '',
                        input.startDate || '',
                        input.endDate || '',
                        input.username,
                        input.success,
                        input.page - 1,
                        input.size,
                        'DESC',
                        'created_Date'
                    ).then((resp) => {
                        console.log("resp", resp);

                        if (resp.status === 200) {
                            downloadFile(resp.data, 'export_Log_System');
                            // console.log(resp.data);
                        }
                    })
                    .finally(() => setLoading(false));
            })
    }

    return (
        <>
            <Card>
                <Form {...formItemLayout} form={form} onFinish={onFilter}>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                name="systemName"
                                label="Mã hệ thống"
                            >
                                <AutoComplete
                                    options={systemList}
                                    filterOption={(inputValue, option) =>
                                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                    onChange={onChangeSystem}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="text"
                                label="Keyword"
                            >
                                <Input maxLength={100} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                name="username"
                                label="Tài khoản"
                            >
                                <Input maxLength={100} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="success"
                                label="Trạng thái"
                                valuePropName='checked'
                            >

                                <Select allowClear>
                                    <Select.Option key={0} value={0}>Thất bại</Select.Option>
                                    <Select.Option key={1} value={1}>Thành công</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                name="startDate"
                                label="Thời gian bắt đầu"
                                initialValue={moment().startOf('day')}
                            >
                                <DatePicker showTime format={'DD/MM/YYYY HH:mm:ss'} style={{ width: '100%' }} onChange={changeStartDate} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="endDate"
                                label="Thời gian kết thúc"
                            >
                                <DatePicker showTime format={'DD/MM/YYYY HH:mm:ss'} disabledDate={disabledDate} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row align='bottom'>
                        <Col span={24} style={{ textAlign: 'end' }}>
                            <Space>
                                <Button onClick={loadData} icon={<ReloadOutlined />} />
                                <Button htmlType='reset' onClick={() => setFilter(defaultFilter)}>Đặt lại</Button>
                                <Button htmlType='submit' type='primary'>Tìm kiếm</Button>
                                {showExport && <Button onClick={exportExcelLogSystem} type='primary'>Kết xuất Excel</Button>}
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <Spin spinning={loading}>
                <Card className="fadeInRight" style={{ marginTop: 14 }}>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        bordered
                        pagination={pagination}
                    />
                </Card>
            </Spin>
            <Modal width={900} title="Xem thông tin" visible={!!viewRecord} onCancel={() => setViewRecord(undefined)} destroyOnClose footer={false}>
                <Descriptions title={viewRecord?.system}>
                    <Descriptions.Item label="Tài khoản">{viewRecord?.createdBy}</Descriptions.Item>
                    <Descriptions.Item label="Thời gian">{viewRecord?.createdDate}</Descriptions.Item>
                    <Descriptions.Item label="Thời gian thực thi">{viewRecord?.executeTime}ms</Descriptions.Item>
                    <Descriptions.Item label="URL">{viewRecord?.url}</Descriptions.Item>
                </Descriptions>
                <Card title="Request" size='small' extra={<a href="#" onClick={() => onCopy(request)}>Copy</a>}>
                    <pre>
                        {request}
                    </pre>
                </Card>
                <Card style={{ marginTop: 20 }} title="Response" size='small' extra={<a href="#" onClick={() => onCopy(response)}>Copy</a>}>
                    <pre>
                        {response}
                    </pre>
                </Card>
            </Modal>
        </>
    );
};
export default AppLog;