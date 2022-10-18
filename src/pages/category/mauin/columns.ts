import type { DmMauinDto } from '@/services/client';

export default (action: (id: any, record: DmMauinDto) => React.ReactNode) => [
  {
    title: 'Mã mẫu inmauin',
    dataIndex: 'mauinCode',
    key: 'mauinCode',
  },
  {
    title: 'Tên mẫu in',
    dataIndex: 'mauinName',
    key: 'mauinName',
  },
  {
    title: 'Người tạo',
    dataIndex: 'createdBy',
    key: 'createdBy',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdDate',
    key: 'createdDate',
  },
  {
    title: 'Người cập nhật',
    dataIndex: 'updatedBy',
    key: 'updatedBy',
  },
  {
    title: 'Ngày cập nhật',
    dataIndex: 'updatedDate',
    key: 'updatedDate',
  },
  {
    title: 'Tác vụ',
    dataIndex: 'mauinCode',
    align: 'center',
    width: '80px',
    key: 'mauinCode',
    render: (mauinCode: any, record: DmMauinDto) => action(mauinCode, record),
  },
];
