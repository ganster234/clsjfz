import React, { useEffect, useState } from "react";
import useAppStore from "../../../store";

import { getDownload } from "../../../api/home";

import "./System.less";

export default function System() {
  const [downloadDetail, setDownloadDetail] = useState({});
  const setService = useAppStore((state) => state.setState);
  const url = JSON.parse(sessionStorage.getItem("globalState"));
  useEffect(() => {
    //获取登陆器
    const getDetail = async () => {
      let result = await getDownload();
      if (result?.code) {
        setDownloadDetail({ ...result?.data });
        setService(result?.data, "service");
      }
    };
    getDetail();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="system">
      <div className="system-title">系统下载</div>
      {url?.state?.service?.apk_download && (
        <div className="system-item system-item-bottom">
          <img
            src={require("../../../assets/image/home/system/skype.png")}
            alt=""
            className="system-item-icon"
          />
          <span className="system-item-title">上号器</span>
          <span
            className="system-obtain"
            onClick={() => {
              window.open(url?.state?.service?.apk_download);
            }}
          >
            下载
          </span>
        </div>
      )}
      {url?.state?.service?.pc_download && (
        <div className="system-item system-item-bottom">
          <img
            src={require("../../../assets/image/home/system/skype.png")}
            alt=""
            className="system-item-icon"
          />
          <span className="system-item-title">PC上号器</span>
          <span
            className="system-obtain"
            onClick={() => {
              window.open(url?.state?.service?.pc_download);
            }}
          >
            下载
          </span>
        </div>
      )}
      {url?.state?.service?.video_addr && (
        <div className="system-item system-item-bottom">
          <img
            src={require("../../../assets/image/home/system/skype.png")}
            alt=""
            className="system-item-icon"
          />
          <span className="system-item-title">视频教程</span>
          <span
            className="system-obtain"
            onClick={() => window.open(url?.state?.service?.video_addr)}
          >
            查看
          </span>
        </div>
      )}

      {url?.state?.service?.document_addr && (
        <div className="system-item system-item-bottom">
          <img
            src={require("../../../assets/image/home/system/skype.png")}
            alt=""
            className="system-item-icon"
          />
          <span className="system-item-title">文档地址</span>
          <span
            className="system-obtain"
            onClick={() => window.open(url?.state?.service?.document_addr)}
          >
            查看
          </span>
        </div>
      )}
      {url?.state?.service?.web_addr && (
        <div className="system-item system-item-bottom">
          <img
            src={require("../../../assets/image/home/system/skype.png")}
            alt=""
            className="system-item-icon"
          />
          <span className="system-item-title">网页上号地址</span>
          <span
            className="system-obtain"
            onClick={() => window.open(url?.state?.service?.web_addr)}
          >
            查看
          </span>
        </div>
      )}
      {url?.state?.service?.tutorial_document && (
        <div className="system-item system-item-bottom">
          <img
            src={require("../../../assets/image/home/system/skype.png")}
            alt=""
            className="system-item-icon"
          />
          <span className="system-item-title">教程文档</span>
          <span
            className="system-obtain"
            onClick={() => window.open(url?.state?.service?.tutorial_document)}
          >
            查看
          </span>
        </div>
      )}
    </div>
  );
}
