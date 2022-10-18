import { Image } from "antd";

export default [
    {
        title: 'Tên hàng hoá',
        dataIndex: 'nameVi',
        key: 'nameVi',
        width: 200,
        editable: true,
    },
    {
        title: 'Mã hàng hoá',
        dataIndex: 'hsCode',
        key: 'hsCode',
        width: 100,
        editable: true,
    },
    {
        title: 'Khối lượng',
        dataIndex: 'weight',
        key: 'weight',
        width: 100,
        editable: true,
    },
    {
        title: 'Giá trị',
        dataIndex: 'priceVnd',
        key: 'priceVnd',
        width: 100,
        editable: true,
    },
    {
        title: 'Dài',
        dataIndex: 'length',
        key: 'length',
        width: 100,
        editable: true,
    },
    {
        title: 'Rộng',
        dataIndex: 'width',
        key: 'width',
        width: 100,
    },
    {
        title: 'Cao',
        dataIndex: 'height',
        key: 'height',
        width: 100,
    },
    {
        title: 'Hình ảnh',
        dataIndex: 'image',
        key: 'image',
        width: 100,
        align: 'center',
        render: (cell: string) => cell && <Image
            height={60}
            src={cell}
        />
    },
];
