import {
  ConfigPartnerApi,
  ConfigPartnerDto,
  PartnerCategoryApi,
  PartnerCategoryDto,
} from '@/services/client';
import { addToDataSource, deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
import { message } from 'antd';
import { useCallback, useState } from 'react';

const configPartnerApi = new ConfigPartnerApi();
const partnerCategoryApi = new PartnerCategoryApi();
export default () => {
  const [partnerCategoryList, setListPartnerCategory] = useState<PartnerCategoryDto[]>([]);
  const [configPartnerList, setConfigPartnerList] = useState<ConfigPartnerDto[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);

  const getDataByUserAndOrg = useCallback((callback?: (success: boolean, data: any) => void) => {
    setLoading(true);
    configPartnerApi
      .getDataByUserAndOrg()
      .then((resp: any) => {
        if (resp.status === 200) {
          setConfigPartnerList(resp.data);
        }
        if (callback) {
          callback(resp.status === 200, resp.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const updateRecord = (record: ConfigPartnerDto) => {
    setSaving(true);
    configPartnerApi
      .updateConfigPartner(record)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('Cập nhật thành công !');
        } else {
          message.error('Cật nhật thất bại !');
        }
      })
      .finally(() => setSaving(false))
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const getAllByConfigWebhook = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    partnerCategoryApi
      .getAllByConfigWebhook()
      .then((resp) => {
        if (resp.status === 200) {
          setListPartnerCategory(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    isLoading,
    isSaving,
    updateRecord,
    partnerCategoryList,
    configPartnerList,
    getAllByConfigWebhook,
    getDataByUserAndOrg,
  };
};
