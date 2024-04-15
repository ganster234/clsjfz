/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { message, Spin } from "antd";
import { Stepper, Picker } from "antd-mobile";

import { getProjectPackList } from "../../../api/project";
import { setAddOpen } from "../../../api/open";
import { getPackDetail } from "../../../api/thali";

import "./CreatePopup.less";

export default function CreatePopup({ closePopup }) {
  const [createOpenLoading, setCreateOpenLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [projectDetail, setProjectDetail] = useState({});
  // 显示套餐list
  const [showPackIdList, setShowPackIdList] = useState(false);
  // 套餐lists
  const [packIdList, setpackIdList] = useState([]);
  const [state, setState] = useState({
    projectList: [], //项目列表
    activeProject: [], //选中的项目
    num: 0,
    activePackId: [], //选中的套餐ID
  });
  useEffect(() => {
    const getProjectList = async () => {
      setCreateOpenLoading(true);
      let result = await getProjectPackList();
      const { code, data, msg } = result || {};
      if (code === 200) {
        const { price } = data || {};
        let list =
          price &&
          price.map((dataItem) => {
            let subItem = {
              ...dataItem,
              label: dataItem?.app_name,
              value: dataItem?.id,
            };
            return subItem;
          });
        setState((item) => ({ ...item, projectList: list }));
      } else {
        message.error(msg);
      }
      setCreateOpenLoading(false);
    };
    getProjectList();
  }, []);

  useEffect(() => {
    async function getDetails() {
      const { projectList, activeProject } = state || {};
      let index =
        projectList &&
        projectList.findIndex((item) => item.id === activeProject[0]);
      setCreateOpenLoading(true);
      let result = await getPackDetail({
        price_id: projectList[index]?.id,
        app_id: projectList[index]?.app_id,
        type: "1",
      });
      const { code, data, msg } = result || {};
      message.destroy();
      if (code === 200) {
        let some =
          data?.pack_id && data?.pack_id.some((item) => item.name === "open");
        if (!some) {
          // message.error("该项目没有此套餐，请联系客服开通");
        }
        let list =
          data?.pack_id &&
          data.pack_id.map((dataItem) => {
            let subItem = {
              ...dataItem,
              label: dataItem?.name,
              value: dataItem?.package_id,
            };
            return subItem;
          });
        setpackIdList([...list]);
        setCreateOpenLoading(false);
        setProjectDetail({ ...data });
      } else {
        message.error(msg);
      }
    }
    if (state.activeProject.length > 0) {
      getDetails();
    }
  }, [JSON.stringify(state?.activeProject)]);

  const getAppName = useMemo(() => {
    let appName = "";
    const { activeProject, projectList } = state || {};
    if (activeProject[0] && projectList && projectList.length > 0) {
      projectList.forEach((item) => {
        if (item.id === activeProject[0]) {
          appName = item?.label;
        }
      });
    }
    return appName;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.activeProject]);

  const getPackage = useMemo(() => {
    let appName = "";
    const { activePackId } = state || {};
    console.log(activePackId,packIdList,'activePackId')
    if (activePackId[0] && packIdList && packIdList.length > 0) {
      packIdList.forEach((item) => {
        if (item.package_id === activePackId[0]) {
          appName = item?.label;
        }
      });
    }
    return appName;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.activePackId]);

  //下单项
  const addOpen = async () => {
    const { activeProject, num, activePackId } = state;
    message.destroy();
    if (!projectDetail && !projectDetail.id) {
      return;
    }
    if (!activeProject || !activeProject[0]) {
      return message.error("请选择项目");
    }
    if (!num) {
      return message.error("请添加数量");
    }
    if (projectDetail?.url) {
      const w = window.open("about:blank");
      w.location.href = projectDetail?.url;
      return;
    }
    let parma = {
      name: projectDetail?.app_name,
      price_id: activeProject[0],
      num: num + "",
      is_op: "1",
    };
    if (activePackId && activePackId[0]) {
      parma.package_id = activePackId[0];
    } else {
      return;
    }
    setCreateOpenLoading(true);
    let result = await setAddOpen({ ...parma });
    const { code, msg } = result || {};
    if (code === 200) {
      setState((item) => ({ ...item, activeProject: [], num: 0 }));
      message.success("创建成功");
      closePopup(false, "str");
    } else {
      message.error(msg);
    }
    setCreateOpenLoading(false);
  };
  return (
    <div className="create-popup">
      <Spin spinning={createOpenLoading}>
        <div className="create-popup-top-icon"></div>
        <div className="create-popup-top-title">
          创建任务
          <img
            src={require("../../../assets/image/popup-back.png")}
            alt=""
            className="create-popup-back"
            onClick={() => closePopup(false)}
          />
        </div>
        <div className="create-popup-prompt">
          <img
            src={require("../../../assets/image/dangerous-icon.png")}
            alt=""
            className="create-open-dangerous-icon"
          />
          创建任务会立即扣除相应余额，提取失败会自动返点
        </div>
        <div className="create-popup-input-item">
          <span>项目：</span>
          <span
            className="create-popup-input-right"
            onClick={() => setShowPicker(true)}
          >
            <span>{getAppName || "选择项目"}</span>
            <img
              src={require("../../../assets/image/right-bottom.png")}
              alt=""
              className="create-popup-right-icon"
            />
          </span>
        </div>
        <div className="create-popup-input-item">
          <span>数量：</span>
          <Stepper
            value={state?.num}
            min={0}
            digits={0}
            onChange={(value) => {
              setState((items) => ({ ...items, num: value }));
            }}
            style={{
              "--border": "1px solid #f5f5f5",
              "--border-inner": "none",
              "--height": "30px",
              "--input-width": "50px",
              "--input-background-color": "var(--adm-color-background)",
              "--active-border": "1px solid #1677ff",
              "--button-text-color": "#999",
            }}
          />
        </div>
        <div className="create-popup-input-item">
          <span>套餐：</span>
          <span
            onClick={() => setShowPackIdList(true)}
            className="create-popup-input-right"
          >
            <span>{getPackage || "选择套餐"}</span>
            <img
              src={require("../../../assets/image/right-bottom.png")}
              alt=""
              className="create-popup-right-icon"
            />
          </span>
        </div>
        <div className="create-open-btn" onClick={() => addOpen()}>
          确定
        </div>
      </Spin>
      <Picker
        columns={[state?.projectList]}
        visible={showPicker}
        onClose={() => {
          setShowPicker(false);
        }}
        value={state?.activeProject}
        onConfirm={(v) => {
          setState((item) => ({ ...item, activeProject: v }));
        }}
      />
      <Picker
        columns={[packIdList]}
        visible={showPackIdList}
        onClose={() => {
          setShowPackIdList(false);
        }}
        value={state?.activePackId}
        onConfirm={(v) => {
          setState((item) => ({ ...item, activePackId: v }));
        }}
      />
    </div>
  );
}
