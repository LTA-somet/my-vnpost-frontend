// import React, { useEffect, useState } from 'react';
// import { Checkbox, Modal, Row } from 'antd';
// import { CheckboxValueType } from 'antd/lib/checkbox/Group';


// const plainOptions = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
// const options = [
//     { value: 'MONDAY', label: 'Thứ 2' },
//     { value: 'TUESDAY', label: 'Thứ 3' },
//     { value: 'WEDNESDAY', label: 'Thứ 4' },
//     { value: 'THURSDAY', label: 'Thứ 5' },
//     { value: 'FRIDAY', label: 'Thứ 6' },
//     { value: 'SATURDAY', label: 'Thứ 7' },
//     { value: 'SUNDAY', label: 'Chủ nhật' },

// ];

// const ListItemAccept: React.FC<Props> = (props: Props) => {
//     const [listDate, setListDate] = useState<any>([])

//     const onChange = (checkedValues: CheckboxValueType[]) => {
//         setListDate(checkedValues)
//     };

//     useEffect(() => {
//         if (props.visible && props.record) {
//             if (props.record === 'Hàng ngày') {
//                 setListDate(plainOptions)
//             } else {
//                 const lstDate: string[] = []
//                 props.record.split(',').forEach(e => {
//                     lstDate.push(options.find(o => o.value === e)!?.value)
//                 });
//                 setListDate(lstDate)
//             }
//         }
//     }, [props.visible])

//     return (
//         <Modal
//             title={<div style={{ fontSize: '16px', color: '#00549a' }}>Chọn ngày thu gom</div>}
//             visible={props.visible}
//             onCancel={() => props.setVisible(false)}
//             onOk={() => props.onChange(listDate)}
//             width={300}
//             destroyOnClose
//         >
//             <Row>
//                 <Checkbox.Group options={options} onChange={onChange} value={listDate} />
//             </Row>
//         </Modal>
//     );
// };

// type Props = {
//     visible: boolean,
//     setVisible: (visible: boolean) => void,
//     record?: string,
//     // onChange: (checkedValues: string[]) => void
// }
// export default ListItemAccept;