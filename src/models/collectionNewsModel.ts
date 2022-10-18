import type { CollectionOrderDto, CollectOrderSearchDto } from '@/services/client/api';
import { CollectionOrderApi } from '@/services/client/api';
import { useCallback, useState } from 'react';

const collectionOrderApi = new CollectionOrderApi();
export default () => {
  const [dataSource, setDataSource] = useState<CollectionOrderDto[]>([]);
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
      collectionOrderApi
        .searchCollectionOrder(p, s, param)
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
    (record: CollectionOrderDto, callback?: (success: boolean) => void) => {
      collectionOrderApi.createCollectionOrder(record).then((resp) => {
        if (callback) {
          callback(resp.status === 201);
        }
        if (resp.status === 201) {
          setShowEdit(false);
          searchAllByParam(paramSearch!, 0, size);
        }
      });
    },
    [],
  );

  // const deleteRecord = useCallback(
  //   (id: number, callback?: (success: boolean) => void) => {
  //     accountReplaceApi.deleteAccountReplace(id).then((resp) => {
  //       if (callback) {
  //         callback(resp.status === 204);
  //       }
  //       if (resp.status === 204) {
  //         setDataSource(deleteFromDataSource(dataSource, id, 'id'));
  //         // searchAllByParam({});
  //       }
  //     });
  //   },
  //   [dataSource],
  // );
  return {
    searchAllByParam,
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
