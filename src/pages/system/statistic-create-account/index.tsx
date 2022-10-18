import React, { useEffect, useState } from 'react';
import { AppLogLoginApi, McasOrganizationStandardApi, McasOrganizationStandardDto, McasOrganizationStandardEntity, McasUserApi } from '@/services/client';
import { Form, Input, Row, Col, DatePicker, Table, Spin, Card, Button, Space, Select } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import columnsDefine from './columns';
import { ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { RangePickerProps } from 'antd/lib/date-picker';
import { dataToSelectBox, downloadFile } from '@/utils';

const appLogLoginApi = new AppLogLoginApi();
const mcasOrganizationStandardApi = new McasOrganizationStandardApi();
const mcasUserApi = new McasUserApi();
type FilterType = {
    page: number,
    size: number,
    startDate?: string,
    endDate?: string,
    unitCode?: string,
    createdBy?: string,
    username?: string,
}
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const defaultFilter: FilterType = {
    page: 1,
    size: 10,
    startDate: moment().startOf('day').format('DD/MM/YYYY HH:mm:ss'),
    unitCode: '',
    createdBy: '',
    username: '',
}

const createdByList = [
    { id: '', name: 'Tất cả' },
    { id: '0', name: 'Khách hàng' },
    { id: '1', name: 'Nhân viên VNPost' },
];

const StatisticCreateAccount: React.FC = () => {
    const [dataSource, setDataSource] = useState<any[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(10);

    const [filter, setFilter] = useState<FilterType>(defaultFilter);

    const [disabledStartDate, setDisabledStartDate] = useState<any>(moment().startOf('day'));
    const [form] = Form.useForm();

    const [dataUnitList, setDataUnitList] = useState<McasOrganizationStandardEntity[]>();
    const { Option } = Select;

    const loadUnit = () => {
        setLoading(true);
        mcasOrganizationStandardApi.findAllByUnitTypeAndTypeCode().then(resp => {
            setDataUnitList(resp.data);
        }).finally(() => setLoading(false));
    }

    const loadCountData = () => {
        setLoading(true);
        mcasUserApi.countQueryAllStaticCreatedAccountByPagination(
            filter.startDate ?? '',
            filter.endDate ?? '',
            filter.unitCode ?? '',
            filter.createdBy ?? '',
            filter.username ?? '',
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
        mcasUserApi.searchAllStaticCreatedAccountByPagination(
            filter.startDate ?? '',
            filter.endDate ?? '',
            filter.unitCode ?? '',
            filter.createdBy ?? '',
            filter.username ?? '',
            filter.page - 1,
            filter.size,
            'DESC',
            'login_date'
        ).then(resp => {
            setDataSource(resp.data);
            // setTotal(+resp.headers['x-total-count'])
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        loadData();
        loadCountData();
        loadUnit();
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
        const unitCode = formValue?.unitCode;
        const createdBy = formValue?.createdBy;
        const username = formValue?.username;
        const res = { ...filter, startDate, endDate, unitCode, createdBy, username };
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

    const onChangeUnit = () => {

    }

    const onChangeCreatedBy = () => {

    }

    const exportExcelStatistic = () => {
        setLoading(true);
        form.validateFields()
            .then(formValue => {
                const input = onFilter(formValue);
                mcasUserApi
                    .exportExcelStatistic(
                        filter.startDate ?? '',
                        filter.endDate ?? '',
                        filter.unitCode ?? '',
                        filter.createdBy ?? '',
                        filter.username ?? '',
                        input.page - 1,
                        input.size,
                        'DESC',
                        'login_date'
                    ).then((resp) => {
                        if (resp.status === 200) {
                            downloadFile(resp.data, 'export_Statistic_Create-Account');
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
                                name="startDate"
                                label="Ngày tạo từ ngày"
                                initialValue={moment().startOf('day')}
                            >
                                <DatePicker showTime format={'DD/MM/YYYY HH:mm:ss'} style={{ width: '100%' }} onChange={changeStartDate} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="endDate"
                                label="Ngày tạo đến ngày"
                            >
                                <DatePicker showTime format={'DD/MM/YYYY HH:mm:ss'} disabledDate={disabledDate} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                name="unitCode"
                                label="Đơn vị quản lý"
                                initialValue={''}
                            >
                                <Select
                                    allowClear
                                    onChange={onChangeUnit}
                                >
                                    <Option value="">Tất cả</Option>
                                    <Option value="00">Tổng công ty</Option>
                                    {dataToSelectBox(dataUnitList, 'unitCode', 'unitName')}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="createdBy"
                                label="Tạo bởi"
                                initialValue={''}
                            >
                                <Select
                                    allowClear
                                    onChange={onChangeCreatedBy}
                                >
                                    {dataToSelectBox(createdByList, 'id', 'name')}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                name="username"
                                label="Tài khoản tạo"
                            >
                                <Input maxLength={100} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row align='bottom'>
                        <Col span={24} style={{ textAlign: 'end' }}>
                            <Space>
                                <Button onClick={loadData} icon={<ReloadOutlined />} />
                                <Button htmlType='reset' onClick={() => setFilter(defaultFilter)}>Đặt lại</Button>
                                <Button htmlType='submit' type='primary'>Tìm kiếm</Button>
                                <Button onClick={exportExcelStatistic} type='primary'>Kết xuất Excel</Button>
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
export default StatisticCreateAccount;