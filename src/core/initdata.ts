import {
  McasAdministrativeUnitApi,
  McasAdministrativeUnitDto,
  McasServiceApi,
  CategoryAppParamApi,
  CategoryAppParamEntity,
  MyvnpServiceGroupApi,
  MyvnpServiceGroupEntity,
  McasMenuDto,
  McasMenuApi,
  AccountSettingResponse,
  AccountApi,
} from '@/services/client';
import type { McasServiceDto } from '@/services/client';

const mcasServiceApi = new McasServiceApi();
const administrativeUnitApi = new McasAdministrativeUnitApi();
const categoryAppParamApi = new CategoryAppParamApi();
const myvnpServiceGroupApi = new MyvnpServiceGroupApi();
const mcasMenuApi = new McasMenuApi();
const accountApi = new AccountApi();
export type UnitDataProps = {
  administrativeUnitList: McasAdministrativeUnitDto[]; //all
  provinceList: McasAdministrativeUnitDto[];
  districtList: McasAdministrativeUnitDto[];
  communeList: McasAdministrativeUnitDto[];
};
export type StoreProps = {
  serviceList: McasServiceDto[];
  myvnpServiceGroupList: MyvnpServiceGroupEntity[];
  administrativeUnitList: UnitDataProps;
  categoryAppParamList: CategoryAppParamEntity[];
  menuAccept: McasMenuDto[];
  accountSetting: AccountSettingResponse;
};

export const getUnitList = (administrativeUnitList: McasAdministrativeUnitDto[]): UnitDataProps => {
  const provinceList = administrativeUnitList.filter((a) => a.unitType === '1');
  const districtList = administrativeUnitList.filter((a) => a.unitType === '2');
  const communeList = administrativeUnitList.filter((a) => a.unitType === '3');
  return { administrativeUnitList, provinceList, districtList, communeList };
};
export const getInitGlobalData = async () => {
  const response = await Promise.all([
    mcasServiceApi.getAllServices(),
    myvnpServiceGroupApi.findAllMyvnpServiceGroup(),
    administrativeUnitApi.findAllMcasAdministrativeUnit(),
    categoryAppParamApi.findAllCategoryAppParam(),
    mcasMenuApi.getMenuAccessAllByCurrentUser(),
    accountApi.getAccountSetting(),
  ]);
  const globalData: StoreProps = {
    serviceList: response[0].data,
    myvnpServiceGroupList: response[1].data,
    administrativeUnitList: getUnitList(response[2].data),
    categoryAppParamList: response[3].data.sort((a, b) => a.orderNo! - b.orderNo!),
    menuAccept: response[4].data,
    accountSetting: response[5].data,
  };
  return globalData;
};
