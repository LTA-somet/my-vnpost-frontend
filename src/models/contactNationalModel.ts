import type {
  ContactDto,
  ParamContactDto,
  ContactCreateModel,
  McasNationalDto,
  McasNationalCityDto,
} from '@/services/client';
import { ContactApi, McasNationalApi, McasNationalCityApi } from '@/services/client';
import { deleteFromDataSource, deleteListIdsFromDataSource } from '@/utils/dataUtil';
import { notification } from 'antd';
import { useCallback, useState } from 'react';

const contactApi = new ContactApi();
const mcasNationalApi = new McasNationalApi();
const mcasNationalCityApi = new McasNationalCityApi();
export default () => {
  const [dataSourceInit, setDataSourceInit] = useState<ContactDto[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [isShowSelectAll, setIsShowSelectAll] = useState<boolean>(true);
  const [dataTable, setDataTable] = useState<ContactDto[]>([]);
  const [lstContactAddress, setLstContactAddress] = useState<ContactDto[]>([]);
  const [totalRecord, setTotalRecord] = useState<any>();
  const [paramSearch, setParamSearch] = useState<ParamContactDto>();
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);

  //
  const [mcasNationalDtoLst, setMcasNationalDtoLst] = useState<McasNationalDto[]>([]);
  const [mcasNationalCityDtoLst, setMcasNationalCityDtoLst] = useState<McasNationalCityDto[]>([]);

  const searchByParam = useCallback(
    (param: ParamContactDto, callback?: (success: boolean) => void) => {
      setLoading(true);
      setParamSearch(param);
      contactApi
        .searchByContactParamNational(param)
        .then((resp) => {
          if (resp.status === 200) {
            setDataSourceInit(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const getMcasNationalDtoLst = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    mcasNationalApi
      .getAllNationals()
      .then((resp) => {
        if (resp.status === 200) {
          setMcasNationalDtoLst(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getMcasNationalCityDtoLst = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    mcasNationalCityApi
      .getAllNationalCitys()
      .then((resp) => {
        if (resp.status === 200) {
          setMcasNationalCityDtoLst(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const createRecord = useCallback(
    (record: ContactDto, isSender: boolean, callback?: (success: boolean) => void) => {
      setSaving(true);
      contactApi
        .createContact(record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            // setDataSource(addToDataSource(dataSource, resp.data));
            searchByParam({ isSender: isSender }, 0, size);
          }
        })
        .finally(() => setSaving(false));
    },
    [searchByParam],
  );

  const openNotificationWithIcon = (type: string, isSender: boolean) => {
    if (isSender) {
      notification[type]({
        message: 'C??i ?????t th??ng tin ng?????i g???i th??nh c??ng',
      });
    } else {
      notification[type]({
        message: 'C??i ?????t th??ng tin ng?????i nh???n th??nh c??ng',
      });
    }
  };

  const updateRecord = useCallback(
    (
      contactId: number,
      isSender: boolean,
      record: ContactDto,
      callback?: (success: boolean) => void,
    ) => {
      // setSaving(true);
      contactApi
        .updateContact(contactId, record)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 200);
          }
          if (resp.status === 200) {
            // setDataSource(updateToDataSource(dataSource, resp.data, 'contactId'));
            openNotificationWithIcon('success', isSender);
          }
        })
        .finally(() => searchByParam({ isSender: isSender }, 0, size));
    },
    [],
  );

  const updateBlackList = useCallback(
    (
      phoneNumber: string,
      isSender: boolean,
      isBlacklist: boolean,
      callback?: (success: boolean) => void,
    ) => {
      contactApi
        .updateBlackList(phoneNumber, isBlacklist)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 200);
          }
          if (resp.status === 200) {
            // setDataSource(updateToDataSource(dataSource, resp.data, 'contactId'));
            openNotificationWithIcon('success', isSender);
          }
        })
        .finally(() => searchByParam({ isSender: false, isBlacklist: !isBlacklist }, 0, size));
    },
    [],
  );

  const deleteRecord = useCallback(
    (id: number, callback?: (success: boolean) => void) => {
      setSaving(true);
      contactApi
        .deleteContact(id)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 204);
          }
          if (resp.status === 204) {
            searchByParam(paramSearch, page, size);
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSourceInit],
  );

  const deleteMultiRecord = useCallback(
    (lstId: number[], callback?: (success: boolean) => void) => {
      setSaving(true);
      contactApi
        .deleteMultiContact(lstId)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 204);
          }
          if (resp.status === 204) {
            searchByParam(paramSearch!, page, size);
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSourceInit],
  );

  // v1/contact/address-separate
  const onAddressSeparate = useCallback(
    (lstContacDto: any, callback?: (success: boolean) => void) => {
      setLoading(true);
      contactApi
        .addressSeparate(lstContacDto)
        .then((resp) => {
          if (resp.status === 200) {
            setLstContactAddress(resp?.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  // v1/contact/address-separate
  const onSaveListContact = useCallback(
    (
      contactCreateModel: ContactCreateModel,
      callback?: (success: boolean, contactCreateModel: ContactCreateModel) => void,
    ) => {
      setLoading(true);
      contactApi
        .saveSender(contactCreateModel)
        .then((resp) => {
          // if (resp.status === 200) {
          //   setLstContactAddress(resp?.data?.lstContactDto || []);
          // }
          if (callback) {
            callback(resp.status === 200, resp.data);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  // v1/contact/address-separate
  const onSaveListContactNational = useCallback(
    (
      contactCreateModel: ContactCreateModel,
      callback?: (success: boolean, contactCreateModel: ContactCreateModel) => void,
    ) => {
      setLoading(true);
      contactApi
        .saveSenderNational(contactCreateModel)
        .then((resp) => {
          // if (resp.status === 200) {
          //   setLstContactAddress(resp?.data?.lstContactDto || []);
          // }
          if (callback) {
            callback(resp.status === 200, resp.data);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const onSelectChange = (newSelectedRowKeys: any) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const SelectedAll = () => {
    let newSelectedRowKeys = [];
    newSelectedRowKeys = dataSource.map((element: any) => element.contactId);
    onSelectChange(newSelectedRowKeys);
    setIsShowSelectAll(false);
  };

  const cancelSelectedAll = () => {
    setSelectedRowKeys([]);
    setIsShowSelectAll(true);
  };

  return {
    dataSourceInit,
    setDataSourceInit,
    isLoading,
    isSaving,
    createRecord,
    deleteRecord,
    updateRecord,
    deleteMultiRecord,
    rowSelection,
    SelectedAll,
    cancelSelectedAll,
    isShowSelectAll,
    setIsShowSelectAll,
    selectedRowKeys,
    dataTable,
    setDataTable,
    searchByParam,
    paramSearch,
    updateBlackList,
    onAddressSeparate,
    lstContactAddress,
    setLstContactAddress,
    onSaveListContact,
    onSaveListContactNational,
    totalRecord,
    page,
    setPage,
    size,
    setSize,
    //
    getMcasNationalDtoLst,
    mcasNationalDtoLst,
    getMcasNationalCityDtoLst,
    mcasNationalCityDtoLst,
  };
};
