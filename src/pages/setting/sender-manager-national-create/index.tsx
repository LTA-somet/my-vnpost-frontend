
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Drawer, notification, Popconfirm, Space, Spin, Table, Row, Col, Modal, Select, Input } from 'antd';
import { DeleteOutlined, ExportOutlined, ReloadOutlined, SearchOutlined, SaveOutlined, PlusCircleOutlined, DownOutlined } from '@ant-design/icons';
import { patternPhone, regexName, regexPhone, validateMessages } from '@/core/contains';
import { checkPhone } from '../../../utils/PhoneUtil';
import { dataToSelectBox } from '@/utils';
import NestedTable from './Excel/NestedTable';
import { useModel } from 'umi';
import { ContactCreateModel } from '@/services/client';
import { itemClassName } from 'react-horizontal-scrolling-menu/dist/types/constants';
import { isBuffer } from 'lodash';

const { Option } = Select;

export default () => {

    const { initialState } = useModel('@@initialState')
    const user = initialState?.accountInfo;
    const { onSaveListContactNational, searchByParam, dataSourceInit, setDataSourceInit, getMcasNationalDtoLst,
        mcasNationalDtoLst, getMcasNationalCityDtoLst, deleteMultiRecord,
        mcasNationalCityDtoLst,
    } = useModel('contactNationalModel');
    const { opAccounts, opDelegater, getOpDelegater
    } = useModel('productNationalList');

    const [dataSource, setDataSource] = useState<any[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [slectedImages, setSelectedImage] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [contactCreateModel, setContactCreateModel] = useState<ContactCreateModel>();
    const [propsData, setPropsData] = useState<any>();
    const [searchValue, setSearchValue] = useState<string>();
    const [account, setAccount] = useState<any>();
    const [createUser, setCreetUser] = useState();

    useEffect(() => {
        getMcasNationalDtoLst();
        getMcasNationalCityDtoLst();
    }, []);

    useEffect(() => {

        if (dataSourceInit.length > 0) {
            const dataReturn = [...dataSourceInit];
            let minId = -1;
            dataReturn.forEach((element: any, index: number) => {
                element.stepDetailId = minId;
                element.checkbox = false;
                element.type = '';
                element.stt = index + 1;
                minId--;

                if (element?.contactId > 0) {
                    element.isOwner = false;
                }
            });
            setDataSource(dataReturn);
        } else {
            setDataSource([{
                stepDetailId: -1,
                checkbox: false,
                isBlackList: true,
                type: '',
                stt: 1,
                acceptIsland: 2
            }])
        }

    }, [dataSourceInit]);


    const onChangeAccount = (value: any) => {
        getOpDelegater(value);
        setCreetUser(undefined);
        setAccount(value);
    }


    const onFullRowChange = (gird: any) => {
        console.log("gird", gird);

        const newDataSource = [...dataSource];
        const stepDetails = gird.map((row: any) => {
            const index = newDataSource.findIndex(i => i.stepDetailId === row[0].stepDetailId);
            console.log("index _______________________________", index, gird);

            if (index >= 0) {
                console.log("row", row);
                const newStepDetail = newDataSource[index];
                row.forEach((cell: any) => { //with each col -> get new value
                    newStepDetail[cell.fieldName] = (cell.value || cell.value === 0) ? String(cell.value).trim() : cell.value;
                })
                //add new step detail
                return newStepDetail;
                // console.log("newStepDetail fulll", newStepDetail);
                // stepDetails[index] = newStepDetail;
            } else {
                const newStepDetail = {
                    stepDetailId: row[0].stepDetailId,
                    status: "*",

                };
                row.forEach((cell: any) => { //with each col -> get new value
                    newStepDetail[cell.fieldName] = (cell.value || cell.value === 0) ? String(cell.value).trim() : cell.value;
                })
                console.log("newStepDetail -1", newStepDetail);

                return newStepDetail;
            }
        });
        console.log("stepDetails", stepDetails);

        setDataSource(stepDetails);
    }

    const handleGridChange = (row: any) => {
        console.log("g_row", row);
        const stepDetails = [...dataSource];
        const index = stepDetails.findIndex(i => i.stepDetailId === row[0].stepDetailId);
        if (index >= 0) {
            const newStepDetail = stepDetails[index];
            row.forEach((cell: any) => { //with each col -> get new value
                newStepDetail[cell.fieldName] = (cell.value || cell.value === 0) ? String(cell.value).trim() : cell.value;
            })
            //add new step detail
            stepDetails[index] = newStepDetail;
        } else {
            stepDetails.push({
                stepDetailId: row[0].stepDetailId,
                status: row[0].status,
            });

        }
        console.log("abc", stepDetails);

        setDataSource(stepDetails);
    }

    const onRowDelete = (stepDetailId: number) => {
        const stepDetails = [...dataSource];
        const row = stepDetails.find(i => i.stepDetailId === stepDetailId);
        if (row?.contactId) {
            const arrRow = [];
            arrRow.push(row?.contactId);
            deleteMultiRecord(arrRow, (success: boolean) => {
                if (success == true) {
                    const index = stepDetails.findIndex(i => i.stepDetailId === stepDetailId);
                    if (index >= 0) {
                        stepDetails.splice(index, 1);
                    }
                    setDataSource(stepDetails);
                    notification.success({
                        message: "Xóa thành công"
                    })
                }
            });
        } else {
            const index = stepDetails.findIndex(i => i.stepDetailId === stepDetailId);
            if (index >= 0) {
                stepDetails.splice(index, 1);
            }
            setDataSource(stepDetails);
        }
    }

    const checkDataSave = () => {
        const newDataSource = [...dataSource];
        newDataSource.forEach((row, index) => {
            let check = true;
            //Check requied
            if (row.name == null || row.name == undefined || row.name.trim() == "") {
                newDataSource[index].log = "Họ tên không được để trống";
                check = false;
                newDataSource[index].check = false;
                return;
            }
            if (row.nationalCode == null || row.nationalCode == undefined || row.nationalCode.trim() == "") {
                newDataSource[index].log = "Mã quốc gia không được để trống";
                check = false;
                newDataSource[index].check = false;
                return;
            }
            if (row.phone == null || row.phone == undefined || row.phone.trim() == "") {
                newDataSource[index].log = "Số điện thoại không được để trống ";
                check = false;
                newDataSource[index].check = false;
                return;
            }
            if (row.address == null || row.address == undefined || row.address.trim() == "") {
                newDataSource[index].log = "Địa chỉ không được để trống ";
                check = false;
                newDataSource[index].check = false;
                return;
            }
            if (row.city == null || row.city == undefined || row.city.trim() == "") {
                newDataSource[index].log = "Thành phố không được để trống ";
                check = false;
                newDataSource[index].check = false;
                return;
            }
            if (row.postCode == null || row.postCode == undefined || row.postCode.trim() == "") {
                newDataSource[index].log = "Mã bưu chính không được để trống ";
                check = false;
                newDataSource[index].check = false;
                return;
            }
            newDataSource[index].check = check;
        })
        let checked = true;
        let message = "";
        for (let i = 0; i < newDataSource.length; i++) {
            if (newDataSource[i].check == false) {
                checked = false;
                message = newDataSource[i].log;
                i = newDataSource.length;
            }
        }
        if (checked == true) {
            dataSource.forEach(e => {
                if (e.orgCode == null) {
                    e.orgCode = user?.org;
                    e.owner = user?.owner;
                }
            });
            console.log("Check true");
            const contactCreateModelSave = {
                status: true,
                message: "",
                autoSave: false,
                lstContactDto: newDataSource
            }
            onSaveListContactNational(contactCreateModelSave, (success, contactCreateModelReturn) => {
                if (success == true) {
                    if (contactCreateModelReturn?.status == false && contactCreateModelReturn?.autoSave == false) {
                        setContactCreateModel(contactCreateModelReturn);
                        setIsModalVisible(true);
                    } else {
                        setDataSourceInit(contactCreateModelReturn?.lstContactDto || []);
                        notification.success({
                            message: "Lưu thành công " + contactCreateModelReturn.lstContactDto?.length + " bản ghi",
                        })
                    }
                }
            });
        } else {
            notification.error({
                message: message
            })
            setDataSource(newDataSource);
        }
    };


    const onSaveData = () => {
        if (dataSource.length > 0) {
            checkDataSave();
        } else {
            notification.info({
                message: "Không có dữ liệu ",
            });
        }
    }


    const handleOk = () => {
        setIsModalVisible(false);
        const contactCreateModelSave = {
            status: true,
            message: "",
            autoSave: true,
            lstContactDto: contactCreateModel?.lstContactDto
        }
        onSaveListContactNational(contactCreateModelSave, (success, contactCreateModelReturn) => {
            if (success == true) {
                setDataSourceInit(contactCreateModelReturn?.lstContactDto || []);
                // setDataSource(contactCreateModelReturn?.lstContactDto || []);
            }
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        // setLstContactAddress(contactCreateModel?.lstContactDto || []);
    };

    const SelectEdit = (props: any, arrData: any[]) => {
        const { onCommit, value } = props;
        const handleChange = (v: any) => {
            onCommit(v.target.value)
        }
        return (
            <select style={{ width: "100%" }}
                value={value}
                // defaultValue={null}
                onChange={(v) => handleChange(v)}
                filterOption={(input: any, option: any) =>
                    option.children.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                tokenSeparators={[',']}
            >
                <option key='non-select' disabled value={""} />
                {arrData.map((row: any) => (
                    <option key={row?.code} value={row?.code}>{row?.name}</option>
                ))}
            </select>
        );
    };

    const SelectView = (props: any, arrData: any[]) => {
        const { value } = props;
        const national = arrData.find((item: any) => item.code == value);
        return (
            <span className="value-viewer">
                {national?.name} <DownOutlined style={{ fontSize: '10px', float: 'right' }} />
            </span>
        )
    };

    const SelectViewSTT = (props: any) => {
        const { value } = props;
        return (
            <span className="value-viewer">
                {value}
            </span>
        )
    };

    const SelectEditCity = (props: any, arrData: any[]) => {
        const { onCommit, value, stepDetail } = props;
        const handleChange = (v: any) => {
            onCommit(v.target.value)
        }
        console.log('calcStep 1/1', stepDetail);
        let arrDataFilter = [...arrData];
        if (stepDetail != undefined) {
            console.log('calcStep 1', stepDetail);
            if (stepDetail?.nationalCode != undefined) {
                arrDataFilter = arrData.filter((item: any) => item?.nationalCode == stepDetail?.nationalCode);
            }
        }

        return (
            <select style={{ width: "100%" }}
                value={value}
                // defaultValue={null}
                onChange={(v) => handleChange(v)}
                filterOption={(input: any, option: any) =>
                    option.children.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                tokenSeparators={[',']}
            >
                <option key='non-select' disabled value={""} />
                {arrDataFilter.map((row: any) => (
                    <option key={row?.code} value={row?.code}>{row?.name}</option>
                ))}
            </select>
        );
    };

    const SelectViewCity = (props: any, arrData: any[]) => {
        const { rowData, value } = props;
        let national = arrData.find((item: any) => item.code == value);
        if (rowData != undefined) {
            const fillNationalCode = rowData.find((item: any) => item.fieldName == "nationalCode");
            if (fillNationalCode != undefined && fillNationalCode?.value != undefined) {
                national = arrData.find((item: any) => item.code == value && item?.nationalCode == fillNationalCode?.value);
            }
        }
        return (
            <span className="value-viewer">
                {national?.name} <DownOutlined style={{ fontSize: '10px', float: 'right' }} />
            </span>
        )
    };

    const TrueFalseViewer = (props: any,) => {
        const { cell, row, col, value, rowData } = props;
        console.log("value ----", value);

        return (
            <input
                style={{ width: '100%' }}
                type='checkbox'
                // checked={value && value == '1' }
                checked={value}
                readOnly
            />
        )
    }

    const TrueFalseEditer = (props: any,) => {
        const { cell, row, col, value, rowData, onCommit } = props;
        const handleChange = () => {
            if (value == true) {
                onCommit(false);
            } else {
                onCommit(true);
            }
        }
        return (
            <input
                style={{ width: '100%' }}
                type='checkbox'
                checked={value && value == '1'}
                // readOnly
                onChange={() => handleChange()}
            />
        )
    }

    const Columns = [
        {
            label: 'STT', width: 40, fieldName: 'stt', dataType: 'text',
            valueViewer: (props: any) => SelectViewSTT(props),
        },
        // {
        //     label: 'Danh sách đen', width: 40, fieldName: 'isBlackList',
        //     dataType: 'checkbox',
        //     // dataType: 'text',
        //     valueViewer: (props: any) => TrueFalseViewer(props),
        //     editorTag: (props: any) => TrueFalseEditer(props),
        // },
        { label: 'Họ và tên (*)', width: 160, fieldName: 'name', dataType: 'text' },

        {
            label: 'Quốc gia (*)', width: 120, fieldName: 'nationalCode', dataType: 'text',
            editorTag: (props: any) => SelectEdit(props, mcasNationalDtoLst),
            valueViewer: (props: any) => SelectView(props, mcasNationalDtoLst),
        },
        {
            label: 'Mã vùng', width: 100, fieldName: 'areaCode', dataType: 'text',
            // valueViewer: (props: any) => SelectView(props, []),
        },
        {
            label: 'Số điện thoại (*)',
            width: 160,
            fieldName: 'phone',
            dataType: 'text',
            displayField: false,
        },
        { label: 'Địa chỉ chi tiết (*)', width: 260, fieldName: 'address', dataType: 'text' },
        {
            label: 'Thành phố (*)', width: 260, fieldName: 'city', dataType: 'text',
            editorTag: (props: any) => SelectEditCity(props, mcasNationalCityDtoLst),
            valueViewer: (props: any) => SelectViewCity(props, mcasNationalCityDtoLst),
        },
        { label: 'Bang', width: 260, fieldName: 'states', dataType: 'text' },
        { label: 'Mã bưu chính(*)', width: 100, fieldName: 'postCode', dataType: 'text' },

        { label: 'Số VAT', width: 120, fieldName: 'vatNo', dataType: 'text' },
        { label: 'Kiểu đăng ký (VAT)', width: 120, fieldName: 'vatRegisterType', dataType: 'text' },
        { label: 'Quốc gia (VAT)', width: 120, fieldName: 'vatNational', dataType: 'text' },

        { label: 'Số EORI', width: 120, fieldName: 'eoriNo', dataType: 'text' },
        { label: 'Kiểu đăng ký (EORI)', width: 120, fieldName: 'eoriRegisterType', dataType: 'text' },
        { label: 'Quốc gia (EORI)', width: 120, fieldName: 'eoriNational', dataType: 'text' },

        { label: 'Số IOSS', width: 120, fieldName: 'iossNo', dataType: 'text' },
        { label: 'Kiểu đăng ký (IOSS)', width: 120, fieldName: 'iossRegisterType', dataType: 'text' },
        { label: 'Quốc gia (IOSS)', width: 120, fieldName: 'iossNational', dataType: 'text' },
    ]

    const handleSearch = () => {
        console.log("abc");

        const param = {
            "isSender": false,
            "searchValue": searchValue,
        }
        searchByParam(param);
    }


    return (
        <div>
            <PageContainer>
                <Spin spinning={false}>
                    <Card className="fadeInRight">
                        <Row gutter={8} >
                            <Col span={5}>
                                <Input
                                    placeholder="Nhập tên/số điện thoại"
                                    allowClear
                                    style={{ width: "100%" }}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </Col>
                            <Col span={5}>

                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: "100%" }}
                                    placeholder="Tài khoản quản lý"
                                    value={account}
                                    onChange={(value) => onChangeAccount(value)}
                                    tokenSeparators={[',']}>
                                    {opAccounts?.map(row => (
                                        <Option key={row.value} value={row.value}>{row.label}</Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col span={5}>

                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '100%', height: '100%' }}
                                    placeholder="Người tạo"
                                    value={createUser}
                                    onChange={(value) => setCreetUser(value)}
                                >
                                    {opDelegater?.map(row => (
                                        <Option key={row.value} value={row.value}>{row.label}</Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col >
                                <Button title='Tìm kiếm' onClick={() => handleSearch()} className='btn-outline-info' icon={<SearchOutlined />} >Tìm kiếm</Button>
                            </Col>

                            <Col >
                                <Button className='custom-btn1 btn-outline-success'
                                    icon={<PlusCircleOutlined />} onClick={() => onSaveData()}
                                >Thêm mới</Button>
                            </Col>
                            {/* <Col >
                                {
                                    !isShowForm && <>
                                        {isShowSelectAll ? <Popconfirm
                                            title="Bạn chắc chắn muốn xóa?"
                                            onConfirm={onDeleteMulti}
                                            okText="Đồng ý"
                                            cancelText="Hủy bỏ"
                                        >
                                            <Button className='custom-btn1 btn-outline-danger' title='Xóa bản ghi đã chọn' icon={< DeleteOutlined />} type="primary">Xoá</Button>
                                        </Popconfirm> : <Popconfirm
                                            title="Bạn chắc chắn muốn xóa?"
                                            onConfirm={onDeleteMultiRecord}
                                            okText="Đồng ý"
                                            cancelText="Hủy bỏ"
                                        >
                                            <Button className='custom-btn1 btn-outline-danger' title='Xóa bản ghi đã chọn' icon={< DeleteOutlined />} type="primary">Xoá</Button>
                                        </Popconfirm>}
                                    </>
                                }
                                {
                                    isShowForm && <Popconfirm
                                        title="Bạn chắc chắn muốn xóa?"
                                        onConfirm={onDeleteMultiRecord}
                                        okText="Đồng ý"
                                        cancelText="Hủy bỏ"
                                    >
                                        <Button className='custom-btn1 btn-outline-danger' title='Xóa toàn bộ' icon={< DeleteOutlined />} type="primary">Xoá</Button>
                                    </Popconfirm>
                                }
                            </Col> */}
                        </Row>
                    </Card>
                    <Card>
                        <NestedTable
                            style={{
                                height: "370px"
                            }}
                            className="nest-table-style"
                            onFullRowChange={onFullRowChange}
                            onRowChange={handleGridChange}
                            stepDetails={dataSource}
                            onRowDelete={onRowDelete}
                            // onRowCheckBox={onRowCheckBox}
                            dataSource={dataSource}
                            arrData={dataSource}
                            setDataSource={setDataSource}
                            isViewOnly={false}
                            columns={Columns}
                            selectedRowKeys={selectedRowKeys}
                            setSelectedRowKeys={setSelectedRowKeys}
                            slectedImages={slectedImages}
                            setSelectedImage={setSelectedImage}
                            props={propsData}
                            setProps={setPropsData}
                            rowKey="stepDetailId"
                            tableId="stepDetailId"
                        />
                    </Card>
                    <Modal title="Có bản ghi lỗi, bạn có muốn ghi đè"
                        footer={null}
                        visible={isModalVisible}
                        onCancel={handleCancel}
                    >
                        <div style={{ display: 'block', textAlign: 'center' }}>
                            <Button className='custom-btn1 btn-outline-success' style={{ marginLeft: '10px', minWidth: '120px' }} onClick={handleOk}>Đồng ý</Button>
                            <Button className='custom-btn1 btn-outline-danger' style={{ marginLeft: '10px', minWidth: '120px' }} onClick={handleCancel}>Đóng</Button>
                        </div>
                    </Modal>
                </Spin>
            </PageContainer>
        </div>
    )
}