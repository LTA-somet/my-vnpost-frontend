import { validateMessages } from "@/core/contains";
import { DmHsCodeApi, DmHsCodeDto, DmHsCodeSearchDto } from "@/services/client";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { Button, Card, Col, Form, Input, Row, Space, Spin, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import defineColumns from './columns';

const dmHsCodeApi = new DmHsCodeApi();
function HsCode() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState<DmHsCodeDto[]>([]);
    const [totalRecord, setTotalRecord] = useState<number>();
    const [pageSize, setPageSize] = useState<number>(10);
    const [page, setPage] = useState<number>(0);
    const [searchValue, setSearchValue] = useState<string>("");

    const reload = useCallback((param, p, s, callback?: (success: boolean) => void) => {
        setIsLoading(true);
        dmHsCodeApi
            .findByParameterPagination(param, p, s)
            .then((resp: any) => {
                if (resp.status === 200) {
                    setTotalRecord(resp.headers['x-total-count']);
                    setDataSource(resp.data);
                }
                if (callback) {
                    callback(resp.status === 200);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        reload(searchValue, page, pageSize);
    }, []);

    const onReset = () => {
        form.resetFields();
        setPage(0);
        reload("", 0, pageSize);
    }

    const onChangePage = (p: any, s: any) => {
        setPage(p - 1);
        setPageSize(s);
        reload(searchValue, p - 1, s);
    };

    const onBlurSearchValue = (e: any) => {
        setSearchValue(e.target.value);
    }

    /**APi handle Search by parameter**/
    const onSearch = (values: DmHsCodeSearchDto) => {
        reload(values.searchValue, page, pageSize);
    }

    const columns: any[] = defineColumns();
    return (
        <PageContainer>
            <Spin spinning={isLoading}>
                <Card className="fadeInRight" size="small" bordered={false}>
                    <Row>
                        <Col span={12}>
                            <Form name="form-hs-code"
                                form={form}
                                labelCol={{ flex: '130px' }}
                                labelAlign='left'
                                labelWrap
                                onFinish={onSearch}
                                validateMessages={validateMessages}
                            >
                                <Form.Item
                                    name='searchValue'
                                    label='Tên mặt hàng'
                                    rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                                >
                                    <Input
                                        onBlur={onBlurSearchValue}
                                        placeholder="Nhập từ khóa để tìm kiếm chủ đề"
                                        title='nhập từ khóa để tìm kiếm chủ đề'
                                        allowClear />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col flex="auto" style={{ textAlign: 'center' }}>
                            <Space>
                                <Button className="height-btn2 btn-outline-info" icon={<SearchOutlined />} form="form-hs-code" loading={isLoading} htmlType="submit">Tra cứu</Button>
                                <Button className='height-btn2 btn-outline-danger' icon={<ReloadOutlined />} onClick={() => onReset()} > Làm mới </Button>
                            </Space>
                        </Col>
                    </Row>
                    <br />
                    <Table
                        size="small"
                        dataSource={dataSource}
                        columns={columns}
                        bordered
                        pagination={{
                            total: totalRecord,
                            current: page + 1,
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            onChange: onChangePage,
                        }}
                    />
                </Card>
            </Spin>
        </PageContainer>
    );
}
export default HsCode