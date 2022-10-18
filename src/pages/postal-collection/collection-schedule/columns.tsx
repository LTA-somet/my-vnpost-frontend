import { useCategoryAppParamList } from "@/core/selectors";
import type { CollectionOrderDto, CollectionScheduleDto } from "@/services/client";
import { formatStart0 } from "@/utils/PhoneUtil";
import moment from "moment";

const options = [
  { value: 'MONDAY', label: 'Thứ 2' },
  { value: 'TUESDAY', label: 'Thứ 3' },
  { value: 'WEDNESDAY', label: 'Thứ 4' },
  { value: 'THURSDAY', label: 'Thứ 5' },
  { value: 'FRIDAY', label: 'Thứ 6' },
  { value: 'SATURDAY', label: 'Thứ 7' },
  { value: 'SUNDAY', label: 'Chủ nhật' },

];

export default (action: (id: any, record: any) => React.ReactNode) => {
  const columns: any[] = [
    {
      title: 'STT',
      key: 'index',
      align: 'center',
      width: '60px',
      render: (text: any, record: any[], index: any) => index + 1,
    },
    {
      title: 'Người gửi',
      dataIndex: 'senderName',
      key: 'senderName',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'collectPhone',
      key: 'phone',
      render: (senderPhone: string) => formatStart0(senderPhone)
    },
    {
      title: 'Lịch thu gom',
      dataIndex: 'collectCalendars',
      key: 'collectCalendars',
      render: (collectCalendars: any[]) =>
        collectCalendars.map((e: any) =>
          <div>{options.filter(o => e.collectDate.includes(o.value)).map(o => o.label).toString() + ' (' + e.collectTime + ')'}</div>
        )
    },
    {
      title: 'Hành động',
      dataIndex: 'scheduleId',
      align: 'center',
      width: '80px',
      key: 'scheduleId',
      render: (scheduleId: any, record: any) => action(scheduleId, record),

    }
  ]
  return columns;
}
