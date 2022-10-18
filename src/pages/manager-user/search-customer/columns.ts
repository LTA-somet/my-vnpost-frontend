import type { AccountDto } from '@/services/client';

export default (action: (id: any, record: AccountDto) => React.ReactNode) => [
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
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (cell: boolean, row: AccountDto) => {
      if (cell) {
        return 'Đang  hoạt động';
      }
      if (row.verifyPhone && row.verifyEmail) {
        return "Ngừng hoạt động";
      }
      return "Chưa xác minh";
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
