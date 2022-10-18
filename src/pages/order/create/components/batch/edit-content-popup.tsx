import { OrderContentDto, VaDto } from '@/services/client';
import { Form, Modal } from 'antd';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import ContentInfo from '../content/content-info'

type Props = {
    ref?: any,
    isServiceDocument: boolean,
    isHasPhatMotPhan: boolean
}
const EditContentPopup: React.FC<Props> = React.forwardRef((props: Props, ref) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [contentForm] = Form.useForm();
    const { form } = useModel('orderModel');
    const callbackFnc = useRef<(orderContents: OrderContentDto[]) => void>();
    const [vas, setVas] = useState<VaDto[]>([]);

    useEffect(() => {
        const newVas: VaDto[] = form?.getFieldValue('vas') ?? [];
        setVas(newVas)
    }, [visible]);

    useImperativeHandle(ref, () => ({
        handleOpen(orderContents: OrderContentDto[], callback?: (orderContents: OrderContentDto[]) => void) {
            contentForm.setFieldsValue({ orderContents })
            setVisible(true);
            callbackFnc.current = callback;
        }
    }));

    const handleSave = () => {
        contentForm.validateFields().then((formValue: any) => {
            const orderContents: OrderContentDto[] = formValue?.orderContents ?? [];
            callbackFnc.current?.(orderContents);
            setVisible(false);
        })
    }

    return (
        <div>
            <Modal
                visible={visible}
                onCancel={() => setVisible(false)}
                title={'Thông tin hàng hoá'}
                onOk={handleSave}
                bodyStyle={{ backgroundColor: '#f1f5f9' }}
                width={1000}
                okText={'Đồng ý'}
            >
                <Form
                    name="form-edit-content"
                    labelCol={{ flex: '120px' }}
                    labelAlign="left"
                    labelWrap
                    colon={false}
                    form={contentForm}
                >
                    <ContentInfo
                        form={contentForm}
                        isServiceDocument={props.isServiceDocument}
                        isHasPhatMotPhan={props.isHasPhatMotPhan}
                        vas={vas}
                    />
                </Form>
            </Modal>
        </div>
    );
});

export default EditContentPopup;