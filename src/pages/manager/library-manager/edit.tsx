import { regexCode } from '@/core/contains';
import type { LibraryInfoDto } from '@/services/client';
import { dataToSelectBox, downloadFile } from '@/utils';
import { CloseCircleOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Space, Upload } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';
import React, { useState, useRef } from 'react';
import JoditEditor from "jodit-react";
import { UploadFile } from 'antd/lib/upload/interface';

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

const { Option } = Select;

const EditFormLibrary: React.FC<Props> = (props: Props) => {
    const [file, setFile] = useState<any>();
    const { loading, importLibrary, dataSource, dataSourceType, updateLibrary } = useModel('libraryssList');
    const [contractServiceCodes, setContractServiceCodes] = useState<LibraryInfoDto[]>([]);
    const [form] = Form.useForm();
    const [disabledContent, setDisabledContent] = useState<boolean>(false);
    const [disabledEdit, setDisabledEdit] = useState<boolean>(false);
    const editor = useRef(null)// nhập
    const [content, setContent] = useState('') //  nhập
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onFill = () => {
        // console.log("props.record", props.record);
        if (props.record) {
            if (props.record.fileName != null) {
                // let newFileList = [];
                // newFileList = props.record?.fileName?.split(';');
                const obj = [{
                    uid: "",
                    // name: newFileList![1],
                    name: props.record?.fileName
                }]
                setFileList(obj);
            }
            if (props.record.loadType === "0") {
                setDisabledContent(false);
            } else {
                setDisabledContent(true);
            }

            setDisabledEdit(true);
            form!.setFieldsValue(props.record);
        } else {
            setFileList([]);
            setDisabledContent(false);
            setDisabledEdit(false);
            form!.resetFields();
        }
    };

    useEffect(() => {
        onFill();
        if (!props.visible) {
            form.resetFields();
        }
    }, [props.record, props.visible]);

    const onSaveSender = () => {
        if (props.record) {
            let fileName = '';
            if (fileList && fileList.length > 0) {
                // fileName = fileList[0].uid + ";" + fileList[0].name;
                fileName = fileList[0].name;
            } else if (file) {
                // fileName = file.uid + ";" + file.name;
                fileName = file.name;
            }
            form.validateFields()
                .then((formValue: any) => {
                    const libraryinfo = { ...formValue, contractServiceCodes, dataPdf: undefined, fileName: fileName }
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('info', JSON.stringify(libraryinfo
                    ));

                    updateLibrary(props.record!.libraryInfoId!, formData, () => props.setVisible(false));
                });
        } else {
            form.validateFields()
                .then((formValue: any) => {
                    let fileName = '';
                    if (file) {
                        // fileName = file.uid + ";" + file.name;
                        fileName = file.name;
                    }
                    const libraryinfo = { ...formValue, contractServiceCodes, dataPdf: undefined, fileName: fileName }
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('info', JSON.stringify(libraryinfo));

                    importLibrary(formData, () => props.setVisible(false));
                });
        }

    }
    const beforeUpload = (f: any, fL: any) => {
        setFileList(fL);
        setFile(f)

        return false;
    }

    const changeUpload = (value: any) => {
        if (value === "0") { //Nội dung
            setDisabledContent(false);
            setFile([]);
        } else {
            setDisabledContent(true); //Upload
            setContent("");
        }
    }

    const onPreview = (value: any) => {
        // console.log("file download", value);
        if (props.record?.dataPdf != undefined) {
            downloadFile(props.record?.dataPdf, value.name, '');
        }
    }

    return (
        <div>
            <Modal
                title={<div style={{ fontSize: '16px' }}>{props.record ? 'Chỉnh sửa thư viện' : 'Thêm mới thư viện'}</div>}
                visible={props.visible}
                onCancel={() => props.setVisible(false)}
                width={1000}
                footer={
                    <Space>
                        <Button className='custom-btn1 btn-outline-danger' icon={<CloseCircleOutlined />} onClick={() => props.setVisible(false)}>Huỷ</Button>
                        {!props.isView && <Button className='custom-btn1 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" onClick={onSaveSender} loading={props.isSaving} >
                            Lưu
                        </Button>}
                    </Space>
                }
                destroyOnClose
            >
                <Form
                    name="form-create-library"
                    // {...formItemLayout}
                    labelCol={{ flex: '120px' }}
                    labelAlign='left'
                    onFinish={props.onEdit}
                    form={form}
                >
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name="libraryTypeId"
                                label="Loại tin"
                                rules={[{ required: true, message: 'Trường này không được để trống!' }, { pattern: regexCode, message: 'Trường này chứa ký tự không hợp lệ!' }]}
                            >
                                <Select allowClear disabled={disabledEdit}>
                                    {dataToSelectBox(dataSourceType, 'libraryTypeId', 'typeName')}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="title"
                                label="Tiêu đề"
                                rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                            >
                                <Input maxLength={3000} disabled={disabledEdit} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="focusNews"
                                label="Nổi bật"
                            >
                                <Input maxLength={3000} disabled={disabledEdit} placeholder="Nhập vào nội dung ngắn gọn mà bạn nghĩ sẽ thu hút người xem" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="loadType"
                                label="Hình thức tải tin"
                                rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                                initialValue="0"
                            >
                                <Select onChange={changeUpload} disabled={disabledEdit}>
                                    <Option value="0">Nhập nội dung</Option>
                                    <Option value="1">Tải file PDF</Option>
                                </Select>

                            </Form.Item>
                        </Col>
                        {!disabledContent && <Col span={24}>
                            <Form.Item
                                name="descriptions"
                                label="Nội dung bài viết"
                                style={{ overflow: 'auto', height: '200px' }}
                            >
                                <JoditEditor
                                    ref={editor}
                                    value={content}
                                    onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                                />
                            </Form.Item>
                        </Col>}
                        {disabledContent && <Col span={24} >
                            <Form.Item
                                name="dataPdf"
                                label="Tải File FDF"
                            >
                                <Upload onRemove={() => setFileList([])} beforeUpload={beforeUpload} fileList={fileList} onPreview={onPreview}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        }

                        <Col span={24}>
                            <Form.Item
                                name="rank"
                                label="Xếp hạng"
                                rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                                initialValue="1"
                            >
                                <Select defaultValue="1">
                                    <Option value="1">Phổ biến</Option>
                                    <Option value="0">Ít phổ biến</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="status"
                                label="Trạng thái"
                                rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                                initialValue="1"
                            >
                                <Select defaultValue="1">
                                    <Option value="1">Hiệu lực</Option>
                                    <Option value="0">Ngừng hiệu lực</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="exprireDate"
                                label="Ngày hết hạn"
                                rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                                initialValue="5"
                            >
                                <InputNumber addonAfter={'ngày'} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <i style={{ marginLeft: "165px", color: '#fd9713' }}>Ghi chú: Tin được xếp hạng phổ biến sẽ ưu tiên hiển thị trước.</i>
                        </Col>
                    </Row>
                </Form>
            </Modal>

        </div >
    );
};
type Props = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    record?: LibraryInfoDto,
    onEdit: (record: LibraryInfoDto) => void,
    isSaving: boolean,
    isView: boolean,
}
export default EditFormLibrary;