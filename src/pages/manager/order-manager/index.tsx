import {
  ConfigDisplayDto,
  OrderHdrDisplayDto,
  OrderHdrDto,
  OrderStatusDto,
  ParamSearchAllDto,
  OrderCorrectionCase,
  DmFeildDisplayEntity,
  CmsCustomerApi,
  CmsCustomerDto
} from '@/services/client';
import {
  McasUserApi,
  TerminateOrderControllerApi,
} from '@/services/client';
import { ContactApi } from '@/services/client';
import {
  ConfigDisplayApi,
  DmFeildDisplayApi,
  OrderHdrApi,
  OrderStatusApi,
  ProductApi,
  OrderCorrectionControllerApi,
  OrderCorrectionApi,
} from '@/services/client';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileAddOutlined,
  PictureOutlined,
  PlusCircleOutlined,
  PlusSquareOutlined,
  PrinterOutlined,
  RetweetOutlined,
  SearchOutlined,
  SettingOutlined,
  CheckSquareOutlined,
  BorderOutlined,
  DownloadOutlined,
  FileOutlined,
  ArrowRightOutlined,
  ForwardOutlined,
  BarcodeOutlined,
  ClearOutlined,
  ExportOutlined,
  DoubleRightOutlined,
  ReloadOutlined,
  StarOutlined,
} from '@ant-design/icons';
import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Button,
  Select,
  Spin,
  Dropdown,
  Menu,
  Space,
  DatePicker,
  Popconfirm,
  Table,
  Tree,
  Modal,
  notification,
} from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { dataToSelectBox, downloadFile, printFile } from '@/utils';
import { formatCurrency } from '@/utils';
import ShowSettingsOrder from './show-settings';
import { validateMessages } from '@/core/contains';
import defineColumns from './columns';
import moment, { Moment } from 'moment';
import './index.less';
import "./hideScrollbar.css";
import { Link, useHistory, useLocation, useModel } from 'umi';
import { deleteFromDataSource, updateToDataSource } from '@/utils/dataUtil';
import BarcodeViewer from '@/pages/setting/orderhdr-item/component/barCode/barcodeViewer';
import PrintOrderForm from '@/components/PrintOrder/print-order';
import Address2 from '@/components/Address/Address';
import ShowImage from '@/pages/setting/orderhdr-item/component/upload-picture/showImage';
import { useCurrentUser } from '@/core/selectors';
import type { DataNode } from 'antd/lib/tree';
import { PageContainer } from '@ant-design/pro-layout';
import type { RangePickerProps } from 'antd/lib/date-picker';
// import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from './arrows';
import { CardScroll } from './card';
import type { VisibilityContext } from 'react-horizontal-scrolling-menu';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import usePreventBodyScroll from './usePreventBodyScroll';
import { isBuffer } from 'lodash';
import EvaluateSender from '@/pages/setting/orderhdr-item/component/evaluate/evaluateSender';
import EvaluateReceived from '@/pages/setting/orderhdr-item/component/evaluate/evaluateReceived';
type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

const listTypeOrder = [
  { id: '1', name: 'Đơn hàng gửi' },
  { id: '2', name: 'Đơn hàng trong ngày' },
  { id: '3', name: 'Đơn hàng nháp' },
  { id: '4', name: 'Đơn hàng nhận' },
];

const listFeePayer = [
  { id: false, name: 'Người gửi' },
  { id: true, name: 'Người nhận' },
];

const listCod = [
  { id: false, name: 'Không' },
  { id: true, name: 'Có' },
];

const listCreatedChannel = [
  { id: 'WMVNP', name: 'Web' },
  { id: 'AMVNP', name: 'APP' },
  // { id: 'APICUS', name: 'API khách hàng' },
  // { id: 'API', name: 'API đối tác' },
];

const listDataSources = [
  { id: 'MYVNP', name: 'My VietNamPost' },
  { id: 'BCCP', name: 'Hệ thống khác' },
];

const orderStatusApi = new OrderStatusApi();
const configDisplayApi = new ConfigDisplayApi();
const orderHdrApi = new OrderHdrApi();
const productApi = new ProductApi();
const dmFeildDisplayApi = new DmFeildDisplayApi();
const contactApi = new ContactApi();
const orderCorrectionControllerApi = new OrderCorrectionControllerApi();
const orderCorrectionApi = new OrderCorrectionApi();
const mcasUserApi = new McasUserApi();
const terminateOrderControllerApi = new TerminateOrderControllerApi();
const cmsCustomerApi = new CmsCustomerApi();

const isProd = REACT_APP_ENV === 'prod';

