import React from "react";
import { useNavigate } from "react-router-dom";

import "./ThaliConfigTop.less";

export default function ThaliConfigTop() {
  const navigate = useNavigate();
  return (
    <div className="thali-config-top">
      <div className="thali-config-top-left">
        <img
          src={require("../../../assets/image/back-icon.png")}
          alt=""
          className="thali-icon"
          onClick={() => navigate(-1)}
        />
        <img
          src={require("../../../assets/image/thali/thali-home.png")}
          alt=""
          className="thali-icon"
          onClick={() => navigate("/mobile/home")}
        />
      </div>
      套餐详情
      <img
        src={require("../../../assets/image/thali/thali-message.png")}
        alt=""
        className="thali-icon thali-config-top-right-icon"
      />
    </div>
  );
}
