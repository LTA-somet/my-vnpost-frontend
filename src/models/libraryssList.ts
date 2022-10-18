//import { getAllLocales } from './../.umi/plugin-locale/localeExports';
import { LibraryInfoDto } from './../services/client/api';
import { LibraryTypeDto } from './../services/client/api';
import { LibraryInfoApi } from '@/services/client';
import { useCallback, useState } from 'react';
import { addToDataSource, deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
import { ImportService } from '@/services/custom-client/ImportService';

//import { addToDataSource, deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
const importService = new ImportService();
const libraryInfoApi = new LibraryInfoApi();
export default () => {
  const [dataSource, setDataSource] = useState<LibraryInfoDto[]>([]);
  const [dataSourceType, setDataSourceType] = useState<LibraryTypeDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [dataTable, setDataTable] = useState<LibraryInfoDto[]>([]);

  const reload = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    libraryInfoApi
      .getLibrary()
      .then((resp) => {
        if (resp.status === 200) {
          setDataSource(resp.data);
          // console.log(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const loadType = useCallback((callback?: (success: boolean) => void) => {
    setLoading(true);
    libraryInfoApi
      .getLibraryType()
      .then((resp) => {
        if (resp.status === 200) {
          setDataSourceType(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const importLibrary = useCallback(
    (formData: FormData, callback?: (success: boolean) => void) => {
      setSaving(true);

      setDataSource([]);
      importService
        .createLibrary(formData)
        .then((resp) => {
          //   if (resp.status === 200) {
          //     // setDataSource(addToDataSource(dataSource, resp.data));
          //     // console.log('dataSource', dataSource);

          //     // dataSource.sort();
          //     reload();
          //   }
          //   if (callback) {
          //     callback(resp.status === 200);
          //   }
          // })
          // .finally(() => setSaving(false));
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            setDataSource(addToDataSource(dataSource, resp.data));
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );

  const updateLibrary = useCallback(
    (libraryInfoId: number, formData: FormData, callback?: (success: boolean) => void) => {
      setSaving(true);

      // setDataSource([]);
      importService
        .updateLibrary(libraryInfoId, formData)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 201);
          }
          if (resp.status === 201) {
            setDataSource(updateToDataSource(dataSource, resp.data, 'libraryInfoId'));
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );
  // const createRecord = useCallback(
  //   (record: LibraryInfoDto, callback?: (success: boolean) => void) => {
  //     setSaving(true);
  //     libraryInfoApi
  //       .createlibraryInfo()
  //       .then((resp) => {
  //         if (callback) {
  //           callback(resp.status === 201);
  //         }
  //         if (resp.status === 201) {
  //           setDataSource(addToDataSource(dataSource, resp.data));
  //         }
  //       })
  //       .finally(() => setSaving(false));
  //   },
  //   [dataSource],
  // );
  const getListTypeLibrary = useCallback((callback?: (success: boolean) => void) => {
    libraryInfoApi.getLibraryType().then((resp) => {
      if (resp.status === 200) {
        setDataSourceType(resp.data);
      }
      if (callback) {
        callback(resp.status === 200);
      }
    });
  }, []);
  // const updateRecord = useCallback(
  //   (id: number, record: LibraryInfoDto, callback?: (success: boolean) => void) => {
  //     setSaving(true);
  //     libraryInfoApi
  //       .updatelibraryInfo(id, record)
  //       .then((resp) => {
  //         if (callback) {
  //           callback(resp.status === 201);
  //         }
  //         if (resp.status === 201) {
  //           setDataSource(updateToDataSource(dataSource, resp.data, 'gtgtCode'));
  //         }
  //       })
  //       .finally(() => setSaving(false));
  //   },
  //   [dataSource],
  // );

  const deleteRecord = useCallback(
    (id: number, callback?: (success: boolean) => void) => {
      setSaving(true);
      libraryInfoApi
        .deletelibraryInfo(id)
        .then((resp) => {
          if (callback) {
            callback(resp.status === 204);
          }
          if (resp.status === 204) {
            setDataSource(deleteFromDataSource(dataSource, id, 'libraryInfoId'));
          }
        })
        .finally(() => setSaving(false));
    },
    [dataSource],
  );
  return {
    dataSource,
    setDataSource,
    dataSourceType,
    reload,
    loading,
    isSaving,
    loadType,
    importLibrary,
    deleteRecord,
    updateLibrary,
    //createRecord,
    getListTypeLibrary,
    dataTable,
    setDataTable,
    // updateRecord,
  };
};
