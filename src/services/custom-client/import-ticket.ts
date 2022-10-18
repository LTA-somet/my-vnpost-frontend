import axios from 'axios';

export class ImportTicket {
  public importExcel(fromData: FormData) {
    return axios.post('/v1/ticket/createTicket', fromData, {
      withCredentials: false,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
  }
}
