import React, { useEffect, useState } from 'react';
//import { McasGroupDto, McasMenuByGroupPermissionAllDto } from '@/services/client';
import { Modal, Space, Button, Tree, Col, Row, notification } from 'antd';
import { check } from 'prettier';
import { KeyObject } from './../../product/create-product/columns';
import { CheckCircleOutlined, ExportOutlined } from '@ant-design/icons';

const MenuTree: React.FC<Props> = (props: Props) => {
    //const [groupDto, setGroupDto] = useState<McasGroupDto[]>([]);
    //const [group, setGroup] = useState<McasGroupDto>();
    //const [dataTreeList, setDataTreeList] = useState<McasMenuByGroupPermissionAllDto[]>([]);
    const [dataTree, setDataTree] = useState<any[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [checkedSaveKeys, setCheckedSaveKeys] = useState<React.Key[]>([]);
    //const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    //const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
    //const [menuKeys, setMenuKeys] = useState<[]>([]);
    useEffect(() => {

        try {
            console.log('3. Hien thin màn hình', props.visible)
            if (props.visible) {
                //console.log('3.1 sssssss children ssssssss', props.dataTree.children)
                Object.values(props.dataTree).map((element) => {
                    setDataTree(element);
                    console.log('3.2-> Convert từ OBJECT -> ARRAY:', element);
                    if (element !== undefined && element !== null && element) {
                        let keyselectd = [];
                        //console.log('HHHHHHHH', filterre(element));
                        const mang = filterre(element);
                        if (mang.length > 0) {
                            mang.map((c: any) => {
                                keyselectd.push(c.key);
                            })
                        }
                        console.log('3.3->HHHHHHHH', keyselectd, ' element ', element);
                        setCheckedKeys(keyselectd);

                    }
                }
                );
            }

        } catch (error) {
            console.log('LOI ', error)
        }
    }, [props.dataTree])

    // useEffect(() => {
    //     onFill();
    // }, [group]);
    function filterre(arr: any[]) {
        let matches: any[] = [];

        if (!Array.isArray(arr)) return matches;

        arr.forEach(function (i) {

            if (i.checked) {
                if (i.children) {
                    const filterData = (i.children && Array.isArray(i.children)) ? i.children.filter(values => values.checked) : [];
                    //console.log('filterre -> 1', filterData, ' i-> ', i)
                    // if(i.children)
                    // {
                    let childResult = filterre(i.children);
                    if (childResult && childResult.length > 0) {
                        //console.log('childResults', childResults)
                        //console.log('2...childResults', Object.assign({}, i, { children: childResults }))
                        //matches.push(Object.assign({}, i, { children: childResults }));
                        matches = matches.concat(childResult);
                    }
                    // }
                    // i.children = filterData;
                    //matches.push(i);
                }
                else {
                    //console.log('filterre -> 2', i)
                    matches.push(i);
                }

            } else {
                //console.log('filterre -> 3', i)
                if (i.children) {
                    let childResults = filterre(i.children);
                    if (childResults && childResults.length > 0) {
                        //console.log('childResults', childResults)
                        //console.log('2...childResults', Object.assign({}, i, { children: childResults }))
                        //matches.push(Object.assign({}, i, { children: childResults }));
                        matches = matches.concat(childResults);
                    }
                }
            }
        })
        return matches;
    }

    const onSave = () => {
        //console.log('Save phan quyen cho nhom,', checkedSaveKeys, ' dataTree', dataTree);
        if (checkedSaveKeys === undefined || checkedSaveKeys.length === 0) {
            //notification.warn({ message: 'Chưa có thông tin để lưu' });
            props.onSaveMenu("ABC#123");
        }
        else {
            props.onSaveMenu(checkedSaveKeys);
        }

    }

    const onCheck = (checkedKeysValue: React.Key[], info: { checked: boolean, node: any, halfCheckedKeys: any[] }) => {
        //console.log('0. checkedKeysValue', checkedKeysValue, ' info: ', info, 'halfCheckedKey', info.halfCheckedKeys)
        setCheckedKeys(checkedKeysValue);
        setCheckedSaveKeys(checkedKeysValue.concat(info.halfCheckedKeys));
        // let newCheckedKeys = [...checkedKeys]
        //console.log('onCheck->1.checkedKeysValue: ', checkedKeysValue.concat(info.halfCheckedKeys))
        // console.log('2. newCheckedKeys: ', newCheckedKeys)
        // newCheckedKeys = newCheckedKeys.concat(checkedKeysValue.filter(i => !checkedKeys.includes(i)));
        // console.log('3. newCheckedKeys: ', newCheckedKeys)
    };

    return (
        <Modal
            title={'Gán quyền cho nhóm ' + props.groupName}
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            width={700}
            footer={
                <Space>
                    <Button className='custom-btn1 btn-outline-secondary' icon={<ExportOutlined />} onClick={() => props.setVisible(false)}>Đóng</Button>
                    <Button className='custom-btn1 btn-outline-success' icon={<CheckCircleOutlined />} onClick={onSave} type="primary" loading={props.isSaving}>
                        Thực hiện
                    </Button>
                </Space>
            }
            destroyOnClose
        >

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
                        //defaultExpandAll
                        onCheck={onCheck}
                        //onSelect={onSelect}
                        treeData={dataTree}
                        height={410}
                        virtual={false}
                    />
                </Col>
            </Row>

        </Modal>
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    onSaveMenu: (checkedKeys: React.Key[]) => void,
    isSaving: boolean,
    dataTree?: McasMenuByGroupPermissionAllDto[],
    groupName: string,
}
MenuTree.defaultProps = {
}
export default MenuTree;