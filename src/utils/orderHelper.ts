import { OrderBatchDto } from '@/pages/order/dtos/OrderBatchDto';
import {
  ContactDto,
  ContractDto,
  ContractServiceCode,
  ContractServiceTypeModel,
  FindContractResponse,
  McasServiceDto,
  McasVaServiceDto,
  OrderHdrDto,
  VaDto,
} from '@/services/client';
import { FormInstance } from 'antd';
import moment from 'moment';

const _toString = (ctm?: ContractServiceTypeModel[]) => {
  let value = '';
  if (!ctm) return value;
  ctm.forEach((t) => {
    value = value + t.contractServiceCode + ';' + t.contractClassify + '|';
  });
  return value.substr(0, value.length - 1);
};

export type ContractType = {
  id: string;
  orderNo?: number;
  customerCode?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerProvinceCode?: string;
  customerDistrictCode?: string;
  customerCommuneCode?: string;
  customerPostCode?: string;
  kt1Type?: string;
  customerAddress?: string;
  contractID?: string;
  contractNumber?: string;
  contractName?: string;
  contractSignDate?: string;
  contractValidDate?: string;
  contractExpDate?: string;
  idNumber?: string;
  taxNumber?: string;
  contractServiceCode?: string;
  customerCodeCrm?: string;
  customerCodeRef?: string;
  ghiChuPhat?: string;
  customerType?: string;
  managedOrg?: string;
  managedOrgName?: string;
  contractServiceCodes: ContractServiceCode[];
};

// lấy danh sách hợp đồng từ KQ CMS trả về
export const resultDataToListContract = (
  findContractResponse: FindContractResponse,
  isContractC: boolean,
  contractNumberParam?: string,
): ContractType[] => {
  let convertedData: ContractType[] = [];
  (findContractResponse.resultData || []).forEach((cus) => {
    if (cus.accntStatus !== '1') {
      return;
    }
    const {
      accntId,
      accntCode,
      accntName,
      accntTel1,
      accntEmail,
      accntAddCity,
      accntAddPro,
      accntAddWard,
      accntPostCode,
      accntDocnumber,
      accntDoctype,
      kt1Type,
      ghiChuPhat,
      accntCustype,
      accntCustypeName,
    } = cus;

    if (cus.contractModels) {
      cus.contractModels
        .filter(
          (con) =>
            con.contractStatus === '1' &&
            (!contractNumberParam || con.contractNumber === contractNumberParam),
        )
        .forEach((con) => {
          const {
            contractID,
            contractValidDate,
            contractExpDate,
            customerAddress,
            contractNumber,
            contractName,
            contractSignDate,
            // contractClueModels,
          } = con;

          // check hết hiệu lực
          if (con.contractExpDate) {
            if (moment(con.contractExpDate, 'DD/MM/YYYY').isBefore(moment())) {
              return;
            }
          }

          const contractServiceTypeModels = isContractC
            ? con.contractServiceTypeModels?.filter((c) =>
                ['02', '04', '06'].includes(c.contractClassify!),
              )
            : con.contractServiceTypeModels?.filter((c) => c.contractClassify !== '02');
          const item: ContractType = {
            id: accntId + '_' + contractID,
            customerCode: accntCode,
            customerName: accntName,
            customerPhone: accntTel1,
            customerEmail: accntEmail,
            customerProvinceCode: accntAddCity,
            customerDistrictCode: accntAddPro,
            customerCommuneCode: accntAddWard,
            customerPostCode: accntPostCode,
            kt1Type,
            customerAddress,
            contractID,
            contractNumber,
            contractName,
            contractSignDate,
            contractValidDate,
            contractExpDate,
            idNumber: accntDoctype === '1' || accntDoctype === '2' ? accntDocnumber || '' : '', // 1-CMT, 2-CCCD
            taxNumber: accntDoctype === '3' ? accntDocnumber || '' : '', // 3-MST
            contractServiceCode: _toString(contractServiceTypeModels),
            ghiChuPhat,
            customerType: ['5', '6', '7', '8'].includes(accntCustype || '') ? accntCustypeName : '',
            managedOrg: cus.managedOrg,
            managedOrgName: cus.managedOrgName,
            contractServiceCodes:
              contractServiceTypeModels?.map((c) => ({
                csc: c.contractServiceCode,
                cc: c.contractClassify,
              })) || [],
          };
          convertedData.push(item);
        });
    }
  });
  // order theo ngày hiệu lực
  convertedData.sort((a, b) => {
    const aM = moment(a.contractValidDate, 'DD/MM/YYYY');
    const bM = moment(b.contractValidDate, 'DD/MM/YYYY');
    return aM.isAfter(bM) ? 1 : -1;
  });
  convertedData = convertedData.map((item, index) => ({ ...item, orderNo: index + 1 }));
  return convertedData;
};

