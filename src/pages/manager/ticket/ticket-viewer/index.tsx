import React, { useState, useEffect } from 'react';
import { PageContainer } from "@ant-design/pro-layout";
import { Link, useModel, useParams, useHistory } from 'umi';
import { Spin, Card, Form, Input, Select, Upload, Row, Col, Button, Table } from "antd";
import { CheckCircleOutlined, ExportOutlined, UploadOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { isEmpty } from 'lodash';
import { TicketFormDataDto, TicketGroupTypeDto } from '@/services/client';
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const { TextArea } = Input;
const getBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
const { Option } = Select;

const TicketViewer = (props: Props) => {
    const { isLoading, getTicketFormData, ticketFormDataDto, setTicketFormDataDto, creatTicketCMSApi, getTicketGroupTypeDefault,
        lstTicketGroupTypeDefault, setLstTicketGroupType, getTicketSubType,
        lstTicketSubType, lstTicketGroupType } = useModel('ticketModelList');
    const { updateStatusDtl } = useModel('forControlModelList');
    const [form] = Form.useForm();
    const params = props?.history?.location?.state;
    const [itemCodeInput, setItemCodeInput] = useState<string>(params?.itemCode || "");
    const [requestType, setRequestType] = useState<any>();
    const [fileList, setFileList] = useState<any[]>([]);
    const [fileName, setFileName] = useState<string>();
    const [fileBase64, setFileBase64] = useState<any>();
    const [ttkContent, setTTKContent] = useState<string>();
    const history = useHistory();

    const { initialState } = useModel('@@initialState')
    const user = initialState?.accountInfo;

    const itemCode = params?.itemCode || undefined;
    // Yêu cầu tạo từ form đối soát "FORM_CONTROL"
    const collactingDtlId = params?.collactingDtlId || undefined;
    const collactingHdrId = params?.collactingHdrId || undefined;

    useEffect(() => {
        getTicketSubType();
    }, []);

    function formResetFields() {
        form.resetFields();
        setRequestType(undefined);
        // form.setFieldsValue({
        //     itemCodeInput: "",
        //     requestType: "",
        //     requestContent: "",
        //     classify: ""
        // })
    }

    useEffect(() => {
        if (itemCode) {
            getTicketFormData(itemCode, (success: boolean, data: TicketFormDataDto) => {
                if (success == true) {
                    setLstTicketGroupType(data?.listTicketGroupTypeDto || []);
                }
            });
            formResetFields();
        } else {
            getTicketGroupTypeDefault((success: boolean, data: TicketGroupTypeDto[]) => {
                setLstTicketGroupType(data);
            });

            setTicketFormDataDto(undefined);
            formResetFields();
        }
    }, [itemCode]);

    useEffect(() => {
        if (isEmpty(ticketFormDataDto)) {
            console.log("ticketFormDataDto");

            form.setFieldsValue({
                requestType: "",
                requestContent: "",
                classify: ""
            })
        }
    }, [ticketFormDataDto])



    async function getFileBase64(file: any) {
        setFileBase64(await getBase64(file));
    }

    const handleChange = async (f: any, fl: any) => {
        if (f.size > 10485760) {
            setFileName("");
            setFileList([]);
            notification.info({
                message: "Kích thước file vượt quá 10 MB"
            })
        } else {
            setFileName(f?.name);
            setFileList(fl);
            await getFileBase64(f);
        }
    }

    const handleDeleteFile = () => {
        setFileName("");
        setFileList([]);
        setFileBase64("");
    }

    const onChangeInput = (e: any) => {
        console.log("1");

        setItemCodeInput(e?.target?.value);
    }

    const onChangeTextArea = (e: any) => {
        setTTKContent(e.target.value);
    }

    const _handleBluer = () => {
        console.log("_handleBluer", lstTicketGroupTypeDefault);
        if (itemCodeInput) {
            setLstTicketGroupType([]);
            getTicketFormData(itemCodeInput, (success: boolean, data: TicketFormDataDto) => {
                console.log("abcdddđ");
                if (success == true) {
                    console.log("abcd");
                    setLstTicketGroupType(data?.listTicketGroupTypeDto || []);
                }
            });
        } else {
            formResetFields();
            setLstTicketGroupType(lstTicketGroupTypeDefault);
        }
    }
    console.log("setLstTicketGroupType", lstTicketGroupType);


    const onFinish = () => {
        const ticketFormSubmit: any = {};
        ticketFormSubmit.idHdr = ticketFormDataDto?.orderHdrDto?.orderHdrId;
        ticketFormSubmit.ttkContent = ttkContent;
        ticketFormSubmit.fileName = fileName;
        ticketFormSubmit.strFileBase64 = fileBase64 ? fileBase64.split(",")[1] : "";
        let ticketGroupType: any[] = [];
        if (form.getFieldValue("itemCodeInput").length > 0) {
            ticketGroupType = ticketFormDataDto?.listTicketGroupTypeDto || [];
        } else {
            ticketGroupType = lstTicketGroupTypeDefault;
        }
        console.log("ticketGroupBype", ticketGroupType, form.getFieldValue("itemCodeInput").length);

        ticketFormSubmit.ticketGroupTypeDto = ticketGroupType?.find(e => { return e.tkcodeMyvnp == requestType });
        ticketFormSubmit.ticketSubTypeDto = lstTicketSubType.find(e => { return e.subTypeId == form.getFieldValue("subType") })
        creatTicketCMSApi(ticketFormSubmit, (success: boolean) => {
            if (success == true) {
                if (params?.type == "FORM_CONTROL") {
                    //Update trạng thai collating_dtl
                    updateStatusDtl(collactingDtlId, (successDtl: boolean) => {
                        if (successDtl == true) {
                            //Link sang màn hình đối soát
                            history.push('/for-control/detail-control/' + collactingHdrId);
                        }
                    });
                }
                // history.push('/manage/ticket');
                // form.resetFields();
                formResetFields();
                setItemCodeInput("");
                setFileName("");
                setFileList([]);
                setFileBase64("");
                setTicketFormDataDto(undefined);
                history.push('/manage/ticket');
            }
        });
    };
    const onRequestTypeChange = (value: string) => {
        setRequestType(value);
        const newForm = form.getFieldsValue();
        newForm.subType = undefined;
        console.log("newForm", newForm);

        form.setFieldsValue(newForm);
    }
    return (
        <>
            <Spin spinning={isLoading}>
                <div style={{ background: 'white', width: '100%', textAlign: 'center' }}>
                    <div style={{ width: '60%', border: 'none', display: 'inline-block' }}>
                        <Card className="fadeInRight" style={{ border: 'none' }}>
                            <Form {...layout}
                                name="form-ticket-viewer"
                                form={form}
                                onFinish={onFinish}
                                initialValues={{
                                    itemCodeInput: itemCodeInput,
                                    requestType: "",
                                    requestContent: ""
                                }}
                                labelAlign='left'
                                labelCol={{ flex: '160px' }}
                            >
                                <Form.Item
                                    label="Số hiệu bưu gửi"
                                    name="itemCodeInput"
                                // rules={[{ required: true, message: 'Vui lòng nhập số hiệu bưu gửi!' }]}
                                >
                                    <Input
                                        value={itemCodeInput}
                                        onChange={onChangeInput}
                                        onBlur={_handleBluer}
                                        disabled={params?.itemCode ? true : false}
                                    />
                                </Form.Item>
                                {ticketFormDataDto ?
                                    <>
                                        <Row>
                                            <Col span={10} style={{ paddingLeft: '160px', textAlign: 'left' }}>{ticketFormDataDto?.orderHdrDto ? <p>Người nhận:  {ticketFormDataDto?.orderHdrDto?.receiverName}</p> : null}</Col>
                                        </Row>
                                        <Row>
                                            <Col span={10} style={{ paddingLeft: '160px', textAlign: 'left' }}>{ticketFormDataDto?.orderHdrDto ? <p>Trạng thái: {ticketFormDataDto?.orderHdrDto?.status}-{ticketFormDataDto?.orderHdrDto?.statusName}</p> : null}</Col>
                                        </Row>
                                    </>
                                    : null}
                                <Form.Item name="requestType" label="Loại yêu cầu" rules={[{ required: true }]}>
                                    <Select
                                        // value={requestType}
                                        style={{ width: "100%", textAlign: 'left' }}
                                        onChange={(value) => onRequestTypeChange(value)}
                                        allowClear
                                    >
                                        {(lstTicketGroupType).map((option: any) => {
                                            return <Option value={option?.tkcodeMyvnp}> {option?.tknameMyvnp}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="subType" label="Phân loại"
                                    rules={[{ required: requestType != "5" ? true : false }]}
                                >
                                    <Select
                                        style={{ width: "100%", textAlign: 'left' }}
                                        disabled={form.getFieldValue("requestType") != null ? false : true}
                                    >
                                        {lstTicketSubType.filter(item => { return item.ticketTypeId == form.getFieldValue("requestType") }).map((option: any) => {
                                            return <Option key={option?.subTypeId} value={option?.subTypeId}> {option?.subName}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="requestContent" label="Nội dung yêu cầu" rules={[{ required: true }]}>
                                    <TextArea showCount maxLength={1000} style={{ height: '70px' }} onChange={onChangeTextArea} />
                                </Form.Item>
                                <Form.Item name="file" label="Đính kèm" rules={[{ required: false }]}>
                                    <Row gutter={8} style={{ paddingLeft: '0px' }}>
                                        <Col >
                                            <Upload
                                                maxCount={1}
                                                fileList={fileList}
                                                multiple={false}
                                                beforeUpload={handleChange}
                                                onRemove={handleDeleteFile}
                                            // beforeUpload={beforeUpload}
                                            >
                                                <Button size='large' className='height-btn2 btn-outline-info' icon={<UploadOutlined />} >Chọn file</Button>
                                            </Upload>
                                        </Col>
                                        <Col >
                                            <p style={{ fontStyle: 'italic', fontSize: '12', padding: '5px' }}>(Dung lượng tối đa: 10MB)</p>
                                        </Col>
                                    </Row>
                                </Form.Item>
                                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 0 }}
                                    style={{ paddingLeft: '160px', textAlign: 'left' }}
                                >
                                    <Button size='large' icon={<CheckCircleOutlined />} className='height-btn2 btn-outline-success' type="primary"
                                        htmlType="submit"
                                    >
                                        Gửi yêu cầu
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </div>

            </Spin>
        </>
    )
}
type Props = {
    history: any,
}
export default TicketViewer;