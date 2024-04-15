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
              {channelDetail?.total || "0.00"}
            </div>
            <div className="record-data-item-title">所有销售额</div>
          </div>
          <div
            style={{ marginTop: "15px", marginBottom: "0px" }}
            className="record-data-item record-data-item-bottom"
          >
            <div className="record-data-item-data">
            {channelDetail?.pan_total || "0.00"}
            </div>
            <div className="record-data-item-title">本站总额</div>
          </div>

          <div
            style={{ marginTop: "15px", marginBottom: "0px" }}
            className="record-data-item record-data-item-bottom "
          >
            <div className="record-data-item-data">
              {channelDetail?.add || "0.00"}
            </div>
            <div className="record-data-item-title">充值总额</div>
          </div>
          <div
            style={{ marginTop: "15px", marginBottom: "0px" }}
            className="record-data-item record-data-item-bottom "
          >
            <div className="record-data-item-data">
            {channelDetail?.after || "0.00"}
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
              {channelDetail?.suc_sao || "0.00"}
            </div>
            <div className="record-data-item-title">今日扫码成功数</div>
          </div>
          <div style={{ marginTop: "15px" }} className="record-data-item">
            <div className="record-data-item-data">
              {channelDetail?.err_sao || "0.00"}
            </div>
            <div className="record-data-item-title">今日扫码失败数</div>
          </div>
        </div>
      </div>
    </div>
  );
}
