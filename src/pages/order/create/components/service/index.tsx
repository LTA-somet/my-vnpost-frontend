import { useMyvnpServiceGroupList, usePostTypeList, useServiceList } from '@/core/selectors';
import { ContractServiceCode, OrderHdrDto, RouteServiceApi, SameValueGroup, VaDto } from '@/services/client';
import { checkValidateVaService, validateBillingFormOrder } from '@/utils/orderHelper';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, FormInstance, notification, Radio, Row, Select, Spin } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import ServiceFee from './serviceFee/serviceFee';
import VasService from './vas';

const routeServiceApi = new RouteServiceApi();
const Service: React.FC<Props> = (props: Props) => {
    const allServiceList = useServiceList();
    const serviceGroupList = useMyvnpServiceGroupList();
    const { vasList, isLoadingVas, onChangeServiceCode } = useModel('vasList');
    const { serviceListAppend, setServiceListAppend, caseTypeId, checkDisabledEdit, onSetItemBatchRef, getBatchFinalAndValidate, onFocusBatchInfo } = useModel('orderModel');
    const [showServiceFee, setShowServiceFee] = useState<boolean>(false);
    const [feeList, setFeeList] = useState<any[]>([]);
    const [serviceSameValue, setServiceSameValue] = useState<SameValueGroup>();

    const serviceCode = Form.useWatch('serviceCode', props.form);
    const senderContractNumber = Form.useWatch('senderContractNumber', props.form);
    const receiverContractNumber = Form.useWatch('receiverContractNumber', props.form);
    const orgCodeAccept = Form.useWatch('orgCodeAccept', props.form);
    const senderDistrictCode = Form.useWatch('senderDistrictCode', props.form);
    const postType = Form.useWatch('postType', props.form)
    const postTypeList = usePostTypeList();

    // filter sản phẩm dịch vụ
    const filterService = (iContractServiceCodes: ContractServiceCode[], iSenderContractNumber: string, iReceiverContractNumber: string) => {

        let newServiceList = allServiceList.filter(s => s.scope === (props.isInternational ? "2" : "1"));

        const contractNumber = iSenderContractNumber || iReceiverContractNumber;

        // lọc theo hợp đồng sử dụng
        if (contractNumber) {
            newServiceList = newServiceList.filter(s => iContractServiceCodes.some(c => c.csc === s.mailServiceId));
        } else {
            newServiceList = newServiceList.filter(s => s.isRetailCustomer);
        }

        setServiceListAppend(newServiceList)
    }
    const debounceFilterServiceCode = useCallback(
        debounce((iContractServiceCodes: ContractServiceCode[], iSenderContractNumber: string, iReceiverContractNumber: string) =>
            filterService(iContractServiceCodes, iSenderContractNumber, iReceiverContractNumber), 500), [])

    useEffect(() => {
        // lọc theo trong nước, quốc tế
        debounceFilterServiceCode(props.contractServiceCodes, senderContractNumber, receiverContractNumber);
    }, [props.contractServiceCodes, senderContractNumber, receiverContractNumber]);

    // tìm kiếm DV đồng giá
    const findServiceSameValue = (iOrgCodeAccept: string, iSenderContractNumber: string, iReceiverContractNumber: string, iSenderDistrictCode: string) => {
        const contractNumber = iSenderContractNumber || iReceiverContractNumber;
        if (contractNumber && (iOrgCodeAccept || iSenderDistrictCode)) {
            routeServiceApi.findServiceSameValue(contractNumber, iOrgCodeAccept, iSenderDistrictCode).then(resp => setServiceSameValue(resp.data));
        } else {
            setServiceSameValue(undefined)
        }
    }
    const debounceFindServiceSameValue = useCallback(
        debounce((iOrgCodeAccept: string, iSenderContractNumber: string, iReceiverContractNumber: string, iSenderDistrictCode: string) =>
            findServiceSameValue(iOrgCodeAccept, iSenderContractNumber, iReceiverContractNumber, iSenderDistrictCode), 500), [])
    useEffect(() => {
        // lọc theo trong nước, quốc tế
        debounceFindServiceSameValue(orgCodeAccept, senderContractNumber, receiverContractNumber, senderDistrictCode);
    }, [orgCodeAccept, senderContractNumber, receiverContractNumber, senderDistrictCode]);


    useEffect(() => {
        onChangeServiceCode(serviceCode)
    }, [serviceCode]);

    const handleServiceFee = () => {
        props.form.validateFields()
            .then(formValue => {
                if (formValue.collectionDate) {
                    formValue.collectionDate = formValue.collectionDate?.format?.('DD/MM/YYYY HH:mm:ss')
                }
                const listFormValue: any[] = [];
                serviceListAppend.forEach(element => {
                    listFormValue.push({ ...formValue, serviceCode: element.mailServiceId })

                });
                setFeeList(listFormValue)
                setShowServiceFee(!showServiceFee)
            });

    }

    const handleServiceFeeBatch = async () => {
        try {
            const formValue = await props.form.validateFields();
            const itemBatchRef = validateBillingFormOrder(formValue, serviceListAppend, props.contractServiceCodes, false, vasList);
            const batchFinal = await getBatchFinalAndValidate(itemBatchRef);
            const batchList: any[] = []
            onSetItemBatchRef(itemBatchRef);

            serviceListAppend.forEach(element => {
                const batch = JSON.parse(JSON.stringify(batchFinal));
                batch.forEach((b: any) => {
                    b.serviceCode = element.mailServiceId;
                })
                batchList.push(batch);
            }
            );
            console.log(batchList);

            setFeeList(batchList)
            setShowServiceFee(!showServiceFee)
        } catch (e) {
            onFocusBatchInfo();
        };
    }

    const checkValidate = (_: any, newValues: VaDto[] = []) => {
        return checkValidateVaService(newValues, vasList, false);
    };

    const renderServiceCodeField = useMemo(() => {
        let serviceListAppendHas = [...serviceListAppend];
        if (caseTypeId) {
            const service = serviceListAppend.find(s => s.mailServiceId === serviceCode);
            serviceListAppendHas = serviceListAppend.filter(s => s.serviceType === service?.serviceType);
        }
        if (props.isInternational) {
            serviceListAppendHas = serviceListAppend.filter(s => s.type === postType);
        }

        const serviceGroupListHas = serviceGroupList.filter(sg => serviceListAppendHas.some(s => s.myvnpServiceGroupId === sg.serviceGroupId));

        return serviceGroupListHas.map(sg => (
            <Select.OptGroup key={sg.serviceGroupId} label={sg.serviceGroupName}>
                {serviceListAppendHas.filter(s => s.myvnpServiceGroupId === sg.serviceGroupId)
                    .map(s => (<Select.Option key={s.mailServiceId} value={s.mailServiceId}>{s.myvnpMailServiceName || s.mailServiceName}</Select.Option>))}
            </Select.OptGroup>))
    }, [serviceListAppend, postType]);

    const renderServiceSameValue = useMemo(() => {
        return (<Select.OptGroup key={serviceSameValue?.code} label={serviceSameValue?.name}>
            {serviceSameValue?.items?.map(item => (<Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>))}
        </Select.OptGroup>)
    }, [serviceSameValue]);

    const disabledEdit = useMemo(() => checkDisabledEdit([4, 5, 6, 7]), [caseTypeId]);

    return (
        <Card
            className="fadeInRight"
            title="Chọn dịch vụ"
            bordered={false}
            size="small"
            extra={<Button className='btn btn-outline-info' icon={<EyeOutlined />} onClick={props.isBatch ? handleServiceFeeBatch : handleServiceFee} disabled={caseTypeId !== undefined}>Xem cước các dịch vụ</Button>}
        >
            <Row gutter={14}>
                {props.isInternational &&
                    <Col className='config-height' span={24}>
                        <Form.Item
                            label='Loại bưu gửi'
                            name='postType'
                            initialValue={'TL'}
                        >
                            <Radio.Group>
                                <Radio value={'TL'}>Tài liệu</Radio>
                                <Radio value={'HH'}>Hàng hoá</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                }
                <Col className='config-height' span={24} >
                    {serviceSameValue ? <Form.Item
                        name="serviceSameValue"
                        label="Tên DV Đồng giá"
                        // label={<span style={{ marginTop: '15%' }}>Dịch vụ<p>chuyển phát</p></span>}
                        rules={[{ required: props.required, message: 'Dịch vụ chuyển phát là bắt buộc' }]}
                    >
                        <Select disabled={disabledEdit}>
                            {renderServiceSameValue}
                        </Select>
                    </Form.Item> :
                        <Form.Item
                            name="serviceCode"
                            label="Tên SPDV"
                            // label={<span style={{ marginTop: '15%' }}>Dịch vụ<p>chuyển phát</p></span>}
                            rules={[{ required: props.required, message: 'Dịch vụ chuyển phát là bắt buộc' }]}
                        >
                            <Select disabled={disabledEdit}>
                                {renderServiceCodeField}
                            </Select>
                        </Form.Item>
                    }
                </Col>

                <div style={{ width: '100%', height: '100%' }}>
                    <Spin spinning={isLoadingVas}>
                        <Col span={24}>
                            <Form.Item
                                name="vas"
                                label=""
                                rules={[{ validator: checkValidate }]}
                            >
                                <VasService vasCaseTypeId={caseTypeId} vasList={vasList} form={props.form} />
                            </Form.Item>
                        </Col>
                    </Spin>
                </div >
                {props.isInternational &&
                    <Col span={24}>
                        <Form.Item name="sendType" label="Hình thức gửi hàng" rules={[{ required: props.required }]} labelCol={{ flex: '155px' }} initialValue={'1'}>
                            <Radio.Group disabled={disabledEdit}>
                                {postTypeList.map(item => <Radio className='span-font' key={item.id} value={item.value}>{item.name}</Radio>)}
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                }
                {/* {props.isBatch && <Col className='config-height' span={24}>
                    <Form.Item
                        label='Thu hộ theo lô'
                        name='amountForBatch'
                        valuePropName='checked'
                    >
                        <Checkbox />
                    </Form.Item>
                </Col>} */}
            </Row >
            {showServiceFee && <ServiceFee
                isOpenPopup={showServiceFee}
                setIsOpenPopup={setShowServiceFee}
                feeList={feeList}
                serviceList={serviceListAppend}
                form={props.form}
                isBatch={props.isBatch}
            />}
        </Card >

    );
};
type Props = {
    form: FormInstance<any>,
    required?: boolean,
    isInternational?: boolean,
    contractServiceCodes: ContractServiceCode[],
    isBatch?: boolean
}
Service.defaultProps = {
    required: true,
    isInternational: false,
    isBatch: false
}
export default Service;