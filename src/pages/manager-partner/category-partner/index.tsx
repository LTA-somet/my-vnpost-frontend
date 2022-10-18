import { AccountDto, ContactDto, ProductApi } from '@/services/client';
import { OwnerApi } from '@/services/client';
import { MenuUnfoldOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Card, Col, Input, Row, Button, Select, Spin, Popconfirm, Form } from 'antd';
import { DeleteOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import EditFormReceiver from './edit';
import { dataToSelectBox } from '@/utils';
import { useCurrentUser } from '@/core/selectors';
import { PageContainer } from '@ant-design/pro-layout';

const productApi = new ProductApi();
const ReceiverManager = () => {
    const [isShowForm, setIsShowForm] = useState(false);
    const { reload, isLoading, isSaving, createRecord, updateRecord, deleteMultiRecord, selectedRowKeys, searchByParam } = useModel('contactList')
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [isView] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<ContactDto>();
    const [owner, setOwner] = useState<any[]>([]);
    const [createdBy, setCreatedBy] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState<any>();
    const [searchOwner, setSearchOwner] = useState<any>();
    const [createdBys, setCreatedBys] = useState<any[]>([]);
    const isSender: boolean = true;
    const currentUser = useCurrentUser();

    useEffect(() => {
        reload(!isSender);
    }, [isSender, reload]);

    const getOpAccountChild = useCallback((callback?: (success: boolean) => void) => {
        productApi
            .getAccount()
            .then((resp) => {
                if (resp.status === 200) {
                    setOwner(resp.data);
                }
                if (callback) {
                    callback(resp.status === 200);
                }
            })
    }, []);

    const getOpDelegater = useCallback((account: string, callback?: (success: boolean) => void) => {
        productApi
            .getDelegater(account)
            .then((resp) => {
                if (resp.status === 200) {
                    setCreatedBy(resp.data);
                }
                if (callback) {
                    callback(resp.status === 200);
                }
            })
    }, []);

    useEffect(() => {
        getOpAccountChild();
        getOpDelegater()
    }, []);

    const toggleShowEdit = () => {
        setShowEdit(!showEdit);
    }
    const handleCreate = () => {
        setRecordEdit(undefined);
        toggleShowEdit();
    }
    const onDeleteMultiRecord = () => {
        if (selectedRowKeys.length > 0) {
            deleteMultiRecord(selectedRowKeys);
            reload(!isSender);
        }
    }
    const onEdit = (values: any) => {
        if (recordEdit) {
            // update
            updateRecord(recordEdit.contactId!, !isSender, values, () => toggleShowEdit());
        } else {
            createRecord(values, !isSender, () => toggleShowEdit());
        }
    }

    const handleSearch = () => {
        const param = {
            "searchValue": searchValue,
            "owner": searchOwner,
            "createdBys": createdBys,
            "isSender": !isSender
        }

        searchByParam(param);
    };

    const onChangeOwner = (value: any) => {
        setSearchOwner(value)
        if (value) {
            getOpDelegater(value)
        } else {
            getOpDelegater()
        }
        setCreatedBys([])

    }

    const onChangeNguoiTao = (value: any) => {
        setCreatedBys(value)
    }

    const onBlurSearchValue = (e: any) => {
        setSearchValue(e.target.value)
    }

    const changeFormScreen = () => {
        if (!isShowForm) {
            setIsShowForm(true);
        } else {
            setIsShowForm(false);
        }
    }

    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Card className="fadeInRight" >
                        <Row gutter={8}>
                            <Col span={5}>
                                <Form.Item label='Tên đối tác'>
                                    <Input
                                        // placeholder="Nhập tên/số điện thoại"
                                        allowClear
                                        style={{ width: "100%" }}
                                        onBlur={onBlurSearchValue}
                                    />
                                </Form.Item>
                            </Col>
                            <Col >
                                <Button title='Tìm kiếm' onClick={handleSearch} className='custom-btn1 btn-outline-info' icon={<SearchOutlined />} > Tìm kiếm </Button>
                            </Col>
                            <Col span={2.5}>
                                {!isShowForm && <Button className='custom-btn1 btn-outline-info' icon={<PlusCircleOutlined />} onClick={handleCreate} >Thêm mới</Button>}
                            </Col>
                        </Row>
                    </Card>
                </Spin>
                <EditFormReceiver
                    visible={showEdit}
                    setVisible={setShowEdit}
                    onEdit={onEdit}
                    record={recordEdit}
                    isSaving={isSaving}
                    isView={isView}
                />
            </PageContainer>
        </div>
    );

};
export default ReceiverManager;

