import React, { useEffect, useState } from 'react';
import { Input, Row, Col, Modal, Space, Button, Table, Card, Spin, notification } from 'antd';
import { SearchOutlined, PlusCircleOutlined, LockOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { AccountApi, AccountDto } from '@/services/client';
import { Link } from 'umi';
import defineColumns from './columns';
import { ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import EditFormEmployee from '@/pages/setting/account/employee-manager/edit-form';

const accountApi = new AccountApi();
const SearchCustomer: React.FC = () => {
    const [customers, setCustomers] = useState<AccountDto[]>([]);
    const [viewCustomer, setViewCustomer] = useState<AccountDto>();
    const [isOpenView, setOpenView] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const onLoadAccountCreatedByCurrentUser = () => {
        setLoading(true);
        accountApi.findAllEmployeeCreatedByMe()
            .then(resp => resp.status === 200 && setCustomers(resp.data))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        onLoadAccountCreatedByCurrentUser();
    }, []);

    const onSearch = (value: string) => {
        if (value) {
            setLoading(true);
            accountApi.searchAccountByPhoneOrName(value)
                .then(resp => resp.status === 200 && setCustomers(resp.data))
                .finally(() => setLoading(false));
        } else {
            onLoadAccountCreatedByCurrentUser();
        }
    }

    const onResetPassword = (record: AccountDto) => {
        accountApi.resetPasswordForUsername(record.username!)
            .then(resp => {
                if (resp.status === 200) {
                    notification.success({ message: 'Gửi yêu cầu đặt lại mật khẩu khách hàng thành công' })
                }
            }).finally(() => setLoading(false));
    }

    const confirmResetPassword = (record: AccountDto) => {
        // setOpenModel(true);
        Modal.confirm({
            title: `Bạn muốn đặt lại mật khẩu mới cho khách hàng ${record.fullname}`,
            content: 'Mật khẩu mới sẽ gửi về Số điện thoại của khách hàng',
            icon: <ExclamationCircleOutlined />,
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk() {
                onResetPassword(record);
            }
        });

    }

    const handleView = (record: AccountDto) => {
        setViewCustomer(record);
        setOpenView(true);
    }

    const action = (username: string, record: AccountDto): React.ReactNode => {
        return <Space key={username}>
            <Button className="btn-outline-secondary" size="small" onClick={() => handleView(record)}><EyeOutlined /></Button>
            <Button className="btn-outline-danger" size="small" onClick={() => confirmResetPassword(record)}><LockOutlined /></Button>
        </Space >
    }
    const columns: any[] = defineColumns(action);

    return (
        <PageContainer>
            <Spin spinning={loading}>
                <Card className="fadeInRight">
                    <Row>
                        <Col span={14} >
                            <Space className="button-group" style={{ textAlign: 'end', width: '100%' }}>
                                <Link to={'/manager-user/create-customer'}><Button className="custom-btn1 btn-outline-info"><PlusCircleOutlined />Thêm mới</Button></Link>
                            </Space>
                        </Col>
                        <Col span={10}>
                            <Input.Search placeholder="Nhập Số điện thoại/Email/Tên thành viên" allowClear enterButton={<SearchOutlined />} onSearch={(value) => onSearch(value)} width={250} />
                        </Col>
                    </Row>
                    <Table
                        size='small'
                        dataSource={customers}
                        columns={columns}
                        bordered
                        pagination={{ showSizeChanger: true }}
                    />
                </Card>
            </Spin>
            <EditFormEmployee
                visible={isOpenView}
                setVisible={setOpenView}
                onEdit={() => { }}
                record={viewCustomer}
                isSaving={false}
                isView={true}
                isShowRole={false}

            />
        </PageContainer>
    );
};
export default SearchCustomer;