import type { LibraryInfoDto, LibrarySearchDto } from '@/services/client';
import { LibraryInfoApi } from '@/services/client';
import { updateToDataSource } from '@/utils/dataUtil';
import { EyeOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Modal, Pagination, Row, Select, Table } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ViewLibraryInfo from './view';
import './style.css';
import { b64toBlob } from '@/utils';
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

const libraryInfoApi = new LibraryInfoApi();
const { Option } = Select;
const EditFormLibraryInfo: React.FC<Props> = (props: Props) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    //const { dataSource } = useModel('libraryssList');
    const { dataSource, isSaving, setDataSource, reload, dataTable, setDataTable } = useModel('libraryssList');
    //const [dataSourceLi, setDataSourceLi] = useState<LibraryInfoDto[]>([]);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    //const [searchValue, setSearchValue] = useState<string>();
    const [recordEdit, setRecordEdit] = useState<LibraryInfoDto>();
    const [isView] = useState<boolean>(false);
    const [viewType, setViewType] = useState<'PBN' | 'XNN' | 'MN'>('PBN');
    const [titleFilter, setTitleFilter] = useState<string>();
    const [lengthData, setLengthData] = useState<number>(0);


    //phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(5);
    const [dataTableFilter, setDataTableFilter] = useState<LibraryInfoDto[]>([]);
    const [tempDataSource, setTempDataSource] = useState<LibraryInfoDto[]>(dataSource);

    //const tempDataSource: LibraryInfoDto[] = [...dataSource];

    useEffect(() => {
        //const tempList = dataSource.filter(c => c.libraryTypeId === 1) // filter library type Tin Tức
        let dataFilter = props.record || [];
        if (titleFilter) {
            dataFilter = dataFilter.filter(d => d.title?.toLocaleUpperCase().includes(titleFilter.toLocaleUpperCase()));
        }
        if (viewType === 'PBN') {
            dataFilter.sort((a, b) => +a.rank! > +b.rank! ? 1 : -1);
        }
        if (viewType === 'XNN') {
            dataFilter.sort((a, b) => a.countView! > b.countView! ? 1 : -1);
        }
        if (viewType === 'MN') {
            dataFilter.sort((a, b) => moment(a.updatedDate!).isBefore(moment(b.updatedDate!)) ? 1 : -1);
        }
        setLengthData(dataFilter.length);

        dataFilter = dataFilter.filter((e, index) => {
            return index >= (currentPage - 1) * currentPageSize && index < currentPage * currentPageSize
        })


        setDataTableFilter(dataFilter);
    }, [props.record, viewType, titleFilter, currentPage, currentPageSize,])

    const setDefaultFilter = () => {
        setCurrentPage(1);
        setCurrentPageSize(5);
        setViewType('PBN');
        setTitleFilter('');
    }

    const loadPaging = (page: any, pageSize: any) => {
        const dataFilter = props.record!.filter((e, index) => {
            return index >= (page - 1) * pageSize && index < page * pageSize
        })

        setDataTableFilter(dataFilter);
    }
    const onChangePage = (page: any, pageSize: any) => {
        console.log(page, pageSize);

        setCurrentPage(page);
        setCurrentPageSize(pageSize)
        // loadPaging(page, pageSize);
    }

    const showFile = (base64: string, contentType: string = 'application/pdf') => {
        const blob = b64toBlob(base64, contentType);
        const blobURL = window.URL.createObjectURL(blob);
        const theWindow = window.open(blobURL);
        const theDoc = theWindow!.document;
        const theScript = document.createElement("script");

        theDoc.body.appendChild(theScript);

    }


    const onEdit = () => {

    }

    const toggleShowEdit = (element: LibraryInfoDto) => {
        setShowEdit(!showEdit);
    }

    const viewDetail = (element: LibraryInfoDto) => {
        element.countView = element.countView! + 1;
        libraryInfoApi.createCountviewLibrary(element.libraryInfoId!);
        if (element.dataPdf) {
            showFile(element.dataPdf);
        } else {
            setRecordEdit(element);
            toggleShowEdit(element);
        }



    }


    return (
        <div>
            <Modal
                title={<div style={{ fontSize: '16px', color: '#00549a' }}>{props.record ? 'Tra cứu' : 'Tìm Kiếm'}</div>}
                visible={props.visible}
                onCancel={() => { setDefaultFilter(); props.setVisible(false) }}
                width={1000}
                footer={false}
                destroyOnClose>
                <Row gutter={[20, 20]} style={{ marginBottom: '25px' }}>
                    <Col span={12}>
                        <Input maxLength={3000} allowClear placeholder="Nhập chủ đề" name='title' value={titleFilter}
                            onChange={e => setTitleFilter(e.target.value)} />
                    </Col>
                    <Col span={12}>
                        <Select style={{ width: "100%" }}
                            value={viewType}
                            allowClear
                            placeholder="Phổ biến nhất"
                            onChange={setViewType}
                        >
                            <Option value="PBN">Phổ biến nhất</Option>
                            <Option value="XNN">Xem nhiều nhất</Option>
                            <Option value="MN">Mới nhất</Option>
                        </Select>
                    </Col>
                </Row>
                <br />
                {
                    dataTableFilter.map((element: LibraryInfoDto) => (
                        <div key={element.libraryInfoId}>
                            <table id='table-library-manager' style={{ marginBottom: '1rem' }} onClick={() => viewDetail(element)}>
                                <tr>
                                    <td style={{ width: '80%', fontWeight: 'bold', fontSize: '12px' }}>{element.title}</td>
                                    <td style={{ fontSize: '12px' }}>{element.createdDate}</td>
                                </tr>
                                <tr>
                                    <td style={{ width: '80%' }}>{element.focusNews}</td>
                                    <td style={{ fontSize: '12px' }}><EyeOutlined /> {element.countView}</td>
                                </tr>
                            </table>
                        </div>
                    ))
                }


                <Col style={{ textAlign: 'end' }}>
                    <Pagination
                        current={currentPage}
                        onChange={onChangePage}
                        total={lengthData}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '50', '100']}
                        defaultPageSize={5}
                        defaultCurrent={1}
                    />
                </Col>
            </Modal>
            <ViewLibraryInfo
                visible={showEdit}
                setVisible={setShowEdit}
                onEdit={onEdit}
                record={recordEdit}
                isSaving={isSaving}
                isView={isView}
            />
        </div >
    );
}
type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    onEdit: (record: LibraryInfoDto) => void,
    record?: LibraryInfoDto[],
    isSaving: boolean,
    isView: boolean,
    libraryType: number,

}
export default EditFormLibraryInfo;