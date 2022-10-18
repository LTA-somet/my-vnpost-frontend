import { useIntl } from 'umi';
import { DefaultFooter } from '@ant-design/pro-layout';
import { FacebookOutlined } from '@ant-design/icons';
import { useCurrentUser } from '@/core/selectors';
import './fontawesome-free/css/all.min.css';
import zalo from './img/zalo.png';
import viber from './img/viber.png';
import { MapBdtTinhApi, MapBdtTinhUserCallAndChatDto } from '@/services/client';
import { useEffect, useState } from 'react';

const mapBdtTinhApi = new MapBdtTinhApi();
export default () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '蚂蚁集团体验技术部出品',
  });

  const currentYear = new Date().getFullYear();
  const currentUser = useCurrentUser();

  const [objCallChat, setObjCallChat] = useState<MapBdtTinhUserCallAndChatDto>({});
  const getDataMapBdtTinh = () => {
    mapBdtTinhApi.findByAccntCode().then((res) => {
      if (res.status === 200) {
        setObjCallChat(res.data);
      }
    })
  }

  useEffect(() => {
    if (currentUser) {
      getDataMapBdtTinh();
    }
  }, []);

  return (
    // <DefaultFooter
    //   copyright={`${currentYear} ${defaultMessage}`}
    //   links={[
    //     { key: 'Copyright © 2022 Viet Nam Post. All Rights Reserved.', title: 'Copyright © 2022 Viet Nam Post. All Rights Reserved.', href: 'javascript:void(0)' },
    //     { key: 'Designed by', title: 'Designed by: ', href: 'javascript:void(0)' },
    //     // { key: 'fpt.org', title: 'fpt.org', href: '' },
    //   ]}
    // />
    <>
      <DefaultFooter
        copyright={`${currentYear} ${defaultMessage}`}
        links={[
          {
            key: 'Tel',
            title: <><i style={{ marginTop: 5, fontSize: 26, padding: '0px 15px', transform: 'rotate(90deg)' }} className="fa fa-phone-square"></i>
              <span style={{ borderRight: '1px dotted #4277af' }}></span>
              <p style={{ fontSize: '11px', lineHeight: '14px', marginBottom: 0 }}>Tel</p>
            </>,
            href: `tel:${objCallChat.hotLine}`,
            blankTarget: true,
          },
          {
            key: 'Facebook',
            title: <><FacebookOutlined style={{ marginTop: 5, fontSize: 26, padding: '0px 15px' }} />
              <span style={{ borderRight: '1px dotted #4277af' }}></span>
              <p style={{ fontSize: '11px', lineHeight: '14px', marginBottom: 0 }}>Facebook</p>
            </>,
            href: `${objCallChat.facebook}`,
            blankTarget: true,
          },
          {
            key: 'Zalo',
            title: <>
              <div style={{ borderRight: '1px dotted #4277af', marginTop: '14px', height: '18px' }}>

              </div>
              <div style={{ marginTop: '-31px' }}>
                <img style={{ padding: '0px 15px' }} src={zalo} alt="zalo" />
                <p style={{ fontSize: '11px', lineHeight: '6px', marginBottom: 0 }}>Zalo</p>
              </div>
            </>,
            // <img style={{ padding: '0px 15px' }} src={zalo} alt="zalo" /><p style={{ fontSize: '11px', lineHeight: '6px', marginBottom: 0 }}>Zalo</p>
            href: `${objCallChat.zalo}`,
            blankTarget: true,
          },
          {
            key: 'Viber',
            title: <><img style={{ padding: '0px 15px', marginTop: 2 }} src={viber} alt="viber" /><p style={{ fontSize: '11px', lineHeight: '12px', marginBottom: 0 }}>Viber</p></>,
            href: `${objCallChat.viber}`,
            blankTarget: true,
          },
        ]}
      />
    </>
  );
};