export const checkValidateVaService = (
  newValues: VaDto[] = [],
  vasList: McasVaServiceDto[],
  extend: boolean,
) => {
  for (let i = 0; i < newValues.length; i++) {
    const newVa = newValues[i];
    if (newVa) {
      const vaField: McasVaServiceDto | undefined = vasList
        .filter((v) => v.extend === extend)
        .find((v) => v.vaServiceId === newVa.vaCode);
      if (!vaField) {
        // return Promise.resolve();
        continue;
        // return Promise.reject(new Error(`Không được phép sử dụng GTGT ${newVa.vaCode}`));
      }
      for (let j = 0; j < (vaField.propsList?.length || 0); j++) {
        const propField = vaField.propsList?.[j];
        const newPropValue = newVa.addons!.find((p) => p.propCode === propField?.propCode);
        if (propField?.required) {
          if (!newPropValue || !newPropValue.propValue) {
            return Promise.reject(
              new Error(
                `Thông tin ${propField.propName} của GTGT ${vaField.vaServiceName} không được để trống`,
              ),
            );
          }
        }
        if (propField?.dataType === 'number') {
          if (isNaN(+(newPropValue?.propValue ?? '0'))) {
            return Promise.reject(
              new Error(
                `Thông tin ${propField.propName} của GTGT ${vaField.vaServiceName} phải là số`,
              ),
            );
          }
          if (+(newPropValue?.propValue ?? '0') < 0) {
            return Promise.reject(
              new Error(
                `Thông tin ${propField.propName} của GTGT ${vaField.vaServiceName} phải lớn hơn 0`,
              ),
            );
          }
        }
      }
    }
  }
  return Promise.resolve();
};

export const getKeepOrderData = (orderHdr: OrderHdrDto, vasExtendList: McasVaServiceDto[]) => {
  return {
    // thông tin hàng hoá
    orderContents: orderHdr.orderContents,
    saleOrderCode: orderHdr.saleOrderCode,
    weight: orderHdr.weight,
    dimWeight: orderHdr.dimWeight,
    height: orderHdr.height,
    width: orderHdr.weight,
    length: orderHdr.length,
    contentNote: orderHdr.contentNote,
    orderImages: orderHdr.orderImages,
    isBroken: orderHdr.isBroken,

    // yêu cầu thêm
    vas: orderHdr.vas?.filter((va) => vasExtendList.some((v) => v.vaServiceId === va.vaCode)),
    sendType: orderHdr.sendType,
    shiftCodeCollect: orderHdr.shiftCodeCollect,
    collectionDate: orderHdr.collectionDate
      ? moment(orderHdr.collectionDate, 'DD/MM/YYYY HH:mm:ss')
      : undefined,
    deliveryRequire: orderHdr.deliveryRequire,
    deliveryTime: orderHdr.deliveryTime,
    deliveryInstruction: orderHdr.deliveryInstruction,

    keepOrderInfo: true,
  };
};

export const validateSender = (formValue: any, isOrderTemplate: boolean): any => {
  if (isOrderTemplate) {
    return formValue;
  }

  if (!formValue.senderName) {
    throw new Error('Họ và tên người gửi không được để trống');
  }
  if (!formValue.senderPhone) {
    throw new Error('Số điện thoại người gửi không được để trống');
  }
  if (!formValue.senderAddress) {
    throw new Error('Đại chỉ người gửi không được để trống');
  }
  if (!formValue.senderProvinceCode) {
    throw new Error('Tỉnh/TP người gửi không được để trống');
  }
  if (!formValue.senderDistrictCode) {
    throw new Error('Quận/Huyện người gửi không được để trống');
  }
  return formValue;
};

