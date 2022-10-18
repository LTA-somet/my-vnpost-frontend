import { OrderImageDto } from '@/services/client';
import { deleteFromDataSource } from '@/utils/dataUtil';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Image, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import './style.css';

type Props = {
    value?: OrderImageDto[],
    onChange?: (value: OrderImageDto[]) => void;
    maxImage: number
    uploadCaseTypeId?: number
}

type FileListType = {
    uid?: number,
    url?: string
}
// nhận vào list base 64 và trả ra list base64
const CustomUpload: React.FC<Props> = (props: Props) => {
    const [fileList, setFileList] = useState<FileListType[]>([]);
    const [count, setCount] = useState<number>(-1);

    useEffect(() => {
        if (props.value!.length > 0) {
            const newFileList = props.value!.map((v, i) => ({
                uid: v.orderImageId,
                name: '',
                status: 'done',
                url: v.dataImg
            }));
            setFileList(newFileList);
            setCount(-1 * newFileList.length - 1);
        } else {
            setFileList([]);
        }
    }, [props.value?.length]);

    // useEffect(() => {
    //     console.log('a', props.value?.length, fileList.length);

    //     if (props.value?.length !== fileList.length) {
    //         const newValue: OrderImageDto[] = fileList.map(f => ({
    //             orderImgId: f.uid,
    //             dataImg: f.url
    //         }));
    //         props.onChange?.(newValue);
    //     }
    // }, [fileList]);

    const triggerChange = (newFileList: FileListType[]) => {
        const newValue: OrderImageDto[] = newFileList.map(f => ({
            orderImgId: f.uid,
            dataImg: f.url
        }));
        props.onChange?.(newValue);
    }

    const toBase64 = (file: any) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const uploadButton = (
        <div style={{ width: 24, height: 24, textAlign: 'center', cursor: 'pointer', border: '1px dashed #eeeeee' }}>
            <PlusOutlined />
            {/* <div style={{ marginTop: 4 }}>Upload</div> */}
        </div>
    );

    const beforeUpload = async (f: any) => {
        const newFileBase64 = await toBase64(f);
        // const newValue = [...props.value!];
        const base64 = typeof newFileBase64 === 'string' ? newFileBase64 : undefined;
        if (base64) {
            const newFileList = [...fileList, { uid: count, url: base64 }];
            setFileList(newFileList)
            triggerChange(newFileList);
            setCount(count - 1);
            // newValue.push({ orderImgId: -1, dataImg: base64 });
            // props.onChange?.(newValue)
        }
        return false;
    }

    const onRemove = (f: FileListType) => {
        const newFileList = deleteFromDataSource(fileList, f.uid, 'uid');
        setFileList(newFileList);
        triggerChange(newFileList);
    }

    const renderImage = (f: FileListType) => {
        return <span className="container">
            <Image width={60} src={f.url} preview={false} />
            <span className="middle">
                <Button onClick={() => onRemove(f)} className="text" icon={<DeleteOutlined />} />
            </span>
        </span>
    }

    return (
        <>
            <Image.PreviewGroup>
                {fileList.map(f => renderImage(f))}
            </Image.PreviewGroup>
            {fileList.length < props.maxImage &&
                <Upload
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                    disabled={props.uploadCaseTypeId === 4 || props.uploadCaseTypeId === 5 || props.uploadCaseTypeId === 6 || props.uploadCaseTypeId === 7}
                >
                    {fileList.length < props.maxImage && uploadButton}
                </Upload>
            }
        </>
    );
};

CustomUpload.defaultProps = { value: [], maxImage: 5 }
export default React.memo(CustomUpload);