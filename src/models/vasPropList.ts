import { VasPropApi, VasPropEntity } from '@/services/client';
import { useCallback, useState } from 'react';

const vasPropApi = new VasPropApi();
export default () => {
  const [dataSource, setDataSource] = useState<VasPropEntity[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const getAllVasProp = (vaServiceId?: string) => {
    if (vaServiceId) {
      setLoading(true);
      vasPropApi
        .findByVaCode(vaServiceId)
        .then((resp) => {
          if (resp.status === 200) {
            setDataSource(resp.data);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setDataSource([]);
    }
  };

  return {
    dataSource,
    isLoading,
    getAllVasProp,
    setDataSource,
  };
};
