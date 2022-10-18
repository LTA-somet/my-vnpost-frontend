import { defaultContentInBatch } from '@/pages/order/create/components/footer';
import { OrderBatchDto } from '@/pages/order/dtos/OrderBatchDto';
import {
  ContactApi,
  ContactDto,
  ContractApi,
  ContractDto,
  McasServiceDto,
  OrderHdrApi,
  OrderHdrDto,
  VaDto,
} from '@/services/client';
import {
  addOrUpdateToDataSource,
  copyObject,
  deleteFromDataSource,
  updateToDataSource,
} from '@/utils/dataUtil';
import { validateBatch } from '@/utils/orderHelper';
import { formatStart0 } from '@/utils/PhoneUtil';
import { FormInstance, notification } from 'antd';
import { uniqueId } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useModel } from 'umi';

export type OptionReceiver = {
  id: number;
  phone: string;
  value: number;
  label: string;
  key: number;
  address: string;
};

const orderHdrApi = new OrderHdrApi();
const contactApi = new ContactApi();
const contractApi = new ContractApi();
export default () => {
  const [form, setForm] = useState<FormInstance>();
  const [senderList, setSenderList] = useState<ContactDto[]>([]);
  const [senderGenerate, setSenderGenerate] = useState<ContactDto>();
  const [serviceListAppend, setServiceListAppend] = useState<McasServiceDto[]>([]);
  const [contractList, setContractList] = useState<ContractDto[]>([]);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.accountInfo;
  const { vasList } = useModel('vasList');
  const [caseTypeId, setCaseTypeId] = useState<number | undefined>();

  // batch
  const [batch, setBatch] = useState<OrderBatchDto[]>([]); // thông tin bc trong lô
  const [isLoadingBatch, setLoadingBatch] = useState<boolean>(false); // loading bacth
  const [batchCode, setBatchCode] = useState<string>(); // mã lô
  const [itemBatchRef, setItemBatchRef] = useState<OrderHdrDto>(); // thông tin chung của lô
  const [focusBatchInfo, setFocusBatchInfo] = useState<boolean>(true);

  const senderListActual = useMemo(() => {
    if (senderGenerate) return [...senderList, senderGenerate];
    return senderList;
  }, [senderList, senderGenerate]);

  const isEditingAction = useRef<boolean>(false);

  // const loadOrderHdr = useCallback((id: string) => {
  //   setLoading(true);
  //   orderHdrApi
  //     .findOrderHdrById(id)
  //     .then((resp) => {
  //       if (resp.status === 200) {
  //         setOrderHdr(resp.data);
  //       }
  //     })
  //     .finally(() => setLoading(false));
  // }, []);

  const findAllSender = useCallback(() => {
    contactApi.findAllByCurrentUser(true).then((resp) => {
      if (resp.status === 200) {
        setSenderList(resp.data);
      }
    });
  }, []);

  useEffect(() => {
    if (!senderGenerate && !isEditingAction.current) {
      const senderDefault = senderList.find((s) => s.isDefault && s.owner === currentUser?.owner);
      if (senderDefault) {
        const setFormSender = (sender: any) => {
          form?.setFieldsValue({
            ...sender,
            senderCode: sender?.contactId,
            senderPhone: sender?.phone,
            senderName: sender?.name,
            senderAddress: sender?.address,
            senderProvinceCode: sender?.provinceCode,
            senderDistrictCode: sender?.districtCode,
            senderCommuneCode: sender?.communeCode,
          });
        };
        // nếu có người gửi mặc định
        setFormSender({ ...senderDefault, senderId: senderDefault.contactId });
      }
      isEditingAction.current = false;
    }
  }, [senderList, senderGenerate, isEditingAction]);

  const findSenderContract = useCallback(() => {
    contractApi.findSenderContractAccept().then((resp) => {
      if (resp.status === 200) {
        setContractList(resp.data);
      }
    });
  }, []);

  const addSender = useCallback(
    (senderInfo: ContactDto) => {
      setSenderList([
        ...senderList.filter((s) => s.contactId !== -1),
        { ...senderInfo, contactId: -1 },
      ]);
    },
    [senderList],
  );

  const orderHdrToSenderInfo = (orderHdrDto: OrderHdrDto): ContactDto => {
    const senderInfo: ContactDto = {
      contactId: -1,
      name: orderHdrDto.senderName,
      isSender: true,
      address: orderHdrDto.senderAddress,
      provinceCode: orderHdrDto.senderProvinceCode,
      districtCode: orderHdrDto.senderDistrictCode,
      communeCode: orderHdrDto.senderCommuneCode,
      postCode: orderHdrDto.senderPostcode,
      vpostCode: orderHdrDto.senderVpostcode,
      phone: formatStart0(orderHdrDto.senderPhone),
      email: orderHdrDto.senderEmail,
      lon: orderHdrDto.senderLon,
      lat: orderHdrDto.senderLat,
      orgCodeAccept: orderHdrDto.orgCodeAccept,
      orgCodeCollect: orderHdrDto.orgCodeCollect,
      successOrders: 0,
      failOrders: 0,
      totalOrders: 0,
      configPrintOrder: orderHdrDto.configPrintOrder,

      namePrinted: orderHdrDto.namePrinted,
      addressPrinted: orderHdrDto.addressPrinted,
      provinceCodePrinted: orderHdrDto.provinceCodePrinted,
      districtCodePrinted: orderHdrDto.districtCodePrinted,
      communeCodePrinted: orderHdrDto.communeCodePrinted,
      phonePrinted: orderHdrDto.phonePrinted,
    };
    return senderInfo;
  };

  const resetListSender = () => {
    setSenderList([...senderList.filter((s) => s.contactId !== -1)]);
  };

  const addSenderFromOrder = useCallback(
    (orderHdrDto: OrderHdrDto): OrderHdrDto => {
      const sender: ContactDto | undefined = senderList.find(
        (s) => s.contactId === orderHdrDto.senderId,
      );

      if (!orderHdrDto.senderId || orderHdrDto.senderId === -1 || !sender) {
        // nếu không có sender thì tự add thêm 1 bản ghi vào danh mục người gửi
        if (orderHdrDto.senderName && orderHdrDto.senderPhone) {
          const senderInfo = orderHdrToSenderInfo(orderHdrDto);
          // setSenderList([...senderList.filter((s) => s.contactId !== -1), senderInfo]);
          setSenderGenerate(senderInfo);
          return { ...orderHdrDto, senderId: -1 };
        } else {
          return orderHdrDto;
        }
      } else {
        // nếu có sender thì cập nhật thông tin sender mới vào order hdr
        const newOH: OrderHdrDto = {
          ...orderHdrDto,
          senderName: sender.name || '',
          senderAddress: sender.address || '',
          senderProvinceCode: sender.provinceCode || '',
          senderDistrictCode: sender.districtCode || '',
          senderCommuneCode: sender.communeCode,
          senderPostcode: sender.postCode,
          senderVpostcode: sender.vpostCode,
          senderPhone: sender.phone || '',
          senderEmail: sender.email,
          senderLon: sender.lon,
          senderLat: sender.lat,
          orgCodeAccept: sender.orgCodeAccept,
          orgCodeCollect: sender.orgCodeCollect || '',
          configPrintOrder: sender.configPrintOrder,

          namePrinted: sender.namePrinted,
          addressPrinted: sender.addressPrinted,
          provinceCodePrinted: sender.provinceCodePrinted,
          districtCodePrinted: sender.districtCodePrinted,
          communeCodePrinted: sender.communeCodePrinted,
          phonePrinted: sender.phonePrinted,
        };
        return newOH;
      }
    },
    [senderList],
  );

  const editSender = useCallback(
    (recordEdit, senderInfo: any) => {
      const newRecord = { ...recordEdit, ...senderInfo };
      const newSenderList = updateToDataSource(senderList, newRecord, 'contactId');
      isEditingAction.current = true;
      setSenderList(newSenderList);
    },
    [senderList],
  );

  const setDefaultSender = useCallback(() => {
    const setFormSender = (sender: any) => {
      form?.setFieldsValue({
        ...sender,
        senderCode: sender?.contactId,
        senderPhone: sender?.phone,
        senderName: sender?.name,
        senderAddress: sender?.address,
        senderProvinceCode: sender?.provinceCode,
        senderDistrictCode: sender?.districtCode,
        senderCommuneCode: sender?.communeCode,
      });
    };

    // if (senderGenerate) {
    //   return;
    // }

    // nếu là thêm mới và không có đơn hàng mẫu mặc định => lấy sender mặc định
    const senderDefault = senderList.find((s) => s.isDefault && s.owner === currentUser?.owner);
    if (senderDefault) {
      // nếu có người gửi mặc định
      setFormSender({ ...senderDefault, senderId: senderDefault.contactId });
    } else {
      if (!currentUser || senderList.some((s) => s.contactId === -1)) {
        // setSenderList([...senderList.filter((s) => s.contactId !== -1)]);
        return;
      }

      // nếu k có người gửi mặc định => lấy theo địa chỉ của user hiện tại
      const senderInfo: ContactDto = {
        phone: currentUser?.phoneNumber,
        name: currentUser?.ufn,
        address: currentUser?.addr,
        provinceCode: currentUser?.prov,
        districtCode: currentUser?.dist,
        communeCode: currentUser?.comm,
      };
      // console.log(currentUser, senderInfo);
      addSender(senderInfo);
      setFormSender({ ...senderInfo, senderId: -1 });
    }
  }, [senderList, senderGenerate]);

  /******************************* LÔ - BATCH ************************************/
  // gộp thông tin của lô và thông tin từng bg
  const mergerBatch = (newBatch: OrderBatchDto[], newItemBatchRef?: OrderHdrDto) => {
    const amountForBatch = newItemBatchRef?.vas?.some((v) => v.vaCode === 'GTG021');
    const batchFinal: OrderHdrDto[] = newBatch.map((item: OrderBatchDto) => {
      const content = copyObject(defaultContentInBatch, item);
      const order: OrderHdrDto = {
        ...newItemBatchRef!,
        ...content,
        orderHdrId: item.orderHdrId,
        orderBillings: [],
        acceptanceIndex: item.acceptanceIndex,
        saleOrderCode: item.saleOrderCode,
        batchCode: batchCode
      };
      // nếu thông tin chung đc tích cod thì có nghĩa là thu hộ theo lô
      order.amountForBatch = amountForBatch;
      // nếu không thu hộ theo lô
      if (!amountForBatch) {
        // lấy thông tin cod theo từng BG

        // cũ
        // const vaCod = item.vas?.find((v) => v.vaCode === 'GTG021');
        // if (vaCod) {
        //   let newVas = order.vas || [];
        //   newVas = addOrUpdateToDataSource(newVas, vaCod, 'vaCode');
        //   order.vas = newVas;
        // }

          const cod = item?.cod;
          if (cod) {
              // nếu có nhập cod
              const codVaList = vasList.find(v => v.vaServiceId === 'GTG021');
              const newVaCod: VaDto = {
                  vaCode: codVaList?.vaServiceId,
                  addons: codVaList?.propsList?.map(p => ({
                      vaCode: codVaList?.vaServiceId,
                      propCode: p.propCode,
                      propValue: `${p.propCode === 'PROP0018' ? cod : p.defaultValue}`
                  })) ?? []
              }
              order.vas = [...order.vas!, newVaCod];
          }
      }
      return order;
    });
    return batchFinal;
  };

  // thêm bưu gửi vào lô (bưu gửi chỉ chứ thông tin content)
  const addForBatch = useCallback(
    (orderHdr: OrderHdrDto, callback?: () => void) => {
      const newBatch = [...batch];
      const id = uniqueId('batch-');
      orderHdr.orderHdrId = id;
      orderHdr.batchCode = batchCode;
      newBatch.push(orderHdr);

      // sort and reindex
      newBatch.sort((a, b) => ((a.acceptanceIndex ?? 9999) > (b.acceptanceIndex ?? 9999) ? 1 : -1));
      newBatch.map((o, i) => {
        o.acceptanceIndex = i + 1;
        o.amountForBatch = orderHdr.amountForBatch;
      });

      setBatch(newBatch);
      callback?.();
    },
    [batch],
  );

  // sửa bưu gửi trong lô
  const editItemInBatch = useCallback(
    (orderHdrId: string, orderHdr: OrderHdrDto) => {
      const index = batch.findIndex((o) => o.orderHdrId === orderHdrId);
      orderHdr.acceptanceIndex = index + 1;
      orderHdr.batchCode = batchCode;
      const newBatch = addOrUpdateToDataSource(batch, orderHdr, 'orderHdrId');
      setBatch(newBatch);
    },
    [batch],
  );

  // xoá bưu gửi trong lô
  const removeForBatch = useCallback(
    (orderHdr: OrderHdrDto, callback?: () => void) => {
      const newBatch = deleteFromDataSource(batch, orderHdr.orderHdrId, 'orderHdrId');
      newBatch.sort((a, b) => ((a.acceptanceIndex ?? 9999) > (b.acceptanceIndex ?? 9999) ? 1 : -1));
      newBatch.map((o, i) => {
        o.acceptanceIndex = i + 1;
      });
      setBatch(newBatch);
      callback?.();
    },
    [batch],
  );

  // load thông tin các bưu gửi trong lô
  useEffect(() => {
    if (batchCode) {
      setLoadingBatch(true);
      orderHdrApi
        .findByBatchCode(batchCode)
        .then((resp) => {
          const newOrderBacth: OrderBatchDto[] = [...resp.data];
          newOrderBacth.forEach(b => {
            const vaGTG021 = b.vas?.find(v => v.vaCode === 'GTG021');
            if(vaGTG021) {
              const prop0018 = vaGTG021.addons?.find(p => p.propCode === 'PROP0018');
              b.cod = prop0018?.propValue ? +prop0018?.propValue : undefined;
            }
          })
          setBatch(resp.data)
        })
        .finally(() => setLoadingBatch(false));
    } else {
      setBatch([]);
    }
  }, [batchCode]);

  // lấy thông tin cuối cùng của lô (thông tin chung + thông tin riêng của từng bg)
  const getBatchFinal = useCallback(
    (newItemBatchRef: OrderHdrDto): OrderHdrDto[] => {
      const finalItemBatchRef = newItemBatchRef ?? itemBatchRef;
      const batchFinal = mergerBatch(batch, finalItemBatchRef);
      batchFinal.forEach((item) => {
        const id = item.orderHdrId?.startsWith('batch-') ? undefined : item.orderHdrId;
        item.orderHdrId = id;
      });
      return batchFinal;
    },
    [batch, itemBatchRef],
  );

  const getBatchFinalAndValidate = useCallback(
    (newItemBatchRef: OrderHdrDto): Promise<OrderHdrDto[]> => {
      return new Promise((resolve, reject) => {
        if (batch.length === 0) {
          notification.warn({ message: 'Không có bưu gửi trong lô' });
          onOutFocusBatchInfo();
          return reject('Không có bưu gửi trong lô');
        }

        // isServiceDocument
        const serviceCode = newItemBatchRef.serviceCode;
        const service = serviceListAppend.find(s => s.mailServiceId === serviceCode);
        const isServiceDocument: boolean = service?.type === 'TL';

        // isPhatMotPhan
        const isHasPhatMotPhan = newItemBatchRef.vas?.some(va => va.vaCode === 'GTG068') ?? false;

        const validateResult = validateBatch(batch, isServiceDocument, isHasPhatMotPhan);
        if(!validateResult.success) {
          return reject(validateResult.error);
        }
        const batchFinal = getBatchFinal(newItemBatchRef);
        resolve(batchFinal);
      })
    },
    [batch, itemBatchRef],
  );

  const setFormInit = (f: FormInstance, newCaseTypeId: number | undefined) => {
    setForm(f);
    setCaseTypeId(newCaseTypeId);
  };

  const cleanup = () => {
    setSenderGenerate(undefined);
    setSenderList([]);
    setBatch([]);
    setBatchCode(undefined);
    setForm(undefined);
    setCaseTypeId(undefined);
  };

  const onFocusBatchInfo = useCallback(() => {
    if (!focusBatchInfo) {
      setFocusBatchInfo(true);
    }
  }, [focusBatchInfo]);

  const onOutFocusBatchInfo = useCallback(() => {
    if (focusBatchInfo) {
      setFocusBatchInfo(false);
    }
  }, [focusBatchInfo]);

  const checkDisabledEdit = useCallback((caseTypeIds: number[]) => {
    if(caseTypeId === undefined) {
      return false;
    }
    return caseTypeIds.includes(caseTypeId);
  }, [caseTypeId]);

  const onSetItemBatchRef = useCallback((newOrderBacthRef?: OrderBatchDto) => {
    if(newOrderBacthRef) {
      newOrderBacthRef.batchCode = batchCode;
    }
    setItemBatchRef(newOrderBacthRef);
  }, [itemBatchRef])

  return {
    senderListActual,
    findAllSender,
    addSender,
    editSender,
    addSenderFromOrder,
    serviceListAppend,
    setServiceListAppend,
    contractList,
    findSenderContract,
    setDefaultSender,
    resetListSender,
    checkDisabledEdit,
    caseTypeId,

    // lô
    batch,
    setBatch,
    addForBatch,
    removeForBatch,
    isLoadingBatch,
    setBatchCode,
    getBatchFinal,
    onSetItemBatchRef,
    setFormInit,
    cleanup,
    itemBatchRef,
    editItemInBatch,
    focusBatchInfo,
    onFocusBatchInfo,
    onOutFocusBatchInfo,
    form,
    getBatchFinalAndValidate,
  };
};
