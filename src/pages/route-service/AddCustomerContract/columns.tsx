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
      title: 'Địa bàn',
      dataIndex: 'areaFromName',
      key: 'areaFromName',
    },
    {
      title: 'Mã khách hàng CMS',
      dataIndex: 'customerCode',
      key: 'customerCode',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Số hợp đồng',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
    },
    {
      title: 'Tác vụ',
      dataIndex: 'key',
      align: 'center',
      width: '80px',
      key: 'contactId',
      render: (key: any, record: any) => action(key, record),

    },
  ]
  return columns;
}
