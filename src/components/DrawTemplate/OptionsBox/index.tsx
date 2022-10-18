import React, { useEffect, useState } from 'react';
import { Form, Select, Row, Upload, Col, InputNumber, FormInstance } from 'antd';
import ConvertUnit from '../utils/ConvertUnit';
import { fontList, landscapeOptions, pageSizeOptions, unitOptions } from '../utils/constant';
import { dataToSelectBox } from '@/utils';
import './style.css';
import { PlusOutlined } from '@ant-design/icons';

type TextTransformProps = 'none' | 'uppercase' | 'lowercase';
const formRef = React.createRef<FormInstance>();
const OptionsBox: React.FC<Props> = (props: Props) => {
    const [nodeValue, setNodeValue] = useState<string>('');
    const [image, setImage] = useState<any>();
    const [modelOptions, setModelOptions] = useState<any>({});
    const [nodeOptions, setNodeOptions] = useState<any>({});

    const emitChange = (data: any) => {
        if (props.optionType === 'model') {
            const newModelOptions = { ...modelOptions, ...data }
            setModelOptions(newModelOptions);
        } else {
            const newNodeOptions = { ...nodeOptions, ...data.config }
            setNodeOptions(newNodeOptions);
        }
        props.onOptionChange(data);
    }

    const onAddImage = (f: any) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
            emitChange({
                image: reader.result
            });
        }

        reader.readAsDataURL(f);
    }

    const changeUnit = (newUnit: any) => {
        const newWidth = ConvertUnit.convert(modelOptions.width, modelOptions.unit, newUnit, modelOptions.ppi);
        const newHeight = ConvertUnit.convert(modelOptions.height, modelOptions.unit, newUnit, modelOptions.ppi);
        const newValue = {
            width: newWidth,
            height: newHeight,
            unit: newUnit
        }
        emitChange(newValue);
    }

    const mapModelOptions = (options: any = {}) => {
        const newOption = {
            width: options.width,
            height: options.height,
            unit: options.unit,
            pageSize: options.pageSize,
            ppi: options.ppi,
            landscape: options.landscape ? 'true' : 'false',
            marginLeft: options.marginLeft,
            marginTop: options.marginTop,
            marginRight: options.marginRight,
            marginBottom: options.marginBottom
        }
        setImage(options.image);
        setModelOptions(newOption);
        formRef.current!.setFieldsValue(newOption);
    }

    const mapNodeOptions = (nodeModel: any) => {
        const { config } = nodeModel;
        const { fontStyle } = config;
        const [bold, italic] = fontStyle.split(' ');
        setNodeValue(nodeModel.value);
        const newOption = { ...config, bold, italic }
        setNodeOptions(newOption);
        formRef.current!.setFieldsValue(newOption);
    }

    const mapOptionsProps = (options: any) => {
        if (props.optionType === 'model') {
            mapModelOptions(options);
        } else {
            mapNodeOptions(options);
        }
    }

    const toggleBold = () => {
        const bold = nodeOptions.bold === 'bold' ? 'normal' : 'bold';
        emitChange({
            config: {
                fontStyle: [bold, nodeOptions.italic].join(" ")
            }
        })
    }

    const toggleItalic = () => {
        const italic = nodeOptions.italic === 'italic' ? 'normal' : 'italic';
        emitChange({
            config: {
                fontStyle: [nodeOptions.bold, italic].join(" ")
            }
        })
    }

    const toggleTextTransform = () => {
        const accepts: TextTransformProps[] = ['none', 'uppercase', 'lowercase'];
        let index = accepts.indexOf(nodeOptions.textTransform);
        if (index < 0) index = 0;
        index++;
        if (index >= accepts.length) index = 0;
        emitChange({
            config: {
                textTransform: accepts[index]
            }
        })
    }

    const onChangeTextColor = (e: any) => {
        setNodeOptions({ ...nodeOptions, textColor: e.target.value });
    }

    const onChangeFontSize = (value: number) => {
        emitChange({ config: { fontSize: value } })
    }

    const toggleTextDecoration = () => {
        const accepts = ['', 'underline', 'line-through'];
        let index = accepts.indexOf(nodeOptions.textDecoration);
        if (index < 0) index = 0;
        index++;
        if (index >= accepts.length) index = 0;
        emitChange({
            config: {
                textDecoration: accepts[index]
            }
        })
    }
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const beforeUpload = async (f: any) => {
        onAddImage(f);
        return false;
    }

    useEffect(() => {
        mapOptionsProps(props.options);
    }, [props.options])

    return (
        <Form
            layout="vertical"
            ref={formRef}
        >
            {props.optionType === 'model' ?
                <div>
                    <div className="g-title">Thiết lập mẫu</div>
                    <div className="g-upload-img">
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                        // onChange={this.handleChange}
                        >
                            {image ? <img src={image} className="g-thumbnail" /> : uploadButton}
                        </Upload>
                    </div>
                    <Form.Item label="Hướng giấy" name="landscape">
                        <Select placeholder="Hướng giấy" style={{ width: '100%' }} onChange={(v) => emitChange({ landscape: v === 'true' })}>
                            {dataToSelectBox(landscapeOptions, 'value', 'label')}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Đơn vị đo" name="unit">
                        <Select placeholder="Đơn vị đo" style={{ width: '100%' }} onChange={changeUnit}>
                            {dataToSelectBox(unitOptions, 'value', 'label')}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Kích thước giấy" name="pageSize">
                        <Select placeholder="Kích thước giấy" style={{ width: '100%' }} onChange={(value) => emitChange({ pageSize: value })}>
                            {dataToSelectBox(pageSizeOptions, 'value', 'label')}
                        </Select>
                    </Form.Item>
                    {modelOptions.pageSize === 'custom' && <>
                        <Row>
                            <Col span="12">
                                <Form.Item label="Chiều ngang" name="width">
                                    <InputNumber className='g-number' step={modelOptions.unit === 'mm' ? 1 : 0.1} onChange={(value) => emitChange({ width: value })} />
                                </Form.Item>
                            </Col>
                            <Col span="12">
                                <Form.Item label="Chiều dọc" name="height">
                                    <InputNumber className='g-number' step={modelOptions.unit === 'mm' ? 1 : 0.1} onChange={(value) => emitChange({ height: value })} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </>}
                    <Row style={{ marginBottom: '-24px' }}>
                        <Col span="8" />
                        <Col span="8">
                            <Form.Item label="Lề trên" name="marginTop">
                                <InputNumber className='g-number' step={modelOptions.unit === 'mm' ? 1 : 0.1} onChange={(value) => emitChange({ marginTop: value })} />
                            </Form.Item>
                        </Col>
                        <Col span="8" />
                    </Row>
                    <Row style={{ marginBottom: '-24px' }}>
                        <Col span="8">
                            <Form.Item label="Lề trái" name="marginLeft">
                                <InputNumber className='g-number' step={modelOptions.unit === 'mm' ? 1 : 0.1} onChange={(value) => emitChange({ marginLeft: value })} />
                            </Form.Item>
                        </Col>
                        <Col span="8" />
                        <Col span="8">
                            <Form.Item label="Lề phải" name="marginRight">
                                <InputNumber className='g-number' step={modelOptions.unit === 'mm' ? 1 : 0.1} onChange={(value) => emitChange({ marginRight: value })} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '-24px' }}>
                        <Col span="8" />
                        <Col span="8">
                            <Form.Item label="Lề dưới" name="marginBottom">
                                <InputNumber className='g-number' step={modelOptions.unit === 'mm' ? 1 : 0.1} onChange={(value) => emitChange({ marginBottom: value })} />
                            </Form.Item>
                        </Col>
                        <Col span="8" />
                    </Row>

                </div>
                :
                <>
                    <div className="g-title">{nodeValue}</div>
                    <Row>
                        <Col span="16">
                            <Form.Item label="Phông chữ" name="fontFamily">
                                <Select placeholder="Phông chữ" style={{ width: '100%' }} onChange={(v) => emitChange({ config: { fontFamily: v } })}>
                                    {dataToSelectBox(fontList, 'value', 'label')}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span="8">
                            <Form.Item label="Kích thước" name="fontSize">
                                <InputNumber step={1} min={1} onChange={onChangeFontSize} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="g-btn-group">
                        <a className="ant-btn ant-btn-text" style={{ fontWeight: nodeOptions.bold === 'normal' ? 'normal' : 'bold' }} onClick={toggleBold}>B</a>
                        <a className="ant-btn ant-btn-text" style={{ fontStyle: nodeOptions.italic }} onClick={toggleItalic}>I</a>
                        <a className="ant-btn ant-btn-text" style={{ textDecoration: nodeOptions.textDecoration }} onClick={toggleTextDecoration}>U</a>
                        <a className="ant-btn ant-btn-text" style={{ textTransform: nodeOptions.textTransform }} onClick={toggleTextTransform}>Aa</a>
                        <input type="color" value={nodeOptions.fill} onChange={onChangeTextColor} style={{ marginTop: '3px' }} />
                    </div>
                </>
            }
        </Form >
    );
};

type Props = {
    optionType: string,
    onOptionChange: (data: any) => void,
    options: any
}
export default OptionsBox;