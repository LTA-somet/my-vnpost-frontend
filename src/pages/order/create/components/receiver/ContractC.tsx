import React, { useState, useEffect } from 'react';

import {
  Button,
  notification,
  Spin,
  Table,
  Row,
  Col,
  Modal,
} from 'antd';
import { Input } from 'antd';
import './ContractC.css';
import { ContactDto, ContractApi, ContractDto } from '@/services/client';
import { resultDataToListContract } from '@/utils/orderHelper';
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';

type Props = {
  contractNumberInit?: string,
  getData: (data: ContactDto) => void,
  visible: boolean,
  setVisible: (visible: boolean) => void,
  contractList: ContactDto[]
}
const contractApi = new ContractApi();
const ContractC: React.FC<Props> = (props: Props) => {
  const [dataTables, setDataTable] = useState<ContractDto[]>([]);
  const [contractNumber, setContractNumber] = useState<string>();
  const [cppaNumber, setCppaNumber] = useState<string>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  useEffect(() => {
    setContractNumber(props.contractNumberInit);
  }, [props.contractNumberInit]);

  useEffect(() => {
    setDataTable(props.contractList);
  }, [props.contractList]);

  const onSearch = () => {
    if (!contractNumber && !cppaNumber) {
      notification.info({
        message: 'Chưa nhập mã hợp đồng hoặc số CPPA',
      });
      return;
    }
    contractApi.findReceiverContract(contractNumber || '', cppaNumber || '').then((resp) => {
      if (resp.status === 200) {
        const data = resultDataToListContract(resp.data, true, contractNumber);
        setDataTable(data);
      }
    });
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
    },
    {
      title: 'Số hợp đồng',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
    },
  ];

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    type: 'radio'
  };

  const onChooseRow = (record, rowIndex) => {
    console.log('rowIndex', rowIndex);
  };
  const onAddRow = () => {
    if (selectedRowKeys.length === 0) {
      return;
    }
    const selected = dataTables.find(d => d.id === selectedRowKeys[0]);
    if (selected) {
      props.getData(selected);
      props.setVisible(false);
    }
  };

  return (
    <Modal
      title={'Tìm kiếm hợp đồng C'}
      visible={props.visible}
      onCancel={() => props.setVisible(false)}
      width={1000}
      destroyOnClose
      footer={false}
    >
      <Spin spinning={false}>
        {/* <Card className="fadeInRight"> */}
        <table style={{ width: "100%" }}>
          <tr>
            <td>
              <Input
                placeholder="Nhập số hợp đồng"
                defaultValue={contractNumber}
                allowClear
                onChange={(e) => setContractNumber(e.target.value)}
              />
            </td>
            <td>
              <Input placeholder="Nhập số C/PPA" allowClear onChange={(e: any) => setCppaNumber(e.target.value)} />
            </td>
            <td style={{ width: "5%" }}>
              <Button className='btn-outline-info' icon={<SearchOutlined style={{ marginLeft: "15%" }} />} onClick={onSearch}> </Button>
            </td>
          </tr>
        </table>
        <br />
        <Table
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                onChooseRow(record, rowIndex);
              }, // click row
            };
          }}
          rowSelection={rowSelection}
          dataSource={dataTables}
          columns={columns}
          bordered
          rowKey="id"
          size='small'
        />
        <br />
        <Row>
          <Col span={24} className="button-below-table">
            <Button
              className='btn-outline-success'
              icon={<CheckCircleOutlined />}
              style={{ width: 120, marginLeft: 30 }}
              type="primary"
              onClick={() => onAddRow()}
            >
              Đồng ý
            </Button>
            {/* <Button
                style={{ width: 120, marginLeft: 30 }}
                type="primary"
                onClick={() => props.setVisible(false)}
              >
                Đóng
              </Button> */}
          </Col>
        </Row>
        {/* </Card> */}
      </Spin>
    </Modal >
  );
}

export default ContractC;
