export default () => [
    {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        width: 80,
        render: (text: any, record: any[], index: any = 0) => index + 1,
    },
    {
        title: 'Tên quận/ huyện',
        dataIndex: 'districtName',
        key: 'districtName',
    },
    {
        title: 'Tên phường xã',
        dataIndex: 'communeName',
        key: 'communeName',
    },
    {
        title: 'Chi tiết',
        dataIndex: 'quarantineNote',
        key: 'quarantineNote',
    },
    {
        title: 'Tình trạng',
        dataIndex: 'typeName',
        key: 'typeName',
    },
    {
        title: 'DV tạm dừng',
        dataIndex: 'services',
        key: 'services',
    },
    {
        title: 'Hàng hóa tạm dừng',
        dataIndex: 'commoditiesReject',
        key: 'commoditiesReject',
    },
    {
        title: 'Dịch vụ chấp nhận',
        dataIndex: 'servicesAcceptance',
        key: 'servicesAcceptance',
    }
];