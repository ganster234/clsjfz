import { getData } from "./index";

//销售渠道数据统计
export const getDayStati = (data) => {
  return getData("index/statis", data);
};

//首页柱装图
export const getDayCount = (data) => {
  return getData("index/day", data);
};
export const getIndexDay = (data) => {
  return getData("index/day", data);
};

//登录器下载
export const getDownload = (data) => {
  return getData("download/url", data);
};
