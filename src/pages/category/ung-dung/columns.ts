import type { McasAppDto } from '@/services/client';

export default (action: (id: any, record: McasAppDto) => React.ReactNode) => [
    {
        title: 'Mã',
        dataIndex: 'appCode',
        key: 'appCode',
    },
    {
        title: 'Tên',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Tác vụ',
        dataIndex: 'appCode',
        align: 'center',
        width: '80px',
        key: 'appCode',
        render: (appCode: any, record: McasAppDto) => action(appCode, record),
    },
];
