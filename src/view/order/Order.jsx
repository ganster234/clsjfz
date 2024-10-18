import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Popup, Button, Input } from "antd-mobile";
import { message, Table } from "antd";
import dayjs from "dayjs";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import { getOrderList } from "../../api/order";
import { orderColumns } from "../../utils/columns";
import { getResidueHeightByDOMRect } from "../../utils/utils";

import "./Order.less";
import "../../assets/css/Calendar.less";

export default function Order() {
  const navigate = useNavigate();
  const [timeOpen, setTimeOpen] = useState(false);
  const [orderAccountShow, setOrderAccountShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]); //数据
  const [height, setHeight] = useState(0);
  const [state, setState] = useState({
    timeList: [new Date(), new Date()], //开始以及结束时间
    order_id: "", //订单号
    account: "", //用户名
  });
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });

  //获取分组
  useEffect(() => {
    setHeight(getResidueHeightByDOMRect());
    //高度自适应
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    getOrder();
  }, [JSON.stringify(tableParams), JSON.stringify(state.timeList)]); // eslint-disable-line react-hooks/exhaustive-deps

  // 获取订单列表
  const getOrder = async (str) => {
    const { current, pageSize } = tableParams.pagination;
    const { timeList, order_id, account } = state;
    let parma = {
      // ...state,
      // order_id: str ? "" : order_id + "",
      // start_time: dayjs(str ? new Date() : timeList[0]).format("YYYY-MM-DD"),
      // end_time: dayjs(str ? new Date() : timeList[1]).format("YYYY-MM-DD"),
      // account: str ? "" : account + "",
      // page: current,
      // limit: pageSize,

      Username: str ? "" : account + "", //用户名
      Sid: str ? "" : order_id + "", //订单号
      Stime: dayjs(str ? new Date() : timeList[0]).format("YYYY-MM-DD"),
      Etime: dayjs(str ? new Date() : timeList[1]).format("YYYY-MM-DD"),
      Pagenum: current,
      Pagesize: pageSize,
    };
    setLoading(true);
    let result = await getOrderList(parma);
    const { code, data, msg, pagenum } = result || {};

    if (code) {
      setTotal(pagenum);
      setDataList([...data]);
    } else {
      message.error(msg);
    }
    setLoading(false);
  };
  const confirmDate = (str) => {
    const { pagination } = tableParams;
    if (pagination.current === 1 && pagination.pageSize === 10) {
      getOrder();
    } else {
      setTableParams((item) => ({
        ...item,
        pagination: {
          current: 1,
          pageSize: 10,
        },
      }));
    }
    if (str) {
      setTimeOpen(false);
    } else {
      setOrderAccountShow(false);
    }
  };

  const cancelDate = (str) => {
    const { pagination } = tableParams;
    setState((item) => ({
      timeList: [new Date(), new Date()], //开始以及结束时间
      order_id: "", //订单号
      account: "", //用户名
    }));
    if (pagination.current === 1 && pagination.pageSize === 10) {
      getOrder("str");
    } else {
      setTableParams((item) => ({
        ...item,
        pagination: {
          current: 1,
          pageSize: 10,
        },
      }));
    }
    if (str) {
      setTimeOpen(false);
    } else {
      setOrderAccountShow(false);
    }
  };

  //切换分页
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
          <div className="order-top">
            <div className="order-top-back-box">
              <img
                src={require("../../assets/image/back-icon.png")}
                alt=""
                className="order-input-back"
                onClick={() => navigate(-1)}
              />
              <span className="order-top-back-content">订单列表</span>
            </div>
            <div className="order-top-search">
              <div className="order-top-search-item">
                <span onClick={() => setTimeOpen(true)}>选择时间</span>
                <img
                  onClick={() => setTimeOpen(true)}
                  src={require("../../assets/image/triangle.png")}
                  alt=""
                  className="order-top-search-icon"
                />
              </div>
              <div className="order-top-search-item">
                <span onClick={() => setOrderAccountShow(true)}>订单号</span>
                <img
                  src={require("../../assets/image/triangle.png")}
                  alt=""
                  className="order-top-search-icon"
                  onClick={() => setOrderAccountShow(true)}
                />
              </div>
              <div className="order-top-search-item">
                <span onClick={() => setOrderAccountShow(true)}>用户名</span>
                <img
                  src={require("../../assets/image/triangle.png")}
                  alt=""
                  onClick={() => setOrderAccountShow(true)}
                  className="order-top-search-icon"
                />
              </div>
            </div>
          </div>
        }
        content={
          <div className="order-content">
            <div className="order-content-main">
              <div className="order-content-title">订单列表</div>
              <Table
                rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
                scroll={{
                  x: 2400,
                  y: height,
                }}
                rowKey={(record) => record.Device_Sid}
                loading={loading}
                pagination={{
                  ...tableParams.pagination,
                  total: total,
                  hideOnSinglePage: false,
                  showSizeChanger: true,
                }}
                onChange={handleTableChange}
                columns={[
                  ...orderColumns,
                  {
                    title: "状态",
                    dataIndex: "Device_use",
                    render: (record) => (
                      <span
                        style={{
                          color: record === "0" ? "#327DFC" : "# 666666",
                        }}
                      >
                        {record === "0" ? "未使用" : "已使用"}
                      </span>
                    ),
                  },
                  {
                    title: "自动售后",
                    dataIndex: "Device_sh",
                    render: (record) => (
                      <span
                        style={{
                          color: record === "1" ? "#666666" : "#12C3B1",
                        }}
                      >
                        {record === 1 ? "未售后" : "已售后"}
                      </span>
                    ),
                  },
                  // {
                  //   title: "备注",
                  //   width: 200,
                  //   dataIndex: "remark",
                  //   render: (record) => <span>{record ? record : "-"}</span>,
                  // },
                ]}
                dataSource={dataList}
              />
            </div>
            <Popup
              visible={timeOpen}
              destroyOnClose={true}
              onMaskClick={() => {
                setTimeOpen(false);
              }}
              onClose={() => {
                setTimeOpen(false);
              }}
              position="bottom"
              bodyStyle={{
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                minHeight: "40vh",
              }}
            >
              <div style={{ padding: "12px" }}>
                {/* <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button size="mini" onClick={() => cancelDate("date")}>
                    重置
                  </Button>
                  <Button
                    size="mini"
                    color="primary"
                    onClick={() => confirmDate("date")}
                  >
                    搜索
                  </Button>
                </div> */}
                <Calendar
                  className="calendar-custom"
                  defaultValue={state?.timeList}
                  selectionMode="range"
                  onChange={(even) => {
                    if (even) {
                      setState((item) => ({ ...item, timeList: even }));
                    }
                  }}
                />
              </div>
            </Popup>
            <Popup
              visible={orderAccountShow}
              destroyOnClose={true}
              onMaskClick={() => {
                setOrderAccountShow(false);
              }}
              onClose={() => {
                setOrderAccountShow(false);
              }}
              position="bottom"
              bodyStyle={{
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                minHeight: "34vh",
              }}
            >
              <div className="order-account-box">
                <div className="order-account-btn">
                  <Button size="mini" onClick={() => cancelDate("")}>
                    重置
                  </Button>
                  <Button
                    size="mini"
                    color="primary"
                    onClick={() => confirmDate("")}
                  >
                    搜索
                  </Button>
                </div>
                <div className="order-account-item-input">
                  <span className="order-account-item-title">用户名</span>
                  <Input
                    value={state?.account}
                    placeholder="请输入用户名"
                    style={{
                      "--font-size": "14px",
                      "--placeholder-color": "#BFBFBF",
                    }}
                    onChange={(even) => {
                      setState((item) => ({ ...item, account: even }));
                    }}
                  />
                </div>
                <div className="order-account-item-input">
                  <span className="order-account-item-title">订单号</span>
                  <Input
                    value={state?.order_id}
                    placeholder="请输入订单号"
                    style={{
                      "--font-size": "14px",
                      "--placeholder-color": "#BFBFBF",
                    }}
                    onChange={(even) => {
                      setState((item) => ({ ...item, order_id: even }));
                    }}
                  />
                </div>
              </div>
            </Popup>
          </div>
        }
      />
    </>
  );
}
