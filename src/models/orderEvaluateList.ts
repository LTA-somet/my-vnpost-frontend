import type {
  OrderHdrDto,
  CollectionDetailDto,
  VasPropsDetailDto,
  OrderImageDto,
  OrderStatusHistoryDto,
  DeliveryDto,
  OrderCaseDto,
  PnsResponCallHistoryDto,
  OrderMapValueNameDto,
} from '@/services/client';
import { OrderHdrApi, OrderTemplateApi, PnsApi } from '@/services/client';
import { useCallback, useState } from 'react';
import { notification } from 'antd';

const orderHdrApi = new OrderHdrApi();
const orderTemplateApi = new OrderTemplateApi();
const pnsApi = new PnsApi();
export default () => {
  const [orderHdr, setOrderHdr] = useState<OrderHdrDto>();
  const [orderBilling, setOrderBilling] = useState<any[]>([]);
  const [orderColection, setOrderColection] = useState<CollectionDetailDto[]>([]);
  const [vasPropsDetail, setVasPropsDetauil] = useState<VasPropsDetailDto[]>([]);
  const [orderImage, setOrderImage] = useState<OrderImageDto[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderStatusHistoryDto[]>([]);
  const [deliveryHistory, setDeliveryHistory] = useState<DeliveryDto[]>([]);
  const [orderCaseDto, setOrderCaseDto] = useState<OrderCaseDto[]>([]);
  const [orderCallHistory, setOrderCallHistory] = useState<PnsResponCallHistoryDto>();
  const [orderMapValueNameDto, setOrderMapValueNameDto] = useState<OrderMapValueNameDto[]>([]);
  const [postMan, setPostMan] = useState<any>();
  const [orderTemplate, setOrderTemplate] = useState<any>();
  const [feeDetailDto, setFeeDetailDto] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const findById = useCallback((id: string, callback?: (success: boolean) => void) => {
    setLoading(true);
    orderHdrApi
      .findOrderHdrById(id)
      .then((resp) => {
        if (resp.status === 200) {
          setOrderHdr(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getListBillingOrderHdrID = useCallback(
    (id: string, callback?: (success: boolean) => void) => {
      setLoading(true);
      orderTemplateApi
        .searchOrderBillingByOrderHdrId(id)
        .then((resp) => {
          if (resp.status === 200) {
            setOrderBilling(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const getOrderTemplateByHdrID = useCallback(
    (id: number, callback?: (success: boolean) => void) => {
      setLoading(true);
      orderTemplateApi
        .findOrderTemplateById(id)
        .then((resp) => {
          if (resp.status === 200) {
            setOrderTemplate(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const getFeeOrderDto = useCallback(
    (
      originalId: string,
      status: number,
      isReceived: boolean,
      callback?: (success: boolean) => void,
    ) => {
      setLoading(true);
      orderTemplateApi
        .feeOrder(originalId, status, isReceived)
        .then((resp) => {
          if (resp.status === 200) {
            setFeeDetailDto(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const getCollectionDetailDto = useCallback(
    (originalId: string, callback?: (success: boolean) => void) => {
      setLoading(true);
      orderTemplateApi
        .collection(originalId)
        .then((resp) => {
          if (resp.status === 200) {
            setOrderColection(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const getVasPropsDetail = useCallback(
    (id: string, isExtend: any, callback?: (success: boolean) => void) => {
      setLoading(true);
      orderTemplateApi
        .vasPropDetail(id, isExtend)
        .then((resp) => {
          if (resp.status === 200) {
            setVasPropsDetauil(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const getOrderImageByIdhdr = useCallback((id: string, callback?: (success: boolean) => void) => {
    setLoading(true);
    orderTemplateApi
      .image(id)
      .then((resp) => {
        if (resp.status === 200) {
          setOrderImage(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  //L??u ???nh
  const saveOrderImage = useCallback(
    (lstImage: any, id: string, callback?: (success: boolean) => void) => {
      setLoading(true);
      orderTemplateApi
        .saveImage(lstImage)
        .then((resp) => {
          if (resp.status === 200) {
            if (resp.data.success == true) {
              notification.success({
                message: 'L??u th??nh c??ng',
              });
              getOrderImageByIdhdr(id);
            }
          } else {
            notification.error({
              message: 'Kh??ng l??u ???????c',
            });
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [getOrderImageByIdhdr],
  );

  //Tra c???u th??ng tin tr???ng th??i
  const getOrderHistory = useCallback((itemCode: string, callback?: (success: boolean) => void) => {
    setLoading(true);
    orderTemplateApi
      .history(itemCode)
      .then((resp) => {
        if (resp.status === 200) {
          setOrderHistory(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  //Tra c???u l???ch s??? ph??t h??ng
  const getDeliveryHistory = useCallback(
    (itemCode: string, callback?: (success: boolean) => void) => {
      setLoading(true);
      orderTemplateApi
        .delivery(itemCode)
        .then((resp) => {
          if (resp.status === 200) {
            setDeliveryHistory(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  //Tra cuu thong tin lich su hieu chinh
  // v1/OrderTemplate/case
  const getListOrderCase = useCallback(
    (itemCode: string, callback?: (success: boolean) => void) => {
      setLoading(true);
      orderTemplateApi
        ._case(itemCode)
        .then((resp) => {
          if (resp.status === 200) {
            setOrderCaseDto(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  //Tra c???u l???ch s??? cu???c g???i
  const getCallHistoty = useCallback((idHdr: string, callback?: (success: boolean) => void) => {
    setLoading(true);
    pnsApi
      .getCallHistory(idHdr)
      .then((resp) => {
        if (resp.status === 200) {
          setOrderCallHistory(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  //Tra c???u B??u t?? ph??t h??ng
  const getPostmanInfo = useCallback((itemCode: string, callback?: (success: boolean) => void) => {
    setLoading(true);
    pnsApi
      .searchPostman(itemCode)
      .then((resp) => {
        if (resp.status === 200) {
          if (resp?.data?.code == '00') {
            setPostMan(resp?.data);
          }
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);
  //Map value to name
  const getMapValueToName = useCallback((idHdr: string, callback?: (success: boolean) => void) => {
    setLoading(true);
    orderTemplateApi
      .mapvalue(idHdr)
      .then((resp) => {
        if (resp.status === 200) {
          setOrderMapValueNameDto(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    orderHdr,
    isLoading,
    orderBilling,
    orderTemplate,
    feeDetailDto,
    orderColection,
    vasPropsDetail,
    orderImage,
    orderHistory,
    deliveryHistory,
    orderCaseDto,
    orderCallHistory,
    orderMapValueNameDto,
    postMan,
    findById,
    getListBillingOrderHdrID,
    getOrderTemplateByHdrID,
    getFeeOrderDto,
    getCollectionDetailDto,
    getVasPropsDetail,
    getOrderImageByIdhdr,
    saveOrderImage,
    getOrderHistory,
    getDeliveryHistory,
    getListOrderCase,
    getCallHistoty,
    getMapValueToName,
    getPostmanInfo,
  };
};
