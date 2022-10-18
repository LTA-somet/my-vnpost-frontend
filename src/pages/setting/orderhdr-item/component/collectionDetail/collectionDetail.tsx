import { useModel } from 'umi';
import { Button, Modal, Table } from "antd";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import './styles.css';
import { formatCurrency } from '@/utils';

const CollectionDetail = (props: Props) => {
    const { orderColection, getCollectionDetailDto } = useModel('orderDetailsList');
    const originalId = props.originalId;
    useEffect(() => {
        if (originalId) {
            getCollectionDetailDto(originalId);
        }
    }, []);

    const columns = [
        {
            title: '',
            dataIndex: 'fieldName',
            key: 'fieldName',
            render: (item: any, record: any) => (
                <>
                    <div style={{ textAlign: 'left', fontSize: '12px' }} className={record.stt == 2 ? 'tag-parent tag-number' : 'tag-number'} >{record.fieldName}</div>
                </>
            )
        },
        {
            title: 'Tiền thu hộ tạm tính (đ)',
            dataIndex: 'propValue',
            key: 'propValue',
            render: (item: any, record: any) => (
                <>
                    <div style={{ textAlign: 'right', fontSize: '12px' }} className={record.stt == 2 ? 'tag-parent tag-number' : 'tag-number'} >{formatCurrency(record.propValue)}</div>
                </>
            )
        },
        {
            title: 'Tiền thu hộ thực tế (đ)',
            dataIndex: 'propValueActual',
            key: 'propValueActual',
            render: (item: any, record: any) => (
                <>
                    <div style={{ textAlign: 'right', fontSize: '12px' }} className={record.stt == 2 ? 'tag-parent tag-number' : 'tag-number'} >{formatCurrency(record.propValueActual)}</div>
                </>
            )
        },
    ];
    return (
        <Modal
            title='Xem cước các dịch vụ'
            width={1000}
            onCancel={() => props.setIsOpenPopup(false)}
            visible={props.isOpenPopup}
            footer={null}
        >
            <Table
                size="small"
                rowKey={'contactId'}
                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                dataSource={orderColection}
                columns={columns}
                bordered
            />
        </Modal>
    );


};
type Props = {
    isOpenPopup: boolean;
    originalId: string;
    setIsOpenPopup: (isOpenPopup: boolean) => void;
}

export default CollectionDetail;
