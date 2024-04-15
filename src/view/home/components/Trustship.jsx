import React from "react";
import { useNavigate } from "react-router-dom";

import "./Trustship.less";

export default function Trustship({ closePopup }) {
  const navigate = useNavigate();
  const jump = (path) => {
    navigate(path);
  };
  return (
    <div className="trustship">
      <img
        src={require("../../../assets/image/home/more/close-popup-icon.png")}
        alt=""
        className="trustship-close-icon"
        onClick={() => closePopup("trustship")}
      />
      <div className="trustship-title">账号托管</div>
      <div
        className="trustship-single-btn"
        onClick={() => jump("/mobile/trust/add")}
      >
        单个账号托管
      </div>
      <div
        className="trustship-single-btn"
        onClick={() => jump("/mobile/Batch/add")}
      >
        批量账号托管
      </div>
    </div>
  );
}
