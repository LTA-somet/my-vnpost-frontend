import { MenuFoldOutlined, MenuUnfoldOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { BasicLayoutProps } from '@ant-design/pro-layout';
import HeaderSearch from '../HeaderSearch';
import { Link } from 'umi';
import { Col, Row } from 'antd';
import './style.css';

const HeaderContent = (props: BasicLayoutProps) => {
    return (
        <div>
            <Row>
                <Col> <div
                    onClick={() => props.onCollapse?.(!props.collapsed)}
                    style={{
                        cursor: 'pointer',
                        fontSize: '16px',
                        height: '100%',
                        width: '50px',
                        textAlign: 'center'
                    }}
                    className={'g-collapse'}
                >
                    {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </div></Col>
                <Col> <HeaderSearch /></Col>
                <Col style={{ marginTop: 0.5 }}>
                    <Link to={'/order/create'} className={'ant-btn btn-primary1'} style={{ marginLeft: 6 }}>{<PlusCircleOutlined />} Tạo đơn </Link>
                </Col>
            </Row>

            {/* <div className="bg">
                ABC
            </div> */}
        </div>
    );
};

export default HeaderContent;