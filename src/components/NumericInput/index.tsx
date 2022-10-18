import { InputNumber } from 'antd';

const NumericInput = (props: { value?: string, onChange?: any }) => {
    const { value, onChange } = props;

    const handleChange = (val: string) => {
        const reg = /^-?\d*(\.\d*)?$/;

        if (reg.test(val) || val === '' || val === '-') {
            onChange(val);
        }
    };

    return <InputNumber
        {...props}
        style={{ width: '100%' }}
        min={0} max={1000000000}
        precision={0}
        value={value}
        onChange={handleChange}
    />;
};
export default NumericInput;