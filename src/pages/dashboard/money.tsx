import { usePropGroup } from '@/core/selectors';
import { CodAmountResponse, CodItemDto, CodItemResponse, DashboardApi } from '@/services/client';
import { formatCurrency } from '@/utils';
import { ClockCircleTwoTone, WalletTwoTone } from '@ant-design/icons';
import { Card, Col, Dropdown, Modal, Progress, Row, Spin, Statistic, Table } from 'antd';
import defineColumns from './columns-money';
import React, { useEffect, useMemo, useState } from 'react';
import { RangeValue } from '.';

const dashboardApi = new DashboardApi();
type Props = {
    username?: string,
    // dateType: 'DD' | 'IW' | 'MONTH',
    rangeDate: RangeValue,
    branch?: string[]
}
const Money = (props: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingModal, setLoadingModal] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [paymentStatus, setPaymentStatus] = useState<string>();
    const [codAmountData, setCodAmountData] = useState<CodAmountResponse[]>([]);
    const [codAmountItem, setCodAmountItem] = useState<CodItemDto[]>([]);
    const propsGroup = usePropGroup();
    const columns: any[] = defineColumns(paymentStatus!);
    const [totalRecord, setTotalRecord] = useState<any>();
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);

    useEffect(() => {
        if (!props.rangeDate) {
            return;
        }

        setLoading(true);
        dashboardApi.getCodAmountData({
            username: props.username,
            fromDate: props.rangeDate?.[0]?.format('DD/MM/YYYY'),
            toDate: props.rangeDate?.[1]?.format('DD/MM/YYYY'),
            branch: props.branch
        })
            .then(resp => {
                setCodAmountData(resp.data)
            })
            .finally(() => {
                setLoading(false);
                setTotalRecord(undefined);
            });
    }, [props.username, props.rangeDate, props.branch]);

    const onLoadData = async (key: any, data: any, p: number, s: number) => {
        return dashboardApi.getCodAmountItemData(key, data, p, s);
    }
    const onCountData = async (key: any, data: any, p: number, s: number) => {
        if (totalRecord?.[key]) {
            return undefined;
        }
        return dashboardApi.countCodAmountItemData(key, data, p, s);
    }

    const loadCodItem = async (key: string, p: number, s: number) => {
        if (!props.rangeDate) {
            return;
        }
        setOpenModal(true)
        setLoadingModal(true);
        setPaymentStatus(key);
        const data = {
            username: props.username,
            fromDate: props.rangeDate?.[0]?.format('DD/MM/YYYY'),
            toDate: props.rangeDate?.[1]?.format('DD/MM/YYYY'),
            branch: props.branch
        };

        const response = await Promise.all([
            onLoadData(key, data, p, s),
            onCountData(key, data, p, s)
        ]);
        setCodAmountItem(response[0].data);
        if (response[1]) {
            setTotalRecord({ ...totalRecord, [key]: response[1].data });
        }
        setLoadingModal(false);
    }

    const onChangePage = (p: any, s: any) => {
        setPage(p - 1);
        setPageSize(s);
        loadCodItem(paymentStatus!, p - 1, s)
    };

    const renderStatistic = (codData: CodAmountResponse[], totalMoney: number, percent: number, title: string, color: string, prefix: React.ReactNode) => {
        const getCodWithGroup = (groupType: number) => {
            return codData.filter(c => c.groupType === groupType).reduce((p, n) => p + (+(n.propValueActual ?? 0)), 0);
        }
        const viewList = (
            <Card size='small' bordered={false} className="g-card-popup">
                {propsGroup.map(pg => (
                    <>
                        <Row className='g-line'>
                            <Col span={14}>{pg.name}</Col>
                            <Col span={10} style={{ textAlign: 'end' }}>{formatCurrency(getCodWithGroup(+pg.value!))} đ</Col>
                        </Row>
                    </>
                ))}
            </Card>
        );

        return (
            <>
                <Dropdown overlay={<>{viewList}</>} placement='bottomRight'>
                    <Statistic
                        title={title}
                        value={formatCurrency(totalMoney)}
                        // precision={0} 
                        valueStyle={{ color: color }}
                        prefix={prefix}
                        suffix="đ"
                    />
                </Dropdown >
                <div style={{ paddingRight: 10 }}><Progress percent={percent} strokeColor={color} /></div>
            </>
        )
    }

    const renderCodView = useMemo(() => {
        const sumNoPayment = codAmountData.filter(c => c.paymentStatus === '1');
        const sumPayment = codAmountData.filter(c => c.paymentStatus === '2');
        const total = codAmountData.reduce((p, n) => p + (+(n.propValueActual ?? 0)), 0);
        const totalPayment = sumPayment.reduce((p, n) => p + (+(n.propValueActual ?? 0)), 0);
        const totalNoPayment = sumNoPayment.reduce((p, n) => p + (+(n.propValueActual ?? 0)), 0);
        const percentPayment = total === 0 ? 0 : Math.round(totalPayment / total * 10000) / 100;
        const percentNoPayment = Math.round((total === 0 ? 0 : 100 - percentPayment) * 100) / 100;

        return (
            <>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <Card size='small' bordered={false} onClick={() => loadCodItem('2', page, pageSize)}>
                        {renderStatistic(sumPayment, totalPayment, percentPayment, "Đã trả tiền", 'rgba(40,167,69,0.9)', <WalletTwoTone twoToneColor={'rgba(40,167,69,0.9)'} />)}
                    </Card>
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <Card size='small' bordered={false} onClick={() => loadCodItem('1', page, pageSize)}>
                        {renderStatistic(sumNoPayment, totalNoPayment, percentNoPayment, "Chờ trả tiền", 'rgba(255,193,5,1)', <ClockCircleTwoTone twoToneColor={'rgba(255,193,5,1)'} />)}
                    </Card>
                </Col>
            </>
        )
    }, [codAmountData, openModal]);

    const onCloseModal = () => {
        setOpenModal(false);
        setCodAmountItem([]);
        setPage(0);
    }

    return (
        <><Spin spinning={loading}>
            <Row gutter={[14, 14]}>
                {renderCodView}
            </Row>
        </Spin>
            <Modal
                visible={openModal}
                title={paymentStatus === '2' ? 'Danh sách đơn hàng đã trả tiền' : 'Danh sách đơn hàng chờ trả tiền'}
                footer={false}
                width={1000}
                onCancel={onCloseModal}
                maskClosable={false}
            >
                <Spin spinning={loadingModal}>
                    <Table
                        scroll={{ y: 360 }}
                        size='small'
                        columns={columns}
                        dataSource={codAmountItem}
                        pagination={{
                            total: totalRecord?.[paymentStatus ?? '0'],
                            current: page + 1,
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            onChange: onChangePage,
                        }}
                    />
                </Spin>
            </Modal>
        </>
    );
};

export default Money;