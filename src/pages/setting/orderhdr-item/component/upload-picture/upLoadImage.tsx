import { Modal, Button } from "antd";
import { useModel } from 'umi';
import { useEffect, useState } from "react";
import ImageEdit from "./image-edit";
import { CheckCircleOutlined, ExportOutlined } from "@ant-design/icons";

const UpLoadImage = (props: Props) => {

    const { orderImage, getOrderImageByIdhdr, saveOrderImage } = useModel('orderDetailsList');
    const [fileList, setFileList] = useState([]);
    const id = props.id;
    useEffect(() => {
        if (props.isOpenPopup && id) {
            getOrderImageByIdhdr(id);
        }
    }, [props.isOpenPopup])


    const handleSaveData = () => {
        console.log(fileList);
        const listImage: any[] = [];
        if (fileList.length > 0) {
            fileList.forEach((item) => {
                listImage.push({
                    dataImg: item?.url || item?.preview || item?.thumbUrl,
                })
            })
        }
        const dataSave = {
            orderHdrId: id,
            orderImages: listImage
        }
        saveOrderImage(dataSave, id);
    }

    const onChangeData = (file: any) => {
        setFileList(file);
    }




    return (
        <Modal
            title="Ảnh đính kèm"
            visible={props.isOpenPopup}
            width={1000}
            onOk={() => props.setIsOpenPopup(false)}
            onCancel={() => props.setIsOpenPopup(false)}
            footer={[
                <Button className="custom-btn1 btn-outline-success" icon={<CheckCircleOutlined />} key="back" type="primary" onClick={() => handleSaveData()}>
                    Đồng ý
                </Button>,
                <Button className="custom-btn1 btn-outline-secondary" icon={<ExportOutlined />} key="submit" type="primary" onClick={() => props.setIsOpenPopup(false)}>
                    Đóng
                </Button>
            ]}
            destroyOnClose
        >
            <>
                <ImageEdit data={orderImage} handleChangeData={(file: any) => onChangeData(file)} />
            </>

        </Modal>
    )


};
type Props = {
    isOpenPopup: boolean;
    id: string;
    setIsOpenPopup: (isOpenPopup: boolean) => void;
}

export default UpLoadImage;


