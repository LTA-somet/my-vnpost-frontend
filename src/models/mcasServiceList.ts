import { useCallback, useState } from 'react';
import { notification } from 'antd';
import { McasServiceDto, McasServiceApi } from '@/services/client';
import { updateToDataSource } from '@/utils/dataUtil';

const mcasServiceApi = new McasServiceApi();
export default () => {
  const [mcasServiceDto, setMcasServiceDto] = useState<McasServiceDto[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);

  //Danh muc mcas_service
  const getAllMcasService = useCallback(() => {
    setLoading(true);
    mcasServiceApi
      .getAllByStatus()
      .then((resp) => {
        if (resp.status === 200) {
          setMcasServiceDto(resp.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const searchByParamService = useCallback(
    (parameter: McasServiceDto, callback?: (success: boolean) => void) => {
      setLoading(true);
      mcasServiceApi
        .searchByParamService(parameter)
        .then((resp) => {
          if (resp.status === 200) {
            setMcasServiceDto(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const updateItem = useCallback(
    (record: McasServiceDto, callback?: (success: boolean) => void) => {
      setLoading(true);
      mcasServiceApi
        .updateItemMcasService(record)
        .then((resp) => {
          if (resp.status === 200) {
            notification.success({ message: 'Cập nhật thành công !' });
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const updateRecord = useCallback(
    (id: string, record: McasServiceDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      mcasServiceApi
        .updateMcasService(id, record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            setMcasServiceDto(updateToDataSource(mcasServiceDto, resp.data, 'mailServiceId'));
          }
        })
        .finally(() => setSaving(false));
    },
    [mcasServiceDto],
  );

  return {
    isLoading,
    isSaving,
    mcasServiceDto,

    searchByParamService,
    updateRecord,
    getAllMcasService,
  };
};
