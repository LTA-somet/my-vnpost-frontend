import { SearchOutlined } from '@ant-design/icons';
import { Tag, Input } from 'antd';
import { NotifyManagerDto } from '../../../services/client/api';

export default (action: (id: any, record: NotifyManagerDto) => React.ReactNode) => [
    {
        title: 'Mã thông báo',
        dataIndex: 'notifyCode',
        key: 'notifyCode',
    },
    {
        title: 'Thông báo',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'createdDate',
        key: 'createdDate',
    },
    {
        title: 'Ngày cập nhật',
        dataIndex: 'datetime',
        key: 'datetime',
    },
    {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Điện thoại',
        dataIndex: 'telePhone',
        key: 'telePhone',
    },
    {
        title: 'Loại thông báo',
        dataIndex: 'notifyGroupName',
        key: 'notifyGroupName',
    },
    {
        title: 'Tình trạng',
        dataIndex: 'type',
        key: 'type',
        render: (cell: boolean, row: NotifyManagerDto) => {
            console.log('row ', row);
            if (row.type === 1) {
                return (<Tag color={'green'}>
                    {'Đã đọc'}
                </Tag>);
            } else
                return (<Tag color={'volcano'}>
                    {'Chưa đọc'}
                </Tag>);
        }
    },
    {
        title: 'Tác vụ',
        dataIndex: 'id',
        align: 'center',
        width: '80px',
        render: (id: any, record: NotifyManagerDto) => action(id, record),
    },
];
