import type { DmNotifyDto } from '@/services/client';

export default (action: (id: any, record: DmNotifyDto) => React.ReactNode) => [
  {
    title: 'Mã thông báo',
    dataIndex: 'notifyCode',
    key: 'notifyCode',
  },
  {
    title: 'Mã nhóm thông báo',
    dataIndex: 'notifyGroup',
    key: 'notifyGroup',
  },
  {
    title: 'Tên thông báo',
    dataIndex: 'notifyName',
    key: 'notifyName',
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
    dataIndex: 'notifyCode',
    align: 'center',
    width: '80px',
    key: 'notifyCode',
    render: (notifyCode: any, record: DmNotifyDto) => action(notifyCode, record),
  },
];
