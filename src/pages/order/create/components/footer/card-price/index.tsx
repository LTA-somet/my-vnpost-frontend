import { Dropdown } from 'antd';
import React from 'react';
import './style.css';

const CardPrice: React.FC<Props> = (props: Props) => {
    return (
        <div className='g-card-container' hidden={props.disabled} style={props.style}>
            <div className='g-card-content'>
                <div className='g-card-title'>
                    {props.title}
                </div>
                {props.price && <div className='g-card-price'>
                    {props.price}
                </div>}
                {props.description && <div className='g-card-description'>
                    {props.description}
                </div>}
            </div>
            {props.icon && <div className='g-card-icon'  >
                {props.menu ?
                    <Dropdown overlay={<>{props.menu}</>} placement="top" arrow>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            {props.icon}
                        </a>
                    </Dropdown>
                    :
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        {props.icon}
                    </a>
                }
            </div >}
        </div >
    );
};
type Props = {
    disabled?: boolean,
    title: string | React.ReactNode,
    price?: number | string,
    description?: string | React.ReactNode,
    icon?: React.ReactNode,
    menu?: React.ReactNode,
    style?: React.CSSProperties;
}
CardPrice.defaultProps = {
    disabled: false
}

export default CardPrice;