import { message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

import useAppStore from "../../../store";

import "./MenuPopup.less";

export default function MenuPopup({ menuChange }) {
  const service = useAppStore((state) => state.service); //客服信息
  const userInfo = useAppStore((state) => state.userInfo); //用户信息
  const role = useAppStore((state) => state.role); //用户信息
  const navigate = useNavigate();
  const menuList = [
    // {
    //   icon: require("../../../assets/image/home/menu/leave.png"),
    //   title: "留言",
    //   path:''
    // },
    {
      title: "发布公告",
      icon: require("../../../assets/image/home/menu/release-notice.png"),
      path: "/mobile/notice",
      roles: ["admin", "superAdmin"],
    },
    // {
    //   title: "QQ项目管理",
    //   icon: require("../../../assets/image/home/menu/qq-project-manage.png"),
    //   path: "/mobile/project",
    //   roles: ["admin", "superAdmin"],
    // },
    // {
    //   title: "WX项目管理",
    //   icon: require("../../../assets/image/home/menu/wx-project-manage.png"),
    //   path: "/mobile/project/wx",
    //   roles: ["admin", "superAdmin"],
    // },
    {
      icon: require("../../../assets/image/home/menu/change-password.png"),
      title: "修改密码",
      path: "/mobile/modify",
      roles: ["admin", "role", "superAdmin"],
    },
  ];

  const jumpItem = (path) => {
    if (path) {
      menuChange(false);
      setTimeout(() => {
        navigate(path);
      }, 300);
    } else {
      message.error("此功能暂未开通");
    }
  };

  const unSign = () => {
    // 退出页面去除本地的登录信息
    localStorage.removeItem("globalState");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("globalState");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/");
  };

  const renderChildMenu = (item, index) => {
    return item.roles?.includes(role) ? (
      <div key={index} className="menu-list-item">
        <img
          src={item.icon}
          alt=""
          className="menu-list-item-icon"
          onClick={() => jumpItem(item.path)}
        />
        <span
          className="menu-list-item-content"
          onClick={() => jumpItem(item.path)}
        >
          {item.title}
        </span>
        <img
          onClick={() => jumpItem(item.path)}
          src={require("../../../assets/image/home/menu/menu-right-icon.png")}
          alt=""
          className="menu-right-icon"
        />
      </div>
    ) : (
      ""
    );
  };
  return (
    <div className="menu-popup">
      <div className="user-info-message">
        <img
          src={require("../../../assets/image/home/menu/popup-back.png")}
          alt=""
          className="menu-popup-back"
          onClick={() => menuChange(false)}
        />
        <div className="menu-avater-box">
          <img
            src={require("../../../assets/image/avater/head-icon.png")}
            alt=""
            className="menu-user-avater"
          />
          <span>{userInfo?.account}</span>
        </div>
      </div>
      <div className="menu-list">
        {menuList &&
          menuList.map((item, index) => {
            return renderChildMenu(item, index);
          })}
      </div>
      <div className="sign-service">
        <div className="menu-service-box">
          <div>{service.phone}</div>
          {/* <div>{service.skype}</div> */}
          {/* <div>{service.telegram}</div> */}
          <div>{service.time}</div>
        </div>
        <div className="exit-sign">
          <img
            src={require("../../../assets/image/home/menu/exit-sign.png")}
            alt=""
            className="exit-sign-icon"
            onClick={() => unSign()}
          />
          <span onClick={() => unSign()}>退出登录</span>
        </div>
      </div>
    </div>
  );
}
