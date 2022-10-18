import type { DmNotifyDto } from '@/services/client';
import { DmNotifyApi } from '@/services/client';
import { addToDataSource, deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
import { useCallback, useState } from 'react';

const dmNotifyApi = new DmNotifyApi();
export default () => {
  const [dataSource, setDataSource] = useState<DmNotifyDto[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);

  const reload = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    dmNotifyApi
      .findAllDmNotify()
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
    (record: DmNotifyDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      dmNotifyApi
        .createDmNotify(record)
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
    (id: string, record: DmNotifyDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      dmNotifyApi
        .updateDmNotify(id, record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            setDataSource(updateToDataSource(dataSource, resp.data, 'notifyCode'));
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const deleteRecord = useCallback(
    (id: string, callback?: (success: boolean) => void) => {
      setSaving(true);
      dmNotifyApi
        .deleteDmNotify(id)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 204);
          }
          if (resp.status === 204) {
            setDataSource(deleteFromDataSource(dataSource, id, 'notifyCode'));
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
