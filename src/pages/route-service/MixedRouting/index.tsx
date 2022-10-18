
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Drawer, notification, Popconfirm, Space, Spin, Table, Row, Col, Modal, Select } from 'antd';
import { DeleteOutlined, ExportOutlined, ReloadOutlined, SearchOutlined, SaveOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { patternPhone, regexName, regexPhone, validateMessages } from '@/core/contains';
import { checkPhone } from '../../../utils/PhoneUtil';
import NestedTable from './Excel/NestedTable';
import { useModel } from 'umi';
import { ContactCreateModel } from '@/services/client';

const { Option } = Select;

export default (props: Props) => {

    const { initialState } = useModel('@@initialState')
    const user = initialState?.accountInfo;
    const { onAddressSeparate, lstContactAddress, setLstContactAddress, onSaveListContact } = useModel('contactList')
    // const [dataSource, setDataSource] = useState<any[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [slectedImages, setSelectedImage] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [contactCreateModel, setContactCreateModel] = useState<ContactCreateModel>();
    const [propsData, setPropsData] = useState<any>();

    const dataSource: any[] = props.dataSource;
    const setDataSource = props.setDataSource;
    console.log("dataSource123", dataSource);

    const onFullRowChange = (gird: any) => {
        console.log("gird", gird);

        const newDataSource = [...dataSource];
        const stepDetails = gird.map((row: any) => {
            const index = newDataSource.findIndex(i => i.stepDetailId === row[0].stepDetailId);
            console.log("index", index);

            if (index >= 0) {
                console.log("row", row);
                const newStepDetail = newDataSource[index];
                row.forEach((cell: any) => { //with each col -> get new value
                    newStepDetail[cell.fieldName] = (cell.value || cell.value === 0) ? String(cell.value).trim() : cell.value;
                })
                newStepDetail.locationFrom = '10 - Hà Nội 13';
                //add new step detail
                return newStepDetail;
                // console.log("newStepDetail fulll", newStepDetail);
                // stepDetails[index] = newStepDetail;
            } else {
                const newStepDetail = {
                    stepDetailId: row[0].stepDetailId,
                    status: "*",
                    locationFrom: '10 - Hà Nội 13',
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
            newStepDetail.locationFrom = '10 - Hà Nội 13';
            //add new step detail
            stepDetails[index] = newStepDetail;
        } else {
            stepDetails.push({
                stepDetailId: row[0].stepDetailId,
                locationFrom: '10 - Hà Nội 13',
                status: row[0].status,
            });

        }
        console.log("abc", stepDetails);

        setDataSource(stepDetails);
    }

    const onRowDelete = (stepDetailId: number) => {
        const stepDetails = [...dataSource];
        const index = stepDetails.findIndex(i => i.stepDetailId === stepDetailId);
        if (index >= 0) {
            stepDetails.splice(index, 1);
        }
        setDataSource(stepDetails);
    }



    const checkDataSave = () => {
        const newDataSource = [...dataSource];
        newDataSource.forEach((row, index) => {
            let check = true;
            //Check trung lap nameVi
            if (newDataSource.findIndex(i => i.name === row.name && i.phone === row.phone && i.address === row.address) !== index) {
                newDataSource[index].log = "Trùng tên địa chỉ số điện thoại người nhận";
                newDataSource[index].check = false;
                check = false;
                return;
            }
            if (row.name == null || row.name == undefined || row.name.trim() == "") {
                newDataSource[index].log = "Tên người nhận không được để trống ";
                check = false;
                newDataSource[index].check = false;
                return;
            }
            if (row.phone == null || row.phone == undefined || row.phone == "") {
                newDataSource[index].log = "Số điện thoại không được để trống ";
                check = false;
            } else {
                const checkPhonenumber = checkPhone(row.phone);
                if (checkPhonenumber != undefined || checkPhonenumber != null) {
                    newDataSource[index].log = checkPhonenumber;
                    check = false;
                }
            }
            if (row.address == null || row.address == undefined || row.address == "") {
                newDataSource[index].log = "Địa chỉ không được để trống ";
                check = false;
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
            onSaveListContact(contactCreateModelSave, (success, contactCreateModelReturn) => {
                if (success == true) {
                    if (contactCreateModelReturn?.status == false && contactCreateModelReturn?.autoSave == false) {
                        setContactCreateModel(contactCreateModelReturn);
                        setIsModalVisible(true);
                    } else {
                        setLstContactAddress(contactCreateModelReturn?.lstContactDto || []);
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

    const onSeparateAddress = () => {
        const newDataSource = [...dataSource];
        newDataSource.forEach(row => {
            row.log = "";
            row.check = null;
            row.provinceCode = null;
            row.districtCode = null;
            row.communeCode = null;
            row.postCode = null;
            row.province = null;
            row.district = null;
            row.commune = null;
        })
        onAddressSeparate(dataSource);
    }

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
        onSaveListContact(contactCreateModelSave, (success, contactCreateModelReturn) => {
            if (success == true) {
                setLstContactAddress(contactCreateModelReturn?.lstContactDto || []);
                // setDataSource(contactCreateModelReturn?.lstContactDto || []);
            }
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setLstContactAddress(contactCreateModel?.lstContactDto || []);
    };

    const Columns = [
        // { label: 'Từ địa bàn', width: 160, fieldName: 'locationFrom', dataType: 'text', readOnly: true },
        { label: 'Đến địa bàn', width: 160, fieldName: 'areaToName', dataType: 'text' },
        { label: 'Từ trên KLTC (gram)', width: 100, fieldName: 'weightFrom', dataType: 'text' },
        { label: 'Đến KLTC (gram)', width: 100, fieldName: 'weightTo', dataType: 'text' },
        { label: 'SPDV', width: 100, fieldName: 'serviceCode', dataType: 'text' },
    ]

    return (
        <div>
            <Spin spinning={false}>

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

            </Spin>
        </div>
    )
}

type Props = {
    dataSource: any[];
    setDataSource: (dataSource: any[]) => void;
}