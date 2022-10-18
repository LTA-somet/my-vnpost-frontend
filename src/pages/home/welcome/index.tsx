import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert } from 'antd';
import './Welcome.less';

export default (): React.ReactNode => {
  return (
    <PageContainer>
      <Card>
        <div className="logo"><img src="/icons/comingsoon.svg" width="220px" /></div>
        <Alert
          message="Coming Soon"
          type="info"
          showIcon
          banner
        />
      </Card>
    </PageContainer>
  );
};
