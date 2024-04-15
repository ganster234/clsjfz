import { create } from "zustand";
// 数据持久化
import { createJSONStorage, persist } from "zustand/middleware";

//useAppStore==vue中的state
const useAppStore = create(
  //持久化储存
  persist(
    (set, get) => ({
      userInfo: {}, //用户信息
      service: {}, //客服信息
      thaliInfo: {}, //套餐信息
      role:null,//权限
      platformSrc: "shark", //rosefinch：喜猫，whale：蓝鲸，shark：大白鲨
      // 异步操作获取数据
      setState: (data, str) => {
        set({ [str]: data });
      },
    }),
    // 关键点在这里初始化就会将state储存进storage
    {
      //存进storage的名字
      name: "globalState",
      //值可选sessionStorage，localStorage
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAppStore;
