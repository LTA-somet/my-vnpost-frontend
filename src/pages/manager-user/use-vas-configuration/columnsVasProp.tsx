import type { VasPropsDto } from '@/services/client';
import { Checkbox } from 'antd';

export default (actionVasProp: (id: any, record: VasPropsDto) => React.ReactNode, actionVasPropShow: (checked: any, record: VasPropsDto) => void) => [
  {
    title: 'Mã thuộc tính - PROP',
    dataIndex: 'propCode',
    key: 'propCode',
  },
  {
    title: 'Tên thuộc tính - PROP',
    dataIndex: 'propName',
    key: 'propName',
    // render: (cell: boolean, record: VasPropsDto) => <span>{record.extend === true ? 'Yêu cầu bổ sung' : 'Dịch vụ công thêm'}</span>
  },
  // {
  //   title: 'Giá trị thuộc tính - PROP',
  //   dataIndex: 'dataType',
  //   key: 'dataType',
  //   align: 'right',
  //   render: (dataType: any, record: VasPropsDto) => actionVasProp(dataType, record),
  // },
  {
    title: 'Tên PROP hiển thị trên MYVNP',
    dataIndex: 'description',
    key: 'description',
    align: 'center',
    render: (description: any, record: VasPropsDto) => actionVasProp(description, record),
  },
  {
    title: 'Ẩn/Hiện trên MYVNP',
    dataIndex: 'show',
    key: 'show',
    align: 'center',
    // render: (cell: boolean, record: VasPropsDto) => <Checkbox checked={cell} onChange={e => onChangeShow(record, e.target.checked)} />
    render: (show: any, record: VasPropsDto) => actionVasPropShow(show, record),
  },
  // {
  //   title: 'Hành động',
  //   dataIndex: 'propCode',
  //   align: 'center',
  //   width: '100px',
  //   key: 'propCode',
  //   render: (propCode: any, record: VasPropsDto) => actionVasProp(propCode, record),
  // },
];
