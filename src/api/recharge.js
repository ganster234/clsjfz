import { getData, postData } from "./index";

//获取支付记录列表
export const getRecharge = (data) => {
  return getData("user/recharge", data);
};

//微信充值
export const setPayMoney = (data) => {
  return postData("wechat/create", data);
};

// 查询订单
export const getPayStatus = (data) => {
  return getData("pay/serach/status", data);
};

//USTD充值
export const getPayUsdt = (data) => {
  return getData("pay/usdt", data);
};

//卡密充值
export const getCard = (data) => {
  return postData("add/card", data);
};
