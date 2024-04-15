/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { Stepper, Picker } from "antd-mobile";
import { message } from "antd";

import { getPackDetail } from "../../../api/project";
import { getProjectPackList } from "../../../api/project";
import { setAddOpen } from "../../../api/openCk";

import "./AddOpen.less";

// 对接完成
export default function AddOpen({ closePopup }) {
  const [addVisible, setAddVisible] = useState(false);
  const [value, setValue] = useState([]);
  const [num, setNum] = useState(1);
  // activePackId
  const [activePackId, setActivePackId] = useState([]);
  // 显示套餐list
  const [showPackIdList, setShowPackIdList] = useState(false);
  // 套餐lists
  const [packIdList, setPackIdList] = useState([]);
  const [packList, setPackList] = useState([]);
  const [packDetail, setPackDetail] = useState({});

  useEffect(() => {
    const getPackList = async () => {
      let result = await getProjectPackList();
      const { data, code } = result || {};
      message.destroy();
      if (code === 200) {
        if (data?.price && data?.price) {
          let list = data?.price.map((item) => {
            let subItem = {
              ...item,
              label: item.app_name,
              value: item.id,
            };
            return subItem;
          });
          setPackList([list]);
        }
      } else {
        message.error(result?.msg);
      }
    };
    if (packList && packList.length === 0) {
      getPackList();
    }
  }, []);

  useEffect(() => {
    // 获取项目详情
    const getDetail = async () => {
      if (!value[0]) {
        return;
      }
      let index =
        packList[0] && packList[0].findIndex((item) => item.value === value[0]);
      if (index === -1) {
        return;
      }
      if (!packList[0][index]?.value && !packList[0][index]?.app_id) {
        return;
      }
      message.open({
        type: "loading",
        content: "加载中..",
        duration: 0,
      });
      let result = await getPackDetail({
        price_id: packList[0][index]?.value,
        app_id: packList[0][index]?.app_id,
      });
      const { code, data, msg } = result || {};
      if (code === 200) {
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
        setPackIdList([...list]);
        setPackDetail({ ...data });
      } else {
        message.error(msg);
      }
      message.destroy();
    };
    getDetail();
  }, [JSON.stringify(value)]);

  const getPackage = useMemo(() => {
    let appName = "";
    if (activePackId && activePackId[0]) {
      packIdList.forEach((item) => {
        if (item.value === activePackId[0]) {
          appName = item.label;
        }
      });
    }
    return appName;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(activePackId)]);

  const addOpenBtn = async () => {
    const { id } = packDetail || {};
    let param = {
      name: "open",
      is_op: "1",
    };
    if (num > 0) {
      param.num = num + "";
    }
    if (id && activePackId[0]) {
      param.price_id = id;
      param.package_id = activePackId[0];
    } else {
      return message.error("请选择项目");
    }
    message.open({
      type: "loading",
      content: "加载中..",
      duration: 0,
    });
    let result = await setAddOpen(param);
    const { code, msg } = result || {};
    message.destroy();
    if (code === 200) {
      message.success("创建成功");
      setNum(1);
      setValue([]);
      setPackDetail({});
      closePopup("open");
    } else {
      message.error(msg);
    }
  };
  return (
    <>
      <div className="add-open">
        <div className="add-open-top-line"></div>
        <div className="add-open-titile-box">
          创建任务
          <img
            src={require("../../../assets/image/home/more/close-popup-icon.png")}
            alt=""
            className="close-popup-icon"
            onClick={() => closePopup("open")}
          />
        </div>
        <div className="add-open-dangerous-title">
          <img
            src={require("../../../assets/image/home/more/dangerous-icon.png")}
            alt=""
            className="add-open-dangerous-icon"
          />
          <span>创建任务会立即扣除相应余额，提取失败会自动返点</span>
        </div>
        <div className="add-open-input-item">
          <span className="add-open-input-item-title">项目：</span>
          <span className="add-open-input-item-right">
            <span onClick={() => setAddVisible(true)}>
              {packDetail?.app_name || "选择项目"}
            </span>
            <img
              src={require("../../../assets/image/home/more/project-bottom-icon.png")}
              alt=""
              className="add-open-right-bottom-icon"
              onClick={() => setAddVisible(true)}
            />
          </span>
        </div>
        <div className="add-open-input-item">
          <span className="add-open-input-item-title">数量：</span>
          <span className="add-open-input-item-right custom-stepper">
            <Stepper
              value={num}
              min={0}
              digits={0}
              style={{
                "--border": "1px solid #f5f5f5",
                "--border-inner": "none",
                "--height": "30px",
                "--input-width": "50px",
                "--input-background-color": "var(--adm-color-background)",
                "--active-border": "1px solid #1677ff",
                "--button-text-color": "#999",
              }}
              onChange={(value) => {
                setNum(value);
              }}
            />
          </span>
        </div>
        <div className="add-open-input-item">
          <span className="add-open-input-item-title">套餐：</span>
          <span className="add-open-input-item-right">
            <span onClick={() => setShowPackIdList(true)}>
              {getPackage || "选择套餐"}
            </span>
            <img
              src={require("../../../assets/image/home/more/project-bottom-icon.png")}
              alt=""
              className="add-open-right-bottom-icon"
              onClick={() => setAddVisible(true)}
            />
          </span>
        </div>
        <div className="add-open-btn" onClick={() => addOpenBtn()}>
          确定
        </div>
      </div>

      <Picker
        columns={packList}
        visible={addVisible}
        onClose={() => {
          setAddVisible(false);
        }}
        value={value}
        onConfirm={(v) => {
          setValue(v);
        }}
      />
      <Picker
        columns={[packIdList]}
        visible={showPackIdList}
        onClose={() => {
          setShowPackIdList(false);
        }}
        value={value}
        onConfirm={(v) => {
          setActivePackId(v);
        }}
      />
    </>
  );
}
