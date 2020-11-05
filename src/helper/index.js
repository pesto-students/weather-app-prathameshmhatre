import axios from 'axios';
import qs from 'querystring';

const apiCall = (url = '', method = 'get', data = {}) => {
  return new Promise((resolve, reject) => {
    const config = {
      method,
      url: method === 'get' ? `${url}?${qs.stringify(data)}` : `${url}`,
      data: qs.stringify(data),
    };
    axios(config)
      .then((res) => {
        const result = res.data;
        resolve(result);
      })
      .catch((e) => {
        if (e.response.status) {
          localStorage.clear();
        }
        reject(e);
      });
  });
};

export default apiCall;
