export default (action: (id: any, record: any) => React.ReactNode, onChangeSelectBox: (id: any, record: any) => void) => {
  const columns: any[] = [
    {
      title: 'STT',
      key: 'index',
      align: 'center',
      width: '60px',
      render: (text: any, record: any[], index: any) => index + 1,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'accntCode',
      key: 'accntCode',
    },
    {
      title: 'Từ địa bàn',
      dataIndex: 'accntName',
      key: 'accntName',
    },
    {
      title: 'Mã khách hàng (CMS)',
      dataIndex: 'customerCode',
      key: 'customerCode',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Số hợp đồng',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
    },
    {
      title: 'Nhóm dịch vụ đồng giá',
      dataIndex: 'serviceGroupSameprice',
      key: 'serviceGroupSameprice',
      render: (key: any, record: any) => onChangeSelectBox(key, record),
    },
    {
      title: 'Dịch vụ chuyển phát',
      dataIndex: 'serviceCode',
      key: 'serviceCode',
    },
    {
      title: 'Hành động',
      dataIndex: 'key',
      align: 'center',
      width: '200px',
      key: 'contactId',
      render: (key: any, record: any) => action(key, record),

    },
  ]
  return columns;
}
