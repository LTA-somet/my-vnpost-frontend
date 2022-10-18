import React, { useMemo } from 'react';
import { DownOutlined, LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Col, Menu, message, Row, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { ACCESS_TOKEN_KEY, loginPath } from '@/core/contains';
import { removeAccessToken } from '@/core/interceptors/axiosConfig';
import './style.css';
import { AccountApi, LoginResponseDtoTypeEnum, OrgUserDto } from '@/services/client';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
export const logout = () => {
  localStorage.clear();
  removeAccessToken();
  const { query = {}, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== loginPath && !redirect) {
    history.replace({
      pathname: loginPath,
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const gotoUrl = () => {
  if (!history) return;
  const { query } = history.location;
  const { redirect } = query as { redirect: string };
  window.location.replace(redirect || '/');
  return;
}

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const accountApi = new AccountApi();

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );
  const { accountInfo, globalData } = initialState!;

  const orgUserList = useMemo(() => {
    const orgList: OrgUserDto[] = globalData?.accountSetting.orgUserList ?? [];
    return orgList.filter(org => org.orgCode !== accountInfo?.org).sort((a, b) => a.isLocked ? 1 : -1)
  }, [accountInfo, globalData]);

  const accountReplaceList = useMemo(() => {
    return globalData?.accountSetting.accountReplaceList ?? [];
  }, [globalData]);

  if (!initialState) {
    return loading;
  }

  if (!accountInfo || !accountInfo.uid) {
    return loading;
  }

  const onSwitchOrg = (org: OrgUserDto) => {
    if (org.isLocked) {
      return;
    }
    accountApi.switchOrg(org.orgCode!)
      .then(resp => {
        if (resp.data.type === LoginResponseDtoTypeEnum.Success) {
          localStorage.setItem(ACCESS_TOKEN_KEY, resp.data.accessToken!);
          setInitialState((s) => ({ ...s, currentUser: undefined, globalData: undefined }));
          gotoUrl();
        } else {
          message.error('Có lỗi xảy ra!')
        }
      });
  }

  const onSwitchAccountReplace = (username: string, orgCode: string) => {
    accountApi.switchAccountReplace(username, orgCode)
      .then(resp => {
        if (resp.data.type === LoginResponseDtoTypeEnum.Success) {
          localStorage.setItem(ACCESS_TOKEN_KEY, resp.data.accessToken!);
          setInitialState((s) => ({ ...s, currentUser: undefined, globalData: undefined }));
          gotoUrl();
        } else {
          message.error('Có lỗi xảy ra!')
        }
      });
  }

  const exitAccountReplace = () => {
    accountApi.escapeAccountReplace()
      .then(resp => {
        if (resp.data.type === LoginResponseDtoTypeEnum.Success) {
          localStorage.setItem(ACCESS_TOKEN_KEY, resp.data.accessToken!);
          setInitialState((s) => ({ ...s, currentUser: undefined, globalData: undefined }));
          gotoUrl();
        } else {
          message.error('Có lỗi xảy ra!')
        }
      });
  }

  const onLogout = () => {
    setInitialState((s) => ({ ...s, currentUser: undefined, globalData: undefined }));
    logout();
    return;
  }

  const onChangePass = () => {
    history.push('/setting/account/change-password')
  }

  const renderSwitchOrg = () => {
    return <>
      {!accountInfo.isEmployee && orgUserList.length > 0 && <Menu.SubMenu key={'switchOrg'} title="Chuyển đơn vị">
        {orgUserList?.map((o, index) =>
          <Menu.Item key={o.orgCode} disabled={o.isLocked} style={{ textAlign: 'center', borderBottom: index === orgUserList.length - 1 ? '' : '1px solid #dddddd' }}>
            <div style={{ width: 300 }} onClick={() => onSwitchOrg(o)}>
              <div style={{ fontSize: 18, padding: 5 }}>{o.orgName + (o.isLocked ? ' - Đã khoá' : '')}</div>
              <div style={{ color: '#999999' }}>{o.orgCode} - {o.orgAddress}</div>
            </div>
          </Menu.Item>
        )}
      </Menu.SubMenu>}
    </>
  };

  const switchUserReplace = () => {
    return <>
      {accountInfo.isEmployee && accountReplaceList.length > 0 && <Menu.SubMenu key={'switchUserReplace'} title="Nhập thay thế">
        {accountReplaceList?.map((o, index) =>
          <Menu.Item key={`${o.id}`} disabled={o.isLocked} style={{ textAlign: 'center', borderBottom: index === accountReplaceList.length - 1 ? '' : '1px solid #dddddd' }}>
            <div style={{ width: 300 }} onClick={() => onSwitchAccountReplace(o.username!, o.orgCode!)}>
              <div style={{ fontSize: 18, padding: 5 }}>{o.accReplaceName + (o.isLocked ? ' - Đã khoá' : '')}</div>
              <div style={{ color: '#999999' }}>{o.orgCode} - {o.orgName}</div>
            </div>
          </Menu.Item>
        )}
      </Menu.SubMenu>}
      {accountInfo.owner !== accountInfo.uid && <Menu.Item key={`exit`} onClick={exitAccountReplace} >
        Thoát tài khoản nhập thay thế
      </Menu.Item>}
    </>
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]}>
      <div className='g-menu-panel'>
        <Row className='g-menu-row'>
          <Col span={10}>Đơn vị</Col>
          <Col span={14}>{accountInfo.org}</Col>
        </Row>
        <Menu.Divider />
        <Row className='g-menu-row'>
          <Col span={10}>Mã tài khoản</Col>
          <Col span={14}>{accountInfo.owner}</Col>
        </Row>
      </div>
      <Menu.Divider />
      {renderSwitchOrg()}
      {switchUserReplace()}
      <Menu.Divider />

      <Row>
        <Col span={12}>
          <div onClick={onChangePass} className="g-bottom-item">
            <LockOutlined />
            Đổi mật khẩu
          </div>
        </Col>
        <Col span={12}>
          <div onClick={onLogout} className="g-bottom-item">
            <LogoutOutlined />
            Đăng xuất
          </div>
        </Col>
      </Row>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown} trigger={['click']}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={''} alt="avatar" icon={<UserOutlined />} />
        <span className={`${styles.name} anticon g-avatar`}>{accountInfo.ufn} <DownOutlined style={{ fontSize: 13 }} /></span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
