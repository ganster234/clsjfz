import { getData, postData } from "./index";

//获取支付记录列表
export const getRecharge = (data) => {
  return postData("OupryGet", data);
};

//微信充值
export const setPayMoney = (data) => {
  return postData("OuxdAdd", data);
};

// 查询订单
export const getPayStatus = (data) => {
  return postData("OuxdGet", data);
};

//USTD充值
export const getPayUsdt = (data) => {
  return postData("OuxdAdd", data);
};

//卡密充值
export const getCard = (data) => {
  return postData("add/card", data);
};
