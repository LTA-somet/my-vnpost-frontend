import { OrderContentDto, ProductApi, ProductEntity, VaDto } from '@/services/client';
import { ArrowsAltOutlined, ShrinkOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Form, FormInstance, Space } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useModel } from 'umi';
import ContentTable from './content-table';

const productApi = new ProductApi();
const ContentInfo: React.FC<Props> = (props: Props) => {
    const [expand, setExpand] = useState<boolean>(false);
    const [openModalProduct, setOpenModalProduct] = useState<boolean>(false);
    const isTouchedWeight = useRef<boolean>(false);
    const [productList, setProductList] = useState<ProductEntity[]>([]);
    const { caseTypeId, checkDisabledEdit } = useModel('orderModel');

    const weight = Form.useWatch('weight', props.form);

    useEffect(() => {
        productApi.findAllProduct()
            .then(resp => {
                if (resp.status === 200) {
                    setProductList(resp.data);
                }
            })
    }, []);

    useEffect(() => {
        // nếu reset form thì set isTouchedWeight = false
        if (!weight) {
            isTouchedWeight.current = false;
        }
    }, [weight])

    const checkNumber = (value: any): boolean => {
        if (isNaN(value)) return false;
        const n: number = +value;
        return n > 0;
    }

    const checkValidate = (_: any, newValues: OrderContentDto[] = []) => {
        if (props.required && props.isHasPhatMotPhan && newValues.length === 0) {
            return Promise.reject(new Error(`Bắt buộc ít nhất một hàng hoá`));
        }
        for (let i = 0; i < newValues.length; i++) {
            const newValue = newValues[i];
            if (newValue) {
                if (!newValue.nameVi || !checkNumber(newValue.quantity) || !checkNumber(newValue.weight)) {
                    return Promise.reject(new Error(`Chưa nhập đủ thông tin`));
                }
            }
        }
        return Promise.resolve();
    };

    const disabledEdit = useMemo(() => checkDisabledEdit([4, 5, 6, 7]), [caseTypeId]);

    return (
        <>
            {!props.isServiceDocument && <Card
                className="fadeInRight"
                title="Chi tiết hàng hoá"
                bordered={false}
                size="small"
                extra={<Space>
                    <><Button className="btn-outline-primary"
                        icon={expand ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
                        onClick={() => setExpand(!expand)}
                        disabled={disabledEdit} />
                        <Button className='btn-outline-info' icon={<PlusCircleOutlined />}
                            onClick={() => setOpenModalProduct(true)}
                            disabled={disabledEdit}> Hàng hóa có sẵn </Button></>
                </Space>}
            >
                <Form.Item
                    name="orderContents"
                    rules={[{ validator: checkValidate }]}
                >
                    <ContentTable
                        caseTypeId={caseTypeId}
                        disabledEdit={disabledEdit}
                        form={props.form}
                        expand={expand}
                        openModalProduct={openModalProduct}
                        setOpenModalProduct={setOpenModalProduct}
                        productList={productList}
                        onChangeItemContent={props.onChangeItemContent}
                    />
                </Form.Item>
            </Card>
            }
        </>
    );
};
type Props = {
    form: FormInstance<any>,
    required?: boolean,
    vas?: VaDto[],
    isServiceDocument: boolean,
    isHasPhatMotPhan: boolean,
    onChangeItemContent?: (contents: OrderContentDto[]) => void
}
ContentInfo.defaultProps = {
    required: true
}
export default ContentInfo;