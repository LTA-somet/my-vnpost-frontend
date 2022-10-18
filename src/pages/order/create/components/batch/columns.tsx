import { regexCode } from '@/core/contains';
import { OrderBatchDto } from '@/pages/order/dtos/OrderBatchDto';
import type { OrderContentDto, OrderHdrDto, OrderImageDto, VaDto } from '@/services/client';
import { formatCurrency } from '@/utils';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export default (
    action: (id: string, row: OrderBatchDto) => React.ReactNode,
    vas: VaDto[] = [],
    handleAdd: () => void,
    renderImage: (id: string, image?: OrderImageDto[]) => void,
    contentAction: (orderContents: OrderContentDto[], row: OrderBatchDto) => React.ReactNode,
    allowUseCod: boolean,
    isServiceDocument: boolean,
    isHasPhatMotPhan: boolean
) => [
        {
            dataIndex: 'orderHdrId',
            align: 'center',
            width: '30px',
            key: 'orderHdrId',
            title: <Button size='small' className='btn-outline-info' onClick={handleAdd} icon={<PlusCircleOutlined />} />,
            render: (orderHdrId: any, record: OrderHdrDto) => action(orderHdrId, record)
        },
        {
            title: 'STT',
            dataIndex: 'acceptanceIndex',
            key: 'acceptanceIndex',
            width: 50,
            align: 'center',
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'saleOrderCode',
            key: 'saleOrderCode',
            editable: true,
            width: 100,
            pattern: regexCode,
            max: 50
        },
        {
            title: `Nội dung ${(isServiceDocument || !isHasPhatMotPhan) ? ' *' : ''}`,
            dataIndex: 'contentNote',
            key: 'contentNote',
            editable: true,
            width: 200,
            dataType: 'text'
        },
        {
            title: 'Khối lượng *',
            dataIndex: 'weight',
            key: 'weight',
            editable: true,
            width: 100,
            dataType: 'number',
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Dài',
            dataIndex: 'length',
            key: 'length',
            editable: true,
            width: 100,
            dataType: 'number',
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Rộng',
            dataIndex: 'width',
            key: 'width',
            editable: true,
            width: 100,
            dataType: 'number',
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Cao',
            dataIndex: 'height',
            key: 'height',
            editable: true,
            width: 100,
            dataType: 'number',
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Khối lượng TC',
            dataIndex: 'priceWeight',
            key: 'priceWeight',
            width: 100,
            dataType: 'number',
            render: (cell: number) => formatCurrency(cell)
        },
        {
            title: 'Tiền thu hộ COD',
            dataIndex: 'cod',
            key: 'cod',
            editable: !vas.some(v => v.vaCode === 'GTG021') && allowUseCod,
            width: 100,
            dataType: 'number',
            render: (cell: number, row: OrderBatchDto) => {
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
                    const cod = getCod(vas);
                    return cod ? formatCurrency(+cod) : '';
                } else {
                    // return getCod(row?.vas ?? []);
                    return formatCurrency(cell)
                }
            }
        },
        {
            title: 'Hàng dễ vỡ',
            dataIndex: 'isBroken',
            key: 'isBroken',
            editable: true,
            width: 100,
            align: 'center',
            dataType: 'checkbox',
            alwaysShowEdit: true,
            render: (cell: boolean) => cell && 'Có'
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'orderImages',
            key: 'orderImages',
            width: 100,
            dataType: 'orderImages',
            align: 'center',
            render: (cell: string, row: OrderHdrDto) => renderImage(row.orderHdrId!, row?.orderImages)
        },
        {
            title: `Chi tiết hàng hóa ${isHasPhatMotPhan ? ' *' : ''}`,
            dataIndex: 'orderContents',
            align: 'center',
            width: '100px',
            key: 'orderContents',
            render: (orderContents: OrderContentDto[], record: OrderHdrDto) => contentAction(orderContents, record)
        },
    ];
