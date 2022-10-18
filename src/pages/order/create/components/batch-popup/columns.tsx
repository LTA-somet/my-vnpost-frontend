import type { OrderHdrDto, VaDto } from '@/services/client';
import { formatCurrency } from '@/utils';

export default (
    action: (id: string, row: OrderHdrDto) => React.ReactNode, vas: VaDto[] = []
) => [
        {
            title: 'STT',
            dataIndex: 'acceptanceIndex',
            key: 'acceptanceIndex',
            width: 50,
            align: 'center'
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'saleOrderCode',
            key: 'saleOrderCode',
            // width: 100,
        },
        {
            title: 'Nội dung',
            dataIndex: 'contentNote',
            key: 'contentNote',
            // width: 200
        },
        {
            title: 'Khối lượng',
            dataIndex: 'weight',
            key: 'weight',
            // width: 100,
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Khối lượng TC',
            dataIndex: 'priceWeight',
            key: 'priceWeight',
            // width: 100,
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Dài',
            dataIndex: 'length',
            key: 'length',
            // width: 100,
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Rộng',
            dataIndex: 'width',
            key: 'width',
            // width: 100,
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Cao',
            dataIndex: 'height',
            key: 'height',
            // width: 100,
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Tiền thu hộ COD',
            dataIndex: 'codAmount',
            key: 'codAmount',
            // width: 100,
            render: (cell: number, row: OrderHdrDto) => {
                const getCod = (vaList: VaDto[]): string => {
                    const va = vaList?.find(v => v.vaCode === 'GTG021');
                    if (va) {
                        const prop0018 = va.addons?.find(a => a.propCode === 'PROP0018');
                        if (prop0018) {
                            return prop0018.propValue ?? '';
                        }
                    }
                    return ''
                }

                if (vas.some(v => v.vaCode === 'GTG021')) {
                    return getCod(vas);
                } else {
                    return getCod(row?.vas ?? []);
                }
            }
        },
        {
            title: 'Tác vụ',
            dataIndex: 'orderHdrId',
            key: 'orderHdrId',
            width: 100,
            align: 'center',
            render: (cell: string, row: OrderHdrDto) => action(cell, row)
        },
    ];
