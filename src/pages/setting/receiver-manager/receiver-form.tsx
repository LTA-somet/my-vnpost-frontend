import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, notification, Row, Space, Spin, Table } from 'antd';
import { CheckSquareOutlined, BorderOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import defineColumns from './columns';
import type { ContactDto } from '@/services/client';
import { useModel } from 'umi';
import EditFormReceiver from './edit';
import { useCurrentUser } from '@/core/selectors';

const ReceiverForm = () => {
    const { setPage, setSize, totalRecord, dataSource, paramSearch, isSaving, searchByParam, createRecord, updateRecord, updateBlackList, rowSelection, SelectedAll, cancelSelectedAll, isShowSelectAll, deleteRecord } = useModel('contactList')
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [isView, setIsView] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<ContactDto>();
    const isSender: boolean = true;
    const currentUser = useCurrentUser();

    // useEffect(() => {
    //     reload(!isSender);
    // }, []);

    useEffect(() => {
        setPage(0);
        setSize(10);
        searchByParam({ isSender: false, isBlacklist: false }, 0, 10)
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
            updateRecord(recordEdit.contactId!, !isSender, values, () => toggleShowEdit());
        } else {
            createRecord(values, !isSender, () => toggleShowEdit());
        }
    }

    const onChangePage = (p: any, s: any) => {
        setPage(p - 1);
        setSize(s);
        searchByParam(paramSearch!, p - 1, s)
    };

    const action = (contactId: number, record: ContactDto): React.ReactNode => {
        return <Space key={contactId}>
            <Button title='Sửa' className="btn-outline-info" size="small" onClick={() => handleEdit(record)}><EditOutlined /></Button>
            <Button title='Xóa' className="btn-outline-danger" onClick={() => deleteRecord(contactId)} size="small"><DeleteOutlined /></Button>
        </Space>
    }

    /**
      * Checkbox
      */

    /**
      * Checkbox isSender - Column mặc định
      */

    const onChangeIsBlackList = (record: ContactDto, checked: boolean) => {
        if (currentUser.uid === record.owner) {
            updateBlackList(record.phone!, !isSender, checked)
        }
        else {
            notification.error({ message: 'Không thể sửa dữ liệu do người khác tạo' })
        }
    }

    const columns: any[] = defineColumns(action, onChangeIsBlackList);
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
}

export default ReceiverForm;