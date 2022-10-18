import type { AccountReplaceDto } from '@/services/client';

export default (action: (id: any, record: AccountReplaceDto) => React.ReactNode) => {
  const columns: any[] = [
    // {
    //   title: 'STT',
    //   key: 'index',
    //   align: 'center',
    //   width: '60px',
    //   render: (text: any, record: any[], index: any) => index + 1,
    // },
    {
      title: 'Mã khách hàng CMS',
      dataIndex: 'cmsCode',
      key: 'cmsCode',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'cmsName',
      key: 'cmsName',
    },
    {
      title: 'Số hợp đồng',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
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
