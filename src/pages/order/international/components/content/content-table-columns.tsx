import type { ItemContentDto, ProductEntity } from '@/services/client';
import { formatCurrency, removeAccents } from '@/utils';
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
            title: 'Tên hàng hoá (tiếng Anh)',
            dataIndex: 'nameEn',
            key: 'nameEn',
            width: 200,
            editable: !disable,
            dataType: 'autocomplete',
            options: productList,
            render: (cell: string) => removeAccents(cell)
        },
        {
            title: 'Tên hàng hoá (tiếng Việt)',
            dataIndex: 'nameVi',
            key: 'nameVi',
            width: 200,
            editable: !disable,
            dataType: 'autocomplete',
            options: productList,
            render: (cell: string) => removeAccents(cell)
        },
        {
            title: 'HSCODE',
            dataIndex: 'hscode',
            key: 'hscode',
            width: 100,
            editable: !disable,
            dataType: 'string',
            render: (cell: string) => removeAccents(cell)
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
            title: 'Khối lượng tịnh (gr)',
            dataIndex: 'netWeight',
            key: 'netWeight',
            width: 100,
            editable: !disable,
            dataType: 'number',
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Đơn giá',
            dataIndex: 'priceVnd',
            key: 'priceVnd',
            width: 200,
            editable: !disable,
            dataType: 'number',
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Xuất xứ',
            dataIndex: 'origin',
            key: 'origin',
            width: 200,
            editable: !disable,
            dataType: 'autocomplete',
            options: productList,
            render: (cell: string) => removeAccents(cell)
        },
        {
            title: 'Khối lượng thô (gr)',
            dataIndex: 'weight',
            key: 'weight',
            width: 100,
            editable: !disable,
            dataType: 'number',
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Hình thức xuất khẩu',
            dataIndex: 'exportType',
            key: 'exportType',
            width: 200,
            editable: !disable,
            dataType: 'autocomplete',
            options: productList,
            render: (cell: string) => removeAccents(cell)
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
