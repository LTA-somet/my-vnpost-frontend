import type { AccountFindDto, AccountReplaceDto } from '@/services/client/api';
import { AccountReplaceApi } from '@/services/client/api';
import { addToDataSource, deleteFromDataSource } from '@/utils/dataUtil';
import { useCallback, useState } from 'react';

const accountReplaceApi = new AccountReplaceApi();
export default () => {
  const [dataSource, setDataSource] = useState<AccountReplaceDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);

  const searchAllByParam = useCallback(
    (param: AccountFindDto, callback?: (success: boolean) => void) => {
      setIsLoading(true);
      accountReplaceApi
        .findAllByParam(param)
        .then((resp) => {
          if (resp.status === 200) {
            setDataSource(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setIsLoading(false));
    },
    [],
  );

  const onCreate = useCallback(
    (record: AccountReplaceDto, callback?: (success: boolean) => void) => {
      accountReplaceApi.createAccountReplace(record).then((resp) => {
        if (callback) {
          callback(resp.status === 201);
        }
        if (resp.status === 201) {
          setShowEdit(false);
          searchAllByParam({});
        }
      });
    },
    [searchAllByParam],
  );

  const deleteRecord = useCallback(
    (id: number, callback?: (success: boolean) => void) => {
      accountReplaceApi.deleteAccountReplace(id).then((resp) => {
        if (callback) {
          callback(resp.status === 204);
        }
        if (resp.status === 204) {
          setDataSource(deleteFromDataSource(dataSource, id, 'id'));
          // searchAllByParam({});
        }
      });
    },
    [dataSource],
  );
  return {
    searchAllByParam,
    deleteRecord,
    onCreate,
    dataSource,
    showEdit,
    setShowEdit,
    isLoading,
    setIsLoading,
  };
};
