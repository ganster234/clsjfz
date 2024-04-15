import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Popup, Calendar } from "antd-mobile";

import "./CountTop.less";
import "./Calendar.less";

export default function CountTop({ data, changeState, getCountList }) {
  const navigate = useNavigate();
  const [dateOpen, setDateOpen] = useState(false); //时间弹窗

  return (
    <div className="count-top">
      <div className="count-back-screen">
        <img
          src={require("../../../assets/image/back-icon.png")}
          alt=""
          className="count-back-icon"
          onClick={() => navigate(-1)}
        />
      </div>
      <div className="count-screen-channel">
        <span
          className="count-screen-channel-item"
          onClick={() => setDateOpen(true)}
        >
          <span>选择时间</span>
          <img
            src={require("../../../assets/image/triangle.png")}
            alt=""
            className="count-screen-item-triangle"
          />
        </span>
      </div>

      <Popup
        visible={dateOpen}
        destroyOnClose={true}
        onMaskClick={() => {
          setDateOpen(false);
        }}
        onClose={() => {
          setDateOpen(false);
        }}
        position="bottom"
        bodyStyle={{
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          minHeight: "40vh",
        }}
      >
        <div style={{ padding: "12px" }}>
          <Calendar
            className="calendar-custom"
            defaultValue={data?.dateList}
            selectionMode="range"
            onChange={(even) => {
              changeState("dateList", even);
            }}
          />
        </div>
      </Popup>
    </div>
  );
}
