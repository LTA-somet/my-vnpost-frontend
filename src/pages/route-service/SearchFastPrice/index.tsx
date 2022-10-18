import React from 'react';
import { AccountReplaceDto, McasOrganizationStandardApi, McasOrganizationStandardDto } from '@/services/client';
import { Card, Col, Input, Row, Button, Select, Spin, Form, Table, Space, AutoComplete, Divider, notification } from 'antd';
import { DeleteOutlined, SearchOutlined, PlusCircleOutlined, CheckSquareOutlined, BorderOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useModel, useHistory } from 'umi';
import defineColumns from './columns';
import SearchCusomter from '../PopupCustomer';
import {
    RequetMixedPriceDto,
} from '@/services/client';
import './styles.css';

const { Option } = Select;

const groupServiceFrice = [
    { value: "NHANH", label: "Nhanh" },
    { value: "TIETKIEM", label: "Tiết kiệm" }
]

const lstService = [
    { value: 'ETN001', label: 'ETN001-EMS cơ bản - Tài liệu' },
    { value: 'ETN002', label: 'ETN002-EMS trong ngày - Tài liệu' },
    { value: 'ETN003', label: 'ETN003-EMS hỏa tốc - Tài liệu' },
    { value: 'ETN005', label: 'ETN005-EMS thỏa thuận - Tài liệu' },
    { value: 'ETN006', label: 'ETN006-EMS VHX - Tài liệu' },
    { value: 'ETN007', label: 'ETN007-EMS COD tiết kiệm (E-COD) - Tài liệu' },
    { value: 'ETN008', label: 'ETN008-EMS áp tải phát trong ngày (-EMS áp tải PTN) - Tài liệu' },
    { value: 'ETN009', label: 'ETN009-EMS HNP nội tỉnh - Tài liệu' },
    { value: 'ETN010', label: 'ETN010-EMS TMĐT nội tỉnh - Tài liệu' },
]

const generateKey = () => {
    const randomNumber = Math.floor((Math.random() * 1000000000) + 1);
    return `${new Date().getTime()}_${randomNumber}`;
}

