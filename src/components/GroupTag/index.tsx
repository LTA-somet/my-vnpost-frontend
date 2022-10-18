import { Collapse } from "antd";
import { useEffect, useState } from "react";
import { useModel } from "umi";
import './style.css';

type Props = {
    isBatch: boolean,
    title: string,
    children: any
}
const GroupTag = (props: Props) => {
    const [activeKey, setActiveKey] = useState<string[]>(['1']);
    const { focusBatchInfo, onFocusBatchInfo, onOutFocusBatchInfo } = useModel('orderModel');

    useEffect(() => {
        setActiveKey(focusBatchInfo ? ['1'] : []);
    }, [focusBatchInfo]);

    const onChange = (key: string | string[]) => {
        const isShow = key && key.length > 0;
        if (isShow) {
            onFocusBatchInfo();
        } else {
            onOutFocusBatchInfo();
        }
    };

    if (props.isBatch) {
        return <Collapse activeKey={activeKey} className="g-group-tag fadeInRight" onChange={onChange}>
            <Collapse.Panel header={<b>{props.title}</b>} key="1">
                {props.children}
            </Collapse.Panel>
        </Collapse>
    }
    return props.children;
}
export default GroupTag;