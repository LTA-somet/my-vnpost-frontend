
import Google from './image/google-maps.png';
import Vpost from './image/Vpostcode.png';
import './styles.css';

export const Columns = [
    {
        title: "STT",

        render: (item, record, index) => (
            <>
                {index + 1}
            </>
        )

    },
    { title: "Ngày", dataIndex: "createdDate", key: "createdDate" },
    { title: "Giờ", dataIndex: "createdHour", key: "createdHour" },
    { title: "Trạng thái bưu gửi", dataIndex: "statusName", key: "statusName" },
    {
        title: "Tại bưu cục", dataIndex: "unitName", key: "unitName",
        render: (item: any, record: any, index) => {
            const indexOff = record?.unitName.indexOf("<p/>");
            const a = record?.unitName.substring(0, indexOff)
            const b = record?.unitName.substring(indexOff + 4, record?.unitName.length);
            return (<>
                {a}
                <br />
                {b}
            </>)
        }
    },
]


export const ColumnsDelivery = [
    {
        title: "STT",

        render: (item, record, index) => (
            <>
                {index + 1}
            </>
        ),
    },
    { title: "Ngày", dataIndex: "deliveryDate", },
    { title: "Giờ", dataIndex: "deliveryHour" },
    { title: "Ngày nhập thông tin phát", dataIndex: "createdDate" },
    { title: "Bưu cục phát", dataIndex: "poNameDelivery" },
    {
        title: "Người nhận/ Lý do", dataIndex: "receiverReason",
        render: (item: any, record: any, index) => {
            return (<>
                {record?.receiverReason}
                <a className='myChat' href={record?.hrefGoogle} target='_blank'><img style={{ width: '20px', marginRight: '10px' }} src={Google} alt="Google" /></a>
                <a className='myChat' href={record?.hrefVpostcode} target='_blank'><img style={{ width: '20px' }} src={Vpost} alt="Vpost" /></a>
            </>)
        }

    },
]