import { validateMessages } from "@/core/contains";
import { dataToSelectBox } from "@/utils";
import { SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { Button, Card, Col, Form, Row, Select, Space, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import defineColumns from './columns';

class ProvinceDto {
    id?: number;
    name?: string
}

class RegionLimitDto {
    id?: string;
    districtName?: string;
    communeName?: string;
    quarantineNote?: string;
    typeName?: string;
    services?: string;
    commoditiesReject?: string;
    servicesAcceptance?: string;
}

function RegionLimit() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState<RegionLimitDto[]>([]);
    const [provinceDto, setProvinceDto] = useState<ProvinceDto[]>([]);
    const [totalRecord, setTotalRecord] = useState<number>();
    const [pageSize, setPageSize] = useState<number>(10);
    const [page, setPage] = useState<number>(0);
    const [token, setToken] = useState<string>();

    useEffect(() => {
        const data = {
            userName: "myvnp",
            password: "MyVnP@2022"
        };
        (async () => {
            fetch(`https://covid.vnpost.vn/service/api/Users/Authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(resp => resp.json()
                    .then(body => {
                        setToken(body.data.token);
                    }
                    ));
        })();
    }, []);

    const getListProvinces = () => {
        (async () => {
            if (token) {
                fetch(`https://covid.vnpost.vn/service/api/PublicAdmin/GetListProvinces`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
                    .then(resp => resp.json()
                        .then(body => {
                            setProvinceDto(body.data);
                        }
                        )).catch(() => setProvinceDto([]));
            }
        })();

    }

    useEffect(() => {
        getListProvinces();
    }, [token]);

    const onSubmit = (event: any) => {
        setIsLoading(true);
        (async () => {
            if (event.id && token) {
                fetch(`https://covid.vnpost.vn/service/api/Quarantine/GetByProvince?provinceId=${event.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
                    .then(resp => resp.json()
                        .then(body => {
                            setTotalRecord(resp.headers['x-total-count']);
                            setDataSource(body.data);
                        }
                        )).finally(() => setIsLoading(false));
            } else {
                setIsLoading(false);
                setDataSource([]);
            }
        })();
    }

    const onChangePage = (p: any, s: any) => {
        setPage(p - 1);
        setPageSize(s);
    };

    const filterOption = (value: any, option: any): boolean => {
        return option?.children?.includes(value) || option?.children?.toLowerCase().includes(value.toLowerCase())
    }

    const locale = {
        emptyText: 'Không tồn tại dữ liệu vùng bị hạn chế',
    };

    const columns: any[] = defineColumns();
    return (
        <PageContainer>
            <Spin spinning={isLoading}>
                <Card className="fadeInRight" size="small" bordered={false}>
                    <Row>
                        <Col span={12}>
                            <Form name="form-region-limit"
                                form={form}
                                labelCol={{ flex: '130px' }}
                                labelAlign='left'
                                labelWrap
                                onFinish={onSubmit}
                                validateMessages={validateMessages}
                            >
                                <Form.Item name='id' label="Tỉnh/Thành phố">
                                    <Select style={{ width: '100%' }} allowClear showSearch placeholder={'Tỉnh/thành phố'} filterOption={filterOption}
                                    >
                                        {/* {dataToSelectBox(provinceDto, 'id', ['id', 'name'])} */}
                                        {dataToSelectBox(provinceDto, 'id', 'name')}
                                    </Select>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>

                    <Row>
                        <Col flex="auto" style={{ textAlign: 'center' }}>
                            <Space>
                                <Button className="height-btn2 btn-outline-info" icon={<SearchOutlined />} form="form-region-limit" loading={isLoading} htmlType="submit">Tra cứu</Button>
                                {/* <Button className='height-btn2 btn-outline-danger' icon={<ReloadOutlined />} onClick={() => onReset()} > Làm mới </Button> */}
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
                        locale={locale}
                    />
                </Card>
            </Spin>
        </PageContainer>
    );
}
export default RegionLimit