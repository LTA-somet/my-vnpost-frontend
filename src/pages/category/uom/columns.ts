import type { McasUomDto } from '@/services/client';

export default (action: (id: any, record: McasUomDto) => React.ReactNode) => [
  {
    title: 'Mã',
    dataIndex: 'uomId',
    key: 'uomId',
  },
  {
    title: 'Tên',
    dataIndex: 'uomName',
    key: 'uomName',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'created',
    key: 'created',
  },
  {
    title: 'Ngày cập nhật',
    dataIndex: 'updated',
    key: 'updated',
  },
  {
    title: 'Tác vụ',
    dataIndex: 'uomId',
    align: 'center',
    width: '80px',
    key: 'uomId',
    render: (uomId: any, record: McasUomDto) => action(uomId, record),
  },
];
