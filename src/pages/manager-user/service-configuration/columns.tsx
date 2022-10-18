import type { McasServiceDto } from '@/services/client';
import { Checkbox } from 'antd';

export default (action: (id: any, record: McasServiceDto) => React.ReactNode) => [
  // , onChangeIsDisplay: (record: McasServiceDto, checked: any) => void
  {
    title: 'Mã SPDV',
    dataIndex: 'mailServiceId',
    key: 'mailServiceId',
  },
  {
    title: 'Nhóm dịch vụ MYVNP',
    dataIndex: 'myvnpServiceGroupId',
    key: 'myvnpServiceGroupId',
    // render: (cell: string, record: McasServiceDto) => <span >{cell === record.myvnpServiceGroupId && record.myvnpMailServiceName}</span>,
  },
  {
    title: 'Tên SPDV',
    dataIndex: 'mailServiceName',
    key: 'mailServiceName',
  },
  {
    title: 'Tên SPDV hiển thị trên MYVNP',
    dataIndex: 'myvnpMailServiceName',
    key: 'myvnpMailServiceName',
  },
  {
    title: 'Ẩn/Hiện trên MYVNP',
    dataIndex: 'isDisplay',
    key: 'isDisplay',
    align: 'center',
    render: (cell: boolean) => cell ? 'Có' : 'Không',
    // render: (cell: boolean, record: McasServiceDto) => <Checkbox checked={cell} />
    // onChange={e => onChangeIsDisplay(record, e.target.checked)} 
  },
  {
    title: 'Hiển thị cho khách lẻ?',
    dataIndex: 'isRetailCustomer',
    key: 'isRetailCustomer',
    align: 'center',
    render: (cell: boolean) => cell ? 'Có' : 'Không',
    // render: (cell: boolean, record: McasServiceDto) => <Checkbox checked={cell} />
  },
  {
    title: 'Thứ tự hiển thị',
    dataIndex: 'orderNum',
    key: 'orderNum',
    align: 'center',
  },
  {
    title: 'Hành động',
    dataIndex: 'mailServiceId',
    align: 'center',
    width: '100px',
    key: 'mailServiceId',
    render: (mailServiceId: any, record: McasServiceDto) => action(mailServiceId, record),
  },
];
