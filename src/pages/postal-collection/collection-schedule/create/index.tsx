import type { ContactDto } from '@/services/client';
import { CollectionOrderApi, ContactApi } from '@/services/client';
import { Card, Spin, Form, Modal, Col, Button, Row, notification } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
// import EditFormAccountReplace from './edit';
import { validateMessages } from '@/core/contains';
import { debounce } from 'lodash';
import moment from 'moment';
import MapTest from '@/components/Address/Searchmap';
import FormDetail from './form';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useCurrentUser } from '@/core/selectors';

const plainOptions = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const lstDayOfWeek = [
    { value: 'MONDAY', label: 'Thứ 2' },
    { value: 'TUESDAY', label: 'Thứ 3' },
    { value: 'WEDNESDAY', label: 'Thứ 4' },
    { value: 'THURSDAY', label: 'Thứ 5' },
    { value: 'FRIDAY', label: 'Thứ 6' },
    { value: 'SATURDAY', label: 'Thứ 7' },
    { value: 'SUNDAY', label: 'Chủ nhật' },

];

const contactApi = new ContactApi();
const collectionOrderApi = new CollectionOrderApi();
const CreateCollectionNew = () => {
    const { isLoading, setIsLoading, onCreate } = useModel('collectionScheduleModel')
    // const [isView] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [contact, setContact] = useState<ContactDto[]>([]);
    const [options, setOptions] = useState<any[]>([]);
    const [showMap, setShowMap] = useState<boolean>(false);
    const currentUser = useCurrentUser();


    const getAddressInfo = (feature: any) => {
        return {
            value: feature.properties.label
        }
    }

    useEffect(() => {
        contactApi.findAllByCurrentUser(true)
            .then(resp => {
                if (resp.status === 200) {
                    setContact(resp.data)
                    const sender = resp.data.find(c => c.isDefault === true && c.owner === currentUser.owner);
                    form.setFieldsValue({
                        senderId: sender?.contactId,
                        collectPhone: sender?.phone,
                        senderName: sender?.name,
                        senderAddress: sender?.address,
                        collectProvinceCode: sender?.provinceCode,
                        collectDistrictCode: sender?.districtCode,
                        collectCommuneCode: sender?.communeCode,
                        collectLon: sender?.lon,
                        collectLat: sender?.lat,
                        collectPostCode: sender?.postCode,
                        collectVpostCode: sender?.vpostCode,
                    })
                }
            })
    }, [])

    const searching = useCallback((values: string, callback?: (success: any) => void) => {
        setIsLoading(true);
        if (values) {
            contactApi
                .findVmapsAddress(values)
                .then((resp) => {
                    if (resp.status === 200 && resp.data !== null) {
                        const result = resp.data.features?.map(ad => {
                            return getAddressInfo(ad)
                        })
                        setOptions(result!);
                        if (callback) {
                            callback(result);
                        }
                    }
                }).finally(() => setIsLoading(false));
        }
    }, []);

    const debounceSearching = useCallback(debounce((value) => searching(value), 300), [])

    const handleSearch = (values: string) => {
        if (values !== '') {
            debounceSearching(values);
        }
    };

    const onSelectAddress = (value: any) => {
        form.setFieldsValue({
            'senderAddress': value.label
        })
    }

    // const onChangeCollectDate = (checkedValues: string[]) => {
    //     setVisible(false)
    //     if (checkedValues.length === 7) {
    //         form.setFieldsValue({ 'collectDate': 'Hàng ngày' });
    //     } else {
    //         const lstDate: string[] = []
    //         checkedValues.forEach(e => {
    //             lstDate.push(lstDayOfWeek.find(o => o.value === e)!?.label)
    //         });
    //         const oldValue = form.getFieldValue('collectSchedule');
    //         console.log(oldValue);

    //         // form.setFieldsValue({ collectSchedule: { collectDate: lstDate.toString() } });
    //     }
    // };

    const onChangeContact = (senderId: any, record: any) => {
        console.log(record.key);

        const sender = contact.find(r => r.contactId === Number(record.key));
        form.setFieldsValue({
            collectPhone: sender?.phone,
            senderName: sender?.name,
            senderAddress: sender?.address,
            collectProvinceCode: sender?.provinceCode,
            collectDistrictCode: sender?.districtCode,
            collectCommuneCode: sender?.communeCode,
            collectLon: sender?.lon,
            collectLat: sender?.lat,
            collectPostCode: sender?.postCode,
            collectVpostCode: sender?.vpostCode,
        })

    }

    const validateFormAndSave = () => {
        form.validateFields()
            .then(formValue => {
                if (formValue.collectCalendars) {
                    formValue.collectCalendars.forEach((element: any) => {
                        element.collectTime = moment(element.collectTime).format('HH:mm')
                    });
                    onCreate(formValue)
                } else {
                    notification.error({ message: "Lịch hẹn không được để trống" })
                }
            }
            )
    }

    const onFinish = () => {
        validateFormAndSave()
    }

    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Form
                        name="form-create-collection-schedule"
                        labelAlign='left'
                        labelWrap
                        labelCol={{ flex: '150px' }}
                        form={form}
                        validateMessages={validateMessages}
                        onFinish={onFinish}
                    >
                        <Card>
                            <FormDetail
                                form={form}
                                contact={contact}
                                options={options}
                                handleSearch={handleSearch}
                                onChangeContact={onChangeContact}
                                setShowMap={setShowMap}
                                setVisible={setVisible}
                                visible={visible}
                            />
                            <Row justify='end' gutter={24}>
                                <Col><Button className='btn-outline-danger' icon={<ReloadOutlined />} onClick={() => form.resetFields()} > Làm mới </Button></Col>
                                <Col><Button className='btn-outline-success' icon={<SaveOutlined />} htmlType="submit" form="form-create-collection-schedule" type="primary">
                                    Lưu
                                </Button></Col>
                                <Col flex={'100px'} />
                            </Row>
                        </Card>

                    </Form>
                </Spin>
                <MapTest
                    isOpenPopup={showMap}
                    setIsOpenPopup={setShowMap}
                    onSelectAddress={onSelectAddress}
                    form={form}
                    address={form.getFieldValue('senderAddress')}
                />
                {/* <ListItemAccept visible={visible} setVisible={setVisible} record={form.getFieldValue('collectSchedule: collectDate')} /> */}
            </PageContainer>
        </div>
    );


};
export default CreateCollectionNew;


