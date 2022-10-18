import React, { useEffect, useState } from 'react';
import { AppLogLoginApi } from '@/services/client';
import { Form, Input, Row, Col, DatePicker, Table, Spin, Card, Button, Space, Select } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import columnsDefine from './columns';
import { ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { RangePickerProps } from 'antd/lib/date-picker';
import { dataToSelectBox, downloadFile } from '@/utils';

const appLogLoginApi = new AppLogLoginApi();
type FilterType = {
    page: number,
    size: number,
    startDate?: string,
    endDate?: string,
    username?: string,
    usernameForReplace?: string,
    phoneNumber: string,
    orgCode: string,
    channel: string
}
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const defaultFilter: FilterType = {
    page: 1,
    size: 10,
    usernameForReplace: '',
    startDate: moment().startOf('day').format('DD/MM/YYYY HH:mm:ss'),
    username: '',
    phoneNumber: '',
    orgCode: '',
    channel: ''
}
const channelList = [
    { id: 'ANDROID', name: 'APP_ANDROID' },
    { id: 'IOS', name: 'APP_IOS' },
    { id: 'WEB', name: 'WEB' },
];
const AppLogLogin: React.FC = () => {
    const [dataSource, setDataSource] = useState<any[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(10);

    const [filter, setFilter] = useState<FilterType>(defaultFilter);

    const [disabledStartDate, setDisabledStartDate] = useState<any>(moment().startOf('day'));
    const [form] = Form.useForm();

    const loadCountData = () => {
        setLoading(true);
        appLogLoginApi.countQueryAllLogLoginByPagination(
            filter.startDate ?? '',
            filter.endDate ?? '',
            filter.username ?? '',
            filter.usernameForReplace ?? '',
            filter.phoneNumber ?? '',
            filter.orgCode ?? '',
            filter.channel ?? '',
            filter.page - 1,
            filter.size,
            'DESC',
            'login_date'
        ).then(resp => {
            setTotal(+resp.data);
            // setDataSource(resp.data);
        }).finally(() => setLoading(false));
    }

    const loadData = () => {
        setLoading(true);
        appLogLoginApi.searchAllLogLoginByPagination(
            filter.startDate ?? '',
            filter.endDate ?? '',
            filter.username ?? '',
            filter.usernameForReplace ?? '',
            filter.phoneNumber ?? '',
            filter.orgCode ?? '',
            filter.channel ?? '',
            filter.page - 1,
            filter.size,
            'DESC',
            'login_date'
        ).then(resp => {
            // console.log("resp.data", resp.data);

            setDataSource(resp.data);
            // setTotal(+resp.headers['x-total-count'])
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        loadData();
        loadCountData();
    }, [filter]);

    const onChangePagination = (page: number, pageSize: number) => {
        console.log("page: ; size: ", page, pageSize);

        setFilter({ ...filter, page: page, size: pageSize })
    };

    const pagination = {
        showSizeChanger: true,
        onChange: onChangePagination,
        defaultCurrent: 1,
        defaultPageSize: 10,
        total: total
    }

    const onFilter = (formValue: any) => {
        const startDate = formValue?.startDate ? formValue?.startDate?.format('DD/MM/YYYY HH:mm:ss') : '';
        const endDate = formValue?.endDate ? formValue?.endDate?.format('DD/MM/YYYY HH:mm:ss') : '';
        const username = formValue?.username;
        const usernameForReplace = formValue?.usernameForReplace;
        const phoneNumber = formValue?.phoneNumber;
        const orgCode = formValue?.orgCode;
        const channel = formValue?.channel;
        const res = { ...filter, startDate, endDate, username, usernameForReplace, phoneNumber, orgCode, channel };
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

    const onChangeChannel = () => {

    }

    const exportExcelLogLogin = () => {
        setLoading(true);
        form.validateFields()
            .then(formValue => {
                const input = onFilter(formValue);
                appLogLoginApi
                    .exportExcelLogLogin(
                        filter.startDate ?? '',
                        filter.endDate ?? '',
                        filter.username ?? '',
                        filter.usernameForReplace ?? '',
                        filter.phoneNumber ?? '',
                        filter.orgCode ?? '',
                        filter.channel ?? '',
                        input.page - 1,
                        input.size,
                        'DESC',
                        'login_date'
                    ).then((resp) => {
                        if (resp.status === 200) {
                            downloadFile(resp.data, 'export_Log_Login');
                            // console.log(resp.data);
                        }
                    })
                    .finally(() => setLoading(false));
            })
    }

    return (
        <>
            <Card>
                <Form form={form} {...formItemLayout} onFinish={onFilter}>
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
                                name="usernameForReplace"
                                label="Tài khoản NV nhập thay thế"
                            >
                                <Input maxLength={100} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Số điện thoại"
                            >
                                <Input maxLength={50} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="orgCode"
                                label="Mã khách hàng (CMS)"
                            >
                                <Input maxLength={50} />
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
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                name="channel"
                                label="Kênh đăng nhập"
                            >
                                <Select
                                    allowClear
                                    onChange={onChangeChannel}
                                >
                                    {dataToSelectBox(channelList, 'id', 'name')}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row align='bottom'>
                        <Col span={24} style={{ textAlign: 'end' }}>
                            <Space>
                                <Button onClick={loadData} icon={<ReloadOutlined />} />
                                <Button htmlType='reset' onClick={() => setFilter(defaultFilter)}>Đặt lại</Button>
                                <Button htmlType='submit' type='primary'>Tìm kiếm</Button>
                                <Button onClick={exportExcelLogLogin} type='primary'>Thống kê Excel</Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <Spin spinning={loading}>
                <Card className="fadeInRight" style={{ marginTop: 14 }}>
                    <Table
                        dataSource={dataSource}
                        columns={columnsDefine}
                        bordered
                        pagination={pagination}
                    />
                </Card>
            </Spin>
        </>
    );
};
export default AppLogLogin;