export const validateFormOrder = (
  formValue: any,
  serviceListAppend: McasServiceDto[],
  contractServiceCodes: ContractServiceCode[],
  isOrderTemplate: boolean,
  vasList: McasVaServiceDto[],
): OrderHdrDto => {
  // check sender
  const retVal = validateSender(formValue, isOrderTemplate);

  // tinh lai kltc
  const newWeight: number = retVal?.weight || 0;
  const height: number = retVal?.height || 0;
  const width: number = retVal?.width || 0;
  const length: number = retVal?.length || 0;

  let dimWeight = 0;
  if (height && width && length) {
    dimWeight = Math.round((height * length * width) / 6);
  }
  if (formValue.international) {
    dimWeight = retVal?.dimWeight;
    retVal.receiverPhone = retVal.phoneCode + retVal.receiverPhone;
  }
  const priceWeight = Math.max(newWeight, dimWeight);
  // end tinh kltc

  if (retVal.senderContractNumber && formValue.receiverContractNumber) {
    throw new Error('Không được có đồng thời Hợp đồng sử dụng và hợp đồng C');
  }

  if (retVal.serviceCode) {
    if (!serviceListAppend.some((s) => s.mailServiceId === retVal.serviceCode)) {
      throw new Error('Dịch vụ chuyển phát không tồn tại hoặc không được phép sử dụng');
    }
  }

  // remove GTGT k được phép sử dụng
  retVal.vas = retVal.vas?.filter((v) =>
    vasList.some((vaAllow) => vaAllow.vaServiceId === v.vaCode),
  );

  if (retVal.collectionDate) {
    retVal.collectionDate = retVal.collectionDate?.format?.('DD/MM/YYYY HH:mm:ss');
  }
  return { ...retVal, contractServiceCodes, dimWeight, priceWeight };
};

export const validateBillingFormOrder = (
  formValue: any,
  serviceListAppend: McasServiceDto[],
  contractServiceCodes: ContractServiceCode[],
  isOrderTemplate: boolean,
  vasList: McasVaServiceDto[],
): OrderHdrDto => {
  // check sender
  const retVal = validateFormOrder(
    formValue,
    serviceListAppend,
    contractServiceCodes,
    isOrderTemplate,
    vasList,
  );
  // remove các trường k liên quan đến tính cước
  retVal.orderBillings = [];
  retVal.orderContents = [];
  retVal.orderImages = [];
  return retVal;
};

export const setDefaultContract = (
  form: FormInstance<any>,
  contractList: ContractDto[],
  setContractServiceCodes: (contractServiceCodes: ContractServiceCode[]) => void,
) => {
  // nếu là thêm mới và không có đơn hàng mẫu mặc định => lấy sender mặc định
  if (contractList.length > 0) {
    form.setFieldsValue({ senderContractNumber: contractList[0].contractNumber });
    setContractServiceCodes(contractList[0].contractServiceCodes || []);
  }
};

export const calculateDimWeight = (height?: number, width?: number, length?: number): number => {
  let dimWeight = 0;
  if (height && width && length) {
    dimWeight = Math.round((height * length * width) / 6);
  }
  return dimWeight;
};
export const calculatePriceWeight = (weight: number, dimWeight: number): number => {
  const priceWeight = Math.max(weight ?? 0, dimWeight ?? 0);
  return priceWeight;
};
export type ValidateType = {
  success: boolean;
  acceptanceIndex?: number;
  error?: string;
};
export const validateBatch = (
  batch: OrderBatchDto[],
  isServiceDocument: boolean,
  isHasPhatMotPhan: boolean,
): ValidateType => {
  let hasCod: boolean = !!batch?.[0]?.cod;
  for (let i = 0; i < batch.length; i++) {
    const item = batch[i];
    // nội dung
    try {
      if (!item.contentNote && (isServiceDocument || !isHasPhatMotPhan)) {
        throw new Error('Nội dung không được để trống');
      }
      // khối lượng
      if (!item.weight) {
        throw new Error('Khối lượng không được để trống');
      }
      // số tiền COD
      if (hasCod !== !!item.cod) {
        throw new Error('Các đơn hàng trong lô phải đồng thời có COD hoặc không có COD');
      }
      // chi tiết hàng hóa
      if (isHasPhatMotPhan && (item.orderContents?.length ?? 0) === 0) {
        throw new Error('Bắt buộc ít nhất một hàng hoá');
      }
    } catch (e: any) {
      return { success: false, acceptanceIndex: item.acceptanceIndex, error: e?.message };
    }
  }
  return { success: true };
};
