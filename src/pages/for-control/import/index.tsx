import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { PageContainer } from "@ant-design/pro-layout";
import { Spin, Card, DatePicker, Form, Input, Select, Upload, Row, Col, Button, Table, message, Space, Modal } from "antd";
import { notification } from 'antd';
import { UploadOutlined, DownloadOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Columns } from './column';

const ImportForControl = () => {
    const { dataUploadFileReturn, setDataUploadFileReturn, isLoading, onImportCollating, getOnUploadFile, checkDuplicateDataModel, deleteDataDuplicateModel } = useModel("forControlModelList");
    const [fileListRequest, setFileList] = useState<any>();

    const handleChange = (file: any, fileList: any[]) => {
        if (file.status !== 'uploading') {
            setFileList(fileList);
            const formData = new FormData();
            formData.append('file', file);
            getOnUploadFile(formData);
        }
    }
    const handleDeleteFile = () => {
        setFileList([]);
        setDataUploadFileReturn([]);
    }
    const onUploadFile = () => {
        const formData = new FormData();
        formData.append('file', fileListRequest[0]);
        checkDuplicateDataModel(formData, ((success: boolean, data: any) => {
            if (success == true) {
                if (data?.status == true) {
                    console.log("data", data);

                    if (data?.lstCollatingHdrDto) {
                        Modal.confirm({
                            title: 'Dữ liệu import đã được thực hiện trước đó, bạn có muốn ghi đè',
                            okText: "Đồng ý",
                            cancelText: "Hủy",
                            onOk() { handleOk(data?.lstCollatingHdrDto) },
                            onCancel() { handleCancel() },
                        });
                    } else {
                        importFile();
                    }
                } else {
                    notification.error({
                        message: data?.message
                    })
                }
            }
        }))

    }

    const importFile = () => {
        const formData = new FormData();
        formData.append('file', fileListRequest[0]);
        onImportCollating(formData, (success: boolean) => {
            if (success == true) {
                setFileList([]);
                setDataUploadFileReturn([]);
            }
        });
    }



    const handleOk = (datlstCollatingHdrDto: any) => {
        console.log("abc");
        //Xóa dữ liệu đã import 
        deleteDataDuplicateModel(datlstCollatingHdrDto, (success: any, resp: any) => {
            //Ghi dữ liệu vào db
            if (resp?.success == true) {
                importFile();
            }
        });


    };

    const handleCancel = () => {
        console.log("abc");
    };

    return (
        <>
            <Spin spinning={isLoading}>
                <Card title="Nhập dữ liệu đối soát" size='small' bordered={false}>
                    <Row style={{ margin: "3px", fontSize: '14px', textAlign: 'center' }}>
                        <Col span={8} />
                        <Col span={8} >
                            <Upload
                                maxCount={1}
                                multiple={false}
                                fileList={fileListRequest}
                                beforeUpload={handleChange}
                                onRemove={handleDeleteFile}
                            >
                                <Button className='height-btn2 btn-outline-info' icon={<UploadOutlined />} >Chọn file</Button>
                            </Upload>
                        </Col>
                    </Row>
                </Card>
                <Card size='small' bordered={false}>
                    <Table
                        bordered
                        columns={Columns}
                        dataSource={dataUploadFileReturn}
                        rowKey={record => record.uid}
                        size="small"
                    />
                    <p />
                    <Row>
                        <Col span={24} style={{ textAlign: "center" }}>
                            <Space>
                                <Button icon={<CheckCircleOutlined />}
                                    className='height-btn2 btn-outline-success'
                                    style={{ minWidth: '120px' }}
                                    onClick={onUploadFile}
                                    disabled={fileListRequest ? false : true}
                                > Đồng ý</Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>
            </Spin>
        </>
    )
}
export default ImportForControl;