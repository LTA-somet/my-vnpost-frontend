import React, { useState, useEffect } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Space, Spin, Table, message, notification, Input, Col, Row, Select } from 'antd';
import defineColumns from './columns';
import { useModel, useLocation } from 'umi';
import { NotifyManagerDto, NotifyManagerApi, DmNotifyApi } from '@/services/client';
import { PageContainer } from '@ant-design/pro-layout';
import ViewLibraryInfo from './../library-manager/view';



const notifyManagerApi = new NotifyManagerApi();
const dmNotifyApi = new DmNotifyApi();

const NotifyManager: React.FC = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dataTable, setDataTable] = useState<NotifyManagerDto[]>([]);
    const [dataTableOrigin, setDataTableOrigin] = useState<NotifyManagerDto[]>([]);
    const [dataTableNotifyGroup, setDataTableNotifyGroup] = useState<any[]>([]);

    // const params: any = useParams();
    // const notRead = params.notRead;
    const location: any = useLocation();
    const iReadInit = (location?.query?.notRead === 'NotRead' ? 0 : 1) || 0;
    const notifyData = location?.state.notifyData || [];

    //console.log('notifyyyyyyyyyyyyy', notifyData);
    const reload = () => {
        //console.log('reload lll đafsafd: ', iReadInit, ' location.state.notifyData ', location.state.notifyData);
        setIsLoading(true);
        if (location.state.statusRead === 'ALL') {
            notifyManagerApi.getNotifyManagerByUser(2).then(resp => {
                if (resp.status === 200) {
                    //console.log('ds thong bao ', resp.data);
                    setDataTable(resp.data.filter(d => d.libraryInfoId === null || d.libraryInfoId === undefined));
                    setDataTableOrigin(resp.data.filter(d => d.libraryInfoId === null || d.libraryInfoId === undefined));
                }
            }
            ).catch((err) => {
                notification.error({ message: "Lỗi trong khi lấy danh sách thông báo! " + err });
            }).finally(() => {
                setIsLoading(false);
            });

            dmNotifyApi.getAllByNotifyGroup().then(resp => {
                if (resp.status === 200) {
                    //console.log('ds thong bao ', resp.data);
                    setDataTableNotifyGroup(resp.data)
                }
            })
        }
        else {
            setDataTable(notifyData);
            setDataTableOrigin(notifyData);
            notifyManagerApi.updateRead(location?.state.iId).then(resp => {
                if (resp.status === 200) {
                    message.success("Thông báo này đã được đánh dấu đã đọc")
                }
            }).catch((err) => {
                message.error("Lỗi trong khi thực hiện đánh dấu đọc! " + err);
            });
            setIsLoading(false);
        }

    }

    useEffect(() => {
        reload();

    }, [iReadInit, notifyData]);


    const handleDelete = (record: NotifyManagerDto) => {
        //console.log('handleDelete ', record);
        setIsLoading(true);

        notifyManagerApi.deleteNotify(record.id).then(resp => {
            if (resp.status !== 204) {
                message.error("Có lỗi trong khi xóa thông báo");
            }
        }).catch((err) => {
            message.error("Lỗi trong khi thực hiện xóa thông báo! " + err)
        }).finally(() => {
            setIsLoading(false);
        })
    }

    const action = (id: number, record: NotifyManagerDto): React.ReactNode => {
        return <Space key={id}>
            <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                onConfirm={() => handleDelete(record)}
                okText="Đồng ý"
                cancelText="Hủy bỏ"
            >
                <Button size="small"><DeleteOutlined style={{ color: 'red' }} /></Button>
            </Popconfirm>
        </Space>
    }


    const columns: any[] = defineColumns(action);
    const onSearch = (value: string) => {
        console.log(' dataTable ', dataTable, ' value ', value, 'notifyData ', notifyData);

        setDataTable(dataTableOrigin.filter(d => (d.notifyGroupName?.includes(value) || value === undefined)))

    }
    return (
        <PageContainer>
            <Spin spinning={isLoading}>
                <Card className="fadeInRight" >
                    <Row gutter={24}>
                        <Col span={16}></Col>
                        <Col span={8}>
                            <Select style={{ width: "100%" }} allowClear onChange={(value) => onSearch(value)} placeholder="Tìm theo loại thông báo">
                                {/* <Select.Option key={""} value="">Tất cả</Select.Option> */}
                                {
                                    dataTableNotifyGroup.map((row) => {
                                        return (
                                            <Select.Option key={row?.notifyGroupName}>{row?.notifyGroupName}</Select.Option>
                                        );
                                    })
                                }

                            </Select>
                            {/* <Input.Search placeholder='Lọc theo loại thông báo' allowClear onSearch={(value) => onSearch(value)} width={150}></Input.Search> */}
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={24}>
                        <Col span={24}>
                            <Table
                                size='small'
                                dataSource={dataTable}
                                columns={columns}
                                bordered
                            />
                        </Col>
                    </Row>

                </Card>
            </Spin>
        </PageContainer>
    );
};

export default NotifyManager;