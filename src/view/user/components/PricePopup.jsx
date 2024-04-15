import React, { useEffect, useState } from "react";
import { message, InputNumber, Spin, Select } from "antd";

import { getUserAll, getAddPrice } from "../../../api/user";
import { getProjectPackList } from "../../../api/project";

import "./PricePopup.less";

const { Option } = Select;
export default function PricePopup({ closePricePopup }) {
  const [userList, setUserList] = useState([]); //用户
  const [pack, setPack] = useState([]); //
  const [price, setPrice] = useState([]); //项目
  const [pricePopupLoading, setPricePopupLoading] = useState(false); //加载中
  const [state, setState] = useState({
    user_id: null, //
    price_id: null, //
    price: "",
    pack_id: null,
  });

  useEffect(() => {
    const getMessage = async () => {
      setPricePopupLoading(true);
      let result = await getUserAll();
      if (result?.code === 200) {
        setUserList([...result?.data]);
      }
      let resultProject = await getProjectPackList();
      const { code, data } = resultProject || {};
      if (code === 200) {
        if (data.pack && data.pack.length > 0) {
          setPack([...data.pack]);
        }
        if (data.price && data.price.length > 0) {
          setPrice([...data.price]);
        }
      }
      setPricePopupLoading(false);
    };
    getMessage();
  }, []);

  const priceSignBtn = async () => {
    const { user_id, price_id, price, pack_id } = state;
    if (!user_id) {
      return message.error("请选择账号");
    }
    if (!price_id) {
      return message.error("请选择项目");
    }
    if (!price) {
      return message.error("请输入价格");
    }
    if (!pack_id) {
      return message.error("请选择类型");
    }
    let parma = {
      pack_id: pack_id + "",
      price_id: price_id + "",
      user_id: user_id + "",
      price: price + "",
      type: "0",
    };
    setPricePopupLoading(true);
    let result = await getAddPrice(parma);
    if (result.code === 200) {
      message.success("添加成功");
      setPricePopupLoading(false);
      closePricePopup();
    } else {
      message.destroy();
      message.error(result?.msg);
    }
    setPricePopupLoading(false);
  };
  return (
    <div className="price-popup">
      <Spin spinning={pricePopupLoading}>
        <div className="price-popup-top-back"></div>
        <div className="price-popup-title">
          新增用户价格管理
          <img
            src={require("../../../assets/image/popup-back.png")}
            alt=""
            className="price-popup-title-back-icon"
          />
        </div>
        <div className="price-popup-title-message">
          <div>通过设置，可针对性控制单个用户看到该项目时的价格。</div>
          <div>点击该用户配置-筛选项目-选择类型-点击保存即可。</div>
        </div>
        <div className="price-popup-item">
          <span className="price-popup-item-left">用户：</span>
          <span className="price-popup-item-content">
            <Select
              value={state?.user_id}
              style={{ height: "35px", fontSize: "16px" }}
              placeholder="请选择用户"
              showSearch
              bordered={false}
              filterOption={(inputValue, option) =>
                option.children
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
              allowClear
              onChange={(even) => {
                setState((item) => ({ ...item, user_id: even }));
              }}
            >
              {userList &&
                userList.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.account}
                    </Option>
                  );
                })}
            </Select>
            {/* <span
              className="price-popup-content-text"
              onClick={() => setPricePopupVisible(true)}
            >
              请选择用户
            </span> */}
            {/* <img
              src={require("../../../assets/image/right-bottom.png")}
              alt=""
              className="price-popup-right-bottom-icon"
              onClick={() => setPricePopupVisible(true)}
            /> */}
          </span>
        </div>
        <div className="price-popup-item">
          <span className="price-popup-item-left">项目：</span>
          <span className="price-popup-item-content">
            <Select
              value={state?.price_id}
              style={{ height: "35px" }}
              placeholder="请选择项目"
              showSearch
              bordered={false}
              filterOption={(inputValue, option) =>
                option.children
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
              allowClear
              onChange={(even) => {
                setState((item) => ({ ...item, price_id: even }));
              }}
            >
              {price &&
                price.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.app_name}
                    </Option>
                  );
                })}
            </Select>
            {/* <span className="price-popup-content-text">请选择项目</span>
            <img
              src={require("../../../assets/image/right-bottom.png")}
              alt=""
              className="price-popup-right-bottom-icon"
            /> */}
          </span>
        </div>
        <div className="price-popup-item">
          <span className="price-popup-item-left">单价：</span>
          <span className="price-popup-item-content">
            <span
              style={{
                fontSize: "12px",
                fontFamily: "PingFang SC-Bold, PingFang SC",
                color: "#323233",
                paddingBottom: "3px",
              }}
            >
              ￥
            </span>
            <InputNumber
              value={state?.price}
              style={{ height: "35px", width: "100px" }}
              min={1}
              max={10}
              placeholder="请设置金额"
              bordered={false}
              onChange={(even) => {
                setState((item) => ({ ...item, price: even }));
              }}
            />
            {/* <span className="price-popup-content-text"></span> */}
            <span className="price-popup-right-bottom-icon"></span>
          </span>
        </div>
        <div className="price-popup-item">
          <span className="price-popup-item-left">类型：</span>
          <span className="price-popup-item-content">
            <Select
              value={state?.pack_id}
              style={{ height: "35px" }}
              placeholder="请选择项目"
              filterOption={(inputValue, option) =>
                option.children
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
              bordered={false}
              showSearch
              allowClear
              onChange={(even) => {
                setState((item) => ({ ...item, pack_id: even }));
              }}
            >
              {pack &&
                pack.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
            {/* <span className="price-popup-content-text">请选择类型</span>
            <img
              src={require("../../../assets/image/right-bottom.png")}
              alt=""
              className="price-popup-right-bottom-icon"
            /> */}
          </span>
        </div>
        <div className="price-popup-sign-btn" onClick={() => priceSignBtn()}>
          确定
        </div>
      </Spin>
    </div>
  );
}
