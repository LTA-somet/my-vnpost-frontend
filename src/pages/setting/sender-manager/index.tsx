import { AccountDto, ContactApi, ContactDto } from '@/services/client';
import { OwnerApi } from '@/services/client';
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Card, Col, Input, Row, Button, Select, Spin, Popconfirm } from 'antd';
import { DeleteOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { dataToSelectBox } from '@/utils';
import BlockForm from './block-form';
import GridForm from './grid-form';
import EditFormSender from './edit';
import { useCurrentUser } from '@/core/selectors';
import { PageContainer } from '@ant-design/pro-layout';

const ownerApi = new OwnerApi();
const contactApi = new ContactApi();
const SenderManager = () => {
    const [isShowForm, setIsShowForm] = useState(false);
    const { paramSearch, isLoading, isSaving, createRecord, updateRecord, deleteMultiRecord, selectedRowKeys, isShowSelectAll, cancelSelectedAll, searchByParam, page, size, setPage } = useModel('contactList')
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

    const getOwner = (account: AccountDto) => {
        return {
            username: account.username,
            name: account.fullname + ' - ' + account.phoneNumber
        }
    }

    const findCreatedBy = (username: string) => {
        if (username) {
            ownerApi.findAllCreatedBy(username)
                .then(resp => {
                    if (resp.status === 200 && resp.data !== null) {
                        const result = resp.data.map(r => {
                            return getOwner(r)
                        })
                        setCreatedBy(result);
                    }
                });
        }
    }

    useEffect(() => {
        ownerApi.findAllOwner()
            .then(resp => {
                if (resp.status === 200 && resp.data !== null) {
                    const result = resp.data.map(r => {
                        return getOwner(r)
                    })
                    setOwner(result);
                }
            });
        findCreatedBy(currentUser.uid!)
    }, []);

    const toggleShowEdit = () => {
        setShowEdit(!showEdit);
    }
    const handleCreate = () => {
        setRecordEdit(undefined);
        toggleShowEdit();
    }
    const onDeleteMulti = () => {
        if (selectedRowKeys.length > 0) {
            deleteMultiRecord(selectedRowKeys);
            // reload(isSender);
        }
    }

    const onDeleteMultiRecord = () => {
        contactApi.deleteAll(paramSearch!)
            .then(resp => {
                if (resp.status === 204) {
                    searchByParam(paramSearch!, page, size);
                }
            })
        // deleteMultiRecord(lstId);
    }

    const onEdit = (values: any) => {
        if (recordEdit) {
            // update
            updateRecord(recordEdit.contactId!, isSender, values, () => toggleShowEdit());
        } else {
            createRecord(values, isSender, () => toggleShowEdit());
        }
    }

    const handleSearch = () => {
        const param = {
            "searchValue": searchValue,
            "owner": searchOwner,
            "createdBys": createdBys,
            "isSender": isSender
        }

        searchByParam(param, 0, size);
        cancelSelectedAll()
        setPage(0);
    };

    const onChangeOwner = (value: any) => {
        setSearchOwner(value)
        if (value) {
            findCreatedBy(value)
        } else {
            findCreatedBy(currentUser.uid!)
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
            cancelSelectedAll();
        } else {
            setIsShowForm(false);
            cancelSelectedAll();
        }
    }
    useEffect(() => {
        console.log(isShowSelectAll);

    }, [isShowSelectAll])

    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Card className="fadeInRight" >
                        <Row gutter={8} >
                            <Col span={5}>
                                <Input
                                    placeholder="Nhập tên/số điện thoại"
                                    allowClear
                                    style={{ width: "100%" }}
                                    onBlur={onBlurSearchValue}
                                />
                            </Col>
                            <Col span={5}>

                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: "100%" }}
                                    placeholder="Tài khoản quản lý"
                                    onChange={onChangeOwner}
                                >
                                    {dataToSelectBox(owner, 'username', 'name')}
                                </Select>
                            </Col>
                            <Col span={5}>

                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '100%', height: '100%' }}
                                    placeholder="Người tạo"
                                    onChange={onChangeNguoiTao}
                                    value={createdBys}
                                >
                                    {dataToSelectBox(createdBy, 'username', 'name')}
                                </Select>
                            </Col>
                            <Col >
                                {/* <Button title='Tìm kiếm' onClick={handleSearch} className='custom-btn1 btn-outline-info' icon={<SearchOutlined />} > Tìm kiếm </Button> */}
                                <Button title='Tìm kiếm' onClick={handleSearch} className='btn-outline-info' icon={<SearchOutlined />} >Tìm kiếm</Button>
                            </Col>
                            <Col >
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
                            </Col>
                            <Col span={2.5}  >
                                <Button className='custom-btn1 btn-outline-info' icon={<PlusCircleOutlined />} onClick={handleCreate} >Thêm mới</Button>
                            </Col>
                            <Col span={1}>
                                <div style={{
                                    fontSize: "140%", paddingLeft: '4px',
                                    paddingRight: '4px'
                                }}>
                                    {
                                        !isShowForm && <AppstoreOutlined title='Dạng khối' onClick={changeFormScreen} />
                                    }
                                    {
                                        isShowForm && <UnorderedListOutlined title='Dạng lưới' onClick={changeFormScreen} />
                                    }
                                </div>
                            </Col>
                        </Row>

                        <br />
                        <Row gutter={8}>
                            <Col span={24}>
                                {
                                    !isShowForm && <GridForm />
                                }
                            </Col>
                        </Row>
                        <Row gutter={8}>

                            <Col span={24}>
                                {
                                    isShowForm && <BlockForm />
                                }
                            </Col>
                        </Row>
                    </Card>

                </Spin>
            </PageContainer>
            <EditFormSender
                visible={showEdit}
                setVisible={setShowEdit}
                onEdit={onEdit}
                record={recordEdit}
                isSaving={isSaving}
                isView={isView}
            />
        </div>
    );

};
export default SenderManager;

