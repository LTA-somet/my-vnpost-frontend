export default (action: (id: any, record: any) => React.ReactNode, onChangeSelectBox: (id: any, record: any, key: any) => void) => {
  const columns: any[] = [
    {
      title: 'STT',
      key: 'customerId',
      align: 'center',
      width: 30,
      render: (text: any, record: any[], index: any) => index + 1,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'areaFromName',
      key: 'areaFromName',
      width: 150,
      render: (id: any, record: any) => <p>{record?.areaFromCode + "-" + record?.areaFromName}</p>,
    },
    // {
    //   title: 'Từ địa bàn',
    //   dataIndex: 'areaToName',
    //   key: 'areaToName',
    //   width: 150,
    // },
    {
      title: 'Mã khách hàng (CMS)',
      dataIndex: 'customerCode',
      key: 'customerCode',
      width: 150,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
    },
    {
      title: 'Số hợp đồng',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
      width: 100,
    },
    {
      title: 'Nhóm dịch vụ đồng giá',
      dataIndex: 'serviceGroupSameprice',
      key: 'serviceGroupSameprice',
      width: 150,
      maxWidth: 150,
      render: (id: any, record: any, index: number) => onChangeSelectBox(index, record, 'serviceGroupSameprice'),
    },
    {
      title: 'Dịch vụ chuyển phát',
      dataIndex: 'serviceCode',
      key: 'serviceCode',
      width: 200,
      maxWidth: 200,
      render: (id: any, record: any, index: number) => onChangeSelectBox(index, record, 'serviceCode'),
    },
    {
      title: 'Hành động',
      dataIndex: 'key',
      align: 'center',
      key: 'customerId',
      width: 100,
      render: (key: any, record: any) => action(key, record),

    },
  ]
  return columns;
}
