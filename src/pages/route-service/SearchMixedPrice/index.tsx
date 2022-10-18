import React from 'react';
import { AccountReplaceDto, McasOrganizationStandardApi, McasOrganizationStandardDto } from '@/services/client';
import { Card, Col, Input, Row, Button, Select, Spin, Form, Table, Space, AutoComplete, Divider } from 'antd';
import { DeleteOutlined, SearchOutlined, PlusCircleOutlined, CheckSquareOutlined, BorderOutlined, EditOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useModel, Link, useHistory } from 'umi';
import defineColumns from './columns';
import SearchCusomter from '../PopupCustomer';

export default (props: Props) => {

    const [, setPage] = React.useState(1);
    const { isLoading, onDeleteData, setLstSearchRouterSameValueDto, lstSearchRouterSameValueDto, } = useModel('routeServiceSamePriceModels');
    const [isShowSelectAll, setIsShowSelectAll] = useState<boolean>(true);
    const [isOpenPopupSearchCustomer, setIsOpenPopupSearchCustomer] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    const history = useHistory();

    const dataSource = lstSearchRouterSameValueDto;
    const setDataSource = setLstSearchRouterSameValueDto;

    const deleteRecord = (index: number, record: any) => {
        const newDataSource = [...dataSource];
        console.log("id: ", index);
        if (record?.routerId) {
            const param: any = {
                type: 'DGHH',
                ids: [record?.routerId]
            }
            onDeleteData(param, ((success: boolean) => {
                console.log("abc", success);

                if (success == true) {
                    newDataSource.splice(index, 1);
                    console.log("newDataSource", newDataSource);
                    setDataSource(newDataSource);
                }
            }));
        } else {
            if (index >= 0) {
                newDataSource.splice(index, 1);
                setDataSource(newDataSource);
            }
        }

    }

    const editRecord = (index: number, record: any) => {
        history.push("/setting/route-service-same-price/edit-mixed-price/" + record?.routerId);
    }


    const action = (index: any, record: any): React.ReactNode => {
        return <Space key={index}>
            <Button className="btn-outline-info" onClick={() => editRecord(index, record)} size="small"><EditOutlined /></Button>
            <Button className="btn-outline-danger" onClick={() => deleteRecord(index, record)} size="small"><DeleteOutlined /></Button>
        </Space>
    }

    const columns: any[] = defineColumns(action);

    const onAddCustomerToTable = (data: any) => {
        console.log("dataAdd", data);
        setDataSource(data);

    }

    const onSelectChange = (newSelectedRowKeys: any) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const SelectedAll = () => {
        let newSelectedRowKeys = [];
        newSelectedRowKeys = dataSource.map((element: any) => element.key);
        onSelectChange(newSelectedRowKeys);
        setIsShowSelectAll(false);
    };

    const cancelSelectedAll = () => {
        setSelectedRowKeys([]);
        setIsShowSelectAll(true);
    };

    const onDeleteCustomersChoose = () => {

    }

    const linkToNewMixedPrice = () => {
        history.push("/setting/route-service-same-price/new-mixed-price");
    }
    console.log("dataSource", dataSource);


    return (
        <Spin spinning={isLoading}>
            <SearchCusomter isOpenPopup={isOpenPopupSearchCustomer} setIsOpenPopup={setIsOpenPopupSearchCustomer} itemCode='123' setCustomer={onAddCustomerToTable} />
            <Card>
                <Row gutter={8}>
                    <Col span={6}>
                        <Space className="button-group" style={{ textAlign: 'end' }}>
                            {isShowSelectAll && <Button className='custom-btn2 btn-outline-success' icon={<CheckSquareOutlined />} onClick={() => SelectedAll()}>Chọn tất cả</Button>}
                            {!isShowSelectAll && <Button className='custom-btn2 btn-outline-danger' icon={<BorderOutlined />} onClick={() => cancelSelectedAll()}>Hủy chọn</Button>}
                        </Space>
                    </Col>
                    <Col flex={'auto'} style={{ textAlign: 'end' }}>
                        <Button className='btn-outline-info' style={{ marginRight: "10px" }} icon={<PlusCircleOutlined />} onClick={() => linkToNewMixedPrice()} >Thêm mới</Button>
                        <Button className='custom-btn1 btn-outline-danger' title='Xóa' icon={< DeleteOutlined />} type="primary" onClick={() => onDeleteCustomersChoose}>Xoá</Button>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={24}>
                        <Table
                            rowSelection={rowSelection}
                            size='small'
                            dataSource={dataSource}
                            pagination={{
                                defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'], onChange(current) {
                                    setPage(current);
                                }
                            }}
                            columns={columns}
                            bordered
                        />
                    </Col>
                </Row>

            </Card>
        </Spin>
    )
}
type Props = {
    dataSource: any[];
    setDataSource: (dataSource: any[]) => void;
}