import { postData, getData } from "./index";

//获取订单列表
export const getOrderList = (data) => {
  return postData("OuSmTableGet", data);
};

//批量删除
export const setDelOrder = (data) => {
  return postData("delOrderIds", data);
};

//修改分组
export const setGroup = (data) => {
  return postData("add/update/group", data);
};
