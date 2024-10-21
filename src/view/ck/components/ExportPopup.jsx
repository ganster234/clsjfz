import React, { useState } from "react";
import { message, Spin } from "antd";
import { Input } from "antd-mobile";

import { getUserOpen } from "../../../api/openCk";
import { exportRaw } from "../../../utils/utils";

import "./ExportPopup.less";

export default function ExportPopup({ closeExportPopup }) {
  const downloadList = [
    {
      title: `磁力登录器`,
      value: "1",
    },
    {
      title: "open+token格式",
      value: "3",
    },
  ];
  const [exportLoading, setExportLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [openidTaskId, setOpenidTaskId] = useState("");

  const comExport = async () => {
    message.destroy();
    if (!openidTaskId) {
      return message.error("请输入内容");
    }
    // if (!downloadList[active]) {
    //   return message.error("请选择下载类型");
    // }
    setExportLoading(true);
    // let result = await getUserOpen({
    //   type: downloadList[active]?.value,
    //   openid_task_id: openidTaskId,
    // });
    let result = await getUserOpen({ Sid: openidTaskId });

    const { code, data, msg } = result || {};
    if (code === "200") {
      exportRaw(openidTaskId, data, true);
      setActive(0);
      setOpenidTaskId("");
      closeExportPopup(false);
      message.success("下载成功");
    } else {
      message.error(msg);
    }
    setExportLoading(false);
  };
  return (
    <div className="export-popup">
      <Spin spinning={exportLoading}>
        <div className="export-popup-top-icon"></div>
        <div className="export-popup-top-title">
          订单导出
          <img
            src={require("../../../assets/image/popup-back.png")}
            alt=""
            className="export-popup-back"
            onClick={() => closeExportPopup(false)}
          />
        </div>
        <div className="export-popup-input">
          <span className="export-popup-input-title">*</span>
          <Input
            value={openidTaskId}
            placeholder="请输入内容"
            style={{
              "--font-size": "font-size: 16px;",
              "--placeholder-color": "#999999",
            }}
            onChange={(value) => {
              setOpenidTaskId(value);
            }}
            clearable
          />
        </div>
        {/* {downloadList &&
          downloadList.map((item, index) => {
            return (
              <div className="export-popup-radio-item" key={index}>
                <span>{item?.title}</span>
                <img
                  src={
                    active === index
                      ? require("../../../assets/image/openck/select-checked.png")
                      : require("../../../assets/image/openck/select.png")
                  }
                  alt=""
                  className="export-popup-radio-icon"
                  onClick={() => setActive(index)}
                />
              </div>
            );
          })} */}
        <div className="export-btn" onClick={() => comExport()}>
          确定
        </div>
      </Spin>
    </div>
  );
}
