import ViewLibraryInfo from '@/pages/manager/library-manager/view';
import type { LibraryInfoDto, LibrarySearchDto } from '@/services/client';
import { LibraryInfoApi } from '@/services/client';
import { b64toBlob } from '@/utils';
import { EyeOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Col, Input, Card, Pagination, Row, Select } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useLocation, useModel, useParams } from 'umi';
import styles from './index.less';

const libraryInfoApi = new LibraryInfoApi();
const { Option } = Select;

export default () => {
    const { dataSource, isSaving, setDataSource, reload, dataTable, setDataTable } = useModel('libraryssList');
    //const [dataSourceLi, setDataSourceLi] = useState<LibraryInfoDto[]>([]);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    //const [searchValue, setSearchValue] = useState<string>();
    const [recordEdit, setRecordEdit] = useState<LibraryInfoDto>();
    const [isView] = useState<boolean>(false);
    const [viewType, setViewType] = useState<'PBN' | 'XNN' | 'MN'>('PBN');
    const [titleFilter, setTitleFilter] = useState<string>();
    const [lengthData, setLengthData] = useState<number>(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(10);
    const [dataTableFilter, setDataTableFilter] = useState<LibraryInfoDto[]>([]);

    const location = useLocation();

    const libraryTypeId: number = +location.pathname.replace('/questions/news/', '');
    // console.log('libraryTypeId ', libraryTypeId);

    useEffect(() => {
        reload()
    }, []);

    useEffect(() => {
        //const tempList = dataSource.filter(c => c.libraryTypeId === 1) // filter library type Tin Tức

        let dataFilter = dataSource.filter(c => c.libraryTypeId === libraryTypeId && c.status === "1") || [];
        if (titleFilter) {
            dataFilter = dataFilter.filter(d => d.title?.toLocaleUpperCase().includes(titleFilter.toLocaleUpperCase()));
        }
        if (viewType === 'PBN') {
            dataFilter.sort((a, b) => +a.rank! > +b.rank! ? 1 : -1);
        }
        if (viewType === 'XNN') {
            dataFilter.sort((a, b) => b.countView! > a.countView! ? 1 : -1);
        }
        if (viewType === 'MN') {
            dataFilter.sort((a, b) => moment(a.createdDate!, 'DD/MM/YYYY HH:mm:ss').isBefore(moment(b.createdDate!, 'DD/MM/YYYY HH:mm:ss')) ? 1 : -1);
        }
        setLengthData(dataFilter.length);

        dataFilter = dataFilter.filter((e, index) => {
            return index >= (currentPage - 1) * currentPageSize && index < currentPage * currentPageSize
        })


        setDataTableFilter(dataFilter);
    }, [dataSource, viewType, titleFilter, currentPage, currentPageSize,])

    const setDefaultFilter = () => {
        setCurrentPage(1);
        setCurrentPageSize(5);
        setViewType('PBN');
        setTitleFilter('');
    }

    const loadPaging = (page: any, pageSize: any) => {
        const dataFilter = dataSource.filter((e, index) => {
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

    //const blob = b64toBlob(data, 'application/pdf');
    //const blobURL = URL.createObjectURL(blob);
    const showFile = (base64: string, contentType: string = 'application/pdf') => {
        const blob = b64toBlob(base64, contentType);
        const blobURL = window.URL.createObjectURL(blob);
        const theWindow = window.open(blobURL);
        const theDoc = theWindow!.document;
        const theScript = document.createElement("script");
        // function injectThis() {
        //     window.print();
        // }
        //theScript.innerHTML = `window.onload = ${injectThis.toString()};`;
        theDoc.body.appendChild(theScript);
    }

    // const showDescription = (descriptions: string) => {
    //     const theWindow = window.open(descriptions);
    //     const theDoc = theWindow!.document;
    //     const theScript = document.createElement("script");
    //     theDoc.body.appendChild(theScript);
    // }


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
            // showDescription(element.descriptions);
        }
    }
    return (
        <PageContainer>
            <Card className="fadeInRight" size="small" bordered={false}>
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
                {
                    dataTableFilter.map((element: LibraryInfoDto) => (
                        <div key={element.libraryInfoId}>
                            <table id='table-design' onClick={() => viewDetail(element)} >
                                {/* className={styles.tr} */}
                                <tr style={{ border: "2px" }}>
                                    <th style={{ textAlign: "left" }}>{element.title}</th>
                                    <td rowSpan={2} style={{ textAlign: "center" }}>{element.createdDate} | <span><EyeOutlined title='Xem thông tin chi tiết' style={{ marginTop: '5px' }} /> {element.countView}</span></td>
                                </tr>
                                <tr>
                                    <td style={{ width: '80%' }}>{element.focusNews}</td>
                                    {/* <td><EyeOutlined />{element.countView}</td> */}
                                </tr>
                            </table>
                            <br />
                        </div>
                    ))
                }
                <Col style={{ textAlign: 'end' }}>
                    <Pagination
                        current={currentPage}
                        onChange={onChangePage}
                        total={lengthData}
                        showSizeChanger
                        pageSizeOptions={['10', '20', '50', '100']}
                        defaultPageSize={10}
                        defaultCurrent={1}
                    />
                </Col>
                <ViewLibraryInfo
                    visible={showEdit}
                    setVisible={setShowEdit}
                    record={recordEdit}
                    isSaving={isSaving}
                    isView={isView}
                    keyMenu={libraryTypeId}
                />
            </Card>
        </PageContainer>
    )
}