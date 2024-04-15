import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import { ConfigProvider } from "antd";
import dayjs from "dayjs";
import zhCN from "antd/es/locale/zh_CN";
import "./assets/css/main.css";
import "dayjs/locale/zh-cn";

import AppProvider from "./components/AppProvider";

import App from "./App";
import Login from "./view/login/Login.jsx";
import Register from "./view/login/Register.jsx";
import { isMobile } from "./utils/utils";
const NotFound = lazy(() => import("./view/notFound/NotFound.jsx"));
dayjs.locale("zh-cn");

// 调用isMobile函数，根据返回值执行不同的操作
if (isMobile()) {
  console.log("手机访问");
  // 在这里执行手机端的操作
} else {
  console.log("大屏幕访问");
  window.location.href = "https://www.xy0312.com";
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AppProvider>
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mobile/*" element={<App />} />
          {/* 或者跳转到 NotFound */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ConfigProvider>
  </AppProvider>
);
