import axios from 'axios';

export class ImportService {
  public importExcel(fromData: FormData) {
    return axios.post('/v1/OrderHdr/importOrderHdr', fromData, {
      withCredentials: false,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
  }

  public createLibrary(fromData: FormData) {
    return axios.post('/v1/LIBRARY_INFO/insert', fromData, {
      withCredentials: false,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
  }

  public updateLibrary(libraryInfoId: number, fromData: FormData) {
    //return axios.post(`/v1/LIBRARY_INFO/update/${fromData.li}`, fromData, {
    return axios.post(`/v1/LIBRARY_INFO/update/${libraryInfoId}`, fromData, {
      withCredentials: false,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
  }
}
