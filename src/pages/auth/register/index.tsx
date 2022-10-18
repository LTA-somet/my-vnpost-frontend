import React, { useState } from 'react';
import { history } from 'umi';
import { AuthApi, RegisterDto } from '@/services/client';
import RegisterForm from './components/register-form';
// import '../index.less'
import { formatStart84 } from '@/utils/PhoneUtil';

import '../scss/theme.css';
import '../scss/style.css';
import '../plugins/bootstrap/dist/css/bootstrap.min.css';
import '../plugins/fontawesome-free/css/all.min.css';
import '../plugins/ionicons/dist/css/ionicons.min.css';
import '../plugins/icon-kit/dist/css/iconkit.min.css';
import '../plugins/perfect-scrollbar/css/perfect-scrollbar.css';
import '../plugins/datatables.net-bs4/css/dataTables.bootstrap4.min.css'

const authApi = new AuthApi()
const Login: React.FC = () => {
    const [isRegistering, setRegistering] = useState<boolean>(false);

    const redirectUrl = (username: string) => {
        history.push({
            pathname: '/auth/register/confirm/' + username,
        });
        return;
    }

    const handleRegister = (values: RegisterDto) => {
        setRegistering(true);
        values.phoneNumber = formatStart84(values.phoneNumber);
        authApi.register(values).then(resp => {
            if (resp.status === 200) {
                redirectUrl(resp.data.username!);
            }
        }).finally(() => setRegistering(false));
    };

    return (
        <>
            <RegisterForm isRegistering={isRegistering} onRegister={handleRegister} />
        </>
    );
};

export default Login;
