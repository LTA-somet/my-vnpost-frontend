import { useEffect, useState } from 'react';
import { Tag, message, Modal, notification } from 'antd';
import { groupBy } from 'lodash';
import moment from 'moment';
import { useModel, history } from 'umi';

import NoticeIcon from './NoticeIcon';
import styles from './index.less';
import { NotifyManagerApi, LibraryInfoApi } from '@/services/client';
import { useCurrentUser } from '@/core/selectors';
import { type } from './../../utils/orderHelper';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { b64toBlob } from '@/utils';

export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

const notifyManagerApi = new NotifyManagerApi();
const libraryInfoApi = new LibraryInfoApi();

const { confirm } = Modal;

// const getNoticeData = (notices: any[]): Record<string, any[]> => {
//   if (!notices || notices.length === 0 || !Array.isArray(notices)) {
//     return {};
//   }

//   const newNotices = notices.map((notice) => {
//     const newNotice = { ...notice };

//     if (newNotice.datetime) {
//       newNotice.datetime = moment(notice.datetime as string).fromNow();
//     }

//     if (newNotice.id) {
//       newNotice.key = newNotice.id;
//     }

//     if (newNotice.extra && newNotice.status) {
//       const color = {
//         todo: '',
//         processing: 'blue',
//         urgent: 'red',
//         doing: 'gold',
//       }[newNotice.status];
//       newNotice.extra = (
//         <Tag
//           color={color}
//           style={{
//             marginRight: 0,
//           }}
//         >
//           {newNotice.extra}
//         </Tag>
//       ) as any;
//     }

//     return newNotice;
//   });
//   return groupBy(newNotices, 'type');
// };

// const getUnreadData = (noticeData: Record<string, any[]>) => {
//   const unreadMsg: Record<string, number> = {};
//   Object.keys(noticeData).forEach((key) => {
//     const value = noticeData[key];

//     if (!unreadMsg[key]) {
//       unreadMsg[key] = 0;
//     }

//     if (Array.isArray(value)) {
//       unreadMsg[key] = value.filter((item) => !item.read).length;
//     }
//   });
//   return unreadMsg;
// };

