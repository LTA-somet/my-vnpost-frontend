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
  { id: '1', name: '????n h??ng g???i' },
  { id: '2', name: '????n h??ng trong ng??y' },
  { id: '3', name: '????n h??ng nh??p' },
  { id: '4', name: '????n h??ng nh???n' },
];

const listFeePayer = [
  { id: false, name: 'Ng?????i g???i' },
  { id: true, name: 'Ng?????i nh???n' },
];

const listCod = [
  { id: false, name: 'Kh??ng' },
  { id: true, name: 'C??' },
];

const listCreatedChannel = [
  { id: 'WMVNP', name: 'Web' },
  { id: 'AMVNP', name: 'APP' },
  // { id: 'APICUS', name: 'API kh??ch h??ng' },
  // { id: 'API', name: 'API ?????i t??c' },
];

const listDataSources = [
  { id: 'MYVNP', name: 'My VietNamPost' },
  { id: 'BCCP', name: 'H??? th???ng kh??c' },
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

  // l???y lo???i v???n ????n ??? url query
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
        // get data danh m???c
        // B???n c?? th??? xem l???i b??i vi???t v??? useState()
        setListDmFeildDisplay(res.data);
      })
      .catch((err) => {
        //Tr?????ng h???p x???y ra l???i
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
          if (!(isInit && lstStatus.length !== 0)) { // n???u l?? l???n ch???y ?????u ti??n v?? ???? c?? tr???ng th??i r???i th?? k set n???a
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

  //L???y t??i kho???n cha ho???c t??i kho???n con List<ValueComboboxDto> getAccounts
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
              notification.success({ message: '???? l??u th??ng tin r??t b??u g???i' });
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
      notification.error({ message: 'B???t bu???c nh???p m?? ????n h??ng/m?? v???n ????n ho???c t??? ng??y/?????n ng??y' })
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

  //List tr???ng th??i ????n h??ng

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
      title: <><span>T???t c???</span><span style={{ color: "red", fontWeight: 'bold' }}>{` (${total})`}</span></>,
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

  //End list tr???ng th??i
  const terminateOrder = (id: string) => {
    try {
      terminateOrderControllerApi.terminateOrder(id).then((resp) => {
        if (resp.status === 200 || resp.status === 201) {
          notification.success({ message: 'T???o y??u c???u h???y ????n h??ng th??nh c??ng' });
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
            title: 'H???y ????n h??ng',
            icon: <ForwardOutlined />,
            content: mess,
            okText: '?????ng ??',
            cancelText: '????ng',
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


  // M??n h??nh c??i ?????t hi???n th???
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
            notification.success({ message: 'C???p nh???t th??nh c??ng !' });
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
            notification.error({ message: 'C???t nh???t th???t b???i !' });
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
      // Popup hi???n th??? MH c??i ?????t hi???n th??? MH_QLDH_CD
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
        notification.error({ message: 'Ch???n ????n h??ng ????? k???t xu???t excel' });
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
        notification.error({ message: 'Ch???n ????n h??ng ????? in' });
      }
    }
  };

  const menuOther = (
    <Menu onClick={changePopupShowSetting}>
      {(orderTypeInit === '3' || orderTypeInit === '4') && (
        <Menu.Item key="1" icon={<SettingOutlined />}>
          {' '}
          C??i ?????t hi???n th???{' '}
        </Menu.Item>
      )}
      {(orderTypeInit === '1' || orderTypeInit === '2') && (
        <>
          <Menu.Item key="1" icon={<SettingOutlined />}>
            {' '}
            C??i ?????t hi???n th???{' '}
          </Menu.Item>
          <Menu.Item key="2" icon={<DownloadOutlined style={{ color: '#28a745' }} />}>
            {' '}
            Xu???t Excel
          </Menu.Item>
          <Menu.Item key="3" icon={<PrinterOutlined style={{ color: '#6c757d' }} />}>
            {' '}
            In v???n ????n
          </Menu.Item>
          <Menu.Item key="4" icon={<CopyOutlined style={{ color: '#17a2b8' }} />}>
            {' '}
            Sao ch??p
          </Menu.Item>
          <Menu.Item key="5" icon={<RetweetOutlined style={{ color: '#ffc107' }} />}>
            {' '}
            ?????i tr???ng th??i in{' '}
          </Menu.Item>
        </>
      )}
    </Menu>
  );
  // End m??n h??nh c??i ?????t hi???n th???
  // Ch???n lo???i ????n h??ng

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
  // End Ch???n lo???i ????n h??ng

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
        notification.error({ message: 'Kh??ng c?? quy???n t???o y??u c???u h??? tr???' })
      }
    }
    if (event.key === '7') {
      if (recordOrderHdr?.receiverPhone && recordOrderHdr?.orgCode === currentUser.org && currentUser.uid === currentUser.owner && (opAccounts.map(o => o.value).includes(recordOrderHdr?.owner) || !recordOrderHdr?.owner)) {
        contactApi.updateBlackList(recordOrderHdr.receiverPhone, true, recordOrderHdr.orderHdrId).then((resp) => {
          if (resp.status === 200) {
            notification.success({ message: 'Th??m v??o danh s??ch ??en th??nh c??ng' });
          }
        });
      } else {
        notification.error({ message: 'Kh??ng c?? quy???n th??m v??o danh s??ch ??en' });
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
                    notification.error({ message: "kh??ng t??m th???y service code c???a ????n h??ng" })
                  }
                });


              } else {
                notification.error({
                  message:
                    'Kh??ng th??? hi???u ch???nh ????n h??ng n??y do t???n t???i m???t y??u c???u hi???u ch???nh ch??a ???????c ph?? duy???t!',
                });
              }
            }
          });
      } else {
        notification.error({ message: 'Kh??ng c?? quy???n t???o y??u c???u hi???u ch???nh' });
      }
    }
    if (event.key === '4') {
      // if (recordOrderHdr?.status && parseInt(recordOrderHdr?.status) >= 5) {
      //   notification.error({ message: 'Kh??ng ???????c ph??p in ????n h??ng n??y' })
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
          'B???n mu???n h???y ????n h??ng ' + recordOrderHdr?.itemCode + ' ?',
        );
      } else {
        notification.error({ message: 'Kh??ng c?? quy???n hu??? ????n h??ng' });
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
            ???nh ????nh k??m{' '}
          </Menu.Item>
          {!isProd &&
            ((recordOrderHdr?.receiverOwner === currentUser.uid)
              || ((recordOrderHdr?.receiverOwner != currentUser.uid) && (recordOrderHdr?.receiverCode === currentUser.org) && (recordOrderHdr?.receiverContractNumber != null))) ?
            <Menu.Item key="11" icon={<StarOutlined style={{ color: 'rgb(253 184 19)' }} />}>
              {' '}
              ????nh gi??  {' '}
            </Menu.Item>
            :
            null
          }
        </>
      )}
      {(orderTypeInit === '1' || orderTypeInit === '2') && (
        <>
          <Menu.Item key="2" icon={<PlusCircleOutlined style={{ color: '#17a2b8' }} />}>
            T???o y??u c???u h??? tr???
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
            T???o hi???u ch???nh{' '}
          </Menu.Item>
          <Menu.Item key="4" icon={<PrinterOutlined style={{ color: '#28a745' }} />}>
            {' '}
            In v???n ????n{' '}
          </Menu.Item>
          <Menu.Item key="5" icon={<BarcodeOutlined />}>
            {' '}
            M?? v???ch{' '}
          </Menu.Item>
          <Menu.Item key="6" icon={<PictureOutlined style={{ color: '#6c757d' }} />}>
            {' '}
            ???nh ????nh k??m{' '}
          </Menu.Item>
          <Menu.Item key="7" icon={<FileAddOutlined style={{ color: '#17a2b8' }} />}>
            {' '}
            Th??m v??o DS ??en
          </Menu.Item>
          <Menu.Item key="8" icon={<DeleteOutlined style={{ color: '#dc3545' }} />}>
            {' '}
            H???y ????n h??ng{' '}
          </Menu.Item>
          <Menu.Item key="9" icon={<RetweetOutlined style={{ color: '#ffc107' }} />}>
            {' '}
            Chuy???n tr???ng th??i in{' '}
          </Menu.Item>
          <Menu.Item key="10" icon={<CopyOutlined style={{ color: '#28a745' }} />}>
            {' '}
            Sao ch??p v???n ????n{' '}
          </Menu.Item>
          {!isProd &&
            <>
              {
                (recordOrderHdr?.sendType === '1') && (currentUser.org === recordOrderHdr?.orgCode) ||
                  (recordOrderHdr?.sendType === '2' && (currentUser.org === recordOrderHdr?.orgCode) && Number(recordOrderHdr?.status) >= 14) ?
                  <Menu.Item key="11" icon={<StarOutlined style={{ color: 'rgb(253 184 19)' }} />}>
                    {' '}
                    ????nh gi??  {' '}
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
          notification.success({ message: 'T???o ????n h??ng t??? ????n h??ng nh??p th??nh c??ng' });
        } else {
          notification.error({ message: 'T???o ????n h??ng t??? ????n h??ng nh??p kh??ng th??nh c??ng' });
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
              title="T???o ????n h??ng t??? ????n h??ng nh??p"
              onClick={() => handleCreate(record)}
            >
              <ArrowRightOutlined />
            </Button>
            <Button
              disabled={!(currentUser.uid === record.createdBy)}
              title="S???a ????n h??ng"
              size="small"
            >
              <Link to={'/order/edit/' + record.orderHdrId}>
                <EditOutlined />
              </Link>
            </Button>
            <Popconfirm
              disabled={!(currentUser.uid === record.createdBy)}
              title={record.batchCode ? <>X??a ????n h??ng n??y s??? x??a t???t c??? ????n h??ng trong l??. <br /> B???n ch???c ch???n mu???n x??a?</> : "B???n ch???c ch???n mu???n x??a?"}
              onConfirm={() => deleteRecord(orderHdrId)}
              okText="?????ng ??"
              cancelText="H???y b???"
            >
              <Button
                title="Xo?? ????n h??ng"
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
            <a className="ant-dropdown-link" title="H??nh ?????ng" onClick={() => setRecord(record)}>
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
                    <Space title="Ch???n t??nh n??ng kh??c">
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
                    placeholder="Nh???p m?? v???n ????n, m?? ????n h??ng"
                    title="Nh???p m?? v???n ????n, m?? ????n h??ng"
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
                    placeholder={['t??? ng??y', '?????n ng??y']}
                    onClick={resetDate}
                    onCalendarChange={(e) => setDisableDate(e)}
                    disabledDate={disabledDate}
                    ranges={{
                      'H??m nay': [moment(), moment()],
                      'H??m qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                      '7 ng??y tr?????c': [moment().subtract(6, 'days'), moment()],
                      '30 ng??y tr?????c': [moment().subtract(29, 'days'), moment()],
                      'Th??ng n??y': [moment().startOf('month'), moment()],
                      'Th??ng tr?????c': [
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
                        !currentUser.isEmployee ? <Select disabled={orderTypeInit === '3'} mode="multiple" showArrow allowClear placeholder="Chi nh??nh" onChange={onChangeOrg}>
                          {dataToSelectBox(cmsCustomer, 'accntCode', ['accntCode', 'accntName'])}
                        </Select>
                          : <Input allowClear placeholder="Chi nh??nh" />
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
                        placeholder="Ch???n t??i kho???n"
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
                    title="T??m ki???m"
                    htmlType="submit"
                  >
                    T??m ki???m
                  </Button>
                </Col>
              )}
              {/* {orderTypeInit === '1' && !isShowCreatedBy && (
                <>
                  <Col>
                    {!isOpenSearchAdvanced && (
                      <Button onClick={openSearchAdvanced} className="btn-outline-info">
                        [+] T??m ki???m n??ng cao
                      </Button>
                    )}
                    {isOpenSearchAdvanced && (
                      <Button onClick={openSearchAdvanced} className="btn-outline-info">
                        [-] T??m ki???m n??ng cao
                      </Button>
                    )}
                  </Col>
                  <Col>
                    <Button
                      icon={<SearchOutlined />}
                      className="btn-outline-info"
                      title="T??m ki???m"
                      htmlType="submit"
                    >
                      T??m ki???m
                    </Button>
                  </Col>
                </>
              )} */}
              {/* {orderTypeInit === '2' && (
                <>
                  <Col>
                    {!isOpenSearchAdvanced && (
                      <Button onClick={openSearchAdvanced} className="btn-outline-info">
                        [+] T??m ki???m n??ng cao
                      </Button>
                    )}
                    {isOpenSearchAdvanced && (
                      <Button onClick={openSearchAdvanced} className="btn-outline-info">
                        [-] T??m ki???m n??ng cao
                      </Button>
                    )}
                  </Col>
                  <Col>
                    <Button
                      icon={<SearchOutlined />}
                      className="btn-outline-info"
                      title="T??m ki???m"
                      htmlType="submit"
                    >
                      T??m ki???m
                    </Button>
                  </Col>
                </>
              )} */}
              {/* {orderTypeInit === '3' && !isShowCreatedBy && (
                <>
                  <Col>
                    {!isOpenSearchAdvanced && (
                      <Button onClick={openSearchAdvanced} className="btn-outline-info">
                        [+] T??m ki???m n??ng cao
                      </Button>
                    )}
                    {isOpenSearchAdvanced && (
                      <Button onClick={openSearchAdvanced} className="btn-outline-info">
                        [-] T??m ki???m n??ng cao
                      </Button>
                    )}
                  </Col>
                  <Col>
                    <Button
                      icon={<SearchOutlined />}
                      className="btn-outline-info"
                      title="T??m ki???m"
                      htmlType="submit"
                    >
                      T??m ki???m
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
                        [+] T??m ki???m n??ng cao
                      </Button>
                    )}
                    {isOpenSearchAdvanced && (
                      <Button onClick={openSearchAdvanced} className="btn-outline-info">
                        [-] T??m ki???m n??ng cao
                      </Button>
                    )}
                  </Col>
                  <Col>
                    <Button
                      icon={<SearchOutlined />}
                      className="btn-outline-info"
                      title="T??m ki???m"
                      htmlType="submit"
                    // style={{ width: "50px" }}
                    >
                      T??m ki???m
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
                          <Input allowClear placeholder="H??? t??n/S??T ng?????i g???i" maxLength={255} />
                        </Form.Item>
                      </Col>
                      <Col span={18}>
                        <Address2
                          disabled={currentUser.isEmployee && currentUser.org !== '00'}
                          form={form}
                          hiddenLabel={true}
                          provinceName="T???nh/Th??nh ph??? g???i"
                          districtName="Qu???n/Huy???n g???i"
                          communeName="Ph?????ng/X?? g???i"
                          provinceField="senderProvinceCode"
                          districtField="senderDistrictCode"
                          communeField="senderCommuneCode"
                          requiredProv={currentUser.org === '00'}
                        />
                      </Col>
                      <Col className="config-height" span={6}>
                        <Form.Item name="receiverValue">
                          <Input allowClear placeholder="H??? t??n/S??T ng?????i nh???n" maxLength={255} />
                        </Form.Item>
                      </Col>
                      <Col span={18}>
                        <Address2
                          disabled={currentUser.isEmployee ? true : false}
                          form={form}
                          hiddenLabel={true}
                          provinceName="T???nh/Th??nh ph??? nh???n"
                          districtName="Qu???n/Huy???n nh???n"
                          communeName="Ph?????ng/X?? nh???n"
                          provinceField="receiverProvinceCode"
                          districtField="receiverDistrictCode"
                          communeField="receiverCommuneCode"
                        />
                      </Col>
                      {orderTypeInit != '3' && (
                        <>
                          <Col className="config-height" span={6}>
                            <Form.Item name="isCorrection">
                              <Select allowClear placeholder="????n h??ng c?? hi???u ch???nh">
                                {dataToSelectBox(listCod, 'id', 'name')}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={6} className="config-height">
                            <Form.Item name="isTicket">
                              <Select allowClear placeholder="????n h??ng c?? y??u c???u h??? tr???">
                                {dataToSelectBox(listCod, 'id', 'name')}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col className="config-height" span={6}>
                            <Form.Item name="feeByPayer">
                              <Select allowClear placeholder="Ng?????i tr??? c?????c">
                                {dataToSelectBox(listFeePayer, 'id', 'name')}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col className="config-height" span={6}>
                            <Form.Item name="codAmount">
                              <Select allowClear placeholder="Ti???n thu h???">
                                {dataToSelectBox(listCod, 'id', 'name')}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item name="createdBy">
                              {/* <Select onChange={onChangeCreateByOrder} placeholder="Ng?????i t???o ????n">
                                                    {dataToSelectBox(receiverList, 'contactId', 'name')}
                                                </Select> */}
                              <Select
                                allowClear
                                // mode="multiple"
                                // value={pupdateBy}
                                placeholder="Ch???n ng?????i t???o"
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
                              <Input allowClear onChange={onChangeBatchCode} placeholder="L?? v???n ????n" maxLength={255} />
                            </Form.Item>
                          </Col>
                          <Col className="config-height" span={6}>
                            <Form.Item name="source" className="ConfigPlaceholder">
                              <Select
                                allowClear
                                placeholder="Ngu???n d??? li???u"
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
                              <Select placeholder="K??nh t???o" allowClear disabled={!isShowCreatedChannel}>
                                {dataToSelectBox(listCreatedChannel, 'id', 'name')}
                              </Select>
                            </Form.Item>
                          </Col>
                        </>
                      )}
                      <Col className="config-height" span={6}>
                        <Form.Item name="contract">
                          <Input allowClear placeholder="H???p ?????ng" maxLength={255} />
                        </Form.Item>
                      </Col>
                      <Col className="config-height" span={6}>
                        <Form.Item name="contractC">
                          <Input allowClear placeholder="H???p ?????ng C" maxLength={255} />
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
                  [-] T??m ki???m n??ng cao
                </Button> : <Button onClick={openSearchAdvanced} className="btn-outline-info">
                  [+] T??m ki???m n??ng cao
                </Button>}
                {isOpenSearchAdvanced ? <Button icon={<SearchOutlined />} className="btn-outline-info" title="T??m ki???m" htmlType="submit" style={{ margin: '0px 0px 15px 8px' }}>
                  T??m ki???m
                </Button> : <Button icon={<SearchOutlined />} className="btn-outline-info" title="T??m ki???m" htmlType="submit" style={{ margin: '0px 0px 15px 8px' }}>
                  T??m ki???m
                </Button>}
              </Col>
            </Row>)}
            {orderTypeInit === '2' && (<Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                {isOpenSearchAdvanced ? <Button onClick={openSearchAdvanced} className="btn-outline-info">
                  [-] T??m ki???m n??ng cao
                </Button> : <Button onClick={openSearchAdvanced} className="btn-outline-info">
                  [+] T??m ki???m n??ng cao
                </Button>}
                {isOpenSearchAdvanced ? <Button icon={<SearchOutlined />} className="btn-outline-info" title="T??m ki???m" htmlType="submit" style={{ margin: '0px 0px 15px 8px' }}>
                  T??m ki???m
                </Button> : <Button icon={<SearchOutlined />} className="btn-outline-info" title="T??m ki???m" htmlType="submit" style={{ margin: '0px 0px 15px 8px' }}>
                  T??m ki???m
                </Button>}
              </Col>
            </Row>)}
            {orderTypeInit === '3' && (<Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                {isOpenSearchAdvanced ? <Button onClick={openSearchAdvanced} className="btn-outline-info">
                  [-] T??m ki???m n??ng cao
                </Button> : <Button onClick={openSearchAdvanced} className="btn-outline-info">
                  [+] T??m ki???m n??ng cao
                </Button>}
                {isOpenSearchAdvanced ? <Button icon={<SearchOutlined />} className="btn-outline-info" title="T??m ki???m" htmlType="submit" style={{ margin: '0px 0px 0px 8px' }}>
                  T??m ki???m
                </Button> : <Button icon={<SearchOutlined />} className="btn-outline-info" title="T??m ki???m" htmlType="submit" style={{ margin: '0px 0px 0px 8px' }}>
                  T??m ki???m
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
                        <><span style={{ color: 'black' }}>T???t c???</span><span style={{ color: "red", fontWeight: 'bold' }}>{` (${totalRecord ? totalRecord : '0'})`}</span></>
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
                      Ch???n t???t c???
                    </Button>
                  )}
                  {!isShowSelectAll && (
                    <Button
                      className="btn-outline-danger"
                      icon={<BorderOutlined />}
                      onClick={cancelSelectedAll}
                    >
                      H???y ch???n
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
      {/* B???m v??o ????nh gi?? v?? ????n h??ng g???i */}
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
      {/* B???m v??o ????nh gi?? v?? ????n h??ng nh???n */}
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

        title="T???o hi???u ch???nh"
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
              B?????c ti???p theo
            </Button>

            // <Link to={'/manage/correction-manager/correct/' + ChoosedCorrectionField + '/' + recordOrderHdr?.orderHdrId}
            //   hidden={ChoosedCorrectionField === '' || CorrectionItems.length === 0}>
            //   <span style={{ color: '#28a745' }}> B?????c Ti???p Theo</span>
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
              B?????c Ti???p Theo
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
            ????ng
          </Button>,
        ]}
        keyboard={true}
      >
        <Row gutter={8}>
          <Col style={{ width: 125 }}>
            <span className='font-custome'>S??? hi???u b??u g???i</span>
          </Col>
          <Col className='config-height' style={{ width: `calc(100% - 125px)` }}>
            <Input className='input-custome' value={ItemCode} disabled />
          </Col>
        </Row>

        <Row gutter={8}>
          {CorrectionItems.length !== 0 &&
            <>
              <Col style={{ width: 125 }}>
                <span className='font-custome'>Lo???i hi???u ch???nh</span>
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
            Quay L???i
          </Button>,
          // <Button type="primary" onClick={onSaveCase}>
          //     Test
          // </Button>,
          <Button type="primary" onClick={() => onCancelOrder()}>
            X??c nh???n hi???u ch???nh
          </Button>,
          <Button
            onClick={() => {
              setIsModalLoading(false);
            }}
          >
            <Link to={'/manage/order-manager'}>????ng</Link>
          </Button>,
        ]}
      >
        <Space>
          <Form className="marginTop-5" labelCol={{ span: 14 }} wrapperCol={{ span: 18 }}>
            <Form.Item name="input-sum-money-before" label="T???ng c?????c t???m t??nh tr?????c hi???u ch???nh">
              <Input
                addonAfter="??"
                readOnly={true}
                placeholder={formatCurrency(recordOrderHdr?.totalFee as number)}
              />
            </Form.Item>
            <Form.Item name="input-sum-money-after" label="T???ng c?????c t???m t??nh sau hi???u ch???nh">
              <Input addonAfter="??" readOnly={true} placeholder={formatCurrency(cancelOrderFee)} />
            </Form.Item>
            <Form.Item name="input-sum-money-difference" label="S??? ti???n nh???n l???i t???m t??nh">
              <Input
                addonAfter="??"
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
