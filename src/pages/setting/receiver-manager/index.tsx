import { ContactApi, ContactDto, ProductApi } from '@/services/client';
import Icon from '@ant-design/icons';
import { Card, Col, Input, Row, Button, Select, Spin, Popconfirm } from 'antd';
import { DeleteOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import EditFormReceiver from './edit';
import { dataToSelectBox } from '@/utils';
import ReceiverForm from './receiver-form';
import BlacklistForm from './blacklist-form';
import { useCurrentUser } from '@/core/selectors';
import { PageContainer } from '@ant-design/pro-layout';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const productApi = new ProductApi();
const contactApi = new ContactApi();
const ReceiverManager = () => {
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
            "isSender": !isSender,
            "isBlacklist": isShowForm
        }

        searchByParam(param, 0, size);
        cancelSelectedAll()
        setPage(0);
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
            cancelSelectedAll()
        } else {
            setIsShowForm(false);
            cancelSelectedAll();
        }
    }

    const iconBlacklist = () => (
        <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M144.151273 879.988364h256.930909a35.700364 35.700364 0 0 1 0 71.400727H119.714909c-27.042909 0-48.942545-21.317818-48.942545-47.592727v-189.719273c0-115.665455 96.395636-209.454545 215.319272-209.454546h167.889455a35.700364 35.700364 0 0 1 0 71.400728h-167.889455c-78.382545 0-141.917091 61.812364-141.917091 138.053818v165.911273zM721.454545 965.818182a221.090909 221.090909 0 1 1 0-442.181818 221.090909 221.090909 0 0 1 0 442.181818z m0-69.818182a151.272727 151.272727 0 1 0 0-302.545455 151.272727 151.272727 0 0 0 0 302.545455z" />
            <path d="M611.072 584.983273l246.853818 246.853818-49.361454 49.361454-246.853819-246.853818z" />
            <path d="M452.421818 504.552727a186.181818 186.181818 0 1 0 0-372.363636 186.181818 186.181818 0 0 0 0 372.363636z m0 69.818182c-141.381818 0-256-114.618182-256-256s114.618182-256 256-256 256 114.618182 256 256-114.618182 256-256 256z" />
        </svg>
    );
    const iconNomal = () => (
        <svg
            width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M790.341818 872.261818v-134.981818a134.981818 134.981818 0 0 0-134.981818-134.981818H368.64a134.981818 134.981818 0 0 0-134.981818 134.981818v134.981818h556.683636z m-421.701818-339.781818h286.72a204.8 204.8 0 0 1 204.8 204.8v158.254545a46.545455 46.545455 0 0 1-46.545455 46.545455H210.385455a46.545455 46.545455 0 0 1-46.545455-46.545455v-158.254545a204.8 204.8 0 0 1 204.8-204.8z" />
            <path d="M512 524.101818A175.941818 175.941818 0 1 0 512 172.218182a175.941818 175.941818 0 0 0 0 351.883636z m0 69.818182c-135.726545 0-245.76-110.033455-245.76-245.76C266.24 212.433455 376.273455 102.4 512 102.4c135.726545 0 245.76 110.033455 245.76 245.76 0 135.726545-110.033455 245.76-245.76 245.76z" />
        </svg>
    );

    const BlackListIcon = (props: Partial<CustomIconComponentProps>) => (
        <Icon component={iconBlacklist} {...props} />
    );
    const NomalIcon = (props: Partial<CustomIconComponentProps>) => (
        <Icon component={iconNomal} {...props} />
    );

    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Card className="fadeInRight" >
                        <Row gutter={8}>
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
                                    {dataToSelectBox(owner, 'value', 'label')}
                                </Select>
                            </Col>
                            <Col span={5}>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Người tạo"
                                    onChange={onChangeNguoiTao}
                                    value={createdBys}
                                >
                                    {dataToSelectBox(createdBy, 'value', 'label')}
                                </Select>
                            </Col>
                            <Col >
                                <Button title='Tìm kiếm' onClick={handleSearch} className='custom-btn1 btn-outline-info' icon={<SearchOutlined />} > Tìm kiếm </Button>
                            </Col>

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


                            {!isShowForm && <Col span={2.5}> <Button className='custom-btn1 btn-outline-info' icon={<PlusCircleOutlined />} onClick={handleCreate} >Thêm mới</Button>  </Col>}

                            <Col span={1}>
                                <div style={{
                                    fontSize: "140%", paddingLeft: '4px',
                                    paddingRight: '4px'
                                }}>
                                    {
                                        !isShowForm && <BlackListIcon style={{ color: '#6c757d', fontSize: '25px' }} title='Xem DS đen' onClick={changeFormScreen} />
                                    }
                                    {
                                        isShowForm && <NomalIcon style={{ color: '#28a745', fontSize: '25px' }} title='Xem DS người nhận' onClick={changeFormScreen} />
                                    }
                                </div>
                            </Col>


                        </Row>
                        <br />
                        <Row gutter={8}>
                            <Col span={24}>
                                {
                                    !isShowForm && <ReceiverForm />
                                }
                            </Col>
                        </Row>
                        <Row gutter={8}>

                            <Col span={24}>
                                {
                                    isShowForm && <BlacklistForm />
                                }
                            </Col>
                        </Row>
                    </Card>
                </Spin>
            </PageContainer>
            <EditFormReceiver
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
export default ReceiverManager;

