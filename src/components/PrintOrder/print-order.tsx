import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { DmMauinDto, OrderHdrDto } from '@/services/client';
import { DmMauInApi } from '@/services/client';
import { OrderHdrApi } from '@/services/client';
import { Button, Form, Modal, notification, Select, Spin } from 'antd';
import { dataToSelectBox, printFile } from '@/utils';
import { PrinterOutlined } from '@ant-design/icons';

const orderHdrApi = new OrderHdrApi();
const dmMauInApi = new DmMauInApi();
const PrintOrderForm: React.FC<Props> = React.forwardRef((props: Props, ref) => {
    const [formPrint, setFormPrint] = useState<string>();
    const [dmMauIn, setDmMauIn] = useState<DmMauinDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formPrintSelected, setFormPrintSelected] = useState<string>();

    // phục vụ cho in nhiều
    const [orderHdrIds, setOrderHdrIds] = useState<string[]>([]);
    const [isOpen, setOpen] = useState<boolean>(false);
    const callbackAfterPrint = useRef<(success: boolean) => void>();

    const loadData = () => {
        if (props.visible || isOpen) {
            dmMauInApi.findAllDmMauIn()
                .then(resp => {
                    if (resp.status === 200) {
                        setDmMauIn(resp.data)
                        setFormPrint(props.mauinDefault)
                    }
                })

        }
    }

    const onPrintMulti = (ids: string[], callback?: (success: boolean) => void) => {
        setIsLoading(true);
        orderHdrApi.exportListReport(formPrint!, ids)
            .then(resp => {
                if (resp.status === 200) {
                    printFile(resp.data);
                    setOpen(false);
                    props.setIsDone?.(true)
                }
                callback?.(resp.status === 200);
            }).finally(() => {
                setIsLoading(false);
            });
    }

    const onPrint = (oh: OrderHdrDto, callback?: () => void) => {
        setIsLoading(true);
        orderHdrApi.exportReport(oh.orderHdrId!, formPrint!)
            .then(resp => {
                if (resp.status === 200) {
                    printFile(resp.data);
                    props.setVisible?.(false);
                    props.setIsDone?.(true)
                }
                callback?.();
            }).finally(() => setIsLoading(false));
    }
    const handlePrint = () => {
        if (formPrint) {
            if (isOpen) {
                onPrintMulti(orderHdrIds, callbackAfterPrint.current);
            } else {
                onPrint(props.record!)
            }
            setFormPrintSelected(formPrint);
            setFormPrint(props.mauinDefault)
        }
        else {
            notification.error({ message: 'Chọn mẫu in!' })
        }
    }
    useImperativeHandle(ref, () => ({
        printType: formPrintSelected,
        handlePrint(oh: OrderHdrDto, callback: () => void) {
            onPrint(oh, callback);
        },
        handleOpenPrintMulti(ids: string[], callback?: (success: boolean) => void) {
            setOrderHdrIds(ids);
            setOpen(true);
            callbackAfterPrint.current = callback
        }
    }));
    useEffect(() => {
        if ((props.visible || isOpen) && dmMauIn.length === 0) {
            loadData();
        }
    }, [props.visible, isOpen])


    const handleChange = (e: any) => {
        setFormPrint(e);
    }
    // const { Option } = Select;
    return (

        <Modal
            title={'MẪU IN'}
            visible={props.visible || isOpen}
            onCancel={() => {
                props.setVisible?.(false);
                setOpen(false);
            }}
            width={700}
            destroyOnClose
            footer={false}
        >
            <Spin spinning={isLoading}>
                <Form.Item
                    name='printForm'
                    label='Mẫu in: '
                    rules={[{ required: true, message: 'chọn mẫu in!' }]}
                // initialValue={props.mauinDefault}
                >
                    <Select
                        showSearch
                        style={{ width: 400 }}
                        placeholder="Chọn mẫu in"
                        onChange={handleChange}
                        defaultValue={props.mauinDefault}
                    >
                        {dataToSelectBox(dmMauIn, 'mauinCode', 'mauinName')}
                        {/* {dmMauIn.map(item => (
                        <Option key={item.mauinCode} value={item.mauinName} >{item.mauinName}</Option>
                    ))} */}
                    </Select>
                    <Button icon={<PrinterOutlined />} className='custom-btn2 btn-outline-success' style={{ float: 'right' }} onClick={handlePrint}>In vận đơn</Button>
                </Form.Item>
            </Spin>
        </Modal>
    );
});

type Props = {
    visible?: boolean,
    setVisible?: (visible: boolean) => void,
    record?: any,
    mauinDefault?: string,
    ref?: any,
    isDone?: boolean,
    setIsDone?: (isDone: boolean) => void,
}
PrintOrderForm.defaultProps = {
    visible: false
}

export default PrintOrderForm;