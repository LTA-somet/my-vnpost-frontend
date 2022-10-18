import { getUnitList, UnitTypeProps } from '@/core/initdata';
import { AuthApi, McasAdministrativeUnitApi } from '@/services/client';
import { useCallback, useState } from 'react';

// model này chỉ sử dụng ở màn hình đăng ký => nếu đã đăng nhập thì có thể lấy ở global store
const authApi = new AuthApi();
export default () => {
  const [unitData, setUnitData] = useState<UnitTypeProps>();
  const [isLoadingUnitData, setLoadingUnitData] = useState<boolean>(false);

  const loadUnitData = useCallback(
    (callback?: (success: boolean) => void) => {
      if (unitData) return;
      setLoadingUnitData(true);
      authApi
        .findAllUnit()
        .then((resp) => {
          if (resp.status === 200) {
            setUnitData(getUnitList(resp.data));
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoadingUnitData(false));
    },
    [unitData],
  );

  return {
    unitData,
    loadUnitData,
    isLoadingUnitData,
  };
};
