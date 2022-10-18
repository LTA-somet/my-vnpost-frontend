export const ACCESS_TOKEN_KEY = 'accessToken';
export const ACCOUNT_INFO = 'accountInfo';

export const loginPath = '/auth/login';
export const publicPath = '/auth';

export const fullDateFormat = 'DD/MM/YYYY HH:mm:ss';
export const shortDateFormat = 'DD/MM/YYYY';

export const regexCode = new RegExp('^[A-Za-z0-9_\\-.,]+$');
export const regexPostalCode = new RegExp('([A-Za-z0-9]{6,})+$');
export const regexPhone = new RegExp('^[0-9\\+]+$');
export const regexPhoneIntl = new RegExp('^[0-9]+$');
export const regexUrl = new RegExp(
  // '[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)',
  '^(http|https)://',
);

export const APPCODE = 'MYVNP';
export const MCAS_GROUP_STATUS_ACTIVE = 1;
export const MCAS_GROUP_STATUS_DEACTIVE = -9;

//Mật khẩu phải ít nhất 6 ký tự, bao gồm ký tự hoa, thường, ký tự số
export const regexPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})');
export const pattenPassword = {
  pattern: regexPassword,
  message: 'Mật khẩu phải ít nhất 6 ký tự, bao gồm ký tự hoa, thường, ký tự số',
};

// export const formatInputNumber = {
//   formatter: (vf: any) => `${vf}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
//   parser: (p: any) => p?.replace(/\$\s?|(,*)/g, ''),
//   precision: 0,
// };
export const formatInputNumber = {
  formatter: (vf: any) => `${vf}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
  parser: (p: any) => p?.replace(/\$\s?|(\.*)/g, ''),
  precision: 0,
  decimalSeparator: '.',
};

export const reCaptchaKey = '6Lfc9u0eAAAAAHiHURVA4macTMiKLlkXAx2xqML_';

// export const patternPhone = {
//   pattern: regexPhone,
//   message: 'Số điện thoại không đúng định dạng',
// };

export const patternPhone = {
  validator: async (_, value: string) => {
    if (value) {
      if (!regexPhone.test(value)) {
        return Promise.reject(new Error('Số điện thoại không đúng định dạng'));
      }

      if (value.startsWith('0') && [10, 11].includes(value.length)) {
        return Promise.resolve();
      }

      if (value.startsWith('84') && [10, 11, 12].includes(value.length)) {
        return Promise.resolve();
      }

      if (value.startsWith('+84') && [11, 12, 13].includes(value.length)) {
        return Promise.resolve();
      }

      if (!value.startsWith('0') && [8, 9, 10].includes(value.length)) {
        return Promise.resolve();
      }

      return Promise.reject(new Error('Số điện thoại không đúng định dạng'));
    }
    return Promise.resolve();
  },
};

export const patternPhoneIntl = {
  validator: async (_, value: string) => {
    if (value) {
      if (!regexPhoneIntl.test(value)) {
        return Promise.reject(new Error('Số điện thoại không đúng định dạng'));
      }
      // return Promise.reject(new Error('Số điện thoại không đúng định dạng'));
    }
    return Promise.resolve();
  },
};

// validate tiếng việt và 1 dấu cách giữa 2 chữ
export const regexName = new RegExp(
  "^([aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9_\\-'.]+ ?)*$",
);

const typeTemplate = '${label} không hợp lệ';
export const validateMessages = {
  default: 'Validation error on field ${label}',
  required: '${label} là bắt buộc',
  enum: '${label} phải là một trong số [${enum}]',
  whitespace: '${label} không được rỗng',
  date: {
    format: '${label} định dạng không hợp lệ',
    parse: '${label} could not be parsed as date',
    invalid: '${label} là ngày không hợp lệ',
  },
  types: {
    string: typeTemplate,
    method: typeTemplate,
    array: typeTemplate,
    object: typeTemplate,
    number: typeTemplate,
    date: typeTemplate,
    boolean: typeTemplate,
    integer: typeTemplate,
    float: typeTemplate,
    regexp: typeTemplate,
    email: typeTemplate,
    url: typeTemplate,
    hex: typeTemplate,
  },
  string: {
    len: '${label} phải có chính xác ${len} ký tự',
    min: '${label} phải có ít nhất ${min} ký tự',
    max: '${label} không được lớn hơn ${max} ký tự',
    range: '${label} phải có từ ${min} đến ${max} ký tự',
  },
  number: {
    len: '${label} phải bằng ${len}',
    min: '${label} không thể nhỏ hơn ${min}',
    max: '${label} không thể lớn hơn ${max}',
    range: '${label} phải có giá trị từ ${min} đến ${max}',
  },
  array: {
    len: '${label} phải có độ dài là ${len}',
    min: '${label} độ dài không được nhỏ hơn ${min}',
    max: '${label} độ dài không được lớn hơn ${max}',
    range: '${label} độ dài phải nằm trong khoảng ${min} đến ${max}',
  },
  pattern: {
    mismatch: '${label} định dạng không hợp lệ',
  },
};
