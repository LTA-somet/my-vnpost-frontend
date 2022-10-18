import { patternPhone, patternPhoneIntl, regexPostalCode } from '@/core/contains';
import type { ContactDto, ContractDto, ContractServiceCode, McasNationalDto } from '@/services/client';
import { ContactApi, McasNationalApi } from '@/services/client';
import { equalsPhoneNumber, formatStart84 } from '@/utils/PhoneUtil';
import { ArrowRightOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Card, Col, Collapse, Form, Input, Row, Select } from 'antd';
import type { ReactNode } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'umi';
import { debounce } from 'lodash';
import InfoModal from './info-modal';
import { capitalizeName, removeAccents } from '@/utils';


const contactApi = new ContactApi();
const mcasNationalApi = new McasNationalApi();
const Receiver: React.FC<Props> = (props: Props) => {
    const [messageReceiver, setMessageReceiver] = useState<ReactNode>();
    const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
    const contractNumber = useRef<string>();
    const [searchPhoneValue, setSearchPhoneValue] = useState<string>('');
    const [listNation, setListNation] = useState<McasNationalDto[]>([]);
    const [nation, setNation] = useState<any>();
    const [receiverSelected, setReceiverSelected] = useState<ContactDto>();
    const [phoneCode, setPhoneCode] = useState<string>('+84');
    const [receiverList, setReceiverList] = useState<ContactDto[]>([]);

    const findCurrentReceiver = (phone: string) => {
        const getCurrentReceiver = async () => {
            if (!phone) return undefined;

            let rs = receiverList.find(r => equalsPhoneNumber(phone + '', r.phone));
            if (!rs && phone.length >= 8) {
                rs = (await contactApi.findOneReceiverByPhone(phone)).data;
            }
            return rs;
        }
        getCurrentReceiver().then(contact => {
            setReceiverSelected(contact);
            setMessageReceiver(contact?.isBlacklist ? "Người nhận thuộc danh sách đen" : "")
        });
    }

    const debounceSearchOneReceiver = useCallback(debounce((phone: string) =>
        findCurrentReceiver(phone), 500), []);


    useEffect(() => {
        mcasNationalApi.getAllNationals().then(resp => {
            if (resp.status === 200) {
                setListNation(resp.data)
            }
        });
    }, []);



    const onChangeIsContractC = (e: any) => {
        if (!e.target.checked) {
            props.form.setFieldsValue({
                receiverContractNumber: ''
            })
        }
    }

    const handleSearchReceiver = (phone: string, name: string) => {
        contactApi.findReceiverByPhoneAndName(phone, name)
            .then(resp => {
                setReceiverList(resp.data);
            });
    };

    const debounceSearchReceiver = useCallback(
        debounce((phone: string, name: string) =>
            handleSearchReceiver(phone, name), 300), [])

    const handleSearchPhone = (value: string) => {
        setSearchPhoneValue(value);
        if (value && value.length >= 5) {
            debounceSearchReceiver(value, '');
        }
    };

    const handleSearchName = (value: string) => {
        setSearchNameValue(value);
        if (value && value.length >= 2) {
            const phone = formatStart84(value);
            debounceSearchReceiver(phone, value);
        }
    };

    const onChangeReceiver = (contactId: number) => {
        if (contactId) {
            const receiver = receiverList.find(r => r.contactId == contactId);

            props.form.setFieldsValue({
                receiverPhone: receiver?.phone,
                receiverName: receiver?.name,
                receiverAddress: receiver?.address,
                receiverProvinceCode: receiver?.provinceCode,
                receiverDistrictCode: receiver?.districtCode,
                receiverCommuneCode: receiver?.communeCode
            });
            setReceiverSelected(receiver);
            setMessageReceiver(receiver?.isBlacklist ? "Người nhận thuộc danh sách đen" : "")
        } else {
            props.form.setFieldsValue({
                receiverCode: '',
                receiverName: '',
                receiverAddress: '',
                receiverProvinceCode: '',
                receiverDistrictCode: '',
                receiverCommuneCode: ''
            });
        }
    }


    const setContractNumber = (contract: ContractDto) => {
        if (contract) {
            props.form.setFieldsValue({
                receiverCode: contract.customerCode,
                receiverContractNumber: contract.contractNumber,
                receiverPhone: contract.customerPhone,
                receiverName: contract.customerName,
                receiverAddress: contract.customerAddress,
                receiverProvinceCode: contract.customerProvinceCode,
                receiverDistrictCode: contract.customerDistrictCode,
                receiverCommuneCode: contract.customerCommuneCode,
                receiverPostcode: contract.customerPostCode
            })
            props.setContractServiceCodes(contract.contractServiceCodes || [])
        }
    }
    const filterOption = (value: any, option: any): boolean => {
        console.log(option);
        return option?.value?.includes(value) || option?.children?.toLowerCase().includes(value.toLowerCase())
    }

    const onChangeNation = (value: any, option: any) => {
        setPhoneCode(option.key)
        props.form.setFieldsValue({ phoneCode: option.key })
        setNation(value)


    }

    useEffect(() => {
        if (showInfoModal) {
            props.form.setFieldsValue({ iossNational: nation, vatNational: nation, eoriNational: nation })
        } else {
            props.form.setFieldsValue({ iossNational: undefined, vatNational: undefined, eoriNational: undefined })
        }
    }, [showInfoModal, nation])

    const { Option } = Select;

    return (
        <Card
            className="fadeInRight"
            title="Người nhận"
            bordered={false}
            size="small"
            extra={<Link className='link-outline-warning' to="/setting/receiver-manager" target={'_blank'}>Danh sách người nhận <ArrowRightOutlined /></Link>}
        >
            <Row gutter={14}>
                <Col className='config-height' span={24}>
                    <Form.Item
                        name="receiverName"
                        label="Họ và tên"
                        rules={[{ required: props.required }]}
                        getValueFromEvent={e => capitalizeName(removeAccents(e.target.value))}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col className='config-height' span={24}>
                    <Form.Item
                        label='Quốc gia'
                        name='receiverNational'
                        rules={[{ required: true }]}
                        initialValue={'VN'}
                    >
                        <Select showSearch filterOption={filterOption} onChange={onChangeNation}>
                            {listNation.map((element: McasNationalDto) => {
                                return (
                                    <Option value={element.code} key={element.phoneCode}>{`${element.name} (${element.code})`}</Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col className="config-height" style={{ width: '100%' }}>
                    <Form.Item name="phoneCode" initialValue={phoneCode} hidden />
                    <Form.Item
                        name="receiverPhone"
                        label="Số điện thoại"
                        rules={[{ required: props.required }, patternPhoneIntl]}
                    >
                        <Input addonBefore={phoneCode} />
                    </Form.Item>
                </Col>
                <Col className='config-height' span={24}>
                    <Form.Item
                        label='Địa chỉ chi tiết'
                        name='receiverAddress'
                        rules={[{ required: true }]}
                        getValueFromEvent={e => removeAccents(e.target.value)}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col className='config-height' span={24}>
                    <Form.Item
                        label='Thành phố'
                        name='receiverCity'
                        rules={[{ required: true }]}
                        getValueFromEvent={e => removeAccents(e.target.value)}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col className='config-height' span={24}>
                    <Form.Item
                        label='Bang'
                        name='receiverBang'
                        getValueFromEvent={e => removeAccents(e.target.value)}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col className='config-height' span={24}>
                    <Form.Item
                        label='Mã bưu chính'
                        name='postalCode'
                        rules={[{ required: true }, { pattern: regexPostalCode, message: 'Trường này chứa ký tự không hợp lệ!' }]}
                        tooltip={{ title: 'Trường hợp người nhận không có mã bưu chính yêu cầu nhập 6 chữ số 0' }}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={24} className='config-height'>
                    <a className='link-outline-warning' onClick={() => setShowInfoModal(!showInfoModal)}><i>Thông tin VAT, EORI, IOSS</i> <ArrowRightOutlined /></a>
                </Col>
                <Col span={24}>
                    {showInfoModal &&
                        <InfoModal nation={listNation} filterOption={filterOption} />
                    }
                </Col>
            </Row>
        </Card>

    );
};



type Props = {
    caseTypeId?: number
    form: FormInstance<any>,
    required?: boolean,
    setContractServiceCodes: (contractServiceCodes: ContractServiceCode[]) => void
}
Receiver.defaultProps = {
    required: true
}

export default Receiver;