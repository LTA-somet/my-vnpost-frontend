import { PartnerCategoryApi, PartnerCategoryDto } from '@/services/client';
import { addToDataSource, deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
import { useCallback, useState } from 'react';

const partnerCategoryApi = new PartnerCategoryApi();
export default () => {
  const [dataSource, setDataSource] = useState<PartnerCategoryDto[]>([]);
  const [dataConfigWebhook, setDataConfigWebhook] = useState<PartnerCategoryDto>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);

  const reload = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    partnerCategoryApi
      .getAllByIsEmployee()
      .then((resp) => {
        if (resp.status === 200) {
          // setDataSource(resp.data.filter((e) => e.status === 1));
          setDataSource(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const reloadConfigWebhook = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    partnerCategoryApi
      .getAllByNotIsEmployee()
      .then((resp) => {
        if (resp.status === 200) {
          setDataConfigWebhook(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const createRecord = useCallback(
    (record: PartnerCategoryDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      partnerCategoryApi
        .createPartnerCategory(record)
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
    (id: number, record: PartnerCategoryDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      partnerCategoryApi
        .updatePartnerCategory(id, record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            setDataSource(updateToDataSource(dataSource, resp.data, 'partnerId'));
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const updateDeActivate = useCallback(
    (record: PartnerCategoryDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      partnerCategoryApi
        .updateDeActive(record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            // setDataSource(updateToDataSource(dataSource, resp.data, 'partnerCode'));
            reload();
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const updateConfigWebhook = useCallback(
    (record: PartnerCategoryDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      partnerCategoryApi
        .updateConfigWebhook(record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            // setDataSource(updateToDataSource(dataSource, resp.data, 'partnerCode'));
            reload();
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const deleteRecord = useCallback(
    (id: number, callback?: (success: boolean) => void) => {
      setSaving(true);
      partnerCategoryApi
        .deletePartnerCategory(id)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 204);
          }
          if (resp.status === 204) {
            setDataSource(deleteFromDataSource(dataSource, id, 'partnerId'));
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
    updateDeActivate,
    updateConfigWebhook,
    reloadConfigWebhook,
    dataConfigWebhook,
  };
};
