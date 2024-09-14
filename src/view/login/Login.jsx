import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd-mobile";
import { message, Spin } from "antd";
import useAppStore from "../../store";

import { context } from "../../components/AppProvider";
import { getCode } from "../../api/code";
import { login, transmitting } from "../../api/login";
import { usebegin } from "../../store/mystore";
import Fingerprint2 from "fingerprintjs2";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";
import { newData } from "../../store/zhiwen";

import "./Login.less";

export default function Login() {
  const takestore = usebegin();
  const navigate = useNavigate();
  const platformSrc = useAppStore((state) => state.platformSrc);
  const [state, setState] = useState({
    account: "",
    password: "",
    verifyCode: "",
  });
  const [visible, setVisible] = useState(false); //密码是否可见
  const [loginLoading, setLoginLoading] = useState(false);
  const [codeSrc, setCodeSrc] = useState("");
  const [checkToken, setCheckToken] = useState("");
  const setRole = useAppStore((state) => state.setState); //用户信息
  const { resetMenus } = useContext(context);

  useEffect(() => {
    getCodeSrc();
    transmitting({ data: JSON.stringify(newData) });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getCodeSrc = async () => {
    setLoginLoading(true);
    let result = await getCode();
    const { code, data } = result || {};
    if (code === 200) {
      if (data?.img) {
        setCodeSrc(data?.img);
        setCheckToken(data?.key);
      }
    } else {
      message.destroy();
      message.error(result?.msg || "获取验证码失败");
    }
    setLoginLoading(false);
  };

  const loginBtn = async () => {
    const { account, password, verifyCode } = state;
    message.destroy();
    if (!account) {
      return message.error("请输入账号");
    }
    if (!password) {
      return message.error("请输入密码");
    }
    if (!verifyCode) {
      return message.error("请输入验证码");
    }
    setLoginLoading(true);
    let result = await login({ ...state, checkToken: checkToken });
    const fingerprint = await new Promise((resolve) => {
      Fingerprint2.get((components) => {
        const values = components.map((component) => component.value);
        const fingerprint = Fingerprint2.x64hash128(values.join(""), 31);
        resolve(fingerprint);
      });
    });
    const { code, data, msg } = result || {};
    if (code === 200) {
      takestore.setdisclosedBallot(false);
      sessionStorage.setItem("token", data?.data);
      // 刷新页面导致路由以及丢失menu的关键
      sessionStorage.setItem("role", data?.roles || "admin");
      setRole(data?.roles, "role");
      //重置路由菜关键点
      resetMenus(data?.roles || "admin");
      // 获取查询参数,如果没有就跳转到首页
      navigate("/mobile/home", { replace: true });

      // await fetch("https://api.afei567.com/v1/add/user/ip", {
      //   method: "POST",
      //   headers: {
      //     Token: data?.data,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     zhi: fingerprint,
      //     data: window.navigator.userAgent,
      //     account: data?.account,
      //     type:
      //       platformSrc === "rosefinch"
      //         ? "2"
      //         : platformSrc === "whale"
      //         ? "3"
      //         : platformSrc === "shark"
      //         ? "4"
      //         : "",
      //   }),
      // });
    } else if (code === 410) {
      console.log("进入了");
      //未修改密码禁止用户操作
      takestore.setdisclosedBallot(true);
      sessionStorage.setItem("token", data);
      // 刷新页面导致路由以及丢失menu的关键
      sessionStorage.setItem("role", data?.roles || "admin");
      setRole(data?.roles, "role");
      //重置路由菜关键点
      resetMenus(data?.roles || "admin");
      // 获取查询参数,如果没有就跳转到首页
      navigate("/mobile/modify", { replace: true });
      message.open({
        type: "warning",
        content: msg,
      });
    } else {
      message.error(msg);
      getCodeSrc();
    }
    setLoginLoading(false);
  };

  const jumpSegister = () => {
    navigate("/register");
  };
  return (
    <Spin spinning={loginLoading}>
      <div className="login">
        <div className="login-title">
          <div className="login-titile-test">
            <div>您好~</div>
            <div>欢迎登录磁力巨星</div>
          </div>
          {/* <img
            src={require("../../assets/image/login/login-title.png")}
            alt=""
            className="login-titile-icon"
          /> */}
        </div>
        <div className="login-main">
          <div className="login-form">
            <div className="login-form-item">
              <div className="form-item-title">账号</div>
              <Input
                placeholder="请输入您的账号"
                value={state?.account}
                onChange={(even) => {
                  setState((data) => ({
                    ...data,
                    account: even,
                  }));
                }}
                clearable
              />
            </div>
            <div className="login-form-item">
              <div className="form-item-title">密码</div>
              <div style={{ display: "flex" }}>
                <Input
                  type={visible ? "text" : "password"}
                  placeholder="请输入您的密码"
                  value={state?.password}
                  onChange={(even) => {
                    setState((data) => ({
                      ...data,
                      password: even,
                    }));
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
            </div>
            <div className="login-form-item">
              <div className="form-item-title">验证码</div>
              <div className="form-item-input-box">
                <Input
                  placeholder="请输入验证码"
                  value={state?.verifyCode}
                  onChange={(even) => {
                    setState((data) => ({
                      ...data,
                      verifyCode: even,
                    }));
                  }}
                  clearable
                />
                <img
                  src={codeSrc ? codeSrc : ""}
                  alt=""
                  className="form-item-code-icon"
                  onClick={() => getCodeSrc()}
                />
              </div>
            </div>
          </div>
          <div className="main-sign-btn">
            <Button
              block
              size="large"
              style={{
                width: "295px",
                height: "48px",
                borderRadius: "24px",
                marginBottom: "16px",
                background: "#F5F6FA",
              }}
              onClick={() => loginBtn()}
            >
              登录
            </Button>
            <Button
              block
              color="primary"
              size="large"
              style={{ width: "295px", height: "48px", borderRadius: "24px" }}
              onClick={() => jumpSegister()}
            >
              注册
            </Button>
          </div>
          {/* <div className="main-logo-box">
            <img
              src={require("../../assets/image/logo/logo.png")}
              alt=""
              className="main-logo"
            />
          </div> */}
        </div>
      </div>
    </Spin>
  );
}
