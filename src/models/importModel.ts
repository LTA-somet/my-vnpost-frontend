import { useCallback, useEffect, useState } from 'react';
import type { OrderHdrDto } from '@/services/client';
import { OrderHdrApi } from '@/services/client';
import { ImportService } from '@/services/custom-client/ImportService';
import {
  addOfUpdateListToDataSource,
  deleteListIdsFromDataSource,
  updateToDataSource,
} from '@/utils/dataUtil';
import { message } from 'antd';
import { downloadFile } from '@/utils';

const orderHdrApi = new OrderHdrApi();
const importService = new ImportService();
export default () => {
  const [orderHdrList, setOrderHdrList] = useState<OrderHdrDto[]>([]); // tất cả order
  const [orderHdrStatusList, setOrderHdrStatusList] = useState<OrderHdrDto[][]>([]); // đơn hợp lệ

  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const newOrderHdrStatusList: OrderHdrDto[][] = [];
    orderHdrList.forEach((o) => {
      if (!newOrderHdrStatusList[o.status!]) {
        newOrderHdrStatusList[o.status!] = [];
      }
      newOrderHdrStatusList[o.status!].push(o);
    });
    setOrderHdrStatusList(newOrderHdrStatusList);
  }, [orderHdrList]);

  const importOrder = useCallback((formData: FormData, callback?: (success: boolean) => void) => {
    setLoading(true);
    setOrderHdrList([]);
    importService
      .importExcel(formData)
      .then((resp) => {
        if (resp.status === 200) {
          setOrderHdrList(resp.data);
        }
        callback?.(resp.status === 200);
      })
      .finally(() => setLoading(false));
  }, []);

  const onEditOrder = (record: OrderHdrDto) => {
    setOrderHdrList(updateToDataSource(orderHdrList, record, 'orderHdrId'));
  };

  const createListOrderDraft = useCallback(
    (orderHdrListSave: OrderHdrDto[], callback?: (success: boolean) => void) => {
      setLoading(true);
      orderHdrApi
        .createListOrderDraft(orderHdrListSave)
        .then((resp) => {
          if (resp.status === 201) {
            setOrderHdrList(addOfUpdateListToDataSource(orderHdrList, resp.data, 'orderHdrId'));
          }
          callback?.(resp.status === 201);
        })
        .finally(() => setLoading(false));
    },
    [orderHdrList],
  );

  const createListOrder = useCallback(
    (orderHdrListSave: OrderHdrDto[], callback?: (success: boolean) => void) => {
      setLoading(true);
      orderHdrApi
        .createListOrder(orderHdrListSave)
        .then((resp) => {
          if (resp.status === 201) {
            setOrderHdrList(addOfUpdateListToDataSource(orderHdrList, resp.data, 'orderHdrId'));
          }
          callback?.(resp.status === 201);
        })
        .catch((e) => {
          const newOrderHdrListSave = orderHdrListSave.map((o) => ({ ...o, status: '-4' }));
          setOrderHdrList(
            addOfUpdateListToDataSource(orderHdrList, newOrderHdrListSave, 'orderHdrId'),
          );
        })
        .finally(() => setLoading(false));
    },
    [orderHdrList],
  );

  const deleteListOrder = useCallback(
    (orderHdrIds: string[], callback?: (success: boolean) => void) => {
      setOrderHdrList(deleteListIdsFromDataSource(orderHdrList, orderHdrIds, 'orderHdrId'));
      callback?.(true);
    },
    [orderHdrList],
  );

  const exportOrderError = useCallback(() => {
    if (orderHdrStatusList[-3].length === 0) {
      message.error('Không có đơn hàng lỗi');
      return;
    }
    const orderErrors: any[] = orderHdrStatusList[-3].map((o) => {
      const error = o.errors?.length === 0 ? '' : o.errors!.reduce((a, b) => a + ', ' + b);
      return { ...o.importData, error: error };
    });
    orderHdrApi.exportExcelError(orderErrors).then((resp) => {
      downloadFile(resp.data, 'MyVNP_Import_DonHang_Loi.xlsx');
    });
  }, [orderHdrStatusList]);

  return {
    importOrder,
    isLoading,
    orderHdrList,
    orderHdrStatusList,
    onEditOrder,
    createListOrderDraft,
    createListOrder,
    deleteListOrder,
    setOrderHdrList,
    exportOrderError,
  };
};
