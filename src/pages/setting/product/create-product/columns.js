import UploadAndDisplayImage from './UploadAndDisplayImage';
import { Checkbox, Button } from 'antd';

const imageViewer = (props) => {
  if (props.value) {
    return <img alt="not fount" width={'50px'} src={props.value} />;
  }
  return <imageEditor></imageEditor>;
};
const imageEditor = (props) => {
  console.log('props', props);
  return (
    <UploadAndDisplayImage image={props.value} upLoadImage={props.onCommit}></UploadAndDisplayImage>
  );
};

const onCheckedRow = (props) => {
  props.onCommit = !props.checked;
};

const checkboxViewer = (props) => {
  return <Checkbox checked={props.checked}></Checkbox>;
};

export const Columns = [
  // { label: '', width: 160, fieldName: 'type', dataType: 'text', valueViewer: checkboxViewer, editorTag: checkboxViewer },
  // { label: '', width: 20, fieldName: 'type', dataType: 'text' },
  { label: 'Tên hàng hóa', width: 160, fieldName: 'nameVi', dataType: 'text' },
  // { label: 'Mã', width: 160, fieldName: 'productId', dataType: 'number' },
  {
    label: 'Khối lượng (gram)',
    width: 160,
    fieldName: 'weight',
    dataType: 'number',
    displayField: false,
  },
  { label: 'Giá trị(VND)', width: 160, fieldName: 'priceVnd', dataType: 'number' },
  { label: 'Dài (cm)', width: 160, fieldName: 'length', dataType: 'number' },
  { label: 'Rộng (cm)', width: 160, fieldName: 'width', dataType: 'number' },
  { label: 'Cao (cm)', width: 160, fieldName: 'height', dataType: 'number' },
];

export const ColumnWith = [
  { label: 'Tên hàng hóa tiếng Anh', width: 160, fieldName: 'nameEn', dataType: 'text' },
  { label: 'HS code', width: 160, fieldName: 'hsCode', dataType: 'text' },
  { label: 'Đơn vị tính', width: 160, fieldName: 'unit', dataType: 'text' },
  { label: 'Xuất xứ', width: 160, fieldName: '', dataType: 'text' },
  { label: 'Hình thức xuất khẩu', width: 160, fieldName: 'exportType', dataType: 'text' },
];

export const KeyObject = [
  'nameVi',
  'nameVi',
  'productId',
  'weight',
  'priceVnd',
  'length',
  'width',
  'height',
  'image',
];
