import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Button } from "antd";
import { Input } from "antd-mobile";
import useAppStore from "../../store";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import { getCode } from "../../api/code";
import { postUpdatePwd } from "../../api/user";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";
import "./Modify.less";

export default function Modify() {
  const navigate = useNavigate();
  const userInfo = useAppStore((state) => state.userInfo); //用户信息
  const [loading, setLoading] = useState(false);
  const [codeSrc, setCodeSrc] = useState("");
  const [visible, setVisible] = useState(false); //密码是否可见
  const [visibletow, setVisibletow] = useState(false); //确认密码是否可见
  const [checkToken, setCheckToken] = useState("");
  const [state, setState] = useState({
    code: "",
    password: "",
    comPwd: "",
  });

  useEffect(() => {
    (() => {
      getPwdCode();
    })();
  }, []);

  const getPwdCode = async () => {
    let result = await getCode();
    const { code, data, msg } = result || {};
    if (code === 200) {
      setCodeSrc(data?.img);
      setCheckToken(data?.key);
    } else {
      message.destroy();
      message.error(msg);
    }
  };

  const comSubmit = async () => {
    message.destroy();
    if (!checkToken) {
      return;
    }
    if (!userInfo.id) {
      return;
    }
    if (!state.code) {
      return message.error("请输入验证码");
    }
    if (!state.password) {
      return message.error("请输入密码");
    }
    if (state.comPwd !== state.password) {
      return message.error("两次输入密码不一致");
    }
    setLoading(true);
    let result = await postUpdatePwd({
      ...state,
      checkToken,
      user_id: userInfo.id + "",
    });
    if (result?.code === 200) {
      // 退出页面去除本地的登录信息
      localStorage.removeItem("globalState");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      sessionStorage.removeItem("globalState");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
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
                placeholder="请输入内容"
                value={userInfo?.account}
                disabled
                style={{
                  flex: 1,
                  "--font-size": "14px",
                  "--placeholder-color": "#BFBFBF",
                }}
              />
            </div>
            <div className="modify-content-item">
              <span className="modify-content-item-title">验证码</span>
              <Input
                value={state?.code}
                placeholder="请输入验证码"
                style={{
                  flex: 1,
                  "--font-size": "14px",
                  "--placeholder-color": "#BFBFBF",
                }}
                onChange={(even) => {
                  setState((item) => ({ ...item, code: even }));
                }}
              />
              <img
                src={codeSrc}
                alt=""
                onClick={() => getPwdCode()}
                style={{ width: "120px", height: "36px", borderRadius: "4px" }}
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
