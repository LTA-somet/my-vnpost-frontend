import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { dataToSelectBox } from '@/utils';
import { AccountApi, ValueComboboxDto } from '@/services/client';
import { Link } from 'umi';

// const accountApi = new AccountApi();
export default () => {
    // const [username, setUsername] = useState<string>();
    // const [dateType, setDateType] = useState<'DD' | 'IW' | 'MONTH'>('IW');
    // const [listUsername, setListUsername] = useState<ValueComboboxDto[]>([]);

    useEffect(() => {
        // accountApi.getChildAccount()
        //     .then(resp => setListUsername(resp.data));
    }, []);

    // const pathAndroid = 'https://install.appcenter.ms/orgs/fis.vnpost/apps/vnpost_android_dev-1/distribution_groups/public';
    const pathAndroid = 'https://play.google.com/store/apps/details?id=vn.vnpost.myvnp';

    return (
        <>
            <PageContainer>
                {/* <Spin spinning={isLoading}> */}
                {/* <Row gutter={[12, 12]}> */}
                <Card size='small'>
                    {/* title='Hướng dẫn tải ứng dụng My VietnamPost beta cho Android' */}

                    <Row gutter={12}>
                        <Col span={12}>
                            <div className='span-font'>Hướng dẫn cài đặt ứng dụng cho ngôn ngữ tiếng việt</div>
                            <br />
                            <iframe width="219" height="450"
                                src="/img/mobile/Android_Viet_1.mp4"
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        </Col>
                        <Col span={12}>
                            <div className='span-font'>Hướng dẫn cài đặt ứng dụng cho ngôn ngữ tiếng anh</div>
                            <br />
                            <iframe width="219" height="450"
                                src="/img/mobile/android_Eng_1.mp4"
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        </Col>
                    </Row>
                    <br />
                    <div className='span-font' style={{ float: 'right' }}>Nhấn <a className='link-outline-warning' href={pathAndroid} target="_blank"><b><i>vào đây</i></b></a>
                        <span> tải về ứng dụng</span></div>
                </Card>

                {/* </Row> */}
                {/* </Spin> */}
            </PageContainer>
        </>
    );
};