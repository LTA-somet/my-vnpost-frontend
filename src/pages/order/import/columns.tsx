import type { AccountDto, OrderContentDto, OrderHdrDto } from '@/services/client';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

export default (action: (id: any, record: any) => React.ReactNode) => [
  {
    title: 'Mã đơn hàng',
    dataIndex: 'saleOrderCode',
    key: 'saleOrderCode',
  },
  {
    title: 'Người nhận',
    dataIndex: 'receiverName',
    key: 'receiverName',
  },
  {
    title: 'Hàng hoá',
    dataIndex: 'orderContents',
    key: 'orderContents',
    render: (cell: OrderContentDto[]) => {
      return cell.length > 0 && cell.map(c => c.nameVi).reduce((a, b) => a + ", " + b);
    }
  },
  {
    title: 'Dịch vụ',
    dataIndex: 'serviceCode',
    key: 'serviceCode',
  },
  {
    title: 'Thu hộ COD',
    dataIndex: 'codAmount',
    key: 'codAmount',
  },
  {
    title: 'Tổng cước',
    dataIndex: 'totalFee',
    key: 'totalFee',
    render: (cell: string, row: OrderHdrDto) => {
      return (row.totalFee ?? 0);
    }
  },
  {
    title: 'Tình trạng',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: (cell: number, row: OrderHdrDto) => {
      if ([-1, 0, 1].includes(cell)) {
        return <CheckCircleOutlined style={{ fontSize: 18, color: 'green' }} />;
      }
      if ([-2].includes(cell)) {
        return <Tooltip title={row.warnings?.length === 0 ? '' : row.warnings!.reduce((a, b) => a + ", " + b)}>
          <WarningOutlined style={{ fontSize: 18, color: 'orange' }} />
        </Tooltip>;
      }
      if ([-3, -4].includes(cell)) {
        return <Tooltip title={row.errors?.length === 0 ? '' : row.errors!.reduce((a, b) => a + ", " + b)}>
          <CloseCircleOutlined style={{ fontSize: 18, color: 'red' }} />
        </Tooltip>;
      }
      return "Lỗi";
    }
  },
  // {
  //   title: 'In/Chưa in',
  //   dataIndex: 'isPrinted',
  //   key: 'isPrinted',
  //   render: (cell: string, row: OrderHdrDto) => row.isPrinted ? 'Đã in' : 'Chưa in'
  // },
  {
    title: 'Hành động',
    dataIndex: 'username',
    align: 'center',
    width: '100px',
    key: 'username',
    render: (username: any, record: AccountDto) => action(username, record),
  },
];
