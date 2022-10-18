import type { LoginRequestDTO, OrgUserDto } from '@/services/client';
import { Card, List, notification, PageHeader, Row } from 'antd';
import React from 'react';
// import '../../index.less';

const ChooseOrg: React.FC<Props> = (props: Props) => {

    const onSelectOrg = (orgUserDto: OrgUserDto) => {
        if (orgUserDto.isLocked) {
            return;
        }
        if (!props.loginRequest) {
            notification.error({ message: 'Có lỗi xảy ra' });
            return;
        }
        const newLoginRequest: LoginRequestDTO = { ...props.loginRequest, orgCode: orgUserDto.orgCode }
        props.onLogin(newLoginRequest);
    }

    return (
        <Card className='fadeInBottom' style={{ marginLeft: '-45px', marginRight: '-15%', top: '10px', borderRadius: '8px' }}>
            <PageHeader
                style={{ marginLeft: '-8%', marginTop: '-40px' }}
                className="site-page-header"
                onBack={() => props.onBack()}
                title={<div style={{ fontSize: '14px' }}>Chọn tổ chức:</div>}

            // subTitle={`Tài khoản của bạn đang được gắn với ${props.orgUserList.length} tổ chức`}

            >
                <p style={{ textAlign: 'center', marginTop: '-20px' }}>{`Tài khoản của bạn đang được gắn với ${props.orgUserList.length} tổ chức`}</p>
                <List
                    style={{ marginLeft: '5%', width: '100%', textAlign: 'center', overflow: 'auto', height: '340px' }}
                    itemLayout="horizontal"
                    dataSource={props.orgUserList}
                    bordered
                    renderItem={item => (
                        <List.Item key={item.orgCode} onClick={() => onSelectOrg(item)} className={item.isLocked ? "org-item-locked" : "org-item"}>
                            <List.Item.Meta
                                title={item.orgName + (item.isLocked ? ' - Đã khoá' : '')}
                                description={`${item.orgCode} - ${item.orgAddress}`}
                            />
                        </List.Item>
                    )}
                />
            </PageHeader>
        </Card >
    )
}
type Props = {
    orgUserList: OrgUserDto[],
    onLogin: (payload: LoginRequestDTO) => void,
    isLogging: boolean,
    onBack: () => void,
    loginRequest?: LoginRequestDTO
}
export default ChooseOrg;