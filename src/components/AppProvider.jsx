import React, { createContext, useState, lazy } from "react";
import lazyLoad from "../utils/lazyLoad";

export const context = createContext({});

/**
 * 路由扁平化处理
 * @param {*} menus
 * @returns
 */
function flatRoutes(menus) {
  const arr = [];
  function findInfo(data) {
    data.forEach((item) => {
      const { children, ...info } = item;
      arr.push(info);
      if (children) {
        findInfo(children);
      }
    });
  }
  findInfo(menus);
  return arr;
}
/**
 * role过滤权限
 * @param {*} role
 * @returns
 */
function findRoles(menus, role) {
  const arr = [];

  function findInfo(data, parent) {
    data.forEach((item) => {
      const { children, ...info } = item;
      //   children存在查找子集
      if (children) {
        info.children = [];
        findInfo(children, info.children);
        // 没有子节点就删除子节点
        // eslint-disable-next-line no-unused-expressions
        info.children.length === "0" ? delete info.children : null;
      }
      //children不存在就判断有没有权限
      if (info.roles) {
        // 有权限的情况下就判断有没有父节点，有父节点就是有二级路由，没有父节点就是一级路由，没有嵌套
        if (info.roles?.includes(role)) {
          parent ? parent.push(info) : arr.push(info);
        }
      } else {
        parent ? parent.push(info) : arr.push(info);
      }
    });
  }

  findInfo(menus);
  return arr;
}

