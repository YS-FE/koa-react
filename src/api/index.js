import axios from 'axios';
import {baseURL} from './config';


/**
 * 服务端调用的接口进行数据预取,不需要代理
 * 获取top250电影
 * @param {Number} start 
 */
export const getTop = (start = 0) => {
  return axios.get(`http://api.douban.com/v2/movie/top250`, {
    params: {
      start: start
    }
  });
}

/**
 * 客户端 使用第三方接口获取数据，则需要配置代理
 * 最新热映电影
 */
export const getTheater = () => {
  return axios.get(`${baseURL}/in_theaters`);
}


/**
 * 搜索电影
 * @param {String} title 
 */
export const searchMovie = (title) => {
  return axios.get(`${baseURL}/search`, {
    params: {
      q: title
    }
  });
}