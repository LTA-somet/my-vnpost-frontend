import { ProductEntity } from '@/services/client';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Table } from 'antd';
import React, { useState } from 'react';

import columns from './product-modal-columns';

const ProductModal: React.FC<Props> = (props: Props) => {
    const [selectedRows, setSelectedRows] = useState<ProductEntity[]>([]);

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], newSelectedRows: ProductEntity[]) => {
            setSelectedRows(newSelectedRows);
        },
    };

    const onFinish = () => {
        if (selectedRows?.length === 0) {
            return;
        }
        props.onAddMultiItem(selectedRows);
        setSelectedRows([]);
        props.setOpenModalProduct(false);
    }

    return (
        <Modal
            title={'Danh sách hàng hoá'}
            onCancel={() => props.setOpenModalProduct(false)}
            width={700}
            visible={props.openModalProduct}
            footer={
                <Space>
                    <Button className='btn btn-outline-danger' icon={<CloseCircleOutlined />} onClick={() => props.setOpenModalProduct(false)}>Huỷ</Button>
                    <Button className='btn btn-outline-success' icon={<CheckCircleOutlined />} onClick={onFinish}>
                        Thực hiện
                    </Button>
                </Space>
            }
            destroyOnClose
        >
            <Table
                rowKey={'productId'}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                size='small'
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={props.productList}
                columns={columns}
                scroll={{ y: 300 }}
                pagination={false}
            />
        </Modal>
    );
};
type Props = {
    setOpenModalProduct: (isOpen: boolean) => void,
    openModalProduct: boolean,
    onAddMultiItem: (products: ProductEntity[]) => void,
    productList: ProductEntity[]
}
export default ProductModal;