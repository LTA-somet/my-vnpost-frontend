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
        title: 'HS Code',
        dataIndex: 'hsCode',
        key: 'hsCode',
    },
    {
        title: 'Tên tiếng việt',
        dataIndex: 'nameVi',
        key: 'nameVi',
    },
    {
        title: 'Tên tiếng anh',
        dataIndex: 'nameEn',
        key: 'nameEn',
    }
];