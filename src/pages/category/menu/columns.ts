import type { MenuDto } from '@/services/client';

export default (action: (id: any, record: MenuDto) => React.ReactNode) => [
  {
    title: 'Menu code',
    dataIndex: 'menuCode',
    key: 'menuCode',
  },
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'URL',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: 'Nhập thay thế',
    dataIndex: 'forAccountReplace',
    key: 'forAccountReplace',
    render: (cell: boolean) => cell && 'Có',
  },
  {
    title: 'Tác vụ',
    dataIndex: 'menuCode',
    align: 'center',
    width: '80px',
    key: 'menuCode',
    render: (menuCode: any, record: MenuDto) => action(menuCode, record),
  },
];
