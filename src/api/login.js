import { postData } from "./index";

//登录
export const login = (data) => {
  return postData("login", data);
};

//注册
export const register = (data) => {
  return postData("register", data);
};
//发送用户设备信息
export const transmitting = (data) => { return postData('add/user/ip', data) }