/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { Spin, message, Radio } from "antd";
import { Stepper, Picker } from "antd-mobile";
import useAppStore from "../../store";
// import { useNavigate } from "react-router-dom";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import ThaliConfigTop from "./components/ThaliConfigTop";
import { getPackDetail, getPlaceOrder, getkucun } from "../../api/thali";

import "./ThaliConfig.less";

// 在改图
export default function ThaliConfig() {
  //   const navigate = useNavigate();
  const userInfo = useAppStore((state) => state.userInfo); //用户信息
  const [scanOpenShow, setScanOpenShow] = useState(true); //选中open还是扫码账号
  const setThaliInfo = useAppStore((state) => state.setState); //设置套餐详情
  const thaliInfo = useAppStore((state) => state.thaliInfo); //套餐详情

  const [configLpading, setConfigLoading] = useState(false); //加载
  const [weeklyCardShow, setWeeklyCardShow] = useState(false); //选中周卡的15级号
  const [afterpitchons, setafterpitchons] = useState({}); //选中套餐后
  const [inventory, setinventory] = useState(0); //库存
  const [state, setState] = useState({
    thaliDetail: {}, //套餐detail
    basicShow: false, //显示picker
    basicColumns: [], //日卡周卡数组
    activeThali: [], //选中的日卡周卡
    packageNum: 0, //套餐数量
  });
  const Userid = sessionStorage.getItem("user");
  // 获取路径参数
  const hash = window.location.hash;
  const [path, queryString] = hash.split("?");
  const queryParams = new URLSearchParams(queryString);
  const querData = queryParams.get("data");
  ///////
  // 获取项目详情
  const getDetail = async () => {
    const { Device_Sid } = thaliInfo;
    if (!Device_Sid) {
      return;
    }
    setConfigLoading(true);
    let result = await getPackDetail({ Sid: Device_Sid });
    const { code, data, msg, money } = result || {};
    message.destroy();
    if (code) {
      // 日卡周卡月卡
      const valueList = money.map((item) => {
        const subItem = {
          ...item,
          label: item?.Device_name,
          value: item?.Device_id,
        };
        return subItem;
      });
      //初始化
      setState((item) => ({
        ...item,
        thaliDetail: data[0],
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
  useMemo(() => {
    setConfigLoading(true);
    let num = 0;
    console.log(state.activeThali, "state.activeThalistate.activeThali");
    const { activeThali } = state;
    if (activeThali[0] && activeThali.length > 0) {
      getkucun({
        Sid: state.thaliDetail?.Device_Sid,
        Type: activeThali[0],
      }).then((res) => {
        console.log(res, "resres");
        setConfigLoading(false);
        if (res.code) {
          setinventory(res.data[0]?.Device_kc);
        }
      });
    }
    return num;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeThali, scanOpenShow]);

  //总价
  const totalPrice = useMemo(() => {
    let price = 0.0;
    // console.log(packTotal, weeklyCardShow, "总计");
    if (afterpitchons.Device_money && state.packageNum > 0) {
      price = Number(afterpitchons.Device_money) * Number(state.packageNum);
    }
    return price.toFixed(2);
  }, [state.activeThali, state.packageNum]); //insureTotalPrice

  // 选中日周月数据后
  const confirmBasic = async (v) => {
    const { basicColumns } = state;

    if (basicColumns.length > 0) {
      const newArr = await basicColumns[0].filter((item) => {
        return item.value === v[0];
      });
      // console.log(basicColumns, newArr, v, "这是杀杀杀");
      setafterpitchons(newArr[0]);
      setState((item) => ({
        ...item,
        activeThali: v,
        packageNum: 1,
      }));
    }
  };

  //下单
  const placeOrder = async () => {
    const Type =
      afterpitchons.Device_id === "4" ? "2" : scanOpenShow ? "4" : "3";
    const Typename =
      Type === "1"
        ? "小程序"
        : Type === "2"
        ? "ck"
        : Type === "3"
        ? "扫码"
        : "";
    let param = {
      Userid, //用户sid
      Username: userInfo.Device_name, //用户名称
      Psid: state.thaliDetail.Device_Sid, //项目sid
      Pid: state.thaliDetail?.Device_appid, //项目id
      Pname: state.thaliDetail.Device_name, //项目名称
      Type, //提取项目id  1 open  2 ck  3 sm 4 xcx
      Typename, //提取项目名称
      Kc: inventory, //库存
      Dj: afterpitchons?.Device_money, //单价
      Gid: "", //分组id
      Gname: "", //分组名称
      Num: state.packageNum, //数量
      Pbid: afterpitchons?.Device_id, //卡结算单位id
      Pbname: afterpitchons?.Device_name, //卡结算单名名称
      Ly: JSON.parse(querData).Web === 1 ? "web" : "app", //来源app/web
      Lytype: "2", //来源 q:1 v:2
    };
    if (!afterpitchons?.Device_name) {
      message.warning("请选择套餐");
    } else if (state.packageNum === 0) {
      message.warning("套餐数量至少为一个");
    } else {
      setConfigLoading(true);
      let result = await getPlaceOrder(param);
      const { code, data, msg } = result || {};
      message.destroy();
      if (code === 200) {
        getDetail();
        setTimeout(() => {
          message.open({
            type: "success",
            content: "购买成功",
            duration: 5,
          });
        }, 800);
      } else {
        message.error(msg);
      }
      setConfigLoading(false);
    }
  };
  return (
    <LayoutPanel
      top={<ThaliConfigTop />}
      content={
        <div className="thali-config-content">
          <Spin spinning={configLpading}>
            <div className="thail-config-icon-box">
              <img
                src={state?.thaliDetail?.Device_url}
                alt=""
                className="thail-config-icon"
              />
            </div>
            <div className="thail-package-all">
              <div className="package-all-title">
                {state?.thaliDetail?.Device_name || "-"}
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
              {afterpitchons?.Device_id !== "4" && (
                <div className="thail-package-all-item">
                  <div className="package-item-left">类型：</div>
                  <div
                    className="package-item-right"
                    style={{
                      color: "#212121",
                    }}
                  >
                    <Radio.Group
                      onChange={(even) => setScanOpenShow(even.target.value)}
                      value={scanOpenShow}
                    >
                      <Radio value={false}>扫码</Radio>
                      <Radio value={true}>小程序</Radio>
                      {/* {state?.thaliData?.is_scan === 1 ? (
                      <Radio value={false}>扫码</Radio>
                    ) : (
                      <></>
                    )} */}
                    </Radio.Group>
                  </div>
                </div>
              )}

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
                  {inventory}
                </div>
              </div>
              <div className="thail-package-all-item">
                <div className="package-item-left">单价：</div>
                <div className="package-item-right">
                  {afterpitchons?.Device_money || 0}
                </div>
              </div>
              <div className="thail-package-all-item">
                <div className="package-item-left">总价：</div>
                <div className="package-item-right">{totalPrice}</div>
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
                日卡套餐： 有效期24小时。
                <span style={{ color: "red" }}>售后时效: 10小时</span>
              </div>
              <div className="thail-introduce-content">
                周卡套餐：首次扫码失败会自动返点，四天内出现复扫失败可以售后，超时无售后。
                <span style={{ color: "red" }}>售后时效: 4天</span>
              </div>
              <div className="thail-introduce-content">
                月卡套餐：首次扫码失败会自动返点，十五天内出现复扫失败可以售后，超时无售后。
                <span style={{ color: "red" }}>售后时效: 15天</span>
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
            onConfirm={(v, index) => {
              confirmBasic(v);
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
              （套餐价格：{totalPrice}）
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
