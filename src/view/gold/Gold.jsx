import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import { Picker, Input, Popup, NoticeBar } from "antd-mobile";
import useAppStore from "../../store";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import KamiPay from "./components/KamiPay";
import { getUser } from "../../api/user";
import { getDownload } from "../../api/home";
import { payprice } from "../../api/count";
import {
  getPayUsdt,
  getCard,
  setPayMoney,
  getPayStatus,
} from "../../api/recharge";

import "./Gold.less";

// const goldColumns = [
//   { label: "支付宝支付", value: "wexin" },
//   { label: "微信支付", value: "wCHaPay" },
//   { label: "USTD支付", value: "ustd" },
//   // { label: "USTD扫码支付", value: "ustdsao" },
//   { label: "卡密充值", value: "kami" },
//   { label: "购买卡密", value: "kamiPay" },
// ];

let times = null; //定时器

// 充值
export default function Gold() {
  const [rechargeList, setrechargeList] = useState([]); //充值金额

  const [goldColumns, setGoldColumns] = useState([]); //充值数据
  const navigate = useNavigate();
  const userInfo = useAppStore((state) => state.userInfo); //用户信息
  const Userid = sessionStorage.getItem("user");

  const setUserInfo = useAppStore((state) => state.setState); //设置用户信息
  //充值状态，noPay(未充值)，pay(充值中)，payOk(充值成功)，payCareful(ustd充值成功的状态)
  const [rechargeStatus, setRechargeStatus] = useState("noPay");
  const [showGoldWay, setShowGoldWay] = useState(false); //显示充值选项
  const [goldWay, setGoldWay] = useState(""); //充值选项选中的值
  const [kamiValue, setKamiValue] = useState(""); //卡密值
  const [goldLoading, setGoldLoading] = useState(false); //加载中
  const [activeMoney, setActiveMoney] = useState("100");
  const [wexinOpen, setWexinOpen] = useState(false); //微信充值二维码弹窗
  const [wexinSrc, setWexinSrc] = useState(""); //微信支付二维码
  const [kamiPayShow, setKamiPayShow] = useState(false); //显示购买卡密的金额popup
  const [Topupaccount, setTopupaccount] = useState(""); //充值账户
  const [customer, setcustomer] = useState({}); //客服
  const [postElection, setpostElection] = useState({}); //支付方式选中后
  const [kamiState, setKamiState] = useState({
    //购买卡密
    one: 0,
    one_hundred: 0,
    two_hundred: 0,
    five__hundred: 0,
    one_thousand: 0,
  });

  useEffect(() => {
    getDownload().then((res) => {
      if (res.code === "200") {
        setcustomer(res.data);
        console.log(userInfo, "userInfo");
      }
    });
    payprice({ State: "0" }).then((result) => {
      console.log(result, "result");
      if (result?.code === "200") {
        const filteredArray = result.data.map((item) => ({
          label: item.Device_name,
          value:
            item.Device_type === "wxpay"
              ? "wCHaPay"
              : item.Device_type === "alipay"
              ? "wexin"
              : item.Device_type === "usdt"
              ? "ustd"
              : item.Device_type,
          ...item,
        }));
        setGoldColumns(filteredArray);
      }
    });
  }, []);
  //计算支付方式
  const goldTitle = useMemo(() => {
    let title = "";
    let index = goldColumns.findIndex((item) => item.value === goldWay);
    if (index !== -1) {
      title = goldColumns[index].label;
      setActiveMoney("100");
      setKamiState({
        one: 0,
        one_hundred: 0,
        two_hundred: 0,
        five__hundred: 0,
        one_thousand: 0,
      });
    }
    return title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goldWay]);

  const recharge = () => {
    if (goldWay === "ustd") {
      rechargeUstd();
    } else if (goldWay === "kami") {
      payCardBtn();
    } else if (
      goldWay === "wexin" ||
      goldWay === "wCHaPay" ||
      goldWay === "yuansheng" ||
      goldWay === "wechat" ||
      goldWay === "baoge"
    ) {
      rechargeMoney();
    } else if (goldWay === "kamiPay") {
      purchaseKami();
    } else if (goldWay === "ustdsao") {
      geUstdsao();
    }
  };

  //发起订单，返回的是支付二维码,对接完成
  const rechargeMoney = async () => {
    setGoldLoading(true);
    const prams = {
      Usersid: Userid,
      Username: userInfo.Device_name,
      Num: "1",
      Money: activeMoney + "",
      Btmoney: "显示" + activeMoney,
      Code: "",
      Type: postElection.Device_type,
    };
    let result = await setPayMoney(prams);
    // let result = await setPayMoney({
    //   title: `充值${activeMoney}元`,
    //   price: activeMoney + "",
    //   num: 1,
    //   type: postElection.pay_type, //w    1  微信支付 2 支付宝
    // });
    // const { code, data, msg } = result || {};
    const { code, orderId, orderurl, msg } = result || {};

    message.destroy();
    if (code === 200) {
      setWexinSrc(decodeURIComponent(orderurl));
      setWexinOpen(true);
      setGoldLoading(false);
      //调起轮询
      times = setInterval(() => {
        // checkStatus(data?.order_id);
        checkStatus(orderId);
      }, 1000);
    } else {
      message.error(msg);
    }
  };

  //轮循订单
  const checkStatus = (order_id) => {
    getPayStatus({ Sid: order_id, Type: postElection.Device_type }).then(
      (result) => {
        if (result?.code === "200") {
          clearInterval(times);
          setWexinOpen(false);
          setRechargeStatus("payOk");
          setWexinSrc("");
          setKamiState({
            one: 0,
            one_hundred: 0,
            two_hundred: 0,
            five__hundred: 0,
            one_thousand: 0,
          });
          message.success("支付成功");
          //更新本地数据
          getUserInfo();
        }
      }
    );
  };

  const geUstdsao = () => {
    //USTD扫码支付
    console.log("U扫码~");
  };

  // ustd充值,对接完成
  const rechargeUstd = async () => {
    message.destroy();
    if (!activeMoney) {
      return message.error("请选择充U金额");
    }
    if (!Topupaccount) {
      return message.error("请输入充U账户");
    }
    // if (Topupaccount.length < 20 || Topupaccount.length > 60) {
    //   return message.error("充U账户输入范围20-60字符之间");
    // }
    setGoldLoading(true);
    const prams = {
      Usersid: Userid,
      Username: userInfo.Device_name,
      Num: "1",
      Money: activeMoney,
      Btmoney: "显示" + activeMoney,
      Code: Topupaccount,
      Type: postElection.Device_type,
    };
    let result = await getPayUsdt(prams);

    // let result = await getPayUsdt({
    //   price: activeMoney,
    //   num: 1,
    //   addr: Topupaccount,
    // });
    if (result?.code === 200) {
      message.success("提交成功，请等待审核");
      setActiveMoney("100");
      setGoldLoading(false);
      setRechargeStatus("payCareful");
      //更新本地数据
      getUserInfo();
    } else {
      message.error(result?.msg);
    }
    setGoldLoading(false);
  };
  //卡密充值,对接完成
  const payCardBtn = async () => {
    if (!kamiValue) {
      return message.error("请输入卡密");
    }
    setGoldLoading(true);
    let result = await getCard({ card: kamiValue });
    if (result.code === 200) {
      message.success("充值成功");
      setKamiValue("");
      //更新本地数据
      getUserInfo();
    } else {
      message.error(result?.msg);
    }
    setGoldLoading(false);
  };

  //购买卡密
  const purchaseKami = async () => {
    if (!totalMoney) {
      return message.error("请选择购买卡密");
    }
    setGoldLoading(true);
    let result = await setPayMoney({
      title: `购买卡密`,
      price: totalMoney + "",
      num: 1,
      card: JSON.stringify({
        ...kamiState,
      }),
    });
    // const { code, data, msg } = result || {};
    const { code, orderurl, orderId, msg } = result || {};

    message.destroy();
    if (code === 200) {
      // setWexinSrc(data?.img);
      setWexinSrc(decodeURIComponent(orderurl));
      setWexinOpen(true);
      setGoldLoading(false);
      //调起轮询
      times = setInterval(() => {
        // checkStatus(data?.order_id);
        checkStatus(orderId);
      }, 1000);
    } else {
      message.error(msg);
    }
    setGoldLoading(false);
  };

  const closeModal = () => {
    clearInterval(times); //关闭弹窗，取消定时器，取消订单
    setActiveMoney("100");
    setWexinSrc("");
    setWexinOpen(false);
  };

  // 获取用户信息
  const getUserInfo = async () => {
    let result = await getUser({ Sid: Userid });
    const { code, data, msg } = result || {};
    if (code) {
      setUserInfo(data[0]);
    } else {
      message.destroy();
      message.open({
        type: "error",
        content: msg,
      });
    }
  };

  //面额数量
  const totalNum = useMemo(() => {
    let price = 0;
    const { one, one_hundred, two_hundred, five__hundred, one_thousand } =
      kamiState;
    price =
      Number(one) +
      Number(one_hundred) +
      Number(two_hundred) +
      Number(five__hundred) +
      Number(one_thousand);
    return price;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(kamiState)]);
  //购买卡密总价
  const totalMoney = useMemo(() => {
    let price = 0;
    const { one, one_hundred, two_hundred, five__hundred, one_thousand } =
      kamiState;
    price =
      Number(one) * 10 +
      Number(one_hundred) * 100 +
      Number(two_hundred) * 200 +
      Number(five__hundred) * 500 +
      Number(one_thousand) * 1000;
    return price.toFixed(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(kamiState)]);

  const closePopup = () => {
    setKamiPayShow(false);
  };

  const changeKamiState = (keyName, str) => {
    setKamiState((item) => ({
      ...item,
      [keyName]: str ? kamiState[keyName] + 1 : kamiState[keyName] - 1,
    }));
  };
  const filters = (item) => {
    if (postElection) {
      const newArr = [...postElection.price_add].filter((el) => {
        return el.Device_money === item;
      });
      return newArr.length > 0 ? newArr[0].add : 0;
    }
  };
  return (
    <>
      <LayoutPanel
        top={
          <div className="gold-top">
            <span className="gold-top-back-box">
              <img
                src={require("../../assets/image/back-icon.png")}
                alt=""
                className="gold-top-back"
                onClick={() => navigate(-1)}
              />
            </span>
            充值
          </div>
        }
        content={
          <div
            className="gold-content"
            style={{
              background: rechargeStatus !== "noPay" && "#fff",
              borderTop: rechargeStatus !== "noPay" && "1px solid #F7F7F7",
            }}
          >
            <NoticeBar
              content={`若充值出现任何问题可联系客服处理 ------${customer.telegram}`}
              color="alert"
            />
            {rechargeStatus === "noPay" && (
              <>
                <Spin spinning={goldLoading}>
                  <div className="account-massage">
                    <div className="account-massage-item account-massage-item-bottom-border">
                      账号名称：
                      <span className="account-massage-item-text">
                        {userInfo?.Device_name || "用户--"}
                      </span>
                    </div>
                    <div className="account-massage-item account-massage-item-bottom-border">
                      当前余额：
                      <span className="account-massage-item-text">
                        {userInfo?.Device_money || "0.00"}
                      </span>
                    </div>
                    <div className="account-massage-item ">
                      支付方式：
                      <span
                        className="account-massage-item-text"
                        onClick={() => setShowGoldWay(true)}
                      >
                        <span>{goldTitle}</span>
                        <img
                          src={require("../../assets/image/right-bottom.png")}
                          alt=""
                          className="account-massage-item-text-icon"
                        />
                      </span>
                    </div>
                  </div>
                  {postElection.remark ? (
                    <NoticeBar
                      content={`温馨提示：${postElection.remark}`}
                      color="info"
                    />
                  ) : (
                    <></>
                  )}
                  <div className="gold-main-box">
                    {(goldWay === "wexin" ||
                      goldWay === "wCHaPay" ||
                      goldWay === "yuansheng" ||
                      goldWay === "wechat" ||
                      goldWay === "baoge") && (
                      <>
                        <div className="gold-main-title">充值金额</div>
                        <div className="gold-main-money-box">
                          {rechargeList.map((item, index) => {
                            return (
                              <div
                                className="gold-main-money-item"
                                style={{
                                  color: activeMoney === item && "#F32243",
                                  border:
                                    activeMoney === item && "1px solid #F32243",
                                  background: activeMoney === item && "#FFEEEB",
                                }}
                                key={index}
                                onClick={() => setActiveMoney(item)}
                              >
                                <div>{item}</div>
                                <div
                                  className="gold-main-money-price"
                                  style={{
                                    color: activeMoney === item && "#F32243",
                                  }}
                                >
                                  当前售价：{item}元
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                    {goldWay === "ustd" && (
                      <>
                        <div className="gold-ustd-regard">
                          <img
                            src={require("../../assets/image/ustd-regard.png")}
                            alt=""
                            className="gold-ustd-regard-icon"
                          />
                          <span>
                            请在钱包向收款账户转账充U金额，打款
                            成功后24小时内充值成功。
                            <span style={{ color: "red" }}>
                              （USDT汇率：{userInfo?.Device_hl || ""}）
                            </span>
                          </span>
                        </div>
                        <div className="gold-collection-account">
                          <div className="gold-collection-title">收U账户：</div>
                          <div style={{ width: "76%", wordWrap: "break-word" }}>
                            {postElection?.Device_url}
                            {/* {Topupaccount.length > 20
                              ? userInfo?.wallet
                              : "请输入正确打U账户与选择充U金额"} */}
                          </div>
                        </div>
                        <div className="gold-collection-account">
                          <div className="gold-collection-title">
                            交易单号：
                          </div>
                          <div
                            style={{
                              borderBottom: " 1px solid #e5e5e6",
                              padding: "10px 0",
                            }}
                            className="gold-collection-account-text"
                          >
                            <Input
                              clearable
                              value={Topupaccount}
                              style={{
                                flex: 1,
                                "--placeholder-color": "#999999",
                                "--font-size": "15px",
                              }}
                              placeholder="请输入交易单号"
                              onChange={(even) => setTopupaccount(even)}
                            />
                          </div>
                        </div>
                        <p
                          style={{
                            color: "red",
                            marginTop: "18px",
                          }}
                        >
                          温馨提示：提交转U金额，必须和真实的转U金额一致，否则该订单作废。请谨慎操作！
                        </p>
                        <div className="gold-ustd-title">充U金额：</div>
                        <div className="gold-main-money-box gold-ustd-input-box">
                          {rechargeList.map((item, index) => {
                            return (
                              <div
                                className="gold-main-money-item"
                                style={{
                                  color: activeMoney === item && "#F32243",
                                  border:
                                    activeMoney === item && "1px solid #F32243",
                                  background: activeMoney === item && "#FFEEEB",
                                }}
                                key={index}
                                onClick={() => setActiveMoney(item)}
                              >
                                <div>{item}</div>
                                {/* <div
                                  className="gold-main-money-price"
                                  style={{
                                    color: activeMoney === item && "#F32243",
                                  }}
                                >
                                  {goldWay === "ustd"
                                    ? `充值赠送：${filters(item)}u`
                                    : `当前售价：${item}元`}
                                </div> */}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                    {goldWay === "kami" && (
                      <>
                        <div className="gold-main-title">卡密支付</div>
                        <div className="gold-main-kami-input">
                          <Input
                            value={kamiValue}
                            style={{
                              flex: 1,
                              "--placeholder-color": "#999999",
                              "--font-size": "15px",
                            }}
                            placeholder="请输入卡密"
                            onChange={(even) => setKamiValue(even)}
                          />
                        </div>
                      </>
                    )}
                    {goldWay === "kamiPay" && (
                      <>
                        <div className="gold-main-title">卡密面额</div>
                        <div className="gold-main-item-kamiPay">
                          面额数量：
                          <span
                            className="gold-main-item-kamiPay-content"
                            onClick={() => setKamiPayShow(true)}
                          >
                            <span>
                              {totalMoney > 0 ? totalMoney : "请选择面额"}
                            </span>
                            <img
                              src={require("../../assets/image/right-bottom.png")}
                              alt=""
                              className="gold-main-item-kamiPay-icon"
                            />
                          </span>
                        </div>
                        <div className="gold-main-item-kamiPay">
                          面额数量：
                          <span className="gold-item-kamiPay-content">
                            {totalNum || 0}
                          </span>
                        </div>
                      </>
                    )}
                    {goldWay === "ustd" ? (
                      Topupaccount.length > 20 ? (
                        <div
                          className="gold-bottom-btn"
                          onClick={() => recharge()}
                        >
                          立即充值
                        </div>
                      ) : (
                        <></>
                      )
                    ) : (
                      <div
                        className="gold-bottom-btn"
                        onClick={() => recharge()}
                      >
                        立即充值
                      </div>
                    )}

                    {/* <div className="gold-bottom-btn" onClick={() => recharge()}>
                      立即充值
                    </div> */}
                    <div
                      className="gold-record"
                      onClick={() => navigate("/mobile/recharge")}
                    >
                      充值记录
                    </div>
                    <div
                      className="gold-record"
                      onClick={() => navigate("/mobile/usdt")}
                    >
                      充U记录
                    </div>
                    <div className="gold-regard">
                      注：充值金额只能用于平台消费。
                    </div>
                  </div>
                </Spin>
                <Popup
                  visible={kamiPayShow}
                  destroyOnClose
                  onMaskClick={() => {
                    setKamiPayShow(false);
                  }}
                  onClose={() => {
                    setKamiPayShow(false);
                  }}
                  bodyStyle={{
                    height: "55vh",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                >
                  <KamiPay
                    data={kamiState}
                    closePopup={closePopup}
                    totalMoney={totalMoney}
                    changeKamiState={changeKamiState}
                  />
                </Popup>
                <Picker
                  columns={[goldColumns]}
                  visible={showGoldWay}
                  onClose={() => {
                    setShowGoldWay(false);
                  }}
                  value={[goldWay]}
                  onConfirm={(v, selection) => {
                    if (v[0] === "pay_kami") {
                      const payKmurl = goldColumns.filter((item) => {
                        return item.value === "pay_kami";
                      });
                      if (payKmurl[0].url) {
                        window.open(payKmurl[0].url);
                      } else {
                        message.error("此功能暂未开放请联系管理员");
                      }
                    } else {
                      console.log(selection.items[0], "确认了");
                      setpostElection(selection.items[0]);
                      if (selection.items[0].Device_money) {
                        const arr = selection.items[0].Device_money.split(",");
                        console.log(arr, "arrarr");

                        setrechargeList(arr);
                      }
                      setGoldWay(v[0]);
                    }
                  }}
                />
              </>
            )}
            {(rechargeStatus === "payOk" ||
              rechargeStatus === "payCareful") && (
              <>
                <div className="gold-pay-careful">
                  <img
                    src={
                      rechargeStatus === "payOk"
                        ? require("../../assets/image/success-icon.png")
                        : require("../../assets/image/ustd-screen-icon.png")
                    }
                    alt=""
                    className="gold-pay-careful-icon"
                  />
                  <div
                    className="gold-pay-careful-text"
                    style={{
                      color: rechargeStatus === "payOk" ? "#FF7B00" : "#F54F4F",
                    }}
                  >
                    {rechargeStatus === "payOk"
                      ? "支付完成!"
                      : "提交审核中！预计24小时内到账"}
                  </div>
                  <div
                    className="gold-pay-careful-btn"
                    onClick={() => navigate("/mobile/recharge")}
                  >
                    查看充值记录
                  </div>
                </div>
              </>
            )}
            <Popup
              visible={wexinOpen}
              onMaskClick={() => {
                closeModal();
              }}
              onClose={() => {
                closeModal();
              }}
              position="top"
            >
              <div style={{ padding: "25px " }} className="gold-wexin-modal">
                <img src={wexinSrc} alt="" className="gold-wexin-modal-src" />
                <div className="wexin-modal-payment-title">
                  {postElection.Device_name}
                  <span style={{ color: "#F32517" }}>
                    ￥
                    {goldWay === "wexin" ||
                    goldWay === "wCHaPay" ||
                    goldWay === "yuansheng" ||
                    goldWay === "wechat" ||
                    goldWay === "baoge"
                      ? activeMoney
                      : totalMoney}
                  </span>
                </div>
                <div className="wexin-modal-title">
                  打开相关APP, 选择【扫一扫】功能
                </div>
                <div className="wexin-modal-title">
                  用屏幕中的框对准下方的二维码进行扫码支付
                </div>
              </div>
            </Popup>
          </div>
        }
      />
    </>
  );
}
