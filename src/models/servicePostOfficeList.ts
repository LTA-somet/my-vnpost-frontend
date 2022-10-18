import { setSearchParams } from './../services/client/common';
import {
  McasOrganizationStandardApi,
  McasOrganizationStandardDto,
  ParamBcPvDto,
  McasOrganizationStandardEntity,
} from './../services/client/api';
import { addToDataSource, deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
import { useCallback, useState } from 'react';

const mcasOrganizationStandardApi = new McasOrganizationStandardApi();
export default () => {
  // const [dataSource, setDataSource] = useState<McasOrganizationStandardDto[]>([]);
  const [dataSource, setDataSource] = useState<McasOrganizationStandardEntity[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);

  const searchByParamBcPv = useCallback(
    (param: ParamBcPvDto, callback?: (success: boolean) => void) => {
      setLoading(true);
      mcasOrganizationStandardApi
        .searchByParamBcPv(param)
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
    [],
  );

  return {
    dataSource,
    searchByParamBcPv,
    isLoading,
    isSaving,
  };
};
