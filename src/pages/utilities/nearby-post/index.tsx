import MapTest from "@/components/Address/Searchmap";
import type { PostOfficeModel } from "@/services/client";
import { ContactApi } from "@/services/client";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { AutoComplete, Button, Card, Col, Form, Row, Spin, Table } from "antd"
import { debounce } from "lodash";
import { useCallback, useState } from "react"
// import './style.css'
const columns = [
    {
        title: 'Tên bưu cục',
        dataIndex: 'postOfficeName',
        key: 'postOfficeName',
        render: (_postOfficeName: any, record: PostOfficeModel) => `Bưu cục ${record.postOfficeName} - SĐT: ${record.phone} (${(+(parseFloat(record.distanceInMeters!) / 1000).toFixed(2)).toLocaleString('vi-VN')} km)`,
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'address',
        key: 'address',
    }
];

const contactApi = new ContactApi();
const NearbyPost = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [options, setOptions] = useState<any[]>([]);
    const [postOffice, setPostOffice] = useState<PostOfficeModel[]>([]);
    const [address, setAddress] = useState<any>();

    const getAddressInfo = (feature: any) => {
        return {
            name: feature.properties.name,
            lng: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1],
            value: feature.properties.label
        }
    }
    const findNearByPostOffice = (lat: string, lng: string) => {
        setIsLoading(true)
        contactApi.findNearByPostOffice(lat, lng)
            .then(resp => {
                setPostOffice(resp.data);
                console.log(resp.data);

            }).finally(() => setIsLoading(false));
    }
    const searching = useCallback((values: string, callback?: (success: any) => void) => {
        setIsLoading(true);
        if (values) {
            contactApi
                .findVmapsAddress(values)
                .then((resp) => {
                    if (resp.status === 200 && resp.data !== null) {
                        const result = resp.data.features?.map(ad => {
                            return getAddressInfo(ad)
                        })
                        setOptions(result!);
                        if (callback) {
                            callback(result);
                        }
                    }
                }).finally(() => setIsLoading(false));
        }
    }, []);
    const openMapPopup = () => {
        setShowMap(!showMap)
    }

    const debounceSearching = useCallback(debounce((value) => searching(value), 300), [])

    const handleSearch = (values: string) => {
        if (values !== '') {
            debounceSearching(values);
        }
    };
    const handleChange = (adr: any) => {
        setAddress(adr)
    };
    const onClick = () => {
        if (address) {
            findNearByPostOffice(address.lat, address.lng)
        }
    }
    const onSelectAddress = (value: any) => {
        form.setFieldsValue({
            ['address']: value.label
        })
        findNearByPostOffice(value.lat, value.lng)
    }

    return (
        <PageContainer >
            <Spin spinning={isLoading}>
                <Card className="fadeInRight" size="small" bordered={false}>
                    <Row>
                        <Col style={{ width: 'calc(100% - 40px)' }}>
                            <Form form={form}>
                                <Form.Item
                                    name='address'
                                // label='Địa chỉ của bạn'

                                >
                                    <AutoComplete

                                        onSearch={handleSearch}
                                        onSelect={(event: any, newValue: any) => {
                                            handleChange(newValue);
                                        }}
                                        options={options}
                                        placeholder="Nhập địa chỉ VD: Bưu điện Hà Nội"
                                    > </AutoComplete>
                                </Form.Item>
                            </Form>
                        </Col>
                        <Col style={{ width: '40px' }}>
                            <Button onClick={openMapPopup} icon={<EnvironmentOutlined />} />
                        </Col>
                    </Row>

                    <Row justify="center">
                        <Col style={{ textAlign: 'center' }}>
                            <Button className="height-btn2 btn-outline-info" icon={<SearchOutlined />} onClick={onClick}>Tra cứu</Button>
                        </Col>
                    </Row>

                </Card>
                <Card className="fadeInRight" title='Danh sách bưu cục gần nhất' size="small" bordered={false}>
                    {postOffice.length > 0 &&
                        <Table bordered dataSource={postOffice} columns={columns} size='small' />
                    }
                </Card>
            </Spin>
            <MapTest
                isOpenPopup={showMap}
                setIsOpenPopup={setShowMap}
                onSelectAddress={onSelectAddress}
                form={form}
                address={form.getFieldValue('address')}
            />
        </PageContainer>
    )
};
export default NearbyPost