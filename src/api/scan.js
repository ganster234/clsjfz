import { getData } from "./index";
//获取扫码日志列表
export const getSanList = (data) => {
  return getData("san/list", data);
};
