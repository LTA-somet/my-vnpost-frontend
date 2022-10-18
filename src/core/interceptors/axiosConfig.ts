import axios from 'axios';
import { notification } from 'antd';
// import Cookies from 'js-cookie';
import proxy from '../../../config/proxy';
import { ACCESS_TOKEN_KEY, loginPath } from '../contains';
import { history } from 'umi';
import { setIsDisconnect } from '@/components/Connect';

const SERVER_PATH = proxy[REACT_APP_ENV || 'dev'];
export const BASE_PATH = SERVER_PATH['/api/'].target;
// const accessToken = Cookies.get(ACCESS_TOKEN_KEY) || '';
const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || '';

export const axiosConfig = () => {
  axios.defaults.baseURL = BASE_PATH;
  axios.defaults.withCredentials = false;
  axios.defaults.headers.common = { Authorization: accessToken, cApiKey: '19001111' };
  axios.interceptors.response.use(handleResponse, handleError);
};

export const reloadAccessToken = (accessTokenValue: string) => {
  axios.defaults.headers.common = { Authorization: accessTokenValue, cApiKey: '19001111' };
};
export const removeAccessToken = () => {
  axios.defaults.headers.common = { Authorization: '', cApiKey: '19001111' };
};

function handleResponse(response: any) {
  if (response.status === 201) {
    notification.success({
      message: 'Lưu dữ liệu thành công',
    });
  } else if (response.status === 204) {
    notification.success({
      message: 'Xoá dữ liệu thành công',
    });
  }
  return response;
}

function handleError(err: any) {
  if (err.response) {
    if (err.response.status === 422) {
      notification.error({
        message: err.response.data.message,
        description: err.response.data.description,
      });
    } else if (err.response.status === 500) {
      notification.error({
        message: 'Lỗi máy chủ',
        description: err.response.data.description,
      });
    } else if (err.response.status === 404) {
      notification.error({
        message: 'Bản ghi không tồn tại',
      });
    } else if (err.response.status === 401) {
      notification.error({
        message: 'Quyền truy cập đã hết hạn',
      });
      removeAccessToken();
      localStorage.clear();
      history.push(loginPath);
    } else if (err.response.status === 403) {
      notification.error({
        message: 'Bạn không có quyền thực hiện chức năng này',
      });
    } else if (err.response.status === 504) {
      notification.error({
        message: 'Không thể kết nối tới máy chủ',
      });
      // history.push(loginPath);
    } else if (err.response.status === 410) {
      notification.error({
        message: 'Thông tin tài khoản đã bị thay đổi',
      });
      removeAccessToken();
      localStorage.clear();
      history.push(loginPath);
    } else {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: err.response.data.message,
      });
    }
  } else {
    const url: string = err?.config?.url;
    if (!url.endsWith('/Health/checkHealth')) {
      setIsDisconnect();
    }
  }
  return Promise.reject(err);
  // return err
}
