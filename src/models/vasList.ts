import { McasVaServiceApi, McasVaServiceDto } from '@/services/client';
import { useState } from 'react';

const mcasVaServiceApi = new McasVaServiceApi();
export default () => {
  const [vasList, setVasList] = useState<McasVaServiceDto[]>([]);
  const [vasExtendList, setVasExtendList] = useState<McasVaServiceDto[]>([]);
  const [isLoadingVas, setLoadingVas] = useState<boolean>(false);

  const onChangeServiceCode = (serviceCode?: string) => {
    if (serviceCode) {
      setLoadingVas(true);
      mcasVaServiceApi
        .findByServiceCode(serviceCode)
        .then((resp) => {
          if (resp.status === 200) {
            setVasList(resp.data);
            setVasExtendList(resp.data.filter((v) => v.extend));
          }
        })
        .finally(() => setLoadingVas(false));
    } else {
      setVasList([]);
    }
  };

  return {
    vasList,
    vasExtendList,
    isLoadingVas,
    onChangeServiceCode,
  };
};
