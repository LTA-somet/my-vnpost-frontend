import type { McasOrganizationStandardDto } from '@/services/client';

export default () => [
  {
    title: 'Mã bưu cục',
    dataIndex: 'unitCode',
    key: 'unitCode',
    width: '150px',
  },
  {
    title: 'Tên bưu cục',
    dataIndex: 'unitName',
    key: 'unitName',
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    key: 'address',
  },
];
