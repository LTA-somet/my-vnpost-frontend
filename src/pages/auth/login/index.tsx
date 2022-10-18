import React, { useEffect, useState } from 'react';
import { history, Link, useHistory, useLocation, useModel, useParams } from 'umi';
import { ACCESS_TOKEN_KEY } from '@/core/contains';
import { LoginRequestDTO, LoginResponseDto, MapBdtTinhApi, MapBdtTinhUserCallAndChatDto, OrgUserDto } from '@/services/client';
import { LoginResponseDtoTypeEnum } from '@/services/client';
import { AuthApi } from '@/services/client';
import LoginForm from './components/login-form';
import ChooseOrg from './components/choose-org';
import { Alert, Button, notification, Space, } from 'antd';
// import './css/sb-admin-2.min.css';
// import './css/style.css';
import './css/login.css';
import LoadingPage from '@/components/LoadingPage';

import '../scss/theme.css';
import '../scss/style.css';
import '../plugins/bootstrap/dist/css/bootstrap.min.css';
import '../plugins/fontawesome-free/css/all.min.css';
import { FacebookOutlined } from '@ant-design/icons';

// import '../plugins/ionicons/dist/css/ionicons.min.css';
// import '../plugins/icon-kit/dist/css/iconkit.min.css';
// import '../plugins/perfect-scrollbar/css/perfect-scrollbar.css';
// import '../plugins/datatables.net-bs4/css/dataTables.bootstrap4.min.css'

