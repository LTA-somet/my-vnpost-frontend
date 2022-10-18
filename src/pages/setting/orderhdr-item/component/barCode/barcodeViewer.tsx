import { Modal } from "antd";
import Barcode from "react-barcode";

const BarcodeViewer = (props: Props) => {

    return (
        <Modal
            title="BarCode"
            visible={props.isOpenPopup}
            width={500}
            onOk={() => props.setIsOpenPopup(false)}
            onCancel={() => props.setIsOpenPopup(false)}
            footer={null}
        >
            <div
                style={{
                    textAlign: 'center'
                }}
            >
                <Barcode
                    //   ref={svgRef}
                    value={props.itemCode}
                    displayValue={true}
                    height={90}
                    format="CODE128"
                    font="Avenir Next"
                    fontOptions="600"
                    textMargin={4}
                    margin={0}
                />
            </div>

        </Modal>
    )


};
type Props = {
    isOpenPopup: boolean;
    itemCode: string;
    setIsOpenPopup: (isOpenPopup: boolean) => void;
}

export default BarcodeViewer;


