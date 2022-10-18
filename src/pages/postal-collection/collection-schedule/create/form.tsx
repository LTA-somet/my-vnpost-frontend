import { useCategoryAppParamList } from '@/core/selectors';
import type { ContactDto } from '@/services/client';
import { dataToSelectBox, equalsText } from '@/utils';
import { DeleteOutlined, EnvironmentOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select, Space, TimePicker } from 'antd';
import type { FormInstance } from 'antd/es/form';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import * as PhoneUtil from '@/utils/PhoneUtil';

const lstDayOfWeek = [
    { value: 'MONDAY', label: 'Thứ 2' },
    { value: 'TUESDAY', label: 'Thứ 3' },
    { value: 'WEDNESDAY', label: 'Thứ 4' },
    { value: 'THURSDAY', label: 'Thứ 5' },
    { value: 'FRIDAY', label: 'Thứ 6' },
    { value: 'SATURDAY', label: 'Thứ 7' },
    { value: 'SUNDAY', label: 'Chủ nhật' },

];

const FormDetail = (props: Props) => {
    const STATUS = useCategoryAppParamList().filter((c) => c.type === 'LIST_STATUS_COLL_ORD');

    const disabledHours = () => {
        const hours = [];
        for (let i = 0; i < moment().hour(); i++) hours.push(i);
        return hours;
    };

    const disabledMinutes = (selectedHour: number) => {
        const minutes = [];
        if (selectedHour === moment().hour()) {
            for (let i = 0; i < moment().minute(); i++) minutes.push(i);
        }
        return minutes;
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
                <Form.Item name='collectProvinceCode' hidden />
                <Form.Item name='collectDistrictCode' hidden />
                <Form.Item name='collectCommuneCode' hidden />
                <Form.Item name='collectPostCode' hidden />
                <Form.Item name='collectVpostCode' hidden />
                <Form.Item name='collectLon' hidden />
                <Form.Item name='collectLat' hidden />
                <Col span={12}>
                    <Form.Item
                        name="collectPhone"
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
            <Form.List name="collectCalendars">
                {(fields, { add, remove }) => (
                    <>
                        <Divider orientation="left" orientationMargin="0">
                            <Row gutter={24}>
                                <Col span={12}>Lịch hẹn</Col>
                                <Col span={12}>
                                    <Form.Item>
                                        <Button disabled={props.isView} className="btn-outline-primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => add()}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Divider>
                        {fields.map(({ name }) => (
                            <>
                                <Row justify='start' gutter={14}>
                                    <Col span={12}>
                                        {/* <Row gutter={8} justify="space-between" wrap={false}>
                                            <Col flex={'calc(100% - 200px)'}> */}
                                        <Form.Item
                                            name={[name, 'collectDate']}
                                            label={<><Button disabled={props.isView} className='btn-outline-danger' size='small' onClick={() => { remove(name) }} icon={<DeleteOutlined />} /><div style={{ width: 10 }} />Ngày</>}
                                            initialValue={lstDayOfWeek.map(d => d.value)}
                                            rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                                        >
                                            <Select
                                                style={{ width: "100%" }}
                                                mode="multiple"
                                                disabled={props.isView}
                                            >
                                                {dataToSelectBox(lstDayOfWeek, 'value', 'label')}
                                            </Select>
                                        </Form.Item>
                                        {/* </Col>
                                            <Col flex={'80px'}>
                                                <Col span={12} style={{ fontFamily: 'roboto,sans-serif', fontSize: '14px' }}>
                                                    <Button disabled={props.isView} onClick={() => props.setVisible(true)} style={{ border: 'none' }}><u>Thay đổi</u></Button>
                                                </Col>
                                            </Col>
                                        </Row> */}
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name={[name, 'collectTime']}
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
                                            // disabledHours={disabledHours}
                                            // disabledMinutes={disabledMinutes}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                            </>
                        ))}
                    </>
                )}
            </Form.List>
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