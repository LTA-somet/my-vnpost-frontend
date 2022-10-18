import { useModel } from 'umi';
import { Modal, Space, Table, Button, Divider, Card, Timeline, Row, Col } from "antd";
import { useEffect, useState } from "react";
import { Columns, ColumnsDelivery } from './colums';
import e from 'express';
import './Searchmap.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import Leaflet from 'leaflet';
Leaflet.Icon.Default.imagePath =
    '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/';

require("leaflet-routing-machine");

const rootParams = {
    'api-version': '1.1',
    // layers: 'country',
    apikey: 'e5f2a3ebed5a09d7a67a49b5244fa8cc6c58f090000df446'
}
const URL_TILE_MAP = 'https://maps.vnpost.vn/api/tm/{z}/{x}/{y}@2x.png?apikey=' + rootParams.apikey;
const OrderHistory = (props: Props) => {
    const { orderHistory, deliveryHistory, postMan, postmanPickUpInfo, getOrderHistory, getDeliveryHistory, getPostmanInfo, getPostmanPickUpInfo } = useModel('orderDetailsList');

    const itemCode = props.itemCode;
    useEffect(() => {
        if (itemCode && props.isOpenPopup == true) {
            getOrderHistory(itemCode);
            getDeliveryHistory(itemCode);
            getPostmanInfo(itemCode);
            if (props.type == "1") {
                getPostmanPickUpInfo(itemCode);
            }
        }
    }, [props.isOpenPopup]);

    const groupCreateDate = orderHistory.reduce((r: any, a: any) => {
        r[a.createdDate] = [...r[a.createdDate] || [], a];
        return r;
    }, {});

    // const [currentAddressSelected, setCurrentAddressSelected] = useState<any>();

    // const getDefautPostion = () => {
    //     if (props.lat && props.lng) {
    //         return [props.lat, props.lng]
    //     }
    //     return [21.030468298258313, 105.77986783960021] // số 5 phạm hùng
    // }

    // const [position, setPostions] = useState(getDefautPostion);

    // const ChangeMapView = () => {
    //     const map = useMap();
    //     map.setView(position, map.getZoom());

    //     return null;
    // }

    // const getAddressInfo = (feature: any) => {
    //     return {
    //         vpostcode: feature.properties.smartcode,
    //         name: feature.properties.name,
    //         value: feature.properties.label + (feature.properties.smartcode ? ' (' + feature.properties.smartcode + ')' : ''),
    //         lng: feature.geometry.coordinates[0],
    //         lat: feature.geometry.coordinates[1],
    //         postcode: feature.properties.postcode,
    //         label: feature.properties.label
    //     }
    // }

    // const onSelectAddressInMap = (adr: any) => {
    //     if (adr) {
    //         const newAddressSelected = addressSelected.filter(a => a === currentAddressSelected);
    //         setAddressSelected([...newAddressSelected, adr]);
    //         if (newAddressSelected.length === 0) {
    //             setCurrentAddressSelected(adr);
    //             setPostions([adr.lat, adr.lng])
    //         }
    //     }
    // }

    // const getAddressByLatLng = (lat: number, lon: number) => {
    //     (async () => {
    //         fetch(`https://maps.vnpost.vn/api/reverse?point.lat=${lat}&point.lon=${lon}&api-version=1.1&apikey=e5f2a3ebed5a09d7a67a49b5244fa8cc6c58f090000df446`)
    //             .then(resp => resp.json()
    //                 .then(body => {
    //                     const features = body.data.features ? body.data.features : [];
    //                     if (features.length > 0) {
    //                         const adr = getAddressInfo(features[0]);
    //                         onSelectAddressInMap(adr);
    //                     }
    //                 }
    //                 ));
    //     })();
    // }

    // const Markers = () => {
    //     useMapEvents({
    //         click(e: any) {
    //             setPostions([
    //                 e.latlng.lat,
    //                 e.latlng.lng
    //             ]);
    //             getAddressByLatLng(e.latlng.lat, e.latlng.lng)
    //         },

    //     })
    //     return null;
    // }


    console.log("Leaflet", Leaflet);


    const loadMap = () => {
        const map = Leaflet.map("map", {
            doubleClickZoom: "center",
            dragging: true,
            attributionControl: false,
            center: [65.012357, 25.483549],
            zoom: 7,
            layers: [
                Leaflet.tileLayer(URL_TILE_MAP)
            ]
        });

        const routeControl = Leaflet.Routing.control({
            show: true,
            fitSelectedRoutes: true,
            plan: false,
            lineOptions: {
                styles: [
                    {
                        color: "blue",
                        opacity: "0.7",
                        weight: 6
                    }
                ]
            }
        })
            .addTo(map)
            .getPlan();

        const newLatLngA = new Leaflet.LatLng(21.030468298258313, 105.77986783960021, "taskA");
        const newLatLngB = new Leaflet.LatLng(21.060468298258313, 105.730286783960021, "taskB");
        const newLatLngC = new Leaflet.LatLng(21.090468298258313, 105.78686783960021, "taskc");

        routeControl.setWaypoints([newLatLngA, newLatLngB, newLatLngC]);
    }

    useEffect(() => {
        loadMap();
    }, []);

    console.log("orderHistory", orderHistory);

    return (
        <Modal
            bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
            title={"Hành trình đơn hàng " + props.itemCode}
            visible={props.isOpenPopup}
            width={1000}
            onOk={() => props.setIsOpenPopup(false)}
            onCancel={() => props.setIsOpenPopup(false)}
            footer={null}
        >
            <Card size="small" bordered={false}>
                {props.type == "1" ?
                    <>
                        <table>
                            <th style={{ width: 130, textAlign: "left" }} className="span-font">Bưu tá thu gom: &nbsp; </th>
                            <td className="span-font">{postmanPickUpInfo && postmanPickUpInfo?.ListValue ? postmanPickUpInfo?.ListValue[0]?.PostmanName + " - " + postmanPickUpInfo?.ListValue[0]?.PostmanTel : ''}</td>
                        </table>
                    </>
                    : null
                }
                <hr style={{ border: 0, borderTop: "1px solid #eee", borderRadius: "5px" }} />
                <table>
                    <th style={{ width: 130, textAlign: "left" }} className="span-font">Bưu tá phát hàng: &nbsp; </th>
                    <td className="span-font">{postMan && postMan?.ListValue ? postMan?.ListValue[0]?.PostmanName + " - " + postMan?.ListValue[0]?.PostmanTel : ''}</td>
                </table>
            </Card>
            <br />
            <Card title={`Thông tin sự kiện`} size="small" bordered={false}>
                {
                    <Row gutter={14}>
                        <Col span={12}>
                            <table style={{ width: "100%", marginTop: 5 }}>
                                {
                                    Object.keys(groupCreateDate).map(key => {
                                        const value = groupCreateDate[key];
                                        return (
                                            <tbody>

                                                <Timeline.Item >
                                                    <th style={{ textAlign: "left", fontSize: "14px", padding: "2px 0px 15px" }}><span style={{ border: "2px solid orange", padding: "5px 20px", borderRadius: 25, color: 'orange' }}>{key}</span></th>

                                                    {value.map(e => {
                                                        const strlit: string[] = e.unitName?.split('<p/>') || [];
                                                        // console.log("strlit", strlit);
                                                        return (
                                                            <>
                                                                <Card size="small" bordered={false}>
                                                                    <tr style={{ fontSize: "14px" }}><span style={{ padding: 2, background: "rgb(128 128 128 / 19%)", color: 'red' }}>{e.createdHour}</span> - <i style={{ color: 'green' }}>{e.statusName}</i></tr>
                                                                    <tr style={{ fontSize: "14px" }}>Tại: {strlit[0]}</tr>
                                                                    <tr style={{ fontSize: "13px", color: "gray" }}>{strlit[1]}</tr>
                                                                </Card>
                                                                <br />
                                                            </>
                                                        )
                                                    })}
                                                </Timeline.Item>

                                            </tbody>
                                        )
                                    })
                                }
                            </table>
                        </Col>
                        <Col span={12}>
                            <span className='span-font'><b>Định vị bưu gửi</b></span>
                            {/* <MapContainer zoom={13}>
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
                            </MapContainer> */}
                            <div id="map" />
                        </Col>
                    </Row>
                }
            </Card>
        </Modal >

    )
}

type Props = {
    isOpenPopup: boolean;
    itemCode: string;
    type: string; //1: đon hang gui , 4 đơn hàng nhan
    setIsOpenPopup: (isOpenPopup: boolean) => void;

}
export default OrderHistory;