import type { CaseAnhltDto } from "@/services/client";
import { Tag } from "antd";
import { Link } from "umi";


export default (action: (caseId: any, record: CaseAnhltDto) => void) => [
  {
    title: 'STT',
    key: 'index',
    align: 'center',
    width: '60px',
    render: (_text: any, _record: any[], index: any) => index + 1,
  },
  {
    title: 'Mã yêu cầu hiệu chỉnh',
    dataIndex: 'caseId',
    key: 'caseId',
    render: (caseId: any, record: CaseAnhltDto) => <a title="Xem chi tiết hiệu chỉnh" onClick={() => action(caseId, record)}> {caseId} </a>
  },
  {
    title: 'Mã đơn hàng',
    dataIndex: 'saleOrderCode',
    key: 'saleOrderCode',
  },
  {
    title: 'Mã vận đơn',
    dataIndex: 'itemCode',
    key: 'itemCode',
    render: (caseId: any, record: CaseAnhltDto) => <Link to={'/manage/order-manager/sender/' + record.orderHdrId!}> {record.itemCode} </Link>
  },
  {
    title: 'Loại hiệu chỉnh',
    dataIndex: 'caseTypeName',
    key: 'caseTypeName',
  },
  {
    title: 'Thời gian hiệu chỉnh',
    dataIndex: 'createdDate',
    key: 'createdDate',
  },
  {
    title: 'Người hiệu chỉnh',
    dataIndex: 'createdBy',
    key: 'createdBy',
  },
  {
    title: 'Trạng thái hiệu chỉnh',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: (caseId: any, record: CaseAnhltDto) => {
      if (record.status === '0') {
        return (<Tag style={{ width: 100, textAlign: 'center' }} color={'blue'}>
          {'Chờ xử lý'}
        </Tag>);
      }
      if (record.status === '1') {
        return (<Tag style={{ width: 100, textAlign: 'center' }} color={'green'}>
          {'Đã xử lý'}
        </Tag>);
      }
      if (record.status === '2') {
        return (<Tag style={{ width: 100, textAlign: 'center' }} color={'red'}>
          {'Từ chối xử lý'}
        </Tag>);
      }
      else {
        return (
          record.status
        )
      }
    }
  }
];
