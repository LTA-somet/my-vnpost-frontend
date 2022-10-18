export const regexPhone = new RegExp('^[0-9\\+]+$');
export const formatStart84 = (phoneNumber?: string) => {
  if (!phoneNumber) return '';

  const retVal = phoneNumber.trim();
  if (phoneNumber.startsWith('84')) {
    return retVal.replace('84', '+84');
  } else if (phoneNumber.startsWith('0')) {
    return retVal.replace('0', '+84');
  } else if (phoneNumber.startsWith('+')) {
    // giữ nguyên
    return retVal;
  } else {
    // trường hợp đầu k phải 84, +84, 0
    return '+84' + retVal;
  }
};

export const formatNoStart = (phoneNumber?: string) => {
  if (!phoneNumber) return '';

  const retVal = phoneNumber.trim();
  if (phoneNumber.startsWith('+84')) {
    return retVal.replace('+84', '');
  } else if (phoneNumber.startsWith('0')) {
    return retVal.replace('0', '');
  } else if (phoneNumber.startsWith('84')) {
    return retVal.replace('84', '');
  } else {
    return retVal;
  }
};

export const formatStart0 = (phoneNumber?: string) => {
  if (!phoneNumber) return '';

  const retVal = phoneNumber.trim();
  if (phoneNumber.startsWith('+84')) {
    return retVal.replace('+84', '0');
  } else if (phoneNumber.startsWith('84')) {
    return retVal.replace('84', '0');
  } else {
    return retVal;
  }
};

export const equalsPhoneNumber = (phoneNumber1?: string, phoneNumber2?: string): boolean => {
  return formatStart84(phoneNumber1) === formatStart84(phoneNumber2);
};

export const checkPhone = (phoneNumber: string) => {
  if (!regexPhone.test(phoneNumber)) {
    return 'Số điện thoại không đúng định dạng';
  }

  if (phoneNumber.startsWith('0') && [10, 11].includes(phoneNumber.length)) {
    return null;
  }

  if (phoneNumber.startsWith('84') && [10, 11, 12].includes(phoneNumber.length)) {
    return null;
  }

  if (phoneNumber.startsWith('+84') && [11, 12, 13].includes(phoneNumber.length)) {
    return null;
  }

  if (!phoneNumber.startsWith('0') && [8, 9, 10].includes(phoneNumber.length)) {
    return null;
  }
  return 'Số điện thoại không đúng định dạng';
};
