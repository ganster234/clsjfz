import React from "react";
import { Input } from "antd";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import HeadNav from "../../components/haedNav/HeadNav";

import "./AddTrust.less";

export default function AddTrust() {
  return (
    <LayoutPanel
      top={<HeadNav title={"账号托管"} hvh={52} />}
      content={
        <div className="add-trust-content">
          <div className="add-trust-content-main">
            <div className="add-trust-main-item add-trust-main-item-bottom-border">
              <span className="add-trust-item-title">
                <span className="add-trust-wildcard">*</span>
                <span>账号：</span>
              </span>
              <Input placeholder="请输入账号" bordered={false} />
            </div>
            <div className="add-trust-main-item add-trust-main-item-bottom-border">
              <span className="add-trust-item-title">
                <span className="add-trust-wildcard">*</span>
                <span>密码：</span>
              </span>
              <Input.Password placeholder="请输入密码" bordered={false} />
            </div>
            <div className="add-trust-main-item add-trust-main-item-bottom-border">
              <span className="add-trust-item-title">
                <span className="add-trust-wildcard">*</span>
                <span>再次确认：</span>
              </span>
              <Input.Password placeholder="请再次输入密码" bordered={false} />
            </div>
            <div className="add-trust-main-item add-trust-main-item-bottom-border">
              <span className="add-trust-item-title">
                <span className="add-trust-wildcard">*</span>
                <span>GUID：</span>
              </span>
              <Input placeholder="请输入GUID" bordered={false} />
            </div>
            <div className="add-trust-main-item add-trust-main-item-bottom-border">
              <span className="add-trust-item-title">
                <span className="add-trust-wildcard">*</span>
                <span>选择类型：</span>
              </span>
            </div>
          </div>
        </div>
      }
      bottom={
        <div className="add-trust-footer">
          <div className="add-trust-footer-btn">保存托管</div>
        </div>
      }
    />
  );
}