type LoginPage = 'login' | 'choose' | 'loadData' | 'choosePostId';
const Login: React.FC = (props: any) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [loginPage, setLoginPage] = useState<LoginPage>('login');
  const [orgUserList, setOrgUserList] = useState<OrgUserDto[]>([]);
  const [loginRequest, setLoginRequest] = useState<LoginRequestDTO>();
  const [message, setMessage] = useState<string>();
  const [acceptTokenPostId, setAcceptTokenPostId] = useState<string>();

  const mapBdtTinhApi = new MapBdtTinhApi();
  const authApi = new AuthApi();
  const isEmployee = props.route.isEmployee || false;
  const urlParams = new URLSearchParams(window.location.href);

  useEffect(() => {
    if (history.location.pathname.startsWith('/auth/mobile/login')) {
      if (!history) return;
      const { query } = history.location;
      const { code } = query as { code: string };

      const nextUrl = 'my-vnpost-vn://?code=' + code;
      console.log('nextUrl', nextUrl);

      window.location.replace(nextUrl);
    }
  }, [])
  if (history.location.pathname.startsWith('/auth/mobile/login')) {
    return <></>
  }

  // lấy thông tin global dataconsole.log('Bat dau chay LoginPostId');
  const fetchInitData = async (accessToken: string) => {
    const initData = await initialState?.fetchInitData?.(accessToken);
    if (initData) {
      await setInitialState((s) => ({
        ...s,
        ...initData,
      }));
    }
  };

  const redirectUrl = () => {
    if (!history) return;
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    history.push(redirect || '/');
    return;
  }

  const gotoUrl = () => {
    // if (!history) return;
    // const { query } = history.location;
    // const { redirect } = query as { redirect: string };
    // window.location.replace(redirect || '/');
    window.location.replace('/');
    return;
  }

  const handleLogin = (values: LoginRequestDTO) => {
    setIsLogging(true);
    setMessage('');
    const payload = { ...values, isEmployee, os: 'WEB' }
    setLoginRequest(payload);
    authApi.login(payload).then(resp => {
      console.log('payload: ', payload);
      if (resp.status === 200) {
        const data: LoginResponseDto = resp.data;
        if (data.type === LoginResponseDtoTypeEnum.Success) {
          setLoginPage('loadData');
          localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken!);
          gotoUrl();
          // fetchInitData(data.accessToken!).then(redirectUrl);
        } else if (data.type === LoginResponseDtoTypeEnum.SelectOrg) {
          setOrgUserList(data.orgUserList?.sort((a, b) => a.isLocked ? 1 : -1) || []);
          setLoginPage('choose');
        } else if (data.type === LoginResponseDtoTypeEnum.NotVerified) {
          if (!history) return;
          history.push('/auth/register/confirm/' + data.username);
        } else if (data.type === LoginResponseDtoTypeEnum.ChangePassword) {
          if (!history) return;
          history.push({
            pathname: '/auth/restore-password',
            query: {
              actionType: payload.username.includes("@") ? 'EMAIL' : 'PHONE',
              value: payload.username
            }
          });
        } else {
          setMessage(data.message);
        }
      }
    }).finally(() => setIsLogging(false))
  };

  const openloginPostId = async (): Promise<string> => {
    const features = 'toolbar=no,location=no,directories=no,menubar=no,scrollbars=yes,resizable=yes,status=yes,left=0,top=0';
    const url = 'https://postid.vnpost.vn';
    const request = 'auth/realms/idp/protocol/openid-connect/auth';
    const domain = window.location.origin;

    let clientId = `client_id=myvnp-pro&client_secret='7f43383b-7687-434b-9a27-30ca6a2934b1'`;
    const paramsUrl = `response_type=code&scope=openid`;

    if (!domain.includes('my.vnpost.vn')) {
      clientId = `client_id=myvnp-dev&client_secret='089475b1-cc8d-45d6-8b35-0e175d47c241'`;
      console.log('UAT-DEV-DOMAIN', domain, ' clientId ', clientId);
    }
    const redirectUri = `redirect_uri=${encodeURIComponent(domain + '/auth/login/')}`;
    const page = window.open(`${url}/${request}?${clientId}&${redirectUri}&${paramsUrl}`, '_self', features);
    let i = 0;
    let params = null;
    //console.log('page: ', page)
    while (!params && i < 1000) {
      params = localStorage.getItem('params-post-id');
      //await sleep(500);
      await new Promise(resolve => setTimeout(resolve, 500));
      i++;
    }
    //console.log('pagepagepagepage ->: pagepagepage:', page)
    //localStorage.removeItem('params-post-id');

    // const urlParams = new URLSearchParams(params);
    // const codeParam = urlParams.get('code');
    //console.log('ddd', codeParam, 'params : ', params);
    page.close();
  }

  const handleBack = () => {
    setLoginPage('login');
  }

  const loginWithCodePostId = () => {
    console.log('login post id', urlParams);
    if (urlParams.get('code') !== null && urlParams.get('code') !== undefined) {
      const code = urlParams.get('code') || '';
      console.log('code: ', code);
      setLoginRequest(code);
      authApi.getInfoPostId(code, "", "").then(resp => {
        if (resp.status === 200) {
          const data: LoginResponseDto = resp.data;
          //console.log('login post id', resp);
          if (data.type === LoginResponseDtoTypeEnum.Success) {
            setLoginPage('loadData');
            localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken!);
            //console.log('login post id data.type', data.type);
            // history.push('/dashboard/');
            window.location.replace("/");
            // fetchInitData(data.accessToken!).then(redirectUrl);
          } else if (data.type === LoginResponseDtoTypeEnum.SelectOrg) {
            setOrgUserList(data.orgUserList?.sort((a, b) => a.isLocked ? 1 : -1) || []);
            setAcceptTokenPostId(data.accessTokenPostId);
            //console.log('login post id chon don vi', data.type);
            setLoginPage('choosePostId');
          } else if (data.type === LoginResponseDtoTypeEnum.NotVerified) {
            if (!history) return;
            //history.push('/auth/register/confirm/' + data.username);
          } else {
            //setMessage(data.message);
            //message.error(data.message);
            notification.error({ message: data.message })
            window.location.replace("/");
            //history.push('/dashboard/');
          }
        }
      })
      urlParams.delete('code');
    }
  }

  const loginWithOrgCodePostId = (values: LoginRequestDTO) => {
    //console.log('login post id values', values.orgCode);
    if (values !== null) {
      authApi.getInfoPostId("", values.orgCode, acceptTokenPostId).then(resp => {
        if (resp.status === 200) {
          const data: LoginResponseDto = resp.data;
          console.log('login post id', resp);
          if (data.type === LoginResponseDtoTypeEnum.Success) {
            setLoginPage('loadData');
            localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken!);
            // history.push('/dashboard/');
            window.location.replace("/");
            // fetchInitData(data.accessToken!).then(redirectUrl);
          } else if (data.type === LoginResponseDtoTypeEnum.SelectOrg) {
            setOrgUserList(data.orgUserList?.sort((a, b) => a.isLocked ? 1 : -1) || []);
            setLoginPage('choosePostId');
          } else if (data.type === LoginResponseDtoTypeEnum.NotVerified) {
            if (!history) return;
            history.push('/auth/register/confirm/' + data.username);
          } else {
            //setMessage(data.message);
            notification.error({ message: data.message })
            window.location.replace("/");
            //history.push('/dashboard/');
          }
        }
      })
    }

  }

  //Get record by TCT = '00'
  const [objCallChat, setObjCallChat] = useState<MapBdtTinhUserCallAndChatDto>({});
  const getDataMapBdtTinh = () => {
    mapBdtTinhApi.findDataByTct().then((res) => {
      if (res.status === 200) {
        setObjCallChat(res.data);
      }
    })
  }

  useEffect(() => {
    loginWithCodePostId();
    getDataMapBdtTinh();
  }, []);
  if (loginPage === 'loadData') {
    return (
      <LoadingPage />
    )
  }

  return (
    <>
      <body style={{ overflowY: "clip" }}>
        <div className="auth-wrapper">
          <div className="container-fluid h-100">
            <div className="row flex-row h-100 bg-light">
              <div className="col-xl-8 col-lg-6 col-md-5 p-0 d-md-block d-lg-block d-sm-none d-none">
                <div className="lavalite-bg" style={{ backgroundImage: `url('/img/auth/30.jpg')` }}>

                  {/* <div className="myChat" style={{ float: "right", marginTop: "67%", display: "flex" }}>
                    <a href={`tel:${objCallChat.hotLine}`} target="_blank">
                      <div style={{ borderRight: '1px dotted #fff', marginTop: '16px', height: '18px' }}>

                      </div>
                      <div style={{ marginTop: '-30px' }}>
                        <i style={{ marginTop: 2, fontSize: 30, padding: "0 15px", color: '#fff', transform: 'rotate(90deg)' }} className="fa fa-phone-square"></i>
                        <p style={{ marginTop: '1px' }} className="placeholder-network">Tel</p>
                      </div>
                    </a>

                    <a href={objCallChat.facebook} target="_blank" style={{ marginTop: 2 }}>
                      <div style={{ borderRight: '1px dotted #fff', marginTop: '14px', height: '18px' }}>

                      </div>
                      <div style={{ marginTop: '-28px' }}>
                        <FacebookOutlined style={{ fontSize: 30, padding: "0 15px", color: '#fff' }} />
                        <p style={{ marginTop: '2px' }} className="placeholder-network">Facebook</p>
                      </div>
                    </a>

                    <a href={objCallChat.zalo} target="_blank">
                      <div style={{ borderRight: '1px dotted #fff', marginTop: '15px', height: '18px' }}>

                      </div>
                      <div style={{ marginTop: '-28px' }}>
                        <img style={{ padding: '0px 15px' }} src='/img/auth/zalo.png' alt="zalo" />
                        <p style={{ marginTop: '-3px' }} className="placeholder-network">Zalo</p>
                      </div>
                    </a>

                    <a href={objCallChat.viber} target="_blank" style={{ marginTop: 6 }}>
                      <img style={{ padding: "0 15px" }} src='/img/auth/viber.png' alt="viber" />
                      <p style={{ marginTop: '2px' }} className="placeholder-network">Viber</p>
                    </a>
                  </div> */}

                  <div className="lavalite-overlay"></div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-7 my-auto p-0">
                <div style={{ backgroundColor: 'white', height: '115vh' }}>
                  <div className="authentication-form mx-auto">
                    <div className="logo-centered">
                      <a href="../index.html"> <img src='/img/auth/logo.png' style={{ width: '50%', marginRight: '24%', marginLeft: '20%' }} /></a>
                    </div>
                    <h3>Sign In to Vietnam Post</h3>
                    <p>Happy to see you again!</p>

                    {
                      loginPage === 'login' && <>
                        <div className="form-group">
                          {message && <Alert message={message} type='error' style={{ marginBottom: 24 }} />}
                          <LoginForm onLogin={handleLogin} isLogging={isLogging} isEmployee={isEmployee} />
                        </div>
                        {
                          !isEmployee &&
                          <>
                            <div className="sign-btn-chip text-center">
                              <button className="btn_login btn-post-id" onClick={openloginPostId}>Đăng nhập với Post ID</button>
                            </div>
                            {/* <div className="sign-btn-chip text-center">
                              <button className="btn_login btn-fb">Đăng nhập Facebook</button>
                            </div>
                            <div className="sign-btn-chip text-center">
                              <button className="btn_login btn-zalo">Đăng nhập Zalo</button>
                            </div> */}
                            <div className="sign-btn-chip text-center">
                              {isEmployee ? <Link to="/auth/login"><b> Đăng nhập với tư cách là người sử dụng</b></Link> : <Link to="/auth/employee/login"><b> Đăng nhập với tư cách là nhân viên VNPost</b></Link>}
                            </div>
                            <div style={{ paddingTop: 20 }}>
                              Bạn chưa có tài khoản?
                              <Link to="/auth/register"><b> Đăng ký ngay</b></Link>
                            </div>
                            <div className="center">
                              <Space direction='horizontal' style={{ paddingTop: 5 }}>
                                <a href='https://play.google.com/store/apps/details?id=vn.vnpost.myvnp' className="google_play" target="_blank">
                                  <img src="/img/dashboard/googleplay.svg" alt="google play" width={130} />
                                </a>
                                <a href='https://apps.apple.com/vn/app/my-vietnam-post-plus/id1629841662' className="app_store" target="_blank">
                                  <img src="/img/dashboard/appstore.svg" alt="app store" width={130} />
                                </a>
                              </Space>
                            </div>
                            <div className="center" style={{ paddingTop: 10 }}>
                              <h2 style={{ fontSize: 16 }}>Vui lòng liên hệ với chúng tôi</h2>
                            </div>
                            <div className="center myChat">
                              <Space direction='horizontal' style={{ paddingTop: 5, background: "#0b5291", borderRadius: 5 }}>
                                <a href={`tel:${objCallChat.hotLine}`} target="_blank">
                                  <div style={{ borderRight: '1px dotted #fff', marginTop: '16px', height: '18px' }}>

                                  </div>
                                  <div style={{ marginTop: '-30px' }}>
                                    <i style={{ marginTop: 2, fontSize: 30, padding: "0 15px", color: '#fff', transform: 'rotate(90deg)' }} className="fa fa-phone-square"></i>
                                    <p style={{ marginTop: '1px' }} className="placeholder-network">Tel</p>
                                  </div>
                                </a>
                                <a href={objCallChat.facebook} target="_blank" style={{ marginTop: 2 }}>
                                  <div style={{ borderRight: '1px dotted #fff', marginTop: '14px', height: '18px' }}>

                                  </div>
                                  <div style={{ marginTop: '-28px' }}>
                                    <FacebookOutlined style={{ fontSize: 30, padding: "0 15px", color: '#fff' }} />
                                    <p style={{ marginTop: '2px' }} className="placeholder-network">Facebook</p>
                                  </div>
                                </a>

                                <a href={objCallChat.zalo} target="_blank">
                                  <div style={{ borderRight: '1px dotted #fff', marginTop: '15px', height: '18px' }}>

                                  </div>
                                  <div style={{ marginTop: '-28px' }}>
                                    <img style={{ padding: '0px 15px' }} src='/img/auth/zalo.png' alt="zalo" />
                                    <p style={{ marginTop: '-3px' }} className="placeholder-network">Zalo</p>
                                  </div>
                                </a>
                                <a href={objCallChat.viber} target="_blank" style={{ marginTop: 6 }}>
                                  <img style={{ padding: "0 15px" }} src='/img/auth/viber.png' alt="viber" />
                                  <p style={{ marginTop: '3px' }} className="placeholder-network">Viber</p>
                                </a>
                              </Space>
                            </div>

                          </>
                        }
                      </>
                    }
                    {
                      loginPage === 'choosePostId' &&
                      <>
                        <ChooseOrg onLogin={loginWithOrgCodePostId} isLogging={isLogging} orgUserList={orgUserList} onBack={handleBack} loginRequest={loginRequest} />
                      </>
                    }
                    {
                      loginPage === 'choose' && <>
                        <ChooseOrg onLogin={handleLogin} isLogging={isLogging} orgUserList={orgUserList} onBack={handleBack} loginRequest={loginRequest} />
                      </>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default Login;
