import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { produce } from "immer";
const lasting = {
  //持久化
  disclosedBallot: false, //记住账户
};
const perishability = {
  //非持久化
  Topupstatus: false,
};
const usebegin = create(
  devtools(
    persist(
      immer((set) => ({
        //数据持久化修改
        ...lasting,
        setdisclosedBallot: (val) =>
          set((pre) => {
            pre.disclosedBallot = val;
          })
      })),
      { name: "usebegin" }
    )
  )
);
const useBearStore = create((set) => ({
  //非数据持久修改
  ...perishability,
  setTopupstatus: (val) =>
    set(
      produce((pre) => {
        pre.Topupstatus = val;
      })
    ),
}));
export { usebegin };
