// 引入axios
import axios from "axios";
import { message } from 'antd'
// 默认地址
// const baseURL = "https://api.jon562.com/v1/";//喜猫线上地址
// const baseURL = "https://api.wm611.com/v1/"; //蓝鲸线上地址
// const baseURL = "https://api.dm722.com/v1/"; //大白鲨线上/地址

// const baseURL = "https://api.afei567.com/v1/";//胖虎地址
// const baseURL = "https://api.afei567.com/v1/";//胖虎地址

// const baseURL = 'http://192.168.1.59/v1/'  //磁力聚星本地
const baseURL = 'https://api.xy0312.com/v1/'  //磁力聚星IP
//post请求头的设置
axios.defaults.headers.post["Content-Type"] =
    "application/json;charset=UTF-8";
// 跨域
axios.defaults.crossDomain = true;

// 1.利用axios去创建一个axios实列

const request = axios.create({
    // 配置对象
    // 基础路径，发送请求的时候路径当中会出现API，不用手写
    baseURL,
    // 请求超时过60秒
    timeout: 60000,
});

// 请求拦截器：在发送请求之前，请求拦截器可以检测到，可以再请求发出去之前做一部分事情
request.interceptors.request.use(
    (config) => {
        const isToken = (config.headers || {}).isToken === false;
        const userToken = sessionStorage.getItem("token");
        if (userToken && !isToken) {
            // token请根据实际情况自行修改
            config.headers["token"] = userToken; //让每个请求携带自定义token
        }
        // config是一个配置对象，对象里面有一个属性很重要，headers请求头
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);
// 响应拦截器：包含两个函数（一个是成功的回调函数，一个是失败的回调函数）
request.interceptors.response.use(
    (res) => {
        // 成功回调的函数：服务器响应的数据回来
        const { code } = res.data;
        // const message=errorCode[code]||res.data.msg||errorCode['default']
        message.destroy()
        if (code === 403) {
            message.error('登录过期,请重新登录')
            // 去登录
            window.location.hash = "/"
        }
        return res.data;
    },
    (error) => {
        const { code, response } = error;
        const { status } = response || {}
        message.destroy()
        if (status === 403) {
            // 去登录
            message.error('登录过期,请重新登录')
            window.location.hash = "/"
        }
        // 捕捉错误
        if (code === "ERR_NETWORK") {
            message.error('服务器开小差了，请稍后重试');
            window.location.hash = "/"
        }
        return response?.data;
    }
);
// 对外暴露requests(axios二次封装)
export default request;
