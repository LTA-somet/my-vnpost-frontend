import Address from '@/components/Address';
import { patternPhone } from '@/core/contains';
import { ContactApi, ContactDto, ContractApi, ContractDto, ContractServiceCode } from '@/services/client';
import { capitalizeName } from '@/utils';
import { equalsPhoneNumber, formatStart84 } from '@/utils/PhoneUtil';
import { ArrowRightOutlined, EllipsisOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Card, Checkbox, Col, Form, FormInstance, Input, notification, Row } from 'antd';
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useModel } from 'umi';
import ContractC from './ContractC';
import { debounce } from 'lodash';


const contactApi = new ContactApi();
const contractApi = new ContractApi();
const Receiver: React.FC<Props> = (props: Props) => {
    const [messageReceiver, setMessageReceiver] = useState<ReactNode>();
    const [visibleSearchContractC, setVisibleSearchContractC] = useState<boolean>(false);
    const contractNumber = useRef<string>();
    const [searchPhoneValue, setSearchPhoneValue] = useState<string>('');
    const [contractList, setContractList] = useState<ContactDto[]>([]);
    const [receiverSelected, setReceiverSelected] = useState<ContactDto>();
    const [searchNameValue, setSearchNameValue] = useState<string>('');
    const [receiverList, setReceiverList] = useState<ContactDto[]>([]);
    const { caseTypeId, checkDisabledEdit, itemBatchRef } = useModel('orderModel');

    const phoneNumber = Form.useWatch('receiverPhone', props.form);

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
        debounceSearchOneReceiver(phoneNumber);
    }, [phoneNumber]);



    const onChangeIsContractC = (e: any) => {
        if (!e.target.checked) {
            props.form.setFieldsValue({
                receiverCode: '',
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

    const openSearchContractModal = () => {
        setVisibleSearchContractC(true);
        contractNumber.current = props.form.getFieldValue('receiverContractNumber');
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
            setContractList([])
        }
    }

    const onSearchContract = (contractNumberSearch: string) => {
        if (contractNumberSearch) {
            contractApi.findReceiverContractAccept(contractNumberSearch, '')
                .then(resp => {
                    if (resp.status === 200) {
                        if (resp.data.length === 0) {
                            notification.error({ message: 'Không tìm thấy số hợp đồng' });
                            props.form.setFieldsValue({ receiverContractNumber: '' });
                        } else if (resp.data.length === 1) {
                            setContractNumber(resp.data[0])
                        } else {
                            contractNumber.current = contractNumberSearch;
                            setContractList(resp.data);
                            setVisibleSearchContractC(true);
                        }
                    }
                })
        }
    }

    // const onCheckBlacklist = () => {
    //     const phoneNumberCheck = formatStart84(props.form.getFieldValue('receiverPhone'));
    //     const hasInBlacklist: boolean = receiverList.filter(r => r.phone === phoneNumberCheck).some(r => r.isBlacklist);
    //     setMessageReceiver(hasInBlacklist ? "Người nhận thuộc danh sách đen" : "")
    // }

    const disabledEdit = useMemo(() => checkDisabledEdit([5, 6, 7]), [caseTypeId]);


    if (props.compact) {
        const fullInfoReceiver = `${itemBatchRef?.receiverName}  ${itemBatchRef?.receiverPhone} - ${itemBatchRef?.receiverAddress}`;
        return (
            <Card
                className="fadeInRight"
                title="Người nhận"
                bordered={false}
                size="small"
                extra={<Link className='link-outline-warning' to="/setting/receiver-manager" target={'_blank'}>Danh sách người nhận <ArrowRightOutlined /></Link>}
            >
                <Row gutter={14}>
                    <Col span={24}></Col>
                    <Row>
                        <Col>
                            <Form.Item
                                name="receiverContractNumber"
                                label=""
                            >
                                <Input.Search
                                    disabled={true}
                                    placeholder='Nhập số hợp đồng C'
                                    maxLength={50}
                                    value={itemBatchRef?.receiverContractNumber}
                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                name="fullInfo"
                                label=""
                                hidden
                            >
                                <Input value={fullInfoReceiver} disabled={true} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Row>
            </Card>
        )
    }

    return (
        <Card
            className="fadeInRight"
            title="Người nhận"
            bordered={false}
            size="small"
            extra={<Link className='link-outline-warning' to="/setting/receiver-manager" target={'_blank'}>Danh sách người nhận <ArrowRightOutlined /></Link>}
        >
            <Row gutter={14}>
                <Col span={24}>
                    <Row>
                        <Form.Item
                            name="receiverCode"
                            label=""
                            hidden
                        >
                            <Input />
                        </Form.Item>

                        <Input.Group className="config-height" compact>
                            <Col style={{ width: 'calc(120px + 30px)' }}>
                                <Form.Item
                                    noStyle
                                    shouldUpdate={(prevValues, currentValues) => prevValues.senderContractNumber !== currentValues.senderContractNumber
                                    }
                                >
                                    {({ getFieldValue }) =>
                                    (
                                        <Form.Item
                                            name="isContractC"
                                            label="Hợp đồng C"
                                            valuePropName='checked'
                                            tooltip={{ title: 'Hợp đồng thu cước nơi người nhận' }}
                                        >
                                            <Checkbox disabled={getFieldValue('senderContractNumber') && !getFieldValue('isContractC') || caseTypeId !== undefined} onChange={onChangeIsContractC} />
                                        </Form.Item>
                                    )
                                    }
                                </Form.Item>
                            </Col>
                            <Col className="config-height" style={{ width: 'calc(100% - (120px + 30px + 40px))' }}>
                                <Form.Item
                                    noStyle
                                    shouldUpdate={(prevValues, currentValues) => prevValues.isContractC !== currentValues.isContractC
                                        || prevValues.senderContractNumber !== currentValues.senderContractNumber
                                    }
                                >
                                    {({ getFieldValue }) =>
                                    (
                                        <Form.Item
                                            name="receiverContractNumber"
                                            label=""
                                            rules={[{ required: (props.required && getFieldValue('isContractC') === true), message: 'Số hợp đồng C là bắt buộc' }]}
                                        >
                                            <Input.Search
                                                disabled={getFieldValue('isContractC') !== true || getFieldValue('senderContractNumber') || caseTypeId !== undefined}
                                                placeholder='Nhập số hợp đồng C'
                                                maxLength={50}
                                                onSearch={onSearchContract}
                                            />
                                        </Form.Item>
                                    )
                                    }
                                </Form.Item>
                            </Col>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.isContractC !== currentValues.isContractC
                                    || prevValues.senderContractNumber !== currentValues.senderContractNumber
                                }
                            >
                                {({ getFieldValue }) =>
                                (
                                    <Col style={{ width: '30px' }}>
                                        <Button className='btn-outline-info' disabled={getFieldValue('isContractC') !== true || getFieldValue('senderContractNumber')}
                                            style={{ width: '40px', marginLeft: 1 }} icon={<EllipsisOutlined />} onClick={openSearchContractModal} />
                                    </Col>
                                )
                                }
                            </Form.Item>
                        </Input.Group>
                    </Row>
                </Col>
                <Col className="config-height" style={{ width: 'calc(100% - 120px )' }}>
                    <Form.Item
                        name="receiverPhone"
                        label="Số điện thoại"
                        rules={[{ required: props.required }, patternPhone]}
                    >
                        <AutoComplete
                            onSearch={handleSearchPhone}
                            onSelect={onChangeReceiver}
                            disabled={disabledEdit}

                        >
                            {searchPhoneValue.length >= 5 && receiverList.map((contact: ContactDto) => (
                                <AutoComplete.Option key={contact.contactId} value={contact.contactId}>
                                    <p style={{ margin: 0 }}>{contact.name} - {contact.phone}</p>
                                    <p style={{ fontStyle: 'italic', fontWeight: 300, fontSize: 13, margin: 0, color: 'grey' }} >{contact.address}</p>
                                </AutoComplete.Option>
                            ))}
                        </AutoComplete>
                    </Form.Item>
                </Col>

                <Col style={{ width: '120px', paddingTop: 5, textAlign: 'center' }}>
                    <b>{receiverSelected?.totalOrders ?? 0} (<span style={{ color: 'green' }}>{(receiverSelected?.totalOrders || 0) - (receiverSelected?.failOrders || 0)}</span> / <span style={{ color: 'red' }}>{receiverSelected?.failOrders || 0}</span>)</b>
                </Col>
                <Col className='config-height' span={24}>
                    <Form.Item
                        name="receiverName"
                        label="Tên người nhận"
                        rules={[{ required: props.required }]}
                        {...messageReceiver ? { help: messageReceiver } : {}}
                        hasFeedback
                        validateStatus={messageReceiver ? "error" : "success"}
                        getValueFromEvent={e => capitalizeName(e + '')}
                    >
                        <AutoComplete
                            maxTagTextLength={255}
                            onSearch={handleSearchName}
                            onSelect={onChangeReceiver}
                            disabled={disabledEdit}
                        >
                            {searchNameValue.length >= 2 && receiverList.map((contact: ContactDto) => (
                                <AutoComplete.Option key={contact.contactId} value={contact.contactId}>
                                    <p style={{ margin: 0 }}>{contact.name} - {contact.phone}</p>
                                    <p style={{ fontStyle: 'italic', fontWeight: 300, fontSize: 13, margin: 0, color: 'grey' }} >{contact.address}</p>
                                </AutoComplete.Option>
                            ))}
                        </AutoComplete>
                    </Form.Item>
                </Col>
                <Address
                    disabled={disabledEdit}
                    form={props.form}
                    required={props.required}
                    addressField='receiverAddress'
                    provinceField='receiverProvinceCode'
                    districtField='receiverDistrictCode'
                    communeField='receiverCommuneCode'
                    isCheckQuarantine
                    showOnlyAddressLabel
                    requiredCommune={!caseTypeId}
                />
            </Row>
            <ContractC
                visible={visibleSearchContractC}
                getData={setContractNumber}
                setVisible={setVisibleSearchContractC}
                contractNumberInit={contractNumber.current}
                contractList={contractList}
            />
        </Card>

    );
};



type Props = {
    form: FormInstance<any>,
    required?: boolean,
    setContractServiceCodes: (contractServiceCodes: ContractServiceCode[]) => void,
    compact?: boolean // chế độ rút gọn
}
Receiver.defaultProps = {
    required: true,
    compact: false
}

export default Receiver;