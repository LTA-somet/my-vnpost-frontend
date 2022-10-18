
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

export default () => {

    const { initialState } = useModel('@@initialState')
    const user = initialState?.accountInfo;
    const { onAddressSeparate, lstContactAddress, setLstContactAddress, onSaveListContact } = useModel('contactList')
    const [dataSource, setDataSource] = useState<any[]>([{ "acceptIsland": 2, "contactId": 0, "orgCode": null, "owner": null, "isSender": null, "name": "Nguyễn Văn A", "contractNumber": null, "address": "Keangnam, Mễ Trì, Nam Từ Liêm, Hà Nội", "provinceCode": "10", "districtCode": "1200", "communeCode": "12012", "province": "TP. Hà Nội", "district": "Q. Nam Từ Liêm", "commune": "P. Mễ Trì", "postCode": "12012", "vpostCode": null, "phone": "0988000001" }]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [slectedImages, setSelectedImage] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [contactCreateModel, setContactCreateModel] = useState<ContactCreateModel>();
    const [propsData, setPropsData] = useState<any>();

    useEffect(() => {
        if (lstContactAddress.length > 0) {
            const dataReturn = [...lstContactAddress]
            let minId = -1;
            dataReturn.forEach((element: any) => {
                element.stepDetailId = minId;
                element.checkbox = false;
                element.type = '';
                minId--;

                if (element?.contactId > 0) {
                    element.isOwner = false;
                }
            });
            setDataSource(dataReturn);
        } else {
            setDataSource([{}]);
        }

    }, [lstContactAddress]);


    const onFullRowChange = (gird: any) => {
        const newDataSource = [...dataSource];
        const stepDetails = gird.map((row: any) => {
            const index = newDataSource.findIndex(i => i.stepDetailId === row[0].stepDetailId);
            if (index >= 0) {
                return {
                    ...newDataSource[index],
                    stepDetailId: row[0].stepDetailId,
                    status: row[0].status,
                    name: row[0].value,
                    phone: row[1].value,
                    address: row[2].value,

                }
            } else {
                return {
                    ...newDataSource[index],
                    stepDetailId: row[0].stepDetailId,
                    status: "*",
                    name: row[0].value,
                    phone: row[1].value,
                    address: row[2].value,
                }
            }
        });
        setDataSource(stepDetails);
    }

    const handleGridChange = (row: any) => {
        console.log("g_row", row);

        const stepDetails = [...dataSource];
        const index = stepDetails.findIndex(i => i.stepDetailId === row[0].stepDetailId);
        if (index >= 0) {
            const newStepDetail = {
                ...stepDetails[index],
                stepDetailId: row[0].stepDetailId,
                status: row[0].status,
                name: row[0].value,
                phone: row[1].value,
            };
            stepDetails[index] = newStepDetail;
        } else {
            stepDetails.push({
                stepDetailId: row[0].stepDetailId,
                status: row[0].status,
                name: '',
                phone: undefined,
                address: undefined,
                commune: undefined,
                district: undefined,
                province: undefined
            });
            setDataSource(stepDetails);
        }
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
        { label: 'Họ và tên', width: 160, fieldName: 'name', dataType: 'text' },
        {
            label: 'Số điện thoại',
            width: 80,
            fieldName: 'phone',
            dataType: 'text',
            displayField: false,
        },
        { label: 'Địa chỉ chi tiết', width: 260, fieldName: 'address', dataType: 'text' },
        { label: 'Mã tỉnh', width: 60, fieldName: 'provinceCode', dataType: 'text', readOnly: true },
        { label: 'Mã huyện', width: 60, fieldName: 'districtCode', dataType: 'text', readOnly: true },
        { label: 'Mã xã', width: 60, fieldName: 'communeCode', dataType: 'text', readOnly: true },
        { label: 'Postcode', width: 60, fieldName: 'postCode', dataType: 'text', readOnly: true },
        { label: 'Tên tỉnh', width: 160, fieldName: 'province', dataType: 'text', readOnly: true },
        { label: 'Tên huyện', width: 160, fieldName: 'district', dataType: 'text', readOnly: true },
        { label: 'Tên xã', width: 160, fieldName: 'commune', dataType: 'text', readOnly: true },
    ]

    return (
        <div>
            <PageContainer>
                <Spin spinning={false}>
                    <Card className="fadeInRight">
                        <Row style={{ textAlign: 'center', display: 'block' }}>
                            <Button title='Tìm kiếm' className='btn-outline-info' style={{ marginLeft: '10px', minWidth: '120px' }} icon={<SearchOutlined />}
                                onClick={() => onSeparateAddress()}
                            >Tách địa chỉ</Button>
                            <Button className='custom-btn1 btn-outline-success' style={{ marginLeft: '10px', minWidth: '120px' }}
                                icon={<PlusCircleOutlined />} onClick={() => onSaveData()}
                            >Thêm mới</Button>

                            <Button className='custom-btn1 btn-outline-danger' style={{ marginLeft: '10px', minWidth: '120px' }}
                                icon={< DeleteOutlined />} type="primary"
                                onClick={() => setDataSource([{}])}
                            >Xoá dữ liệu</Button>
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