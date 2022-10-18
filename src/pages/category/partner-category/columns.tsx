import type { PartnerCategoryDto } from '@/services/client';
import { Tag } from 'antd';

export default (action: (id: any, record: PartnerCategoryDto) => React.ReactNode) => [
    {
        title: 'STT',
        key: 'index',
        align: 'center',
        width: '60px',
        render: (text: any, record: any[], index: any) => index + 1,
    },
    {
        title: 'Tên đối tác',
        dataIndex: 'partnerName',
        key: 'partnerName',
    },
    {
        title: 'Đường dẫn Webhook',
        dataIndex: 'partnerUrl',
        key: 'partnerUrl',
    },
    {
        title: 'Mã Token',
        dataIndex: 'token',
        key: 'token',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'deActive',
        key: 'deActive',
        align: 'center',
        render: (partnerId: any, record: PartnerCategoryDto) => {
            if (record.deActive === false) {
                return (<Tag style={{ width: 110, textAlign: 'center' }} color={'green'}>
                    {'Đang hoạt động'}
                </Tag>);
            }
            if (record.deActive === true) {
                return (<Tag color={'red'}>
                    {'Ngừng hoạt động'}
                </Tag>);
            }
        },
    },
    {
        title: 'Tác vụ',
        dataIndex: 'partnerId',
        align: 'center',
        width: '100px',
        key: 'partnerId',
        render: (partnerId: any, record: PartnerCategoryDto) => action(partnerId, record),
    },
];
