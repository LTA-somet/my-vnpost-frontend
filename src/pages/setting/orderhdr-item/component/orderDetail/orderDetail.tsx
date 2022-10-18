import { useModel } from 'umi';
import { Modal, Table } from "antd";
import { useEffect } from "react";
import './styles.css';
import { formatCurrency } from '@/utils';

const OrderDetail = (props: Props) => {

    const { feeDetailDto, getFeeOrderDto } = useModel('orderDetailsList');

    const originalId = props.originalId;
    const status = props.status;
    useEffect(() => {
        if (originalId && status) {
            getFeeOrderDto(originalId, status, false);
        }
    }, []);

    const columns = [
        {
            title: '',
            dataIndex: 'nameFee',
            key: 'nameFee',
            render: (item: any, record: any) => (
                <>
                    <div style={{ fontSize: '12px' }} className={record.stt ? 'tag-parent' : ''} >{record.nameFee}</div>
                </>
            )
        },
        {
            title: 'Thuế suất thuế GTGT (%)',
            dataIndex: 'tax',
            key: 'tax',
            render: (item: any, record: any) => (
                <>
                    <div style={{ textAlign: 'right', fontSize: '12px' }} className={record.stt ? 'tag-parent tag-number' : 'tag-number'} >{formatCurrency(record.tax)}</div>
                </>
            )
        },
        {
            title: 'Tiền cước tạm tính(có VAT) (đ)',
            dataIndex: 'fee',
            key: 'fee',
            render: (item: any, record: any) => (
                <>
                    <div style={{ textAlign: 'right', fontSize: '12px' }} className={record.stt ? 'tag-parent tag-number' : 'tag-number'} >{formatCurrency(record.fee)}</div>
                </>
            )
        },
        {
            title: 'Tiền cước thực tế (có VAT) (đ)',
            dataIndex: 'feeActual',
            key: 'feeActual',
            render: (item: any, record: any) => (
                <>
                    <div style={{ textAlign: 'right', fontSize: '12px' }} className={record.stt ? 'tag-parent tag-number' : 'tag-number'} >{formatCurrency(record.feeActual)}</div>
                </>
            )
        }
    ];
    return (
        <Modal
            title="Chi tiết cước"
            visible={props.isOpenPopup}
            width={1000}
            onOk={() => props.setIsOpenPopup(false)}
            onCancel={() => props.setIsOpenPopup(false)}
            footer={null}
        >
            <Table
                size="small"
                bordered
                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                columns={columns}
                dataSource={feeDetailDto}
            />
        </Modal>
    )


};
type Props = {
    isOpenPopup: boolean;
    // itemCode: string;
    originalId: string;
    status: number;
    setIsOpenPopup: (isOpenPopup: boolean) => void;
}

export default OrderDetail;


