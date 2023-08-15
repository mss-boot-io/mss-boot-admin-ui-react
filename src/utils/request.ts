import axios from 'axios'
import { Message, Modal } from '@arco-design/web-react';

// create an axios instance
const api = axios.create({
  // baseURL: import.meta.env.VITE_APP_API_BASE_URL ? import.meta.env.VITE_APP_API_BASE_URL as string : '',
  baseURL: 'http://localhost:8080/admin',
  // withCredentials: true, // send cookies when cross-domain requests
  // baseURL: '',
  timeout: 50000 // request timeout
})

// request interceptor
api.interceptors.request.use(
  config => {
    // do something before request is sent
    //todo set access token
    if (localStorage.getItem('token')) {
      config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token') // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
api.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // console.log('response:' + JSON.stringify(response))
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code > 399) {
      // console.log('response111111:' + JSON.stringify(response))
    //   Message.error(res.detail || 'Error');
        switch (res.code) {
        case 401:
          // todo re-login
					Modal.confirm({
						title: 'Re-Login',
						content: 'You have been logged out, you can cancel to stay on this page, or log in again',
						okButtonProps: {
							status: 'danger',
						},
						onOk: () => {
							//todo clean accessToken
              console.log('clean accessToken')
						},
					});
          break;
        case 422:
          Message.error(res.detail ? '输入信息有误:' + res.detail : '输入信息有误');
          break;
        default:
          Message.error(res.detail || 'Error');
          break;
        }
      return Promise.reject(new Error(res.detail || 'Error'))
    } else {
      return response
    }
  },
  error => {
    // console.log('err' + JSON.stringify(error)) // for debug
    const response = error.response
    const { data } = response
    //todo
		Message.error(data.msg || 'Error');
    return Promise.reject(error)
  }
)

export default api