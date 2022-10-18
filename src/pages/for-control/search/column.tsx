
export const Columns = [
    {
        title: "STT",
        render: (item, record, index) => (
            <>
                {index + 1}
            </>
        )
        // key: (index: any) => ({ index })
    },
    { title: "Mã khách hàng", dataIndex: "customerCode", key: "customerCode" },
    {
        title: "Kỳ đối soát",
        render: (item: any, record: any) => (
            <p style={{ margin: 'auto' }}>{record?.dateFrom}-{record?.dateTo}</p>
        ),
        dataIndex: "dateFrom", key: "dateFrom"
    },
    {
        title: "Tình trạng",
        dataIndex: "status",
        render: (item: any, record: any) => (
            <>{record?.status == 1 ? "Đã xác nhận" : "Chưa xác nhận"} </>
        ),
        key: "status"
    },
    { title: "Người import", dataIndex: "fullname", key: "fullname" },
    { title: "Ngày import", dataIndex: "createdDate", key: "createdDate" },
    {
        title: "Tiền COD import",
        dataIndex: "totalCodAmount",
        render: (item: any, record: any) => (
            <p style={{ textAlign: 'right', margin: 'auto' }}>{Intl.NumberFormat('de-DE').format(Math.trunc(parseInt(record.totalCodAmount)))} </p>
        ),
        key: "totalCodAmount"
    },
    {
        title: "Tiền cước import",
        dataIndex: "totalFee",
        render: (item: any, record: any) => (
            <p style={{ textAlign: 'right', margin: 'auto' }}>{Intl.NumberFormat('de-DE').format(Math.trunc(parseInt(record.totalFee)))} </p>
        ),
        key: "totalFee"
    },
    {
        title: "Tiền COD khách hàng xác nhận",
        dataIndex: "totalCodConfirm",
        key: "totalCodConfirm",
        render: (item: any, record: any) => (
            <p style={{ textAlign: 'right', margin: 'auto' }}>{Intl.NumberFormat('de-DE').format(Math.trunc(parseInt(record.totalCodConfirm)))} </p>
        ),
    },
    {
        title: "Tiền cước khách hàng xác nhận",
        dataIndex: "totalFeeConfirm",
        key: "totalFeeConfirm",
        render: (item: any, record: any) => (
            <p style={{ textAlign: 'right', margin: 'auto' }}>{Intl.NumberFormat('de-DE').format(Math.trunc(parseInt(record.totalFeeConfirm)))} </p>
        ),
    },
]