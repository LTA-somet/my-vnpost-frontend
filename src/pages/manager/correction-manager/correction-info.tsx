import React, { useEffect, useState } from 'react';
import type { CaseAnhltDto } from '@/services/client';
import { CaseAnhlt130Api } from '@/services/client';
import { Modal, Space, Button, Table, Card, Row, Col } from 'antd';
import { ExpandOutlined, ExportOutlined } from '@ant-design/icons';
import { formatNumber } from '@/utils';

const columns = [
    {
        title: 'STT',
        key: 'index',
        align: 'center',
        width: '60px',
        render: (_text: any, _record: any[], index: any) => index + 1,
    },
    {
        title: 'Thông tin hiệu chỉnh',
        dataIndex: 'descriptions',
        key: 'descriptions',
    },
    {
        title: 'Nội dung cũ',
        dataIndex: 'oldValue',
        key: 'oldValue',
    },
    {
        title: 'Nội dung mới',
        dataIndex: 'newValue',
        key: 'newValue',
    },
];

const caseApi = new CaseAnhlt130Api();
const CorrectionDetail: React.FC<Props> = (props: Props) => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [oldTotalFee, setOldTotalFee] = useState<number>();
    const [newTotalFee, setNewTotalFee] = useState<number>();




    useEffect(() => {
        if (props.record) {
            caseApi.findByCaseId(props.record!.caseId!)
                .then(resp => {
                    if (resp.status === 200) {
                        setDataSource(resp.data.changelogEntities!)
                        setOldTotalFee(resp.data.oldTotalFee)
                        setNewTotalFee(resp.data.newTotalFee)
                    }
                })
        }
    }, [props.record])

    return (
        <>
            <Modal

                title={<div style={{ color: '#00549a', fontSize: '16px' }}>Chi tiết hiệu chỉnh {props.record?.caseId} - Vận đơn {props.record?.itemCode}</div>}
                visible={props.visible}
                onCancel={() => props.setVisible(false)}
                width={1000}
                footer={
                    <Space>
                        <Button icon={<ExportOutlined />} className='custom-btn1 btn-outline-secondary' onClick={() => props.setVisible(false)}>Đóng</Button>
                    </Space>
                }
                destroyOnClose
            >
                <Table bordered dataSource={dataSource} columns={columns} size='small' />
                <Card bordered={false}>
                    <table style={{ width: '100%', fontSize: "14px", float: "left" }}>
                        <tbody >
                            <tr >
                                <td style={{ textAlign: 'left' }}>Tổng cước tạm tính trước hiệu chỉnh</td>
                                <td style={{ textAlign: 'right' }}>{formatNumber(oldTotalFee)} đ</td>
                            </tr>
                            <br />
                            <tr >
                                <td style={{ textAlign: 'left' }}>Tổng cước tạm tính sau hiệu chỉnh</td>
                                <td style={{ textAlign: 'right' }}>{formatNumber(newTotalFee)} đ</td>
                            </tr>
                            <br />
                            <tr >
                                {
                                    (newTotalFee! - oldTotalFee!) <= 0 && <td style={{ textAlign: 'left' }}>Số tiền nhận lại tạm tính</td>
                                }
                                {
                                    (newTotalFee! - oldTotalFee!) > 0 && <td style={{ textAlign: 'left' }}>Số tiền trả thêm tạm tính</td>
                                }
                                <td style={{ textAlign: 'right' }}>{formatNumber(Math.abs(newTotalFee! - oldTotalFee!))} đ</td>
                            </tr>
                        </tbody>
                    </table>
                </Card>

            </Modal>
        </>
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    record?: any,
}
export default CorrectionDetail;