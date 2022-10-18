import {
  ProductEntity,
  ProductApi,
  ParamDto,
  McasNationalApi,
  McasNationalDto,
} from '@/services/client';
import { useCallback, useState } from 'react';
import { notification } from 'antd';
import { useModel } from 'umi';

const productApi = new ProductApi();
const mcasNationalApi = new McasNationalApi();

export default () => {
  const [dataSourceInit, setDataSourceInit] = useState<ProductEntity[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [opAccounts, setOpAccounts] = useState<any[]>([]);
  const [opDelegater, setOpDelegater] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [isCheckDuplicate, setCheckDuplicate] = useState<boolean>(true);
  const [lstMcasNationalDto, setLstMcasNationalDto] = useState<McasNationalDto[]>([]);

  const reload = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    productApi
      .findAllProduct()
      .then((resp) => {
        if (resp.status === 200) {
          const dataReturn = resp.data;
          // let minId = -1;
          // dataReturn.forEach((element) => {
          //   element.stepDetailId = minId;
          //   element.checkbox = false;
          //   minId--;
          // });
          setDataSourceInit(dataReturn);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);
  const getOpAccountChild = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    productApi
      .getAccount()
      .then((resp) => {
        if (resp.status === 200) {
          setOpAccounts(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getOpDelegater = useCallback((account: string, callback?: (success: boolean) => void) => {
    setLoading(true);
    productApi
      .getDelegater(account)
      .then((resp) => {
        if (resp.status === 200) {
          setOpDelegater(resp.data);
          console.log(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);
  const searchByParam = useCallback((param: ParamDto, callback?: (success: boolean) => void) => {
    setLoading(true);
    productApi
      .searchByParam(param)
      .then((resp) => {
        if (resp.status === 200) {
          const dataReturn = resp.data;
          let minId = -1;
          dataReturn.forEach((element: any) => {
            element.stepDetailId = minId;
            element.checkbox = false;
            element.type = '';
            minId--;
          });
          setDataSourceInit(dataReturn);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const searchProduct = useCallback((value: any, callback?: (success: boolean) => void) => {
    setLoading(true);
    productApi
      .searchByNameOrId(value)
      .then((resp) => {
        if (resp.status === 200) {
          setProducts(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const saveAllRecord = useCallback(
    (record: ProductEntity[], callback?: (success: boolean) => void) => {
      setSaving(true);
      productApi
        .saveProduct(record)
        .then((resp) => {
          console.log(resp.status);

          if (callback) {
            callback(resp.status === 201);
          }

          if (resp.status === 200) {
            const dataReturn = resp.data;
            // let minId = -1;
            // dataReturn.forEach(element => {
            //     element.stepDetailId = minId;
            //     element.checkbox = false;
            //     element.type = '';
            //     element.status = undefined;
            //     minId--;
            // });
            setDataSourceInit(dataReturn);
            notification.success({
              message: 'Lưu thành công',
            });
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSourceInit],
  );

  const deleteRecords = useCallback(
    (record: ProductEntity[], callback?: (success: boolean) => void) => {
      setSaving(true);
      productApi
        .deleteListId(record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 200);
          }
          if (resp.status === 200) {
            // setDataSourceInit(resp.data);
            console.log('Xóa thành công');
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSourceInit],
  );

  const checkDuplicateProductName = useCallback(
    (record: ProductEntity[], callback?: (success: boolean) => void) => {
      setSaving(true);
      productApi
        .checkNameDuplicate(record)
        .then((resp) => {
          console.log(resp.status);

          if (callback) {
            callback(resp.status === 201);
          }

          if (resp.status === 200) {
            console.log(resp.data);
            if (resp.data.success == false) {
              setCheckDuplicate(false);
            } else {
              saveAllRecord(record);
            }

            // setCheckDuplicate(resp.data.success == false ? resp.data.success  : true );
          } else {
            setCheckDuplicate(true);
          }
        })
        .finally(() => setSaving(false));
    },
    [],
  );

  //Danh muc quoc gia
  const getListNational = useCallback((callback?: (success: boolean) => void) => {
    setSaving(true);
    mcasNationalApi
      .getAllNationals()
      .then((resp) => {
        if (resp.status === 200) {
          setLstMcasNationalDto(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setSaving(false));
  }, []);

  return {
    dataSourceInit,
    isLoading,
    isSaving,
    products,
    opAccounts,
    opDelegater,
    isCheckDuplicate,
    setOpDelegater,
    reload,
    searchByParam,
    searchProduct,
    saveAllRecord,
    setDataSourceInit,
    deleteRecords,
    getOpAccountChild,
    getOpDelegater,
    setCheckDuplicate,
    checkDuplicateProductName,
    getListNational,
    lstMcasNationalDto,
  };
};
