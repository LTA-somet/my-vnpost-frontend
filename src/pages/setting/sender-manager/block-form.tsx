import { DeleteOutlined, EditOutlined, EnvironmentOutlined, HomeOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, message, notification, Pagination, Row, Spin } from 'antd';
import { useState, useEffect } from 'react';
import type { ContactDto } from '@/services/client';
import { ContactApi } from '@/services/client';
import { useModel } from 'umi';
import EditFormSender from './edit';
import { useAdministrativeUnitList, useCurrentUser } from '@/core/selectors';


const contactApi = new ContactApi();
const BlockForm = () => {
    const { page, size, setPage, setSize, totalRecord, dataSource, searchByParam, paramSearch, isLoading, isSaving, createRecord, updateRecord, deleteRecord, dataTable, setDataTable } = useModel('contactList')
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [isView, setIsView] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<ContactDto>();
    const isSender: boolean = true;
    const currentUser = useCurrentUser();
    const addressFromStore = useAdministrativeUnitList();

    const toggleShowEdit = () => {
        setShowEdit(!showEdit);
    }

    useEffect(() => {
        setPage(0);
        setSize(6);
        searchByParam({ isSender: true }, 0, 6)
    }, [])

    const handleEdit = (record: ContactDto) => {
        if (currentUser.uid === record.createdBy || currentUser.uid === record.owner) {
            toggleShowEdit();
            setRecordEdit(record);
            setIsView(false);
        }
        else {
            toggleShowEdit();
            setRecordEdit(record);
            setIsView(true);
        }
    }
    const onEdit = (values: any) => {
        if (recordEdit) {
            // update
            updateRecord(recordEdit.contactId!, isSender, values, () => toggleShowEdit());
        } else {
            createRecord(values, isSender, () => toggleShowEdit());
        }
    }

    const onChangeIsDefault = (record: ContactDto, e: any) => {
        if (currentUser.uid === record.owner) {
            contactApi.updateDefault(record.contactId!, e.target.checked)
                .then(resp => {
                    if (resp.status === 200) {
                        notification.success({ message: 'Đặt mặc định người gửi thành công' })
                        searchByParam({ isSender: isSender }, page, size);
                    }
                })
        }
        else {
            notification.error({ message: 'Không thể đặt mặc định' })
        }
        // reload(isSender);
    }


    const loadPaging = (p: any, s: any) => {
        searchByParam(paramSearch, p - 1, s)
    }

    const onChangePage = (p: any, s: any) => {
        setPage(p - 1);
        setSize(s)
        loadPaging(p, s);
    }

    return (
        <div>
            <Row gutter={[12, 12]}>
                {
                    dataSource.map((element: any) => (
                        <Col span={12} key={element.contactId}>
                            <Card className="fadeInRight" size='small'>
                                <div>
                                    <p><HomeOutlined style={{ fontSize: '150%', color: 'brown' }} /> <span style={{ marginLeft: "15px" }}>{element.name}</span>
                                        <span style={{ float: "right" }}>
                                            <Button title='Sửa' className="btn-outline-info" size="small" onClick={() => handleEdit(element)}><EditOutlined /></Button>
                                            <Button title='Xóa' className="btn-outline-danger" onClick={() => deleteRecord(element.contactId)} size="small" style={{ marginLeft: "5px" }}><DeleteOutlined /></Button>
                                        </span></p>
                                    <p><PhoneOutlined style={{ fontSize: '150%', color: 'green' }} /><span style={{ marginLeft: "15px" }}>{element.phone}</span></p>
                                    <p><EnvironmentOutlined style={{ fontSize: '150%', color: '#c3c319' }} /><span style={{ marginLeft: "15px" }}>
                                        {element.address},
                                        {addressFromStore.communeList.find(commune => commune.code === element.communeCode)?.name},
                                        {addressFromStore.districtList.find(district => district.code === element.districtCode)?.name},
                                        {addressFromStore.provinceList.find(province => province.code === element.provinceCode)?.name}
                                    </span></p>
                                    <p style={{ float: "right" }}><Checkbox disabled={element.owner !== currentUser.uid} checked={element.isDefault} onChange={(e) => onChangeIsDefault(element, e)}>Đặt làm người gửi mặc định</Checkbox></p>
                                </div>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
            <br />
            <Pagination style={{ float: "right" }}
                current={page + 1}
                onChange={onChangePage}
                total={totalRecord}
                showSizeChanger
                pageSizeOptions={['6', '12', '18']}
                defaultPageSize={6}
                defaultCurrent={1}
            />
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

export default BlockForm;