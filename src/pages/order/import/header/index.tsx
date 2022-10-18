import { validateMessages } from '@/core/contains';
import { UploadOutlined, ExclamationCircleOutlined, CloudDownloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Modal, notification, Row, Upload } from 'antd';
import { useState } from 'react';
import Sender from '../../create/components/sender';
import { useModel } from 'umi';
import { ContractServiceCode } from '@/services/client';
import { validateSender } from '@/utils/orderHelper';

const ImportHeader = ({ setTabIndex }) => {
    const [file, setFile] = useState<any>();
    const [fileName, setFileName] = useState<string>();
    const [form] = Form.useForm();
    const { importOrder, orderHdrList } = useModel('importModel');
    const [contractServiceCodes, setContractServiceCodes] = useState<ContractServiceCode[]>([]);

    const beforeUpload = (f: any) => {
        setFile(f)
        setFileName(f.name)
        return false;
    }

    const onImport = () => {
        if (!file) {
            notification.error({ message: 'File là bắt buộc' });
            return;
        }
        const actionImport = () => {
            form.validateFields()
                .then(formValue => {
                    let orderHdr = { ...formValue, contractServiceCodes }
                    orderHdr = validateSender(orderHdr);
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('info', JSON.stringify(orderHdr
                    ));

                    importOrder(formData, (success) => {
                        if (success) {
                            form.resetFields();
                            setFile(undefined);
                            setFileName(undefined);
                            setTabIndex(-1);
                        }
                    });
                }).catch(e => {
                    e?.errorFields?.forEach((element: any) => {
                        element?.errors?.forEach((err: any) => {
                            notification.error({ message: err });
                            return;
                        })
                    });
                });
        }
        if (orderHdrList.length > 0) {
            Modal.confirm({
                title: 'Nhận dữ liệu file Excel',
                icon: <ExclamationCircleOutlined />,
                content: 'Bạn chưa xử lý các đơn vừa import. Bạn muốn import lại và xóa các dữ liệu cũ?',
                okText: 'Đồng ý',
                cancelText: 'Đóng',
                onOk() {
                    actionImport();
                }
            });
        } else {
            actionImport();
        }
    }

    return (
        <>
            <Col span={12}>
                <Card className="fadeInRight" size='default' bordered={false}>
                    <Row>
                        <Col flex='auto'>
                            <span className='span-font'>Để bắt đầu, Quý khách hàng tải file tạo đơn hàng mẫu</span>
                            <br />
                            <span className='span-font'>(Office 2007 hoặc cao hơn)</span>
                        </Col>
                        <Col flex="100px">
                            <a style={{ borderColor: 'none', height: '40px' }} href={'/files/MyVNPOST_Import_DonHang_v0.1.xlsx'}
                                // className="ant-btn"
                                className='ant-btn btn-outline-info'
                                // style={{ width: "250px" }}
                                target={'_blank'} > <span style={{ marginTop: '5px' }}><CloudDownloadOutlined /> Tải file mẫu</span> </a>
                        </Col>
                    </Row>
                </Card>

                <Card className="fadeInRight" size='default' bordered={false}>
                    {/* style={{ height: '169px' }} */}
                    <Row>
                        <Col flex='auto'>
                            <span className='span-font'>Lựa chọn file import</span>
                            <br />
                            <span className='span-font'>(Hỗ trợ tối đa 2000 đơn hàng)</span>
                        </Col>
                        <Col flex="1px 100px" style={{ textAlign: 'right' }}>
                            {fileName && <div style={{ marginBottom: 10 }}><b>{fileName}</b></div>}
                            <Upload
                                maxCount={1}
                                multiple={false}
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                accept="xls,.xlsx"
                            >
                                <Button style={{ width: "123px" }} size='large' className='btn btn-outline-info' icon={<UploadOutlined />}>{file ? 'Thay đổi file' : 'Chọn file'}</Button>
                            </Upload>
                        </Col>
                    </Row>
                    <br />
                    <p className='span-font'>Trường hợp phát sinh cước hệ thống sai khác cước hợp đồng, đề nghị liên hệ bưu cục phục vụ để kiểm tra xử lý</p>
                </Card>
            </Col>
            <Col span={12}>
                <Card title="Video hướng dẫn tạo vận đơn Excel" className="fadeInRight" size='small' bordered={false}>
                    <iframe width="100%" height="100%"
                        src="https://www.youtube.com/embed/a0yMQZ0PSTA"
                        title="YouTube video player" frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </Card>
            </Col>
            <Col span={24}>
                <Form
                    labelCol={{ flex: '120px' }}
                    labelAlign="left"
                    labelWrap
                    colon={false}
                    form={form}
                    validateMessages={validateMessages}
                >
                    <Sender form={form} span={12}
                        footer={<Col span={24} style={{ textAlign: 'right' }}>
                            <Button size='large' icon={<DownloadOutlined />} className='btn btn-outline-info' onClick={onImport}> Kiểm tra dữ liệu </Button>
                        </Col>}
                        setContractServiceCodes={setContractServiceCodes}
                        isHasOrderTemplate={false}
                    />
                </Form>
            </Col>


        </>
    );
};

export default ImportHeader;