import React, { useState,  } from "react";
import { useNavigate } from "react-router-dom";
import { Popup, Calendar, Picker } from "antd-mobile";

import "./CountTop.less";
import "./Calendar.less";
const basicColumns = [
  [
    { label: "查询扫码次数", value: "0" },
    { label: "所有销售渠道总金额", value: "1" },
    { label: "统计每个项目总销售额(QQ)", value: "2" },
    { label: "统计每个项目总销售额(wx)", value: "6" },
    // { label: "售后信息", value: "3" },
    // { label: "open销售总额", value: "4" },
  ],
];

export default function CountTop({ data, changeState, getCountList }) {
  const navigate = useNavigate();
  const [dateOpen, setDateOpen] = useState(false); //时间弹窗
  const [channelVisible, setChannelVisible] = useState(false); //显示渠道

  const changeTitle = () => {
    let title = "渠道销售额明细";
    const { type } = data;
    let list = basicColumns[0];
    let index = list.findIndex((item) => item.value === type[0]);
    if (index !== -1) {
      title = list[index].label;
    }
    return title;
  };
  return (
    <div className="count-top">
      <div className="count-back-screen">
        <img
          src={require("../../../assets/image/back-icon.png")}
          alt=""
          className="count-back-icon"
          onClick={() => navigate(-1)}
        />
        <span className="count-top-screen-input">{changeTitle()}</span>
        <div className="count-top-right-screen" onClick={() => getCountList()}>
          <img
            src={require("../../../assets/image/screen-icon.png")}
            alt=""
            className="screen-icon"
          />
          <span>搜索</span>
        </div>
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
        <span
          className="count-screen-channel-item"
          onClick={() => setChannelVisible(true)}
        >
          <span>渠道销售额</span>
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
      <Picker
        columns={basicColumns}
        visible={channelVisible}
        onClose={() => {
          setChannelVisible(false);
        }}
        value={data?.type}
        onConfirm={(v) => {
          console.log(v,'vv');
          changeState("type", v);
        }}
      />
    </div>
  );
}
