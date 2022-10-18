import { FormInstance, Input } from 'antd';
import { Button, Col, Form, Row, Spin, Table } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import defineColumns from './columns';
import Address from '../Address';
import { SearchOutlined } from '@ant-design/icons';
import Address2 from '../Address/Address';

const ServicePostOffice = (props: Props) => {
    const { dataSource, isLoading, searchByParamBcPv } = useModel('servicePostOfficeList');
    const [form] = Form.useForm();

    // useEffect(() => {
    //     reload();
    // }, [])

    useEffect(() => {
        form.setFieldsValue({
            provinceCode: props.form.getFieldValue('provinceCode'),
            districtCode: props.form.getFieldValue('districtCode'),
            communeCode: props.form.getFieldValue('communeCode')
        })
    }, [])

    const onSearchByParam = (values: any) => {
        const param = {
            "provinceCode": values.provinceCode,
            "districtCode": values.districtCode,
            "communeCode": values.communeCode,
            "postCode": values.postCode
        }
        searchByParamBcPv(param);
    };

    const selectRow = (record: any) => {
        props.form.setFieldsValue({
            orgCodeAccept: record.unitCode,
        });
        props.setPostOffice([{ postCode: record.unitCode, name: 'Bưu cục ' + record.unitName }])
        props.setIsModalVisible(false);
    }

    const columns: any[] = defineColumns();
    return (

        <Spin spinning={isLoading} >
            <Form
                name="form-service-postoffice"
                onFinish={onSearchByParam}
                form={form}
            >
                <Row gutter={8} className='config-height'>
                    <Col span={6}>
                        <Form.Item
                            name={'postCode'}
                            label={'Mã bưu cục'}
                        >
                            <Input maxLength={50} />
                        </Form.Item>
                    </Col>
                    <Col span={18}>
                        <Address2
                            form={form}
                            provinceName="Tỉnh/Thành phố"
                            districtName="Quận/Huyện"
                            communeName="Phường/Xã"
                            provinceField="provinceCode"
                            districtField="districtCode"
                            communeField="communeCode"
                        />
                    </Col>
                </Row>
                <Col style={{ textAlign: 'center' }}>
                    <Button icon={<SearchOutlined />} htmlType='submit' className='custom-btn1 btn-outline-info' >Tìm kiếm</Button>
                </Col>

                <p />
                <Table
                    size='small'
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    onRow={(record) => ({
                        onClick: () => {
                            selectRow(record);
                        },
                    })}
                />
            </Form>

        </Spin>

    );
};
type Props = {
    form: FormInstance<any>,
    visible: boolean,
    setIsModalVisible: any,
    setPostOffice: any
}

export default ServicePostOffice;