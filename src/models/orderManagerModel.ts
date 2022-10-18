import type {
  DmFeildDisplayEntity,
  OrderHdrDisplayDto,
  ParamSearchAllDto,
} from '@/services/client';
import {
  ConfigDisplayApi,
  DmFeildDisplayApi,
  OrderHdrApi,
  ProductApi,
  OrderCorrectionControllerApi,
  OrderCorrectionApi,
} from '@/services/client';
import { notification } from 'antd';
import type React from 'react';
import { useCallback, useState } from 'react';
import { history } from 'umi';
// import { ScrollMenu } from 'react-horizontal-scrolling-menu';

const configDisplayApi = new ConfigDisplayApi();
const orderHdrApi = new OrderHdrApi();
const productApi = new ProductApi();
const dmFeildDisplayApi = new DmFeildDisplayApi();
const orderCorrectionControllerApi = new OrderCorrectionControllerApi();
const orderCorrectionApi = new OrderCorrectionApi();

export default () => {
  // const [isView, setIsView] = useState<boolean>(false);

  const [paramSearch, setParamSearch] = useState<ParamSearchAllDto>();
  const [recordDisplay, setRecordDisplay] = useState<any>();
  const [recordOrderHdr, setRecord] = useState<OrderHdrDisplayDto>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [isShowSelectAll, setIsShowSelectAll] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listDmFeildDisplay, setListDmFeildDisplay] = useState<DmFeildDisplayEntity[]>([]);
  const [checkedList, setCheckedList] = useState<React.Key[]>([]);
  const [lstStatus, setLstStatus] = useState<any[]>([]);
  const [orderHdrTableFilter, setOrderHdrTableFilter] = useState<OrderHdrDisplayDto[]>([]);
  const [opAccounts, setOpAccounts] = useState<any[]>([]);
  const [opDelegater, setOpDelegater] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [totalRecord, setTotalRecord] = useState<number>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // lấy loại vận đơn ở url query
  // console.log(orderTypeInit);

  //get List Collumn
  const getListDmFieldDisplay = () => {
    dmFeildDisplayApi
      .getAllDmFeilDisplay()
      .then((res) => {
        // get data danh mục
        // Bạn có thể xem lại bài viết về useState()
        setListDmFeildDisplay(res.data);
      })
      .catch((err) => {
        //Trường hợp xảy ra lỗi
        console.log(err);
      });
    configDisplayApi.findByCurrentUser().then((resp) => {
      if (resp.status === 200) {
        setRecordDisplay(resp.data);
        const record = resp.data;
        if (record) {
          const colCodeList = record.listColCode?.split(',');
          const lstStatusTemp = record.listOrderStatus?.split(',').map((lst) => parseInt(lst));
          setCheckedList(colCodeList!);
          setLstStatus(lstStatusTemp!);
          if (paramSearch) {
            paramSearch!.lstStatus = lstStatusTemp;
          }
        } else {
          setLstStatus([]);
          if (paramSearch) {
            paramSearch!.lstStatus = [];
          }
        }
      }
    });
  };

  //Lấy tài khoản cha hoặc tài khoản con List<ValueComboboxDto> getAccounts
  const getOpAccountChild = useCallback((callback?: (success: boolean) => void) => {
    setIsLoading(true);
    getListDmFieldDisplay();
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
      .finally(() => setIsLoading(false));
  }, []);

  const searchByParam = useCallback(
    (param: any, p: number, s: number, callback?: (success: boolean) => void) => {
      setIsLoading(true);
      console.log(param);

      orderHdrApi
        .searchAllByParam(param, p, s)
        .then((resp: any) => {
          if (resp.status === 200) {
            setTotalRecord(resp.headers['x-total-count']);
            setOrderHdrTableFilter(resp.data);
            if (!isShowSelectAll) {
              setSelectedRowKeys(resp.data.map((element: any) => element.orderHdrId));
            }
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setIsLoading(false));
    },
    [isShowSelectAll],
  );

  const onCancelOrder = () => {
    orderCorrectionControllerApi
      .findOrderByItemCodeAndVer(recordOrderHdr?.itemCode as string, '9999')
      .then((res) => {
        if (res.status === 200) {
          orderCorrectionApi.cancelOrder(res.data).then((resp) => {
            if (resp.status === 201 || resp.status === 200) {
              notification.success({ message: 'Đã lưu thông tin rút bưu gửi' });
              history.push('/manage/order-manager');
              setIsModalLoading(false);
              setIsModalVisible(false);
            }
          });
        }
      });
  };

  const getOpDelegater = useCallback((account: string, callback?: (success: boolean) => void) => {
    setIsLoading(true);
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
      .finally(() => setIsLoading(false));
  }, []);

  return {
    orderHdrTableFilter,
    getOpDelegater,
    onCancelOrder,
    searchByParam,
    getOpAccountChild,
    // orderTypeInit,
    // location,
    setOrderHdrTableFilter,
    opDelegater,
    setOpDelegater,
    setOpAccounts,
    opAccounts,
    lstStatus,
    paramSearch,
    setParamSearch,
    setLstStatus,
    getListDmFieldDisplay,
    setListDmFeildDisplay,
    listDmFeildDisplay,
    totalRecord,
    checkedList,
    setCheckedList,
    setTotalRecord,
    recordDisplay,
    setRecordDisplay,
    isLoading,
    setIsLoading,
    isModalVisible,
    setIsModalVisible,
    isModalLoading,
    setIsModalLoading,
    recordOrderHdr,
    setRecord,
    selectedRowKeys,
    setSelectedRowKeys,
    selectedKeys,
    setSelectedKeys,
    expandedKeys,
    setExpandedKeys,
    pageSize,
    setPageSize,
    page,
    setPage,
    isShowSelectAll,
    setIsShowSelectAll,
  };
};
