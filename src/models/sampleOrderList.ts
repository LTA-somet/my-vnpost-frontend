import { useCallback, useState } from 'react';
import { notification } from 'antd';
import {
  // OrderTemplate
  OrderTemplateApi,
  OrderTemplateDto,
  ProductApi,
  McasVaServiceApi,
  McasVaServiceDto,
  McasServiceDto,
  McasServiceApi,
} from '@/services/client';
import { deleteFromDataSource, deleteListIdsFromDataSource } from '@/utils/dataUtil';

const orderTemplateApi = new OrderTemplateApi();
const productApi = new ProductApi();
const mcasVaServiceApi = new McasVaServiceApi();
const mcasServiceApi = new McasServiceApi();
export default () => {
  const [sampleOrders, setSampleOrder] = useState<OrderTemplateDto[]>([]);
  const [mcasVaServiceDto, setMcasVaServiceDto] = useState<McasVaServiceDto[]>([]);
  const [mcasServiceDto, setMcasServiceDto] = useState<McasServiceDto[]>([]);
  const [searchContents, setSearchContents] = useState<any[]>([]);
  const [opAccounts, setOpAccounts] = useState<any[]>([]);
  const [opDelegater, setOpDelegater] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [idDelete, setIdDelete] = useState<boolean>(false);

  //Khai bao de goi lai
  const [pcontent, setPcontent] = useState();
  const [pcreateUser, setPcreetUser] = useState();
  const [pupdateBy, setPupdateBy] = useState();

  const findAllSampleOrders = useCallback(() => {
    setLoading(true);
    orderTemplateApi
      .findAllOrderTemplate()
      .then((resp) => {
        if (resp.status === 200) {
          setSampleOrder(resp.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  //Danh muc mcas_va_service
  const getAllMcasVaService = useCallback(() => {
    setLoading(true);
    mcasVaServiceApi
      .getAllVaServices()
      .then((resp) => {
        if (resp.status === 200) {
          setMcasVaServiceDto(resp.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  //Danh muc mcas_service
  const getAllMcasService = useCallback(() => {
    setLoading(true);
    mcasServiceApi
      .getAllServices()
      .then((resp) => {
        if (resp.status === 200) {
          setMcasServiceDto(resp.data);
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
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const searchContentOrder = useCallback((value: any, callback?: (success: boolean) => void) => {
    setLoading(true);
    orderTemplateApi
      .searchContentByName(value)
      .then((resp) => {
        if (resp.status === 200) {
          setSearchContents(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const searchSampleOrder = useCallback(
    (
      content: string,
      createdBy: string,
      updatedBy: string,
      callback?: (success: boolean) => void,
    ) => {
      setLoading(true);
      orderTemplateApi
        .searchByparam(content, createdBy, updatedBy)
        .then((resp) => {
          if (resp.status === 200) {
            setSampleOrder(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const deleteById = useCallback(
    (Id: any, callback?: (success: boolean) => void) => {
      setLoading(true);
      orderTemplateApi
        .deleteOrderTemplate(Id)
        .then((resp) => {
          if (resp.status === 204) {
            setSampleOrder(deleteFromDataSource(sampleOrders, Id, 'orderTemplateId'));
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [sampleOrders],
  );

  const deleteByListId = useCallback(
    (ids: any, callback?: (success: boolean) => void) => {
      setLoading(true);
      orderTemplateApi
        .deleteMultiOrderTemplate(ids)
        .then((resp) => {
          if (resp.status === 204) {
            setSampleOrder(deleteListIdsFromDataSource(sampleOrders, ids, 'orderTemplateId'));
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [sampleOrders],
  );

  const updateDefault = useCallback(
    (
      Id: number,
      isDefault: boolean,
      content: string,
      createdBy: string,
      updatedBy: string,
      callback?: (success: boolean) => void,
    ) => {
      setLoading(true);
      orderTemplateApi
        .upDateDefault(Id, isDefault)
        .then((resp) => {
          console.log(resp.status);
          if (resp.status === 200) {
            searchSampleOrder(content, createdBy, updatedBy);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const deleteDefault = useCallback(
    (
      Id: number,
      isDefault: boolean,
      content: string,
      createdBy: string,
      updatedBy: string,
      callback?: (success: boolean) => void,
    ) => {
      setLoading(true);
      orderTemplateApi
        .upDateDefault(Id, isDefault)
        .then((resp) => {
          console.log(resp.status);

          if (resp.status === 200) {
            searchSampleOrder(content, createdBy, updatedBy);
            console.log('delete default');
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
    sampleOrders,
    searchContents,
    isLoading,
    idDelete,
    opAccounts,
    opDelegater,
    //
    pcontent,
    pcreateUser,
    pupdateBy,
    mcasVaServiceDto,
    mcasServiceDto,
    setPcontent,
    setPcreetUser,
    setPupdateBy,

    setOpAccounts,
    setOpDelegater,
    searchContentOrder,
    searchSampleOrder,
    deleteById,
    deleteByListId,
    updateDefault,
    getOpAccountChild,
    getOpDelegater,
    findAllSampleOrders,
    deleteDefault,
    getAllMcasVaService,
    getAllMcasService,
  };
};
