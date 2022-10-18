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
      title: 'Đơn vị',
      dataIndex: 'areaFromName',
      key: 'areaFromName',
    },
    {
      title: 'Tên định tuyến',
      dataIndex: 'routerName',
      key: 'routerName',
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdByName',
      key: 'createdByName',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'updatedByName',
      key: 'updatedByName',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedDate',
      key: 'updatedDate',
    },
    {
      title: 'Hành động',
      dataIndex: 'key',
      align: 'center',
      width: '200px',
      key: 'contactId',
      render: (key: any, record: any, index: number) => action(index, record),

    },
  ]
  return columns;
}
