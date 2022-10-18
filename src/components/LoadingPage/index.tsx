
import React from 'react';
import './loading.css';

const LoadingPage: React.FC<Props> = (props: Props) => {
    return (
        <div className='load-data'>
            <div className="loader" />
            <div style={{ fontSize: 16, marginTop: 10, fontWeight: 500 }}>{props.message}</div>
        </div>
    )
}
type Props = {
    message?: string
}
LoadingPage.defaultProps = {
    message: 'Đang lấy dữ liệu...'
}
export default LoadingPage;