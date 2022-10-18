import { StatisticCreatedAccountSearchDto } from "@/services/client";
import { Tag } from "antd";

export default [
  {
    title: 'Mã KH CMS',
    dataIndex: 'orgCode',
    key: 'orgCode',
  },
  {
    title: 'Tài khoản',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Họ tên',
    dataIndex: 'fullName',
    key: 'fullName',
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Đơn vị quản lý',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdDate',
    key: 'createdDate',
  },
  {
    title: 'User VNPOST tạo',
    dataIndex: 'isExternal',
    key: 'isExternal',
    // render: (cell: boolean) => cell ? 'Có' : 'Không'
    render: (cell: boolean, record: StatisticCreatedAccountSearchDto) => <span>{record.isExternal === '1' ? 'Có' : 'Không'}</span>
  },
];
