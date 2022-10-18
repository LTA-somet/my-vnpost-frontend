import Address from '@/components/Address';
import { ContactDto, ContractServiceCode } from '@/services/client';
import { dataToSelectBox, equalsText } from '@/utils';
import { setDefaultContract } from '@/utils/orderHelper';
import { ArrowRightOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, FormInstance, Input, Row, Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useModel } from 'umi';
import EditFormSender from './edit-sender';
import * as PhoneUtil from '@/utils/PhoneUtil';

const Sender: React.FC<Props> = (props: Props) => {
    // const [senderList, setSenderList] = useState<ContactDto[]>([]);
    const { senderListActual, findAllSender, addSender, editSender, findSenderContract, contractList, checkDisabledEdit, caseTypeId } = useModel('orderModel');
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [recordEdit, setRecordEdit] = useState<ContactDto>();

    const senderContractNumber = Form.useWatch('senderContractNumber', props.form);

    useEffect(() => {
        if (senderContractNumber) {
            const contract = contractList.find(c => c.contractNumber === senderContractNumber);
            props.setContractServiceCodes(contract?.contractServiceCodes || [])
        } else {
            props.setContractServiceCodes([])
        }
    }, [senderContractNumber, contractList]);

    // const onSetDefaultSender = () => {
    //     if (!props.isHasOrderTemplate && !props.orderHdrId) {
    //         // nếu là thêm mới và không có đơn hàng mẫu mặc định => lấy sender mặc định
    //         setDefaultSender(props.form);
    //     }
    // }

    useEffect(() => {
        // if (!isLoadedInitSenderList) {
        findAllSender();
        findSenderContract();
        // }
    }, []);

    // set thông tin sender
    const setFormSender = (sender: any) => {
        props.form.setFieldsValue(
            {
                ...sender,
                senderCode: sender?.contactId,
                senderPhone: sender?.phone,
                senderName: sender?.name,
                senderAddress: sender?.address,
                senderProvinceCode: sender?.provinceCode,
                senderDistrictCode: sender?.districtCode,
                senderCommuneCode: sender?.communeCode,
            }
        )
    }



    // useEffect(() => {
    //     if (!props.isHasOrderTemplate && !props.orderHdrId) {
    //         // nếu là thêm mới và không có đơn hàng mẫu mặc định => lấy sender mặc định
    //         setDefaultSender(props.form);
    //     }
    // }, [senderList.length]);


    useEffect(() => {
        if (!props.isHasOrderTemplate && !props.orderHdrId && !props.isOrderTemplate) {
            // nếu là thêm mới và không có đơn hàng mẫu mặc định => mặc định hợp đầu tiên trong danh sách
            setDefaultContract(props.form, contractList, props.setContractServiceCodes);
        }
    }, [contractList])

    // action khi lưu thông tin ở popup sửa thông tin người gửi
    const onEditSender = (senderInfo: any) => {
        if (recordEdit && recordEdit.contactId) {
            // sửa
            editSender(recordEdit, senderInfo);
        } else {
            // thêm mới
            addSender(senderInfo);
            props.form.setFieldsValue({ senderId: -1 })
        }
        setFormSender({ ...senderInfo, isDefaultSender: senderInfo.isDefault });
        setShowEdit(false);
    }

    // bấm vào nút sửa người gửi
    const handleEditSender = () => {
        const senderId = props.form.getFieldValue("senderId");
        if (!senderId) {
            setRecordEdit(undefined);
        } else {

            const sender = senderListActual.find(r => r.contactId === senderId);
            setRecordEdit(sender);
        }
        //Bật popup sửa người gửi sau khi bấm button
        setShowEdit(true);
    }

    // thay đổi người gửi ở selectbox
    const onChangeSender = (senderId: number) => {
        if (!senderId) {
            props.form.setFieldsValue(
                {
                    senderCode: '', senderName: '', senderAddress: '', senderEmail: '',
                    senderProvinceCode: '', senderDistrictCode: '', senderCommuneCode: '',
                    isSaveSender: false, isDefaultSender: false
                }
            )
        } else {
            const sender = senderListActual.find(r => r.contactId === senderId);
            setFormSender(sender);
        }
    }

    // thay đổi hợp đồng người gửi
    // const onChangeSenderContractNumber = (contractNumber?: string) => {
    //     if (contractNumber) {
    //         const contract = contractList.find(c => c.contractNumber === contractNumber);
    //         props.setContractServiceCodes(contract?.contractServiceCodes || [])
    //     } else {
    //         props.setContractServiceCodes([])
    //     }
    // }

    const filterOption = (value: any, option: any): boolean => {
        const phoneStartZero = PhoneUtil.formatNoStart(value);
        const phoneStart84 = PhoneUtil.formatStart84(value);

        return equalsText(option.label, value) || equalsText(option.label, phoneStartZero) || equalsText(option.label, phoneStart84);
    }

    const disabledEdit = useMemo(() => checkDisabledEdit([2, 4, 5, 6, 7]), [caseTypeId]);

    return (
        <Card

            className="fadeInRight"
            title="Người gửi"
            bordered={false}
            size="small"
            extra={<Link className='link-outline-warning' to="/setting/sender-manager" target={'_blank'} >Danh sách người gửi <ArrowRightOutlined /></Link>}
        >
            <Row gutter={14} >
                <Col span={props.span}>
                    <Row>
                        {/* <Input.Group compact> */}
                        <Col className="config-height" style={{ width: 'calc(100% - 40px)' }}>
                            <Form.Item
                                name="senderId"
                                label="Người gửi"
                                rules={[{ required: props.required }]}
                            >
                                <Select allowClear onChange={onChangeSender} showSearch filterOption={filterOption} disabled={disabledEdit}>
                                    {senderListActual.map(record => (
                                        <Select.Option key={record.contactId} value={record.contactId} label={record.name + '-' + record.phone}>
                                            <>
                                                <p style={{ margin: 0 }}>{record.name} - {record.phone}</p>
                                                <p style={{ fontStyle: 'italic', fontWeight: 300, fontSize: 13, margin: 0, color: 'grey' }} >{record.address}</p>
                                            </>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="config-height">
                            <Button className='btn-outline-info' style={{ width: '40px' }} icon={<EditOutlined />} onClick={handleEditSender} disabled={disabledEdit} />
                        </Col>
                        {/* </Input.Group> */}
                    </Row>
                </Col>
                <Col span={props.span}>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.isContractC !== currentValues.isContractC
                            || prevValues.receiverContractNumber !== currentValues.receiverContractNumber
                        }
                    >
                        {({ getFieldValue }) =>
                        (
                            <Form.Item
                                name="senderContractNumber"
                                label="Hợp đồng"
                            >
                                <Select style={{ width: '100%' }}
                                    disabled={((getFieldValue('isContractC') === true || getFieldValue('receiverContractNumber')) && !getFieldValue('senderContractNumber')) || caseTypeId !== undefined}
                                    allowClear
                                    showSearch
                                    filterOption={filterOption}
                                >
                                    {dataToSelectBox(contractList, 'contractNumber', ['contractNumber', 'contractName', 'contractSignDate'])}
                                </Select>
                            </Form.Item>
                        )
                        }
                    </Form.Item>
                </Col>
                <Col hidden span={props.span}>
                    <Form.Item
                        name="orgCodeAccept"
                        label="Bưu cục phục vụ"
                        hidden
                        noStyle
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="senderPhone"
                        label="Số điện thoại người gửi"
                        rules={[{ required: props.required }]}
                        hidden
                        noStyle
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="senderEmail"
                        label="Email người gửi"
                        hidden
                        noStyle
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="senderName"
                        rules={[{ required: props.required }]}
                        label="Tên người gửi"
                        hidden
                        noStyle
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="senderAddress"
                        label="Địa chỉ người gửi"
                        rules={[{ required: props.required }]}
                        hidden
                        noStyle
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="senderProvinceCode"
                        label="Tỉnh/TP người gửi"
                        rules={[{ required: props.required }]}
                        hidden
                        noStyle
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="senderDistrictCode"
                        label="Quận/Huyện người gửi"
                        rules={[{ required: props.required }]}
                        hidden
                        noStyle
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="senderCommuneCode"
                        label="Phường/xã người gửi"
                        // rules={[{ required: (props.required && !props.caseTypeId) }]}
                        hidden
                        noStyle
                    >
                        <Input />
                    </Form.Item>
                    {/* Có lưu thông tin người gửi hay k  */}
                    <Form.Item
                        name="isSaveSender"
                        valuePropName='checked'
                        hidden
                        noStyle
                    >
                        <Checkbox style={{ padding: "10px" }} >
                            Thêm mới người gửi vào danh sách
                        </Checkbox>
                    </Form.Item>
                    <Form.Item
                        name="configPrintOrder"
                        label="Cấu hình in đơn hàng"
                        initialValue="1"
                        hidden
                        noStyle
                    >
                        <Input />
                    </Form.Item>
                    {/* Thông tin trên mẫu in  */}
                    <Form.Item
                        name="namePrinted"
                        label="Họ và tên in"
                        hidden
                        noStyle
                    >
                        <Input maxLength={50} />
                    </Form.Item>
                    <Form.Item
                        name="phonePrinted"
                        label="Số điện thoại in"
                        hidden
                        noStyle
                    >
                        <Input maxLength={50} />
                    </Form.Item>
                    <Address form={props.form} xs={24} md={12} lg={8}
                        addressName='Địa chỉ in' addressField='addressPrinted'
                        provinceName='Tỉnh/thành phố in' provinceField='provinceCodePrinted'
                        districtName='Quận/huyện in' districtField='districtCodePrinted'
                        communeName='Phường/xã in' communeField='communeCodePrinted'
                        required={false}
                        hidden={true}
                        noStyle={true}
                    />
                </Col>
                {props.footer}
            </Row >
            <EditFormSender
                visible={showEdit}
                setVisible={setShowEdit}
                onEditSender={onEditSender}
                record={recordEdit}
                isSaving={false}
                isView={false}
                isSaveSender={false}
            />
        </Card >
    );
};
type Props = {
    form: FormInstance<any>,
    required?: boolean,
    span?: number,
    footer?: React.ReactNode,
    setContractServiceCodes: (contractServiceCodes: ContractServiceCode[]) => void,
    orderHdrId?: string,
    isHasOrderTemplate: boolean,
    isOrderTemplate?: boolean,
    isInternational?: boolean
}
Sender.defaultProps = {
    required: true,
    span: 24
}
export default Sender;