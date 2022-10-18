export const Columns = [
    {
        title: "STT",
        render: (item, record, index) => (
            <>
                {index + 1}
            </>
        )
    },
    { title: "Mã khách hàng", dataIndex: "customerCode", key: "customerCode" },
    {
        title: "Kỳ đối soát",
        render: (item: any, record: any) => (
            <>{record?.dateFrom}-{record?.dateTo}</>
        ),
        dataIndex: "dateFrom", key: "dateFrom"
    },
    {
        title: "Tổng GD",
        dataIndex: "totalGD",
        render: (item: any, record: any) => (
            <p style={{ textAlign: 'right', margin: 'auto' }}>{Intl.NumberFormat('de-DE').format(Math.trunc(parseInt(record.totalGD)))} </p>
        ),
        key: "totalGD"
    },
    {
        title: "Tổng cước",
        dataIndex: "totalFee",
        render: (item: any, record: any) => (
            <p style={{ textAlign: 'right', margin: 'auto' }}>{Intl.NumberFormat('de-DE').format(Math.trunc(parseInt(record.totalFee)))} </p>
        ),
        key: "totalFee"
    },
    {
        title: "Tổng COD",
        dataIndex: "totalCODAmount",
        render: (item: any, record: any) => (
            <p style={{ textAlign: 'right', margin: 'auto' }}>{Intl.NumberFormat('de-DE').format(Math.trunc(parseInt(record.totalCODAmount)))} </p>
        ),
        key: "totalCODAmount"
    },
    { title: "Hạn cuối xác nhận", dataIndex: "expriedDate", key: "expriedDate" },
]