import { Modal } from 'antd';
import { useState } from 'react';

export default (showModel) => {

    const [isModelVisible, setIsModalVisible] = useState(showModel);

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    return (
        <Modal title="Tìm kiếm hợp đồng C"
            visible={isModelVisible}
            width={1200}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
        >
            {/* <ContractC contractNumberInit={contractNumber} getData={(data) => handleData(data)} onCloseModel={() => setIsModalVisible(false)}></ContractC> */}
        </Modal>
    )
}