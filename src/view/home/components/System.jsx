import React, { useState, useEffect } from "react";
import useAppStore from "../../../store";

import { getDownload } from "../../../api/home";

import "./System.less";

export default function System() {
  const [downloadDetail, setDownloadDetail] = useState({});
  const setService = useAppStore((state) => state.setState);
  useEffect(() => {
    //获取登陆器
    const getDetail = async () => {
      let result = await getDownload();
      if (result?.code === 200) {
        setDownloadDetail({ ...result?.data });
        setService(result?.data, "service");
      }
    };
    getDetail();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const downloadView = () => {
    const w = window.open("about:blank");
    w.location.href = "https://cowtransfer.com/s/920637fb46df4b";
  };
  //   下载登录器
  const homeDownload = (str) => {
    if (downloadDetail[str]) {
      const w = window.open("about:blank");
      w.location.href = downloadDetail[str];
    }
  };
  return (
    <div className="system">
      <div className="system-title">系统下载</div>
      <div className="system-item system-item-bottom">
        <img
          src={require("../../../assets/image/home/system/skype.png")}
          alt=""
          className="system-item-icon"
        />
        <span className="system-item-title">Telegram/Skype教程</span>
        <span className="system-obtain" onClick={() => downloadView()}>
          获取
        </span>
      </div>
      <div className="system-item system-item-bottom">
        <img
          src={require("../../../assets/image/home/system/logon.png")}
          alt=""
          className="system-item-icon"
        />
        <span className="system-item-title">新版OP登录器</span>
        <span
          className="system-obtain"
          onClick={() => homeDownload("download_url")}
        >
          获取
        </span>
      </div>
      <div className="system-item system-item-bottom">
        <img
          src={require("../../../assets/image/home/system/android-app.png")}
          alt=""
          className="system-item-icon"
        />
        <span className="system-item-title">新版安卓APP下载</span>
        <span className="system-obtain" onClick={() => homeDownload("apk")}>
          获取
        </span>
      </div>
      <div className="system-item system-item-bottom">
        <img
          src={require("../../../assets/image/home/system/android-app.png")}
          alt=""
          className="system-item-icon"
        />
        <span className="system-item-title">
          网页登录器下载(非专属项目无需下载)
        </span>
        <span
          className="system-obtain"
          onClick={() => {
            window.open("https://pan.quark.cn/s/c324aef02a8e#/list/share");
          }}
        >
          获取
        </span>
      </div>
      <div
        style={{ borderBottom: "1px solid #eeeeee " }}
        className="system-item"
      >
        <img
          src={require("../../../assets/image/home/system/pc.png")}
          alt=""
          className="system-item-icon"
        />
        <span className="system-item-title">新版PC扫码</span>
        <span className="system-obtain" onClick={() => homeDownload("exe")}>
          获取
        </span>
      </div>
      <div
        style={{ borderBottom: "1px solid #eeeeee " }}
        className="system-item"
      >
        <img
          src={require("../../../assets/image/home/system/pc.png")}
          alt=""
          className="system-item-icon"
        />
        <span className="system-item-title">微信快手使用（用于xposed）</span>
        <span
          className="system-obtain"
          onClick={() => {
            window.open("https://pan.quark.cn/s/ed1d692aedd6#/list/share");
          }}
        >
          获取
        </span>
      </div>
      <div className="system-item">
        <img
          src={require("../../../assets/image/home/system/pc.png")}
          alt=""
          className="system-item-icon"
        />
        <span className="system-item-title">API下载使用与教程</span>
        <span className="system-obtain" onClick={() => homeDownload("file")}>
          获取
        </span>
      </div>
    </div>
  );
}
