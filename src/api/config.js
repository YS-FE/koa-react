import axios from 'axios';

/**
 * 服务端渲染时，需要代理的接口, 服务器上需要设置对应的代理
 */
export const  baseURL = '/douban/v2/movie';

axios.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});