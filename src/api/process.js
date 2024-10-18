import { getData, postData } from "./index";

//获取支付记录列表
export const getUsdtList = (data) => {
  return postData("OupryutGet", data);
};

//通过或者拒绝
export const setUpdate = (data) => {
  return postData("usdt/update", data);
};
