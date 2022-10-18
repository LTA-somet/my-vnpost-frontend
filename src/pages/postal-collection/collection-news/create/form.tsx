import { useCategoryAppParamList, useCurrentUser } from '@/core/selectors';
import type { ContactDto } from '@/services/client';
import { dataToSelectBox, equalsText } from '@/utils';
import { EnvironmentOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select, TimePicker } from 'antd';
import type { FormInstance } from 'antd/es/form';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import * as PhoneUtil from '@/utils/PhoneUtil';
import { useState } from 'react';

const FormDetail = (props: Props) => {
    const STATUS = useCategoryAppParamList().filter((c) => c.type === 'LIST_STATUS_COLL_ORD');
    const [selectDate, setSelectDate] = useState<any>();


    const disabledHours = () => {
        if (!selectDate || moment(selectDate).date() === moment().date()) {
            const hours = [];
            for (let i = 0; i < moment().hour(); i++) hours.push(i);
            return hours;
        }
        else {
            return []
        }
    };

    const disabledMinutes = (selectedHour: number) => {
        if (!selectDate || moment(selectDate).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            const minutes = [];
            if (selectedHour === moment().hour()) {
                for (let i = 0; i < moment().minute(); i++) minutes.push(i);
            }
            return minutes;
        }
        else {
            return []
        }
    };

    const filterOption = (value: any, option: any): boolean => {
        const phoneStartZero = PhoneUtil.formatNoStart(value);
        const phoneStart84 = PhoneUtil.formatStart84(value);

        return equalsText(option.label, value) || equalsText(option.label, phoneStartZero) || equalsText(option.label, phoneStart84);

    }

    return (
        <>
            <Divider orientation="left" orientationMargin="0" >Thông tin chung</Divider>
            <Row gutter={14} >
                <Col span={12}>
                    <Form.Item
                        name="collectionRequestCode"
                        label='Mã tin'
                    >
                        <Input
                            disabled
                            placeholder="Hệ thống tự sinh mã"
                            allowClear
                        />
                    </Form.Item>
                </Col>
                <Col span={12} />
                <Col span={12}>
                    <Form.Item
                        name="collectionDate"
                        label='Ngày gom'
                        initialValue={moment()}
                        rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                    >
                        <DatePicker
                            disabled={props.isView}
                            style={{ width: "100%" }}
                            placeholder={'Ngày gom'}
                            format="DD/MM/YYYY"
                            onChange={(current) => setSelectDate(current)}
                            disabledDate={(current) => current.isBefore(moment().subtract(1, 'day')) || current.isAfter(moment().add(7, 'day'))}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="collectionTime"
                        label='Giờ thu gom'
                        labelAlign='right'
                        initialValue={moment()}
                        rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                    >
                        <TimePicker
                            disabled={props.isView}
                            style={{ width: "100%" }}
                            placeholder={'Giờ thu gom'}
                            format="HH:mm"
                            disabledHours={disabledHours}
                            disabledMinutes={disabledMinutes}
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="content"
                        label='Nội dung hàng'
                        rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                    >
                        <Input
                            disabled={props.isView}
                            placeholder="Nội dung hàng"
                            allowClear
                            maxLength={255}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="quantity"
                        label='Số lượng'
                        rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                    >
                        <InputNumber
                            disabled={props.isView}
                            placeholder="Số lượng"
                            style={{ width: '100%' }}
                            min={1}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="weight"
                        label='Khối lượng'
                        labelAlign='right'
                        rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                    >
                        <InputNumber
                            disabled={props.isView}
                            placeholder="Khối lượng"
                            addonAfter='g'
                            style={{ width: '100%' }}
                            min={1}

                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="collectNote"
                        label='Ghi chú'
                    >
                        <TextArea
                            disabled={props.isView}
                            placeholder='Ghi chú'
                            allowClear
                            maxLength={255}
                        />
                    </Form.Item>
                </Col>

            </Row>
            <Divider orientation="left" orientationMargin="0" >Địa chỉ lấy hàng</Divider>
            <Row justify='start' gutter={14} >
                <Col span={12}>
                    <Form.Item
                        name="senderId"
                        label='Người gửi'
                        rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                    >
                        <Select allowClear onChange={props.onChangeContact} showSearch disabled={props.isView} placeholder='Người gửi' filterOption={filterOption}>
                            {props.contact.map(record => (
                                <Select.Option key={record.contactId} value={record.contactId} label={record.name + ' - ' + record.phone}>
                                    <>
                                        <p style={{ margin: 0 }}>{record.name}</p>
                                        <p style={{ fontStyle: 'italic', fontWeight: 300, fontSize: 13, margin: 0, color: 'grey' }} >{record.address}</p>
                                    </>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Form.Item name='senderName' hidden />
                <Form.Item name='senderProvinceCode' hidden />
                <Form.Item name='senderDistrictCode' hidden />
                <Form.Item name='senderCommuneCode' hidden />
                <Form.Item name='senderPostCode' hidden />
                <Form.Item name='senderVpostCode' hidden />
                <Form.Item name='senderLon' hidden />
                <Form.Item name='senderLat' hidden />
                <Col span={12}>
                    <Form.Item
                        name="senderPhone"
                        label='Số điện thoại'
                        labelAlign='right'
                        rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                    >
                        <Input
                            disabled={props.isView}
                            allowClear
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col flex={'calc(100% - 40px)'}>
                            <Form.Item
                                name='senderAddress'
                                label='Địa chỉ'
                                rules={[{ required: true, message: 'Trường này không được để trống!' }]}

                            >
                                <AutoComplete
                                    disabled={props.isView}
                                    allowClear
                                    onSearch={props.handleSearch}
                                    options={props.options}
                                    placeholder="Nhập địa chỉ VD: Bưu điện Hà Nội"
                                > </AutoComplete>
                            </Form.Item>
                        </Col>
                        <Col flex={'35px'}>
                            <Button disabled={props.isView} style={{ width: '35px' }} onClick={() => props.setShowMap(true)} icon={<EnvironmentOutlined />} />
                        </Col>
                    </Row>
                </Col>

            </Row>
            {props.isView && <>
                <Divider orientation="left" orientationMargin="0"><i>Kết quả thu gom (Phần dành cho bưu điện)</i></Divider><Row justify='start' gutter={14}>
                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label='Trạng thái'
                        >
                            <Select
                                disabled
                                allowClear>
                                {dataToSelectBox(STATUS, 'value', 'name')}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="reason"
                            label='Lý do'
                            labelAlign='right'
                        >
                            <Input
                                disabled
                                allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="pickupNote"
                            label='Ghi chú'
                        >
                            <TextArea
                                disabled
                                allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="numPickuped"
                            label='SL đã thu gom'
                        >
                            <Input
                                disabled
                                allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={12} />
                    <Col span={12}>
                        <Form.Item
                            name="numAccepted"
                            label='SL đã chấp nhận'
                        >
                            <Input
                                disabled
                                allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={12} style={{ fontFamily: 'roboto,sans-serif', fontSize: '14px' }}>
                        <Button onClick={() => props.setVisible(true)} style={{ border: 'none' }}><u>Danh sách</u></Button>
                    </Col>
                </Row></>}
        </>
    );
};

type Props = {
    form: FormInstance<any>
    visible: boolean,
    isView?: boolean,
    setVisible: (visible: boolean) => void,
    setShowMap: (visible: boolean) => void,
    contact: ContactDto[],
    options: any[],
    handleSearch: (value: any) => void,
    onChangeContact: (value: any, record: any) => void,


}

export default FormDetail;