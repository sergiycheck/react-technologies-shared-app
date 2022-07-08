import axios from 'axios';

export default function config() {
  axios.interceptors.request.use(
    function (config) {
      // Do something before request is sent

      config.withCredentials = true;
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    },
  );
}
