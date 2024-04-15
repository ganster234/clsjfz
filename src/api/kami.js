import { getData } from "./index";

//登录器下载
export const getCardList = (data) => {
  return getData("get/card", data);
};
