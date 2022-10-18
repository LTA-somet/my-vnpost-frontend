import { useCallback, useEffect, useState } from 'react';

import {
  CollatingApi,
  AuthApi,
  SearchCollatingDto,
  McasOrganizationStandardApi,
  McasOrganizationStandardEntity,
} from '@/services/client';
import { ImportForControl, DisplayImportAxios, CheckDuplicateAxios } from '@/services/custom-client/import-for-control';
import { ExportExcel  } from '@/services/custom-client/save-collating';
import { message, notification } from 'antd';
const importForControl = new ImportForControl();
const displayImportAxios = new DisplayImportAxios();
const checkDuplicateAxios = new CheckDuplicateAxios();
const collactingApi = new CollatingApi();
const authApi = new AuthApi();
const mcasOrganizationStandardApi = new McasOrganizationStandardApi();

const exportExcelApi = new ExportExcel();

import moment from 'moment';
export default () => {
  const [collactingData, setCollatingData] = useState<any>([]);
  const [collactingHdrData, setCollactingHdrData] = useState<any>([]);
  const [collactingDtlData, setCollactingDtlData] = useState<any>([]);
  const [collactingDtlConfirm, setCollactingDtlConfirm] = useState<any>([]);
  const [mcasOrganizationStandard, setMcasOrganizationStandard] = useState<McasOrganizationStandardEntity[]>([]);
  const [listOrg, setListOrg] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [colectingSearchData, setColectingSearchData] = useState<any>([]);
  const [dataUploadFileReturn, setDataUploadFileReturn] = useState<any[]>([]);
  const [strBase64Report, setStrBase64Report] = useState<string>();
  const [statusConfiml, setStatusConfiml] = useState<boolean>(false);
  const [fileExportDtl, setFileExportDtl ] = useState<any>();
  //Tham so dung chung
  const [checked, setChecked] = useState(false);
  const [idHdr, setIdhdr] = useState<any>();
  const [idDtl, setIdDtl] = useState<any>();
  const [dateFrom, setDateFrom] = useState<string>(moment().clone().startOf('month').format('DD-MM-YYYY'));
  const [dateTo, setDateTo] = useState<string>(moment().format('DD-MM-YYYY'));
  const [dateFromFormControl, setDateFromFormControl] = useState<string>(moment().clone().startOf('month').format('DD-MM-YYYY'));
  const [dateToFormControl, setDateToFormControl] = useState<string>(moment().format('DD-MM-YYYY')); 

  const [reloadForm, setReloadFrom] = useState<boolean>(false);
  const [statusHdr, setStatusHdr] = useState<boolean>(false);

  //Danh muc dia ban
  const getListMcasOrganizationStandard = useCallback(
    (unitType: string, callback?: (success: boolean) => void) => {
      setLoading(true);
      mcasOrganizationStandardApi
        .getAllByUnitType(unitType)
        .then((resp) => {
          if (resp.status === 200) {
            setMcasOrganizationStandard(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  //Tải lên file
  const getOnUploadFile = useCallback((formData: FormData) => {
    setLoading(true);
    setCollatingData([]);
    displayImportAxios
      .importExcel(formData)
      .then((resp) => {
        if (resp.status === 200) {
          const arr = [];
          arr.push(resp.data);
          setDataUploadFileReturn(arr);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  //Check trùng dữ liệu
  const checkDuplicateDataModel = useCallback((formData: FormData , callback?: (success: boolean, message : any) => void) => {
    setLoading(true);
    checkDuplicateAxios
      .checkDuplicate(formData)
      .then((resp) => {
        if (callback) {
          callback(resp.status === 200, resp.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  //Xóa dữ liệu bị trùng
  const deleteDataDuplicateModel = useCallback((data: any , callback?: (success: boolean, resp : any) => void) => {
    setLoading(true);
    collactingApi
      .deleteCollating(data)
      .then((resp) => {
        if (callback) {
          callback(resp.status === 200, resp.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  //Ghi file vào db
  const onImportCollating = useCallback((formData: FormData, callback?: (success: boolean) => void) => {
    setLoading(true);
    setCollatingData([]);
    importForControl
      .importExcel(formData)
      .then((resp) => {
        if (resp.status === 200) {
          if (resp?.data?.success == true) {
            notification.success({
              message: 'Ghi dữ liệu thành công',
            });
          } else {
            notification.error({
              message: resp?.data?.message,
            });
          }
          
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getListOrg = useCallback((parentCode: string, callback?: (success: boolean) => void) => {
    setLoading(true);
    authApi
      .findUnitByParentCode(parentCode)
      .then((resp) => {
        if (resp.status === 200) {
          setListOrg(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getCollatingByParam = useCallback(
    (param: SearchCollatingDto, callback?: (success: boolean) => void) => {
      setLoading(true);
      collactingApi
        .lookUpCollating(param)
        .then((resp) => {
          if (resp.status === 200) {
            setColectingSearchData(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  //Tra cuu form 1
  const getCollatingHdrDataSearch = useCallback(
    (
      dateFrom: string,
      dateTo: string,
      checkbox: boolean,
      callback?: (success: boolean) => void,
    ) => {
      setLoading(true);
      collactingApi
        .infoCollating(dateFrom, dateTo, checkbox)
        .then((resp) => {
          if (resp.status === 200) {
            setCollactingHdrData(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  //Tra cuu form 2 xem chi tiet
  const getCollatingDtlDataSearch = useCallback(
    (idHdr: any, callback?: (success: boolean) => void) => {
      setLoading(true);
      collactingApi
        .details(idHdr)
        .then((resp) => {
          if (resp.status === 200) {
            setCollactingDtlData(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  //Load dữ liệu form xác nhận
  const getDataComfirm = useCallback((idHdr: any, callback?: (success: boolean) => void) => {
    setLoading(true);
    collactingApi
      .requireConfirm(idHdr)
      .then((resp) => {
        if (resp.status === 200) {
          setCollactingDtlConfirm(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  //Cập nhật trạng thái form xác nhận
  const getConfirmChangeStatus = useCallback(
    (idHdr: any, callback?: (success: boolean) => void) => {
      setLoading(true);
      collactingApi
        .changStatus(idHdr)
        .then((resp) => {
          if (resp.status === 202) {
            notification.success({
              message: 'Cập nhật trạng thái thành công',
            });
            setStatusConfiml(true);
          } else {
            notification.error({
              message: 'Không thành công',
            });
          }
          if (callback) {
            callback(resp.status === 202);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const getExportReport = useCallback(
    (
      dateFrom: string,
      dateTo: string,
      printName: string,
      customerCode: string,
      callback?: (success: boolean) => void,
    ) => {
      setLoading(true);
      collactingApi
        .printPostageGeneration(dateFrom, dateTo, printName, customerCode)
        .then((resp) => {
          if (resp.status === 200) {
            setStrBase64Report(resp?.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  //Update trạng thai dtl
  const updateStatusDtl = useCallback((idDtl: number, callback?: (success: boolean) => void) => {
    setLoading(true);
    collactingApi
      .changSttDtl(idDtl)
      .then((resp) => {
        if (resp.status === 200) {
          console.log('Update ');
        }
        if (callback) {
          callback(resp.status === 202);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const exportExcelDtl = useCallback((idDtl: any, callback?: (success: boolean, data : any) => void) => {
    setLoading(true);
    exportExcelApi
      .exportExcel(idDtl)
      .then((resp) => {
        if (resp.status === 200) {
          setFileExportDtl(resp.data);
        }
        if (callback) {
          callback(resp.status === 200, resp.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    //Tham số dùng chung
    checked,
    setChecked,
    idHdr,
    setIdhdr,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    reloadForm,
    setReloadFrom,
    statusHdr, setStatusHdr,
    dateFromFormControl, setDateFromFormControl,
    dateToFormControl, setDateToFormControl,
    //
    isLoading,
    isSaving,
    collactingData,
    listOrg,
    colectingSearchData,
    collactingHdrData,
    collactingDtlData,
    dataUploadFileReturn,
    collactingDtlConfirm,
    strBase64Report,
    statusConfiml,
    setStatusConfiml,
    setStrBase64Report,
    setCollactingDtlConfirm,
    setDataUploadFileReturn,
    onImportCollating,
    getListOrg,
    getCollatingByParam,
    getCollatingHdrDataSearch,
    getCollatingDtlDataSearch,
    getOnUploadFile,
    getDataComfirm,
    getConfirmChangeStatus,
    getExportReport,

    mcasOrganizationStandard,
    getListMcasOrganizationStandard,
    updateStatusDtl,
    fileExportDtl,
    setFileExportDtl,
    exportExcelDtl,
    checkDuplicateDataModel,
    deleteDataDuplicateModel
  };
};
