import type { AccountReplaceDto } from '@/services/client';

export default (action: (id: any, record: AccountReplaceDto) => React.ReactNode) => {
  const columns: any[] = [
    {
      title: 'STT',
      key: 'index',
      align: 'center',
      width: '60px',
      render: (text: any, record: any[], index: any) => index + 1,
    },
    {
      title: 'Mã TK nhập thay thế',
      dataIndex: 'accReplace',
      key: 'accReplace',
    },
    {
      title: 'Tên người nhập thay thế',
      dataIndex: 'accReplaceName',
      key: 'accReplaceName',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'accOrgName',
      key: 'accOrgName',
    },
    {
      title: 'Tác vụ',
      dataIndex: 'id',
      align: 'center',
      width: '80px',
      key: 'contactId',
      render: (id: any, record: AccountReplaceDto) => action(id, record),

    },
  ]
  return columns;
}
