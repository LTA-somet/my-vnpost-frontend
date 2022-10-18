import { useCategoryAppParamList } from "@/core/selectors";
import type { CollectionOrderDto } from "@/services/client";
import { formatStart0 } from "@/utils/PhoneUtil";
import moment from "moment";

export default (showCollectionDetail: (id: string, record: CollectionOrderDto) => void) => {
  const STATUS = useCategoryAppParamList().filter((c) => c.type === 'LIST_STATUS_COLL_ORD')
  const columns: any[] = [
    {
      title: 'STT',
      key: 'index',
      align: 'center',
      width: '60px',
      render: (text: any, record: any[], index: any) => index + 1,
    },
    {
      title: 'Mã tin',
      dataIndex: 'collectionRequestCode',
      key: 'collectionRequestCode',
      render: (collectionRequestCode: string, record: CollectionOrderDto) => <a title="Xem chi tiết tin thu gom" onClick={() => showCollectionDetail(collectionRequestCode, record)}> {collectionRequestCode} </a>
    },
    {
      title: 'Người gửi',
      dataIndex: 'senderName',
      key: 'senderName',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'senderPhone',
      key: 'phone',
      render: (senderPhone: string) => formatStart0(senderPhone)
    },
    {
      title: 'Thời gian thu gom',
      dataIndex: 'collectionDate',
      key: 'collectionDate',
      render: (collectionDate: any, record: CollectionOrderDto) => moment(record.collectionDate).format('DD-MM-YYYY') + " " + record.collectionTime
    },
    {
      title: 'Trạng thái thực hiện',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => STATUS.find(s => s.value === status)?.name
    },
    {
      title: 'Bưu tá thực hiện',
      dataIndex: 'collecterName',
      key: 'collecterName',
    },
    {
      title: 'Số điện thoại bưu tá',
      dataIndex: 'collecterPhone',
      key: 'collecterPhone',
    },
  ]
  return columns;
}
