import React, { Component, useState, useEffect } from 'react';
import {
  Button,
  Card,
  Drawer,
  notification,
  Popconfirm,
  Checkbox,
  Space,
  Spin,
  Table,
  Row,
  Col,
  message,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  SearchOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { columns } from './columns';
import { PageContainer } from '@ant-design/pro-layout';
import { useHistory, useModel } from 'umi';
import { Select, Input, AutoComplete } from 'antd';
import './styles.css';

const { Option } = Select;
export default () => {
  const {
    sampleOrders,
    searchContents,
    isLoading,
    idDelete,
    opAccounts,
    opDelegater,
    setOpDelegater,
    mcasVaServiceDto,
    mcasServiceDto,
    pcontent,
    pcreateUser,
    pupdateBy,
    setPcontent,
    setPcreetUser,
    setPupdateBy,
    searchContentOrder,
    searchSampleOrder,
    deleteById,
    deleteByListId,
    updateDefault,
    deleteDefault,
    getOpAccountChild,
    getOpDelegater,
    getAllMcasVaService,
    getAllMcasService,
  } = useModel('sampleOrderList');
  const [dataTables, setDataTable] = useState([]);
  const [selectedRowKeys, setSlectedRowKeys] = useState([]);
  const [optionContent, setOptioneContent] = useState([]);

  const { initialState } = useModel('@@initialState');
  const history = useHistory();
  const user = initialState?.accountInfo;

  useEffect(() => {
    getOpAccountChild();
    searchContentOrder();
    getAllMcasVaService();
    getAllMcasService();
    searchSampleOrder(pcontent, pcreateUser, pupdateBy);
  }, []);

  useEffect(() => {
    console.log('user: ', user);
    console.log('sampleOrders: ', sampleOrders);
    let newDataTable = [];
    sampleOrders.forEach((row, index) => {
      let item = {};
      item.stt = index + 1;
      item.orderTemplateId = row.orderTemplateId;
      item.orderContent = row.orderContent;
      item.senderName = row?.data?.senderName; //nguoi gui
      item.receiverName = row?.data?.receiverName;
      item.weight = row?.data?.weight;
      item.serviceCode = row?.data?.serviceCode;

      item.sendType = row?.data?.sendType;
      item.deliveryRequire = row?.data?.deliveryRequire;
      item.default = row?.default == 1 ? true : false;
      item.owner = row?.owner;
      let vaCodes = '';
      //T??n h??ng h??a
      if (row?.data?.orderContents && row?.data?.orderContents.length > 0) {
        let nameVi = '';
        row?.data?.orderContents.forEach((conten) => {
          nameVi += conten?.nameVi + ' |';
        });

        item.nameVi = nameVi.substring(0, nameVi.length - 1);
      } else {
        item.nameVi = '';
      }
      //T??n d???ch v??? chuy???n ph??t
      item.serviceName = row?.data?.serviceCode
        ? mcasServiceDto.find((service) => service.mailServiceId == row?.data?.serviceCode)
            ?.myvnpMailServiceName || ''
        : '';

      //T??n d???ch v??? c???ng th??m
      if (row?.data?.vas && row?.data?.vas.length > 0) {
        let vaCodeName = '';
        row?.data?.vas.forEach((conten) => {
          vaCodeName +=
            mcasVaServiceDto.find((vas) => vas?.vaServiceId == conten?.vaCode)?.vaServiceNameVnp +
            ' |';
        });
        item.vaCodeName = vaCodeName.substring(0, vaCodeName.length - 1);
      } else {
        item.vaCodeName = '';
      }

      row?.data?.vas.forEach((elvas) => {
        vaCodes += elvas.vaCode + ';';
      });
      item.vaCode = vaCodes;
      newDataTable.push(item);
    });
    setDataTable(newDataTable);
  }, [sampleOrders]);

  useEffect(() => {
    console.log('idDelete', idDelete);
  }, [idDelete]);

  const onSearchByParam = () => {
    console.log('pconten: ', pupdateBy);
    searchSampleOrder(pcontent, pcreateUser, pupdateBy);
  };

  function onSelect(value, option) {
    console.log('optione :', option);
    setPcontent(option?.value || '');
  }

  const onSelectChange = (selectedRowKeyChoose) => {
    console.log('selectedRowKeys changed: ', selectedRowKeyChoose);
    setSlectedRowKeys(selectedRowKeyChoose);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  function onChangeDefault(record) {
    console.log('record: ', record);
    console.log(record.owner, user.owner, record.owner == user.owner);
    // let newSampleOrders = [...sampleOrders];
    // const index = newSampleOrders.findIndex( x => x.orderTemplateId == record.orderTemplateId );
    // deleteDefault
    // dataTables.forEach( e =>{
    //     if(e.default == true){
    //         deleteDefault(e.orderTemplateId, false, pcontent,  pcreateUser,pupdateBy);
    //     }
    // })
    updateDefault(
      record.orderTemplateId,
      !dataTables[record.stt - 1].default,
      pcontent,
      pcreateUser,
      pupdateBy,
    );
  }

  function onDeleteRecord(record) {
    console.log('record: ', record);
    deleteById(record?.orderTemplateId);
    // deleteById(record?.)
  }

  function onDeleteListChecBox() {
    const newSelectedRowKeys = [...selectedRowKeys];
    let lstId = [];
    let checked = true;
    newSelectedRowKeys.forEach((key) => {
      if (user.owner != sampleOrders[key - 1]?.owner) {
        checked = false;
      }
      lstId.push(sampleOrders[key - 1]?.orderTemplateId);
    });
    if (checked == true) {
      if (lstId.length > 0) {
        deleteByListId(lstId);
        setSlectedRowKeys();
      } else {
        notification.info({
          message: 'Kh??ng c?? b???n ghi n??o ???????c ch???n',
        });
      }
    } else {
      notification.error({
        message: 'Kh??ng c?? quy???n x??a d??? li???u',
      });
    }
  }

  function onChangeAccount(value) {
    setPcreetUser(value);
    setPupdateBy();
    setOpDelegater([]);
    console.log('pcreatedUser', value);
    if (value != null) {
      getOpDelegater(value);
    }
  }

  function onViewEdit(id) {
    // e.preventDefault();
    history.push('/setting/order-template/' + id);
    // notification.info({
    //   message: '??ang ph??t tri???n',
    // });
  }

  function onViewCreate() {
    // e.preventDefault();
    history.push('/setting/order-template/create');
  }

  const columnsAdd = columns.concat([
    {
      title: 'M???c ?????nh',
      key: 'key',
      dataIndex: 'key',
      align: 'center',
      render: (text, record) => (
        <Checkbox
          checked={record?.default}
          onChange={() => onChangeDefault(record)}
          // disabled={user.owner == record?.owner && user?.uid == user?.owner ? false : true}
        />
      ),
    },
    {
      title: 'H??nh ?????ng',
      key: 'key',
      dataIndex: 'key',
      align: 'center',
      render: (text, record) => (
        <Space>
          <Button
            className="btn-outline-info"
            size="small"
            title="S???a"
            // icon={<EditOutlined />}
            disabled={user.owner == record?.owner ? false : true}
            onClick={() => onViewEdit(record.orderTemplateId)}
          >
            <EditOutlined />
          </Button>
          <Button
            className="btn-outline-danger"
            size="small"
            title="X??a"
            // icon={<DeleteOutlined />}
            disabled={user.owner == record?.owner ? false : true}
            onClick={() => onDeleteRecord(record)}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ]);

  const onSearchContentOrder = (value) => {
    setPcontent(value);
    searchContentOrder(value);
  };

  return (
    <PageContainer className="fadeInRight">
      <Spin spinning={isLoading}>
        <Card>
          <Row gutter={8}>
            <Col span={6}>
              <AutoComplete
                style={{ width: '100%' }}
                options={searchContents}
                onSelect={(value, option) => onSelect(value, option)}
                onSearch={(value) => onSearchContentOrder(value)}
              >
                <Input placeholder="T??m ki???m theo n???i dung" allowClear></Input>
              </AutoComplete>
            </Col>

            <Col span={12} />

            {/* <Col span={6}>
              <Select
                value={pcreateUser}
                onChange={(value) => onChangeAccount(value)}
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
            </Col>

            <Col span={6}>
              <Select
                allowClear
                mode="multiple"
                value={pupdateBy}
                placeholder="Ch???n ng?????i t???o"
                // mode="tags"
                style={{ width: '100%' }}
                onChange={(value) => setPupdateBy(value)}
                // tokenSeparators={[',']}
              >
                {opDelegater.map((row) => (
                  <Option key={row.value}>{row.label}</Option>
                ))}
              </Select>
            </Col> */}

            <Col span={6}>
              <Space>
                <Button
                  className="custom-btn1 btn-outline-info"
                  icon={<SearchOutlined />}
                  title="T??m ki???m"
                  onClick={() => onSearchByParam()}
                >
                  T??m ki???m
                </Button>
                <Popconfirm
                  title="B???n ch???c ch???n mu???n x??a?"
                  onConfirm={() => onDeleteListChecBox()}
                  okText="?????ng ??"
                  cancelText="H???y b???"
                >
                  <Button className="custom-btn1 btn-outline-danger" icon={<DeleteOutlined />}>
                    X??a
                  </Button>
                </Popconfirm>

                <Button
                  className="custom-btn1 btn-outline-info"
                  icon={<PlusCircleOutlined />}
                  onClick={() => onViewCreate()}
                >
                  Th??m m???i
                </Button>
              </Space>
            </Col>
          </Row>
          <br />
          <Row gutter={8}>
            <Col span={24}>
              <Table
                size="small"
                rowSelection={rowSelection}
                dataSource={dataTables}
                columns={columnsAdd}
                bordered
                rowKey="stt"
                // pagination=  {
                //     total: 200
                // }
              />
            </Col>
          </Row>
        </Card>
      </Spin>
    </PageContainer>
  );
};
