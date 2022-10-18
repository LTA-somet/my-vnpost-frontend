import { ConfigDisplayApi, ConfigDisplayDto } from '@/services/client';
import { addToDataSource, deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
import { useCallback, useState } from 'react';

const configDisplayApi = new ConfigDisplayApi();
export default () => {
    const [dataSource, setDataSource] = useState<ConfigDisplayDto[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isSaving, setSaving] = useState<boolean>(false);

    const reload = useCallback((callback?: (success: boolean) => void) => {
        setLoading(true);
        configDisplayApi
            .findAllconfigDisplay()
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
        (record: ConfigDisplayDto, callback?: (success: boolean) => void) => {
            setSaving(true);
            configDisplayApi
                .createconfigDisplay(record)
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
        (id: string, record: ConfigDisplayDto, callback?: (success: boolean) => void) => {
            setSaving(true);
            configDisplayApi
                .updateconfigDisplay(id, record)
                .then((resp) => {
                    if (callback) {
                        callback(resp.status === 201);
                    }
                    if (resp.status === 201) {
                        setDataSource(updateToDataSource(dataSource, resp.data, 'userName'));
                    }
                })
                .finally(() => setSaving(false));
        },
        [dataSource],
    );

    const deleteRecord = useCallback(
        (id: string, callback?: (success: boolean) => void) => {
            setSaving(true);
            configDisplayApi
                .deleteconfigDisplay(id)
                .then((resp) => {
                    if (callback) {
                        callback(resp.status === 204);
                    }
                    if (resp.status === 204) {
                        setDataSource(deleteFromDataSource(dataSource, id, 'uomId'));
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
