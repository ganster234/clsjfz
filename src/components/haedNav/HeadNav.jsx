import React from "react";
import {useNavigate} from 'react-router-dom'

import "./HeadNav.less";

export default function HeadNav({ title, hvh }) {
  const navigate = useNavigate();
  const backGo=()=>{
    navigate(-1);
  }
  return (
    <div className="head-nav" style={{ height: hvh ? hvh : "52px" }}>
      <img
        src={require("../../assets/image/deal/demand-back.png")}
        alt=""
        className="head-nav-back-icon"
        style={{ top: hvh / 2 + "px", left: "12px" }}
        onClick={()=>backGo()}
      />
      {title}
    </div>
  );
}
