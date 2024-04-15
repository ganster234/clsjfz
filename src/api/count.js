import { getData } from "./index";

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
  return getData("payList", data);
};
//修改支付状态
export const setpayprice = (data) => {
  return getData("usePay", data);
};
//添加支付方式
export const addpayprice = (data) => {
  return getData("addPay", data);
};