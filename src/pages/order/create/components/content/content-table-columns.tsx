import type { ItemContentDto, ProductEntity } from '@/services/client';
import { formatCurrency } from '@/utils';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ProductTypeOption } from './content-table';




export default (
    disable: boolean,
    action: (id: any, record: ItemContentDto) => React.ReactNode,
    handleAdd: () => void,
    renderImage: (id: number, image?: string) => void,
    productList: ProductTypeOption[]
) => [

        {

            dataIndex: 'itemContentId',
            align: 'center',
            width: '60px',
            key: 'itemContentId',
            title: <Button size='small' className='btn-outline-info' onClick={handleAdd} icon={<PlusCircleOutlined />} disabled={disable} />,
            render: (itemContentId: any, record: ItemContentDto) => action(itemContentId, record)
        },
        {
            title: 'Tên hàng hoá',
            dataIndex: 'nameVi',
            key: 'nameVi',
            width: 200,
            editable: !disable,
            dataType: 'autocomplete',
            options: productList
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
            editable: !disable,
            dataType: 'number',
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Khối lượng',
            dataIndex: 'weight',
            key: 'weight',
            width: 100,
            editable: !disable,
            dataType: 'number',
            render: (cell: number) => formatCurrency(cell)
        },
        {
            disabled: disable,
            title: 'Hình ảnh',
            // dataIndex: 'image',
            key: 'image',
            width: 100,
            dataType: 'image',
            align: 'center',
            render: (cell: string, row: ItemContentDto) => renderImage(row.itemContentId!, row?.image)
        },
    ];
