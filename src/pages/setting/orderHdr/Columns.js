export const nameColumn =[{
    
}]
/*Chi tiết hàng hóa*/
export const columnOrderDetails = [
    { title : "STT", dataIndex : "stt"},
    { title : "Sản phẩm" , dataIndex: "nameVi"},
    { title : "Khối lượng(gram)" , dataIndex: "weight"},
    { title : "Số lượng" , dataIndex: "quantity"},
    {
        title: 'Hình ảnh',
        dataIndex: 'image',
        width: 50,
        maxWidth: 50,
        render: (t, r) =>  <>
            <img alt="example" style={{ width: '100px' }} src={`${r.image}`} />
        </>
        
        // <img alt="example" style={{ width: '100px' }} src={`${r.image}`} />
    //   <img src={`${r.image}`} />
    }
];

/*Lịch sử hiệu chỉnh*/
export const columnCorrectionHistorys = [
    { title : "STT", dataIndex : "stt"},
    { title : "Mã yêu cầu hiệu chỉnh" , dataIndex: "orderContent"},
    { title : "Loại hiệu chỉnh" , dataIndex: "orderContent"},
    { title : "Ngày hiệu chỉnh" , dataIndex: "orderContent"},
    { title : "Người hiệu chỉnh" , dataIndex: "orderContent"}, 
    { title : "Trạng thái xử lý" , dataIndex: "orderContent"}, 
];

/*Yêu cầu hỗ trợ*/
export const columnRequetSupport = [
    { title : "STT", dataIndex : "stt"},
    { title : "Mã yêu cầu hỗ trợ" , dataIndex: "orderContent"},
    { title : "Loại yêu cầu" , dataIndex: "orderContent"},
    { title : "Ngày yêu cầu" , dataIndex: "orderContent"},
    { title : "Người yêu cầu" , dataIndex: "orderContent"}, 
    { title : "Trạng thái xử lý" , dataIndex: "orderContent"}, 
];

