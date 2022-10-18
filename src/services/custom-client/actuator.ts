import axios from 'axios';

export class ActuatorApi {
  public health() {
    // return axios({
    //   url: '/actuator/health/',
    //   method: 'GET',
    // });
    return axios.get('/actuator/health/', {
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
