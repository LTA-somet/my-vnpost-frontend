import { formatInputNumber, validateMessages } from '@/core/contains';
import { OrderHdrDto, VaDto } from '@/services/client';
import { Card, Col, Form, InputNumber, Modal, Row } from 'antd';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import Content from '../content';
import { defaultContentInBatch } from '../footer';

type Props = {
    ref?: any,
}
const EditContentPopup: React.FC<Props> = React.forwardRef((props: Props, ref) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [contentForm] = Form.useForm();
    const { vasList } = useModel('vasList');
    const { form } = useModel('orderModel');
    const callbackFnc = useRef<(formValue: any) => void>();
    const [isShowCodField, setShowCodField] = useState<boolean>(false);
    const [vas, setVas] = useState<VaDto[]>([]);

    useEffect(() => {
        if (visible) {
            const newVas: VaDto[] = form?.getFieldValue('vas') ?? [];
            const allowUseCod = vasList.some(v => v.vaServiceId === 'GTG021');
            const hasCheckCod = newVas?.some(v => v.vaCode === 'GTG021');
            // chỉ hiển thị khi đc sd GTG021 và thông tin chung k đc check GTG021
            setShowCodField(allowUseCod && !hasCheckCod);
            setVas(newVas)
        }
    }, [visible]);

    const getCod = (orderHdr: OrderHdrDto) => {
        const codVa = orderHdr.vas?.find(v => v.vaCode === 'GTG021');
        if (codVa) {
            const prop0018 = codVa.addons?.find(p => p.propCode === 'PROP0018');
            return prop0018?.propValue;
        }
        return '';
    }

    useImperativeHandle(ref, () => ({
        handleEditContent(orderHdr: OrderHdrDto, callback?: (formValue: any) => void) {
            const fromValue = { ...orderHdr, cod: getCod(orderHdr) }
            contentForm.setFieldsValue(fromValue);
            setVisible(true);
            callbackFnc.current = callback;
        },
        handleAddContent(callback?: (formValue: any) => void) {
            contentForm.setFieldsValue(defaultContentInBatch);
            setVisible(true);
            callbackFnc.current = callback;
        }
    }));

    const handleSave = () => {
        contentForm.validateFields()
            .then(formValue => {
                // check cod
                const newData = { ...formValue }
                if (isShowCodField) {
                    const cod = formValue?.cod;
                    if (cod) {
                        // nếu có nhập cod
                        const codVaList = vasList.find(v => v.vaServiceId === 'GTG021');
                        const newVaCod = {
                            vaCode: codVaList?.vaServiceId,
                            addons: codVaList?.propsList?.map(p => ({
                                vaCode: codVaList?.vaServiceId,
                                propCode: p.propCode,
                                propValue: p.propCode === 'PROP0018' ? cod : p.defaultValue
                            }))
                        }
                        newData.vas = [newVaCod];
                    }
                }

                callbackFnc?.current?.(newData);
                setVisible(false);
            });
    }

    return (
        <div>
            <Modal
                visible={visible}
                onCancel={() => setVisible(false)}
                title={'Thông tin hàng hoá'}
                onOk={handleSave}
                bodyStyle={{ backgroundColor: '#f1f5f9', paddingTop: 0 }}
                width={800}
                okText={'Đồng ý'}
            >
                <Form
                    name="form-edit-content"
                    labelCol={{ flex: '120px' }}
                    labelAlign="left"
                    labelWrap
                    colon={false}
                    form={contentForm}
                    validateMessages={validateMessages}
                >
                    <Content form={contentForm} vas={vas} />
                    {isShowCodField && <Card
                        className="fadeInRight"
                        bordered={false}
                        size="small"
                        style={{ marginTop: 14 }}
                    >
                        <Row gutter={8}>
                            <Col className='config-height' span={24}>
                                <Form.Item
                                    name="cod"
                                    label="Phát hàng thu tiền COD"
                                    labelCol={{ flex: '125px' }}
                                >
                                    <InputNumber style={{ width: '100%' }} min={0} max={1000000000} maxLength={50}
                                        {...formatInputNumber}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>}
                </Form>
            </Modal>
        </div>
    );
});

export default EditContentPopup;