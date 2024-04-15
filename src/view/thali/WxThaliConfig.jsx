/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { Spin, message, Radio } from "antd";
import { Stepper, Picker } from "antd-mobile";
import useAppStore from "../../store";
// import { useNavigate } from "react-router-dom";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import ThaliConfigTop from "./components/ThaliConfigTop";
import { getPackDetail, getPlaceOrder } from "../../api/thali";

import "./ThaliConfig.less";

// 在改图
export default function ThaliConfig() {
  //   const navigate = useNavigate();
  const setThaliInfo = useAppStore((state) => state.setState); //设置套餐详情
  const thaliInfo = useAppStore((state) => state.thaliInfo); //套餐详情
  // const userInfo = useAppStore((state) => state.userInfo); //套餐详情

  const [scanOpenShow, setScanOpenShow] = useState("1");

  const [configLpading, setConfigLoading] = useState(false); //加载
  const [weeklyCardShow, setWeeklyCardShow] = useState(false); //选中周卡的15级号
  const [state, setState] = useState({
    thaliDetail: {}, //套餐detail
    basicShow: false, //显示picker
    basicColumns: [], //日卡周卡数组
    activeThali: [], //选中的日卡周卡
    packageNum: 0, //套餐数量
    insureShow: false,
    insureValue: [true], //是否购买保险true-购买，flase-不购买
    insureNum: 0, //保险份数,最大份数是3
    insureColumns: [
      [
        { label: "购买", value: true },
        { label: "不购买", value: false },
      ],
    ],
  });

  // 获取项目详情
  const getDetail = async () => {
    const { wx_app_id, id } = thaliInfo;
    if (!wx_app_id && !id) {
      return;
    }
    setConfigLoading(true);
    let result = await getPackDetail({
      price_id: id,
      app_id: wx_app_id,
      is_qq: 2,
    });
    const { code, data, msg } = result || {};
    message.destroy();
    if (code === 200) {
      let valueList =
        data.pack_id &&
        data.pack_id.map((item) => {
          let subItem = {
            ...item,
            label: item?.name,
            value: item?.package_id,
          };
          return subItem;
        });
      //初始化
      setState((item) => ({
        ...item,
        thaliDetail: data,
        basicColumns: [valueList],
      }));
    } else {
      message.error(msg);
    }
    setConfigLoading(false);
  };

  useEffect(() => {
    getDetail();
    return () => {
      setThaliInfo({}, "thaliInfo");
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // const activeWeeklyCard = useMemo(() => {
  //   let show = null;
  //   const { activeThali, basicColumns } = state;
  //   if (activeThali[0] && basicColumns[0] && basicColumns[0].length > 0) {
  //     let index =
  //       basicColumns[0] &&
  //       basicColumns[0].findIndex((item) => item.value === activeThali[0]);
  //     if (index !== -1 && basicColumns[0][index].label) {
  //       if (basicColumns[0][index].package_id === 10001) {
  //         show = "信用分大于等于300";
  //       } else if (basicColumns[0][index].package_id === 10013) {
  //         show = "信用分大于等于300,该账号只有您单独使用";
  //       }
  //     }
  //   }
  //   return show;
  // }, [state.activeThali]);

  //套餐名字
  const packageName = useMemo(() => {
    let num = "选择套餐";
    const { activeThali, basicColumns } = state;
    if (activeThali[0] && basicColumns[0] && basicColumns[0].length > 0) {
      let index =
        basicColumns[0] &&
        basicColumns[0].findIndex((item) => item.value === activeThali[0]);
      if (index !== -1 && basicColumns[0][index].label) {
        num = basicColumns[0][index].label;
      }
    }

    return num;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeThali]);

  // 库存数量
  const inventoryNum = useMemo(() => {
    let num = 0;
    const { activeThali, basicColumns } = state;
    if (activeThali[0] && basicColumns[0] && basicColumns[0].length > 0) {
      let index =
        basicColumns[0] &&
        basicColumns[0].findIndex((item) => item.value === activeThali[0]);
      if (index !== -1 && basicColumns[0][index].availableNum) {
        num = basicColumns[0][index].availableNum;
      }
    }
    return num;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeThali]);

  //日卡周卡价格
  const singlePrice = useMemo(() => {
    let num = 0.0;
    const { activeThali, basicColumns } = state;
    if (activeThali[0] && basicColumns[0] && basicColumns[0].length > 0) {
      let index =
        basicColumns[0] &&
        basicColumns[0].findIndex((item) => item.value === activeThali[0]);
      if (index !== -1 && basicColumns[0][index].price) {
        num = basicColumns[0][index].price;
      }
    }
    return num;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeThali]);

  //套餐总价
  const packTotal = useMemo(() => {
    let totalPrice = 0;
    if (state.packageNum && singlePrice) {
      totalPrice = Number(state.packageNum) * Number(singlePrice);
    }
    return totalPrice.toFixed(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.packageNum, singlePrice]);

  // //保险单价
  // const insureSinglePrice = useMemo(() => {
  //   let price = 0.0;
  //   if (
  //     state?.insureValue &&
  //     state?.insureValue[0] &&
  //     userInfo &&
  //     userInfo?.insure
  //   ) {
  //     price = Number(singlePrice) * Number(userInfo?.insure);
  //   }
  //   return price.toFixed(2);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [singlePrice, JSON.stringify(state?.insureValue)]);

  // //保险总价
  // const insureTotalPrice = useMemo(() => {
  //   let price = 0.0;
  //   if (
  //     state?.insureValue &&
  //     state?.insureValue[0] &&
  //     insureSinglePrice &&
  //     state.insureNum &&
  //     state.packageNum
  //   ) {
  //     price =
  //       Number(insureSinglePrice) *
  //       Number(state.packageNum) *
  //       Number(state?.insureNum);
  //   }
  //   return price.toFixed(2);
  // }, [
  //   insureSinglePrice,
  //   JSON.stringify(state?.insureValue),
  //   state?.packageNum,
  //   state.insureNum,
  // ]);

  //总价（套餐加保险）
  const totalPrice = useMemo(() => {
    let price = 0.0;
    // if (packTotal && insureTotalPrice) {
    //   price = Number(insureTotalPrice) + Number(packTotal);
    // }
    // 没有保险的，保险在第二版本上线
    if (packTotal) {
      // activeWeeklyCard &&
      if (weeklyCardShow && thaliInfo.id === 317) {
        price = Number(packTotal) + state?.packageNum;
      } else {
        price = Number(packTotal);
      }
    }
    return price.toFixed(2);
  }, [packTotal, weeklyCardShow]); //insureTotalPrice

  // 判断是不是周卡或者是月卡，只有周卡或者是月卡才有保险
  const confirmBasic = (v) => {
    const { basicColumns } = state;
    if (basicColumns[0] && basicColumns[0].length > 0) {
      let index =
        basicColumns[0] &&
        basicColumns[0].findIndex((item) => v[0] === item?.value);
      if (
        index !== -1 &&
        (basicColumns[0][index].value === 10001 ||
          basicColumns[0][index].value === 10002)
      ) {
        setState((item) => ({
          ...item,
          activeThali: v,
          packageNum: 1,
          insureValue: [true],
        }));
      } else {
        setState((item) => ({
          ...item,
          activeThali: v,
          packageNum: 1,
          insureValue: [false],
        }));
      }
    }
  };

  //下单
  const placeOrder = async () => {
    const { thaliDetail, activeThali, packageNum } = state;
    message.destroy();
    if (!thaliDetail.id) {
      return;
    }
    if (!activeThali || !activeThali[0]) {
      return message.error("请选择套餐");
    }
    if (!packageNum) {
      return message.error("请填写下单份数");
    }
    // if (insureValue[0] && !insureNum) {
    //   return message.error("请填写保险倍数");
    // }
    // if (!insureSinglePrice) {
    //   return;
    // }
    // scanOpenShow 1:扫码 2:小程序
    let param = {
      priceId: thaliDetail?.id + "", //项目id
      packageId: activeThali[0] + "", //套餐id
      count: packageNum + "", //下单数量
      is_insure: "0", //0不投保 1投保
      is_fifteen: weeklyCardShow ? "1" : "0",
      is_type: scanOpenShow,
      is_qq: 2,
    };
    if (
      thaliInfo.id === 317 &&
      (activeThali[0] === 10001 || activeThali[0] === 10013)
    ) {
      param.weeklyCardShow = 1;
    }
    setConfigLoading(true);
    let result = await getPlaceOrder(param);
    if (result?.code === 200) {
      message.success("支付成功");
      setState((item) => ({
        ...item,
        basicShow: false, //显示picker
        activeThali: [], //选中的日卡周卡
        packageNum: 0, //套餐数量
        insureShow: false,
        insureValue: [true], //是否购买保险true-购买，flase-不购买
        insureNum: 0, //保险份数,最大份数是3
        insureColumns: [
          [
            { label: "购买", value: true },
            { label: "不购买", value: false },
          ],
        ],
      }));
    } else {
      message.error(result?.msg || "支付失败请稍后再试");
    }
    setConfigLoading(false);
  };
  return (
    <LayoutPanel
      top={<ThaliConfigTop />}
      content={
        <div className="thali-config-content">
          <Spin spinning={configLpading}>
            <div className="thail-config-icon-box">
              <img
                src={state?.thaliDetail?.logo_path}
                alt=""
                className="thail-config-icon"
              />
            </div>
            <div className="thail-package-all">
              <div className="package-all-title">
                {state?.thaliDetail && state?.thaliDetail?.app_name}
              </div>
              <div className="package-all-select-box">
                <div className="package-all-select-item">
                  <span>当前套餐：</span>
                </div>
                <div
                  className="package-all-select"
                  onClick={() => {
                    setWeeklyCardShow(false);
                    setState((item) => ({ ...item, basicShow: true }));
                  }}
                >
                  <span>{packageName}</span>
                  <img
                    src={require("../../assets/image/right-back-icon.png")}
                    alt=""
                    className="package-all-select-icon"
                  />
                </div>
              </div>
              {/* {activeWeeklyCard && (
                <div className="thail-package-all-item">
                  <div
                    className="package-detail-title"
                    style={{ color: "red" }}
                  >
                    {activeWeeklyCard}
                  </div>
                </div>
              )} */}

              <div className="thail-package-all-item">
                <div className="package-detail-title">套餐详情：</div>
              </div>
              <div className="thail-package-all-item">
                <div className="package-item-left">类型：</div>
                <div
                  className="package-item-right"
                  style={{
                    color: "#212121",
                  }}
                >
                  <Radio.Group
                    onChange={(even) => {
                      setScanOpenShow(even.target.value);
                    }}
                    value={scanOpenShow}
                  >
                    <Radio value={"1"}>扫码</Radio>
                    <Radio value={"2"}>小程序</Radio>
                  </Radio.Group>
                </div>
              </div>
              {/* activeWeeklyCard && */}
              {thaliInfo.id === 317 && (
                <div className="thail-package-all-item">
                  <div className="package-item-left">等级：</div>
                  <div
                    className="package-item-right"
                    style={{
                      color: "#212121",
                    }}
                  >
                    <Radio.Group
                      onChange={(even) => setWeeklyCardShow(even.target.value)}
                      value={weeklyCardShow}
                    >
                      <Radio value={true}>15级</Radio>
                      <Radio value={false}>无等级要求</Radio>
                    </Radio.Group>
                  </div>
                </div>
              )}

              <div className="thail-package-all-item">
                <div className="package-item-left">库存：</div>
                <div
                  className="package-item-right"
                  style={{
                    color: "#212121",
                  }}
                >
                  {inventoryNum}
                </div>
              </div>
              <div className="thail-package-all-item">
                <div className="package-item-left">价格：</div>
                <div className="package-item-right">{singlePrice}</div>
              </div>
              <div className="thail-package-all-item">
                <div className="package-item-left">总价：</div>
                <div className="package-item-right">{packTotal}</div>
              </div>
              <div
                className="thail-package-all-item"
                style={{ marginTop: "18px" }}
              >
                <div className="package-item-left">数量：</div>
                <Stepper
                  value={state?.packageNum}
                  min={1}
                  digits={0}
                  onChange={(value) => {
                    setState((item) => ({ ...item, packageNum: value }));
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
            </div>
            {/* 保险先不上，后面稳定了才上线 */}
            {/* <div className="thail-package-insure">
              <div className="thail-package-insure-title">交易安全险</div>
              <div className="thail-insure-item">
                <span className="thail-insure-item-left">是否购买：</span>
                <span className="thail-insure-content">须知条款</span>
                <span
                  className="thail-insure-item-right thail-insure-item-right-color"
                  onClick={() =>
                    setState((item) => ({ ...item, insureShow: true }))
                  }
                >
                  <span>{state?.insureValue[0] ? "是" : "否"}</span>
                  <img
                    src={require("../../assets/image/right-back-icon.png")}
                    alt=""
                    className="thail-insure-right-icon"
                  />
                </span>
              </div>
              <div className="thail-insure-item">
                <span className="thail-insure-item-left">价格：</span>
                <span className="thail-insure-item-right thail-insure-item-right-red">
                  {insureSinglePrice}
                </span>
              </div>
              <div className="thail-insure-item">
                <span className="thail-insure-item-left">总价：</span>
                <span className="thail-insure-item-right thail-insure-item-right-red">
                  {insureTotalPrice}
                </span>
              </div>
              <div className="thail-insure-item">
                <span className="thail-insure-item-left">数量：</span>
                <Stepper
                  value={state?.insureNum}
                  min={1}
                  max={3}
                  digits={0}
                  onChange={(value) => {
                    setState((item) => ({ ...item, insureNum: value }));
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
            </div> */}
            <div className="thail-introduce">
              <div className="thail-introduce-title">套餐介绍：</div>
              {state.thaliDetail?.joint_id > 0 ? (
                <div style={{ color: "red" }}>
                  <span
                    style={{ color: "red" }}
                    className="pack-intro-text-title"
                  >
                    温馨提示：
                  </span>
                  该单1分钟只能扫一次 10分钟3次 1个小时5次
                </div>
              ) : (
                <></>
              )}
              <div className="thail-introduce-content">
                首扫套餐：首次扫码授权成功，如不成功平台会自动化售后，卡数返还到您的账户点数余额，24小时内可以复扫限制5次。注意是以购买套餐时间起算，并非充值卡密时间。
              </div>
              <div className="thail-introduce-content">
                周卡套餐：首次扫码失败会自动返点，48小时内出现复扫失败可以售后，超时无售后。
              </div>
              <div className="thail-introduce-content">
                月卡套餐：首次扫码失败会自动返点，96小时内出现复扫失败可以售后，超时无售后。
              </div>
            </div>
          </Spin>
          <Picker
            columns={state?.basicColumns}
            visible={state?.basicShow}
            onClose={() => {
              setState((item) => ({ ...item, basicShow: false }));
            }}
            value={state?.activeThali}
            onConfirm={(v) => {
              confirmBasic(v);
            }}
          />
          <Picker
            columns={state?.insureColumns}
            visible={state?.insureShow}
            onClose={() => {
              setState((item) => ({ ...item, insureShow: false }));
            }}
            value={state?.insureValue}
            onConfirm={(v) => {
              setState((item) => ({ ...item, insureValue: v, insureNum: 1 }));
            }}
          />
        </div>
      }
      bottom={
        <div className="thali-config-bottom">
          <div className="thali-config-total-price">
            <span className="thali-config-total-price-title">总计：</span>
            <span className="thali-config-total-price-text">
              ￥{totalPrice}
            </span>
            <span className="thali-config-total-price-content">
              {/* ，交易安全险：{insureTotalPrice}，后面上线当前版本不上线 */}
              （套餐价格：{packTotal}）
            </span>
          </div>
          <div className="thali-config-payment-btn-box">
            <div className="thali-payment-btn" onClick={() => placeOrder()}>
              立即支付
            </div>
          </div>
        </div>
      }
    />
  );
}
