import { AppLogLoginDto, AppLogLoginEntity } from "@/services/client";
import { Tag } from "antd";

export default [
  {
    title: 'Mã KH CMS',
    dataIndex: 'orgCode',
    key: 'orgCode',
  },
  // {
  //   title: 'Đơn vị',
  //   dataIndex: 'orgCode',
  //   key: 'orgCode',
  // },
  {
    title: 'Tài khoản',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
  },
  {
    title: 'Tài khoản KH nhập thay thế',
    dataIndex: 'usernameForReplace',
    key: 'usernameForReplace',
  },
  {
    title: 'Là NV VNPOST',
    dataIndex: 'employee',
    key: 'employee',
    // render: (cell: boolean) => cell ? 'Có' : 'Không'
    render: (cell: boolean, record: AppLogLoginDto) => <span>{record.isEmployee === true ? 'Có' : 'Không'}</span>
  },
  {
    title: 'Ngày đăng nhập',
    dataIndex: 'loginDate',
    key: 'loginDate',
  },
  {
    title: 'Kênh đăng nhập',
    dataIndex: 'channel',
    key: 'channel',
    render: (cell: boolean, row: AppLogLoginDto) => {
      if (row.channel === 'ANDROID') {
        return (<Tag color={'green'}>
          {'APP_ANDROID'}
        </Tag>);
      } else if (row.channel === 'IOS') {
        return (<Tag color={'green'}>
          {'APP_IOS'}
        </Tag>);
      } else if (row.channel === 'WEB') {
        return (<Tag color={'green'}>
          {'WEB'}
        </Tag>);
      }
    }
  },
];
