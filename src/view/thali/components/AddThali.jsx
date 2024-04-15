import React, { useState } from "react";
import { Input, message, Spin } from "antd";

import { getAddProject } from "../../../api/project";

import "./AddThali.less";

export default function AddThali({ closeModal,getList }) {
    const [addThaliLoading,setAddThaliLoading]=useState(false)
  const [state, setState] = useState({
    app_name: "",
    app_id: "",
    logo_path: "",
  });

  const addComfig = async () => {
    const { app_name, app_id, logo_path } = state;
    message.destroy();
    if (!app_name) {
      return message.error("请输入项目名称");
    }
    if (!app_id) {
      return message.error("请输入APPID");
    }
    if (!logo_path) {
      return message.error("请输入封面地址");
    }
    setAddThaliLoading(true)
    let result = await getAddProject({ ...state });
    if(result?.code===200){
        message.success('添加成功')
        getList()
        setAddThaliLoading(false)
        closeModal(false)
    }else{
        message.error(result?.msg||'添加失败')
    }
    setAddThaliLoading(false)
  };
  return (
    <Spin spinning={addThaliLoading}>
      <div className="add-thali">
        <img
          src={require("../../../assets/image/popup-back.png")}
          alt=""
          className="add-thali-icon"
          onClick={() => closeModal(false)}
        />
        <div className="add-thali-title">添加套餐</div>
        <div className="add-thali-input-item add-thali-input-item-bottom">
          <span className="add-thali-input-item-title">项目名称:</span>
          <Input
            value={state?.app_name}
            onChange={(even) => {
              setState((data) => ({
                ...data,
                app_name: even.target.value,
              }));
            }}
            placeholder="请输入项目名称"
            bordered={false}
          />
        </div>
        <div className="add-thali-input-item add-thali-input-item-bottom">
          <span className="add-thali-input-item-title">APPID:</span>
          <Input
            type="number"
            value={state?.app_id}
            onChange={(even) => {
              setState((data) => ({
                ...data,
                app_id: even.target.value,
              }));
            }}
            placeholder="请输入APPID"
            bordered={false}
          />
        </div>
        <div className="add-thali-input-item">
          <span className="add-thali-input-item-title">封面地址:</span>
          <Input
            value={state?.logo_path}
            onChange={(even) => {
              setState((data) => ({
                ...data,
                logo_path: even.target.value,
              }));
            }}
            placeholder="请输入封面地址"
            bordered={false}
          />
        </div>
        <div className="add-thali-btn" onClick={() => addComfig()}>
          确定
        </div>
        <div className="add-thali-btn-cancel">
          <span className="thali-btn-cancel" onClick={() => closeModal(false)}>
            取消
          </span>
        </div>
      </div>
    </Spin>
  );
}
