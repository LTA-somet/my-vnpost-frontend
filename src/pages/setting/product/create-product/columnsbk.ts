import type { ProductEntity } from '@/services/client';

export default (action: (id: any, record: ProductEntity) => React.ReactNode) => [

    {
        title: 'Tác vụ',
        dataIndex: 'uomId',
        align: 'center',
        width: '80px',
        key: 'uomId',
        render: (productId: any, record: ProductEntity) => action(productId, record),
    },
    {
        title: 'Tên hàng hóa',
        dataIndex: 'nameVi',
        key: 'nameVi',
    },
    {
        title: 'Mã',
        dataIndex: 'productId',
        key: 'productId',
    },
    {
        title: 'Khối lượng (gram)',
        dataIndex: 'weight',
        key: 'weight',
    },
    {
        title: 'Giá trị',
        dataIndex: 'priceVnd',
        key: 'priceVnd',
    },
    {
        title: 'Dài',
        dataIndex: 'length',
        key: 'length',
    },
    {
        title: 'Rộng',
        dataIndex: 'width',
        key: 'width',
    },
    
    {
        title: 'Cao',
        dataIndex: 'height',
        key: 'height',
    },
    
    // {
    //     title: 'Image',
    //     dataIndex: 'image',
    //     key: 'image',
    // },
    
    
];
