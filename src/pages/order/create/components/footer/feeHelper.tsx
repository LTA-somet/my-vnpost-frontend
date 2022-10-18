import { McasVaServiceDto, OrderAddonDto, OrderBillingDto, OrderBillingDtoPatternEnum, OrderHdrDto } from "@/services/client";
import { formatCurrency } from "@/utils";
import { Card } from "antd";
import { ReactNode } from "react";
import { FeeContent } from ".";

export const detectFee = (orderHdrDto: OrderHdrDto, billing: OrderBillingDto[] = [], vasList: McasVaServiceDto[], batch?: OrderHdrDto[]) => {
    // Tab 1: Tổng cước tạm tính
    const feeNotRate = billing.filter((b) => b.pattern !== OrderBillingDtoPatternEnum.Rate);
    const totalFee = feeNotRate?.reduce((a, b: OrderBillingDto) => a + b.fee!, 0);

    // cước chính
    const mainFee = billing?.find((b) => b.pattern === OrderBillingDtoPatternEnum.Main);
    // DVCT
    const vas = billing?.filter(
        (b) => b.pattern === OrderBillingDtoPatternEnum.Vas && b.fee !== 0 && !b.isExtend,
    );
    const totalVas = vas?.reduce((a, b: OrderBillingDto) => a + b.fee!, 0);
    // Phụ cước
    const vasExtend = billing?.filter(
        (b) => b.pattern === OrderBillingDtoPatternEnum.Vas && b.fee !== 0 && b.isExtend,
    );
    const totalVasExtend = vasExtend?.reduce((a, b: OrderBillingDto) => a + b.fee!, 0);

    const feeNode = (
        <Card style={{ width: 400 }}>
            <div style={{ padding: '5px' }} className="g-pane-container g-bold" >
                <div>Cước chính:</div> <div>{formatCurrency(mainFee?.fee)} đ </div>
            </div>
            <div style={{ padding: '5px' }} className="g-pane-container g-bold" >
                <div>Tổng cước dịch vụ cộng thêm:</div>
                <div>{formatCurrency(totalVas)} đ </div>
            </div>
            &#9;
            {vas?.map((va) => (
                <div style={{ padding: '5px' }} className="g-pane-container">
                    <div>--- {va.serviceName}:</div> <div>{formatCurrency(va.fee)} đ</div>
                </div>
            ))}
            <div style={{ padding: '5px' }} className="g-pane-container g-bold" >
                <div>Tổng cước yêu cầu bổ sung:</div>
                <div>{formatCurrency(totalVasExtend)} đ </div>
            </div>
            &#9;
            {vasExtend?.map((va) => (
                <div style={{ padding: '5px' }} className="g-pane-container">
                    <div>--- {va.serviceName}:</div>
                    <div>{formatCurrency(va.fee)} đ </div>
                </div>
            ))}
        </Card>
    );

    // Tab 2: Tổng tiền thu hộ
    let totalFeeReceiver: number = 0;

    const propsNode: ReactNode[] = []; // danh sách prop tính cước thu nơi người nhận

    const sumInBatch = (propCode: string): number => {
        const fakeBatch = batch && batch.length > 0 ? batch : [orderHdrDto];
        let totalSum = 0;
        fakeBatch.forEach(item => {
            let allAddons: OrderAddonDto[] = [];
            item.vas?.forEach((va) => {
                allAddons = allAddons.concat(va.addons!);
            });
            const addon = allAddons.find((a) => a.propCode === propCode);
            totalSum += +(addon?.propValue || '0');
        });
        return totalSum;
    }

    vasList.forEach((va) => {
        va.propsList?.forEach((p) => {
            // if (p.codType === 1 && p.isSumCod === 1) {
            // if (p.isSumCod === 1) {
            if (p.codType === 1 && p.divideType === 'PB') {
                const propValue = sumInBatch(p.propCode!);
                totalFeeReceiver += propValue;
                propsNode.push(
                    <div style={{ padding: '5px' }} className="g-pane-container g-bold" >
                        <div>
                            {p.propName?.trim() ?? va.vaServiceNameVnp?.trim() ?? va.vaServiceName?.trim()}:
                        </div>{' '}
                        <div>{formatCurrency(propValue)} đ </div>
                    </div>
                );
            }
        });
    });
    const feeReceiverNode = <Card style={{ width: 400 }}>{propsNode}</Card>;

    // tab 3: Tiền thu người gửi
    const totalFeeSender = orderHdrDto.isContractC ? totalFee : 0;

    const newFeeContent: FeeContent = {
        billing: billing,
        totalFee: totalFee,
        totalFeeReceiver: totalFeeReceiver,
        totalFeeSender: totalFeeSender,
        feeNode: feeNode,
        feeReceiverNode: feeReceiverNode,
        priceWeight: orderHdrDto.priceWeight
    };
    return newFeeContent;
    // setFeeContent(newFeeContent);
};