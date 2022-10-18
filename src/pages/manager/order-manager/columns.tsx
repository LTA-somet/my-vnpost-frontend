
import { useAdministrativeUnitList } from "@/core/selectors";
import type { DmFeildDisplayEntity, OrderHdrDisplayDto, OrderStatusDto } from "@/services/client";
import { formatNumber } from "@/utils";


export default (
  listDmFeildDisplay: DmFeildDisplayEntity[] = [],
  colCodeList: any[],
  listOrderStatus: OrderStatusDto[],
  isTypeOrder: string,
  page: number,
  pageSize: number,
  action: (id: any, record: OrderHdrDisplayDto) => React.ReactNode,
  showOrderDetail: (id: any, record: OrderHdrDisplayDto) => React.ReactNode
) => {
  const addressFromStore = useAdministrativeUnitList();
  let col = colCodeList;
  if (!colCodeList) {
    col = ['senderName', 'receiverName']
  }
  const columns: any[] = listDmFeildDisplay.filter(f => col.includes(f.colCode!))
    .map(f => ({
      title: f.colName,
      key: f.colCode,
      dataIndex: f.colCode,
      // render: f.render ? eval('') : undefined
    }))
  columns.unshift(
    {
      title: 'STT',
      key: 'index',
      align: 'center',
      width: '60px',
      render: (text: any, record: any[], index: any) => page * pageSize + index + 1,
    },
    {
      title: isTypeOrder === '3' ? 'Mã đơn hàng' : 'Mã vận đơn',
      dataIndex: 'orderHdrId',
      key: 'orderHdrId',
      render: (orderHdrId: any, record: OrderHdrDisplayDto) => showOrderDetail(orderHdrId, record),
    },
  )

  for (let index = 0; index < columns.length; index++) {
    if (columns[index].key === 'receiverName') {
      columns[index] = {
        title: 'Người nhận',
        dataIndex: 'receiverName',
        key: 'receiverName',
        render: (_orderHdrId: any, record: OrderHdrDisplayDto) =>
          <>
            <span className='ant-tree-node-content-wrapper ant-tree-node-content-wrapper-open'>{record.receiverName} {record.receiverPhone ? ` - ${record.receiverPhone}` : ''}</span><br /> Địa chỉ: {record.receiverAddress},{' '}
            {addressFromStore.communeList.find(commune => commune.code === record.receiverCommuneCode)?.name},{' '}
            {addressFromStore.districtList.find(district => district.code === record.receiverDistrictCode)?.name},{' '}
            {addressFromStore.provinceList.find(province => province.code === record.receiverProvinceCode)?.name}
          </>,
      }
    }
    if (columns[index].key === 'senderName') {
      columns[index] = {
        title: 'Người gửi',
        dataIndex: 'senderName',
        key: 'senderName',
        render: (_orderHdrId: any, record: OrderHdrDisplayDto) =>
          <>
            <span className='ant-tree-node-content-wrapper ant-tree-node-content-wrapper-open'>{record.senderName} {record.senderPhone ? ` - ${record.senderPhone}` : ''}</span><br /> Địa chỉ: {record.senderAddress},{' '}
            {addressFromStore.communeList.find(commune => commune.code === record.senderCommuneCode)?.name},{' '}
            {addressFromStore.districtList.find(district => district.code === record.senderDistrictCode)?.name},{' '}
            {addressFromStore.provinceList.find(province => province.code === record.senderProvinceCode)?.name}
          </>,
      }
    }
    if (columns[index].key === 'isPrinted') {
      columns[index] = {
        title: 'In/Chưa in',
        dataIndex: 'isPrinted',
        key: 'isPrinted',
        render: (isPrinted: any) => {
          if (isPrinted) {
            return 'Đã in'
          }
          else {
            return 'Chưa in'
          }
        }
      }
    }
    if (columns[index].key === 'totalFee') {
      columns[index] = {
        title: 'Tổng cước',
        dataIndex: 'totalFee',
        key: 'totalFee',
        align: 'right',
        render: (totalFee: number, record: any) => {
          if (record.contractC && isTypeOrder === '4') {
            return formatNumber(totalFee)
          }
          else if (!record.contractC && isTypeOrder === '4') {
            return ''
          }
          else {
            if (totalFee) {
              return formatNumber(totalFee)
            }
            else {
              return '0'
            }
          }
        }
      }
    }
    if (columns[index].key === 'codAmount') {
      columns[index] = {
        title: 'Tổng tiền thu hộ',
        dataIndex: 'codAmount',
        key: 'codAmount',
        align: 'right',
        render: (codAmount: number) => {
          if (codAmount) {
            return formatNumber(codAmount)
          } else {
            return ''
          }
        }
      }
    }
  }

  columns.push(
    {
      title: 'Hành động',
      dataIndex: 'orderHdrId',
      align: 'center',
      width: '100px',
      key: 'orderHdrId',
      render: (orderHdrId: any, record: OrderHdrDisplayDto) => action(orderHdrId, record),

    }
  )

  if (isTypeOrder === '4') {
    return columns.filter(f => !(['batchCode', 'createdName', 'ownerName', 'isPrinted'].includes(f.key)))
  }
  else if (isTypeOrder === '3') {
    return columns.filter(f => !(['statusName', 'isPrinted', 'saleOrderCode'].includes(f.key)))
  }
  else {
    return columns;
  }

}



//   [
//   {
//     title: 'STT',
//     key: 'index',
//     align: 'center',
//     width: '60px',
//     render: (text: any, record: any[], index: any) => index + 1,
//   },
//   {
//     title: 'Mã đơn hàng',
//     dataIndex: 'orderCode',
//     key: 'orderCode',
//   },
//   {
//     title: 'Mã vận đơn',
//     dataIndex: 'orderHdrId',
//     key: 'orderHdrId',
// render: (orderHdrId: any) => <Link to={'/manager/order-manager/' + orderHdrId}> Link xem chi tiết </Link>

  //   },
  //   {
  //     title: 'Lô vận đơn',
  //     dataIndex: 'lo',
  //     key: 'lo',
  //   },
  //   {
  //     title: 'Người gửi',
  //     dataIndex: 'senderName',
  //     key: 'senderName',
  //   },
  //   {
  //     title: 'Người nhận',
  //     dataIndex: 'receiverName',
  //     key: 'receiverName',
  //   },
  //   {
  //     title: 'Ngày tạo',
  //     dataIndex: 'createdDate',
  //     key: 'createdDate',
  //   },
  //   {
  //     title: 'Người tạo',
  //     dataIndex: 'createdBy',
  //     key: 'createdBy',
  //   },
  //   {
  //     title: 'Người ủy quyền',
  //     dataIndex: 'owner',
  //     key: 'owner',
  //   },
  //   {
  //     title: 'Tổng tiền nhờ thu',
  //     dataIndex: 'codAmount',
  //     key: 'codAmount',
  //   },
  //   {
  //     title: 'Tổng cước',
  //     dataIndex: 'vasFee',
  //     key: 'vasFee',
  //   },
  //   {
  //     title: 'Trạng thái',
  //     dataIndex: 'status',
  //     key: 'status',
  //   },
  //   {
  //     title: 'In/Chưa in [v]',
  //     dataIndex: 'isDefault',
  //     key: 'isDefault',
  //   },
  //   {
  //     title: 'Tác vụ',
  //     dataIndex: 'orderHdrId',
  //     align: 'center',
  //     width: '80px',
  //     key: 'orderHdrId',
  //     render: (orderHdrId: any, record: OrderHdrDisplayDto) => action(orderHdrId, record),

  //   },
  // ];
