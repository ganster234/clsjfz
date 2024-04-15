import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, message } from "antd";
import { Calendar, Popup, Button, Input, Picker } from "antd-mobile";
import dayjs from "dayjs";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import { rechargeColumns } from "../../utils/columns";
import { getResidueHeightByDOMRect } from "../../utils/utils";
import { getRecharge } from "../../api/recharge";

import "../order/Order.less";
import "../open/Open.less";
import "./Recharge.less";
import "../../assets/css/Calendar.less";

// 充值列表
export default function Recharge() {
  const [goldWay, setGoldWay] = useState("-1"); //选中后的状态
  const [showGoldWay, setShowGoldWay] = useState(false); //状态查询框
  const goldColumns = [
    { value: "-1", label: "全部" },
    { value: "1", label: "支付成功" },
    { value: "0", label: "未支付" },
  ];

  const [visible, setVisible] = useState(false); //搜索弹框
  const [Fingerprintsearch, setFingerprintsearch] = useState(""); //用户名搜索
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rechargeShow, setRechargeShow] = useState(false);
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]);
  const [height, setHeight] = useState(0);
  const [state, setState] = useState({
    dateList: [new Date(), new Date()], //时间
  });
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });

  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect());
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    // 初始化数据包括后续更新
    getList();
  }, [JSON.stringify(tableParams)]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (tableParams.pagination.current === 1) {
      getList();
    } else {
      setTableParams({
        pagination: {
          current: 1, //当前页码
          pageSize: 10, // 每页数据条数
        },
      });
    }
  }, [state.dateList]);
  const getList = async () => {
    const { current, pageSize } = tableParams.pagination;
    const { dateList } = state;
    setLoading(true);
    let result = await getRecharge({
      status: goldWay,
      start_time: dayjs(dateList[0] || new Date()).format("YYYY-MM-DD"),
      end_time: dayjs(dateList[1] || new Date()).format("YYYY-MM-DD"),
      account: Fingerprintsearch,
      page: current,
      limit: pageSize,
    });
    const { code, msg, data } = result || {};
    // console.log(result);
    if (code === 200) {
      setDataList([...data?.data]);
      setTotal(data?.total);
    } else {
      message.destroy();
      message.error(msg);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (visible === false) {
      getList();
    }
  }, [visible]);
  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };
  return (
    <>
      <LayoutPanel
        top={
          <div className="recharge-top">
            <div className="recharge-top-back-title">
              <span className="recharge-top-back-box">
                <img
                  src={require("../../assets/image/back-icon.png")}
                  alt=""
                  className="recharge-top-back"
                  onClick={() => navigate(-1)}
                />
                <img
                  src={require("../../assets/image/home-icon.png")}
                  alt=""
                  className="recharge-top-back"
                  onClick={() => navigate("/mobile/home")}
                />
              </span>
              充值列表
            </div>
            <div className="recharge-top-screen">
              <span
                className="recharge-top-screen-item"
                onClick={() => setRechargeShow(true)}
              >
                <span>选择时间</span>
                <img
                  src={require("../../assets/image/triangle.png")}
                  alt=""
                  className="recharge-screen-item-icon"
                />
              </span>
              <span
                className="recharge-top-screen-item"
                onClick={() => setVisible(true)}
              >
                <span>账号名称搜索</span>
                <img
                  src={require("../../assets/image/triangle.png")}
                  alt=""
                  className="recharge-screen-item-icon"
                />
              </span>
              <span
                className="recharge-top-screen-item"
                onClick={() => setShowGoldWay(true)}
              >
                <span>状态查询</span>
                <img
                  src={require("../../assets/image/triangle.png")}
                  alt=""
                  className="recharge-screen-item-icon"
                />
              </span>
            </div>
          </div>
        }
        content={
          <div className="recharge-content">
            <div className="recharge-content-title">
              {dayjs(state?.dateList[0] || new Date()).format("YYYY年MM月DD日")}
              -
              {dayjs(state?.dateList[1] || new Date()).format("YYYY年MM月DD日")}
            </div>
            <div className="recharge-content-main">
              <div className="recharge-main-title">支付列表</div>
              <Table
                rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
                scroll={{
                  x: 1050,
                  y: height,
                }}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={{
                  ...tableParams.pagination,
                  total: total,
                  hideOnSinglePage: false,
                  showSizeChanger: true,
                }}
                onChange={handleTableChange}
                columns={[...rechargeColumns]}
                dataSource={dataList}
              />
            </div>
            <Popup
              visible={rechargeShow}
              destroyOnClose={true}
              onMaskClick={() => {
                setRechargeShow(false);
              }}
              onClose={() => {
                setRechargeShow(false);
              }}
              position="bottom"
              bodyStyle={{
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                minHeight: "40vh",
              }}
            >
              <div style={{ padding: "12px" }}>
                <Calendar
                  className="calendar-custom"
                  defaultValue={state?.dateList}
                  selectionMode="range"
                  onChange={(even) => {
                    if (even) {
                      setState((item) => ({ ...item, dateList: even }));
                    }
                  }}
                />
              </div>
            </Popup>

            {/* 搜索输入框 */}
            <Popup
              visible={visible}
              destroyOnClose={true}
              onMaskClick={() => {
                setVisible("");
              }}
              onClose={() => {
                setVisible("");
              }}
              position="bottom"
              bodyStyle={{
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                minHeight: "20vh",
              }}
            >
              <div style={{ padding: "12px" }}>
                <nav
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    size="mini"
                    onClick={() => {
                      setFingerprintsearch("");
                      setVisible(false);
                      setTableParams({
                        pagination: {
                          current: 1, //当前页码
                          pageSize: 10, // 每页数据条数
                        },
                      });
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    size="mini"
                    color="primary"
                    onClick={() => {
                      setVisible(false);
                      setTableParams({
                        pagination: {
                          current: 1, //当前页码
                          pageSize: 10, // 每页数据条数
                        },
                      });
                    }}
                  >
                    搜索
                  </Button>
                </nav>
                <div className="order-account-item-input">
                  <span className="order-account-item-title">账号名称</span>
                  <Input
                    clearable
                    value={Fingerprintsearch}
                    placeholder="输入相关账号名称"
                    style={{
                      "--font-size": "14px",
                      "--placeholder-color": "#BFBFBF",
                    }}
                    onChange={(even) => {
                      setFingerprintsearch(even);
                    }}
                  />
                </div>
              </div>
            </Popup>
            {/* 状态查询框 */}
            <Picker
              columns={[goldColumns]}
              visible={showGoldWay}
              onClose={() => {
                setShowGoldWay(false);
              }}
              onConfirm={() => {
                if (tableParams.pagination.current === 1) {
                  getList();
                } else {
                  setTableParams({
                    pagination: {
                      current: 1, //当前页码
                      pageSize: 10, // 每页数据条数
                    },
                  });
                }
              }}
              value={[goldWay]}
              onSelect={(v) => {
                setGoldWay(v[0]);
              }}
            />
          </div>
        }
      />
    </>
  );
}
