import React, { useContext } from "react";
import { Image } from "antd-mobile";
import { useNavigate } from "react-router-dom";

import { context } from "../../../components/AppProvider";

import "./Ability.less";

export default function Ability() {
  const navigate = useNavigate();
  const { routes } = useContext(context);

  const jumpRouter = (data) => {
    if (data && data?.key) {
      navigate(data?.key);
    }
  };

  const renderChildMenu = (item, index) => {
    return item?.grade ? (
      ""
    ) : (
      <div
        className="ability-item"
        key={index}
        onClick={() => jumpRouter(item)}
      >
        <Image lazy src={item.icon} width={36} height={36} />
        {/* <img src={item.icon} alt="" className="ability-item-icon" /> */}
        <span>{item.label}</span>
      </div>
    );
  };
  return (
    <div className="ability">
      <div className="ability-title">常用功能</div>
      <div className="ability-item-box">
        {routes &&
          routes.map((item, index) => {
            return renderChildMenu(item, index);
          })}
      </div>
    </div>
  );
}
