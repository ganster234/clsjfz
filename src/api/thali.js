import {  postData } from "./index";

//获取全部套餐
export const getThaliList = (data) => {
  return postData("OuproTableGet", data);
};

//获取套餐详情
export const getPackDetail = (data) => {
  return postData("OuproTableDetailGet", data);
};


//下单
export const getPlaceOrder = (data) => {
  return postData("OuproTableDetailAdd", data);
};


//获取库存
export const getkucun = (data) => {
  return postData("OuproByGet", data);
};


