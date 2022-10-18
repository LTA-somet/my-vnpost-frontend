import type { AccountReplaceDto } from '@/services/client';

export default (action: (id: any, record: AccountReplaceDto) => React.ReactNode) => {
    const columns: any[] = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            width: '60px',
            render: (text: any, record: any[], index: any) => index + 1,
        },
        {
            title: 'Mã CMS',
            dataIndex: 'cmsCode',
            key: 'cmsCode',
        },
        {
            title: 'Số hợp đồng',
            dataIndex: 'contractNumber',
            key: 'contractNumber',
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            align: 'center',
            width: '80px',
            key: 'contactId',
            render: (id: any, record: AccountReplaceDto) => action(id, record),

        },
    ]
    return columns;
}

export const Columns = [
    // { label: '', width: 160, fieldName: 'type', dataType: 'text', valueViewer: checkboxViewer, editorTag: checkboxViewer },
    // { label: '', width: 20, fieldName: 'type', dataType: 'text' },
    { label: 'Tên hàng hóa', width: 160, fieldName: 'nameVi', dataType: 'text' },
    // { label: 'Mã', width: 160, fieldName: 'productId', dataType: 'number' },
    {
        label: 'Khối lượng (gram)',
        width: 160,
        fieldName: 'weight',
        dataType: 'number',
        displayField: false,
    },
    { label: 'Giá trị(VND)', width: 160, fieldName: 'priceVnd', dataType: 'number' },
    { label: 'Dài (cm)', width: 160, fieldName: 'length', dataType: 'number' },
    { label: 'Rộng (cm)', width: 160, fieldName: 'width', dataType: 'number' },
    { label: 'Cao (cm)', width: 160, fieldName: 'height', dataType: 'number' },
];


