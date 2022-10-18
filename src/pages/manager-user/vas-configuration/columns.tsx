import type { McasVaServiceDto } from '@/services/client';
import { Checkbox } from 'antd';

export default (action: (id: any, record: McasVaServiceDto) => React.ReactNode, onChangeIsDisplay: (record: McasVaServiceDto, checked: any) => void) => [
  {
    title: 'Mã GTGT',
    dataIndex: 'vaServiceId',
    key: 'vaServiceId',
  },
  {
    title: 'Nhóm GTGT',
    dataIndex: 'extend',
    key: 'extend',
    render: (cell: boolean, record: McasVaServiceDto) => <span>{record.extend === true ? 'Yêu cầu bổ sung' : 'Dịch vụ công thêm'}</span>
  },
  {
    title: 'Tên GTGT',
    dataIndex: 'vaServiceName',
    key: 'vaServiceName',
  },
  {
    title: 'Tên GTGT hiển thị trên MYVNP',
    dataIndex: 'vaServiceNameVnp',
    key: 'vaServiceNameVnp',
  },
  {
    title: 'Ẩn/Hiện trên MYVNP',
    dataIndex: 'display',
    key: 'display',
    align: 'center',
    render: (cell: boolean) => cell ? 'Có' : 'Không',
    // render: (cell: boolean, record: McasVaServiceDto) => <Checkbox checked={cell} onChange={e => onChangeIsDisplay(record, e.target.checked)} />

  },
  {
    title: 'Hành động',
    dataIndex: 'vaServiceId',
    align: 'center',
    width: '100px',
    key: 'vaServiceId',
    render: (vaServiceId: any, record: McasVaServiceDto) => action(vaServiceId, record),
  },
];
