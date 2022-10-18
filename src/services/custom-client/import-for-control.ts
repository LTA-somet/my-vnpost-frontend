import axios from 'axios';

//Ghi file vao db
export class ImportForControl {
  public importExcel(fromData: FormData ) {
    return axios.post('/v1/collating/importPostageConfirmation', fromData, {
      withCredentials: false,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
  }
}

//Tải lên file
export class DisplayImportAxios {
  public importExcel(fromData: FormData) {
    return axios.post('/v1/collating/displayImport', fromData, {
      withCredentials: false,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
  }
}

//Check trùng dữ liệu
export class CheckDuplicateAxios {
  public checkDuplicate(fromData: FormData) {
    return axios.post('/v1/collating/checkImportError', fromData, {
      withCredentials: false,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
  }
}
