import { AdministrativeUnit } from '@/services/client';
import { Button, Col, Form, FormInstance, Input, Row, Select } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import { useAdministrativeUnitList } from '@/core/selectors';
import { dataToSelectBox } from '@/utils';
import { UnitDataProps } from '@/core/initdata';
import { SizeType } from 'antd/es/config-provider/SizeContext';
// import MapTest from './Searchmap';
// import { EnvironmentOutlined } from '@ant-design/icons';

const Address2 = (props: AddressProps) => {
    // console.log("props AddressSender", props);

    const [districtList, setDistrictList] = useState<AdministrativeUnit[]>([]);
    const [communeList, setCommuneList] = useState<AdministrativeUnit[]>([]);
    const addressFromStore = useAdministrativeUnitList();
    const address = props.unitData || addressFromStore;
    // const [showMap, setShowMap] = useState<boolean>(false);

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
            setCommuneList(newCommuneCode);
        } else {
            setCommuneList([]);
        }
    }

    const onChangeProvinceCode = (provinceCode?: string) => {
        getListDistrict(provinceCode);
        props.form.setFieldsValue({ [props.districtField]: undefined, [props.communeField]: undefined });
        props.setSenderProviceCode?.(provinceCode)
        props.setReceiverProviceCode?.(provinceCode)
    }

    const onChangeDistrictCode = (districtCode?: string) => {
        getListCommune(districtCode);
        props.form.setFieldsValue({ [props.communeField]: undefined });
    }

    useEffect(() => {
        const provinceCode = props.form.getFieldValue(props.provinceField);
        getListDistrict(provinceCode);
    }, [props.form.getFieldValue(props.provinceField)]);
    useEffect(() => {
        const districtCode = props.form.getFieldValue(props.districtField);
        getListCommune(districtCode);
    }, [props.form.getFieldValue(props.districtField)]);

    const filterOption = (value: any, option: any): boolean => {
        return option?.value?.includes(value) || option?.children?.toLowerCase().includes(value.toLowerCase())
    }

    const provinceNode = useMemo(() => dataToSelectBox(address.provinceList, 'code', 'name'), [address.provinceList]);
    const districtNode = useMemo(() => dataToSelectBox(districtList, 'code', 'name'), [districtList]);
    const communeNode = useMemo(() => dataToSelectBox(communeList, 'code', 'name'), [communeList]);

    return (
        <>
            <Row gutter={8}>
                <Col className='config-height' span={props.span} md={props.md} xs={props.xs} lg={props.lg} >
                    <Form.Item
                        name={props.provinceField}
                        label={props.hiddenLabel ? "" : props.provinceName}
                        rules={[{ required: props.requiredProv, message: 'Tỉnh/Thành phố là bắt buộc' }]}
                    >
                        <Select allowClear filterOption={filterOption} placeholder={props.hiddenLabel ? props.provinceName : ""} onChange={onChangeProvinceCode} size={props.size} showSearch disabled={props.disabled}>
                            {/* {dataToSelectBox(address.provinceList, 'code', 'name')} */}
                            {provinceNode}
                        </Select>
                    </Form.Item>
                </Col>
                <Col className='config-height' span={props.span} md={props.md} xs={props.xs} lg={props.lg}>
                    <Form.Item
                        name={props.districtField}
                        label={props.hiddenLabel ? "" : props.districtName}
                        rules={[{ required: props.requiredDist, message: 'Quận/Huyện là bắt buộc' }]}
                    >
                        <Select allowClear filterOption={filterOption} placeholder={props.hiddenLabel ? props.districtName : ""} onChange={onChangeDistrictCode} size={props.size} showSearch disabled={props.disabled}>
                            {/* {dataToSelectBox(districtList, 'code', 'name')} */}
                            {districtNode}
                        </Select>
                    </Form.Item>
                </Col>
                <Col className='config-height' span={props.span} md={props.md} xs={props.xs} lg={props.lg}>
                    {/* <Col span={props.span} md={props.md} xs={props.xs} lg={props.lg}> */}
                    <Form.Item
                        name={props.communeField}
                        label={props.hiddenLabel ? "" : props.communeName}
                    // rules={[{ required: props.required }]}
                    >
                        <Select allowClear filterOption={filterOption} placeholder={props.hiddenLabel ? props.communeName : ""} size={props.size} showSearch disabled={props.disabled}>
                            {/* {dataToSelectBox(communeList, 'code', 'name')} */}
                            {communeNode}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
};

type AddressProps = {
    form: FormInstance<any>,
    span: number,
    md: number,
    xs: number,
    lg: number,
    // addressField: string,
    provinceField: string,
    districtField: string,
    communeField: string,
    unitData?: UnitDataProps,
    size: SizeType,
    disabled: boolean,
    hiddenLabel: boolean,
    labelWidth: number,
    setSenderProviceCode?: (senderProvinceCode?: string) => void;
    setReceiverProviceCode?: (receiverProviceCode?: string) => void;

    addressName?: string,
    provinceName?: string,
    districtName?: string,
    communeName?: string,
    requiredProv?: boolean,
    requiredDist?: boolean
}
Address2.defaultProps = {
    span: 8,
    xs: 24,
    md: 8,
    lg: 8,
    size: 'mid',
    // addressField: 'address',
    provinceField: 'provinceCode',
    districtField: 'districtCode',
    communeField: 'communeCode',

    addressName: 'Địa chỉ chi tiết',
    provinceName: 'Tỉnh/TP',
    districtName: "Quận/Huyện",
    communeName: "Phường/Xã",
    disabled: false,
    hiddenLabel: false,
    labelWidth: 120,
    requiredProv: false,
    requiredDist: false
};
export default Address2;