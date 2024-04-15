import React, { useEffect } from "react";
import useAppStore from "../store";
import { message } from "antd";

import { getUser } from "../api/user";

export default function Layouts({ children }) {
  const setUserInfo = useAppStore((state) => state.setState); //设置用户信息

  useEffect(() => {
    // 获取用户信息
    getUserInfo();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 获取用户信息
  const getUserInfo = async () => {
    let result = await getUser();
    const { code, data, msg } = result || {};
    if (code === 200) {
      setUserInfo(data, "userInfo");
    } else {
      message.destroy();
      message.error(msg);
    }
  };
  return <>{children}</>;
}
