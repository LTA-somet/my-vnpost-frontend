import { McasAppDto, AppApi } from '@/services/client';
import { addToDataSource, deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
import { useCallback, useState } from 'react';

const appApi = new AppApi();
export default () => {
    const [dataSource, setDataSource] = useState<McasAppDto[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isSaving, setSaving] = useState<boolean>(false);

    const reload = useCallback((callback?: (success: boolean) => void) => {
        setLoading(true);
        appApi
            .findAllApp()
            .then((resp) => {
                if (resp.status === 200) {
                    setDataSource(resp.data);
                }
                if (callback) {
                    callback(resp.status === 200);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const createRecord = useCallback(
        (record: McasAppDto, callback?: (success: boolean) => void) => {
            setSaving(true);
            appApi
                .createApp(record)
                .then((resp) => {
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

    const updateRecord = useCallback(
        (id: string, record: McasAppDto, callback?: (success: boolean) => void) => {
            setSaving(true);
            appApi
                .updateApp(id, record)
                .then((resp) => {
                    if (callback) {
                        callback(resp.status === 201);
                    }
                    if (resp.status === 201) {
                        setDataSource(updateToDataSource(dataSource, resp.data, 'appCode'));
                    }
                })
                .finally(() => setSaving(false));
        },
        [dataSource],
    );

    const deleteRecord = useCallback(
        (id: string, callback?: (success: boolean) => void) => {
            setSaving(true);
            appApi
                .deleteApp(id)
                .then((resp) => {
                    if (callback) {
                        callback(resp.status === 204);
                    }
                    if (resp.status === 204) {
                        setDataSource(deleteFromDataSource(dataSource, id, 'p'));
                    }
                })
                .finally(() => setSaving(false));
        },
        [dataSource],
    );

    return {
        dataSource,
        reload,
        isLoading,
        isSaving,
        deleteRecord,
        createRecord,
        updateRecord,
    };
};
