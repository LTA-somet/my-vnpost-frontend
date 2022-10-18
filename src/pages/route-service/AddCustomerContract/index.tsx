import React from 'react';
import { AccountReplaceDto, McasOrganizationStandardApi, McasOrganizationStandardDto } from '@/services/client';
import { Card, Col, Input, Row, Button, Select, Spin, Form, Table, Space, AutoComplete, Divider } from 'antd';
import { DeleteOutlined, SearchOutlined, PlusCircleOutlined, CheckSquareOutlined, BorderOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import defineColumns from './columns';
import SearchCusomter from '../PopupCustomer';
import './styles.css'


export default (props: Props) => {

    const [, setPage] = React.useState(1);
    const { isLoading, lstOrganization, findLstOrganizationByUnitCode } = useModel('routeServiceSamePriceModels');
    const { initialState } = useModel('@@initialState');
    const user = initialState?.accountInfo;
    // const [dataSource, setDataSource] = useState<any[]>([]);
    const [isShowSelectAll, setIsShowSelectAll] = useState<boolean>(true);
    const [isOpenPopupSearchCustomer, setIsOpenPopupSearchCustomer] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);


    const dataSource = props.dataSource;
    const setDataSource = props.setDataSource;

    useEffect(() => {
        if (lstOrganization.length == 0) {
            findLstOrganizationByUnitCode(user?.org || "");
        }
    }, []);



    const deleteRecord = (id: any) => {
        const newDataSource = [...dataSource];
        const index = newDataSource.findIndex(item => item.key == id);
        if (index >= 0) {
            newDataSource.splice(index, 1);
        }
        setDataSource(newDataSource);
    }


    const action = (id: any): React.ReactNode => {
        return <Space key={id}>
            <Button className="btn-outline-danger" onClick={() => deleteRecord(id)} size="small"><DeleteOutlined /></Button>
        </Space>
    }

    const columns: any[] = defineColumns(action);

    const onAddCustomerToTable = (data: any[]) => {
        const organizationItem = lstOrganization.find(item => { return item.unitCode == user?.org });
        console.log("organizationItem", organizationItem, user?.org);

        console.log("dataAdd", data);
        data.forEach(element => {
            element.areaFromName = organizationItem?.unitName;
            element.areaFromCode = organizationItem?.unitCode;
        });
        console.log("dataAdd", data);
        const newDataSource = [...dataSource];
        // Array.prototype.push.apply(newDataSource, data);
        data.forEach(item => {
            if (newDataSource.findIndex(item2 => { return item.key === item2.key }) < 0) {
                newDataSource.push(item);
            }
        })

        setDataSource(newDataSource);

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

    console.log("dataSource", dataSource);

    return (
        <Spin spinning={isLoading}>

            <Card>
                <Row justify="end" gutter={8}>
                    <Col>
                        <Button className='btn-outline-info' style={{ float: "right" }} icon={<PlusCircleOutlined />} onClick={() => setIsOpenPopupSearchCustomer(true)} >Thêm mới</Button>
                    </Col>
                    <SearchCusomter isOpenPopup={isOpenPopupSearchCustomer} setIsOpenPopup={setIsOpenPopupSearchCustomer} itemCode='123' setCustomer={onAddCustomerToTable} />
                    <Col>
                        <Button className='custom-btn1 btn-outline-danger' title='Xóa' icon={< DeleteOutlined />} type="primary" onClick={() => onDeleteCustomersChoose}>Xoá</Button>
                    </Col>
                </Row>
                <Row>
                    <Space className="button-group" style={{ textAlign: 'end' }}>
                        {isShowSelectAll && <Button className='custom-btn2 btn-outline-success' icon={<CheckSquareOutlined />} onClick={() => SelectedAll()}>Chọn tất cả</Button>}
                        {!isShowSelectAll && <Button className='custom-btn2 btn-outline-danger' icon={<BorderOutlined />} onClick={() => cancelSelectedAll()}>Hủy chọn</Button>}
                    </Space>
                </Row>
                <Row gutter={8}>

                    <Col span={24}>
                        <Table
                            rowClassName={(record: any) => record?.check === false ? 'table-row-error' : ''}
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