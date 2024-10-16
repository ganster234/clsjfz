import {postData } from "./index";

//销售渠道数据统计
export const getDayStati = (data) => {
  return postData("OussdataGet", data);
};


export const getIndexDay = (data) => {
  return postData("OussListGet", data);
};

//登录器下载
export const getDownload = (data) => {
  return postData("url", data);
};
