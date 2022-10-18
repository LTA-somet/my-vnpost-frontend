import { Select } from 'antd';
import { notification } from 'antd';
export const dataToSelectBox = (data: any[] = [], key: string = 'id', name: string | string[] = 'name') => {
    const renderName = (record: any) => {
        if (typeof name === 'string') {
            return record[name];
        } else {
            if (name.length <= 1) {
                return record[name?.[0]]
            }
            return name.map(n => record[n]).join(' - ');
            // return name.reduce((total, currentValue) => total + ' - ' + record[currentValue], '');
        }
    }

    return data.map(record => <Select.Option key={record[key]} value={record[key]}>{renderName(record)}</Select.Option>);
}
export const isNullOrEmpty = (value: any) => {
    return value ? value.length === 0 : true;
}

export const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

export const printFile = (base64: string, contentType: string = 'application/pdf') => {
    const blob = b64toBlob(base64, contentType);
    const blobURL = window.URL.createObjectURL(blob);
    const theWindow = window.open(blobURL);
    if (!theWindow) {
        alert('Có thể trình duyệt của bạn đang chặn mở cửa sổ mới, vui lòng bật và thử lại!')
    }
    const theDoc = theWindow!.document;
    const theScript = document.createElement("script");
    function injectThis() {
        window.print();
    }
    theScript.innerHTML = `window.onload = ${injectThis.toString()};`;
    theDoc.body.appendChild(theScript);

}

export const downloadFile = (base64: string, fileName: string, contentType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8') => {
    const blob = b64toBlob(base64, contentType);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

export const downloadAllFile = (base64: string, fileType: string, fileName: string) => {
    const blob = b64toBlob(base64, fileType + ';charset=utf-8');
    //const blob = b64toBlob(base64, 'application/vnd.ms-word;charset=utf-8')

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

export const dataToTree = (data: any[], codeField: string, parentField: string, titleField: string = 'name', parentCode: string = ''): any[] => {
    const level: any[] = data.filter(d => (d[parentField] ?? '') === parentCode);
    level.map(d => {
        d.key = d[codeField];
        d.value = d[codeField];
        d.title = d[titleField];
        const children = dataToTree(data, codeField, parentField, titleField, d[codeField]);
        if (children.length > 0) {
            d.children = children;
        } else {
            d.children = undefined
        }
    });
    return level;
}

/**
 * format number to zero number: example zeroPad(5, 4) = "0005"
 * @param num 
 * @param places 
 * @returns 
 */
export const zeroPad = (num: number, places: number) => {
    const zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}


export const formatCurrency = (currency?: number): string => {
    if (!currency && currency !== 0) return '';
    return currency.toLocaleString('vi-VN')
}

//format về tiếng việt không dấu
export const removeAccents = (str: any) => {
    if (str) {
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }
}


// format về tên viết hoa chữ cái đầu
export const capitalizeName = (name: string): string => {
    if (!name) return name;
    return name.toLowerCase().replace(/(?:^|\s|['`‘’.-])[^\x00-\x60^\x7B-\xDF](?!(\s|$))/g, s => s.toUpperCase());
}


export const searchText = (title: string, searchvalue: string) => {
    console.log('title ', title, 'searchvalue', searchvalue, ' tile', title)
    if (searchvalue.indexOf('%') === 0 && searchvalue.lastIndexOf('%') + 1 === searchvalue.length) {
        return title.includes(searchvalue.replaceAll('%', '').toLowerCase())
    }
    else if (searchvalue.indexOf('%') === 0 && searchvalue.lastIndexOf('%') === 0) {
        return title.toLowerCase().endsWith(searchvalue.replace('%', '').toLowerCase())
    }
    else if (searchvalue.indexOf('%') === searchvalue.length - 1 && searchvalue.lastIndexOf('%') + 1 === searchvalue.length) {
        return title.toLowerCase().startsWith(searchvalue.replace('%', '').toLowerCase())
    }
    else {
        const index = title.indexOf("_")
        const Code = title.substring(0, index);
        const name = title.substring(index + 1).trim();
        //console.log('CODE', Code, 'NAME', name, 'Title' , title)
        return Code.toLowerCase() === searchvalue.toLowerCase() || name.toLowerCase() === searchvalue.toLowerCase()
    }
}

//Thông báo lỗi
export function alertNotifyNotification(values: any) {
    switch (values.type) {
        case "error":
            notification.error({
                message: values.mess,
            });
            break;
        case "info":
            notification.info({
                message: values.mess,
            });
            break;
        case "warning":
            notification.warning({
                message: values.mess,
            });
            break;
        case "success":
            notification.success({
                message: values.mess,
            });
            break;
        default:
            break;
    }
    // if (values.id) {
    //     const focusId = document.getElementById(values.id);
    //     if (!focusId) {
    //         focusId.focus();
    //     }
    // }
}


export const formatNumber = (num?: number | string): string => {
    return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
export const vniToEng = (text: string) => {
    let str = text ?? '';
    // xóa dấu
    str = str
        .normalize('NFD') // chuyển chuỗi sang unicode tổ hợp
        .replace(/[\u0300-\u036f]/g, ''); // xóa các ký tự dấu sau khi tách tổ hợp

    // Thay ký tự đĐ
    str = str.replace(/[đĐ]/g, 'd');

    // Xóa ký tự đặc biệt
    str = str.replace(/([^0-9a-z-\s])/g, '');

    // xóa phần dư - ở đầu & cuối
    str = str.replace(/^-+|-+$/g, '');

    // return
    return str;
}

export const equalsText = (fullText: string, searchElement: string) => {
    return vniToEng(fullText?.toLowerCase()).includes(vniToEng(searchElement?.toLowerCase()));
}