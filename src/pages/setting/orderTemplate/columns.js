import { formatCurrency } from '@/utils';
export const columns = [
  { title: 'STT', dataIndex: 'stt' },
  { title: 'Nội dung', dataIndex: 'orderContent' },
  { title: 'Người gửi', dataIndex: 'senderName' },
  { title: 'Người nhận', dataIndex: 'receiverName' },
  { title: 'Hàng hóa', dataIndex: 'nameVi' },
  {
    title: 'Khối lượng',
    dataIndex: 'weight',
    render: (item, record, index) => (
      <>
        <div style={{ textAlign: 'right' }}>{formatCurrency(record?.weight)}</div>
      </>
    ),
  },
  { title: 'Dịch vụ chuyển phát', dataIndex: 'serviceName' },
  { title: 'Dịch vụ cộng thêm', dataIndex: 'vaCodeName' }, //nam trong vat
  {
    title: 'Hình thức gửi hàng',
    dataIndex: 'sendType',
    render: (t, r) => (
      <>
        {r.sendType == '1' || 'TGTN'
          ? 'Thu gom tận nơi'
          : r.sendType == '2' || 'GHTBC'
          ? 'Giao hàng tận bưu cục'
          : ''}
      </>
    ),
  },
  {
    title: 'Yêu cầu khi phát hàng',
    dataIndex: 'deliveryRequire',
    render: (t, r) => (
      <>
        {r.deliveryRequire == '1'
          ? 'Không cho xem hàng'
          : r.deliveryRequire == '2'
          ? 'Cho xem hàng'
          : ''}
      </>
    ),
  },
];
