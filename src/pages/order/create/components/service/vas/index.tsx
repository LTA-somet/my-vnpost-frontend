import { McasVaServiceDto, VaDto } from '@/services/client';
import { addOrUpdateToDataSource, deleteFromDataSource } from '@/utils/dataUtil';
import { FormInstance } from 'antd';
import React, { useEffect, useState } from 'react';
import VaItem from './va-item';


export type PropertyFieldProps = {
    propCode: string,
    propName: string,
    required: boolean,
    defaultValue: string
}
// export type PropertyValueProps = {
//     propCode: string,
//     propValue: string
// }

export type VasFieldProps = {
    vaCode: string,
    propertyList: PropertyFieldProps[]
}

// export type VasValueProps = {
//     vaServiceId: string,
//     checked: boolean,
//     propertyList: PropertyValueProps[]
// }

type Props = {
    vasCaseTypeId?: number
    extend?: boolean, // là dịch vụ cộng thêm
    value?: VaDto[],
    onChange?: (value: VaDto[]) => void;
    vasList: McasVaServiceDto[],
    form: FormInstance<any>,
}

const VasService: React.FC<Props> = ({ value = [], onChange, vasList = [], extend = false, vasCaseTypeId, form }) => {
    const [vas, setVas] = useState<McasVaServiceDto[]>([]);
    useEffect(() => {
        setVas(vasList.filter(v => v.extend === extend));
    }, [vasList])

    const onChangeItem = (checked: boolean, vaValue: VaDto) => {

        if (checked) {
            const newValue: VaDto[] = addOrUpdateToDataSource(value, vaValue, 'vaCode');
            onChange?.(newValue);
        } else {
            const newValue: VaDto[] = deleteFromDataSource(value, vaValue.vaCode, 'vaCode');
            onChange?.(newValue);
        }
    }

    // if (vas.length === 0 && extend) {
    //     return '';
    // }

    return (
        <div
            id="scrollableDiv"
            style={{
                width: '100%',
                // border: '1px solid rgba(140, 140, 140, 0.35)',
                margin: 0,
                // marginBottom: extend ? 20 : 0
            }}
        >
            <div style={{ backgroundColor: '#fff3d8', padding: '5px 5px', width: '100%', border: '1px solid rgba(140, 140, 140, 0.35)', fontWeight: 500, color: '#004588', textAlign: 'center' }}>
                {extend ? 'Yêu cầu bổ sung' : 'Dịch vụ cộng thêm'}</div>
            <div style={{
                maxHeight: 200,
                overflow: 'auto',
            }}>
                <table style={{ width: '100%', borderLeft: '1px solid rgba(140, 140, 140, 0.35)' }}>
                    {vas.map(vaField => {
                        const vaValue = value.find(v => v.vaCode === vaField.vaServiceId)
                        return <VaItem
                            key={vaField.vaServiceId}
                            disable={!!vasCaseTypeId && !vaField.caseTypeEditable?.includes(String(vasCaseTypeId))}
                            onChange={onChangeItem}
                            value={vaValue}
                            vaField={vaField}
                            form={form}
                        />;
                    })}
                </table>
                {vas.length === 0 && !extend && <div style={{ textAlign: 'center', padding: '10px', border: '1px solid rgba(140, 140, 140, 0.35)', borderTop: 0 }}>Không có dịch vụ cộng thêm</div>}
                {vas.length === 0 && extend && <div style={{ textAlign: 'center', padding: '10px', border: '1px solid rgba(140, 140, 140, 0.35)', borderTop: 0 }}>Không có yêu cầu bổ sung</div>}
            </div>
        </div>
    );

};
export default VasService;