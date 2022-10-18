import type { ContactDto, ParamContactDto, ContactCreateModel } from '@/services/client';
import { ContactApi } from '@/services/client';
import { deleteFromDataSource, deleteListIdsFromDataSource } from '@/utils/dataUtil';
import { notification } from 'antd';
import { useCallback, useState } from 'react';

const contactApi = new ContactApi();
export default () => {
  const [dataSource, setDataSource] = useState<ContactDto[]>([]);
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

  // const reload = useCallback((isSender: boolean, callback?: (success: boolean) => void) => {
  //   setLoading(true);
  //   contactApi
  //     .findAllByCurrentUser(isSender)
  //     .then((resp) => {
  //       if (resp.status === 200) {
  //         setDataSource(resp.data);
  //       }
  //       if (callback) {
  //         callback(resp.status === 200);
  //       }
  //     })
  //     .finally(() => setLoading(false));
  // }, []);
  const searchByParam = useCallback(
    (param: ParamContactDto, p: number, s: number, callback?: (success: boolean) => void) => {
      setLoading(true);
      setParamSearch(param);
      contactApi
        .searchByContactParam(param, p, s)
        .then((resp) => {
          if (resp.status === 200) {
            setDataSource(resp.data);
            setTotalRecord(resp.headers['x-total-count']);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

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
        message: 'Cài đặt thông tin người gửi thành công',
      });
    } else {
      notification[type]({
        message: 'Cài đặt thông tin người nhận thành công',
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
    [dataSource],
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
    [dataSource],
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
    dataSource,
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
  };
};
