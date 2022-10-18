import { ExportOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, Row, Segmented, Select, Spin, Table, Modal, Space, notification } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import defineColumns from './columns';
import type { CaseAnhltDto, OrderHdrDto, OrderCorrectionCaseDto, OrderHdrEntity, CaseTypeDto, CaseParamDto } from '@/services/client';
import { CaseAnhlt130Api, ProductApi, OrderCorrectionApi, OrderCorrectionControllerApi } from '@/services/client';
import { dataToSelectBox } from '@/utils';
import moment from 'moment';
import { validateMessages } from '@/core/contains';
import CorrectionDetail from './correction-info';
import { Link, history } from 'umi';
import { formatCurrency } from '@/utils';
import { useCurrentUser } from '@/core/selectors';
import { PageContainer } from '@ant-design/pro-layout';
import { RangePickerProps } from 'antd/lib/date-picker';
import { formatStart0 } from '@/utils/PhoneUtil';

const listStatus = [
    { value: "-1", label: "Tất cả" },
    { value: "0", label: "Chờ xử lý" },
    { value: "1", label: "Đã xử lý" },
    { value: "2", label: "Từ chối xử lý" },
];

const orderCorrectionControllerApi = new OrderCorrectionControllerApi();
const orderCorrectionApi = new OrderCorrectionApi();
const productApi = new ProductApi();
const caseApi = new CaseAnhlt130Api();
const CorrectionManager = () => {
    const { RangePicker } = DatePicker;
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [opAccounts, setOpAccounts] = useState<any[]>([]);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [recordDetail, setRecordDetail] = useState<CaseAnhltDto>();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [CorrectionItems, setCorrectionItems] = useState<OrderCorrectionCaseDto[]>([])
    const [ChoosedCorrectionField, setChoosedCorrectionField] = useState<string>();
    const [isSelectDisabled, setSelectDisabled] = useState<boolean>(false);
    const [correctionOrder, setCorrectionOrder] = useState<OrderHdrEntity>();
    const [isModalLoading, setIsModalLoading] = useState<boolean>(false);
    const [itemCode, setItemCode] = useState<string>('');
    const [listCaseType, setListCaseType] = useState<CaseTypeDto[]>([]);
    const [disableDate, setDisableDate] = useState<any>();
    const currentUser = useCurrentUser();
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [paramSearch, setParamSearch] = useState<CaseParamDto>();

    const [totalRecord, setTotalRecord] = useState<number>();
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [table, setTable] = useState<string>();
    const [feeAfterCorrection, setFeeAfterCorrection] = useState<number>(0)


    const searchAllByParam = useCallback(
        (param: any, p: number, s: number, callback?: (success: boolean) => void) => {
            setIsLoading(true);
            caseApi.searchByCaseParam(param, p, s)
                .then((resp: any) => {
                    if (resp.status === 200) {
                        setDataSource(resp.data);
                        setTotalRecord(resp.headers['x-total-count']);
                    } if (callback) {
                        callback(resp.status === 200);
                    }
                })
                .finally(() => setIsLoading(false));

        }, [])

    useEffect(() => {
        console.log(paramSearch);

        if (paramSearch) {
            searchAllByParam(paramSearch, page, pageSize)
        } else {
            searchAllByParam({}, page, pageSize)
        }
    }, [page, pageSize, paramSearch, table])

    const onFinish = (param: any) => {
        if (table !== '-1') {
            param.status = table
        }
        if (param.toDateFromDate) {
            const date: string[] = []
            param.toDateFromDate.map(d => {
                date.push(moment(d).format('YYYY-MM-DD HH:mm'));
            })
            param.toDateFromDate = date

        }
        setParamSearch(param)
        setPage(0);
    }

    const onCalculateCancelFeeKHL = () => {
        orderCorrectionControllerApi.findOrderByItemCodeAndVer(itemCode as string, '9999').then((resp) => {
            if (resp.status === 200) {
                console.log(resp.data)
                orderCorrectionApi.calculateCancelKHLFee(resp.data as OrderHdrDto).then(resp1 => {
                    if (resp1.status === 200) {
                        console.log(resp1.data);
                        setFeeAfterCorrection(+resp1.data)
                    }
                })
            }
        })
    }

    const onCancelOrder = () => {

        orderCorrectionApi.cancelOrder(correctionOrder as OrderHdrEntity).then(
            resp => {
                if (resp.status === 201 || resp.status === 200) {
                    notification.success({ message: "Đã lưu thông tin rút bưu gửi" });
                    history.push('/manage/order-manager')
                    setIsModalLoading(false);
                    setIsSaved(true)
                    setIsModalVisible(false)
                }
                else {
                    setIsModalLoading(false);
                    setIsModalVisible(false)
                    setIsSaved(false)
                }
            })


    }

    const onShowFeeAfter = () => {
        onCalculateCancelFeeKHL()
        setIsModalLoading(true)
    }

    const handleOnEnter = (params: string) => {
        setItemCode(params)
        orderCorrectionApi.checkPossiblyCorrected(params).then((res) => {
            if (res.status === 200) {
                if (res.data as unknown as boolean === true) {
                    orderCorrectionControllerApi.findOrderByItemCodeAndVer(params, '9999').then((resp) => {
                        if (resp.status === 200) {
                            const x: OrderHdrEntity = resp.data;

                            setCorrectionOrder(x)
                            orderCorrectionControllerApi.getCaseByOrder(x.status + '', x.serviceCode!).then(resp1 => {
                                setCorrectionItems(resp1.data as OrderCorrectionCaseDto);
                                setSelectDisabled(true);

                            })
                        }
                    })
                }
            }
        }
        )
    }




    useEffect(() => {
        caseApi.findAllCaseType()
            .then(resp => {
                if (resp.status === 200) {
                    setListCaseType(resp.data)
                }
            })
        productApi.getAccount().then((resp) => {
            if (resp.status === 200) {
                setOpAccounts(resp.data);
            }
        })
    }, [])

    const onChangeTable = (value: any) => {
        setTable(value)

        if (value === '-1') {
            if (paramSearch) {
                paramSearch.status = undefined
            } else {
                setParamSearch({})
            }
        }
        else {
            if (paramSearch) {
                paramSearch.status = value
            } else {
                setParamSearch({ status: value })
            }
        }

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
    const resetDate = () => {
        form.setFieldsValue({ toDateFromDate: null })
        setDisableDate(undefined)
    }

    const action = (caseId: any, record: CaseAnhltDto) => {
        setShowDetail(!showDetail);
        setRecordDetail(record);
    }

    const onChangePage = (p: any, s: any) => {
        setPage(p - 1);
        setPageSize(s);
    };

    const columns: any[] = defineColumns(action);
    console.log("ChoosedCorrectionField", ChoosedCorrectionField);

    return (
        <PageContainer className="fadeInRight">
            <Spin spinning={isLoading}>
                <Form
                    name="form-correction-manager"
                    labelCol={{ flex: '130px' }}
                    labelWrap
                    onFinish={onFinish}
                    form={form}
                    validateMessages={validateMessages}
                >
                    <Card>
                        <Row gutter={8} >
                            <Col span={6}>
                                <Form.Item name="searchValue">
                                    <Input
                                        placeholder="Nhập số hiệu bưu gửi, mã đơn hàng"
                                        title='Nhập số hiệu bưu gửi, mã đơn hàng'
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="toDateFromDate"
                                    rules={[{ required: true, message: 'Trường này không được để trống!' }]}
                                    initialValue={[moment(), moment()]}
                                >
                                    <RangePicker
                                        style={{ width: "100%" }}
                                        placeholder={["từ ngày", "đến ngày"]}
                                        format="DD/MM/YYYY"
                                        onClick={resetDate}
                                        onCalendarChange={(e) => setDisableDate(e)}
                                        disabledDate={disabledDate}
                                    />
                                </Form.Item>
                            </Col>
                            {!currentUser.isEmployee &&
                                <Col span={6}>
                                    <Form.Item
                                        name="createdBy"
                                    >
                                        <Select
                                            disabled={currentUser.uid !== currentUser.owner}
                                            defaultValue={currentUser.uid === currentUser.owner ? currentUser.uid : currentUser.ufn + ' - ' + formatStart0(currentUser.phoneNumber)}
                                            allowClear
                                            placeholder="Tất cả tài khoản"
                                            style={{ width: "100%" }}
                                        >
                                            {opAccounts.map((v) => (
                                                <Select.Option key={v.value} value={v.value}>
                                                    {v.label}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            }

                            <Col span={6}>
                                <Form.Item
                                    name="caseTypeId"
                                >
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Loại hiệu chỉnh"
                                    >
                                        {dataToSelectBox(listCaseType, 'caseTypeId', 'name')}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Space direction="horizontal" style={{ width: '100%', justifyContent: 'right' }}>
                            <Button icon={<SearchOutlined />} className='btn-outline-info' title='Tìm kiếm' htmlType='submit' >Tìm kiếm</Button>
                            <Button onClick={() => setIsModalVisible(true)} className='btn-outline-info' style={{ float: "right" }} icon={<PlusCircleOutlined />}  >Tạo hiệu chỉnh</Button>
                        </Space>
                        {/* <Card> */}
                        <Row gutter={8}>
                            <Col span={24}>
                                <Segmented
                                    options={listStatus}
                                    onChange={onChangeTable}
                                // size='large'
                                />
                                <Table
                                    size="small"
                                    pagination={{
                                        total: totalRecord,
                                        current: page + 1,
                                        defaultPageSize: 10,
                                        showSizeChanger: true,
                                        pageSizeOptions: ['10', '20', '50', '100'],
                                        onChange: onChangePage,
                                    }}
                                    dataSource={dataSource}
                                    columns={columns}
                                    bordered
                                />
                            </Col>
                        </Row>
                        {/* </Card> */}
                    </Card>
                </Form>
            </Spin>
            <CorrectionDetail
                visible={showDetail}
                setVisible={setShowDetail}
                record={recordDetail}
            />
            <Modal
                className="modal-box"
                visible={isModalVisible}
                // onOk={() => { setIsModalVisible(false) }}
                title="Số hiệu bưu gửi"
                onCancel={() => {
                    setIsModalVisible(false);
                    setChoosedCorrectionField('');

                }}
                footer={[
                    ChoosedCorrectionField != '8' ?
                        <Button
                            style={{ backgroundColor: 'orange', color: 'white' }}
                            shape="round"
                            key="next-step"
                            hidden={ChoosedCorrectionField == undefined || ChoosedCorrectionField === '' || CorrectionItems.length === 0}
                        >
                            <Link
                                to={'/manage/correction-manager/correct/' + ChoosedCorrectionField + '/' + correctionOrder?.orderHdrId}
                            >
                                Bước Tiếp Theo
                            </Link>
                        </Button>
                        : <Button
                            style={{ backgroundColor: 'orange', color: 'white' }}
                            shape="round"
                            key="next-step"
                            hidden={ChoosedCorrectionField == undefined || CorrectionItems.length === 0}
                            onClick={onShowFeeAfter}

                        >
                            Bước Tiếp Theo

                        </Button>,
                    <Button
                        icon={<ExportOutlined />}
                        className="custom-btn1 btn-outline-secondary"
                        key="close-modal"
                        shape="round"
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
                {/* <Form> */}
                {/* <Form.Item
        label="Số hiệu bưu gửi * :"
        name="item-code"

    > */}
                {/* <label htmlFor="modal-input">Số hiệu bưu gửi</label> */}
                <Input placeholder='Nhập số hiệu bưu gửi' className='input-custome' id="modal-input" onPressEnter={(e: any) => handleOnEnter(e.target.value)} />

                {/* <Form.Item
        label="Loại hiệu chỉnh * : "
        name="item-type"
        rules={[{ required: true, message: 'Bạn phải chọn loại hiệu chỉnh!' }]}
    > */}

                <div hidden={!isSelectDisabled}>
                    <label htmlFor="modal-select" > Loại hiệu chỉnh</label>
                    <Select
                        allowClear={true}

                        id="modal-select"
                        style={{ width: '100%' }}
                        value={ChoosedCorrectionField}
                        onChange={(event) => {
                            setChoosedCorrectionField(event);

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
                </div>

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
                    <Button
                        type="primary"
                        onClick={() => onCancelOrder()}
                        disabled={isSaved}
                    >
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
                    <Row className="marginTop-5">
                        <Col span={12}>Tổng cước tạm tính trước hiệu chỉnh</Col>
                        <Col span={12}>
                            <Input
                                addonAfter="đ"
                                readOnly={true}
                                // placeholder={formatCurrency(correctionOrder?.totalFee)}
                                value={formatCurrency(correctionOrder?.totalFee)}
                            />
                        </Col>
                        <Col span={12}>Tổng cước tạm tính sau hiệu chỉnh</Col>
                        <Col span={12}>
                            <Input addonAfter="đ" readOnly={true} value={feeAfterCorrection} />
                        </Col>
                        <Col span={12}>{(correctionOrder?.totalFee ?? 0) - feeAfterCorrection! > 0
                            ? 'Số tiền trả thêm tạm tính'
                            : 'Số tiền nhận lại tạm tính'}</Col>
                        <Col span={12}>
                            <Input
                                addonAfter="đ"
                                readOnly={true}
                                value={(correctionOrder?.totalFee ?? 0) - feeAfterCorrection!}
                            />
                        </Col>
                    </Row>
                </Space>
            </Modal>

        </PageContainer>
    );
}

export default CorrectionManager;