import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, notification, Row } from 'antd';
import React, { useState } from 'react';
import { OrderHdrApi } from '@/services/client';
import { useHistory } from 'umi';
import './index.less';

const orderHdrApi = new OrderHdrApi();
const HeaderSearch: React.FC = () => {
  const [value, setValue] = useState<string>();
  const history = useHistory();

  const onSearch = () => {
    if (!value) return;
    orderHdrApi.searchByOrderCodeOrItemCode(value)
      .then(resp => {
        if (resp.data) {
          const order = resp.data;
          if (order.orderSent) {
            history.push('/manage/order-manager/sender/' + order.orderHdrId);
          } else {
            history.push('/manage/order-manager/receiver/' + order.orderHdrId);
          }
        } else {
          notification.info({ message: "Không tìm thấy đơn hàng nào" });
        }
      }).finally(() => setValue(''))
  }

  return (
    <span
      className={'headerSearch'}
    >
      {/* <Input.Group compact> */}
      <Row gutter={8}>
        <Col>
          <Input className={'inputSearch'} style={{ borderColor: '#rgb(174 183 185)', borderRadius: '5px', height: '32px' }} value={value}
            placeholder="Mã vận đơn/Mã đơn hàng" onChange={(e) => setValue(e.target.value)} onPressEnter={onSearch} />
        </Col>
        <Col style={{ marginTop: 0, marginRight: 2 }} >
          <Button style={{ width: '35px', marginTop: '9px' }} icon={<SearchOutlined />} className="btn-outline-info" onClick={onSearch}></Button>
        </Col>
      </Row>
      {/* </Input.Group> */}
    </span>
  );
};

export default HeaderSearch;
