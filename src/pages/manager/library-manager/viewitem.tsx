
import { ExportOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'umi';


const ViewLibraryInfItem: React.FC<Props> = (props: Props) => {

    // const titleModel = () => {
    //     if (props.keyMenu === 1) {
    //         setName("Tin tức");
    //     } else if (props.keyMenu === 2) {
    //         setName("Quy định chính sách");
    //     } else if (props.keyMenu === 3) {
    //         setName("Câu hỏi thường gặp")
    //     } else if (props.keyMenu === 4) {
    //         setName("Hướng dẫn sử dụng")
    //     } else if (props.keyMenu === 5) {
    //         setName("Ưu đãi")
    //     }
    // }
    const [descrition, setDescription] = useState<string>();
    const location: any = useLocation();

    //const libraryInfoId = location?.query?.idkey;

    useEffect(() => {
        //titleModel();
        //console.log('1-libraryInfoId: ', libraryInfoId, ' state ', location.state?.des);
        //if (libraryInfoId > 0) {
        // libraryInfoApi.getLibraryInfoId(libraryInfoId).then(resp => {
        //     console.log('libraryInfoId: ', resp);
        //     if (resp.status === 200) {
        //         setDescription(resp.data.descriptions);
        //     }
        // }).catch((err) => {
        //     notification.error({ message: "Lỗi trong khi lấy thông tin tin tức! " + err });
        // })
        setDescription(location.state.descriptions);
        //}
        //console.log(' descriptions ', location.state.descriptions);
    }, [location.state.descriptions])

    return (
        <Card title="Thông báo" >
            <div dangerouslySetInnerHTML={{ __html: descrition || '' }} />

        </Card>
    )
}

type Props = {
    descriptions: string
}
export default ViewLibraryInfItem;