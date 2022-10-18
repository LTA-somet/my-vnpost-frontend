import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, message, notification, Row, Space, Spin, Table } from 'antd';
import { CheckSquareOutlined, BorderOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import defineColumns from './columns';
import { ContactApi, ContactDto } from '@/services/client';
import { useModel } from 'umi';
import EditFormSender from './edit'
import { useCurrentUser } from '@/core/selectors';

const contactApi = new ContactApi();
const GridForm = () => {
    const { page, size, setPage, setSize, totalRecord, dataSource, paramSearch, isSaving, searchByParam, createRecord, updateRecord, deleteRecord, rowSelection, SelectedAll, cancelSelectedAll, isShowSelectAll, dataTable, setDataTable } = useModel('contactList')
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [isView, setIsView] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<ContactDto>();
    const isSender: boolean = true;
    const currentUser = useCurrentUser();

    useEffect(() => {
        setPage(0);
        setSize(10);
        searchByParam({ isSender: true }, 0, 10)
    }, [])

    const toggleShowEdit = () => {
        setShowEdit(!showEdit);

    }

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
        console.log('values', values)
        if (recordEdit) {
            // update
            updateRecord(recordEdit.contactId!, isSender, values, () => toggleShowEdit());
        } else {
            createRecord(values, isSender, () => toggleShowEdit());
        }
    }

    const action = (contactId: number, record: ContactDto): React.ReactNode => {
        return <Space key={contactId}>
            <Button title='Sửa' className="btn-outline-info" size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
            <Button title='Xóa' className="btn-outline-danger" onClick={() => deleteRecord(contactId)} size="small"><DeleteOutlined /></Button>
        </Space>
    }

    /**
      * Checkbox isSender - Column mặc định
      */

    const onChangeIsDefault = (record: ContactDto, checked: boolean) => {
        if (currentUser.uid === record.owner) {
            contactApi.updateDefault(record.contactId!, checked)
                .then(resp => {
                    if (resp.status === 200) {
                        notification.success({ message: 'Đặt mặc định người gửi thành công' })
                        searchByParam(paramSearch!, page, size)
                    }
                })
        }
        else {
            notification.error({ message: 'Không thể đặt mặc định' })
        }
        // reload(isSender);
    }

    const onChangePage = (p: any, s: any) => {
        setPage(p - 1);
        setSize(s);
        searchByParam(paramSearch!, p - 1, s)
    };

    const columns: any[] = defineColumns(action, onChangeIsDefault);
    return (
        <div>
            {/* <Card className="fadeInRight" > */}
            <Row>
                <Space className="button-group" style={{ textAlign: 'end' }}>
                    {isShowSelectAll && <Button className='custom-btn2 btn-outline-success' icon={<CheckSquareOutlined />} onClick={SelectedAll}>Chọn tất cả</Button>}
                    {!isShowSelectAll && <Button className='custom-btn2 btn-outline-danger' icon={<BorderOutlined />} onClick={cancelSelectedAll}>Hủy chọn</Button>}
                </Space>
            </Row>
            <Table
                size="small"
                rowKey={'contactId'}
                rowSelection={rowSelection}
                pagination={{
                    total: totalRecord,
                    defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'],
                    onChange: onChangePage,
                }}
                dataSource={dataSource}
                columns={columns}
                bordered
            />

            {/* </Card> */}
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
}

export default GridForm;