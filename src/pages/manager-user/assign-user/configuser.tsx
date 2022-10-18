import React, { useEffect, useState } from 'react';
import { McasGroupDto } from '@/services/client';
import { Form, Input, Modal, Space, Button, Spin, Transfer, Icon } from 'antd';
import { validateMessages } from '@/core/contains';
import { McasUserDto } from './../../../services/client/api';
import { useModel } from 'umi';
import { APPCODE } from './../../../core/contains';
import { ExportOutlined, SaveOutlined } from '@ant-design/icons';

const ConfigUser: React.FC<Props> = (props: Props) => {

    const { dataSourceGroup, dataSourceGroupUser, selectGroupInUserGroupByUser, selectGroupNotInUserGroupByUser, updateGroup, isLoading } = useModel('mcasUserList')

    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const [dataSource, setDataSource] = useState<any[]>([]);
    //const [isLoading, setIsLoading] = useState<boolean>(false);
    //const [dataTableGroupUser, setDataTableGroupUser] = useState<any[]>([]);

    useEffect(() => {
        console.log('configUser-> Bắt đầu hiện thị màn hình gàn cho User: ', props.record);
        if (props.visible) {
            //setDataSource(props.groupDto);
            //setIsLoading(props.isLoading);
            //setTargetKeys(props.dataSourceGroupUser.map((item) => item.key));
            selectGroupNotInUserGroupByUser(props.record);
            selectGroupInUserGroupByUser(props.record);
        }
    }, [props.visible])

    // const onFill = () => {
    //     if (props.record) {
    //         form.setFieldsValue(props.record);
    //     } else {
    //         form.resetFields();
    //     }
    // };

    // useEffect(() => {
    //     onFill();
    // }, [group]);

    // const reloadData = async () => {
    //     setIsLoading(true);

    //     let groupInUser = await this.fetchGroupInUser();
    //     let groupNotInUser = await this.fetchGroupNotInUser();
    //     this.setState({
    //         groupList: [...groupInUser, ...groupNotInUser],
    //         groupInUser: groupInUser.map((item) => item.key),
    //         isLoading: false,
    //     });
    // };

    useEffect(() => {
        //Lấy danh sách các nhóm quyền đã được gán cho user
        //console.log('3. Lấy danh sách các nhóm quyền đã được gán cho user', dataSourceGroupUser);
        setTargetKeys(dataSourceGroupUser.map((item) => item.key));
        //setDataTableGroupUser(dataSourceGroupUser);
    }, [dataSourceGroupUser])

    useEffect(() => {
        //Lấy danh sách các nhóm quyền -> để gán cho User
        //console.log('2. Lấy danh sách các nhóm quyền -> để gán cho User', dataSourceGroup);
        setDataSource(dataSourceGroup);
    }, [dataSourceGroup])

    // const onSave = () => {
    //     props.onSaveGroupUser(targetKeys);
    // }

    const handleChange = (nextTargetKeys: any, direction, moveKeys) => {
        setTargetKeys(nextTargetKeys);

    };

    const onSave = () => {
        //console.log('values', values, 'record:', record);
        // let obj: McasUserGroupDto;
        // obj.appCode = APPCODE;
        // obj.listGroupCode = values;
        // obj.orgCode = "00";
        // obj.username = record.username;

        updateGroup(
            {
                appCode: APPCODE, // 'MCAS',
                listGroupCode: targetKeys,
                orgCode: props.record?.orgCode,
                username: props.record?.username,
            }
        );

    }
    return (
        <Modal
            title={'Thiết lập nhóm cho người dùng - ' + props.record?.username}
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            width={700}

            footer={
                <Space>
                    <Button icon={<ExportOutlined />} className='custom-btn1 btn-outline-secondary' onClick={() => props.setVisible(false)}>Đóng</Button>
                    <Button icon={<SaveOutlined />} className='custom-btn1 btn-outline-success' onClick={onSave}
                    // loading={props.isSaving}
                    >
                        Lưu
                    </Button>
                </Space>
            }
            destroyOnClose
        >
            <Spin
                spinning={isLoading}
                indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
                tip="Loading..."
            >
                <Transfer
                    titles={["Danh sách quyền dữ liệu", "Quyền đã gán"]}
                    listStyle={{
                        width: "47%",
                        textAlign: 'left',

                    }}
                    operationStyle={{
                        margin: "0 1%"
                    }}
                    locale={{
                        itemUnit: "",
                        itemsUnit: "",
                        notFoundContent: "Danh sách không có dữ liệu",
                        searchPlaceholder: "Hãy nhập tên nhóm",
                    }}
                    targetKeys={targetKeys} // key list
                    dataSource={dataSource}
                    render={(item) => item.groupCode + " - " + item.name}
                    onChange={handleChange}
                />
            </Spin>
        </Modal>
    );
};

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    isLoading: boolean
    record: McasUserDto;
}
ConfigUser.defaultProps = {
}
export default ConfigUser;