import type { InitStateProps } from '@/app';
import type {
  AccountInfo,
  CategoryAppParamEntity,
  McasMenuDto,
  McasServiceDto,
  MyvnpServiceGroupEntity,
} from '@/services/client';
import { useModel } from 'umi';
import type { UnitDataProps } from '@/core/initdata';

export const getAccountInfo = (initialState: InitStateProps | undefined): AccountInfo => {
  return initialState!.accountInfo!;
};
// export const getSharedDirectories = (
//   initialState: InitStateProps | undefined,
// ): SharedDirectory[] => {
//   return initialState?.globalData?.sharedDirectories || [];
// };
export const useAdministrativeUnitList = (): UnitDataProps => {
  const { initialState } = useModel('@@initialState');
  return (
    initialState?.globalData?.administrativeUnitList || {
      administrativeUnitList: [],
      provinceList: [],
      districtList: [],
      communeList: [],
    }
  );
};

export const useCurrentUser = (): AccountInfo => {
  const { initialState } = useModel('@@initialState');
  return initialState!.accountInfo!;
};

export const getMenuAccept = (initialState: InitStateProps | undefined): McasMenuDto[] => {
  return initialState!.globalData?.menuAccept || [];
};

export const useServiceList = (): McasServiceDto[] => {
  const { initialState } = useModel('@@initialState');
  return initialState?.globalData?.serviceList || [];
};
export const useMyvnpServiceGroupList = (): MyvnpServiceGroupEntity[] => {
  const { initialState } = useModel('@@initialState');
  return initialState?.globalData?.myvnpServiceGroupList || [];
};

export const useCategoryAppParamList = (): CategoryAppParamEntity[] => {
  const { initialState } = useModel('@@initialState');
  return initialState?.globalData?.categoryAppParamList || [];
};

export const useYCKPH = (): CategoryAppParamEntity[] => {
  return useCategoryAppParamList().filter((c) => c.type === 'YCKPH');
};
export const useCTG = (): CategoryAppParamEntity[] => {
  return useCategoryAppParamList().filter((c) => c.type === 'CTG');
};

export const usePostTypeList = (): CategoryAppParamEntity[] => {
  return useCategoryAppParamList().filter((c) => c.type === 'SEND_TYPE');
};

export const usePropGroup = (): CategoryAppParamEntity[] => {
  return useCategoryAppParamList().filter((c) => c.type === 'VAS_PROP_GROUP');
};

export const useCurrencyList = (): CategoryAppParamEntity[] => {
  return useCategoryAppParamList().filter((c) => c.type === 'TIENTE');
};
export const useUnitList = (): CategoryAppParamEntity[] => {
  return useCategoryAppParamList().filter((c) => c.type === 'LIST_UNIT');
};
export const useExportType = (): CategoryAppParamEntity[] => {
  return useCategoryAppParamList().filter((c) => c.type === 'EXPORT_TYPE');
};

export const useConsultSolution = (): CategoryAppParamEntity[] => {
  return useCategoryAppParamList().filter((c) => c.type === 'CONSULT_SOLUTION');
};

export const useConsultRouter = (): CategoryAppParamEntity[] => {
  return useCategoryAppParamList().filter((c) => c.type === 'CONSULT_ROUTER');
};

export const usePostalType = (): CategoryAppParamEntity[] => {
  return useCategoryAppParamList().filter((c) => c.type === 'POSTAL_TYPE');
};
export const useVatNational = (): CategoryAppParamEntity[] => {
  return useCategoryAppParamList().filter((c) => c.type === 'VAT_NATIONAL');
};
export const useEoriNational = (): CategoryAppParamEntity[] => {
  return useCategoryAppParamList().filter((c) => c.type === 'EORI_NATIONAL');
};
export const useIossNational = (): CategoryAppParamEntity[] => {
  return useCategoryAppParamList().filter((c) => c.type === 'IOSS_NATIONAL');
};
