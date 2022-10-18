import React, { useCallback, useEffect, useState } from 'react';
import { useModel, useLocation, useParams, history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { AuthApi, LoginRequestDTO, LoginResponseDto, LoginResponseDtoTypeEnum, OrgUserDto } from '@/services/client';
import { ACCESS_TOKEN_KEY } from '@/core/contains';
import ChooseOrg from './../login/components/choose-org';
import { notification } from 'antd';

type LoginPage = 'login' | 'choose' | 'loadData';
const authapi = new AuthApi()
const AuthenPostId: React.FC = () => {
    const [loginPage, setLoginPage] = useState<LoginPage>('login');
    const [isLogging, setIsLogging] = useState<boolean>(false);
    const [orgUserList, setOrgUserList] = useState<OrgUserDto[]>([]);
    const [loginRequest, setLoginRequest] = useState<LoginRequestDTO>();
    const [orgCode, setOrgCode] = useState<string>();
    const [message, setMessage] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    //const params: any = useParams();
    console.log('Bat dau chay LoginPostId');

    const loginPostIdWithCode = () => {
        const urlParams = new URLSearchParams(window.location.href);
        if (urlParams !== undefined) {
            const code = urlParams.get('code');
            console.log('code: ', code);
            setLoginRequest(code);
            authapi.getInfoPostId(code, "", "").then(resp => {
                if (resp.status === 200) {
                    const data: LoginResponseDto = resp.data;
                    console.log('login post id', resp);
                    if (data.type === LoginResponseDtoTypeEnum.Success) {
                        setLoginPage('loadData');
                        localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken!);
                        console.log('login post id data.type', data.type);
                        // history.push('/dashboard/');
                        window.location.replace("/");
                        // fetchInitData(data.accessToken!).then(redirectUrl);
                    } else if (data.type === LoginResponseDtoTypeEnum.SelectOrg) {
                        setOrgUserList(data.orgUserList || []);

                        console.log('login post id chon don vi', data.type);
                        setLoginPage('choose');
                    } else if (data.type === LoginResponseDtoTypeEnum.NotVerified) {
                        if (!history) return;
                        //history.push('/auth/register/confirm/' + data.username);
                    } else {
                        //setMessage(data.message);
                        //message.error(data.message);
                        notification.error({ message: 'fffffffffffffffffffffff' + data.message })
                        window.location.replace("/");
                        //history.push('/dashboard/');
                    }
                    //window.location.replace("/");
                }
            })
            urlParams.delete('code');
        }
    }

    const loginPostIdWithOrgCode = (values: LoginRequestDTO) => {
        console.log('values ', values);
        // if (values. !== undefined) {
        //     const code = urlParams.get('code');
        //     console.log('code: ', code);
        //     setLoginRequest(code);
        //     authapi.getInfoPostId("",).then(resp => {
        //         if (resp.status === 200) {
        //             const data: LoginResponseDto = resp.data;
        //             console.log('login post id', resp);
        //             if (data.type === LoginResponseDtoTypeEnum.Success) {
        //                 setLoginPage('loadData');
        //                 localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken!);
        //                 console.log('login post id data.type', data.type);
        //                 // history.push('/dashboard/');
        //                 window.location.replace("/");
        //                 // fetchInitData(data.accessToken!).then(redirectUrl);
        //             } else if (data.type === LoginResponseDtoTypeEnum.SelectOrg) {
        //                 setOrgUserList(data.orgUserList || []);
        //                 console.log('login post id chon don vi', data.type);
        //                 setLoginPage('choose');
        //             } else if (data.type === LoginResponseDtoTypeEnum.NotVerified) {
        //                 if (!history) return;
        //                 //history.push('/auth/register/confirm/' + data.username);
        //             } else {
        //                 //setMessage(data.message);
        //                 //message.error(data.message);
        //                 notification.error({ message: 'fffffffffffffffffffffff' + data.message })
        //                 window.location.replace("/");
        //                 //history.push('/dashboard/');
        //             }
        //             //window.location.replace("/");
        //         }
        //     })
        //     urlParams.delete('code');
        // }
    }

    useEffect(() => {
        loginPostIdWithCode();
    }, []);

    const handleBack = () => {
        setLoginPage('login');
        window.location.replace("/");
    }

    return (
        <>
            {loginPage === 'choose' && <ChooseOrg onLogin={loginPostIdWithOrgCode} isLogging={isLogging} orgUserList={orgUserList} onBack={handleBack} loginRequest={loginRequest} />}
        </>
    );

};

export default AuthenPostId;