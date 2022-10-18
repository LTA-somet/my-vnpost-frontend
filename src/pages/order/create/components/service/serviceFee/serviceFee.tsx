import { useMyvnpServiceGroupList } from "@/core/selectors";
import type { MyvnpServiceGroupEntity, OrderBillingDto, OrderHdrDto } from "@/services/client";
import { McasServiceApi } from "@/services/client";
import { OrderBillingDtoPatternEnum, OrderHdrApi } from "@/services/client";
import { formatNumber } from "@/utils";
import { CheckCircleOutlined, ExportOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import { Spin } from "antd";
import { Modal, Button, Space, Collapse, Radio, Form } from "antd";
import { useEffect, useState } from "react";
import { useModel } from "umi";
import { detectFee } from "../../footer/feeHelper";
import './style.css';

type FeeContent = {
    billing: OrderBillingDto[];
    totalFee: number;
    totalFeeReceiver: number;
    totalFeeSender: number;
    feeNode?: React.ReactNode;
    feeReceiverNode?: React.ReactNode;
    priceWeight?: number;
    serviceCode?: string;
};

const orderHdrApi = new OrderHdrApi();
const mcasServiceApi = new McasServiceApi();
const ServiceFee = (props: Props) => {
    const serviceList = props.serviceList;
    const [feeList, setFeeList] = useState<any[]>([]);
    const [feeContent, setFeeContent] = useState<FeeContent[]>([]);
    const serviceGroupList = useMyvnpServiceGroupList();
    const serviceGroupListHas = serviceGroupList.filter(sg => serviceList.some(s => s.myvnpServiceGroupId === sg.serviceGroupId));
    const service = Form.useWatch('serviceCode', props.form);
    const [serviceCode, setServiceCode] = useState(service);
    const [targetProcessList, setTargetProcessList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { vasList, vasExtendList } = useModel('vasList');

    const handleClick = () => {
        props.form.setFieldsValue({ serviceCode })
        console.log(serviceCode);
        props.setIsOpenPopup(false);

    }
    const handleChange = (e: any) => {
        setServiceCode(e.target.value)
    }

    const timeDelivery = (lstService: any[]) => {
        const senderProvinceCode = props.form.getFieldValue('senderProvinceCode')
        const receiverProvinceCode = props.form.getFieldValue('receiverProvinceCode')

        const listDeliveryTime: any[] = [];
        lstService.forEach(element => {
            if (element.mailServiceId && senderProvinceCode && receiverProvinceCode) {
                mcasServiceApi.findTargetProcess(element.mailServiceId, senderProvinceCode, receiverProvinceCode)
                    .then(resp => {
                        if (resp.status === 200) {
                            const tmp = {
                                serviceCode: element.mailServiceId,
                                minimumTime: resp.data.minimumTime,
                                maxTime: resp.data.maxTime
                            }
                            listDeliveryTime.push(tmp)
                        }
                    });

            }

        });

        setTargetProcessList(listDeliveryTime);

    }
    useEffect(() => {
        setIsLoading(true)
        if (props.isOpenPopup) {
            timeDelivery(serviceList)
            if (props.isBatch) {
                console.log(props.feeList);
                orderHdrApi.calculateLstBatchFee(props.feeList)
                    .then(resp => {
                        if (resp.status === 200) {
                            const lstFeeContent: any[] = []
                            resp.data.forEach(element => {
                                if (element.length > 0) {
                                    const lastItemInBatch = element[element.length - 1];
                                    const newFeeContent: any = detectFee(lastItemInBatch, lastItemInBatch.orderBillings, vasList, element);
                                    newFeeContent.serviceCode = lastItemInBatch.serviceCode;
                                    lstFeeContent.push(newFeeContent)
                                }
                            });
                            setFeeContent(lstFeeContent);
                            console.log(props.feeList);
                        }
                    }).finally(() => setIsLoading(false))
            }
            else {
                orderHdrApi.calculateList(props.feeList)
                    .then(resp => {
                        if (resp.status === 200) {
                            const lstFeeContent: any[] = []
                            resp.data.forEach(element => {
                                const newFeeContent: any = detectFee(element, element.orderBillings, vasList);
                                newFeeContent.serviceCode = element.serviceCode;
                                lstFeeContent.push(newFeeContent)
                            });
                            setFeeContent(lstFeeContent);
                            console.log(lstFeeContent);

                        }
                    }).finally(() => setIsLoading(false))
            }

        }
    }, [])
    const { Panel } = Collapse;

    const renderSerViceName = (order: FeeContent) => {

        const objService = serviceList.find(s => s.mailServiceId === order?.serviceCode);
        const billing = order?.billing;
        const feeNotRate = billing?.filter(b => b.pattern !== OrderBillingDtoPatternEnum.Rate);
        const totalFee = feeNotRate?.reduce((a, b: OrderBillingDto) => a + b.fee!, 0);
        const targetProcess = targetProcessList.find(lst => lst.serviceCode === order?.serviceCode);
        const mainFee = billing?.find(b => b.pattern === OrderBillingDtoPatternEnum.Main);

        const vas = billing?.filter(b => b.pattern === OrderBillingDtoPatternEnum.Vas && b.fee !== 0 && !b.isExtend);
        const totalVas = vas?.reduce((a, b: OrderBillingDto) => a + b.fee!, 0);

        const vasExtend = billing?.filter(b => b.pattern === OrderBillingDtoPatternEnum.Vas && b.fee !== 0 && b.isExtend);
        const totalVasExtend = vasExtend?.reduce((a, b: OrderBillingDto) => a + b.fee!, 0);

        return (
            <>
                <Collapse defaultActiveKey={props.form.getFieldValue('serviceCode')} expandIconPosition="right" style={{ backgroundColor: '#fdeecb' }}>

                    {totalFee && <Panel
                        header={
                            // <Radio.Group onChange={handleChange} value={serviceCode} defaultValue={service} >
                            //     <Radio value={objService?.mailServiceId}>
                            <table style={{ width: '100%' }}>
                                <tr style={{ textAlign: 'left' }}>
                                    <th><Radio.Group onChange={handleChange} value={serviceCode} defaultValue={service} >
                                        <Radio value={objService?.mailServiceId} />
                                    </Radio.Group></th>
                                    <th style={{ width: '200px' }}>{objService?.myvnpMailServiceName}:</th>
                                    <th>Thời gian phát dự kiến: {targetProcess?.minimumTime ? `Từ ${targetProcess.minimumTime} đến ${targetProcess.maxTime} ngày, ` : <>, </>} </th>
                                    <th>Tổng cước tạm tính : {totalFee ? formatNumber(totalFee) : ''}  đ</th>
                                </tr>
                            </table>
                            //         {/* <h3 style={{ color: 'black' }}>{objService?.myvnpMailServiceName}:
                            //             <span style={{ color: 'black' }}>Thời gian phát dự kiến: {targetProcess?.minimumTime ? `Từ ${targetProcess.minimumTime} đến ${targetProcess.maxTime} ngày, ` : <>, </>} </span>
                            //             <span style={{ color: 'black' }}>Tổng cước tạm tính: {totalFee} VND</span></h3> */}
                            //     </Radio>
                            // </Radio.Group>
                        }
                        key={objService!?.mailServiceId}
                    >
                        <div>
                            <table id="table-service-fee">
                                <tr >
                                    <th text-align="left">Cước chính</th>
                                    <th>{formatNumber(mainFee?.fee)} đ</th>
                                </tr>
                                <tr >
                                    <th >Tổng cước dịch vụ cộng thêm</th>
                                    <th >{formatNumber(totalVas)} đ</th>
                                </tr>
                                &#9;{vas?.map(va => <tr >
                                    <td>{va.serviceName}</td>
                                    <td >{formatNumber(va.fee)} đ</td>
                                </tr>)}
                                <tr >
                                    <th >Tổng cước yêu cầu bổ sung</th>
                                    <th >{totalVasExtend?.toLocaleString()} đ</th>
                                </tr>
                                &#9;{vasExtend?.map(va => <tr><td>{va.serviceName}</td> <td className="font-medium">{formatNumber(va.fee)} đ</td></tr>)}

                            </table>

                        </div>
                    </Panel >}
                    <div style={{ backgroundColor: 'white' }} />
                </Collapse>
                <br />
            </>
        )
    }

    const renderServiceGroup = (serviceGroup: MyvnpServiceGroupEntity) => {
        return (
            <>
                <div className="card-header"><h3 className="title-od" style={{ fontSize: '14px' }}>{serviceGroup?.serviceGroupName}</h3></div>
                {serviceList.filter(s => s.myvnpServiceGroupId === serviceGroup?.serviceGroupId)
                    .map(s => renderSerViceName(feeContent.find(order => order.serviceCode === s.mailServiceId)!))
                }
                {/* <div className="card" >
                  
                </div> */}
            </>
        )
    }

    return (

        <Modal
            title='Xem chi tiết cước các dịch vụ'
            width={1000}
            style={{ fontSize: '12px', fontWeight: 'normal', color: '#212121' }}
            onCancel={() => props.setIsOpenPopup(false)}
            visible={props.isOpenPopup}
            footer={
                <Space>
                    <Button className='height-btn1 btn-outline-secondary' icon={<ExportOutlined />} onClick={() => props.setIsOpenPopup(false)}>Đóng</Button>
                    <Button className='height-btn1 btn-outline-success' icon={<CheckCircleOutlined />} onClick={handleClick}>Xác nhận</Button>

                </Space>
            }
        >
            <Spin spinning={isLoading}>
                {!isLoading && serviceGroupListHas.map(group => renderServiceGroup(group))}
            </Spin>
        </Modal>
    );


};
type Props = {
    isOpenPopup: boolean;
    setIsOpenPopup: (isOpenPopup: boolean) => void;
    feeList: any[];
    serviceList: any[];
    form: FormInstance<any>;
    isBatch?: boolean;
}

export default ServiceFee;