// 实现动态路由的hooks必须
export default function AppProvider({ children }) {
  // 本地menu菜单roles: ["role"],//存在就展示，不存在就会过滤权限，在数组中就代表有权限
  let menusList = [
    {
      key: "/mobile/home",
      // icon: require("../assets/image/sidermenu/home.png"),
      element: lazyLoad(lazy(() => import("../view/home/Home.jsx"))),
      label: "首页",
      grade: "grade", //不需要显示在menu里面的页面
    },
    // {
    //   key: "/mobile/videofrequency",
    //   icon: require("../assets/image/sliderMenu/download.png"),
    //   element: lazyLoad(lazy(() => import("../view/videos"))),
    //   label: "视频教程",
    // },
    {
      key: "/mobile/demand",
      // icon: require("../assets/image/sidermenu/home.png"),
      element: lazyLoad(lazy(() => import("../view/deal/Demand.jsx"))),
      label: "需求发布",
      roles: ["admin", "role", "agent", "superAdmin"],
      grade: "grade", //不需要显示在menu里面的页面
    },
    {
      key: "/mobile/notice",
      // icon: require("../assets/image/sidermenu/home.png"),
      element: lazyLoad(lazy(() => import("../view/notice/Notice.jsx"))),
      label: "发布公告",
      roles: ["admin", "superAdmin"],
      grade: "grade", //不需要显示在menu里面的页面
    },
    {
      key: "/mobile/trust/add", //账号托管
      // icon: require("../assets/image/sidermenu/home.png"),
      element: lazyLoad(lazy(() => import("../view/trust/AddTrust.jsx"))),
      label: "账号托管",
      roles: ["admin", "role", "agent", "superAdmin"],
      grade: "grade", //不需要显示在menu里面的页面
    },
    {
      key: "/mobile/Batch/add", //批量账号托管
      // icon: require("../assets/image/sidermenu/home.png"),
      element: lazyLoad(lazy(() => import("../view/trust/AddBatch.jsx"))),
      label: "账号托管",
      roles: ["admin", "role", "agent", "superAdmin"],
      grade: "grade", //不需要显示在menu里面的页面
    },
    {
      key: "/mobile/count", //统计
      icon: require("../assets/image/sliderMenu/count.png"),
      element: lazyLoad(lazy(() => import("../view/count/Count.jsx"))),
      label: "统计",
      roles: ["admin", "superAdmin"],
    },
    // {
    //   key: "/mobile/unite", //微信套餐
    //   icon: require("../assets/image/sliderMenu/wx-ck.png"),
    //   element: lazyLoad(lazy(() => import("../view/thali/Unite.jsx"))),
    //   label: "联合套餐",
    // },
    {
      key: "/mobile/thali", //QQ套餐
      icon: require("../assets/image/sliderMenu/web_h5.png"),
      element: lazyLoad(lazy(() => import("../view/thali/Thali.jsx"))),
      label: "网页Q",
    },
    {
      key: "/mobile/app", //QQ套餐
      icon: require("../assets/image/sliderMenu/qq-thali.png"),
      element: lazyLoad(lazy(() => import("../view/thali/Thali.jsx"))),
      label: "APPQ",
    },
    {
      key: "/mobile/wethali", //QQ套餐
      icon: require("../assets/image/sliderMenu/web_h5.png"),
      element: lazyLoad(lazy(() => import("../view/thali/WxThali.jsx"))),
      label: "网页W",
    },
    {
      key: "/mobile/wapp", //微信套餐
      icon: require("../assets/image/sliderMenu/wx-thali.png"),
      element: lazyLoad(lazy(() => import("../view/thali/WxThali.jsx"))),
      label: "WX套餐",
    },
    {
      key: "/mobile/thali/config", //套餐详情
      element: lazyLoad(lazy(() => import("../view/thali/ThaliConfig.jsx"))),
      label: "QQ套餐详情",
      grade: "grade", //不需要显示在menu里面的页面
    },
    {
      key: "/mobile/wethali/config", //套餐详情
      element: lazyLoad(lazy(() => import("../view/thali/WxThaliConfig.jsx"))),
      label: "WX套餐详情",
      grade: "grade", //不需要显示在menu里面的页面
    },
    {
      key: "/mobile/open",
      icon: require("../assets/image/sliderMenu/open.png"),
      element: lazyLoad(lazy(() => import("../view/open/Open.jsx"))),
      label: "提取open",
      roles: ["admin", "role", "agent", "superAdmin"],
    },
    {
      key: "/mobile/ck",
      icon: require("../assets/image/sliderMenu/ck.png"),
      element: lazyLoad(lazy(() => import("../view/ck/Ck.jsx"))),
      label: "提取Ck",
      roles: ["admin", "role", "agent", "superAdmin"],
    },
    {
      key: "/mobile/scan",
      icon: require("../assets/image/sliderMenu/scan.png"),
      element: lazyLoad(lazy(() => import("../view/scan/Scan.jsx"))),
      label: "扫码日志",
      roles: ["admin", "superAdmin"],
    },
    {
      key: "/mobile/payment",
      icon: require("../assets/image/sliderMenu/payment.png"),
      element: lazyLoad(lazy(() => import("../view/payment/Payment.jsx"))),
      label: "支付记录",
      roles: ["admin", "superAdmin"],
    },
    {
      key: "/mobile/gold",
      icon: require("../assets/image/sliderMenu/gold.png"),
      element: lazyLoad(lazy(() => import("../view/gold/Gold.jsx"))),
      label: "充值",
    },
    {
      key: "/mobile/recharge",
      element: lazyLoad(lazy(() => import("../view/recharge/Recharge.jsx"))),
      label: "充值记录",
      grade: "grade", //不需要显示在menu里面的页面
    },
    {
      key: "/mobile/project",
      icon: require("../assets/image/sliderMenu/project.png"),
      element: lazyLoad(lazy(() => import("../view/project/Project.jsx"))),
      label: "QQ项目管理",
      roles: ["superAdmin"],
      grade: "grade", //不需要显示在menu里面的页面
    },
    {
      key: "/mobile/project/wx",
      element: lazyLoad(lazy(() => import("../view/project/ProjectWx.jsx"))),
      label: "WX项目管理",
      roles: ["superAdmin"],
      grade: "grade", //不需要显示在menu里面的页面
    },
    {
      key: "/mobile/group",
      icon: require("../assets/image/sliderMenu/group.png"),
      element: lazyLoad(lazy(() => import("../view/group/Group.jsx"))),
      label: "分组管理",
      roles: ["admin", "role", "agent", "superAdmin"],
    },
    {
      key: "/mobile/order",
      icon: require("../assets/image/sliderMenu/order.png"),
      element: lazyLoad(lazy(() => import("../view/order/Order.jsx"))),
      label: "订单管理",
      roles: ["admin", "role", "agent", "superAdmin"],
    },
    {
      key: "/mobile/user/list",
      icon: require("../assets/image/sliderMenu/user-list.png"),
      element: lazyLoad(lazy(() => import("../view/user/UserList.jsx"))),
      label: "用户列表",
      roles: ["admin", "superAdmin"],
    },
    {
      key: "/mobile/user/price",
      element: lazyLoad(lazy(() => import("../view/user/UserPrice.jsx"))),
      label: "价格管理",
      roles: ["admin", "superAdmin"],
      grade: "grade",
    },
    {
      key: "/mobile/modify",
      element: lazyLoad(lazy(() => import("../view/modify/Modify.jsx"))),
      label: "修改密码",
      grade: "grade", //不需要显示在menu里面的页面
    },
    {
      key: "/mobile/user/account",
      icon: require("../assets/image/sliderMenu/user-list.png"),
      element: lazyLoad(lazy(() => import("../view/user/Accountstatus.jsx"))),
      label: "账号状态",
      roles: ["admin", "superAdmin"],
    },
    {
      key: "/mobile/payadministration",
      icon: require("../assets/image/sliderMenu/gold.png"),
      element: lazyLoad(lazy(() => import("../view/payadministration"))),
      label: "支付管理",
      roles: ["admin", "superAdmin"],
    },
    {
      key: "/mobile/usdt",
      icon: require("../assets/image/sliderMenu/payment.png"),
      element: lazyLoad(lazy(() => import("../view/process/Process.jsx"))),
      label: "U记录",
    },
  ];
  let defaultMenus = [];
  let defaultRoutes = [];
  let roles = sessionStorage.getItem("role");
  if (roles) {
    defaultMenus = findRoles(menusList, roles);
    if (defaultMenus && defaultMenus.length > 0) {
      defaultRoutes = flatRoutes(defaultMenus);
    }
  }
  // 侧边栏
  const [menus, setMenus] = useState(defaultMenus);
  // 路由
  const [routes, setRoutes] = useState(defaultRoutes);

  //根据当前角色生成路由信息和侧边栏信息
  const resetMenus = (role) => {
    // 此处重置菜单数据和路由数据
    const temMenu = findRoles(menusList, role);
    setMenus(temMenu);
    setRoutes(flatRoutes(temMenu));
  };

  return (
    <context.Provider value={{ menus, routes, resetMenus }}>
      {children}
    </context.Provider>
  );
}
