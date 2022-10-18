import type { any, ProductEntity } from '@/services/client';
import { formatCurrency, removeAccents } from '@/utils';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox } from 'antd';
import { ProductTypeOption } from './content-table';




export default (
    action: (id: any, record: any) => React.ReactNode,
    handleAdd: () => void,
) => [

        {

            dataIndex: 'itemPackageId',
            align: 'center',
            width: '60px',
            key: 'itemPackageId',
            title: <Button size='small' className='btn-outline-info' onClick={handleAdd} icon={<PlusCircleOutlined />} />,
            render: (itemPackageId: any, record: any) => action(itemPackageId, record)
        },
        {
            title: 'Mã kiện hàng',
            dataIndex: 'packageNo',
            key: 'packageNo',
            width: 200,
            editable: true,
            dataType: 'string',
            render: (cell: string) => removeAccents(cell)
        },
        {
            title: 'Khối lượng thực (gr)',
            dataIndex: 'weightActual',
            key: 'weightActual',
            width: 100,
            editable: true,
            dataType: 'number',
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Dài (cm)',
            dataIndex: 'length',
            key: 'length',
            width: 100,
            editable: true,
            dataType: 'number',
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Rộng (cm)',
            dataIndex: 'width',
            key: 'width',
            width: 100,
            editable: true,
            dataType: 'number',
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Cao (cm)',
            dataIndex: 'height',
            key: 'height',
            width: 100,
            editable: true,
            dataType: 'number',
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Sử dụng pallet?',
            dataIndex: 'isPallet',
            key: 'isPallet',
            width: 100,
            editable: true,
            dataType: 'checkbox',
            align: 'center',
            alwaysShowEdit: true,
            render: (cell: boolean) => cell
        },
    ];
