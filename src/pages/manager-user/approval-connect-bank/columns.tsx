import type { UserBankAccountDto } from '@/services/client';
import { Tag } from 'antd';

export default (action: (id: any, record: UserBankAccountDto) => React.ReactNode) => [
  {
    title: 'STT',
    key: 'index',
    align: 'center',
    width: '60px',
    render: (text: any, record: any[], index: any) => index + 1,
  },
  {
    title: 'Tài khoản',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
  },
  {
    title: 'Tên tài khoản',
    dataIndex: 'fullName',
    key: 'fullName',
  },
  {
    title: 'Tên ngân hàng',
    dataIndex: 'bankName',
    key: 'bankName',
  },
  {
    title: 'Tên chủ tài khoản NH',
    dataIndex: 'accountName',
    key: 'accountName',
  },
  {
    title: 'Số tài khoản NH',
    dataIndex: 'accountNumber',
    key: 'accountNumber',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'isApprove',
    width: '120px',
    key: 'isApprove',
    render: (cell: boolean, row: UserBankAccountDto) => {
      if (row.isApprove === '1') {
        return (<Tag color={'green'}>
          {'Đã phê duyệt'}
        </Tag>);
      } else
        return (<Tag color={'volcano'}>
          {'Chưa phê duyệt'}
        </Tag>);
    }
  },
  {
    title: 'Tác vụ',
    dataIndex: 'accountId',
    align: 'center',
    width: '80px',
    key: 'accountId',
    render: (accountId: any, record: UserBankAccountDto) => action(accountId, record),
  },
];
