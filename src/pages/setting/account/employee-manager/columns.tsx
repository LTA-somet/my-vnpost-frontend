import type { AccountDto } from '@/services/client';
import { Checkbox, Tag } from 'antd';

export default (action: (id: any, record: AccountDto) => React.ReactNode, onLocking: (username: string, locked: boolean) => void) => [
  {
    title: 'Tên người dùng',
    dataIndex: 'fullname',
    key: 'fullname',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
  },
  {
    title: 'Khoá tài khoản',
    dataIndex: 'isLocked',
    key: 'isLocked',
    align: 'center',
    render: (cell: boolean, record: AccountDto) => <Checkbox checked={cell} onChange={e => onLocking(record.username!, e.target.checked)} />
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    align: 'center',
    render: (cell: boolean, row: AccountDto) => {
      if (cell) {
        return (<Tag color={'green'} key={row.accountCode}>
          {'Đang hoạt động'}
        </Tag>);
      }
      if (row.verifyPhone && row.verifyEmail) {
        return (<Tag color={'volcano'} key={row.accountCode}>
          {'Ngừng hoạt động'}
        </Tag>);
      }
      return (<Tag color={'gold'} key={row.accountCode}>
        {'Chưa xác minh'}
      </Tag>);
    }
  },
  {
    title: 'Tác vụ',
    dataIndex: 'username',
    align: 'center',
    width: '80px',
    key: 'username',
    render: (username: any, record: AccountDto) => action(username, record),
  },
];
