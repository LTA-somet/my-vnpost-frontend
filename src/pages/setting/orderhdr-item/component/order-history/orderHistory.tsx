import { useModel } from 'umi';
import { Modal, Space, Table, Button, Divider } from "antd";
import { useEffect } from "react";
import { Columns, ColumnsDelivery } from './colums';

const OrderHistory = (props: Props) => {
    const { orderHistory, deliveryHistory, postMan, postmanPickUpInfo, getOrderHistory, getDeliveryHistory, getPostmanInfo, getPostmanPickUpInfo } = useModel('orderDetailsList');

    const itemCode = props.itemCode;
    useEffect(() => {
        if (itemCode && props.isOpenPopup == true) {
            getOrderHistory(itemCode);
            getDeliveryHistory(itemCode);
            getPostmanInfo(itemCode);
            if (props.type == "1") {
                getPostmanPickUpInfo(itemCode);
            }
        }
    }, [props.isOpenPopup]);
    return (
        <Modal
            bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
            title={"Hành trình đơn hàng " + props.itemCode}
            visible={props.isOpenPopup}
            width={1000}
            onOk={() => props.setIsOpenPopup(false)}
            onCancel={() => props.setIsOpenPopup(false)}
            footer={null}
        >
            {props.type == "1" ?
                <>
                    <table>
                        <th className="span-font">Bưu tá thu gom: &nbsp; </th>
                        <td className="span-font">{postmanPickUpInfo && postmanPickUpInfo?.ListValue ? postmanPickUpInfo?.ListValue[0]?.PostmanName + " - " + postmanPickUpInfo?.ListValue[0]?.PostmanTel : ''}</td>
                    </table>
                    <Divider />
                </>
                : null
            }
            <table>
                <th className="span-font">Bưu tá phát hàng: &nbsp; </th>
                <td className="span-font">{postMan && postMan?.ListValue ? postMan?.ListValue[0]?.PostmanName + " - " + postMan?.ListValue[0]?.PostmanTel : ''}</td>
            </table>
            <Divider />

            <p className="span-font" style={{ fontWeight: 'bold', fontSize: '14px' }}>Thông tin trạng thái</p>
            <Table
                bordered
                columns={Columns}
                dataSource={orderHistory}
                // pagination={true}
                pagination={{ pageSize: 5 }}
                size='small'
            />
            <p className="span-font" style={{ fontWeight: 'bold', fontSize: '14px' }}>Thông tin phát</p>
            <Table
                bordered
                columns={ColumnsDelivery}
                dataSource={deliveryHistory}
                pagination={{ pageSize: 5 }}
                rowKey="STT"
                size="small"

            />
        </Modal>

    )
}

type Props = {
    isOpenPopup: boolean;
    itemCode: string;
    type: string; //1: đon hang gui , 4 đơn hàng nhan
    setIsOpenPopup: (isOpenPopup: boolean) => void;

}
export default OrderHistory;