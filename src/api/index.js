// 引入requests
import request from "./request.js";
// import requestYang from "./requestYang.js";
// get
export function getData(url,query) {
    return request({
        url, //路径
        method: "get",
        params: query, //参数
    });
}
// post
export function postData(url,data) {
    return request({
        url, //路径
        method: "post",
        data: data, //参数
    });
}