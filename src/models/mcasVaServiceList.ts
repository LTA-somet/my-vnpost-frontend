import { useCallback, useState } from 'react';
import { notification } from 'antd';
import {
  McasVaServiceDto,
  McasVaServiceApi,
  McasVaServiceSearchDto,
  BdtVaServiceApi,
  BdtVaServiceDto,
} from '@/services/client';
import { updateToDataSource } from '@/utils/dataUtil';

const mcasVaServiceApi = new McasVaServiceApi();
const bdtVaServiceApi = new BdtVaServiceApi();
export default () => {
  const [mcasVaServiceDto, setMcasVaServiceDto] = useState<McasVaServiceDto[]>([]);
  const [listGtgt, setListGtgt] = useState<McasVaServiceDto[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);

  const getAllMcasVasService = useCallback(() => {
    setLoading(true);
    mcasVaServiceApi
      .getAllVaServices()
      .then((resp) => {
        if (resp.status === 200) {
          setMcasVaServiceDto(resp.data);
          setListGtgt(resp.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const searchByParamVasService = useCallback(
    (parameter: McasVaServiceSearchDto, callback?: (success: boolean) => void) => {
      setLoading(true);
      mcasVaServiceApi
        .searchByParamVasService(parameter)
        .then((resp) => {
          if (resp.status === 200) {
            setMcasVaServiceDto(resp.data);
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
    (id: string, record: McasVaServiceDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      mcasVaServiceApi
        .updateMcasVaService(id, record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            setMcasVaServiceDto(updateToDataSource(mcasVaServiceDto, resp.data, 'vaServiceId'));
          }
        })
        .finally(() => setSaving(false));
    },
    [mcasVaServiceDto],
  );

  const updateIsDisplay = useCallback(
    (id: string, display: boolean, callback?: (success: boolean) => void) => {
      setSaving(true);
      mcasVaServiceApi
        .updateIsDisplay(id, display)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            setMcasVaServiceDto(updateToDataSource(mcasVaServiceDto, resp.data, 'vaServiceId'));
          }
        })
        .finally(() => setSaving(false));
    },
    [mcasVaServiceDto],
  );

  const insertItem = useCallback(
    (id: string, record: BdtVaServiceDto, callback?: (success: boolean) => void) => {
      setSaving(true);
      bdtVaServiceApi
        .insertItemBdtVaService(id, record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            // setMcasVaServiceDto(updateToDataSource(mcasVaServiceDto, resp.data, 'vaServiceId'));
          }
        })
        .finally(() => setSaving(false));
    },
    [mcasVaServiceDto],
  );

  return {
    isLoading,
    isSaving,
    mcasVaServiceDto,
    listGtgt,

    searchByParamVasService,
    updateRecord,
    updateIsDisplay,
    insertItem,
    getAllMcasVasService,
  };
};
