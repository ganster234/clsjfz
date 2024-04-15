import React, { useContext, useEffect } from "react";
import { message } from "antd";
import { context } from "./components/AppProvider";
import { Routes, Route } from "react-router";
import Layouts from "./view/Layouts.jsx";
import { useLocation,useNavigate } from 'react-router-dom';
import { usebegin } from "./store/mystore.jsx";

// import Loadable from 'react-loadable';

// import Home from "./view/home/Home";
//懒加载组件，react自带的，两者性能几乎相差无几就是写法差距
// const Button = React.lazy(async () => {
//   const antd = await import/* webpackChunkName: "antd" */('antd/lib/button');
//   return antd;
// });
//懒加载组件，这是react社区插件，两者性能几乎相差无几就是写法差距
// const Input = Loadable({
//   loader: async () => {
//     const antd = await import(/* webpackChunkName: "antd" */ 'antd/lib/input');
//     return antd;
//   },
//   loading: () => <div>Loading...</div>,
// });

export default function App() {
  const navigate = useNavigate();
  const takestore = usebegin();
  const location = useLocation();
  const { routes } = useContext(context);
  // 退出页面去除本地的登录信息
  useEffect(() => {
    return () => {
      localStorage.removeItem("globalState");
      sessionStorage.removeItem("globalState");
    };
  }, []);
  useEffect(()=>{
    // console.log(8888,window.location.hash,location.pathname);
    if(takestore.disclosedBallot){
      if(location.pathname !== "/mobile/modify"){
        navigate('/mobile/modify')
      }
      message.warning("请完成修改密码");
    }
  },[location.pathname])
  return (
    <Layouts>
      <Routes>
        {routes &&
          routes.map(
            (item) =>
              item.element && (
                <Route
                  key={item.key}
                  path={item.key.replace("/mobile", "")}
                  element={item.element}
                />
              )
          )}
      </Routes>
    </Layouts>
  );
}
