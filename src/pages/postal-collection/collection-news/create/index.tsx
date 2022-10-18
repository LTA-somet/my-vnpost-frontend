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
import ListItemAccept from './list-item';
import FormDetail from './form';
import { useCurrentUser } from '@/core/selectors';

const contactApi = new ContactApi();
const collectionOrderApi = new CollectionOrderApi();
const CreateCollectionNew = () => {
    const { isLoading, setIsLoading, onCreate } = useModel('collectionNewsModel')
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
                    onCreate(formValue)
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

    const onFinish = () => {
        collectionOrderApi.findDuplicate(form.getFieldValue('senderPhone'), moment(form.getFieldValue('collectionDate')).format('YYYY-MM-DD'))
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
    }

    return (
        <div>
            <PageContainer>
                <Spin spinning={isLoading}>
                    <Form
                        name="form-create-collection-news"
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
                                <Col><Button className='btn-outline-success' icon={<SaveOutlined />} htmlType="submit" form="form-create-collection-news" type="primary">
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
                <ListItemAccept visible={visible} setVisible={setVisible} />
            </PageContainer>
        </div>
    );


};
export default CreateCollectionNew;


