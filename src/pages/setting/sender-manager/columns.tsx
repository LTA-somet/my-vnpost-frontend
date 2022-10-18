import { useAdministrativeUnitList, useCurrentUser } from "@/core/selectors";
import type { ContactDto } from "@/services/client";
import { Checkbox } from 'antd';

export default (action: (id: any, record: ContactDto) => React.ReactNode, onChangeIsDefault: (record: ContactDto, checked: any) => void) => {
  const addressFromStore = useAdministrativeUnitList();
  const currentUser = useCurrentUser();
  const columns: any[] = [

    {
      title: 'STT',
      key: 'index',
      align: 'center',
      width: '60px',
      render: (text: any, record: any[], index: any) => index + 1,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (id: any, record: ContactDto) => (
        <>
          {record.phone}
        </>
      )
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (id: any, record: ContactDto) => (
        <>
          {record.address},
          {addressFromStore.communeList.find(commune => commune.code === record.communeCode)?.name},
          {addressFromStore.districtList.find(district => district.code === record.districtCode)?.name},
          {addressFromStore.provinceList.find(province => province.code === record.provinceCode)?.name}
        </>
      )
    },
    {
      title: 'Mặc định',
      align: 'center',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (cell: boolean, record: ContactDto) => <Checkbox disabled={record.owner !== currentUser.uid} checked={cell} onChange={e => onChangeIsDefault(record, e.target.checked)} />
    },
    {
      title: 'Tác vụ',
      dataIndex: 'contactId',
      align: 'center',
      width: '80px',
      key: 'contactId',
      render: (contactId: any, record: ContactDto) => action(contactId, record),

    },
  ];
  return columns
} 
