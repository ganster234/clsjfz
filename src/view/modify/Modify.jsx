import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Button } from "antd";
import { Input } from "antd-mobile";
import useAppStore from "../../store";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import { postUpdatePwd } from "../../api/user";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";
import "./Modify.less";

export default function Modify() {
  const navigate = useNavigate();
  const userInfo = useAppStore((state) => state.userInfo); //用户信息
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false); //密码是否可见
  const [visibletow, setVisibletow] = useState(false); //确认密码是否可见
  console.log(userInfo, "userInfouserInfo");
  const [state, setState] = useState({
    password: "",
    comPwd: "",
  });
  const Userid = sessionStorage.getItem("user");
  const comSubmit = async () => {
    message.destroy();
    if (!userInfo.id) {
      return;
    }
    if (!state.password) {
      return message.error("请输入密码");
    }
    if (state.comPwd !== state.password) {
      return message.error("两次输入密码不一致");
    }
    setLoading(true);
    let result = await postUpdatePwd({
      Sid: Userid,
      Pass: state.password,
      Oldpass: state.comPwd,
    });
    if (result?.code === 200) {
      // 退出页面去除本地的登录信息
      localStorage.clear();
      sessionStorage.clear();
      await navigate("/");
      alert("修改成功");
    } else {
      message.error(result?.msg);
    }
    setLoading(false);
  };
  return (
    <>
      <LayoutPanel
        top={
          <div className="modify-top">
            <img
              src={require("../../assets/image/back-icon.png")}
              alt=""
              className="modify-top-back-icon"
              onClick={() => navigate(-1)}
            />
            修改密码
          </div>
        }
        content={
          <div className="modify-content">
            <div className="modify-content-item">
              <span className="modify-content-item-title">用户名</span>
              <Input
                value={userInfo?.Device_name}
                disabled
                style={{
                  flex: 1,
                  "--font-size": "14px",
                  "--placeholder-color": "#BFBFBF",
                }}
              />
            </div>
            <div className="modify-content-item">
              <span className="modify-content-item-title">新密码</span>
              <Input
                type={visible ? "text" : "password"}
                value={state?.password}
                placeholder="请输入新密码"
                style={{
                  flex: 1,
                  "--font-size": "14px",
                  "--placeholder-color": "#BFBFBF",
                }}
                onChange={(even) => {
                  setState((item) => ({ ...item, password: even }));
                }}
              />
              <div style={{ fontSize: "18px" }}>
                {!visible ? (
                  <EyeInvisibleOutline onClick={() => setVisible(true)} />
                ) : (
                  <EyeOutline onClick={() => setVisible(false)} />
                )}
              </div>
            </div>
            <div className="modify-content-item">
              <span className="modify-content-item-title">确认密码</span>
              <Input
                type={visibletow ? "text" : "password"}
                value={state?.comPwd}
                placeholder="请输入再次输入密码"
                style={{
                  flex: 1,
                  "--font-size": "14px",
                  "--placeholder-color": "#BFBFBF",
                }}
                onChange={(even) => {
                  setState((item) => ({ ...item, comPwd: even }));
                }}
              />
              <div style={{ fontSize: "18px" }}>
                {!visibletow ? (
                  <EyeInvisibleOutline onClick={() => setVisibletow(true)} />
                ) : (
                  <EyeOutline onClick={() => setVisibletow(false)} />
                )}
              </div>
            </div>
            <Button
              type="primary"
              onClick={comSubmit}
              loading={loading}
              style={{ height: "40px", marginTop: "16px", width: "100%" }}
            >
              确认修改
            </Button>
          </div>
        }
      />
    </>
  );
}
