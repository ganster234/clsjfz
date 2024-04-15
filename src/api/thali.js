import { getData, postData } from "./index";

//获取全部套餐
export const getThaliList = (data) => {
  return getData("appPrice/getAll", data);
};

//获取套餐详情
export const getPackDetail = (data) => {
  return getData("project/pack/detail", data);
};


//下单
export const getPlaceOrder = (data) => {
  return postData("pay/create", data);
};
