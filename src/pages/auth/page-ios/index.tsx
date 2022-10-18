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

    const pathIOS = 'https://install.appcenter.ms/orgs/fis.vnpost/apps/vnpost_ios_uat/distribution_groups/public';

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
                            <iframe width="220" height="450"
                                src="/img/mobile/IOS_Viet_1.mp4"
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        </Col>
                        <Col span={12}>
                            <div className='span-font'>Hướng dẫn cài đặt ứng dụng cho ngôn ngữ tiếng anh</div>
                            <br />
                            <iframe width="220" height="450"
                                src="/img/mobile/IOS_Eng_1.mp4"
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        </Col>
                    </Row>
                    <br />
                    <div className='span-font' style={{ float: 'right' }}>Nhấn <a className='link-outline-warning' href={pathIOS} target="_blank"><b><i>vào đây</i></b></a>
                        <span> tải về ứng dụng</span></div>
                </Card>

                {/* </Row> */}
                {/* </Spin> */}
            </PageContainer>
        </>
    );
};