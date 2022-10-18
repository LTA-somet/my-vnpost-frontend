import React, { useState, useEffect } from 'react';
import OrderHdrViewer from "./orderHdrViewer";
import OrderReceived from "./orderReceived";
import UpLoadImage from './component/upload-picture/upLoadImage';
import ShowImage from './component/upload-picture/showImage';
export default () => {
    const [showModelUploadImage, setShowModelUploadImage] = useState(true);
    return (

        <div>
            {/* <OrderHdrViewer orderHdrid="e6ee86ddb8bd418b9e0b3a859a3a1dfa" /> */}
            <OrderReceived orderHdrid="0fde5ecf00e14f8f895464fd4a38616f" />
            {/* <UpLoadImage isOpenPopup={showModelUploadImage} setIsOpenPopup={setShowModelUploadImage} id="48f4ee25cedd438fb0a6bde4a7465959" /> */}
            {/* <ShowImage isOpenPopup={showModelUploadImage} setIsOpenPopup={setShowModelUploadImage} id="35e887ebe8c447b99163ceaddbf6c3ff" /> */}
        </div>

    )
}