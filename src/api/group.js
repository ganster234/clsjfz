import { getData, postData } from "./index";

//获取分组列表
export const getGroupList = (data) => {
  return postData("OuGroGet", data);
};

//删除分组分页
export const getDelGroup = (data) => {
  return postData("OuGroDel", data);
};

// 添加分组
export const postAddGroup = (data) => {
  return postData("OuGroAdd", data);
};
