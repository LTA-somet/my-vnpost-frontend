// "ttkCode": "250000348084",
// "createdDate": "18/08/2021",
// "ttkReason": "147",
// "reasonName": "02-Hỗ trợ phát",
// "ttkStatus": 3,
// "ttkStatusName": "Chưa xử lý",
// "accntCode": null,
// "parcelId": "250000LA009",
// "ttkContent": "250000LA009",
// "ttkAttachment": null,
// "actResult": null,
// "docName": null,
// "actContent": null,
// "amount": null,
// "ttkSource": 12,
// "strImage": null,
// "createdUser": "250000_lananh2"

export const Columns = [
    {
        title: "STT",
        render: (item, record, index) => (
            <>{index + 1}</>
        )
    },
    { title: "Mã yêu cầu", dataIndex: "ttkCode", key: "ttkCode" },
    { title: "Ngày tạo", dataIndex: "createdDate", key: "createdDate" },
    { title: "Loại", dataIndex: "reasonName", key: "reasonName" },
    { title: "Số hiệu bưu gửi", dataIndex: "parcelId", key: "parcelId" },
    { title: "Người nhận", dataIndex: "updatedUser", key: "updatedUser" },
    { title: "Trạng thái xử lý", dataIndex: "ttkStatusName", key: "ttkStatusName" },
]