import { HealthApi } from '@/services/client';
import { ActuatorApi } from '@/services/custom-client/actuator';
import { Button, Result, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

export let setIsDisconnect: any = undefined;
const healthApi = new HealthApi();
const Connect = ({ children }) => {
    const [disconnect, setDisconnect] = useState<boolean>(false);
    const [connecting, setConnecting] = useState<boolean>(false);

    const onTestConnect = () => {
        if (!connecting) {
            setConnecting(true);
            healthApi.checkHealth()
                .then(resp => {
                    if (resp.status === 200) {
                        // setDisconnect(false);
                        window.location.reload();
                    }
                })
                .catch(e => {
                    setTimeout(() => {
                        setConnecting(false)
                    }, 2000)
                })
            // .finally(() => setConnecting(false));
        }
    }

    const onDisconnect = () => {
        if (!disconnect) {
            setDisconnect(true);
            onTestConnect();
        }
    }

    useEffect(() => {
        setIsDisconnect = onDisconnect;
    }, []);

    if (disconnect) {
        return <Result
            status="500"
            title="500"
            subTitle="Không thể kết nối tới máy chủ"
            extra={
                connecting ? <Spin spinning={true} /> :
                    <Button type="primary" onClick={onTestConnect}>
                        Thử lại
                    </Button>
            }
        />
    }
    return (
        <>
            {children}
        </>
    );
};

export default Connect;