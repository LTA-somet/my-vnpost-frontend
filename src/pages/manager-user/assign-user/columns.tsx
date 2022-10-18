import type { McasGroupDto } from '@/services/client';
import { McasUserDto } from './../../../services/client/api';
import { Tag } from 'antd';

export default (action: (id: any, record: McasUserDto) => React.ReactNode) => [
    {
        title: 'Mã người dùng',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: 'Tên người dùng',
        dataIndex: 'notifyList',
        key: 'notifyList',
    },
    {
        title: 'Đơn vị',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: '100px',
        key: 'status',
        render: (cell: boolean, row: McasUserDto) => {
            if (row.status == 1) {
                return (<Tag color={'green'}>
                    {'Đang hoạt động'}
                </Tag>);
            } else
                return (<Tag color={'volcano'}>
                    {'Ngừng hoạt động'}
                </Tag>);
        }
    },
    {
        title: 'Tác vụ',
        dataIndex: 'status',
        align: 'center',
        width: '80px',
        key: 'status',
        render: (username: any, record: McasUserDto) => action(username, record),
    },
];
