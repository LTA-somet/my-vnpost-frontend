import type { McasGroupDto } from '@/services/client';
import { Checkbox, Tag } from 'antd';

export default (action: (id: any, record: McasGroupDto) => React.ReactNode) => [
    {
        title: 'Mã nhóm',
        dataIndex: 'groupCode',
        key: 'groupCode',
    },
    {
        title: 'Tên nhóm',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Đối tượng',
        dataIndex: 'isInternalUser',
        key: 'isInternalUser',
        render: (cell: boolean, row: McasGroupDto) => {
            if (row.isInternalUser == 1) {
                return (<Tag color={'green'}>
                    {'Nội bộ'}
                </Tag>);
            } else
                return (<Tag color={'volcano'}>
                    {'Khách hàng'}
                </Tag>);
        }
    },
    {
        title: 'Tác vụ',
        dataIndex: 'status',
        align: 'center',
        width: '80px',
        key: 'status',
        render: (groupCode: any, record: McasGroupDto) => action(groupCode, record),
    },
];
