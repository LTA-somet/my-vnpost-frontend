import type { FormInstance } from 'antd';
import { AutoComplete, Col, Form, Input, Modal, Row, Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import './Searchmap.css';
import 'leaflet/dist/leaflet.css';
import Leaflet from 'leaflet';
import { ContactApi } from '@/services/client';
import { debounce } from 'lodash';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
Leaflet.Icon.Default.imagePath =
    '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/';

const contactApi = new ContactApi();
const rootParams = {
    'api-version': '1.1',
    // layers: 'country',
    apikey: 'e5f2a3ebed5a09d7a67a49b5244fa8cc6c58f090000df446'
}

const URL_TILE_MAP = 'https://maps.vnpost.vn/api/tm/{z}/{x}/{y}@2x.png?apikey=' + rootParams.apikey;

const MapTest = (props: Props) => {
    const [addressSelected, setAddressSelected] = useState<any[]>([]);
    const [currentAddressSelected, setCurrentAddressSelected] = useState<any>();
    const [options, setOptions] = useState<any[]>([]);
    const [address, setAddress] = useState(props.address);
    const [form] = Form.useForm();
    const [isloading, setIsLoading] = useState(false);


    const getDefautPostion = () => {
        if (props.lat && props.lng) {
            return [props.lat, props.lng]
        }
        return [21.030468298258313, 105.77986783960021] // số 5 phạm hùng
    }

    const [position, setPostions] = useState(getDefautPostion);


    const reset = () => {
        setOptions([]);
        setAddress('');
        setAddressSelected([]);
        setCurrentAddressSelected(null!);
        setPostions([21.030468298258313, 105.77986783960021])
    }

    const getAddressInfo = (feature: any) => {
        return {
            vpostcode: feature.properties.smartcode,
            name: feature.properties.name,
            value: feature.properties.label + (feature.properties.smartcode ? ' (' + feature.properties.smartcode + ')' : ''),
            lng: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1],
            postcode: feature.properties.postcode,
            label: feature.properties.label
        }
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

    const debounceSearching = useCallback(debounce((value) => searching(value), 300), [])

    useEffect(() => {
        if (props.isOpenPopup) {
            if (props.address) {
                searching(props.address, (addressList) => {
                    const curr = addressList && addressList[0];
                    if (curr) {
                        setOptions([curr]);
                        setCurrentAddressSelected(curr)
                        setAddressSelected([curr])
                        setPostions([curr.lat, curr.lng])
                        form.setFieldsValue({
                            address: curr.value
                        })
                    }
                });
            }
        } else {
            reset();
        }
    }, [form, props.address, props.isOpenPopup, searching]);

    useEffect(() => {
        if (address) {
            debounceSearching(address);
        }
    }, [address, debounceSearching]);

    const onSelectAddressInMap = (adr: any) => {
        if (adr) {
            const newAddressSelected = addressSelected.filter(a => a === currentAddressSelected);
            setAddressSelected([...newAddressSelected, adr]);
            if (newAddressSelected.length === 0) {
                setCurrentAddressSelected(adr);
                setPostions([adr.lat, adr.lng])
            }
        }
    }

    const getAddressByLatLng = (lat: number, lon: number) => {
        (async () => {
            fetch(`https://maps.vnpost.vn/api/reverse?point.lat=${lat}&point.lon=${lon}&api-version=1.1&apikey=e5f2a3ebed5a09d7a67a49b5244fa8cc6c58f090000df446`)
                .then(resp => resp.json()
                    .then(body => {
                        const features = body.data.features ? body.data.features : [];
                        if (features.length > 0) {
                            const adr = getAddressInfo(features[0]);
                            onSelectAddressInMap(adr);
                        }
                    }
                    ));
        })();
    }

    const Markers = () => {
        useMapEvents({
            click(e: any) {
                setPostions([
                    e.latlng.lat,
                    e.latlng.lng
                ]);
                getAddressByLatLng(e.latlng.lat, e.latlng.lng)
            },
        })
        return null;
    }

    const handleSearch = (values: string) => {
        if (values !== '') {
            debounceSearching(values);
        }
    };

    const handleChange = (adr: any) => {
        if (adr) {
            setCurrentAddressSelected(adr);
            setAddressSelected([...addressSelected, adr]);
            setPostions([adr.lat, adr.lng])
        }
    };

    const ChangeMapView = () => {
        const map = useMap();
        map.setView(position, map.getZoom());

        return null;
    }

    // chọn địa chỉ ở list bên phải
    const onSelectAddressSelected = (adr: any) => {
        form.setFieldsValue({
            address: adr.value
        })
        setCurrentAddressSelected(adr);
        setPostions([adr.lat, adr.lng])
    }

    const handleOk = () => {
        props.setIsOpenPopup(false);
        props.onSelectAddress?.(currentAddressSelected);
    };
    return (
        <Modal
            title='Tìm kiếm địa chỉ'
            visible={props.isOpenPopup}
            footer={[
                <Button className='custom-btn1 btn-outline-danger' icon={<CloseCircleOutlined />} key="back" type="primary" onClick={() => props.setIsOpenPopup(false)}>
                    Huỷ
                </Button>,
                <Button className='custom-btn1 btn-outline-success' icon={<CheckCircleOutlined />} key="submit" type="primary" onClick={handleOk}>
                    Đồng ý
                </Button>
            ]}
            onCancel={() => props.setIsOpenPopup(false)}
            // onOk={handleOk}
            // okText={"Đồng ý" }
            width={1000}
            destroyOnClose
        >
            <Row>
                <Col xs={24}>
                    <Form form={form} name="form-searchmap">
                        <Form.Item
                            name="address"
                        >
                            <AutoComplete
                                onSearch={handleSearch}
                                onSelect={(event: any, newValue: any) => {
                                    handleChange(newValue);
                                }}
                                options={options}
                            >
                                <Input.Search placeholder="Nhập địa chỉ VD: Bưu điện Hà Nội" loading={isloading} enterButton />

                            </AutoComplete>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col xs={16}>
                    <MapContainer zoom={13}>
                        <Markers />
                        <ChangeMapView />
                        <TileLayer
                            url={URL_TILE_MAP}
                        />
                        <Marker position={position}>
                            <Popup>
                                {currentAddressSelected ? currentAddressSelected.name : ''}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </Col>
                <Col xs={8}>
                    <div className="list-add">
                        {
                            addressSelected.map(adr =>
                                <div
                                    className={"address-item " + (currentAddressSelected && adr.name === currentAddressSelected?.name ? "address-selected" : '')}
                                    onClick={() => onSelectAddressSelected(adr)}
                                >
                                    {adr.label}
                                    <div className="vpostcode">
                                        vpostcode: {adr.vpostcode}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </Col>
            </Row>
        </Modal>
    );


};

type Props = {
    form: FormInstance<any>,
    address: string,
    lat?: string,
    lng?: string,
    vpostcode?: string,
    postcode?: string,
    isOpenPopup: boolean,
    setIsOpenPopup: (isOpenPopup: boolean) => void,
    onSelectAddress?: (address: any) => void,
};

export default MapTest;
