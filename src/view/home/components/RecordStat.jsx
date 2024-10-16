import React from "react";
import { useNavigate } from "react-router-dom";

import "./RecordStat.less";

export default function RecordStat({ channelDetail }) {
  const navigate = useNavigate();
  return (
    <div className="record-stat">
      <div className="record-stat-title">
        <span className="data-stat">数据统计</span>
        <span className="look-more">
          <span onClick={() => navigate("/mobile/count")}>查看更多</span>
          <img
            onClick={() => navigate("/mobile/count")}
            src={require("../../../assets/image/home/record/more-right.png")}
            alt=""
            className="more-icon"
          />
        </span>
      </div>
      <div className="record-stat-main">
        <div className="progress-ring">
          <div className="text">平台数据</div>
        </div>
        <div className="record-data-right">
          <div
            style={{ marginTop: "15px", marginBottom: "0px" }}
            className="record-data-item record-data-item-bottom"
          >
            <div className="record-data-item-data">
              {channelDetail?.Device_moneyall || "0.00"}
            </div>
            <div className="record-data-item-title">所有销售额</div>
          </div>
          <div
            style={{ marginTop: "15px", marginBottom: "0px" }}
            className="record-data-item record-data-item-bottom"
          >
            <div className="record-data-item-data">
              {channelDetail?.Device_moneyallold || "0.00"}
            </div>
            <div className="record-data-item-title">昨日销售总额</div>
          </div>

          <div
            style={{ marginTop: "15px", marginBottom: "0px" }}
            className="record-data-item record-data-item-bottom "
          >
            <div className="record-data-item-data">
              {channelDetail?.Device_pay || "0.00"}
            </div>
            <div className="record-data-item-title">充值总额</div>
          </div>
          <div
            style={{ marginTop: "15px", marginBottom: "0px" }}
            className="record-data-item record-data-item-bottom "
          >
            <div className="record-data-item-data">
              {channelDetail?.Device_sh || "0.00"}
            </div>
            <div className="record-data-item-title">售后额</div>
          </div>
          {/* <div className="record-data-item">
            <div className="record-data-item-data">
              {channelDetail?.sao || "0.00"}
            </div>
            <div className="record-data-item-title">扫码次数</div>
          </div> */}
          <div style={{ marginTop: "15px" }} className="record-data-item">
            <div className="record-data-item-data">
              {channelDetail?.Device_smok || "0.00"}
            </div>
            <div className="record-data-item-title">今日扫码成功数</div>
          </div>
          <div style={{ marginTop: "15px" }} className="record-data-item">
            <div className="record-data-item-data">
              {channelDetail?.Device_smno || "0.00"}
            </div>
            <div className="record-data-item-title">今日扫码失败数</div>
          </div>
        </div>
      </div>
    </div>
  );
}
