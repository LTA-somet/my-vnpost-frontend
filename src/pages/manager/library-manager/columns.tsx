import { LibraryTypeDto } from '../../../services/client/api';
import type { LibraryInfoDto } from '@/services/client';
import { Tag } from 'antd';

export default (
  listType: LibraryTypeDto[],
  action: (id: any, record: LibraryInfoDto) => React.ReactNode,
  //action: (id: any, record: LibraryInfoDto) => React.ReactNode,
) => {
  const columns: any[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (text: any, record: any[], index: any = 0) => index + 1,
    },
    {
      title: 'Loại tin',
      dataIndex: 'libraryTypeId',
      key: 'libraryTypeId',
      render: (_libraryTypeId: any, record: LibraryInfoDto) =>
        listType?.map((List) => {
          if (record.libraryTypeId === List.libraryTypeId) {
            return List.typeName;
          } else {
            return null;
          }
        }),
    },
    {
      title: 'Xếp hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (_libraryInfoId: any, record: LibraryInfoDto) => {
        if (record.rank === '1') {
          return 'Phổ biến';
        }
        if (record.rank === '0') {
          return 'Ít phổ biến';
        }
      },
    },
    {
      title: 'Chủ đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Người tạo',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedDate',
      key: 'updatedDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_libraryInfoId: any, record: LibraryInfoDto) => {
        if (record.status === '1') {
          return (<Tag style={{ width: 100, textAlign: 'center' }} color={'green'}>
            {'Hiệu lực'}
          </Tag>);
        }
        if (record.status === '0') {
          return (<Tag color={'red'}>
            {'Ngừng hiệu lực'}
          </Tag>);
        }
      },
    },
    {
      title: 'Tác vụ',
      dataIndex: 'libraryInfoId',
      align: 'center',
      width: '80px',
      key: 'libraryInfoId',
      render: (libraryInfoId: any, record: LibraryInfoDto) => action(libraryInfoId, record),
    },
  ];
  return columns;
};
