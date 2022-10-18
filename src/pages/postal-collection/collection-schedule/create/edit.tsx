import type { CollectionOrderDto, CollectionScheduleDto, ContactDto } from '@/services/client';
import { ContactApi } from '@/services/client';
import { Card, Button, Spin, Form, Modal, Space, notification } from 'antd';
import { ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { validateMessages } from '@/core/contains';
import { debounce } from 'lodash';
import moment from 'moment';
import MapTest from '@/components/Address/Searchmap';
// import ListItemAccept from './list-item';
import FormDetail from './form';
import { useCurrentUser } from '@/core/selectors';
import { formatStart0 } from '@/utils/PhoneUtil';

const contactApi = new ContactApi();
// const collectionOrderApi = new CollectionOrderApi();
const CreateCollectionSchedule = (props: Props) => {
    const { isLoading, setIsLoading, updateRecord, showEdit, setShowEdit, onCreate } = useModel('collectionScheduleModel')
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
        if (props.record && showEdit) {
            const record = JSON.parse(JSON.stringify(props.record))
            record.collectCalendars!.forEach((element: any) => {
                element.collectTime = moment(element.collectTime, 'HH:mm');
            }
            );
            form.setFieldsValue(record)

        }
    }, [showEdit])

    useEffect(() => {
        if (showEdit) {
            contactApi.findAllByCurrentUser(true)
                .then(resp => {
                    if (resp.status === 200) {
                        setContact(resp.data)
                        const senderRecord = resp.data.find(c => c.name === props.record?.senderName);
                        if (props.record) {
                            form.setFieldsValue({
                                senderId: senderRecord?.contactId,
                                collectPhone: formatStart0(props.record?.collectPhone),
                                senderName: props.record?.senderName,
                                senderAddress: props.record?.senderAddress,
                                collectProvinceCode: props.record?.collectProvinceCode,
                                collectDistrictCode: props.record?.collectDistrictCode,
                                collectCommuneCode: props.record?.collectCommuneCode,
                                collectLon: props.record?.collectLon,
                                collectLat: props.record?.collectLat,
                                collectPostCode: props.record?.collectPostCode,
                                collectVpostCode: props.record?.collectVpostCode,
                            })
                        }
                        else {
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
                    }

                })
        }
    }, [showEdit])

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
            ['address']: value.label
        })
    }

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
                console.log(formValue);
                if (!formValue.collectCalendars) {
                    notification.error({ message: "Chưa nhập lịch thu gom" })
                } else {
                    if (props.record) {
                        updateRecord(props.record!.scheduleId!, formValue)
                    } else {
                        onCreate(formValue)
                    }
                }
            }
            )
    }

    const onFinish = () => {
        validateFormAndSave()
    }

    return (
        <div>
            <Modal
                title={<div style={{ fontSize: '16px', color: '#00549a' }}>{props.isView ? 'Chi tiết lịch thu gom' : props.record ? 'Cập nhật lịch thu gom' : 'Tạo lịch thu gom'}</div>}
                visible={showEdit}
                onCancel={() => {
                    setShowEdit(false);
                    form.resetFields();
                    props.setRecord?.(undefined);
                    props.setIsView?.(false)
                }}
                width={1000}
                footer={
                    <Space>
                        {!props.isView && <Button className='btn-outline-danger' icon={<ReloadOutlined />} onClick={() => form.resetFields()} > Làm mới </Button>}
                        {!props.isView && <Button className='custom-btn1 btn-outline-success' icon={<SaveOutlined />} onClick={onFinish} >
                            Lưu
                        </Button>}
                    </Space>
                }
                destroyOnClose
            >
                <Spin spinning={isLoading}>
                    <Form
                        name="form-create-collection-schedule"
                        labelAlign='left'
                        labelWrap
                        labelCol={{ flex: '150px' }}
                        form={form}
                        validateMessages={validateMessages}
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
                                isView={props.isView}
                            />
                        </Card>

                    </Form>
                </Spin>
                <MapTest
                    isOpenPopup={showMap}
                    setIsOpenPopup={setShowMap}
                    onSelectAddress={onSelectAddress}
                    form={form}
                    address={form.getFieldValue('address')}
                />
                {/* <ListItemAccept visible={visible} setVisible={setVisible} onChange={onChangeCollectDate} record={form.getFieldValue('collectDate')} /> */}
            </Modal>
        </div>
    );
};
type Props = {
    isView: boolean,
    setIsView?: (isView: boolean) => void,
    onCreate: (record: CollectionOrderDto) => void,
    setRecord?: (record: any) => void,
    record?: CollectionScheduleDto
}
export default CreateCollectionSchedule;


