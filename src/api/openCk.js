import { postData, getData } from "./index";

//获取open列表
export const setAddOpen = (data) => {
  return postData("add/open", data);
};

//下载open
export const getUserOpen = (data) => {
  return postData("OuproOpenUpload", data);
};
