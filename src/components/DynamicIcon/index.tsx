import { dynamic } from 'umi';

export default dynamic({
    loader: async function (props: { type: string }) {
        // webpackChunkName tells webpack create separate bundle for HugeA
        const { default: DynamicIcon } = await import(`@ant-design/icons/es/icons/${props.type}.js`);
        return DynamicIcon;
    },
});