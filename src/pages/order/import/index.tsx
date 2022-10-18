import PrintOrderForm from '@/components/PrintOrder/print-order';
import { McasUserApi, OrderHdrApi, OrderHdrDto } from '@/services/client';
import { printFile } from '@/utils';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined, FileAddOutlined, PrinterOutlined, SaveOutlined, WarningOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Checkbox, Col, message, Modal, Radio, Row, Segmented, Space, Spin, Table } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import columnsDefine from './columns';
import EditOrderModal from './edit-modal';
import ImportHeader from './header';

const { confirm } = Modal;

const tabListInit: { value: number, label: string, position: 'left' | 'right' }[] = [
    { value: -1, label: "Đơn hợp lệ", position: 'left' },
    { value: -2, label: "Cảnh báo", position: 'left' },
    { value: -3, label: "Đơn không hợp lệ", position: 'left' },
    { value: -4, label: "Đơn tạo không thành công", position: 'right' },
    { value: 0, label: "Đơn lưu nháp", position: 'right' },
    { value: 1, label: "Đơn tạo thành công", position: 'right' }
]

const mcasUserApi = new McasUserApi();
const orderHdrApi = new OrderHdrApi();
const OrderHdr = () => {
    const { isLoading, orderHdrList, orderHdrStatusList, createListOrderDraft,
        createListOrder, deleteListOrder, setOrderHdrList, exportOrderError } = useModel('importModel')
    const [tabIndex, setTabIndex] = useState<number>(-1);
    const [tabList, setTabList] = useState<{ value: number, label: string, position: 'left' | 'right' }[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [recordEdit, setRecordEdit] = useState<OrderHdrDto>();
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [mauinDefault, setmauInDefault] = useState<string>();
    const printRef = useRef<any>();

    useEffect(() => {
        setOrderHdrList([]);
    }, [])

    useEffect(() => {
        const newTabList = tabListInit.map(item => ({ ...item, label: `${item.label} (${orderHdrStatusList[item.value]?.length || 0})` }))
        setTabList(newTabList);
    }, [orderHdrStatusList]);

    const handleChangeTab = (e: any) => {
        setTabIndex(e.target.value);
        setSelectedRowKeys([])
    }

    const handleEdit = (record: OrderHdrDto) => {
        setRecordEdit(record);
        setShowEdit(true);
    }

    const action = (id: string, record: OrderHdrDto): React.ReactNode => {
        if ([-1, -2, -3, 0, -4].includes(record.status!)) {
            return <Button className="btn-outline-info" size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>;
        }
        return '';
    }

    const columns = columnsDefine(action);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: any[]) => {
            setSelectedRowKeys(keys);
        },
    };

    const handleCreateListOrderDraft = () => {
        if (selectedRowKeys.length === 0) {
            message.error('Chọn đơn hàng để thực hiện');
            return;
        }
        confirm({
            title: 'Tạo đơn hàng nháp Excel',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn muốn lưu nháp các đơn hàng đã lựa chọn?',
            okText: 'Đồng ý',
            okType: 'danger',
            cancelText: 'Đóng',
            onOk() {
                const orderHdrSelected = orderHdrList.filter(o => selectedRowKeys.includes(o.orderHdrId!));
                createListOrderDraft(orderHdrSelected, (success: boolean) => success && setSelectedRowKeys([]));
            },
        });
    }

    const handlePrintOrder = () => {
        if (selectedRowKeys.length === 0) {
            message.error('Chọn đơn hàng để thực hiện');
            return;
        } else {
            mcasUserApi.getDataPrintConfig().then((resp) => {
                if (resp.status === 200) {
                    if (resp.data.isDefault) {
                        orderHdrApi
                            .exportListReport(resp.data.mauinCode!, selectedRowKeys)
                            .then((res) => {
                                if (res.status === 200) {
                                    printFile(res.data);
                                }
                            })
                    } else {
                        setmauInDefault(resp.data.mauinCode);

                        printRef.current.handleOpenPrintMulti?.(selectedRowKeys);
                    }
                }
            });
        }
    }

    const handleCreateListOrder = () => {
        if (selectedRowKeys.length === 0) {
            message.error('Chọn đơn hàng để thực hiện');
            return;
        }
        confirm({
            title: 'Tạo đơn hàng Excel',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn muốn tạo các đơn hàng đã lựa chọn?',
            okText: 'Đồng ý',
            okType: 'danger',
            cancelText: 'Đóng',
            onOk() {
                const orderHdrSelected = orderHdrList.filter(o => selectedRowKeys.includes(o.orderHdrId!));
                createListOrder(orderHdrSelected, (success: boolean) => success && setSelectedRowKeys([]));
            },
        });
    }

    const handleDeleteListOrder = () => {
        if (selectedRowKeys.length === 0) {
            message.error('Chọn đơn hàng để thực hiện');
            return;
        }
        confirm({
            title: 'Xóa đơn hàng Excel',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn muốn xóa các đơn hàng đã lựa chọn?',
            okText: 'Đồng ý',
            okType: 'danger',
            cancelText: 'Đóng',
            onOk() {
                deleteListOrder(selectedRowKeys, (success: boolean) => success && setSelectedRowKeys([]));
            },
        });
    }

    const onSelectAll = (e: any) => {
        if (e.target.checked) {
            const ids = orderHdrStatusList[tabIndex]?.map(o => o.orderHdrId!) ?? [];
            setSelectedRowKeys(ids);
        } else {
            setSelectedRowKeys([]);
        }
    }

    return (
        <>
            <PageContainer >
                <Spin spinning={isLoading}>
                    <Row gutter={[14, 14]}>
                        <ImportHeader setTabIndex={setTabIndex} />

                        {orderHdrList.length > 0 && <Col span={24}>
                            <Card title="Đơn hàng đã nhập" className="fadeInRight" size="small">
                                {/* <Row>
                                    <Col span={12}>
                                        <Segmented
                                            options={tabList.filter(t => t.position === 'left')}
                                            onChange={v => setTabIndex(+v)}
                                            value={tabIndex}
                                            style={{ marginBottom: 20 }}
                                        /></Col>
                                    <Col span={12} style={{ textAlign: 'right' }}>
                                        <Segmented
                                            options={tabList.filter(t => t.position === 'right')}
                                            onChange={v => setTabIndex(+v)}
                                            value={tabIndex}
                                            style={{ marginBottom: 20 }}
                                        /></Col>
                                </Row> */}
                                <Row style={{ paddingBottom: 20 }}>
                                    <Col span={12}>
                                        <Radio.Group onChange={handleChangeTab} value={tabIndex}>
                                            {tabList.filter(t => t.position === 'left')
                                                .map(t => <Radio.Button value={t.value}>{t.label}</Radio.Button>)}
                                        </Radio.Group>
                                    </Col>
                                    <Col span={12} style={{ textAlign: 'right' }}>
                                        <Radio.Group onChange={handleChangeTab} value={tabIndex}>
                                            {tabList.filter(t => t.position === 'right')
                                                .map(t => <Radio.Button value={t.value}>{t.label}</Radio.Button>)}
                                        </Radio.Group>
                                    </Col>
                                </Row>
                                <Checkbox checked={selectedRowKeys.length === orderHdrStatusList[tabIndex]?.length} onChange={onSelectAll} style={{ marginLeft: 18, marginBottom: 10 }}> Chọn tất cả </Checkbox>
                                <Table
                                    size="small"
                                    rowKey={'orderHdrId'}
                                    rowSelection={rowSelection}
                                    columns={columns}
                                    dataSource={orderHdrStatusList[tabIndex]}
                                    bordered
                                    pagination={{ showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100', '200', '500'] }}
                                />
                                {/* const tabListInit = [
    { value: "-1", label: "Đơn hợp lệ" },
    { value: "-2", label: "Cảnh báo" },
    { value: "-3", label: "Đơn không hợp lệ" },
    { value: "-4", label: "Đơn tạo không thành công" },
    { value: "0", label: "Đơn lưu nháp" },
    { value: "1", label: "Đơn tạo thành công" }
] */}
                                <Row justify="end" style={{ marginTop: 24 }}>
                                    <Space>
                                        {[-3].includes(tabIndex) && <Button size='large' className='btn btn-outline-danger' onClick={exportOrderError} icon={<WarningOutlined />}>Xuất file excel lỗi</Button>}
                                        {/* {[-2].includes(tabIndex) && <Button size='large' className='btn btn-outline-success' icon={<CheckCircleOutlined />}>Xác nhận</Button>} */}
                                        {[-1, -4, -2, -3].includes(tabIndex) && <Button size='large' className='btn btn-outline-danger' icon={<DeleteOutlined />} onClick={handleDeleteListOrder}>Xoá</Button>}
                                        {[-1, 0].includes(tabIndex) && <Button size='large' className='btn btn-outline-info' icon={<FileAddOutlined />} onClick={handleCreateListOrder}>Tạo đơn</Button>}
                                        {[-4].includes(tabIndex) && <Button size='large' className='btn btn-outline-secondary' icon={<EditOutlined />} onClick={handleCreateListOrder}>Tạo lại đơn</Button>}
                                        {[-1].includes(tabIndex) && <Button size='large' className='btn btn-outline-secondary' icon={<SaveOutlined />} onClick={handleCreateListOrderDraft}>Lưu nháp</Button>}
                                        {[1].includes(tabIndex) && <Button size='large' className='btn btn-outline-primary' icon={<PrinterOutlined />} onClick={handlePrintOrder}>In vận đơn</Button>}
                                    </Space>
                                </Row>
                            </Card>
                        </Col>}
                    </Row>
                </Spin>
                <EditOrderModal
                    record={recordEdit}
                    visible={showEdit}
                    setVisible={setShowEdit}
                />
                <PrintOrderForm ref={printRef} mauinDefault={mauinDefault} />
            </PageContainer >
        </>
    );
};

export default OrderHdr;