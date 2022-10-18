import { removeAccents } from '@/utils';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';




export default (
    disable: boolean,
    action: (id: any, record: any) => React.ReactNode,
    handleAdd: () => void,
) => [

        {

            dataIndex: 'itemDocId',
            align: 'center',
            width: '60px',
            key: 'itemDocId',
            title: <Button size='small' className='btn-outline-info' onClick={handleAdd} icon={<PlusCircleOutlined />} disabled={disable} />,
            render: (itemContentId: any, record: any) => action(itemContentId, record)
        },
        {
            title: 'Loại giấy tờ',
            dataIndex: 'docType',
            key: 'docType',
            width: 200,
            editable: !disable,
            dataType: 'string',
            render: (cell: string) => removeAccents(cell)
        },
        {
            title: 'Số giấy tờ',
            dataIndex: 'docNumber',
            key: 'docNumber',
            width: 200,
            editable: !disable,
            dataType: 'string',
            render: (cell: string) => removeAccents(cell)
        },
    ];
