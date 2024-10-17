import React, { useState, useEffect } from "react";
import { TextArea } from "antd-mobile";
import { message } from "antd";
import useAppStore from "../../store";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import HeadNav from "../../components/haedNav/HeadNav";
import { getNotice, postUpdateNotice } from "../../api/notice";

import "./Notice.less";

export default function Notice() {
  const [notice, setNotice] = useState("");
  // const [state, setState] = useState({});
  const userInfo = useAppStore((state) => state.userInfo); //用户信息
  useEffect(() => {
    console.log(userInfo, "userInfo");
    getNoticeData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getNoticeData = async () => {
    let result = await getNotice();
    message.destroy();
    // eslint-disable-next-line eqeqeq
    if (result?.code == 200) {
      setNotice(result?.data[0].Device_Remark);
    } else {
      message.error(result?.msg);
    }
  };

  const changeNotice = async () => {
    message.destroy();
    // if (!userInfo?.id) {
    //   return;
    // }
    message.open({
      type: "loading",
      content: "加载中..",
      duration: 0,
    });
    let result = await postUpdateNotice({
      // id: userInfo?.id, notice: notice
      Remark: notice,
    });
    message.destroy();
    // eslint-disable-next-line eqeqeq
    if (result?.code == 200) {
      message.success("修改成功");
    } else {
      message.error(result?.msg);
    }
  };
  return (
    <LayoutPanel
      top={<HeadNav title={"发布公告"} hvh={52} />}
      content={
        <div className="notice-content">
          <div className="notice-content-main">
            <div className="notice-main-title">
              <span className="notice-main-wild-card">*</span>
              <span>公告内容：</span>
            </div>
            <div className="notice-text-area">
              <TextArea
                placeholder="请输入内容"
                value={notice}
                onChange={(val) => {
                  setNotice(val);
                }}
                style={{ height: "100%" }}
              />
            </div>
            <div className="notice-dangerous-title">
              最多100字符，为空取消公告
            </div>
          </div>
        </div>
      }
      bottom={
        <div className="notice-footer">
          <div className="notice-footer-btn" onClick={() => changeNotice()}>
            发布
          </div>
        </div>
      }
    />
  );
}
