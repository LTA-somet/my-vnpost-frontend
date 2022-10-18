export const nameColumn = [{}];
/*Chi tiết hàng hóa*/
export const columnOrderDetails = [
  {
    title: 'STT',
    render: (item: any, record: any, index: number) => <>{index + 1}</>,
  },
  { title: 'Sản phẩm', dataIndex: 'nameVi' },
  { title: 'Khối lượng(gram)', dataIndex: 'weight' },
  { title: 'Số lượng', dataIndex: 'quantity' },
  {
    title: 'Hình ảnh',
    dataIndex: 'image',
    width: 50,
    maxWidth: 50,
    render: (t: any, r: any) => (
      <>
        <img alt="example" style={{ width: '100px' }} src={`${r.image}`} />
      </>
    ),
  },
];

/*Lịch sử hiệu chỉnh*/
export const columnCorrectionHistorys = (action: (caseId: any, record: any) => void) => [
  {
    title: 'STT',
    render: (item: any, record: any, index: number) => <>{index + 1}</>,
  },
  {
    title: 'Mã yêu cầu hiệu chỉnh',
    dataIndex: 'caseId',
    render: (caseId: any, record: any) => <a onClick={() => action(caseId, record)}> {record?.caseId}</a>
  },

  { title: 'Loại hiệu chỉnh', dataIndex: 'typeName' },
  { title: 'Thời gian hiệu chỉnh', dataIndex: 'createdDate' },
  { title: 'Người hiệu chỉnh', dataIndex: 'fullName' },
  { title: 'Trạng thái xử lý', dataIndex: 'statusName' },
];

/*Yêu cầu hỗ trợ*/
export const columnRequetSupport = (action: (record: any) => void) => [
  {
    title: 'STT',
    render: (item: any, record: any, index: number) => <>{index + 1}</>,
  },
  {
    title: 'Mã yêu cầu hỗ trợ',
    dataIndex: 'ttkCode',
    key: 'ttkCode',
    render: (item: any, record: any) => <a onClick={() => action(record)}> {record?.ttkCode}</a>
  },
  { title: 'Loại yêu cầu', dataIndex: 'reasonName', key: 'reasonName' },
  { title: 'Ngày yêu cầu', dataIndex: 'createdDate', key: 'createdDate' },
  { title: 'Người yêu cầu', dataIndex: 'createdUser', key: 'createdUser' },
  { title: 'Trạng thái xử lý', dataIndex: 'ttkStatusName', key: 'ttkStatusName' },
];
