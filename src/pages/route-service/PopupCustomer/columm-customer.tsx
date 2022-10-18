export default () => {
    const columns: any[] = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            width: '40px',
            render: (text: any, record: any[], index: any) => index + 1,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'accntTel1',
            key: 'accntTel1',
            width: '100px',
        },
        {
            title: 'Mã khách hàng',
            dataIndex: 'customerCode',
            key: 'customerCode',
            width: '120px',
        },
        {
            title: 'Mã CRM',
            dataIndex: 'systemCustomerId',
            key: 'systemCustomerId',
            width: '120px',

        },
        {
            title: 'Mã gợi nhớ',
            dataIndex: 'reminderCode',
            key: 'reminderCode',
            width: '120px',
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
            width: '160px',
        },
        {
            title: 'Số hợp đồng',
            dataIndex: 'contractNumber',
            key: 'contractNumber',
            width: '120px',
        },
        {
            title: 'Ngày hiệu lực',
            dataIndex: 'contractSignDate',
            key: 'contractSignDate',
            width: '100px',
        },
        {
            title: 'Ngày hết hiệu lực',
            dataIndex: 'contractValidDate',
            key: 'contractValidDate',
            width: '100px',
        },
        {
            title: 'Mã đơn vị quản lý',
            dataIndex: 'managedOrg',
            key: 'managedOrg',
            width: '60px',
        },

        {
            title: 'Tên đơn vị quản lý',
            dataIndex: 'managedOrgName',
            key: 'managedOrgName',
            width: '120px',
        }
    ]
    return columns;
}