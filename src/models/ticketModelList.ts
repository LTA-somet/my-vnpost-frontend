import { useCallback, useState, useEffect } from 'react';
import {
  TicketApi,
  OrderHdrApi,
  McasEmployeeApi,
  OrderHdrDto,
  McasEmployeeDto,
  OrderStatusHistoryDto,
  OrderTemplateApi,
  OrderStatusApi,
  OrderStatusDto,
  TicketFormDataDto,
  TicketGroupTypeDto,
  TicketSubTypeDto,
} from '@/services/client';
import { ImportTicket } from '@/services/custom-client/import-ticket';

import { notification } from 'antd';
const ticketApi = new TicketApi();
const orderHdrApi = new OrderHdrApi();
const importTicket = new ImportTicket();
const mcasEmployeeApi = new McasEmployeeApi();
const orderTemplateApi = new OrderTemplateApi();
const orderStatusApi = new OrderStatusApi();

export default () => {
  const [orderHdrDto, setOrderHdrDto] = useState<OrderHdrDto>();
  const [mcasEmployeeDto, setMcasEmployeeDto] = useState<McasEmployeeDto>();
  const [orderStatusHistoryDto, setOrderStatusHistoryDto] = useState<OrderStatusHistoryDto[]>([]);
  const [orderStatusDto, setOrderStatusDto] = useState<OrderStatusDto[]>([]);
  const [ticketGroupReason, setTicketGroupReason] = useState<any[]>([]);
  const [ticketGroupStatus, setTicketGroupStatus] = useState<any[]>([]);
  const [lstticketStatus, setLstTicketStatus] = useState<any[]>([]);
  const [ticketType, setTicketType] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaveSussece, setIsSaveSussece] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [ticketList, setTicketList] = useState<any[]>([]);
  const [strBase64, setStringBase64] = useState<string>();
  const [ticketFormDataDto, setTicketFormDataDto] = useState<TicketFormDataDto>();
  const [lstTicketGroupTypeDefault, setLstTicketGroupTypeDefault] = useState<TicketGroupTypeDto[]>(
    [],
  );
  const [lstTicketGroupType, setLstTicketGroupType] = useState<any[]>([]);
  const [lstTicketSubType, setLstTicketSubType] = useState<TicketSubTypeDto[]>([]);

  useEffect(() => {
    setOrderHdrDto(undefined);
    setIsSaveSussece(false);
  }, [isSaveSussece]);

  const getInfoEmployee = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    mcasEmployeeApi
      .getCurrentUser()
      .then((resp) => {
        if (resp.status === 200) {
          setMcasEmployeeDto(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getTicketGroupType = useCallback((type: string, callback?: (success: boolean) => void) => {
    setLoading(true);
    ticketApi
      .ticketgroup(type)
      .then((resp: any) => {
        if (resp.status === 200) {
          setTicketGroupReason(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getTicketGroupTypeDefault = useCallback(
    (callback?: (success: boolean, data: TicketGroupTypeDto[]) => void) => {
      setLoading(true);
      ticketApi
        .ticketgroupdefault()
        .then((resp: any) => {
          if (resp.status === 200) {
            setLstTicketGroupTypeDefault(resp?.data || []);
          }
          if (callback) {
            callback(resp.status === 200, resp?.data);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const getTicketGroupStatus = useCallback(
    (type: string, callback?: (success: boolean) => void) => {
      setLoading(true);
      ticketApi
        .ticketgroup(type)
        .then((resp) => {
          if (resp.status === 200) {
            setTicketGroupStatus(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const getOrderStatusHistoryFindOrg = useCallback(
    (itemCode: string, callback?: (success: boolean) => void) => {
      setLoading(true);
      orderTemplateApi
        .orderstatushistoryfindorg(itemCode)
        .then((resp) => {
          if (resp.status === 200) {
            setOrderStatusHistoryDto(resp.data);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const getTicketStatus = useCallback((type: string, callback?: (success: boolean) => void) => {
    setLoading(true);
    ticketApi
      .ticketgroup(type)
      .then((resp) => {
        if (resp.status === 200) {
          setLstTicketStatus(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getTickeType = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    ticketApi
      .ticketType()
      .then((resp) => {
        if (resp.status === 200) {
          setTicketType(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  //Danh muc trang thai
  const getListOrderStatus = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    orderStatusApi
      .findAllOrderStatus()
      .then((resp) => {
        if (resp.status === 200) {
          setOrderStatusDto(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const seachOrderHdrByItemCode = useCallback(
    (itemCode: any, callback?: (success: boolean) => void) => {
      setLoading(true);
      setOrderHdrDto(undefined);
      orderHdrApi
        .findOrderHdrEntityByItemCodeLastVer(itemCode)
        .then((resp) => {
          if (resp.status === 200) {
            console.log('log', resp.data);

            if (resp.data) {
              setOrderHdrDto(resp.data);
            } else {
              notification.info({
                message: 'Không tìm thấy dữ liệu',
              });
            }
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  const seachTicket = useCallback((param: any, callback?: (success: boolean) => void) => {
    setLoading(true);
    ticketApi
      .searchTicket(param)
      .then((resp) => {
        if (resp.status === 200) {
          setTicketList(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getFile = useCallback((filePath: any, callback?: (success: boolean) => void) => {
    setLoading(true);
    ticketApi
      .downloadFile(filePath)
      .then((resp) => {
        if (resp.status === 200) {
          if (resp.data?.result == true) {
            setStringBase64(resp.data?.work);
          } else {
            notification.error({
              message: resp.data?.work,
            });
          }
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const onImportTicket = useCallback((formData: FormData) => {
    setLoading(true);
    importTicket
      .importExcel(formData)
      .then((resp) => {
        console.log(resp.status);
        if (resp.status === 200) {
          if (resp.data?.result == true) {
            setIsSaveSussece(true);
            notification.success({
              message: 'Lưu thành công',
            });
          } else {
            notification.error({
              message: resp.data?.message,
            });
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const updateIsTicket = useCallback((idHdr: any, callback?: (success: boolean) => void) => {
    setLoading(true);
    orderHdrApi
      .updateIsTicket(idHdr)
      .then((resp) => {
        if (resp.status === 200) {
          if (resp.data) {
            if (resp?.data?.success == true) {
              notification.success({
                message: 'Cập nhật trạng thái ticket thành công',
              });
            }
          }
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // v1/ticket/ticketFormData
  const getTicketFormData = useCallback(
    (itemCode: string, callback?: (success: boolean, data: TicketFormDataDto) => void) => {
      setLoading(true);
      setTicketFormDataDto(undefined);
      ticketApi
        .ticketFormData(itemCode)
        .then((resp) => {
          console.log('setTicketFormDataDto123');
          if (resp.status === 200) {
            setTicketFormDataDto(resp.data);
          }
          if (callback) {
            callback(resp.status === 200, resp.data);
          }
        })
        .catch(() => {
          setTicketFormDataDto({});
        })
        .finally(() => setLoading(false));
    },
    [],
  );
  //v1/ticket/creatTicketCMS
  const creatTicketCMSApi = useCallback(
    (ticketFormSubmit: any, callback?: (success: boolean) => void) => {
      setLoading(true);
      ticketApi
        .creatTicketCMS(ticketFormSubmit)
        .then((resp) => {
          if (resp.status === 200) {
            const data: any = resp?.data;
            if (data?.result == true) {
              notification.success({
                message: 'Yêu cầu của quý khách đã được tạo thành công, mã số ' + data?.work,
              });
            } else {
              notification.error({
                message: data?.work,
              });
            }
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setLoading(false));
    },
    [],
  );

  //v1/ticket/getTicketSubTypeAll
  const getTicketSubType = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    ticketApi
      .ticketSubType()
      .then((resp) => {
        if (resp.status === 200) {
          setLstTicketSubType(resp?.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    isLoading,
    ticketList,
    strBase64,
    orderHdrDto,
    setOrderHdrDto,
    isSaveSussece,
    mcasEmployeeDto,
    ticketGroupReason,
    ticketType,
    lstticketStatus,
    orderStatusHistoryDto,
    orderStatusDto,
    ticketGroupStatus,
    getInfoEmployee,
    setStringBase64,
    seachTicket,
    getFile,
    onImportTicket,
    seachOrderHdrByItemCode,
    getTicketGroupType,
    getTickeType,
    getTicketStatus,
    getOrderStatusHistoryFindOrg,
    getListOrderStatus,
    getTicketGroupStatus,
    updateIsTicket,
    //
    getTicketFormData,
    ticketFormDataDto,
    setTicketFormDataDto,
    creatTicketCMSApi,
    getTicketGroupTypeDefault,
    lstTicketGroupTypeDefault,
    setLstTicketGroupType,
    lstTicketGroupType,
    getTicketSubType,
    lstTicketSubType,
  };
};
