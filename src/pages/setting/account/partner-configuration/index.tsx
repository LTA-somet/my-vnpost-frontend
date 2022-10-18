import { validateMessages } from '@/core/contains';
import { ConfigPartnerApi, ConfigPartnerDto, PartnerCategoryDto } from '@/services/client';
import { ReloadOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Col, Form, FormInstance, Row, Spin, Button, Space, Checkbox, Divider, Input } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';

const PartnerConfiguration = () => {
    const { partnerCategoryList, configPartnerList, getDataByUserAndOrg, getAllByConfigWebhook, isLoading, isSaving, updateRecord } = useModel('configPartnerList');
    const [form] = Form.useForm();
    const formRef = useRef<FormInstance>(null);
    const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);

    // const [indeterminate, setIndeterminate] = useState(true);
    // const [checkAll, setCheckAll] = useState(false);

    const [searchValue, setSearchValue] = useState<string>();
    const [optionList, setOptionList] = useState<PartnerCategoryDto[]>([]);

    useEffect(() => {
        getAllByConfigWebhook(); //get danh muc
        getDataByUserAndOrg((status: boolean, lstData: any) => {
            if (lstData != null) {
                const codes = lstData.map(function (item: any) {
                    return item.partnerCode;
                });
                setCheckedList(codes);
            }
        })
    }, []);

    const setFillData = () => {
        if (!searchValue) {
            setOptionList(partnerCategoryList);
        } else {
            setOptionList(partnerCategoryList.filter(e => e.partnerName?.includes(searchValue)));
        }
    }

    useEffect(() => {
        setFillData();
    }, [partnerCategoryList, searchValue]);

    const onChange = (checkedValues: CheckboxValueType[]) => {
        setCheckedList(checkedValues);
    };

    const onFinish = (values: any) => {
        if (checkedList) {
            const strList = checkedList.join(',');
            const record = {
                partnerCode: strList
            }
            updateRecord(record);
        }
    };

    return (
        <div>
            <Spin spinning={isLoading}>
                <Card className="fadeInRight" bordered={false}>
                    <Row>
                        <Col span={10} >
                            <Input.Search
                                placeholder="Nhập tên đối tác"
                                // enterButton="Xác nhận"
                                allowClear
                                enterButton={<SearchOutlined />}
                                onSearch={(value) => setSearchValue(value)}
                                width={250}
                            />
                        </Col>
                    </Row>
                    <br />
                    <Form
                        name="form-partner-configuration"
                        labelCol={{ flex: '120px' }}
                        labelAlign="left"
                        labelWrap
                        colon={false}
                        ref={formRef}
                        onFinish={onFinish}
                        form={form}
                        validateMessages={validateMessages}
                    >
                        <Checkbox.Group value={checkedList} style={{ width: '100%' }} onChange={onChange}>
                            <Row>
                                {
                                    optionList.map((item: any) => {
                                        return (
                                            <Col span={6} key={item.partnerCode}>
                                                <Checkbox value={item.partnerCode}>{item.partnerName}</Checkbox>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </Checkbox.Group>
                        <Divider />
                        <Row >
                            <Col flex="auto" style={{ textAlign: 'center' }}>
                                <Button loading={isSaving} className='custom-btn4 btn-outline-success' icon={<SaveOutlined />} htmlType="submit" form="form-partner-configuration" size="large" >
                                    Lưu cấu hình
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Spin>
        </div >
    );

};

export default PartnerConfiguration;