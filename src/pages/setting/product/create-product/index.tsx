import React, { useState, useEffect } from 'react';
import { Button, Card, Drawer, notification, Popconfirm, Space, Spin, Table, Row, Col, Modal } from 'antd';
import { DeleteOutlined, ExportOutlined, ReloadOutlined, SearchOutlined, SaveOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Columns, ColumnWith, KeyObject } from './columns';
import { PageContainer } from '@ant-design/pro-layout';
import { useModel } from 'umi';
import { Select, Input, AutoComplete } from 'antd';
import NestedTable2 from './NestedTable2';
import "./styles.css";

const { Option } = Select;
const phamvi = [
    { value: 'Domestic', label: "Trong nước" },
    { value: 'International', label: "Quốc tế" }
]
export default () => {

    const { dataSourceInit, products, isLoading, opAccounts, opDelegater,
        setDataSourceInit, reload, searchByParam, searchProduct, deleteRecords, saveAllRecord, getOpAccountChild, getOpDelegater,
        checkDuplicateProductName, isCheckDuplicate, setCheckDuplicate
    } = useModel('productList');
    const { initialState } = useModel('@@initialState')
    const user = initialState?.accountInfo;
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [slectedImages, setSelectedImage] = useState([]);
    const [account, setAccount] = useState<any>();
    const [createUser, setCreetUser] = useState();
    const [optionProducts, setOptionProduct] = useState<any[]>([]);
    const [product, setProduct] = useState<any>();
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        getOpAccountChild();
        getOpDelegater("");
        searchProduct({});
        // searchByParam({});
    }, [])

    useEffect(() => {
        let productOptions: any = [];
        products.forEach((element, index) => {
            productOptions.push({
                key: element.value,
                value: element.label,
                label: element.label,
            }
            )
        })
        setOptionProduct(productOptions);
    }, [products]);

    useEffect(() => {
        const dataReturn = [...dataSourceInit]
        let minId = -1;
        dataReturn.forEach((element: any) => {
            element.stepDetailId = minId;
            element.checkbox = false;
            element.type = '';
            element.isOwner = user?.owner == element?.owner ? true : false;
            minId--;
            if (element?.image) {
                element.image = element?.image.replace("data:application/octet-stream;base64", "data:image/jpeg;base64");
            }

        });
        setDataSource(dataReturn);
    }, [dataSourceInit]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        saveAllRecord(dataSource);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        if (isCheckDuplicate == false) {
            showModal();
            setCheckDuplicate(true);
        }
    }, [isCheckDuplicate]);

    const onSelectProduct = (value: any, option: any) => {
        setProduct(option?.key || '');
    };

    const onSearchByParam = () => {
        const param = {
            "value": product,
            "account": account,
            "createdBy": createUser,
            "scope": 1
        }
        searchByParam(param);
    }

    function onSearchProduct(value: any) {
        setProduct(value);
        let param = {
            "value": value || ""
        };
        searchProduct(param);
    }

    const onFullRowChange = (gird: any) => {
        const newDataSource = [...dataSource];
        let stepDetails = gird.map((row: any) => {
            const newStepDetail = {
                stepDetailId: row[0].stepDetailId
            }
            const index = newDataSource.findIndex(i => i.stepDetailId === row[0].stepDetailId);
            if (index >= 0) {
                return {
                    ...newDataSource[index],
                    stepDetailId: row[0].stepDetailId,
                    nameVi: row[0].value,
                    status: row[0].status,
                    weight: parseInt(row[1].value) ? parseInt(row[1].value) : '',
                    priceVnd: parseInt(row[2].value) ? parseInt(row[2].value) : '',
                    length: parseInt(row[3].value) ? parseInt(row[3].value) : '',
                    width: parseInt(row[4].value) ? parseInt(row[4].value) : '',
                    height: parseInt(row[5].value) ? parseInt(row[5].value) : '',

                }
            } else {
                return {
                    ...newDataSource[index],
                    stepDetailId: row[0].stepDetailId,
                    nameVi: row[0].value,
                    status: '*',
                    weight: parseInt(row[1].value) ? parseInt(row[1].value) : '',
                    priceVnd: parseInt(row[2].value) ? parseInt(row[2].value) : '',
                    length: parseInt(row[3].value) ? parseInt(row[3].value) : '',
                    width: parseInt(row[4].value) ? parseInt(row[4].value) : '',
                    height: parseInt(row[5].value) ? parseInt(row[5].value) : '',
                }
            }
            return newStepDetail;
        });
        setDataSource(stepDetails);
    }

    const handleGridChange = (row: any) => {
        const stepDetails = [...dataSource];
        const index = stepDetails.findIndex(i => i.stepDetailId === row[0].stepDetailId);
        if (index >= 0) {
            const newStepDetail = {
                ...stepDetails[index],
                stepDetailId: row[0].stepDetailId,
                nameVi: row[0].value,
                status: row[0].status,
                // const rowStatus = grid[row][0].status == STATUS_UNCHANGED ? STATUS_EDITED : grid[row][0].status
                weight: parseInt(row[1].value) ? parseInt(row[1].value) : '',
                priceVnd: parseInt(row[2].value) ? parseInt(row[2].value) : '',
                length: parseInt(row[3].value) ? parseInt(row[3].value) : '',
                width: parseInt(row[4].value) ? parseInt(row[4].value) : '',
                height: parseInt(row[5].value) ? parseInt(row[5].value) : '',
            };
            // const newRowChange = Object.assign({}, stepDetails[index], newStepDetail);
            stepDetails[index] = newStepDetail;
        } else {
            stepDetails.push({
                stepDetailId: row[0].stepDetailId,
                status: row[0].status,
                nameVi: '',
                weight: undefined,
                priceVnd: undefined,
                length: undefined,
                width: undefined,
                height: undefined
            });
            setCreetUser(undefined);
            setAccount(undefined);
            setDataSource(stepDetails);
        }
    }

    const onRowDelete = (stepDetailId: number) => {
        const stepDetails = [...dataSource];
        const row = stepDetails.find(i => i.stepDetailId === stepDetailId);
        if (row?.productId) {
            const arrRow = [];
            arrRow.push(row);
            deleteRecords(arrRow, (success: boolean) => {
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
            const indexRow = index + 1;
            let check = true;
            //Check trung lap nameVi
            if (newDataSource.findIndex(i => i.nameVi === row.nameVi) !== index) {
                newDataSource[index].log = "Trùng tên sản phẩm";
                newDataSource[index].check = false;
                check = false;
                return;
            }
            if (row.nameVi == null || row.nameVi == undefined || row.nameVi.trim() == "") {
                newDataSource[index].log = "tên không được để trống - dòng " + indexRow;
                check = false;
                newDataSource[index].check = false;
                return;
            }
            if (row.weight == null || row.weight == undefined || row.weight == "") {
                newDataSource[index].log = "Khối lượng không được để trống - dòng " + indexRow;
                check = false;
            } else if (row.weight < 0) {
                newDataSource[index].log = "Khối lượng không được nhỏ hơn 0 - dòng " + indexRow;
                check = false;
            }
            newDataSource[index].check = check;
        })
        let checked = true;
        let log = "";
        for (var i = 0; i < newDataSource.length; i++) {
            if (newDataSource[i].check == false) {
                checked = false;
                log = newDataSource[i].log;
                i = newDataSource.length;
            }
        }
        if (checked == true) {
            dataSource.forEach(e => {
                if (e.orgCode == null) {
                    e.orgCode = user?.org;
                    e.owner = user?.owner;
                    e.scope = 1;
                }
            });
            checkDuplicateProductName(dataSource);
            // saveAllRecord(dataSource);
        } else {
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

    const onDeleteRows = () => {
        let dataSoureNew = [...dataSource];
        let dataCheckedId = dataSoureNew.filter(e => {
            return e.checkbox == true && e.productId;
        });
        deleteRecords(dataCheckedId);
        let dataDelete = dataSoureNew.filter(e => {
            return e.checkbox != true;
        });
        setDataSource(dataDelete);
    }
    const onChangeAccount = (value: any) => {
        getOpDelegater(value);
        setCreetUser(undefined);
        setAccount(value);
    }

    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Card className="fadeInRight">
                        <Row >
                            <Col span={5} style={{ paddingRight: '10px' }} >
                                <AutoComplete
                                    dropdownMatchSelectWidth={252}
                                    style={{ width: "100%", height: 20 }}
                                    options={optionProducts}
                                    onSelect={onSelectProduct}
                                    onSearch={onSearchProduct}
                                >
                                    <Input placeholder="Tìm kiếm theo tên hàng hóa" allowClear ></Input>
                                </AutoComplete>
                            </Col>
                            <Col span={10} />

                            {/* <Col span={5} style={{ paddingRight: '10px' }}>
                                <Select
                                    placeholder="Tài khoản quản lý"
                                    allowClear
                                    style={{ width: '100%' }}
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
                                    placeholder="Người tạo"
                                    allowClear
                                    style={{ width: '100%' }}
                                    value={createUser}
                                    onChange={(value) => setCreetUser(value)}
                                    tokenSeparators={[',']}>
                                    {opDelegater?.map(row => (
                                        <Option key={row.value} value={row.value}>{row.label}</Option>
                                    ))}
                                </Select>
                            </Col> */}
                            <Col style={{ padding: '0px 10px 0px 10px' }} >
                                <Button className='custom-btn1 btn-outline-info' icon={<SearchOutlined />} title='Tìm kiếm' onClick={() => onSearchByParam()}>Tìm kiếm</Button>
                            </Col>
                            <Col style={{ padding: '0px 10px 0px 0px' }}>
                                <Popconfirm
                                    title="Bạn chắc chắn muốn xóa?"
                                    onConfirm={() => onDeleteRows()}
                                    okText="Đồng ý"
                                    cancelText="Hủy bỏ"
                                >
                                    <Button className='custom-btn1 btn-outline-danger'
                                        // onClick={() => onDeleteRows()} 
                                        icon={<DeleteOutlined />}> Xóa dòng</Button>
                                </Popconfirm>
                            </Col>
                        </Row>
                    </Card>
                    <Card >
                        <NestedTable2
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
                            rowKey="stepDetailId"
                            tableId="stepDetailId"
                        />
                        <br />
                        <Col style={{ textAlign: 'center' }}>
                            <Button className='height-btn2 btn-outline-success' icon={<SaveOutlined />} onClick={() => onSaveData()}>Lưu</Button>
                        </Col>
                        <Modal title="Có bản ghi bị trùng, bạn có muốn ghi đè?"
                            footer={null}
                            visible={isModalVisible}
                            onCancel={handleCancel}
                        >
                            <div>
                                <Button onClick={handleOk}>Đồng ý</Button>
                                <Button onClick={handleCancel}>Đóng</Button>
                            </div>
                        </Modal>
                    </Card>
                </Spin>
            </PageContainer>
        </div>
    )
}