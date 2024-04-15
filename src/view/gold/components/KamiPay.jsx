import React from "react";

import "./KamiPay.less";

let kamiList = [
  {
    title: "10",
    key: "one",
  },
  {
    title: "100",
    key: "one_hundred",
  },
  {
    title: "200",
    key: "two_hundred",
  },
  {
    title: "500",
    key: "five__hundred",
  },
  {
    title: "1000",
    key: "one_thousand",
  },
];

export default function KamiPay({
  data,
  closePopup,
  totalMoney,
  changeKamiState,
}) {
  return (
    <div className="kami-pay">
      <div className="kami-pay-close" onClick={() => closePopup()}></div>
      <div className="kami-pay-title-box">
        <span className="kami-pay-title-total">总计：{totalMoney}</span>
        选择面额数量
        <img
          src={require("../../../assets/image/new-popup-back.png")}
          alt=""
          className="kami-pay-popup-back"
          onClick={() => closePopup()}
        />
      </div>
      {kamiList &&
        kamiList.map((item, index) => {
          return (
            <div className="kami-pay-modal-item" key={index}>
              <span className="kami-pay-modal-item-title">{item.title}元</span>
              <span className="kami-pay-modal-item-add-reduce">
                <img
                  src={require("../../../assets/image/gold/gold-reduce.png")}
                  alt=""
                  className="kami-pay-add-reduce-icon"
                  onClick={() => {
                    data[item.key] > 0 && changeKamiState(item.key, "");
                  }}
                />
                <span className="kami-pay-add-reduce-num">
                  {data[item.key]}
                </span>
                <img
                  src={require("../../../assets/image/gold/gold-add.png")}
                  alt=""
                  className="kami-pay-add-reduce-icon"
                  onClick={() => changeKamiState(item.key, "add")}
                />
              </span>
            </div>
          );
        })}

      <div className="kami-pay-popup-btn" onClick={() => closePopup()}>确定</div>
    </div>
  );
}
