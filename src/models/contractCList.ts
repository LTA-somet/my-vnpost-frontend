import { 
    CmsApi,
    ParamDto
} from '@/services/client';
import { useCallback, useState } from 'react';


const cmsApi = new CmsApi();

export default () => {
    const [dataSource, setdataSource] = useState<any[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);


    const searchByParam = useCallback((param: ParamDto ,callback?: (success: boolean) => void) => {
        setLoading(true);
        cmsApi.searchContractC(param)
          .then((resp) => {
            if (resp.status === 200) {
                setdataSource(resp.data.resultData);

            }
            if (callback) {
              callback(resp.status === 200);
            }
          })
          .finally(() => setLoading(false));
    }, []);

    return {
        searchByParam,
        dataSource,
        isLoading
    };

}