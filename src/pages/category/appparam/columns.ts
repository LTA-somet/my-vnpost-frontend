import type { DmAppParamDto } from '@/services/client';

export default (action: (id: any, record: DmAppParamDto) => React.ReactNode) => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'TYPE',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'VALUE',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
  },
  {
    title: 'DESCRIPTION',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Tác vụ',
    dataIndex: 'id',
    align: 'center',
    width: '80px',
    key: 'id',
    render: (id: any, record: DmAppParamDto) => action(id, record),
  },
];
