import Address from '@/components/Address';
import { formatInputNumber, validateMessages } from '@/core/contains';
import { OrderAddonDto, McasVaServiceDto, VaDto, VasPropsDto } from '@/services/client';
import { dataToSelectBox } from '@/utils';
import { CheckCircleOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, DatePicker, Form, FormInstance, Input, InputNumber, Modal, Row, Select, Space, Table } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import VaItemTable from './va-item-table';

export type Currency = 'rmb' | 'dollar';

export interface PriceValue {
    number?: number;
    currency?: Currency;
}

export interface Props {
    disable: boolean;
    value?: VaDto;
    vaField: McasVaServiceDto;
    onChange?: (checked: boolean, value: OrderAddonDto) => void;
    form: FormInstance<any>,
}
type AddressInfo = {
    addressField?: VasPropsDto,
    provinceField?: VasPropsDto,
    districtField?: VasPropsDto;
    communeField?: VasPropsDto,
    postcodeField?: VasPropsDto,
    vpostcodeField?: VasPropsDto,
    latField?: VasPropsDto,
    lngField?: VasPropsDto,
}
const VaItem: React.FC<Props> = ({ value, onChange, vaField, disable, form }) => {
    const [currentChecked, setCurrentChecked] = useState<boolean>(false);
    const [currentValue, setCurrentValue] = useState<VaDto>({ vaCode: vaField.vaServiceId, addons: [] });
    const [isVisibleModal, setVisibleModel] = useState<boolean>(false);
    const [vaForm] = Form.useForm();
    const addressInfo = useRef<AddressInfo>()


    useEffect(() => {
        const addressField = vaField.propsList?.find(p => p.defineColumn === 'address');
        const provinceField = vaField.propsList?.find(p => p.defineColumn === 'province');
        const districtField = vaField.propsList?.find(p => p.defineColumn === 'district');
        const communeField = vaField.propsList?.find(p => p.defineColumn === 'commune');
        const postcodeField = vaField.propsList?.find(p => p.defineColumn === 'postcode');
        const vpostcodeField = vaField.propsList?.find(p => p.defineColumn === 'vpostcode');
        const latField = vaField.propsList?.find(p => p.defineColumn === 'lat');
        const lngField = vaField.propsList?.find(p => p.defineColumn === 'lng');

        addressInfo.current = { addressField, provinceField, districtField, communeField, postcodeField, vpostcodeField, latField, lngField }
    }, [vaField]);

    useEffect(() => {
        setCurrentChecked(!!value);
        if (value) {
            setCurrentValue(value)
        } else {
            setCurrentValue({ vaCode: vaField.vaServiceId, addons: [] })
        }
    }, [value]);

    const triggerChange = (newObj: { checked?: boolean, newValue?: VaDto }) => {
        const newChecked = newObj.checked === undefined ? currentChecked : newObj.checked;
        const newCurrentValue = newObj.newValue === undefined ? currentValue : newObj.newValue;

        onChange?.(newChecked, newCurrentValue);
    }

    const getPropertyListDefault = (): OrderAddonDto[] => {
        return vaField.propsList?.map(p => ({ vaCode: p.vaCode, propCode: p.propCode!, propValue: '' })) || [];
    }

    const onCheck = (checked: boolean, newAddon?: OrderAddonDto[]) => {
        const addons = checked ? (newAddon ? newAddon : getPropertyListDefault()) : [];
        const newValue: VaDto = { vaCode: vaField.vaServiceId, addons }
        setCurrentChecked(checked)
        setCurrentValue(newValue);

        triggerChange({ checked: checked, newValue: newValue })
    }

    const onChangeInput = (e: any) => {
        const propCode = e.target.name;
        const propValue = e.target.value;
        const newAddons = [...currentValue.addons!]
        const index = newAddons.findIndex(p => p.propCode === propCode);
        if (index >= 0) {
            newAddons[index] = { ...newAddons[index], propValue: propValue };
        } else {
            newAddons.push({ propCode: propCode, propValue: propValue })
        }

        const newValue: VaDto = { ...currentValue, addons: newAddons }
        setCurrentValue(newValue);
        triggerChange({ newValue: newValue })
    }

    const onChangeDate = (propCode: string, newValueM: any) => {
        const propValue = newValueM ? newValueM.format('DD/MM/YYYY') : '';
        const e = {
            target: {
                name: propCode,
                value: propValue
            }
        }
        onChangeInput(e);
    }

    const onChangeInputNumber = (name: string, newValue?: number | '') => {
        const e = {
            target: {
                name,
                value: newValue
            }
        }
        onChangeInput(e);
    }

    const onChangeSelect = (name: string, newValue?: string) => {
        const e = {
            target: {
                name,
                value: newValue
            }
        }
        onChangeInput(e);
    }

    const renderAddress = () => {
        return <Row>
            <Address
                addressField={addressInfo.current?.addressField?.propCode}
                provinceField={addressInfo.current?.provinceField?.propCode}
                districtField={addressInfo.current?.districtField?.propCode}
                communeField={addressInfo.current?.communeField?.propCode}
                addressName={addressInfo.current?.addressField?.propName}
                provinceName={addressInfo.current?.provinceField?.propName}
                districtName={addressInfo.current?.districtField?.propName}
                communeName={addressInfo.current?.communeField?.propName}
                span={24}
                md={24}
                xs={24}
                lg={24}
                labelWidth={1}
                hiddenLabel
                form={vaForm}
            />
        </Row>
    }


    const getDefaultValue = (vasPropsDto: VasPropsDto) => {
        if (vasPropsDto.defaultValue) {
            if (vasPropsDto.defaultValue.startsWith('$')) {
                const fieldName = vasPropsDto.defaultValue.replace('$', '');
                return form.getFieldValue(fieldName) || '';
            }
            return vasPropsDto.defaultValue;
        }
        return '';
    }

    const renderPropField = (vaProp: VasPropsDto, currentPropValue: string = '', size: SizeType = 'middle', bordered: boolean = true) => {
        if (vaProp.defineColumn === 'address') {
            return renderAddress();
        }
        switch (vaProp.dataType!) {
            case 'text':
                return <Input
                    name={vaProp.propCode} disabled={vaProp.disable || disable}
                    size={size} bordered={bordered}
                    style={bordered ? {} : { borderBottom: '1px solid #fdb813' }}
                    value={currentPropValue}
                    onChange={onChangeInput}
                />
            case 'number':
                return <InputNumber min={0} max={1000000000}
                    name={vaProp.propCode} disabled={vaProp.disable || disable} size={size} bordered={bordered}
                    style={bordered ? { width: '100%' } : { borderBottom: '1px solid #fdb813', width: '100%' }}
                    value={currentPropValue ? +currentPropValue : ''}
                    onChange={(v) => onChangeInputNumber(vaProp.propCode!, v)}
                    {...formatInputNumber}
                />
            case 'date':
                return <DatePicker name={vaProp.propCode} disabled={vaProp.disable || disable} size={size} bordered={bordered}
                    style={bordered ? {} : { borderBottom: '1px solid #fdb813', width: '100%' }}
                    onChange={(v) => onChangeDate(vaProp.propCode!, v)}
                    defaultValue={currentPropValue ? moment(currentPropValue, 'DD/MM/YYYY') : undefined}
                    format={'DD/MM/YYYY'}
                />
            case 'checkbox':
                return <Checkbox name={vaProp.propCode} disabled={vaProp.disable} defaultChecked={currentPropValue === "1"} />
            case 'select':
                const selectOptions = JSON.parse(vaProp.defineColumn || '[]');
                return <Select
                    onChange={(v) => onChangeSelect(vaProp.propCode!, v)}
                    style={bordered ? {} : { borderBottom: '1px solid #fdb813', width: '100%' }}
                    size={size}
                    bordered={bordered}
                    defaultValue={currentPropValue}
                    disabled={vaProp.disable || disable}
                    showSearch
                >
                    {dataToSelectBox(selectOptions)}
                </Select>;
            case 'table':
                return <VaItemTable vaProp={vaProp} />
        }
    }

    const onOpenModal = () => {
        const formValue = {};
        vaField.propsList?.forEach(p => {
            const addon = value?.addons?.find(a => a.propCode === p.propCode);
            const propValue = addon ? (p.dataType === 'checkbox' ? (addon?.propValue === '1') : addon?.propValue) : getDefaultValue(p)
            formValue[p.propCode!] = propValue
        });

        vaForm.setFieldsValue(formValue);
        setVisibleModel(true);
    }

    const onCheckVa = (e: any) => {
        if (vaField.showPopup) {
            if (e.target.checked) {
                onOpenModal();
            } else {
                onCheck(e.target.checked);
            }
        } else {
            onCheck(e.target.checked);
        }
    }

    const onCloseModal = () => {
        vaForm.resetFields();
        setVisibleModel(false);
    }

    const onSubmitForm = () => {
        vaForm.validateFields().then(formValue => {
            const newAddon: OrderAddonDto[] = vaField.propsList?.map(p => {
                const propValueRaw = formValue[p.propCode!];
                const propValue = p.dataType === 'checkbox' ? (propValueRaw ? '1' : '0') : propValueRaw;
                return {
                    propCode: p.propCode!,
                    propValue: propValue,
                    vaCode: p.vaCode!
                }
            }) || [];
            // console.log('newAddon', newAddon);
            onCheck(true, newAddon);
            onCloseModal();
        })
    }

    const tableWrapperCol = {
        labelCol: { span: 0 },
        wrapperCol: { span: 24 }
    }
    const fieldWrapperCol = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    }

    const checkNumber = (str: any): boolean => {
        if (isNaN(str)) return false;
        const n: number = +str;
        return n > 0;
    }

    const checkValidateTable = (_: any, newValue: string = '', vaProp: VasPropsDto) => {
        if (vaProp.required) {
            return Promise.reject(new Error(`Thông tin ${vaProp.propName} là bắt buộc`));
        }
        const newValues = newValue.split("|");
        for (let i = 0; i < newValues.length; i++) {
            if (!newValues[i]) return;

            const row = newValues[i].split("^");
            if (row) {
                const columnDefine: any[] = eval(vaProp.defineColumn || '[]');
                for (let j = 0; j < columnDefine.length; j++) {
                    if (columnDefine[j].required && !row[j]) {
                        return Promise.reject(new Error(`Chưa nhập đủ thông tin`));
                    }
                    if (row[j] && columnDefine[j].dataType === 'number' && !checkNumber(row[j])) {
                        return Promise.reject(new Error(`Số phải lớn hơn 0`));
                    }
                }
            }
        }
        return Promise.resolve();
    };

    return (
        <>
            <tr className='g-tr'>
                <td width={24} style={{ textAlign: 'center' }}>
                    <Checkbox checked={currentChecked} onChange={onCheckVa} disabled={disable} />
                </td>
                <td width={'calc(40% - 5px)'}  >
                    {vaField.vaServiceNameVnp || vaField.vaServiceName}
                </td>
                {vaField.showPopup ?
                    <td width='60%' >{currentChecked && <a onClick={onOpenModal}>Xem chi tiết</a>}</td>
                    :
                    <td width='60%'>
                        {vaField.propsList?.map(vaProp => {
                            if (!currentChecked) return;
                            if (!vaProp.show) return;
                            const propValueObj = value?.addons?.find(a => a.propCode === vaProp.propCode);

                            return <Row style={{ marginBottom: 4 }}>
                                <Col span={14} style={{ paddingTop: '7px' }}>{vaProp.propName}</Col>
                                <Col span={10}>{renderPropField(vaProp, propValueObj?.propValue, 'middle', false)}</Col>
                            </Row>
                        })}
                    </td>
                }
            </tr>
            {vaField.showPopup && <Modal
                title={`Thông tin chi tiết ${vaField.vaServiceNameVnp ?? vaField.vaServiceName}`}
                width={600}
                style={{ fontSize: '12px', fontWeight: 'normal', color: '#212121' }}
                onCancel={onCloseModal}
                visible={isVisibleModal}
                destroyOnClose
                maskClosable={false}
                footer={
                    <Space>
                        <Button className='height-btn1 btn-outline-secondary' icon={<ExportOutlined />} onClick={onCloseModal}>Đóng</Button>
                        <Button className='height-btn1 btn-outline-success' icon={<CheckCircleOutlined />} onClick={onSubmitForm}>Xác nhận</Button>
                    </Space>
                }
            >
                <Form
                    name="form-va-info"
                    {...fieldWrapperCol}
                    // onFinish={onSubmitForm}
                    autoComplete="off"
                    validateMessages={validateMessages}
                    labelWrap
                    form={vaForm}
                >
                    {vaField.propsList?.map(vaProp => {
                        if (!vaProp.show) return;
                        const propValueObj = value?.addons?.find(a => a.propCode === vaProp.propCode);
                        const currentPropValue = propValueObj ? propValueObj?.propValue : getDefaultValue(vaProp);

                        return <>
                            {vaProp.dataType === 'table' && vaProp.propName}
                            <Form.Item
                                label={vaProp.dataType === 'table' ? '' : vaProp.propName}
                                name={vaProp.propCode}
                                {...(vaProp.dataType === 'table' ? tableWrapperCol : {})}
                                // initialValue={vaProp.dataType === 'checkbox' ? (propValueObj?.propValue === '1') : propValueObj?.propValue}
                                {...(vaProp.dataType === 'checkbox' ? { valuePropName: 'checked' } : {})}
                                {...(vaProp.dataType === 'table' ?
                                    { rules: [{ validator: (_: any, newValues: string) => checkValidateTable(_, newValues, vaProp) }] }
                                    : { required: vaProp.required })}

                            >
                                {renderPropField(vaProp, currentPropValue)}
                            </Form.Item>
                        </>
                    })}
                </Form>
            </Modal>}
        </>
    );
};
export default React.memo(VaItem);