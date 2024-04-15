/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Stepper, Picker } from "antd-mobile";
import { message } from "antd";

import { getPackDetail } from "../../../api/project";
import { getProjectPackList } from "../../../api/project";
import { setAddOpen } from "../../../api/openCk";
import { areaList } from "../../../utils/area";

import "./AddOpen.less";
import { useMemo } from "react";

// 对接完成
export default function AddOpen({ closePopup }) {
  const [addVisible, setAddVisible] = useState(false);
  const [cityVisible, setCityVisible] = useState(false);
  const [value, setValue] = useState([]);
  const [cityCode, setCityCode] = useState([]);
  const [num, setNum] = useState(1);
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
        setPackDetail({ ...data });
      } else {
        message.error(msg);
      }
      message.destroy();
    };
    getDetail();
  }, [JSON.stringify(value)]);

  const addOpenBtn = async () => {
    const { app_id, id } = packDetail || {};
    let param = {
      name: "ck",
      is_op: "2",
    };
    if (num > 0) {
      param.num = num + "";
    }
    if (app_id && id) {
      param.price_id = id;
      param.package_id = 10006;
    } else {
      return message.error("请选择项目");
    }
    if (!cityCode || !cityCode[0]) {
      return message.error("请选择地区");
    }
    param.city_code = cityCode[0] + "";
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
      closePopup("ck");
      setCityCode([]);
    } else {
      message.error(msg);
    }
  };

  const cityName = useMemo(() => {
    let str = "";
    if (cityCode && cityCode[0]) {
      areaList.forEach((element) => {
        if (element.value && cityCode && cityCode[0] === element.value) {
          str = element.label;
        }
      });
    }
    return str;
  }, [JSON.stringify(cityCode)]);
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
            onClick={() => closePopup("ck")}
          />
        </div>
        <div className="add-open-dangerous-title-ck">
          <div className="add-open-dangerous-title-ck-item">
            <img
              src={require("../../../assets/image/home/more/dangerous-icon.png")}
              alt=""
              className="add-open-dangerous-icon"
            />
            <span>创建任务会立即扣除相应余额，提取失败会自动返点</span>
          </div>
          <div className="add-open-dangerous-title-ck-item">
            <img
              src={require("../../../assets/image/home/more/dangerous-icon.png")}
              alt=""
              className="add-open-dangerous-icon"
            />
            <span>有效期 48小时，并且不限制复扫次数。</span>
          </div>
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
          <span className="add-open-input-item-title">地区：</span>
          <span className="add-open-input-item-right">
            <span onClick={() => setCityVisible(true)}>
              {cityName || "选择地区"}
            </span>
            <img
              src={require("../../../assets/image/home/more/project-bottom-icon.png")}
              alt=""
              className="add-open-right-bottom-icon"
              onClick={() => setAddVisible(true)}
            />
          </span>
        </div>
        <div
          className="add-open-btn add-open-btn-ck"
          onClick={() => addOpenBtn()}
        >
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
        columns={[areaList]}
        visible={cityVisible}
        onClose={() => {
          setCityVisible(false);
        }}
        value={cityCode}
        onConfirm={(v) => {
          setCityCode(v);
        }}
      />
    </>
  );
}
