import { BackwardOutlined, ForwardOutlined } from "@ant-design/icons";
import React from "react";

import { VisibilityContext } from "react-horizontal-scrolling-menu";

function Arrow({
    disabled,
    icon,
    onClick
}: {
    disabled: boolean;
    icon: any;
    onClick: VoidFunction;
}) {
    return (
        <div style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>
            {icon ? <BackwardOutlined hidden={disabled} style={{ color: "#fdb813" }} onClick={onClick} /> : <ForwardOutlined hidden={disabled} style={{ color: "#fdb813" }} onClick={onClick} />}
        </div>

    );
}

export function LeftArrow() {
    const {
        isFirstItemVisible,
        scrollPrev,
        visibleItemsWithoutSeparators,
        initComplete
    } = React.useContext(VisibilityContext);

    const [disabled, setDisabled] = React.useState(
        !initComplete || (initComplete && isFirstItemVisible)
    );
    React.useEffect(() => {
        // NOTE: detect if whole component visible
        if (visibleItemsWithoutSeparators.length) {
            setDisabled(isFirstItemVisible);
        }
    }, [isFirstItemVisible, visibleItemsWithoutSeparators]);

    return (
        <Arrow disabled={disabled} onClick={() => scrollPrev()} icon={true} />
    );
}

export function RightArrow() {
    const {
        isLastItemVisible,
        scrollNext,
        visibleItemsWithoutSeparators
    } = React.useContext(VisibilityContext);

    // console.log({ isLastItemVisible });
    const [disabled, setDisabled] = React.useState(
        !visibleItemsWithoutSeparators.length && isLastItemVisible
    );
    React.useEffect(() => {
        if (visibleItemsWithoutSeparators.length) {
            setDisabled(isLastItemVisible);
        }
    }, [isLastItemVisible, visibleItemsWithoutSeparators]);

    return (
        <Arrow disabled={disabled} onClick={() => scrollNext()} icon={false} />
    );
}
