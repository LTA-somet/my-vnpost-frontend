import type { AppLogEntity } from '@/services/client';

export default (action: (id: number, record: AppLogEntity) => React.ReactNode) => [
  {
    title: 'Hệ thống',
    dataIndex: 'system',
    key: 'system',
  },
  {
    title: 'Tài khoản',
    dataIndex: 'createdBy',
    key: 'createdBy',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdDate',
    key: 'createdDate',
  },
  {
    title: 'URL',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: 'Thời gian thực thi (ms)',
    dataIndex: 'executeTime',
    key: 'executeTime',
  },
  {
    title: 'Status Code',
    dataIndex: 'statusCode',
    key: 'statusCode',
    align: 'center',
    render: (cell: number) => <b style={{ color: cell === 200 ? 'green' : 'red' }}>{cell}</b>,
  },
  {
    title: 'Thành công',
    dataIndex: 'success',
    key: 'success',
    render: (cell: number) => <b style={{ color: cell ? 'green' : 'red' }}>{cell ? 'Thành công' : 'Thất bại'}</b>,
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Tác vụ',
    dataIndex: 'id',
    align: 'center',
    width: '80px',
    key: 'id',
    fixed: 'right',
    render: (id: number, record: AppLogEntity) => action(id, record),
  },
];