const NoticeIconView = () => {

  //const { initialState } = useModel('@@initialState');
  //const { currentUser } = initialState || {};
  const currentUser = useCurrentUser();
  //const [notices, setNotices] = useState<any[]>([]);
  //const { data } = useRequest(getNotices);

  const [notifyDataReaded, setNotifyDataReaded] = useState<any[]>([]);
  const [notifyDataNotRead, setNotifyDataNotRead] = useState<any[]>([]);
  const [notifyDataNews, setNotifyDataNews] = useState<any[]>([]);

  //const noticeData = getNoticeData(notices);
  //const unreadMsg = getUnreadData(noticeData || {});

  const notifyManager = () => {
    notifyManagerApi.getNotifyManagerByUser(2).then(resp => {
      if (resp.status === 200) {
        //console.log('resp->notifyManager', resp);        
        if (resp.data.length > 0) {
          setNotifyDataReaded(resp.data.filter(item => {
            return (item.type === 1 && item.notifyCode !== '15');
          })
          );

          setNotifyDataNotRead(resp.data.filter((item) => item.type !== 1 && item.notifyCode !== '15'));

          setNotifyDataNews(resp.data.filter((item) => item.notifyCode === '15'));
        }

      }
    }).catch((err) => {
      // message.error("L???i trong khi l???y danh s??ch c??c th??ng b??o! " + err)
    });
  }

  useEffect(() => {
    if (currentUser !== undefined) {
      notifyManager();
    }
    // setNotices([{
    //   id: '000000001',
    //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    //   title: 'Test Th??ng b??o',
    //   datetime: '2017-08-09',
    //   type: 'notification',
    // },
    // {
    //   id: '000000002',
    //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
    //   title: 'Th??ng b??o 2',
    //   datetime: '2017-08-08',
    //   type: 'notification',
    // },
    // {
    //   id: '000000003',
    //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
    //   title: 'Th??ng b??o 3',
    //   datetime: '2022-08-08',
    //   type: 'notification',
    // }
    // ]);
  }, [currentUser]);

  // const changeReadState = (id: string) => {
  //   message.success('Item click' + id);
  //   setNotices(
  //     notices.map((item) => {
  //       const notice = { ...item };
  //       if (notice.id === id) {
  //         notice.read = true;
  //       }
  //       return notice;
  //     }),
  //   );
  // };

  // const deleteItem = (id: string) => {
  //   message.success('deleteItem' + id);
  //   setNotices(
  //     notices.map((item) => {
  //       const notice = { ...item };
  //       if (notice.id === id) {
  //         notice.read = true;
  //       }
  //       return notice;
  //     }),
  //   );
  // };
  const showFile = (base64: string, contentType: string = 'application/pdf') => {
    const blob = b64toBlob(base64, contentType);
    const blobURL = window.URL.createObjectURL(blob);
    const theWindow = window.open(blobURL);
    const theDoc = theWindow!.document;
    const theScript = document.createElement("script");
    // function injectThis() {
    //     window.print();
    // }
    //theScript.innerHTML = `window.onload = ${injectThis.toString()};`;
    theDoc.body.appendChild(theScript);
  }
  const clearReadState = (title: string, key: string) => {
    // setNotices(
    //   notices.map((item) => {
    //     const notice = { ...item };
    //     if (notice.type === key) {
    //       notice.read = true;
    //     }
    //     return notice;
    //   }),
    // );
    if (key === 'NotRead') {
      confirm({
        title: '????nh d???u ???? ?????c',
        icon: <ExclamationCircleOutlined />,
        content: 'B???n mu???n ????nh d???u t???t c??? c??c th??ng b??o th??nh ???? ?????c kh??ng?',
        okText: '?????ng ??',
        okType: 'danger',
        cancelText: '????ng',
        onOk() {
          notifyManagerApi.updateReadAll().then(resp => {
            if (resp.status === 200) {
              message.success('C???p nh???t th??nh c??ng');
            }
          }).catch((err) => {
            message.error('L???i trong khi th???c hi???n ????nh d???u ?????c! ' + err);
          })
        },
      })
    }
    else {
      confirm({
        title: 'X??a th??ng b??o ???? ?????c',
        icon: <ExclamationCircleOutlined />,
        content: 'B???n mu???n x??a c??c th??ng b??o ???? ?????c kh??ng?',
        okText: '?????ng ??',
        okType: 'danger',
        cancelText: '????ng',
        onOk() {
          notifyManagerApi.deleteAllReaded().then(resp => {
            if (resp.status !== 204) {
              message.error('C?? l???i trong khi x??a');
            }
          }).catch((err) => {
            message.error('L???i trong khi th???c hi???n x??a!' + err);
          });
        },
      })
    }
    //message.success('clearReadState: ' + key);
    //history.push({ pathname: '/manager/notify-manager/', query: { notRead: key }, state: { notifyData: key === 'NotRead' ? notifyDataNotRead : notifyDataReaded } })
    //history.push('{ pathname: /manager/order-manager', query: { orderType: '3' } });

  };

  return (

    <NoticeIcon
      className={styles.action}
      count={notifyDataReaded.length + notifyDataNotRead.length}
      onItemClick={(key: string, item: API.NoticeIconItem) => {
        console.log(' key ', key, ' item ', item)
        //changeReadState(item.id!);
        if (item.libraryInfoId > 0) {
          notifyManagerApi.updateRead(item.id).then(resp => {
            if (resp.status === 200) {
              message.success("Th??ng b??o n??y ???? ???????c ????nh d???u ???? ?????c")
            }
          }).catch((err) => {
            message.error("L???i trong khi th???c hi???n ????nh d???u ?????c! " + err);
          });

          libraryInfoApi.getLibraryInfoId(item.libraryInfoId).then(resp => {
            console.log('libraryInfoId: ', resp);
            if (resp.status === 200) {
              if (resp.data.descriptions !== null && resp.data.descriptions !== undefined) {
                history.push({
                  pathname: '/manage/library-manager/viewitem/', query: { idkey: item.libraryInfoId },
                  state: {
                    descriptions: resp.data.descriptions
                  }
                });
              }
              else if (resp.data.dataPdf) {
                showFile(resp.data.dataPdf);
              }
              //setDescription(resp.data.descriptions);
            }
          }).catch((err) => {
            notification.error({ message: "L???i trong khi l???y th??ng tin tin t???c! " + err });
          })


        }
        else {
          if (key === 'NotRead') {
            history.push({
              pathname: '/manage/notify-manager/', query: { notRead: key },
              state: {
                notifyData: notifyDataNotRead.filter((itemfil) => { return itemfil.id === item.id }),
                iId: item.id,
                statusRead: key
              }
            });
          }
          else {
            history.push({
              pathname: '/manage/notify-manager/', query: { notRead: key },
              state: {
                notifyData: notifyDataReaded.filter((itemfil) => { return itemfil.id === item.id }),
                iId: item.id,
                statusRead: key
              }
            })
          }
        }

        //   history.push({ pathname: '/manager/notify-manager/', query: { notRead: 'ALL' }, state: { notifyData: "[]", iId: item.id } })
      }}
      onClear={(title: string, key: string) => clearReadState(title, key)}
      loading={false}
      clearText="Xo?? "
      viewMoreText="Xem t???t c???"
      onViewMore={() =>
        //message.info('Xem tat ca')
        history.push({ pathname: '/manage/notify-manager/', query: { notRead: 'ALL' }, state: { notifyData: "[]", iId: 0, statusRead: 'ALL' } })
      }
      clearClose
    >
      <NoticeIcon.Tab
        tabKey="NotRead"
        count={notifyDataNotRead.length}
        list={notifyDataNotRead}
        title="Ch??a ?????c"
        emptyText="kh??ng th??ng b??o n??o"
        showViewMore
        showClear
      />
      <NoticeIcon.Tab
        tabKey="Readed"
        count={notifyDataReaded.length}
        list={notifyDataReaded}
        title="???? ?????c"
        emptyText="kh??ng th??ng b??o n??o"
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="event"
        title="Tin t???c"
        emptyText="kh??ng th??ng b??o n??o"
        count={notifyDataNews.length}
        list={notifyDataNews}
        showViewMore
      />
    </NoticeIcon >

  );
};

export default NoticeIconView;
