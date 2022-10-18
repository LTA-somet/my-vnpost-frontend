import { McasGroupDto, McasMenuByGroupPermissionAllDto, McasUserApi } from '@/services/client';
import { addToDataSource, deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
import { notification } from 'antd';
import { useCallback, useState } from 'react';
import { APPCODE } from './../core/contains';
import {
  McasMenuApi,
  McasUserDto,
  McasOrganizationStandardApi,
  McasOrganizationStandardDto,
} from './../services/client/api';

const mcasUserApi = new McasUserApi();
const mcasOrganizationStandardApi = new McasOrganizationStandardApi();

export default () => {
  const [dataSourceGroup, setDataSourceGroup] = useState<McasGroupDto[]>([]);
  const [dataSourceGroupUser, setDataSourceGroupUser] = useState<McasGroupDto[]>([]);
  const [dataSourceUsers, setDataSourceUsers] = useState<McasUserDto[]>([]);
  const [dataSourceOrgTree, setDataSourceOrgTree] = useState<McasOrganizationStandardDto[]>([]);

  const [isLoading, setLoading] = useState<boolean>(false);

  const searchUser = useCallback(
    (
      username: string,
      employeename: string,
      orgCode: string,
      iShowChild: number,
      pageindex: number,
      totalPage: number,
      callback?: (success: boolean) => void,
    ) => {
      //console.log('CAL API search', orgCode);
      setLoading(true);
      mcasUserApi
        .searchForAssign(iShowChild, pageindex, totalPage, username, '', employeename, orgCode)
        .then((resp) => {
          console.log('resp.....', resp.data.result);
          if (resp.status === 200) {
            setDataSourceUsers(resp.data.result);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const selectGroupInUserGroupByUser = useCallback(
    (record: McasUserDto, callback?: (success: boolean) => void) => {
      setLoading(true);
      mcasUserApi
        .selectGroupInUserGroupByUser(APPCODE, record.username, 0, 10000)
        .then((resp) => {
          if (resp.status === 200) {
            const data = resp.data.result.map((group) => {
              return {
                ...group,
                key: group.groupCode,
              };
            });
            setDataSourceGroupUser(data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const selectGroupNotInUserGroupByUser = useCallback(
    (record: McasUserDto, callback?: (success: boolean) => void) => {
      setLoading(true);
      mcasUserApi
        .selectGroupNotInUserGroupByUser(APPCODE, record.username, '', 0, 10000)
        .then((resp) => {
          if (resp.status === 200) {
            console.log('Data:', resp.data.result);
            const data = resp.data.result
              ?.filter((d) => d.isInternalUser === true)
              .map((group) => {
                return {
                  ...group,
                  key: group.groupCode,
                };
              });
            setDataSourceGroup(data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const updateGroup = useCallback(
    (record: McasUserGroupDto, callback?: (success: boolean) => void) => {
      //console.log('updateGroup->record', record);
      setLoading(true);
      //record.appCode = APPCODE;
      mcasUserApi
        .updateGroup(record)
        .then((resp) => {
          if (resp.status === 200) {
            notification.info({ message: 'Gán quyền thành công' });
          }
          //   if (callback) {
          //     callback(resp.status === 201);
          //   }
          //   if (resp.status === 201) {
          //     reload();
          //   }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const selectChildren = useCallback((orgCode: string, callback?: (success: boolean) => void) => {
    setLoading(true);
    mcasOrganizationStandardApi
      .selectChildren(true)
      .then((resp) => {
        if (resp.status === 200) {
          setDataSourceOrgTree(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  //   const deleteRecord = useCallback(
  //     (record: McasGroupDto, callback?: (success: boolean) => void) => {
  //       setSaving(true);
  //       record.appCode = APPCODE;
  //       record.status = MCAS_GROUP_STATUS_DEACTIVE;
  //       groupApi
  //         .updateItemMcasGroup(record)
  //         .then((resp) => {
  //           if (callback) {
  //             callback(resp.status === 204);
  //           }
  //           reload();
  //         })
  //         .finally(() => setSaving(false));
  //     },
  //     [dataSource],
  //   );

  //   const loadTreeGroup = useCallback((groupCode: string) => {
  //     mcasMenuApi
  //       .getMenuByGroupPermissionAll(APPCODE, groupCode)
  //       .then((resp) => {
  //         if (resp.status === 200) {
  //           setDataTreeList(resp.data);
  //         }
  //       })
  //       .finally(() => setSaving(false));
  //   }, []);

  return {
    dataSourceUsers,
    dataSourceGroup,
    dataSourceGroupUser,
    dataSourceOrgTree,
    searchUser,
    selectGroupInUserGroupByUser,
    selectGroupNotInUserGroupByUser,
    updateGroup,
    selectChildren,
    isLoading,
  };
};
