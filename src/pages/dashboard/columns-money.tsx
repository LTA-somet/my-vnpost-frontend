import { formatNumber } from "@/utils";

export default (paymentStatus: string) => {
    const columns: any[] = [
        {
            title: 'Số hiệu bưu gửi',
            dataIndex: 'itemCode',
            key: 'itemCode',
            align: 'left',
        },
        {
            title: 'Người nhận',
            dataIndex: 'receiverName',
            key: 'receiverName',
            align: 'left',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'receiverPhone',
            key: 'receiverPhone',
            align: 'left',
        },
        {
            title: 'Tiền thực thu',
            dataIndex: 'codAmount',
            key: 'codAmount',
            align: 'right',
            render: (cell: string) => formatNumber(cell) + ' đ'
        }
    ]
    if (paymentStatus === '2') {
        columns.push({
            title: 'Ngày trả tiền',
            dataIndex: 'payoutDate',
            key: 'payoutDate',
            align: 'right'
        })
    }
    if (paymentStatus === '1') {
        columns.push({
            title: 'Ngày thu tiền',
            dataIndex: 'payinDate',
            key: 'payinDate',
            align: 'right'
        })
    }
    return columns;
}
    ;
