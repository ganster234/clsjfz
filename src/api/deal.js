import { getData,postData } from "./index";

//获取公开交易站列表
export const getDealList = (data) => {
  return getData("trad/post/list", data);
};

//添加任务
export const setAddDeal = (data) => {
  return postData("trad/post/add", data);
};
