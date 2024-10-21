import { getData, postData } from "./index";

//获取统计列表
export const getCount = (data) => {
  return getData("num/times", data);
};

//获取销售列表
export const salesStatistics = (data) => {
  return getData("get/user/detail", data);
};

//获取支付列表
export const payprice = (data) => {
  return postData("SymoneyGet", data);
};
//修改支付状态
export const setpayprice = (data) => {
  return postData("SymoneyUpdate", data);
};
//添加支付方式
export const addpayprice = (data) => {
  return postData("SymoneyAdd", data);
};

//查询扫码次数
export const getOutjsm = (data) => {
  return postData("Outjsm", data);
};
//所有销售渠道总金额
export const getOutjpay = (data) => {
  return postData("Outjpay", data);
};
//统计每个项目总销售额（Q）
export const getOutjpropay = (data) => {
  return postData("Outjpropay", data);
};
