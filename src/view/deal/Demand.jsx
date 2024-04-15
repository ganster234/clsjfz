/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { Picker, Input, TextArea } from "antd-mobile";
import { message } from "antd";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import HeadNav from "../../components/haedNav/HeadNav";
import { getThaliList } from "../../api/thali";
import { setAddDeal } from "../../api/deal";

import "./Demand.less";

// 需求发布
export default function Demand() {
  const [visible, setVisible] = useState(false);
  const [packList, setPackList] = useState([]);
  const [value, setValue] = useState([]);
  const [state, setState] = useState({
    price: "", //项目单价
    num: "", //数量
    remark: "", //备注
  });
  useEffect(() => {
    const getPackList = async () => {
      let result = await getThaliList();
      message.destroy();
      if (result?.code === 200) {
        if (result?.data && result?.data?.appPriceList) {
          let list = result?.data?.appPriceList.map((item) => {
            let subItem = {
              ...item,
              label: item.appName,
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

  //添加需求
  const release = async () => {
    const { price, num, remark } = state;
    message.destroy();
    if (value && value.length <= 0) {
      return message.error("请选择项目");
    }
    if (!price) {
      return message.error("请输入项目单价");
    }
    if (!num) {
      return message.error("请输入");
    }
    message.open({
      type: "loading",
      content: "加载中..",
      duration: 0,
    });
    let result = await setAddDeal({
      price_id: value[0] + "",
      price,
      num,
      remark,
    });
    message.destroy();
    if (result?.code === 200) {
      setState({
        price: "", //项目单价
        num: "", //数量
        remark: "", //备注
      });
      setValue([]);
      message.success("发布成功");
    } else {
      message.error(result?.msg);
    }
  };

  const projectName = useMemo(() => {
    let itemName = "";
    if (packList && packList.length > 0) {
      packList[0].forEach((item) => {
        if (value[0] && item.id === value[0]) {
          itemName = item.appName;
        }
      });
    }
    return itemName;
  }, [JSON.stringify(value)]);

  const totalProject = useMemo(() => {
    let price = "";
    if (state?.price && state?.num) {
      price = state?.price * state?.num;
    }
    return price && price?.toFixed(2);
  }, [JSON.stringify(state)]);
  return (
    <LayoutPanel
      top={<HeadNav title={"需求发布"} hvh={52} />}
      content={
        <div className="demand-content">
          <div className="demand-state-box">
            <div className="demand-state-box-item">
              <span className="demand-state-title">
                <span className="demand-wildcard">*</span>
                <span>选择项目：</span>
              </span>
              <span
                className="demand-state-input"
                onClick={() => setVisible(true)}
              >
                {projectName || "请选择项目"}
              </span>
              <img
                src={require("../../assets/image/deal/select-project-icon.png")}
                alt=""
                className="demand-state-icon"
                onClick={() => setVisible(true)}
              />
            </div>
            <div className="demand-state-box-item">
              <span className="demand-state-title">
                <span className="demand-wildcard">*</span>
                <span>单价：</span>
              </span>
              <span className="demand-state-input">
                <Input
                  type={"number"}
                  placeholder="请输入项目单价"
                  value={state?.price}
                  onChange={(val) => {
                    setState((data) => ({ ...data, price: val }));
                  }}
                  clearable
                />
              </span>
            </div>
            <div className="demand-state-box-item">
              <span className="demand-state-title">
                <span className="demand-wildcard">*</span>
                <span>数量：</span>
              </span>
              <span className="demand-state-input">
                <Input
                  type={"number"}
                  placeholder="请输入数量"
                  value={state?.num}
                  onChange={(val) => {
                    setState((data) => ({ ...data, num: val }));
                  }}
                  clearable
                />
              </span>
            </div>
            <div className="demand-remark">备注：</div>
            <div className="demand-textArea">
              <TextArea
                placeholder="你可以这么说（急需500个王者荣耀账号）"
                value={state?.remark}
                onChange={(val) => {
                  setState((data) => ({ ...data, remark: val }));
                }}
                style={{
                  height: "100%",
                  background: "#F7F7F7",
                }}
              />
            </div>
          </div>
          <div className="demand-state-total">
            <div className="demand-state-total-item">
              <span className="demand-total-item-title">项目单价：</span>
              <span className="demand-total-item-price">
                ￥{state?.price || "0.00"}
              </span>
            </div>
            <div className="demand-state-total-item">
              <span className="demand-total-item-title">项目数量：</span>
              <span className="demand-total-item-price">
                {state?.num || "0.00"}
              </span>
            </div>
            <div className="demand-state-total-item">
              <span className="demand-total-item-title">项目总价：</span>
              <span className="demand-total-price">
                ￥{totalProject || "0.00"}
              </span>
            </div>
          </div>

          <Picker
            columns={packList}
            visible={visible}
            onClose={() => {
              setVisible(false);
            }}
            value={value}
            onConfirm={(v) => {
              setValue(v);
            }}
          />
        </div>
      }
      bottom={
        <div className="demand-release">
          <div className="demand-release-btn" onClick={() => release()}>
            发布
          </div>
        </div>
      }
    />
  );
}
