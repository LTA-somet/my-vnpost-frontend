import type { DmMauinDto } from '@/services/client';
import { DmMauInApi } from '@/services/client';
import { addToDataSource, deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
import { useCallback, useState } from 'react';

const dmMauinApi = new DmMauInApi();
export default () => {
  const [dataSource, setDataSource] = useState<DmMauinDto[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);

  const reload = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    dmMauinApi
      .findAllDmMauIn()
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
    (record: DmMauinDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      dmMauinApi
        .createDmMauIn(record)
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
    (id: string, record: DmMauinDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      dmMauinApi
        .updateDmMauIn(id, record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            setDataSource(updateToDataSource(dataSource, resp.data, 'mauinCode'));
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const deleteRecord = useCallback(
    (id: string, callback?: (success: boolean) => void) => {
      setSaving(true);
      dmMauinApi
        .deleteDmMauIn(id)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 204);
          }
          if (resp.status === 204) {
            setDataSource(deleteFromDataSource(dataSource, id, 'mauinCode'));
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