const OrderManager = () => {
  // const [isView, setIsView] = useState<boolean>(false);
  const currentUser = useCurrentUser();
  const [paramSearch, setParamSearch] = useState<ParamSearchAllDto>();
  const [recordDisplay, setRecordDisplay] = useState<any>();
  const [recordOrderHdr, setRecord] = useState<OrderHdrDisplayDto>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [listDmFeildDisplay, setListDmFeildDisplay] = useState<DmFeildDisplayEntity[]>([]);
  const [orderHdrTableFilter, setOrderHdrTableFilter] = useState<OrderHdrDisplayDto[]>([]);
  const [opAccounts, setOpAccounts] = useState<any[]>([]);
  const [cmsCustomer, setCmsCustomer] = useState<CmsCustomerDto[]>([]);
  const [opDelegater, setOpDelegater] = useState<any[]>([]);
  const [totalRecord, setTotalRecord] = useState<number>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [dataList, setTreeList] = useState<any[]>([]);
  const [orderStatusList, setOrderStatusList] = useState<any[]>([]);
  const [refDataList, setRefDataList] = useState<any[]>([]);
  const [orderStatusTmp, setOrderStatusTmp] = useState<OrderStatusDto[]>([]);
  const [isShowSettingsOrder, setIsShowSettingsOrder] = useState<boolean>(false);
  const [isShowPrint, setIsShowPrint] = useState<boolean>(false);
  const [mauinDefault, setmauInDefault] = useState<string>();
  const [isShowBarCode, setIsShowBarCode] = useState<boolean>(false);
  const [isShowImage, setIsShowImage] = useState<boolean>(false);
  const [isShowEvaluate, setIsShowEvaluate] = useState<boolean>(false);
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);

  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const [isShowSelectAll, setIsShowSelectAll] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkedList, setCheckedList] = useState<React.Key[]>([]);
  const [isShowCreatedBy, setIsShowCreatedBy] = useState<boolean>(false);
  const [isShowCreatedChannel, setIsShowCreatedChannel] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [ItemCode, setItemCode] = useState<string>('');
  const [ChoosedCorrectionField, setChoosedCorrectionField] = useState<string>('');
  const [CorrectionItems, setCorrectionItems] = useState<OrderCorrectionCase[]>([]);
  const [cancelOrderFee, setCancelOrderFee] = useState<number>(0);
  const [disableDate, setDisableDate] = useState<any>();
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isChangeDate, setIsChangeDate] = useState<boolean>(false);

  const printRef = useRef<any>();
  const history = useHistory();

  // lấy loại vận đơn ở url query
  const location: any = useLocation();
  const orderTypeInit = location?.query?.orderType || '1';
  const statusInit = location?.query?.status ? location?.query?.status.split(',') : [];
  const orgCodeInit = location?.query?.orgCode ? location?.query?.orgCode.split(',') : [];
  const ownerInit = location?.query?.owner;
  const fromDateInit = location?.query?.fromDate ? moment(location?.query?.fromDate, 'DD/MM/YYYY') : undefined;
  const toDateInit = location?.query?.toDate ? moment(location?.query?.toDate, 'DD/MM/YYYY') : undefined;

  const [lstStatus, setLstStatus] = useState<any[]>(statusInit);
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState<boolean>(orgCodeInit.length > 1);
  const [isChangeOwner, setIsChangeOwner] = useState<boolean>(true);

  useEffect(() => {
    if (isShowImage && isShowBarCode && isShowPrint && isShowSettingsOrder) document.body.style.overflow = 'unset';
    else document.body.style.overflow = 'visible';
  }, [isShowImage, isShowBarCode, isShowPrint, isShowSettingsOrder]);

  useEffect(() => {
    if (location?.query?.orgCode) {
      if (orgCodeInit.length === 1 && orgCodeInit[0] === currentUser.org) {
        setIsChangeOwner(true)
      } else {
        setIsChangeOwner(false)
      }
    }
  }, [currentUser.org, location?.query?.orgCode, orgCodeInit])

  //get List Collumn
  const getListDmFieldDisplay = (isInit: boolean) => {
    dmFeildDisplayApi
      .getAllDmFeilDisplay()
      .then((res) => {
        // get data danh mục
        // Bạn có thể xem lại bài viết về useState()
        setListDmFeildDisplay(res.data);
      })
      .catch((err) => {
        //Trường hợp xảy ra lỗi
        console.log(err);
      });
    configDisplayApi.findByCurrentUser().then((resp) => {
      if (resp.status === 200) {
        setRecordDisplay(resp.data);
        const record = resp.data;
        if (record) {
          const colCodeList = record.listColCode?.split(',');
          const lstStatusTemp = record.listOrderStatus?.split(',').map((lst) => parseInt(lst));
          setCheckedList(colCodeList!);
          if (!(isInit && lstStatus.length !== 0)) { // nếu là lần chạy đầu tiên và đã có trạng thái rồi thì k set nữa
            setLstStatus(lstStatusTemp!);
          }
          if (paramSearch) {
            paramSearch.lstStatus = lstStatusTemp;
          }
        } else {
          setLstStatus([])
          if (paramSearch) {
            paramSearch!.lstStatus = [];
          }
        }
      }
    });
  };

  //Lấy tài khoản cha hoặc tài khoản con List<ValueComboboxDto> getAccounts
  const getOpAccountChild = useCallback((callback?: (success: boolean) => void) => {
    setIsLoading(true);
    getListDmFieldDisplay(true);
    productApi
      .getAccount()
      .then((resp) => {
        if (resp.status === 200) {
          setOpAccounts(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getCmsCustomer = useCallback((callback?: (success: boolean) => void) => {
    setIsLoading(true);
    cmsCustomerApi
      .findByAccntParentCode()
      .then((resp) => {
        if (resp.status === 200) {
          if (resp.data.length > 0) {
            setCmsCustomer(resp.data);
          } else {
            setCmsCustomer([{ accntCode: currentUser.org, accntName: currentUser.ufn }])
          }
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    getOpAccountChild();
    getCmsCustomer();
  }, [getCmsCustomer, getOpAccountChild]);

  const searchByParam = useCallback(
    (param: any, p: number, s: number, callback?: (success: boolean) => void) => {
      if (!currentUser.isEmployee) {
        setIsLoading(true);
        orderHdrApi
          .searchAllByParam(param, p, s)
          .then((resp: any) => {
            if (resp.status === 200) {
              setTotalRecord(resp.headers['x-total-count']);
              setOrderHdrTableFilter(resp.data);
              if (!isShowSelectAll) {
                setSelectedRowKeys(resp.data.map((element: any) => element.orderHdrId))
              }
            }
            if (callback) {
              callback(resp.status === 200);
            }
          })
          .finally(() => setIsLoading(false));
      }
    },
    [isShowSelectAll],
  );
  const onCancelOrder = () => {
    orderCorrectionControllerApi
      .findOrderByItemCodeAndVer(recordOrderHdr?.itemCode as string, '9999')
      .then((res) => {
        if (res.status === 200) {
          orderCorrectionApi.cancelOrder(res.data).then((resp) => {
            if (resp.status === 201 || resp.status === 200) {
              notification.success({ message: 'Đã lưu thông tin rút bưu gửi' });
              history.push('/manage/order-manager');
              setIsModalLoading(false);
              setIsModalVisible(false);
            }
          });
        }
      });
  };

  // const onLoadData = (param: any, p: number, s: number) => {
  //   if (!param) {
  //     const pr = {
  //       orderType: orderTypeInit,
  //       lstStatus: lstStatus,
  //     };
  //     searchByParam(pr, p, s);
  //   } else {
  //     searchByParam(param, p, s);
  //   }
  // };

  useEffect(() => {
    if (lstStatus && lstStatus.length > 0) {
      // console.log(lstStatus, 'page');
      if (!paramSearch) {
        const pr: any = {
          orderType: orderTypeInit,
          lstStatus: lstStatus,
          owner: ownerInit,
          orgCode: orgCodeInit || [],
        };
        if (fromDateInit && toDateInit) {
          pr.toDateFromDate = [fromDateInit.format('YYYY-MM-DD'), toDateInit.format('YYYY-MM-DD')]
        }
        setParamSearch(pr)
        searchByParam(pr, page, pageSize);
      } else {
        searchByParam(paramSearch, page, pageSize);
      }
    }
  }, [page, pageSize, lstStatus, orderTypeInit]);

  const onFinish = (param: ParamSearchAllDto) => {
    if (!param.searchValue && !param.toDateFromDate) {
      notification.error({ message: 'Bắt buộc nhập mã đơn hàng/mã vận đơn hoặc từ ngày/đến ngày' })
    } else {
      setSelectedRowKeys([])
      setIsShowSelectAll(true)
      if (param.toDateFromDate) {
        // console.log(moment(param.toDateFromDate[0]).format('YYYY-MM-DD HH:mm'));
        const date: string[] = []
        param.toDateFromDate.map(d => {
          date.push(moment(d).format('YYYY-MM-DD HH:mm'));
        })
        param.toDateFromDate = date

      }
      param.lstStatus = lstStatus;
      param.orderType = orderTypeInit;

      setParamSearch(param);
      searchByParam(param, 0, pageSize);
      // setSelectedKeys([])
      setPage(0);
    }
  };

  //List trạng thái đơn hàng

  const loadDataTree = (lstStatusTemp: OrderStatusDto[], orderType: any) => {
    let total = 0;
    lstStatusTemp.map(st => {
      if (st.orderStatusId !== 0) {
        total += st.count!
      }
    })
    const dataTreeTmp = lstStatusTemp.map((st) => ({
      title: st.statusGroupName,
      key: st.orderStatusGroup,
      children: [],
    }));
    const dataTree: DataNode[] = Array.from(new Set(dataTreeTmp.map((d) => JSON.stringify(d)))).map(
      (m) => JSON.parse(m),
    );
    dataTree.forEach((element) => {
      let count: number = 0;
      const statusTmp = lstStatusTemp.filter((lst) => lst.orderStatusGroup === element.key);
      statusTmp.forEach((e) => {
        count += e.count!;
      });
      let dataChild: DataNode[]
      if (orderTypeInit !== '4') {
        dataChild = statusTmp.map((d) => ({
          title: <><span>{d.name}</span><span style={{ color: "red", fontWeight: 'bold' }}>{` (${d.count})`}</span></>,
          key: d.orderStatusId + '00',
          children: [],
        }));
      } else {
        dataChild = statusTmp.filter(s => [6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].includes(s.orderStatusId)).map((d) => ({
          title: <><span>{d.nameRec}</span><span style={{ color: "red", fontWeight: 'bold' }}>{` (${d.count})`}</span></>,
          key: d.orderStatusId + '00',
          children: [],
        }));
      }
      element.children = dataChild;
      element.title = <><span>{element.title}</span><span style={{ color: "red", fontWeight: 'bold' }}>{` (${count})`}</span></>;
    });
    // setDataTreeList(dataTree);
    // setRefDataList(dataTree.filter(c => c.key != "0"));
    let data: any[] = [];
    if (orderType === '3') {
      data = [];
    }
    if (orderType === '1' || orderType === '2') {
      data = dataTree.filter((c) => c.key !== '0');
    }
    if (orderType === '4') {
      data = dataTree.filter(
        (c) =>
          c.key != '0' &&
          c.key != '1' &&
          c.key != '2' &&
          c.key != '3' &&
          c.key != '4',
      );
    }
    data.unshift({
      title: <><span>Tất cả</span><span style={{ color: "red", fontWeight: 'bold' }}>{` (${total})`}</span></>,
      key: '-1'
    })
    setRefDataList(data);

    if (lstStatus === statusInit) {
      const dataStatus = [...data]
      dataStatus.shift()

      const sttTmp: any[] = statusInit.map((s: string) => s + '00');
      const sttExpand: any[] = [];
      dataStatus.forEach(d => {
        if (d.children.map((c: any) => c.key).some((r: any) => sttTmp.includes(r)) && d.children.length !== 1) {
          sttExpand.push(d.key)
        }
      })
      setExpandedKeys(sttExpand)

      dataStatus.forEach(d => {
        if (d.children.map((c: any) => c.key).some((r: any) => sttTmp.includes(r)) && d.children.length === 1) {
          sttTmp.push(d.key);
          for (let i = 0; i < statusInit.length; i++) {
            if (sttTmp[i] === d.children[0].key) {
              sttTmp.splice(i, 1)
            }
          }
        }
      })

      setSelectedKeys(sttTmp)
    }
  };

  const onSelect = (selectedKeysValue: any[]) => {
    console.log(selectedKeysValue);
    if (selectedKeysValue.find(s => s === '-1')) {
      setSelectedKeys([]);
      setExpandedKeys([]);
      getListDmFieldDisplay(false);
    } else {
      setIsShowSelectAll(true)
      setSelectedRowKeys([])
      setPage(0)
      setSelectedKeys(selectedKeysValue);
      if (selectedKeysValue.length > 0) {
        const group: any[] = [];
        const status: any[] = [];
        selectedKeysValue.forEach((element) => {
          if (element.length === 3) {
            status.push(element.substring(0, 1));
          }
          if (element.length === 4) {
            status.push(element.substring(0, 2));
          }
          if (element.length <= 2) {
            group.push(element);
          }
        });
        orderStatusTmp
          .filter((s) => group.includes(s.orderStatusGroup))
          .map((m) => status.push(m.orderStatusId.toString()));
        setLstStatus(status);
        if (paramSearch) {
          paramSearch!.lstStatus = status;
        } else {
          setParamSearch({
            orderType: orderTypeInit,
            lstStatus: status,
          })
        }
      }
      if (selectedKeysValue.length === 0) {
        getListDmFieldDisplay(false);
      }
    }
  };

  const filterChild = (code: string) => {
    return refDataList.filter((c) => c.key === code);
  };

  //End list trạng thái
  const terminateOrder = (id: string) => {
    try {
      terminateOrderControllerApi.terminateOrder(id).then((resp) => {
        if (resp.status === 200 || resp.status === 201) {
          notification.success({ message: 'Tạo yêu cầu hủy đơn hàng thành công' });
          if (!paramSearch) {
            const pr = {
              orderType: orderTypeInit,
              lstStatus: lstStatus,
            };
            searchByParam(pr, page, pageSize);
          } else {
            searchByParam(paramSearch, page, pageSize);
          }
        }
      });
    } catch (e: any) {
      notification.error({ message: e.message });
      return;
    }
  };

  const handleTerminate = (id: string, mess: string) => {
    terminateOrderControllerApi.checkTerminateCondition(id).then((resp) => {
      if (resp.status === 200) {
        // console.log('resp', (resp.data as unknown as boolean) === true);
        if ((resp.data as unknown as boolean) === true) {
          Modal.confirm({
            title: 'Hủy đơn hàng',
            icon: <ForwardOutlined />,
            content: mess,
            okText: 'Đồng ý',
            cancelText: 'Đóng',
            onOk() {
              terminateOrder(id);
            },
          });
        }
      }
    });
  };

  const onCalculateCancelFeeKHL = () => {
    orderCorrectionApi.calculateCancelKHLFee(recordOrderHdr as OrderHdrDto).then((resp) => {
      if (resp.status === 200) setCancelOrderFee(resp.data as unknown as number);
    });
  };

  const onShowFeeAfter = () => {
    onCalculateCancelFeeKHL();
    setIsModalLoading(true);
  };

  const findStatusDisplay = (param: any, orderType: string) => {
    if (orderType !== '3') {
      setIsLoading(true);
      orderStatusApi
        .findStatusDisplay(param)
        .then((res) => {
          if (res.status === 200) {
            loadDataTree(res.data, orderType);
            setOrderStatusTmp(res.data);

          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    if (lstStatus?.length > 0) {
      if (!paramSearch) {
        const pr: any = {
          orderType: orderTypeInit,
          lstStatus: lstStatus,
          owner: ownerInit,
          orgCode: orgCodeInit || [],
        };
        if (fromDateInit && toDateInit) {
          pr.toDateFromDate = [fromDateInit.format('YYYY-MM-DD'), toDateInit.format('YYYY-MM-DD')]
        }
        findStatusDisplay(pr, orderTypeInit);
      } else {
        findStatusDisplay(paramSearch, orderTypeInit);
      }
    }
  }, [orderTypeInit, paramSearch]);

  useEffect(() => {
    if (isDone) {
      setIsDone(false)
      recordOrderHdr!.isPrinted = '1'
      updateToDataSource(orderHdrTableFilter, recordOrderHdr!, recordOrderHdr!.orderHdrId)
    }
  }, [isDone])


  // Màn hình cài đặt hiển thị
  const onSubmit = (values: ConfigDisplayDto) => {
    setSelectedKeys([])
    setIsShowSelectAll(true)
    setSelectedRowKeys([])
    if (!values.listOrderStatus) {
      values.listOrderStatus = '';
    }
    if (values) {
      configDisplayApi
        .updateItemConfigDisplay(values)
        .then((response: any) => {
          if (response.status === 200) {
            notification.success({ message: 'Cập nhật thành công !' });
            getListDmFieldDisplay(false);
            if (!paramSearch) {
              const pr = {
                orderType: orderTypeInit,
                lstStatus: lstStatus,
              };
              findStatusDisplay(pr, orderTypeInit);
            } else {
              findStatusDisplay(paramSearch, orderTypeInit);
            }
          } else {
            notification.error({ message: 'Cật nhật thất bại !' });
          }
        })
        .catch((e: Error) => {
          console.log(e);
        })
        .finally(() => {
          setIsShowSettingsOrder(false);
        });
    }
  };

  const changePopupShowSetting = (e: any) => {
    if (e.key === '1') {
      // Popup hiển thị MH cài đặt hiển thị MH_QLDH_CD
      orderStatusApi
        .findAllOrderGroup()
        .then((resp) => {
          if (resp.status === 200) {
            orderStatusApi.findAllOrderStatus().then((res) => {
              if (res.status === 200) {
                setTreeList(resp.data);
                setOrderStatusList(res.data);
              }
            });
          }
        })
        .finally(() => {
          setIsShowSettingsOrder(true);
        });
    }
    if (e.key === '2') {
      if (selectedRowKeys.length > 0 && isShowSelectAll) {
        setIsLoading(true);
        orderHdrApi
          .exportOrderHdr({ orderHdrIds: selectedRowKeys })
          .then((resp) => {
            if (resp.status === 200) {
              downloadFile(resp.data, 'export_order');
              // console.log(resp.data);
            }
          })
          .finally(() => setIsLoading(false));
      }
      if (selectedRowKeys.length > 0 && !isShowSelectAll) {
        const pr = {
          orderType: orderTypeInit,
          lstStatus: lstStatus,
        };
        orderHdrApi.searchIdByParam(paramSearch ? paramSearch : pr, 0, totalRecord)
          .then(resp => {
            if (resp.status === 200) {
              setIsLoading(true);
              orderHdrApi
                .exportOrderHdr({ orderHdrIds: resp.data })
                .then((res) => {
                  if (res.status === 200) {
                    downloadFile(res.data, 'export_order');
                    // console.log(resp.data);
                  }
                }).finally(() => setIsLoading(false));
            }
          })

      }
      if (selectedRowKeys.length === 0) {
        notification.error({ message: 'Chọn đơn hàng để kết xuất excel' });
      }
    }
    if (e.key === '3') {
      if (selectedRowKeys.length > 0 && isShowSelectAll) {
        setIsLoading(true)
        mcasUserApi.getDataPrintConfig().then((resp) => {
          if (resp.status === 200) {
            if (resp.data.isDefault) {
              orderHdrApi
                .exportListReport(resp.data.mauinCode!, selectedRowKeys)
                .then((res) => {
                  if (res.status === 200) {
                    printFile(res.data);
                    setIsDone(true);
                  }
                })
                .finally(() => setIsLoading(false));
            } else {
              setmauInDefault(resp.data.mauinCode);
              setIsShowPrint(true);
              setIsLoading(false);
              printRef.current.handleOpenPrintMulti?.(selectedRowKeys);
            }
          }
        });
      }
      if (selectedRowKeys.length > 0 && !isShowSelectAll) {
        const pr = {
          orderType: orderTypeInit,
          lstStatus: lstStatus,
        };
        setIsLoading(true)
        orderHdrApi.searchIdByParam(paramSearch ? paramSearch : pr, 0, totalRecord)
          .then(resp => {
            if (resp.status === 200) {
              mcasUserApi.getDataPrintConfig().then((resp1) => {
                if (resp1.status === 200) {
                  if (resp1.data.isDefault) {
                    orderHdrApi
                      .exportListReport(resp1.data.mauinCode!, resp.data)
                      .then((res) => {
                        if (res.status === 200) {
                          printFile(res.data);
                        }
                      })
                      .finally(() => setIsLoading(false));
                  } else {
                    setmauInDefault(resp1.data.mauinCode);
                    setIsShowPrint(true);
                    printRef.current.handleOpenPrintMulti?.(resp.data);
                    setIsLoading(false);
                  }
                }
              });
            }
          })
      }
      if (selectedRowKeys.length === 0) {
        notification.error({ message: 'Chọn đơn hàng để in' });
      }
    }
  };

  const menuOther = (
    <Menu onClick={changePopupShowSetting}>
      {(orderTypeInit === '3' || orderTypeInit === '4') && (
        <Menu.Item key="1" icon={<SettingOutlined />}>
          {' '}
          Cài đặt hiển thị{' '}
        </Menu.Item>
      )}
      {(orderTypeInit === '1' || orderTypeInit === '2') && (
        <>
          <Menu.Item key="1" icon={<SettingOutlined />}>
            {' '}
            Cài đặt hiển thị{' '}
          </Menu.Item>
          <Menu.Item key="2" icon={<DownloadOutlined style={{ color: '#28a745' }} />}>
            {' '}
            Xuất Excel
          </Menu.Item>
          <Menu.Item key="3" icon={<PrinterOutlined style={{ color: '#6c757d' }} />}>
            {' '}
            In vận đơn
          </Menu.Item>
          <Menu.Item key="4" icon={<CopyOutlined style={{ color: '#17a2b8' }} />}>
            {' '}
            Sao chép
          </Menu.Item>
          <Menu.Item key="5" icon={<RetweetOutlined style={{ color: '#ffc107' }} />}>
            {' '}
            Đổi trạng thái in{' '}
          </Menu.Item>
        </>
      )}
    </Menu>
  );
  // End màn hình cài đặt hiển thị
  // Chọn loại đơn hàng

  const onChangeTypeOrder = (keyOrder: string) => {
    history.replace({ pathname: '/manage/order-manager', query: { orderType: keyOrder } });
    setParamSearch({ orderType: keyOrder, lstStatus: [] });
    setSelectedKeys([])
    // searchByParam({ orderType: keyOrder, lstStatus: lstStatus }, 0, pageSize);
    setIsShowSelectAll(true);
    setSelectedRowKeys([])
    setPage(0)
    form.resetFields()
  };
  // End Chọn loại đơn hàng

  const getOpDelegater = useCallback((account: string, callback?: (success: boolean) => void) => {
    setIsLoading(true);
    productApi
      .getDelegater(account)
      .then((resp) => {
        if (resp.status === 200) {
          setOpDelegater(resp.data);
        }
        if (callback) {
          callback(resp.status === 200);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const onChangeAccount = (value: any) => {
    form.setFieldsValue({ createdBy: undefined })
    if (value) {
      setIsShowCreatedBy(true);
      getOpDelegater(value);
    } else {
      setIsShowCreatedBy(false);
    }
  };

  const onChangeOrg = (value: any[]) => {
    form.setFieldsValue({ 'owner': undefined })
    if (value.length === 1 && value[0] === currentUser.org) {
      setIsChangeOwner(true)
    } else {
      setIsChangeOwner(false)
    }
  }

  const openSearchAdvanced = () => {
    if (!isOpenSearchAdvanced) {
      setIsOpenSearchAdvanced(true);
    } else {
      setIsOpenSearchAdvanced(false);
    }
  };

  /* Checkbox*/

  const onSelectChange = (newSelectedRowKeys: any) => {
    // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const SelectedAll = () => {
    let newSelectedRowKeys = [];
    newSelectedRowKeys = orderHdrTableFilter.map((element: any) => element.orderHdrId);
    onSelectChange(newSelectedRowKeys);
    setIsShowSelectAll(false);
  };

  const cancelSelectedAll = () => {
    setSelectedRowKeys([]);
    setIsShowSelectAll(true);
  };

  const onChangeDataSources = (id: any) => {
    form.setFieldsValue({ createdChannel: undefined })
    if (id === 'MYVNP') {
      setIsShowCreatedChannel(true);
    } else {
      setIsShowCreatedChannel(false);
    }
  };

  //change Page
  const onChangePage = (p: any, s: any) => {
    setPage(p - 1);
    setPageSize(s);
  };

  const changePopupAction = (event: any) => {
    if (event.key === '2') {
      if ((recordOrderHdr?.orgCode !== currentUser.org || (recordOrderHdr?.owner && !opAccounts.map(o => o.value).includes(recordOrderHdr?.owner))) || currentUser.uid !== currentUser.owner) {
        notification.error({ message: 'Không có quyền tạo yêu cầu hỗ trợ' })
      }
    }
    if (event.key === '7') {
      if (recordOrderHdr?.receiverPhone && recordOrderHdr?.orgCode === currentUser.org && currentUser.uid === currentUser.owner && (opAccounts.map(o => o.value).includes(recordOrderHdr?.owner) || !recordOrderHdr?.owner)) {
        contactApi.updateBlackList(recordOrderHdr.receiverPhone, true, recordOrderHdr.orderHdrId).then((resp) => {
          if (resp.status === 200) {
            notification.success({ message: 'Thêm vào danh sách đen thành công' });
          }
        });
      } else {
        notification.error({ message: 'Không có quyền thêm vào danh sách đen' });
      }
    }

    if (event.key === '3') {
      {
        // console.log(recordOrderHdr);
      }
      if (recordOrderHdr?.orgCode === currentUser.org && currentUser.uid === currentUser.owner && (opAccounts.map(o => o.value).includes(recordOrderHdr?.owner) || !recordOrderHdr?.owner)) {
        orderCorrectionApi
          .checkExistCorrection(recordOrderHdr?.orderHdrId as string)
          .then((resp) => {
            if (resp.status === 200) {
              if ((resp.data as unknown as boolean) === false) {
                setItemCode(recordOrderHdr?.itemCode as string);
                setIsModalVisible(true);


                orderCorrectionControllerApi.getCaseByOrder(recordOrderHdr?.status + '', recordOrderHdr?.serviceCode as string).then((resp2) => {
                  if (resp2.status === 200) {
                    setCorrectionItems(resp2.data as OrderCorrectionCase[]);
                    console.log(resp.data);
                  }
                  else {
                    notification.error({ message: "không tìm thấy service code của đơn hàng" })
                  }
                });


              } else {
                notification.error({
                  message:
                    'Không thể hiệu chỉnh đơn hàng này do tồn tại một yêu cầu hiệu chỉnh chưa được phê duyệt!',
                });
              }
            }
          });
      } else {
        notification.error({ message: 'Không có quyền tạo yêu cầu hiệu chỉnh' });
      }
    }
    if (event.key === '4') {
      // if (recordOrderHdr?.status && parseInt(recordOrderHdr?.status) >= 5) {
      //   notification.error({ message: 'Không được phép in đơn hàng này' })
      // } else {
      setIsLoading(true);
      mcasUserApi.getDataPrintConfig().then((resp) => {
        if (resp.status === 200) {
          if (resp.data.isDefault) {
            orderHdrApi
              .exportReport(recordOrderHdr!.orderHdrId!, resp.data.mauinCode!)
              .then((res) => {
                if (res.status === 200) {
                  printFile(res.data);
                  setIsDone(true)
                }
              })
              .finally(() => setIsLoading(false))
          } else {
            setmauInDefault(resp.data.mauinCode);
            setIsShowPrint(true);
            setIsLoading(false);
          }
        }
      });
      // }
    }
    if (event.key === '5') {
      setIsShowBarCode(true);
    }
    if (event.key === '6') {
      setIsShowImage(true);
    }
    if (event.key === '8') {
      // console.log(recordOrderHdr);

      if (currentUser.uid === currentUser.owner && recordOrderHdr?.orgCode === currentUser.org && (opAccounts.map(o => o.value).includes(recordOrderHdr?.owner) || !recordOrderHdr?.owner)) {
        handleTerminate(
          recordOrderHdr?.orderHdrId as string,
          'Bạn muốn hủy đơn hàng ' + recordOrderHdr?.itemCode + ' ?',
        );
      } else {
        notification.error({ message: 'Không có quyền huỷ đơn hàng' });
      }
    }
    console.log('event.key', event.key);
    if (event.key === '11') {
      setIsShowEvaluate(true);
    }
  };


  const menuAction = (
    <Menu onClick={changePopupAction}>
      {orderTypeInit === '4' && (
        <>
          <Menu.Item key="6" icon={<SettingOutlined />}>
            Ảnh đính kèm{' '}
          </Menu.Item>
          {!isProd &&
            ((recordOrderHdr?.receiverOwner === currentUser.uid)
              || ((recordOrderHdr?.receiverOwner != currentUser.uid) && (recordOrderHdr?.receiverCode === currentUser.org) && (recordOrderHdr?.receiverContractNumber != null))) ?
            <Menu.Item key="11" icon={<StarOutlined style={{ color: 'rgb(253 184 19)' }} />}>
              {' '}
              Đánh giá  {' '}
            </Menu.Item>
            :
            null
          }
        </>
      )}
      {(orderTypeInit === '1' || orderTypeInit === '2') && (
        <>
          <Menu.Item key="2" icon={<PlusCircleOutlined style={{ color: '#17a2b8' }} />}>
            Tạo yêu cầu hỗ trợ
            {recordOrderHdr?.orgCode === currentUser.org && currentUser.uid === currentUser.owner && (opAccounts.map(o => o.value).includes(recordOrderHdr?.owner) || !recordOrderHdr?.owner) && (
              <Link
                to={{
                  pathname: '/manage/ticket',
                  search: '?itemCode=' + recordOrderHdr?.itemCode,
                  // hash: '#the-hash',
                  state: { itemCode: recordOrderHdr?.itemCode },
                }}
              />
            )}
          </Menu.Item>
          <Menu.Item key="3" icon={<PlusSquareOutlined style={{ color: '#007bff' }} />}>
            {' '}
            Tạo hiệu chỉnh{' '}
          </Menu.Item>
          <Menu.Item key="4" icon={<PrinterOutlined style={{ color: '#28a745' }} />}>
            {' '}
            In vận đơn{' '}
          </Menu.Item>
          <Menu.Item key="5" icon={<BarcodeOutlined />}>
            {' '}
            Mã vạch{' '}
          </Menu.Item>
          <Menu.Item key="6" icon={<PictureOutlined style={{ color: '#6c757d' }} />}>
            {' '}
            Ảnh đính kèm{' '}
          </Menu.Item>
          <Menu.Item key="7" icon={<FileAddOutlined style={{ color: '#17a2b8' }} />}>
            {' '}
            Thêm vào DS đen
          </Menu.Item>
          <Menu.Item key="8" icon={<DeleteOutlined style={{ color: '#dc3545' }} />}>
            {' '}
            Hủy đơn hàng{' '}
          </Menu.Item>
          <Menu.Item key="9" icon={<RetweetOutlined style={{ color: '#ffc107' }} />}>
            {' '}
            Chuyển trạng thái in{' '}
          </Menu.Item>
          <Menu.Item key="10" icon={<CopyOutlined style={{ color: '#28a745' }} />}>
            {' '}
            Sao chép vận đơn{' '}
          </Menu.Item>
          {!isProd &&
            <>
              {
                (recordOrderHdr?.sendType === '1') && (currentUser.org === recordOrderHdr?.orgCode) ||
                  (recordOrderHdr?.sendType === '2' && (currentUser.org === recordOrderHdr?.orgCode) && Number(recordOrderHdr?.status) >= 14) ?
                  <Menu.Item key="11" icon={<StarOutlined style={{ color: 'rgb(253 184 19)' }} />}>
                    {' '}
                    Đánh giá  {' '}
                  </Menu.Item>
                  :
                  null
              }
            </>
          }
        </>
      )}
    </Menu>
  );

  const handleCreate = (record: OrderHdrDisplayDto) => {
    setIsLoading(true);
    orderHdrApi
      .createFromDraft(record.orderHdrId!)
      .then((resp) => {
        if (resp.status === 200) {
          searchByParam({ orderType: 3 }, 0, pageSize);
          notification.success({ message: 'Tạo đơn hàng từ đơn hàng nháp thành công' });
        } else {
          notification.error({ message: 'Tạo đơn hàng từ đơn hàng nháp không thành công' });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const deleteRecord = (orderHdrId: string) => {
    orderHdrApi.deleteOrderHdr(orderHdrId).then((resp) => {
      if (resp.status === 204) {
        // setOrderHdrTableFilter(deleteFromDataSource(orderHdrTableFilter, orderHdrId, 'orderHdrId'));
        searchByParam({ orderType: 3 }, 0, pageSize);
      }
    });
  };

  // const onClickMenuAction = (record: OrderHdrDisplayDto) => {
  //   console.log('record', record);

  //   setRecord(record)
  // }

  const action = (orderHdrId: string, record: OrderHdrDisplayDto): React.ReactNode => {
    return (
      <Space key={orderHdrId}>
        {orderTypeInit === '3' && (
          <>
            <Button
              disabled={!(currentUser.uid === record.createdBy)}
              size="small"
              title="Tạo đơn hàng từ đơn hàng nháp"
              onClick={() => handleCreate(record)}
            >
              <ArrowRightOutlined />
            </Button>
            <Button
              disabled={!(currentUser.uid === record.createdBy)}
              title="Sửa đơn hàng"
              size="small"
            >
              <Link to={'/order/edit/' + record.orderHdrId}>
                <EditOutlined />
              </Link>
            </Button>
            <Popconfirm
              disabled={!(currentUser.uid === record.createdBy)}
              title={record.batchCode ? <>Xóa đơn hàng này sẽ xóa tất cả đơn hàng trong lô. <br /> Bạn chắc chắn muốn xóa?</> : "Bạn chắc chắn muốn xóa?"}
              onConfirm={() => deleteRecord(orderHdrId)}
              okText="Đồng ý"
              cancelText="Hủy bỏ"
            >
              <Button
                title="Xoá đơn hàng"
                disabled={!(currentUser.uid === record.createdBy || currentUser.uid === record.owner)}
                size="small"
              >
                <DeleteOutlined style={{ color: 'red' }} />
              </Button>
            </Popconfirm>
          </>
        )}

        {orderTypeInit !== '3' && (
          <Dropdown overlay={menuAction} trigger={['click']}>
            <a className="ant-dropdown-link" title="Hành động" onClick={() => setRecord(record)}>
              <EllipsisOutlined style={{ fontSize: "20px" }} />
            </a>
          </Dropdown>
        )}
      </Space>
    );
  };

  const showOrderDetail = (orderHdrId: any, record: OrderHdrDisplayDto): React.ReactNode => {
    if (orderTypeInit === '1' || orderTypeInit === '2') {
      return <Link to={'/manage/order-manager/sender/' + orderHdrId}> {record.itemCode} </Link>;
    }
    if (orderTypeInit === '4') {
      return <Link to={'/manage/order-manager/receiver/' + orderHdrId}> {record.itemCode} </Link>;
    }
    if (orderTypeInit === '3') {
      return (
        <Link to={'/manage/order-manager/sender/' + orderHdrId}>
          <FileOutlined style={{ fontSize: '14px' }} /> {record.saleOrderCode}{' '}
        </Link>
      );
    }
  };

  const resetDate = () => {
    if (orderTypeInit !== '2') {
      form.setFieldsValue({ toDateFromDate: null })
      setDisableDate(undefined)
    }
    const a = document.getElementById('form-order-manager_toDateFromDate');
    a?.focus();

  }
  const disabledDate: RangePickerProps['disabledDate'] = current => {
    if (!disableDate) {
      return (
        current.isBefore(moment().subtract(1, 'day').subtract(2, 'year')) ||
        current.isAfter(moment())
      )
    }
    if (disableDate[0]) {
      return (
        current.isAfter(moment(disableDate[0]).add(31, 'day')) || current.isAfter(moment())
      )
    } else if (disableDate[1]) {
      return (
        current.isBefore(moment(disableDate[1]).subtract(31, 'day'))
      )
    }
  };


  const onClickCorrection = (path: string) => {
    history.push(path);
  }

  const columns: any[] = defineColumns(
    listDmFeildDisplay,
    checkedList,
    orderStatusList,
    orderTypeInit,
    page,
    pageSize,
    action,
    showOrderDetail,
  );

  const { disableScroll, enableScroll } = usePreventBodyScroll();

  // const toDateFromDateDefault: [Moment, Moment] = useMemo(() => {
  //   if (orderTypeInit === '2') {
  //     return [moment(), moment()]
  //   }
  //   if (fromDateInit && toDateInit) {
  //     return [fromDateInit, toDateInit]
  //   }
  //   return [moment().subtract(31, 'day'), moment()]
  // }, [orderTypeInit]);

  useEffect(() => {
    const getToDateFromDateDefault = () => {
      if (orderTypeInit === '2') {
        return [moment(), moment()]
      }
      if (fromDateInit && toDateInit) {
        return [fromDateInit, toDateInit]
      }
      if (currentUser.isEmployee) {
        return [moment().subtract(1, 'day'), moment()]
      }
      return [moment().subtract(6, 'day'), moment()]
    }
    const toDateFromDateDefault = getToDateFromDateDefault();
    form.setFieldsValue({
      toDateFromDate: toDateFromDateDefault
    })
  }, [orderTypeInit])

  const onChangeSearchValue = (e: any) => {
    if (e.target.value) {
      setIsChangeDate(true)
    } else {
      setIsChangeDate(false)
    }
  }
  const onChangeBatchCode = (e: any) => {
    if (e.target.value) {
      setIsChangeDate(true)
    } else {
      setIsChangeDate(false)
    }
  }

  // console.log("recordOrderHdr MHQL", recordOrderHdr);

  return (
    <PageContainer
      className="fadeInRight"
      extra={
        <>
          <Row gutter={8}>
            <Col span={24}>

              <Space >
                <Select
                  // defaultValue={orderTypeInit}
                  value={orderTypeInit}
                  style={{ width: '250px' }}
                  onChange={onChangeTypeOrder}
                >
                  {currentUser.owner === currentUser.uid ? dataToSelectBox(listTypeOrder, 'id', 'name') : dataToSelectBox(listTypeOrder.filter(t => t.id !== '4'), 'id', 'name')}
                </Select>
                <Dropdown overlay={menuOther}>
                  <Button style={{ borderRadius: '5px' }}>
                    <Space title="Chọn tính năng khác">
                      <EllipsisOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </Space>
            </Col>
          </Row>
        </>
      }
    >
      <Spin spinning={isLoading}>
        <Form
          name="form-order-manager"
          labelCol={{ flex: '130px' }}
          labelWrap
          onFinish={onFinish}
          form={form}
          validateMessages={validateMessages}
          initialValues={currentUser.isEmployee ? orderTypeInit !== '4' ? { 'senderProvinceCode': currentUser.prov } : { 'senderProvinceCode': currentUser.prov } : {}}
        >
          <Card>
            <Row gutter={8}>
              <Col span={6}>
                <Form.Item name="searchValue">
                  <Input
                    onChange={onChangeSearchValue}
                    maxLength={750}
                    placeholder="Nhập mã vận đơn, mã đơn hàng"
                    title="Nhập mã vận đơn, mã đơn hàng"
                    allowClear
                  />
                </Form.Item>
              </Col>
              {/* {orderTypeInit !== '2' && ( */}
              <Col span={6}>
                <Form.Item
                  name="toDateFromDate"
                >
                  <RangePicker
                    disabled={orderTypeInit === '2' || (!isChangeDate && currentUser.isEmployee)}
                    style={{ width: '100%' }}
                    placeholder={['từ ngày', 'đến ngày']}
                    onClick={resetDate}
                    onCalendarChange={(e) => setDisableDate(e)}
                    disabledDate={disabledDate}
                    ranges={{
                      'Hôm nay': [moment(), moment()],
                      'Hôm qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                      '7 ngày trước': [moment().subtract(6, 'days'), moment()],
                      '30 ngày trước': [moment().subtract(29, 'days'), moment()],
                      'Tháng này': [moment().startOf('month'), moment()],
                      'Tháng trước': [
                        moment().subtract(1, 'month').startOf('month'),
                        moment().subtract(1, 'month').endOf('month'),
                      ],
                    }}
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>
              {/* )} */}
              {orderTypeInit != '4' && (
                <>
                  <Col span={6}>
                    <Form.Item name="orgCode" initialValue={orgCodeInit.length > 0 ? orgCodeInit : [currentUser.org]}>
                      {
                        !currentUser.isEmployee ? <Select disabled={orderTypeInit === '3'} mode="multiple" showArrow allowClear placeholder="Chi nhánh" onChange={onChangeOrg}>
                          {dataToSelectBox(cmsCustomer, 'accntCode', ['accntCode', 'accntName'])}
                        </Select>
                          : <Input allowClear placeholder="Chi nhánh" />
                      }
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="owner" initialValue={ownerInit}>
                      <Select
                        disabled={currentUser.isEmployee || !isChangeOwner}
                        // value={pcreateUser}
                        // onChange={(value) => onChangeAccount(value)}
                        onChange={onChangeAccount}
                        allowClear
                        placeholder="Chọn tài khoản"
                        style={{ width: '100%' }}
                      >
                        {opAccounts.map((v) => (
                          <Select.Option key={v.value} value={v.value}>
                            {v.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  {/* {isShowCreatedBy && (
                    
                  )} */}

                </>
              )}
              {orderTypeInit === '4' && (
                <Col>
                  <Button
                    icon={<SearchOutlined />}
                    className="btn-outline-info"
                    title="Tìm kiếm"
                    htmlType="submit"
                  >
                    Tìm kiếm
                  </Button>
                </Col>
              )}
              {/* {orderTypeInit === '1' && !isShowCreatedBy && (
                <>
                  <Col>
                    {!isOpenSearchAdvanced && (
                      <Button onClick={openSearchAdvanced} className="btn-outline-info">
                        [+] Tìm kiếm nâng cao
                      </Button>
                    )}
                    {isOpenSearchAdvanced && (
                      <Button onClick={openSearchAdvanced} className="btn-outline-info">
                        [-] Tìm kiếm nâng cao
                      </Button>
                    )}
                  </Col>
                  <Col>
                    <Button
                      icon={<SearchOutlined />}
                      className="btn-outline-info"
                      title="Tìm kiếm"
                      htmlType="submit"
                    >
                      Tìm kiếm
                    </Button>
                  </Col>
                </>
              )} */}
              {/* {orderTypeInit === '2' && (
                <>
                  <Col>
                    {!isOpenSearchAdvanced && (
                      <Button onClick={openSearchAdvanced} className="btn-outline-info">
                        [+] Tìm kiếm nâng cao
                      </Button>
                    )}
                    {isOpenSearchAdvanced && (
                      <Button onClick={openSearchAdvanced} className="btn-outline-info">
                        [-] Tìm kiếm nâng cao
                      </Button>
                    )}
                  </Col>
                  <Col>
                    <Button
                      icon={<SearchOutlined />}
                      className="btn-outline-info"
                      title="Tìm kiếm"
                      htmlType="submit"
                    >
                      Tìm kiếm
                    </Button>
                  </Col>
                </>
              )} */}
              {/* {orderTypeInit === '3' && !isShowCreatedBy && (
                <>
                  <Col>
                    {!isOpenSearchAdvanced && (
                      <Button onClick={openSearchAdvanced} className="btn-outline-info">
                        [+] Tìm kiếm nâng cao
                      </Button>
                    )}
                    {isOpenSearchAdvanced && (
                      <Button onClick={openSearchAdvanced} className="btn-outline-info">
                        [-] Tìm kiếm nâng cao
                      </Button>
                    )}
                  </Col>
                  <Col>
                    <Button
                      icon={<SearchOutlined />}
                      className="btn-outline-info"
                      title="Tìm kiếm"
                      htmlType="submit"
                    >
                      Tìm kiếm
                    </Button>
                  </Col>
                </>
              )} */}
            </Row>



            {/* {orderTypeInit === '3' && isShowCreatedBy && (
              <>
                <Row gutter={8} style={{ height: '50px' }}>
                  <Col>
                    {!isOpenSearchAdvanced && (
                      <Button onClick={openSearchAdvanced} className="btn-outline-info">
                        [+] Tìm kiếm nâng cao
                      </Button>
                    )}
                    {isOpenSearchAdvanced && (
                      <Button onClick={openSearchAdvanced} className="btn-outline-info">
                        [-] Tìm kiếm nâng cao
                      </Button>
                    )}
                  </Col>
                  <Col>
                    <Button
                      icon={<SearchOutlined />}
                      className="btn-outline-info"
                      title="Tìm kiếm"
                      htmlType="submit"
                    // style={{ width: "50px" }}
                    >
                      Tìm kiếm
                    </Button>
                  </Col>
                </Row>
              </>
            )} */}

            {isOpenSearchAdvanced && (
              <>
                <Row gutter={8}>
                  {orderTypeInit != '4' && (
                    <>
                      <Col className="config-height" span={6}>
                        <Form.Item name="senderValue">
                          <Input allowClear placeholder="Họ tên/SĐT người gửi" maxLength={255} />
                        </Form.Item>
                      </Col>
                      <Col span={18}>
                        <Address2
                          disabled={currentUser.isEmployee && currentUser.org !== '00'}
                          form={form}
                          hiddenLabel={true}
                          provinceName="Tỉnh/Thành phố gửi"
                          districtName="Quận/Huyện gửi"
                          communeName="Phường/Xã gửi"
                          provinceField="senderProvinceCode"
                          districtField="senderDistrictCode"
                          communeField="senderCommuneCode"
                          requiredProv={currentUser.org === '00'}
                        />
                      </Col>
                      <Col className="config-height" span={6}>
                        <Form.Item name="receiverValue">
                          <Input allowClear placeholder="Họ tên/SĐT người nhận" maxLength={255} />
                        </Form.Item>
                      </Col>
                      <Col span={18}>
                        <Address2
                          disabled={currentUser.isEmployee ? true : false}
                          form={form}
                          hiddenLabel={true}
                          provinceName="Tỉnh/Thành phố nhận"
                          districtName="Quận/Huyện nhận"
                          communeName="Phường/Xã nhận"
                          provinceField="receiverProvinceCode"
                          districtField="receiverDistrictCode"
                          communeField="receiverCommuneCode"
                        />
                      </Col>
                      {orderTypeInit != '3' && (
                        <>
                          <Col className="config-height" span={6}>
                            <Form.Item name="isCorrection">
                              <Select allowClear placeholder="Đơn hàng có hiệu chỉnh">
                                {dataToSelectBox(listCod, 'id', 'name')}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={6} className="config-height">
                            <Form.Item name="isTicket">
                              <Select allowClear placeholder="Đơn hàng có yêu cầu hỗ trợ">
                                {dataToSelectBox(listCod, 'id', 'name')}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col className="config-height" span={6}>
                            <Form.Item name="feeByPayer">
                              <Select allowClear placeholder="Người trả cước">
                                {dataToSelectBox(listFeePayer, 'id', 'name')}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col className="config-height" span={6}>
                            <Form.Item name="codAmount">
                              <Select allowClear placeholder="Tiền thu hộ">
                                {dataToSelectBox(listCod, 'id', 'name')}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item name="createdBy">
                              {/* <Select onChange={onChangeCreateByOrder} placeholder="Người tạo đơn">
                                                    {dataToSelectBox(receiverList, 'contactId', 'name')}
                                                </Select> */}
                              <Select
                                allowClear
                                // mode="multiple"
                                // value={pupdateBy}
                                placeholder="Chọn người tạo"
                                disabled={!isShowCreatedBy}
                                // mode="tags"
                                style={{ width: '100%' }}
                              // onChange={(value) => setPupdateBy(value)}
                              // tokenSeparators={[',']}
                              >
                                {opDelegater.map((row) => (
                                  // <Option key={row.value}>{row.label}</Option>
                                  <Select.Option key={row.value} value={row.value}>
                                    {row.label}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col className="config-height" span={6}>
                            <Form.Item name="batchCode">
                              <Input allowClear onChange={onChangeBatchCode} placeholder="Lô vận đơn" maxLength={255} />
                            </Form.Item>
                          </Col>
                          <Col className="config-height" span={6}>
                            <Form.Item name="source" className="ConfigPlaceholder">
                              <Select
                                allowClear
                                placeholder="Nguồn dữ liệu"
                                onChange={onChangeDataSources}
                              >
                                {dataToSelectBox(listDataSources, 'id', 'name')}
                              </Select>
                            </Form.Item>
                          </Col>
                          {/* {isShowCreatedChannel && (
                           
                          )} */}
                          <Col className="config-height" span={6}>
                            <Form.Item name="createdChannel">
                              <Select placeholder="Kênh tạo" allowClear disabled={!isShowCreatedChannel}>
                                {dataToSelectBox(listCreatedChannel, 'id', 'name')}
                              </Select>
                            </Form.Item>
                          </Col>
                        </>
                      )}
                      <Col className="config-height" span={6}>
                        <Form.Item name="contract">
                          <Input allowClear placeholder="Hợp đồng" maxLength={255} />
                        </Form.Item>
                      </Col>
                      <Col className="config-height" span={6}>
                        <Form.Item name="contractC">
                          <Input allowClear placeholder="Hợp đồng C" maxLength={255} />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                </Row>
              </>
            )}
            {orderTypeInit === '1' && (<Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                {isOpenSearchAdvanced ? <Button onClick={openSearchAdvanced} className="btn-outline-info">
                  [-] Tìm kiếm nâng cao
                </Button> : <Button onClick={openSearchAdvanced} className="btn-outline-info">
                  [+] Tìm kiếm nâng cao
                </Button>}
                {isOpenSearchAdvanced ? <Button icon={<SearchOutlined />} className="btn-outline-info" title="Tìm kiếm" htmlType="submit" style={{ margin: '0px 0px 15px 8px' }}>
                  Tìm kiếm
                </Button> : <Button icon={<SearchOutlined />} className="btn-outline-info" title="Tìm kiếm" htmlType="submit" style={{ margin: '0px 0px 15px 8px' }}>
                  Tìm kiếm
                </Button>}
              </Col>
            </Row>)}
            {orderTypeInit === '2' && (<Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                {isOpenSearchAdvanced ? <Button onClick={openSearchAdvanced} className="btn-outline-info">
                  [-] Tìm kiếm nâng cao
                </Button> : <Button onClick={openSearchAdvanced} className="btn-outline-info">
                  [+] Tìm kiếm nâng cao
                </Button>}
                {isOpenSearchAdvanced ? <Button icon={<SearchOutlined />} className="btn-outline-info" title="Tìm kiếm" htmlType="submit" style={{ margin: '0px 0px 15px 8px' }}>
                  Tìm kiếm
                </Button> : <Button icon={<SearchOutlined />} className="btn-outline-info" title="Tìm kiếm" htmlType="submit" style={{ margin: '0px 0px 15px 8px' }}>
                  Tìm kiếm
                </Button>}
              </Col>
            </Row>)}
            {orderTypeInit === '3' && (<Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                {isOpenSearchAdvanced ? <Button onClick={openSearchAdvanced} className="btn-outline-info">
                  [-] Tìm kiếm nâng cao
                </Button> : <Button onClick={openSearchAdvanced} className="btn-outline-info">
                  [+] Tìm kiếm nâng cao
                </Button>}
                {isOpenSearchAdvanced ? <Button icon={<SearchOutlined />} className="btn-outline-info" title="Tìm kiếm" htmlType="submit" style={{ margin: '0px 0px 0px 8px' }}>
                  Tìm kiếm
                </Button> : <Button icon={<SearchOutlined />} className="btn-outline-info" title="Tìm kiếm" htmlType="submit" style={{ margin: '0px 0px 0px 8px' }}>
                  Tìm kiếm
                </Button>}
              </Col>
            </Row>)}


            {/* Tree */}
            {orderTypeInit !== '3' && (
              <>
                {/* <Row gutter={8}> */}
                <Card size="small" style={{ width: '100%' }} bordered={false}>
                  <Row wrap={false}>
                    {/* <Col flex="none">
                      <a className="myCss" style={{ fontSize: '14px' }} onClick={() => { setSelectedKeys([]); setExpandedKeys([]); getListDmFieldDisplay(false); }}>
                        <><span style={{ color: 'black' }}>Tất cả</span><span style={{ color: "red", fontWeight: 'bold' }}>{` (${totalRecord ? totalRecord : '0'})`}</span></>
                      </a>

                    </Col> */}
                    <Col flex="auto" >
                      <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
                        <ScrollMenu
                          LeftArrow={LeftArrow}
                          RightArrow={RightArrow}
                          onWheel={onWheel}
                        >
                          {
                            refDataList.map((element) => (
                              <CardScroll
                                itemId={element.key}
                                tree={
                                  <Tree
                                    className='treeOrder'
                                    expandedKeys={expandedKeys}
                                    onExpand={(e) => setExpandedKeys(e)}
                                    style={{ whiteSpace: 'nowrap' }}
                                    multiple
                                    selectedKeys={selectedKeys}
                                    onSelect={onSelect}
                                    treeData={filterChild(element.key)}
                                  />
                                }
                              />
                            ))}
                        </ScrollMenu>
                      </div>
                    </Col>
                  </Row>
                </Card>
                {/* </Row> */}
                <br />
              </>
            )}

            <Row gutter={8}>
              <Col>
                <Space className="button-group" style={{ textAlign: 'end' }}>
                  {isShowSelectAll && (
                    <Button
                      className="btn-outline-success"
                      icon={<CheckSquareOutlined />}
                      onClick={SelectedAll}
                    >
                      Chọn tất cả
                    </Button>
                  )}
                  {!isShowSelectAll && (
                    <Button
                      className="btn-outline-danger"
                      icon={<BorderOutlined />}
                      onClick={cancelSelectedAll}
                    >
                      Hủy chọn
                    </Button>
                  )}
                </Space>
              </Col>
            </Row>

            <Table
              size="small"
              rowKey={'orderHdrId'}
              rowSelection={rowSelection}
              dataSource={orderHdrTableFilter}
              columns={columns}
              bordered
              pagination={{
                total: totalRecord,
                current: page + 1,
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                onChange: onChangePage,
              }}
            />
          </Card>
        </Form>
      </Spin>


      {isShowSettingsOrder && (
        <ShowSettingsOrder
          visible={isShowSettingsOrder}
          setVisible={setIsShowSettingsOrder}
          onSubmit={onSubmit}
          dataList={dataList}
          orderStatusList={orderStatusList}
          record={recordDisplay}
        // orderStatusDisplay={}
        // colDisplay={checkedList}
        />
      )}
      {isShowPrint && <PrintOrderForm
        visible={isShowPrint}
        setVisible={setIsShowPrint}
        record={recordOrderHdr}
        mauinDefault={mauinDefault}
        ref={printRef}
        isDone={isDone}
        setIsDone={setIsDone}
      />}
      {isShowBarCode && (
        <BarcodeViewer
          isOpenPopup={isShowBarCode}
          setIsOpenPopup={setIsShowBarCode}
          itemCode={recordOrderHdr!.itemCode!}
        />
      )}
      {isShowImage && (
        <ShowImage
          isOpenPopup={isShowImage}
          setIsOpenPopup={setIsShowImage}
          id={recordOrderHdr!.orderHdrId!}
        />
      )}
      {/* Bấm vào đánh giá và đơn hàng gửi */}
      {isShowEvaluate && recordOrderHdr != null && (orderTypeInit === '1' || orderTypeInit === '2') && (
        <EvaluateSender
          isOpenPopup={isShowEvaluate}
          setIsOpenPopup={setIsShowEvaluate}
          status={Number(recordOrderHdr!.status)}
          itemCode={recordOrderHdr?.itemCode}
          sendType={recordOrderHdr?.sendType}
          // senderName={recordOrderHdr?.senderName}
          // senderPhone={recordOrderHdr?.senderPhone}
          originalId={recordOrderHdr?.originalId}
        />
      )}
      {/* Bấm vào đánh giá và đơn hàng nhận */}
      {isShowEvaluate && orderTypeInit === '4' && (
        <EvaluateReceived
          isOpenPopup={isShowEvaluate}
          setIsOpenPopup={setIsShowEvaluate}
          status={Number(recordOrderHdr!.status)}
          itemCode={recordOrderHdr?.itemCode}
          sendType={recordOrderHdr?.sendType}
          // receiverName={recordOrderHdr?.receiverName}
          // receiverPhone={recordOrderHdr?.receiverPhone}
          originalId={recordOrderHdr!.orderHdrId!}
        />
      )}

      <Modal

        title="Tạo hiệu chỉnh"
        // className="modal-box"
        visible={isModalVisible}
        // onOk={() => { setIsModalVisible(false) }}
        onCancel={() => {
          setIsModalVisible(false);
          setChoosedCorrectionField('');
        }}
        footer={[
          ChoosedCorrectionField != '8' ? (
            <Button
              // style={{ backgroundColor: 'orange', color: 'white' }}
              // shape="round"
              // key="next-step"
              className='btn-outline-success'
              icon={<DoubleRightOutlined />}
              hidden={ChoosedCorrectionField === '' || CorrectionItems.length === 0}
              onClick={() => onClickCorrection('/manage/correction-manager/correct/' + ChoosedCorrectionField + '/' + recordOrderHdr?.orderHdrId)}
            >
              Bước tiếp theo
            </Button>

            // <Link to={'/manage/correction-manager/correct/' + ChoosedCorrectionField + '/' + recordOrderHdr?.orderHdrId}
            //   hidden={ChoosedCorrectionField === '' || CorrectionItems.length === 0}>
            //   <span style={{ color: '#28a745' }}> Bước Tiếp Theo</span>
            // </Link>
          ) : (
            <Button
              icon={<DoubleRightOutlined />}
              className='btn-outline-success'
              // style={{ backgroundColor: 'orange', color: 'white' }}
              // shape="round"
              // key="next-step"
              hidden={CorrectionItems.length === 0}
              onClick={onShowFeeAfter}
            >
              Bước Tiếp Theo
            </Button>
          ),

          <Button
            icon={<ExportOutlined />}
            className='btn-outline-secondary'
            // style={{ backgroundColor: 'orange', color: 'white' }}
            // shape="round"
            // key="close-modal"
            onClick={() => {
              setIsModalVisible(false);
              setChoosedCorrectionField('');
            }}
          >
            Đóng
          </Button>,
        ]}
        keyboard={true}
      >
        <Row gutter={8}>
          <Col style={{ width: 125 }}>
            <span className='font-custome'>Số hiệu bưu gửi</span>
          </Col>
          <Col className='config-height' style={{ width: `calc(100% - 125px)` }}>
            <Input className='input-custome' value={ItemCode} disabled />
          </Col>
        </Row>

        <Row gutter={8}>
          {CorrectionItems.length !== 0 &&
            <>
              <Col style={{ width: 125 }}>
                <span className='font-custome'>Loại hiệu chỉnh</span>
              </Col>
              <Col className='config-height' style={{ width: `calc(100% - 125px)` }}>
                <Select
                  id="modal-select"
                  style={{ width: '100%' }}
                  value={ChoosedCorrectionField}
                  onChange={(event) => {
                    setChoosedCorrectionField(event);
                    // console.log(ItemCode);
                  }}
                >
                  {CorrectionItems.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.case_type_id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Col></>
          }
        </Row>
      </Modal>
      <Modal
        className="correct-modal-box"
        visible={isModalLoading}
        onCancel={() => {
          setIsModalLoading(false);
        }}
        footer={[
          <Button
            key="correct-close"
            onClick={() => {
              setIsModalLoading(false);
            }}
          >
            Quay Lại
          </Button>,
          // <Button type="primary" onClick={onSaveCase}>
          //     Test
          // </Button>,
          <Button type="primary" onClick={() => onCancelOrder()}>
            Xác nhận hiệu chỉnh
          </Button>,
          <Button
            onClick={() => {
              setIsModalLoading(false);
            }}
          >
            <Link to={'/manage/order-manager'}>Đóng</Link>
          </Button>,
        ]}
      >
        <Space>
          <Form className="marginTop-5" labelCol={{ span: 14 }} wrapperCol={{ span: 18 }}>
            <Form.Item name="input-sum-money-before" label="Tổng cước tạm tính trước hiệu chỉnh">
              <Input
                addonAfter="đ"
                readOnly={true}
                placeholder={formatCurrency(recordOrderHdr?.totalFee as number)}
              />
            </Form.Item>
            <Form.Item name="input-sum-money-after" label="Tổng cước tạm tính sau hiệu chỉnh">
              <Input addonAfter="đ" readOnly={true} placeholder={formatCurrency(cancelOrderFee)} />
            </Form.Item>
            <Form.Item name="input-sum-money-difference" label="Số tiền nhận lại tạm tính">
              <Input
                addonAfter="đ"
                readOnly={true}
                placeholder={formatCurrency(Math.abs(cancelOrderFee - recordOrderHdr?.totalFee))}
              />
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </PageContainer>
  );
};

export default OrderManager;

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY > 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY < 0) {
    apiObj.scrollPrev();
  }
}
