import { DmNotifyApi, McasUserApi } from '@/services/client';
import { ExportOutlined, SaveOutlined } from '@ant-design/icons';
import { Card, Col, Row, Button, Modal, Checkbox, Tree, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import './index.less'
// import '../scss/theme.css';
// import '../scss/style.css';
// import '../plugins/bootstrap/dist/css/bootstrap.min.css';
// import '../plugins/icon-kit/dist/css/iconkit.min.css';

const ConfigNotification = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCheckedSupportNotification, setIsCheckedSupportNotification] = useState(false);
    const dmNotifyApi = new DmNotifyApi();
    const mcasUserApi = new McasUserApi();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

    const [dataTreeList, setDataTreeList] = useState<any[]>([]);

    const loadDataMcasUserDto = () => {
        mcasUserApi
            .getFullUserInfo()
            .then((resp) => {
                if (resp.status === 200) {
                    const dataUser = resp.data;
                    if (dataUser.isNotify === "1") { setIsCheckedSupportNotification(true) } else { setIsCheckedSupportNotification(false) };
                    if (dataUser.notifyList != null) {
                        const keyArr = dataUser.notifyList?.split(',');
                        setCheckedKeys(keyArr);
                    }
                }
            })
    };

    const loadDataTree = (listDmNotifyDto: any) => {
        const dataTree: any[] = [];
        if (listDmNotifyDto.length > 0) {
            listDmNotifyDto.filter((c: any) => listDmNotifyDto.findIndex((t: any) => t.notifyGroup === c.notifyCode) !== -1).forEach((element: any) => {
                dataTree.push(LoadDataTreeChild(element));
            });
            function LoadDataTreeChild(itemChild: any) {
                const itemNewChild: any = {
                    title: itemChild.notifyGroupName,
                    key: itemChild.notifyCode + '00',
                    children: []
                };
                listDmNotifyDto.filter((c: any) => c.notifyGroup === itemChild.notifyCode).forEach((element: any) => {
                    const itemChildOfNewTree: any = {
                        key: element.notifyCode,
                        title: element.notifyName
                    };
                    itemNewChild.children.push(itemChildOfNewTree);
                });
                return itemNewChild;
            }
        }
        setExpandedKeys(dataTree.map(c => c.key));
        setDataTreeList(dataTree);
        loadDataMcasUserDto();
    }

    const reload = useCallback((callback?: (success: boolean) => void) => {
        dmNotifyApi
            .getAllByNotify()
            .then((resp) => {
                if (resp.status === 200) {
                    loadDataTree(resp.data);
                }
                if (callback) {
                    callback(resp.status === 200);
                }
            })
    }, []);

    useEffect(() => {
        reload();
    }, [])

    const onExpand = (expandedKeysValue: React.Key[]) => {
        console.log('onExpand', expandedKeysValue); // Giá trị của key cha khi load trang
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    const onCheck = (checkedKeysValue: React.Key[], info: { checked: boolean, node: any }) => {
        // const arrayRemove = ['100', '200', '300', '400', '500'];
        // checkedKeysValue = removeItems(checkedKeysValue, arrayRemove);

        // eslint-disable-next-line no-param-reassign
        checkedKeysValue = checkedKeysValue.filter(c => (!expandedKeys.includes(c)));
        setCheckedKeys([...checkedKeysValue]);
        // 
        // // let newCheckedKeys = [...checkedKeys]
        // let newCheckedKeys = info.node.key
        // if (info.checked) {
        //     newCheckedKeys = newCheckedKeys.concat(checkedKeysValue.filter(i => !checkedKeys.includes(i)));
        // } else {
        //     // newCheckedKeys = [...checkedKeys.filter(c => checkedKeysValue.includes(c))];
        //     let newCheckedKeysValue: any[];
        //     if (info.node.children) {
        //         /** Xử lý Tree có children info.node.children */
        //         newCheckedKeysValue = info.node.children.map((c: any) => c.key);
        //         newCheckedKeys = [...checkedKeys.filter(c => !newCheckedKeysValue.includes(c))];
        //     } else {
        //         /** Xử lý Tree không có children */
        //         newCheckedKeys = [...checkedKeys.filter(c => c != info.node.key)];
        //     }
        // }
        // console.log(newCheckedKeys);

        // setCheckedKeys([...newCheckedKeys]);
    };

    const removeItems = (checkedKeysValue: any, array: any) => {
        return checkedKeysValue.filter((v: any) => {
            return !array.includes(v);
        });
    }

    const onSelect = (selectedKeysValue: React.Key[], info: any) => {
        setSelectedKeys(selectedKeysValue);
    };


    const handleCancelSupportNotification = () => {
        setIsModalVisible(false);
        setIsCheckedSupportNotification(isCheckedSupportNotification);
    };

    const openSupportNotification = () => {
        if (isCheckedSupportNotification === false) {
            // setFormData({ ...formData, IS_NOTIFY: "1" })
            setIsModalVisible(true);
        } else {
            // setFormData({ ...formData, IS_NOTIFY: "0" })
        }
        setIsCheckedSupportNotification(!isCheckedSupportNotification);
    }

    const saveConfigNotification = () => {
        setIsLoading(true);
        let myCheckedNofication: string;
        if (isCheckedSupportNotification) { myCheckedNofication = '1' } else { myCheckedNofication = '0' }
        const record = {
            notifyList: checkedKeys.join(','),
            isNotify: myCheckedNofication
        };
        mcasUserApi.updateItemNotify(record)
            .then((response: any) => {
                if (response.status === 200) {
                    message.success('Cập nhật thành công !');
                } else {
                    message.error('Cật nhật thất bại !');
                }
            }).finally(() => setIsLoading(false))
            .catch((e: Error) => {
                console.log(e);
            });
    };

    const filterChild = (code: string) => {
        return dataTreeList.filter(c => c.key === code);
    }

    return (
        <>
            {/* <Card className="fadeInRight"> */}
            <Card title='Cấu hình người dùng' className="fadeInRight" size='small' bordered={false}>
                <Checkbox onClick={openSupportNotification} checked={isCheckedSupportNotification} > <span className='span-font'>Nhận Nofitication trên Web</span></Checkbox>
            </Card>
            <Modal title="Hướng dẫn bật thông báo" width={900}
                onCancel={handleCancelSupportNotification}
                visible={isModalVisible}
                footer={[
                    <Button icon={<ExportOutlined />} key="back" onClick={handleCancelSupportNotification}>
                        Đóng
                    </Button>
                ]}>
                <Row>
                    <table className="table table-bordered" style={{ marginBottom: 0 }}>
                        <tbody> <tr> <td><label><span className="number">1</span> Chọn <i className="ik ik-lock icon-tb"></i> trong thanh địa chỉ của trình duyệt </label> </td> </tr>
                            <tr> <td><label> <span className="number">2</span> Định vị <i className="ik ik-bell icon-tb"></i> <strong>Thông báo</strong> và chọn "<em>Cho phép</em>" </label></td></tr>
                            <tr> <td> <label> <span className="number">3</span> Chọn <strong>Bật</strong> ở dưới</label></td></tr>
                        </tbody>
                    </table>
                </Row>
            </Modal>
            {/* <br /> */}
            <Card title='Cấu hình nhận thông báo' className="fadeInRight" size='small' bordered={false}>
                <Row gutter={8}>
                    <Col span={24}>
                        <Tree className='span-font'
                            checkable
                            onSelect={onSelect}
                            onExpand={onExpand}
                            checkedKeys={checkedKeys}
                            onCheck={onCheck}
                            treeData={dataTreeList}
                            expandedKeys={expandedKeys}
                        // height={350}
                        />
                    </Col>
                </Row>
            </Card>
            <Card size='small' bordered={false}>
                <Row >
                    <Col flex="auto" style={{ textAlign: 'center' }}>
                        <Button className='custom-btn4 btn-outline-success' icon={<SaveOutlined className="site-form-item-icon" />} loading={isLoading} htmlType="submit" onClick={saveConfigNotification} size="large" >
                            Lưu cấu hình
                        </Button>
                    </Col>
                </Row>
            </Card>
            {/* <br />
            <span style={{ marginLeft: "50%" }}>
                <Button className='custom-btn4 btn-outline-success' icon={<SaveOutlined className="site-form-item-icon" />} loading={isLoading} htmlType="submit" onClick={saveConfigNotification} size="large" >
                    Lưu cấu hình
                </Button>
            </span> */}
            {/* </Card> */}
        </>
    );

};

export default ConfigNotification;