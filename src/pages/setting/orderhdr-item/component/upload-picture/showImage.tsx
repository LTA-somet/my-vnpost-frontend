import { Modal, Button } from "antd";
import { useModel } from 'umi';
import { useEffect, useState } from "react";
import ImageView from "./image-viewer";
import { CheckCircleOutlined, ExportOutlined } from "@ant-design/icons";

const ShowImage = (props: Props) => {

    const { orderHdr, findById } = useModel('orderDetailsList');
    const id = props.id;
    useEffect(() => {
        if (props.isOpenPopup && id) {
            findById(id);
        }
    }, [props.isOpenPopup])

    return (
        <Modal
            title="Ảnh đính kèm"
            visible={props.isOpenPopup}
            width={1000}
            onOk={() => props.setIsOpenPopup(false)}
            onCancel={() => props.setIsOpenPopup(false)}
            footer={[
                <Button className="custom-btn1 btn-outline-secondary" icon={<ExportOutlined />} key="submit" type="primary" onClick={() => props.setIsOpenPopup(false)}>
                    Đóng
                </Button>
            ]}
            destroyOnClose
        >
            <>
                <ImageView data={orderHdr?.orderImages}></ImageView>
            </>
        </Modal>
    )


};
type Props = {
    isOpenPopup: boolean;
    id: string;
    setIsOpenPopup: (isOpenPopup: boolean) => void;
}

export default ShowImage;


