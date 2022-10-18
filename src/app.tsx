import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { Link, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { ACCESS_TOKEN_KEY, loginPath, publicPath, validateMessages } from './core/contains';
import jwt_decode from 'jwt-decode';
import { reloadAccessToken } from './core/interceptors/axiosConfig';
import { getInitGlobalData, StoreProps } from './core/initdata';
import { AccountInfo } from './services/client';
import HeaderContent from './components/HeaderContent';
import ForbiddenPage from './components/Pages/403';
import NoFoundPage from './components/Pages/404';
import React from 'react';
import Connect from './components/Connect';
import { ConfigProvider, Empty } from 'antd';
import moment from "moment-timezone";
import vi from 'antd/lib/locale/vi_VN';
import 'moment/locale/vi';

const isDev = process.env.NODE_ENV === 'development';

moment.locale('vi');
moment.tz.setDefault("Asia/Ho_Chi_Minh");

export const initialStateConfig = {
  loading: <PageLoading />,
};

const customRenderEmpty = (componentName?: string) => {
  if (componentName === 'Table') {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Không có dữ liệu'} />;
  }
  return <>Không có dữ liệu</>
}

const Wrapper = ({ children, routes }) => {
  return <Connect>
    <ConfigProvider locale={vi} form={{ validateMessages }} renderEmpty={customRenderEmpty}>
      {React.cloneElement(children, {
        ...children.props,
        routes
      })}
    </ConfigProvider>
  </Connect>
}

export function rootContainer(container: any) {
  return React.createElement(Wrapper, null, container);
}
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export type InitStateProps = {
  settings?: Partial<LayoutSettings>;
  accountInfo?: AccountInfo;
  globalData?: StoreProps;
  fetchInitData?: (accessToken: string) => Promise<InitStateProps>;
}
export async function getInitialState(): Promise<InitStateProps> {
  const getUserInfo = (newAccessToken: string) => {
    const accessToken = newAccessToken || localStorage.getItem(ACCESS_TOKEN_KEY) || '';
    reloadAccessToken(accessToken);
    const accountInfo: AccountInfo = jwt_decode(accessToken);
    return accountInfo;
  };
  const fetchInitData: any = async (accessToken: string): Promise<InitStateProps> => {
    let accountInfo = undefined;
    try {
      accountInfo = getUserInfo(accessToken);
      if (accountInfo) {
        const globalData = await getInitGlobalData();
        return { accountInfo, globalData };
      }
    } catch (error) {
      console.log('error', error)
      return { accountInfo, globalData: undefined };
      // history.push(loginPath);
    }
    return {};
  }
  if (!history.location.pathname.startsWith(publicPath)) {
    const { accountInfo, globalData } = await fetchInitData();
    return {
      fetchInitData,
      accountInfo,
      globalData,
      settings: {},
    };
  }
  return {
    fetchInitData,
    settings: {},
  };
}

const onClickMenu = (path: string) => {
  history.push(path);
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    menuItemRender: (item, dom) => <div className={`nav-link-menu-div`} onClick={() => onClickMenu(item.path!)}>{item.key === '/dashboard' ? <div title={item.name} className={`nav-link-dashboard`}><Link to={item.path!}>{dom}</Link></div> :
      <div title={item.name} className={`nav-link-child-div`}><Link className={`nav-link-child`} to={item.path!}>
        {dom}</Link></div>} </div>,
    subMenuItemRender: (item, dom) => <div id={`nav-link-parent`} className="link-content">{dom}</div>,

    collapsedButtonRender: false,
    headerContentRender: (props) => <HeaderContent {...props} />,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    defaultCollapsed: true,
    breakpoint: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      if (!initialState?.accountInfo && !location.pathname.startsWith(publicPath)) {
        history.push(loginPath);
      }
      if (location.pathname === "/") {
        history.push("/dashboard");
      }
    },
    links: isDev
      ? [
        <a href="http://localhost:8889/swagger-ui/index.html?url=/v3/api-docs" target="_blank">
          <LinkOutlined />
          <span>OpenAPI</span>
        </a>,
        <a href="https://ant.design/components/overview/" target="_blank">
          <BookOutlined />
          <span>Doc AntD</span>
        </a>,
      ]
      : [],
    menuHeaderRender: undefined,
    unAccessible: <ForbiddenPage />,
    noFound: <NoFoundPage />,
    ...initialState?.settings,
  };
};
function useMatch() {
  throw new Error('Function not implemented.');
}

