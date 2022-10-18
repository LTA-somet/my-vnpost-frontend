import type { DmAppParamDto } from '@/services/client';
import { DmAppParamApi } from '@/services/client';
import { addToDataSource, deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
import { useCallback, useState } from 'react';

const dmAppParamApi = new DmAppParamApi();
export default () => {
  const [dataSource, setDataSource] = useState<DmAppParamDto[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);

  const reload = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    dmAppParamApi
      .findAllDmAppParam()
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

  const createRecord = useCallback(
    (record: DmAppParamDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      dmAppParamApi
        .createDmAppParam(record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            setDataSource(addToDataSource(dataSource, resp.data));
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const updateRecord = useCallback(
    (id: number, record: DmAppParamDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      dmAppParamApi
        .updateDmAppParam(id, record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            setDataSource(updateToDataSource(dataSource, resp.data, 'id'));
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const deleteRecord = useCallback(
    (id: number, callback?: (success: boolean) => void) => {
      setSaving(true);
      dmAppParamApi
        .deleteDmAppParam(id)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 204);
          }
          if (resp.status === 204) {
            setDataSource(deleteFromDataSource(dataSource, id, 'id'));
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  return {
    dataSource,
    reload,
    isLoading,
    isSaving,
    deleteRecord,
    createRecord,
    updateRecord,
  };
};
