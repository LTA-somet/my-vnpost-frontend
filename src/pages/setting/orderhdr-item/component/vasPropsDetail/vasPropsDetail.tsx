import { useModel } from 'umi';
import { Modal, Table, Row, Col } from "antd";
import { useEffect } from "react";
import './styles.css';
import { isBuffer } from 'lodash';
const VasPropsDetail = (props: Props) => {

    const { vasPropsDetail, getVasPropsDetail } = useModel('orderDetailsList');

    const idHdr = props.orderHdrid;
    const isExt = props.isExtend;
    useEffect(() => {
        if (idHdr) {
            getVasPropsDetail(idHdr, undefined);
        }
    }, []);

    return (
        <Modal
            title={isExt == 0 ? "Dịch vụ cộng thêm" : "Chi tiết GTGT"}
            visible={props.isOpenPopup}
            width={1000}
            onOk={() => props.setIsOpenPopup(false)}
            onCancel={() => props.setIsOpenPopup(false)}
            footer={null}
        >
            {vasPropsDetail.map((value) => {
                return (
                    value?.isExtend == isExt ?
                        <Row >
                            {value.stt == 1 ?
                                <Col span={24} className="row-parent">{value.vaServiceName}</Col>
                                :
                                <Col span={24} className="row-child">{value.propName} :  {value.propValue} </Col>
                            }

                        </Row>
                        : null
                )
            })}
        </Modal>
    )


};
type Props = {
    isOpenPopup: boolean;
    orderHdrid: string;
    isExtend: number;
    setIsOpenPopup: (isOpenPopup: boolean) => void;
}

export default VasPropsDetail;


