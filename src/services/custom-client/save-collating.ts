import axios from 'axios';

export class ExportExcel {
    public exportExcel(id: string) {
      return axios({
        url: '/v1/collating/exportExcelDtlCollating?idCollating=' + id,
        method: 'GET',
        responseType: 'blob', // important
    });
    }
  }
