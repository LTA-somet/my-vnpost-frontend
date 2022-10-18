import CustomUpload from '@/components/CustomUpload';
import { EditableCell, EditableRow } from '@/components/Editable';
import { OrderBatchDto } from '@/pages/order/dtos/OrderBatchDto';
import { OrderContentDto, OrderHdrDto, OrderImageDto, VaDto } from '@/services/client';
import { calculateDimWeight, calculatePriceWeight, validateBatch } from '@/utils/orderHelper';
import { AlignLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Collapse, Form, Table } from 'antd';
import { uniqueId } from 'lodash';
import React, { useMemo, useRef } from 'react';
import { useModel } from 'umi';
import { ColumnTypes } from '../content/content-table';
import columnsDefine from './columns';
import EditContentPopup from './edit-content-popup';

const Batch = () => {
    const { batch, isLoadingBatch, form, setBatch, serviceListAppend } = useModel('orderModel');
    const editContentRef = useRef<any>();
    const { vasList } = useModel('vasList');

    const sortAndReIndexBatch = (newBatch: OrderHdrDto[]) => {
        newBatch.sort((a, b) => ((a.acceptanceIndex ?? 9999) > (b.acceptanceIndex ?? 9999) ? 1 : -1));
        newBatch.map((o, i) => {
            o.acceptanceIndex = i + 1;
        });
        return newBatch;
    }
    const handleDelete = (key: string) => {
        const newDataSource = [...batch || []];
        const newContentList = newDataSource.filter(item => item.orderHdrId !== key);
        const newBatch = sortAndReIndexBatch(newContentList)
        setBatch?.(newBatch);
    };

    const action = (id: string, record: OrderHdrDto): React.ReactNode => {
        return <Button size="small" onClick={() => handleDelete(id)}><DeleteOutlined style={{ color: 'red' }} /></Button>
    }

    const handleSave = (row: OrderBatchDto) => {
        const newData = [...batch || []];
        const index = newData.findIndex(item => row.orderHdrId === item.orderHdrId);
        const item = newData[index];

        // tính lại KHL quy đổi và KHL tính cước
        const dimWeight = calculateDimWeight(row.height, row.width, row.length);
        const priceWeight = calculatePriceWeight(row.weight, dimWeight);
        row.dimWeight = dimWeight;
        row.priceWeight = priceWeight;

        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setBatch?.(newData);
    };

    const handleSaveContentInfo = (orderContents: OrderContentDto[], record: OrderHdrDto) => {
        const totalWeight = orderContents.reduce((total, next) => total + ((next.quantity || 0) * (next.weight || 0)), 0);
        const newRecord: OrderHdrDto = { ...record, orderContents, weight: totalWeight }
        handleSave(newRecord);
    }

    const contentAction = (orderContents: OrderContentDto[], record: OrderHdrDto) => {
        const onSaveContentInfo = (orderContents: OrderContentDto[]) => {
            handleSaveContentInfo(orderContents, record);
        }
        return <Button size="small" onClick={() => editContentRef.current?.handleOpen?.(orderContents, onSaveContentInfo)} ><AlignLeftOutlined /></Button>
    }

    const vas: VaDto[] = Form.useWatch('vas', form);

    const onChangeImage = (id: string, images: any[]) => {
        const newData = [...batch || []];
        const index = newData.findIndex(item => id === item.orderHdrId);
        const item = newData[index];

        newData.splice(index, 1, {
            ...item,
            orderImages: images,
        });
        setBatch?.(newData);
    }

    const renderImage = (id: string, image?: OrderImageDto[]) => {
        return <CustomUpload value={image} maxImage={5} onChange={(images) => onChangeImage(id, images)} />
    }

    const handleAdd = () => {
        const id = uniqueId('batch-');
        const newData: any = {
            orderHdrId: id
        };
        const newBatch = sortAndReIndexBatch([...batch || [], newData])
        setBatch?.(newBatch);
        // setCount(count - 1)
    };

    const serviceCode = Form.useWatch('serviceCode', form);

    const isServiceDocument: boolean = useMemo(() => {
        const service = serviceListAppend.find(s => s.mailServiceId === serviceCode);
        return service?.type === 'TL';
    }, [serviceCode]);

    const isHasPhatMotPhan = useMemo((): boolean => {
        return vas?.some(va => va.vaCode === 'GTG068')
    }, [vas]);

    const validateResult = useMemo(() => {
        return validateBatch(batch, isServiceDocument, isHasPhatMotPhan);
    }, [batch, isServiceDocument, isHasPhatMotPhan]);

    const allowUseCod = vasList.some(v => v.vaServiceId === 'GTG021');
    const columnsViewer: any[] = columnsDefine(action, vas, handleAdd, renderImage, contentAction, allowUseCod, isServiceDocument, isHasPhatMotPhan);
    const columns = columnsViewer.map(col => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record: OrderHdrDto) => ({
                record,
                ...col,
                handleSave: handleSave,
            }),
        };
    });

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    return (
        <Collapse defaultActiveKey={['1']}>
            <Collapse.Panel header={<>
                <b>Thông tin bưu gửi trong lô</b>
            </>}
                key="1"
            >
                <Table
                    size='small'
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={batch || []}
                    columns={columns as ColumnTypes}
                    pagination={false}
                    loading={isLoadingBatch}
                />
                {!validateResult.success && <div style={{ color: 'red', fontStyle: 'italic' }}>{`STT ${validateResult.acceptanceIndex}: ${validateResult.error}`}</div>}
                <EditContentPopup
                    ref={editContentRef}
                    isServiceDocument={isServiceDocument}
                    isHasPhatMotPhan={isHasPhatMotPhan}
                />
            </Collapse.Panel>
        </Collapse >
    );
};

export default Batch;