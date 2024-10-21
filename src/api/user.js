import { getData, postData } from "./index";

//获取用户信息
export const getUser = (data) => {
  return postData("Userinfo", data);
};

//获取用户列表page第几页,limit一页多少条
export const getUserList = (data) => {
  return postData("OuUserGet", data);
};

//重置用户密码
export const setPasswod = (data) => {
  return postData("UsertableUp", data);
};
//禁用，启用用户
export const setInterdict = (data) => {
  return postData("UsertableUp", data);
};

//修改余额
export const addBalance = (data) => {
  return postData("add/balance", data);
};

// 获取用户价格管理列表
export const getUserPriceList = (data) => {
  return getData("user/price", data);
};

//删除用户套餐价格
export const getDelPrice = (data) => {
  return getData("del/price", data);
};

//获取用户列表，无分页
export const getUserAll = (data) => {
  return getData("user/all", data);
};

//添加用户套餐价格
export const getAddPrice = (data) => {
  return postData("add/price", data);
};

//修改密码
export const postUpdatePwd = (data) => {
  return postData("UserUp", data);
};

//设置代理 set/income
export const setIncome = (data) => {
  return postData("set/income", data);
};
//获取设备信息
export const facility = (data) => {
  return getData("get/user/list", data);
};

//获取账号状态数据
export const getaccounttable = (data) => {
  return getData("get/order/detail", data);
};
