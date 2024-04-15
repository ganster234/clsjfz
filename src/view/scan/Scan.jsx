/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Table } from "antd";
import { Popup, Calendar } from "antd-mobile";
import dayjs from "dayjs";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import ScanSelect from "./components/ScanSelect";
import { getResidueHeightByDOMRect } from "../../utils/utils";
import { scanColumns } from "../../utils/columns";
import { getSanList } from "../../api/scan";

import "./Scan.less";
import "../../assets/css/Calendar.less";

export default function Scan() {
  const navigate = useNavigate();
  const [height, setHeight] = useState(0);
  const [scanLoading, setScanLoading] = useState(false); //加载
  const [dateScan, setDateScan] = useState(false); //data弹窗
  const [idShow, setIdShow] = useState(false); //input弹窗
  const [tableList, setTableList] = useState([]); //table数据
  const [total, setTotal] = useState(0); // 总条数
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });
  const [state, setState] = useState({
    dateList: [new Date(), new Date()],
    app_id: "", //app_id
    order_id: "", //order_id
    account: "", //account
  });
  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect());
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    getList();
  }, [JSON.stringify(tableParams), JSON.stringify(state.dateList)]);

  const getList = async (str) => {
    const { current, pageSize } = tableParams.pagination;
    const { dateList, app_id, order_id, account } = state;
    setScanLoading(true);
    let result = await getSanList({
      start_time:
        dateList[0] &&
        dayjs(str ? new Date() : dateList[0]).format("YYYY-MM-DD"),
      end_time:
        dateList[1] &&
        dayjs(str ? new Date() : dateList[1]).format("YYYY-MM-DD"),
      app_id: str ? "" : app_id,
      order_id: str ? "" : order_id,
      account: str ? "" : account,
      page: str ? 1 : current,
      limit: str ? 10 : pageSize,
    });
    const { code, data, msg } = result || {};
    message.destroy();
    if (code === 200) {
      setTableList([...data?.data]);
      setTotal(data?.total);
    } else {
      message.error(msg);
    }
    setScanLoading(false);
  };

  const changState = (item, str) => {
    if (str) {
      setState((data) => ({ ...data, [str]: item }));
    }
  };

  const reset = () => {
    const { pagination } = tableParams;
    setState({
      dateList: [new Date(), new Date()],
      app_id: "", //app_id
      order_id: "", //order_id
      account: "", //account
    });
    setIdShow(false);
    if (pagination.current === 1) {
      getList("reset");
    } else {
      setTableParams({
        pagination: {
          current: 1, //当前页码
          pageSize: 10, // 每页数据条数
        },
      });
    }
  };

  const searchBtn = () => {
    const { pagination } = tableParams;
    setIdShow(false);
    setTableList([]);
    if (pagination.current === 1) {
      getList();
    } else {
      setTableParams({
        pagination: {
          current: 1, //当前页码
          pageSize: 10, // 每页数据条数
        },
      });
    }
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setTableList([]);
    }
  };
  return (
    <>
      <LayoutPanel
        top={
          <div className="scan-top">
            <div className="scan-top-back-title">
              <img
                src={require("../../assets/image/back-icon.png")}
                alt=""
                className="scan-top-back"
                onClick={() => navigate(-1)}
              />
              扫码日志
              {/* <span className="scan-top-right-icon" onClick={() => getList()}>
                <img
                  src={require("../../assets/image/screen-icon.png")}
                  alt=""
                  className="scan-top-right-icon-img"
                />
                <span>筛选</span>
              </span> */}
            </div>
            <div className="scan-top-screen">
              <span
                className="scan-top-screen-item"
                onClick={() => setDateScan(true)}
              >
                <span>选择时间</span>
                <img
                  src={require("../../assets/image/triangle.png")}
                  alt=""
                  className="scan-screen-item-icon"
                />
              </span>
              <span
                className="scan-top-screen-item"
                onClick={() => setIdShow(true)}
              >
                <span>选择类型</span>
                <img
                  src={require("../../assets/image/triangle.png")}
                  alt=""
                  className="scan-screen-item-icon"
                />
              </span>
            </div>
          </div>
        }
        content={
          <div className="scan-content">
            <div className="scan-content-time">
              {dayjs(state?.dateList[0]).format("YYYY年MM月DD日")}-
              {dayjs(state?.dateList[1]).format("YYYY年MM月DD日")}
            </div>
            <div className="scan-content-table-box">
              <div className="scan-content-table-title">扫码日志</div>
              <Table
                scroll={{
                  x: 1500,
                  y: height,
                }}
                loading={scanLoading}
                pagination={{
                  ...tableParams.pagination,
                  total: total,
                  hideOnSinglePage: false,
                  showSizeChanger: true,
                }}
                rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
                rowKey={(record) => record.order_id}
                onChange={handleTableChange}
                columns={[...scanColumns]}
                dataSource={tableList}
              />
            </div>
            <Popup
              visible={idShow}
              destroyOnClose={true}
              onMaskClick={() => {
                setIdShow(false);
              }}
              onClose={() => {
                setIdShow(false);
              }}
              position="top"
              bodyStyle={{
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
                minHeight: "450px",
              }}
            >
              <ScanSelect
                data={state}
                changState={changState}
                reset={reset}
                searchBtn={searchBtn}
              />
            </Popup>
            <Popup
              visible={dateScan}
              destroyOnClose={true}
              onMaskClick={() => {
                setDateScan(false);
              }}
              onClose={() => {
                setDateScan(false);
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
          </div>
        }
      />
    </>
  );
}
