import { getData, postData } from "./index";

// 获取项目和套餐
export const getProjectPackList = (data) => {
  return getData("project/price/pack", data);
};

//获取套餐详情
export const getPackDetail = (data) => {
  return getData("project/pack/detail", data);
};

// 添加项目
export const getAddProject = (data) => {
  return postData("project/add", data);
};

//获取项目列表page第几页,limit一页多少条
export const getProjectList = (data) => {
  return getData("project/list", data);
};

// 开启关闭套餐?id=1&is_share=0
export const getChangeShare = (data) => {
  return getData("project/update/share", data);
};

// 修改套餐价格
export const getChangePrice = (data) => {
  return getData("project/update/price", data);
};
