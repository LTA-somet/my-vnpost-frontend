import {
  AccountApi,
  AccountDto,
  McasEmployeeApi,
  McasEmployeeDto,
  RegisterDto,
  UomApi,
} from '@/services/client';
import { addToDataSource, deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
import { notification } from 'antd';
import { useCallback, useState } from 'react';

const accountApi = new AccountApi();
export default () => {
  const [dataSource, setDataSource] = useState<AccountDto[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);

  const reload = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    accountApi
      .findAllSubEmployee()
      .then((resp) => {
        if (resp.status === 200) {
          setDataSource(resp.data.sort((a, b) => (a.accountCode! > b.accountCode! ? 1 : -1)));
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const createRecord = useCallback(
    (record: RegisterDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      accountApi
        .createSubAccount(record)
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
    (username: string, record: AccountDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      accountApi
        .updateSubAccount(username, record)
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
    (id: string, callback?: (success: boolean) => void) => {
      setSaving(true);
      accountApi
        .deleteSubEmployee(id)
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

  const lockRecord = useCallback(
    (username: string, locked: boolean, callback?: (success: boolean) => void) => {
      setSaving(true);
      accountApi
        .lockSubEmployee(username, locked)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 200);
          }
          if (resp.status === 200) {
            notification.success({
              message: locked ? 'Khoá tài khoản thành công' : 'Mở khoá tài khoản thành công',
            });
            reload();
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const changePass = useCallback(
    (username: string, password: string, callback?: (success: boolean) => void) => {
      setSaving(true);
      accountApi
        .changePassSubAccount(username, password)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 200);
          }
          if (resp.status === 200) {
            notification.success({
              message: 'Thay đổi mật khẩu thành viên thành công',
            });
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
    lockRecord,
    changePass,
  };
};
