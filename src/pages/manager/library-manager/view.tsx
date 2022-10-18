
import type { LibraryInfoDto } from '@/services/client';
import { Button, Modal, Space } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const ViewLibraryInfo: React.FC<Props> = (props: Props) => {
    const [name, setName] = useState('');

    const titleModel = () => {
        if (props.keyMenu === 1) {
            setName("Tin tức");
        } else if (props.keyMenu === 2) {
            setName("Quy định chính sách");
        } else if (props.keyMenu === 3) {
            setName("Câu hỏi thường gặp")
        } else if (props.keyMenu === 4) {
            setName("Hướng dẫn sử dụng")
        } else if (props.keyMenu === 5) {
            setName("Ưu đãi")
        }
    }

    useEffect(() => {
        titleModel();
    }, [props.keyMenu])

    // console.log("props.record?.descriptions", props.record?.descriptions);

    return (
        <div>
            <Modal
                title={<div style={{ fontSize: '16px', color: '#00549a' }}>{props.record ? `${name}` : 'Tìm Kiếm'}</div>}
                visible={props.visible}
                onCancel={() => props.setVisible(false)}
                width={1000}
                footer={
                    <Space>
                        <Button className='custom-btn1 btn-outline-secondary' icon={<ExportOutlined />} onClick={() => props.setVisible(false)}>Đóng</Button>
                    </Space>
                }
                destroyOnClose>

                <div dangerouslySetInnerHTML={{ __html: props.record?.descriptions || '' }} />

            </Modal>
        </div>
    )
}

type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    record?: LibraryInfoDto,
    // onEdit: (record: LibraryInfoDto) => void,
    isSaving: boolean,
    isView: boolean,
    keyMenu: number
}
export default ViewLibraryInfo;