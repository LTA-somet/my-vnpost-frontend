import type { ConfigDisplayDto, DmFeildDisplayEntity } from '@/services/client';
import { DmFeildDisplayApi } from '@/services/client';
import { Card, Col, Form, Row, Button, Space, Modal, Checkbox, Tree, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { validateMessages } from '@/core/contains';
import './style.less';
import { SaveOutlined, CloseCircleOutlined } from '@ant-design/icons';

// const configDisplayApi = new ConfigDisplayApi();
const dmFeildDisplayApi = new DmFeildDisplayApi();
const ShowSettingsOrder: React.FC<Props> = (props: Props) => {

    const [dataTreeList, setDataTreeList] = useState<any[]>([]);
    // const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<any[]>([]);
    // const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

    const [listDmFeildDisplay, setListDmFeildDisplay] = useState<DmFeildDisplayEntity[]>([]);
    const [checkedList, setCheckedList] = useState<React.Key[]>([]);
    const [checkedValue, setCheckedValue] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();


    const loadDataCheckboxGroup = () => {
        return listDmFeildDisplay.map((item: any) => {
            return {
                label: item.colName,
                value: item.colCode
            };
        });
    }

    // const loadDataDmFeildDisplay = () => {
    //     dmFeildDisplayApi
    //         .getAllDmFeilDisplay()
    //         .then((resp) => {
    //             if (resp.status === 200) {
    //                 setListDmFeildDisplay(resp.data);
    //             }
    //         })
    // };

    // useEffect(() => {
    //     loadDataDmFeildDisplay();
    // }, [props.visible]);

    //Sử dụng useEffect hook như componentDidMount
    useEffect(() => {
        //Gọi API
        setIsLoading(true)
        dmFeildDisplayApi.getAllDmFeilDisplay().then((res) => {
            // get data danh mục
            // Bạn có thể xem lại bài viết về useState()
            setListDmFeildDisplay(res.data);
        }).catch((err) => {
            //Trường hợp xảy ra lỗi
            console.log(err);
        }).finally(() => setIsLoading(false))
    }, [])

    // const onExpand = (expandedKeysValue: React.Key[]) => {
    //     setExpandedKeys(expandedKeysValue);
    //     setAutoExpandParent(false);
    // };

    const loadDataConfigDisplay = () => {

        if (props.record) {
            const orderStatusList = props.record.listOrderStatus?.split(',');
            const val = orderStatusList?.map(i => +i); //convert element trong mảng từ string sang number
            if (val) {
                setCheckedKeys(val!);
            }
            else {
                setCheckedKeys([])
            }

            const colCodeList = props.record.listColCode?.split(',');
            // console.log(colCodeList);

            setCheckedList(colCodeList!);
        }


    }

    useEffect(() => {
        if (checkedKeys.length > 0 && props.orderStatusList.length > 0) {
            if (JSON.stringify(checkedKeys) === JSON.stringify(props.orderStatusList.map(s => s.orderStatusId))) {
                setCheckedValue(true)
            }

        }
        const dataTree: any[] = [];
        if (props.orderStatusList.length > 0) {
            props.orderStatusList.filter((c: any) => props.orderStatusList.findIndex((t: any) => t.orderStatusGroup == c.orderStatusId) !== -1).forEach((element: any) => {
                dataTree.push(LoadDataTreeChild(element));
            });
            function LoadDataTreeChild(itemChild: any) {
                const itemNewChild: any = {
                    title: itemChild.statusGroupName,
                    key: itemChild.orderStatusId + '00',
                    children: []
                };
                props.orderStatusList.filter((c: any) => c.orderStatusGroup == itemChild.orderStatusId).forEach((element: any) => {
                    const itemChildOfNewTree: any = {
                        key: element.orderStatusId,
                        title: element.name
                    };
                    itemNewChild.children.push(itemChildOfNewTree);
                });
                return itemNewChild;
            }
        }
        setDataTreeList(dataTree);
        loadDataConfigDisplay();
    }, [props.orderStatusList]);

    const filterChild = (code: string) => {
        return dataTreeList.filter(c => c.key === code);
    }

    const SelectedAll = (e: any) => {
        setCheckedValue(e.target.checked)
        let newSelectedRowKeys = [];
        if (e.target.checked) {
            newSelectedRowKeys = props.orderStatusList.map((element: any) => element.orderStatusId);
            setCheckedKeys(newSelectedRowKeys);
        } else {
            setCheckedKeys([])
        }
    };

    const onCheck = (checkedKeysValue: React.Key[], info: { checked: boolean, node: any }) => {

        if (info.node.key.length >= 3) {
            // eslint-disable-next-line no-param-reassign
            checkedKeysValue = checkedKeysValue.filter(c => c !== info.node.key);
        } else {
            // eslint-disable-next-line no-param-reassign
            checkedKeysValue = checkedKeysValue.filter(c => c.toString().length < 3);
        }
        let newCheckedKeys = [...checkedKeys]
        if (info.checked) {
            newCheckedKeys = newCheckedKeys.concat(checkedKeysValue.filter(i => !checkedKeys.includes(i)));
        } else {
            // newCheckedKeys = [...checkedKeys.filter(c => checkedKeysValue.includes(c))];
            let newCheckedKeysValue: any[];
            if (info.node.children) {
                /** Xử lý Tree có children info.node.children */
                newCheckedKeysValue = info.node.children.map((c: any) => c.key);
                newCheckedKeys = [...checkedKeys.filter(c => !newCheckedKeysValue.includes(c))];
            } else {
                /** Xử lý Tree không có children */
                newCheckedKeys = [...checkedKeys.filter(c => c != info.node.key)];
            }
        }
        if (newCheckedKeys.length === props.orderStatusList.length) {
            setCheckedValue(true)
        } else {
            setCheckedValue(false)
        }
        console.log(newCheckedKeys);



        setCheckedKeys([...newCheckedKeys]);
    };

    const onFinish = (values: any) => {
        if (checkedKeys) {
            values.listOrderStatus = checkedKeys.join(',');
        }
        // values.listColCode = listColCode.current;
        values.listColCode = checkedList.join(',');
        props.onSubmit(values);
        // console.log('Success:', values);
    };

    const onCancel = () => {
        if (props.record) {
            const orderStatusList = props.record.listOrderStatus?.split(',');
            const val = orderStatusList?.map(i => +i); //convert element trong mảng từ string sang number
            setCheckedKeys(val!);

            const colCodeList = props.record.listColCode?.split(',');

            setCheckedList(colCodeList!);
        }
        props.setVisible(false);
    }

    const onChangeCheckGroup = (list: any) => {
        setCheckedList(list);
        // console.log(list);

    };

    return (
        <div>
            <Spin spinning={isLoading}>
                <Modal
                    title="Danh sách hiển thị" style={{ fontSize: 16 }}
                    visible={props.visible}
                    onCancel={onCancel}
                    // onOk={onFinish}
                    width={1000}
                    // loading={props.isSaving}
                    // !props.isView && 
                    footer={
                        <Space>
                            <Button className='custom-btn1 btn-outline-danger' icon={<CloseCircleOutlined />} onClick={onCancel}>Huỷ</Button>
                            {<Button className='custom-btn1 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" form="form-show-settings-order" type="primary">
                                Lưu
                            </Button>}
                        </Space>
                    }
                >
                    <Form
                        name="form-show-settings-order"
                        labelCol={{ flex: '130px' }}
                        labelWrap
                        onFinish={onFinish}
                        form={form}
                        validateMessages={validateMessages}
                    >
                        <Card title='Thông tin đơn hàng'>
                            <Checkbox.Group className="configCheckboxGroupItem" options={loadDataCheckboxGroup()} value={checkedList} onChange={onChangeCheckGroup} />
                        </Card>
                        <br />
                        <Card id="configNotifyTree" title='Trạng thái đơn hàng'>
                            <Checkbox onChange={SelectedAll} checked={checkedValue}><span className='ant-tree-node-content-wrapper ant-tree-node-content-wrapper-open'>Tất cả</span></Checkbox>
                            <p><span style={{ paddingBottom: "5px", fontWeight: 'bold' }} /></p>
                            {
                                dataTreeList.map((element) => (
                                    <div key={element.key}>
                                        <Row gutter={14}>
                                            <Col span={24}>
                                                <Tree
                                                    checkable
                                                    // expandedKeys={expandedKeys}
                                                    // autoExpandParent={autoExpandParent}
                                                    checkedKeys={checkedKeys}
                                                    // selectedKeys={selectedKeys}
                                                    // defaultExpandedKeys={['100', '200']}
                                                    // onExpand={onExpand}
                                                    defaultExpandAll
                                                    onCheck={onCheck}
                                                    // onSelect={onSelect}
                                                    treeData={filterChild(element.key)}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                ))
                            }
                        </Card>

                    </Form>
                </Modal>
            </Spin>
        </div>
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    dataList?: any[],
    orderStatusList: any[],
    record?: ConfigDisplayDto,
    onSubmit: (record: ConfigDisplayDto) => void,
}

export default ShowSettingsOrder;

