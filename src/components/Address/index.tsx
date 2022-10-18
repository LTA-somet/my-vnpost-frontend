import { AddressSearchApi, AdministrativeUnit, AdministrativeUnitPostCodeApi, McasAdministrativeUnitApi } from '@/services/client';
import type { FormInstance } from 'antd';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import { useAdministrativeUnitList } from '@/core/selectors';
import { dataToSelectBox } from '@/utils';
import type { UnitDataProps } from '@/core/initdata';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import MapTest from './Searchmap';
import { EnvironmentOutlined } from '@ant-design/icons';

import '../Address/style.less'

const administrativeUnitApi = new McasAdministrativeUnitApi();
const administrativePostCodeApi = new AdministrativeUnitPostCodeApi();
const addressSearchApi = new AddressSearchApi();
const Address = (props: AddressProps) => {
    const [districtList, setDistrictList] = useState<AdministrativeUnit[]>([]);
    const [communeList, setCommuneList] = useState<AdministrativeUnit[]>([]);
    const addressFromStore = useAdministrativeUnitList();
    const address = props.unitData || addressFromStore;
    const [showMap, setShowMap] = useState<boolean>(false);
    const [address1, setAddress1] = useState<string>();
    const [form] = Form.useForm();
    const [requiredCommune, setRequiredCommune] = useState<boolean>(false);
    const [token, setToken] = useState<string>();
    const [quarantine, setQuarantine] = useState<boolean>(false);

    const wProvinceCode = Form.useWatch(props.provinceField, props.form);
    const wDistrictCode = Form.useWatch(props.districtField, props.form);
    const wCommuneCode = Form.useWatch(props.communeField, props.form);

    useEffect(() => {
        if (props.isCheckQuarantine) {
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
                        )).catch(e => {
                            console.log(e);
                        });
            })();
        }
    }, []);

    const triggerOnChangeData = () => {
        props.onChangeData?.();
    }

    const getListDistrict = (provinceCode?: string) => {
        if (provinceCode) {
            const newDistrictList = address.districtList.filter(d => d.parentCode === provinceCode);
            setDistrictList(newDistrictList);
        } else {
            setDistrictList([]);
        }
    }

    const getListCommune = (districtCode?: string) => {
        if (districtCode) {
            const newCommuneCode = address.communeList.filter(d => d.parentCode === districtCode);
            const newRequiredCommune = newCommuneCode.some(c => c.unitType === "3");
            setRequiredCommune(newRequiredCommune);
            setCommuneList(newCommuneCode);
        } else {
            setCommuneList([]);
        }
    }

    const onChangeProvinceCode = (provinceCode?: string) => {
        console.log("provinceCode", provinceCode);

        getListDistrict(provinceCode);
        props.form.setFieldsValue({ [props.districtField]: '', [props.communeField]: '' });
    }

    const onChangeDistrictCode = (districtCode?: string) => {
        getListCommune(districtCode);
        props.form.setFieldsValue({ [props.communeField]: '' });
    }

    const onChangeCommuneCode = (communeCode?: string) => {
        (async () => {
            if (communeCode && props.isCheckQuarantine && token) {
                fetch(`https://covid.vnpost.vn/service/api/Quarantine/CheckQuarantineArea?communeCode=${communeCode}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
                    .then(resp => resp.json()
                        .then(body => {
                            setQuarantine(body.data)
                        }
                        ))
                    .catch(() => setQuarantine(false));
            } else {
                setQuarantine(false);
            }
        })();
    }

    useEffect(() => {
        getListDistrict(wProvinceCode);
    }, [wProvinceCode]);
    useEffect(() => {
        getListCommune(wDistrictCode);
    }, [wDistrictCode]);
    useEffect(() => {
        onChangeCommuneCode(wCommuneCode)
    }, [wCommuneCode]);

    const openMapPopup = () => {
        setAddress1(props.form.getFieldValue(props.addressField));
        setShowMap(!showMap)
    }

    const onSelectAddress = (value: any) => {
        if (value) {
            props.form.setFieldsValue({
                [props.addressField]: value.name,
                [props.lonField]: value.lng,
                [props.latField]: value.lat,
                [props.postCodeField]: value.postcode,
                [props.vpostCodeField]: value.vpostcode,
            })
            props.onChangeLonLat?.(value.lat, value.lng)
            administrativePostCodeApi.selectItemAdministrativeUnitPostCode(value.postcode)
                .then(resp => {
                    if (resp.status === 200 && resp.data !== null) {
                        administrativeUnitApi.selectItemMcasAdministrativeUnit(resp.data.administrativeCode, true)
                            .then(resp1 => {
                                if (resp1.status === 200 && resp1.data !== null) {
                                    getListDistrict(resp1.data.objParent?.objParent?.code);
                                    getListCommune(resp1.data.objParent?.code);
                                    props.form.setFieldsValue({
                                        [props.provinceField]: resp1.data.objParent?.objParent?.code,
                                        [props.districtField]: resp1.data.objParent?.code,
                                        [props.communeField]: resp1.data.code,
                                    })

                                }
                            });

                    }
                })
        }
    }

    const provinceNode = useMemo(() => dataToSelectBox(address.provinceList, 'code', 'name'), [address.provinceList]);
    const districtNode = useMemo(() => dataToSelectBox(districtList, 'code', 'name'), [districtList]);
    const communeNode = useMemo(() => dataToSelectBox(communeList, 'code', 'name'), [communeList]);

    const filterOption = (value: any, option: any): boolean => {
        return option?.value?.includes(value) || option?.children?.toLowerCase().includes(value.toLowerCase())
    }

    const handleOnBlur = (e: any) => {
        setAddress1(e.target.value)
        addressSearchApi.get(e.target.value, 5, 0, 'VN')
            .then(resp => {
                if (resp.status === 200 && resp.data.length > 0) {
                    getListDistrict(resp.data[0].prov_code);
                    getListCommune(resp.data[0].dist_code);
                    props.form.setFieldsValue({
                        [props.provinceField]: resp.data[0].prov_code,
                        [props.districtField]: resp.data[0].dist_code,
                        [props.communeField]: resp.data[0].postal_code,
                    })

                }

            })
    }

    return (
        <>
            {/* // <Row gutter={6}> */}
            <Col span={24} md={24} xs={24}>
                <Row>
                    <Input.Group className='config-height' compact>
                        <Col style={{ width: 'calc(100% - 40px)' }}>
                            <Form.Item

                                name={props.addressField}
                                label={props.hiddenLabel ? '' : props.addressName}
                                // label={props.hiddenLabel ? "" : props.addressName}
                                rules={[{ required: props.required }]}
                                hidden={props.hidden || props.hiddenAddress}
                                noStyle={props.noStyle}
                            >
                                <Input maxLength={500}
                                    size={props.size}
                                    disabled={props.disabled}
                                    onBlur={handleOnBlur}
                                    onPressEnter={handleOnBlur}

                                    placeholder={props.hiddenLabel ? 'Địa chỉ' : ''}
                                    id={props.id}
                                    style={{ borderRadius: props.styleBorder, fontSize: props.styleFontSize, height: props.styleHeight }}
                                    prefix={props.prefixAddress}
                                />
                            </Form.Item>
                        </Col>
                        {!(props.hidden || props.hiddenAddress) && <Col style={{ width: '40px' }}>
                            <Button disabled={props.disabled}
                                className={props.className}
                                style={{
                                    borderRadius: props.styleBorder,
                                    width: '100%',
                                    height: props.size === 'large' ? 40 : '',
                                    top: props.layout === 'vertical' ? 32 : 0,
                                    // marginTop: props.layout === 'horizontal' ? 0 : 32,

                                }}
                                title="Tìm địa chỉ trên bản đồ"
                                onClick={openMapPopup} icon={<EnvironmentOutlined />} />
                        </Col>}
                    </Input.Group>
                </Row>
            </Col>
            {/* Trong trường hợp ẩn label TT/QH/PX */}

            <Col style={{ width: props.hiddenLabel || props.showOnlyAddressLabel ? props.labelWidth : 0 }} />
            <Col style={{ width: `calc(100% - ${props.hiddenLabel || props.showOnlyAddressLabel ? props.labelWidth : 0}px)` }}>
                <Row gutter={6}>
                    <Col className='config-height' span={props.span} md={props.md} xs={props.xs} lg={props.lg}>
                        <Form.Item
                            name={props.provinceField}
                            label={props.hiddenLabel || props.showOnlyAddressLabel ? "" : <div style={{ flex: 'none' }}> {props.provinceName}</div>}
                            rules={[{ required: props.required, message: `${props.provinceName} là bắt buộc` }]}
                            hidden={props.hidden}
                            noStyle={props.noStyle}
                        >
                            <Select style={{ width: '100%' }} suffixIcon={props.prefixProvince} className={props.className} filterOption={filterOption} placeholder={props.hiddenLabel || props.showOnlyAddressLabel ? props.provinceName : ""} onChange={onChangeProvinceCode} size={props.size} showSearch disabled={props.disabled}>
                                {provinceNode}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={props.span} md={props.md} xs={props.xs} lg={props.lg}>
                        <Form.Item
                            name={props.districtField}
                            label={props.hiddenLabel || props.showOnlyAddressLabel ? "" : props.districtName}
                            rules={[{ required: props.required, message: `${props.districtName} là bắt buộc` }]}
                            hidden={props.hidden}
                            noStyle={props.noStyle}
                        >
                            <Select suffixIcon={props.prefixProvince} className={props.className} filterOption={filterOption} placeholder={props.hiddenLabel || props.showOnlyAddressLabel ? props.districtName : ""} onChange={onChangeDistrictCode} size={props.size} showSearch disabled={props.disabled}>
                                {districtNode}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col className='config-height' span={props.span} md={props.md} xs={props.xs} lg={props.lg}>
                        <Form.Item

                            name={props.communeField}
                            label={props.hiddenLabel || props.showOnlyAddressLabel ? "" : props.communeName}
                            rules={[{ required: props.required && requiredCommune && props.requiredCommune, message: `${props.communeName} là bắt buộc` }]}
                            validateStatus={quarantine == true ? "warning" : ""}
                            {...(quarantine == true ? { help: "Địa chỉ thuộc vùng hạn chế" } : {})}
                            hidden={props.hidden}
                            noStyle={props.noStyle}
                        >
                            <Select onChange={props.onChangeCommune} suffixIcon={props.prefixProvince} className={props.className} filterOption={filterOption} placeholder={props.hiddenLabel || props.showOnlyAddressLabel ? props.communeName : ""} size={props.size} showSearch disabled={props.disabled}>
                                {communeNode}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Form.Item
                        name={props.lonField}
                        hidden
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={props.latField}
                        hidden
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={props.postCodeField}
                        hidden
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={props.vpostCodeField}
                        hidden
                    >
                        <Input />
                    </Form.Item>
                </Row>
            </Col>
            <MapTest
                isOpenPopup={showMap}
                setIsOpenPopup={setShowMap}
                address={address1!}
                vpostcode={props.vpostCodeField}
                postcode={props.postCodeField}
                lat={props.latField}
                lng={props.lonField}
                onSelectAddress={onSelectAddress}
                form={form} />
        </>
    );
};

type AddressProps = {
    form: FormInstance<any>,
    span: number,
    md: number,
    xs: number,
    lg: number,
    addressField: string,
    provinceField: string,
    districtField: string,
    communeField: string,
    lonField: string,
    latField: string,
    postCodeField: string,
    vpostCodeField: string,
    unitData?: UnitDataProps,
    size: SizeType,
    disabled: boolean,
    showOnlyAddressLabel: boolean,
    hiddenLabel: boolean,
    labelWidth: number,
    addressName?: string,
    provinceName?: string,
    districtName?: string,
    communeName?: string,
    required: boolean,
    onChangeLonLat?: (lat: string, lon: string) => void,
    onChangeCommune?: (communeCode: string) => void,
    hidden?: boolean,
    noStyle?: boolean,
    layout?: 'vertical' | 'horizontal',

    hiddenAddress?: boolean,
    id: string,
    className: string,
    prefixAddress: any,
    prefixProvince: any,
    styleBorder: string
    styleFontSize: string,
    styleHeight: string,
    isCheckQuarantine: boolean, // ckeck vùng hạn chế
    requiredCommune: boolean
}

Address.defaultProps = {
    span: 8,
    xs: 24,
    md: 8,
    lg: 8,
    size: 'mid',
    addressField: 'address',
    provinceField: 'provinceCode',
    districtField: 'districtCode',
    communeField: 'communeCode',
    addressName: 'Địa chỉ chi tiết',
    provinceName: 'Tỉnh/TP',
    districtName: 'Quận/Huyện',
    communeName: 'Phường/Xã',
    lonField: 'lon',
    postCodeField: 'postCode',
    vpostCodeField: 'vpostCode',
    latField: 'lat',
    disabled: false,
    showOnlyAddressLabel: false,
    hiddenLabel: false,
    labelWidth: 120,
    required: true,
    hidden: false,
    noStyle: false,
    layout: 'horizontal',

    hiddenAddress: false,
    id: '',
    className: '',
    prefixAddress: '',
    prefixProvince: '',
    styleBorder: '',
    styleFontSize: '',
    styleHeight: '',
    isCheckQuarantine: false,
    requiredCommune: true
};
export default React.memo(Address);