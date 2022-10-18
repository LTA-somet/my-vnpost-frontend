import { AppApi, PostalNumberApi, SelectDTO, PostalNumberCalDto, ApiResponse } from '@/services/client';
import { useCallback, useState } from 'react';
import { notification } from 'antd';

const appApi = new AppApi();
const postalNumberApi = new PostalNumberApi();
export default () => {
    const [postalNumberCal, setPostalNumber] = useState<PostalNumberCalDto[]>([]);
    const [categoryServiceGroup, setCategoryServiceGroup] = useState<SelectDTO[]>([]);
    const [apiResponse, setApiResponse] = useState<ApiResponse>();
    const [isLoading, setLoading] = useState<boolean>(false);



    const getCategoryServiceGroup = useCallback((type: string, callback?: (success: boolean) => void) => {
        setLoading(true);
        appApi
            .appparam(type)
            .then((resp) => {
                if (resp.status === 200) {
                    setCategoryServiceGroup(resp.data);
                }
                if (callback) {
                    callback(resp.status === 200);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const getPostalNumberCal = useCallback((serviceGroup: string, callback?: (success: boolean) => void) => {
        setLoading(true);
        postalNumberApi
            .searchPostalNumber(serviceGroup)
            .then((resp) => {
                if (resp.status === 200) {
                    setPostalNumber(resp.data);
                }
                if (callback) {
                    callback(resp.status === 200);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const savePostalNumber = useCallback((customerCode: string, posCode: string, callback?: (success: boolean) => void) => {
        setLoading(true);
        postalNumberApi
            .savePostalNumber(customerCode, posCode)
            .then((resp) => {
                if (resp.status === 200) {
                    // setApiResponse(resp.data);
                    if (resp.data?.success == false) {
                        notification.error({
                            message: resp.data?.message
                        })
                    } else {
                        notification.success({
                            message: "Cấp thành công " + resp.data?.message + " số hiệu bưu gửi"
                        })
                    }

                }
                if (callback) {
                    callback(resp.status === 200);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    return {
        postalNumberCal,
        categoryServiceGroup,
        isLoading,
        apiResponse,
        getCategoryServiceGroup,
        getPostalNumberCal,
        savePostalNumber
    }
}