export default (props: Props) => {

    const [, setPage] = React.useState(1);
    const { isLoading, onSearchRouterFast, lstOrganization, lstSearchRouterFastDto, setLstSearchRouterFastDto, onSaveDataMixedPriceDto, onDeleteData
    } = useModel('routeServiceSamePriceModels');
    const { initialState } = useModel('@@initialState');
    const user = initialState?.accountInfo;
    const [isShowSelectAll, setIsShowSelectAll] = useState<boolean>(true);
    const [isOpenPopupSearchCustomer, setIsOpenPopupSearchCustomer] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    const [onChangeData, setOnChagneData] = useState<any>();

    const dataSource = lstSearchRouterFastDto;
    const setDataSource = setLstSearchRouterFastDto;

    const deleteRecord = (record: any) => {
        console.log("record", record);

        const newDataSource = [...dataSource];
        const index = newDataSource.findIndex(item => {
            return item?.customerCode == record?.customerCode && item?.contractNumber == record?.contractNumber
                && item?.serviceCode == record?.serviceCode && item?.serviceGroupSamePrice == record?.serviceGroupSamePrice
        });
        if (record?.customerId) {
            const param: any = {
                type: "DGNTK",
                ids: [record?.customerId]
            }
            onDeleteData(param, (success: boolean) => {
                if (success == true) {
                    if (index >= 0) {
                        newDataSource.splice(index, 1);
                    }
                    setDataSource(newDataSource);
                }
            });
        } else {
            if (index >= 0) {
                newDataSource.splice(index, 1);
            }
            setDataSource(newDataSource);
        }

    }

    const editRecord = (record: any) => {
        const newDataSource = [...dataSource];
        const index = newDataSource.findIndex(item => {
            return item?.customerCode == record?.customerCode && item?.contractNumber == record?.contractNumber
                && item?.serviceCode == record?.serviceCode && item?.serviceGroupSamePrice == record?.serviceGroupSamePrice
        });
        if (index >= 0) {
            const newItem: any = newDataSource[index];
            newItem.edit = false;
            newDataSource[index] = newItem;
            setDataSource(newDataSource);
        }
    }

    function checkRequid(record: any) {
        const newDataSource = [...dataSource];
        const index = newDataSource.findIndex(item => {
            return item?.customerCode == record?.customerCode && item?.contractNumber == record?.contractNumber
                && item?.serviceCode == record?.serviceCode && item?.serviceGroupSamePrice == record?.serviceGroupSamePrice
        });
        if (!record?.customerCode || !record?.customerName || !record?.serviceCode || !record?.serviceGroupSamePrice) {
            if (index >= 0) {
                const newItem: any = newDataSource[index];
                newItem.check = false;
                newDataSource[index] = newItem;
                setDataSource(newDataSource);
            }

            return false;
        } else {
            if (index >= 0) {
                const newItem: any = newDataSource[index];
                newItem.check = true;
                newDataSource[index] = newItem;
                setDataSource(newDataSource);
            }
            return true;
        }
    }
    console.log('dataSource', dataSource);


    const saveRecord = (record: any) => {
        console.log(record);
        if (checkRequid(record)) {
            const newDataSource = [...dataSource];
            const index = newDataSource.findIndex((item: any) => {
                return item?.key == record?.key
            });
            const param: RequetMixedPriceDto = {};
            const orgBdt = lstOrganization.find(item => item.unitCode == user?.org);
            param.routerSameValueDto = {
                routerId: record?.routerId,
                areaFromCode: orgBdt?.unitCode,
                areaFromName: orgBdt?.unitCode + "-" + orgBdt?.unitName,
                routerType: "DGNTK",
                bdtCode: undefined,
                routerName: orgBdt?.unitCode + "_" + generateKey(),
                orgCode: orgBdt?.unitCode
            }
            const newCustomer = [{
                id: record?.customerId,
                customerName: record?.customerName,
                contractNumber: record?.contractNumber,
                customerCode: record?.customerCode,
                routerId: record?.routerId,
                serviceCode: record?.serviceCode,
                serviceGroupSamePrice: record?.serviceGroupSamePrice
            }]
            param.lstCustomerDto = newCustomer;
            onSaveDataMixedPriceDto(param, (success: boolean, data: RequetMixedPriceDto) => {
                if (success == true) {
                    if (index >= 0) {
                        const newItem: any = newDataSource[index];
                        newItem.edit = true;
                        newItem.routerId = data?.routerSameValueDto?.routerId;
                        newItem.customerId = data?.lstCustomerDto?.[0]?.id;
                        newItem.check = data?.lstCustomerDto?.[0]?.check;
                        // newItem.key = generateKey();
                        newDataSource[index] = newItem;
                        setDataSource(newDataSource);
                        if (data?.checkAll == true) {
                            notification.success({
                                message: "Lưu dữ liệu thành công"
                            })
                        } else {
                            notification.error({
                                message: "Dữ liệu đã tồn tại trong hệ thống"
                            })
                        }
                    }
                } else {
                    notification.error({
                        message: "Không lưu được dữ liệu"
                    })
                }
            });
        } else {
            notification.error({
                message: 'Dữ liệu không hợp lệ'
            })
        }
    }

    const action = (id: any, record: any): React.ReactNode => {
        let onEdit: boolean = false;
        if (record?.customerId && (record?.edit == true || record?.edit == null) && (record?.check == true || record?.check == null)) {
            onEdit = true;
        }
        return <Space key={id}>
            {onEdit ?
                <Button className="btn-outline-info" onClick={() => editRecord(record)} size="small"><EditOutlined /></Button>
                :
                <Button className="btn-outline-success" onClick={() => saveRecord(record)} size="small"><SaveOutlined /></Button>
            }
            <Button className="btn-outline-danger" onClick={() => deleteRecord(record)} size="small"><DeleteOutlined /></Button>
        </Space>
    }

    const onChangeGroupServicePrice = (index: any, record: any, value: string) => {
        const newDataSource = [...dataSource];
        newDataSource[index].serviceGroupSamePrice = value;
        setDataSource(newDataSource);
        setOnChagneData(index + value);
    }

    const onChangeService = (index: any, record: any, value: string) => {
        const newDataSource = [...dataSource];
        newDataSource[index].serviceCode = value;
        setDataSource(newDataSource);
        setOnChagneData(index + value);
    }
    const onChangeSelectBox = (id: any, record: any, key: any) => {
        let isDisabled: boolean = false;
        if (record?.customerId && (record?.edit == true || record?.edit == null) && (record?.check == true || record?.check == null)) {
            isDisabled = true;
        }

        if (key === "serviceGroupSameprice") {
            return (
                <Select
                    style={{ width: '100%' }}
                    key={id}
                    placeholder="Nhóm dịch vụ đồng giá"
                    allowClear
                    value={record?.serviceGroupSamePrice}
                    onChange={(value) => onChangeGroupServicePrice(id, record, value)}
                    disabled={isDisabled}
                >
                    {groupServiceFrice.map((item) => {
                        return (
                            <Option key={item.value} value={item.value}>{item.label}</Option>
                        )
                    })}
                </Select>
            )
        }
        if (key === "serviceCode") {
            return (
                <Select
                    style={{ width: '100%' }}
                    key={id}
                    placeholder="Dịch vụ chuyển phát"
                    allowClear
                    value={record?.serviceCode}
                    onChange={(value) => onChangeService(id, record, value)}
                    disabled={isDisabled}
                >
                    {lstService.map((item) => {
                        return (
                            <Option key={item.value} value={item.value}>{item.label}</Option>
                        )
                    })}
                </Select>
            )
        }

    }

    const columns: any[] = defineColumns(action, onChangeSelectBox);

    const onAddCustomerToTable = (data: any[]) => {
        const newDataSource = [...dataSource];
        data.forEach(row => {
            row.areaFromCode = user?.org;
            const orgBdt = lstOrganization.find(org => { return org?.unitCode == user?.org });
            row.areaFromName = orgBdt ? orgBdt?.unitCode + "-" + orgBdt?.unitName : "";
            newDataSource.push(row);
        });
        setDataSource(newDataSource);
    }

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
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
        const newDataSource = [...dataSource];
        const ids: number[] = [];
        dataSource.forEach((item: any) => {
            if (selectedRowKeys.includes(item?.key)) {
                if (item?.customerId) {
                    ids.push(item.customerId);
                } else {
                    const index = newDataSource.findIndex((itemDelete: any) => itemDelete.key == item.key);
                    newDataSource.splice(index, 1);
                }
            }
        });

        if (ids.length > 0) {
            const param: any = {
                type: "DGNTK",
                ids: ids
            }
            onDeleteData(param, (success: boolean) => {
                if (success == true) {
                    ids.forEach(key => {
                        const index = newDataSource.findIndex((itemDelete: any) => itemDelete.key == key);
                        newDataSource.splice(index, 1);
                    })
                    setDataSource(newDataSource);
                }
            });
        } else {
            setDataSource(newDataSource);
        }
    }
    console.log("dataSoure", dataSource);
    return (
        <Card>

            <Row gutter={8}>
                <Col span={6}>
                    <Space className="button-group" style={{ textAlign: 'end' }}>
                        {isShowSelectAll && <Button className='custom-btn2 btn-outline-success' icon={<CheckSquareOutlined />} onClick={() => SelectedAll()}>Chọn tất cả</Button>}
                        {!isShowSelectAll && <Button className='custom-btn2 btn-outline-danger' icon={<BorderOutlined />} onClick={() => cancelSelectedAll()}>Hủy chọn</Button>}
                    </Space>
                </Col>
                <Col flex={'auto'} style={{ textAlign: 'end' }}>
                    <Button className='btn-outline-info' style={{ marginRight: "10px" }} icon={<PlusCircleOutlined />} onClick={() => setIsOpenPopupSearchCustomer(true)} >Thêm mới</Button>
                    <Button className='custom-btn1 btn-outline-danger' title='Xóa' icon={< DeleteOutlined />} type="primary" onClick={() => onDeleteCustomersChoose()}>Xóa</Button>
                </Col>
            </Row>
            <SearchCusomter isOpenPopup={isOpenPopupSearchCustomer} setIsOpenPopup={setIsOpenPopupSearchCustomer} itemCode='123' setCustomer={onAddCustomerToTable} />
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
    )
}
type Props = {
    dataSource: any[];
    setDataSource: (dataSource: any[]) => void;
}