import type { CollectionOrderDto, ContactDto } from '@/services/client';
import { CollectionOrderApi, ContactApi } from '@/services/client';
import { Card, Button, Spin, Form, Modal, Space, notification } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { validateMessages } from '@/core/contains';
import { debounce } from 'lodash';
import moment from 'moment';
import MapTest from '@/components/Address/Searchmap';
import ListItemAccept from './list-item';
import FormDetail from './form';
import { useCurrentUser } from '@/core/selectors';
import { formatStart0 } from '@/utils/PhoneUtil';

const contactApi = new ContactApi();
const collectionOrderApi = new CollectionOrderApi();
const CreateCollectionNewPopUp = (props: Props) => {
    const { isLoading, setIsLoading, showEdit, setShowEdit } = useModel('collectionNewsModel')
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
        if (showEdit) {
            contactApi.findAllByCurrentUser(true)
                .then(resp => {
                    if (resp.status === 200) {
                        setContact(resp.data)
                        const senderView = resp.data.find(c => c.name === props.record?.senderName);

                        if (props.record) {
                            form.setFieldsValue({
                                senderId: senderView?.contactId,
                                senderPhone: formatStart0(props.record?.senderPhone),
                                senderName: props.record?.senderName,
                                senderAddress: props.record?.senderAddress,
                                senderProvinceCode: props.record?.senderProvinceCode,
                                senderDistrictCode: props.record?.senderDistrictCode,
                                senderCommuneCode: props.record?.senderCommuneCode,
                                senderLon: props.record?.senderLon,
                                senderLat: props.record?.senderLat,
                                senderPostCode: props.record?.senderPostCode,
                                senderVpostCode: props.record?.senderVpostCode,
                            })
                        } else {
                            const sender = resp.data.find(c => c.isDefault === true && c.owner === currentUser.owner);

                            form.setFieldsValue({
                                senderId: sender?.contactId,
                                senderPhone: sender?.phone,
                                senderName: sender?.name,
                                senderAddress: sender?.address,
                                senderProvinceCode: sender?.provinceCode,
                                senderDistrictCode: sender?.districtCode,
                                senderCommuneCode: sender?.communeCode,
                                senderLon: sender?.lon,
                                senderLat: sender?.lat,
                                senderPostCode: sender?.postCode,
                                senderVpostCode: sender?.vpostCode,
                            })
                        }
                    }

                })
        }
    }, [showEdit])

    useEffect(() => {
        if (props.record && props.isView) {
            const record = { ...props.record }
            record.collectionDate = moment(props.record.collectionDate, 'YYYY-MM-DD')
            record.collectionTime = moment(props.record.collectionTime, 'HH:mm')
            form.setFieldsValue(record)
            form.setFieldsValue({ senderId: contact.find(c => c.name === record.senderName)?.name })

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
            ['senderAddress']: value.label
        })
    }

    const onChangeContact = (senderId: any, record: any) => {
        console.log(record.key);

        const sender = contact.find(r => r.contactId === Number(record.key));
        form.setFieldsValue({
            senderPhone: sender?.phone,
            senderName: sender?.name,
            senderAddress: sender?.address,
            senderProvinceCode: sender?.provinceCode,
            senderDistrictCode: sender?.districtCode,
            senderCommuneCode: sender?.communeCode,
            senderLon: sender?.lon,
            senderLat: sender?.lat,
            senderPostCode: sender?.postCode,
            senderVpostCode: sender?.vpostCode,
        })

    }

    const validateFormAndSave = () => {
        form.validateFields()
            .then(formValue => {
                if (moment() > moment(formValue.collectionTime) && moment(formValue.collectionDate).date() === moment().date()) {
                    notification.error({ message: "Giờ thu gom nhỏ hơn giờ hiện tại" })
                } else {
                    formValue.collectionDate = moment(formValue.collectionDate).format('YYYY-MM-DD')
                    formValue.collectionTime = moment(formValue.collectionTime).format('HH:mm')
                    props.onCreate(formValue)
                    form.resetFields()
                }
            }
            )
    }

    const confirm = () => {
        Modal.confirm({
            title: `Người gửi đã tạo tin thu gom cho ngày ${moment(form.getFieldValue('collectionDate')).format('YYYY-MM-DD')}`,
            icon: <ExclamationCircleOutlined />,
            okText: 'Tiếp tục',
            onOk() {
                validateFormAndSave();
            },
        });
    };

    const onSave = () => {
        form.validateFields().then(formValue => {
            collectionOrderApi.findDuplicate(formValue.senderPhone, moment(formValue.collectionDate).format('YYYY-MM-DD'))
                .then(resp => {
                    if (resp.status === 200) {
                        if (resp.data.length === 0) {
                            validateFormAndSave()
                        }
                        else {
                            confirm()
                        }
                    }
                })
        })
    }

    return (
        <div>
            <Modal
                title={<div style={{ fontSize: '16px', color: '#00549a' }}>{props.isView ? 'Chi tiết tin thu gom' : 'Tạo tin thu gom'}</div>}
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
                        {!props.isView && <Button className='custom-btn1 btn-outline-success' icon={<SaveOutlined />} onClick={onSave} >
                            Lưu
                        </Button>}
                    </Space>
                }
                destroyOnClose
            >
                <Spin spinning={isLoading}>
                    <Form
                        name="form-create-collection-news"
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
                    address={form.getFieldValue('senderAddress')}
                />
                <ListItemAccept visible={visible} setVisible={setVisible} record={props.record} />
            </Modal>
        </div>
    );
};
type Props = {
    isView: boolean,
    setIsView?: (isView: boolean) => void,
    onCreate: (record: CollectionOrderDto) => void,
    setRecord?: (record: any) => void,
    record?: any
}
export default CreateCollectionNewPopUp;


