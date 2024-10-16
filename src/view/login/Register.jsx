import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd-mobile";
import { message, Spin } from "antd";

import { getCode } from "../../api/code";
import { register } from "../../api/login";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";
import "./Login.less";

export default function Register() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    username: "",
    password: "",
    code: "",
    invitation_code: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [codeSrc, setCodeSrc] = useState("");
  const [checkToken, setCheckToken] = useState("");
  const [visible, setVisible] = useState(false); //密码是否可见

  useEffect(() => {
    getCodeSrc();
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
      message.open({
        type: "error",
        content: result.msg,
      });
    }
    setLoginLoading(false);
  };

  const registerBtn = async () => {
    const { username, password, code } = state;
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{10,}$/;
    message.destroy();
    if (username.length < 6) {
      return message.error("注册账号至少需得6位");
    }
    if (!password) {
      return message.error("请输入密码");
    }
    if (!code) {
      return message.error("请输入验证码");
    }
    // if (!regex.test(password)) {
    //   return message.error("密码至少10位，且必须包含大小写字母");
    // }
    if (!state.invitation_code) {
      return message.error("请输入邀请码");
    } else {
      setLoginLoading(true);
      let result = await register({ ...state, checkToken: checkToken });
      const { msg } = result || {};
      if (result?.code === 200) {
        message.success("注册成功");
        // 回到登录页面
        navigate("/", { replace: true });
      } else {
        message.error(msg);
      }
      setLoginLoading(false);
    }
  };

  const jumpLogin = () => {
    navigate("/");
  };
  return (
    <Spin spinning={loginLoading}>
      <div className="login">
        <div className="login-title">
          <div className="login-titile-test">
            <div>您好~</div>
            <div>欢迎注册磁力巨星</div>
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
                value={state?.username}
                onChange={(even) => {
                  setState((data) => ({
                    ...data,
                    username: even,
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
                  value={state?.code}
                  onChange={(even) => {
                    setState((data) => ({
                      ...data,
                      code: even,
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
            <div className="login-form-item">
              <div className="form-item-title">邀请码</div>
              <Input
                placeholder="请输入您的邀请码（可选）"
                value={state?.invitation_code}
                onChange={(even) => {
                  setState((data) => ({
                    ...data,
                    invitation_code: even,
                  }));
                }}
                clearable
              />
            </div>
          </div>
          <div className="main-sign-btn">
            <Button
              block
              color="primary"
              size="large"
              style={{ width: "295px", height: "48px", borderRadius: "24px" }}
              onClick={() => registerBtn()}
            >
              注册
            </Button>
            <Button
              block
              size="large"
              style={{
                width: "295px",
                height: "48px",
                borderRadius: "24px",
                marginTop: "16px",
                background: "#F5F6FA",
              }}
              onClick={() => jumpLogin()}
            >
              登录
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
