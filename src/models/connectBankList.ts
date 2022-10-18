import {
  UserBankAccountApi,
  UserBankAccountDto,
  UserBankAccountSearchDto,
} from '@/services/client';
import { addToDataSource, deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
import { useCallback, useState } from 'react';

const userBankAccountApi = new UserBankAccountApi();
export default () => {
  const [dataSource, setDataSource] = useState<UserBankAccountDto[]>([]);
  const [dataFilter, setDataFilter] = useState<UserBankAccountDto[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);

  const reloadApproval = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    userBankAccountApi
      .findAllByPaginationApproval()
      .then((resp) => {
        if (resp.status === 200) {
          setDataSource(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const reloadDeclare = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    userBankAccountApi
      .findAllByPaginationDeclare()
      .then((resp) => {
        if (resp.status === 200) {
          setDataSource(resp.data);
          setDataFilter(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const createRecord = useCallback(
    (record: UserBankAccountDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      userBankAccountApi
        .createUserBankAccount(record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            setDataSource(addToDataSource(dataSource, resp.data));
            reloadDeclare();
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const updateRecord = useCallback(
    (id: number, record: UserBankAccountDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      userBankAccountApi
        .updateUserBankAccount(id, record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            setDataSource(updateToDataSource(dataSource, resp.data, 'accountId'));
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const deleteRecord = useCallback(
    (id: number, callback?: (success: boolean) => void) => {
      setSaving(true);
      userBankAccountApi
        .deleteUserBankAccount(id)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 204);
          }
          if (resp.status === 204) {
            setDataSource(deleteFromDataSource(dataSource, id, 'accountId'));
            reloadDeclare();
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const searchDeclare = useCallback(
    (parameter: UserBankAccountSearchDto, callback?: (success: boolean) => void) => {
      setLoading(true);
      userBankAccountApi
        .searchByParameterDeclare(parameter)
        .then((resp) => {
          if (resp.status === 200) {
            setDataSource(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [dataSource],
  );

  const approvalRecord = useCallback(
    (id: number, record: UserBankAccountDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      userBankAccountApi
        .approval(id, record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            setDataSource(updateToDataSource(dataSource, resp.data, 'accountId'));
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const searchApproval = useCallback(
    (parameter: UserBankAccountSearchDto, callback?: (success: boolean) => void) => {
      setLoading(true);
      userBankAccountApi
        .searchByParameterApprove(parameter)
        .then((resp) => {
          if (resp.status === 200) {
            setDataSource(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [dataSource],
  );

  return {
    dataSource,
    dataFilter,
    reloadApproval,
    reloadDeclare,
    isLoading,
    isSaving,
    deleteRecord,
    createRecord,
    updateRecord,
    searchDeclare,
    approvalRecord,
    searchApproval,
  };
};
