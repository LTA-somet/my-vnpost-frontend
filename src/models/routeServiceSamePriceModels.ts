import { useCallback, useState } from 'react';
import {
  RouteServiceApi,
  McasOrganizationStandardApi,
  PriorMcasOrganizationStandardDto,
  SearchRouterSameValueDto,
  RequetMixedPriceDto,
  SearchRouterFastDto,
} from '@/services/client';
import notify from '@/pages/category/notify';
import { notification } from 'antd';

const routeServiceApi = new RouteServiceApi();
const mcasOrganizationStandardApi = new McasOrganizationStandardApi();

const generateKey = () => {
  const randomNumber = Math.floor(Math.random() * 1000000000 + 1);
  return `${new Date().getTime()}_${randomNumber}`;
};
export default () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [lstFindContractRessponse, setLstFindContractRessponse] = useState<any[]>([]);
  const [lstOrganization, setLitOrganization] = useState<PriorMcasOrganizationStandardDto[]>([]);
  const [lstSearchRouterSameValueDto, setLstSearchRouterSameValueDto] = useState<
    SearchRouterSameValueDto[]
  >([]);

  const [lstSearchRouterFastDto, setLstSearchRouterFastDto] = useState<SearchRouterFastDto[]>([]);
  const [requetMixedPriceDto, setRequetMixedPriceDto] = useState<RequetMixedPriceDto>();

  const findLstOrganizationByUnitCode = useCallback(
    (unitCode: string, callback?: (success: boolean) => void) => {
      setLoading(true);
      mcasOrganizationStandardApi
        .getOrgStartUnitCode(unitCode)
        .then((resp) => {
          if (resp.status === 200) {
            setLitOrganization(resp?.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const getInforContract = useCallback(
    (
      accntCode: string,
      accntTel: string,
      contractNumber: string,
      cppaNumber: string,
      callback?: (success: boolean, data: any[]) => void,
    ) => {
      setLoading(true);
      routeServiceApi
        .searchContact(accntCode, accntTel, contractNumber, cppaNumber)
        .then((resp: any) => {
          // if (resp.status === 200) {
          //   // setLstFindContractRessponse(resp?.data?.resultData || []);
          // }
          if (callback) {
            callback(resp.status === 200, resp?.data?.resultData || []);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  //Tra cuu dong gia hon hop theo param
  const onSearchRouterSameValue = useCallback(
    (
      type?: string,
      bdtCode?: string,
      routerName?: string,
      contractNumber?: string,
      customerCode?: string,
      serviceGroupId?: string,
      serviceCode?: string,
      callback?: (success: boolean) => void,
    ) => {
      setLoading(true);
      routeServiceApi
        .searchByParam1(
          type,
          bdtCode,
          routerName,
          contractNumber,
          customerCode,
          serviceGroupId,
          serviceCode,
        )
        .then((resp: any) => {
          if (resp.status === 200) {
            setLstSearchRouterSameValueDto(resp?.data || []);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  //Tra cuu dong gia nhanh theo param
  const onSearchRouterFast = useCallback(
    (
      bdtCode?: string,
      contractNumber?: string,
      customerCode?: string,
      serviceGroupSamePrice?: string,
      serviceCode?: string,
      callback?: (success: boolean) => void,
    ) => {
      setLoading(true);
      routeServiceApi
        .searchRouterFast(bdtCode, contractNumber, customerCode, serviceGroupSamePrice, serviceCode)
        .then((resp: any) => {
          if (resp.status === 200) {
            const data: any[] = resp?.data || [];
            data.forEach((element) => {
              element.key = generateKey();
            });
            setLstSearchRouterFastDto(data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  //Luu du lieu hỗn hợp
  const onSaveDataMixedPriceDto = useCallback(
    (
      requetMixedPriceDtoParam: RequetMixedPriceDto,
      callback?: (success: boolean, data: RequetMixedPriceDto) => void,
    ) => {
      setLoading(true);
      routeServiceApi
        .saveData(requetMixedPriceDtoParam)
        .then((resp: any) => {
          if (resp.status === 200) {
            setRequetMixedPriceDto(resp?.data);
          }
          if (callback) {
            callback(resp.status === 200, resp?.data);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  //Xóa dữ liệu hỗn hợp
  const onDeleteData = useCallback((param: any, callback?: (success: boolean) => void) => {
    setLoading(true);
    routeServiceApi
      .deleteListRouterId(param)
      .then((resp: any) => {
        if (resp.status === 200) {
          notification.success({
            message: 'Xóa dữ liệu thành công',
          });
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  //Find routerMixed by id
  const onFindRouterMixedById = useCallback(
    (id: number, callback?: (success: boolean, data: RequetMixedPriceDto) => void) => {
      setLoading(true);
      routeServiveApi
        .findRouterById(id)
        .then((resp: any) => {
          if (callback) {
            callback(resp.status === 200, resp?.data);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  return {
    isLoading,
    getInforContract,
    lstFindContractRessponse,
    lstOrganization,
    findLstOrganizationByUnitCode,
    onSearchRouterSameValue,
    lstSearchRouterSameValueDto,
    setLstSearchRouterSameValueDto,
    onSaveDataMixedPriceDto,
    requetMixedPriceDto,
    //Hỗn hợp
    onFindRouterMixedById,

    //nhanh
    onSearchRouterFast,
    lstSearchRouterFastDto,
    setLstSearchRouterFastDto,

    //all
    onDeleteData,
  };
};
