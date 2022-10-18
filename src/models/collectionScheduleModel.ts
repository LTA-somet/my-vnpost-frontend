import type { CollectionScheduleDto, CollectOrderSearchDto } from '@/services/client/api';
import { CollectionScheduleApi } from '@/services/client/api';
import { notification } from 'antd';
import moment from 'moment';
import { useCallback, useState } from 'react';

const collectionScheduleApi = new CollectionScheduleApi();
export default () => {
  const [dataSource, setDataSource] = useState<CollectionScheduleDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [totalRecord, setTotalRecord] = useState<any>();
  const [paramSearch, setParamSearch] = useState<CollectOrderSearchDto>();
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);

  const searchAllByParam = useCallback(
    (param: CollectOrderSearchDto, p: number, s: number, callback?: (success: boolean) => void) => {
      setIsLoading(true);
      setParamSearch(param);
      collectionScheduleApi
        .searchCollectionSchedule(p, s, param)
        .then((resp) => {
          if (resp.status === 200) {
            setDataSource(resp.data);
            setTotalRecord(resp.headers['x-total-count']);
          }
          if (callback) {
            callback(resp.status === 200);
          }
        })
        .finally(() => setIsLoading(false));
    },
    [],
  );

  const onCreate = useCallback(
    (record: CollectionScheduleDto, callback?: (success: boolean) => void) => {
      const recordSave = JSON.parse(JSON.stringify(record));
      recordSave!.collectCalendars!.forEach((element: any) => {
        element.collectTime = moment(element.collectTime).format('HH:mm');
      });
      collectionScheduleApi.createCollectionSchedule(recordSave).then((resp) => {
        if (callback) {
          callback(resp.status === 201);
        }
        if (resp.status === 201) {
          setShowEdit(false);
          searchAllByParam(paramSearch!, page, size);
        }
      });
    },
    [],
  );

  const updateRecord = useCallback(
    (scheduleId: number, record: CollectionScheduleDto, callback?: (success: boolean) => void) => {
      const recordSave = JSON.parse(JSON.stringify(record));
      recordSave!.collectCalendars!.forEach((element: any) => {
        element.collectTime = moment(element.collectTime).format('HH:mm');
      });
      collectionScheduleApi.updateCollectionSchedule(scheduleId, recordSave).then((resp) => {
        if (callback) {
          callback(resp.status === 200);
        }
        if (resp.status === 200) {
          // setDataSource(updateToDataSource(dataSource, resp.data, 'contactId'));
          notification.success({ message: 'Sửa lịch thu gom thành công' });
          setShowEdit(false);
          searchAllByParam(paramSearch!, page, size);
        }
      });
      // .finally(() => searchByParam({ isSender: isSender }, 0, size));
    },
    [],
  );

  const deleteRecord = useCallback(
    (id: number, callback?: (success: boolean) => void) => {
      collectionScheduleApi.deleteCollectionSchedule(id).then((resp) => {
        if (callback) {
          callback(resp.status === 204);
        }
        if (resp.status === 204) {
          searchAllByParam(paramSearch!, page, size);
        }
      });
    },
    [dataSource],
  );

  return {
    searchAllByParam,
    updateRecord,
    deleteRecord,
    paramSearch,
    totalRecord,
    onCreate,
    dataSource,
    showEdit,
    setShowEdit,
    isLoading,
    setIsLoading,
    page,
    setPage,
    size,
    setSize,
  };
};
