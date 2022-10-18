import React, { useEffect } from 'react';
import { AccountReplaceApi } from '@/services/client';
import { Row, Col, Modal, Divider, Table } from 'antd';

const columns: any[] = [
    {
        title: 'STT',
        key: 'index',
        align: 'center',
        width: '60px',
        render: (text: any, record: any[], index: any) => index + 1,
    },
    {
        title: 'Bưu gửi',
        dataIndex: 'item',
        key: 'item',
    },
]

const ListItemAccept: React.FC<Props> = (props: Props) => {
    return (
        <Modal
            title={<div style={{ fontSize: '16px', color: '#00549a' }}>Danh sách bưu gửi đã chấp nhận</div>}
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            width={500}
            footer={false}
            destroyOnClose
        >
            <Divider orientation="left" orientationMargin="0" >{`Mã tin thu gom: ${props.record?.collectionRequestCode}`}</Divider>
            <Row>
                <Col span={24}>
                    <Table size='small' columns={columns} dataSource={props.record?.listItemcode ? props.record?.listItemcode.split(';').map(i => ({ item: i })) : []} />
                </Col>
            </Row>
        </Modal>
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    record?: any
}
export default ListItemAccept;