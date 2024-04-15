import { getData, postData } from "./index";
//获取open列表
export const getOpenList = (data) => {
  return getData("open/list", data);
};

//创建open列
export const setAddOpen = (data) => {
  return postData("add/open", data);
};
