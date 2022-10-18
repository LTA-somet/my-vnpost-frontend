import type { MenuDto } from '@/services/client';
import { MenuApi } from '@/services/client';
import { addToDataSource, deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
import { useCallback, useState } from 'react';

const menuApi = new MenuApi();
export default () => {
  const [dataSource, setDataSource] = useState<MenuDto[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);

  const reload = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    menuApi
      .findAllMenu()
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
    (record: MenuDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      menuApi
        .createMenu(record)
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
    (id: string, record: MenuDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      menuApi
        .updateMenu(id, record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            setDataSource(updateToDataSource(dataSource, resp.data, 'menuCode'));
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const deleteRecord = useCallback(
    (id: string, callback?: (success: boolean) => void) => {
      setSaving(true);
      menuApi
        .deleteMenu(id)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 204);
          }
          if (resp.status === 204) {
            setDataSource(deleteFromDataSource(dataSource, id, 'menuCode'));
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
