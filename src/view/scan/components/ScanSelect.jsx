import React from "react";
import { Input } from "antd-mobile";

import "./ScanSelect.less";

export default function ScanSelect({ changState, data, reset, searchBtn }) {
  const comState = () => {
    searchBtn();
  };
  return (
    <>
      <div className="scan-select-input-item">
        <div className="scan-select-input-item-title">按appid选择</div>
        <div className="scan-select-input">
          <Input
            value={data?.app_id}
            placeholder="请输入内容"
            clearable
            style={{
              "--text-align": "center",
              "--font-size": "12px",
              "--color": "#323232",
            }}
            onChange={(val) => {
              changState(val, "app_id");
            }}
          />
        </div>
      </div>
      {/* <div className="scan-select-input-item">
        <div className="scan-select-input-item-title">按订单号选择</div>
        <div className="scan-select-input">
          <Input
            value={data?.order_id}
            placeholder="请输入内容"
            clearable
            style={{
              "--text-align": "center",
              "--font-size": "12px",
              "--color": "#323232",
            }}
            onChange={(val) => {
              changState(val, "order_id");
            }}
          />
        </div>
      </div> */}
      <div className="scan-select-input-item">
        <div className="scan-select-input-item-title">按用户账号选择</div>
        <div className="scan-select-input">
          <Input
            value={data?.account}
            placeholder="请输入内容"
            clearable
            style={{
              "--text-align": "center",
              "--font-size": "12px",
              "--color": "#323232",
            }}
            onChange={(val) => {
              changState(val, "account");
            }}
          />
        </div>
      </div>
      <div className="scan-select-comfig-cancel">
        <div
          className="scan-select-cancel scan-select-comfig-cancel-item"
          onClick={() => reset()}
        >
          重置
        </div>
        <div
          className="scan-select-comfig scan-select-comfig-cancel-item"
          onClick={() => comState()}
        >
          确定
        </div>
      </div>
    </>
  );
}
