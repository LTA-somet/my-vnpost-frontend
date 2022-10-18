import { formatInputNumber } from "@/core/contains";
import { formatCurrency } from "@/utils";
import { AutoComplete, Checkbox, Form, Input, InputNumber } from "antd";
import { FormInstance } from "antd/es/form";
import React, { useContext, useEffect, useRef, useState, InputRef } from "react";
import CustomUpload from '../CustomUpload';
import './style.css'

interface EditableRowProps {
    index: number;
}
const EditableContext = React.createContext<FormInstance<any> | null>(null);
export const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

// interface Item {
//     itemContentId: number,
//     nameVi: string,
//     quantity: number,
//     weight: number,
//     image: string,
// }

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: any;
    record: any;
    dataType: string,
    width?: number,
    handleSave: (record: any) => void;
    options: any[],
    pattern: any,
    max?: number,
    alwaysShowEdit?: boolean
}
export const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    dataType,
    options,
    width,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            setTimeout(function () {
                inputRef.current?.focus();
            }, 50);
        }
    }, [editing]);

    useEffect(() => {
        if (restProps?.alwaysShowEdit) {
            form.setFieldsValue({ [dataIndex]: record?.[dataIndex] });
        }
    }, []);

    const toggleEdit = () => {
        setEditing(!editing);
        if (!restProps.alwaysShowEdit) {
            form.setFieldsValue({ [dataIndex]: record[dataIndex] });
        }
    };

    const save = () => {
        form.validateFields().then(values => {
            toggleEdit();
            handleSave({ ...record, ...values });
        }).catch(e => {
            toggleEdit();
        });
    }

    let childNode = children;

    const onNextInput = (nextItem?: Element | null, self?: any, shiftKey?: boolean) => {
        if (nextItem) {
            const nextInputs = nextItem.getElementsByClassName('editable-cell-value-wrap');
            const nextInput = nextInputs && nextInputs[0];
            if (nextInput) {
                if (dataType !== 'checkbox') {
                    self?.click();
                } else {
                    setEditing(false)
                }
                nextInput?.click();
                // nextInput.focus();
                // self?.onfocusout();

            } else {
                // const parentNodeNextItem = nextItem?.parentElement?.nextElementSibling;
                // if (parentNodeNextItem) {
                //     onNextInput(parentNodeNextItem, self);
                // }
                const next2 = shiftKey ? nextItem.previousElementSibling : nextItem.nextElementSibling;
                if (next2) {
                    onNextInput(next2, self, shiftKey);
                } else {
                    const parentNodeNextItem = shiftKey ? nextItem?.parentElement?.previousElementSibling : nextItem?.parentElement?.nextElementSibling;
                    if (parentNodeNextItem) {
                        onNextInput(parentNodeNextItem, self, shiftKey);
                    }
                }
            }
        }
    }

    const onTab = (e: any) => {
        const self = document.activeElement;
        const item = self?.closest('.g-edit');
        if (e.shiftKey) {
            const prevItem = item?.previousElementSibling;
            onNextInput(prevItem, self, e.shiftKey);
        } else {
            const nextItem = item?.nextElementSibling;
            onNextInput(nextItem, self, e.shiftKey);
        }
    }

    const onKeyDown = (e: any) => {
        if (e.code === 'Tab' || e.code === 'Enter') {
            save();
            onTab(e);
        }
    }

    const onClickCheckbox = () => {
        save();
    }
    const onEnterCheckbox = (e: any) => {
        e.preventDefault();
        if (e.code === 'Enter') {
            form.setFieldsValue({ [dataIndex]: !record[dataIndex] });
            save();
        } else if (e.code === 'Tab') {
            onTab(e);
        }
    }

    const onSelectAutocomplete = (_: string, option?: any) => {
        // console.log('option', option);
        // onChange(option);
        handleSave({ ...record, ...option })
        // form.setFieldsValue({ ...option });
    }

    const handleFilterAutocomplete = (value: string, option?: any): boolean => {
        return option?.value?.toUpperCase().includes(value.toUpperCase());
    };

    const renderInput = () => {
        if (dataType === 'image') {
            return <CustomUpload maxImage={1} />
        }
        if (dataType === 'autocomplete') {
            return <AutoComplete
                ref={inputRef}
                options={options}
                onSelect={onSelectAutocomplete}
                filterOption={handleFilterAutocomplete}
                onBlur={save}
                // onPressEnter={save}
                onKeyDown={onKeyDown}
            />
        }
        if (dataType === 'number') {
            return <InputNumber style={{ width: '100%' }} ref={inputRef}
                min={0} max={1000000000}
                {...formatInputNumber}
                onBlur={save} onKeyDown={onKeyDown}
            />
        }
        if (dataType === 'checkbox') {
            return <Checkbox ref={inputRef} onClick={onClickCheckbox} onKeyDown={onEnterCheckbox} />
        }

        return <Input ref={inputRef} onBlur={save} onKeyDown={onKeyDown} type={dataType} style={{ width: '100%' }} />
    }

    const valuePropName = dataType === 'checkbox' ? { valuePropName: 'checked' } : {};
    const rules = [];
    if (restProps.pattern) {
        rules.push({ pattern: restProps.pattern, message: '' });
    }
    if (restProps.max) {
        rules.push({ max: restProps.max });
    }

    if (editable || restProps.alwaysShowEdit) {
        childNode = editing || restProps.alwaysShowEdit ? (
            <Form.Item
                style={{ margin: -5, padding: 0 }}
                name={dataIndex}
                className="g-form-edit"
                rules={rules}
                {...valuePropName}
            >
                {renderInput()}
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps} className={editable ? "g-edit" : ""}>{
        restProps.alwaysShowEdit ? <div className={`editable-cell-value-wrap ${editing ? 'g-focus' : ''}`} onMouseLeave={() => setEditing(false)} onClick={toggleEdit}>{childNode}</div> : childNode}</td>;
};
