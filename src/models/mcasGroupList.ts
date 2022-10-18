import { McasGroupDto, McasGroupApi, McasMenuByGroupPermissionAllDto } from '@/services/client';
import { addToDataSource, deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
import { notification } from 'antd';
import { useCallback, useState } from 'react';
import { APPCODE, MCAS_GROUP_STATUS_DEACTIVE } from './../core/contains';
import { McasMenuApi } from './../services/client/api';

const groupApi = new McasGroupApi();
const mcasMenuApi = new McasMenuApi();
export default () => {
  const [dataSource, setDataSource] = useState<McasGroupDto[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [dataTreeList, setDataTreeList] = useState<McasMenuByGroupPermissionAllDto[]>([]);

  const reload = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    groupApi
      .findAllGroup()
      .then((resp) => {
        if (resp.status === 200) {
          //console.log('fffffffffffffffffffff', resp.data);
          setDataSource(resp.data.sort((a, b) => (a.appCode! > b.groupCode! ? 1 : -1)));
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const createRecord = useCallback(
    (record: McasGroupDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      groupApi
        .insertItemMcasGroup(record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          reload();
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const updateRecord = useCallback(
    (groupCode: string, record: McasGroupDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      record.appCode = APPCODE;
      record.status = 1;
      groupApi
        .updateItemMcasGroup(record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            reload();
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const deleteRecord = useCallback(
    (record: McasGroupDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      record.appCode = APPCODE;
      record.status = MCAS_GROUP_STATUS_DEACTIVE;
      groupApi
        .updateItemMcasGroup(record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 204);
          }
          reload();
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const loadTreeGroup = useCallback((groupCode: string) => {
    mcasMenuApi
      .getMenuByGroupPermissionAll(APPCODE, groupCode)
      .then((resp) => {
        if (resp.status === 200) {
          setDataTreeList(resp.data);
        }
      })
      .finally(() => setSaving(false));
  }, []);

  const saveMenuTree = useCallback(
    (selectedKeys: string, groupCode: string, callback?: (success: boolean) => void) => {
      //console.log('CAL API server insertGroupPermission: ', selectedKeys);
      groupApi
        .insertGroupPermission(selectedKeys, groupCode)
        .then((resp) => {
          if (resp.status === 200) {
            //setDataTreeList(resp);
            notification.success({
              message: 'Lưu dữ liệu thành công',
            });
            //console.log('3..3.3..loadTreeGroup: loadTreeGroup', resp);
          } else {
            notification.error({
              message: 'Lưu dữ liệu không thành công! ' + resp.data,
            });
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setSaving(false));
    },
    [],
  );

  return {
    dataSource,
    reload,
    isLoading,
    isSaving,
    deleteRecord,
    createRecord,
    updateRecord,
    dataTreeList,
    loadTreeGroup,
    saveMenuTree,
  };
};
