import { getData, postData } from "./index";

// 获取公告
export const getNotice = (data) => {
  return postData("OuRemarkGet", data);
};

//更新公告
export const postUpdateNotice = (data) => {
  return postData("OuRemarkAdd", data);
};
